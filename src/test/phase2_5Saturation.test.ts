import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import { NeedId } from '../kernel/canonical';
import {
  PERSON_MINA,
  NEED_CONNECTION,
  defaultScenario,
  createInitialCharacterState,
  defaultActions,
  defaultOutcomeTables,
  ACTION_VISIT_GLEN,
  ACTION_STAY_HOME,
} from '../model/scenario';
import { runSaturatedSatisfactionExperiment } from '../experiments/saturatedSatisfaction';
import { runSaturationCounterfactual } from '../experiments/saturationCounterfactual';

function setup() {
  const scenario = defaultScenario('phase2_5-saturation-seed');
  const initial = createInitialCharacterState(scenario);
  const actions = defaultActions();
  const outcomes = defaultOutcomeTables();
  return {
    scenario,
    initial,
    glenAction: actions.find((a) => a.actionKey === ACTION_VISIT_GLEN)!,
    stayHomeAction: actions.find((a) => a.actionKey === ACTION_STAY_HOME)!,
    glenOutcome: outcomes.get(ACTION_VISIT_GLEN)!,
  };
}

describe('Brief §21 Phase 2.5a experiment: Saturated Satisfaction sweep', () => {
  it('naive mu shrinks toward 0 as the starting Need Level approaches the ceiling', () => {
    const { scenario, initial, glenAction, stayHomeAction, glenOutcome } = setup();
    const levels = [ratOf(1, 10), ratOf(4, 10), ratOf(7, 10), ratOf(9, 10), ratOf(1)];

    const result = runSaturatedSatisfactionExperiment(
      PERSON_MINA,
      initial,
      glenAction,
      glenOutcome,
      stayHomeAction,
      NEED_CONNECTION,
      levels,
      scenario.cycleParams,
      'saturation-sweep-seed',
    );

    const naivePoints = result.points.filter((p) => p.learningMode === 'naive');
    expect(naivePoints.length).toBe(levels.length);

    // Monotonically non-increasing as the starting Level rises (more of the
    // satisfier's true +0.40 effect gets clipped at higher starting Levels).
    for (let i = 1; i < naivePoints.length; i++) {
      expect(naivePoints[i].mu.lte(naivePoints[i - 1].mu)).toBe(true);
    }
    // At Level == 1 (no headroom at all), the entire effect overflows: mu
    // learned from a single fresh-prior Experience must be exactly 0.
    const atCeiling = naivePoints.find((p) => p.needLevelBefore.equals(Rational.ONE))!;
    expect(atCeiling.mu.isZero()).toBe(true);
    expect(atCeiling.saturated).toBe('ceiling');
    expect(atCeiling.overflow.gt(ratOf(0))).toBe(true);

    // Low starting Levels see the effect land cleanly, unsaturated.
    const atFloor = naivePoints.find((p) => p.needLevelBefore.equals(ratOf(1, 10)))!;
    expect(atFloor.saturated).toBe('none');
    expect(atFloor.overflow.isZero()).toBe(true);
  });

  it('a single fresh-prior observation makes censoring a mu-no-op at every starting Level, but (Correction 2) NOT a confidence-no-op at total saturation', () => {
    // The key structural finding that motivates the counterfactual
    // experiment below: the one-sided update rule can only ever REJECT a
    // naive candidate that would move mu to the wrong side of the CURRENT
    // prior. A brand-new NeedExpectation(subject, need) starts at mu=0, and
    // every candidate here is a non-negative Applied value, so the naive
    // candidate is always >= the fresh prior — mu itself is therefore
    // identical between learningModes at every starting Level, fresh-prior
    // or not (censoring's protective effect on MU only has something to
    // protect once a real expectation has already been established; see the
    // counterfactual test below, which builds that prior first).
    //
    // CONFIDENCE is a different story since Correction 2 (post-2.5c review):
    // at needLevelBefore=1 the Need has no headroom at all, so Applied=0
    // exactly — the naive candidate lands EXACTLY on the fresh prior mu=0,
    // which is the boundary case Correction 2 classifies as UNINFORMATIVE
    // ("the effect was at least 0" proves nothing when you already believe
    // 0). 'naive' mode always uses 'point' evidence regardless of
    // saturation, so it still (incorrectly, per Brief §27's own spirit)
    // grows confidence from this zero-information observation; 'censored'
    // mode correctly recognizes it as uninformative and grows no confidence
    // at all — this is Phase 2.5a's Correction section's "Case C" made
    // concrete inside the sweep experiment itself, not just in a unit test.
    const { scenario, initial, glenAction, stayHomeAction, glenOutcome } = setup();
    const levels = [ratOf(1, 10), ratOf(4, 10), ratOf(7, 10), ratOf(9, 10), ratOf(1)];

    const result = runSaturatedSatisfactionExperiment(
      PERSON_MINA,
      initial,
      glenAction,
      glenOutcome,
      stayHomeAction,
      NEED_CONNECTION,
      levels,
      scenario.cycleParams,
      'saturation-sweep-seed',
    );

    for (const level of levels) {
      const naive = result.points.find((p) => p.learningMode === 'naive' && p.needLevelBefore.equals(level))!;
      const censored = result.points.find((p) => p.learningMode === 'censored' && p.needLevelBefore.equals(level))!;
      expect(censored.mu.equals(naive.mu)).toBe(true);
      if (level.equals(Rational.ONE)) {
        // Total saturation: naive wrongly grows confidence from a
        // zero-information observation; censored correctly does not.
        expect(censored.confidence.isZero()).toBe(true);
        expect(naive.confidence.gt(censored.confidence)).toBe(true);
      } else {
        expect(censored.confidence.equals(naive.confidence)).toBe(true);
      }
    }
  });
});

describe('Brief §22 Phase 2.5a experiment: Saturated Satisfaction counterfactual', () => {
  it('naive mu diverges between a low-exposure and a mostly-near-saturation timeline; censored mu diverges less', () => {
    const { scenario, initial, glenAction, glenOutcome } = setup();

    // Timeline A: comfortably unsaturated every repetition (capacity+ >=
    // 0.80, the effect never exceeds ~0.45).
    const timelineA = [ratOf(1, 10), ratOf(15, 100), ratOf(1, 10), ratOf(2, 10), ratOf(1, 10), ratOf(15, 100)];
    // Timeline B: MOSTLY near the ceiling (capacity+ ~0.05-0.15, reliably
    // clipped) but with one deliberate dip to 1/2 (capacity+ = 0.50, safely
    // above the effect's ~0.35-0.45 range) — Brief §22 says "mostly," not
    // "always"; see saturationCounterfactual.ts's module comment for why an
    // always-saturating timeline would make this comparison vacuous.
    const timelineB = [ratOf(17, 20), ratOf(9, 10), ratOf(17, 20), ratOf(1, 2), ratOf(22, 25), ratOf(17, 20)];

    const result = runSaturationCounterfactual(
      PERSON_MINA,
      initial,
      glenAction,
      glenOutcome,
      NEED_CONNECTION,
      timelineA,
      timelineB,
      scenario.cycleParams,
      'saturation-counterfactual-seed',
    );

    expect(result.results.length).toBe(4);
    const naiveA = result.results.find((r) => r.timeline === 'A' && r.learningMode === 'naive')!;
    const naiveB = result.results.find((r) => r.timeline === 'B' && r.learningMode === 'naive')!;
    const censoredA = result.results.find((r) => r.timeline === 'A' && r.learningMode === 'censored')!;
    const censoredB = result.results.find((r) => r.timeline === 'B' && r.learningMode === 'censored')!;

    // Timeline A never saturates; Timeline B saturates on every repetition
    // except its one deliberate dip.
    expect(naiveA.steps.every((s) => s.saturated === 'none')).toBe(true);
    expect(censoredA.steps.every((s) => s.saturated === 'none')).toBe(true);
    const bSaturatedCount = naiveB.steps.filter((s) => s.saturated === 'ceiling').length;
    expect(bSaturatedCount).toBe(5);

    // Naive learns a visibly smaller effect in the mostly-saturating
    // timeline, purely as an artifact of when the satisfier happened to be
    // tried — it averages the rare genuine observation together with the
    // many systematically-clipped ones.
    expect(naiveB.finalMu.lt(naiveA.finalMu)).toBe(true);

    // Censored recovers more of the true effect in Timeline B than naive
    // does, by rejecting clipped observations that would pull mu below
    // what the genuine observations already established.
    expect(censoredB.finalMu.gt(naiveB.finalMu)).toBe(true);

    // The central Phase 2.5a claim: censoring narrows the cross-timeline
    // divergence versus naive.
    expect(result.censoredDivergence.lt(result.naiveDivergence)).toBe(true);

    // Timeline A is identical for naive and censored (never censored,
    // since it's never saturated) — a sanity check that censoring only
    // acts where saturation actually occurs.
    expect(censoredA.finalMu.equals(naiveA.finalMu)).toBe(true);
  });
});
