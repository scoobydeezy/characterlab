import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gzipSync,gunzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-general-read-history-rev1',parent='docs/planning/workbench-general-comparison-cohort-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const receipt=read(parent+'/receipt.json');assert.equal(receipt.status,'PASS FROZEN GENERAL COMPARISON COHORT');assert.equal(receipt.counts.models,43);assert.equal(receipt.counts.modelPrefixes,568);
for(const e of receipt.nativeEvidence)assert.equal(sha(fs.readFileSync(e.path)),e.sha256);
const paths=['src/workbench/stateReadHistory.ts','src/workbench/StateReadHistoryPanel.tsx','src/workbench/CausalHistoryPanel.tsx','src/workbench/GeneralWorkbench.tsx','src/workbench/contracts.ts','scripts/check-workbench-general-read-history.mjs'];
const sources=paths.map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return {path:p,sha256:sha(bytes)};});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});let prefixes=0,eventObservations=0,readObservations=0;const relations={},results=[];
try{
 const {recordedStateReadHistory:inspect}=await server.ssrLoadModule('/src/workbench/stateReadHistory.ts');
 for(const [index,entry] of receipt.models.entries()){
  const bytes=fs.readFileSync(parent+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);const decoded=gunzipSync(bytes);assert.equal(sha(decoded),entry.decodedSha256);const snapshots=JSON.parse(decoded),stable=new Map(),rows=[];assert.equal(snapshots.length,entry.prefixes);
  for(const s of snapshots){
   const before=JSON.stringify(s),histories=[];
   for(let i=0;i<s.timeline.length;i++){
    const e=s.timeline[i],h=inspect(s.timeline,e.id);assert.equal(h.reads.length,e.reads.length);
    for(let k=0;k<e.reads.length;k++){
     const r=e.reads[k];let expected=null;
     for(let j=i-1;j>=0&&!expected;j--){const d=s.timeline[j].diffs.find(d=>d.path===r.path);if(d){const {id,instant,phase,stage}=s.timeline[j];expected={event:{id,instant,phase,stage},before:d.before,after:d.after,changed:d.changed};}}
     assert.deepEqual(h.reads[k],{ordinal:k,...r,priorMutation:expected,relation:expected?(expected.after===r.exact?'exact-value-match':'value-mismatch'):'no-prior-recorded-mutation'});relations[h.reads[k].relation]=(relations[h.reads[k].relation]??0)+1;readObservations++;
    }
    if(stable.has(e.id))assert.deepEqual(h,stable.get(e.id));stable.set(e.id,h);histories.push(h);eventObservations++;
   }
   assert.equal(JSON.stringify(s),before);rows.push({prefix:s.prefix,runHash:s.runHash,saveHash:s.saveHash,histories});prefixes++;
  }
  const filename=`model-${String(index).padStart(2,'0')}.json.gz`,out=gzipSync(JSON.stringify({recipe:entry.recipe,rows}),{level:9});assert(out.length<50000000);fs.writeFileSync(root+'/'+filename,out,{flag:'wx'});results.push({recipe:entry.recipe,path:filename,sha256:sha(out),source:parent+'/'+entry.path,sourceSha256:sha(bytes),prefixes:rows.length});
  console.log(`PASS General read history ${index+1}/43`);
 }
 assert.equal(prefixes,568);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL FROZEN GENERAL STATE-READ HISTORY',models:results.length,prefixes,eventObservations,readObservations,relations,parent:{path:parent+'/receipt.json',sha256:sha(fs.readFileSync(parent+'/receipt.json'))},sources,results,scope:'All43 original General models/568 frozen-seed prefixes from immutable native-qualified captures. Independent reverse scan verifies every retained read relation and historical stability. Missing prior mutations and derived-source metadata remain unresolved; no causal necessity or observer-language claim. Counts repeat historical reads at later prefixes.'},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:'PASS',models:results.length,prefixes,eventObservations,readObservations,relations}));
}finally{await server.close();}
