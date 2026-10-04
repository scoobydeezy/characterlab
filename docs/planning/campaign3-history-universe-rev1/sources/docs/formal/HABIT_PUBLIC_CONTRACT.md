# habit-public/0.1-candidate

Accepted local bounded successor, 2026-09-21, before implementation and model freeze.
Authority: North Star acquired history; Architecture Habits → OptionGen and exclusive
learning ownership; Brief12.9; PHEN-HABIT-001. This contract selects no universal law.

## Source and ordering

One actor, two distinguishable perceived context cues, one target action and an idle
alternative. At most16 opportunities, strictly increasing integer times1..32. Original
818 fields: time, mode1 instructed exercise /2 free probe /3 information-only,
physical reward Boolean, observer visibility, report0 actual /1 positive /2 negative,
perceived cue Boolean. Cue false denotes a different untrained context. Mode1 supplies
one instructed candidate; mode2 always supplies idle and may retrieve target; mode3
supplies idle alone. These are controlled task apparatus, not caller-supplied decisions.
Skill1, identity contribution0 and body-adaptation contribution0 are explicit immutable
content controls. They have no mutation routes in this profile.

Stages: appraise40, options50, raw51, reasons52, decision60, intent70, expression80,
plan90, attempt100, execute110, observe120, history140, belief140, cache140. Fourteen
events per instant, each with one1155 occurrence. Every branch preserves this topology.
Initial journal empty, belief absent, optional stored cache(h=0,count=0). Phase140 only
affects subsequent40. Cache executes after history in the same source's emitted order.

Safe appraisal consumes only perceived mode/cue and own history/cache and expectation.
Physical reward and report apparatus remain source-side until observer projection.
Execute emits actual action/reward; Observe admits a binary report only when visible
and the target was performed, or for mode3's explicitly permitted corrective message.
Idle free probes provide no target outcome evidence. Information-only messages update
expectation but not action history. Unseen execution may occur without habit learning.
No-opportunity, missing observation and observed negative outcome remain distinct.

## Learning and candidate construction

Root821 owns a safe journal820 of admitted performed-target observations819 (occurrence,
time,cue,reward). Only authority/habit-history appends it; max16, unique occurrences,
strict chronology. Each entry comes from permitted observation836, not truth outcome835.
The journal preserves both cues; folds select only the currently perceived cue.
Root823 holds latest admitted expectation822(value,source) for the action, independent
of cue in this bounded apparatus, solely authority/reward-expectation. Unknown is absent.
No mean/probability calibration claim. Correction can change belief without repetition.

Law1 Residual: starting h=0, each selected positive outcome h'=(h+1)/2; each negative
h'=h/2. Law2 Linear: h'=min(1,h+1/4) for positive, max(0,h-1/4) for negative.
Law3 NoHistory: h=0 always. Exact rational arithmetic, no rounding. Cue false and true
fold independently. Candidate admission threshold is h>=1/2, a bounded candidate only.

Candidate1 DerivedHistory folds journal at appraisal. Candidate2 StoredSummary stores
both cue folds824(hFalse,hTrue,count) in root825 under authority/habit-summary and reads
that cache at appraisal. Cache is recomputed from the owned journal after each source;
it must equal the fold at each committed boundary. No reduction verdict is pre-decided.
Candidate3 ExplicitBeliefOnly admits target iff expectation is known positive.
Candidate4 CurrentRewardOnly admits target iff current physical reward is true; this
is a labelled violating truth-reader comparator. All candidates admit target during
instruction and exclude it during information-only mode. During free mode candidates1/2
admit it if expectation is positive OR cue-fold reaches threshold. No strength is added
to a Reason. Candidate admission and preference remain distinct and traceable.

Raw target reason uses existing402/401 with fixed task ground: +1 during instruction
or known-positive expectation, otherwise none. Idle has no reason. Compile through
existing reason-nuclei dice437; analyze one/two candidate distributions with roll
threshold1, player threshold1. Missing reasons have deterministic score0. Settled
preference uses Auto; unresolved cases draw each nucleus's existing signed die and
resolve exact ties uniformly, using addressed RandomRunOracle and411 draw records.
No weighted-random replacement. Exact analytical probabilities are emitted before
selection. Unknown/known-zero differ as state, even where choices coincide.

Intent, frozen expression, plan, attempt, actual execution and permitted observation
are separate records. Expression lists exact chosen-versus-other alignment. Execution
of target is reliable in this scope; actual reward is independent of intent and may
be hidden or misreported. No action-to-identity update in this controlled experiment;
the inherited identity mechanism remains separately preserved by regression tests.

## Public contract and proof burden

HABIT_PUBLIC_ALLOCATION_TABLE.json accepts817..841/schema1, namespace1155. Model
identity commits all settings/content/registrations; exact S0 and data-only originals
are required. Frozen model allowlist; no callbacks/getters or generated ingress.
Research trace/save is omniscient; actual reads name full own-state paths. Safe outputs
must remain equal under hidden reward changes with identical admitted reports.
Every complete-prefix restore reexecutes from original S0 and authenticates whole-save
bytes, including RNG records. Any stage/commit failure rolls back all effects terminally.

Freeze acquisition, corrective-information and reversal horizons before qualification.
Compare training histories under equal current evidence, belief and fixed contributors;
separate current reward from reports; require acquired persistence and eventual change,
cue specificity, missing evidence, NoHistory, two laws, derived/cache equality and
explicit-belief/current-reward comparators. Expose exact probabilities and chosen paths.
No general habit/reward equation, memory reduction, resistance to stronger deliberate
reasons, physiological tolerance, dependence, withdrawal or relapse is qualified.
