import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-body-state-inspection-rev2',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const b=read(root+'/browser.json'),native=read(root+'/program-00.json');assert.equal(native.program,'baseline');
for(const [key,prefix]of [['initial',0],['terminal',6]]){
 const s=native.snapshots[prefix],v=b[key];
 assert.deepEqual(v.hashes,['modelHash','runHash','stateHash','saveHash','outputsHash','traceHash'].map(k=>s[k]));assert.deepEqual(v.afterHashes,v.hashes);
 const selected=s.fields.find(f=>f.path===v.selection.path);assert(selected);assert.equal(v.selection.value,selected.exact);
}
assert.equal(b.noMatch,'0 of 2 stored paths · page 1 of 1 · up to 25 results per page');
for(const sample of b.events){const event=native.snapshots[6].timeline.find(e=>e.id===sample.id);assert(event);assert.deepEqual(JSON.parse(sample.exact),event);
 assert.deepEqual(sample.reads,event.reads.map(r=>r.exact));assert.deepEqual(sample.before,event.diffs.map(d=>d.before));assert.deepEqual(sample.after,event.diffs.map(d=>d.after));}
assert.deepEqual(b.events.map(e=>e.id),['0','2']);assert.equal(b.changedFilterReset,false);
assert.equal(b.rootReset,'all');assert.equal(b.queryReset,'');assert.deepEqual(b.alerts,[]);
for(const s of read(root+'/manifest.json').sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256);}
fs.writeFileSync(root+'/browser-verification.json',JSON.stringify({status:'PASS BOUNDED BODY STATE BROWSER',program:'baseline',prefixes:[0,6],events:['0','2'],
 artifacts:['browser.json','browser.png','program-00.json'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),
 scope:'Exact selected state,native six hashes,event reads/before/after,root/no-match filters,event filter reset and fresh-run reset. Other programs/browser layouts/accessibility remain separate.'},null,2)+'\n',{flag:'wx'});
console.log('PASS native/browser BODY state inspection');
