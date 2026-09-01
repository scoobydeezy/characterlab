import { describe, it, expect } from 'vitest';
import {
  runExperimentA_ResidualUncertainty,
  runExperimentB_ObviousChoice,
  runExperimentC_TrivialUncertainty,
  runExperimentD_MeaningfulConflict,
  runExperimentK_IntentVersusOutcome,
} from '../experiments/decisionResolution';
import { Rational } from '../kernel/rational';

/**
 * Brief §30 Experiments A, B, C, D, K, asserted against real
 * `runDecisionCycle` output (experiments/decisionResolution.ts) — never
 * against hand-built `resolveDecision` fixtures, which
 * phase2_9Decision.test.ts already covers directly.
 */
describe('Experiment A — Residual uncertainty', () => {
  it('neither Option is deterministically selected, and the Decision uses dice', () => {
    const result = runExperimentA_ResidualUncertainty();
    expect(result.bothProbabilitiesNontrivial).toBe(true);
    expect(result.usedDice).toBe(true);
    // Sum to exactly 1 (§35's normalization obligation, re-checked here
    // against a REAL runDecisionCycle output, not just the kernel unit test).
    const total = result.sample.decisionExpression.preRollOptionProbabilities.reduce((acc, p) => acc.add(p.probability), Rational.ZERO);
    expect(total.equals(Rational.ONE)).toBe(true);
  });
});

describe('Experiment B — Obvious choice', () => {
  it('Margin rises, Contest falls, the Decision auto-resolves, and no dice are rolled', () => {
    const result = runExperimentB_ObviousChoice();
    expect(result.marginHigh).toBe(true);
    expect(result.contestLow).toBe(true);
    expect(result.autoResolved).toBe(true);
    expect(result.noDiceRolled).toBe(true);
  });
});

describe('Experiment C — Trivial uncertainty', () => {
  it('may require a Quiet Roll but never becomes player-facing, and Identity Evidence stays small', () => {
    const result = runExperimentC_TrivialUncertainty();
    expect(result.notPlayerFacing).toBe(true);
    expect(result.lowStake).toBe(true);
    expect(result.identityEvidenceStaysSmall).toBe(true);
    expect(result.sample.decisionExpression.stake.equals(Rational.ZERO)).toBe(true);
    expect(result.sample.decisionExpression.authorshipPotential.equals(Rational.ZERO)).toBe(true);
  });
});

describe('Experiment D — Meaningful conflict', () => {
  it('produces high Authorship Potential, a player-facing roll, and substantial Identity Evidence', () => {
    const result = runExperimentD_MeaningfulConflict();
    expect(result.highAuthorship).toBe(true);
    expect(result.playerFacing).toBe(true);
    expect(result.substantialIdentityEvidence).toBe(true);
  });
});

describe('Experiment K — Intent versus physical outcome', () => {
  it('preserves ChosenIntent under a forced physical-outcome substitution, and the executed Action genuinely differs', () => {
    const result = runExperimentK_IntentVersusOutcome();
    expect(result.intentPreserved).toBe(true);
    expect(result.physicalOutcomeDiffers).toBe(true);
    // The two runs' RESOLUTIONS (pre-roll probabilities, rolls, chosen
    // intent) are byte-for-byte identical — forcing a different physical
    // outcome must not perturb the Decision math that already ran.
    expect(result.baseline.decisionExpression.chosenOption).toBe(result.forced.decisionExpression.chosenOption);
    expect(result.baseline.decisionExpression.authorshipPotential.equals(result.forced.decisionExpression.authorshipPotential)).toBe(true);
    for (let i = 0; i < result.baseline.decisionExpression.influenceRolls.length; i++) {
      expect(result.baseline.decisionExpression.influenceRolls[i].rollValue).toBe(result.forced.decisionExpression.influenceRolls[i].rollValue);
    }
    // Biography (DecisionExpression) still names the chosen INTENT, not the
    // substituted physical Action (Brief §14/§18).
    expect(result.forced.decisionExpression.chosenIntent).not.toBe(result.forced.executedAction.actionKey);
  });
});
