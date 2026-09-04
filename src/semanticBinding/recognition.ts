import type {
  PerceptualReferentId,
  PreRecognitionSemanticExperience,
  SupportingObservationId,
} from './perceptualEventFiles';

export const RECOGNITION_CONTRACT_VERSION = 'semantic-binding/0.1-candidate#SEM-001F' as const;

export type RecognitionCandidateDomain = 'Person' | 'DiscreteObject' | 'PlaceOrRegion';

export interface RecognitionCandidateCatalogEntry {
  readonly observerId: string;
  readonly candidateSemanticReferentId: string;
  readonly candidateDomain: RecognitionCandidateDomain;
  readonly recognitionTemplateIds: readonly string[];
  readonly catalogEntryVersion: string;
}

export interface ObserverIdentitySymbolMapping {
  /** Typed `ObserverSymbolCandidateMappingId` occurrence (namespace 1107), allocated not derived. */
  readonly observerSymbolCandidateMappingId: bigint;
  readonly observerId: string;
  readonly perceivedIdentitySymbolId: string;
  readonly candidateSemanticReferentId: string;
  readonly mappingVersion: string;
}

export type RecognitionCueSource =
  | { readonly kind: 'retained-template-match'; readonly recognitionTemplateId: string }
  | {
      readonly kind: 'identity-claim-mapping';
      readonly perceivedIdentitySymbolId: string;
      readonly observerSymbolCandidateMappingId: bigint;
    };

export type RecognitionExperienceEvidenceRef =
  | { readonly kind: 'continuant-classification'; readonly classificationEvidenceId: bigint }
  | { readonly kind: 'perceived-binding'; readonly perceivedBindingId: bigint }
  | { readonly kind: 'supporting-observation'; readonly supportingObservationId: SupportingObservationId };

export type RecognitionCuePolarity = 'SupportsCandidate' | 'ContradictsCandidate';

export interface PermittedRecognitionCueEvidence {
  /** Allocated typed `RecognitionCueEvidenceId` occurrence (namespace 1108). */
  readonly recognitionCueEvidenceId: bigint;
  readonly experienceId: bigint;
  readonly observerId: string;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly candidateSemanticReferentId: string;
  readonly recognitionCueSource: RecognitionCueSource;
  readonly cuePolarity: RecognitionCuePolarity;
  readonly supportingExperienceEvidenceRefs: readonly RecognitionExperienceEvidenceRef[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

export type RecognitionNoUpdateReason =
  | 'NoQualifyingCandidate'
  | 'AmbiguousCandidates'
  | 'SameCandidateMaintained';

export type RecognitionRuleResult =
  | { readonly kind: 'no-update'; readonly reason: RecognitionNoUpdateReason }
  | { readonly kind: 'assert-unique-candidate'; readonly candidateSemanticReferentId: string }
  | { readonly kind: 'withdraw-current-resolution' };

export interface RecognitionRuleDefinition {
  readonly recognitionRuleId: string;
  readonly recognitionDomain: 'continuant-instance';
  readonly permittedCueSourceKinds: readonly RecognitionCueSource['kind'][];
  readonly derivationFunctionId: string;
  readonly ruleVersion: string;
}

export interface RecognitionDerivation {
  readonly derivationFunctionId: string;
  derive(
    cues: readonly PermittedRecognitionCueEvidence[],
    currentCandidateSemanticReferentId?: string,
  ): RecognitionRuleResult;
}

export interface RecognitionModel {
  readonly modelIdentity: string;
  readonly rules: readonly RecognitionRuleDefinition[];
  readonly derivations: readonly RecognitionDerivation[];
}

export interface RecognitionEvaluation {
  readonly recognitionEvaluationId: bigint;
  readonly experienceId: bigint;
  readonly observerId: string;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly recognitionRuleId: string;
  readonly evaluatedRecognitionCueEvidenceIds: readonly bigint[];
  readonly priorRecognitionResolutionId?: bigint;
  readonly result: RecognitionRuleResult;
  readonly occurredAt: bigint;
  readonly recognitionVersion: string;
}

export type RecognitionResolution =
  | { readonly kind: 'asserted-candidate'; readonly candidateSemanticReferentId: string }
  | { readonly kind: 'withdrawn' };

export interface RecognitionResolutionRecord {
  readonly recognitionResolutionId: bigint;
  readonly experienceId: bigint;
  readonly observerId: string;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly resolution: RecognitionResolution;
  readonly recognitionRuleId: string;
  readonly evaluatedRecognitionCueEvidenceIds: readonly bigint[];
  readonly revisesRecognitionResolutionId?: bigint;
  readonly occurredAt: bigint;
  readonly recognitionVersion: string;
}

export interface RecognitionRequest {
  readonly experience: PreRecognitionSemanticExperience;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly candidateCatalog: readonly RecognitionCandidateCatalogEntry[];
  readonly identitySymbolMappings: readonly ObserverIdentitySymbolMapping[];
  readonly cueEvidence: readonly PermittedRecognitionCueEvidence[];
  readonly priorResolutionHistory: readonly RecognitionResolutionRecord[];
  readonly recognitionVersion: string;
}

export interface RecognitionTransitionResult {
  readonly evaluation: RecognitionEvaluation;
  readonly resolutionRecord?: RecognitionResolutionRecord;
  readonly nextRuntimeId: bigint;
}

export type RecognitionEmissionTarget =
  | 'recognition-resolution-log' | 'perceptual-track' | 'perceptual-event-file'
  | 'semantic-experience' | 'belief' | 'memory' | 'person-model' | 'relationship'
  | 'appraisal' | 'pressure' | 'reason' | 'option' | 'identity' | 'world-truth';

export type RecognitionFailureCode =
  | 'INVALID_MODEL' | 'MISSING_RECOGNITION_AUTHORITY' | 'DUPLICATE_RECOGNITION_AUTHORITY'
  | 'UNKNOWN_DERIVATION' | 'INVALID_CATALOG' | 'INVALID_SYMBOL_MAPPING'
  | 'INVALID_CUE' | 'INVALID_EVIDENCE_REFERENCE' | 'CROSS_OBSERVER_REFERENCE'
  | 'CARRIER_TYPE_MISMATCH' | 'FORBIDDEN_TRUTH_FIELD' | 'INVALID_RULE_RESULT'
  | 'INVALID_RESOLUTION_HISTORY' | 'INVALID_ALLOCATOR_STATE' | 'FORBIDDEN_EMISSION_TARGET';

export class RecognitionContractError extends Error {
  constructor(readonly code: RecognitionFailureCode, message: string) {
    super(message);
    this.name = 'RecognitionContractError';
  }
}

export const INITIAL_RECOGNITION_RULE: RecognitionRuleDefinition = Object.freeze({
  recognitionRuleId: 'recognition-rule/unique-uncontradicted-support',
  recognitionDomain: 'continuant-instance',
  permittedCueSourceKinds: Object.freeze<RecognitionCueSource['kind'][]>(['identity-claim-mapping', 'retained-template-match']),
  derivationFunctionId: 'derivation/unique-uncontradicted-support',
  ruleVersion: 'recognition-rule/0.1-candidate',
});

export const INITIAL_RECOGNITION_DERIVATION: RecognitionDerivation = Object.freeze({
  derivationFunctionId: INITIAL_RECOGNITION_RULE.derivationFunctionId,
  derive: uniqueUncontradictedSupport,
});

export function noRecognitionUpdate(reason: RecognitionNoUpdateReason): RecognitionRuleResult {
  if (!['NoQualifyingCandidate', 'AmbiguousCandidates', 'SameCandidateMaintained'].includes(reason)) {
    fail('INVALID_RULE_RESULT', 'unknown no-update reason');
  }
  return Object.freeze({ kind: 'no-update', reason });
}

export function assertUniqueRecognitionCandidate(candidateSemanticReferentId: string): RecognitionRuleResult {
  requireNonempty(candidateSemanticReferentId, 'candidateSemanticReferentId');
  return Object.freeze({ kind: 'assert-unique-candidate', candidateSemanticReferentId });
}

export function withdrawCurrentRecognitionResolution(): RecognitionRuleResult {
  return Object.freeze({ kind: 'withdraw-current-resolution' });
}

export function compileRecognitionModel(
  modelIdentity: string,
  rules: readonly RecognitionRuleDefinition[],
  derivations: readonly RecognitionDerivation[],
): RecognitionModel {
  requireNonempty(modelIdentity, 'modelIdentity');
  if (rules.length === 0) fail('MISSING_RECOGNITION_AUTHORITY', 'continuant recognition requires one rule');
  if (rules.length > 1) fail('DUPLICATE_RECOGNITION_AUTHORITY', 'continuant recognition permits one authoritative rule per model');
  const rule = validateRule(rules[0]);
  const derivationIds = new Set<string>();
  for (const derivation of derivations) {
    exactKeys(derivation, ['derivationFunctionId', 'derive'], 'recognition derivation');
    requireNonempty(derivation.derivationFunctionId, 'derivationFunctionId');
    if (typeof derivation.derive !== 'function' || derivationIds.has(derivation.derivationFunctionId)) {
      fail('INVALID_MODEL', 'recognition derivations must be executable and unique');
    }
    derivationIds.add(derivation.derivationFunctionId);
  }
  if (!derivationIds.has(rule.derivationFunctionId)) fail('UNKNOWN_DERIVATION', `unknown derivation ${rule.derivationFunctionId}`);
  return Object.freeze({
    modelIdentity,
    rules: Object.freeze([Object.freeze({ ...rule, permittedCueSourceKinds: Object.freeze([...rule.permittedCueSourceKinds]) })]),
    derivations: Object.freeze(derivations.map((value) => Object.freeze({ ...value }))),
  });
}

export function evaluateContinuantRecognition(
  model: RecognitionModel,
  request: RecognitionRequest,
  nextRuntimeId: bigint,
): RecognitionTransitionResult {
  if (nextRuntimeId < 0n) fail('INVALID_ALLOCATOR_STATE', 'nextRuntimeId must be nonnegative');
  const compiled = compileRecognitionModel(model.modelIdentity, model.rules, model.derivations);
  exactKeys(request, [
    'experience', 'perceptualReferentId', 'candidateCatalog', 'identitySymbolMappings',
    'cueEvidence', 'priorResolutionHistory', 'recognitionVersion',
  ], 'recognition request');
  requireNonempty(request.recognitionVersion, 'recognitionVersion');
  const observerId = request.experience.observerId;
  validateContinuantId(request.perceptualReferentId, observerId);
  const catalog = validateCatalog(request.candidateCatalog, observerId);
  const mappings = validateMappings(request.identitySymbolMappings, observerId, catalog);
  const history = validateResolutionHistory(request.priorResolutionHistory);
  const current = currentRecognitionResolution(history, observerId, request.perceptualReferentId);
  const cues = request.cueEvidence.map((value) => validateCue(
    value, request.experience, request.perceptualReferentId, catalog, mappings,
  )).sort(compareCues);
  requireCanonical(request.cueEvidence, cues, (value) => String(value.recognitionCueEvidenceId), 'recognition cues');
  const cueIds = new Set<bigint>();
  for (const cue of cues) {
    if (cueIds.has(cue.recognitionCueEvidenceId)) fail('INVALID_CUE', 'duplicate recognition cue identity');
    cueIds.add(cue.recognitionCueEvidenceId);
  }
  const rule = compiled.rules[0];
  for (const cue of cues) {
    if (!rule.permittedCueSourceKinds.includes(cue.recognitionCueSource.kind)) fail('INVALID_CUE', 'cue source is outside rule domain');
  }
  const derivation = compiled.derivations.find((value) => value.derivationFunctionId === rule.derivationFunctionId);
  if (!derivation) fail('UNKNOWN_DERIVATION', 'registered derivation disappeared');
  const currentCandidate = current?.resolution.kind === 'asserted-candidate'
    ? current.resolution.candidateSemanticReferentId : undefined;
  const result = derivation.derive(Object.freeze(cues), currentCandidate);
  validateRuleResult(result, catalog, current);
  const evaluatedIds = Object.freeze(cues.map((value) => value.recognitionCueEvidenceId));
  const evaluation: RecognitionEvaluation = Object.freeze({
    recognitionEvaluationId: nextRuntimeId,
    experienceId: request.experience.experienceId,
    observerId,
    perceptualReferentId: freezeContinuantId(request.perceptualReferentId),
    recognitionRuleId: rule.recognitionRuleId,
    evaluatedRecognitionCueEvidenceIds: evaluatedIds,
    priorRecognitionResolutionId: current?.recognitionResolutionId,
    result: freezeRuleResult(result),
    occurredAt: request.experience.occurredAt,
    recognitionVersion: request.recognitionVersion,
  });
  if (result.kind === 'no-update') {
    return Object.freeze({ evaluation, nextRuntimeId: nextRuntimeId + 1n });
  }
  const resolution: RecognitionResolution = result.kind === 'assert-unique-candidate'
    ? Object.freeze({ kind: 'asserted-candidate', candidateSemanticReferentId: result.candidateSemanticReferentId })
    : Object.freeze({ kind: 'withdrawn' });
  const resolutionRecord: RecognitionResolutionRecord = Object.freeze({
    recognitionResolutionId: nextRuntimeId + 1n,
    experienceId: request.experience.experienceId,
    observerId,
    perceptualReferentId: freezeContinuantId(request.perceptualReferentId),
    resolution,
    recognitionRuleId: rule.recognitionRuleId,
    evaluatedRecognitionCueEvidenceIds: evaluatedIds,
    revisesRecognitionResolutionId: current?.recognitionResolutionId,
    occurredAt: request.experience.occurredAt,
    recognitionVersion: request.recognitionVersion,
  });
  validateResolutionHistory([...history, resolutionRecord].sort(compareResolutions));
  return Object.freeze({ evaluation, resolutionRecord, nextRuntimeId: nextRuntimeId + 2n });
}

export function currentRecognitionResolution(
  history: readonly RecognitionResolutionRecord[],
  observerId: string,
  referentId: PerceptualReferentId,
): RecognitionResolutionRecord | undefined {
  validateContinuantId(referentId, observerId);
  const matching = history.filter((value) => value.observerId === observerId && continuantKey(value.perceptualReferentId) === continuantKey(referentId));
  if (matching.length === 0) return undefined;
  const revised = new Set(matching.flatMap((value) => value.revisesRecognitionResolutionId === undefined ? [] : [value.revisesRecognitionResolutionId]));
  const terminals = matching.filter((value) => !revised.has(value.recognitionResolutionId));
  if (terminals.length !== 1) fail('INVALID_RESOLUTION_HISTORY', 'recognition chain must have exactly one terminal resolution');
  return terminals[0];
}

export function validateResolutionHistory(history: readonly RecognitionResolutionRecord[]): readonly RecognitionResolutionRecord[] {
  const canonical = [...history].sort(compareResolutions);
  requireCanonical(history, canonical, (value) => value.recognitionResolutionId.toString(), 'recognition resolution history');
  const byId = new Map<bigint, RecognitionResolutionRecord>();
  const revisedIds = new Set<bigint>();
  for (const value of canonical) {
    validateResolution(value);
    if (byId.has(value.recognitionResolutionId)) fail('INVALID_RESOLUTION_HISTORY', 'duplicate recognition resolution identity');
    byId.set(value.recognitionResolutionId, value);
  }
  for (const value of canonical) {
    const priorId = value.revisesRecognitionResolutionId;
    if (priorId === undefined) continue;
    const prior = byId.get(priorId);
    if (!prior) fail('INVALID_RESOLUTION_HISTORY', 'revision target does not exist');
    if (prior.observerId !== value.observerId || continuantKey(prior.perceptualReferentId) !== continuantKey(value.perceptualReferentId)) {
      fail('INVALID_RESOLUTION_HISTORY', 'revision cannot cross observer or continuant-file');
    }
    if (prior.occurredAt > value.occurredAt) fail('INVALID_RESOLUTION_HISTORY', 'revision cannot point forward in time');
    if (revisedIds.has(priorId)) fail('INVALID_RESOLUTION_HISTORY', 'recognition revision chains cannot branch');
    revisedIds.add(priorId);
    const visited = new Set<bigint>([value.recognitionResolutionId]);
    let cursor: RecognitionResolutionRecord | undefined = prior;
    while (cursor) {
      if (visited.has(cursor.recognitionResolutionId)) fail('INVALID_RESOLUTION_HISTORY', 'recognition revision cycle');
      visited.add(cursor.recognitionResolutionId);
      cursor = cursor.revisesRecognitionResolutionId === undefined ? undefined : byId.get(cursor.revisesRecognitionResolutionId);
    }
  }
  const chains = new Map<string, RecognitionResolutionRecord[]>();
  for (const value of canonical) {
    const key = `${value.observerId}\0${continuantKey(value.perceptualReferentId)}`;
    const group = chains.get(key) ?? [];
    group.push(value);
    chains.set(key, group);
  }
  for (const group of chains.values()) {
    const roots = group.filter((value) => value.revisesRecognitionResolutionId === undefined);
    if (roots.length !== 1) fail('INVALID_RESOLUTION_HISTORY', 'each recognition chain requires exactly one root');
    const revised = new Set(group.flatMap((value) => value.revisesRecognitionResolutionId === undefined ? [] : [value.revisesRecognitionResolutionId]));
    if (group.filter((value) => !revised.has(value.recognitionResolutionId)).length !== 1) fail('INVALID_RESOLUTION_HISTORY', 'each recognition chain requires exactly one terminal');
  }
  return Object.freeze(canonical.map(freezeResolution));
}

export function recognitionSemanticView(record: RecognitionResolutionRecord | undefined): string {
  if (!record || record.resolution.kind === 'withdrawn') return 'unresolved';
  return `asserted:${record.resolution.candidateSemanticReferentId}`;
}

export function assertRecognitionEmissionTarget(target: RecognitionEmissionTarget): void {
  if (target !== 'recognition-resolution-log') fail('FORBIDDEN_EMISSION_TARGET', `recognition cannot emit directly to ${target}`);
}

function uniqueUncontradictedSupport(
  cues: readonly PermittedRecognitionCueEvidence[],
  currentCandidate?: string,
): RecognitionRuleResult {
  const states = new Map<string, { support: boolean; contradiction: boolean }>();
  for (const cue of cues) {
    const state = states.get(cue.candidateSemanticReferentId) ?? { support: false, contradiction: false };
    if (cue.cuePolarity === 'SupportsCandidate') state.support = true;
    else state.contradiction = true;
    states.set(cue.candidateSemanticReferentId, state);
  }
  const qualifiers = [...states.entries()].filter(([, value]) => value.support && !value.contradiction).map(([candidate]) => candidate).sort(compareText);
  if (qualifiers.length === 1) {
    return qualifiers[0] === currentCandidate
      ? noRecognitionUpdate('SameCandidateMaintained')
      : assertUniqueRecognitionCandidate(qualifiers[0]);
  }
  const currentContradicted = currentCandidate !== undefined && states.get(currentCandidate)?.contradiction === true;
  if (currentContradicted) return withdrawCurrentRecognitionResolution();
  return noRecognitionUpdate(qualifiers.length === 0 ? 'NoQualifyingCandidate' : 'AmbiguousCandidates');
}

function validateRule(value: RecognitionRuleDefinition): RecognitionRuleDefinition {
  exactKeys(value, ['recognitionRuleId', 'recognitionDomain', 'permittedCueSourceKinds', 'derivationFunctionId', 'ruleVersion'], 'recognition rule');
  requireNonempty(value.recognitionRuleId, 'recognitionRuleId');
  requireNonempty(value.derivationFunctionId, 'derivationFunctionId');
  requireNonempty(value.ruleVersion, 'ruleVersion');
  if (value.recognitionDomain !== 'continuant-instance') fail('INVALID_MODEL', 'SEM-001F recognizes continuant instances only');
  const expected = ['identity-claim-mapping', 'retained-template-match'];
  if (value.permittedCueSourceKinds.length !== expected.length || value.permittedCueSourceKinds.some((entry, index) => entry !== expected[index])) {
    fail('INVALID_MODEL', 'cue-source kinds must be complete and canonical');
  }
  return value;
}

function validateCatalog(values: readonly RecognitionCandidateCatalogEntry[], observerId: string): ReadonlyMap<string, RecognitionCandidateCatalogEntry> {
  const canonical = [...values].sort((a, b) => compareText(a.candidateSemanticReferentId, b.candidateSemanticReferentId));
  requireCanonical(values, canonical, (value) => value.candidateSemanticReferentId, 'recognition candidate catalog');
  const result = new Map<string, RecognitionCandidateCatalogEntry>();
  for (const value of values) {
    exactKeys(value, ['observerId', 'candidateSemanticReferentId', 'candidateDomain', 'recognitionTemplateIds', 'catalogEntryVersion'], 'candidate catalog entry');
    if (value.observerId !== observerId) fail('CROSS_OBSERVER_REFERENCE', 'catalog entry belongs to another observer');
    requireNonempty(value.candidateSemanticReferentId, 'candidateSemanticReferentId');
    requireNonempty(value.catalogEntryVersion, 'catalogEntryVersion');
    if (!['Person', 'DiscreteObject', 'PlaceOrRegion'].includes(value.candidateDomain)) fail('INVALID_CATALOG', 'unknown candidate domain');
    validateStrings(value.recognitionTemplateIds, 'recognition templates', true);
    if (result.has(value.candidateSemanticReferentId)) fail('INVALID_CATALOG', 'duplicate candidate catalog entry');
    result.set(value.candidateSemanticReferentId, Object.freeze({ ...value, recognitionTemplateIds: Object.freeze([...value.recognitionTemplateIds]) }));
  }
  return result;
}

function validateMappings(
  values: readonly ObserverIdentitySymbolMapping[],
  observerId: string,
  catalog: ReadonlyMap<string, RecognitionCandidateCatalogEntry>,
): ReadonlyMap<string, ObserverIdentitySymbolMapping> {
  const canonical = [...values].sort((a, b) => compareText(mappingKey(a), mappingKey(b)));
  requireCanonical(values, canonical, mappingKey, 'identity-symbol mappings');
  const result = new Map<string, ObserverIdentitySymbolMapping>();
  for (const value of values) {
    exactKeys(value, ['observerSymbolCandidateMappingId', 'observerId', 'perceivedIdentitySymbolId', 'candidateSemanticReferentId', 'mappingVersion'], 'identity-symbol mapping');
    if (value.observerId !== observerId) fail('CROSS_OBSERVER_REFERENCE', 'identity-symbol mapping belongs to another observer');
    if (value.observerSymbolCandidateMappingId < 0n) fail('INVALID_SYMBOL_MAPPING', 'symbol-mapping occurrence IDs must be nonnegative');
    requireNonempty(value.perceivedIdentitySymbolId, 'perceivedIdentitySymbolId');
    requireNonempty(value.mappingVersion, 'mappingVersion');
    if (!catalog.has(value.candidateSemanticReferentId)) fail('INVALID_SYMBOL_MAPPING', 'symbol mapping candidate is absent from observer catalog');
    const key = mappingKey(value);
    // At most one ACTIVE mapping per (ObserverId, PerceivedIdentitySymbolId). Replacement allocates
    // a new occurrence and replaces this entry; it never remaps an existing occurrence in place.
    if (result.has(key)) fail('INVALID_SYMBOL_MAPPING', 'observer holds more than one active mapping for one perceived identity symbol');
    result.set(key, Object.freeze({ ...value }));
  }
  return result;
}

function validateCue(
  value: PermittedRecognitionCueEvidence,
  experience: PreRecognitionSemanticExperience,
  referentId: PerceptualReferentId,
  catalog: ReadonlyMap<string, RecognitionCandidateCatalogEntry>,
  mappings: ReadonlyMap<string, ObserverIdentitySymbolMapping>,
): PermittedRecognitionCueEvidence {
  exactKeys(value, ['recognitionCueEvidenceId', 'experienceId', 'observerId', 'perceptualReferentId', 'candidateSemanticReferentId', 'recognitionCueSource', 'cuePolarity', 'supportingExperienceEvidenceRefs', 'occurredAt', 'transformationVersion'], 'recognition cue');
  if (typeof value.recognitionCueEvidenceId !== 'bigint' || value.recognitionCueEvidenceId < 0n) {
    fail('INVALID_CUE', 'recognitionCueEvidenceId must be a nonnegative allocated occurrence');
  }
  requireNonempty(value.transformationVersion, 'transformationVersion');
  if (value.experienceId !== experience.experienceId || value.observerId !== experience.observerId) fail('CROSS_OBSERVER_REFERENCE', 'recognition cue belongs to another observer or experience');
  validateContinuantId(value.perceptualReferentId, value.observerId);
  if (continuantKey(value.perceptualReferentId) !== continuantKey(referentId)) fail('INVALID_CUE', 'recognition cue belongs to another continuant-file');
  const candidate = catalog.get(value.candidateSemanticReferentId);
  if (!candidate) fail('INVALID_CATALOG', 'recognition cue candidate is absent from observer catalog');
  if (!['SupportsCandidate', 'ContradictsCandidate'].includes(value.cuePolarity)) fail('INVALID_CUE', 'invalid recognition cue polarity');
  validateCueSource(value.recognitionCueSource, candidate, mappings, value.candidateSemanticReferentId);
  validateEvidenceRefs(value.supportingExperienceEvidenceRefs, experience, referentId);
  if (value.supportingExperienceEvidenceRefs.length === 0) fail('INVALID_EVIDENCE_REFERENCE', 'recognition cue requires observer-safe experience evidence');
  if (value.occurredAt !== experience.occurredAt) fail('INVALID_CUE', 'recognition cue belongs to another observation window');
  return value;
}

function validateCueSource(
  source: RecognitionCueSource,
  candidate: RecognitionCandidateCatalogEntry,
  mappings: ReadonlyMap<string, ObserverIdentitySymbolMapping>,
  candidateId: string,
): void {
  if (source.kind === 'retained-template-match') {
    exactKeys(source, ['kind', 'recognitionTemplateId'], 'retained-template cue source');
    if (!candidate.recognitionTemplateIds.includes(source.recognitionTemplateId)) fail('INVALID_CUE', 'template is not owned by candidate catalog entry');
    return;
  }
  if (source.kind === 'identity-claim-mapping') {
    exactKeys(source, ['kind', 'perceivedIdentitySymbolId', 'observerSymbolCandidateMappingId'], 'identity-claim cue source');
    const mapping = mappings.get(source.perceivedIdentitySymbolId);
    if (!mapping
      || mapping.candidateSemanticReferentId !== candidateId
      || source.observerSymbolCandidateMappingId !== mapping.observerSymbolCandidateMappingId) {
      fail('INVALID_SYMBOL_MAPPING', 'identity claim lacks the exact observer-owned symbol mapping');
    }
    return;
  }
  fail('INVALID_CUE', 'unknown recognition cue source');
}

function validateEvidenceRefs(
  refs: readonly RecognitionExperienceEvidenceRef[],
  experience: PreRecognitionSemanticExperience,
  referentId: PerceptualReferentId,
): void {
  const keys = refs.map(evidenceRefKey);
  for (let index = 0; index < keys.length; index += 1) {
    if (index > 0 && keys[index] <= keys[index - 1]) fail('INVALID_EVIDENCE_REFERENCE', 'recognition evidence refs must be unique and canonical');
    const ref = refs[index];
    if (ref.kind === 'continuant-classification') {
      exactKeys(ref, ['kind', 'classificationEvidenceId'], 'classification evidence ref');
      const match = experience.perceptualClassifications.find((value) => value.classificationEvidenceId === ref.classificationEvidenceId);
      if (!match || continuantKey(match.perceptualReferentId) !== continuantKey(referentId)) fail('INVALID_EVIDENCE_REFERENCE', 'classification evidence is unavailable for this track');
    } else if (ref.kind === 'perceived-binding') {
      exactKeys(ref, ['kind', 'perceivedBindingId'], 'binding evidence ref');
      const match = experience.perceivedBindings.find((value) => value.perceivedBindingId === ref.perceivedBindingId);
      if (!match || continuantKey(match.perceptualReferentId) !== continuantKey(referentId)) fail('INVALID_EVIDENCE_REFERENCE', 'binding evidence is unavailable for this track');
    } else if (ref.kind === 'supporting-observation') {
      exactKeys(ref, ['kind', 'supportingObservationId'], 'observation evidence ref');
      const support = ref.supportingObservationId;
      if (support.observerId !== experience.observerId || !availableObservationKeys(experience).has(observationKey(support))) fail('INVALID_EVIDENCE_REFERENCE', 'supporting observation is unavailable in this experience');
    } else {
      fail('INVALID_EVIDENCE_REFERENCE', 'unknown recognition evidence ref');
    }
  }
}

function availableObservationKeys(experience: PreRecognitionSemanticExperience): Set<string> {
  return new Set([
    ...experience.supportingObservationIds,
    ...experience.perceivedBindings.flatMap((value) => value.supportingObservationIds),
    ...experience.perceptualClassifications.flatMap((value) => value.supportingObservationIds),
    ...experience.perceptualEventClassifications.flatMap((value) => value.supportingObservationIds),
  ].map(observationKey));
}

function validateRuleResult(
  value: RecognitionRuleResult,
  catalog: ReadonlyMap<string, RecognitionCandidateCatalogEntry>,
  current: RecognitionResolutionRecord | undefined,
): void {
  if (!value || typeof value !== 'object') fail('INVALID_RULE_RESULT', 'recognition derivation returned no typed result');
  if (value.kind === 'no-update') {
    exactKeys(value, ['kind', 'reason'], 'no-update result');
    if (!['NoQualifyingCandidate', 'AmbiguousCandidates', 'SameCandidateMaintained'].includes(value.reason)) fail('INVALID_RULE_RESULT', 'unknown no-update reason');
  } else if (value.kind === 'assert-unique-candidate') {
    exactKeys(value, ['kind', 'candidateSemanticReferentId'], 'assert-candidate result');
    if (!catalog.has(value.candidateSemanticReferentId)) fail('INVALID_RULE_RESULT', 'rule asserted an ineligible candidate');
    if (current?.resolution.kind === 'asserted-candidate' && current.resolution.candidateSemanticReferentId === value.candidateSemanticReferentId) fail('INVALID_RULE_RESULT', 'same-candidate reevaluation cannot emit a duplicate resolution');
  } else if (value.kind === 'withdraw-current-resolution') {
    exactKeys(value, ['kind'], 'withdraw result');
    if (!current || current.resolution.kind !== 'asserted-candidate') fail('INVALID_RULE_RESULT', 'withdrawal requires a current asserted candidate');
  } else {
    fail('INVALID_RULE_RESULT', 'unknown recognition rule result');
  }
}

function validateResolution(value: RecognitionResolutionRecord): void {
  exactKeys(value, ['recognitionResolutionId', 'experienceId', 'observerId', 'perceptualReferentId', 'resolution', 'recognitionRuleId', 'evaluatedRecognitionCueEvidenceIds', 'revisesRecognitionResolutionId', 'occurredAt', 'recognitionVersion'], 'recognition resolution');
  if (value.recognitionResolutionId < 0n) fail('INVALID_RESOLUTION_HISTORY', 'recognition occurrence IDs must be nonnegative');
  if (value.experienceId < 0n) fail('INVALID_RESOLUTION_HISTORY', 'ExperienceId must be a nonnegative allocated occurrence');
  requireNonempty(value.observerId, 'observerId');
  requireNonempty(value.recognitionRuleId, 'recognitionRuleId');
  requireNonempty(value.recognitionVersion, 'recognitionVersion');
  validateContinuantId(value.perceptualReferentId, value.observerId);
  validateOrdinals(value.evaluatedRecognitionCueEvidenceIds, 'evaluated recognition cues');
  if (value.resolution.kind === 'asserted-candidate') {
    exactKeys(value.resolution, ['kind', 'candidateSemanticReferentId'], 'asserted recognition resolution');
    requireNonempty(value.resolution.candidateSemanticReferentId, 'candidateSemanticReferentId');
  } else if (value.resolution.kind === 'withdrawn') {
    exactKeys(value.resolution, ['kind'], 'withdrawn recognition resolution');
  } else fail('INVALID_RESOLUTION_HISTORY', 'unknown recognition resolution');
}

function validateContinuantId(value: PerceptualReferentId, observerId: string): void {
  const keys = Object.keys(value).sort(compareText);
  if (keys.length !== 2 || keys[0] !== 'observerId' || keys[1] !== 'observerTrackSequence') fail('CARRIER_TYPE_MISMATCH', 'recognition requires a continuant-file carrier');
  if (value.observerId !== observerId) fail('CROSS_OBSERVER_REFERENCE', 'continuant-file belongs to another observer');
  if (typeof value.observerTrackSequence !== 'bigint' || value.observerTrackSequence < 0n) fail('CARRIER_TYPE_MISMATCH', 'invalid continuant-file identity');
}

function exactKeys(value: object, allowed: readonly string[], description: string): void {
  const set = new Set(allowed);
  for (const key of Object.keys(value)) if (!set.has(key)) {
    const forbidden = /truth|world|eventBinding|semanticAction|correct|confidence|score|rank|llm|prose/i.test(key);
    fail(forbidden ? 'FORBIDDEN_TRUTH_FIELD' : 'INVALID_MODEL', `${description} contains forbidden field ${key}`);
  }
}

function validateStrings(values: readonly string[], description: string, allowEmpty: boolean): void {
  if (!allowEmpty && values.length === 0) fail('INVALID_CATALOG', `${description} must not be empty`);
  let prior = '';
  for (const value of values) {
    if (!value || value <= prior) fail('INVALID_CATALOG', `${description} must be nonempty, unique, and canonical`);
    prior = value;
  }
}

function evidenceRefKey(value: RecognitionExperienceEvidenceRef): string {
  if (value.kind === 'continuant-classification') return `1:${value.classificationEvidenceId}`;
  if (value.kind === 'perceived-binding') return `2:${value.perceivedBindingId}`;
  if (value.kind === 'supporting-observation') return `3:${observationKey(value.supportingObservationId)}`;
  return '9:invalid';
}

function freezeRuleResult(value: RecognitionRuleResult): RecognitionRuleResult { return Object.freeze({ ...value }); }
function freezeResolution(value: RecognitionResolutionRecord): RecognitionResolutionRecord { return Object.freeze({ ...value, perceptualReferentId: freezeContinuantId(value.perceptualReferentId), resolution: Object.freeze({ ...value.resolution }), evaluatedRecognitionCueEvidenceIds: Object.freeze([...value.evaluatedRecognitionCueEvidenceIds]) }); }
function freezeContinuantId(value: PerceptualReferentId): PerceptualReferentId { return Object.freeze({ ...value }); }
function continuantKey(value: PerceptualReferentId): string { return `${value.observerId}:${value.observerTrackSequence}`; }
function observationKey(value: SupportingObservationId): string { return `${value.observerId}:${value.observationId}`; }
function mappingKey(value: ObserverIdentitySymbolMapping): string { return value.perceivedIdentitySymbolId; }
function compareCues(a: PermittedRecognitionCueEvidence, b: PermittedRecognitionCueEvidence): number { return compareOrdinal(a.recognitionCueEvidenceId, b.recognitionCueEvidenceId); }
/** Duplicate-free, strictly ascending list of allocated occurrence ordinals. */
function validateOrdinals(values: readonly bigint[], description: string): void {
  let prior: bigint | undefined;
  for (const value of values) {
    if (typeof value !== 'bigint' || value < 0n) fail('INVALID_MODEL', `${description} must be nonnegative allocated occurrences`);
    if (prior !== undefined && value <= prior) fail('INVALID_MODEL', `${description} must be unique and canonical`);
    prior = value;
  }
}
function compareResolutions(a: RecognitionResolutionRecord, b: RecognitionResolutionRecord): number { return a.recognitionResolutionId < b.recognitionResolutionId ? -1 : a.recognitionResolutionId > b.recognitionResolutionId ? 1 : 0; }
function compareText(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function requireCanonical<T>(supplied: readonly T[], canonical: readonly T[], key: (value: T) => string, description: string): void { if (supplied.length !== canonical.length || supplied.some((value, index) => key(value) !== key(canonical[index]))) fail('INVALID_MODEL', `${description} must be canonical`); }
function requireNonempty(value: string, description: string): void { if (!value) fail('INVALID_MODEL', `${description} must be nonempty`); }
function fail(code: RecognitionFailureCode, message: string): never { throw new RecognitionContractError(code, message); }

/** Numeric ordering over opaque allocated ordinals; never lexicographic over their digits. */
function compareOrdinal(left: bigint, right: bigint): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
