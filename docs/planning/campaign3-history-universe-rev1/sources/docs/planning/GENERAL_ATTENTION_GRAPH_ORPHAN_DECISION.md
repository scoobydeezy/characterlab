# First graph orphan policy

2026-09-12. **DECISION REQUIRED.** The independent-graph and direct-cue rulings
explicitly left orphan handling uncommitted. The direct/spread composition now lets
this be evaluated without using node retention to preserve direct episodic cueing.

## Inspection scope

The current proposed graph has semantic keys, exact lattice edge weights and a graph
update timestamp. No node-local familiarity, exposure, age, confidence, learned prior
or dormant-state field is accepted. A node with zero incoming AND zero outgoing
nonzero edges therefore has no additional declared learned payload. A zero row alone
is insufficient; a one-way edge can still carry influence through the existing solve.

The [twelve combined tests](ASSOCIATION_ORPHAN_LIFECYCLE_TESTS_REV1.json) include four
new cases: removing a truly isolated node preserves contributions to retained targets,
including direct cues to its still-retained episodic key; a graph-only isolated key
creates no target/influence; removing a zero-row node with an incident edge changes
learned influence and is not equivalent; explicit zero padding at a later supplied
learning-domain extension gives the same update as retaining that zero-state node.

The final case is arithmetic feasibility, not proof of future public reacquisition:
the later evidence must independently admit the semantic key. No source archive or
forgotten payload can restore it. Tests compare retained-target contributions, not
full graph diagnostic rows or state hashes, which legitimately differ on membership.

Separately, [six source mutations](DIRECT_ASSOCIATIVE_ACCESS_REVIEW_REV1.json) were
detected by named DA tests: zero-hop double counting, graph-gated direct matching,
rounded residual, separate rounding, disabled graph-only seeding and creation of
rows for irrelevant cue keys. Production source bytes were not modified by these runs.

## Alternatives

**A — remove structurally empty nodes at graph reconciliation (recommended).** After
the complete admitted learning/weakening/pruning batch is resolved, remove nodes
whose incoming and outgoing weights are all exactly zero and which have no other
declared learned state. Do so through the graph owner, independent of episodic
membership. Preserve surviving weights and timestamp semantics; do not renormalize
remaining weights merely to fill unused mass. Direct episodic matching remains valid.

This is a bounded first-profile graph normalization rule, not a generic claim that
every orphan has no psychological meaning. If a later contract adds node-local
learned state, the predicate must be reconsidered explicitly. A later lawful learning
operation may reintroduce the same semantic key as a zero-initialized node; no new
semantic identity or forgotten evidence is manufactured.

Apply the rule after the declared graph batch, not opportunistically during reads or
between sibling learning contributions. An actually positive edge cannot disappear
through this rule. Exact lattice zero is structural absence; no epsilon threshold
or weak-edge eviction is authorized. Nonzero-edge pruning is a different policy.

**B — retain isolated nodes in a separately bounded dormant inventory.** Give zero-
degree nodes explicit continued membership and charge them to a finite node budget.
The first profile then needs a dormant-node admission/expiry/pruning law. Dormant
membership alone still provides no episode target or forgotten-content resolver.
Do not infer a familiarity prior or long-term importance merely to justify storage.
This option preserves room for future node-local meaning, at the cost of a new
current lifecycle obligation whose behavioral value remains to be demonstrated.

## Recommendation and remaining scope

Choose A for the current graph shape. The direct-cue separation removed the prior
functional reason for keeping isolated nodes; no other node-local state is accepted.
This recommendation does not decide whether high-weight edges survive, which positive
edge to prune under pressure, whether nodes and edges have separate cognitive costs,
or how newly learned edges compete. Those remain the independent scarcity contract.

The decision changes graph storage/admission, so the component equalities are not
themselves a public reduction verdict. Public owner, identity roles, zero-weight codec
normalization, complete-barrier invariance and replay/restore must be proved under
the eventual frozen profile. No numeric allocation or public graph implementation
has occurred. General Attention remains OPEN.
