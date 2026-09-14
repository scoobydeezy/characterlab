# Directed graph loss component

`graph-edge-loss-component/0.1-candidate`, 2026-09-12.
Component shape accepted by primary-agent review under autonomous authorization.
Consumes the supplied directed-edge ruling; does not choose victims.

Input: complete resolved graph in graph-zero-state-component/0.1-candidate's domain,
positive lattice scale, explicit unique directed source/target semantic-key addresses,
and separate integer capacities nodes 0..32 and edges 0..992. These maxima are component
safety bounds, not accepted cognitive parameter values. No AssociationEdgeId exists.
Each address must name an actually positive entry; duplicate, absent, zero or self
edge loss rejects. Plans are bounded at 992 entries. Endpoint strings identify the
existing matrix row and column; no new causal interpretation of matrix direction.

Validate/detach via the existing zero-state component, set only selected weights to
zero, then normalize structural emptiness. Initial removal of already empty structure
is pure input normalization after the supplied resolved batch, not intermediate
learning reconciliation. Preserve every surviving exact weight. Count one slot per
positive directed entry and one per incident node. Both capacities must hold, otherwise
reject the insufficient supplied plan. No fallback node deletion or extra edge loss.

Return detached immutable keys, weights and resource counts only. No lost weights,
payload archive, timestamp, occurrence identity or hidden priority is returned.
Input remains unchanged on success or rejection. Permuting a valid loss plan preserves
the output. Reapplying old loss addresses rejects because they no longer name positive
edges; public replay/idempotency must be handled by the owner transaction contract.

This is plan application and validation, not a scarcity planner. Rejecting an insufficient
plan is not a modeled public forgetting result: the eventual planner must construct
a legal plan for the complete admitted batch before one owner commit. Public learning
admission, rollback, same-barrier order, persistence and victim selection remain open.
