# Campaign 2 permanent numeric allocation

**Status: ACCEPTED AND FROZEN.**
Version: `campaign2-allocation/0.2-candidate`, accepted 2026-09-06.
The revision-2 review conditionally accepted permanent freeze on mechanical gates A/B. Both
passed: complete Markdown/JSON parity and the exact accepted observation SeamId declaration.
Allocation architecture is CLOSED. Canonical construction of the already shape-accepted surfaces
may proceed subject to remaining implementation gates, including applicable VAL-001 closure.
This allocation does not close ADAPT-001 or pass any runtime proof gate.

The machine-readable companion is [CAMPAIGN2_ALLOCATION_TABLE.json](CAMPAIGN2_ALLOCATION_TABLE.json).
This document and its companion are the permanent Campaign-2 registry addendum. No renumbering,
reuse or insertion by shifting is permitted; future additions append. No Campaign-1 entry is renumbered.

## Authority and boundary

Consume [accepted ADAPT packaging](../planning/ADAPT_001_PACKAGING_DRAFT.md),
[PRJ/WRT](../planning/SUBSTRATE_ADDENDA_DRAFT.md), [IDN](../planning/IDN_001_DRAFT_RESOLUTION.md),
[EVID](../planning/EVID_001_DRAFT_RESOLUTION.md), and [REG](../planning/REG_001_DRAFT_RESOLUTION.md).
Semantic versions remain ADAPT 0.31-candidate, admission extension 0.6-candidate, settlement
0.2-candidate, EVID 0.5-candidate/shared 0.4-candidate, REG 0.5-candidate, IDN 0.5-candidate,
PRJ 0.3-candidate-addendum and WRT 0.3-candidate-addendum. Numbers carry no behavioral meaning.

Inspected [canonical record registry](CANONICAL_RECORD_REGISTRY.md),
[SEM numeric registry](EVENT_SEMANTIC_NUMERIC_REGISTRY.md) and the accepted namespace-1025 addition
in [STATE_MODEL](STATE_MODEL.md). Records append after 259; model namespaces after 1025;
occurrence namespaces after 1115. The previously available 1004 is now assigned to SemanticKindId;
1036 appends SeamId without shifting 1026..1035. The historical SEM allocation remains unchanged. Test ranges are
not promoted. Existing schemas 120/121, 130/131/132, 140..155, 160/162, 170..174, 200..209 and
210..259 remain unchanged. In particular no global accessor constraint is added to type 147.

## Typed identity allocation

All new text-family payloads are nonempty NFC canonical UTF-8 text, exact byte equality, no aliases,
case folding, display-name matching or ordinal interpretation. Runtime payloads are the unsigned
ordinal from the accepted shared allocator. Model/run scoping and semantic ownership remain those
of the accepted contracts; an ID is not a new global provenance record.

| Namespace | Identity family | Owner | Payload |
|---:|---|---|---|
| 1026 | LearningRouteId | EVID/shared | text |
| 1027 | RegistryDefinitionId | EVID/shared | text |
| 1028 | ProjectionAccessorId | PRJ/shared | text |
| 1029 | RegulatoryVariableId | REG | text |
| 1030 | RegulatoryReferenceParameterId | REG | text |
| 1031 | Campaign2StateFamilyId | ADAPT | text |
| 1032 | LeafFamilyId | ADAPT | text |
| 1033 | LoadDomainId | ADAPT | text |
| 1034 | ProcedureId | ADAPT | text |
| 1035 | AdaptationRuleId | ADAPT | text |
| 1116 | OutcomeEvaluationId | EVID | unsigned-runtime-ordinal |
| 1117 | OutcomeLearningEvidenceId | EVID | unsigned-runtime-ordinal |
| 1118 | AutomaticAdaptationInputId | ADAPT | unsigned-runtime-ordinal |
| 1119 | AdaptationDispatchId | ADAPT | unsigned-runtime-ordinal |
| 1120 | AdaptationEvaluationId | ADAPT | unsigned-runtime-ordinal |
| 1121 | FixtureConsequenceTruthId | ADAPT fixture | unsigned-runtime-ordinal |
| 1004 | SemanticKindId | CONTENT/shared | text |
| 1036 | SeamId | trace/transition substrate | text |

ProjectionAccessorId is shared PRJ-owned, not ADAPT-owned. No ProjectionRequirementId, accessor
registry, character/exposure namespace, regulatory provider/root, binding occurrence, function/key
derivation ID, source-certificate ID or per-rule accessor identity is allocated.

## Required member payloads

The payload below is the exact canonical text, not a numeric enum. Existing namespaces whose
members are governed text retain that representation. The two finite model families admit exactly
their listed ten/five members. REG/load/procedure/rule model-authored keys use the text grammar
above; their definitions, not a fixed fixture list, enumerate a particular model's members.

| Namespace | Symbol and exact NFC text payload | Owning use |
|---:|---|---|
| 1026 | `route/character-learning` | shared |
| 1026 | `route/automatic-adaptation` | shared |
| 1027 | `definition/transition-admission` | shared |
| 1027 | `definition/campaign2-state-families` | shared |
| 1027 | `definition/authored-adaptation-facts` | shared |
| 1027 | `definition/authored-fact-consequence-bridge` | shared |
| 1027 | `definition/adaptation-settlement` | shared |
| 1028 | `ResolvedCharacterSubject` | PRJ |
| 1028 | `accessor/adaptation-target-prior` | PRJ |
| 1028 | `accessor/adaptation-gate-prior` | PRJ |
| 1031 | `belief-expectation` | ADAPT |
| 1031 | `episodic-memory` | ADAPT |
| 1031 | `associations` | ADAPT |
| 1031 | `values` | ADAPT |
| 1031 | `procedural-skill` | ADAPT |
| 1031 | `habits` | ADAPT |
| 1031 | `person-model` | ADAPT |
| 1031 | `relationships` | ADAPT |
| 1031 | `regulatory-adaptation` | ADAPT |
| 1031 | `identity-disposition` | ADAPT |
| 1032 | `leaf/tolerance` | ADAPT |
| 1032 | `leaf/sensitization` | ADAPT |
| 1032 | `leaf/regulatory-displacement` | ADAPT |
| 1032 | `leaf/accumulated-load` | ADAPT |
| 1032 | `leaf/procedural-competence` | ADAPT |
| 1023 | `registry/transition-registration` | governance consumers |
| 1023 | `registry/transition-admission` | governance consumers |
| 1023 | `registry/regulatory-variable` | governance consumers |
| 1023 | `registry/campaign2-state-family` | governance consumers |
| 1023 | `registry/adaptation-leaf-family` | governance consumers |
| 1023 | `registry/load-domain` | governance consumers |
| 1023 | `registry/procedure` | governance consumers |
| 1023 | `registry/adaptation-rule` | governance consumers |
| 1023 | `registry/authored-adaptation-facts` | governance consumers |
| 1023 | `registry/authored-fact-consequence-bridge` | governance consumers |
| 1023 | `registry/adaptation-settlement` | governance consumers |
| 1025 | `authority/regulatory-adaptation` | ADAPT |
| 1025 | `authority/procedural-skill` | ADAPT |
| 1021 | `validator/character-qualification` | IDN |
| 1009 | `OutcomeEvaluationTransition` | EVID/ADAPT |
| 1009 | `OutcomeLearningEvidenceTransition` | EVID/ADAPT |
| 1009 | `transition/regulatory-adaptation` | EVID/ADAPT |
| 1009 | `transition/procedural-adaptation` | EVID/ADAPT |
| 1001 | `event/outcome-evaluation` | EVID/ADAPT |
| 1001 | `event/outcome-learning-evidence` | EVID/ADAPT |
| 1001 | `event/authored-adaptation-fact` | EVID/ADAPT |
| 1001 | `event/regulatory-adaptation` | EVID/ADAPT |
| 1001 | `event/procedural-adaptation` | EVID/ADAPT |
| 1001 | `event/fixture-consequence-observation` | EVID/ADAPT |
| 1001 | `event/fixture-consequence-tracking` | EVID/ADAPT |
| 1001 | `event/fixture-consequence-binding` | EVID/ADAPT |
| 1001 | `event/fixture-consequence-classification` | EVID/ADAPT |
| 1001 | `event/fixture-consequence-freeze` | EVID/ADAPT |
| 1004 | `semantic-kind/character` | CONTENT/IDN |
| 1036 | `seam/event-truth-to-pre-recognition-experience` | SEM |
| 1036 | `seam/character-learning-evidence` | EVID |
| 1036 | `seam/automatic-adaptation` | ADAPT |
| 1036 | `seam/truth-to-permitted-evidence` | observation |

## Record and field allocations

Every allocated schema version is 1. `?` means optional at the codec level and subject to the
exact union layout below, not optionally ignored by the interpreter. `u` is canonical unsigned,
`i` canonical signed, `text` canonical NFC text. Maps use `map<Key;Value>` notation; sets/maps
use cenc/1 canonical ordering and uniqueness. Signed count/time/domain restrictions remain the
accepted semantic validators, not implicit integer-width choices.

V04 suffixes distinguish accepted base schemas from the separately allocated V06 schemas.
They are allocation-table names for EVID's accepted TransitionDefinition/TransitionRegistration;
they introduce no fields. Named storage/match/gate/capability/producer/prior/result records below
encode the already accepted sums with VariantTag and optional branch fields. These are union
representation records, not new domain outputs or new identities. Do not emit them independently.

| Type | Owner | Record | Permanent fields (ID: name: type) |
|---:|---|---|---|
| 260 | PRJ | StateKeyGrammar | 1: VariantTag: u; 2: RecordTypeId?: u |
| 261 | PRJ | StateKeyGrammarDefinition | 1: Pattern: StatePathPattern; 2: KeyGrammar: StateKeyGrammar |
| 262 | PRJ | ReadOnlyStateFamilyDefinition | 1: Pattern: StatePathPattern; 2: ValueGrammar: LeafValueGrammar |
| 263 | PRJ | CanonicalIdentityRole | 1: RequiredNamespace: u; 2: DomainValidatorId?: DomainValidatorId |
| 264 | PRJ | CanonicalRolePosition | 1: VariantTag: u; 2: RecordTypeId?: u; 3: RootStateTypeId?: u; 4: FieldId: u |
| 265 | PRJ | CanonicalRoleConstraint | 1: Position: CanonicalRolePosition; 2: Role: CanonicalIdentityRole |
| 266 | PRJ | EventDependentProjectedFieldRequirement | 1: SelectorSourceFieldId: u; 2: TargetStatePathTemplate: StatePathPattern; 3: ProjectedFieldId: u; 4: OutputRole: CanonicalIdentityRole; 5: OutputAccessor: ProjectionAccessorId |
| 267 | IDN | CharacterObserverBindingValue | 1: CharacterId: CharacterId |
| 268 | IDN | CharacterObserverBindingState | 1: Bindings: map<ObserverId;CharacterObserverBindingValue> |
| 269 | EVID | OutcomeEvaluation | 1: OutcomeEvaluationId: OutcomeEvaluationId; 2: ConsequenceExperience: PreRecognitionSemanticExperience; 3: TransformationVersion: text |
| 270 | EVID | OutcomeLearningEvidence | 1: OutcomeLearningEvidenceId: OutcomeLearningEvidenceId; 2: Evaluation: OutcomeEvaluation; 3: TransformationVersion: text |
| 271 | EVID | TransitionDefinitionV04 | 1: InputAdmission: TransitionInputAdmissionV04; 2: ReadDomain: set<StatePathPattern>; 3: OutputDefinitions: set<TransitionOutputDefinition>; 4: WriteCapability: WriteCapabilityV04 |
| 272 | EVID | TransitionRegistrationV04 | 1: ExecutingSeamId: SeamId; 2: ExecutingSeamVersion: text; 3: TransitionDefinition: TransitionDefinitionV04; 4: IngressDefinition: TransitionIngressDefinition |
| 273 | EVID | WriteCapabilityV04 | 1: VariantTag: u |
| 274 | EVID | TransitionInputAdmissionV04 | 1: InputRecordSchema: CanonicalRecordSchemaRef; 2: Producer: TransitionInputProducerV04; 3: RequiredSourceRelation: u |
| 275 | EVID | TransitionInputProducerV04 | 1: VariantTag: u; 2: ProducingSeamId?: SeamId; 3: ProducingSeamVersion?: text; 4: Lane?: u; 5: ProducingTransitionKind?: TransitionKindId |
| 276 | EVID | TransitionIngressDefinition | 1: ConsumerEventTypeId: EventTypeId; 2: DueAtRule: u; 3: ConsumerPhase: u; 4: PayloadRule: u; 5: Multiplicity: u |
| 277 | EVID | TransitionOutputDefinition | 1: OutputRecordSchema: CanonicalRecordSchemaRef; 2: Multiplicity: u |
| 278 | EVID | OccurrenceIdentityRule | 1: IdentityFieldId: u; 2: IdentityRole: CanonicalIdentityRole |
| 279 | EVID | TransitionAdmissionRegistry | 1: LearningRoutes: set<LearningRouteId>; 2: TransitionRoutes: map<TransitionKindId;LearningRouteId>; 3: OccurrenceIdentities: map<CanonicalRecordSchemaRef;OccurrenceIdentityRule> |
| 280 | REG | RegulatoryVariableDefinition | 1: Scale: u; 2: Minimum: i; 3: Maximum: i |
| 281 | REG | RegulatoryCharacterReferenceKey | 1: CharacterId: CharacterId |
| 282 | REG | RegulatoryReferenceDefinition | 1: CharacterReferences: map<RegulatoryCharacterReferenceKey;LinearAnalyticalAnchor>; 2: Parameters: map<RegulatoryReferenceParameterId;LinearRateParameters> |
| 283 | REG | RegulatoryVariableRegistration | 1: VariableDefinition: RegulatoryVariableDefinition; 2: ReferenceDefinition: RegulatoryReferenceDefinition |
| 284 | ADAPT | Campaign2StateFamilyRegistry | 1: Families: map<Campaign2StateFamilyId;Campaign2StateFamilyDefinition> |
| 285 | ADAPT | Campaign2StateFamilyDefinition | 1: Route: LearningRouteId; 2: Storage: Campaign2Storage |
| 286 | ADAPT | Campaign2Storage | 1: VariantTag: u; 2: RootStateTypeId?: u; 3: LeafFields?: map<LeafFamilyId;u> |
| 287 | ADAPT | LoadDomainDefinition | 1: Scale: u; 2: Capacity: LoadCapacity |
| 288 | ADAPT | LoadCapacity | 1: VariantTag: u; 2: Maximum?: u |
| 289 | ADAPT | ProcedureDefinition | 1: CompetenceScale: u |
| 290 | ADAPT | AdaptationLeafFamilyDefinition | 1: DomainSource: AdaptationDomainSource |
| 291 | ADAPT | AdaptationDomainSource | 1: VariantTag: u; 2: Scale?: u |
| 292 | ADAPT | ToleranceKey | 1: CharacterId: CharacterId; 2: ExposureReferentId: ExposureReferentId; 3: RegulatoryVariableId: RegulatoryVariableId |
| 293 | ADAPT | SensitizationKey | 1: CharacterId: CharacterId; 2: ExposureReferentId: ExposureReferentId; 3: RegulatoryVariableId: RegulatoryVariableId |
| 294 | ADAPT | RegulatoryAdaptationKey | 1: CharacterId: CharacterId; 2: RegulatoryVariableId: RegulatoryVariableId |
| 295 | ADAPT | AccumulatedLoadKey | 1: CharacterId: CharacterId; 2: LoadDomainId: LoadDomainId |
| 296 | ADAPT | ProceduralCompetenceKey | 1: CharacterId: CharacterId; 2: ProcedureId: ProcedureId |
| 297 | ADAPT | ToleranceValue | 1: Magnitude: u |
| 298 | ADAPT | SensitizationValue | 1: Magnitude: u |
| 299 | ADAPT | RegulatoryAdaptationValue | 1: Magnitude: i |
| 300 | ADAPT | AccumulatedLoadValue | 1: Magnitude: u |
| 301 | ADAPT | ProceduralCompetenceValue | 1: Magnitude: u |
| 302 | ADAPT | RegulatoryAdaptationState | 1: Tolerance: map<ToleranceKey;ToleranceValue>; 2: Sensitization: map<SensitizationKey;SensitizationValue>; 3: Displacements: map<RegulatoryAdaptationKey;RegulatoryAdaptationValue>; 4: Loads: map<AccumulatedLoadKey;AccumulatedLoadValue> |
| 303 | ADAPT | ProceduralSkillState | 1: Competence: map<ProceduralCompetenceKey;ProceduralCompetenceValue> |
| 304 | ADAPT | AuthoredActualAdaptationFact | 1: Fact: FactUnion |
| 305 | ADAPT | RegulatoryExposureFact | 1: CharacterId: CharacterId; 2: ExposureReferentId: ExposureReferentId; 3: ActualContactCount: u |
| 306 | ADAPT | ProceduralPracticeFact | 1: CharacterId: CharacterId; 2: ProcedureId: ProcedureId; 3: CompletedRepetitions: u |
| 307 | ADAPT | AutomaticAdaptationInput | 1: AutomaticAdaptationInputId: AutomaticAdaptationInputId; 2: Basis: FactUnion; 3: OccurredAt: i; 4: TransformationVersion: text |
| 308 | ADAPT | AuthoredAdaptationFactProducerDefinition | 1: EventTypeId: EventTypeId; 2: PayloadSchema: CanonicalRecordSchemaRef; 3: OutputSchema: CanonicalRecordSchemaRef; 4: Phase: u |
| 309 | ADAPT | AuthoredFactConsequenceBridgeDefinition | 1: Channels: map<ObservationChannelId;ObservationChannel> |
| 310 | ADAPT | FixtureConsequenceObservationInput | 1: Truth: BoundedEffectTruth; 2: Channel: ObservationChannel |
| 311 | ADAPT | AdaptationRuleDefinition | 1: Match: AdaptationMatch; 2: TargetStateFamilyId: Campaign2StateFamilyId; 3: TargetLeafFamilyId: LeafFamilyId; 4: KeyDerivation: AdaptationKeyDerivation; 5: Gate: AdaptationGate; 6: Step: i |
| 312 | ADAPT | AdaptationMatch | 1: VariantTag: u; 2: ExposureReferentId?: ExposureReferentId; 3: ProcedureId?: ProcedureId |
| 313 | ADAPT | AdaptationKeyDerivation | 1: VariantTag: u; 2: RegulatoryVariableId?: RegulatoryVariableId; 3: LoadDomainId?: LoadDomainId |
| 314 | ADAPT | AdaptationGate | 1: VariantTag: u; 2: Source?: AdaptationReadTarget |
| 315 | ADAPT | AdaptationReadTarget | 1: StateFamilyId: Campaign2StateFamilyId; 2: LeafFamilyId: LeafFamilyId; 3: KeyDerivation: AdaptationKeyDerivation |
| 316 | ADAPT | RuleResolutionContract | 1: Rules: set<AdaptationRuleId> |
| 317 | ADAPT | AdaptationTransitionRegistrationExtension | 1: AcceptedBasis: u; 2: RuleResolutionContract: RuleResolutionContract; 3: OutputProduction: AdaptationOutputProductionDefinition |
| 318 | ADAPT | TransitionRegistrationV06 | 1: ExecutingSeamId: SeamId; 2: ExecutingSeamVersion: text; 3: TransitionDefinitionV06: TransitionDefinitionV06; 4: IngressDefinition: TransitionIngressDefinition; 5: AdaptationExtension: AdaptationTransitionRegistrationExtension |
| 319 | ADAPT | TransitionDefinitionV06 | 1: InputAdmission: TransitionInputAdmissionV06; 2: ReadDomain: set<StatePathPattern>; 3: OutputDefinitions: set<TransitionOutputDefinition>; 4: WriteCapability: WriteCapabilityV06 |
| 320 | ADAPT | TransitionInputAdmissionV06 | 1: InputRecordSchema: CanonicalRecordSchemaRef; 2: Producer: TransitionInputProducerV06; 3: RequiredSourceRelation: u |
| 321 | ADAPT | TransitionInputProducerV06 | 1: VariantTag: u; 2: ProducingSeamId?: SeamId; 3: ProducingSeamVersion?: text; 4: Lane?: u; 5: ProducingTransitionKind?: TransitionKindId; 6: ProducerDefinition?: RegistryDefinitionId |
| 322 | ADAPT | WriteCapabilityV06 | 1: VariantTag: u; 2: MutationAuthority?: MutationAuthorityId; 3: WritableFamilies?: set<Campaign2StateFamilyId> |
| 323 | ADAPT | AdaptationOutputProductionDefinition | 1: DispatchSchema: CanonicalRecordSchemaRef; 2: EvaluationSchema: CanonicalRecordSchemaRef; 3: Rule: u |
| 324 | ADAPT | AdaptationDispatchRecord | 1: DispatchId: AdaptationDispatchId; 2: Input: AutomaticAdaptationInput; 3: ApplicableRules: set<AdaptationRuleId>; 4: TransformationVersion: text |
| 325 | ADAPT | AdaptationEvaluationResult | 1: EvaluationId: AdaptationEvaluationId; 2: DispatchId: AdaptationDispatchId; 3: RuleId: AdaptationRuleId; 4: TargetPath: StatePath; 5: Prior: AdaptationPrior; 6: Result: AdaptationResult; 7: TransformationVersion: text |
| 326 | ADAPT | AdaptationPrior | 1: VariantTag: u; 2: Value?: AdaptationLeafValue |
| 327 | ADAPT | AdaptationResult | 1: VariantTag: u; 2: Patch?: StatePatch |
| 328 | ADAPT | AdaptationSettlementDefinition | 1: Consumers: set<TransitionKindId>; 2: PhasePolicy: u |

Direct record unions allocate no extra discriminator record: FactUnion is exactly
RegulatoryExposureFact (305) or ProceduralPracticeFact (306);
AdaptationLeafValue is exactly types 297, 298, 299, 300, 301.
The complete contained record type distinguishes the alternative. No unused tag or wrapper ID.

CanonicalRecordSchemaRef remains 254/1, StatePathPattern 149/1, LeafValueGrammar 152/1, StatePatch
144/1. All semantic-domain equations, positive scales/capacities, absence/zero normalization,
reference resolution and static/REG validation remain accepted F/E/REG behavior unchanged.

## Closed tagged-union layouts

Each row becomes a type-259 UnionVariantDefinition entry with namespace-1024 stable payload
`[TypeId, Tag]`, under registry/union-variant-definition. Required and forbidden field sets below
are exhaustive. Tag is field 1 in these union representation records. No retired V04 variant is
widened; V06 uses a different record type.

| Record type | Tag | Variant | Required field IDs | Forbidden field IDs |
|---:|---:|---|---|---|
| 260 | 1 | IdentityKey | 1 | 2 |
| 260 | 2 | CanonicalRecordKey | 1, 2 | none |
| 264 | 1 | RecordField | 1, 2, 4 | 3 |
| 264 | 2 | StateMapKey | 1, 3, 4 | 2 |
| 273 | 1 | NoStateWrites | 1 | none |
| 275 | 1 | FrozenSemanticExperienceProducer | 1, 2, 3, 4 | 5 |
| 275 | 2 | RegisteredTransitionProducer | 1, 5 | 2, 3, 4 |
| 286 | 1 | Unmaterialized | 1 | 2, 3 |
| 286 | 2 | Materialized | 1, 2, 3 | none |
| 288 | 1 | Unbounded | 1 | 2 |
| 288 | 2 | Bounded | 1, 2 | none |
| 291 | 1 | LeafLocalScale | 1, 2 | none |
| 291 | 2 | RegulatoryVariableFromKey | 1 | 2 |
| 291 | 3 | LoadDomainFromKey | 1 | 2 |
| 291 | 4 | ProcedureFromKey | 1 | 2 |
| 312 | 1 | Exposure | 1, 2 | 3 |
| 312 | 2 | Practice | 1, 3 | 2 |
| 313 | 1 | ExposureVariable | 1, 2 | 3 |
| 313 | 2 | RegulatoryVariable | 1, 2 | 3 |
| 313 | 3 | Load | 1, 3 | 2 |
| 313 | 4 | Procedure | 1 | 2, 3 |
| 314 | 1 | Always | 1 | 2 |
| 314 | 2 | FrozenBaseline | 1, 2 | none |
| 321 | 1 | FrozenSemanticExperienceProducer | 1, 2, 3, 4 | 5, 6 |
| 321 | 2 | RegisteredTransitionProducer | 1, 5 | 2, 3, 4, 6 |
| 321 | 3 | AuthoredAdaptationFactProducer | 1, 6 | 2, 3, 4, 5 |
| 322 | 1 | NoStateWrites | 1 | 2, 3 |
| 322 | 2 | StateWrites | 1, 2, 3 | none |
| 326 | 1 | Absent | 1 | 2 |
| 326 | 2 | Present | 1, 2 | none |
| 327 | 1 | NoStateChange | 1 | 2 |
| 327 | 2 | StateChange | 1, 2 | none |

## Other finite field values

These are field-local unsigned values, not typed namespaces. Existing phase numbers, SEM lane
values and observation enums are reused without renumbering; Lane on the producer records uses
the accepted SEM Current/Consequence encoding, and EVID admission requires Consequence.

| Field position | Value | Meaning |
|---|---:|---|
| TransitionInputAdmissionV04.RequiredSourceRelation | 1 | ExactImmediateProducerOutput |
| TransitionInputAdmissionV06.RequiredSourceRelation | 1 | ExactImmediateProducerOutput |
| TransitionIngressDefinition.DueAtRule | 1 | SameAsProducer |
| TransitionIngressDefinition.PayloadRule | 1 | ExactAdmittedSourceOutput |
| TransitionIngressDefinition.Multiplicity | 1 | ExactlyOncePerSourcePerConsumer |
| TransitionOutputDefinition.Multiplicity | 1 | ExactlyOnePerExecution |
| AdaptationTransitionRegistrationExtension.AcceptedBasis | 1 | RegulatoryExposureFact |
| AdaptationTransitionRegistrationExtension.AcceptedBasis | 2 | ProceduralPracticeFact |
| AdaptationOutputProductionDefinition.Rule | 1 | ExactlyOnePerResolvedAdaptationRule |
| AdaptationSettlementDefinition.PhasePolicy | 1 | ExclusiveAdaptation140 |

ADAPT source phase is 110; bridge phases 120..124; EVID consumers 130; ADAPT consumers 140.
The existing phase-150 non-schedulable sentinel remains unchanged. Failure codes remain existing
canonical text members carried by type 162, not a new numeric error enum: PRJ's accepted failures,
EVID INPUT_NOT_ADMITTED / TRANSITION_OUTPUT_VIOLATION / TRANSITION_INGRESS_VIOLATION /
TRANSITION_WRITE_FORBIDDEN and all nine ADAPT additions listed in accepted F retain their meanings.
REG local result/failure sums receive no canonical record/tag allocation.

## Registry instances and schema bindings

Reuse SemanticRegistryEntry 171 and schema descriptors 172/173. The accepted F registry matrix is
the authoritative family/kind/version relation. Substitute the allocated schema type below, with
no new singleton or duplicated row key:

| Registry kind | StableId family / instance | Definition type | DefinitionVersion |
|---|---|---:|---|
| registry/transition-admission | 1027 / definition/transition-admission | 279 | transition-admission/0.4-candidate |
| registry/transition-registration | 1009 / two EVID members | 272 | transition-admission/0.4-candidate |
| registry/transition-registration | 1009 / two ADAPT members | 318 | transition-admission-extension/0.6-candidate |
| registry/regulatory-variable | 1029 / model V | 283 | regulatory-reference/0.5-candidate |
| registry/campaign2-state-family | 1027 / definition/campaign2-state-families | 284 | adaptation-input/0.31-candidate |
| registry/adaptation-leaf-family | 1032 / five leaf members | 290 | adaptation-input/0.31-candidate |
| registry/load-domain | 1033 / model L | 287 | adaptation-input/0.31-candidate |
| registry/procedure | 1034 / model P | 289 | adaptation-input/0.31-candidate |
| registry/adaptation-rule | 1035 / model rule | 311 | adaptation-input/0.31-candidate |
| registry/authored-adaptation-facts | 1027 / definition/authored-adaptation-facts | 308 | adaptation-input/0.31-candidate |
| registry/authored-fact-consequence-bridge | 1027 / definition/authored-fact-consequence-bridge | 309 | adaptation-input/0.31-candidate |
| registry/adaptation-settlement | 1027 / definition/adaptation-settlement | 328 | adaptation-settlement/0.2-candidate |

PRJ's four accepted collections remain sets keyed by exact Pattern/Position/OutputAccessor in
their existing admitting contract context. No registry/projection-accessor or new registry instance
is invented for them. IDN roster state is initial-state/run data, not a SemanticRegistryEntry.
REG's Parameters map is the only parameter-definition authority; namespace 1030 is enforced
contextually on its type-120/121 positions, not globally on those generic schemas.

## State-path, role and occurrence allocation

| Leaf | Root/field | Key type | Value type | Authority payload in namespace 1025 |
|---|---|---:|---:|---|
| tolerance | 302/1 | 292 | 297 | authority/regulatory-adaptation |
| sensitization | 302/2 | 293 | 298 | authority/regulatory-adaptation |
| displacement | 302/3 | 294 | 299 | authority/regulatory-adaptation |
| load | 302/4 | 295 | 300 | authority/regulatory-adaptation |
| competence | 303/1 | 296 | 301 | authority/procedural-skill |
| IDN Bindings | 268/1 | ObserverId identity key, namespace 1000 | 267 | none; read-only |

Each ADAPT row gets exactly one StateKeyGrammarDefinition and OwnedLeafDefinition; the latter uses
CanonicalRecord with that value type and RemovalAllowed true. IDN gets one read-only declaration
and IdentityKey grammar. Eight cognitive families get no physical root, leaf or authority.

For all new records, CharacterId fields use RequiredNamespace 1002 with
validator/character-qualification (1021); ExposureReferentId fields use namespace 1002 without
validator. Variable/load/procedure/rule/family/leaf/route fields use their exact table namespaces,
with contextual definition existence independent of identity role. Composite-key fields have
RecordField role positions; do not substitute StateMapKey for fields inside a record key.
IDN's roster map key uses StateMapKey with ObserverId/1000, and its wrapper uses RecordField CharacterId.
REG wrapper key uses RecordField CharacterId. RequiredNamespace fields themselves are numeric
namespace values, not TypedIdentifierValue. Exact inherited SEM roles remain unchanged.

| Produced schema | Occurrence field | Namespace |
|---|---:|---:|
| OutcomeEvaluation 269/1 | 1 | 1116 |
| OutcomeLearningEvidence 270/1 | 1 | 1117 |
| AutomaticAdaptationInput 307/1 | 1 | 1118 |
| AdaptationDispatchRecord 324/1 | 1 | 1119 |
| AdaptationEvaluationResult 325/1 | 1 | 1120 |
| accepted PreRecognitionSemanticExperience 227/1 | 1 | existing 1106 |

These rows populate the existing shared OccurrenceIdentities map, with matching PRJ RecordField
roles and no DomainValidator. Evaluation.DispatchId uses 1119 as a reference, not another occurrence.
FixtureConsequenceTruthId 1121 enters the accepted TruthRecordId representation at fixture
construction only; no global type-200 constraint or duplicate source identity. ObservationId stays
1115. Bridge support stays type 216 and freeze type 227. ProjectionAccessorId/1028 is checked only
at the extended contract-definition boundary; generic ActualReadRecord/147 is not narrowed.

## Shared allocation clarifications — G1/G2 CLOSED

SemanticKindId uses namespace 1004 (CONTENT/shared). The required member is exact NFC text
semantic-kind/character. The namespace's availability was explicitly frozen by Campaign 1; this
new Campaign-2 assignment does not rewrite that historical table. The prior IDN claim of an already
permanent SemanticKind namespace was an allocation assumption, now corrected. DomainValidatorId
1021 and validator/character-qualification remain separate from the declared content kind.

SeamId uses namespace 1036 (trace/transition substrate). All member payloads are nonempty UTF-8 NFC,
exact canonical byte equality, no aliases, case folding or ordinal meaning. No seam registry or
new definition record is introduced. Both ADAPT V06 registrations have exactly:

ExecutingSeamId = SeamId/1036("seam/automatic-adaptation")
ExecutingSeamVersion = adaptation-input/0.31-candidate

Their distinct TransitionKindIds continue to identify the regulatory and procedural transitions.
No separate regulatory/procedural seam members are introduced and no equation or record shape changes.

### Bidirectional accepted-symbol audit

| Allocated member | Accepted symbolic use / evidence |
|---|---|
| semantic-kind/character | IDN §2.1: frozen character-kind equality; CONTENT owns the family |
| seam/event-truth-to-pre-recognition-experience | EVENT_SEMANTIC_BINDING.md SeamId; EVID accepted SEM source |
| seam/character-learning-evidence | EVID named SeamId and both V04 registrations |
| seam/automatic-adaptation | This reviewed allocation clarification, recorded in ADAPT/E; both V06 registrations |
| seam/truth-to-permitted-evidence | OBSERVATION_AND_EVIDENCE.md accepted bounded-measurement SeamId; D's observation branch |

The non-test docs/formal, docs/planning and active source audit found no other permanent symbolic
content-kind value or accepted named SeamId required by this admitting model. Fixture world-action
kind, fixture seam/golden and fixture namespaces 23001/21003/25005/22003 are not promoted.
The observation seam is an accepted additional use discovered by the requested audit, not an
invented fixture member. Each of these five allocations has exactly one symbolic identity and at
least one owning accepted use; repeated references are not new members.

### Qualification boundary and frozen allocation controls

For Campaign-2 admitting contracts, V04/V06 ExecutingSeamId, FrozenSemanticExperienceProducer's
ProducingSeamId and the PRJ requirement seam component use namespace 1036. Exact EVID, SEM and ADAPT
members must match their receiving contracts. Runtime copies validated values to trace. Do not
narrow historical generic type-160 SeamId fields or migrate legacy contracts outside this addendum.
Similarly Campaign-2 content/IDN character-kind construction uses SemanticKindId/1004; a fixture
namespace cannot satisfy the exact character-kind role merely because its text matches.

C2-F-ID-1 (FROZEN, NOT PASSED): semantic-kind/character inhabits 1004; wrong namespace fails
content/IDN model construction; fixture 23001 is rejected as permanent authority.
C2-F-ID-2 (FROZEN, NOT PASSED): all admitting seam positions inhabit 1036 and use the exact
contract member; reject fixture/borrowed namespaces; preserve legacy trace syntax outside the
addendum. Check every accepted symbolic member to its allocation and every allocated member to
its accepted use, including the observation seam. These are future executable gates; the numeric
coverage audit below is not evidence that a runtime validator has been implemented.

VAL-001 remains independent: neither SemanticKindId nor the character-qualification validator's
ID makes the CONTENT kind-validator closure committable. Allocation can be accepted before VAL;
canonical activation relying on affected executables cannot proceed before it closes.

## Allocation audit and next boundary

Run `node scripts/audit-campaign2-allocation.mjs` from the repository root to reproduce the final
mechanical gates; add `--write` to refresh [the audit artifact](CAMPAIGN2_ALLOCATION_AUDIT.json).
Gate A checks exact equality of all 69 record definitions and field IDs/types/required flags,
18 namespace rows, 58 member payloads, 32 tagged-union rows and 10 finite field values. It also
checks preservation of every earlier proposed assignment. Gate B anchors the exact declaration
in [the accepted observation authority](OBSERVATION_AND_EVIDENCE.md): line 3 explicitly accepts
`observation/0.1-candidate`; line 5 declares `**SeamId:** ` followed by
`seam/truth-to-permitted-evidence`. The artifact retains both full lines, their line numbers and
the source SHA-256; the symbol is not inferred from the descriptive title.

Both final gates passed on 2026-09-06. Under the review's conditional authorization, records
260..328, namespaces 1004, 1026..1036 and 1116..1121 as listed, member payloads, union tags/layouts
and finite values are now permanent. Revision 2 preserves all prior assignments and adds only
the two reviewed shared families and five supported members. Semantic versions remain unchanged.

No canonical construction or executable registry-manifest bytes were changed by this freeze.
Next address applicable VAL activation and construction gates. ADAPT remains formally OPEN;
PHEN-ADAPT and every unexecuted frozen gate, including C2-F-ID-1/2, remain NOT PASSED. Previously
recorded WRT proof is preserved. Allocation acceptance is neither seam implementation proof nor
permission to rely canonically on affected governed executable closures before VAL-001 closes.
