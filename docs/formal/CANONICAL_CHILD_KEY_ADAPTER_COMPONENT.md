# Canonical child-key adapter component

`canonical-child-key-adapter/0.1-candidate`, 2026-09-13. LOCAL DISPOSITION — no
owner ruling required. Internal representation adapter, no identity allocation.

The retention components' bounded text keys are placeholders. A full canonical
PerceptualReferentId can exceed that text bound, and textual rendering can reverse
canonical ordering. Do not truncate, hash, reinterpret an ordinal as chronology,
or persist a second child identity to fit those placeholders.

For one trusted operation, collect the already admitted canonical keys, deduplicate
their exact canonical bytes and sort those bytes. Assign fixed-width temporary labels
k000..k255 in that order. The table accepts at most256 inputs, each at most4096
canonical bytes; these are construction work bounds, not cognitive capacities.
Pass labels only to the unchanged internal component. Translate all returned child
keys, including loss addresses, back to detached original canonical values before
returning or committing the result. The table contains identities only, no evidence
payloads, source resolvers or forgotten content. It is discarded after the operation.

All labels have equal UTF-8 length, so the component's canonical text comparison
preserves the full canonical-key order. Within a fixed public acquisition family,
the fixed namespace prefix also preserves its unsigned occurrence payload ordering.
The final public address schema must retain acquisition-before-child field order.
No label is a canonical identity, trace field, saved state or authority token.
Labels from different tables must never be exchanged; the table is not an admission
or authenticity mechanism. Public role and same-subject checks happen before it.

The first wrapper here applies the existing significance-first retention operation
to canonical child keys and returns original keys and original acquisition ordinals.
It does not admit new key kinds or numeric namespaces. Wrong key kind/observer,
actual producer provenance and canonical public owner validation remain upstream
obligations. Temporary labels are never returned by this wrapper.
