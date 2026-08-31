/**
 * Phase 2.97 — Situational Modifiers (Experiment J).
 *
 * Brief §32's "recent supportive/unsupportive history" claim: the SAME
 * Need/identity pressure should compile to a DIFFERENT (situationally
 * modified) die depending only on what the character actually remembers
 * happening recently — not a different underlying motive. This experiment
 * holds Need level, NeedExpectation, and identity evidence IDENTICAL across
 * two real `runDecisionCycle` runs and varies only which memories are in the
 * retrieval set, confirming the resulting nucleus's `baseMotiveStrength`
 * (B_n, MotiveGenerating-only) is byte-identical while `situationalModifier`
 * differs.
 *
 * Construction (found empirically — this file's own probe,
 * `scratch/debugJ.ts`, deleted after use): a "supportive history" memory is
 * built by running ONE real Keep Dinner Promise choice from a prior state
 * whose seeded NeedExpectation sits CLOSE to the actually realized effect
 * (`correlatedEvidence.ts::dualDerivationBaseline`'s own convention) — this
 * keeps the resulting `predictionErrors` small and same-signed as the
 * realized `needOutcomes`, so the two derived `SituationalEvidence` signal
 * families combine into a genuinely POSITIVE situational push rather than
 * an artifact of an inflated prior. After that memory exists, Glen's own
 * NeedExpectation and the Connection Need's level are both reset to the
 * SAME fixed values the "no history" run uses, so the two runs differ in
 * exactly one respect: whether that supportive memory is in the retrieval
 * set at all.
 */

import { Rational, ratOf } from '../kernel/rational';
import { EventClock } from '../kernel/event';
import { withExpectation, withNeedLevel, CharacterState } from '../model/character';
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
  PERSON_GLEN,
  NEED_CONNECTION,
  ACTIVITY_WORK,
  NEED_ACHIEVEMENT,
  ACTION_KEEP_DINNER_PROMISE,
} from '../model/scenario';

const legacyMapping = defaultReasonChannelMapping();
const semanticPolarity = defaultSemanticReasonPolarity();
const needMapping = defaultMotiveChannelMapping();
const identityMapping = defaultIdentityMotiveChannelMapping();
const outcomeTables = decisionOutcomeTables();

/** The fixed Connection NeedExpectation both runs share — real, but on its
 * own (found empirically) not so strong that a situational push couldn't
 * still move which base-die bracket the nucleus lands in. */
const FIXED_CONNECTION_EXPECTATION = { mu: ratOf(1), tau: ratOf(20), lastUpdatedAt: 0 };

function reasonNucleiParams() {
  const legacy = defaultDecisionCycleParams();
  return { ...legacy, decision: { ...legacy.decision, compilationMode: 'reasonNuclei' as const } };
}

function runReasonNucleiDecision(state: CharacterState, decisionId: string, seed: string) {
  const decision = dinnerVsWorkDecision(decisionId);
  return runDecisionCycle(
    state.characterId,
    state,
    decision,
    outcomeTables,
    reasonNucleiParams(),
    legacyMapping,
    semanticPolarity,
    new EventClock(),
    seed,
    undefined,
    undefined,
    needMapping,
    identityMapping,
  );
}

function connectionNucleusFor(trace: ReturnType<typeof runReasonNucleiDecision>['reasonNucleusTrace']): CompiledNucleus | undefined {
  return trace?.get(ACTION_KEEP_DINNER_PROMISE)?.find((n) => n.key.motiveChannel === 'Connection');
}

export interface ExperimentJSituationalModifierResult {
  readonly noHistoryNucleus: CompiledNucleus | undefined;
  readonly supportiveHistoryNucleus: CompiledNucleus | undefined;
  readonly memoryRetrievedOnlyInSupportiveRun: boolean;
  readonly baseMotiveStrengthIdentical: boolean;
  readonly situationalModifierDiffers: boolean;
  readonly supportiveRunHasLargerSituationalModifier: boolean;
}

export function runExperimentJ_SituationalModifiers(seed = 'phase2_97-expJ-seed'): ExperimentJSituationalModifierResult {
  // "No history" run: a fresh character (no memory at all) with Glen's
  // Connection NeedExpectation pinned at the shared fixed level.
  let noHistoryState = defaultDecisionScenario();
  noHistoryState = withExpectation(noHistoryState, PERSON_GLEN, NEED_CONNECTION, FIXED_CONNECTION_EXPECTATION);
  const noHistoryRun = runReasonNucleiDecision(noHistoryState, 'decision:phase2_97-expJ-nohistory', `${seed}-nohistory`);

  // Build the "supportive history" memory: one real Keep Dinner Promise
  // choice from a state whose OWN seeded expectation sits close to the
  // realized effect (small, same-signed prediction error).
  let seedState = defaultDecisionScenario();
  seedState = withExpectation(seedState, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(3, 10), tau: ratOf(5), lastUpdatedAt: 0 });
  seedState = withExpectation(seedState, ACTIVITY_WORK, NEED_ACHIEVEMENT, { mu: Rational.ZERO, tau: ratOf(1), lastUpdatedAt: 0 });
  const seedDecision = dinnerVsWorkDecision('decision:phase2_97-expJ-seed');
  const params = defaultDecisionCycleParams();
  const seedRun = runDecisionCycle(
    seedState.characterId,
    seedState,
    seedDecision,
    outcomeTables,
    params,
    legacyMapping,
    semanticPolarity,
    new EventClock(),
    `${seed}-seed`,
  );

  // Reset Glen's NeedExpectation AND the Connection Need level back to the
  // SAME fixed values the no-history run uses — identity evidence was never
  // touched by either run (`identityFeedbackEnabled` has nothing to work
  // with here: no channel maps this scenario's own weak seeds high enough
  // to leave residue) — so the two runs differ in exactly one respect: the
  // supportive memory's presence in the retrieval set.
  let supportiveState = withExpectation(seedRun.nextState, PERSON_GLEN, NEED_CONNECTION, FIXED_CONNECTION_EXPECTATION);
  supportiveState = withNeedLevel(supportiveState, NEED_CONNECTION, noHistoryState.needStates.get(NEED_CONNECTION)!.level);
  const supportiveRun = runReasonNucleiDecision(supportiveState, 'decision:phase2_97-expJ-supportive', `${seed}-supportive`);

  const noHistoryNucleus = connectionNucleusFor(noHistoryRun.reasonNucleusTrace);
  const supportiveHistoryNucleus = connectionNucleusFor(supportiveRun.reasonNucleusTrace);

  return {
    noHistoryNucleus,
    supportiveHistoryNucleus,
    memoryRetrievedOnlyInSupportiveRun: noHistoryRun.retrievedMemories.length === 0 && supportiveRun.retrievedMemories.length > 0,
    baseMotiveStrengthIdentical:
      noHistoryNucleus !== undefined &&
      supportiveHistoryNucleus !== undefined &&
      noHistoryNucleus.baseMotiveStrength.equals(supportiveHistoryNucleus.baseMotiveStrength),
    situationalModifierDiffers:
      noHistoryNucleus !== undefined &&
      supportiveHistoryNucleus !== undefined &&
      noHistoryNucleus.situationalModifier !== supportiveHistoryNucleus.situationalModifier,
    supportiveRunHasLargerSituationalModifier:
      noHistoryNucleus !== undefined &&
      supportiveHistoryNucleus !== undefined &&
      supportiveHistoryNucleus.situationalModifier > noHistoryNucleus.situationalModifier,
  };
}
