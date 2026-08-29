/**
 * Canonical JSON stringification + hashing, used to fingerprint state and
 * traces for the determinism-replay check (Brief §3.1: "Repeated execution
 * must reproduce ... the complete resulting trace").
 *
 * Ordinary JSON.stringify's key order depends on insertion order for
 * string keys, which is usually stable in modern engines but is exactly
 * the kind of "unspecified... collection iteration order" behavior §3.1
 * forbids relying on. canonicalStringify sorts object keys explicitly so
 * the hash is a pure function of content, never of construction order.
 *
 * BigInt values (lattice points, rational numerators/denominators) are
 * serialized as `${n}n` tagged strings so they survive round-tripping
 * without precision loss through JS numbers.
 */

import { hash64 } from './hash';

export type Canonicalizable =
  | null
  | boolean
  | number
  | string
  | bigint
  | readonly Canonicalizable[]
  | { readonly [key: string]: Canonicalizable };

function canonicalize(value: Canonicalizable): string {
  if (value === null) return 'null';
  const t = typeof value;
  if (t === 'boolean' || t === 'number') return JSON.stringify(value);
  if (t === 'bigint') return JSON.stringify(`${(value as bigint).toString()}n`);
  if (t === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((v) => canonicalize(v as Canonicalizable)).join(',')}]`;
  }
  // Plain object: sort keys.
  const obj = value as { readonly [key: string]: Canonicalizable };
  const keys = Object.keys(obj).sort();
  const body = keys.map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`).join(',');
  return `{${body}}`;
}

export function canonicalStringify(value: Canonicalizable): string {
  return canonicalize(value);
}

/** Deterministic content hash, rendered as a fixed-width hex string for
 * display in the UI's "determinism check" panel. */
export function stateHash(value: Canonicalizable): string {
  const h = hash64(canonicalStringify(value));
  return h.toString(16).padStart(16, '0');
}
