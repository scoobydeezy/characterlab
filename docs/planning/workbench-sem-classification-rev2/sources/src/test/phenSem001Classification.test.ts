import { describe, expect, it } from 'vitest';
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
} from './fixtures/phenSem001';

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

describe('PHEN-SEM-001 classification under permitted evidence', () => {
  it('CV-SEM-015 classifies one truth object differently for two observers', () => {
    const projections = projectAllObservers();
    const mina = projections.get(MINA)!;
    const glen = projections.get(GLEN)!;

    // Both perceive the same truth instrument. Mina receives metallic-surface evidence; Glen
    // receives elongated-form evidence. Neither receives the other's.
    const minaInstrument = mina.tracksByLabel.get('mina/instrument')!;
    const glenInstrument = glen.tracksByLabel.get('glen/instrument')!;

    const facetsFor = (
      projection: typeof mina,
      referentId: { readonly observerTrackSequence: bigint },
    ) => facetsOf(projection.classifications.filter((value) =>
      value.perceptualReferentId.observerTrackSequence === referentId.observerTrackSequence));

    const minaFacets = facetsFor(mina, minaInstrument);
    const glenFacets = facetsFor(glen, glenInstrument);

    expect(minaFacets).toContain(`${PerceptualFacetId.AppearsMetallic}=true`);
    expect(minaFacets).not.toContain(`${PerceptualFacetId.AppearsElongated}=true`);
    expect(glenFacets).toContain(`${PerceptualFacetId.AppearsElongated}=true`);
    expect(glenFacets).not.toContain(`${PerceptualFacetId.AppearsMetallic}=true`);

    // Same truth object, different permitted sensory evidence, different classifications.
    expect(minaFacets).not.toEqual(glenFacets);
    // Both nonetheless agree on the evidence they do share.
    expect(minaFacets).toContain(`${PerceptualFacetId.AppearsDiscreteObjectLike}=true`);
    expect(glenFacets).toContain(`${PerceptualFacetId.AppearsDiscreteObjectLike}=true`);
  });

  it('CV-SEM-015 holds classification fixed when only hidden truth changes', () => {
    // Identical permitted evidence, exchanged truth Actor and Companion referents.
    const canonical = projectObserver({
      observerId: GLEN, truth: truthBindings(CANONICAL_BINDING_REQUESTS),
      allocator: createRunAllocator(), experienceId: 1n,
    });
    const swapped = projectObserver({
      observerId: GLEN, truth: truthBindings(SWAPPED_BINDING_REQUESTS),
      allocator: createRunAllocator(), experienceId: 1n,
    });

    // The hidden change is real...
    expect(truthBindings(CANONICAL_BINDING_REQUESTS).find((b) => b.eventRoleId === 'event-role/actor')!
      .semanticReferent.semanticReferentId)
      .not.toBe(truthBindings(SWAPPED_BINDING_REQUESTS).find((b) => b.eventRoleId === 'event-role/actor')!
        .semanticReferent.semanticReferentId);
    // ...and the character's classifications are byte-identical across it. A registered truth fact
    // does not copy through merely because the model knows it.
    expect(stringifyWithBigInts(swapped.classifications))
      .toBe(stringifyWithBigInts(canonical.classifications));
  });

  it('CV-SEM-017 admits only registered facets and exact declared value types', () => {
    const model = classificationModel();

    // A registered feature classifies normally.
    const legal = classifyContinuant(
      model, request([feature(PerceptualFeatureId.ObservedMetallicSurface, true, 1n)]), 0n);
    expect(facetsOf(legal.classifications)).toEqual([`${PerceptualFacetId.AppearsMetallic}=true`]);

    // An unregistered facet id cannot enter the model at all.
    expect(classificationCode(() => classifyContinuant(
      { ...model, facetDefinitions: [...model.facetDefinitions, {
        perceptualFacetId: 'perceptual-facet/appears-friendly' as PerceptualFacetId,
        perceivedValueType: 'boolean',
        observationDomainValidatorId: 'validator/boolean',
        definitionVersion: 'facet/0.1-candidate',
      }] },
      request([feature(PerceptualFeatureId.ObservedMetallicSurface, true, 1n)]),
      0n,
    ))).toBe('UNKNOWN_FACET');

    // A freeform tag in the feature position is not a registered feature.
    expect(classificationCode(() => classifyContinuant(
      model,
      request([feature('perceptual-feature/looks-friendly' as PerceptualFeatureId, true, 1n)]),
      0n,
    ))).toBe('UNKNOWN_FEATURE');

    // A wrong-typed perceived value fails before emission: the declared type is exactly boolean.
    expect(classificationCode(() => classifyContinuant(
      model,
      request([{ ...feature(PerceptualFeatureId.ObservedMetallicSurface, true, 1n), booleanValue: 'yes' as never }]),
      0n,
    ))).toBe('INVALID_FEATURE_OBSERVATION');
  });

  it('CV-SEM-017 keeps a missing classification distinct from an explicit false', () => {
    const model = classificationModel();

    // Explicit negative evidence emits a present record carrying false.
    const explicitFalse = classifyContinuant(
      model, request([feature(PerceptualFeatureId.ObservedMetallicSurface, false, 1n)]), 0n);
    expect(facetsOf(explicitFalse.classifications)).toEqual([`${PerceptualFacetId.AppearsMetallic}=false`]);
    expect(explicitFalse.classifications).toHaveLength(1);

    // Absence of the feature emits no record at all — not a record carrying false.
    const missing = classifyContinuant(
      model, request([feature(PerceptualFeatureId.ObservedPersonForm, true, 1n)]), 0n);
    const metallic = missing.classifications.filter(
      (value) => value.perceptualFacetId === PerceptualFacetId.AppearsMetallic);
    expect(metallic).toEqual([]);

    // The two are structurally different, not two spellings of the same thing.
    expect(facetsOf(explicitFalse.classifications)).not.toEqual(facetsOf(missing.classifications));
  });

  it('CV-SEM-018 lets classification emit only into experience assembly', () => {
    // The one permitted target.
    expect(() => assertClassificationEmissionTarget('semantic-experience-assembly')).not.toThrow();

    // Every psychological and world-truth target is refused, including the named
    // ClassificationToPressure shortcut.
    const forbidden: readonly ClassificationEmissionTarget[] = [
      'recognition-hypothesis', 'appraisal', 'affect', 'motive', 'pressure',
      'reason', 'identity', 'relationship', 'world-truth',
    ];
    for (const target of forbidden) {
      expect(classificationCode(() => assertClassificationEmissionTarget(target)))
        .toBe('FORBIDDEN_EMISSION_TARGET');
    }
  });

  it('CV-SEM-018 produces no appraisal-shaped field anywhere in classification evidence', () => {
    const projections = projectAllObservers();
    const psychologicalFields = [
      'appraisal', 'affect', 'motive', 'pressure', 'reason', 'valence',
      'salience', 'arousal', 'intensity', 'confidence', 'weight', 'score',
    ];

    for (const observerId of [MINA, GLEN] as const) {
      const projection = projections.get(observerId)!;
      const serialized = stringifyWithBigInts(projection.classifications).toLowerCase();
      for (const field of psychologicalFields) {
        expect(serialized).not.toContain(`"${field}"`);
      }
      // Classification evidence carries exactly the accepted field set and nothing more.
      for (const classification of projection.classifications) {
        expect(Object.keys(classification).sort()).toEqual([
          'classificationEvidenceId', 'classificationRuleId', 'experienceId', 'observerId',
          'occurredAt', 'perceptualFacetId', 'perceptualReferentId', 'supportingFeatureObservationIds',
          'supportingObservationIds', 'transformationVersion', 'typedPerceivedValue',
        ]);
      }
    }
  });
});
