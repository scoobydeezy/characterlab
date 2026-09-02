import { describe, expect, it } from 'vitest';
import { bytesToHex, canonicalEncode, list, rational, record, text, typedIdentifier, type CanonicalValue } from '../substrate/canonicalEncoding';
import { ExactRational } from '../substrate/exactMath';
import { DeterministicScheduler, type EventHandler, type ScheduledEvent } from '../substrate/scheduler';
import { AuthoritativeState, StateAuthorityRegistry, createStatePatch, type StatePath, type StatePathPattern } from '../substrate/state';
import { authoritativeStateAdapter, createContractEventHandler } from '../substrate/transition';
import { simInstant } from '../substrate/time';
import { findCanonicalValueDivergence } from '../substrate/trace';
import {
  MeasurementModeId,
  MissingnessRuleId,
  PolarityId,
  boundedEffectTruthValue,
  compilePermittedEvidence,
  observationChannelValue,
  observationSchemas,
  permittedEvidenceValue,
  restoreBoundedEffectTruth,
  restoreObservationChannel,
  thinSemanticExperienceValue,
  validatePermittedEvidenceRecordClosure,
  validateThinSemanticExperienceRecordClosure,
  type BoundedEffectTruth,
  type ObservationChannel,
} from '../observation/observation';

const id = (namespace: bigint, value: string) => typedIdentifier(namespace, text(value));
const observer = id(25000n, 'character/mina');
const subject = id(25001n, 'need/connection');
const channelId = id(25002n, 'channel/connection-interoception');
const observationId = id(25003n, 'observation/golden');
const experienceId = id(25003n, 'experience/golden');
const observeEventType = id(25004n, 'event/observe-effect');
const evidenceEventType = id(25004n, 'event/permitted-evidence');
const experienceEventType = id(25004n, 'event/thin-semantic-experience');
const seamId = id(25005n, 'seam/truth-to-permitted-evidence');
const recordKind = id(25006n, 'record/permitted-evidence-compilation');
const channelAccessor = id(25007n, 'accessor/observation-channel');
const contentAuthority = id(25008n, 'authority/observation-channel-registry');
const observationAuthority = id(25008n, 'authority/observation-none');
const action = id(25009n, 'action/connect');
const truthRecordId = id(25010n, 'truth/effect/golden');
const r = (n: bigint, d = 1n) => ExactRational.of(n, d);
const key = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));
const channelPath: StatePath = { rootStateTypeId: 4n, fieldId: 1n, selectors: [{ kind: 'typedEntity', id: channelId }] };
const channelPattern: StatePathPattern = { rootStateTypeId: 4n, fieldId: 1n, selectors: [{ kind: 'wildcard', selectorKind: 'typedEntity' }] };

const channel: ObservationChannel = {
  observationChannelId: channelId, observerId: observer, subjectId: subject,
  modalityId: id(25011n, 'modality/interoception'), unitId: id(25012n, 'unit/normalized-level'),
  polarityId: PolarityId.Increase, measurementModeId: MeasurementModeId.BoundedStateChange,
  precision: r(2n), visibleProvenanceSlotIds: [1n], missingnessRuleId: MissingnessRuleId.AlwaysPresent,
};

const smallerTruth = effectTruth(r(1n, 10n), r(1n, 20n));
const largerTruth = effectTruth(r(4n, 5n), r(3n, 4n));

const authorityRegistry = new StateAuthorityRegistry(
  [{ pattern: channelPattern, validateValue: (value) => { restoreObservationChannel(value); }, removalAllowed: false }],
  [
    { mutationAuthorityId: contentAuthority, patterns: [channelPattern] },
    { mutationAuthorityId: observationAuthority, patterns: [] },
  ],
);
const adapter = authoritativeStateAdapter(authorityRegistry);

function effectTruth(potentialEffect: ExactRational, overflow: ExactRational): BoundedEffectTruth {
  return {
    before: r(19n, 20n), potentialEffect, applied: r(1n, 20n), overflow, after: r(1n), minimum: r(0n), maximum: r(1n),
    provenance: { slots: new Map([[1n, [action]]]) }, truthRecordId,
  };
}

function scheduler(payload: CanonicalValue): DeterministicScheduler<AuthoritativeState> {
  const observeHandler = createContractEventHandler(
    {
      seamId, seamVersion: 'observation/0.1-candidate', recordKind, mutationAuthorityId: observationAuthority,
      readDomain: [channelPattern], bindings: { channel: { kind: 'direct' as const, accessorId: channelAccessor, path: channelPath } },
    },
    authorityRegistry,
    { modelIdentity: text('model/observation-fixture'), runIdentity: text('run/observation-fixture') },
    (projection, context) => {
      const truth = restoreBoundedEffectTruth(context.event.payload);
      const restoredChannel = restoreObservationChannel(projection.read('channel')!);
      const evidence = compilePermittedEvidence(truth, restoredChannel, observationId, context.instant);
      const evidenceValue = permittedEvidenceValue(evidence);
      validatePermittedEvidenceRecordClosure(evidenceValue);
      return {
        statePatch: createStatePatch([]),
        emittedEvents: [{
          dueAt: context.instant, phase: 120n, eventTypeId: evidenceEventType,
          payload: evidenceValue, dependencies: list([truth.truthRecordId, restoredChannel.observationChannelId]),
        }],
        outputs: [evidenceValue], subjectIds: [observer, subject], sourceRecordIds: [truth.truthRecordId],
        inputProjection: list([context.event.payload, observationChannelValue(restoredChannel)]),
        outputProjection: evidenceValue, invariantResults: [text('permitted-evidence-closure-valid')],
      };
    },
  );
  const evidenceHandler = createContractEventHandler(
    {
      seamId: id(25005n, 'seam/permitted-evidence-to-semantic-experience'), seamVersion: 'observation/0.1-candidate',
      recordKind: id(25006n, 'record/thin-semantic-experience'), mutationAuthorityId: observationAuthority,
      readDomain: [], bindings: {},
    }, authorityRegistry,
    { modelIdentity: text('model/observation-fixture'), runIdentity: text('run/observation-fixture') },
    (_projection, context) => {
      validatePermittedEvidenceRecordClosure(context.event.payload);
      const experience = thinSemanticExperienceValue(experienceId, observer, context.instant, [context.event.payload]);
      validateThinSemanticExperienceRecordClosure(experience);
      return {
        statePatch: createStatePatch([]),
        emittedEvents: [{
          dueAt: context.instant, phase: 130n, eventTypeId: experienceEventType,
          payload: experience, dependencies: list([observationId]),
        }],
        outputs: [experience], subjectIds: [observer], sourceRecordIds: [observationId],
        inputProjection: context.event.payload, outputProjection: experience,
        invariantResults: [text('semantic-experience-closure-valid')],
      };
    },
  );
  const consumerHandler = createContractEventHandler(
    {
      seamId: id(25005n, 'seam/semantic-experience-immediate-consumer'), seamVersion: 'observation/0.1-candidate',
      recordKind: id(25006n, 'record/immediate-consumer-control'), mutationAuthorityId: observationAuthority,
      readDomain: [], bindings: {},
    }, authorityRegistry,
    { modelIdentity: text('model/observation-fixture'), runIdentity: text('run/observation-fixture') },
    (_projection, context) => {
      validateThinSemanticExperienceRecordClosure(context.event.payload);
      const consumed = list([text('consumed-permitted-experience'), context.event.payload]);
      return {
        statePatch: createStatePatch([]), emittedEvents: [], outputs: [consumed],
        subjectIds: [observer], sourceRecordIds: [experienceId],
        inputProjection: context.event.payload, outputProjection: consumed,
        invariantResults: [text('consumer-read-only-permitted-experience')],
      };
    },
  );
  const event: ScheduledEvent = {
    eventId: 0n, dueAt: simInstant(10n), phase: 110n, eventSequence: 0n, eventTypeId: observeEventType,
    payload, dependencies: list([]), causalParentEventIds: [],
  };
  return new DeterministicScheduler({
    initialState: new AuthoritativeState([{ path: channelPath, value: observationChannelValue(channel) }]),
    stateAdapter: adapter, handlers: new Map<string, EventHandler<AuthoritativeState>>([
      [key(observeEventType), observeHandler], [key(evidenceEventType), evidenceHandler], [key(experienceEventType), consumerHandler],
    ]),
    maxSettlementWorkPerSimulationInstant: 10n, initialQueue: [event],
    initialAllocators: { nextRuntimeId: 0n, nextEventId: 1n, nextEventSequence: 1n },
  });
}

describe('Campaign 1 observation seam transaction integration', () => {
  it('CV-EPI-001 keeps character evidence equal while omniscient event/trace truth differs', async () => {
    const left = scheduler(boundedEffectTruthValue(smallerTruth));
    const right = scheduler(boundedEffectTruthValue(largerTruth));
    const leftResult = await left.settleNextInstant();
    const rightResult = await right.settleNextInstant();
    expect(leftResult?.executedEvents).toHaveLength(3);
    expect(rightResult?.executedEvents).toHaveLength(3);
    expect(left.getOutputs().map(key)).toEqual(right.getOutputs().map(key));
    expect(left.getPendingQueue()).toEqual([]);
    expect(right.getPendingQueue()).toEqual([]);
    expect(left.getAllocatorState()).toEqual({ nextRuntimeId: 0n, nextEventId: 3n, nextEventSequence: 3n });
    const leftRecords = left.getCommittedTrace();
    const rightRecords = right.getCommittedTrace();
    const leftTrace = leftRecords.map(key);
    const rightTrace = rightRecords.map(key);
    expect(leftTrace[0]).not.toBe(rightTrace[0]);
    expect(leftTrace.slice(1)).toEqual(rightTrace.slice(1));
    expect(findCanonicalValueDivergence(leftRecords[0], rightRecords[0], 'TraceRecord')).toMatchObject({
      structuralField: 'TraceRecord.Event.Payload.PotentialEffect',
    });
    expect(key(left.getState().canonicalValue())).toBe(key(right.getState().canonicalValue()));
  });

  it('CV-OBS-006 rolls back invalid truth with no evidence, trace, output, or allocation commit', async () => {
    const valid = boundedEffectTruthValue(smallerTruth);
    if (typeof valid === 'boolean' || valid.kind !== 'record') throw new Error('fixture must be a record');
    const invalidPayload = record(observationSchemas.boundedEffectTruth, new Map(valid.fields).set(3n, rational(1n, 4n)));
    const run = scheduler(invalidPayload);
    const beforeState = key(run.getState().canonicalValue());
    const beforeQueue = run.getPendingQueue();
    const beforeAllocators = run.getAllocatorState();
    await expect(run.settleNextInstant()).rejects.toMatchObject({ code: 'TRANSITION_FAILURE' });
    expect(run.status).toBe('Failed');
    expect(key(run.getState().canonicalValue())).toBe(beforeState);
    expect(run.getPendingQueue()).toEqual(beforeQueue);
    expect(run.getAllocatorState()).toEqual(beforeAllocators);
    expect(run.getCommittedTrace()).toEqual([]);
    expect(run.getOutputs()).toEqual([]);
  });
});
