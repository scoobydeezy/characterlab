# EMB-001 numeric allocation proposal

**embodied-reserve-allocation/0.1-draft — NOT PERMANENT.** One-to-one realization of
[accepted bounded shape](../formal/EMBODIED_RESERVE_SHAPE_ACCEPTANCE.md). Numeric
review remains separate; no source codec, current registry or frozen artifact changes.

## Record and field assignments

All schemas version1. Field suffix ? means conditionally present under the exact
union matrix; it is not an unconstrained optional field. Canonical types remain those
in the machine table and accepted typed inventory.

| Type | Record | Fields |
|---|---|---|
| 453 | ReserveParameters | 1:UnitId; 2:Capacity; 3:ConsumptionRate |
| 454 | ReserveAnchor | 1:AmountAtAnchor; 2:AnchorInstant |
| 455 | ReserveState | 1:Anchors |
| 456 | ReserveBodyBinding | 1:CharacterId; 2:ReserveParameterDefinitionId |
| 457 | ReserveBodyRegistryDefinition | 1:Bindings |
| 458 | LevelChannelDefinition | 1:ObservationChannelId; 2:ObserverId; 3:UnitId; 4:ModalityId; 5:Capacity; 6:BinWidth; 7:Available; 8:Permitted |
| 459 | LevelSamplingOpportunity | 1:ObserverId; 2:ChannelDefinitionId |
| 460 | PressureDefinition | 1:ChannelDefinitionId; 2:Threshold |
| 461 | EmbodiedLevelObservation | 1:ObservationId; 2:ObserverId; 3:ObservationChannelId; 4:OccurredAt; 5:FiniteLevelInterval; 6:TransformationVersion |
| 462 | FiniteLevelInterval | 1:Lower; 2:Upper |
| 463 | UnavailableLevelSample | 1:ObservationId; 2:ObserverId; 3:ObservationChannelId; 4:OccurredAt; 5:TransformationVersion |
| 464 | EmbodiedPressureOutput | 1:PressureOccurrenceId; 2:CharacterId; 3:Sample; 4:PressureResult; 5:TransformationVersion |
| 465 | LevelSourceRegistration | 1:ProducingSeamId; 2:ProducingSeamVersion; 3:SourceDefinition; 4:SourceOrigin |
| 466 | LevelSourceDefinition | 1:InputRecordSchema; 2:ReadDomain; 3:RequiredProjections; 4:ChannelDefinitions; 5:BodyBindingDefinitionId; 6:OutputChoice; 7:WriteCapability |
| 467 | LevelInputOnlyOrigin | 1:EventTypeId; 2:Phase |
| 468 | LevelSampleOutputChoice | 1:PresentOutputSchema; 2:UnavailableOutputSchema |
| 469 | PresentPressureRegistration | 1:OwningSeamId; 2:SeamVersion; 3:Definition; 4:Ingress |
| 470 | UnavailablePressureRegistration | 1:OwningSeamId; 2:SeamVersion; 3:Definition; 4:Ingress |
| 471 | PresentPressureTransitionDefinition | 1:InputAdmission; 2:ReadDomain; 3:OutputDefinitions; 4:WriteCapability; 5:RequiredProjections; 6:PressureDefinitionId |
| 472 | UnavailablePressureTransitionDefinition | 1:InputAdmission; 2:ReadDomain; 3:OutputDefinitions; 4:WriteCapability; 5:RequiredProjections; 6:PressureDefinitionId |
| 473 | PresentLevelInputAdmission | 1:InputRecordSchema; 2:PresentWithFrozenSupport |
| 474 | UnavailableLevelInputAdmission | 1:InputRecordSchema; 2:UnavailableOpportunityResult |
| 475 | PresentWithFrozenSupport | 1:SamplingProducerDefinitionId; 2:SamplingSeamVersion; 3:SampleEventType; 4:SamplePhase; 5:SampleSchema; 6:SEMSeamVersion; 7:Lane; 8:FreezeEventType; 9:FreezePhase; 10:FrozenSchema; 11:SupportRule |
| 476 | UnavailableOpportunityResult | 1:SamplingProducerDefinitionId; 2:SamplingSeamVersion; 3:SampleEventType; 4:SamplePhase; 5:SampleSchema; 6:SettlementEventType; 7:SettlementPhase; 8:ResultRule |
| 477 | ReserveReplenishmentDefinition | 1:CharacterId; 2:ReserveParameterDefinitionId; 3:UnitId; 4:DeliveredAmount |
| 478 | ReserveReplenishmentInput | 1:ReplenishmentDefinitionId |
| 479 | ReserveReplenishmentResult | 1:Before; 2:PotentialEffect; 3:Applied; 4:Overflow; 5:After |
| 480 | ReserveReplenishmentRegistration | 1:OwningSeamId; 2:SeamVersion; 3:InputRecordSchema; 4:InputOrigin; 5:DefinitionIds; 6:BodyBindingDefinitionId; 7:ReadDomain; 8:WritableFamilies; 9:MutationAuthorityId; 10:OutputRecordSchema |
| 481 | PressureResult | 1:VariantTag; 2:Value? |
| 482 | LevelChainCarrier | 1:VariantTag; 2:Sample; 3:ReservedExperienceId? |
| 483 | LevelPressureIngressDefinition | 1:ConsumerEventTypeId; 2:ConsumerPhase |
| 484 | LevelBinQuantization | 1:InputLevel; 2:Capacity; 3:BinWidth; 4:BinIndex |

## Namespace and exact members

Propose1142 PressureOccurrenceId over the existing shared runtime ordinal allocator.
Record IDs453..484 append after452. Observation1115 and Experience1106 remain unchanged.
All text members use their existing namespace payload grammar;1024 pairs are canonical
lists of unsigned integers, not text. Instance members come from the accepted witness.

| Namespace | Exact payload |
|---|---|
| 1036 | "seam/embodied-reserve" |
| 1036 | "seam/embodied-level-observation" |
| 1036 | "seam/embodied-pressure" |
| 1036 | "seam/embodied-replenishment" |
| 1001 | "event/embodied-level-sample" |
| 1001 | "event/embodied-level-tracking-slot" |
| 1001 | "event/embodied-level-binding-slot" |
| 1001 | "event/embodied-level-classification-slot" |
| 1001 | "event/embodied-level-settlement" |
| 1001 | "event/embodied-pressure-present" |
| 1001 | "event/embodied-pressure-unavailable" |
| 1001 | "event/embodied-reserve-replenishment" |
| 1009 | "EmbodiedPresentPressureTransition" |
| 1009 | "EmbodiedUnavailablePressureTransition" |
| 1028 | "accessor/embodied-reserve-anchor" |
| 1025 | "authority/embodied-reserve" |
| 1006 | "modality/embodied-fuel-level" |
| 1039 | "unit/embodied-fuel-stock" |
| 1023 | "registry/embodied-reserve-parameters" |
| 1023 | "registry/embodied-reserve-bodies" |
| 1023 | "registry/embodied-level-channel" |
| 1023 | "registry/embodied-pressure-definition" |
| 1023 | "registry/embodied-level-source-registration" |
| 1023 | "registry/embodied-pressure-present-registration" |
| 1023 | "registry/embodied-pressure-unavailable-registration" |
| 1023 | "registry/embodied-replenishment-definition" |
| 1023 | "registry/embodied-replenishment-registration" |
| 1027 | "definition/embodied-reserve-parameters" |
| 1027 | "definition/embodied-reserve-bodies" |
| 1027 | "definition/embodied-level-channel" |
| 1027 | "definition/embodied-pressure" |
| 1027 | "definition/embodied-level-source" |
| 1027 | "definition/embodied-replenishment" |
| 1027 | "definition/embodied-delivery-30" |
| 1027 | "definition/embodied-delivery-5" |
| 1027 | "definition/embodied-delivery-60" |
| 1000 | "observer/embodied-subject" |
| 1005 | "channel/embodied-fuel-level" |
| 1038 | "character/embodied-subject" |
| 1024 | [481,1] |
| 1024 | [481,2] |
| 1024 | [482,1] |
| 1024 | [482,2] |

## Unions and finite fields

| Record | Tag | Variant | Required fields | Forbidden fields |
|---|---|---|---|---|
| 481 | 1 | Known | 1,2 | none |
| 481 | 2 | Unavailable | 1 | 2 |
| 482 | 1 | Present | 1,2,3 | none |
| 482 | 2 | Unavailable | 1,2 | 3 |

UnionVariantDefinition259 lists only payload fields, excluding discriminator1.
Present carrier requires the present sample schema; unavailable carrier requires the
unavailable sample and forbids ReservedExperienceId. No fake reservation is allocated.

| Record/field | Value | Meaning |
|---|---|---|
| 475/11 | 1 | ExactSingletonSameOpportunity |
| 476/8 | 1 | NoPresentEvidenceNoReservation |

## Role and implementation boundaries

40 direct record roles, 1 state-map key role and 2 compiler-owned set-member checks are enumerated in JSON.
Character roles retain existing qualification; definition namespace checks also require
exact target kind/version. State root455/field1 contains anchors454 keyed by qualified
CharacterId. No new logical family/leaf member is inferred from that physical root.

The machine table also binds the three output occurrence extractors and five reused
external schemas. Source events and trace-only results gain no extra occurrence family.
The two proposed failure strings are not new numeric enum values. All76 runtime gates
remain NOT PASSED; EMB-M..O remain deferred.

Separate numeric review must verify full field/member/union parity and collision
freedom before permanence. No renumbering, reuse, insertion by shifting, fixture promotion,
old unit-profile widening or model activation is authorized by this proposal.
