# Independent association membership: access composition

2026-09-12. `independent-association-access-component/0.1-candidate`.
**Component shape accepted by primary-agent review under autonomous authorization.**
Consumes the accepted independent graph/episodic membership ruling without changing
encoding-access-math/0.1-candidate or its strict unknown-key rejection.

Inputs are current surviving episode descriptors, a supplied activation map over
current learned graph keys, and the existing EAM ranking parameters/time. Construct
a local map copying graph activation and supplying exact zero for each retained
episode key absent from the graph. Then invoke the actual EAM ranker. Its existing
validation, distinct-key averaging, history semantics and deterministic ranking apply.
Zero means no contribution from this graph, not absent observation, negative evidence,
zero psychological importance or a newly learned node.

Keep every distinct retained key in the episode's averaging denominator. Do not
average over only the intersection with graph membership. Graph-only keys influence
the supplied activation but do not create episode candidates. Keys absent from both
do not enter this operation. Empty graph still permits base-accessibility ranking of
surviving episodes. Empty episode inventory yields no target even with graph activation.

The union of graph and retained keys is bounded by the existing component limit32;
this is a component workload limit, not a public graph-capacity allocation. Inputs
and persistent graph membership are never changed. No sample payload, source lookup,
learning operation or reinforcement occurs. Public authentication of survivor lists,
graph activation and cue projection remains outside this component.

Required checks cover all membership states, unchanged graph map, original retained-
key denominator, empty graph/episode inventory, invalid graph activation and preservation
of the old kernel's rejection when invoked without this explicit composition.
