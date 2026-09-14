import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const path='docs/planning/GA_OUTPUT_DECLARATIONS_REV2.json',out='docs/planning/GA_OUTPUT_DECLARATIONS_REVIEW_REV1.json';
assert(!fs.existsSync(out));
const packet=JSON.parse(fs.readFileSync(path)),topology=JSON.parse(fs.readFileSync('docs/planning/GA_COMPOSED_LOGICAL_TOPOLOGY_REV1.json'));
const attention=JSON.parse(fs.readFileSync('docs/formal/ATTENTION_ALLOCATION_TABLE.json'));
const inherited={...attention.identifierAliases,WorkspaceOccurrenceId:1128,AppraisalOccurrenceId:1129,ConcernOccurrenceId:1130};
const symbolic=['AcquisitionOccurrenceId','GoalOutcomeAssessmentId','RetainedAttributionResultId','ProposedRecollectionOccurrenceId'];
const row=(p,s,r)=>p.stages.find(x=>x.name===s).outputs.find(x=>x.record===r);
function validate(p){
 assert.equal(p.stages.length,topology.stages.length);
 assert.equal(new Set(p.stages.map(s=>s.name)).size,p.stages.length);
 assert.deepEqual(p.numericAllocations,[]);assert.equal(p.wholeModelWorkCeiling,null);
 const newFamilies=new Set();
 for(const stage of p.stages){
  const original=topology.stages.find(s=>s.name===stage.name);assert(original);assert.equal(stage.phase,original.phase);
  assert.deepEqual(stage.outputs.map(x=>x.record),original.outputs);
  if(stage.phase===140)assert.deepEqual(stage.outputs,[]);
  for(const r of stage.outputs){
   assert(Number.isInteger(r.min)&&Number.isInteger(r.max)&&r.min>=0&&r.min<=r.max&&r.max<=32);
   assert.equal(typeof r.condition,'string');assert(r.condition.length>0);
   assert(['FreshOwned','NestedOwnedAndReserved','BorrowedOnly','ObserverFileCounter','ReservedOwned'].includes(r.identity));
   for(const family of [...r.fresh,...(r.reserved??[])]){assert(Object.hasOwn(inherited,family)||symbolic.includes(family),'unknown identity family '+family);if(symbolic.includes(family))newFamilies.add(family);}
   if(['BorrowedOnly','ObserverFileCounter','ReservedOwned'].includes(r.identity))assert.deepEqual(r.fresh,[]);
   if(r.identity==='FreshOwned')assert.equal(r.fresh.length,1);
  }
 }
 assert.deepEqual([...newFamilies].sort(),symbolic.slice().sort());
 for(const lane of ['current','consequence']){
  const freeze=row(p,lane+'-freeze','PreRecognitionSemanticExperience');assert.equal(freeze.identity,'ReservedOwned');assert.deepEqual(freeze.reserved,['ExperienceId']);assert.equal(freeze.min,0);assert.equal(freeze.max,1);
  const sample=row(p,lane+'-sample','CompletedRequestedSamples');assert.equal(sample.identity,'NestedOwnedAndReserved');assert.deepEqual(sample.fresh,['ObservationId','DetectionOccurrenceId','EventDetectionOccurrenceId','ExperienceId']);assert.equal(sample.rules.length,5);assert(sample.rules[4].includes('No occurrence'));
  for(const [stage,record] of [['visual-selection','AttentionSelectionAudit'],['body-selection','BodySelectionAudit']]){const s=row(p,lane+'-'+stage,record);assert.equal(s.min,1);assert.equal(s.max,1);assert.deepEqual(s.fresh,['SelectionOccurrenceId']);}
  const recollection=row(p,lane+'-recollection','Recollection');assert.equal(recollection.min,0);assert.equal(recollection.max,32);assert.deepEqual(recollection.fresh,['ProposedRecollectionOccurrenceId']);
 }
 for(const [stage,record] of [['goal-outcome-assessment','GoalOutcomeAssessment'],['retained-attribution','RetainedAttributionResult']]){const r=row(p,stage,record);assert.equal(r.min,0);assert.equal(r.max,1);assert(r.condition.includes('including unavailable'));}
 for(const stage of ['visual-acquisition-evidence','body-acquisition-evidence']){const r=row(p,stage,'AcquisitionFormationEvidence');assert.equal(r.min,0);assert.equal(r.max,1);assert.deepEqual(r.fresh,['AcquisitionOccurrenceId']);}
 const world=row(p,'world','WorldEventTruth');assert.deepEqual(world.fresh,['WorldEventId']);assert.deepEqual(world.nestedFresh,['EventBindingId: one per authored item, including hidden items']);
 assert.deepEqual(row(p,'goal-baseline-recollection','Recollection'),row(p,'current-recollection','Recollection'));
 assert(p.validationOrder[0].startsWith('Authenticate'));assert(p.validationOrder[3].includes('transaction allocation receipts'));
}
validate(packet);
const faults=[
 ['unknown-parallel-family',p=>row(p,'world','WorldEventTruth').fresh=['WorldEventOccurrenceId']],
 ['freeze-reallocates',p=>row(p,'current-freeze','PreRecognitionSemanticExperience').fresh=['ExperienceId']],
 ['empty-selector-skips-identity',p=>row(p,'current-body-selection','BodySelectionAudit').min=0],
 ['empty-recall-placeholder',p=>row(p,'current-recollection','Recollection').min=1],
 ['missing-baseline-producer',p=>p.stages.find(s=>s.name==='goal-baseline-recollection').outputs=[]],
 ['owner-emits',p=>p.stages.find(s=>s.name==='ordinary-memory-formation').outputs.push(structuredClone(row(p,'body-acquisition-evidence','AcquisitionFormationEvidence')))],
 ['transport-own-identity',p=>{const r=row(p,'encoding-concern-delivery','FeedbackDelivery');r.fresh=['ConcernOccurrenceId'];}],
 ['unavailable-result-dropped',p=>row(p,'retained-attribution','RetainedAttributionResult').condition='Only Supported'],
 ['source-omits-observation-slot',p=>row(p,'current-sample','CompletedRequestedSamples').fresh.shift()],
 ['hidden-truth-bindings-omitted',p=>row(p,'world','WorldEventTruth').nestedFresh=['EventBindingId: visible only']],
 ['per-child-acquisition',p=>row(p,'body-acquisition-evidence','AcquisitionFormationEvidence').max=3],
 ['work-count-inferred',p=>p.wholeModelWorkCeiling=66],
 ['permanent-allocation-slipped-in',p=>p.numericAllocations.push({name:'AcquisitionOccurrenceId',namespace:9999})]
 ].map(([name,change])=>{const p=structuredClone(packet);change(p);assert.throws(()=>validate(p),name);return {name,rejected:true};});
for(const s of packet.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(out,JSON.stringify({status:'SYMBOLIC OUTPUT DECLARATION REVIEW PASS; PUBLIC ADAPTER OPEN',stageTemplates:packet.stages.length,distinctOutputs:new Set(packet.stages.flatMap(s=>s.outputs.map(o=>o.record))).size,faults,sources:[path,'scripts/review-ga-output-declarations.mjs','docs/formal/ATTENTION_ALLOCATION_TABLE.json','docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json'].map(fp),limits:['Static coverage and ownership checks only, not executed runtime branch/slot validation.','Revision 1 used unregistered descriptive family names and is superseded by revision 2; no numbers were assigned.']},null,2)+'\n');
