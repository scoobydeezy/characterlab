// Separate review of the explicit one-member proposal; preserve prior frozen tables.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const draft='docs/planning/TASK_COGNITIVE_PLAN_LEAF_ALLOCATION_DRAFT.json',output='docs/formal/TASK_COGNITIVE_PLAN_LEAF_ALLOCATION_TABLE.json',receipt='docs/formal/TASK_COGNITIVE_PLAN_LEAF_ALLOCATION_AUDIT.json';
assert(!fs.existsSync(output));assert(!fs.existsSync(receipt));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const x=JSON.parse(fs.readFileSync(draft,'utf8'));for(const f of x.sourceFingerprints)assert.deepEqual(fp(f.path),f);
assert.deepEqual(x.records,[]);assert.deepEqual(x.namespaces,[]);assert.deepEqual(x.members,[{namespace:1032,payload:'leaf/task-instruction'}]);
const base=JSON.parse(fs.readFileSync('docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json','utf8')),old=JSON.parse(fs.readFileSync('docs/formal/CAMPAIGN2_ALLOCATION_TABLE.json','utf8'));
assert(old.namespaces.some(n=>n.namespace===1032&&n.name==='LeafFamilyId'));
assert.equal(base.schemaSuccessors[0].fields.find(f=>f.id===2).name,'AdoptedInstructions');
for(const f of x.sourceFingerprints.filter(f=>f.path.endsWith('ALLOCATION_TABLE.json'))){const prior=JSON.parse(fs.readFileSync(f.path,'utf8'));assert(!(prior.members??[]).some(m=>m.namespace===1032&&m.payload==='leaf/task-instruction'));}
assert(fs.readFileSync(x.authority,'utf8').includes('LeafFamilyId1032 member `leaf/task-instruction`'));
const accepted={...x,version:'task-cognitive-plan-leaf-allocation/0.1-candidate',status:'PERMANENT AND FROZEN',reviewedProposal:fp(draft),acceptance:'independent internal additive numeric review'};
fs.writeFileSync(output,JSON.stringify(accepted,null,2)+'\n');
fs.writeFileSync(receipt,JSON.stringify({status:'ADDITIVE NUMERIC ACCEPTANCE AND FREEZE PASS',reviewedProposal:fp(draft),frozenTable:fp(output),checks:['exact accepted singleton payload','existing namespace1032 verified from authority','existing373/2 field2 verified','no previous member collision','no new record/field/namespace','all prior source fingerprints unchanged'],runtime:'NOT PASSED',model:'NOT FROZEN'},null,2)+'\n');
console.log('PERMANENT: LeafFamilyId/1032("leaf/task-instruction"); prior allocations unchanged.');
