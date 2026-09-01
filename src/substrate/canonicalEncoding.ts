export const CANONICAL_ENCODING_VERSION = 'cenc/1' as const;

const enum Tag {
  False = 0x00,
  True = 0x01,
  Unsigned = 0x02,
  Signed = 0x03,
  Bytes = 0x04,
  Text = 0x05,
  Rational = 0x06,
  List = 0x07,
  Map = 0x08,
  Set = 0x09,
  Record = 0x0a,
  TypedIdentifier = 0x0b,
}

export interface RecordFieldSchema {
  readonly id: bigint;
  readonly name: string;
  readonly required: boolean;
}

export interface RecordSchema {
  readonly typeId: bigint;
  readonly schemaVersion: bigint;
  readonly name: string;
  readonly fields: readonly RecordFieldSchema[];
}

export type CanonicalValue =
  | boolean
  | { readonly kind: 'unsigned'; readonly value: bigint }
  | { readonly kind: 'signed'; readonly value: bigint }
  | { readonly kind: 'bytes'; readonly value: Uint8Array }
  | { readonly kind: 'text'; readonly value: string }
  | { readonly kind: 'rational'; readonly numerator: bigint; readonly denominator: bigint }
  | { readonly kind: 'list'; readonly items: readonly CanonicalValue[] }
  | { readonly kind: 'map'; readonly entries: readonly (readonly [CanonicalValue, CanonicalValue])[] }
  | { readonly kind: 'set'; readonly items: readonly CanonicalValue[] }
  | { readonly kind: 'record'; readonly schema: RecordSchema; readonly fields: ReadonlyMap<bigint, CanonicalValue> }
  | { readonly kind: 'typedIdentifier'; readonly namespaceId: bigint; readonly payload: CanonicalValue };

export type TypedIdentifierValue = Extract<CanonicalValue, { readonly kind: 'typedIdentifier' }>;

export class CanonicalEncodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CanonicalEncodingError';
  }
}

export class RecordSchemaRegistry {
  readonly #schemas = new Map<string, RecordSchema>();

  constructor(schemas: readonly RecordSchema[] = []) {
    for (const schema of schemas) this.register(schema);
  }

  register(schema: RecordSchema): void {
    validateSchema(schema);
    const key = schemaKey(schema.typeId, schema.schemaVersion);
    if (this.#schemas.has(key)) fail(`duplicate record schema ${key}`);
    this.#schemas.set(key, schema);
  }

  get(typeId: bigint, schemaVersion: bigint): RecordSchema | undefined {
    return this.#schemas.get(schemaKey(typeId, schemaVersion));
  }
}

export const unsigned = (value: bigint | number): CanonicalValue => ({ kind: 'unsigned', value: BigInt(value) });
export const signed = (value: bigint | number): CanonicalValue => ({ kind: 'signed', value: BigInt(value) });
export const bytes = (value: Uint8Array): CanonicalValue => ({ kind: 'bytes', value: value.slice() });
export const text = (value: string): CanonicalValue => ({ kind: 'text', value });
export const rational = (numerator: bigint | number, denominator: bigint | number): CanonicalValue => {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d === 0n) fail('rational denominator must be nonzero');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const divisor = gcd(abs(n), d);
  n /= divisor;
  d /= divisor;
  return { kind: 'rational', numerator: n, denominator: d };
};
export const list = (items: readonly CanonicalValue[]): CanonicalValue => ({ kind: 'list', items });
export const map = (entries: readonly (readonly [CanonicalValue, CanonicalValue])[]): CanonicalValue => ({ kind: 'map', entries });
export const set = (items: readonly CanonicalValue[]): CanonicalValue => ({ kind: 'set', items });
export const record = (schema: RecordSchema, fields: ReadonlyMap<bigint, CanonicalValue>): CanonicalValue => ({ kind: 'record', schema, fields });
export const typedIdentifier = (namespaceId: bigint | number, payload: CanonicalValue): TypedIdentifierValue => ({
  kind: 'typedIdentifier',
  namespaceId: BigInt(namespaceId),
  payload,
});

export function canonicalEncode(value: CanonicalValue): Uint8Array {
  const output: number[] = [];
  encodeValue(value, output);
  return Uint8Array.from(output);
}

export function canonicalDecode(input: Uint8Array, registry = new RecordSchemaRegistry()): CanonicalValue {
  const reader = new Reader(input, registry);
  const value = reader.readValue();
  if (!reader.done) fail('trailing bytes after canonical value');
  return value;
}

export function bytesToHex(value: Uint8Array): string {
  return [...value].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function cloneCanonicalValue(value: CanonicalValue): CanonicalValue {
  if (typeof value === 'boolean') return value;
  switch (value.kind) {
    case 'unsigned': return unsigned(value.value);
    case 'signed': return signed(value.value);
    case 'bytes': return bytes(value.value);
    case 'text': return text(value.value);
    case 'rational': return { kind: 'rational', numerator: value.numerator, denominator: value.denominator };
    case 'list': return list(value.items.map(cloneCanonicalValue));
    case 'map': return map(value.entries.map(([key, entryValue]) => [cloneCanonicalValue(key), cloneCanonicalValue(entryValue)]));
    case 'set': return set(value.items.map(cloneCanonicalValue));
    case 'record': return record(value.schema, new Map([...value.fields].map(([id, fieldValue]) => [id, cloneCanonicalValue(fieldValue)])));
    case 'typedIdentifier': return typedIdentifier(value.namespaceId, cloneCanonicalValue(value.payload));
  }
}

function encodeValue(value: CanonicalValue, output: number[]): void {
  if (value === false) return output.push(Tag.False), undefined;
  if (value === true) return output.push(Tag.True), undefined;

  switch (value.kind) {
    case 'unsigned':
      output.push(Tag.Unsigned, ...encodeUnsigned(value.value));
      return;
    case 'signed':
      output.push(Tag.Signed, ...encodeUnsigned(zigZagEncode(value.value)));
      return;
    case 'bytes':
      output.push(Tag.Bytes, ...encodeUnsigned(BigInt(value.value.length)), ...value.value);
      return;
    case 'text': {
      if (value.value !== value.value.normalize('NFC')) fail('text must already be NFC-normalized');
      const encoded = new TextEncoder().encode(value.value);
      output.push(Tag.Text, ...encodeUnsigned(BigInt(encoded.length)), ...encoded);
      return;
    }
    case 'rational':
      validateCanonicalRational(value.numerator, value.denominator);
      output.push(Tag.Rational, ...encodeUnsigned(zigZagEncode(value.numerator)), ...encodeUnsigned(value.denominator));
      return;
    case 'list':
      output.push(Tag.List, ...encodeUnsigned(BigInt(value.items.length)));
      for (const item of value.items) encodeValue(item, output);
      return;
    case 'map': {
      const entries = value.entries.map(([key, entryValue]) => ({ key, entryValue, encodedKey: canonicalEncode(key) }));
      entries.sort((left, right) => compareBytes(left.encodedKey, right.encodedKey));
      assertStrictlyIncreasing(entries.map((entry) => entry.encodedKey), 'duplicate canonical map key');
      output.push(Tag.Map, ...encodeUnsigned(BigInt(entries.length)));
      for (const entry of entries) {
        output.push(...entry.encodedKey);
        encodeValue(entry.entryValue, output);
      }
      return;
    }
    case 'set': {
      const items = value.items.map((item) => ({ item, encoded: canonicalEncode(item) }));
      items.sort((left, right) => compareBytes(left.encoded, right.encoded));
      assertStrictlyIncreasing(items.map((item) => item.encoded), 'duplicate canonical set item');
      output.push(Tag.Set, ...encodeUnsigned(BigInt(items.length)));
      for (const item of items) output.push(...item.encoded);
      return;
    }
    case 'record':
      encodeRecord(value.schema, value.fields, output);
      return;
    case 'typedIdentifier':
      requireUnsigned(value.namespaceId, 'identifier namespace');
      output.push(Tag.TypedIdentifier, ...encodeUnsigned(value.namespaceId));
      encodeValue(value.payload, output);
      return;
  }
}

function encodeRecord(schema: RecordSchema, values: ReadonlyMap<bigint, CanonicalValue>, output: number[]): void {
  validateSchema(schema);
  const declaredIds = new Set(schema.fields.map((field) => field.id));
  for (const fieldId of values.keys()) {
    if (!declaredIds.has(fieldId)) fail(`unknown field ${fieldId} for ${schema.name}`);
  }
  output.push(
    Tag.Record,
    ...encodeUnsigned(schema.typeId),
    ...encodeUnsigned(schema.schemaVersion),
    ...encodeUnsigned(BigInt(schema.fields.length)),
  );
  for (const field of schema.fields) {
    output.push(...encodeUnsigned(field.id));
    const value = values.get(field.id);
    if (value === undefined) {
      if (field.required) fail(`required field ${field.name} is absent`);
      output.push(0x00);
    } else {
      output.push(0x01);
      encodeValue(value, output);
    }
  }
}

function validateSchema(schema: RecordSchema): void {
  requireUnsigned(schema.typeId, 'record type ID');
  requireUnsigned(schema.schemaVersion, 'record schema version');
  let previous: bigint | undefined;
  for (const field of schema.fields) {
    requireUnsigned(field.id, 'record field ID');
    if (previous !== undefined && field.id <= previous) fail(`fields for ${schema.name} must be strictly ordered by ID`);
    previous = field.id;
  }
}

class Reader {
  #offset = 0;
  readonly #decoder = new TextDecoder('utf-8', { fatal: true });

  constructor(readonly input: Uint8Array, readonly registry: RecordSchemaRegistry) {}

  get done(): boolean {
    return this.#offset === this.input.length;
  }

  readValue(): CanonicalValue {
    const tag = this.readByte('type tag');
    switch (tag) {
      case Tag.False: return false;
      case Tag.True: return true;
      case Tag.Unsigned: return unsigned(this.readUnsigned());
      case Tag.Signed: return signed(zigZagDecode(this.readUnsigned()));
      case Tag.Bytes: return bytes(this.readBytes(this.readLength('byte-string length')));
      case Tag.Text: return this.readText();
      case Tag.Rational: return this.readRational();
      case Tag.List: return list(this.readMany(this.readLength('list count'), () => this.readValue()));
      case Tag.Map: return this.readMap();
      case Tag.Set: return this.readSet();
      case Tag.Record: return this.readRecord();
      case Tag.TypedIdentifier: return typedIdentifier(this.readUnsigned(), this.readValue());
      default: return fail(`unknown canonical type tag 0x${tag.toString(16).padStart(2, '0')}`);
    }
  }

  readByte(description: string): number {
    if (this.#offset >= this.input.length) fail(`unexpected end while reading ${description}`);
    return this.input[this.#offset++];
  }

  readUnsigned(): bigint {
    let value = 0n;
    let shift = 0n;
    let count = 0;
    while (true) {
      const byte = this.readByte('unsigned LEB128');
      count += 1;
      value |= BigInt(byte & 0x7f) << shift;
      if ((byte & 0x80) === 0) {
        if (count > 1 && (byte & 0x7f) === 0) fail('non-minimal unsigned LEB128');
        return value;
      }
      shift += 7n;
    }
  }

  readLength(description: string): number {
    const length = this.readUnsigned();
    if (length > BigInt(Number.MAX_SAFE_INTEGER)) fail(`${description} exceeds implementation limit`);
    return Number(length);
  }

  readBytes(length: number): Uint8Array {
    if (length > this.input.length - this.#offset) fail('declared byte length exceeds remaining input');
    const result = this.input.slice(this.#offset, this.#offset + length);
    this.#offset += length;
    return result;
  }

  readText(): CanonicalValue {
    let decoded: string;
    try {
      decoded = this.#decoder.decode(this.readBytes(this.readLength('text byte length')));
    } catch {
      return fail('text payload is not valid UTF-8');
    }
    if (decoded !== decoded.normalize('NFC')) fail('text payload is not NFC-normalized');
    return text(decoded);
  }

  readRational(): CanonicalValue {
    const numerator = zigZagDecode(this.readUnsigned());
    const denominator = this.readUnsigned();
    validateCanonicalRational(numerator, denominator);
    return { kind: 'rational', numerator, denominator };
  }

  readMap(): CanonicalValue {
    const count = this.readLength('map count');
    const entries: Array<readonly [CanonicalValue, CanonicalValue]> = [];
    let previous: Uint8Array | undefined;
    for (let index = 0; index < count; index += 1) {
      const key = this.readValue();
      const encodedKey = canonicalEncode(key);
      if (previous && compareBytes(previous, encodedKey) >= 0) fail('map keys are duplicate or not in canonical order');
      previous = encodedKey;
      entries.push([key, this.readValue()]);
    }
    return map(entries);
  }

  readSet(): CanonicalValue {
    const count = this.readLength('set count');
    const items: CanonicalValue[] = [];
    let previous: Uint8Array | undefined;
    for (let index = 0; index < count; index += 1) {
      const item = this.readValue();
      const encoded = canonicalEncode(item);
      if (previous && compareBytes(previous, encoded) >= 0) fail('set items are duplicate or not in canonical order');
      previous = encoded;
      items.push(item);
    }
    return set(items);
  }

  readRecord(): CanonicalValue {
    const typeId = this.readUnsigned();
    const schemaVersion = this.readUnsigned();
    const count = this.readLength('record field count');
    const schema = this.registry.get(typeId, schemaVersion);
    if (!schema) fail(`unknown record schema ${schemaKey(typeId, schemaVersion)}`);
    if (count !== schema.fields.length) fail(`declared field count does not match schema ${schema.name}`);
    const values = new Map<bigint, CanonicalValue>();
    for (const expected of schema.fields) {
      const fieldId = this.readUnsigned();
      if (fieldId !== expected.id) fail(`record fields are unknown, duplicate, omitted, or not in canonical order`);
      const presence = this.readByte('record field presence');
      if (presence !== 0x00 && presence !== 0x01) fail('record presence byte must be 0x00 or 0x01');
      if (presence === 0x00) {
        if (expected.required) fail(`required field ${expected.name} is absent`);
      } else {
        values.set(fieldId, this.readValue());
      }
    }
    return record(schema, values);
  }

  readMany<T>(count: number, read: () => T): T[] {
    const result: T[] = [];
    for (let index = 0; index < count; index += 1) result.push(read());
    return result;
  }
}

function encodeUnsigned(value: bigint): number[] {
  requireUnsigned(value, 'unsigned integer');
  const output: number[] = [];
  do {
    let byte = Number(value & 0x7fn);
    value >>= 7n;
    if (value !== 0n) byte |= 0x80;
    output.push(byte);
  } while (value !== 0n);
  return output;
}

function zigZagEncode(value: bigint): bigint {
  return value >= 0n ? value * 2n : (-value * 2n) - 1n;
}

function zigZagDecode(value: bigint): bigint {
  return (value & 1n) === 0n ? value / 2n : -((value + 1n) / 2n);
}

function validateCanonicalRational(numerator: bigint, denominator: bigint): void {
  if (denominator <= 0n) fail('rational denominator must be positive');
  if (gcd(abs(numerator), denominator) !== 1n) fail('rational must be reduced');
  if (numerator === 0n && denominator !== 1n) fail('zero rational must be 0/1');
}

function gcd(left: bigint, right: bigint): bigint {
  while (right !== 0n) [left, right] = [right, left % right];
  return left;
}

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function requireUnsigned(value: bigint, description: string): void {
  if (value < 0n) fail(`${description} must be nonnegative`);
}

function compareBytes(left: Uint8Array, right: Uint8Array): number {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    if (left[index] !== right[index]) return left[index] < right[index] ? -1 : 1;
  }
  return left.length === right.length ? 0 : left.length < right.length ? -1 : 1;
}

function assertStrictlyIncreasing(values: readonly Uint8Array[], message: string): void {
  for (let index = 1; index < values.length; index += 1) {
    if (compareBytes(values[index - 1], values[index]) >= 0) fail(message);
  }
}

function schemaKey(typeId: bigint, schemaVersion: bigint): string {
  return `${typeId}/${schemaVersion}`;
}

function fail(message: string): never {
  throw new CanonicalEncodingError(message);
}
