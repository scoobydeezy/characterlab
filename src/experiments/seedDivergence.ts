/**
 * Phase 2.9 Experiment F — Seed divergence (Brief §30, the flagship
 * experiment): "Dice cumulatively author character identity."
 *
 * Two characters, Timeline A and Timeline B, start from IDENTICAL initial
 * state and identical world history (both are `defaultDecisionScenario()`,
 * built the same way, with the same authored Need levels/expectations) and
 * face the EXACT SAME sequence of genuinely ambiguous Decisions — only
 * their deterministic seed differs. This is the same paired-timeline
 * discipline `experiments/counterfactual.ts` established for Glen-vs-Priya
 * (Brief §29's Counterfactual Requirement), applied here to a DIFFERENT
 * independent variable: not "which Action's subject received the
 * Experience," but "which RNG seed resolved the dice." Because
 * `kernel/random.ts`'s counter-addressed oracle keys every draw by
 * `{seed, eventId, purposeId, drawIndex}`, changing only the seed changes
 * every roll from round 1 onward while leaving the authored Decision
 * structure, Need dynamics, and outcome tables byte-for-byte identical
 * between the two timelines — so any divergence is attributable purely to
 * which way the dice fell, never to an incidental setup difference.
 *
 * "Genuinely ambiguous," per the brief's own phrase, means each round's
 * Decision must be a real, near-50/50 contest — not a Experiment-E-style
 * repeated 4:1 lean (that axis is designed to reliably build ONE trait, not
 * to showcase branching). `dinnerVsWorkDecision`'s two Needs (Connection,
 * Achievement) share IDENTICAL NeedDef dynamics (`decisionNeedDefs()`'s own
 * comment: Achievement's setPoint/coreImportance/passiveRate "mirrors
 * Connection's own tuning") — so feeding the SAME bias into both sides
 * (rather than one `strongSide`/one `weakSide`, as E/H/J do) produces two
 * identically-calibrated dice: a genuinely tied 50/50 Decision with real
 * Contest every round, exactly the "coin flip that matters" Experiment F
 * needs.
 *
 * The bias magnitude itself required empirical tuning (per this project's
 * "run it, don't guess" discipline — see RESEARCH.md's Phase 2.9 entry): a
 * symmetric `weakSide` (d4/d4, the same bracket Experiment E's LOSING side
 * uses) was tried first and never produces measurable divergence at all —
 * its raw pressure is too small for IdentityConsistency's Alignment to ever
 * clear `thetaInfluenceFloor` regardless of how much evidence accumulates,
 * so both timelines just random-walk forever with no self-reinforcement
 * (and by Experiment H's own self-stabilization logic, a long unreinforced
 * random walk's normalized IdentityStrength trends toward 0, not apart). A
 * symmetric `strongSide` (d12/d12) was tried next and overshot the other
 * way: ONE contested round's AuthorshipPotential is already large enough
 * that its IdentityConsistency contribution clears the floor for the VERY
 * NEXT round, collapsing Contest below θ_roll and freezing the Decision to
 * `Auto` from round 2 onward — so the "genuinely ambiguous sequence" the
 * brief calls for barely exists; only round 1's coin flip ever really
 * happens, and if two seeds' first flips coincide (a real 50% chance),
 * their whole trajectories become identical, which is a poor basis for a
 * reliable demonstration. `MODERATE_AMBIGUOUS_BIAS` below (a symmetric
 * "moderate," d6/d6 bracket) sits between the two: strong enough that
 * IdentityConsistency eventually clears the floor and self-reinforces once
 * a real lead develops, but weak enough that several genuinely contested,
 * dice-resolved rounds happen first — giving each seed's own early rolls
 * room to actually diverge before either timeline locks in.
 */

import { Rational, ratOf } from '../kernel/rational';
import { DecisionExpression } from '../model/decision';
import { CharacterState } from '../model/character';
import { identityStrength } from '../model/identity';
import {
  defaultDecisionScenario,
  defaultDecisionCycleParams,
  dinnerVsWorkDecision,
  ACTION_KEEP_DINNER_PROMISE,
} from '../model/scenario';
import {
  RepeatedRun,
  BiasedSide,
  runRepeatedRounds,
  resetDinnerVsWorkBaseline,
} from './identityFormation';

export interface SeedDivergenceResult {
  readonly timelineA: RepeatedRun;
  readonly timelineB: RepeatedRun;
  readonly laterDecisionA: DecisionExpression;
  readonly laterDecisionB: DecisionExpression;
  readonly firstRoundRollsDiffered: boolean;
  readonly earlyDecisionExpressionsDiffered: boolean;
  readonly acquiredIdentitiesDiffered: boolean;
  readonly identityStrengthA: Rational;
  readonly identityStrengthB: Rational;
  readonly laterProbabilitiesDiffered: boolean;
}

const MODERATE_AMBIGUOUS_BIAS: BiasedSide = { level: ratOf(1, 20), mu: ratOf(1, 2), tau: ratOf(10) };

/**
 * Used ONLY for the "later Decision" probe, never for the biography itself
 * — an "extreme" (d12/d12) symmetric bracket, chosen for the biggest
 * Alignment ceiling this reference model's die scale offers
 * (`boundedResponse` of an extreme-bracket raw pressure, ≈0.46). Also found
 * empirically: with `MODERATE_AMBIGUOUS_BIAS`'s own (smaller) raw pressure
 * for the later Decision too, even the largest CommitmentFidelity-strength
 * gaps this file's own probing produced (magnitude ~0.2–0.3 after 40+
 * rounds) never cleared `thetaInfluenceFloor` — see the "cannot rescue a
 * floored option" finding in `identityFormation.ts`'s Experiment I doc
 * comment, which is really the same structural constraint showing up here:
 * IdentityConsistency's own Alignment ceiling is capped by the raw pressure
 * of the Decision it is being asked to influence, not by how strong the
 * identity itself has become. Giving the later Decision this much bigger
 * raw pressure is what lets a real (if modest) CommitmentFidelity gap
 * between the two timelines actually show up as a probability difference.
 */
const LATER_DECISION_BIAS: BiasedSide = { level: ratOf(1, 20), mu: ratOf(2), tau: ratOf(100) };

/**
 * Run one timeline (one seed) through `rounds` genuinely-ambiguous
 * dinner-vs-work Decisions, exactly as Experiment E's own harness does, but
 * with a SYMMETRIC bias on both sides (see module doc comment) and the
 * ordinary default params (`identityFeedbackEnabled: true`) — Experiment F
 * is not isolating acquisition from feedback the way E/H/J do; it is asking
 * what a real, ordinary biography looks like under a different roll of the
 * dice, feedback loop included.
 */
function runTimeline(seed: string, rounds: number): RepeatedRun {
  const initial = defaultDecisionScenario();
  return runRepeatedRounds(
    initial,
    dinnerVsWorkDecision,
    resetDinnerVsWorkBaseline(MODERATE_AMBIGUOUS_BIAS, MODERATE_AMBIGUOUS_BIAS),
    seed,
    'decision:expF',
    rounds,
  );
}

/**
 * Present ONE more matching Decision from a timeline's own final state
 * (identity evidence and all), reset to the SAME raw-Need baseline used
 * throughout the run, so the only thing that can differ between Timeline A
 * and B's answer is whatever each has separately come to believe about
 * itself.
 */
function laterMatchingDecision(finalState: CharacterState, seed: string): DecisionExpression {
  const run = runRepeatedRounds(
    finalState,
    dinnerVsWorkDecision,
    resetDinnerVsWorkBaseline(LATER_DECISION_BIAS, LATER_DECISION_BIAS),
    seed,
    'decision:expF-later',
    1,
  );
  return run.rounds[0].decisionExpression;
}

export function runExperimentF_SeedDivergence(rounds = 40): SeedDivergenceResult {
  const timelineA = runTimeline('phase2_9-expF-seedA', rounds);
  const timelineB = runTimeline('phase2_9-expF-seedB', rounds);

  // "Different early rolls" (Brief §30) is checked across the first several
  // rounds, not literally round 0 alone: two independent d6 rolls agreeing
  // by chance in round 0 is a real ~1-in-6 possibility, not a sign anything
  // is wrong — the claim is that SOME early roll differs, which any run of
  // several genuinely-contested rounds makes overwhelmingly likely.
  const EARLY_ROUND_WINDOW = 5;
  const firstRoundRollsDiffered = timelineA.rounds.slice(0, EARLY_ROUND_WINDOW).some((r, i) => {
    const rollsB = timelineB.rounds[i]?.decisionExpression.influenceRolls ?? [];
    return r.decisionExpression.influenceRolls.some((rollA, j) => rollA.rollValue !== rollsB[j]?.rollValue);
  });

  const earlyDecisionExpressionsDiffered = timelineA.rounds.some(
    (r, i) => r.decisionExpression.chosenOption !== timelineB.rounds[i]?.decisionExpression.chosenOption,
  );

  const params = defaultDecisionCycleParams().decision;
  const identityStrengthA = identityStrength(
    timelineA.finalState.identityEvidence.get('CommitmentFidelity') ?? { support: Rational.ZERO, opposition: Rational.ZERO },
    params.kI,
  );
  const identityStrengthB = identityStrength(
    timelineB.finalState.identityEvidence.get('CommitmentFidelity') ?? { support: Rational.ZERO, opposition: Rational.ZERO },
    params.kI,
  );

  // A THIRD, independently-addressed seed for the "later Decision" itself
  // (never one of the two timelines' own biography seeds) — the point is
  // to isolate "does each character's ALREADY-DIFFERENT identity produce a
  // different answer to the identical NEXT question," not to let yet more
  // seed-specific dice variance answer it for us.
  const laterDecisionA = laterMatchingDecision(timelineA.finalState, 'phase2_9-expF-later-seed');
  const laterDecisionB = laterMatchingDecision(timelineB.finalState, 'phase2_9-expF-later-seed');
  const laterProbabilitiesDiffered = laterDecisionA.preRollOptionProbabilities.some((p, i) => {
    const other = laterDecisionB.preRollOptionProbabilities.find((q) => q.optionKey === p.optionKey);
    return other === undefined || !p.probability.equals(other.probability);
  });

  return {
    timelineA,
    timelineB,
    laterDecisionA,
    laterDecisionB,
    firstRoundRollsDiffered,
    earlyDecisionExpressionsDiffered,
    acquiredIdentitiesDiffered: !identityStrengthA.equals(identityStrengthB),
    identityStrengthA,
    identityStrengthB,
    laterProbabilitiesDiffered,
  };
}

// Re-exported for tests that want to name the compatible Option explicitly.
export { ACTION_KEEP_DINNER_PROMISE };
