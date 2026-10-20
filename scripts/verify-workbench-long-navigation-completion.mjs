import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='docs/planning/workbench-long-navigation-rev2',ui='docs/planning/workbench-long-navigation-empty-ui-rev1',native='docs/planning/workbench-long-parity-rev2';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const receipt=read(root+'/receipt.json'),original=read(native+'/receipt.json');
for(const s of receipt.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
assert.equal(new Set(receipt.results.map(r=>r.program)).size,32);
assert.deepEqual(receipt.results.map(r=>r.program).sort(),original.results.map(r=>r.program).sort());
let prefixes=0,events=0,reads=0,inherited=0,fresh=0;
for(const r of receipt.results){
 assert.equal(sha(fs.readFileSync(r.path)),r.sha256,r.path);
 const rows=read(r.path);prefixes+=rows.length;
 const n=original.results.find(x=>x.program===r.program),bytes=fs.readFileSync(native+'/'+n.path);
 assert.equal(sha(bytes),n.sha256);const nativeRows=JSON.parse(bytes).prefixes;
 assert.equal(rows.length,nativeRows.length);
 for(const [i,row]of rows.entries()){
  assert.equal(row.prefix,i);assert.deepEqual(row.identity,row.participation.identity);
  for(const [key,value]of Object.entries(row.identity))assert.equal(value,nativeRows[i][key]);
  events+=row.eventChecks;reads+=row.readChecks;
 }
 if(r.inherited)inherited++;else fresh++;
}
assert.deepEqual({prefixes,events,reads,inherited,fresh},{prefixes:513,events:69377,reads:44347,inherited:28,fresh:4});
const b=read(ui+'/browser.json'),empty=receipt.results.find(r=>r.program==='empty'),n=read(empty.native).prefixes[0];
const keys=['modelHash','runHash','stateHash','saveHash','outputsHash','traceHash','observerHash'];
assert.equal(b.timeline.status,'LONG prefix 0 · clock 0 · Complete');
assert.equal(b.timeline.empty,'No committed events at this prefix.');
assert.equal(b.timeline.selectors,0);assert.equal(b.timeline.stepEnabled,false);assert.equal(b.timeline.runEnabled,false);
assert.deepEqual(b.timeline.hashes,keys.map(k=>n[k]));assert.deepEqual(b.after,b.timeline.hashes);
assert.deepEqual(b.participation,read(empty.path)[0].participation);assert.deepEqual(b.alerts,[]);
const artifacts=[root+'/receipt.json',ui+'/browser.json',ui+'/empty.png','scripts/verify-workbench-long-navigation-completion.mjs'].map(path=>({path,sha256:sha(fs.readFileSync(path))}));
fs.writeFileSync(ui+'/receipt.json',JSON.stringify({status:'PASS LONG COMPLETE NAVIGATION CENSUS AND BOUNDED EMPTY BROWSER',artifacts,counts:{programs:32,prefixes,events,reads,inherited,fresh},scope:'Independent saved-result and native-identity join across all original programs; no fresh runtime re-execution. Empty browser Timeline has no stale selector, disabled advance controls and native seven hashes. Architecture report equals qualified participation including four present zero-activity paths; navigation preserves hashes. No all-program browser, canonical-box, causal-effect, successor or complete Workbench acceptance claim.'},null,2)+'\n',{flag:'wx'});
console.log('PASS LONG navigation 32 programs / 513 prefixes and empty browser');
