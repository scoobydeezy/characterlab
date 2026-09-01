/**
 * Phase 2.5d experiment — "Saturation/Salience Interaction," Brief §24's
 * remaining Phase 2.5 question, sharpened by post-2.5c review from "should
 * salience depend on Applied/Overflow?" to: does saturation contribute any
 * salience information NOT already available through the character's
 * experienced Need relevance (`salience.ts::needRelevance`, fed the
 * REALIZED — i.e. Applied — Need delta) and evidence-aware surprise
 * (`salience.ts::surprise`, fed the objective `EvidenceKind` cycle.ts
 * already classifies for learning)?
 *
 * STATED HYPOTHESIS (before running anything below, per this project's
 * "specify success before building" discipline):
 *
 *   Saturation does not require an independent salience mechanism. Its
 *   psychologically observable effects are already mediated by realized
 *   Need relevance and evidence-aware surprise. Hidden Overflow must not
 *   affect salience.
 *
 * Concretely: `computeSemanticSalience`'s formula (salience.ts::rawSalience)
 * is `Raw = BaseSalience x RoleWeight x Attention x (1+alphaN*NeedRelevance)
 * x (1+alphaS*Surprise)` — no Overflow or SaturationFactor term anywhere,
 * and `cycle.ts::applyChosenAction` never passes Overflow into `needImpacts`
 * or `surpriseEvidenceRecords` (Overflow is threaded only into the
 * trace-only `saturationAnalysis`/Experienced-Reward computation). A static
 * read of the code already suggests the hypothesis holds structurally; the
 * four cases below are what actually DEMONSTRATE it by running the real
 * `runScriptedExperience` pipeline end-to-end (not just calling
 * `computeSemanticSalience` directly with hand-picked inputs, which would
 * beg the question) and checking the claim against real numbers, per this
 * project's "don't trust code inspection where a runnable test is possible"
 * norm.
 *
 * Every case fixes Mina/Glen/Connection (this project's running example)
 * and varies exactly the one thing each case is named after — starting Need
 * Level, established prior belief, or both — via `withNeedLevel`/
 * `withExpectation`, with a custom zero-noise `WorldOutcomeTable` per case
 * so the "true effect" is an exact authored number, not a noisy draw.
 * `deltaT: Rational.ZERO` on every run isolates "what does this one
 * Experience teach/mean" from passive Need decay, mirroring
 * `saturatedSatisfaction.ts`'s same isolation choice.
 */

import { Rational, ratOf } from '../kernel/rational';
import { NeedExpectation } from '../model/expectation';
import { SaturationKind } from '../model/needs';
import { SalienceBreakdown } from '../model/salience';
import { WorldOutcomeTable } from '../model/outcome';
import { CycleParams, runScriptedExperience } from '../model/cycle';
import { EventClock } from '../kernel/event';
import { withNeedLevel, withExpectation } from '../model/character';
import {
  defaultScenario,
  defaultCycleParams,
  defaultSalienceParams,
  defaultExperienceContext,
  createInitialCharacterState,
  defaultActions,
  PERSON_MINA,
  PERSON_GLEN,
  NEED_CONNECTION,
  ACTION_VISIT_GLEN,
} from '../model/scenario';

/** One forced Experience's saturation facts plus PERSON_GLEN's full
 * per-concept salience breakdown — everything each case below needs to
 * compare across its two (or, for Case 4, one) variants. */
export interface SalienceSample {
  readonly label: string;
  readonly needLevelBefore: Rational;
  readonly priorMu: Rational;
  readonly applied: Rational;
  readonly overflow: Rational;
  readonly saturated: SaturationKind;
  readonly glen: SalienceBreakdown;
}

function makeGlenOutcomeTable(magnitude: Rational): WorldOutcomeTable {
  return { actionKey: ACTION_VISIT_GLEN, effects: [{ needId: NEED_CONNECTION, magnitude, noiseHalfWidth: Rational.ZERO }] };
}

/** Shared machinery for every case: fresh scenario, Connection Level and
 * (optionally) an established Glen/Connection prior set directly, one
 * forced "Visit Glen" Experience with an exact zero-noise magnitude, run
 * through the real `salienceMode: 'derived'` pipeline. */
function runSample(label: string, needLevelBefore: Rational, magnitude: Rational, priorOverride: NeedExpectation | null, seed: string): SalienceSample {
  const scenario = defaultScenario(seed);
  let state = createInitialCharacterState(scenario);
  state = withNeedLevel(state, NEED_CONNECTION, needLevelBefore);
  if (priorOverride) state = withExpectation(state, PERSON_GLEN, NEED_CONNECTION, priorOverride);

  const glenAction = defaultActions().find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
  const outcome = makeGlenOutcomeTable(magnitude);
  const ctx = defaultExperienceContext(false);
  const params: CycleParams = {
    ...defaultCycleParams(),
    deltaT: Rational.ZERO,
    salienceMode: 'derived',
    salience: defaultSalienceParams(),
  };
  const clock = new EventClock();
  clock.advance(1);
  const result = runScriptedExperience(PERSON_MINA, state, glenAction, outcome, params, clock, seed, ctx);

  const saturation = result.saturationAnalysis.find((s) => s.needId === NEED_CONNECTION)!;
  const glen = result.semanticSalience!.breakdown.find((b) => b.concept === PERSON_GLEN)!;
  return {
    label,
    needLevelBefore,
    priorMu: priorOverride?.mu ?? Rational.ZERO,
    applied: saturation.applied,
    overflow: saturation.overflow,
    saturated: saturation.saturated,
    glen,
  };
}

// ---------------------------------------------------------------------------
// Case 1 — Observational equivalence
// ---------------------------------------------------------------------------

export interface Case1Result {
  readonly timelineA: SalienceSample;
  readonly timelineB: SalienceSample;
  readonly needRelevanceIdentical: boolean;
  readonly surpriseIdentical: boolean;
  readonly salienceIdentical: boolean;
}

/**
 * Same perceived event, same Applied effect, same evidence kind, radically
 * different hidden Overflow. Connection starts at 0.95 (Capacity+ = 0.05)
 * in both timelines; Timeline A's true effect is +0.10 (Overflow 0.05),
 * Timeline B's is +0.80 (Overflow 0.75) — both clip to Applied = +0.05.
 * Salience must be identical: this proves Overflow cannot directly
 * influence salience, since the character has no epistemic access to it.
 */
export function runCase1_ObservationalEquivalence(): Case1Result {
  const level = ratOf(95, 100); // Capacity+ = 0.05
  const timelineA = runSample('Timeline A — true effect +0.10 (Overflow 0.05)', level, ratOf(10, 100), null, 'phase2_5d-case1-seed');
  const timelineB = runSample('Timeline B — true effect +0.80 (Overflow 0.75)', level, ratOf(80, 100), null, 'phase2_5d-case1-seed');
  return {
    timelineA,
    timelineB,
    needRelevanceIdentical: timelineA.glen.needRelevance.equals(timelineB.glen.needRelevance),
    surpriseIdentical: timelineA.glen.surprise.equals(timelineB.glen.surprise),
    salienceIdentical: timelineA.glen.z.equals(timelineB.glen.z),
  };
}

// ---------------------------------------------------------------------------
// Case 2 — Saturation versus unsaturated utility
// ---------------------------------------------------------------------------

export interface Case2Result {
  readonly starved: SalienceSample;
  readonly nearSatisfied: SalienceSample;
  readonly needRelevanceGreaterWhenStarved: boolean;
  readonly salienceGreaterWhenStarved: boolean;
}

/**
 * Same Glen, same true efficacy (+0.40), only Mina's starting Connection
 * Level differs: Connection-starved (0.10, well below the 0.80 set point —
 * high urgency, Applied lands unclipped at the full +0.40) versus
 * near/over-satisfied (0.90, above the set point — zero urgency by
 * `needDeficit`'s own max(0,...) clamp, and Applied clips to +0.10). The
 * starved Experience should get materially greater Need-relevance salience,
 * because it actually mattered more to her regulatory state — with no extra
 * `SaturationFactor` required; `needRelevance` already folds in both the
 * larger realized delta and the higher urgency multiplying it.
 */
export function runCase2_SaturationVsUnsaturatedUtility(): Case2Result {
  const trueEffect = ratOf(40, 100); // +0.40, same true efficacy both times
  const starved = runSample('Starved — Connection = 0.10', ratOf(10, 100), trueEffect, null, 'phase2_5d-case2-seed');
  const nearSatisfied = runSample('Near-satisfied — Connection = 0.90', ratOf(90, 100), trueEffect, null, 'phase2_5d-case2-seed');
  return {
    starved,
    nearSatisfied,
    needRelevanceGreaterWhenStarved: starved.glen.needRelevance.gt(nearSatisfied.glen.needRelevance),
    salienceGreaterWhenStarved: starved.glen.z.gt(nearSatisfied.glen.z),
  };
}

// ---------------------------------------------------------------------------
// Case 3 — Surprising censored evidence
// ---------------------------------------------------------------------------

export interface Case3Result {
  readonly surprising: SalienceSample;
  readonly consistent: SalienceSample;
  readonly surpriseGreaterWhenContradicted: boolean;
  readonly salienceGreaterWhenContradicted: boolean;
}

/**
 * Mina believes Glen only helps +0.02 (an established prior, set directly
 * via `withExpectation`); Connection starts at 0.85 (Capacity+ = 0.15) and
 * the true effect (+0.50) is well above headroom, so the realized
 * observation is a ceiling-saturated "effect >= +0.15" — genuinely
 * incompatible with the established +0.02 belief. The `consistent` variant
 * holds everything else fixed but starts from an established belief
 * (+0.20) the same bound does NOT contradict. Salience should rise for the
 * contradicted belief: this proves saturation doesn't merely suppress
 * salience — informative censored evidence can still be highly salient,
 * exactly as `surprise.ts`'s evidence-kind-aware formula predicts.
 */
export function runCase3_SurprisingCensoredEvidence(): Case3Result {
  const level = ratOf(85, 100); // Capacity+ = 0.15
  const trueEffect = ratOf(50, 100); // well above headroom -> Applied clips to exactly +0.15
  const lowPrior: NeedExpectation = { mu: ratOf(2, 100), tau: ratOf(20), lastUpdatedAt: 0 }; // "Glen only helps +.02"
  const consistentPrior: NeedExpectation = { mu: ratOf(20, 100), tau: ratOf(20), lastUpdatedAt: 0 }; // already believes >= the bound

  const surprising = runSample('Surprising — established belief +0.02', level, trueEffect, lowPrior, 'phase2_5d-case3-seed');
  const consistent = runSample('Consistent — established belief +0.20', level, trueEffect, consistentPrior, 'phase2_5d-case3-seed');
  return {
    surprising,
    consistent,
    surpriseGreaterWhenContradicted: surprising.glen.surprise.gt(consistent.glen.surprise),
    salienceGreaterWhenContradicted: surprising.glen.z.gt(consistent.glen.z),
  };
}

// ---------------------------------------------------------------------------
// Case 4 — Total saturation
// ---------------------------------------------------------------------------

export interface Case4Result {
  readonly sample: SalienceSample;
  readonly needRelevanceIsZero: boolean;
  readonly surpriseIsZero: boolean;
  readonly salienceIsStrictlyPositive: boolean;
}

/**
 * Mina's Connection is already at its ceiling (Level = 1.0 exactly) when
 * Glen produces an otherwise ordinary positive effect (+0.40) — Applied is
 * exactly 0, all of it Overflow. Need relevance should contribute exactly
 * zero (the realized delta is zero), and surprise may also be zero (a
 * fresh prior already believes 0, and "effect >= 0" proves nothing new
 * beyond that) — but Glen/Action/role/attention's baseline product must
 * still leave the Experience with strictly positive semantic salience.
 * Saturation should attenuate salience's Need-relevance/surprise
 * contributions to zero without making the entire Experience disappear.
 */
export function runCase4_TotalSaturation(): Case4Result {
  const sample = runSample('Total saturation — Connection = 1.0', Rational.ONE, ratOf(40, 100), null, 'phase2_5d-case4-seed');
  return {
    sample,
    needRelevanceIsZero: sample.glen.needRelevance.isZero(),
    surpriseIsZero: sample.glen.surprise.isZero(),
    salienceIsStrictlyPositive: sample.glen.z.gt(Rational.ZERO),
  };
}

// ---------------------------------------------------------------------------

export interface SaturationSalienceInteractionResults {
  readonly case1: Case1Result;
  readonly case2: Case2Result;
  readonly case3: Case3Result;
  readonly case4: Case4Result;
}

export function runAllSaturationSalienceInteractionCases(): SaturationSalienceInteractionResults {
  return {
    case1: runCase1_ObservationalEquivalence(),
    case2: runCase2_SaturationVsUnsaturatedUtility(),
    case3: runCase3_SurprisingCensoredEvidence(),
    case4: runCase4_TotalSaturation(),
  };
}
