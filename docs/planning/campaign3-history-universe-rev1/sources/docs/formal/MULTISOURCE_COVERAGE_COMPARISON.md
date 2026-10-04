# Cross-family coverage comparison component

`multisource-coverage-comparison/0.1-candidate`, 2026-09-20.
**LOCAL DISPOSITION — accepted for pure comparison only; no owner ruling required.**
This instantiates the existing PHEN-MULTI-001 comparison obligation. It authorizes
no public producer, state, record allocation, unit conversion or new canonical law.

Keep the accepted receiver as reference: group by complete option and semantic
ground, then source role and sign. Different motives/grounds never merge merely
because they cite the same evidence. Evidence labels here are opaque numerical
arguments, not admitted observer facts. Source-family labels do not provide evidence.

## Domain and laws

One complete option, at most five raw signals. Each has a unique source label,
ground, family (Task or Body), role (Base or Situation), nonzero exact strength in
[-1,1], and up to four distinct positive exact evidence weights in (0,1]. One ground
belongs to exactly one family. Comparison order is descending magnitude after any
normalization,
then ASCII source label. Labels have no quantitative meaning. Empty basis is permitted
and contributes independently, matching the existing reference convention.

Four separate implementations are compared:

1. **GroundAggregate:** the existing weighted union-max reference, separately within
   ground/role/sign. For each source, overlap is weighted intersection over union
   with the aggregate of all preceding raw bases. Zero union gives zero overlap.
   The raw basis joins that aggregate even if its effective contribution is zero.
2. **GroundPairwise:** same partitions/order, but maximum overlap with any one prior
   raw basis replaces collective overlap. Retained negative comparator for EXP-014.
3. **GroundUncovered:** overlap is zero. This tests additive descriptions before one
   bounded transform; it is distinct from one-die-per-description.
4. **FamilyNormalized:** a deliberately competing, role/sign-blind family sharing
   law before GroundAggregate. For each evidence atom in a signal, count distinct
   families citing it anywhere in the same option. Divide that atom's weight by the
   family count; the signal multiplier is the sum of divided weights / original
   total weight. Empty basis multiplier is one. Duplicating a description within a
   family does not increase the family count. Grounds, roles, signs and original
   bases remain separate in the returned witness. This is a hypothesis about shared
   support, not an accepted exchange rate or proof that independent motives duplicate.

For each ground and role, sum effective positive contributions minus negative
contributions, then apply x/(1+|x|) once. Do not bound/floor each description first.
No cross-sign cancellation occurs inside overlap. The normalization comparator is
intentionally not privileged: an ungrounded situational source may influence its
family counts. Measure that failure rather than silently repairing the comparator.
The reference never creates a Base from Situation.

The harness also evaluates **DescriptionDice** on Base-only fixtures: each original
description becomes a separate die using the same per-source bounded strength and
frozen die calibration. This is an explicit violating control, not a new ground
ontology. It is not evaluated on mixed-role fixtures, where the rule would require
an additional modifier-assignment hypothesis.

## Observation and validation

Return every source's original magnitude, normalization multiplier, overlap,
effective magnitude, family/ground/role/sign and original evidence basis. Report
bounded role totals separately. The exact existing reason/dice and analytical
probability kernels may consume internally constructed component arguments; such
arguments are not public admitted outputs or actual producer evidence.

Required witnesses: duplicate singleton support; independent support; collective
{a},{b},{a,b}; two families with shared versus distinct evidence; opposite signs;
shared evidence in different roles; and modifier-only input without a base. Preserve
permutation invariance, no mutation, exact reference-kernel parity and family/role
boundaries. Report distribution equality separately from numerical role equality.

No ModelIdentity, RunIdentity, ExperimentIdentity or public corpus PASS is created.
Public extension still requires an authenticated common-evidence producer, source
and unit/subject admission, exact declarations/ownership, model packaging and replay.
