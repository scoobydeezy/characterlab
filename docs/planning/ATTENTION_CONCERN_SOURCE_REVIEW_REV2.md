# Attention concern source review — revision 2

2026-09-12. Primary-agent source inspection and bounded design revision. This refines
the delayed-concern draft; it is not a source/model acceptance or public qualification.
Existing Campaign2 runtime, transforms, contracts and frozen models remain unchanged.

## Actual source constraints

The actual workspace transform381 selects one task at capacity1 or2. Capacity1 leaves
no forecast slot; capacity2 selects one task and permits the forecast read. Capacity3
can select two tasks. Therefore the primary one-task profile proposes capacity2 and
one committed task, with task and prediction access enabled. It cannot use capacity1
and then donate a forecast outside the accepted workspace budget.

The workspace reads task status, checks its active half-open interval, and reads the
retained prediction only after its selection/access gates. Appraisal384 consumes the
actual workspace and the selected task's committed interval. Concern388 consumes the
actual appraisal and committed gain, producing one response per selected task. Neither
stage needs a persistent belief read or writes character state.

The actual task measurement application completes an open task when its contemporaneous
measurement lies in the task interval, but selects targets only while active. A naive
measurement→workspace experiment could thus erase the selected task in its known-zero
case. The proposed probe precedes task activation; concern runs after activation and
before deadline. The retained forecast then supports an in-range appraisal without
silently bypassing the existing task-completion rule.

Prediction application consumes actual M1 MeasurementEpisodeEvidence342 at phase140,
projects its subject and writes the existing prediction root362 under belief-expectation
authority. It computes the existing observation-supported mean; no forecast is authored
as an original or inserted into S0. Workspace consumes the committed prior at a strictly
later instant. This source ordering requires no new same-event belief ordering decision.

## Proposed source sequence

Use one existing bounded diagnostic probe, actual measurement carriage and M1 evidence,
then the existing prediction application. Preserve the retained measurement-memory,
prediction-read and task lifecycle descendants required by the chosen composed profile;
do not truncate their queues merely because attention only needs the prediction leaf.
Their exact registrations and cost still belong in the successor model packet.

An illustrative bounded schedule is probe at0, task active from1, deliberation at1,
one to eight scene/cue receivers at distinct instants2..9, and deadline20. These are
draft fixture values, not new model commitments. The task starts as an actually adopted
open task through the accepted initial-state grammar. Its prediction prior starts absent.
The deadline event remains genuine pending work after the last attention receiver and
must be preserved by save/restore and executed if the public run drains its queue.

At the deliberation instant the new finite profile executes:

| Stage | Phase | Input / output | Reads | Writes |
| --- | ---: | --- | --- | --- |
| Workspace | 40 | admitted opportunity377 → actual381 | actual PRJ/IDN; task status; gated prediction | none |
| Appraisal | 50 | actual381 →384 | selected committed criterion only; no persistent state | none |
| Concern | 50 | actual384 →388 | committed gain only; no persistent state | none |

Each stage allocates its existing output occurrence once. The existing whole cognitive
adapter always continues concern into motive and later choice stages; it is not a
configurable three-stage adapter. The successor therefore needs an explicit governed
terminal-at-concern registration/adapter restriction. Reusing its pure transforms
does not authenticate parentage or authorize editing the frozen whole-choice model.
No claim about removal or dispensability of motive, arbitration or identity follows.

The trusted concern adapter narrows the actual output immediately into the previously
proposed generated delivery payload, once per exact future receiving original. SourceAt
is the actual concern event time, not an invented field on388. Carry Subject is the
actual workspace subject. Exactly one response yields ActualConcernCarry; an actually
empty selected-task/assessment/response chain yields NoConcernAvailable. Multiple
responses reject this profile rather than being aggregated. The full nested381/384/388
chain remains source-side/trace-side; receivers obtain only the narrow response.

Each delivery is scheduled at its receiver's phase15, strictly after the source instant.
It carries the source parent chain and is consumed only through the already reviewed
exact two-parent join. New source production adds three local events, three output
occurrences and up to eight future delivery emissions. This does not count the earlier
probe/learning descendants or make three the source's total work budget.

## Discriminating source controls

Use one task interval[4,6] and concern gain1 as explicit candidate calibration. A single
permitted exact measurement0 yields retained mean0, selected below-range appraisal,
and intensity4/10. Measurement5 yields mean5 and known intensity0; measurement10 yields
above-range intensity4/10. These values must come from the actual permitted probe.
They are expected source calculations, not recorded public outcomes.

Keep three unavailable controls distinct: capacity1 (selected task, no forecast slot),
disabled prediction access (selected task, no read), and absent prior following denied
measurement (selected task, attempted absent read). All produce an unavailable response,
with their distinct upstream evidence and read traces. Disabled task access instead
produces an empty workspace and NoConcernAvailable; it is not KnownIntensity0.

Feedback ablation changes only receiver modulation. All probe, prediction, task,
workspace, appraisal, concern and delivery bytes/identities must remain identical
between enabled and disabled receiver models with the same source. No current affect
lookup, authored numeric concern, truth comparison, workspace-capacity donation or
forecast handle is permitted at encoding or retrieval.

## Frozen source obligations and remaining closure

ACS-A real permitted probe→M1→prediction write→later workspace read; B capacity2
one-task/read versus capacity1 one-task/no-read; C preactivation measurement preserves
open task including in-range measurement; D actual known0 versus unavailable versus
NoConcernAvailable; E below/above exact intensity; F no nested forecast reachable at
receiver; G actual PRJ/IDN and foreign subject rejection before receiver memory reads;
H source bytes invariant under receiver feedback ablation; I all source descendants
and deadlines preserved on replay; J terminal-at-concern restriction without modifying
whole-choice models; K source/delivery failure rollback; L exact total work/allocator
envelope including pending delivery and deadline work. All are FROZEN, NOT PASSED.

Complete exact upstream registration/content dependencies and event/output budgets,
including automatic prediction-read scheduling and preserved measurement/task
descendants. Then combine this graph with the local attention declarations. No new
numeric allocation, runtime activation, general affect-feedback qualification or
corpus promotion occurs in this revision.
