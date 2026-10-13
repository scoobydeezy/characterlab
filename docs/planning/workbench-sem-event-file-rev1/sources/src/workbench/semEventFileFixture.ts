// Original helper bodies retained verbatim; each invocation owns its occurrence-label map.
import {authoredReferentKey} from '../test/fixtures/referentOrigin';

import { bytesToHex, canonicalEncode, list, text, typedIdentifier } from '../substrate/canonicalEncoding';
import { DeterministicScheduler, type EventHandler, type StateAdapter } from '../substrate/scheduler';
import { simInstant } from '../substrate/time';
import { EventRoleId, type EventRoleEvidence } from '../semanticBinding/eventBindings';
import {
  applyPerceptualEventTransition,
  assemblePreRecognitionExperience,
  clonePerceptualEventFileState,
  compilePerceivedBindings,
  emptyPerceptualEventFileState,
  endPerceptualEventFile,
  eventFileStateSummary,
  perceivedEventGrouping,
  type PerceivedBindingRequest,
  type PerceptualEventFileState,
  type PerceptualEventReferentId,
  type PerceptualEventTransitionRequest,
  type PerceptualReferentId,
  type PreRecognitionSemanticExperience,
  type SupportingObservationId,
} from '../semanticBinding/perceptualEventFiles';


export function createEventFileFixture(){
const mina = 'character/mina';
const darius = 'character/darius';
const version = 'perceptual-event-files/0.1-candidate';

const observation = (observerId: string, observationId: bigint): SupportingObservationId => ({
  observerId,
  observationId,
});

const objectFile = (observerTrackSequence: bigint, observerId = mina): PerceptualReferentId => ({
  observerId,
  observerTrackSequence,
});

const eventFile = (observerEventSequence: bigint, observerId = mina): PerceptualEventReferentId => ({
  observerId,
  observerEventSequence,
});

/** Stable ordinal per detection label: occurrence IDs are allocated, never symbolic. */
const OCCURRENCE_ORDINALS = new Map<string, bigint>();
const ordinalFor = (label: string): bigint => {
  if (!OCCURRENCE_ORDINALS.has(label)) OCCURRENCE_ORDINALS.set(label, BigInt(OCCURRENCE_ORDINALS.size));
  return OCCURRENCE_ORDINALS.get(label)!;
};

const transition = (
  continuityKind: 'NewEventFile' | 'ContinuesPriorEventFile',
  detectionLabel: string,
  priorPerceptualEventReferentId?: PerceptualEventReferentId,
  observerId = mina,
): PerceptualEventTransitionRequest => ({
  observerId,
  priorPerceptualEventReferentId,
  currentEventDetectionId: { observerId, eventDetectionOccurrenceId: ordinalFor(detectionLabel) },
  continuityKind,
  supportingObservationIds: [observation(observerId, ordinalFor(`observation/${detectionLabel}`))],
  occurredAt: 10n,
  transformationVersion: version,
});

const exact = (eventRoleId: EventRoleId): EventRoleEvidence => ({ kind: 'exact', eventRoleId });

const binding = (
  perceptualEventReferentId: PerceptualEventReferentId,
  eventRoleEvidence: EventRoleEvidence,
  perceptualReferentId: PerceptualReferentId,
): PerceivedBindingRequest => ({
  observerId: mina,
  perceptualEventReferentId,
  perceptualReferentId,
  eventRoleEvidence,
  supportingObservationIds: [observation(mina, ordinalFor('observation/binding'))],
  occurredAt: 10n,
  transformationVersion: version,
});

const experience = (
  experienceId: bigint,
  eventIds: readonly PerceptualEventReferentId[],
  requests: readonly PerceivedBindingRequest[],
  nextRuntimeId = 0n,
): PreRecognitionSemanticExperience => {
  const compiled = compilePerceivedBindings(requests, nextRuntimeId);
  return assemblePreRecognitionExperience({
    experienceId,
    observerId: mina,
    occurredAt: 10n,
    perceptualEventReferentIds: eventIds,
    perceivedBindings: compiled.bindings,
    perceptualClassifications: [],
    perceptualEventClassifications: [],
    supportingObservationIds: [observation(mina, ordinalFor('observation/experience'))],
    transformationVersion: version,
  });
};


return {mina,darius,version,observation,objectFile,eventFile,ordinalFor,transition,exact,binding,experience,occurrenceOrdinals:()=>[...OCCURRENCE_ORDINALS].map(([label,ordinal])=>({label,ordinal:String(ordinal)}))};
}
export const originalSource={path:'src/test/perceptualEventFiles.test.ts',sha256:'0be1e74225ea6cc58665efdb98839fdbcc4b988eb10ebfee6374a66084860ba4'} as const;
