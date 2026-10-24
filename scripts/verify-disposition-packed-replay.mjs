import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-disposition-packed-replay-rev1/native';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const receipt=read(root+'/receipt.json'),freeze=read(root+'/freeze.json');
for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
const oraclePath='docs/planning/workbench-disposition-paired-horizon-rev2/oracle.json',oracle=read(oraclePath);
const checks=[...receipt.results.map(r=>({prefix:r.prefix,summary:r.summary})),{prefix:2,summary:receipt.successor}];
for(const {prefix,summary} of checks){const old=oracle.stages[prefix];assert.deepEqual(summary.comparison,old.comparison);assert.deepEqual(summary.choices,old.choices);
 const hashes=['a','b'].flatMap(branch=>['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>summary[branch][k]));assert.deepEqual(hashes,old.hashes);
 for(const branch of ['a','b'])assert.deepEqual(summary.history[branch].rows,old.historyRows[branch]);
}
fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS BOUNDED REPLAY RESTORE ORIGINAL ORACLE RECONCILIATION',prefixes:[0,1,2],restoredPrefix:receipt.restoredPrefix,frozenSources:freeze.sources.length,oracleSha256:sha(fs.readFileSync(oraclePath)),receiptSha256:sha(fs.readFileSync(root+'/receipt.json')),scope:'Original paired comparisons, choice rows, ten hashes and scalar histories. Byte equality established by frozen writer and native-restore comparator tests. No terminal browser or heap claim.'},null,2)+'\n',{flag:'wx'});
console.log('PASS paired original identities, choices and histories at0/1/2');
