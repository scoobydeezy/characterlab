/**
 * Phase 2.97 — Seed Divergence under the Reason Nuclei pipeline
 * (Experiment N).
 *
 * Reruns `experiments/seedDivergence.ts`'s own flagship paired-seed harness
 * (Phase 2.9's Experiment F, Brief §30: "dice cumulatively author character
 * identity") with dice resolved through `compilationMode: 'reasonNuclei'`
 * instead of legacy — same `defaultDecisionScenario()` initial state, same
 * `MODERATE_AMBIGUOUS_BIAS` symmetric dinner-vs-work axis, same two seeds,
 * same round count. The claim under test is narrower than "the new pipeline
 * reproduces every Phase 2.9 number": it is that the STRUCTURAL mechanism —
 * two identical timelines whose only difference is which way the dice fall,
 * genuinely diverging in early rolls, choices, and accumulated Need/identity
 * evidence — survives the compiler swap.
 *
 * One honest, real finding this file's own run surfaces (not assumed in
 * advance, and different from an earlier hypothesis this file's own
 * development probe disproved — see `scratch/n.ts`, deleted after use):
 * `CommitmentFidelity` maps only to the 'Commitment' MotiveChannel
 * (`defaultIdentityMotiveChannelMapping()`) — a channel THIS scenario's
 * `defaultMotiveChannelMapping()` never gives any Need-sourced
 * MotiveGenerating pressure (see `identityAsModifier.ts`'s Experiment H) —
 * so however much CommitmentFidelity evidence diverges between the two
 * timelines (it still does; identity EXPRESSION/evidence generation is
 * unconditional on `compilationMode`), it structurally CANNOT influence
 * Keep Dinner Promise's own real 'Connection' nucleus the way it influenced
 * legacy's shared 'commitment' channel. Yet `laterProbabilitiesDiffered`
 * still measures TRUE: `WorkPersistence` — which DOES map to a live
 * channel, 'Achievement' (Stay At Work's own real Need channel) — diverges
 * between the two timelines for the SAME reason CommitmentFidelity does
 * (different seeds -> different realized outcome noise -> different
 * NeedExpectation posteriors -> different Alignment/evidence each round),
 * and that divergence DOES have a live route to influence the later
 * Decision. The general claim — "each timeline's separately-earned identity
 * changes its answer to an identical later question" — survives Phase
 * 2.97's compiler swap; WHICH specific identity channel carries that effect
 * depends on which one happens to share a live MotiveChannel with real Need
 * pressure, a fact worth recording plainly in RESEARCH.md rather than
 * smoothing over.
 *
 * Phase 2.97 closure audit, Check 1 rerun (ORIGINAL, superseded — checked
 * empirically via `scratch/debugN3.ts`, deleted after use, not assumed): once
 * `NEED_COMMITMENT` gave Keep Dinner Promise a second, genuinely competing
 * Need-sourced motive, Stay At Work lost somewhat more often across the
 * bootstrap rounds, which pushed `WorkPersistence`'s accumulated evidence
 * negative in BOTH timelines rather than positive as it was pre-Check-1 — the
 * divergence claim itself was unaffected, but at the then-default of 40
 * rounds, both timelines' `WorkPersistence` values happened to land on the
 * SAME side of the `StandingIdentity` modifier family's quantization boundary
 * (unit = 1/4, both truncating to a standing modifier of 0), producing
 * bit-identical later probabilities despite genuinely different underlying
 * identity strengths. The default moved to 100 rounds to restore a real
 * margin past that boundary.
 *
 * Phase 2.97 closure audit, SECOND correction (current): `NEED_COMMITMENT`
 * is removed; the real Commitment source (`model/commitment.ts`,
 * `scenario.ts::defaultCommitments()`) is deliberately NOT passed into this
 * file's own repeated-round harness at all — checked empirically
 * (`scratch/debugN4.ts`-`debugN6.ts`, deleted after use) that doing so
 * produces a much harsher problem than the original quantization tie: a
 * CONSTANT standing obligation, once real, gives Keep Dinner Promise a
 * permanent SECOND die (Commitment + Connection) against Stay At Work's one
 * (Achievement) — enough of an edge that the Decision locks into `Auto`
 * resolution mode from round 1 onward and NEVER rolls dice again for the
 * rest of the run, making every subsequent round of both timelines
 * bit-for-bit identical (checked at rounds up to 500 — the lock never
 * releases on its own). This is a genuine, worth-recording structural
 * finding, not a calibration nitpick like the original Need-based tie: it is
 * also the right call narratively — `MODERATE_AMBIGUOUS_BIAS`'s per-round
 * reset represents the SAME generic recurring dilemma replayed many times,
 * while a `CommitmentDef` (per `model/commitment.ts`'s own module comment)
 * represents a SPECIFIC, one-time obligation; replaying it as a permanently
 * live pressure across 100 notionally-independent evenings was never the
 * right fit for this particular harness, independent of any calibration
 * question. With Commitment correctly excluded here, this file's dynamics
 * are no longer affected by either Check 1 correction at all, and the
 * original quantization tie disappears with them — checked directly, every
 * round count from 40 through 500 now shows genuine divergence on all four
 * measures, so the default moves back to 40, matching
 * `experiments/seedDivergence.ts`'s own legacy-pipeline default.
 */

import { Rational, ratOf } from '../kernel/rational';
import { EventClock } from '../kernel/event';
import { DecisionExpression } from '../model/decision';
import { CharacterState } from '../model/character';
import { identityStrength } from '../model/identity';
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
} from '../model/scenario';
import { RepeatedRun, BiasedSide, resetDinnerVsWorkBaseline } from './identityFormation';

const legacyMapping = defaultReasonChannelMapping();
const semanticPolarity = defaultSemanticReasonPolarity();
const needMapping = defaultMotiveChannelMapping();
const identityMapping = defaultIdentityMotiveChannelMapping();

/** identical to `seedDivergence.ts`'s own MODERATE_AMBIGUOUS_BIAS/
 * LATER_DECISION_BIAS — the SAME empirically-tuned brackets, since the
 * question here is "does the same bias, resolved by a different compiler,
 * still produce a genuinely contested sequence," not a fresh calibration
 * search. */
const MODERATE_AMBIGUOUS_BIAS: BiasedSide = { level: ratOf(1, 20), mu: ratOf(1, 2), tau: ratOf(10) };
const LATER_DECISION_BIAS: BiasedSide = { level: ratOf(1, 20), mu: ratOf(2), tau: ratOf(100) };

function reasonNucleiParams() {
  const legacy = defaultDecisionCycleParams();
  return { ...legacy, decision: { ...legacy.decision, compilationMode: 'reasonNuclei' as const } };
}

/** `identityFormation.ts::runRepeatedRounds`'s own loop, reimplemented here
 * ONLY to thread `compilationMode: 'reasonNuclei'` and the two new mapping
 * params through `runDecisionCycle` — everything else (reset-then-run
 * structure, per-round CommitmentFidelity bookkeeping so `RepeatedRun`
 * stays a drop-in-compatible shape) is identical. */
function runReasonNucleiRepeatedRounds(
  initialState: CharacterState,
  resetFn: (s: CharacterState) => CharacterState,
  seed: string,
  decisionIdPrefix: string,
  rounds: number,
): RepeatedRun {
  const params = reasonNucleiParams();
  const clock = new EventClock();
  let state = initialState;
  const records: RepeatedRun['rounds'][number][] = [];
  for (let i = 0; i < rounds; i++) {
    state = resetFn(state);
    const decision = dinnerVsWorkDecision(`${decisionIdPrefix}:${i}`);
    clock.advance(1);
    const result = runDecisionCycle(
      state.characterId,
      state,
      decision,
      decisionOutcomeTables(),
      params,
      legacyMapping,
      semanticPolarity,
      clock,
      seed,
      undefined,
      undefined,
      needMapping,
      identityMapping,
      // Phase 2.97 closure audit, second correction — deliberately NO
      // commitments here (see module doc comment's own "why not" paragraph):
      // a constant standing obligation, once real, is a hard `Auto`-mode
      // landslide in this specific near-50/50 harness, checked empirically
      // (`scratch/debugN4.ts`-`debugN6.ts`, deleted after use) not assumed.
    );
    state = result.nextState;
    const evidence = state.identityEvidence.get('CommitmentFidelity');
    records.push({
      round: i,
      decisionExpression: result.decisionExpression,
      identityStrengthCommitmentFidelity: evidence ? identityStrength(evidence, params.decision.kI) : Rational.ZERO,
      identityConfidenceCommitmentFidelity: Rational.ZERO,
    });
  }
  return { rounds: records, finalState: state };
}

function runTimeline(seed: string, rounds: number): RepeatedRun {
  return runReasonNucleiRepeatedRounds(
    defaultDecisionScenario(),
    resetDinnerVsWorkBaseline(MODERATE_AMBIGUOUS_BIAS, MODERATE_AMBIGUOUS_BIAS),
    seed,
    'decision:phase2_97-expN',
    rounds,
  );
}

function laterMatchingDecision(finalState: CharacterState, seed: string): DecisionExpression {
  const run = runReasonNucleiRepeatedRounds(
    finalState,
    resetDinnerVsWorkBaseline(LATER_DECISION_BIAS, LATER_DECISION_BIAS),
    seed,
    'decision:phase2_97-expN-later',
    1,
  );
  return run.rounds[0].decisionExpression;
}

export interface ExperimentNSeedDivergenceResult {
  readonly timelineA: RepeatedRun;
  readonly timelineB: RepeatedRun;
  readonly firstRoundRollsDiffered: boolean;
  readonly earlyDecisionExpressionsDiffered: boolean;
  readonly acquiredIdentitiesDiffered: boolean;
  readonly identityStrengthA: Rational;
  readonly identityStrengthB: Rational;
  readonly laterProbabilitiesDiffered: boolean;
}

export function runExperimentN_SeedDivergenceReasonNuclei(rounds = 40): ExperimentNSeedDivergenceResult {
  const timelineA = runTimeline('phase2_97-expN-seedA', rounds);
  const timelineB = runTimeline('phase2_97-expN-seedB', rounds);

  const EARLY_ROUND_WINDOW = 5;
  const firstRoundRollsDiffered = timelineA.rounds.slice(0, EARLY_ROUND_WINDOW).some((r, i) => {
    const rollsB = timelineB.rounds[i]?.decisionExpression.influenceRolls ?? [];
    return r.decisionExpression.influenceRolls.some((rollA, j) => rollA.rollValue !== rollsB[j]?.rollValue);
  });

  const earlyDecisionExpressionsDiffered = timelineA.rounds.some(
    (r, i) => r.decisionExpression.chosenOption !== timelineB.rounds[i]?.decisionExpression.chosenOption,
  );

  const kI = reasonNucleiParams().decision.kI;
  const identityStrengthA = identityStrength(
    timelineA.finalState.identityEvidence.get('CommitmentFidelity') ?? { support: Rational.ZERO, opposition: Rational.ZERO },
    kI,
  );
  const identityStrengthB = identityStrength(
    timelineB.finalState.identityEvidence.get('CommitmentFidelity') ?? { support: Rational.ZERO, opposition: Rational.ZERO },
    kI,
  );

  const laterDecisionA = laterMatchingDecision(timelineA.finalState, 'phase2_97-expN-later-seed');
  const laterDecisionB = laterMatchingDecision(timelineB.finalState, 'phase2_97-expN-later-seed');
  const laterProbabilitiesDiffered = laterDecisionA.preRollOptionProbabilities.some((p) => {
    const other = laterDecisionB.preRollOptionProbabilities.find((q) => q.optionKey === p.optionKey);
    return other === undefined || !p.probability.equals(other.probability);
  });

  return {
    timelineA,
    timelineB,
    firstRoundRollsDiffered,
    earlyDecisionExpressionsDiffered,
    acquiredIdentitiesDiffered: !identityStrengthA.equals(identityStrengthB),
    identityStrengthA,
    identityStrengthB,
    laterProbabilitiesDiffered,
  };
}
