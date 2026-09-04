import { describe, expect, it } from 'vitest';
import { EventRoleId, projectEventRoleEvidence, type EventBinding } from '../semanticBinding/eventBindings';
import {
  applyPerceptualTrackTransition,
  emptyPerceptualContinuantFileState,
  PerceptualContinuantFileContractError,
} from '../semanticBinding/perceptualContinuantFiles';
import { INITIAL_PERCEPTUAL_CLASSIFICATION_RULES } from '../semanticBinding/perceptualClassification';
import { admitObservationLane } from '../semanticBinding/phaseOrdering';
import {
  INITIAL_EVENT_CLASSIFICATION_DERIVATIONS,
  INITIAL_PERCEPTUAL_EVENT_CLASSIFICATION_RULES,
  INITIAL_PERCEPTUAL_EVENT_FACET_DEFINITIONS,
  PerceptualEventFacetId,
  PerceptualEventFeatureId,
  classifyPerceptualEvent,
  compilePerceptualEventClassificationModel,
  type PermittedPerceptualEventFeatureObservation,
} from '../semanticBinding/perceptualEventClassification';
import { SEMANTIC_OCCURRENCE_NAMESPACES } from '../semanticBinding/semanticSchemaRegistry';
import { semanticOccurrenceId } from '../semanticBinding/semanticCodecs';

const mina = 'character/mina';
const version = 'semantic-binding/0.1-candidate#SEM-001A';

/**
 * `SEM-001I.1` principle 10: every accepted observer-safe occurrence uses the run-scoped allocator
 * through its own typed namespace. Symbolic or content-derived string occurrence IDs are not
 * canonical. These vectors keep the migrated boundaries from silently regressing.
 */
describe('SEM-001J occurrence identity boundary', () => {
  it('allocates ExperienceId from the run-scoped allocator without restringifying it', () => {
    let next = 4200n;
    const allocate = () => next++;
    const admitted = admitObservationLane(
      { observerId: mina, lane: 'Current', dueAt: 10n, emitsCharacterAccessibleEvidence: true },
      allocate,
    );
    // The reservation carries the allocated ordinal itself.
    expect(admitted.reservation?.experienceId).toBe(4200n);
    expect(typeof admitted.reservation?.experienceId).toBe('bigint');

    // No evidence means no reservation and no allocation.
    const before = next;
    expect(admitObservationLane(
      { observerId: mina, lane: 'Current', dueAt: 10n, emitsCharacterAccessibleEvidence: false },
      allocate,
    ).reservation).toBeUndefined();
    expect(next).toBe(before);
  });

  it('rejects malformed detection and observation occurrence ordinals', () => {
    const code = (run: () => unknown): string => {
      try {
        run();
      } catch (error) {
        if (error instanceof PerceptualContinuantFileContractError) return error.code;
        throw error;
      }
      throw new Error('expected a continuant-file contract failure');
    };

    const request = (overrides: Record<string, unknown> = {}) => ({
      observerId: mina,
      currentDetectionId: { observerId: mina, detectionOccurrenceId: 3n },
      continuityKind: 'NewTrack' as const,
      supportingObservationIds: [{ observerId: mina, observationId: 9n }],
      occurredAt: 100n,
      transformationVersion: version,
      ...overrides,
    });

    expect(() => applyPerceptualTrackTransition(emptyPerceptualContinuantFileState(), request()))
      .not.toThrow();
    expect(code(() => applyPerceptualTrackTransition(emptyPerceptualContinuantFileState(), request({
      currentDetectionId: { observerId: mina, detectionOccurrenceId: -1n },
    })))).toBe('INVALID_TRACK_TRANSITION');
    expect(code(() => applyPerceptualTrackTransition(emptyPerceptualContinuantFileState(), request({
      supportingObservationIds: [{ observerId: mina, observationId: -1n }],
    })))).toBe('INVALID_SUPPORTING_OBSERVATION');
    // Strictly ascending: duplicate or out-of-order support is noncanonical.
    expect(code(() => applyPerceptualTrackTransition(emptyPerceptualContinuantFileState(), request({
      supportingObservationIds: [{ observerId: mina, observationId: 9n }, { observerId: mina, observationId: 9n }],
    })))).toBe('INVALID_SUPPORTING_OBSERVATION');
    expect(code(() => applyPerceptualTrackTransition(emptyPerceptualContinuantFileState(), request({
      supportingObservationIds: [{ observerId: mina, observationId: 9n }, { observerId: mina, observationId: 2n }],
    })))).toBe('INVALID_SUPPORTING_OBSERVATION');
  });

  it('orders supporting occurrence ordinals numerically inside emitted evidence', () => {
    // Ordinals 2, 9 and 10 straddle a decade boundary, so numeric order [2,9,10] and lexicographic
    // order [10,2,9] differ. The emitted support list must be the numeric one: an ordinal is an
    // opaque identity, and sorting its decimal digits would make canonical support order depend on
    // how large the allocator happens to have grown.
    const observerId = mina;
    const eventFile = { observerId, observerEventSequence: 8n };
    const continuants = [
      { observerId, observerTrackSequence: 4n },
      { observerId, observerTrackSequence: 7n },
    ];
    const detection = { observerId, eventDetectionOccurrenceId: 3201n };
    const eventVersion = 'perceptual-event-classification/0.1-candidate';

    const feature = (
      perceptualEventFeatureId: PerceptualEventFeatureId,
      ordinal: bigint,
    ): PermittedPerceptualEventFeatureObservation => ({
      eventFeatureObservationId: ordinal,
      observerId,
      currentEventDetectionId: detection,
      perceptualEventReferentId: eventFile,
      perceptualEventFeatureId,
      booleanValue: true,
      observationChannelId: 'observation-channel/controlled-event-pattern',
      supportingPerceptualReferentIds: continuants,
      supportingObservationIds: [{ observerId, observationId: 40000n + ordinal }],
      occurredAt: 30n,
      transformationVersion: eventVersion,
    });

    const features = [
      feature(PerceptualEventFeatureId.ObservedRepeatedVerticalBodyMotion, 9n),
      feature(PerceptualEventFeatureId.ObservedCyclicFlexibleContinuantArc, 10n),
      feature(PerceptualEventFeatureId.ObservedBodyContinuantPassageCoordination, 2n),
    ].sort((a, b) => a.eventFeatureObservationId < b.eventFeatureObservationId ? -1
      : a.eventFeatureObservationId > b.eventFeatureObservationId ? 1 : 0);

    const model = compilePerceptualEventClassificationModel(
      'model/event-pattern-reference',
      INITIAL_PERCEPTUAL_EVENT_FACET_DEFINITIONS,
      INITIAL_PERCEPTUAL_EVENT_CLASSIFICATION_RULES,
      INITIAL_EVENT_CLASSIFICATION_DERIVATIONS,
    );
    const result = classifyPerceptualEvent(model, {
      experienceId: 9500n,
      observerId,
      perceptualEventReferentId: eventFile,
      currentEventDetectionId: detection,
      featureObservations: features,
      occurredAt: 30n,
      transformationVersion: eventVersion,
    }, 0n);

    const ropePattern = result.classifications.find((value) =>
      value.perceptualEventFacetId === PerceptualEventFacetId.AppearsRopeSkippingPatternLike);
    expect(ropePattern).toBeDefined();
    expect(ropePattern!.supportingEventFeatureObservationIds).toEqual([2n, 9n, 10n]);
    // The lexicographic order a string sort would produce is explicitly not what is emitted.
    expect(ropePattern!.supportingEventFeatureObservationIds).not.toEqual([10n, 2n, 9n]);
  });

  it('flags when continuant support ordering becomes observable', () => {
    // Every accepted `SEM-001D` continuant rule takes exactly one input feature, so its
    // `supportingFeatureObservationIds` list is always a singleton and its sort is unobservable —
    // a lexicographic sort there is currently indistinguishable from a numeric one. That is a
    // structural fact, not test coverage. If a multi-input continuant rule is ever accepted, this
    // vector fails and a discriminating ordering case must be added alongside the event-side one.
    for (const rule of INITIAL_PERCEPTUAL_CLASSIFICATION_RULES) {
      expect(rule.permittedInputFeatureIds).toHaveLength(1);
    }
  });

  it('carries the typed continuant-file identity into perceived role projection', () => {
    const referent = { observerId: mina, observerTrackSequence: 17n };
    const binding: EventBinding = {
      eventBindingId: 200n,
      eventRoleId: EventRoleId.Companion,
      semanticReferent: { semanticReferentId: 'person.glen', domainTags: ['person'] },
    };

    const projected = projectEventRoleEvidence(binding, referent, { kind: 'preserve' });
    expect(projected?.perceptualReferentId).toEqual(referent);
    expect(projected?.eventRoleEvidence).toEqual({ kind: 'exact', eventRoleId: EventRoleId.Companion });

    // A symbolic handle is no longer accepted in the referent position.
    expect(() => projectEventRoleEvidence(binding, 'track/mina/17' as never, { kind: 'preserve' }))
      .toThrowError(expect.objectContaining({ code: 'INVALID_REFERENT' }));
    // Neither is a malformed identity record.
    expect(() => projectEventRoleEvidence(
      binding, { observerId: mina, observerTrackSequence: -1n }, { kind: 'preserve' },
    )).toThrowError(expect.objectContaining({ code: 'INVALID_REFERENT' }));
  });

  it('keeps every occurrence namespace distinct under the accepted allocation', () => {
    const names = Object.keys(SEMANTIC_OCCURRENCE_NAMESPACES);
    expect(names.length).toBe(16);
    const encoded = new Set(names.map((name) => {
      const id = semanticOccurrenceId(name as keyof typeof SEMANTIC_OCCURRENCE_NAMESPACES & string, 4n);
      return `${id.namespaceId}`;
    }));
    // Sixteen families, sixteen distinct namespaces, one shared ordinal.
    expect(encoded.size).toBe(16);
  });
});
