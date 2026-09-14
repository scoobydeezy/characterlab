import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p)),fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const input='docs/planning/GA_REGISTRY_MEMBER_ALLOCATION_DRAFT.json',output='docs/planning/GA_REGISTRY_MEMBER_ALLOCATION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const proposal=read(input),manifestPath='docs/formal/GENERAL_ATTENTION_REGISTRY_MEMBER_SHAPE_MANIFEST.json',manifest=read(manifestPath),shape=read('docs/planning/GA_REGISTRY_MEMBER_SHAPE_REV1.json');
for(const f of[...manifest.files,...proposal.sources,...proposal.priorAllocations])assert.deepEqual(fp(f.path),f);
const namespaces={TransitionKindId:1009,EventTypeId:1001,SeamId:1036,ProjectionAccessorId:1028,MutationAuthorityId:1025,SemanticKindId:1004,DomainValidatorId:1021,RegistryKindId:1023};
const priorMembers=proposal.priorAllocations.flatMap(f=>read(f.path).members??[]),occupied=new Set(priorMembers.map(m=>`${m.namespace}/${m.payload}`));
function audit(p){
 assert.equal(p.members.length,218);assert.deepEqual(p.newNamespaces,[]);assert.deepEqual(p.records,[]);
 assert.equal(new Set(p.members.map(m=>`${m.namespace}/${m.payload}`)).size,p.members.length);
 p.members.forEach((m,i)=>{assert.deepEqual(m,{family:shape.members[i].family,namespace:namespaces[shape.members[i].family],payload:shape.members[i].member});assert.equal(m.payload,m.payload.normalize('NFC'));assert(m.payload.length>0);assert(!occupied.has(`${m.namespace}/${m.payload}`),'prior permanent member collision');});
 assert.equal(p.status,'NUMERIC MEMBER PROPOSAL; NOT PERMANENT');assert.deepEqual(p.priorAllocations,proposal.priorAllocations);
}
audit(proposal);
const faults=[['namespace-substitution',p=>p.members[0].namespace=1001],['member-omission',p=>p.members.pop()],['payload-renaming',p=>p.members[0].payload+='-alias'],['duplicate-member',p=>p.members[1]={...p.members[0]}],['new-namespace-smuggling',p=>p.newNamespaces.push({namespace:1046})],['new-record-smuggling',p=>p.records.push({typeId:705})],['early-permanence',p=>p.status='PERMANENT'],['existing-member-reuse',p=>p.members[0]={family:'TransitionKindId',namespace:1009,payload:'transition/attention-world'}]].map(([name,change])=>{const p=structuredClone(proposal);change(p);assert.throws(()=>audit(p),name);return {name,rejected:true};});
for(const f of proposal.priorAllocations)assert.deepEqual(fp(f.path),f);
fs.writeFileSync(output,JSON.stringify({status:'MEMBER ALLOCATION REVIEW PASS; PUBLIC GATES OPEN',members:218,newNamespaces:0,newRecords:0,priorArtifactsPreserved:proposal.priorAllocations.length,faults,sources:[input,manifestPath,'scripts/review-ga-member-allocation.mjs'].map(fp)},null,2)+'\n');
console.log('218 exact member assignments pass; eight faults rejected; prior artifacts preserved.');
