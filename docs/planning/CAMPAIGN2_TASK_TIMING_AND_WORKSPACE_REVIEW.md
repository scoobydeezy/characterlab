# Task timing and independent deliberation opportunity

2026-09-09. Agent self-review, accepted in direction; no whole shape or allocation.
Companion to task-commitment/0.1-draft and the goal-appraisal research target.

## Remove the false dependency on a successful sensory producer

Generating the workspace only from366 would make missing prediction suppress the
entire goal/motive path. Generating it only from M1 would also make a denied sensory
channel suppress an otherwise live commitment. Neither result is warranted by the
architecture. Unknown forecast must coexist with a live goal, and a commitment may
press without a successful current observation.

Choose a separate, plain-data **DeliberationOpportunity** as a new original-input
kind in the future profile. It requests a bounded cognitive cycle at40; its payload
contains only ObserverId and a governed AgendaDefinitionId. It supplies no forecast,
appraisal, affect, motive, Reason, option score or chosen action. The exact original
input compiler authenticates source identity/time/order, just as current original
probe sources are authenticated. Runtime handlers cannot recursively emit another
original opportunity.

The agenda declares a finite admissible task/option domain and workspace capacity;
it is not a precomputed psychological result. IDN derives the subject from the
admitted ObserverId, then the workspace reads only that character's registered task
status and selected prediction leaf. Task-active eligibility is computed from the
actual prior status and the declared window at the current instant.

The existing366 read remains its already qualified diagnostic consumer in the old
profile. The future workspace reads the same owned361 through its own explicit
projection; it neither reinterprets366 as new evidence nor copies its occurrence
into a second provenance graph. Named workspace-read ablation must remove this
new access, rather than pretending that ablating the old diagnostic consumer also
disables an independently registered reader.

This supplies a straightforward complete-cycle target: earlier observation learns
the prior; one later original deliberation opportunity traverses40→50→60→70→80→90
→100→110→permitted consequence→130→140. No hand-authored psychological intermediate
is needed. No phase30 producer or ORD-001 resolution is silently assumed.

## Disjoint clock and measurement targets at the deadline

Use the already proposed half-open task window, ActiveFrom≤T<Deadline. Refine
measurement applicability to depend on admitted holder/criterion and this **static
window only**, before reading prior task status. The stored status decides whether
an applicable task changes; it must not make its registered dispatch disappear.

The source observation's time must equal the actual admitted M1 instant. A late
archived observation is not rescued by a historical timestamp inside the window.
At T=Deadline the measurement dispatch therefore has no target for that instance,
while its authenticated deadline dispatch has exactly that target. They cannot
collide. No state-dependent priority, coalescing heuristic or enumeration winner is
needed to process a simultaneous observation and deadline.

For the first finite profile, reject overlapping windows for the same holder and
prediction definition. A new recurrence may start exactly at the old deadline.
Then the clock event targets the old instance and measurement targets the new one;
the keys are different even if criterion/stakeholder match. Both see the same B0.
Multiple tasks/criteria or overlapping windows require an explicit profile extension.

Already-terminal tasks still receive their authenticated deadline opportunity and
produce no further state change. This preserves event/allocator scheduling across
satisfaction interventions and does not silently cancel a future event. The exact
no-change output/trace and ordinal budget must be specified before implementation.

## Initial deadline source is not caller authority

The future initial-state compiler validates the exact finite Open instance set and
derives one private deadline association per instance. Its event identity comes
from the shared scheduler allocator, not a TaskReferent ordinal. Deadline input
cannot be injected through the public ordered-input language. Complete S0/input
prefix restore must reconstruct and compare those pending associations.

This requires an explicit initial-schedule composition contract: ordering relative
to original inputs, allocator consumption, duplicate prevention and overflow rules.
The current factory's initial queue is not mutated informally after construction.

## Remaining boundaries

The one-task-at-a-time profile is a bounded selection control, not a universal
workspace attention algorithm. Capacity and competing-item selection still need
their own exact specification and ablations. Goal context may remain live when its
forecast is absent; appraisal must represent that unknown distinctly from Within.

No action efficacy follows from an agenda, task interval or forecast. The eventual
option/action-expectation source still needs a separate accepted contract before
the full-cycle path can be implemented. This review does not manufacture a causal
belief in content, or reuse world-effect truth as an option score.
