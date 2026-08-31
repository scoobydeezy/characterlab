/**
 * Phase 2.97 — Identity as a Standing Modifier (Experiments G, H, I).
 *
 * `test/phase2_97DiceCompiler.test.ts` already validates the Reason
 * Activation rule (Brief §41-44) against hand-built `RawCognitiveSignal`
 * fixtures: a nucleus needs a nonzero MotiveGenerating base (`B_n`) to exist
 * at all ("a modifier cannot create meaning from nothing"), and an existing-
 * but-weak nucleus can be RESCUED into dice-eligibility by a real Standing/
 * Situational contribution on the SAME triple. This file reruns the same
 * three claims through the REAL pipeline, with identity evidence
 * genuinely earned by `experiments/identityFormation.ts`'s own repeated-
 * decision bootstrapping harness (Phase 2.9) rather than hand-picked — per
 * this project's "run it, don't guess" discipline, never assuming the
 * compiler-level unit test result generalizes to real accumulated evidence.
 *
 * Experiment G — Identity as Standing Modifier, present vs. ablated: a real
 * WorkPersistence identity, bootstrapped exactly as
 * `identityFormation.ts`'s own Experiment E/H do (repeated dinner-vs-work
 * rounds biased toward Work), is compared side by side with the SAME
 * post-bootstrap state but WorkPersistence's evidence zeroed out — Stay At
 * Work's real 'Achievement' nucleus (already active on Need pressure alone)
 * carries a nonzero `standingModifier` only in the WITH-identity run.
 *
 * Experiment H — a modifier cannot create meaning from nothing, real
 * bootstrap. ORIGINAL (pre-closure-audit) finding: the bootstrapped state
 * carried real, nonzero CommitmentFidelity evidence, but Phase 2.97's
 * vocabulary mapped CommitmentFidelity to MotiveChannel 'Commitment', a
 * channel NO Need in this scenario generated MotiveGenerating pressure for
 * — so however much real identity evidence accumulated there, no
 * 'Commitment'-channel nucleus could ever exist. The review agent flagged
 * this as a missing-input-vocabulary gap, not a Reason Nuclei bug (Brief §41
 * itself was working correctly — there was simply nothing for it to gate).
 *
 * Phase 2.97 CLOSURE AUDIT, Check 1 (ORIGINAL FIX, superseded):
 * `scenario.ts::NEED_COMMITMENT`, a Core Need satisfied by keeping the
 * dinner promise, gave Keep Dinner Promise a MotiveGenerating source on the
 * 'Commitment' channel. A second round of review correctly identified this
 * as the right diagnosis fixed through the wrong semantic layer — modeling a
 * specific obligation as a recurring, satisfiable appetite, referented to
 * its stakeholder (Glen) rather than the obligation itself. See
 * `model/commitment.ts`'s module doc comment for the full argument.
 *
 * SECOND CORRECTION (current): `scenario.ts::defaultCommitments()` gives
 * Keep Dinner Promise a real, independent, NON-Need Commitment-pressure
 * source (`model/commitment.ts`), referented to `COMMITMENT_DINNER_WITH_GLEN`
 * rather than `PERSON_GLEN`. This experiment still demonstrates the same two
 * things on the real pipeline: (a) the fix — a 'Commitment' nucleus now
 * genuinely exists, and CommitmentFidelity's ablation leaves its base motive
 * strength untouched (the same no-double-counting shape Experiment G already
 * established for WorkPersistence/Achievement); (b) the underlying
 * structural rule survives — a channel that STILL has no MotiveGenerating
 * source anywhere in this scenario (`'Caregiving'`, mapped from the
 * `Caregiving` identity channel) forms no nucleus even when given strong,
 * directly-injected identity evidence (Experiment I's own
 * `withIdentityEvidence` injection technique). The activation rule was never
 * broken; the scenario's own motive vocabulary was simply narrower than the
 * brief's, and — separately — Commitment pressure itself was, for one
 * closure-audit round, modeled through the wrong ontology.
 *
 * Experiment I — weak-but-genuine motive + eligible standing modifier
 * rescues activation: the scenario's own baseline (unmodified) Glen/
 * Connection seed is real but, on its own, too weak to clear `thetaReason`
 * (found empirically — this file's own probe, `scratch/debugGHI.ts`,
 * deleted after use). A real, weakly-established SocialApproach identity
 * (support=1, the SAME "weak-but-genuine" level
 * `experiments/reasonConsolidation.ts`'s own Target B uses) maps to the
 * SAME 'Connection' MotiveChannel and rescues the nucleus into existence,
 * at the floor d4 base die (Experiment I's compiler-level finding, now
 * shown on genuinely-earned rather than hand-built standing evidence).
 */

import { Rational, ratOf } from '../kernel/rational';
import { EventClock } from '../kernel/event';
import { withIdentityEvidence } from '../model/character';
import { identityStrength } from '../model/identity';
import { CompiledNucleus } from '../model/diceCompiler';
import { runDecisionCycle } from '../model/cycle';
import { runRepeatedRounds, resetDinnerVsWorkBaseline, strongSide, weakSide } from './identityFormation';
import {
  defaultDecisionScenario,
  defaultDecisionCycleParams,
  defaultReasonChannelMapping,
  defaultSemanticReasonPolarity,
  defaultMotiveChannelMapping,
  defaultIdentityMotiveChannelMapping,
  defaultCommitments,
  dinnerVsWorkDecision,
  decisionOutcomeTables,
  ACTION_KEEP_DINNER_PROMISE,
  ACTION_STAY_AT_WORK,
  COMMITMENT_DINNER_WITH_GLEN,
} from '../model/scenario';

const legacyMapping = defaultReasonChannelMapping();
const semanticPolarity = defaultSemanticReasonPolarity();
const needMapping = defaultMotiveChannelMapping();
const identityMapping = defaultIdentityMotiveChannelMapping();
const commitments = defaultCommitments();

function reasonNucleiParams() {
  const legacy = defaultDecisionCycleParams();
  return { ...legacy, decision: { ...legacy.decision, compilationMode: 'reasonNuclei' as const } };
}

function runOneReasonNucleiDecision(state: Parameters<typeof runDecisionCycle>[1], decisionId: string, seed: string) {
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
    new EventClock(),
    seed,
    undefined,
    undefined,
    needMapping,
    identityMapping,
    commitments,
  );
}

/** The shared G/H bootstrap: repeated dinner-vs-work rounds (LEGACY mode,
 * `identityFormation.ts`'s own harness, unmodified) biased strongly toward
 * Work — Work's real repeated wins accumulate genuine WorkPersistence
 * evidence (the 'energetic' semantic channel's identity), while Glen's own
 * weak-but-real Connection pressure still touches the 'commitment' channel
 * often enough to accumulate genuine (if smaller, possibly net-negative —
 * checked directly, not assumed) CommitmentFidelity evidence too. */
function bootstrapWorkIdentity(seed = 'phase2_97-GH-bootstrap-seed', rounds = 30) {
  return runRepeatedRounds(
    defaultDecisionScenario(),
    dinnerVsWorkDecision,
    resetDinnerVsWorkBaseline(weakSide(ratOf(2, 5)), strongSide(ratOf(2))),
    seed,
    'decision:phase2_97-GH-bootstrap',
    rounds,
  ).finalState;
}

/** The mirror-image bootstrap — biased strongly toward KEEPING the dinner
 * promise instead of Work — used only by Experiment H's second-correction
 * check below. `bootstrapWorkIdentity`'s own bias keeps CommitmentFidelity
 * weak (Keep Dinner loses most rounds), which is enough to show the
 * no-double-counting shape but not enough to clear the `StandingIdentity`
 * modifier family's own 1/4 unit (found empirically — its own
 * `commitmentFidelityStrength` stays under 0.25 in magnitude). This bootstrap
 * exists to demonstrate the review's actual ask beyond ablation-invariance: a
 * GENUINELY strong CommitmentFidelity identity must produce a nonzero
 * standing modifier on the real Commitment nucleus, not merely leave its
 * base motive strength untouched. Exported: also reused by
 * `test/phase2_97CommitmentLifecycle.test.ts` as the "has genuinely invested
 * identity" state a lifecycle check needs — that test's own point (a
 * modifier cannot create meaning from nothing survives a commitment's
 * retirement, not just its original absence) needs a state where identity is
 * real and strong throughout, so the ONLY thing changing between its cases is
 * which commitments are supplied. */
export function bootstrapDinnerIdentity(seed = 'phase2_97-H-dinner-bootstrap-seed', rounds = 30) {
  return runRepeatedRounds(
    defaultDecisionScenario(),
    dinnerVsWorkDecision,
    resetDinnerVsWorkBaseline(strongSide(ratOf(2)), weakSide(ratOf(2, 5))),
    seed,
    'decision:phase2_97-H-dinner-bootstrap',
    rounds,
  ).finalState;
}

// ---------------------------------------------------------------------------
// Experiment G — Identity as Standing Modifier: present vs. ablated
// ---------------------------------------------------------------------------

export interface ExperimentGStandingModifierResult {
  readonly workPersistenceStrength: Rational;
  readonly withIdentityNucleus: CompiledNucleus | undefined;
  readonly withoutIdentityNucleus: CompiledNucleus | undefined;
  readonly bothActivateOnNeedAlone: boolean;
  readonly standingModifierPresentOnlyWithIdentity: boolean;
  readonly baseMotiveStrengthUnaffectedByAblation: boolean;
}

export function runExperimentG_StandingModifierPresentVsAblated(seed = 'phase2_97-expG-seed'): ExperimentGStandingModifierResult {
  const bootstrapped = bootstrapWorkIdentity();
  const kI = reasonNucleiParams().decision.kI;
  const workPersistenceStrength = identityStrength(
    bootstrapped.identityEvidence.get('WorkPersistence') ?? { support: Rational.ZERO, opposition: Rational.ZERO },
    kI,
  );

  const withIdentity = runOneReasonNucleiDecision(bootstrapped, 'decision:phase2_97-expG-with', seed);
  const ablated = withIdentityEvidence(bootstrapped, 'WorkPersistence', { support: Rational.ZERO, opposition: Rational.ZERO });
  const withoutIdentity = runOneReasonNucleiDecision(ablated, 'decision:phase2_97-expG-without', seed);

  const withIdentityNucleus = withIdentity.reasonNucleusTrace!.get(ACTION_STAY_AT_WORK)?.find((n) => n.key.motiveChannel === 'Achievement');
  const withoutIdentityNucleus = withoutIdentity.reasonNucleusTrace!.get(ACTION_STAY_AT_WORK)?.find((n) => n.key.motiveChannel === 'Achievement');

  return {
    workPersistenceStrength,
    withIdentityNucleus,
    withoutIdentityNucleus,
    bothActivateOnNeedAlone: withIdentityNucleus !== undefined && withoutIdentityNucleus !== undefined,
    standingModifierPresentOnlyWithIdentity:
      (withIdentityNucleus?.standingModifier ?? 0) !== 0 && (withoutIdentityNucleus?.standingModifier ?? 0) === 0,
    baseMotiveStrengthUnaffectedByAblation:
      withIdentityNucleus !== undefined &&
      withoutIdentityNucleus !== undefined &&
      withIdentityNucleus.baseMotiveStrength.equals(withoutIdentityNucleus.baseMotiveStrength),
  };
}

// ---------------------------------------------------------------------------
// Experiment H — a modifier cannot create meaning from nothing (real bootstrap)
// ---------------------------------------------------------------------------

export interface ExperimentHNoMeaningFromNothingResult {
  readonly commitmentFidelityStrength: Rational;
  readonly commitmentFidelityEvidenceIsGenuinelyNonzero: boolean;
  readonly channelsThatDidForm: readonly string[];
  /** Phase 2.97 closure audit, Check 1 — the fix: `'Commitment'` now shows
   * up in `channelsThatDidForm` because `NEED_COMMITMENT` gives it a real
   * MotiveGenerating base. */
  readonly commitmentChannelNucleusNowExists: boolean;
  /** No-double-counting check, the same shape Experiment G already runs for
   * WorkPersistence/Achievement: ablating CommitmentFidelity must not move
   * the Commitment nucleus's own `baseMotiveStrength` (B_n) at all — only
   * its standing modifier can depend on identity. */
  readonly commitmentBaseMotiveStrengthUnaffectedByAblation: boolean;
  /** The structural claim itself, still checked on the real pipeline: a
   * channel with real, substantial, directly-injected identity evidence but
   * NO Need-sourced MotiveGenerating source anywhere in this scenario
   * (`'Caregiving'`) still forms no nucleus, even after Check 1. */
  readonly caregivingEvidenceIsGenuinelyNonzero: boolean;
  readonly noCaregivingChannelNucleusExistsDespiteRealEvidence: boolean;
  /** Phase 2.97 closure audit, SECOND correction — the review's actual ask
   * beyond ablation-invariance: with a genuinely strong CommitmentFidelity
   * identity (`bootstrapDinnerIdentity`, above `StandingIdentity`'s own 1/4
   * modifier unit), the Commitment nucleus's `standingModifier` must be
   * genuinely nonzero, and that nucleus's referent must be the commitment
   * itself (`COMMITMENT_DINNER_WITH_GLEN`), never its stakeholder
   * (`PERSON_GLEN`) — the review's own "the referent is the commitment, Glen
   * is a stakeholder" correction, checked directly rather than assumed.
   */
  readonly strongCommitmentFidelityStrength: Rational;
  readonly commitmentStandingModifierNonzeroWhenIdentityIsStrong: boolean;
  readonly commitmentNucleusReferentIsTheCommitmentItself: boolean;
}

export function runExperimentH_NoMeaningFromNothingRealBootstrap(seed = 'phase2_97-expH-seed'): ExperimentHNoMeaningFromNothingResult {
  const bootstrapped = bootstrapWorkIdentity();
  const kI = reasonNucleiParams().decision.kI;
  const commitmentFidelityStrength = identityStrength(
    bootstrapped.identityEvidence.get('CommitmentFidelity') ?? { support: Rational.ZERO, opposition: Rational.ZERO },
    kI,
  );

  const withIdentity = runOneReasonNucleiDecision(bootstrapped, 'decision:phase2_97-expH-with', seed);
  const ablated = withIdentityEvidence(bootstrapped, 'CommitmentFidelity', { support: Rational.ZERO, opposition: Rational.ZERO });
  const withoutIdentity = runOneReasonNucleiDecision(ablated, 'decision:phase2_97-expH-without', seed);

  const allNuclei = [...withIdentity.reasonNucleusTrace!.values()].flat();
  const commitmentWith = withIdentity.reasonNucleusTrace!.get(ACTION_KEEP_DINNER_PROMISE)?.find((n) => n.key.motiveChannel === 'Commitment');
  const commitmentWithout = withoutIdentity.reasonNucleusTrace!.get(ACTION_KEEP_DINNER_PROMISE)?.find((n) => n.key.motiveChannel === 'Commitment');

  // Check (b): a channel with NO Need-sourced MotiveGenerating source in
  // this scenario, even now — real, substantial, directly-injected
  // Caregiving evidence (support=5, the same injection technique Experiment
  // I uses for SocialApproach) must still produce no nucleus anywhere.
  const withCaregiving = withIdentityEvidence(bootstrapped, 'Caregiving', { support: ratOf(5), opposition: Rational.ZERO });
  const caregivingResult = runOneReasonNucleiDecision(withCaregiving, 'decision:phase2_97-expH-caregiving', seed);
  const caregivingStrength = identityStrength(
    withCaregiving.identityEvidence.get('Caregiving') ?? { support: Rational.ZERO, opposition: Rational.ZERO },
    kI,
  );
  const allNucleiCaregiving = [...caregivingResult.reasonNucleusTrace!.values()].flat();

  // Second correction's own check: bootstrap toward KEEPING the promise
  // instead of Work, so CommitmentFidelity accumulates genuinely strong
  // (not merely nonzero) evidence, then confirm the resulting standing
  // modifier actually lands nonzero on the real, correctly-referented
  // Commitment nucleus.
  const dinnerBootstrapped = bootstrapDinnerIdentity();
  const strongCommitmentFidelityStrength = identityStrength(
    dinnerBootstrapped.identityEvidence.get('CommitmentFidelity') ?? { support: Rational.ZERO, opposition: Rational.ZERO },
    kI,
  );
  const strongResult = runOneReasonNucleiDecision(dinnerBootstrapped, 'decision:phase2_97-expH-strong', seed);
  const strongCommitmentNucleus = strongResult.reasonNucleusTrace!.get(ACTION_KEEP_DINNER_PROMISE)?.find((n) => n.key.motiveChannel === 'Commitment');

  return {
    commitmentFidelityStrength,
    commitmentFidelityEvidenceIsGenuinelyNonzero: !commitmentFidelityStrength.isZero(),
    channelsThatDidForm: [...new Set(allNuclei.map((n) => n.key.motiveChannel))],
    commitmentChannelNucleusNowExists: commitmentWith !== undefined,
    commitmentBaseMotiveStrengthUnaffectedByAblation:
      commitmentWith !== undefined && commitmentWithout !== undefined && commitmentWith.baseMotiveStrength.equals(commitmentWithout.baseMotiveStrength),
    caregivingEvidenceIsGenuinelyNonzero: !caregivingStrength.isZero(),
    noCaregivingChannelNucleusExistsDespiteRealEvidence: allNucleiCaregiving.every((n) => n.key.motiveChannel !== 'Caregiving'),
    strongCommitmentFidelityStrength,
    commitmentStandingModifierNonzeroWhenIdentityIsStrong: (strongCommitmentNucleus?.standingModifier ?? 0) !== 0,
    commitmentNucleusReferentIsTheCommitmentItself: strongCommitmentNucleus?.key.referent === COMMITMENT_DINNER_WITH_GLEN,
  };
}

// ---------------------------------------------------------------------------
// Experiment I — weak-but-genuine motive + eligible standing modifier
// rescues activation (real pipeline)
// ---------------------------------------------------------------------------

export interface ExperimentIRescueResult {
  readonly withoutSocialApproachNucleus: CompiledNucleus | undefined;
  readonly withSocialApproachNucleus: CompiledNucleus | undefined;
  readonly nucleusAbsentWithoutIdentity: boolean;
  readonly nucleusPresentAndFlooredWithIdentity: boolean;
}

/**
 * The scenario's own UNMODIFIED baseline seed for Glen/Connection (mu=2/5 —
 * `defaultDecisionScenario()`'s own "rough first impression" level) is real
 * but, found empirically, lands below `thetaReason` (0.15) on its own once
 * it stands alone in the 'Connection' MotiveChannel bucket rather than
 * pooled with other legacy-mode contributors. A real but weakly-established
 * SocialApproach identity (support=1, opposition=0 — the SAME "weak-but-
 * genuine" level `reasonConsolidation.ts`'s Target B uses for its own
 * floor-rescue case) maps to that SAME channel and rescues it.
 */
export function runExperimentI_RealPipelineRescue(seed = 'phase2_97-expI-seed'): ExperimentIRescueResult {
  const baseState = defaultDecisionScenario();

  const without = runOneReasonNucleiDecision(baseState, 'decision:phase2_97-expI-without', seed);
  const withoutSocialApproachNucleus = without.reasonNucleusTrace!.get(ACTION_KEEP_DINNER_PROMISE)?.find((n) => n.key.motiveChannel === 'Connection');

  const withSocialApproachState = withIdentityEvidence(baseState, 'SocialApproach', { support: ratOf(1), opposition: Rational.ZERO });
  const withResult = runOneReasonNucleiDecision(withSocialApproachState, 'decision:phase2_97-expI-with', seed);
  const withSocialApproachNucleus = withResult.reasonNucleusTrace!.get(ACTION_KEEP_DINNER_PROMISE)?.find((n) => n.key.motiveChannel === 'Connection');

  return {
    withoutSocialApproachNucleus,
    withSocialApproachNucleus,
    nucleusAbsentWithoutIdentity: withoutSocialApproachNucleus === undefined,
    nucleusPresentAndFlooredWithIdentity: withSocialApproachNucleus !== undefined && withSocialApproachNucleus.baseDie === 4,
  };
}
