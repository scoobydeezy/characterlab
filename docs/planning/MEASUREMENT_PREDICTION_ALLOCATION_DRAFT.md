# Measurement prediction allocation — draft

Version: measurement-prediction-allocation/0.1-draft. Status: PROPOSED ALLOCATION; NOT PERMANENT.

Mechanical realization of the accepted symbolic shape. No model activation.

| Type | Schema | Name | Required fields (id:name:type) |
|---:|---:|---|---|
| 359 | 1 | MeasurementPredictionDefinition | 1:SourceChannelId:ObservationChannelId; 2:ObservedSubjectId:CharacterId; 3:UnitId:ObservationUnitId; 4:MaxEvidenceCount:unsigned |
| 360 | 1 | MeasurementPredictionKey | 1:CharacterId:CharacterId; 2:PredictionDefinitionId:RegistryDefinitionId |
| 361 | 1 | MeasurementPrediction | 1:ExpectedReading:rational; 2:EvidenceBasis:set<237/1> |
| 362 | 1 | MeasurementPredictionState | 1:Predictions:map<360/1,361/1> |
| 363 | 1 | MeasurementPredictionTargetRequirement | 1:SubjectAccessor:ProjectionAccessorId; 2:PredictionDefinitionId:RegistryDefinitionId; 3:TargetStatePathTemplate:StatePathPattern; 4:OutputAccessor:ProjectionAccessorId |
| 364 | 1 | MeasurementPredictionApplicationRegistration | 1:ExecutingSeamId:SeamId; 2:ExecutingSeamVersion:text; 3:PredictionDefinitionId:RegistryDefinitionId; 4:InputAdmission:274/1; 5:ReadDomain:set<StatePathPattern>; 6:OutputDefinitions:set<277/1>; 7:WriteCapability:322/1; 8:IngressDefinition:276/1; 9:SubjectRequirements:set<343/1>; 10:TargetRequirements:set<363/1> |
| 365 | 1 | MeasurementPredictionReadCue | 1:ObserverId:ObserverId; 2:PredictionDefinitionId:RegistryDefinitionId |
| 366 | 1 | MeasurementPredictionReadout | 1:MeasurementPredictionReadoutId:MeasurementPredictionReadoutId; 2:Key:360/1; 3:Prediction:361/1 |
| 367 | 1 | MeasurementPredictionReadOutputDefinition | 1:OutputRecordSchema:254/1; 2:OutputOccurrenceRule:275/1 |
| 368 | 1 | MeasurementPredictionReadRegistration | 1:ExecutingSeamId:SeamId; 2:ExecutingSeamVersion:text; 3:PredictionDefinitionId:RegistryDefinitionId; 4:InputRecordSchema:254/1; 5:OpportunityDefinitionId:RegistryDefinitionId; 6:ReadDomain:set<StatePathPattern>; 7:OutputDefinitions:set<367/1>; 8:WriteCapability:273/1; 9:SubjectRequirements:set<266/1>; 10:TargetRequirements:set<363/1> |
| 369 | 1 | MeasurementPredictionOpportunityDefinition | 1:ProducingTransitionKind:TransitionKindId; 2:ApplicationEventTypeId:EventTypeId; 3:ReadEventTypeId:EventTypeId; 4:PredictionDefinitionId:RegistryDefinitionId; 5:ReadDelay:signed SimDuration |

Namespace1127: MeasurementPredictionReadoutId, unsigned shared runtime ordinal.
One output occurrence rule:366/schema1, field1, required namespace1127.

| Namespace | Permanent-member proposal |
|---:|---|
| 1036 | seam/measurement-prediction |
| 1009 | MeasurementPredictionApplicationTransition |
| 1009 | MeasurementPredictionReadTransition |
| 1001 | event/measurement-prediction-application |
| 1001 | event/measurement-prediction-read |
| 1001 | event/measurement-prediction-application-padding |
| 1001 | event/measurement-prediction-read-padding |
| 1027 | definition/measurement-prediction |
| 1027 | definition/measurement-prediction-opportunity |
| 1023 | registry/measurement-prediction |
| 1023 | registry/measurement-prediction-opportunity |
| 1025 | authority/belief-expectation |
| 1032 | leaf/measurement-prediction |
| 1028 | accessor/measurement-prediction-prior |
| 1028 | accessor/measurement-prediction-read |

| Record | Field | Required namespace | Domain validator |
|---:|---:|---:|---|
| 359 | 1 | 1005 | absent |
| 359 | 2 | 1002 | validator/character-qualification |
| 359 | 3 | 1039 | absent |
| 360 | 1 | 1002 | validator/character-qualification |
| 360 | 2 | 1027 | absent |
| 363 | 1 | 1028 | absent |
| 363 | 2 | 1027 | absent |
| 363 | 4 | 1028 | absent |
| 364 | 1 | 1036 | absent |
| 364 | 3 | 1027 | absent |
| 365 | 1 | 1000 | absent |
| 365 | 2 | 1027 | absent |
| 366 | 1 | 1127 | absent |
| 368 | 1 | 1036 | absent |
| 368 | 3 | 1027 | absent |
| 368 | 5 | 1027 | absent |
| 369 | 1 | 1009 | absent |
| 369 | 2 | 1001 | absent |
| 369 | 3 | 1001 | absent |
| 369 | 4 | 1027 | absent |

No new union/finite tag, cue/application occurrence, family identity, state operation or save field.
Numeric review is separate from runtime qualification. PRED-A..P remain NOT PASSED.
