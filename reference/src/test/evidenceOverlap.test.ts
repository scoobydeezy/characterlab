import { describe, it, expect } from 'vitest';
import { Rational, ratOf } from '../kernel/rational';
import { evidenceBasisOf, overlap, consolidateCorrelated, sumEffective, aggregateEvidenceBasis, EMPTY_EVIDENCE_BASIS } from '../kernel/evidenceOverlap';

describe('evidenceOverlap::overlap', () => {
  it('is exactly 0 when both bases are empty', () => {
    expect(overlap(EMPTY_EVIDENCE_BASIS, EMPTY_EVIDENCE_BASIS).equals(Rational.ZERO)).toBe(true);
  });

  it('is exactly 0 for disjoint bases', () => {
    const a = evidenceBasisOf([['x', ratOf(1)]]);
    const b = evidenceBasisOf([['y', ratOf(1)]]);
    expect(overlap(a, b).equals(Rational.ZERO)).toBe(true);
  });

  it('is exactly 1 for identical bases', () => {
    const a = evidenceBasisOf([['x', ratOf(3)]]);
    const b = evidenceBasisOf([['x', ratOf(3)]]);
    expect(overlap(a, b).equals(Rational.ONE)).toBe(true);
  });

  it('matches Brief Experiment F exactly: basis A={1,2,3}, basis B={3,4,5}, equal unit weights -> Overlap = 1/5', () => {
    const a = evidenceBasisOf([
      ['1', Rational.ONE],
      ['2', Rational.ONE],
      ['3', Rational.ONE],
    ]);
    const b = evidenceBasisOf([
      ['3', Rational.ONE],
      ['4', Rational.ONE],
      ['5', Rational.ONE],
    ]);
    // Σmin = 1 (only key '3' overlaps, min(1,1)=1); Σmax = 5 (1+1+1+1+1 across the union of 5 keys).
    expect(overlap(a, b).equals(ratOf(1, 5))).toBe(true);
    expect(overlap(a, b).gt(Rational.ZERO)).toBe(true);
    expect(overlap(a, b).lt(Rational.ONE)).toBe(true);
  });

  it('is symmetric', () => {
    const a = evidenceBasisOf([
      ['x', ratOf(2)],
      ['y', ratOf(5)],
    ]);
    const b = evidenceBasisOf([
      ['y', ratOf(1)],
      ['z', ratOf(4)],
    ]);
    expect(overlap(a, b).equals(overlap(b, a))).toBe(true);
  });
});

describe('evidenceOverlap::consolidateCorrelated', () => {
  it('gives the first (canonical-order) contribution full weight regardless of input array order', () => {
    const basisX = evidenceBasisOf([['x', Rational.ONE]]);
    const contributions = [
      { id: 'b', magnitude: ratOf(3), basis: basisX },
      { id: 'a', magnitude: ratOf(5), basis: basisX },
    ];
    const forward = consolidateCorrelated(contributions);
    const shuffled = consolidateCorrelated([...contributions].reverse());
    // Canonical order is by descending magnitude first: 'a' (5) before 'b' (3).
    expect(forward.map((c) => c.id)).toEqual(['a', 'b']);
    expect(shuffled.map((c) => c.id)).toEqual(['a', 'b']);
    expect(forward[0].effective.equals(ratOf(5))).toBe(true); // first contribution always full weight
  });

  it('Experiment D: identical evidence -> the later duplicate contributes exactly 0', () => {
    const basisX = evidenceBasisOf([['x', Rational.ONE]]);
    const result = consolidateCorrelated([
      { id: 'first', magnitude: ratOf(5), basis: basisX },
      { id: 'second', magnitude: ratOf(3), basis: basisX },
    ]);
    const first = result.find((c) => c.id === 'first')!;
    const second = result.find((c) => c.id === 'second')!;
    expect(first.effective.equals(ratOf(5))).toBe(true);
    expect(second.overlapWithPrior.equals(Rational.ONE)).toBe(true);
    expect(second.effective.equals(Rational.ZERO)).toBe(true);
  });

  it('Experiment E: independent evidence -> each contributes fully', () => {
    const result = consolidateCorrelated([
      { id: 'a', magnitude: ratOf(5), basis: evidenceBasisOf([['x', Rational.ONE]]) },
      { id: 'b', magnitude: ratOf(3), basis: evidenceBasisOf([['y', Rational.ONE]]) },
    ]);
    expect(sumEffective(result).equals(ratOf(8))).toBe(true);
    for (const c of result) expect(c.effective.equals(c.rawMagnitude)).toBe(true);
  });

  it('Experiment F: partial overlap -> 0 < effective < rawMagnitude for the discounted contribution, strictly between the D and E cases', () => {
    const a = evidenceBasisOf([
      ['1', Rational.ONE],
      ['2', Rational.ONE],
      ['3', Rational.ONE],
    ]);
    const b = evidenceBasisOf([
      ['3', Rational.ONE],
      ['4', Rational.ONE],
      ['5', Rational.ONE],
    ]);
    const result = consolidateCorrelated([
      { id: 'a', magnitude: ratOf(5), basis: a },
      { id: 'b', magnitude: ratOf(3), basis: b },
    ]);
    const bContribution = result.find((c) => c.id === 'b')!;
    expect(bContribution.overlapWithPrior.equals(ratOf(1, 5))).toBe(true);
    expect(bContribution.independentFraction.equals(ratOf(4, 5))).toBe(true);
    expect(bContribution.effective.equals(ratOf(12, 5))).toBe(true); // 3 * 4/5
    expect(bContribution.effective.gt(Rational.ZERO)).toBe(true);
    expect(bContribution.effective.lt(bContribution.rawMagnitude)).toBe(true);
  });

  it('every overlapWithPrior/independentFraction stays within [0,1] across a mixed set', () => {
    const bases = ['x', 'y', 'z'].map((k) => evidenceBasisOf([[k, Rational.ONE]]));
    const shared = evidenceBasisOf([
      ['x', Rational.ONE],
      ['y', ratOf(1, 2)],
    ]);
    const contributions = [
      { id: 'c1', magnitude: ratOf(4), basis: bases[0] },
      { id: 'c2', magnitude: ratOf(3), basis: shared },
      { id: 'c3', magnitude: ratOf(2), basis: bases[2] },
    ];
    for (const c of consolidateCorrelated(contributions)) {
      expect(c.overlapWithPrior.gte(Rational.ZERO)).toBe(true);
      expect(c.overlapWithPrior.lte(Rational.ONE)).toBe(true);
      expect(c.independentFraction.gte(Rational.ZERO)).toBe(true);
      expect(c.independentFraction.lte(Rational.ONE)).toBe(true);
    }
  });

  it('returns [] for an empty contribution list', () => {
    expect(consolidateCorrelated([])).toEqual([]);
  });

  // Phase 2.97 closure audit, Check 2 (review agent finding): A derives
  // from evidence {1}, B from {2}, C from {1,2} — once A and B are both
  // already represented, C carries no genuinely new evidence at all. The
  // ORIGINAL pairwise-max algorithm missed this (C only partially overlaps
  // A and B individually — 1/2 each — so it granted C substantial residual
  // weight); comparing against the aggregate coverage of every earlier
  // contribution fixes it.
  it('cumulative evidence coverage {1}, {2}, {1,2}: C is fully redundant once A and B are both already represented', () => {
    const a = evidenceBasisOf([['1', Rational.ONE]]);
    const b = evidenceBasisOf([['2', Rational.ONE]]);
    const c = evidenceBasisOf([
      ['1', Rational.ONE],
      ['2', Rational.ONE],
    ]);
    // Magnitudes strictly descending (5 > 4 > 3) so canonical order is
    // exactly A, B, C regardless of id — C is evaluated last, against BOTH
    // A and B already folded into the running aggregate.
    const result = consolidateCorrelated([
      { id: 'A', magnitude: ratOf(5), basis: a },
      { id: 'B', magnitude: ratOf(4), basis: b },
      { id: 'C', magnitude: ratOf(3), basis: c },
    ]);
    expect(result.map((r) => r.id)).toEqual(['A', 'B', 'C']);
    const [rA, rB, rC] = result;
    // A: first in canonical order, no prior aggregate -> full weight.
    expect(rA.overlapWithPrior.equals(Rational.ZERO)).toBe(true);
    expect(rA.effective.equals(ratOf(5))).toBe(true);
    // B: disjoint from A's basis {1} -> still full weight.
    expect(rB.overlapWithPrior.equals(Rational.ZERO)).toBe(true);
    expect(rB.effective.equals(ratOf(4))).toBe(true);
    // C: aggregate of {A, B}'s bases is exactly {1,2} — identical to C's
    // own basis -> overlap 1, independentFraction 0, effective exactly 0.
    // (The pre-fix pairwise-max algorithm gave this contribution
    // overlapWithPrior = max(Overlap(C,A), Overlap(C,B)) = max(1/2, 1/2) =
    // 1/2, hence effective = 3 * 1/2 = 3/2 — checked directly by hand-
    // computing the old formula against these exact bases before this fix
    // landed, not merely asserted.)
    expect(rC.overlapWithPrior.equals(Rational.ONE)).toBe(true);
    expect(rC.independentFraction.equals(Rational.ZERO)).toBe(true);
    expect(rC.effective.equals(Rational.ZERO)).toBe(true);
  });

  it('aggregateEvidenceBasis takes the per-EvidenceId max across the given bases, not the sum', () => {
    const bases = [
      evidenceBasisOf([['x', ratOf(1, 2)]]),
      evidenceBasisOf([
        ['x', ratOf(3, 4)],
        ['y', Rational.ONE],
      ]),
    ];
    const aggregate = aggregateEvidenceBasis(bases);
    expect(aggregate.weights.get('x')!.equals(ratOf(3, 4))).toBe(true);
    expect(aggregate.weights.get('y')!.equals(Rational.ONE)).toBe(true);
  });

  it('aggregateEvidenceBasis of an empty list is the empty basis', () => {
    expect(aggregateEvidenceBasis([]).weights.size).toBe(0);
  });
});
