import { describe, it, expect } from 'vitest';
import {
  runExperimentD_RealDualDerivation,
  runExperimentE_RealIndependentEvidence,
  runExperimentF_PartialOverlapHandAuthored,
} from '../experiments/correlatedEvidence';

describe('Phase 2.97 — Correlated Evidence (Experiments D/E/F)', () => {
  it('Experiment D: a real dual-derivation case (one memory, two signal families) discounts the redundant signal to exactly 0', () => {
    const result = runExperimentD_RealDualDerivation();
    expect(result.nucleus).toBeDefined();
    expect(result.memoryContribution).toBeDefined();
    expect(result.nudgeContribution).toBeDefined();
    expect(result.nudgeFullyOverlapsAndContributesNothing).toBe(true);
    expect(result.naiveIndependentSumWouldHaveBeenLarger).toBe(true);
  });

  it('Experiment E: two real, independently-derived memories on the same nucleus stack fully, undiscounted', () => {
    const result = runExperimentE_RealIndependentEvidence();
    expect(result.firstMemoryContribution).toBeDefined();
    expect(result.secondMemoryContribution).toBeDefined();
    expect(result.bothMemorySignalsKeptFullWeight).toBe(true);
    expect(result.combinedExceedsEitherAlone).toBe(true);
  });

  it('Experiment F: the Brief\'s own partial-overlap spec reproduces exactly (Overlap=1/5)', () => {
    const result = runExperimentF_PartialOverlapHandAuthored();
    expect(result.matchesBriefSpecExactly).toBe(true);
  });
});
