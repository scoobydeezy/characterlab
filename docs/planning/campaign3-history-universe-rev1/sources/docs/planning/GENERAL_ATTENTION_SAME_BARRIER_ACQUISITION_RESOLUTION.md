# Same-barrier formation then loss: A accepted

2026-09-12. **ACQUISITION/RETENTION COMPOSITION RULING ACCEPTED by supplied review.**
Resolves the [decision packet](GENERAL_ATTENTION_SAME_BARRIER_ACQUISITION_DECISION.md).
No whole public shape, numeric allocation, persistence or runtime verdict is implied.

## Meaning of successful acquisition

AcquisitionOccurrenceId means selected content successfully crossed the governed
ordinary-memory formation boundary. It does not guarantee survival through that
instant's retention reconciliation. Here durable means entry into the ordinary-memory
lifecycle, not guaranteed availability at the next quiescent read. This explicitly
refines the earlier identity-B wording without equating selection and acquisition.

A valid nonempty formation followed by complete same-instant loss commits both logical
dispositions atomically. Historical acquisition exists; an explicit complete-loss
disposition exists; current recallable content does not. The acquisition identity is
never reused. A failed instant commits neither disposition, and selection without
qualifying formation commits no acquisition.

Formation precedes retention logically even inside one atomic settlement. This does
not authorize handlers to expose provisional sibling state, emit terminal phase140
children, bypass PRJ/admission, or count historical formation as successful retention.
The complete-barrier policy and sole-authority reconciliation remain required.

## No access window or historical sample resolver

At quiescence, an acquisition with no surviving child is not an ordinary-memory target.
Retrieval cannot return it; attribution and consolidation cannot inspect vanished
child evidence; ordinary presentation cannot display it as remembered content.
History, source provenance and trace cannot resolve discarded samples.

Same-instant logical formation grants no implicit transient post-encoding access.
Ordinary-memory consumers use reconciled retained state at their authorized read point.
An earlier draft's same-instant positive-formation proposal must not be treated as
an unconditional read capability. Any future cognition using formed-but-not-yet-retained
content requires a separately reviewed transient-access seam.

Later consolidation therefore needs the appropriate surviving target, not simply
proof that it once formed. This ruling does not reopen attribution's evidence requirement
or let supported attribution resurrect a lost operand.

## Minimum governed history

The eventual bounded disposition may record acquisition identity, source selection,
original acquisition time, kind and complete-loss status. These are semantic requirements,
not an allocated record layout. Forgotten evidence payloads must not be retained in
that governance record. No unbounded tombstone set or background evidence dictionary
is authorized. Richer diagnostic/test traces are bounded research instrumentation,
never character-side sample resolvers; their exact retention/persistence treatment
remains part of whole-profile closure.

Idempotency must distinguish a previously formed-and-lost acquisition from a source
that never formed. Identity non-reuse persists after complete loss. Current inventory
counts surviving acquisitions/units, not all historical formation occurrences.
Immediately lost acquisitions do not automatically create presentation history,
recollection, gameplay memory notifications or additional retention credit.

## Four required public branches — frozen, not passed

| Branch | Historical acquisition | Loss disposition | Current target |
|---|---|---|---|
| Positive formation with survivor | Yes | As applicable | Yes |
| Positive formation with first-barrier total loss | Yes | Explicit complete loss | No |
| No qualifying formation | No new acquisition | No acquisition loss fabricated | No new target |
| Actual settlement failure | No new committed acquisition | No new committed loss | Prior committed state preserved |

The last row preserves old state/history rather than erasing earlier acquisitions.
Tests must distinguish all four branches, including allocator/output/queue rollback,
source replay after total loss and prohibition on removed-content reads.

## Next integration work

Compose the accepted recency and fragmentation components with phase130 candidate
evidence and phase140 formation/loss reconciliation. Declare payload-free loss history,
bounded replay metadata, surviving-state reads and auxiliary-family effects. The older
phase130 full-evidence draft is not proof that rich history can be retained indefinitely.
Recompute exact output/state/work bounds after the carrier and trace disposition close.

Existing16 recency/fragmentation tests and six recency source faults remain component
evidence only; they do not pass these public branches. Acquired-protection comparison
remains mandatory. General Attention stays OPEN; accepted historical models remain
unchanged.
