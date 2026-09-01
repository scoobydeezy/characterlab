# Canonical Record Type Registry

**Status:** accepted Campaign 0 registry, version identifier `cenc-records/0.1-candidate`; governed by accepted `substrate/0.2-candidate`

**Purpose:** assign permanent numeric record and field IDs so an implementation cannot invent identity encodings locally.

All records use `cenc/1`. Type IDs, schema versions, and field IDs are unsigned integers. Every field below is required. Retired type or field IDs are never reused.

## Identity records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 100 | `ContentIdentity` | 1 | `1: ContentSchemaVersion`, `2: ContentManifestDigest` |
| 101 | `ParameterIdentity` | 1 | `1: ParameterSchemaVersion`, `2: ParameterSetDigest` |
| 102 | `RegistryIdentity` | 1 | `1: RegistrySchemaVersion`, `2: RegistryManifestDigest` |
| 103 | `ModelIdentity` | 1 | `1: RulesVersion`, `2: ContentIdentity`, `3: ParameterIdentity`, `4: NumericProfileVersion`, `5: RandomAlgorithmVersion`, `6: RegistryIdentity` |
| 104 | `RunIdentity` | 1 | `1: ModelIdentity`, `2: InitialStateDigest`, `3: OrderedInputSequenceDigest`, `4: RunSeed` |
| 105 | `ExperimentIdentity` | 1 | `1: CorpusVersion`, `2: ComparisonSpecificationVersion`, `3: HarnessVersion` |
| 106 | `ComparisonCase` | 1 | `1: OrderedModelIdentities`, `2: OrderedRunIdentities`, `3: CouplingSpecification` |

Version fields are NFC text values. Digest fields and `RunSeed` are byte strings of exactly 32 bytes. Ordered identity fields are `cenc/1` lists and preserve semantic order. `CouplingSpecification` is the complete canonical coupling structure defined for the comparison; it is not a friendly name or digest-only substitute.

## Addressed-randomness records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 110 | `RandomAddress` | 1 | `1: CausalRootId`, `2: PurposeId`, `3: SubjectBindings`, `4: DrawIndex` |
| 111 | `SubjectBinding` | 1 | `1: SubjectRoleId`, `2: SubjectId` |
| 112 | `NaturalRandomKey` | 1 | `1: RandomAddress` |
| 113 | `CoupledRandomKey` | 1 | `1: ComparisonDrawKey` |
| 114 | `RandomCandidateInput` | 1 | `1: RandomAlgorithmVersion`, `2: RunSeed`, `3: EffectiveRandomKey`, `4: InternalCandidateIndex` |
| 115 | `ComparisonDrawMapEntry` | 1 | `1: LocalRandomAddress`, `2: ComparisonDrawKey` |
| 116 | `ComparisonDrawMap` | 1 | `1: Entries` |
| 117 | `ComparisonDrawKey` | 1 | `1: KeyId`, `2: ComparisonRoleId` |

Subject bindings are sorted by the complete canonical bytes of `(SubjectRoleId, SubjectId)`. Comparison-map entries are sorted by complete canonical `LocalRandomAddress` bytes. `ComparisonRoleId` is part of the comparison key and must equal the role registered for the receiving `PurposeId`; this makes incompatible coupling a structural validation error.

## Time and persistence records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 120 | `LinearRateParameters` | 1 | `1: ParameterIdentity`, `2: Rate`, `3: Scale`, `4: ValueMinimum`, `5: ValueMaximum` |
| 121 | `LinearAnalyticalAnchor` | 1 | `1: ValueAtAnchor`, `2: AnchorInstant`, `3: GoverningParameterIdentity`, `4: ExactBoundedRemainder` |
| 130 | `ScheduledEvent` | 1 | `1: EventId`, `2: DueAt`, `3: Phase`, `4: EventSequence`, `5: EventTypeId`, `6: Payload`, `7: Dependencies`, `8: CausalParentEventIds` |
| 131 | `AllocatorState` | 1 | `1: NextRuntimeId`, `2: NextEventId`, `3: NextEventSequence` |
| 132 | `SchedulerSave` | 1 | `1: SaveSchemaVersion`, `2: ModelIdentity`, `3: RunIdentity`, `4: Clock`, `5: AuthoritativeState`, `6: AllocatorState`, `7: PendingQueue`, `8: AnalyticalAnchors`, `9: RandomRelevantAuthoritativeIds`, `10: ContinuingRunInputs`, `11: CommittedTrace`, `12: Outputs` |
| 133 | `OrderingParameters` | 1 | `1: MaxSettlementWorkPerSimulationInstant` |
| 134 | `OrderingPhaseRegistry` | 1 | `1: RegistryVersion`, `2: Phases` |

Pending events encode in canonical execution order. Saves contain complete structural model/run identities and structures, never digest-only substitutes. Event handlers are deliberately absent from the save and must resolve through the receiving model's registered `EventTypeId` handlers during load.

## State-contract records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 140 | `StatePath` | 1 | `1: RootStateTypeId`, `2: FieldId`, `3: Selectors` |
| 141 | `TypedEntitySelector` | 1 | `1: TypedEntityId` |
| 142 | `CanonicalMapKeySelector` | 1 | `1: CanonicalMapKey` |
| 143 | `StableListItemSelector` | 1 | `1: StableListItemId` |
| 144 | `StatePatch` | 1 | `1: Operations` |
| 145 | `SetPatchOperation` | 1 | `1: Path`, `2: ExpectedPresence`, `3: ExpectedOldValue`, `4: NewValue` |
| 146 | `RemovePatchOperation` | 1 | `1: Path`, `2: ExpectedOldValue` |
| 147 | `ActualReadRecord` | 1 | `1: AccessorId`, `2: Path`, `3: Presence`, `4: Value`, `5: DerivedSources`, `6: TransformationId` |
| 148 | `StructuralMutationDiff` | 1 | `1: Path`, `2: OldPresence`, `3: OldValue`, `4: NewPresence`, `5: NewValue`, `6: MutationAuthorityId` |
| 149 | `StatePathPattern` | 1 | `1: RootStateTypeId`, `2: FieldId`, `3: SelectorPatterns` |
| 150 | `SelectorWildcard` | 1 | `1: SelectorKind` |
| 151 | `StateLeaf` | 1 | `1: Path`, `2: Value` |

Presence booleans determine whether the corresponding value field is semantically populated; the required `false` sentinel in an absent value field is structural padding, not a state value. Patch operations and state leaves sort by complete canonical path bytes. Duplicate and ancestor/descendant patch paths are invalid. Selector order is path order and therefore is not sorted.

## Trace and diagnostic records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 160 | `TraceRecord` | 1 | `1: TraceSchemaVersion`, `2: ModelIdentity`, `3: RunIdentity`, `4: Event`, `5: SeamId`, `6: SeamVersion`, `7: RecordKind`, `8: SubjectIds`, `9: SourceRecordIds`, `10: RegisteredReadDomain`, `11: ActualReadRecords`, `12: InputProjection`, `13: OutputProjection`, `14: RandomDrawRecords`, `15: QuantizationOperations`, `16: StatePatch`, `17: StructuralMutationDiffs`, `18: EmittedEvents`, `19: InvariantResults` |
| 162 | `FailureDiagnostic` | 1 | `1: FailureDiagnosticSchemaVersion`, `2: RunIdentity`, `3: FailureCode`, `4: AttemptedInstantPresence`, `5: AttemptedInstant`, `6: CurrentEventIdPresence`, `7: CurrentEventId`, `8: CausalChain`, `9: PreInstantStateBytes`, `10: CandidateTransitionDataPresence`, `11: CandidateTransitionData`, `12: Message` |

`TraceRecord.Event` and every emitted event reuse record type 130; trace does not define a second event representation. Subject IDs, source-record IDs, and registered read-domain patterns are canonical duplicate-free sets encoded as sorted lists. Actual reads, random draws, quantization operations, diffs, emitted events, and invariant results preserve semantic execution order. A failure diagnostic is never inserted into committed trace.

## Evolution rule

The tuples `(TypeId, SchemaVersion, FieldId)` above are permanent. A reader must reject an unknown type/version rather than infer its meaning. Adding a field or changing any field's semantics requires a new schema version and an explicit migration; removing a type or field retires its numeric ID permanently. A presentation-only view is not a new authoritative record version.

## Initial content and registry records

| Type ID | Record | Schema version | Fields `(ID: meaning)` |
|---:|---|---:|---|
| 170 | `GovernedContentDefinition` | 1 | `1: StableId`, `2: SemanticKind`, `3: DeclaredInputs`, `4: DeclaredOutputs`, `5: Preconditions`, `6: WorldEffects`, `7: UnitsDomainsBounds`, `8: EpistemicVisibility`, `9: ObservationAffordances`, `10: Lifecycle`, `11: ReferencedRegistryIds`, `12: ReferencedContentIds`, `13: ValidationInvariants`, `14: SourceProvenance`, `15: ChangeHistory`, `16: FormalSeamMappings` |
| 171 | `SemanticRegistryEntry` | 1 | `1: StableId`, `2: RegistryKind`, `3: DefinitionVersion`, `4: Definition` |
| 172 | `CanonicalRecordSchemaDescriptor` | 1 | `1: TypeId`, `2: SchemaVersion`, `3: Name`, `4: Fields` |
| 173 | `CanonicalRecordFieldDescriptor` | 1 | `1: FieldId`, `2: Name`, `3: Required` |
| 174 | `CorpusManifestEntry` | 1 | `1: PhenomenonId`, `2: Version` |

The authored form of type 170 additionally permits presentation-only field ID 100, `PresentationLabel`; it is removed before canonical commitment and is not part of the authoritative record schema. Registry manifests contain the complete canonical schema descriptors plus semantic registry entries. Stable IDs and `(TypeId, SchemaVersion)` pairs are duplicate-free. References must resolve before commitment, and content-reference cycles are invalid in this initial substrate schema.

## Registration gate

A new authoritative record type must be added here before implementation. Its entry must state a unique type ID, schema version, every permanent field ID, required/optional status, field semantic types, and the migration/evolution rule. Test-only record schemas may use IDs `10000` through `19999`; they are fixture-local and cannot enter authoritative artifacts.
