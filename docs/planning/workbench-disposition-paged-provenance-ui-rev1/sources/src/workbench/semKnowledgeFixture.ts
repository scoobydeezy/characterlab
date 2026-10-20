// Generated from src/test/semanticRecognitionState.test.ts; original helper bodies, no test hooks.
import {authoredReferentKey} from '../test/fixtures/referentOrigin';

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
    supportingObservationIds: [{ observerId, observationId: experienceId }],
    occurredAt,
    transformationVersion: version,
  }], 40n).bindings;
  return assemblePreRecognitionExperience({
    experienceId, observerId, occurredAt,
    perceptualEventReferentIds: [eventFile], perceivedBindings: bindings,
    perceptualClassifications: [], perceptualEventClassifications: [],
    supportingObservationIds: [{ observerId, observationId: experienceId }],
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
  catalogEntry(authoredReferentKey('person.darius'), ['template/darius-face']),
  catalogEntry(authoredReferentKey('person.glen'), ['template/glen-face']),
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
  recognitionCueEvidenceId: 1n,
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
  candidateCatalog: [...candidateCatalog].sort((a,b)=>a.candidateSemanticReferentId.localeCompare(b.candidateSemanticReferentId)),
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


export {model,experience,catalogEntry,catalog,mapping,identityClaimCue,request,observerId,track,version};
export const originalSource={path:'src/test/semanticRecognitionState.test.ts',sha256:'fe0f60c7c2d855737af9653f4934753536859e9761bc404f425872aebe7ef03b'} as const;
