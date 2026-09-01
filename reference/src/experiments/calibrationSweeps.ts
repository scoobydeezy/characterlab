/**
 * Phase 2.97 — Base-Die/Modifier Calibration Sweeps (Experiment L).
 *
 * Plan scoping decision 8: base-die thresholds and modifier-family unit/
 * maxMagnitude are NEW, separately-versioned constants (never inherited
 * from Phase 2.9's `dieScale`) and are explicitly research knobs pending
 * empirical measurement — the brief's own "Offline Backward Balancing"
 * section calls for exactly this: sweep tables that show what a modifier
 * step is actually WORTH, in win-probability terms, relative to moving a
 * whole base-die bracket, so `diceCompiler.ts`'s defaults
 * (`scenario.ts::defaultReasonNucleusParams`) can be judged against real
 * numbers rather than "loosely mirrors dieScale's own bracket spacing" —
 * this file's own module comment before this experiment existed.
 *
 * Pure kernel-level math throughout — no `CharacterState`, no
 * `RawCognitiveSignal`, not even a Decision: two independent option
 * distributions built directly from `kernel/discreteDistribution.ts`
 * primitives (`uniformDie`/`convolve`/`pointMass`) and compared via the
 * SAME exact `winProbabilities` every real Decision resolution already
 * uses (Brief §34's "reuse the existing exact math" requirement, at its
 * purest — this sweep exercises the identical function, just never wired
 * through a Decision at all).
 */

import { Rational } from '../kernel/rational';
import { Distribution, convolve, pointMass, uniformDie, winProbabilities } from '../kernel/discreteDistribution';

// ---------------------------------------------------------------------------
// Sweep 1 — fixed base die, modifier swept -N..+N
// ---------------------------------------------------------------------------

export interface ModifierSweepRow {
  readonly modifier: number;
  readonly pWithModifierWins: Rational;
}

/**
 * Option A rolls `baseDie` + `modifier`; Option B rolls the SAME `baseDie`
 * with no modifier at all — an unmodified die is exactly what "no standing/
 * situational pressure" compiles to, so this sweep directly answers "how
 * much is a +k integer modifier worth against an otherwise identical
 * opponent?"
 */
export function runModifierSweep(baseDie = 8, modifierRange = 4): readonly ModifierSweepRow[] {
  const rows: ModifierSweepRow[] = [];
  const reference = uniformDie(baseDie, 1);
  for (let m = -modifierRange; m <= modifierRange; m++) {
    const withModifier: Distribution = convolve(uniformDie(baseDie, 1), pointMass(BigInt(m)));
    const probs = winProbabilities([
      { id: 'withModifier', dist: withModifier },
      { id: 'reference', dist: reference },
    ]);
    rows.push({ modifier: m, pWithModifierWins: probs.get('withModifier')! });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Sweep 2 — base-die size swept at a fixed (zero) modifier
// ---------------------------------------------------------------------------

export interface BaseDieSweepRow {
  readonly dieFaces: number;
  readonly pWins: Rational;
}

/**
 * Option A rolls each of the five authored base-die sizes in turn (no
 * modifier); Option B always rolls the reference die (also unmodified) —
 * this is the calibration table `strengthToBaseDie`'s own five thresholds
 * implicitly assume: how much win probability does moving from one
 * MotiveGenerating-strength bracket to the next actually buy, all else
 * equal?
 */
export function runBaseDieSweep(referenceDie = 8): readonly BaseDieSweepRow[] {
  const dice = [4, 6, 8, 10, 12];
  const reference = uniformDie(referenceDie, 1);
  return dice.map((faces) => {
    const dist = uniformDie(faces, 1);
    const probs = winProbabilities([
      { id: 'candidate', dist },
      { id: 'reference', dist: reference },
    ]);
    return { dieFaces: faces, pWins: probs.get('candidate')! };
  });
}

// ---------------------------------------------------------------------------
// Experiment L — backward-balancing recommendation
// ---------------------------------------------------------------------------

export interface ExperimentLCalibrationResult {
  readonly modifierSweepAtD8: readonly ModifierSweepRow[];
  readonly baseDieSweepAgainstD8: readonly BaseDieSweepRow[];
  /** How much a SINGLE step of the current default StandingIdentity/
   * RecentExperience modifier family (unit=1/4, so `strengthToIntegerModifier`
   * needs strength >= 0.25 to register as +1) shifts P(win) at d8, relative
   * to no modifier at all. */
  readonly oneModifierStepShift: Rational;
  /** How much moving one whole base-die bracket UP (d8 -> d10) shifts
   * P(win), both unmodified — the "whole extra bracket" comparator a
   * modifier step is meant to sit meaningfully BELOW (Brief §41's "a
   * modifier strengthens; it does not replace the die"). */
  readonly oneBaseDieBracketShift: Rational;
  /** true when a single modifier step moves win probability by LESS than a
   * whole base-die bracket step — the qualitative property one might WANT
   * the defaults to have (a modifier nudges; a die-bracket change is the
   * bigger, structural jump). Measured directly, not assumed — and, at this
   * file's own current defaults (StandingIdentity/RecentExperience unit=1/4),
   * it measures FALSE: a lone +1 modifier at d8 (~0.117 P(win) shift) is
   * slightly LOUDER than the whole d8->d10 bracket step (~0.10). This is
   * exactly the kind of finding Offline Backward Balancing exists to catch —
   * see RESEARCH.md's Phase 2.97 entry for the calibration recommendation
   * this produces (a wider modifier unit, e.g. 1/3, or narrower die
   * brackets, would restore the intended ordering; this file does not
   * silently apply that recommendation itself, since doing so would hide
   * the very finding it exists to report). */
  readonly modifierStepIsSmallerThanBracketStep: boolean;
}

/**
 * Runs both sweeps at the scenario's own default base die (d8, the
 * "moderate/strong" boundary — see `scenario.ts::defaultReasonNucleusParams`'s
 * thresholds) and reports the two headline comparisons the brief's Offline
 * Backward Balancing section asks for. This is explicitly a CALIBRATION
 * RECOMMENDATION, not a psychological finding (plan scoping decision 8) —
 * RESEARCH.md's Phase 2.97 entry records the actual numbers this run
 * produces, never a predicted figure.
 */
export function runExperimentL_CalibrationRecommendation(): ExperimentLCalibrationResult {
  const modifierSweepAtD8 = runModifierSweep(8, 4);
  const baseDieSweepAgainstD8 = runBaseDieSweep(8);

  const zeroRow = modifierSweepAtD8.find((r) => r.modifier === 0)!;
  const oneRow = modifierSweepAtD8.find((r) => r.modifier === 1)!;
  const oneModifierStepShift = oneRow.pWithModifierWins.sub(zeroRow.pWithModifierWins).abs();

  const d8Row = baseDieSweepAgainstD8.find((r) => r.dieFaces === 8)!;
  const d10Row = baseDieSweepAgainstD8.find((r) => r.dieFaces === 10)!;
  const oneBaseDieBracketShift = d10Row.pWins.sub(d8Row.pWins).abs();

  return {
    modifierSweepAtD8,
    baseDieSweepAgainstD8,
    oneModifierStepShift,
    oneBaseDieBracketShift,
    modifierStepIsSmallerThanBracketStep: oneModifierStepShift.lt(oneBaseDieBracketShift),
  };
}
