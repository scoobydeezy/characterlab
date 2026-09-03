import { EventRoleId, type EventRoleEvidence } from './eventBindings';
import type {
  PerceivedBindingEvidence,
  PerceptualEventReferentId,
  PerceptualReferentId,
  PreRecognitionSemanticExperience,
} from './perceptualEventFiles';

export const EVIDENCE_PROVENANCE_CONTRACT_VERSION = 'semantic-binding/0.1-candidate#SEM-001G' as const;

export type CharacterEvidenceRef =
  | { readonly kind: 'observation'; readonly observationId: string }
  | { readonly kind: 'continuant-feature'; readonly featureObservationId: string }
  | { readonly kind: 'event-feature'; readonly eventFeatureObservationId: string }
  | { readonly kind: 'perceived-binding'; readonly perceivedBindingId: bigint }
  | { readonly kind: 'continuant-classification'; readonly classificationEvidenceId: bigint }
  | { readonly kind: 'event-classification'; readonly eventClassificationEvidenceId: bigint }
  | { readonly kind: 'recognition-cue'; readonly recognitionCueEvidenceId: string }
  | { readonly kind: 'recognition-resolution'; readonly recognitionResolutionId: bigint }
  | { readonly kind: 'causal-role'; readonly causalRoleEvidenceId: bigint };

export type EvidenceCarrier =
  | { readonly kind: 'continuant'; readonly perceptualReferentId: PerceptualReferentId }
  | { readonly kind: 'event'; readonly perceptualEventReferentId: PerceptualEventReferentId }
  | {
      readonly kind: 'continuant-in-event';
      readonly perceptualEventReferentId: PerceptualEventReferentId;
      readonly perceptualReferentId: PerceptualReferentId;
    };

export interface EvidenceApplicabilityScope {
  readonly experienceId?: string;
  readonly windowId?: string;
  readonly modalityId?: string;
  readonly featureScopeId?: string;
  readonly carrier?: EvidenceCarrier;
}

/**
 * An audited index projection for one immutable observer-side record. It contains
 * no evidence payload and no truth ancestry. Evidence values remain owned by the
 * referenced record's exact schema.
 */
export interface ObserverSafeEvidenceOccurrence {
  readonly ref: CharacterEvidenceRef;
  readonly observerId: string;
  readonly occurredAt: bigint;
  readonly recordSchemaVersion: string;
  readonly producingEpistemicSeamVersion: string;
  readonly scope: EvidenceApplicabilityScope;
}

export interface PermittedEvidenceSchema {
  readonly refKind: CharacterEvidenceRef['kind'];
  readonly recordSchemaVersion: string;
  readonly producingEpistemicSeamVersion: string;
}

export type EvidenceTemporalScope = 'SameWindow' | 'SameExperience' | 'HistoricalOrCurrent';

export interface EvidenceReadDomain {
  readonly transitionKindId: string;
  readonly permittedEvidenceSchemas: readonly PermittedEvidenceSchema[];
  readonly temporalScope: EvidenceTemporalScope;
  readonly permittedModalityIds?: readonly string[];
  readonly permittedFeatureScopeIds?: readonly string[];
}

export interface EvidenceConsumerContext {
  readonly observerId: string;
  readonly occurredAt: bigint;
  readonly experienceId?: string;
  readonly windowId?: string;
  readonly requiredCarrier?: EvidenceCarrier;
}

export const CausalRoleId = {
  Cause: 'causal-role/cause',
  Actor: 'causal-role/actor',
  Target: 'causal-role/target',
  Recipient: 'causal-role/recipient',
  Instrument: 'causal-role/instrument',
  AffectedEntity: 'causal-role/affected-entity',
  Participant: 'causal-role/participant',
  Location: 'causal-role/location',
  Incidental: 'causal-role/incidental',
} as const;
export type CausalRoleId = typeof CausalRoleId[keyof typeof CausalRoleId];

export interface EventRoleToCausalRoleRule {
  readonly eventRoleId: EventRoleId;
  readonly causalRoleId: CausalRoleId;
}

export interface CausalRoleDerivationRuleDefinition {
  readonly causalRoleDerivationRuleId: string;
  readonly causalRoleDomain: 'continuant-in-observer-event';
  readonly permittedBasisKinds: readonly ['perceived-binding'];
  readonly mappings: readonly EventRoleToCausalRoleRule[];
  readonly derivationFunctionId: 'derivation/exact-observed-event-role-to-causal-role';
  readonly ruleVersion: string;
}

export interface CausalRoleModel {
  readonly modelIdentity: string;
  readonly rules: readonly CausalRoleDerivationRuleDefinition[];
}

export interface CausalRoleEvidence {
  readonly causalRoleEvidenceId: bigint;
  readonly experienceId: string;
  readonly observerId: string;
  readonly perceptualEventReferentId: PerceptualEventReferentId;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly causalRoleId: CausalRoleId;
  readonly causalRoleDerivationRuleId: string;
  readonly supportingEvidenceRefs: readonly CharacterEvidenceRef[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

export interface CausalRoleRequest {
  readonly experience: PreRecognitionSemanticExperience;
  readonly perceptualEventReferentId: PerceptualEventReferentId;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly evidenceOccurrences: readonly ObserverSafeEvidenceOccurrence[];
  readonly readDomain: EvidenceReadDomain;
  readonly transformationVersion: string;
}

export interface CompiledCausalRoleEvidence {
  readonly evidence: readonly CausalRoleEvidence[];
  readonly nextRuntimeId: bigint;
}

export type EvidenceProvenanceFailureCode =
  | 'INVALID_EVIDENCE_REFERENCE'
  | 'UNKNOWN_EVIDENCE_REFERENCE'
  | 'UNADMITTED_EVIDENCE_SCHEMA'
  | 'FORBIDDEN_TRUTH_LINKAGE'
  | 'CROSS_OBSERVER_REFERENCE'
  | 'FUTURE_EVIDENCE_REFERENCE'
  | 'INVALID_TEMPORAL_SCOPE'
  | 'INVALID_APPLICABILITY_SCOPE'
  | 'READ_DOMAIN_VIOLATION'
  | 'INVALID_CAUSAL_ROLE_MODEL'
  | 'DUPLICATE_CAUSAL_ROLE_AUTHORITY'
  | 'INVALID_CAUSAL_ROLE_REQUEST'
  | 'DUPLICATE_CAUSAL_ROLE_CLAIM'
  | 'RECURSIVE_CAUSAL_ROLE_BASIS'
  | 'INVALID_ALLOCATOR_STATE';

export class EvidenceProvenanceContractError extends Error {
  constructor(readonly code: EvidenceProvenanceFailureCode, message: string) {
    super(message);
    this.name = 'EvidenceProvenanceContractError';
  }
}

export const INITIAL_CAUSAL_ROLE_RULE: CausalRoleDerivationRuleDefinition = Object.freeze({
  causalRoleDerivationRuleId: 'causal-role-rule/exact-observed-event-role',
  causalRoleDomain: 'continuant-in-observer-event',
  permittedBasisKinds: Object.freeze(['perceived-binding'] as const),
  mappings: Object.freeze<EventRoleToCausalRoleRule[]>([
    mapping(EventRoleId.Actor, CausalRoleId.Actor),
    mapping(EventRoleId.AffectedEntity, CausalRoleId.AffectedEntity),
    mapping(EventRoleId.Companion, CausalRoleId.Participant),
    mapping(EventRoleId.Instrument, CausalRoleId.Instrument),
    mapping(EventRoleId.Location, CausalRoleId.Location),
    mapping(EventRoleId.Participant, CausalRoleId.Participant),
    mapping(EventRoleId.Recipient, CausalRoleId.Recipient),
    mapping(EventRoleId.Target, CausalRoleId.Target),
  ].sort(compareMappings)),
  derivationFunctionId: 'derivation/exact-observed-event-role-to-causal-role',
  ruleVersion: 'causal-role-rule/0.1-candidate',
});

export function compileCausalRoleModel(
  modelIdentity: string,
  rules: readonly CausalRoleDerivationRuleDefinition[],
): CausalRoleModel {
  requireNonempty(modelIdentity, 'modelIdentity');
  if (rules.length !== 1) {
    fail(rules.length > 1 ? 'DUPLICATE_CAUSAL_ROLE_AUTHORITY' : 'INVALID_CAUSAL_ROLE_MODEL',
      'the initial causal-role domain requires exactly one authoritative rule');
  }
  const rule = validateCausalRoleRule(rules[0]);
  return Object.freeze({ modelIdentity, rules: Object.freeze([rule]) });
}

export function resolveAdmissibleEvidenceReference(
  ref: CharacterEvidenceRef,
  occurrences: readonly ObserverSafeEvidenceOccurrence[],
  readDomain: EvidenceReadDomain,
  consumer: EvidenceConsumerContext,
): ObserverSafeEvidenceOccurrence {
  validateCharacterEvidenceRef(ref);
  validateReadDomain(readDomain);
  validateConsumer(consumer);
  const records = validateOccurrenceIndex(occurrences);
  const record = records.get(characterEvidenceRefKey(ref));
  if (!record) fail('UNKNOWN_EVIDENCE_REFERENCE', 'referenced observer-safe record does not exist');
  const admitted = readDomain.permittedEvidenceSchemas.some((schema) =>
    schema.refKind === record.ref.kind
    && schema.recordSchemaVersion === record.recordSchemaVersion
    && schema.producingEpistemicSeamVersion === record.producingEpistemicSeamVersion);
  if (!admitted) fail('UNADMITTED_EVIDENCE_SCHEMA', 'record schema/seam is not admitted by this transition ReadDomain');
  if (record.observerId !== consumer.observerId) fail('CROSS_OBSERVER_REFERENCE', 'character evidence must be owned by the consuming observer');
  if (record.occurredAt > consumer.occurredAt) fail('FUTURE_EVIDENCE_REFERENCE', 'a transition cannot consume future evidence');
  validateTemporalScope(record, readDomain, consumer);
  validateApplicability(record, readDomain, consumer);
  return record;
}

export function resolveAdmissibleEvidenceReferences(
  refs: readonly CharacterEvidenceRef[],
  occurrences: readonly ObserverSafeEvidenceOccurrence[],
  readDomain: EvidenceReadDomain,
  consumer: EvidenceConsumerContext,
): readonly ObserverSafeEvidenceOccurrence[] {
  const canonical = [...refs].sort((left, right) => characterEvidenceRefKey(left).localeCompare(characterEvidenceRefKey(right)));
  requireCanonicalRefs(refs, canonical);
  const seen = new Set<string>();
  return Object.freeze(canonical.map((ref) => {
    const key = characterEvidenceRefKey(ref);
    if (seen.has(key)) fail('INVALID_EVIDENCE_REFERENCE', 'duplicate character evidence reference');
    seen.add(key);
    return resolveAdmissibleEvidenceReference(ref, occurrences, readDomain, consumer);
  }));
}

export function deriveCausalRoleEvidence(
  model: CausalRoleModel,
  request: CausalRoleRequest,
  nextRuntimeId: bigint,
): CompiledCausalRoleEvidence {
  if (nextRuntimeId < 0n) fail('INVALID_ALLOCATOR_STATE', 'nextRuntimeId must be nonnegative');
  const compiled = compileCausalRoleModel(model.modelIdentity, model.rules);
  validateObjectKeys(request, [
    'experience', 'perceptualEventReferentId', 'perceptualReferentId', 'evidenceOccurrences',
    'readDomain', 'transformationVersion',
  ], 'causal-role request');
  requireNonempty(request.transformationVersion, 'transformationVersion');
  const { experience } = request;
  requireNonempty(experience.experienceId, 'experienceId');
  if (experience.observerId !== request.perceptualReferentId.observerId
    || experience.observerId !== request.perceptualEventReferentId.observerId) {
    fail('CROSS_OBSERVER_REFERENCE', 'causal-role carrier must belong to the experience observer');
  }
  if (!experience.perceptualEventReferentIds.some((id) => equalEvent(id, request.perceptualEventReferentId))) {
    fail('INVALID_CAUSAL_ROLE_REQUEST', 'causal-role event-file is absent from the experience');
  }
  if (request.readDomain.transitionKindId !== 'transition/derive-character-causal-role') {
    fail('READ_DOMAIN_VIOLATION', 'causal-role derivation requires its registered transition ReadDomain');
  }
  const rule = compiled.rules[0];
  const mappingByRole = new Map(rule.mappings.map((entry) => [entry.eventRoleId, entry.causalRoleId]));
  const grouped = new Map<CausalRoleId, CharacterEvidenceRef[]>();
  const bindings = experience.perceivedBindings
    .filter((binding) => equalEvent(binding.perceptualEventReferentId, request.perceptualEventReferentId)
      && equalContinuant(binding.perceptualReferentId, request.perceptualReferentId))
    .sort((left, right) => left.perceivedBindingId < right.perceivedBindingId ? -1 : left.perceivedBindingId > right.perceivedBindingId ? 1 : 0);
  for (const binding of bindings) {
    const eventRoleId = exactObservedRole(binding.eventRoleEvidence);
    if (!eventRoleId) continue;
    const causalRoleId = mappingByRole.get(eventRoleId);
    if (!causalRoleId) continue;
    const ref: CharacterEvidenceRef = Object.freeze({ kind: 'perceived-binding', perceivedBindingId: binding.perceivedBindingId });
    resolveAdmissibleEvidenceReference(ref, request.evidenceOccurrences, request.readDomain, {
      observerId: experience.observerId,
      occurredAt: experience.occurredAt,
      experienceId: experience.experienceId,
      requiredCarrier: {
        kind: 'continuant-in-event',
        perceptualEventReferentId: request.perceptualEventReferentId,
        perceptualReferentId: request.perceptualReferentId,
      },
    });
    const refs = grouped.get(causalRoleId) ?? [];
    refs.push(ref);
    grouped.set(causalRoleId, refs);
  }
  const claims = [...grouped.entries()].sort(([left], [right]) => left.localeCompare(right));
  const evidence: CausalRoleEvidence[] = [];
  for (const [causalRoleId, refs] of claims) {
    const canonicalRefs = refs.sort((left, right) => characterEvidenceRefKey(left).localeCompare(characterEvidenceRefKey(right)));
    if (canonicalRefs.some((ref) => ref.kind === 'causal-role')) fail('RECURSIVE_CAUSAL_ROLE_BASIS', 'causal-role evidence cannot support causal-role evidence in v0.1');
    evidence.push(Object.freeze({
      causalRoleEvidenceId: nextRuntimeId + BigInt(evidence.length),
      experienceId: experience.experienceId,
      observerId: experience.observerId,
      perceptualEventReferentId: freezeEvent(request.perceptualEventReferentId),
      perceptualReferentId: freezeContinuant(request.perceptualReferentId),
      causalRoleId,
      causalRoleDerivationRuleId: rule.causalRoleDerivationRuleId,
      supportingEvidenceRefs: Object.freeze(canonicalRefs.map(freezeRef)),
      occurredAt: experience.occurredAt,
      transformationVersion: request.transformationVersion,
    }));
  }
  const semanticKeys = new Set<string>();
  for (const claim of evidence) {
    const key = `${claim.experienceId}\u0000${eventKey(claim.perceptualEventReferentId)}\u0000${continuantKey(claim.perceptualReferentId)}\u0000${claim.causalRoleId}\u0000${claim.causalRoleDerivationRuleId}`;
    if (semanticKeys.has(key)) fail('DUPLICATE_CAUSAL_ROLE_CLAIM', 'duplicate causal-role semantic claim');
    semanticKeys.add(key);
  }
  return Object.freeze({ evidence: Object.freeze(evidence), nextRuntimeId: nextRuntimeId + BigInt(evidence.length) });
}

export function characterEvidenceRefKey(ref: CharacterEvidenceRef): string {
  validateCharacterEvidenceRef(ref);
  switch (ref.kind) {
    case 'observation': return `${ref.kind}:${ref.observationId}`;
    case 'continuant-feature': return `${ref.kind}:${ref.featureObservationId}`;
    case 'event-feature': return `${ref.kind}:${ref.eventFeatureObservationId}`;
    case 'perceived-binding': return `${ref.kind}:${ref.perceivedBindingId}`;
    case 'continuant-classification': return `${ref.kind}:${ref.classificationEvidenceId}`;
    case 'event-classification': return `${ref.kind}:${ref.eventClassificationEvidenceId}`;
    case 'recognition-cue': return `${ref.kind}:${ref.recognitionCueEvidenceId}`;
    case 'recognition-resolution': return `${ref.kind}:${ref.recognitionResolutionId}`;
    case 'causal-role': return `${ref.kind}:${ref.causalRoleEvidenceId}`;
  }
}

export function evidenceRefForPerceivedBinding(binding: PerceivedBindingEvidence): CharacterEvidenceRef {
  return Object.freeze({ kind: 'perceived-binding', perceivedBindingId: binding.perceivedBindingId });
}

function validateOccurrenceIndex(occurrences: readonly ObserverSafeEvidenceOccurrence[]): ReadonlyMap<string, ObserverSafeEvidenceOccurrence> {
  const result = new Map<string, ObserverSafeEvidenceOccurrence>();
  let prior = '';
  for (const occurrence of occurrences) {
    validateObjectKeys(occurrence, ['ref', 'observerId', 'occurredAt', 'recordSchemaVersion', 'producingEpistemicSeamVersion', 'scope'], 'observer-safe evidence occurrence');
    validateCharacterEvidenceRef(occurrence.ref);
    validateObjectKeys(occurrence.scope, ['experienceId', 'windowId', 'modalityId', 'featureScopeId', 'carrier'], 'evidence applicability scope', true);
    requireNonempty(occurrence.observerId, 'observerId');
    requireNonempty(occurrence.recordSchemaVersion, 'recordSchemaVersion');
    requireNonempty(occurrence.producingEpistemicSeamVersion, 'producingEpistemicSeamVersion');
    if (occurrence.occurredAt < 0n) fail('INVALID_APPLICABILITY_SCOPE', 'evidence time must be nonnegative');
    validateOptionalScope(occurrence.scope, occurrence.observerId);
    const key = characterEvidenceRefKey(occurrence.ref);
    if (key <= prior) fail('INVALID_EVIDENCE_REFERENCE', 'evidence occurrence index must be canonical and duplicate-free');
    prior = key;
    result.set(key, occurrence);
  }
  return result;
}

function validateReadDomain(domain: EvidenceReadDomain): void {
  validateObjectKeys(domain, ['transitionKindId', 'permittedEvidenceSchemas', 'temporalScope', 'permittedModalityIds', 'permittedFeatureScopeIds'], 'evidence ReadDomain', true);
  requireNonempty(domain.transitionKindId, 'transitionKindId');
  if (!['SameWindow', 'SameExperience', 'HistoricalOrCurrent'].includes(domain.temporalScope)) {
    fail('INVALID_TEMPORAL_SCOPE', 'unknown evidence temporal scope');
  }
  let prior = '';
  for (const schema of domain.permittedEvidenceSchemas) {
    validateObjectKeys(schema, ['refKind', 'recordSchemaVersion', 'producingEpistemicSeamVersion'], 'permitted evidence schema');
    if (!REF_KINDS.has(schema.refKind)) fail('INVALID_EVIDENCE_REFERENCE', 'unknown admitted evidence ref kind');
    requireNonempty(schema.recordSchemaVersion, 'recordSchemaVersion');
    requireNonempty(schema.producingEpistemicSeamVersion, 'producingEpistemicSeamVersion');
    const key = `${schema.refKind}\u0000${schema.recordSchemaVersion}\u0000${schema.producingEpistemicSeamVersion}`;
    if (key <= prior) fail('READ_DOMAIN_VIOLATION', 'permitted evidence schemas must be canonical and duplicate-free');
    prior = key;
  }
  canonicalStrings(domain.permittedModalityIds, 'permitted modality IDs');
  canonicalStrings(domain.permittedFeatureScopeIds, 'permitted feature-scope IDs');
}

function validateConsumer(consumer: EvidenceConsumerContext): void {
  validateObjectKeys(consumer, ['observerId', 'occurredAt', 'experienceId', 'windowId', 'requiredCarrier'], 'evidence consumer', true);
  requireNonempty(consumer.observerId, 'observerId');
  if (consumer.occurredAt < 0n) fail('INVALID_APPLICABILITY_SCOPE', 'consumer time must be nonnegative');
  if (consumer.requiredCarrier) validateCarrier(consumer.requiredCarrier, consumer.observerId);
}

function validateTemporalScope(record: ObserverSafeEvidenceOccurrence, domain: EvidenceReadDomain, consumer: EvidenceConsumerContext): void {
  if (domain.temporalScope === 'SameWindow') {
    if (!consumer.windowId || record.scope.windowId !== consumer.windowId) fail('INVALID_TEMPORAL_SCOPE', 'evidence is outside the consuming window');
  } else if (domain.temporalScope === 'SameExperience') {
    if (!consumer.experienceId || record.scope.experienceId !== consumer.experienceId) fail('INVALID_TEMPORAL_SCOPE', 'evidence is outside the consuming experience');
  }
}

function validateApplicability(record: ObserverSafeEvidenceOccurrence, domain: EvidenceReadDomain, consumer: EvidenceConsumerContext): void {
  if (domain.permittedModalityIds && (!record.scope.modalityId || !domain.permittedModalityIds.includes(record.scope.modalityId))) {
    fail('INVALID_APPLICABILITY_SCOPE', 'evidence modality is not admitted by this transition');
  }
  if (domain.permittedFeatureScopeIds && (!record.scope.featureScopeId || !domain.permittedFeatureScopeIds.includes(record.scope.featureScopeId))) {
    fail('INVALID_APPLICABILITY_SCOPE', 'evidence feature scope is not admitted by this transition');
  }
  if (consumer.requiredCarrier && (!record.scope.carrier || !equalCarrier(record.scope.carrier, consumer.requiredCarrier))) {
    fail('INVALID_APPLICABILITY_SCOPE', 'evidence carrier does not match the consuming proposition');
  }
}

function validateCharacterEvidenceRef(ref: CharacterEvidenceRef): void {
  if (!ref || typeof ref !== 'object' || !('kind' in ref) || !REF_KINDS.has(String(ref.kind))) {
    fail('INVALID_EVIDENCE_REFERENCE', 'unknown character evidence reference variant');
  }
  const value = ref as CharacterEvidenceRef;
  const key = REF_ID_FIELD[value.kind];
  validateObjectKeys(value, ['kind', key], 'character evidence reference');
  const id = (value as unknown as Record<string, unknown>)[key];
  if (typeof id === 'string') requireNonempty(id, key);
  else if (typeof id === 'bigint') {
    if (id < 0n) fail('INVALID_EVIDENCE_REFERENCE', 'evidence occurrence ID must be nonnegative');
  } else fail('INVALID_EVIDENCE_REFERENCE', 'evidence reference has the wrong ID type');
}

function validateCausalRoleRule(rule: CausalRoleDerivationRuleDefinition): CausalRoleDerivationRuleDefinition {
  validateObjectKeys(rule, ['causalRoleDerivationRuleId', 'causalRoleDomain', 'permittedBasisKinds', 'mappings', 'derivationFunctionId', 'ruleVersion'], 'causal-role derivation rule');
  requireNonempty(rule.causalRoleDerivationRuleId, 'causalRoleDerivationRuleId');
  requireNonempty(rule.ruleVersion, 'ruleVersion');
  if (rule.causalRoleDomain !== 'continuant-in-observer-event'
    || rule.derivationFunctionId !== 'derivation/exact-observed-event-role-to-causal-role'
    || rule.permittedBasisKinds.length !== 1 || rule.permittedBasisKinds[0] !== 'perceived-binding') {
    fail('INVALID_CAUSAL_ROLE_MODEL', 'unsupported or recursive causal-role derivation domain');
  }
  const mappings = rule.mappings.map((entry) => {
    validateObjectKeys(entry, ['eventRoleId', 'causalRoleId'], 'event-role causal-role mapping');
    if (!Object.values(EventRoleId).includes(entry.eventRoleId) || !Object.values(CausalRoleId).includes(entry.causalRoleId)) {
      fail('INVALID_CAUSAL_ROLE_MODEL', 'unknown event or causal role');
    }
    return Object.freeze({ ...entry });
  }).sort(compareMappings);
  if (mappings.some((entry, index) => index > 0 && entry.eventRoleId === mappings[index - 1].eventRoleId)) {
    fail('INVALID_CAUSAL_ROLE_MODEL', 'one event role cannot have multiple causal-role mappings in the initial rule');
  }
  if (rule.mappings.some((entry, index) => entry.eventRoleId !== mappings[index]?.eventRoleId || entry.causalRoleId !== mappings[index]?.causalRoleId)) {
    fail('INVALID_CAUSAL_ROLE_MODEL', 'causal-role mappings must be canonical');
  }
  return Object.freeze({ ...rule, permittedBasisKinds: Object.freeze(['perceived-binding'] as const), mappings: Object.freeze(mappings) });
}

function exactObservedRole(evidence: EventRoleEvidence): EventRoleId | undefined {
  return evidence.kind === 'exact' ? evidence.eventRoleId : undefined;
}

function validateOptionalScope(scope: EvidenceApplicabilityScope, observerId: string): void {
  for (const [name, value] of [['experienceId', scope.experienceId], ['windowId', scope.windowId], ['modalityId', scope.modalityId], ['featureScopeId', scope.featureScopeId]] as const) {
    if (value !== undefined) requireNonempty(value, name);
  }
  if (scope.carrier) validateCarrier(scope.carrier, observerId);
}

function validateCarrier(carrier: EvidenceCarrier, observerId: string): void {
  if (carrier.kind === 'continuant') {
    validateObjectKeys(carrier, ['kind', 'perceptualReferentId'], 'continuant carrier');
    if (carrier.perceptualReferentId.observerId !== observerId) fail('CROSS_OBSERVER_REFERENCE', 'carrier continuant belongs to another observer');
  } else if (carrier.kind === 'event') {
    validateObjectKeys(carrier, ['kind', 'perceptualEventReferentId'], 'event carrier');
    if (carrier.perceptualEventReferentId.observerId !== observerId) fail('CROSS_OBSERVER_REFERENCE', 'carrier event belongs to another observer');
  } else if (carrier.kind === 'continuant-in-event') {
    validateObjectKeys(carrier, ['kind', 'perceptualEventReferentId', 'perceptualReferentId'], 'continuant-in-event carrier');
    if (carrier.perceptualReferentId.observerId !== observerId || carrier.perceptualEventReferentId.observerId !== observerId) {
      fail('CROSS_OBSERVER_REFERENCE', 'compound carrier belongs to another observer');
    }
  } else fail('INVALID_APPLICABILITY_SCOPE', 'unknown evidence carrier');
}

function equalCarrier(left: EvidenceCarrier, right: EvidenceCarrier): boolean {
  if (left.kind !== right.kind) return false;
  if (left.kind === 'continuant' && right.kind === 'continuant') return equalContinuant(left.perceptualReferentId, right.perceptualReferentId);
  if (left.kind === 'event' && right.kind === 'event') return equalEvent(left.perceptualEventReferentId, right.perceptualEventReferentId);
  return left.kind === 'continuant-in-event' && right.kind === 'continuant-in-event'
    && equalEvent(left.perceptualEventReferentId, right.perceptualEventReferentId)
    && equalContinuant(left.perceptualReferentId, right.perceptualReferentId);
}

function freezeRef(ref: CharacterEvidenceRef): CharacterEvidenceRef { return Object.freeze({ ...ref }); }
function freezeContinuant(id: PerceptualReferentId): PerceptualReferentId { return Object.freeze({ ...id }); }
function freezeEvent(id: PerceptualEventReferentId): PerceptualEventReferentId { return Object.freeze({ ...id }); }
function equalContinuant(left: PerceptualReferentId, right: PerceptualReferentId): boolean { return left.observerId === right.observerId && left.observerTrackSequence === right.observerTrackSequence; }
function equalEvent(left: PerceptualEventReferentId, right: PerceptualEventReferentId): boolean { return left.observerId === right.observerId && left.observerEventSequence === right.observerEventSequence; }
function continuantKey(id: PerceptualReferentId): string { return `${id.observerId}:${id.observerTrackSequence}`; }
function eventKey(id: PerceptualEventReferentId): string { return `${id.observerId}:${id.observerEventSequence}`; }
function mapping(eventRoleId: EventRoleId, causalRoleId: CausalRoleId): EventRoleToCausalRoleRule { return Object.freeze({ eventRoleId, causalRoleId }); }
function compareMappings(left: EventRoleToCausalRoleRule, right: EventRoleToCausalRoleRule): number { return left.eventRoleId.localeCompare(right.eventRoleId) || left.causalRoleId.localeCompare(right.causalRoleId); }

function requireCanonicalRefs(actual: readonly CharacterEvidenceRef[], canonical: readonly CharacterEvidenceRef[]): void {
  if (actual.length !== canonical.length || actual.some((value, index) => characterEvidenceRefKey(value) !== characterEvidenceRefKey(canonical[index]))) {
    fail('INVALID_EVIDENCE_REFERENCE', 'character evidence references must be canonical');
  }
}

function canonicalStrings(values: readonly string[] | undefined, label: string): void {
  if (!values) return;
  const canonical = [...values].sort();
  if (values.some((value, index) => value !== canonical[index] || !value || (index > 0 && value === values[index - 1]))) {
    fail('READ_DOMAIN_VIOLATION', `${label} must be nonempty, canonical, and duplicate-free`);
  }
}

function validateObjectKeys(value: object, allowed: readonly string[], label: string, optional = false): void {
  const keys = Object.keys(value).sort();
  const permitted = new Set(allowed);
  const extra = keys.find((key) => !permitted.has(key));
  if (extra) {
    if (/truth|source|trace|hash|entity/i.test(extra)) fail('FORBIDDEN_TRUTH_LINKAGE', `${label} contains forbidden linkage field ${extra}`);
    fail('INVALID_EVIDENCE_REFERENCE', `${label} contains unknown field ${extra}`);
  }
  if (!optional) {
    const missing = allowed.find((key) => !keys.includes(key));
    if (missing) fail('INVALID_EVIDENCE_REFERENCE', `${label} is missing ${missing}`);
  }
}

function requireNonempty(value: string, label: string): void {
  if (typeof value !== 'string' || value.length === 0) fail('INVALID_EVIDENCE_REFERENCE', `${label} must be nonempty`);
}

function fail(code: EvidenceProvenanceFailureCode, message: string): never {
  throw new EvidenceProvenanceContractError(code, message);
}

const REF_ID_FIELD: Record<CharacterEvidenceRef['kind'], string> = {
  observation: 'observationId',
  'continuant-feature': 'featureObservationId',
  'event-feature': 'eventFeatureObservationId',
  'perceived-binding': 'perceivedBindingId',
  'continuant-classification': 'classificationEvidenceId',
  'event-classification': 'eventClassificationEvidenceId',
  'recognition-cue': 'recognitionCueEvidenceId',
  'recognition-resolution': 'recognitionResolutionId',
  'causal-role': 'causalRoleEvidenceId',
};
const REF_KINDS = new Set<string>(Object.keys(REF_ID_FIELD));
