# Scalar censored evidence learning

**SHAPE ACCEPTED by agent self-review, 2026-09-21.**
Version **learn-public/0.1-candidate**. Construction authority under the Campaign3
escalation policy; not a behavioral qualification. See LEARN_READINESS.md.

## Domain and source

One observer/character, two independently named scalar-effect propositions, empty
initial belief state. At most64 distinct increasing positive instants <=128, zero
to two distinct target frames each. Original frame: proposition, nonnegative actual
potential effect in[0,1], before-level in[0,1], and visibility. Each trial is a
separately authored bounded physical experiment with ceiling1, not persistent body
state or a general physiology law. Actual applied=min(potential,1-before),
after=before+applied; overflow=potential-applied remains truth-side. Permission
absent emits no sample. Safe measurement is applied; reaching ceiling yields
LowerBound, otherwise Point. Fixed known observation precision2. This implements
the bounded state-change observation rule without exposing potential or overflow
to evidence/learning. Classification never consults hidden overflow. No arbitrary
safe sample, estimate or generated event is public input.

## Ownership and timing

Registered stages: probe50, world110, observe120, freeze124, evidence130, apply140.
Observation produces887 with observer, proposition, occurrence/time, measurement,
kind and precision. Freeze stages actual SEM support only when evidence exists.
Evidence891 and application892 refer to those exact authenticated samples; no
truth ancestry resolver is available to learning. The existing belief-expectation
authority alone writes890 keyed by888=(character,proposition). Probe893 reads only
retained belief before the current trial. ORD-001 remains isolated. Whole-instant
rollback and complete-prefix restoration include queue, IDs, state, outputs/trace.
No RNG draws. Pure learning takes safe sample only, not physical frame or goals.

## Candidate equations

Unknown has no state leaf; for the nonnegative-domain initial update only, use
reference operands mu=0,tau=0. Unknown is never exported as known zero. Given
rho=2 and measurement x, candidate m=(tau*mu+rho*x)/(tau+rho).
Point is informative. LowerBound is informative iff m>mu (strict, before rounding).

1. Gated: informative -> (m,tau+rho); otherwise preserve mu,tau and the entire leaf.
2. UnconditionalPrecision: point -> m; bound -> max(mu,m); always tau+rho.
   Retired negative control, never selected as the lawful informativeness baseline.
3. PointOnly: only Point updates; bounds leave the entire leaf unchanged.

Applied samples alone enter the retained support set; precision=2*support count.
No rejected-bound metadata manufactures learning or refreshes retained state.
Maximum64 supports per target. Repeated distinct observations are not assumed
statistically independent by a general source law; these are bounded trial controls.
Informative bounds receive full point-like rho, a preserved approximation.

Numeric profile1 keeps exact reduced rationals. Profile2 rounds raw posterior mean
and precision independently to millionths using ties-to-even at commit. Both raw
values and final posterior are in892; numeric profile is explicit in893/model
identity, so exact versus quantized comparisons never claim byte identity.
Trace's generic quantization list remains empty because this profile's complete
numeric witness is explicit in892; it must not be described as no quantization.
PointOnly can fail the required inconsistent-bound update without violating the
truth/evidence boundary. None of these laws is calibrated correctness confidence.

## Required frozen comparisons

25 point trials at2/5 or1/20 establish precision50. Follow with lower bound1/10.
Fresh nonnegative unknown and acquired positive estimates receive bound0. Six
lower bounds1/10 from empty prior followed by point21/50 reproduce CaseD. Gated
exact final mean13/50, precision4; UnconditionalPrecision final mean51/350,
precision14. Preserve historical lattice outputs separately. The first bound from
empty yields1/10,2; subsequent five retain that leaf exactly under Gated.

Hidden-overflow variants hold before and safe applied/kind fixed. Missing visibility
does not become zero evidence. Empty frames permit a later probe without learning.
Established priors below a repeated bound are a supplementary limitation case:
gating is mean-relative informativeness, not universal bound deduplication.

## Public closure

Allocation884..896/schema1, occurrence namespace1158. Exact registered model images
commit source/content/law/numeric/stages/authority; runs commit empty S0, original
input sequence and seed. Public preparation admits frozen model identities only.
Restoration reexecutes the exact original prefix and requires full canonical save
equality. Read-domain/own-key/closed-codec negatives, every reached stage and commit
rollback, and no mutation of predecessor contracts/models are qualification gates.
Upper bounds, decay, richer posterior, source correlations, surprise integration and
calibrated uncertainty remain reopening conditions. No whole Brief12.4 claim.
