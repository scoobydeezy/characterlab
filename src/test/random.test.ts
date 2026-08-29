import { describe, it, expect } from 'vitest';
import { drawUniform, drawRaw64 } from '../kernel/random';
import { Rational } from '../kernel/rational';

describe('counter-addressed random oracle — Brief §7', () => {
  const base = { seed: 'seed-A', eventId: 'evt-1', purposeId: 'action_selection', drawIndex: 0 };

  it('is a pure function of its address: identical address -> identical draw', () => {
    const a = drawUniform(base);
    const b = drawUniform({ ...base });
    expect(a.equals(b)).toBe(true);
  });

  it('changes when any single address field changes', () => {
    const a = drawUniform(base);
    expect(drawUniform({ ...base, seed: 'seed-B' }).equals(a)).toBe(false);
    expect(drawUniform({ ...base, eventId: 'evt-2' }).equals(a)).toBe(false);
    expect(drawUniform({ ...base, purposeId: 'other_purpose' }).equals(a)).toBe(false);
    expect(drawUniform({ ...base, drawIndex: 1 }).equals(a)).toBe(false);
  });

  it('an unrelated draw (different purpose/index) cannot shift this draw\'s result', () => {
    const before = drawUniform(base);
    // Simulate "unrelated random events" happening elsewhere by drawing a
    // bunch of other addresses; none of that should be able to change what
    // drawUniform(base) returns, because there is no shared mutable state.
    for (let i = 0; i < 50; i++) {
      drawUniform({ ...base, purposeId: `unrelated_${i}`, drawIndex: i });
    }
    const after = drawUniform(base);
    expect(after.equals(before)).toBe(true);
  });

  it('produces values in [0, 1)', () => {
    for (let i = 0; i < 25; i++) {
      const u = drawUniform({ ...base, drawIndex: i });
      expect(u.gte(Rational.ZERO)).toBe(true);
      expect(u.lt(Rational.ONE)).toBe(true);
    }
  });

  it('raw 64-bit draw is non-negative and within 64 bits', () => {
    const r = drawRaw64(base);
    expect(r >= 0n).toBe(true);
    expect(r < (1n << 64n)).toBe(true);
  });
});
