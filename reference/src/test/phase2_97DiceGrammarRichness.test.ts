import { describe, it, expect } from 'vitest';
import { runExperimentK_DiceGrammarRichness } from '../experiments/diceGrammarRichness';

describe('Phase 2.97 — Dice Grammar Richness (Experiment K, real pipeline)', () => {
  it('one Option with several genuinely independent motives forms >= 4 nuclei, and the combined dice-pool PMF is exactly the convolution of each', () => {
    const result = runExperimentK_DiceGrammarRichness();
    expect(result.atLeastFourIndependentNuclei).toBe(true);
    expect(result.combinedPmfSumsToExactlyOne).toBe(true);
    expect(result.combinedSupportMatchesAdditiveRange).toBe(true);
  });
});
