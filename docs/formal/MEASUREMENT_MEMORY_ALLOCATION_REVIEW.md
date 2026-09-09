# Combined measurement-memory allocation review

**Status: PERMANENT AND FROZEN.**

Version: measurement-memory-allocation/0.1-candidate. Numeric allocation accepted and frozen on 2026-09-08. No runtime implementation or model materialization.

## Records

| RecordTypeId | Name | Required fields in numeric order (field:type) |
|---|---|---|
| 342 | MeasurementEpisodeLearningEvidence | 1 MeasurementEpisodeLearningEvidenceId:1125; 2 Source337:337; 3 TransformationVersion:text |
| 343 | EventDependentProjectedFieldPathRequirement | 1 SelectorSourceFieldPath:list<FieldId>; 2 TargetStatePathTemplate:149; 3 ProjectedFieldId:FieldId; 4 OutputRole:263; 5 OutputAccessor:1028 |
| 344 | MeasurementEpisodeKey | 1 CharacterId:1002; 2 CognitiveMeasurementEvidenceId:1124 |
| 345 | MeasurementEpisode | 1 LearningEvidence:342 |
| 346 | MeasurementEpisodeState | 1 Episodes:map<344,345> |
| 347 | MemoryFormationRegistration | 1 ExecutingSeamId:1036; 2 ExecutingSeamVersion:text; 3 TransitionDefinition:348; 4 IngressDefinition:276 |
| 348 | MemoryFormationDefinition | 1 InputAdmission:274; 2 ReadDomain:set<149>; 3 OutputDefinitions:set<277>; 4 WriteCapability:322 |
| 349 | MeasurementEpisodeReadRequirement | 1 SubjectAccessor:1028; 2 EvidenceSourceFieldId:FieldId; 3 TargetStatePathTemplate:149; 4 OutputAccessor:1028 |
| 350 | MeasurementRecallOpportunityDefinition | 1 ProducingTransitionKind:1009; 2 RecallEventTypeId:1001; 3 RecallDelay:SimDuration |
| 351 | MeasurementRecallCue | 1 ObserverId:1000; 2 CognitiveMeasurementEvidenceId:1124 |
| 352 | MeasurementRecollection | 1 MeasurementRecollectionId:1126; 2 Episode:345; 3 TransformationVersion:text |
| 353 | RecallRegistration | 1 ExecutingSeamId:1036; 2 ExecutingSeamVersion:text; 3 InputAdmission:354; 4 ReadDomain:set<149>; 5 OutputDefinitions:set<355>; 6 WriteCapability:273 |
| 354 | DelayedRecallEventAdmission | 1 InputRecordSchema:254; 2 OpportunityDefinitionId:1027 |
| 355 | RecollectionOutputDefinition | 1 OutputRecordSchema:254 |

All schemas version1. FieldId uses existing unsigned field-identifier grammar; SimDuration uses canonical signed Int64 with the accepted positive constraint. Embedded records have exact type/schema; no union branch is added. Existing322 StateWrites and273 NoStateWrites are reused.

## Occurrence namespaces

| Namespace | Family | Payload |
|---|---|---|
| 1125 | MeasurementEpisodeLearningEvidenceId | unsigned-runtime-ordinal |
| 1126 | MeasurementRecollectionId | unsigned-runtime-ordinal |

Only342/1 and352/1 have new occurrence rules, each field1 matching its namespace/role. Cue351 has no occurrence rule;344 is an address, not an occurrence.

## Permanent members

| Namespace | Canonical NFC payload |
|---|---|
| 1009 | MeasurementEpisodeEvidenceTransition |
| 1009 | MemoryFormationTransition |
| 1009 | MeasurementRecallTransition |
| 1036 | seam/measurement-episodic-memory |
| 1001 | event/measurement-episode-evidence |
| 1001 | event/measurement-episode-formation |
| 1001 | event/measurement-exact-recall |
| 1001 | event/measurement-episode-evidence-padding |
| 1001 | event/measurement-episode-formation-padding |
| 1001 | event/measurement-future-padding |
| 1027 | definition/measurement-recall-opportunity |
| 1023 | registry/measurement-recall-opportunity |
| 1025 | authority/measurement-episode-formation |
| 1032 | leaf/measurement-episode |
| 1028 | accessor/measurement-episode-read |

## New canonical record-field roles

| Record | Field | Namespace | DomainValidator |
|---|---|---|---|
| 342 | 1 | 1125 | absent |
| 343 | 5 | 1028 | absent |
| 344 | 1 | 1002 | validator/character-qualification |
| 344 | 2 | 1124 | absent |
| 347 | 1 | 1036 | absent |
| 349 | 1 | 1028 | absent |
| 349 | 4 | 1028 | absent |
| 350 | 1 | 1009 | absent |
| 350 | 2 | 1001 | absent |
| 351 | 1 | 1000 | absent |
| 351 | 2 | 1124 | absent |
| 352 | 1 | 1126 | absent |
| 353 | 1 | 1036 | absent |
| 354 | 2 | 1027 | absent |

Reuse203/2 ObserverId role1000 with absent validator exactly once. Record-valued fields receive schema typing, not identity roles. Key344 fields validate separately; no identity-atom MapKey role is attached to the composite key. Existing IDN role/grammar declarations are reused by the successor model.

## State and registry realization

Root346 field1 Episodes uses exact map key344/value345; one writable entry family, sole authority/measurement-episode-formation, RemovalAllowed=false. Topology singleton284 retains adaptation-input/0.31-candidate; only episodic Storage bytes change. Mutation authority/IDN read-only/key declarations retain existing schema types. Projection collections remain TransitionSeamContract-owned; no new global registry home is allocated.

M1 uses existing V04. Formation uses347/348; write-ablation uses existing V04. Recall and read-ablation share353/354 with output set singleton355 or empty. Opportunity row uses350. The six new scheduler event members include three private kinds; none adds a payload occurrence ID. Profiles/versions are accepted text identifiers, not new numeric namespaces.

## Scope and gates

Frozen IDs append after record341 and occurrence1124. No renumbering, reuse or insertion-by-shifting. Fifteen member payloads use existing namespaces. No fixture promotion. These exact assignments are permanent: no renumbering, reuse, or insertion-by-shifting. Successor packaging is authorized next; runtime implementation remains gated.

Excluded allocations: projection registry kind/definitions; new topology semantic version; CueId; MemoryEpisodeId; formation occurrence ID; padding occurrence IDs; stage-policy types; persistence certificates; ValidatedPendingGeneratedAssociation canonical record; new write capability; new save field; concrete RecallDelay value; runtime implementation.

The TransitionSeamContract collection serialization question remains a later packaging gate. Concrete RecallDelay is model-materialization data. MEMR-A..P FROZEN/NOT PASSED; ADAPT-9b, parent control9, PHEN-ADAPT and Campaign2 OPEN.
