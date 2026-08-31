/**
 * Evidence provenance and the Reference Correlation Consolidator, per Phase
 * 2.97 Brief §51-59 ("Evidence Basis," "Evidence Overlap," "Correlated-
 * Evidence Rule," "Reference Correlation Consolidator"). Pure kernel math:
 * imports only `kernel/rational.ts` and `kernel/canonical.ts`'s
 * `compareCanonical`, and knows nothing about Reason Nuclei, Options,
 * Decisions, or any other Phase 2.97-specific semantics — mirrors
 * `kernel/discreteDistribution.ts`'s layering discipline exactly.
 *
 * `EvidenceBasis` is a sparse weighted provenance list keyed by plain
 * string EvidenceIds (an ExperienceId, a DecisionExpressionId, or a
 * synthetic identity-channel tag — see `model/cognitiveSignals.ts` for what
 * populates these) rather than a branded type: the brief is explicit that
 * CharacterLab is "intentionally unconstrained by production-scale storage"
 * here, so this stays a plain map rather than a new identifier universe to
 * validate.
 */

import { Rational } from './rational';
import { compareCanonical } from './canonical';

export interface EvidenceBasis {
  readonly weights: ReadonlyMap<string, Rational>;
}

export const EMPTY_EVIDENCE_BASIS: EvidenceBasis = { weights: new Map() };

export function evidenceBasisOf(entries: ReadonlyArray<readonly [string, Rational]>): EvidenceBasis {
  return { weights: new Map(entries) };
}

/**
 * Overlap(a,b) = Σ_x min(E_a(x),E_b(x)) / Σ_x max(E_a(x),E_b(x)) — Brief
 * §55. Weights are assumed non-negative (a caller's negative-sign
 * partitioning happens on the CONTRIBUTION's own sign, per decision 7's
 * "consolidate within signed sets" rule — never on an individual evidence
 * weight). 0 when both bases are empty or share no EvidenceId at all
 * (Σmax = 0 is treated as "no overlap," not division-by-zero); exactly 1
 * when the two bases are identical.
 */
export function overlap(a: EvidenceBasis, b: EvidenceBasis): Rational {
  let minSum = Rational.ZERO;
  let maxSum = Rational.ZERO;
  const keys = new Set<string>([...a.weights.keys(), ...b.weights.keys()]);
  for (const k of keys) {
    const wa = a.weights.get(k) ?? Rational.ZERO;
    const wb = b.weights.get(k) ?? Rational.ZERO;
    minSum = minSum.add(wa.min(wb));
    maxSum = maxSum.add(wa.max(wb));
  }
  if (maxSum.isZero()) return Rational.ZERO;
  return minSum.div(maxSum);
}

/** One already-sign-partitioned contribution to a nucleus's Base/Standing/
 * Situational sum — `magnitude` is `|contribution|`; the caller (Brief
 * §58-59: consolidate within signed sets, per SourceRole family, before
 * netting) is responsible for splitting positive/negative and
 * MotiveGenerating/StandingDisposition/SituationalEvidence contributions
 * into separate lists before calling `consolidateCorrelated` on each. */
export interface SignedContribution {
  readonly id: string; // canonical SignalId — the one tie-break key
  readonly magnitude: Rational;
  readonly basis: EvidenceBasis;
}

export interface ConsolidatedContribution {
  readonly id: string;
  readonly rawMagnitude: Rational;
  readonly overlapWithPrior: Rational; // O_j = Overlap(c_j, AggregateBasis_{i<j})
  readonly independentFraction: Rational; // 1 - O_j
  readonly effective: Rational; // rawMagnitude * independentFraction
}

/**
 * Per-EvidenceId union coverage of a set of bases: for each EvidenceId, the
 * MAXIMUM weight any basis in the set assigns it — the same "coverage of
 * this evidence item" reading `overlap`'s own Σmax denominator already
 * uses when combining two bases, just applied across however many bases are
 * being aggregated. Exported because it is independently meaningful (and
 * independently tested), not merely an internal helper of
 * `consolidateCorrelated` below.
 */
export function aggregateEvidenceBasis(bases: readonly EvidenceBasis[]): EvidenceBasis {
  const weights = new Map<string, Rational>();
  for (const basis of bases) {
    for (const [k, w] of basis.weights) {
      const existing = weights.get(k);
      if (!existing || w.gt(existing)) weights.set(k, w);
    }
  }
  return { weights };
}

/**
 * The Reference Correlation Consolidator (Brief §56): canonical ordering by
 * (1) descending magnitude, (2) canonical SignalId tie-break; for
 * contribution c_j, `O_j = Overlap(c_j, AggregateBasis_{i<j})`,
 * `IndependentFraction_j = 1 - O_j`, `Effective_j = Contribution_j ·
 * IndependentFraction_j`. The first contribution in canonical order always
 * receives full weight (the aggregate of zero prior bases is empty, and
 * `overlap` against an empty basis is exactly 0). Desirable properties,
 * verified directly in tests rather than merely assumed: identical evidence
 * → the later duplicate's effective contribution is exactly 0; independent
 * evidence → full contribution; partial overlap → `0 < effective <
 * rawMagnitude`. This is the brief's own "INITIAL reference model" —
 * pathologies, if an experiment surfaces one, are meant to be exposed, not
 * silently patched with a more complex covariance model (Brief §56's own
 * closing caution).
 *
 * Phase 2.97 CLOSURE AUDIT, Check 2 (review agent finding): the ORIGINAL
 * algorithm compared each contribution only against the SINGLE
 * most-overlapping earlier contribution (`O_j = max_{i<j}
 * Overlap(c_j,c_i)`), which misses COLLECTIVE redundancy — three
 * contributions from evidence bases `{1}`, `{2}`, `{1,2}` are the
 * textbook counter-example: the third contribution's basis is entirely
 * covered by the first two TOGETHER, but overlaps each of them only
 * partially on its own (`Overlap({1,2},{1}) = Overlap({1,2},{2}) = 1/2`),
 * so pairwise-max granted it substantial residual weight it should not
 * have had. Comparing against the AGGREGATE (per-id union-max) coverage of
 * every earlier contribution's basis, instead of the single closest one,
 * fixes this while changing nothing about the two-contribution D/E/F cases
 * (aggregating one prior basis is exactly that basis) — see
 * `evidenceOverlap.test.ts`'s cumulative-coverage case for the checked
 * numbers, both before and after this fix.
 */
export function consolidateCorrelated(contributions: readonly SignedContribution[]): ConsolidatedContribution[] {
  const ordered = [...contributions].sort((a, b) => {
    const cmp = b.magnitude.compare(a.magnitude); // descending magnitude
    return cmp !== 0 ? cmp : compareCanonical(a.id, b.id);
  });

  const result: ConsolidatedContribution[] = [];
  const priorBases: EvidenceBasis[] = [];
  for (const c of ordered) {
    const aggregatePrior = aggregateEvidenceBasis(priorBases);
    const o = overlap(c.basis, aggregatePrior);
    const independentFraction = Rational.ONE.sub(o);
    result.push({
      id: c.id,
      rawMagnitude: c.magnitude,
      overlapWithPrior: o,
      independentFraction,
      effective: c.magnitude.mul(independentFraction),
    });
    priorBases.push(c.basis);
  }
  return result;
}

/** Sum of `effective` contributions — the net magnitude a sign-partitioned,
 * role-partitioned contribution set nets out to after correlation
 * discounting. Exposed as its own function since every caller
 * (`diceCompiler.ts`) needs exactly this reduction immediately after
 * calling `consolidateCorrelated`. */
export function sumEffective(consolidated: readonly ConsolidatedContribution[]): Rational {
  return consolidated.reduce((acc, c) => acc.add(c.effective), Rational.ZERO);
}
