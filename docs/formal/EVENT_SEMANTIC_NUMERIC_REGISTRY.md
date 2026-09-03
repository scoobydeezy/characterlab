# Event Semantic Permanent Numeric Registry

**Status:** accepted `SEM-001I.2` (2026-09-03); permanent allocation

**Depends on:** accepted [`SEM-001I.1`](EVENT_SEMANTIC_SCHEMA_INVENTORY.md), `cenc/1`, and `cenc-records/0.1-candidate`

**Rule:** allocation assigns numbers to accepted semantics. It may not change a shape, add meaning to an ordinal, or infer order/priority from a number. Once accepted, every tuple in this document is permanent and retired values are never reused.

## Allocation ranges

| Range | Purpose |
|---:|---|
| record types `210..259` | event-semantic records, state, unions, and governed definitions |
| allocated typed-ID namespaces within `1000..1024` | semantic/model identity families; `1004` is absent and available |
| typed occurrence namespaces `1100..1115` | run-scoped allocator outputs |
| per-registry values `1..n` | closed enum and finite semantic vocabularies |

These ranges are independent numeric domains. Equality across domains has no meaning. Test-only record type range `10000..19999` remains prohibited from authoritative artifacts.

## Canonical record types and fields

Every schema version is `1`. `?` marks an optional field whose presence byte is still encoded by `cenc/1`. All other fields are required.

| Type | Record | Fields `(ID: meaning)` |
|---:|---|---|
| 210 | `WorldEventTruth` | `1 WorldEventId`, `2 EventTypeId`, `3 OccurredAt`, `4 EventBindings` |
| 211 | `EventBinding` | `1 EventBindingId`, `2 EventRoleId`, `3 SemanticReferentId` |
| 212 | `PerceptualReferentId` | `1 ObserverId`, `2 ObserverTrackSequence` |
| 213 | `PerceptualEventReferentId` | `1 ObserverId`, `2 ObserverEventSequence` |
| 214 | `CurrentDetectionId` | `1 ObserverId`, `2 DetectionOccurrenceId` |
| 215 | `CurrentEventDetectionId` | `1 ObserverId`, `2 EventDetectionOccurrenceId` |
| 216 | `SupportingObservationId` | `1 ObserverId`, `2 ObservationId` |
| 217 | `PerceptualTrackTransition` | `1 ObserverId`, `2 PriorPerceptualReferentId?`, `3 PerceptualReferentId`, `4 CurrentDetectionId`, `5 ContinuityKind`, `6 SupportingObservationIds`, `7 OccurredAt`, `8 TransformationVersion` |
| 218 | `PerceptualTrackEnd` | `1 ObserverId`, `2 PerceptualReferentId`, `3 SupportingObservationIds`, `4 OccurredAt`, `5 TransformationVersion` |
| 219 | `PerceptualEventTransition` | `1 ObserverId`, `2 PriorPerceptualEventReferentId?`, `3 PerceptualEventReferentId`, `4 CurrentEventDetectionId`, `5 ContinuityKind`, `6 SupportingObservationIds`, `7 OccurredAt`, `8 TransformationVersion` |
| 220 | `PerceptualEventEnd` | `1 ObserverId`, `2 PerceptualEventReferentId`, `3 SupportingObservationIds`, `4 OccurredAt`, `5 TransformationVersion` |
| 221 | `PermittedPerceptualFeatureObservation` | `1 FeatureObservationId`, `2 ObserverId`, `3 CurrentDetectionId`, `4 PerceptualReferentId`, `5 PerceptualFeatureId`, `6 BooleanValue`, `7 ObservationChannelId`, `8 SupportingObservationIds`, `9 OccurredAt`, `10 TransformationVersion` |
| 222 | `PermittedPerceptualEventFeatureObservation` | `1 EventFeatureObservationId`, `2 ObserverId`, `3 CurrentEventDetectionId`, `4 PerceptualEventReferentId`, `5 PerceptualEventFeatureId`, `6 BooleanValue`, `7 ObservationChannelId`, `8 SupportingPerceptualReferentIds`, `9 SupportingObservationIds`, `10 OccurredAt`, `11 TransformationVersion` |
| 223 | `EventRoleEvidence` | `1 VariantTag`, `2 EventRoleId?` |
| 224 | `PerceivedBindingEvidence` | `1 PerceivedBindingId`, `2 ObserverId`, `3 PerceptualEventReferentId`, `4 PerceptualReferentId`, `5 EventRoleEvidence`, `6 SupportingObservationIds`, `7 OccurredAt`, `8 TransformationVersion` |
| 225 | `PerceptualClassificationEvidence` | `1 ClassificationEvidenceId`, `2 ExperienceId`, `3 ObserverId`, `4 PerceptualReferentId`, `5 PerceptualFacetId`, `6 TypedPerceivedValue`, `7 ClassificationRuleId`, `8 SupportingFeatureObservationIds`, `9 SupportingObservationIds`, `10 OccurredAt`, `11 TransformationVersion` |
| 226 | `PerceptualEventClassificationEvidence` | `1 EventClassificationEvidenceId`, `2 ExperienceId`, `3 ObserverId`, `4 PerceptualEventReferentId`, `5 PerceptualEventFacetId`, `6 TypedPerceivedValue`, `7 EventClassificationRuleId`, `8 SupportingEventFeatureObservationIds`, `9 SupportingPerceptualReferentIds`, `10 SupportingObservationIds`, `11 OccurredAt`, `12 TransformationVersion` |
| 227 | `PreRecognitionSemanticExperience` | `1 ExperienceId`, `2 ObserverId`, `3 OccurredAt`, `4 PerceptualEventReferentIds`, `5 PerceivedBindings`, `6 PerceptualClassifications`, `7 PerceptualEventClassifications`, `8 SupportingObservationIds`, `9 TransformationVersion` |
| 228 | `RecognitionCandidateCatalogEntry` | `1 ObserverId`, `2 CandidateSemanticReferentId`, `3 CandidateDomain`, `4 RecognitionTemplateIds`, `5 CatalogEntryVersion` |
| 229 | `ObserverIdentitySymbolMapping` | `1 ObserverSymbolCandidateMappingId`, `2 ObserverId`, `3 PerceivedIdentitySymbolId`, `4 CandidateSemanticReferentId`, `5 MappingVersion` |
| 230 | `RecognitionCueSource` | `1 VariantTag`, `2 RecognitionTemplateId?`, `3 PerceivedIdentitySymbolId?`, `4 ObserverSymbolCandidateMappingId?` |
| 231 | `RecognitionExperienceEvidenceRef` | `1 VariantTag`, `2 ClassificationEvidenceId?`, `3 PerceivedBindingId?`, `4 SupportingObservationId?` |
| 232 | `PermittedRecognitionCueEvidence` | `1 RecognitionCueEvidenceId`, `2 ExperienceId`, `3 ObserverId`, `4 PerceptualReferentId`, `5 CandidateSemanticReferentId`, `6 RecognitionCueSource`, `7 CuePolarity`, `8 SupportingExperienceEvidenceRefs`, `9 OccurredAt`, `10 TransformationVersion` |
| 233 | `RecognitionEvaluationResult` | `1 VariantTag`, `2 NoUpdateReason?`, `3 CandidateSemanticReferentId?` |
| 234 | `RecognitionEvaluation` | `1 RecognitionEvaluationId`, `2 ExperienceId`, `3 ObserverId`, `4 PerceptualReferentId`, `5 RecognitionRuleId`, `6 EvaluatedRecognitionCueEvidenceIds`, `7 PriorRecognitionResolutionId?`, `8 Result`, `9 OccurredAt`, `10 RecognitionVersion` |
| 235 | `RecognitionResolution` | `1 VariantTag`, `2 CandidateSemanticReferentId?` |
| 236 | `RecognitionResolutionRecord` | `1 RecognitionResolutionId`, `2 ExperienceId`, `3 ObserverId`, `4 PerceptualReferentId`, `5 Resolution`, `6 RecognitionRuleId`, `7 EvaluatedRecognitionCueEvidenceIds`, `8 RevisesRecognitionResolutionId?`, `9 OccurredAt`, `10 RecognitionVersion` |
| 237 | `CharacterEvidenceRef` | `1 VariantTag`, `2 ObservationId?`, `3 FeatureObservationId?`, `4 EventFeatureObservationId?`, `5 PerceivedBindingId?`, `6 ClassificationEvidenceId?`, `7 EventClassificationEvidenceId?`, `8 RecognitionCueEvidenceId?`, `9 RecognitionResolutionId?`, `10 CausalRoleEvidenceId?` |
| 238 | `EvidenceCarrier` | `1 VariantTag`, `2 PerceptualReferentId?`, `3 PerceptualEventReferentId?` |
| 239 | `EvidenceApplicabilityScope` | `1 ExperienceId?`, `2 WindowId?`, `3 ModalityId?`, `4 FeatureScopeId?`, `5 EvidenceCarrier?` |
| 240 | `CausalRoleEvidence` | `1 CausalRoleEvidenceId`, `2 ExperienceId`, `3 ObserverId`, `4 PerceptualEventReferentId`, `5 PerceptualReferentId`, `6 CausalRoleId`, `7 CausalRoleDerivationRuleId`, `8 SupportingEvidenceRefs`, `9 OccurredAt`, `10 TransformationVersion` |
| 241 | `PerceptualContinuantFileState` | `1 NextTrackSequenceByObserver`, `2 ActivePerceptualReferentIds` |
| 242 | `PerceptualEventFileState` | `1 NextEventSequenceByObserver`, `2 ActivePerceptualEventReferentIds` |
| 243 | `RecognitionKnowledgeState` | `1 CandidateCatalogEntries`, `2 IdentitySymbolMappings` |
| 244 | `RecognitionResolutionState` | `1 ResolutionRecords` |
| 245 | `MaxOccurrences` | `1 VariantTag`, `2 FiniteValue?` |
| 246 | `RoleCardinalityRule` | `1 EventRoleId`, `2 MinOccurrences`, `3 MaxOccurrences`, `4 ReferentDomainNarrowingValidatorId?` |
| 247 | `EventRoleDefinition` | `1 EventRoleId`, `2 BroadReferentDomainValidatorId`, `3 DefinitionVersion` |
| 248 | `EventTypeBindingSchema` | `1 EventTypeId`, `2 RoleCardinalityRules`, `3 BindingSchemaVersion`, `4 FixedActionReferentId?` |
| 249 | `PerceptualFacetDefinition` | `1 PerceptualFacetId`, `2 PerceivedValueType`, `3 ObservationDomainValidatorId`, `4 DefinitionVersion` |
| 250 | `PerceptualClassificationRuleDefinition` | `1 ClassificationRuleId`, `2 PermittedInputFeatureIds`, `3 OutputPerceptualFacetId`, `4 DerivationFunctionId`, `5 RuleVersion` |
| 251 | `PerceptualEventFacetDefinition` | `1 PerceptualEventFacetId`, `2 PerceivedValueType`, `3 ObservationDomainValidatorId`, `4 DefinitionVersion` |
| 252 | `PerceptualEventClassificationRuleDefinition` | `1 EventClassificationRuleId`, `2 PermittedInputEventFeatureIds`, `3 OutputPerceptualEventFacetId`, `4 DerivationFunctionId`, `5 RuleVersion` |
| 253 | `RecognitionRuleDefinition` | `1 RecognitionRuleId`, `2 RecognitionDomain`, `3 PermittedCueSourceKinds`, `4 DerivationFunctionId`, `5 RuleVersion` |
| 254 | `CanonicalRecordSchemaRef` | `1 TypeId`, `2 SchemaVersion` |
| 255 | `PermittedEvidenceSchema` | `1 ReferenceKind`, `2 RecordSchemaRef`, `3 ProducingEpistemicSeamVersion` |
| 256 | `EvidenceReadDomain` | `1 TransitionKindId`, `2 PermittedEvidenceSchemas`, `3 TemporalScope`, `4 PermittedModalityIds?`, `5 PermittedFeatureScopeIds?` |
| 257 | `EventRoleToCausalRoleRule` | `1 EventRoleId`, `2 CausalRoleId` |
| 258 | `CausalRoleDerivationRuleDefinition` | `1 CausalRoleDerivationRuleId`, `2 CausalRoleDomain`, `3 PermittedBasisKinds`, `4 Mappings`, `5 DerivationFunctionId`, `6 RuleVersion` |
| 259 | `UnionVariantDefinition` | `1 RecordTypeId`, `2 VariantTag`, `3 RequiredPayloadFieldIds`, `4 ForbiddenPayloadFieldIds` |

Record names are diagnostic metadata committed by the registry manifest; semantics are the permanent `(TypeId, SchemaVersion, FieldId)` tuples. No field uses a magic sentinel for optionality or union payload selection.

## Typed identifier namespaces

Unless otherwise stated, model/content identifiers use their governed canonical identifier payload. `SemanticReferentId` payload is the underlying governed authored-content or runtime-entity typed identifier, preserving its origin without exposing it to character code. Runtime-occurrence payloads are the nonnegative ordinal returned by the accepted allocator.

| Namespace | Identity family |
|---:|---|
| 1000 | `ObserverId` |
| 1001 | `EventTypeId` |
| 1002 | `SemanticReferentId` / `CandidateSemanticReferentId` |
| 1003 | `EventRoleId` |
| 1005 | `ObservationChannelId` |
| 1006 | `ModalityId` |
| 1007 | `WindowId` |
| 1008 | `FeatureScopeId` |
| 1009 | `TransitionKindId` |
| 1010 | `PerceptualFeatureId` |
| 1011 | `PerceptualFacetId` |
| 1012 | `PerceptualClassificationRuleId` |
| 1013 | `PerceptualEventFeatureId` |
| 1014 | `PerceptualEventFacetId` |
| 1015 | `PerceptualEventClassificationRuleId` |
| 1016 | `RecognitionTemplateId` |
| 1017 | `PerceivedIdentitySymbolId` |
| 1018 | `RecognitionRuleId` |
| 1019 | `CausalRoleId` |
| 1020 | `CausalRoleDerivationRuleId` |
| 1021 | `DomainValidatorId` |
| 1022 | `DerivationFunctionId` |
| 1023 | `RegistryKindId` |
| 1024 | `UnionVariantDefinitionId` |

Only rows in this table are allocated. Namespace `1004` is genuinely unallocated, is not a reservation or tombstone, remains available for a future accepted semantic identity, and contributes no entry to canonical registry-manifest bytes. The rejected candidate placement of `ObservationId` at `1004` is change history only.

| Namespace | Run-scoped typed occurrence |
|---:|---|
| 1100 | `EventBindingId` |
| 1101 | `FeatureObservationId` |
| 1102 | `EventFeatureObservationId` |
| 1103 | `PerceivedBindingId` |
| 1104 | `ClassificationEvidenceId` |
| 1105 | `EventClassificationEvidenceId` |
| 1106 | `ExperienceId` |
| 1107 | `ObserverSymbolCandidateMappingId` |
| 1108 | `RecognitionCueEvidenceId` |
| 1109 | `RecognitionEvaluationId` |
| 1110 | `RecognitionResolutionId` |
| 1111 | `CausalRoleEvidenceId` |
| 1112 | `DetectionOccurrenceId` |
| 1113 | `EventDetectionOccurrenceId` |
| 1114 | `WorldEventId` |
| 1115 | `ObservationId` |

`WorldEventId` identifies one immutable truth-side semantic event occurrence. It is categorically distinct from the scheduler's `EventId`, which identifies one scheduled transition. A committed trace may link the scheduler event that produced a world event to its `WorldEventId`, but `WorldEventTruth` never substitutes scheduler identity for semantic occurrence identity.

`ObservationId` is likewise a run-scoped observer-side evidence occurrence, not a model/content identifier. `PerceptualReferentId`, `PerceptualEventReferentId`, `CurrentDetectionId`, `CurrentEventDetectionId`, and `SupportingObservationId` use record types 212–216 because observer ownership is part of their canonical value. Detection occurrences use the shared allocator, but the enclosing detection record makes observer ownership explicit. Interleaving another observer's detections may change raw allocator ordinals and trace scheduling but may not alter this observer's tracking, evidence, or psychology; `SEM-001I.3` proves that noninterference. No unregistered per-observer detection counter is introduced.

`ObserverSymbolCandidateMappingId` identifies one immutable mapping occurrence. Changing either endpoint or mapping version creates a new mapping occurrence and replaces the applicable character-state entry; an existing occurrence is never remapped in place.

`SemanticReferentId` has a required nested typed-identifier payload. The inner namespace is the already-governed authored-content or runtime-entity identity namespace, so equal local payloads from those origins encode differently. Untyped payloads and inner namespaces that do not designate a governed referent origin fail closure. Neither the outer nor inner numeric values carry psychological magnitude.

## Permanent finite semantic values

Values are local to the named registry.

### Event roles (`EventRoleId`, namespace 1003)

`1 Action`, `2 Actor`, `3 Companion`, `4 Target`, `5 Recipient`, `6 Instrument`, `7 AffectedEntity`, `8 Beneficiary`, `9 Participant`, `10 Location`.

### Causal roles (`CausalRoleId`, namespace 1019)

Reuse the already-permanent Campaign 0 values: `1 Cause`, `2 Actor`, `3 Target`, `4 Recipient`, `5 Instrument`, `6 AffectedEntity`, `7 Participant`, `8 Location`, `9 Context`, `10 Incidental`. The Campaign 0 registry fixed these values but did not allocate a typed namespace for `CausalRoleId`; namespace `1019` is therefore its first allocation, not a conflicting replacement. `SEM-001` initially admits `1..8` and `10`; it does not renumber `Incidental` or admit generic `Context` merely because value 9 remains registered.

### Continuant perceptual features and facets

- feature: `1 ObservedPersonForm`, `2 ObservedDiscreteObjectForm`, `3 ObservedEnclosureForm`, `4 ObservedMetallicSurface`, `5 ObservedElongatedForm`, `6 ObservedBluntForm`;
- facet: `1 AppearsPersonLike`, `2 AppearsDiscreteObjectLike`, `3 AppearsInteriorSpaceLike`, `4 AppearsMetallic`, `5 AppearsElongated`, `6 AppearsBlunt`.

### Event perceptual features and facets

- feature: `1 ObservedRepeatedMotionPattern`, `2 ObservedCoupledMotionAcrossContinuants`, `3 ObservedRepeatedVerticalBodyMotion`, `4 ObservedCyclicFlexibleContinuantArc`, `5 ObservedBodyContinuantPassageCoordination`;
- facet: `1 AppearsRepetitiveMotionLike`, `2 AppearsCoupledMultiContinuantMotionLike`, `3 AppearsRopeSkippingPatternLike`.

### Rule IDs

- continuant classification rules: values `1..6` correspond one-to-one, in the facet order above, to the accepted exact-feature rules;
- event classification rules: `1 RepetitiveMotion`, `2 CoupledMultiContinuantMotion`, `3 RopeSkippingPattern`;
- recognition rule: `1 UniqueUncontradictedSupport`;
- causal-role derivation rule: `1 ExactObservedEventRoleToCausalRole`.

Rule numbers provide identity only. Rule execution resolves through the committed definition and `DerivationFunctionId`.

## Closed tag registries

| Registry | Values |
|---|---|
| event-role evidence | `1 ExactEventRole`, `2 UnresolvedEventRole` |
| continuant continuity | `1 NewTrack`, `2 ContinuesPriorTrack` |
| event continuity | `1 NewEventFile`, `2 ContinuesPriorEventFile` |
| maximum occurrences | `1 Finite`, `2 Unbounded` |
| classification result | `1 NoAssertion`, `2 Assert` |
| recognition candidate domain | `1 Person`, `2 DiscreteObject`, `3 PlaceOrRegion` |
| recognition cue source | `1 RetainedTemplateMatch`, `2 IdentityClaimMapping` |
| recognition experience reference | `1 ContinuantClassification`, `2 PerceivedBinding`, `3 SupportingObservation` |
| cue polarity | `1 SupportsCandidate`, `2 ContradictsCandidate` |
| recognition no-update reason | `1 NoQualifyingCandidate`, `2 AmbiguousCandidates`, `3 SameCandidateMaintained` |
| recognition evaluation result | `1 NoUpdate`, `2 AssertUniqueCandidate`, `3 WithdrawCurrentResolution` |
| recognition resolution | `1 AssertedCandidate`, `2 Withdrawn` |
| character evidence reference | `1 Observation`, `2 ContinuantFeature`, `3 EventFeature`, `4 PerceivedBinding`, `5 ContinuantClassification`, `6 EventClassification`, `7 RecognitionCue`, `8 RecognitionResolution`, `9 CausalRole` |
| evidence carrier | `1 Continuant`, `2 Event`, `3 ContinuantInEvent` |
| evidence temporal scope | `1 SameWindow`, `2 SameExperience`, `3 HistoricalOrCurrent` |
| observation lane | `1 Current`, `2 Consequence` |
| perceived value type | `1 Boolean` |
| recognition domain | `1 ContinuantInstance` |
| causal-role domain | `1 ContinuantInObserverEvent` |
| causal-role basis kind | `1 PerceivedBinding` |

Variant closure requires exactly the payload fields defined for the selected tag and absence of every other optional payload. Unknown tags fail; readers never preserve or ignore them.

### Canonical union variant matrix

Each row is a canonical type-259 `UnionVariantDefinition` registry entry. Its stable ID is `(RecordTypeId, VariantTag)` in namespace `1024`; the required and forbidden field-ID sets are authoritative and contribute to the registry manifest digest. Validation occurs before occurrence allocation or emission.

`RegistryKindId` namespace `1023` identifies the semantic class of a type-171 `SemanticRegistryEntry`; it is not a future placeholder. Its canonical payload is a governed UTF-8 text identifier. Version 0.1 allocates exactly `registry/union-variant-definition`, used in field 2 (`RegistryKind`) of every type-259 definition's enclosing type-171 entry. Registry closure selects the union-definition grammar by this value, and the value is committed into manifest identity; an absent, unknown, differently typed, or differently encoded registry kind cannot be interpreted as a union definition. `UnionVariantDefinitionId` namespace `1024`, by contrast, identifies the individual definition whose payload is the canonical list `[RecordTypeId, VariantTag]`. The kind and occurrence-of-definition identities are therefore not interchangeable.

| Record | Tag | Required payload fields | Forbidden payload fields |
|---|---:|---|---|
| `EventRoleEvidence` (223) | 1 | 2 | — |
|  | 2 | — | 2 |
| `RecognitionCueSource` (230) | 1 | 2 | 3, 4 |
|  | 2 | 3, 4 | 2 |
| `RecognitionExperienceEvidenceRef` (231) | 1 | 2 | 3, 4 |
|  | 2 | 3 | 2, 4 |
|  | 3 | 4 | 2, 3 |
| `RecognitionEvaluationResult` (233) | 1 | 2 | 3 |
|  | 2 | 3 | 2 |
|  | 3 | — | 2, 3 |
| `RecognitionResolution` (235) | 1 | 2 | — |
|  | 2 | — | 2 |
| `CharacterEvidenceRef` (237) | 1..9 | exactly the correspondingly numbered field 2..10 | every other field in 2..10 |
| `EvidenceCarrier` (238) | 1 | 2 | 3 |
|  | 2 | 3 | 2 |
|  | 3 | 2, 3 | — |
| `MaxOccurrences` (245) | 1 | 2 | — |
|  | 2 | — | 2 |

Every optional union payload field appears in exactly one required-or-forbidden disposition for every legal tag. Adding a tag or changing either set is a registry change, not an implementation interpretation.

## State root and field allocations

| Root state type | Value | Fields |
|---|---:|---|
| `PerceptualContinuantFileState` | 241 | `1 NextTrackSequenceByObserver`, `2 ActivePerceptualReferentIds` |
| `PerceptualEventFileState` | 242 | `1 NextEventSequenceByObserver`, `2 ActivePerceptualEventReferentIds` |
| `RecognitionKnowledgeState` | 243 | `1 CandidateCatalogEntries`, `2 IdentitySymbolMappings` |
| `RecognitionResolutionState` | 244 | `1 ResolutionRecords` |

These record type IDs are also their `RootStateTypeId` values in `StatePath`. Mutation-authority IDs remain separately governed semantic identifiers; `SEM-001I.3` must register exactly one owner per writable leaf.

## Canonical collection rules

The collection dispositions are exactly those accepted in `SEM-001I.1`. Canonical sets encode with `cenc/1` set tag, canonical maps with the map tag, and revision history through the canonical set of records plus validated revision links. A list is used only where semantic order is explicitly accepted. Registry declaration order, source-object order, allocation order, and timestamps never substitute for these rules.

## Acceptance controls

Executable `CV-SEM-091..095` prove:

1. all record type IDs are unique, outside test-only ranges, and occupy `210..259` strictly after the prior authoritative maximum;
2. every schema field ID is positive and unique, and required/optional flags exactly match this table;
3. typed-ID namespace IDs are unique; `WorldEventId` and `ObservationId` are occurrence identities; and equal ordinals in different namespaces encode differently;
4. every accepted finite vocabulary and union tag is present exactly once, the pre-existing causal-role values remain unchanged, and nested authored/runtime referent origins remain distinct;
5. every union tag has exactly one canonical payload contract, every optional payload field is accounted for, illegal combinations fail before allocation/emission, and reordering declarations leaves the complete schema-plus-union registry manifest identical while a matrix change changes its digest.

Acceptance freezes every allocation and tag/payload matrix above. Values are append-only and may be retired but never renumbered or reused. `SEM-001I.2` acceptance does not authorize semantic runtime codecs or state migration. Those belong to `SEM-001I.3` and `CV-SEM-096..100`.
