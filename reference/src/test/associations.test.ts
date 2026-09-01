import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import { quantize, D as DEFAULT_D } from '../kernel/lattice';
import { conceptKey, ConceptKey } from '../kernel/canonical';
import {
  emptyGraph,
  getWeight,
  rowSum,
  updateAssociations,
  associationDecayFactor,
  AssociationLearningParams,
} from '../model/associations';

const A: ConceptKey = conceptKey('test.concept_a');
const B: ConceptKey = conceptKey('test.concept_b');
const C: ConceptKey = conceptKey('test.concept_c');
const UNIVERSE = [A, B, C];

const PARAMS: AssociationLearningParams = { lambdaA: ratOf(1, 20), eta: ratOf(3, 10) };

describe('updateAssociations — Brief §14–15 sole mutation authority', () => {
  it('starts every row at zero weight for a fresh graph', () => {
    const graph = emptyGraph(UNIVERSE);
    for (const i of UNIVERSE) {
      expect(rowSum(graph, i).isZero()).toBe(true);
      for (const j of UNIVERSE) {
        expect(getWeight(graph, i, j).isZero()).toBe(true);
      }
    }
  });

  it('learns a symmetric Hebbian edge between two co-activated concepts and decays it when not activated', () => {
    const graph0 = emptyGraph(UNIVERSE);
    const activation = new Map<ConceptKey, Rational>([[A, Rational.ONE], [B, Rational.ONE]]);
    const { graph: graph1 } = updateAssociations(graph0, activation, ratOf(1), PARAMS);

    // eta*1*1 = 0.30, quantized onto the lattice exactly (0.30 is already exact at D=1e6).
    expect(getWeight(graph1, A, B).equals(ratOf(3, 10))).toBe(true);
    expect(getWeight(graph1, B, A).equals(ratOf(3, 10))).toBe(true);
    // C was never co-activated with anything -> stays at 0.
    expect(getWeight(graph1, A, C).isZero()).toBe(true);

    // Advance one more step with NOTHING activated -> pure decay, no new Hebbian term.
    // updateAssociations quantizes every stored weight onto the D-lattice
    // (Brief §5.2/§15.1), so the expected value must go through the same
    // quantize() step rather than comparing against the raw exact decay —
    // decay*0.3 = 20/21 * 3/10 = 2/7, which is not itself lattice-exact.
    const { graph: graph2 } = updateAssociations(graph1, new Map(), ratOf(1), PARAMS);
    const decay = associationDecayFactor(PARAMS.lambdaA, ratOf(1));
    const { value: expected } = quantize(decay.mul(ratOf(3, 10)), DEFAULT_D);
    expect(getWeight(graph2, A, B).equals(expected)).toBe(true);
    expect(getWeight(graph2, A, B).lt(ratOf(3, 10))).toBe(true); // strictly decayed
  });

  it('never creates a self-association (W_ii stays 0 even when a concept is activated alone)', () => {
    const graph0 = emptyGraph(UNIVERSE);
    const activation = new Map<ConceptKey, Rational>([[A, Rational.ONE]]);
    const { graph: graph1 } = updateAssociations(graph0, activation, ratOf(1), PARAMS);
    expect(getWeight(graph1, A, A).isZero()).toBe(true);
  });

  it('preserves the row-substochastic invariant (Σ_j W_ij ≤ 1) even when many concepts co-activate repeatedly', () => {
    const universe = [A, B, C, conceptKey('test.concept_d'), conceptKey('test.concept_e')];
    let graph = emptyGraph(universe);
    // Every concept co-activates with every other concept, every step, for
    // many repetitions — the adversarial case for the row budget: without
    // largest-remainder normalization, a naive sum would run far past 1.
    const allActive = new Map<ConceptKey, Rational>(universe.map((c) => [c, Rational.ONE]));
    for (let step = 0; step < 25; step++) {
      const { graph: next } = updateAssociations(graph, allActive, ratOf(1), { lambdaA: ratOf(1, 100), eta: ratOf(1) });
      graph = next;
      for (const i of universe) {
        const sum = rowSum(graph, i);
        expect(sum.lte(Rational.ONE)).toBe(true);
        for (const j of universe) {
          expect(getWeight(graph, i, j).gte(Rational.ZERO)).toBe(true);
        }
      }
    }
    // With eta=1 driving every row toward overflow every step, normalization
    // should actually be engaging (rows pinned at exactly 1, not merely
    // under it) by the time the loop finishes.
    expect(rowSum(graph, A).equals(Rational.ONE)).toBe(true);
  });

  it('largest-remainder overflow allocation sums to exactly D (scale), not merely close to it', () => {
    // Three concepts each pulling for a share of concept A's row budget with
    // remainders unlikely to divide evenly — exercises the remainder
    // reallocation path directly at a small, hand-checkable scale.
    const universe = [A, B, C, conceptKey('test.concept_d')];
    const D = conceptKey('test.concept_d');
    let graph = emptyGraph(universe);
    const activation = new Map<ConceptKey, Rational>([[A, Rational.ONE], [B, Rational.ONE], [C, Rational.ONE], [D, Rational.ONE]]);
    const params: AssociationLearningParams = { lambdaA: ratOf(0), eta: ratOf(2, 3) }; // deliberately overflows: 3 edges * 2/3 = 2 > 1
    const scale = 12n; // small scale makes the remainder allocation easy to check by hand
    const { graph: next, trace } = updateAssociations(graph, activation, ratOf(1), params, scale);
    const total = [B, C, D].reduce((acc, j) => acc.add(getWeight(next, A, j)), Rational.ZERO);
    expect(total.equals(Rational.ONE)).toBe(true); // exactly 1, not "close to" 1
    const rowTrace = trace.find((t) => t.concept === A)!;
    expect(rowTrace.overflowed).toBe(true);
  });

  it('is idempotent under repeated calls with the same (zero) activation beyond pure decay', () => {
    const graph0 = emptyGraph(UNIVERSE);
    const activation = new Map<ConceptKey, Rational>([[A, Rational.ONE], [B, Rational.ONE]]);
    const { graph: seeded } = updateAssociations(graph0, activation, ratOf(1), PARAMS);
    const { graph: r1 } = updateAssociations(seeded, new Map(), ratOf(1), PARAMS);
    const { graph: r2 } = updateAssociations(seeded, new Map(), ratOf(1), PARAMS);
    expect(getWeight(r1, A, B).equals(getWeight(r2, A, B))).toBe(true);
  });
});
