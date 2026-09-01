# Event Ordering and Quiescence

**Status:** candidate ordering contract, version `ordering/0.1-draft`

Events are ordered lexicographically by:

```text
(DueAt, Phase, SequenceId)
```

`DueAt` is integer simulation time. `Phase` is a registered integer. `SequenceId` is a monotonic event-local tiebreaker assigned by the scheduler, never collection iteration order.

## Candidate phase registry

| Phase | Boundary |
|---:|---|
| 0 | time/development and embodied materialization |
| 10 | observation and interoception |
| 20 | encoding, retrieval, recognition |
| 30 | belief and person-model evidence application |
| 40 | workspace and control allocation |
| 50 | appraisal, regulation impulse, affect |
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

1. An executing event may schedule only a later phase at the same `DueAt`.
2. Scheduling an earlier or equal phase at the same instant is a typed causal-order failure.
3. The scheduler drains the instant to quiescence before advancing time.
4. A configured cascade ceiling produces a typed failure with the complete causal chain; it never silently drops work.
5. Feedback that logically belongs to a later cycle is scheduled at a later `DueAt`, not smuggled backward through phases.
6. The world outcome enters the authoritative trace at phase 110, but character learning receives only phase-120 observed/encoded consequences.

## Open obligations

- `ORD-001`: decide whether immediate belief evidence belongs before the active cognitive cycle or only after outcome learning.
- `ORD-002`: define multi-character event ordering and simultaneous interaction semantics.
- `ORD-003`: define transactional commit/rollback behavior for typed failures.
- `ORD-004`: prove save/load preserves pending event identity and ordering exactly.
