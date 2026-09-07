# Diagnostic regulatory operating-point probe — instrumentation, not a response law

**Current disposition: WHOLE SHAPE ACCEPTED** at `regulatory-diagnostic-probe/0.1-candidate`.
[Formal acceptance and InputOnly clarification](../formal/REGULATORY_DIAGNOSTIC_PROBE.md)
incorporate revision 3 below. Historical proposal/withheld wording is retained as review history,
not current status. PROBE-P is frozen in the acceptance record; PROBE-A..P remain NOT PASSED.
The [numeric/member review](../formal/REGULATORY_PROBE_ALLOCATION_REVIEW.md) is the next gate;
implementation is not yet authorized.

2026-09-07. `regulatory-diagnostic-probe/0.1-draft`, revision 3.
Research target accepted; proposed seam shape NOT ACCEPTED. No allocation or implementation.
PHEN-ADAPT-001 and Campaign 2 remain open.

Revision-2 review accepted the displacement-only capability and absolute diagnostic observation
semantics; it accepted the records, dedicated channel and fixed-budget strategy in direction.
Revision 3 addresses the three remaining review blockers and adds PROBE-N/O. Whole-shape
acceptance is still withheld pending review. The intended accepted identifier is
`regulatory-diagnostic-probe/0.1-candidate`; this draft does not activate that version.

The user accepted the narrow first witness: **first observer-accessible divergence is the
permitted PresentObservation/203 produced by the diagnostic probe**. X, OutcomeEvaluation and
OutcomeLearningEvidence remain byte-identical under the current reference-only SEM/EVID contracts.
This resolves the revision-1 scope question; it does not accept the remaining probe shape.
ADAPT-9a (later state-mediated permitted observation) and ADAPT-9b (first cognitive divergence)
are proof labels, not canonical IDs. Neither is passed here; 9b and parent control 9 remain open
even if this probe later passes. The PHEN-ADAPT corpus is unchanged.

## Accepted direction and authority

The user accepted R0(C,V,T)+D(C,V) as the first later-challenge research target, authorized
shape drafting only, required a separate later instant and a separate governed probe opportunity,
and preserved the frozen bounded .2 model. Physiology, behavior, performance and reward laws
are deferred. The probe is an explicitly permitted diagnostic instrument, not ordinary perception
of hidden character state. This draft implements none of its proposals.

The North Star and CHARACTER_ARCHITECTURE own the truth/evidence and constitution/adaptation
boundaries; the Research Program Brief owns paired interventions and first-divergence proof.
REG `regulatory-reference/0.5-candidate` owns the exact reference formula, variable lattice and
effective-validity relation. ADAPT `adaptation-input/0.31-candidate` owns displacement and the
existing source. SEM-001H owns consequence reservation and phases. EVID
`character-learning-evidence/0.5-candidate` owns the two unchanged thin wrappers. Neither the
probe's diagnostic interpretation nor its research acceptance amends those contracts implicitly.

## Substrate inspection and an expressibility blocker

| Existing surface | Finding and consequence |
|---|---|
| REG definition and provider | `REG_001_DRAFT_RESOLUTION.md` and `src/campaign2/regulatoryReference.ts`: signed lattice integer n means n/Scale. `referenceOperatingPoint` returns integer R0; `validateAdaptedReference` checks R0+D. No state handle belongs to REG. |
| Displacement | Existing key 294 and leaf 299 at state root 302 field 3; absent leaf means zero. Other four adaptation maps are unnecessary to this consumer. Existing canonical state validation remains mandatory. |
| Observation | `src/observation/observation.ts`: 203 carries rational interval 204, precision, opaque identity and provenance. Existing compiler accepts BoundedEffectTruth/200 and measures a change or potential effect, not an absolute operating point. |
| Current bridge | `src/campaign2/consequenceBridge.ts` and `bridgeObservation.ts`: fixed pulse [1,1], exact singleton unit, explicit truth-provenance cut. Neither compiler admits an arbitrary probe value. |
| X | `semanticSchemaRegistry.ts` type 227 and `semanticEvidenceCodecs.ts`: supporting observation IDs plus semantic bindings/classifications. No embedded numeric observation. The bridge stages only the support reference through phases 121–124. |
| E/L | `evidExecution.ts`: 269 embeds X; 270 embeds E. EVID has empty state and evidence-reference read sets. It cannot follow the support ID to obtain a scalar. |
| Occurrences and transactions | Existing scheduler allocates events/sequences/runtime ordinals; bridge uses execution-local child matching and conditional Experience reservation. Retain that discipline, not content hashes or a probe-local allocator. |
| Packaging | First-profile compilers enforce the frozen recipes. New probe declarations, permitted producer/version, ordered-input admission, trace and restore closure need a separately reviewed profile. Generic record encodability is not profile admission. |

**Resolved scope gap; retained carriage limitation:** matched observation IDs with different
203 interval bytes do not change 227's support IDs. With empty classifications and matched
allocations, X_A = X_B, hence E_A = E_B and L_A = L_B under accepted EVID. Merely adding an
observation output does not inhabit the requested scalar-bearing X→E→L chain.

This corrects the proposal's possible inference that observation byte differences automatically
propagate through the existing wrappers. No failed runtime experiment is claimed: this follows
from the inspected record fields and deterministic wrapper construction. A scalar hash in an ID,
different support counts, or invented boolean classification would evade rather than solve it.

The observation producer still needs an explicit additive measurement contract: repackaging the
operating point as PotentialEffect would falsely introduce effect/change semantics. Reusing the
203 layout is a proposal for representation reuse, not authorization to call the old compiler with
fabricated BoundedEffectTruth. Its new producer version needs explicit admission/restore closure.

## Proposed narrow declaration and input shapes

All names below are symbolic. No numeric IDs, new permanent members, or RulesVersion are assigned.
Use existing governed registry/content identity mechanisms where their accepted roles permit them;
do not introduce a duplicate definition-identity family. Exact record and role manifests await shape
review and a later allocation gate.

Proposed `RegulatoryProbeDefinition`, committed with the model:

    CharacterId C
    RegulatoryVariableId V
    Channel (embedded DiagnosticProbeChannel)
    Available boolean
    ObserverPermitted boolean

One definition, one channel and one observer in this first diagnostic profile. C is a qualified
content-derived CharacterId; V resolves through accepted REG; channel is an embedded committed channel
with fixed observer and subject. The profile requires channel.SubjectId = C for this synthetic
probe fixture. This does not assert that O is C or establish recognition. C/V cannot be overridden
in a queued event.
Availability and permission are independent explicit model facts, not inferred from channel or
state existence. Counterfactual permission/availability controls are separately committed model
variants; within each exposure-count pair the complete model bytes are identical.

Proposed `RegulatoryProbeOpportunity` contains only a reference to that committed definition.
The ordered-input envelope owns DueAt and the existing scheduling operands. No count, D, R0,
effective value, permission override, caller function or state path occurs in this payload.
It is a distinct governed event from event/authored-adaptation-fact. Exact input encoding and
producer admission must be reviewed before allocation; do not repurpose the count-zero source.

At T1 > T0, proposed phase-110 probe consumer resolves its admitted definition. If unavailable,
it performs no displacement read, produces no truth readout and schedules no observer work.
If available, it reads exactly the D leaf for (C,V) from committed entry state, treating absence
as zero; calls accepted REG.referenceOperatingPoint(C,V,T1); validates the effective relation;
then derives integer n = R0 + D. Unknown declarations or invalid effective state reject the
instant, rather than becoming missing observations or clipped readings.

Proposed truth result `RegulatoryProbeTruth`:

    Truth occurrence identity
    Probe definition reference
    OccurredAt T1
    EffectiveValue signed integer n in the definition's REG lattice

C and V derive from the committed definition and are not duplicated in this record. R0 and D
are not observer fields. Their derivation belongs only to the governed omniscient trace, with
the actual exact-path read record, registry reference and causal event association. This draft
does not create a second provenance graph. Revision 2 proposes a separate truth occurrence family
below, subject to symbolic acceptance and subsequent permanent allocation review.

The consumer's compiled ReadDomain is exactly the existing displacement path resolved from C/V;
its admitted projection must reject all other paths, whole roots and cross-character keys.
The host retains scheduler/state access. A detached narrow capability exposes the declared read,
not an arbitrary state object. REG receives C,V,T and D only in its existing validation operation.
No tolerance, sensitization, load, competence, cognitive state or roster read is admitted.
WriteCapability = NoStateWrites; WritableStateFamilies = {}. No automatic-adaptation input is
produced by the probe. The first fixture has no adaptation source at T1, so it creates no
same-instant settlement question or ORD-005/ORD-001 decision.

## Proposed exact observer projection

For available AND permitted only, schedule consequence observation at 120. Truth exists before
lane entry. The measurement is the exact abstract level q = n / REG.VariableDefinition.Scale,
represented by a reduced canonical rational. This is representation-preserving: n can be recovered
exactly given the committed Scale. Scale supplies lattice interpretation, not a physical unit or
conversion. No float, rounding, clipping, threshold or response function is applied.

Propose one new fixed symbolic ObservationUnitId member, `unit/diagnostic-regulatory-level`.
Its meaning is this profile's one abstract operating-point level, not a global comparable physical
dimension. It is not allocated or admitted yet. Namespace-family reuse would still require separate
fixed-member review; observation-unit-identity/0.1-candidate and the old singleton stay unchanged.
No unit registry, UnitDefinition, conversion mechanism or OBS↔REG relation is introduced.

Proposed measurement layout reuse: PresentObservation/203, Point interval [q,q], precision 1
as the fixed diagnostic fixture parameter, no perceived concept tokens and no SafeSourceReferences.
Precision is not a posterior, appraisal or claim that REG's Scale is measurement precision.
Observer, subject, channel and time come from the admitted declaration and event. The new producer
version asserts absolute diagnostic readout semantics. Do not relabel this as existing
BoundedStateChange or ExactEffectControl: revision 2 proposes a dedicated diagnostic channel with
fixed absolute measurement semantics, leaving existing mode enums unchanged.

Available but unpermitted still produces truth-side readout; it produces no observation at all.
Unavailable likewise produces no observer work. Neither case creates MissingObservation, an empty
observation, an Experience reservation, E or L. No diagnostic-failure visibility is assumed.
No R0, D, C/V decomposition, truth ID, source ID, hidden hash or measurement token enters evidence.

For permitted evidence, reserve one Experience conditionally and bijectively using SEM-001H;
run the existing 121–124 lane and stage X at freeze. Preserve E→L phase-130 ordering and
route/character-learning, exact immediate-producer equality and empty writes/read sets.
This staging deliberately yields reference-only X. The narrow accepted witness requires equal
X/E/L, not scalar-bearing E/L. Their support association remains same-observer safe and grants
no permission to fetch the measurement.

## Accepted disposition for the X/E/L gap

The user accepted **permitted-observation divergence** and explicitly rejected interpreting this
as cognitive divergence. Compare the complete observer-accessible permitted projection including
203; retain X/E/L equality. 203 inequality implies neither X/E/L inequality nor belief/memory change.
Within each run one ObservationId names one immutable observation; matching IDs across distinct
counterfactual runs do not assert equality of their scalar values.

Defer numeric evidence carriage until a phenomenon requires a cognitive/learning consumer to
distinguish observations with identical support identity/topology but different permitted scalars.
That future seam must choose its own safe representation and read capability. It may not silently
add a scalar field, hash, classification or dereference operation to accepted SEM/EVID.

## Frozen adversarial obligations — NOT PASSED

These are the minimum review/proof obligations of this draft. No runtime result or shape acceptance
is inferred. PROBE-H and PROBE-M incorporate the accepted scope ruling.

| Vector | Required witness / rejection |
|---|---|
| PROBE-A | Same probe/model/T1/R0, retained D_A != D_B yields distinct truth n. Scale=10, R0=50, D_A=0, D_B=1: truth stores signed integers n_A=50 and n_B=51, both within [0,100] lattice bounds; observation stores exact rationals q_A=50/10=5 and q_B=51/10. Truth never stores normalized q. |
| PROBE-B | Exactly one logical displacement-leaf read; arbitrary-root, other four maps, another C/V, roster and raw-state-handle substitutions reject with no committed output. Absent D reads as zero. |
| PROBE-C | Same D,T,definition and matched occurrence allocation gives byte-identical truth and permitted observation; varying irrelevant adaptation leaves changes neither. |
| PROBE-D | Independently exercise available/permitted, available/unpermitted, unavailable/permitted and unavailable/unpermitted. Last three produce zero OBS/X/E/L; unavailable performs zero D reads; unpermitted available retains truth. |
| PROBE-E | Hidden D changes no character-visible ID, source/hash/token, support count, missingness, reservation or unrelated later allocation. Intervene on availability/permission too, then schedule the same later visible sentinel to expose allocator leaks. |
| PROBE-F | Shared time-varying REG reference at identical T1 in both runs; equal D gives equal reading and distinct D explains the exact difference. Changing time alone is not adaptation evidence. |
| PROBE-G | Negative, zero, fractional and boundary levels preserve exact rational mapping. Reject response/saturation/threshold/performance/clipping substitutions and fake BoundedEffectTruth. Probe writes nothing. |
| PROBE-H | Before T1 complete permitted observer-accessible projections equal despite retained D difference. At T1 truth differs because D differs; the first observer-accessible difference is its permitted 203. X_A=X_B, E_A=E_B, L_A=L_B. No identity, support-count, token, classification, provenance or allocator perturbation earns PASS. The separate cognitive-divergence obligation remains open. |
| PROBE-I | Frozen .2 artifact bytes and RulesVersion unchanged; its later count-zero fixed pulse remains insensitive to D, with equal X/E/L. |
| PROBE-J | Forged definition/producer/child, duplicate/replayed opportunity execution, wrong phase and wrong C/V/subject reject. Queued future occurrences remain valid separate opportunities under normal event identity. |
| PROBE-K | Failure after read, truth allocation, observation, reservation or E/L staging rolls back full instant, allocator positions, outputs, traces and state. Save/restore reproduces continuation exactly under the future profile. |
| PROBE-L | EVID remains no-read/no-write; no automatic-adaptation payload or raw observation directly produces L; truth handles never reach its operands. Cognitive persistent families remain byte-identical. |
| PROBE-M | Hold ObservationId and support association fixed while changing only the permitted scalar; require X/E/L identical. Mutants embedding, hashing, dereferencing, classifying or otherwise propagating that scalar into the current X/E/L path fail. |
| PROBE-N | Across permitted/suppressed variants require runtime-ordinal delta=5, seven generated event IDs/sequences, and identical later common sentinel typed ordinals. Padding values never occur in output, state, permitted projection, SourceRecordIds, evidence or payloads. Inspecting, comparing, hashing, exposing or branching on a padding value, or dynamically calculating its budget, is forbidden even when output bytes happen to match. |
| PROBE-O | The exact per-slot budget and event chain are profile-owned constants. A changed budget or slot count under the same accepted profile must reject; an explicitly accepted changed policy requires a changed RulesVersion and thus ModelIdentity. No host override, runtime branch-count oracle or adaptive padding calculation is admitted. This vector authorizes no alternate policy. |

The proposed fixed-budget construction below addresses allocator noninterference without minting
an Experience when no evidence exists. It remains subject to shape acceptance and execution proof.
Do not mark PROBE-E passed merely because no immediate observer output was emitted.

## Revision 2 proposed symbolic closure

The following choices are proposed for review, not accepted by the narrow-scope ruling. They
replace revision 1's unresolved packaging choices; no canonical allocation table changes here.

### Exact data shapes and identity ownership

All listed fields required, all unlisted fields forbidden; field order below is proposed canonical
order, not permanent FieldId assignment. Text identities below are proposed members only.

| Record | Ordered fields and exact grammar |
|---|---|
| RegulatoryProbeDefinition | CharacterId (existing qualified 1002 role); RegulatoryVariableId (1029); Channel (DiagnosticProbeChannel); Available (canonical boolean); ObserverPermitted (canonical boolean) |
| DiagnosticProbeChannel | ObservationChannelId (1005); ObserverId (1000); SubjectId (qualified 1002, equal definition C); ModalityId (1006, proposed singleton modality/diagnostic-regulatory-probe); UnitId (1039, proposed singleton unit/diagnostic-regulatory-level) |
| RegulatoryProbeOpportunity | ProbeDefinitionId (existing RegistryDefinitionId/1027) |
| RegulatoryProbeTruth | RegulatoryProbeTruthId (new symbolic unsigned-runtime occurrence family); ProbeDefinitionId (1027); OccurredAt (signed SimInstant); EffectiveValue (canonical signed lattice integer) |

Use RegistryEntry/171 to own definition identity, registry kind, seam version and definition
payload, proposing definition/regulatory-diagnostic-probe and registry/regulatory-diagnostic-probe
in their existing 1027/1023 families. The definition embeds its single channel rather than storing
a channel reference plus another registry authority. All channel IDs are unique across the future
model, including its preserved fixed-pulse channel. No new character/content identity family.

The dedicated diagnostic channel replaces revision 1's tentative use of generic ObservationChannel/
201 for this producer. It has no misleading Polarity, effect MeasurementMode or MissingnessRule.
Its measurement semantics are fixed by regulatory-diagnostic-probe/0.1-draft: exact absolute level,
Point [n/Scale,n/Scale], Precision=1, no tokens, no source references. This avoids adding a new enum
to the frozen observation/0.1-candidate channel modes. The observer output reuses 203/204's scalar
layout with the probe's own transformation version, requiring explicit producer/version admission.
Generic 201 and its decoder remain unchanged. ExactPoint precision is the committed synthetic
reliability parameter; it does not encode scale or grant confidence updates.

Inspection confirms 1121 is **FixtureConsequenceTruthId**, not a generic TruthRecordId. Do not
reuse it for the probe. Propose a distinct RegulatoryProbeTruthId family using the existing shared
runtime ordinal allocator. A new family separates record meaning, not allocation authority.
Reuse ObservationId/1115, ExperienceId/1106 and the accepted EVID occurrence families unchanged.

### Opportunity admission and exact state capability

The future ordered-input profile keeps the existing five-position envelope
`[DueAt, Phase, EventTypeId, Payload, Dependencies]`, adding only the distinct symbolic
event/regulatory-diagnostic-probe at positive DueAt, Phase=110, Dependencies=list([]), with the
single-field opportunity payload. It continues to admit the unchanged authored source under its
own adapter. The first probe profile admits at most one probe per instant and forbids an authored
adaptation source at that instant; all preceding adaptation has settled. Duplicate scheduling at
that instant rejects at input compilation. This bounded scheduling restriction is profile-local.

The input compiler authenticates exact original events from the committed input manifest; a
payload or event-name match alone never grants authority. Child matching is exact event/phase/
payload/parent matching in a compiler-owned execution-local table, using existing scheduler
allocation, single use, successful-instant settlement and rollback. This is a new source adapter,
not a claim that transition-admission V04 already admits this InputOnly/read combination.

The definition compiler materializes a registered concrete state path for root 302 / field 3 /
RegulatoryAdaptationKey(C,V)/294. Existing StatePath/ReadDomain and ContractReadProjection enforce
that singleton path and record its read. The host passes only a detached canonical optional 299
leaf result to the arithmetic operation; no host context, root map or configurable callback escapes.
Available=false retains the registered path but ActualReadRecords={}; Available=true reads once,
even if observer permission is false. Scalar extraction uses the existing leaf grammar. No PRJ/IDN
roster relation is needed: this world-side subject is committed C, not an inferred observer identity.

### Fixed-budget hidden-work noninterference proposal

#### Exact symbolic EventTypeId inventory and topology

All event members below use existing EventTypeId/1001. These are the exact proposed spellings
for whole-shape review; permanent member review follows acceptance. Eight new members are proposed:
the source, five probe stage kinds and two padding kinds. The two EVID kinds already exist.

| Slot | Exact EventTypeId payload | Input payload | Sole child |
|---|---|---|---|
| 110 | event/regulatory-diagnostic-probe | RegulatoryProbeOpportunity | probe-observation below |
| 120 | event/regulatory-diagnostic-probe-observation | Observing or Suppressed | probe-tracking below |
| 121 | event/regulatory-diagnostic-probe-tracking | Supporting or Suppressed | probe-binding below |
| 122 | event/regulatory-diagnostic-probe-binding | Supporting or Suppressed | probe-classification below |
| 123 | event/regulatory-diagnostic-probe-classification | Supporting or Suppressed | probe-freeze below |
| 124 | event/regulatory-diagnostic-probe-freeze | Supporting or Suppressed | permitted: event/outcome-evaluation; suppressed: event/regulatory-diagnostic-probe-evaluation-padding |
| 130a permitted | event/outcome-evaluation (existing) | exact admitted X | event/outcome-learning-evidence |
| 130b permitted | event/outcome-learning-evidence (existing) | exact admitted E | none |
| 130a suppressed | event/regulatory-diagnostic-probe-evaluation-padding | Suppressed | event/regulatory-diagnostic-probe-evidence-padding |
| 130b suppressed | event/regulatory-diagnostic-probe-evidence-padding | Suppressed | none |

In the first five rows, child shorthand means the full event/regulatory-diagnostic-probe-*
member in the following row. Every child has DueAt=T1, the listed phase, empty-list Dependencies,
and exactly its immediate predecessor EventId as causal parent. The source is the original
input-compiler event with empty causal parents. Scheduler assigns every child EventId and
EventSequence; parent/child order is strictly increasing and the two phase-130 events are ordered
by their generated sequence. The source and each nonterminal slot emit exactly one child;
the terminal slot emits none. No omitted slot, duplicate branch, side child or adaptation source
at T1 is admitted. Exactly one of the two 130 paths executes. The five 120–124 kinds always remain
probe-owned; they never reuse fixed-pulse event kinds. Forged slot/kind/payload combinations reject.

Every admitted opportunity has the same scheduler work topology irrespective of availability,
permission, n or D. It has seven generated event slots: 120,121,122,123,124,130,130, causally chained.
The first five are proposed probe stage events; permitted stages invoke OBS then unchanged SEM.
At 124, permitted work emits the real accepted OutcomeEvaluation event, which emits the real
OutcomeLearningEvidence event. Denied work instead emits two probe-owned padding events at 130.
Padding is scheduler bookkeeping, never EVID execution, a missing observation or SEM work.
One child per slot except the terminal slot; actual child IDs/sequences are scheduler assigned.

| Slot | Shared runtime ordinal consumption | Typed occurrence when allowed |
|---|---|---|
| 110 | one | RegulatoryProbeTruthId only if available |
| 120 | two | ObservationId and conditional SEM Experience reservation only if available and permitted |
| 121 | zero | No additional runtime occurrence |
| 122 | zero | No additional runtime occurrence |
| 123 | zero | No additional runtime occurrence |
| 124 | zero | No additional runtime occurrence |
| first 130 | one | E identity allocated by unchanged EVID only if permitted |
| second 130 | one | L identity allocated by unchanged EVID only if permitted |

The table is normative for this proposed profile: exactly five runtime ordinal advances, never
computed by observing the other branch. At 120 the order is ObservationId then ExperienceId.
An available but unpermitted source allocates a real truth identity at 110 and uses padding for
the other four positions; an unavailable source pads all five positions. Available+permitted uses
five real domain occurrences. Permission alone never causes truth allocation when unavailable.

#### Closed private padding operation

`consumeRuntimeOrdinalPadding(): void` is a proposed profile-owned infrastructure operation,
distinct from allocation of a typed occurrence. Its exact contract is:

1. Consume exactly the next ordinal from the same accepted shared run allocator, once per call.
2. Return no ordinal or TypedIdentifierValue to semantic code. The internal allocator result is
   discarded immediately; it may not be inspected, compared, branched on, hashed or emitted.
3. Create no occurrence, record, output, evidence reference, SourceRecordId or registry member.
   No PaddingOccurrence or typed identity is constructed, even transiently for bookkeeping.
4. Be callable only by the private probe executor at these exact positions: once at 110 if
   unavailable; twice at 120 if not (available AND permitted); once in each of the two padding
   events at 130. No other phase, handler or caller receives this capability.
5. Enforce the fixed position/count through transaction-local slot authority. Repeated calls,
   wrong-slot calls and calls on a position occupied by a real occurrence reject the instant.
   There is no count argument, allocator setter, reserve operation or generic skip API.
6. Roll back every advance with the entire failed instant, including failures after padding.
7. Persist only the resulting ordinary allocator continuation through existing boundary save/load;
   do not persist padding ordinals or new semantic state. Existing allocator checkpoint fields
   may reflect advancement; that is not publication of individual discarded values as evidence.
8. Treat any budget or pattern change as probe-profile semantics requiring separately accepted
   RulesVersion/ModelIdentity change. A host option or data override cannot change these constants.

This is not a general semantic allocator extension. In particular it does not call
admitObservationLane(true) or mint an unused Experience. No comparison with another run or branch,
allocation-count introspection or value-dependent padding is allowed. Test instrumentation may
inspect allocator checkpoints to prove the budget; the semantic operation cannot inspect its
discarded values. Validation of legal slot/count uses fixed execution state, not ordinal values.
On permitted paths existing owners allocate their occurrences at the listed points; no preallocated
ordinal is injected into EVID. The design requires five runtime ordinal increments, seven child
event IDs and seven sequences per successful opportunity, in matching phase order. Event kind and
omniscient trace may differ; observer-visible IDs later do not depend on hidden branch choice.

All five first stage events exist even in denied branches but perform only probe-owned bookkeeping;
no SEM stage, evidence admission or reservation is invoked there. Scalar data never controls branch
count or allocation. Within a pair, the same availability/permission branch preserves X/E/L IDs too.
Across permission variants the presence of permitted observation intentionally differs; compare
later common sentinel IDs separately. Across hidden/unavailable variants no evidence difference
is allowed at either the probe or that later sentinel. Model/Run identities and full traces are
omniscient metadata, not part of the permitted observer projection.

This is a proposed new **allocation consumption policy**, requiring explicit shape acceptance.
The substrate permits sequential untyped runtime allocation; that fact does not by itself accept
this policy. No allocator namespace or scheduler algorithm is added. Full-instant rollback reverses
padding and ordinary allocations together. Accepted occurrence uniqueness and conditional
Experience bijection remain obligations. Work budget must cover all eight events including source.

### Exact intermediate carriers and trace mapping

Propose closed tagged probe-internal payload variants: Suppressed (tag only); Observing (tag,
RegulatoryProbeTruth value, ProbeDefinitionId); Supporting (tag, existing SupportingObservationId).
These are proposed canonical union layouts, not arbitrary objects or trace handles. Observing's
definition must equal truth.ProbeDefinitionId; validation precedes event emission. Suppressed is
used when either unavailable or unpermitted, so no truth enters the denied stage payload.
The host verifies every carrier against its staged producer. Supporting is used only after the
sole permitted observation is published. The admitted X/E payloads of real EVID events are unchanged.

Future trace binding uses existing TraceRecord with RecordKind=actual EventTypeId, actual Model/
Run/event identities and allocated EmittedEvents. All new probe and suppressed-padding events
use proposed seam/regulatory-diagnostic-probe and intended version
regulatory-diagnostic-probe/0.1-candidate, conditional on whole-shape acceptance. The sole probe
203 TransformationVersion and registry-entry seam version use that same exact accepted identifier;
no draft version is admitted to a production profile. Permitted 121–124
SEM suboperations retain their accepted semantics; the outer envelope identifies the probe-owned
conditional adapter, not an allegedly amended SEM producer. Real EVID events retain their exact
registered seam/version. The future generated-X admission must authenticate that the adapter
actually completed accepted SEM-001H consequence freeze; a probe version string is not sufficient.

| Stage | SubjectIds | SourceRecordIds | InputProjection | OutputProjection |
|---|---|---|---|---|
| 110 | C | empty | exact opportunity | truth if available, otherwise list([]) |
| 120 permitted | O,C unique sorted | truth occurrence | Observing carrier | sole 203 |
| 121–123 permitted | O | supporting ObservationId | Supporting carrier | list([]) |
| 124 permitted | O | supporting ObservationId | Supporting carrier | exact 227 |
| real 130 E/L | existing EVID mapping | existing EVID mapping | exact X/E | exact E/L |
| suppressed/padding | empty | empty | Suppressed carrier | list([]) |

RegisteredReadDomain at 110 is the singleton compiled path; ActualReadRecords contains its one
read if available. All other stages have empty reads. Patch/diffs, random draws, quantization
operations and invariant-result lists are empty throughout. REG reference derivation is replayable
from model definition, event time and the exact recorded D read; no extra R0/D provenance record
is created. Unpermitted truth can appear in the omniscient 110 output, never observer provenance.
Canonical model/run commitments necessarily differ across intervention manifests; compare
permitted structural records rather than treating trace-envelope identity differences as evidence.

### New model/profile commitment and preservation boundary

Propose a separate fixed diagnostic RulesVersion bundle, name/version not permanently selected
yet. Its six-slot registry layout can reuse the accepted packaging structure, while its closed
kind/version dispatcher adds these probe records, channel roles, concrete read declaration and
adapter binding. It retains the same qualified character, REG and five adaptation-state families,
plus the original fixed-pulse bridge as a control. Parameter shape and exact numeric profile stay
unchanged. A distinct channel/modality/unit is admitted only for the probe; the old bridge still
requires unit/fixture-pulse. EVID declarations and algorithms remain byte-identical where their
existing fields do not encode the new outer profile; no wider evidence or state read is added.

Before activation the new RulesVersion must bind exact registry/input/trace/observation-producer/
restore versions. New schemas and identity/member inventory require symbolic review and a separate
numeric gate. Restore revalidates roles, effective values, unique occurrences, producer equality,
pending original opportunities and model/run commitments; it does not serialize temporary tickets
or capabilities. Boundary-only saves have no pending intra-instant padding/stage events. The old
bounded .2 six component artifacts, accepted allocation tables and trace mapping are unchanged.

Additional vector detail: PROBE-E checks all four permission/availability branches plus a later
common visible sentinel and equal allocator checkpoints. PROBE-J rejects inconsistent carrier
tags/definition equality and forged SEM freeze claims. PROBE-K includes failures while consuming
discarded ordinals, source/child trace validation and restore under the wrong profile. PROBE-M
includes a mutant that leaves X unchanged but dereferences the scalar only inside EVID: any such
read fails even if E/L output bytes happen to remain equal.

## Historical dispositions and deliberate deferrals

SUB-001: retain exact arithmetic oracle; SUB-008: port structural trace, full rollback and first
divergence discipline; SUB-009: paired single-intervention corpus; SUB-011: retain the disproved
automatic scalar-propagation inference and correction. SUB-012 stays a future response candidate/
control and is not invoked. RET-003..005 censored-measurement controls remain preserved under
observation; this exact sensor does not replace them. RET-006 and RET-014 remain prohibited truth
leakage controls. P3-001/P3-006/P3-009 remain separation/epistemic corpus obligations. CTL-001,
CTL-007/008/010 remain future embodied/value/addiction/reward comparisons, not probe mechanisms.
The retained decision/dice/identity corpus remains mandatory later; this seam cannot retire it.

Deliberately deferred: scalar carriage into cognition under its accepted reopen trigger; acceptance
of the proposed symbolic schema/role/producer manifest, dedicated diagnostic channel and fixed-budget
allocation consumption policy; numeric allocation; new RulesVersion/ModelIdentity and six-slot
packaging; canonical trace binding and persistence closure; runtime implementation and executed
vectors; noisy/multiple sensors, dynamic permission policies and failure visibility; wider unit
vocabulary; physiology/performance laws; appraisal/reward/belief/memory/value/identity changes;
ORD-001/ORD-005; global FCT/VAL/PHEN and Campaign-2 verdicts.

The next review is the proposed probe shape, especially the dedicated diagnostic channel and
fixed-budget hidden-work policy. Scope is resolved; shape and implementation gates remain open.

## Revision-3 review closure and later allocation inventory

The revision-2 PROBE-A wording conflated truth n with observed q; this is corrected in the vector
without changing either representation: truth is always canonical signed n, observation always
canonical reduced rational n/Scale. The missing scheduled-event vocabulary is now the exact table
above. Raw-ordinal padding is now a closed void operation with fixed legal slots, ownership,
rollback/persistence semantics and no observable return. PROBE-N/O remain FROZEN OBLIGATIONS,
NOT PASSED; their addition is not runtime evidence.

After whole-shape acceptance only, the separate allocation review must cover the five proposed
record layouts (definition, channel, opportunity, truth and carrier union), RegulatoryProbeTruthId,
the eight new EventTypeId members above, RegistryDefinitionId definition/regulatory-diagnostic-probe,
RegistryKindId registry/regulatory-diagnostic-probe, SeamId seam/regulatory-diagnostic-probe and
ObservationUnitId unit/diagnostic-regulatory-level. The profile's proposed modality singleton and
unique channel must appear in its committed model vocabulary under their existing family rules;
no new modality/channel family is proposed. Existing EVID members are reuse entries, not allocations.
No numeric reservation, namespace assignment, registry mutation or implementation is made here.
