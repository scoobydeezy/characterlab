
import * as evidenceApi from '../semanticBinding/evidenceProvenance';
import {
  CausalRoleId,
  INITIAL_CAUSAL_ROLE_RULE,
  characterEvidenceRefKey,
  compileCausalRoleModel,
  deriveCausalRoleEvidence,
  resolveAdmissibleEvidenceReference,
  resolveAdmissibleEvidenceReferences,
  type CharacterEvidenceRef,
  type CausalRoleRequest,
  type EvidenceReadDomain,
  type ObserverSafeEvidenceOccurrence,
} from '../semanticBinding/evidenceProvenance';
import { EventRoleId } from '../semanticBinding/eventBindings';
import type {
  PerceivedBindingEvidence,
  PerceptualEventReferentId,
  PerceptualReferentId,
  PreRecognitionSemanticExperience,
} from '../semanticBinding/perceptualEventFiles';
import { DeterministicScheduler, type EventHandler, type StateAdapter } from '../substrate/scheduler';
import { bytesToHex, canonicalEncode, list, text, typedIdentifier } from '../substrate/canonicalEncoding';
import { simInstant } from '../substrate/time';

const observerId = 'observer/mina';
const otherObserverId = 'observer/darius';
const track: PerceptualReferentId = { observerId, observerTrackSequence: 17n };
const splitTrack: PerceptualReferentId = { observerId, observerTrackSequence: 23n };
const eventFile: PerceptualEventReferentId = { observerId, observerEventSequence: 7n };
const otherEventFile: PerceptualEventReferentId = { observerId, observerEventSequence: 8n };
const version = 'fixture/sem-001g';

const schema = (refKind: CharacterEvidenceRef['kind'], recordSchemaVersion: string, producingEpistemicSeamVersion: string) => ({
  refKind, recordSchemaVersion, producingEpistemicSeamVersion,
});

const occurrence = (
  ref: CharacterEvidenceRef,
  overrides: Partial<ObserverSafeEvidenceOccurrence> = {},
): ObserverSafeEvidenceOccurrence => ({
  ref,
  observerId,
  occurredAt: 10n,
  recordSchemaVersion: `${ref.kind}/0.1-candidate`,
  producingEpistemicSeamVersion: version,
  scope: {},
  ...overrides,
});

const index = (...records: ObserverSafeEvidenceOccurrence[]): ObserverSafeEvidenceOccurrence[] =>
  [...records].sort((left, right) => characterEvidenceRefKey(left.ref).localeCompare(characterEvidenceRefKey(right.ref)));

const domain = (
  refs: CharacterEvidenceRef['kind'][] = ['observation'],
  overrides: Partial<EvidenceReadDomain> = {},
): EvidenceReadDomain => ({
  transitionKindId: 'transition/fixture-consumer',
  permittedEvidenceSchemas: refs.map((kind) => schema(kind, `${kind}/0.1-candidate`, version))
    .sort((left, right) => `${left.refKind}\0${left.recordSchemaVersion}`.localeCompare(`${right.refKind}\0${right.recordSchemaVersion}`)),
  temporalScope: 'HistoricalOrCurrent',
  ...overrides,
});

const binding = (perceivedBindingId: bigint, eventRoleId: EventRoleId): PerceivedBindingEvidence => ({
  perceivedBindingId,
  observerId,
  perceptualEventReferentId: eventFile,
  perceptualReferentId: track,
  eventRoleEvidence: { kind: 'exact', eventRoleId },
  supportingObservationIds: [{ observerId, observationId: 14900n }],
  occurredAt: 10n,
  transformationVersion: version,
});

const experience = (bindings: readonly PerceivedBindingEvidence[]): PreRecognitionSemanticExperience => ({
  experienceId: 7300n,
  observerId,
  occurredAt: 10n,
  perceptualEventReferentIds: [eventFile],
  perceivedBindings: bindings,
  perceptualClassifications: [],
  perceptualEventClassifications: [],
  supportingObservationIds: [],
  transformationVersion: version,
});

const bindingOccurrence = (value: PerceivedBindingEvidence): ObserverSafeEvidenceOccurrence => occurrence(
  { kind: 'perceived-binding', perceivedBindingId: value.perceivedBindingId },
  {
    recordSchemaVersion: 'perceived-binding/0.1-candidate',
    scope: {
      experienceId: 7300n,
      carrier: { kind: 'continuant-in-event', perceptualEventReferentId: eventFile, perceptualReferentId: track },
    },
  },
);

const causalDomain = (): EvidenceReadDomain => ({
  transitionKindId: 'transition/derive-character-causal-role',
  permittedEvidenceSchemas: [schema('perceived-binding', 'perceived-binding/0.1-candidate', version)],
  temporalScope: 'SameExperience',
});

const causalRequest = (bindings: readonly PerceivedBindingEvidence[], overrides: Partial<CausalRoleRequest> = {}): CausalRoleRequest => ({
  experience: experience(bindings),
  perceptualEventReferentId: eventFile,
  perceptualReferentId: track,
  evidenceOccurrences: index(...bindings.map(bindingOccurrence)),
  readDomain: causalDomain(),
  transformationVersion: version,
  ...overrides,
});

const causalModel = () => compileCausalRoleModel('model/causal-role-fixture', [INITIAL_CAUSAL_ROLE_RULE]);


export {observerId,otherObserverId,track,splitTrack,eventFile,otherEventFile,version,schema,occurrence,index,domain,binding,experience,bindingOccurrence,causalDomain,causalRequest,causalModel};
export const originalSource={path:'src/test/evidenceProvenance.test.ts',sha256:'8dff86b2d1064dc7e58095f36b2086c405b858f99651729cbc62c38c87be326e'} as const;
