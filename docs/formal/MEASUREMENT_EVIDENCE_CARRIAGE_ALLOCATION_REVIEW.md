# Measurement-evidence carriage — allocation review

**Status: PERMANENT AND FROZEN.**
Version: `measurement-evidence-carriage-allocation/0.1-candidate`. Accepted 2026-09-07. All listed assignments are permanent.

Authority: [accepted carriage contract](MEASUREMENT_EVIDENCE_CARRIAGE.md).

## New records

| RecordTypeId | Name | Schema |
|---|---|---|
| 336 | MeasurementEvidenceIntakeDefinition | 1 |
| 337 | CognitiveMeasurementEvidence | 1 |
| 338 | AuthenticatedObserverMeasurementProducer | 1 |
| 339 | TransitionInputAdmissionV07 | 1 |
| 340 | TransitionDefinitionV07 | 1 |
| 341 | TransitionRegistrationV07 | 1 |

All fields are required. V07 reuses the V04 field order where unchanged.

| Record | Field | Name | Type |
|---|---|---|---|
| 336 | 1 | ObserverId | ObserverId |
| 336 | 2 | ObservationChannelId | ObservationChannelId |
| 336 | 3 | UnitId | ObservationUnitId |
| 337 | 1 | CognitiveMeasurementEvidenceId | CognitiveMeasurementEvidenceId |
| 337 | 2 | Observation | PresentObservation |
| 337 | 3 | UnitId | ObservationUnitId |
| 337 | 4 | TransformationVersion | text |
| 338 | 1 | ProducingSeamId | SeamId |
| 338 | 2 | ProducingSeamVersion | text |
| 338 | 3 | ProducerEventTypeId | EventTypeId |
| 338 | 4 | ProducerPhase | u |
| 338 | 5 | OutputRecordSchema | CanonicalRecordSchemaRef |
| 339 | 1 | InputRecordSchema | CanonicalRecordSchemaRef |
| 339 | 2 | Producer | AuthenticatedObserverMeasurementProducer |
| 339 | 3 | RequiredSourceRelation | u |
| 340 | 1 | InputAdmission | TransitionInputAdmissionV07 |
| 340 | 2 | ReadDomain | set<StatePathPattern> |
| 340 | 3 | OutputDefinitions | set<TransitionOutputDefinition> |
| 340 | 4 | WriteCapability | WriteCapabilityV04 |
| 341 | 1 | ExecutingSeamId | SeamId |
| 341 | 2 | ExecutingSeamVersion | text |
| 341 | 3 | TransitionDefinition | TransitionDefinitionV07 |
| 341 | 4 | IngressDefinition | TransitionIngressDefinition |

## New occurrence namespace

| Namespace | Family | Payload |
|---|---|---|
| 1124 | CognitiveMeasurementEvidenceId | unsigned-runtime-ordinal |

Only the shared runtime allocator supplies the fresh ordinal. Embedding 203 allocates no
second observation. No fixture namespace is promoted.

## New text members of existing families

| Namespace | Exact NFC text payload |
|---|---|
| 1009 | MeasurementEvidenceIntakeTransition |
| 1001 | event/measurement-evidence-intake |
| 1001 | event/measurement-evidence-padding |
| 1036 | seam/measurement-evidence-carriage |
| 1027 | definition/measurement-evidence-intake |
| 1023 | registry/measurement-evidence-intake |

These are six member additions, not six namespace allocations. Existing registry/transition-registration
and definition/transition-admission are reused. No LearningRouteId member is added.

## Canonical roles and occurrence rules

| Record | Field | RequiredNamespace | DomainValidator |
|---|---|---|---|
| 336 | 1 | 1000 | absent |
| 336 | 2 | 1005 | absent |
| 336 | 3 | 1039 | absent |
| 337 | 1 | 1124 | absent |
| 337 | 3 | 1039 | absent |
| 338 | 1 | 1036 | absent |
| 338 | 3 | 1001 | absent |
| 341 | 1 | 1036 | absent |

Reuse existing RecordField(203,1) role with namespace 1115 and absent DomainValidator; do not duplicate it.
Add only these occurrence rules to the existing V04 singleton data:

| Schema | IdentityFieldId | RequiredNamespace | DomainValidator |
|---|---|---|---|
| 203/1 | 1 | 1115 | absent |
| 337/1 | 1 | 1124 | absent |

## Closed V07 grammar and reuse

338/1 directly represents the sole accepted AuthenticatedObserverMeasurementProducer form.
There is no producer union or VariantTag to allocate: future producer forms require separately
committed semantics. This is the thinnest realization of the accepted five-field record.
V04/V06 producer unions remain byte-identical. Reuse WriteCapabilityV04/273 and its existing
sole NoStateWrites variant; no new write capability or union-variant registry entry.

339 field 3 admits only unsigned 1 = ExactImmediateProducerOutput, preserving the existing
source-relation meaning at this new field position. Reuse 276 ingress (SameAsProducer=1,
ExactAdmittedSourceOutput=1, ExactlyOncePerSourcePerConsumer=1, phase 130) and 277 output
(ExactlyOnePerExecution=1). No new phase or finite semantics.

The fixed producer has seam/regulatory-diagnostic-probe, regulatory-diagnostic-probe/0.1-candidate,
event/regulatory-diagnostic-probe-observation, phase 120 and 203/1. 339 input schema equals
that output schema. 340 ReadDomain is empty, OutputDefinitions is exactly 337/1 with multiplicity 1,
and WriteCapability is NoStateWrites. 341 executing seam/version is the accepted carriage contract.

## Registry rows and later packaging

| Kind | StableId | DefinitionVersion | Definition schema |
|---|---|---|---|
| registry/transition-admission | definition/transition-admission | transition-admission/0.4-candidate | 279/1 |
| registry/measurement-evidence-intake | definition/measurement-evidence-intake | measurement-evidence-carriage/0.1-candidate | 336/1 |
| registry/transition-registration | MeasurementEvidenceIntakeTransition | transition-admission-extension/0.7-candidate | 341/1 |

Exactly one of each listed row in the first profile. V04 EVID and V06 ADAPT rows remain unchanged.
336 owner/channel/unit must match committed diagnostic channel; no SubjectId ownership shortcut.
The 341 row has no TransitionRoutes entry. Dispatch uses committed kind, StableId, version and schema.

Successor packaging must change RegistryManifest, RegistryIdentity,
RulesVersion and ModelIdentity. No packet is materialized here. Six runtime advances/eight children
and exact ingress/padding ownership remain the accepted contract. EVC-A..P remain FROZEN, NOT PASSED.

The accompanying audit checks allocation consistency and frozen-file preservation, not runtime
qualification. Records 336..341, namespace 1124 and the six text members are permanently frozen;
no renumbering, reuse or insertion-by-shifting is permitted.
No implementation, new state root, CharacterId family, evidence store or observation family.

Allocation freeze authorizes successor registry/profile packaging next. Implementation remains
blocked until the later packaging/materialization gates are accepted. No EVC control passes
by this allocation acceptance.
