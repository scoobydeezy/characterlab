import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),prefix='docs/formal/MEASUREMENT_EVIDENCE_CARRIAGE_';
const raw=p=>fs.readFileSync(new URL(p,root)),read=p=>raw(p).toString('utf8');
const t=JSON.parse(read(prefix+'ALLOCATION_TABLE.json')),md=read(prefix+'ALLOCATION_REVIEW.md'),checks=[];
function eq(name,a,b){assert.deepEqual(a,b,name);checks.push({name,status:'PASS'});}
eq('allocation lifecycle',['REVIEW CANDIDATE','PERMANENT AND FROZEN'].includes(t.status),true);
eq('allocation version',t.version,t.status==='PERMANENT AND FROZEN'?'measurement-evidence-carriage-allocation/0.1-candidate':'measurement-evidence-carriage-allocation/0.1-draft');
eq('Markdown lifecycle',md.includes('**Status: '+t.status+'.**'),true);
eq('accepted shape',read(t.authority).includes('**Status: WHOLE SHAPE ACCEPTED.**'),true);
eq('six new record IDs',t.records.map(r=>r.typeId),[336,337,338,339,340,341]);
const layouts=[['ObserverId','ObservationChannelId','UnitId'],['CognitiveMeasurementEvidenceId','Observation','UnitId','TransformationVersion'],['ProducingSeamId','ProducingSeamVersion','ProducerEventTypeId','ProducerPhase','OutputRecordSchema'],['InputRecordSchema','Producer','RequiredSourceRelation'],['InputAdmission','ReadDomain','OutputDefinitions','WriteCapability'],['ExecutingSeamId','ExecutingSeamVersion','TransitionDefinition','IngressDefinition']];
const base=JSON.parse(read('docs/formal/CAMPAIGN2_ALLOCATION_TABLE.json'));
for(const [i,r]of t.records.entries()){
 eq(r.name+' fields',r.fields.map(f=>f.name),layouts[i]);eq(r.name+' schema',r.schemaVersion,1);
 eq(r.name+' field IDs',r.fields.map(f=>f.id),layouts[i].map((_,j)=>j+1));
 eq(r.name+' all required',r.fields.every(f=>f.required),true);
 eq(r.name+' Markdown',md.includes(`| ${r.typeId} | ${r.name} | 1 |`),true);
 for(const f of r.fields)eq(r.name+'.'+f.name+' parity',md.includes(`| ${r.typeId} | ${f.id} | ${f.name} | ${f.type} |`),true);
}
for(const [old,id,oldType,newType]of [[274,339,'TransitionInputProducerV04','AuthenticatedObserverMeasurementProducer'],[271,340,'TransitionInputAdmissionV04','TransitionInputAdmissionV07'],[272,341,'TransitionDefinitionV04','TransitionDefinitionV07']]){
 const fields=base.records.find(r=>r.typeId===old).fields.map(f=>({...f,type:f.type===oldType?newType:f.type}));
 eq('exact inherited layout '+id,t.records.find(r=>r.typeId===id).fields,fields);
}
eq('one new occurrence family',t.namespaces,[{namespace:1124,name:'CognitiveMeasurementEvidenceId',scope:'run-scoped occurrence',payload:'unsigned-runtime-ordinal'}]);
eq('six members',t.members.length,6);
eq('exact members',t.members.map(m=>[m.namespace,m.payload]),[[1009,'MeasurementEvidenceIntakeTransition'],[1001,'event/measurement-evidence-intake'],[1001,'event/measurement-evidence-padding'],[1036,'seam/measurement-evidence-carriage'],[1027,'definition/measurement-evidence-intake'],[1023,'registry/measurement-evidence-intake']]);
for(const m of t.members){eq(m.payload+' NFC',m.payload.normalize('NFC'),m.payload);eq(m.payload+' parity',md.includes(`| ${m.namespace} | ${m.payload} |`),true);}
eq('no union allocation',t.unionVariants,[]);
eq('exact source relation',t.finiteValues,[{position:'TransitionInputAdmissionV07.RequiredSourceRelation',name:'ExactImmediateProducerOutput',value:1}]);
eq('role coverage',t.roles.map(r=>[r.recordTypeId,r.fieldId,r.requiredNamespace]),[[336,1,1000],[336,2,1005],[336,3,1039],[337,1,1124],[337,3,1039],[338,1,1036],[338,3,1001],[341,1,1036]]);
for(const r of t.roles){eq('no validator '+r.recordTypeId+'/'+r.fieldId,r.domainValidatorId,null);eq('role parity '+r.recordTypeId+'/'+r.fieldId,md.includes(`| ${r.recordTypeId} | ${r.fieldId} | ${r.requiredNamespace} | absent |`),true);}
eq('203 role reused',t.reusedRoles,[{recordTypeId:203,fieldId:1,requiredNamespace:1115,domainValidatorId:null}]);
eq('occurrence rules',t.occurrenceIdentities,[{recordTypeId:203,schemaVersion:1,identityFieldId:1,requiredNamespace:1115,domainValidatorId:null},{recordTypeId:337,schemaVersion:1,identityFieldId:1,requiredNamespace:1124,domainValidatorId:null}]);
eq('shared singleton version',t.registryRows[0].definitionVersion,'transition-admission/0.4-candidate');eq('singleton count',t.registryRows[0].cardinality,1);
eq('V07 version',t.registryRows[2].definitionVersion,'transition-admission-extension/0.7-candidate');
for(const r of t.registryRows)eq('row '+r.stableId,md.includes(`| ${r.registryKind} | ${r.stableId} | ${r.definitionVersion} | ${r.definitionSchema} |`),true);
const priorRecords=new Set(),priorNamespaces=new Set(),priorMembers=new Set();
for(const p of t.preservedSources){
 eq('preserved '+p.path,crypto.createHash('sha256').update(raw(p.path)).digest('hex'),p.sha256);
 if(p.path.endsWith('_ALLOCATION_TABLE.json')){
 const v=JSON.parse(read(p.path));for(const r of v.records??[])priorRecords.add(r.typeId);for(const n of v.namespaces??[])priorNamespaces.add(n.namespace);for(const m of v.members??[])priorMembers.add(m.namespace+':'+m.payload);
 }
}
for(const r of t.records)eq('unused record '+r.typeId,priorRecords.has(r.typeId),false);
eq('unused namespace 1124',priorNamespaces.has(1124),false);
for(const m of t.members)eq('unused member '+m.payload,priorMembers.has(m.namespace+':'+m.payload),false);
eq('append after latest allocated record',Math.max(...priorRecords),335);
eq('append after latest occurrence namespace',Math.max(...priorNamespaces),1123);
eq('frozen vectors',read(t.authority).includes('## 9. Frozen adversarial vectors — NOT PASSED'),true);
eq('sixteen vectors',(read(t.authority).match(/^\| EVC-[A-P] \|/gm)||[]).length,16);
fs.writeFileSync(new URL(prefix+'ALLOCATION_AUDIT.json',root),JSON.stringify({status:'PASS',scope:'allocation consistency only; no runtime or implementation verdict',checks},null,2)+'\n');
console.log(`${checks.length} allocation checks PASS; no runtime controls passed.`);
