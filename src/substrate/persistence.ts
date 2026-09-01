import {
  RecordSchemaRegistry,
  canonicalDecode,
  canonicalEncode,
  list,
  record,
  signed,
  text,
  unsigned,
  type CanonicalValue,
  type RecordSchema,
  type TypedIdentifierValue,
} from './canonicalEncoding';
import { identitySchemas, restoreModelIdentity, restoreRunIdentity, type StructuralIdentity } from './identity';
import {
  DeterministicScheduler,
  type AllocatorState,
  type EventHandler,
  type ScheduledEvent,
  type SchedulerConfiguration,
  type StateAdapter,
} from './scheduler';
import { simInstant } from './time';

export const SAVE_SCHEMA_VERSION = 'save/1-candidate' as const;

export const persistenceSchemas = {
  scheduledEvent: schema(130n, 'ScheduledEvent', [
    'EventId', 'DueAt', 'Phase', 'EventSequence', 'EventTypeId', 'Payload', 'Dependencies', 'CausalParentEventIds',
  ]),
  allocatorState: schema(131n, 'AllocatorState', ['NextRuntimeId', 'NextEventId', 'NextEventSequence']),
  schedulerSave: schema(132n, 'SchedulerSave', [
    'SaveSchemaVersion',
    'ModelIdentity',
    'RunIdentity',
    'Clock',
    'AuthoritativeState',
    'AllocatorState',
    'PendingQueue',
    'AnalyticalAnchors',
    'RandomRelevantAuthoritativeIds',
    'ContinuingRunInputs',
    'CommittedTrace',
    'Outputs',
  ]),
} as const;

export interface PersistentStateAdapter<State> extends StateAdapter<State> {
  restore(value: CanonicalValue): State;
  analyticalAnchors(state: State): CanonicalValue;
  randomRelevantAuthoritativeIds(state: State): CanonicalValue;
}

export interface SaveContext<State> {
  readonly scheduler: DeterministicScheduler<State>;
  readonly stateAdapter: PersistentStateAdapter<State>;
  readonly modelIdentity: StructuralIdentity<'ModelIdentity'>;
  readonly runIdentity: StructuralIdentity<'RunIdentity'>;
  readonly continuingRunInputs: CanonicalValue;
}

export interface LoadedSave<State> {
  readonly scheduler: DeterministicScheduler<State>;
  readonly modelIdentity: StructuralIdentity<'ModelIdentity'>;
  readonly runIdentity: StructuralIdentity<'RunIdentity'>;
  readonly analyticalAnchors: CanonicalValue;
  readonly randomRelevantAuthoritativeIds: CanonicalValue;
  readonly continuingRunInputs: CanonicalValue;
  readonly canonicalBytes: Uint8Array;
}

export interface LoadContext<State> {
  readonly stateAdapter: PersistentStateAdapter<State>;
  readonly handlers: ReadonlyMap<string, EventHandler<State>>;
  readonly maxSettlementWorkPerSimulationInstant: bigint;
  readonly expectedModelIdentity: StructuralIdentity<'ModelIdentity'>;
  readonly expectedRunIdentity: StructuralIdentity<'RunIdentity'>;
  readonly additionalSchemas?: readonly RecordSchema[];
  readonly invariants?: SchedulerConfiguration<State>['invariants'];
}

export class SaveContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SaveContractError';
  }
}

export function createCanonicalSave<State>(context: SaveContext<State>): Uint8Array {
  if (context.scheduler.isSettling) saveFail('mid-transition save is forbidden');
  if (context.scheduler.status !== 'Active') saveFail('only an active quiescent run can produce a continuation save');
  const snapshot = context.scheduler.exportQuiescentSnapshot();
  const value = requiredRecord(persistenceSchemas.schedulerSave, [
    text(SAVE_SCHEMA_VERSION),
    context.modelIdentity.value,
    context.runIdentity.value,
    signed(snapshot.clock),
    context.stateAdapter.canonicalValue(snapshot.state),
    allocatorValue(snapshot.allocators),
    list(snapshot.queue.map(scheduledEventValue)),
    context.stateAdapter.analyticalAnchors(snapshot.state),
    context.stateAdapter.randomRelevantAuthoritativeIds(snapshot.state),
    context.continuingRunInputs,
    list(snapshot.committedTrace),
    list(snapshot.outputs),
  ]);
  return canonicalEncode(value);
}

export async function loadCanonicalSave<State>(bytes: Uint8Array, context: LoadContext<State>): Promise<LoadedSave<State>> {
  const registry = new RecordSchemaRegistry([
    ...Object.values(identitySchemas),
    ...Object.values(persistenceSchemas),
    ...(context.additionalSchemas ?? []),
  ]);
  const decoded = canonicalDecode(bytes, registry);
  const save = requireRecord(decoded, persistenceSchemas.schedulerSave);
  const saveVersion = requireText(field(save, 1n));
  if (saveVersion !== SAVE_SCHEMA_VERSION) saveFail(`unsupported save schema ${saveVersion}`);
  const modelIdentity = await restoreModelIdentity(field(save, 2n));
  if (!equalBytes(modelIdentity.canonicalBytes, context.expectedModelIdentity.canonicalBytes)) saveFail('save ModelIdentity does not match the receiving model');
  const runIdentity = await restoreRunIdentity(field(save, 3n));
  if (!equalBytes(runIdentity.canonicalBytes, context.expectedRunIdentity.canonicalBytes)) saveFail('save RunIdentity does not match the receiving run');
  const runRecord = requireRecord(runIdentity.value, identitySchemas.run);
  if (!equalBytes(canonicalEncode(field(runRecord, 1n)), modelIdentity.canonicalBytes)) saveFail('save RunIdentity embeds a different ModelIdentity');
  const clock = simInstant(requireSigned(field(save, 4n)));
  const state = context.stateAdapter.restore(field(save, 5n));
  context.stateAdapter.validate(state);
  if (!equalBytes(canonicalEncode(context.stateAdapter.analyticalAnchors(state)), canonicalEncode(field(save, 8n)))) {
    saveFail('saved analytical-anchor projection does not match authoritative state');
  }
  if (!equalBytes(canonicalEncode(context.stateAdapter.randomRelevantAuthoritativeIds(state)), canonicalEncode(field(save, 9n)))) {
    saveFail('saved random-relevant-ID projection does not match authoritative state');
  }
  const allocators = parseAllocators(field(save, 6n));
  const queue = requireList(field(save, 7n)).map(parseScheduledEvent);
  for (const event of queue) {
    if (!context.handlers.has(canonicalKey(event.eventTypeId))) saveFail('pending event type does not resolve through the receiving handler registry');
  }
  const committedTrace = requireList(field(save, 11n));
  const outputs = requireList(field(save, 12n));
  const scheduler = new DeterministicScheduler({
    initialState: state,
    stateAdapter: context.stateAdapter,
    handlers: context.handlers,
    maxSettlementWorkPerSimulationInstant: context.maxSettlementWorkPerSimulationInstant,
    initialClock: clock,
    initialAllocators: allocators,
    initialQueue: queue,
    initialCommittedTrace: committedTrace,
    initialOutputs: outputs,
    invariants: context.invariants,
  });
  return {
    scheduler,
    modelIdentity,
    runIdentity,
    analyticalAnchors: field(save, 8n),
    randomRelevantAuthoritativeIds: field(save, 9n),
    continuingRunInputs: field(save, 10n),
    canonicalBytes: bytes.slice(),
  };
}

export function scheduledEventValue(event: ScheduledEvent): CanonicalValue {
  return requiredRecord(persistenceSchemas.scheduledEvent, [
    unsigned(event.eventId),
    signed(event.dueAt),
    unsigned(event.phase),
    unsigned(event.eventSequence),
    event.eventTypeId,
    event.payload,
    event.dependencies,
    list(event.causalParentEventIds.map(unsigned)),
  ]);
}

function allocatorValue(allocators: AllocatorState): CanonicalValue {
  return requiredRecord(persistenceSchemas.allocatorState, [
    unsigned(allocators.nextRuntimeId),
    unsigned(allocators.nextEventId),
    unsigned(allocators.nextEventSequence),
  ]);
}

function parseAllocators(value: CanonicalValue): AllocatorState {
  const recordValue = requireRecord(value, persistenceSchemas.allocatorState);
  return {
    nextRuntimeId: requireUnsigned(field(recordValue, 1n)),
    nextEventId: requireUnsigned(field(recordValue, 2n)),
    nextEventSequence: requireUnsigned(field(recordValue, 3n)),
  };
}

function parseScheduledEvent(value: CanonicalValue): ScheduledEvent {
  const event = requireRecord(value, persistenceSchemas.scheduledEvent);
  return {
    eventId: requireUnsigned(field(event, 1n)),
    dueAt: simInstant(requireSigned(field(event, 2n))),
    phase: requireUnsigned(field(event, 3n)),
    eventSequence: requireUnsigned(field(event, 4n)),
    eventTypeId: requireTypedIdentifier(field(event, 5n)),
    payload: field(event, 6n),
    dependencies: field(event, 7n),
    causalParentEventIds: requireList(field(event, 8n)).map(requireUnsigned),
  };
}

type RecordValue = Extract<CanonicalValue, { readonly kind: 'record' }>;

function requireRecord(value: CanonicalValue, expected: RecordSchema): RecordValue {
  if (typeof value === 'boolean' || value.kind !== 'record'
    || value.schema.typeId !== expected.typeId || value.schema.schemaVersion !== expected.schemaVersion) {
    return saveFail(`expected ${expected.name}`);
  }
  return value;
}

function field(value: RecordValue, id: bigint): CanonicalValue {
  const result = value.fields.get(id);
  return result === undefined ? saveFail(`required field ${id} is absent`) : result;
}

function requireUnsigned(value: CanonicalValue): bigint {
  if (typeof value === 'boolean' || value.kind !== 'unsigned') return saveFail('expected unsigned integer');
  return value.value;
}

function requireSigned(value: CanonicalValue): bigint {
  if (typeof value === 'boolean' || value.kind !== 'signed') return saveFail('expected signed integer');
  return value.value;
}

function requireText(value: CanonicalValue): string {
  if (typeof value === 'boolean' || value.kind !== 'text') return saveFail('expected text');
  return value.value;
}

function requireList(value: CanonicalValue): readonly CanonicalValue[] {
  if (typeof value === 'boolean' || value.kind !== 'list') return saveFail('expected list');
  return value.items;
}

function requireTypedIdentifier(value: CanonicalValue): TypedIdentifierValue {
  if (typeof value === 'boolean' || value.kind !== 'typedIdentifier') return saveFail('expected typed identifier');
  return value;
}

function requiredRecord(target: RecordSchema, values: readonly CanonicalValue[]): CanonicalValue {
  return record(target, new Map(target.fields.map((schemaField, index) => [schemaField.id, values[index]])));
}

function schema(typeId: bigint, name: string, fieldNames: readonly string[]): RecordSchema {
  return {
    typeId,
    schemaVersion: 1n,
    name,
    fields: fieldNames.map((fieldName, index) => ({ id: BigInt(index + 1), name: fieldName, required: true })),
  };
}

function canonicalKey(value: CanonicalValue): string {
  return [...canonicalEncode(value)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function equalBytes(left: Uint8Array, right: Uint8Array): boolean {
  return left.length === right.length && left.every((byte, index) => byte === right[index]);
}

function saveFail(message: string): never {
  throw new SaveContractError(message);
}
