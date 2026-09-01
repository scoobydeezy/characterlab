/**
 * Deterministic, platform-independent 64-bit hashing.
 *
 * Brief §3.1 forbids authoritative state depending on "unspecified
 * floating-point behavior" or "implicit randomness." That rules out
 * anything built on Math.random(), Date.now(), object/Map iteration order,
 * or non-integer floating point math. Everything below is exact BigInt
 * arithmetic over UTF-8 bytes, so two runs — on any machine, any JS engine
 * — produce bit-identical output for the same input string.
 *
 * This is FNV-1a 64-bit followed by a SplitMix64 avalanche finalizer. It is
 * not cryptographically secure and does not need to be — it only needs to
 * be a fixed, fully specified pure function, which it is.
 */

const FNV_OFFSET_64 = 0xcbf29ce484222325n;
const FNV_PRIME_64 = 0x100000001b3n;
const MASK_64 = (1n << 64n) - 1n;

function fnv1a64(bytes: Uint8Array): bigint {
  let h = FNV_OFFSET_64;
  for (let i = 0; i < bytes.length; i++) {
    h ^= BigInt(bytes[i]);
    h = (h * FNV_PRIME_64) & MASK_64;
  }
  return h;
}

/** SplitMix64 finalizer — mixes bits so downstream low-order-bit extraction
 * (e.g. modulo a small integer) stays well distributed. */
function splitMix64(x: bigint): bigint {
  x = (x + 0x9e3779b97f4a7c15n) & MASK_64;
  x = ((x ^ (x >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK_64;
  x = ((x ^ (x >> 27n)) * 0x94d049bb133111ebn) & MASK_64;
  x = x ^ (x >> 31n);
  return x & MASK_64;
}

/** Deterministic 64-bit hash of a canonical UTF-8 string. */
export function hash64(input: string): bigint {
  const bytes = new TextEncoder().encode(input);
  return splitMix64(fnv1a64(bytes));
}

/** Derive N independent-looking 64-bit words from one input by re-hashing
 * with a counter suffix. Used when a single draw needs more than 64 bits
 * of entropy (not currently required, but keeps the primitive general). */
export function hash64Stream(input: string, count: number): bigint[] {
  const out: bigint[] = [];
  for (let i = 0; i < count; i++) {
    out.push(hash64(`${input}#${i}`));
  }
  return out;
}

export const HASH_MASK_64 = MASK_64;
