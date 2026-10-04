# Zero-state normalization checkpoint

[Five source mutations](GRAPH_ZERO_STATE_REVIEW_REV1.json) are detected by named GZ
witnesses: ignoring incoming edges, requiring both directions, epsilon removal,
retaining empty membership and reweighting survivors. Production source was unchanged.

2026-09-12. Implements
[graph-zero-state-component/0.1-candidate](../formal/GRAPH_ZERO_STATE_COMPONENT.md)
under the [accepted normalization ruling](GENERAL_ATTENTION_GRAPH_ORPHAN_RESOLUTION.md).

[Fifteen tests pass](GRAPH_ZERO_STATE_TESTS_REV1.json): seven normalization cases plus
eight direct/spread cases. The normalization component preserves either direction of
a positive edge, retains a representable1/100000 weight, removes empty graphs/nodes,
preserves exact surviving weights, is idempotent and does not mutate inputs. Isolated
node removal leaves direct episodic cue contribution unchanged. Invalid lattice,
negative and self-edge values reject through the actual EAM validation path.

GZ-F contrasts an intermediate all-zero value with a final graph containing a later
contribution. It demonstrates why the input must be the fully reconciled graph, but
does not prove public scheduling or sibling admission. The pure function has no owner,
timestamp, history, occurrence allocation or read-time maintenance behavior.

This is structural normalization, not positive-edge forgetting or cognitive graph
scarcity. No node-local state is accepted; a future such field requires revisiting
the predicate. Permanent allocations, public graph codecs, resource/pruning policy,
same-barrier owner composition and replay/persistence remain open. General Attention
and acquired-protection comparison remain unresolved.
