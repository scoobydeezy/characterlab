import {authoredReferentKey} from '../test/fixtures/referentOrigin';

import {
  OBSERVATION_LANES,
  SEMANTIC_PHASE_CONTRACT_VERSION,
  SemanticBindingPhase,
  admitObservationLane,
  assertAutomaticAdaptationOutput,
  assertCanonicalClassificationWork,
  assertLaneOperationPhase,
  assertOutcomeEvaluationRead,
  assertTruthAvailableAtLaneEntry,
  canonicalizeClassificationWork,
  freezeAndStageSemanticExperience,
  freezeRecognitionInput,
  validateSuccessfulExperienceSettlement,
  type ClassificationWorkItem,
  type ExperienceReservation,
  type StagedSemanticExperience,
} from '../semanticBinding/phaseOrdering';
import { EventRoleId } from '../semanticBinding/eventBindings';
import type {
  PerceivedBindingEvidence,
  PerceptualEventReferentId,
  PerceptualReferentId,
  PreRecognitionSemanticExperience,
} from '../semanticBinding/perceptualEventFiles';
import {
  INITIAL_RECOGNITION_DERIVATION,
  INITIAL_RECOGNITION_RULE,
  compileRecognitionModel,
  evaluateContinuantRecognition,
  type PermittedRecognitionCueEvidence,
  type RecognitionCandidateCatalogEntry,
  type RecognitionRequest,
  type RecognitionResolutionRecord,
} from '../semanticBinding/recognition';
import {
  DeterministicScheduler,
  ORDERING_PHASES,
  ORDERING_PHASE_REGISTRY_VERSION,
  SETTLEMENT_BARRIER_PHASE,
  SCHEDULABLE_ORDERING_PHASES,
  type EventHandler,
  type StateAdapter,
} from '../substrate/scheduler';
import { bytesToHex, canonicalEncode, list, text, typedIdentifier } from '../substrate/canonicalEncoding';
import { simInstant } from '../substrate/time';

const observerId = 'observer/mina';
const track: PerceptualReferentId = { observerId, observerTrackSequence: 17n };
const eventFile: PerceptualEventReferentId = { observerId, observerEventSequence: 4n };
const version = 'fixture/sem-001h';

function reserve(lane: 'Current' | 'Consequence', id: bigint): ExperienceReservation {
  return admitObservationLane({ observerId, lane, dueAt: 100n, emitsCharacterAccessibleEvidence: true }, () => id).reservation!;
}

function binding(id: bigint): PerceivedBindingEvidence {
  return {
    perceivedBindingId: id,
    observerId,
    perceptualEventReferentId: eventFile,
    perceptualReferentId: track,
    eventRoleEvidence: { kind: 'exact', eventRoleId: EventRoleId.Actor },
    supportingObservationIds: [{ observerId, observationId: id }],
    occurredAt: 100n,
    transformationVersion: version,
  };
}

function experience(reservation: ExperienceReservation, bindingId = 1n): PreRecognitionSemanticExperience {
  return {
    experienceId: reservation.experienceId,
    observerId,
    occurredAt: reservation.dueAt,
    perceptualEventReferentIds: [eventFile],
    perceivedBindings: [binding(bindingId)],
    perceptualClassifications: [],
    perceptualEventClassifications: [],
    supportingObservationIds: [{ observerId, observationId: bindingId }],
    transformationVersion: version,
  };
}

function stage(reservation: ExperienceReservation, bindingId = 1n): StagedSemanticExperience {
  const phase = reservation.lane === 'Current' ? 14n : 124n;
  return freezeAndStageSemanticExperience(reservation, experience(reservation, bindingId), phase);
}

const catalog: readonly RecognitionCandidateCatalogEntry[] = [
  { observerId, candidateSemanticReferentId: authoredReferentKey('person.darius'), candidateDomain: 'Person' as const, recognitionTemplateIds: ['template/darius'], catalogEntryVersion: version },
  { observerId, candidateSemanticReferentId: authoredReferentKey('person.glen'), candidateDomain: 'Person' as const, recognitionTemplateIds: ['template/glen'], catalogEntryVersion: version },
].sort((a,b)=>a.candidateSemanticReferentId.localeCompare(b.candidateSemanticReferentId));

function cue(exp: PreRecognitionSemanticExperience, candidate: string): PermittedRecognitionCueEvidence {
  return {
    recognitionCueEvidenceId: exp.experienceId * 2n + (candidate === authoredReferentKey('person.glen') ? 1n : 0n),
    experienceId: exp.experienceId,
    observerId,
    perceptualReferentId: track,
    candidateSemanticReferentId: candidate,
    recognitionCueSource: { kind: 'retained-template-match', recognitionTemplateId: candidate === authoredReferentKey('person.glen') ? 'template/glen' : 'template/darius' },
    cuePolarity: 'SupportsCandidate',
    supportingExperienceEvidenceRefs: [{ kind: 'perceived-binding', perceivedBindingId: exp.perceivedBindings[0].perceivedBindingId }],
    occurredAt: exp.occurredAt,
    transformationVersion: version,
  };
}

function recognitionRequest(
  exp: PreRecognitionSemanticExperience,
  candidate: string,
  history: readonly RecognitionResolutionRecord[] = [],
): RecognitionRequest {
  return {
    experience: exp,
    perceptualReferentId: track,
    candidateCatalog: catalog,
    identitySymbolMappings: [],
    cueEvidence: [cue(exp, candidate)],
    priorResolutionHistory: history,
    recognitionVersion: version,
  };
}

const recognitionModel = () => compileRecognitionModel('model/sem-001h-recognition', [INITIAL_RECOGNITION_RULE], [INITIAL_RECOGNITION_DERIVATION]);


interface PhaseState { readonly value: bigint }
const phaseAdapter: StateAdapter<PhaseState> = {
  clone: (state) => ({ ...state }),
  validate: (state) => { if (typeof state.value !== 'bigint') throw new Error('invalid phase fixture state'); },
  canonicalValue: (state) => list([text(state.value.toString())]),
};

function phaseScheduler(handlers: ReadonlyMap<string, EventHandler<PhaseState>>, nextRuntimeId = 0n): DeterministicScheduler<PhaseState> {
  return new DeterministicScheduler({
    initialState: { value: 0n }, stateAdapter: phaseAdapter, handlers,
    maxSettlementWorkPerSimulationInstant: 20n,
    initialAllocators: { nextRuntimeId, nextEventId: 0n, nextEventSequence: 0n },
  });
}

function key(value: ReturnType<typeof typedIdentifier>): string { return bytesToHex(canonicalEncode(value)); }

export {observerId,track,eventFile,version,reserve,binding,experience,stage,catalog,cue,recognitionRequest,recognitionModel,phaseScheduler,key};
export type {PhaseState};
export const originalSource={path:'src/test/semanticPhaseOrdering.test.ts',sha256:'a7d13a10c67a713e4f8c71775b8bf153a8eff37494fa3561005af20594eeed3f'} as const;
