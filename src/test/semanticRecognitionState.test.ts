import { describe, expect, it } from 'vitest';
import { bytesToHex } from '../substrate/canonicalEncoding';
import { EventRoleId } from '../semanticBinding/eventBindings';
import {
  assemblePreRecognitionExperience,
  compilePerceivedBindings,
  type PerceptualEventReferentId,
  type PerceptualReferentId,
  type PreRecognitionSemanticExperience,
} from '../semanticBinding/perceptualEventFiles';
import {
  INITIAL_RECOGNITION_DERIVATION,
  INITIAL_RECOGNITION_RULE,
  compileRecognitionModel,
  evaluateContinuantRecognition,
  recognitionSemanticView,
  RecognitionContractError,
  type ObserverIdentitySymbolMapping,
  type PermittedRecognitionCueEvidence,
  type RecognitionCandidateCatalogEntry,
  type RecognitionRequest,
} from '../semanticBinding/recognition';
import { assertCanonicalRoundTrip, encodeSemanticValue, semanticUnionValue, semanticOccurrenceId } from '../semanticBinding/semanticCodecs';

const observerId = 'character/mina';
const track: PerceptualReferentId = { observerId, observerTrackSequence: 17n };
const eventFile: PerceptualEventReferentId = { observerId, observerEventSequence: 4n };
const version = 'recognition/0.1-candidate';
const GLEN_SYMBOL = 'perceived-symbol/GLEN';

const model = () => compileRecognitionModel(
  'model/recognition-reference', [INITIAL_RECOGNITION_RULE], [INITIAL_RECOGNITION_DERIVATION],
);

const experience = (experienceId = 9000n, occurredAt = 10n): PreRecognitionSemanticExperience => {
  const bindings = compilePerceivedBindings([{
    observerId,
    perceptualEventReferentId: eventFile,
    perceptualReferentId: track,
    eventRoleEvidence: { kind: 'exact', eventRoleId: EventRoleId.Participant },
    supportingObservationIds: [{ observerId, observationId: `observation/${experienceId}` }],
    occurredAt,
    transformationVersion: version,
  }], 40n).bindings;
  return assemblePreRecognitionExperience({
    experienceId, observerId, occurredAt,
    perceptualEventReferentIds: [eventFile], perceivedBindings: bindings,
    perceptualClassifications: [], perceptualEventClassifications: [],
    supportingObservationIds: [{ observerId, observationId: `observation/${experienceId}` }],
    transformationVersion: version,
  });
};

const catalogEntry = (
  candidateSemanticReferentId: string,
  recognitionTemplateIds: readonly string[],
): RecognitionCandidateCatalogEntry => ({
  observerId, candidateSemanticReferentId, candidateDomain: 'Person',
  recognitionTemplateIds, catalogEntryVersion: version,
});

const catalog = (): readonly RecognitionCandidateCatalogEntry[] => [
  catalogEntry('person.darius', ['template/darius-face']),
  catalogEntry('person.glen', ['template/glen-face']),
];

const mapping = (
  observerSymbolCandidateMappingId: bigint,
  candidateSemanticReferentId: string,
  perceivedIdentitySymbolId = GLEN_SYMBOL,
): ObserverIdentitySymbolMapping => ({
  observerSymbolCandidateMappingId, observerId, perceivedIdentitySymbolId,
  candidateSemanticReferentId, mappingVersion: version,
});

const identityClaimCue = (
  exp: PreRecognitionSemanticExperience,
  candidateSemanticReferentId: string,
  observerSymbolCandidateMappingId: bigint,
): PermittedRecognitionCueEvidence => ({
  recognitionCueEvidenceId: 'recognition-cue/01',
  experienceId: exp.experienceId,
  observerId,
  perceptualReferentId: track,
  candidateSemanticReferentId,
  recognitionCueSource: {
    kind: 'identity-claim-mapping',
    perceivedIdentitySymbolId: GLEN_SYMBOL,
    observerSymbolCandidateMappingId,
  },
  cuePolarity: 'SupportsCandidate',
  supportingExperienceEvidenceRefs: [
    { kind: 'perceived-binding', perceivedBindingId: exp.perceivedBindings[0].perceivedBindingId },
  ],
  occurredAt: exp.occurredAt,
  transformationVersion: version,
});

const request = (
  exp: PreRecognitionSemanticExperience,
  cues: readonly PermittedRecognitionCueEvidence[],
  identitySymbolMappings: readonly ObserverIdentitySymbolMapping[],
  candidateCatalog: readonly RecognitionCandidateCatalogEntry[] = catalog(),
): RecognitionRequest => ({
  experience: exp,
  perceptualReferentId: track,
  candidateCatalog,
  identitySymbolMappings,
  cueEvidence: cues,
  priorResolutionHistory: [],
  recognitionVersion: version,
});

const recognitionCode = (run: () => unknown): string => {
  try {
    run();
  } catch (error) {
    if (error instanceof RecognitionContractError) return error.code;
    throw error;
  }
  throw new Error('expected a recognition contract failure');
};

/** Names the exact guard, so a vector cannot pass through a different failure of the same code. */
const recognitionFailure = (run: () => unknown): { code: string; message: string } => {
  try {
    run();
  } catch (error) {
    if (error instanceof RecognitionContractError) return { code: error.code, message: error.message };
    throw error;
  }
  throw new Error('expected a recognition contract failure');
};

describe('SEM-001I.3 recognition-knowledge state identity', () => {
  it('CV-SEM-099 permits at most one active mapping per (ObserverId, PerceivedIdentitySymbolId)', () => {
    const exp = experience();
    const claim = identityClaimCue(exp, 'person.glen', 4200n);

    // One active mapping for the symbol is admissible.
    expect(recognitionSemanticView(
      evaluateContinuantRecognition(model(), request(exp, [claim], [mapping(4200n, 'person.glen')]), 0n)
        .resolutionRecord,
    )).toBe('asserted:person.glen');

    // Two active mappings for one perceived symbol are ambiguous knowledge state, even when each
    // occurrence is individually canonical and points at a catalogued candidate.
    const ambiguous = recognitionFailure(() => evaluateContinuantRecognition(model(), request(exp, [claim], [
      mapping(4200n, 'person.glen'),
      mapping(4201n, 'person.darius'),
    ]), 0n));
    expect(ambiguous.code).toBe('INVALID_SYMBOL_MAPPING');
    expect(ambiguous.message).toMatch(/more than one active mapping/);
  });

  it('CV-SEM-099 replaces mapping A with B without remapping or mutating A', () => {
    const exp = experience();
    const mappingA = mapping(4200n, 'person.glen');
    const mappingB = mapping(4201n, 'person.darius');
    const beforeReplacement = encodeSemanticValue(semanticUnionValue('RecognitionCueSource', 2, {
      PerceivedIdentitySymbolId: semanticOccurrenceId('ExperienceId', 1n),
      ObserverSymbolCandidateMappingId: semanticOccurrenceId(
        'ObserverSymbolCandidateMappingId', mappingA.observerSymbolCandidateMappingId,
      ),
    }));

    // While A is active, a claim citing A resolves and a claim citing B does not.
    expect(recognitionSemanticView(
      evaluateContinuantRecognition(model(), request(exp, [identityClaimCue(exp, 'person.glen', 4200n)], [mappingA]), 0n)
        .resolutionRecord,
    )).toBe('asserted:person.glen');
    expect(recognitionCode(() => evaluateContinuantRecognition(
      model(), request(exp, [identityClaimCue(exp, 'person.glen', 4201n)], [mappingA]), 0n,
    ))).toBe('INVALID_SYMBOL_MAPPING');

    // After replacement only B is active: a later evaluation may cite B, never the retired A.
    expect(recognitionSemanticView(
      evaluateContinuantRecognition(model(), request(exp, [identityClaimCue(exp, 'person.darius', 4201n)], [mappingB]), 0n)
        .resolutionRecord,
    )).toBe('asserted:person.darius');
    expect(recognitionCode(() => evaluateContinuantRecognition(
      model(), request(exp, [identityClaimCue(exp, 'person.darius', 4200n)], [mappingB]), 0n,
    ))).toBe('INVALID_SYMBOL_MAPPING');

    // A's occurrence identity, and any historical cue citing it, are untouched by the replacement.
    expect(mappingA.observerSymbolCandidateMappingId).toBe(4200n);
    expect(mappingA.candidateSemanticReferentId).toBe('person.glen');
    const afterReplacement = encodeSemanticValue(semanticUnionValue('RecognitionCueSource', 2, {
      PerceivedIdentitySymbolId: semanticOccurrenceId('ExperienceId', 1n),
      ObserverSymbolCandidateMappingId: semanticOccurrenceId(
        'ObserverSymbolCandidateMappingId', mappingA.observerSymbolCandidateMappingId,
      ),
    }));
    expect(bytesToHex(afterReplacement)).toBe(bytesToHex(beforeReplacement));
  });

  it('CV-SEM-099 carries an allocated mapping occurrence rather than a derived key', () => {
    const exp = experience();

    // Two mappings differing only in version are different occurrences, not one recomputed string.
    const first = mapping(4200n, 'person.glen');
    const second: ObserverIdentitySymbolMapping = { ...first, observerSymbolCandidateMappingId: 4300n };
    expect(first.observerSymbolCandidateMappingId).not.toBe(second.observerSymbolCandidateMappingId);

    // A claim must cite the exact allocated occurrence; a near-miss ordinal is inadmissible.
    expect(recognitionCode(() => evaluateContinuantRecognition(
      model(), request(exp, [identityClaimCue(exp, 'person.glen', 4199n)], [first]), 0n,
    ))).toBe('INVALID_SYMBOL_MAPPING');

    expect(() => assertCanonicalRoundTrip(semanticUnionValue('RecognitionCueSource', 2, {
      PerceivedIdentitySymbolId: semanticOccurrenceId('ExperienceId', 0n),
      ObserverSymbolCandidateMappingId: semanticOccurrenceId('ObserverSymbolCandidateMappingId', 4200n),
    }))).not.toThrow();
  });

  it('CV-SEM-100 permits at most one active catalog entry per (ObserverId, CandidateSemanticReferentId)', () => {
    const exp = experience();
    const glenFace = catalogEntry('person.glen', ['template/glen-face']);
    const glenGait = catalogEntry('person.glen', ['template/glen-gait']);

    // Each entry is individually canonical.
    for (const entry of [glenFace, glenGait]) {
      expect(() => evaluateContinuantRecognition(
        model(), request(exp, [], [], [catalogEntry('person.darius', ['template/darius-face']), entry]), 0n,
      )).not.toThrow();
    }

    // Together they are ambiguous knowledge state, not a merged template set.
    const ambiguous = recognitionFailure(() => evaluateContinuantRecognition(
      model(),
      request(exp, [], [], [catalogEntry('person.darius', ['template/darius-face']), glenFace, glenGait]),
      0n,
    ));
    expect(ambiguous.code).toBe('INVALID_CATALOG');
    expect(ambiguous.message).toMatch(/duplicate candidate catalog entry/);
  });

  it('SEM-001I.1 keeps persistent resolution state self-sufficient', () => {
    const exp = experience();
    const result = evaluateContinuantRecognition(
      model(), request(exp, [identityClaimCue(exp, 'person.glen', 4200n)], [mapping(4200n, 'person.glen')]), 0n,
    );

    // The evaluation exists once, in trace. The persisted resolution carries no pointer back to it.
    expect(result.evaluation.recognitionEvaluationId).toBe(0n);
    expect(result.resolutionRecord).toBeDefined();
    expect(Object.keys(result.resolutionRecord!)).not.toContain('recognitionEvaluationId');
    expect(result.resolutionRecord!.recognitionResolutionId).toBe(1n);
  });
});
