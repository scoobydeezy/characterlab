import { describe, it, expect } from 'vitest';
import { runExperimentN_SeedDivergenceReasonNuclei } from '../experiments/seedDivergenceReasonNuclei';

describe('Phase 2.97 — Seed Divergence under the Reason Nuclei pipeline (Experiment N)', () => {
  it('two identical timelines resolved by the new pipeline still diverge in early rolls, choices, and acquired identity', () => {
    const result = runExperimentN_SeedDivergenceReasonNuclei();
    expect(result.firstRoundRollsDiffered).toBe(true);
    expect(result.earlyDecisionExpressionsDiffered).toBe(true);
    expect(result.acquiredIdentitiesDiffered).toBe(true);
    expect(result.identityStrengthA.equals(result.identityStrengthB)).toBe(false);
  }, 30000);

  it('the paired-timeline identity divergence still produces a real later-decision probability difference under the new pipeline', () => {
    const result = runExperimentN_SeedDivergenceReasonNuclei();
    expect(result.laterProbabilitiesDiffered).toBe(true);
  }, 30000);
});
