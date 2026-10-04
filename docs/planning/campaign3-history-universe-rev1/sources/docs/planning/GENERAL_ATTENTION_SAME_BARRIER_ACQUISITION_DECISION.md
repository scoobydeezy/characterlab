# Same-barrier acquisition and complete retention loss

2026-09-12. **ARCHITECTURAL DECISION REQUIRED.** Recency component testing is complete
at its stated scope. This is an acquisition-history/settlement question, not priority.

## Concrete trigger

A current selection produces nonempty eligible encoding. In that same instant its
kind has zero retention capacity, or other same-time candidates consume all capacity
under the canonical tie rule. The accepted policy removes every unit of this proposed
acquisition. The run must succeed: cognitive scarcity is not invalid workload.

Previously retained acquisitions are unambiguous: their historical occurrence remains,
and final-child loss removes their current recall target. The unresolved case is
**new formation and final-child loss within its first atomic commit**.

The [identity ruling](GENERAL_ATTENTION_ACQUISITION_IDENTITY_RESOLUTION.md) defines an
acquisition as successful creation of durable ordinary memory and forbids phantom
successful acquisitions on failed settlement. The [recency ruling](GENERAL_ATTENTION_RETENTION_PRIORITY_RESOLUTION.md)
requires the complete barrier set and zero-capacity loss. Neither explicitly specifies
whether logical formation followed by loss inside a successful instant counts as
durable creation when no current content survives that instant.

The draft phase130 evidence output already carries a candidate acquisition identity.
The generic scheduler commits successful outputs atomically; merely omitting the
state append does not erase that identity-bearing output. Consequently this choice
changes carrier/output admission, not just a conditional in the final memory writer.

## Alternatives

**A — committed formation followed by committed loss (recommended for causal legibility).**
A valid nonempty formation and its retention loss are distinct logical transitions
within one successful atomic commit. Historical acquisition exists, followed by a
loss disposition; current surviving content can be empty immediately. No failed
instant commits either record. This explicitly interprets successful creation as a
committed formation event, not a promise that content survives to the next quiescent
read. It preserves selection → acquisition → loss distinctions at capacity zero and
the proposed single acquisition occurrence across evidence and history.

A requires explicit acceptance of that same-instant interpretation of durability.
Historical evidence is not a character resolver. It must not be counted as an ordinary
recallable target, automatic presentation, retention success or persistent payload
when its last unit is gone. Same-instant attribution cannot read removed content
through this historical acquisition merely because a formation existed; any permitted
transient evidence use needs its own explicit admission and ordering.

**B — survival-gated acquisition commitment.** A new proposal whose entire content
loses at its first barrier commits no AcquisitionOccurrenceId. Selection/encoding
diagnostics remain, and the loss/denial is modeled rather than a run error. At least
one surviving unit is necessary for a new durable acquisition; already historical
acquisitions can later lose their last unit normally.

B preserves a stricter quiescent meaning of durable creation, but requires revising
the draft phase130 acquisition-bearing output. Such output cannot become authoritative
for a proposal that never qualifies. The final contract must move or condition fresh
acquisition allocation/output production through the existing scheduler and learning
boundary, without a redundant formation identity, identifier reuse or selective
rollback of an otherwise successful instant.

## Discrimination and invariant surface

Both options yield no current recall target for a fresh proposal at capacity zero.
They differ in authoritative historical acquisition existence, source idempotency
bookkeeping, occurrence/output budgets and the meaning of same-instant formation.
This must not be resolved by whichever adapter is easier to implement.

Both preserve original acquisition time, exact initial evidence history as appropriate
to the chosen disposition, no retrieval refresh, intact groups, per-kind partitions,
single-authority reconciliation and total rollback on actual failure. Neither creates
character access to pruned payloads or qualifies acquired importance.

Recommend A with explicit formation/loss dispositions and empty-current-state semantics;
it makes the newly accepted cognitive loss visible as loss rather than collapsing it
into never-acquired history. B is also coherent and is not rejected by this packet.
No public formation implementation or numeric allocation proceeds until resolved.
