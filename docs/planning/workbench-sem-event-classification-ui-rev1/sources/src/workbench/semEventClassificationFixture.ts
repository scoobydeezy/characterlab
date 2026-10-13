import {authoredReferentKey} from '../test/fixtures/referentOrigin';

import { bytesToHex, canonicalEncode, list, text, typedIdentifier } from '../substrate/canonicalEncoding';
import { DeterministicScheduler, type EventHandler, type StateAdapter } from '../substrate/scheduler';
import { simInstant } from '../substrate/time';
import { EventRoleId } from '../semanticBinding/eventBindings';
import {
  INITIAL_EVENT_CLASSIFICATION_DERIVATIONS,
  INITIAL_PERCEPTUAL_EVENT_CLASSIFICATION_RULES,
  INITIAL_PERCEPTUAL_EVENT_FACET_DEFINITIONS,
  PerceptualEventFacetId,
  PerceptualEventFeatureId,
  assertEventClassification,
  assertEventClassificationEmissionTarget,
  classifyPerceptualEvent,
  compilePerceptualEventClassificationModel,
  eventClassificationSemanticView,
  noEventClassificationAssertion,
  validateExperienceEventClassifications,
  type EventClassificationDerivation,
  type EventClassificationRequest,
  type PerceptualEventClassificationEvidence,
  type PerceptualEventClassificationRuleDefinition,
  type PermittedPerceptualEventFeatureObservation,
} from '../semanticBinding/perceptualEventClassification';
import {
  assemblePreRecognitionExperience,
  compilePerceivedBindings,
  perceivedEventGrouping,
  type PerceptualEventReferentId,
  type PerceptualReferentId,
} from '../semanticBinding/perceptualEventFiles';

const SUPPORT_BASE = 21999n;
const observerId = 'character/mina';
const eventFile: PerceptualEventReferentId = { observerId, observerEventSequence: 8n };
const continuants: readonly PerceptualReferentId[] = [
  { observerId, observerTrackSequence: 4n },
  { observerId, observerTrackSequence: 7n },
];
const detection = { observerId, eventDetectionOccurrenceId: 3201n };
const version = 'perceptual-event-classification/0.1-candidate';

const initialModel = () => compilePerceptualEventClassificationModel(
  'model/event-pattern-reference',
  INITIAL_PERCEPTUAL_EVENT_FACET_DEFINITIONS,
  INITIAL_PERCEPTUAL_EVENT_CLASSIFICATION_RULES,
  INITIAL_EVENT_CLASSIFICATION_DERIVATIONS,
);

const feature = (
  perceptualEventFeatureId: PerceptualEventFeatureId,
  booleanValue: boolean,
  ordinal: number,
  overrides: Partial<PermittedPerceptualEventFeatureObservation> = {},
): PermittedPerceptualEventFeatureObservation => ({
  eventFeatureObservationId: BigInt(ordinal),
  observerId,
  currentEventDetectionId: detection,
  perceptualEventReferentId: eventFile,
  perceptualEventFeatureId,
  booleanValue,
  observationChannelId: 'observation-channel/controlled-event-pattern',
  supportingPerceptualReferentIds: continuants,
  supportingObservationIds: [{ observerId, observationId: SUPPORT_BASE + BigInt(ordinal) }],
  occurredAt: 30n,
  transformationVersion: version,
  ...overrides,
});

const request = (
  features: readonly PermittedPerceptualEventFeatureObservation[],
  overrides: Partial<EventClassificationRequest> = {},
): EventClassificationRequest => ({
  experienceId: 8101n,
  observerId,
  perceptualEventReferentId: eventFile,
  currentEventDetectionId: detection,
  featureObservations: [...features].sort((a, b) => a.eventFeatureObservationId < b.eventFeatureObservationId ? -1 : a.eventFeatureObservationId > b.eventFeatureObservationId ? 1 : 0),
  occurredAt: 30n,
  transformationVersion: version,
  ...overrides,
});

const ropeFeatures = (values: readonly [boolean, boolean, boolean]) => [
  feature(PerceptualEventFeatureId.ObservedRepeatedVerticalBodyMotion, values[0], 1),
  feature(PerceptualEventFeatureId.ObservedCyclicFlexibleContinuantArc, values[1], 2),
  feature(PerceptualEventFeatureId.ObservedBodyContinuantPassageCoordination, values[2], 3),
];

const replaceRule = (
  facetId: PerceptualEventFacetId,
  replacement: PerceptualEventClassificationRuleDefinition,
) => INITIAL_PERCEPTUAL_EVENT_CLASSIFICATION_RULES
  .map((rule) => rule.outputPerceptualEventFacetId === facetId ? replacement : rule)
  .sort((a, b) => a.outputPerceptualEventFacetId < b.outputPerceptualEventFacetId ? -1 : a.outputPerceptualEventFacetId > b.outputPerceptualEventFacetId ? 1 : 0
    || a.eventClassificationRuleId.localeCompare(b.eventClassificationRuleId));


export {SUPPORT_BASE,observerId,eventFile,continuants,detection,version,initialModel,feature,request,ropeFeatures,replaceRule};
export const originalSource={path:'src/test/perceptualEventClassification.test.ts',sha256:'96233df0e9939ccc29236f4e0156eaffab393b72efaf9e88af00567d3e25eee2'} as const;
