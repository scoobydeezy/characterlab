/**
 * Phase 2.9 experiments A, B, C, D, K — Brief §30's "Required Experiment
 * Suite," the Decision-mechanics half (identity-formation experiments E,
 * G, H, I, J live in identityFormation.ts; the flagship seed-divergence
 * experiment F lives in seedDivergence.ts). Every case below runs the real
 * `runDecisionCycle` pipeline end-to-end against `defaultDecisionScenario()`
 * — never `resolveDecision` called directly with hand-picked Influences —
 * so each verification is checked against what the live cognitive cycle
 * actually produces, per this project's "don't trust code inspection where
 * a runnable test is possible" norm (saturationSalienceInteraction.ts's own
 * words).
 *
 * All five cases share ONE harness (`runDecisionSample`): start from
 * `defaultDecisionScenario()`'s baseline (already tuned so the dinner-vs-
 * work axis starts near-contested), apply a case-specific NeedExpectation/
 * NeedLevel override, then resolve the dinner-vs-work Decision through
 * `runDecisionCycle`. Each case varies exactly the one thing its letter is
 * named after.
 *
 * Phase 2.97 post-closure-audit re-baseline: `runDecisionSample` is pinned
 * to `legacyDecisionCycleParams()` explicitly, not `defaultDecisionCycleParams()`
 * (now `'reasonNuclei'` by default) — this file's own published numbers were
 * measured against the frozen `'legacy'` pipeline, and its `runDecisionCycle`
 * call never supplies the mapping tables `'reasonNuclei'` mode requires.
 */

import { ratOf } from '../kernel/rational';
import { EventClock } from '../kernel/event';
import { CharacterState, withExpectation, withNeedLevel } from '../model/character';
import { ActionDef } from '../model/actions';
import { WorldOutcomeTable } from '../model/outcome';
import { Decision, DecisionExpression, DecisionParams } from '../model/decision';
import { CycleParams, runDecisionCycle } from '../model/cycle';
import {
  defaultDecisionScenario,
  legacyDecisionCycleParams,
  defaultSemanticReasonPolarity,
  defaultReasonChannelMapping,
  dinnerVsWorkDecision,
  decisionOutcomeTables,
  betrayalAction,
  betrayalOutcomeTable,
  PERSON_GLEN,
  NEED_CONNECTION,
  ACTIVITY_WORK,
  NEED_ACHIEVEMENT,
} from '../model/scenario';

export interface DecisionSample {
  readonly label: string;
  readonly decisionExpression: DecisionExpression;
  readonly nextState: CharacterState;
  readonly executedAction: ActionDef;
}

/** Shared machinery for every case below: fresh `defaultDecisionScenario()`
 * baseline, a case-specific state override, then the real dinner-vs-work
 * Decision resolved through `runDecisionCycle`. `paramsOverride` lets a
 * case adjust `DecisionParams` thresholds directly (none of A-D/K need to);
 * `forcedOutcomeOverride` is Experiment K's own mechanism. */
function runDecisionSample(
  label: string,
  decisionId: string,
  stateOverride: (s: CharacterState) => CharacterState,
  seed: string,
  decisionFactory: (id: string) => Decision = dinnerVsWorkDecision,
  paramsOverride?: Partial<DecisionParams>,
  forcedOutcomeOverride?: { readonly actionDef: ActionDef; readonly outcomeTable: WorldOutcomeTable },
): DecisionSample {
  const base = defaultDecisionScenario();
  const state = stateOverride(base);
  const params: CycleParams = paramsOverride
    ? { ...legacyDecisionCycleParams(), decision: { ...legacyDecisionCycleParams().decision, ...paramsOverride } }
    : legacyDecisionCycleParams();
  const semanticPolarity = defaultSemanticReasonPolarity();
  const decision = decisionFactory(decisionId);
  const outcomeTables = decisionOutcomeTables();
  const clock = new EventClock();
  const mapping = defaultReasonChannelMapping();
  const result = runDecisionCycle(
    state.characterId,
    state,
    decision,
    outcomeTables,
    params,
    mapping,
    semanticPolarity,
    clock,
    seed,
    undefined,
    forcedOutcomeOverride,
  );
  const executedAction =
    forcedOutcomeOverride?.actionDef ?? decision.options.find((o) => o.actionDef.actionKey === result.chosenAction)!.actionDef;
  return { label, decisionExpression: result.decisionExpression, nextState: result.nextState, executedAction };
}

// ---------------------------------------------------------------------------
// Experiment A — Residual uncertainty (Brief §30)
// ---------------------------------------------------------------------------

export interface ExperimentAResult {
  readonly sample: DecisionSample;
  readonly bothProbabilitiesNontrivial: boolean;
  readonly usedDice: boolean;
}

/**
 * Two Options with comparable motivational pressure — `defaultDecisionScenario()`'s
 * own baseline (symmetric Need levels, comparably seeded NeedExpectation
 * for Glen/Connection and Work/Achievement). Verify: neither personality
 * (not modeled — see decision.ts's scoping note) nor existing state
 * deterministically selects one (both pre-roll probabilities are
 * nontrivial, i.e. neither collapses to ~0 or ~1); the Decision uses dice
 * (resolutionMode is not 'Auto').
 */
export function runExperimentA_ResidualUncertainty(seed = 'phase2_9-expA-seed'): ExperimentAResult {
  const sample = runDecisionSample('A — Residual uncertainty', 'decision:expA', (s) => s, seed);
  const probs = sample.decisionExpression.preRollOptionProbabilities;
  const bothProbabilitiesNontrivial = probs.every((p) => p.probability.gt(ratOf(1, 100)) && p.probability.lt(ratOf(99, 100)));
  const usedDice = sample.decisionExpression.resolutionMode !== 'Auto';
  return { sample, bothProbabilitiesNontrivial, usedDice };
}

// ---------------------------------------------------------------------------
// Experiment B — Obvious choice (Brief §30)
// ---------------------------------------------------------------------------

export interface ExperimentBResult {
  readonly sample: DecisionSample;
  readonly marginHigh: boolean;
  readonly contestLow: boolean;
  readonly autoResolved: boolean;
  readonly noDiceRolled: boolean;
}

/**
 * Keep Dinner is made overwhelmingly stronger: a near-certain, well-
 * established positive expectation on Connection plus a severely depleted
 * Connection Level (high urgency), against a near-zero, well-established
 * Achievement expectation plus a nearly-satisfied Achievement Level (low
 * urgency). Verify: Margin rises, Contest falls, the Decision auto-
 * resolves, and no dice are rolled (no unnecessary stochasticity).
 */
export function runExperimentB_ObviousChoice(seed = 'phase2_9-expB-seed'): ExperimentBResult {
  const sample = runDecisionSample(
    'B — Obvious choice',
    'decision:expB',
    (s) => {
      let st = withExpectation(s, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(95, 100), tau: ratOf(20), lastUpdatedAt: 0 });
      st = withExpectation(st, ACTIVITY_WORK, NEED_ACHIEVEMENT, { mu: ratOf(1, 100), tau: ratOf(20), lastUpdatedAt: 0 });
      st = withNeedLevel(st, NEED_CONNECTION, ratOf(1, 10));
      st = withNeedLevel(st, NEED_ACHIEVEMENT, ratOf(19, 20));
      return st;
    },
    seed,
  );
  const e = sample.decisionExpression;
  return {
    sample,
    marginHigh: e.margin.gt(ratOf(1, 2)),
    contestLow: e.contest.lt(ratOf(1, 2)),
    autoResolved: e.resolutionMode === 'Auto',
    noDiceRolled: e.influenceRolls.length === 0,
  };
}

// ---------------------------------------------------------------------------
// Experiment C — Trivial uncertainty (Brief §30)
// ---------------------------------------------------------------------------

export interface ExperimentCResult {
  readonly sample: DecisionSample;
  readonly notPlayerFacing: boolean;
  readonly lowStake: boolean;
  readonly identityEvidenceStaysSmall: boolean;
}

/**
 * A "tea or coffee?" Decision (Brief §10's own example): both Options'
 * NeedExpectation is set to a genuine but tiny value (μ=0.03) — low enough
 * that `boundedResponse` keeps the resulting Influence below
 * `dieScale.weak`, so BOTH Options end up with literally zero surviving
 * Influences (this is the "single influence never reaches d4's own
 * minimum expected value" finding this build made while authoring
 * phase2_9Decision.test.ts's own trivial-decision case — recorded in
 * RESEARCH.md). Verify: the Decision may still require a (quiet) roll —
 * the tie-break draw among zero-evidence Options — but never becomes
 * player-facing, and Identity Evidence stays at zero (nothing was ever
 * touched).
 */
export function runExperimentC_TrivialUncertainty(seed = 'phase2_9-expC-seed'): ExperimentCResult {
  const sample = runDecisionSample(
    'C — Trivial uncertainty',
    'decision:expC',
    (s) => {
      let st = withExpectation(s, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(3, 100), tau: ratOf(3), lastUpdatedAt: 0 });
      st = withExpectation(st, ACTIVITY_WORK, NEED_ACHIEVEMENT, { mu: ratOf(3, 100), tau: ratOf(3), lastUpdatedAt: 0 });
      return st;
    },
    seed,
  );
  const e = sample.decisionExpression;
  return {
    sample,
    notPlayerFacing: e.resolutionMode !== 'PlayerFacingRoll',
    lowStake: e.stake.lt(ratOf(1, 20)),
    identityEvidenceStaysSmall: e.identityExpressions.every((x) => x.expressionStrength.abs().lt(ratOf(1, 20))),
  };
}

// ---------------------------------------------------------------------------
// Experiment D — Meaningful conflict (Brief §30)
// ---------------------------------------------------------------------------

export interface ExperimentDResult {
  readonly sample: DecisionSample;
  readonly highAuthorship: boolean;
  readonly playerFacing: boolean;
  readonly substantialIdentityEvidence: boolean;
}

/** Both Options get a strong, well-established, comparably-sized
 * NeedExpectation — a genuine near-balanced conflict with real motivational
 * mass on both sides (Brief §10's "keep promise to Glen or protect my
 * exhausted self" example, modeled here as Keep Dinner vs. Stay At Work).
 * Verify: AuthorshipPotential is high, the Decision becomes player-facing,
 * and the selected Option creates substantial Identity Evidence. This
 * state/setup is reused directly by Experiment K below. */
export function decisionD_setup(s: CharacterState): CharacterState {
  let st = withExpectation(s, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(9, 10), tau: ratOf(10), lastUpdatedAt: 0 });
  st = withExpectation(st, ACTIVITY_WORK, NEED_ACHIEVEMENT, { mu: ratOf(9, 10), tau: ratOf(10), lastUpdatedAt: 0 });
  return st;
}

export function runExperimentD_MeaningfulConflict(seed = 'phase2_9-expD-seed'): ExperimentDResult {
  const sample = runDecisionSample('D — Meaningful conflict', 'decision:expD', decisionD_setup, seed);
  const e = sample.decisionExpression;
  return {
    sample,
    highAuthorship: e.authorshipPotential.gte(ratOf(3, 10)),
    playerFacing: e.resolutionMode === 'PlayerFacingRoll',
    substantialIdentityEvidence: e.identityExpressions.some((x) => x.expressionStrength.abs().gte(ratOf(1, 10))),
  };
}

// ---------------------------------------------------------------------------
// Experiment K — Intent versus physical outcome (Brief §30)
// ---------------------------------------------------------------------------

export interface ExperimentKResult {
  readonly baseline: DecisionSample;
  readonly forced: DecisionSample;
  readonly intentPreserved: boolean;
  readonly physicalOutcomeDiffers: boolean;
}

/**
 * Reuses Experiment D's contested setup (same seed, same Decision) but
 * forces the physically-executed Action/WorldOutcomeTable to something
 * else entirely (the Betrayal table — any WorldOutcomeTable unrelated to
 * either dinner-vs-work Option would do; Betrayal is already authored and
 * unambiguously distinct). Verify: Identity Evidence/ChosenIntent still
 * describe the dice-selected Option, physical failure/substitution does
 * not rewrite intent, and both facts (what was chosen vs. what physically
 * happened) survive in the returned history.
 */
export function runExperimentK_IntentVersusOutcome(seed = 'phase2_9-expD-seed'): ExperimentKResult {
  const baseline = runDecisionSample('K — baseline (no force)', 'decision:expK', decisionD_setup, seed);
  const forced = runDecisionSample('K — forced outcome (Betrayal substituted)', 'decision:expK', decisionD_setup, seed, dinnerVsWorkDecision, undefined, {
    actionDef: betrayalAction(),
    outcomeTable: betrayalOutcomeTable(),
  });
  return {
    baseline,
    forced,
    intentPreserved: baseline.decisionExpression.chosenIntent === forced.decisionExpression.chosenIntent,
    physicalOutcomeDiffers: forced.executedAction.actionKey !== forced.decisionExpression.chosenIntent,
  };
}
