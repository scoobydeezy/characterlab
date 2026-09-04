/**
 * `SEM-001J` — canonical construction for the authoritative evidence chain.
 *
 * `semanticCodecs.ts` accepted the construction boundary and covers the identity records, the
 * continuant/event file lifecycle, and the two state roots. It does not cover the records that
 * carry the *result* of a run: truth bindings, perceived bindings, classification evidence, the
 * assembled experience, causal-role evidence, and recognition resolutions. Until those have a
 * canonical construction, an integrated run can only be checked by comparing in-memory objects —
 * which is exactly the shape the `SEM-001I.3` carried condition forbids, because a symbolic string
 * occurrence ID compares equal to itself perfectly well.
 *
 * So this module completes the chain onto the frozen `SEM-001I.2` allocation. Every occurrence
 * identity here is an allocated ordinal in its accepted namespace, every governed identity is a
 * typed identifier in its accepted namespace, and every union validates its tag/payload contract
 * before construction. Nothing is added to the allocation: this is construction over numbers
 * `SEM-001I.2` already froze.
 *
 * The seam-version fields admit only the accepted `SEM-001A..H` contracts, so a record labelled
 * with a fixture-scoped or legacy version cannot be built at all.
 */
import {
  set, text, unsigned,
  type CanonicalValue,
} from '../substrate/canonicalEncoding';
import type { EventBinding } from './eventBindings';
import type { PerceptualReferentId } from './perceptualContinuantFiles';
import type {
  PerceivedBindingEvidence,
  PerceptualEventReferentId,
  PreRecognitionSemanticExperience,
} from './perceptualEventFiles';
import type { PerceptualClassificationEvidence } from './perceptualClassification';
import type { RecognitionResolutionRecord } from './recognition';
import type { CausalRoleEvidence, CharacterEvidenceRef } from './evidenceProvenance';
import {
  assertAdmittedTransformationVersion,
  observerIdValue,
  perceptualEventReferentIdValue,
  perceptualReferentIdValue,
  semanticOccurrenceId,
  semanticRecordValue,
  semanticTypedId,
  semanticUnionValue,
  supportingObservationIdValue,
} from './semanticCodecs';

// ---------------------------------------------------------------------------
// Truth side
// ---------------------------------------------------------------------------

/** Type 211. The canonical binding stores a `SemanticReferentId`, never the validation wrapper. */
export function eventBindingValue(binding: EventBinding): CanonicalValue {
  return semanticRecordValue('EventBinding', {
    EventBindingId: semanticOccurrenceId('EventBindingId', binding.eventBindingId),
    EventRoleId: semanticTypedId('EventRoleId', text(binding.eventRoleId)),
    SemanticReferentId: semanticTypedId('SemanticReferentId', text(binding.semanticReferent.semanticReferentId)),
  });
}

/** Type 210. `WorldEventId` is the semantic truth-event occurrence, not the scheduler `EventId`. */
export function worldEventTruthValue(input: {
  readonly worldEventOrdinal: bigint;
  readonly eventTypeId: string;
  readonly occurredAt: bigint;
  readonly bindings: readonly EventBinding[];
}): CanonicalValue {
  return semanticRecordValue('WorldEventTruth', {
    WorldEventId: semanticOccurrenceId('WorldEventId', input.worldEventOrdinal),
    EventTypeId: semanticTypedId('EventTypeId', text(input.eventTypeId)),
    OccurredAt: unsigned(input.occurredAt),
    EventBindings: set(input.bindings.map(eventBindingValue)),
  });
}

// ---------------------------------------------------------------------------
// Observer-side evidence
// ---------------------------------------------------------------------------

export const EventRoleEvidenceTag = Object.freeze({ ExactEventRole: 1n, UnresolvedEventRole: 2n });

/**
 * Type 223. The unresolved variant carries no role field, so a truth role cannot ride along inside
 * a projection that claims not to have resolved one.
 *
 * The payload is passed through from whatever the input actually carries rather than being chosen
 * by the constructor, so the *accepted union matrix* decides admissibility. A constructor that
 * built the unresolved variant by omission would silently drop an illegal role field instead of
 * refusing it, which would make the matrix decorative.
 */
export function eventRoleEvidenceValue(
  evidence: PerceivedBindingEvidence['eventRoleEvidence'],
): CanonicalValue {
  const eventRoleId = (evidence as { readonly eventRoleId?: string }).eventRoleId;
  return semanticUnionValue(
    'EventRoleEvidence',
    evidence.kind === 'exact'
      ? EventRoleEvidenceTag.ExactEventRole
      : EventRoleEvidenceTag.UnresolvedEventRole,
    { EventRoleId: eventRoleId === undefined ? undefined : semanticTypedId('EventRoleId', text(eventRoleId)) },
  );
}

/** Type 224. */
export function perceivedBindingEvidenceValue(binding: PerceivedBindingEvidence): CanonicalValue {
  assertAdmittedTransformationVersion(binding.transformationVersion);
  return semanticRecordValue('PerceivedBindingEvidence', {
    PerceivedBindingId: semanticOccurrenceId('PerceivedBindingId', binding.perceivedBindingId),
    ObserverId: observerIdValue(binding.observerId),
    PerceptualEventReferentId: perceptualEventReferentIdValue(binding.perceptualEventReferentId),
    PerceptualReferentId: perceptualReferentIdValue(binding.perceptualReferentId),
    EventRoleEvidence: eventRoleEvidenceValue(binding.eventRoleEvidence),
    SupportingObservationIds: set(binding.supportingObservationIds
      .map((value) => supportingObservationIdValue(value.observerId, value.observationId))),
    OccurredAt: unsigned(binding.occurredAt),
    TransformationVersion: text(binding.transformationVersion),
  });
}

/** Type 225. */
export function perceptualClassificationEvidenceValue(
  classification: PerceptualClassificationEvidence,
): CanonicalValue {
  assertAdmittedTransformationVersion(classification.transformationVersion);
  return semanticRecordValue('PerceptualClassificationEvidence', {
    ClassificationEvidenceId: semanticOccurrenceId(
      'ClassificationEvidenceId', classification.classificationEvidenceId),
    ExperienceId: semanticOccurrenceId('ExperienceId', classification.experienceId),
    ObserverId: observerIdValue(classification.observerId),
    PerceptualReferentId: perceptualReferentIdValue(classification.perceptualReferentId),
    PerceptualFacetId: semanticTypedId('PerceptualFacetId', text(classification.perceptualFacetId)),
    TypedPerceivedValue: classification.typedPerceivedValue,
    ClassificationRuleId: semanticTypedId(
      'PerceptualClassificationRuleId', text(classification.classificationRuleId)),
    SupportingFeatureObservationIds: set(classification.supportingFeatureObservationIds
      .map((ordinal) => semanticOccurrenceId('FeatureObservationId', ordinal))),
    SupportingObservationIds: set(classification.supportingObservationIds
      .map((value) => supportingObservationIdValue(value.observerId, value.observationId))),
    OccurredAt: unsigned(classification.occurredAt),
    TransformationVersion: text(classification.transformationVersion),
  });
}

/** Type 227. The assembled experience is immutable once built; this is its canonical form. */
export function preRecognitionSemanticExperienceValue(
  experience: PreRecognitionSemanticExperience,
): CanonicalValue {
  assertAdmittedTransformationVersion(experience.transformationVersion);
  return semanticRecordValue('PreRecognitionSemanticExperience', {
    ExperienceId: semanticOccurrenceId('ExperienceId', experience.experienceId),
    ObserverId: observerIdValue(experience.observerId),
    OccurredAt: unsigned(experience.occurredAt),
    PerceptualEventReferentIds: set(
      experience.perceptualEventReferentIds.map(perceptualEventReferentIdValue)),
    PerceivedBindings: set(experience.perceivedBindings.map(perceivedBindingEvidenceValue)),
    PerceptualClassifications: set(
      experience.perceptualClassifications.map(perceptualClassificationEvidenceValue)),
    PerceptualEventClassifications: set([]),
    SupportingObservationIds: set(experience.supportingObservationIds
      .map((value) => supportingObservationIdValue(value.observerId, value.observationId))),
    TransformationVersion: text(experience.transformationVersion),
  });
}

// ---------------------------------------------------------------------------
// Character-relative provenance
// ---------------------------------------------------------------------------

/**
 * Type 237. One tag per reference class, in the accepted registry order: the tag, the payload field
 * it carries, and the occurrence namespace that field's ordinal is minted in. Each variant carries
 * exactly its own field and forbids the other eight, so a reference cannot be widened into a second
 * kind by adding a field.
 */
const EVIDENCE_REF_CONTRACTS = Object.freeze({
  'observation': [1n, 'ObservationId'],
  'continuant-feature': [2n, 'FeatureObservationId'],
  'event-feature': [3n, 'EventFeatureObservationId'],
  'perceived-binding': [4n, 'PerceivedBindingId'],
  'continuant-classification': [5n, 'ClassificationEvidenceId'],
  'event-classification': [6n, 'EventClassificationEvidenceId'],
  'recognition-cue': [7n, 'RecognitionCueEvidenceId'],
  'recognition-resolution': [8n, 'RecognitionResolutionId'],
  'causal-role': [9n, 'CausalRoleEvidenceId'],
} as const) satisfies Readonly<Record<CharacterEvidenceRef['kind'], readonly [bigint, string]>>;

const refOrdinal = (ref: CharacterEvidenceRef): bigint => {
  switch (ref.kind) {
    case 'observation': return ref.observationId;
    case 'continuant-feature': return ref.featureObservationId;
    case 'event-feature': return ref.eventFeatureObservationId;
    case 'perceived-binding': return ref.perceivedBindingId;
    case 'continuant-classification': return ref.classificationEvidenceId;
    case 'event-classification': return ref.eventClassificationEvidenceId;
    case 'recognition-cue': return ref.recognitionCueEvidenceId;
    case 'recognition-resolution': return ref.recognitionResolutionId;
    case 'causal-role': return ref.causalRoleEvidenceId;
  }
};

export function characterEvidenceRefValue(ref: CharacterEvidenceRef): CanonicalValue {
  // The payload field and its occurrence namespace share a name in the accepted allocation, so one
  // table entry fixes both and they cannot drift apart.
  const [tag, fieldName] = EVIDENCE_REF_CONTRACTS[ref.kind];
  return semanticUnionValue('CharacterEvidenceRef', tag, {
    [fieldName]: semanticOccurrenceId(fieldName, refOrdinal(ref)),
  });
}

/** Type 240. */
export function causalRoleEvidenceValue(evidence: CausalRoleEvidence): CanonicalValue {
  assertAdmittedTransformationVersion(evidence.transformationVersion);
  return semanticRecordValue('CausalRoleEvidence', {
    CausalRoleEvidenceId: semanticOccurrenceId('CausalRoleEvidenceId', evidence.causalRoleEvidenceId),
    ExperienceId: semanticOccurrenceId('ExperienceId', evidence.experienceId),
    ObserverId: observerIdValue(evidence.observerId),
    PerceptualEventReferentId: perceptualEventReferentIdValue(evidence.perceptualEventReferentId),
    PerceptualReferentId: perceptualReferentIdValue(evidence.perceptualReferentId),
    CausalRoleId: semanticTypedId('CausalRoleId', text(evidence.causalRoleId)),
    CausalRoleDerivationRuleId: semanticTypedId(
      'CausalRoleDerivationRuleId', text(evidence.causalRoleDerivationRuleId)),
    SupportingEvidenceRefs: set(evidence.supportingEvidenceRefs.map(characterEvidenceRefValue)),
    OccurredAt: unsigned(evidence.occurredAt),
    TransformationVersion: text(evidence.transformationVersion),
  });
}

// ---------------------------------------------------------------------------
// Recognition
// ---------------------------------------------------------------------------

export const RecognitionResolutionTag = Object.freeze({ AssertedCandidate: 1n, Withdrawn: 2n });

/** Type 235. Payload passed through for the same reason as `eventRoleEvidenceValue` above. */
export function recognitionResolutionValue(
  resolution: RecognitionResolutionRecord['resolution'],
): CanonicalValue {
  const candidate = (resolution as { readonly candidateSemanticReferentId?: string })
    .candidateSemanticReferentId;
  return semanticUnionValue(
    'RecognitionResolution',
    resolution.kind === 'asserted-candidate'
      ? RecognitionResolutionTag.AssertedCandidate
      : RecognitionResolutionTag.Withdrawn,
    {
      CandidateSemanticReferentId: candidate === undefined
        ? undefined : semanticTypedId('SemanticReferentId', text(candidate)),
    },
  );
}

/**
 * Type 236. `RevisesRecognitionResolutionId` is an allocated occurrence identity, not an in-memory
 * pointer to the record it revises: the append-only chain is expressible in canonical bytes, which
 * is what lets a save/load boundary carry a revision history rather than reconstruct one.
 */
export function recognitionResolutionRecordValue(
  record: RecognitionResolutionRecord,
): CanonicalValue {
  assertAdmittedTransformationVersion(record.recognitionVersion);
  return semanticRecordValue('RecognitionResolutionRecord', {
    RecognitionResolutionId: semanticOccurrenceId(
      'RecognitionResolutionId', record.recognitionResolutionId),
    ExperienceId: semanticOccurrenceId('ExperienceId', record.experienceId),
    ObserverId: observerIdValue(record.observerId),
    PerceptualReferentId: perceptualReferentIdValue(record.perceptualReferentId),
    Resolution: recognitionResolutionValue(record.resolution),
    RecognitionRuleId: semanticTypedId('RecognitionRuleId', text(record.recognitionRuleId)),
    EvaluatedRecognitionCueEvidenceIds: set(record.evaluatedRecognitionCueEvidenceIds
      .map((ordinal) => semanticOccurrenceId('RecognitionCueEvidenceId', ordinal))),
    RevisesRecognitionResolutionId: record.revisesRecognitionResolutionId === undefined
      ? undefined
      : semanticOccurrenceId('RecognitionResolutionId', record.revisesRecognitionResolutionId),
    OccurredAt: unsigned(record.occurredAt),
    RecognitionVersion: text(record.recognitionVersion),
  });
}

export type { PerceptualReferentId, PerceptualEventReferentId };
