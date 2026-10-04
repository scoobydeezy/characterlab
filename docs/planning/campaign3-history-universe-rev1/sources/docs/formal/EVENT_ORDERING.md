# Event Ordering and Quiescence

**Status:** accepted Campaign 0 contract, version identifier `ordering/0.2-candidate` (accepted 2026-09-01)

Events are ordered lexicographically by:

```text
(DueAt, Phase, EventSequence)
```

`DueAt` is canonical `SimInstant`. `Phase` is a registered integer. `EventSequence` is a run-global monotonic scheduler tiebreaker assigned at authoritative scheduling time, never collection iteration order. Its allocator state is authoritative, persisted, and restored without minting replacement values.

## Accepted phase registry

The registered phase manifest is `ordering-phases/2-candidate`. `SEM-001H` subdivides the two perception/recognition lanes without changing the accepted lexicographic scheduler semantics.

| Phase | Boundary |
|---:|---|
| 0 | time/development and embodied materialization |
| 10 | current-lane sensory observation/interoception and conditional experience reservation |
| 11 | current continuant tracking and event-file segmentation |
| 12 | current perceived bindings and feature evidence |
| 13 | independent current continuant/event-pattern classification |
| 14 | freeze/stage current pre-recognition `SemanticExperience` |
| 15 | current experience-scoped companion causal-role evidence |
| 20 | freeze current recognition cues and permitted retained-state projection |
| 21 | current recognition evaluation/resolution |
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
| 120 | consequence-lane sensory observation and conditional experience reservation |
| 121 | consequence continuant tracking and event-file segmentation |
| 122 | consequence perceived bindings and feature evidence |
| 123 | independent consequence continuant/event-pattern classification |
| 124 | freeze/stage consequence pre-recognition `SemanticExperience` |
| 125 | consequence experience-scoped companion causal-role evidence |
| 126 | freeze consequence recognition cues and permitted retained-state projection |
| 127 | consequence recognition evaluation/resolution |
| 130 | character-relative outcome evaluation and learning-evidence production |
| 140 | consolidation, adaptation, and persistent-state mutation |
| 150 | **non-schedulable settlement sentinel:** quiescence, final trace/invariant validation, atomic commit |

Unused gaps carry no simulated-duration or semantic magnitude. A seam specification may add or subdivide a phase only by updating the registry version and proving there is no cycle, epistemic leak, or construction-order dependence.

## Same-instant rules

1. An executing event may schedule the same or a later phase at the same `DueAt`; new work receives a strictly later `EventSequence` than its cause.
2. Scheduling an earlier phase at the same instant is a typed causal-order failure.
3. The scheduler drains the instant to quiescence before advancing time.
4. A configured cascade ceiling produces a typed failure with the complete causal chain; it never silently drops work.
5. Feedback that logically belongs to a later cycle is scheduled at a later `DueAt`, not smuggled backward through phases.
6. The world outcome enters the authoritative trace at phase 110, but character learning receives only phase-120 observed/encoded consequences.
7. Phase-52 regulatory changes may affect authoritative body/regulatory state immediately, but their newly derived interoceptive evidence is scheduled at a later `DueAt` or other explicitly defined later observation boundary. It cannot re-enter phase 50 of the current instant.
8. An observation lane reads only truth/state available strictly before its entry cutoff. Truth first available at phase 10 cannot reopen the current lane; truth first available at phase 120 cannot reopen the consequence lane. Phase-110 outcome truth is eligible for phase-120 observation subject to the observation seam's own permissions.
9. Phase ordering establishes temporal availability, never a `ReadDomain`. In particular, phase 21 preceding phase 30 does not settle `ORD-001`.
10. Phase 150 is a registry sentinel, not a domain-event phase. Scheduling or restoring an ordinary event at 150 is invalid.

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

No event executes at phase 150. After all schedulable work through phase 140 drains, the scheduler performs the existing final state/invariant/trace validation boundaries and commits atomically. The numeric sentinel makes the barrier explicit in the registry without turning settlement into a psychological or world transition.

`MaxSettlementWorkPerSimulationInstant` is a versioned model parameter. Exceeding it is a typed failure that includes the complete available causal chain; remaining work is never deferred to another instant. Changing the limit changes `ParameterSetDigest`.

## Save/load boundary

Saves occur only at quiescent committed boundaries. Mid-transition saves are invalid. The canonical save payload includes:

- `ModelIdentity` and artifact `SaveSchemaVersion`;
- clock and complete authoritative state;
- runtime ID, event ID, and `EventSequence` allocator states;
- every accepted seam-owned allocator state, including the `SEM-001A` per-observer next-continuant-track and `SEM-001C` next-event-file sequence maps once implemented;
- complete pending scheduler queue in canonical execution order;
- every event's ID, `DueAt`, phase, sequence, type ID, canonical payload, dependencies/revisions, and causal parent IDs required by trace semantics;
- analytical anchors and remainders;
- random-relevant authoritative IDs; and
- explicit continuing run inputs such as a `ComparisonDrawMap`.

Handlers never serialize. Event type IDs resolve through the model's stable registry. Loading preserves IDs and sequence values exactly; it does not call normal allocation paths. Save immediately before event `E`, load, and continue must be structurally trace-equivalent to uninterrupted continuation.

The `SEM-001A` continuant-track and `SEM-001C` event-file allocators are not run-global tiebreakers: each observer owns independent monotonically increasing sequences. Interleaving another observer's detections or file creation must not renumber or otherwise perturb this observer's perceptual identity spaces. A failed instant restores every affected observer sequence exactly.

## Open obligations

- `ORD-001`: decide whether immediate belief evidence belongs before the active cognitive cycle or only after outcome learning.
- `ORD-002`: define multi-character event ordering and simultaneous interaction semantics.
- `ORD-003`: candidate whole-instant rollback semantics are defined above; close only after failure injection at every staged boundary proves exact restoration and terminal behavior.
- `ORD-004`: candidate quiescent save/load semantics are defined above; close only after pending-event, allocator, anchor, coupling-input, and continuation vectors pass.
- `ORD-005`: specify the appraisal → regulatory impulse → later interoception mapping completely, including the minimum later observation boundary and whether any non-interoceptive world effect of the impulse may occur at the original instant.

The applicable [Campaign 0 Conformance Vectors](CONFORMANCE_VECTORS.md) passed before acceptance. Reopen `ORD-003` or `ORD-004` if ordering, transaction, allocation, quiescence, or continuation semantics change.
