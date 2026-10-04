# Memory successor symbolic closure — M5 revision 4

2026-09-08. **WHOLE SHAPE ACCEPTED; COMBINED NUMERIC REVIEW AUTHORIZED NEXT.**
See the [accepted formal disposition](../formal/MEASUREMENT_EPISODIC_MEMORY.md).
Historical proposal wording below is now accepted in shape. Numeric freeze and runtime
implementation are not implied; packaging follows allocation. MEMR-A..P remain NOT PASSED.
The [M5 revision2 semantics](CAMPAIGN2_MEASUREMENT_MEMORY_M5_DRAFT.md) are accepted as components:
real/void slots, exclusive stage, source337 trace, prefix validation, S0 facade, exact stopping,
whole-save comparison, private association transfer and sixteen-control topology. This document
proposes their exact symbolic registration/profile homes. M1–M4 accepted meanings remain unchanged.

## Version ownership and profile tuple

The following new version names are proposed identifiers, not accepted runtime versions yet:

| Owner | Proposed identifier | Exact responsibility |
|---|---|---|
| RulesVersion | rules/campaign2-measurement-memory/0.1-candidate | Closed first-model compiler, accepted g1..g11/r0..r7 generation, exclusive phase140 dispatcher, fixed control selection |
| RegistrySchemaVersion | campaign2-measurement-memory-registry/0.1-candidate | Existing six-slot shape with the exact successor rows below |
| Trace profile | campaign2-measurement-memory-trace-binding/0.1-candidate | Exactly one160 per executed event; new event matrix below, inherited sub-mappings preserved |
| Persistence profile | campaign2-measurement-memory-persistence/0.1-candidate | Required original S0, admitted prefix validation, N/quiescence rule, whole-save equality, pending association transfer |
| Composed memory semantics | measurement-episodic-memory/0.1-candidate | M1/formation/recollection exact relations and accepted absence/slot behavior |
| Formation registration | measurement-memory-formation-registration/0.1-candidate | M3 write-capable registration using existing StateWrites |
| Recall registration | measurement-recall-registration/0.1-candidate | Event-authenticated delayed input plus presence-conditioned output |
| Recall read-ablation semantics | measurement-recall-read-ablation/0.1-candidate | Same cue/IDN, no episode requirement/read, void result slot |
| Formation write-ablation semantics | measurement-formation-write-ablation/0.1-candidate | Same M1/M2, empty patch/output/children |
| Required nested projection | projection-input-field-path/0.1-candidate | Accepted bounded M2 grammar |
| Episode read | measurement-episode-read/0.1-candidate | Accepted M4b |
| Delayed generation | measurement-recall-opportunity/0.1-candidate | Accepted M4a |

Retain ordering-phases/2-candidate, content/0.2-candidate, campaign2-parameters/0.1-candidate,
numeric/exact-1 and rng/sha256-addressed-128-v1-candidate. Original ordered-input profile remains
campaign2-probe-ordered-input/0.1-candidate: generated cue/padding kinds are excluded from original
inputs. New initial-state admission requires the IDN declarations and empty initial episode family;
this does not expand original event syntax. Model materialization must prove compiler reuse and
input equivalence, not claim an empirical enumeration of all manifests.

The semantic bundle retains all31 carriage entries in their existing order, then appends the ten
new semantic/registration/trace/persistence identifiers in this order: composed memory semantics,
formation registration, recall registration, formation write-ablation semantics, recall read-ablation
semantics, nested projection, episode read, delayed generation, memory trace profile, memory
persistence profile. Existing carriage entries remain dependencies, not the successor's active trace
selection. Wrong/old profile tuple rejects; no optional prefix-validation factory mode.

## Closed symbolic record inventory

All fields required, shown in schema order. Names imply no permanent field/type numbers yet.
Embedded record types are exact schema1 references. Existing component representations are reused.

| New record | Fields |
|---|---|
| MeasurementEpisodeLearningEvidence | MeasurementEpisodeLearningEvidenceId; Source337:337; TransformationVersion:text |
| EventDependentProjectedFieldPathRequirement | SelectorSourceFieldPath:list<FieldId>; TargetStatePathTemplate:StatePathPattern; ProjectedFieldId; OutputRole:CanonicalIdentityRole; OutputAccessor:ProjectionAccessorId |
| MeasurementEpisodeKey | CharacterId; CognitiveMeasurementEvidenceId |
| MeasurementEpisode | LearningEvidence:MeasurementEpisodeLearningEvidence |
| MeasurementEpisodeState | Episodes:map<MeasurementEpisodeKey,MeasurementEpisode> |
| MemoryFormationRegistration | ExecutingSeamId; ExecutingSeamVersion; TransitionDefinition:MemoryFormationDefinition; IngressDefinition:276 |
| MemoryFormationDefinition | InputAdmission:274; ReadDomain:set<StatePathPattern>; OutputDefinitions:set<277>; WriteCapability:existing322 |
| MeasurementEpisodeReadRequirement | SubjectAccessor; EvidenceSourceFieldId; TargetStatePathTemplate; OutputAccessor |
| MeasurementRecallOpportunityDefinition | ProducingTransitionKind; RecallEventTypeId; RecallDelay:signed SimDuration |
| MeasurementRecallCue | ObserverId; CognitiveMeasurementEvidenceId |
| MeasurementRecollection | MeasurementRecollectionId; Episode:MeasurementEpisode; TransformationVersion:text |
| RecallRegistration | ExecutingSeamId; ExecutingSeamVersion; InputAdmission:DelayedRecallEventAdmission; ReadDomain:set<StatePathPattern>; OutputDefinitions:set<RecollectionOutputDefinition>; WriteCapability:273 |
| DelayedRecallEventAdmission | InputRecordSchema:254; OpportunityDefinitionId:RegistryDefinitionId |
| RecollectionOutputDefinition | OutputRecordSchema:254 |

Fourteen new record shapes, no new generic union/discriminant. RecollectionOutputDefinition's
version fixes exactly-one-iff-M4b-presence, not277's unconditional cardinality. Normal RecallRegistration
has a singleton output definition; read-ablation has an empty set and its distinct executing semantic
version fixes zero output plus void slot. DelayedRecallEventAdmission binds exact cue schema and
the sole opportunity entry; its version fixes phase20 and exact scheduler-event authentication,
not a cue occurrence rule. No ingress276 is embedded in RecallRegistration.

WriteCapability322 retains existing union representations; formation accepts only its exact M3
StateWrites branch. The write-ablation registration uses existing V04 records272/271/274/275/276/273,
with exact M1 input, M2 roster ReadDomain, empty output set and NoStateWrites. It does not require
new FormationWriteAblationRegistration schema. Likewise RecallAccessAblationRegistration denotes
a model-selected RecallRegistration value, not a duplicate schema. Neither creates a new capability.

M1/MeasurementRecollection TransformationVersion equals the composed memory semantic identifier.
Other embedded versions retain their accepted values. No transformation string is chosen by a
caller. No new episode/cue occurrence family, certificate record, generic stage-policy record or
save field is admitted.

## Exact registry homes and model selection

Existing SemanticRegistryEntry171 has StableId, RegistryKindId, DefinitionVersion and Definition.
Within a model, TransitionKind→registration and event→consumer remain unique across all grammars.
This permits the same TransitionKind/event in different models with different committed definitions;
it does not permit duplicate rows within one model.

| StableId (symbolic member) | Kind / DefinitionVersion | Definition |
|---|---|---|
| MeasurementEpisodeEvidenceTransition (1009) | registry/transition-registration / transition-admission/0.4-candidate | Accepted M1 V04; event/measurement-episode-evidence; route/character-learning |
| MemoryFormationTransition (1009) | registry/transition-registration / formation-registration version if F enabled; V04 if ablated | M3 registration or V04 write-ablation value; both event/measurement-episode-formation and route/character-learning |
| MeasurementRecallTransition (1009) | registry/transition-registration / recall-registration version | Normal or read-ablation RecallRegistration; both event/measurement-exact-recall; no learning-route mapping |
| definition/measurement-recall-opportunity (1027) | new registry/measurement-recall-opportunity (1023) / accepted opportunity version | Accepted opportunity definition, producing intake, exact recall event, positive committed delay |

Projection requirements retain accepted PRJ ownership: canonical sets within TransitionSeamContract,
not SemanticRegistryEntry rows or a global projection map. Exact executing-contract collections:

| Executing contract | Required projection set |
|---|---|
| Normal formation | exactly one accepted M2 field-path requirement, OutputAccessor=ResolvedCharacterSubject |
| Formation write-ablation | same M2 requirement as normal formation |
| Normal recall | exact old266 top-level IDN requirement plus exact MeasurementEpisodeReadRequirement |
| Recall read-ablation | exact old266 IDN requirement only |

OutputAccessor is unique across static, old-field, field-path and episode-read requirements within
the executing seam contract. Requirement identity remains (SeamId,SeamVersion,OutputAccessor).
M4b SubjectAccessor resolves within that same contract to the sole IDN requirement. Cross-binding,
duplicates, absent/extra requirements and alternate roster/episode access reject.

The concrete packaging must commit these collections through existing TransitionSeamContract-owned
semantics. Current six-slot builder has no global projection map, and this document invents none.
If its concrete serialization cannot yet carry these transition-owned sets, record a packaging
expressibility gap after shape acceptance and close it before model freeze. No projection registry
kind, definition member, silent factory-only requirement or unreviewed allocation solves that gap.
All three new transition rows use symbolic seam/measurement-episodic-memory (1036). Formation
write-ablation selects its distinct executing semantic version; recall read-ablation selects its
distinct version; ordinary M1/formation/recall use the composed memory version. F/R are inferred
from these exact rows, not a second boolean authority. a/p remain existing probe definition booleans.
Their Cartesian product yields the accepted16 configurations. No new control TransitionKinds/events.

There is exactly one existing admission singleton279: add M1 and formation route entries, and the
two new semantic output occurrence rules for M1/recollection. Do not add a cue rule or recall route.
The new recall registration is an explicit exception to semantic-occurrence-input requirements;
its event-authenticated grammar owns that distinction. Existing producer resolution remains versioned.

Exact successor delta from the known measurement-evidence base:

| Slot | Change |
|---|---|
| 0 | Add14 schema descriptors and the four new semantic entries above; change existing admission occurrence/route data and episodic storage data in the existing state-family singleton |
| 1 | Unchanged ordering-phases/2-candidate bytes |
| 2 | Add authority/measurement-episode-formation owning exactly the episode leaf, RemovalAllowed=false |
| 3 | Add exactly the accepted ReadOnlyStateFamilyDefinition for CharacterObserverBindingState/268.Bindings/1, mapKey(*) with canonical267 values |
| 4 | Add exactly the accepted IdentityKey grammar for268.Bindings and the CanonicalRecordKey grammar for MeasurementEpisodeKey at the episode leaf |
| 5 | Add only genuinely missing exact canonical roles; preserve/reuse inherited roles, including203/2 |

No conditional "if absent" admission remains. The actual IDN roster is initial-state/run data:
its bindings affect InitialStateDigest/RunIdentity, not RegistryIdentity. Only family/key/role
declarations enter the model. Packaging must not move roster values into registry rows.

The existing state-family row remains exactly registry/campaign2-state-family,
definition/campaign2-state-families, DefinitionVersion=adaptation-input/0.31-candidate,
Definition=Campaign2StateFamilyRegistry/284. Change only episodic-memory Storage from Unmaterialized
to its accepted Materialized root/leaf mapping. Ownership is supplied by the slot2 authority.
All other family meanings and old model bytes remain unchanged. This is new committed model data,
not new topology semantics or a new DefinitionVersion. The successor compiler's exact six-leaf
closure does not relax the old five-leaf validator. No generic stage registry is created.
The RulesVersion fixes the stage declaration: ADAPT batch OR one SemanticFormation OR one
WriteAblationControl OR one PrivatePadding OR no work, mutually exclusive. Dispatch category is
derived from exact registered event/definition version or fixed private event kind; no new canonical
MemorySlotKind union is needed. PrivatePadding never authenticates as MemoryFormationTransition.

## Symbolic identity/member inventory

- Runtime occurrence families: MeasurementEpisodeLearningEvidenceId and MeasurementRecollectionId
  only; matching output field roles and shared occurrence rules, numeric namespaces deferred.
- TransitionKind1009: the three rows above. SeamId1036: seam/measurement-episodic-memory.
- EventType1001: event/measurement-episode-evidence, event/measurement-episode-formation,
  event/measurement-exact-recall; private event/measurement-episode-evidence-padding,
  event/measurement-episode-formation-padding, event/measurement-future-padding.
- RegistryDefinitionId1027: definition/measurement-recall-opportunity only. RegistryKind1023: registry/measurement-recall-opportunity only.
- MutationAuthority1025: authority/measurement-episode-formation. LeafFamily1032:
  leaf/measurement-episode. ProjectionAccessor1028: accessor/measurement-episode-read.
- Reuse ResolvedCharacterSubject, existing CharacterId role1002/qualification, ObserverId1000,
  evidence1124 and all inherited schema/ref/version identity roles. No new DomainValidator.

Identity-valued new record fields have the matching existing family role: key/cue evidence1124,
cue observer1000, key character1002/qualification, opportunity producer1009/event1001, accessors1028,
registration seam1036, admission opportunity1027, and the two new output IDs' future namespaces.
Reuse roles on existing273/322/274/etc. Record-valued intermediate positions get schema typing,
not identity roles. Existing203/2 role1000 is present and reused. Final numeric-role parity audit
must enumerate schema positions mechanically; no allocation values are assigned here.

## Generation/profile bindings

The sole opportunity row governs real cue derivation and delay. No separate DelayedGenerationRegistration
record duplicates it: the fixed RulesVersion binds its producer to shared intake completion and its
event to RecallRegistration referencing that same definition. M4a supplies exact field derivation,
phase20, parent, dependencies and multiplicity. Missing/mismatched joins reject at construction.

Private g8/g11/g9 event kinds and their empty payloads are fixed profile algorithms: carriage padding
generates g8 then g9; g8 generates g11. The same opportunity's RecallDelay supplies checked future
time for private g9, without granting recall admission or a semantic cue. No duplicate delay parameter.
The accepted g/r table and exact private emission order are normative RulesVersion semantics.

ValidatedPendingGeneratedAssociation is runtime-private with closed kinds RecallCue and
PrivateFuturePadding. RecallCue facts include exact event, source337 ID and opportunity/producer
relation. PrivateFuturePadding facts include exact event and its private generation relation with
no337 source. Only successful prefix validation exports detached pending facts; restored runtime
creates fresh capabilities. Neither fact is canonical registry/save vocabulary.

## Exact new type160 trace matrix

All rows use actual ModelIdentity/RunIdentity, event fields, RecordKind=event type, the shared memory
seam ID and the selected exact executing semantic/profile version. Random/quantization/invariant
lists are empty. Each executed event contributes exactly one160, including private events. Paths,
inputs and values are canonical exact copies, never textual descriptions.

| Event | SubjectIds / SourceRecordIds | InputProjection / OutputProjection | Reads / patch / diff | EmittedEvents |
|---|---|---|---|---|
| M1 | nested ObserverId / [source337 ID] | actual337 / actual M1 | ReadDomain={}, reads=[], empty patch/diff | exact g11 formation event |
| formation F enabled | projected C / [M1 ID] | admitted M1 / [] | exact M2 roster domain/read; exact one insertion/diff | [] |
| formation F ablated | projected C / [M1 ID] | admitted M1 / [] | same M2 domain/read; empty patch/diff | [] |
| recall R enabled | projected C / [cue E] | exact cue / recollection if present else [] | roster+episode domain, exact IDN and direct episode reads; empty patch/diff | [] |
| recall R ablated | projected C / [cue E] | exact cue / [] | roster domain and IDN read only; empty patch/diff | [] |
| M1 padding | [] / [] | [] / [] | empty domain/reads/patch/diff | exact g11 private formation padding |
| formation padding | [] / [] | [] / [] | empty domain/reads/patch/diff | [] |
| future padding | [] / [] | [] / [] | empty domain/reads/patch/diff | [] |

All three private padding rows use SeamId=seam/measurement-episodic-memory and
SeamVersion=measurement-episodic-memory/0.1-candidate. Their EventTypeId distinguishes the fixed
private algorithm, while enclosing ModelIdentity supplies RulesVersion/topology selection.
RulesVersion text is never placed in TraceRecord.SeamVersion. Normal M1/formation/recall use
that same composed memory SeamVersion; write/read ablations use their distinct accepted semantic
version identifiers. Private padding is neither ablation transition.

The existing intake/carriage-padding trace rows retain their old seam/version, subjects, sources,
input and output; successor EmittedEvents becomes [g8,g9] with the respective actual semantic or
private child kinds. No historical packet mapping changes.
M1's sole child g11 is bound by registered producer discovery; M4a cue g9 remains intake-owned.
Source identity does not create lookup permission. Episode ActualReadRecord has exact(C,E) path,
DerivedSources=[], TransformationId absent. Type160 validators prove it from recorded IDN C and
admitted cue E; no independent roster lookup. Formation has no semantic occupancy read.

## Closure and later packaging

Concrete RecallDelay is positive signed model data chosen during materialization, not an allocation
blocker. Content/IDN roster initial fixtures, exact canonical profile tuple, preservation hashes,
expanded semantic bundle and all16 model identities must be produced before model freeze. No test
namespace becomes production vocabulary. The symbolic inventory is proposed for review before a
combined allocation pass; none is authorized by this document itself.

M5 revision2 behavioral acceptances remain intact. New declarations here still need whole-shape
review, especially finite registry-definition grammars, same-kind control version dispatch, trace
matrix and exact six-slot coverage. MEMR-A..P remain FROZEN/NOT PASSED. ADAPT-9b and Campaign2 OPEN.

## Revision4 corrections and disposition

Revision3 behavioral design, fourteen-record direction, control strategy, stage/profile ownership
and substantive trace matrix are preserved. Its projection registry rows were unearned and are
removed from both registry/member inventories. Projection sets remain TransitionSeamContract-owned.
Its proposed topology DefinitionVersion change is withdrawn; adaptation-input/0.31-candidate stays.
Private trace SeamVersion now identifies the memory seam, not RulesVersion. IDN slot3/slot4
additions are exact. These are ownership/version-home corrections, not M1–M5 semantic redesign.

Whole-shape acceptance is still awaited. No combined numeric allocation or implementation is
authorized by the review's expectation of later acceptance. MEMR-A..P remain FROZEN/NOT PASSED.
