import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const input='docs/planning/GA_CARRIER_ALLOCATION_DRAFT.json',out='docs/planning/GA_CARRIER_ALLOCATION_REVIEW_REV1.json';
assert(!fs.existsSync(out));
const read=p=>JSON.parse(fs.readFileSync(p)),fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const proposal=read(input),shape=read('docs/formal/GENERAL_ATTENTION_CARRIER_CANDIDATE.json');
for(const f of [...proposal.sources,...proposal.priorAllocations])assert.deepEqual(fp(f.path),f,'preserved input '+f.path);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
let schemas;try{schemas=(await server.ssrLoadModule('/src/campaign3/attentionCodecs.ts')).attentionSupportedSchemas();}finally{await server.close();}
const occupied=new Set(schemas.map(s=>Number(s.typeId))),names=new Set(schemas.map(s=>s.name)),ns=new Set();
function inventory(v){if(!v||typeof v!=='object')return;for(const [key,value] of Object.entries(v)){if(/namespace/i.test(key)&&Number.isInteger(value))ns.add(value);if(key==='identifierAliases')Object.values(value).filter(Number.isInteger).forEach(n=>ns.add(n));}Object.values(v).forEach(inventory);}
proposal.priorAllocations.forEach(f=>inventory(read(f.path)));
const familyNumbers=new Map([['LocalReserveId',1044],['InteroceptiveSignalId',1045],['AcquisitionOccurrenceId',1145],['GoalOutcomeAssessmentId',1146],['RetainedAttributionResultId',1147],['ProposedRecollectionOccurrenceId',1148]]);
function audit(p){
 assert.equal(p.records.length,shape.records.length);assert.equal(new Set(p.records.map(r=>r.typeId)).size,p.records.length);
 const byName=new Map(p.records.map(r=>[r.name,r]));assert.equal(byName.size,p.records.length);
 const enums=[],unions=[];
 function inspect(t,r,f,path=''){
  switch(t.kind){
   case 'enum':enums.push({recordTypeId:r.typeId,fieldId:f.id,path,members:t.values.map((name,i)=>({name,value:i+1}))});break;
   case 'union':unions.push({recordTypeId:r.typeId,fieldId:f.id,path,members:t.alternatives.map(t=>({name:t.name,typeId:byName.get(t.name).typeId,schemaVersion:1}))});break;
   case 'list':case 'set':inspect(t.element,r,f,path+'[*]');break;
   case 'map':inspect(t.key,r,f,path+'{key}');inspect(t.value,r,f,path+'{value}');break;
   case 'ref':break;
   default:assert.fail('unexpected allocation grammar');
  }
 }
 shape.records.forEach((s,i)=>{
  const r=p.records[i];assert.equal(r.name,s.name);assert.equal(r.typeId,542+i);assert.equal(r.schemaVersion,1);assert(!occupied.has(r.typeId));assert(!names.has(r.name));assert.equal(r.fields.length,s.fields.length);
  s.fields.forEach((f,j)=>{const a=r.fields[j];assert.deepEqual(a,{id:j+1,name:f.name,required:f.type.kind!=='optional',type:f.type.kind==='optional'?f.type.value:f.type});inspect(a.type,r,a);});
 });
 assert.deepEqual(p.fieldEnums,enums);assert.deepEqual(p.recordUnions,unions);
 assert.equal(p.namespaces.length,shape.newIdentityFamilies.length);assert.equal(new Set(p.namespaces.map(f=>f.namespace)).size,6);
 shape.newIdentityFamilies.forEach((f,i)=>{assert.deepEqual(p.namespaces[i],{...f,namespace:familyNumbers.get(f.name)});assert(!ns.has(p.namespaces[i].namespace));});
 assert.equal(p.rolePositions.length,shape.roles.length);
 shape.roles.forEach((role,i)=>{const [owner,tail]=role.path.split('.'),r=byName.get(owner),field=r.fields.find(f=>tail===f.name||tail.startsWith(f.name+'[')||tail.startsWith(f.name+'{')||tail.startsWith(f.name+'<'));assert(field);assert.deepEqual(p.rolePositions[i],{...role,recordTypeId:r.typeId,fieldId:field.id,requiredNamespace:role.namespace??familyNumbers.get(role.symbolicFamily)});});
 const expectedOwners=new Map([['AcquisitionFormationEvidence',1145],['GoalOutcomeAssessment',1146],['RetainedAttributionResult',1147],['Recollection',1148],['BodySelectionAudit',1143]]);
 assert.equal(p.ownedOccurrences.length,expectedOwners.size);
 for(const [name,n]of expectedOwners){const r=byName.get(name),o=p.ownedOccurrences.find(o=>o.recordTypeId===r.typeId);assert(o);assert.equal(o.fieldId,1);assert.equal(o.namespace,n);}
 assert.equal(p.status,'NUMERIC PROPOSAL; NOT PERMANENT');assert.deepEqual(p.priorAllocations,proposal.priorAllocations);assert.deepEqual(p.sources,proposal.sources);
 return {records:p.records.length,fields:p.records.reduce((n,r)=>n+r.fields.length,0),fieldEnums:enums.length,unions:unions.length,roles:p.rolePositions.length,namespaces:p.namespaces.length};
}
const counts=audit(proposal);
const faults=[
 ['record-collision',p=>p.records[0].typeId=541],['duplicate-record-id',p=>p.records[1].typeId=p.records[0].typeId],['record-omission',p=>p.records.pop()],
 ['field-renumber',p=>p.records[0].fields[0].id=2],['optionality-change',p=>p.records[0].fields[0].required=false],['field-type-change',p=>p.records[0].fields[0].type.name='CharacterId'],
 ['enum-tag-shift',p=>p.fieldEnums[0].members[0].value=0],['enum-omission',p=>p.fieldEnums.pop()],['union-alias',p=>p.recordUnions[0].members[1].typeId=p.recordUnions[0].members[0].typeId],
 ['namespace-reuse',p=>p.namespaces[0].namespace=1043],['payload-change',p=>p.namespaces[0].payload='unsigned shared runtime ordinal'],['role-omission',p=>p.rolePositions.pop()],
 ['role-namespace-change',p=>p.rolePositions[0].requiredNamespace=1000],['ownership-namespace-change',p=>p.ownedOccurrences[0].namespace=1143],['ownership-omission',p=>p.ownedOccurrences.pop()],
 ['early-freeze',p=>p.status='PERMANENT']
].map(([name,change])=>{const p=structuredClone(proposal);change(p);assert.throws(()=>audit(p),name);return {name,rejected:true};});
const md=fs.readFileSync('docs/planning/GA_CARRIER_ALLOCATION_DRAFT.md','utf8');
for(const r of proposal.records)assert(md.includes(`|${r.typeId}/1|${r.name}|${r.fields.map(f=>`${f.id} ${f.name}${f.required?'':'?'}`).join('; ')}|`));
for(const n of proposal.namespaces)assert(md.includes(`|${n.namespace}|${n.name}|${n.payload}|`));
// Verify the frozen inputs again after all negative controls, not merely at entry.
for(const f of proposal.priorAllocations)assert.deepEqual(fp(f.path),f);
fs.writeFileSync(out,JSON.stringify({status:'NUMERIC ALLOCATION REVIEW PASS; NOT RUNTIME QUALIFICATION',...counts,faults,priorArtifactsPreserved:proposal.priorAllocations.length,markdownParity:true,sources:[input,'docs/planning/GA_CARRIER_ALLOCATION_DRAFT.md','scripts/review-ga-carrier-allocation.mjs'].map(fp),limits:['Registry members and public model closure remain separate.','No output ownership execution, rollback, replay or General Attention qualification inferred.']},null,2)+'\n');
console.log(JSON.stringify({status:'PASS',...counts,faults:faults.length}));
