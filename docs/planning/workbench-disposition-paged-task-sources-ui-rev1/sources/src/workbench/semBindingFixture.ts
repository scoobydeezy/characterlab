// Original eventBindings.test.ts helper bodies retained verbatim, without test hooks.
import {authoredReferentKey} from '../test/fixtures/referentOrigin';

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

const action = referent(authoredReferentKey('action.skip-rope'), 'action');
const mina = referent(authoredReferentKey('person.mina'), 'entity');
const glen = referent(authoredReferentKey('person.glen'), 'entity');
const darius = referent(authoredReferentKey('person.darius'), 'entity');
const library = referent(authoredReferentKey('location.library'), 'location');
const pipe = referent(authoredReferentKey('object.lead-pipe'), 'entity', 'striking-capable', 'usable-entity');
const cup = referent(authoredReferentKey('object.cup'), 'drink-container', 'entity', 'usable-entity');

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


function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** Occurrence ordinals are bigints, so leak checks need a bigint-aware serializer. */
function stringifyWithBigInts(value: unknown): string {
  return JSON.stringify(value, (_key, candidate: unknown) => typeof candidate === 'bigint' ? candidate.toString() : candidate);
}

export {referent,action,mina,glen,darius,library,pipe,cup,rule,schema,fixtureSchema,request,fixture,narrowingValidators,minaTrack17};
export const originalSource={path:'src/test/eventBindings.test.ts',sha256:'e46846a30c7dcd5633a367c06830bdeadd193ffa95641d4b124defda9c6411dc'} as const;
