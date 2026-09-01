import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import { quantize, roundEven, quantizationErrorBound, D } from '../kernel/lattice';

describe('roundEven (RoundEven, ties-to-even)', () => {
  it('rounds non-tie values to the nearest integer', () => {
    expect(roundEven(ratOf(7, 2))).toBe(4n); // 3.5 -> tie, even -> 4
    expect(roundEven(ratOf(5, 2))).toBe(2n); // 2.5 -> tie, even -> 2
    expect(roundEven(ratOf(9, 4))).toBe(2n); // 2.25 -> 2
    expect(roundEven(ratOf(11, 4))).toBe(3n); // 2.75 -> 3
  });

  it('breaks exact ties toward the even neighbor, including negatives', () => {
    expect(roundEven(ratOf(-5, 2))).toBe(-2n); // -2.5 -> -2 (even)
    expect(roundEven(ratOf(-7, 2))).toBe(-4n); // -3.5 -> -4 (even)
  });

  it('handles exact integers as fixed points', () => {
    expect(roundEven(ratOf(5))).toBe(5n);
    expect(roundEven(ratOf(-3))).toBe(-3n);
    expect(roundEven(ratOf(0))).toBe(0n);
  });
});

describe('quantize / Q_D — Brief §32 Quantization bound', () => {
  it('satisfies |Q_D(x) - x| <= 1/(2D) for arbitrary exact rationals', () => {
    const bound = quantizationErrorBound(D);
    const samples = [
      ratOf(1, 3),
      ratOf(2, 7),
      ratOf(-5, 11),
      ratOf(999_999, 1_000_000),
      ratOf(1, 2_000_001),
      ratOf(123_456, 789_013),
    ];
    for (const x of samples) {
      const { value } = quantize(x);
      const error = value.sub(x).abs();
      expect(error.lte(bound)).toBe(true);
    }
  });

  it('is idempotent on values already on the lattice', () => {
    const onLattice = ratOf(3, 1).div(ratOf(D, 1n)); // 3/D is exactly representable
    const { value } = quantize(onLattice);
    expect(value.equals(onLattice)).toBe(true);
  });

  it('quantizes ties to even at the lattice resolution', () => {
    // Choose x exactly halfway between two lattice points: k/D + 1/(2D).
    const k = 7n;
    const half = Rational.of(2n * k + 1n, 2n * D); // (k + 0.5)/D
    const { k: resultK } = quantize(half);
    // k=7 is odd, k+1=8 is even -> RoundEven picks 8.
    expect(resultK).toBe(8n);
  });
});
