import { describe, expect, it } from 'vitest';
import {
  bytesToHex, canonicalEncode, record, text, unsigned,
  type RecordSchema,
} from '../substrate/canonicalEncoding';
import {
  assertCanonicalRoundTrip,
  currentDetectionIdValue,
  decodeSemanticValue,
  encodeSemanticValue,
  observerIdValue,
  occurrenceBytes,
  perceptualContinuantFileStateValue,
  perceptualEventFileStateValue,
  perceptualReferentIdValue,
  perceptualTrackEndValue,
  perceptualTrackTransitionValue,
  semanticOccurrenceId,
  semanticRecordValue,
  semanticSchema,
  semanticUnionValue,
  SemanticCodecError,
  supportingObservationIdValue,
  type CanonicalTrackTransition,
} from '../semanticBinding/semanticCodecs';
import {
  applyPerceptualTrackTransition,
  emptyPerceptualContinuantFileState,
  type PerceptualContinuantFileState,
  type PerceptualReferentId,
} from '../semanticBinding/perceptualContinuantFiles';
import type { PerceptualEventFileState } from '../semanticBinding/perceptualEventFiles';

const mina = 'character/mina';
const darius = 'character/darius';
const sem001a = 'semantic-binding/0.1-candidate#SEM-001A';

const continuantFile = (observerTrackSequence: bigint, observerId = mina): PerceptualReferentId => ({
  observerId,
  observerTrackSequence,
});

const codecCode = (run: () => unknown): string => {
  try {
    run();
  } catch (error) {
    if (error instanceof SemanticCodecError) return error.code;
    throw error;
  }
  throw new Error('expected a semantic codec failure');
};

const transition = (overrides: Partial<CanonicalTrackTransition> = {}): CanonicalTrackTransition => ({
  observerId: mina,
  perceptualReferentId: continuantFile(0n),
  detectionOrdinal: 7n,
  continuityKind: 'NewTrack',
  supportingObservationOrdinals: [3n, 5n],
  occurredAt: 100n,
  transformationVersion: sem001a,
  ...overrides,
});

describe('SEM-001I.3 canonical semantic codecs', () => {
  it('CV-SEM-096 enforces the accepted type and field registry', () => {
    expect(semanticSchema('PerceptualTrackTransition').typeId).toBe(217n);

    expect(codecCode(() => semanticSchema('PerceptualTrackGuess')))
      .toBe('UNKNOWN_SEMANTIC_SCHEMA');

    // A field that the frozen allocation never assigned cannot reach the encoder.
    expect(codecCode(() => semanticRecordValue('PerceptualReferentId', {
      ObserverId: observerIdValue(mina),
      ObserverTrackSequence: unsigned(0n),
      TrackConfidence: unsigned(1n),
    }))).toBe('UNKNOWN_SEMANTIC_FIELD');

    // A required field cannot be omitted.
    expect(codecCode(() => semanticRecordValue('PerceptualReferentId', {
      ObserverId: observerIdValue(mina),
    }))).toBe('MISSING_REQUIRED_FIELD');
  });

  it('CV-SEM-096 rejects unadmitted contract versions before emission', () => {
    expect(() => perceptualTrackTransitionValue(transition())).not.toThrow();

    expect(codecCode(() => perceptualTrackTransitionValue(
      transition({ transformationVersion: 'semantic-binding/0.2-speculative' }),
    ))).toBe('UNADMITTED_CONTRACT_VERSION');

    expect(codecCode(() => perceptualTrackEndValue({
      observerId: mina,
      perceptualReferentId: continuantFile(0n),
      supportingObservationOrdinals: [1n],
      occurredAt: 110n,
      transformationVersion: 'semantic-binding/9.9-candidate#SEM-999Z',
    }))).toBe('UNADMITTED_CONTRACT_VERSION');
  });

  it('CV-SEM-096 refuses to decode a record schema version the registry does not admit', () => {
    const admitted = semanticSchema('PerceptualReferentId');
    const legal = perceptualReferentIdValue(continuantFile(4n));
    expect(() => decodeSemanticValue(encodeSemanticValue(legal))).not.toThrow();

    // Same type ID, unregistered schema version 2.
    const forged: RecordSchema = { ...admitted, schemaVersion: 2n };
    const forgedBytes = canonicalEncode(record(forged, new Map([
      [1n, observerIdValue(mina)],
      [2n, unsigned(4n)],
    ])));
    expect(() => decodeSemanticValue(forgedBytes)).toThrow(/unknown record schema 212\/2/);
  });

  it('CV-SEM-096 validates every union tag/payload contract before the record is built', () => {
    // EventRoleEvidence: ExactEventRole carries the role; UnresolvedEventRole must not.
    expect(() => semanticUnionValue('EventRoleEvidence', 1, {
      EventRoleId: semanticOccurrenceId('EventBindingId', 0n),
    })).not.toThrow();
    expect(() => semanticUnionValue('EventRoleEvidence', 2)).not.toThrow();

    expect(codecCode(() => semanticUnionValue('EventRoleEvidence', 2, {
      EventRoleId: semanticOccurrenceId('EventBindingId', 0n),
    }))).toBe('ILLEGAL_UNION_LAYOUT');
    expect(codecCode(() => semanticUnionValue('EventRoleEvidence', 1)))
      .toBe('ILLEGAL_UNION_LAYOUT');
    expect(codecCode(() => semanticUnionValue('EventRoleEvidence', 3)))
      .toBe('ILLEGAL_UNION_LAYOUT');
  });

  it('CV-SEM-096 enforces multi-field and mutually exclusive union payloads', () => {
    // RecognitionCueSource tag 2 requires BOTH the symbol and its mapping occurrence.
    expect(() => semanticUnionValue('RecognitionCueSource', 2, {
      PerceivedIdentitySymbolId: semanticOccurrenceId('ExperienceId', 1n),
      ObserverSymbolCandidateMappingId: semanticOccurrenceId('ObserverSymbolCandidateMappingId', 2n),
    })).not.toThrow();
    expect(codecCode(() => semanticUnionValue('RecognitionCueSource', 2, {
      PerceivedIdentitySymbolId: semanticOccurrenceId('ExperienceId', 1n),
    }))).toBe('ILLEGAL_UNION_LAYOUT');

    // EvidenceCarrier tag 3 (ContinuantInEvent) requires both carriers; tags 1 and 2 exactly one.
    expect(() => semanticUnionValue('EvidenceCarrier', 3, {
      PerceptualReferentId: perceptualReferentIdValue(continuantFile(0n)),
      PerceptualEventReferentId: unsigned(0n),
    })).not.toThrow();
    expect(codecCode(() => semanticUnionValue('EvidenceCarrier', 1, {
      PerceptualReferentId: perceptualReferentIdValue(continuantFile(0n)),
      PerceptualEventReferentId: unsigned(0n),
    }))).toBe('ILLEGAL_UNION_LAYOUT');

    // MaxOccurrences: Finite carries a value, Unbounded does not.
    expect(() => semanticUnionValue('MaxOccurrences', 1, { FiniteValue: unsigned(2n) })).not.toThrow();
    expect(codecCode(() => semanticUnionValue('MaxOccurrences', 2, { FiniteValue: unsigned(2n) })))
      .toBe('ILLEGAL_UNION_LAYOUT');
  });

  it('CV-SEM-096 gives CharacterEvidenceRef exactly one payload field per reference kind', () => {
    const fieldNames = [
      'ObservationId', 'FeatureObservationId', 'EventFeatureObservationId', 'PerceivedBindingId',
      'ClassificationEvidenceId', 'EventClassificationEvidenceId', 'RecognitionCueEvidenceId',
      'RecognitionResolutionId', 'CausalRoleEvidenceId',
    ] as const;

    fieldNames.forEach((fieldName, index) => {
      const tag = index + 1;
      expect(() => semanticUnionValue('CharacterEvidenceRef', tag, {
        [fieldName]: semanticOccurrenceId('ExperienceId', BigInt(index)),
      })).not.toThrow();

      // Any other reference kind's payload in the same tag is an illegal layout.
      const wrong = fieldNames[(index + 1) % fieldNames.length];
      expect(codecCode(() => semanticUnionValue('CharacterEvidenceRef', tag, {
        [wrong]: semanticOccurrenceId('ExperienceId', BigInt(index)),
      }))).toBe('ILLEGAL_UNION_LAYOUT');
    });
  });

  it('CV-SEM-096 round-trips every lifecycle record byte-identically', () => {
    const values = [
      perceptualReferentIdValue(continuantFile(3n)),
      currentDetectionIdValue(mina, 11n),
      supportingObservationIdValue(mina, 5n),
      perceptualTrackTransitionValue(transition()),
      perceptualTrackTransitionValue(transition({
        continuityKind: 'ContinuesPriorTrack',
        priorPerceptualReferentId: continuantFile(0n),
        perceptualReferentId: continuantFile(0n),
      })),
      perceptualTrackEndValue({
        observerId: mina,
        perceptualReferentId: continuantFile(0n),
        supportingObservationOrdinals: [9n],
        occurredAt: 130n,
        transformationVersion: sem001a,
      }),
      semanticUnionValue('EventRoleEvidence', 2),
    ];

    for (const value of values) {
      expect(() => assertCanonicalRoundTrip(value)).not.toThrow();
    }

    // The optional prior-file field genuinely changes the bytes rather than being dropped.
    expect(bytesToHex(encodeSemanticValue(values[3])))
      .not.toBe(bytesToHex(encodeSemanticValue(values[4])));
  });

  it('CV-SEM-096 encodes state roots independently of map and set construction order', () => {
    const forward: PerceptualContinuantFileState = {
      nextTrackSequenceByObserver: new Map([[mina, 2n], [darius, 1n]]),
      activePerceptualReferentIds: [continuantFile(0n), continuantFile(1n), continuantFile(0n, darius)],
    };
    const reversed: PerceptualContinuantFileState = {
      nextTrackSequenceByObserver: new Map([[darius, 1n], [mina, 2n]]),
      activePerceptualReferentIds: [continuantFile(0n, darius), continuantFile(1n), continuantFile(0n)],
    };

    const forwardBytes = assertCanonicalRoundTrip(perceptualContinuantFileStateValue(forward));
    const reversedBytes = assertCanonicalRoundTrip(perceptualContinuantFileStateValue(reversed));
    expect(bytesToHex(reversedBytes)).toBe(bytesToHex(forwardBytes));

    // A real allocator-produced state encodes and survives the same boundary.
    const produced = applyPerceptualTrackTransition(
      emptyPerceptualContinuantFileState(),
      {
        observerId: mina,
        currentDetectionId: { observerId: mina, detectionOccurrenceId: 1n },
        continuityKind: 'NewTrack',
        supportingObservationIds: [{ observerId: mina, observationId: 29000n }],
        occurredAt: 100n,
        transformationVersion: sem001a,
      },
    );
    expect(() => assertCanonicalRoundTrip(perceptualContinuantFileStateValue(produced.state)))
      .not.toThrow();

    const eventState: PerceptualEventFileState = {
      nextEventSequenceByObserver: new Map([[mina, 1n]]),
      activeEventFiles: [{ observerId: mina, observerEventSequence: 0n }],
    };
    expect(() => assertCanonicalRoundTrip(perceptualEventFileStateValue(eventState))).not.toThrow();
  });

  it('CV-SEM-096 keeps equal ordinals in different occurrence namespaces distinct', () => {
    const experience = occurrenceBytes('ExperienceId', 4n);
    const detection = occurrenceBytes('DetectionOccurrenceId', 4n);
    const observation = occurrenceBytes('ObservationId', 4n);

    expect(bytesToHex(experience)).not.toBe(bytesToHex(detection));
    expect(bytesToHex(experience)).not.toBe(bytesToHex(observation));
    expect(bytesToHex(detection)).not.toBe(bytesToHex(observation));

    expect(codecCode(() => semanticOccurrenceId('NotAnOccurrence' as never, 0n)))
      .toBe('UNKNOWN_SEMANTIC_NAMESPACE');
    expect(codecCode(() => semanticOccurrenceId('ExperienceId', -1n)))
      .toBe('INVALID_OCCURRENCE_ORDINAL');
  });

  it('CV-SEM-096 keeps observer ownership inside the canonical identity value', () => {
    const minaFile = encodeSemanticValue(perceptualReferentIdValue(continuantFile(0n, mina)));
    const dariusFile = encodeSemanticValue(perceptualReferentIdValue(continuantFile(0n, darius)));
    expect(bytesToHex(minaFile)).not.toBe(bytesToHex(dariusFile));

    // Two observers' detections with the same shared-allocator ordinal stay distinct records.
    const minaDetection = encodeSemanticValue(currentDetectionIdValue(mina, 12n));
    const dariusDetection = encodeSemanticValue(currentDetectionIdValue(darius, 12n));
    expect(bytesToHex(minaDetection)).not.toBe(bytesToHex(dariusDetection));

    expect(bytesToHex(encodeSemanticValue(observerIdValue(mina))))
      .not.toBe(bytesToHex(encodeSemanticValue(text(mina))));
  });
});
