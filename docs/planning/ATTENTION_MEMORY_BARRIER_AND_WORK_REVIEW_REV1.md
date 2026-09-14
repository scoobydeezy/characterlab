# Attention memory barrier correction and combined work envelope

2026-09-12. Correct-forward draft revision after actual scheduler inspection. No frozen
contract or production source changed. Whole public shape remains unaccepted.

## Real integration blocker and correction

When adaptationSettlement is installed, the actual scheduler prepares every phase140
event already queued for the instant as one exclusive batch. It rejects any child
emission from a batch member and rejects residual same-instant work after batch finish.
The earlier draft form→associate→seed-presentation chain cannot run under that barrier.
Using the generic scheduler without the barrier would not prove the composed profile.

Replace that draft chain with retention130 emitting three phase140 terminal siblings:
form, associate and seed-presentation. All carry the same exact FormationInput and
actual retention parent. Retention emits either all three or none. Each sibling is
admitted before its own PRJ/IDN and owner-leaf read. The barrier preflights all members
against the same B0, obtains disjoint owned candidates, and combines their patches.
Each candidate uses the actual retained encoding and its own old leaf; none needs to
read another sibling's provisional state. Association expands its prior graph from
the retained units; presentation seeds from the same retained selection/time.

No sibling emits a child, writes another authority's leaf, or allocates a void result
occurrence. Standard reads, patches and final structural diffs remain separately
traceable. Cross-leaf consistency is checked on the combined candidate before commit;
failure discards all candidates. This is not three independently committed updates.
Reinforcement is a separate one-member terminal batch on cue instants.

This supersedes the child edges in the earlier stage inventory and its longest-path
counting method. The local event/output/allocation totals remain unchanged: three
writers still execute, and retention now allocates their scheduler events directly.
Their causal parent lists deliberately change to the common retention event. No
claim is made that old and revised future traces are byte-identical.

## Actual scheduler evidence

[Four fixture tests](ATTENTION_MEMORY_BARRIER_TESTS_REV1.json) pass. AMB-A executes the
old chain with the actual barrier and observes terminal-emission rejection plus whole
rollback. AMB-B executes three siblings with a common actual parent and identical B0
reads. AMB-C reverses sibling emission order and obtains the same combined fixture
state. AMB-D fails after all candidates were evaluated and preserves state, pending
queue, outputs, trace, clock and runtime allocator.

These use fixture integer leaves and a trusted test adapter. They prove scheduler
expressibility, not public owner roles, canonical patches, PRJ, complete-parent input
authentication or memory mathematics. Test allocations exercise allocator rollback;
they are not proposed domain allocations. Public barrier controls remain pending.

## Complete proposed fixture envelope

Preserving the existing probe/carriage/memory/prediction/task composition gives this
source accounting for the proposed fixed-time fixture:

| Instant | Executed stages | Event count | Runtime slots, upper bound |
| --- | --- | ---: | ---: |
| 0 | probe110; observation120; tracking121; binding122; classification123; freeze124; evaluation130; evidence130; intake130; M1 evidence130; measurement formation140; prediction application140; task settlement140 | 13 | 7 |
| 1 | measurement recall20; prediction read40; workspace40; appraisal50; concern50 | 5 | 5 |
| 2..9 | up to four formation and four cue instants, each including its generated delivery15 | 120 total maximum | 140 total maximum |
| 20 | preserved task deadline140 | 1 | 0 |

The source13 includes the actual EVID pair on the permitted branch, or its existing
padding alternatives. Denial does not permit pruning memory/prediction/task padding
or their scheduled future read slots. The permitted source emits at most seven
top-level outputs at0 and five at1. Source deadline emits no semantic occurrence.
The source's existing private padding slots remain intact; the new attention writers
do not inherit those conventions merely by composing with the source.

Thus the proposed four-formation/four-cue envelope is at most139 executed events,
172 top-level output records and152 shared-runtime allocations over the drained run.
No single instant exceeds16 events under the fixed separation above. These are
symbolic upper bounds, not a qualified MaxSettlementWork or an exact model commitment.
The deadline and future reads cannot be omitted from save/restore or drained-run counts.

Source instant0 retains its existing common-B0 measurement/prediction/task barrier.
Attention formation instants use the new exact three-member barrier; cue instants use
the one-member reinforcement barrier; deadline20 uses its task barrier. The successor
must dispatch these explicitly and reject mixed batches. Do not install the current
Campaign2 task dispatcher unchanged: its accepted membership checks do not admit
these new attention writers. No phase140 dispatch bypass is proposed.

## Remaining review

The accompanying machine packet freezes the draft edge correction and arithmetic,
with source fingerprints. It does not freeze schemas or numeric allocations. Next
is the exact finite registration layer: input/output records, identity roles, required
projections, read/write domains, batch membership, and terminal-at-concern dispatch.
The source profile and full model must still make the stated instant separation and
all cardinality restrictions enforceable. General attention and corpus remain open.
