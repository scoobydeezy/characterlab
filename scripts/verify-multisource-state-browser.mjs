import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-multisource-state-inspection-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const b=read(root+'/browser.json'),native=read(root+'/program-00.json');
assert.equal(native.program,'shared--GroundAggregate');
const original=read('docs/planning/workbench-multisource-parity-rev1/receipt.json').results.find(r=>r.id===native.program);
for(const [i,s]of native.snapshots.entries())assert.equal(s.saveHash,original.prefixes[i].saveHash);
for(const [key,prefix]of [['initial',0],['terminal',3]]){
 const s=native.snapshots[prefix],v=b[key];
 assert.equal(v.hashes[3],s.saveHash);assert.deepEqual(v.afterHashes,v.hashes);
 const selected=s.fields.find(f=>f.path===v.selection.path);assert(selected);assert.equal(v.selection.value,selected.exact);
}
assert.equal(b.noMatch,'0 of 9 stored paths · page 1 of 1 · up to 25 results per page');
const terminal=native.snapshots[3];
for(const sample of b.events){const event=terminal.timeline.find(e=>e.id===sample.id);assert(event);assert.deepEqual(JSON.parse(sample.exact),event);
 assert.deepEqual(sample.reads,event.reads.map(r=>r.exact));assert.deepEqual(sample.before,event.diffs.map(d=>d.before));assert.deepEqual(sample.after,event.diffs.map(d=>d.after));}
assert.deepEqual(b.events.map(e=>e.id),['0','2']);
assert.equal(b.changedFilterReset,false);assert.equal(b.rootReset,'all');assert.equal(b.queryReset,'');assert.deepEqual(b.alerts,[]);
const manifest=read(root+'/manifest.json'),successor=read(root+'/browser-source.json');
assert.equal(successor.path,'src/workbench/MultisourceWorkbench.tsx');
assert.equal(sha(fs.readFileSync(successor.path)),successor.sha256);assert.equal(sha(fs.readFileSync(successor.copy)),successor.sha256);
for(const s of manifest.sources){if(s.path!==successor.path)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256);}
fs.writeFileSync(root+'/browser-verification.json',JSON.stringify({status:'PASS BOUNDED MULTISOURCE STATE BROWSER',program:native.program,prefixes:[0,3],events:['0','2'],
 presentationSuccessor:successor,artifacts:['browser.json','browser-corrected.png','program-00.json'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),
 scope:'Exact native selected state,root/no-match/reset controls,read and mutation displays,event filter reset,five unchanged current hashes and fresh-run filter reset. Full browser corpus and broader accessibility remain open.'},null,2)+'\n',{flag:'wx'});
console.log('PASS bounded native/browser state and event inspection');
