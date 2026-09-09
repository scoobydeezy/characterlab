// Separate mechanical allocation review; never activates a model or runtime.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const draft='docs/planning/MEASUREMENT_PREDICTION_ALLOCATION_DRAFT.json';
const md='docs/planning/MEASUREMENT_PREDICTION_ALLOCATION_DRAFT.md';
const audit='docs/planning/MEASUREMENT_PREDICTION_ALLOCATION_AUDIT.json';
for(const p of [draft,md,audit])assert(!fs.existsSync(new URL(p,root)),'Preserve existing artifact: '+p);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const fp=p=>({path:p,sha256:crypto.createHash('sha256').update(read(p)).digest('hex')});
const tables=fs.readdirSync(new URL('docs/formal/',root)).filter(x=>x.endsWith('ALLOCATION_TABLE.json')).map(x=>'docs/formal/'+x);
const previous=tables.map(p=>JSON.parse(read(p)));
const previousRecords=previous.flatMap(x=>x.records??[]),previousNamespaces=previous.flatMap(x=>x.namespaces??[]),previousMembers=previous.flatMap(x=>x.members??[]);
assert.equal(Math.max(...previousRecords.map(x=>x.typeId)),358);
assert.equal(Math.max(...previousNamespaces.map(x=>x.namespace)),1126);
const definitionFields=[
 ['MeasurementPredictionDefinition',['SourceChannelId','ObservedSubjectId','UnitId','MaxEvidenceCount']],
 ['MeasurementPredictionKey',['CharacterId','PredictionDefinitionId']],
 ['MeasurementPrediction',['ExpectedReading','EvidenceBasis']],
 ['MeasurementPredictionState',['Predictions']],
 ['MeasurementPredictionTargetRequirement',['SubjectAccessor','PredictionDefinitionId','TargetStatePathTemplate','OutputAccessor']],
 ['MeasurementPredictionApplicationRegistration',['ExecutingSeamId','ExecutingSeamVersion','PredictionDefinitionId','InputAdmission','ReadDomain','OutputDefinitions','WriteCapability','IngressDefinition','SubjectRequirements','TargetRequirements']],
 ['MeasurementPredictionReadCue',['ObserverId','PredictionDefinitionId']],
 ['MeasurementPredictionReadout',['MeasurementPredictionReadoutId','Key','Prediction']],
 ['MeasurementPredictionReadOutputDefinition',['OutputRecordSchema','OutputOccurrenceRule']],
 ['MeasurementPredictionReadRegistration',['ExecutingSeamId','ExecutingSeamVersion','PredictionDefinitionId','InputRecordSchema','OpportunityDefinitionId','ReadDomain','OutputDefinitions','WriteCapability','SubjectRequirements','TargetRequirements']],
 ['MeasurementPredictionOpportunityDefinition',['ProducingTransitionKind','ApplicationEventTypeId','ReadEventTypeId','PredictionDefinitionId','ReadDelay']],
];
const symbolic=read('docs/planning/CAMPAIGN2_MEASUREMENT_PREDICTION_SYMBOLIC_CLOSURE.md');
const parsed=symbolic.split('\n').filter(x=>/^\| MeasurementPrediction\w* \|/.test(x)).map(x=>{const [,name,fields]=x.split('|');return [name.trim(),fields.trim().split(';').map(f=>f.trim().split(':')[0])];});
assert.deepEqual(parsed,definitionFields,'Independent symbolic field-order coverage');
const types={SourceChannelId:'ObservationChannelId',ObservedSubjectId:'CharacterId',UnitId:'ObservationUnitId',MaxEvidenceCount:'unsigned',CharacterId:'CharacterId',PredictionDefinitionId:'RegistryDefinitionId',ExpectedReading:'rational',EvidenceBasis:'set<237/1>',Predictions:'map<360/1,361/1>',SubjectAccessor:'ProjectionAccessorId',TargetStatePathTemplate:'StatePathPattern',OutputAccessor:'ProjectionAccessorId',ExecutingSeamId:'SeamId',ExecutingSeamVersion:'text',InputAdmission:'274/1',ReadDomain:'set<StatePathPattern>',IngressDefinition:'276/1',TargetRequirements:'set<363/1>',ObserverId:'ObserverId',MeasurementPredictionReadoutId:'MeasurementPredictionReadoutId',Key:'360/1',Prediction:'361/1',OutputRecordSchema:'254/1',OutputOccurrenceRule:'275/1',InputRecordSchema:'254/1',OpportunityDefinitionId:'RegistryDefinitionId',ProducingTransitionKind:'TransitionKindId',ApplicationEventTypeId:'EventTypeId',ReadEventTypeId:'EventTypeId',ReadDelay:'signed SimDuration'};
const records=definitionFields.map(([name,fields],i)=>({typeId:359+i,schemaVersion:1,name,fields:fields.map((name,j)=>({id:j+1,name,required:true,type:name==='OutputDefinitions'?(i===5?'set<277/1>':'set<367/1>'):name==='WriteCapability'?(i===5?'322/1':'273/1'):name==='SubjectRequirements'?(i===5?'set<343/1>':'set<266/1>'):types[name]}))}));
assert(records.every(r=>r.fields.every(f=>f.type)));
const memberPairs=[[1036,'seam/measurement-prediction'],[1009,'MeasurementPredictionApplicationTransition'],[1009,'MeasurementPredictionReadTransition'],[1001,'event/measurement-prediction-application'],[1001,'event/measurement-prediction-read'],[1001,'event/measurement-prediction-application-padding'],[1001,'event/measurement-prediction-read-padding'],[1027,'definition/measurement-prediction'],[1027,'definition/measurement-prediction-opportunity'],[1023,'registry/measurement-prediction'],[1023,'registry/measurement-prediction-opportunity'],[1025,'authority/belief-expectation'],[1032,'leaf/measurement-prediction'],[1028,'accessor/measurement-prediction-prior'],[1028,'accessor/measurement-prediction-read']];
const members=memberPairs.map(([namespace,payload])=>({namespace,payload}));
assert.equal(members.length,15);assert.equal(new Set(members.map(x=>x.namespace+':'+x.payload)).size,15);
for(const m of members){assert(symbolic.includes(m.payload));assert(!previousMembers.some(p=>p.namespace===m.namespace&&p.payload===m.payload));}
const roleFamilies={SourceChannelId:1005,ObservedSubjectId:1002,UnitId:1039,CharacterId:1002,PredictionDefinitionId:1027,SubjectAccessor:1028,OutputAccessor:1028,ExecutingSeamId:1036,ObserverId:1000,MeasurementPredictionReadoutId:1127,OpportunityDefinitionId:1027,ProducingTransitionKind:1009,ApplicationEventTypeId:1001,ReadEventTypeId:1001};
const roles=records.flatMap(r=>r.fields.filter(f=>roleFamilies[f.name]).map(f=>({recordTypeId:r.typeId,fieldId:f.id,requiredNamespace:roleFamilies[f.name],domainValidatorId:roleFamilies[f.name]===1002?'validator/character-qualification':null})));
assert.equal(roles.length,20);
const preservedPaths=[...tables,'docs/formal/MEASUREMENT_PREDICTION.md','docs/planning/CAMPAIGN2_MEASUREMENT_PREDICTION_RESEARCH_TARGET.md','docs/planning/CAMPAIGN2_MEASUREMENT_PREDICTION_DRAFT.md','docs/planning/CAMPAIGN2_MEASUREMENT_PREDICTION_SYMBOLIC_CLOSURE.md','docs/planning/CAMPAIGN2_MEASUREMENT_PREDICTION_SHAPE_REVIEW.md'];
const sourceFingerprints=preservedPaths.map(fp);
const value={version:'measurement-prediction-allocation/0.1-draft',status:'PROPOSED ALLOCATION; NOT PERMANENT',authority:'docs/formal/MEASUREMENT_PREDICTION.md',semanticVersion:'measurement-prediction/0.1-candidate',sourceFingerprints,records,namespaces:[{namespace:1127,name:'MeasurementPredictionReadoutId',scope:'run-scoped occurrence',payload:'unsigned-runtime-ordinal'}],members,roles,reusedRoles:[{recordTypeId:203,fieldId:2,requiredNamespace:1000,domainValidatorId:null},{recordTypeId:237,fieldId:2,requiredNamespace:1115,domainValidatorId:null}],occurrenceIdentities:[{recordTypeId:366,schemaVersion:1,identityFieldId:1,requiredNamespace:1127,domainValidatorId:null}],unionVariants:[],finiteValues:[],newFailureCodes:['PREDICTION_OBSERVATION_ALREADY_APPLIED','PREDICTION_EVIDENCE_LIMIT_EXCEEDED','PREDICTION_TARGET_COLLISION','PREDICTION_STAGE_VIOLATION'],excluded:['new application/cue/observation occurrence identity','new learning route or evidence union variant','new state-family identity','existing model/corpus/allocation changes','runtime implementation or PRED qualification']};
const markdown=['# Measurement prediction allocation — draft','',`Version: ${value.version}. Status: ${value.status}.`,'','Mechanical realization of the accepted symbolic shape. No model activation.','','| Type | Schema | Name | Required fields (id:name:type) |','|---:|---:|---|---|',...records.map(r=>`| ${r.typeId} | ${r.schemaVersion} | ${r.name} | ${r.fields.map(f=>`${f.id}:${f.name}:${f.type}`).join('; ')} |`),'','Namespace1127: MeasurementPredictionReadoutId, unsigned shared runtime ordinal.','One output occurrence rule:366/schema1, field1, required namespace1127.','','| Namespace | Permanent-member proposal |','|---:|---|',...members.map(x=>`| ${x.namespace} | ${x.payload} |`),'','| Record | Field | Required namespace | Domain validator |','|---:|---:|---:|---|',...roles.map(x=>`| ${x.recordTypeId} | ${x.fieldId} | ${x.requiredNamespace} | ${x.domainValidatorId??'absent'} |`),'','No new union/finite tag, cue/application occurrence, family identity, state operation or save field.','Numeric review is separate from runtime qualification. PRED-A..P remain NOT PASSED.',''].join('\n');
// Compare rendered rows back to machine data, rather than asserting generation alone.
const rendered=markdown.split('\n').filter(x=>/^\| 3\d\d \| 1 \| Measurement/.test(x)).map(line=>{const p=line.split('|').map(x=>x.trim());return {typeId:Number(p[1]),schemaVersion:Number(p[2]),name:p[3],fields:p[4].split('; ').map(s=>{const [id,name,...t]=s.split(':');return {id:Number(id),name,required:true,type:t.join(':')};})};});
assert.deepEqual(rendered,records);
assert.equal(new Set(records.map(r=>r.typeId)).size,11);
for(const r of records)assert(!previousRecords.some(p=>p.typeId===r.typeId));
assert(!previousNamespaces.some(p=>p.namespace===1127));
assert.deepEqual(preservedPaths.map(fp),sourceFingerprints);
fs.writeFileSync(new URL(draft,root),JSON.stringify(value,null,2)+'\n');
fs.writeFileSync(new URL(md,root),markdown);
const result={status:'NUMERIC ALLOCATION AUDIT PASS; NOT RUNTIME QUALIFICATION',records:11,fields:records.reduce((n,r)=>n+r.fields.length,0),members:15,roles:20,namespaces:1,occurrenceIdentities:1,checks:['independent symbolic record/field coverage','append-only record and occurrence namespace availability across all prior Campaign2 allocation tables','member uniqueness and prior exclusion','identity-role position coverage','Markdown/machine record parity','prior source bytes preserved'],reviewedArtifacts:[fp(draft),fp(md)],sourceFingerprints};
fs.writeFileSync(new URL(audit,root),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,records:records.map(x=>x.typeId),fields:result.fields,members:15,roles:20,namespace:1127},null,2));
