import { describe, expect, it } from 'vitest';
import {
  RecordSchemaRegistry,
  bytesToHex,
  canonicalDecode,
  canonicalEncode,
  list,
  signed,
  text,
  typedIdentifier,
  type CanonicalValue,
} from '../substrate/canonicalEncoding';
import {
  DeterministicScheduler,
  SchedulerContractError,
  type ScheduledEvent,
  type TransactionBoundary,
} from '../substrate/scheduler';
import { persistenceSchemas } from '../substrate/persistence';
import {
  AuthoritativeState,
  StateAuthorityRegistry,
  createStatePatch,
  stateSchemas,
  type ActualReadRecord,
  type StatePath,
  type StatePathPattern,
  type StructuralMutationDiff,
} from '../substrate/state';
import {
  TRACE_CONTRACT_VERSION,
  failureDiagnosticValue,
  findFirstTraceDivergence,
  traceRecordValue,
  traceSchemas,
  type TraceRecord,
} from '../substrate/trace';
import { authoritativeStateAdapter, createContractEventHandler } from '../substrate/transition';
import { simInstant } from '../substrate/time';

const character = typedIdentifier(21000n, text('character/alex'));
const authority = typedIdentifier(21001n, text('authority/traits'));
const eventType = typedIdentifier(21002n, text('event/decide'));
const childType = typedIdentifier(21002n, text('event/consequence'));
const seamId = typedIdentifier(21003n, text('seam/decision'));
const recordKind = typedIdentifier(21004n, text('record/decision'));
const accessorId = typedIdentifier(21005n, text('accessor/strength'));
const path: StatePath = { rootStateTypeId: 1n, fieldId: 1n, selectors: [{ kind: 'typedEntity', id: character }] };
const pattern: StatePathPattern = { rootStateTypeId: 1n, fieldId: 1n, selectors: [{ kind: 'wildcard', selectorKind: 'typedEntity' }] };
const validateSigned = (value: CanonicalValue): void => {
  if (typeof value === 'boolean' || value.kind !== 'signed') throw new Error('expected signed');
};
const registry = new StateAuthorityRegistry(
  [{ pattern, validateValue: validateSigned, removalAllowed: false }],
  [{ mutationAuthorityId: authority, patterns: [pattern] }],
);
const adapter = authoritativeStateAdapter(registry);
const key = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));
const initialState = () => new AuthoritativeState([{ path, value: signed(4n) }]);
const rootEvent = (): ScheduledEvent => ({
  eventId: 0n, dueAt: simInstant(10n), phase: 10n, eventSequence: 0n, eventTypeId: eventType,
  payload: text('choose'), dependencies: list([]), causalParentEventIds: [],
});

function integratedScheduler(invalidEmission = false, invalidPatch = false): DeterministicScheduler<AuthoritativeState> {
  const handler = createContractEventHandler(
    {
      seamId, seamVersion: 'decision/1', recordKind, mutationAuthorityId: authority,
      readDomain: [pattern],
      bindings: { strength: { kind: 'direct' as const, accessorId, path } },
    },
    registry,
    { modelIdentity: text('model-fixture'), runIdentity: text('run-fixture') },
    (projection) => {
      const strength = projection.read('strength')!;
      return {
        statePatch: createStatePatch([{
          kind: 'set', path,
          expected: { presence: true, value: invalidPatch ? signed(99n) : strength },
          newValue: signed(5n),
        }]),
        emittedEvents: [{
          dueAt: simInstant(20n), phase: invalidEmission ? 999n : 10n, eventTypeId: childType,
          payload: text('child'), dependencies: list([]),
        }],
        outputs: [text('resolved')], subjectIds: [character], sourceRecordIds: [],
        inputProjection: strength, outputProjection: signed(5n),
        randomDrawRecords: [text('draw/evidence')], quantizationOperations: [], invariantResults: [text('valid')],
      };
    },
  );
  return new DeterministicScheduler({
    initialState: initialState(), stateAdapter: adapter,
    handlers: new Map([[key(eventType), handler]]), maxSettlementWorkPerSimulationInstant: 10n,
    initialQueue: [rootEvent()], initialAllocators: { nextRuntimeId: 0n, nextEventId: 1n, nextEventSequence: 1n },
  });
}

describe('Campaign 0E committed trace and diagnostics', () => {
  it('CV-TRC-001 produces byte-identical canonical traces with structurally decodable records', async () => {
    const left = integratedScheduler();
    const right = integratedScheduler();
    await left.settleNextInstant();
    await right.settleNextInstant();
    const leftTrace = left.getCommittedTrace();
    const rightTrace = right.getCommittedTrace();
    expect(leftTrace.map(key)).toEqual(rightTrace.map(key));
    expect(left.getPendingQueue()[0]).toMatchObject({ eventId: 1n, eventSequence: 1n });

    const schemas = new RecordSchemaRegistry([
      ...Object.values(traceSchemas), ...Object.values(stateSchemas), ...Object.values(persistenceSchemas),
    ]);
    const decoded = canonicalDecode(canonicalEncode(leftTrace[0]), schemas);
    expect(key(decoded)).toBe(key(leftTrace[0]));
    expect(() => canonicalDecode(canonicalEncode(leftTrace[0]), new RecordSchemaRegistry([
      ...Object.values(stateSchemas), ...Object.values(persistenceSchemas),
    ]))).toThrowError(/unknown record schema/);
  });

  it('CV-TRC-002 keeps aborted staged evidence only in FailureDiagnostic and rolls back the instant', async () => {
    const scheduler = integratedScheduler(true);
    const beforeState = key(scheduler.getState().canonicalValue());
    const beforeQueue = scheduler.getPendingQueue();
    const beforeAllocators = scheduler.getAllocatorState();
    await expect(scheduler.settleNextInstant()).rejects.toMatchObject({ code: 'INVALID_EVENT' });
    expect(scheduler.status).toBe('Failed');
    expect(key(scheduler.getState().canonicalValue())).toBe(beforeState);
    expect(scheduler.getPendingQueue()).toEqual(beforeQueue);
    expect(scheduler.getAllocatorState()).toEqual(beforeAllocators);
    expect(scheduler.getCommittedTrace()).toEqual([]);
    expect(scheduler.failureDiagnostic?.candidateTransitionData).toBeDefined();
    expect(() => canonicalEncode(failureDiagnosticValue(text('run-fixture'), scheduler.failureDiagnostic!))).not.toThrow();
    await expect(scheduler.settleNextInstant()).rejects.toMatchObject({ code: 'RUN_NOT_ACTIVE' });

    const badPatch = integratedScheduler(false, true);
    await expect(badPatch.settleNextInstant()).rejects.toMatchObject({ code: 'STATE_VALIDATION_FAILURE' });
    expect(badPatch.failureDiagnostic?.candidateTransitionData).toBeDefined();
    expect(badPatch.getCommittedTrace()).toEqual([]);
  });

  it('CV-TXN-001 rolls concrete reads, patches, allocated emissions, and trace back at every boundary', async () => {
    const boundaries: readonly TransactionBoundary[] = [
      'before-state-validation', 'after-state-validation', 'before-event-validation', 'after-event-validation',
      'before-trace-validation', 'after-trace-validation', 'before-invariant-validation',
      'after-invariant-validation', 'before-commit',
    ];
    for (const failedBoundary of boundaries) {
      const scheduler = integratedScheduler();
      const beforeState = key(scheduler.getState().canonicalValue());
      const beforeQueue = scheduler.getPendingQueue();
      const beforeAllocators = scheduler.getAllocatorState();
      await expect(scheduler.settleNextInstantForConformance({
        onBoundary: (boundary) => { if (boundary === failedBoundary) throw new Error('injected'); },
      })).rejects.toMatchObject({ code: 'CONFORMANCE_INJECTION' });
      expect(key(scheduler.getState().canonicalValue()), failedBoundary).toBe(beforeState);
      expect(scheduler.getPendingQueue(), failedBoundary).toEqual(beforeQueue);
      expect(scheduler.getAllocatorState(), failedBoundary).toEqual(beforeAllocators);
      expect(scheduler.getCommittedTrace(), failedBoundary).toEqual([]);
      expect(scheduler.getOutputs(), failedBoundary).toEqual([]);
    }
  });
});

describe('Campaign 0E first-divergence evidence', () => {
  it('CV-TRC-003 locates identity, random, time/event, read, patch, and output divergence with ancestry', () => {
    const base = sampleTrace();
    const variants: readonly [TraceRecord, string][] = [
      [{ ...base, modelIdentity: text('model-B') }, 'ModelIdentity'],
      [{ ...base, randomDrawRecords: [text('draw-B')] }, 'RandomDrawRecords'],
      [{ ...base, event: { ...base.event, dueAt: simInstant(11n) } }, 'Event.DueAt'],
      [{ ...base, actualReadRecords: [{ ...base.actualReadRecords[0], value: signed(8n) }] }, 'ActualReadRecords'],
      [{ ...base, statePatch: createStatePatch([{ kind: 'set', path, expected: { presence: true, value: signed(4n) }, newValue: signed(9n) }]) }, 'StatePatch'],
      [{ ...base, outputProjection: signed(9n) }, 'OutputProjection'],
    ];
    for (const [variant, expectedPath] of variants) {
      const difference = findFirstTraceDivergence([base], [variant]);
      expect(difference?.recordIndex).toBe(0);
      expect(difference?.structuralField).toContain(expectedPath);
      expect(difference?.oldValue).toBeDefined();
      expect(difference?.newValue).toBeDefined();
      expect(difference?.oldCausalAncestry).toEqual([2n, 3n]);
    }
    expect(findFirstTraceDivergence([base], [base])).toBeUndefined();
  });
});

function sampleTrace(): TraceRecord {
  const read: ActualReadRecord = {
    accessorId, path, presence: true, value: signed(4n), derivedSources: [],
  };
  const diff: StructuralMutationDiff = {
    path, oldPresence: true, oldValue: signed(4n), newPresence: true, newValue: signed(5n), mutationAuthorityId: authority,
  };
  return {
    traceSchemaVersion: TRACE_CONTRACT_VERSION,
    modelIdentity: text('model-A'), runIdentity: text('run-A'),
    event: { ...rootEvent(), eventId: 3n, causalParentEventIds: [2n] },
    seamId, seamVersion: 'decision/1', recordKind, subjectIds: [character], sourceRecordIds: [],
    registeredReadDomain: [pattern], actualReadRecords: [read], inputProjection: signed(4n), outputProjection: signed(5n),
    randomDrawRecords: [text('draw-A')], quantizationOperations: [],
    statePatch: createStatePatch([{ kind: 'set', path, expected: { presence: true, value: signed(4n) }, newValue: signed(5n) }]),
    structuralMutationDiffs: [diff], emittedEvents: [], invariantResults: [text('valid')],
  };
}
