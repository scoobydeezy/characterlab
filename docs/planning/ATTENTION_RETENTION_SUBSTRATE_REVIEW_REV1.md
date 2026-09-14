# Retention substrate and surviving-content boundary

2026-09-12. Primary-agent inspection beneath the accepted
[per-kind retention ruling](GENERAL_ATTENTION_RETENTION_SCOPE_RESOLUTION.md).
No retention mechanism, numeric allocation or public implementation is accepted here.

## Actual available mechanisms

`reference/src/model/memory.ts` explicitly defers literal remembered-content rewriting.
`addMemory` appends a complete immutable episode; `retrieveTopK` scores episodes and
appends retrieval times for winners. It neither fragments nor deletes an episode.
Historical concept salience records encoding centrality for downstream referent
weighting, not a qualified retention priority. No historical forgetting mechanism
is available to port merely by importing this file.

`src/campaign3/encodingAccessMath.ts` provides encoding response/budget comparisons,
association updates, spreading activation, presentation accessibility and read-only
ranking. None supplies a retention eviction rule. Current access score depends on
cue activation and presentation history; treating it as importance would violate
the accepted first-model exclusion. Encoding strength also needs an explicit new
retention hypothesis before it can determine deletion.

The visual memory draft uses an insert-only four-acquisition experiment horizon.
Its graph is defined over the union of retained continuant files, and presentations
correspond to retained acquisitions. These are draft invariants, not proof of
forgetting. Removing an acquisition or unit requires a new explicit disposition for
its presentation metadata and learned graph contribution. A graph retaining a
learned association is not necessarily an observation archive, but it must have a
declared bounded lifecycle and cannot reconstruct omitted sample payloads by lookup.

The body proposal preserves exact multiple views inside each selected signal group.
There is no accepted body encoding-strength or importance field. Sample count, bin
width, pressure and physical reserve identity are not substitute retention priorities.

MEC-010 remains CONTROL+CORPUS for accessibility and reinforcement. MEC-007 and
CTL-004 retain encoding-factor comparisons; their inputs are not silently promoted
to retention semantics. SUB-003 and SUB-011 preserve identity and correct-forward
history. The historical source is read-only and no module is imported into src.

## Initial history versus current surviving memory

Identity B and lifecycle B require immutable historical initial encoding. They do
not require the full original payload to remain character-readable forever.
The future owner must distinguish:

| Surface | Permitted role |
|---|---|
| Original committed acquisition output / historical trace | Exact historical evidence of initial encoding; not a character sample resolver |
| Current subject-owned surviving acquisition | Only retained content currently authorized for ordinary memory reads |
| Retention/consolidation history | Declared bounded provenance of changes; no hidden copy of removed content |
| Recollection output | Authorized reconstruction from surviving content/context, not retrieval of the original trace |

An implementation that stores a full original payload beside a survivor mask in
character-readable storage has not established forgetting. Actual read-domain closure
must exclude the original archive and ensure removed bytes are unavailable through
source IDs, acquisition IDs, trace, pending work or auxiliary state. Historical replay
may reconstruct committed transitions for validation; it cannot expose replay inputs
as a cognitive evidence store.

The first ordinary-memory state therefore cannot simply preserve its full initial
carrier as the sole permanent owner-readable entry. The
[carrier draft](ATTENTION_ACQUISITION_CARRIER_DRAFT_REV1.md)'s lossless initial storage
description applies at formation. Later current-state shape depends on the accepted
loss operation. This is a forward refinement; earlier draft and receipt bytes remain
unchanged. New retention history must not allocate another acquisition identity.

## Two expressible loss operations, not yet selected

Whole-acquisition retirement removes all child content and its individual recall
target together. It is simple and can demonstrate real loss but cannot demonstrate
survival of an acquisition's core while a peripheral member disappears.

Unit-level fragmentation removes complete retained child units while preserving
the acquisition identity for a nonempty surviving subset. The event unit can use
the existing event-file/continuant-file AttentionUnitKey; the body unit can use the
accepted InteroceptiveSignalId group address. This introduces no per-fragment occurrence
family. Removing individual views from a body group is a different hypothesis: it
could discard contradictory evidence while preserving a misleadingly narrower basis.
The existing acquisition bound rejects accidental view truncation; it does not
automatically authorize view-level forgetting.

Fragmentation alone does not choose which unit loses, define psychological importance,
or create semantic background knowledge. It also needs a capacity measure capable
of rewarding removal of a unit. A pure acquisition-count budget frees no capacity
when an acquisition loses only one of several members. Keeping the same count budget
while calling partial deletion a scarcity response would leave the accounting open.

## Architectural choice before exact policy

The [retention loss-unit packet](GENERAL_ATTENTION_RETENTION_LOSS_UNIT_DECISION.md)
asks whether the first profile should begin with whole-acquisition retirement or
complete-child-unit fragmentation. This determines both state/read shape and the
meaning of the per-kind capacity. It cannot be hidden inside a list maximum.
After that ruling, exact within-kind priority, tie handling, treatment of new content,
auxiliary-family cleanup and bounded replay history still require a falsifiable law.

This review is source inspection and causal analysis, not executed retention proof.
Earlier six scheduler tests remain append-only fixture evidence; no General Attention
or public retention verdict is advanced.
