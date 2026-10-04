# Acquisition identity: role audit and decision packet

2026-09-12. Primary-agent inspection and adversarial review. **DECISION REQUIRED;
no new symbolic family accepted or numeric allocation proposed.** Consumes the
[source direction receipt](LOCAL_RESERVE_PUBLIC_SOURCE_DIRECTION_ACCEPTANCE.md).

## What the accepted identity actually means

[Public integration](CAMPAIGN3_ATTENTION_PUBLIC_INTEGRATION_REV1.md), selection
sections, assigns SelectionOccurrenceId to SelectionAudit. The selected view borrows
that identity; it is a child payload, not another identity-bearing output. Positive
and empty selection each allocate one selection occurrence. ExperienceSource can
have no eligible/selected rows; K0 does not become EmptySource.

[Accepted whole shape](../formal/ATTENTION_PUBLIC_SHAPE_ACCEPTANCE.md) explicitly
excludes encoding, memory and learning. Selection and processing have no persistent
state access, and the bounded diagnostic has no CharacterId projection requirement.
The [permanent table](../formal/ATTENTION_ALLOCATION_TABLE.json) assigns1143 to
SelectionId in audit532, view534 and processing receipt535. It does not assign an
acquisition or memory-formation role to that namespace.

Actual [runtime](../../src/campaign3/attentionRuntime.ts), branches8/9, allocates1143
before selecting and emits an audit even when empty; branch10 references it in the
processing receipt. This witnesses a completed selection occurrence, not successful
durable formation. The resulting ID is stable and useful provenance, but durability
is neither its existence condition nor an accepted identity equivalence.

The [draft retention design](ATTENTION_MEMORY_RETENTION_REVIEW_REV1.md) already
uses `(CharacterId, SelectionOccurrenceId)` as the address of positive retained
visual encodings. That is an unaccepted proposal, explicitly describing1143 as a
source link. Its feasibility does not close the new interoceptive identity question.

## Counterexample to assuming a new identity is mandatory

[Accepted measurement memory](../formal/MEASUREMENT_EPISODIC_MEMORY.md) deliberately
has no MemoryEpisodeId. Its [whole closure](CAMPAIGN2_MEASUREMENT_MEMORY_SYMBOLIC_CLOSURE.md)
keys an episode by CharacterId plus CognitiveMeasurementEvidenceId while retaining
separately identified learning evidence. Thus source-addressed storage is a legitimate
bounded design. An ID that also exists when nothing is retained is not, by that fact
alone, an invalid storage key. Membership and producer admission can distinguish it.

The audit therefore rejects **automatic1143-as-acquisition equivalence**, not every
possible use of1143 as an opaque provenance or storage reference. Neither the numeric
table nor the North Star decides which following design should govern new ordinary
acquisition. This is a semantic address choice, not a codec cleanup.

## Two concrete alternatives

**A — source-addressed retained acquisition.** Keep1143 meaning selection occurrence.
Define an admitted typed selection-source address, qualified by CharacterId, as the
key for one positive retained acquisition. A future body selector requires its own
explicit producer/output admission; it cannot reuse532/534's visual layouts by fiat.
Require at most one initial retained acquisition per qualified source. Empty/K0 and
zero/unavailable encoding produce no retained entry. Later consolidation addresses
the existing entry and cannot create a second initial acquisition from that source.
There is no extra acquisition identity. This preserves the visual draft's design and
resembles accepted measurement memory, but couples durable addressing to source
granularity and makes every additional source kind an address/admission extension.

**B — separately identified successful acquisition (recommended).** Give the new
ordinary-memory acquisition boundary its own stable occurrence role, shared by the
new event/continuant and interoceptive acquisition kinds. Preserve the selection ID
as source provenance. Emit an acquisition occurrence only for a nonempty admitted
retained result; transaction failure leaves neither occurrence nor retained state
committed. One initial acquisition per admitted source remains a profile rule, not
an identity equivalence. Address body groups by `(AcquisitionOccurrence, SignalId)`.
Recollection, consolidation and pruning reference that acquisition; they do not
allocate it again or turn historical source IDs into sample resolvers.

B authorizes one semantic acquisition identity, **not** an additional MemoryEpisodeId
or per-group ID. Its eventual learning-evidence/output inventory must determine
whether that single occurrence-bearing result also serves the formation evidence
role; do not allocate a second redundant formation ID. Exact record, producer phase,
PRJ binding, rollback, finite counts and numeric assignment remain separate gates.
Accepted measurement memory and old bounded attention remain unchanged under either
alternative. B requires a correct-forward revision of the unaccepted visual-memory
address proposal and corresponding draft read/write, presentation and output tables.

Recommendation B preserves the distinction between selection and what was actually
encoded, and gives the two peer acquisition kinds a common durable address without
requiring identical payloads. Cost: another governed occurrence role and explicit
output/allocator proof. A remains defensible for a permanently one-acquisition-per-
source bounded profile; this audit does not label it an architectural violation.

## Adversarial acceptance obligations for either choice

- Selection without retained content creates no memory entry or acquisition target.
- Support membership and a well-typed source ID alone grant no retention or read.
- Replay cannot create a second initial formation; failed instants commit none of
  their candidate identities, memory appends or pending work.
- Two valid same-instant acquisitions survive one family-owned reconciliation.
- Different source/acquisition IDs are not merged by equal time or sample value.
- Recollection and later consolidation preserve the initial address and historical
  encoding bytes. Pruning does not make an old ID reusable or recreate omitted data.
- Physical key/layout and within-bin truth substitutions preserve downstream bytes
  at matched identities when admitted safe evidence is unchanged.

These remain public proof obligations, not test results. MEC-005 and MEC-007 retain
their selection/encoding controls; MEC-010 retains its memory-access and lifecycle
obligations. SUB-003 identity discipline and SUB-011 correct-forward history apply.
Neither alternative collapses encoded memory into truth or current recollection;
the Architecture Map's ordinary-memory and sole-authority boundaries remain binding.

## Completed independent verification

[Opportunity tests](../../src/test/interoceptiveOpportunityIdentity.test.ts) now have
five passing cases in [the new receipt](INTEROCEPTIVE_OPPORTUNITY_IDENTITY_TESTS_REV1.json).
Added SO-D exercises actual SEM current and consequence admission/freeze at one
instant with distinct IDs, including rejection of the wrong freeze phase. SO-E
deliberately reuses one ID across lanes and checks the exact settlement failure
`DUPLICATE_EXPERIENCE_ENVELOPE`. Existing same-lane, multiple-support and absence
cases still pass. This proves bounded existing SEM behavior, not the unimplemented
source compiler's derivation of its evidence-presence flag or public attribution.
Earlier test receipts remain attached to their historical test versions.

General Attention remains OPEN. Durable identity is the next decision; implementation,
carrier bounds, cues, retention, persistence, registrations and corpus remain gated.
