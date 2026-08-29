import { describe, it, expect } from 'vitest';
import { ratOf } from '../kernel/rational';
import { asConceptKey, NeedId } from '../kernel/canonical';
import {
  PERSON_MINA,
  NEED_CONNECTION,
  defaultScenario,
  createInitialCharacterState,
  defaultActions,
  defaultOutcomeTables,
  ACTION_VISIT_GLEN,
  ACTION_VISIT_PRIYA,
  ACTION_STAY_HOME,
  WORLD_FLAG_GLEN_AVAILABLE,
  WORLD_FLAG_PRIYA_AVAILABLE,
  defaultExperienceContext,
  defaultMemoryParams,
  aversiveOutcomeTable,
} from '../model/scenario';
import { runHabitExperiment } from '../experiments/habit';
import { runSubstitutionExperiment } from '../experiments/substitution';
import { runAvoidanceExperiment } from '../experiments/avoidance';
import { runMemoryAccessibilityExperiment } from '../experiments/memoryAccessibility';

function setup() {
  const scenario = defaultScenario('phase2-test-seed');
  const initial = createInitialCharacterState(scenario);
  const actions = defaultActions();
  const outcomes = defaultOutcomeTables();
  return {
    scenario,
    initial,
    actions,
    glenAction: actions.find((a) => a.actionKey === ACTION_VISIT_GLEN)!,
    priyaAction: actions.find((a) => a.actionKey === ACTION_VISIT_PRIYA)!,
    stayHomeAction: actions.find((a) => a.actionKey === ACTION_STAY_HOME)!,
    glenOutcome: outcomes.get(ACTION_VISIT_GLEN)!,
  };
}

describe('Brief §28 Phase-2 experiment: Habit', () => {
  it('a repeatedly co-activated Context->Action edge grows toward, but is capped at, an even share of the row budget', () => {
    const { scenario, initial, glenAction, glenOutcome } = setup();
    const result = runHabitExperiment(PERSON_MINA, initial, glenAction, glenOutcome, scenario.cycleParams, 'habit-seed', 8);

    // Monotonic growth toward the cap, never exceeding it (row-substochastic).
    for (let i = 1; i < result.steps.length; i++) {
      expect(result.steps[i].contextToGlenWeight.gte(result.steps[i - 1].contextToGlenWeight)).toBe(true);
      expect(result.steps[i].contextRowSum.lte(ratOf(1))).toBe(true);
    }
    // Converges to exactly 1/2: context.evening is co-activated with BOTH
    // action.visit_glen and person.glen every repetition, splitting the
    // row-substochastic budget evenly between the two edges.
    const last = result.steps[result.steps.length - 1];
    expect(last.contextToGlenWeight.equals(ratOf(1, 2))).toBe(true);
    expect(last.contextRowSum.equals(ratOf(1))).toBe(true);

    // Habit is isolated from Need-satisfaction learning: activation from a
    // Need-free, context-only base vector reaches Glen's action concept but
    // never Priya's (never associated with the evening context at all).
    const glenConcept = asConceptKey(ACTION_VISIT_GLEN);
    const priyaConcept = asConceptKey(ACTION_VISIT_PRIYA);
    expect(result.contextOnlyActivation.get(glenConcept)!.gt(ratOf(0))).toBe(true);
    expect(result.contextOnlyActivation.get(priyaConcept)!.isZero()).toBe(true);
  });
});

describe('Brief §28–29 Phase-2 experiment: Substitution (negative result)', () => {
  it("Priya's accessibility is bit-for-bit identical whether or not Glen is available — accessibility never sees world flags", () => {
    const { scenario, initial, actions, glenAction, priyaAction, glenOutcome } = setup();
    const ctx = defaultExperienceContext(true);
    const worldFlagsAvailable = new Set([WORLD_FLAG_GLEN_AVAILABLE, WORLD_FLAG_PRIYA_AVAILABLE]);
    const worldFlagsUnavailable = new Set([WORLD_FLAG_PRIYA_AVAILABLE]);

    const result = runSubstitutionExperiment(
      PERSON_MINA,
      initial,
      actions,
      glenAction,
      priyaAction,
      glenOutcome,
      scenario.cycleParams,
      'sub-seed',
      8,
      ctx,
      worldFlagsAvailable,
      worldFlagsUnavailable,
    );

    expect(result.comparison.accessibilityIdenticalRegardlessOfGlen).toBe(true);
    expect(result.comparison.priyaAccessibilityGlenAvailable.equals(result.comparison.priyaAccessibilityGlenUnavailable)).toBe(true);

    // What DOES change is precondition-based feasibility, not accessibility.
    const availableKeys = result.comparison.glenAvailableCandidates.candidates.map((c) => c.actionKey);
    const unavailableKeys = result.comparison.glenUnavailableCandidates.candidates.map((c) => c.actionKey);
    expect(availableKeys).toContain(ACTION_VISIT_GLEN);
    expect(unavailableKeys).not.toContain(ACTION_VISIT_GLEN);
    expect(unavailableKeys).toContain(priyaAction.actionKey);

    // Priya was never independently visited in this experiment, so any
    // apparent "preference" for her isn't coming from NeedExpectation either
    // — sharpening the negative result.
    expect(result.comparison.priyaHasNeverBeenVisited).toBe(true);
  });
});

describe('Brief §27/§28 Phase-2 experiment: Avoidance (derived from Phase 1 alone)', () => {
  it('Pr(a repeatedly punishing action) declines monotonically while the Need it punishes stays off the floor', () => {
    const { scenario, initial, glenAction, stayHomeAction } = setup();
    const NEED_REST = scenario.needDefs[1].needId as NeedId;

    // 5 repetitions is exactly the clean regime for aversiveOutcomeTable()'s
    // -0.08 Rest magnitude (see scenario.ts's own comment) — Rest never
    // clamps to its floor within that many repetitions, so every observed
    // r_n equals the true effect and mu should stay a stable, non-shrinking
    // negative number while confidence (and therefore certainty of
    // avoidance) rises monotonically.
    const result = runAvoidanceExperiment(
      PERSON_MINA,
      initial,
      glenAction,
      aversiveOutcomeTable(),
      stayHomeAction,
      NEED_REST,
      scenario.cycleParams,
      'avoid-seed',
      5,
    );

    expect(result.steps.length).toBe(5);
    for (let i = 1; i < result.steps.length; i++) {
      // Confidence strictly rises...
      expect(result.steps[i].confidence.gt(result.steps[i - 1].confidence)).toBe(true);
      // ...and Pr(the aversive action) strictly falls, step over step.
      expect(result.steps[i].probabilityOfAversiveAction.lt(result.steps[i - 1].probabilityOfAversiveAction)).toBe(true);
    }
    // mu should stay pinned at the true effect magnitude throughout the
    // clean (non-floor-saturated) regime, not decay back toward 0.
    for (const step of result.steps) {
      expect(step.mu.equals(ratOf(-8, 100))).toBe(true);
    }
    expect(result.steps[0].probabilityOfAversiveAction.gt(result.steps[result.steps.length - 1].probabilityOfAversiveAction)).toBe(true);
  });

  it('extending well past the clean regime reproduces the ceiling-saturation finding at the opposite (floor) boundary', () => {
    const { scenario, initial, glenAction, stayHomeAction } = setup();
    const NEED_REST = scenario.needDefs[1].needId as NeedId;
    const result = runAvoidanceExperiment(
      PERSON_MINA,
      initial,
      glenAction,
      aversiveOutcomeTable(),
      stayHomeAction,
      NEED_REST,
      scenario.cycleParams,
      'avoid-seed-long',
      7,
    );
    // By repetition 7 (2 past the clean regime), Rest has floor-clamped and
    // the observed r_n has collapsed to 0 on those later repetitions, so mu
    // is pulled back TOWARD zero rather than staying at the true -0.08
    // effect — mirroring Phase 1's ceiling-saturation finding at the
    // opposite boundary.
    const last = result.steps[result.steps.length - 1];
    expect(last.mu.gt(ratOf(-8, 100))).toBe(true); // less negative than the true effect
    expect(last.mu.lt(ratOf(0))).toBe(true); // but hasn't fully reverted to 0 either
  });
});

describe('Brief §17 Phase-2 experiment: Memory accessibility', () => {
  it('demonstrates recency, frequency/reinforcement, and decay against the exact formulas', () => {
    const result = runMemoryAccessibilityExperiment(defaultMemoryParams());

    // Recency: the more recently encoded memory starts strictly more
    // accessible despite both having exactly one retrieval.
    expect(result.recencyAtEncoding.baseB.gt(result.recencyAtEncoding.baseA)).toBe(true);

    // Decay: both memories' base accessibility strictly falls with idle time.
    expect(result.recencyAfterIdle.baseA.lt(result.recencyAtEncoding.baseA)).toBe(true);
    expect(result.recencyAfterIdle.baseB.lt(result.recencyAtEncoding.baseB)).toBe(true);

    // Frequency/reinforcement: a memory retrieved again is strictly more
    // accessible later than if it had never been reinforced.
    expect(result.reinforcement.reinforcementIncreasedBase).toBe(true);
    expect(result.reinforcement.baseAWithReinforcement.gt(result.reinforcement.baseAWithoutReinforcement)).toBe(true);

    // The reinforced memory should end up the more retrievable of the two by the end.
    expect(result.topKAtEnd[0].record.memory.memoryId).toBe('memory:a');
  });
});
