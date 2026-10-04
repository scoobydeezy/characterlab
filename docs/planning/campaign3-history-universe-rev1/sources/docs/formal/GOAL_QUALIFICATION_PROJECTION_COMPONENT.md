# Goal qualification projection component

`goal-qualification-projection-component/0.1-candidate`, 2026-09-13.
LOCAL DISPOSITION — no owner ruling required. Implements the data-minimization
boundary in `GA_QUALIFICATION_CARRY_PROJECTION_REV2`; does not authenticate a producer.

The projection accepts the trusted actual result of `qualifyGoalOutcome` or its
separately named deterioration-only control. It returns a fresh frozen value:

- Qualifies: kind and MovingCloser/MovingFarther direction only.
- DoesNotQualify: kind and SameDistance/ComparatorExcludesProgress reason only.
- QualificationUnavailable: kind and IndeterminateRelation reason, or
  AssessmentUnavailable reason with the exact underlying absence cause.

No assessment, concern, distance, position, sample, callback or identity is copied.
Unavailable causes remain Absent/Pending/Withdrawn/Expired/MissingEvidence.
Projection neither reads nor writes state. It introduces no occurrence identity.
The caller still owns actual completion, PRJ/IDN, consequence, target, time, canonical
record and exact producer-version admission. This component is not that public gate.

Checks: every variant is preserved; structurally different numeric assessments with
the same qualification project equally; output has only the declared own fields;
the actual scheduler fixture transports this projection's direction through withdrawal
and rollback. Public QP-A..G remain separately frozen and unqualified.
