/**
 * Phase 2.97 — Old vs. New Compilation, side by side (Experiment M).
 *
 * Plan scoping decision 1: Phase 2.95's `SemanticReasonChannelId`
 * consolidation is FROZEN as the historical baseline, not replaced — Brief
 * §M requires running the OLD and NEW compilers on an IDENTICAL
 * `{CharacterState, Decision, Seed}` and comparing dice count, win-
 * probability deltas, and trace readability directly, never inferred from
 * separate runs. Both branches share the exact same `resolveDecisionCore`
 * (`model/decision.ts`) — this experiment exists to show what changes
 * (consolidation granularity, per-reason labeling) and what provably does
 * NOT (the underlying Margin/Contest/Stake/AuthorshipPotential/rolling
 * math), from one real `CharacterState` run through both pipelines.
 */

import { Rational, ratOf } from '../kernel/rational';
import { EventClock } from '../kernel/event';
import { CharacterState, withExpectation } from '../model/character';
import { CompiledNucleus } from '../model/diceCompiler';
import { nucleusKeyString } from '../model/reasonNucleus';
import { runDecisionCycle } from '../model/cycle';
import {
  defaultDecisionScenario,
  defaultDecisionCycleParams,
  defaultReasonChannelMapping,
  defaultSemanticReasonPolarity,
  defaultMotiveChannelMapping,
  defaultIdentityMotiveChannelMapping,
  dinnerVsWorkDecision,
  decisionOutcomeTables,
  PERSON_GLEN,
  NEED_CONNECTION,
  ACTIVITY_WORK,
  NEED_ACHIEVEMENT,
  ACTION_KEEP_DINNER_PROMISE,
  ACTION_STAY_AT_WORK,
} from '../model/scenario';

const legacyMapping = defaultReasonChannelMapping();
const semanticPolarity = defaultSemanticReasonPolarity();
const needMapping = defaultMotiveChannelMapping();
const identityMapping = defaultIdentityMotiveChannelMapping();

/** A genuinely contested baseline — both Options survive on real Need
 * pressure alone, matching `defaultDecisionScenario()`'s own "both Decision
 * axes start genuinely contested" design intent, strengthened only enough
 * (`reasonNucleusFormation.ts::STRONG`'s own level) that BOTH pipelines
 * produce at least one real die per Option — a comparison where the new
 * pipeline trivially produces zero dice due to uncalibrated thresholds
 * would not actually exercise the comparison Experiment M is for. */
function sharedBaselineState(): CharacterState {
  let state = defaultDecisionScenario();
  state = withExpectation(state, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(2), tau: ratOf(100), lastUpdatedAt: 0 });
  state = withExpectation(state, ACTIVITY_WORK, NEED_ACHIEVEMENT, { mu: ratOf(2), tau: ratOf(100), lastUpdatedAt: 0 });
  return state;
}

export interface OldVsNewOptionComparison {
  readonly option: string;
  readonly legacyDiceCount: number;
  readonly legacyInfluenceLabels: readonly string[];
  readonly reasonNucleiDiceCount: number;
  readonly reasonNucleiLabels: readonly string[];
}

export interface ExperimentMOldVsNewResult {
  readonly perOption: readonly OldVsNewOptionComparison[];
  readonly legacyChosenOption: string;
  readonly reasonNucleiChosenOption: string;
  readonly legacyResolutionMode: string;
  readonly reasonNucleiResolutionMode: string;
  readonly pKeepDinnerLegacy: Rational;
  readonly pKeepDinnerReasonNuclei: Rational;
  readonly probabilityDelta: Rational;
  readonly totalDiceCountLegacy: number;
  readonly totalDiceCountReasonNuclei: number;
}

export function runExperimentM_OldVsNewCompilation(seed = 'phase2_97-expM-seed'): ExperimentMOldVsNewResult {
  const state = sharedBaselineState();
  const outcomeTables = decisionOutcomeTables();
  const legacyParams = defaultDecisionCycleParams();
  const reasonNucleiParams = { ...legacyParams, decision: { ...legacyParams.decision, compilationMode: 'reasonNuclei' as const } };

  const legacyDecision = dinnerVsWorkDecision('decision:phase2_97-expM');
  const legacyResult = runDecisionCycle(
    state.characterId,
    state,
    legacyDecision,
    outcomeTables,
    legacyParams,
    legacyMapping,
    semanticPolarity,
    new EventClock(),
    seed,
  );

  const reasonNucleiDecision = dinnerVsWorkDecision('decision:phase2_97-expM');
  const reasonNucleiResult = runDecisionCycle(
    state.characterId,
    state,
    reasonNucleiDecision,
    outcomeTables,
    reasonNucleiParams,
    legacyMapping,
    semanticPolarity,
    new EventClock(),
    seed,
    undefined,
    undefined,
    needMapping,
    identityMapping,
  );

  const perOption: OldVsNewOptionComparison[] = [ACTION_KEEP_DINNER_PROMISE, ACTION_STAY_AT_WORK].map((option) => {
    const legacyInfluences = legacyResult.decisionExpression.influenceRolls.filter((r) => r.optionKey === option);
    const nuclei: readonly CompiledNucleus[] = reasonNucleiResult.reasonNucleusTrace?.get(option) ?? [];
    return {
      option,
      legacyDiceCount: legacyInfluences.length,
      legacyInfluenceLabels: legacyInfluences.map((r) => r.influenceId),
      reasonNucleiDiceCount: nuclei.length,
      reasonNucleiLabels: nuclei.map((n) => nucleusKeyString(n.key)),
    };
  });

  const pKeepDinnerLegacy = legacyResult.decisionExpression.preRollOptionProbabilities.find(
    (p) => p.optionKey === ACTION_KEEP_DINNER_PROMISE,
  )!.probability;
  const pKeepDinnerReasonNuclei = reasonNucleiResult.decisionExpression.preRollOptionProbabilities.find(
    (p) => p.optionKey === ACTION_KEEP_DINNER_PROMISE,
  )!.probability;

  return {
    perOption,
    legacyChosenOption: legacyResult.decisionExpression.chosenOption,
    reasonNucleiChosenOption: reasonNucleiResult.decisionExpression.chosenOption,
    legacyResolutionMode: legacyResult.decisionExpression.resolutionMode,
    reasonNucleiResolutionMode: reasonNucleiResult.decisionExpression.resolutionMode,
    pKeepDinnerLegacy,
    pKeepDinnerReasonNuclei,
    probabilityDelta: pKeepDinnerLegacy.sub(pKeepDinnerReasonNuclei).abs(),
    totalDiceCountLegacy: perOption.reduce((acc, o) => acc + o.legacyDiceCount, 0),
    totalDiceCountReasonNuclei: perOption.reduce((acc, o) => acc + o.reasonNucleiDiceCount, 0),
  };
}
