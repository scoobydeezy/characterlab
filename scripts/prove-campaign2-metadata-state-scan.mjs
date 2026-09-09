import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),hash=b=>createHash('sha256').update(b).digest('hex');
const paths=['src/campaign2/adaptationRuntime.ts','src/campaign2/factory.ts','src/test/fixtures/campaign2PopulatedMetadata.ts'];
const fingerprints=paths.map(path=>({path,sha256:hash(fs.readFileSync(new URL(path,root)))}));
// Deliberately wrong derivation: recursively collects every typed identity in authoritative state.
// This executes in an isolated module transform; production files are never modified.
const replacement=`randomRelevantAuthoritativeIds:state=>{const found=new Map();const scan=v=>{if(typeof v==='boolean')return;if(v.kind==='typedIdentifier'){found.set(key(v),v);scan(v.payload);}else if(v.kind==='record'){for(const x of v.fields.values())scan(x);}else if(v.kind==='map'){for(const [k,x] of v.entries){scan(k);scan(x);}}else if(v.kind==='set'||v.kind==='list'){for(const x of v.items)scan(x);}};scan(state.canonicalValue());return list([...found.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([,v])=>v));}`;
const results=[];
for(const target of [undefined,...paths.slice(0,2)]){
 let transformed=0;
 const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},plugins:[{name:'metadata-state-scan-control',enforce:'pre',transform(code,id){
  if(target&&id.replaceAll('\\','/').endsWith('/'+target)){const site='randomRelevantAuthoritativeIds:()=>list([])';assert.equal(code.split(site).length-1,1);transformed++;return code.replace(site,replacement);}
 }}]});
 try{const assay=await server.ssrLoadModule('/src/test/fixtures/campaign2PopulatedMetadata.ts');const cases=await assay.populatedMetadata(),differences=cases.filter(c=>!c.agrees);
  assert.equal(cases.length,4);if(target){assert.equal(transformed,1);assert(differences.length>0);}else assert.equal(differences.length,0);
  results.push({target:target??'baseline',status:target?'DETECTED':'PASS',cases});
 }finally{await server.close();}
}
for(const p of fingerprints)assert.equal(hash(fs.readFileSync(new URL(p.path,root))),p.sha256);
const report={status:'COMPONENT PASS',sourceFingerprints:fingerprints,results,scope:['PERSIST-D all-state-ID scan: populated admitted displacement state, exact empty metadata and restore.','Save and restore derivations independently substituted.','Not PERSIST-I: no accepted stochastic consumer is added or claimed.','No whole PERSIST, VAL, factory or Campaign-2 verdict.']};
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_METADATA_STATE_SCAN_PROOF.json',root),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(results));
