import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_CALIBRATION_DEFINITIONS_REV1.json',output='docs/planning/GA_CALIBRATION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const p=JSON.parse(fs.readFileSync(source));
function validate(p){
 assert.equal(p.records.length,12);assert.equal(new Set(p.records.map(r=>r.name)).size,12);
 assert.deepEqual(p.newIdentityFamilies,[]);assert.deepEqual(p.numericAllocations,[]);
 const row=n=>p.records.find(r=>r.name===n),field=(n,f)=>row(n).fields.find(x=>x.name===f).type;
 assert.deepEqual(row('ObservationExecutionPolicy').fields.map(f=>f.name),['BodySelection','VisualSelection','Spatial','Encoding','BodyRecall','GoalBaselineRecall','EventRecall','GoalQualification']);
 for(const f of row('ObservationExecutionPolicy').fields)assert.deepEqual(f.type,{kind:'optional',value:{kind:'ref',name:'DefinitionId'}});
 assert.deepEqual(row('GeneralBodyRecallCalibration').fields,[{name:'Capacity',type:{kind:'ref',name:'RecallCount'}}]);
 assert.deepEqual(row('GeneralRetentionCalibration').fields.map(f=>f.name),['EventSlots','BodySlots','Priority']);
 assert.deepEqual(field('GeneralRetentionCalibration','Priority').values,['AgeOnly','UseOnly','SharedProtection','SignificanceFirst']);
 assert.deepEqual(field('GeneralEncodingCalibration','Law').values,['Independent','HistoricalShared','HistoricalHybrid','RetiredFlat']);
 assert.deepEqual(field('GeneralGoalQualificationCalibration','Law').values,['BothDirections','DeteriorationOnly']);
 assert.equal(field('GeneralEncodingCalibration','BudgetFloor').name,'PositiveUnitRational');
 for(const [n,min,max]of [['GraphScale',1,1000],['DecayExponent',1,16],['RecallCount',0,32],['MemorySlotCount',0,1024],['GraphNodeCount',0,30],['GraphEdgeCount',0,870],['SignalLimit',1,3],['SignalViewLimit',1,3],['SignalByteLimit',1,65536],['SignalCount',0,3]])assert.deepEqual(p.primitives[n],{canonical:'unsigned',min,max});
 assert(p.refinements.access.includes('Beta strictly below1'));assert(p.refinements.graph.includes('Edges<=Nodes*(Nodes-1)'));assert(p.refinements.retention.includes('B0'));assert(p.refinements.execution.includes('independently bound capacities'));
 for(const r of p.records)assert(!r.fields.some(f=>['Id','Truth','SourceArchive','Reward','UnitExchangeRate'].includes(f.name)));
 assert.deepEqual(p.definitionBindings['body-selection'],['GeneralBodySelectionCalibration']);
 assert.deepEqual(p.definitionBindings['goal-assessment'],['GeneralGoalQualificationCalibration']);
}
validate(p);
const faults=[
 ['graph-exceeds-carrier',p=>p.primitives.GraphNodeCount.max=32],
 ['graph-opens-self-edges',p=>p.primitives.GraphEdgeCount.max=900],
 ['recall-requires-storage',p=>p.primitives.RecallCount.min=1],
 ['body-gate-unbounded',p=>p.primitives.SignalLimit.max=32],
 ['merge-recall-policy-slots',p=>p.records.find(r=>r.name==='ObservationExecutionPolicy').fields.splice(5,1)],
 ['new-policy-identity',p=>p.newIdentityFamilies.push('PolicyId')],
 ['early-allocation',p=>p.numericAllocations.push(999)],
 ['body-recall-graph-coupling',p=>p.records.find(r=>r.name==='GeneralBodyRecallCalibration').fields.push({name:'Graph',type:{kind:'ref',name:'DefinitionId'}})],
 ['erase-retired-control',p=>p.records.find(r=>r.name==='GeneralEncodingCalibration').fields[0].type.values.pop()],
 ['current-credit-ranks',p=>p.refinements.retention='Rank current metadata'],
 ['baseline-as-occurrence',p=>p.records.find(r=>r.name==='ObservationExecutionPolicy').fields[5].type.value.name='ExperienceId'],
 ['truth-parameter',p=>p.records[0].fields.push({name:'Truth',type:{kind:'ref',name:'WorldEventTruth'}})]
 ].map(([name,mutate])=>{const x=structuredClone(p);mutate(x);assert.throws(()=>validate(x),name);return {name,rejected:true};});
const profile=JSON.parse(fs.readFileSync('docs/planning/GA_SOURCE_PROFILE_DECLARATIONS_REV2.json'));
assert.deepEqual(profile.records.find(r=>r.name==='ObservationUsePlan').fields.at(-1),{name:'ExecutionPolicy',type:{kind:'ref',name:'DefinitionId'}});
for(const s of p.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'BOUNDED SYMBOLIC CALIBRATION REVIEW PASS; PUBLIC GATES OPEN',records:12,faults,sources:[source,'docs/planning/GA_SOURCE_PROFILE_DECLARATIONS_REV2.json','src/campaign3/observationExecutionPolicy.ts','src/test/observationExecutionPolicy.test.ts','scripts/review-ga-calibration-definitions.mjs'].map(fp),limits:['No numeric allocation, exact model instance, public schema/value admission or runtime activation.','Role coverage and component purpose binding are separate evidence; this audit does not execute canonical definition compilation.']},null,2)+'\n');
