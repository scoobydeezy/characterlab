// Original helper/setup bodies from src/test/phenSem001Measurement.test.ts; no test hooks.

import {
  bytesToHex, canonicalEncode, list, text, typedIdentifier, type CanonicalValue,
} from '../substrate/canonicalEncoding';
import { ExactRational } from '../substrate/exactMath';
import { simInstant } from '../substrate/time';
import { DeterministicScheduler, type EventHandler, type StateAdapter } from '../substrate/scheduler';
import {
  EvidenceKindId,
  MeasurementModeId,
  MissingnessRuleId,
  PolarityId,
  compilePermittedEvidence,
  type BoundedEffectTruth,
  type ObservationChannel,
  type PresentObservation,
} from '../observation/observation';
import { EventRoleId } from '../semanticBinding/eventBindings';
import {
  applyPerceptualTrackTransition,
  emptyPerceptualContinuantFileState,
} from '../semanticBinding/perceptualContinuantFiles';
import { compilePerceivedBindings } from '../semanticBinding/perceptualEventFiles';
import { SEMANTIC_OCCURRENCE_NAMESPACES, SEMANTIC_TYPED_ID_NAMESPACES } from '../semanticBinding/semanticSchemaRegistry';
import { semanticOccurrenceId } from '../semanticBinding/semanticCodecs';
import {
  MINA,
  SEM_A,
  SEM_C,
  createRunAllocator,
  projectObserver,
  stringifyWithBigInts,
  truthBindings,
} from '../test/fixtures/phenSem001';

const r = (numerator: bigint, denominator = 1n) => ExactRational.of(numerator, denominator);
const id = (namespace: bigint, value: string) => typedIdentifier(namespace, text(value));
const hex = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));

/**
 * The measurement's `ObservationId` is minted in the accepted `SEM-001I.2` occurrence namespace
 * (1115) with an allocated ordinal payload — the same occurrence family a perceived binding cites
 * as supporting evidence. That is what makes the two seams refer to one observation rather than
 * two coincidentally similar ones.
 */
const MEASUREMENT_ORDINAL = 7100n;
const measurementObservationId = semanticOccurrenceId('ObservationId', MEASUREMENT_ORDINAL);

const channel: ObservationChannel = {
  observationChannelId: id(26002n, 'channel/instrument-mass-delta'),
  observerId: typedIdentifier(SEMANTIC_TYPED_ID_NAMESPACES.ObserverId, text(MINA)),
  subjectId: id(26001n, 'subject/held-object-load'),
  modalityId: id(26003n, 'modality/proprioception'),
  unitId: id(26004n, 'unit/normalized-load'),
  polarityId: PolarityId.Increase,
  measurementModeId: MeasurementModeId.BoundedStateChange,
  precision: r(2n),
  visibleProvenanceSlotIds: [1n],
  missingnessRuleId: MissingnessRuleId.AlwaysPresent,
};

const boundedTruth: BoundedEffectTruth = {
  before: r(2n, 5n), potentialEffect: r(1n, 10n), applied: r(1n, 10n), overflow: r(0n), after: r(1n, 2n),
  minimum: r(0n), maximum: r(1n),
  provenance: { slots: new Map([[1n, [id(26007n, 'action/lift')]]]) },
  truthRecordId: id(26006n, 'truth/effect/instrument-load'),
};

const measurement = (): PresentObservation => {
  const value = compilePermittedEvidence(boundedTruth, channel, measurementObservationId, simInstant(10n));
  if (value.kind !== 'present') throw new Error('expected a present observation');
  return value;
};


export function measuredBinding(){
    const observerId = MINA;
    let files = emptyPerceptualContinuantFileState();
    const track = applyPerceptualTrackTransition(files, {
      observerId,
      currentDetectionId: { observerId, detectionOccurrenceId: 1n },
      continuityKind: 'NewTrack',
      supportingObservationIds: [{ observerId, observationId: MEASUREMENT_ORDINAL }],
      occurredAt: 10n,
      transformationVersion: SEM_A,
    });
    files = track.state;

    const eventFile = { observerId, observerEventSequence: 0n };
    const compiled = compilePerceivedBindings([
      // One binding is backed by the measurement...
      {
        observerId,
        perceptualEventReferentId: eventFile,
        perceptualReferentId: track.transition.perceptualReferentId,
        eventRoleEvidence: { kind: 'exact', eventRoleId: EventRoleId.Instrument },
        supportingObservationIds: [{ observerId, observationId: MEASUREMENT_ORDINAL }],
        occurredAt: 10n,
        transformationVersion: SEM_C,
      },
    ], 100n);

    const binding = compiled.bindings[0];

return {observed:measurement(),binding,track};
}
export function rollbackFixture(){
    interface FixtureState {
      readonly committedBindings: readonly string[];
      readonly valid: boolean;
    }

    const adapter: StateAdapter<FixtureState> = {
      clone: (state) => ({ committedBindings: [...state.committedBindings], valid: state.valid }),
      validate: (state) => {
        if (!state.valid) throw new Error('injected semantic-binding commit failure');
      },
      canonicalValue: (state) => list([
        list(state.committedBindings.map(text)),
        state.valid,
      ]),
    };

    const eventTypeId = id(34000n, 'event/phen-sem-001-bind');
    const handlerKey = bytesToHex(canonicalEncode(eventTypeId));

    // The handler does real work — allocates occurrence ordinals, compiles bindings, contributes
    // trace and outputs — and then fails invariant validation at settlement.
    const handler: EventHandler<FixtureState> = ({ state, allocateRuntimeId }) => {
      const observerId = MINA;
      const runtimeId = allocateRuntimeId();
      const track = applyPerceptualTrackTransition(emptyPerceptualContinuantFileState(), {
        observerId,
        currentDetectionId: { observerId, detectionOccurrenceId: allocateRuntimeId() },
        continuityKind: 'NewTrack',
        supportingObservationIds: [{ observerId, observationId: allocateRuntimeId() }],
        occurredAt: 10n,
        transformationVersion: SEM_A,
      });
      const compiled = compilePerceivedBindings([{
        observerId,
        perceptualEventReferentId: { observerId, observerEventSequence: 0n },
        perceptualReferentId: track.transition.perceptualReferentId,
        eventRoleEvidence: { kind: 'exact', eventRoleId: EventRoleId.Instrument },
        supportingObservationIds: [{ observerId, observationId: 1n }],
        occurredAt: 10n,
        transformationVersion: SEM_C,
      }], allocateRuntimeId());

      return {
        nextState: {
          committedBindings: [...state.committedBindings, `binding/${compiled.bindings[0].perceivedBindingId}`],
          valid: false,
        },
        emittedEvents: [],
        traceContributions: [list([text(`bind:${runtimeId}`)])],
        outputs: [text(`output:${runtimeId}`)],
      };
    };

    const scheduler = new DeterministicScheduler({
      initialState: { committedBindings: [], valid: true },
      stateAdapter: adapter,
      handlers: new Map([[handlerKey, handler]]),
      maxSettlementWorkPerSimulationInstant: 20n,
      initialAllocators: { nextRuntimeId: 700n, nextEventId: 0n, nextEventSequence: 0n },
    });
    scheduler.schedule({
      dueAt: simInstant(1n), phase: 10n, eventTypeId, payload: list([]), dependencies: list([]),
    });


return {scheduler,adapter};
}
export {measurement,channel,boundedTruth};
export const originalSource={path:'src/test/phenSem001Measurement.test.ts',sha256:'e2b8b10a96b094b5e615c2fec59973ecb4b28a824f118b8d40c141a404c928ef'} as const;
