# Task cognitive allocation proposal

Status: NUMERIC PROPOSAL, NOT PERMANENT. Shape is already internally accepted.

## 377/1 DeliberationOpportunity

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | ObserverId | true | id(ObserverId) |
| 2 | AgendaDefinitionId | true | id(DefinitionId) |

## 378/1 TaskWorkspaceDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | PredictionDefinitionId | true | id(DefinitionId) |
| 2 | Capacity | true | u |
| 3 | TaskAccessEnabled | true | bool |
| 4 | ForecastAccessEnabled | true | bool |

## 379/1 WorkspaceTaskItem

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | TaskCommitmentKey | true | r(371) |
| 2 | TaskSpecRef | true | id(DefinitionId) |

## 380/1 WorkspaceForecast

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | VariantTag | true | enum(WorkspaceForecast) |
| 2 | PredictionValue | false | r(361) |

## 381/1 TaskWorkspace

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | WorkspaceOccurrenceId | true | id(WorkspaceOccurrenceId) |
| 2 | CharacterId | true | id(CharacterId) |
| 3 | AgendaDefinitionId | true | id(DefinitionId) |
| 4 | Tasks | true | list(WorkspaceTaskItem) |
| 5 | Forecast | true | r(WorkspaceForecast) |

## 382/1 TaskAssessment

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | VariantTag | true | enum(TaskAssessment) |
| 2 | Distance | false | q |

## 383/1 TaskAppraisalItem

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | TaskCommitmentKey | true | r(371) |
| 2 | Assessment | true | r(TaskAssessment) |

## 384/1 TaskAppraisal

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | AppraisalOccurrenceId | true | id(AppraisalOccurrenceId) |
| 2 | Workspace | true | r(TaskWorkspace) |
| 3 | Assessments | true | list(TaskAppraisalItem) |

## 385/1 TaskConcernDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | Gain | true | q |
| 2 | Enabled | true | bool |

## 386/1 TaskConcernResponse

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | VariantTag | true | enum(TaskConcernResponse) |
| 2 | Intensity | false | q |

## 387/1 TaskConcernItem

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | TaskCommitmentKey | true | r(371) |
| 2 | Response | true | r(TaskConcernResponse) |

## 388/1 TaskConcern

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | ConcernOccurrenceId | true | id(ConcernOccurrenceId) |
| 2 | Appraisal | true | r(TaskAppraisal) |
| 3 | Responses | true | list(TaskConcernItem) |

## 389/1 PlanInstructionDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | ProtocolActionDefinitionId | true | id(DefinitionId) |

## 390/1 AdoptedTaskInstruction

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | PlanInstructionDefinitionId | true | id(DefinitionId) |

## 391/1 ProtocolActionDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | RequestedContactCount | true | u |

## 392/1 TaskMotiveDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | BasePressure | true | q |
| 2 | Enabled | true | bool |

## 393/1 TaskMotiveItem

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | TaskCommitmentKey | true | r(371) |
| 2 | RawPressure | true | q |

## 394/1 TaskMotiveContext

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | MotiveContextOccurrenceId | true | id(MotiveContextOccurrenceId) |
| 2 | Concern | true | r(TaskConcern) |
| 3 | Motives | true | list(TaskMotiveItem) |

## 395/1 ProceduralCandidateKey

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | CharacterId | true | id(CharacterId) |
| 2 | ProtocolActionDefinitionId | true | id(DefinitionId) |

## 396/1 ProceduralCandidateOrigin

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | TaskCommitmentKey | true | r(371) |
| 2 | PlanInstructionDefinitionId | true | id(DefinitionId) |

## 397/1 ProceduralCandidate

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | Key | true | r(ProceduralCandidateKey) |
| 2 | Origins | true | set(ProceduralCandidateOrigin) |

## 398/1 TaskCandidateOptions

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | CandidateOptionsOccurrenceId | true | id(CandidateOptionsOccurrenceId) |
| 2 | MotiveContext | true | r(TaskMotiveContext) |
| 3 | Candidates | true | list(ProceduralCandidate) |

## 399/1 ReasonEvidenceAtom

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | VariantTag | true | enum(ReasonEvidenceAtom) |
| 2 | ObservationReference | false | r(237) |
| 3 | QualificationOccurrenceId | false | id(QualificationOccurrenceId) |

## 400/1 ReasonEvidenceBasis

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | Weights | true | map(ReasonEvidenceAtom,q) |

## 401/1 TaskRawSignalKey

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | CandidateKey | true | r(ProceduralCandidateKey) |
| 2 | TaskCommitmentKey | true | r(371) |
| 3 | SourceRole | true | enum(SourceRole) |

## 402/1 TaskRawSignal

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | Key | true | r(TaskRawSignalKey) |
| 2 | SignedStrength | true | q |
| 3 | EvidenceBasis | true | r(ReasonEvidenceBasis) |

## 403/1 TaskRawSignalContext

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | OccurrenceId | true | id(RawSignalContextOccurrenceId) |
| 2 | CandidateOptions | true | r(TaskCandidateOptions) |
| 3 | Signals | true | set(TaskRawSignal) |
| 4 | NonIdentitySemanticPressure | true | map(ProceduralCandidateKey,q) |

## 404/1 ReasonNucleusKey

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | CandidateKey | true | r(ProceduralCandidateKey) |
| 2 | MotiveChannel | true | id(MotiveChannelId) |
| 3 | TaskReferent | true | id(TaskReferentId) |
| 4 | Direction | true | enum(Direction) |

## 405/1 CoverageResult

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | SourceKey | true | r(TaskRawSignalKey) |
| 2 | RawMagnitude | true | q |
| 3 | OverlapWithPrior | true | q |
| 4 | IndependentFraction | true | q |
| 5 | EffectiveMagnitude | true | q |

## 406/1 ReasonRoleSummary

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | BaseNet | true | q |
| 2 | StandingNet | true | q |
| 3 | SituationalNet | true | q |
| 4 | CoverageResults | true | list(CoverageResult) |

## 407/1 CompiledReasonNucleus

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | Key | true | r(ReasonNucleusKey) |
| 2 | RoleSummary | true | r(ReasonRoleSummary) |
| 3 | Relevance | true | q |
| 4 | BaseDie | true | u |
| 5 | StandingModifier | true | i |
| 6 | SituationalModifier | true | i |
| 7 | Distribution | true | r(ExactScoreDistribution) |

## 408/1 TaskReasonContext

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | OccurrenceId | true | id(ReasonContextOccurrenceId) |
| 2 | RawSignalContext | true | r(TaskRawSignalContext) |
| 3 | ActiveNuclei | true | list(CompiledReasonNucleus) |

## 409/1 DecisionResolution

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | OccurrenceId | true | id(DecisionResolutionOccurrenceId) |
| 2 | OccurredAt | true | i |
| 3 | ReasonContext | true | r(TaskReasonContext) |
| 4 | Result | true | r(DecisionResult) |

## 410/1 CognitiveRandomCandidateAttempt

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | InternalCandidateIndex | true | u |
| 2 | Candidate | true | u |
| 3 | Rejected | true | bool |

## 411/1 CognitiveRandomDraw

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | LocalAddress | true | r(110) |
| 2 | EffectiveKey | true | r(112) |
| 3 | Result | true | u |
| 4 | Span | true | u |
| 5 | Limit | true | u |
| 6 | Fallback | true | bool |
| 7 | Attempts | true | list(CognitiveRandomCandidateAttempt) |

## 412/1 TaskIdentityKey

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | CharacterId | true | id(CharacterId) |
| 2 | IdentityChannelId | true | id(IdentityChannelId) |

## 413/1 TaskIdentityContribution

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | QualificationOccurrenceId | true | id(QualificationOccurrenceId) |
| 2 | DecisionResolutionOccurrenceId | true | id(DecisionResolutionOccurrenceId) |
| 3 | OccurredAt | true | i |
| 4 | SignedContribution | true | q |

## 414/1 TaskIdentityEvidence

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | Contributions | true | list(TaskIdentityContribution) |

## 415/1 TaskIdentityState

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | Evidence | true | map(TaskIdentityKey,TaskIdentityEvidence) |

## 416/1 TaskWorkspaceTaskRequirement

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | SubjectAccessor | true | id(ProjectionAccessorId) |
| 2 | TaskSpecIds | true | set(DefinitionId) |
| 3 | TargetStatePathTemplate | true | r(149) |
| 4 | OutputAccessor | true | id(ProjectionAccessorId) |

## 417/1 TaskWorkspaceSourceRegistration

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | ExecutingSeamId | true | id(SeamId) |
| 2 | ExecutingSeamVersion | true | text |
| 3 | InputRecordSchema | true | r(254) |
| 4 | ConsumerEventTypeId | true | id(EventTypeId) |
| 5 | AgendaDefinitionId | true | id(DefinitionId) |
| 6 | ReadDomain | true | set(149) |
| 7 | OutputDefinitions | true | set(277) |
| 8 | WriteCapability | true | r(273) |
| 9 | SubjectRequirements | true | set(266) |
| 10 | TaskRequirements | true | set(TaskWorkspaceTaskRequirement) |
| 11 | PredictionRequirements | true | set(363) |

## 418/1 TaskConcernRegistration

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | BaseRegistration | true | r(272) |
| 2 | ConcernDefinitionId | true | id(DefinitionId) |

## 419/1 DecisionResult

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | VariantTag | true | enum(DecisionResult) |
| 2 | ChosenData | false | r(ChosenDecisionData) |

## 420/1 ChosenDecisionData

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | CandidateKey | true | r(ProceduralCandidateKey) |
| 2 | Probabilities | true | list(OptionProbability) |
| 3 | Margin | true | q |
| 4 | Contest | true | q |
| 5 | ConflictMass | true | q |
| 6 | Stake | true | q |
| 7 | AuthorshipPotential | true | q |
| 8 | ResolutionMode | true | enum(ResolutionMode) |
| 9 | ReasonDraws | true | list(ReasonDraw) |
| 10 | TieBreak | true | r(DecisionTieBreak) |

## 421/1 OptionProbability

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | CandidateKey | true | r(ProceduralCandidateKey) |
| 2 | Probability | true | q |

## 422/1 ReasonDraw

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | NucleusKey | true | r(ReasonNucleusKey) |
| 2 | BaseDie | true | u |
| 3 | StandingModifier | true | i |
| 4 | SituationalModifier | true | i |
| 5 | Draw | true | r(CognitiveRandomDraw) |
| 6 | Face | true | u |
| 7 | SignedContribution | true | i |

## 423/1 DecisionTieBreak

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | VariantTag | true | enum(DecisionTieBreak) |
| 2 | Leaders | false | list(ProceduralCandidateKey) |
| 3 | Draw | false | r(CognitiveRandomDraw) |
| 4 | SelectedKey | false | r(ProceduralCandidateKey) |

## 424/1 ExactScoreDistribution

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | Masses | true | map(i,q) |

## 425/1 ChosenIntent

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | OccurrenceId | true | id(ChosenIntentOccurrenceId) |
| 2 | DecisionResolution | true | r(DecisionResolution) |

## 426/1 DecisionExpression

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | OccurrenceId | true | id(DecisionExpressionOccurrenceId) |
| 2 | ChosenIntent | true | r(ChosenIntent) |
| 3 | ChannelExpressions | true | list(ChannelExpression) |
| 4 | QualificationContext | true | r(FixtureQualificationContext) |

## 427/1 ChannelExpression

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | IdentityChannelId | true | id(IdentityChannelId) |
| 2 | Alignment | true | q |

## 428/1 FixtureQualificationContext

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | ScopeVersion | true | text |
| 2 | CostRepresentation | true | enum(CostRepresentation) |
| 3 | FearRepresentation | true | enum(FearRepresentation) |
| 4 | ChoiceInterventionRepresentation | true | enum(ChoiceInterventionRepresentation) |

## 429/1 DecisionQualification

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | OccurrenceId | true | id(QualificationOccurrenceId) |
| 2 | DecisionExpression | true | r(DecisionExpression) |
| 3 | Result | true | r(QualificationResult) |

## 430/1 QualificationResult

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | VariantTag | true | enum(QualificationResult) |
| 2 | Weight | false | q |
| 3 | SignedContribution | false | q |
| 4 | RejectionReason | false | enum(RejectionReason) |

## 431/1 ActionPlan

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | OccurrenceId | true | id(ActionPlanOccurrenceId) |
| 2 | ChosenIntent | true | r(ChosenIntent) |
| 3 | RequestedContactCount | true | u |

## 432/1 ActionAttempt

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | OccurrenceId | true | id(ActionAttemptOccurrenceId) |
| 2 | ActionPlan | true | r(ActionPlan) |

## 433/1 ExecutionOutcome

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | OccurrenceId | true | id(ExecutionOutcomeOccurrenceId) |
| 2 | ActionAttempt | true | r(ActionAttempt) |
| 3 | CompletedContactCount | true | u |

## 434/1 ExecutionDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | Permitted | true | bool |

## 435/1 TaskCandidateDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | PlanAccessEnabled | true | bool |

## 436/1 TaskReasonSourceDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | StandingAccessEnabled | true | bool |
| 2 | IdentityK | true | q |

## 437/1 ReasonDiceDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | BaseDieThresholds | true | r(BaseDieThresholds) |
| 2 | ActivationThreshold | true | q |
| 3 | StandingModifier | true | r(ModifierDefinition) |
| 4 | SituationalModifier | true | r(ModifierDefinition) |

## 438/1 BaseDieThresholds

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | D4 | true | q |
| 2 | D6 | true | q |
| 3 | D8 | true | q |
| 4 | D10 | true | q |
| 5 | D12 | true | q |

## 439/1 ModifierDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | Unit | true | q |
| 2 | MaximumMagnitude | true | u |

## 440/1 TaskArbitrationDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | ThetaRoll | true | q |
| 2 | ThetaPlayer | true | q |

## 441/1 TaskMotiveRegistration

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | BaseRegistration | true | r(272) |
| 2 | MotiveDefinitionId | true | id(DefinitionId) |

## 442/1 TaskCandidateRegistration

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | BaseRegistration | true | r(272) |
| 2 | CandidateDefinitionId | true | id(DefinitionId) |
| 3 | PlanRequirement | true | r(TaskPlanBindingRequirement) |

## 443/1 TaskRawSignalRegistration

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | BaseRegistration | true | r(272) |
| 2 | ReasonSourceDefinitionId | true | id(DefinitionId) |
| 3 | IdentityRequirement | true | r(TaskIdentityReadRequirement) |

## 444/1 TaskReasonCompilationRegistration

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | BaseRegistration | true | r(272) |
| 2 | ReasonDiceDefinitionId | true | id(DefinitionId) |

## 445/1 TaskArbitrationRegistration

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | BaseRegistration | true | r(272) |
| 2 | ArbitrationDefinitionId | true | id(DefinitionId) |
| 3 | ChosenIntentIngress | true | r(ChosenIntentIngressDefinition) |

## 446/1 ProtocolExecutionRegistration

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | BaseRegistration | true | r(272) |
| 2 | ExecutionDefinitionId | true | id(DefinitionId) |

## 447/1 TaskPlanBindingRequirement

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | SubjectFieldPath | true | list(u) |
| 2 | TaskListFieldPath | true | list(u) |
| 3 | TargetStatePathTemplate | true | r(149) |
| 4 | OutputAccessor | true | id(ProjectionAccessorId) |

## 448/1 TaskIdentityReadRequirement

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | SubjectFieldPath | true | list(u) |
| 2 | IdentityChannelId | true | id(IdentityChannelId) |
| 3 | TargetStatePathTemplate | true | r(149) |
| 4 | OutputAccessor | true | id(ProjectionAccessorId) |

## 449/1 ChosenIntentIngressDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | ConsumerEventTypeId | true | id(EventTypeId) |
| 2 | ConsumerPhase | true | u |
| 3 | PayloadSchema | true | r(254) |
| 4 | BranchRule | true | enum(ChosenIngressRule) |

## 450/1 TaskIdentityApplicationRegistration

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | ExecutingSeamId | true | id(SeamId) |
| 2 | ExecutingSeamVersion | true | text |
| 3 | InputAdmission | true | r(274) |
| 4 | ReadDomain | true | set(149) |
| 5 | OutputDefinitions | true | set(277) |
| 6 | WriteCapability | true | r(322) |
| 7 | Ingress | true | r(276) |
| 8 | IdentityRequirement | true | r(TaskIdentityReadRequirement) |

## 451/1 ProtocolObservationBridgeDefinition

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | ProducingTransitionKind | true | id(TransitionKindId) |
| 2 | ProducerOutputSchema | true | r(254) |
| 3 | Channel | true | r(201) |
| 4 | Permitted | true | bool |
| 5 | StageEventTypes | true | map(u,EventTypeId) |
| 6 | ObservationInputSchema | true | r(254) |
| 7 | PublishedOutputSchemas | true | set(254) |

## 452/1 IdentityQuantizationOperation

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | SourceQualificationOccurrenceId | true | id(QualificationOccurrenceId) |
| 2 | CounterKind | true | enum(CounterKind) |
| 3 | Input | true | q |
| 4 | Scale | true | u |
| 5 | RoundedInteger | true | u |
| 6 | Output | true | q |

## 373/2 TaskCommitmentState

| Field | Name | Required | Type |
|---|---|---|---|
| 1 | Commitments | true | map(371,372) |
| 2 | AdoptedInstructions | true | map(371,AdoptedTaskInstruction) |

## Namespace additions

| Namespace | Family | Payload |
|---|---|---|
| 1040 | MotiveChannelId | nonempty canonical UTF-8 NFC text |
| 1041 | IdentityChannelId | nonempty canonical UTF-8 NFC text |
| 1042 | RandomPurposeId | nonempty canonical UTF-8 NFC text |
| 1043 | RandomSubjectRoleId | nonempty canonical UTF-8 NFC text |
| 1128 | WorkspaceOccurrenceId | unsigned-runtime-ordinal |
| 1129 | AppraisalOccurrenceId | unsigned-runtime-ordinal |
| 1130 | ConcernOccurrenceId | unsigned-runtime-ordinal |
| 1131 | MotiveContextOccurrenceId | unsigned-runtime-ordinal |
| 1132 | CandidateOptionsOccurrenceId | unsigned-runtime-ordinal |
| 1133 | RawSignalContextOccurrenceId | unsigned-runtime-ordinal |
| 1134 | ReasonContextOccurrenceId | unsigned-runtime-ordinal |
| 1135 | DecisionResolutionOccurrenceId | unsigned-runtime-ordinal |
| 1136 | ChosenIntentOccurrenceId | unsigned-runtime-ordinal |
| 1137 | DecisionExpressionOccurrenceId | unsigned-runtime-ordinal |
| 1138 | QualificationOccurrenceId | unsigned-runtime-ordinal |
| 1139 | ActionPlanOccurrenceId | unsigned-runtime-ordinal |
| 1140 | ActionAttemptOccurrenceId | unsigned-runtime-ordinal |
| 1141 | ExecutionOutcomeOccurrenceId | unsigned-runtime-ordinal |

## Fixed members

| Namespace | Exact payload JSON |
|---|---|
| 1040 | "Commitment" |
| 1041 | "CommitmentFidelity" |
| 1042 | "purpose/task-reason-face" |
| 1042 | "purpose/task-decision-tie" |
| 1043 | "subject/actor" |
| 1043 | "subject/action" |
| 1043 | "subject/task" |
| 1009 | "TaskWorkspaceTransition" |
| 1001 | "event/deliberation-opportunity" |
| 1009 | "TaskAppraisalTransition" |
| 1001 | "event/task-appraisal" |
| 1009 | "TaskConcernTransition" |
| 1001 | "event/task-concern" |
| 1009 | "TaskMotiveTransition" |
| 1001 | "event/task-motive" |
| 1009 | "TaskCandidateTransition" |
| 1001 | "event/task-candidates" |
| 1009 | "TaskRawSignalTransition" |
| 1001 | "event/task-raw-signals" |
| 1009 | "TaskReasonCompilationTransition" |
| 1001 | "event/task-reasons" |
| 1009 | "TaskArbitrationTransition" |
| 1001 | "event/task-arbitration" |
| 1009 | "TaskIntentTransition" |
| 1001 | "event/task-intent" |
| 1009 | "TaskExpressionTransition" |
| 1001 | "event/task-expression" |
| 1009 | "TaskPlanTransition" |
| 1001 | "event/task-plan" |
| 1009 | "TaskAttemptTransition" |
| 1001 | "event/task-attempt" |
| 1009 | "ProtocolExecutionTransition" |
| 1001 | "event/protocol-execution" |
| 1009 | "ProtocolActualFactBridgeTransition" |
| 1001 | "event/protocol-actual-fact" |
| 1009 | "TaskQualificationTransition" |
| 1001 | "event/task-qualification" |
| 1009 | "TaskIdentityApplicationTransition" |
| 1001 | "event/task-identity-application" |
| 1027 | "definition/task-workspace" |
| 1023 | "registry/task-workspace" |
| 1027 | "definition/task-concern" |
| 1023 | "registry/task-concern" |
| 1027 | "definition/task-motive" |
| 1023 | "registry/task-motive" |
| 1027 | "definition/task-candidates" |
| 1023 | "registry/task-candidates" |
| 1027 | "definition/task-reason-source" |
| 1023 | "registry/task-reason-source" |
| 1027 | "definition/task-reason-dice" |
| 1023 | "registry/task-reason-dice" |
| 1027 | "definition/task-arbitration" |
| 1023 | "registry/task-arbitration" |
| 1027 | "definition/protocol-execution" |
| 1023 | "registry/protocol-execution" |
| 1027 | "definition/protocol-observation" |
| 1023 | "registry/protocol-observation" |
| 1027 | "definition/task-instruction-one" |
| 1023 | "registry/task-instruction" |
| 1027 | "definition/task-instruction-two" |
| 1027 | "definition/protocol-contact-one" |
| 1023 | "registry/protocol-action" |
| 1027 | "definition/protocol-contact-two" |
| 1001 | "event/protocol-observation" |
| 1001 | "event/protocol-tracking" |
| 1001 | "event/protocol-bindings" |
| 1001 | "event/protocol-classification" |
| 1001 | "event/protocol-experience" |
| 1028 | "accessor/workspace-task-status" |
| 1028 | "accessor/task-plan-binding" |
| 1028 | "accessor/task-identity-history" |
| 1025 | "authority/task-identity-evidence" |
| 1032 | "leaf/identity-evidence" |
| 1036 | "seam/task-workspace" |
| 1036 | "seam/task-appraisal-affect" |
| 1036 | "seam/task-plan-context" |
| 1036 | "seam/task-motive-context" |
| 1036 | "seam/task-option-construction" |
| 1036 | "seam/task-reason-source" |
| 1036 | "seam/reason-evidence-coverage" |
| 1036 | "seam/reason-dice" |
| 1036 | "seam/task-arbitration" |
| 1036 | "seam/task-decision-expression" |
| 1036 | "seam/task-identity-evidence" |
| 1036 | "seam/bounded-protocol-execution" |
| 1036 | "seam/protocol-consequence-observation" |
| 1024 | [380,1] |
| 1024 | [380,2] |
| 1024 | [382,1] |
| 1024 | [382,2] |
| 1024 | [382,3] |
| 1024 | [382,4] |
| 1024 | [386,1] |
| 1024 | [386,2] |
| 1024 | [399,1] |
| 1024 | [399,2] |
| 1024 | [419,1] |
| 1024 | [419,2] |
| 1024 | [419,3] |
| 1024 | [423,1] |
| 1024 | [423,2] |
| 1024 | [430,1] |
| 1024 | [430,2] |

