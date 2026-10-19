import { assemblePreRecognitionExperience, type PreRecognitionSemanticExperience } from './perceptualEventFiles';
import type { RecognitionRequest } from './recognition';

export const SEMANTIC_PHASE_CONTRACT_VERSION = 'semantic-binding/0.1-candidate#SEM-001H' as const;

export const SemanticBindingPhase = {
  CurrentObservation: 10n,
  CurrentTrackingAndSegmentation: 11n,
  CurrentBindingAndFeatureEvidence: 12n,
  CurrentClassification: 13n,
  CurrentExperienceFreeze: 14n,
  CurrentCausalRole: 15n,
  CurrentRecognitionInputFreeze: 20n,
  CurrentRecognitionEvaluation: 21n,
  BeliefAndPersonModel: 30n,
  AttemptAndWorldOutcome: 110n,
  ConsequenceObservation: 120n,
  ConsequenceTrackingAndSegmentation: 121n,
  ConsequenceBindingAndFeatureEvidence: 122n,
  ConsequenceClassification: 123n,
  ConsequenceExperienceFreeze: 124n,
  ConsequenceCausalRole: 125n,
  ConsequenceRecognitionInputFreeze: 126n,
  ConsequenceRecognitionEvaluation: 127n,
  OutcomeEvaluationAndLearningEvidence: 130n,
  ConsolidationAndAdaptation: 140n,
  SettlementBarrier: 150n,
} as const;

export type ObservationLane = 'Current' | 'Consequence';
export type LaneOperation =
  | 'Observation'
  | 'TrackingAndSegmentation'
  | 'BindingAndFeatureEvidence'
  | 'Classification'
  | 'ExperienceFreeze'
  | 'CausalRole'
  | 'RecognitionInputFreeze'
  | 'RecognitionEvaluation';

export interface ObservationLaneDefinition {
  readonly lane: ObservationLane;
  readonly phases: Readonly<Record<LaneOperation, bigint>>;
}

export const OBSERVATION_LANES: Readonly<Record<ObservationLane, ObservationLaneDefinition>> = Object.freeze({
  Current: lane('Current', [10n, 11n, 12n, 13n, 14n, 15n, 20n, 21n]),
  Consequence: lane('Consequence', [120n, 121n, 122n, 123n, 124n, 125n, 126n, 127n]),
});

export interface ExperienceReservation {
  /** Allocated typed `ExperienceId` occurrence (namespace 1106). */
  readonly experienceId: bigint;
  readonly observerId: string;
  readonly lane: ObservationLane;
  readonly dueAt: bigint;
  readonly reservedAtPhase: bigint;
}

export interface LaneAdmissionRequest {
  readonly observerId: string;
  readonly lane: ObservationLane;
  readonly dueAt: bigint;
  readonly emitsCharacterAccessibleEvidence: boolean;
}

export interface LaneAdmissionResult {
  readonly reservation?: ExperienceReservation;
}

export interface StagedSemanticExperience {
  readonly reservation: ExperienceReservation;
  readonly stagedAtPhase: bigint;
  readonly experience: PreRecognitionSemanticExperience;
}

export interface FrozenRecognitionInput {
  readonly lane: ObservationLane;
  readonly experienceId: bigint;
  readonly observerId: string;
  readonly frozenAtPhase: bigint;
  readonly request: RecognitionRequest;
}

export type ClassificationDomain = 'Continuant' | 'EventPattern';

export interface ClassificationWorkItem {
  readonly classificationDomain: ClassificationDomain;
  readonly observerId: string;
  readonly carrierCanonicalKey: string;
  readonly ruleId: string;
  readonly canonicalTieBreak: string;
}

export type OutcomeEvaluationReadKind =
  | 'intent-expectation'
  | 'consequence-semantic-experience'
  | 'consequence-recognition'
  | 'permitted-character-state'
  | 'authoritative-world-outcome';

export type PhaseOrderingFailureCode =
  | 'INVALID_PHASE'
  | 'LATE_TRUTH_CANNOT_REOPEN_LANE'
  | 'INVALID_LANE_ADMISSION'
  | 'ORPHAN_EXPERIENCE_RESERVATION'
  | 'DUPLICATE_EXPERIENCE_ENVELOPE'
  | 'INVALID_EXPERIENCE_ENVELOPE'
  | 'INVALID_RECOGNITION_INPUT'
  | 'NONCANONICAL_CLASSIFICATION_WORK'
  | 'OUTCOME_TRUTH_READ_FORBIDDEN'
  | 'ADAPTATION_AS_LEARNING_EVIDENCE';

export class PhaseOrderingContractError extends Error {
  constructor(readonly code: PhaseOrderingFailureCode, message: string) {
    super(message);
    this.name = 'PhaseOrderingContractError';
  }
}

export function assertTruthAvailableAtLaneEntry(laneName: ObservationLane, truthAvailableAtPhase: bigint): void {
  requireNonnegative(truthAvailableAtPhase, 'truthAvailableAtPhase');
  const entry = OBSERVATION_LANES[laneName].phases.Observation;
  if (truthAvailableAtPhase >= entry) {
    fail('LATE_TRUTH_CANNOT_REOPEN_LANE', `truth first available at phase ${truthAvailableAtPhase} misses the ${laneName} lane cutoff ${entry}`);
  }
}

export function assertLaneOperationPhase(laneName: ObservationLane, operation: LaneOperation, actualPhase: bigint): void {
  const expected = OBSERVATION_LANES[laneName].phases[operation];
  if (actualPhase !== expected) fail('INVALID_PHASE', `${laneName} ${operation} requires phase ${expected}`);
}

export function admitObservationLane(
  request: LaneAdmissionRequest,
  allocateRuntimeId: () => bigint,
): LaneAdmissionResult {
  exactKeys(request, ['observerId', 'lane', 'dueAt', 'emitsCharacterAccessibleEvidence'], 'lane admission');
  requireNonempty(request.observerId, 'observerId');
  requireNonnegative(request.dueAt, 'dueAt');
  if (!Object.hasOwn(OBSERVATION_LANES, request.lane)) fail('INVALID_LANE_ADMISSION', 'unknown observation lane');
  if (typeof request.emitsCharacterAccessibleEvidence !== 'boolean') fail('INVALID_LANE_ADMISSION', 'lane evidence admission must be exact boolean');
  if (!request.emitsCharacterAccessibleEvidence) return Object.freeze({});
  const allocated = allocateRuntimeId();
  requireNonnegative(allocated, 'allocated ExperienceId');
  return Object.freeze({
    reservation: Object.freeze({
      experienceId: allocated,
      observerId: request.observerId,
      lane: request.lane,
      dueAt: request.dueAt,
      reservedAtPhase: OBSERVATION_LANES[request.lane].phases.Observation,
    }),
  });
}

export function freezeAndStageSemanticExperience(
  reservation: ExperienceReservation,
  input: PreRecognitionSemanticExperience,
  actualPhase: bigint,
): StagedSemanticExperience {
  validateReservation(reservation);
  assertLaneOperationPhase(reservation.lane, 'ExperienceFreeze', actualPhase);
  if (input.experienceId !== reservation.experienceId || input.observerId !== reservation.observerId || input.occurredAt !== reservation.dueAt) {
    fail('INVALID_EXPERIENCE_ENVELOPE', 'experience envelope does not match its lane reservation');
  }
  const experience = deepFreeze(structuredClone(assemblePreRecognitionExperience(input)));
  return Object.freeze({ reservation: Object.freeze({ ...reservation }), stagedAtPhase: actualPhase, experience });
}

export function validateSuccessfulExperienceSettlement(
  reservations: readonly ExperienceReservation[],
  stagedExperiences: readonly StagedSemanticExperience[],
): void {
  const reserved = new Map<bigint, ExperienceReservation>();
  for (const reservation of reservations) {
    validateReservation(reservation);
    if (reserved.has(reservation.experienceId)) fail('DUPLICATE_EXPERIENCE_ENVELOPE', 'ExperienceId reservations must be unique across lanes');
    reserved.set(reservation.experienceId, reservation);
  }
  const staged = new Map<bigint, StagedSemanticExperience>();
  for (const envelope of stagedExperiences) {
    if (staged.has(envelope.experience.experienceId)) fail('DUPLICATE_EXPERIENCE_ENVELOPE', 'one ExperienceId cannot stage several envelopes');
    const reservation = reserved.get(envelope.experience.experienceId);
    if (!reservation) fail('INVALID_EXPERIENCE_ENVELOPE', 'staged experience has no reservation');
    if (envelope.reservation.experienceId !== reservation.experienceId
      || envelope.reservation.lane !== reservation.lane
      || envelope.stagedAtPhase !== OBSERVATION_LANES[reservation.lane].phases.ExperienceFreeze) {
      fail('INVALID_EXPERIENCE_ENVELOPE', 'staged experience does not satisfy its reservation and phase');
    }
    staged.set(envelope.experience.experienceId, envelope);
  }
  for (const experienceId of reserved.keys()) {
    if (!staged.has(experienceId)) fail('ORPHAN_EXPERIENCE_RESERVATION', 'successful instant contains a reservation without exactly one experience envelope');
  }
}

export function freezeRecognitionInput(
  laneName: ObservationLane,
  stagedExperience: StagedSemanticExperience,
  request: RecognitionRequest,
  actualPhase: bigint,
): FrozenRecognitionInput {
  assertLaneOperationPhase(laneName, 'RecognitionInputFreeze', actualPhase);
  if (stagedExperience.reservation.lane !== laneName
    || request.experience.experienceId !== stagedExperience.experience.experienceId
    || request.experience.observerId !== stagedExperience.experience.observerId
    || request.experience.occurredAt !== stagedExperience.experience.occurredAt) {
    fail('INVALID_RECOGNITION_INPUT', 'recognition input must consume the frozen experience from its own lane');
  }
  const frozenRequest = deepFreeze(structuredClone(request));
  return Object.freeze({
    lane: laneName,
    experienceId: frozenRequest.experience.experienceId,
    observerId: frozenRequest.experience.observerId,
    frozenAtPhase: actualPhase,
    request: frozenRequest,
  });
}

export function canonicalizeClassificationWork(items: readonly ClassificationWorkItem[]): readonly ClassificationWorkItem[] {
  const canonical = items.map((item) => validateClassificationWork(item)).sort(compareClassificationWork);
  const seen = new Set<string>();
  for (const item of canonical) {
    const key = classificationWorkKey(item);
    if (seen.has(key)) fail('NONCANONICAL_CLASSIFICATION_WORK', 'duplicate classification work item');
    seen.add(key);
  }
  return Object.freeze(canonical.map((item) => Object.freeze({ ...item })));
}

export function assertCanonicalClassificationWork(items: readonly ClassificationWorkItem[]): void {
  const canonical = canonicalizeClassificationWork(items);
  if (items.some((item, index) => classificationWorkKey(item) !== classificationWorkKey(canonical[index]))) {
    fail('NONCANONICAL_CLASSIFICATION_WORK', 'same-phase classification work must be scheduled canonically');
  }
}

export function assertOutcomeEvaluationRead(kind: OutcomeEvaluationReadKind): void {
  if (kind === 'authoritative-world-outcome') {
    fail('OUTCOME_TRUTH_READ_FORBIDDEN', 'phase-130 character evaluation cannot read phase-110 authoritative outcome truth');
  }
}

export function assertAutomaticAdaptationOutput(outputKind: 'adaptation-state' | 'character-learning-evidence'): void {
  if (outputKind === 'character-learning-evidence') {
    fail('ADAPTATION_AS_LEARNING_EVIDENCE', 'truth-side automatic adaptation cannot masquerade as character LearningEvidence');
  }
}

function validateReservation(reservation: ExperienceReservation): void {
  exactKeys(reservation, ['experienceId', 'observerId', 'lane', 'dueAt', 'reservedAtPhase'], 'experience reservation');
  requireNonnegative(reservation.experienceId, 'experienceId');
  requireNonempty(reservation.observerId, 'observerId');
  requireNonnegative(reservation.dueAt, 'dueAt');
  if (!Object.hasOwn(OBSERVATION_LANES, reservation.lane)
    || reservation.reservedAtPhase !== OBSERVATION_LANES[reservation.lane].phases.Observation) {
    fail('INVALID_LANE_ADMISSION', 'experience reservation has the wrong lane-entry phase');
  }
}

function validateClassificationWork(item: ClassificationWorkItem): ClassificationWorkItem {
  exactKeys(item, ['classificationDomain', 'observerId', 'carrierCanonicalKey', 'ruleId', 'canonicalTieBreak'], 'classification work');
  if (item.classificationDomain !== 'Continuant' && item.classificationDomain !== 'EventPattern') {
    fail('NONCANONICAL_CLASSIFICATION_WORK', 'unknown classification domain');
  }
  requireNonempty(item.observerId, 'observerId');
  requireNonempty(item.carrierCanonicalKey, 'carrierCanonicalKey');
  requireNonempty(item.ruleId, 'ruleId');
  requireNonempty(item.canonicalTieBreak, 'canonicalTieBreak');
  return Object.freeze({ ...item });
}

function compareClassificationWork(left: ClassificationWorkItem, right: ClassificationWorkItem): number {
  return domainOrder(left.classificationDomain) - domainOrder(right.classificationDomain)
    || left.observerId.localeCompare(right.observerId)
    || left.carrierCanonicalKey.localeCompare(right.carrierCanonicalKey)
    || left.ruleId.localeCompare(right.ruleId)
    || left.canonicalTieBreak.localeCompare(right.canonicalTieBreak);
}

function classificationWorkKey(item: ClassificationWorkItem): string {
  return `${domainOrder(item.classificationDomain)}\0${item.observerId}\0${item.carrierCanonicalKey}\0${item.ruleId}\0${item.canonicalTieBreak}`;
}

function domainOrder(domain: ClassificationDomain): number { return domain === 'Continuant' ? 0 : 1; }

function lane(name: ObservationLane, phases: readonly bigint[]): ObservationLaneDefinition {
  const operations: readonly LaneOperation[] = [
    'Observation', 'TrackingAndSegmentation', 'BindingAndFeatureEvidence', 'Classification',
    'ExperienceFreeze', 'CausalRole', 'RecognitionInputFreeze', 'RecognitionEvaluation',
  ];
  return Object.freeze({ lane: name, phases: Object.freeze(Object.fromEntries(operations.map((operation, index) => [operation, phases[index]])) as Record<LaneOperation, bigint>) });
}

function exactKeys(value: object, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort();
  const canonical = [...expected].sort();
  if (actual.length !== canonical.length || actual.some((key, index) => key !== canonical[index])) {
    fail('INVALID_LANE_ADMISSION', `${label} has invalid fields`);
  }
}

function requireNonempty(value: string, label: string): void {
  if (typeof value !== 'string' || value.length === 0) fail('INVALID_LANE_ADMISSION', `${label} must be nonempty`);
}

function requireNonnegative(value: bigint, label: string): void {
  if (typeof value !== 'bigint' || value < 0n) fail('INVALID_LANE_ADMISSION', `${label} must be a nonnegative exact integer`);
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function fail(code: PhaseOrderingFailureCode, message: string): never {
  throw new PhaseOrderingContractError(code, message);
}
