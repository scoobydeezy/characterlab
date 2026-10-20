import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-task-sources-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/DispositionReasonPanel.tsx','src/campaign2/cognitiveTransforms.ts','src/campaign3/identityPublicMath.ts','scripts/check-workbench-disposition-task-sources.mjs',prior+'/receipt.json','docs/planning/workbench-disposition-factors-rev1/receipt.json'])visit(p);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {dispositionTaskSources:inspect}=await server.ssrLoadModule('/src/workbench/dispositionTaskSources.ts'),artifacts=new Map(read(prior+'/receipt.json').artifacts.map(a=>[a.path,a.sha256]));
 let events=0,emitted=0,rows=0,baseSignals=0,situationalSignals=0,unavailableResponses=0;const results=[];
 for(let program=0;program<15;program++){
  const file=`snapshot-${program}-18.json.gz`,bytes=fs.readFileSync(prior+'/'+file);assert.equal(sha(bytes),artifacts.get(file));const s=JSON.parse(gunzipSync(bytes)),reports=[];
  for(const e of s.timeline.filter(e=>e.stage==='reasons')){
   const before=JSON.stringify(e),r=inspect(e,s.seamVersion);assert.equal(JSON.stringify(e),before);reports.push(r);events++;if(!r.emitted)continue;emitted++;
   const reasons=JSON.parse(e.output)[1],raw=reasons['Raw [4]'],options=raw['CandidateOptions [2]'],motive=options['MotiveContext [2]'],actual=raw['Signals [3]'];
   for(const row of r.rows){
    const task=JSON.parse(row.task),m= motive['Motives [3]'].find(m=>JSON.stringify(m['TaskCommitmentKey [1]'])===row.task);assert(m);assert.equal(row.basePressure,m['RawPressure [2]']);assert.equal(row.motiveState,'present');
    const response=motive['Concern [2]']['Responses [3]'].find(v=>JSON.stringify(v['TaskCommitmentKey [1]'])===JSON.stringify(task))['Response [2]'];assert.equal(response['VariantTag [1]'],'1');assert.equal(row.responseState,'unavailable');assert.equal(row.responseIntensity,null);unavailableResponses++;
    for(const link of row.links){const match=actual.filter(v=>JSON.stringify(v['Key [1]'])===link.sourceKey);assert.equal(match.length,link.emitted?1:0);if(match.length)assert.equal(match[0]['SignedStrength [2]'],link.emitterValue);if(link.emitted){link.role==='base'?baseSignals++:situationalSignals++;}}
    rows++;
   }
   for(const m of r.meanings){const pair=raw['NonIdentitySemanticPressure [4]'].find(([k])=>JSON.stringify(k)===m.candidate);assert(pair);assert.equal(m.nonIdentitySemanticPressure,pair[1]);}
   if(program===0&&e.instant==='1'){
    const mutate=fn=>{const copy=structuredClone(e),out=JSON.parse(copy.output),reason=out[1],raw=reason['Raw [4]'],options=raw['CandidateOptions [2]'];fn(options);reason['Options [3]']=options;reason['Reasons [5]']['RawSignalContext [2]']=raw;out[0]['Reasons [8]']=reason;copy.output=JSON.stringify(out);return copy;};
    const scalarZero=mutate(o=>o['MotiveContext [2]']['Concern [2]']['Responses [3]'][0]['Response [2]']={record:'TaskConcernResponse#386/1','VariantTag [1]':'2','Intensity [2]':'0/1'}),z=inspect(scalarZero,s.seamVersion);
    assert.equal(z.rows[0].responseState,'scalar');assert.equal(z.rows[0].responseIntensity,'0/1');assert.equal(z.rows[0].links[1].emitted,false);assert.notDeepEqual(z,r);
    assert.throws(()=>inspect(mutate(o=>o['MotiveContext [2]']['Motives [3]'][0]['RawPressure [2]']='3/1'),s.seamVersion),/strength mismatch/);
    assert.throws(()=>inspect(e,'other'),/profile/);
   }
  }
  assert.equal(reports.length,18);const filename=`program-${program}.json.gz`,saved=gzipSync(JSON.stringify(reports)+'\n');fs.writeFileSync(root+'/'+filename,saved,{flag:'wx'});results.push({program,path:filename,sha256:sha(saved),snapshot:{path:prior+'/'+file,sha256:sha(bytes)}});console.log(`PASS task sources ${program+1}/15`);
 }
 assert.equal(events,270);assert.equal(emitted,250);assert.equal(rows,500);assert.equal(baseSignals,500);assert.equal(situationalSignals,0);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS DISPOSITION TASK SOURCE PROVENANCE',sources,results,counts:{programs:15,events,emitted,rows,baseSignals,situationalSignals,unavailableResponses},scope:'All unique reasons events from15 authenticated original terminal snapshots; candidate/task/motive/response/raw-signal and non-identity semantic-pressure joins. Original corpus has500 unavailable responses and no situational signals. Synthetic reader-only scalar-zero control remains distinct without claiming new native admission. Changed motive and unknown version reject. No known nonzero-response/forecast-native coverage, observer language or integrated-entry claim.'},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({events,emitted,rows,baseSignals,situationalSignals,unavailableResponses}));
}finally{await server.close();}
