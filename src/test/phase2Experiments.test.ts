import { describe, it, expect } from 'vitest';
import { ratOf } from '../kernel/rational';
import { asConceptKey, NeedId } from '../kernel/canonical';
import {
  PERSON_MINA,
  PERSON_GLEN,
  NEED_CONNECTION,
  CONTEXT_EVENING,
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
  legacyCycleParams,
} from '../model/scenario';
import { getWeight } from '../model/associations';
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
  it("[RETIRED-architecture control] under legacyCycleParams() (flat co-activation weight 1.0), a repeatedly co-activated Context->Action edge grows toward, and converges to exactly, an even share of the row budget", () => {
    // This test now deliberately pins legacyCycleParams() rather than relying
    // on defaultScenario()'s own cycleParams — Phase 2.5e re-baselined the
    // default to salienceMode: 'derived', under which the "exactly 1/2"
    // finding below no longer holds (see the canonical-mode test right
    // after this one). What this test documents did not stop being TRUE —
    // it stopped being what CharacterLab does by default. See RESEARCH.md's
    // Phase 2.5e entry, Habit: REFINED.
    const { scenario, initial, glenAction, glenOutcome } = setup();
    const params = legacyCycleParams();
    const result = runHabitExperiment(PERSON_MINA, initial, glenAction, glenOutcome, params, 'habit-seed', 8);

    // Monotonic growth toward the cap, never exceeding it (row-substochastic).
    for (let i = 1; i < result.steps.length; i++) {
      expect(result.steps[i].contextToGlenWeight.gte(result.steps[i - 1].contextToGlenWeight)).toBe(true);
      expect(result.steps[i].contextRowSum.lte(ratOf(1))).toBe(true);
    }
    // Converges to exactly 1/2: context.evening is co-activated with BOTH
    // action.visit_glen and person.glen every repetition, splitting the
    // row-substochastic budget evenly between the two edges — a fact about
    // FLAT-WEIGHT tagging, not about Habit's underlying psychological claim.
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

  it('[Phase 2.5e canonical re-baseline] under the current default (derived salience), the same repeated Context->Action co-Experience still makes the Action increasingly, and durably, accessible from Context alone — the 1/2 figure above was an artifact of flat tagging, not the finding itself', () => {
    const { scenario, initial, glenAction, glenOutcome } = setup();
    // scenario.cycleParams === defaultCycleParams() here — canonical since
    // Phase 2.5e — no override needed, unlike the retired-architecture test
    // above.
    const result = runHabitExperiment(PERSON_MINA, initial, glenAction, glenOutcome, scenario.cycleParams, 'habit-seed', 8);

    // Still monotonic, still row-substochastic, over the same 8 repetitions.
    for (let i = 1; i < result.steps.length; i++) {
      expect(result.steps[i].contextToGlenWeight.gte(result.steps[i - 1].contextToGlenWeight)).toBe(true);
      expect(result.steps[i].contextRowSum.lte(ratOf(1))).toBe(true);
    }

    // REFINED, not SURVIVES unchanged: under derived salience, context.evening
    // is ITSELF a low-salience Context-role concept (its own co-activation
    // weight is small), so the row never approaches saturation the way flat
    // tagging drove it to exactly 1.0 — it settles at a small fraction of the
    // row budget instead of splitting a full row evenly.
    const last = result.steps[result.steps.length - 1];
    expect(last.contextToGlenWeight.lt(ratOf(1, 4))).toBe(true); // nowhere near legacy's 1/2
    expect(last.contextRowSum.lt(ratOf(1, 2))).toBe(true); // row nowhere near saturated

    // What DOES survive: the edge to the Action (Cause role, the dominant
    // causal role weight) grows strictly stronger than the edge to the
    // merely-Participant Person, instead of the two splitting evenly —
    // association strength now reflects derived causal role, not tag count.
    const wAction = getWeight(result.finalState.associations, CONTEXT_EVENING, asConceptKey(ACTION_VISIT_GLEN));
    const wPerson = getWeight(result.finalState.associations, CONTEXT_EVENING, PERSON_GLEN);
    expect(wAction.gt(wPerson)).toBe(true);

    // The substantive Habit claim survives: repeated Context/Action
    // co-Experience makes the Action reachable from Context alone, with zero
    // contribution from Need-satisfaction learning (Priya, never associated
    // with this Context, stays at exactly 0).
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

  it("[RETIRED-architecture control] under legacyCycleParams() (naive learning), extending well past the clean regime reproduces the ceiling-saturation finding at the opposite (floor) boundary", () => {
    // Pinned to legacyCycleParams() — Phase 2.5e re-baselined the default to
    // 'censored' learning, under which this floor-corruption finding no
    // longer occurs by default (see the canonical-mode test right after this
    // one). This is now a demonstration of the bug Phase 2.5a's correction
    // fixed, not a description of current CharacterLab behavior. See
    // RESEARCH.md's Phase 2.5e entry, this finding: RETRACTED (as default
    // behavior) — the underlying naive-learning artifact it demonstrates is
    // real and reproducible, which is exactly why it is kept as a named
    // control rather than deleted.
    const { scenario, initial, glenAction, stayHomeAction } = setup();
    const NEED_REST = scenario.needDefs[1].needId as NeedId;
    const params = legacyCycleParams();
    const result = runAvoidanceExperiment(
      PERSON_MINA,
      initial,
      glenAction,
      aversiveOutcomeTable(),
      stayHomeAction,
      NEED_REST,
      params,
      'avoid-seed-long',
      7,
    );
    // By repetition 7 (2 past the clean regime), Rest has floor-clamped and
    // the observed r_n has collapsed under NAIVE learning's always-'point'
    // evidence treatment, so mu is pulled back TOWARD zero rather than
    // staying at the true -0.08 effect — mirroring Phase 1's
    // ceiling-saturation finding at the opposite boundary.
    const last = result.steps[result.steps.length - 1];
    expect(last.mu.gt(ratOf(-8, 100))).toBe(true); // less negative than the true effect
    expect(last.mu.lt(ratOf(0))).toBe(true); // but hasn't fully reverted to 0 either
  });

  it('[Phase 2.5e canonical re-baseline] under the current default (censored learning), the same floor-saturated extension no longer corrupts mu — it stays pinned at the true effect, exactly the protection Phase 2.5a\'s correction was built to provide', () => {
    const { scenario, initial, glenAction, stayHomeAction } = setup();
    const NEED_REST = scenario.needDefs[1].needId as NeedId;
    // scenario.cycleParams === defaultCycleParams() — canonical (censored)
    // since Phase 2.5e, no override needed.
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

    // mu stays pinned at exactly the true -0.08 effect through all 7
    // repetitions, floor-saturated ones included — a floor-clipped
    // observation that merely confirms what's already believed (Correction
    // 2's informativeness gate) is correctly rejected, so it can no longer
    // drag mu back toward 0 the way naive learning's always-'point'
    // treatment does above.
    for (const step of result.steps) {
      expect(step.mu.equals(ratOf(-8, 100))).toBe(true);
    }
    // Avoidance itself survives: Pr(the aversive action) still ends up
    // lower than where it started, even though confidence's OWN trajectory
    // is no longer strictly monotonic once floor-saturated, uninformative
    // repetitions stop manufacturing false confidence growth (they now
    // correctly contribute nothing, while passive precision decay keeps
    // acting between observations).
    expect(result.steps[result.steps.length - 1].probabilityOfAversiveAction.lt(result.steps[0].probabilityOfAversiveAction)).toBe(true);
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
