import {
  list, record, set, text, typedIdentifier, unsigned,
  type RecordSchema,
} from '../substrate/canonicalEncoding';
import type { SemanticRegistryEntry } from '../substrate/contentManifest';

export const SEMANTIC_SCHEMA_ALLOCATION_VERSION = 'semantic-schema-allocation/0.1-candidate#SEM-001I.2' as const;

type FieldSpec = string | readonly [string, false];
const optional = (name: string): readonly [string, false] => [name, false];
const schema = (typeId: number, name: string, fields: readonly FieldSpec[]): RecordSchema => Object.freeze({
  typeId: BigInt(typeId), schemaVersion: 1n, name,
  fields: Object.freeze(fields.map((field, index) => Object.freeze({
    id: BigInt(index + 1), name: typeof field === 'string' ? field : field[0], required: typeof field === 'string',
  }))),
});

export const SEMANTIC_RECORD_SCHEMAS: readonly RecordSchema[] = Object.freeze([
  schema(210,'WorldEventTruth',['WorldEventId','EventTypeId','OccurredAt','EventBindings']),
  schema(211,'EventBinding',['EventBindingId','EventRoleId','SemanticReferentId']),
  schema(212,'PerceptualReferentId',['ObserverId','ObserverTrackSequence']),
  schema(213,'PerceptualEventReferentId',['ObserverId','ObserverEventSequence']),
  schema(214,'CurrentDetectionId',['ObserverId','DetectionOccurrenceId']),
  schema(215,'CurrentEventDetectionId',['ObserverId','EventDetectionOccurrenceId']),
  schema(216,'SupportingObservationId',['ObserverId','ObservationId']),
  schema(217,'PerceptualTrackTransition',['ObserverId',optional('PriorPerceptualReferentId'),'PerceptualReferentId','CurrentDetectionId','ContinuityKind','SupportingObservationIds','OccurredAt','TransformationVersion']),
  schema(218,'PerceptualTrackEnd',['ObserverId','PerceptualReferentId','SupportingObservationIds','OccurredAt','TransformationVersion']),
  schema(219,'PerceptualEventTransition',['ObserverId',optional('PriorPerceptualEventReferentId'),'PerceptualEventReferentId','CurrentEventDetectionId','ContinuityKind','SupportingObservationIds','OccurredAt','TransformationVersion']),
  schema(220,'PerceptualEventEnd',['ObserverId','PerceptualEventReferentId','SupportingObservationIds','OccurredAt','TransformationVersion']),
  schema(221,'PermittedPerceptualFeatureObservation',['FeatureObservationId','ObserverId','CurrentDetectionId','PerceptualReferentId','PerceptualFeatureId','BooleanValue','ObservationChannelId','SupportingObservationIds','OccurredAt','TransformationVersion']),
  schema(222,'PermittedPerceptualEventFeatureObservation',['EventFeatureObservationId','ObserverId','CurrentEventDetectionId','PerceptualEventReferentId','PerceptualEventFeatureId','BooleanValue','ObservationChannelId','SupportingPerceptualReferentIds','SupportingObservationIds','OccurredAt','TransformationVersion']),
  schema(223,'EventRoleEvidence',['VariantTag',optional('EventRoleId')]),
  schema(224,'PerceivedBindingEvidence',['PerceivedBindingId','ObserverId','PerceptualEventReferentId','PerceptualReferentId','EventRoleEvidence','SupportingObservationIds','OccurredAt','TransformationVersion']),
  schema(225,'PerceptualClassificationEvidence',['ClassificationEvidenceId','ExperienceId','ObserverId','PerceptualReferentId','PerceptualFacetId','TypedPerceivedValue','ClassificationRuleId','SupportingFeatureObservationIds','SupportingObservationIds','OccurredAt','TransformationVersion']),
  schema(226,'PerceptualEventClassificationEvidence',['EventClassificationEvidenceId','ExperienceId','ObserverId','PerceptualEventReferentId','PerceptualEventFacetId','TypedPerceivedValue','EventClassificationRuleId','SupportingEventFeatureObservationIds','SupportingPerceptualReferentIds','SupportingObservationIds','OccurredAt','TransformationVersion']),
  schema(227,'PreRecognitionSemanticExperience',['ExperienceId','ObserverId','OccurredAt','PerceptualEventReferentIds','PerceivedBindings','PerceptualClassifications','PerceptualEventClassifications','SupportingObservationIds','TransformationVersion']),
  schema(228,'RecognitionCandidateCatalogEntry',['ObserverId','CandidateSemanticReferentId','CandidateDomain','RecognitionTemplateIds','CatalogEntryVersion']),
  schema(229,'ObserverIdentitySymbolMapping',['ObserverSymbolCandidateMappingId','ObserverId','PerceivedIdentitySymbolId','CandidateSemanticReferentId','MappingVersion']),
  schema(230,'RecognitionCueSource',['VariantTag',optional('RecognitionTemplateId'),optional('PerceivedIdentitySymbolId'),optional('ObserverSymbolCandidateMappingId')]),
  schema(231,'RecognitionExperienceEvidenceRef',['VariantTag',optional('ClassificationEvidenceId'),optional('PerceivedBindingId'),optional('SupportingObservationId')]),
  schema(232,'PermittedRecognitionCueEvidence',['RecognitionCueEvidenceId','ExperienceId','ObserverId','PerceptualReferentId','CandidateSemanticReferentId','RecognitionCueSource','CuePolarity','SupportingExperienceEvidenceRefs','OccurredAt','TransformationVersion']),
  schema(233,'RecognitionEvaluationResult',['VariantTag',optional('NoUpdateReason'),optional('CandidateSemanticReferentId')]),
  schema(234,'RecognitionEvaluation',['RecognitionEvaluationId','ExperienceId','ObserverId','PerceptualReferentId','RecognitionRuleId','EvaluatedRecognitionCueEvidenceIds',optional('PriorRecognitionResolutionId'),'Result','OccurredAt','RecognitionVersion']),
  schema(235,'RecognitionResolution',['VariantTag',optional('CandidateSemanticReferentId')]),
  schema(236,'RecognitionResolutionRecord',['RecognitionResolutionId','ExperienceId','ObserverId','PerceptualReferentId','Resolution','RecognitionRuleId','EvaluatedRecognitionCueEvidenceIds',optional('RevisesRecognitionResolutionId'),'OccurredAt','RecognitionVersion']),
  schema(237,'CharacterEvidenceRef',['VariantTag',...['ObservationId','FeatureObservationId','EventFeatureObservationId','PerceivedBindingId','ClassificationEvidenceId','EventClassificationEvidenceId','RecognitionCueEvidenceId','RecognitionResolutionId','CausalRoleEvidenceId'].map(optional)]),
  schema(238,'EvidenceCarrier',['VariantTag',optional('PerceptualReferentId'),optional('PerceptualEventReferentId')]),
  schema(239,'EvidenceApplicabilityScope',['ExperienceId','WindowId','ModalityId','FeatureScopeId','EvidenceCarrier'].map(optional)),
  schema(240,'CausalRoleEvidence',['CausalRoleEvidenceId','ExperienceId','ObserverId','PerceptualEventReferentId','PerceptualReferentId','CausalRoleId','CausalRoleDerivationRuleId','SupportingEvidenceRefs','OccurredAt','TransformationVersion']),
  schema(241,'PerceptualContinuantFileState',['NextTrackSequenceByObserver','ActivePerceptualReferentIds']),
  schema(242,'PerceptualEventFileState',['NextEventSequenceByObserver','ActivePerceptualEventReferentIds']),
  schema(243,'RecognitionKnowledgeState',['CandidateCatalogEntries','IdentitySymbolMappings']),
  schema(244,'RecognitionResolutionState',['ResolutionRecords']),
  schema(245,'MaxOccurrences',['VariantTag',optional('FiniteValue')]),
  schema(246,'RoleCardinalityRule',['EventRoleId','MinOccurrences','MaxOccurrences',optional('ReferentDomainNarrowingValidatorId')]),
  schema(247,'EventRoleDefinition',['EventRoleId','BroadReferentDomainValidatorId','DefinitionVersion']),
  schema(248,'EventTypeBindingSchema',['EventTypeId','RoleCardinalityRules','BindingSchemaVersion',optional('FixedActionReferentId')]),
  schema(249,'PerceptualFacetDefinition',['PerceptualFacetId','PerceivedValueType','ObservationDomainValidatorId','DefinitionVersion']),
  schema(250,'PerceptualClassificationRuleDefinition',['ClassificationRuleId','PermittedInputFeatureIds','OutputPerceptualFacetId','DerivationFunctionId','RuleVersion']),
  schema(251,'PerceptualEventFacetDefinition',['PerceptualEventFacetId','PerceivedValueType','ObservationDomainValidatorId','DefinitionVersion']),
  schema(252,'PerceptualEventClassificationRuleDefinition',['EventClassificationRuleId','PermittedInputEventFeatureIds','OutputPerceptualEventFacetId','DerivationFunctionId','RuleVersion']),
  schema(253,'RecognitionRuleDefinition',['RecognitionRuleId','RecognitionDomain','PermittedCueSourceKinds','DerivationFunctionId','RuleVersion']),
  schema(254,'CanonicalRecordSchemaRef',['TypeId','SchemaVersion']),
  schema(255,'PermittedEvidenceSchema',['ReferenceKind','RecordSchemaRef','ProducingEpistemicSeamVersion']),
  schema(256,'EvidenceReadDomain',['TransitionKindId','PermittedEvidenceSchemas','TemporalScope',optional('PermittedModalityIds'),optional('PermittedFeatureScopeIds')]),
  schema(257,'EventRoleToCausalRoleRule',['EventRoleId','CausalRoleId']),
  schema(258,'CausalRoleDerivationRuleDefinition',['CausalRoleDerivationRuleId','CausalRoleDomain','PermittedBasisKinds','Mappings','DerivationFunctionId','RuleVersion']),
  schema(259,'UnionVariantDefinition',['RecordTypeId','VariantTag','RequiredPayloadFieldIds','ForbiddenPayloadFieldIds']),
]);

export const SEMANTIC_TYPED_ID_NAMESPACES = Object.freeze({
  ObserverId: 1000n, EventTypeId: 1001n, SemanticReferentId: 1002n, EventRoleId: 1003n,
  // 1004 is genuinely unallocated and available for a future accepted semantic identity.
  ObservationChannelId: 1005n, ModalityId: 1006n, WindowId: 1007n, FeatureScopeId: 1008n,
  TransitionKindId: 1009n, PerceptualFeatureId: 1010n, PerceptualFacetId: 1011n,
  PerceptualClassificationRuleId: 1012n, PerceptualEventFeatureId: 1013n,
  PerceptualEventFacetId: 1014n, PerceptualEventClassificationRuleId: 1015n,
  RecognitionTemplateId: 1016n, PerceivedIdentitySymbolId: 1017n, RecognitionRuleId: 1018n,
  CausalRoleId: 1019n, CausalRoleDerivationRuleId: 1020n, DomainValidatorId: 1021n,
  DerivationFunctionId: 1022n, RegistryKindId: 1023n, UnionVariantDefinitionId: 1024n,
} as const);

export const SEMANTIC_OCCURRENCE_NAMESPACES = Object.freeze(Object.fromEntries([
  'EventBindingId','FeatureObservationId','EventFeatureObservationId','PerceivedBindingId','ClassificationEvidenceId','EventClassificationEvidenceId','ExperienceId','ObserverSymbolCandidateMappingId','RecognitionCueEvidenceId','RecognitionEvaluationId','RecognitionResolutionId','CausalRoleEvidenceId','DetectionOccurrenceId','EventDetectionOccurrenceId','WorldEventId','ObservationId',
].map((name,index)=>[name,BigInt(1100+index)]))) as Readonly<Record<string,bigint>>;

export const SEMANTIC_FINITE_REGISTRIES = Object.freeze({
  EventRole: ['Action','Actor','Companion','Target','Recipient','Instrument','AffectedEntity','Beneficiary','Participant','Location'],
  CausalRole: ['Cause','Actor','Target','Recipient','Instrument','AffectedEntity','Participant','Location','Context','Incidental'],
  EventRoleEvidence: ['ExactEventRole','UnresolvedEventRole'], ContinuantContinuity: ['NewTrack','ContinuesPriorTrack'], EventContinuity: ['NewEventFile','ContinuesPriorEventFile'],
  MaxOccurrences: ['Finite','Unbounded'], ClassificationResult: ['NoAssertion','Assert'], RecognitionCandidateDomain: ['Person','DiscreteObject','PlaceOrRegion'],
  RecognitionCueSource: ['RetainedTemplateMatch','IdentityClaimMapping'], RecognitionExperienceRef: ['ContinuantClassification','PerceivedBinding','SupportingObservation'], CuePolarity: ['SupportsCandidate','ContradictsCandidate'],
  RecognitionNoUpdateReason: ['NoQualifyingCandidate','AmbiguousCandidates','SameCandidateMaintained'], RecognitionEvaluationResult: ['NoUpdate','AssertUniqueCandidate','WithdrawCurrentResolution'], RecognitionResolution: ['AssertedCandidate','Withdrawn'],
  CharacterEvidenceRef: ['Observation','ContinuantFeature','EventFeature','PerceivedBinding','ContinuantClassification','EventClassification','RecognitionCue','RecognitionResolution','CausalRole'], EvidenceCarrier: ['Continuant','Event','ContinuantInEvent'], EvidenceTemporalScope: ['SameWindow','SameExperience','HistoricalOrCurrent'], ObservationLane: ['Current','Consequence'],
} as const);

export interface UnionVariantContract {
  readonly recordTypeId: bigint;
  readonly variantTag: bigint;
  readonly requiredPayloadFieldIds: readonly bigint[];
  readonly forbiddenPayloadFieldIds: readonly bigint[];
}

const variant = (recordTypeId: number, variantTag: number, required: readonly number[], forbidden: readonly number[]): UnionVariantContract => Object.freeze({
  recordTypeId: BigInt(recordTypeId), variantTag: BigInt(variantTag),
  requiredPayloadFieldIds: Object.freeze(required.map(value => BigInt(value))),
  forbiddenPayloadFieldIds: Object.freeze(forbidden.map(value => BigInt(value))),
});

export const SEMANTIC_UNION_VARIANTS: readonly UnionVariantContract[] = Object.freeze([
  variant(223,1,[2],[]), variant(223,2,[],[2]),
  variant(230,1,[2],[3,4]), variant(230,2,[3,4],[2]),
  variant(231,1,[2],[3,4]), variant(231,2,[3],[2,4]), variant(231,3,[4],[2,3]),
  variant(233,1,[2],[3]), variant(233,2,[3],[2]), variant(233,3,[],[2,3]),
  variant(235,1,[2],[]), variant(235,2,[],[2]),
  ...Array.from({ length: 9 }, (_, index) => variant(237,index+1,[index+2],Array.from({ length: 9 },(_, fieldIndex)=>fieldIndex+2).filter(id=>id!==index+2))),
  variant(238,1,[2],[3]), variant(238,2,[3],[2]), variant(238,3,[2,3],[]),
  variant(245,1,[2],[]), variant(245,2,[],[2]),
]);

const unionVariantSchema = SEMANTIC_RECORD_SCHEMAS.find(value => value.typeId === 259n)!;
export const UNION_VARIANT_REGISTRY_KIND = typedIdentifier(
  SEMANTIC_TYPED_ID_NAMESPACES.RegistryKindId,
  text('registry/union-variant-definition'),
);
export const SEMANTIC_UNION_VARIANT_ENTRIES: readonly SemanticRegistryEntry[] = Object.freeze(SEMANTIC_UNION_VARIANTS.map(contract => ({
  stableId: typedIdentifier(SEMANTIC_TYPED_ID_NAMESPACES.UnionVariantDefinitionId, list([unsigned(contract.recordTypeId), unsigned(contract.variantTag)])),
  registryKind: UNION_VARIANT_REGISTRY_KIND,
  definitionVersion: 'union-variant/1',
  definition: record(unionVariantSchema, new Map([
    [1n,unsigned(contract.recordTypeId)], [2n,unsigned(contract.variantTag)],
    [3n,set(contract.requiredPayloadFieldIds.map(unsigned))], [4n,set(contract.forbiddenPayloadFieldIds.map(unsigned))],
  ])),
})));

/** Closes the accepted v0.1 registry-kind domain before manifest compilation. */
export function validateSemanticRegistryEntryKinds(entries: readonly SemanticRegistryEntry[]): void {
  for (const entry of entries) {
    const kind = entry.registryKind;
    const payload = kind.payload;
    if (kind.namespaceId !== SEMANTIC_TYPED_ID_NAMESPACES.RegistryKindId
      || typeof payload !== 'object'
      || payload.kind !== 'text'
      || payload.value !== 'registry/union-variant-definition') {
      throw new Error('unknown semantic registry kind');
    }
  }
}

/** Validates the exact tag-to-payload layout before an occurrence can be allocated or emitted. */
export function validateSemanticUnionVariant(recordTypeId: bigint, variantTag: bigint, presentPayloadFieldIds: readonly bigint[]): void {
  const contract = SEMANTIC_UNION_VARIANTS.find(value => value.recordTypeId === recordTypeId && value.variantTag === variantTag);
  if (!contract) throw new Error(`unknown union variant ${recordTypeId}/${variantTag}`);
  const present = new Set(presentPayloadFieldIds.map(String));
  if (present.size !== presentPayloadFieldIds.length) throw new Error('duplicate union payload field');
  for (const fieldId of contract.requiredPayloadFieldIds) if (!present.has(String(fieldId))) throw new Error(`missing required union payload field ${fieldId}`);
  for (const fieldId of contract.forbiddenPayloadFieldIds) if (present.has(String(fieldId))) throw new Error(`forbidden union payload field ${fieldId}`);
  if (present.size !== contract.requiredPayloadFieldIds.length) throw new Error('undeclared union payload field');
}
