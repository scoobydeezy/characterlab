/**
 * Phase 2.97 — Dice Grammar Richness (Experiment K).
 *
 * The Context section's closing maxim: "the character may contain hundreds
 * of psychologically relevant facts. The Decision should not display
 * hundreds of dice." Central Consolidation caps how many nuclei a real
 * psychological situation can produce — this experiment deliberately drives
 * ONE Option to several simultaneously-active, independent nuclei (by
 * seeding real NeedExpectations across several Needs against that Option's
 * OWN subject — `evaluateAction` already sums a contribution for every Need
 * the character has against an Option's subject, so this is the SAME
 * mechanism `reasonNucleusFormation.ts`'s Experiment B exercises, extended
 * to four Needs instead of three) and confirms both the nucleus COUNT and
 * that the Option's combined dice-pool PMF is EXACTLY the convolution of
 * each nucleus's own independent distribution — not an approximation, not a
 * flattened/re-summed single die.
 */

import { Rational, ratOf } from '../kernel/rational';
import { EventClock } from '../kernel/event';
import { withExpectation } from '../model/character';
import { convolveAll, Distribution } from '../kernel/discreteDistribution';
import { CompiledNucleus } from '../model/diceCompiler';
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
  ACTION_KEEP_DINNER_PROMISE,
  PERSON_GLEN,
  NEED_CONNECTION,
  NEED_ACHIEVEMENT,
  NEED_RECOGNITION,
  NEED_SECURITY,
} from '../model/scenario';

const legacyMapping = defaultReasonChannelMapping();
const semanticPolarity = defaultSemanticReasonPolarity();
const needMapping = defaultMotiveChannelMapping();
const identityMapping = defaultIdentityMotiveChannelMapping();

/** The same comfortably-clearing NeedExpectation level
 * `reasonNucleusFormation.ts::STRONG` uses. */
const STRONG = { mu: ratOf(2), tau: ratOf(100), lastUpdatedAt: 0 };

export interface ExperimentKDiceGrammarRichnessResult {
  readonly nuclei: readonly CompiledNucleus[];
  readonly distinctMotiveChannels: readonly string[];
  readonly atLeastFourIndependentNuclei: boolean;
  readonly combinedDistribution: Distribution;
  readonly combinedPmfSumsToExactlyOne: boolean;
  readonly combinedSupportMatchesAdditiveRange: boolean;
}

export function runExperimentK_DiceGrammarRichness(seed = 'phase2_97-expK-seed'): ExperimentKDiceGrammarRichnessResult {
  let state = defaultDecisionScenario();
  state = withExpectation(state, PERSON_GLEN, NEED_CONNECTION, STRONG);
  state = withExpectation(state, PERSON_GLEN, NEED_ACHIEVEMENT, STRONG);
  state = withExpectation(state, PERSON_GLEN, NEED_RECOGNITION, STRONG);
  state = withExpectation(state, PERSON_GLEN, NEED_SECURITY, STRONG);

  const legacy = defaultDecisionCycleParams();
  const params = { ...legacy, decision: { ...legacy.decision, compilationMode: 'reasonNuclei' as const } };
  const decision = dinnerVsWorkDecision('decision:phase2_97-expK');
  const outcomeTables = decisionOutcomeTables();

  const result = runDecisionCycle(
    state.characterId,
    state,
    decision,
    outcomeTables,
    params,
    legacyMapping,
    semanticPolarity,
    new EventClock(),
    seed,
    undefined,
    undefined,
    needMapping,
    identityMapping,
  );

  const nuclei = result.reasonNucleusTrace!.get(ACTION_KEEP_DINNER_PROMISE) ?? [];
  const distinctMotiveChannels = [...new Set(nuclei.map((n) => n.key.motiveChannel))];

  const combinedDistribution = convolveAll(nuclei.map((n) => n.distribution));
  const combinedSum = [...combinedDistribution.pmf.values()].reduce((acc, p) => acc.add(p), Rational.ZERO);

  const supportValues = [...combinedDistribution.pmf.keys()];
  const actualMin = supportValues.reduce((a, b) => (b < a ? b : a));
  const actualMax = supportValues.reduce((a, b) => (b > a ? b : a));
  // Each Pursue nucleus's own support is [1+modifier, faces+modifier]
  // (Brief §63) — the convolution of several INDEPENDENT nuclei's supports
  // has min = sum of each nucleus's own min, max = sum of each nucleus's own
  // max, exactly (never a narrower or wider range — nothing here
  // approximates or discards outcomes).
  const perNucleusRange = nuclei.map((n) => {
    const lo = n.key.direction === 'Avoid' ? -(n.baseDie + n.finalModifier) : 1 + n.finalModifier;
    const hi = n.key.direction === 'Avoid' ? -(1 + n.finalModifier) : n.baseDie + n.finalModifier;
    return { lo: BigInt(Math.min(lo, hi)), hi: BigInt(Math.max(lo, hi)) };
  });
  const additiveMin = perNucleusRange.reduce((acc, r) => acc + r.lo, 0n);
  const additiveMax = perNucleusRange.reduce((acc, r) => acc + r.hi, 0n);

  return {
    nuclei,
    distinctMotiveChannels,
    atLeastFourIndependentNuclei: nuclei.length >= 4 && distinctMotiveChannels.length >= 4,
    combinedDistribution,
    combinedPmfSumsToExactlyOne: combinedSum.equals(Rational.ONE),
    combinedSupportMatchesAdditiveRange: actualMin === additiveMin && actualMax === additiveMax,
  };
}
