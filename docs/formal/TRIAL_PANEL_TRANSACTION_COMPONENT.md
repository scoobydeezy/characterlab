# Trial panel transaction preparation

`trial-panel-transaction-component/0.1-candidate`, 2026-09-13. Local representation
and atomic composition step; existing perception and fallback semantics unchanged.

Prepare performs the actual panel/visual event-file operation on a detached candidate.
It returns a detached result plus commit/close capabilities. Commit succeeds once,
only if the original token still holds the exact state from which preparation began.
Close discards the candidate. Failure and stale commits leave current state unchanged.
These capabilities are transaction-local, not canonical identities, restoration
permissions or content-authored callbacks. The enclosing whole-instant transaction
still owns allocator, other state roots and output rollback. No persistence claim.

Direct consumption also detaches its returned context/transition before release.
Mutating a returned observer event-file identity cannot alter the owner's retained
window. This corrects an object alias; no canonical output value or tracking law changes.
