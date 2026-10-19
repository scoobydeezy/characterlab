import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='docs/planning/workbench-long-parity-rev2';
const sha=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
const receipt=read(root+'/receipt.json'),continuation=read(root+'/continuation.json');
assert.equal(receipt.status,'PASS LONG SOURCE PARITY AND CONTINUATION');
assert(!fs.existsSync(root+'/failure.json'));
for(const source of receipt.sources){
 assert.equal(sha(fs.readFileSync(source.path)),source.sha256,source.path);
 assert.equal(sha(fs.readFileSync(root+'/sources/'+source.path)),source.sha256,source.path+' frozen');
}
const catalog=read(root+'/sources/src/workbench/longCatalog.json');
const publicRuns=[0,1,2].flatMap(i=>read(root+`/sources/docs/planning/LONGITUDINAL_PUBLIC_RUNS_REV2_PART${i}.json`).results);
const probes=read(root+'/sources/docs/planning/LONGITUDINAL_EXECUTION_PROBE_REV1.json').results;
assert.equal(catalog.programs.length,32);assert.equal(receipt.results.length,32);
assert.equal(new Set(receipt.results.map(r=>r.program)).size,32);
assert.equal(continuation.inherited.length,17);
let prefixes=0,observerJoins=0,inheritedPrefixes=0,freshPrefixes=0;
const verified=[];
for(const [index,result] of receipt.results.entries()){
 const bytes=fs.readFileSync(root+'/'+result.path);assert.equal(sha(bytes),result.sha256);
 const record=JSON.parse(bytes),program=catalog.programs[index];
 assert.equal(result.program,program.name);assert.equal(record.program,program.name);
 assert.equal(record.model,program.model);assert.equal(record.cohort,program.cohort);
 const originals=(program.cohort==='public'?publicRuns:probes).filter(r=>r.name===program.originalName);
 assert.equal(originals.length,1);const original=originals[0];
 assert.equal(record.prefixes.length,original.prefixes.length);assert.equal(result.prefixes,record.prefixes.length);
 const model=catalog.models.find(m=>m.name===program.model);assert(model);
 let priorEvents=0;
 for(const [prefix,p]of record.prefixes.entries()){
  assert.equal(p.prefix,prefix);assert.equal(p.saveHash,original.prefixes[prefix]);
  assert.equal(p.clock,original.views[prefix].at);
  assert.equal(p.modelHash,sha(Buffer.from(model.modelIdentity,'hex')));
  assert.equal(p.runHash,record.prefixes[0].runHash);
  for(const k of ['modelHash','runHash','stateHash','saveHash','outputsHash','traceHash','observerHash'])assert.match(p[k],/^[0-9a-f]{64}$/);
  assert(Number.isSafeInteger(p.events)&&p.events>=priorEvents);priorEvents=p.events;
  if(program.cohort==='public'){assert.equal(p.observerHash,original.views[prefix].viewSha256);observerJoins++;}
  prefixes++;
 }
 if(program.cohort==='public')assert.equal(record.prefixes.at(-1).saveHash,original.terminalSaveSha256);
 if(index<17){
  const inherited=continuation.inherited[index];assert.deepEqual(result,inherited);
  assert.equal(sha(fs.readFileSync(inherited.inheritedFrom)),result.sha256);
  inheritedPrefixes+=record.prefixes.length;
 }else{assert.equal(result.inheritedFrom,undefined);freshPrefixes+=record.prefixes.length;}
 verified.push({path:root+'/'+result.path,sha256:result.sha256,program:program.name,prefixes:record.prefixes.length,origin:index<17?'retained completed program':'continuation execution'});
}
assert.equal(prefixes,513);assert.equal(observerJoins,462);assert.equal(inheritedPrefixes,289);assert.equal(freshPrefixes,224);
const inputs=[root+'/receipt.json',root+'/continuation.json','scripts/verify-workbench-long-parity.mjs'].map(path=>({path,sha256:sha(fs.readFileSync(path))}));
fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS LONG RETAINED EVIDENCE VERIFICATION',inputs,sources:receipt.sources,verified,counts:{programs:32,prefixes,publicPrograms:29,executionProbes:3,historicalObserverJoins:observerJoins,inheritedPrograms:17,inheritedPrefixes,continuationPrograms:15,continuationPrefixes:freshPrefixes},scope:'Independent saved-artifact verification, not a new native execution. Every source/current and frozen hash, output hash, catalog order, model identity, historical save and public observer hash checked. Per-prefix native parity and restore/next-or-terminal assertions are supplied by the inspected original/continuation writers before each program file is written; this verifier does not rerun those operations. Probe observer equality is native-only, not an unavailable historical observer-hash claim. Browser, successors, language and full Workbench acceptance remain separate.'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',programs:32,prefixes,observerJoins,inheritedPrefixes,freshPrefixes,sources:receipt.sources.length}));
