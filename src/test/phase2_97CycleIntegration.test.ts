import { describe, it, expect } from 'vitest';
import { EventClock } from '../kernel/event';
import {
  defaultDecisionScenario,
  defaultDecisionCycleParams,
  legacyDecisionCycleParams,
  defaultSemanticReasonPolarity,
  defaultReasonChannelMapping,
  defaultMotiveChannelMapping,
  defaultIdentityMotiveChannelMapping,
  dinnerVsWorkDecision,
  decisionOutcomeTables,
  ACTION_KEEP_DINNER_PROMISE,
  ACTION_STAY_AT_WORK,
} from '../model/scenario';
import { runDecisionCycle } from '../model/cycle';
import { CycleParams } from '../model/cycle';

/**
 * First real exercise of `runDecisionCycle` under `compilationMode:
 * 'reasonNuclei'` (Phase 2.97 plan's cycle.ts wiring step) — the unit tests
 * in phase2_97DiceCompiler.test.ts/phase2_97CognitiveSignals.test.ts already
 * cover the new compiler's math directly against hand-built fixtures; this
 * file is the integration check that cycle.ts's branch actually assembles
 * real RawCognitiveSignals from live CharacterState, compiles them, resolves
 * them through the shared core, and still produces a valid CycleResult with
 * a populated `reasonNucleusTrace` and everything downstream (identity
 * expression, DecisionExpression, the applyChosenAction tail) intact.
 */
describe('runDecisionCycle — reasonNuclei mode integration (Phase 2.97)', () => {
  function reasonNucleiParams(): CycleParams {
    const legacy = defaultDecisionCycleParams();
    return { ...legacy, decision: { ...legacy.decision, compilationMode: 'reasonNuclei' } };
  }

  it('resolves a Decision through the Reason Nuclei pipeline (now the canonical default), populates reasonNucleusTrace, and still runs the shared tail', () => {
    const state = defaultDecisionScenario();
    // Phase 2.97 post-closure-audit re-baseline: `defaultDecisionCycleParams()`
    // already defaults to `compilationMode: 'reasonNuclei'` now, so
    // `reasonNucleiParams()`'s own override below is redundant here — kept
    // only so this call reads the same way regardless of which default is
    // canonical at any given time, and to double as a live canary: if a
    // future change ever reverted the default, this test would still pass
    // unchanged (see the next test for the one that WOULD catch that).
    const params = reasonNucleiParams();
    const semanticPolarity = defaultSemanticReasonPolarity();
    const mapping = defaultReasonChannelMapping();
    const clock = new EventClock();
    const decision = dinnerVsWorkDecision('decision:reason-nuclei:1');
    const outcomeTables = decisionOutcomeTables();

    const result = runDecisionCycle(
      state.characterId,
      state,
      decision,
      outcomeTables,
      params,
      mapping,
      semanticPolarity,
      clock,
      'seed-reason-nuclei-a',
      undefined,
      undefined,
      defaultMotiveChannelMapping(),
      defaultIdentityMotiveChannelMapping(),
    );

    expect([ACTION_KEEP_DINNER_PROMISE, ACTION_STAY_AT_WORK]).toContain(result.decisionExpression.chosenOption);
    expect(result.decisionExpression.chosenIntent).toBe(result.decisionExpression.chosenOption);
    expect(result.nextState.decisionHistory.length).toBe(1);

    // The new trace is populated, and every recorded nucleus belongs to one
    // of this Decision's Options.
    expect(result.reasonNucleusTrace).not.toBeNull();
    const trace = result.reasonNucleusTrace!;
    for (const option of decision.options) {
      expect(trace.has(option.actionDef.actionKey)).toBe(true);
    }

    // The shared applyChosenAction tail actually ran: a real Experience,
    // Need-state change, and Memory entry exist for this cycle, exactly as
    // the legacy-mode integration test (phase2_9CycleIntegration.test.ts)
    // already checks for the old pipeline.
    expect(result.experience.action).toBe(result.decisionExpression.chosenOption);
    expect(result.nextState.memory.records.length).toBeGreaterThan(0);
    expect(result.invariantViolations).toEqual([]);
  });

  it('the canonical default (Phase 2.97 post-closure-audit re-baseline) is now reasonNuclei, not legacy', () => {
    // A deliberate canary: if a future change ever silently reverted
    // `defaultDecisionParams()`'s default back to `'legacy'`, this is the
    // one assertion that would catch it directly, rather than relying on
    // every other test's behavior happening to still make sense either way.
    const params = defaultDecisionCycleParams();
    expect(params.decision.compilationMode).toBe('reasonNuclei');
  });

  it('legacy mode (now opt-in via legacyDecisionCycleParams(), the frozen historical baseline) never populates reasonNucleusTrace', () => {
    const state = defaultDecisionScenario();
    const params = legacyDecisionCycleParams();
    expect(params.decision.compilationMode).toBe('legacy');
    const semanticPolarity = defaultSemanticReasonPolarity();
    const mapping = defaultReasonChannelMapping();
    const clock = new EventClock();
    const decision = dinnerVsWorkDecision('decision:legacy:1');
    const outcomeTables = decisionOutcomeTables();

    const result = runDecisionCycle(state.characterId, state, decision, outcomeTables, params, mapping, semanticPolarity, clock, 'seed-legacy-a');

    expect(result.reasonNucleusTrace).toBeNull();
  });

  it('throws a clear error under reasonNuclei mode when the mapping params are omitted', () => {
    const state = defaultDecisionScenario();
    const params = reasonNucleiParams();
    const semanticPolarity = defaultSemanticReasonPolarity();
    const mapping = defaultReasonChannelMapping();
    const clock = new EventClock();
    const decision = dinnerVsWorkDecision('decision:reason-nuclei-missing-mapping:1');
    const outcomeTables = decisionOutcomeTables();

    expect(() =>
      runDecisionCycle(state.characterId, state, decision, outcomeTables, params, mapping, semanticPolarity, clock, 'seed-reason-nuclei-b'),
    ).toThrow(/compilationMode 'reasonNuclei' requires/);
  });
});
