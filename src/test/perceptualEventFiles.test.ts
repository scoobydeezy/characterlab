import { describe, expect, it } from 'vitest';
import { bytesToHex, canonicalEncode, list, text, typedIdentifier } from '../substrate/canonicalEncoding';
import { DeterministicScheduler, type EventHandler, type StateAdapter } from '../substrate/scheduler';
import { simInstant } from '../substrate/time';
import { EventRoleId, type EventRoleEvidence } from '../semanticBinding/eventBindings';
import {
  applyPerceptualEventTransition,
  assemblePreRecognitionExperience,
  clonePerceptualEventFileState,
  compilePerceivedBindings,
  emptyPerceptualEventFileState,
  endPerceptualEventFile,
  eventFileStateSummary,
  perceivedEventGrouping,
  type PerceivedBindingRequest,
  type PerceptualEventFileState,
  type PerceptualEventReferentId,
  type PerceptualEventTransitionRequest,
  type PerceptualReferentId,
  type PreRecognitionSemanticExperience,
  type SupportingObservationId,
} from '../semanticBinding/perceptualEventFiles';

const mina = 'character/mina';
const darius = 'character/darius';
const version = 'perceptual-event-files/0.1-candidate';

const observation = (observerId: string, observationId: string): SupportingObservationId => ({
  observerId,
  observationId,
});

const objectFile = (observerTrackSequence: bigint, observerId = mina): PerceptualReferentId => ({
  observerId,
  observerTrackSequence,
});

const eventFile = (observerEventSequence: bigint, observerId = mina): PerceptualEventReferentId => ({
  observerId,
  observerEventSequence,
});

const transition = (
  continuityKind: 'NewEventFile' | 'ContinuesPriorEventFile',
  detectionId: string,
  priorPerceptualEventReferentId?: PerceptualEventReferentId,
  observerId = mina,
): PerceptualEventTransitionRequest => ({
  observerId,
  priorPerceptualEventReferentId,
  currentEventDetectionId: { observerId, detectionId },
  continuityKind,
  supportingObservationIds: [observation(observerId, `observation/${detectionId}`)],
  occurredAt: 10n,
  transformationVersion: version,
});

const exact = (eventRoleId: EventRoleId): EventRoleEvidence => ({ kind: 'exact', eventRoleId });

const binding = (
  perceptualEventReferentId: PerceptualEventReferentId,
  eventRoleEvidence: EventRoleEvidence,
  perceptualReferentId: PerceptualReferentId,
): PerceivedBindingRequest => ({
  observerId: mina,
  perceptualEventReferentId,
  perceptualReferentId,
  eventRoleEvidence,
  supportingObservationIds: [observation(mina, 'observation/binding')],
  occurredAt: 10n,
  transformationVersion: version,
});

const experience = (
  experienceId: string,
  eventIds: readonly PerceptualEventReferentId[],
  requests: readonly PerceivedBindingRequest[],
  nextRuntimeId = 0n,
): PreRecognitionSemanticExperience => {
  const compiled = compilePerceivedBindings(requests, nextRuntimeId);
  return assemblePreRecognitionExperience({
    experienceId,
    observerId: mina,
    occurredAt: 10n,
    perceptualEventReferentIds: eventIds,
    perceivedBindings: compiled.bindings,
    perceptualClassifications: [],
    perceptualEventClassifications: [],
    supportingObservationIds: [observation(mina, 'observation/experience')],
    transformationVersion: version,
  });
};

describe('SEM-001C observer-relative perceptual event-file conformance', () => {
  it('CV-SEM-031 preserves two simultaneous event groupings that an ungrouped role bag loses', () => {
    const first = eventFile(0n);
    const second = eventFile(1n);
    const result = experience('experience/simultaneous', [first, second], [
      binding(first, exact(EventRoleId.Actor), objectFile(0n)),
      binding(first, exact(EventRoleId.Target), objectFile(1n)),
      binding(first, exact(EventRoleId.Instrument), objectFile(2n)),
      binding(second, exact(EventRoleId.Actor), objectFile(3n)),
      binding(second, exact(EventRoleId.Target), objectFile(4n)),
    ]);

    expect(perceivedEventGrouping(result)).toEqual([
      ['exact:event-role/actor=continuant-file:0', 'exact:event-role/instrument=continuant-file:2', 'exact:event-role/target=continuant-file:1'],
      ['exact:event-role/actor=continuant-file:3', 'exact:event-role/target=continuant-file:4'],
    ]);
    expect(result.perceivedBindings.map((candidate) => candidate.eventRoleEvidence)).toHaveLength(5);
  });

  it('CV-SEM-032 permits one event-file to persist across distinct experiences', () => {
    const ongoing = eventFile(7n);
    const early = experience('experience/early', [ongoing], [binding(ongoing, exact(EventRoleId.Actor), objectFile(0n))]);
    const late = experience('experience/late', [ongoing], [binding(ongoing, exact(EventRoleId.Target), objectFile(1n))], 10n);

    expect(early.experienceId).not.toBe(late.experienceId);
    expect(early.perceptualEventReferentIds[0]).toEqual(late.perceptualEventReferentIds[0]);
  });

  it('CV-SEM-033 permits false event continuity without truth-side correction', () => {
    const started = applyPerceptualEventTransition(emptyPerceptualEventFileState(), transition('NewEventFile', 'glimpse-a'));
    const continued = applyPerceptualEventTransition(
      started.state,
      transition('ContinuesPriorEventFile', 'glimpse-b', started.transition.perceptualEventReferentId),
    );

    expect(continued.transition.perceptualEventReferentId).toEqual(started.transition.perceptualEventReferentId);
    expect(continued.state.activeEventFiles).toHaveLength(1);
    expect(continued.transition).not.toHaveProperty('truthEventId');
  });

  it('CV-SEM-034 permits false event discontinuity without truth-side merging', () => {
    const started = applyPerceptualEventTransition(emptyPerceptualEventFileState(), transition('NewEventFile', 'before-loss'));
    const ended = endPerceptualEventFile(started.state, {
      observerId: mina,
      perceptualEventReferentId: started.transition.perceptualEventReferentId,
      supportingObservationIds: [observation(mina, 'observation/loss')],
      occurredAt: 11n,
      transformationVersion: version,
    });
    const restarted = applyPerceptualEventTransition(ended.state, transition('NewEventFile', 'after-loss'));

    expect(started.transition.perceptualEventReferentId.observerEventSequence).toBe(0n);
    expect(restarted.transition.perceptualEventReferentId.observerEventSequence).toBe(1n);
    expect(restarted.transition.perceptualEventReferentId).not.toEqual(started.transition.perceptualEventReferentId);
  });

  it('CV-SEM-035 rejects truth-keyed segmentation inputs and keeps sensory IDs observer-side', () => {
    const invalid = { ...transition('NewEventFile', 'visible-motion'), truthEventId: 'truth/event-42' } as PerceptualEventTransitionRequest;
    expect(() => applyPerceptualEventTransition(emptyPerceptualEventFileState(), invalid))
      .toThrowError(expect.objectContaining({ code: 'FORBIDDEN_TRUTH_FIELD' }));

    const valid = applyPerceptualEventTransition(emptyPerceptualEventFileState(), transition('NewEventFile', 'visible-motion'));
    expect(valid.transition.currentEventDetectionId).toEqual({ observerId: mina, detectionId: 'visible-motion' });
    expect(valid.transition.supportingObservationIds).toEqual([observation(mina, 'observation/visible-motion')]);
    expect(stringifyWithBigInts(valid.transition)).not.toContain('truth/');
  });

  it('CV-SEM-036 forbids using a continuant-file as the Action carrier', () => {
    expect(() => compilePerceivedBindings([
      binding(eventFile(0n), exact(EventRoleId.Action), objectFile(0n)),
    ], 0n)).toThrowError(expect.objectContaining({ code: 'ACTION_AS_CONTINUANT_FILE' }));

    const grouped = experience('experience/unclassified-action', [eventFile(0n)], [
      binding(eventFile(0n), exact(EventRoleId.Actor), objectFile(0n)),
    ]);
    expect(stringifyWithBigInts(grouped)).not.toContain('action.skip-rope');
  });

  it('CV-SEM-037 preserves concurrent participation and distinct same-object role occurrences', () => {
    const first = eventFile(0n);
    const second = eventFile(1n);
    const shared = objectFile(4n);
    const result = experience('experience/shared-participant', [first, second], [
      binding(first, exact(EventRoleId.Actor), shared),
      binding(first, exact(EventRoleId.Target), shared),
      binding(second, exact(EventRoleId.Participant), shared),
    ]);

    expect(perceivedEventGrouping(result)).toEqual([
      ['exact:event-role/actor=continuant-file:4', 'exact:event-role/target=continuant-file:4'],
      ['exact:event-role/participant=continuant-file:4'],
    ]);
  });

  it('CV-SEM-038 preserves event-file state across save/load and isolates observer allocators', () => {
    const minaFirst = applyPerceptualEventTransition(emptyPerceptualEventFileState(), transition('NewEventFile', 'mina-first'));
    const dariusFirst = applyPerceptualEventTransition(
      minaFirst.state,
      transition('NewEventFile', 'darius-first', undefined, darius),
    );
    const restored = clonePerceptualEventFileState(structuredClone(dariusFirst.state));
    const minaSecond = applyPerceptualEventTransition(restored, transition('NewEventFile', 'mina-second'));
    const replay = applyPerceptualEventTransition(clonePerceptualEventFileState(dariusFirst.state), transition('NewEventFile', 'mina-second'));

    expect(restored).toEqual(dariusFirst.state);
    expect(minaSecond.transition.perceptualEventReferentId).toEqual(eventFile(1n, mina));
    expect(dariusFirst.transition.perceptualEventReferentId).toEqual(eventFile(0n, darius));
    expect(minaSecond).toEqual(replay);
  });

  it('CV-SEM-039 gives event-file ordinals no semantic or psychological magnitude', () => {
    const low = experience('experience/low-ordinals', [eventFile(0n), eventFile(1n)], [
      binding(eventFile(0n), exact(EventRoleId.Actor), objectFile(2n)),
      binding(eventFile(1n), exact(EventRoleId.Target), objectFile(3n)),
    ]);
    const shifted = experience('experience/high-ordinals', [eventFile(700n), eventFile(900n)], [
      binding(eventFile(700n), exact(EventRoleId.Actor), objectFile(2n)),
      binding(eventFile(900n), exact(EventRoleId.Target), objectFile(3n)),
    ], 50n);

    expect(perceivedEventGrouping(low)).toEqual(perceivedEventGrouping(shifted));
    expect(low.perceptualEventReferentIds).not.toEqual(shifted.perceptualEventReferentIds);
  });

  it('CV-SEM-040 rolls event-file state and runtime allocation back after staged failure', async () => {
    interface FixtureState {
      readonly valid: boolean;
      readonly eventFiles: PerceptualEventFileState;
    }
    const adapter: StateAdapter<FixtureState> = {
      clone: (state) => ({ valid: state.valid, eventFiles: clonePerceptualEventFileState(state.eventFiles) }),
      validate: (state) => {
        eventFileStateSummary(state.eventFiles);
        if (!state.valid) throw new Error('injected event-file commit failure');
      },
      canonicalValue: (state) => list([state.valid, list(eventFileStateSummary(state.eventFiles).map(text))]),
    };
    const handlerId = typedIdentifier(31000n, text('event/sem-001c-rollback'));
    const handlerKey = bytesToHex(canonicalEncode(handlerId));
    const handler: EventHandler<FixtureState> = ({ state, allocateRuntimeId }) => {
      const staged = applyPerceptualEventTransition(state.eventFiles, transition('NewEventFile', 'staged'));
      expect(allocateRuntimeId()).toBe(20n);
      return {
        nextState: { valid: false, eventFiles: staged.state },
        emittedEvents: [], traceContributions: [], outputs: [],
      };
    };
    const scheduler = new DeterministicScheduler({
      initialState: { valid: true, eventFiles: emptyPerceptualEventFileState() },
      stateAdapter: adapter,
      handlers: new Map([[handlerKey, handler]]),
      maxSettlementWorkPerSimulationInstant: 10n,
      initialAllocators: { nextRuntimeId: 20n, nextEventId: 0n, nextEventSequence: 0n },
    });
    scheduler.schedule({
      dueAt: simInstant(1n), phase: 10n, eventTypeId: handlerId, payload: list([]), dependencies: list([]),
    });
    const beforeState = scheduler.getState();
    const beforeAllocators = scheduler.getAllocatorState();

    await expect(scheduler.settleNextInstant()).rejects.toThrow(/injected event-file commit failure/);
    expect(scheduler.getState()).toEqual(beforeState);
    expect(scheduler.getAllocatorState()).toEqual(beforeAllocators);
  });
});

function stringifyWithBigInts(value: unknown): string {
  return JSON.stringify(value, (_key, candidate: unknown) => typeof candidate === 'bigint' ? candidate.toString() : candidate);
}
