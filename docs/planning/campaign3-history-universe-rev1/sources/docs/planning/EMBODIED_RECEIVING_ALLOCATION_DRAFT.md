# EMB receiving numeric proposal

Separate allocation gate; not frozen. Whole symbolic shape is already accepted.
Propose records485..515/1,110 fields,49 fixed text members and five union variants.
No new namespace. Existing families and all previous allocations remain unchanged.

|Record|Name|Fields|
|---|---|---|
|485/1|EmbodiedResponseInstructionDefinition|1 PressureDefinitionId; 2 ProtocolActionDefinitionId|
|486/1|EmbodiedResponseContext|1 AdoptedInstructions|
|487/1|EmbodiedResponseInstructionState|1 Contexts|
|488/1|BodyCandidateOrigin|1 CandidateKey; 2 InstructionDefinitionId|
|489/1|BodyResponseOptions|1 OccurrenceId; 2 Pressure; 3 Origins|
|490/1|MixedCandidateOption|1 CandidateKey; 2 TaskOrigins; 3 BodyOrigins|
|491/1|MixedCandidateJoinInput|1 TaskOptions; 2 BodyOptions|
|492/1|MixedCandidateContext|1 OccurrenceId; 2 Sources; 3 Options|
|493/1|EmbodiedGround|1 CharacterId; 2 PressureDefinitionId|
|494/1|MixedMotivationGround|1 VariantTag; 2 Task; 3 Body|
|495/1|MixedSignalKey|1 CandidateKey; 2 Ground; 3 SourceRole; 4 BodyInstructionDefinitionId|
|496/1|MixedRawSignal|1 Key; 2 Strength; 3 Basis|
|497/1|GroundMeaning|1 Ground; 2 Meaning|
|498/1|MixedRawJoinInput|1 MixedCandidates; 2 TaskRaw|
|499/1|MixedRawContext|1 OccurrenceId; 2 Sources; 3 Signals; 4 NonStandingMeanings|
|500/1|MixedCoverageResult|1 SourceKey; 2 RawMagnitude; 3 Overlap; 4 Independence; 5 EffectiveMagnitude|
|501/1|MixedRoleSummary|1 Base; 2 Standing; 3 Situational; 4 Coverage|
|502/1|MixedReasonKey|1 CandidateKey; 2 Ground; 3 MotiveChannelId; 4 Direction|
|503/1|MixedReasonNucleus|1 Key; 2 Roles; 3 Relevance; 4 BaseDie; 5 StandingModifier; 6 SituationalModifier; 7 Distribution|
|504/1|MixedReasonContext|1 OccurrenceId; 2 RawContext; 3 Nuclei|
|505/1|MixedReasonDraw|1 Key; 2 BaseDie; 3 StandingModifier; 4 SituationalModifier; 5 Draw; 6 Face; 7 SignedContribution|
|506/1|MixedChosenData|1 CandidateKey; 2 Probabilities; 3 Margin; 4 Contest; 5 ConflictMass; 6 Stake; 7 AuthorshipPotential; 8 ResolutionMode; 9 ReasonDraws; 10 TieBreak|
|507/1|MixedDecisionResult|1 VariantTag; 2 ChosenData|
|508/1|MixedDecisionResolution|1 OccurrenceId; 2 OccurredAt; 3 ReasonContext; 4 Result|
|509/1|MixedChosenIntent|1 OccurrenceId; 2 Resolution|
|510/1|GroundExpression|1 Ground; 2 Alignment|
|511/1|MixedDecisionExpression|1 OccurrenceId; 2 Intent; 3 GroundExpressions; 4 ScopeVersion|
|512/1|MixedActionPlan|1 OccurrenceId; 2 Intent; 3 RequestedContactCount|
|513/1|MixedActionAttempt|1 OccurrenceId; 2 Plan|
|514/1|MixedExecutionOutcome|1 OccurrenceId; 2 Attempt; 3 CompletedContactCount|
|515/1|EmbodiedReceivingStageRegistration|1 Stage; 2 ExecutingSeamId; 3 ExecutingSeamVersion; 4 EventTypeId; 5 Phase; 6 InputRecordSchema; 7 ReadDomain; 8 WriteCapability; 9 RequiredProjections; 10 OutputDefinitions; 11 SourceEvents|

The JSON companion owns exact member payloads, scalar/map/collection roles, union tags,
finite stage values and occurrence mappings. Independent one-to-one and availability
review is required before permanence. No implementation/model activation yet.
