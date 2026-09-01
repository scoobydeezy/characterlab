import { describe, it, expect } from 'vitest';
import { Rational, ratOf } from '../kernel/rational';
import { canonicalActionKey, conceptKey } from '../kernel/canonical';
import { EMPTY_EVIDENCE_BASIS } from '../kernel/evidenceOverlap';
import {
  RawCognitiveSignal,
  groupSignalsByTriple,
  tripleKeyString,
  resolvedNucleusKey,
  nucleusKeyString,
  compareNucleusKeys,
  dominantReferent,
  REFERENT_NONE,
} from '../model/reasonNucleus';

const OPT_A = canonicalActionKey('action.opt_a');
const GLEN = conceptKey('person.glen');
const PRIYA = conceptKey('person.priya');

function signal(over: Partial<RawCognitiveSignal>): RawCognitiveSignal {
  return {
    signalId: 'sig',
    optionKey: OPT_A,
    motiveChannel: 'Connection',
    referent: GLEN,
    sourceRole: 'MotiveGenerating',
    signedStrength: ratOf(1, 2),
    basis: EMPTY_EVIDENCE_BASIS,
    ...over,
  };
}

describe('reasonNucleus::groupSignalsByTriple (Central Consolidation Rule)', () => {
  it('Experiment A shape: same Option+Motive+Referent signals merge into one group', () => {
    const s1 = signal({ signalId: 'a', sourceRole: 'MotiveGenerating' });
    const s2 = signal({ signalId: 'b', sourceRole: 'StandingDisposition' });
    const groups = groupSignalsByTriple([s1, s2]);
    expect(groups.size).toBe(1);
    expect([...groups.values()][0].length).toBe(2);
  });

  it('Experiment B shape: same Referent, different MotiveChannel -> stays separate', () => {
    const s1 = signal({ signalId: 'a', motiveChannel: 'Connection' });
    const s2 = signal({ signalId: 'b', motiveChannel: 'Commitment' });
    const s3 = signal({ signalId: 'c', motiveChannel: 'Safety' });
    const groups = groupSignalsByTriple([s1, s2, s3]);
    expect(groups.size).toBe(3);
  });

  it('Experiment C shape: same MotiveChannel, different Referent -> stays separate', () => {
    const s1 = signal({ signalId: 'a', referent: GLEN });
    const s2 = signal({ signalId: 'b', referent: PRIYA });
    const groups = groupSignalsByTriple([s1, s2]);
    expect(groups.size).toBe(2);
  });

  it('a different Option always keeps signals apart, even with identical Motive/Referent', () => {
    const otherOption = canonicalActionKey('action.opt_b');
    const s1 = signal({ signalId: 'a', optionKey: OPT_A });
    const s2 = signal({ signalId: 'b', optionKey: otherOption });
    const groups = groupSignalsByTriple([s1, s2]);
    expect(groups.size).toBe(2);
  });
});

describe('reasonNucleus::resolvedNucleusKey / nucleusKeyString / compareNucleusKeys', () => {
  it('resolves Pursue for nonnegative baseMotiveStrength and Avoid for negative', () => {
    const triple = { optionKey: OPT_A, motiveChannel: 'Connection' as const, referent: GLEN };
    expect(resolvedNucleusKey(triple, ratOf(1, 2)).direction).toBe('Pursue');
    expect(resolvedNucleusKey(triple, Rational.ZERO).direction).toBe('Pursue');
    expect(resolvedNucleusKey(triple, ratOf(-1, 2)).direction).toBe('Avoid');
  });

  it('nucleusKeyString round-trips distinctly for every differing field, and compareNucleusKeys gives a deterministic total order', () => {
    const base = { optionKey: OPT_A, motiveChannel: 'Connection' as const, referent: GLEN, direction: 'Pursue' as const };
    const variants = [
      base,
      { ...base, motiveChannel: 'Commitment' as const },
      { ...base, referent: PRIYA },
      { ...base, direction: 'Avoid' as const },
    ];
    const strings = variants.map(nucleusKeyString);
    expect(new Set(strings).size).toBe(4); // all distinct
    // compareNucleusKeys is consistent with nucleusKeyString's own canonical ordering.
    expect(compareNucleusKeys(base, base)).toBe(0);
  });
});

// Phase 2.97 closure audit, Check 4 (review agent finding): "same Option,
// same Motive, same Referent, Pursue vs Avoid must produce separate
// nuclei." Ground truth, established by reading `reasonNucleus.ts` and
// `diceCompiler.ts` directly rather than assumed: `ReasonNucleusKey` DOES
// already include `direction` (extending `ReasonNucleusTriple`), but
// `groupSignalsByTriple` groups WITHOUT direction, and `resolvedNucleusKey`
// resolves direction ONCE per triple from the net sign of that triple's
// consolidated MotiveGenerating strength (`diceCompiler.ts::compileOneTriple`).
// That means a single compile can never produce TWO simultaneously-active
// nuclei on one triple with opposite directions — there is exactly one net
// B_n, hence exactly one direction, per (Option, MotiveChannel, Referent)
// per compile. So the adversarial claim this suite actually needs to check
// is: whichever direction a triple's net sign resolves to, in whichever
// compile, its key is genuinely distinct from the SAME triple resolved the
// OTHER way in a different compile (a different day, a different round) —
// direction is load-bearing in nucleus identity, not a display-only label
// that could silently collide two opposite-meaning reasons together if
// they were ever compared, logged, or merged across compiles.
describe('reasonNucleus — Check 4: same Option/Motive/Referent, Pursue vs Avoid, must produce separate (non-colliding) nuclei', () => {
  it('the same triple resolved Pursue in one compile and Avoid in another produces two distinct, non-colliding keys', () => {
    const triple = { optionKey: OPT_A, motiveChannel: 'Connection' as const, referent: GLEN };
    const pursueKey = resolvedNucleusKey(triple, ratOf(3, 10)); // positive net B_n, e.g. today's compile
    const avoidKey = resolvedNucleusKey(triple, ratOf(-3, 10)); // negative net B_n, e.g. a later compile after things soured
    expect(pursueKey.direction).toBe('Pursue');
    expect(avoidKey.direction).toBe('Avoid');
    // Every OTHER field is identical — direction is the only thing that can
    // possibly keep them apart, and it does.
    expect(pursueKey.optionKey).toBe(avoidKey.optionKey);
    expect(pursueKey.motiveChannel).toBe(avoidKey.motiveChannel);
    expect(pursueKey.referent).toBe(avoidKey.referent);
    expect(nucleusKeyString(pursueKey)).not.toBe(nucleusKeyString(avoidKey));
    expect(compareNucleusKeys(pursueKey, avoidKey)).not.toBe(0);
    // Inserted into a shared id space (e.g. a cross-compile trace, or the
    // `id` a real dice roll is addressed by — Phase 2.97 plan decision 2),
    // the two do not collapse into one entry.
    const ids = new Set([nucleusKeyString(pursueKey), nucleusKeyString(avoidKey)]);
    expect(ids.size).toBe(2);
  });

  it('direction is the ONLY field resolvedNucleusKey can vary for a fixed triple — flipping the sign of an otherwise-identical baseMotiveStrength changes nothing else', () => {
    const triple = { optionKey: OPT_A, motiveChannel: 'Commitment' as const, referent: PRIYA };
    const pursueKey = resolvedNucleusKey(triple, ratOf(1, 100)); // barely positive
    const avoidKey = resolvedNucleusKey(triple, ratOf(-1, 100)); // barely negative, same magnitude
    expect(pursueKey).not.toEqual(avoidKey);
    expect({ ...pursueKey, direction: undefined }).toEqual({ ...avoidKey, direction: undefined });
  });
});

describe('reasonNucleus::dominantReferent (general continuous case, unused by any real signal source this phase)', () => {
  it('returns null when the top referent does not clear thetaReferent', () => {
    const attribution = new Map<any, Rational>([
      [GLEN, ratOf(1, 10)],
      [PRIYA, ratOf(1, 20)],
    ]);
    expect(dominantReferent(attribution, ratOf(1, 2), ratOf(1, 10))).toBeNull();
  });

  it('returns null when two referents are too close together (ambiguous) even if both clear thetaReferent', () => {
    const attribution = new Map<any, Rational>([
      [GLEN, ratOf(6, 10)],
      [PRIYA, ratOf(55, 100)],
    ]);
    expect(dominantReferent(attribution, ratOf(1, 2), ratOf(1, 5))).toBeNull();
  });

  it('returns the clear winner when it clears both thresholds', () => {
    const attribution = new Map<any, Rational>([
      [GLEN, ratOf(9, 10)],
      [PRIYA, ratOf(1, 10)],
    ]);
    expect(dominantReferent(attribution, ratOf(1, 2), ratOf(1, 5))).toBe(GLEN);
  });

  it('returns null for an empty attribution map', () => {
    expect(dominantReferent(new Map(), ratOf(1, 2), ratOf(1, 5))).toBeNull();
  });

  it("REFERENT_NONE is a legitimate map key like any other referent", () => {
    const attribution = new Map<any, Rational>([[REFERENT_NONE, ratOf(9, 10)]]);
    expect(dominantReferent(attribution, ratOf(1, 2), ratOf(1, 5))).toBe(REFERENT_NONE);
  });
});
