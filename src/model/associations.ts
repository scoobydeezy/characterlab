/**
 * Associative structure W_t, per Brief §14–15.
 *
 * "The associative graph answers: What does the character mentally
 * associate with what? It does not directly answer: What should the
 * character choose?" W_ij is directed association strength from concept i
 * to concept j, row-substochastic (Σ_j W_ij ≤ 1). `AssociationLearning`
 * (this module) is the SOLE mutation authority (§14) — enforced
 * structurally: `AssociationGraph.weights` is a private-by-convention
 * nested Map, and the ONLY exported function that produces a new graph
 * with different weights is `updateAssociations` below. Nothing else in
 * this codebase constructs an AssociationGraph with arbitrary weights.
 *
 * The concept universe is fixed per scenario (declared upfront, not
 * discovered mid-run) — Brief §13 prohibits "anonymous untyped graph
 * nodes," and a fixed, authored universe is the simplest way to guarantee
 * every node is typed and every matrix operation has a stable canonical
 * order (§6) without a dynamic-resize story that would complicate
 * determinism for no benefit at this scale.
 */

import { Rational } from '../kernel/rational';
import { ConceptKey, compareCanonical, sortCanonical } from '../kernel/canonical';
import { quantize, D as DEFAULT_D } from '../kernel/lattice';

export interface AssociationGraph {
  /** Fixed concept universe, already in canonical ConceptKey order. */
  readonly concepts: readonly ConceptKey[];
  /** weights.get(i)?.get(j) === W_ij. A missing entry means 0 — rows are
   * sparse because most concept pairs are never co-activated. */
  readonly weights: ReadonlyMap<ConceptKey, ReadonlyMap<ConceptKey, Rational>>;
}

export function createConceptUniverse(concepts: readonly ConceptKey[]): readonly ConceptKey[] {
  return sortCanonical(concepts, (c) => c);
}

export function emptyGraph(concepts: readonly ConceptKey[]): AssociationGraph {
  return { concepts: createConceptUniverse(concepts), weights: new Map() };
}

export function getWeight(graph: AssociationGraph, i: ConceptKey, j: ConceptKey): Rational {
  return graph.weights.get(i)?.get(j) ?? Rational.ZERO;
}

/** Σ_j W_ij for row i — exposed so tests and the UI can directly verify
 * the row-substochastic invariant (Brief §14, §32) rather than trusting
 * that updateAssociations preserved it. */
export function rowSum(graph: AssociationGraph, i: ConceptKey): Rational {
  const row = graph.weights.get(i);
  if (!row) return Rational.ZERO;
  let sum = Rational.ZERO;
  for (const w of row.values()) sum = sum.add(w);
  return sum;
}

export interface AssociationLearningParams {
  /** λ_a — association decay ("atrophy") rate per unit time. */
  readonly lambdaA: Rational;
  /** η — Hebbian learning rate for co-activated pairs. */
  readonly eta: Rational;
}

/** δ_a(Δt) = 1 / (1 + λ_a·Δt) */
export function associationDecayFactor(lambdaA: Rational, deltaT: Rational): Rational {
  return Rational.ONE.div(Rational.ONE.add(lambdaA.mul(deltaT)));
}

export interface RowNormalizationTrace {
  readonly concept: ConceptKey;
  readonly overflowed: boolean; // S > D, largest-remainder allocation was used
  readonly rawSum: Rational; // Σ q_j / D before normalization (for the trace)
}

/**
 * updateAssociations — THE sole legal mutation path for W (Brief §14).
 *
 * For every concept i in the universe:
 *   1. Decay the existing row: Ŵ_ij = δ_a(Δt)·W_ij for all j.
 *   2. Add the Hebbian term η·z_i·z_j for every OTHER concept j with
 *      nonzero activation this Experience (self-association W_ii is not
 *      modeled — see module-level note below).
 *   3. Quantize each entry to lattice mass q_j = max(0, RoundEven(D·Ŵ_ij)).
 *   4. If Σq_j ≤ D, store W_ij = q_j/D directly. Otherwise, deterministic
 *      largest-remainder proportional reallocation (§15.1) — ties broken
 *      by canonical ConceptKey — guarantees Σ_j W_ij = 1 exactly rather
 *      than merely close to 1, while every entry stays on the lattice.
 *
 * Self-association (W_ii) is deliberately excluded: a concept "priming
 * itself" isn't a meaningful spreading-activation edge and would only
 * shrink the row budget available for edges to other concepts. This is an
 * authored simplification, not something Brief §15 mandates either way —
 * flagged here and in RESEARCH.md as a modeling choice worth revisiting if
 * an experiment ever needs it.
 *
 * `activation` is the Experience-local co-activation signal z (Brief §15)
 * — e.g. 1.0 for concepts that were literally part of this Experience
 * (actor's action, subject, location, context tags) — NOT the
 * network-wide spread activation `a` from spreading activation (§16,
 * model/activation.ts). Conflating the two would make learning depend on
 * its own downstream accessibility output, which the brief keeps as two
 * separate mechanisms for exactly this reason.
 */
export function updateAssociations(
  graph: AssociationGraph,
  activation: ReadonlyMap<ConceptKey, Rational>,
  deltaT: Rational,
  params: AssociationLearningParams,
  scale: bigint = DEFAULT_D,
): { graph: AssociationGraph; trace: RowNormalizationTrace[] } {
  const decay = associationDecayFactor(params.lambdaA, deltaT);
  const nextWeights = new Map<ConceptKey, Map<ConceptKey, Rational>>();
  const traces: RowNormalizationTrace[] = [];

  const activeConcepts = graph.concepts.filter((c) => (activation.get(c) ?? Rational.ZERO).gt(Rational.ZERO));

  for (const i of graph.concepts) {
    const existingRow = graph.weights.get(i);
    const zi = activation.get(i) ?? Rational.ZERO;

    // Candidate exact (pre-quantization) weights for every column that
    // either already has a nonzero weight or is newly co-activated with i
    // this step — anything else stays implicitly 0 and needs no work.
    const touched = new Set<ConceptKey>(existingRow ? existingRow.keys() : []);
    if (zi.gt(Rational.ZERO)) {
      for (const j of activeConcepts) {
        if (j !== i) touched.add(j);
      }
    }

    if (touched.size === 0) {
      continue; // row stays entirely absent (all-zero) — nothing to normalize
    }

    const exactRow = new Map<ConceptKey, Rational>();
    for (const j of touched) {
      const prior = existingRow?.get(j) ?? Rational.ZERO;
      const decayed = decay.mul(prior);
      const zj = activation.get(j) ?? Rational.ZERO;
      const hebbian = zi.gt(Rational.ZERO) && zj.gt(Rational.ZERO) ? params.eta.mul(zi).mul(zj) : Rational.ZERO;
      exactRow.set(j, decayed.add(hebbian));
    }

    // Quantize to integer lattice mass q_j (§15.1).
    const qEntries: { concept: ConceptKey; q: bigint }[] = [];
    for (const [j, wHat] of exactRow) {
      const { k } = quantize(wHat, scale);
      qEntries.push({ concept: j, q: k < 0n ? 0n : k });
    }
    const S = qEntries.reduce((acc, e) => acc + e.q, 0n);

    const finalRow = new Map<ConceptKey, Rational>();
    if (S <= scale) {
      for (const e of qEntries) {
        if (e.q > 0n) finalRow.set(e.concept, Rational.of(e.q, scale));
      }
      traces.push({ concept: i, overflowed: false, rawSum: Rational.of(S, scale) });
    } else {
      // Deterministic largest-remainder allocation.
      const allocated: { concept: ConceptKey; a: bigint; remainder: bigint }[] = qEntries.map((e) => {
        const numerator = e.q * scale;
        const a = numerator / S; // floor division (both operands non-negative)
        const remainder = numerator % S;
        return { concept: e.concept, a, remainder };
      });
      const sumA = allocated.reduce((acc, e) => acc + e.a, 0n);
      let R = scale - sumA;
      // Sort by remainder descending, tie-break by canonical ConceptKey —
      // exactly Brief §15.1's rule.
      const byRemainderDesc = [...allocated].sort((x, y) => {
        if (x.remainder !== y.remainder) return x.remainder > y.remainder ? -1 : 1;
        return compareCanonical(x.concept, y.concept);
      });
      const bonus = new Map<ConceptKey, bigint>();
      for (let idx = 0; idx < byRemainderDesc.length && R > 0n; idx++, R--) {
        bonus.set(byRemainderDesc[idx].concept, 1n);
      }
      for (const e of allocated) {
        const final = e.a + (bonus.get(e.concept) ?? 0n);
        if (final > 0n) finalRow.set(e.concept, Rational.of(final, scale));
      }
      traces.push({ concept: i, overflowed: true, rawSum: Rational.of(S, scale) });
    }

    nextWeights.set(i, finalRow);
  }

  return { graph: { concepts: graph.concepts, weights: nextWeights }, trace: traces };
}
