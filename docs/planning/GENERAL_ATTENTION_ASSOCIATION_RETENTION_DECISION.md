# Learned associations after episodic unit loss

2026-09-12. **ARCHITECTURAL DECISION REQUIRED.** This concerns the event/continuant
association graph. It does not reopen body partitions or authorize a body graph.

## Substrate conflict exposed by fragmentation

The earlier [visual retention draft](ATTENTION_MEMORY_RETENTION_REVIEW_REV1.md) makes
graph nodes exactly the union of retained continuant files. That draft predates
fragmentation. Maintaining its equality after a file's final episodic unit is lost
would remove that node and its learned edges. Keeping the edges requires an explicitly
independent bounded graph lifecycle. Neither follows mechanically from unit loss.

Architecture8 distinguishes surviving episodic imprints from learned associations,
expectations and familiarity. It allows familiarity without recalling a specific
episode. MEC-008 preserves learned association update and its sole authority; MEC-009
preserves spreading/accessibility comparisons. Their accepted math does not specify
graph-node eviction after episodic loss. Recency retention selects episodic units,
not association nodes, and the new per-kind ruling forbids unbounded background escapes.

## Measured distinction

[Four component tests pass](RETENTION_ASSOCIATION_BOUNDARY_TESTS_REV2.json) using the
actual fragmentation, spreading-activation and retrieval kernels. The earlier three-
case receipt is preserved as revision1; revision2 adds the two-acquisition ranking case.

Initially an acquisition contains a and b. Fragmentation removes b and retains a.
The learned graph has symmetric a↔b weight1/2. A newly supplied cue activates b;
with spreading beta1/2, a's exact activation is4/15. Pruning b leaves a at0.
With another surviving acquisition containing c and cue activation1/10 at c, keeping
the learned edge ranks the a-acquisition above c; pruning ranks c above a. Both
candidates survive in the top-two set; the witnessed change is ranking order, not
an exclusion or an implemented action choice. Quantization uses the tested1000 scale.

The removed b evidence bytes are absent from the retained acquisition in both
conditions. A graph with no surviving episodes returns no episode target despite
nonzero activation. Removing the edge eliminates the a-activation difference.
Thus learned influence can survive without reconstructing forgotten sample bytes.

These are supplied component operands and competing hypotheses, not an authenticated
public cue/formation experiment. Equal continuant keys are assumed to come from
lawful tracking; no truth join is licensed. No public forgetting, familiarity or
General Attention verdict follows from this comparison.

## Alternatives

**A — independently bounded learned graph (recommended).** Episodic fragmentation
removes episode content and recall targets without automatically deleting learned
association nodes/weights. Replace the old draft equality with an explicit bounded
association-state lifecycle under its existing sole authority. The graph stores only
its declared learned structure, not observation payloads or a source resolver. A node
does not imply an episode exists. Independent node/edge capacity, pruning, update and
accessor rules must be specified before public implementation; an ever-growing graph
or merely rejecting long valid histories is not a solution.

A preserves the ability to study learned influence without episodic recall. Its cost
is an explicit association resource contract and the need to distinguish forgetting
of an episode from loss of a learned edge. No body↔visual conversion, common importance
scale or new cross-kind consolidated representation is introduced.

**B — graph projected to surviving episodic files in the first control.** Whenever
fragmentation removes the last current reference to a file, remove its node and
incident edges through the association owner. Preserve surviving edge weights without
renormalizing them merely to fill freed row mass. This is an explicit coupled-loss
hypothesis, not neutral cleanup. It keeps a simpler bounded support domain but removes
learned influence when episodic support disappears; the independent graph remains
a required alternative for phenomena demanding familiarity without episodic recall.

B also needs exact ordering for same-barrier association updates and projected loss,
and must not erase a shared file while another acquisition still retains it. Neither
alternative can write graph state from the episodic owner or violate common-B0
reconciliation. Both require correct-forward revisions to the unaccepted draft.

## Recommendation and next work

Choose A and preserve B as a named simpler comparator. The ranking witness shows
that automatically pruning the graph would commit to a behavioral reduction not
earned by the episodic retention ruling. Conversely, keeping it without a bound would
violate the explicit resource rule. The decision authorizes the independent domain,
not a particular node-eviction law or unbounded capacity.

After the ruling, close its bounded state/pruning contract and association/episode
cross-invariants, then return to history, presentation and ordinary read integration.
Acquired-protection comparison remains mandatory. General Attention stays OPEN;
no permanent allocation or public model changes occur in this packet.
