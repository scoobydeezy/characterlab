# Separate recall partition checkpoint

2026-09-12. [Eight combined tests pass](RECALL_PARTITIONS_TESTS_REV1.json), including
six partition cases and two earlier mixed-budget distinctions. Implements
[recall-partitions-component/0.1-candidate](../formal/RECALL_PARTITIONS_COMPONENT.md)
under [accepted A](GENERAL_ATTENTION_RETRIEVAL_PARTITION_RESOLUTION.md).

Both kinds face actual within-kind slot contention. Opposite-kind additions preserve
fixed selected prefixes; unused/zero capacity does not transfer. Original within-kind
ordering is preserved, identities cannot duplicate across partitions, and detached
typed results contain no common score field. No body ranking law is implemented.

These are supplied-ranked-identity tests, not public remembered-content reads or
workspace admission. Exact body cue/accessibility needs the
[next decision](GENERAL_ATTENTION_BODY_RECALL_LAW_DECISION.md). Public identity/source
roles, presentation and persistence remain open; no allocation was performed.
