# Significance-First Tiered Retention Candidate

2026-09-13. `significance-first-retention-component/0.1-candidate`.
Component shape accepted by primary-agent review under autonomous authorization,
implementing the user's three-tier ruling. This is a deliberately bounded hypothesis.

Consume prior committed retained child state with independent useProtection and
outcomeSignificanceDirections. Per memory-kind partition, sort by tier: nonempty
significance first, then empty significance with use=true, then neither. Within each
tier sort original acquiredAt descending, then canonical List(Unsigned(acquisition),
Text(child key)) bytes ascending. Keep the capacity prefix; apply actual fragmentation
to every other child. Output acquisitions and children have canonical identity/key order.

The shared-tier comparator sorts significance OR use ahead of neither, retaining the
same recency and tie rules. Both implementations consume the same validated state
and return the same fields. Neither mutates caller state or rewrites content/time.

Each child costs one slot; kind budgets remain independent integers0..1024. All tiers
can lose; zero removes all. Used significant children get no extra priority. Closer,
farther and both tags have identical tier priority, with no direction/count/repetition
bonus. Partial loss preserves survivor metadata; complete loss removes it.

The component requires the caller to supply prior committed metadata. Fresh same-
instant acquisitions may enter with empty significance and use=false only; nonempty
protection on acquiredAt=now rejects. Because compact state stores no credit timestamp,
the component cannot authenticate whether an older child's credit was committed
earlier or in this instant. The public coordinator must enforce that provenance/read
point; this check alone is not the temporal gate. No credit is produced here.

No public source, attribution target, qualification-result join, persistence, schema
or allocation is authorized. SF-A..H qualify supplied-state policy behavior only.
This contract does not declare the whole old-important-memory phenomenon passed.
