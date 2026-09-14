import fs from 'node:fs';import assert from 'node:assert/strict';
const path='docs/planning/ATTENTION_MEMORY_STAGE_INVENTORY_REV1.json';assert(!fs.existsSync(path));
const stages=[];
function stage(name,phase,input,outputs,next,reads=[],writes=[],extra={}){stages.push({name,phase,input,outputs,next,reads,writes,admission:'actual registered parent output',projection:reads.includes('IDN')?'required ObserverId -> qualified CharacterId':'none',route:[],...extra});}
stage('world',0,'SeriesSceneOriginal',['WorldEventTruth'],['observe'],[],[],{admission:'exact admitted original'});
stage('observe',10,'WorldEventTruth',['ExtendedObservation'],['track','empty-select','cue'],[],[],{branch:'positive detections -> track; empty formation -> empty-select; empty cue -> cue'});
stage('track',11,'TrackingInput',['PerceptualTrackTransition','PerceptualEventTransition'],['bind'],['ContinuantState','EventFileState','TrackingWindow'],['ContinuantState','EventFileState','TrackingWindow'],{authority:'perception'});
stage('bind',12,'BindingInput',['PerceivedBindingEvidence'],['classify']);
stage('classify',13,'ClassificationInput',[],['freeze']);
stage('freeze',14,'FreezeInput',['PreRecognitionSemanticExperience'],['roles']);
stage('roles',15,'RoleInput',['CausalRoleEvidence'],['spatial']);
stage('spatial',15,'SpatialPreparationInput',['SpatialPreparation'],['select','cue'],[],[],{branch:'formation -> select; cue -> cue'});
stage('delivery',15,'FeedbackDelivery',['FeedbackDelivery'],[],[],[],{admission:'exact generated delivery from actual earlier concern/no-concern producer',transactionOnly:'completed output and target binding; not persistent affect'});
stage('select',40,'SelectionInput',['AttentionSelectionAudit','ExtendedSelected'],['encoding-join']);
stage('empty-select',40,'EmptySelectionInput',['AttentionSelectionAudit','ExtendedSelected'],['encoding-join']);
stage('encoding-join',40,'EncodingJoinInput',['BoundEncodingInput'],['evaluate'],['IDN'],[],{additionalCompletedParent:'delivery',target:'exact receiving original event + instant'});
stage('evaluate',40,'BoundEncodingInput',['EncodingEvaluation'],['retain']);
stage('retain',130,'RetentionInput',['RetainedEncoding'],['form'],[],[],{route:['route/character-learning'],conditional:'zero outputs/children iff no positive retained unit'});
stage('form',140,'FormationInput',[],['associate'],['IDN','EpisodeLedger'],['EpisodeLedger'],{authority:'attention-episode-formation',route:['route/character-learning']});
stage('associate',140,'FormationInput',[],['seed-presentation'],['IDN','AssociationGraph'],['AssociationGraph'],{authority:'attention-association-update',route:['route/character-learning']});
stage('seed-presentation',140,'FormationInput',[],[],['IDN','PresentationLedger'],['PresentationLedger'],{authority:'attention-presentation-update',route:['route/character-learning']});
stage('cue',40,'CueExtractionInput',['CueEvidence'],['recall-join']);
stage('recall-join',40,'RecallJoinInput',['BoundRecallInput'],['rank'],['IDN'],[],{additionalCompletedParent:'delivery',target:'exact receiving original event + instant'});
stage('rank',40,'BoundRecallInput',['RecallResult'],['recollect'],['IDN','EpisodeLedger','AssociationGraph','PresentationLedger'],[],{conditional:'UnavailableCue: IDN only, no memory reads; AvailableFile: all three owner reads, including absence'});
stage('recollect',40,'RecollectionInput',['AttentionRecollection'],['reinforce'],[],[],{conditional:'one occurrence/output per winner, max2; no winners -> no outputs/children'});
stage('reinforce',140,'ReinforcementInput',[],[],['IDN','PresentationLedger'],['PresentationLedger'],{authority:'attention-presentation-update',route:['route/character-learning']});
const wrappers={
 SeriesSceneOriginal:['ObserverId','DueAt','SceneDefinitionId','Purpose(Formation|Cue)'],
 TrackingInput:['ExtendedObservation'],BindingInput:['ExtendedObservation','actual track/event outputs'],ClassificationInput:['ExtendedObservation','actual event output','actual bindings'],FreezeInput:['ExtendedObservation','actual event output','actual bindings'],RoleInput:['PreRecognitionSemanticExperience'],
 SpatialPreparationInput:['ExtendedObservation','actual track outputs','PreRecognitionSemanticExperience','actual causal-role outputs'],SpatialPreparation:['PreRecognitionSemanticExperience','actual causal-role outputs','scoped detection/file/position matches','preselection peripheral count'],
 SelectionInput:['SpatialPreparation'],EmptySelectionInput:['ExtendedObservation(empty)'],BoundEncodingInput:['ObserverId','qualified Subject','EncodingJoinInput'],RetentionInput:['ObserverId','EncodingEvaluation'],FormationInput:['ObserverId','RetainedEncoding'],
 CueExtractionInput:['ExtendedObservation','optional actual tracked/frozen scene'],RecallJoinInput:['ObserverId','CueEvidence','FeedbackDelivery'],BoundRecallInput:['ObserverId','qualified Subject','RecallJoinInput'],
 RecallResult:['ObserverId','qualified Subject','At','cue disposition','all candidate RecallScore rows','winning retained encodings only'],RecollectionInput:['ObserverId','RecallResult'],ReinforcementInput:['ObserverId','actual AttentionRecollection outputs']};
const packet={status:'REVIEWABLE STAGE INVENTORY; NOT CANONICAL DECLARATIONS',stages,wrappers,
 invariants:{characterWriterInput:'required top-level ObserverId equals retained/recall source ObserverId before PRJ',subject:'projection precedes any owner-leaf read; all copied subjects must equal actual projection',charWrites:['EpisodeLedger','AssociationGraph','PresentationLedger'],candidateEnumeration:'exact complete owner-leaf reads; no state.entries capability',prohibitedInput:'AutomaticAdaptationInput',noBeliefOrderingDecision:true,outputs:'newly produced records only; transported copies never allocate a second identity'},
 outputIdentity:{RetainedEncoding:'no fresh occurrence; source SelectionOccurrenceId retained',ExtendedSelected:'reuse actual SelectionOccurrenceId; no fresh view identity',EncodingEvaluation:'trace result slot only; no new semantic occurrence',AttentionRecollection:'fresh ProposedRecollectionOccurrenceId per actual selected episode',FeedbackDelivery:'scheduler event only; ConcernOccurrenceId copied from actual source',stateWriters:'patch/diff trace only; no episode/graph/history occurrence namespace'},
 bounds:{positiveFormationStages:16,positiveCueStages:14,includesDelivery:true,excludesEarlierConcernAcquisition:true,notRuntimeWorkQualification:true},
 unresolved:['exact canonical wrapper field schemas and union layouts','registration/input/output-role and occurrence-result declarations','perception state rehydration/replay bounds','earlier probe/workspace/concern producer declarations and total work','exact model/calibration cohort and whole-profile output maxima']};
fs.writeFileSync(path,JSON.stringify(packet,null,2)+'\n');console.log({stages:stages.length,wrappers:Object.keys(wrappers).length});
