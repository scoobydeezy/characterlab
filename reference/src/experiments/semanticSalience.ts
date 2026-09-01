/**
 * Phase 2.5b experiment, Brief §13: "Semantic Footprint Experiments" —
 * the six required controlled scenarios A-F, each exercising
 * `model/salience.ts::computeSemanticSalience` against an `EffectProvenance`
 * (Phase 2.5c) rather than a hand-built `WorldEventDescriptor`. Every
 * scenario below describes only what causally/physically happened —
 * `deriveWorldEventDescriptor` is what mechanically assigns each concept's
 * `CausalRole`, and `causallyConnectedFromProvenance` mechanically derives
 * which concepts are eligible for Need relevance/surprise. No scenario here
 * hand-sets a `PerceivedConcept.role` or an `unattended` flag — the entire
 * point of Phase 2.5c is that this file could no longer do that even if it
 * wanted to.
 *
 * `phase2_5Salience.test.ts` asserts Brief §14's 8 success criteria against
 * this file's output; `phase2_5cExperienceInterpretation.test.ts` asserts
 * the three Phase 2.5c corrections directly (provenance-derived roles,
 * derived residual attention, evidence-kind-aware surprise, isolated Need
 * relevance).
 */

import { ConceptKey, conceptKey } from '../kernel/canonical';
import { Rational, ratOf } from '../kernel/rational';
import {
  SalienceParams,
  EffectProvenance,
  SurpriseEvidence,
  NeedImpact,
  SemanticSalienceResult,
  computeSemanticSalience,
  deriveWorldEventDescriptor,
  causallyConnectedFromProvenance,
} from '../model/salience';
import { NEED_CONNECTION, NEED_REST, PERSON_GLEN, LOCATION_HOME, OBJECT_LAMP, LOCATION_BAKERY } from '../model/scenario';

const ACTION_DINNER: ConceptKey = conceptKey('action.dinner_with_glen');
const ACTION_ARGUMENT: ConceptKey = conceptKey('action.argument_with_glen');
const ACTION_LAMP_FALLS: ConceptKey = conceptKey('action.lamp_falls');
const ACTION_BAKERY_HAZARD: ConceptKey = conceptKey('action.bakery_hazard_event');
const OBJECT_PAINTING: ConceptKey = conceptKey('object.painting'); // Scenario F's second Incidental fixture
const OBJECT_COAT: ConceptKey = conceptKey('object.coat'); // Scenario F's third Incidental fixture

function defaultSalienceParamsForExperiment(): SalienceParams {
  return { alphaN: ratOf(1), alphaS: ratOf(1), budgetMode: 'independent', budget: ratOf(1), hybridThreshold: ratOf(1, 2) };
}

export interface SalienceScenarioResult {
  readonly name: string;
  readonly description: string;
  readonly result: SemanticSalienceResult;
}

function z(result: SemanticSalienceResult, concept: ConceptKey): Rational {
  return result.breakdown.find((b) => b.concept === concept)?.z ?? Rational.ZERO;
}

function run(provenance: EffectProvenance, needImpacts: readonly NeedImpact[], surpriseEvidence: readonly SurpriseEvidence[], params: SalienceParams): SemanticSalienceResult {
  const descriptor = deriveWorldEventDescriptor(provenance);
  const causallyConnected = causallyConnectedFromProvenance(provenance);
  return computeSemanticSalience(descriptor, causallyConnected, needImpacts, surpriseEvidence, params);
}

/** Scenario A — Ordinary social interaction (Brief §13.A). Provenance: Mina
 * has dinner with Glen at Home; the Lamp is merely part of the scene. Glen
 * is provenance's `participants` slot (an ordinary Conversation-like
 * interaction binds its counterpart as `Participant`, not `Target` — Phase
 * 2.5c's correction to the overly generic `subject → Target` default,
 * matching `ActionDef.subjectRole` for `defaultActions()` in scenario.ts).
 * Expected qualitative hierarchy: Dinner/Glen high, Home lower, Lamp
 * negligible (Incidental role + Object category, no attention override
 * needed — distinct from Scenario F's explicit multi-Incidental gating). */
export function runScenarioA_OrdinaryInteraction(params: SalienceParams = defaultSalienceParamsForExperiment()): SalienceScenarioResult {
  const provenance: EffectProvenance = {
    sourceAction: ACTION_DINNER,
    participants: [PERSON_GLEN],
    location: LOCATION_HOME,
    incidentalConcepts: [OBJECT_LAMP],
  };
  const needImpacts: NeedImpact[] = [{ needId: NEED_CONNECTION, delta: ratOf(3, 10), urgency: ratOf(3, 5) }];
  const surpriseEvidence: SurpriseEvidence[] = [{ kind: 'point', priorMu: ratOf(3, 10), observed: ratOf(31, 100) }]; // dinner went about as expected
  const result = run(provenance, needImpacts, surpriseEvidence, params);
  return { name: 'A — Ordinary social interaction', description: 'Mina has dinner with Glen at Home. A lamp is present.', result };
}

/** Scenario B — Social conflict (Brief §13.B). Same cast as A — an argument
 * is still fundamentally a two-person Conversation-like interaction, so
 * Glen remains `Participant`, not `Target`/`Actor` (Phase 2.5c: causal
 * roles are the Action's own semantic argument structure, not a proxy for
 * "how much this event mattered psychologically" — that work is Need
 * relevance's and surprise's job, not the role's). Tests that Glen and the
 * Action still become highly salient via Need relevance + surprise alone,
 * with the incidental Lamp staying weak regardless of how dramatic the
 * Need effect gets. */
export function runScenarioB_SocialConflict(params: SalienceParams = defaultSalienceParamsForExperiment()): SalienceScenarioResult {
  const provenance: EffectProvenance = {
    sourceAction: ACTION_ARGUMENT,
    participants: [PERSON_GLEN],
    location: LOCATION_HOME,
    incidentalConcepts: [OBJECT_LAMP],
  };
  const needImpacts: NeedImpact[] = [{ needId: NEED_CONNECTION, delta: ratOf(-6, 10), urgency: ratOf(3, 5) }];
  const surpriseEvidence: SurpriseEvidence[] = [{ kind: 'point', priorMu: ratOf(3, 10), observed: ratOf(-6, 10) }]; // sharp violation of an ordinarily-positive expectation
  const result = run(provenance, needImpacts, surpriseEvidence, params);
  return { name: 'B — Social conflict', description: 'Mina argues with Glen at Home. Lamp remains incidental.', result };
}

/** Scenario C — Object becomes causal (Brief §13.C). The exact same Lamp
 * concept/category as Scenario A, only `EffectProvenance.cause` now names
 * it — tests that role (mechanically derived from provenance), not
 * category, drives the outcome (§14.1). */
export function runScenarioC_ObjectBecomesCausal(params: SalienceParams = defaultSalienceParamsForExperiment()): SalienceScenarioResult {
  const provenance: EffectProvenance = {
    sourceAction: ACTION_LAMP_FALLS,
    cause: OBJECT_LAMP,
    location: LOCATION_HOME,
  };
  const needImpacts: NeedImpact[] = [{ needId: NEED_REST, delta: ratOf(-8, 10), urgency: ratOf(4, 5) }]; // injury — severe, urgent
  const surpriseEvidence: SurpriseEvidence[] = [{ kind: 'point', priorMu: ratOf(0), observed: ratOf(-8, 10) }]; // wholly unexpected
  const result = run(provenance, needImpacts, surpriseEvidence, params);
  return { name: 'C — Object becomes causal', description: 'The lamp falls and injures Mina.', result };
}

/** Scenario D — Location becomes causal (Brief §13.D). Mirrors C but for a
 * Location concept: the same Location category that is ordinarily
 * `'Location'`-role and low-salience (Home in A/B) can become `'Cause'`
 * (via `EffectProvenance.cause`) and dominate. */
export function runScenarioD_LocationBecomesCausal(params: SalienceParams = defaultSalienceParamsForExperiment()): SalienceScenarioResult {
  const provenance: EffectProvenance = {
    sourceAction: ACTION_BAKERY_HAZARD,
    cause: LOCATION_BAKERY,
  };
  const needImpacts: NeedImpact[] = [{ needId: NEED_REST, delta: ratOf(-7, 10), urgency: ratOf(4, 5) }];
  const surpriseEvidence: SurpriseEvidence[] = [{ kind: 'point', priorMu: ratOf(0), observed: ratOf(-7, 10) }];
  const result = run(provenance, needImpacts, surpriseEvidence, params);
  return { name: 'D — Location becomes causal', description: 'A dangerous event occurs because of a hazardous Bakery environment.', result };
}

/** Scenario E — Surprise (Brief §13.E, evidence-kind-aware per Phase
 * 2.5c point 3). Identical descriptor/roles/Need impact to a plain Glen
 * interaction; only the observed Need evidence differs between the two
 * runs (both `'point'` — an unsaturated observation, so 2.5c's evidence-
 * kind branching reduces to the original `|r-μ|` formula here, exercised
 * through `SurpriseEvidence` rather than a raw prediction-error number),
 * isolating S_i's contribution. Brief §10's own worked numbers: μ=0.35;
 * an "expected" run observes 0.34 (surprise ≈ 0.01); an "unexpected" run
 * observes -0.60 (surprise ≈ 0.95). */
export function runScenarioE_Surprise(params: SalienceParams = defaultSalienceParamsForExperiment()): {
  expected: SalienceScenarioResult;
  unexpected: SalienceScenarioResult;
} {
  const provenance: EffectProvenance = {
    sourceAction: ACTION_DINNER,
    participants: [PERSON_GLEN],
    location: LOCATION_HOME,
  };
  const needImpacts: NeedImpact[] = [{ needId: NEED_CONNECTION, delta: ratOf(3, 10), urgency: ratOf(3, 5) }];
  const priorMu = ratOf(35, 100);

  const expectedResult = run(provenance, needImpacts, [{ kind: 'point', priorMu, observed: ratOf(34, 100) }], params);
  const unexpectedResult = run(provenance, needImpacts, [{ kind: 'point', priorMu, observed: ratOf(-60, 100) }], params);

  return {
    expected: { name: 'E — Surprise (expected)', description: 'Glen behaves exactly as expected.', result: expectedResult },
    unexpected: { name: 'E — Surprise (unexpected)', description: 'Glen behaves in a highly unexpected way.', result: unexpectedResult },
  };
}

/** Scenario F — Attention gating (Brief §13.F), redesigned per Phase 2.5c
 * point 2: attention is now DERIVED, not an authored `unattended` flag, so
 * "gating" is demonstrated as residual-pool competition among however many
 * `incidentalConcepts` provenance actually lists, not as a boolean any
 * scenario toggles. `withOneIncidental` and `withThreeIncidental` are
 * otherwise identical (same Action, same Participant, same Need impact,
 * same surprise evidence) — the only thing that varies is how many
 * Incidental-role concepts share `DEFAULT_ATTENTION_BY_ROLE.Incidental`'s
 * fixed pool, so any difference in the shared Lamp's resulting attention/z
 * is attributable purely to derived residual-attention competition. */
export function runScenarioF_AttentionGating(params: SalienceParams = defaultSalienceParamsForExperiment()): {
  withOneIncidental: SalienceScenarioResult;
  withThreeIncidental: SalienceScenarioResult;
} {
  const needImpacts: NeedImpact[] = [{ needId: NEED_CONNECTION, delta: ratOf(3, 10), urgency: ratOf(3, 5) }];
  const surpriseEvidence: SurpriseEvidence[] = [{ kind: 'point', priorMu: ratOf(3, 10), observed: ratOf(31, 100) }];

  const oneResult = run(
    { sourceAction: ACTION_DINNER, participants: [PERSON_GLEN], location: LOCATION_HOME, incidentalConcepts: [OBJECT_LAMP] },
    needImpacts,
    surpriseEvidence,
    params,
  );
  const threeResult = run(
    {
      sourceAction: ACTION_DINNER,
      participants: [PERSON_GLEN],
      location: LOCATION_HOME,
      incidentalConcepts: [OBJECT_LAMP, OBJECT_PAINTING, OBJECT_COAT],
    },
    needImpacts,
    surpriseEvidence,
    params,
  );

  return {
    withOneIncidental: {
      name: 'F — Attention gating (one Incidental concept)',
      description: 'Mina has dinner with Glen at Home. Only the Lamp is Incidental scenery.',
      result: oneResult,
    },
    withThreeIncidental: {
      name: 'F — Attention gating (three Incidental concepts)',
      description: 'The same dinner, but Lamp, Painting, and Coat all share the scene as Incidental scenery.',
      result: threeResult,
    },
  };
}

export { z as zOf, ACTION_DINNER, ACTION_ARGUMENT, ACTION_LAMP_FALLS, ACTION_BAKERY_HAZARD, OBJECT_PAINTING, OBJECT_COAT };

export function runAllSemanticSalienceScenarios(params: SalienceParams = defaultSalienceParamsForExperiment()): {
  a: SalienceScenarioResult;
  b: SalienceScenarioResult;
  c: SalienceScenarioResult;
  d: SalienceScenarioResult;
  e: { expected: SalienceScenarioResult; unexpected: SalienceScenarioResult };
  f: { withOneIncidental: SalienceScenarioResult; withThreeIncidental: SalienceScenarioResult };
} {
  return {
    a: runScenarioA_OrdinaryInteraction(params),
    b: runScenarioB_SocialConflict(params),
    c: runScenarioC_ObjectBecomesCausal(params),
    d: runScenarioD_LocationBecomesCausal(params),
    e: runScenarioE_Surprise(params),
    f: runScenarioF_AttentionGating(params),
  };
}
