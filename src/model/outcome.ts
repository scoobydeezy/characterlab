/**
 * World outcomes for Actions — the deterministic (optionally
 * seeded-random) "what actually happens" that Brief §22/§25 step 10
 * requires ("Apply deterministic/stochastically-addressed world outcome").
 *
 * CharacterLab's world model itself is intentionally minimal (§2: the
 * character, not the world, is the research subject): each Action simply
 * declares an authored mean effect per Need plus an optional noise
 * half-width. The realized effect is:
 *
 *   effect_n = magnitude_n + (2u − 1)·halfWidth_n
 *
 * where u is drawn from the counter-addressed oracle (kernel/random.ts)
 * with PurposeId "outcome_noise" — so re-running the same EventId
 * reproduces the exact same "random" outcome, satisfying §3.1's
 * determinism contract while still letting experiments show realistic
 * noisy learning curves instead of a perfectly clean staircase.
 */

import { Rational } from '../kernel/rational';
import { CanonicalActionKey, NeedId } from '../kernel/canonical';
import { DrawAddress, drawUniform } from '../kernel/random';
import { quantize, D } from '../kernel/lattice';

export interface ActionEffect {
  readonly needId: NeedId;
  /** Mean effect on the Need's Level (can be negative). */
  readonly magnitude: Rational;
  /** Half-width of symmetric uniform noise around magnitude. 0 = fully
   * deterministic. */
  readonly noiseHalfWidth: Rational;
}

export interface WorldOutcomeTable {
  readonly actionKey: CanonicalActionKey;
  readonly effects: readonly ActionEffect[];
}

export interface RealizedEffect {
  readonly needId: NeedId;
  readonly magnitude: Rational;
  readonly noiseHalfWidth: Rational;
  readonly noiseDraw: Rational; // u ∈ [0,1)
  readonly realized: Rational; // quantized effect actually applied
}

/**
 * Resolve every Need effect for one Action's outcome, each with its own
 * addressed draw (PurposeId = `outcome_noise:${needId}`) so adding or
 * removing an effect for one Need can never shift another Need's noise
 * draw (Brief §7: "an unrelated random event ... cannot shift later random
 * results").
 */
export function resolveOutcome(
  table: WorldOutcomeTable,
  baseDrawAddress: Omit<DrawAddress, 'purposeId' | 'drawIndex'>,
): RealizedEffect[] {
  return table.effects.map((effect, index) => {
    const u = drawUniform({
      ...baseDrawAddress,
      purposeId: `outcome_noise:${effect.needId}`,
      drawIndex: index,
    });
    const noiseTerm = u.mul(Rational.of(2n, 1n)).sub(Rational.ONE).mul(effect.noiseHalfWidth);
    const raw = effect.magnitude.add(noiseTerm);
    const { value } = quantize(raw, D);
    return {
      needId: effect.needId,
      magnitude: effect.magnitude,
      noiseHalfWidth: effect.noiseHalfWidth,
      noiseDraw: u,
      realized: value,
    };
  });
}
