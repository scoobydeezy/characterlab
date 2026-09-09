# Concrete measurement-task commitments

Status: CANDIDATE — internal symbolic shape accepted; unallocated, not executable
SeamId: seam/task-commitment (symbolic member)
Version: task-commitment/0.1-candidate
Architecture edges: prospective commitments → later cognitive context;
observer-safe measurement → prospective settlement; declared deadline → settlement
Owner: prospective commitment authority
Depends on: content/0.2-candidate; governed-execution/0.1-candidate;
identity-binding/0.5-candidate; projection-input-field-path/0.1-candidate;
measurement-episodic-memory/0.1-candidate; measurement-prediction/0.2-candidate
for the admitted measurement criterion; ordering-phases/2-candidate; WRT and persistence
Supersedes: the task-commitment/0.1-draft proposal, not any accepted prior seam

## Semantic purpose

Represent an adopted concrete self-commitment to obtain a permitted measurement
inside a desired interval during a finite window. This is not an appetite, actual
world-success judgment, social fulfillment, action-efficacy belief or chosen intent.
The exact task identity differs from its holder and every recurrence.

Normative symbolic registration and stage grammar is
[registration closure](../planning/CAMPAIGN2_TASK_REGISTRATION_AND_STAGE_CLOSURE.md),
with the corrections restated here. Its packaging dependencies remain gates on
activation, not choices left to an implementation. The original draft/reviews are
retained as history; this document takes precedence over contradictory draft text.

## Required phenomena

MEC-020/EXP-013: adopted active-only context, absence and retirement exclusion,
independently identified recurrence, actual generated lifecycle rather than a
caller replacing a live list. Later pressure/identity qualification is separate.

## Domain and codomain

Seven symbolic records and their ordered fields are fixed by the registration
closure: TaskCommitmentSpec, Key, Status, State, TaskMeasurementTargetRequirement,
TaskMeasurementRegistration and TaskDeadlineRegistration. There is no implicit
deadline-association schema; the private association uses the existing complete
ScheduledEvent value.

Spec has HolderContentId, PredictionDefinitionId, DesiredMinimum, DesiredMaximum,
ActiveFrom, Deadline. Key has CharacterId, TaskReferent. State has one Commitments
map from Key to Status. Status is the closed union Open (no payload), PerceivedSatisfied
(original ObservationRef237/tag Observation and ObservedAt), DeadlineMissed (no payload).
Only PerceivedSatisfied has those two fields. No duplicate stored deadline or new
status/observation occurrence is admitted.

Exactly one character and0..2 tasks, with a bijection between concrete task170
content and task-spec registry entries. Task170 fields3/7/8/10/11/13/16 each contain
the same singleton spec-reference list;12 contains the singleton HolderContentId;
4/5/6/9/14/15 contain empty lists.1 is1038 StableId;2 is the new task semantic kind.
Field13 explicitly delegates invariants, correcting the earlier empty13 proposal.
No authored intensity, pressure, belief, interpretation or efficacy is permitted.

## Units, ranges, and applicability

Exact rational0≤DesiredMinimum≤DesiredMaximum≤10, in the selected prediction's
reading domain. Exact instants0≤ActiveFrom<Deadline. Windows may overlap. Active
means present Open and ActiveFrom≤T<Deadline; no forecast can satisfy a task.
M1 input must have the existing exact first-profile point/channel/subject/unit domain.

## Registered ReadDomain and capability-limited projection

Measurement source342 uses the accepted nested343 path[2,2,2] and IDN roster mapping.
Only after authenticating the real generated source and deriving C are matching
holder/criterion/window keys resolved from immutable specs. All keys and paths are
resolved before whole-stage collision preflight; no prior values are read or cached
by that resolution. Then read the0..2 exact priors through bounded capabilities.

Deadline source is the privately authenticated compiled initial key association,
not an observer input. Its only state read is that exact prior. It cannot accept a
public arbitrary key or derive one from a trace/registry iterator.

## Actual-read recording and derived-input provenance

Trace actual IDN and status reads, including absent priors; immutable spec lookups
are model operands. Terminal support is the original observation reference/time.
One observation may satisfy two distinct tasks without becoming two sensory samples.
The immediate source remains342. No trace entry becomes character evidence.

## Authoritative StatePatch writes and sole MutationAuthorityId

One new prospective-commitments family, one TaskCommitmentState physical root,
one authority/prospective-commitments owner and one leaf/task-commitment map field.
Both transitions join route/prospective-control. Preserve the ten previous topology
rows exactly; the successor contains eleven fully covered rows. State writes are
only exact existing-key replacements. Insertion/removal and other-family writes
are forbidden. No semantic lifecycle outputs or runtime output ordinals are produced.

## Epistemic permissions and forbidden knowledge

No REG/D, forecast, truth outcome, efficacy, causal attribution, reward, identity,
social assessment or arbitrary character-state reads. PerceivedSatisfied asserts
only admitted measurement satisfaction. DeadlineMissed is a distinct cause, never
an alias of withdrawal, cancellation or social failure.

## Preconditions

Task kind uses329/1→170/1 and task-domain predicate330/1 under new exact versions
and member identities. Existing character qualification is unchanged. TaskReferent
is1002(1037(complete task1038 ID)); TaskKey role positions and map-key role positions
use character/task qualifiers respectively. Static HolderContentId requires character
content. REG operates only on the actual qualified-character image, not task content.
Full content/reference/role closure occurs before model publication.

S0 may contain any subset of declared task keys, each Open; unknown, foreign or
terminal initial keys reject. Available content alone does not create adopted state.

## Totality, typed failures, instant rollback, and failed-run behavior

Finite targets and exact domains make the transitions total. Existing source/role/
state failures retain their owning errors. New task target collision fails
TASK_TARGET_COLLISION before priors; new skipped/duplicate/reentrant/late stage
operation fails TASK_STAGE_VIOLATION. No failed lookup becomes implicit adoption.
Any failure rolls back the entire instant and all private associations, queue,
allocators, outputs and trace. Failed runs remain terminal.

## Exact transformation

Measurement: absent/terminal prior is unchanged; Open active prior is replaced by
PerceivedSatisfied exactly when the admitted point is inclusively inside its interval.
Otherwise unchanged. Clock: at its exact declared deadline, absent/terminal is
unchanged and Open becomes DeadlineMissed. Neither transition inserts/removes a key.

At T=Deadline measurement cannot target that key, so clock and measurement writes
are disjoint. Every group reads common140 B0. The admitted stage forms are exactly
A+D, P+S+D, or nonempty D, using the definitions in the registration closure. No
implicit mixed dispatcher, per-target priority or anonymous common writer is allowed.

## Random addresses and distribution mapping

No RNG or runtime output ordinal. Initial deadlines use existing shared EventId and
EventSequence allocation after all original inputs, in canonical task-key order,
for every declared key regardless of adoption. Existing allocator overflow fails.
No new task-instance, deadline or private allocator namespace exists.

## Quantization and rounding points

None: exact rational comparison and exact simulation instants.

## Canonical collection ordering and tie rules

Full canonical key order for deadline allocation and resolved target iteration.
No numeric psychological meaning from IDs. Status maps and spec sets use existing
canonical encodings. Task-spec/content mapping is bijective, with no orphan entries.

## Event phase and timing semantics

Deadline is an initial private event at Deadline/140 with key payload, empty dependencies
and no parent. M1 appends one same-instant140 task settlement child after its retained
children; suppression supplies one private empty padding slot. Real/padding mismatch,
missing S or unmatched M1 parent rejects before evaluation. Original-input successor
grammar must expressly admit any new40 deliberation; old probe profiles are unchanged.
No phase30 or same-event belief read/write is required; ORD-001 remains open.

## Postconditions

Terminal status never reopens. Recurrence has a different concrete referent. At
quiescent T≥Deadline every present expired task is terminal; absence remains valid.
This invariant is checked after legitimate deadline settlement, not before ingress.
REG's distinct pre-instant retained-D validity remains unchanged.

## Invariants

Separate holder/task identity; adopted≠available; no immortal or Need-shaped pressure;
no forecast-as-fulfillment; one owner; source-safe support; no foreign state write;
no fabricated lifecycle output; full rollback and exact recurrence preservation.

## Trace records and provenance

Existing160 and shared source/actual-read/patch/diff relations. Deadlines have no
fabricated source occurrence. Restore uses complete S0/input-prefix replay and exact
whole-save/pending-association equality; structural237 validity alone cannot prove
the historical satisfying observation occurred. No mid-instant save is introduced.

## Candidate mechanisms and control implementations

Historical commitmentSignal/live-list remains a control. The new sole lifecycle
authority is the candidate mechanism. Need-shaped, immortal and stakeholder-keyed
substitutions remain negative controls, not active imports from reference.

## Competing models / ablations

Same-model adoption subsets; overlapping tasks; expired/terminal/dormant; actual
measurement versus forecast; inherited observation permission/availability controls;
future independent workspace and motive controls. No unregistered lifecycle-disable
variant is implied by this contract.

## Equivalence relation and tolerances

Exact canonical state/read/patch equality under declared source-identity bijections.
Historical comparison is active context and instance identity, not identical trace
or proof of runtime adoption, social judgment, motivation or acquired identity.

## Proof obligations and executable tests

TC-A..L in the original draft plus the additional registration-closure controls are
frozen NOT PASSED. Full eleven-family coverage, second-kind VAL, same-stage B0,
two-target satisfaction, expiry/recurrence, source forgery, all-stage rollback and
prefix restore must execute. No inherited test automatically passes the new surface.

## Applicable Campaign 0 conformance vectors

CONTENT, canonical roles/collections, exact numerics, WRT, read capabilities,
scheduling/allocator, trace, quiescence and complete save/replay obligations.

## Known domain exclusions

Dynamic adoption/recurrence, relinquishment/cancellation, general social commitments,
action-causal success, learned efficacy, task-plan state, motive/appraisal formulas,
identity mutation and general planning. Those require separate explicit extensions.

## Unresolved decisions

None in this bounded symbolic lifecycle. Permanent record/field/member allocations,
exact executable successor source/profile/bundle/trace/persistence packaging and
runtime qualification remain separate gates. This is not activation authorization.

## Reopen conditions

More holders/criteria, another retirement cause, dynamic adoption, a cognitive
consumer requiring new support, or a changed140 source grammar needs an explicit
successor. The current fields cannot be repurposed for those semantics.

## Change history

Candidate1: agent symbolic review consolidated draft and reviews2–4; preserved
adoption subsets, overlapping tasks, explicit invariant delegation, finite multi-key
preflight, separate clock admission and zero semantic outputs. No numeric allocation.
