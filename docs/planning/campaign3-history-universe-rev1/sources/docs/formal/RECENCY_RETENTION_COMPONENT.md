# Recency Retention Baseline component

2026-09-12. `recency-retention-component/0.1-candidate`.
**Component shape accepted by primary-agent review under autonomous authorization.**
Consumes the accepted age-only baseline and the existing fragmentation component.
No canonical acquisition schema, public owner, allocation or acquired importance
is established by this component.

Input: the complete finite candidate set for one barrier, consisting of prior survivors
and proposed acquisitions. Each acquisition has the fragmentation component's id,
kind and units plus original acquiredAt (nonnegative bigint, no later than now).
The component receives no retrieval, presentation, accessibility or outcome operand.
Public authentication of acquiredAt remains a later producer/owner obligation.

Validate/detach the candidate set through retention-fragmentation-component before
ranking, using its component safety bounds. Per-kind cognitive capacities are integers
0..1024. The all-candidate safety limit32 is distinct from cognitive scarcity; overfull
cognitive pools produce loss, not an error. Duplicate acquisition/child identities reject.

Rank each kind independently: greater acquiredAt first, then lexicographically smaller
canonical cenc/1 bytes of `list(unsigned(acquisition), text(childKey))` first. The
unsigned ordinal/string are component placeholders, not newly allocated public identity
grammars. Equal-time address order is deterministic only and has no psychological or
chronological interpretation. It is not locale/string-rendering order or input order.

Keep the first capacity units and pass all remaining child addresses to the actual
fragmentation component. Zero capacity removes every unit of that kind. Return only
current survivors, original acquiredAt, per-kind usage and payload-free loss addresses.
Survivors are serialized by canonical unsigned acquisition bytes and canonical text
child bytes, independently of input permutation. No lost payload or source archive
is returned. Original time is copied exactly; surviving a later barrier does not
rejuvenate a unit. No occurrence is allocated and a new proposal is not by itself
proof of successful durable formation.

All candidates are ranked together once, never by sequential append/evict. Subsequent
use at a later barrier accepts only actual prior survivors plus fresh admitted proposals,
not forgotten content. The pure component cannot authenticate that distinction.

Required checks: newer time wins despite misleading ordinal magnitude; canonical
same-time ties; partial survival and original-age preservation across barriers; zero
capacity; independent kinds; input/member permutations; malformed/future metadata;
exact intact view basis; source/output detachment. Public formation settlement,
auxiliary-state disposition, replay after pruning and acquired-protection comparison
remain open. This control is not a memory-importance model.
