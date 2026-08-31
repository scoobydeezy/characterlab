import { describe, it, expect } from 'vitest';
import { Rational, ratOf } from '../kernel/rational';
import { runModifierSweep, runBaseDieSweep, runExperimentL_CalibrationRecommendation } from '../experiments/calibrationSweeps';

describe('Phase 2.97 — Calibration Sweeps (Experiment L, pure kernel-level)', () => {
  it('modifier sweep at d8 is monotonically increasing in the modifier, symmetric around modifier=0 -> 1/2', () => {
    const rows = runModifierSweep(8, 4);
    const zero = rows.find((r) => r.modifier === 0)!;
    expect(zero.pWithModifierWins.equals(ratOf(1, 2))).toBe(true);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].pWithModifierWins.gt(rows[i - 1].pWithModifierWins)).toBe(true);
    }
    // Symmetric: P(win | modifier=+k) + P(win | modifier=-k) = 1.
    for (const row of rows) {
      const mirror = rows.find((r) => r.modifier === -row.modifier)!;
      expect(row.pWithModifierWins.add(mirror.pWithModifierWins).equals(Rational.ONE)).toBe(true);
    }
  });

  it('base-die sweep against a d8 reference is monotonically increasing in die size, d8 vs d8 -> 1/2', () => {
    const rows = runBaseDieSweep(8);
    const d8 = rows.find((r) => r.dieFaces === 8)!;
    expect(d8.pWins.equals(ratOf(1, 2))).toBe(true);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].pWins.gt(rows[i - 1].pWins)).toBe(true);
    }
  });

  it('Experiment L: reports the real measured comparison between a modifier step and a die-bracket step (found empirically, not assumed)', () => {
    const result = runExperimentL_CalibrationRecommendation();
    // Real, exact numbers from this file's own sweep — a lone +1 modifier at
    // d8 shifts win probability by 15/128 (~0.117), the d8->d10 bracket step
    // by 1/10 (~0.10). The modifier step is NOT smaller — a genuine
    // calibration finding, not a predicted one.
    expect(result.oneModifierStepShift.equals(ratOf(15, 128))).toBe(true);
    expect(result.oneBaseDieBracketShift.equals(ratOf(1, 10))).toBe(true);
    expect(result.modifierStepIsSmallerThanBracketStep).toBe(false);
  });
});
