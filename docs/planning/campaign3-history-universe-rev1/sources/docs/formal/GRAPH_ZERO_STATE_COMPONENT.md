# Graph zero-state normalization component

2026-09-12. `graph-zero-state-component/0.1-candidate`.
**Component shape accepted by primary-agent review under autonomous authorization.**
Consumes the accepted structural normalization ruling. No graph scarcity law or
public lifecycle is implemented.

Input is a fully reconciled graph: distinct nonempty NFC component keys, square
nonnegative zero-diagonal row-substochastic weights on positive integer scale D,
bounded by the existing EAM32-key domain. There is no node-local learned payload.
Reuse the actual EAM association operator with zero learning/decay/elapsed as an
identity validation/detachment operation. This is pure computation, not a learned
update, event, output occurrence or persistent timestamp change.

Keep index i iff at least one weight in row i OR column i is exactly nonzero. Return
the induced submatrix and corresponding keys in input order. All surviving values
remain exact; no row renormalization, threshold, reweighting or fresh identity occurs.
Output arrays and rational values are detached/immutable. Empty input/all-zero graph
normalizes to empty arrays. No removed-node history or timestamp is synthesized.

The public owner must invoke this only after its complete resolved batch, not after
individual sibling operations or on reads. The component accepts a graph value and
cannot authenticate that timing. Node-local state in a future schema requires a new
predicate/contract; the current input shape must not silently drop such state.

Required checks: incoming/outgoing asymmetry, smallest representable nonzero edge,
empty graph, exact survivor submatrix, idempotence, direct-cue invariance, final
batch versus unsafe intermediate normalization, and lattice validation. No cognitive
positive-edge loss, graph capacity or public persistence verdict follows.
