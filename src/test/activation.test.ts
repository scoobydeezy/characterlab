import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import { quantizationErrorBound } from '../kernel/lattice';
import { conceptKey, ConceptKey } from '../kernel/canonical';
import { emptyGraph, updateAssociations, AssociationGraph, AssociationLearningParams } from '../model/associations';
import { solveActivation, ActivationVector } from '../model/activation';
import { matVecMul, solveLinearSystem } from '../kernel/linalg';

const A: ConceptKey = conceptKey('test.concept_a');
const B: ConceptKey = conceptKey('test.concept_b');
const C: ConceptKey = conceptKey('test.concept_c');

/** Build a graph with directly-authored weights (bypassing updateAssociations
 * — legitimate here since these tests are about solveActivation's math, not
 * about how W got there) so the expected answer can be hand-derived. */
function graphWithWeights(concepts: readonly ConceptKey[], weights: [ConceptKey, ConceptKey, Rational][]): AssociationGraph {
  const map = new Map<ConceptKey, Map<ConceptKey, Rational>>();
  for (const [i, j, w] of weights) {
    if (!map.has(i)) map.set(i, new Map());
    map.get(i)!.set(j, w);
  }
  return { concepts, weights: map };
}

describe('solveActivation — Brief §16 spreading activation', () => {
  it('with beta=0, activation equals the base vector exactly (no spreading at all)', () => {
    const graph = graphWithWeights([A, B], [[A, B, ratOf(1, 2)]]);
    const base: ActivationVector = new Map([[A, ratOf(3, 10)]]);
    const a = solveActivation(graph, ratOf(0), base);
    expect(a.get(A)!.equals(ratOf(3, 10))).toBe(true);
    expect(a.get(B)!.isZero()).toBe(true);
  });

  it('matches a hand-derived two-node solution: a = (I - βW)^-1 b', () => {
    // W: A -> B with weight 1/2, B -> A with weight 0. beta = 1/2.
    // a_A = b_A + beta*W_AA*a_A + beta*W_AB... wait spreading direction: a = b + beta*W*a (row i receives from columns it points to).
    // With W_AB=1/2 (A's row has weight to B) and base b_A=1:
    // a_A = 1 + beta*W_AA*a_A + ... ; since graph rows are "from i to j", (I-betaW)a=b means for row A:
    // a_A - beta*W_AB*a_B = b_A ; for row B: a_B - beta*W_BA*a_A = b_B (W_BA=0 here)
    // => a_B = b_B = 0 (since b_B=0 and W_BA=0) ... but then a_A = b_A = 1, spreading contributes nothing this direction.
    // Use W_BA instead so B receives from A: graph edge B->A weight 1/2, base on B.
    const graph = graphWithWeights([A, B], [[B, A, ratOf(1, 2)]]);
    const beta = ratOf(1, 2);
    const base: ActivationVector = new Map([[A, ratOf(1)]]);
    const a = solveActivation(graph, beta, base);
    // Row A: a_A - beta*W_AB*a_B = b_A = 1, W_AB=0 -> a_A = 1.
    // Row B: a_B - beta*W_BA*a_A = b_B = 0 -> a_B = beta*W_BA*a_A = 1/2*1/2*1 = 1/4.
    expect(a.get(A)!.equals(ratOf(1))).toBe(true);
    expect(a.get(B)!.equals(ratOf(1, 4))).toBe(true);
  });

  it('quantizes the solved activation to within the lattice bound of the EXACT (I - βW)a = b solution, for a nontrivial 3-node graph', () => {
    // solveActivation quantizes its result onto the D-lattice at commit
    // (Brief §5.2/§6), so the proof obligation isn't "matVecMul reproduces b
    // exactly" (the stored, rounded a can't generally satisfy an arbitrary
    // exact system bit-for-bit) — it's "the quantized a is within 1/(2D) of
    // the TRUE exact solution," which is what's checked here by solving the
    // same dense (I - βW)x = b system exactly via solveLinearSystem first.
    const graph = graphWithWeights(
      [A, B, C],
      [
        [A, B, ratOf(3, 10)],
        [A, C, ratOf(2, 10)],
        [B, C, ratOf(1, 2)],
        [C, A, ratOf(1, 4)],
      ],
    );
    const beta = ratOf(2, 5);
    const base: ActivationVector = new Map([[A, ratOf(7, 10)], [B, ratOf(1, 5)]]);

    const concepts = graph.concepts;
    const W = concepts.map((i) => concepts.map((j) => weightsOf(graph, i).get(j) ?? Rational.ZERO));
    const IminusBW = W.map((row, i) => row.map((w, j) => (i === j ? Rational.ONE : Rational.ZERO).sub(beta.mul(w))));
    const b = concepts.map((c) => base.get(c) ?? Rational.ZERO);

    // The exact (unquantized) solution — and a direct check that IT
    // satisfies the system exactly (this is the true "prove it" obligation;
    // kernel/linalg.test.ts covers the general case, this ties it to the
    // specific matrix shape solveActivation builds).
    const { solution: exact } = solveLinearSystem(IminusBW, b);
    const reconstructedB = matVecMul(IminusBW, exact);
    for (let i = 0; i < b.length; i++) {
      expect(reconstructedB[i].equals(b[i])).toBe(true);
    }

    // solveActivation's quantized output must land within the lattice's own
    // documented error bound of that exact solution, entry by entry.
    const a = solveActivation(graph, beta, base);
    const bound = quantizationErrorBound();
    concepts.forEach((c, idx) => {
      const error = a.get(c)!.sub(exact[idx]).abs();
      expect(error.lte(bound)).toBe(true);
    });
  });

  it('rejects beta outside [0, 1)', () => {
    const graph = emptyGraph([A]);
    expect(() => solveActivation(graph, ratOf(1), new Map())).toThrow(RangeError);
    expect(() => solveActivation(graph, ratOf(-1, 10), new Map())).toThrow(RangeError);
  });

  it('returns a dense vector covering every concept, 0 for concepts nothing spreads to', () => {
    const graph = emptyGraph([A, B, C]);
    const a = solveActivation(graph, ratOf(1, 2), new Map([[A, ratOf(1)]]));
    expect(a.size).toBe(3);
    expect(a.get(B)!.isZero()).toBe(true);
    expect(a.get(C)!.isZero()).toBe(true);
  });

  it('never throws SingularMatrixError against any graph reachable through updateAssociations (diagonal dominance in practice)', () => {
    // Row-substochastic by construction (updateAssociations's own invariant) +
    // beta < 1 => (I - betaW) strictly diagonally dominant => never singular.
    // Stress it with a densely cross-activated 6-concept universe over many
    // learning steps, then solve activation from several different bases.
    const universe = ['x', 'y', 'z', 'p', 'q', 'r'].map((s) => conceptKey(`test.${s}`));
    let graph = emptyGraph(universe);
    const params: AssociationLearningParams = { lambdaA: ratOf(1, 50), eta: ratOf(9, 10) };
    for (let step = 0; step < 15; step++) {
      // Rotate which subset is co-activated each step so different rows fill in.
      const active = universe.filter((_, idx) => (idx + step) % 2 === 0);
      const activation = new Map<ConceptKey, Rational>(active.map((c) => [c, Rational.ONE]));
      const { graph: next } = updateAssociations(graph, activation, ratOf(1), params);
      graph = next;
    }
    for (const beta of [ratOf(0), ratOf(1, 4), ratOf(1, 2), ratOf(9, 10), ratOf(99, 100)]) {
      for (const seed of universe) {
        expect(() => solveActivation(graph, beta, new Map([[seed, Rational.ONE]]))).not.toThrow();
      }
    }
  });
});

function weightsOf(graph: AssociationGraph, i: ConceptKey): ReadonlyMap<ConceptKey, Rational> {
  return graph.weights.get(i) ?? new Map();
}
