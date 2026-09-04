import { describe, expect, it } from 'vitest';
import { bytesToHex, canonicalEncode, list, text, typedIdentifier, type CanonicalValue } from '../substrate/canonicalEncoding';
import { DeterministicScheduler, type EventHandler, type StateAdapter } from '../substrate/scheduler';
import { simInstant } from '../substrate/time';
import {
  EventBindingContractError,
  EventRoleId,
  INITIAL_EVENT_ROLE_DEFINITIONS,
  compileEventBindings,
  finiteMax,
  materializeEventBindings,
  projectEventRoleEvidence,
  semanticEventGrammar,
  unboundedMax,
  type EventBindingRequest,
  type EventRoleId as EventRoleIdType,
  type EventTypeBindingSchema,
  type ReferentDomainValidator,
  type RoleCardinalityRule,
  type SemanticReferent,
} from '../semanticBinding/eventBindings';

const referent = (semanticReferentId: string, ...domainTags: string[]): SemanticReferent => ({
  semanticReferentId,
  domainTags: [...domainTags].sort(compareText),
});

const action = referent('action.skip-rope', 'action');
const mina = referent('person.mina', 'entity');
const glen = referent('person.glen', 'entity');
const darius = referent('person.darius', 'entity');
const library = referent('location.library', 'location');
const pipe = referent('object.lead-pipe', 'entity', 'striking-capable', 'usable-entity');
const cup = referent('object.cup', 'drink-container', 'entity', 'usable-entity');

const rule = (
  eventRoleId: EventRoleIdType,
  minOccurrences: number,
  maxOccurrences: ReturnType<typeof finiteMax> | ReturnType<typeof unboundedMax>,
  referentDomainNarrowingValidatorId?: string,
): RoleCardinalityRule => ({ eventRoleId, minOccurrences, maxOccurrences, referentDomainNarrowingValidatorId });

const schema = (
  eventTypeId: string,
  rules: readonly RoleCardinalityRule[],
  fixedActionReferentId?: string,
): EventTypeBindingSchema => ({
  eventTypeId,
  roleCardinalityRules: [...rules].sort((left, right) => compareText(left.eventRoleId, right.eventRoleId)),
  bindingSchemaVersion: 'event-type-bindings/0.1-candidate',
  fixedActionReferentId,
});

const fixtureSchema = schema('event-type/action-occurrence', [
  rule(EventRoleId.Action, 1, finiteMax(1)),
  rule(EventRoleId.Actor, 1, finiteMax(1)),
  rule(EventRoleId.Companion, 1, unboundedMax()),
  rule(EventRoleId.Instrument, 1, finiteMax(1)),
  rule(EventRoleId.Location, 1, finiteMax(1)),
]);

const request = (eventRoleId: EventRoleIdType, semanticReferent: SemanticReferent): EventBindingRequest => ({
  eventRoleId,
  semanticReferent,
});

const fixture = (companions: readonly SemanticReferent[] = [glen]): readonly EventBindingRequest[] => [
  request(EventRoleId.Action, action),
  request(EventRoleId.Actor, mina),
  ...companions.map((companion) => request(EventRoleId.Companion, companion)),
  request(EventRoleId.Instrument, pipe),
  request(EventRoleId.Location, library),
];

const narrowingValidators: readonly ReferentDomainValidator[] = [
  { validatorId: 'domain/drink-container', accepts: (candidate) => candidate.domainTags.includes('drink-container') },
  { validatorId: 'domain/striking-capable', accepts: (candidate) => candidate.domainTags.includes('striking-capable') },
];

const minaTrack17 = { observerId: 'character/mina', observerTrackSequence: 17n };

describe('SEM-001B event-binding occurrence and role conformance', () => {
  it('CV-SEM-023 preserves one referent in several roles as distinct occurrences', () => {
    const multiRoleSchema = schema('event-type/multi-role-control', [
      rule(EventRoleId.Actor, 1, finiteMax(1)),
      rule(EventRoleId.Companion, 1, finiteMax(1)),
    ]);
    const compiled = compileEventBindings(multiRoleSchema, [
      request(EventRoleId.Companion, glen),
      request(EventRoleId.Actor, glen),
    ], 40n);
    expect(compiled.bindings).toHaveLength(2);
    expect(new Set(compiled.bindings.map((binding) => binding.eventBindingId)).size).toBe(2);
    expect(compiled.bindings.map((binding) => binding.eventRoleId).sort(compareText))
      .toEqual([EventRoleId.Actor, EventRoleId.Companion].sort(compareText));
  });

  it('CV-SEM-024 preserves several referents in one repeatable role without overwrite', () => {
    const compiled = compileEventBindings(fixtureSchema, fixture([glen, darius]), 70n);
    const companions = compiled.bindings.filter((binding) => binding.eventRoleId === EventRoleId.Companion);
    expect(companions.map((binding) => binding.semanticReferent.semanticReferentId).sort(compareText))
      .toEqual(['person.darius', 'person.glen']);
    expect(new Set(companions.map((binding) => binding.eventBindingId)).size).toBe(2);
  });

  it('CV-SEM-025 makes cardinality and referent-domain narrowing event-type specific and never widening', () => {
    const strike = schema('event-type/strike', [
      rule(EventRoleId.Instrument, 1, finiteMax(1), 'domain/striking-capable'),
    ]);
    const drink = schema('event-type/drink', [
      rule(EventRoleId.Instrument, 1, finiteMax(2), 'domain/drink-container'),
    ]);
    expect(compileEventBindings(strike, [request(EventRoleId.Instrument, pipe)], 0n, narrowingValidators).bindings).toHaveLength(1);
    expect(compileEventBindings(drink, [request(EventRoleId.Instrument, cup)], 0n, narrowingValidators).bindings).toHaveLength(1);
    expect(() => compileEventBindings(drink, [request(EventRoleId.Instrument, pipe)], 0n, narrowingValidators))
      .toThrowError(expect.objectContaining({ code: 'REFERENT_DOMAIN_VIOLATION' }));

    const notGloballyUsable = referent('object.decorative-hammer', 'entity', 'striking-capable');
    expect(() => compileEventBindings(strike, [request(EventRoleId.Instrument, notGloballyUsable)], 0n, narrowingValidators))
      .toThrowError(expect.objectContaining({ code: 'REFERENT_DOMAIN_VIOLATION' }));
  });

  it('CV-SEM-026 rejects invalid inputs before allocation and rolls successful allocation back on later instant failure', async () => {
    const start = 90n;
    const invalidCases: Array<() => unknown> = [
      () => compileEventBindings(fixtureSchema, fixture([]), start),
      () => compileEventBindings(fixtureSchema, [...fixture(), request(EventRoleId.Instrument, cup)], start),
      () => compileEventBindings(fixtureSchema, [...fixture(), request(EventRoleId.Beneficiary, glen)], start),
      () => compileEventBindings(fixtureSchema, fixture().map((candidate) => candidate.eventRoleId === EventRoleId.Instrument
        ? request(EventRoleId.Instrument, referent('weather.rain', 'weather')) : candidate), start),
      () => compileEventBindings({ ...fixtureSchema, roleCardinalityRules: [...fixtureSchema.roleCardinalityRules].reverse() }, fixture(), start),
      () => compileEventBindings(fixtureSchema, [
        ...fixture(),
        { eventRoleId: 'event-role/context' as EventRoleIdType, semanticReferent: glen },
      ], start),
    ];
    for (const invalid of invalidCases) {
      expect(invalid).toThrow(EventBindingContractError);
      expect(start).toBe(90n);
    }

    interface FixtureState { readonly valid: boolean }
    const adapter: StateAdapter<FixtureState> = {
      clone: (state) => ({ ...state }),
      validate: (state) => { if (!state.valid) throw new Error('injected post-allocation state failure'); },
      canonicalValue: (state) => state.valid,
    };
    const handlerId = typedIdentifier(26000n, text('event/sem-001b-rollback'));
    const handlerKey = bytesToHex(canonicalEncode(handlerId));
    const handler: EventHandler<FixtureState> = ({ allocateRuntimeId }) => {
      const materialized = materializeEventBindings(fixtureSchema, fixture(), allocateRuntimeId);
      expect(materialized.bindings[0].eventBindingId).toBe(90n);
      return { nextState: { valid: false }, emittedEvents: [], traceContributions: [], outputs: [] };
    };
    const scheduler = new DeterministicScheduler({
      initialState: { valid: true },
      stateAdapter: adapter,
      handlers: new Map([[handlerKey, handler]]),
      maxSettlementWorkPerSimulationInstant: 10n,
      initialAllocators: { nextRuntimeId: start, nextEventId: 0n, nextEventSequence: 0n },
    });
    scheduler.schedule({
      dueAt: simInstant(1n), phase: 10n, eventTypeId: handlerId, payload: list([]), dependencies: list([]),
    });
    const before = scheduler.getAllocatorState();
    await expect(scheduler.settleNextInstant()).rejects.toThrow(/injected post-allocation state failure/);
    expect(scheduler.getAllocatorState()).toEqual(before);
  });

  it('CV-SEM-027 preserves allocated occurrence identity across replay while ordinals remain semantically opaque', () => {
    const first = compileEventBindings(fixtureSchema, fixture(), 100n);
    const reordered = compileEventBindings(fixtureSchema, [...fixture()].reverse(), 100n);
    const shifted = compileEventBindings(fixtureSchema, fixture(), 900n);
    expect(structuredClone(first)).toEqual(first);
    expect(reordered).toEqual(first);
    expect(first.bindings.map((binding) => binding.eventBindingId)).toEqual([100n, 101n, 102n, 103n, 104n]);
    expect(first.nextRuntimeId).toBe(105n);
    expect(new Set(first.bindings.map((binding) => binding.eventBindingId)).size).toBe(first.bindings.length);
    expect(semanticEventGrammar(first.bindings)).toEqual(semanticEventGrammar(shifted.bindings));
    expect(first.bindings.map((binding) => binding.eventBindingId)).not.toEqual(shifted.bindings.map((binding) => binding.eventBindingId));
  });

  it('CV-SEM-028 keeps event roles separate from causal roles and gives registry order no weight', () => {
    const roleIds = INITIAL_EVENT_ROLE_DEFINITIONS.map((definition) => definition.eventRoleId);
    expect(roleIds).toContain(EventRoleId.Beneficiary);
    expect(roleIds).not.toContain('event-role/context');
    expect(roleIds).not.toContain('causal-role/cause');
    expect(() => compileEventBindings(fixtureSchema, [
      ...fixture().slice(1),
      { eventRoleId: 5 as unknown as EventRoleIdType, semanticReferent: action },
    ], 0n)).toThrowError(expect.objectContaining({ code: 'UNKNOWN_EVENT_ROLE' }));

    const grammar = semanticEventGrammar(compileEventBindings(fixtureSchema, fixture(), 0n).bindings);
    expect(grammar).toEqual([...grammar].sort(compareText));
    expect(grammar.every((entry) => !entry.includes('weight') && !entry.includes('salience'))).toBe(true);
  });

  it('CV-SEM-029 exposes only permitted role evidence, never truth binding identity or automatic specificity', () => {
    const companion = compileEventBindings(fixtureSchema, fixture(), 200n).bindings
      .find((binding) => binding.eventRoleId === EventRoleId.Companion);
    if (!companion) throw new Error('fixture companion missing');

    const preserved = projectEventRoleEvidence(companion, minaTrack17, { kind: 'preserve' });
    const coarsened = projectEventRoleEvidence(companion, minaTrack17, { kind: 'coarsen-to-participant' });
    const unresolved = projectEventRoleEvidence(companion, minaTrack17, { kind: 'unresolved' });
    const omitted = projectEventRoleEvidence(companion, minaTrack17, { kind: 'omit' });
    expect(preserved?.eventRoleEvidence).toEqual({ kind: 'exact', eventRoleId: EventRoleId.Companion });
    expect(coarsened?.eventRoleEvidence).toEqual({ kind: 'exact', eventRoleId: EventRoleId.Participant });
    expect(unresolved?.eventRoleEvidence).toEqual({ kind: 'unresolved' });
    expect(omitted).toBeUndefined();
    for (const projection of [preserved, coarsened, unresolved]) {
      expect(projection).not.toHaveProperty('eventBindingId');
      expect(projection).not.toHaveProperty('semanticReferent');
      expect(stringifyWithBigInts(projection)).not.toContain('person.glen');
    }
  });

  it('CV-SEM-030 rejects duplicate opaque occurrences, qualifiers, and redundant Action bindings', () => {
    expect(() => compileEventBindings(fixtureSchema, [...fixture(), request(EventRoleId.Companion, glen)], 0n))
      .toThrowError(expect.objectContaining({ code: 'DUPLICATE_BINDING_PAIR' }));
    const qualified = { ...request(EventRoleId.Companion, glen), qualifiers: ['nearby'] } as EventBindingRequest;
    expect(() => compileEventBindings(fixtureSchema, [
      ...fixture().filter((candidate) => candidate.eventRoleId !== EventRoleId.Companion),
      qualified,
    ], 0n)).toThrowError(expect.objectContaining({ code: 'FORBIDDEN_BINDING_FIELD' }));

    const fixedAction = schema('event-type/skip-rope-fixed', [rule(EventRoleId.Actor, 1, finiteMax(1))], 'action.skip-rope');
    expect(compileEventBindings(fixedAction, [request(EventRoleId.Actor, mina)], 0n).bindings).toHaveLength(1);
    expect(() => compileEventBindings(fixedAction, [
      request(EventRoleId.Actor, mina),
      request(EventRoleId.Action, action),
    ], 0n)).toThrowError(expect.objectContaining({ code: 'ROLE_CARDINALITY_VIOLATION' }));
  });
});

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** Occurrence ordinals are bigints, so leak checks need a bigint-aware serializer. */
function stringifyWithBigInts(value: unknown): string {
  return JSON.stringify(value, (_key, candidate: unknown) => typeof candidate === 'bigint' ? candidate.toString() : candidate);
}
