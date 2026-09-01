import { describe, expect, it } from 'vitest';
import { bytes, bytesToHex, canonicalEncode, list, signed, text, typedIdentifier, type CanonicalValue } from '../substrate/canonicalEncoding';
import {
  DeterministicScheduler,
  SchedulerContractError,
  type EventEmission,
  type EventHandler,
  type ScheduledEvent,
  type StateAdapter,
  type TransactionBoundary,
  type TransitionResult,
} from '../substrate/scheduler';
import { simInstant } from '../substrate/time';

interface CounterState {
  readonly value: bigint;
  readonly log: readonly string[];
}

const stateAdapter: StateAdapter<CounterState> = {
  clone: (state) => ({ value: state.value, log: [...state.log] }),
  validate: (state) => {
    if (typeof state.value !== 'bigint') throw new Error('counter value must be exact');
    if (!Array.isArray(state.log) || state.log.some((entry) => typeof entry !== 'string')) throw new Error('counter log must contain text');
  },
  canonicalValue: (state) => list([signed(state.value), list(state.log.map(text))]),
};

const typeId = (name: string) => typedIdentifier(10030n, text(name));
const ROOT = typeId('root');
const CHILD = typeId('child');
const LATER = typeId('later');
const key = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));
const emptyDependencies = list([]);

const emission = (eventTypeId = ROOT, dueAt = 10n, phase = 10n, payload: CanonicalValue = text('root')): EventEmission => ({
  dueAt: simInstant(dueAt),
  phase,
  eventTypeId,
  payload,
  dependencies: emptyDependencies,
});

const transition = (
  state: CounterState,
  label: string,
  emittedEvents: readonly EventEmission[] = [],
): TransitionResult<CounterState> => ({
  nextState: { value: state.value + 1n, log: [...state.log, label] },
  emittedEvents,
  traceContributions: [text(`trace:${label}`)],
  outputs: [text(`output:${label}`)],
});

const restoredEvent = (eventId: bigint, phase: bigint, sequence: bigint, label: string): ScheduledEvent => ({
  eventId,
  dueAt: simInstant(10n),
  phase,
  eventSequence: sequence,
  eventTypeId: typeId(label),
  payload: text(label),
  dependencies: emptyDependencies,
  causalParentEventIds: [],
});

function scheduler(
  handlers: ReadonlyMap<string, EventHandler<CounterState>>,
  maxWork = 20n,
  initialQueue: readonly ScheduledEvent[] = [],
): DeterministicScheduler<CounterState> {
  return new DeterministicScheduler({
    initialState: { value: 0n, log: [] },
    stateAdapter,
    handlers,
    maxSettlementWorkPerSimulationInstant: maxWork,
    initialQueue,
    initialAllocators: initialQueue.length === 0
      ? undefined
      : {
        nextRuntimeId: 0n,
        nextEventId: initialQueue.reduce((maximum, event) => event.eventId > maximum ? event.eventId : maximum, -1n) + 1n,
        nextEventSequence: initialQueue.reduce((maximum, event) => event.eventSequence > maximum ? event.eventSequence : maximum, -1n) + 1n,
      },
  });
}

describe('Campaign 0D ordering and whole-instant transaction', () => {
  it('CV-ORD-001: queue insertion order cannot override DueAt, Phase, EventSequence', async () => {
    const events = [restoredEvent(0n, 20n, 2n, 'phase20'), restoredEvent(1n, 10n, 5n, 'sequence5'), restoredEvent(2n, 10n, 1n, 'sequence1')];
    const handlers = new Map(events.map((event) => [key(event.eventTypeId), (({ state }) => transition(state, (event.payload as { value: string }).value)) as EventHandler<CounterState>]));
    const first = scheduler(handlers, 20n, events);
    const permuted = scheduler(handlers, 20n, [events[1], events[0], events[2]]);
    await first.settleNextInstant();
    await permuted.settleNextInstant();
    expect(first.getState().log).toEqual(['sequence1', 'sequence5', 'phase20']);
    expect(permuted.exportQuiescentSnapshot()).toEqual(first.exportQuiescentSnapshot());
  });

  it('CV-ORD-002: same-phase and later-phase emissions order correctly; earlier phase fails atomically', async () => {
    const handlers = new Map<string, EventHandler<CounterState>>([
      [key(ROOT), ({ state }) => transition(state, 'root', [emission(CHILD, 10n, 50n, text('same')), emission(LATER, 10n, 60n, text('later'))])],
      [key(CHILD), ({ state }) => transition(state, 'same')],
      [key(LATER), ({ state }) => transition(state, 'later')],
    ]);
    const valid = scheduler(handlers);
    valid.schedule(emission(ROOT, 10n, 50n));
    const settled = await valid.settleNextInstant();
    expect(valid.getState().log).toEqual(['root', 'same', 'later']);
    expect(settled?.executedEvents.map((event) => [event.phase, event.eventSequence])).toEqual([[50n, 0n], [50n, 1n], [60n, 2n]]);

    const invalidHandlers = new Map<string, EventHandler<CounterState>>([
      [key(ROOT), ({ state }) => transition(state, 'must-rollback', [emission(CHILD, 10n, 40n)])],
      [key(CHILD), ({ state }) => transition(state, 'unreachable')],
    ]);
    const invalid = scheduler(invalidHandlers);
    invalid.schedule(emission(ROOT, 10n, 50n));
    const before = invalid.exportQuiescentSnapshot();
    await expect(invalid.settleNextInstant()).rejects.toThrowError(expect.objectContaining({ code: 'CAUSAL_ORDER_VIOLATION' }));
    expect(invalid.exportQuiescentSnapshot()).toMatchObject({ ...before, status: 'Failed' });
    expect(invalid.getCommittedTrace()).toEqual([]);
  });

  it('CV-ORD-003: drains a newly emitted chain before external observation', async () => {
    let activeScheduler: DeterministicScheduler<CounterState>;
    const chain: EventHandler<CounterState> = ({ state, event }) => {
      expect(() => activeScheduler.getState()).toThrow(/quiescence/);
      const step = Number((event.payload as { value: bigint }).value);
      return transition(state, `step-${step}`, step < 3 ? [emission(CHILD, 10n, 10n, signed(step + 1))] : []);
    };
    activeScheduler = scheduler(new Map([[key(CHILD), chain]]));
    activeScheduler.schedule(emission(CHILD, 10n, 10n, signed(1n)));
    const settled = await activeScheduler.settleNextInstant();
    expect(settled?.executedEvents).toHaveLength(3);
    expect(activeScheduler.getState()).toEqual({ value: 3n, log: ['step-1', 'step-2', 'step-3'] });
    expect(activeScheduler.getPendingQueue()).toEqual([]);
  });

  it('CV-ORD-004: cascade overflow restores everything and leaves no deferrable remainder', async () => {
    const loop: EventHandler<CounterState> = ({ state }) => transition(state, 'loop', [emission(CHILD, 10n, 10n)]);
    const subject = scheduler(new Map([[key(CHILD), loop]]), 3n);
    subject.schedule(emission(CHILD, 10n, 10n));
    const before = subject.exportQuiescentSnapshot();
    await expect(subject.settleNextInstant()).rejects.toThrowError(expect.objectContaining({ code: 'CASCADE_LIMIT_EXCEEDED' }));
    expect(subject.exportQuiescentSnapshot()).toMatchObject({ ...before, status: 'Failed' });
    expect(subject.failureDiagnostic?.causalChain).toEqual([0n, 1n, 2n, 3n]);
    await expect(subject.settleNextInstant()).rejects.toThrowError(expect.objectContaining({ code: 'RUN_NOT_ACTIVE' }));
  });

  it('snapshots mutable canonical payloads and committed artifacts at every authority boundary', async () => {
    const mutablePayload = bytes(Uint8Array.of(1));
    const inspect: EventHandler<CounterState> = ({ state, event }) => {
      expect((event.payload as { readonly value: Uint8Array }).value[0]).toBe(1);
      return { nextState: state, emittedEvents: [], traceContributions: [event.payload], outputs: [event.payload] };
    };
    const subject = scheduler(new Map([[key(ROOT), inspect]]));
    subject.schedule(emission(ROOT, 10n, 10n, mutablePayload));
    (mutablePayload as { readonly value: Uint8Array }).value[0] = 9;
    const exposedQueuePayload = subject.getPendingQueue()[0].payload as { readonly value: Uint8Array };
    exposedQueuePayload.value[0] = 8;
    await subject.settleNextInstant();
    const exposedTrace = subject.getCommittedTrace()[0] as { readonly value: Uint8Array };
    exposedTrace.value[0] = 7;
    expect(((subject.getCommittedTrace()[0] as { readonly value: Uint8Array }).value)[0]).toBe(1);
    expect(((subject.getOutputs()[0] as { readonly value: Uint8Array }).value)[0]).toBe(1);
  });

  it.each([
    'before-state-validation',
    'after-state-validation',
    'before-event-validation',
    'after-event-validation',
    'before-trace-validation',
    'after-trace-validation',
    'before-invariant-validation',
    'after-invariant-validation',
    'before-commit',
  ] as const)('CV-TXN-001: injected failure at %s restores state, queue, allocators, trace, and outputs', async (injectionPoint) => {
    const root: EventHandler<CounterState> = ({ state, allocateRuntimeId }) => {
      allocateRuntimeId();
      return transition(state, 'staged', [emission(CHILD, 11n, 10n)]);
    };
    const subject = scheduler(new Map([[key(ROOT), root], [key(CHILD), ({ state }) => transition(state, 'child')]]));
    subject.schedule(emission(ROOT, 10n, 10n));
    const before = subject.exportQuiescentSnapshot();
    await expect(subject.settleNextInstantForConformance({
      onBoundary: (boundary: TransactionBoundary) => {
        if (boundary === injectionPoint) throw new Error('injected');
      },
    })).rejects.toThrowError(expect.objectContaining({ code: 'CONFORMANCE_INJECTION' }));
    expect(subject.exportQuiescentSnapshot()).toMatchObject({ ...before, status: 'Failed' });
    expect(subject.getCommittedTrace()).toEqual([]);
    expect(subject.getOutputs()).toEqual([]);
    expect(subject.failureDiagnostic).toMatchObject({ code: 'CONFORMANCE_INJECTION', causalChain: [0n] });
  });
});
