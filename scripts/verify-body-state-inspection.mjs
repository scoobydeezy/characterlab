import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-body-state-inspection-rev2',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const receipt=read(root+'/receipt.json'),native=read('docs/planning/workbench-body-parity-rev1/receipt.json');
assert.equal(receipt.status,'PASS BODY STATE INSPECTION');assert.equal(receipt.results.length,16);
assert.deepEqual(receipt.sources,read(root+'/manifest.json').sources);
for(const s of receipt.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
let prefixes=0,fields=0,events=0,reads=0,mutations=0,changes=0,historicalEvents=0;
for(const entry of receipt.results){
 const bytes=fs.readFileSync(root+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);
 const record=JSON.parse(bytes),artifact=native.results.find(r=>r.program===entry.program);assert(artifact);
 const originalBytes=fs.readFileSync('docs/planning/workbench-body-parity-rev1/'+artifact.path);assert.equal(sha(originalBytes),artifact.sha256);const original=JSON.parse(originalBytes);
 assert.equal(record.program,entry.program);assert.equal(record.snapshots.length,original.prefixes.length);
 const terminal=new Map(record.snapshots.at(-1).timeline.map(e=>[e.id,JSON.stringify(e)])),seen=new Set();
 for(const [i,s]of record.snapshots.entries()){
  assert.equal(s.prefix,i);for(const key of ['modelHash','runHash','stateHash','saveHash','outputsHash','traceHash'])assert.equal(s[key],original.prefixes[i][key]);
  assert.equal(new Set(s.fields.map(f=>f.path)).size,s.fields.length);prefixes++;fields+=s.fields.length;
  for(const e of s.timeline){assert.equal(JSON.stringify(e),terminal.get(e.id));if(seen.has(e.id)){historicalEvents++;continue;}
   seen.add(e.id);events++;reads+=e.reads.length;mutations+=e.diffs.length;changes+=e.diffs.filter(d=>d.changed).length;}
 }
}
assert.deepEqual(receipt.counts,{programs:16,prefixes,fields,events,reads,mutations,changes,historicalEvents});assert.equal(prefixes,79);
fs.writeFileSync(root+'/acceptance.json',JSON.stringify({status:'PASS INDEPENDENT BODY STATE RECONCILIATION',counts:receipt.counts,sourceHoldReleased:true,
 receipt:{path:root+'/receipt.json',sha256:sha(fs.readFileSync(root+'/receipt.json'))},scope:'All archived native save commitments,event identities/history and counts independently reconciled. Exact field/search and renderer equality belong to the frozen writer. Browser lifecycle and full entry remain separate.'},null,2)+'\n',{flag:'wx'});
console.log('PASS independent16/79 state inspection; source hold released');
