import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import { canonicalActionKey } from '../kernel/canonical';
import {
  IdentityEvidenceState,
  EMPTY_IDENTITY_EVIDENCE,
  updateIdentityEvidence,
  identityStrength,
  identityConfidence,
  alignment,
  touchedChannels,
  ReasonChannelPolarityTable,
  IdentityTrait,
  projectTrait,
  isConsolidated,
  identityConsistency,
  identityFeedbackRawInfluences,
  CHANNEL_ORDER,
  BoundedSemanticPressure,
  IdentityExpressionChannelId,
} from '../model/identity';
import { SemanticReasonChannelId } from '../model/decision';

const ACTION_KEEP = canonicalActionKey('action.keep_dinner_promise');
const ACTION_WORK = canonicalActionKey('action.stay_at_work');

const KI = ratOf(2);
const KC = ratOf(2);

// Phase 2.95 — the polarity table is now keyed by SEMANTIC reason channel
// (decision.ts's SemanticReasonChannelId), not raw NeedId — the only shape
// that makes sense once every raw Need/accessibility/identity pressure is
// unconditionally consolidated into a semantic channel before Alignment
// ever sees it. This fixture mirrors scenario.ts's own
// defaultSemanticReasonPolarity()'s shape, restricted to the two channels
// these tests need.
const POLARITY: ReasonChannelPolarityTable = {
  commitment: { CommitmentFidelity: 1 },
  energetic: { WorkPersistence: 1 },
};

/** Build a `BoundedSemanticPressure` fixture directly: a dense per-option
 * map of semantic channel -> bounded (but not floor-filtered) strength.
 * Channels not mentioned default to Rational.ZERO, exactly like
 * `decision.ts::boundAllChannels`'s real output. */
function pressure(
  entries: ReadonlyArray<[typeof ACTION_KEEP, SemanticReasonChannelId, Rational]>,
): BoundedSemanticPressure {
  const byOption = new Map<typeof ACTION_KEEP, Map<SemanticReasonChannelId, Rational>>();
  for (const [option, channel, strength] of entries) {
    if (!byOption.has(option)) byOption.set(option, new Map());
    const m = byOption.get(option)!;
    m.set(channel, (m.get(channel) ?? Rational.ZERO).add(strength));
  }
  return byOption;
}

describe('IdentityEvidenceState update / derived quantities (Brief §19-20)', () => {
  it('positive e_k adds only to Support, negative only to Opposition', () => {
    const s1 = updateIdentityEvidence(EMPTY_IDENTITY_EVIDENCE, ratOf(3, 10));
    expect(s1.support.equals(ratOf(3, 10))).toBe(true);
    expect(s1.opposition.equals(Rational.ZERO)).toBe(true);

    const s2 = updateIdentityEvidence(s1, ratOf(-2, 10));
    expect(s2.support.equals(ratOf(3, 10))).toBe(true);
    expect(s2.opposition.equals(ratOf(2, 10))).toBe(true);
  });

  it('IdentityStrength stays in (-1,1) for finite evidence, and is exactly the hand-computed value', () => {
    const evidence: IdentityEvidenceState = { support: ratOf(6), opposition: ratOf(2) };
    // (6-2)/(2+6+2) = 4/10 = 2/5
    expect(identityStrength(evidence, KI).equals(ratOf(2, 5))).toBe(true);
    expect(identityStrength(evidence, KI).gt(ratOf(-1))).toBe(true);
    expect(identityStrength(evidence, KI).lt(ratOf(1))).toBe(true);
  });

  it('IdentityConfidence stays in [0,1) and grows toward 1 as evidence accumulates', () => {
    const low: IdentityEvidenceState = { support: ratOf(1), opposition: Rational.ZERO };
    const high: IdentityEvidenceState = { support: ratOf(50), opposition: Rational.ZERO };
    const cLow = identityConfidence(low, KC);
    const cHigh = identityConfidence(high, KC);
    expect(cLow.gte(Rational.ZERO)).toBe(true);
    expect(cHigh.lt(Rational.ONE)).toBe(true);
    expect(cHigh.gt(cLow)).toBe(true);
  });

  it('zero evidence gives IdentityStrength exactly 0 and IdentityConfidence exactly 0', () => {
    expect(identityStrength(EMPTY_IDENTITY_EVIDENCE, KI).equals(Rational.ZERO)).toBe(true);
    expect(identityConfidence(EMPTY_IDENTITY_EVIDENCE, KC).equals(Rational.ZERO)).toBe(true);
  });
});

describe('alignment — the three properties the design writeup claims (Phase 2.95: over BoundedSemanticPressure)', () => {
  it('is near zero on a low-conflict decision where no tagged semantic pressure drove the choice', () => {
    const boundedByOption = pressure([[ACTION_KEEP, 'affiliation', ratOf(3, 10)]]); // 'affiliation' is untagged in POLARITY
    const a = alignment(ACTION_KEEP, 'CommitmentFidelity', boundedByOption, POLARITY);
    expect(a.equals(Rational.ZERO)).toBe(true);
  });

  it("is positive when the chosen option's own tagged pressure is present and nothing opposes it", () => {
    const boundedByOption = pressure([[ACTION_KEEP, 'commitment', ratOf(5, 10)]]);
    const a = alignment(ACTION_KEEP, 'CommitmentFidelity', boundedByOption, POLARITY);
    expect(a.gt(Rational.ZERO)).toBe(true);
  });

  it("is negative for the winning option when the LOSING option carried the tagged pressure instead (Experiment J's mechanism)", () => {
    // Mina chooses to Stay At Work; Keep Dinner (the loser) carried strong
    // commitment-tagged pressure that was overridden.
    const boundedByOption = pressure([
      [ACTION_KEEP, 'commitment', ratOf(7, 10)],
      [ACTION_WORK, 'energetic', ratOf(7, 10)],
    ]);
    const aWork = alignment(ACTION_WORK, 'CommitmentFidelity', boundedByOption, POLARITY);
    expect(aWork.lt(Rational.ZERO)).toBe(true);
    const aWorkOwnChannel = alignment(ACTION_WORK, 'WorkPersistence', boundedByOption, POLARITY);
    expect(aWorkOwnChannel.gt(Rational.ZERO)).toBe(true);
  });

  it('stays within [-1,1] (boundedResponse guarantee) even for large imbalanced pressure', () => {
    // boundAllChannels would itself have already squashed a raw sum this
    // large to within (-1,1) before Alignment ever saw it — this fixture
    // bypasses that only to confirm Alignment's OWN bound still holds
    // regardless of what it's handed.
    const boundedByOption = pressure([[ACTION_KEEP, 'commitment', ratOf(1000)]]);
    const a = alignment(ACTION_KEEP, 'CommitmentFidelity', boundedByOption, POLARITY);
    expect(a.gt(ratOf(-1))).toBe(true);
    expect(a.lt(ratOf(1))).toBe(true);
  });
});

describe('touchedChannels', () => {
  it('reports only the channels the polarity table actually connects to a NONZERO semantic pressure', () => {
    const boundedByOption = pressure([
      [ACTION_KEEP, 'commitment', ratOf(5, 10)],
      [ACTION_WORK, 'affiliation', ratOf(5, 10)], // untagged in POLARITY
    ]);
    const touched = touchedChannels(boundedByOption, POLARITY);
    expect(touched).toEqual(['CommitmentFidelity']);
  });

  it('returns an empty list when nothing maps to any channel', () => {
    const boundedByOption = pressure([[ACTION_KEEP, 'affiliation', ratOf(5, 10)]]);
    expect(touchedChannels(boundedByOption, POLARITY)).toEqual([]);
  });

  it('a channel present in the dense map at exactly zero does not count as touched', () => {
    // boundAllChannels is dense: every semantic channel is present, most at
    // zero. A zero-strength 'commitment' entry must not spuriously mark
    // CommitmentFidelity as touched.
    const boundedByOption = pressure([[ACTION_KEEP, 'commitment', Rational.ZERO]]);
    expect(touchedChannels(boundedByOption, POLARITY)).toEqual([]);
  });
});

describe('Named trait projection and consolidation (Brief §21)', () => {
  const dependableIdx = CHANNEL_ORDER.indexOf('CommitmentFidelity');
  const dependableTrait: IdentityTrait = {
    traitId: 'trait.dependable',
    b: Rational.ZERO,
    w: CHANNEL_ORDER.map((_, i) => (i === dependableIdx ? Rational.ONE : Rational.ZERO)),
    Q: CHANNEL_ORDER.map(() => CHANNEL_ORDER.map(() => Rational.ZERO)),
  };

  it('projectTrait reduces to boundedResponse(IdentityStrength_CommitmentFidelity) for a pure single-channel trait', () => {
    const I = CHANNEL_ORDER.map((c) => (c === 'CommitmentFidelity' ? ratOf(6, 10) : Rational.ZERO));
    const projected = projectTrait(dependableTrait, I);
    expect(projected.equals(Rational.boundedResponse(ratOf(6, 10)))).toBe(true);
  });

  it('is NOT consolidated when strength clears the threshold but confidence does not', () => {
    const I = CHANNEL_ORDER.map((c) => (c === 'CommitmentFidelity' ? ratOf(9, 10) : Rational.ZERO));
    const evidence = new Map([['CommitmentFidelity' as const, { support: ratOf(1, 100), opposition: Rational.ZERO }]]);
    expect(isConsolidated(dependableTrait, I, evidence, KC, ratOf(3, 10), ratOf(5, 10))).toBe(false);
  });

  it('IS consolidated once both strength and confidence clear their thresholds', () => {
    const I = CHANNEL_ORDER.map((c) => (c === 'CommitmentFidelity' ? ratOf(9, 10) : Rational.ZERO));
    const evidence = new Map([['CommitmentFidelity' as const, { support: ratOf(100), opposition: Rational.ZERO }]]);
    expect(isConsolidated(dependableTrait, I, evidence, KC, ratOf(3, 10), ratOf(5, 10))).toBe(true);
  });

  it('a channel the trait does not reference does not gate its confidence', () => {
    const I = CHANNEL_ORDER.map((c) => (c === 'CommitmentFidelity' ? ratOf(9, 10) : Rational.ZERO));
    // Zero evidence for every OTHER channel, plenty for CommitmentFidelity.
    const evidence = new Map(CHANNEL_ORDER.map((c) => [c, c === 'CommitmentFidelity' ? { support: ratOf(100), opposition: Rational.ZERO } : EMPTY_IDENTITY_EVIDENCE]));
    expect(isConsolidated(dependableTrait, I, evidence, KC, ratOf(3, 10), ratOf(5, 10))).toBe(true);
  });
});

describe('identityConsistency — Brief §22, one reason among others, never a self-referential loop', () => {
  it('is exactly 0 when no identity evidence exists yet (nothing to be consistent with)', () => {
    const boundedByOption = pressure([[ACTION_KEEP, 'commitment', ratOf(5, 10)]]);
    const empty = new Map<IdentityExpressionChannelId, IdentityEvidenceState>();
    const consistency = identityConsistency(ACTION_KEEP, boundedByOption, empty as any, POLARITY, KI);
    expect(consistency.equals(Rational.ZERO)).toBe(true);
  });

  it('is positive for the option whose own reasons align with an already-established identity', () => {
    const boundedByOption = pressure([
      [ACTION_KEEP, 'commitment', ratOf(5, 10)],
      [ACTION_WORK, 'energetic', ratOf(5, 10)],
    ]);
    const evidence = new Map([['CommitmentFidelity' as const, { support: ratOf(20), opposition: Rational.ZERO }]]);
    const cKeep = identityConsistency(ACTION_KEEP, boundedByOption, evidence, POLARITY, KI);
    const cWork = identityConsistency(ACTION_WORK, boundedByOption, evidence, POLARITY, KI);
    expect(cKeep.gt(cWork)).toBe(true);
    expect(cKeep.gt(Rational.ZERO)).toBe(true);
  });

  it('stays bounded in [-1,1]', () => {
    const boundedByOption = pressure([[ACTION_KEEP, 'commitment', ratOf(1000)]]);
    const evidence = new Map([['CommitmentFidelity' as const, { support: ratOf(1000), opposition: Rational.ZERO }]]);
    const c = identityConsistency(ACTION_KEEP, boundedByOption, evidence, POLARITY, KI);
    expect(c.gte(ratOf(-1))).toBe(true);
    expect(c.lte(ratOf(1))).toBe(true);
  });

  it('produces no contribution for a channel with zero identity evidence even when the option has tagged pressure (the anti-double-counting design: nothing to be consistent with yet)', () => {
    const boundedByOption = pressure([[ACTION_KEEP, 'commitment', ratOf(9, 10)]]);
    const evidence = new Map<IdentityExpressionChannelId, IdentityEvidenceState>(); // no CommitmentFidelity evidence at all
    const a = alignment(ACTION_KEEP, 'CommitmentFidelity', boundedByOption, POLARITY);
    expect(a.gt(Rational.ZERO)).toBe(true); // Alignment itself is nonzero...
    const c = identityConsistency(ACTION_KEEP, boundedByOption, evidence, POLARITY, KI);
    expect(c.equals(Rational.ZERO)).toBe(true); // ...but IdentityStrength=0 means no consistency pull yet.
  });
});

describe('identityFeedbackRawInfluences — Phase 2.95: identity decomposed into per-channel raw pressure', () => {
  it('produces one RawReasonInfluence per channel with nonzero identity pull, tagged identity:<channel>', () => {
    const boundedByOption = pressure([
      [ACTION_KEEP, 'commitment', ratOf(5, 10)],
      [ACTION_WORK, 'energetic', ratOf(5, 10)],
    ]);
    const evidence = new Map([['CommitmentFidelity' as const, { support: ratOf(20), opposition: Rational.ZERO }]]);
    const raw = identityFeedbackRawInfluences(ACTION_KEEP, boundedByOption, evidence, POLARITY, KI);
    expect(raw.length).toBe(1);
    expect(raw[0].reasonChannel).toBe('identity:CommitmentFidelity');
    expect(raw[0].strength.gt(Rational.ZERO)).toBe(true);
    expect(raw[0].source).toBe('identity_consistency');
  });

  it('returns an empty list when no identity evidence exists yet, matching identityConsistency being exactly 0', () => {
    const boundedByOption = pressure([[ACTION_KEEP, 'commitment', ratOf(5, 10)]]);
    const empty = new Map<IdentityExpressionChannelId, IdentityEvidenceState>();
    expect(identityFeedbackRawInfluences(ACTION_KEEP, boundedByOption, empty, POLARITY, KI)).toEqual([]);
  });

  it('sums (via boundedResponse of the combined raw sum) to the SAME total identityConsistency scalar reports — decomposition is lossless, not a second, different computation', () => {
    const boundedByOption = pressure([
      [ACTION_KEEP, 'commitment', ratOf(6, 10)],
      [ACTION_WORK, 'energetic', ratOf(3, 10)],
    ]);
    const evidence = new Map([
      ['CommitmentFidelity' as const, { support: ratOf(10), opposition: Rational.ZERO }],
      ['WorkPersistence' as const, { support: ratOf(4), opposition: ratOf(1) }],
    ]);
    const total = identityConsistency(ACTION_KEEP, boundedByOption, evidence, POLARITY, KI);
    const raw = identityFeedbackRawInfluences(ACTION_KEEP, boundedByOption, evidence, POLARITY, KI);
    const rawSum = raw.reduce((acc, r) => acc.add(r.strength), Rational.ZERO);
    expect(total.equals(Rational.boundedResponse(rawSum))).toBe(true);
  });
});
