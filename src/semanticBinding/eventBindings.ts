export const EVENT_BINDING_CONTRACT_VERSION = 'semantic-binding/0.1-candidate#SEM-001B' as const;

export const EventRoleId = {
  Action: 'event-role/action',
  Actor: 'event-role/actor',
  Companion: 'event-role/companion',
  Target: 'event-role/target',
  Recipient: 'event-role/recipient',
  Instrument: 'event-role/instrument',
  AffectedEntity: 'event-role/affected-entity',
  Beneficiary: 'event-role/beneficiary',
  Participant: 'event-role/participant',
  Location: 'event-role/location',
} as const;

export type EventRoleId = typeof EventRoleId[keyof typeof EventRoleId];

export interface SemanticReferent {
  readonly semanticReferentId: string;
  readonly domainTags: readonly string[];
}

export interface EventRoleDefinition {
  readonly eventRoleId: EventRoleId;
  readonly broadReferentDomainValidatorId: string;
  readonly definitionVersion: string;
}

export interface ReferentDomainValidator {
  readonly validatorId: string;
  accepts(referent: SemanticReferent): boolean;
}

export type MaxOccurrences =
  | { readonly kind: 'finite'; readonly value: number }
  | { readonly kind: 'unbounded' };

export interface RoleCardinalityRule {
  readonly eventRoleId: EventRoleId;
  readonly minOccurrences: number;
  readonly maxOccurrences: MaxOccurrences;
  readonly referentDomainNarrowingValidatorId?: string;
}

export interface EventTypeBindingSchema {
  readonly eventTypeId: string;
  readonly roleCardinalityRules: readonly RoleCardinalityRule[];
  readonly bindingSchemaVersion: string;
  readonly fixedActionReferentId?: string;
}

export interface EventBindingRequest {
  readonly eventRoleId: EventRoleId;
  readonly semanticReferent: SemanticReferent;
}

export interface EventBinding {
  readonly eventBindingId: bigint;
  readonly eventRoleId: EventRoleId;
  readonly semanticReferent: SemanticReferent;
}

export interface CompiledEventBindings {
  readonly eventTypeId: string;
  readonly bindings: readonly EventBinding[];
  readonly nextRuntimeId: bigint;
}

export interface MaterializedEventBindings {
  readonly eventTypeId: string;
  readonly bindings: readonly EventBinding[];
}

export type EventBindingFailureCode =
  | 'INVALID_ROLE_REGISTRY'
  | 'INVALID_DOMAIN_VALIDATOR'
  | 'INVALID_EVENT_TYPE_SCHEMA'
  | 'UNKNOWN_EVENT_ROLE'
  | 'INVALID_REFERENT'
  | 'REFERENT_DOMAIN_VIOLATION'
  | 'DUPLICATE_BINDING_PAIR'
  | 'ROLE_CARDINALITY_VIOLATION'
  | 'FORBIDDEN_BINDING_FIELD'
  | 'INVALID_ALLOCATOR_STATE';

export class EventBindingContractError extends Error {
  constructor(readonly code: EventBindingFailureCode, message: string) {
    super(message);
    this.name = 'EventBindingContractError';
  }
}

const BROAD_DOMAIN = {
  Action: 'referent-domain/action',
  Entity: 'referent-domain/entity',
  UsableEntity: 'referent-domain/usable-entity',
  Location: 'referent-domain/location',
} as const;

export const INITIAL_EVENT_ROLE_DEFINITIONS: readonly EventRoleDefinition[] = Object.freeze([
  definition(EventRoleId.Action, BROAD_DOMAIN.Action),
  definition(EventRoleId.Actor, BROAD_DOMAIN.Entity),
  definition(EventRoleId.Companion, BROAD_DOMAIN.Entity),
  definition(EventRoleId.Target, BROAD_DOMAIN.Entity),
  definition(EventRoleId.Recipient, BROAD_DOMAIN.Entity),
  definition(EventRoleId.Instrument, BROAD_DOMAIN.UsableEntity),
  definition(EventRoleId.AffectedEntity, BROAD_DOMAIN.Entity),
  definition(EventRoleId.Beneficiary, BROAD_DOMAIN.Entity),
  definition(EventRoleId.Participant, BROAD_DOMAIN.Entity),
  definition(EventRoleId.Location, BROAD_DOMAIN.Location),
].sort((left, right) => compareText(left.eventRoleId, right.eventRoleId)));

export const INITIAL_BROAD_DOMAIN_VALIDATORS: readonly ReferentDomainValidator[] = Object.freeze([
  tagValidator(BROAD_DOMAIN.Action, 'action'),
  tagValidator(BROAD_DOMAIN.Entity, 'entity'),
  tagValidator(BROAD_DOMAIN.Location, 'location'),
  tagValidator(BROAD_DOMAIN.UsableEntity, 'usable-entity'),
].sort((left, right) => compareText(left.validatorId, right.validatorId)));

export function finiteMax(value: number): MaxOccurrences {
  return { kind: 'finite', value };
}

export function unboundedMax(): MaxOccurrences {
  return { kind: 'unbounded' };
}

export function compileEventBindings(
  schema: EventTypeBindingSchema,
  bindingRequests: readonly EventBindingRequest[],
  nextRuntimeId: bigint,
  narrowingValidators: readonly ReferentDomainValidator[] = [],
): CompiledEventBindings {
  if (nextRuntimeId < 0n) fail('INVALID_ALLOCATOR_STATE', 'nextRuntimeId must be nonnegative');
  validateExactKeys(schema, ['eventTypeId', 'roleCardinalityRules', 'bindingSchemaVersion', 'fixedActionReferentId'], 'event type schema');
  validateRoleRegistry();
  const validators = validatorMap([...INITIAL_BROAD_DOMAIN_VALIDATORS, ...narrowingValidators]);
  const rules = validateSchema(schema, validators);
  const canonicalRequests = bindingRequests.map((request, index) => validateBindingRequest(request, index));

  const referents = new Map<string, string>();
  const pairs = new Set<string>();
  const counts = new Map<EventRoleId, number>();
  for (const request of canonicalRequests) {
    const rule = rules.get(request.eventRoleId);
    if (!rule) fail('ROLE_CARDINALITY_VIOLATION', `${request.eventRoleId} is prohibited by ${schema.eventTypeId}`);
    const referentKey = referentSignature(request.semanticReferent);
    const previous = referents.get(request.semanticReferent.semanticReferentId);
    if (previous !== undefined && previous !== referentKey) {
      fail('INVALID_REFERENT', `referent ${request.semanticReferent.semanticReferentId} has inconsistent domain identity`);
    }
    referents.set(request.semanticReferent.semanticReferentId, referentKey);
    const pair = `${request.eventRoleId}\u0000${request.semanticReferent.semanticReferentId}`;
    if (pairs.has(pair)) fail('DUPLICATE_BINDING_PAIR', `duplicate binding pair ${pair}`);
    pairs.add(pair);

    const role = INITIAL_EVENT_ROLE_DEFINITIONS.find((candidate) => candidate.eventRoleId === request.eventRoleId);
    if (!role) fail('UNKNOWN_EVENT_ROLE', `unknown event role ${request.eventRoleId}`);
    const broad = validators.get(role.broadReferentDomainValidatorId);
    if (!broad?.accepts(request.semanticReferent)) {
      fail('REFERENT_DOMAIN_VIOLATION', `${request.semanticReferent.semanticReferentId} violates broad domain for ${request.eventRoleId}`);
    }
    if (rule.referentDomainNarrowingValidatorId) {
      const narrowing = validators.get(rule.referentDomainNarrowingValidatorId);
      if (!narrowing?.accepts(request.semanticReferent)) {
        fail('REFERENT_DOMAIN_VIOLATION', `${request.semanticReferent.semanticReferentId} violates event-type narrowing for ${request.eventRoleId}`);
      }
    }
    counts.set(request.eventRoleId, (counts.get(request.eventRoleId) ?? 0) + 1);
  }

  for (const rule of rules.values()) {
    const count = counts.get(rule.eventRoleId) ?? 0;
    if (count < rule.minOccurrences || (rule.maxOccurrences.kind === 'finite' && count > rule.maxOccurrences.value)) {
      fail('ROLE_CARDINALITY_VIOLATION', `${rule.eventRoleId} count ${count} violates declared cardinality`);
    }
  }

  if (schema.fixedActionReferentId !== undefined && counts.get(EventRoleId.Action)) {
    fail('ROLE_CARDINALITY_VIOLATION', 'an event type that fixes its action referent prohibits an Action binding');
  }

  const sorted = [...canonicalRequests].sort(compareBindingRequests);
  const bindings = sorted.map((request, offset): EventBinding => ({
    eventBindingId: nextRuntimeId + BigInt(offset),
    eventRoleId: request.eventRoleId,
    semanticReferent: cloneReferent(request.semanticReferent),
  }));
  return Object.freeze({
    eventTypeId: schema.eventTypeId,
    bindings: Object.freeze(bindings),
    nextRuntimeId: nextRuntimeId + BigInt(bindings.length),
  });
}

/**
 * Scheduler-facing candidate adapter. Validation and canonical ordering finish
 * before the first allocation; the accepted whole-instant scheduler owns
 * rollback if a later staged boundary fails.
 */
export function materializeEventBindings(
  schema: EventTypeBindingSchema,
  bindingRequests: readonly EventBindingRequest[],
  allocateRuntimeId: () => bigint,
  narrowingValidators: readonly ReferentDomainValidator[] = [],
): MaterializedEventBindings {
  const validated = compileEventBindings(schema, bindingRequests, 0n, narrowingValidators);
  const allocated = new Set<bigint>();
  const bindings = validated.bindings.map((binding): EventBinding => {
    const eventBindingId = allocateRuntimeId();
    if (eventBindingId < 0n || allocated.has(eventBindingId)) {
      fail('INVALID_ALLOCATOR_STATE', 'runtime allocator returned a negative or reused identity');
    }
    allocated.add(eventBindingId);
    return Object.freeze({ ...binding, eventBindingId });
  });
  return Object.freeze({ eventTypeId: validated.eventTypeId, bindings: Object.freeze(bindings) });
}

export type PermittedRoleObservation =
  | { readonly kind: 'preserve' }
  | { readonly kind: 'coarsen-to-participant' }
  | { readonly kind: 'unresolved' }
  | { readonly kind: 'omit' };

export type EventRoleEvidence =
  | { readonly kind: 'exact'; readonly eventRoleId: EventRoleId }
  | { readonly kind: 'unresolved' };

export interface PerceivedRoleProjection {
  readonly perceptualReferentId: string;
  readonly eventRoleEvidence: EventRoleEvidence;
}

const PARTICIPANT_COARSENABLE = new Set<EventRoleId>([
  EventRoleId.Actor,
  EventRoleId.Companion,
  EventRoleId.Target,
  EventRoleId.Recipient,
  EventRoleId.AffectedEntity,
  EventRoleId.Beneficiary,
  EventRoleId.Participant,
]);

export function projectEventRoleEvidence(
  binding: EventBinding,
  perceptualReferentId: string,
  permittedObservation: PermittedRoleObservation,
): PerceivedRoleProjection | undefined {
  if (!perceptualReferentId) fail('INVALID_REFERENT', 'perceptualReferentId must be nonempty');
  switch (permittedObservation.kind) {
    case 'omit': return undefined;
    case 'unresolved': return Object.freeze({ perceptualReferentId, eventRoleEvidence: Object.freeze({ kind: 'unresolved' }) });
    case 'preserve': return Object.freeze({
      perceptualReferentId,
      eventRoleEvidence: Object.freeze({ kind: 'exact', eventRoleId: binding.eventRoleId }),
    });
    case 'coarsen-to-participant':
      if (!PARTICIPANT_COARSENABLE.has(binding.eventRoleId)) {
        fail('REFERENT_DOMAIN_VIOLATION', `${binding.eventRoleId} cannot coarsen to Participant`);
      }
      return Object.freeze({
        perceptualReferentId,
        eventRoleEvidence: Object.freeze({ kind: 'exact', eventRoleId: EventRoleId.Participant }),
      });
  }
}

export function semanticEventGrammar(bindings: readonly EventBinding[]): readonly string[] {
  return Object.freeze(bindings
    .map((binding) => `${binding.eventRoleId}=${binding.semanticReferent.semanticReferentId}`)
    .sort());
}

function validateRoleRegistry(): void {
  const ids = new Set<string>();
  for (const role of INITIAL_EVENT_ROLE_DEFINITIONS) {
    if (ids.has(role.eventRoleId)) fail('INVALID_ROLE_REGISTRY', `duplicate role ${role.eventRoleId}`);
    ids.add(role.eventRoleId);
  }
  if (ids.has('event-role/context')) fail('INVALID_ROLE_REGISTRY', 'generic Context is forbidden in version 0.1');
}

function validateSchema(
  schema: EventTypeBindingSchema,
  validators: ReadonlyMap<string, ReferentDomainValidator>,
): ReadonlyMap<EventRoleId, RoleCardinalityRule> {
  if (!schema.eventTypeId || !schema.bindingSchemaVersion) fail('INVALID_EVENT_TYPE_SCHEMA', 'event type and schema version must be nonempty');
  if (schema.fixedActionReferentId !== undefined && !schema.fixedActionReferentId) {
    fail('INVALID_EVENT_TYPE_SCHEMA', 'fixed action referent must be nonempty when present');
  }
  const rules = new Map<EventRoleId, RoleCardinalityRule>();
  let prior = '';
  for (const rule of schema.roleCardinalityRules) {
    validateExactKeys(rule, ['eventRoleId', 'minOccurrences', 'maxOccurrences', 'referentDomainNarrowingValidatorId'], 'role cardinality rule');
    if (!isEventRoleId(rule.eventRoleId)) fail('UNKNOWN_EVENT_ROLE', `unknown event role ${String(rule.eventRoleId)}`);
    if (rule.eventRoleId <= prior) fail('INVALID_EVENT_TYPE_SCHEMA', 'role cardinality rules must be strictly canonical');
    prior = rule.eventRoleId;
    if (!Number.isSafeInteger(rule.minOccurrences) || rule.minOccurrences < 0) {
      fail('INVALID_EVENT_TYPE_SCHEMA', 'minimum occurrence count must be a nonnegative safe integer');
    }
    validateMax(rule.maxOccurrences, rule.minOccurrences);
    if (rule.referentDomainNarrowingValidatorId && !validators.has(rule.referentDomainNarrowingValidatorId)) {
      fail('INVALID_DOMAIN_VALIDATOR', `unknown narrowing validator ${rule.referentDomainNarrowingValidatorId}`);
    }
    rules.set(rule.eventRoleId, rule);
  }
  if (schema.fixedActionReferentId !== undefined) {
    const action = rules.get(EventRoleId.Action);
    if (action && (action.minOccurrences !== 0 || action.maxOccurrences.kind === 'unbounded' || action.maxOccurrences.value !== 0)) {
      fail('INVALID_EVENT_TYPE_SCHEMA', 'fixed-action event schema must prohibit Action bindings');
    }
  }
  return rules;
}

function validateBindingRequest(request: EventBindingRequest, index: number): EventBindingRequest {
  validateExactKeys(request, ['eventRoleId', 'semanticReferent'], `binding request ${index}`);
  if (!isEventRoleId(request.eventRoleId)) fail('UNKNOWN_EVENT_ROLE', `unknown event role ${String(request.eventRoleId)}`);
  validateExactKeys(request.semanticReferent, ['semanticReferentId', 'domainTags'], `semantic referent ${index}`);
  if (!request.semanticReferent.semanticReferentId) fail('INVALID_REFERENT', 'semantic referent ID must be nonempty');
  let prior = '';
  for (const tag of request.semanticReferent.domainTags) {
    if (!tag || tag <= prior) fail('INVALID_REFERENT', 'domain tags must be nonempty, unique, and strictly canonical');
    prior = tag;
  }
  return request;
}

function validatorMap(validators: readonly ReferentDomainValidator[]): ReadonlyMap<string, ReferentDomainValidator> {
  const result = new Map<string, ReferentDomainValidator>();
  for (const validator of validators) {
    if (!validator.validatorId || result.has(validator.validatorId)) {
      fail('INVALID_DOMAIN_VALIDATOR', `duplicate or empty validator ${validator.validatorId}`);
    }
    result.set(validator.validatorId, validator);
  }
  return result;
}

function validateMax(max: MaxOccurrences, minimum: number): void {
  validateExactKeys(max, max.kind === 'finite' ? ['kind', 'value'] : ['kind'], 'maximum occurrences');
  if (max.kind === 'unbounded') return;
  if (max.kind !== 'finite' || !Number.isSafeInteger(max.value) || max.value < minimum) {
    fail('INVALID_EVENT_TYPE_SCHEMA', 'finite maximum must be a safe integer no smaller than the minimum');
  }
}

function validateExactKeys(value: object, allowed: readonly string[], description: string): void {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(value)) {
    if (!allowedSet.has(key)) fail('FORBIDDEN_BINDING_FIELD', `${description} contains forbidden field ${key}`);
  }
}

function compareBindingRequests(left: EventBindingRequest, right: EventBindingRequest): number {
  return compareText(left.eventRoleId, right.eventRoleId)
    || compareText(left.semanticReferent.semanticReferentId, right.semanticReferent.semanticReferentId);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function cloneReferent(referent: SemanticReferent): SemanticReferent {
  return Object.freeze({ semanticReferentId: referent.semanticReferentId, domainTags: Object.freeze([...referent.domainTags]) });
}

function referentSignature(referent: SemanticReferent): string {
  return `${referent.semanticReferentId}\u0000${referent.domainTags.join('\u0000')}`;
}

function isEventRoleId(value: unknown): value is EventRoleId {
  return typeof value === 'string' && Object.values(EventRoleId).includes(value as EventRoleId);
}

function definition(eventRoleId: EventRoleId, broadReferentDomainValidatorId: string): EventRoleDefinition {
  return Object.freeze({ eventRoleId, broadReferentDomainValidatorId, definitionVersion: 'event-role/0.1-candidate' });
}

function tagValidator(validatorId: string, requiredTag: string): ReferentDomainValidator {
  return Object.freeze({ validatorId, accepts: (referent: SemanticReferent) => referent.domainTags.includes(requiredTag) });
}

function fail(code: EventBindingFailureCode, message: string): never {
  throw new EventBindingContractError(code, message);
}
