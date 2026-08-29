import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import {
  initialExpectation,
  updateExpectation,
  confidence,
  decayedPrecision,
  NeedExpectationParams,
} from '../model/expectation';

const params: NeedExpectationParams = {
  lambdaQ: ratOf(1, 10),
  rho0: ratOf(2),
  sigma: ratOf(1),
  rhoMin: ratOf(1, 10),
  rhoMax: ratOf(20),
  kC: ratOf(3),
};

describe('NeedExpectation update — Brief §12 / §32 proof obligations', () => {
  it('prediction-error equivalence: mu\' = mu + alpha*(r - mu)', () => {
    const prior = { mu: ratOf(3, 10), tau: ratOf(5), lastUpdatedAt: 0 };
    const deltaT = ratOf(2);
    const rho = ratOf(4);
    const r = ratOf(7, 10);

    const { next, alpha, tauMinus } = updateExpectation(prior, params, deltaT, rho, r, 1);

    // Directly verify tau- matches the decay formula.
    expect(tauMinus.equals(decayedPrecision(prior.tau, params.lambdaQ, deltaT))).toBe(true);

    // Precision-weighted form vs. prediction-error form must agree exactly
    // (both computed here in exact rational arithmetic, before lattice
    // quantization, since §32 requires *algebraic* equivalence).
    const expectedAlpha = rho.div(tauMinus.add(rho));
    expect(alpha.equals(expectedAlpha)).toBe(true);

    const predictionErrorForm = prior.mu.add(alpha.mul(r.sub(prior.mu)));
    // next.mu is quantized; predictionErrorForm is exact. They must agree
    // to within the quantization bound.
    const diff = next.mu.sub(predictionErrorForm).abs();
    expect(diff.lte(ratOf(1, 1_000_000))).toBe(true); // <= 1/D
  });

  it('confidence stays in [0, 1) for any finite non-negative precision', () => {
    for (const tau of [ratOf(0), ratOf(1, 100), ratOf(5), ratOf(1_000_000)]) {
      const c = confidence(tau, params.kC);
      expect(c.gte(Rational.ZERO)).toBe(true);
      expect(c.lt(Rational.ONE)).toBe(true);
    }
  });

  it('confidence increases monotonically with accumulated precision', () => {
    let state = initialExpectation(0);
    let lastConfidence = confidence(state.tau, params.kC);
    for (let i = 0; i < 5; i++) {
      const { next } = updateExpectation(state, params, ratOf(1), ratOf(2), ratOf(4, 10), i + 1);
      const c = confidence(next.tau, params.kC);
      expect(c.gt(lastConfidence) || c.equals(lastConfidence)).toBe(true);
      lastConfidence = c;
      state = next;
    }
  });

  it('a highly reinforced expectation resists a single contradictory observation more than a fresh one', () => {
    // Simulate many consistent observations first.
    let reinforced = initialExpectation(0);
    for (let i = 0; i < 20; i++) {
      reinforced = updateExpectation(reinforced, params, ratOf(1), ratOf(2), ratOf(9, 10), i).next;
    }
    const fresh = initialExpectation(0);

    // Now apply one sharply contradictory observation (r = -1) to both.
    const reinforcedAfter = updateExpectation(reinforced, params, ratOf(1), ratOf(2), ratOf(-1), 21).next;
    const freshAfter = updateExpectation(fresh, params, ratOf(1), ratOf(2), ratOf(-1), 21).next;

    const reinforcedShift = reinforced.mu.sub(reinforcedAfter.mu).abs();
    const freshShift = fresh.mu.sub(freshAfter.mu).abs();

    expect(reinforcedShift.lt(freshShift)).toBe(true);
  });
});
