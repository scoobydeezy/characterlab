# First composed retention priority

2026-09-13. Historical packet; [A subsequently accepted](GENERAL_ATTENTION_SIGNIFICANCE_RETENTION_RESOLUTION.md).
At the time of this proposal, directional significance storage was accepted; none
of its four values yet has survival priority. This packet makes that policy explicit.

## A — significance, then use, then unprotected (recommended first candidate)

Within each existing retention kind, propose three tiers:

1. Nonempty OutcomeSignificanceDirections.
2. Empty directions and UseProtection=true.
3. Empty directions and UseProtection=false.

Within each tier retain original acquisition recency descending, then the existing
canonical acquisition/child address tie. Closer-only, farther-only and both occupy
the same first tier. A used significant child gets no additional advantage over an
unused significant child. No score, count, magnitude, age refresh or extra slot.

Every child still costs one slot; independent kind budgets do not borrow. All tiers
can lose under pressure and zero capacity loses everything. Loss uses actual child
fragmentation and removes both content and local metadata. This is bounded survival
priority, not permanence or a universal claim about memory importance.

The proposal treats one earned concern-relative consequence as outranking mere use.
That is a substantive and intentionally coarse hypothesis: even a small qualifying
change can outrank repeated use, because accepted storage retains no magnitude/count.
It is not implied by the directional set and needs explicit acceptance.

## B — one shared protected tier for significance or use

Use two tiers: any significance OR UseProtection, then neither. Within a tier use
the same original recency and canonical tie. This admits significance as an independent
route to protection, but grants it no priority over actual use. Keep the full directional
set in state; this policy does not consume direction differences or set cardinality.

## Discriminating fixture

Old alpha: acquired t1, MovingCloser significance, UseProtection=true.
New beta: acquired t8, no significance, UseProtection=true. Same kind, capacity1.
A retains alpha; B retains beta. Use is equal, so the significance tier causes the
difference. Repeat with both use bits false, and with alpha unused/beta used, to
separate independent protection from its priority over use.

Further controls: closer-only/farther-only/both produce equal policy priority; a newer
significant child beats an older significant child; two tags never win a cardinality
bonus; no-context sibling spread; zero capacity; independent kind budgets; canonical
ties; no time refresh; no credit after loss. These would be policy tests over supplied
qualified state, not an authenticated public outcome experiment.

## Timing and remaining public gate

Use only prior committed significance/use state at a later retention instant, matching
the accepted cross-instant scope. Do not rescue a new formation with same-instant credit.
The actual causal-target producer, qualifying-result join, public memory owner, result
identity, canonical persistence and corpus remain to be contracted and qualified.
Policy acceptance cannot bypass those gates or call the old-important-memory case PASS.

Requested ruling: A as the first intact composed candidate, B as the explicit shared-tier
comparator. Direction-specific or graded priorities remain later independent models.
