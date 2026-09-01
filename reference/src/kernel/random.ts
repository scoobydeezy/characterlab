/**
 * Counter-addressed random oracle, per Brief §7.
 *
 *   r = H(Seed, ModelVersion, EventId, PurposeId, DrawIndex)
 *
 * There is no mutable global RNG stream. Every draw is addressed by a
 * tuple, so an unrelated random event elsewhere in the simulation cannot
 * shift this one's result — draws are pure functions of their address, not
 * of call order.
 */

import { hash64, HASH_MASK_64 } from './hash';
import { Rational } from './rational';
import { MODEL_VERSION } from './lattice';

export interface DrawAddress {
  seed: string;
  eventId: string;
  purposeId: string;
  drawIndex: number;
  modelVersion?: string;
}

function canonicalAddressString(addr: DrawAddress): string {
  const mv = addr.modelVersion ?? MODEL_VERSION;
  // Field separator chosen to be extremely unlikely inside authored IDs;
  // still, IDs are validated as ConceptKey-shaped (kernel/canonical.ts),
  // which excludes this separator.
  return [addr.seed, mv, addr.eventId, addr.purposeId, String(addr.drawIndex)].join('');
}

/**
 * Raw 64-bit draw for an address. Pure function — same address, same
 * result, forever, independent of everything else that has or hasn't been
 * drawn.
 */
export function drawRaw64(addr: DrawAddress): bigint {
  return hash64(canonicalAddressString(addr));
}

/**
 * Uniform draw u ∈ [0, 1) as an EXACT rational k / 2^64. Exact so it can be
 * compared against exact cumulative-probability rationals during
 * deterministic sampling (kernel/choice selection) without a second,
 * independent rounding step contaminating the result.
 */
export function drawUniform(addr: DrawAddress): Rational {
  const k = drawRaw64(addr);
  return Rational.of(k, 1n << 64n);
}

/** Convenience: bump only DrawIndex, keeping the rest of the address fixed.
 * Used when one logical event needs a sequence of independent draws (e.g.
 * one per candidate Action tie-break). */
export function drawAt(addr: DrawAddress, drawIndex: number): DrawAddress {
  return { ...addr, drawIndex };
}

export const RANDOM_ORACLE_MODULUS = 1n << 64n;
export { HASH_MASK_64 };
