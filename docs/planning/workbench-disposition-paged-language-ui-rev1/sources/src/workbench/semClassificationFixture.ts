// Original helper bodies from src/test/phenSem001Classification.test.ts; no test hooks.

import {
  PerceptualClassificationContractError,
  PerceptualFacetId,
  PerceptualFeatureId,
  assertClassificationEmissionTarget,
  classifyContinuant,
  type ClassificationEmissionTarget,
  type ClassificationRequest,
  type PermittedPerceptualFeatureObservation,
} from '../semanticBinding/perceptualClassification';
import {
  CANONICAL_BINDING_REQUESTS,
  GLEN,
  MINA,
  SEM_D,
  SWAPPED_BINDING_REQUESTS,
  classificationModel,
  createRunAllocator,
  projectAllObservers,
  projectObserver,
  stringifyWithBigInts,
  truthBindings,
} from '../test/fixtures/phenSem001';

const observerId = MINA;
const track = { observerId, observerTrackSequence: 4n };
const detection = { observerId, detectionOccurrenceId: 900n };

const feature = (
  perceptualFeatureId: PerceptualFeatureId,
  booleanValue: boolean,
  ordinal: bigint,
): PermittedPerceptualFeatureObservation => ({
  featureObservationId: ordinal,
  observerId,
  currentDetectionId: detection,
  perceptualReferentId: track,
  perceptualFeatureId,
  booleanValue,
  observationChannelId: 'observation-channel/controlled-visual',
  supportingObservationIds: [{ observerId, observationId: 5000n + ordinal }],
  occurredAt: 20n,
  transformationVersion: SEM_D,
});

const request = (
  featureObservations: readonly PermittedPerceptualFeatureObservation[],
): ClassificationRequest => ({
  experienceId: 1n,
  observerId,
  perceptualReferentId: track,
  currentDetectionId: detection,
  featureObservations: [...featureObservations].sort((left, right) =>
    left.featureObservationId < right.featureObservationId ? -1
      : left.featureObservationId > right.featureObservationId ? 1 : 0),
  occurredAt: 20n,
  transformationVersion: SEM_D,
});

const classificationCode = (run: () => unknown): string => {
  try {
    run();
  } catch (error) {
    if (error instanceof PerceptualClassificationContractError) return error.code;
    throw error;
  }
  throw new Error('expected a classification contract failure');
};

const facetsOf = (classifications: readonly { readonly perceptualFacetId: string; readonly typedPerceivedValue: unknown }[]) =>
  classifications.map((value) => `${value.perceptualFacetId}=${String(value.typedPerceivedValue)}`).sort();


export {feature,request,classificationModel};
export const originalSource={path:'src/test/phenSem001Classification.test.ts',sha256:'a24acd229d67543848094d2736d6b3c6e649d26b279d49a3a9ce2689e07a4f78'} as const;
