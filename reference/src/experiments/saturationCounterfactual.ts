/**
 * Phase 2.5a experiment, Brief §22: the required Saturated Satisfaction
 * counterfactual. Two timelines share the exact same satisfier and the
 * exact same true effect (the outcome table's authored magnitude never
 * changes) — the only thing that differs is WHEN, relative to the Need's
 * own Level, the satisfier happens to be experienced:
 *
 *   Timeline A: the satisfier is (nearly) always experienced while the
 *   Need is low — its full effect can land almost every time (no
 *   saturation).
 *   Timeline B: the satisfier is MOSTLY experienced while the Need is
 *   already near its ceiling — most of its effect overflows — but not
 *   EVERY time (Brief §22 says "mostly," deliberately not "always").
 *
 * That "mostly, not always" is load-bearing, not incidental: if Timeline B
 * clipped literally every single observation identically, there would be
 * no unclipped ('point') observation anywhere in the data for EITHER
 * learning rule to ever learn the true effect from — naive and censored
 * would both converge to the clipped value and never diverge, which is a
 * real (and separately documented — see the sweep test) property of the
 * censored rule, but not what this counterfactual is designed to isolate.
 * With a few genuine unclipped exposures mixed in, a correct rule can use
 * them; naive instead AVERAGES those genuine exposures together with all
 * the systematically-clipped ones, dragging its mean down toward the
 * clipped value, purely as an artifact of how often the satisfier happened
 * to be tried at each Need Level — exactly Brief §27's "must not
 * automatically pull an established expectation downward" failure mode.
 * censored instead accepts every genuine ('point') observation normally
 * and REJECTS only the clipped observations that would pull μ below where
 * the genuine ones already put it, converging closer to the true value.
 * This experiment's target finding (see RESEARCH.md's Phase 2.5a entry for
 * the actual traced numbers): naiveDivergence sizeably exceeds
 * censoredDivergence.
 *
 * Each repetition deliberately resets the focus Need to that repetition's
 * authored Level (via character.ts::withNeedLevel) rather than letting
 * Level evolve freely across repetitions — every number in each timeline's
 * exposure sequence is therefore an explicit, inspectable input, not an
 * emergent side effect of decay-rate tuning. deltaT is also zeroed for
 * this probe so passive decay (needs.ts::advanceNeedLevel, cycle step 1)
 * never shifts a Level away from what was authored.
 */

import { ConceptKey, NeedId } from '../kernel/canonical';
import { Rational } from '../kernel/rational';
import { CharacterState, getExpectation, withNeedLevel } from '../model/character';
import { ActionDef } from '../model/actions';
import { WorldOutcomeTable } from '../model/outcome';
import { CycleParams, runScriptedExperience } from '../model/cycle';
import { EventClock } from '../kernel/event';
import { SaturationKind } from '../model/needs';
import { LearningMode } from './saturatedSatisfaction';

export interface CounterfactualTimelineStep {
  readonly index: number;
  readonly needLevelBefore: Rational;
  readonly mu: Rational;
  readonly applied: Rational;
  readonly overflow: Rational;
  readonly saturated: SaturationKind;
}

export type TimelineId = 'A' | 'B';

export interface SaturationCounterfactualTimelineResult {
  readonly timeline: TimelineId;
  readonly learningMode: LearningMode;
  readonly steps: readonly CounterfactualTimelineStep[];
  readonly finalMu: Rational;
}

export interface SaturationCounterfactualResult {
  readonly results: readonly SaturationCounterfactualTimelineResult[];
  /** |finalMu(naive, TimelineA) - finalMu(naive, TimelineB)| */
  readonly naiveDivergence: Rational;
  /** |finalMu(censored, TimelineA) - finalMu(censored, TimelineB)| */
  readonly censoredDivergence: Rational;
}

function runTimeline(
  timeline: TimelineId,
  learningMode: LearningMode,
  actor: ConceptKey,
  initialState: CharacterState,
  satisfierAction: ActionDef,
  satisfierOutcome: WorldOutcomeTable,
  focusNeed: NeedId,
  needLevelsBefore: readonly Rational[],
  params: CycleParams,
  seed: string,
): SaturationCounterfactualTimelineResult {
  // deltaT=0: as in saturatedSatisfaction.ts, each authored Level must be
  // the exact Level the effect is applied against, undisturbed by passive
  // Need decay.
  const modeParams: CycleParams = { ...params, deltaT: Rational.ZERO, saturation: { ...params.saturation, learningMode } };
  const clock = new EventClock();
  const steps: CounterfactualTimelineStep[] = [];
  let state = initialState;

  for (let i = 0; i < needLevelsBefore.length; i++) {
    const needLevelBefore = needLevelsBefore[i];
    clock.advance(1);
    state = withNeedLevel(state, focusNeed, needLevelBefore);
    // Seed is addressed by (timeline, repetition index) only, NOT by
    // learningMode: naive and censored must replay the exact same random
    // outcome-noise draws at each repetition, per Brief §29's paired-
    // counterfactual methodology (Phase 0-2 already establishes this
    // pattern) — otherwise a divergence in learned mu could be an artifact
    // of different noise draws rather than of the learning rule itself.
    const result = runScriptedExperience(actor, state, satisfierAction, satisfierOutcome, modeParams, clock, `${seed}:${timeline}:${i}`);
    state = result.nextState;

    const entry = result.saturationAnalysis.find((s) => s.needId === focusNeed);
    if (!entry) {
      throw new RangeError(`runTimeline: satisfierOutcome has no effect on focusNeed ${focusNeed}`);
    }
    const exp = getExpectation(state, satisfierAction.subject, focusNeed);
    steps.push({ index: i, needLevelBefore, mu: exp.mu, applied: entry.applied, overflow: entry.overflow, saturated: entry.saturated });
  }

  const finalMu = steps.length > 0 ? steps[steps.length - 1].mu : Rational.ZERO;
  return { timeline, learningMode, steps, finalMu };
}

export function runSaturationCounterfactual(
  actor: ConceptKey,
  initialState: CharacterState,
  satisfierAction: ActionDef,
  satisfierOutcome: WorldOutcomeTable,
  focusNeed: NeedId,
  timelineALevels: readonly Rational[],
  timelineBLevels: readonly Rational[],
  params: CycleParams,
  seed: string,
): SaturationCounterfactualResult {
  const naiveA = runTimeline('A', 'naive', actor, initialState, satisfierAction, satisfierOutcome, focusNeed, timelineALevels, params, seed);
  const naiveB = runTimeline('B', 'naive', actor, initialState, satisfierAction, satisfierOutcome, focusNeed, timelineBLevels, params, seed);
  const censoredA = runTimeline('A', 'censored', actor, initialState, satisfierAction, satisfierOutcome, focusNeed, timelineALevels, params, seed);
  const censoredB = runTimeline('B', 'censored', actor, initialState, satisfierAction, satisfierOutcome, focusNeed, timelineBLevels, params, seed);

  const naiveDivergence = naiveA.finalMu.sub(naiveB.finalMu).abs();
  const censoredDivergence = censoredA.finalMu.sub(censoredB.finalMu).abs();

  return {
    results: [naiveA, naiveB, censoredA, censoredB],
    naiveDivergence,
    censoredDivergence,
  };
}
