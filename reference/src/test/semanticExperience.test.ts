import { describe, it, expect } from 'vitest';
import { Rational } from '../kernel/rational';
import { EventClock } from '../kernel/event';
import {
  defaultScenario,
  createInitialCharacterState,
  defaultActions,
  defaultOutcomeTables,
  defaultExperienceContext,
  legacyCycleParams,
  PERSON_MINA,
  PERSON_GLEN,
  ACTION_VISIT_GLEN,
  NEED_CONNECTION,
} from '../model/scenario';
import { runScriptedExperience, CycleParams } from '../model/cycle';

/**
 * Phase 2.5e — SemanticExperience (model/semanticExperience.ts), the
 * formalized consolidation object this phase's re-baseline introduces.
 * These tests check that it is actually built from, and agrees with, the
 * same data cycle.ts already exposes on `saturationAnalysis`/
 * `semanticSalience` — a packaging change, not a new computation — and that
 * the one deliberate exclusion (no `overflow` field, anywhere) holds
 * structurally, not just by convention.
 */

function setup() {
  const scenario = defaultScenario('phase2_5e-semantic-experience-seed');
  const initial = createInitialCharacterState(scenario);
  const glenAction = defaultActions().find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
  const glenOutcome = defaultOutcomeTables().get(ACTION_VISIT_GLEN)!;
  const ctx = defaultExperienceContext(false);
  return { scenario, initial, glenAction, glenOutcome, ctx };
}

describe('Phase 2.5e — SemanticExperience is null under legacy mode, populated under canonical (derived) mode', () => {
  it('is null when salienceMode is legacy — nothing character-relative was derived to report', () => {
    const { initial, glenAction, glenOutcome, ctx } = setup();
    const params = legacyCycleParams();
    const result = runScriptedExperience(PERSON_MINA, initial, glenAction, glenOutcome, params, new EventClock(), 'seed', ctx);
    expect(result.semanticSalience).toBeNull();
    expect(result.semanticExperience).toBeNull();
  });

  it('is populated under the canonical default (scenario.cycleParams === defaultCycleParams, salienceMode: derived)', () => {
    const { scenario, initial, glenAction, glenOutcome, ctx } = setup();
    expect(scenario.cycleParams.salienceMode).toBe('derived'); // Phase 2.5e canonical default
    const result = runScriptedExperience(PERSON_MINA, initial, glenAction, glenOutcome, scenario.cycleParams, new EventClock(), scenario.seed, ctx);
    expect(result.semanticExperience).not.toBeNull();
  });
});

describe('Phase 2.5e — SemanticExperience agrees with the existing granular fields it is packaged from', () => {
  it('experienceId/actor/occurredAt/action/budgetMode match the Experience and semanticSalience it was built alongside', () => {
    const { scenario, initial, glenAction, glenOutcome, ctx } = setup();
    const clock = new EventClock();
    clock.advance(1);
    const result = runScriptedExperience(PERSON_MINA, initial, glenAction, glenOutcome, scenario.cycleParams, clock, scenario.seed, ctx);
    const se = result.semanticExperience!;

    expect(se.experienceId).toBe(result.experience.experienceId);
    expect(se.actor).toBe(PERSON_MINA);
    expect(se.occurredAt).toBe(result.experience.occurredAt);
    expect(se.action).toBe(ACTION_VISIT_GLEN);
    expect(se.budgetMode).toBe(result.semanticSalience!.budgetMode);
  });

  it("conceptEncodings is exactly semanticSalience.breakdown's fields projected (concept/category/role/perceived/attention/salience)", () => {
    const { scenario, initial, glenAction, glenOutcome, ctx } = setup();
    const result = runScriptedExperience(PERSON_MINA, initial, glenAction, glenOutcome, scenario.cycleParams, new EventClock(), scenario.seed, ctx);
    const se = result.semanticExperience!;
    const breakdown = result.semanticSalience!.breakdown;

    expect(se.conceptEncodings.length).toBe(breakdown.length);
    for (const b of breakdown) {
      const enc = se.conceptEncodings.find((c) => c.concept === b.concept)!;
      expect(enc).toBeDefined();
      expect(enc.category).toBe(b.category);
      expect(enc.role).toBe(b.role);
      expect(enc.perceived).toBe(b.perceived);
      expect(enc.attention.equals(b.attention)).toBe(true);
      expect(enc.salience.equals(b.z)).toBe(true);
    }
  });

  it("needObservations' applied/evidenceKind agree with saturationAnalysis (Applied) and the trace's objectiveEvidenceKind", () => {
    const { scenario, initial, glenAction, glenOutcome, ctx } = setup();
    const result = runScriptedExperience(PERSON_MINA, initial, glenAction, glenOutcome, scenario.cycleParams, new EventClock(), scenario.seed, ctx);
    const se = result.semanticExperience!;

    for (const sat of result.saturationAnalysis) {
      const obs = se.needObservations.find((o) => o.needId === sat.needId)!;
      expect(obs).toBeDefined();
      expect(obs.applied.equals(sat.applied)).toBe(true);
      const expectedKind = sat.saturated === 'ceiling' ? 'lower_bound' : sat.saturated === 'floor' ? 'upper_bound' : 'point';
      expect(obs.evidenceKind).toBe(expectedKind);
    }
    // Connection's Applied here is unsaturated (Glen's effect fits within
    // headroom from this scenario's initial Level) — a concrete 'point'
    // case alongside the generic cross-check above.
    const connection = se.needObservations.find((o) => o.needId === NEED_CONNECTION)!;
    expect(connection.evidenceKind).toBe('point');
    expect(connection.surprise.gte(Rational.ZERO)).toBe(true);
  });

  it('PERSON_GLEN is causally connected and present in conceptEncodings with the Participant role (ordinary visit)', () => {
    const { scenario, initial, glenAction, glenOutcome, ctx } = setup();
    const result = runScriptedExperience(PERSON_MINA, initial, glenAction, glenOutcome, scenario.cycleParams, new EventClock(), scenario.seed, ctx);
    const se = result.semanticExperience!;
    const glenEncoding = se.conceptEncodings.find((c) => c.concept === PERSON_GLEN)!;
    expect(glenEncoding).toBeDefined();
    expect(glenEncoding.role).toBe('Participant');
    expect(glenEncoding.perceived).toBe(true);
  });
});

describe('Phase 2.5e — Overflow is structurally absent from SemanticExperience', () => {
  it('no NeedObservation carries an "overflow" key, even though saturationAnalysis (the world-truth side) does', () => {
    const { scenario, initial, glenAction, glenOutcome, ctx } = setup();
    const result = runScriptedExperience(PERSON_MINA, initial, glenAction, glenOutcome, scenario.cycleParams, new EventClock(), scenario.seed, ctx);
    const se = result.semanticExperience!;

    for (const obs of se.needObservations) {
      expect(Object.keys(obs)).not.toContain('overflow');
    }
    // Contrast: the world-truth ledger DOES carry Overflow — the exclusion
    // above is a deliberate design choice on SemanticExperience specifically,
    // not an accident of Overflow being unavailable anywhere in CycleResult.
    expect(result.saturationAnalysis.length).toBeGreaterThan(0);
    expect(Object.keys(result.saturationAnalysis[0])).toContain('overflow');
  });
});

describe('Phase 2.5e — CycleParams identity checks: canonical vs. retired-legacy', () => {
  it('legacyCycleParams() reproduces the pre-2.5e default exactly (naive + legacy)', () => {
    const legacy = legacyCycleParams();
    expect(legacy.saturation.learningMode).toBe('naive');
    expect(legacy.salienceMode).toBe('legacy');
  });

  it('defaultCycleParams() (via defaultScenario) is the canonical default (censored + derived)', () => {
    const { scenario } = setup();
    expect(scenario.cycleParams.saturation.learningMode).toBe('censored');
    expect(scenario.cycleParams.salienceMode).toBe('derived');
  });
});
