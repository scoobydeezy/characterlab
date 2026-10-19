import {canonicalEncode, bytesToHex, type CanonicalValue} from '../substrate/canonicalEncoding';
import {sha256} from '../substrate/crypto';

export const equalBytes = (a: Uint8Array, b: Uint8Array) => a.length === b.length && a.every((v, i) => v === b[i]);
export const digest = async (bytes: Uint8Array) => bytesToHex(await sha256(bytes));
export const exactKey = (v: CanonicalValue) => bytesToHex(canonicalEncode(v));
/** Exact strings deliberately keep big integers and fractions out of JS Number. */
export function readable(v: CanonicalValue): unknown {
  if (typeof v === 'boolean') return v;
  switch (v.kind) {
    case 'unsigned': case 'signed': return v.value.toString();
    case 'text': return v.value;
    case 'bytes': return {bytes: bytesToHex(v.value)};
    case 'rational': return `${v.numerator}/${v.denominator}`;
    case 'typedIdentifier': return {namespace: String(v.namespaceId), identity: readable(v.payload)};
    case 'list': case 'set': return v.items.map(readable);
    case 'map': return v.entries.map(([k, x]) => [readable(k), readable(x)]);
    case 'record': return {record: `${v.schema.name}#${v.schema.typeId}/${v.schema.schemaVersion}`,
      ...Object.fromEntries([...v.fields].map(([id, x]) => [`${v.schema.fields.find(f => f.id === id)?.name ?? 'field'} [${id}]`, readable(x)]))};
  }
}
export const exactText = (v: CanonicalValue) => JSON.stringify(readable(v), null, 2);
export function fromHex(text: string): Uint8Array {
  if (text.length % 2 || !/^[0-9a-f]*$/i.test(text)) throw Error('Invalid hexadecimal bytes');
  return Uint8Array.from(text.match(/../g) ?? [], x => parseInt(x, 16));
}
