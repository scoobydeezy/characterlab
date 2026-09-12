# Attention numeric proposal

attention-allocation/0.1-draft — NOT PERMANENT. Separate numeric gate only.
Records516..541/1; SelectionOccurrenceId1143; ProcessingOccurrenceId1144.
No semantic revision, runtime codec activation or model commitment.

|Record|Name|Ordered fields (? means optional)|
|---|---|---|
|516/1|AttentionSceneDefinition|1 PortReferents; 2 PortRoles; 3 Version|
|517/1|AttentionSceneOriginal|1 DueAt; 2 SceneDefinitionId|
|518/1|AttentionRoleChannelDefinition|1 ObserverId; 2 PortModes; 3 Version|
|519/1|AttentionSelectionPolicy|1 Algorithm; 2 Capacity; 3 Version|
|520/1|ObservedRoleDetection|1 DetectionId; 2 RoleEvidence|
|521/1|AttentionRoleObservation|1 ObservationId; 2 ObserverId; 3 OccurredAt; 4 EventDetectionId; 5 Detections; 6 TransformationVersion|
|522/1|AttentionNoDetectionObservation|1 ObservationId; 2 ObserverId; 3 OccurredAt; 4 TransformationVersion|
|523/1|AttentionTrackingInput|1 Observation|
|524/1|AttentionBindingInput|1 Observation; 2 EventTransition; 3 TrackTransitions|
|525/1|AttentionClassificationInput|1 Observation; 2 EventTransition; 3 Bindings|
|526/1|AttentionFreezeInput|1 Observation; 2 EventTransition; 3 Bindings|
|527/1|AttentionRoleBatchInput|1 Experience|
|528/1|AttentionPositiveSelectionInput|1 Experience; 2 Claims|
|529/1|AttentionEmptySelectionInput|1 Observation|
|530/1|AttentionUnitKey|1 EventFile; 2 ContinuantFile|
|531/1|AttentionAuditRow|1 Unit; 2 Roles; 3 Exclusion; 4 Priority?; 5 Selected; 6 EvidenceRefs|
|532/1|AttentionSelectionAudit|1 SelectionId; 2 ObserverId; 3 OccurredAt; 4 Source; 5 Policy; 6 Rows; 7 TransformationVersion|
|533/1|SelectedAttentionUnit|1 Unit; 2 Bindings; 3 Claims|
|534/1|SelectedEvidenceView|1 SelectionId; 2 ObserverId; 3 OccurredAt; 4 Units|
|535/1|AttentionProcessingReceipt|1 ProcessingId; 2 SelectionId; 3 ObserverId; 4 OccurredAt; 5 ReadValues; 6 TransformationVersion|
|536/1|AttentionSelectionSource|1 Tag; 2 ExperienceId?; 3 ObservationId?|
|537/1|AttentionReadValue|1 Tag; 2 Binding?; 3 Claim?|
|538/1|AttentionIngressDefinition|1 Tag; 2 ParentStages|
|539/1|AttentionOutputDefinition|1 Schema; 2 Count; 3 Identity|
|540/1|AttentionReadAccess|1 AccessorId; 2 PathPattern|
|541/1|AttentionStageRegistration|1 Stage; 2 SeamId; 3 SeamVersion; 4 EventTypeId; 5 Phase; 6 InputSchema; 7 Ingress; 8 Outputs; 9 Allocations; 10 Reads; 11 WritableStateFamilies|

|Namespace|Family|Exact text member|
|---|---|---|
|1009|TransitionKindId|transition/attention-world|
|1001|EventTypeId|event/attention-world|
|1036|SeamId|seam/attention-world|
|1009|TransitionKindId|transition/attention-observe|
|1001|EventTypeId|event/attention-observe|
|1036|SeamId|seam/attention-observe|
|1009|TransitionKindId|transition/attention-track|
|1001|EventTypeId|event/attention-track|
|1036|SeamId|seam/attention-track|
|1009|TransitionKindId|transition/attention-bind|
|1001|EventTypeId|event/attention-bind|
|1036|SeamId|seam/attention-bind|
|1009|TransitionKindId|transition/attention-classify|
|1001|EventTypeId|event/attention-classify|
|1036|SeamId|seam/attention-classify|
|1009|TransitionKindId|transition/attention-freeze|
|1001|EventTypeId|event/attention-freeze|
|1036|SeamId|seam/attention-freeze|
|1009|TransitionKindId|transition/attention-role|
|1001|EventTypeId|event/attention-role|
|1036|SeamId|seam/attention-role|
|1009|TransitionKindId|transition/attention-positive-select|
|1001|EventTypeId|event/attention-positive-select|
|1036|SeamId|seam/attention-positive-select|
|1009|TransitionKindId|transition/attention-empty-select|
|1001|EventTypeId|event/attention-empty-select|
|1036|SeamId|seam/attention-empty-select|
|1009|TransitionKindId|transition/attention-consume|
|1001|EventTypeId|event/attention-consume|
|1036|SeamId|seam/attention-consume|
|1028|ProjectionAccessorId|accessor/attention-continuant-counter|
|1028|ProjectionAccessorId|accessor/attention-continuant-active|
|1028|ProjectionAccessorId|accessor/attention-event-counter|
|1028|ProjectionAccessorId|accessor/attention-event-active|
|1000|ObserverId|observer/attention-subject|
|1001|EventTypeId|event/attention-participation-scene|
|1004|SemanticKindId|semantic-kind/attention-scene-object|
|1023|RegistryKindId|registry/attention-definition|
|1027|DefinitionId|definition/attention-scene-base|
|1027|DefinitionId|definition/attention-scene-swap|
|1027|DefinitionId|definition/attention-scene-tie|
|1027|DefinitionId|definition/attention-scene-instrument-a|
|1027|DefinitionId|definition/attention-scene-instrument-b|
|1027|DefinitionId|definition/attention-scene-instrument-c|
|1027|DefinitionId|definition/attention-scene-beneficiary-a|
|1038|GovernedContentDefinitionId|content/attention-port-a|
|1038|GovernedContentDefinitionId|content/attention-port-b|
|1038|GovernedContentDefinitionId|content/attention-port-c|
|1027|DefinitionId|definition/attention-channel|
|1027|DefinitionId|definition/attention-policy|
|1027|DefinitionId|definition/attention-event-schema|
|1027|DefinitionId|definition/attention-causal-role-model|

Four1024 members are canonical unsigned pairs: (536,1), (536,2), (537,1), (537,2).
The JSON companion fixes all roles, occurrence fields, closed finite tags and collection domains.
Capacity retains literal values0/1/2; enum ordinals do not replace those capacities.
No renumbering/reuse/insertion-by-shifting is permitted after acceptance.
