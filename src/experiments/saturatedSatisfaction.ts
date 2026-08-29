/**
 * Phase 2.5a experiment, Brief §21: "Saturated Satisfaction sweep." Fix one
 * satisfier's true effect on one Need and vary only the Need's starting
 * Level, then compare what NeedExpectation learns under 'naive' vs.
 * 'censored' learningMode (model/cycle.ts::SaturationParams).
 *
 * Phase 1's Connection-ceiling finding and Phase 2's Avoidance floor
 * artifact are the same phenomenon at both boundaries: once a starting
 * Level is close enough to a boundary that the satisfier's full effect
 * cannot land, NeedExpectation's naive update learns from the CLIPPED
 * delta (Applied), not the satisfier's true effect (the outcome table's
 * authored magnitude) — so naive μ should visibly shrink toward 0 as the
 * starting Level approaches 1 (this experiment intentionally reuses
 * ACTION_VISIT_GLEN's existing +0.40 Connection effect from
 * scenario.ts::defaultOutcomeTables — the same "true effect" Phase 0-2
 * already established, not a new authored number). 'censored' mode's
 * one-sided update rule (expectation.ts::updateExpectation) should instead
 * keep μ near the true effect regardless of starting Level, since a
 * ceiling-clipped observation is classified as `lower_bound` evidence and
 * can never pull μ downward.
 *
 * Read-only probe methodology mirrors experiments/avoidance.ts: after the
 * one forced Experience, evaluate the satisfier against a neutral baseline
 * through the real evaluateAction/buildChoiceDistribution pipeline to see
 * how the learned expectation would actually move subsequent choice.
 */

import { ConceptKey, NeedId } from '../kernel/canonical';
import { Rational } from '../kernel/rational';
import { CharacterState, getExpectation, withNeedLevel } from '../model/character';
import { ActionDef, evaluateAction, NeedContext } from '../model/actions';
import { WorldOutcomeTable } from '../model/outcome';
import { CycleParams, runScriptedExperience } from '../model/cycle';
import { EventClock } from '../kernel/event';
import { needDeficit, needUrgency, SaturationKind } from '../model/needs';
import { buildChoiceDistribution } from '../model/choice';
import { confidence } from '../model/expectation';

export type LearningMode = 'naive' | 'censored';

export interface SaturationSweepPoint {
  readonly needLevelBefore: Rational;
  readonly learningMode: LearningMode;
  /** NeedExpectation.mu(satisfierAction.subject, focusNeed) after the one
   * forced Experience. */
  readonly mu: Rational;
  readonly confidence: Rational;
  /** The portion of the outcome table's true effect that actually landed
   * on the Need (Brief §16's Applied), and the portion that could not
   * (Overflow) — read directly off CycleResult.saturationAnalysis, not
   * recomputed. */
  readonly applied: Rational;
  readonly overflow: Rational;
  readonly saturated: SaturationKind;
  /** Pr(satisfierAction) in a two-way choice against baselineAction,
   * evaluated against the post-Experience state — the number that should
   * diverge between learningModes as the starting Level approaches the
   * boundary. */
  readonly probabilityOfSatisfierAction: Rational;
}

export interface SaturatedSatisfactionResult {
  readonly points: readonly SaturationSweepPoint[];
}

function currentNeedContexts(state: CharacterState): NeedContext[] {
  const contexts: NeedContext[] = [];
  for (const def of state.needDefs.values()) {
    const needState = state.needStates.get(def.needId);
    if (!needState) continue;
    const deficit = needDeficit(needState.level, def.setPoint);
    const urgency = needUrgency(deficit, def.coreImportance, def.urgencyExponent);
    contexts.push({ def, urgency });
  }
  return contexts;
}

export function runSaturatedSatisfactionExperiment(
  actor: ConceptKey,
  initialState: CharacterState,
  satisfierAction: ActionDef,
  satisfierOutcome: WorldOutcomeTable,
  baselineAction: ActionDef,
  focusNeed: NeedId,
  needLevelsBefore: readonly Rational[],
  params: CycleParams,
  seed: string,
): SaturatedSatisfactionResult {
  const points: SaturationSweepPoint[] = [];
  const modes: readonly LearningMode[] = ['naive', 'censored'];

  for (const needLevelBefore of needLevelsBefore) {
    for (const learningMode of modes) {
      // Each (level, mode) combination is an independent single-shot probe
      // starting fresh from initialState — deliberately NOT a running
      // sequence, so the sweep measures "what is learned from one
      // Experience at this starting Level," isolated from any earlier
      // repetition's own learning (that cross-repetition question is what
      // saturationCounterfactual.ts answers instead).
      const startState = withNeedLevel(initialState, focusNeed, needLevelBefore);
      // deltaT=0 for this probe: `needLevelBefore` is deliberately the exact
      // Level the outcome effect is applied against. A nonzero deltaT would
      // let the Need's own passive decay (needs.ts::advanceNeedLevel, step 1
      // of the cycle) shift the Level before the effect ever lands, which
      // would confound "how saturated is this starting point" with "how
      // much passive decay happened first" — a second variable this sweep
      // is not designed to study (see saturationCounterfactual.ts's own
      // isolation of exactly one variable, for the same reason).
      const modeParams: CycleParams = { ...params, deltaT: Rational.ZERO, saturation: { ...params.saturation, learningMode } };
      const clock = new EventClock();
      clock.advance(1);
      const result = runScriptedExperience(actor, startState, satisfierAction, satisfierOutcome, modeParams, clock, seed);

      const needCtxs = currentNeedContexts(result.nextState);
      const scoredSatisfier = evaluateAction(
        satisfierAction,
        needCtxs,
        (needId) => getExpectation(result.nextState, satisfierAction.subject, needId),
        modeParams.expectation.kC,
      );
      const scoredBaseline = evaluateAction(
        baselineAction,
        needCtxs,
        (needId) => getExpectation(result.nextState, baselineAction.subject, needId),
        modeParams.expectation.kC,
      );
      const distribution = buildChoiceDistribution([scoredSatisfier, scoredBaseline], modeParams.choice);
      const probabilityOfSatisfierAction = distribution.ordered.find((o) => o.actionKey === satisfierAction.actionKey)!.probability;

      const exp = getExpectation(result.nextState, satisfierAction.subject, focusNeed);
      const entry = result.saturationAnalysis.find((s) => s.needId === focusNeed);
      if (!entry) {
        throw new RangeError(`runSaturatedSatisfactionExperiment: satisfierOutcome has no effect on focusNeed ${focusNeed}`);
      }

      points.push({
        needLevelBefore,
        learningMode,
        mu: exp.mu,
        confidence: confidence(exp.tau, modeParams.expectation.kC),
        applied: entry.applied,
        overflow: entry.overflow,
        saturated: entry.saturated,
        probabilityOfSatisfierAction,
      });
    }
  }

  return { points };
}
