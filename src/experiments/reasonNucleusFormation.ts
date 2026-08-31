/**
 * Phase 2.97 — Reason Nucleus Formation (Experiments A, B, C).
 *
 * Phase 2.9/2.95's `SemanticReasonChannelId` consolidation groups raw
 * pressure by ONE dimension — a semantic channel scoped to an Option — so it
 * cannot express "this option carries several independently-intelligible
 * motives about the same person" (multiple motive channels, one referent)
 * or "two options express the same motive about two different people" (one
 * motive channel, multiple referents) without either merging reasons that
 * shouldn't merge or hand-authoring more channels per scenario. These three
 * experiments run the REAL `runDecisionCycle` pipeline end-to-end under
 * `compilationMode: 'reasonNuclei'` (never a hand-built `compileReasonDice`
 * fixture — those already live in `test/phase2_97DiceCompiler.test.ts` as
 * pure compiler-math checks) and assert exact nucleus COUNT and IDENTITY
 * (which MotiveChannel/ReferentKey each compiled nucleus actually carries),
 * not merely "some die exists," per this project's "run it, don't guess"
 * discipline.
 *
 * Experiment A — baseline: a Decision's ordinary two-Option scenario, only
 * one Need seeded per Option's subject, forms exactly one MotiveGenerating
 * nucleus per Option from that Need plus (when accessibility is nonzero) one
 * from `REASON_CHANNEL_ACCESSIBILITY`'s Phase 2.9/2.95 Habit-channel home —
 * never more, never fewer, confirming the pipeline doesn't manufacture
 * nuclei the scenario's actual pressure doesn't support.
 *
 * Experiment B — same referent, several motives: Keep Dinner Promise's
 * subject (Glen) is additionally seeded with real NeedExpectations across
 * Achievement and Recognition (on top of its own Connection), so ONE Option
 * carries THREE independently-intelligible MotiveGenerating signals about
 * the SAME referent — Phase 2.95's flat channel consolidation could bundle
 * or lose this distinction; Phase 2.97 keeps all three as separate nuclei.
 *
 * Experiment C — same motive, different referents: Keep Dinner Promise
 * (Glen) and Stay At Work (the Work activity) both get a real Connection-
 * mapped NeedExpectation seeded against their own (different) subjects —
 * both Options' resolved nuclei land on the SAME MotiveChannel
 * ('Connection') but on two DIFFERENT ReferentKeys, and must resolve to two
 * independent nuclei rather than one merged one, since Central Consolidation
 * is keyed on (Option, MotiveChannel, Referent) as a whole.
 */

import { Rational, ratOf } from '../kernel/rational';
import { EventClock } from '../kernel/event';
import { CanonicalActionKey } from '../kernel/canonical';
import { withExpectation } from '../model/character';
import { CompiledNucleus } from '../model/diceCompiler';
import { MotiveChannel, ReferentKey } from '../model/reasonNucleus';
import { runDecisionCycle, ReasonNucleusTrace } from '../model/cycle';
import {
  defaultDecisionScenario,
  defaultDecisionCycleParams,
  defaultSemanticReasonPolarity,
  defaultReasonChannelMapping,
  defaultMotiveChannelMapping,
  defaultIdentityMotiveChannelMapping,
  dinnerVsWorkDecision,
  decisionOutcomeTables,
  ACTION_KEEP_DINNER_PROMISE,
  ACTION_STAY_AT_WORK,
  PERSON_GLEN,
  ACTIVITY_WORK,
  NEED_CONNECTION,
  NEED_ACHIEVEMENT,
  NEED_RECOGNITION,
} from '../model/scenario';

const semanticPolarity = defaultSemanticReasonPolarity();
const legacyMapping = defaultReasonChannelMapping();
const needMapping = defaultMotiveChannelMapping();
const identityMapping = defaultIdentityMotiveChannelMapping();

function reasonNucleiParams() {
  const legacy = defaultDecisionCycleParams();
  return { ...legacy, decision: { ...legacy.decision, compilationMode: 'reasonNuclei' as const } };
}

/** Run one real reasonNuclei-mode Decision and return its ReasonNucleusTrace
 * (never null — this is always called with compilationMode: 'reasonNuclei'). */
function compileRealDecision(state: Parameters<typeof runDecisionCycle>[1], decisionId: string, seed: string): ReasonNucleusTrace {
  const decision = dinnerVsWorkDecision(decisionId);
  const outcomeTables = decisionOutcomeTables();
  const result = runDecisionCycle(
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
  return result.reasonNucleusTrace!;
}

function nucleiFor(trace: ReasonNucleusTrace, option: CanonicalActionKey): readonly CompiledNucleus[] {
  return trace.get(option) ?? [];
}

function channelsOf(nuclei: readonly CompiledNucleus[]): MotiveChannel[] {
  return nuclei.map((n) => n.key.motiveChannel).sort();
}

function referentsOf(nuclei: readonly CompiledNucleus[]): ReferentKey[] {
  return nuclei.map((n) => n.key.referent);
}

/** A comfortably-clearing NeedExpectation — mirrors `identityFormation.ts::
 * strongSide`'s own `mu > 1` convention (NeedExpectation has no authored
 * upper bound; this is "expected effect," not a probability). Found
 * empirically (this file's own probe, `scratch/debug97.ts`): against this
 * scenario's own urgency/confidence levels, mu=2/tau=100 lands comfortably
 * inside the d6-d8 base-die brackets — well clear of
 * `defaultReasonNucleusParams().thetaReason` (0.15) — while the scenario's
 * OWN baseline seeds (mu=2/5, unchanged elsewhere) stay well below it. This
 * is exactly the calibration gap `experiments/calibrationSweeps.ts`
 * (Experiment L) studies on its own terms; here it is simply a means to a
 * clean formation result, not itself under test.
 */
const STRONG = { mu: ratOf(2), tau: ratOf(100), lastUpdatedAt: 0 };

// ---------------------------------------------------------------------------
// Experiment A — baseline: exactly one Need-sourced nucleus, plus
// accessibility's, never more
// ---------------------------------------------------------------------------

export interface ExperimentANucleusFormationResult {
  readonly trace: ReasonNucleusTrace;
  readonly keepDinnerChannels: readonly MotiveChannel[];
  readonly stayAtWorkChannels: readonly MotiveChannel[];
  readonly keepDinnerReferentsAreAllGlen: boolean;
  readonly stayAtWorkReferentsAreAllWork: boolean;
  readonly noSpuriousChannels: boolean;
}

export function runExperimentA_BaselineFormation(seed = 'phase2_97-expA-seed'): ExperimentANucleusFormationResult {
  // The scenario's own baseline seeds (mu=2/5) are deliberately modest — a
  // fresh character's rough first impression, per
  // `defaultDecisionScenario()`'s own doc comment — and land below
  // `thetaReason` once each Need's contribution stands alone in its own
  // MotiveChannel bucket rather than pooled with others the way legacy
  // mode's semantic channels pool it. This experiment is about FORMATION
  // shape, not calibration (that is Experiment L's job), so each subject's
  // one relevant Need is strengthened to a level known to clear the
  // threshold — nothing else is touched, so a first-ever Decision (no
  // associative history yet) has exactly one real MotiveGenerating source
  // per Option and no accessibility pressure to compete with it.
  let state = defaultDecisionScenario();
  state = withExpectation(state, PERSON_GLEN, NEED_CONNECTION, STRONG);
  state = withExpectation(state, ACTIVITY_WORK, NEED_ACHIEVEMENT, STRONG);
  const trace = compileRealDecision(state, 'decision:phase2_97-expA', seed);

  const keepDinner = nucleiFor(trace, ACTION_KEEP_DINNER_PROMISE);
  const stayAtWork = nucleiFor(trace, ACTION_STAY_AT_WORK);
  const keepDinnerChannels = channelsOf(keepDinner);
  const stayAtWorkChannels = channelsOf(stayAtWork);

  // No other Need is seeded against either subject, and this is a
  // first-ever Decision (a fresh CharacterState has no associative history,
  // so accessibility is exactly zero and contributes no 'Habit' signal) —
  // exactly one nucleus per Option is the only legitimate outcome.
  const allowed = new Set<MotiveChannel>(['Connection', 'Achievement']);
  const noSpurious =
    keepDinnerChannels.length === 1 &&
    stayAtWorkChannels.length === 1 &&
    [...keepDinnerChannels, ...stayAtWorkChannels].every((c) => allowed.has(c));

  return {
    trace,
    keepDinnerChannels,
    stayAtWorkChannels,
    keepDinnerReferentsAreAllGlen: referentsOf(keepDinner).every((r) => r === PERSON_GLEN),
    stayAtWorkReferentsAreAllWork: referentsOf(stayAtWork).every((r) => r === ACTIVITY_WORK),
    noSpuriousChannels: noSpurious,
  };
}

// ---------------------------------------------------------------------------
// Experiment B — same referent, several independently-intelligible motives
// ---------------------------------------------------------------------------

export interface ExperimentBSameReferentResult {
  readonly trace: ReasonNucleusTrace;
  readonly keepDinnerNuclei: readonly CompiledNucleus[];
  readonly distinctMotiveChannels: readonly MotiveChannel[];
  readonly allShareGlenAsReferent: boolean;
  readonly atLeastThreeIndependentNuclei: boolean;
}

/**
 * Keep Dinner Promise's subject (Glen) is given real, seeded
 * NeedExpectations across Connection (the scenario's own baseline),
 * Achievement, and Recognition — three Needs this scenario already maps to
 * three distinct MotiveChannels (`defaultMotiveChannelMapping()`), all
 * scored against the SAME subject. `evaluateAction` sums a contribution for
 * EVERY Need the character has against an Option's own subject (never just
 * the "obvious" one for that Option) — an existing, general mechanism this
 * experiment simply gives real seeded pressure to exploit, not a special
 * case authored for this test.
 */
export function runExperimentB_SameReferentSeveralMotives(seed = 'phase2_97-expB-seed'): ExperimentBSameReferentResult {
  let state = defaultDecisionScenario();
  state = withExpectation(state, PERSON_GLEN, NEED_CONNECTION, STRONG);
  state = withExpectation(state, PERSON_GLEN, NEED_ACHIEVEMENT, STRONG);
  state = withExpectation(state, PERSON_GLEN, NEED_RECOGNITION, STRONG);

  const trace = compileRealDecision(state, 'decision:phase2_97-expB', seed);
  const keepDinnerNuclei = nucleiFor(trace, ACTION_KEEP_DINNER_PROMISE);
  const distinctMotiveChannels = [...new Set(channelsOf(keepDinnerNuclei))];

  return {
    trace,
    keepDinnerNuclei,
    distinctMotiveChannels,
    allShareGlenAsReferent: referentsOf(keepDinnerNuclei).every((r) => r === PERSON_GLEN),
    atLeastThreeIndependentNuclei: keepDinnerNuclei.length >= 3 && distinctMotiveChannels.length >= 3,
  };
}

// ---------------------------------------------------------------------------
// Experiment C — same motive, different referents (across two Options)
// ---------------------------------------------------------------------------

export interface ExperimentCSameMotiveResult {
  readonly trace: ReasonNucleusTrace;
  readonly keepDinnerConnectionNucleus: CompiledNucleus | undefined;
  readonly stayAtWorkConnectionNucleus: CompiledNucleus | undefined;
  readonly bothPresent: boolean;
  readonly referentsDiffer: boolean;
  readonly independentNuclei: boolean;
}

/**
 * Stay At Work's subject (the Work activity) is additionally seeded with a
 * real Connection-mapped NeedExpectation — deliberately unusual content
 * (Work does not ordinarily satisfy Connection) but mechanically identical
 * to any other seeded NeedExpectation, exercising the SAME 'Connection'
 * MotiveChannel Keep Dinner Promise already carries against Glen. Central
 * Consolidation is keyed on (Option, MotiveChannel, Referent) as a whole —
 * two Options never share an Option key, so this can never accidentally
 * merge into one nucleus regardless of channel/referent overlap; the
 * assertion here is that both resolve independently, each still correctly
 * attributed to its own Option's own referent.
 */
export function runExperimentC_SameMotiveDifferentReferents(seed = 'phase2_97-expC-seed'): ExperimentCSameMotiveResult {
  let state = defaultDecisionScenario();
  state = withExpectation(state, PERSON_GLEN, NEED_CONNECTION, STRONG);
  state = withExpectation(state, ACTIVITY_WORK, NEED_CONNECTION, STRONG);

  const trace = compileRealDecision(state, 'decision:phase2_97-expC', seed);
  const keepDinnerConnectionNucleus = nucleiFor(trace, ACTION_KEEP_DINNER_PROMISE).find((n) => n.key.motiveChannel === 'Connection');
  const stayAtWorkConnectionNucleus = nucleiFor(trace, ACTION_STAY_AT_WORK).find((n) => n.key.motiveChannel === 'Connection');

  const bothPresent = keepDinnerConnectionNucleus !== undefined && stayAtWorkConnectionNucleus !== undefined;
  const referentsDiffer = bothPresent && keepDinnerConnectionNucleus!.key.referent !== stayAtWorkConnectionNucleus!.key.referent;

  return {
    trace,
    keepDinnerConnectionNucleus,
    stayAtWorkConnectionNucleus,
    bothPresent,
    referentsDiffer,
    // "Independent" here means each carries its own base motive strength/die
    // rather than one being a fragment of the other — checked directly
    // rather than assumed, since it's the entire point of the experiment.
    independentNuclei:
      bothPresent &&
      !keepDinnerConnectionNucleus!.baseMotiveStrength.equals(Rational.ZERO) &&
      !stayAtWorkConnectionNucleus!.baseMotiveStrength.equals(Rational.ZERO),
  };
}
