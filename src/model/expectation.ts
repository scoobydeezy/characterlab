/**
 * Learned Need-satisfaction expectations, per Brief §12.
 *
 * For semantic subject x and Need n: NeedExpectation(x,n) = { μ_xn, τ_xn,
 * LastUpdatedAt }. μ means "expected effect of x on Need n." τ is
 * accumulated evidence (precision). Unobserved (x,n) pairs default to
 * μ=0, τ=0 — "no effect, no evidence" — which is also why an Action whose
 * subject has never been experienced contributes exactly 0 to Score(a)
 * (kernel property, not a special case; see model/actions.ts).
 */

import { Rational } from '../kernel/rational';
import { quantize, D } from '../kernel/lattice';

export interface NeedExpectationParams {
  /** λ_q — precision decay rate per unit time. */
  readonly lambdaQ: Rational;
  /** ρ_0 — base observation precision. */
  readonly rho0: Rational;
  /** σ — sensitivity of observation precision to current motivational
   * salience (K_n·U_n). */
  readonly sigma: Rational;
  readonly rhoMin: Rational;
  readonly rhoMax: Rational;
  /** K_C — confidence half-saturation constant. */
  readonly kC: Rational;
}

export interface NeedExpectation {
  readonly mu: Rational;
  readonly tau: Rational;
  readonly lastUpdatedAt: number;
}

export function initialExpectation(occurredAt: number): NeedExpectation {
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

/**
 * ρ_n = Clamp(ρ_0·[1 + σ·K_n·U_n], ρ_min, ρ_max)
 *
 * An observation carries more precision when it happens under high
 * motivational salience (important, urgent Need) — §12.
 */
export function observationPrecision(
  params: NeedExpectationParams,
  coreImportance: Rational,
  urgency: Rational,
): Rational {
  const raw = params.rho0.mul(Rational.ONE.add(params.sigma.mul(coreImportance).mul(urgency)));
  return raw.clamp(params.rhoMin, params.rhoMax);
}

export interface ExpectationUpdateResult {
  readonly next: NeedExpectation;
  /** α = ρ / (τ⁻ + ρ) — exposed so tests can verify the prediction-error
   * equivalence μ' = μ + α(r − μ) directly against the precision-weighted
   * form (Brief §32 "Prediction-error equivalence"). Note: for a REJECTED
   * censored update (see EvidenceKind below), alpha still reports the
   * weight the naive candidate would have used — it does not mean "μ
   * actually moved by α(r-μ)" in that case. */
  readonly alpha: Rational;
  readonly tauMinus: Rational;
  /** True when a censored bound carried no information the current belief
   * didn't already have — μ stays at its prior value AND τ stays at its
   * (merely decayed) τ⁻, gaining nothing from this observation. Always
   * false for 'point' evidence. See the "Correction 2" revision of Phase
   * 2.5a's original rule below: an earlier version of this function still
   * grew τ on a rejected bound, which is the bug this revision fixes. */
  readonly censoredRejected: boolean;
}

/**
 * Phase 2.5a — Brief §19/§27's censored-evidence classification. A
 * realized Need effect that was clipped by `applyBoundedEffect` is not a
 * point observation of the satisfier's true effect: a ceiling-clipped
 * ('lower_bound') effect only proves the truth was AT LEAST what was
 * applied; a floor-clipped ('upper_bound') effect only proves the truth
 * was AT MOST what was applied. 'point' (unsaturated) effects are
 * unchanged — full, exact information as always.
 */
export type EvidenceKind = 'point' | 'lower_bound' | 'upper_bound';

/**
 * Precision-weighted belief update (§12), extended in Phase 2.5a with an
 * exact, non-Gaussian one-sided censored-update rule (§19/§27), REVISED
 * ("Correction 2" in RESEARCH.md's Phase 2.5a entry — post-2.5c review) to
 * fix a real bug the original rule had: growing τ on every observation,
 * accepted or rejected, even when a rejected observation is by definition
 * uninformative (it contradicted nothing — the current belief already
 * satisfies the bound). Selected by `evidenceKind` (defaults to 'point' —
 * every pre-2.5 call site, and every 'point' call site regardless of phase,
 * is byte-for-byte unaffected by any of this):
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
 *                                                                from it —
 *                                                                Brief §27)
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
 * regrowing exactly the artificial-confidence bug this revision exists to
 * remove, just relocated to the boundary case instead of the interior. See
 * RESEARCH.md's Phase 2.5a Correction section (point 1) for the original
 * bug report and the four validation Cases A-D this revision was built to
 * satisfy, and `phase2_5aRepresentation.test.ts` for those cases encoded as
 * tests.
 *
 * This remains a deliberate exact simplification of literal truncated-normal
 * inference (which would need the transcendental normal CDF, incompatible
 * with the exact-rational-arithmetic contract) — not offered as the one
 * true Bayesian answer, exactly as `associations.ts` documents its own
 * self-association-exclusion as a deliberate simplification. An accepted
 * (informative) bound still grows τ by the full ρ, exactly as a point
 * observation would — over-crediting precision somewhat relative to a
 * literal censored-likelihood treatment, which is the specific,
 * already-documented corner this build cuts to stay exact-rational; what
 * this revision fixes is strictly the OTHER corner (an uninformative bound
 * wrongly credited with any precision at all), not that one. The result is
 * still monotonic and deterministic: a censored observation can never move
 * μ to the wrong side of what it actually proves, and can never manufacture
 * confidence from evidence that didn't discriminate. Both μ' and τ' are
 * quantized onto the lattice at commit (§5.2, §6).
 */
export function updateExpectation(
  prior: NeedExpectation,
  params: NeedExpectationParams,
  deltaT: Rational,
  observationRho: Rational,
  actualResult: Rational,
  occurredAt: number,
  evidenceKind: EvidenceKind = 'point',
): ExpectationUpdateResult {
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
    // precision at its merely-decayed tau-minus (Correction 2: the original
    // rule grew tau here too, manufacturing confidence from a non-
    // discriminating observation).
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
 * C_xn = τ_xn / (τ_xn + K_C)
 *
 * Confidence and expectation remain different quantities: μ can be large
 * with low confidence (one extreme observation) or small with high
 * confidence (consistently near-zero effect).
 */
export function confidence(tau: Rational, kC: Rational): Rational {
  return tau.div(tau.add(kC));
}
