# Maintenance-goal and result identity review

2026-09-13. LOCAL symbolic disposition; not allocation input or public activation.

## Existing substrate

TaskCommitmentKey371 already uses `(CharacterId, SemanticReferentId)` for an
individuated commitment; TaskCommitmentSpec370 is a separate governed definition.
This is a useful identity precedent, not permission to reuse task fulfillment
semantics for a maintenance goal. Maintenance satisfaction never retires the goal.

TaskAppraisal384 owns AppraisalOccurrenceId1129. The cognitive occurrence closure
states that each family is used for its listed output and references only. Therefore
the generic-sounding name is insufficient authority to assign1129 to a new bodily
assessment. OutcomeEvaluation269/1116 is also already a different frozen semantic
output and cannot be renamed into this appraisal.

## Selected symbolic construction

- Propose a distinct MaintenanceGoalKey record with CharacterId and GoalReferent:
  existing SemanticReferentId. The referent denotes the declared goal instance, not
  its definition, signal, holder or a perceived body file. Reuse the existing typed
  identity family under an exact new goal-kind/holder validator; do not reuse371's
  task-specific schema or add a parallel goal identity namespace without need.
- Keep the goal definition's existing DefinitionId separate. Its kind/version and
  source binding must be checked explicitly. Arbitrary world/person referents cannot
  pass as goals merely by having the SemanticReferentId namespace.
- Same-key adoption is once-only within the bounded run. A later distinct adoption
  uses a fresh declared goal-instance referent, as the existing commitment precedent
  permits. This preserves the accepted component's rejection of same-key replacement.
- Propose one new symbolic GoalOutcomeAssessmentId for the committed bodily assessment
  output. Relation/boundary and qualification values are separately inspectable inline
  results within that output; no second qualification occurrence is required.
- Propose one new symbolic RetainedAttributionResultId for the later actual attribution
  output. Its consumed addresses and explicit focal target remain distinct. No UseId,
  TargetId, MotionId or second trial/context identity is introduced.

Exact record/role closure and separate numeric review remain required. No numbers are
assigned here. Existing1129,1116 and their old profiles/bytes remain unchanged.

## Lifecycle ordering constraint

The existing task bootstrap schedules deadlines at140 and the task owner reconciles
them transactionally. Maintenance-goal reads, however, explicitly reject an Open goal
at/past expiry until expiry settles. A new source must not bypass that rule by making
a private projected Expired copy, reading current goal state after the fact, or
pretending a future expiry was committed earlier.

For the first bounded maintenance-goal profile, keep lifecycle settlement at the
terminal owner boundary and exclude goal-reading originals at the exact expiry
instant. Reads strictly before and after remain available; the scheduled expiry
settles at its exact deadline. This avoids a new phase or mutation authority merely
for the initial fixture. Exact-boundary cognitive concurrency remains a named later
source/ordering extension, not passed by profile exclusion. Missing expiry in a saved
queue must reject through complete-prefix validation, not be silently regenerated.

The first controlled goal is adopted before the focal trial, assessed at64, withdrawn
at70 and expires at100; there is no goal read at100. The eventual expiry handler must
handle an already withdrawn goal as an explicit no-op without reopening it. Public
adoption, goal-state descriptors and deadline output/work declarations still need closure.

These choices preserve accepted concepts and existing ownership. They resolve first
representation and fixture scheduling locally; no owner ruling is needed. Broader
goal selection, recurring adoption and exact-boundary appraisal are not qualified.
