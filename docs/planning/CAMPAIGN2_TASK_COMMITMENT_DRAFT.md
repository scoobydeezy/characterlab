# Concrete measurement-task commitments

Status: DRAFT
SeamId: seam/task-commitment (symbolic; unallocated member)
Version: task-commitment/0.1-draft
Architecture edges: prospective commitment → bounded workspace; live commitment →
motive activation; permitted measurement evidence → perceived task completion;
deadline → prospective lifecycle settlement
Owner: prospective goal/commitment authority
Depends on: content/0.2-candidate; governed-execution/0.1-candidate;
content-definition-id/0.1-candidate; referent-origin/0.1-candidate;
projection-input-field-path/0.1-candidate; identity-binding/0.5-candidate;
measurement-episodic-memory/0.1-candidate; measurement-prediction/0.2-candidate;
ordering-phases/2-candidate; pending task-kind and prospective-stage specializations
Supersedes: nothing; historical live-list commitment remains a comparison control

## Semantic purpose

Represent one concrete, finite-lived obligation to obtain a permitted measurement
inside a declared interval. This task meaning is narrower than a general promise,
social duty or appetite. It has its own referent and does not become its stakeholder.
It can supply a live motive without already being a Reason or chosen action.

The desired interval is authored goal context. It is not a forecast, psychological
appraisal, statement of actual world success, or claim that any action will achieve
the goal. A future action-expectation contract must provide the latter distinction.

## Required phenomena

MEC-020/EXP-013: no concrete live commitment means no commitment base pressure;
retirement removes that pressure despite standing identity; recurrence has a new
referent. The first extension must additionally execute, rather than externally
simulate, lifecycle retirement. A perceived satisfying observation can be fallible
about the world without making the character's task appraisal omniscient.

## Domain and codomain

Proposed symbolic inventory, no numeric assignments:

* TaskCommitmentSpec: HolderContentId, PredictionDefinitionId, DesiredMinimum,
  DesiredMaximum, ActiveFrom, Deadline. A registry definition, not a live state.
* A concrete governed content instance of semantic-kind/task-commitment resolves
  exactly one such spec. Its complete GovernedContentDefinitionId is distinct from
  every other concrete instance, including recurrences of the same task shape.
* TaskCommitmentKey: CharacterId and TaskReferent. TaskReferent uses the existing
  authored SemanticReferentId construction over that concrete content StableId.
* TaskCommitmentStatus: Open, PerceivedSatisfied or DeadlineMissed. PerceivedSatisfied
  carries one existing observation evidence reference and its admitted observation
  time; DeadlineMissed carries its deadline. Open has neither terminal field.
* TaskCommitmentState: map of key to status, sole prospective authority. Entries
  are retained after retirement; removing one is not a way to erase history.
* TaskContext: key, exact resolved criterion/window and current active applicability.
  A transient projection result, not a new stored copy of the spec or a belief.

Other terminal causes are deliberately **not aliases** for these two. Relinquishment,
external cancellation and social judgments of fulfillment need their own admitted
cause records and are not accepted by this draft version.

## Units, ranges, and applicability

DesiredMinimum/Maximum are exact rationals in the selected prediction's[0,10]
reading domain, with Minimum≤Maximum. Require the same admitted prediction definition,
channel, observed subject and unit as the measurement consumer. This is not REG
reference arithmetic or a conversion between observation and regulatory units.

ActiveFrom and Deadline are exact simulation instants with0≤ActiveFrom<Deadline.
An Open instance is active exactly when ActiveFrom≤T<Deadline. A future Open task
is dormant; a deadline-due Open task is ineligible pending its same-instant retirement.
Known in-range forecast does not retire the instance: a forecast is not a reading.

No intensity/pressure lives in task content. A separate versioned motive calibration
must determine how a live obligation contributes pressure. This corrects the intake's
ambiguous "authored importance": content may supply goal facts, not raw psychology.

## Registered ReadDomain and capability-limited projection

The later workspace consumer may receive TaskContext only through an exact
character/key projection, after IDN where its admitted trigger is observer-bearing.
It cannot scan other characters' commitments or infer them from world content.

Measurement-driven settlement consumes live342 under a new admitted producer rule,
uses the accepted nested ObserverId path and IDN, then resolves only applicable
tasks for that qualified holder in the finite committed domain. It reads only the
selected commitment prior. It must not read forecast361, REG, trace or an action's
world result to decide perceived satisfaction.

Deadline settlement receives only a privately authenticated initial-instance deadline
association. Its target is fixed by validated initial context; it does not accept
caller-injected CharacterId or an arbitrary task-key field as authority.

## Actual-read recording and derived-input provenance

Record real IDN sources and exact status reads. Criterion/window lookups come from
committed governed declarations, named separately from character-state reads.
No cached derived TaskContext may become a second authoritative status root.
The satisfying support is the existing237 Observation variant, not342's identity
mislabelled as a new observation.342 remains the immediate admitted producer input.

## Authoritative StatePatch writes and sole MutationAuthorityId

Propose one prospective commitment authority, separate from belief, memory and
identity. Its only write is one exact status replacement for the selected existing
key. No insertion, removal, recurrence or definition edit occurs through settlement.
Initial Open instances are constructed only by the new initial-state/profile rule.

The family and route need explicit topology registration; it is neither automatic
adaptation nor a reinterpretation of EVID's zero-write route. This unresolved naming
and composition surface blocks implementation, not the already qualified predictor.

## Epistemic permissions and forbidden knowledge

PerceivedSatisfied means the character obtained admitted observer-safe evidence
satisfying this measurement task. It does not assert actual social fulfillment,
successful intention, action causation, moral credit, reward or identity qualification.
DeadlineMissed follows the character's declared simulation-time task window, not
an omniscient cancellation signal. No truth handle is copied into either state.

## Preconditions

Task content/spec/kind/holder references close at model construction. Initial-state
admission requires exactly the finite declared task domain, Open status, and keys
consistent with the admitted holder and authored referents. Learned prediction and
episode initial restrictions remain unchanged.

Source association precedes payload and state access. Measurement source domain
checks preserve existing first-failure owners. IDN qualification precedes task
target selection; collision preflight precedes prior task reads.

## Totality, typed failures, instant rollback, and failed-run behavior

All sets and loops are finite. Malformed/unknown declarations reject before model
publication. Invalid input association rejects before cognition. Missing initial
required task state is an error, not implicit adoption. Unmatched/late/multiple
incompatible lifecycle writers must reject before evaluation rather than silently
choosing order. Exact failure names and carriers are unresolved below.

The complete simulation instant rolls back status, all sibling family writes,
pending deadlines, allocators, outputs and trace. Failed runs remain terminal.

## Exact transformation

Proposed settlement rule for a selected task and its common pre-stage status:

1. Terminal prior: no status change and no renewed base motive.
2. Open prior and T≥Deadline: DeadlineMissed at the exact deadline. No observation
   at or after Deadline can rescue it.
3. Open, active prior and a fresh admitted measurement at a time inside the task
   window whose exact point lies inclusively inside the desired interval:
   PerceivedSatisfied with that existing observation reference/time.
4. Otherwise: unchanged Open.

Evidence must be produced in the current source path; an archived observation from
the right time range cannot be re-admitted. A forecast within the interval is not
evidence for step3. The task is about obtaining a reading, so the rule makes no
claim about who caused that reading.

This priority is proposed before implementing any collision resolution. The final
registration must establish whether two sources can reach the same target at one
instant and how duplicate clock/measurement opportunities are coalesced or rejected.
It cannot rely on scheduler enumeration accidentally selecting a winner.

## Random addresses and distribution mapping

None. The task lifecycle is deterministic. PERSIST-I is not passed by this seam.

## Quantization and rounding points

None for interval comparison or time. Exact rationals and integer simulation instants.
Later motive/affect calibration is a different contract, with its own numeric domain.

## Canonical collection ordering and tie rules

Complete typed task keys and source identities order canonical collections. No task
ordinal, label or ID adjacency can contribute magnitude. Workspace competition
cannot inherit this storage ordering as a psychological salience rule without its
own declared selection contract.

## Event phase and timing semantics

Goal context is available to later workspace at40. Perceived task settlement follows
actual342 at140. Deadline association schedules a named140 opportunity at Deadline;
all status effects commit atomically. Eligibility at40 is determined by status and
window, so an expired Open task cannot emit motive merely because140 has not run yet.
No30/current belief update or51/52 regulatory feedback is proposed.

The current prediction model's two-member140 dispatcher is insufficient. A successor
must explicitly compose prospective settlement with the existing pair/ADAPT branches,
seal all targets against B0 and preserve sole authorities. No runtime change yet.

## Postconditions

Terminal records never revert to Open. A satisfying observation is retained unchanged
as an evidence reference; no source record is rewritten. Recurrence uses a different
authored concrete referent. Active eligibility is absent for every terminal record.

## Invariants

One status owner; one concrete identity per instance; no appetite/refill semantics;
no stakeholder-as-task identity; no forecast-as-fulfillment; no truth-based retirement;
no direct goal/affect-to-action command; no identity modifier can resurrect a base
motive after retirement; no past expression/identity history is rewritten here.

## Trace records and provenance

Use existing trace160 with real producer/source/actual-read/patch/diff relations.
No new provenance graph. A deadline has no fabricated observation occurrence.
Whether an externally consumable retirement output is required, its exact schema,
and its occurrence rule must be settled before allocation. Trace alone cannot feed
later character memory or identity.

## Candidate mechanisms and control implementations

Finite deadline and observer-safe measurement retirement versus the actual historical
live-list control. Historical commitmentSignal is retained as a motive-generation
control; it supplies no proof of this new lifecycle implementation. Need-shaped,
immortal and stakeholder-keyed variants are mandatory negative controls.

## Competing models / ablations

Initial no-task versus live task; actual retirement versus immortal Open mutant;
same task shape/fresh identity recurrence; measurement-satisfaction disabled while
deadline remains; workspace task access disabled. Later strong-identity recurrence
control must use the retained identity pipeline after it is ported.

## Equivalence relation and tolerances

Exact canonical status/read/patch equality under declared instance/occurrence
bijections, zero numerical tolerance. Historical control comparison is pressure
presence/referent continuity, not claimed complete state/trace equivalence.

## Proof obligations and executable tests

Freeze TC-A..L for this proposal: A distinct task/holder identities; B active interval
endpoints; C absent/dormant/terminal eligibility; D permitted point satisfies but
forecast does not; E source/time/observer/role negatives before target reads;
F deadline-before-rescue; G duplicate/mixed-target preflight; H sole status patch
and unrelated-family preservation; I full rollback; J prefix restore/deadline
association; K fresh recurrence without resurrection; L historical live-list control
and immortal/Need/stakeholder substitutions. All NOT PASSED.

## Applicable Campaign 0 conformance vectors

CONTENT reference/cycle/kind closure, typed identity, exact time/interval endpoints,
PRJ/IDN/WRT, deterministic scheduling, sole ownership, atomic rollback, canonical
trace and exact save/restore. Reuse does not qualify their new composition.

## Known domain exclusions

General promise recognition, social accountability, inferred cancellation, voluntary
relinquishment, action-causal success, unrestricted runtime adoption/recurrence,
general planning, acquired value/identity updates, uncertainty and continuous time.

## Unresolved decisions

1. Exact content-kind and role-validator specialization, spec mapping and field grammar.
2. New prospective state-family/route classification and initial-state domain rule.
3. Deadline association creation and persistence, same-target source arbitration,
   complete140 successor grammar and failure ordering.
4. Retirement output closure, if consumed by later episodic history, without giving
   the trace cognitive authority.
5. Exact workspace projection/selection and motive calibration must be separate
   contracts, not invented by this lifecycle record.

These are agent-owned specification tasks. None is accepted through an implementation
default. Numeric allocation and canonical implementation remain prohibited.

## Reopen conditions

A needed cause of retirement lacks permitted evidence; a social fulfillment claim
requires more than an observed reading; dynamic recurrence or multiple contemporaneous
tasks require a different domain; a later consumer needs new provenance or state access.

## Change history

Revision1: actual historical lifecycle limit inspected; explicit CONTENT second-kind
gate; concrete authored instance identity reuse; perceived satisfaction separated from
actual success; deadline endpoints and prospective140 composition exposed for review.
