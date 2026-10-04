# Direct episodic cue matching versus learned graph membership

2026-09-12. **ARCHITECTURAL DECISION REQUIRED before graph orphan policy.** Independent
bounded graph lifecycle is accepted and is not reopened. This packet identifies a
cue-path coupling exposed by that independence.

## Inspection and implemented read-only composition

The old EAM ranker rejects retained keys missing from its supplied activation map.
[Independent membership access](../formal/INDEPENDENT_ASSOCIATION_ACCESS_COMPONENT.md)
now explicitly supplies zero graph contribution for episodic-only keys without
inserting persistent nodes, changing the original ranker or shrinking the averaging
denominator. Five new component tests pass; the four existing association/episode
comparisons still pass. This adapter receives already computed graph activation,
not raw cue evidence; it does not decide an independent direct cue contribution.

The graph activation law is `a=(I-beta W)^-1 b`. Even with W=0, a=b. Therefore a
node's presence can carry direct cue input to retrieval without any learned edge.
An orphan node is not necessarily behaviorally inert under the existing draft path.
The new accepted ruling explicitly leaves orphan handling open; pruning cannot be
chosen on the assumption that zero edges imply zero retrieval influence.

## Executed counterexample

[Eleven combined tests pass](ASSOCIATION_ORPHAN_CUE_TESTS_REV1.json), including two
new orphan-cue cases using actual spreading and ranking kernels. An old retained
acquisition containing a has base accessibility1/2; a newer c acquisition has base1.
An isolated graph node a with raw cue1 yields activation1 despite having no edges.
Keeping it ranks the old cued acquisition first (score3/2). Removing it and supplying
zero graph contribution ranks the newer other acquisition first (score1). At cue0,
keeping/removing the isolated node is score-equivalent.

Both episodic acquisitions and their content remain unchanged. Thus graph pruning
currently changes direct cue response as well as learned structure. These are supplied
component cues, not authenticated public observations or qualified memory behavior.

## Alternatives

**A — direct matching independent of persistent graph membership (recommended).**
A lawful current cue matching a surviving episodic semantic key can contribute to
retrieval even if that key has no learned graph node. Learned spreading remains an
independent contribution/path; graph-only nodes may mediate influence but create no
episode target. Direct matching must still consume actual admitted cue evidence,
never a guessed key, hidden truth or forgotten source payload.

One candidate implementation is a bounded read-only working domain over graph keys
plus current retained keys, with missing graph keys represented as isolated working
vertices for cue injection. Those are computational values, not learned nodes, stored
state or another identity allocation. Exact cue weighting and no-double-counting of
direct activation must be reviewed before implementation; adding b twice to the old
total activation is not authorized. Other equivalent factorizations remain possible.

A would let orphan lifecycle decisions govern learned graph storage without silently
removing direct matching to an otherwise surviving episode. It does not itself choose
immediate orphan removal, graph capacity, edge pruning or a new importance law.

**B — learned node membership gates direct cue contribution in the first model.**
A retained episodic key absent from the graph receives only nongraph accessibility
until a graph node is lawfully learned again. This preserves the current draft cue
path's coupling but makes node retention part of the cue-matching mechanism. Isolated
nodes can have functional value and their eviction requires a behavioral policy.
Record this as a specific control hypothesis rather than generic cleanup.

Both admit all four episodic/graph membership states. The distinction is whether a
current cue can directly match episodic-only content, not whether that content exists.
Neither permits episode manufacture, source lookup, hidden payload retention or
episodic loss automatically deleting learned state.

## Recommendation and next steps

Choose A to preserve current episodic evidence and learned structure as separately
intervenable paths. Freeze the exact direct/spread composition with no double counting,
then finish independent node/edge capacity and orphan semantics. B remains a named
simpler coupled control. This decision is necessary before using zero-degree pruning
as supposedly neutral graph maintenance.

No public cue schema, graph resource law, permanent number or model changes have been
made. General Attention remains OPEN; acquired-protection comparison remains mandatory.
