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
import { IdentityExpressionChannelId, IdentityEvidenceState, EMPTY_IDENTITY_EVIDENCE } from './identity';
import { DecisionExpression } from './decision';

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
  /** Phase 2.9 — accumulated Support/Opposition evidence per
   * IdentityExpressionChannel (model/identity.ts). Absent channels default
   * to {support:0, opposition:0} via `getIdentityEvidence` below, mirroring
   * `getExpectation`'s `?? initialExpectation(0)` fallback. */
  readonly identityEvidence: ReadonlyMap<IdentityExpressionChannelId, IdentityEvidenceState>;
  /** Phase 2.9 — every resolved Decision's immutable DecisionExpression, in
   * occurrence order. Needed for Experiments F-K's "inspect prior
   * decisions" checks and Brief §36's full-inspectability requirement.
   * Unbounded growth is accepted, matching the brief's own "only one
   * research character" cost argument (§9) — no cap. */
  readonly decisionHistory: readonly DecisionExpression[];
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
    identityEvidence: new Map(),
    decisionHistory: [],
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

/** Phase 2.9 — mirrors `getExpectation`'s `?? initialExpectation(0)`
 * fallback: a channel with no recorded evidence yet reads as
 * {support:0, opposition:0} rather than requiring every channel to be
 * pre-populated. */
export function getIdentityEvidence(state: CharacterState, channel: IdentityExpressionChannelId): IdentityEvidenceState {
  return state.identityEvidence.get(channel) ?? EMPTY_IDENTITY_EVIDENCE;
}

export function withIdentityEvidence(
  state: CharacterState,
  channel: IdentityExpressionChannelId,
  evidence: IdentityEvidenceState,
): CharacterState {
  const next = new Map(state.identityEvidence);
  next.set(channel, evidence);
  return { ...state, identityEvidence: next };
}

export function withDecisionExpression(state: CharacterState, expression: DecisionExpression): CharacterState {
  return { ...state, decisionHistory: [...state.decisionHistory, expression] };
}
