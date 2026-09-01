import {
  bytesToHex,
  canonicalEncode,
  cloneCanonicalValue,
  list,
  record,
  text,
  unsigned,
  type CanonicalValue,
  type RecordSchema,
  type TypedIdentifierValue,
} from './canonicalEncoding';
import { INT64_MAX, simInstant, type SimInstant } from './time';

export const ORDERING_CONTRACT_VERSION = 'ordering/0.2-candidate' as const;
export const ORDERING_PHASE_REGISTRY_VERSION = 'ordering-phases/1-candidate' as const;
export const ORDERING_PHASES = [0n, 10n, 20n, 30n, 40n, 50n, 51n, 52n, 60n, 70n, 80n, 90n, 100n, 110n, 120n, 130n, 140n, 150n] as const;

export const schedulerSchemas = {
  orderingParameters: schema(133n, 'OrderingParameters', ['MaxSettlementWorkPerSimulationInstant']),
  phaseRegistry: schema(134n, 'OrderingPhaseRegistry', ['RegistryVersion', 'Phases']),
} as const;

export type RunStatus = 'Active' | 'Failed';
export type TransactionBoundary =
  | 'before-state-validation'
  | 'after-state-validation'
  | 'before-event-validation'
  | 'after-event-validation'
  | 'before-trace-validation'
  | 'after-trace-validation'
  | 'before-invariant-validation'
  | 'after-invariant-validation'
  | 'before-commit';

export interface AllocatorState {
  readonly nextRuntimeId: bigint;
  readonly nextEventId: bigint;
  readonly nextEventSequence: bigint;
}

export interface ScheduledEvent {
  readonly eventId: bigint;
  readonly dueAt: SimInstant;
  readonly phase: bigint;
  readonly eventSequence: bigint;
  readonly eventTypeId: TypedIdentifierValue;
  readonly payload: CanonicalValue;
  readonly dependencies: CanonicalValue;
  readonly causalParentEventIds: readonly bigint[];
}

export interface EventEmission {
  readonly dueAt: SimInstant;
  readonly phase: bigint;
  readonly eventTypeId: TypedIdentifierValue;
  readonly payload: CanonicalValue;
  readonly dependencies: CanonicalValue;
  readonly additionalCausalParentEventIds?: readonly bigint[];
}

export interface TransitionResult<State> {
  readonly nextState: State;
  readonly emittedEvents: readonly EventEmission[];
  readonly traceContributions: readonly CanonicalValue[];
  /** Builds committed records after emitted events receive canonical IDs/sequences. */
  readonly traceFactory?: (allocatedEmittedEvents: readonly ScheduledEvent[]) => readonly CanonicalValue[];
  /** Staged evidence copied only into a failure diagnostic if this instant aborts. */
  readonly failureContext?: CanonicalValue;
  readonly outputs: readonly CanonicalValue[];
}

export interface EventHandlerContext<State> {
  readonly state: State;
  readonly event: ScheduledEvent;
  readonly instant: SimInstant;
  allocateRuntimeId(): bigint;
}

export type EventHandler<State> = (
  context: EventHandlerContext<State>,
) => TransitionResult<State> | Promise<TransitionResult<State>>;

export interface StateAdapter<State> {
  clone(state: State): State;
  validate(state: State): void;
  canonicalValue(state: State): CanonicalValue;
}

export interface SchedulerConfiguration<State> {
  readonly initialState: State;
  readonly stateAdapter: StateAdapter<State>;
  readonly handlers: ReadonlyMap<string, EventHandler<State>>;
  readonly maxSettlementWorkPerSimulationInstant: bigint;
  readonly initialClock?: SimInstant;
  readonly initialAllocators?: AllocatorState;
  readonly initialQueue?: readonly ScheduledEvent[];
  readonly initialCommittedTrace?: readonly CanonicalValue[];
  readonly initialOutputs?: readonly CanonicalValue[];
  readonly invariants?: readonly ((state: State) => void)[];
}

export interface FailureDiagnostic {
  readonly code: SchedulerFailureCode;
  readonly attemptedInstant?: SimInstant;
  readonly currentEventId?: bigint;
  readonly causalChain: readonly bigint[];
  readonly preInstantStateBytes: Uint8Array;
  readonly candidateTransitionData?: CanonicalValue;
  readonly message: string;
}

export type SchedulerFailureCode =
  | 'RUN_NOT_ACTIVE'
  | 'INVALID_CONFIGURATION'
  | 'INVALID_EVENT'
  | 'CAUSAL_ORDER_VIOLATION'
  | 'CASCADE_LIMIT_EXCEEDED'
  | 'UNKNOWN_EVENT_TYPE'
  | 'TRANSITION_FAILURE'
  | 'STATE_VALIDATION_FAILURE'
  | 'EVENT_VALIDATION_FAILURE'
  | 'TRACE_VALIDATION_FAILURE'
  | 'INVARIANT_FAILURE'
  | 'CONFORMANCE_INJECTION';

export class SchedulerContractError extends Error {
  constructor(
    readonly code: SchedulerFailureCode,
    message: string,
    readonly candidateTransitionData?: CanonicalValue,
  ) {
    super(message);
    this.name = 'SchedulerContractError';
  }
}

export interface SettlementResult<State> {
  readonly dueAt: SimInstant;
  readonly state: State;
  readonly executedEvents: readonly ScheduledEvent[];
  readonly traceContributions: readonly CanonicalValue[];
  readonly outputs: readonly CanonicalValue[];
}

export interface ConformanceInstrumentation {
  /** Test-only hook. Authoritative callers must omit instrumentation. */
  readonly onBoundary?: (boundary: TransactionBoundary, event?: ScheduledEvent) => void;
}

interface WorkingTransaction<State> {
  state: State;
  queue: ScheduledEvent[];
  allocators: MutableAllocatorState;
  trace: CanonicalValue[];
  outputs: CanonicalValue[];
  executed: ScheduledEvent[];
}

interface MutableAllocatorState {
  nextRuntimeId: bigint;
  nextEventId: bigint;
  nextEventSequence: bigint;
}

const DEFAULT_ALLOCATORS: AllocatorState = { nextRuntimeId: 0n, nextEventId: 0n, nextEventSequence: 0n };

export class DeterministicScheduler<State> {
  #state: State;
  #clock: SimInstant;
  #allocators: MutableAllocatorState;
  #queue: ScheduledEvent[];
  #committedTrace: CanonicalValue[];
  #outputs: CanonicalValue[];
  #status: RunStatus = 'Active';
  #diagnostic?: FailureDiagnostic;
  #isSettling = false;
  readonly #adapter: StateAdapter<State>;
  readonly #handlers: ReadonlyMap<string, EventHandler<State>>;
  readonly #maxWork: bigint;
  readonly #invariants: readonly ((state: State) => void)[];

  constructor(configuration: SchedulerConfiguration<State>) {
    if (typeof configuration.maxSettlementWorkPerSimulationInstant !== 'bigint'
      || configuration.maxSettlementWorkPerSimulationInstant < 1n) {
      fail('INVALID_CONFIGURATION', 'MaxSettlementWorkPerSimulationInstant must be positive');
    }
    this.#adapter = configuration.stateAdapter;
    this.#handlers = new Map(configuration.handlers);
    this.#maxWork = configuration.maxSettlementWorkPerSimulationInstant;
    this.#invariants = configuration.invariants ?? [];
    this.#adapter.validate(configuration.initialState);
    this.#state = this.#adapter.clone(configuration.initialState);
    this.#clock = configuration.initialClock ?? simInstant(0n);
    this.#allocators = mutableAllocators(configuration.initialAllocators ?? DEFAULT_ALLOCATORS);
    this.#queue = [...(configuration.initialQueue ?? [])];
    validateAllocatorState(this.#allocators);
    for (const event of this.#queue) validateRestoredEvent(event, this.#clock);
    validateUniqueQueue(this.#queue);
    this.#queue.sort(compareEvents);
    this.#validateAllocatorContinuation();
    this.#committedTrace = (configuration.initialCommittedTrace ?? []).map(cloneCanonicalValue);
    this.#outputs = (configuration.initialOutputs ?? []).map(cloneCanonicalValue);
  }

  get status(): RunStatus { return this.#status; }
  get isSettling(): boolean { return this.#isSettling; }
  get failureDiagnostic(): FailureDiagnostic | undefined { return this.#diagnostic ? cloneDiagnostic(this.#diagnostic) : undefined; }

  getState(): State {
    this.#requireQuiescentRead();
    return this.#adapter.clone(this.#state);
  }

  getClock(): SimInstant {
    this.#requireQuiescentRead();
    return this.#clock;
  }

  getAllocatorState(): AllocatorState {
    this.#requireQuiescentRead();
    return { ...this.#allocators };
  }

  getPendingQueue(): readonly ScheduledEvent[] {
    this.#requireQuiescentRead();
    return this.#queue.map(cloneEvent);
  }

  getCommittedTrace(): readonly CanonicalValue[] {
    this.#requireQuiescentRead();
    return this.#committedTrace.map(cloneCanonicalValue);
  }

  getOutputs(): readonly CanonicalValue[] {
    this.#requireQuiescentRead();
    return this.#outputs.map(cloneCanonicalValue);
  }

  allocateRuntimeId(): bigint {
    this.#requireActiveQuiescentMutation();
    const allocated = this.#allocators.nextRuntimeId;
    this.#allocators.nextRuntimeId += 1n;
    return allocated;
  }

  schedule(event: EventEmission): ScheduledEvent {
    this.#requireActiveQuiescentMutation();
    validateEmission(event, this.#clock);
    const scheduled = allocateEvent(event, [], this.#allocators);
    this.#queue.push(scheduled);
    this.#queue.sort(compareEvents);
    return cloneEvent(scheduled);
  }

  async settleNextInstant(): Promise<SettlementResult<State> | undefined> {
    return this.#settleNextInstant({});
  }

  /** Test-only failure injection. This method is not an authoritative run input. */
  async settleNextInstantForConformance(instrumentation: ConformanceInstrumentation): Promise<SettlementResult<State> | undefined> {
    return this.#settleNextInstant(instrumentation);
  }

  async #settleNextInstant(instrumentation: ConformanceInstrumentation): Promise<SettlementResult<State> | undefined> {
    if (this.#status !== 'Active') fail('RUN_NOT_ACTIVE', 'failed runs cannot continue or retry');
    if (this.#isSettling) fail('RUN_NOT_ACTIVE', 'scheduler is already settling an instant');
    if (this.#queue.length === 0) return undefined;

    const dueAt = this.#queue[0].dueAt;
    const preStateBytes = canonicalEncode(this.#adapter.canonicalValue(this.#state));
    const working: WorkingTransaction<State> = {
      state: this.#adapter.clone(this.#state),
      queue: this.#queue.map(cloneEvent),
      allocators: { ...this.#allocators },
      trace: [],
      outputs: [],
      executed: [],
    };
    let currentEvent: ScheduledEvent | undefined;
    let candidateTransitionData: CanonicalValue | undefined;
    this.#isSettling = true;
    try {
      let work = 0n;
      while (working.queue.length > 0 && working.queue[0].dueAt === dueAt) {
        if (work >= this.#maxWork) {
          currentEvent = working.queue[0];
          fail('CASCADE_LIMIT_EXCEEDED', 'same-instant settlement exceeded its configured work ceiling');
        }
        currentEvent = working.queue.shift()!;
        candidateTransitionData = undefined;
        work += 1n;
        const handler = this.#handlers.get(canonicalIdKey(currentEvent.eventTypeId));
        if (!handler) fail('UNKNOWN_EVENT_TYPE', 'scheduled event type has no registered handler');

        let result: TransitionResult<State>;
        try {
          result = await handler({
            state: this.#adapter.clone(working.state),
            event: cloneEvent(currentEvent),
            instant: dueAt,
            allocateRuntimeId: () => {
              const allocated = working.allocators.nextRuntimeId;
              working.allocators.nextRuntimeId += 1n;
              return allocated;
            },
          });
        } catch (error) {
          if (error instanceof SchedulerContractError) {
            candidateTransitionData = error.candidateTransitionData === undefined
              ? undefined
              : cloneCanonicalValue(error.candidateTransitionData);
            throw error;
          }
          fail('TRANSITION_FAILURE', errorMessage(error));
        }
        candidateTransitionData = result.failureContext === undefined
          ? undefined
          : cloneCanonicalValue(result.failureContext);

        boundary(instrumentation, 'before-state-validation', currentEvent);
        try { this.#adapter.validate(result.nextState); } catch (error) { fail('STATE_VALIDATION_FAILURE', errorMessage(error)); }
        boundary(instrumentation, 'after-state-validation', currentEvent);

        boundary(instrumentation, 'before-event-validation', currentEvent);
        for (const emission of result.emittedEvents) validateEmissionFromEvent(emission, currentEvent, working.allocators.nextEventId);
        boundary(instrumentation, 'after-event-validation', currentEvent);

        const allocatedEmittedEvents = result.emittedEvents.map((emission) => {
          const parents = uniqueSortedBigInts([currentEvent!.eventId, ...(emission.additionalCausalParentEventIds ?? [])]);
          return allocateEvent(emission, parents, working.allocators);
        });
        let traceContributions: readonly CanonicalValue[];

        boundary(instrumentation, 'before-trace-validation', currentEvent);
        try {
          traceContributions = result.traceFactory
            ? result.traceFactory(allocatedEmittedEvents.map(cloneEvent))
            : result.traceContributions;
          for (const contribution of traceContributions) canonicalEncode(contribution);
          for (const output of result.outputs) canonicalEncode(output);
        } catch (error) {
          fail('TRACE_VALIDATION_FAILURE', errorMessage(error));
        }
        boundary(instrumentation, 'after-trace-validation', currentEvent);

        working.state = this.#adapter.clone(result.nextState);
        working.queue.push(...allocatedEmittedEvents);
        working.queue.sort(compareEvents);
        working.trace.push(...traceContributions.map(cloneCanonicalValue));
        working.outputs.push(...result.outputs.map(cloneCanonicalValue));
        working.executed.push(currentEvent);
      }

      boundary(instrumentation, 'before-invariant-validation');
      try { for (const invariant of this.#invariants) invariant(working.state); } catch (error) { fail('INVARIANT_FAILURE', errorMessage(error)); }
      boundary(instrumentation, 'after-invariant-validation');
      boundary(instrumentation, 'before-commit');

      this.#state = this.#adapter.clone(working.state);
      this.#queue = working.queue.map(cloneEvent);
      this.#allocators = { ...working.allocators };
      this.#clock = dueAt;
      this.#committedTrace.push(...working.trace);
      this.#outputs.push(...working.outputs);
      return {
        dueAt,
        state: this.#adapter.clone(this.#state),
        executedEvents: working.executed.map(cloneEvent),
        traceContributions: working.trace.map(cloneCanonicalValue),
        outputs: working.outputs.map(cloneCanonicalValue),
      };
    } catch (error) {
      const contractError = error instanceof SchedulerContractError
        ? error
        : new SchedulerContractError('TRANSITION_FAILURE', errorMessage(error));
      this.#status = 'Failed';
      this.#diagnostic = {
        code: contractError.code,
        attemptedInstant: dueAt,
        currentEventId: currentEvent?.eventId,
        causalChain: currentEvent
          ? causalChainFor(currentEvent, [...this.#queue, ...working.executed, ...working.queue, currentEvent])
          : [],
        preInstantStateBytes: preStateBytes,
        candidateTransitionData: candidateTransitionData && cloneCanonicalValue(candidateTransitionData),
        message: contractError.message,
      };
      throw contractError;
    } finally {
      this.#isSettling = false;
    }
  }

  exportQuiescentSnapshot(): SchedulerSnapshot<State> {
    this.#requireQuiescentRead();
    return {
      state: this.#adapter.clone(this.#state),
      clock: this.#clock,
      allocators: { ...this.#allocators },
      queue: this.#queue.map(cloneEvent),
      committedTrace: this.#committedTrace.map(cloneCanonicalValue),
      outputs: this.#outputs.map(cloneCanonicalValue),
      status: this.#status,
    };
  }

  #validateAllocatorContinuation(): void {
    for (const event of this.#queue) {
      if (event.eventId >= this.#allocators.nextEventId) fail('INVALID_CONFIGURATION', 'event allocator would mint an existing or earlier event ID');
      if (event.eventSequence >= this.#allocators.nextEventSequence) fail('INVALID_CONFIGURATION', 'sequence allocator would mint an existing or earlier sequence');
    }
  }

  #requireQuiescentRead(): void {
    if (this.#isSettling) fail('RUN_NOT_ACTIVE', 'external read or save is forbidden before quiescence');
  }

  #requireActiveQuiescentMutation(): void {
    if (this.#status !== 'Active') fail('RUN_NOT_ACTIVE', 'failed runs cannot continue');
    this.#requireQuiescentRead();
  }
}

export interface SchedulerSnapshot<State> {
  readonly state: State;
  readonly clock: SimInstant;
  readonly allocators: AllocatorState;
  readonly queue: readonly ScheduledEvent[];
  readonly committedTrace: readonly CanonicalValue[];
  readonly outputs: readonly CanonicalValue[];
  readonly status: RunStatus;
}

export function compareEvents(left: ScheduledEvent, right: ScheduledEvent): number {
  if (left.dueAt !== right.dueAt) return left.dueAt < right.dueAt ? -1 : 1;
  if (left.phase !== right.phase) return left.phase < right.phase ? -1 : 1;
  if (left.eventSequence !== right.eventSequence) return left.eventSequence < right.eventSequence ? -1 : 1;
  return 0;
}

export function orderingParametersValue(maxSettlementWorkPerSimulationInstant: bigint): CanonicalValue {
  if (typeof maxSettlementWorkPerSimulationInstant !== 'bigint' || maxSettlementWorkPerSimulationInstant < 1n) {
    fail('INVALID_CONFIGURATION', 'MaxSettlementWorkPerSimulationInstant must be a positive exact integer');
  }
  return requiredRecord(schedulerSchemas.orderingParameters, [unsigned(maxSettlementWorkPerSimulationInstant)]);
}

export function orderingPhaseRegistryValue(): CanonicalValue {
  return requiredRecord(schedulerSchemas.phaseRegistry, [
    text(ORDERING_PHASE_REGISTRY_VERSION),
    list(ORDERING_PHASES.map(unsigned)),
  ]);
}

function validateEmissionFromEvent(emission: EventEmission, cause: ScheduledEvent, nextEventId: bigint): void {
  validateEmission(emission, cause.dueAt);
  if (emission.dueAt === cause.dueAt && emission.phase < cause.phase) {
    fail('CAUSAL_ORDER_VIOLATION', 'same-instant work cannot emit into an earlier phase');
  }
  for (const parentId of emission.additionalCausalParentEventIds ?? []) {
    if (parentId < 0n || parentId >= nextEventId) fail('EVENT_VALIDATION_FAILURE', 'additional causal parent must identify an already allocated event');
  }
}

function validateEmission(emission: EventEmission, earliest: SimInstant): void {
  simInstant(emission.dueAt);
  if (emission.dueAt < earliest) fail('CAUSAL_ORDER_VIOLATION', 'event cannot be scheduled before the current authoritative instant');
  if (typeof emission.phase !== 'bigint' || !ORDERING_PHASES.includes(emission.phase as typeof ORDERING_PHASES[number])) fail('INVALID_EVENT', 'event phase is not registered');
  canonicalEncode(emission.eventTypeId);
  canonicalEncode(emission.payload);
  canonicalEncode(emission.dependencies);
}

function validateRestoredEvent(event: ScheduledEvent, clock: SimInstant): void {
  if (typeof event.eventId !== 'bigint' || typeof event.eventSequence !== 'bigint'
    || event.eventId < 0n || event.eventSequence < 0n) {
    fail('INVALID_EVENT', 'event IDs and sequences must be nonnegative exact integers');
  }
  validateEmission(event, clock);
  let previous = -1n;
  for (const parent of event.causalParentEventIds) {
    if (parent < 0n || parent >= event.eventId || parent <= previous) fail('INVALID_EVENT', 'causal parent IDs must be earlier, unique, and canonically ordered');
    previous = parent;
  }
}

function allocateEvent(emission: EventEmission, parents: readonly bigint[], allocators: MutableAllocatorState): ScheduledEvent {
  const event: ScheduledEvent = {
    eventId: allocators.nextEventId,
    dueAt: emission.dueAt,
    phase: emission.phase,
    eventSequence: allocators.nextEventSequence,
    eventTypeId: cloneCanonicalValue(emission.eventTypeId) as TypedIdentifierValue,
    payload: cloneCanonicalValue(emission.payload),
    dependencies: cloneCanonicalValue(emission.dependencies),
    causalParentEventIds: parents,
  };
  allocators.nextEventId += 1n;
  allocators.nextEventSequence += 1n;
  return event;
}

function validateAllocatorState(allocators: AllocatorState): void {
  if (typeof allocators.nextRuntimeId !== 'bigint' || typeof allocators.nextEventId !== 'bigint'
    || typeof allocators.nextEventSequence !== 'bigint'
    || allocators.nextRuntimeId < 0n || allocators.nextEventId < 0n || allocators.nextEventSequence < 0n) {
    fail('INVALID_CONFIGURATION', 'allocator states must be nonnegative');
  }
}

function validateUniqueQueue(queue: readonly ScheduledEvent[]): void {
  const eventIds = new Set<bigint>();
  const sequences = new Set<bigint>();
  for (const event of queue) {
    if (eventIds.has(event.eventId)) fail('INVALID_CONFIGURATION', 'pending event IDs must be unique');
    if (sequences.has(event.eventSequence)) fail('INVALID_CONFIGURATION', 'pending event sequences must be unique');
    eventIds.add(event.eventId);
    sequences.add(event.eventSequence);
  }
}

function mutableAllocators(state: AllocatorState): MutableAllocatorState {
  return { ...state };
}

function canonicalIdKey(id: TypedIdentifierValue): string {
  return bytesToHex(canonicalEncode(id));
}

function cloneEvent(event: ScheduledEvent): ScheduledEvent {
  return {
    ...event,
    eventTypeId: cloneCanonicalValue(event.eventTypeId) as TypedIdentifierValue,
    payload: cloneCanonicalValue(event.payload),
    dependencies: cloneCanonicalValue(event.dependencies),
    causalParentEventIds: [...event.causalParentEventIds],
  };
}

function cloneDiagnostic(diagnostic: FailureDiagnostic): FailureDiagnostic {
  return {
    ...diagnostic,
    causalChain: [...diagnostic.causalChain],
    preInstantStateBytes: diagnostic.preInstantStateBytes.slice(),
    candidateTransitionData: diagnostic.candidateTransitionData && cloneCanonicalValue(diagnostic.candidateTransitionData),
  };
}

function causalChainFor(event: ScheduledEvent, committedQueue: readonly ScheduledEvent[]): bigint[] {
  const byId = new Map(committedQueue.map((queued) => [queued.eventId, queued]));
  const result: bigint[] = [];
  const visit = (eventId: bigint): void => {
    const parent = byId.get(eventId);
    if (parent) for (const parentId of parent.causalParentEventIds) visit(parentId);
    if (!result.includes(eventId)) result.push(eventId);
  };
  for (const parentId of event.causalParentEventIds) visit(parentId);
  visit(event.eventId);
  return result;
}

function uniqueSortedBigInts(values: readonly bigint[]): bigint[] {
  return [...new Set(values)].sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
}

function boundary(instrumentation: ConformanceInstrumentation, name: TransactionBoundary, event?: ScheduledEvent): void {
  try { instrumentation.onBoundary?.(name, event); } catch (error) {
    fail('CONFORMANCE_INJECTION', `injected failure at ${name}: ${errorMessage(error)}`);
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function fail(code: SchedulerFailureCode, message: string): never {
  throw new SchedulerContractError(code, message);
}

function requiredRecord(target: RecordSchema, values: readonly CanonicalValue[]): CanonicalValue {
  return record(target, new Map(target.fields.map((field, index) => [field.id, values[index]])));
}

function schema(typeId: bigint, name: string, fieldNames: readonly string[]): RecordSchema {
  return {
    typeId,
    schemaVersion: 1n,
    name,
    fields: fieldNames.map((fieldName, index) => ({ id: BigInt(index + 1), name: fieldName, required: true })),
  };
}

// Retain an explicit check that SimInstant's upper bound matches this scheduler's assumptions.
if (simInstant(INT64_MAX) !== INT64_MAX) throw new Error('SimInstant contract mismatch');
