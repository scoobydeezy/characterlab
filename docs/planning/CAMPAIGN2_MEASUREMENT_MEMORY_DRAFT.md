# Episodic measurement retention and exact later recall — revision 3

2026-09-07. **TARGET/INSPECTION ACCEPTED; REVISION-3 DESIGN FOR REVIEW.**
Working seam label: `measurement-episodic-memory/0.1-draft` (symbolic only).
Revision-2 review accepts M1 semantics, the M4a/M4b decomposition and cue independence, and accepts
nested M2 selection and the tentative episode key in direction. It rejects a new M1 registration
grammar as unnecessary. Revision3 corrects M1 to accepted V04 semantics and makes M2's symbolic
requirement explicit. The M1 record direction is accepted; this does not freeze new numeric schemas.
Whole shape is not accepted; permanent allocation, new model bytes and implementation are not
authorized. The accepted target is in [the target review](CAMPAIGN2_RESPONDING_COGNITION_TARGET_REVIEW.md).
MEMR-A..P are accepted as the permanent target research burden, FROZEN and NOT PASSED.


## Revision-3 review disposition — accepted components, 2026-09-07

User SHAPE ACCEPTS M1 evidence and V04 registration and SHAPE ACCEPTS M2 in bounded form.
Earlier proposal/unaccepted wording in the revision3 design below is retained review history
and superseded for these components by this disposition. Whole memory seam remains unaccepted.
M1's own output occurrence/role/rule must agree at later allocation. M2 requirement identity is
(SeamId, SeamVersion, OutputAccessor), unique across static, old and new requirements. No
parallel old266 subject requirement is admitted. The first path and admission-before-extraction
sequence are frozen; intermediate records need exact schema typing, not identity roles.

Terminal role inventory inspected: frozen measurement-model registry.json includes exact
RecordField203/2, RequiredNamespace1000, DomainValidator absent. Reuse this role unchanged;
no duplicate row is needed. This inspection is not a runtime projection pass.
M5 must derive phase130 order from actual EventSequence allocation: already pending EVID
evaluation precedes newly intake-generated M1. Same-phase generation does not confer priority.

[M3 state/writer revision2](CAMPAIGN2_MEASUREMENT_MEMORY_M3_DRAFT.md) is the next proposed shape.
M4a/M4b/M5 remain open; episode key freezes only when M3/M4b agree. Strategy B remains
considered/not selected/not prohibited. MEMR-A..P remain FROZEN/NOT PASSED. No allocation
or implementation is authorized; ADAPT-9b and Campaign2 remain OPEN.
## Accepted target and authority

Retain “I observed measurement M on that occasion,” then recover it through later governed
memory access. Do not assert current regulatory state, hidden D/R0, success, reward or expectation.
Candidate ADAPT-9b first persistent cognitive divergence is formation at T1. An identical governed
recall opportunity at T2 > T1 must separately demonstrate usable recollection. Both are required
for eventual target qualification; neither is passed now.

North Star §11 distinguishes truth, encoding, imprint and recollection; exact retention here is
a bounded initial case, not a reduction of those distinctions or a general memory architecture.
Architecture §3.3 requires typed character-learning evidence and one mutation authority for each
persistent learned family. STATE_MODEL's episodic authority remains unresolved. The Research
Program Brief's paired controls, ablation and declared scope govern qualification. The campaign
plan permits this target without overriding formal readiness. The accepted review explicitly
selects one observer, its projected character, one admitted 337 and one resulting episode.

## Actual substrate inspection

| Surface | Existing authority / implementation | Consequence for this seam |
|---|---|---|
| Safe measurement | [Carriage contract](../formal/MEASUREMENT_EVIDENCE_CARRIAGE.md), [execution](../../src/campaign2/measurementExecution.ts) | 337 embeds exact PresentObservation/203, safe UnitId and transformation version with its allocated 1124 occurrence. 203 carries observation identity, ObserverId, observed SubjectId, channel, historical time, exact measurement and precision. Unit is separately carried by 337. Reuse these values; do not allocate another observation or reconstruct provenance. |
| Concrete learning evidence | [EVID resolution](EVID_001_DRAFT_RESOLUTION.md), especially domain/codomain and projection sections | Existing 227 → OutcomeEvaluation/269 → OutcomeLearningEvidence/270 is consequence/outcome-only. Both transitions have zero state reads/writes. It has no generic measurement alternative and expressly defers downstream subject-addressing expressibility. “Character Learning Evidence” is an architectural category, not an existing universal record. |
| Ingress | [V04 compiler](../../src/campaign2/transitionAdmissionV04.ts), [shared ingress](../../src/campaign2/transitionIngressV04.ts), [measurement model](../../src/campaign2/measurementModel.ts) | Shared admission already binds exact live producer outputs to generated children, enforces registered output closure and allocates occurrences. V07 accepts only diagnostic 203 and NoStateWrites. The bounded model admits exact frozen declarations; adding a consumer under its old identity is impossible. |
| Subject projection | [requiredProjection.ts](../../src/campaign2/requiredProjection.ts), [IDN](IDN_001_DRAFT_RESOLUTION.md) | The compiler accepts registrations 272/318, chooses one required top-level input field, and reads a declared map entry/field. Exact IDN requirement uses ObserverId → immutable roster268/1 → CharacterId267/1, qualification validator and ResolvedCharacterSubject. Construction first verifies admitted-input capability and registration equality, then records projection reads. No arbitrary nested payload selector exists. |
| Persistent topology | [adaptationDomains.ts](../../src/campaign2/adaptationDomains.ts), [ADAPT packaging](ADAPT_001_PACKAGING_DRAFT.md) | episodic-memory already belongs to route/character-learning but is Unmaterialized. Only regulatory-adaptation and procedural-skill materialize in the accepted topology; exactly five physical ADAPT families are checked. Naming memory in the ten-family inventory grants no leaf or writer. |
| Mutation substrate | [stateModel.ts](../../src/campaign2/stateModel.ts), [mutationAuthority.ts](../../src/substrate/mutationAuthority.ts), [STATE_MODEL](../formal/STATE_MODEL.md) | Generic ownership patterns, exact key/value grammars, nonoverlap, removal permission, canonical patches and validation are reusable. There is no active episodic writer/record/recollection implementation found in src. V06's writable registration is coupled to ADAPT rule semantics and automatic-adaptation route; it is not a ready-made memory writer. |
| Occurrence identity | [occurrenceIdentity.ts](../../src/campaign2/occurrenceIdentity.ts) | Existing shared schema/field/role extraction is the authority. Future genuine output occurrences need declared rules; embedding an existing 337 is a value copy, not another occurrence. State addressing need not create a second identity for the same observation occasion. |
| Timing | [EVENT_ORDERING](../formal/EVENT_ORDERING.md) | 130 is learning-evidence production, 140 persistent-state mutation, 150 nonschedulable. Scheduler supports same/later-phase children and later instants. Current V04 compiler rejects ordinary phase-140 registration in the ADAPT composition: scheduler expressibility does not imply model admission. |
| Persistence / trace | [persistence clarification](CAMPAIGN2_PERSISTENCE_CLARIFICATION.md), [factory](../../src/campaign2/factory.ts), [measurement archive](../../src/campaign2/measurementArchive.ts) | State/trace/output/pending-event saves exist, but schemas and validation are selected by exact model/profile. Trace/archive is not a cognitive store. New memory roots, pending recall and recall outputs require successor admission/restore closure. Existing carriage restore correction remains preserved history. |
| Historical memory | [memory.ts](../../reference/src/model/memory.ts), [tests](../../reference/src/test/memory.test.ts) | MemoryEpisode includes semantic concepts, Need outcomes, prediction errors, participants, location/action and salience; MemoryRecord adds retrieval history. addMemory initializes retrieval history at encoding. These imply semantics absent from this target and cannot be copied into fresh source. Existing tests concern accessibility, associative pull and top-K, not the new epistemic boundary. |

## Expressibility blockers and proposed resolutions

These are new-seam gaps, not reasons to reopen accepted EVID, IDN, PRJ, ADAPT or carriage.

**M1 — No compatible measurement-learning input.** Propose a distinct typed measurement learning
evidence contract produced only from live admitted 337. It carries the exact safe source rather
than a trace lookup, and produces no state patch. Do not call it OutcomeLearningEvidence or widen
270. Proposed conceptual name is MeasurementEpisodeLearningEvidence; this earns a distinct schema
only after review. Its producer participates in route/character-learning; carriage retains no route.

**M2 — Nested observer cannot enter existing PRJ.** 337 has no top-level ObserverId. Nor would
an evidence envelope containing only 337. Existing PRJ cannot project from either unchanged.
Revision-2 proposed choice, after the comparison below: a separately versioned input-field-path extension that
selects the required ObserverId through embedded canonical records and then uses the unchanged IDN
roster requirement. Compile the entire finite required-field path and terminal identity role;
no reference traversal, optional fallback, callback or content resolver. Bind extraction/projection
to the exact admitted formation event and registration. Only the projected CharacterId may address
memory. The alternate design is a subject-addressing envelope with a duplicated ObserverId and an
earned equality invariant; it is not accepted and is not a shortcut available from today's schema
validator. This is a substantial new projection contract, not a field-type tweak. The envelope
alternative remains viable if its exact equality contract earns acceptance.

**M3 — No learned-memory write registration/topology.** Propose a versioned registration extension
with explicit character-learning producer, ReadDomain, output closure and sole memory authority.
Reuse generic WRT patches and validation, not V06 adaptation mathematics. A successor topology must
materialize only the previously unmaterialized episodic family in addition to preserved families.
The old five-leaf ADAPT contract remains exact under old models. Composition must earn a separate
topology rule; do not relax old validators globally. Register formation on route/character-learning
and derive its writable family set as exactly {episodic-memory}.

**M4a — No governed later recall-opportunity authority.** Proposed authority is actual live337
production, independent of formation success or its ablation. The runtime occurrence1124 cannot
be predicted/authored into the original input manifest. Fork the actual carriage production into
the learning-evidence path and a governed later cue path; successful formation is not the cue's
producer. The cue contains only ObserverId and the actual337 occurrence identity (plus any required
governed event identity), never scalar,203,337 content or truth. ObserverId is extracted from the
actual source at this generative boundary and source association must be checked there.

Proposed timing direction is a committed positive exact delay from the source execution instant:
T2 = T1 + RecallDelay, RecallDelay > 0. This requires a new admitted delayed-child relation;
SameAsProducer does not express it. Numeric duration representation, validation, generated-event
grammar and phase remain M4a design work; no delay value or phase is frozen here. Formation
ablation must retain exactly the same cue, due time and occurrence addressing. Transaction failure
still rolls back the whole instant; independence from formation ablation does not waive atomicity.

**M4b — No governed character-owned memory address projection.** Proposed choice is a dedicated
composite memory-read requirement, not a global episode lookup followed by an owner check. After
cue admission, resolve its ObserverId using exact PRJ/IDN. At the projection authority, combine
only that detached ResolvedCharacterSubject and the cue's role-validated1124 identity into the
declared (CharacterId,337Id) key and exact memory StatePath. Validate the complete key, family,
ownership and ReadDomain before any memory read or presence result is exposed. Then expose only
the addressed episode/absence to the recall transition. This is a new, explicit composition of
projected subject and input identity; today's PRJ forbids treating a prior state read as a selector.
It cannot be implemented by chaining ordinary accessors or handing a callback to the consumer.

The alternative is a full episode-key cue generated with trusted T1 subject resolution, followed
by T2 re-resolution and pre-read equality validation. It requires extra T1 roster projection and
cross-field/key equality obligations. The proposed composite requirement avoids putting CharacterId
in the cue and resolves ownership once at recall. Exact requirement/schema, absent-result grammar,
read-trace construction and admission integration remain unaccepted M4b work. The tentative state
key cannot be frozen until this read contract closes. Absence is not remembered negative evidence.

**M5 — Successor profile closure.** Formation and recall add work beyond carriage's frozen
six-advance/eight-child topology. New scheduling, suppression/ablation budgets, trace ownership,
schema inventory, model identity, original-input domain and persistence must be reviewed together.
Do not report the historical topology as the successor's budget. No new numbers or profile versions
are frozen by this draft.

A save after T1 but before T2 now contains a pending generated recall opportunity. Preserve its
exact allocated event identity, due time, payload, parent and dependency relation. Restore must
validate the committed generative relation, not manufacture authority from the original manifest,
a trace certificate or memory contents. Do not discard/recreate the pending event. The precise
persisted producer-association proof and validation surface are a new M5 obligation; this draft
does not claim the existing InputOnly reconstruction can do it. Formation-ablated saves must
restore the same pending cue despite containing no episode.

## M1 — proposed exact learning-evidence semantics

The sole input is one complete live337 output from the committed carriage transition under the
successor model's admitted carriage contract. Original inputs, raw203, OutcomeLearningEvidence270,
AutomaticAdaptationInput and arbitrary output/archive lookups are not admitted. Exact immediate
producer equality is over canonical content and actual generative association, not an ID or hash
match. Suppression produces no M1 invocation. Route membership alone grants no admission.

Proposed symbolic record, all fields required and no others:

```text
MeasurementEpisodeLearningEvidence
    MeasurementEpisodeLearningEvidenceId   own shared-allocated output occurrence; namespace deferred
    Source337                              exact embedded CognitiveMeasurementEvidence/337 schema1
    TransformationVersion                  exact eventual accepted M1 seam version
```

The draft version label is not an allocated runtime constant. The accepted-version string must
be frozen at shape closure. No copied ObserverId, CharacterId, timestamp, scalar, precision, unit,
claim, reward, salience or memory-strength field is added. Source337 remains the sole historical
content authority; its nested identities refer to the existing occurrences. The new ID identifies
the learning-evidence production occurrence, not a second observation or an episode address.

The record means only that this exact admitted measurement is eligible for the named formation
consumer in the committed transition graph. It is not a bearer token for arbitrary learning.
The graph admits exactly the intended MemoryFormationTransition for this slice; no general
consumer set or source union is inferred. MeasurementEpisodeEvidenceTransition is on
route/character-learning with ReadDomain={}, NoStateWrites and exactly one output of this schema.
It has no IDN read: an unbound observer may reach this evidence boundary, while required formation
projection fails rather than guessing a character. The complete instant still obeys rollback.

The detached M1 semantic operands are admitted337 and the shared-allocated output ID. Construction
copies canonical337 exactly and fixes the version. Shared completion verifies output identity,
source equality, schema/version and cardinality before admitting the formation child. The embedding
does not add provenance lookup permission. Registered occurrence extraction and source association
are reused; no side ledger, certificate or new observation allocator is introduced.

### M1 registration — reuse V04, no new ingress semantics

The accepted carriage contract explicitly preserves RegisteredTransitionProducer resolution through
the producer's committed registration, including V07. Revision2 incorrectly inferred a grammar gap
from the bounded current compiler/model. That is an implementation/composition limitation, not an
absent formal producer relationship. No V08/V09 registration extension is earned for M1.

```text
SemanticRegistryEntry
    StableId               MeasurementEpisodeEvidenceTransition (symbolic member)
    RegistryKindId         registry/transition-registration
    DefinitionVersion      transition-admission/0.4-candidate
    Definition             TransitionRegistrationV04

TransitionRegistrationV04
    ExecutingSeamId        symbolic measurement-memory seam member
    ExecutingSeamVersion   exact eventual accepted M1 version
    TransitionDefinition
        InputAdmission
            InputRecordSchema       CognitiveMeasurementEvidence/337 schema1
            Producer                RegisteredTransitionProducer {
                                        ProducingTransitionKind = MeasurementEvidenceIntakeTransition
                                    }
            RequiredSourceRelation  ExactImmediateProducerOutput
        ReadDomain                  {}
        OutputDefinitions           exactly one definition:
                                        MeasurementEpisodeLearningEvidence / eventual schema1
                                        exactly one output
        WriteCapability             NoStateWrites
    IngressDefinition
        ConsumerEventTypeId         symbolic measurement-episode-evidence event member
        DueAtRule                   SameAsProducer
        ConsumerPhase               130
        PayloadRule                 ExactAdmittedSourceOutput
        Multiplicity                ExactlyOncePerSourcePerConsumer

TransitionRoutes[MeasurementEpisodeEvidenceTransition] = route/character-learning
```

The named producer's V07 registration supplies its actual executing seam/version, phase and
governed337 output. Do not duplicate that declaration in the V04 producer operand or infer it from
event names. Shared generative ingress authenticates the complete actual337 and schedules the M1
child at the producer instant, phase130, with later EventSequence. Output closure is one M1 output
per successful execution; source multiplicity is the separate ingress rule. No delayed cue semantics
enter this registration. M4a must earn its separate future-generation relation.

The successor adds an M1 row, output schema, identity-role/occurrence rule, route entry and required
event/seam/transition members. Its RegistryIdentity/ModelIdentity therefore changes. Existing V04
registration schemas and producer discriminants, the V07 intake row and the single admission-registry
authority remain unchanged. Carriage retains no route mapping. Frozen model bytes still cannot
execute M1; new model data and an implementation of the already accepted cross-version relationship
are needed, not a version change to registration semantics.

M1 local closure checks under MEMR-C/D/K/M: unresolved/wrong producer registration, wrong output
schema/version, duplicate or unassociated337, equal ID with altered content, missing output rule,
wrong allocated result identity, extra output, and raw203/270/automatic input substitution reject.
Exact source association must survive decoding/completion without archive lookup. These are design
cases, not newly numbered or passed vectors. Allocation and successor model proof remain gated.

## M2 — strategy comparison and proposed requirement

| Criterion | A: closed nested source path | B: top-level ObserverId copy plus equality |
|---|---|---|
| New authority required | Separately versioned projection requirement and compiler semantics | Governed exact cross-field equality on evidence construction, decode, entry, completion and restore |
| Existing PRJ | Old top-level requirement remains unchanged; new grammar selects its roster key | Existing top-level selector mathematics reused unchanged |
| Representation | M1 stores Source337 once; no second observer field | Producer-derived copy is safe only if every authority boundary enforces equality; redundancy is not itself a second epistemic authority |
| Reuse | Can select required nested identities in other explicitly admitted record envelopes, including a future consumer of outcome evidence; no such consumer is admitted now | One bounded envelope is narrower; a reusable equality primitive would be a separate undertaking |
| Integration cost | New path schema, role traversal, registration support, admission order and negative controls | New canonical semantic equality contract plus proof no decoder/restore/admission path bypasses it; registration support still required |

Propose A because it provides explicit typed input selection reusable across accepted embedded
evidence without materializing a new ownership index. This judgment depends on restricting the
grammar below; it is not justified merely by saving duplicate bytes. B remains a viable competing
design, not retired or prohibited. Neither exists in accepted PRJ today. EVID's historical removal
of copied fields remains correct for its contract and does not prejudge this choice.

Working extension label: `projection-input-field-path/0.1-draft`, symbolic and unaccepted.
Proposed requirement replaces SelectorSourceFieldId only in a new requirement record with a
nonempty finite ordered field-ID path; all other target-template, projected-field, output-role
and output-accessor meanings retain PRJ semantics. Old requirement266 retains its one top-level
field. A model must select the new version explicitly; never reinterpret old bytes.

Proposed closed symbolic record, all five fields required:

```text
EventDependentProjectedFieldPathRequirement
    SelectorSourceFieldPath    nonempty ordered list<FieldId>
    TargetStatePathTemplate    existing StatePathPattern
    ProjectedFieldId           existing FieldId
    OutputRole                 existing CanonicalIdentityRole
    OutputAccessor             existing ProjectionAccessorId
```

The list describes a path; it grants no traversal of list-valued payload fields. Field IDs use the
existing field-ID domain, with no numeric member assigned here. Every field must resolve exactly
once in its committed schema. Finite path length bounds extraction; no implicit recursive descent
or schema search occurs. This first admitting profile fixes the path to the three M1/337/203 fields
above; accepting a path grammar does not admit other root schemas or consumers automatically.

TargetStatePathTemplate retains exactly one map-key wildcard and the admitted identity-key,
canonical-record-value family. Its template must be covered by the registration ReadDomain. The
terminal source role must be compatible with that map-key role, and the target required projected
field must have a role compatible with OutputRole. For this profile these specialize to IDN's
immutable268/1 roster, required267/1 character field, namespace1002 character-qualification role
and fixed ResolvedCharacterSubject accessor. No extra authority or alias accessor is introduced.
Exactly one subject requirement may cover the roster across old and new requirement forms;
duplicate, alternative or static roster access is rejected at compilation. Old266 remains unchanged.

For the proposed formation payload the exact path is:

```text
MeasurementEpisodeLearningEvidence.Source337
    -> CognitiveMeasurementEvidence.Observation
    -> PresentObservation.ObserverId
```

At compilation start from the registration's exact admitted input schema/version. Every intermediate
field must be required with one exact committed canonical-record schema/version; the terminal field
must be a required identity carrying namespace1000 and absent DomainValidatorId. Compare structural
schema fields and committed roles, not display names. No list/map traversal, dereferencing, unions,
optional/default branch, wildcard, computed selector, callback or state-derived source is admitted.
The source path ends at the identity; the subsequent existing roster lookup is the target projection,
not permission to put a map lookup inside the source path.

At entry validate live admission and exact registration/event/payload association before any nested
extraction. Extract only through the compiled required fields, validate the terminal role, form the
existing exact IDN roster map key, require its entry, validate the projected CharacterId role, then
expose only ResolvedCharacterSubject. Keep the exact roster ReadDomain, target field, qualification
validator and fixed accessor. Record the IDN actual read through existing projection trace semantics;
source payload selection is not an extra state read. No static/alternate roster accessor is added.
Registration decoder integration must explicitly admit the future memory registration; broadening
requiredProjection.ts's current272/318 switch alone is not a contract or proof.

The entry sequence is explicit: identify registration; authenticate/admit generated event; validate
the exact payload/schema; traverse the compiled source path; validate terminal ObserverId role;
construct the exact IDN roster path; perform its required read; expose only ResolvedCharacterSubject;
then run formation. Forged M1 fails before any roster read. Nested canonical extraction produces no
ActualReadRecord or transition-visible source accessor; only the roster read is an authoritative
state read. M4b's future composite memory read is a separate contract, not a permission hidden here.

Required local design cases under existing MEMR-D/K (no new canonical vector labels): optional or
union intermediate, wrong schema/version, empty/truncated path, wrong terminal role, state-derived
selector, expired/swapped admission and registration, absent roster, and another observer with the
same observed SubjectId must fail without memory exposure or mutation. A valid path must resolve
the same subject as the accepted top-level PRJ/IDN control for the same ObserverId. None is passed.

## First draft causal resolution

The proposed path is: live admitted337 → distinct measurement learning evidence → registered
formation with exact admitted PRJ/IDN projection → durable episodic state. At a strictly later
instant, admitted exact cue → subject-isolated memory read → transient recollection.

Propose learning-evidence production at130 and formation at140 in T1. No formation-state consumer
runs in T1. Recall at T2 must use a phase justified by its own memory-read contract; no new phase
or same-event belief ordering is selected here. ORD-001 stays open. The transition graph must
exclude raw203 and AutomaticAdaptationInput from formation and exclude evidence/formation routes
from reconstructing hidden REG state.

Propose exact, single-episode insertion with no replacement, merging or reinforcement. Each
successfully admitted source337 produces one formation, with duplicate child/output detection
before mutation. A second attempted insertion at the same key is a contract failure, not a strength
increment. Use the existing WRT set operation with expected.presence=false; state.ts rejects an
occupied key as STALE_PRECONDITION. Formation performs no semantic occupancy read. Tentative state
key is (resolved CharacterId, existing337 occurrence identity): no new
observation or episode identity is needed merely for addressing. This is a design proposal, not an
allocated key schema. State retains the complete safe source and enough accepted learning-boundary
provenance to validate formation; decide its exact embedding after M1/M2, without duplicate scalar,
ObserverId or observation-time authorities. The observed SubjectId remains historical metadata.

Formation semantics receive only admitted measurement learning evidence and the detached projected
subject; they never receive roster, trace, model, REG or arbitrary state resolvers. Write validation
checks the declared absent precondition and canonical key/value consistency at the authority
boundary; such validation is not a semantic read channel. Recall receives only its exact admitted
cue and the result constructed by the proposed M4b preauthorized composite projection. Merely
passing a result without that addressed construction is insufficient. Recall has NoStateWrites, including no
retrieval counter or reinforcement. Precision1 remains observation metadata.

Formation ablation suppresses the write through a committed control model. Recall-access ablation
retains the same persisted episode but removes the responding read/output. Both require explicit
model/control identity and matched later cues; no caller callback or fallback flag. With retained
content absent from transient input, recall must still recover it from memory; if archive/trace
contains the old337, capability isolation must nevertheless prevent reading it.

## Frozen target obligations — MEMR-A..P, NOT PASSED

Labels are research labels only. These freeze the accepted target's proof burden; exact executable
fixtures, failure codes, schedules and model/component scope still require shape closure.

| Vector | Required witness / adversarial control |
|---|---|
| MEMR-A | Same model/owner/source identities and topology, permitted5 versus51/10 → different retained episodic content. |
| MEMR-B | Identical admitted337 with different hidden decomposition/facts → equal memory and recall. Use actual component witness plus public exclusion where frozen model cannot express the variation; never imply public R0 variation. |
| MEMR-C | Suppression → no337/no episode; other-observer or forged evidence cannot form this character's episode. No episode does not mean remembered negative measurement. |
| MEMR-D | Only admitted PRJ/IDN supplies CharacterId. Mutate nested ObserverId, use same observed SubjectId/different observer, substitute projected subject/registration/event, missing roster and alternate roster access: reject before write. |
| MEMR-E | Formation diff confined to the exact declared episode leaf and sole mutation authority; all other family bytes unchanged at formation. |
| MEMR-F | Preserve exact historical203/337 content, including51/10, time, unit and precision; no float/rounding/reward/strength interpretation. |
| MEMR-G | Later D/R0/permission/calibration/current observation changes cannot rewrite episode or recalled historical content; separate public/component scope when needed. |
| MEMR-H | Same content-free governed cue at T2>T1 recovers the corresponding measurement solely from the addressed memory. |
| MEMR-I | Formation ablated → no episode and no later recalled measurement even if old trace/archive still contains337. |
| MEMR-J | Recall access ablated → episode may remain byte-identical, recalled response absent. |
| MEMR-K | Attempt current-observation, probe, REG, hidden-truth, trace/archive or ID-to-source lookup from recall: no capability. Cue contamination with scalar/full337 rejects. |
| MEMR-L | Separate-process save/restore then later recall equal; wrong-model, forged owner/key/content, malformed pending cue reject. Formation/read/output failures restore state, queue, IDs, trace, outputs and clock exactly. |
| MEMR-M | Frozen EVID/probe/carriage models and packets remain valid controls; successor topology must have its own matched-branch/sentinel proof. |
| MEMR-N | Belief/expectation, association, appraisal/value, skill, habit, person model, relationship, identity/disposition and regulatory adaptation acquire no mutation from this seam. |
| MEMR-O | Structural first-divergence trace: equal complete cognitive state before revealing observation; different permitted337; first persistent cognitive divergence at governed episode formation. Recall is later usability, not that first divergence. |
| MEMR-P | ADAPT-9b qualification requires both formation divergence and later usable recall with all exclusion/ablation/preservation obligations; labels/storage-byte differences alone never pass it. |

## Historical intake dispositions

| Ledger items | Target disposition |
|---|---|
| SUB-001,003,008,009,011 | PORT/CONTRACT preservation: exact arithmetic/content, typed identity, causal trace and transactional replay, paired controls, retained failure history. |
| MEC-004; P3-001 | CONTRACT preservation of evidence/truth and causal-box separation; no historical provenance import. |
| MEC-009,010; EXP-006; PHEN-MEM-001 | CONTROL + CORPUS retained for future accessibility/retrieval lifecycle. Historical memory.test.ts and memoryAccessibility.ts are not equivalent implementations of this target. No recency, decay, reinforcement, top-K or activation result is claimed. |
| MEC-021 | CONTROL + CORPUS preserved but not applicable as encoding mathematics here: an observer owner is not a salience-attributed event participant. No participant list, Need outcome or attribution is selected; even historical single-participant backward equivalence is not claimed. |
| MEC-022; RET-013 | CONTRACT/prohibition: preserve historical content/calibration; never recompute biography. |
| MEC-005,006,007,008; MEC-001,002; CTL-002 | Existing control/candidate/corpus obligations retained beyond this target: attention, surprise, salience, association and estimates/censored updates are not prerequisites for exact retention. No formula is imported or retired. |
| RET-006,014 | Prohibited hidden overflow/provenance/truth-effect shortcuts remain negative boundaries. |

No historical files are changed or imported; no historical test is represented as a new-seam pass.
General compression/reconstruction, retention/accessibility separation and all broader North-Star
memory concerns remain future obligations, not rejected hypotheses.

## Review boundary and deliberately deferred work

Target and revision-1 inspection acceptance are recorded. Implementation cannot be obtained by
adding a handler to the frozen carriage model. Review this revision's M1 symbolic semantics and
M2 comparison/closed-path requirement first, then develop M3 state/writer, M4a cue/delay, M4b exact
read requirement and finally M5 composition in that order. M4a/M4b choices above are explicit
proposed directions, not completed contracts. The new compatible contracts
must close their own expressibility gates; accepted ancestor semantics remain frozen.

Deferred: acceptance and numeric layouts of proposed symbolic schemas; permanent allocation; exact learning-evidence occurrence/output
inventory; state key/value schema; nested-projection grammar; mutation registration and topology;
cue authority/input grammar and phase; missing-recall wire behavior; ablation packaging and matched
allocation budgets; successor RulesVersion/trace/persistence; implementation and all runtime passes.
Belief/expectation, appraisal/reward/value, semantic search, consolidation, decay, salience,
reinforcement, top-K, similarity, fuzzing and generalization remain outside the accepted target.
ADAPT-9b, parent control9, PHEN-ADAPT and Campaign2 remain OPEN.

Revision history: rev1 inspection/target accepted; nested-path preference originally rested too
heavily on eliminating duplication, and M4 hid separate cue-generation and owned-address problems.
Rev2 retains B as viable, compares closure costs, specifies M1/M2 proposals, splits M4a/M4b,
rejects preauthored future1124 cues, places the cue branch at actual337 independent of formation,
and records delayed-child and pending-generated-event persistence gaps. No earlier acceptance is
treated as whole-shape approval; MEMR-A..P remain unchanged and NOT PASSED.

Rev3: user rejects rev2's proposed new M1 registration grammar. Inspection confirms the accepted
carriage cross-version RegisteredTransitionProducer rule; M1 now uses V04 unchanged with a V07
registered producer and new successor model data. M2's five-field closed requirement and exact
admission-before-extraction order are explicit. M4a/M4b decomposition and formation-independent cue
are accepted; RecallDelay representation/value/phase/overflow and pending-event authority remain
unresolved. M3, M4a, M4b and M5 are not closed. No whole-shape or allocation acceptance is inferred.

M3 review update, 2026-09-07: physical family/value, sole authority, insert-only patch/diff,
route and trace direction are accepted. Whole M3 shape is withheld. Revision2 corrects the
duplicate capability to accepted StateWrites and removes state/restore IDN lookup. Structural
validity and historical formation legitimacy remain distinct; the latter is an open M5 obligation.

M3 acceptance update: revision2 component SHAPE ACCEPTED (2026-09-07), with exact-key condition
on M4b. Earlier withheld disposition is historical. The next design is
[M4b character-owned addressing](CAMPAIGN2_MEASUREMENT_MEMORY_M4B_DRAFT.md); M4a/M5 and allocation
remain gated. No whole-seam or runtime qualification is inferred.

M4b acceptance update — 2026-09-07: measurement-episode-read/0.1-candidate SHAPE ACCEPTED;
M3 key condition CLOSED. [M4a delayed opportunity revision1](CAMPAIGN2_MEASUREMENT_MEMORY_M4A_DRAFT.md)
is now proposed. Numeric allocation still awaits M4a/composed inventory; MEMR-A..P NOT PASSED.

M4a acceptance update — 2026-09-07: measurement-recall-opportunity/0.1-candidate SHAPE ACCEPTED.
[M5 composition revision1](CAMPAIGN2_MEASUREMENT_MEMORY_M5_DRAFT.md) now owns composed recall,
stage/topology, historical authority and inventory. No whole-seam, allocation or runtime acceptance.
