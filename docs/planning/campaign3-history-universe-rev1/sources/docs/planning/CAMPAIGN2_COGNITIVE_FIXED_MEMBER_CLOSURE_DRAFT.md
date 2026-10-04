# Cognitive fixed vocabulary and receiving membership

Status: DRAFT. Exact symbolic payload proposals, not permanent allocation. All text
payloads are nonempty canonical UTF-8 NFC. Registry rows, members and namespaces
remain subject to whole-shape review and the separate numeric gate.

## New discriminator families

| Symbolic family | Complete first-profile member set |
|---|---|
|MotiveChannelId|`Commitment`|
|IdentityChannelId|`CommitmentFidelity`|
|RandomPurposeId|`purpose/task-reason-face`, `purpose/task-decision-tie`|
|RandomSubjectRoleId|`subject/actor`, `subject/action`, `subject/task`|

Their namespaces are unallocated. No generic character qualifier or DomainValidator
is introduced for these constants. The receiving profile enforces exact membership.
No comparison-role or comparison-key family is allocated for this natural-address-only
profile. Historical test namespaces are not aliases or production vocabulary.

## Scheduled identities

TransitionKindId reuses namespace1009 and EventTypeId reuses1001. Propose the following
exact new members. Every pair occurs once in the normalized registration graph.

| TransitionKindId member | EventTypeId member | Phase |
|---|---|---:|
|TaskWorkspaceTransition|event/deliberation-opportunity|40|
|TaskAppraisalTransition|event/task-appraisal|50|
|TaskConcernTransition|event/task-concern|50|
|TaskMotiveTransition|event/task-motive|60|
|TaskCandidateTransition|event/task-candidates|70|
|TaskRawSignalTransition|event/task-raw-signals|80|
|TaskReasonCompilationTransition|event/task-reasons|80|
|TaskArbitrationTransition|event/task-arbitration|80|
|TaskIntentTransition|event/task-intent|90|
|TaskExpressionTransition|event/task-expression|90|
|TaskPlanTransition|event/task-plan|100|
|TaskAttemptTransition|event/task-attempt|110|
|ProtocolExecutionTransition|event/protocol-execution|110|
|ProtocolActualFactBridgeTransition|event/protocol-actual-fact|110|
|TaskQualificationTransition|event/task-qualification|130|
|TaskIdentityApplicationTransition|event/task-identity-application|140|

The protocol observation controller commits exactly five additional1001 members:
`event/protocol-observation`120, `event/protocol-tracking`121,
`event/protocol-bindings`122, `event/protocol-classification`123 and
`event/protocol-experience`124. These are controller stages, with no invented1009
members. EVID's accepted SEM-source relation and its two130 transitions are reused.

Original deliberation is the workspace input, not an extra event before workspace.
Same-phase children follow actual allocated EventSequence. The graph's dispatch order
is fixed: intent creates Expression before Plan; execution creates ActualFactBridge
before the permitted observation chain. Qualification is scheduled by Expression;
it does not await execution or consume its result.

## Governed definitions

All following StableIds use existing RegistryDefinitionId1027. Each resolves to one
exact schema/version and the stated RegistryKindId1023 member. A label supplied by
a caller cannot substitute for validating the complete committed definition.

| Definition member | Registry kind member | Symbolic schema |
|---|---|---|
|definition/task-workspace|registry/task-workspace|TaskWorkspaceDefinition|
|definition/task-concern|registry/task-concern|TaskConcernDefinition|
|definition/task-motive|registry/task-motive|TaskMotiveDefinition|
|definition/task-candidates|registry/task-candidates|TaskCandidateDefinition|
|definition/task-reason-source|registry/task-reason-source|TaskReasonSourceDefinition|
|definition/task-reason-dice|registry/task-reason-dice|ReasonDiceDefinition|
|definition/task-arbitration|registry/task-arbitration|TaskArbitrationDefinition|
|definition/protocol-execution|registry/protocol-execution|ExecutionDefinition|
|definition/protocol-observation|registry/protocol-observation|ProtocolObservationBridgeDefinition|
|definition/task-instruction-one|registry/task-instruction|PlanInstructionDefinition|
|definition/task-instruction-two|registry/task-instruction|PlanInstructionDefinition|
|definition/protocol-contact-one|registry/protocol-action|ProtocolActionDefinition|
|definition/protocol-contact-two|registry/protocol-action|ProtocolActionDefinition|

The last two request counts1 and2 respectively. Instructions one/two reference the
matching action. S0 may bind two tasks to the same existing instruction; definitions
are never duplicated as action aliases. Every recipe has these same thirteen rows;
only its explicitly listed calibration or permission operands differ. Task specs and
the prediction definition use their accepted1027 identities and receiving schemas.

Registration rows use the existing `registry/transition-registration` kind. Their
StableIds are the actual1009 members above, and values have the exact ordinary or
new wrapper schema required by that row. The receiving compiler admits no arbitrary
record under that kind. Existing registry identity family1027 is not duplicated under
the drafts' shorthand DefinitionId.

## Accessors, authority, family and seams

New ProjectionAccessorId1028 members are exactly `accessor/workspace-task-status`,
`accessor/task-plan-binding`, `accessor/task-identity-history`. Existing subject and
whole-prediction-prior accessors retain their exact accepted operation. Named paths
and receiving payload schemas are specified in the read-registration drafts.

New authority member1025 is `authority/task-identity-evidence`; new leaf member1032
is `leaf/identity-evidence`. Existing1031 `identity-disposition` is reused. The task
root successor extends the existing prospective topology with its immutable plan
pattern; it does not assign that pattern to the identity authority or task writer.

SeamId uses existing1036, with one `seam/` member for each exact contract stem in the
version inventory, including `seam/protocol-consequence-observation`. Pure coverage
and immutable plan-context versions are committed dependencies, not dummy scheduled
transitions. A version string is exact data and must not be inferred from a seam name.

## Required admission separation

Scalar265 positions receive namespace and only the already accepted character/task
qualifiers where appropriate. Definition-kind checks, singleton membership, collections
and contextual111 subject bindings are separate receiving checks. The fixed members
do not redefine generic EventTypeId, DefinitionId, SubjectBinding or ObservationChannel.
Any missing member, orphan definition, wrong registry kind, extra row or duplicate
stable identity rejects the exact model before runtime activation.

The raw-draft aliases in the grammar report are not allocation authority.
The early reference audit rev1 incorrectly labeled three existing namespaces;
rev2 corrects SeamId to1036, EventTypeId to1001 and TransitionKindId to1009. No
production allocation or canonical artifact used those erroneous draft labels.
The complete mechanical audit must read the accepted tables rather than repeat them
from memory, and must separately check new-member collisions before allocation.
