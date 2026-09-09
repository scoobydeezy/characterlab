# Task lifecycle registration and stage closure, revision2

2026-09-09. Agent proposal. This consolidates the corrected lifecycle directions;
it is not a numeric allocation or runtime qualification. Earlier draft bytes remain
historical. Where earlier proposals conflict, self-reviews2–3 and this document govern
the next candidate. Whole-shape self-review remains required.

## Separate lifecycle readiness from downstream design

The lifecycle produces retained status and no semantic output. Its exact meaning
does not depend on an unfinished appraisal, motive, option or identity formula.
Those consumers require their own contracts and may not delay a shape-complete
lifecycle merely because they are future topology work. Conversely lifecycle
qualification cannot claim those consumers work.

## Complete lifecycle payload inventory

New record names are symbolic. Fields are ordered as listed, all required unless
explicitly tagged optional. Existing numbers refer only to already allocated schemas.

| Record | Fields |
|---|---|
| TaskCommitmentSpec | HolderContentId; PredictionDefinitionId; DesiredMinimum:rational; DesiredMaximum:rational; ActiveFrom:SimInstant; Deadline:SimInstant |
| TaskCommitmentKey | CharacterId; TaskReferent |
| TaskCommitmentStatus | VariantTag; ObservationRef:237 optional; ObservedAt:SimInstant optional |
| TaskCommitmentState | Commitments:map<TaskCommitmentKey,TaskCommitmentStatus> |
| TaskMeasurementTargetRequirement | SubjectAccessor; TaskSpecIds:set<RegistryDefinitionId>; TargetStatePathTemplate:149; OutputAccessor |
| TaskMeasurementRegistration | ExecutingSeamId; ExecutingSeamVersion:text; InputAdmission:274; ReadDomain:set<149>; OutputDefinitions:set<277>; WriteCapability:322; IngressDefinition:276; SubjectRequirements:set<343>; TargetRequirements:set<TaskMeasurementTargetRequirement> |
| TaskDeadlineRegistration | ExecutingSeamId; ExecutingSeamVersion:text; InputRecordSchema:254; ConsumerEventTypeId; ReadDomain:set<149>; OutputDefinitions:set<277>; WriteCapability:322; TargetStatePathTemplate:149; OutputAccessor |

Status variants remain Open, PerceivedSatisfied and DeadlineMissed. Only
PerceivedSatisfied has both optional fields; all other payload combinations reject.
ObservationRef is the original237 Observation variant. There is no Deadline field,
status occurrence, task-instance namespace or retirement-output record.

The new registration types deliberately do not pretend274 can authenticate a
host-created initial deadline. The exact deadline source construction belongs to
this version plus the private association. It is not a new generic producer tag in275.
TaskDeadlineRegistration names its input schema and event; fixed semantics require
initial association, exact Deadline/140 and no parent. No clock ingress276 is invented.

## CONTENT and identity closure

Exactly one qualified character and0..2 concrete tasks are admitted. Each task170
has unique1038 StableId and exactly one unique spec1027 reference. The mapping is
bijective between the task-content subset and the task-spec subset; sharing a spec
or an orphan spec rejects in this first profile. Criteria may be equal; windows may
overlap. The holder is the same qualified character, not the task's identity.

For a task170, fields3/7/8/10/11/16 are each the same one-element list of its spec ID.
Field12 is exactly the one-element HolderContentId list. Fields4/5/6/9/13/14/15 are
empty lists. Fields1/2 are its1038 ID and semantic-kind/task-commitment. No other
field or psychological parameter is admitted. The fixed specialization defines the
spec-reference delegation as recorded in self-review2.

Register329/1 under semantic-kind/task-commitment with exact new version
task-content-kind/0.1-candidate and schema170/1. Register330/1 under
validator/task-qualification with RequiredSemanticKind equal to that new kind and
version task-domain-validator/0.1-candidate. These are proposed member/version names,
not previously frozen values. The existing character entries and their meanings
are retained exactly. A new supported-kind compiler must actually validate both
specializations, not pass task content through the old character-only callback.

TaskReferent is exactly1002(1037(complete task1038 ID)). Its domain predicate requires
committed task kind; CharacterId still requires the unchanged character predicate.
The task predicate never qualifies a stakeholder or a runtime-origin referent.
HolderContentId is1038 structurally; static spec validation requires character-kind
content. It is not a CharacterId or an alternate IDN roster field.

Every TaskCommitmentKey position has roles: field1 namespace1002/character validator;
field2 namespace1002/task validator. Repeat those exact constraints for the new root's
StateMapKey positions as required by existing map-key role ownership. Spec field1
uses1038 with no DomainValidator; field2 uses1027 with no DomainValidator and exact
definition-kind closure. Existing237/2 and nested203 roles are reused once.

Seam/event/accessor/authority/definition fields use their existing namespaces and
no DomainValidator. TaskSpecIds has definition-kind/equality checks, not a new namespace.
The output accessor returns exact selected key/prior associations under the new
target contract; it is neither an arbitrary derive callback nor a public selector.

REG receives only the qualified character image of the complete two-kind content.
It must not fabricate task anchors. Construction proves the projected character
subset equals that image; original one-kind profiles and digests remain unchanged.

## Explicit topology extension

Propose family/prospective-commitments with physical TaskCommitmentState root and
authority/prospective-commitments as sole writer. Both lifecycle transitions join
route/prospective-control. The ten accepted family rows retain their exact routes,
physical roots and owners. The successor has eleven rows and total coverage.

Measurement M1 remains on character-learning;342 has this one additional named
consumer. AutomaticAdaptationInput is not admitted here. Neither lifecycle
transition is inserted into character-learning or automatic-adaptation. Their output
closures are empty, with actual mutation coverage supplied by the explicit new family.
No result is relabelled as learning evidence to force route membership.

## Exact measurement registration

InputAdmission274 names342/1 and its actual M1 producer under the successor's retained
M1 version. RequiredSourceRelation and ingress276 use the accepted immediate-output
child semantics: same DueAt, phase140, exact produced payload, one child. Subject
requirements contain exactly the existing nested343 ObserverId path[2,2,2] to the
accepted IDN roster projection. No second identity binding is introduced.

The target requirement's TaskSpecIds equals the complete task-spec subset. Its
SubjectAccessor is the accepted ResolvedCharacterSubject. For each matching holder
and criterion with ActiveFrom≤T<Deadline, resolve the exact concrete key from its
bijective content/spec mapping. Target set is0..2 unique keys, ordered canonically.
Selection does not read status and does not drop an absent or terminal target.
Only after full-stage target admission does the executor read each prior once.

ReadDomain is roster plus new root's exact owned-leaf template. OutputDefinitions
is empty. WriteCapability names only the prospective authority/family. Source342
must carry the same admitted point/channel/subject/unit/time domain as the predictor;
no widened precision, bounded interval or unknown observation is silently accepted.
Do not make task settlement depend on the prediction application being enabled.

Absent/terminal prior: NoChange. Open active prior with inclusive desired-interval
membership: Replace with PerceivedSatisfied(original237ref, observed time). Otherwise
NoChange. No insertion, removal, forecast read or fresh occurrence. Two eligible
tasks may both be perceived satisfied by the same observation; their distinct state
changes do not turn that one observation into two independent sensory samples.

## Exact deadline registration and S0

Input schema is TaskCommitmentKey. ReadDomain is only the exact task-leaf template;
there is no IDN read because the source is the compiled initial task association,
not a new observer-bearing external input. OutputDefinitions is empty; WriteCapability
names the same sole prospective owner/family. Full key/holder/spec equality is checked
against that private association before its prior is read.

S0 contains any subset of declared keys, all Open; unknown/foreign or terminal initial
keys reject. Runtime never inserts/removes. Other families retain their initial-state
rules. Every declared key gets a deadline event, including an unadopted task.

Compile all original inputs first. Then in canonical complete task-key order allocate
one shared EventId/Sequence per declared task. Each event has DueAt=its Deadline,
phase140, exact registered deadline EventType, key payload, empty dependencies, no
causal parents. Bind the complete scheduled-event value privately. Shared allocator
overflow retains the scheduler's existing failure; no wrap, private occurrence counter
or renumbering. Deadline creation/execution consumes zero runtime output ordinals.

At the due event, absent or terminal status is NoChange; Open becomes DeadlineMissed.
No measurement at T=Deadline can target that key because the window is half-open.
A different task active then remains eligible. Structural state permits Open before
the legitimate deadline handler, while final quiescent validity requires every
present expired key to be terminal. REG's pre-instant retained-D checks are unchanged.

## First successor original-input grammar

Actual orderedInputs.ts currently requires each probe instant to contain exactly one
original source. Preserve that rule for its old profiles. The task successor may
add one DeliberationOpportunity/40 per instant alongside at most one existing
probe/110 or the previously admitted authored-fact source grammar. It may also admit
a deliberation-only instant. Probe and authored facts remain mutually excluded at
one instant. This successor does not yet admit an action-generated world producer.

The probe-derived M1 chain remains unique per instant. Initial deadline events are
not original sources and do not invalidate that source uniqueness. Diagnostic reads
at later40 remain independently generated. A final packaging table must enumerate
all fixed model versions and exact original-entry carriers; this rule alone does
not authorize public factories to accept arbitrary40 events.

## Exhaustive lifecycle140 group grammar

Let A be an existing valid ADAPT group, P the complete memory/prediction group, S
the single prospective measurement slot, and D the set of0..2 due deadline slots.
The admitted nonempty stage forms are exactly:

    A + D
    P + S + D
    D

Absent A/P corresponds to a pure-clock stage. P and S must share the same actual
M1 parent/payload and permission branch. S is mandatory even when it resolves no
tasks. On suppressed M1, P's existing padding pair is accompanied by one empty
privately bound S-padding slot. Padding has no route, IDN/read/write/output and
consumes no runtime output ordinal. Missing S, real/padding mismatch, unmatched
parent, duplicate S, extra140 event or A+P all reject before prior evaluation.

Resolve source/roles/subjects/target paths for every group before any group's prior
evaluation. Canonical target intersection across prospective writers is empty:
one measurement dispatch has unique keys; due clocks have unique keys; half-open
windows exclude each due clock key from measurement. A violated intersection fails
TASK_TARGET_COLLISION; no "first writer wins" repair or priority is permitted.

Every admitted group evaluates from the same140 B0 with its own exact reads/patch.
Sibling prospective operations are distinct-key replacements. Composition applies
only authorized paths; no prospective operation can write memory, prediction, REG/D
or any other family. Global stage preflight is not permission to bypass each group's
own source and lifecycle checks. Each planned handler must execute exactly once in
the frozen plan before finish. Reentrant, skipped, duplicated or late new-task
operations fail TASK_STAGE_VIOLATION; inherited group failures retain their owners.

New lifecycle handlers emit no semantic outputs or children. The successor M1 adds
one S event allocation to the preserved M1 child sequence, appended after its prior
children. Task count/adoption does not change that slot. Deadline slots were already
allocated initially. New prediction or memory writes remain independently ablatable.

No private checkpoint is published until all groups can commit. Trace/invariant/
patch/occurrence/queue failure discards state, trace, outputs, emitted children,
allocator movement and all private association consumption for the entire instant.
Final traces use actual group patches/diffs and the successor's model/run identity.

## Persistence, vectors and residual gates

Restore replays the complete original S0/input prefix with the successor's deterministic
initial deadline schedule. Compare complete save bytes and exact pending association
bijections, including unmatched/removed/duplicated deadline and S events. Terminal
support is authenticated through replay, not merely structural237 validity. Empty
task adoption and terminal history remain distinguishable, with equal deadline slots.

TC-A..L remain NOT PASSED. Add explicit controls for two overlapping tasks, both
satisfied by one observation, one expiring while another is satisfied, absent task
deadline slots, terminal recurrence, each140 group form, missing/mismatched S, stage
lifecycle mutants, non-task content exclusion and REG's qualified-character image.

Next review must audit role/registration expressibility against actual substrate and
the standalone task lifecycle before allocation. Workspace/appraisal/motive readiness
is separate. The final executable model must still close exact source versions,
numeric/profile/bundle identities, trace accounting and persistence before activation.
