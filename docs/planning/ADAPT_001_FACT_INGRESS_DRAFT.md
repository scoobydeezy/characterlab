# ADAPT D — actual-fact ingress, revision 4

2026-09-06. Part of adaptation-input/0.31-candidate. **SHAPE ACCEPTED AS COMPOSED**, 2026-09-06; permanent allocation authorized and pending,
canonical implementation not yet authorized. This drafts D after consolidation pass 3's version/permission corrections.
It does not choose E's transition math or F's magnitude definitions.

## Inspection and initial authority boundary

Accepted WorldEventTruth type 210 carries WorldEventId, EventTypeId, OccurredAt and EventBindings.
It is not itself a receipt for regulatory exposure or completed practice. A role binding, phase
number or causal parent cannot establish those facts. No canonical exposure/practice producer
was found in src; the existing phaseOrdering guard only prohibits learning-evidence output from
automatic adaptation. Generic EVID ingress admits actual registered outputs, not arbitrary external
payloads. The missing source cannot be hidden inside an InputAdmission predicate.

**Initial control proposal:** admit explicit authored actual-fact interventions through the
experiment's committed ordered input sequence. Such an intervention states actual contact or
completed repetitions, not an attempted action, intention, perceived outcome or inferred physiology.
The admission policy and exact executor are model-governed; the particular intervention facts and
times belong to RunIdentity's ordered inputs. This is a thin externally stipulated truth control,
not a claim to derive exposure from a general world/body simulator.

The authoritative producing occurrence in this control is the actual scheduled intervention event,
using its existing EventId. It is not WorldEventId and does not allocate a fictitious type-210 event.
A later endogenous world producer must earn its own complete actual-fact derivation and may not
reuse this authored-intervention authority merely by constructing the same payload.

## Proposed complete fact and input shapes

```
AuthoredActualAdaptationFact
    Fact          RegulatoryExposureFact | ProceduralPracticeFact

RegulatoryExposureFact
    CharacterId
    ExposureReferentId
    ActualContactCount           canonical unsigned integer

ProceduralPracticeFact
    CharacterId
    ProcedureId
    CompletedRepetitions         canonical unsigned integer

AutomaticAdaptationInput
    AutomaticAdaptationInputId   new typed runtime occurrence
    Basis                       RegulatoryExposureFact | ProceduralPracticeFact
    OccurredAt                  existing SimInstant encoding
    TransformationVersion       adaptation-input/0.31-candidate
```

All fields required, no others admitted. Subject is stored only in the chosen basis record, not
duplicated at the envelope. CharacterId uses namespace 1002 + validator/character-qualification;
ExposureReferentId uses namespace 1002 without DomainValidator, admitting all valid governed
SemanticReferentId origins; ProcedureId resolves its governed definition. Counts are exact counts, not dose, reward, skill delta or scaled state magnitude.
Zero is an explicit actual zero count. Matched evaluation topology additionally requires the
fixture-specific E applicability constraint below; admission alone does not guarantee it.
No Exposure strength/unit, RegulatoryVariableId, LoadDomainId, target leaf, authority, rule ID or
state delta is supplied by the producer. E must declaratively determine its target from the facts
and committed rules. If a required phenomenon needs dose or duration, this initial basis needs an
explicit extension; counts cannot be quietly reinterpreted as either.

No ObserverId, ExperienceId, perceived observation, evidence reference or optional experience link.
Scheduler identity remains exclusively in trusted execution context, production associations,
child causal-parent fields and omniscient trace ancestry. AutomaticAdaptationInputId is its sole
domain identity. No EventId or source-certificate field is stored in Basis, AAI or dispatch.
AAI identity, scheduler IDs, ordinals and TransformationVersion cannot be applicability, key or
math operands. E may consume Basis facts and explicitly declared semantic time only.

The paired control uses the same producer schedule/basis identity and changes only the actual
count. One producing event yields one input even for zero. Two factual basis kinds require two
authored interventions/events in this initial control, with matched topology across comparisons.
This draft does not supply a multi-output generic count extension to the truth producer.

## Closed producer declaration and execution

```
AuthoredAdaptationFactProducerDefinition
    EventTypeId          one existing event-type identity representation
    PayloadSchema        exact AuthoredActualAdaptationFact schema ref
    OutputSchema         exact AutomaticAdaptationInput schema ref
    Phase                110
```

One proposed singleton uses RegistryDefinitionId member definition/authored-adaptation-facts,
RegistryKindId member registry/authored-adaptation-facts, DefinitionVersion
adaptation-input/0.31-candidate and this exact definition. This is a narrowly governed source bootstrap,
not a wildcard external-input branch added to EVID's generic producer grammar. No producer
MutationAuthority, learning-route membership or new identity family is needed for the declaration.

## Structural InputOnly source admission

Inspection of scheduler.ts and persistence.ts found no distinct ordered-input compiler: constructor
initialQueue, public schedule and restored queues are accepted independently of the committed input
manifest. RunIdentity hashes ordered inputs but does not establish that association by itself.
This proposal therefore ADDS a restricted bootstrap/restore profile rather than assuming one exists.

The registry kind/version makes event/authored-adaptation-fact InputOnly. Only the admitting run
compiler may instantiate it. Generic initialQueue seeding, public schedule, and all handler emission
paths must reject that type with new flat SchedulerFailureCode INPUT_ONLY_EVENT_ORIGIN_VIOLATION.
A source event type/schema alone is not authority. No IsAuthored field, payload token or certificate ID.

For this initial fixture, the run compiler receives the complete ordered input manifest and admitted
initial state, verifies their canonical digests against RunIdentity, starts with an empty queue and
the accepted default event/sequence allocator values, and allocates all initial input events in
manifest list order before execution. Each entry contains DueAt, Phase, EventTypeId, Payload and
Dependencies in their existing canonical representations. Authored-fact entries require phase 110,
the exact source schema and empty dependencies. Initial events have no causal parents.
No additional caller-supplied initial queue or runtime schedule injection is admitted in this profile.
Other fixture initial events are likewise compiled from this list under their own accepted schemas.
The initial clock is zero; negative/past entries fail admission. RunSeed and model identity are fixed.

The input compiler owns the sole internal insertion path for InputOnly events. Normal scheduling
cannot invoke it. Each source event is consumed once through the closed source executor; no handler
may generate another such event. The induction is structural: compiler-only creation plus forbidden
runtime creation. It does not infer origin from a copied source ID.

**Restore: direct pending-source validation, no historical replay.** InputOnly events are
non-cancellable and their authored DueAt must be strictly greater than the initial clock (zero).
No source may be rescheduled, removed, replaced or cancelled except by successful execution of its
complete instant. A runtime origin/cancellation violation uses INPUT_ONLY_EVENT_ORIGIN_VIOLATION.

The saved clock B is the last successfully committed whole-instant boundary, or zero before the
first instant. scheduler.ts advances it only at successful commit; saves must be active/quiescent.
Strictly-positive source DueAt means an initial save at B=0 has all sources still pending, even if
other admitted initial work has DueAt=0. At every later settled B no source with DueAt<=B can remain.

On restore, perform the existing ModelIdentity/RunIdentity/state/queue/allocator validation and:
1. Require the original complete ordered-input manifest as restore context; canonical commitment
   must equal RunIdentity.OrderedInputSequenceDigest. No original initial-state value is required.
2. Recompile only the initial event schedule from that manifest using the exact run compiler's
   fixed initial event/sequence allocator values and manifest order. Do not execute any event or
   allocate against the restored runtime allocator. Include all initial entries when reconstructing
   allocation positions, not just authored facts.
3. Let Expected(B) be the complete originally compiled InputOnly ScheduledEvents whose DueAt>B.
   Let Pending be the InputOnly subset of the saved queue. Require exact canonical set equality
   and unique EventIds/EventSequences; compare full events, including payload, DueAt, phase,
   dependencies, parents, IDs and sequences. Do not accept mere payload/ID equality.
4. Reject missing, extra, altered, duplicate or already-settled sources with existing SaveContractError
   (no code field). Continue directly from the saved state/queue/allocators after successful checks.

This checks continuation provenance without re-executing domain history or comparing historical
trace/output bytes. It adds no source map/certificate or save-schema field. Existing save integrity
checks remain in force; this narrow check neither proves arbitrary historical state authenticity
nor makes the trace an authority database. Verification cost is bounded by the initial input list
and pending queue, not by historical transition count. Original manifest context is the already
required committed input artifact, not a newly minted provenance representation.

The compiler/restore profile is fixed semantics of registry/authored-adaptation-facts at this version,
committed with the source declaration and schemas to ModelIdentity. Changing that behavior requires
a versioned contract change. Runtime-mutated insertion/pending-set checks are proof-gate mutants.


## Direct same-instant consumer ingress

ADAPT's V06 extension uses the following exact producer union:

```
TransitionInputProducerV06 = FrozenSemanticExperienceProducer
                           | RegisteredTransitionProducer
                           | AuthoredAdaptationFactProducer {
                               ProducerDefinition: RegistryDefinitionId
                             }
```

The third variant requires the exact member definition/authored-adaptation-facts and is legal
only for the two ADAPT consumer registrations. V04 cannot encode it. The V06 InputAdmission
contains this producer variant, exact AAI schema and ExactImmediateProducerOutput; the nested
AdaptationTransitionRegistrationExtension contains the one accepted basis and output/rule contract.
No parallel host-side producer table is allowed. The source registry fixes phase, origin and executor;
a declaration naming only event type/schema/phase cannot replace the source variant.

ADAPT's V06 extension names this singleton's source contract and its exact output schema, plus
AcceptedBasis = RegulatoryExposureFact or ProceduralPracticeFact. The two phase-140 consumer
registrations are on route/automatic-adaptation; the source bootstrap is not on either learning route.
This ADAPT-owned source case does not widen V04 TransitionInputProducer. A V04 registration cannot
name it. Generic RegisteredTransitionProducer continues to resolve only actual registered rows.

The shared extension observes successful bootstrap output just as it observes the accepted special
SEM producer. Match the chosen basis to exactly one ADAPT consumer; generate one child at phase 140
with exact complete source output, SameAsProducer DueAt and the actual producer event as causal
parent. Use ordinary event/sequence allocation and the accepted transaction-local ingress association.
No persisted receipt, parallel dispatcher ID or source-provided target consumer exists.

The source executor copies admitted Fact to Basis, sets OccurredAt to its actual DueAt, allocates
one AAI occurrence and returns exactly one AAI output. No rule, state read/write or source ID field.
Output validation proves these equalities from execution context before generative ingress.

At production and consumption enforce:

```
input.OccurredAt = actual fact intervention DueAt
                = phase-110 producer DueAt
                = phase-140 consumer DueAt
```

Both schema/source admission and basis admission precede rule resolution. Wrong source, untrusted
external child, wrong basis/time, missing or duplicate generated child fail, never NoStateChange.
Use INPUT_NOT_ADMITTED for consumer entry defects, TRANSITION_OUTPUT_VIOLATION for faulty producer
output and TRANSITION_INGRESS_VIOLATION for generated topology defects. Malformed model/source
registration uses INVALID_CONFIGURATION. The exclusive settlement stage consumes the generated
events exactly once. Delayed historical consumption is outside this grammar.

## Proof proposal and limits

AD-D1: committed nonzero and zero-count interventions each yield exactly one genuine child, with
equal allocation topology; no observer/experience is needed.
AD-D2: right-shaped payload, copied domain occurrence or manually supplied causal parent cannot forge
the source association; a handler-emitted intervention event fails.
AD-D3: mismatched OccurredAt, delayed DueAt, repeated output ID or missing/duplicate child fails.
AD-D4: regulatory basis cannot reach the procedural consumer and vice versa; neither reaches EVID.
AD-D5: rollback/restore retains the authored input/event association and exactly-once continuation.
AD-D6: both branches descend from the same actual intervention R through the bridge specified
below; EVID is not derived from AAI. Unrelated simultaneous roots fail. Ancestry is trace-side only.

These are proposed frozen controls, not passed. The restricted compiler/pending-set profile, complete V06
extension packaging and the relevant F key-role declarations remain review items. This proposal
states the extra primitive instead of pretending EVID already admits authored truth interventions.
MEC-003 remains required when an input actually derives from a bounded effect. This contact/count
control asserts no bounded-effect decomposition; it does not erase that conditional obligation.
No kinetics, tolerance math, competence growth, truth comparison or cognitive-state writer is added.

## Paired-run intervention contract

A and B share ModelIdentity, initial state, RunSeed, input topology/timing, basis identities, all
non-intervention input bytes and immediate permitted observations. Exactly one actual count field
differs. OrderedInputSequenceDigest and therefore RunIdentity differ through that field only.
Compare with the accepted ComparisonSpecification/ComparisonDrawMap where relevant, not a claim
of identical run identity. Both source events and generated children exist in both runs.
For this fixture E must select the same ApplicableRules from basis kind/semantic identity, ignoring
the intervention count for membership. That same rule evaluates in both runs; the count may affect
its result. Zero count cannot suppress rule resolution or evaluation allocation in this witness.

## Common authoritative root — fixture bridge proposal

The both-affected control must use one actual InputOnly intervention event R at phase 110.
Its source execution emits AAI and, independently, a governed consequence-fixture child at phase 120.
The child’s causal parent is R through accepted scheduler EventEmission parent attribution.
That branch receives no AAI ID or AAI record; it enters accepted SEM consequence semantics, then
EVID. AAI and EVID share only omniscient ancestry. Two unrelated seeded events are not a witness.

Inspection: EventEmission supports child causality, but sem001JIntegratedGate/phenSem001Run uses
its own OBSERVE fixture payload and phase-10 setup; it does not itself provide an accepted general
phase-110→120 authored-fact bridge. Do not relabel that handler phase 120 and claim SEM-H compliance.
Propose a fixture-only committed bridge registration associated with this source declaration,
whose child event type, exact permitted consequence recipe and observer set are fixed in the model.
The bootstrap remains exactly-one in AAI domain outputs; the bridge child is separately checked
event topology. Both branches use R directly, with identical topology in paired runs.

The exact receiving recipe is now proposed in [fixed consequence bridge](ADAPT_001_CONSEQUENCE_BRIDGE_DRAFT.md).
It uses a count-independent observable pulse and the accepted observation/SEM consequence operations,
with actual R ancestry and AD-D11..15. It remains subject to review and implementation proof.

## Additional proposed controls and F inventory

AD-D7: initial seeding, public schedule and handler emission cannot create InputOnly events;
compiler admission is the sole successful origin. Mutating any entry-point check must be detected.
AD-D8: missing/extra/altered/duplicate future sources or a source due at/before the saved boundary
fail exact pending-set equality via SaveContractError. Initial save at zero retains all positive-time
sources; a save after source T excludes that source. A trace/output projection change must not affect
this provenance check. No domain handler runs during validation; continuation uses saved state.
AD-D9: canonical run comparison differs only through the ordered count field/digest; no model,
initial-state or seed change; same ApplicableRules and output allocation topology.
AD-D10: the AAI producer and consequence branch have the same actual R; unrelated same-time roots,
AAI→EVID or EVID→AAI fail the ancestry control. Exact bridge must be supplied before this can pass.

F additions: four fact/input schemas and their fields; AutomaticAdaptationInputId occurrence family;
event/authored-adaptation-fact; registry/authored-adaptation-facts; RegistryDefinitionId member
definition/authored-adaptation-facts; AuthoredAdaptationFactProducer V06 union variant and basis tags;
AAI OccurrenceIdentityRule/PRJ identity role; INPUT_ONLY_EVENT_ORIGIN_VIOLATION. Bridge inventory is specified in the companion recipe. No SourceEventId, Mode token or certificate identity.

## Composed source/bridge closure — revision 4

Every successful admitted R produces exactly one AAI domain output. With no committed bridge
singleton it produces zero bridge children; with the singleton it produces exactly one phase-120
child per Channels entry, in canonical ChannelId order. Allocate/generate all bridge children
before the AAI generative consumer ingress child. All bridge children have actual R as parent;
AAI generative consumer ingress also has R as parent through the shared interpreter. No payload
mode/tag selects the branch. AAI deletion/duplication is TRANSITION_OUTPUT_VIOLATION; missing,
extra, wrong-parent or duplicate bridge/consumer children are TRANSITION_INGRESS_VIOLATION.
The accepted bridge recipe and its AD-D11..15 remain intact.

D revision 4 is internally shape-ready after pass-7 composition cleanup and the pass-6 review.
A/B/C remain internally shape-ready. ADAPT as a whole is not accepted; E/F remain open.

Composition pass 7: owning version synchronized to ADAPT 0.30; compact pending-source validation
is the sole active restore contract. Historical replay was withdrawn. AD-D1..15 are frozen, not passed.

Pass 8: owning ADAPT version synchronized to 0.31 for E revision 2; D semantics unchanged.


F composition update (2026-09-06): [symbolic packaging](ADAPT_001_PACKAGING_DRAFT.md) records
the supplied domain decisions and ownership audit. All ADAPT-owned semantic definitions target
adaptation-input/0.31-candidate; independent V06 and settlement targets remain 0.6-candidate and
0.2-candidate. Candidate version spelling is not whole-contract acceptance. A–E behavior is
unchanged; shared PRJ-owned ProjectionAccessorId now closes the accessor allocation-home gap. No allocation
or implementation. Historical status entries above remain review history.


Accessor resolution (2026-09-06): [F packaging revision 2](ADAPT_001_PACKAGING_DRAFT.md) and PRJ
record shared ProjectionAccessorId with three symbolic members, no numeric allocation and no
global type-147 restriction. No known identity-home gap remains; A–E and their versions are
unchanged. Final packaging/composition review remains before allocation or implementation.


## Current whole-contract disposition — 2026-09-06

2026-09-06 whole-contract verdict: SHAPE ACCEPTED at adaptation-input/0.31-candidate with
transition-admission-extension/0.6-candidate and adaptation-settlement/0.2-candidate. A–D are
shape accepted as composed, E revision 2 unchanged, and F packaging revision 3 shape accepted.
Permanent allocation is now authorized as the next specification step; canonical implementation
is NOT authorized. ADAPT-001 stays OPEN in the formal register until PHEN-ADAPT-001 and required
proof/mutation gates pass. VAL-001 does not block shape acceptance or allocation; close it before
canonical reliance on affected governed executables, including the CONTENT-001 character-kind
validator. AD-F1..7, AD-E1..13, AD-D1..15, AC-A..L, main ADAPT controls, REG-A..R, EVID-A..T and
applicable inherited PRJ/WRT gates remain frozen; this verdict passes no implementation gate and
does not rescind previously recorded WRT substrate proof. PHEN-ADAPT-001 remains NOT PASSED.

Earlier dated restrictions and open-status notes are history; this verdict governs the current gates.
