import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import { applyBoundedEffect } from '../model/needs';

describe('applyBoundedEffect — Phase 2.5a Brief §16/§27 decomposition', () => {
  it('unsaturated effect: applied == effect, overflow == 0, saturated == none', () => {
    const result = applyBoundedEffect(ratOf(1, 2), ratOf(1, 5));
    expect(result.applied.equals(ratOf(1, 5))).toBe(true);
    expect(result.overflow.isZero()).toBe(true);
    expect(result.saturated).toBe('none');
    expect(result.after.equals(ratOf(7, 10))).toBe(true);
  });

  it('ceiling-clipped effect: applied == headroom, overflow > 0, saturated == ceiling', () => {
    // level 0.85, effect +0.40 -> capacity+ = 0.15, applied = 0.15, overflow = 0.25
    const result = applyBoundedEffect(ratOf(17, 20), ratOf(2, 5));
    expect(result.applied.equals(ratOf(3, 20))).toBe(true);
    expect(result.overflow.equals(ratOf(1, 4))).toBe(true);
    expect(result.saturated).toBe('ceiling');
    expect(result.after.equals(Rational.ONE)).toBe(true);
  });

  it('floor-clipped effect: applied == -headroom, overflow < 0, saturated == floor', () => {
    // level 0.05, effect -0.40 -> capacity- = 0.05, applied = -0.05, overflow = -0.35
    const result = applyBoundedEffect(ratOf(1, 20), ratOf(-2, 5));
    expect(result.applied.equals(ratOf(-1, 20))).toBe(true);
    expect(result.overflow.equals(ratOf(-7, 20))).toBe(true);
    expect(result.saturated).toBe('floor');
    expect(result.after.isZero()).toBe(true);
  });

  it('exact decomposition identity: applied + overflow === effect, for every case above', () => {
    const cases: readonly [Rational, Rational][] = [
      [ratOf(1, 2), ratOf(1, 5)],
      [ratOf(17, 20), ratOf(2, 5)],
      [ratOf(1, 20), ratOf(-2, 5)],
      [ratOf(0), ratOf(0)],
      [Rational.ONE, ratOf(1, 100)],
      [Rational.ZERO, ratOf(-1, 100)],
    ];
    for (const [level, effect] of cases) {
      const { applied, overflow } = applyBoundedEffect(level, effect);
      expect(applied.add(overflow).equals(effect)).toBe(true);
    }
  });

  it('after is always clamped to [0, 1] regardless of how extreme the effect is', () => {
    const highEffect = applyBoundedEffect(ratOf(9, 10), ratOf(50));
    expect(highEffect.after.equals(Rational.ONE)).toBe(true);
    expect(highEffect.saturated).toBe('ceiling');

    const lowEffect = applyBoundedEffect(ratOf(1, 10), ratOf(-50));
    expect(lowEffect.after.isZero()).toBe(true);
    expect(lowEffect.saturated).toBe('floor');
  });

  it('a zero effect at either boundary is "none", not spuriously saturated', () => {
    const atCeiling = applyBoundedEffect(Rational.ONE, ratOf(0));
    expect(atCeiling.saturated).toBe('none');
    expect(atCeiling.overflow.isZero()).toBe(true);

    const atFloor = applyBoundedEffect(Rational.ZERO, ratOf(0));
    expect(atFloor.saturated).toBe('none');
    expect(atFloor.overflow.isZero()).toBe(true);
  });
});
