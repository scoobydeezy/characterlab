/**
 * Generic precision-weighted evidential-estimate core.
 *
 * Decision 10 of the Phase 3 Implementation Plan: this module is a
 * mechanical relocation (not a rewrite) of the (μ, τ, lastUpdatedAt) shape
 * and the `updateExpectation`/`confidence` math that used to live directly
 * in `model/expectation.ts`. That math was already fully generic over what
 * `mu` and `tau` mean — nothing in it ever referenced `NeedId` or anything
 * Need-specific; it takes a prior estimate, decay/confidence params, an
 * elapsed time, an already-computed observation precision, an observed
 * result, and an `EvidenceKind`, and returns a next `(mu, tau)`.
 *
 * `model/expectation.ts` now re-exports `NeedExpectation`,
 * `NeedExpectationParams`, `initialExpectation`, `updateExpectation`, and
 * `confidence` as thin aliases over this module, so every pre-existing call
 * site is unaffected. Phase 3's `model/belief.ts` (`BeliefLikelihood`,
 * `OutcomeMagnitudeBelief`) and `model/relief.ts` (`ReliefExpectation`)
 * define their own aliases over this same core the same way — the point
 * of this relocation is that belief/severity/relief state no longer has
 * to be typed as literally `NeedExpectation` just because the shape
 * matches (Phase 3 Implementation Plan, Decision 10).
 *
 * No math changes relative to the pre-Phase-3 `model/expectation.ts`.
 */

import { Rational } from '../kernel/rational';
import { quantize, D } from '../kernel/lattice';

export interface EstimateParams {
  /** λ_q — precision decay rate per unit time. */
  readonly lambdaQ: Rational;
  /** K_C — confidence half-saturation constant. */
  readonly kC: Rational;
}

export interface EvidentialEstimate {
  readonly mu: Rational;
  readonly tau: Rational;
  readonly lastUpdatedAt: number;
}

export function initialEstimate(occurredAt: number): EvidentialEstimate {
  return { mu: Rational.ZERO, tau: Rational.ZERO, lastUpdatedAt: occurredAt };
}

/**
 * δ_q(Δt) = 1 / (1 + λ_q·Δt)
 */
export function precisionDecayFactor(lambdaQ: Rational, deltaT: Rational): Rational {
  return Rational.ONE.div(Rational.ONE.add(lambdaQ.mul(deltaT)));
}

/** τ⁻ = δ_q(Δt)·τ — precision after passive decay, before new evidence. */
export function decayedPrecision(tau: Rational, lambdaQ: Rational, deltaT: Rational): Rational {
  return precisionDecayFactor(lambdaQ, deltaT).mul(tau);
}

export interface EstimateUpdateResult {
  readonly next: EvidentialEstimate;
  /** α = ρ / (τ⁻ + ρ) — exposed so tests can verify the prediction-error
   * equivalence μ' = μ + α(r − μ) directly against the precision-weighted
   * form. Note: for a REJECTED censored update (see EvidenceKind below),
   * alpha still reports the weight the naive candidate would have used —
   * it does not mean "μ actually moved by α(r-μ)" in that case. */
  readonly alpha: Rational;
  readonly tauMinus: Rational;
  /** True when a censored bound carried no information the current belief
   * didn't already have — μ stays at its prior value AND τ stays at its
   * (merely decayed) τ⁻, gaining nothing from this observation. Always
   * false for 'point' evidence. */
  readonly censoredRejected: boolean;
}

/**
 * Censored-evidence classification (originally Phase 2.5a, Brief §19/§27).
 * A realized effect that was clipped by a bounding process is not a point
 * observation of the true effect: a ceiling-clipped ('lower_bound') effect
 * only proves the truth was AT LEAST what was applied; a floor-clipped
 * ('upper_bound') effect only proves the truth was AT MOST what was
 * applied. 'point' (unclipped) effects are unchanged — full, exact
 * information as always.
 */
export type EvidenceKind = 'point' | 'lower_bound' | 'upper_bound';

/**
 * Precision-weighted belief update, with an exact, non-Gaussian one-sided
 * censored-update rule (originally Phase 2.5a, "Correction 2" in
 * RESEARCH.md's Phase 2.5a entry — post-2.5c review, fixing a real bug the
 * original rule had: growing τ on every observation, accepted or rejected,
 * even when a rejected observation is by definition uninformative — it
 * contradicted nothing, since the current belief already satisfies the
 * bound). Selected by `evidenceKind` (defaults to 'point' — every pre-2.5
 * call site, and every 'point' call site regardless of phase, is
 * byte-for-byte unaffected by any of this):
 *
 *   τ⁻  = δ_q(Δt)·τ
 *   μ_naive = (τ⁻·μ + ρ·r) / (τ⁻ + ρ)
 *
 *   'point':       μ' = μ_naive              always            τ' = τ⁻ + ρ
 *   'lower_bound': μ' = μ_naive               if μ_naive > μ    τ' = τ⁻ + ρ
 *                                                                (INFORMATIVE
 *                                                                — the bound
 *                                                                proves the
 *                                                                truth is
 *                                                                strictly
 *                                                                higher than
 *                                                                we believed;
 *                                                                treated
 *                                                                exactly like
 *                                                                a point
 *                                                                observation)
 *                  μ' = μ (REJECTED)          otherwise         τ' = τ⁻
 *                                                                (UNINFORMATIVE
 *                                                                — "the truth
 *                                                                is at least
 *                                                                r" when
 *                                                                r <= μ proves
 *                                                                nothing the
 *                                                                current
 *                                                                belief didn't
 *                                                                already
 *                                                                establish, so
 *                                                                confidence
 *                                                                must not grow
 *                                                                from it)
 *   'upper_bound': μ' = μ_naive               if μ_naive < μ    τ' = τ⁻ + ρ
 *                                                                (symmetric)
 *                  μ' = μ (REJECTED)          otherwise         τ' = τ⁻
 *
 * The strict inequality (not `>=`/`<=`) is deliberate and load-bearing, not
 * an arbitrary tie-break: an observation whose naive candidate lands EXACTLY
 * on the current μ is exactly as uninformative as one that would have pulled
 * μ the wrong way — both are "consistent with, but not more specific than,
 * what I already believed." Without the strict inequality, a long run of
 * IDENTICAL repeated bounds (e.g. "effect >= 0.10" observed many times once
 * μ has already reached 0.10) would keep landing exactly on μ and, under a
 * non-strict `>=`, would count as "accepted" every time — silently
 * regrowing exactly the artificial-confidence bug this rule exists to
 * remove, just relocated to the boundary case instead of the interior. See
 * RESEARCH.md's Phase 2.5a Correction section (point 1) for the original
 * bug report and the four validation Cases A-D this rule was built to
 * satisfy, and `phase2_5aRepresentation.test.ts` for those cases encoded as
 * tests.
 *
 * This remains a deliberate exact simplification of literal truncated-normal
 * inference (which would need the transcendental normal CDF, incompatible
 * with the exact-rational-arithmetic contract) — not offered as the one
 * true Bayesian answer. An accepted (informative) bound still grows τ by
 * the full ρ, exactly as a point observation would — over-crediting
 * precision somewhat relative to a literal censored-likelihood treatment,
 * which is a deliberate, already-documented corner this build cuts to stay
 * exact-rational; what this rule fixes is strictly the OTHER corner (an
 * uninformative bound wrongly credited with any precision at all), not
 * that one. The result is still monotonic and deterministic: a censored
 * observation can never move μ to the wrong side of what it actually
 * proves, and can never manufacture confidence from evidence that didn't
 * discriminate. Both μ' and τ' are quantized onto the lattice at commit.
 */
export function updateEstimate(
  prior: EvidentialEstimate,
  params: EstimateParams,
  deltaT: Rational,
  observationRho: Rational,
  actualResult: Rational,
  occurredAt: number,
  evidenceKind: EvidenceKind = 'point',
): EstimateUpdateResult {
  const tauMinus = decayedPrecision(prior.tau, params.lambdaQ, deltaT);
  const denom = tauMinus.add(observationRho);
  if (denom.isZero()) {
    // No prior evidence and zero-precision observation: nothing to learn
    // from; leave the expectation at its (decayed) prior.
    const { value: muQ } = quantize(prior.mu, D);
    const { value: tauQ } = quantize(tauMinus, D);
    return {
      next: { mu: muQ, tau: tauQ, lastUpdatedAt: occurredAt },
      alpha: Rational.ZERO,
      tauMinus,
      censoredRejected: false,
    };
  }
  const muNaive = tauMinus.mul(prior.mu).add(observationRho.mul(actualResult)).div(denom);
  const alpha = observationRho.div(denom);

  // Default: informative evidence (every 'point' observation, and any
  // 'lower_bound'/'upper_bound' observation that strictly contradicts the
  // current belief) is accepted and grows precision by the full ρ, exactly
  // like an ordinary point observation.
  let muRaw = muNaive;
  let tauRaw = denom;
  let censoredRejected = false;

  if (evidenceKind === 'lower_bound' && !muNaive.gt(prior.mu)) {
    // Uninformative: "the truth is at least r" with r <= mu contradicts
    // nothing already believed — reject the mean change AND freeze
    // precision at its merely-decayed tau-minus (an earlier rule grew tau
    // here too, manufacturing confidence from a non-discriminating
    // observation; this is the fix).
    muRaw = prior.mu;
    tauRaw = tauMinus;
    censoredRejected = true;
  } else if (evidenceKind === 'upper_bound' && !muNaive.lt(prior.mu)) {
    muRaw = prior.mu;
    tauRaw = tauMinus;
    censoredRejected = true;
  }

  const { value: mu } = quantize(muRaw, D);
  const { value: tau } = quantize(tauRaw, D);

  return { next: { mu, tau, lastUpdatedAt: occurredAt }, alpha, tauMinus, censoredRejected };
}

/**
 * C = τ / (τ + K_C)
 *
 * Confidence and the estimate itself remain different quantities: μ can be
 * large with low confidence (one extreme observation) or small with high
 * confidence (consistently near-zero effect).
 */
export function estimateConfidence(tau: Rational, kC: Rational): Rational {
  return tau.div(tau.add(kC));
}
