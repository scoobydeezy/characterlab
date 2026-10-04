# Formation protocol transition validation

2026-09-12. `formation-protocol-transition-component/0.1-candidate`.
Component shape accepted by primary-agent self-review under autonomous authorization.
This is exact metadata candidate validation, not public operand authentication.

Consume prior protocol value (domain,successes), incoming qualified source set, current
successful formations, actual owner-provided survivor identities, current instant,
fixed profile bound and proposed next protocol value. Reject extra top-level fields.
Validate prior history against its own prior domain before allowing current enrollment.
Then derive the expected next value using formation-source-domain-component/0.1-candidate
and formation-governance-component/0.1-candidate, with all their finite metadata limits.

Validate candidate metadata independently, canonicalize its sets/rows and compare exact
canonical primitive encoding with the derived value. This internal comparison allocates
no record IDs and is not the proposed public root codec. Reject any mismatch, including
lost enrollment, erased successful mappings, changed original time/identity or survival
disposition inconsistent with the supplied owner result. Candidate entry order has no
meaning. No mutation occurs on success or failure.

Generic path ownership cannot establish these transition invariants: an authorized set
operation could otherwise replace a valid leaf with an empty one. This validator protects
the specified relation only. Upstream must independently authenticate incoming sources,
prior canonical state, immutable N and the actual complete memory-owner result; arbitrary
caller-supplied survivor identities are not a public authority. Canonical persistence,
whole-instant rollback and public registration remain separate qualification gates.
