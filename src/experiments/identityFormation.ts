/**
 * Phase 2.9 experiments E, G, H, I, J — Brief §30's identity-formation half
 * of the Required Experiment Suite (Decision-mechanics experiments A-D/K
 * live in decisionResolution.ts; the flagship seed-divergence experiment F
 * lives in seedDivergence.ts). Every case runs real `runDecisionCycle`
 * calls against `defaultDecisionScenario()`, carrying `identityEvidence`/
 * `decisionHistory`/associations forward across repeated rounds exactly as
 * a real character's biography would accumulate.
 *
 * Shared harness: `runRepeatedRounds` resets ONLY the Need levels/
 * NeedExpectation for whichever Decision axis is in play before each
 * round (via a case-specific `resetFn`), so every round starts from the
 * SAME raw motivational baseline — isolating "what does repeated
 * meaningful choice do to accumulated identity" from incidental Need-state
 * drift the shared `applyChosenAction` tail would otherwise introduce
 * round to round (e.g. Connection refilling after a successful Keep
 * Dinner). `identityEvidence`/`decisionHistory`/associations are NEVER
 * reset — that IS the biography each experiment is measuring.
 *
 * Phase 2.97 post-closure-audit re-baseline: `cycleParamsWith` is pinned to
 * `legacyDecisionCycleParams()` explicitly (not `defaultDecisionCycleParams()`,
 * which now defaults to `'reasonNuclei'`) — every number this file's
 * experiments (and `seedDivergence.ts`, which reuses `runRepeatedRounds`
 * directly) has ever published was measured against the frozen `'legacy'`
 * `SemanticReasonChannelId` pipeline, and this harness's own
 * `runDecisionCycle` call never supplies the `needMotiveChannelMapping`/
 * `identityMotiveChannelMapping` `'reasonNuclei'` mode requires — exactly
 * the historical-reproducibility role `legacyDecisionCycleParams()` exists
 * for. Phase 2.97's own `identityAsModifier.ts` reuses this file's
 * `runRepeatedRounds` for its bootstrap helpers for the same reason (its own
 * doc comments already say so): the bootstrap itself must stay on the
 * legacy pipeline regardless of which pipeline is canonical, only the
 * one-shot Decision probed AFTER bootstrapping opts into `'reasonNuclei'`.
 */

import { Rational, ratOf } from '../kernel/rational';
import { EventClock } from '../kernel/event';
import { CharacterState, withExpectation, withNeedLevel } from '../model/character';
import { Decision, DecisionExpression, DecisionParams } from '../model/decision';
import { CycleParams, runDecisionCycle } from '../model/cycle';
import { identityStrength, identityConfidence, isConsolidated, IdentityTrait, CHANNEL_ORDER, projectTrait } from '../model/identity';
import {
  defaultDecisionScenario,
  defaultDecisionCycleParams,
  legacyDecisionCycleParams,
  defaultSemanticReasonPolarity,
  defaultReasonChannelMapping,
  dinnerVsWorkDecision,
  speakUpVsStayQuietDecision,
  crossAxisFaultLineDecision,
  decisionOutcomeTables,
  PERSON_GLEN,
  NEED_CONNECTION,
  ACTIVITY_WORK,
  NEED_ACHIEVEMENT,
  ACTIVITY_MEETING,
  ACTIVITY_CAUTION,
  NEED_RECOGNITION,
  NEED_SECURITY,
  ACTION_KEEP_DINNER_PROMISE,
  ACTION_STAY_AT_WORK,
  ACTION_SPEAK_UP,
} from '../model/scenario';

/** The single-channel `Dependable` trait — Brief §21's own worked example
 * ("Dependable → strong positive CommitmentFidelity") — reused verbatim
 * from `test/phase2_9Identity.test.ts`'s fixture: all-zero `Q`, a single 1
 * in `w` at CommitmentFidelity's index. */
const DEPENDABLE_IDX = CHANNEL_ORDER.indexOf('CommitmentFidelity');
export const DEPENDABLE_TRAIT: IdentityTrait = {
  traitId: 'trait.dependable',
  b: Rational.ZERO,
  w: CHANNEL_ORDER.map((_, i) => (i === DEPENDABLE_IDX ? Rational.ONE : Rational.ZERO)),
  Q: CHANNEL_ORDER.map(() => CHANNEL_ORDER.map(() => Rational.ZERO)),
};

/** The single-channel `RiskTaker` trait, mirroring `DEPENDABLE_TRAIT` but
 * over RiskAcceptance — Experiment I's second established identity. */
const RISK_TAKER_IDX = CHANNEL_ORDER.indexOf('RiskAcceptance');
export const RISK_TAKER_TRAIT: IdentityTrait = {
  traitId: 'trait.risk_taker',
  b: Rational.ZERO,
  w: CHANNEL_ORDER.map((_, i) => (i === RISK_TAKER_IDX ? Rational.ONE : Rational.ZERO)),
  Q: CHANNEL_ORDER.map(() => CHANNEL_ORDER.map(() => Rational.ZERO)),
};

export interface RoundRecord {
  readonly round: number;
  readonly decisionExpression: DecisionExpression;
  readonly identityStrengthCommitmentFidelity: Rational;
  readonly identityConfidenceCommitmentFidelity: Rational;
}

export interface RepeatedRun {
  readonly rounds: readonly RoundRecord[];
  readonly finalState: CharacterState;
}

function cycleParamsWith(paramsOverride?: Partial<DecisionParams>): CycleParams {
  const base = legacyDecisionCycleParams();
  return paramsOverride ? { ...base, decision: { ...base.decision, ...paramsOverride } } : base;
}

/** One side of a biased-baseline reset: the pre-decay Need Level and the
 * seeded NeedExpectation (μ, τ) for that Option's subject. Levels are set
 * BEFORE `runDecisionCycle`'s own `advanceAllNeeds` (step 1) applies a full
 * tick of passive decay, so the deficit — and therefore the die this
 * Option's Need-sourced Influence calibrates to — is computed from the
 * POST-decay Level, not the value given here (see this file's own probing
 * notes in RESEARCH.md's Phase 2.9 entry for the exact numbers). */
export interface BiasedSide {
  readonly level: Rational;
  readonly mu: Rational;
  readonly tau: Rational;
}

/** The "wins clearly, 4:1 pre-roll, real dice both sides" bias used
 * throughout this file: after one tick of passive decay, this side's Need
 * deficit maxes out (Level clamps to 0) and its NeedExpectation is high and
 * well-established enough to calibrate to d10 ("very strong") against the
 * losing side's d4 ("weak") — a 4:1 pre-roll split whose asymptotic
 * IdentityStrength ceiling ((4-1)/(4+1)=0.6, `boundedResponse`-projected to
 * 0.375) clears `thetaTrait`'s 0.3 with real margin, unlike a 2:1 or 3:1
 * split's own ceiling (this file's own probing — see RESEARCH.md's Phase
 * 2.9 entry — found 2:1's ceiling caps `Dependable`'s projection at 0.25
 * and 3:1's at ~0.29, both structurally short of consolidation no matter
 * how many rounds run). `mu` is deliberately > 1 (NeedExpectation has no
 * authored upper bound — it is "expected effect," not a probability) purely
 * to reach this die bracket for controlled-experiment purposes. */
export function strongSide(mu: Rational): BiasedSide {
  return { level: ratOf(1, 20), mu, tau: ratOf(100) };
}

/** The losing side of the same 4:1 bias: Level decays to a genuine but
 * moderate deficit, and NeedExpectation is set just above the die floor
 * (d4, "weak") — present and real, never dropped, so the loser's own
 * tagged pressure still exists for Alignment to weigh against (Experiment
 * J's mechanism depends on this). */
export function weakSide(mu: Rational): BiasedSide {
  return { level: ratOf(13, 20), mu, tau: ratOf(10) };
}

/** Reset the dinner-vs-work axis's Need levels/NeedExpectation to a fixed
 * baseline before each round — everything else (identityEvidence,
 * decisionHistory, associations) carries forward from the previous round
 * untouched. */
export function resetDinnerVsWorkBaseline(glen: BiasedSide, work: BiasedSide) {
  return (s: CharacterState): CharacterState => {
    let st = withNeedLevel(s, NEED_CONNECTION, glen.level);
    st = withNeedLevel(st, NEED_ACHIEVEMENT, work.level);
    st = withExpectation(st, PERSON_GLEN, NEED_CONNECTION, { mu: glen.mu, tau: glen.tau, lastUpdatedAt: st.currentTime });
    st = withExpectation(st, ACTIVITY_WORK, NEED_ACHIEVEMENT, { mu: work.mu, tau: work.tau, lastUpdatedAt: st.currentTime });
    return st;
  };
}

/** Same idea for the speak-up-vs-stay-quiet axis (`ACTIVITY_MEETING`/
 * `ACTIVITY_CAUTION` — Speak Up's and Stay Quiet's own DISTINCT subjects;
 * see `ACTIVITY_CAUTION`'s doc comment in scenario.ts for why they must not
 * share one). */
function resetSpeakUpVsStayQuietBaseline(speak: BiasedSide, quiet: BiasedSide) {
  return (s: CharacterState): CharacterState => {
    let st = withNeedLevel(s, NEED_RECOGNITION, speak.level);
    st = withNeedLevel(st, NEED_SECURITY, quiet.level);
    st = withExpectation(st, ACTIVITY_MEETING, NEED_RECOGNITION, { mu: speak.mu, tau: speak.tau, lastUpdatedAt: st.currentTime });
    st = withExpectation(st, ACTIVITY_CAUTION, NEED_SECURITY, { mu: quiet.mu, tau: quiet.tau, lastUpdatedAt: st.currentTime });
    return st;
  };
}

export function runRepeatedRounds(
  initialState: CharacterState,
  decisionFactory: (id: string) => Decision,
  resetFn: (s: CharacterState) => CharacterState,
  seed: string,
  decisionIdPrefix: string,
  rounds: number,
  paramsOverride?: Partial<DecisionParams>,
): RepeatedRun {
  const params = cycleParamsWith(paramsOverride);
  const semanticPolarity = defaultSemanticReasonPolarity();
  const mapping = defaultReasonChannelMapping();
  const outcomeTables = decisionOutcomeTables();
  const clock = new EventClock();
  let state = initialState;
  const records: RoundRecord[] = [];
  for (let i = 0; i < rounds; i++) {
    state = resetFn(state);
    const decision = decisionFactory(`${decisionIdPrefix}:${i}`);
    clock.advance(1);
    const result = runDecisionCycle(state.characterId, state, decision, outcomeTables, params, mapping, semanticPolarity, clock, seed);
    state = result.nextState;
    const evidence = state.identityEvidence.get('CommitmentFidelity');
    records.push({
      round: i,
      decisionExpression: result.decisionExpression,
      identityStrengthCommitmentFidelity: evidence ? identityStrength(evidence, params.decision.kI) : Rational.ZERO,
      identityConfidenceCommitmentFidelity: evidence ? identityConfidence(evidence, params.decision.kC) : Rational.ZERO,
    });
  }
  return { rounds: records, finalState: state };
}

// ---------------------------------------------------------------------------
// Experiment E — Trait acquisition (Brief §30)
// ---------------------------------------------------------------------------

export interface ExperimentEResult {
  readonly run: RepeatedRun;
  readonly evidenceAccumulated: boolean;
  readonly strengthRose: boolean;
  readonly traitConsolidatedByEnd: boolean;
}

/**
 * Repeat several meaningful (contested, non-trivial-Stake) Decisions on the
 * dinner-vs-work axis, biased ~3:1 pre-roll so Keep Dinner usually — but
 * not deterministically — wins (real dice both sides every round: d8 vs.
 * d4). Run with `identityFeedbackEnabled: false` DELIBERATELY: Experiment E
 * asks whether repeated ACTUAL CHOICES (behavior alone) build identity
 * evidence, not whether identity feedback does — that is Experiment G's own
 * question, and Experiment H's own question is what happens when feedback
 * IS enabled across many repetitions of the identical setup (it visibly
 * self-stabilizes: Contest falls, rolls become rare, evidence growth
 * slows — see `runExperimentH_SelfStabilization`). Running E WITH feedback
 * enabled would confound the two: as soon as accumulating
 * CommitmentFidelity evidence made IdentityConsistency strong enough to
 * push Contest below θ_roll, the Decision would auto-resolve and
 * AuthorshipPotential would collapse toward 0 — freezing further evidence
 * growth (self-stabilization arriving) BEFORE acquisition alone had run
 * long enough to reach consolidation. Disabling feedback for this
 * acquisition run isolates "does repeated behavior alone build durable
 * evidence" from "does established identity limit its own future growth,"
 * which is a separate, later question this file answers separately.
 * Verify: CommitmentFidelity evidence accumulates, its derived
 * IdentityStrength rises, and the single-channel `Dependable` trait (Brief
 * §21's own example) eventually consolidates — with no explicit trait ever
 * authored onto the character; consolidation is checked purely by
 * projecting `DEPENDABLE_TRAIT` over the accumulated `IdentityEvidenceState`.
 */
export function runExperimentE_TraitAcquisition(seed = 'phase2_9-expE-seed', rounds = 24): ExperimentEResult {
  const initial = defaultDecisionScenario();
  const run = runRepeatedRounds(
    initial,
    dinnerVsWorkDecision,
    resetDinnerVsWorkBaseline(strongSide(ratOf(2)), weakSide(ratOf(2, 5))),
    seed,
    'decision:expE',
    rounds,
    { identityFeedbackEnabled: false },
  );
  const first = run.rounds[0].identityStrengthCommitmentFidelity;
  const last = run.rounds[run.rounds.length - 1].identityStrengthCommitmentFidelity;
  const params = defaultDecisionCycleParams().decision;
  const finalEvidence = run.finalState.identityEvidence.get('CommitmentFidelity');
  const consolidated = finalEvidence
    ? isConsolidated(
        DEPENDABLE_TRAIT,
        CHANNEL_ORDER.map((c) => identityStrength(run.finalState.identityEvidence.get(c) ?? { support: Rational.ZERO, opposition: Rational.ZERO }, params.kI)),
        run.finalState.identityEvidence,
        params.kC,
        params.thetaTrait,
        params.thetaConfidence,
      )
    : false;
  return {
    run,
    evidenceAccumulated: (finalEvidence?.support ?? Rational.ZERO).gt(Rational.ZERO),
    strengthRose: last.gt(first),
    traitConsolidatedByEnd: consolidated,
  };
}

// ---------------------------------------------------------------------------
// Experiment G — Identity feedback (Brief §30)
// ---------------------------------------------------------------------------

export interface ExperimentGResult {
  readonly withIdentity: DecisionExpression;
  readonly withoutIdentity: DecisionExpression;
  readonly compatibleOptionProbabilityRises: boolean;
  readonly neitherOptionDictated: boolean;
}

/**
 * Starting from Experiment E's consolidated-identity state, present ANOTHER
 * matching dinner-vs-work Decision — once with the ordinary identity-
 * feedback channel enabled, once with the `identityFeedbackEnabled: false`
 * ablation (plan scoping decision 6), same seed/decisionId/state
 * otherwise. Verify: the compatible Option's (Keep Dinner's) pre-roll
 * probability is measurably HIGHER with identity feedback than without —
 * i.e. IdentityConsistency is a real, load-bearing reason, not a cosmetic
 * one — while neither run collapses either Option's probability to exactly
 * 0 or 1 (identity strengthens a reason; it never dictates the Action).
 */
export function runExperimentG_IdentityFeedback(seed = 'phase2_9-expG-seed'): ExperimentGResult {
  const e = runExperimentE_TraitAcquisition();
  const baseline = resetDinnerVsWorkBaseline(strongSide(ratOf(2)), weakSide(ratOf(2, 5)))(e.run.finalState);
  const decision = dinnerVsWorkDecision('decision:expG');
  const outcomeTables = decisionOutcomeTables();
  const semanticPolarity = defaultSemanticReasonPolarity();
  const mapping = defaultReasonChannelMapping();

  const withIdentity = runDecisionCycle(
    baseline.characterId,
    baseline,
    decision,
    outcomeTables,
    cycleParamsWith({ identityFeedbackEnabled: true }),
    mapping,
    semanticPolarity,
    new EventClock(),
    seed,
  ).decisionExpression;
  const withoutIdentity = runDecisionCycle(
    baseline.characterId,
    baseline,
    decision,
    outcomeTables,
    cycleParamsWith({ identityFeedbackEnabled: false }),
    mapping,
    semanticPolarity,
    new EventClock(),
    seed,
  ).decisionExpression;

  const pKeepWith = withIdentity.preRollOptionProbabilities.find((p) => p.optionKey === ACTION_KEEP_DINNER_PROMISE)!.probability;
  const pKeepWithout = withoutIdentity.preRollOptionProbabilities.find((p) => p.optionKey === ACTION_KEEP_DINNER_PROMISE)!.probability;
  const allNontrivial = (e_: DecisionExpression) =>
    e_.preRollOptionProbabilities.every((p) => p.probability.gt(Rational.ZERO) && p.probability.lt(Rational.ONE));

  return {
    withIdentity,
    withoutIdentity,
    compatibleOptionProbabilityRises: pKeepWith.gt(pKeepWithout),
    neitherOptionDictated: allNontrivial(withIdentity) && allNontrivial(withoutIdentity),
  };
}

// ---------------------------------------------------------------------------
// Experiment H — Self-stabilization (Brief §30/§24)
// ---------------------------------------------------------------------------

export interface ExperimentHResult {
  readonly run: RepeatedRun;
  readonly averageContestFirstThird: Rational;
  readonly averageContestLastThird: Rational;
  readonly contestFell: boolean;
  readonly evidenceGrowthFirstThird: Rational;
  readonly evidenceGrowthLastThird: Rational;
  readonly evidenceGrowthSlowed: boolean;
}

/**
 * Continue the SAME repeated matching-Decision harness Experiment E uses,
 * for many more rounds. Brief §24's natural-stabilization hypothesis
 * predicts: as CommitmentFidelity strengthens, the IdentityConsistency
 * reason increasingly separates Keep Dinner's probability from Stay At
 * Work's (Margin rises, Contest falls), which mechanically shrinks
 * AuthorshipPotential (`Contest x Stake`) and therefore the *incremental*
 * identity evidence each further round can add — a self-limiting loop, not
 * a runaway one. Verified by comparing the first third of rounds against
 * the last third on both measures, rather than asserting strict
 * round-over-round monotonicity (individual dice rolls are still genuinely
 * stochastic — Brief §25: identity must not eliminate meaningful agency).
 */
export function runExperimentH_SelfStabilization(seed = 'phase2_9-expH-seed', rounds = 30): ExperimentHResult {
  const initial = defaultDecisionScenario();
  const run = runRepeatedRounds(
    initial,
    dinnerVsWorkDecision,
    resetDinnerVsWorkBaseline(strongSide(ratOf(2)), weakSide(ratOf(2, 5))),
    seed,
    'decision:expH',
    rounds,
  );
  const third = Math.floor(rounds / 3);
  const firstThird = run.rounds.slice(0, third);
  const lastThird = run.rounds.slice(rounds - third);
  const avg = (xs: readonly RoundRecord[]) => xs.reduce((acc, r) => acc.add(r.decisionExpression.contest), Rational.ZERO).div(ratOf(xs.length));
  const evidenceSum = (xs: readonly RoundRecord[]) =>
    xs.reduce((acc, r) => acc.add(r.decisionExpression.identityExpressions.reduce((a, x) => a.add(x.expressionStrength.abs()), Rational.ZERO)), Rational.ZERO);

  const averageContestFirstThird = avg(firstThird);
  const averageContestLastThird = avg(lastThird);
  const evidenceGrowthFirstThird = evidenceSum(firstThird);
  const evidenceGrowthLastThird = evidenceSum(lastThird);

  return {
    run,
    averageContestFirstThird,
    averageContestLastThird,
    contestFell: averageContestLastThird.lt(averageContestFirstThird),
    evidenceGrowthFirstThird,
    evidenceGrowthLastThird,
    evidenceGrowthSlowed: evidenceGrowthLastThird.lt(evidenceGrowthFirstThird),
  };
}

// ---------------------------------------------------------------------------
// Experiment I — Identity fault line (Brief §30/§26)
// ---------------------------------------------------------------------------

export interface ExperimentIResult {
  readonly commitmentFidelityStrength: Rational;
  readonly riskAcceptanceStrength: Rational;
  readonly contestedWithIdentity: DecisionExpression;
  readonly contestedWithoutIdentity: DecisionExpression;
  readonly obviousBaselineWithIdentity: DecisionExpression;
  readonly obviousBaselineWithoutIdentity: DecisionExpression;
  readonly bothIdentitiesSubstantiallyEstablished: boolean;
  readonly identityMeasurablyShiftedTheContestedDecision: boolean;
  readonly neitherRunDictatedTheContestedDecision: boolean;
  readonly identityCannotRescueAFlooredOption: boolean;
}

/**
 * Establishes two INDEPENDENT identity tendencies — CommitmentFidelity
 * (Experiment E's dinner-vs-work harness) and RiskAcceptance (the same
 * harness applied to the speak-up-vs-stay-quiet axis) — then presents
 * `crossAxisFaultLineDecision`, which pits one Option from EACH axis
 * against the other (Keep Dinner vs. Speak Up), in TWO different raw-Need
 * settings, to map out exactly what "competing identities create a fault
 * line" can and cannot mean under this reference model's actual formulas.
 *
 * THIS EXPERIMENT'S SHAPE CHANGED DURING EMPIRICAL VERIFICATION (per this
 * project's "run it, don't guess" discipline) from the plan's original
 * framing — "raw Need alone would make Keep Dinner nearly automatic; an
 * established opposing identity re-contests it (Contest rises, Auto becomes
 * PlayerFacingRoll)." That framing turns out to be MATHEMATICALLY
 * UNREACHABLE under `identity.ts`'s actual `Alignment`/`identityConsistency`
 * formulas, for a structural reason worth stating precisely:
 *
 *   `Alignment(o,k) = boundedResponse(TaggedPressure(o,k) - Σ_others)`, and
 *   `boundedResponse(x) < x` for all `x > 0` — so Alignment can NEVER exceed
 *   an option's OWN raw tagged pressure. An "obvious choice" baseline
 *   requires the underdog's raw Need-sourced influence to already sit BELOW
 *   `thetaInfluenceFloor` (0.10) — that is how it gets no die at all. But
 *   that same sub-floor raw pressure caps the underdog's OWN identity
 *   Alignment strictly below `boundedResponse(0.10) ≈ 0.0909`, which is
 *   itself already below the floor. Since `identityConsistency` is a
 *   strength-weighted SUM of Alignment across channels — and any opposing
 *   channel (here, CommitmentFidelity, anchored to the LEADING option's own
 *   pressure) only pulls the total further down — no identity strength,
 *   however large (strength is itself bounded strictly below 1), can ever
 *   lift a floored option's identity-consistency Influence up to
 *   `thetaInfluenceFloor`. Identity can shift a decision between two options
 *   that are ALREADY both in the dice — it cannot resurrect one Need
 *   pressure alone has already ruled out. `identityCannotRescueAFlooredOption`
 *   below asserts exactly this as a real, checked invariant of the
 *   implemented system, not an assumption.
 *
 * Given that, this experiment now verifies the strongest true claim instead:
 * in a decision where BOTH options already survive on raw Need alone
 * (Keep Dinner's Connection deficit at the bare "moderate" threshold, d6;
 * Speak Up's Recognition deficit just under it, d4 — a real but modest
 * Keep-Dinner lean, never a foregone conclusion), two independently-earned,
 * OPPOSING identities (CommitmentFidelity anchored to Keep Dinner,
 * RiskAcceptance to Speak Up) measurably change the resolved
 * probabilities/Margin relative to the identity-disabled control, while
 * neither run ever collapses either Option's probability to exactly 0 or 1
 * (identity strengthens a reason; it never dictates the Action). Reaching a
 * MEASURABLE shift here itself required deliberate asymmetry: CommitmentFidelity
 * is left comparatively under-established (a short, 4-round acquisition)
 * while RiskAcceptance is run to 200 rounds, well past where E/H stop, to
 * approach its asymptotic ceiling — because at genuinely comparable
 * strengths, the two channels' opposing pulls on THIS decision very nearly
 * cancel (see the arithmetic in RESEARCH.md's Phase 2.9 entry), and neither
 * one's added influence clears the floor. That asymmetry finding is itself
 * part of the fault line: comparably-matched competing identities mostly
 * neutralize each other's dice-shaping power; only a sufficiently LOPSIDED
 * pair actually moves the resolution — and per the doc comment above, when
 * it does move it, it does so as a discrete jump (a whole extra die),
 * flipping Margin from ~0.33 to ~0.98 rather than nudging it gradually.
 */
export function runExperimentI_IdentityFaultLine(seed = 'phase2_9-expI-seed'): ExperimentIResult {
  // CommitmentFidelity: deliberately under-established (short acquisition) —
  // see the module-level doc comment above for why a comparably-strong
  // opposing CommitmentFidelity would swamp RiskAcceptance's own budget and
  // leave identityConsistency below floor on both options.
  const commitmentRun = runExperimentE_TraitAcquisition('phase2_9-expI-commitment-seed', 4);
  // RiskAcceptance: run long, with the same `identityFeedbackEnabled: false`
  // acquisition discipline Experiment E uses (see its doc comment) to avoid
  // the self-stabilization confound, so it approaches its own asymptotic
  // strength ceiling as closely as practical. 200 rounds (vs. E/H's 24-30)
  // was itself an empirical finding: `identityConsistency(SpeakUp)` needs
  // RiskAcceptance's strength comfortably past ~0.40 before it clears
  // `thetaInfluenceFloor` at all against CommitmentFidelity's opposition
  // (see the module doc comment above and RESEARCH.md's Phase 2.9 entry for
  // the search) — fewer rounds leave it just short, with no visible effect.
  const riskRun = runRepeatedRounds(
    commitmentRun.run.finalState,
    speakUpVsStayQuietDecision,
    resetSpeakUpVsStayQuietBaseline(strongSide(ratOf(2)), weakSide(ratOf(4, 5))),
    'phase2_9-expI-risk-seed',
    'decision:expI-risk',
    200,
    { identityFeedbackEnabled: false },
  );

  const params = defaultDecisionCycleParams().decision;
  const establishedState = riskRun.finalState;
  const commitmentFidelityStrength = identityStrength(
    establishedState.identityEvidence.get('CommitmentFidelity') ?? { support: Rational.ZERO, opposition: Rational.ZERO },
    params.kI,
  );
  const riskAcceptanceStrength = identityStrength(
    establishedState.identityEvidence.get('RiskAcceptance') ?? { support: Rational.ZERO, opposition: Rational.ZERO },
    params.kI,
  );

  const decision = crossAxisFaultLineDecision('decision:expI-faultline', ACTION_KEEP_DINNER_PROMISE, ACTION_SPEAK_UP);
  const outcomeTables = decisionOutcomeTables();
  const semanticPolarity = defaultSemanticReasonPolarity();
  const mapping = defaultReasonChannelMapping();

  // --- Contested setting: BOTH options already survive on raw Need alone.
  // Keep Dinner's Connection deficit sits at the bare "moderate" (d6)
  // threshold; Speak Up's Recognition deficit sits just under it (d4) — a
  // real but modest lean, with real dice on both sides (found empirically;
  // see RESEARCH.md's Phase 2.9 entry for the search). Once RiskAcceptance's
  // identity_consistency influence clears the floor here, it does NOT nudge
  // Speak Up gently — adding a whole extra d4 alongside Speak Up's own
  // surviving Recognition die flips the matchup outright (Margin jumps from
  // ~0.33 to ~0.98, resolutionMode from PlayerFacingRoll to Auto). This is
  // itself a real, notable finding about a dice-quantized reference model:
  // crossing an influence floor is a discrete event, not a continuous one —
  // there is no regime where identity feedback produces a SMALL, graded
  // shift in this system; it is either silent (below floor, no effect at
  // all — see `identityCannotRescueAFlooredOption` below) or it adds a
  // whole die (a potentially large, discontinuous effect). Genuine
  // stochastic agency still survives even here in the strict sense
  // `neitherRunDictatedTheContestedDecision` checks: preRollOptionProbabilities
  // never hit exactly 0 or 1 in either run (verified below), even though the
  // with-identity split is lopsided in practice.
  const contestedState = (() => {
    let st = withNeedLevel(establishedState, NEED_CONNECTION, ratOf(1, 4));
    st = withExpectation(st, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(1, 3), tau: ratOf(10), lastUpdatedAt: st.currentTime });
    st = withNeedLevel(st, NEED_RECOGNITION, ratOf(3, 10));
    st = withExpectation(st, ACTIVITY_MEETING, NEED_RECOGNITION, { mu: ratOf(1), tau: ratOf(10), lastUpdatedAt: st.currentTime });
    return st;
  })();
  const contestedWithIdentity = runDecisionCycle(
    contestedState.characterId,
    contestedState,
    decision,
    outcomeTables,
    cycleParamsWith({ identityFeedbackEnabled: true }),
    mapping,
    semanticPolarity,
    new EventClock(),
    seed,
  ).decisionExpression;
  const contestedWithoutIdentity = runDecisionCycle(
    contestedState.characterId,
    contestedState,
    decision,
    outcomeTables,
    cycleParamsWith({ identityFeedbackEnabled: false }),
    mapping,
    semanticPolarity,
    new EventClock(),
    seed,
  ).decisionExpression;

  // --- Obvious-baseline setting: Speak Up's own raw Recognition pressure is
  // deliberately kept BELOW `thetaInfluenceFloor`, so absent identity Keep
  // Dinner wins with certainty (Contest = 0, Auto). This is the negative
  // control proving `identityCannotRescueAFlooredOption`: however strong
  // RiskAcceptance is, its own Alignment ceiling is capped by Speak Up's own
  // (sub-floor) raw pressure, so it can never add a surviving die here.
  const obviousBaselineState = (() => {
    let st = withNeedLevel(establishedState, NEED_CONNECTION, ratOf(13, 20));
    st = withExpectation(st, PERSON_GLEN, NEED_CONNECTION, { mu: ratOf(2, 5), tau: ratOf(10), lastUpdatedAt: st.currentTime });
    st = withNeedLevel(st, NEED_RECOGNITION, ratOf(7, 10));
    st = withExpectation(st, ACTIVITY_MEETING, NEED_RECOGNITION, { mu: ratOf(3, 10), tau: ratOf(20), lastUpdatedAt: st.currentTime });
    return st;
  })();
  const obviousBaselineWithIdentity = runDecisionCycle(
    obviousBaselineState.characterId,
    obviousBaselineState,
    decision,
    outcomeTables,
    cycleParamsWith({ identityFeedbackEnabled: true }),
    mapping,
    semanticPolarity,
    new EventClock(),
    seed,
  ).decisionExpression;
  const obviousBaselineWithoutIdentity = runDecisionCycle(
    obviousBaselineState.characterId,
    obviousBaselineState,
    decision,
    outcomeTables,
    cycleParamsWith({ identityFeedbackEnabled: false }),
    mapping,
    semanticPolarity,
    new EventClock(),
    seed,
  ).decisionExpression;

  const nontrivial = (e: DecisionExpression) =>
    e.preRollOptionProbabilities.every((p) => p.probability.gt(Rational.ZERO) && p.probability.lt(Rational.ONE));

  return {
    commitmentFidelityStrength,
    riskAcceptanceStrength,
    contestedWithIdentity,
    contestedWithoutIdentity,
    obviousBaselineWithIdentity,
    obviousBaselineWithoutIdentity,
    bothIdentitiesSubstantiallyEstablished: commitmentFidelityStrength.gt(ratOf(1, 20)) && riskAcceptanceStrength.gt(ratOf(1, 10)),
    identityMeasurablyShiftedTheContestedDecision: !contestedWithIdentity.margin.equals(contestedWithoutIdentity.margin),
    neitherRunDictatedTheContestedDecision: nontrivial(contestedWithIdentity) && nontrivial(contestedWithoutIdentity),
    identityCannotRescueAFlooredOption:
      obviousBaselineWithIdentity.contest.equals(Rational.ZERO) && obviousBaselineWithoutIdentity.contest.equals(Rational.ZERO),
  };
}

// ---------------------------------------------------------------------------
// Experiment J — Contradiction (Brief §30/§27)
// ---------------------------------------------------------------------------

export interface ExperimentJResult {
  readonly consolidatedAfterE: boolean;
  readonly consolidatedAfterOneContradiction: boolean;
  readonly consolidatedAfterManyContradictions: boolean;
  readonly strengthAfterE: Rational;
  readonly strengthAfterManyContradictions: Rational;
  readonly strengthDropped: boolean;
}

/**
 * After Experiment E consolidates `Dependable` (strong positive
 * CommitmentFidelity), run several HIGH-AUTHORSHIP Decisions on the SAME
 * axis expressing the OPPOSITE tendency: Work's expectation set higher
 * than Glen's (Stay At Work usually wins) while Glen's Connection-tagged
 * pressure remains well above the die floor — i.e. Keep Dinner (the loser)
 * still carries real CommitmentFidelity-tagged pressure, so Alignment
 * comes out NEGATIVE for the Stay-At-Work winner (`identity.ts`'s
 * documented Experiment-J mechanism), adding Opposition evidence each
 * round. Verify: one contradiction does not erase the trait (still
 * consolidated after 1 round); repeated meaningful contradictions reduce
 * its strength and eventually un-consolidate it.
 *
 * EMPIRICAL FINDING (per this project's "run it, don't guess" discipline):
 * the contradiction rounds below run with `identityFeedbackEnabled: false`,
 * NOT the default `true` — running them with feedback enabled was tried
 * first and produced a strength that stayed FLAT (or even drifted upward)
 * across 60+ contradiction rounds instead of declining. The mechanism is
 * exactly Experiment H's self-stabilization, now working in the opposite
 * direction: once CommitmentFidelity is strongly established, its own
 * IdentityConsistency influence actively OPPOSES Stay At Work each round
 * (Alignment(StayAtWork, CommitmentFidelity) is negative, weighted by
 * CommitmentFidelity's own already-high strength), pulling the raw-Need
 * "contradiction" bias back toward Keep Dinner and suppressing the very
 * Opposition evidence the contradiction is trying to add. An established
 * identity actively resists behavioral contradiction through the same
 * feedback channel that built it — a real, notable finding in its own
 * right, and reason enough to isolate pure behavioral counter-evidence here
 * (feedback disabled) exactly as Experiment E isolates pure behavioral
 * acquisition, so "does repeated contrary behavior erode evidence" is
 * measured without identity's own resistance fighting the measurement.
 */
export function runExperimentJ_Contradiction(seed = 'phase2_9-expJ-seed'): ExperimentJResult {
  const e = runExperimentE_TraitAcquisition('phase2_9-expJ-baseline-seed', 50);
  const params = defaultDecisionCycleParams().decision;

  const strengthOf = (state: CharacterState) =>
    identityStrength(state.identityEvidence.get('CommitmentFidelity') ?? { support: Rational.ZERO, opposition: Rational.ZERO }, params.kI);
  const consolidatedIn = (state: CharacterState) =>
    isConsolidated(
      DEPENDABLE_TRAIT,
      CHANNEL_ORDER.map((c) => identityStrength(state.identityEvidence.get(c) ?? { support: Rational.ZERO, opposition: Rational.ZERO }, params.kI)),
      state.identityEvidence,
      params.kC,
      params.thetaTrait,
      params.thetaConfidence,
    );

  const strengthAfterE = strengthOf(e.run.finalState);
  const consolidatedAfterE = consolidatedIn(e.run.finalState);

  const oneContradiction = runRepeatedRounds(
    e.run.finalState,
    dinnerVsWorkDecision,
    resetDinnerVsWorkBaseline(weakSide(ratOf(2, 5)), strongSide(ratOf(2))),
    seed,
    'decision:expJ-one',
    1,
    { identityFeedbackEnabled: false },
  );
  const consolidatedAfterOneContradiction = consolidatedIn(oneContradiction.finalState);

  const manyContradictions = runRepeatedRounds(
    oneContradiction.finalState,
    dinnerVsWorkDecision,
    resetDinnerVsWorkBaseline(weakSide(ratOf(2, 5)), strongSide(ratOf(2))),
    seed,
    'decision:expJ-many',
    30,
    { identityFeedbackEnabled: false },
  );
  const strengthAfterManyContradictions = strengthOf(manyContradictions.finalState);
  const consolidatedAfterManyContradictions = consolidatedIn(manyContradictions.finalState);

  return {
    consolidatedAfterE,
    consolidatedAfterOneContradiction,
    consolidatedAfterManyContradictions,
    strengthAfterE,
    strengthAfterManyContradictions,
    strengthDropped: strengthAfterManyContradictions.lt(strengthAfterE),
  };
}

// Re-exported so test files can project DEPENDABLE_TRAIT/RISK_TAKER_TRAIT
// themselves without recomputing the projection helper.
export { projectTrait, ACTION_STAY_AT_WORK };
