import { describe, it, expect } from 'vitest';
import { Rational } from '../kernel/rational';
import {
  runCase1_ObservationalEquivalence,
  runCase2_SaturationVsUnsaturatedUtility,
  runCase3_SurprisingCensoredEvidence,
  runCase4_TotalSaturation,
} from '../experiments/saturationSalienceInteraction';

/**
 * Phase 2.5d — "Saturation/Salience Interaction," closing Brief §24's
 * remaining Phase 2.5 question. Each describe block below is one of the
 * four cases specified in the post-2.5c review, run through the real
 * `runScriptedExperience` pipeline (see saturationSalienceInteraction.ts's
 * module doc for the stated hypothesis and why hand-picked
 * `computeSemanticSalience` inputs would beg the question). All four
 * passing is what lets RESEARCH.md's Phase 2.5d entry classify Brief §24's
 * question DERIVED and close Phase 2.5.
 */

describe('Phase 2.5d Case 1 — Observational equivalence', () => {
  it('identical Applied and evidence kind, radically different hidden Overflow, produce byte-for-byte identical salience', () => {
    const { timelineA, timelineB, needRelevanceIdentical, surpriseIdentical, salienceIdentical } = runCase1_ObservationalEquivalence();

    // Sanity check the setup actually varies what it claims to: same
    // Applied, wildly different Overflow, both ceiling-saturated.
    expect(timelineA.applied.equals(timelineB.applied)).toBe(true);
    expect(timelineA.applied.equals(Rational.fromDecimal(0.05))).toBe(true);
    expect(timelineA.overflow.equals(Rational.fromDecimal(0.05))).toBe(true);
    expect(timelineB.overflow.equals(Rational.fromDecimal(0.75))).toBe(true);
    expect(timelineA.saturated).toBe('ceiling');
    expect(timelineB.saturated).toBe('ceiling');
    expect(timelineA.overflow.equals(timelineB.overflow)).toBe(false);

    // The claim itself: Overflow's difference must not leak into salience
    // through either of its two possible channels (Need relevance, which
    // depends only on the realized/Applied delta, and surprise, which
    // depends only on the objective evidence kind + observed Applied
    // value) or into the resulting z.
    expect(needRelevanceIdentical).toBe(true);
    expect(surpriseIdentical).toBe(true);
    expect(salienceIdentical).toBe(true);
  });
});

describe('Phase 2.5d Case 2 — Saturation versus unsaturated utility', () => {
  it('the Connection-starved Experience gets strictly greater Need-relevance salience than the near-satisfied one, with the identical true effect', () => {
    const { starved, nearSatisfied, needRelevanceGreaterWhenStarved, salienceGreaterWhenStarved } = runCase2_SaturationVsUnsaturatedUtility();

    // Sanity check: starved sees the full +0.40 land unclipped; near-
    // satisfied sees it clip to +0.10 — the same true effect, different
    // realized/regulatory impact.
    expect(starved.saturated).toBe('none');
    expect(starved.applied.equals(Rational.fromDecimal(0.4))).toBe(true);
    expect(nearSatisfied.saturated).toBe('ceiling');
    expect(nearSatisfied.applied.equals(Rational.fromDecimal(0.1))).toBe(true);

    // Above its set point, needDeficit's own max(0, ...) clamp makes
    // near-satisfied Connection's urgency exactly 0 — Need relevance from
    // this Experience is therefore exactly 0 for the near-satisfied
    // timeline, and strictly positive for the starved one.
    expect(nearSatisfied.glen.needRelevance.isZero()).toBe(true);
    expect(starved.glen.needRelevance.gt(Rational.ZERO)).toBe(true);

    expect(needRelevanceGreaterWhenStarved).toBe(true);
    expect(salienceGreaterWhenStarved).toBe(true);
  });
});

describe('Phase 2.5d Case 3 — Surprising censored evidence', () => {
  it('a ceiling-saturated bound that contradicts an established belief is more salient than the identical bound when it merely confirms the belief', () => {
    const { surprising, consistent, surpriseGreaterWhenContradicted, salienceGreaterWhenContradicted } = runCase3_SurprisingCensoredEvidence();

    // Sanity check: both variants see the identical realized observation
    // (Applied clips to exactly +0.15) — only the established prior differs.
    expect(surprising.applied.equals(consistent.applied)).toBe(true);
    expect(surprising.applied.equals(Rational.fromDecimal(0.15))).toBe(true);
    expect(surprising.saturated).toBe('ceiling');
    expect(consistent.saturated).toBe('ceiling');
    expect(surprising.priorMu.equals(Rational.fromDecimal(0.02))).toBe(true);
    expect(consistent.priorMu.equals(Rational.fromDecimal(0.2))).toBe(true);

    // The bound (+0.15) is incompatible with the low established belief
    // (+0.02) but not with the higher one (+0.20) — surprise, and
    // therefore salience, must track that difference even though the
    // realized Need effect is identical in both variants.
    expect(consistent.glen.surprise.isZero()).toBe(true);
    expect(surprising.glen.surprise.gt(Rational.ZERO)).toBe(true);
    expect(surpriseGreaterWhenContradicted).toBe(true);
    expect(salienceGreaterWhenContradicted).toBe(true);
  });
});

describe('Phase 2.5d Case 4 — Total saturation', () => {
  it('Need relevance and surprise both vanish at total saturation, but the Experience keeps strictly positive baseline salience', () => {
    const { sample, needRelevanceIsZero, surpriseIsZero, salienceIsStrictlyPositive } = runCase4_TotalSaturation();

    expect(sample.needLevelBefore.equals(Rational.ONE)).toBe(true);
    expect(sample.applied.isZero()).toBe(true);
    expect(sample.overflow.equals(Rational.fromDecimal(0.4))).toBe(true);
    expect(sample.saturated).toBe('ceiling');

    expect(needRelevanceIsZero).toBe(true);
    expect(surpriseIsZero).toBe(true);
    // The event does not vanish: Category x Role x Attention alone
    // (Person x Participant x Participant's fixed attention) is a strictly
    // positive product regardless of how thoroughly Need relevance and
    // surprise were suppressed.
    expect(salienceIsStrictlyPositive).toBe(true);
    expect(sample.glen.raw.gt(Rational.ZERO)).toBe(true);
  });
});
