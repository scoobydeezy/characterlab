# Retention fragmentation component

2026-09-12. `retention-fragmentation-component/0.1-candidate`.
**Component shape accepted by primary-agent review under autonomous authorization.**
Implements only the loss mechanics in the accepted complete-semantic-unit ruling.
No survival-priority law, public admission, persistent owner or allocation is accepted.

Input is a detached finite list of acquisitions and an explicit list of child addresses
to remove. Each acquisition has a nonnegative bigint occurrence placeholder, one of
EventContinuant/Interoceptive, and nonempty semantic units. Each unit has a nonempty
NFC component key and a nonempty bounded list of opaque evidence byte arrays.
These keys/ordinals are not production identities. Caller-supplied content is not
authenticated; public integration must supply exact admitted unitization and content.

Finite component safety limits are32 acquisitions,32 units per acquisition,16 views
per unit,65536 bytes per view and64 UTF-8 bytes per key. Loss addresses are bounded
by1024, unique and must identify an existing child. Inputs must be dense plain arrays.
Occurrence IDs are unique across acquisition kinds; unit keys are unique within an
acquisition. Equal keys in separate acquisitions are separate retained units.

Count one surviving semantic unit per child, not per view or byte. Apply the supplied
loss plan simultaneously. Preserve exact bytes of every remaining child and its
acquisition identity; remove an acquisition from current results if its last child
is lost. Return detached survivors and per-kind unit counts only: no removed payload,
mask, archive or historical resolver. The pure function does not mutate its inputs;
the eventual owner must replace current state and govern historical storage separately.

Per-kind capacities are supplied integers0..1024. Validate post-loss usage against
them; do not borrow spare capacity or select additional victims implicitly. Failure
means the supplied plan is insufficient, not modeled forgetting. A future policy
must produce an adequate plan for valid cognitive pressure. This component is not
that policy and cannot qualify forgetting merely by throwing on an overfull result.

No sorting, priority, age, accessibility, importance, strength or attribution operand
is introduced. Preserve surviving input order; public canonical order is a separate
carrier requirement. Loss cannot remove one evidence view inside a surviving unit.
No new acquisition/fragment IDs or bytes are synthesized. Safety limits above are
component workload domains, not committed public model parameters.

Required component checks: partial and final loss, exact multi-view preservation,
semantic-unit accounting, no cross-kind borrowing, duplicate/unknown loss rejection,
input/output detachment and malformed/safety-bound rejection. Public producer/PRJ,
same-instant owner reconciliation, pruning metadata, graph/presentation effects,
restoration and priority remain open after these checks.
