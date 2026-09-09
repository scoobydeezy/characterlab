# Measurement prediction corrective schema allocation

Version: measurement-prediction-correction-allocation/0.1-candidate. Status: PERMANENT AND FROZEN.

Accepted by agent self-review,2026-09-09. No new numeric identity or member.
Current semantic authority: MEASUREMENT_PREDICTION_OCCURRENCE_CORRECTION.md.

| Type | Schema | Name | Fields |
|---:|---:|---|---|
| 367 | 2 | MeasurementPredictionReadOutputDefinition | 1:OutputRecordSchema:254/1:required; 2:OutputOccurrenceRule:275/1:RETIRED, MUST BE ABSENT |
| 368 | 2 | MeasurementPredictionReadRegistration | 1:ExecutingSeamId:SeamId:required; 2:ExecutingSeamVersion:text:required; 3:PredictionDefinitionId:RegistryDefinitionId:required; 4:InputRecordSchema:254/1:required; 5:OpportunityDefinitionId:RegistryDefinitionId:required; 6:ReadDomain:set<StatePathPattern>:required; 7:OutputDefinitions:set<367/2>:required; 8:WriteCapability:273/1:required; 9:SubjectRequirements:set<266/1>:required; 10:TargetRequirements:set<363/1>:required |

The367/1 and368/1 allocation artifacts remain preserved history and are excluded
from new prediction models. Field367/2 remains reserved; its encoded presence is0
in schema2. No renumbering, reuse, silent record reinterpretation or digest alias.

Readout366/1 identity remains field1 / namespace1127, governed solely by the shared
279/3 OccurrenceIdentities entry containing278. Output-definition367/2 contains no
active occurrence-rule field. All other prediction record schemas remain1.

PRED-A..P remain NOT PASSED. Full profile materialization still gates implementation.
