/**
 * Versioned rational lattice, per Brief §5.2.
 *
 *   Q_D = { k/D : k ∈ ℤ }
 *
 * D is a model-versioned scale. Persistent scalar state lives on this
 * lattice; the point at which quantization occurs is always an explicit,
 * named step in an algorithm (§5.2, §6) — never implicit rounding.
 */

import { Rational } from './rational';

/** A model version pins both D (the lattice scale) and every authored
 * threshold/rate constant used by the kernel and model layers. Bumping
 * MODEL_VERSION is how CharacterLab records "the math changed" — the
 * determinism contract (§3.1) is defined per model version M. */
export const MODEL_VERSION = 'characterlab-0.1.0';

/** Lattice denominator D. 10^6 gives 1e-6 resolution, comfortably below
 * anything a Need level, expectation, or weight needs to distinguish, while
 * staying small enough that k fits well within safe BigInt/number ranges
 * for the lifetime of a research run. */
export const D: bigint = 1_000_000n;

export type LatticePoint = bigint; // k, where the value represented is k/D

/**
 * RoundEven(x): round a rational to the nearest integer, ties to even.
 * This is the tie-breaking rule Brief §5.2 and §15.1 mandate for
 * quantization — it is specified explicitly so replay is bit-exact
 * regardless of host/platform floating point behavior (§3.1 forbids
 * "unspecified floating-point behavior").
 */
export function roundEven(x: Rational): bigint {
  const floorDiv = (a: bigint, b: bigint): bigint => {
    // Euclidean floor division for BigInt (b > 0 here since Rational.q > 0).
    const q = a / b;
    const r = a % b;
    return r !== 0n && (r < 0n) !== (b < 0n) ? q - 1n : q;
  };
  const floor = floorDiv(x.p, x.q);
  const rem = x.sub(Rational.fromInt(floor)); // 0 <= rem < 1
  const twiceRem = rem.mul(Rational.of(2n, 1n));
  const cmp = twiceRem.compare(Rational.ONE);
  if (cmp < 0) return floor;
  if (cmp > 0) return floor + 1n;
  // Exact tie: round to even.
  return floor % 2n === 0n ? floor : floor + 1n;
}

/**
 * Q_D(x) = RoundEven(D·x) / D
 *
 * Guarantees |Q_D(x) - x| <= 1/(2D) (Brief §5.2, §32 "Quantization bound").
 * Returns both the lattice integer k and the resulting exact rational k/D,
 * since authoritative state stores k while calculations continue to want a
 * Rational to compose with.
 */
export function quantize(x: Rational, scale: bigint = D): { k: LatticePoint; value: Rational } {
  const k = roundEven(x.mul(Rational.of(scale, 1n)));
  return { k, value: Rational.of(k, scale) };
}

export function latticeToRational(k: LatticePoint, scale: bigint = D): Rational {
  return Rational.of(k, scale);
}

/** Quantization-error bound 1/(2D) as an exact Rational, for tests that
 * verify Brief §32's "Quantization bound" proof obligation directly. */
export function quantizationErrorBound(scale: bigint = D): Rational {
  return Rational.of(1n, 2n * scale);
}
