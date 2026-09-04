import { describe, expect, it } from 'vitest';
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

describe('SEM-001E typed perceptual event-pattern classification conformance', () => {
  it('CV-SEM-051 keeps event and continuant carriers and facet namespaces non-substitutable', () => {
    const result = classifyPerceptualEvent(initialModel(), request([
      feature(PerceptualEventFeatureId.ObservedRepeatedMotionPattern, true, 1),
    ]), 0n);
    expect(result.classifications[0]).toMatchObject({
      perceptualEventReferentId: eventFile,
      perceptualEventFacetId: PerceptualEventFacetId.AppearsRepetitiveMotionLike,
    });
    expect(() => classifyPerceptualEvent(initialModel(), request([], {
      perceptualEventReferentId: continuants[0] as unknown as PerceptualEventReferentId,
    }), 0n)).toThrowError(expect.objectContaining({ code: 'CARRIER_TYPE_MISMATCH' }));
  });

  it('CV-SEM-052 depends only on permitted event features, never hidden Action or EventType identity', () => {
    const pattern = request([feature(PerceptualEventFeatureId.ObservedRepeatedMotionPattern, true, 1)]);
    const sameFeaturesDifferentTruth = structuredClone(pattern);
    expect(classifyPerceptualEvent(initialModel(), pattern, 0n)).toEqual(classifyPerceptualEvent(initialModel(), sameFeaturesDifferentTruth, 0n));
    const differentFeaturesSameTruth = request([feature(PerceptualEventFeatureId.ObservedRepeatedMotionPattern, false, 1)]);
    expect(eventClassificationSemanticView(classifyPerceptualEvent(initialModel(), pattern, 0n).classifications))
      .not.toEqual(eventClassificationSemanticView(classifyPerceptualEvent(initialModel(), differentFeaturesSameTruth, 0n).classifications));
    const truthCopy = { ...feature(PerceptualEventFeatureId.ObservedRepeatedMotionPattern, true, 1), semanticActionReferentId: 'action.skip_rope' } as PermittedPerceptualEventFeatureObservation;
    expect(() => classifyPerceptualEvent(initialModel(), request([truthCopy]), 0n))
      .toThrowError(expect.objectContaining({ code: 'FORBIDDEN_TRUTH_FIELD' }));
  });

  it('CV-SEM-053 implements the exact necessary-feature conjunction without default false or hierarchy', () => {
    const complete = classifyPerceptualEvent(initialModel(), request(ropeFeatures([true, true, true])), 0n);
    expect(complete.classifications).toHaveLength(1);
    expect(complete.classifications[0]).toMatchObject({
      perceptualEventFacetId: PerceptualEventFacetId.AppearsRopeSkippingPatternLike,
      typedPerceivedValue: true,
    });
    const incomplete = classifyPerceptualEvent(initialModel(), request(ropeFeatures([true, true, true]).slice(0, 2)), 0n);
    expect(incomplete.classifications).toEqual([]);
    const negative = classifyPerceptualEvent(initialModel(), request(ropeFeatures([true, false, true])), 0n);
    expect(negative.classifications[0].typedPerceivedValue).toBe(false);
    const coarseOnly = classifyPerceptualEvent(initialModel(), request([
      feature(PerceptualEventFeatureId.ObservedRepeatedMotionPattern, true, 4),
      feature(PerceptualEventFeatureId.ObservedCoupledMotionAcrossContinuants, true, 5),
    ]), 0n);
    expect(coarseOnly.classifications.map((value) => value.perceptualEventFacetId)).toEqual([
      PerceptualEventFacetId.AppearsCoupledMultiContinuantMotionLike,
      PerceptualEventFacetId.AppearsRepetitiveMotionLike,
    ]);
  });

  it('CV-SEM-054 scopes every feature to one observer, event-file, detection window, and observer-side support', () => {
    const result = classifyPerceptualEvent(initialModel(), request(ropeFeatures([true, true, true])), 10n);
    expect(result.classifications[0]).toMatchObject({
      supportingPerceptualReferentIds: continuants,
      supportingObservationIds: [
        { observerId, observationId: 22000n },
        { observerId, observationId: 22001n },
        { observerId, observationId: 22002n },
      ],
    });
    const staleNegative = feature(PerceptualEventFeatureId.ObservedCyclicFlexibleContinuantArc, false, 2, {
      currentEventDetectionId: { observerId, eventDetectionOccurrenceId: 3202n },
    });
    expect(() => classifyPerceptualEvent(initialModel(), request([staleNegative]), 0n))
      .toThrowError(expect.objectContaining({ code: 'INVALID_FEATURE_OBSERVATION' }));

    const roleVariant = (eventRoleId: EventRoleId) => compilePerceivedBindings([{
      observerId,
      perceptualEventReferentId: eventFile,
      perceptualReferentId: continuants[0],
      eventRoleEvidence: { kind: 'exact', eventRoleId },
      supportingObservationIds: [{ observerId, observationId: 22005n }],
      occurredAt: 30n,
      transformationVersion: version,
    }], 100n).bindings;
    const withRoles = (bindings: ReturnType<typeof roleVariant>, classifications: readonly PerceptualEventClassificationEvidence[]) =>
      assemblePreRecognitionExperience({
        experienceId: 8101n, observerId, occurredAt: 30n,
        perceptualEventReferentIds: [eventFile], perceivedBindings: bindings,
        perceptualClassifications: [], perceptualEventClassifications: classifications,
        supportingObservationIds: [{ observerId, observationId: 22004n }], transformationVersion: version,
      });
    const actorExperience = withRoles(roleVariant(EventRoleId.Actor), result.classifications);
    const targetExperience = withRoles(roleVariant(EventRoleId.Target), result.classifications);
    expect(actorExperience.perceptualEventClassifications).toEqual(targetExperience.perceptualEventClassifications);
    expect(perceivedEventGrouping(actorExperience)).not.toEqual(perceivedEventGrouping(targetExperience));

    const negativeClassification = classifyPerceptualEvent(initialModel(), request([
      feature(PerceptualEventFeatureId.ObservedRepeatedMotionPattern, false, 6),
    ]), 20n).classifications;
    const stableBindingsA = withRoles(roleVariant(EventRoleId.Actor), result.classifications);
    const stableBindingsB = withRoles(roleVariant(EventRoleId.Actor), negativeClassification);
    expect(perceivedEventGrouping(stableBindingsA)).toEqual(perceivedEventGrouping(stableBindingsB));
    expect(stableBindingsA.perceptualEventClassifications).not.toEqual(stableBindingsB.perceptualEventClassifications);
  });

  it('CV-SEM-055 preserves false-merge contradictions and false-split equivalence without repair', () => {
    const early = classifyPerceptualEvent(initialModel(), request(ropeFeatures([true, true, true]), { experienceId: 8100n }), 0n);
    const late = classifyPerceptualEvent(initialModel(), request(ropeFeatures([true, false, true]), { experienceId: 8102n }), 1n);
    expect(early.classifications[0].perceptualEventReferentId).toEqual(late.classifications[0].perceptualEventReferentId);
    expect(early.classifications[0].typedPerceivedValue).not.toBe(late.classifications[0].typedPerceivedValue);
    const splitFile = { observerId, observerEventSequence: 9n };
    const splitFeatures = ropeFeatures([true, true, true]).map((value) => ({ ...value, perceptualEventReferentId: splitFile }));
    const split = classifyPerceptualEvent(initialModel(), request(splitFeatures, { perceptualEventReferentId: splitFile }), 2n);
    expect(split.classifications[0].typedPerceivedValue).toBe(early.classifications[0].typedPerceivedValue);
    expect(split.classifications[0].perceptualEventReferentId).not.toEqual(early.classifications[0].perceptualEventReferentId);
  });

  it('CV-SEM-056 appends across experiences and rejects duplicate or conflicting assertions within one', () => {
    const first = classifyPerceptualEvent(initialModel(), request([
      feature(PerceptualEventFeatureId.ObservedRepeatedMotionPattern, true, 1),
    ]), 0n).classifications[0];
    const later = { ...first, eventClassificationEvidenceId: 1n, experienceId: 8103n, typedPerceivedValue: false };
    expect(first).toMatchObject({ typedPerceivedValue: true });
    expect(later).toMatchObject({ typedPerceivedValue: false });
    const duplicate: PerceptualEventClassificationEvidence = { ...first, eventClassificationEvidenceId: 99n, typedPerceivedValue: false };
    expect(() => validateExperienceEventClassifications(first.experienceId, [first, duplicate]))
      .toThrowError(expect.objectContaining({ code: 'DUPLICATE_CLASSIFICATION' }));
  });

  it('CV-SEM-057 enforces sole facet authority per model and allows explicit competing models', () => {
    const target = INITIAL_PERCEPTUAL_EVENT_CLASSIFICATION_RULES.find((value) => value.outputPerceptualEventFacetId === PerceptualEventFacetId.AppearsRepetitiveMotionLike)!;
    expect(() => compilePerceptualEventClassificationModel(
      'model/missing', INITIAL_PERCEPTUAL_EVENT_FACET_DEFINITIONS,
      INITIAL_PERCEPTUAL_EVENT_CLASSIFICATION_RULES.filter((value) => value !== target), INITIAL_EVENT_CLASSIFICATION_DERIVATIONS,
    )).toThrowError(expect.objectContaining({ code: 'MISSING_FACET_AUTHORITY' }));
    const replacement = { ...target, eventClassificationRuleId: 'event-classification-rule/repeated-motion-b', derivationFunctionId: 'derivation/repeated-motion-b' };
    const derivation: EventClassificationDerivation = { derivationFunctionId: replacement.derivationFunctionId, derive: (features) => features.length ? assertEventClassification(features[0].booleanValue) : noEventClassificationAssertion() };
    const modelB = compilePerceptualEventClassificationModel(
      'model/event-pattern-b', INITIAL_PERCEPTUAL_EVENT_FACET_DEFINITIONS, replaceRule(PerceptualEventFacetId.AppearsRepetitiveMotionLike, replacement),
      [...INITIAL_EVENT_CLASSIFICATION_DERIVATIONS.filter((value) => value.derivationFunctionId !== target.derivationFunctionId), derivation],
    );
    expect(modelB.modelIdentity).not.toBe(initialModel().modelIdentity);
  });

  it('CV-SEM-058 requires executable registered rules and complete typed provenance', () => {
    const result = classifyPerceptualEvent(initialModel(), request([
      feature(PerceptualEventFeatureId.ObservedCoupledMotionAcrossContinuants, true, 1),
    ]), 0n).classifications[0];
    expect(result.eventClassificationRuleId).toBe('event-classification-rule/coupled-motion');
    expect(result.supportingEventFeatureObservationIds).toEqual([1n]);
    expect(result).not.toHaveProperty('semanticActionReferentId');
    const target = INITIAL_PERCEPTUAL_EVENT_CLASSIFICATION_RULES[0];
    const prose = { ...target, derivationFunctionId: 'llm/prose-event-classifier' };
    expect(() => compilePerceptualEventClassificationModel(
      'model/prose', INITIAL_PERCEPTUAL_EVENT_FACET_DEFINITIONS,
      replaceRule(target.outputPerceptualEventFacetId, prose), INITIAL_EVENT_CLASSIFICATION_DERIVATIONS,
    )).toThrowError(expect.objectContaining({ code: 'UNKNOWN_DERIVATION' }));
  });

  it('CV-SEM-059 preserves replay and ordinal opacity and rolls allocation back atomically', async () => {
    const classificationRequest = request([feature(PerceptualEventFeatureId.ObservedRepeatedMotionPattern, true, 1)]);
    const low = classifyPerceptualEvent(initialModel(), classificationRequest, 4n);
    const replay = classifyPerceptualEvent(initialModel(), structuredClone(classificationRequest), 4n);
    const shifted = classifyPerceptualEvent(initialModel(), classificationRequest, 900n);
    expect(replay).toEqual(low);
    expect(eventClassificationSemanticView(low.classifications)).toEqual(eventClassificationSemanticView(shifted.classifications));
    expect(low.classifications[0].eventClassificationEvidenceId).not.toBe(shifted.classifications[0].eventClassificationEvidenceId);
    interface FixtureState { readonly valid: boolean }
    const adapter: StateAdapter<FixtureState> = { clone: (state) => ({ ...state }), validate: (state) => { if (!state.valid) throw new Error('injected event-classification commit failure'); }, canonicalValue: (state) => state.valid };
    const handlerId = typedIdentifier(32001n, text('event/sem-001e-rollback'));
    const handler: EventHandler<FixtureState> = ({ allocateRuntimeId }) => {
      expect(classifyPerceptualEvent(initialModel(), classificationRequest, allocateRuntimeId()).classifications[0].eventClassificationEvidenceId).toBe(50n);
      return { nextState: { valid: false }, emittedEvents: [], traceContributions: [], outputs: [] };
    };
    const scheduler = new DeterministicScheduler({ initialState: { valid: true }, stateAdapter: adapter, handlers: new Map([[bytesToHex(canonicalEncode(handlerId)), handler]]), maxSettlementWorkPerSimulationInstant: 10n, initialAllocators: { nextRuntimeId: 50n, nextEventId: 0n, nextEventSequence: 0n } });
    scheduler.schedule({ dueAt: simInstant(1n), phase: 10n, eventTypeId: handlerId, payload: list([]), dependencies: list([]) });
    const before = scheduler.getAllocatorState();
    await expect(scheduler.settleNextInstant()).rejects.toThrow(/injected event-classification commit failure/);
    expect(scheduler.getAllocatorState()).toEqual(before);
  });

  it('CV-SEM-060 makes action appearance an event pattern only and blocks every direct bypass', () => {
    const result = classifyPerceptualEvent(initialModel(), request(ropeFeatures([true, true, true])), 0n).classifications[0];
    expect(result.perceptualEventFacetId).toBe(PerceptualEventFacetId.AppearsRopeSkippingPatternLike);
    expect(result).not.toHaveProperty('semanticActionReferentId');
    expect(result).not.toHaveProperty('actionSchemaRecognitionHypothesis');
    const assembled = assemblePreRecognitionExperience({
      experienceId: result.experienceId,
      observerId,
      occurredAt: 30n,
      perceptualEventReferentIds: [eventFile],
      perceivedBindings: [],
      perceptualClassifications: [],
      perceptualEventClassifications: [result],
      supportingObservationIds: [{ observerId, observationId: 22004n }],
      transformationVersion: version,
    });
    expect(assembled.perceptualEventClassifications).toEqual([result]);
    expect(() => compilePerceivedBindings([{
      observerId,
      perceptualEventReferentId: eventFile,
      perceptualReferentId: continuants[0],
      eventRoleEvidence: { kind: 'exact', eventRoleId: EventRoleId.Action },
      supportingObservationIds: [{ observerId, observationId: 22003n }],
      occurredAt: 30n,
      transformationVersion: version,
    }], 100n)).toThrowError(expect.objectContaining({ code: 'ACTION_AS_CONTINUANT_FILE' }));
    expect(() => assertEventClassificationEmissionTarget('semantic-experience-assembly')).not.toThrow();
    for (const target of ['action-schema-recognition', 'causal-role', 'appraisal', 'pressure', 'option', 'world-truth'] as const) {
      expect(() => assertEventClassificationEmissionTarget(target)).toThrowError(expect.objectContaining({ code: 'FORBIDDEN_EMISSION_TARGET' }));
    }
  });
});
