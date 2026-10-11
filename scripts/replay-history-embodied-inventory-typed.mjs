// Planning type inventory only. Not a runtime codec or numeric allocation.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const out='docs/planning/CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV1.json';

const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const priorPath='docs/planning/CAMPAIGN3_EMBODIED_SYMBOLIC_INVENTORY_REV1.json';
const prior=JSON.parse(fs.readFileSync(priorPath));
const external={CanonicalRecordSchemaRef:'254/1',StatePathPattern:'149/1',EventDependentProjectedFieldRequirement:'266/1',TransitionOutputDefinition:'277/1',WriteCapabilityV04:'273/1'};
const ids={ObserverId:'1000',CharacterId:'1002 + character qualification',ObservationId:'1115',ExperienceId:'1106',PressureOccurrenceId:'UNALLOCATED',ObservationChannelId:'1005',DefinitionId:'1027',SeamId:'1036',EventTypeId:'1001',MutationAuthorityId:'1025',ObservationUnitId:'1039',ModalityId:'1006'};
// Namespace names below are checked against the actual accepted schema catalogue separately.
const types={
 UnitId:'id:ObservationUnitId',Capacity:'rational',ConsumptionRate:'rational',AmountAtAnchor:'rational',AnchorInstant:'SimInstant',
 Anchors:'map<id:CharacterId;ReserveAnchor>',CharacterId:'id:CharacterId',ReserveParameterDefinitionId:'id:DefinitionId',Bindings:'set<ReserveBodyBinding>',
 ObserverId:'id:ObserverId',ModalityId:'id:ModalityId',BinWidth:'rational',Available:'boolean',Permitted:'boolean',ChannelDefinitionId:'id:DefinitionId',Threshold:'rational',
 ObservationId:'id:ObservationId',ObservationChannelId:'id:ObservationChannelId',OccurredAt:'SimInstant',FiniteLevelInterval:'FiniteLevelInterval',TransformationVersion:'text',Lower:'rational',Upper:'rational',
 PressureOccurrenceId:'id:PressureOccurrenceId',Sample:'EmbodiedSample',PressureResult:'PressureResult',ProducingSeamId:'id:SeamId',ProducingSeamVersion:'text',
 SourceDefinition:'LevelSourceDefinition',SourceOrigin:'LevelInputOnlyOrigin',InputRecordSchema:'CanonicalRecordSchemaRef',ReadDomain:'set<StatePathPattern>',RequiredProjections:'set<EventDependentProjectedFieldRequirement>',
 ChannelDefinitions:'set<id:DefinitionId>',BodyBindingDefinitionId:'id:DefinitionId',OutputChoice:'LevelSampleOutputChoice',WriteCapability:'WriteCapabilityV04',EventTypeId:'id:EventTypeId',Phase:'unsigned',
 PresentOutputSchema:'CanonicalRecordSchemaRef',UnavailableOutputSchema:'CanonicalRecordSchemaRef',OwningSeamId:'id:SeamId',SeamVersion:'text',Ingress:'LevelPressureIngressDefinition',
 OutputDefinitions:'set<TransitionOutputDefinition>',PressureDefinitionId:'id:DefinitionId',PresentWithFrozenSupport:'PresentWithFrozenSupport',UnavailableOpportunityResult:'UnavailableOpportunityResult',
 SamplingProducerDefinitionId:'id:DefinitionId',SamplingSeamVersion:'text',SampleEventType:'id:EventTypeId',SamplePhase:'unsigned',SampleSchema:'CanonicalRecordSchemaRef',SEMSeamVersion:'text',Lane:'unsigned',
 FreezeEventType:'id:EventTypeId',FreezePhase:'unsigned',FrozenSchema:'CanonicalRecordSchemaRef',SupportRule:'unsigned',SettlementEventType:'id:EventTypeId',SettlementPhase:'unsigned',ResultRule:'unsigned',
 DeliveredAmount:'rational',ReplenishmentDefinitionId:'id:DefinitionId',Before:'rational',PotentialEffect:'rational',Applied:'rational',Overflow:'rational',After:'rational',
 InputOrigin:'LevelInputOnlyOrigin',DefinitionIds:'set<id:DefinitionId>',WritableFamilies:'set<StatePathPattern>',MutationAuthorityId:'id:MutationAuthorityId',OutputRecordSchema:'CanonicalRecordSchemaRef',
 VariantTag:'unsigned',Value:'rational',ReservedExperienceId:'id:ExperienceId',ConsumerEventTypeId:'id:EventTypeId',ConsumerPhase:'unsigned',
};
const records=prior.records.map(r=>({name:r.name,orderedFields:r.name==='LevelSampleOutputChoice'?['PresentOutputSchema','UnavailableOutputSchema']:r.orderedFields}));
records.find(r=>r.name==='LevelChannelDefinition').orderedFields=['ObservationChannelId',...records.find(r=>r.name==='LevelChannelDefinition').orderedFields];
records.push({name:'PressureResult',orderedFields:['VariantTag','Value']},{name:'LevelChainCarrier',orderedFields:['VariantTag','Sample','ReservedExperienceId']},{name:'LevelPressureIngressDefinition',orderedFields:['ConsumerEventTypeId','ConsumerPhase']});
for(const r of records){r.fields=r.orderedFields.map(name=>{
 let type=types[name];
 if(name==='Definition')type=r.name==='PresentPressureRegistration'?'PresentPressureTransitionDefinition':'UnavailablePressureTransitionDefinition';
 if(name==='InputAdmission')type=r.name==='PresentPressureTransitionDefinition'?'PresentLevelInputAdmission':'UnavailableLevelInputAdmission';
 assert(type,r.name+'.'+name+' missing type');
 return {name,type,required:!((r.name==='PressureResult'&&name==='Value')||(r.name==='LevelChainCarrier'&&name==='ReservedExperienceId'))};
 });delete r.orderedFields;r.allocation='NONE';}
const aliases={EmbodiedSample:['EmbodiedLevelObservation','UnavailableLevelSample']};
const names=new Set([...records.map(r=>r.name),...Object.keys(external),...Object.keys(aliases),'rational','SimInstant','text','unsigned','boolean']);
function check(t){if(t.startsWith('set<'))return check(t.slice(4,-1));if(t.startsWith('map<')){const [a,b]=t.slice(4,-1).split(';');check(a);return check(b);}if(t.startsWith('id:'))return assert(t.slice(3) in ids,t);assert(names.has(t),t);}
for(const r of records)for(const f of r.fields)check(f.type);
const unionMatrices=[
 {record:'PressureResult',variants:[{tag:'Known',required:['VariantTag','Value'],forbidden:[]},{tag:'Unavailable',required:['VariantTag'],forbidden:['Value']}]},
 {record:'LevelChainCarrier',variants:[{tag:'Present',required:['VariantTag','Sample','ReservedExperienceId'],forbidden:[],sampleSchema:'EmbodiedLevelObservation'},{tag:'Unavailable',required:['VariantTag','Sample'],forbidden:['ReservedExperienceId'],sampleSchema:'UnavailableLevelSample'}]},
];
for(const m of unionMatrices){const fields=records.find(r=>r.name===m.record).fields.map(f=>f.name);for(const v of m.variants){assert.equal(new Set([...v.required,...v.forbidden]).size,fields.length);assert(fields.every(f=>v.required.includes(f)||v.forbidden.includes(f)));}}
const frozen=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));
for(const f of frozen.checks)assert.equal(auditFingerprint(f.path).sha256,f.sha256,f.path);
const report={status:'SYM-1 FIELD-TYPE PROPOSAL COMPLETE; WHOLE SHAPE WITHHELD',records,typeAliases:aliases,externalSchemaReferences:external,identityRoles:ids,unionMatrices,
 numericTags:'UNALLOCATED; symbolic tags are mapped only at separate numeric gate',
 semantics:'See CAMPAIGN3_EMBODIED_FIELD_TYPE_REVIEW.md for role/value refinements, conditional output count, ingress and collection rules.',
 checks:{records:records.length,fields:records.reduce((n,r)=>n+r.fields.length,0),allTypeReferencesResolved:true,preservedChecks:frozen.checks.length},
 previousInventory:{path:priorPath,sha256:hash(priorPath)},script:{path:'scripts/type-campaign3-embodied-symbols.mjs',sha256:hash('scripts/type-campaign3-embodied-symbols.mjs')}};
compareAudit(out,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.checks));

function auditFingerprint(path){
 const sha256=createHash('sha256').update(fs.readFileSync(path)).digest('hex');
 const expected=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json')).checks.find(x=>x.path===path);
 if(!expected||expected.sha256===sha256)return {path,sha256};
 const a=JSON.parse(fs.readFileSync('docs/planning/campaign3-history-source-roles-rev138/index.json')).explicitBackingOutsideProseManifest.find(x=>x.sha256===expected.sha256);
 assert(a,'missing exact archive '+path);assert.equal(createHash('sha256').update(fs.readFileSync(a.path)).digest('hex'),expected.sha256);
 return {path,sha256:expected.sha256};
}
function compareAudit(original,json){
 assert.deepEqual(JSON.parse(json),JSON.parse(fs.readFileSync(original)));
 const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
 const report={status:'PASS',original:fp(original),scope:'Original inventory calculations/assertions retained; exact historical cognitive preservation hashes checked through archived bytes. No new runtime qualification or original writes.',checker:fp('scripts/replay-history-embodied-inventory-typed.mjs')};
 const dir='docs/planning/campaign3-history-embodied-inventories-rev1';fs.mkdirSync(dir,{recursive:true});const target=dir+'/typed.json';
 if(fs.existsSync(target))assert.deepEqual(JSON.parse(fs.readFileSync(target)),report);else fs.writeFileSync(target,JSON.stringify(report,null,2)+'\n');
}
