import {
  bytes,
  canonicalEncode,
  cloneCanonicalValue,
  list,
  record,
  signed,
  text,
  unsigned,
  type CanonicalValue,
  type RecordSchema,
  type TypedIdentifierValue,
} from './canonicalEncoding';
import type { FailureDiagnostic, ScheduledEvent } from './scheduler';
import { scheduledEventValue } from './persistence';
import {
  actualReadRecordValue,
  mutationDiffValue,
  statePatchValue,
  statePathPatternValue,
  type ActualReadRecord,
  type StatePatch,
  type StatePathPattern,
  type StructuralMutationDiff,
} from './state';

export const TRACE_CONTRACT_VERSION = 'trace/0.2-candidate' as const;
export const FAILURE_DIAGNOSTIC_SCHEMA_VERSION = 'failure-diagnostic/0.1-candidate' as const;

export const traceSchemas = {
  traceRecord: schema(160n, 'TraceRecord', [
    'TraceSchemaVersion', 'ModelIdentity', 'RunIdentity', 'Event', 'SeamId', 'SeamVersion',
    'RecordKind', 'SubjectIds', 'SourceRecordIds', 'RegisteredReadDomain', 'ActualReadRecords',
    'InputProjection', 'OutputProjection', 'RandomDrawRecords', 'QuantizationOperations',
    'StatePatch', 'StructuralMutationDiffs', 'EmittedEvents', 'InvariantResults',
  ]),
  failureDiagnostic: schema(162n, 'FailureDiagnostic', [
    'FailureDiagnosticSchemaVersion', 'RunIdentity', 'FailureCode', 'AttemptedInstantPresence',
    'AttemptedInstant', 'CurrentEventIdPresence', 'CurrentEventId', 'CausalChain',
    'PreInstantStateBytes', 'CandidateTransitionDataPresence', 'CandidateTransitionData', 'Message',
  ]),
} as const;

export interface TraceRecord {
  readonly traceSchemaVersion: string;
  readonly modelIdentity: CanonicalValue;
  readonly runIdentity: CanonicalValue;
  readonly event: ScheduledEvent;
  readonly seamId: TypedIdentifierValue;
  readonly seamVersion: string;
  readonly recordKind: TypedIdentifierValue;
  readonly subjectIds: readonly TypedIdentifierValue[];
  readonly sourceRecordIds: readonly TypedIdentifierValue[];
  readonly registeredReadDomain: readonly StatePathPattern[];
  readonly actualReadRecords: readonly ActualReadRecord[];
  readonly inputProjection: CanonicalValue;
  readonly outputProjection: CanonicalValue;
  readonly randomDrawRecords: readonly CanonicalValue[];
  readonly quantizationOperations: readonly CanonicalValue[];
  readonly statePatch: StatePatch;
  readonly structuralMutationDiffs: readonly StructuralMutationDiff[];
  readonly emittedEvents: readonly ScheduledEvent[];
  readonly invariantResults: readonly CanonicalValue[];
}

export interface FirstDivergence {
  readonly recordIndex: number;
  readonly structuralField: string;
  readonly oldValue?: CanonicalValue;
  readonly newValue?: CanonicalValue;
  readonly oldCausalAncestry: readonly bigint[];
  readonly newCausalAncestry: readonly bigint[];
}

export interface CanonicalValueDivergence {
  readonly structuralField: string;
  readonly oldValue?: CanonicalValue;
  readonly newValue?: CanonicalValue;
}

export function findCanonicalValueDivergence(
  oldValue: CanonicalValue,
  newValue: CanonicalValue,
  rootName = 'Value',
): CanonicalValueDivergence | undefined {
  const difference = findCanonicalDifference(oldValue, newValue, rootName);
  return difference && {
    structuralField: difference.path,
    oldValue: difference.oldValue && cloneCanonicalValue(difference.oldValue),
    newValue: difference.newValue && cloneCanonicalValue(difference.newValue),
  };
}

export function traceRecordValue(value: TraceRecord): CanonicalValue {
  return requiredRecord(traceSchemas.traceRecord, [
    text(value.traceSchemaVersion),
    value.modelIdentity,
    value.runIdentity,
    scheduledEventValue(value.event),
    value.seamId,
    text(value.seamVersion),
    value.recordKind,
    list(canonicalUnique(value.subjectIds, 'SubjectIds')),
    list(canonicalUnique(value.sourceRecordIds, 'SourceRecordIds')),
    list(canonicalUnique(value.registeredReadDomain.map(statePathPatternValue), 'RegisteredReadDomain')),
    list(value.actualReadRecords.map(actualReadRecordValue)),
    value.inputProjection,
    value.outputProjection,
    list(value.randomDrawRecords),
    list(value.quantizationOperations),
    statePatchValue(value.statePatch),
    list(value.structuralMutationDiffs.map(mutationDiffValue)),
    list(value.emittedEvents.map(scheduledEventValue)),
    list(value.invariantResults),
  ]);
}

export function failureDiagnosticValue(runIdentity: CanonicalValue, diagnostic: FailureDiagnostic): CanonicalValue {
  return requiredRecord(traceSchemas.failureDiagnostic, [
    text(FAILURE_DIAGNOSTIC_SCHEMA_VERSION),
    runIdentity,
    text(diagnostic.code),
    diagnostic.attemptedInstant !== undefined,
    diagnostic.attemptedInstant === undefined ? false : signed(diagnostic.attemptedInstant),
    diagnostic.currentEventId !== undefined,
    diagnostic.currentEventId === undefined ? false : unsigned(diagnostic.currentEventId),
    list(diagnostic.causalChain.map(unsigned)),
    bytes(diagnostic.preInstantStateBytes),
    diagnostic.candidateTransitionData !== undefined,
    diagnostic.candidateTransitionData ?? false,
    text(diagnostic.message),
  ]);
}

export function findFirstTraceDivergence(
  oldTrace: readonly TraceRecord[],
  newTrace: readonly TraceRecord[],
): FirstDivergence | undefined {
  const count = Math.min(oldTrace.length, newTrace.length);
  for (let index = 0; index < count; index += 1) {
    const oldValue = traceRecordValue(oldTrace[index]);
    const newValue = traceRecordValue(newTrace[index]);
    const difference = findCanonicalDifference(oldValue, newValue, 'TraceRecord');
    if (difference) return {
      recordIndex: index,
      structuralField: difference.path,
      oldValue: difference.oldValue,
      newValue: difference.newValue,
      oldCausalAncestry: ancestry(oldTrace, index),
      newCausalAncestry: ancestry(newTrace, index),
    };
  }
  if (oldTrace.length !== newTrace.length) {
    const oldRecord = oldTrace[count];
    const newRecord = newTrace[count];
    return {
      recordIndex: count,
      structuralField: 'TraceRecord',
      oldValue: oldRecord && traceRecordValue(oldRecord),
      newValue: newRecord && traceRecordValue(newRecord),
      oldCausalAncestry: oldRecord ? ancestry(oldTrace, count) : [],
      newCausalAncestry: newRecord ? ancestry(newTrace, count) : [],
    };
  }
  return undefined;
}

interface CanonicalDifference {
  readonly path: string;
  readonly oldValue?: CanonicalValue;
  readonly newValue?: CanonicalValue;
}

function findCanonicalDifference(oldValue: CanonicalValue, newValue: CanonicalValue, path: string): CanonicalDifference | undefined {
  if (equalBytes(canonicalEncode(oldValue), canonicalEncode(newValue))) return undefined;
  if (typeof oldValue === 'boolean' || typeof newValue === 'boolean') return { path, oldValue, newValue };
  if (oldValue.kind !== newValue.kind) return { path, oldValue, newValue };
  switch (oldValue.kind) {
    case 'list': {
      const other = newValue as Extract<CanonicalValue, { kind: 'list' }>;
      return compareSequences(oldValue.items, other.items, path, findCanonicalDifference);
    }
    case 'set': {
      const other = newValue as Extract<CanonicalValue, { kind: 'set' }>;
      return compareSequences(canonicalSort(oldValue.items), canonicalSort(other.items), path, findCanonicalDifference);
    }
    case 'map': {
      const other = newValue as Extract<CanonicalValue, { kind: 'map' }>;
      const left = canonicalSort(oldValue.entries.map(([key, value]) => list([key, value])));
      const right = canonicalSort(other.entries.map(([key, value]) => list([key, value])));
      return compareSequences(left, right, path, findCanonicalDifference);
    }
    case 'record': {
      const other = newValue as Extract<CanonicalValue, { kind: 'record' }>;
      if (oldValue.schema.typeId !== other.schema.typeId || oldValue.schema.schemaVersion !== other.schema.schemaVersion) {
        return { path: `${path}.$schema`, oldValue, newValue };
      }
      const fieldIds = [...new Set([...oldValue.fields.keys(), ...other.fields.keys()])]
        .sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
      for (const fieldId of fieldIds) {
        const left = oldValue.fields.get(fieldId);
        const right = other.fields.get(fieldId);
        const name = oldValue.schema.fields.find((field) => field.id === fieldId)?.name ?? `field#${fieldId}`;
        if (left === undefined || right === undefined) return { path: `${path}.${name}`, oldValue: left, newValue: right };
        const nested = findCanonicalDifference(left, right, `${path}.${name}`);
        if (nested) return nested;
      }
      return { path, oldValue, newValue };
    }
    case 'typedIdentifier': {
      const other = newValue as Extract<CanonicalValue, { kind: 'typedIdentifier' }>;
      if (oldValue.namespaceId !== other.namespaceId) return { path: `${path}.namespaceId`, oldValue, newValue };
      return findCanonicalDifference(oldValue.payload, other.payload, `${path}.payload`) ?? { path, oldValue, newValue };
    }
    default:
      return { path, oldValue, newValue };
  }
}

function compareSequences(
  left: readonly CanonicalValue[],
  right: readonly CanonicalValue[],
  path: string,
  compare: (a: CanonicalValue, b: CanonicalValue, path: string) => CanonicalDifference | undefined,
): CanonicalDifference | undefined {
  const count = Math.min(left.length, right.length);
  for (let index = 0; index < count; index += 1) {
    const nested = compare(left[index], right[index], `${path}[${index}]`);
    if (nested) return nested;
  }
  if (left.length !== right.length) return { path: `${path}[${count}]`, oldValue: left[count], newValue: right[count] };
  return undefined;
}

function canonicalSort<T extends CanonicalValue>(values: readonly T[]): T[] {
  return [...values].sort((left, right) => compareBytes(canonicalEncode(left), canonicalEncode(right)));
}

function canonicalUnique<T extends CanonicalValue>(values: readonly T[], field: string): T[] {
  const sorted = canonicalSort(values);
  for (let index = 1; index < sorted.length; index += 1) {
    if (equalBytes(canonicalEncode(sorted[index - 1]), canonicalEncode(sorted[index]))) {
      throw new Error(`${field} must be duplicate-free`);
    }
  }
  return sorted;
}

function ancestry(trace: readonly TraceRecord[], recordIndex: number): bigint[] {
  const byEventId = new Map(trace.map((record) => [record.event.eventId, record.event]));
  const result = new Set<bigint>();
  const visit = (eventId: bigint): void => {
    if (result.has(eventId)) return;
    const event = byEventId.get(eventId);
    if (event) for (const parentId of event.causalParentEventIds) visit(parentId);
    result.add(eventId);
  };
  const event = trace[recordIndex].event;
  for (const parentId of event.causalParentEventIds) visit(parentId);
  visit(event.eventId);
  return [...result].sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
}

function equalBytes(left: Uint8Array, right: Uint8Array): boolean {
  return compareBytes(left, right) === 0;
}

function compareBytes(left: Uint8Array, right: Uint8Array): number {
  const count = Math.min(left.length, right.length);
  for (let index = 0; index < count; index += 1) {
    if (left[index] !== right[index]) return left[index] < right[index] ? -1 : 1;
  }
  return left.length === right.length ? 0 : left.length < right.length ? -1 : 1;
}

function requiredRecord(target: RecordSchema, values: readonly CanonicalValue[]): CanonicalValue {
  return record(target, new Map(target.fields.map((field, index) => [field.id, cloneCanonicalValue(values[index])])));
}

function schema(typeId: bigint, name: string, fieldNames: readonly string[]): RecordSchema {
  return {
    typeId,
    schemaVersion: 1n,
    name,
    fields: fieldNames.map((fieldName, index) => ({ id: BigInt(index + 1), name: fieldName, required: true })),
  };
}
