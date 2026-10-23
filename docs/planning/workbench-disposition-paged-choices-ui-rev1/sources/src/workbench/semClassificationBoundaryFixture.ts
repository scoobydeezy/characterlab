import {authoredReferentKey} from '../test/fixtures/referentOrigin';

import { bytesToHex, canonicalEncode, list, text, typedIdentifier } from '../substrate/canonicalEncoding';
import { DeterministicScheduler, type EventHandler, type StateAdapter } from '../substrate/scheduler';
import { simInstant } from '../substrate/time';
import {
  INITIAL_CLASSIFICATION_DERIVATIONS,
  INITIAL_PERCEPTUAL_CLASSIFICATION_RULES,
  INITIAL_PERCEPTUAL_FACET_DEFINITIONS,
  PerceptualFacetId,
  PerceptualFeatureId,
  assertClassification,
  assertClassificationEmissionTarget,
  classificationSemanticView,
  classifyContinuant,
  compilePerceptualClassificationModel,
  noAssertion,
  validateExperienceClassifications,
  type ClassificationDerivation,
  type ClassificationRequest,
  type PerceptualClassificationEvidence,
  type PerceptualClassificationRuleDefinition,
  type PermittedPerceptualFeatureObservation,
} from '../semanticBinding/perceptualClassification';
import type { PerceptualEventReferentId, PerceptualReferentId } from '../semanticBinding/perceptualEventFiles';

const DEFAULT_SUPPORT = 20000n;
const observerId = 'character/mina';
const experienceId = 7900n;
const detectionId = { observerId, detectionOccurrenceId: 3101n };
const continuant: PerceptualReferentId = { observerId, observerTrackSequence: 17n };
const transformationVersion = 'perceptual-classification/0.1-candidate';

const initialModel = () => compilePerceptualClassificationModel(
  'model/classification-reference',
  INITIAL_PERCEPTUAL_FACET_DEFINITIONS,
  INITIAL_PERCEPTUAL_CLASSIFICATION_RULES,
  INITIAL_CLASSIFICATION_DERIVATIONS,
);

const feature = (
  perceptualFeatureId: PerceptualFeatureId,
  booleanValue: boolean,
  ordinal: number,
): PermittedPerceptualFeatureObservation => ({
  featureObservationId: BigInt(ordinal),
  observerId,
  currentDetectionId: detectionId,
  perceptualReferentId: continuant,
  perceptualFeatureId,
  booleanValue,
  observationChannelId: 'observation-channel/controlled-visual',
  supportingObservationIds: [{ observerId, observationId: DEFAULT_SUPPORT }],
  occurredAt: 20n,
  transformationVersion,
});

const request = (
  featureObservations: readonly PermittedPerceptualFeatureObservation[],
  overrides: Partial<ClassificationRequest> = {},
): ClassificationRequest => ({
  experienceId,
  observerId,
  perceptualReferentId: continuant,
  currentDetectionId: detectionId,
  featureObservations: [...featureObservations].sort((left, right) => left.featureObservationId < right.featureObservationId ? -1 : left.featureObservationId > right.featureObservationId ? 1 : 0),
  occurredAt: 20n,
  transformationVersion,
  ...overrides,
});

const replaceRule = (
  facetId: PerceptualFacetId,
  replacement: PerceptualClassificationRuleDefinition,
): readonly PerceptualClassificationRuleDefinition[] => INITIAL_PERCEPTUAL_CLASSIFICATION_RULES
  .map((rule) => rule.outputPerceptualFacetId === facetId ? replacement : rule)
  .sort((left, right) => left.outputPerceptualFacetId.localeCompare(right.outputPerceptualFacetId));


export {DEFAULT_SUPPORT,observerId,experienceId,detectionId,continuant,transformationVersion,initialModel,feature,request,replaceRule};
export const originalSource={path:'src/test/perceptualClassification.test.ts',sha256:'1024a2c2dd9ae71d4a8d29df207acc85545f6805ab382bee9d2ee2127388e0fe'} as const;
