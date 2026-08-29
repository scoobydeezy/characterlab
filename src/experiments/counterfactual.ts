/**
 * Brief §29 Counterfactual Requirement: "Every major experiment receives a
 * paired counterfactual... The resulting behavioral difference must be
 * traceable through exact intermediate state. 'Looks plausible' is not
 * sufficient."
 *
 * Timeline A and Timeline B start from identical initial state, seed, and
 * timing, and differ ONLY in which Action's subject receives the
 * Experience each step (e.g. Glen vs. Priya). Because the counter-
 * addressed random oracle (kernel/random.ts) keys draws by EventId +
 * PurposeId — not by "which timeline is running" — both timelines draw the
 * *same* outcome noise sequence, so any divergence in learned expectation
 * or Need trajectory is attributable purely to the authored difference
 * between the two Actions' effect tables, not to incidental RNG drift.
 */

import { ConceptKey } from '../kernel/canonical';
import { CharacterState } from '../model/character';
import { ActionDef } from '../model/actions';
import { WorldOutcomeTable } from '../model/outcome';
import { CycleParams } from '../model/cycle';
import { EventClock } from '../kernel/event';
import { ExperimentStep, runLearnedSatisfactionExperiment } from './learnedSatisfaction';
import { getExpectation } from '../model/character';
import { NeedId } from '../kernel/canonical';
import { confidence } from '../model/expectation';
import { Rational } from '../kernel/rational';

export interface CounterfactualStepComparison {
  readonly index: number;
  readonly needLevelA: Rational;
  readonly needLevelB: Rational;
  readonly muA: Rational;
  readonly muB: Rational;
  readonly confidenceA: Rational;
  readonly confidenceB: Rational;
}

export interface CounterfactualResult {
  readonly timelineA: { finalState: CharacterState; steps: ExperimentStep[] };
  readonly timelineB: { finalState: CharacterState; steps: ExperimentStep[] };
  readonly comparison: readonly CounterfactualStepComparison[];
}

export function runCounterfactual(
  actor: ConceptKey,
  initialState: CharacterState,
  focusNeed: NeedId,
  actionA: ActionDef,
  outcomeTableA: WorldOutcomeTable,
  actionB: ActionDef,
  outcomeTableB: WorldOutcomeTable,
  params: CycleParams,
  seed: string,
  steps: number,
): CounterfactualResult {
  // Independent clocks so both timelines see identical logical ticks
  // (1, 2, 3, ...) regardless of execution order — required for the
  // EventId (and therefore the RNG address) to line up between timelines.
  const timelineA = runLearnedSatisfactionExperiment(
    actor,
    initialState,
    actionA,
    outcomeTableA,
    params,
    seed,
    steps,
    new EventClock(),
  );
  const timelineB = runLearnedSatisfactionExperiment(
    actor,
    initialState,
    actionB,
    outcomeTableB,
    params,
    seed,
    steps,
    new EventClock(),
  );

  const comparison: CounterfactualStepComparison[] = timelineA.steps.map((stepA, i) => {
    const stepB = timelineB.steps[i];
    const needLevelA = stepA.result.nextState.needStates.get(focusNeed)!.level;
    const needLevelB = stepB.result.nextState.needStates.get(focusNeed)!.level;
    const expA = getExpectation(stepA.result.nextState, actionA.subject, focusNeed);
    const expB = getExpectation(stepB.result.nextState, actionB.subject, focusNeed);
    return {
      index: i,
      needLevelA,
      needLevelB,
      muA: expA.mu,
      muB: expB.mu,
      confidenceA: confidence(expA.tau, params.expectation.kC),
      confidenceB: confidence(expB.tau, params.expectation.kC),
    };
  });

  return { timelineA, timelineB, comparison };
}
