import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-disposition-paired-horizon-rev3',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const captured=read(root+'/checkpoint-captured.json'),started=read(root+'/restore-started.json'),after=read(root+'/restore-observation.json'),terminal=read(root+'/browser-terminal.json');
assert.equal(read(root+'/receipt.json').status,'PASS PACKED CONSTITUTIONAL PAIRED BROWSER TERMINAL AND RESTORE');
assert.equal(captured.status,'Pair A18 / B18 · Complete');assert.equal(captured.checkpoint,'Captured model/0/13: A18 / B18.');assert.deepEqual(captured.alerts,[]);
const sizes=/^Native save bytes A(\d+) \/ B(\d+); compressed bytes A(\d+) \/ B(\d+)\./.exec(captured.checkpointSize);assert(sizes);
for(const n of sizes.slice(1).map(Number))assert(Number.isSafeInteger(n)&&n>0);
assert.equal(terminal.checkpointSize,captured.checkpointSize);
assert.equal(started.status,'Pair A18 / B18 · Working');assert.equal(started.restoreDisabled,true);
assert.equal(after.status,'Pair A18 / B18 · Complete');assert.deepEqual(after.alerts,[]);
assert.equal(after.checkpoint,captured.checkpoint);assert.equal(after.checkpointSize,captured.checkpointSize);
assert.equal(after.retainedInitialReport,read(root+'/browser-start.json').report);assert.equal(after.historicalSourceDisabled,true);
assert.equal(terminal.restored.stepDisabled,true);
assert.deepEqual(terminal.restored.hashes,terminal.terminal.hashes);
assert.deepEqual(JSON.parse(terminal.restored.comparison),JSON.parse(terminal.terminal.comparison));
assert.deepEqual(JSON.parse(terminal.restored.choices),JSON.parse(terminal.terminal.choices));
assert.equal(terminal.restoredHistory,terminal.history);
const verifier=fs.readFileSync('scripts/check-disposition-packed-restore-observation.mjs');fs.writeFileSync(root+'/restore-observation-verifier.mjs',verifier,{flag:'wx'});
fs.writeFileSync(root+'/restore-observation-receipt.json',JSON.stringify({status:'PASS TERMINAL CHECKPOINT CAPTURE AND RESTORE OBSERVATION',
 nativeSaveBytes:{a:Number(sizes[1]),b:Number(sizes[2])},compressedBytes:{a:Number(sizes[3]),b:Number(sizes[4])},verifierSha256:sha(verifier),
 artifacts:['checkpoint-captured.json','restore-started.json','restore-observation.json','browser-pre-restore.json','browser-terminal.json','receipt.json'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),
 scope:'Captured terminal18 checkpoint,observed one restore entering Working with disabled control,then exact terminal reports/ten identities/history and retained prefix1 diagnostic after completion. Sizes are UI checkpoint declarations,not heap bounds. No checkpoint bytes exported,all-pair/all-mode or entry acceptance.'},null,2)+'\n',{flag:'wx'});
console.log('PASS terminal capture/restore lifecycle and post-restore retained diagnostic');
