# Bounded formation governance component

2026-09-12. `formation-governance-component/0.1-candidate`.
Component shape accepted by primary-agent self-review under autonomous authorization.

Input is an explicitly supplied, fixed finite qualified source universe, prior committed
metadata, current successful formations, reconciled surviving acquisition IDs and the
current instant. Component addresses use opaque NFC strings (1..128 UTF-8 bytes) for
source and character and a closed acquisition kind. They stand in for public admission
and PRJ-qualified identities; no new public identity domain is allocated. A source is
qualified by character and source address; conflicting kinds for that address reject.

Each array has a component safety maximum64. The domain itself, not merely successful
rows, is bounded. This is not the committed public N. This component assumes an already
fixed universe; it does not implement dynamic source enrollment or authenticate domain
membership. The public run must retain/bind the exact universe across continuation.

Governance rows contain only source, character, kind, acquisition, formedAt and
completeLoss. Acquisition IDs are nonnegative unique opaque integers in this fixture.
Exact fields are enforced, with no arbitrary payload metadata. Prior timestamps are
not future; new timestamps equal now. Prior source duplicates, source replay, duplicate
acquisition IDs, unadmitted sources and mismatched kinds/subjects reject. Unknown or
duplicate survivor IDs reject; a completely lost acquisition cannot reappear as live.

Retain every prior row and add only successful formations. Reconcile completeLoss from
the supplied survivor set. Preserve all other original metadata. Return detached frozen
rows ordered by acquisition integer solely for deterministic representation. Magnitude
does not imply source chronology or finalization. An absent row means no committed
success, not no prior attempt. No failed-attempt history is added.

Rejection mutates no input. No history GC, payload resolver, domain extension, capacity
reset, new occurrence allocation or content read exists here. Caller-supplied prior
history is trusted state; clearing it is not an authorized public operation. Runtime
nonreuse also requires the preserved allocator; table uniqueness alone is not a public
allocator proof. Binding domain/history to immutable run configuration and canonical
save/restore, lifecycle admission and owner transactions remain public obligations.
