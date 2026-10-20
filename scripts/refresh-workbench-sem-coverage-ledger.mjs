import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const ledger='docs/planning/OBSERVABILITY_WORKBENCH_COVERAGE.json',parent='docs/planning/workbench-sem-coverage-rev3',root='docs/planning/workbench-sem-ledger-rev1',script='scripts/refresh-workbench-sem-coverage-ledger.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
assert(!fs.existsSync(root));const before=fs.readFileSync(ledger),document=JSON.parse(before),receipt=read(parent+'/receipt.json'),inventory=read(parent+'/inventory.json');
assert.equal(receipt.status,'PASS BOUNDED SEM INSPECTION RECONCILIATION');
for(const a of receipt.artifacts)assert.equal(sha(fs.readFileSync(parent+'/'+a.path)),a.sha256,a.path);
for(const s of receipt.sources)assert.equal(sha(fs.readFileSync(parent+'/sources/'+s.path)),s.sha256,s.path);
assert.deepEqual(inventory.counts,{vectors:100,vectorsWithScopedPointers:100,namedNegativeWitnesses:31,acceptanceItems:10,completeWorkbenchVectors:0});
assert.deepEqual(receipt.counts,inventory.counts);assert.equal(inventory.vectors.length,100);assert.equal(inventory.negativeControls.length,31);assert.equal(inventory.acceptance.length,10);
assert.equal(new Set(inventory.vectors.map(v=>v.id)).size,100);
const lines=new Map();for(const v of inventory.vectors){
 assert(v.relatedReceipts.length>0);assert(v.remaining.length>0);
 const p=v.requirement.path;if(!lines.has(p))lines.set(p,fs.readFileSync(p,'utf8').split(/\r?\n/));
 assert.equal(lines.get(p)[v.requirement.line-1],v.requirement.exact,v.id);
 for(const p of v.relatedReceipts)assert(read(p).status.startsWith('PASS'),p);
}
for(const r of inventory.joinedReceipts){const b=fs.readFileSync(r.path);assert.equal(sha(b),r.sha256,r.path);assert.equal(JSON.parse(b).status,r.status);}
const index=document.members.findIndex(e=>e.id==='PHEN-SEM-001');assert(index>=0);const prior=structuredClone(document.members[index]),entry=document.members[index];
entry.workbenchStatus='ALL100 VECTORS HAVE BOUNDED INSPECTION POINTERS;31 NEGATIVE WITNESSES/10 ACCEPTANCE ITEMS RECONCILED; LANGUAGE, PARTICIPATION AND FULL ENTRY OPEN';
entry.requirementInventory=parent+'/inventory.json';entry.nativeRegressionReceipt=parent+'/receipt.json';
entry.coverageReconciliation={path:parent+'/receipt.json',sha256:sha(fs.readFileSync(parent+'/receipt.json')),counts:inventory.counts,datedValidation:inventory.validation};
entry.qualificationReceipts=inventory.joinedReceipts;
entry.scope='Fixed three-observer SEM-001J harness plus separately identified component controls. All100 original vectors have bounded inspection pointers;31 negative witnesses and10 acceptance items retain their exact proof kinds. The retained revision3 regression receipt records25 native files/222 tests and26 worker files/26 tests at that source revision, not a fresh current-build run. No vector is promoted to complete Workbench acceptance. Historical renderer controls are not qualified observer language; diagnostic evaluations, structural copies, declared owners and native execution remain distinct.';
entry.retainedInspectionLimits=inventory.review.retainedLimits;
entry.pending=['Observer-safe recognition and causal explanations with complete factor accounting','Architecture participation: declared ownership, actual reads/writes and causal effects remain distinct','Integrated six-mode browser, export/import, resource and accessibility acceptance','Full Workbench requirement acceptance; bounded pointer coverage is not completion'];
assert.deepEqual(document.successors,JSON.parse(before).successors);assert.deepEqual(document.members.filter((_,i)=>i!==index),JSON.parse(before).members.filter((_,i)=>i!==index));
fs.mkdirSync(root,{recursive:true});fs.writeFileSync(root+'/prior-entry.json',JSON.stringify(prior,null,2)+'\n',{flag:'wx'});fs.writeFileSync(root+'/entry.json',JSON.stringify(entry,null,2)+'\n',{flag:'wx'});fs.writeFileSync(root+'/verifier.mjs',fs.readFileSync(script),{flag:'wx'});
const after=JSON.stringify(document,null,2)+'\n';fs.writeFileSync(ledger,after);
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS SEM COVERAGE LEDGER RECONCILIATION',ledger,beforeSha256:sha(before),afterSha256:sha(after),parent:{path:parent+'/receipt.json',sha256:sha(fs.readFileSync(parent+'/receipt.json'))},counts:inventory.counts,retainedMembers:document.members.length,retainedSuccessors:document.successors.length,artifacts:['prior-entry.json','entry.json','verifier.mjs'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Only SEM member routing and scoped evidence references changed. Parent artifacts and frozen sources authenticated;100 requirement lines still match current formal vectors. Other members/successors unchanged. No new runtime regression, current-browser qualification, language admission or complete-vector acceptance inferred.'},null,2)+'\n',{flag:'wx'});
console.log('PASS SEM coverage ledger:100 scoped pointers,31 negative witnesses,10 acceptance items;0 complete Workbench vectors');
