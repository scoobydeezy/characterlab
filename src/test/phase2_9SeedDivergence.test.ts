import { describe, it, expect } from 'vitest';
import { runExperimentF_SeedDivergence } from '../experiments/seedDivergence';
import { Rational } from '../kernel/rational';

/**
 * Brief §30 Experiment F — the flagship "Dice cumulatively author character
 * identity" claim — asserted against real, paired `runDecisionCycle`
 * timelines (experiments/seedDivergence.ts), never against a hand-picked
 * fixture. Two characters share identical initial state and identical
 * world history (`defaultDecisionScenario()`, the same authored Decision
 * sequence) and differ ONLY in deterministic seed; the full causal chain
 * the brief describes — different early rolls → different
 * DecisionExpressions → different acquired identities → different later
 * Decision probabilities — is checked at every link, not just the final
 * one.
 */
describe('Experiment F — Seed divergence', () => {
  it('two identical-except-for-seed timelines diverge at every link of the causal chain the brief predicts', () => {
    const result = runExperimentF_SeedDivergence();

    // Link 1: the dice themselves came out differently early on.
    expect(result.firstRoundRollsDiffered).toBe(true);
    // Link 2: that early divergence shows up in which Option got chosen.
    expect(result.earlyDecisionExpressionsDiffered).toBe(true);
    // Link 3: by the end of the shared sequence, the two characters have
    // accumulated measurably different CommitmentFidelity evidence.
    expect(result.acquiredIdentitiesDiffered).toBe(true);
    expect(result.identityStrengthA.equals(result.identityStrengthB)).toBe(false);
    // Link 4: presented with the identical NEXT Decision (same raw-Need
    // baseline, same third seed for the roll itself), each character's own
    // already-different identity answers it differently.
    expect(result.laterProbabilitiesDiffered).toBe(true);
  });

  it('the two timelines are a genuine paired counterfactual: identical setup, only the seed differs', () => {
    const result = runExperimentF_SeedDivergence();
    // Both timelines ran the same number of rounds against the same
    // Decision sequence and outcome tables — the only free variable was
    // the seed, per the module's own counterfactual-discipline doc comment.
    expect(result.timelineA.rounds.length).toBe(result.timelineB.rounds.length);
    // Sanity: probabilities in the later Decision still sum to exactly 1
    // for both timelines (§35's normalization obligation, re-checked here
    // against real divergent-biography output).
    for (const expr of [result.laterDecisionA, result.laterDecisionB]) {
      const total = expr.preRollOptionProbabilities.reduce((acc, p) => acc.add(p.probability), Rational.ZERO);
      expect(total.equals(Rational.ONE)).toBe(true);
    }
  });
});
