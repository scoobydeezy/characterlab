/**
 * Needs, per Brief §10.
 *
 * Each Need instance: NeedId, Origin, Level, SetPoint, CoreImportance,
 * PassiveRate. Phase 1 only instantiates Core needs (Origin: 'Core');
 * Acquired needs (§26, addiction/withdrawal) are Phase 5 and are not built
 * here — NeedOrigin already distinguishes them so Phase 5 can add
 * `origin: 'Acquired'` instances without a shape change.
 */

import { Rational } from '../kernel/rational';
import { quantize, D } from '../kernel/lattice';
import { NeedId } from '../kernel/canonical';

export type NeedOrigin = 'Core' | 'Acquired';

export interface NeedDef {
  readonly needId: NeedId;
  readonly origin: NeedOrigin;
  /** S_n — the level this Need is regulated toward. */
  readonly setPoint: Rational;
  /** K_n — how much this Need matters in general, independent of how
   * satisfied it currently is. */
  readonly coreImportance: Rational;
  /** R_n — change in Level per unit of logical time between events.
   * Typically negative (Needs decay toward 0 without intervention). */
  readonly passiveRate: Rational;
  /** p_n — authored positive integer exponent in U_n = K_n · D_n^{p_n}. */
  readonly urgencyExponent: number;
}

export interface NeedState {
  readonly needId: NeedId;
  /** L_n(t) ∈ [0, 1], stored as a lattice-quantized Rational. */
  readonly level: Rational;
}

/**
 * L_n(t+Δt) = Clamp(L_n(t) + R_n·Δt, 0, 1)
 *
 * Δt is an exact non-negative Rational (logical ticks, never wall time —
 * Brief §3.1). Result is quantized onto the lattice at commit, per the
 * Deterministic Execution Contract (§6): READ PRE-STATE → CALCULATE →
 * QUANTIZE → VALIDATE → COMMIT.
 */
export function advanceNeedLevel(state: NeedState, def: NeedDef, deltaT: Rational): NeedState {
  const raw = state.level.add(def.passiveRate.mul(deltaT));
  const clamped = raw.clamp(Rational.ZERO, Rational.ONE);
  const { value } = quantize(clamped, D);
  return { needId: state.needId, level: value };
}

/**
 * D_n = max(0, (S_n − L_n) / S_n), for S_n > 0.
 *
 * Deficit is 0 whenever the Need is at or above its set point — it does not
 * go negative for "overshoot," per the brief's max(0, ...) clamp.
 */
export function needDeficit(level: Rational, setPoint: Rational): Rational {
  if (setPoint.lte(Rational.ZERO)) {
    throw new RangeError('needDeficit: setPoint must be > 0');
  }
  const raw = setPoint.sub(level).div(setPoint);
  return raw.max(Rational.ZERO);
}

/**
 * U_n = K_n · D_n^{p_n}
 *
 * Motivation factors explicitly into "how important" (K_n) times "how
 * unsatisfied right now" (D_n), per §10.
 */
export function needUrgency(deficit: Rational, coreImportance: Rational, exponent: number): Rational {
  if (!Number.isInteger(exponent) || exponent <= 0) {
    throw new RangeError('needUrgency: exponent (p_n) must be a positive integer');
  }
  return coreImportance.mul(deficit.pow(exponent));
}

export function initialNeedState(def: NeedDef, initialLevel: Rational): NeedState {
  const { value } = quantize(initialLevel, D);
  return { needId: def.needId, level: value };
}
