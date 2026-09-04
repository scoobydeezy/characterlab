export const PERCEPTUAL_CONTINUANT_FILE_CONTRACT_VERSION = 'semantic-binding/0.1-candidate#SEM-001A' as const;

/**
 * Observer-relative perceptual continuant-file identity. Makes no claim that truth-side
 * identity is continuous, unchanged, or of any particular kind. The ordinal is opaque.
 */
export interface PerceptualReferentId {
  readonly observerId: string;
  readonly observerTrackSequence: bigint;
}

/** Type 214. Observer-side detection occurrence; never a truth handle. */
export interface CurrentDetectionId {
  readonly observerId: string;
  /** Allocated typed `DetectionOccurrenceId` occurrence (namespace 1112). */
  readonly detectionOccurrenceId: bigint;
}

/** Type 216. */
export interface SupportingObservationId {
  readonly observerId: string;
  /** Allocated typed `ObservationId` occurrence (namespace 1115). */
  readonly observationId: bigint;
}

export type ContinuityKind = 'NewTrack' | 'ContinuesPriorTrack';

export interface PerceptualTrackTransitionRequest {
  readonly observerId: string;
  readonly priorPerceptualReferentId?: PerceptualReferentId;
  readonly currentDetectionId: CurrentDetectionId;
  readonly continuityKind: ContinuityKind;
  readonly supportingObservationIds: readonly SupportingObservationId[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

/** Type 217. Occurrence identity is `CurrentDetectionId`; the resulting file ID is explicit. */
export interface PerceptualTrackTransition extends PerceptualTrackTransitionRequest {
  readonly perceptualReferentId: PerceptualReferentId;
}

export interface PerceptualTrackEndRequest {
  readonly observerId: string;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly supportingObservationIds: readonly SupportingObservationId[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

/** Type 218. Occurrence identity is `PerceptualReferentId`; at most one retirement per file. */
export interface PerceptualTrackEnd extends PerceptualTrackEndRequest {}

/** Type 241. Observer-scoped allocator state; ending a file never frees its sequence. */
export interface PerceptualContinuantFileState {
  readonly nextTrackSequenceByObserver: ReadonlyMap<string, bigint>;
  readonly activePerceptualReferentIds: readonly PerceptualReferentId[];
}

export interface TrackTransitionResult {
  readonly state: PerceptualContinuantFileState;
  readonly transition: PerceptualTrackTransition;
}

export interface TrackEndResult {
  readonly state: PerceptualContinuantFileState;
  readonly trackEnd: PerceptualTrackEnd;
}

export type PerceptualContinuantFileFailureCode =
  | 'INVALID_CONTINUANT_FILE_STATE'
  | 'INVALID_TRACK_TRANSITION'
  | 'INVALID_TRACK_END'
  | 'CROSS_OBSERVER_REFERENCE'
  | 'INACTIVE_CONTINUANT_FILE'
  | 'DUPLICATE_DETECTION_TRANSITION'
  | 'INVALID_SUPPORTING_OBSERVATION'
  | 'FORBIDDEN_TRUTH_FIELD'
  | 'INVALID_ALLOCATOR_STATE';

export class PerceptualContinuantFileContractError extends Error {
  constructor(readonly code: PerceptualContinuantFileFailureCode, message: string) {
    super(message);
    this.name = 'PerceptualContinuantFileContractError';
  }
}

export function emptyPerceptualContinuantFileState(): PerceptualContinuantFileState {
  return freezeState(new Map(), []);
}

export function clonePerceptualContinuantFileState(
  state: PerceptualContinuantFileState,
): PerceptualContinuantFileState {
  validateState(state);
  return freezeState(
    new Map(state.nextTrackSequenceByObserver),
    state.activePerceptualReferentIds.map(cloneReferentId),
  );
}

/**
 * Applies one observer-side detection to the continuant-file lifecycle.
 *
 * `NewTrack` allocates the observer's next sequence and never reuses a retired one.
 * `ContinuesPriorTrack` resolves to exactly the named prior file, which must still be active.
 * Truth identity is not an input and performs no correction, merge, or repair.
 */
export function applyPerceptualTrackTransition(
  state: PerceptualContinuantFileState,
  request: PerceptualTrackTransitionRequest,
): TrackTransitionResult {
  validateState(state);
  validateExactKeys(request, [
    'observerId', 'priorPerceptualReferentId', 'currentDetectionId', 'continuityKind',
    'supportingObservationIds', 'occurredAt', 'transformationVersion',
  ], 'track transition');
  requireNonempty(request.observerId, 'observerId');
  requireNonempty(request.transformationVersion, 'transformationVersion');
  validateExactKeys(request.currentDetectionId, ['observerId', 'detectionOccurrenceId'], 'current detection');
  requireSameObserver(request.observerId, request.currentDetectionId.observerId, 'current detection');
  requireNonnegative(request.currentDetectionId.detectionOccurrenceId, 'detectionOccurrenceId');
  validateSupportingObservations(request.observerId, request.supportingObservationIds);

  const active = state.activePerceptualReferentIds.map(cloneReferentId);
  const sequences = new Map(state.nextTrackSequenceByObserver);
  let referentId: PerceptualReferentId;

  if (request.continuityKind === 'NewTrack') {
    if (request.priorPerceptualReferentId !== undefined) {
      fail('INVALID_TRACK_TRANSITION', 'NewTrack cannot name a prior continuant-file');
    }
    const next = sequences.get(request.observerId) ?? 0n;
    if (next < 0n) fail('INVALID_ALLOCATOR_STATE', 'observer track sequence must be nonnegative');
    referentId = freezeReferentId({ observerId: request.observerId, observerTrackSequence: next });
    sequences.set(request.observerId, next + 1n);
    active.push(referentId);
  } else if (request.continuityKind === 'ContinuesPriorTrack') {
    const prior = request.priorPerceptualReferentId;
    if (!prior) fail('INVALID_TRACK_TRANSITION', 'ContinuesPriorTrack requires a prior continuant-file');
    requireSameObserver(request.observerId, prior.observerId, 'prior continuant-file');
    const existing = active.find((candidate) => equalReferentId(candidate, prior));
    if (!existing) fail('INACTIVE_CONTINUANT_FILE', 'prior continuant-file is not active');
    referentId = cloneReferentId(existing);
  } else {
    fail('INVALID_TRACK_TRANSITION', `unknown continuity kind ${String(request.continuityKind)}`);
  }

  const nextState = freezeState(sequences, active);
  const transition: PerceptualTrackTransition = Object.freeze({
    observerId: request.observerId,
    priorPerceptualReferentId: request.priorPerceptualReferentId
      ? freezeReferentId(request.priorPerceptualReferentId) : undefined,
    currentDetectionId: Object.freeze({ ...request.currentDetectionId }),
    continuityKind: request.continuityKind,
    supportingObservationIds: freezeObservations(request.supportingObservationIds),
    occurredAt: request.occurredAt,
    transformationVersion: request.transformationVersion,
    perceptualReferentId: freezeReferentId(referentId),
  });
  return Object.freeze({ state: nextState, transition });
}

/** Retires one continuant-file. Its observer sequence is never decremented, freed, or reused. */
export function endPerceptualContinuantFile(
  state: PerceptualContinuantFileState,
  request: PerceptualTrackEndRequest,
): TrackEndResult {
  validateState(state);
  validateExactKeys(request, [
    'observerId', 'perceptualReferentId', 'supportingObservationIds', 'occurredAt', 'transformationVersion',
  ], 'track end', 'INVALID_TRACK_END');
  requireNonempty(request.observerId, 'observerId');
  requireNonempty(request.transformationVersion, 'transformationVersion');
  requireSameObserver(request.observerId, request.perceptualReferentId.observerId, 'continuant-file');
  validateSupportingObservations(request.observerId, request.supportingObservationIds);
  const index = state.activePerceptualReferentIds
    .findIndex((candidate) => equalReferentId(candidate, request.perceptualReferentId));
  if (index < 0) fail('INACTIVE_CONTINUANT_FILE', 'cannot end an inactive continuant-file');
  const active = state.activePerceptualReferentIds.map(cloneReferentId);
  active.splice(index, 1);
  const nextState = freezeState(new Map(state.nextTrackSequenceByObserver), active);
  const trackEnd: PerceptualTrackEnd = Object.freeze({
    ...request,
    perceptualReferentId: freezeReferentId(request.perceptualReferentId),
    supportingObservationIds: freezeObservations(request.supportingObservationIds),
  });
  return Object.freeze({ state: nextState, trackEnd });
}

/**
 * Enforces the accepted occurrence key: exactly one track transition per continuant detection.
 * `SEM-001I.1` keys type 217 by `CurrentDetectionId` rather than an allocated occurrence ID.
 */
export function assertUniqueTrackTransitions(transitions: readonly PerceptualTrackTransition[]): void {
  const seen = new Set<string>();
  for (const transition of transitions) {
    const key = detectionKey(transition.currentDetectionId);
    if (seen.has(key)) {
      fail('DUPLICATE_DETECTION_TRANSITION', 'a continuant detection may key exactly one track transition');
    }
    seen.add(key);
  }
}

/**
 * Ordinal-free continuity view used only for psychological-opacity proofs. Track identities are
 * relabelled by first appearance over the canonically ordered detections, so two runs that differ
 * solely in allocated ordinals produce an identical view.
 */
export function continuantTrackSemanticView(
  transitions: readonly PerceptualTrackTransition[],
): readonly string[] {
  const ordered = [...transitions].sort((left, right) =>
    compareText(detectionKey(left.currentDetectionId), detectionKey(right.currentDetectionId)));
  const labels = new Map<string, number>();
  const label = (referentId: PerceptualReferentId): string => {
    const key = referentKey(referentId);
    if (!labels.has(key)) labels.set(key, labels.size);
    return `file#${labels.get(key)}`;
  };
  return Object.freeze(ordered.map((transition) => [
    `detection:${transition.currentDetectionId.detectionOccurrenceId}`,
    `continuity:${transition.continuityKind}`,
    `prior:${transition.priorPerceptualReferentId ? label(transition.priorPerceptualReferentId) : 'none'}`,
    `result:${label(transition.perceptualReferentId)}`,
  ].join('|')));
}

export function continuantFileStateSummary(state: PerceptualContinuantFileState): readonly string[] {
  validateState(state);
  const sequences = [...state.nextTrackSequenceByObserver.entries()]
    .sort((left, right) => compareText(left[0], right[0]))
    .map(([observer, next]) => `next:${observer}:${next}`);
  const active = [...state.activePerceptualReferentIds].sort(compareReferentIds)
    .map((referentId) => `active:${referentId.observerId}:${referentId.observerTrackSequence}`);
  return Object.freeze([...sequences, ...active]);
}

function validateState(state: PerceptualContinuantFileState): void {
  const active = new Set<string>();
  for (const [observer, next] of state.nextTrackSequenceByObserver) {
    if (!observer || next < 0n) fail('INVALID_CONTINUANT_FILE_STATE', 'invalid observer track sequence');
  }
  for (const referentId of state.activePerceptualReferentIds) {
    validateReferentId(referentId);
    const next = state.nextTrackSequenceByObserver.get(referentId.observerId);
    if (next === undefined || referentId.observerTrackSequence >= next) {
      fail('INVALID_CONTINUANT_FILE_STATE', 'active continuant-file is not covered by observer allocator state');
    }
    const key = referentKey(referentId);
    if (active.has(key)) fail('INVALID_CONTINUANT_FILE_STATE', 'duplicate active continuant-file');
    active.add(key);
  }
}

function validateSupportingObservations(
  observerId: string,
  observations: readonly SupportingObservationId[],
): void {
  if (observations.length === 0) {
    fail('INVALID_SUPPORTING_OBSERVATION', 'at least one supporting observation is required');
  }
  let prior: bigint | undefined;
  for (const observation of observations) {
    validateExactKeys(observation, ['observerId', 'observationId'], 'supporting observation', 'INVALID_SUPPORTING_OBSERVATION');
    requireSameObserver(observerId, observation.observerId, 'supporting observation');
    if (typeof observation.observationId !== 'bigint' || observation.observationId < 0n) {
      fail('INVALID_SUPPORTING_OBSERVATION', 'observationId must be a nonnegative allocated occurrence');
    }
    if (prior !== undefined && observation.observationId <= prior) {
      fail('INVALID_SUPPORTING_OBSERVATION', 'supporting observations must be unique and strictly canonical');
    }
    prior = observation.observationId;
  }
}

function validateReferentId(referentId: PerceptualReferentId): void {
  validateExactKeys(referentId, ['observerId', 'observerTrackSequence'], 'perceptual continuant-file identity');
  if (!referentId.observerId || referentId.observerTrackSequence < 0n) {
    fail('INVALID_CONTINUANT_FILE_STATE', 'invalid perceptual continuant-file identity');
  }
}

/**
 * A forbidden field is reported against the construct being validated. `code` names that construct,
 * so first divergence identifies the record that was malformed rather than defaulting every seam
 * boundary to the track-transition code. A truth-shaped field is reported as truth leakage
 * regardless of the construct, because that is the more specific divergence.
 */
function validateExactKeys(
  value: object,
  allowed: readonly string[],
  description: string,
  code: PerceptualContinuantFileFailureCode = 'INVALID_TRACK_TRANSITION',
): void {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(value)) {
    if (!allowedSet.has(key)) {
      const truthLike = /truth|worldEvent|actionConcept|semanticReferent/i.test(key);
      fail(
        truthLike ? 'FORBIDDEN_TRUTH_FIELD' : code,
        `${description} contains forbidden field ${key}`,
      );
    }
  }
}

function freezeState(
  sequences: ReadonlyMap<string, bigint>,
  active: readonly PerceptualReferentId[],
): PerceptualContinuantFileState {
  const result = Object.freeze({
    nextTrackSequenceByObserver: new Map(
      [...sequences.entries()].sort((left, right) => compareText(left[0], right[0])),
    ),
    activePerceptualReferentIds: Object.freeze([...active].map(freezeReferentId).sort(compareReferentIds)),
  });
  validateState(result);
  return result;
}

function freezeReferentId(referentId: PerceptualReferentId): PerceptualReferentId {
  validateReferentId(referentId);
  return Object.freeze({ ...referentId });
}

function freezeObservations(
  observations: readonly SupportingObservationId[],
): readonly SupportingObservationId[] {
  return Object.freeze(observations.map((observation) => Object.freeze({ ...observation })));
}

function compareReferentIds(left: PerceptualReferentId, right: PerceptualReferentId): number {
  return compareText(left.observerId, right.observerId)
    || (left.observerTrackSequence < right.observerTrackSequence ? -1
      : left.observerTrackSequence > right.observerTrackSequence ? 1 : 0);
}

function referentKey(referentId: PerceptualReferentId): string {
  return `${referentId.observerId}\u0000${referentId.observerTrackSequence}`;
}

function detectionKey(detectionId: CurrentDetectionId): string {
  return `${detectionId.observerId}\u0000${detectionId.detectionOccurrenceId}`;
}

function equalReferentId(left: PerceptualReferentId, right: PerceptualReferentId): boolean {
  return left.observerId === right.observerId
    && left.observerTrackSequence === right.observerTrackSequence;
}

function cloneReferentId(referentId: PerceptualReferentId): PerceptualReferentId {
  return { observerId: referentId.observerId, observerTrackSequence: referentId.observerTrackSequence };
}

function requireSameObserver(expected: string, actual: string, description: string): void {
  if (expected !== actual) fail('CROSS_OBSERVER_REFERENCE', `${description} belongs to another observer`);
}

function requireNonempty(value: string, description: string): void {
  if (!value) fail('INVALID_TRACK_TRANSITION', `${description} must be nonempty`);
}

/** Allocated occurrence ordinals are opaque but must be well-formed. */
function requireNonnegative(value: bigint, description: string): void {
  if (typeof value !== 'bigint' || value < 0n) {
    fail('INVALID_TRACK_TRANSITION', `${description} must be a nonnegative allocated occurrence`);
  }
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function fail(code: PerceptualContinuantFileFailureCode, message: string): never {
  throw new PerceptualContinuantFileContractError(code, message);
}
