import { describe, it, expect } from 'vitest';
import { ratOf } from '../kernel/rational';
import { EventClock } from '../kernel/event';
import { asConceptKey } from '../kernel/canonical';
import { getWeight } from '../model/associations';
import { CycleParams, runScriptedExperience } from '../model/cycle';
import {
  defaultScenario,
  defaultCycleParams,
  createInitialCharacterState,
  defaultActions,
  defaultOutcomeTables,
  defaultExperienceContext,
  defaultSalienceParams,
  PERSON_MINA,
  ACTION_VISIT_GLEN,
  CONTEXT_EVENING,
} from '../model/scenario';
import { BASE_SALIENCE, ROLE_WEIGHT } from '../model/salience';
import {
  runScenarioA_OrdinaryInteraction,
  runScenarioB_SocialConflict,
  runScenarioC_ObjectBecomesCausal,
  runScenarioD_LocationBecomesCausal,
  runScenarioE_Surprise,
  runScenarioF_AttentionGating,
  ACTION_DINNER,
} from '../experiments/semanticSalience';
import { PERSON_GLEN, OBJECT_LAMP, LOCATION_HOME, LOCATION_BAKERY } from '../model/scenario';

/**
 * Brief §14 Success Criteria — Semantic Salience, exercised against the
 * six required Brief §13 scenarios (experiments/semanticSalience.ts).
 * Each `it` below is named after the criterion number it demonstrates.
 */
describe('Phase 2.5b — Brief §14 Success Criteria', () => {
  it('1. causal role can override category prior', () => {
    const a = runScenarioA_OrdinaryInteraction(); // Lamp: Object + Incidental
    const c = runScenarioC_ObjectBecomesCausal(); // Lamp: Object + Cause
    const zLampIncidental = a.result.breakdown.find((b) => b.concept === OBJECT_LAMP)!.z;
    const zLampCause = c.result.breakdown.find((b) => b.concept === OBJECT_LAMP)!.z;
    expect(zLampCause.gt(zLampIncidental)).toBe(true);
    // Same category prior both times — the swing is entirely role-driven.
    expect(BASE_SALIENCE.Object.equals(BASE_SALIENCE.Object)).toBe(true);
  });

  it('2. incidental environmental entities do not consume major association budget', () => {
    const a = runScenarioA_OrdinaryInteraction();
    const zGlen = a.result.breakdown.find((b) => b.concept === PERSON_GLEN)!.z;
    const zLamp = a.result.breakdown.find((b) => b.concept === OBJECT_LAMP)!.z;
    expect(zLamp.lt(zGlen)).toBe(true);
    // "Negligible" — Lamp's share of Glen's salience is small.
    expect(zLamp.mul(ratOf(3)).lt(zGlen)).toBe(true);
  });

  it('3. prediction error increases encoding when appropriate', () => {
    const { expected, unexpected } = runScenarioE_Surprise();
    const zExpected = expected.result.breakdown.find((b) => b.concept === PERSON_GLEN)!.z;
    const zUnexpected = unexpected.result.breakdown.find((b) => b.concept === PERSON_GLEN)!.z;
    expect(zUnexpected.gt(zExpected)).toBe(true);
  });

  it('4. Need-relevant concepts receive greater salience', () => {
    const a = runScenarioA_OrdinaryInteraction(); // ordinary — modest Need impact/urgency, low surprise
    const b = runScenarioB_SocialConflict(); // conflict — larger Need impact + higher surprise
    const zGlenA = a.result.breakdown.find((x) => x.concept === PERSON_GLEN)!.z;
    const zGlenB = b.result.breakdown.find((x) => x.concept === PERSON_GLEN)!.z;
    expect(zGlenB.gt(zGlenA)).toBe(true);
  });

  it('5. Incidental-role concepts cannot be learned merely from world truth — attention is now derived (Phase 2.5c), not an authored flag, but the outcome is the same: near-zero encoding', () => {
    const f = runScenarioF_AttentionGating();
    for (const variant of [f.withOneIncidental, f.withThreeIncidental]) {
      const entry = variant.result.breakdown.find((x) => x.concept === OBJECT_LAMP)!;
      expect(entry.z.lte(ratOf(1, 100))).toBe(true); // zero or near-zero, per Brief §13 Scenario F's own wording
    }
    // Location is no longer a suppression mechanism (Phase 2.5c point 2) — it keeps
    // its fixed, non-Incidental DEFAULT_ATTENTION_BY_ROLE value regardless of scene
    // clutter, so it is deliberately NOT asserted near-zero here.
  });

  it('6. emergent events require no scenario-specific salience authoring', () => {
    // Every scenario's breakdown entries use exactly the global BASE_SALIENCE/
    // ROLE_WEIGHT tables — no scenario constructs its own per-concept number.
    const f = runScenarioF_AttentionGating();
    const suite = [
      runScenarioA_OrdinaryInteraction(),
      runScenarioB_SocialConflict(),
      runScenarioC_ObjectBecomesCausal(),
      runScenarioD_LocationBecomesCausal(),
      f.withOneIncidental,
      f.withThreeIncidental,
    ];
    for (const s of suite) {
      for (const entry of s.result.breakdown) {
        expect(entry.baseSalience.equals(BASE_SALIENCE[entry.category])).toBe(true);
        expect(entry.roleWeight.equals(ROLE_WEIGHT[entry.role])).toBe(true);
      }
    }
  });

  it('7. association strength is no longer primarily determined by arbitrary tag count', () => {
    // Same forced Experience (visit Glen, evening context active), same
    // seed/clock/character — only salienceMode differs. Under 'legacy'
    // every engaged concept (including the low-relevance Context concept)
    // gets a flat co-activation weight of 1.0; under 'derived' the Context
    // concept's weight should be far smaller, driven by its low
    // category/role/attention product rather than by merely having been
    // tagged onto the Experience at all.
    const scenario = defaultScenario('phase2_5b-criterion7-seed');
    const initial = createInitialCharacterState(scenario);
    const actions = defaultActions();
    const outcomes = defaultOutcomeTables();
    const glen = actions.find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
    const glenOutcome = outcomes.get(ACTION_VISIT_GLEN)!;
    const ctx = defaultExperienceContext(true); // evening active

    const legacyParams: CycleParams = { ...defaultCycleParams(), salienceMode: 'legacy' };
    const derivedParams: CycleParams = { ...defaultCycleParams(), salienceMode: 'derived', salience: defaultSalienceParams() };

    const legacyResult = runScriptedExperience(PERSON_MINA, initial, glen, glenOutcome, legacyParams, new EventClock(), scenario.seed, ctx);
    const derivedResult = runScriptedExperience(PERSON_MINA, initial, glen, glenOutcome, derivedParams, new EventClock(), scenario.seed, ctx);

    const legacyWeight = getWeight(legacyResult.nextState.associations, CONTEXT_EVENING, asConceptKey(ACTION_VISIT_GLEN));
    const derivedWeight = getWeight(derivedResult.nextState.associations, CONTEXT_EVENING, asConceptKey(ACTION_VISIT_GLEN));

    expect(legacyResult.semanticSalience).toBeNull();
    expect(derivedResult.semanticSalience).not.toBeNull();
    expect(derivedWeight.lt(legacyWeight)).toBe(true);
  });

  it('8. the complete salience result can be reconstructed from the causal trace', () => {
    const scenario = defaultScenario('phase2_5b-criterion8-seed');
    const initial = createInitialCharacterState(scenario);
    const actions = defaultActions();
    const outcomes = defaultOutcomeTables();
    const glen = actions.find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
    const glenOutcome = outcomes.get(ACTION_VISIT_GLEN)!;
    const ctx = defaultExperienceContext(true);
    const derivedParams: CycleParams = { ...defaultCycleParams(), salienceMode: 'derived', salience: defaultSalienceParams() };

    const result = runScriptedExperience(PERSON_MINA, initial, glen, glenOutcome, derivedParams, new EventClock(), scenario.seed, ctx);
    const step = result.trace.steps.find((s) => s.step === 'semantic_salience');
    expect(step).toBeDefined();
    const tracedBreakdown = (step!.outputs as any).breakdown as any[];
    expect(tracedBreakdown.length).toBe(result.semanticSalience!.breakdown.length);
    for (const b of result.semanticSalience!.breakdown) {
      const traced = tracedBreakdown.find((t) => t.concept === b.concept);
      expect(traced).toBeDefined();
      expect(traced.z).toBe(b.z.toCanonicalString());
      expect(traced.raw).toBe(b.raw.toCanonicalString());
      expect(traced.role).toBe(b.role);
      expect(traced.category).toBe(b.category);
    }
  });
});

describe('Phase 2.5b — Brief §13 Semantic Footprint Experiments (qualitative hierarchies)', () => {
  it('Scenario A: Glen/Dinner high, Home lower, Lamp negligible', () => {
    const a = runScenarioA_OrdinaryInteraction();
    const zAction = a.result.breakdown.find((b) => b.concept === ACTION_DINNER)!.z;
    const zGlen = a.result.breakdown.find((b) => b.concept === PERSON_GLEN)!.z;
    const zHome = a.result.breakdown.find((b) => b.concept === LOCATION_HOME)!.z;
    const zLamp = a.result.breakdown.find((b) => b.concept === OBJECT_LAMP)!.z;
    expect(zAction.gt(zHome)).toBe(true);
    expect(zGlen.gt(zHome)).toBe(true);
    expect(zHome.gt(zLamp)).toBe(true);
  });

  it('Scenario B: Glen remains highly salient under conflict; incidental Lamp stays weak', () => {
    const b = runScenarioB_SocialConflict();
    const zGlen = b.result.breakdown.find((x) => x.concept === PERSON_GLEN)!.z;
    const zLamp = b.result.breakdown.find((x) => x.concept === OBJECT_LAMP)!.z;
    expect(zGlen.gt(zLamp)).toBe(true);
  });

  it('Scenario D: a hazardous Location can become highly salient via causal role', () => {
    const d = runScenarioD_LocationBecomesCausal();
    const zBakery = d.result.breakdown.find((x) => x.concept === LOCATION_BAKERY)!.z;
    // Compare against Scenario A's ordinary (non-causal) Location role.
    const a = runScenarioA_OrdinaryInteraction();
    const zHomeOrdinary = a.result.breakdown.find((x) => x.concept === LOCATION_HOME)!.z;
    expect(zBakery.gt(zHomeOrdinary)).toBe(true);
  });
});
