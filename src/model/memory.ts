/**
 * Episodic memory and retrieval accessibility, per Brief §17.
 *
 * Historical episode facts are immutable once created — the "immutable
 * episodic record" is exactly `MemoryEpisode` below, and nothing in this
 * module ever edits one after `createMemory`. "Reconsolidation" (§17) is
 * explicitly deferred by the brief itself ("Literal rewriting of
 * remembered content is deferred until an exact model exists") — what
 * Phase 2 DOES implement from that section is the part the brief says is
 * active now: retrieval activates the memory's semantic concepts, which
 * (via updateAssociations, model/associations.ts) can strengthen
 * association weights through ordinary learning. That wiring happens in
 * model/cycle.ts, not here — this module only tracks accessibility.
 */

import { Rational } from '../kernel/rational';
import { ConceptKey, CanonicalActionKey, NeedId, compareCanonical } from '../kernel/canonical';
import { ActivationVector } from './activation';

export interface NeedOutcomeRecord {
  readonly needId: NeedId;
  readonly result: Rational; // r_n for this Experience
}

export interface PredictionErrorRecord {
  readonly subject: ConceptKey;
  readonly needId: NeedId;
  readonly error: Rational; // actual r_n minus the expectation that was in effect at the time
}

export interface MemoryEpisode {
  readonly memoryId: string;
  readonly experienceId: string;
  readonly encodedAt: number;
  readonly semanticConcepts: readonly ConceptKey[];
  readonly needOutcomes: readonly NeedOutcomeRecord[];
  readonly predictionErrors: readonly PredictionErrorRecord[];
  readonly participants: readonly ConceptKey[];
  readonly location: ConceptKey | null;
  readonly action: CanonicalActionKey;
  /**
   * Phase 2.97 closure audit, Check 3 (review agent finding) — this
   * Experience's per-concept semantic salience (Phase 2.5b/c's `z_i`,
   * `model/semanticExperience.ts::ConceptEncoding.salience`), carried onto
   * the memory record itself rather than flattened away. Before this field
   * existed, `semanticConcepts` reduced every perceived concept to bare
   * list membership — "was Glen in this Experience at all" — which is
   * exactly the "presence is not equivalent to psychological centrality"
   * gap the review agent flagged: a memory with Glen highly salient and
   * Priya merely present gave both identical referent-attribution weight.
   * `model/cognitiveSignals.ts::situationalMemorySignals` is the consumer —
   * it weights each of `participants`'s referent contribution by this map's
   * entry for that concept, falling back to the pre-fix "attribute wholly
   * to the option's own subject" behavior when this map has no entry for
   * ANY participant (legacy `salienceMode: 'legacy'` memories, and any
   * fixture built before this field existed, both leave it empty). Empty,
   * never `undefined`, so every reader can treat "no salience data" and
   * "real but zero salience" uniformly via a plain `.get(...) ?? undefined`
   * lookup.
   */
  readonly conceptSalience: ReadonlyMap<ConceptKey, Rational>;
}

export interface MemoryRecord {
  readonly memory: MemoryEpisode;
  /** T_m — every tick this memory has been retrieved at, including the
   * tick it was encoded (encoding counts as the first "presentation," per
   * the standard reading of recency/frequency accessibility models this
   * formula is drawn from). */
  readonly retrievalHistory: readonly number[];
}

export interface MemoryStore {
  readonly records: readonly MemoryRecord[];
}

export function emptyMemoryStore(): MemoryStore {
  return { records: [] };
}

export function createMemory(
  memoryId: string,
  experienceId: string,
  encodedAt: number,
  semanticConcepts: readonly ConceptKey[],
  needOutcomes: readonly NeedOutcomeRecord[],
  predictionErrors: readonly PredictionErrorRecord[],
  participants: readonly ConceptKey[],
  location: ConceptKey | null,
  action: CanonicalActionKey,
  // Phase 2.97 closure audit, Check 3 — trailing and defaulted (mirrors
  // `cycle.ts::runDecisionCycle`'s own trailing-optional-params precedent)
  // so every pre-existing positional call site (tests, experiments) keeps
  // compiling unchanged, with the empty map triggering the documented
  // backward-compatible fallback in `cognitiveSignals.ts`.
  conceptSalience: ReadonlyMap<ConceptKey, Rational> = new Map(),
): MemoryEpisode {
  return { memoryId, experienceId, encodedAt, semanticConcepts, needOutcomes, predictionErrors, participants, location, action, conceptSalience };
}

export function addMemory(store: MemoryStore, memory: MemoryEpisode): MemoryStore {
  return { records: [...store.records, { memory, retrievalHistory: [memory.encodedAt] }] };
}

export interface MemoryCycleParams extends AccessibilityParams {
  /** How many memories to retrieve (and thereby reinforce) per cycle. */
  readonly retrievalK: number;
}

export interface AccessibilityParams {
  /** λ_m — recency decay rate. */
  readonly lambdaM: Rational;
  /** d_m — positive integer decay exponent. */
  readonly dM: number;
  /** ω_b — weight on recency/frequency base accessibility. */
  readonly omegaB: Rational;
  /** ω_a — weight on associative (spreading-activation) pull. */
  readonly omegaA: Rational;
}

/**
 * Base_m(t) = Σ_{r ∈ T_m} 1 / (1 + λ_m·(t − r))^{d_m}
 *
 * Every past retrieval (including encoding) contributes a term that decays
 * with age; frequently/recently retrieved memories accumulate a higher
 * Base_m than a single old encoding.
 */
export function baseAccessibility(retrievalHistory: readonly number[], t: number, params: AccessibilityParams): Rational {
  if (!Number.isInteger(params.dM) || params.dM <= 0) {
    throw new RangeError('baseAccessibility: dM must be a positive integer');
  }
  let sum = Rational.ZERO;
  for (const r of retrievalHistory) {
    const age = Rational.fromInt(Math.max(0, t - r));
    const denom = Rational.ONE.add(params.lambdaM.mul(age)).pow(params.dM);
    sum = sum.add(Rational.ONE.div(denom));
  }
  return sum;
}

/** a_m — this memory's pull from the network-wide spreading-activation
 * solve, aggregated across its semantic concepts. Averaged (not summed)
 * across concepts so a memory tagged with many concepts isn't
 * mechanically favored over a sparsely-tagged one purely by tag count —
 * an authored choice, not something Brief §17 pins down numerically. */
export function associativePull(memory: MemoryEpisode, activation: ActivationVector): Rational {
  if (memory.semanticConcepts.length === 0) return Rational.ZERO;
  let sum = Rational.ZERO;
  for (const c of memory.semanticConcepts) {
    sum = sum.add(activation.get(c) ?? Rational.ZERO);
  }
  return sum.div(Rational.fromInt(memory.semanticConcepts.length));
}

export interface ScoredMemory {
  readonly record: MemoryRecord;
  readonly base: Rational;
  readonly associative: Rational;
  readonly retrieval: Rational; // Retrieval_m = ω_b·Base_m + ω_a·a_m
}

export function scoreMemory(record: MemoryRecord, t: number, activation: ActivationVector, params: AccessibilityParams): ScoredMemory {
  const base = baseAccessibility(record.retrievalHistory, t, params);
  const associative = associativePull(record.memory, activation);
  const retrieval = params.omegaB.mul(base).add(params.omegaA.mul(associative));
  return { record, base, associative, retrieval };
}

/**
 * Top-K retrieval with canonical score ordering and stable tie-breaking
 * (§17). Retrieval itself becomes a new retrieval timestamp for every
 * selected memory — "Retrieval itself becomes another retrieval timestamp
 * and therefore changes future accessibility" — so this function returns
 * an updated MemoryStore, not just a read-only ranked list.
 */
export function retrieveTopK(
  store: MemoryStore,
  t: number,
  activation: ActivationVector,
  params: AccessibilityParams,
  k: number,
): { selected: ScoredMemory[]; nextStore: MemoryStore } {
  const scored = store.records.map((r) => scoreMemory(r, t, activation, params));
  const ranked = [...scored].sort((a, b) => {
    const cmp = b.retrieval.compare(a.retrieval); // descending
    if (cmp !== 0) return cmp;
    return compareCanonical(a.record.memory.memoryId, b.record.memory.memoryId);
  });
  const selected = ranked.slice(0, Math.max(0, k));
  const selectedIds = new Set(selected.map((s) => s.record.memory.memoryId));

  const nextRecords = store.records.map((r) =>
    selectedIds.has(r.memory.memoryId) ? { memory: r.memory, retrievalHistory: [...r.retrievalHistory, t] } : r,
  );

  return { selected, nextStore: { records: nextRecords } };
}
