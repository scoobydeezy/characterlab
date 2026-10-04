# General attention carrier allocation proposal

Separate numeric gate; not permanent. Records542..704, vocabulary namespaces1044/1045 and occurrence namespaces1145..1148. No existing assignment changes.

Registry member allocation and public/model gates remain OPEN. Symbolic validator obligations are preserved, not replaced with namespace-only roles.

| Type/version | Record | Fields |
| --- | --- | --- |
|542/1|TrialPanelPresentObservation|1 Observation; 2 Observer; 3 At; 4 Glyph; 5 Stage; 6 TransformationVersion|
|543/1|PerceivedTrialContextEvidence|1 Experience; 2 Context; 3 Panel|
|544/1|PositiveEventChildEvidence|1 Encoding; 2 Context?|
|545/1|RetainedBodyView|1 Sample; 2 Context?|
|546/1|PositiveBodySignalGroup|1 Signal; 2 Views|
|547/1|PositiveEventAcquisitionContent|1 Calibration; 2 Children|
|548/1|PositiveBodyAcquisitionContent|1 Children|
|549/1|AcquisitionFormationEvidence|1 Acquisition; 2 Observer; 3 At; 4 SourceSelection; 5 TransformationVersion; 6 Content|
|550/1|SurvivingEventChild|1 Evidence; 2 UseProtection; 3 OutcomeSignificanceDirections|
|551/1|SurvivingBodyChild|1 Evidence; 2 UseProtection; 3 OutcomeSignificanceDirections|
|552/1|SurvivingEventContent|1 Calibration; 2 Children|
|553/1|SurvivingBodyContent|1 Children|
|554/1|RetainedAcquisition|1 Acquisition; 2 Observer; 3 At; 4 SourceSelection; 5 TransformationVersion; 6 Content|
|555/1|SurvivingEpisodeLedger|1 Entries|
|556/1|GoalClosedInterval|1 Lower; 2 Upper|
|557/1|MaintenanceGoalKey|1 Character; 2 GoalReferent|
|558/1|MaintenanceGoalSpec|1 Definition; 2 Key; 3 Signal; 4 Desired; 5 ActiveFrom; 6 ExpiresAt|
|559/1|AdoptedMaintenanceGoal|1 Spec; 2 AdoptedAt; 3 Status; 4 ChangedAt|
|560/1|MaintenanceGoalLedger|1 Entries|
|561/1|MaintenanceGoalCommand|1 Spec; 2 Action|
|562/1|GoalAssessmentUnavailable|1 Cause|
|563/1|GoalDistanceAssessment|1 BeforeDistance; 2 AfterDistance; 3 BeforePosition; 4 AfterPosition; 5 Relation; 6 Boundary|
|564/1|GoalQualifies|1 Direction|
|565/1|GoalDoesNotQualify|1 Reason|
|566/1|GoalQualificationIndeterminate|1 Reason|
|567/1|GoalQualificationUnavailable|1 Cause|
|568/1|GoalOutcomeAssessment|1 Assessment; 2 Observer; 3 Goal; 4 Consequence; 5 At; 6 TransformationVersion; 7 AssessmentValue; 8 Qualification|
|569/1|GoalQualificationCarry|1 Assessment; 2 Observer; 3 Goal; 4 Consequence; 5 AssessedAt; 6 Qualification; 7 TransformationVersion|
|570/1|GoalQualificationDelivery|1 TargetOriginal; 2 DueAt; 3 Carry?; 4 SourceAt|
|571/1|EventChildKey|1 Continuant|
|572/1|BodyChildKey|1 Signal|
|573/1|RetainedChildAddress|1 Acquisition; 2 Child|
|574/1|RetainedViewAddress|1 Child; 2 View|
|575/1|RetainedAttributionResult|1 Result; 2 Observer; 3 Character; 4 Consequence; 5 At; 6 TransformationVersion; 7 Disposition; 8 Consumed; 9 Targets|
|576/1|QualifiedSignificanceJoin|1 Qualification; 2 Attribution|
|577/1|QualifiedFormationSource|1 Character; 2 Selection|
|578/1|FormationAdmission|1 AcquisitionKind|
|579/1|FormationSuccess|1 Acquisition; 2 FormedAt; 3 CompleteLoss|
|580/1|FormationGovernanceValue|1 AdmittedSources; 2 SuccessfulFormations|
|581/1|FormationGovernanceState|1 Value|
|582/1|FormationSourceBinding|1 Producer; 2 AuditSchema; 3 SelectionField; 4 ViewSchema; 5 Projection; 6 AcquisitionKind|
|583/1|RuntimeProtocolStateDeclaration|1 Path; 2 ValueSchema; 3 Authority; 4 Classification; 5 RemovalAllowed|
|584/1|FormationOwnerBinding|1 Owner; 2 Authority; 3 Path|
|585/1|FormationGovernanceProfile|1 Definition; 2 MaximumQualifiedSources; 3 State; 4 Sources; 5 Owner; 6 Hooks|
|586/1|FormationOwnerDisposition|1 Formed; 2 NewCompleteLoss|
|587/1|RecalledAcquisitionEvidence|1 Acquisition; 2 Observer; 3 At; 4 SourceSelection; 5 TransformationVersion; 6 Content|
|588/1|EventRecallWinner|1 Evidence; 2 Score|
|589/1|BodyRecallWinner|1 Evidence|
|590/1|Recollection|1 Occurrence; 2 Subject; 3 At; 4 Content|
|591/1|EventRecallScore|1 Acquisition; 2 Base; 3 Pull; 4 Score|
|592/1|EventRecallResult|1 Observer; 2 Subject; 3 At; 4 Disposition; 5 Scores; 6 Winners|
|593/1|BodyRecallResult|1 Observer; 2 Subject; 3 At; 4 Disposition; 5 Eligible; 6 Winners|
|594/1|PresentationEntry|1 Acquisition; 2 Times|
|595/1|PresentationLedger|1 Entries|
|596/1|RecollectionInput|1 ObserverId; 2 Result|
|597/1|PresentationInput|1 ObserverId; 2 Recollections|
|598/1|SafeSignalDeclaration|1 Channel; 2 Signal|
|599/1|BodyOpportunityEvidence|1 Observer; 2 At; 3 Samples; 4 Experience?; 5 Declarations; 6 Context?|
|600/1|BodySelectionInput|1 ObserverId; 2 Source|
|601/1|BodyCueInput|1 ObserverId; 2 Source|
|602/1|BodySelectionAuditRow|1 Signal; 2 ViewCount; 3 Disposition|
|603/1|BodySelectionAudit|1 Selection; 2 Observer; 3 At; 4 Opportunity?; 5 Rows|
|604/1|BodySelectedView|1 Selection; 2 Observer; 3 At; 4 Opportunity?; 5 Groups|
|605/1|BodyAcquisitionEvidenceInput|1 ObserverId; 2 Selected|
|606/1|BodySignalCue|1 Observer; 2 At; 3 Opportunity?; 4 Status; 5 Signals; 6 SupportingObservationIds|
|607/1|BodyRecallInput|1 ObserverId; 2 Cue|
|608/1|GridPosition|1 X; 2 Y|
|609/1|ObservedFeatureDetection|1 Detection; 2 Role; 3 Glyph?; 4 Position?|
|610/1|ExtendedObservation|1 Observation; 2 Observer; 3 At; 4 EventDetection?; 5 Detections|
|611/1|VisualOpportunityEvidence|1 Observation; 2 Tracks; 3 Event?; 4 Experience?; 5 Context?|
|612/1|SelectedSpatialWitness|1 Unit; 2 Detection; 3 Position?; 4 Class; 5 PeripheralCount|
|613/1|SpatialPreparation|1 Experience; 2 Claims; 3 Witnesses; 4 Calibration|
|614/1|VisualSelectionInput|1 ObserverId; 2 Source; 3 Calibration; 4 Claims|
|615/1|ExtendedSelected|1 Selected; 2 SpatialWitnesses; 3 Context?|
|616/1|EncodingJoinInput|1 ObserverId; 2 Selected; 3 Calibration|
|617/1|EncodingFactors|1 Base; 2 Role; 3 Attention; 4 Raw|
|618/1|EncodingEvaluationRow|1 Unit; 2 Status; 3 Factors?; 4 Strength?|
|619/1|EncodingEvaluation|1 Input; 2 Rows|
|620/1|RetainedEncodingUnit|1 Unit; 2 Bindings; 3 Claims; 4 Factors; 5 Strength; 6 SpatialWitness?|
|621/1|PositiveVisualCandidate|1 Selection; 2 Observer; 3 At; 4 Calibration; 5 Children|
|622/1|VisualCueInput|1 ObserverId; 2 Source|
|623/1|CueEvidence|1 Observer; 2 Observation; 3 At; 4 Experience?; 5 Status; 6 Detection?; 7 File?|
|624/1|AssociationMassRow|1 Masses|
|625/1|AssociationGraph|1 Nodes; 2 Rows; 3 LastUpdatedAt|
|626/1|TrackingWindowItem|1 File; 2 Glyph?|
|627/1|TrackingWindow|1 At; 2 Observation?; 3 Items|
|628/1|ActivePanelContext|1 Glyph; 2 Context|
|629/1|TrialPanelWindow|1 At; 2 Active?|
|630/1|GeneralEpisodeState|1 Value|
|631/1|GeneralAssociationState|1 Value|
|632/1|GeneralPresentationState|1 Value|
|633/1|MaintenanceGoalState|1 Value|
|634/1|GeneralTrackingState|1 Value|
|635/1|TrialPanelContextState|1 Value|
|636/1|ActualConcernCarry|1 Concern; 2 Subject; 3 SourceAt; 4 Response|
|637/1|NoConcernAvailable|1 Subject; 2 SourceAt; 3 Reason|
|638/1|FeedbackDelivery|1 TargetOriginal; 2 TargetAt; 3 Value|
|639/1|PriorConcernModulation|1 SourceStatus; 2 Branch; 3 ResidualMultiplier; 4 AssociativeWeight|
|640/1|PriorConcernEncodingInput|1 ObserverId; 2 Selected; 3 Feedback|
|641/1|PriorConcernEncodingEvaluation|1 Evaluation; 2 Feedback; 3 Modulation|
|642/1|PriorConcernRecallInput|1 ObserverId; 2 Cue; 3 Feedback|
|643/1|PriorConcernRecallEvaluation|1 Result; 2 Feedback; 3 Modulation|
|644/1|LocalReserveKey|1 Character; 2 Reserve|
|645/1|LocalReserveBodyBinding|1 Key; 2 Parameters|
|646/1|LocalReserveBodyRegistry|1 Bindings|
|647/1|LocalReserveChannel|1 Channel; 2 Observer; 3 Reserve; 4 Signal; 5 Width; 6 Available; 7 Permitted|
|648/1|LocalReserveChannelRegistry|1 Channels|
|649/1|LocalReserveState|1 Anchors|
|650/1|LocalReserveSamplingRequest|1 Observer; 2 Channels|
|651/1|LocalReserveReplenishment|1 Key; 2 Delivery|
|652/1|LocalReserveReplenishmentResult|1 Key; 2 At; 3 Prior; 4 Next; 5 Result|
|653/1|TrialPanelUnavailableObservation|1 Observation; 2 Observer; 3 At; 4 TransformationVersion|
|654/1|RequestedBodySamples|1 Observer; 2 At; 3 Samples; 4 Declarations|
|655/1|GeneralSourceSamplingRequest|1 Observer; 2 Body?; 3 Panel; 4 Visual|
|656/1|CompletedRequestedSamples|1 Observer; 2 At; 3 Request; 4 Body?; 5 Panel?; 6 Visual?; 7 EventDetection?; 8 ReservedExperience?|
|657/1|SourcePerceptionInput|1 Observer; 2 Samples|
|658/1|PositionSceneItem|1 Marker; 2 Role; 3 Position; 4 Glyph; 5 Visible; 6 Permitted; 7 RoleMode|
|659/1|PositionSceneFrame|1 At; 2 Items|
|660/1|PositionSceneDefinition|1 BindingSchema; 2 Frames|
|661/1|TrialPanelFrame|1 At; 2 Glyph; 3 Stage; 4 Visible; 5 Permitted|
|662/1|TrialPanelDefinition|1 Frames|
|663/1|GeneralSourceProfile|1 Observer; 2 Body; 3 Channels; 4 Panel; 5 Visual|
|664/1|ObservationUsePlan|1 BodySelection; 2 VisualSelection; 3 BodyCue; 4 VisualCue; 5 GoalAssessment?; 6 ExecutionPolicy|
|665/1|GeneralObservationOriginal|1 DueAt; 2 Profile; 3 Request; 4 Use; 5 Lane|
|666/1|GeneralSamplingInput|1 ObserverId; 2 Original; 3 World?|
|667/1|GeneralTrackingInput|1 ObserverId; 2 Samples; 3 Use|
|668/1|GeneralBindingInput|1 ObserverId; 2 Samples; 3 Use; 4 Tracks; 5 Event?|
|669/1|GeneralFreezeInput|1 ObserverId; 2 Samples; 3 Use; 4 Tracks; 5 Event?; 6 Bindings|
|670/1|GeneralUseInput|1 ObserverId; 2 Use; 3 Body?; 4 Visual?; 5 Claims|
|671/1|VisualAcquisitionEvidenceInput|1 ObserverId; 2 Candidate|
|672/1|EventRecallInput|1 ObserverId; 2 Cue|
|673/1|GeneralFormationOwnerInput|1 ObserverId; 2 Evidence|
|674/1|PriorConcernAppraisalInput|1 ObserverId; 2 Workspace|
|675/1|PriorConcernProducerInput|1 ObserverId; 2 Appraisal|
|676/1|PriorConcernDeliveryInput|1 ObserverId; 2 Delivery|
|677/1|GoalCommandInput|1 ObserverId; 2 Command|
|678/1|GoalDeadlineInput|1 ObserverId; 2 Spec; 3 AdoptedAt|
|679/1|GoalAssessmentInput|1 ObserverId; 2 Spec; 3 Source; 4 Recollections|
|680/1|FocalConsequenceDelivery|1 ObserverId; 2 Consequence?; 3 SourceAt; 4 TargetOriginal; 5 DueAt|
|681/1|GoalQualificationDeliveryInput|1 ObserverId; 2 Delivery|
|682/1|RetainedAttributionInput|1 ObserverId; 2 Focus; 3 Recollections|
|683/1|AttributionResultDelivery|1 ObserverId; 2 TargetOriginal; 3 DueAt; 4 Result?; 5 SourceAt|
|684/1|AttributionUseInput|1 ObserverId; 2 Result|
|685/1|SignificanceJoinInput|1 ObserverId; 2 Join?|
|686/1|SignificanceOpportunity|1 ObserverId; 2 Definition|
|687/1|GeneralSpatialCalibration|1 MinX; 2 MaxX; 3 MinY; 4 MaxY; 5 FocalWeight; 6 ResidualPool|
|688/1|GeneralEncodingCalibration|1 Law; 2 BudgetFloor; 3 ImportantThreshold|
|689/1|GeneralAssociationCalibration|1 Scale; 2 LearningRate; 3 AssociationDecayRate|
|690/1|GeneralEventAccessCalibration|1 Beta; 2 Scale; 3 PresentationDecayRate; 4 Exponent; 5 BaseWeight; 6 AssociationWeight; 7 Capacity|
|691/1|GeneralBodyRecallCalibration|1 Capacity|
|692/1|GeneralRetentionCalibration|1 EventSlots; 2 BodySlots; 3 Priority|
|693/1|GeneralGraphRetentionCalibration|1 Nodes; 2 Edges|
|694/1|GeneralFeedbackCalibration|1 EncodingEnabled; 2 RetrievalEnabled|
|695/1|GeneralRunBounds|1 CompletedSelectionLimit; 2 Horizon|
|696/1|GeneralBodySelectionCalibration|1 MaxSignals; 2 MaxViewsPerSignal; 3 MaxBytesPerSignal; 4 Capacity|
|697/1|GeneralGoalQualificationCalibration|1 Law|
|698/1|ObservationExecutionPolicy|1 BodySelection?; 2 VisualSelection?; 3 Spatial?; 4 Encoding?; 5 BodyRecall?; 6 GoalBaselineRecall?; 7 EventRecall?; 8 GoalQualification?|
|699/1|GeneralRetentionControl|1 Memory; 2 Graph; 3 Association|
|700/1|GeneralRetentionInput|1 ObserverId; 2 Definition|
|701/1|GeneralEventPresentationPlan|1 TargetOriginal|
|702/1|GeneralDefinitionBinding|1 Purpose; 2 Definition|
|703/1|GeneralOutputDeclaration|1 Schema; 2 Minimum; 3 Maximum; 4 IdentityMode|
|704/1|GeneralStageRegistration|1 Stage; 2 Seam; 3 Version; 4 Event; 5 Phase; 6 Input; 7 Outputs; 8 ReadDomain; 9 WriteAuthorization; 10 SubjectProjection?; 11 Definitions|

| Namespace | Family | Payload |
| --- | --- | --- |
|1044|LocalReserveId|nonempty canonical UTF-8 NFC text|
|1045|InteroceptiveSignalId|nonempty canonical UTF-8 NFC text|
|1145|AcquisitionOccurrenceId|unsigned shared runtime ordinal|
|1146|GoalOutcomeAssessmentId|unsigned shared runtime ordinal|
|1147|RetainedAttributionResultId|unsigned shared runtime ordinal|
|1148|ProposedRecollectionOccurrenceId|unsigned shared runtime ordinal|

Field-local enum tags and distinct-record union members are listed exactly in the accompanying JSON. They are numeric realization of the accepted layout, not new psychological ordering.
