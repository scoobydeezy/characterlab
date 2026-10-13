// Generated from src/test/recognition.test.ts; helper bodies retained verbatim. No test hooks.
import {authoredReferentKey} from '../test/fixtures/referentOrigin';

import { bytesToHex, canonicalEncode, list, text, typedIdentifier } from '../substrate/canonicalEncoding';
import { DeterministicScheduler, type EventHandler, type StateAdapter } from '../substrate/scheduler';
import { simInstant } from '../substrate/time';
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
  assertRecognitionEmissionTarget,
  compileRecognitionModel,
  currentRecognitionResolution,
  evaluateContinuantRecognition,
  recognitionSemanticView,
  validateResolutionHistory,
  type ObserverIdentitySymbolMapping,
  type PermittedRecognitionCueEvidence,
  type RecognitionCandidateCatalogEntry,
  type RecognitionDerivation,
  type RecognitionRequest,
  type RecognitionResolutionRecord,
  type RecognitionRuleDefinition,
} from '../semanticBinding/recognition';

const observerId = 'character/mina';
const track: PerceptualReferentId = { observerId, observerTrackSequence: 17n };
const otherTrack: PerceptualReferentId = { observerId, observerTrackSequence: 23n };
const eventFile: PerceptualEventReferentId = { observerId, observerEventSequence: 4n };
const version = 'recognition/0.1-candidate';

const initialModel = () => compileRecognitionModel(
  'model/recognition-reference', [INITIAL_RECOGNITION_RULE], [INITIAL_RECOGNITION_DERIVATION],
);

const experience = (
  experienceId = 8601n,
  occurredAt = 10n,
  referentId = track,
): PreRecognitionSemanticExperience => {
  const bindings = compilePerceivedBindings([{
    observerId,
    perceptualEventReferentId: eventFile,
    perceptualReferentId: referentId,
    eventRoleEvidence: { kind: 'exact', eventRoleId: EventRoleId.Participant },
    supportingObservationIds: [{ observerId, observationId: 27900n }],
    occurredAt,
    transformationVersion: version,
  }], 40n).bindings;
  return assemblePreRecognitionExperience({
    experienceId, observerId, occurredAt,
    perceptualEventReferentIds: [eventFile], perceivedBindings: bindings,
    perceptualClassifications: [], perceptualEventClassifications: [],
    supportingObservationIds: [{ observerId, observationId: 27900n }],
    transformationVersion: version,
  });
};

const catalog = (overrides: Partial<Record<'glenDomain' | 'dariusDomain', RecognitionCandidateCatalogEntry['candidateDomain']>> = {}): readonly RecognitionCandidateCatalogEntry[] => [
  {
    observerId, candidateSemanticReferentId: authoredReferentKey('person.darius'),
    candidateDomain: overrides.dariusDomain ?? 'Person', recognitionTemplateIds: ['template/darius-face'],
    catalogEntryVersion: version,
  },
  {
    observerId, candidateSemanticReferentId: authoredReferentKey('person.glen'),
    candidateDomain: overrides.glenDomain ?? 'Person', recognitionTemplateIds: ['template/glen-face'],
    catalogEntryVersion: version,
  },
].sort((a,b)=>a.candidateSemanticReferentId.localeCompare(b.candidateSemanticReferentId));

const cue = (
  exp: PreRecognitionSemanticExperience,
  candidateSemanticReferentId: string,
  cuePolarity: 'SupportsCandidate' | 'ContradictsCandidate',
  ordinal: number,
  overrides: Partial<PermittedRecognitionCueEvidence> = {},
): PermittedRecognitionCueEvidence => ({
  recognitionCueEvidenceId: BigInt(ordinal),
  experienceId: exp.experienceId,
  observerId,
  perceptualReferentId: track,
  candidateSemanticReferentId,
  recognitionCueSource: {
    kind: 'retained-template-match',
    recognitionTemplateId: candidateSemanticReferentId === authoredReferentKey('person.glen') ? 'template/glen-face' : 'template/darius-face',
  },
  cuePolarity,
  supportingExperienceEvidenceRefs: [{ kind: 'perceived-binding', perceivedBindingId: exp.perceivedBindings[0].perceivedBindingId }],
  occurredAt: exp.occurredAt,
  transformationVersion: version,
  ...overrides,
});

const request = (
  exp: PreRecognitionSemanticExperience,
  cues: readonly PermittedRecognitionCueEvidence[],
  history: readonly RecognitionResolutionRecord[] = [],
  overrides: Partial<RecognitionRequest> = {},
): RecognitionRequest => ({
  experience: exp,
  perceptualReferentId: track,
  candidateCatalog: catalog(),
  identitySymbolMappings: [],
  cueEvidence: [...cues].sort((a, b) => a.recognitionCueEvidenceId < b.recognitionCueEvidenceId ? -1 : a.recognitionCueEvidenceId > b.recognitionCueEvidenceId ? 1 : 0),
  priorResolutionHistory: history,
  recognitionVersion: version,
  ...overrides,
});


export {initialModel,experience,catalog,cue,request,observerId,track,otherTrack,version};
export const originalSource={path:'src/test/recognition.test.ts',sha256:'5ddd3e87bd70b8fc3993ed2dfb99d1f1ccf55c2b0fb4e4f561150f476ecad69c'} as const;
