// Original helper bodies retained verbatim; each invocation owns its detection-label map.

import {
  applyPerceptualTrackTransition,
  assertUniqueTrackTransitions,
  clonePerceptualContinuantFileState,
  continuantFileStateSummary,
  continuantTrackSemanticView,
  emptyPerceptualContinuantFileState,
  endPerceptualContinuantFile,
  PerceptualContinuantFileContractError,
  type ContinuityKind,
  type PerceptualContinuantFileState,
  type PerceptualReferentId,
  type PerceptualTrackTransition,
  type PerceptualTrackTransitionRequest,
  type SupportingObservationId,
} from '../semanticBinding/perceptualContinuantFiles';


export function createContinuantFixture(){
const mina = 'character/mina';
const darius = 'character/darius';
const version = 'perceptual-continuant-files/0.1-candidate';

const observation = (observerId: string, observationId: bigint): SupportingObservationId => ({
  observerId,
  observationId,
});

const continuantFile = (observerTrackSequence: bigint, observerId = mina): PerceptualReferentId => ({
  observerId,
  observerTrackSequence,
});

/**
 * Detections and observations are allocated occurrence ordinals, not symbolic strings. The helper
 * derives a stable ordinal per detection label so the fixtures stay readable.
 */
const DETECTION_ORDINALS = new Map<string, bigint>();
const detectionOrdinal = (label: string): bigint => {
  if (!DETECTION_ORDINALS.has(label)) DETECTION_ORDINALS.set(label, BigInt(DETECTION_ORDINALS.size));
  return DETECTION_ORDINALS.get(label)!;
};

const transition = (
  continuityKind: ContinuityKind,
  detectionLabel: string,
  options: {
    readonly observerId?: string;
    readonly prior?: PerceptualReferentId;
    readonly occurredAt?: bigint;
    readonly observations?: readonly bigint[];
  } = {},
): PerceptualTrackTransitionRequest => {
  const observerId = options.observerId ?? mina;
  return {
    observerId,
    priorPerceptualReferentId: options.prior,
    currentDetectionId: { observerId, detectionOccurrenceId: detectionOrdinal(detectionLabel) },
    continuityKind,
    supportingObservationIds: (options.observations ?? [detectionOrdinal(detectionLabel) + 500n])
      .map((observationId) => observation(observerId, observationId)),
    occurredAt: options.occurredAt ?? 100n,
    transformationVersion: version,
  };
};

const failureCode = (run: () => unknown): string => {
  try {
    run();
  } catch (error) {
    if (error instanceof PerceptualContinuantFileContractError) return error.code;
    throw error;
  }
  throw new Error('expected a continuant-file contract failure');
};

/** Applies a canonical detection sequence and returns the final state plus every transition. */
const runDetections = (
  requests: readonly PerceptualTrackTransitionRequest[],
  initial: PerceptualContinuantFileState = emptyPerceptualContinuantFileState(),
): { state: PerceptualContinuantFileState; transitions: readonly PerceptualTrackTransition[] } => {
  let state = initial;
  const transitions: PerceptualTrackTransition[] = [];
  for (const request of requests) {
    const result = applyPerceptualTrackTransition(state, request);
    state = result.state;
    transitions.push(result.transition);
  }
  return { state, transitions };
};


return {mina,darius,version,observation,continuantFile,transition,failureCode,runDetections,detectionOrdinals:()=>[...DETECTION_ORDINALS].map(([label,ordinal])=>({label,ordinal:String(ordinal)}))};
}
export const originalSource={path:'src/test/perceptualContinuantFiles.test.ts',sha256:'ddad0b5322eac57e06a619b1d3020943bd602c75e88385b34669c500cfe4f0b9'} as const;
