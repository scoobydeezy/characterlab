# M5 memory composition — revision 2

2026-09-07. **COMPOSITION PROPOSAL; NOT SHAPE ACCEPTED.**
M1–M4 component semantics are accepted. This document does not reopen them. Whole memory seam,
combined allocation and implementation remain gated. See [parent](CAMPAIGN2_MEASUREMENT_MEMORY_DRAFT.md),
[M3](CAMPAIGN2_MEASUREMENT_MEMORY_M3_DRAFT.md), [M4a](CAMPAIGN2_MEASUREMENT_MEMORY_M4A_DRAFT.md) and
[M4b](CAMPAIGN2_MEASUREMENT_MEMORY_M4B_DRAFT.md). MEMR-A..P remain FROZEN/NOT PASSED.

## Actual composition findings

- factory.ts restore accepts model source plus orderedInputs/save. It restores RunIdentity, validates
  canonical save and archives, and reconstructs original InputOnly authority. It allows only original
  event types in the pending queue. Neither future generated-event admission nor original initial
  state bytes are available through that restore interface.
- identity.ts commits InitialStateDigest and ordered-input digest and embeds the run seed in
  RunIdentity. A digest is not recoverable original state. orderedInputs.ts creation receives the
  initial bytes; its restored input authority does not recover them.
- transitionIngressV04.ts authenticates generated event fields using live private bookkeeping.
  This authority ends with the instant. Restoring canonical event bytes alone cannot revive it.
- adaptationRuntime.ts phase140 settlement prepares all phase140 work through the ADAPT evaluator;
  it is not a generic stage that can execute a memory writer. Old stage policy must remain exact.
- At phase120 the runtime allocates tracking then intake. The freeze at124 allocates EVID evaluation
  before intake executes at130. Under the proposed intake emission order M1 then future cue, the
  bounded positive phase130 execution is intake, EVID evaluation, M1, EVID learning evidence:
  evaluation already has an earlier sequence than M1; its learning child is allocated after M1.
  M1 creates formation at140. This is source-derived order, not an executed successor witness.
- trace.ts type160 SourceRecordIds is a canonical unique list of TypedIdentifierValue. The exact
  M1 occurrence can be represented directly once its role/namespace is allocated; no source wrapper
  or receipt is needed. Cue has no occurrence identity: its1124 operand must not masquerade as one.

Historical preservation follows the parent REFERENCE_MECHANISM_LEDGER dispositions: exact identity,
trace/replay and paired experiments (SUB-003/008/009), forward correction (SUB-011), historical
content (MEC-022/RET-013). No historical memory retrieval or reinforcement mechanism is imported.

## Composed recall — proposed output and registration

Proposed exact transient record, every field required:

```text
MeasurementRecollection
    MeasurementRecollectionId   new shared-allocated output occurrence; numeric namespace deferred
    Episode                     exact detached MeasurementEpisode returned by accepted M4b
    TransformationVersion       exact eventual accepted recall version
```

The new ID denotes a recollection production occurrence, not a cue or episode identity. The embedded
episode retains the existing historical chain without copying scalar/time/unit/observer facts. Its
meaning is historical recall, not a claim about current world state. No CharacterId copy is needed;
trace subjects use the actual projected C. A recollection carries no lookup capability.

One recall-result ordinal slot is consumed in every matched branch. Present recall uses normal
shared occurrence allocation: a real MeasurementRecollectionId and exactly one record. Semantic
operands are the detached present episode and that real ID. Absent episode and read-ablation
consume one private void runtime-ordinal advance, with no typed identity and no fake ID handed
to semantic code. Absence emits nothing; read-ablation performs no episode read.
Proposed bounded RecallRegistration has executing seam/version, exact cue schema, reference to
the one committed M4a opportunity definition, exact ReadDomain and projection requirements,
NoStateWrites, and one presence-conditioned output definition. Its version fixes the only output
rule: exactly one MeasurementRecollection iff the accepted episode read is present, zero otherwise.
No arbitrary predicate expression or generic optional-output language is admitted. Cue admission
is authenticated scheduler-event admission from M4a; no CueId/OccurrenceIdentityRule on the cue and
no V04 ExactImmediateProducerOutput or SameAsProducer fiction. Shared occurrence rules apply only
to the actual recollection output. Exact canonical registration/schema layouts still require review.

Normal recall uses M4b's exact two reads and no writes/children. Recall-access ablation requires a
separately committed bounded control registration for the same admitted cue event: no episode
requirement/read, no recalled output, same private void result-slot advance. No “read then hide” control. Formation
ablation likewise needs a committed NoStateWrites control replacing the writer while preserving
the generated formation event's allocation and the same M2 IDN projection. Only the write is ablated. Read-ablation retains ordinary IDN resolution while removing episode access. Neither control changes M3/M4b semantics.

## Proposed stage and topology policy

Intake infrastructure binds its two new positive branches in order: shared V04 M1 child, then M4a
future cue. Formation still emits no child. Old carriage packets retain zero intake children.
Inspection of orderedInputs.ts confirms exactly one original source on a probe instant, with no
authored-adaptation source there. The only accepted automatic input producer is authored source110;
probe/carriage/EVID/M1 produce no automatic input. No mixed batch is needed.

Validate the complete phase140 quiescent batch before any member executes. Admit only A: unchanged
accepted ADAPT settlement batch; B: exactly one formation or committed write-ablation control;
C: no work. Suppressed-source topology additionally uses one separately authenticated private
formation-padding event as a bounded control case of B, with no M1 payload, projection or write.
It is not semantic formation. Mixed ADAPT/memory/padding, multiple memory-slot events or unknown
events reject before execution. A preserves the accepted ADAPT evaluator/snapshot algorithm; B
uses only its selected writer/control. No cross-category intermediate visibility is defined.
Old stage policies and ORD-001 remain unchanged. The precise padding/control budget is below.
## Historical authority after restore — alternatives

| Construction | What it establishes | Outstanding cost or limitation |
|---|---|---|
| Local pending-event certificate referencing source337, parent, projected C and patch | Small direct consistency checks against saved records | An internally consistent fabricated certificate, source, episode and queue can agree. Without an independently trusted root it proves consistency, not execution history; reusing trace alone as that root is prohibited. |
| Signed/MAC checkpoint from trusted execution | Authentic origin if the signing authority and anti-substitution rules are trusted | No accepted key management, signing authority or trust policy exists. This introduces external trust and a new persistence/security seam. Not selected. |
| Independent deterministic admitted prefix execution from original S0/model/inputs/seed, followed by exact comparison | Re-derives live generation and formation through existing admitted execution, without trusting a saved certificate | Requires original initial bytes, precise stop boundary, declared comparison and resource bounds. Work scales with prefix length. It is not today's restore API. |

Recommendation for review: use independent prefix validation for the first bounded research model,
provided the exact obligations below are accepted. It offers a stronger, explicit validation root
than unauthenticated certificates without new cryptographic trust. This is a proposal, not selection
by M4a acceptance. A smaller certificate construction remains possible only if it identifies an
accepted independent authenticity root or explicitly earns a weaker integrity claim; hashes alone
do not provide that root.

### Proposed prefix-validation contract

The new memory restore facade would require original initialState bytes in addition to model source,
orderedInputs and save. It checks canonical S0 and its digest against saved RunIdentity, recompiles
the same ModelIdentity and ordered input commitment and uses that RunIdentity's exact seed. No
caller-provided handler, replacement roster, replay callback or alternate parameter set is admitted.
Old restore APIs/profiles are unchanged. Seed has no new random meaning in this bounded slice.

Run an isolated validation execution using the same governed compiler/runtime contracts from S0.
Its reads use ordinary admitted M2/IDN/M4b paths; there is no restore-only roster resolver. This
execution is a check, not a second authoritative history whose bytes overwrite the save. Require
an exact match to the complete candidate save: model/run, clock, state, queue including every cue
field, allocators, output sequence, trace sequence and all admitted metadata. Never compare only
hashes or only memory. A mismatching coherent fabricated history still rejects.

Let N be the number of canonical scheduled-event trace160 records in the candidate's committed
trace list. The successor admits exactly one such record per executed scheduled event, including
private padding/control events, and no auxiliary entries in that list. Validate this grammar.
N selects a proposed boundary, not a trusted claim of execution.

For N=0 accept only exact equality to the canonical post-input-compilation initial save, before
any event execution. This special boundary may have due work at initial clock0. For N>0 execute
whole instants in isolated validation, counting their actually committed event traces. If an instant
takes the count above N, reject (candidate requests a partial instant). If execution exhausts or
fails before N, reject. At exactly N require an ordinary Active boundary-save state: no open
transaction and no pending work due at or before the committed clock. Never stop midway through
an instant or use candidate clock alone. Then require replayed canonical save bytes equal candidate
bytes in full. Initial candidates cannot evade this by supplying a forged trace count.

After equality, derive detached internal ValidatedPendingRecallAssociation facts only from the
validation runtime's actual live M4a generation bindings that remain pending. Each fact contains
the complete expected scheduler event, actual source337 identity, and committed opportunity
definition/producer relation identity. Facts are private, not canonical records, certificates or
save fields, and are constructible only behind the successful validation boundary. They are not
the replay runtime's capability objects, handlers or closures.

Cross-check an exact bijection between these facts and saved pending recall events, including all
event fields. Restore the candidate bytes unchanged. A trusted constructor uses detached facts
to create fresh runtime-private pending admission entries; invocation capabilities are freshly
minted only when those exact events execute, with single-use liveness. Already consumed events
have no transferable fact. Original pending inputs use unchanged ordered-input reconstruction;
private future padding uses its separate validated generation facts, never recall authority.
No unknown pending event kind is accepted. No cue is regenerated/reallocated from memory, trace,
archive, parent alone or payload alone. M4a association derives from actual validation execution.
Validation resource limits must be explicit and model-independent operational constraints: inability
to finish validation returns no runnable handle, never a weaker unchecked restore. The bounded first
corpus can exercise prefix validation; general large-history checkpoint optimization is deferred.
Exact facade/schema/source retention and stopping rules need acceptance before implementation.

## Trace and persistence mapping obligations

Formation: type160 source is the exact admitted M1 typed occurrence, subject actual C, one IDN read,
exact insertion patch/diff, empty output/children. Intake successor trace must close actual M1/cue
children and delayed parent/time relation. M1 trace source is the actual337 typed occurrence.

Recall: input projection is the content-free cue; no cue semantic occurrence source ID exists.
SourceRecordIds=[cue.CognitiveMeasurementEvidenceId], denoting the historical causal source337, not the cue invocation. Existing event/parent identity and input fields carry the invocation. Successful output is the exact recollection; absent output is empty.
Recorded subject C and IDN read plus cue E must force the episode ActualReadRecord path to
Episodes[MeasurementEpisodeKey(C,E)]. Episode read has DerivedSources=[] and TransformationId absent.
Correct accessor/value at a different valid path rejects. No second roster lookup is allowed.

Current factory's pending InputOnly validation must become a successor-only partition: originals
validated through the unchanged input compiler; generated recalls validated through the accepted
new historical authority construction. Save132 need not change merely to store already representable
events, but new schemas, profile/RulesVersion, metadata policy and runtime bookkeeping rehydration
must be declared exactly. Whether extra wire data is needed depends on the final restore construction;
no generic continuing-input field is repurposed as a cue certificate.

## Review decisions and remaining closure

This first M5 pass requests design review of the bounded recall record/conditional-output rule,
separate event-authenticated registration, stage policy and proposed prefix-validation direction.
It does not present a finished profile. Revision2 below supplies the proposed prefix/source/rehydration and scheduling/control closure. Remaining concrete blockers include exact registration and
trace layouts, concrete RecallDelay value, whole symbolic inventory and model/compiler coverage.
Only after those close should combined numeric allocation be proposed.

Required adversarial cases remain under MEMR-A..P: coherent forged episode+cue+trace, changed S0 or
model/run/seed, wrong checkpoint boundary, forged projected owner, correct-value/wrong-path read,
dropped/duplicated/restored-consumed cue, same-character mixed observer/E, same-authority insertion,
overflow and late rollback, formation/read ablations with matched opportunities and later sentinel.
These are obligations, not executed proof. ADAPT-9b, parent control9, PHEN-ADAPT and Campaign2 OPEN.

## Revision2 exact topology and controls

The table uses generated allocation positions g1..g11 relative to the next scheduler allocations
at this probe source. EventId and EventSequence each advance once per row in allocation order;
the original source was already allocated by ordered-input compilation. Positions are relative
labels, not permanent numeric IDs. No other original source shares T1.

| Allocation | Generated event | Parent | Due/phase | Runtime ordinal slot when executed |
|---|---|---|---|---|
| g1 | diagnostic observation | original probe source | T1/120 | r1 observation + r2 experience reservation, or two void advances |
| g2 | tracking | g1 | T1/121 | none |
| g3 | intake or carriage padding | g1 | T1/130 | r3 real337 or void |
| g4 | bindings | g2 | T1/122 | none |
| g5 | classification | g4 | T1/123 | none |
| g6 | freeze | g5 | T1/124 | none; permitted227 uses r2 already reserved |
| g7 | EVID evaluation or existing probe evaluation padding | g6 | T1/130 | r4 real269 or void |
| g8 | M1 or new private M1 padding | g3 | T1/130 | r5 real M1 or void |
| g9 | recall cue or new private future padding | g3 | T2/20 | r7 real recollection or void at T2 |
| g10 | EVID learning or existing probe learning padding | g7 | T1/130 | r6 real270 or void |
| g11 | formation/control or new private formation padding | g8 | T1/140 | none |

Original source at T1/110 consumes r0: real diagnostic truth334 if available, otherwise void.
T1 execution order is source,g1,g2,g4,g5,g6,g3,g7,g8,g10,g11. This derives from phase then sequence,
not allocation order. g8 is allocated before g10 but after g7; g9 is pending at the later instant.
Each source thus causes 11 generated events, 10 executed T1 descendants plus one future event:
11 executions including source at T1, one at T2. Runtime advances: 7 at T1, one at T2, 8 total.
No new M1/recollection typed identity exists for any void slot. M1 identity allocation is real only
with actual337. Existing experience reservation remains governed by its accepted SEM contract.

Suppression uses new symbolic private event kinds for M1 padding, formation padding and future
padding, with exact empty-list payload/dependencies and their actual generating parent. It does
not generate MeasurementRecallCue or fake M1/formation input. g3 padding emits g8 then g9;
g8 padding emits g11. g9 private padding uses the same checked positive delay, does no IDN/memory
read, consumes r7 as void and emits nothing. g11 has no reads/writes/output/children. This is new
profile-owned control vocabulary requiring allocation/trace/authority closure, not an extension
to the accepted semantic cue. All branches check delay overflow, so suppression cannot silently
skip otherwise matched failure. Each private generated association also requires replay validation
on restore; it cannot acquire recall admission by sharing a time or ordinal.

Counts above are per probe contribution. If a prior delayed event coincides with a later original
source, phase20 executes before source110 and consumes its own result slot; add contributions
rather than asserting an isolated-instant total. At most one original probe per instant is already
enforced. Recall/private future work generates no phase140 work, so it cannot introduce ADAPT/
formation overlap. Multiple future events, if permitted by the original manifest and fixed delay,
retain global EventSequence ordering. Actual runtime proof must cover coincident future/source work.

Proposed finite model inventory: availability a, permission p, formation F and recall access R each
have two committed choices: 16 configurations. All profiles/registrations are compiler-selected
from committed model data, never mutable runtime flags. Existing a/p semantics determine actual
evidence (unavailable also implies no permitted output); all four F/R combinations remain distinct
control declarations even if suppression makes their observable results equal.

| Evidence branch | F | R | g8/g11 | g9 result |
|---|---|---|---|---|
| actual337 | enabled | enabled | real M1 / accepted formation, same M2 read | IDN + episode read, real recollection if present |
| actual337 | disabled | enabled | real M1 / NoStateWrites control, same M2 read | IDN + absent episode read, void result |
| actual337 | enabled | disabled | real M1 / accepted formation | IDN only, no episode capability, void result |
| actual337 | disabled | disabled | real M1 / NoStateWrites control, same M2 read | IDN only, void result |
| suppressed (any a/p/F/R combination) | either | either | private M1 / formation padding | private future padding, no IDN/read/output |

A valid bound observer is required for matched positive/control witnesses. Missing binding fails
normal and corresponding IDN-preserving ablations; it is not silently converted to absent memory.
Control registration differences are explicit inventory, not changes to accepted M3/M4b.

The later common sentinel is an identical admitted original source at T3 after the compared T2
work, with matched original schedules/seeds. Compare exact IDs, queue topology and void/real ordinal
positions across a/p/F/R controls. Runtime proof must verify the derived counts, not treat this
design table as a pass. Source outputs/content and episode/recollection differences retain their
intended branch semantics; no semantic absence signal is emitted by private padding.

## Revision2 restore and trace disposition

Proposed facade is exactly restoreMemoryRun(modelSource, {initialState, orderedInputs, save}).
Decode/validate original S0 canonically, recompute InitialStateDigest, ModelIdentity, ordered-input
commitment and full RunIdentity using the seed in the candidate RunIdentity, and require exact
identity agreement before prefix execution. No seed/roster/profile/handler override is accepted.
The candidate may select a genuine historical prefix; this is validity checking, not anti-rollback
security. No earlier checkpoint freshness claim is introduced.

TRACE_AND_PROVENANCE.md describes source records and transformation provenance and imposes no
immediate-semantic-input-only restriction; trace.ts stores typed source identities. Therefore recall
SourceRecordIds is exactly [cue.CognitiveMeasurementEvidenceId] as historical M4a causal ancestry,
including absent and read-ablated recall. Require equality with actual authenticated source337.
This does not identify the cue and grants no337 lookup capability. Private future padding has no
source337 and SourceRecordIds=[] under its distinct trace kind. Formation source is exact M1.
Correct accessor/value with a wrong (C,E) read path fails the committed M4b trace relation.

The prefix stop/count, complete byte comparison and detached private association procedure above
are proposed for acceptance, not exercised. One-record-per-event trace cardinality includes ADAPT
batch members separately and every private event. No replay event is partially committed to reach N.
Old restore interfaces/packets remain unchanged; no Save132 layout change or serialized capability
is proposed.

Revision history: rev1's unused typed result reservation, mixed ADAPT-then-memory visibility and
empty recall source list were rejected. Rev2 replaces them with real-or-void allocation, exclusive
legal stage cases and source337 provenance, and specifies S0/prefix/rehydration and derived control
tables. Whole M5 acceptance remains withheld. Exact canonical registration layouts, full symbolic
record/member inventory and concrete production delay still need closure before allocation.

## Revision2 acceptance / revision3 symbolic closure — 2026-09-07

User accepts recollection semantics, real/void slots, exclusive phase140 dispatcher, source337
trace, prefix-validation architecture and S0 facade, N/quiescence stop, whole-save comparison and
pending-association rehydration. Event/ordinal tables and16 controls are accepted in shape.
Earlier proposal/unselected wording is superseded for those components by this scoped verdict.
Whole M5 remains unaccepted pending exact symbolic registration/profile/trace inventory.

[Revision3 symbolic closure](CAMPAIGN2_MEASUREMENT_MEMORY_SYMBOLIC_CLOSURE.md) supplies proposed
record shapes, registry homes, same-kind model-specific control definitions, profile ownership
and event trace mappings. Private association name is ValidatedPendingGeneratedAssociation with
closed RecallCue/PrivateFuturePadding kinds; it is not canonical/save vocabulary.
Concrete RecallDelay is packaging data, NOT a symbolic-allocation blocker. No allocation or
implementation is authorized. MEMR-A..P NOT PASSED; ADAPT-9b and Campaign2 OPEN.

Symbolic-closure review update — 2026-09-08: revision4 corrects PRJ collection ownership,
retains the state-family DefinitionVersion, fixes private trace SeamVersion, and states exact
IDN slot additions. Prior proposed projection registry rows/version homes are rejected history.
Whole shape and combined allocation remain awaiting acceptance.
