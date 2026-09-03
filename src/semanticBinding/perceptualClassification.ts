import {
  type PerceptualReferentId,
  type SupportingObservationId,
} from './perceptualEventFiles';

export const PERCEPTUAL_CLASSIFICATION_CONTRACT_VERSION = 'semantic-binding/0.1-candidate#SEM-001D' as const;

export const PerceptualFacetId = {
  AppearsPersonLike: 'perceptual-facet/appears-person-like',
  AppearsDiscreteObjectLike: 'perceptual-facet/appears-discrete-object-like',
  AppearsInteriorSpaceLike: 'perceptual-facet/appears-interior-space-like',
  AppearsMetallic: 'perceptual-facet/appears-metallic',
  AppearsElongated: 'perceptual-facet/appears-elongated',
  AppearsBlunt: 'perceptual-facet/appears-blunt',
} as const;

export type PerceptualFacetId = typeof PerceptualFacetId[keyof typeof PerceptualFacetId];

export const PerceptualFeatureId = {
  ObservedPersonForm: 'perceptual-feature/observed-person-form',
  ObservedDiscreteObjectForm: 'perceptual-feature/observed-discrete-object-form',
  ObservedEnclosureForm: 'perceptual-feature/observed-enclosure-form',
  ObservedMetallicSurface: 'perceptual-feature/observed-metallic-surface',
  ObservedElongatedForm: 'perceptual-feature/observed-elongated-form',
  ObservedBluntForm: 'perceptual-feature/observed-blunt-form',
} as const;

export type PerceptualFeatureId = typeof PerceptualFeatureId[keyof typeof PerceptualFeatureId];

export interface CurrentDetectionId {
  readonly observerId: string;
  readonly detectionId: string;
}

export interface PerceptualFacetDefinition {
  readonly perceptualFacetId: PerceptualFacetId;
  readonly perceivedValueType: 'boolean';
  readonly observationDomainValidatorId: string;
  readonly definitionVersion: string;
}

export interface PermittedPerceptualFeatureObservation {
  readonly featureObservationId: string;
  readonly observerId: string;
  readonly currentDetectionId: CurrentDetectionId;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly perceptualFeatureId: PerceptualFeatureId;
  readonly booleanValue: boolean;
  readonly observationChannelId: string;
  readonly supportingObservationIds: readonly SupportingObservationId[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

export interface PerceptualClassificationRuleDefinition {
  readonly classificationRuleId: string;
  readonly permittedInputFeatureIds: readonly PerceptualFeatureId[];
  readonly outputPerceptualFacetId: PerceptualFacetId;
  readonly derivationFunctionId: string;
  readonly ruleVersion: string;
}

export type ClassificationRuleResult =
  | { readonly kind: 'no-assertion' }
  | { readonly kind: 'assert'; readonly booleanValue: boolean };

export interface ClassificationDerivation {
  readonly derivationFunctionId: string;
  derive(features: readonly PermittedPerceptualFeatureObservation[]): ClassificationRuleResult;
}

export interface PerceptualClassificationModel {
  readonly modelIdentity: string;
  readonly facetDefinitions: readonly PerceptualFacetDefinition[];
  readonly rules: readonly PerceptualClassificationRuleDefinition[];
  readonly derivations: readonly ClassificationDerivation[];
}

export interface ClassificationRequest {
  readonly experienceId: string;
  readonly observerId: string;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly currentDetectionId: CurrentDetectionId;
  readonly featureObservations: readonly PermittedPerceptualFeatureObservation[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

export interface PerceptualClassificationEvidence {
  readonly classificationEvidenceId: bigint;
  readonly experienceId: string;
  readonly observerId: string;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly perceptualFacetId: PerceptualFacetId;
  readonly typedPerceivedValue: boolean;
  readonly classificationRuleId: string;
  readonly supportingFeatureObservationIds: readonly string[];
  readonly supportingObservationIds: readonly SupportingObservationId[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

export interface CompiledPerceptualClassifications {
  readonly classifications: readonly PerceptualClassificationEvidence[];
  readonly nextRuntimeId: bigint;
}

export type ClassificationEmissionTarget =
  | 'semantic-experience-assembly'
  | 'recognition-hypothesis'
  | 'appraisal'
  | 'affect'
  | 'motive'
  | 'pressure'
  | 'reason'
  | 'identity'
  | 'relationship'
  | 'world-truth';

export type PerceptualClassificationFailureCode =
  | 'INVALID_MODEL'
  | 'UNKNOWN_FACET'
  | 'UNKNOWN_FEATURE'
  | 'MISSING_FACET_AUTHORITY'
  | 'DUPLICATE_FACET_AUTHORITY'
  | 'UNKNOWN_DERIVATION'
  | 'INVALID_FEATURE_OBSERVATION'
  | 'INVALID_RULE_RESULT'
  | 'NEGATIVE_EVIDENCE_REQUIRED'
  | 'CROSS_OBSERVER_REFERENCE'
  | 'CARRIER_TYPE_MISMATCH'
  | 'FORBIDDEN_TRUTH_FIELD'
  | 'DUPLICATE_CLASSIFICATION'
  | 'INVALID_ALLOCATOR_STATE'
  | 'FORBIDDEN_EMISSION_TARGET';

export class PerceptualClassificationContractError extends Error {
  constructor(readonly code: PerceptualClassificationFailureCode, message: string) {
    super(message);
    this.name = 'PerceptualClassificationContractError';
  }
}

const FIXTURE_DOMAIN = 'observation-domain/finite-visual-fixture';

export const INITIAL_PERCEPTUAL_FACET_DEFINITIONS: readonly PerceptualFacetDefinition[] = Object.freeze([
  facet(PerceptualFacetId.AppearsPersonLike),
  facet(PerceptualFacetId.AppearsDiscreteObjectLike),
  facet(PerceptualFacetId.AppearsInteriorSpaceLike),
  facet(PerceptualFacetId.AppearsMetallic),
  facet(PerceptualFacetId.AppearsElongated),
  facet(PerceptualFacetId.AppearsBlunt),
].sort(compareFacets));

export const INITIAL_PERCEPTUAL_CLASSIFICATION_RULES: readonly PerceptualClassificationRuleDefinition[] = Object.freeze([
  directRule('classification-rule/person-form', PerceptualFeatureId.ObservedPersonForm, PerceptualFacetId.AppearsPersonLike),
  directRule('classification-rule/discrete-object-form', PerceptualFeatureId.ObservedDiscreteObjectForm, PerceptualFacetId.AppearsDiscreteObjectLike),
  directRule('classification-rule/enclosure-form', PerceptualFeatureId.ObservedEnclosureForm, PerceptualFacetId.AppearsInteriorSpaceLike),
  directRule('classification-rule/metallic-surface', PerceptualFeatureId.ObservedMetallicSurface, PerceptualFacetId.AppearsMetallic),
  directRule('classification-rule/elongated-form', PerceptualFeatureId.ObservedElongatedForm, PerceptualFacetId.AppearsElongated),
  directRule('classification-rule/blunt-form', PerceptualFeatureId.ObservedBluntForm, PerceptualFacetId.AppearsBlunt),
].sort(compareRules));

export const INITIAL_CLASSIFICATION_DERIVATIONS: readonly ClassificationDerivation[] = Object.freeze(
  INITIAL_PERCEPTUAL_CLASSIFICATION_RULES.map((rule) => Object.freeze({
    derivationFunctionId: rule.derivationFunctionId,
    derive: (features: readonly PermittedPerceptualFeatureObservation[]): ClassificationRuleResult => {
      if (features.length === 0) return noAssertion();
      return assertClassification(features[0].booleanValue);
    },
  })),
);

export function noAssertion(): ClassificationRuleResult {
  return Object.freeze({ kind: 'no-assertion' });
}

export function assertClassification(booleanValue: boolean): ClassificationRuleResult {
  if (typeof booleanValue !== 'boolean') fail('INVALID_RULE_RESULT', 'classification assertions must contain exact booleans');
  return Object.freeze({ kind: 'assert', booleanValue });
}

export function compilePerceptualClassificationModel(
  modelIdentity: string,
  facetDefinitions: readonly PerceptualFacetDefinition[],
  rules: readonly PerceptualClassificationRuleDefinition[],
  derivations: readonly ClassificationDerivation[],
): PerceptualClassificationModel {
  requireNonempty(modelIdentity, 'modelIdentity');
  const facets = facetDefinitions.map(validateFacet).sort(compareFacets);
  requireCanonical(facetDefinitions, facets, (candidate) => candidate.perceptualFacetId, 'facet definitions');
  const facetIds = new Set<PerceptualFacetId>();
  for (const definition of facets) {
    if (facetIds.has(definition.perceptualFacetId)) fail('INVALID_MODEL', `duplicate facet ${definition.perceptualFacetId}`);
    facetIds.add(definition.perceptualFacetId);
  }

  const derivationIds = new Set<string>();
  for (const derivation of derivations) {
    validateExactKeys(derivation, ['derivationFunctionId', 'derive'], 'classification derivation');
    requireNonempty(derivation.derivationFunctionId, 'derivationFunctionId');
    if (typeof derivation.derive !== 'function' || derivationIds.has(derivation.derivationFunctionId)) {
      fail('INVALID_MODEL', `invalid or duplicate derivation ${derivation.derivationFunctionId}`);
    }
    derivationIds.add(derivation.derivationFunctionId);
  }

  const canonicalRules = rules.map(validateRule).sort(compareRules);
  requireCanonical(rules, canonicalRules, (candidate) => candidate.outputPerceptualFacetId, 'classification rules');
  const ruleIds = new Set<string>();
  const authority = new Map<PerceptualFacetId, string>();
  for (const rule of canonicalRules) {
    if (ruleIds.has(rule.classificationRuleId)) fail('INVALID_MODEL', `duplicate rule ${rule.classificationRuleId}`);
    ruleIds.add(rule.classificationRuleId);
    if (!facetIds.has(rule.outputPerceptualFacetId)) fail('UNKNOWN_FACET', `unknown output facet ${rule.outputPerceptualFacetId}`);
    if (!derivationIds.has(rule.derivationFunctionId)) fail('UNKNOWN_DERIVATION', `unknown derivation ${rule.derivationFunctionId}`);
    if (authority.has(rule.outputPerceptualFacetId)) {
      fail('DUPLICATE_FACET_AUTHORITY', `multiple rules govern ${rule.outputPerceptualFacetId}`);
    }
    authority.set(rule.outputPerceptualFacetId, rule.classificationRuleId);
  }
  for (const facetId of facetIds) {
    if (!authority.has(facetId)) fail('MISSING_FACET_AUTHORITY', `no rule governs ${facetId}`);
  }

  return Object.freeze({
    modelIdentity,
    facetDefinitions: Object.freeze(facets.map((definition) => Object.freeze({ ...definition }))),
    rules: Object.freeze(canonicalRules.map(freezeRule)),
    derivations: Object.freeze(derivations.map((derivation) => Object.freeze({ ...derivation }))),
  });
}

export function classifyContinuant(
  model: PerceptualClassificationModel,
  request: ClassificationRequest,
  nextRuntimeId: bigint,
): CompiledPerceptualClassifications {
  if (nextRuntimeId < 0n) fail('INVALID_ALLOCATOR_STATE', 'nextRuntimeId must be nonnegative');
  validateModelShape(model);
  validateExactKeys(request, [
    'experienceId', 'observerId', 'perceptualReferentId', 'currentDetectionId', 'featureObservations',
    'occurredAt', 'transformationVersion',
  ], 'classification request');
  requireNonempty(request.experienceId, 'experienceId');
  requireNonempty(request.observerId, 'observerId');
  requireNonempty(request.transformationVersion, 'transformationVersion');
  validateContinuantId(request.perceptualReferentId, request.observerId);
  validateDetection(request.currentDetectionId, request.observerId);

  const features = request.featureObservations.map((feature) => validateFeature(feature, request)).sort(compareFeatures);
  requireCanonical(request.featureObservations, features, (candidate) => candidate.featureObservationId, 'feature observations');
  const featureIds = new Set<string>();
  const featureKinds = new Set<PerceptualFeatureId>();
  for (const feature of features) {
    if (featureIds.has(feature.featureObservationId) || featureKinds.has(feature.perceptualFeatureId)) {
      fail('INVALID_FEATURE_OBSERVATION', 'feature observations must be unique by identity and feature within one request');
    }
    featureIds.add(feature.featureObservationId);
    featureKinds.add(feature.perceptualFeatureId);
  }

  const derivations = new Map(model.derivations.map((derivation) => [derivation.derivationFunctionId, derivation]));
  const classifications: PerceptualClassificationEvidence[] = [];
  for (const rule of model.rules) {
    const inputs = features.filter((feature) => rule.permittedInputFeatureIds.includes(feature.perceptualFeatureId));
    const derivation = derivations.get(rule.derivationFunctionId);
    if (!derivation) fail('UNKNOWN_DERIVATION', `unknown derivation ${rule.derivationFunctionId}`);
    const result = derivation.derive(Object.freeze(inputs));
    validateRuleResult(result);
    if (result.kind === 'no-assertion') continue;
    if (inputs.length === 0) fail('INVALID_RULE_RESULT', 'an assertion requires explicit supporting feature evidence');
    if (result.booleanValue === false && !inputs.some((feature) => feature.booleanValue === false)) {
      fail('NEGATIVE_EVIDENCE_REQUIRED', 'classification false requires explicit negative feature evidence');
    }
    const supportingObservationIds = canonicalObservationUnion(inputs.flatMap((feature) => feature.supportingObservationIds));
    classifications.push(Object.freeze({
      classificationEvidenceId: nextRuntimeId + BigInt(classifications.length),
      experienceId: request.experienceId,
      observerId: request.observerId,
      perceptualReferentId: Object.freeze({ ...request.perceptualReferentId }),
      perceptualFacetId: rule.outputPerceptualFacetId,
      typedPerceivedValue: result.booleanValue,
      classificationRuleId: rule.classificationRuleId,
      supportingFeatureObservationIds: Object.freeze(inputs.map((feature) => feature.featureObservationId).sort(compareText)),
      supportingObservationIds,
      occurredAt: request.occurredAt,
      transformationVersion: request.transformationVersion,
    }));
  }
  validateExperienceClassifications(request.experienceId, classifications);
  return Object.freeze({
    classifications: Object.freeze(classifications),
    nextRuntimeId: nextRuntimeId + BigInt(classifications.length),
  });
}

export function validateExperienceClassifications(
  experienceId: string,
  classifications: readonly PerceptualClassificationEvidence[],
): void {
  requireNonempty(experienceId, 'experienceId');
  const occurrences = new Set<bigint>();
  const assertions = new Set<string>();
  for (const classification of classifications) {
    if (classification.experienceId !== experienceId) fail('DUPLICATE_CLASSIFICATION', 'classification belongs to another experience');
    if (occurrences.has(classification.classificationEvidenceId)) fail('DUPLICATE_CLASSIFICATION', 'duplicate classification occurrence ID');
    occurrences.add(classification.classificationEvidenceId);
    const signature = `${continuantKey(classification.perceptualReferentId)}\u0000${classification.perceptualFacetId}`;
    if (assertions.has(signature)) fail('DUPLICATE_CLASSIFICATION', 'duplicate referent/facet assertion in one experience');
    assertions.add(signature);
  }
}

/** Ordinal-free classification view used only for semantic/psychological opacity proofs. */
export function classificationSemanticView(
  classifications: readonly PerceptualClassificationEvidence[],
): readonly string[] {
  return Object.freeze(classifications.map((classification) =>
    `${continuantKey(classification.perceptualReferentId)}:${classification.perceptualFacetId}=${classification.typedPerceivedValue}`,
  ).sort(compareText));
}

export function assertClassificationEmissionTarget(target: ClassificationEmissionTarget): void {
  if (target !== 'semantic-experience-assembly') {
    fail('FORBIDDEN_EMISSION_TARGET', `classification cannot emit directly to ${target}`);
  }
}

function validateModelShape(model: PerceptualClassificationModel): void {
  compilePerceptualClassificationModel(model.modelIdentity, model.facetDefinitions, model.rules, model.derivations);
}

function validateFacet(definition: PerceptualFacetDefinition): PerceptualFacetDefinition {
  validateExactKeys(definition, [
    'perceptualFacetId', 'perceivedValueType', 'observationDomainValidatorId', 'definitionVersion',
  ], 'perceptual facet definition');
  if (!isFacetId(definition.perceptualFacetId)) fail('UNKNOWN_FACET', `unknown perceptual facet ${String(definition.perceptualFacetId)}`);
  if (definition.perceivedValueType !== 'boolean') fail('INVALID_MODEL', 'version 0.1 facet values must be boolean');
  requireNonempty(definition.observationDomainValidatorId, 'observationDomainValidatorId');
  requireNonempty(definition.definitionVersion, 'definitionVersion');
  return definition;
}

function validateRule(rule: PerceptualClassificationRuleDefinition): PerceptualClassificationRuleDefinition {
  validateExactKeys(rule, [
    'classificationRuleId', 'permittedInputFeatureIds', 'outputPerceptualFacetId', 'derivationFunctionId', 'ruleVersion',
  ], 'classification rule');
  requireNonempty(rule.classificationRuleId, 'classificationRuleId');
  requireNonempty(rule.derivationFunctionId, 'derivationFunctionId');
  requireNonempty(rule.ruleVersion, 'ruleVersion');
  if (!isFacetId(rule.outputPerceptualFacetId)) fail('UNKNOWN_FACET', `unknown output facet ${String(rule.outputPerceptualFacetId)}`);
  if (rule.permittedInputFeatureIds.length === 0) fail('INVALID_MODEL', 'classification rules require an input feature schema');
  let prior = '';
  for (const featureId of rule.permittedInputFeatureIds) {
    if (!isFeatureId(featureId)) fail('UNKNOWN_FEATURE', `unknown feature ${String(featureId)}`);
    if (featureId <= prior) fail('INVALID_MODEL', 'rule input features must be unique and canonical');
    prior = featureId;
  }
  return rule;
}

function validateFeature(
  feature: PermittedPerceptualFeatureObservation,
  request: ClassificationRequest,
): PermittedPerceptualFeatureObservation {
  validateExactKeys(feature, [
    'featureObservationId', 'observerId', 'currentDetectionId', 'perceptualReferentId', 'perceptualFeatureId',
    'booleanValue', 'observationChannelId', 'supportingObservationIds', 'occurredAt', 'transformationVersion',
  ], 'feature observation');
  requireNonempty(feature.featureObservationId, 'featureObservationId');
  requireNonempty(feature.observationChannelId, 'observationChannelId');
  requireNonempty(feature.transformationVersion, 'transformationVersion');
  if (!isFeatureId(feature.perceptualFeatureId)) fail('UNKNOWN_FEATURE', `unknown feature ${String(feature.perceptualFeatureId)}`);
  if (typeof feature.booleanValue !== 'boolean') fail('INVALID_FEATURE_OBSERVATION', 'feature value must be an exact boolean');
  if (feature.observerId !== request.observerId) fail('CROSS_OBSERVER_REFERENCE', 'feature belongs to another observer');
  validateDetection(feature.currentDetectionId, request.observerId);
  if (feature.currentDetectionId.detectionId !== request.currentDetectionId.detectionId) {
    fail('INVALID_FEATURE_OBSERVATION', 'feature belongs to another detection context');
  }
  validateContinuantId(feature.perceptualReferentId, request.observerId);
  if (continuantKey(feature.perceptualReferentId) !== continuantKey(request.perceptualReferentId)) {
    fail('INVALID_FEATURE_OBSERVATION', 'feature belongs to another continuant-file');
  }
  validateObservations(request.observerId, feature.supportingObservationIds);
  return feature;
}

function validateDetection(detection: CurrentDetectionId, observerId: string): void {
  validateExactKeys(detection, ['observerId', 'detectionId'], 'current detection');
  if (detection.observerId !== observerId) fail('CROSS_OBSERVER_REFERENCE', 'detection belongs to another observer');
  requireNonempty(detection.detectionId, 'detectionId');
}

function validateContinuantId(referent: PerceptualReferentId, observerId: string): void {
  const keys = Object.keys(referent).sort(compareText);
  if (keys.length !== 2 || keys[0] !== 'observerId' || keys[1] !== 'observerTrackSequence') {
    fail('CARRIER_TYPE_MISMATCH', 'classification requires a perceptual continuant-file, not an event-file or truth referent');
  }
  if (referent.observerId !== observerId) fail('CROSS_OBSERVER_REFERENCE', 'continuant-file belongs to another observer');
  if (typeof referent.observerTrackSequence !== 'bigint' || referent.observerTrackSequence < 0n) {
    fail('CARRIER_TYPE_MISMATCH', 'classification requires a valid perceptual continuant-file identity');
  }
}

function validateRuleResult(result: ClassificationRuleResult): void {
  if (!result || typeof result !== 'object') fail('INVALID_RULE_RESULT', 'derivation returned no typed result');
  validateExactKeys(result, result.kind === 'assert' ? ['kind', 'booleanValue'] : ['kind'], 'classification rule result');
  if (result.kind === 'no-assertion') return;
  if (result.kind !== 'assert' || typeof result.booleanValue !== 'boolean') {
    fail('INVALID_RULE_RESULT', 'derivation result must be NoAssertion or Assert(BooleanValue)');
  }
}

function validateObservations(observerId: string, observations: readonly SupportingObservationId[]): void {
  if (observations.length === 0) fail('INVALID_FEATURE_OBSERVATION', 'feature observation requires permitted support');
  let prior = '';
  for (const observation of observations) {
    validateExactKeys(observation, ['observerId', 'observationId'], 'supporting observation');
    if (observation.observerId !== observerId) fail('CROSS_OBSERVER_REFERENCE', 'supporting observation belongs to another observer');
    if (!observation.observationId || observation.observationId <= prior) {
      fail('INVALID_FEATURE_OBSERVATION', 'supporting observations must be nonempty, unique, and canonical');
    }
    prior = observation.observationId;
  }
}

function canonicalObservationUnion(observations: readonly SupportingObservationId[]): readonly SupportingObservationId[] {
  const byKey = new Map<string, SupportingObservationId>();
  for (const observation of observations) byKey.set(`${observation.observerId}\u0000${observation.observationId}`, observation);
  return Object.freeze([...byKey.values()]
    .sort((left, right) => compareText(left.observationId, right.observationId))
    .map((observation) => Object.freeze({ ...observation })));
}

function validateExactKeys(value: object, allowed: readonly string[], description: string): void {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(value)) {
    if (!allowedSet.has(key)) {
      const truthLike = /truth|world|semanticReferent|eventBinding|recognition|appraisal|pressure|llm|prose/i.test(key);
      fail(truthLike ? 'FORBIDDEN_TRUTH_FIELD' : 'INVALID_MODEL', `${description} contains forbidden field ${key}`);
    }
  }
}

function requireCanonical<T>(
  supplied: readonly T[],
  canonical: readonly T[],
  key: (candidate: T) => string,
  description: string,
): void {
  if (supplied.length !== canonical.length || supplied.some((candidate, index) => key(candidate) !== key(canonical[index]))) {
    fail('INVALID_MODEL', `${description} must be in canonical order`);
  }
}

function facet(perceptualFacetId: PerceptualFacetId): PerceptualFacetDefinition {
  return Object.freeze({
    perceptualFacetId,
    perceivedValueType: 'boolean',
    observationDomainValidatorId: FIXTURE_DOMAIN,
    definitionVersion: 'perceptual-facet/0.1-candidate',
  });
}

function directRule(
  classificationRuleId: string,
  featureId: PerceptualFeatureId,
  outputPerceptualFacetId: PerceptualFacetId,
): PerceptualClassificationRuleDefinition {
  return Object.freeze({
    classificationRuleId,
    permittedInputFeatureIds: Object.freeze([featureId]),
    outputPerceptualFacetId,
    derivationFunctionId: `derivation/${classificationRuleId}`,
    ruleVersion: 'classification-rule/0.1-candidate',
  });
}

function freezeRule(rule: PerceptualClassificationRuleDefinition): PerceptualClassificationRuleDefinition {
  return Object.freeze({ ...rule, permittedInputFeatureIds: Object.freeze([...rule.permittedInputFeatureIds]) });
}

function compareFacets(left: PerceptualFacetDefinition, right: PerceptualFacetDefinition): number {
  return compareText(left.perceptualFacetId, right.perceptualFacetId);
}

function compareRules(left: PerceptualClassificationRuleDefinition, right: PerceptualClassificationRuleDefinition): number {
  return compareText(left.outputPerceptualFacetId, right.outputPerceptualFacetId)
    || compareText(left.classificationRuleId, right.classificationRuleId);
}

function compareFeatures(
  left: PermittedPerceptualFeatureObservation,
  right: PermittedPerceptualFeatureObservation,
): number {
  return compareText(left.featureObservationId, right.featureObservationId);
}

function continuantKey(referent: PerceptualReferentId): string {
  return `${referent.observerId}:${referent.observerTrackSequence}`;
}

function isFacetId(value: unknown): value is PerceptualFacetId {
  return typeof value === 'string' && Object.values(PerceptualFacetId).includes(value as PerceptualFacetId);
}

function isFeatureId(value: unknown): value is PerceptualFeatureId {
  return typeof value === 'string' && Object.values(PerceptualFeatureId).includes(value as PerceptualFeatureId);
}

function requireNonempty(value: string, description: string): void {
  if (!value) fail('INVALID_MODEL', `${description} must be nonempty`);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function fail(code: PerceptualClassificationFailureCode, message: string): never {
  throw new PerceptualClassificationContractError(code, message);
}
