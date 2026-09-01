# Event Ordering and Quiescence

**Status:** accepted Campaign 0 contract, version identifier `ordering/0.2-candidate` (accepted 2026-09-01)

Events are ordered lexicographically by:

```text
(DueAt, Phase, EventSequence)
```

`DueAt` is canonical `SimInstant`. `Phase` is a registered integer. `EventSequence` is a run-global monotonic scheduler tiebreaker assigned at authoritative scheduling time, never collection iteration order. Its allocator state is authoritative, persisted, and restored without minting replacement values.

## Candidate phase registry

| Phase | Boundary |
|---:|---|
| 0 | time/development and embodied materialization |
| 10 | observation and interoception |
| 20 | encoding, retrieval, recognition |
| 30 | belief and person-model evidence application |
| 40 | workspace and control allocation |
| 50 | appraisal and current affect from evidence valid at this boundary |
| 51 | queue named regulatory impulses produced by phase-50 appraisal |
| 52 | apply same-instant regulatory impulses in canonical order without cognitive re-entry |
| 60 | goal and motive activation |
| 70 | candidate option construction |
| 80 | reasons and option appraisal |
| 90 | arbitration and addressed roll if unresolved |
| 100 | intent, decision expression, frozen pre-attempt snapshot, plan |
| 110 | attempt, execution, and world outcome |
| 120 | observation and encoding of consequences |
| 130 | outcome evaluation and learning-evidence production |
| 140 | consolidation, adaptation, and persistent-state mutation |
| 150 | trace commit and quiescence check |

These values are a scaffold, not proof that each row should remain one phase. A seam specification may subdivide a phase only by updating the registry version and proving there is no cycle or epistemic leak.

## Same-instant rules

1. An executing event may schedule the same or a later phase at the same `DueAt`; new work receives a strictly later `EventSequence` than its cause.
2. Scheduling an earlier phase at the same instant is a typed causal-order failure.
3. The scheduler drains the instant to quiescence before advancing time.
4. A configured cascade ceiling produces a typed failure with the complete causal chain; it never silently drops work.
5. Feedback that logically belongs to a later cycle is scheduled at a later `DueAt`, not smuggled backward through phases.
6. The world outcome enters the authoritative trace at phase 110, but character learning receives only phase-120 observed/encoded consequences.
7. Phase-52 regulatory changes may affect authoritative body/regulatory state immediately, but their newly derived interoceptive evidence is scheduled at a later `DueAt` or other explicitly defined later observation boundary. It cannot re-enter phase 50 of the current instant.

## Atomic simulation-instant transaction

The authoritative transaction boundary is one complete simulation instant:

```text
pre-T quiescent state
→ materialize analytical state through T
→ settle every scheduled event and reaction at T
→ validate read domains, mutation authority, invariants, and staged trace
→ atomically commit post-T quiescent state
```

Transitions do not mutate committed state directly. They receive capability-limited read projections and return staged results as defined by `state/0.2-candidate`. Same-instant events read the accumulated staged state produced by earlier `(Phase, EventSequence)` work, while the pre-T committed snapshot remains available for rollback proof.

If any transition, scheduler guard, patch precondition, authority check, invariant, encoding, or cascade limit fails while settling `T`:

1. discard every staged mutation from `T`;
2. discard every staged emitted event from `T`;
3. discard every would-be committed trace record from `T`;
4. restore the pre-T quiescent authoritative state and scheduler/allocator state structurally exactly;
5. emit a non-authoritative `FailureDiagnostic` governed by the trace contract;
6. mark the run `Failed`; and
7. stop authoritative execution with no retry, deletion-and-continuation, or partial commit.

`Failed` is harness/run status, not character state or knowledge. The pre-T snapshot is the last valid authoritative state, but no successful post-T state exists.

## Quiescence and cascade bound

An instant is quiescent only when no scheduled event or reaction remains at that `DueAt` and every staged patch/event/trace validation has succeeded. External reads, commands, comparisons, and saves observe only quiescent committed state.

`MaxSettlementWorkPerSimulationInstant` is a versioned model parameter. Exceeding it is a typed failure that includes the complete available causal chain; remaining work is never deferred to another instant. Changing the limit changes `ParameterSetDigest`.

## Save/load boundary

Saves occur only at quiescent committed boundaries. Mid-transition saves are invalid. The canonical save payload includes:

- `ModelIdentity` and artifact `SaveSchemaVersion`;
- clock and complete authoritative state;
- runtime ID, event ID, and `EventSequence` allocator states;
- complete pending scheduler queue in canonical execution order;
- every event's ID, `DueAt`, phase, sequence, type ID, canonical payload, dependencies/revisions, and causal parent IDs required by trace semantics;
- analytical anchors and remainders;
- random-relevant authoritative IDs; and
- explicit continuing run inputs such as a `ComparisonDrawMap`.

Handlers never serialize. Event type IDs resolve through the model's stable registry. Loading preserves IDs and sequence values exactly; it does not call normal allocation paths. Save immediately before event `E`, load, and continue must be structurally trace-equivalent to uninterrupted continuation.

## Open obligations

- `ORD-001`: decide whether immediate belief evidence belongs before the active cognitive cycle or only after outcome learning.
- `ORD-002`: define multi-character event ordering and simultaneous interaction semantics.
- `ORD-003`: candidate whole-instant rollback semantics are defined above; close only after failure injection at every staged boundary proves exact restoration and terminal behavior.
- `ORD-004`: candidate quiescent save/load semantics are defined above; close only after pending-event, allocator, anchor, coupling-input, and continuation vectors pass.
- `ORD-005`: specify the appraisal → regulatory impulse → later interoception mapping completely, including the minimum later observation boundary and whether any non-interoceptive world effect of the impulse may occur at the original instant.

The applicable [Campaign 0 Conformance Vectors](CONFORMANCE_VECTORS.md) passed before acceptance. Reopen `ORD-003` or `ORD-004` if ordering, transaction, allocation, quiescence, or continuation semantics change.
