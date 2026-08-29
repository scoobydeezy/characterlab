/**
 * Choice, per Brief §24.
 *
 *   W_a  = (ε + 1 + S̄_a)^γ
 *   Pr(a) = W_a / Σ_j W_j
 *
 * Actions are ordered by CanonicalActionKey; a deterministic uniform
 * sample selects the first Action whose cumulative probability exceeds the
 * draw. γ = γ_0 (a fixed authored constant) in Phase 1 — Γ(P), a
 * personality-dependent γ, is explicitly deferred until Phase 3+ earns it
 * (§24).
 */

import { Rational } from '../kernel/rational';
import { CanonicalActionKey, compareCanonical } from '../kernel/canonical';
import { ScoredAction } from './actions';
import { DrawAddress, drawUniform } from '../kernel/random';

export interface ChoiceParams {
  /** ε > 0 — keeps every weight strictly positive even at the most negative
   * possible bounded score (S̄_a → −1). */
  readonly epsilon: Rational;
  /** γ — positive integer sharpness exponent. */
  readonly gamma: number;
}

export interface ChoiceWeight {
  readonly actionKey: CanonicalActionKey;
  readonly weight: Rational; // W_a
  readonly probability: Rational; // Pr(a)
}

export interface ChoiceDistribution {
  readonly ordered: readonly ChoiceWeight[]; // canonical CanonicalActionKey order
}

/** W_a = (ε + 1 + S̄_a)^γ */
export function choiceWeight(scored: ScoredAction, params: ChoiceParams): Rational {
  if (!Number.isInteger(params.gamma) || params.gamma <= 0) {
    throw new RangeError('choiceWeight: gamma must be a positive integer');
  }
  const base = params.epsilon.add(Rational.ONE).add(scored.boundedScore);
  return base.pow(params.gamma);
}

/**
 * Build the full probability distribution over candidate Actions, in
 * canonical CanonicalActionKey order (§24, §31 — shared canonical order is
 * also what lets CharacterLab/Vivarium comparisons line distributions up).
 */
export function buildChoiceDistribution(
  scoredActions: readonly ScoredAction[],
  params: ChoiceParams,
): ChoiceDistribution {
  if (scoredActions.length === 0) {
    return { ordered: [] };
  }
  const ordered = [...scoredActions].sort((a, b) => compareCanonical(a.actionKey, b.actionKey));
  const weights = ordered.map((a) => ({ actionKey: a.actionKey, weight: choiceWeight(a, params) }));
  const total = weights.reduce((acc, w) => acc.add(w.weight), Rational.ZERO);
  const withProbability = weights.map((w) => ({
    actionKey: w.actionKey,
    weight: w.weight,
    probability: w.weight.div(total),
  }));
  return { ordered: withProbability };
}

/**
 * Deterministic selection: draw u ∈ [0,1) from the counter-addressed
 * oracle (kernel/random.ts) and select the first Action, in canonical
 * order, whose cumulative probability exceeds u. §24: "A deterministic
 * uniform sample selects the first Action whose cumulative probability
 * exceeds the draw."
 */
export function selectAction(
  distribution: ChoiceDistribution,
  drawAddress: DrawAddress,
): { actionKey: CanonicalActionKey; draw: Rational; cumulativeAtSelection: Rational } {
  if (distribution.ordered.length === 0) {
    throw new RangeError('selectAction: no candidate Actions to choose from');
  }
  const u = drawUniform(drawAddress);
  let cumulative = Rational.ZERO;
  for (const entry of distribution.ordered) {
    cumulative = cumulative.add(entry.probability);
    if (u.lt(cumulative)) {
      return { actionKey: entry.actionKey, draw: u, cumulativeAtSelection: cumulative };
    }
  }
  // Floating-point-free exact math should make probabilities sum to
  // exactly 1, so this only triggers on a genuine last-entry edge case
  // (u arbitrarily close to 1) — fall back to the last action in canonical
  // order rather than throwing, so replay never diverges on a boundary.
  const last = distribution.ordered[distribution.ordered.length - 1];
  return { actionKey: last.actionKey, draw: u, cumulativeAtSelection: cumulative };
}
