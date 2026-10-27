# Assembled character control contract

Version: assembled-character-control/0.1-candidate. M17 receiving contract, 2026-10-27.
The character can keep a withholding goal in mind, use spare workspace to suppress an
existing action candidate, and later release that control without deleting learned habit.

Implements Architecture10.1/10.2 Control -> OptionGeneration and CONTROL public0.2
SpareSlot maintenance/inhibition in the shared assembled0.17 composition. Reference
SpareSlot is locally adopted from the accepted bounded CONTROL precedent; this is an
engineering default, not an R3 ruling or universal psychological law.
Residual habit and all earlier laws remain fixed. C3 controlRuntime remains a control,
never a production dependency. NoInhibition/LoadBlind/RetainedEqualsMaintained and
EraseHistory/NoHistory retain their original control identities; Linear remains comparison.

## Keys, ownership and admission

Registry slot18 is [assembled-control/0.1]; target is the existing habit target action,
not a new idle action. One holder and one withholding-goal instance per run. No recipe
lookup. S0 has neither control goal nor maintenance state. Goal lives at373/4 keyed by
holder, under existing authority/prospective-commitments; status1 active or2 retired,
with update instant. This is distinct from either task's achievement goal. Workspace
maintenance lives1014/1 keyed by the same holder under authority/workspace, with boolean
maintenance and last evaluation instant. No second history, capacity or decision owner.

At most16 distinct original sources at times1..100, phase10, empty dependencies:
[tag,instruction0..2,reminder,support,neutralCard,boardVisible]. Instruction is explicitly
received semantic direction (0 none,1 adopt,2 retire), not authored active access. At most
one adopt then one retire; no repeated/adopt-after-retire or retire-before-adopt. Board
visibility gates reminder/card, not the separately received instruction/support. Source10
projects safe evidence20 (shared1164 occurrence), with denied reminder/card both false.
Instruction20 emits authenticated goal update140; common B0 and atomic shared commit.
Thus current adoption/retirement cannot change earlier choice in that instant.

## One workspace and choice path

At40 derive base occupancy from actual task381 selected tasks and known forecast380.
Maintain iff goal active and (current visible reminder or prior maintained with support),
and at least one shared slot is available. Missing source supplies no reminder/support.
Reserve that one slot, then admit one visible neutral card if a slot remains, then admit
current retrieved episodes into the remainder using unchanged order. No task/forecast
can be displaced by an injected control intermediate. Source-priority ordering is a
bounded engineering default, no verdict; it extends existing task-first admission.
All selected tasks, forecast, goal, card and recalled episodes consume ONE capacity0..4.
The inhibition operation needs one additional spare unit after maintained contents;
it uses that unit transiently, creates no extra store and never increases capacity.

At70, if goal maintained and spare>=1, remove the target from the actual merged planner/
habit candidates before raw reasons. Applies to the action regardless of producer.
No habit strength bonus, invented counter-reason or change to existing task motives.
Unlike historical idle-versus-target wrapper, surviving real task candidates feed the
existing shared reasons/dice/intent/attempt/physical execution. If none survive, existing
no-choice behavior applies. This is an explicit receiving distinction, not full wrapper
output equivalence. Histories/expectations/skills are read or updated only by their
existing owners. No executed target => no performed habit reward credit.

Maintenance40 writes1014/1 through the workspace authority; at70 consumes its current
validated projection, not a second read of truth. Trace includes source evidence/parents,
prior goal/maintenance reads, actual occupancy, selected recalls, removed candidates and
resulting output. The shared workspace contribution becomes workspace/0.3 and records its consumed control
projection. Separate control0.1 contributions prove the owned reads/writes. Both40 and70
traces retain predecessor contributions, including
habit candidate evidence. Pending events are authenticated; generated sources rejected;
all queues/allocators/state/trace/output roll back together on any instant failure.

## Comparison and limits

CURRENT pins the16-run behavior comparison before code. Reuse original controlCases
main/lost/hidden/noGoal/negativeBelief/otherCue unchanged, all six Residual candidates and
Linear main, comparing active/maintained/inhibited to mapped shared occupancy (base0,
capacity2, no recalled memory). Retain full horizons and control differences. Assembled
controls exercise real shared task/forecast/recall accounting, invisible board truth,
absent/unsupported maintenance, goal release, no-choice, wrong owner, malformed sources,
nonempty S0, authentic children, exact repeat/restore and whole-instant rollback.

RO-C3-012/015 affected claims are bounded by these new comparisons; no broad closure.
RO019 remains closed and RO020 conditional. MEC011/015..020/022 and EXP003/004/013,
P3-009 remain controls/contracts; no mechanism retired. This does not add natural goal
inference, multi-goal control, fatigue, rumination, reappraisal or complete corpus coverage.
