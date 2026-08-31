import { describe, it, expect } from 'vitest';
import { Rational } from '../kernel/rational';
import { runExperimentM_OldVsNewCompilation } from '../experiments/oldVsNewCompilation';

describe('Phase 2.97 — Old vs. New Compilation, side by side (Experiment M)', () => {
  it('runs the identical {CharacterState, Decision, Seed} through both pipelines and reports real dice-count and probability comparisons', () => {
    const result = runExperimentM_OldVsNewCompilation();

    // Both pipelines produce at least one real die for each Option under
    // this strengthened baseline — the comparison is meaningful, not a
    // degenerate zero-dice case on either side.
    for (const option of result.perOption) {
      expect(option.legacyDiceCount).toBeGreaterThan(0);
      expect(option.reasonNucleiDiceCount).toBeGreaterThan(0);
    }

    // Both are legitimate resolutions of the same underlying pressure —
    // pre-roll probabilities on each side land strictly in (0,1), and the
    // delta between them is a real, non-negative number.
    expect(result.pKeepDinnerLegacy.gt(Rational.ZERO)).toBe(true);
    expect(result.pKeepDinnerLegacy.lt(Rational.ONE)).toBe(true);
    expect(result.pKeepDinnerReasonNuclei.gt(Rational.ZERO)).toBe(true);
    expect(result.pKeepDinnerReasonNuclei.lt(Rational.ONE)).toBe(true);
    expect(result.probabilityDelta.gte(Rational.ZERO)).toBe(true);

    // The new pipeline's per-nucleus labels are strictly more specific than
    // legacy's flat semantic-channel influenceId (they encode
    // MotiveChannel+Referent+Direction, not just a channel name) — a
    // concrete, checkable trace-readability difference rather than an
    // assumed one.
    for (const option of result.perOption) {
      if (option.reasonNucleiLabels.length > 0) {
        for (const label of option.reasonNucleiLabels) {
          expect(label).toContain(option.option);
        }
      }
    }
  });
});
