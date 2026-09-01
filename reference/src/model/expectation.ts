/**
 * Learned Need-satisfaction expectations, per Brief §12.
 *
 * For semantic subject x and Need n: NeedExpectation(x,n) = { μ_xn, τ_xn,
 * LastUpdatedAt }. μ means "expected effect of x on Need n." τ is
 * accumulated evidence (precision). Unobserved (x,n) pairs default to
 * μ=0, τ=0 — "no effect, no evidence" — which is also why an Action whose
 * subject has never been experienced contributes exactly 0 to Score(a)
 * (kernel property, not a special case; see model/actions.ts).
 *
 * Decision 10 of the Phase 3 Implementation Plan: the generic (μ, τ)
 * precision-weighted update core this module used to define directly has
 * been relocated to `model/estimate.ts` as `EvidentialEstimate` /
 * `EstimateParams` / `updateEstimate` / `estimateConfidence`. This module
 * is now a thin, Need-flavored wrapper over that generic core —
 * `NeedExpectation`, `NeedExpectationParams`, `initialExpectation`,
 * `updateExpectation`, and `confidence` below are aliases / re-exports
 * with zero behavior change relative to the pre-Phase-3 version of this
 * file. The one thing that stays genuinely defined here, rather than
 * moving to `estimate.ts`, is `observationPrecision`: the §12 formula
 * ρ_n = Clamp(ρ_0·[1 + σ·K_n·U_n], ρ_min, ρ_max) is Need-specific plumbing
 * that *produces* the observation precision `updateExpectation` consumes
 * (via `coreImportance`/`urgency` — motivational salience), not part of
 * the generic estimate core itself.
 */

import { Rational } from '../kernel/rational';
import {
  EstimateParams,
  EstimateUpdateResult,
  EvidenceKind,
  EvidentialEstimate,
  decayedPrecision,
  estimateConfidence,
  initialEstimate,
  precisionDecayFactor,
  updateEstimate,
} from './estimate';

export type { EvidenceKind };
export { decayedPrecision, precisionDecayFactor };

export interface NeedExpectationParams extends EstimateParams {
  /** λ_q — precision decay rate per unit time. (Inherited from
   * EstimateParams; restated here for doc locality.) */
  readonly lambdaQ: Rational;
  /** ρ_0 — base observation precision. */
  readonly rho0: Rational;
  /** σ — sensitivity of observation precision to current motivational
   * salience (K_n·U_n). */
  readonly sigma: Rational;
  readonly rhoMin: Rational;
  readonly rhoMax: Rational;
  /** K_C — confidence half-saturation constant. (Inherited from
   * EstimateParams; restated here for doc locality.) */
  readonly kC: Rational;
}

/** Alias: a NeedExpectation is exactly an EvidentialEstimate, specialized
 * by usage (subject x, Need n) rather than by shape. */
export type NeedExpectation = EvidentialEstimate;

export const initialExpectation = initialEstimate;

/**
 * ρ_n = Clamp(ρ_0·[1 + σ·K_n·U_n], ρ_min, ρ_max)
 *
 * An observation carries more precision when it happens under high
 * motivational salience (important, urgent Need) — §12. This is genuinely
 * Need-specific (unlike the generic core in estimate.ts): it is the
 * function that *produces* the `observationRho` argument `updateExpectation`
 * consumes.
 */
export function observationPrecision(
  params: NeedExpectationParams,
  coreImportance: Rational,
  urgency: Rational,
): Rational {
  const raw = params.rho0.mul(Rational.ONE.add(params.sigma.mul(coreImportance).mul(urgency)));
  return raw.clamp(params.rhoMin, params.rhoMax);
}

/** Alias: identical shape to EstimateUpdateResult, kept under its
 * original name for any call site that names the type explicitly. */
export type ExpectationUpdateResult = EstimateUpdateResult;

export const updateExpectation = updateEstimate;

export const confidence = estimateConfidence;
