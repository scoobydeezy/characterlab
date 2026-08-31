/**
 * Phase 2.97 — Correlated Evidence (Experiments D, E, F).
 *
 * The Reference Correlation Consolidator (`kernel/evidenceOverlap.ts`) exists
 * so that evidence sharing the same underlying source never gets counted
 * twice just because two different signal-emission paths happen to derive
 * from it. Per the Phase 2.97 plan (scoping decision 7), this is validated
 * at TWO layers:
 *
 *   Layer 1 — pure kernel-math, hand-authored `EvidenceBasis` sets matching
 *   Brief Experiment F's own spec verbatim (`{1,2,3}` vs `{3,4,5}`,
 *   Overlap=1/5). Already exercised directly against `evidenceOverlap.ts` in
 *   `test/evidenceOverlap.test.ts` (that file's own Experiment D/E/F cases);
 *   `runExperimentF_PartialOverlapHandAuthored` below simply packages that
 *   SAME real computation as a runnable, UI/RESEARCH.md-facing experiment
 *   function rather than re-deriving new numbers.
 *
 *   Layer 2 — one real Decision (never a hand-picked fixture) where
 *   genuinely independently-derived signal families legitimately draw on the
 *   SAME retrieved memory: `cognitiveSignals.ts::situationalMemorySignals`
 *   (from a memory's realized `needOutcomes`) and
 *   `::situationalExpectationNudgeSignals` (from the SAME memory's
 *   `predictionErrors`) both fire for one retrieved `MemoryEpisode`, sharing
 *   its `experienceId` as their `EvidenceBasis`. Found empirically (this
 *   file's own probe, `scratch/debugD.ts`/`debugE.ts` — deleted after use,
 *   numbers recorded in RESEARCH.md): a single Keep Dinner Promise choice's
 *   own memory produces exactly this dual-derivation case (Experiment D,
 *   below), and two SEPARATE Keep Dinner Promise choices' memories produce
 *   the independent-evidence case (Experiment E) on the SAME
 *   (Option, MotiveChannel, Referent) triple.
 */

import { Rational, ratOf } from '../kernel/rational';
import { EventClock } from '../kernel/event';
import { evidenceBasisOf, consolidateCorrelated, ConsolidatedContribution } from '../kernel/evidenceOverlap';
import { withExpectation } from '../model/character';
import { situationalMemorySignals } from '../model/cognitiveSignals';
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

function reasonNucleiParams() {
  const legacy = defaultDecisionCycleParams();
  return { ...legacy, decision: { ...legacy.decision, compilationMode: 'reasonNuclei' as const } };
}

/** A baseline where Keep Dinner Promise wins decisively (Work's own pull is
 * disabled) and Glen's seeded NeedExpectation (0.3) sits close to the
 * ACTUAL realized effect (0.40 +/- 0.05) — chosen so the resulting
 * predictionError stays small and SAME-SIGNED as the need outcome itself,
 * which is what lets the two situational signal families genuinely combine
 * (`consolidateSigned` partitions by sign before consolidating — see
 * `model/diceCompiler.ts`'s doc comment) rather than accidentally
 * cancelling. */
function dualDerivationBaseline() {
  let state = defaultDecisionScenario();
  state = withExpectation(state, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(3, 10), tau: ratOf(5), lastUpdatedAt: 0 });
  state = withExpectation(state, ACTIVITY_WORK, NEED_ACHIEVEMENT, { mu: Rational.ZERO, tau: ratOf(1), lastUpdatedAt: 0 });
  return state;
}

function runOneRound(state: ReturnType<typeof dualDerivationBaseline>, decisionId: string, seed: string, clock: EventClock) {
  const params = defaultDecisionCycleParams();
  const decision = dinnerVsWorkDecision(decisionId);
  const outcomeTables = decisionOutcomeTables();
  return runDecisionCycle(state.characterId, state, decision, outcomeTables, params, legacyMapping, semanticPolarity, clock, seed);
}

function runReasonNucleiRound(state: ReturnType<typeof dualDerivationBaseline>, decisionId: string, seed: string, clock: EventClock) {
  const outcomeTables = decisionOutcomeTables();
  const decision = dinnerVsWorkDecision(decisionId);
  return runDecisionCycle(
    state.characterId,
    state,
    decision,
    outcomeTables,
    reasonNucleiParams(),
    legacyMapping,
    semanticPolarity,
    clock,
    seed,
    undefined,
    undefined,
    needMapping,
    identityMapping,
  );
}

function keepDinnerNucleus(trace: ReturnType<typeof runReasonNucleiRound>['reasonNucleusTrace']): CompiledNucleus | undefined {
  return trace?.get(ACTION_KEEP_DINNER_PROMISE)?.find((n) => n.key.motiveChannel === 'Connection');
}

// ---------------------------------------------------------------------------
// Experiment D — identical evidence, real pipeline dual derivation
// ---------------------------------------------------------------------------

export interface ExperimentDRealDualDerivationResult {
  readonly nucleus: CompiledNucleus | undefined;
  readonly memoryContribution: ConsolidatedContribution | undefined;
  readonly nudgeContribution: ConsolidatedContribution | undefined;
  readonly nudgeFullyOverlapsAndContributesNothing: boolean;
  readonly naiveIndependentSumWouldHaveBeenLarger: boolean;
}

/**
 * One Keep Dinner Promise choice creates one Memory; the very next Decision
 * retrieves it and derives BOTH `situationalMemorySignals` (from that
 * memory's realized Connection outcome) and
 * `situationalExpectationNudgeSignals` (from that SAME memory's Connection
 * prediction error) for the identical (Option, 'Connection', Glen) triple —
 * both signals carry the identical single-element `{[experienceId]: 1}`
 * EvidenceBasis, since both derive from the one memory `applyChosenAction`
 * created. The Reference Correlation Consolidator must therefore treat the
 * later (canonical-order) one as ENTIRELY redundant (Overlap=1,
 * effective=0) rather than letting it inflate the situational modifier —
 * exactly Experiment D's kernel-level finding
 * (`test/evidenceOverlap.test.ts`), now shown to fire on genuinely
 * independently-derived, not hand-picked, real pipeline signals.
 */
export function runExperimentD_RealDualDerivation(seed = 'phase2_97-expD-seed'): ExperimentDRealDualDerivationResult {
  const clock = new EventClock();
  const round1 = runOneRound(dualDerivationBaseline(), 'decision:phase2_97-expD:1', `${seed}-r1`, clock);
  const round2 = runReasonNucleiRound(round1.nextState, 'decision:phase2_97-expD:2', `${seed}-r2`, clock);

  const nucleus = keepDinnerNucleus(round2.reasonNucleusTrace);
  const situationalIds = nucleus?.correlationTrace.filter((c) => c.id.includes('memory')) ?? [];
  const memoryContribution = situationalIds.find((c) => c.id.startsWith('memory:'));
  const nudgeContribution = situationalIds.find((c) => c.id.startsWith('memory-nudge:'));

  const naiveSum = (memoryContribution?.rawMagnitude ?? Rational.ZERO).add(nudgeContribution?.rawMagnitude ?? Rational.ZERO);
  const actualSituationalNet = (memoryContribution?.effective ?? Rational.ZERO).add(nudgeContribution?.effective ?? Rational.ZERO);

  return {
    nucleus,
    memoryContribution,
    nudgeContribution,
    nudgeFullyOverlapsAndContributesNothing:
      nudgeContribution !== undefined && nudgeContribution.overlapWithPrior.equals(Rational.ONE) && nudgeContribution.effective.isZero(),
    naiveIndependentSumWouldHaveBeenLarger: naiveSum.gt(actualSituationalNet),
  };
}

// ---------------------------------------------------------------------------
// Experiment E — independent evidence, real pipeline (two distinct memories)
// ---------------------------------------------------------------------------

export interface ExperimentERealIndependentEvidenceResult {
  readonly nucleus: CompiledNucleus | undefined;
  readonly firstMemoryContribution: ConsolidatedContribution | undefined;
  readonly secondMemoryContribution: ConsolidatedContribution | undefined;
  readonly bothMemorySignalsKeptFullWeight: boolean;
  readonly combinedExceedsEitherAlone: boolean;
}

/**
 * TWO separate Keep Dinner Promise choices create TWO distinct Memories,
 * each with its own `experienceId` — a THIRD Decision retrieves both, and
 * `situationalMemorySignals` derives one Connection-channel signal per
 * memory, each with a DISJOINT single-element EvidenceBasis (no shared key).
 * Unlike Experiment D, these must stack FULLY (Overlap=0, effective =
 * rawMagnitude for both) before bounding — real, non-hand-picked
 * confirmation of Experiment E's kernel-level finding (independent evidence
 * is never discounted, however coincidentally similar its magnitude).
 */
export function runExperimentE_RealIndependentEvidence(seed = 'phase2_97-expE-seed'): ExperimentERealIndependentEvidenceResult {
  const clock = new EventClock();
  let state = dualDerivationBaseline();
  for (let i = 0; i < 2; i++) {
    const round = runOneRound(state, `decision:phase2_97-expE:${i}`, `${seed}-r${i}`, clock);
    state = round.nextState;
  }
  const round3 = runReasonNucleiRound(state, 'decision:phase2_97-expE:3', `${seed}-r3`, clock);

  const nucleus = keepDinnerNucleus(round3.reasonNucleusTrace);
  const memoryContributions = (nucleus?.correlationTrace.filter((c) => c.id.startsWith('memory:')) ?? []).slice().sort((a, b) =>
    a.id < b.id ? -1 : 1,
  );
  const [firstMemoryContribution, secondMemoryContribution] = memoryContributions;

  const bothFullWeight =
    memoryContributions.length === 2 &&
    memoryContributions.every((c) => c.overlapWithPrior.isZero() && c.effective.equals(c.rawMagnitude));
  const combinedExceedsEitherAlone =
    memoryContributions.length === 2 &&
    firstMemoryContribution!.effective.add(secondMemoryContribution!.effective).gt(firstMemoryContribution!.effective) &&
    firstMemoryContribution!.effective.add(secondMemoryContribution!.effective).gt(secondMemoryContribution!.effective);

  return {
    nucleus,
    firstMemoryContribution,
    secondMemoryContribution,
    bothMemorySignalsKeptFullWeight: bothFullWeight,
    combinedExceedsEitherAlone,
  };
}

// ---------------------------------------------------------------------------
// Experiment F — partial overlap, Brief's own hand-authored spec (Layer 1)
// ---------------------------------------------------------------------------

export interface ExperimentFPartialOverlapResult {
  readonly overlap: Rational;
  readonly firstContribution: ConsolidatedContribution;
  readonly secondContribution: ConsolidatedContribution;
  readonly matchesBriefSpecExactly: boolean;
}

/**
 * Brief Experiment F's own worked example, packaged as a runnable
 * experiment (the same computation `test/evidenceOverlap.test.ts` already
 * validates directly against `kernel/evidenceOverlap.ts`): basis
 * A={1,2,3}, basis B={3,4,5}, magnitudes 5 and 3 respectively — real
 * partial overlap (Overlap=1/5) with no genuine Decision to derive it from
 * (the brief's own spec is itself the fixture; Layer 2 above is what
 * supplies the "found in a real Decision" half of D/E). Overlap=1/5 sits
 * strictly between D's Overlap=1 (fully redundant) and E's Overlap=0
 * (fully independent) by construction.
 */
export function runExperimentF_PartialOverlapHandAuthored(): ExperimentFPartialOverlapResult {
  const basisA = evidenceBasisOf([
    ['1', Rational.ONE],
    ['2', Rational.ONE],
    ['3', Rational.ONE],
  ]);
  const basisB = evidenceBasisOf([
    ['3', Rational.ONE],
    ['4', Rational.ONE],
    ['5', Rational.ONE],
  ]);
  const [firstContribution, secondContribution] = consolidateCorrelated([
    { id: 'a', magnitude: ratOf(5), basis: basisA },
    { id: 'b', magnitude: ratOf(3), basis: basisB },
  ]);
  return {
    overlap: secondContribution.overlapWithPrior,
    firstContribution,
    secondContribution,
    matchesBriefSpecExactly:
      secondContribution.overlapWithPrior.equals(ratOf(1, 5)) &&
      secondContribution.independentFraction.equals(ratOf(4, 5)) &&
      secondContribution.effective.equals(ratOf(12, 5)),
  };
}
