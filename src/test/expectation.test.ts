import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import { quantize, D } from '../kernel/lattice';
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

describe('Phase 2.5a — censored-evidence update, Brief §19/§27 proof obligations', () => {
  it("'point' evidenceKind (the default) is byte-for-byte identical to the pre-2.5 update", () => {
    const prior = { mu: ratOf(3, 10), tau: ratOf(5), lastUpdatedAt: 0 };
    const withDefault = updateExpectation(prior, params, ratOf(2), ratOf(4), ratOf(-9, 10), 1);
    const withExplicitPoint = updateExpectation(prior, params, ratOf(2), ratOf(4), ratOf(-9, 10), 1, 'point');
    expect(withDefault.next.mu.equals(withExplicitPoint.next.mu)).toBe(true);
    expect(withDefault.next.tau.equals(withExplicitPoint.next.tau)).toBe(true);
    expect(withDefault.censoredRejected).toBe(false);
    expect(withExplicitPoint.censoredRejected).toBe(false);
  });

  it("'lower_bound' evidence below current mu is REJECTED: mu never decreases, and (Correction 2) tau does NOT grow either", () => {
    // Prior mu is high (0.9); the observed (clipped) result is much lower
    // (0.1) than the prior — a naive update would pull mu down sharply.
    // Because this is a ceiling-clipped observation (the truth is AT LEAST
    // 0.1, not EXACTLY 0.1), Brief §27 requires mu not move downward.
    const prior = { mu: ratOf(9, 10), tau: ratOf(5), lastUpdatedAt: 0 };
    const result = updateExpectation(prior, params, ratOf(1), ratOf(4), ratOf(1, 10), 1, 'lower_bound');
    expect(result.next.mu.equals(prior.mu)).toBe(true);
    expect(result.censoredRejected).toBe(true);
    // Correction 2 (post-2.5c review): tau must stay at the decayed prior
    // tau-minus exactly (quantized the same way updateExpectation itself
    // quantizes it — compared against the raw tauMinus directly, lattice
    // quantization could introduce a spurious mismatch), not grow — "the
    // truth is at least 0.1" is fully consistent with an existing belief of
    // 0.9 and proves nothing new, so confidence in 0.9 must not increase
    // from it. The original Phase 2.5a rule grew tau here regardless of
    // acceptance; that was the bug.
    const tauMinus = decayedPrecision(prior.tau, params.lambdaQ, ratOf(1));
    const { value: expectedTau } = quantize(tauMinus, D);
    expect(result.next.tau.equals(expectedTau)).toBe(true);
  });

  it("'lower_bound' evidence above current mu is ACCEPTED exactly like a point observation", () => {
    const prior = { mu: ratOf(1, 10), tau: ratOf(5), lastUpdatedAt: 0 };
    const asPoint = updateExpectation(prior, params, ratOf(1), ratOf(4), ratOf(9, 10), 1, 'point');
    const asLowerBound = updateExpectation(prior, params, ratOf(1), ratOf(4), ratOf(9, 10), 1, 'lower_bound');
    expect(asLowerBound.next.mu.equals(asPoint.next.mu)).toBe(true);
    expect(asLowerBound.next.tau.equals(asPoint.next.tau)).toBe(true);
    expect(asLowerBound.censoredRejected).toBe(false);
  });

  it("'upper_bound' evidence above current mu is REJECTED (symmetric case): mu never increases", () => {
    const prior = { mu: ratOf(1, 10), tau: ratOf(5), lastUpdatedAt: 0 };
    const result = updateExpectation(prior, params, ratOf(1), ratOf(4), ratOf(9, 10), 1, 'upper_bound');
    expect(result.next.mu.equals(prior.mu)).toBe(true);
    expect(result.censoredRejected).toBe(true);
  });

  it("'upper_bound' evidence below current mu is ACCEPTED exactly like a point observation", () => {
    const prior = { mu: ratOf(9, 10), tau: ratOf(5), lastUpdatedAt: 0 };
    const asPoint = updateExpectation(prior, params, ratOf(1), ratOf(4), ratOf(1, 10), 1, 'point');
    const asUpperBound = updateExpectation(prior, params, ratOf(1), ratOf(4), ratOf(1, 10), 1, 'upper_bound');
    expect(asUpperBound.next.mu.equals(asPoint.next.mu)).toBe(true);
    expect(asUpperBound.censoredRejected).toBe(false);
  });

  it('(Correction 2) a censored observation exactly equal to the current mu IS classified as a rejection — uninformative, not merely a no-op', () => {
    // Boundary case: naive candidate == prior.mu exactly. This is neither an
    // "increase" nor a "decrease," but it is still uninformative — "the
    // truth is at least 0.5" when you already believe exactly 0.5 proves
    // nothing beyond what you already believed, so it must be rejected (mu
    // unchanged AND tau frozen), not silently accepted as if it were a
    // discriminating point observation. This is the exact boundary case
    // Case D's "many identical bounds" scenario depends on: without treating
    // equality as rejection, a long run of identical repeated bounds would
    // each land exactly on the (already-updated) mu and keep being accepted,
    // regrowing tau indefinitely from observations that stopped telling you
    // anything new after the first one.
    const prior = { mu: ratOf(1, 2), tau: ratOf(0), lastUpdatedAt: 0 };
    // With tau=0 and this rho/actualResult, muNaive = actualResult exactly
    // when tauMinus is 0 — choose actualResult = prior.mu so muNaive ==
    // prior.mu exactly.
    const result = updateExpectation(prior, params, ratOf(1), ratOf(4), ratOf(1, 2), 1, 'lower_bound');
    expect(result.next.mu.equals(prior.mu)).toBe(true);
    expect(result.censoredRejected).toBe(true);
    const { value: expectedTau } = quantize(decayedPrecision(prior.tau, params.lambdaQ, ratOf(1)), D);
    expect(result.next.tau.equals(expectedTau)).toBe(true);
  });
});
