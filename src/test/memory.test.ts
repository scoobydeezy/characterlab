import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import { conceptKey, canonicalActionKey, ConceptKey } from '../kernel/canonical';
import {
  emptyMemoryStore,
  createMemory,
  addMemory,
  baseAccessibility,
  associativePull,
  scoreMemory,
  retrieveTopK,
  AccessibilityParams,
  MemoryStore,
} from '../model/memory';
import { ActivationVector } from '../model/activation';

const CONCEPT_A: ConceptKey = conceptKey('test.concept_a');
const CONCEPT_B: ConceptKey = conceptKey('test.concept_b');
const ACTION = canonicalActionKey('test.action');

const PARAMS: AccessibilityParams = { lambdaM: ratOf(1, 10), dM: 1, omegaB: ratOf(7, 10), omegaA: ratOf(3, 10) };

describe('baseAccessibility — Brief §17 recency/frequency formula', () => {
  it('a single retrieval at age 0 contributes exactly 1', () => {
    expect(baseAccessibility([5], 5, PARAMS).equals(Rational.ONE)).toBe(true);
  });

  it('matches the hand-derived formula 1/(1+lambda*age)^d for a single retrieval', () => {
    // age = 9, lambda = 0.1 -> 1/(1+0.9) = 1/1.9 = 10/19
    expect(baseAccessibility([1], 10, PARAMS).equals(ratOf(10, 19))).toBe(true);
  });

  it('sums independent contributions across multiple retrievals (frequency effect)', () => {
    // Two retrievals, ages 9 and 0: 10/19 + 1 = 29/19
    expect(baseAccessibility([1, 10], 10, PARAMS).equals(ratOf(10, 19).add(Rational.ONE))).toBe(true);
  });

  it('strictly decreases as age increases (pure decay, no reinforcement)', () => {
    const early = baseAccessibility([0], 5, PARAMS);
    const late = baseAccessibility([0], 50, PARAMS);
    expect(late.lt(early)).toBe(true);
  });

  it('a higher decay exponent dM decays faster for the same age > 0', () => {
    const d1 = baseAccessibility([0], 10, { ...PARAMS, dM: 1 });
    const d2 = baseAccessibility([0], 10, { ...PARAMS, dM: 2 });
    expect(d2.lt(d1)).toBe(true);
  });

  it('rejects a non-positive-integer dM', () => {
    expect(() => baseAccessibility([0], 1, { ...PARAMS, dM: 0 })).toThrow(RangeError);
    expect(() => baseAccessibility([0], 1, { ...PARAMS, dM: 1.5 })).toThrow(RangeError);
  });
});

describe('associativePull — averaged (not summed) across a memory\'s semantic concepts', () => {
  it('is zero for a memory with no semantic concepts', () => {
    const memory = createMemory('m1', 'e1', 0, [], [], [], [], null, ACTION);
    expect(associativePull(memory, new Map()).isZero()).toBe(true);
  });

  it('averages activation across tagged concepts rather than summing', () => {
    const memory = createMemory('m1', 'e1', 0, [CONCEPT_A, CONCEPT_B], [], [], [], null, ACTION);
    const activation: ActivationVector = new Map([[CONCEPT_A, ratOf(6, 10)], [CONCEPT_B, ratOf(2, 10)]]);
    expect(associativePull(memory, activation).equals(ratOf(4, 10))).toBe(true); // (0.6+0.2)/2 = 0.4
  });

  it('treats an untagged (missing-from-activation) concept as contributing 0, not throwing', () => {
    const memory = createMemory('m1', 'e1', 0, [CONCEPT_A, CONCEPT_B], [], [], [], null, ACTION);
    const activation: ActivationVector = new Map([[CONCEPT_A, ratOf(1)]]);
    expect(associativePull(memory, activation).equals(ratOf(1, 2))).toBe(true); // (1+0)/2
  });
});

describe('scoreMemory — Retrieval_m = omega_b*Base_m + omega_a*a_m', () => {
  it('combines base and associative terms with the authored weights', () => {
    const memory = createMemory('m1', 'e1', 0, [CONCEPT_A], [], [], [], null, ACTION);
    const store: MemoryStore = addMemory(emptyMemoryStore(), memory);
    const activation: ActivationVector = new Map([[CONCEPT_A, ratOf(1, 2)]]);
    const scored = scoreMemory(store.records[0], 0, activation, PARAMS);
    expect(scored.base.equals(Rational.ONE)).toBe(true); // age 0
    expect(scored.associative.equals(ratOf(1, 2))).toBe(true);
    // 0.7*1 + 0.3*0.5 = 0.85
    expect(scored.retrieval.equals(ratOf(85, 100))).toBe(true);
  });
});

describe('retrieveTopK — canonical ordering, tie-breaking, and retrieval reinforcement (§17)', () => {
  it('selects the K highest-scoring memories in descending retrieval order', () => {
    let store = emptyMemoryStore();
    store = addMemory(store, createMemory('m:low', 'e1', 0, [], [], [], [], null, ACTION));
    store = addMemory(store, createMemory('m:high', 'e2', 5, [], [], [], [], null, ACTION)); // more recent -> higher base
    store = addMemory(store, createMemory('m:mid', 'e3', 3, [], [], [], [], null, ACTION));

    const { selected } = retrieveTopK(store, 5, new Map(), PARAMS, 2);
    expect(selected.map((s) => s.record.memory.memoryId)).toEqual(['m:high', 'm:mid']);
  });

  it('breaks exact score ties by canonical memoryId ascending', () => {
    let store = emptyMemoryStore();
    // Same encoding tick -> identical Base_m, identical (zero) associative pull -> exact tie.
    store = addMemory(store, createMemory('m:zebra', 'e1', 0, [], [], [], [], null, ACTION));
    store = addMemory(store, createMemory('m:apple', 'e2', 0, [], [], [], [], null, ACTION));

    const { selected } = retrieveTopK(store, 0, new Map(), PARAMS, 2);
    expect(selected.map((s) => s.record.memory.memoryId)).toEqual(['m:apple', 'm:zebra']);
  });

  it('reinforces exactly the selected memories\' retrieval history, leaving others untouched', () => {
    let store = emptyMemoryStore();
    store = addMemory(store, createMemory('m:a', 'e1', 0, [], [], [], [], null, ACTION));
    store = addMemory(store, createMemory('m:b', 'e2', 0, [], [], [], [], null, ACTION));

    const { nextStore } = retrieveTopK(store, 100, new Map(), PARAMS, 1);
    // Only one is selected (tie-break picks 'm:a' canonically first).
    const a = nextStore.records.find((r) => r.memory.memoryId === 'm:a')!;
    const b = nextStore.records.find((r) => r.memory.memoryId === 'm:b')!;
    expect(a.retrievalHistory).toEqual([0, 100]);
    expect(b.retrievalHistory).toEqual([0]);
  });

  it('a memory retrieved again later has strictly higher future accessibility than if it had not been', () => {
    let store = emptyMemoryStore();
    store = addMemory(store, createMemory('m:a', 'e1', 0, [], [], [], [], null, ACTION));
    const { nextStore: reinforced } = retrieveTopK(store, 10, new Map(), PARAMS, 1);

    const baseWithReinforcement = baseAccessibility(reinforced.records[0].retrievalHistory, 30, PARAMS);
    const baseWithout = baseAccessibility(store.records[0].retrievalHistory, 30, PARAMS);
    expect(baseWithReinforcement.gt(baseWithout)).toBe(true);
  });

  it('k=0 selects nothing and mutates no retrieval history', () => {
    let store = emptyMemoryStore();
    store = addMemory(store, createMemory('m:a', 'e1', 0, [], [], [], [], null, ACTION));
    const { selected, nextStore } = retrieveTopK(store, 10, new Map(), PARAMS, 0);
    expect(selected).toEqual([]);
    expect(nextStore.records[0].retrievalHistory).toEqual([0]);
  });
});
