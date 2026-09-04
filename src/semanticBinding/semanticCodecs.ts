import {
  canonicalDecode, canonicalEncode, list, map, record, set, text, typedIdentifier, unsigned,
  CanonicalEncodingError, RecordSchemaRegistry,
  type CanonicalValue, type RecordSchema, type TypedIdentifierValue,
} from '../substrate/canonicalEncoding';
import {
  SEMANTIC_OCCURRENCE_NAMESPACES, SEMANTIC_RECORD_SCHEMAS, SEMANTIC_TYPED_ID_NAMESPACES,
  validateSemanticUnionVariant,
} from './semanticSchemaRegistry';
import type {
  PerceptualContinuantFileState, PerceptualReferentId,
} from './perceptualContinuantFiles';
import type {
  PerceptualEventFileState, PerceptualEventReferentId,
} from './perceptualEventFiles';

export const SEMANTIC_CODEC_VERSION = 'semantic-codecs/0.1-candidate#SEM-001I.3' as const;

/**
 * Seam-contract versions this codec admits in a `TransformationVersion` or `RecognitionVersion`
 * field. An unadmitted version fails before allocation or emission rather than encoding a record
 * no accepted contract governs.
 */
export const SEMANTIC_ADMITTED_TRANSFORMATION_VERSIONS: ReadonlySet<string> = Object.freeze(new Set([
  'semantic-binding/0.1-candidate#SEM-001A',
  'semantic-binding/0.1-candidate#SEM-001B',
  'semantic-binding/0.1-candidate#SEM-001C',
  'semantic-binding/0.1-candidate#SEM-001D',
  'semantic-binding/0.1-candidate#SEM-001E',
  'semantic-binding/0.1-candidate#SEM-001F',
  'semantic-binding/0.1-candidate#SEM-001G',
  'semantic-binding/0.1-candidate#SEM-001H',
]));

export type SemanticCodecFailureCode =
  | 'UNKNOWN_SEMANTIC_SCHEMA'
  | 'UNKNOWN_SEMANTIC_FIELD'
  | 'MISSING_REQUIRED_FIELD'
  | 'UNKNOWN_SEMANTIC_NAMESPACE'
  | 'UNADMITTED_CONTRACT_VERSION'
  | 'ILLEGAL_UNION_LAYOUT'
  | 'NONCANONICAL_ROUND_TRIP'
  | 'INVALID_OCCURRENCE_ORDINAL';

export class SemanticCodecError extends Error {
  constructor(readonly code: SemanticCodecFailureCode, message: string) {
    super(message);
    this.name = 'SemanticCodecError';
  }
}

type SchemaName = string;

const SCHEMAS_BY_NAME: ReadonlyMap<SchemaName, RecordSchema> = new Map(
  SEMANTIC_RECORD_SCHEMAS.map((schema) => [schema.name, schema]),
);

/**
 * Decode-side registry. A record whose type or schema version is absent here cannot be decoded,
 * so an unknown-version payload fails closed instead of being partially interpreted.
 */
export const SEMANTIC_DECODE_REGISTRY = new RecordSchemaRegistry(SEMANTIC_RECORD_SCHEMAS);

export function semanticSchema(name: SchemaName): RecordSchema {
  const schema = SCHEMAS_BY_NAME.get(name);
  if (!schema) fail('UNKNOWN_SEMANTIC_SCHEMA', `no accepted semantic schema named ${name}`);
  return schema;
}

function fieldId(schema: RecordSchema, fieldName: string): bigint {
  const field = schema.fields.find((candidate) => candidate.name === fieldName);
  if (!field) {
    fail('UNKNOWN_SEMANTIC_FIELD', `${schema.name} has no accepted field named ${fieldName}`);
  }
  return field.id;
}

/**
 * Builds one canonical record from the frozen `SEM-001I.2` allocation. Fields are named rather
 * than numbered at the call site, so an unallocated field cannot reach the encoder, and the
 * required/optional flags of the accepted table decide presence.
 */
export function semanticRecordValue(
  name: SchemaName,
  fields: Readonly<Record<string, CanonicalValue | undefined>>,
): CanonicalValue {
  const schema = semanticSchema(name);
  const values = new Map<bigint, CanonicalValue>();
  for (const [fieldName, value] of Object.entries(fields)) {
    const id = fieldId(schema, fieldName);
    if (value !== undefined) values.set(id, value);
  }
  for (const field of schema.fields) {
    if (field.required && !values.has(field.id)) {
      fail('MISSING_REQUIRED_FIELD', `${schema.name} requires field ${field.name}`);
    }
  }
  return record(schema, values);
}

/**
 * Builds one canonical union record. The accepted tag/payload matrix is validated *before* the
 * record is constructed, so an illegal layout can never be allocated an occurrence or emitted.
 */
export function semanticUnionValue(
  name: SchemaName,
  variantTag: bigint | number,
  payload: Readonly<Record<string, CanonicalValue | undefined>> = {},
): CanonicalValue {
  const schema = semanticSchema(name);
  const tag = BigInt(variantTag);
  const presentFieldIds: bigint[] = [];
  for (const [fieldName, value] of Object.entries(payload)) {
    const id = fieldId(schema, fieldName);
    if (value !== undefined) presentFieldIds.push(id);
  }
  try {
    validateSemanticUnionVariant(schema.typeId, tag, presentFieldIds);
  } catch (error) {
    fail('ILLEGAL_UNION_LAYOUT', error instanceof Error ? error.message : String(error));
  }
  return semanticRecordValue(name, { VariantTag: unsigned(tag), ...payload });
}

export function semanticTypedId(
  namespace: keyof typeof SEMANTIC_TYPED_ID_NAMESPACES,
  payload: CanonicalValue,
): TypedIdentifierValue {
  const namespaceId = SEMANTIC_TYPED_ID_NAMESPACES[namespace];
  if (namespaceId === undefined) {
    fail('UNKNOWN_SEMANTIC_NAMESPACE', `no accepted typed-ID namespace named ${String(namespace)}`);
  }
  return typedIdentifier(namespaceId, payload);
}

/**
 * Allocated occurrence identity. The ordinal is opaque: it carries no magnitude, distance, or
 * psychological content, and equal ordinals in different namespaces encode differently.
 */
export function semanticOccurrenceId(
  namespace: keyof typeof SEMANTIC_OCCURRENCE_NAMESPACES & string,
  ordinal: bigint,
): TypedIdentifierValue {
  const namespaceId = SEMANTIC_OCCURRENCE_NAMESPACES[namespace];
  if (namespaceId === undefined) {
    fail('UNKNOWN_SEMANTIC_NAMESPACE', `no accepted occurrence namespace named ${namespace}`);
  }
  if (ordinal < 0n) fail('INVALID_OCCURRENCE_ORDINAL', 'occurrence ordinals must be nonnegative');
  return typedIdentifier(namespaceId, unsigned(ordinal));
}

export function observerIdValue(observerId: string): TypedIdentifierValue {
  return semanticTypedId('ObserverId', text(observerId));
}

export function assertAdmittedTransformationVersion(version: string): void {
  if (!SEMANTIC_ADMITTED_TRANSFORMATION_VERSIONS.has(version)) {
    fail('UNADMITTED_CONTRACT_VERSION', `contract version ${version} is not an admitted seam contract`);
  }
}

// ---------------------------------------------------------------------------
// Identity records
// ---------------------------------------------------------------------------

/** Type 212. Observer ownership is part of the canonical value. */
export function perceptualReferentIdValue(referentId: PerceptualReferentId): CanonicalValue {
  return semanticRecordValue('PerceptualReferentId', {
    ObserverId: observerIdValue(referentId.observerId),
    ObserverTrackSequence: unsigned(referentId.observerTrackSequence),
  });
}

/** Type 213. */
export function perceptualEventReferentIdValue(referentId: PerceptualEventReferentId): CanonicalValue {
  return semanticRecordValue('PerceptualEventReferentId', {
    ObserverId: observerIdValue(referentId.observerId),
    ObserverEventSequence: unsigned(referentId.observerEventSequence),
  });
}

/** Type 214. `DetectionOccurrenceId` is an allocated ordinal, never a symbolic string. */
export function currentDetectionIdValue(observerId: string, detectionOrdinal: bigint): CanonicalValue {
  return semanticRecordValue('CurrentDetectionId', {
    ObserverId: observerIdValue(observerId),
    DetectionOccurrenceId: semanticOccurrenceId('DetectionOccurrenceId', detectionOrdinal),
  });
}

/** Type 215. */
export function currentEventDetectionIdValue(observerId: string, detectionOrdinal: bigint): CanonicalValue {
  return semanticRecordValue('CurrentEventDetectionId', {
    ObserverId: observerIdValue(observerId),
    EventDetectionOccurrenceId: semanticOccurrenceId('EventDetectionOccurrenceId', detectionOrdinal),
  });
}

/** Type 216. */
export function supportingObservationIdValue(observerId: string, observationOrdinal: bigint): CanonicalValue {
  return semanticRecordValue('SupportingObservationId', {
    ObserverId: observerIdValue(observerId),
    ObservationId: semanticOccurrenceId('ObservationId', observationOrdinal),
  });
}

// ---------------------------------------------------------------------------
// Continuant and event file lifecycle
// ---------------------------------------------------------------------------

export const ContinuityKindValue = Object.freeze({ NewTrack: 1n, ContinuesPriorTrack: 2n });
export const EventContinuityKindValue = Object.freeze({ NewEventFile: 1n, ContinuesPriorEventFile: 2n });

export interface CanonicalTrackTransition {
  readonly observerId: string;
  readonly priorPerceptualReferentId?: PerceptualReferentId;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly detectionOrdinal: bigint;
  readonly continuityKind: keyof typeof ContinuityKindValue;
  readonly supportingObservationOrdinals: readonly bigint[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

/** Type 217. Occurrence identity is `CurrentDetectionId`; the resulting file ID is explicit. */
export function perceptualTrackTransitionValue(transition: CanonicalTrackTransition): CanonicalValue {
  assertAdmittedTransformationVersion(transition.transformationVersion);
  return semanticRecordValue('PerceptualTrackTransition', {
    ObserverId: observerIdValue(transition.observerId),
    PriorPerceptualReferentId: transition.priorPerceptualReferentId
      ? perceptualReferentIdValue(transition.priorPerceptualReferentId) : undefined,
    PerceptualReferentId: perceptualReferentIdValue(transition.perceptualReferentId),
    CurrentDetectionId: currentDetectionIdValue(transition.observerId, transition.detectionOrdinal),
    ContinuityKind: unsigned(ContinuityKindValue[transition.continuityKind]),
    SupportingObservationIds: set(transition.supportingObservationOrdinals
      .map((ordinal) => supportingObservationIdValue(transition.observerId, ordinal))),
    OccurredAt: unsigned(transition.occurredAt),
    TransformationVersion: text(transition.transformationVersion),
  });
}

export interface CanonicalTrackEnd {
  readonly observerId: string;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly supportingObservationOrdinals: readonly bigint[];
  readonly occurredAt: bigint;
  readonly transformationVersion: string;
}

/** Type 218. Occurrence identity is `PerceptualReferentId`; at most one retirement per file. */
export function perceptualTrackEndValue(trackEnd: CanonicalTrackEnd): CanonicalValue {
  assertAdmittedTransformationVersion(trackEnd.transformationVersion);
  return semanticRecordValue('PerceptualTrackEnd', {
    ObserverId: observerIdValue(trackEnd.observerId),
    PerceptualReferentId: perceptualReferentIdValue(trackEnd.perceptualReferentId),
    SupportingObservationIds: set(trackEnd.supportingObservationOrdinals
      .map((ordinal) => supportingObservationIdValue(trackEnd.observerId, ordinal))),
    OccurredAt: unsigned(trackEnd.occurredAt),
    TransformationVersion: text(trackEnd.transformationVersion),
  });
}

// ---------------------------------------------------------------------------
// State roots
// ---------------------------------------------------------------------------

/**
 * Type 241. `NextTrackSequenceByObserver` is a canonical map and `ActivePerceptualReferentIds` a
 * canonical set, so declaration, insertion, and allocation order cannot reach the bytes.
 */
export function perceptualContinuantFileStateValue(state: PerceptualContinuantFileState): CanonicalValue {
  return semanticRecordValue('PerceptualContinuantFileState', {
    NextTrackSequenceByObserver: map([...state.nextTrackSequenceByObserver.entries()]
      .map(([observerId, next]) => [observerIdValue(observerId), unsigned(next)] as const)),
    ActivePerceptualReferentIds: set(state.activePerceptualReferentIds.map(perceptualReferentIdValue)),
  });
}

/** Type 242. The `SEM-001C` module names this collection `activeEventFiles` in memory. */
export function perceptualEventFileStateValue(state: PerceptualEventFileState): CanonicalValue {
  return semanticRecordValue('PerceptualEventFileState', {
    NextEventSequenceByObserver: map([...state.nextEventSequenceByObserver.entries()]
      .map(([observerId, next]) => [observerIdValue(observerId), unsigned(next)] as const)),
    ActivePerceptualEventReferentIds: set(state.activeEventFiles.map(perceptualEventReferentIdValue)),
  });
}

// ---------------------------------------------------------------------------
// Restore (decode side)
// ---------------------------------------------------------------------------

type RecordValue = Extract<CanonicalValue, { readonly kind: 'record' }>;

/** Asserts a value is a canonical record of the named accepted schema. */
export function assertSemanticRecord(value: CanonicalValue, name: SchemaName): void {
  requireSemanticRecord(value, name);
}

function requireSemanticRecord(value: CanonicalValue, name: SchemaName): RecordValue {
  const schema = semanticSchema(name);
  if (typeof value === 'boolean' || value.kind !== 'record'
    || value.schema.typeId !== schema.typeId || value.schema.schemaVersion !== schema.schemaVersion) {
    fail('UNKNOWN_SEMANTIC_SCHEMA', `expected a canonical ${name} record`);
  }
  return value;
}

function requiredField(value: RecordValue, name: SchemaName, fieldName: string): CanonicalValue {
  const held = value.fields.get(fieldId(semanticSchema(name), fieldName));
  if (held === undefined) fail('MISSING_REQUIRED_FIELD', `${name} is missing field ${fieldName}`);
  return held;
}

function requireObserverId(value: CanonicalValue): string {
  if (typeof value === 'boolean' || value.kind !== 'typedIdentifier'
    || value.namespaceId !== SEMANTIC_TYPED_ID_NAMESPACES.ObserverId
    || typeof value.payload === 'boolean' || value.payload.kind !== 'text') {
    fail('UNKNOWN_SEMANTIC_NAMESPACE', 'expected a typed ObserverId');
  }
  return value.payload.value;
}

function requireUnsignedValue(value: CanonicalValue): bigint {
  if (typeof value === 'boolean' || value.kind !== 'unsigned') {
    fail('MISSING_REQUIRED_FIELD', 'expected an unsigned value');
  }
  return value.value;
}

export function restorePerceptualReferentId(value: CanonicalValue): PerceptualReferentId {
  const held = requireSemanticRecord(value, 'PerceptualReferentId');
  return Object.freeze({
    observerId: requireObserverId(requiredField(held, 'PerceptualReferentId', 'ObserverId')),
    observerTrackSequence: requireUnsignedValue(
      requiredField(held, 'PerceptualReferentId', 'ObserverTrackSequence'),
    ),
  });
}

export function restorePerceptualEventReferentId(value: CanonicalValue): PerceptualEventReferentId {
  const held = requireSemanticRecord(value, 'PerceptualEventReferentId');
  return Object.freeze({
    observerId: requireObserverId(requiredField(held, 'PerceptualEventReferentId', 'ObserverId')),
    observerEventSequence: requireUnsignedValue(
      requiredField(held, 'PerceptualEventReferentId', 'ObserverEventSequence'),
    ),
  });
}

function restoreObserverSequenceMap(value: CanonicalValue): Map<string, bigint> {
  if (typeof value === 'boolean' || value.kind !== 'map') {
    fail('MISSING_REQUIRED_FIELD', 'expected a canonical observer-sequence map');
  }
  return new Map(value.entries.map(([observer, next]) =>
    [requireObserverId(observer), requireUnsignedValue(next)] as const));
}

function restoreSetItems(value: CanonicalValue): readonly CanonicalValue[] {
  if (typeof value === 'boolean' || value.kind !== 'set') {
    fail('MISSING_REQUIRED_FIELD', 'expected a canonical set');
  }
  return value.items;
}

export function restorePerceptualContinuantFileState(value: CanonicalValue): PerceptualContinuantFileState {
  const held = requireSemanticRecord(value, 'PerceptualContinuantFileState');
  return Object.freeze({
    nextTrackSequenceByObserver: restoreObserverSequenceMap(
      requiredField(held, 'PerceptualContinuantFileState', 'NextTrackSequenceByObserver'),
    ),
    activePerceptualReferentIds: Object.freeze(
      restoreSetItems(requiredField(held, 'PerceptualContinuantFileState', 'ActivePerceptualReferentIds'))
        .map(restorePerceptualReferentId),
    ),
  });
}

export function restorePerceptualEventFileState(value: CanonicalValue): PerceptualEventFileState {
  const held = requireSemanticRecord(value, 'PerceptualEventFileState');
  return Object.freeze({
    nextEventSequenceByObserver: restoreObserverSequenceMap(
      requiredField(held, 'PerceptualEventFileState', 'NextEventSequenceByObserver'),
    ),
    activeEventFiles: Object.freeze(
      restoreSetItems(requiredField(held, 'PerceptualEventFileState', 'ActivePerceptualEventReferentIds'))
        .map(restorePerceptualEventReferentId),
    ),
  });
}

// ---------------------------------------------------------------------------
// Encode / decode / round-trip
// ---------------------------------------------------------------------------

export function encodeSemanticValue(value: CanonicalValue): Uint8Array {
  return canonicalEncode(value);
}

/** Decodes only through the accepted schema registry; an unknown type or version fails closed. */
export function decodeSemanticValue(input: Uint8Array): CanonicalValue {
  return canonicalDecode(input, SEMANTIC_DECODE_REGISTRY);
}

/**
 * Encodes, decodes through the accepted registry, and re-encodes, proving the value survives a
 * persistence boundary byte-identically. Returns the canonical bytes.
 */
export function assertCanonicalRoundTrip(value: CanonicalValue): Uint8Array {
  const encoded = encodeSemanticValue(value);
  let reencoded: Uint8Array;
  try {
    reencoded = encodeSemanticValue(decodeSemanticValue(encoded));
  } catch (error) {
    if (error instanceof CanonicalEncodingError) {
      fail('NONCANONICAL_ROUND_TRIP', `canonical round trip failed to decode: ${error.message}`);
    }
    throw error;
  }
  if (!equalBytes(encoded, reencoded)) {
    fail('NONCANONICAL_ROUND_TRIP', 'canonical round trip is not byte-identical');
  }
  return encoded;
}

function equalBytes(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

/** Convenience for identity-category proofs: two namespaces over one ordinal must differ. */
export function occurrenceBytes(
  namespace: keyof typeof SEMANTIC_OCCURRENCE_NAMESPACES & string,
  ordinal: bigint,
): Uint8Array {
  return encodeSemanticValue(semanticOccurrenceId(namespace, ordinal));
}

export function semanticListValue(items: readonly CanonicalValue[]): CanonicalValue {
  return list(items);
}

function fail(code: SemanticCodecFailureCode, message: string): never {
  throw new SemanticCodecError(code, message);
}
