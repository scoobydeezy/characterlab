import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import {
  Distribution,
  pointMass,
  uniformDie,
  convolve,
  convolveAll,
  pmfAt,
  support,
  buildCdfTable,
  cdfAt,
  expectedValue,
  totalProbability,
  winProbabilities,
} from '../kernel/discreteDistribution';

describe('uniformDie / pointMass — basic distributions', () => {
  it('uniformDie(4, 1) is uniform over {1,2,3,4}, each 1/4, summing to exactly 1', () => {
    const d4 = uniformDie(4, 1);
    expect(support(d4)).toEqual([1n, 2n, 3n, 4n]);
    for (const v of [1n, 2n, 3n, 4n]) {
      expect(pmfAt(d4, v).equals(ratOf(1, 4))).toBe(true);
    }
    expect(totalProbability(d4).equals(Rational.ONE)).toBe(true);
  });

  it('uniformDie(6, -1) is uniform over {-6,...,-1}, each 1/6', () => {
    const negD6 = uniformDie(6, -1);
    expect(support(negD6)).toEqual([-6n, -5n, -4n, -3n, -2n, -1n]);
    for (const v of support(negD6)) {
      expect(pmfAt(negD6, v).equals(ratOf(1, 6))).toBe(true);
    }
    expect(totalProbability(negD6).equals(Rational.ONE)).toBe(true);
  });

  it('uniformDie rejects non-positive-integer faces', () => {
    expect(() => uniformDie(0, 1)).toThrow(RangeError);
    expect(() => uniformDie(1.5, 1)).toThrow(RangeError);
  });

  it('pointMass(0n) is the convolution identity: convolving with it changes nothing', () => {
    const d4 = uniformDie(4, 1);
    const convolved = convolve(d4, pointMass(0n));
    for (const v of support(d4)) {
      expect(pmfAt(convolved, v).equals(pmfAt(d4, v))).toBe(true);
    }
  });
});

describe('convolve / convolveAll — hand-verified small cases', () => {
  it('convolves two d2-like distributions ({1,2} + {1,2}) into the exact hand-computed triangle {2:1/4, 3:1/2, 4:1/4}', () => {
    const d2 = uniformDie(2, 1);
    const sum = convolve(d2, d2);
    expect(support(sum)).toEqual([2n, 3n, 4n]);
    expect(pmfAt(sum, 2n).equals(ratOf(1, 4))).toBe(true);
    expect(pmfAt(sum, 3n).equals(ratOf(1, 2))).toBe(true);
    expect(pmfAt(sum, 4n).equals(ratOf(1, 4))).toBe(true);
    expect(totalProbability(sum).equals(Rational.ONE)).toBe(true);
  });

  it('d4 + d6 sums to exactly 1 across its full support and matches a hand-computed midpoint value', () => {
    const d4 = uniformDie(4, 1);
    const d6 = uniformDie(6, 1);
    const sum = convolve(d4, d6);
    // Support is {2,...,10}; value 5 is reachable by (1,4),(2,3),(3,2),(4,1) = 4 ways out of 24.
    expect(pmfAt(sum, 5n).equals(ratOf(4, 24))).toBe(true);
    expect(totalProbability(sum).equals(Rational.ONE)).toBe(true);
  });

  it('convolveAll([]) is pointMass(0n) — an Option with zero rollable Influences has RollScore ≡ 0', () => {
    const empty = convolveAll([]);
    expect(support(empty)).toEqual([0n]);
    expect(pmfAt(empty, 0n).equals(Rational.ONE)).toBe(true);
  });

  it('convolveAll of three dice (mixed signs) sums probabilities to exactly 1', () => {
    const result = convolveAll([uniformDie(4, 1), uniformDie(6, -1), uniformDie(8, 1)]);
    expect(totalProbability(result).equals(Rational.ONE)).toBe(true);
  });
});

describe('buildCdfTable / cdfAt', () => {
  it('cdfAt matches hand-computed cumulative values for a d4, including below/above support', () => {
    const d4 = uniformDie(4, 1);
    const table = buildCdfTable(d4);
    expect(cdfAt(table, 0n).equals(Rational.ZERO)).toBe(true); // below support
    expect(cdfAt(table, 1n).equals(ratOf(1, 4))).toBe(true);
    expect(cdfAt(table, 2n).equals(ratOf(2, 4))).toBe(true);
    expect(cdfAt(table, 3n).equals(ratOf(3, 4))).toBe(true);
    expect(cdfAt(table, 4n).equals(Rational.ONE)).toBe(true);
    expect(cdfAt(table, 100n).equals(Rational.ONE)).toBe(true); // above support
  });

  it('cdfAt handles a value strictly between two support points (gaps in a convolved distribution)', () => {
    const d2 = uniformDie(2, 1);
    const sum = convolve(d2, d2); // support {2,3,4}
    const table = buildCdfTable(sum);
    expect(cdfAt(table, 2n).equals(ratOf(1, 4))).toBe(true);
    expect(cdfAt(table, 3n).equals(ratOf(3, 4))).toBe(true);
  });
});

describe('expectedValue', () => {
  it('E[d4] = 2.5 (the textbook value), exactly as a rational', () => {
    expect(expectedValue(uniformDie(4, 1)).equals(ratOf(5, 2))).toBe(true);
  });

  it('E[-d4] = -2.5', () => {
    expect(expectedValue(uniformDie(4, -1)).equals(ratOf(-5, 2))).toBe(true);
  });
});

describe('winProbabilities — Brief §9/§35: exact, sums to exactly 1, matches brute-force enumeration', () => {
  function bruteForceWinProbabilities(options: readonly { id: string; dist: Distribution }[]): Map<string, Rational> {
    // Ground truth: enumerate the full joint support directly (only used in
    // tests, on small dice, to validate the closed-form algorithm — not a
    // suggestion that production code should ever do this).
    const supports = options.map((o) => [...o.dist.pmf.entries()]);
    const totals = new Map<string, Rational>(options.map((o) => [o.id, Rational.ZERO]));

    function recurse(idx: number, chosen: { id: string; value: bigint; p: Rational }[]): void {
      if (idx === options.length) {
        const maxValue = chosen.reduce((m, c) => (c.value > m ? c.value : m), chosen[0].value);
        const winners = chosen.filter((c) => c.value === maxValue);
        const jointP = chosen.reduce((acc, c) => acc.mul(c.p), Rational.ONE);
        const share = jointP.div(ratOf(winners.length));
        for (const w of winners) {
          totals.set(w.id, (totals.get(w.id) ?? Rational.ZERO).add(share));
        }
        return;
      }
      for (const [value, p] of supports[idx]) {
        recurse(idx + 1, [...chosen, { id: options[idx].id, value, p }]);
      }
    }
    recurse(0, []);
    return totals;
  }

  it('two-option case (K=2) matches brute-force enumeration exactly, d4 vs d6', () => {
    const options = [
      { id: 'A', dist: uniformDie(4, 1) },
      { id: 'B', dist: uniformDie(6, 1) },
    ];
    const exact = winProbabilities(options);
    const brute = bruteForceWinProbabilities(options);
    for (const o of options) {
      expect(exact.get(o.id)!.equals(brute.get(o.id)!)).toBe(true);
    }
    const sum = [...exact.values()].reduce((acc, p) => acc.add(p), Rational.ZERO);
    expect(sum.equals(Rational.ONE)).toBe(true);
  });

  it('two-option case collapses to the textbook closed form P_i = Σ pmf_i(v)·CDF_other(v-1) + ½Σ pmf_i(v)·pmf_other(v)', () => {
    const distA = uniformDie(4, 1);
    const distB = uniformDie(6, 1);
    const options = [
      { id: 'A', dist: distA },
      { id: 'B', dist: distB },
    ];
    const exact = winProbabilities(options);
    const tableB = buildCdfTable(distB);
    let handComputed = Rational.ZERO;
    for (const v of support(distA)) {
      const pv = pmfAt(distA, v);
      handComputed = handComputed.add(pv.mul(cdfAt(tableB, v - 1n)));
      handComputed = handComputed.add(pv.mul(pmfAt(distB, v)).div(ratOf(2)));
    }
    expect(exact.get('A')!.equals(handComputed)).toBe(true);
  });

  it('three-option case (K=3) matches brute-force enumeration exactly and sums to exactly 1', () => {
    const options = [
      { id: 'A', dist: uniformDie(4, 1) },
      { id: 'B', dist: uniformDie(4, 1) }, // identical distribution to A on purpose — exercises real 3-way ties
      { id: 'C', dist: uniformDie(6, 1) },
    ];
    const exact = winProbabilities(options);
    const brute = bruteForceWinProbabilities(options);
    for (const o of options) {
      expect(exact.get(o.id)!.equals(brute.get(o.id)!)).toBe(true);
    }
    const sum = [...exact.values()].reduce((acc, p) => acc.add(p), Rational.ZERO);
    expect(sum.equals(Rational.ONE)).toBe(true);
  });

  it('identical distributions split win probability exactly evenly (pure tie-share sanity check)', () => {
    const options = [
      { id: 'A', dist: uniformDie(6, 1) },
      { id: 'B', dist: uniformDie(6, 1) },
    ];
    const exact = winProbabilities(options);
    expect(exact.get('A')!.equals(ratOf(1, 2))).toBe(true);
    expect(exact.get('B')!.equals(ratOf(1, 2))).toBe(true);
  });

  it('a single option wins with probability exactly 1', () => {
    const exact = winProbabilities([{ id: 'only', dist: uniformDie(8, 1) }]);
    expect(exact.get('only')!.equals(Rational.ONE)).toBe(true);
  });

  it('an overwhelmingly stronger option (large positive die vs. a small negative die) wins with probability 1', () => {
    // A always rolls in [+1,+12]; B always rolls in [-4,-1] — A's minimum
    // strictly exceeds B's maximum, so A wins with certainty.
    const options = [
      { id: 'A', dist: uniformDie(12, 1) },
      { id: 'B', dist: uniformDie(4, -1) },
    ];
    const exact = winProbabilities(options);
    expect(exact.get('A')!.equals(Rational.ONE)).toBe(true);
    expect(exact.get('B')!.equals(Rational.ZERO)).toBe(true);
  });

  it('winProbabilities of a convolved (multi-influence) option still sums to exactly 1 against a single-die option', () => {
    const options = [
      { id: 'multi', dist: convolveAll([uniformDie(6, 1), uniformDie(8, 1)]) },
      { id: 'single', dist: uniformDie(10, 1) },
    ];
    const exact = winProbabilities(options);
    const sum = [...exact.values()].reduce((acc, p) => acc.add(p), Rational.ZERO);
    expect(sum.equals(Rational.ONE)).toBe(true);
  });
});
