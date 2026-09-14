# Historical qualification carry — revision 2

2026-09-13. LOCAL projection disposition; public schema/registration remains draft.
Corrects the ambiguity in FOCAL_HISTORICAL_RESULT_JOIN_REV1's phrase “exact safe result
bytes”: delivery must equal the declared narrow projection, not the whole appraisal.

## Why the projection is load-bearing

A full goal assessment includes desired range, before/after distance intervals and
side-of-goal classifications. For a BelowGoal interval, those values can reconstruct
the earlier sample. Carrying them through a future scheduled input could therefore
preserve forgotten evidence even if no field is named RawSample. A prohibition on
raw sample fields alone is insufficient.

The first carry contains only:

| Field | Exact role |
| --- | --- |
| Assessment | The sole actual GoalOutcomeAssessmentId; symbolic, unallocated |
| Observer | Actual source ObserverId, checked against the later observer |
| Goal | MaintenanceGoalKey, including qualified CharacterId and declared goal-instance referent |
| Consequence | Existing ExperienceId of the actual source consequence; no resolver |
| AssessedAt | Actual committed consequence-time assessment instant |
| Qualification | Exact Qualifies(direction), DoesNotQualify(reason), or QualificationUnavailable(reason) projection |
| TransformationVersion | Exact carry seam version admitted by the successor profile |

Directions are MovingCloser/MovingFarther. Nonqualification retains SameDistance and,
only in its separately admitted control, ComparatorExcludesProgress. Unavailable
retains IndeterminateRelation or AssessmentUnavailable with the component's exact
Absent/Pending/Withdrawn/Expired/MissingEvidence cause. Do not invent a zero score or
new precision/confidence meaning. No additional carry occurrence is allocated.

The carry excludes distances, goal ranges/snapshots, source samples, position views,
full SEM/EVID envelopes, full appraisal objects and callbacks. It grants no lookup
by its source IDs. The full assessment input/numeric basis may remain in the trace
under existing audit authority; character transformation arguments cannot reach it.

## Binding

The producer adapter derives this exact canonical projection from the actual completed
appraisal output. It checks the projection against the expected target original and
due instant before scheduling delivery. The later adapter verifies completed delivery,
same observer, actual PRJ/IDN subject equality, exact focal consequence and unconsumed
target association. Matching enum values from another appraisal are insufficient.

Attribution receives admitted retained operands and explicit focus, never the full
appraisal or trace. Only the later significance join consumes Qualification. The
memory owner still checks the current focal child's survival. A surviving carry
cannot rescue a lost child or supply a missing trial operand.

## Frozen public checks — NOT PASSED

QP-A full appraisal and projected carry remain separately typed.
QP-B adding range/distance/side/sample/view fields rejects at canonical admission.
QP-C tampered projection or same-valued foreign-source substitution rejects.
QP-D after forgetting baseline/target, delivery cannot recover either payload.
QP-E same observer/qualified character/consequence and strict later time are required.
QP-F unavailable/nonqualified variants preserve their exact meanings.
QP-G failed join rolls back consumption, state and outputs; complete-prefix restore
reconstructs the same narrow queue payload without a private appraisal cache.

The existing scheduler fixture already transports direction/provenance only, but
its tuple and trusted continuation do not qualify this public record or admission.
