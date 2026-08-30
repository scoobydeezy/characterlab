/**
 * Deterministic exact linear algebra, per Brief §16 ("exact/fraction-free
 * matrix solving for temporary calculation") and the Phase-0 build list's
 * "fraction-free linear algebra" item (§33).
 *
 * A NOTE ON "FRACTION-FREE": Bareiss's algorithm exists to let integer-only
 * Gaussian elimination stay exact without fractions ever appearing, by
 * using a division that is provably always exact at each step. CharacterLab
 * already has an exact rational type (kernel/rational.ts) with automatic
 * GCD reduction on every operation, which solves the same underlying
 * problem — "no imprecision, no unbounded intermediate growth" — by a
 * different, and for this codebase more natural, route: every Rational is
 * kept in lowest terms at all times, so intermediate values in elimination
 * cannot grow the way ungreduced integer fractions would. What matters for
 * Brief §3.1/§32 — no floating point, no unspecified rounding, a fully
 * exact and reproducible result — holds equally either way. This module
 * documents that choice explicitly rather than silently departing from the
 * brief's wording.
 *
 * Determinism requires a FIXED pivot rule and CANONICAL row/column order
 * (§6, §32). Row/column order here is whatever order the caller's index
 * array is in — callers (kernel/activation.ts) pass concepts pre-sorted by
 * canonical ConceptKey (kernel/canonical.ts), so index order IS canonical
 * order; this module never reorders anything on its own. The pivot rule is
 * fixed and stated below.
 */

import { Rational } from './rational';

export type Matrix = readonly (readonly Rational[])[];
export type Vec = readonly Rational[];

export interface SolveResult {
  readonly solution: Rational[];
}

export class SingularMatrixError extends Error {
  constructor(readonly pivotColumn: number) {
    super(`Matrix is singular (or numerically so): no nonzero pivot available for column ${pivotColumn}`);
  }
}

function cloneMatrix(A: Matrix): Rational[][] {
  return A.map((row) => [...row]);
}

/**
 * Solve Ax = b exactly for square A, via Gaussian elimination with partial
 * pivoting.
 *
 * Pivot rule (fixed, per §32's determinism requirement): at column k, if
 * A[k][k] is zero, scan rows k+1..n-1 IN INCREASING INDEX ORDER for the
 * first row with a nonzero entry in column k and swap it into place. If no
 * such row exists, the matrix is singular at that column — this is the
 * "defined singularity behavior" §18 asks for: callers get a typed
 * SingularMatrixError naming the column, never a silent NaN/Infinity.
 *
 * This is plain Gaussian elimination, not literal row-echelon-by-minors
 * Bareiss — see the module comment for why that is the right choice given
 * kernel/rational.ts's exact, auto-reduced representation.
 */
export function solveLinearSystem(A: Matrix, b: Vec): SolveResult {
  const n = A.length;
  if (n === 0) return { solution: [] };
  for (const row of A) {
    if (row.length !== n) throw new RangeError('solveLinearSystem: A must be square');
  }
  if (b.length !== n) throw new RangeError('solveLinearSystem: b length must match A');

  // Augmented matrix [A | b], exact Rational entries throughout.
  const M: Rational[][] = cloneMatrix(A).map((row, i) => [...row, b[i]]);

  for (let k = 0; k < n; k++) {
    if (M[k][k].isZero()) {
      let swapRow = -1;
      for (let r = k + 1; r < n; r++) {
        if (!M[r][k].isZero()) {
          swapRow = r;
          break;
        }
      }
      if (swapRow === -1) throw new SingularMatrixError(k);
      const tmp = M[k];
      M[k] = M[swapRow];
      M[swapRow] = tmp;
    }
    const pivot = M[k][k];
    for (let r = k + 1; r < n; r++) {
      if (M[r][k].isZero()) continue;
      const factor = M[r][k].div(pivot);
      for (let c = k; c <= n; c++) {
        M[r][c] = M[r][c].sub(factor.mul(M[k][c]));
      }
    }
  }

  // Back-substitution.
  const x = new Array<Rational>(n);
  for (let i = n - 1; i >= 0; i--) {
    let acc = M[i][n];
    for (let j = i + 1; j < n; j++) {
      acc = acc.sub(M[i][j].mul(x[j]));
    }
    x[i] = acc.div(M[i][i]);
  }
  return { solution: x };
}

/** A·x — used by tests to confirm a solution actually satisfies the system
 * it was solved from (§32-style "prove it," not "assert it"). */
export function matVecMul(A: Matrix, x: Vec): Rational[] {
  return A.map((row) => row.reduce((acc, a_ij, j) => acc.add(a_ij.mul(x[j])), Rational.ZERO));
}

export function identity(n: number): Rational[][] {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? Rational.ONE : Rational.ZERO)),
  );
}

/** a·b = Σ a_i·b_i — Phase 2.9's trait-projection quadratic form is built
 * entirely from this and `matVecMul`, already present in this file. */
export function dot(a: Vec, b: Vec): Rational {
  if (a.length !== b.length) throw new RangeError('dot: vectors must have the same length');
  return a.reduce((acc, ai, i) => acc.add(ai.mul(b[i])), Rational.ZERO);
}

/**
 * b + w^T·x + x^T·Q·x — the trait/personality-style bounded quadratic
 * projection form the master Brief §9.1 specifies for named-trait
 * projections (`T_k(P) = g(b_k + w_k^T·P + P^T·Q_k·P)`) and Phase 2.9's
 * Brief §21 reuses verbatim for named Acquired Identity Traits over the
 * IdentityStrength vector instead of the personality vector P. Kept here
 * rather than in a Phase-2.9-specific module so Phase 3 (latent
 * personality) can reuse it without re-deriving the same three-term form.
 * Callers apply `Rational.boundedResponse` to the result themselves — this
 * function returns the raw (possibly unbounded) quadratic value.
 */
export function quadraticForm(b: Rational, w: Vec, Q: Matrix, x: Vec): Rational {
  return b.add(dot(w, x)).add(dot(x, matVecMul(Q, x)));
}
