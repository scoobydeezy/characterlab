// Mechanical symbolic-to-numeric proposal. Does not activate canonical task code.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const fp=p=>({path:p,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(p,root))).digest('hex')});
const outputs=['docs/planning/TASK_COMMITMENT_ALLOCATION_DRAFT.json','docs/planning/TASK_COMMITMENT_ALLOCATION_DRAFT.md','docs/planning/TASK_COMMITMENT_ALLOCATION_AUDIT.json'];
for(const p of outputs)assert(!fs.existsSync(new URL(p,root)),'Preserve prior artifact '+p);
const tables=fs.readdirSync(new URL('docs/formal/',root)).filter(p=>p.endsWith('ALLOCATION_TABLE.json')).map(p=>'docs/formal/'+p);
const previous=tables.map(p=>JSON.parse(read(p))),oldRecords=previous.flatMap(t=>t.records??[]),oldMembers=previous.flatMap(t=>t.members??[]);
assert.equal(Math.max(...oldRecords.map(r=>r.typeId)),369,'reviewed next record boundary');
const fields=[
 ['TaskCommitmentSpec',['HolderContentId','PredictionDefinitionId','DesiredMinimum','DesiredMaximum','ActiveFrom','Deadline']],
 ['TaskCommitmentKey',['CharacterId','TaskReferent']],
 ['TaskCommitmentStatus',['VariantTag','ObservationRef','ObservedAt']],
 ['TaskCommitmentState',['Commitments']],
 ['TaskMeasurementTargetRequirement',['SubjectAccessor','TaskSpecIds','TargetStatePathTemplate','OutputAccessor']],
 ['TaskMeasurementRegistration',['ExecutingSeamId','ExecutingSeamVersion','InputAdmission','ReadDomain','OutputDefinitions','WriteCapability','IngressDefinition','SubjectRequirements','TargetRequirements']],
 ['TaskDeadlineRegistration',['ExecutingSeamId','ExecutingSeamVersion','InputRecordSchema','ConsumerEventTypeId','ReadDomain','OutputDefinitions','WriteCapability','TargetStatePathTemplate','OutputAccessor']],
];
const closure='docs/planning/CAMPAIGN2_TASK_REGISTRATION_AND_STAGE_CLOSURE.md',review='docs/planning/CAMPAIGN2_TASK_LIFECYCLE_SHAPE_REVIEW.md',authority='docs/formal/TASK_COMMITMENTS.md';
const parsed=read(closure).split('\n').filter(x=>/^\| Task\w+ \|/.test(x)).map(x=>{const [,name,values]=x.split('|');return [name.trim(),values.trim().split(';').map(f=>f.trim().split(':')[0])];});
assert.deepEqual(parsed,fields,'independent symbolic field order');
const types={HolderContentId:'GovernedContentDefinitionId',PredictionDefinitionId:'RegistryDefinitionId',DesiredMinimum:'rational',DesiredMaximum:'rational',ActiveFrom:'SimInstant',Deadline:'SimInstant',CharacterId:'CharacterId',TaskReferent:'SemanticReferentId',VariantTag:'unsigned',ObservationRef:'237/1',ObservedAt:'SimInstant',Commitments:'map<371/1,372/1>',SubjectAccessor:'ProjectionAccessorId',TaskSpecIds:'set<RegistryDefinitionId>',TargetStatePathTemplate:'149/1',OutputAccessor:'ProjectionAccessorId',ExecutingSeamId:'SeamId',ExecutingSeamVersion:'text',InputAdmission:'274/1',ReadDomain:'set<149/1>',OutputDefinitions:'set<277/1>',WriteCapability:'322/1',IngressDefinition:'276/1',SubjectRequirements:'set<343/1>',TargetRequirements:'set<374/1>',InputRecordSchema:'254/1',ConsumerEventTypeId:'EventTypeId'};
const records=fields.map(([name,names],i)=>({typeId:370+i,schemaVersion:1,name,fields:names.map((name,j)=>({id:j+1,name,required:!['ObservationRef','ObservedAt'].includes(name),type:types[name]}))}));
assert(records.every(r=>r.fields.every(f=>f.type)));assert.equal(records.flatMap(r=>r.fields).length,34);
for(const r of records)assert(!oldRecords.some(x=>x.typeId===r.typeId));
const memberPairs=[[1004,'semantic-kind/task-commitment'],[1021,'validator/task-qualification'],[1036,'seam/task-commitment'],[1009,'TaskMeasurementSettlementTransition'],[1009,'TaskDeadlineSettlementTransition'],[1001,'event/task-measurement-settlement'],[1001,'event/task-measurement-settlement-padding'],[1001,'event/task-deadline'],[1026,'route/prospective-control'],[1031,'prospective-commitments'],[1032,'leaf/task-commitment'],[1025,'authority/prospective-commitments'],[1028,'accessor/task-commitment-prior'],[1023,'registry/task-commitment-spec']];
const reviewedMembers=read(review).split('\n').filter(x=>/^\| [A-Za-z0-9]+Id\/\d+ \|/.test(x)).map(x=>{const [,family,payload]=x.split('|');return [Number(family.trim().split('/')[1]),payload.trim()];});
assert.deepEqual(reviewedMembers,memberPairs,'independent full member coverage');
const members=memberPairs.map(([namespace,payload])=>({namespace,payload}));
assert.equal(new Set(members.map(x=>x.namespace+':'+x.payload)).size,14);
for(const m of members){assert(m.payload.normalize('NFC')===m.payload&&m.payload.length);assert(!oldMembers.some(x=>x.namespace===m.namespace&&x.payload===m.payload));}
const roleTypes={HolderContentId:1038,PredictionDefinitionId:1027,CharacterId:1002,TaskReferent:1002,SubjectAccessor:1028,OutputAccessor:1028,ExecutingSeamId:1036,ConsumerEventTypeId:1001};
const roles=records.flatMap(r=>r.fields.filter(f=>roleTypes[f.name]).map(f=>({recordTypeId:r.typeId,fieldId:f.id,requiredNamespace:roleTypes[f.name],domainValidatorId:f.name==='CharacterId'?'validator/character-qualification':f.name==='TaskReferent'?'validator/task-qualification':null})));
assert.equal(roles.length,10);
const mapKeyRoles=roles.filter(x=>x.recordTypeId===371).map(x=>({rootStateTypeId:373,keyFieldId:x.fieldId,requiredNamespace:x.requiredNamespace,domainValidatorId:x.domainValidatorId}));
const unionVariants=[{recordTypeId:372,schemaVersion:1,tag:1,name:'Open',requiredFields:[1],forbiddenFields:[2,3]},{recordTypeId:372,schemaVersion:1,tag:2,name:'PerceivedSatisfied',requiredFields:[1,2,3],forbiddenFields:[]},{recordTypeId:372,schemaVersion:1,tag:3,name:'DeadlineMissed',requiredFields:[1],forbiddenFields:[2,3]}];
const dir='docs/planning/campaign2-measurement-prediction-model/',freeze=JSON.parse(read(dir+'FREEZE.json')),manifest=JSON.parse(read(dir+'REVIEW_MANIFEST.json'));
const inherited=[...manifest.preservedSources,...freeze.authorityFingerprints,...freeze.sourceFingerprints,...freeze.files.map(f=>({path:dir+f.name,sha256:f.sha256}))];
for(const f of inherited)assert.deepEqual(fp(f.path),f);
const sourceFingerprints=[...new Map([...inherited,...tables.map(fp),...[authority,closure,review,'docs/planning/CAMPAIGN2_TASK_CYCLE_SELF_REVIEW_4.md'].map(fp)].map(f=>[f.path,f])).values()];
const value={version:'task-commitment-allocation/0.1-draft',status:'PROPOSED; NOT PERMANENT',authority,semanticVersion:'task-commitment/0.1-candidate',sourceFingerprints,records,namespaces:[],members,roles,mapKeyRoles,collectionIdentityChecks:[{recordTypeId:374,fieldId:2,container:'set',requiredNamespace:1027,domainValidatorId:null,owner:'task target receiving compiler; not scalar265 role'}],reusedRoles:[{recordTypeId:203,fieldId:2,requiredNamespace:1000},{recordTypeId:237,fieldId:2,requiredNamespace:1115}],unionVariants,occurrenceIdentities:[],newFailureCodes:['TASK_TARGET_COLLISION','TASK_STAGE_VIOLATION'],excluded:['runtime occurrence or task-instance namespace','future plan fields','workspace/appraisal/motive/option records','model activation or TC qualification']};
const json=JSON.stringify(value,null,2)+'\n';
const markdown=['# Task commitment allocation proposal','', 'Status: PROPOSED; NOT PERMANENT. Separate mechanical gate; no runtime activation.','',...records.flatMap(r=>[`## ${r.typeId}/${r.schemaVersion} ${r.name}`,'','| Field | Name | Required | Type |','|---|---|---|---|',...r.fields.map(f=>`| ${f.id} | ${f.name} | ${f.required} | ${f.type} |`),'']), '## Existing-family additions','','| Namespace | Exact payload |','|---|---|',...members.map(m=>`| ${m.namespace} | ${m.payload} |`),'','## Complete machine allocation','', 'The following canonical review object fixes roles, unions, exclusions and source fingerprints too.','', '```json',json.trimEnd(),'```',''].join('\n');
assert.deepEqual(JSON.parse(markdown.split('```json\n')[1].split('\n```')[0]),value);
for(const f of sourceFingerprints)assert.deepEqual(fp(f.path),f);
fs.writeFileSync(new URL(outputs[0],root),json);fs.writeFileSync(new URL(outputs[1],root),markdown);
const result={status:'MECHANICAL ALLOCATION REVIEW PASS; NOT PERMANENT',recordCount:records.length,fieldCount:34,memberCount:14,newNamespaces:0,recordRoles:roles.length,mapKeyRoles:mapKeyRoles.length,unionVariants:3,inheritedPreservationEntries:inherited.length,uniquePreservedSources:sourceFingerprints.length,checks:['accepted symbolic record/field order independently parsed','accepted member inventory independently parsed','prior record boundary369 and no370..376 collision','prior member absence and exact NFC','complete role/collection ownership','three closed status variants and exact optional payload coverage','complete Markdown/machine object parity','all inherited artifact fingerprints unchanged'],artifacts:outputs.slice(0,2).map(fp),sourceFingerprints,limitations:['No numeric permanence until separately recorded freeze.','No canonical construction, profile enforcement or TC runtime proof.']};
fs.writeFileSync(new URL(outputs[2],root),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,records:7,fields:34,members:14,preserved:sourceFingerprints.length}));
