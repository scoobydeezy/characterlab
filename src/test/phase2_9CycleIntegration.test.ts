import { describe, it, expect } from 'vitest';
import { EventClock } from '../kernel/event';
import { Rational, ratOf } from '../kernel/rational';
import {
  defaultDecisionScenario,
  legacyDecisionCycleParams,
  defaultSemanticReasonPolarity,
  defaultReasonChannelMapping,
  dinnerVsWorkDecision,
  decisionOutcomeTables,
  ACTION_KEEP_DINNER_PROMISE,
  ACTION_STAY_AT_WORK,
  betrayalOutcomeTable,
  betrayalAction,
  PERSON_GLEN,
  NEED_CONNECTION,
} from '../model/scenario';
import { getIdentityEvidence, withExpectation } from '../model/character';
import { runDecisionCycle } from '../model/cycle';

/**
 * First real exercise of `runDecisionCycle` wired through
 * `defaultDecisionScenario()` — the unit tests in phase2_9Decision.test.ts
 * and phase2_9Identity.test.ts exercise decision.ts/identity.ts's pure math
 * directly, against hand-built fixtures; this file is the integration
 * check that cycle.ts's glue (assembling real Influences from live
 * CharacterState, folding identity evidence back, and handing off to the
 * shared applyChosenAction tail) actually works end-to-end.
 *
 * Phase 2.97 post-closure-audit re-baseline: pinned to
 * `legacyDecisionCycleParams()` explicitly, not `defaultDecisionCycleParams()`
 * (now `'reasonNuclei'` by default) — this file tests the Phase 2.9/2.95
 * `SemanticReasonChannelId` pipeline specifically (note `defaultReasonChannelMapping()`
 * above, that pipeline's own mapping table), and its plain `runDecisionCycle`
 * calls never supply the mapping tables `'reasonNuclei'` mode requires.
 */
describe('runDecisionCycle — integration (Phase 2.9 / 2.95)', () => {
  it('resolves a Decision, records a DecisionExpression, and advances the underlying Need/expectation/memory/association state', () => {
    const state = defaultDecisionScenario();
    const params = legacyDecisionCycleParams();
    const semanticPolarity = defaultSemanticReasonPolarity();
    const mapping = defaultReasonChannelMapping();
    const clock = new EventClock();
    const decision = dinnerVsWorkDecision('decision:test:1');
    const outcomeTables = decisionOutcomeTables();

    const result = runDecisionCycle(state.characterId, state, decision, outcomeTables, params, mapping, semanticPolarity, clock, 'seed-a');

    expect(result.decisionExpression.decisionId).toBe('decision:test:1');
    expect([ACTION_KEEP_DINNER_PROMISE, ACTION_STAY_AT_WORK]).toContain(result.decisionExpression.chosenOption);
    expect(result.decisionExpression.chosenIntent).toBe(result.decisionExpression.chosenOption);
    expect(result.nextState.decisionHistory.length).toBe(1);
    expect(result.nextState.decisionHistory[0]).toBe(result.decisionExpression);
    // The shared applyChosenAction tail actually ran: a real Experience,
    // Need-state change, and Memory entry exist for this cycle.
    expect(result.experience.action).toBe(result.decisionExpression.chosenOption);
    expect(result.nextState.memory.records.length).toBeGreaterThan(0);
    expect(result.invariantViolations).toEqual([]);
  });

  it('is deterministic: the same seed/state/decisionId reproduces the same resolution and chosen option', () => {
    const state = defaultDecisionScenario();
    const params = legacyDecisionCycleParams();
    const semanticPolarity = defaultSemanticReasonPolarity();
    const mapping = defaultReasonChannelMapping();
    const decision = dinnerVsWorkDecision('decision:test:determinism');
    const outcomeTables = decisionOutcomeTables();

    const r1 = runDecisionCycle(state.characterId, state, decision, outcomeTables, params, mapping, semanticPolarity, new EventClock(), 'seed-fixed');
    const r2 = runDecisionCycle(state.characterId, state, decision, outcomeTables, params, mapping, semanticPolarity, new EventClock(), 'seed-fixed');

    expect(r1.decisionExpression.chosenOption).toBe(r2.decisionExpression.chosenOption);
    expect(r1.decisionExpression.resolutionMode).toBe(r2.decisionExpression.resolutionMode);
    expect(r1.decisionExpression.authorshipPotential.equals(r2.decisionExpression.authorshipPotential)).toBe(true);
    for (let i = 0; i < r1.decisionExpression.influenceRolls.length; i++) {
      expect(r1.decisionExpression.influenceRolls[i].rollValue).toBe(r2.decisionExpression.influenceRolls[i].rollValue);
    }
  });

  it('folds a nonzero identity expression into identityEvidence when the Decision was genuinely contested', () => {
    // Bias hard toward Keep Dinner so its own tagged pressure clearly wins,
    // guaranteeing a nonzero, well-signed CommitmentFidelity Alignment
    // regardless of which way any close roll breaks.
    let state = defaultDecisionScenario();
    state = withExpectation(state, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(9, 10), tau: ratOf(10), lastUpdatedAt: 0 });

    const params = legacyDecisionCycleParams();
    const semanticPolarity = defaultSemanticReasonPolarity();
    const mapping = defaultReasonChannelMapping();
    const decision = dinnerVsWorkDecision('decision:test:identity');
    const outcomeTables = decisionOutcomeTables();

    const result = runDecisionCycle(state.characterId, state, decision, outcomeTables, params, mapping, semanticPolarity, new EventClock(), 'seed-identity');

    if (result.decisionExpression.chosenOption === ACTION_KEEP_DINNER_PROMISE && result.decisionExpression.authorshipPotential.gt(Rational.ZERO)) {
      const evidence = getIdentityEvidence(result.nextState, 'CommitmentFidelity');
      expect(evidence.support.gt(Rational.ZERO)).toBe(true);
    }
  });

  it("Experiment K's shape: forcedOutcomeOverride executes a DIFFERENT ActionDef while ChosenIntent/DecisionExpression still record the dice-selected Option", () => {
    const state = defaultDecisionScenario();
    const params = legacyDecisionCycleParams();
    const semanticPolarity = defaultSemanticReasonPolarity();
    const mapping = defaultReasonChannelMapping();
    const decision = dinnerVsWorkDecision('decision:test:forced');
    const outcomeTables = decisionOutcomeTables();

    // First resolve normally to discover which Option this seed selects.
    const baseline = runDecisionCycle(state.characterId, state, decision, outcomeTables, params, mapping, semanticPolarity, new EventClock(), 'seed-k');
    const intendedOption = baseline.decisionExpression.chosenOption;

    // Now force a DIFFERENT physical outcome (the betrayal table, an
    // unrelated WorldOutcomeTable) while keeping the same seed/decision —
    // the resolution (and therefore ChosenIntent) must be identical.
    const forced = { actionDef: betrayalAction(), outcomeTable: betrayalOutcomeTable() };
    const result = runDecisionCycle(
      state.characterId,
      state,
      decision,
      outcomeTables,
      params,
      mapping,
      semanticPolarity,
      new EventClock(),
      'seed-k',
      undefined,
      forced,
    );

    expect(result.decisionExpression.chosenIntent).toBe(intendedOption);
    expect(result.decisionExpression.chosenOption).toBe(intendedOption);
    // The physically EXECUTED action was the forced override, not the intent.
    expect(result.experience.action).toBe(forced.actionDef.actionKey);
    expect(result.experience.action).not.toBe(intendedOption);
  });
});
