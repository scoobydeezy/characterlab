import { describe, expect, it } from 'vitest';
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

describe('SEM-001G character-accessible provenance and admissibility conformance', () => {
  it('CV-SEM-071 uses a closed evidence-reference union and keeps scopes/referents out of proof identity', () => {
    const ref: CharacterEvidenceRef = { kind: 'observation', observationId: 14000n };
    expect(resolveAdmissibleEvidenceReference(ref, index(occurrence(ref)), domain(), { observerId, occurredAt: 10n })).toMatchObject({ ref });
    for (const forged of [
      { kind: 'perceptual-referent', perceptualReferentId: track },
      { kind: 'experience', experienceId: 7300n },
      { kind: 'generic-evidence', evidenceId: 'anything' },
    ]) {
      expect(() => resolveAdmissibleEvidenceReference(forged as never, [], domain(), { observerId, occurredAt: 10n }))
        .toThrowError(expect.objectContaining({ code: 'INVALID_EVIDENCE_REFERENCE' }));
    }
  });

  it('CV-SEM-072 admits an exact audited schema/seam and rejects truth handles even when opaque or hashed', () => {
    const ref: CharacterEvidenceRef = { kind: 'observation', observationId: 14000n };
    const safe = occurrence(ref);
    expect(() => resolveAdmissibleEvidenceReference(ref, [safe], domain(), { observerId, occurredAt: 10n })).not.toThrow();
    expect(() => resolveAdmissibleEvidenceReference(ref, [safe], domain([], {
      permittedEvidenceSchemas: [schema('observation', 'observation/unproven', version)],
    }), { observerId, occurredAt: 10n })).toThrowError(expect.objectContaining({ code: 'UNADMITTED_EVIDENCE_SCHEMA' }));
    for (const field of ['truthBindingId', 'hashedTruthSource', 'traceNodeId']) {
      const forged = { ...safe, [field]: 'opaque/abc' } as ObserverSafeEvidenceOccurrence;
      expect(() => resolveAdmissibleEvidenceReference(ref, [forged], domain(), { observerId, occurredAt: 10n }))
        .toThrowError(expect.objectContaining({ code: 'FORBIDDEN_TRUTH_LINKAGE' }));
    }
  });

  it('CV-SEM-073 makes evidence admissibility consumer-, observer-, window-, modality-, feature-, and carrier-relative', () => {
    const ref: CharacterEvidenceRef = { kind: 'continuant-feature', featureObservationId: 17002n };
    const visualFace = occurrence(ref, {
      recordSchemaVersion: 'continuant-feature/0.1-candidate',
      scope: {
        experienceId: 7300n, windowId: 'window/1', modalityId: 'modality/visual',
        featureScopeId: 'feature-scope/face', carrier: { kind: 'continuant', perceptualReferentId: track },
      },
    });
    const read = domain(['continuant-feature'], {
      temporalScope: 'SameWindow', permittedModalityIds: ['modality/visual'], permittedFeatureScopeIds: ['feature-scope/face'],
    });
    const consumer = { observerId, occurredAt: 10n, windowId: 'window/1', requiredCarrier: { kind: 'continuant', perceptualReferentId: track } as const };
    expect(() => resolveAdmissibleEvidenceReference(ref, [visualFace], read, consumer)).not.toThrow();
    expect(() => resolveAdmissibleEvidenceReference(ref, [visualFace], read, { ...consumer, observerId: otherObserverId }))
      .toThrowError(expect.objectContaining({ code: 'CROSS_OBSERVER_REFERENCE' }));
    expect(() => resolveAdmissibleEvidenceReference(ref, [visualFace], read, { ...consumer, windowId: 'window/2' }))
      .toThrowError(expect.objectContaining({ code: 'INVALID_TEMPORAL_SCOPE' }));
    expect(() => resolveAdmissibleEvidenceReference(ref, [visualFace], { ...read, permittedModalityIds: ['modality/auditory'] }, consumer))
      .toThrowError(expect.objectContaining({ code: 'INVALID_APPLICABILITY_SCOPE' }));
    expect(() => resolveAdmissibleEvidenceReference(ref, [visualFace], read, { ...consumer, requiredCarrier: { kind: 'continuant', perceptualReferentId: splitTrack } }))
      .toThrowError(expect.objectContaining({ code: 'INVALID_APPLICABILITY_SCOPE' }));
  });

  it('CV-SEM-074 permits explicit perceptual co-reference but creates no hidden equality across false discontinuity', () => {
    const firstRef: CharacterEvidenceRef = { kind: 'continuant-feature', featureObservationId: 17000n };
    const laterRef: CharacterEvidenceRef = { kind: 'continuant-feature', featureObservationId: 17001n };
    const onTrack = (ref: CharacterEvidenceRef, carrierTrack: PerceptualReferentId) => occurrence(ref, {
      recordSchemaVersion: 'continuant-feature/0.1-candidate',
      scope: { carrier: { kind: 'continuant', perceptualReferentId: carrierTrack } },
    });
    const records = index(onTrack(firstRef, track), onTrack(laterRef, track));
    const read = domain(['continuant-feature']);
    expect(resolveAdmissibleEvidenceReferences([firstRef, laterRef], records, read, { observerId, occurredAt: 10n, requiredCarrier: { kind: 'continuant', perceptualReferentId: track } })).toHaveLength(2);
    const split = index(onTrack(firstRef, track), onTrack(laterRef, splitTrack));
    expect(() => resolveAdmissibleEvidenceReferences([firstRef, laterRef], split, read, { observerId, occurredAt: 10n, requiredCarrier: { kind: 'continuant', perceptualReferentId: track } }))
      .toThrowError(expect.objectContaining({ code: 'INVALID_APPLICABILITY_SCOPE' }));
    expect(track).not.toEqual(splitTrack);
  });

  it('CV-SEM-075 exposes explicitly shared observer evidence but never shared hidden ancestry', () => {
    const shared: CharacterEvidenceRef = { kind: 'observation', observationId: 14002n };
    const records = [occurrence(shared)];
    const first = resolveAdmissibleEvidenceReference(shared, records, domain(), { observerId, occurredAt: 10n });
    const second = resolveAdmissibleEvidenceReference(shared, records, domain(), { observerId, occurredAt: 20n });
    expect(characterEvidenceRefKey(first.ref)).toBe(characterEvidenceRefKey(second.ref));
    const hiddenCommonSource = { ...occurrence({ kind: 'observation', observationId: 14001n }), sourceEntityHash: 'same-secret' } as ObserverSafeEvidenceOccurrence;
    expect(() => resolveAdmissibleEvidenceReference(hiddenCommonSource.ref, [hiddenCommonSource], domain(), { observerId, occurredAt: 10n }))
      .toThrowError(expect.objectContaining({ code: 'FORBIDDEN_TRUTH_LINKAGE' }));
  });

  it('CV-SEM-076 makes occurrence IDs fresh and ordinal-opaque while preserving equal causal semantics', () => {
    const lowBinding = binding(4n, EventRoleId.Instrument);
    const highBinding = binding(900n, EventRoleId.Instrument);
    const low = deriveCausalRoleEvidence(causalModel(), causalRequest([lowBinding]), 10n);
    const high = deriveCausalRoleEvidence(causalModel(), causalRequest([highBinding]), 700n);
    expect(low.evidence.map((value) => value.causalRoleId)).toEqual([CausalRoleId.Instrument]);
    expect(high.evidence.map((value) => value.causalRoleId)).toEqual([CausalRoleId.Instrument]);
    expect(low.evidence[0].causalRoleEvidenceId).not.toBe(high.evidence[0].causalRoleEvidenceId);
    expect(low.evidence[0].supportingEvidenceRefs).not.toEqual(high.evidence[0].supportingEvidenceRefs);
  });

  it('CV-SEM-077 preserves missing versus explicit evidence and permits future exact quality schemas without generic confidence', () => {
    const read = domain(['continuant-feature']);
    expect(resolveAdmissibleEvidenceReferences([], [], read, { observerId, occurredAt: 10n })).toEqual([]);
    const explicitFalse: CharacterEvidenceRef = { kind: 'continuant-feature', featureObservationId: 17004n };
    expect(resolveAdmissibleEvidenceReferences([explicitFalse], [occurrence(explicitFalse)], read, { observerId, occurredAt: 10n })).toHaveLength(1);

    const bounded: CharacterEvidenceRef = { kind: 'continuant-feature', featureObservationId: 17003n };
    const boundedRecord = occurrence(bounded, { recordSchemaVersion: 'continuant-feature/0.2-bounded-interval' });
    const boundedRead = domain([], { permittedEvidenceSchemas: [schema('continuant-feature', 'continuant-feature/0.2-bounded-interval', version)] });
    expect(resolveAdmissibleEvidenceReference(bounded, [boundedRecord], boundedRead, { observerId, occurredAt: 10n })).not.toHaveProperty('confidence');
    expect(() => resolveAdmissibleEvidenceReference(bounded, [boundedRecord], read, { observerId, occurredAt: 10n }))
      .toThrowError(expect.objectContaining({ code: 'UNADMITTED_EVIDENCE_SCHEMA' }));
  });

  it('CV-SEM-078 enforces the evidence-to-interpretation ladder through narrow ReadDomains', () => {
    const classification: CharacterEvidenceRef = { kind: 'continuant-classification', classificationEvidenceId: 5n };
    const record = occurrence(classification);
    const recognitionRead = domain(['continuant-classification']);
    expect(() => resolveAdmissibleEvidenceReference(classification, [record], recognitionRead, { observerId, occurredAt: 10n })).not.toThrow();
    const motiveRead = domain([], { transitionKindId: 'transition/motive-pressure', permittedEvidenceSchemas: [] });
    expect(() => resolveAdmissibleEvidenceReference(classification, [record], motiveRead, { observerId, occurredAt: 10n }))
      .toThrowError(expect.objectContaining({ code: 'UNADMITTED_EVIDENCE_SCHEMA' }));
    expect(evidenceApi).not.toHaveProperty('getTruthSource');
    expect(evidenceApi).not.toHaveProperty('findCommonAncestor');
    expect(evidenceApi).not.toHaveProperty('traceBack');
  });

  it('CV-SEM-079 derives zero or more independent character-relative causal roles without rewriting event roles', () => {
    const actor = binding(1n, EventRoleId.Actor);
    const instrument = binding(2n, EventRoleId.Instrument);
    const unresolved: PerceivedBindingEvidence = { ...binding(3n, EventRoleId.Target), eventRoleEvidence: { kind: 'unresolved' } };
    const before = structuredClone([actor, instrument, unresolved]);
    const result = deriveCausalRoleEvidence(causalModel(), causalRequest([actor, instrument, unresolved]), 20n);
    expect(result.evidence.map((value) => value.causalRoleId)).toEqual([CausalRoleId.Actor, CausalRoleId.Instrument]);
    expect(result.evidence.every((value) => value.supportingEvidenceRefs.every((ref) => ref.kind === 'perceived-binding'))).toBe(true);
    expect([actor, instrument, unresolved]).toEqual(before);
    expect(() => compileCausalRoleModel('model/none', [])).toThrowError(expect.objectContaining({ code: 'INVALID_CAUSAL_ROLE_MODEL' }));
    expect(() => compileCausalRoleModel('model/two', [INITIAL_CAUSAL_ROLE_RULE, { ...INITIAL_CAUSAL_ROLE_RULE, causalRoleDerivationRuleId: 'causal-role-rule/other' }]))
      .toThrowError(expect.objectContaining({ code: 'DUPLICATE_CAUSAL_ROLE_AUTHORITY' }));
  });

  it('CV-SEM-080 preserves deterministic replay, safe ancestry, and allocator rollback on failed commit', async () => {
    const actor = binding(1n, EventRoleId.Actor);
    const request = causalRequest([actor]);
    const first = deriveCausalRoleEvidence(causalModel(), request, 50n);
    expect(deriveCausalRoleEvidence(causalModel(), structuredClone(request), 50n)).toEqual(first);
    expect(first.evidence[0]).not.toHaveProperty('truthEventId');
    expect(first.evidence[0]).not.toHaveProperty('traceNodeId');

    interface FixtureState { readonly valid: boolean }
    const adapter: StateAdapter<FixtureState> = {
      clone: (state) => ({ ...state }),
      validate: (state) => { if (!state.valid) throw new Error('injected SEM-001G commit failure'); },
      canonicalValue: (state) => state.valid,
    };
    const handlerId = typedIdentifier(32003n, text('event/sem-001g-rollback'));
    const handler: EventHandler<FixtureState> = ({ allocateRuntimeId }) => {
      const result = deriveCausalRoleEvidence(causalModel(), request, allocateRuntimeId());
      expect(result.evidence[0].causalRoleEvidenceId).toBe(80n);
      return { nextState: { valid: false }, emittedEvents: [], traceContributions: [], outputs: [] };
    };
    const scheduler = new DeterministicScheduler({
      initialState: { valid: true }, stateAdapter: adapter,
      handlers: new Map([[bytesToHex(canonicalEncode(handlerId)), handler]]),
      maxSettlementWorkPerSimulationInstant: 10n,
      initialAllocators: { nextRuntimeId: 80n, nextEventId: 0n, nextEventSequence: 0n },
    });
    scheduler.schedule({ dueAt: simInstant(1n), phase: 10n, eventTypeId: handlerId, payload: list([]), dependencies: list([]) });
    const before = scheduler.getAllocatorState();
    await expect(scheduler.settleNextInstant()).rejects.toThrow(/injected SEM-001G commit failure/);
    expect(scheduler.getAllocatorState()).toEqual(before);
  });
});
