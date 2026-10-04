# Separate recall partitions component

2026-09-12. `recall-partitions-component/0.1-candidate`. Component shape accepted
by primary-agent self-review under autonomous authorization; no public activation.

Consume independently ranked lists of retained acquisition identities, one per kind,
with independent integer slot bounds0..32. Each list is dense, at most32 entries;
IDs are nonnegative opaque component ordinals and globally unique across both lists.
These are component safety bounds, not accepted public profile values. Kind and ID
admission plus actual retained-target validation remain upstream obligations.

Return each list's prefix under its own bound, detached and frozen. No borrowing,
common sorting, score comparison, post-result cross-kind feedback or merged ranking.
Order is supplied by each kind's independently accepted law, not identity magnitude.
Zero slots yields an empty result, not rejection. Exceeding a cognitive slot bound
selects a prefix; exceeding the separate input safety domain rejects.

Output names preserve kind. They are candidate read identities, not a common workspace
admission, conscious presentation, evidence payload or retrieval-success occurrence.
Neither identity-only list proves source authentication, remembered content retrieval,
body scoring or public allocation. Typed public wrappers remain whole-shape work.
