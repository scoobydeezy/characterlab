# Bounded procedural skill and performance belief

Version: skill-public/0.1-candidate. ACCEPTED before implementation, 2026-09-21.
LOCAL DISPOSITION — no owner ruling required. Architecture4.8/13, North Star5.7/17.4,
Brief12.8 and PHEN-SKILL-001 govern this successor. No predecessor contract is widened.

## Scope and source

One semantic character1002, one adopted fixed practice-task371/status372, one
action definition and one procedural skill. The controlled task is a calibrated
motor exercise: competence k in [0,1] is normalized achievable performance in this
task, not global intelligence or personality. Difficulty d and temporary impairment i
are independently supplied physical operands in [0,1]. A permission flag governs
whether the attempted exercise physically engages; it is not competence.

At most eight original opportunities at strictly increasing integer instants1..10.
Each original contains time, i, d, physical permission, practice mode, feedback
visibility and display mode (0 authentic result,1 displayed success,2 displayed failure).
These are physical exercise/monitor settings, never caller-authored cognitive state.
The exact model commits initial k in {0,1/2,1}; the adopted task is Open and belief
initially absent. Apparatus displays establish the identity of this sole exercise;
ordinary recognition and generalization are not claimed. A misleading display is
permitted evidence and may establish false self-belief. No private competence field
is projected to cognition.

## Choice and ordering

Original appraisal40 reads only the holder's capability belief. Raw51 reads its
adopted task and supplies one base402 strength1, empty evidence basis400, own task
ground and exercise option. Reasons52 uses inherited reason-dice/0.1-candidate.
Decision60 uses exact inherited arbitration over the one admitted option, necessarily
Auto; no new weighted choice or RNG law. Intent70 → frozen expression80 (alignment1)
→ plan90 → attempt100 → execution110 → observation120; distinct adaptation140 and
belief learning140 follow. A previous performance mean is an explicit appraisal
operand, not a hidden execution parameter. The single-option instruction holds choice
fixed for the experiment; broader confidence-sensitive option choice remains OPEN.

Generated children carry exact live parents. The executor alone receives the physical
original matched to this authenticated opportunity. It reads actual skill, computes
engagement/outcome, and emits two disjoint records: safe-observation input and typed
truth-side practice798. The latter identifies this actual attempt, engaged/practice
flags and impairment. The observer sees only the controlled visible result and whether
the exercise engaged. No visible report when feedback is hidden. No engagement means
no performance sample, even if the monitor is configured to show success. Observation
IDs are profile-local1153; they do not pretend to be SEM experiences or inherited
ObservationRef237. The safe performance source is admitted solely by this consumer.

## Exact competing mathematics

Baseline effective execution e=k(1-i); serious comparator e=max(0,k-i).
Success iff engaged and e>=d, with inclusive equality, exact rationals, no rounding.
PracticeLinear: k'=min(1,k+1/4). PracticeResidual: k'=k+(1-k)/2. NoPractice: k'=k.
Apply only when an actual engaged attempt has practice mode on. A failed engaged
exercise can still supply practice; a blocked or absent attempt cannot. Increment
practice count on each accepted practice exposure even at saturation; NoPractice
does not apply or increment. No belief, report or recollection is needed for adaptation.
Normal temporary impairment never writes retained skill. Recovery is a new i=0
physical opportunity with exactly the same retained skill unless separately practiced.

Belief is an empirical expectation of this exercise's observed performance, not a
causal estimate of latent k and not calibrated probability of correctness. EvidenceMean
uses n'=n+1, m'=(n*m+x)/(n+1), x=observed success0/1. LastObservation uses m'=x with
the same support accounting. NoLearning is inert. Unknown is absent state; observed
zero is present mean0. Only visible engaged performance qualifies. Every accepted
sample has a unique safe occurrence; duplicate support rejects. At most eight samples.
Neither missing feedback nor physical practice manufactures belief evidence.

Diagnostic controls, never legitimate baseline laws: BeliefAsSkill substitutes prior
mean (unknown→0) for k in execution; IntentEqualsSuccess makes every engaged attempt
succeed; ImpairmentAsUnlearning subtracts i from retained k at140 (floored0) even
without practice, before any accepted practice update. Each must fail a named contrast.

## State, authority and traces

Root785 maps the sole character to784(k,practiceCount), written only by existing
authority/procedural-skill. This is a successor single-procedure representation;
the accepted Campaign2 root303/count-based ADAPT controls remain unchanged.
Root787 maps that character to786(mean,count,support1153), written only by
authority/capability-belief. Root373 adopted status is read-only here. All paths are
exact and model-registered. Execution reads skill; BeliefAsSkill additionally reads
belief as an explicitly violating control. Adaptation reads only skill; learning only
belief. All physiological and procedural truth remains outside cognitive consumers.

Trace160 separately records belief appraisal, raw/nuclei, intent/expression/plan,
attempt, physical skill/impairment/difficulty/effective execution/result, safe feedback,
truth practice, before/after adaptation, before/after belief, actual reads and owner
patches. No character-side handler can use trace as evidence. Belief140 affects only
later40; skill140 affects only later110. Same-instant ordering cannot retroactively
change intent or outcome. Adaptation and belief learning have disjoint owners/paths.

## Admission, persistence and qualification

SKILL_PUBLIC_ALLOCATION_TABLE.json fixes records782..802, namespace1153, schema1.
Model bytes commit every parameter, owned leaf, stage registration and fixed content;
public preparation accepts only the frozen cohort. Data-only ingress rejects getters,
unknown fields, foreign initial state, malformed or generated source records. Private
complete event fingerprints authenticate originals/children; runtime allocator supplies
every occurrence. Twelve stage kinds, exactly12 events per opportunity. Max work12;
instant failures roll back outputs, state, children and allocators; failed runs terminal.
Canonical saves require complete-prefix reexecution and whole-byte equality, including
trace, queue, outputs and allocators. No partial-instant restore or callback API.

Freeze matched inputs before outcomes. Require actual-k-only, impairment-only and
display-only interventions; exact frozen intent/expression/plan equality under hidden
physical changes before feedback, and throughout hidden-feedback histories. Include
skilled/insecure, incompetent/confident, practice with stale belief, impairment/recovery,
blocked/no-practice/no-feedback, unknown/zero, threshold boundary and serious-law
discrimination. Preserve old reasons, identity-learning and ADAPT tests; no new
identity update, habit law, episodic-memory reduction or universal learning law.
Reopen for multiple skills, rust, transfer, automaticity, execution noise, ordinary
feedback attribution, interference attribution, confidence-sensitive choice or body/
control integration. Broader Brief12.8 remains unqualified by this finite profile.
