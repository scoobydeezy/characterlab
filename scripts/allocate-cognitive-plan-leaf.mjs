import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const output='docs/planning/TASK_COGNITIVE_PLAN_LEAF_ALLOCATION_DRAFT.json';assert(!fs.existsSync(output));
const paths=['docs/formal/TASK_COGNITIVE_PLAN_LEAF_ADDITION.md',...fs.readdirSync('docs/formal').filter(p=>p.endsWith('ALLOCATION_TABLE.json')).map(p=>'docs/formal/'+p)];
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const member={namespace:1032,payload:'leaf/task-instruction'};
for(const p of paths.slice(1)){const t=JSON.parse(fs.readFileSync(p,'utf8'));assert(!(t.members??[]).some(m=>m.namespace===member.namespace&&m.payload===member.payload));}
fs.writeFileSync(output,JSON.stringify({version:'task-cognitive-plan-leaf-allocation/0.1-draft',status:'NUMERIC PROPOSAL',authority:paths[0],sourceFingerprints:paths.map(fp),records:[],namespaces:[],members:[member],mapping:{logicalFamilyNamespace:1031,logicalFamily:'prospective-commitments',rootStateTypeId:373,schemaVersion:2,fieldId:2,readOnly:true},runtime:'NOT PASSED'},null,2)+'\n');
console.log('One-member additive proposal; no numeric family allocated.');
