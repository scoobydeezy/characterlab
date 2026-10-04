# Formation protocol state: public placement decision

2026-09-12. **DECISION REQUIRED.** Finite source-domain admission and payload-free
successful history remain accepted. This choice concerns their canonical ownership
and continuation representation, not the cognitive retention policy.

## Actual substrate inspection

`src/campaign3/attentionRuntime.ts` uses AuthoritativeState as scheduler state. Its
adapter saves that state's canonical value. Private expected/completed admission
bookkeeping is cleared at each settlement; it is not a persisted lifetime ledger.
`src/campaign3/attentionFactory.ts` restores the bounded original attention run by
replaying the committed prefix and comparing exact whole-save bytes. That profile
does not already support the new acquisition history or multi-instant memory lifecycle.

`src/substrate/persistence.ts` fixes SchedulerSave/132's twelve fields, including
AuthoritativeState, ContinuingRunInputs, CommittedTrace and Outputs. It offers no
generic extra protocol-state bag. ContinuingRunInputs cannot silently become mutable
governance history, and historical SchedulerSave layout must not change in place.
`src/substrate/state.ts` requires each writable path to have exactly one declared
authority. A private mutable map omitted from canonical state is not a valid shortcut.

The current public formation draft explicitly makes the phase130 evidence producer
write-free and emits no formation work on empty content. Therefore enrolling only in
its successful phase140 branch misses never-successful admitted sources. Giving that
producer a hidden history write would change its contract. A public placement must
name the earlier admission hook, its authority, transaction boundary and persisted data.

## Alternatives

**A — dedicated canonical protocol-state root and admission authority (recommended).**
Declare a new symbolic run-governance root in the authoritative state schema, with
exact admitted-source and successful-formation metadata. It belongs to runtime
protocol governance, not to a character-learning family or an ordinary-memory reader.
Define a dedicated admission authority over its exact paths. This is a proposed new
formal surface, not an already available permission.

An authenticated admission hook enrolls distinct qualified sources before formation
eligibility; the success/loss portion reconciles with actual owner settlement. All
protocol candidates participate in the same whole-instant rollback. The evidence
producer retains WritableStateFamilies={} and receives no root mutation capability.
The runtime hook must have its own explicit declaration and trace of protocol effects;
it cannot masquerade as a character learning transition. N+1 is a profile rejection,
not a character event or a memory-loss operation.

Save the root through the normal authoritative-state field and preserve immutable N
through the model/run commitment. Restore validates exact domain/history relationships
and correspondence with completed admissions. No schema132 field addition is needed,
but a new root/authority and its roles require whole symbolic acceptance and separate
numeric allocation. Exclude this root from cognitive read domains and learned-state
feedback. Inspect any existing global family classifier before implementation; do not
force protocol governance into the nearest character state family to satisfy it.

**B — payload-free canonical admission/disposition log plus replay-derived index.**
Declare complete protocol records for every successful source enrollment and formation/
loss disposition, including admitted sources with no positive formation. On restore,
replay that bounded log to reconstruct the exact index. The index is a checked cache,
never independent state. Every live query must agree with the canonical log; no original
observation payload or character-side source resolver is exposed.

B avoids a separately serialized duplicate table, but requires complete log schema,
ordering, bounded retention and reconstruction proof. The existing trace does not
already provide these events. Dropping protocol history would invalidate continuation,
even if cognitive content was lost. Character sample history must not be kept merely
to reconstruct governance; protocol records are metadata-only. Existing trace-only
diagnostics cannot acquire this authority by implication.

## Why a ruling is required

Both are technically possible. A makes authoritative protocol state and its sole writer
explicit, but adds a new root/authority outside character learning. B makes a new log
authoritative for continuation and entails reconstruction obligations. These differ
in canonical ownership, read enforcement and retained history, not merely serialization
syntax. The earlier bounded-run ruling did not choose either representation.

Recommendation: A, preserving existing save envelope and explicit sole-writer discipline.
Before activation, finish qualified address fields, initial presence, exact source-domain
bound, admitted-empty branch, success/loss joins, failed-instant semantics and public
negative controls. No new authority/root allocation or public implementation is made
by this decision packet. General Attention remains OPEN.
