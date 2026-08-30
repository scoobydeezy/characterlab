import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import { solveLinearSystem, matVecMul, identity, SingularMatrixError, Matrix, dot, quadraticForm, Vec } from '../kernel/linalg';

describe('solveLinearSystem — exact Gaussian elimination (Brief §16, §32)', () => {
  it('solves a hand-verified 2x2 system exactly', () => {
    // [2 1][x]   [5]      x = 1, y = 3 (2*1+1*3=5, 1*1+3*3=10... check: 1+3*3=10) use consistent system
    // Choose: 2x + y = 5, x + 3y = 10 -> x=1, y=3 (2*1+3=5 ok; 1+9=10 ok)
    const A: Matrix = [
      [ratOf(2), ratOf(1)],
      [ratOf(1), ratOf(3)],
    ];
    const b = [ratOf(5), ratOf(10)];
    const { solution } = solveLinearSystem(A, b);
    expect(solution[0].equals(ratOf(1))).toBe(true);
    expect(solution[1].equals(ratOf(3))).toBe(true);
  });

  it('solves a hand-verified 3x3 system exactly', () => {
    // x + y + z = 6, 2y + 5z = -4, 2x + 5y - z = 27 -> x=5, y=3, z=-2 (classic textbook system)
    const A: Matrix = [
      [ratOf(1), ratOf(1), ratOf(1)],
      [ratOf(0), ratOf(2), ratOf(5)],
      [ratOf(2), ratOf(5), ratOf(-1)],
    ];
    const b = [ratOf(6), ratOf(-4), ratOf(27)];
    const { solution } = solveLinearSystem(A, b);
    expect(solution[0].equals(ratOf(5))).toBe(true);
    expect(solution[1].equals(ratOf(3))).toBe(true);
    expect(solution[2].equals(ratOf(-2))).toBe(true);
  });

  it('every solution satisfies A*x = b exactly, not just approximately (§32 "prove it")', () => {
    const A: Matrix = [
      [ratOf(4), ratOf(-1), ratOf(0)],
      [ratOf(-1), ratOf(4), ratOf(-1)],
      [ratOf(0), ratOf(-1), ratOf(4)],
    ];
    const b = [ratOf(1, 3), ratOf(2, 7), ratOf(-1, 5)]; // fractional b — exercises exact fraction arithmetic throughout
    const { solution } = solveLinearSystem(A, b);
    const recomputed = matVecMul(A, solution);
    for (let i = 0; i < b.length; i++) {
      expect(recomputed[i].equals(b[i])).toBe(true);
    }
  });

  it('requires a row swap under the fixed pivot rule and still produces the exact solution', () => {
    // A[0][0] = 0 forces the documented "scan rows k+1..n-1 increasing index" swap.
    const A: Matrix = [
      [ratOf(0), ratOf(1)],
      [ratOf(1), ratOf(1)],
    ];
    const b = [ratOf(2), ratOf(3)]; // y=2, x+y=3 -> x=1, y=2
    const { solution } = solveLinearSystem(A, b);
    expect(solution[0].equals(ratOf(1))).toBe(true);
    expect(solution[1].equals(ratOf(2))).toBe(true);
  });

  it('throws a typed SingularMatrixError naming the pivot column for a singular matrix', () => {
    const A: Matrix = [
      [ratOf(1), ratOf(2)],
      [ratOf(2), ratOf(4)], // row 2 = 2 * row 1 -> singular
    ];
    const b = [ratOf(1), ratOf(2)];
    expect(() => solveLinearSystem(A, b)).toThrow(SingularMatrixError);
    let caught: unknown;
    try {
      solveLinearSystem(A, b);
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(SingularMatrixError);
    expect((caught as SingularMatrixError).pivotColumn).toBe(1);
  });

  it('solves the trivial 0x0 system as an empty solution', () => {
    const { solution } = solveLinearSystem([], []);
    expect(solution).toEqual([]);
  });

  it('identity(n) is the multiplicative identity: I*x = x', () => {
    const I = identity(3);
    const x = [ratOf(2, 3), ratOf(-5, 7), ratOf(11)];
    const result = matVecMul(I, x);
    for (let i = 0; i < x.length; i++) {
      expect(result[i].equals(x[i])).toBe(true);
    }
  });
});

describe('Rational stays exact through elimination (no accumulated imprecision)', () => {
  it('produces bit-exact repeated results across independent solves (determinism, §3.1)', () => {
    const A: Matrix = [
      [ratOf(3), ratOf(1), ratOf(-1)],
      [ratOf(1), ratOf(-2), ratOf(4)],
      [ratOf(2), ratOf(1), ratOf(1)],
    ];
    const b = [ratOf(1, 7), ratOf(-3, 11), ratOf(5, 13)];
    const run1 = solveLinearSystem(A, b).solution;
    const run2 = solveLinearSystem(A, b).solution;
    for (let i = 0; i < run1.length; i++) {
      expect(run1[i].equals(run2[i])).toBe(true);
      expect(run1[i].toString()).toBe(run2[i].toString());
    }
  });
});

describe('dot / quadraticForm — Phase 2.9 trait-projection primitives', () => {
  it('dot computes the exact inner product', () => {
    const a: Vec = [ratOf(1, 2), ratOf(-3), ratOf(4)];
    const b: Vec = [ratOf(2), ratOf(1, 3), ratOf(-1, 4)];
    // 1/2*2 + -3*1/3 + 4*-1/4 = 1 - 1 - 1 = -1
    expect(dot(a, b).equals(ratOf(-1))).toBe(true);
  });

  it('dot throws on mismatched lengths', () => {
    expect(() => dot([ratOf(1)], [ratOf(1), ratOf(2)])).toThrow(RangeError);
  });

  it('quadraticForm reduces to b + w.x when Q is all-zero (pure linear trait projection)', () => {
    const b = ratOf(1, 10);
    const w: Vec = [ratOf(1), ratOf(0), ratOf(0)];
    const Q: Matrix = [
      [ratOf(0), ratOf(0), ratOf(0)],
      [ratOf(0), ratOf(0), ratOf(0)],
      [ratOf(0), ratOf(0), ratOf(0)],
    ];
    const x: Vec = [ratOf(7, 10), ratOf(-2, 10), ratOf(3, 10)];
    // b + w.x = 1/10 + 7/10 = 8/10
    expect(quadraticForm(b, w, Q, x).equals(ratOf(8, 10))).toBe(true);
  });

  it('quadraticForm includes the x^T Q x term exactly for a hand-verified case', () => {
    const b = Rational.ZERO;
    const w: Vec = [ratOf(0), ratOf(0)];
    const Q: Matrix = [
      [ratOf(1), ratOf(0)],
      [ratOf(0), ratOf(2)],
    ];
    const x: Vec = [ratOf(3), ratOf(1, 2)];
    // x^T Q x = 3*1*3 + (1/2)*2*(1/2) = 9 + 1/2 = 9.5
    expect(quadraticForm(b, w, Q, x).equals(ratOf(19, 2))).toBe(true);
  });
});
