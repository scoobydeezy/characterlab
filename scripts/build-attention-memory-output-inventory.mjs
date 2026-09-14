import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const out='docs/planning/ATTENTION_MEMORY_OUTPUT_INVENTORY_REV1.json';assert(!fs.existsSync(out),'write once');
const stages=[];
const add=(name,when,outputs,slots={},fileCounters={})=>stages.push({name,when,outputs,slots,fileCounters});
// Cardinalities are literal integers or bounded symbols, never executable expressions.
add('world','always',{'WorldEventTruth':1},{WorldEventOccurrenceId:1,EventBindingOccurrenceId:3});
add('observe','always',{ExtendedObservation:1},{ObservationId:1,DetectionOccurrenceId:'n',EventDetectionOccurrenceId:'positive',ReservedExperienceId:'positive'});
add('track','positive',{PerceptualEventTransition:1,PerceptualTrackTransition:'n'},{},{ObserverEventSequence:1,ObserverTrackSequence:'newTracks'});
add('bind','positive',{PerceivedBindingEvidence:'n'},{PerceivedBindingOccurrenceId:'n'});
add('classify','positive',{});
add('freeze','positive',{PreRecognitionSemanticExperience:1});
add('roles','positive',{CausalRoleEvidence:'q'},{CausalRoleEvidenceOccurrenceId:'q'});
add('spatial','positive',{SpatialPreparation:1});
add('delivery','always',{FeedbackDelivery:1});
add('select','positiveFormation',{AttentionSelectionAudit:1,ExtendedSelected:1},{SelectionOccurrenceId:1});
add('empty-select','emptyFormation',{AttentionSelectionAudit:1,ExtendedSelected:1},{SelectionOccurrenceId:1});
add('encoding-join','formation',{BoundEncodingInput:1});
add('evaluate','formation',{EncodingEvaluation:1});
add('retain','formation',{RetainedEncoding:'retains'});
for(const name of ['form','associate','seed-presentation'])add(name,'retainedFormation',{});
add('cue','cue',{CueEvidence:1});
add('recall-join','cue',{BoundRecallInput:1});
add('rank','cue',{RecallResult:1});
add('recollect','cue',{AttentionRecollection:'w'},{ProposedRecollectionOccurrenceId:'w'});
add('reinforce','winningCue',{});
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const p={status:'DRAFT LOCAL OUTPUT AND SLOT INVENTORY; NOT RUNTIME QUALIFICATION',stages,
 symbols:{n:'admitted detections 0..3',q:'actual derived role outputs 0..n',newTracks:'new continuant files 0..n; other tracks continue',positive:'1 iff n>0',retains:'1 iff at least one selected unit has final strength>0',w:'actual winners 0..min(2,episode count); zero for unavailable cue or absent episodes'},
 accounting:{outputs:'top-level registered output records, including new identity-free carriers; nested copies not counted again',runtimeSlots:'only explicit fresh shared allocator calls; experience allocated at observation and discharged at freeze',fileCounters:'separate observer-owned file counters, not shared runtime slots',events:'local executed stages including one completed delivery; original event included, upstream producer excluded',generatedEvents:'local executed events minus two: receiving original and previously scheduled delivery; excludes delivery scheduling by upstream producer'},
 identityRules:{tracking:'existing detection-keyed transitions carry resulting file identity; no fresh shared-runtime transition ID',freeze:'consumes exact observation reservation; no fresh allocation',selection:'one fresh audit selection occurrence; ExtendedSelected copies that same value',retention:'copies source SelectionOccurrenceId; no EpisodeId',recollection:'one new proposed occurrence per winner, never per candidate',delivery:'copies existing ConcernOccurrenceId when present; no fresh concern allocation',patches:'patch/diff trace only; no void-slot advance required by this proposed dedicated finite compiler'},
 maxima:{positiveFormation:{events:16,outputs:20,runtimeSlots:17},emptyFormation:{events:7,outputs:7,runtimeSlots:6},positiveCue:{events:14,outputs:20,runtimeSlots:18},emptyCue:{events:7,outputs:6,runtimeSlots:5}},
 pending:['exact output declarations/extractors and scalar identity roles','dedicated registration compiler and complete model commitment','earlier concern producer/delivery scheduling and whole-run work budget','public allocator/rollback/restore execution'],
 inputs:['docs/planning/ATTENTION_MEMORY_STAGE_INVENTORY_REV1.json','docs/planning/ATTENTION_MEMORY_WRAPPER_INVENTORY_REV1.json','docs/formal/ATTENTION_PUBLIC_SHAPE_ACCEPTANCE.md','docs/formal/EVENT_SEMANTIC_SCHEMA_INVENTORY.md','src/campaign3/attentionRuntime.ts','src/substrate/scheduler.ts'].map(fp)};
fs.writeFileSync(out,JSON.stringify(p,null,2)+'\n');console.log({stages:stages.length});
