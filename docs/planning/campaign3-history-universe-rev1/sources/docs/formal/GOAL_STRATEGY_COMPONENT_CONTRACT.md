# Goal/strategy selection component

**ACCEPTED LOCAL DISPOSITION — 2026-09-22.**
`goal-strategy-component/0.1-candidate`. Counters988/0; no allocation.
Admits a pure component kernel, not public state/source authority or qualification.

## Domain
One optional adopted goal with fixed ID goal/delivery and desired outcome
item-at-destination. Status is Active or Fulfilled. Two fixed distinct strategies,
route-a and route-b, are authored candidates for that same outcome. Prior selected
strategy is absent or one of those routes. A perceived last-attempt-failed Boolean
is a separately supplied character-side operand; there is no truth/cause input.

Instants are integers1..8. At most8 observation records, each with distinct visible
receipt1..8, own fixed goal ID, route, available Boolean, observedAt and validUntil
(observedAt<=validUntil<=8). Repeated receipt must preserve all content and counts
once. For one route, distinct observations at the same instant reject: the controlled
apparatus admits only one contemporaneous availability reading per route. This is
source ambiguity rejection, not an arbitrary confidence/tie rule.

Reject future observations. For each route take its latest admitted observation;
it is known through validUntil inclusive, and unknown afterwards. Do not resurrect
an older longer-lived observation after a newer one expires. Missing and expired
evidence preserve distinct diagnostic reasons, neither is negative evidence.
This finite apparatus is not general sensory fusion or source trust.

## Evaluation
SeparateGoalPlan preserves the adopted goal exactly. Active means desire remains;
Fulfilled or absent means no active desire and no selected route. For an active
goal retain a prior route if its current availability is known true. Otherwise
choose the first known-true route in authored order A then B, or no route if neither
qualifies. The ordering is a local finite control, not psychological preference.
Planning produces no actual action, arbitration, fulfillment or acquisition.

GoalEqualsPlan uses the same selector but drops an active goal when it yields no
route. FixedRoute always selects A for an active goal even when unavailable.
FailureAbandonsGoal drops an active goal after perceived failure; otherwise it uses
the baseline. These explicit alternatives test proposed collapses; they do not change
the baseline's authority. None edits input goal, observation or prior-plan objects.

## Limits and proof obligation
The kernel consumes trusted component operands. It does not make caller-supplied
state/evidence public-admissible, write373's immutable instruction leaf, learn future
efficacy, infer blame, or implement persistence as an authored personality trait.
Component tests establish finite behavior and rejection only. A public successor
must establish lawful sources, adoption and owned writes, real downstream action,
canonical identities and full replay before any Brief qualification.
RO-C3-019/012/014/020 and GOAL_STRATEGY_READINESS.md preserve these obligations.
