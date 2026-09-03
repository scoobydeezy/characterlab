import { describe, expect, it } from 'vitest';
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

const observerId = 'character/mina';
const experienceId = 'experience/classification';
const detectionId = { observerId, detectionId: 'detection/visual-1' };
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
  featureObservationId: `feature-observation/${ordinal.toString().padStart(2, '0')}`,
  observerId,
  currentDetectionId: detectionId,
  perceptualReferentId: continuant,
  perceptualFeatureId,
  booleanValue,
  observationChannelId: 'observation-channel/controlled-visual',
  supportingObservationIds: [{ observerId, observationId: `observation/${ordinal.toString().padStart(2, '0')}` }],
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
  featureObservations: [...featureObservations].sort((left, right) => left.featureObservationId.localeCompare(right.featureObservationId)),
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

describe('SEM-001D typed continuant-classification conformance', () => {
  it('CV-SEM-041 classifies continuants independently and rejects event-files as carriers', () => {
    const result = classifyContinuant(initialModel(), request([
      feature(PerceptualFeatureId.ObservedPersonForm, true, 1),
      feature(PerceptualFeatureId.ObservedDiscreteObjectForm, true, 2),
      feature(PerceptualFeatureId.ObservedEnclosureForm, true, 3),
    ]), 0n);
    expect(result.classifications.map((entry) => entry.perceptualFacetId)).toEqual([
      PerceptualFacetId.AppearsDiscreteObjectLike,
      PerceptualFacetId.AppearsInteriorSpaceLike,
      PerceptualFacetId.AppearsPersonLike,
    ]);

    const eventFile: PerceptualEventReferentId = { observerId, observerEventSequence: 17n };
    expect(() => classifyContinuant(initialModel(), request([], {
      perceptualReferentId: eventFile as unknown as PerceptualReferentId,
    }), 0n)).toThrowError(expect.objectContaining({ code: 'CARRIER_TYPE_MISMATCH' }));
  });

  it('CV-SEM-042 responds only to permitted evidence and keeps truth/perceptual namespaces distinct', () => {
    const visibleTrue = classifyContinuant(initialModel(), request([
      feature(PerceptualFeatureId.ObservedMetallicSurface, true, 1),
    ]), 0n);
    const visibleFalse = classifyContinuant(initialModel(), request([
      feature(PerceptualFeatureId.ObservedMetallicSurface, false, 1),
    ]), 0n);
    const hiddenTruthVariant = classifyContinuant(initialModel(), request([
      feature(PerceptualFeatureId.ObservedMetallicSurface, true, 1),
    ]), 0n);
    expect(visibleTrue).toEqual(hiddenTruthVariant);
    expect(classificationSemanticView(visibleTrue.classifications)).not.toEqual(classificationSemanticView(visibleFalse.classifications));

    const wrongNamespace = INITIAL_PERCEPTUAL_FACET_DEFINITIONS.map((definition) =>
      definition.perceptualFacetId === PerceptualFacetId.AppearsMetallic
        ? { ...definition, perceptualFacetId: 'world-semantic-facet/metal' as PerceptualFacetId }
        : definition);
    expect(() => compilePerceptualClassificationModel(
      'model/wrong-namespace', wrongNamespace, INITIAL_PERCEPTUAL_CLASSIFICATION_RULES, INITIAL_CLASSIFICATION_DERIVATIONS,
    )).toThrowError(expect.objectContaining({ code: 'UNKNOWN_FACET' }));
  });

  it('CV-SEM-043 distinguishes NoAssertion, Assert(false), MissingAsFalse, and invalid Unknown', () => {
    expect(classifyContinuant(initialModel(), request([]), 0n).classifications).toEqual([]);
    const explicitFalse = classifyContinuant(initialModel(), request([
      feature(PerceptualFeatureId.ObservedBluntForm, false, 1),
    ]), 0n);
    expect(explicitFalse.classifications[0].typedPerceivedValue).toBe(false);

    const bluntRule = INITIAL_PERCEPTUAL_CLASSIFICATION_RULES.find(
      (rule) => rule.outputPerceptualFacetId === PerceptualFacetId.AppearsBlunt,
    )!;
    const missingAsFalse: ClassificationDerivation = {
      derivationFunctionId: bluntRule.derivationFunctionId,
      derive: () => assertClassification(false),
    };
    const derivations = INITIAL_CLASSIFICATION_DERIVATIONS.map((derivation) =>
      derivation.derivationFunctionId === missingAsFalse.derivationFunctionId ? missingAsFalse : derivation);
    const invalidModel = compilePerceptualClassificationModel(
      'model/missing-as-false', INITIAL_PERCEPTUAL_FACET_DEFINITIONS, INITIAL_PERCEPTUAL_CLASSIFICATION_RULES, derivations,
    );
    expect(() => classifyContinuant(invalidModel, request([]), 0n))
      .toThrowError(expect.objectContaining({ code: 'INVALID_RULE_RESULT' }));

    const unknown: ClassificationDerivation = {
      derivationFunctionId: bluntRule.derivationFunctionId,
      derive: () => ({ kind: 'unknown' } as never),
    };
    const unknownModel = compilePerceptualClassificationModel(
      'model/unknown', INITIAL_PERCEPTUAL_FACET_DEFINITIONS, INITIAL_PERCEPTUAL_CLASSIFICATION_RULES,
      INITIAL_CLASSIFICATION_DERIVATIONS.map((derivation) =>
        derivation.derivationFunctionId === unknown.derivationFunctionId ? unknown : derivation),
    );
    expect(() => classifyContinuant(unknownModel, request([]), 0n))
      .toThrowError(expect.objectContaining({ code: 'INVALID_RULE_RESULT' }));
    expect(noAssertion()).toEqual({ kind: 'no-assertion' });
  });

  it('CV-SEM-044 distinguishes missing features from explicit negative sensory evidence', () => {
    const missing = classifyContinuant(initialModel(), request([]), 0n);
    const negative = classifyContinuant(initialModel(), request([
      feature(PerceptualFeatureId.ObservedMetallicSurface, false, 1),
    ]), 0n);
    expect(missing.classifications).toEqual([]);
    expect(negative.classifications[0]).toMatchObject({
      perceptualFacetId: PerceptualFacetId.AppearsMetallic,
      typedPerceivedValue: false,
      supportingFeatureObservationIds: ['feature-observation/01'],
      supportingObservationIds: [{ observerId, observationId: 'observation/01' }],
    });

    const metallicRule = INITIAL_PERCEPTUAL_CLASSIFICATION_RULES.find(
      (rule) => rule.outputPerceptualFacetId === PerceptualFacetId.AppearsMetallic,
    )!;
    const falseFromPositive: ClassificationDerivation = {
      derivationFunctionId: metallicRule.derivationFunctionId,
      derive: () => assertClassification(false),
    };
    const invalidModel = compilePerceptualClassificationModel(
      'model/false-from-positive', INITIAL_PERCEPTUAL_FACET_DEFINITIONS, INITIAL_PERCEPTUAL_CLASSIFICATION_RULES,
      INITIAL_CLASSIFICATION_DERIVATIONS.map((derivation) =>
        derivation.derivationFunctionId === falseFromPositive.derivationFunctionId ? falseFromPositive : derivation),
    );
    expect(() => classifyContinuant(invalidModel, request([
      feature(PerceptualFeatureId.ObservedMetallicSurface, true, 1),
    ]), 0n)).toThrowError(expect.objectContaining({ code: 'NEGATIVE_EVIDENCE_REQUIRED' }));
  });

  it('CV-SEM-045 enforces exact booleans while independent appearance facets coexist', () => {
    const combined = classifyContinuant(initialModel(), request([
      feature(PerceptualFeatureId.ObservedPersonForm, true, 1),
      feature(PerceptualFeatureId.ObservedDiscreteObjectForm, true, 2),
      feature(PerceptualFeatureId.ObservedBluntForm, false, 3),
    ]), 0n);
    expect(combined.classifications.map((entry) => entry.typedPerceivedValue)).toEqual([false, true, true]);

    const wrongTyped = { ...feature(PerceptualFeatureId.ObservedPersonForm, true, 1), booleanValue: 'true' } as unknown as PermittedPerceptualFeatureObservation;
    expect(() => classifyContinuant(initialModel(), request([wrongTyped]), 0n))
      .toThrowError(expect.objectContaining({ code: 'INVALID_FEATURE_OBSERVATION' }));
  });

  it('CV-SEM-046 requires exact observer-side feature and observation provenance', () => {
    const result = classifyContinuant(initialModel(), request([
      feature(PerceptualFeatureId.ObservedElongatedForm, true, 1),
    ]), 10n);
    expect(result.classifications[0]).toMatchObject({
      classificationEvidenceId: 10n,
      classificationRuleId: 'classification-rule/elongated-form',
      supportingFeatureObservationIds: ['feature-observation/01'],
      supportingObservationIds: [{ observerId, observationId: 'observation/01' }],
    });
    expect(result.classifications[0]).not.toHaveProperty('semanticReferentId');
    expect(result.classifications[0]).not.toHaveProperty('worldSemanticFacetId');

    const truthLeaking = {
      ...feature(PerceptualFeatureId.ObservedElongatedForm, true, 1),
      truthReferentId: 'person.glen',
    } as PermittedPerceptualFeatureObservation;
    expect(() => classifyContinuant(initialModel(), request([truthLeaking]), 0n))
      .toThrowError(expect.objectContaining({ code: 'FORBIDDEN_TRUTH_FIELD' }));
  });

  it('CV-SEM-047 enforces sole facet authority per model while allowing competing models', () => {
    const metallicRule = INITIAL_PERCEPTUAL_CLASSIFICATION_RULES.find(
      (rule) => rule.outputPerceptualFacetId === PerceptualFacetId.AppearsMetallic,
    )!;
    expect(() => compilePerceptualClassificationModel(
      'model/missing-authority',
      INITIAL_PERCEPTUAL_FACET_DEFINITIONS,
      INITIAL_PERCEPTUAL_CLASSIFICATION_RULES.filter((rule) => rule !== metallicRule),
      INITIAL_CLASSIFICATION_DERIVATIONS,
    )).toThrowError(expect.objectContaining({ code: 'MISSING_FACET_AUTHORITY' }));

    const duplicate = { ...metallicRule, classificationRuleId: 'classification-rule/metallic-alternative' };
    expect(() => compilePerceptualClassificationModel(
      'model/duplicate-authority',
      INITIAL_PERCEPTUAL_FACET_DEFINITIONS,
      [...INITIAL_PERCEPTUAL_CLASSIFICATION_RULES, duplicate]
        .sort((left, right) => left.outputPerceptualFacetId.localeCompare(right.outputPerceptualFacetId)
          || left.classificationRuleId.localeCompare(right.classificationRuleId)),
      INITIAL_CLASSIFICATION_DERIVATIONS,
    )).toThrowError(expect.objectContaining({ code: 'DUPLICATE_FACET_AUTHORITY' }));

    const alternativeRule = {
      ...metallicRule,
      classificationRuleId: 'classification-rule/metallic-model-b',
      derivationFunctionId: 'derivation/metallic-model-b',
    };
    const alternativeDerivation: ClassificationDerivation = {
      derivationFunctionId: alternativeRule.derivationFunctionId,
      derive: (features) => features.length === 0 ? noAssertion() : assertClassification(features[0].booleanValue),
    };
    const modelA = initialModel();
    const modelB = compilePerceptualClassificationModel(
      'model/classification-alternative',
      INITIAL_PERCEPTUAL_FACET_DEFINITIONS,
      replaceRule(PerceptualFacetId.AppearsMetallic, alternativeRule),
      [...INITIAL_CLASSIFICATION_DERIVATIONS.filter((derivation) =>
        derivation.derivationFunctionId !== metallicRule.derivationFunctionId), alternativeDerivation],
    );
    expect(modelA.modelIdentity).not.toBe(modelB.modelIdentity);
    expect(modelA.rules.find((rule) => rule.outputPerceptualFacetId === PerceptualFacetId.AppearsMetallic)?.classificationRuleId)
      .not.toBe(modelB.rules.find((rule) => rule.outputPerceptualFacetId === PerceptualFacetId.AppearsMetallic)?.classificationRuleId);
  });

  it('CV-SEM-048 rejects duplicate or conflicting referent/facet assertions within one experience', () => {
    const result = classifyContinuant(initialModel(), request([
      feature(PerceptualFeatureId.ObservedPersonForm, true, 1),
    ]), 0n);
    const original = result.classifications[0];
    const duplicate: PerceptualClassificationEvidence = {
      ...original,
      classificationEvidenceId: 99n,
      typedPerceivedValue: false,
    };
    expect(() => validateExperienceClassifications(experienceId, [original, duplicate]))
      .toThrowError(expect.objectContaining({ code: 'DUPLICATE_CLASSIFICATION' }));
  });

  it('CV-SEM-049 preserves replay and ordinal opacity and rolls allocation back on failure', async () => {
    const classificationRequest = request([feature(PerceptualFeatureId.ObservedPersonForm, true, 1)]);
    const low = classifyContinuant(initialModel(), classificationRequest, 4n);
    const replay = classifyContinuant(initialModel(), structuredClone(classificationRequest), 4n);
    const shifted = classifyContinuant(initialModel(), classificationRequest, 900n);
    expect(replay).toEqual(low);
    expect(classificationSemanticView(low.classifications)).toEqual(classificationSemanticView(shifted.classifications));
    expect(low.classifications[0].classificationEvidenceId).not.toBe(shifted.classifications[0].classificationEvidenceId);

    interface FixtureState { readonly valid: boolean }
    const adapter: StateAdapter<FixtureState> = {
      clone: (state) => ({ ...state }),
      validate: (state) => { if (!state.valid) throw new Error('injected classification commit failure'); },
      canonicalValue: (state) => state.valid,
    };
    const handlerId = typedIdentifier(32000n, text('event/sem-001d-rollback'));
    const handlerKey = bytesToHex(canonicalEncode(handlerId));
    const handler: EventHandler<FixtureState> = ({ allocateRuntimeId }) => {
      const materialized = classifyContinuant(initialModel(), classificationRequest, allocateRuntimeId());
      expect(materialized.classifications[0].classificationEvidenceId).toBe(50n);
      return { nextState: { valid: false }, emittedEvents: [], traceContributions: [], outputs: [] };
    };
    const scheduler = new DeterministicScheduler({
      initialState: { valid: true },
      stateAdapter: adapter,
      handlers: new Map([[handlerKey, handler]]),
      maxSettlementWorkPerSimulationInstant: 10n,
      initialAllocators: { nextRuntimeId: 50n, nextEventId: 0n, nextEventSequence: 0n },
    });
    scheduler.schedule({
      dueAt: simInstant(1n), phase: 10n, eventTypeId: handlerId, payload: list([]), dependencies: list([]),
    });
    const before = scheduler.getAllocatorState();
    await expect(scheduler.settleNextInstant()).rejects.toThrow(/injected classification commit failure/);
    expect(scheduler.getAllocatorState()).toEqual(before);
  });

  it('CV-SEM-050 permits experience assembly and rejects recognition/psychology bypasses and prose logic', () => {
    expect(() => assertClassificationEmissionTarget('semantic-experience-assembly')).not.toThrow();
    for (const target of ['recognition-hypothesis', 'pressure', 'appraisal', 'identity', 'world-truth'] as const) {
      expect(() => assertClassificationEmissionTarget(target))
        .toThrowError(expect.objectContaining({ code: 'FORBIDDEN_EMISSION_TARGET' }));
    }

    const personRule = INITIAL_PERCEPTUAL_CLASSIFICATION_RULES.find(
      (rule) => rule.outputPerceptualFacetId === PerceptualFacetId.AppearsPersonLike,
    )!;
    const proseRule = { ...personRule, derivationFunctionId: 'llm/prose-classifier' };
    expect(() => compilePerceptualClassificationModel(
      'model/prose',
      INITIAL_PERCEPTUAL_FACET_DEFINITIONS,
      replaceRule(PerceptualFacetId.AppearsPersonLike, proseRule),
      INITIAL_CLASSIFICATION_DERIVATIONS,
    )).toThrowError(expect.objectContaining({ code: 'UNKNOWN_DERIVATION' }));
  });
});
