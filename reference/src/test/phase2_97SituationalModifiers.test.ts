import { describe, it, expect } from 'vitest';
import { runExperimentJ_SituationalModifiers } from '../experiments/situationalModifiers';

describe('Phase 2.97 — Situational Modifiers (Experiment J, real pipeline)', () => {
  it('holds Need level, NeedExpectation, and identity constant, and lets only the retrieved memory set change the situational modifier', () => {
    const result = runExperimentJ_SituationalModifiers();
    expect(result.memoryRetrievedOnlyInSupportiveRun).toBe(true);
    expect(result.baseMotiveStrengthIdentical).toBe(true);
    expect(result.situationalModifierDiffers).toBe(true);
    expect(result.supportiveRunHasLargerSituationalModifier).toBe(true);
  });
});
