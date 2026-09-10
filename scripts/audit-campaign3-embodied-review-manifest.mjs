// Planning dependency/role inventory only; no EMB runtime qualification.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='docs/planning/';
const output=dir+'CAMPAIGN3_EMBODIED_REVIEW_MANIFEST_REV1.json';
assert(!fs.existsSync(output),'preserve prior receipts; use a new revision');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const inventory=JSON.parse(fs.readFileSync(dir+'CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV2.json'));
const names=new Set(inventory.records.map(r=>r.name));
assert.equal(names.size,32);
const known=new Set([...names,...Object.keys(inventory.typeAliases),...Object.keys(inventory.externalSchemaReferences),'rational','SimInstant','unsigned','boolean','text','set','map']);
const dependencies=[],roles=[];
for(const r of inventory.records)for(const f of r.fields){
  for(const match of f.type.matchAll(/id:([A-Za-z0-9]+)/g)){
    assert(Object.hasOwn(inventory.identityRoles,match[1]),`${r.name}.${f.name}`);
    roles.push({record:r.name,field:f.name,family:match[1],role:inventory.identityRoles[match[1]],owner:f.type.startsWith('map<')?'state key grammar then map-key role':f.type.startsWith('set<')?'closed profile collection-member check':'recursive record-field role'});
  }
  const types=f.type.replace(/id:[A-Za-z0-9]+/g,'').match(/[A-Za-z][A-Za-z0-9]*/g)??[];
  for(const type of types){assert(known.has(type),`unresolved ${r.name}.${f.name}: ${type}`);if(names.has(type)||Object.hasOwn(inventory.externalSchemaReferences,type)||Object.hasOwn(inventory.typeAliases,type))dependencies.push({record:r.name,field:f.name,target:type});}
}
for(const [alias,targets] of Object.entries(inventory.typeAliases))for(const target of targets){assert(names.has(target));dependencies.push({alias,target});}
assert.equal(inventory.records.reduce((n,r)=>n+r.fields.length,0),128);
assert.equal(roles.filter(r=>r.owner==='closed profile collection-member check').length,2);
assert.equal(roles.filter(r=>r.owner==='state key grammar then map-key role').length,1);
const suffixes=['MOTIVATION_DRAFT.md','OBSERVATION_ADMISSION_DRAFT.md','INGRESS_SCHEDULING_DRAFT.md','REGISTRATION_ACCESSOR_DRAFT.md','REPLENISHMENT_PROFILE_DRAFT.md','SYMBOLIC_CONSOLIDATION.md','FIELD_TYPE_REVIEW.md','VOCABULARY_DISPATCH_DRAFT.md','PROFILE_WITNESS_DRAFT.md','COMPOSED_REVIEW_REV1.md','REVIEW_MANIFEST_REV1.md','TYPED_INVENTORY_REV2.json','VOCABULARY_REV1.json','PROFILE_EXPECTATIONS_REV1.json','COMPOSED_REVIEW_REV1.json'];
const files=suffixes.map(s=>dir+'CAMPAIGN3_EMBODIED_'+s);
const sourceFiles=['src/campaign2/valDeclarations.ts','src/campaign2/identityRoles.ts'];
const frozen=JSON.parse(fs.readFileSync(dir+'COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));
for(const f of frozen.checks)assert.equal(hash(f.path),f.sha256,f.path);
const report={status:'BOUNDED SYMBOLIC PACKET READY FOR SHAPE REVIEW; NO ALLOCATION OR RUNTIME PASS',records:32,fields:128,identityPositions:roles,dependencies,externalSchemaReferences:inventory.externalSchemaReferences,packet:files.map(path=>({path,sha256:hash(path)})),inspectedRoleSources:sourceFiles.map(path=>({path,sha256:hash(path)})),preservedChecks:frozen.checks.length,limitations:['References are symbolic, not numeric codec descriptors.','Identity ownership is inventoried, not executed.','Registry target closure remains a required compiler check, not proven by this inventory.'],script:{path:'scripts/audit-campaign3-embodied-review-manifest.mjs',sha256:hash('scripts/audit-campaign3-embodied-review-manifest.mjs')}};
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({records:32,fields:128,identityPositions:roles.length,dependencyEdges:dependencies.length,packetFiles:files.length,preservedChecks:frozen.checks.length}));
