import { describe, expect, it } from 'vitest';
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
    supportingObservationIds: [{ observerId, observationId: `observation/${id}` }],
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
    supportingObservationIds: [{ observerId, observationId: `observation/${bindingId}` }],
    transformationVersion: version,
  };
}

function stage(reservation: ExperienceReservation, bindingId = 1n): StagedSemanticExperience {
  const phase = reservation.lane === 'Current' ? 14n : 124n;
  return freezeAndStageSemanticExperience(reservation, experience(reservation, bindingId), phase);
}

const catalog: readonly RecognitionCandidateCatalogEntry[] = [
  { observerId, candidateSemanticReferentId: 'person.darius', candidateDomain: 'Person', recognitionTemplateIds: ['template/darius'], catalogEntryVersion: version },
  { observerId, candidateSemanticReferentId: 'person.glen', candidateDomain: 'Person', recognitionTemplateIds: ['template/glen'], catalogEntryVersion: version },
];

function cue(exp: PreRecognitionSemanticExperience, candidate: 'person.glen' | 'person.darius'): PermittedRecognitionCueEvidence {
  return {
    recognitionCueEvidenceId: `cue/${candidate}/${exp.experienceId}`,
    experienceId: exp.experienceId,
    observerId,
    perceptualReferentId: track,
    candidateSemanticReferentId: candidate,
    recognitionCueSource: { kind: 'retained-template-match', recognitionTemplateId: candidate === 'person.glen' ? 'template/glen' : 'template/darius' },
    cuePolarity: 'SupportsCandidate',
    supportingExperienceEvidenceRefs: [{ kind: 'perceived-binding', perceivedBindingId: exp.perceivedBindings[0].perceivedBindingId }],
    occurredAt: exp.occurredAt,
    transformationVersion: version,
  };
}

function recognitionRequest(
  exp: PreRecognitionSemanticExperience,
  candidate: 'person.glen' | 'person.darius',
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

describe('SEM-001H two-lane semantic phase conformance', () => {
  it('CV-SEM-081 registers the exact two-lane phases and non-schedulable settlement sentinel', () => {
    expect(SEMANTIC_PHASE_CONTRACT_VERSION).toBe('semantic-binding/0.1-candidate#SEM-001H');
    expect(ORDERING_PHASE_REGISTRY_VERSION).toBe('ordering-phases/2-candidate');
    expect(ORDERING_PHASES).toEqual([
      0n, 10n, 11n, 12n, 13n, 14n, 15n, 20n, 21n, 30n, 40n, 50n, 51n, 52n,
      60n, 70n, 80n, 90n, 100n, 110n, 120n, 121n, 122n, 123n, 124n, 125n,
      126n, 127n, 130n, 140n, 150n,
    ]);
    expect(SETTLEMENT_BARRIER_PHASE).toBe(150n);
    expect(SCHEDULABLE_ORDERING_PHASES).not.toContain(150n);
  });

  it('CV-SEM-082 fixes the current lane chain and rejects truth at or after its entry cutoff', () => {
    expect(OBSERVATION_LANES.Current.phases).toEqual({
      Observation: 10n, TrackingAndSegmentation: 11n, BindingAndFeatureEvidence: 12n,
      Classification: 13n, ExperienceFreeze: 14n, CausalRole: 15n,
      RecognitionInputFreeze: 20n, RecognitionEvaluation: 21n,
    });
    expect(() => assertTruthAvailableAtLaneEntry('Current', 0n)).not.toThrow();
    expect(() => assertTruthAvailableAtLaneEntry('Current', 10n))
      .toThrowError(expect.objectContaining({ code: 'LATE_TRUTH_CANNOT_REOPEN_LANE' }));
    expect(() => assertLaneOperationPhase('Current', 'RecognitionEvaluation', 20n))
      .toThrowError(expect.objectContaining({ code: 'INVALID_PHASE' }));
  });

  it('CV-SEM-083 fixes the consequence lane, admits phase-110 truth, and prevents reopening after phase 120', async () => {
    expect(OBSERVATION_LANES.Consequence.phases).toEqual({
      Observation: 120n, TrackingAndSegmentation: 121n, BindingAndFeatureEvidence: 122n,
      Classification: 123n, ExperienceFreeze: 124n, CausalRole: 125n,
      RecognitionInputFreeze: 126n, RecognitionEvaluation: 127n,
    });
    expect(() => assertTruthAvailableAtLaneEntry('Consequence', 110n)).not.toThrow();
    expect(() => assertTruthAvailableAtLaneEntry('Consequence', 120n))
      .toThrowError(expect.objectContaining({ code: 'LATE_TRUTH_CANNOT_REOPEN_LANE' }));

    const root = typedIdentifier(33001n, text('event/consequence-root'));
    const child = typedIdentifier(33001n, text('event/backward-observation'));
    const scheduler = phaseScheduler(new Map([
      [key(root), (({ state }) => ({ nextState: state, emittedEvents: [{ dueAt: simInstant(1n), phase: 120n, eventTypeId: child, payload: list([]), dependencies: list([]) }], traceContributions: [], outputs: [] })) as EventHandler<PhaseState>],
      [key(child), (({ state }) => ({ nextState: state, emittedEvents: [{ dueAt: simInstant(1n), phase: 20n, eventTypeId: root, payload: list([]), dependencies: list([]) }], traceContributions: [], outputs: [] })) as EventHandler<PhaseState>],
    ]));
    scheduler.schedule({ dueAt: simInstant(1n), phase: 110n, eventTypeId: root, payload: list([]), dependencies: list([]) });
    await expect(scheduler.settleNextInstant()).rejects.toThrowError(expect.objectContaining({ code: 'CAUSAL_ORDER_VIOLATION' }));
  });

  it('CV-SEM-084 conditionally reserves ExperienceId and forbids successful orphan or duplicate envelopes', () => {
    let next = 40n;
    let calls = 0;
    const allocate = () => { calls += 1; const value = next; next += 1n; return value; };
    const empty = admitObservationLane({ observerId, lane: 'Current', dueAt: 100n, emitsCharacterAccessibleEvidence: false }, allocate);
    expect(empty.reservation).toBeUndefined();
    expect(calls).toBe(0);
    const current = admitObservationLane({ observerId, lane: 'Current', dueAt: 100n, emitsCharacterAccessibleEvidence: true }, allocate).reservation!;
    const consequence = admitObservationLane({ observerId, lane: 'Consequence', dueAt: 100n, emitsCharacterAccessibleEvidence: true }, allocate).reservation!;
    expect(current.experienceId).not.toBe(consequence.experienceId);
    const currentStage = stage(current, 1n);
    const consequenceStage = stage(consequence, 2n);
    expect(() => validateSuccessfulExperienceSettlement([current, consequence], [currentStage, consequenceStage])).not.toThrow();
    expect(() => validateSuccessfulExperienceSettlement([current], []))
      .toThrowError(expect.objectContaining({ code: 'ORPHAN_EXPERIENCE_RESERVATION' }));
    expect(() => validateSuccessfulExperienceSettlement([current], [currentStage, currentStage]))
      .toThrowError(expect.objectContaining({ code: 'DUPLICATE_EXPERIENCE_ENVELOPE' }));
  });

  it('CV-SEM-085 freezes one immutable envelope before separate companion causal-role evidence', () => {
    const reservation = reserve('Current', 50n);
    const staged = stage(reservation);
    const snapshot = structuredClone(staged.experience);
    assertLaneOperationPhase('Current', 'CausalRole', SemanticBindingPhase.CurrentCausalRole);
    const companion = Object.freeze({ experienceId: staged.experience.experienceId, causalRoleId: 'causal-role/actor', stagedAtPhase: 15n });
    expect(companion.experienceId).toBe(staged.experience.experienceId);
    expect(staged.experience).toEqual(snapshot);
    expect(Object.isFrozen(staged.experience)).toBe(true);
    expect(staged.experience).not.toHaveProperty('causalRoleEvidence');
  });

  it('CV-SEM-086 canonically schedules independent same-phase classifier work without creating a read edge', () => {
    const work: ClassificationWorkItem[] = [
      { classificationDomain: 'EventPattern', observerId, carrierCanonicalKey: 'event/4', ruleId: 'rule/repetition', canonicalTieBreak: '1' },
      { classificationDomain: 'Continuant', observerId, carrierCanonicalKey: 'track/17', ruleId: 'rule/person', canonicalTieBreak: '1' },
    ];
    const canonical = canonicalizeClassificationWork(work);
    expect(canonical.map((item) => item.classificationDomain)).toEqual(['Continuant', 'EventPattern']);
    expect(() => assertCanonicalClassificationWork(work)).toThrowError(expect.objectContaining({ code: 'NONCANONICAL_CLASSIFICATION_WORK' }));
    expect(() => assertCanonicalClassificationWork(canonical)).not.toThrow();
    expect(OBSERVATION_LANES.Current.phases.Classification).toBe(13n);
    expect(OBSERVATION_LANES.Consequence.phases.Classification).toBe(123n);
  });

  it('CV-SEM-087 freezes recognition inputs and permits consequence correction without rewriting phase-21 history', () => {
    const currentStage = stage(reserve('Current', 60n), 1n);
    const mutableCurrentRequest = recognitionRequest(currentStage.experience, 'person.glen');
    const frozenCurrent = freezeRecognitionInput('Current', currentStage, mutableCurrentRequest, 20n);
    (mutableCurrentRequest.cueEvidence as PermittedRecognitionCueEvidence[]).splice(0, 1);
    expect(frozenCurrent.request.cueEvidence).toHaveLength(1);
    const first = evaluateContinuantRecognition(recognitionModel(), frozenCurrent.request, 100n);
    expect(first.resolutionRecord?.resolution).toEqual({ kind: 'asserted-candidate', candidateSemanticReferentId: 'person.glen' });

    const consequenceStage = stage(reserve('Consequence', 61n), 2n);
    const frozenConsequence = freezeRecognitionInput(
      'Consequence', consequenceStage,
      recognitionRequest(consequenceStage.experience, 'person.darius', [first.resolutionRecord!]), 126n,
    );
    const firstSnapshot = structuredClone(first.resolutionRecord!);
    const correction = evaluateContinuantRecognition(recognitionModel(), frozenConsequence.request, 102n);
    expect(correction.resolutionRecord?.resolution).toEqual({ kind: 'asserted-candidate', candidateSemanticReferentId: 'person.darius' });
    expect(correction.resolutionRecord?.revisesRecognitionResolutionId).toBe(first.resolutionRecord?.recognitionResolutionId);
    expect(first.resolutionRecord).toEqual(firstSnapshot);
  });

  it('CV-SEM-088 keeps phase-130 perceived-outcome learning separate from truth-side automatic adaptation', () => {
    for (const kind of ['intent-expectation', 'consequence-semantic-experience', 'consequence-recognition', 'permitted-character-state'] as const) {
      expect(() => assertOutcomeEvaluationRead(kind)).not.toThrow();
    }
    expect(() => assertOutcomeEvaluationRead('authoritative-world-outcome'))
      .toThrowError(expect.objectContaining({ code: 'OUTCOME_TRUTH_READ_FORBIDDEN' }));
    expect(() => assertAutomaticAdaptationOutput('adaptation-state')).not.toThrow();
    expect(() => assertAutomaticAdaptationOutput('character-learning-evidence'))
      .toThrowError(expect.objectContaining({ code: 'ADAPTATION_AS_LEARNING_EVIDENCE' }));
  });

  it('CV-SEM-089 proves temporal availability without granting ORD-001 belief permission', () => {
    expect(SemanticBindingPhase.CurrentRecognitionEvaluation).toBeLessThan(SemanticBindingPhase.BeliefAndPersonModel);
    expect(SemanticBindingPhase.ConsequenceRecognitionEvaluation).toBeLessThan(SemanticBindingPhase.OutcomeEvaluationAndLearningEvidence);
    expect(SEMANTIC_PHASE_CONTRACT_VERSION).not.toContain('ORD-001-accepted');
  });

  it('CV-SEM-090 rejects barrier events and rolls reservations/allocators back on settlement failure', async () => {
    const eventType = typedIdentifier(33002n, text('event/reservation-failure'));
    const barrierScheduler = phaseScheduler(new Map());
    expect(() => barrierScheduler.schedule({ dueAt: simInstant(1n), phase: SETTLEMENT_BARRIER_PHASE, eventTypeId: eventType, payload: list([]), dependencies: list([]) }))
      .toThrowError(expect.objectContaining({ code: 'INVALID_EVENT' }));

    const handler: EventHandler<PhaseState> = ({ state, allocateRuntimeId }) => {
      const reservation = admitObservationLane({ observerId, lane: 'Current', dueAt: 1n, emitsCharacterAccessibleEvidence: true }, allocateRuntimeId).reservation!;
      expect(reservation.experienceId).toBe(8950n);
      validateSuccessfulExperienceSettlement([reservation], []);
      return { nextState: state, emittedEvents: [], traceContributions: [], outputs: [] };
    };
    const subject = phaseScheduler(new Map([[key(eventType), handler]]), 70n);
    subject.schedule({ dueAt: simInstant(1n), phase: 10n, eventTypeId: eventType, payload: list([]), dependencies: list([]) });
    const before = subject.getAllocatorState();
    await expect(subject.settleNextInstant()).rejects.toThrowError(expect.objectContaining({ code: 'TRANSITION_FAILURE' }));
    expect(subject.getAllocatorState()).toEqual(before);
    expect(subject.getCommittedTrace()).toEqual([]);
    expect(subject.getOutputs()).toEqual([]);
  });
});

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
