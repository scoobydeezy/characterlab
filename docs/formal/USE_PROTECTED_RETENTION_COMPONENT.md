# Binary child-local use protection policy

2026-09-12. `use-protected-retention-component/0.1-candidate`.
Component policy shape accepted by primary-agent review under autonomous authorization,
implementing the user's binary protection ruling. This is a pure policy component;
consumer authentication, timing and public state writes are not implemented here.

Consume the accepted retained-child structure and original acquisition times, plus
one Boolean useProtection per surviving child. Structural bounds remain those of
retention-fragmentation-component; times are nonnegative and no later than now.
Newly formed children must enter false. This component validates supplied state; the
future formation owner must enforce initialization against an actual formation result.

applyQualifiedUnitUse takes already-qualified existing unique acquisition/child
addresses. It detaches inputs and sets only those children's bits true. Repetition
does not stack. No sample bytes or acquiredAt change. This is not a public use API:
supplying addresses does not establish qualification. The exact extant-address
validator is shared with fragmentation; its discarded pure result enacts no loss.

Qualification requires an independently admitted cognitive consumer, actual use of
the exact retained operand, and successful commitment of that consumer's result.
Successful means the operation committed, not that an answer was correct, beneficial,
rewarded or selected. Cueing, ranking, recall, presentation, logging and accessibility
updates alone do not qualify. Co-acquired children need their own operand evidence.
No consumer is nominated by this contract. Attribution Supported alone is insufficient.

retainWithUseProtection orders children separately within each retention kind:
protected first, original acquiredAt descending, then ascending canonical bytes of
List(Unsigned(acquisition), Text(child key)). Every child costs one slot. Retain the
capacity prefix and use actual fragmentation for the rest. Capacity is an integer
0..1024 for each kind, with no borrowing. Protected children can lose; zero loses all.
Output children and acquisitions use canonical key/identity order. All data are detached.

There is no use count, protection timestamp, decay, importance, accessibility score,
encoding-strength rewrite or hidden forgotten-content archive. Loss removes the bit
with its child. A later use of a missing address rejects; a newly formed child sharing
a semantic key cannot inherit prior protection. Only use completed before a separately
accepted retention read point may affect that barrier; this API does not establish
that ordering or authorize transient access to immediately lost new formations.

UP-A..H in src/test/useProtectedRetention.test.ts are the frozen policy vectors.
Their inputs explicitly supply qualification. They do not prove receipt origin,
public formation initialization, consumer commit/rollback, read-domain admission,
same-barrier timing, canonical persistence or corpus promotion. No numeric identity,
record layout, public profile or learning authority is allocated by this component.
