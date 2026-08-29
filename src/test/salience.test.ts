import { describe, it, expect } from 'vitest';
import { Rational, ratOf } from '../kernel/rational';
import { ConceptKey, conceptKey, needId } from '../kernel/canonical';
import {
  categoryFromConceptKey,
  needRelevance,
  surprise,
  surpriseMagnitude,
  rawSalience,
  computeSemanticSalience,
  BASE_SALIENCE,
  ROLE_WEIGHT,
  DEFAULT_ATTENTION_BY_ROLE,
  SalienceParams,
  SurpriseEvidence,
  WorldEventDescriptor,
  NeedImpact,
} from '../model/salience';

function params(overrides: Partial<SalienceParams> = {}): SalienceParams {
  return { alphaN: ratOf(1), alphaS: ratOf(1), budgetMode: 'independent', budget: ratOf(1), hybridThreshold: ratOf(1, 2), ...overrides };
}

function pointEvidence(priorMu: Rational, observed: Rational): SurpriseEvidence {
  return { kind: 'point', priorMu, observed };
}

const OBJECT_TABLE: ConceptKey = conceptKey('object.table');
const PERSON_GLEN: ConceptKey = conceptKey('person.glen');
const ACTION_DINE: ConceptKey = conceptKey('action.dine');
const NEED_CONNECTION_ID = needId('need.connection');
const NEED_REST_ID = needId('need.rest');

describe('categoryFromConceptKey (Brief §5.1 — no per-concept authored category table)', () => {
  it('derives category from the concept namespace, identically for every concept in that namespace', () => {
    expect(categoryFromConceptKey(conceptKey('person.glen'))).toBe('Person');
    expect(categoryFromConceptKey(conceptKey('person.priya'))).toBe('Person');
    expect(categoryFromConceptKey(conceptKey('action.visit_glen'))).toBe('Action');
    expect(categoryFromConceptKey(conceptKey('location.home'))).toBe('Location');
    expect(categoryFromConceptKey(conceptKey('context.evening'))).toBe('Context');
    expect(categoryFromConceptKey(conceptKey('object.lamp'))).toBe('Object');
    expect(categoryFromConceptKey(conceptKey('need.connection'))).toBe('Need');
  });

  it('throws on an unrecognized namespace rather than silently guessing', () => {
    expect(() => categoryFromConceptKey(conceptKey('mystery.thing'))).toThrow(RangeError);
  });
});

describe('needRelevance (Brief §9 — unchanged by Phase 2.5c, realized regulatory effect)', () => {
  const impacts: NeedImpact[] = [{ needId: NEED_CONNECTION_ID, delta: ratOf(4, 10), urgency: ratOf(1, 2) }];

  it('is exactly zero for a concept not causally connected, regardless of how large the Need impact was', () => {
    expect(needRelevance(false, impacts).isZero()).toBe(true);
  });

  it('is strictly positive and monotonic in magnitude for a causally-connected concept', () => {
    const small = needRelevance(true, [{ needId: NEED_CONNECTION_ID, delta: ratOf(1, 10), urgency: ratOf(1, 2) }]);
    const large = needRelevance(true, [{ needId: NEED_CONNECTION_ID, delta: ratOf(8, 10), urgency: ratOf(1, 2) }]);
    expect(small.gt(Rational.ZERO)).toBe(true);
    expect(large.gt(small)).toBe(true);
  });
});

describe('surprise / surpriseMagnitude (Brief §10, evidence-kind-aware per Phase 2.5c point 3)', () => {
  it('is exactly zero for a concept not causally connected, regardless of evidence', () => {
    expect(surprise(false, [pointEvidence(ratOf(0), ratOf(9, 10))]).isZero()).toBe(true);
  });

  it("'point' evidence is strictly positive and monotonic in |observed-priorMu|", () => {
    const lowSurprise = surprise(true, [pointEvidence(ratOf(0), ratOf(1, 20))]);
    const highSurprise = surprise(true, [pointEvidence(ratOf(0), ratOf(9, 10))]);
    expect(lowSurprise.gt(Rational.ZERO)).toBe(true);
    expect(highSurprise.gt(lowSurprise)).toBe(true);
  });

  it("'point' surprise treats sign symmetrically — |observed-priorMu| is what matters, not direction", () => {
    const negative = surprise(true, [pointEvidence(ratOf(0), ratOf(-9, 10))]);
    const positive = surprise(true, [pointEvidence(ratOf(0), ratOf(9, 10))]);
    expect(negative.equals(positive)).toBe(true);
  });

  it("'lower_bound' evidence at or below the prior is UNINFORMATIVE — zero surprise even far from μ", () => {
    // Believed +0.40; a ceiling-saturated observation only proves "at least +0.10" —
    // that's compatible with a belief of +0.40, so it proves nothing new (Brief review's
    // own worked example: a saturated observation being far from μ does not mean
    // something surprising happened, it means the observation under-measured).
    const magnitude = surpriseMagnitude({ kind: 'lower_bound', priorMu: ratOf(40, 100), observed: ratOf(10, 100) });
    expect(magnitude.isZero()).toBe(true);
  });

  it("'lower_bound' evidence ABOVE the prior proves the belief was too low — positive surprise", () => {
    // Believed +0.02; a saturated observation proves "at least +0.10" — that IS
    // incompatible with the prior belief, so surprise should be positive (= 0.08).
    const magnitude = surpriseMagnitude({ kind: 'lower_bound', priorMu: ratOf(2, 100), observed: ratOf(10, 100) });
    expect(magnitude.equals(ratOf(8, 100))).toBe(true);
  });

  it("'upper_bound' evidence is the mirror of 'lower_bound'", () => {
    const uninformative = surpriseMagnitude({ kind: 'upper_bound', priorMu: ratOf(-40, 100), observed: ratOf(-10, 100) });
    expect(uninformative.isZero()).toBe(true);
    const informative = surpriseMagnitude({ kind: 'upper_bound', priorMu: ratOf(-2, 100), observed: ratOf(-10, 100) });
    expect(informative.equals(ratOf(8, 100))).toBe(true);
  });

  it("a saturated observation's surprise never exceeds what an unsaturated 'point' reading of the same numbers would give — censoring can only reduce, never inflate, surprise", () => {
    const priorMu = ratOf(40, 100);
    const observed = ratOf(10, 100);
    const pointMagnitude = surpriseMagnitude({ kind: 'point', priorMu, observed });
    const lowerBoundMagnitude = surpriseMagnitude({ kind: 'lower_bound', priorMu, observed });
    expect(lowerBoundMagnitude.lte(pointMagnitude)).toBe(true);
  });
});

describe('rawSalience (Brief §11)', () => {
  it('is exactly the documented product B·R·A·(1+αN·N)·(1+αS·S)', () => {
    const B = ratOf(9, 10);
    const R = ratOf(1, 1);
    const A = ratOf(4, 5);
    const N = ratOf(1, 4);
    const S = ratOf(1, 10);
    const alphaN = ratOf(2);
    const alphaS = ratOf(1, 2);
    const expected = B.mul(R).mul(A).mul(Rational.ONE.add(alphaN.mul(N))).mul(Rational.ONE.add(alphaS.mul(S)));
    expect(rawSalience(B, R, A, N, S, alphaN, alphaS).equals(expected)).toBe(true);
  });
});

describe('computeSemanticSalience — Brief §27 mathematical obligations', () => {
  function tableDescriptor(role: 'Incidental' | 'Cause'): WorldEventDescriptor {
    return { perceived: [{ concept: OBJECT_TABLE, category: 'Object', role, perceived: true }] };
  }

  it('Salience bounds: 0 <= z_i <= 1 for every encoded concept, across all three budget models', () => {
    const descriptor: WorldEventDescriptor = {
      perceived: [
        { concept: ACTION_DINE, category: 'Action', role: 'Cause', perceived: true },
        { concept: PERSON_GLEN, category: 'Person', role: 'Target', perceived: true },
        { concept: OBJECT_TABLE, category: 'Object', role: 'Incidental', perceived: true },
      ],
    };
    const connected = new Set<ConceptKey>([ACTION_DINE, PERSON_GLEN]);
    const impacts: NeedImpact[] = [{ needId: NEED_CONNECTION_ID, delta: ratOf(4, 10), urgency: ratOf(3, 5) }];
    for (const budgetMode of ['independent', 'shared', 'hybrid'] as const) {
      const result = computeSemanticSalience(descriptor, connected, impacts, [pointEvidence(ratOf(0), ratOf(1, 20))], params({ budgetMode }));
      for (const b of result.breakdown) {
        expect(b.z.gte(Rational.ZERO)).toBe(true);
        expect(b.z.lte(Rational.ONE)).toBe(true);
      }
    }
  });

  it('Perception exclusion: P_i=0 forces z_i=0 regardless of category or causal role', () => {
    const descriptor: WorldEventDescriptor = {
      perceived: [
        { concept: ACTION_DINE, category: 'Action', role: 'Cause', perceived: true },
        { concept: PERSON_GLEN, category: 'Person', role: 'Target', perceived: false }, // Glen was never perceived this Experience
      ],
    };
    const connected = new Set<ConceptKey>([ACTION_DINE, PERSON_GLEN]);
    const result = computeSemanticSalience(descriptor, connected, [], [], params());
    const glen = result.breakdown.find((b) => b.concept === PERSON_GLEN)!;
    expect(glen.perceived).toBe(false);
    expect(glen.z.isZero()).toBe(true);
  });

  it('Deterministic salience: identical inputs produce an identical semantic Experience', () => {
    const descriptor = tableDescriptor('Cause');
    const connected = new Set<ConceptKey>([OBJECT_TABLE]);
    const impacts: NeedImpact[] = [{ needId: NEED_REST_ID, delta: ratOf(-7, 10), urgency: ratOf(4, 5) }];
    const evidence = [pointEvidence(ratOf(0), ratOf(7, 10))];
    const a = computeSemanticSalience(descriptor, connected, impacts, evidence, params());
    const b = computeSemanticSalience(descriptor, connected, impacts, evidence, params());
    const serialize = (result: typeof a) =>
      JSON.stringify(
        result.breakdown.map((x) => ({
          concept: x.concept,
          category: x.category,
          role: x.role,
          perceived: x.perceived,
          baseSalience: x.baseSalience.toCanonicalString(),
          roleWeight: x.roleWeight.toCanonicalString(),
          attention: x.attention.toCanonicalString(),
          needRelevance: x.needRelevance.toCanonicalString(),
          surprise: x.surprise.toCanonicalString(),
          raw: x.raw.toCanonicalString(),
          z: x.z.toCanonicalString(),
        })),
      );
    expect(serialize(a)).toEqual(serialize(b));
  });

  it('causal role overrides category prior: the same Object category swings from negligible (Incidental) to dominant (Cause)', () => {
    const connected = new Set<ConceptKey>([OBJECT_TABLE]);
    const incidental = computeSemanticSalience(tableDescriptor('Incidental'), new Set(), [], [], params());
    const cause = computeSemanticSalience(
      tableDescriptor('Cause'),
      connected,
      [{ needId: NEED_REST_ID, delta: ratOf(-8, 10), urgency: ratOf(4, 5) }],
      [pointEvidence(ratOf(0), ratOf(8, 10))],
      params(),
    );
    const zIncidental = incidental.breakdown[0].z;
    const zCause = cause.breakdown[0].z;
    expect(zCause.gt(zIncidental)).toBe(true);
    // Same base salience prior both times (same category) — only role/N/S differ.
    expect(incidental.breakdown[0].baseSalience.equals(cause.breakdown[0].baseSalience)).toBe(true);
    expect(incidental.breakdown[0].roleWeight.equals(ROLE_WEIGHT.Incidental)).toBe(true);
    expect(cause.breakdown[0].roleWeight.equals(ROLE_WEIGHT.Cause)).toBe(true);
  });

  it('a non-Incidental role gets its fixed DEFAULT_ATTENTION_BY_ROLE value exactly (Phase 2.5c: attention is derived, not authored per concept)', () => {
    const descriptor: WorldEventDescriptor = {
      perceived: [{ concept: PERSON_GLEN, category: 'Person', role: 'Target', perceived: true }],
    };
    const result = computeSemanticSalience(descriptor, new Set(), [], [], params());
    expect(result.breakdown[0].attention.equals(DEFAULT_ATTENTION_BY_ROLE.Target)).toBe(true);
  });

  it('an unperceived concept is reported with attention 0 and never enters the budget competition', () => {
    const descriptor: WorldEventDescriptor = {
      perceived: [{ concept: OBJECT_TABLE, category: 'Object', role: 'Participant', perceived: false }],
    };
    const result = computeSemanticSalience(descriptor, new Set(), [], [], params());
    const entry = result.breakdown[0];
    expect(entry.perceived).toBe(false);
    expect(entry.attention.isZero()).toBe(true);
    expect(entry.z.isZero()).toBe(true);
  });

  it('Model A (independent): z_i = boundedResponse(Raw_i) exactly', () => {
    const descriptor = tableDescriptor('Cause');
    const result = computeSemanticSalience(descriptor, new Set([OBJECT_TABLE]), [], [], params({ budgetMode: 'independent' }));
    const entry = result.breakdown[0];
    expect(entry.z.equals(Rational.boundedResponse(entry.raw))).toBe(true);
  });

  it('Model B (shared budget): z_i = Raw_i / max(B, sum Raw_j), bounded <= 1', () => {
    const descriptor: WorldEventDescriptor = {
      perceived: [
        { concept: ACTION_DINE, category: 'Action', role: 'Cause', perceived: true },
        { concept: PERSON_GLEN, category: 'Person', role: 'Target', perceived: true },
      ],
    };
    const budget = ratOf(1, 2);
    const result = computeSemanticSalience(descriptor, new Set([ACTION_DINE, PERSON_GLEN]), [], [], params({ budgetMode: 'shared', budget }));
    const total = result.breakdown.reduce((acc, b) => acc.add(b.raw), Rational.ZERO);
    const denom = budget.max(total);
    for (const b of result.breakdown) {
      expect(b.z.equals(b.raw.div(denom))).toBe(true);
      expect(b.z.lte(Rational.ONE)).toBe(true);
    }
  });

  it('Model C (hybrid): concepts at/above the threshold get independent encoding; the rest split the leftover budget', () => {
    const descriptor: WorldEventDescriptor = {
      perceived: [
        { concept: ACTION_DINE, category: 'Action', role: 'Cause', perceived: true }, // high raw — importance
        { concept: OBJECT_TABLE, category: 'Object', role: 'Incidental', perceived: true }, // low raw
      ],
    };
    const result = computeSemanticSalience(descriptor, new Set([ACTION_DINE]), [], [], params({ budgetMode: 'hybrid', budget: ratOf(1, 2), hybridThreshold: ratOf(1, 4) }));
    const important = result.breakdown.find((b) => b.concept === ACTION_DINE)!;
    expect(important.z.equals(Rational.boundedResponse(important.raw))).toBe(true); // independent path
    const low = result.breakdown.find((b) => b.concept === OBJECT_TABLE)!;
    expect(low.z.gte(Rational.ZERO)).toBe(true);
    expect(low.z.lte(Rational.ONE)).toBe(true);
  });

  it("locks 'independent' as BASE_SALIENCE/ROLE_WEIGHT's implied reference budget model (Phase 2.5c) — sanity-checks the tables exist for every category/role", () => {
    for (const category of Object.keys(BASE_SALIENCE) as (keyof typeof BASE_SALIENCE)[]) {
      expect(BASE_SALIENCE[category].gte(Rational.ZERO)).toBe(true);
    }
    for (const role of Object.keys(ROLE_WEIGHT) as (keyof typeof ROLE_WEIGHT)[]) {
      expect(ROLE_WEIGHT[role].gte(Rational.ZERO)).toBe(true);
    }
  });
});
