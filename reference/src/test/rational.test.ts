import { describe, it, expect } from 'vitest';
import { Rational, ratOf } from '../kernel/rational';

describe('Rational', () => {
  it('reduces to lowest terms with a positive denominator', () => {
    const r = ratOf(4, -8);
    expect(r.p).toBe(-1n);
    expect(r.q).toBe(2n);
  });

  it('adds, subtracts, multiplies, divides exactly', () => {
    const a = ratOf(1, 3);
    const b = ratOf(1, 6);
    expect(a.add(b).equals(ratOf(1, 2))).toBe(true);
    expect(a.sub(b).equals(ratOf(1, 6))).toBe(true);
    expect(a.mul(b).equals(ratOf(1, 18))).toBe(true);
    expect(a.div(b).equals(ratOf(2, 1))).toBe(true);
  });

  it('compares correctly across different denominators', () => {
    expect(ratOf(1, 3).lt(ratOf(1, 2))).toBe(true);
    expect(ratOf(2, 4).equals(ratOf(1, 2))).toBe(true);
    expect(ratOf(-1, 2).lt(ratOf(0))).toBe(true);
  });

  it('clamps within bounds', () => {
    expect(ratOf(5).clamp(Rational.ZERO, Rational.ONE).equals(Rational.ONE)).toBe(true);
    expect(ratOf(-5).clamp(Rational.ZERO, Rational.ONE).equals(Rational.ZERO)).toBe(true);
    expect(ratOf(1, 2).clamp(Rational.ZERO, Rational.ONE).equals(ratOf(1, 2))).toBe(true);
  });

  it('pow handles positive, negative, and zero integer exponents exactly', () => {
    expect(ratOf(2).pow(10).equals(ratOf(1024))).toBe(true);
    expect(ratOf(2).pow(0).equals(Rational.ONE)).toBe(true);
    expect(ratOf(2).pow(-2).equals(ratOf(1, 4))).toBe(true);
  });

  it('rejects a zero denominator', () => {
    expect(() => ratOf(1, 0)).toThrow();
  });

  it('bounded response g(x) = x/(1+|x|) stays strictly within (-1, 1) for large x', () => {
    const g = Rational.boundedResponse(ratOf(1_000_000));
    expect(g.lt(Rational.ONE)).toBe(true);
    expect(g.gt(Rational.ZERO)).toBe(true);
    const gNeg = Rational.boundedResponse(ratOf(-1_000_000));
    expect(gNeg.gt(Rational.ONE.neg())).toBe(true);
  });
});
