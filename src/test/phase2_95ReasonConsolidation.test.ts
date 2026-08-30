import { describe, it, expect } from 'vitest';
import {
  runExperimentGradualIdentityInfluence,
  runExperimentWeakSignalCombination,
  runExperimentRealFaultLine,
  runExperimentTransformationWithFeedback,
  runExperimentCanonicalAcquisitionWithFeedback,
} from '../experiments/reasonConsolidation';
import { Rational } from '../kernel/rational';

/**
 * The external review's five Phase 2.95 target behaviors (A-E), asserted
 * against real `runDecisionCycle` output (experiments/reasonConsolidation.ts)
 * — never against hand-built fixtures. Every case runs the DEFAULT seed each
 * experiment function ships with; none of these numbers were predicted —
 * they are exactly what `experiments/reasonConsolidation.ts`'s own doc
 * comments describe finding empirically (see RESEARCH.md's Phase 2.95 entry
 * for the full search history behind each parameter choice).
 */

describe('Target A — Gradual identity influence', () => {
  it('pre-roll probability responds to accumulating identity evidence monotonically, with at least one real transition, and never fully dictates the Action even at saturation', () => {
    const result = runExperimentGradualIdentityInfluence();
    expect(result.probabilityMonotonicNondecreasing).toBe(true);
    expect(result.atLeastOneRealTransitionOccurred).toBe(true);
    expect(result.neverFullyDictatesEvenAtSaturation).toBe(true);
    expect(result.samples.length).toBeGreaterThan(0);
    // Honest scoping (this file's own doc comment): the reference model's
    // discrete die-bracket scale means the transition is a single visible
    // jump, not a perfectly smooth ramp — but it must still be bounded well
    // short of a full 0-to-1 swing in one step.
    expect(result.largestSingleStepJump.gt(Rational.ZERO)).toBe(true);
    expect(result.largestSingleStepJump.lt(Rational.ONE)).toBe(true);
  });
});

describe('Target B — Weak-signal combination', () => {
  it('neither weak Need pressure nor weak identity evidence alone clears the influence floor, but consolidated on the same semantic channel they do', () => {
    const result = runExperimentWeakSignalCombination();
    expect(result.needAloneNeverClearsTheFloor).toBe(true);
    expect(result.identityAloneWouldBeTooWeakToo).toBe(true);
    expect(result.combinedTheyClearIt).toBe(true);
    // The floor-rescue itself is a change in resolution mode, not just a
    // marginal probability shift: with no die at all, Keep Dinner cannot be
    // player-facing; consolidated, it is.
    expect(result.withoutIdentity.resolutionMode).toBe('Auto');
    expect(result.withIdentity.resolutionMode).toBe('PlayerFacingRoll');
  });
});

describe('Target C — A real identity fault line', () => {
  it('an opposing identity increases Contest and narrows (without reversing or collapsing) an already-favored option’s lead, remaining a genuine player-facing roll throughout', () => {
    const result = runExperimentRealFaultLine();
    expect(result.bothRunsPlayerFacing).toBe(true);
    expect(result.contestIncreased).toBe(true);
    expect(result.keepDinnerStillFavoredButLessSo).toBe(true);
    expect(result.neitherProbabilityHitZeroOrOne).toBe(true);
    expect(result.withoutIdentity.resolutionMode).toBe('PlayerFacingRoll');
    expect(result.withIdentity.resolutionMode).toBe('PlayerFacingRoll');
  });
});

describe('Target D — Identity transformation with feedback active', () => {
  it('a consolidated trait survives acquisition, then genuinely erodes (and un-consolidates) under sustained contradictory pressure with identity feedback left ON throughout', () => {
    const result = runExperimentTransformationWithFeedback();
    expect(result.consolidatedAfterAcquisition).toBe(true);
    expect(result.consolidatedAfterSustainedContradiction).toBe(false);
    expect(result.strengthDroppedWithFeedbackActive).toBe(true);
    expect(result.strengthAfterSustainedContradiction.lt(result.strengthAfterAcquisition)).toBe(true);
    expect(result.rounds).toBeGreaterThan(0);
  });
});

describe('Target E — Canonical trait acquisition with feedback ON, from zero', () => {
  it('CommitmentFidelity evidence accumulates and Dependable consolidates under the ordinary feedback-on loop, with no ablation override', () => {
    const result = runExperimentCanonicalAcquisitionWithFeedback();
    expect(result.evidenceAccumulatedWithoutAblation).toBe(true);
    expect(result.traitConsolidated).toBe(true);
    expect(result.finalStrength.gt(Rational.ZERO)).toBe(true);
    expect(result.finalConfidence.gt(Rational.ZERO)).toBe(true);
    // The run genuinely stabilizes before its final round rather than still
    // visibly moving at the very last sample.
    expect(result.stabilizedByRound).not.toBeNull();
    expect(result.stabilizedByRound!).toBeLessThan(result.roundsRun);
  });
});
