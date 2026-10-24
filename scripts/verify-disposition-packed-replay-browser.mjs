import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-disposition-paired-horizon-rev3',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const freeze=read(root+'/freeze.json'),oracle=read(root+'/oracle.json'),start=read(root+'/browser-start.json'),b=read(root+'/browser-bounded.json');
for(const s of freeze.sources)assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);
for(const s of freeze.assets)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
for(const s of oracle.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
for(const [prefix,c,history] of [[0,start.initial,start.history0],[1,start.prefix1,start.history1],[2,b.prefix2,b.history2],[1,b.restored,b.restoredHistory]]){
 const old=oracle.stages[prefix];assert.deepEqual(JSON.parse(c.comparison),old.comparison);assert.deepEqual(JSON.parse(c.choices),old.choices);assert.deepEqual(c.hashes,old.hashes);assert.deepEqual(c.alerts,[]);assert.equal(c.status,`Pair A${prefix} / B${prefix} · Ready`);
 const h=JSON.parse(history);for(const branch of ['a','b']){assert.deepEqual(h[branch].rows,old.historyRows[branch]);assert.equal(h[branch].source.saveHash,old.comparison[branch].saveHash);}
}
assert.equal(b.restored.comparison,start.prefix1.comparison);assert.equal(b.restoredHistory,start.history1);
assert.equal(b.historicalReport,start.report);assert(b.historicalSourceDisabled);
assert.equal(start.report,read('docs/planning/workbench-disposition-paired-horizon-rev2/browser-start.json').report);
assert.match(b.checkpointSize,/Native save bytes A638135 \/ B743887; compressed bytes A11549 \/ B12985/);
fs.writeFileSync(root+'/bounded-verification.json',JSON.stringify({status:'PASS BOUNDED EXACT-BYTE REPLAY RESTORE BROWSER',sequence:[0,1,2,1],sources:freeze.sources.length,assets:freeze.assets.length,artifacts:['browser-start.json','browser-bounded.json','bounded.png','oracle.json','freeze.json'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'One original constitutional pair, compressed capture1, advance2, corrected exact-byte replay restore1, original reports/ten hashes/choice and scalar histories, retained prefix1 report at2 and stale source guard. Terminal restore remains unsatisfied until separately verified.'},null,2)+'\n',{flag:'wx'});
console.log('PASS bounded browser0/1/2/restore1 with original identities and retained history');
