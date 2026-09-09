import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),path='docs/planning/CAMPAIGN2_VAL_A_W_QUALIFICATION_CROSSWALK.md';
const body=fs.readFileSync(new URL(path,root),'utf8'),vectors=[...body.matchAll(/^\| (VAL-[A-W]) \|/gm)].map(m=>m[1]);
assert.deepEqual(vectors,Array.from({length:23},(_,i)=>`VAL-${String.fromCharCode(65+i)}`));
const links=[...body.matchAll(/\]\(([^)]+\.json)\)/g)].map(m=>m[1]);
for(const link of links)assert(fs.existsSync(new URL('docs/planning/'+link,root)),link);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}});
try{
 const {firstTraceModel}=await server.ssrLoadModule('/src/campaign2/firstTraceModel.ts');
 const {decodeCampaign2}=await server.ssrLoadModule('/src/campaign2/codecs.ts');
 const counts={'265':0,'266':0,'278':0};
 function visit(v){if(typeof v==='boolean')return;if(v.kind==='record'){if(String(v.schema.typeId) in counts)counts[String(v.schema.typeId)]++;for(const x of v.fields.values())visit(x);}else if(v.kind==='list'||v.kind==='set')v.items.forEach(visit);else if(v.kind==='map')for(const [k,x] of v.entries){visit(k);visit(x);}}
 visit(decodeCampaign2(firstTraceModel().registry));assert(counts['265']>0&&counts['278']>0);assert.equal(counts['266'],0);
 const report={status:'INVENTORY CHECK ONLY',vectors,linkedReports:links,actualFirstProfileRoleRecords:counts,limits:['Counts actual declaration records, not schema descriptors or numeric mentions.','No behavioral qualification or proof that an unrepresented branch executes.','VAL-V scope ruling remains pending.']};
 fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_VAL_CROSSWALK_AUDIT.json',root),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{await server.close();}
