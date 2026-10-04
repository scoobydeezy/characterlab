# Bounded task workspace

Status: DRAFT
SeamId: seam/task-workspace (symbolic)
Version: task-workspace/0.1-draft
Architecture edges: prospective context + owned prediction → active workspace → appraisal
Owner: active cognition
Depends on: qualified task-commitment/0.2-candidate; measurement-prediction/0.2-candidate;
identity-binding/0.5-candidate; ordering-phases/2-candidate; transition admission;
pending cognitive registration and successor profile closure
Supersedes: no accepted contract

## Semantic purpose

Construct bounded, event-local cognitive operands. Availability for thought is
separate from enduring knowledge and from the conclusion subsequently appraised.
The first candidate prioritizes an adopted task, a shared forecast, then a competing
task. This is an experimental selection policy, not a universal attention law.

## Required phenomena

The same retained forecast can support different assessments under different adopted
tasks. Capacity can withhold a competing task without deleting it. Absent prediction
must differ from learned zero. Retired, dormant and unadopted tasks produce no active
task operand. No evidence from another holder is accessible.

## Domain and codomain

All names below are symbolic and unallocated. Fields are ordered as written.

* DeliberationOpportunity: ObserverId, AgendaDefinitionId. An original phase40 input;
  no task state, forecast, appraisal, pressure or chosen option in its payload.
* TaskWorkspaceDefinition: PredictionDefinitionId, Capacity, TaskAccessEnabled,
  ForecastAccessEnabled. The agenda registry ID identifies this immutable definition.
  Capacity is an integer0..3. The two booleans are named model controls, never input
  callbacks or character-authored per-task attention flags.
* WorkspaceTaskItem: TaskCommitmentKey, TaskSpecRef. The reference resolves to the
  sole immutable criterion/window. Neither status nor goal values are copied into
  a new persistent authority. Generation authenticates that this task was active.
* WorkspaceForecast: a closed union Unavailable or Known. Known alone carries
  PredictionValue/361, preserving its exact support set. Unavailable has no numeric
  payload. It means no forecast operand is maintained, not a belief that no forecast
  exists. There is no negative evidence or zero-strength prediction variant.
* TaskWorkspace: WorkspaceOccurrenceId, CharacterId, AgendaDefinitionId, Tasks,
  Forecast. Tasks is an ordered list of0..2 distinct WorkspaceTaskItems. Forecast is
  WorkspaceForecast. The one shared Known value serves every retained task.

WorkspaceOccurrenceId is a future typed occurrence allocated through the existing
runtime occurrence mechanism. It is not a task, observation or prediction identity.
No new identity for the forecast or individual task items is allocated. The workspace
record is a semantic output, not a new persistent state family.

The non-cognitive trace records separately why a forecast was unavailable:
NoSelectedTask, CapacityExcluded, AccessDisabled or PriorAbsent. These are exhaustive
ordered branch outcomes of the procedure below. Downstream appraisal cannot read
this instrumentation or reinterpret an ablation as character knowledge.

## Units, ranges, and applicability

Reuse the one admitted prediction criterion and its exact0..10 reading domain.
All declared tasks have that criterion and the one qualified holder; at most two
concrete instances are declared. Task windows may overlap. No salience magnitude
is computed from task IDs, deadline ordinals or support counts.

## Registered ReadDomain and capability-limited projection

Admit only the authenticated original opportunity, then its ObserverId through IDN.
When task access is enabled, read each declared key belonging to that derived holder
once in canonical key order. No all-character state iterator is exposed. When access
is disabled, read no task priors. No prediction read occurs without a selected task,
capacity≥2 and forecast access. The only allowed prediction key is the derived
CharacterId plus the definition's PredictionDefinitionId.

Task definitions are immutable model operands, not character-state reads. The
receiving projection can expose a spec only for a selected, adopted active key.
Authored availability alone is not permission to expose third-party task context.

## Actual-read recording and derived-input provenance

Record actual IDN, task-status and prediction reads, including an absent key result.
Tasks that are ineligible still have actual reads if task access required inspecting
them. Never report a retained value or status as read when a control skipped it.
The Known forecast retains the original Observation support references inside361;
one new workspace occurrence does not create another independent sensory sample.
Trace160 binds the opportunity and the generated workspace. No parallel provenance
graph or trace-reading psychological API is introduced.

## Authoritative StatePatch writes and sole MutationAuthorityId

WritableStateFamilies={}; no persistent writes or mutation authority. The workspace
is maintained for this causal event through its immutable output/child payload.
It does not overwrite prediction, prospective status, memory or identity.

## Epistemic permissions and forbidden knowledge

No REG, D, world outcome, omniscient provenance, other-holder state, reward or action
efficacy lookup. Prediction support cardinality is provenance, not confidence or
goal importance. Neither deadline order nor model calibration becomes a value judgment.
Unavailable never means the predicted reading is zero or the task is unimportant.

## Preconditions

Exact new original-input kind and agenda are admitted by the successor profile.
At most one deliberation opportunity for the holder per instant is admitted in this
first profile. A prediction diagnostic read366 is neither required nor substituted
for this opportunity. Task/content/role and agenda references close at construction.
Read capability is issued only after actual admitted source and IDN checks.

## Totality, typed failures, instant rollback, and failed-run behavior

Finite0..2 status reads and at most one prediction read make selection total. Invalid
source/agenda rejects before status access using the existing admission failure owner;
invalid identity retains IDN's failure owner. Malformed state is not Unavailable.
No fallback to another character or another prediction definition is permitted.
Output validation, trace validation or child scheduling failure rolls back the entire
instant, including occurrence/event allocation and pending associations. Failed runs
remain terminal. Exact successor stage errors remain a packaging obligation.

## Exact transformation

1. Authenticate opportunity and resolve holder through IDN.
2. If TaskAccessEnabled, inspect the finite declared holder keys. Eligible means
   present Open status and ActiveFrom≤T<Deadline. Otherwise eligible list is empty.
3. Sort eligible tasks by increasing Deadline, then complete canonical key bytes.
4. If Capacity=0 or the list is empty, Tasks=[], Forecast=Unavailable; trace reason
   NoSelectedTask. Do not read prediction.
5. Otherwise retain the first task. If Capacity<2, Forecast=Unavailable with
   CapacityExcluded. Else if ForecastAccessEnabled=false, use Unavailable with
   AccessDisabled. Else read the one prediction key: absence gives Unavailable with
   PriorAbsent; presence gives Known with the exact361 value.
6. If Capacity=3 and there is a second eligible task, append it. This selection is
   independent of forecast presence/access: withholding the forecast does not donate
   its reserved slot to a second task under Capacity=2. This fixed slot policy makes
   the capacity and read-access interventions separable.
7. Emit one TaskWorkspace even when empty. Schedule exactly one generated appraisal
   opportunity at the same instant phase50 with that exact output as payload.

Only Known counts as a retained forecast item. Unavailable is a structural absence
marker, not an additional cognitive item. Thus retained item count is never greater
than Capacity, although a reserved forecast slot may be unused. This candidate is
not a work-conserving packing algorithm; that is a separately named possible control.

## Random addresses and distribution mapping

None. One runtime output ordinal in every valid branch, including empty workspace.
That reserves no RNG draw and does not qualify PERSIST-I.

## Quantization and rounding points

None. Exact stored rationals are copied without rounding; no new numeric inference.

## Canonical collection ordering and tie rules

Tasks preserves the declared selection order. This is a list, not a canonical set
whose encoder would erase that order. Complete typed keys break equal deadlines.
They never supply intensity. Support sets inside361 preserve existing canonical order.

## Event phase and timing semantics

Original opportunity executes at40; generated appraisal at50 with later sequence and
its actual parent. All workspace reads use the state visible under the existing
runtime's instant semantics. This version requires no phase30 belief update or read
after a same-instant140 prediction write; the latter is visible only at later instants.
No declaration resolves ORD-001. Phase40 diagnostic read366 remains independent.

## Postconditions

Every retained task was an adopted active task for the holder at generation time.
The shared known forecast is byte-identical to the one actually read. All persistent
state is byte-identical. Exactly one workspace output and one appraisal child exist.

## Invariants

Capacity bound; holder isolation; no fabricated adoption; no forecast duplication;
unknown≠known zero; expiry/retirement exclusion; trace is not a cognitive source;
no preference, action choice, efficacy, truth comparison or learning in selection.

## Trace records and provenance

Reuse trace160 and normal source/actual-read/output/child relations. The opportunity
is an original event, so do not fabricate an upstream observation occurrence.
The appraisal consumer admits only this live generated output, not arbitrary bytes
or a historical workspace loaded from trace. Historical outputs may be inspected by
research tools but cannot become runtime opportunities without a future admission seam.

## Candidate mechanisms and control implementations

MEC-005: preserve attention versus perception separation; this candidate is post-
perceptual maintained context, not a replacement observation gate. MEC-007/CTL-004
remain required salience controls where semantic salience is exercised; this exact
deadline policy neither ports nor retires their multiplicative mathematics.
RET-002 per-concept authored attention flags remain rejected. Uniform model controls
are experimental ablations, not content-level psychological conclusions.

## Competing models / ablations

Capacity0/1/2/3; task access on/off; forecast access on/off; initial adoption subset;
learned zero versus absent prior; incompatible active tasks; earlier deadline and
canonical tie; dormant/retired/expired instances; unchanged hidden REG/adaptation.
Work-conserving packing and semantic salience are future competing policies, not
undocumented alternatives inside this version.

## Equivalence relation and tolerances

Exact payload/read/state equality under declared occurrence bijection; no tolerance.
Compare semantic payload separately from trace instrumentation when two causes of
Unavailable differ. Do not demand identical model digests across policy ablations.

## Proof obligations and executable tests

TW-A..L are proposed frozen vectors, all NOT PASSED: A input/IDN isolation; B adoption
versus available content; C active interval/terminal exclusion; D every capacity and
access branch; E unknown versus known zero; F one shared forecast/read; G deadline
and tie ordering; H no same-instant140 backedge; I exact child/output allocation;
J zero writes and rollback; K replay/source forgery negatives; L read-substitution,
implicit adoption, forecast duplication and overflow mutants.

## Applicable Campaign 0 conformance vectors

Canonical typed collections, exact identity/roles, scheduling, output occurrence,
read-domain enforcement, trace and whole-instant rollback. New composition needs
its own execution; inherited tests do not automatically pass these vectors.

## Known domain exclusions

General attention/salience, maintenance across arbitrary interruptions, spontaneous
deliberation, multitask planning, arbitrary holders/criteria, inhibitory control,
affect feedback, retrieval policy, action expectations and persistent workspace.

## Unresolved decisions

Exact transition/occurrence/profile declarations and allocation; appraisal input
closure and successor trace/persistence binding; component/control qualification.
Whole shape is withheld until those output-affecting registrations are concrete.

## Reopen conditions

Additional criteria need more than one forecast; prospective recall requires another
source; a tested phenomenon requires work-conserving or salience selection; later
affect/control feedback requires an explicit next-cycle input or persistent state.

## Change history

Revision1 incorporates self-review3, separates semantic unavailability from diagnostic
cause, fixes non-work-conserving slot behavior and retains competing tasks without
duplicating forecast evidence. No numeric allocation or runtime implementation.
