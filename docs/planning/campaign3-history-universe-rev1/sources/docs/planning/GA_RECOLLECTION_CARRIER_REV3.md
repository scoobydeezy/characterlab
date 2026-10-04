# Recollection carrier reconciliation — revision 3

2026-09-13. LOCAL DISPOSITION — no owner ruling required. Symbolic successor to the
earlier visual-only wrapper inventory, not public shape acceptance or allocation.

The old draft still addressed episodes/presentations/scores by SelectionOccurrenceId,
retained an insert-only Encoding envelope, and bounded winners at2. Those choices are
superseded by the accepted acquisition identity and per-kind retention/retrieval rulings.
They cannot be copied unchanged into the current public implementation.

## Exact projection

Propose RecalledAcquisitionEvidence with Acquisition, Observer, At, SourceSelection,
TransformationVersion and Content. Content reuses the positive event/body content
shapes from the surviving-child inventory. It contains only the actually recalled
surviving children. It is a projection of current retained content, not reuse of the
initial AcquisitionFormationEvidence output as a second archive. No new acquisition
is allocated by recall, and no protection or significance metadata is exposed as a
recollection payload merely because it resides beside that content in memory.

An EventRecallWinner contains Evidence plus the actual final Score. A BodyRecallWinner
contains Evidence only: direct signal/acquisition-recency recall does not manufacture
a numeric score, visual strength, graph node or physical estimate to fit event recall.
Both require matching kind and exact surviving evidence/header bytes from admitted
owner reads. The event ranking result can retain bounded score diagnostics trace-side;
those diagnostics cannot carry unselected acquisitions into the recollection consumer.

The first rules recall acquisitions, not just cue-matching children. In particular a
body cue for alpha recalls every still-surviving group in a winning acquisition,
including co-acquired beta. “Surviving subset” means the subset left after actual
forgetting relative to initial formation; it does not introduce a new within-acquisition
recall filter. Group-local body recall remains the separately deferred comparator.

The common emitted Recollection record owns one separately allocated recollection
occurrence, qualified Subject, actual recall At and closed Event/Body winner content.
Each emitted occurrence refers to one recalled acquisition with its selected surviving
child subset. Acquisition time remains in Evidence.At; recalling never changes it.
Subject is checked against actual PRJ/IDN and the source observer before any owner read.
Output schema/version and producer roles still require exact successor registration.

## History and independent resources

PresentationEntry now uses Acquisition, not Selection, with actual admitted presentation
instants. Complete acquisition loss removes its presentation entry; partial child loss
does not create a fresh acquisition or reset time. No source-to-old-payload resolver
is introduced. The first bounded source permits at most32 acquisitions and at most32
actual presentation instants per surviving entry. Extra presentation demand rejects
under the committed finite profile; no rollover or silent truncation is inferred.

Presentation history is an existing separately owned episodic metadata mechanism.
It is not use protection or outcome significance. A cue, rank evaluation, baseline
read or unavailable recall does not automatically append a presentation. Only the
separately authenticated actual recollection/presentation path supplies it. Body
recency ranking does not consult presentation history in this first model.
The first body profile also does not seed or append body presentation history by
implication. That comparator still owes its exact seed/use producer contract. The
current presentation owner is event-only; a Body recollection does not grant it a write.

Independent graph state survives episodic loss according to its own accepted bounds
and weakening rule. Direct episodic cue matching does not require graph membership.
Removing a presentation entry must not erase a graph node; graph normalization never
recreates a lost acquisition. The earlier score/graph/history mathematical controls
remain explicit alternatives under their already recorded scopes.

## Bounds and output closure

Set the first public structural maximum at32 recalled acquisitions per kind, capped
by the total32 retained acquisitions, with separate event/body budgets and no borrowing.
The four-trial attribution witness needs8 event acquisitions and8 body acquisitions;
the older two-winner wrapper cannot express it. A32-element result bound does not mean
every profile grants32 slots: exact model budgets determine actual selection.

At most one recollection output per winning acquisition per recall evaluation, each
with its one new occurrence. Exact output count is winner count; zero winners allocate
none. An emitted event/body winner cannot be counted twice by a wrapper or presentation
owner. Reinforcement input carries only the actual completed emitted recollections,
never the full ledger, ranking diagnostics or a caller-authored acquisition list.

The remaining public gate includes the exact recollection identity allocation, source/
read/output slots, history-owner registration, whole-batch bounds, rollback and restart.
No public verdict follows from the existing component recall arrays. These are local
representation/budget corrections, not a new psychological edge or an owner decision.
