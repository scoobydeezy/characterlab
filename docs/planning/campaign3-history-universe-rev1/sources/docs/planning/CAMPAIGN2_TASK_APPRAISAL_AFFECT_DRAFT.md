# Task forecast appraisal and transient concern

Status: DRAFT
SeamId: seam/task-appraisal-affect (symbolic)
Version: task-appraisal-affect/0.1-draft
Architecture edges: active workspace + goal criterion → appraisal → affect → motive context
Owner: separate appraisal and affect transitions; no persistent state owner
Depends on: task-workspace/0.1-draft; task-commitment/0.2-candidate; measurement-prediction/0.2-candidate;
exact rational substrate; ordering-phases/2-candidate; pending receiving profile
Supersedes: nothing; this does not modify OutcomeEvaluation or CharacterLearningEvidence

## Semantic purpose

Interpret an available forecast relative to an adopted measurement goal, then derive
a separately traceable transient concern response. Appraisal here means forecast–goal
discrepancy only. It does not judge character, moral worth, success, causation or reward.
The prior OutcomeEvaluation remains its accepted conservative evidence-carriage seam.

## Required phenomena

Equal forecast with distinct desired intervals gives distinct goal-relative assessment.
Known within-range forecast produces known zero discrepancy; unavailable forecast
produces no numeric discrepancy. This appraisal cannot retire a task or manufacture
an independent obligation. Appraisal and affect must be separately ablatable.

## Domain and codomain

Symbolic records with fields in listed order, not permanent allocations:

* TaskAppraisalItem: TaskCommitmentKey, Assessment.
* TaskAssessment: closed union UnknownForecast, Below, Within, Above. Below/Above
  carry exact positive Distance; Within carries no field (defined distance zero);
  UnknownForecast carries no field and has no numerical distance.
* TaskAppraisal: AppraisalOccurrenceId, Workspace (the exact TaskWorkspace output),
  Assessments (ordered list of TaskAppraisalItem).
* TaskConcernDefinition: Gain (exact rational0..1), Enabled (Boolean).
* TaskConcernItem: TaskCommitmentKey, Response.
* TaskConcernResponse: Unavailable or Known. Known carries exact Intensity in[0,1];
  Unavailable carries no number. It makes no claim of a known absent emotion.
* TaskConcern: ConcernOccurrenceId, Appraisal (the exact TaskAppraisal output),
  Responses (ordered list of TaskConcernItem).

Nested admitted outputs carry the actual permitted causal operands through this
finite three-record chain. They are exact immutable payloads, not additional state
authorities or independent evidence. No separate copied forecast/support or task
criterion is added beside Workspace. Every list has exactly the same task keys and
order as its source workspace. Empty workspace yields empty assessments/responses.

One occurrence per transition, allocated by the shared output identity rules even
for empty lists or disabled concern. No new observation, learning-evidence or task
instance occurrence is created. These outputs are not admitted to EVID automatically.

## Units, ranges, and applicability

Forecast m and task interval[l,u] use the admitted prediction reading domain[0,10].
Distance uses that same domain's reading unit. Intensity is dimensionless. The10
denominator below is the exact declared span, not an OBS↔REG unit conversion. Gain
is one model calibration shared by all tasks, never authored per-character pressure.

## Registered ReadDomain and capability-limited projection

Both transitions read no character state. Appraisal consumes only its authenticated
live Workspace and the selected TaskSpecRefs through the closed model projection.
Affect consumes only its live Appraisal and its one committed concern definition.
They receive neither a general registry iterator nor a prediction/task state handle.
Character identity is inherited from the generated workspace; no new ObserverId
mapping, other-holder lookup or caller-authored CharacterId is admitted.

## Actual-read recording and derived-input provenance

Actual character-state read sets are empty here; previous workspace reads remain
at that transition's trace. Name immediate generated source occurrences and immutable
calibration/spec operands. Do not falsely report those operands as a fresh belief
read. Retain the original support refs only within the one nested workspace value.
No consumer may count the new appraisal/concern IDs as independent sensory evidence.

## Authoritative StatePatch writes and sole MutationAuthorityId

WritableStateFamilies={}. No patch, persistent affect update, goal retirement,
belief learning or regulatory impulse. These are event-local conclusions, which
may exist with every persistent family byte-identical.

## Epistemic permissions and forbidden knowledge

No actual outcome, REG, displacement, truth evidence graph, efficacy belief, reward,
causal attribution, surprise, confidence, identity or social judgment. A forecast
inside a desired interval is not actual task satisfaction. Unknown is not calm,
zero concern, pessimism or optimism. An affect-disabled control is instrumentation,
not a character conclusion that concern was impossible.

## Preconditions

Appraisal receives only the exact workspace emitted by its registered parent40
event; affect receives only the exact appraisal from its parent50 event. All selected
tasks are current-source authenticated, with the same holder/criterion and no duplicate
keys. Historical trace records cannot be reintroduced as live payloads. Definition
references and exact rational domains close at model construction.

## Totality, typed failures, instant rollback, and failed-run behavior

Lists have0..2 items; formulas below are total on their finite bounded domain.
Malformed source, incorrect parent or altered nested payload rejects before evaluation.
No invalid numeric operand is converted to Unknown. Preserve the existing admission,
role, output validation and trace failure owners. Whole-instant rollback includes
all output/event identities and private associations. Failed runs remain terminal.

## Exact transformation

For each selected task in workspace order:

    Forecast=Unavailable: UnknownForecast
    Known(m), m<l:        Below(Distance=l-m)
    Known(m), l≤m≤u:      Within
    Known(m), m>u:        Above(Distance=m-u)

The inclusive endpoints give Within. Unknown has no hidden default m. Appraisal
always emits exactly one TaskAppraisal and schedules one affect child at50, same
instant, strictly later EventSequence and actual parent.

Affect preserves the task order. If Enabled=false or assessment=UnknownForecast,
Response=Unavailable. Otherwise:

    d = 0 for Within, else the assessment's positive Distance
    Response = Known(Intensity = Gain*d/10)

No clipping, rounding, sign reversal, accumulation or independent base pressure.
Gain=0 with known assessment gives Known(0), distinct from Unavailable. Trace records
Disabled versus UnknownAssessment as diagnostic causes when relevant; these causes
are not additional psychological fields. Affect emits exactly one TaskConcern and
schedules one motive-context child at60 with that exact output, even when empty.

The downstream motive contract must explicitly govern how concern modifies an
already-present motive; this seam does not choose that formula. It must not create
a second independent commitment reason merely because concern has an occurrence ID.

## Random addresses and distribution mapping

No RNG. Each transition consumes exactly one runtime output ordinal in every valid
branch; one generated child each. No state-dependent allocation drift.

## Quantization and rounding points

None. Exact subtraction, multiplication and division by10 on canonical rationals.
0≤d≤10 and0≤Gain≤1 prove0≤Intensity≤1. No finite-precision underflow or saturation.
Later reasons/dice quantization must be a separate registered boundary.

## Canonical collection ordering and tie rules

Preserve source workspace order, requiring exact one-to-one key coverage. No sorting
by concern magnitude is performed. Set cardinality of prediction support affects
neither appraisal distance nor concern gain in this version.

## Event phase and timing semantics

Workspace40 → appraisal50 → concern50 → motive context60. Same-phase child scheduling
is allowed by ordering/0.2-candidate when the child's sequence follows its cause.
No phase subdivision or registry edit is needed. Concern cannot recursively alter
its source workspace or current appraisal. No51/52 impulse or phase30 belief read.

## Postconditions

One assessment/response for each selected task; empty remains empty. No actual-world
success claim; no persistent change; exact parent chain and source operands preserved.

## Invariants

Goal-relative meaning; known zero≠unknown; separate appraisal/affect; calibration
is not content psychology; no source duplication; no appraisal-to-intent shortcut;
no trace as knowledge; no learning merely from generating a conclusion.

## Trace records and provenance

Reuse160 with immediate source identity, exact generated output and child. All
records retain the successor's actual model/run identity. Separate transitions
permit removing affect without substituting authored appraisal or input outcomes.
Nested immutable sources are not a new provenance graph and grant no resolver beyond
the admitted payload. They are not archived by a new memory seam in this version.

## Candidate mechanisms and control implementations

Exact interval discrepancy is a narrow candidate appraisal model. The proportional
concern gain is a replaceable calibration mechanism, not established affect science.
MEC-001/002/006 and RET-003..006 preserve exact domains, no false precision and no
hidden overflow shortcuts. MEC-007 semantic salience remains separately controlled;
no claim that this concern computation replaces salience or generic appraisal.

## Competing models / ablations

Same forecast/different goals; same goal/different permitted readings; known zero,
unknown and in-range forecast; gain0/positive/1; affect off with appraisal retained;
capacity removal upstream; forbidden truth/REG substitutions downstream. Later
nonlinear affect and affect feedback are explicit future competitors.

## Equivalence relation and tolerances

Exact semantic outputs with declared occurrence bijections, zero numerical tolerance.
Diagnostic absence causes may differ while semantic Unavailable is identical.
Do not equate model identities across changed gains or controls.

## Proof obligations and executable tests

TA-A..J, all NOT PASSED: A exact parent/payload admission; B inclusive interval
endpoints and maximal distances; C unknown versus known zero; D same forecast and
incompatible goals; E exact gain endpoints/no clipping; F separate affect ablation;
G empty/one/two key coverage; H zero reads/writes and no forbidden resolver; I ordinal,
same-phase scheduling and atomic rollback; J mutants for unknown-as-zero, truth
comparison, copied independent evidence, direct retirement and affect-as-base-motive.

## Applicable Campaign 0 conformance vectors

Exact rational encoding; union shape and canonical lists; output occurrence binding;
causal child ordering; scoped reads; trace, rollback and deterministic replay.

## Known domain exclusions

General emotional taxonomy, persistent mood, arousal, bodily impulse, reward learning,
appraisal confidence, efficacy/controllability, intentional attribution, value judgment,
affect feedback, full motivation, options/reasons/arbitration and identity learning.

## Unresolved decisions

Receiving transition/output/occurrence/profile declarations and numeric allocation;
exact downstream motive-context receiving contract; full trace/persistence closure.
Whole shape remains withheld. No source implementation follows from this draft.

## Reopen conditions

A supported phenomenon needs another appraisal dimension or evidence quality;
concern influences a later cycle; enduring affect or regulatory impulses are required;
another reading domain invalidates this fixed span; later evidence consumer admission.

## Change history

Revision1 fixes a conservative forecast–goal meaning, separates transient concern,
preserves unavailable versus known zero, and confirms same-phase scheduling from the
actual accepted ordering contract. No new mathematics is inserted into EVID or REG.
