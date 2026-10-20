
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


export function createPersistenceFixture(){
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

return {mina,darius,version,initialState,adapter,DETECT,handlerKey,detectionPayload,detectionHandler,identities,scheduler,minaOnly,runDetections,occurrenceOrdinals:()=>[...OCCURRENCE_ORDINALS].map(([label,ordinal])=>({label,ordinal:String(ordinal)}))};
}
export const originalSource={path:'src/test/semanticStatePersistence.test.ts',sha256:'ae25e3cb864b1ca31797467a8f2a7f6332c6213f40d8d2f0b233188abe6e730d'} as const;
