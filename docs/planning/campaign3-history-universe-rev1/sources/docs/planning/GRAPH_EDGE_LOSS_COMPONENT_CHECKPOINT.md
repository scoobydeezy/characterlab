# Explicit graph edge-loss checkpoint

2026-09-12. Implements [graph-edge-loss-component/0.1-candidate](../formal/GRAPH_EDGE_LOSS_COMPONENT.md)
under the accepted directed-edge ruling. [17 tests pass](GRAPH_EDGE_LOSS_TESTS_REV1.json),
including seven new EL cases, seven zero-state cases and three scarcity distinctions.

EL-A proves coordinated loss is necessary for the supplied node-pressure graph.
EL-B/C protect independent directions and both resource bounds. EL-D demonstrates
empty results under either zero capacity with explicit complete loss. EL-E rejects
invalid addresses, EL-F protects order independence/detachment and unchanged input
on failure, and EL-G separates equal slot cost from unequal weight.

[Six actual source mutations](GRAPH_EDGE_LOSS_REVIEW_REV1.json) are detected:
ignoring either capacity, deleting the reverse edge, leaving the selected edge,
accepting duplicate addresses and using weight thresholds as slot cost. Source files
were not modified by mutation runs.

The component applies supplied plans and rejects insufficient ones. It neither chooses
victims nor claims that rejection is a public forgetting policy. Pure input preservation
is not scheduler rollback proof. No new allocation, public schema/model, graph-owner
activation or corpus promotion occurred. Victim selection is the next decision.
