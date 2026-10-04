# Ordinary acquisition formation: occurrence and settlement protocol

2026-09-12. **DRAFT PROTOCOL; NOT WHOLE SHAPE OR ALLOCATION INPUT.** Implements the
design implications of [accepted identity B](GENERAL_ATTENTION_ACQUISITION_IDENTITY_RESOLUTION.md).
This is a reviewable proposal, not an accepted public schema or production seam.

## One evidence output, one acquisition identity

Propose one occurrence-bearing AcquisitionFormationEvidence result from the phase130
retention/evidence boundary. It contains the candidate AcquisitionOccurrenceId, actual
observer, acquisition time, admitted selection provenance, exact positive retained
typed content and producing version. The event/continuant and interoceptive variants
have distinct payloads under this common role; their field layouts remain pending.
CharacterId comes from the accepted required PRJ/IDN projection on the admitted
payload and qualifies the owner path. It is not inferred from selection or acquisition
ordinals, copied from raw source input or supplied by a new roster.

The occurrence is the acquisition identity itself. There is no separate formation
evidence ID or MemoryEpisodeId. The retained initial acquisition carries the same
occurrence and admitted evidence, not a second production of it. This is a new,
explicitly admitted character-learning evidence kind, not a fabricated270 consequence
record or a new CharacterEvidenceRef alternative. Current acquisition does not pass
through consequence OutcomeEvaluation merely to gain a learning label.

The evidence producer is on route/character-learning and has no persistent writes.
It consumes completed authenticated selected encoding, checks positive retained
content and reserves exactly one candidate occurrence only on that branch. Empty,
zero or unavailable content emits no formation evidence and no formation work.
The trace-side calculation may still explain exclusions; it cannot become a source
archive reachable through the acquisition. There is no new appraisal, effect,
attribution, Need or surprise rule in this protocol.

## Evidence before settlement does not assert committed memory

Phase130 output is transaction-local candidate evidence. Phase140 admits that exact
output under a registered producer/output association before required projection or
owner reads. A copied ID, shape-valid payload, matching time or source support entry
is insufficient. Public admission must bind the exact completed parent output and
prevent replay of the same formation obligation.

All necessary phase140 work is emitted before the barrier begins. Terminal members
cannot emit children. The formation family collects every valid candidate for that
instant, uses one common B0, checks source uniqueness against retained state and
the current batch, orders by an explicit canonical rule, and appends through one
authority. Member execution does not replace the same old leaf independently.
The exact ordering rule and peer auxiliary-family batch declarations are still
whole-shape gates; runtime occurrence magnitude is not psychological chronology.

When event acquisition also requires association and presentation writes, those
terminal obligations consume the same evidence and remain separately owned. Body
acquisition does not fabricate continuant graph nodes. Its applicable auxiliary
obligations must be declared explicitly rather than inheriting visual writers by name.
Combined cross-family validation must finish before whole-instant commit.

Successful commit makes the output occurrence and corresponding initial acquisition
authoritative together. Any failure discards state candidates, outputs, trace additions,
queue changes and runtime allocator advances. Internal reservation is permitted;
authoritative history never contains a phantom successful acquisition. A failed
attempt is not evidence that something became durable. The failed scheduler remains
terminal: rollback is not permission to retry that run in place. Recovery must use
the existing authorized replay/restore entry, whose public proof remains pending here.

The first profile admits at most one initial acquisition per qualified selection
source, checked both within the batch and against committed formation history.
Pruning must not accidentally remove the basis needed to enforce that profile rule;
the exact bounded history/replay mechanism remains a persistence/retention gate.
Do not introduce an unbounded tombstone set or source resolver to satisfy it.

## Local accounting and limits

For n nonempty admitted candidates, add n acquisition occurrence reservations and
n occurrence-bearing evidence outputs relative to a design that emitted no such
output. The existing retain stage might already account for an output; its exact
replacement delta must be recomputed from the final output table, not blindly added.
Each acquisition has one identity across evidence, storage and downstream references.
No writer allocates another acquisition, formation or group identity. Empty branches
add zero acquisition slots. Scheduler event allocations remain separately counted.

The old139-event/172-output/152-slot envelope is historical and does not establish
the composed body's bounds. Exact carrier layout, field roles, producer admission,
auxiliary writers, ordering, registration, numeric allocation, model packaging and
public persistence proof remain open. The identity propagation plan identifies
affected addresses but is not a complete successor schema.

## Falsification plan

Use the actual scheduler with a clearly scoped fixture adapter to establish that
phase130 candidate allocation can be committed atomically with a phase140 family
append, that multiple candidates survive one reconciliation, and that late failure
restores the allocator, queue, state, outputs and trace. Check empty input, duplicate
source within a batch, and duplicate source after a prior commit. These tests cannot
qualify public producer admission, PRJ/IDN, canonical carrier codecs or memory policy.

Public proof must additionally reject wrong-subject evidence, forged completed-parent
associations, discarded-sample lookup, wrong producer lane, orphan output/append,
missing auxiliary work and stale restore history. Preserve the selected-only and
hidden-source invariance obligations through later memory and attribution reads.

## Executed scheduler feasibility and correction

[Six fixture tests](ATTENTION_ACQUISITION_FORMATION_TESTS_REV2.json) pass against
the actual scheduler: positive evidence/output identity equals the retained identity;
empty formation consumes no acquisition allocator slot; two same-instant candidates
survive one append with B0-only reads; late finish failure restores committed surfaces
and leaves the failed run terminal; duplicate source rejects within the batch and
after a prior committed acquisition. Reversing terminal emission order preserves
the retained fixture state at matched candidate identities. Canonical source ordering
in this fixture is a test choice, not a proposed public chronology rule.

The [first test receipt](ATTENTION_ACQUISITION_FORMATION_TESTS_REV1.json) is preserved:
five tests passed and the sixth exposed an incorrect test assumption that a failed
run could retry. The correction changes only that fixture expectation, not scheduler
behavior. TypeScript checking passes after the fixture correction. No public producer,
character projection, memory policy, canonical acquisition codec, pruning or restore
qualification follows from these six tests. The fixture accepts caller-supplied
strings deliberately and is not an authentication implementation.
