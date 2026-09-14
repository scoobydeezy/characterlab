import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const topologyPath='docs/planning/GA_COMPOSED_LOGICAL_TOPOLOGY_REV1.json';
const output='docs/planning/GA_OUTPUT_DECLARATIONS_REV2.json';
assert(!fs.existsSync(output),'write-once proposal');
const topology=JSON.parse(fs.readFileSync(topologyPath));
const transport=(condition='One per admitted invocation')=>({min:1,max:1,condition,identity:'BorrowedOnly',fresh:[]});
const owned=(family,max=1,condition='One per admitted invocation',min=1)=>({min,max,condition,identity:'FreshOwned',fresh:[family]});
const declarations={
 WorldEventTruth:{...owned('WorldEventId',1,'Exactly one iff visual source requested',0),nestedFresh:['EventBindingId: one per authored item, including hidden items']},
 CompletedRequestedSamples:{...transport(),identity:'NestedOwnedAndReserved',fresh:['ObservationId','DetectionOccurrenceId','EventDetectionOccurrenceId','ExperienceId'],rules:[
  'Exactly one ObservationId per requested body channel, panel and visual surface, including unavailable observations',
  'Exactly one DetectionOccurrenceId per actual visible item; no hidden-item detection',
  'Exactly one EventDetectionOccurrenceId iff panel present or actual visible items nonempty',
  'Exactly one reserved ExperienceId iff observer-safe supporting observations nonempty; reserve before binding',
  'No occurrence belongs to the envelope itself'
 ]},
 PerceptualTrackTransition:{min:0,max:3,condition:'One per actual detected visual item',identity:'ObserverFileCounter',fresh:[]},
 PerceptualEventTransition:{min:0,max:2,condition:'Actual panel/visual event transitions only',identity:'ObserverFileCounter',fresh:[]},
 PerceptualEventEnd:{min:0,max:2,condition:'Actual prior-context end and/or current After/standalone-visual end',identity:'BorrowedOnly',fresh:[]},
 PerceivedBindingEvidence:owned('PerceivedBindingId',3,'One per actual tracked visual item',0),
 PreRecognitionSemanticExperience:{min:0,max:1,condition:'Exactly one iff this opportunity reserved an experience',identity:'ReservedOwned',fresh:[],reserved:['ExperienceId']},
 CausalRoleEvidence:owned('CausalRoleEvidenceId',3,'One per actual supported visual causal-role claim',0),
 AttentionSelectionAudit:owned('SelectionOccurrenceId'),
 ExtendedSelected:transport('Exactly one, including empty selected list; borrows actual audit identity'),
 EncodingEvaluation:transport(),
 PositiveVisualCandidate:transport('Exactly one candidate envelope, including zero retained units; empty candidate forms nothing'),
 BodySelectionAudit:owned('SelectionOccurrenceId'),
 BodySelectedView:transport('Exactly one, including empty selection; borrows actual body audit identity'),
 CueEvidence:transport('One explicit available/absent cue result; no invented sensory occurrence'),
 BodySignalCue:transport('One explicit available/absent cue result; independent of acquisition selection'),
 EventRecallResult:transport('One rank result; unavailable/empty winner list allocates no recollections'),
 BodyRecallResult:transport('One rank result; unavailable/empty winner list allocates no recollections'),
 Recollection:owned('ProposedRecollectionOccurrenceId',32,'Exactly one per actual winner, independently for each admitted partition evaluation',0),
 AcquisitionFormationEvidence:owned('AcquisitionOccurrenceId',1,'Exactly one iff the corresponding positive producer forms an acquisition',0),
 'TaskWorkspace/381':owned('WorkspaceOccurrenceId'),
 'TaskAppraisal/384':owned('AppraisalOccurrenceId'),
 'TaskConcern/388':owned('ConcernOccurrenceId'),
 FeedbackDelivery:transport('Exact previously scheduled producer-derived delivery; no fresh feedback occurrence'),
 PriorConcernEncodingEvaluation:transport(),
 PriorConcernRecallEvaluation:transport(),
 GoalOutcomeAssessment:owned('GoalOutcomeAssessmentId',1,'Exactly one iff actual consequence exists, including unavailable assessment',0),
 FocalConsequenceDelivery:transport(),
 GoalQualificationDelivery:transport(),
 RetainedAttributionResult:owned('RetainedAttributionResultId',1,'Exactly one iff actual focal consequence exists, including unavailable attribution',0),
 AttributionResultDelivery:transport(),
 QualifiedSignificanceJoin:transport('One joined result for each admitted significance opportunity; qualification does not allocate an occurrence')
};
const outputs=[...new Set(topology.stages.flatMap(s=>s.outputs))].sort();
assert.deepEqual(Object.keys(declarations).sort(),outputs);
const stages=topology.stages.map(s=>({name:s.name,phase:s.phase,outputs:s.outputs.map(record=>({record,...declarations[record]}))}));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({version:'ga-output-declarations/0.1-draft',status:'SYMBOLIC OUTPUT CARDINALITY AND OWNERSHIP; PUBLIC ADAPTER OPEN',stages,
 allocationPolicy:'Existing transactional runtime ordinal allocator; no envelope identity and no second provenance allocator',
 validationOrder:['Authenticate admitted invocation and actual source/parent associations','Validate exact registered schema and recursive roles','Check output cardinality against actual branch facts','Check fresh/reserved identity slots against transaction allocation receipts','Validate output-to-child binding before commit'],
 numericAllocations:[],wholeModelWorkCeiling:null,
 limits:['Cardinality maxima are per invocation, not a whole-instant work ceiling.','The inherited probe/prediction producer slice remains separately registered.','The public adapter must implement branch predicates and exact nested slot checks; this symbolic inventory does not qualify it.'],
 sources:[topologyPath,'docs/planning/GA_OUTPUT_AND_OCCURRENCE_CLOSURE_REV1.md','scripts/build-ga-output-declarations.mjs'].map(fp)},null,2)+'\n');
