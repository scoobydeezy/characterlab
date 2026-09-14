# Bounded acquisition governance history

2026-09-12. **DECISION REQUIRED.** Memory content scarcity and nonreuse are settled;
the long-lived representation of source admission history is not. This blocks complete
public state/persistence shape, not the qualified selector or scheduler components.

## Inspection

Accepted same-barrier formation/loss requires source replay exclusion even after final
child loss and distinguishes previously formed sources from ones that never formed.
It prohibits forgotten payload archives and unbounded tombstone sets. The current
retention fixture stores at most eight payload-free history rows, then rejects further
formation: that is a fixture safety bound, not a public lifetime protocol. The older
public draft has no such governance carrier and cannot be promoted unchanged.

Acquisition allocation prevents ID reuse, not source replay. Source identity magnitude
is opaque and cannot silently become a finalization order. The
[successor inspection](ATTENTION_MEMORY_STATE_SUCCESSOR_REV2.json) includes an exact
counterexample: formed-source sets {2} and {1,2} share maximum2 but differ on source1.
A scalar maximum cannot preserve arbitrary exact membership. An accumulator/hash alone
likewise supplies no membership answers without retained witnesses or a protocol.

## Alternatives

**A — exact payload-free history within a declared bounded run (recommended first).**
Commit a finite maximum on admitted formation opportunities for the profile/run,
separate from cognitive capacities. Retain exact qualified source → acquisition/time/
kind/disposition metadata for successfully formed acquisitions through that run,
including after complete loss. No child samples, graph weights or old encoding factors.
Valid never-formed sources and prior formed sources remain distinguishable within
the accepted run domain. Overflow is a declared admission/lifetime boundary, never
cognitive forgetting, and must not be used as evidence of memory loss.

Specify the bound, how input admission enforces it, and continuation behavior before
public packaging. Canonical save/restore preserves the table; restoring does not reset
its budget or acquire fresh history capacity. No rollover clears replay protection.
Finite-run qualification must be labeled as such: A does not close lifelong governance
or broad General Attention merely because every bounded fixture completes.

**B — design a governed source-finalization protocol now.** Introduce explicit ordering,
epochs or retirement proofs that permit compacting exact history while defining what
old-source requests can still ask. This requires producer admission, missing/never-formed
dispositions, late delivery, restored continuation and old replay rules. A blanket
rejection of all retired sources is not automatically equivalent to distinguishing
previous formation from no formation; any reduced historical query guarantee must
be accepted explicitly. Do not derive this protocol from opaque source ordinals.

## Recommendation and preserved obligations

A gives the thinnest exact first-profile implementation without a new source protocol.
It keeps governance finite and separate from modeled retention. B is the appropriate
future candidate when arbitrary continuation or history compaction is required, but
its semantics are not implied by the current identity contract.

Neither option permits ordinary cognition to resolve forgotten samples, merges history
with current targets, fabricates presentation for immediately lost acquisitions, reuses
identities or turns a failed settlement into a successful formation. Public proof must
cover formed-and-lost replay, never-formed source, owner isolation, exact restore,
history-capacity admission, and rollback of both content and governance changes.

The choice governs lifetime/admission guarantees and retained state; it is not a codec
implementation detail. No numeric allocation or public history implementation is made.
