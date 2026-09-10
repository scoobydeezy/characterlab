// Symbolic planning inventory. No runtime schemas, numeric allocation or codecs.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {createHash} from 'node:crypto';
const output='docs/planning/CAMPAIGN3_EMBODIED_SYMBOLIC_INVENTORY_REV1.json';
assert(!fs.existsSync(output),'preserve inventory receipt; use a new revision');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const source=`
ReserveParameters|UnitId,Capacity,ConsumptionRate
ReserveAnchor|AmountAtAnchor,AnchorInstant
ReserveState|Anchors
ReserveBodyBinding|CharacterId,ReserveParameterDefinitionId
ReserveBodyRegistryDefinition|Bindings
LevelChannelDefinition|ObserverId,UnitId,ModalityId,Capacity,BinWidth,Available,Permitted
LevelSamplingOpportunity|ObserverId,ChannelDefinitionId
PressureDefinition|ChannelDefinitionId,Threshold
EmbodiedLevelObservation|ObservationId,ObserverId,ObservationChannelId,OccurredAt,FiniteLevelInterval,TransformationVersion
FiniteLevelInterval|Lower,Upper
UnavailableLevelSample|ObservationId,ObserverId,ObservationChannelId,OccurredAt,TransformationVersion
EmbodiedPressureOutput|PressureOccurrenceId,CharacterId,Sample,PressureResult,TransformationVersion
LevelSourceRegistration|ProducingSeamId,ProducingSeamVersion,SourceDefinition,SourceOrigin
LevelSourceDefinition|InputRecordSchema,ReadDomain,RequiredProjections,ChannelDefinitions,BodyBindingDefinitionId,OutputChoice,WriteCapability
LevelInputOnlyOrigin|EventTypeId,Phase
LevelSampleOutputChoice|PresentOutputDefinition,UnavailableOutputDefinition
PresentPressureRegistration|OwningSeamId,SeamVersion,Definition,Ingress
UnavailablePressureRegistration|OwningSeamId,SeamVersion,Definition,Ingress
PresentPressureTransitionDefinition|InputAdmission,ReadDomain,OutputDefinitions,WriteCapability,RequiredProjections,PressureDefinitionId
UnavailablePressureTransitionDefinition|InputAdmission,ReadDomain,OutputDefinitions,WriteCapability,RequiredProjections,PressureDefinitionId
PresentLevelInputAdmission|InputRecordSchema,PresentWithFrozenSupport
UnavailableLevelInputAdmission|InputRecordSchema,UnavailableOpportunityResult
PresentWithFrozenSupport|SamplingProducerDefinitionId,SamplingSeamVersion,SampleEventType,SamplePhase,SampleSchema,SEMSeamVersion,Lane,FreezeEventType,FreezePhase,FrozenSchema,SupportRule
UnavailableOpportunityResult|SamplingProducerDefinitionId,SamplingSeamVersion,SampleEventType,SamplePhase,SampleSchema,SettlementEventType,SettlementPhase,ResultRule
ReserveReplenishmentDefinition|CharacterId,ReserveParameterDefinitionId,UnitId,DeliveredAmount
ReserveReplenishmentInput|ReplenishmentDefinitionId
ReserveReplenishmentResult|Before,PotentialEffect,Applied,Overflow,After
ReserveReplenishmentRegistration|OwningSeamId,SeamVersion,InputRecordSchema,InputOrigin,DefinitionIds,BodyBindingDefinitionId,ReadDomain,WritableFamilies,MutationAuthorityId,OutputRecordSchema
`.trim();
const records=source.split('\n').map(line=>{const [name,fields]=line.split('|');return {name,orderedFields:fields.split(','),numericAllocation:'NONE',exactFieldTypes:'OPEN SYM-1'};});
assert.equal(new Set(records.map(r=>r.name)).size,records.length);
for(const r of records)assert.equal(new Set(r.orderedFields).size,r.orderedFields.length,r.name);
const unions=[
 {name:'EmbodiedSample',variants:[{name:'Present',payload:'EmbodiedLevelObservation'},{name:'Unavailable',payload:'UnavailableLevelSample'}]},
 {name:'PressureResult',variants:[{name:'Known',fields:['Value'],payload:'ExactRational'},{name:'Unavailable',fields:[],payload:'NONE'}]},
 {name:'LevelChainCarrier',variants:[{name:'Present',fields:['Sample','ReservedExperienceId'],sampleSchema:'EmbodiedLevelObservation'},{name:'Unavailable',fields:['Sample'],sampleSchema:'UnavailableLevelSample'}]},
];
for(const u of unions)assert.equal(new Set(u.variants.map(v=>v.name)).size,u.variants.length);
const docs=['CAMPAIGN3_EMBODIED_SYMBOLIC_CONSOLIDATION.md','CAMPAIGN3_EMBODIED_MOTIVATION_DRAFT.md','CAMPAIGN3_EMBODIED_OBSERVATION_ADMISSION_DRAFT.md','CAMPAIGN3_EMBODIED_INGRESS_SCHEDULING_DRAFT.md','CAMPAIGN3_EMBODIED_REGISTRATION_ACCESSOR_DRAFT.md','CAMPAIGN3_EMBODIED_REPLENISHMENT_PROFILE_DRAFT.md'].map(p=>'docs/planning/'+p);
let links=0;for(const p of docs)for(const m of fs.readFileSync(p,'utf8').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
 if(/^(https?:|#)/.test(m[1]))continue;assert(fs.existsSync(path.resolve(path.dirname(p),m[1].split('#')[0])),p+': '+m[1]);links++;
}
const frozen=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));
for(const f of frozen.checks)assert.equal(hash(f.path),f.sha256,f.path);
const evidence=['CAMPAIGN3_SUPPORT_ONLY_SEM_COMPONENT_REV1.json','CAMPAIGN3_BODY_PROJECTION_SUBSTRATE_REV1.json','CAMPAIGN3_REPLENISHMENT_STATE_SUBSTRATE_REV1.json'].map(p=>'docs/planning/'+p);
for(const p of evidence)for(const f of JSON.parse(fs.readFileSync(p)).sourceFingerprints)assert.equal(hash(f.path),f.sha256,f.path);
const report={status:'CONSOLIDATED SYMBOLIC INVENTORY; WHOLE SHAPE WITHHELD',records,unions,
 openGates:['SYM-1 codec types','SYM-2 vocabulary/dispatch','SYM-3 profile witness'],
 checks:{uniqueRecordNames:records.length,uniqueUnionNames:unions.length,localLinks:links,preservedChecks:frozen.checks.length},
 limitation:'Names and ordered fields only. Union tags, exact codec types, member payload closure and profile fixtures remain open. No EMB vectors executed.',
 sources:docs.map(path=>({path,sha256:hash(path)})),evidence:evidence.map(path=>({path,sha256:hash(path)})),
 script:{path:'scripts/inventory-campaign3-embodied-symbols.mjs',sha256:hash('scripts/inventory-campaign3-embodied-symbols.mjs')}};
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,records:records.length,unions:unions.length,links,preservedChecks:frozen.checks.length}));
