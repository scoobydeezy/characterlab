# M4a — delayed live-measurement recall opportunity, revision 1

2026-09-07. **SHAPE ACCEPTED; NO ALLOCATION OR IMPLEMENTATION.**
Accepted label `measurement-recall-opportunity/0.1-candidate`. Uses accepted
[M4b](CAMPAIGN2_MEASUREMENT_MEMORY_M4B_DRAFT.md) and unchanged M1/M3 from the
[parent](CAMPAIGN2_MEASUREMENT_MEMORY_DRAFT.md). M4b has closed the M3 key condition.

## Substrate findings

time.ts provides SimInstant in [0,Int64.MaxValue], signed-Int64 SimDuration and checkedAddDuration,
failing INSTANT_OVERFLOW rather than wrapping. Reuse exact integer time; no wall clock, floating
delay, RNG, physiological scale or microtick. EVENT_ORDERING already allows later-instant children;
phase20 is the permitted retained-state projection lane. Scheduler allocates EventId/EventSequence
and stores payload, dependencies and causal parent as canonical pending work.

V04 ingress276 has only SameAsProducer and ExactAdmittedSourceOutput. A later identity-only
projection of337 satisfies neither; it must earn a separate bounded generative relation. Do not
add alternatives to276's frozen union. Current shared ingress authenticates exact allocated children
using a live invocation's private generated relation; it is not a cross-instant restored capability.
factory.ts explicitly assumes quiescent pending queues contain original InputOnly work. M4a cannot
reuse that restore assumption for a generated cue.

Historical controls/dispositions remain the parent ledger intake: SUB-001/003/008/009 exact time,
identity, replay and paired scheduling; MEC-009/010/EXP-006 memory search/decay remain deferred.
Delay is fixture scheduling, not accessibility or a memory-decay parameter.

## Proposed exact definition and cue

All listed fields required, all names symbolic until allocation:

```text
MeasurementRecallOpportunityDefinition
    ProducingTransitionKind    MeasurementEvidenceIntakeTransition
    RecallEventTypeId          symbolic event/measurement-exact-recall
    RecallDelay                canonical signed integer, positive SimDuration

MeasurementRecallCue
    ObserverId                       existing1000, no validator
    CognitiveMeasurementEvidenceId    existing1124, no validator
```

The version fixes source schema337/1, source producer resolution through its committed V07 row,
the two field extractions and destination phase20. No duplicated source-seam/version declaration,
field-path language, policy callback, clock source or caller-selected phase exists. Definition data
is model-owned, committed through the existing semantic registry/model identity. Its exact entry
kind/member and concrete delay value belong to the later composed inventory; no implicit default.

Delay must satisfy 1 <= RecallDelay <= Int64.MaxValue. Validate canonical signed representation
and this positive domain at model construction; zero/negative/noninteger/out-of-range reject.
At live production let T1 be the actual intake event DueAt, not embedded observation time. Compute
T2=checkedAddDuration(T1,RecallDelay); overflow fails the producing instant atomically. Never clip,
wrap, omit recall or shorten the delay. The existing INSTANT_OVERFLOW diagnostic must remain
identifiable through the eventual scheduler failure mapping; exact enclosing trace code is M5 work.

The cue is not a new evidence occurrence. It is payload of one scheduler occurrence whose existing
EventId/EventSequence provide invocation identity. Its E is the existing337 identity, never another
allocation. No CueId/MemoryEpisodeId or output-occurrence rule is minted merely to pass a generic
payload-ID assumption. This new delayed-event admission contract authenticates the actual scheduler
event; it must explicitly support this payload with no separate occurrence field. If composed
registration cannot express that, surface the gap rather than misusing E as the cue's own identity.

## Actual live generation and authority

After shared completion validates the actual337 output of the committed intake, the fixed
generative boundary forms cue=(output.Observation.ObserverId, output.Id) from that same complete
canonical value. No input manifest, trace, archive or state lookup may select either operand.
No CharacterId resolution occurs at T1 for this branch. Unknown/absent formation binding does not
authorize another owner; whole-instant failure still rolls back all work.

For every actual337, schedule exactly one cue at (T2,phase20), independently of the M1/formation
branch. Suppressed observation produces no337 and no cue. Formation ablation retains the cue;
recall-access ablation retains the cue while removing episode access. Definition multiplicity is
one per actual producer output per admitted recall definition, with exactly one definition in the
first profile. Duplicate definitions/source IDs or missing/extra/mutated generated children reject.

The scheduler, not the semantic consumer, allocates EventId and EventSequence. The causal parent is
exactly the actual intake event. Proposed dependencies are the existing canonical empty list; source
association is supplied by the governed generation relation, not a payload dependency resolver.
No additional parent or synthetic receipt. These choices require exact scheduler/trace conformance
under M5 and do not preserve carriage's historical six/eight budget in the successor by assertion.

This is an additional profile-owned delayed branch at intake completion, not an emitted child of
M1 or formation. Its authority must coexist with shared V04 discovery of the M1 child. M5 freezes
the actual branch allocation order and later sentinel coupling; an already allocated phase130 EVID
event retains its earlier EventSequence. M1/formation semantics do not gain scheduling callbacks.

## T2 admission before M4b

The delayed-event admission boundary must match the actual allocated cue event exactly: EventId,
EventSequence, DueAt, phase, event type, both payload identities, dependencies and sole parent, plus
the governed source relation. Admission is single-use for that executing occurrence. Wrong event,
mixed observer/E, unassociated initial input, duplicate invocation or expired capability fails
before extraction and before either IDN or episode read. A valid namespace1124 ID alone is never
proof of association, including two ObserverIds bound to the same character.

Once admitted, invoke accepted M4b: T2 ordinary IDN resolution, full exact M3 key authorization,
then one optional episode read. No recall registration is silently encoded as V04 input admission
with a false ExactImmediateProducerOutput claim: the cue differs from337 and is delayed. The new
bounded recall admission must compose with NoStateWrites and the accepted M4b requirements.
Exact registration records and the transient recollection output/cardinality remain composed-recall
closure work; their absence prevents whole-seam acceptance. No change to M1's accepted V04 grammar.

## Pending generated-event persistence requirements

A save at quiescence after T1 and before T2 must retain the actual pending cue, including all event
fields above, allocator continuation and its producer association. Do not discard or recreate its
EventId/sequence/time/payload on restore. Consumed cues must not reappear after T2. A save from the
formation-ablated control retains the same cue despite lacking an episode. Restore rehydrates new
runtime admission bookkeeping only after validating the stored event's authority; it does not
serialize closures, trust a caller token, or revive an expired invocation capability.

Original-input reconstruction alone cannot establish this association. Neither stored memory,
a trace certificate, a337 archive entry nor self-consistent event fields alone proves historical
generation. M5 must specify the authoritative validation construction and its exact persisted or
replay inputs before runtime admission is implemented. One candidate for M5 inspection is independent
deterministic execution of the admitted run prefix using the original initial state/model/inputs,
then exact comparison with the saved pending queue and history. That would validate, not replace,
the saved cue and must use ordinary admitted IDN execution rather than a new roster resolver.
It is not selected here: current restore inputs may not supply original initial state, and its
availability, model/run binding, stopping boundary and cost require explicit closure. No original
manifest-only or trace-only reconstruction is claimed sufficient.

Thus M4a fixes what authority must survive, while M5 still owns how restoration proves it. Until
that construction is accepted, pending generated-event restore remains an expressibility blocker;
ordinary scheduler serialization is not a completed authority proof.

## Adversarial cases under existing MEMR obligations

- Positive delay1 at T1=0 gives T2=1; delay1 at Int64.MaxValue-1 gives the maximum valid instant;
  delay1 at the maximum overflows with complete T1 rollback. Zero/negative/too-large delays reject.
  These are proposed boundary fixtures, not the selected production delay or numeric allocations.
- Exact same actual337 produces identical cue identities/content/time under formation enabled and
  disabled controls; no successful formation may be the cue-generation condition.
- Equal O/E with different admitted measurement content produces the same content-free cue. Mixed
  O/E from distinct live outputs rejects before M4b, even with the same projected character.
- Mutate any saved/event identity, time, phase, dependency, parent or payload; duplicate, drop or
  preauthor the cue: admission/history validation rejects, without memory/roster reads.
- Save before T2, restore, execute recall: exact continuation and one consumption. Save after recall:
  no resurrection. Absent episode does not suppress the cue or invent negative remembered content.
- Failure after generation allocation, queue insertion, later admission, read, output or trace restores
  the complete respective instant. Later D/current observation/permission changes do not recompute
  cue or episode; carriage-time permission already governed whether the source existed.

MEMR-A..P remain unchanged and NOT PASSED. M4a is a first draft; the composed recall-output grammar,
registration, cross-instant authority restoration and M5 stage/topology/trace inventory remain open.
No combined allocation is authorized. ADAPT-9b and Campaign2 remain OPEN.

## Acceptance disposition — 2026-09-07

User SHAPE ACCEPTS M4a definition/cue, no semantic cue ID, scheduler invocation identity,
live same337 derivation, formation-independent generation, checked positive delay and T2 phase20.
Parent=[actual intake EventId], dependencies=[] and exactly one future cue are frozen for this
profile. Earlier proposal language is historical for these components. No producer semantic
operand gains delay, destination or scheduler authority. Composed recall registration/output
and pending-generated-event restoration remain M5. Prefix replay was not selected by acceptance.
[M5 revision1](CAMPAIGN2_MEASUREMENT_MEMORY_M5_DRAFT.md) now compares restore constructions.
Allocation remains deferred; MEMR-A..P NOT PASSED and ADAPT-9b OPEN.
