# Cognitive read and calibration registration shapes

Status: DRAFT. Ordered fields below are symbolic and unallocated. These close the
read-only generated stages in the registration join; they are not runtime permissions.

## New fixed definitions

TaskCandidateDefinition: PlanAccessEnabled (Boolean).

TaskReasonSourceDefinition: StandingAccessEnabled (Boolean), IdentityK (positive exact
rational). The fixed source mapping is CommitmentFidelity→Commitment; no per-task or
per-action coefficient is configurable. Non-identity meaning remains the specified
raw base-plus-concern sum and bounded response, independent of IdentityK.

ReasonDiceDefinition: BaseDieThresholds, ActivationThreshold, StandingModifier,
SituationalModifier. BaseDieThresholds: D4, D6, D8, D10, D12 (exact rationals with
0<D4<D6<D8<D10<D12≤1). ActivationThreshold is rational0..3. ModifierDefinition:
Unit (positive rational), MaximumMagnitude (unsigned integer0..3 for this profile).
The two roles stay separate even when their definitions have identical numbers.
Only faces4/6/8/10/12 are admitted; a model cannot supply a custom die operation.

TaskArbitrationDefinition: ThetaRoll (rational0<value≤1), ThetaPlayer (rational0..1).
The accepted RNG algorithm/version remains a model identity component, not a field
choosing an arbitrary function. No configurable option-weight callback is admitted.

ExecutionDefinition: Permitted (Boolean), available only to execution. An independent
ProtocolObservationDefinition controls permitted observer emission and its exact one
channel. Its final channel field grammar reuses201 and the observation-cut draft.

## Exact generated wrappers

All BaseRegistration fields below are272 records with the exact corresponding271
definition,274/275 immediate registered producer,276 ingress and277 outputs.

* TaskMotiveRegistration: BaseRegistration, MotiveDefinitionId.
* TaskCandidateRegistration: BaseRegistration, CandidateDefinitionId, PlanRequirement.
* TaskRawSignalRegistration: BaseRegistration, ReasonSourceDefinitionId,
  IdentityRequirement.
* TaskReasonCompilationRegistration: BaseRegistration, ReasonDiceDefinitionId.
* TaskArbitrationRegistration: BaseRegistration, ArbitrationDefinitionId,
  ChosenIntentIngress.
* ProtocolExecutionRegistration: BaseRegistration, ExecutionDefinitionId.

Definition references are1027 narrowed to the exact committed kind/schema/version.
The compiler verifies the complete wrapper as a whole: a compatible base272 is not
permission to attach an arbitrary definition or read requirement. All read-only
wrappers use273 NoStateWrites. Wrong or missing wrappers reject before activation.

The numeric path lists below illustrate the current ordered-field proposals only;
they do not assign permanent field IDs. The authoritative symbolic paths are the
named schema chains. Allocation must materialize the reviewed field IDs from those
chains and re-audit the lists before any canonical registry bytes are built.

## Captured task-plan access

TaskPlanBindingRequirement fields: SubjectFieldPath, TaskListFieldPath,
TargetStatePathTemplate, OutputAccessor.

Both field paths are nonempty lists of positive unsigned field IDs. This first
profile admits exactly SubjectFieldPath=[2,2,2,2] and TaskListFieldPath=[2,2,2,4]
through TaskMotiveContext→Concern→Appraisal→Workspace. The former ends at Workspace
CharacterId; the latter ends at the list of WorkspaceTaskItem. The compiler proves
the schema chain and the list/item grammar. It cannot reinterpret arbitrary paths.

For each actual selected item, take its existing371 key at item field1; validate its
CharacterId equals the captured subject and its task member is the selected declared
spec. Substitute that whole record key into the new373 plan-field template. The
OutputAccessor is the symbolic accessor/task-plan-binding, whose exact operation is
return-the-whole-AdoptedTaskInstruction-or-absence. It grants no enumeration or write.
If plan access is disabled, resolve no plan path and record no plan-state read.

## Captured identity access

TaskIdentityReadRequirement fields: SubjectFieldPath, IdentityChannelId,
TargetStatePathTemplate, OutputAccessor.

The raw-source instance's SubjectFieldPath is exactly[2,2,2,2,2] through CandidateOptions→MotiveContext→Concern
→Appraisal→Workspace→CharacterId. IdentityChannelId is exactly the proposed fixed
CommitmentFidelity member. Resolve one new TaskIdentityKey from that captured subject
and channel, substitute it into the identity evidence template, and return its whole
history-or-absence through accessor/task-identity-history. A state iterator, caller
CharacterId or second IDN lookup is not admissible here.

When standing access is disabled, do not read identity. Otherwise absence supplies
derived strength0; present history is validated and folded by the exact history seam.
Actual reads and derived-fold provenance are recorded in Trace160. The source emits
only its actual signals and original support refs, not a copied history or an ablation
diagnostic inside the psychological record.

## Chosen-only ingress

ChosenIntentIngressDefinition fields: ConsumerEventTypeId, ConsumerPhase,
PayloadSchema, BranchRule. The event is the exact symbolic intent-formation member;
phase is90; schema is DecisionResolution; BranchRule is the sole ChosenOnly finite
value. Same DueAt, exact source-output payload and one child for Chosen are fixed
contract semantics. NoOptions/NoActiveReasons produce none. This record does not
reinterpret276's exactly-once rule; it is owned by the arbitration wrapper.

The successor's normalized source table includes this child rule, and the intent
registration's input requires both the actual arbitration producer and Chosen payload.
Runtime checks the exact generated child before reading/nesting the resolution. There
is no public method that upgrades a merely well-formed Chosen record into admission.

## Remaining registration obligations

Identity application still needs its exact write registration and complete source
field path. Protocol observation and its actual-fact producer need final wrappers,
source/projection linkage and fixed child order. Type/field descriptors, finite union
rows, scalar/collection/contextual roles and the occurrence279 table remain to be
materialized and audited. No number or implementation is authorized by this draft.
