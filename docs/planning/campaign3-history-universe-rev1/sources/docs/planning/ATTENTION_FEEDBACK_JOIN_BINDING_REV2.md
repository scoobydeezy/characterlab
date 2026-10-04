# Attention feedback join binding — revision 2

2026-09-12. Primary-agent design review checkpoint. This resolves the join algorithm
and ordering choices in revision1; it is not whole public-shape acceptance. Exact
canonical schemas, registrations, role declarations and model packaging remain gates.
No permanent allocation or production source changes.

## Substrate findings

The actual scheduler supports additionalCausalParentEventIds and a future15 → later40
join without a new phase. It only checks that an additional parent ID was allocated.
Dependencies is canonically serialized opaque data, not a readiness interpreter.
JXP-B/C execute a future uncompleted parent counterexample successfully under these
generic rules. That is expected generic behavior, not a reason to change the scheduler.

JXP-A executes the intended0→15→40→40 receiving graph. JXP-D..G execute explicit
fixture checks and whole-instant rollback. The fixture payload and state are test
controls, not an implementation of TaskConcern or an authoritative private cache.

## Settled binding algorithm

1. The source adapter records the actual producing TaskConcern output, producer event,
   subject and instant. It generates exactly one narrow delivery per declared target
   scene/cue. Multiple future targets require distinct scheduled deliveries, each
   bound to its one target; a consumed delivery is not reused across receivers.
2. Each receiving original has a committed structural address in the admitted ordered
   input stream. A carry's target is that exact original plus due instant, not merely
   CharacterId/time. The address is existing scheduler/original association data and
   earns no new occurrence namespace. The whole profile must prohibit two originals
   at the same receiving instant in this first bounded version.
3. Delivery at phase15 must actually complete before preparation emits the phase40
   join. The trusted adapter checks completed delivery membership, exact canonical
   output equality, target binding and consumption status. Allocation, a matching
   record shape, a matching occurrence scalar or generic Dependencies is insufficient.
4. Join emission has preparation as its actual direct parent and the completed delivery
   as its additional parent. Both IDs are explicit in the scheduler parent list. Its
   input contains the narrow delivery and exact scene-side carrier, not only IDs that
   would require an archive lookup. The adapter's expected-input association binds
   this exact payload to its allocated join event before ingress.
5. On ingress, verify that association before projection or character-state reads.
   Then use the accepted PRJ/IDN algorithm through the successor's actual admitted
   input wrapper. Compare the qualified scene subject to the narrow carry subject.
   Release only the exact response and selected allocation operands to character
   transformation code. Never release TaskConcern's nested workspace/forecast.
6. Consume the target association exactly once only in the current transaction. On
   failure discard candidate consumption and output facts along with candidate state.
   At a successful whole-instant boundary there is no unresolved target join. Save
   qualification must independently replay the admitted prefix and compare the exact
   pending queue; private object identity is not a persistence certificate.

## Allocation versus selection decision

The first feedback candidate changes continuous encoding allocation, not role
eligibility or K. Positive spatial classification/counting runs over the permitted
preselection list. A completed selection transfers only selected content, each
selected position/class and its declared preselection-count witness. The phase40
join combines that completed selected carrier with the narrow concern response.
The consumer computes P*(1-q)/n for selected peripheral entries, using the frozen
preselection n. It does not need unselected content or a recomputed winner-only pool.
Known focal weight stays fixed. Unknown coordinate remains unavailable.

This preserves exact selection under the feedback ablation and claims only an
encoding-allocation effect. Capacity-narrowing and cue-selection effects remain
separate experiments. Retrieval feedback similarly joins its actual cue carrier
before scoring and changes omegaA only; ranking remains read-only.

Unavailable concern and absent delivery remain different: a successfully delivered
Unavailable response follows the explicit baseline-without-feedback branch; an
expected delivery that did not complete fails admission. Disabled-feedback models
retain an explicit delivered branch. No authored numeric q or implicit cache fallback.

## Frozen public proof obligations

AJB-A exact two-parent/output binding; B allocated-but-uncompleted parent rejection;
C altered target-original rejection; D altered delivery bytes rejection; E foreign
run/subject rejection before content reads; F duplicate receiver rejection; G late
delivery rejection; H known0 versus unavailable distinction; I allocation count
unchanged by selection/feedback; J nested forecast inaccessibility; K every-stage
rollback; L before/after-delivery complete-prefix restore; M no abandoned target at
successful commit. These are **FROZEN, NOT PASSED** at public scope.

## Checkpoint disposition

The two-parent algorithm is resolved in direction and its scheduler expressibility
is executed. Public source/subject authenticity, schemas and save validation are not
passed by these fixture controls. Next is the combined source/selected-carrier/join/
owner-leaf symbolic declaration packet. The previously proposed independent/global
memory mechanisms, historical controls, general attention and corpus gates remain
unchanged. No user decision is needed for that next packet.
