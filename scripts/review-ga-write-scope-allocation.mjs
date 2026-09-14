import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),read=p=>JSON.parse(fs.readFileSync(p));
const input='docs/planning/GA_WRITE_SCOPE_ALLOCATION_DRAFT.json',out='docs/planning/GA_WRITE_SCOPE_ALLOCATION_REVIEW_REV1.json';assert(!fs.existsSync(out));
const p=read(input),shape=read('docs/planning/GA_REGISTRATION_WRITE_SCOPE_CORRECTION_REV1.json'),review=read('docs/planning/GA_REGISTRATION_WRITE_SCOPE_REVIEW_REV1.json');
for(const f of[...p.sources,...p.priorAllocations])assert.deepEqual(fp(f.path),f);
for(const f of read('docs/formal/GENERAL_ATTENTION_WRITE_SCOPE_SHAPE_MANIFEST.json').files)assert.deepEqual(fp(f.path),f);
const old=p.priorAllocations.flatMap(f=>read(f.path).records??[]),ids=new Set(old.map(r=>r.typeId)),names=new Set(old.map(r=>r.name));assert.equal(Math.max(...ids),704);
function audit(x){
 assert.equal(x.records.length,2);assert.deepEqual(x.newNamespaces,[]);assert.deepEqual(x.members,[]);
 shape.records.forEach((r,i)=>{const a=x.records[i];assert.equal(a.typeId,705+i);assert(!ids.has(a.typeId));assert(!names.has(a.name));assert.equal(a.name,r.name);assert.equal(a.schemaVersion,1);assert.deepEqual(a.fields,r.fields.map((f,j)=>({id:j+1,name:f.name,required:f.type.kind!=='optional',type:f.type.kind==='optional'?f.type.value:f.type})));});
 assert.deepEqual(x.fieldEnums,[{recordTypeId:706,fieldId:1,members:shape.records[1].fields[0].type.values.map((name,i)=>({name,value:i+1}))}]);
 assert.deepEqual(x.recordUnions,[{recordTypeId:706,fieldId:9,members:[{name:'TransitionWriteAuthorization',typeId:322,schemaVersion:1},{name:'GeneralPathWriteCapability',typeId:705,schemaVersion:1}]}]);
 assert.deepEqual(x.rolePositions,review.roles.map(role=>{const[owner,name]=role.path.split('.'),record=x.records.find(r=>r.name===owner);return {...role,recordTypeId:record.typeId,fieldId:record.fields.find(f=>f.name===name).id,requiredNamespace:role.namespace};}));
 assert.deepEqual(x.recordBoundaries,review.boundaries);assert.equal(x.status,'NUMERIC PROPOSAL; NOT PERMANENT');
}
audit(p);
const faults=[['old-type-reuse',p=>p.records[1].typeId=704],['field-renumber',p=>p.records[0].fields[1].id=3],['union-alias',p=>p.recordUnions[0].members[1].typeId=322],['role-namespace-swap',p=>p.rolePositions[0].requiredNamespace=1026],['stage-enum-shift',p=>p.fieldEnums[0].members[0].value=0],['new-member',p=>p.members.push({namespace:1025,payload:'authority/unreviewed'})],['boundary-omission',p=>p.recordBoundaries.pop()]].map(([name,change])=>{const x=structuredClone(p);change(x);assert.throws(()=>audit(x),name);return {name,rejected:true};});
for(const f of p.priorAllocations)assert.deepEqual(fp(f.path),f);
fs.writeFileSync(out,JSON.stringify({status:'WRITE-SCOPE ALLOCATION REVIEW PASS; PUBLIC GATES OPEN',records:2,fields:13,roles:3,priorArtifactsPreserved:p.priorAllocations.length,faults,sources:[input,'scripts/review-ga-write-scope-allocation.mjs'].map(fp)},null,2)+'\n');
console.log('705/706 allocation reviewed; seven faults rejected; prior bytes preserved.');
