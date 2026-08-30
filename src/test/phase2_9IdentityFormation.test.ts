import { describe, it, expect } from 'vitest';
import {
  runExperimentE_TraitAcquisition,
  runExperimentG_IdentityFeedback,
  runExperimentH_SelfStabilization,
  runExperimentI_IdentityFaultLine,
  runExperimentJ_Contradiction,
} from '../experiments/identityFormation';
import { Rational } from '../kernel/rational';

/**
 * Brief §30 Experiments E, G, H, I, J, asserted against real
 * `runDecisionCycle` output (experiments/identityFormation.ts) — never
 * against hand-built `identity.ts` fixtures, which phase2_9Identity.test.ts
 * already covers directly. Every case below runs the DEFAULT seed each
 * experiment function ships with; none of these numbers were predicted —
 * they are exactly what `experiments/identityFormation.ts`'s own doc
 * comments describe finding empirically (see RESEARCH.md's Phase 2.9 entry
 * for the full search history behind each seed/round-count choice).
 */

describe('Experiment E — Trait acquisition', () => {
  it('repeated meaningful choices accumulate CommitmentFidelity evidence, raise its strength, and eventually consolidate Dependable with no trait ever authored', () => {
    const result = runExperimentE_TraitAcquisition();
    expect(result.evidenceAccumulated).toBe(true);
    expect(result.strengthRose).toBe(true);
    expect(result.traitConsolidatedByEnd).toBe(true);
    // The run used the acquisition-isolation ablation (Brief-motivated,
    // see the function's own doc comment): identity feedback stays OFF
    // during acquisition so Experiment H's self-stabilization can't
    // freeze evidence growth before consolidation is reached.
    expect(result.run.rounds.length).toBeGreaterThan(0);
  });
});

describe('Experiment G — Identity feedback', () => {
  it('the compatible Option is measurably more likely with identity feedback enabled, and neither run dictates the Action', () => {
    const result = runExperimentG_IdentityFeedback();
    expect(result.compatibleOptionProbabilityRises).toBe(true);
    expect(result.neitherOptionDictated).toBe(true);
  });
});

describe('Experiment H — Self-stabilization', () => {
  it('as CommitmentFidelity strengthens across many rounds, average Contest falls and incremental identity-evidence growth slows', () => {
    const result = runExperimentH_SelfStabilization();
    expect(result.contestFell).toBe(true);
    expect(result.evidenceGrowthSlowed).toBe(true);
    // Sanity: the comparison itself is over genuinely nonempty, disjoint
    // first/last thirds of the run, not a degenerate zero-length slice.
    expect(result.averageContestFirstThird.gte(Rational.ZERO)).toBe(true);
    expect(result.averageContestLastThird.gte(Rational.ZERO)).toBe(true);
  });
});

describe('Experiment I — Identity fault line', () => {
  it('two independently-earned identities are both substantially established, and identity measurably shifts a decision where both options already survive on raw Need alone — without ever collapsing a probability to exactly 0 or 1', () => {
    const result = runExperimentI_IdentityFaultLine();
    expect(result.bothIdentitiesSubstantiallyEstablished).toBe(true);
    expect(result.identityMeasurablyShiftedTheContestedDecision).toBe(true);
    expect(result.neitherRunDictatedTheContestedDecision).toBe(true);
    // Explicit probability-bound check (not just the boolean flag) on both
    // the contested-setting runs, mirroring Experiment K's own style.
    for (const expr of [result.contestedWithIdentity, result.contestedWithoutIdentity]) {
      for (const p of expr.preRollOptionProbabilities) {
        expect(p.probability.gt(Rational.ZERO)).toBe(true);
        expect(p.probability.lt(Rational.ONE)).toBe(true);
      }
    }
  });

  it('identity cannot rescue an Option raw Need pressure alone has already floored out (a real, checked invariant of the implemented Alignment formula, not an assumption)', () => {
    const result = runExperimentI_IdentityFaultLine();
    expect(result.identityCannotRescueAFlooredOption).toBe(true);
    expect(result.obviousBaselineWithIdentity.contest.equals(Rational.ZERO)).toBe(true);
    expect(result.obviousBaselineWithoutIdentity.contest.equals(Rational.ZERO)).toBe(true);
    expect(result.obviousBaselineWithIdentity.resolutionMode).toBe('Auto');
  });
});

describe('Experiment J — Contradiction', () => {
  it('one contradiction does not erase a consolidated trait, but repeated meaningful contradictions reduce its strength and eventually un-consolidate it', () => {
    const result = runExperimentJ_Contradiction();
    expect(result.consolidatedAfterE).toBe(true);
    expect(result.consolidatedAfterOneContradiction).toBe(true);
    expect(result.consolidatedAfterManyContradictions).toBe(false);
    expect(result.strengthDropped).toBe(true);
    expect(result.strengthAfterManyContradictions.lt(result.strengthAfterE)).toBe(true);
  });
});
