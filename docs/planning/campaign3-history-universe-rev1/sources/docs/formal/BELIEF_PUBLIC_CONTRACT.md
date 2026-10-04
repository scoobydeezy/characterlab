# Bounded trial belief

**SHAPE ACCEPTED by agent self-review, 2026-09-20.**
Version **belief-public/0.1-candidate**. Acceptance authorizes construction under
the user-directed escalation policy; it is not an experimental verdict.
[Plan and comparator intake](../planning/CAMPAIGN3_BELIEF_PLAN.md).

## Exact domain

One governed observer maps explicitly to one character. Two named propositions
predict outcome occurrence conditional on their visibly cued trial context.
They are observer beliefs about world outcomes, not beliefs about display accuracy.
Physical opportunity/outcome and the displayed opportunity/monitoring/outcome bits
are independently represented. Display truthfulness is not assumed. No cognition
may read actual opportunity/outcome. An unavailable display emits no observation.

At most32 original trial instants, strictly increasing times1..64, at most two
distinct proposition frames per instant. Empty frames permit a probe with no
learning. Duplicate targets fail original admission before runtime reads or IDs.
No source trust, learned quality, correlations across trials, decay, covariance,
Need urgency or hidden outcome correction is introduced. Distinct admitted trial
occurrences are treated as equal-quality independent observations, a bounded
candidate assumption that must reopen for repeated/correlated reports.

## Source, evidence and ordering

Each original generates an appraisal probe at50 and physical trial at110. The probe
reads only retained belief. Actual world frames at110 generate observation120;
the latter projects only visible displayed fields into safe sample737 (namespace
1115). No truth-side ancestor is nested in safe samples. Phase124 freezes one SEM
experience iff at least one safe sample exists; its supporting observations name
exactly these sample occurrences. Phase130 emits learning evidence741 solely from
the frozen safe samples, with four classes:

* 1 OutcomeOccurred: observed opportunity AND complete monitoring AND report=true.
* 2 SafeOpportunity: observed opportunity AND complete monitoring AND report=false.
* 3 CensoredOpportunity: observed opportunity but monitoring incomplete.
* 4 NoOpportunity: opportunity cue absent, regardless of other display bits.

Only classes1/2 update at140, with x=1/0 respectively, weight rho=1. This conservative
source does not infer occurrence from partially monitored trials. No input at120
can alter the preceding50 appraisal. Generated ancestry is authenticated by exact
allocated event identity and payload. Archived/caller-authored safe samples cannot
enter as originals. One application batch sees B0; distinct targets are independent.
The registered belief authority alone patches belief leaves. Full-instant failure
rolls back all state, queue, allocations, outputs and trace. ORD-001 stays OPEN for
current-lane application; this accepted consequence-only isolation is not its closure.

## State and arithmetic

Belief key738 = (CharacterId, governed PropositionId). State740 field1 maps that key
to739=(mean, precision, support). Missing state means unknown, never zero belief.
Initial belief state is empty. Support is the exact set of applied sample1115 IDs;
duplicate support fails. Count1..32; precision equals count, mean in[0,1].
EvidenceMean: first observation sets(mean=x,tau=1); otherwise
mu'=(tau*mu+x)/(tau+1), tau'=tau+1. LastObservation retains the same support/precision
but mu'=x. NoLearning retains no state. Every operation uses reduced exact rationals;
no hidden quantization. Confidence diagnostic C=tau/(tau+1), absent=unavailable.
It is evidence weight, not calibrated epistemic certainty. Prediction-error identity
mu'=mu+(x-mu)/(tau+1) must hold for EvidenceMean.

Appraisal743 freezes key, optional belief, goal sign {-1,0,1}, and optional
expected signed outcome=goal*mu. Missing belief means no numeric appraisal. Goal
affects no source, quality, support, mean or precision. No action-selection effect
is claimed. Truth-lookup, goal-as-belief and unconditional-absence arithmetic are
researcher-side negative controls only, never licensed cognitive read capabilities.

## Public profile, trace, persistence and limits

Allocation734..746 and namespace1150 follow the accepted table. Models commit the
exact content, stage/read/write/authority registry, candidate law, goal and finite
limits under standard ModelIdentity; runs commit empty S0, ordered originals and
32-byte seed under RunIdentity. No stochastic draws are used. Finite frozen model
admission is separate from structural decoding. Public inputs are data bytes only.
No transition hooks, authored belief/evidence, generated events or arbitrary initial
beliefs are admitted. Saves use the standard scheduler format and exact complete-
prefix reexecution validates public restoration, including output/trace/allocator
and queue equality; no hash-only equality or truth-based state reconstruction.

Trace uses existing160 with exact read records, patches and mutation differences;
safe outputs exclude truth. World/input traces remain researcher-only. Matched
hidden-world interventions compare character outputs and belief, not RunIdentity or
omniscient trace. Repeated exposures are bounded independent trial controls, not a
solution to general evidence correlation. Broader belief, likelihood calibration,
scalar censoring, causal learning and same-instant recognition consumers remain open.
