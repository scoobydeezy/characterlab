import type {
  CurrentEventDetectionId,
  PerceptualEventReferentId,
  PerceptualReferentId,
  SupportingObservationId,
} from './perceptualEventFiles';

export const PERCEPTUAL_EVENT_CLASSIFICATION_CONTRACT_VERSION = 'semantic-binding/0.1-candidate#SEM-001E' as const;

export const PerceptualEventFacetId = {
  AppearsRepetitiveMotionLike: 'perceptual-event-facet/appears-repetitive-motion-like',
  AppearsCoupledMultiContinuantMotionLike: 'perceptual-event-facet/appears-coupled-multi-continuant-motion-like',
  AppearsRopeSkippingPatternLike: 'perceptual-event-facet/appears-rope-skipping-pattern-like',
} as const;
export type PerceptualEventFacetId = typeof PerceptualEventFacetId[keyof typeof PerceptualEventFacetId];

export const PerceptualEventFeatureId = {
  ObservedRepeatedMotionPattern: 'perceptual-event-feature/observed-repeated-motion-pattern',
  ObservedCoupledMotionAcrossContinuants: 'perceptual-event-feature/observed-coupled-motion-across-continuants',
  ObservedRepeatedVerticalBodyMotion: 'perceptual-event-feature/observed-repeated-vertical-body-motion',
  ObservedCyclicFlexibleContinuantArc: 'perceptual-event-feature/observed-cyclic-flexible-continuant-arc',
  ObservedBodyContinuantPassageCoordination: 'perceptual-event-feature/observed-body-continuant-passage-coordination',
} as const;
export type PerceptualEventFeatureId = typeof PerceptualEventFeatureId[keyof typeof PerceptualEventFeatureId];

export interface PerceptualEventFacetDefinition {
  readonly perceptualEventFacetId: PerceptualEventFacetId;
  readonly perceivedValueType: 'boolean';
  readonly observationDomainValidatorId: string;
  readonly definitionVersion: string;
}

export interface PermittedPerceptualEventFeatureObservation {
  /** Allocated typed `EventFeatureObservationId` occurrence (namespace 1102). */
  readonly eventFeatureObservationId: bigint;
  readonly observerId: string;
  readonly currentEventDetectionId: CurrentEventDetectionId;
  readonly perceptualEventReferentId: PerceptualEventReferentId;
  readonly perceptualEventFeatureId: PerceptualEventFeatureId;
  readonly booleanValue: boolean;
  readonly observationChannelId: string;
  readonly supportingPerceptualReferentIds: readonly PerceptualReferentId[];
  readonly supportingObservationIds: readonly SupportingObservationId[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

export interface PerceptualEventClassificationRuleDefinition {
  readonly eventClassificationRuleId: string;
  readonly permittedInputEventFeatureIds: readonly PerceptualEventFeatureId[];
  readonly outputPerceptualEventFacetId: PerceptualEventFacetId;
  readonly derivationFunctionId: string;
  readonly ruleVersion: string;
}

export type EventClassificationRuleResult =
  | { readonly kind: 'no-assertion' }
  | { readonly kind: 'assert'; readonly booleanValue: boolean };

export interface EventClassificationDerivation {
  readonly derivationFunctionId: string;
  derive(features: readonly PermittedPerceptualEventFeatureObservation[]): EventClassificationRuleResult;
}

export interface PerceptualEventClassificationModel {
  readonly modelIdentity: string;
  readonly facetDefinitions: readonly PerceptualEventFacetDefinition[];
  readonly rules: readonly PerceptualEventClassificationRuleDefinition[];
  readonly derivations: readonly EventClassificationDerivation[];
}

export interface EventClassificationRequest {
  readonly experienceId: bigint;
  readonly observerId: string;
  readonly perceptualEventReferentId: PerceptualEventReferentId;
  readonly currentEventDetectionId: CurrentEventDetectionId;
  readonly featureObservations: readonly PermittedPerceptualEventFeatureObservation[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

export interface PerceptualEventClassificationEvidence {
  readonly eventClassificationEvidenceId: bigint;
  readonly experienceId: bigint;
  readonly observerId: string;
  readonly perceptualEventReferentId: PerceptualEventReferentId;
  readonly perceptualEventFacetId: PerceptualEventFacetId;
  readonly typedPerceivedValue: boolean;
  readonly eventClassificationRuleId: string;
  readonly supportingEventFeatureObservationIds: readonly bigint[];
  readonly supportingPerceptualReferentIds: readonly PerceptualReferentId[];
  readonly supportingObservationIds: readonly SupportingObservationId[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

export interface CompiledPerceptualEventClassifications {
  readonly classifications: readonly PerceptualEventClassificationEvidence[];
  readonly nextRuntimeId: bigint;
}

export type EventClassificationEmissionTarget =
  | 'semantic-experience-assembly' | 'action-schema-recognition' | 'recognition-hypothesis'
  | 'causal-role' | 'appraisal' | 'pressure' | 'reason' | 'option' | 'world-truth';

export type PerceptualEventClassificationFailureCode =
  | 'INVALID_MODEL' | 'UNKNOWN_FACET' | 'UNKNOWN_FEATURE' | 'MISSING_FACET_AUTHORITY'
  | 'DUPLICATE_FACET_AUTHORITY' | 'UNKNOWN_DERIVATION' | 'INVALID_FEATURE_OBSERVATION'
  | 'INVALID_RULE_RESULT' | 'NEGATIVE_EVIDENCE_REQUIRED' | 'CROSS_OBSERVER_REFERENCE'
  | 'CARRIER_TYPE_MISMATCH' | 'FORBIDDEN_TRUTH_FIELD' | 'DUPLICATE_CLASSIFICATION'
  | 'INVALID_ALLOCATOR_STATE' | 'FORBIDDEN_EMISSION_TARGET';

export class PerceptualEventClassificationContractError extends Error {
  constructor(readonly code: PerceptualEventClassificationFailureCode, message: string) {
    super(message);
    this.name = 'PerceptualEventClassificationContractError';
  }
}

const FIXTURE_DOMAIN = 'observation-domain/finite-event-pattern-fixture';

export const INITIAL_PERCEPTUAL_EVENT_FACET_DEFINITIONS: readonly PerceptualEventFacetDefinition[] = Object.freeze([
  facet(PerceptualEventFacetId.AppearsRepetitiveMotionLike),
  facet(PerceptualEventFacetId.AppearsCoupledMultiContinuantMotionLike),
  facet(PerceptualEventFacetId.AppearsRopeSkippingPatternLike),
].sort(compareFacets));

export const INITIAL_PERCEPTUAL_EVENT_CLASSIFICATION_RULES: readonly PerceptualEventClassificationRuleDefinition[] = Object.freeze([
  directRule('event-classification-rule/repeated-motion', PerceptualEventFeatureId.ObservedRepeatedMotionPattern, PerceptualEventFacetId.AppearsRepetitiveMotionLike),
  directRule('event-classification-rule/coupled-motion', PerceptualEventFeatureId.ObservedCoupledMotionAcrossContinuants, PerceptualEventFacetId.AppearsCoupledMultiContinuantMotionLike),
  Object.freeze({
    eventClassificationRuleId: 'event-classification-rule/rope-skipping-pattern-conjunction',
    permittedInputEventFeatureIds: Object.freeze([
      PerceptualEventFeatureId.ObservedBodyContinuantPassageCoordination,
      PerceptualEventFeatureId.ObservedCyclicFlexibleContinuantArc,
      PerceptualEventFeatureId.ObservedRepeatedVerticalBodyMotion,
    ].sort(compareText)),
    outputPerceptualEventFacetId: PerceptualEventFacetId.AppearsRopeSkippingPatternLike,
    derivationFunctionId: 'derivation/event-rope-skipping-pattern-required-conjunction',
    ruleVersion: 'event-classification-rule/0.1-candidate',
  }),
].sort(compareRules));

export const INITIAL_EVENT_CLASSIFICATION_DERIVATIONS: readonly EventClassificationDerivation[] = Object.freeze([
  Object.freeze({
    derivationFunctionId: 'derivation/event-classification-rule/repeated-motion',
    derive: directDerivation,
  }),
  Object.freeze({
    derivationFunctionId: 'derivation/event-classification-rule/coupled-motion',
    derive: directDerivation,
  }),
  Object.freeze({
    derivationFunctionId: 'derivation/event-rope-skipping-pattern-required-conjunction',
    derive: (features: readonly PermittedPerceptualEventFeatureObservation[]): EventClassificationRuleResult => {
      if (features.some((feature) => feature.booleanValue === false)) return assertEventClassification(false);
      return features.length === 3 ? assertEventClassification(true) : noEventClassificationAssertion();
    },
  }),
]);

export function noEventClassificationAssertion(): EventClassificationRuleResult {
  return Object.freeze({ kind: 'no-assertion' });
}

export function assertEventClassification(booleanValue: boolean): EventClassificationRuleResult {
  if (typeof booleanValue !== 'boolean') fail('INVALID_RULE_RESULT', 'event classification assertions require exact booleans');
  return Object.freeze({ kind: 'assert', booleanValue });
}

export function compilePerceptualEventClassificationModel(
  modelIdentity: string,
  facetDefinitions: readonly PerceptualEventFacetDefinition[],
  rules: readonly PerceptualEventClassificationRuleDefinition[],
  derivations: readonly EventClassificationDerivation[],
): PerceptualEventClassificationModel {
  requireNonempty(modelIdentity, 'modelIdentity');
  const facets = facetDefinitions.map(validateFacet).sort(compareFacets);
  requireCanonical(facetDefinitions, facets, (value) => value.perceptualEventFacetId, 'event facet definitions');
  const facetIds = new Set<PerceptualEventFacetId>();
  for (const definition of facets) {
    if (facetIds.has(definition.perceptualEventFacetId)) fail('INVALID_MODEL', `duplicate event facet ${definition.perceptualEventFacetId}`);
    facetIds.add(definition.perceptualEventFacetId);
  }
  const derivationIds = new Set<string>();
  for (const derivation of derivations) {
    exactKeys(derivation, ['derivationFunctionId', 'derive'], 'event-classification derivation');
    requireNonempty(derivation.derivationFunctionId, 'derivationFunctionId');
    if (typeof derivation.derive !== 'function' || derivationIds.has(derivation.derivationFunctionId)) fail('INVALID_MODEL', 'invalid or duplicate derivation');
    derivationIds.add(derivation.derivationFunctionId);
  }
  const canonicalRules = rules.map(validateRule).sort(compareRules);
  requireCanonical(rules, canonicalRules, (value) => `${value.outputPerceptualEventFacetId}\0${value.eventClassificationRuleId}`, 'event-classification rules');
  const authority = new Map<PerceptualEventFacetId, string>();
  const ruleIds = new Set<string>();
  for (const rule of canonicalRules) {
    if (ruleIds.has(rule.eventClassificationRuleId)) fail('INVALID_MODEL', 'duplicate event-classification rule identity');
    ruleIds.add(rule.eventClassificationRuleId);
    if (!facetIds.has(rule.outputPerceptualEventFacetId)) fail('UNKNOWN_FACET', 'rule names an unknown event facet');
    if (!derivationIds.has(rule.derivationFunctionId)) fail('UNKNOWN_DERIVATION', `unknown derivation ${rule.derivationFunctionId}`);
    if (authority.has(rule.outputPerceptualEventFacetId)) fail('DUPLICATE_FACET_AUTHORITY', `multiple rules govern ${rule.outputPerceptualEventFacetId}`);
    authority.set(rule.outputPerceptualEventFacetId, rule.eventClassificationRuleId);
  }
  for (const facetId of facetIds) if (!authority.has(facetId)) fail('MISSING_FACET_AUTHORITY', `no rule governs ${facetId}`);
  return Object.freeze({
    modelIdentity,
    facetDefinitions: Object.freeze(facets.map((value) => Object.freeze({ ...value }))),
    rules: Object.freeze(canonicalRules.map((value) => Object.freeze({ ...value, permittedInputEventFeatureIds: Object.freeze([...value.permittedInputEventFeatureIds]) }))),
    derivations: Object.freeze(derivations.map((value) => Object.freeze({ ...value }))),
  });
}

export function classifyPerceptualEvent(
  model: PerceptualEventClassificationModel,
  request: EventClassificationRequest,
  nextRuntimeId: bigint,
): CompiledPerceptualEventClassifications {
  if (nextRuntimeId < 0n) fail('INVALID_ALLOCATOR_STATE', 'nextRuntimeId must be nonnegative');
  compilePerceptualEventClassificationModel(model.modelIdentity, model.facetDefinitions, model.rules, model.derivations);
  exactKeys(request, ['experienceId', 'observerId', 'perceptualEventReferentId', 'currentEventDetectionId', 'featureObservations', 'occurredAt', 'transformationVersion'], 'event-classification request');
  if (request.experienceId < 0n) fail('INVALID_ALLOCATOR_STATE', 'ExperienceId must be a nonnegative allocated occurrence');
  requireNonempty(request.observerId, 'observerId');
  requireNonempty(request.transformationVersion, 'transformationVersion');
  validateEventId(request.perceptualEventReferentId, request.observerId);
  validateDetection(request.currentEventDetectionId, request.observerId);
  const features = request.featureObservations.map((value) => validateFeature(value, request)).sort(compareFeatures);
  requireCanonical(request.featureObservations, features, (value) => String(value.eventFeatureObservationId), 'event-feature observations');
  const occurrenceIds = new Set<bigint>();
  const featureIds = new Set<PerceptualEventFeatureId>();
  for (const feature of features) {
    if (occurrenceIds.has(feature.eventFeatureObservationId) || featureIds.has(feature.perceptualEventFeatureId)) fail('INVALID_FEATURE_OBSERVATION', 'event features must be unique by identity and predicate within a request');
    occurrenceIds.add(feature.eventFeatureObservationId);
    featureIds.add(feature.perceptualEventFeatureId);
  }
  const derivations = new Map(model.derivations.map((value) => [value.derivationFunctionId, value]));
  const classifications: PerceptualEventClassificationEvidence[] = [];
  for (const rule of model.rules) {
    const inputs = features.filter((value) => rule.permittedInputEventFeatureIds.includes(value.perceptualEventFeatureId));
    const derivation = derivations.get(rule.derivationFunctionId);
    if (!derivation) fail('UNKNOWN_DERIVATION', 'registered derivation disappeared');
    const result = derivation.derive(Object.freeze(inputs));
    validateResult(result);
    if (result.kind === 'no-assertion') continue;
    if (inputs.length === 0) fail('INVALID_RULE_RESULT', 'assertion requires explicit feature evidence');
    if (!result.booleanValue && !inputs.some((value) => !value.booleanValue)) fail('NEGATIVE_EVIDENCE_REQUIRED', 'false classification requires explicit negative evidence');
    classifications.push(Object.freeze({
      eventClassificationEvidenceId: nextRuntimeId + BigInt(classifications.length),
      experienceId: request.experienceId,
      observerId: request.observerId,
      perceptualEventReferentId: freezeEventId(request.perceptualEventReferentId),
      perceptualEventFacetId: rule.outputPerceptualEventFacetId,
      typedPerceivedValue: result.booleanValue,
      eventClassificationRuleId: rule.eventClassificationRuleId,
      supportingEventFeatureObservationIds: Object.freeze(inputs.map((value) => value.eventFeatureObservationId).sort(compareOrdinal)),
      supportingPerceptualReferentIds: unionContinuants(inputs.flatMap((value) => value.supportingPerceptualReferentIds)),
      supportingObservationIds: unionObservations(inputs.flatMap((value) => value.supportingObservationIds)),
      occurredAt: request.occurredAt,
      transformationVersion: request.transformationVersion,
    }));
  }
  validateExperienceEventClassifications(request.experienceId, classifications);
  return Object.freeze({ classifications: Object.freeze(classifications), nextRuntimeId: nextRuntimeId + BigInt(classifications.length) });
}

export function validateExperienceEventClassifications(experienceId: bigint, classifications: readonly PerceptualEventClassificationEvidence[]): void {
  if (experienceId < 0n) fail('INVALID_ALLOCATOR_STATE', 'ExperienceId must be a nonnegative allocated occurrence');
  const ids = new Set<bigint>();
  const assertions = new Set<string>();
  for (const value of classifications) {
    if (value.experienceId !== experienceId) fail('DUPLICATE_CLASSIFICATION', 'event classification belongs to another experience');
    if (ids.has(value.eventClassificationEvidenceId)) fail('DUPLICATE_CLASSIFICATION', 'duplicate event-classification evidence identity');
    ids.add(value.eventClassificationEvidenceId);
    const signature = `${eventKey(value.perceptualEventReferentId)}\0${value.perceptualEventFacetId}`;
    if (assertions.has(signature)) fail('DUPLICATE_CLASSIFICATION', 'duplicate event-file/facet assertion in one experience');
    assertions.add(signature);
  }
}

export function eventClassificationSemanticView(classifications: readonly PerceptualEventClassificationEvidence[]): readonly string[] {
  return Object.freeze(classifications.map((value) => `${eventKey(value.perceptualEventReferentId)}:${value.perceptualEventFacetId}=${value.typedPerceivedValue}`).sort(compareText));
}

export function assertEventClassificationEmissionTarget(target: EventClassificationEmissionTarget): void {
  if (target !== 'semantic-experience-assembly') fail('FORBIDDEN_EMISSION_TARGET', `event classification cannot emit directly to ${target}`);
}

function directDerivation(features: readonly PermittedPerceptualEventFeatureObservation[]): EventClassificationRuleResult {
  return features.length === 0 ? noEventClassificationAssertion() : assertEventClassification(features[0].booleanValue);
}

function facet(perceptualEventFacetId: PerceptualEventFacetId): PerceptualEventFacetDefinition {
  return Object.freeze({ perceptualEventFacetId, perceivedValueType: 'boolean', observationDomainValidatorId: FIXTURE_DOMAIN, definitionVersion: 'perceptual-event-facet/0.1-candidate' });
}

function directRule(eventClassificationRuleId: string, featureId: PerceptualEventFeatureId, outputPerceptualEventFacetId: PerceptualEventFacetId): PerceptualEventClassificationRuleDefinition {
  return Object.freeze({ eventClassificationRuleId, permittedInputEventFeatureIds: Object.freeze([featureId]), outputPerceptualEventFacetId, derivationFunctionId: `derivation/${eventClassificationRuleId}`, ruleVersion: 'event-classification-rule/0.1-candidate' });
}

function validateFacet(value: PerceptualEventFacetDefinition): PerceptualEventFacetDefinition {
  exactKeys(value, ['perceptualEventFacetId', 'perceivedValueType', 'observationDomainValidatorId', 'definitionVersion'], 'event facet definition');
  if (!isFacetId(value.perceptualEventFacetId)) fail('UNKNOWN_FACET', 'unknown event facet');
  if (value.perceivedValueType !== 'boolean') fail('INVALID_MODEL', 'event facets require exact booleans');
  requireNonempty(value.observationDomainValidatorId, 'observationDomainValidatorId');
  requireNonempty(value.definitionVersion, 'definitionVersion');
  return value;
}

function validateRule(value: PerceptualEventClassificationRuleDefinition): PerceptualEventClassificationRuleDefinition {
  exactKeys(value, ['eventClassificationRuleId', 'permittedInputEventFeatureIds', 'outputPerceptualEventFacetId', 'derivationFunctionId', 'ruleVersion'], 'event-classification rule');
  requireNonempty(value.eventClassificationRuleId, 'eventClassificationRuleId');
  requireNonempty(value.derivationFunctionId, 'derivationFunctionId');
  requireNonempty(value.ruleVersion, 'ruleVersion');
  if (!isFacetId(value.outputPerceptualEventFacetId)) fail('UNKNOWN_FACET', 'unknown event facet');
  if (value.permittedInputEventFeatureIds.length === 0) fail('INVALID_MODEL', 'event-classification rules need inputs');
  let prior = '';
  for (const featureId of value.permittedInputEventFeatureIds) {
    if (!isFeatureId(featureId)) fail('UNKNOWN_FEATURE', 'unknown event feature');
    if (featureId <= prior) fail('INVALID_MODEL', 'rule inputs must be unique and canonical');
    prior = featureId;
  }
  return value;
}

function validateFeature(value: PermittedPerceptualEventFeatureObservation, request: EventClassificationRequest): PermittedPerceptualEventFeatureObservation {
  exactKeys(value, ['eventFeatureObservationId', 'observerId', 'currentEventDetectionId', 'perceptualEventReferentId', 'perceptualEventFeatureId', 'booleanValue', 'observationChannelId', 'supportingPerceptualReferentIds', 'supportingObservationIds', 'occurredAt', 'transformationVersion'], 'event-feature observation');
  if (typeof value.eventFeatureObservationId !== 'bigint' || value.eventFeatureObservationId < 0n) {
    fail('INVALID_FEATURE_OBSERVATION', 'eventFeatureObservationId must be a nonnegative allocated occurrence');
  }
  requireNonempty(value.observationChannelId, 'observationChannelId');
  requireNonempty(value.transformationVersion, 'transformationVersion');
  if (!isFeatureId(value.perceptualEventFeatureId)) fail('UNKNOWN_FEATURE', 'unknown event feature');
  if (typeof value.booleanValue !== 'boolean') fail('INVALID_FEATURE_OBSERVATION', 'event feature requires exact boolean');
  if (value.observerId !== request.observerId) fail('CROSS_OBSERVER_REFERENCE', 'event feature belongs to another observer');
  validateDetection(value.currentEventDetectionId, request.observerId);
  if (value.currentEventDetectionId.eventDetectionOccurrenceId !== request.currentEventDetectionId.eventDetectionOccurrenceId) fail('INVALID_FEATURE_OBSERVATION', 'event feature belongs to another observation window');
  validateEventId(value.perceptualEventReferentId, request.observerId);
  if (eventKey(value.perceptualEventReferentId) !== eventKey(request.perceptualEventReferentId)) fail('INVALID_FEATURE_OBSERVATION', 'event feature belongs to another event-file');
  validateContinuants(value.supportingPerceptualReferentIds, request.observerId);
  validateObservations(value.supportingObservationIds, request.observerId);
  return value;
}

function validateDetection(value: CurrentEventDetectionId, observerId: string): void {
  exactKeys(value, ['observerId', 'eventDetectionOccurrenceId'], 'current event detection');
  if (value.observerId !== observerId) fail('CROSS_OBSERVER_REFERENCE', 'event detection belongs to another observer');
  if (typeof value.eventDetectionOccurrenceId !== 'bigint' || value.eventDetectionOccurrenceId < 0n) {
    fail('INVALID_FEATURE_OBSERVATION', 'eventDetectionOccurrenceId must be a nonnegative allocated occurrence');
  }
}

function validateEventId(value: PerceptualEventReferentId, observerId: string): void {
  const keys = Object.keys(value).sort(compareText);
  if (keys.length !== 2 || keys[0] !== 'observerEventSequence' || keys[1] !== 'observerId') fail('CARRIER_TYPE_MISMATCH', 'event classification requires an event-file carrier');
  if (value.observerId !== observerId) fail('CROSS_OBSERVER_REFERENCE', 'event-file belongs to another observer');
  if (typeof value.observerEventSequence !== 'bigint' || value.observerEventSequence < 0n) fail('CARRIER_TYPE_MISMATCH', 'invalid event-file identity');
}

function validateContinuants(values: readonly PerceptualReferentId[], observerId: string): void {
  let prior = -1n;
  for (const value of values) {
    if (value.observerId !== observerId) fail('CROSS_OBSERVER_REFERENCE', 'supporting continuant belongs to another observer');
    if (typeof value.observerTrackSequence !== 'bigint' || value.observerTrackSequence < 0n || value.observerTrackSequence <= prior) fail('INVALID_FEATURE_OBSERVATION', 'supporting continuants must be valid, unique, and canonical');
    prior = value.observerTrackSequence;
  }
}

function validateObservations(values: readonly SupportingObservationId[], observerId: string): void {
  if (values.length === 0) fail('INVALID_FEATURE_OBSERVATION', 'event feature requires supporting observations');
  let prior: bigint | undefined;
  for (const value of values) {
    if (value.observerId !== observerId) fail('CROSS_OBSERVER_REFERENCE', 'supporting observation belongs to another observer');
    if (typeof value.observationId !== 'bigint' || value.observationId < 0n
      || (prior !== undefined && value.observationId <= prior)) {
      fail('INVALID_FEATURE_OBSERVATION', 'supporting observations must be well-formed, unique, and canonical');
    }
    prior = value.observationId;
  }
}

function validateResult(value: EventClassificationRuleResult): void {
  if (!value || typeof value !== 'object') fail('INVALID_RULE_RESULT', 'derivation returned no typed result');
  exactKeys(value, value.kind === 'assert' ? ['kind', 'booleanValue'] : ['kind'], 'event-classification result');
  if (value.kind === 'no-assertion') return;
  if (value.kind !== 'assert' || typeof value.booleanValue !== 'boolean') fail('INVALID_RULE_RESULT', 'result must be NoAssertion or Assert(BooleanValue)');
}

function unionContinuants(values: readonly PerceptualReferentId[]): readonly PerceptualReferentId[] {
  const byKey = new Map(values.map((value) => [`${value.observerId}\0${value.observerTrackSequence}`, value]));
  return Object.freeze([...byKey.values()].sort((a, b) => a.observerTrackSequence < b.observerTrackSequence ? -1 : a.observerTrackSequence > b.observerTrackSequence ? 1 : 0).map((value) => Object.freeze({ ...value })));
}

function unionObservations(values: readonly SupportingObservationId[]): readonly SupportingObservationId[] {
  const byKey = new Map(values.map((value) => [`${value.observerId}\0${value.observationId}`, value]));
  return Object.freeze([...byKey.values()].sort((a, b) => a.observationId < b.observationId ? -1 : a.observationId > b.observationId ? 1 : 0).map((value) => Object.freeze({ ...value })));
}

function exactKeys(value: object, allowed: readonly string[], description: string): void {
  const set = new Set(allowed);
  for (const key of Object.keys(value)) if (!set.has(key)) {
    const forbidden = /truth|world|semanticAction|semanticReferent|eventType|actionSchema|recognition|role|llm|prose/i.test(key);
    fail(forbidden ? 'FORBIDDEN_TRUTH_FIELD' : 'INVALID_MODEL', `${description} contains forbidden field ${key}`);
  }
}

function requireCanonical<T>(supplied: readonly T[], canonical: readonly T[], key: (value: T) => string, description: string): void {
  if (supplied.length !== canonical.length || supplied.some((value, index) => key(value) !== key(canonical[index]))) fail('INVALID_MODEL', `${description} must be canonical`);
}

function freezeEventId(value: PerceptualEventReferentId): PerceptualEventReferentId { return Object.freeze({ ...value }); }
function eventKey(value: PerceptualEventReferentId): string { return `${value.observerId}:${value.observerEventSequence}`; }
function compareFacets(a: PerceptualEventFacetDefinition, b: PerceptualEventFacetDefinition): number { return compareText(a.perceptualEventFacetId, b.perceptualEventFacetId); }
function compareRules(a: PerceptualEventClassificationRuleDefinition, b: PerceptualEventClassificationRuleDefinition): number { return compareText(a.outputPerceptualEventFacetId, b.outputPerceptualEventFacetId) || compareText(a.eventClassificationRuleId, b.eventClassificationRuleId); }
function compareFeatures(a: PermittedPerceptualEventFeatureObservation, b: PermittedPerceptualEventFeatureObservation): number { return compareOrdinal(a.eventFeatureObservationId, b.eventFeatureObservationId); }
function compareText(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function isFacetId(value: unknown): value is PerceptualEventFacetId { return typeof value === 'string' && Object.values(PerceptualEventFacetId).includes(value as PerceptualEventFacetId); }
function isFeatureId(value: unknown): value is PerceptualEventFeatureId { return typeof value === 'string' && Object.values(PerceptualEventFeatureId).includes(value as PerceptualEventFeatureId); }
function requireNonempty(value: string, description: string): void { if (!value) fail('INVALID_MODEL', `${description} must be nonempty`); }
function fail(code: PerceptualEventClassificationFailureCode, message: string): never { throw new PerceptualEventClassificationContractError(code, message); }

/** Numeric ordering over opaque allocated ordinals; never lexicographic over their digits. */
function compareOrdinal(left: bigint, right: bigint): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
