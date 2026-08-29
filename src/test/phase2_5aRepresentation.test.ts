import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import { quantize, D } from '../kernel/lattice';
import { updateExpectation, decayedPrecision, NeedExpectationParams, NeedExpectation } from '../model/expectation';

/**
 * Phase 2.5a's open representation question, resolved (post-2.5c review):
 * is `(μ, τ)` a sufficient representation for both point evidence and
 * one-sided (`lower_bound`/`upper_bound`) evidence, or does `NeedExpectation`
 * need a richer representation that keeps confidence-in-a-point-estimate and
 * confidence-in-an-inequality-constraint as distinct quantities?
 *
 * This file encodes the four validation Cases A-D that RESEARCH.md's Phase
 * 2.5a Correction section specified as the concrete next step, run against
 * `updateExpectation`'s Correction 2 revision (see that function's doc
 * comment in model/expectation.ts). All four pass under the corrected
 * gating logic alone — τ freezes at τ⁻ (no growth) whenever a censored bound
 * is uninformative (its naive candidate does not *strictly* move past the
 * current μ in the bound's direction), and grows exactly as a point
 * observation would otherwise. No richer representation (a separate
 * Mean/PointPrecision pair plus accumulated LowerBoundEvidence/
 * UpperBoundEvidence state) was needed: the finding is that `(μ, τ)` WAS
 * sufficient all along — the bug was in the informativeness *gate*, not in
 * what the representation itself could express.
 */

const params: NeedExpectationParams = {
  lambdaQ: ratOf(0), // no passive decay — isolates the gating logic itself, not decay's interaction with it
  rho0: ratOf(2),
  sigma: ratOf(1),
  rhoMin: ratOf(1, 10),
  rhoMax: ratOf(20),
  kC: ratOf(3),
};

function quantized(r: Rational): Rational {
  return quantize(r, D).value;
}

describe('Phase 2.5a Correction 2 — the four validation Cases A-D', () => {
  it('Case A — established belief, weak lower bound: must NOT raise confidence in 0.40 at all', () => {
    // High-precision established belief.
    const established: NeedExpectation = { mu: ratOf(40, 100), tau: ratOf(50), lastUpdatedAt: 0 };
    const rho = ratOf(2);
    const weakBound = ratOf(10, 100); // "effect >= 0.10" — well below the established 0.40

    const result = updateExpectation(established, params, Rational.ZERO, rho, weakBound, 1, 'lower_bound');

    // Fails to contradict the belief — must not reinforce it either.
    expect(result.next.mu.equals(established.mu)).toBe(true);
    expect(result.censoredRejected).toBe(true);
    const tauMinus = decayedPrecision(established.tau, params.lambdaQ, Rational.ZERO);
    expect(result.next.tau.equals(quantized(tauMinus))).toBe(true); // exactly no growth, not merely "not material"
  });

  it('Case B — belief inconsistent with the bound: the model MUST update', () => {
    const establishedLow: NeedExpectation = { mu: ratOf(5, 100), tau: ratOf(50), lastUpdatedAt: 0 };
    const rho = ratOf(2);
    const informativeBound = ratOf(10, 100); // "effect >= 0.10" — strictly above the established 0.05

    const result = updateExpectation(establishedLow, params, Rational.ZERO, rho, informativeBound, 1, 'lower_bound');

    expect(result.censoredRejected).toBe(false);
    expect(result.next.mu.gt(establishedLow.mu)).toBe(true);
    const tauMinus = decayedPrecision(establishedLow.tau, params.lambdaQ, Rational.ZERO);
    expect(result.next.tau.gt(quantized(tauMinus))).toBe(true); // genuinely grows — this IS discriminating evidence
  });

  it('Case C — zero-information saturation: essentially (here, exactly) no change in confidence', () => {
    // Need already at its ceiling: Applied=0, i.e. "effect >= 0" — true of
    // every non-negative real number, so it can never discriminate against
    // any non-negative belief.
    const zeroPrior: NeedExpectation = { mu: Rational.ZERO, tau: Rational.ZERO, lastUpdatedAt: 0 };
    const rho = ratOf(2);
    const zeroFloor = Rational.ZERO;

    const result = updateExpectation(zeroPrior, params, Rational.ZERO, rho, zeroFloor, 1, 'lower_bound');
    expect(result.next.mu.isZero()).toBe(true);
    expect(result.censoredRejected).toBe(true);
    expect(result.next.tau.isZero()).toBe(true); // no confidence manufactured from a wholly uninformative observation

    // The same holds once a real positive belief is already established —
    // "effect >= 0" remains uninformative against ANY non-negative mu.
    const establishedPositive: NeedExpectation = { mu: ratOf(3, 10), tau: ratOf(20), lastUpdatedAt: 0 };
    const result2 = updateExpectation(establishedPositive, params, Rational.ZERO, rho, zeroFloor, 1, 'lower_bound');
    expect(result2.next.mu.equals(establishedPositive.mu)).toBe(true);
    expect(result2.censoredRejected).toBe(true);
    expect(result2.next.tau.equals(quantized(decayedPrecision(establishedPositive.tau, params.lambdaQ, Rational.ZERO)))).toBe(true);
  });

  it('Case D — genuine evidence after a long censored history: accumulated (previously unjustified) precision must not suppress how much a new genuine observation moves the belief', () => {
    const rho = ratOf(2);
    const bound = ratOf(10, 100);
    const REPETITIONS = 6;

    // A long run of IDENTICAL "effect >= 0.10" observations from a fresh
    // prior, run through the CORRECTED rule. The first is genuinely
    // informative (fresh prior mu=0 < 0.10); every subsequent identical one
    // is NOT — it lands exactly on the mu the first one already
    // established, which Correction 2 classifies as uninformative (see
    // expectation.test.ts's boundary-case test).
    let corrected: NeedExpectation = { mu: Rational.ZERO, tau: Rational.ZERO, lastUpdatedAt: 0 };
    const correctedTauAfterEachStep: Rational[] = [];
    for (let i = 0; i < REPETITIONS; i++) {
      corrected = updateExpectation(corrected, params, Rational.ZERO, rho, bound, i + 1, 'lower_bound').next;
      correctedTauAfterEachStep.push(corrected.tau);
    }
    // tau grows once (the first, genuinely informative observation) and then
    // PLATEAUS — it must not keep climbing on every subsequent identical,
    // non-discriminating repeat.
    expect(correctedTauAfterEachStep[0].gt(Rational.ZERO)).toBe(true);
    for (let i = 1; i < correctedTauAfterEachStep.length; i++) {
      expect(correctedTauAfterEachStep[i].equals(correctedTauAfterEachStep[0])).toBe(true);
    }
    expect(corrected.tau.equals(rho)).toBe(true); // plateaued at exactly one observation's worth of precision

    // The SAME repeated run through the OLD (pre-Correction-2) unconditional-
    // growth rule, reproduced inline for comparison (not re-imported — the
    // buggy behavior no longer exists in the codebase to call): tau grows by
    // rho on EVERY repetition, accepted or not, since the old rule never
    // froze tau on rejection.
    let buggy: NeedExpectation = { mu: Rational.ZERO, tau: Rational.ZERO, lastUpdatedAt: 0 };
    for (let i = 0; i < REPETITIONS; i++) {
      const tauMinus = decayedPrecision(buggy.tau, params.lambdaQ, Rational.ZERO);
      const denom = tauMinus.add(rho);
      const muNaive = tauMinus.mul(buggy.mu).add(rho.mul(bound)).div(denom);
      const muRaw = muNaive.lt(buggy.mu) ? buggy.mu : muNaive; // old rule: reject (mu only) on strict decrease
      buggy = { mu: quantized(muRaw), tau: quantized(denom), lastUpdatedAt: i + 1 }; // old rule: tau always grows
    }
    expect(buggy.tau.equals(quantized(rho.mul(ratOf(REPETITIONS))))).toBe(true); // grew every single repetition — the bug

    // Now apply the SAME genuine, unclipped 'point' observation of the true
    // effect to both trajectories.
    const trueEffect = ratOf(42, 100);
    const pointRho = ratOf(2);
    const correctedAfter = updateExpectation(corrected, params, Rational.ZERO, pointRho, trueEffect, 10, 'point');
    const buggyAfter = updateExpectation(buggy, params, Rational.ZERO, pointRho, trueEffect, 10, 'point');

    // Because the corrected trajectory's tau stayed low (one observation's
    // worth, not six), its genuine observation carries far more weight:
    // alpha = rho / (tau + rho) is much larger for `corrected` than for the
    // artificially-inflated `buggy` trajectory.
    expect(correctedAfter.alpha.gt(buggyAfter.alpha)).toBe(true);

    // Concretely: the corrected trajectory's resulting mu lands strictly
    // closer to the true effect (0.42) than the buggy trajectory's does —
    // the buggy trajectory's artificially-inflated precision anchors it near
    // the censored-run estimate (0.10) instead, exactly the suppression
    // Case D says must not happen.
    const correctedDistance = correctedAfter.next.mu.sub(trueEffect).abs();
    const buggyDistance = buggyAfter.next.mu.sub(trueEffect).abs();
    expect(correctedDistance.lt(buggyDistance)).toBe(true);
  });

  it('sanity check: the OLD (pre-Correction-2) behavior would have failed Case A/C — tau grew on every rejected observation regardless of informativeness', () => {
    // This test documents what the bug looked like without re-implementing
    // it: reproduces the OLD unconditional-growth formula (tau' = tau- + rho
    // always, even on rejection) inline, and confirms it disagrees with the
    // corrected `updateExpectation` exactly on the uninformative cases.
    const established: NeedExpectation = { mu: ratOf(40, 100), tau: ratOf(50), lastUpdatedAt: 0 };
    const rho = ratOf(2);
    const weakBound = ratOf(10, 100);

    const tauMinus = decayedPrecision(established.tau, params.lambdaQ, Rational.ZERO);
    const oldBuggyTau = quantized(tauMinus.add(rho)); // the old rule's tau', unconditionally

    const corrected = updateExpectation(established, params, Rational.ZERO, rho, weakBound, 1, 'lower_bound');
    expect(corrected.next.tau.equals(oldBuggyTau)).toBe(false);
    expect(corrected.next.tau.lt(oldBuggyTau)).toBe(true);
  });
});
