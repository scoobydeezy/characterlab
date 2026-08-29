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
   * form (Brief §32 "Prediction-error equivalence"). */
  readonly alpha: Rational;
  readonly tauMinus: Rational;
}

/**
 * Precision-weighted belief update (§12):
 *
 *   τ⁻  = δ_q(Δt)·τ
 *   μ'  = (τ⁻·μ + ρ·r) / (τ⁻ + ρ)
 *   τ'  = τ⁻ + ρ
 *
 * Both μ' and τ' are quantized onto the lattice at commit (§5.2, §6).
 */
export function updateExpectation(
  prior: NeedExpectation,
  params: NeedExpectationParams,
  deltaT: Rational,
  observationRho: Rational,
  actualResult: Rational,
  occurredAt: number,
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
    };
  }
  const muRaw = tauMinus.mul(prior.mu).add(observationRho.mul(actualResult)).div(denom);
  const tauRaw = denom;
  const alpha = observationRho.div(denom);

  const { value: mu } = quantize(muRaw, D);
  const { value: tau } = quantize(tauRaw, D);

  return { next: { mu, tau, lastUpdatedAt: occurredAt }, alpha, tauMinus };
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
