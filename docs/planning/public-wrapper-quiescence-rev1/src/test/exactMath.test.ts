import { describe, expect, it } from 'vitest';
import { ExactRational, ceilDiv, floorDiv, roundEven } from '../substrate/exactMath';

describe('Campaign 0 exact arithmetic oracle', () => {
  it('implements sign-correct floor and ceiling division', () => {
    expect(floorDiv(5n, 2n)).toBe(2n);
    expect(floorDiv(-5n, 2n)).toBe(-3n);
    expect(ceilDiv(5n, 2n)).toBe(3n);
    expect(ceilDiv(-5n, 2n)).toBe(-2n);
    expect(() => floorDiv(1n, 0n)).toThrow(/positive/);
  });

  it('rounds exact half-ties to the even integer for both signs', () => {
    expect(roundEven(1n, 2n)).toBe(0n);
    expect(roundEven(3n, 2n)).toBe(2n);
    expect(roundEven(-1n, 2n)).toBe(0n);
    expect(roundEven(-3n, 2n)).toBe(-2n);
    expect(roundEven(5n, 3n)).toBe(2n);
  });

  it('ports reduced exact rational arithmetic without authoritative number conversion', () => {
    const a = ExactRational.of(4n, -8n);
    const b = ExactRational.of(1n, 6n);
    expect(a).toEqual(ExactRational.of(-1n, 2n));
    expect(a.add(b)).toEqual(ExactRational.of(-1n, 3n));
    expect(a.subtract(b)).toEqual(ExactRational.of(-2n, 3n));
    expect(a.multiply(b)).toEqual(ExactRational.of(-1n, 12n));
    expect(a.divide(b)).toEqual(ExactRational.of(-3n, 1n));
    expect(a.compare(b)).toBe(-1);
    expect(() => ExactRational.of(1n, 0n)).toThrow(/nonzero/);
  });
});
