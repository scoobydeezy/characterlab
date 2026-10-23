import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-disposition-paged-pair-modes-rev1',prior='docs/planning/workbench-disposition-paged-pair-ui-rev2',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
for(const s of read(root+'/freeze.json').sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
assert.equal(sha(fs.readFileSync(prior+'/oracle.json')),read(prior+'/receipt.json').artifacts.find(a=>a.path==='oracle.json').sha256);
const b=read(root+'/mode-leave.json'),o=read(prior+'/oracle.json').stages[3];
assert.equal(b.status,'Pair A2 / B2 · Ready');assert.equal(b.mode,'Compare');assert.deepEqual(JSON.parse(b.comparison),o.comparison);assert.deepEqual(b.hashes,o.hashes);assert.deepEqual(b.alerts,[]);assert(b.staleLinkDisabled);
assert.equal(b.retained,read(root+'/browser.json').historyEnvelope);
const script='scripts/check-workbench-disposition-paged-mode-leave.mjs';fs.writeFileSync(root+'/mode-leave-verifier.mjs',fs.readFileSync(script),{flag:'wx'});
fs.writeFileSync(root+'/mode-leave-receipt.json',JSON.stringify({status:'PASS BOUNDED MODE-LEAVE PAUSE',scope:'Run from1/1 then leave Reasoning for Compare; finishes exactly2/2 with native comparison and ten identities. Returning to Reasoning preserves1/1 report and disables stale decision link. No full-horizon or exhaustive navigation claim.',artifacts:['mode-leave.json','mode-leave-verifier.mjs'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}))},null,2)+'\n',{flag:'wx'});console.log('PASS paired mode-leave boundary and stale report');
