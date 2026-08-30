/**
 * Exact discrete probability distributions over finite integer supports —
 * Phase 2.9's Decision dice math (Brief §8-9: "construct the exact discrete
 * distribution of its RollScore through convolution... No simulation
 * approximation is required"). Pure kernel math: imports only
 * kernel/rational.ts and knows nothing about Decisions, Options, dice
 * calibration, or any other Decision-specific semantics — a `Distribution`
 * is simply "a finite set of integer values, each with an exact rational
 * probability, summing to exactly 1," the same layering discipline every
 * other kernel/ module already follows (kernel/rational.ts, kernel/linalg.ts
 * never import from model/).
 */

import { Rational } from './rational';

export interface Distribution {
  readonly pmf: ReadonlyMap<bigint, Rational>;
}

/** The convolution identity element: a distribution certain to be exactly
 * `value`. Used so an Option with zero rollable Influences still has a
 * well-defined degenerate RollScore ≡ 0 distribution, rather than being a
 * special case anywhere downstream. */
export function pointMass(value: bigint): Distribution {
  return { pmf: new Map([[value, Rational.ONE]]) };
}

/**
 * A signed dN die: uniform over {sign·1, ..., sign·N}, each with
 * probability 1/N — Brief §8: "Die_i = D(|Strength_i|)... its roll r_i...
 * Signed contribution c_i = sign(Strength_i)·r_i."
 */
export function uniformDie(faces: number, sign: 1 | -1): Distribution {
  if (!Number.isInteger(faces) || faces <= 0) {
    throw new RangeError('uniformDie: faces must be a positive integer');
  }
  const p = Rational.of(1n, BigInt(faces));
  const pmf = new Map<bigint, Rational>();
  for (let f = 1; f <= faces; f++) {
    pmf.set(BigInt(sign * f), p);
  }
  return { pmf };
}

/**
 * Full discrete convolution: the distribution of X+Y for independent
 * X~a, Y~b. Every (value,value) pair in the Cartesian product of supports
 * is visited exactly once; probabilities landing in the same result bucket
 * are summed. Exact Rational arithmetic throughout — no floating point, no
 * approximation, per Brief §9's explicit "no simulation approximation" and
 * the project-wide determinism contract.
 */
export function convolve(a: Distribution, b: Distribution): Distribution {
  const pmf = new Map<bigint, Rational>();
  for (const [va, pa] of a.pmf) {
    for (const [vb, pb] of b.pmf) {
      const v = va + vb;
      const p = pa.mul(pb);
      pmf.set(v, (pmf.get(v) ?? Rational.ZERO).add(p));
    }
  }
  return { pmf };
}

/** `convolve`, folded over a list, starting from the `pointMass(0n)`
 * identity — the exact distribution of `RollScore(option) = Σ c_i` over
 * all of an Option's Influence dice. */
export function convolveAll(dists: readonly Distribution[]): Distribution {
  return dists.reduce((acc, d) => convolve(acc, d), pointMass(0n));
}

export function pmfAt(d: Distribution, x: bigint): Rational {
  return d.pmf.get(x) ?? Rational.ZERO;
}

/** The distribution's support, in canonical ascending numeric order — the
 * one tie-break rule this module needs, over plain bigints rather than
 * ConceptKeys, so it doesn't depend on kernel/canonical.ts. */
export function support(d: Distribution): bigint[] {
  return [...d.pmf.keys()].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
}

export interface CdfTable {
  readonly sortedValues: readonly bigint[];
  readonly prefixSums: readonly Rational[]; // prefixSums[i] = P(X <= sortedValues[i])
}

/** Build once per distribution before repeated CDF lookups — `winProbabilities`
 * below does many CDF lookups per option and should not rebuild this per call. */
export function buildCdfTable(d: Distribution): CdfTable {
  const sortedValues = support(d);
  const prefixSums: Rational[] = [];
  let running = Rational.ZERO;
  for (const v of sortedValues) {
    running = running.add(pmfAt(d, v));
    prefixSums.push(running);
  }
  return { sortedValues, prefixSums };
}

/** P(X <= x), via binary search over the sorted support (§32-style "prove
 * it deterministically," no scan-order dependence). */
export function cdfAt(table: CdfTable, x: bigint): Rational {
  const { sortedValues, prefixSums } = table;
  if (sortedValues.length === 0) return Rational.ZERO;
  if (x < sortedValues[0]) return Rational.ZERO;
  if (x >= sortedValues[sortedValues.length - 1]) return prefixSums[prefixSums.length - 1];
  // Largest index i with sortedValues[i] <= x.
  let lo = 0;
  let hi = sortedValues.length - 1;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (sortedValues[mid] <= x) lo = mid;
    else hi = mid - 1;
  }
  return prefixSums[lo];
}

/** E[X] = Σ v·p(v) — used both for display and for Brief §10's
 * `ExpectedContribution_i` (M_o's per-influence term). */
export function expectedValue(d: Distribution): Rational {
  let acc = Rational.ZERO;
  for (const [v, p] of d.pmf) {
    acc = acc.add(p.mul(Rational.of(v, 1n)));
  }
  return acc;
}

/** Σ pmf — the Brief §35 "probability normalization" obligation, asserted
 * directly against this function in tests rather than merely assumed. */
export function totalProbability(d: Distribution): Rational {
  let acc = Rational.ZERO;
  for (const p of d.pmf.values()) acc = acc.add(p);
  return acc;
}

/**
 * Exact fair-tie-share win probability across K independent option-score
 * distributions (Brief §9). Different Options' RollScores are independent
 * whenever every Influence belongs to exactly one Option (disjoint,
 * independently-addressed draws) — true by construction for Decision
 * resolution (Brief §7: each DecisionInfluence names exactly one OptionId).
 *
 * For option i, with Others = every other option:
 *
 *   P(i wins) = Σ_{v in support(i)} pmf_i(v) ·
 *               Σ_{T ⊆ Others} [Π_{j∈T} pmf_j(v)] · [Π_{k∈Others\T} CDF_k(v-1)] / (|T|+1)
 *
 * i.e. for each value v option i could roll, consider every subset T of the
 * OTHER options that could also land exactly on v (a tie at the max), with
 * every option outside T ∪ {i} strictly below v; i wins that slice of
 * probability mass, shared fairly 1/(|T|+1) among the |T|+1 tied leaders —
 * exactly what a fair, uniform tie-resolution draw (Brief §8) makes true in
 * expectation, so folding the tie-share into the exact pre-roll P(o) is
 * legitimate rather than an approximation. Cost is O(|support_i| · 2^(K-1)
 * · K) — trivial for the realistic K∈{2,3} a Decision's Option count brief
 * §9 anticipates ("CharacterLab contains only one research character").
 *
 * For K=2 this collapses to the textbook `P_i = Σ_v pmf_i(v)·CDF_other(v-1)
 * + ½·Σ_v pmf_i(v)·pmf_other(v)` without a special case (T=∅ and T={other}
 * are the only two subsets) — checked explicitly in
 * test/discreteDistribution.test.ts.
 */
export function winProbabilities(
  options: readonly { id: string; dist: Distribution }[],
): ReadonlyMap<string, Rational> {
  if (options.length === 0) return new Map();
  if (options.length === 1) return new Map([[options[0].id, Rational.ONE]]);

  const cdfTables = new Map(options.map((o) => [o.id, buildCdfTable(o.dist)] as const));
  const result = new Map<string, Rational>();

  for (const opt of options) {
    const others = options.filter((o) => o.id !== opt.id);
    const n = others.length;
    let total = Rational.ZERO;
    for (const v of support(opt.dist)) {
      const pv = pmfAt(opt.dist, v);
      if (pv.isZero()) continue;
      let innerSum = Rational.ZERO;
      for (let mask = 0; mask < 1 << n; mask++) {
        let massAtTieOrBelow = Rational.ONE;
        let tieCount = 0;
        for (let idx = 0; idx < n; idx++) {
          const other = others[idx];
          if (mask & (1 << idx)) {
            massAtTieOrBelow = massAtTieOrBelow.mul(pmfAt(other.dist, v));
            tieCount++;
          } else {
            massAtTieOrBelow = massAtTieOrBelow.mul(cdfAt(cdfTables.get(other.id)!, v - 1n));
          }
        }
        innerSum = innerSum.add(massAtTieOrBelow.div(Rational.of(BigInt(tieCount + 1), 1n)));
      }
      total = total.add(pv.mul(innerSum));
    }
    result.set(opt.id, total);
  }
  return result;
}
