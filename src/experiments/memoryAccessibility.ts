/**
 * Brief §17 Phase-2 experiment: demonstrate recency decay, frequency/
 * retrieval-reinforcement, and the ω_b/ω_a blend of episodic memory
 * accessibility directly against model/memory.ts's own formulas.
 *
 * Every other Phase-2 experiment (habit.ts, substitution.ts) exercises
 * memory only as an implicit side effect of the cognitive cycle's step 5.
 * This one calls model/memory.ts's exported functions directly against a
 * small, hand-traceable timeline, deliberately isolated from Needs and the
 * association graph entirely (the same isolation habit.ts uses to keep
 * "which mechanism produced this number" unambiguous):
 *
 *   t=1  Memory A encoded (retrieval history: [1]).
 *   t=2  Memory B encoded (retrieval history: [2]) — one tick more recent
 *        than A, so at this instant Base_B > Base_A from recency alone,
 *        despite both having exactly one retrieval each.
 *   Idle to t=10 (no new encodings, no retrieval). Both Base_A and Base_B
 *        decay — checked directly against baseAccessibility's formula,
 *        not eyeballed.
 *   t=10 Memory A is explicitly retrieved again via retrieveTopK, with the
 *        activation vector rigged to favor A's own concept — its retrieval
 *        history becomes [1, 10]. Per Brief §17, "retrieval itself becomes
 *        another retrieval timestamp and therefore changes future
 *        accessibility."
 *   t=20 Base_A is computed twice: once against its actual (reinforced)
 *        history [1, 10], once against the counterfactual of never having
 *        been reinforced ([1] alone) — the difference isolates exactly
 *        what the t=10 reinforcement bought A, holding everything else
 *        (formula, params, elapsed time) fixed.
 */

import { Rational } from '../kernel/rational';
import { ConceptKey, conceptKey, canonicalActionKey, compareCanonical } from '../kernel/canonical';
import {
  MemoryStore,
  emptyMemoryStore,
  createMemory,
  addMemory,
  baseAccessibility,
  scoreMemory,
  retrieveTopK,
  AccessibilityParams,
  ScoredMemory,
} from '../model/memory';
import { ActivationVector } from '../model/activation';

const CONCEPT_A: ConceptKey = conceptKey('memory_experiment.concept_a');
const CONCEPT_B: ConceptKey = conceptKey('memory_experiment.concept_b');
const ACTION_A = canonicalActionKey('memory_experiment.action_a');
const ACTION_B = canonicalActionKey('memory_experiment.action_b');

export interface MemoryAccessibilitySnapshot {
  readonly t: number;
  readonly baseA: Rational;
  readonly baseB: Rational;
}

export interface ReinforcementComparison {
  readonly t: number;
  readonly baseAWithReinforcement: Rational;
  readonly baseAWithoutReinforcement: Rational;
  readonly reinforcementIncreasedBase: boolean;
}

export interface MemoryAccessibilityResult {
  readonly params: AccessibilityParams;
  readonly recencyAtEncoding: MemoryAccessibilitySnapshot; // t=2
  readonly recencyAfterIdle: MemoryAccessibilitySnapshot; // t=10, before A's reinforcement is applied
  readonly reinforcement: ReinforcementComparison; // t=20
  readonly topKAtEnd: readonly ScoredMemory[];
}

function findRecord(store: MemoryStore, memoryId: string) {
  const record = store.records.find((r) => r.memory.memoryId === memoryId);
  if (!record) throw new RangeError(`memoryAccessibility experiment: missing expected memory ${memoryId}`);
  return record;
}

export function runMemoryAccessibilityExperiment(params: AccessibilityParams): MemoryAccessibilityResult {
  let store: MemoryStore = emptyMemoryStore();
  store = addMemory(store, createMemory('memory:a', 'experience:a', 1, [CONCEPT_A], [], [], [], null, ACTION_A));
  store = addMemory(store, createMemory('memory:b', 'experience:b', 2, [CONCEPT_B], [], [], [], null, ACTION_B));

  const emptyActivation: ActivationVector = new Map();

  const baseA_t2 = baseAccessibility(findRecord(store, 'memory:a').retrievalHistory, 2, params);
  const baseB_t2 = baseAccessibility(findRecord(store, 'memory:b').retrievalHistory, 2, params);

  const baseA_t10 = baseAccessibility(findRecord(store, 'memory:a').retrievalHistory, 10, params);
  const baseB_t10 = baseAccessibility(findRecord(store, 'memory:b').retrievalHistory, 10, params);

  // Retrieve top-1 with activation rigged to favor A's concept only —
  // reinforces A's history to [1, 10] and leaves B untouched.
  const activationFavoringA: ActivationVector = new Map([[CONCEPT_A, Rational.ONE]]);
  const { nextStore } = retrieveTopK(store, 10, activationFavoringA, params, 1);
  store = nextStore;

  const reinforcedHistory = findRecord(store, 'memory:a').retrievalHistory; // [1, 10]
  const baseA_t20_withReinforcement = baseAccessibility(reinforcedHistory, 20, params);
  const baseA_t20_withoutReinforcement = baseAccessibility([1], 20, params);

  const finalScored = store.records.map((r) => scoreMemory(r, 20, emptyActivation, params));
  const topKAtEnd = [...finalScored].sort((x, y) => {
    const cmp = y.retrieval.compare(x.retrieval);
    if (cmp !== 0) return cmp;
    return compareCanonical(x.record.memory.memoryId, y.record.memory.memoryId);
  });

  return {
    params,
    recencyAtEncoding: { t: 2, baseA: baseA_t2, baseB: baseB_t2 },
    recencyAfterIdle: { t: 10, baseA: baseA_t10, baseB: baseB_t10 },
    reinforcement: {
      t: 20,
      baseAWithReinforcement: baseA_t20_withReinforcement,
      baseAWithoutReinforcement: baseA_t20_withoutReinforcement,
      reinforcementIncreasedBase: baseA_t20_withReinforcement.gt(baseA_t20_withoutReinforcement),
    },
    topKAtEnd,
  };
}
