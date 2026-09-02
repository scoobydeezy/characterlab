import {
  bytesToHex,
  canonicalEncode,
  list,
  rational,
  record,
  signed,
  text,
  unsigned,
  type CanonicalValue,
  type RecordSchema,
  type TypedIdentifierValue,
} from '../substrate/canonicalEncoding';
import { ExactRational } from '../substrate/exactMath';
import type { SimInstant } from '../substrate/time';

export const OBSERVATION_CONTRACT_VERSION = 'observation/0.1-candidate' as const;

export const observationSchemas = {
  boundedEffectTruth: schema(200n, 'BoundedEffectTruth', ['Before', 'PotentialEffect', 'Applied', 'Overflow', 'After', 'Minimum', 'Maximum', 'EffectProvenance', 'TruthRecordId']),
  observationChannel: schema(201n, 'ObservationChannel', ['ObservationChannelId', 'ObserverId', 'SubjectId', 'ModalityId', 'UnitId', 'PolarityId', 'MeasurementModeId', 'Precision', 'VisibleProvenanceSlotIds', 'MissingnessRuleId', 'ExperimentalControlIdPresence', 'ExperimentalControlId']),
  missingObservation: schema(202n, 'MissingObservation', ['ObservationId', 'ObserverId', 'SubjectId', 'ObservationChannelId', 'OccurredAt', 'MissingnessRuleId']),
  presentObservation: schema(203n, 'PresentObservation', ['ObservationId', 'ObserverId', 'SubjectId', 'ObservationChannelId', 'OccurredAt', 'MeasurementInterval', 'EvidenceKindId', 'Precision', 'PerceivedConceptTokens', 'SafeSourceReferences', 'TransformationVersion']),
  measurementInterval: schema(204n, 'MeasurementInterval', ['LowerPresence', 'Lower', 'UpperPresence', 'Upper']),
  perceivedConceptToken: schema(205n, 'PerceivedConceptToken', ['ConceptId', 'CausalRoleId', 'VisibleProvenanceSlotId']),
  effectProvenanceTruth: schema(207n, 'EffectProvenanceTruth', ['Slots']),
  effectProvenanceSlot: schema(208n, 'EffectProvenanceSlot', ['SlotId', 'ConceptIds']),
  thinSemanticExperience: schema(209n, 'ThinSemanticExperience', ['ExperienceId', 'ObserverId', 'OccurredAt', 'PresentObservations', 'TransformationVersion']),
} as const;

export const EvidenceKindId = { Point: 1n, LowerBound: 2n, UpperBound: 3n } as const;
export const PolarityId = { Increase: 1n, Decrease: 2n, Signed: 3n } as const;
export const MeasurementModeId = { BoundedStateChange: 1n, ExactEffectControl: 2n } as const;
export const MissingnessRuleId = { AlwaysPresent: 1n, AlwaysMissing: 2n } as const;
export const CausalRoleId = { Cause: 1n, Actor: 2n, Target: 3n, Recipient: 4n, Instrument: 5n, AffectedEntity: 6n, Participant: 7n, Location: 8n, Context: 9n, Incidental: 10n } as const;

export const PROVENANCE_SLOT_REGISTRY = [
  { slotId: 1n, roleId: CausalRoleId.Cause },
  { slotId: 2n, roleId: CausalRoleId.Cause },
  { slotId: 3n, roleId: CausalRoleId.Actor },
  { slotId: 4n, roleId: CausalRoleId.Target },
  { slotId: 5n, roleId: CausalRoleId.Recipient },
  { slotId: 6n, roleId: CausalRoleId.Instrument },
  { slotId: 7n, roleId: CausalRoleId.AffectedEntity },
  { slotId: 8n, roleId: CausalRoleId.Participant },
  { slotId: 9n, roleId: CausalRoleId.Location },
  { slotId: 10n, roleId: CausalRoleId.Context },
  { slotId: 11n, roleId: CausalRoleId.Incidental },
] as const;

export interface EffectProvenanceTruth {
  readonly slots: ReadonlyMap<bigint, readonly TypedIdentifierValue[]>;
}

export interface BoundedEffectTruth {
  readonly before: ExactRational;
  readonly potentialEffect: ExactRational;
  readonly applied: ExactRational;
  readonly overflow: ExactRational;
  readonly after: ExactRational;
  readonly minimum: ExactRational;
  readonly maximum: ExactRational;
  readonly provenance: EffectProvenanceTruth;
  readonly truthRecordId: TypedIdentifierValue;
}

export interface ObservationChannel {
  readonly observationChannelId: TypedIdentifierValue;
  readonly observerId: TypedIdentifierValue;
  readonly subjectId: TypedIdentifierValue;
  readonly modalityId: TypedIdentifierValue;
  readonly unitId: TypedIdentifierValue;
  readonly polarityId: bigint;
  readonly measurementModeId: bigint;
  readonly precision: ExactRational;
  readonly visibleProvenanceSlotIds: readonly bigint[];
  readonly missingnessRuleId: bigint;
  readonly experimentalControlId?: TypedIdentifierValue;
}

export interface MeasurementInterval {
  readonly lower?: ExactRational;
  readonly upper?: ExactRational;
}

export interface PerceivedConceptToken {
  readonly conceptId: TypedIdentifierValue;
  readonly causalRoleId: bigint;
  readonly visibleProvenanceSlotId: bigint;
}

export type PermittedEvidence = MissingObservation | PresentObservation;

export interface MissingObservation {
  readonly kind: 'missing';
  readonly observationId: TypedIdentifierValue;
  readonly observerId: TypedIdentifierValue;
  readonly subjectId: TypedIdentifierValue;
  readonly observationChannelId: TypedIdentifierValue;
  readonly occurredAt: SimInstant;
  readonly missingnessRuleId: bigint;
}

export interface PresentObservation {
  readonly kind: 'present';
  readonly observationId: TypedIdentifierValue;
  readonly observerId: TypedIdentifierValue;
  readonly subjectId: TypedIdentifierValue;
  readonly observationChannelId: TypedIdentifierValue;
  readonly occurredAt: SimInstant;
  readonly measurementInterval: MeasurementInterval;
  readonly evidenceKindId: bigint;
  readonly precision: ExactRational;
  readonly perceivedConceptTokens: readonly PerceivedConceptToken[];
  readonly safeSourceReferences: readonly TypedIdentifierValue[];
  readonly transformationVersion: string;
}

export class ObservationContractError extends Error {
  constructor(readonly code: ObservationFailureCode, message: string) {
    super(message);
    this.name = 'ObservationContractError';
  }
}

export type ObservationFailureCode = 'INVALID_TRUTH' | 'INVALID_CHANNEL' | 'AMBIGUOUS_SIGNED_ZERO' | 'INVALID_PROVENANCE';

export function compilePermittedEvidence(
  truth: BoundedEffectTruth,
  channel: ObservationChannel,
  observationId: TypedIdentifierValue,
  occurredAt: SimInstant,
): PermittedEvidence {
  validateTruth(truth);
  validateChannel(channel);
  if (channel.missingnessRuleId === MissingnessRuleId.AlwaysMissing) {
    return {
      kind: 'missing', observationId, observerId: channel.observerId, subjectId: channel.subjectId,
      observationChannelId: channel.observationChannelId, occurredAt, missingnessRuleId: channel.missingnessRuleId,
    };
  }
  const interval = channel.measurementModeId === MeasurementModeId.ExactEffectControl
    ? { lower: truth.potentialEffect, upper: truth.potentialEffect }
    : boundedStateChangeInterval(truth, channel.polarityId);
  const evidenceKindId = classifyInterval(interval);
  return {
    kind: 'present', observationId, observerId: channel.observerId, subjectId: channel.subjectId,
    observationChannelId: channel.observationChannelId, occurredAt, measurementInterval: interval,
    evidenceKindId, precision: channel.precision,
    perceivedConceptTokens: projectVisibleConcepts(truth.provenance, channel.visibleProvenanceSlotIds),
    safeSourceReferences: [truth.truthRecordId], transformationVersion: OBSERVATION_CONTRACT_VERSION,
  };
}

export function permittedEvidenceValue(evidence: PermittedEvidence): CanonicalValue {
  if (evidence.kind === 'missing') {
    return requiredRecord(observationSchemas.missingObservation, [
      evidence.observationId, evidence.observerId, evidence.subjectId, evidence.observationChannelId,
      signed(evidence.occurredAt), unsigned(evidence.missingnessRuleId),
    ]);
  }
  if (classifyInterval(evidence.measurementInterval) !== evidence.evidenceKindId) {
    observationFail('INVALID_CHANNEL', 'EvidenceKind does not match MeasurementInterval');
  }
  return requiredRecord(observationSchemas.presentObservation, [
    evidence.observationId, evidence.observerId, evidence.subjectId, evidence.observationChannelId,
    signed(evidence.occurredAt), measurementIntervalValue(evidence.measurementInterval), unsigned(evidence.evidenceKindId),
    exactValue(evidence.precision), list(evidence.perceivedConceptTokens.map(perceivedConceptTokenValue)),
    list(canonicalSort(evidence.safeSourceReferences)), text(evidence.transformationVersion),
  ]);
}

export function restoreBoundedEffectTruth(value: CanonicalValue): BoundedEffectTruth {
  const truth = requireRecord(value, observationSchemas.boundedEffectTruth);
  const result: BoundedEffectTruth = {
    before: requireExact(field(truth, 1n)), potentialEffect: requireExact(field(truth, 2n)),
    applied: requireExact(field(truth, 3n)), overflow: requireExact(field(truth, 4n)),
    after: requireExact(field(truth, 5n)), minimum: requireExact(field(truth, 6n)), maximum: requireExact(field(truth, 7n)),
    provenance: restoreProvenance(field(truth, 8n)), truthRecordId: requireTypedIdentifier(field(truth, 9n)),
  };
  validateTruth(result);
  return result;
}

export function observationChannelValue(channel: ObservationChannel): CanonicalValue {
  validateChannel(channel);
  return requiredRecord(observationSchemas.observationChannel, [
    channel.observationChannelId, channel.observerId, channel.subjectId, channel.modalityId, channel.unitId,
    unsigned(channel.polarityId), unsigned(channel.measurementModeId), exactValue(channel.precision),
    list(channel.visibleProvenanceSlotIds.map(unsigned)), unsigned(channel.missingnessRuleId),
    channel.experimentalControlId !== undefined, channel.experimentalControlId ?? false,
  ]);
}

export function restoreObservationChannel(value: CanonicalValue): ObservationChannel {
  const channel = requireRecord(value, observationSchemas.observationChannel);
  const controlPresent = requireBoolean(field(channel, 11n));
  const controlValue = field(channel, 12n);
  if (!controlPresent && controlValue !== false) observationFail('INVALID_CHANNEL', 'absent experimental control must use false sentinel');
  const result: ObservationChannel = {
    observationChannelId: requireTypedIdentifier(field(channel, 1n)), observerId: requireTypedIdentifier(field(channel, 2n)),
    subjectId: requireTypedIdentifier(field(channel, 3n)), modalityId: requireTypedIdentifier(field(channel, 4n)),
    unitId: requireTypedIdentifier(field(channel, 5n)), polarityId: requireUnsigned(field(channel, 6n)),
    measurementModeId: requireUnsigned(field(channel, 7n)), precision: requireExact(field(channel, 8n)),
    visibleProvenanceSlotIds: requireList(field(channel, 9n)).map(requireUnsigned),
    missingnessRuleId: requireUnsigned(field(channel, 10n)),
    experimentalControlId: controlPresent ? requireTypedIdentifier(controlValue) : undefined,
  };
  validateChannel(result);
  return result;
}

/** Rejects wrapper/control records that smuggle truth alongside otherwise valid evidence. */
export function validatePermittedEvidenceRecordClosure(value: CanonicalValue): void {
  if (typeof value === 'boolean' || value.kind !== 'record') {
    observationFail('INVALID_CHANNEL', 'character evidence root must be MissingObservation or PresentObservation');
  }
  const root = value;
  if (![observationSchemas.missingObservation.typeId, observationSchemas.presentObservation.typeId].includes(root.schema.typeId as 202n | 203n)) {
    observationFail('INVALID_CHANNEL', 'character evidence root must be MissingObservation or PresentObservation');
  }
  if (root.schema.typeId === observationSchemas.presentObservation.typeId) validatePresentObservationRecord(root);
  else validateMissingObservationRecord(root);
  const visit = (candidate: CanonicalValue): void => {
    if (typeof candidate === 'boolean') return;
    if (candidate.kind === 'record') {
      if (![202n, 203n, 204n, 205n].includes(candidate.schema.typeId as 202n | 203n | 204n | 205n)) {
        observationFail('INVALID_CHANNEL', 'character evidence contains a forbidden record type');
      }
      for (const nested of candidate.fields.values()) visit(nested);
    } else if (candidate.kind === 'list' || candidate.kind === 'set') for (const nested of candidate.items) visit(nested);
    else if (candidate.kind === 'map') for (const [key, nested] of candidate.entries) { visit(key); visit(nested); }
    else if (candidate.kind === 'typedIdentifier') visit(candidate.payload);
  };
  visit(value);
}

export function thinSemanticExperienceValue(
  experienceId: TypedIdentifierValue,
  observerId: TypedIdentifierValue,
  occurredAt: SimInstant,
  presentObservations: readonly CanonicalValue[],
): CanonicalValue {
  if (presentObservations.length === 0) observationFail('INVALID_CHANNEL', 'SemanticExperience requires at least one present observation');
  const observations = canonicalSort(presentObservations);
  for (const observation of observations) {
    validatePermittedEvidenceRecordClosure(observation);
    const root = requireRecord(observation, observationSchemas.presentObservation);
    if (canonicalKey(field(root, 2n)) !== canonicalKey(observerId)) observationFail('INVALID_CHANNEL', 'SemanticExperience observer mismatch');
    const observedAt = field(root, 5n);
    if (typeof observedAt === 'boolean' || observedAt.kind !== 'signed' || observedAt.value !== occurredAt) {
      observationFail('INVALID_CHANNEL', 'SemanticExperience instant mismatch');
    }
  }
  return requiredRecord(observationSchemas.thinSemanticExperience, [
    experienceId, observerId, signed(occurredAt), list(observations), text(OBSERVATION_CONTRACT_VERSION),
  ]);
}

export function validateThinSemanticExperienceRecordClosure(value: CanonicalValue): void {
  const experience = requireRecord(value, observationSchemas.thinSemanticExperience);
  const observations = requireList(field(experience, 4n));
  if (observations.length === 0) observationFail('INVALID_CHANNEL', 'SemanticExperience requires present observations');
  for (const observation of observations) validatePermittedEvidenceRecordClosure(observation);
  const allowed = new Set([203n, 204n, 205n, 209n]);
  const visit = (candidate: CanonicalValue): void => {
    if (typeof candidate === 'boolean') return;
    if (candidate.kind === 'record') {
      if (!allowed.has(candidate.schema.typeId)) observationFail('INVALID_CHANNEL', 'SemanticExperience contains forbidden truth record type');
      for (const nested of candidate.fields.values()) visit(nested);
    } else if (candidate.kind === 'list' || candidate.kind === 'set') for (const nested of candidate.items) visit(nested);
    else if (candidate.kind === 'map') for (const [key, nested] of candidate.entries) { visit(key); visit(nested); }
    else if (candidate.kind === 'typedIdentifier') visit(candidate.payload);
  };
  visit(value);
}

export function boundedEffectTruthValue(truth: BoundedEffectTruth): CanonicalValue {
  validateTruth(truth);
  return requiredRecord(observationSchemas.boundedEffectTruth, [
    exactValue(truth.before), exactValue(truth.potentialEffect), exactValue(truth.applied), exactValue(truth.overflow),
    exactValue(truth.after), exactValue(truth.minimum), exactValue(truth.maximum), provenanceValue(truth.provenance), truth.truthRecordId,
  ]);
}

function boundedStateChangeInterval(truth: BoundedEffectTruth, polarityId: bigint): MeasurementInterval {
  const delta = truth.after.subtract(truth.before);
  if (polarityId === PolarityId.Increase) return truth.after.equals(truth.maximum) ? { lower: delta } : { lower: delta, upper: delta };
  if (polarityId === PolarityId.Decrease) return truth.after.equals(truth.minimum) ? { upper: delta } : { lower: delta, upper: delta };
  if (delta.compare(ExactRational.of(0n)) > 0 && truth.after.equals(truth.maximum)) return { lower: delta };
  if (delta.compare(ExactRational.of(0n)) < 0 && truth.after.equals(truth.minimum)) return { upper: delta };
  if (delta.equals(ExactRational.of(0n)) && (truth.after.equals(truth.minimum) || truth.after.equals(truth.maximum))) {
    observationFail('AMBIGUOUS_SIGNED_ZERO', 'signed zero at a boundary requires a polarity-specific channel');
  }
  return { lower: delta, upper: delta };
}

function classifyInterval(interval: MeasurementInterval): bigint {
  if (interval.lower && interval.upper && interval.lower.equals(interval.upper)) return EvidenceKindId.Point;
  if (interval.lower && !interval.upper) return EvidenceKindId.LowerBound;
  if (!interval.lower && interval.upper) return EvidenceKindId.UpperBound;
  observationFail('INVALID_CHANNEL', 'unsupported or inconsistent measurement interval');
}

function projectVisibleConcepts(provenance: EffectProvenanceTruth, visibleSlotIds: readonly bigint[]): PerceivedConceptToken[] {
  const visible = new Set(visibleSlotIds);
  const seen = new Set<string>();
  const tokens: PerceivedConceptToken[] = [];
  for (const slot of PROVENANCE_SLOT_REGISTRY) {
    if (!visible.has(slot.slotId)) continue;
    for (const conceptId of canonicalSort(provenance.slots.get(slot.slotId) ?? [])) {
      const key = canonicalKey(conceptId);
      if (seen.has(key)) continue;
      seen.add(key);
      tokens.push({ conceptId, causalRoleId: slot.roleId, visibleProvenanceSlotId: slot.slotId });
    }
  }
  return tokens.sort((left, right) => canonicalKey(left.conceptId).localeCompare(canonicalKey(right.conceptId)));
}

function validateTruth(truth: BoundedEffectTruth): void {
  if (truth.minimum.compare(truth.maximum) >= 0) observationFail('INVALID_TRUTH', 'truth minimum must be below maximum');
  if (truth.before.compare(truth.minimum) < 0 || truth.before.compare(truth.maximum) > 0) observationFail('INVALID_TRUTH', 'before lies outside bounds');
  if (truth.after.compare(truth.minimum) < 0 || truth.after.compare(truth.maximum) > 0) observationFail('INVALID_TRUTH', 'after lies outside bounds');
  const lower = truth.minimum.subtract(truth.before);
  const upper = truth.maximum.subtract(truth.before);
  const expectedApplied = truth.potentialEffect.compare(lower) < 0 ? lower
    : truth.potentialEffect.compare(upper) > 0 ? upper : truth.potentialEffect;
  if (!truth.applied.equals(expectedApplied)) observationFail('INVALID_TRUTH', 'Applied does not equal exact bounded clamp');
  if (!truth.overflow.equals(truth.potentialEffect.subtract(truth.applied))) observationFail('INVALID_TRUTH', 'Overflow identity failed');
  if (!truth.after.equals(truth.before.add(truth.applied))) observationFail('INVALID_TRUTH', 'After identity failed');
  for (const [slotId, concepts] of truth.provenance.slots) {
    if (!PROVENANCE_SLOT_REGISTRY.some((slot) => slot.slotId === slotId)) observationFail('INVALID_PROVENANCE', 'unregistered provenance slot');
    canonicalUnique(concepts, 'provenance concept');
  }
}

function validateChannel(channel: ObservationChannel): void {
  if (!Object.values(PolarityId).some((value) => value === channel.polarityId)) observationFail('INVALID_CHANNEL', 'unregistered polarity');
  if (!Object.values(MeasurementModeId).some((value) => value === channel.measurementModeId)) observationFail('INVALID_CHANNEL', 'unregistered measurement mode');
  if (!Object.values(MissingnessRuleId).some((value) => value === channel.missingnessRuleId)) observationFail('INVALID_CHANNEL', 'unregistered missingness rule');
  if (channel.precision.compare(ExactRational.of(0n)) <= 0) observationFail('INVALID_CHANNEL', 'precision must be positive');
  const visible = canonicalUnique(channel.visibleProvenanceSlotIds.map(unsigned), 'visible provenance slot')
    .map((value) => (value as Extract<CanonicalValue, { kind: 'unsigned' }>).value);
  if (visible.some((slotId) => !PROVENANCE_SLOT_REGISTRY.some((slot) => slot.slotId === slotId))) observationFail('INVALID_CHANNEL', 'unregistered visible provenance slot');
  if (channel.measurementModeId === MeasurementModeId.ExactEffectControl && !channel.experimentalControlId) {
    observationFail('INVALID_CHANNEL', 'ExactEffectControl requires a named experimental control ID');
  }
}

function measurementIntervalValue(interval: MeasurementInterval): CanonicalValue {
  const kind = classifyInterval(interval);
  void kind;
  return requiredRecord(observationSchemas.measurementInterval, [
    interval.lower !== undefined, interval.lower ? exactValue(interval.lower) : false,
    interval.upper !== undefined, interval.upper ? exactValue(interval.upper) : false,
  ]);
}

function perceivedConceptTokenValue(token: PerceivedConceptToken): CanonicalValue {
  return requiredRecord(observationSchemas.perceivedConceptToken, [token.conceptId, unsigned(token.causalRoleId), unsigned(token.visibleProvenanceSlotId)]);
}

function provenanceValue(provenance: EffectProvenanceTruth): CanonicalValue {
  const slots = [...provenance.slots.entries()].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
  return requiredRecord(observationSchemas.effectProvenanceTruth, [list(slots.map(([slotId, concepts]) =>
    requiredRecord(observationSchemas.effectProvenanceSlot, [unsigned(slotId), list(canonicalUnique(concepts, 'provenance concept'))]))) ]);
}

function validatePresentObservationRecord(root: CanonicalRecord): void {
  requireTypedIdentifier(field(root, 1n));
  requireTypedIdentifier(field(root, 2n));
  requireTypedIdentifier(field(root, 3n));
  requireTypedIdentifier(field(root, 4n));
  requireSigned(field(root, 5n));
  const interval = restoreMeasurementInterval(field(root, 6n));
  const kind = requireUnsigned(field(root, 7n));
  if (classifyInterval(interval) !== kind) observationFail('INVALID_CHANNEL', 'EvidenceKind does not match canonical MeasurementInterval');
  if (requireExact(field(root, 8n)).compare(ExactRational.of(0n)) <= 0) observationFail('INVALID_CHANNEL', 'canonical evidence precision must be positive');
  const tokenKeys: string[] = [];
  for (const value of requireList(field(root, 9n))) {
    const token = requireRecord(value, observationSchemas.perceivedConceptToken);
    const concept = requireTypedIdentifier(field(token, 1n));
    const roleId = requireUnsigned(field(token, 2n));
    const slotId = requireUnsigned(field(token, 3n));
    const registered = PROVENANCE_SLOT_REGISTRY.find((slot) => slot.slotId === slotId);
    if (!registered || registered.roleId !== roleId) observationFail('INVALID_PROVENANCE', 'token role does not match provenance slot registry');
    tokenKeys.push(canonicalKey(concept));
  }
  assertStrictKeys(tokenKeys, 'perceived concept tokens');
  const references = requireList(field(root, 10n)).map(requireTypedIdentifier).map(canonicalKey);
  assertStrictKeys(references, 'safe source references');
  const version = field(root, 11n);
  if (typeof version === 'boolean' || version.kind !== 'text' || version.value !== OBSERVATION_CONTRACT_VERSION) {
    observationFail('INVALID_CHANNEL', 'unsupported observation transformation version');
  }
}

function validateMissingObservationRecord(root: CanonicalRecord): void {
  requireTypedIdentifier(field(root, 1n));
  requireTypedIdentifier(field(root, 2n));
  requireTypedIdentifier(field(root, 3n));
  requireTypedIdentifier(field(root, 4n));
  requireSigned(field(root, 5n));
  if (requireUnsigned(field(root, 6n)) !== MissingnessRuleId.AlwaysMissing) observationFail('INVALID_CHANNEL', 'missing record requires AlwaysMissing rule');
}

function restoreMeasurementInterval(value: CanonicalValue): MeasurementInterval {
  const interval = requireRecord(value, observationSchemas.measurementInterval);
  const lowerPresent = requireBoolean(field(interval, 1n));
  const lowerValue = field(interval, 2n);
  const upperPresent = requireBoolean(field(interval, 3n));
  const upperValue = field(interval, 4n);
  if (!lowerPresent && lowerValue !== false) observationFail('INVALID_CHANNEL', 'absent lower endpoint must use false sentinel');
  if (!upperPresent && upperValue !== false) observationFail('INVALID_CHANNEL', 'absent upper endpoint must use false sentinel');
  return { lower: lowerPresent ? requireExact(lowerValue) : undefined, upper: upperPresent ? requireExact(upperValue) : undefined };
}

function assertStrictKeys(keys: readonly string[], label: string): void {
  for (let index = 1; index < keys.length; index += 1) {
    if (keys[index - 1] >= keys[index]) observationFail('INVALID_PROVENANCE', `${label} must be canonically ordered and duplicate-free`);
  }
}

type CanonicalRecord = Extract<CanonicalValue, { kind: 'record' }>;
function restoreProvenance(value: CanonicalValue): EffectProvenanceTruth {
  const provenance = requireRecord(value, observationSchemas.effectProvenanceTruth);
  const slots = new Map<bigint, readonly TypedIdentifierValue[]>();
  for (const item of requireList(field(provenance, 1n))) {
    const slot = requireRecord(item, observationSchemas.effectProvenanceSlot);
    const slotId = requireUnsigned(field(slot, 1n));
    if (slots.has(slotId)) observationFail('INVALID_PROVENANCE', 'duplicate provenance slot');
    slots.set(slotId, requireList(field(slot, 2n)).map(requireTypedIdentifier));
  }
  return { slots };
}
function requireAnyRecord(value: CanonicalValue): CanonicalRecord { if (typeof value === 'boolean' || value.kind !== 'record') observationFail('INVALID_CHANNEL', 'expected canonical record'); return value; }
function requireRecord(value: CanonicalValue, expected: RecordSchema): CanonicalRecord { const result = requireAnyRecord(value); if (result.schema.typeId !== expected.typeId || result.schema.schemaVersion !== expected.schemaVersion) observationFail('INVALID_CHANNEL', `expected ${expected.name}`); return result; }
function field(value: CanonicalRecord, id: bigint): CanonicalValue { const result = value.fields.get(id); if (result === undefined) observationFail('INVALID_CHANNEL', `missing field ${id}`); return result; }
function requireExact(value: CanonicalValue): ExactRational { if (typeof value === 'boolean' || value.kind !== 'rational') observationFail('INVALID_CHANNEL', 'expected exact rational'); return ExactRational.of(value.numerator, value.denominator); }
function requireUnsigned(value: CanonicalValue): bigint { if (typeof value === 'boolean' || value.kind !== 'unsigned') observationFail('INVALID_CHANNEL', 'expected unsigned integer'); return value.value; }
function requireSigned(value: CanonicalValue): bigint { if (typeof value === 'boolean' || value.kind !== 'signed') observationFail('INVALID_CHANNEL', 'expected signed integer'); return value.value; }
function requireBoolean(value: CanonicalValue): boolean { if (typeof value !== 'boolean') observationFail('INVALID_CHANNEL', 'expected boolean'); return value; }
function requireList(value: CanonicalValue): readonly CanonicalValue[] { if (typeof value === 'boolean' || value.kind !== 'list') observationFail('INVALID_CHANNEL', 'expected list'); return value.items; }
function requireTypedIdentifier(value: CanonicalValue): TypedIdentifierValue { if (typeof value === 'boolean' || value.kind !== 'typedIdentifier') observationFail('INVALID_CHANNEL', 'expected typed identifier'); return value; }

function exactValue(value: ExactRational): CanonicalValue { return rational(value.numerator, value.denominator); }
function canonicalKey(value: CanonicalValue): string { return bytesToHex(canonicalEncode(value)); }
function canonicalSort<T extends CanonicalValue>(values: readonly T[]): T[] { return [...values].sort((a, b) => canonicalKey(a).localeCompare(canonicalKey(b))); }
function canonicalUnique<T extends CanonicalValue>(values: readonly T[], label: string): T[] {
  const sorted = canonicalSort(values);
  for (let index = 1; index < sorted.length; index += 1) if (canonicalKey(sorted[index - 1]) === canonicalKey(sorted[index])) observationFail('INVALID_PROVENANCE', `duplicate ${label}`);
  return sorted;
}
function requiredRecord(target: RecordSchema, values: readonly CanonicalValue[]): CanonicalValue { return record(target, new Map(target.fields.map((field, index) => [field.id, values[index]]))); }
function schema(typeId: bigint, name: string, fieldNames: readonly string[]): RecordSchema { return { typeId, schemaVersion: 1n, name, fields: fieldNames.map((fieldName, index) => ({ id: BigInt(index + 1), name: fieldName, required: true })) }; }
function observationFail(code: ObservationFailureCode, message: string): never { throw new ObservationContractError(code, message); }
