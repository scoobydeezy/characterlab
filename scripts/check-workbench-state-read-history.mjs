import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gzipSync,gunzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-state-read-history-rev1',parent='docs/planning/workbench-values-causal-rev2',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const parentBytes=fs.readFileSync(parent+'/receipt.json'),receipt=JSON.parse(parentBytes);assert.equal(receipt.programs,125);assert.equal(receipt.prefixes,625);assert.equal(receipt.status,'PASS FULL RETAINED VALUES RECORDED-ANCESTRY COHORT');
const paths=['src/workbench/stateReadHistory.ts','src/workbench/StateReadHistoryPanel.tsx','src/workbench/CausalHistoryPanel.tsx','src/workbench/contracts.ts','src/test/workbenchStateReadHistory.test.ts','scripts/check-workbench-state-read-history.mjs'];
const sources=paths.map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return {path:p,sha256:sha(bytes)};});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
let prefixes=0,events=0,reads=0;const relations={},results=[];
try{
 const {recordedStateReadHistory:inspect}=await server.ssrLoadModule('/src/workbench/stateReadHistory.ts');
 for(const entry of receipt.results){
  const bytes=fs.readFileSync(parent+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);assert.equal(sha(fs.readFileSync(entry.referencePath)),entry.referenceSha256);
  const data=JSON.parse(gunzipSync(bytes)),rows=[],stable=new Map();assert.equal(data.timeline.length,52);
  for(const prefix of data.rows){
   const timeline=data.timeline.slice(0,prefix.prefix*13),histories=[];const before=JSON.stringify(timeline);
   for(let i=0;i<timeline.length;i++){
    const e=timeline[i],h=inspect(timeline,e.id);assert.equal(h.reads.length,e.reads.length);
    for(let k=0;k<e.reads.length;k++){
     const r=e.reads[k],actual=h.reads[k];let expected=null;
     for(let j=i-1;j>=0&&!expected;j--){const d=timeline[j].diffs.find(d=>d.path===r.path);if(d){const {id,instant,phase,stage}=timeline[j];expected={event:{id,instant,phase,stage},before:d.before,after:d.after,changed:d.changed};}}
     assert.deepEqual(actual,{ordinal:k,...r,priorMutation:expected,relation:expected?(expected.after===r.exact?'exact-value-match':'value-mismatch'):'no-prior-recorded-mutation'});
     relations[actual.relation]=(relations[actual.relation]??0)+1;reads++;
    }
    if(stable.has(e.id))assert.deepEqual(h,stable.get(e.id));stable.set(e.id,h);histories.push(h);events++;
   }
   assert.equal(JSON.stringify(timeline),before);rows.push({prefix:prefix.prefix,runHash:prefix.runHash,saveHash:prefix.saveHash,histories});prefixes++;
  }
  const filename=`run-${entry.index}.json.gz`,out=gzipSync(JSON.stringify({index:entry.index,rows}),{level:9});assert(out.length<50000000);fs.writeFileSync(root+'/'+filename,out,{flag:'wx'});results.push({index:entry.index,path:filename,sha256:sha(out),source:parent+'/'+entry.path,sourceSha256:sha(bytes)});
 }
 assert.equal(results.length,125);assert.equal(prefixes,625);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 const result={status:'PASS FULL VALUES RETAINED STATE-READ HISTORY',programs:results.length,prefixes,eventObservations:events,readObservations:reads,relations,parent:{path:parent+'/receipt.json',sha256:sha(parentBytes)},sources,results,scope:'All retained events at every original Values prefix; independent reverse scan, exact prior mutation/value relation, immutable inputs and historical stability. Missing mutation remains unresolved, and projection-derived sources/payload causality are not qualified. Counts repeat historical reads at later prefixes.'};
 fs.writeFileSync(root+'/receipt.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({...result,sources:undefined,results:undefined}));
}finally{await server.close();}
