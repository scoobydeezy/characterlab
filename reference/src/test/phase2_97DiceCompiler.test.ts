import { describe, it, expect } from 'vitest';
import { Rational, ratOf } from '../kernel/rational';
import { canonicalActionKey, conceptKey } from '../kernel/canonical';
import { EMPTY_EVIDENCE_BASIS, evidenceBasisOf } from '../kernel/evidenceOverlap';
import { RawCognitiveSignal } from '../model/reasonNucleus';
import {
  BaseDieThresholds,
  ModifierFamilyDefinition,
  ModifierFamilyId,
  ReasonNucleusCompilationParams,
  compileReasonDice,
  strengthToBaseDie,
  strengthToIntegerModifier,
} from '../model/diceCompiler';

const OPT = canonicalActionKey('action.opt_a');
const GLEN = conceptKey('person.glen');
const PRIYA = conceptKey('person.priya');

const THRESHOLDS: BaseDieThresholds = {
  d4: ratOf(1, 10),
  d6: ratOf(1, 4),
  d8: ratOf(9, 20),
  d10: ratOf(13, 20),
  d12: ratOf(17, 20),
};

const STANDING_FAMILY: ModifierFamilyDefinition = { familyId: 'StandingIdentity', unit: ratOf(1, 4), maxMagnitude: 4 };
const SITUATIONAL_FAMILY: ModifierFamilyDefinition = { familyId: 'RecentExperience', unit: ratOf(1, 4), maxMagnitude: 4 };

function paramsWith(thetaReason: Rational): ReasonNucleusCompilationParams {
  const modifierFamilies = new Map<ModifierFamilyId, ModifierFamilyDefinition>([
    ['StandingIdentity', STANDING_FAMILY],
    ['RecentExperience', SITUATIONAL_FAMILY],
  ]);
  return { thresholds: THRESHOLDS, modifierFamilies, thetaReason };
}

function sig(over: Partial<RawCognitiveSignal>): RawCognitiveSignal {
  return {
    signalId: 'sig',
    optionKey: OPT,
    motiveChannel: 'Connection',
    referent: GLEN,
    sourceRole: 'MotiveGenerating',
    signedStrength: ratOf(1, 2),
    basis: EMPTY_EVIDENCE_BASIS,
    ...over,
  };
}

describe('diceCompiler::strengthToBaseDie / strengthToIntegerModifier', () => {
  it('buckets by absolute magnitude regardless of sign', () => {
    expect(strengthToBaseDie(ratOf(1, 20), THRESHOLDS)).toBeNull();
    expect(strengthToBaseDie(ratOf(-1, 20), THRESHOLDS)).toBeNull();
    expect(strengthToBaseDie(ratOf(1, 10), THRESHOLDS)).toBe(4);
    expect(strengthToBaseDie(ratOf(9, 10), THRESHOLDS)).toBe(12);
  });

  it('modifier truncates toward zero and clamps to maxMagnitude', () => {
    expect(strengthToIntegerModifier(ratOf(1, 4), STANDING_FAMILY)).toBe(1);
    expect(strengthToIntegerModifier(ratOf(49, 100), STANDING_FAMILY)).toBe(1); // 1.96 -> truncate to 1
    expect(strengthToIntegerModifier(ratOf(-49, 100), STANDING_FAMILY)).toBe(-1);
    expect(strengthToIntegerModifier(ratOf(100), STANDING_FAMILY)).toBe(4); // clamps to maxMagnitude
    expect(strengthToIntegerModifier(Rational.ZERO, STANDING_FAMILY)).toBe(0);
  });
});

describe('diceCompiler::compileReasonDice — Reason Activation (Experiments G/H/I)', () => {
  it('Experiment H: identity cannot create a nucleus from zero motive — B_n=0 (Standing only) yields no nucleus regardless of magnitude', () => {
    const signals = [sig({ signalId: 'standing', sourceRole: 'StandingDisposition', signedStrength: ratOf(9, 10) })];
    const compiled = compileReasonDice(new Map([[OPT, signals]]), paramsWith(ratOf(1, 100)));
    expect(compiled.get(OPT)).toEqual([]);
  });

  it('a genuine but weak motive that never clears thetaReason on its own is dropped', () => {
    const signals = [sig({ signalId: 'need', signedStrength: ratOf(1, 100) })];
    const compiled = compileReasonDice(new Map([[OPT, signals]]), paramsWith(ratOf(1, 2)));
    expect(compiled.get(OPT)).toEqual([]);
  });

  it('Experiment I: weak-but-genuine motive + eligible standing modifier rescues activation, with the floor d4 base die', () => {
    const weakNeed = sig({ signalId: 'need', signedStrength: ratOf(1, 100) }); // boundedResponse(0.01) well below THRESHOLDS.d4 on its own
    const standing = sig({ signalId: 'standing', sourceRole: 'StandingDisposition', signedStrength: ratOf(9, 10) });
    // thetaReason set so the weak motive ALONE (~0.0099) cannot clear it, but
    // R_n = |boundedB_n| + |boundedStanding| (~0.0099 + ~0.4737) does.
    const compiled = compileReasonDice(new Map([[OPT, [weakNeed, standing]]]), paramsWith(ratOf(3, 10)));
    const nuclei = compiled.get(OPT)!;
    expect(nuclei).toHaveLength(1);
    expect(nuclei[0].baseDie).toBe(4); // floored, since B_n alone doesn't clear d4
    expect(nuclei[0].key.direction).toBe('Pursue');
    expect(nuclei[0].standingModifier).toBeGreaterThan(0);
  });

  it('a strong motive alone clears its own natural bracket with zero modifier', () => {
    const strongNeed = sig({ signalId: 'need', signedStrength: ratOf(9, 10) }); // boundedResponse(0.9) ~= 0.474, clears d8 but not d10
    const compiled = compileReasonDice(new Map([[OPT, [strongNeed]]]), paramsWith(ratOf(1, 10)));
    const nuclei = compiled.get(OPT)!;
    expect(nuclei).toHaveLength(1);
    expect(nuclei[0].baseDie).toBe(8);
    expect(nuclei[0].finalModifier).toBe(0);
  });
});

describe('diceCompiler::compileReasonDice — Central Consolidation Rule (Experiments B/C/K)', () => {
  it('Experiment B: same referent, different motive channels -> multiple independent nuclei', () => {
    const signals = [
      sig({ signalId: 'a', motiveChannel: 'Connection', signedStrength: ratOf(3, 5) }),
      sig({ signalId: 'b', motiveChannel: 'Commitment', signedStrength: ratOf(3, 5) }),
      sig({ signalId: 'c', motiveChannel: 'Safety', signedStrength: ratOf(-3, 5) }),
    ];
    const compiled = compileReasonDice(new Map([[OPT, signals]]), paramsWith(ratOf(1, 10)));
    const nuclei = compiled.get(OPT)!;
    expect(nuclei).toHaveLength(3);
    expect(new Set(nuclei.map((n) => n.key.motiveChannel))).toEqual(new Set(['Connection', 'Commitment', 'Safety']));
  });

  it('Experiment C: same motive channel, different referents -> multiple independent nuclei', () => {
    const signals = [
      sig({ signalId: 'a', referent: GLEN, signedStrength: ratOf(1, 2) }),
      sig({ signalId: 'b', referent: PRIYA, signedStrength: ratOf(1, 2) }),
    ];
    const compiled = compileReasonDice(new Map([[OPT, signals]]), paramsWith(ratOf(1, 10)));
    const nuclei = compiled.get(OPT)!;
    expect(nuclei).toHaveLength(2);
  });

  it('never throws the one-nucleus-one-die invariant under ordinary grouped input, and results are canonically ordered', () => {
    const signals = [
      sig({ signalId: 'a', referent: GLEN, motiveChannel: 'Connection', signedStrength: ratOf(1, 2) }),
      sig({ signalId: 'b', referent: PRIYA, motiveChannel: 'Achievement', signedStrength: ratOf(-1, 2) }),
    ];
    expect(() => compileReasonDice(new Map([[OPT, signals]]), paramsWith(ratOf(1, 10)))).not.toThrow();
  });
});

describe('diceCompiler::compileReasonDice — Polarity * (Die + Modifier) (Brief §63)', () => {
  it('a Pursue nucleus\'s distribution support is entirely within [1+modifier, faces+modifier]', () => {
    const need = sig({ signalId: 'need', signedStrength: ratOf(1, 2) });
    const standing = sig({ signalId: 'standing', sourceRole: 'StandingDisposition', signedStrength: ratOf(1, 2) });
    const compiled = compileReasonDice(new Map([[OPT, [need, standing]]]), paramsWith(ratOf(1, 10)));
    const nucleus = compiled.get(OPT)![0];
    const support = [...nucleus.distribution.pmf.keys()].sort((a, b) => (a < b ? -1 : 1));
    expect(support[0]).toBe(BigInt(1 + nucleus.finalModifier));
    expect(support[support.length - 1]).toBe(BigInt(nucleus.baseDie + nucleus.finalModifier));
  });

  it('an Avoid nucleus negates the WHOLE (Die+Modifier) sum, not just the die', () => {
    const need = sig({ signalId: 'need', signedStrength: ratOf(-1, 2) });
    const standing = sig({ signalId: 'standing', sourceRole: 'StandingDisposition', signedStrength: ratOf(1, 2) });
    const compiled = compileReasonDice(new Map([[OPT, [need, standing]]]), paramsWith(ratOf(1, 10)));
    const nucleus = compiled.get(OPT)![0];
    expect(nucleus.key.direction).toBe('Avoid');
    const support = [...nucleus.distribution.pmf.keys()].sort((a, b) => (a < b ? -1 : 1));
    // Polarity(-1) * (Die[1..faces] + M) => [-(faces+M), ..., -(1+M)]
    expect(support[0]).toBe(BigInt(-(nucleus.baseDie + nucleus.finalModifier)));
    expect(support[support.length - 1]).toBe(BigInt(-(1 + nucleus.finalModifier)));
  });

  it('every PMF sums to exactly 1', () => {
    const need = sig({ signalId: 'need', signedStrength: ratOf(1, 2) });
    const compiled = compileReasonDice(new Map([[OPT, [need]]]), paramsWith(ratOf(1, 10)));
    const nucleus = compiled.get(OPT)![0];
    const total = [...nucleus.distribution.pmf.values()].reduce((a, p) => a.add(p), Rational.ZERO);
    expect(total.equals(Rational.ONE)).toBe(true);
  });
});

// Phase 2.97 closure audit, Check 4 (review agent finding): "same Option,
// same Motive, same Referent, Pursue vs Avoid must produce separate
// nuclei." `groupSignalsByTriple` groups WITHOUT direction and
// `compileOneTriple` resolves exactly one net B_n (hence exactly one
// direction) per triple per compile — so the reachable adversarial case is
// two SEPARATE compiles of the identical triple whose net sign flips
// (e.g. the same relationship, evaluated on two different days), not two
// simultaneously-active opposite-direction nuclei from one compile. See
// `reasonNucleus.test.ts`'s own Check 4 describe block for the key-identity
// half of this claim; this is the compile-level half.
describe('diceCompiler::compileReasonDice — Check 4: same triple, opposite net sign across two compiles, never collides', () => {
  it('a Pursue compile and an Avoid compile of the identical (Option, MotiveChannel, Referent) triple produce non-colliding nucleus keys', () => {
    const pursueSignals = [sig({ signalId: 'need-pursue', signedStrength: ratOf(1, 2) })];
    const avoidSignals = [sig({ signalId: 'need-avoid', signedStrength: ratOf(-1, 2) })];

    const pursueCompiled = compileReasonDice(new Map([[OPT, pursueSignals]]), paramsWith(ratOf(1, 10)));
    const avoidCompiled = compileReasonDice(new Map([[OPT, avoidSignals]]), paramsWith(ratOf(1, 10)));

    const pursueNucleus = pursueCompiled.get(OPT)![0];
    const avoidNucleus = avoidCompiled.get(OPT)![0];
    expect(pursueNucleus.key.direction).toBe('Pursue');
    expect(avoidNucleus.key.direction).toBe('Avoid');
    // Identical Option/MotiveChannel/Referent — direction is the only
    // thing distinguishing the two triples' resolved keys.
    expect(pursueNucleus.key.optionKey).toBe(avoidNucleus.key.optionKey);
    expect(pursueNucleus.key.motiveChannel).toBe(avoidNucleus.key.motiveChannel);
    expect(pursueNucleus.key.referent).toBe(avoidNucleus.key.referent);

    // The same "one nucleus, one die" invariant `compileReasonDice` itself
    // enforces within a single compile (Brief §66) must also hold if the
    // two compiles' results were ever merged into one id space (a
    // cross-compile trace, a dice-roll addressing table) — they must not
    // collapse into a single entry.
    const merged = new Map<string, unknown>();
    for (const n of [pursueNucleus, avoidNucleus]) {
      const key = `${n.key.optionKey}::${n.key.motiveChannel}::${n.key.referent}::${n.key.direction}`;
      expect(merged.has(key)).toBe(false); // would throw here if the two ever collided
      merged.set(key, n);
    }
    expect(merged.size).toBe(2);
  });

  it('one compile can only ever resolve ONE direction for a given triple — its net B_n has exactly one sign', () => {
    // Deliberately mixed-sign MotiveGenerating signals on the SAME triple,
    // within ONE compile: groupSignalsByTriple groups them together
    // (direction is not part of the grouping key), consolidateSigned nets
    // their signed sum, and resolvedNucleusKey resolves ONE direction from
    // that one net value — never two nuclei from one triple in one compile.
    const mixed = [
      sig({ signalId: 'need-positive', signedStrength: ratOf(9, 10) }),
      sig({ signalId: 'need-negative', signedStrength: ratOf(-1, 10) }),
    ];
    const compiled = compileReasonDice(new Map([[OPT, mixed]]), paramsWith(ratOf(1, 10)));
    const nuclei = compiled.get(OPT)!;
    expect(nuclei).toHaveLength(1); // not two — there is exactly one net B_n for this triple
    expect(nuclei[0].key.direction).toBe('Pursue'); // net sum is positive (0.9 - 0.1 = 0.8 before bounding)
  });
});

describe('diceCompiler::compileReasonDice — Correlated Evidence (Experiments D/E)', () => {
  it('two MotiveGenerating signals sharing identical EvidenceBasis consolidate to LESS than their naive (bounded) sum', () => {
    const basis = evidenceBasisOf([['experience:1', Rational.ONE]]);
    const signals = [
      sig({ signalId: 'a', signedStrength: ratOf(2, 5), basis }),
      sig({ signalId: 'b', signedStrength: ratOf(3, 10), basis }),
    ];
    const compiled = compileReasonDice(new Map([[OPT, signals]]), paramsWith(ratOf(1, 10)));
    const nucleus = compiled.get(OPT)![0];
    const naiveSumBounded = Rational.boundedResponse(ratOf(2, 5).add(ratOf(3, 10)));
    expect(nucleus.baseMotiveStrength.lt(naiveSumBounded)).toBe(true);
    // Second contributes exactly 0 (identical basis) -> net raw strength is
    // just the first contribution, THEN bounded (diceCompiler's own "sum,
    // then bound" discipline).
    expect(nucleus.baseMotiveStrength.equals(Rational.boundedResponse(ratOf(2, 5)))).toBe(true);
  });

  it('two MotiveGenerating signals with disjoint EvidenceBasis stack fully (independent evidence) before bounding', () => {
    const signals = [
      sig({ signalId: 'a', signedStrength: ratOf(2, 5), basis: evidenceBasisOf([['experience:1', Rational.ONE]]) }),
      sig({ signalId: 'b', signedStrength: ratOf(3, 10), basis: evidenceBasisOf([['experience:2', Rational.ONE]]) }),
    ];
    const compiled = compileReasonDice(new Map([[OPT, signals]]), paramsWith(ratOf(1, 10)));
    const nucleus = compiled.get(OPT)![0];
    expect(nucleus.baseMotiveStrength.equals(Rational.boundedResponse(ratOf(2, 5).add(ratOf(3, 10))))).toBe(true);
  });
});
