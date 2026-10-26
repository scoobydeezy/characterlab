# assembled-character-strategy/0.1-candidate

M12 lets the continuing character change its plan while retaining its goal.
ACCEPTED LOCAL DISPOSITION before code, 2026-10-26. Architecture4.7/11/13,
GOAL_STRATEGY_PUBLIC_CONTRACT and approved M2 R3 SeparateGoalPlan govern this port.
Rules/registry0.12 extends0.11; historical versions and controls remain executable.
R3 SeparateGoalPlan locks on this first use: engineering default, no superiority verdict.
No performance-failure threshold is selected; failure alone cannot prove availability.

## Composition and ownership
One existing model/state/scheduler/trace/RNG/save. Both existing task commitments373/1
remain the goals, with their original adoption, perceived satisfaction and deadlines.
373/2 remains immutable adopted instruction; it is not the successor's mutable plan.
Root996/1 keyed by task stores [version, selected route0/1 or2=no route, selectedAt].
Only authority/selected-plan writes996, at90. Root1000/1 keyed by holder stores the
permitted availability journal; only authority/strategy-knowledge writes1000 at140.
Neither writer changes goals, acquired skill, identity, memory or outcome beliefs.
No alternate runtime, new goal copy, action execution path or random chooser.

Slot13: [version, list([task key, route0 instruction, route1 instruction])]. Exactly
both governed task keys, each with both distinct existing instructions; references
must resolve to governed389 instructions and their391 actions. Either order is legal.
This declares attempted strategies, not guaranteed efficacy. Public S0 excludes996/1000.
No learned histories or authored intermediate decisions can enter through originals.

## Perception and planning
Original strategy-display at30, integer1..100, at most100 originals, one per instant:
[version, list([task, route0/1, receipt1..16, available Boolean,
issuedAt, validUntil, visible Boolean])]. At most four rows per original, one/task/route;
1<=issuedAt<=now<=100; issuedAt<=validUntil<=100. Up to8 unique receipts per task.
Repeated task/receipt preserves route/polarity/issuedAt/expiry. Different receipts for
same task/route/issuedAt reject. Visibility may change. Missing/denied is not negative.
The controlled apparatus supplies fallible displays, not actual execution facts.
This ports GOAL's explicit display boundary, not rich Campaign1 recognition.
Observe120 reserves four IDs from the shared allocator regardless of visibility;
only visible rows become local observations with task/route/receipt/time provenance.
Evidence130 carries exactly these observations; learning140 appends unique receipts.
Denied records and the display source never enter planning operands or learned state.
All generated children are bound by full event fingerprint, parent, phase and payload.

At the existing workspace40, only selected, active task keys reach the planner.
It reads own committed plan/knowledge and uses SeparateGoalPlan: retain a known usable
prior route, else first known available route0 then1, else no route. Latest issued
reading wins; expiry is inclusive, and an expired latest reading cannot revive older
knowledge. Missing, Expired, KnownUnavailable and KnownAvailable remain distinct.
The exact selector is a bounded port of goalStrategyComponent, extending only its
integer time bound8 to100. Compare directly with that component inside its old domain.
Plan90 commits the evaluated plans; candidate70 consumes the same authenticated40
projection and governed instruction/action mapping. Existing reasons, arbitration,
intent/expression, attempt, procedural execution and body effect consume those actions.
No availability score is added to reasons. No selected task means no plan evaluation;
no usable route means no candidate, without abandoning or deleting the task.
Same-instant display evidence first affects the next workspace, never prior choice.
Each90/140 owner validates against its declared state and rolls back with the instant.

## Predeclared comparison and limits
Fixed seed7, original M11 source/data, choices3/5/7 and practice3. At1 displays expose
only route1. At3 changed display exposes route0 and closes route1; control retains1.
Both first choices/expressions match; at5 selected plan, candidate, intent, actual
attempt and executed protocol count must change, with identical goal states and skill.
The changed action must reach the existing body actuator, not a separate route engine.
Gap control closes both at3, reopens0 at5: no choice5, goal retained, choice resumes7.
Denied change must preserve cognition; false availability with blocked/failed execution
must not abandon the goal. Test retained usable route, expiry/no older revival, missing
versus negative, satisfied/deadline goals, legal reordered instruction mapping.
Require repeat and restored-prefix equality through every subsequent boundary,
common-stage rollback after a proposed knowledge write, foreign authority, malformed
source/state/reference and forged/duplicate generated-event rejection.
MEC004 PORT controlled perception; MEC015..019/022 existing decision/expression/identity
controls retained; MEC020/EXP013 PORT existing goal lifecycle. No reductions.
RO-C3-012/013/014/019/020 retain wider monitoring/attribution/goal-control debt.
FND3/4/6 affected ordering/ownership/boundary vectors run in focused integration tests;
no new foundation law, C3 verdict, corpus replay acceptance or debt closure claimed.
