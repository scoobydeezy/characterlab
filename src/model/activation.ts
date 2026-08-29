/**
 * Spreading activation, per Brief §16.
 *
 *   a = b + βWa  =>  a = (I - βW)^-1 b
 *
 * Uniqueness: since W is row-substochastic (Σ_j W_ij ≤ 1), ‖W‖_∞ ≤ 1, so
 * ‖βW‖_∞ ≤ β < 1 and ρ(βW) < 1 — (I - βW) is invertible and the solution
 * is unique (Brief §32 "Activation uniqueness"). This module additionally
 * proves (see kernel/linalg.ts's SingularMatrixError path and
 * test/activation.test.ts) that (I - βW) is in fact strictly diagonally
 * dominant whenever W is row-substochastic and 0 ≤ β < 1 — which means
 * Gaussian elimination WITHOUT row-swapping never hits a zero pivot for
 * any graph state this module can ever produce. That's a stronger,
 * checkable fact worth recording: activation solving on a legally-mutated
 * AssociationGraph should never throw SingularMatrixError in practice; if
 * it ever does, that's evidence the row-substochastic invariant was
 * violated somewhere upstream, not a normal degenerate case to catch and
 * ignore.
 */

import { Rational } from '../kernel/rational';
import { ConceptKey } from '../kernel/canonical';
import { quantize, D } from '../kernel/lattice';
import { solveLinearSystem, identity, Matrix } from '../kernel/linalg';
import { AssociationGraph, getWeight } from './associations';

export type ActivationVector = ReadonlyMap<ConceptKey, Rational>;

export interface ActivationParams {
  /** β ∈ [0, 1) — spreading decay per hop (Brief §16). */
  readonly beta: Rational;
  /** θ_A — accessibility threshold an Action's own concept must clear to
   * be a candidate (§22.2). */
  readonly thetaA: Rational;
  /** K_A — max candidates surviving accessibility filtering (§22.3). */
  readonly kA: number;
}

function toDenseW(graph: AssociationGraph): Matrix {
  return graph.concepts.map((i) => graph.concepts.map((j) => getWeight(graph, i, j)));
}

function toDenseB(graph: AssociationGraph, base: ActivationVector): Rational[] {
  return graph.concepts.map((c) => base.get(c) ?? Rational.ZERO);
}

/**
 * Solve a = (I - βW)^-1 b over the graph's fixed concept universe, then
 * quantize each entry onto the lattice at commit (§5.2, §6). Returns a
 * dense map covering every concept in the universe (0 where nothing
 * spreads to it), so callers never have to special-case "concept never
 * seen."
 */
export function solveActivation(graph: AssociationGraph, beta: Rational, base: ActivationVector): ActivationVector {
  if (beta.isNegative() || !beta.lt(Rational.ONE)) {
    throw new RangeError('solveActivation: beta must satisfy 0 <= beta < 1');
  }
  const n = graph.concepts.length;
  if (n === 0) return new Map();

  const W = toDenseW(graph);
  const I = identity(n);
  const A: Rational[][] = I.map((row, i) => row.map((val, j) => val.sub(beta.mul(W[i][j]))));
  const b = toDenseB(graph, base);

  const { solution } = solveLinearSystem(A, b);

  const result = new Map<ConceptKey, Rational>();
  solution.forEach((x, idx) => {
    const { value } = quantize(x, D);
    result.set(graph.concepts[idx], value);
  });
  return result;
}
