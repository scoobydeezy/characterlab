import { describe, it, expect } from 'vitest';
import { traceHash } from '../kernel/trace';
import {
  defaultScenario,
  createInitialCharacterState,
  defaultActions,
  defaultOutcomeTables,
  defaultWorldFlags,
  PERSON_MINA,
  ACTION_VISIT_GLEN,
  ACTION_VISIT_PRIYA,
  NEED_CONNECTION,
} from '../model/scenario';
import { EventClock } from '../kernel/event';
import { runAutonomousCycle } from '../model/cycle';
import { runLearnedSatisfactionExperiment } from '../experiments/learnedSatisfaction';
import { runCounterfactual } from '../experiments/counterfactual';
import { getExpectation } from '../model/character';
import { confidence } from '../model/expectation';

describe('Determinism contract — Brief §3.1', () => {
  it('repeated autonomous cycles from identical (M, S0, I, R) produce identical traces', () => {
    const config = defaultScenario('replay-seed');
    const state0 = createInitialCharacterState(config);
    const actions = defaultActions();
    const outcomeTables = defaultOutcomeTables();
    const flags = defaultWorldFlags();

    function runOnce() {
      const clock = new EventClock();
      clock.advance(1);
      return runAutonomousCycle(PERSON_MINA, state0, actions, flags, outcomeTables, config.cycleParams, clock, config.seed);
    }

    const runA = runOnce();
    const runB = runOnce();

    expect(traceHash(runA.trace)).toBe(traceHash(runB.trace));
    expect(runA.chosenAction).toBe(runB.chosenAction);
    expect(runA.nextState.needStates.get(NEED_CONNECTION)!.level.equals(runB.nextState.needStates.get(NEED_CONNECTION)!.level)).toBe(
      true,
    );
  });

  it('a different seed can (and, over enough draws, generally does) change the outcome', () => {
    const config = defaultScenario();
    const state0 = createInitialCharacterState(config);
    const actions = defaultActions();
    const outcomeTables = defaultOutcomeTables();
    const flags = defaultWorldFlags();

    const clockA = new EventClock();
    clockA.advance(1);
    const runA = runAutonomousCycle(PERSON_MINA, state0, actions, flags, outcomeTables, config.cycleParams, clockA, 'seed-1');

    const clockB = new EventClock();
    clockB.advance(1);
    const runB = runAutonomousCycle(PERSON_MINA, state0, actions, flags, outcomeTables, config.cycleParams, clockB, 'seed-2');

    // Not a strict inequality assertion on the trace hash (a different seed
    // is not *guaranteed* to change every downstream value), but the raw
    // draws themselves must differ, which is the actual determinism-
    // relevant claim: same address -> same draw, different seed -> address
    // changes -> (with overwhelming probability) different draw.
    expect(runA.trace.steps).not.toEqual(runB.trace.steps);
  });
});

describe('Brief §28 primary experiment: learned satisfaction', () => {
  it('repeated Connection-satisfying Experiences with Glen increase mu toward the effect magnitude and raise confidence', () => {
    const config = defaultScenario('learn-glen');
    const state0 = createInitialCharacterState(config);
    const glen = defaultActions().find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
    const outcome = defaultOutcomeTables().get(ACTION_VISIT_GLEN)!;

    const { finalState, steps } = runLearnedSatisfactionExperiment(
      PERSON_MINA,
      state0,
      glen,
      outcome,
      config.cycleParams,
      config.seed,
      20,
    );

    const finalExp = getExpectation(finalState, glen.subject, NEED_CONNECTION);
    const initialExp = getExpectation(state0, glen.subject, NEED_CONNECTION);

    // mu should have moved substantially toward the authored effect (0.40)
    // and away from its 0 prior.
    expect(finalExp.mu.gt(initialExp.mu)).toBe(true);
    expect(finalExp.mu.toDisplayNumber()).toBeGreaterThan(0.2);

    // confidence should have risen from 0.
    const finalConfidence = confidence(finalExp.tau, config.cycleParams.expectation.kC);
    expect(finalConfidence.toDisplayNumber()).toBeGreaterThan(0.5);

    expect(steps.length).toBe(20);
  });
});

describe('Brief §29 paired counterfactual: Glen vs. Priya', () => {
  it('identical setup, different subject, produces traceable divergence in learned expectation', () => {
    const config = defaultScenario('counterfactual-seed');
    const state0 = createInitialCharacterState(config);
    const actions = defaultActions();
    const glen = actions.find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
    const priya = actions.find((a) => a.actionKey === ACTION_VISIT_PRIYA)!;
    const outcomes = defaultOutcomeTables();

    const result = runCounterfactual(
      PERSON_MINA,
      state0,
      NEED_CONNECTION,
      glen,
      outcomes.get(ACTION_VISIT_GLEN)!,
      priya,
      outcomes.get(ACTION_VISIT_PRIYA)!,
      config.cycleParams,
      config.seed,
      20,
    );

    const last = result.comparison[result.comparison.length - 1];
    // Glen's authored effect (0.40) is larger than Priya's (0.15), so the
    // learned mu for Glen should end up clearly higher.
    expect(last.muA.gt(last.muB)).toBe(true);
    expect(last.muA.toDisplayNumber() - last.muB.toDisplayNumber()).toBeGreaterThan(0.1);
  });
});
