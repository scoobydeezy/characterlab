import { describe, expect, it } from 'vitest';
import {
  CanonicalEncodingError,
  RecordSchemaRegistry,
  bytes,
  bytesToHex,
  canonicalDecode,
  canonicalEncode,
  list,
  map,
  rational,
  record,
  set,
  signed,
  text,
  typedIdentifier,
  unsigned,
  type CanonicalValue,
  type RecordSchema,
} from '../substrate/canonicalEncoding';

const optionalRecord: RecordSchema = {
  typeId: 42n,
  schemaVersion: 1n,
  name: 'OptionalRecordFixture',
  fields: [
    { id: 1n, name: 'RequiredValue', required: true },
    { id: 3n, name: 'OptionalValue', required: false },
  ],
};
const registry = new RecordSchemaRegistry([optionalRecord]);
const hex = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));
const fromHex = (value: string) => Uint8Array.from(value.match(/../g)?.map((part) => Number.parseInt(part, 16)) ?? []);

describe('CV-ENC-001 canonical primitive golden bytes', () => {
  it.each([
    [false, '00'],
    [true, '01'],
    [unsigned(0n), '0200'],
    [unsigned(127n), '027f'],
    [unsigned(128n), '028001'],
    [unsigned(16384n), '02808001'],
    [signed(0n), '0300'],
    [signed(-1n), '0301'],
    [signed(1n), '0302'],
    [signed(-2n), '0303'],
    [bytes(Uint8Array.of(0x00, 0xff)), '040200ff'],
    [text('\u00e9'), '0502c3a9'],
    [rational(-2n, 3n), '060303'],
    [list([false, unsigned(1n)]), '0702000201'],
    [typedIdentifier(7n, text('x')), '0b07050178'],
    [record(optionalRecord, new Map([[1n, unsigned(7n)]])), '0a2a0102010102070300'],
  ] as const)('encodes %#', (value, expected) => {
    expect(hex(value)).toBe(expected);
    expect(canonicalEncode(canonicalDecode(fromHex(expected), registry))).toEqual(fromHex(expected));
  });
});

describe('CV-ENC-002 canonical collection ordering', () => {
  it('makes map and set construction order irrelevant', () => {
    const mapForward = map([[unsigned(2n), text('b')], [unsigned(1n), text('a')]]);
    const mapReverse = map([[unsigned(1n), text('a')], [unsigned(2n), text('b')]]);
    const setForward = set([text('b'), text('a')]);
    const setReverse = set([text('a'), text('b')]);
    expect(canonicalEncode(mapForward)).toEqual(canonicalEncode(mapReverse));
    expect(canonicalEncode(setForward)).toEqual(canonicalEncode(setReverse));
  });

  it('rejects duplicate canonical keys and items', () => {
    expect(() => canonicalEncode(map([[unsigned(1n), false], [unsigned(1n), true]]))).toThrow(/duplicate canonical map key/);
    expect(() => canonicalEncode(set([unsigned(1n), unsigned(1n)]))).toThrow(/duplicate canonical set item/);
  });
});

describe('CV-ENC-003 decoder rejection controls', () => {
  it.each([
    ['non-minimal LEB128', '028000'],
    ['non-NFC text', '050365cc81'],
    ['unreduced rational', '060406'],
    ['zero with a noncanonical denominator', '060002'],
    ['map key order', '0802020200020101'],
    ['duplicate set items', '090202010201'],
    ['invalid presence', '0a2a0102010202070300'],
    ['unknown or out-of-order record field', '0a2a0102020102070300'],
    ['missing required record field', '0a2a010201000300'],
  ])('rejects %s', (_case, encoded) => {
    expect(() => canonicalDecode(fromHex(encoded), registry)).toThrow(CanonicalEncodingError);
  });

  it('rejects unknown record schemas', () => {
    expect(() => canonicalDecode(fromHex('0a2a0102010102070300'))).toThrow(/unknown record schema/);
  });

  it('rejects noncanonical values at encode time', () => {
    expect(() => canonicalEncode(text('e\u0301'))).toThrow(/NFC/);
    expect(() => canonicalEncode({ kind: 'rational', numerator: 2n, denominator: 4n })).toThrow(/reduced/);
    expect(() => canonicalEncode(unsigned(-1n))).toThrow(/nonnegative/);
  });
});
