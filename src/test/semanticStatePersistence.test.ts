import { describe, expect, it } from 'vitest';
import {
  bytesToHex, canonicalEncode, list, signed, text, typedIdentifier,
  type CanonicalValue,
} from '../substrate/canonicalEncoding';
import { commitManifest, createModelIdentity, createRunIdentity, runSeedFromFriendlyInteger } from '../substrate/identity';
import {
  createCanonicalSave, loadCanonicalSave,
  type PersistentStateAdapter,
} from '../substrate/persistence';
import {
  DeterministicScheduler, orderingParametersValue, orderingPhaseRegistryValue,
  type EventHandler,
} from '../substrate/scheduler';
import { simInstant } from '../substrate/time';
import {
  applyPerceptualTrackTransition,
  clonePerceptualContinuantFileState,
  continuantFileStateSummary,
  continuantTrackSemanticView,
  emptyPerceptualContinuantFileState,
  type PerceptualContinuantFileState,
  type PerceptualTrackTransition,
} from '../semanticBinding/perceptualContinuantFiles';
import {
  applyPerceptualEventTransition,
  clonePerceptualEventFileState,
  emptyPerceptualEventFileState,
  eventFileStateSummary,
  type PerceptualEventFileState,
} from '../semanticBinding/perceptualEventFiles';
import { SEMANTIC_RECORD_SCHEMAS } from '../semanticBinding/semanticSchemaRegistry';
import { semanticStateAuthorityRegistryValue } from '../semanticBinding/semanticStateAuthority';
import {
  perceptualContinuantFileStateValue,
  perceptualEventFileStateValue,
  restorePerceptualContinuantFileState,
  restorePerceptualEventFileState,
} from '../semanticBinding/semanticCodecs';

const mina = 'character/mina';
const darius = 'character/darius';
const version = 'semantic-binding/0.1-candidate#SEM-001A';

/** Stable ordinal per detection label: occurrence IDs are allocated, never symbolic. */
const OCCURRENCE_ORDINALS = new Map<string, bigint>();
const detectionOrdinal = (label: string): bigint => {
  if (!OCCURRENCE_ORDINALS.has(label)) OCCURRENCE_ORDINALS.set(label, BigInt(OCCURRENCE_ORDINALS.size));
  return OCCURRENCE_ORDINALS.get(label)!;
};

interface SemanticFileState {
  readonly continuantFiles: PerceptualContinuantFileState;
  readonly eventFiles: PerceptualEventFileState;
  readonly valid: boolean;
}

const initialState = (): SemanticFileState => ({
  continuantFiles: emptyPerceptualContinuantFileState(),
  eventFiles: emptyPerceptualEventFileState(),
  valid: true,
});

/**
 * The semantic state roots persist only through the accepted `SEM-001I.2` allocation: types 241
 * and 242 encode and restore through `semanticCodecs`, never through an ad-hoc projection.
 */
const adapter: PersistentStateAdapter<SemanticFileState> = {
  clone: (state) => ({
    continuantFiles: clonePerceptualContinuantFileState(state.continuantFiles),
    eventFiles: clonePerceptualEventFileState(state.eventFiles),
    valid: state.valid,
  }),
  validate: (state) => {
    continuantFileStateSummary(state.continuantFiles);
    eventFileStateSummary(state.eventFiles);
    if (!state.valid) throw new Error('injected semantic-state commit failure');
  },
  canonicalValue: (state) => list([
    perceptualContinuantFileStateValue(state.continuantFiles),
    perceptualEventFileStateValue(state.eventFiles),
    state.valid,
  ]),
  restore: (value) => {
    if (typeof value === 'boolean' || value.kind !== 'list') throw new Error('invalid semantic save');
    const [continuant, event, valid] = value.items;
    return {
      continuantFiles: restorePerceptualContinuantFileState(continuant),
      eventFiles: restorePerceptualEventFileState(event),
      valid: valid === true,
    };
  },
  analyticalAnchors: () => list([]),
  randomRelevantAuthoritativeIds: () => list([]),
};

const DETECT = typedIdentifier(33000n, text('event/sem-001i3-detect'));
const handlerKey = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));

const detectionPayload = (observerId: string, detectionId: string): CanonicalValue =>
  list([text(observerId), text(detectionId)]);

function asPayload(value: CanonicalValue): readonly [string, string] {
  if (typeof value === 'boolean' || value.kind !== 'list') throw new Error('invalid detection payload');
  const [observer, detection] = value.items;
  if (typeof observer === 'boolean' || observer.kind !== 'text') throw new Error('invalid observer payload');
  if (typeof detection === 'boolean' || detection.kind !== 'text') throw new Error('invalid detection payload');
  return [observer.value, detection.value];
}

/**
 * One scheduled detection for one observer. It advances the observer-scoped file allocators, draws
 * from the shared run-scoped runtime allocator, and contributes trace and outputs.
 */
const detectionHandler = (): EventHandler<SemanticFileState> =>
  ({ state, event, allocateRuntimeId }) => {
    const [observerId, detectionId] = asPayload(event.payload);
    const runtimeId = allocateRuntimeId();
    const continuant = applyPerceptualTrackTransition(state.continuantFiles, {
      observerId,
      currentDetectionId: { observerId, detectionOccurrenceId: detectionOrdinal(detectionId) },
      continuityKind: 'NewTrack',
      supportingObservationIds: [{ observerId, observationId: 34900n }],
      occurredAt: 10n,
      transformationVersion: version,
    });
    const eventFile = applyPerceptualEventTransition(state.eventFiles, {
      observerId,
      currentEventDetectionId: { observerId, eventDetectionOccurrenceId: detectionOrdinal(`event-${detectionId}`) },
      continuityKind: 'NewEventFile',
      supportingObservationIds: [{ observerId, observationId: 34900n }],
      occurredAt: 10n,
      transformationVersion: 'semantic-binding/0.1-candidate#SEM-001C',
    });
    return {
      nextState: { ...state, continuantFiles: continuant.state, eventFiles: eventFile.state },
      emittedEvents: [],
      traceContributions: [list([
        text(`detect:${observerId}:${detectionId}`),
        signed(runtimeId),
        perceptualContinuantFileStateValue(continuant.state),
      ])],
      outputs: [text(`track:${observerId}:${continuant.transition.perceptualReferentId.observerTrackSequence}`)],
    };
  };

async function identities(state: SemanticFileState) {
  const modelIdentity = await createModelIdentity({
    rulesVersion: 'rules/sem-001i3-fixture',
    contentSchemaVersion: 'content/fixture-1',
    contentManifest: await commitManifest(list([])),
    parameterSchemaVersion: 'parameters/fixture-1',
    parameterSet: await commitManifest(list([orderingParametersValue(20n)])),
    numericProfileVersion: 'numeric/exact-1',
    randomAlgorithmVersion: 'rng/sha256-addressed-128-v1-candidate',
    registrySchemaVersion: 'registry/fixture-1',
    registryManifest: await commitManifest(list([
      orderingPhaseRegistryValue(), DETECT, semanticStateAuthorityRegistryValue(),
    ])),
  });
  const runIdentity = await createRunIdentity({
    modelIdentity,
    initialState: await commitManifest(adapter.canonicalValue(state)),
    orderedInputSequence: await commitManifest(list([])),
    runSeed: runSeedFromFriendlyInteger(11n),
  });
  return { modelIdentity, runIdentity };
}

const scheduler = (
  state: SemanticFileState,
  handlers: ReadonlyMap<string, EventHandler<SemanticFileState>>,
) => new DeterministicScheduler({
  initialState: state,
  stateAdapter: adapter,
  handlers,
  maxSettlementWorkPerSimulationInstant: 20n,
  initialAllocators: { nextRuntimeId: 500n, nextEventId: 0n, nextEventSequence: 0n },
});

describe('SEM-001I.3 semantic state persistence and observer isolation', () => {
  it('CV-SEM-097 saves, loads, and replays semantic state roots byte-identically', async () => {
    const state = initialState();
    const identity = await identities(state);
    const handlers = new Map([[handlerKey(DETECT), detectionHandler()]]);

    const schedule = (instance: DeterministicScheduler<SemanticFileState>, at: bigint, detectionId: string) =>
      instance.schedule({
        dueAt: simInstant(at), phase: 10n, eventTypeId: DETECT,
        payload: detectionPayload(mina, detectionId), dependencies: list([]),
      });

    const save = (instance: DeterministicScheduler<SemanticFileState>) => createCanonicalSave({
      scheduler: instance,
      stateAdapter: adapter,
      modelIdentity: identity.modelIdentity,
      runIdentity: identity.runIdentity,
      continuingRunInputs: list([]),
    });

    const load = (bytes: Uint8Array) => loadCanonicalSave(bytes, {
      stateAdapter: adapter,
      handlers,
      maxSettlementWorkPerSimulationInstant: 20n,
      expectedModelIdentity: identity.modelIdentity,
      expectedRunIdentity: identity.runIdentity,
      additionalSchemas: SEMANTIC_RECORD_SCHEMAS,
    });

    // A: run both instants straight through, with no save boundary.
    const straight = scheduler(state, handlers);
    schedule(straight, 1n, 'det/1');
    await straight.settleNextInstant();
    schedule(straight, 2n, 'det/2');
    await straight.settleNextInstant();
    const straightBytes = save(straight);

    // B: run the first instant, save, load, then run the second across the boundary.
    const interrupted = scheduler(state, handlers);
    schedule(interrupted, 1n, 'det/1');
    await interrupted.settleNextInstant();
    const midpointBytes = save(interrupted);

    const loaded = await load(midpointBytes);
    // Loading and immediately re-saving reproduces the midpoint exactly.
    expect(bytesToHex(save(loaded.scheduler))).toBe(bytesToHex(midpointBytes));
    expect(loaded.scheduler.getAllocatorState()).toEqual(interrupted.getAllocatorState());
    expect(continuantFileStateSummary(loaded.scheduler.getState().continuantFiles))
      .toEqual(continuantFileStateSummary(interrupted.getState().continuantFiles));
    expect(eventFileStateSummary(loaded.scheduler.getState().eventFiles))
      .toEqual(eventFileStateSummary(interrupted.getState().eventFiles));

    schedule(loaded.scheduler, 2n, 'det/2');
    await loaded.scheduler.settleNextInstant();

    // State roots, observer counters, allocators, trace, and outputs are byte-identical to the
    // run that never crossed a persistence boundary.
    expect(bytesToHex(save(loaded.scheduler))).toBe(bytesToHex(straightBytes));
    expect(loaded.scheduler.getState().continuantFiles.nextTrackSequenceByObserver.get(mina)).toBe(2n);
    expect(loaded.scheduler.getState().eventFiles.nextEventSequenceByObserver.get(mina)).toBe(2n);
  });

  it('CV-SEM-097 rolls state, allocators, trace, and outputs back together on staged failure', async () => {
    const state = initialState();
    const failing: EventHandler<SemanticFileState> = async (context) => {
      const result = await detectionHandler()(context);
      return { ...result, nextState: { ...result.nextState, valid: false } };
    };
    const instance = scheduler(state, new Map([[handlerKey(DETECT), failing]]));
    instance.schedule({
      dueAt: simInstant(1n), phase: 10n, eventTypeId: DETECT,
      payload: detectionPayload(mina, 'det/staged'), dependencies: list([]),
    });

    const beforeState = instance.getState();
    const beforeAllocators = instance.getAllocatorState();
    const beforeSnapshot = instance.exportQuiescentSnapshot();

    await expect(instance.settleNextInstant()).rejects.toThrow(/injected semantic-state commit failure/);

    expect(instance.getState()).toEqual(beforeState);
    expect(instance.getAllocatorState()).toEqual(beforeAllocators);
    const afterSnapshot = instance.exportQuiescentSnapshot();
    expect(afterSnapshot.committedTrace).toEqual(beforeSnapshot.committedTrace);
    expect(afterSnapshot.outputs).toEqual(beforeSnapshot.outputs);
    // The observer-scoped allocator did not advance behind the failed instant.
    expect(instance.getState().continuantFiles.nextTrackSequenceByObserver.get(mina)).toBeUndefined();
  });

  it('CV-SEM-098 lets another observer perturb global ordinals without changing this observer', async () => {
    const solo = await runDetections([[mina, 'det/1'], [mina, 'det/2']]);
    const interleaved = await runDetections([
      [darius, 'det/dx1'], [mina, 'det/1'], [darius, 'det/dx2'], [mina, 'det/2'],
    ]);

    // The shared run-scoped allocator genuinely moved: Mina's work drew different runtime ordinals.
    expect(interleaved.runtimeIds).not.toEqual(solo.runtimeIds);

    // Mina's continuant tracking, event-file grouping, and observer counters are unchanged.
    expect(minaOnly(interleaved.state)).toEqual(minaOnly(solo.state));
    expect(continuantTrackSemanticView(interleaved.transitions.filter((value) => value.observerId === mina)))
      .toEqual(continuantTrackSemanticView(solo.transitions));
    expect(interleaved.state.continuantFiles.nextTrackSequenceByObserver.get(mina))
      .toBe(solo.state.continuantFiles.nextTrackSequenceByObserver.get(mina));
    expect(interleaved.state.eventFiles.nextEventSequenceByObserver.get(mina))
      .toBe(solo.state.eventFiles.nextEventSequenceByObserver.get(mina));

    // Both detection identity families are covered: Darius holds his own independent sequences.
    expect(interleaved.state.continuantFiles.nextTrackSequenceByObserver.get(darius)).toBe(2n);
    expect(interleaved.state.eventFiles.nextEventSequenceByObserver.get(darius)).toBe(2n);
    expect(solo.state.continuantFiles.nextTrackSequenceByObserver.get(darius)).toBeUndefined();
  });
});

/** Mina-scoped projection of both file states, with every foreign-observer entry removed. */
function minaOnly(state: SemanticFileState): readonly string[] {
  return [
    ...continuantFileStateSummary(state.continuantFiles),
    ...eventFileStateSummary(state.eventFiles),
  ].filter((entry) => entry.includes(mina));
}

/** Applies a canonical detection sequence directly, recording shared-allocator draws. */
async function runDetections(
  detections: readonly (readonly [string, string])[],
): Promise<{
  state: SemanticFileState;
  transitions: readonly PerceptualTrackTransition[];
  runtimeIds: readonly bigint[];
}> {
  let state = initialState();
  const transitions: PerceptualTrackTransition[] = [];
  const runtimeIds: bigint[] = [];
  let nextRuntimeId = 500n;

  for (const [observerId, detectionId] of detections) {
    const runtimeId = nextRuntimeId;
    nextRuntimeId += 1n;
    const continuant = applyPerceptualTrackTransition(state.continuantFiles, {
      observerId,
      currentDetectionId: { observerId, detectionOccurrenceId: detectionOrdinal(detectionId) },
      continuityKind: 'NewTrack',
      supportingObservationIds: [{ observerId, observationId: 34900n }],
      occurredAt: 10n,
      transformationVersion: version,
    });
    const event = applyPerceptualEventTransition(state.eventFiles, {
      observerId,
      currentEventDetectionId: { observerId, eventDetectionOccurrenceId: detectionOrdinal(`event-${detectionId}`) },
      continuityKind: 'NewEventFile',
      supportingObservationIds: [{ observerId, observationId: 34900n }],
      occurredAt: 10n,
      transformationVersion: 'semantic-binding/0.1-candidate#SEM-001C',
    });
    state = { ...state, continuantFiles: continuant.state, eventFiles: event.state };
    transitions.push(continuant.transition);
    if (observerId === mina) runtimeIds.push(runtimeId);
  }
  return { state, transitions, runtimeIds };
}
