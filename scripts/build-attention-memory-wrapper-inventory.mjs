import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const output='docs/planning/ATTENTION_MEMORY_WRAPPER_INVENTORY_REV1.json';
assert(!fs.existsSync(output),'write once');
const domainPath='docs/planning/ATTENTION_MEMORY_SYMBOLIC_INVENTORY_REV1.json';
const stagePath='docs/planning/ATTENTION_MEMORY_STAGE_INVENTORY_REV1.json';
const domain=JSON.parse(fs.readFileSync(domainPath));
const stages=JSON.parse(fs.readFileSync(stagePath));
const records=structuredClone(domain.records);
const ref=name=>({kind:'ref',name});
const list=(name,min,max)=>({kind:'list',element:ref(name),min,max});
const optional=name=>({kind:'optional',value:ref(name)});
const choice=(...values)=>({kind:'enum',values});
const union=(...names)=>({kind:'union',alternatives:names.map(ref)});
const record=(name,fields)=>{assert(!records.some(r=>r.name===name));records.push({name,fields:Object.entries(fields).map(([name,type])=>({name,type:typeof type==='string'?ref(type):type}))});};
const named=name=>records.find(r=>r.name===name);
// Correct forward: these are draft successors, not edits to the reviewed input.
named('ExtendedObservation').fields.splice(3,0,{name:'EventDetection',type:optional('CurrentEventDetectionId')});
named('SelectedSpatialWitness').fields.splice(1,0,{name:'Detection',type:ref('CurrentDetectionId')});
named('EncodingJoinInput').fields[0].name='ObserverId';
record('SeriesSceneOriginal',{ObserverId:'ObserverId',DueAt:'Instant',SceneDefinitionId:'DefinitionId',Purpose:choice('Formation','Cue')});
record('TrackingInput',{Observation:'ExtendedObservation'});
record('BindingInput',{Observation:'ExtendedObservation',Event:'PerceptualEventTransition',Tracks:list('PerceptualTrackTransition',1,3)});
record('ClassificationInput',{Observation:'ExtendedObservation',Event:'PerceptualEventTransition',Bindings:list('PerceivedBindingEvidence',1,3)});
record('FreezeInput',{Observation:'ExtendedObservation',Event:'PerceptualEventTransition',Bindings:list('PerceivedBindingEvidence',1,3)});
record('RoleInput',{Experience:'PreRecognitionSemanticExperience'});
record('SpatialPreparationInput',{Observation:'ExtendedObservation',Tracks:list('PerceptualTrackTransition',1,3),Experience:'PreRecognitionSemanticExperience',Claims:list('CausalRoleEvidence',0,3)});
record('SpatialPreparation',{Experience:'PreRecognitionSemanticExperience',Claims:list('CausalRoleEvidence',0,3),Witnesses:list('SelectedSpatialWitness',1,3),Calibration:'GovernedContentDefinitionId'});
record('SelectionInput',{Preparation:'SpatialPreparation'});
record('EmptySelectionInput',{Observation:'ExtendedObservation'});
record('BoundEncodingInput',{ObserverId:'ObserverId',Subject:'CharacterId',Input:'EncodingJoinInput'});
record('RetentionInput',{ObserverId:'ObserverId',Evaluation:'EncodingEvaluation'});
record('FormationInput',{ObserverId:'ObserverId',Encoding:'RetainedEncoding'});
record('PositiveCueSource',{Preparation:'SpatialPreparation'});
record('EmptyCueSource',{Observation:'ExtendedObservation'});
record('CueExtractionInput',{Source:union('PositiveCueSource','EmptyCueSource')});
record('RecallJoinInput',{ObserverId:'ObserverId',Cue:'CueEvidence',Feedback:'FeedbackDelivery'});
record('BoundRecallInput',{ObserverId:'ObserverId',Subject:'CharacterId',Input:'RecallJoinInput'});
record('RecallWinner',{Encoding:'RetainedEncoding',Score:'RecallScore'});
record('RecallResult',{ObserverId:'ObserverId',Subject:'CharacterId',At:'Instant',Disposition:choice('UnavailableCue','NoEpisodes','NoKnownAssociationMatch','KnownAssociationMatch'),Scores:list('RecallScore',0,4),Winners:list('RecallWinner',0,2)});
record('RecollectionInput',{ObserverId:'ObserverId',Result:'RecallResult'});
record('ReinforcementInput',{ObserverId:'ObserverId',Recollections:list('AttentionRecollection',1,2)});
const requiredObserverInputs=['EncodingJoinInput','BoundEncodingInput','RetentionInput','FormationInput','RecallJoinInput','BoundRecallInput','RecollectionInput','ReinforcementInput'];
const bindingRules={
 observation:'EventDetection present iff Detections nonempty; source allocates existing event-detection once only on positive branch; no denied-event reservation',
 tracking:'one track per admitted detection; exact observation/observer/time support; event uses the same current event detection; no invented detection',
 spatial:'one witness per prepared bound unit; Detection joins the actual track to that unit; all observers/event/time/support agree; exact preselection count; Unknown has no Position',
 selected:'witness keys biject selected unit keys and copy exact prepared witnesses; no unselected bindings/claims/positions; source capability remains selected-only',
 subject:'required top-level ObserverId equals carried source observer before PRJ; copied Subject equals actual PRJ result; every owner reader/writer projects independently',
 join:'actual completed delivery output plus actual preparation parent; exact target original/time; exact canonical expected payload; once-only transaction binding; no archive resolver',
 retention:'positive rows biject retained units; exact selected binding/claim bytes; no positive rows means no RetainedEncoding or child; no full evaluation or feedback in storage',
 cue:'positive source preserves actual SEM freeze; empty source has zero detections/no event detection; profile-designated permitted detection with glyph supplies file, never an authored memory key',
 recall:'UnavailableCue has empty scores/winners and no memory reads; NoEpisodes has empty scores/winners; otherwise scores cover all episodes once, winners copy exact top-K retained bytes and scores; unknown graph file may still have baseline winners',
 reinforcement:'nonempty distinct actual recollection outputs only; one history update per output; occurrence/subject/time/selection match actual parent outputs; no copied historical output admission'
};
const outputRules={
 transported:'nested existing evidence retains identity; copying never produces another occurrence',
 observation:'one ObservationId; 0..3 detection occurrences; event detection and reserved experience only when detections nonempty',
 selection:'one existing SelectionOccurrenceId per selection; audit and selected carrier share it; no additional selected-view occurrence',
 retention:'source SelectionOccurrenceId only; no episode occurrence',
 recollection:'0..2 fresh ProposedRecollectionOccurrenceId, one per actual winner; zero winners emits no reinforcement',
 writers:'patch/diff trace and transition-result discipline; no state-update occurrence',
 delivery:'existing scheduler event; no new concern occurrence; actual concern source occurrence copied',
 remaining:'exact registration and runtime/result-slot maxima are not established by this inventory'
};
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const packet={status:'DRAFT EXACT WRAPPER FIELD INVENTORY; NOT ALLOCATION INPUT',version:'attention-memory-wrappers/0.1-draft',
 records,external:[...domain.external,'DefinitionId','CurrentEventDetectionId','PerceptualEventTransition','PerceptualTrackTransition','PreRecognitionSemanticExperience','WorldEventTruth','AttentionSelectionAudit'],
 primitives:domain.primitives,proposedIdentities:domain.proposedIdentities,storage:domain.storage,characterStorageForbiddenReachability:domain.characterStorageForbiddenReachability,
 stageInputs:stages.stages.map(s=>({stage:s.name,input:s.input})),requiredObserverInputs,bindingRules,outputRules,
 closedLayout:'ordered named fields; lists/optionals/unions bounded as written; symbolic enum/member and canonical field allocations not yet assigned',
 pending:['canonical registrations and scalar/map identity roles','complete occurrence/output/result-slot declarations','upstream probe/workspace/concern acquisition declarations','exact source profile, cue designation, model cohort and total work bounds','whole symbolic acceptance then separate allocation and model packaging','public adapter, persistence and corpus qualification'],
 supersedesDraftFields:[{record:'ExtendedObservation',change:'add conditional existing CurrentEventDetectionId'},{record:'SelectedSpatialWitness',change:'add existing CurrentDetectionId for track attachment'},{record:'EncodingJoinInput',change:'rename top observer field to required ObserverId; no identity semantics change'}],
 inputs:[domainPath,stagePath].map(fp)};
fs.writeFileSync(output,JSON.stringify(packet,null,2)+'\n');
console.log({records:records.length,fields:records.reduce((n,r)=>n+r.fields.length,0),stageInputs:packet.stageInputs.length});
