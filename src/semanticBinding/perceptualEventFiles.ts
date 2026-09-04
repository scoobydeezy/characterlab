import { EventRoleId, type EventRoleEvidence } from './eventBindings';
import type { PerceptualReferentId, SupportingObservationId } from './perceptualContinuantFiles';
import {
  validateExperienceClassifications,
  type PerceptualClassificationEvidence,
} from './perceptualClassification';
import {
  validateExperienceEventClassifications,
  type PerceptualEventClassificationEvidence,
} from './perceptualEventClassification';

export const PERCEPTUAL_EVENT_FILE_CONTRACT_VERSION = 'semantic-binding/0.1-candidate#SEM-001C' as const;

// `PerceptualReferentId` and `SupportingObservationId` are accepted `SEM-001A` shapes owned by the
// continuant-file seam. They are re-exported so existing `SEM-001C` consumers are unaffected.
export type { PerceptualReferentId, SupportingObservationId } from './perceptualContinuantFiles';

export interface PerceptualEventReferentId {
  readonly observerId: string;
  readonly observerEventSequence: bigint;
}

/** Type 215. */
export interface CurrentEventDetectionId {
  readonly observerId: string;
  /** Allocated typed `EventDetectionOccurrenceId` occurrence (namespace 1113). */
  readonly eventDetectionOccurrenceId: bigint;
}

export type EventContinuityKind = 'NewEventFile' | 'ContinuesPriorEventFile';

export interface PerceptualEventTransitionRequest {
  readonly observerId: string;
  readonly priorPerceptualEventReferentId?: PerceptualEventReferentId;
  readonly currentEventDetectionId: CurrentEventDetectionId;
  readonly continuityKind: EventContinuityKind;
  readonly supportingObservationIds: readonly SupportingObservationId[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

export interface PerceptualEventTransition extends PerceptualEventTransitionRequest {
  readonly perceptualEventReferentId: PerceptualEventReferentId;
}

export interface PerceptualEventEndRequest {
  readonly observerId: string;
  readonly perceptualEventReferentId: PerceptualEventReferentId;
  readonly supportingObservationIds: readonly SupportingObservationId[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

export interface PerceptualEventEnd extends PerceptualEventEndRequest {}

export interface PerceptualEventFileState {
  readonly nextEventSequenceByObserver: ReadonlyMap<string, bigint>;
  readonly activeEventFiles: readonly PerceptualEventReferentId[];
}

export interface EventTransitionResult {
  readonly state: PerceptualEventFileState;
  readonly transition: PerceptualEventTransition;
}

export interface EventEndResult {
  readonly state: PerceptualEventFileState;
  readonly eventEnd: PerceptualEventEnd;
}

export interface PerceivedBindingRequest {
  readonly observerId: string;
  readonly perceptualEventReferentId: PerceptualEventReferentId;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly eventRoleEvidence: EventRoleEvidence;
  readonly supportingObservationIds: readonly SupportingObservationId[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

export interface PerceivedBindingEvidence extends PerceivedBindingRequest {
  readonly perceivedBindingId: bigint;
}

export interface CompiledPerceivedBindings {
  readonly bindings: readonly PerceivedBindingEvidence[];
  readonly nextRuntimeId: bigint;
}

export interface PreRecognitionSemanticExperience {
  /** Allocated typed `ExperienceId` occurrence (namespace 1106). */
  readonly experienceId: bigint;
  readonly observerId: string;
  readonly occurredAt: bigint;
  readonly perceptualEventReferentIds: readonly PerceptualEventReferentId[];
  readonly perceivedBindings: readonly PerceivedBindingEvidence[];
  readonly perceptualClassifications: readonly PerceptualClassificationEvidence[];
  readonly perceptualEventClassifications: readonly PerceptualEventClassificationEvidence[];
  readonly supportingObservationIds: readonly SupportingObservationId[];
  readonly transformationVersion: string;
}

export type PerceptualEventFileFailureCode =
  | 'INVALID_EVENT_FILE_STATE'
  | 'INVALID_EVENT_TRANSITION'
  | 'INVALID_EVENT_END'
  | 'CROSS_OBSERVER_REFERENCE'
  | 'INACTIVE_EVENT_FILE'
  | 'INVALID_SUPPORTING_OBSERVATION'
  | 'FORBIDDEN_TRUTH_FIELD'
  | 'ACTION_AS_CONTINUANT_FILE'
  | 'INVALID_PERCEIVED_BINDING'
  | 'INVALID_EXPERIENCE'
  | 'INVALID_ALLOCATOR_STATE';

export class PerceptualEventFileContractError extends Error {
  constructor(readonly code: PerceptualEventFileFailureCode, message: string) {
    super(message);
    this.name = 'PerceptualEventFileContractError';
  }
}

export function emptyPerceptualEventFileState(): PerceptualEventFileState {
  return freezeState(new Map(), []);
}

export function clonePerceptualEventFileState(state: PerceptualEventFileState): PerceptualEventFileState {
  validateState(state);
  return freezeState(new Map(state.nextEventSequenceByObserver), state.activeEventFiles.map(cloneEventId));
}

export function applyPerceptualEventTransition(
  state: PerceptualEventFileState,
  request: PerceptualEventTransitionRequest,
): EventTransitionResult {
  validateState(state);
  validateExactKeys(request, [
    'observerId', 'priorPerceptualEventReferentId', 'currentEventDetectionId', 'continuityKind',
    'supportingObservationIds', 'occurredAt', 'transformationVersion',
  ], 'event transition');
  validateCommonObservationContext(
    request.observerId,
    request.currentEventDetectionId,
    request.supportingObservationIds,
    request.transformationVersion,
  );

  const active = state.activeEventFiles.map(cloneEventId);
  const sequences = new Map(state.nextEventSequenceByObserver);
  let eventId: PerceptualEventReferentId;
  if (request.continuityKind === 'NewEventFile') {
    if (request.priorPerceptualEventReferentId !== undefined) {
      fail('INVALID_EVENT_TRANSITION', 'NewEventFile cannot name a prior event-file');
    }
    const next = sequences.get(request.observerId) ?? 0n;
    if (next < 0n) fail('INVALID_ALLOCATOR_STATE', 'observer event sequence must be nonnegative');
    eventId = freezeEventId({ observerId: request.observerId, observerEventSequence: next });
    sequences.set(request.observerId, next + 1n);
    active.push(eventId);
  } else if (request.continuityKind === 'ContinuesPriorEventFile') {
    const prior = request.priorPerceptualEventReferentId;
    if (!prior) fail('INVALID_EVENT_TRANSITION', 'ContinuesPriorEventFile requires a prior event-file');
    requireSameObserver(request.observerId, prior.observerId, 'prior event-file');
    const existing = active.find((candidate) => equalEventId(candidate, prior));
    if (!existing) fail('INACTIVE_EVENT_FILE', 'prior event-file is not active');
    eventId = cloneEventId(existing);
  } else {
    fail('INVALID_EVENT_TRANSITION', `unknown continuity kind ${String(request.continuityKind)}`);
  }

  const nextState = freezeState(sequences, active);
  const transition: PerceptualEventTransition = Object.freeze({
    observerId: request.observerId,
    priorPerceptualEventReferentId: request.priorPerceptualEventReferentId
      ? freezeEventId(request.priorPerceptualEventReferentId) : undefined,
    currentEventDetectionId: Object.freeze({ ...request.currentEventDetectionId }),
    continuityKind: request.continuityKind,
    supportingObservationIds: freezeObservations(request.supportingObservationIds),
    occurredAt: request.occurredAt,
    transformationVersion: request.transformationVersion,
    perceptualEventReferentId: eventId,
  });
  return Object.freeze({ state: nextState, transition });
}

export function endPerceptualEventFile(
  state: PerceptualEventFileState,
  request: PerceptualEventEndRequest,
): EventEndResult {
  validateState(state);
  validateExactKeys(request, [
    'observerId', 'perceptualEventReferentId', 'supportingObservationIds', 'occurredAt', 'transformationVersion',
  ], 'event end', 'INVALID_EVENT_END');
  requireNonempty(request.observerId, 'observerId');
  requireNonempty(request.transformationVersion, 'transformationVersion');
  requireSameObserver(request.observerId, request.perceptualEventReferentId.observerId, 'event-file');
  validateSupportingObservations(request.observerId, request.supportingObservationIds);
  const index = state.activeEventFiles.findIndex((candidate) => equalEventId(candidate, request.perceptualEventReferentId));
  if (index < 0) fail('INACTIVE_EVENT_FILE', 'cannot end an inactive event-file');
  const active = state.activeEventFiles.map(cloneEventId);
  active.splice(index, 1);
  const nextState = freezeState(new Map(state.nextEventSequenceByObserver), active);
  const eventEnd: PerceptualEventEnd = Object.freeze({
    ...request,
    perceptualEventReferentId: freezeEventId(request.perceptualEventReferentId),
    supportingObservationIds: freezeObservations(request.supportingObservationIds),
  });
  return Object.freeze({ state: nextState, eventEnd });
}

export function compilePerceivedBindings(
  requests: readonly PerceivedBindingRequest[],
  nextRuntimeId: bigint,
): CompiledPerceivedBindings {
  if (nextRuntimeId < 0n) fail('INVALID_ALLOCATOR_STATE', 'nextRuntimeId must be nonnegative');
  const canonical = requests.map((request, index) => validateBinding(request, index)).sort(compareBindingRequests);
  const seen = new Set<string>();
  for (const request of canonical) {
    const signature = bindingSignature(request);
    if (seen.has(signature)) fail('INVALID_PERCEIVED_BINDING', 'duplicate perceived event/object/role binding');
    seen.add(signature);
  }
  const bindings = canonical.map((request, index): PerceivedBindingEvidence => Object.freeze({
    ...request,
    perceptualEventReferentId: freezeEventId(request.perceptualEventReferentId),
    perceptualReferentId: freezeContinuantId(request.perceptualReferentId),
    eventRoleEvidence: Object.freeze({ ...request.eventRoleEvidence }),
    supportingObservationIds: freezeObservations(request.supportingObservationIds),
    perceivedBindingId: nextRuntimeId + BigInt(index),
  }));
  return Object.freeze({ bindings: Object.freeze(bindings), nextRuntimeId: nextRuntimeId + BigInt(bindings.length) });
}

export function assemblePreRecognitionExperience(input: PreRecognitionSemanticExperience): PreRecognitionSemanticExperience {
  validateExactKeys(input, [
    'experienceId', 'observerId', 'occurredAt', 'perceptualEventReferentIds', 'perceivedBindings',
    'perceptualClassifications', 'perceptualEventClassifications',
    'supportingObservationIds', 'transformationVersion',
  ], 'semantic experience', 'INVALID_EXPERIENCE');
  if (input.experienceId < 0n) fail('INVALID_EXPERIENCE', 'ExperienceId must be a nonnegative allocated occurrence');
  requireNonempty(input.observerId, 'observerId');
  requireNonempty(input.transformationVersion, 'transformationVersion');
  validateSupportingObservations(input.observerId, input.supportingObservationIds);
  const eventIds = [...input.perceptualEventReferentIds].map(freezeEventId).sort(compareEventIds);
  const eventKeys = new Set<string>();
  for (const eventId of eventIds) {
    requireSameObserver(input.observerId, eventId.observerId, 'experience event-file');
    const key = eventKey(eventId);
    if (eventKeys.has(key)) fail('INVALID_EXPERIENCE', 'duplicate event-file in experience');
    eventKeys.add(key);
  }
  const bindings = [...input.perceivedBindings].sort(compareBindingsById);
  const bindingIds = new Set<bigint>();
  for (const binding of bindings) {
    if (bindingIds.has(binding.perceivedBindingId)) fail('INVALID_EXPERIENCE', 'duplicate perceived binding identity');
    bindingIds.add(binding.perceivedBindingId);
    requireSameObserver(input.observerId, binding.observerId, 'experience binding');
    if (!eventKeys.has(eventKey(binding.perceptualEventReferentId))) {
      fail('INVALID_EXPERIENCE', 'binding event-file is absent from experience event-file set');
    }
  }
  validateExperienceClassifications(input.experienceId, input.perceptualClassifications);
  const continuantClassifications = [...input.perceptualClassifications]
    .sort((left, right) => left.classificationEvidenceId < right.classificationEvidenceId ? -1
      : left.classificationEvidenceId > right.classificationEvidenceId ? 1 : 0);
  for (const classification of continuantClassifications) {
    requireSameObserver(input.observerId, classification.observerId, 'experience continuant classification');
  }
  validateExperienceEventClassifications(input.experienceId, input.perceptualEventClassifications);
  const eventClassifications = [...input.perceptualEventClassifications]
    .sort((left, right) => left.eventClassificationEvidenceId < right.eventClassificationEvidenceId ? -1
      : left.eventClassificationEvidenceId > right.eventClassificationEvidenceId ? 1 : 0);
  for (const classification of eventClassifications) {
    requireSameObserver(input.observerId, classification.observerId, 'experience event classification');
    if (!eventKeys.has(eventKey(classification.perceptualEventReferentId))) {
      fail('INVALID_EXPERIENCE', 'classification event-file is absent from experience event-file set');
    }
  }
  return Object.freeze({
    ...input,
    perceptualEventReferentIds: Object.freeze(eventIds),
    perceivedBindings: Object.freeze(bindings),
    perceptualClassifications: Object.freeze(continuantClassifications),
    perceptualEventClassifications: Object.freeze(eventClassifications),
    supportingObservationIds: freezeObservations(input.supportingObservationIds),
  });
}

/** Ordinal-free grouping view used only for semantic/psychological opacity proofs. */
export function perceivedEventGrouping(experience: PreRecognitionSemanticExperience): readonly (readonly string[])[] {
  const groups = experience.perceptualEventReferentIds.map((eventId) => experience.perceivedBindings
    .filter((binding) => equalEventId(binding.perceptualEventReferentId, eventId))
    .map((binding) => `${roleKey(binding.eventRoleEvidence)}=${continuantSemanticKey(binding.perceptualReferentId)}`)
    .sort(compareText));
  return Object.freeze(groups.map((group) => Object.freeze(group)).sort(compareStringLists));
}

export function eventFileStateSummary(state: PerceptualEventFileState): readonly string[] {
  validateState(state);
  const sequences = [...state.nextEventSequenceByObserver.entries()]
    .sort((left, right) => compareText(left[0], right[0]))
    .map(([observer, next]) => `next:${observer}:${next}`);
  const active = [...state.activeEventFiles].sort(compareEventIds)
    .map((eventId) => `active:${eventId.observerId}:${eventId.observerEventSequence}`);
  return Object.freeze([...sequences, ...active]);
}

function validateBinding(request: PerceivedBindingRequest, index: number): PerceivedBindingRequest {
  validateExactKeys(request, [
    'observerId', 'perceptualEventReferentId', 'perceptualReferentId', 'eventRoleEvidence',
    'supportingObservationIds', 'occurredAt', 'transformationVersion',
  ], `perceived binding ${index}`, 'INVALID_PERCEIVED_BINDING');
  requireNonempty(request.observerId, 'observerId');
  requireNonempty(request.transformationVersion, 'transformationVersion');
  requireSameObserver(request.observerId, request.perceptualEventReferentId.observerId, 'event-file');
  requireSameObserver(request.observerId, request.perceptualReferentId.observerId, 'continuant-file');
  if (request.perceptualEventReferentId.observerEventSequence < 0n || request.perceptualReferentId.observerTrackSequence < 0n) {
    fail('INVALID_PERCEIVED_BINDING', 'perceptual sequences must be nonnegative');
  }
  validateSupportingObservations(request.observerId, request.supportingObservationIds);
  if (request.eventRoleEvidence.kind === 'exact' && request.eventRoleEvidence.eventRoleId === EventRoleId.Action) {
    fail('ACTION_AS_CONTINUANT_FILE', 'Action evidence cannot bind a continuant-file as the action carrier');
  }
  if (request.eventRoleEvidence.kind !== 'exact' && request.eventRoleEvidence.kind !== 'unresolved') {
    fail('INVALID_PERCEIVED_BINDING', 'unknown event role evidence variant');
  }
  return request;
}

function validateState(state: PerceptualEventFileState): void {
  const active = new Set<string>();
  for (const [observer, next] of state.nextEventSequenceByObserver) {
    if (!observer || next < 0n) fail('INVALID_EVENT_FILE_STATE', 'invalid observer event sequence');
  }
  for (const eventId of state.activeEventFiles) {
    validateEventId(eventId);
    const next = state.nextEventSequenceByObserver.get(eventId.observerId);
    if (next === undefined || eventId.observerEventSequence >= next) {
      fail('INVALID_EVENT_FILE_STATE', 'active event-file is not covered by observer allocator state');
    }
    const key = eventKey(eventId);
    if (active.has(key)) fail('INVALID_EVENT_FILE_STATE', 'duplicate active event-file');
    active.add(key);
  }
}

function validateCommonObservationContext(
  observerId: string,
  detectionId: CurrentEventDetectionId,
  supportingObservationIds: readonly SupportingObservationId[],
  transformationVersion: string,
): void {
  requireNonempty(observerId, 'observerId');
  requireNonempty(transformationVersion, 'transformationVersion');
  validateExactKeys(detectionId, ['observerId', 'eventDetectionOccurrenceId'], 'current event detection');
  requireSameObserver(observerId, detectionId.observerId, 'current event detection');
  requireNonnegative(detectionId.eventDetectionOccurrenceId, 'eventDetectionOccurrenceId');
  validateSupportingObservations(observerId, supportingObservationIds);
}

function validateSupportingObservations(observerId: string, observations: readonly SupportingObservationId[]): void {
  if (observations.length === 0) fail('INVALID_SUPPORTING_OBSERVATION', 'at least one supporting observation is required');
  let prior: bigint | undefined;
  for (const observation of observations) {
    validateExactKeys(observation, ['observerId', 'observationId'], 'supporting observation', 'INVALID_SUPPORTING_OBSERVATION');
    requireSameObserver(observerId, observation.observerId, 'supporting observation');
    requireNonnegative(observation.observationId, 'observationId');
    if (prior !== undefined && observation.observationId <= prior) {
      fail('INVALID_SUPPORTING_OBSERVATION', 'supporting observations must be unique and strictly canonical');
    }
    prior = observation.observationId;
  }
}

function validateEventId(eventId: PerceptualEventReferentId): void {
  validateExactKeys(eventId, ['observerId', 'observerEventSequence'], 'perceptual event-file identity');
  if (!eventId.observerId || eventId.observerEventSequence < 0n) {
    fail('INVALID_EVENT_FILE_STATE', 'invalid perceptual event-file identity');
  }
}

/**
 * A forbidden field is reported against the construct being validated. `code` names that construct,
 * so first divergence identifies the record that was malformed rather than defaulting every seam
 * boundary to the event-transition code. A truth-shaped field is reported as truth leakage
 * regardless of the construct, because that is the more specific divergence.
 */
function validateExactKeys(
  value: object,
  allowed: readonly string[],
  description: string,
  code: PerceptualEventFileFailureCode = 'INVALID_EVENT_TRANSITION',
): void {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(value)) {
    if (!allowedSet.has(key)) {
      const truthLike = /truth|worldEvent|actionConcept|semanticReferent/i.test(key);
      fail(truthLike ? 'FORBIDDEN_TRUTH_FIELD' : code, `${description} contains forbidden field ${key}`);
    }
  }
}

function freezeState(
  sequences: ReadonlyMap<string, bigint>,
  active: readonly PerceptualEventReferentId[],
): PerceptualEventFileState {
  const result = Object.freeze({
    nextEventSequenceByObserver: new Map([...sequences.entries()].sort((left, right) => compareText(left[0], right[0]))),
    activeEventFiles: Object.freeze([...active].map(freezeEventId).sort(compareEventIds)),
  });
  validateState(result);
  return result;
}

function freezeEventId(eventId: PerceptualEventReferentId): PerceptualEventReferentId {
  validateEventId(eventId);
  return Object.freeze({ ...eventId });
}

function freezeContinuantId(continuantId: PerceptualReferentId): PerceptualReferentId {
  if (!continuantId.observerId || continuantId.observerTrackSequence < 0n) fail('INVALID_PERCEIVED_BINDING', 'invalid continuant-file identity');
  return Object.freeze({ ...continuantId });
}

function freezeObservations(observations: readonly SupportingObservationId[]): readonly SupportingObservationId[] {
  return Object.freeze(observations.map((observation) => Object.freeze({ ...observation })));
}

function compareEventIds(left: PerceptualEventReferentId, right: PerceptualEventReferentId): number {
  return compareText(left.observerId, right.observerId)
    || (left.observerEventSequence < right.observerEventSequence ? -1
      : left.observerEventSequence > right.observerEventSequence ? 1 : 0);
}

function compareBindingRequests(left: PerceivedBindingRequest, right: PerceivedBindingRequest): number {
  return compareEventIds(left.perceptualEventReferentId, right.perceptualEventReferentId)
    || compareText(roleKey(left.eventRoleEvidence), roleKey(right.eventRoleEvidence))
    || compareText(continuantSemanticKey(left.perceptualReferentId), continuantSemanticKey(right.perceptualReferentId));
}

function compareBindingsById(left: PerceivedBindingEvidence, right: PerceivedBindingEvidence): number {
  return left.perceivedBindingId < right.perceivedBindingId ? -1 : left.perceivedBindingId > right.perceivedBindingId ? 1 : 0;
}

function compareStringLists(left: readonly string[], right: readonly string[]): number {
  return compareText(left.join('\u0000'), right.join('\u0000'));
}

function roleKey(role: EventRoleEvidence): string {
  return role.kind === 'exact' ? `exact:${role.eventRoleId}` : 'unresolved';
}

function continuantSemanticKey(continuantId: PerceptualReferentId): string {
  return `continuant-file:${continuantId.observerTrackSequence}`;
}

function bindingSignature(binding: PerceivedBindingRequest): string {
  return `${eventKey(binding.perceptualEventReferentId)}\u0000${roleKey(binding.eventRoleEvidence)}\u0000${continuantSemanticKey(binding.perceptualReferentId)}`;
}

function eventKey(eventId: PerceptualEventReferentId): string {
  return `${eventId.observerId}\u0000${eventId.observerEventSequence}`;
}

function equalEventId(left: PerceptualEventReferentId, right: PerceptualEventReferentId): boolean {
  return left.observerId === right.observerId && left.observerEventSequence === right.observerEventSequence;
}

function cloneEventId(eventId: PerceptualEventReferentId): PerceptualEventReferentId {
  return { observerId: eventId.observerId, observerEventSequence: eventId.observerEventSequence };
}

function requireSameObserver(expected: string, actual: string, description: string): void {
  if (expected !== actual) fail('CROSS_OBSERVER_REFERENCE', `${description} belongs to another observer`);
}

function requireNonempty(value: string, description: string): void {
  if (!value) fail('INVALID_EVENT_TRANSITION', `${description} must be nonempty`);
}

/** Allocated occurrence ordinals are opaque but must be well-formed. */
function requireNonnegative(value: bigint, description: string): void {
  if (typeof value !== 'bigint' || value < 0n) {
    fail('INVALID_EVENT_TRANSITION', `${description} must be a nonnegative allocated occurrence`);
  }
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function fail(code: PerceptualEventFileFailureCode, message: string): never {
  throw new PerceptualEventFileContractError(code, message);
}
