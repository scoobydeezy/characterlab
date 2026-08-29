/**
 * Character state — the Phase 1+2 subset of S_t = (P, N_t, W_t, E_t, B_t, M_t)
 * from Brief §8.
 *
 * This build populates N_t (Need state), E_t (learned Need-satisfaction
 * expectations), W_t (associative structure, §14, Phase 2), and M_t
 * (episodic memory, §17, Phase 2). P (latent personality, §9) and B_t
 * (beliefs about people, §18, Phase 3) are still not represented — Score(a)
 * remains documented (model/actions.ts) as the Need term alone until
 * Phase 3/4 add the mechanisms those terms depend on.
 */

import { ConceptKey, NeedId } from '../kernel/canonical';
import { ExpectationSubject } from './types';
import { NeedDef, NeedState, advanceNeedLevel, initialNeedState } from './needs';
import { NeedExpectation, initialExpectation } from './expectation';
import { Rational } from '../kernel/rational';
import { AssociationGraph, emptyGraph } from './associations';
import { MemoryStore, emptyMemoryStore } from './memory';

function expectationKey(subject: ExpectationSubject, needId: NeedId): string {
  return `${subject}|${needId}`;
}

export interface CharacterState {
  readonly characterId: ConceptKey;
  readonly currentTime: number;
  readonly needDefs: ReadonlyMap<NeedId, NeedDef>;
  readonly needStates: ReadonlyMap<NeedId, NeedState>;
  readonly expectations: ReadonlyMap<string, NeedExpectation>;
  readonly associations: AssociationGraph;
  readonly memory: MemoryStore;
}

export function createCharacter(
  characterId: ConceptKey,
  needDefs: readonly NeedDef[],
  initialLevels: ReadonlyMap<NeedId, Rational>,
  conceptUniverse: readonly ConceptKey[] = [],
): CharacterState {
  const defsMap = new Map(needDefs.map((d) => [d.needId, d]));
  const states = new Map(
    needDefs.map((d) => [d.needId, initialNeedState(d, initialLevels.get(d.needId) ?? d.setPoint)]),
  );
  return {
    characterId,
    currentTime: 0,
    needDefs: defsMap,
    needStates: states,
    expectations: new Map(),
    associations: emptyGraph(conceptUniverse),
    memory: emptyMemoryStore(),
  };
}

export function withAssociations(state: CharacterState, associations: AssociationGraph): CharacterState {
  return { ...state, associations };
}

export function withMemory(state: CharacterState, memory: MemoryStore): CharacterState {
  return { ...state, memory };
}

export function getExpectation(
  state: CharacterState,
  subject: ExpectationSubject,
  needId: NeedId,
): NeedExpectation {
  return state.expectations.get(expectationKey(subject, needId)) ?? initialExpectation(0);
}

export function withExpectation(
  state: CharacterState,
  subject: ExpectationSubject,
  needId: NeedId,
  expectation: NeedExpectation,
): CharacterState {
  const next = new Map(state.expectations);
  next.set(expectationKey(subject, needId), expectation);
  return { ...state, expectations: next };
}

/** Advance every Need's Level by Δt (Brief §10), returning a new state with
 * `currentTime` moved forward. This is step 1 of the cognitive cycle
 * (§25) and always runs before any Action is evaluated or applied. */
export function advanceAllNeeds(state: CharacterState, deltaT: Rational): CharacterState {
  const nextStates = new Map(state.needStates);
  for (const [needId, needState] of state.needStates) {
    const def = state.needDefs.get(needId);
    if (!def) continue;
    nextStates.set(needId, advanceNeedLevel(needState, def, deltaT));
  }
  return { ...state, needStates: nextStates, currentTime: state.currentTime };
}

export function withNeedLevel(state: CharacterState, needId: NeedId, level: Rational): CharacterState {
  const existing = state.needStates.get(needId);
  if (!existing) throw new RangeError(`withNeedLevel: unknown Need ${needId}`);
  const next = new Map(state.needStates);
  next.set(needId, { needId, level });
  return { ...state, needStates: next };
}

export function withCurrentTime(state: CharacterState, time: number): CharacterState {
  return { ...state, currentTime: time };
}
