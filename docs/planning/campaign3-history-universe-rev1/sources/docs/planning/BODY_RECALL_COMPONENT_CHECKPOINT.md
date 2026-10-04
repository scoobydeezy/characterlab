# Body recall baseline checkpoint

2026-09-12. Implements [body-recall-recency-component/0.1-candidate](../formal/BODY_RECALL_RECENCY_COMPONENT.md)
under the [accepted A law](GENERAL_ATTENTION_BODY_RECALL_LAW_RESOLUTION.md).
[Fourteen combined tests pass](BODY_RECALL_TESTS_REV1.json): eight body cases plus
six partition cases. [Five actual source faults](BODY_RECALL_REVIEW_REV1.json) are
detected: oldest-first, self-cue, reversed tie, refreshed time and group-only recall.

Older eligible acquisitions remain retained while losing recall slots. Additional
groups/views supply no advantage. Co-acquired surviving groups are returned at the
acquisition target, removed groups stay absent, original time is preserved, and
returned byte mutation cannot alter retained memory. Absent and unmatched cues yield
no result; zero slots is ordinary exclusion.

BR-D preserves zero-valued retained bytes; it does not prove a public numeric-zero
observation produces a cue. The component accepts supplied cue identities. That missing
producer now requires the [source-coupling decision](GENERAL_ATTENTION_BODY_CUE_SOURCE_DECISION.md).
Public observer/source admission, read-only facade, acquisition result codecs,
persistence and corpus qualification remain open. No allocation or public activation.
