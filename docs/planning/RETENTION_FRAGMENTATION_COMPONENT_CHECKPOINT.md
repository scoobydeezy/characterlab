# Retention fragmentation mechanics checkpoint

Follow-up adversarial review: [seven source faults detected](RETENTION_FRAGMENTATION_REVIEW_REV1.json)
by named RF witnesses. This strengthens loss-mechanics coverage only; the
[survival-priority decision](GENERAL_ATTENTION_RETENTION_PRIORITY_DECISION.md) remains open.

2026-09-12. Implements
[retention-fragmentation-component/0.1-candidate](../formal/RETENTION_FRAGMENTATION_COMPONENT.md)
in [the pure component](../../src/campaign3/retentionFragmentation.ts).

[Eight tests pass](RETENTION_FRAGMENTATION_TESTS_REV1.json): partial survival with
exact multi-view content, final-unit removal, per-semantic-unit cost, independent
kind capacity, detached outputs, invalid loss rejection, malformed input rejection,
and order-independent application of the same loss set. Both acquisition kinds can
partially survive. No fragment or replacement acquisition identity is allocated.

This component takes an explicit loss plan, not an importance score. Insufficient
loss rejects the plan; that rejection does not model forgetting or qualify pressure.
An eventual survival policy must produce an adequate plan for valid admitted cognitive
pressure. Its evidence basis and ranking remain unchosen. Component byte arrays and
symbols are not public authenticated sample carriers or allocated identity encodings.

The returned object contains only current survivors and per-kind usage, not removed
content or a history resolver. Input immutability is normal pure-function behavior,
not permission for an owner to keep the old input as a hidden cognitive archive.
Public state replacement, history governance, read authorization, reconciliation,
graph/presentation effects and replay after pruning remain unqualified.

The first source implementation is deliberately limited to applying a supplied plan.
It establishes no eviction priority, acquired importance, semantic reconstruction,
within-unit degradation, public forgetting or General Attention completion. Next:
the within-kind survival policy and its legitimate evidence operands, followed by
integration with the ordinary-memory owner and public source.
