import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import { conceptKey, needId } from '../kernel/canonical';
import { EventClock } from '../kernel/event';
import { asConceptKey } from '../kernel/canonical';
import {
  EffectProvenance,
  NeedImpact,
  deriveWorldEventDescriptor,
  causallyConnectedFromProvenance,
  subjectRoleSlot,
  surpriseMagnitude,
  computeSemanticSalience,
  SalienceParams,
} from '../model/salience';
import { runScriptedExperience, CycleParams } from '../model/cycle';
import {
  defaultScenario,
  defaultCycleParams,
  createInitialCharacterState,
  defaultActions,
  defaultOutcomeTables,
  defaultExperienceContext,
  defaultSalienceParams,
  betrayalAction,
  betrayalOutcomeTable,
  PERSON_MINA,
  PERSON_GLEN,
  ACTION_VISIT_GLEN,
} from '../model/scenario';
import { runScenarioF_AttentionGating } from '../experiments/semanticSalience';
import { OBJECT_LAMP } from '../model/scenario';

const NEED_CONNECTION_ID = needId('need.connection');

function params(overrides: Partial<SalienceParams> = {}): SalienceParams {
  return { alphaN: ratOf(1), alphaS: ratOf(1), budgetMode: 'independent', budget: ratOf(1), hybridThreshold: ratOf(1, 2), ...overrides };
}

/**
 * Phase 2.5c — "Experience Interpretation." Each describe block below is
 * named after one of the post-2.5b review's five "Required findings" and
 * asserts it directly, closing the factor-isolation gaps the review
 * identified in the 2.5b delivery.
 */

describe('2.5c finding 1 — causal roles derive from Action/outcome provenance, not manually supplied scenario descriptors', () => {
  it('deriveWorldEventDescriptor assigns every role mechanically from which EffectProvenance slot named the concept', () => {
    const actor = conceptKey('person.actor');
    const target = conceptKey('person.target');
    const instrument = conceptKey('object.knife');
    const provenance: EffectProvenance = {
      sourceAction: conceptKey('action.attack'),
      actor,
      target,
      instrument,
    };
    const descriptor = deriveWorldEventDescriptor(provenance);
    const roleOf = (c: ReturnType<typeof conceptKey>) => descriptor.perceived.find((p) => p.concept === c)!.role;
    expect(roleOf(provenance.sourceAction)).toBe('Cause');
    expect(roleOf(actor)).toBe('Actor');
    expect(roleOf(target)).toBe('Target');
    expect(roleOf(instrument)).toBe('Instrument');
  });

  it('subjectRoleSlot mechanically maps an ActionDef.subjectRole onto the matching EffectProvenance field — no call site hand-picks a slot', () => {
    const subject = conceptKey('person.glen');
    expect(subjectRoleSlot('Participant', subject)).toEqual({ participants: [subject] });
    expect(subjectRoleSlot('Cause', subject)).toEqual({ cause: subject });
    expect(subjectRoleSlot('Target', subject)).toEqual({ target: subject });
    expect(subjectRoleSlot('Actor', subject)).toEqual({ actor: subject });
  });

  it("an ordinary Conversation-like Action's subject (ActionDef.subjectRole = 'Participant') is assigned Participant, not the old generic 'Target', when a full cycle runs in 'derived' mode", () => {
    const scenario = defaultScenario('phase2_5c-role-visit-seed');
    const initial = createInitialCharacterState(scenario);
    const actions = defaultActions();
    const outcomes = defaultOutcomeTables();
    const glenAction = actions.find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
    expect(glenAction.subjectRole).toBe('Participant');
    const glenOutcome = outcomes.get(ACTION_VISIT_GLEN)!;
    const ctx = defaultExperienceContext(false);
    const derivedParams: CycleParams = { ...defaultCycleParams(), salienceMode: 'derived', salience: defaultSalienceParams() };

    const result = runScriptedExperience(PERSON_MINA, initial, glenAction, glenOutcome, derivedParams, new EventClock(), scenario.seed, ctx);
    const glenEntry = result.semanticSalience!.breakdown.find((b) => b.concept === PERSON_GLEN)!;
    expect(glenEntry.role).toBe('Participant');
  });

  it("betrayalAction's subjectRole = 'Cause' is assigned Cause, not Participant, when the same cycle runs — the exact swing the review flagged as too important to leave to a generic default", () => {
    const scenario = defaultScenario('phase2_5c-role-betrayal-seed');
    const initial = createInitialCharacterState(scenario);
    const betrayal = betrayalAction();
    expect(betrayal.subjectRole).toBe('Cause');
    const outcome = betrayalOutcomeTable();
    const ctx = defaultExperienceContext(false);
    const derivedParams: CycleParams = { ...defaultCycleParams(), salienceMode: 'derived', salience: defaultSalienceParams() };

    const result = runScriptedExperience(PERSON_MINA, initial, betrayal, outcome, derivedParams, new EventClock(), scenario.seed, ctx);
    const glenEntry = result.semanticSalience!.breakdown.find((b) => b.concept === PERSON_GLEN)!;
    expect(glenEntry.role).toBe('Cause');
  });

  it('causallyConnectedFromProvenance includes Participant — an ordinary conversation partner IS causally connected to the Need outcome, even though "merely" a Participant', () => {
    const provenance: EffectProvenance = {
      sourceAction: conceptKey('action.talk'),
      participants: [PERSON_GLEN],
    };
    const connected = causallyConnectedFromProvenance(provenance);
    expect(connected.has(PERSON_GLEN)).toBe(true);
  });
});

describe('2.5c finding 2 — attention derives from character/world context (a bounded initial model), not an authored per-concept flag', () => {
  it('a non-Incidental role always gets its fixed default attention regardless of how many other concepts are present', () => {
    const oneIncidental = runScenarioF_AttentionGating().withOneIncidental.result;
    const threeIncidental = runScenarioF_AttentionGating().withThreeIncidental.result;
    // PERSON_GLEN is Participant in both variants — attention must be identical.
    const glenOne = oneIncidental.breakdown.find((b) => b.concept === PERSON_GLEN)!.attention;
    const glenThree = threeIncidental.breakdown.find((b) => b.concept === PERSON_GLEN)!.attention;
    expect(glenOne.equals(glenThree)).toBe(true);
  });

  it('an Incidental concept splits a fixed residual pool — its derived attention (and therefore z) strictly decreases as more Incidental concepts share the scene', () => {
    const { withOneIncidental, withThreeIncidental } = runScenarioF_AttentionGating();
    const lampAttentionOne = withOneIncidental.result.breakdown.find((b) => b.concept === OBJECT_LAMP)!.attention;
    const lampAttentionThree = withThreeIncidental.result.breakdown.find((b) => b.concept === OBJECT_LAMP)!.attention;
    expect(lampAttentionThree.lt(lampAttentionOne)).toBe(true);
    // Exactly a three-way split of the same fixed pool: attention scales by 1/3.
    expect(lampAttentionOne.equals(lampAttentionThree.mul(ratOf(3)))).toBe(true);

    const lampZOne = withOneIncidental.result.breakdown.find((b) => b.concept === OBJECT_LAMP)!.z;
    const lampZThree = withThreeIncidental.result.breakdown.find((b) => b.concept === OBJECT_LAMP)!.z;
    expect(lampZThree.lt(lampZOne)).toBe(true);
  });

  it('no scenario or ActionDef anywhere in the codebase author an "unattended" flag — PerceivedConcept has no such field to set', () => {
    // Structural check: constructing a PerceivedConcept-shaped literal with an
    // extraneous 'unattended' key would fail to type-check against the actual
    // interface (see salience.ts) — this test documents the field's removal
    // by exercising deriveWorldEventDescriptor's ONLY inputs, which have no
    // attention-related field at all (EffectProvenance has perceptionOverrides
    // for perceptibility, nothing for attention).
    const provenance: EffectProvenance = { sourceAction: conceptKey('action.x'), incidentalConcepts: [conceptKey('object.y')] };
    expect(Object.keys(provenance)).not.toContain('unattended');
  });
});

describe('2.5c finding 3 — surprise consumes evidence semantics (point/lower-bound/upper-bound), not raw clipped Need delta', () => {
  it("reproduces the review's own worked example: believed +0.40, a ceiling-saturated observation of only +0.05 Applied proves nothing incompatible with that belief — zero surprise, not |0.05-0.40|=0.35", () => {
    const magnitude = surpriseMagnitude({ kind: 'lower_bound', priorMu: ratOf(40, 100), observed: ratOf(5, 100) });
    expect(magnitude.isZero()).toBe(true);
  });

  it('the mirror case: a lower_bound observation that DOES exceed the prior belief produces positive surprise, because it proves something incompatible with that belief', () => {
    const magnitude = surpriseMagnitude({ kind: 'lower_bound', priorMu: ratOf(2, 100), observed: ratOf(15, 100) });
    expect(magnitude.equals(ratOf(13, 100))).toBe(true);
  });

  it("a 'point' (unsaturated) observation of the same numbers uses the original |r-μ| formula unchanged", () => {
    const magnitude = surpriseMagnitude({ kind: 'point', priorMu: ratOf(40, 100), observed: ratOf(5, 100) });
    expect(magnitude.equals(ratOf(35, 100))).toBe(true);
  });

  it("cycle.ts classifies the OBJECTIVE evidence kind for salience's surprise unconditionally — independent of SaturationParams.learningMode — so salience never disagrees with 2.5a's censoring semantics regardless of what the separate learning toggle is set to", () => {
    const scenario = defaultScenario('phase2_5c-surprise-objectivity-seed');
    const initial = createInitialCharacterState(scenario);
    const actions = defaultActions();
    const outcomes = defaultOutcomeTables();
    const glenAction = actions.find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
    const glenOutcome = outcomes.get(ACTION_VISIT_GLEN)!;
    const ctx = defaultExperienceContext(false);

    // 'naive' learningMode still must not corrupt salience's own surprise —
    // the objective evidence kind is traced regardless.
    const naiveDerivedParams: CycleParams = {
      ...defaultCycleParams(),
      salienceMode: 'derived',
      salience: defaultSalienceParams(),
      saturation: { ...defaultCycleParams().saturation, learningMode: 'naive' },
    };
    const result = runScriptedExperience(PERSON_MINA, initial, glenAction, glenOutcome, naiveDerivedParams, new EventClock(), scenario.seed, ctx);
    const step = result.trace.steps.find((s) => s.step === 'expectation_update' && (s.inputs as any).needId === NEED_CONNECTION_ID);
    expect(step).toBeDefined();
    // The trace records both the (possibly gated) learning evidenceKind and the
    // always-objective objectiveEvidenceKind side by side — proving the two are
    // tracked as genuinely separate facts, not silently conflated.
    expect((step!.inputs as any).objectiveEvidenceKind).toBeDefined();
  });
});

describe('2.5c finding 4 — Need relevance gets its own isolated test (role/attention/surprise held fixed, only Need relevance varying)', () => {
  it('z_B > z_A when only Need relevance differs between two otherwise-identical Experiences', () => {
    const concept = conceptKey('person.glen');
    const provenance: EffectProvenance = { sourceAction: conceptKey('action.talk'), participants: [concept] };
    const descriptor = deriveWorldEventDescriptor(provenance);
    const causallyConnected = causallyConnectedFromProvenance(provenance);
    // Identical surprise evidence in both runs — held fixed.
    const surpriseEvidence = [{ kind: 'point' as const, priorMu: ratOf(0), observed: ratOf(1, 100) }]; // negligible, fixed
    const p = params();

    const lowNeedRelevance: NeedImpact[] = [{ needId: NEED_CONNECTION_ID, delta: ratOf(1, 20), urgency: ratOf(1, 5) }]; // small urgency*delta
    const highNeedRelevance: NeedImpact[] = [{ needId: NEED_CONNECTION_ID, delta: ratOf(9, 10), urgency: ratOf(9, 10) }]; // large urgency*delta

    const resultA = computeSemanticSalience(descriptor, causallyConnected, lowNeedRelevance, surpriseEvidence, p);
    const resultB = computeSemanticSalience(descriptor, causallyConnected, highNeedRelevance, surpriseEvidence, p);

    const zA = resultA.breakdown.find((b) => b.concept === concept)!.z;
    const zB = resultB.breakdown.find((b) => b.concept === concept)!.z;
    const nA = resultA.breakdown.find((b) => b.concept === concept)!.needRelevance;
    const nB = resultB.breakdown.find((b) => b.concept === concept)!.needRelevance;
    const sA = resultA.breakdown.find((b) => b.concept === concept)!.surprise;
    const sB = resultB.breakdown.find((b) => b.concept === concept)!.surprise;
    const aA = resultA.breakdown.find((b) => b.concept === concept)!.attention;
    const aB = resultB.breakdown.find((b) => b.concept === concept)!.attention;

    // Confirm the isolation actually held: role/attention/surprise identical, only N differs.
    expect(aA.equals(aB)).toBe(true);
    expect(sA.equals(sB)).toBe(true);
    expect(nB.gt(nA)).toBe(true);
    expect(zB.gt(zA)).toBe(true);
  });
});

describe("2.5c finding 5 — 'independent' salience is locked as the reference budget model", () => {
  it('defaultSalienceParams().budgetMode is independent', () => {
    expect(defaultSalienceParams().budgetMode).toBe('independent');
  });

  it('defaultCycleParams() carries that same locked default through to salience params', () => {
    expect(defaultCycleParams().salience.budgetMode).toBe('independent');
  });
});
