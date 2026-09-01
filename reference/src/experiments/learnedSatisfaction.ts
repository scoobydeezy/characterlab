/**
 * Brief §28 primary Phase-1 experiment: "Mina repeatedly experiences Glen
 * satisfying Connection." Runs N forced (scripted) Experiences of one
 * Action and returns the full per-step trace so the UI can chart μ, τ,
 * confidence, and Need level over time.
 */

import { CanonicalActionKey, ConceptKey } from '../kernel/canonical';
import { CharacterState } from '../model/character';
import { ActionDef } from '../model/actions';
import { WorldOutcomeTable } from '../model/outcome';
import { CycleParams, CycleResult, runScriptedExperience } from '../model/cycle';
import { EventClock } from '../kernel/event';

export interface ExperimentStep {
  readonly index: number;
  readonly result: CycleResult;
}

export function runLearnedSatisfactionExperiment(
  actor: ConceptKey,
  initialState: CharacterState,
  action: ActionDef,
  outcomeTable: WorldOutcomeTable,
  params: CycleParams,
  seed: string,
  steps: number,
  clock: EventClock = new EventClock(),
): { finalState: CharacterState; steps: ExperimentStep[] } {
  let state = initialState;
  const history: ExperimentStep[] = [];
  for (let i = 0; i < steps; i++) {
    clock.advance(1);
    const result = runScriptedExperience(actor, state, action, outcomeTable, params, clock, seed);
    state = result.nextState;
    history.push({ index: i, result });
  }
  return { finalState: state, steps: history };
}
