import { describe, expect, it } from 'vitest';
import { bytesToHex, canonicalEncode, list, rational, record, text, typedIdentifier, unsigned, type CanonicalValue } from '../substrate/canonicalEncoding';
import { ExactRational } from '../substrate/exactMath';
import { simInstant } from '../substrate/time';
import { findCanonicalValueDivergence } from '../substrate/trace';
import {
  CausalRoleId,
  EvidenceKindId,
  MeasurementModeId,
  MissingnessRuleId,
  PolarityId,
  boundedEffectTruthValue,
  compilePermittedEvidence,
  observationChannelValue,
  observationSchemas,
  permittedEvidenceValue,
  restoreBoundedEffectTruth,
  restoreObservationChannel,
  validatePermittedEvidenceRecordClosure,
  type BoundedEffectTruth,
  type ObservationChannel,
  type PresentObservation,
} from '../observation/observation';

const id = (namespace: bigint, value: string) => typedIdentifier(namespace, text(value));
const observer = id(24000n, 'character/mina');
const subject = id(24001n, 'need/connection');
const channelId = id(24002n, 'channel/interoceptive-positive-delta');
const modality = id(24003n, 'modality/interoception');
const unit = id(24004n, 'unit/normalized-level');
const observationId = id(24005n, 'observation/1');
const truthId = id(24006n, 'truth/effect/1');
const action = id(24007n, 'action/connect');
const cause = id(24007n, 'person/glen');
const hiddenTarget = id(24007n, 'person/private-target');
const r = (numerator: bigint, denominator = 1n) => ExactRational.of(numerator, denominator);
const key = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));

const channel = (overrides: Partial<ObservationChannel> = {}): ObservationChannel => ({
  observationChannelId: channelId, observerId: observer, subjectId: subject, modalityId: modality, unitId: unit,
  polarityId: PolarityId.Increase, measurementModeId: MeasurementModeId.BoundedStateChange,
  precision: r(2n), visibleProvenanceSlotIds: [1n, 2n, 3n], missingnessRuleId: MissingnessRuleId.AlwaysPresent,
  ...overrides,
});

const truth = (
  before: ExactRational,
  potential: ExactRational,
  applied: ExactRational,
  overflow: ExactRational,
  after: ExactRational,
  overrides: Partial<BoundedEffectTruth> = {},
): BoundedEffectTruth => ({
  before, potentialEffect: potential, applied, overflow, after, minimum: r(0n), maximum: r(1n),
  provenance: { slots: new Map([[1n, [action]], [2n, [cause]], [4n, [hiddenTarget]]]) },
  truthRecordId: truthId, ...overrides,
});

const present = (value: ReturnType<typeof compilePermittedEvidence>): PresentObservation => {
  if (value.kind !== 'present') throw new Error('expected present observation');
  return value;
};

describe('Campaign 1 MATH-006 exact observation compiler', () => {
  it('CV-OBS-001 classifies exact point, lower bound, upper bound, and zero-information bound without Overflow', () => {
    const point = present(compilePermittedEvidence(truth(r(2n, 5n), r(1n, 10n), r(1n, 10n), r(0n), r(1n, 2n)), channel(), observationId, simInstant(10n)));
    expect(point.evidenceKindId).toBe(EvidenceKindId.Point);
    expect(point.measurementInterval.lower?.equals(r(1n, 10n))).toBe(true);
    expect(point.measurementInterval.upper?.equals(r(1n, 10n))).toBe(true);

    const lower = present(compilePermittedEvidence(truth(r(19n, 20n), r(1n, 10n), r(1n, 20n), r(1n, 20n), r(1n)), channel(), observationId, simInstant(10n)));
    expect(lower.evidenceKindId).toBe(EvidenceKindId.LowerBound);
    expect(lower.measurementInterval.lower?.equals(r(1n, 20n))).toBe(true);
    expect(lower.measurementInterval.upper).toBeUndefined();

    const upperTruth = truth(r(1n, 10n), r(-1n, 5n), r(-1n, 10n), r(-1n, 10n), r(0n));
    const upper = present(compilePermittedEvidence(upperTruth, channel({ polarityId: PolarityId.Decrease }), observationId, simInstant(10n)));
    expect(upper.evidenceKindId).toBe(EvidenceKindId.UpperBound);
    expect(upper.measurementInterval.upper?.equals(r(-1n, 10n))).toBe(true);

    const zero = present(compilePermittedEvidence(truth(r(1n), r(2n, 5n), r(0n), r(2n, 5n), r(1n)), channel(), observationId, simInstant(10n)));
    expect(zero.evidenceKindId).toBe(EvidenceKindId.LowerBound);
    expect(zero.measurementInterval.lower?.equals(r(0n))).toBe(true);
  });

  it('CV-OBS-002 and CV-EPI-001 make exact-boundary and hidden-Overflow timelines byte-identical to the character', () => {
    const exactBoundary = truth(r(19n, 20n), r(1n, 20n), r(1n, 20n), r(0n), r(1n));
    const smallerOverflow = truth(r(19n, 20n), r(1n, 10n), r(1n, 20n), r(1n, 20n), r(1n));
    const largerOverflow = truth(r(19n, 20n), r(4n, 5n), r(1n, 20n), r(3n, 4n), r(1n));
    const exact = compilePermittedEvidence(exactBoundary, channel(), observationId, simInstant(20n));
    const left = compilePermittedEvidence(smallerOverflow, channel(), observationId, simInstant(20n));
    const right = compilePermittedEvidence(largerOverflow, channel(), observationId, simInstant(20n));
    expect(key(permittedEvidenceValue(left))).toBe(key(permittedEvidenceValue(right)));
    expect(key(permittedEvidenceValue(exact))).toBe(key(permittedEvidenceValue(left)));
    expect(key(boundedEffectTruthValue(smallerOverflow))).not.toBe(key(boundedEffectTruthValue(largerOverflow)));

    const truthSaturationClassifier = (candidate: BoundedEffectTruth) => candidate.overflow.equals(r(0n)) ? EvidenceKindId.Point : EvidenceKindId.LowerBound;
    expect(truthSaturationClassifier(exactBoundary)).not.toBe(truthSaturationClassifier(smallerOverflow));
    expect(findCanonicalValueDivergence(
      unsigned(truthSaturationClassifier(exactBoundary)),
      unsigned(truthSaturationClassifier(smallerOverflow)),
      'TruthSaturationClassifier.EvidenceKindId',
    )?.structuralField).toBe('TruthSaturationClassifier.EvidenceKindId');
    const overflowLeakLeft = list([permittedEvidenceValue(left), rational(smallerOverflow.overflow.numerator, smallerOverflow.overflow.denominator)]);
    const overflowLeakRight = list([permittedEvidenceValue(right), rational(largerOverflow.overflow.numerator, largerOverflow.overflow.denominator)]);
    expect(key(overflowLeakLeft)).not.toBe(key(overflowLeakRight));
    expect(findCanonicalValueDivergence(overflowLeakLeft, overflowLeakRight, 'OverflowLeak')?.structuralField)
      .toBe('OverflowLeak[1]');
  });

  it('CV-OBS-003 keeps a missing observation structurally distinct from observed zero', () => {
    const zeroTruth = truth(r(1n), r(2n, 5n), r(0n), r(2n, 5n), r(1n));
    const missing = compilePermittedEvidence(zeroTruth, channel({ missingnessRuleId: MissingnessRuleId.AlwaysMissing }), observationId, simInstant(30n));
    const observedZero = compilePermittedEvidence(zeroTruth, channel(), observationId, simInstant(30n));
    expect(missing.kind).toBe('missing');
    expect(observedZero.kind).toBe('present');
    const missingValue = permittedEvidenceValue(missing);
    const zeroValue = permittedEvidenceValue(observedZero);
    expect(key(missingValue)).not.toBe(key(zeroValue));
    expect(findCanonicalValueDivergence(missingValue, zeroValue, 'MissingAsZero')?.structuralField)
      .toBe('MissingAsZero.$schema');
  });

  it('CV-OBS-004/005 projects only visible slots with permanent priority and canonical concept order', () => {
    const duplicateAcrossSlots = truth(r(0n), r(1n, 10n), r(1n, 10n), r(0n), r(1n, 10n), {
      provenance: { slots: new Map([[1n, [action]], [2n, [cause]], [3n, [cause]], [4n, [hiddenTarget]]]) },
    });
    const evidence = present(compilePermittedEvidence(duplicateAcrossSlots, channel({ visibleProvenanceSlotIds: [3n, 1n, 2n] }), observationId, simInstant(40n)));
    expect(evidence.perceivedConceptTokens.map((token) => key(token.conceptId))).toEqual([...evidence.perceivedConceptTokens.map((token) => key(token.conceptId))].sort());
    expect(evidence.perceivedConceptTokens.some((token) => key(token.conceptId) === key(hiddenTarget))).toBe(false);
    const causeToken = evidence.perceivedConceptTokens.find((token) => key(token.conceptId) === key(cause));
    expect(causeToken).toMatchObject({ causalRoleId: CausalRoleId.Cause, visibleProvenanceSlotId: 2n });
    const encoded = permittedEvidenceValue(evidence);
    expect(collectRecordTypeIds(encoded)).toEqual(new Set([203n, 204n, 205n]));
    expect(() => validatePermittedEvidenceRecordClosure(encoded)).not.toThrow();
    const fullProvenanceCopy = list([encoded, boundedEffectTruthValue(duplicateAcrossSlots)]);
    expect(findCanonicalValueDivergence(encoded, fullProvenanceCopy, 'PermittedEvidence')?.structuralField)
      .toBe('PermittedEvidence');
    expect(() => validatePermittedEvidenceRecordClosure(fullProvenanceCopy))
      .toThrow(/root must be MissingObservation or PresentObservation/);
  });

  it('CV-OBS-006 rejects inconsistent truth, invalid channels, ambiguous signed zero, and unnamed omniscient controls', () => {
    expect(() => compilePermittedEvidence(
      truth(r(0n), r(1n, 2n), r(1n, 4n), r(1n, 4n), r(1n, 4n)), channel(), observationId, simInstant(50n),
    )).toThrowError(expect.objectContaining({ code: 'INVALID_TRUTH' }));
    expect(() => compilePermittedEvidence(
      truth(r(0n), r(1n, 10n), r(1n, 10n), r(0n), r(1n, 10n)), channel({ precision: r(0n) }), observationId, simInstant(50n),
    )).toThrowError(expect.objectContaining({ code: 'INVALID_CHANNEL' }));
    expect(() => compilePermittedEvidence(
      truth(r(1n), r(0n), r(0n), r(0n), r(1n)), channel({ polarityId: PolarityId.Signed }), observationId, simInstant(50n),
    )).toThrowError(expect.objectContaining({ code: 'AMBIGUOUS_SIGNED_ZERO' }));
    expect(() => compilePermittedEvidence(
      truth(r(0n), r(1n, 10n), r(1n, 10n), r(0n), r(1n, 10n)),
      channel({ measurementModeId: MeasurementModeId.ExactEffectControl }), observationId, simInstant(50n),
    )).toThrowError(/named experimental control/);

    const lower = present(compilePermittedEvidence(
      truth(r(19n, 20n), r(1n, 10n), r(1n, 20n), r(1n, 20n), r(1n)), channel(), observationId, simInstant(50n),
    ));
    expect(() => permittedEvidenceValue({ ...lower, evidenceKindId: EvidenceKindId.Point }))
      .toThrow(/does not match MeasurementInterval/);

    const validLower = permittedEvidenceValue(lower);
    if (typeof validLower === 'boolean' || validLower.kind !== 'record') throw new Error('fixture must be a record');
    const alwaysPoint = record(observationSchemas.presentObservation, new Map(validLower.fields).set(7n, unsigned(EvidenceKindId.Point)));
    expect(findCanonicalValueDivergence(validLower, alwaysPoint, 'PresentObservation')?.structuralField)
      .toBe('PresentObservation.EvidenceKindId');
    expect(() => validatePermittedEvidenceRecordClosure(alwaysPoint))
      .toThrow(/does not match canonical MeasurementInterval/);
  });

  it('round-trips canonical truth and channel records before compilation', () => {
    const sourceTruth = truth(r(19n, 20n), r(1n, 10n), r(1n, 20n), r(1n, 20n), r(1n));
    const sourceChannel = channel();
    expect(key(boundedEffectTruthValue(restoreBoundedEffectTruth(boundedEffectTruthValue(sourceTruth)))))
      .toBe(key(boundedEffectTruthValue(sourceTruth)));
    expect(key(observationChannelValue(restoreObservationChannel(observationChannelValue(sourceChannel)))))
      .toBe(key(observationChannelValue(sourceChannel)));
  });
});

function collectRecordTypeIds(value: CanonicalValue, output = new Set<bigint>()): Set<bigint> {
  if (typeof value === 'boolean') return output;
  if (value.kind === 'record') {
    output.add(value.schema.typeId);
    for (const field of value.fields.values()) collectRecordTypeIds(field, output);
  } else if (value.kind === 'list' || value.kind === 'set') {
    for (const item of value.items) collectRecordTypeIds(item, output);
  } else if (value.kind === 'map') {
    for (const [mapKey, mapValue] of value.entries) { collectRecordTypeIds(mapKey, output); collectRecordTypeIds(mapValue, output); }
  } else if (value.kind === 'typedIdentifier') collectRecordTypeIds(value.payload, output);
  return output;
}
