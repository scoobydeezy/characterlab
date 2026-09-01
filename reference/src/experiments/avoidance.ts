/**
 * Brief §28 Phase-2 experiment: "Avoidance — does a character come to avoid
 * a repeatedly punishing option without any dedicated Inhibition
 * mechanism?"
 *
 * Brief §27 names Inhibition as a primitive an architecture COULD add
 * ("a direct suppressive force separate from low expected value") but does
 * not mandate one. This experiment deliberately uses ZERO Phase 2 machinery
 * — no associative graph, no accessibility filter, no memory — to test
 * whether Phase 1's NeedExpectation mechanism alone already produces
 * avoidance as an emergent consequence of Score(a) = N_a (the Need term,
 * model/actions.ts) declining as μ(subject, Need) is driven negative by
 * repeated bad outcomes.
 *
 * Methodology: force N repeated Experiences of an action with a reliably
 * negative outcome table (Phase 1's exact mechanism — see
 * experiments/learnedSatisfaction.ts for the mirror-image "reliably
 * positive" case). After each repetition, WITHOUT taking any further
 * action, evaluate the aversive action against a neutral, always-available
 * baseline through the real evaluateAction/buildChoiceDistribution pipeline
 * (§23–24) and record how Pr(aversive action) moves. If it declines toward
 * (and stays near) 0 as μ goes negative and confidence rises, avoidance is
 * DERIVED from Phase 1 alone; no Inhibition primitive was needed to produce
 * it, per Brief §36's framework for classifying which findings did/did not
 * require new mechanism.
 */

import { ConceptKey, NeedId } from '../kernel/canonical';
import { Rational } from '../kernel/rational';
import { CharacterState, getExpectation } from '../model/character';
import { ActionDef, evaluateAction, NeedContext } from '../model/actions';
import { WorldOutcomeTable } from '../model/outcome';
import { CycleParams, runScriptedExperience } from '../model/cycle';
import { EventClock } from '../kernel/event';
import { needDeficit, needUrgency } from '../model/needs';
import { buildChoiceDistribution } from '../model/choice';
import { confidence } from '../model/expectation';

export interface AvoidanceStep {
  readonly index: number;
  /** Learned NeedExpectation.mu(aversiveAction.subject, focusNeed) after
   * this repetition — expected to trend negative. */
  readonly mu: Rational;
  readonly confidence: Rational;
  /** Score(aversiveAction) bounded to (-1, 1) if evaluated right now,
   * against the state as it stands after this repetition. */
  readonly boundedScore: Rational;
  /** Pr(aversiveAction) in a two-way choice against the baseline action,
   * evaluated the same way — this is the number that should visibly
   * decline across repetitions if avoidance is really happening. */
  readonly probabilityOfAversiveAction: Rational;
}

export interface AvoidanceResult {
  readonly finalState: CharacterState;
  readonly steps: readonly AvoidanceStep[];
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

export function runAvoidanceExperiment(
  actor: ConceptKey,
  initialState: CharacterState,
  aversiveAction: ActionDef,
  aversiveOutcome: WorldOutcomeTable,
  baselineAction: ActionDef,
  focusNeed: NeedId,
  params: CycleParams,
  seed: string,
  repetitions: number,
): AvoidanceResult {
  const clock = new EventClock();
  let state = initialState;
  const steps: AvoidanceStep[] = [];

  for (let i = 0; i < repetitions; i++) {
    clock.advance(1);
    const result = runScriptedExperience(actor, state, aversiveAction, aversiveOutcome, params, clock, seed);
    state = result.nextState;

    // Read-only probe: evaluate both candidates against the post-repetition
    // state to see how Score/choice would come out RIGHT NOW. Neither
    // evaluateAction nor buildChoiceDistribution mutates state, so this has
    // no effect on the next repetition's starting point.
    const needCtxs = currentNeedContexts(state);
    const scoredAversive = evaluateAction(
      aversiveAction,
      needCtxs,
      (needId) => getExpectation(state, aversiveAction.subject, needId),
      params.expectation.kC,
    );
    const scoredBaseline = evaluateAction(
      baselineAction,
      needCtxs,
      (needId) => getExpectation(state, baselineAction.subject, needId),
      params.expectation.kC,
    );
    const distribution = buildChoiceDistribution([scoredAversive, scoredBaseline], params.choice);
    const probabilityOfAversiveAction = distribution.ordered.find((o) => o.actionKey === aversiveAction.actionKey)!.probability;

    const exp = getExpectation(state, aversiveAction.subject, focusNeed);
    steps.push({
      index: i,
      mu: exp.mu,
      confidence: confidence(exp.tau, params.expectation.kC),
      boundedScore: scoredAversive.boundedScore,
      probabilityOfAversiveAction,
    });
  }

  return { finalState: state, steps };
}
