/**
 * Brief §28 Phase-2 experiment: "Habit — Repeated Context → Action →
 * successful Outcome creates increasingly accessible behavior."
 *
 * This is deliberately run as a mechanism ISOLATED from Need-satisfaction
 * learning: after building the association graph through repeated
 * evening-context visits to Glen, we compute spreading activation from a
 * base vector containing ONLY the Context concept (no Need urgency at
 * all) and confirm Glen's Action concept is reachable — i.e. accessible —
 * purely because of the learned Context → Action/Person association, with
 * zero contribution from NeedExpectation. That isolation is the whole
 * point: it is what lets this experiment claim "habit" rather than just
 * re-demonstrating Phase 1's Need-satisfaction learning under a new name.
 */

import { asConceptKey } from '../kernel/canonical';
import { Rational } from '../kernel/rational';
import { CharacterState } from '../model/character';
import { ActionDef } from '../model/actions';
import { WorldOutcomeTable } from '../model/outcome';
import { CycleParams, ExperienceContext, runScriptedExperience } from '../model/cycle';
import { EventClock } from '../kernel/event';
import { solveActivation, ActivationVector } from '../model/activation';
import { CONTEXT_EVENING, ACTION_VISIT_GLEN } from '../model/scenario';
import { getWeight, rowSum } from '../model/associations';
import { ConceptKey } from '../kernel/canonical';

export interface HabitStep {
  readonly index: number;
  readonly contextToGlenWeight: Rational; // W[context.evening][action.visit_glen]
  readonly contextRowSum: Rational;
}

export interface HabitExperimentResult {
  readonly finalState: CharacterState;
  readonly steps: readonly HabitStep[];
  /** Spreading activation from a base vector containing ONLY
   * context.evening = 1 — zero Need urgency contribution — so any
   * difference between Glen's and Priya's accessibility here is
   * attributable entirely to the learned graph, not to NeedExpectation. */
  readonly contextOnlyActivation: ActivationVector;
}

export function runHabitExperiment(
  actor: ConceptKey,
  initialState: CharacterState,
  glenAction: ActionDef,
  glenOutcome: WorldOutcomeTable,
  params: CycleParams,
  seed: string,
  repetitions: number,
): HabitExperimentResult {
  const clock = new EventClock();
  const ctx: ExperienceContext = { activeConcepts: new Set([CONTEXT_EVENING]), location: null };
  const glenConcept = asConceptKey(ACTION_VISIT_GLEN);

  let state = initialState;
  const steps: HabitStep[] = [];
  for (let i = 0; i < repetitions; i++) {
    clock.advance(1);
    const result = runScriptedExperience(actor, state, glenAction, glenOutcome, params, clock, seed, ctx);
    state = result.nextState;
    steps.push({
      index: i,
      contextToGlenWeight: getWeight(state.associations, CONTEXT_EVENING, glenConcept),
      contextRowSum: rowSum(state.associations, CONTEXT_EVENING),
    });
  }

  const contextOnlyBase = new Map<ConceptKey, Rational>([[CONTEXT_EVENING, Rational.ONE]]);
  const contextOnlyActivation = solveActivation(state.associations, params.activation.beta, contextOnlyBase);

  return { finalState: state, steps, contextOnlyActivation };
}
