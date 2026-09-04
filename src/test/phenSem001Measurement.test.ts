import { describe, expect, it } from 'vitest';
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
} from './fixtures/phenSem001';

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

describe('PHEN-SEM-001 scalar measurement as supporting evidence', () => {
  it('CV-SEM-011 cites a real bounded measurement as supporting evidence', () => {
    const observed = measurement();
    // A genuine exact-interval measurement from the accepted bounded-observation seam.
    expect(observed.evidenceKindId).toBe(EvidenceKindId.Point);
    expect(observed.measurementInterval.lower?.equals(r(1n, 10n))).toBe(true);

    // Its occurrence identity lives in the accepted `ObservationId` namespace. Anchored to the
    // frozen `SEM-001I.2` value rather than recomputed from the same helper, so a namespace change
    // is caught instead of moving both sides of the comparison together.
    expect(SEMANTIC_OCCURRENCE_NAMESPACES.ObservationId).toBe(1115n);
    expect(observed.observationId.namespaceId).toBe(1115n);

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
    // The measurement is cited as support, and only as support. The join runs from the binding's
    // own citation back to the measurement, not from a shared constant.
    expect(binding.supportingObservationIds.map((value) => value.observationId))
      .toEqual([MEASUREMENT_ORDINAL]);
    const citedAsOccurrence = semanticOccurrenceId(
      'ObservationId', binding.supportingObservationIds[0].observationId);
    expect(hex(citedAsOccurrence)).toBe(hex(observed.observationId));

    // It is not the referent identity: that is the observer's own continuant-file.
    expect(binding.perceptualReferentId).toEqual(track.transition.perceptualReferentId);
    expect(binding.perceptualReferentId.observerTrackSequence).not.toBe(MEASUREMENT_ORDINAL);

    // It is not the role evidence either: that is a registered `EventRoleId`.
    expect(binding.eventRoleEvidence).toEqual({ kind: 'exact', eventRoleId: EventRoleId.Instrument });
    expect(Object.keys(binding.eventRoleEvidence).sort()).toEqual(['eventRoleId', 'kind']);

    // And nothing of the measurement's own content — interval, precision, truth record — reaches
    // the binding. Only the occurrence reference does.
    const serialized = stringifyWithBigInts(binding);
    expect(serialized).not.toContain('measurementInterval');
    expect(serialized).not.toContain('precision');
    expect(serialized).not.toContain('truth/effect');
  });

  it('CV-SEM-011 does not require measurement support on every binding', () => {
    // The canonical three-observer projection carries no scalar measurement at all, and every
    // binding in it is nonetheless well-formed. Measurement is admissible support, never a
    // precondition for perceiving a binding.
    const projection = projectObserver({
      observerId: MINA,
      truth: truthBindings(),
      allocator: createRunAllocator(),
      experienceId: 1n,
    });
    expect(projection.perceivedBindings.length).toBeGreaterThan(0);
    for (const binding of projection.perceivedBindings) {
      expect(binding.supportingObservationIds.length).toBeGreaterThan(0);
      expect(binding.eventRoleEvidence.kind).toBe('exact');
    }

    // A binding backed by a measurement and one backed by ordinary observation are the same shape:
    // the citing structure does not record which kind of observation it points at.
    const measured = measurement();
    expect(measured.observationId.namespaceId).toBe(1115n);
    const ordinaryKeys = Object.keys(projection.perceivedBindings[0].supportingObservationIds[0]).sort();
    expect(ordinaryKeys).toEqual(['observationId', 'observerId']);
  });
});

describe('PHEN-SEM-001 whole-instant abort', () => {
  it('CV-SEM-014 restores state, allocators, trace, and outputs after an illegal binding', () => {
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

    const beforeState = scheduler.getState();
    const beforeAllocators = scheduler.getAllocatorState();
    const beforeSnapshot = scheduler.exportQuiescentSnapshot();

    return expect(scheduler.settleNextInstant())
      .rejects.toThrow(/injected semantic-binding commit failure/)
      .then(() => {
        // Nothing the failed instant produced survives: no committed binding, no advanced
        // allocator, no trace contribution, no output.
        expect(scheduler.getState()).toEqual(beforeState);
        expect(scheduler.getState().committedBindings).toEqual([]);
        expect(scheduler.getAllocatorState()).toEqual(beforeAllocators);
        expect(scheduler.getAllocatorState().nextRuntimeId).toBe(700n);
        const afterSnapshot = scheduler.exportQuiescentSnapshot();
        expect(afterSnapshot.committedTrace).toEqual(beforeSnapshot.committedTrace);
        expect(afterSnapshot.outputs).toEqual(beforeSnapshot.outputs);
      });
  });
});
