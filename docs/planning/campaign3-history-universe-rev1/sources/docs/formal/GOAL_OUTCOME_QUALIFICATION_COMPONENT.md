# Goal outcome qualification component

2026-09-13. `goal-outcome-qualification-component/0.1-candidate`.
Component shape accepted by primary-agent review under autonomous authorization,
implementing the user's both-directions ruling. No retention authority is granted.

Execute the accepted goal-distance relation on its exact admitted component inputs.
Return the complete assessment basis with a qualification disposition:

- MovingCloser or MovingFarther → Qualifies, preserving the exact direction.
- SameDistance → DoesNotQualify / SameDistance.
- IndeterminateRelation → QualificationUnavailable / IndeterminateRelation.
- Unavailable → QualificationUnavailable / AssessmentUnavailable; retain the
  assessment's original missing/inactive concern or evidence reason in its basis.

The first two directions qualify without a magnitude, count, use bit or valence
comparison. Preserve below/within/above/ambiguous positions and boundary relation
in the assessment basis, including nonqualifying equal-distance side crossings.
No distance is relabeled significance and no unknown assessment becomes zero.

The explicit deterioration-only comparator executes the identical assessment but
returns DoesNotQualify / ComparatorExcludesProgress for MovingCloser. It preserves
the progress direction in the basis; its exclusion is a policy, not uncertainty.

This produces only qualification candidate values. Actual Supported attribution and
extant-target admission remain independent downstream prerequisites for any credit.
The module neither takes an arbitrary caller-authored qualification Boolean nor
grants public authority to its trusted state/domain/evidence inputs. It stores no
significance and changes no memory, use protection, goal, original encoding or
history. Result provenance/identity, source binding, public commit and persistence
remain in the whole successor contract. No numeric allocation is made.
