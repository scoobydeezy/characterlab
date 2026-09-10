# Current record and namespace glossary

Generated reading aid, 2026-09-10. This is not allocation authority. Record names and
field numbers come from the actual cognitive receiving codec, including inherited
schemas and both versions of successor records. Namespaces come from formal allocation
tables. Same namespace can have several admitted role names; that is not an alias
between different identity families or a new semantic permission. Phases are scheduling
positions, not record IDs. Highest numeric ID is not the count of allocated records.

The current receiving codec supports **298 record/schema pairs**, with **297 distinct record type IDs**.
Source: scripts/generate-current-record-glossary.mjs. Frozen tables remain authoritative.

## Records

| Type/schema | Semantic name | Fields |
|---|---|---|
| 100/1 | ContentIdentity | 1: ContentSchemaVersion; 2: ContentManifestDigest |
| 101/1 | ParameterIdentity | 1: ParameterSchemaVersion; 2: ParameterSetDigest |
| 102/1 | RegistryIdentity | 1: RegistrySchemaVersion; 2: RegistryManifestDigest |
| 103/1 | ModelIdentity | 1: RulesVersion; 2: ContentIdentity; 3: ParameterIdentity; 4: NumericProfileVersion; 5: RandomAlgorithmVersion; 6: RegistryIdentity |
| 104/1 | RunIdentity | 1: ModelIdentity; 2: InitialStateDigest; 3: OrderedInputSequenceDigest; 4: RunSeed |
| 105/1 | ExperimentIdentity | 1: CorpusVersion; 2: ComparisonSpecificationVersion; 3: HarnessVersion |
| 106/1 | ComparisonCase | 1: OrderedModelIdentities; 2: OrderedRunIdentities; 3: CouplingSpecification |
| 110/1 | RandomAddress | 1: CausalRootId; 2: PurposeId; 3: SubjectBindings; 4: DrawIndex |
| 111/1 | SubjectBinding | 1: SubjectRoleId; 2: SubjectId |
| 112/1 | NaturalRandomKey | 1: RandomAddress |
| 113/1 | CoupledRandomKey | 1: ComparisonDrawKey |
| 114/1 | RandomCandidateInput | 1: RandomAlgorithmVersion; 2: RunSeed; 3: EffectiveRandomKey; 4: InternalCandidateIndex |
| 115/1 | ComparisonDrawMapEntry | 1: LocalRandomAddress; 2: ComparisonDrawKey |
| 116/1 | ComparisonDrawMap | 1: Entries |
| 117/1 | ComparisonDrawKey | 1: KeyId; 2: ComparisonRoleId |
| 120/1 | LinearRateParameters | 1: ParameterIdentity; 2: Rate; 3: Scale; 4: ValueMinimum; 5: ValueMaximum |
| 121/1 | LinearAnalyticalAnchor | 1: ValueAtAnchor; 2: AnchorInstant; 3: GoverningParameterIdentity; 4: ExactBoundedRemainder |
| 130/1 | ScheduledEvent | 1: EventId; 2: DueAt; 3: Phase; 4: EventSequence; 5: EventTypeId; 6: Payload; 7: Dependencies; 8: CausalParentEventIds |
| 131/1 | AllocatorState | 1: NextRuntimeId; 2: NextEventId; 3: NextEventSequence |
| 132/1 | SchedulerSave | 1: SaveSchemaVersion; 2: ModelIdentity; 3: RunIdentity; 4: Clock; 5: AuthoritativeState; 6: AllocatorState; 7: PendingQueue; 8: AnalyticalAnchors; 9: RandomRelevantAuthoritativeIds; 10: ContinuingRunInputs; 11: CommittedTrace; 12: Outputs |
| 133/1 | OrderingParameters | 1: MaxSettlementWorkPerSimulationInstant |
| 134/1 | OrderingPhaseRegistry | 1: RegistryVersion; 2: Phases |
| 140/1 | StatePath | 1: RootStateTypeId; 2: FieldId; 3: Selectors |
| 141/1 | TypedEntitySelector | 1: TypedEntityId |
| 142/1 | CanonicalMapKeySelector | 1: CanonicalMapKey |
| 143/1 | StableListItemSelector | 1: StableListItemId |
| 144/1 | StatePatch | 1: Operations |
| 145/1 | SetPatchOperation | 1: Path; 2: ExpectedPresence; 3: ExpectedOldValue; 4: NewValue |
| 146/1 | RemovePatchOperation | 1: Path; 2: ExpectedOldValue |
| 147/1 | ActualReadRecord | 1: AccessorId; 2: Path; 3: Presence; 4: Value; 5: DerivedSources; 6: TransformationId |
| 148/1 | StructuralMutationDiff | 1: Path; 2: OldPresence; 3: OldValue; 4: NewPresence; 5: NewValue; 6: MutationAuthorityId |
| 149/1 | StatePathPattern | 1: RootStateTypeId; 2: FieldId; 3: SelectorPatterns |
| 150/1 | SelectorWildcard | 1: SelectorKind |
| 151/1 | StateLeaf | 1: Path; 2: Value |
| 152/1 | LeafValueGrammar | 1: VariantTag; 2: RecordTypeId |
| 153/1 | OwnedLeafDefinition | 1: Pattern; 2: ValueGrammar; 3: RemovalAllowed |
| 154/1 | MutationAuthorityDefinition | 1: MutationAuthorityId; 2: OwnedLeaves |
| 155/1 | MutationAuthorityRegistryDefinition | 1: DefinitionVersion; 2: Authorities |
| 160/1 | TraceRecord | 1: TraceSchemaVersion; 2: ModelIdentity; 3: RunIdentity; 4: Event; 5: SeamId; 6: SeamVersion; 7: RecordKind; 8: SubjectIds; 9: SourceRecordIds; 10: RegisteredReadDomain; 11: ActualReadRecords; 12: InputProjection; 13: OutputProjection; 14: RandomDrawRecords; 15: QuantizationOperations; 16: StatePatch; 17: StructuralMutationDiffs; 18: EmittedEvents; 19: InvariantResults |
| 162/1 | FailureDiagnostic | 1: FailureDiagnosticSchemaVersion; 2: RunIdentity; 3: FailureCode; 4: AttemptedInstantPresence; 5: AttemptedInstant; 6: CurrentEventIdPresence; 7: CurrentEventId; 8: CausalChain; 9: PreInstantStateBytes; 10: CandidateTransitionDataPresence; 11: CandidateTransitionData; 12: Message |
| 170/1 | GovernedContentDefinition | 1: StableId; 2: SemanticKind; 3: DeclaredInputs; 4: DeclaredOutputs; 5: Preconditions; 6: WorldEffects; 7: UnitsDomainsBounds; 8: EpistemicVisibility; 9: ObservationAffordances; 10: Lifecycle; 11: ReferencedRegistryIds; 12: ReferencedContentIds; 13: ValidationInvariants; 14: SourceProvenance; 15: ChangeHistory; 16: FormalSeamMappings |
| 171/1 | SemanticRegistryEntry | 1: StableId; 2: RegistryKind; 3: DefinitionVersion; 4: Definition |
| 172/1 | CanonicalRecordSchemaDescriptor | 1: TypeId; 2: SchemaVersion; 3: Name; 4: Fields |
| 173/1 | CanonicalRecordFieldDescriptor | 1: FieldId; 2: Name; 3: Required |
| 174/1 | CorpusManifestEntry | 1: PhenomenonId; 2: Version |
| 200/1 | BoundedEffectTruth | 1: Before; 2: PotentialEffect; 3: Applied; 4: Overflow; 5: After; 6: Minimum; 7: Maximum; 8: EffectProvenance; 9: TruthRecordId |
| 201/1 | ObservationChannel | 1: ObservationChannelId; 2: ObserverId; 3: SubjectId; 4: ModalityId; 5: UnitId; 6: PolarityId; 7: MeasurementModeId; 8: Precision; 9: VisibleProvenanceSlotIds; 10: MissingnessRuleId; 11: ExperimentalControlIdPresence; 12: ExperimentalControlId |
| 202/1 | MissingObservation | 1: ObservationId; 2: ObserverId; 3: SubjectId; 4: ObservationChannelId; 5: OccurredAt; 6: MissingnessRuleId |
| 203/1 | PresentObservation | 1: ObservationId; 2: ObserverId; 3: SubjectId; 4: ObservationChannelId; 5: OccurredAt; 6: MeasurementInterval; 7: EvidenceKindId; 8: Precision; 9: PerceivedConceptTokens; 10: SafeSourceReferences; 11: TransformationVersion |
| 204/1 | MeasurementInterval | 1: LowerPresence; 2: Lower; 3: UpperPresence; 4: Upper |
| 205/1 | PerceivedConceptToken | 1: ConceptId; 2: CausalRoleId; 3: VisibleProvenanceSlotId |
| 207/1 | EffectProvenanceTruth | 1: Slots |
| 208/1 | EffectProvenanceSlot | 1: SlotId; 2: ConceptIds |
| 209/1 | ThinSemanticExperience | 1: ExperienceId; 2: ObserverId; 3: OccurredAt; 4: PresentObservations; 5: TransformationVersion |
| 210/1 | WorldEventTruth | 1: WorldEventId; 2: EventTypeId; 3: OccurredAt; 4: EventBindings |
| 211/1 | EventBinding | 1: EventBindingId; 2: EventRoleId; 3: SemanticReferentId |
| 212/1 | PerceptualReferentId | 1: ObserverId; 2: ObserverTrackSequence |
| 213/1 | PerceptualEventReferentId | 1: ObserverId; 2: ObserverEventSequence |
| 214/1 | CurrentDetectionId | 1: ObserverId; 2: DetectionOccurrenceId |
| 215/1 | CurrentEventDetectionId | 1: ObserverId; 2: EventDetectionOccurrenceId |
| 216/1 | SupportingObservationId | 1: ObserverId; 2: ObservationId |
| 217/1 | PerceptualTrackTransition | 1: ObserverId; 2: PriorPerceptualReferentId; 3: PerceptualReferentId; 4: CurrentDetectionId; 5: ContinuityKind; 6: SupportingObservationIds; 7: OccurredAt; 8: TransformationVersion |
| 218/1 | PerceptualTrackEnd | 1: ObserverId; 2: PerceptualReferentId; 3: SupportingObservationIds; 4: OccurredAt; 5: TransformationVersion |
| 219/1 | PerceptualEventTransition | 1: ObserverId; 2: PriorPerceptualEventReferentId; 3: PerceptualEventReferentId; 4: CurrentEventDetectionId; 5: ContinuityKind; 6: SupportingObservationIds; 7: OccurredAt; 8: TransformationVersion |
| 220/1 | PerceptualEventEnd | 1: ObserverId; 2: PerceptualEventReferentId; 3: SupportingObservationIds; 4: OccurredAt; 5: TransformationVersion |
| 221/1 | PermittedPerceptualFeatureObservation | 1: FeatureObservationId; 2: ObserverId; 3: CurrentDetectionId; 4: PerceptualReferentId; 5: PerceptualFeatureId; 6: BooleanValue; 7: ObservationChannelId; 8: SupportingObservationIds; 9: OccurredAt; 10: TransformationVersion |
| 222/1 | PermittedPerceptualEventFeatureObservation | 1: EventFeatureObservationId; 2: ObserverId; 3: CurrentEventDetectionId; 4: PerceptualEventReferentId; 5: PerceptualEventFeatureId; 6: BooleanValue; 7: ObservationChannelId; 8: SupportingPerceptualReferentIds; 9: SupportingObservationIds; 10: OccurredAt; 11: TransformationVersion |
| 223/1 | EventRoleEvidence | 1: VariantTag; 2: EventRoleId |
| 224/1 | PerceivedBindingEvidence | 1: PerceivedBindingId; 2: ObserverId; 3: PerceptualEventReferentId; 4: PerceptualReferentId; 5: EventRoleEvidence; 6: SupportingObservationIds; 7: OccurredAt; 8: TransformationVersion |
| 225/1 | PerceptualClassificationEvidence | 1: ClassificationEvidenceId; 2: ExperienceId; 3: ObserverId; 4: PerceptualReferentId; 5: PerceptualFacetId; 6: TypedPerceivedValue; 7: ClassificationRuleId; 8: SupportingFeatureObservationIds; 9: SupportingObservationIds; 10: OccurredAt; 11: TransformationVersion |
| 226/1 | PerceptualEventClassificationEvidence | 1: EventClassificationEvidenceId; 2: ExperienceId; 3: ObserverId; 4: PerceptualEventReferentId; 5: PerceptualEventFacetId; 6: TypedPerceivedValue; 7: EventClassificationRuleId; 8: SupportingEventFeatureObservationIds; 9: SupportingPerceptualReferentIds; 10: SupportingObservationIds; 11: OccurredAt; 12: TransformationVersion |
| 227/1 | PreRecognitionSemanticExperience | 1: ExperienceId; 2: ObserverId; 3: OccurredAt; 4: PerceptualEventReferentIds; 5: PerceivedBindings; 6: PerceptualClassifications; 7: PerceptualEventClassifications; 8: SupportingObservationIds; 9: TransformationVersion |
| 228/1 | RecognitionCandidateCatalogEntry | 1: ObserverId; 2: CandidateSemanticReferentId; 3: CandidateDomain; 4: RecognitionTemplateIds; 5: CatalogEntryVersion |
| 229/1 | ObserverIdentitySymbolMapping | 1: ObserverSymbolCandidateMappingId; 2: ObserverId; 3: PerceivedIdentitySymbolId; 4: CandidateSemanticReferentId; 5: MappingVersion |
| 230/1 | RecognitionCueSource | 1: VariantTag; 2: RecognitionTemplateId; 3: PerceivedIdentitySymbolId; 4: ObserverSymbolCandidateMappingId |
| 231/1 | RecognitionExperienceEvidenceRef | 1: VariantTag; 2: ClassificationEvidenceId; 3: PerceivedBindingId; 4: SupportingObservationId |
| 232/1 | PermittedRecognitionCueEvidence | 1: RecognitionCueEvidenceId; 2: ExperienceId; 3: ObserverId; 4: PerceptualReferentId; 5: CandidateSemanticReferentId; 6: RecognitionCueSource; 7: CuePolarity; 8: SupportingExperienceEvidenceRefs; 9: OccurredAt; 10: TransformationVersion |
| 233/1 | RecognitionEvaluationResult | 1: VariantTag; 2: NoUpdateReason; 3: CandidateSemanticReferentId |
| 234/1 | RecognitionEvaluation | 1: RecognitionEvaluationId; 2: ExperienceId; 3: ObserverId; 4: PerceptualReferentId; 5: RecognitionRuleId; 6: EvaluatedRecognitionCueEvidenceIds; 7: PriorRecognitionResolutionId; 8: Result; 9: OccurredAt; 10: RecognitionVersion |
| 235/1 | RecognitionResolution | 1: VariantTag; 2: CandidateSemanticReferentId |
| 236/1 | RecognitionResolutionRecord | 1: RecognitionResolutionId; 2: ExperienceId; 3: ObserverId; 4: PerceptualReferentId; 5: Resolution; 6: RecognitionRuleId; 7: EvaluatedRecognitionCueEvidenceIds; 8: RevisesRecognitionResolutionId; 9: OccurredAt; 10: RecognitionVersion |
| 237/1 | CharacterEvidenceRef | 1: VariantTag; 2: ObservationId; 3: FeatureObservationId; 4: EventFeatureObservationId; 5: PerceivedBindingId; 6: ClassificationEvidenceId; 7: EventClassificationEvidenceId; 8: RecognitionCueEvidenceId; 9: RecognitionResolutionId; 10: CausalRoleEvidenceId |
| 238/1 | EvidenceCarrier | 1: VariantTag; 2: PerceptualReferentId; 3: PerceptualEventReferentId |
| 239/1 | EvidenceApplicabilityScope | 1: ExperienceId; 2: WindowId; 3: ModalityId; 4: FeatureScopeId; 5: EvidenceCarrier |
| 240/1 | CausalRoleEvidence | 1: CausalRoleEvidenceId; 2: ExperienceId; 3: ObserverId; 4: PerceptualEventReferentId; 5: PerceptualReferentId; 6: CausalRoleId; 7: CausalRoleDerivationRuleId; 8: SupportingEvidenceRefs; 9: OccurredAt; 10: TransformationVersion |
| 241/1 | PerceptualContinuantFileState | 1: NextTrackSequenceByObserver; 2: ActivePerceptualReferentIds |
| 242/1 | PerceptualEventFileState | 1: NextEventSequenceByObserver; 2: ActivePerceptualEventReferentIds |
| 243/1 | RecognitionKnowledgeState | 1: CandidateCatalogEntries; 2: IdentitySymbolMappings |
| 244/1 | RecognitionResolutionState | 1: ResolutionRecords |
| 245/1 | MaxOccurrences | 1: VariantTag; 2: FiniteValue |
| 246/1 | RoleCardinalityRule | 1: EventRoleId; 2: MinOccurrences; 3: MaxOccurrences; 4: ReferentDomainNarrowingValidatorId |
| 247/1 | EventRoleDefinition | 1: EventRoleId; 2: BroadReferentDomainValidatorId; 3: DefinitionVersion |
| 248/1 | EventTypeBindingSchema | 1: EventTypeId; 2: RoleCardinalityRules; 3: BindingSchemaVersion; 4: FixedActionReferentId |
| 249/1 | PerceptualFacetDefinition | 1: PerceptualFacetId; 2: PerceivedValueType; 3: ObservationDomainValidatorId; 4: DefinitionVersion |
| 250/1 | PerceptualClassificationRuleDefinition | 1: ClassificationRuleId; 2: PermittedInputFeatureIds; 3: OutputPerceptualFacetId; 4: DerivationFunctionId; 5: RuleVersion |
| 251/1 | PerceptualEventFacetDefinition | 1: PerceptualEventFacetId; 2: PerceivedValueType; 3: ObservationDomainValidatorId; 4: DefinitionVersion |
| 252/1 | PerceptualEventClassificationRuleDefinition | 1: EventClassificationRuleId; 2: PermittedInputEventFeatureIds; 3: OutputPerceptualEventFacetId; 4: DerivationFunctionId; 5: RuleVersion |
| 253/1 | RecognitionRuleDefinition | 1: RecognitionRuleId; 2: RecognitionDomain; 3: PermittedCueSourceKinds; 4: DerivationFunctionId; 5: RuleVersion |
| 254/1 | CanonicalRecordSchemaRef | 1: TypeId; 2: SchemaVersion |
| 255/1 | PermittedEvidenceSchema | 1: ReferenceKind; 2: RecordSchemaRef; 3: ProducingEpistemicSeamVersion |
| 256/1 | EvidenceReadDomain | 1: TransitionKindId; 2: PermittedEvidenceSchemas; 3: TemporalScope; 4: PermittedModalityIds; 5: PermittedFeatureScopeIds |
| 257/1 | EventRoleToCausalRoleRule | 1: EventRoleId; 2: CausalRoleId |
| 258/1 | CausalRoleDerivationRuleDefinition | 1: CausalRoleDerivationRuleId; 2: CausalRoleDomain; 3: PermittedBasisKinds; 4: Mappings; 5: DerivationFunctionId; 6: RuleVersion |
| 259/1 | UnionVariantDefinition | 1: RecordTypeId; 2: VariantTag; 3: RequiredPayloadFieldIds; 4: ForbiddenPayloadFieldIds |
| 260/1 | StateKeyGrammar | 1: VariantTag; 2: RecordTypeId |
| 261/1 | StateKeyGrammarDefinition | 1: Pattern; 2: KeyGrammar |
| 262/1 | ReadOnlyStateFamilyDefinition | 1: Pattern; 2: ValueGrammar |
| 263/1 | CanonicalIdentityRole | 1: RequiredNamespace; 2: DomainValidatorId |
| 264/1 | CanonicalRolePosition | 1: VariantTag; 2: RecordTypeId; 3: RootStateTypeId; 4: FieldId |
| 265/1 | CanonicalRoleConstraint | 1: Position; 2: Role |
| 266/1 | EventDependentProjectedFieldRequirement | 1: SelectorSourceFieldId; 2: TargetStatePathTemplate; 3: ProjectedFieldId; 4: OutputRole; 5: OutputAccessor |
| 267/1 | CharacterObserverBindingValue | 1: CharacterId |
| 268/1 | CharacterObserverBindingState | 1: Bindings |
| 269/1 | OutcomeEvaluation | 1: OutcomeEvaluationId; 2: ConsequenceExperience; 3: TransformationVersion |
| 270/1 | OutcomeLearningEvidence | 1: OutcomeLearningEvidenceId; 2: Evaluation; 3: TransformationVersion |
| 271/1 | TransitionDefinitionV04 | 1: InputAdmission; 2: ReadDomain; 3: OutputDefinitions; 4: WriteCapability |
| 272/1 | TransitionRegistrationV04 | 1: ExecutingSeamId; 2: ExecutingSeamVersion; 3: TransitionDefinition; 4: IngressDefinition |
| 273/1 | WriteCapabilityV04 | 1: VariantTag |
| 274/1 | TransitionInputAdmissionV04 | 1: InputRecordSchema; 2: Producer; 3: RequiredSourceRelation |
| 275/1 | TransitionInputProducerV04 | 1: VariantTag; 2: ProducingSeamId; 3: ProducingSeamVersion; 4: Lane; 5: ProducingTransitionKind |
| 276/1 | TransitionIngressDefinition | 1: ConsumerEventTypeId; 2: DueAtRule; 3: ConsumerPhase; 4: PayloadRule; 5: Multiplicity |
| 277/1 | TransitionOutputDefinition | 1: OutputRecordSchema; 2: Multiplicity |
| 278/1 | OccurrenceIdentityRule | 1: IdentityFieldId; 2: IdentityRole |
| 279/1 | TransitionAdmissionRegistry | 1: LearningRoutes; 2: TransitionRoutes; 3: OccurrenceIdentities |
| 280/1 | RegulatoryVariableDefinition | 1: Scale; 2: Minimum; 3: Maximum |
| 281/1 | RegulatoryCharacterReferenceKey | 1: CharacterId |
| 282/1 | RegulatoryReferenceDefinition | 1: CharacterReferences; 2: Parameters |
| 283/1 | RegulatoryVariableRegistration | 1: VariableDefinition; 2: ReferenceDefinition |
| 284/1 | Campaign2StateFamilyRegistry | 1: Families |
| 285/1 | Campaign2StateFamilyDefinition | 1: Route; 2: Storage |
| 286/1 | Campaign2Storage | 1: VariantTag; 2: RootStateTypeId; 3: LeafFields |
| 287/1 | LoadDomainDefinition | 1: Scale; 2: Capacity |
| 288/1 | LoadCapacity | 1: VariantTag; 2: Maximum |
| 289/1 | ProcedureDefinition | 1: CompetenceScale |
| 290/1 | AdaptationLeafFamilyDefinition | 1: DomainSource |
| 291/1 | AdaptationDomainSource | 1: VariantTag; 2: Scale |
| 292/1 | ToleranceKey | 1: CharacterId; 2: ExposureReferentId; 3: RegulatoryVariableId |
| 293/1 | SensitizationKey | 1: CharacterId; 2: ExposureReferentId; 3: RegulatoryVariableId |
| 294/1 | RegulatoryAdaptationKey | 1: CharacterId; 2: RegulatoryVariableId |
| 295/1 | AccumulatedLoadKey | 1: CharacterId; 2: LoadDomainId |
| 296/1 | ProceduralCompetenceKey | 1: CharacterId; 2: ProcedureId |
| 297/1 | ToleranceValue | 1: Magnitude |
| 298/1 | SensitizationValue | 1: Magnitude |
| 299/1 | RegulatoryAdaptationValue | 1: Magnitude |
| 300/1 | AccumulatedLoadValue | 1: Magnitude |
| 301/1 | ProceduralCompetenceValue | 1: Magnitude |
| 302/1 | RegulatoryAdaptationState | 1: Tolerance; 2: Sensitization; 3: Displacements; 4: Loads |
| 303/1 | ProceduralSkillState | 1: Competence |
| 304/1 | AuthoredActualAdaptationFact | 1: Fact |
| 305/1 | RegulatoryExposureFact | 1: CharacterId; 2: ExposureReferentId; 3: ActualContactCount |
| 306/1 | ProceduralPracticeFact | 1: CharacterId; 2: ProcedureId; 3: CompletedRepetitions |
| 307/1 | AutomaticAdaptationInput | 1: AutomaticAdaptationInputId; 2: Basis; 3: OccurredAt; 4: TransformationVersion |
| 308/1 | AuthoredAdaptationFactProducerDefinition | 1: EventTypeId; 2: PayloadSchema; 3: OutputSchema; 4: Phase |
| 309/1 | AuthoredFactConsequenceBridgeDefinition | 1: Channels |
| 310/1 | FixtureConsequenceObservationInput | 1: Truth; 2: Channel |
| 311/1 | AdaptationRuleDefinition | 1: Match; 2: TargetStateFamilyId; 3: TargetLeafFamilyId; 4: KeyDerivation; 5: Gate; 6: Step |
| 312/1 | AdaptationMatch | 1: VariantTag; 2: ExposureReferentId; 3: ProcedureId |
| 313/1 | AdaptationKeyDerivation | 1: VariantTag; 2: RegulatoryVariableId; 3: LoadDomainId |
| 314/1 | AdaptationGate | 1: VariantTag; 2: Source |
| 315/1 | AdaptationReadTarget | 1: StateFamilyId; 2: LeafFamilyId; 3: KeyDerivation |
| 316/1 | RuleResolutionContract | 1: Rules |
| 317/1 | AdaptationTransitionRegistrationExtension | 1: AcceptedBasis; 2: RuleResolutionContract; 3: OutputProduction |
| 318/1 | TransitionRegistrationV06 | 1: ExecutingSeamId; 2: ExecutingSeamVersion; 3: TransitionDefinitionV06; 4: IngressDefinition; 5: AdaptationExtension |
| 319/1 | TransitionDefinitionV06 | 1: InputAdmission; 2: ReadDomain; 3: OutputDefinitions; 4: WriteCapability |
| 320/1 | TransitionInputAdmissionV06 | 1: InputRecordSchema; 2: Producer; 3: RequiredSourceRelation |
| 321/1 | TransitionInputProducerV06 | 1: VariantTag; 2: ProducingSeamId; 3: ProducingSeamVersion; 4: Lane; 5: ProducingTransitionKind; 6: ProducerDefinition |
| 322/1 | WriteCapabilityV06 | 1: VariantTag; 2: MutationAuthority; 3: WritableFamilies |
| 323/1 | AdaptationOutputProductionDefinition | 1: DispatchSchema; 2: EvaluationSchema; 3: Rule |
| 324/1 | AdaptationDispatchRecord | 1: DispatchId; 2: Input; 3: ApplicableRules; 4: TransformationVersion |
| 325/1 | AdaptationEvaluationResult | 1: EvaluationId; 2: DispatchId; 3: RuleId; 4: TargetPath; 5: Prior; 6: Result; 7: TransformationVersion |
| 326/1 | AdaptationPrior | 1: VariantTag; 2: Value |
| 327/1 | AdaptationResult | 1: VariantTag; 2: Patch |
| 328/1 | AdaptationSettlementDefinition | 1: Consumers; 2: PhasePolicy |
| 329/1 | GovernedContentKindDefinition | 1: ContentSchema |
| 330/1 | SemanticKindRoleValidatorDefinition | 1: RequiredSemanticKind |
| 331/1 | RegulatoryProbeDefinition | 1: CharacterId; 2: RegulatoryVariableId; 3: Channel; 4: Available; 5: ObserverPermitted |
| 332/1 | DiagnosticProbeChannel | 1: ObservationChannelId; 2: ObserverId; 3: SubjectId; 4: ModalityId; 5: UnitId |
| 333/1 | RegulatoryProbeOpportunity | 1: ProbeDefinitionId |
| 334/1 | RegulatoryProbeTruth | 1: RegulatoryProbeTruthId; 2: ProbeDefinitionId; 3: OccurredAt; 4: EffectiveValue |
| 335/1 | RegulatoryProbeCarrier | 1: VariantTag; 2: Truth; 3: ProbeDefinitionId; 4: Support |
| 336/1 | MeasurementEvidenceIntakeDefinition | 1: ObserverId; 2: ObservationChannelId; 3: UnitId |
| 337/1 | CognitiveMeasurementEvidence | 1: CognitiveMeasurementEvidenceId; 2: Observation; 3: UnitId; 4: TransformationVersion |
| 338/1 | AuthenticatedObserverMeasurementProducer | 1: ProducingSeamId; 2: ProducingSeamVersion; 3: ProducerEventTypeId; 4: ProducerPhase; 5: OutputRecordSchema |
| 339/1 | TransitionInputAdmissionV07 | 1: InputRecordSchema; 2: Producer; 3: RequiredSourceRelation |
| 340/1 | TransitionDefinitionV07 | 1: InputAdmission; 2: ReadDomain; 3: OutputDefinitions; 4: WriteCapability |
| 341/1 | TransitionRegistrationV07 | 1: ExecutingSeamId; 2: ExecutingSeamVersion; 3: TransitionDefinition; 4: IngressDefinition |
| 342/1 | MeasurementEpisodeLearningEvidence | 1: MeasurementEpisodeLearningEvidenceId; 2: Source337; 3: TransformationVersion |
| 343/1 | EventDependentProjectedFieldPathRequirement | 1: SelectorSourceFieldPath; 2: TargetStatePathTemplate; 3: ProjectedFieldId; 4: OutputRole; 5: OutputAccessor |
| 344/1 | MeasurementEpisodeKey | 1: CharacterId; 2: CognitiveMeasurementEvidenceId |
| 345/1 | MeasurementEpisode | 1: LearningEvidence |
| 346/1 | MeasurementEpisodeState | 1: Episodes |
| 347/1 | MemoryFormationRegistration | 1: ExecutingSeamId; 2: ExecutingSeamVersion; 3: TransitionDefinition; 4: IngressDefinition |
| 348/1 | MemoryFormationDefinition | 1: InputAdmission; 2: ReadDomain; 3: OutputDefinitions; 4: WriteCapability |
| 349/1 | MeasurementEpisodeReadRequirement | 1: SubjectAccessor; 2: EvidenceSourceFieldId; 3: TargetStatePathTemplate; 4: OutputAccessor |
| 350/1 | MeasurementRecallOpportunityDefinition | 1: ProducingTransitionKind; 2: RecallEventTypeId; 3: RecallDelay |
| 351/1 | MeasurementRecallCue | 1: ObserverId; 2: CognitiveMeasurementEvidenceId |
| 352/1 | MeasurementRecollection | 1: MeasurementRecollectionId; 2: Episode; 3: TransformationVersion |
| 353/1 | RecallRegistration | 1: ExecutingSeamId; 2: ExecutingSeamVersion; 3: InputAdmission; 4: ReadDomain; 5: OutputDefinitions; 6: WriteCapability |
| 354/1 | DelayedRecallEventAdmission | 1: InputRecordSchema; 2: OpportunityDefinitionId |
| 355/1 | RecollectionOutputDefinition | 1: OutputRecordSchema |
| 356/1 | MemoryV04TransitionSeamContract | 1: Registration; 2: FieldRequirements; 3: FieldPathRequirements; 4: EpisodeReadRequirements |
| 357/1 | MemoryFormationTransitionSeamContract | 1: Registration; 2: FieldPathRequirements |
| 358/1 | MemoryRecallTransitionSeamContract | 1: Registration; 2: FieldRequirements; 3: EpisodeReadRequirements |
| 359/1 | MeasurementPredictionDefinition | 1: SourceChannelId; 2: ObservedSubjectId; 3: UnitId; 4: MaxEvidenceCount |
| 360/1 | MeasurementPredictionKey | 1: CharacterId; 2: PredictionDefinitionId |
| 361/1 | MeasurementPrediction | 1: ExpectedReading; 2: EvidenceBasis |
| 362/1 | MeasurementPredictionState | 1: Predictions |
| 363/1 | MeasurementPredictionTargetRequirement | 1: SubjectAccessor; 2: PredictionDefinitionId; 3: TargetStatePathTemplate; 4: OutputAccessor |
| 364/1 | MeasurementPredictionApplicationRegistration | 1: ExecutingSeamId; 2: ExecutingSeamVersion; 3: PredictionDefinitionId; 4: InputAdmission; 5: ReadDomain; 6: OutputDefinitions; 7: WriteCapability; 8: IngressDefinition; 9: SubjectRequirements; 10: TargetRequirements |
| 365/1 | MeasurementPredictionReadCue | 1: ObserverId; 2: PredictionDefinitionId |
| 366/1 | MeasurementPredictionReadout | 1: MeasurementPredictionReadoutId; 2: Key; 3: Prediction |
| 367/2 | MeasurementPredictionReadOutputDefinition | 1: OutputRecordSchema; 2: OutputOccurrenceRule |
| 368/2 | MeasurementPredictionReadRegistration | 1: ExecutingSeamId; 2: ExecutingSeamVersion; 3: PredictionDefinitionId; 4: InputRecordSchema; 5: OpportunityDefinitionId; 6: ReadDomain; 7: OutputDefinitions; 8: WriteCapability; 9: SubjectRequirements; 10: TargetRequirements |
| 369/1 | MeasurementPredictionOpportunityDefinition | 1: ProducingTransitionKind; 2: ApplicationEventTypeId; 3: ReadEventTypeId; 4: PredictionDefinitionId; 5: ReadDelay |
| 370/1 | TaskCommitmentSpec | 1: HolderContentId; 2: PredictionDefinitionId; 3: DesiredMinimum; 4: DesiredMaximum; 5: ActiveFrom; 6: Deadline |
| 371/1 | TaskCommitmentKey | 1: CharacterId; 2: TaskReferent |
| 372/1 | TaskCommitmentStatus | 1: VariantTag; 2: ObservationRef; 3: ObservedAt |
| 373/1 | TaskCommitmentState | 1: Commitments |
| 373/2 | TaskCommitmentState | 1: Commitments; 2: AdoptedInstructions |
| 374/1 | TaskMeasurementTargetRequirement | 1: SubjectAccessor; 2: TaskSpecIds; 3: TargetStatePathTemplate; 4: OutputAccessor |
| 375/1 | TaskMeasurementRegistration | 1: ExecutingSeamId; 2: ExecutingSeamVersion; 3: InputAdmission; 4: ReadDomain; 5: OutputDefinitions; 6: WriteCapability; 7: IngressDefinition; 8: SubjectRequirements; 9: TargetRequirements |
| 376/1 | TaskDeadlineRegistration | 1: ExecutingSeamId; 2: ExecutingSeamVersion; 3: InputRecordSchema; 4: ConsumerEventTypeId; 5: ReadDomain; 6: OutputDefinitions; 7: WriteCapability; 8: TargetStatePathTemplate; 9: OutputAccessor |
| 377/1 | DeliberationOpportunity | 1: ObserverId; 2: AgendaDefinitionId |
| 378/1 | TaskWorkspaceDefinition | 1: PredictionDefinitionId; 2: Capacity; 3: TaskAccessEnabled; 4: ForecastAccessEnabled |
| 379/1 | WorkspaceTaskItem | 1: TaskCommitmentKey; 2: TaskSpecRef |
| 380/1 | WorkspaceForecast | 1: VariantTag; 2: PredictionValue |
| 381/1 | TaskWorkspace | 1: WorkspaceOccurrenceId; 2: CharacterId; 3: AgendaDefinitionId; 4: Tasks; 5: Forecast |
| 382/1 | TaskAssessment | 1: VariantTag; 2: Distance |
| 383/1 | TaskAppraisalItem | 1: TaskCommitmentKey; 2: Assessment |
| 384/1 | TaskAppraisal | 1: AppraisalOccurrenceId; 2: Workspace; 3: Assessments |
| 385/1 | TaskConcernDefinition | 1: Gain; 2: Enabled |
| 386/1 | TaskConcernResponse | 1: VariantTag; 2: Intensity |
| 387/1 | TaskConcernItem | 1: TaskCommitmentKey; 2: Response |
| 388/1 | TaskConcern | 1: ConcernOccurrenceId; 2: Appraisal; 3: Responses |
| 389/1 | PlanInstructionDefinition | 1: ProtocolActionDefinitionId |
| 390/1 | AdoptedTaskInstruction | 1: PlanInstructionDefinitionId |
| 391/1 | ProtocolActionDefinition | 1: RequestedContactCount |
| 392/1 | TaskMotiveDefinition | 1: BasePressure; 2: Enabled |
| 393/1 | TaskMotiveItem | 1: TaskCommitmentKey; 2: RawPressure |
| 394/1 | TaskMotiveContext | 1: MotiveContextOccurrenceId; 2: Concern; 3: Motives |
| 395/1 | ProceduralCandidateKey | 1: CharacterId; 2: ProtocolActionDefinitionId |
| 396/1 | ProceduralCandidateOrigin | 1: TaskCommitmentKey; 2: PlanInstructionDefinitionId |
| 397/1 | ProceduralCandidate | 1: Key; 2: Origins |
| 398/1 | TaskCandidateOptions | 1: CandidateOptionsOccurrenceId; 2: MotiveContext; 3: Candidates |
| 399/1 | ReasonEvidenceAtom | 1: VariantTag; 2: ObservationReference; 3: QualificationOccurrenceId |
| 400/1 | ReasonEvidenceBasis | 1: Weights |
| 401/1 | TaskRawSignalKey | 1: CandidateKey; 2: TaskCommitmentKey; 3: SourceRole |
| 402/1 | TaskRawSignal | 1: Key; 2: SignedStrength; 3: EvidenceBasis |
| 403/1 | TaskRawSignalContext | 1: OccurrenceId; 2: CandidateOptions; 3: Signals; 4: NonIdentitySemanticPressure |
| 404/1 | ReasonNucleusKey | 1: CandidateKey; 2: MotiveChannel; 3: TaskReferent; 4: Direction |
| 405/1 | CoverageResult | 1: SourceKey; 2: RawMagnitude; 3: OverlapWithPrior; 4: IndependentFraction; 5: EffectiveMagnitude |
| 406/1 | ReasonRoleSummary | 1: BaseNet; 2: StandingNet; 3: SituationalNet; 4: CoverageResults |
| 407/1 | CompiledReasonNucleus | 1: Key; 2: RoleSummary; 3: Relevance; 4: BaseDie; 5: StandingModifier; 6: SituationalModifier; 7: Distribution |
| 408/1 | TaskReasonContext | 1: OccurrenceId; 2: RawSignalContext; 3: ActiveNuclei |
| 409/1 | DecisionResolution | 1: OccurrenceId; 2: OccurredAt; 3: ReasonContext; 4: Result |
| 410/1 | CognitiveRandomCandidateAttempt | 1: InternalCandidateIndex; 2: Candidate; 3: Rejected |
| 411/1 | CognitiveRandomDraw | 1: LocalAddress; 2: EffectiveKey; 3: Result; 4: Span; 5: Limit; 6: Fallback; 7: Attempts |
| 412/1 | TaskIdentityKey | 1: CharacterId; 2: IdentityChannelId |
| 413/1 | TaskIdentityContribution | 1: QualificationOccurrenceId; 2: DecisionResolutionOccurrenceId; 3: OccurredAt; 4: SignedContribution |
| 414/1 | TaskIdentityEvidence | 1: Contributions |
| 415/1 | TaskIdentityState | 1: Evidence |
| 416/1 | TaskWorkspaceTaskRequirement | 1: SubjectAccessor; 2: TaskSpecIds; 3: TargetStatePathTemplate; 4: OutputAccessor |
| 417/1 | TaskWorkspaceSourceRegistration | 1: ExecutingSeamId; 2: ExecutingSeamVersion; 3: InputRecordSchema; 4: ConsumerEventTypeId; 5: AgendaDefinitionId; 6: ReadDomain; 7: OutputDefinitions; 8: WriteCapability; 9: SubjectRequirements; 10: TaskRequirements; 11: PredictionRequirements |
| 418/1 | TaskConcernRegistration | 1: BaseRegistration; 2: ConcernDefinitionId |
| 419/1 | DecisionResult | 1: VariantTag; 2: ChosenData |
| 420/1 | ChosenDecisionData | 1: CandidateKey; 2: Probabilities; 3: Margin; 4: Contest; 5: ConflictMass; 6: Stake; 7: AuthorshipPotential; 8: ResolutionMode; 9: ReasonDraws; 10: TieBreak |
| 421/1 | OptionProbability | 1: CandidateKey; 2: Probability |
| 422/1 | ReasonDraw | 1: NucleusKey; 2: BaseDie; 3: StandingModifier; 4: SituationalModifier; 5: Draw; 6: Face; 7: SignedContribution |
| 423/1 | DecisionTieBreak | 1: VariantTag; 2: Leaders; 3: Draw; 4: SelectedKey |
| 424/1 | ExactScoreDistribution | 1: Masses |
| 425/1 | ChosenIntent | 1: OccurrenceId; 2: DecisionResolution |
| 426/1 | DecisionExpression | 1: OccurrenceId; 2: ChosenIntent; 3: ChannelExpressions; 4: QualificationContext |
| 427/1 | ChannelExpression | 1: IdentityChannelId; 2: Alignment |
| 428/1 | FixtureQualificationContext | 1: ScopeVersion; 2: CostRepresentation; 3: FearRepresentation; 4: ChoiceInterventionRepresentation |
| 429/1 | DecisionQualification | 1: OccurrenceId; 2: DecisionExpression; 3: Result |
| 430/1 | QualificationResult | 1: VariantTag; 2: Weight; 3: SignedContribution; 4: RejectionReason |
| 431/1 | ActionPlan | 1: OccurrenceId; 2: ChosenIntent; 3: RequestedContactCount |
| 432/1 | ActionAttempt | 1: OccurrenceId; 2: ActionPlan |
| 433/1 | ExecutionOutcome | 1: OccurrenceId; 2: ActionAttempt; 3: CompletedContactCount |
| 434/1 | ExecutionDefinition | 1: Permitted |
| 435/1 | TaskCandidateDefinition | 1: PlanAccessEnabled |
| 436/1 | TaskReasonSourceDefinition | 1: StandingAccessEnabled; 2: IdentityK |
| 437/1 | ReasonDiceDefinition | 1: BaseDieThresholds; 2: ActivationThreshold; 3: StandingModifier; 4: SituationalModifier |
| 438/1 | BaseDieThresholds | 1: D4; 2: D6; 3: D8; 4: D10; 5: D12 |
| 439/1 | ModifierDefinition | 1: Unit; 2: MaximumMagnitude |
| 440/1 | TaskArbitrationDefinition | 1: ThetaRoll; 2: ThetaPlayer |
| 441/1 | TaskMotiveRegistration | 1: BaseRegistration; 2: MotiveDefinitionId |
| 442/1 | TaskCandidateRegistration | 1: BaseRegistration; 2: CandidateDefinitionId; 3: PlanRequirement |
| 443/1 | TaskRawSignalRegistration | 1: BaseRegistration; 2: ReasonSourceDefinitionId; 3: IdentityRequirement |
| 444/1 | TaskReasonCompilationRegistration | 1: BaseRegistration; 2: ReasonDiceDefinitionId |
| 445/1 | TaskArbitrationRegistration | 1: BaseRegistration; 2: ArbitrationDefinitionId; 3: ChosenIntentIngress |
| 446/1 | ProtocolExecutionRegistration | 1: BaseRegistration; 2: ExecutionDefinitionId |
| 447/1 | TaskPlanBindingRequirement | 1: SubjectFieldPath; 2: TaskListFieldPath; 3: TargetStatePathTemplate; 4: OutputAccessor |
| 448/1 | TaskIdentityReadRequirement | 1: SubjectFieldPath; 2: IdentityChannelId; 3: TargetStatePathTemplate; 4: OutputAccessor |
| 449/1 | ChosenIntentIngressDefinition | 1: ConsumerEventTypeId; 2: ConsumerPhase; 3: PayloadSchema; 4: BranchRule |
| 450/1 | TaskIdentityApplicationRegistration | 1: ExecutingSeamId; 2: ExecutingSeamVersion; 3: InputAdmission; 4: ReadDomain; 5: OutputDefinitions; 6: WriteCapability; 7: Ingress; 8: IdentityRequirement |
| 451/1 | ProtocolObservationBridgeDefinition | 1: ProducingTransitionKind; 2: ProducerOutputSchema; 3: Channel; 4: Permitted; 5: StageEventTypes; 6: ObservationInputSchema; 7: PublishedOutputSchemas |
| 452/1 | IdentityQuantizationOperation | 1: SourceQualificationOccurrenceId; 2: CounterKind; 3: Input; 4: Scale; 5: RoundedInteger; 6: Output |

## Identifier namespaces

| Namespace | Family / admitted role names |
|---|---|
| 1000 | ObserverId |
| 1001 | EventTypeId |
| 1002 | CandidateSemanticReferentId / CharacterId / SemanticReferentId / TaskReferentId |
| 1003 | EventRoleId |
| 1004 | SemanticKindId |
| 1005 | ObservationChannelId |
| 1006 | ModalityId |
| 1007 | WindowId |
| 1008 | FeatureScopeId |
| 1009 | TransitionKindId |
| 1010 | PerceptualFeatureId |
| 1011 | PerceptualFacetId |
| 1012 | PerceptualClassificationRuleId |
| 1013 | PerceptualEventFeatureId |
| 1014 | PerceptualEventFacetId |
| 1015 | PerceptualEventClassificationRuleId |
| 1016 | RecognitionTemplateId |
| 1017 | PerceivedIdentitySymbolId |
| 1018 | RecognitionRuleId |
| 1019 | CausalRoleId |
| 1020 | CausalRoleDerivationRuleId |
| 1021 | DomainValidatorId |
| 1022 | DerivationFunctionId |
| 1023 | RegistryKindId |
| 1024 | UnionVariantDefinitionId |
| 1026 | LearningRouteId |
| 1027 | DefinitionId / RegistryDefinitionId |
| 1028 | ProjectionAccessorId |
| 1029 | RegulatoryVariableId |
| 1030 | RegulatoryReferenceParameterId |
| 1031 | Campaign2StateFamilyId |
| 1032 | LeafFamilyId |
| 1033 | LoadDomainId |
| 1034 | ProcedureId |
| 1035 | AdaptationRuleId |
| 1036 | SeamId |
| 1037 | AuthoredContentOriginId |
| 1038 | GovernedContentDefinitionId |
| 1039 | ObservationUnitId |
| 1040 | MotiveChannelId |
| 1041 | IdentityChannelId |
| 1042 | RandomPurposeId |
| 1043 | RandomSubjectRoleId |
| 1100 | EventBindingId |
| 1101 | FeatureObservationId |
| 1102 | EventFeatureObservationId |
| 1103 | PerceivedBindingId |
| 1104 | ClassificationEvidenceId |
| 1105 | EventClassificationEvidenceId |
| 1106 | ExperienceId |
| 1107 | ObserverSymbolCandidateMappingId |
| 1108 | RecognitionCueEvidenceId |
| 1109 | RecognitionEvaluationId |
| 1110 | RecognitionResolutionId |
| 1111 | CausalRoleEvidenceId |
| 1112 | DetectionOccurrenceId |
| 1113 | EventDetectionOccurrenceId |
| 1114 | WorldEventId |
| 1115 | ObservationId |
| 1116 | OutcomeEvaluationId |
| 1117 | OutcomeLearningEvidenceId |
| 1118 | AutomaticAdaptationInputId |
| 1119 | AdaptationDispatchId |
| 1120 | AdaptationEvaluationId |
| 1121 | FixtureConsequenceTruthId |
| 1122 | RuntimeEntityOriginId |
| 1123 | RegulatoryProbeTruthId |
| 1124 | CognitiveMeasurementEvidenceId |
| 1125 | MeasurementEpisodeLearningEvidenceId |
| 1126 | MeasurementRecollectionId |
| 1127 | MeasurementPredictionReadoutId |
| 1128 | WorkspaceOccurrenceId |
| 1129 | AppraisalOccurrenceId |
| 1130 | ConcernOccurrenceId |
| 1131 | MotiveContextOccurrenceId |
| 1132 | CandidateOptionsOccurrenceId |
| 1133 | RawSignalContextOccurrenceId |
| 1134 | ReasonContextOccurrenceId |
| 1135 | DecisionResolutionOccurrenceId |
| 1136 | ChosenIntentOccurrenceId |
| 1137 | DecisionExpressionOccurrenceId |
| 1138 | QualificationOccurrenceId |
| 1139 | ActionPlanOccurrenceId |
| 1140 | ActionAttemptOccurrenceId |
| 1141 | ExecutionOutcomeOccurrenceId |

## Reading recent receipts

Use semantic names first: AutomaticAdaptationInput (307), not “actual307”;
TaskCommitmentState (373) with its exact schema version; TaskIdentityContribution
and TaskIdentityEvidence with their actual names from the table above.
“Phase140” means the common consolidation settlement stage. The 27/26 control
means27 executed events versus a deliberately insufficient26-event work limit.

All names above are descriptive views; no record, namespace, version or digest was
renamed by generating this file.
