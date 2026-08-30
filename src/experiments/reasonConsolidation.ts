/**
 * Phase 2.95 — Reason Consolidation & Identity Fault Lines.
 *
 * An external review of Phase 2.9's RESOLVED write-up (recorded verbatim in
 * this project's own history — see RESEARCH.md's Phase 2.95 entry)
 * identified a single root structural cause behind two separate findings
 * that Phase 2.9 had reported as fundamental limits rather than
 * implementation gaps:
 *
 *   1. Experiment E (trait acquisition) only demonstrated smooth evidence
 *      accumulation with `identityFeedbackEnabled: false` — never under the
 *      ordinary feedback-on loop.
 *   2. Experiment I (identity fault line) never produced a genuine
 *      "opposing identity re-contests an otherwise near-automatic decision"
 *      outcome — only near-total cancellation, or a discrete "whole extra
 *      die" jump that flipped which option dictated the outcome outright.
 *
 * The review traced both to the SAME cause: under Phase 2.9's architecture,
 * `identityConsistency` was assembled into its OWN separate
 * `DecisionInfluence`, subject to its OWN independent
 * `thetaInfluenceFloor` check — so identity's contribution to a Decision
 * was structurally "all or nothing" per option, never able to COMBINE with
 * an already-present but individually-sub-floor Need signal on the same
 * topic. `identity.ts`'s own Phase 2.9 doc comment even proved this
 * mathematically: `Alignment(o,k) = boundedResponse(TaggedPressure(o,k) -
 * Σ_others)` can never exceed an option's own raw tagged pressure, so no
 * identity strength, however large, could ever lift a floored option's
 * identity-consistency Influence up to the floor on its own.
 *
 * Phase 2.95's fix (`model/decision.ts::sumRawBySemanticChannel`/
 * `boundAndFloorChannels`/`boundAllChannels`, `model/identity.ts::
 * identityFeedbackRawInfluences`, and `model/cycle.ts::runDecisionCycle`'s
 * rewritten consolidation pipeline) makes identity's per-channel pull a raw,
 * pre-bound contribution that joins the SAME semantic-channel pool as this
 * option's own Need/accessibility pressure, summed and bound-and-floored
 * together exactly once. This file is the required experiment suite the
 * review specified to verify that fix actually closes the gap — each case
 * below runs the real `runDecisionCycle` pipeline end-to-end (never a
 * hand-picked `resolveDecision` fixture), per this project's standing
 * "run it, don't guess" discipline, and each was tuned by the same
 * empirical search process (see RESEARCH.md's Phase 2.95 entry for the
 * numbers this file's parameters were found from — nothing here was
 * predicted in advance).
 */

import { Rational, ratOf } from '../kernel/rational';
import { EventClock } from '../kernel/event';
import { CharacterState, withExpectation, withNeedLevel, withIdentityEvidence } from '../model/character';
import { DecisionExpression } from '../model/decision';
import { runDecisionCycle } from '../model/cycle';
import { identityStrength, isConsolidated, CHANNEL_ORDER } from '../model/identity';
import {
  defaultDecisionScenario,
  defaultDecisionCycleParams,
  defaultSemanticReasonPolarity,
  defaultReasonChannelMapping,
  dinnerVsWorkDecision,
  crossAxisFaultLineDecision,
  decisionOutcomeTables,
  PERSON_GLEN,
  NEED_CONNECTION,
  ACTIVITY_WORK,
  NEED_ACHIEVEMENT,
  ACTIVITY_MEETING,
  NEED_RECOGNITION,
  ACTION_KEEP_DINNER_PROMISE,
  ACTION_SPEAK_UP,
} from '../model/scenario';
import {
  runExperimentE_TraitAcquisition,
  runRepeatedRounds,
  resetDinnerVsWorkBaseline,
  strongSide,
  weakSide,
  DEPENDABLE_TRAIT,
} from './identityFormation';

const mapping = defaultReasonChannelMapping();
const semanticPolarity = defaultSemanticReasonPolarity();

function decisionParamsOf() {
  return defaultDecisionCycleParams().decision;
}

// ---------------------------------------------------------------------------
// Target A — Gradual identity influence (review item A)
// ---------------------------------------------------------------------------

export interface GradualInfluenceSample {
  readonly identityEvidenceSupport: Rational;
  readonly pKeepDinner: Rational;
  readonly resolutionMode: string;
}

export interface ExperimentGradualIdentityInfluenceResult {
  readonly samples: readonly GradualInfluenceSample[];
  readonly probabilityMonotonicNondecreasing: boolean;
  readonly neverFullyDictatesEvenAtSaturation: boolean;
  readonly atLeastOneRealTransitionOccurred: boolean;
  readonly largestSingleStepJump: Rational;
}

/**
 * Sweeps established CommitmentFidelity evidence (Support, Opposition
 * fixed at 0) across a fine, wide grid — 0 through a value well past
 * `IdentityStrength`'s practical saturation point — against the SAME
 * dinner-vs-work Decision each time, and asks whether the resulting
 * pre-roll probability responds the way Brief §22 says it should
 * ("strengthens a reason; never dictates the Action"): monotonic
 * (identity never makes an already-favored option LESS likely), and never
 * fully deterministic (neither probability ever reaches exactly 0 or 1, no
 * matter how much identity evidence accumulates).
 *
 * HONEST SCOPING (found empirically, not predicted): the underlying
 * per-channel consolidated strength IS a smooth, continuous, monotonically
 * saturating function of identity strength (it is, by construction, a sum
 * of two bounded-or-boundable quantities run through one shared
 * `boundedResponse` call) — but `strengthToDie`'s five-bucket reference
 * scale (Brief §8) is not, and was never meant to be: a Decision's dice are
 * an AUTHORED discrete scale, not a continuous one. So this sweep still
 * shows ONE visible probability transition (this file's tuned parameters
 * land it going from a 50/50 tie to a 0.89/0.11 split as identity crosses a
 * die-bracket boundary), not a perfectly smooth ramp. What Phase 2.95
 * actually changes is DIFFERENT from "make dice continuous": it is that
 * this transition is now a change to an ALREADY-EXISTING, ALREADY-DICE-
 * ELIGIBLE channel's bracket, not the sudden appearance of a wholly
 * independent extra die from a channel that had zero die-eligible pressure
 * a moment before (contrast Target B below, and the old Experiment I
 * finding this file's sibling, `identityFormation.ts`, already documents).
 */
export function runExperimentGradualIdentityInfluence(seed = 'phase2_95-targetA-seed'): ExperimentGradualIdentityInfluenceResult {
  const decision = dinnerVsWorkDecision('decision:targetA');
  const outcomeTables = decisionOutcomeTables();
  const params = defaultDecisionCycleParams();

  function baseState(): CharacterState {
    let s = defaultDecisionScenario();
    s = withExpectation(s, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(2, 5), tau: ratOf(5), lastUpdatedAt: 0 });
    s = withExpectation(s, ACTIVITY_WORK, NEED_ACHIEVEMENT, { mu: ratOf(2, 5), tau: ratOf(5), lastUpdatedAt: 0 });
    return s;
  }

  // Fine, wide grid: 0.0 .. 30.0 in steps of 0.1 (300 samples) — dense
  // enough that a single-bracket transition, if one occurs, is localized to
  // a specific, narrow support interval rather than hidden inside a coarse
  // step.
  const supports: Rational[] = [];
  for (let tenths = 0; tenths <= 300; tenths += 1) supports.push(ratOf(tenths, 10));

  const samples: GradualInfluenceSample[] = supports.map((support) => {
    const state = withIdentityEvidence(baseState(), 'CommitmentFidelity', { support, opposition: Rational.ZERO });
    const result = runDecisionCycle(state.characterId, state, decision, outcomeTables, params, mapping, semanticPolarity, new EventClock(), seed).decisionExpression;
    const pKeepDinner = result.preRollOptionProbabilities.find((p) => p.optionKey === ACTION_KEEP_DINNER_PROMISE)!.probability;
    return { identityEvidenceSupport: support, pKeepDinner, resolutionMode: result.resolutionMode };
  });

  let monotonic = true;
  let largestJump = Rational.ZERO;
  for (let i = 1; i < samples.length; i++) {
    if (samples[i].pKeepDinner.lt(samples[i - 1].pKeepDinner)) monotonic = false;
    const jump = samples[i].pKeepDinner.sub(samples[i - 1].pKeepDinner).abs();
    if (jump.gt(largestJump)) largestJump = jump;
  }
  const neverFullyDictates = samples.every((s) => s.pKeepDinner.gt(Rational.ZERO) && s.pKeepDinner.lt(Rational.ONE));
  const atLeastOneTransition = largestJump.gt(Rational.ZERO);

  return {
    samples,
    probabilityMonotonicNondecreasing: monotonic,
    neverFullyDictatesEvenAtSaturation: neverFullyDictates,
    atLeastOneRealTransitionOccurred: atLeastOneTransition,
    largestSingleStepJump: largestJump,
  };
}

// ---------------------------------------------------------------------------
// Target B — Weak-signal combination (review item B)
// ---------------------------------------------------------------------------

export interface ExperimentWeakSignalCombinationResult {
  readonly withoutIdentity: DecisionExpression;
  readonly withIdentity: DecisionExpression;
  readonly needAloneNeverClearsTheFloor: boolean;
  readonly identityAloneWouldBeTooWeakToo: boolean;
  readonly combinedTheyClearIt: boolean;
}

/**
 * The review's central ask, made concrete: an Option (Keep Dinner) whose
 * own raw Need-sourced ('commitment' channel) pressure is real but too weak
 * to independently clear `thetaInfluenceFloor` — with `identityFeedbackEnabled:
 * false`, it gets NO die at all, and (since Stay At Work's own die is
 * strictly positive-signed) Keep Dinner's win probability is exactly 0: an
 * option Need alone has already, silently, ruled out. A weak — not
 * strong — CommitmentFidelity establishment (Support=1, well short of
 * Experiment E/H's consolidated levels) is then added on the SAME
 * 'commitment' channel. Neither alone would clear the floor (verified
 * directly against `identityAloneWouldBeTooWeakToo` below, using the exact
 * same weak evidence level in isolation against a channel with zero Need
 * pressure); consolidated together on the shared channel, Keep Dinner gets
 * a real, surviving d4 and a genuinely nonzero chance — precisely the
 * "floor-rescue impossibility" the review identified as mathematically
 * unreachable under Phase 2.9's architecture (see this file's own module
 * comment, and `identityFormation.ts`'s Experiment I doc comment for the
 * original proof).
 */
export function runExperimentWeakSignalCombination(seed = 'phase2_95-targetB-seed'): ExperimentWeakSignalCombinationResult {
  let state = defaultDecisionScenario();
  state = withExpectation(state, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(1, 4), tau: ratOf(3), lastUpdatedAt: 0 });
  state = withExpectation(state, ACTIVITY_WORK, NEED_ACHIEVEMENT, { mu: ratOf(7, 10), tau: ratOf(10), lastUpdatedAt: 0 });
  const weaklyEstablished = withIdentityEvidence(state, 'CommitmentFidelity', { support: ratOf(1), opposition: Rational.ZERO });

  const decision = dinnerVsWorkDecision('decision:targetB');
  const outcomeTables = decisionOutcomeTables();
  const paramsOff = { ...defaultDecisionCycleParams(), decision: { ...decisionParamsOf(), identityFeedbackEnabled: false } };
  const paramsOn = { ...defaultDecisionCycleParams(), decision: { ...decisionParamsOf(), identityFeedbackEnabled: true } };

  const withoutIdentity = runDecisionCycle(
    weaklyEstablished.characterId,
    weaklyEstablished,
    decision,
    outcomeTables,
    paramsOff,
    mapping,
    semanticPolarity,
    new EventClock(),
    seed,
  ).decisionExpression;
  const withIdentity = runDecisionCycle(
    weaklyEstablished.characterId,
    weaklyEstablished,
    decision,
    outcomeTables,
    paramsOn,
    mapping,
    semanticPolarity,
    new EventClock(),
    seed,
  ).decisionExpression;

  // "Identity alone would be too weak too": the SAME weak evidence level,
  // against a state where Glen/Connection contributes essentially nothing
  // (mu near zero) — if this weak an identity, unaided, could clear the
  // floor by itself, Target B would not actually be testing COMBINATION.
  let identityAloneState = defaultDecisionScenario();
  identityAloneState = withExpectation(identityAloneState, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(1, 1000), tau: ratOf(3), lastUpdatedAt: 0 });
  identityAloneState = withExpectation(identityAloneState, ACTIVITY_WORK, NEED_ACHIEVEMENT, { mu: ratOf(7, 10), tau: ratOf(10), lastUpdatedAt: 0 });
  identityAloneState = withIdentityEvidence(identityAloneState, 'CommitmentFidelity', { support: ratOf(1), opposition: Rational.ZERO });
  const identityAloneResult = runDecisionCycle(
    identityAloneState.characterId,
    identityAloneState,
    decision,
    outcomeTables,
    paramsOn,
    mapping,
    semanticPolarity,
    new EventClock(),
    seed,
  ).decisionExpression;
  const pKeepIdentityAlone = identityAloneResult.preRollOptionProbabilities.find((p) => p.optionKey === ACTION_KEEP_DINNER_PROMISE)!.probability;

  const pKeepOff = withoutIdentity.preRollOptionProbabilities.find((p) => p.optionKey === ACTION_KEEP_DINNER_PROMISE)!.probability;
  const pKeepOn = withIdentity.preRollOptionProbabilities.find((p) => p.optionKey === ACTION_KEEP_DINNER_PROMISE)!.probability;

  return {
    withoutIdentity,
    withIdentity,
    needAloneNeverClearsTheFloor: pKeepOff.equals(Rational.ZERO),
    identityAloneWouldBeTooWeakToo: pKeepIdentityAlone.equals(Rational.ZERO),
    combinedTheyClearIt: pKeepOn.gt(Rational.ZERO),
  };
}

// ---------------------------------------------------------------------------
// Target C — A real identity fault line (review item C)
// ---------------------------------------------------------------------------

export interface ExperimentRealFaultLineResult {
  readonly withoutIdentity: DecisionExpression;
  readonly withIdentity: DecisionExpression;
  readonly bothRunsPlayerFacing: boolean;
  readonly contestIncreased: boolean;
  readonly keepDinnerStillFavoredButLessSo: boolean;
  readonly neitherProbabilityHitZeroOrOne: boolean;
}

/**
 * Phase 2.9's Experiment I could only ever produce near-total cancellation
 * or a discrete "whole extra die" flip that handed the decision entirely to
 * whichever option identity favored (see `identityFormation.ts`'s doc
 * comment on that experiment). This case instead asks for the review's
 * literal target C behavior: an opposing, previously-uninvolved identity
 * (RiskAcceptance, anchored to Speak Up) turning Contest UP — making an
 * otherwise fairly one-sided dinner-vs-speak-up matchup MORE genuinely
 * contested — without flipping which option leads or collapsing the
 * decision to Auto.
 *
 * Found empirically (this file's own parameter search, recorded in
 * RESEARCH.md's Phase 2.95 entry): Keep Dinner set up with a real but not
 * overwhelming lean (both options survive on raw Need alone, Contest=0.5,
 * PlayerFacingRoll, p(Keep Dinner)=0.75) plus a MODEST (not near-asymptotic)
 * RiskAcceptance establishment anchored to Speak Up. Speak Up's own weak
 * 'recognition'-channel Need pressure combines with RiskAcceptance's
 * feedback pull on that SAME channel, crossing exactly one die-bracket
 * boundary — narrowing, not reversing, Keep Dinner's lead (p(Keep Dinner)
 * 0.75 -> 0.625, Contest 0.5 -> 0.75), remaining a genuine dice-resolved,
 * player-facing decision throughout. This is the die-bracket system's own
 * version of "identity re-contests an otherwise near-automatic decision"
 * (Brief §26's original framing) — narrower than a fully continuous system
 * would allow, but a real, qualitatively different outcome from Phase 2.9's
 * cancellation-or-flip dichotomy.
 */
export function runExperimentRealFaultLine(seed = 'phase2_95-targetC-seed'): ExperimentRealFaultLineResult {
  let state = defaultDecisionScenario();
  state = withNeedLevel(state, NEED_CONNECTION, ratOf(1, 4));
  state = withExpectation(state, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(6, 5), tau: ratOf(10), lastUpdatedAt: 0 });
  state = withNeedLevel(state, NEED_RECOGNITION, ratOf(3, 10));
  state = withExpectation(state, ACTIVITY_MEETING, NEED_RECOGNITION, { mu: ratOf(1, 2), tau: ratOf(10), lastUpdatedAt: 0 });
  const withRiskAcceptance = withIdentityEvidence(state, 'RiskAcceptance', { support: ratOf(1), opposition: Rational.ZERO });

  const decision = crossAxisFaultLineDecision('decision:targetC', ACTION_KEEP_DINNER_PROMISE, ACTION_SPEAK_UP);
  const outcomeTables = decisionOutcomeTables();
  const paramsOff = { ...defaultDecisionCycleParams(), decision: { ...decisionParamsOf(), identityFeedbackEnabled: false } };
  const paramsOn = { ...defaultDecisionCycleParams(), decision: { ...decisionParamsOf(), identityFeedbackEnabled: true } };

  const withoutIdentity = runDecisionCycle(
    withRiskAcceptance.characterId,
    withRiskAcceptance,
    decision,
    outcomeTables,
    paramsOff,
    mapping,
    semanticPolarity,
    new EventClock(),
    seed,
  ).decisionExpression;
  const withIdentity = runDecisionCycle(
    withRiskAcceptance.characterId,
    withRiskAcceptance,
    decision,
    outcomeTables,
    paramsOn,
    mapping,
    semanticPolarity,
    new EventClock(),
    seed,
  ).decisionExpression;

  const pKeepOff = withoutIdentity.preRollOptionProbabilities.find((p) => p.optionKey === ACTION_KEEP_DINNER_PROMISE)!.probability;
  const pKeepOn = withIdentity.preRollOptionProbabilities.find((p) => p.optionKey === ACTION_KEEP_DINNER_PROMISE)!.probability;
  const nontrivial = (e: DecisionExpression) => e.preRollOptionProbabilities.every((p) => p.probability.gt(Rational.ZERO) && p.probability.lt(Rational.ONE));

  return {
    withoutIdentity,
    withIdentity,
    bothRunsPlayerFacing: withoutIdentity.resolutionMode === 'PlayerFacingRoll' && withIdentity.resolutionMode === 'PlayerFacingRoll',
    contestIncreased: withIdentity.contest.gt(withoutIdentity.contest),
    keepDinnerStillFavoredButLessSo: pKeepOn.lt(pKeepOff) && pKeepOn.gt(ratOf(1, 2)),
    neitherProbabilityHitZeroOrOne: nontrivial(withoutIdentity) && nontrivial(withIdentity),
  };
}

// ---------------------------------------------------------------------------
// Target D — Identity transformation WITH feedback active (review item D)
// ---------------------------------------------------------------------------

export interface ExperimentTransformationWithFeedbackResult {
  readonly strengthAfterAcquisition: Rational;
  readonly consolidatedAfterAcquisition: boolean;
  readonly strengthAfterSustainedContradiction: Rational;
  readonly consolidatedAfterSustainedContradiction: boolean;
  readonly strengthDroppedWithFeedbackActive: boolean;
  readonly rounds: number;
}

/**
 * Phase 2.9's Experiment J found that running its contradiction rounds
 * WITH `identityFeedbackEnabled: true` produced a strength that stayed
 * flat or drifted upward — an established identity's own feedback channel
 * actively resisted the very contradiction meant to erode it (self-
 * stabilization, discovered empirically and documented in that
 * experiment's own doc comment), so J was forced to disable feedback to
 * isolate pure behavioral counter-evidence. The review asked whether Phase
 * 2.95's architecture changes this.
 *
 * It does, but NOT — this file's own empirically-corrected finding — at
 * Experiment J's own bias level. Reusing Experiment E's exact
 * consolidated-`Dependable` starting state and Experiment J's IDENTICAL
 * `weakSide(2/5)` Glen bias, running the contradiction with feedback left ON
 * at J's own `strongSide(2)` Work bias reproduces J's original finding
 * essentially unchanged: identity's resistance pull wins most rounds outright
 * (Keep Dinner is still chosen ~86% of the time), so strength DRIFTS UP, not
 * down (verified directly — see `scratch_probe_D3` in this project's own
 * search history) — the self-stabilization Experiment H/J describe is real
 * under Phase 2.95 too, not eliminated by the consolidation fix. What the fix
 * changes is WHERE the fault line sits, not whether one exists: a modest
 * further increase in Work's own raw pressure (`strongSide(9/4)` instead of
 * `strongSide(2)` — a single die-bracket's worth more, `2` and `9/4` both
 * land in "very strong" pre-`boundedResponse` territory but `9/4` clears a
 * threshold `2` does not once identity's own opposing pull is subtracted from
 * the same shared channel) is enough to flip which side wins the sustained
 * contradiction outright (Stay At Work now wins ~93% of rounds, not ~14%) —
 * and that flip is what produces real erosion: CommitmentFidelity strength
 * falls from ~0.53 (consolidated) to ~0.21 (no longer consolidated) over 150
 * rounds. This is the honest shape of the result: Phase 2.95 does not make
 * identity's resistance to contradiction weaker in general (it did not
 * remove the self-stabilization mechanism) — it makes the SAME contradiction
 * pressure that used to be swamped by identity's own separately-floored
 * resistance now compete on equal footing in one shared pool, so a
 * sufficiently committed (not dramatically larger — one bracket, not an
 * order of magnitude) sustained contradiction can now win where before it
 * could not, and winning consistently is what lets Alignment's negative term
 * actually accumulate real Opposition evidence instead of being swamped by
 * the rare rounds contradiction still won under the old architecture.
 */
export function runExperimentTransformationWithFeedback(rounds = 150): ExperimentTransformationWithFeedbackResult {
  const acquisition = runExperimentE_TraitAcquisition('phase2_95-targetD-acquisition-seed', 50);
  const paramsD = decisionParamsOf();
  const strengthOf = (state: CharacterState) =>
    identityStrength(state.identityEvidence.get('CommitmentFidelity') ?? { support: Rational.ZERO, opposition: Rational.ZERO }, paramsD.kI);
  const consolidatedIn = (state: CharacterState) =>
    isConsolidated(
      DEPENDABLE_TRAIT,
      CHANNEL_ORDER.map((c) => identityStrength(state.identityEvidence.get(c) ?? { support: Rational.ZERO, opposition: Rational.ZERO }, paramsD.kI)),
      state.identityEvidence,
      paramsD.kC,
      paramsD.thetaTrait,
      paramsD.thetaConfidence,
    );

  const strengthAfterAcquisition = strengthOf(acquisition.run.finalState);
  const consolidatedAfterAcquisition = consolidatedIn(acquisition.run.finalState);

  // Feedback left at its DEFAULT (true) for the entire contradiction run —
  // no ablation override, unlike Experiment J. Work's bias is deliberately
  // ONE bracket stronger than Experiment J's own `strongSide(2)` — see the
  // doc comment above for why that specific, modest increase (not J's own
  // level) is what actually lets sustained contradiction win consistently
  // enough to erode identity under feedback-on.
  const contradiction = runRepeatedRounds(
    acquisition.run.finalState,
    dinnerVsWorkDecision,
    resetDinnerVsWorkBaseline(weakSide(ratOf(2, 5)), strongSide(ratOf(9, 4))),
    'phase2_95-targetD-contradiction-seed',
    'decision:targetD',
    rounds,
  );
  const strengthAfterSustainedContradiction = strengthOf(contradiction.finalState);
  const consolidatedAfterSustainedContradiction = consolidatedIn(contradiction.finalState);

  return {
    strengthAfterAcquisition,
    consolidatedAfterAcquisition,
    strengthAfterSustainedContradiction,
    consolidatedAfterSustainedContradiction,
    strengthDroppedWithFeedbackActive: strengthAfterSustainedContradiction.lt(strengthAfterAcquisition),
    rounds,
  };
}

// ---------------------------------------------------------------------------
// Target E — Canonical trait acquisition WITH feedback ON, from zero
// (review item E)
// ---------------------------------------------------------------------------

export interface ExperimentCanonicalAcquisitionWithFeedbackResult {
  readonly finalStrength: Rational;
  readonly finalConfidence: Rational;
  readonly traitConsolidated: boolean;
  readonly roundsRun: number;
  readonly stabilizedByRound: number | null; // first round whose strength equals the final strength, or null if still moving
  readonly evidenceAccumulatedWithoutAblation: boolean;
}

/**
 * The review's explicit instruction: prove trait consolidation can be
 * demonstrated under the ORDINARY feedback-on loop, not only via
 * Experiment E's `identityFeedbackEnabled: false` ablation (which isolates
 * pure behavioral acquisition from feedback — a deliberate, documented
 * scoping choice for THAT experiment, not a claim that feedback-on
 * acquisition is impossible). Runs the SAME dinner-vs-work bias Experiment
 * E/H use, from a completely fresh `defaultDecisionScenario()` (zero
 * identity evidence), for 200 rounds, with feedback at its ordinary default
 * (`true`) throughout.
 *
 * Found empirically: CommitmentFidelity strength rises continuously and
 * consolidates `Dependable` by round ~150, then self-stabilizes (Experiment
 * H's own mechanism — Contest falls as identity strengthens, shrinking
 * AuthorshipPotential and therefore further evidence) at a fixed asymptotic
 * strength for the remaining rounds. This is exactly Brief §24's own
 * natural-stabilization hypothesis playing out as a STABLE, CONSOLIDATED
 * endpoint, not a ceiling that prevents consolidation from ever being
 * reached in the first place.
 */
export function runExperimentCanonicalAcquisitionWithFeedback(seed = 'phase2_95-targetE-seed', rounds = 200): ExperimentCanonicalAcquisitionWithFeedbackResult {
  const run = runRepeatedRounds(
    defaultDecisionScenario(),
    dinnerVsWorkDecision,
    resetDinnerVsWorkBaseline(strongSide(ratOf(2)), weakSide(ratOf(2, 5))),
    seed,
    'decision:targetE',
    rounds,
    // No paramsOverride: identityFeedbackEnabled stays at its default (true).
  );
  const params = decisionParamsOf();
  const finalEvidence = run.finalState.identityEvidence.get('CommitmentFidelity') ?? { support: Rational.ZERO, opposition: Rational.ZERO };
  const finalStrength = identityStrength(finalEvidence, params.kI);
  const finalConfidence = run.rounds[run.rounds.length - 1].identityConfidenceCommitmentFidelity;
  const I = CHANNEL_ORDER.map((c) => identityStrength(run.finalState.identityEvidence.get(c) ?? { support: Rational.ZERO, opposition: Rational.ZERO }, params.kI));
  const traitConsolidated = isConsolidated(DEPENDABLE_TRAIT, I, run.finalState.identityEvidence, params.kC, params.thetaTrait, params.thetaConfidence);

  let stabilizedByRound: number | null = null;
  for (let i = 0; i < run.rounds.length; i++) {
    if (run.rounds[i].identityStrengthCommitmentFidelity.equals(finalStrength)) {
      stabilizedByRound = i;
      break;
    }
  }

  return {
    finalStrength,
    finalConfidence,
    traitConsolidated,
    roundsRun: rounds,
    stabilizedByRound,
    evidenceAccumulatedWithoutAblation: finalEvidence.support.gt(Rational.ZERO),
  };
}
