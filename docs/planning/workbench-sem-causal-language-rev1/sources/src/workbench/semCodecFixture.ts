
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


export {mina,darius,sem001a,continuantFile,transition};
export const originalSource={path:'src/test/semanticCodecs.test.ts',sha256:'97426fb2c6b0b2d691d614a96bcf3e6ce820559949c357ec9591cd2b27e15d6b'} as const;
