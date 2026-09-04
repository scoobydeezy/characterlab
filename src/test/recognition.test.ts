import { describe, expect, it } from 'vitest';
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
    observerId, candidateSemanticReferentId: 'person.darius',
    candidateDomain: overrides.dariusDomain ?? 'Person', recognitionTemplateIds: ['template/darius-face'],
    catalogEntryVersion: version,
  },
  {
    observerId, candidateSemanticReferentId: 'person.glen',
    candidateDomain: overrides.glenDomain ?? 'Person', recognitionTemplateIds: ['template/glen-face'],
    catalogEntryVersion: version,
  },
];

const cue = (
  exp: PreRecognitionSemanticExperience,
  candidateSemanticReferentId: 'person.glen' | 'person.darius',
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
    recognitionTemplateId: candidateSemanticReferentId === 'person.glen' ? 'template/glen-face' : 'template/darius-face',
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

describe('SEM-001F append-only recognition-resolution conformance', () => {
  it('CV-SEM-061 traces unfamiliar, contradicted, and ambiguous evaluations without fake identities', () => {
    const exp = experience();
    const unfamiliar = evaluateContinuantRecognition(initialModel(), request(exp, []), 0n);
    expect(unfamiliar.evaluation.result).toEqual({ kind: 'no-update', reason: 'NoQualifyingCandidate' });
    expect(unfamiliar.resolutionRecord).toBeUndefined();
    expect(unfamiliar.nextRuntimeId).toBe(1n);

    const contradicted = evaluateContinuantRecognition(initialModel(), request(exp, [cue(exp, 'person.glen', 'ContradictsCandidate', 1)]), 0n);
    expect(contradicted.evaluation.result).toEqual({ kind: 'no-update', reason: 'NoQualifyingCandidate' });
    expect(contradicted.resolutionRecord).toBeUndefined();

    const ambiguous = evaluateContinuantRecognition(initialModel(), request(exp, [
      cue(exp, 'person.glen', 'SupportsCandidate', 1), cue(exp, 'person.darius', 'SupportsCandidate', 2),
    ]), 0n);
    expect(ambiguous.evaluation.result).toEqual({ kind: 'no-update', reason: 'AmbiguousCandidates' });
    expect(ambiguous.evaluation).not.toHaveProperty('candidateSemanticReferentId');
  });

  it('CV-SEM-062 permits correct, wrong, or unresolved recognition over identical immutable perception', () => {
    const exp = experience();
    const before = structuredClone(exp);
    const glen = evaluateContinuantRecognition(initialModel(), request(exp, [cue(exp, 'person.glen', 'SupportsCandidate', 1)]), 0n);
    const darius = evaluateContinuantRecognition(initialModel(), request(exp, [cue(exp, 'person.darius', 'SupportsCandidate', 1)]), 0n);
    const unresolved = evaluateContinuantRecognition(initialModel(), request(exp, []), 0n);
    expect(recognitionSemanticView(glen.resolutionRecord)).toBe('asserted:person.glen');
    expect(recognitionSemanticView(darius.resolutionRecord)).toBe('asserted:person.darius');
    expect(recognitionSemanticView(unresolved.resolutionRecord)).toBe('unresolved');
    expect(exp).toEqual(before);
    expect(glen.resolutionRecord).not.toHaveProperty('correct');
    expect(darius.resolutionRecord).not.toHaveProperty('confidence');
  });

  it('CV-SEM-063 implements exact unique uncontradicted support without order-based ties', () => {
    const exp = experience();
    const supportAndContradiction = evaluateContinuantRecognition(initialModel(), request(exp, [
      cue(exp, 'person.glen', 'SupportsCandidate', 1), cue(exp, 'person.glen', 'ContradictsCandidate', 2),
    ]), 0n);
    expect(supportAndContradiction.evaluation.result).toEqual({ kind: 'no-update', reason: 'NoQualifyingCandidate' });
    const unique = evaluateContinuantRecognition(initialModel(), request(exp, [
      cue(exp, 'person.glen', 'SupportsCandidate', 1), cue(exp, 'person.darius', 'ContradictsCandidate', 2),
    ]), 0n);
    expect(recognitionSemanticView(unique.resolutionRecord)).toBe('asserted:person.glen');
    const ambiguous = evaluateContinuantRecognition(initialModel(), request(exp, [
      cue(exp, 'person.darius', 'SupportsCandidate', 1), cue(exp, 'person.glen', 'SupportsCandidate', 2),
    ]), 0n);
    expect(ambiguous.resolutionRecord).toBeUndefined();
    expect(() => evaluateContinuantRecognition(initialModel(), request(exp, [], [], {
      candidateCatalog: [...catalog()].reverse(),
    }), 0n)).toThrowError(expect.objectContaining({ code: 'INVALID_MODEL' }));
  });

  it('CV-SEM-064 requires observer-owned catalog and symbol mapping without truth-kind filtering', () => {
    const exp = experience();
    const claim = cue(exp, 'person.glen', 'SupportsCandidate', 1, {
      recognitionCueSource: {
        kind: 'identity-claim-mapping', perceivedIdentitySymbolId: 'perceived-symbol/GLEN',
        observerSymbolCandidateMappingId: 4200n,
      },
    });
    expect(() => evaluateContinuantRecognition(initialModel(), request(exp, [claim]), 0n))
      .toThrowError(expect.objectContaining({ code: 'INVALID_SYMBOL_MAPPING' }));
    const mapping: ObserverIdentitySymbolMapping = {
      observerSymbolCandidateMappingId: 4200n, observerId,
      perceivedIdentitySymbolId: 'perceived-symbol/GLEN',
      candidateSemanticReferentId: 'person.glen', mappingVersion: version,
    };
    const mapped = evaluateContinuantRecognition(initialModel(), request(exp, [claim], [], {
      identitySymbolMappings: [mapping], candidateCatalog: catalog({ glenDomain: 'DiscreteObject' }),
    }), 0n);
    expect(recognitionSemanticView(mapped.resolutionRecord)).toBe('asserted:person.glen');
    const truthInjected = { ...catalog()[0], truthEntityId: 'person.darius' } as RecognitionCandidateCatalogEntry;
    expect(() => evaluateContinuantRecognition(initialModel(), request(exp, [], [], {
      candidateCatalog: [truthInjected, catalog()[1]],
    }), 0n)).toThrowError(expect.objectContaining({ code: 'FORBIDDEN_TRUTH_FIELD' }));
  });

  it('CV-SEM-065 appends replacement and withdrawal while no-cue and same-candidate evaluations preserve current resolution', () => {
    const firstExp = experience(8802n, 10n);
    const first = evaluateContinuantRecognition(initialModel(), request(firstExp, [cue(firstExp, 'person.glen', 'SupportsCandidate', 1)]), 0n);
    const firstSnapshot = structuredClone(first.resolutionRecord!);

    const darkExp = experience(8801n, 20n);
    const dark = evaluateContinuantRecognition(initialModel(), request(darkExp, [], [first.resolutionRecord!]), 2n);
    expect(dark.evaluation.result).toEqual({ kind: 'no-update', reason: 'NoQualifyingCandidate' });
    expect(dark.resolutionRecord).toBeUndefined();
    expect(recognitionSemanticView(currentRecognitionResolution([first.resolutionRecord!], observerId, track))).toBe('asserted:person.glen');

    const sameExp = experience(8806n, 30n);
    const same = evaluateContinuantRecognition(initialModel(), request(sameExp, [cue(sameExp, 'person.glen', 'SupportsCandidate', 1)], [first.resolutionRecord!]), 3n);
    expect(same.evaluation.result).toEqual({ kind: 'no-update', reason: 'SameCandidateMaintained' });
    expect(same.resolutionRecord).toBeUndefined();

    const withdrawExp = experience(8808n, 40n);
    const withdrawal = evaluateContinuantRecognition(initialModel(), request(withdrawExp, [cue(withdrawExp, 'person.glen', 'ContradictsCandidate', 1)], [first.resolutionRecord!]), 4n);
    expect(withdrawal.resolutionRecord?.resolution).toEqual({ kind: 'withdrawn' });
    expect(withdrawal.resolutionRecord?.revisesRecognitionResolutionId).toBe(first.resolutionRecord?.recognitionResolutionId);
    expect(first.resolutionRecord).toEqual(firstSnapshot);

    const replacementExp = experience(8805n, 50n);
    const replacement = evaluateContinuantRecognition(initialModel(), request(replacementExp, [cue(replacementExp, 'person.darius', 'SupportsCandidate', 1)], [first.resolutionRecord!, withdrawal.resolutionRecord!]), 6n);
    expect(recognitionSemanticView(replacement.resolutionRecord)).toBe('asserted:person.darius');
    expect(replacement.resolutionRecord?.revisesRecognitionResolutionId).toBe(withdrawal.resolutionRecord?.recognitionResolutionId);
  });

  it('CV-SEM-066 preserves false continuity and false discontinuity under recognition changes', () => {
    const glenExp = experience(8803n, 10n);
    const glen = evaluateContinuantRecognition(initialModel(), request(glenExp, [cue(glenExp, 'person.glen', 'SupportsCandidate', 1)]), 0n);
    const dariusExp = experience(8800n, 20n);
    const replaced = evaluateContinuantRecognition(initialModel(), request(dariusExp, [cue(dariusExp, 'person.darius', 'SupportsCandidate', 1)], [glen.resolutionRecord!]), 2n);
    expect(replaced.resolutionRecord?.perceptualReferentId).toEqual(glen.resolutionRecord?.perceptualReferentId);

    const splitExp = experience(8807n, 30n, otherTrack);
    const splitCue = cue(splitExp, 'person.glen', 'SupportsCandidate', 1, { perceptualReferentId: otherTrack });
    const split = evaluateContinuantRecognition(initialModel(), request(splitExp, [splitCue], [], { perceptualReferentId: otherTrack }), 4n);
    expect(recognitionSemanticView(split.resolutionRecord)).toBe(recognitionSemanticView(glen.resolutionRecord));
    expect(split.resolutionRecord?.perceptualReferentId).not.toEqual(glen.resolutionRecord?.perceptualReferentId);
  });

  it('CV-SEM-067 enforces typed same-track, same-experience evidence closure', () => {
    const exp = experience();
    const crossTrack = cue(exp, 'person.glen', 'SupportsCandidate', 1, { perceptualReferentId: otherTrack });
    expect(() => evaluateContinuantRecognition(initialModel(), request(exp, [crossTrack]), 0n))
      .toThrowError(expect.objectContaining({ code: 'INVALID_CUE' }));
    const unavailable = cue(exp, 'person.glen', 'SupportsCandidate', 1, {
      supportingExperienceEvidenceRefs: [{ kind: 'perceived-binding', perceivedBindingId: 999n }],
    });
    expect(() => evaluateContinuantRecognition(initialModel(), request(exp, [unavailable]), 0n))
      .toThrowError(expect.objectContaining({ code: 'INVALID_EVIDENCE_REFERENCE' }));
    const stale = cue(exp, 'person.glen', 'SupportsCandidate', 1, { occurredAt: 9n });
    expect(() => evaluateContinuantRecognition(initialModel(), request(exp, [stale]), 0n))
      .toThrowError(expect.objectContaining({ code: 'INVALID_CUE' }));
  });

  it('CV-SEM-068 enforces sole rule authority and continuant-only recognition', () => {
    expect(() => compileRecognitionModel('model/missing', [], [INITIAL_RECOGNITION_DERIVATION]))
      .toThrowError(expect.objectContaining({ code: 'MISSING_RECOGNITION_AUTHORITY' }));
    expect(() => compileRecognitionModel('model/duplicate', [INITIAL_RECOGNITION_RULE, { ...INITIAL_RECOGNITION_RULE, recognitionRuleId: 'recognition-rule/other' }], [INITIAL_RECOGNITION_DERIVATION]))
      .toThrowError(expect.objectContaining({ code: 'DUPLICATE_RECOGNITION_AUTHORITY' }));
    const alternativeRule: RecognitionRuleDefinition = { ...INITIAL_RECOGNITION_RULE, recognitionRuleId: 'recognition-rule/alternative', derivationFunctionId: 'derivation/alternative' };
    const alternativeDerivation: RecognitionDerivation = { derivationFunctionId: 'derivation/alternative', derive: INITIAL_RECOGNITION_DERIVATION.derive };
    expect(compileRecognitionModel('model/alternative', [alternativeRule], [alternativeDerivation]).modelIdentity).toBe('model/alternative');
    expect(() => evaluateContinuantRecognition(initialModel(), request(experience(), [], [], {
      perceptualReferentId: eventFile as unknown as PerceptualReferentId,
    }), 0n)).toThrowError(expect.objectContaining({ code: 'CARRIER_TYPE_MISMATCH' }));
    const llmRule = { ...INITIAL_RECOGNITION_RULE, derivationFunctionId: 'llm/recognize' };
    expect(() => compileRecognitionModel('model/llm', [llmRule], [INITIAL_RECOGNITION_DERIVATION]))
      .toThrowError(expect.objectContaining({ code: 'UNKNOWN_DERIVATION' }));
  });

  it('CV-SEM-069 preserves semantic opacity, replay, history closure, and allocator rollback', async () => {
    const exp = experience();
    const recognitionRequest = request(exp, [cue(exp, 'person.glen', 'SupportsCandidate', 1)]);
    const low = evaluateContinuantRecognition(initialModel(), recognitionRequest, 4n);
    const replay = evaluateContinuantRecognition(initialModel(), structuredClone(recognitionRequest), 4n);
    const shifted = evaluateContinuantRecognition(initialModel(), recognitionRequest, 900n);
    expect(replay).toEqual(low);
    expect(recognitionSemanticView(low.resolutionRecord)).toEqual(recognitionSemanticView(shifted.resolutionRecord));
    expect(low.resolutionRecord?.recognitionResolutionId).not.toBe(shifted.resolutionRecord?.recognitionResolutionId);

    const branched = { ...low.resolutionRecord!, recognitionResolutionId: 99n, experienceId: 8600n, occurredAt: 20n };
    expect(() => validateResolutionHistory([low.resolutionRecord!, branched]))
      .toThrowError(expect.objectContaining({ code: 'INVALID_RESOLUTION_HISTORY' }));

    interface FixtureState { readonly valid: boolean }
    const adapter: StateAdapter<FixtureState> = { clone: (state) => ({ ...state }), validate: (state) => { if (!state.valid) throw new Error('injected recognition commit failure'); }, canonicalValue: (state) => state.valid };
    const handlerId = typedIdentifier(32002n, text('event/sem-001f-rollback'));
    const handler: EventHandler<FixtureState> = ({ allocateRuntimeId }) => {
      const result = evaluateContinuantRecognition(initialModel(), recognitionRequest, allocateRuntimeId());
      expect(result.evaluation.recognitionEvaluationId).toBe(50n);
      return { nextState: { valid: false }, emittedEvents: [], traceContributions: [], outputs: [] };
    };
    const scheduler = new DeterministicScheduler({ initialState: { valid: true }, stateAdapter: adapter, handlers: new Map([[bytesToHex(canonicalEncode(handlerId)), handler]]), maxSettlementWorkPerSimulationInstant: 10n, initialAllocators: { nextRuntimeId: 50n, nextEventId: 0n, nextEventSequence: 0n } });
    scheduler.schedule({ dueAt: simInstant(1n), phase: 10n, eventTypeId: handlerId, payload: list([]), dependencies: list([]) });
    const before = scheduler.getAllocatorState();
    await expect(scheduler.settleNextInstant()).rejects.toThrow(/injected recognition commit failure/);
    expect(scheduler.getAllocatorState()).toEqual(before);
  });

  it('CV-SEM-070 emits only append-only recognition resolution and no downstream mutation', () => {
    expect(() => assertRecognitionEmissionTarget('recognition-resolution-log')).not.toThrow();
    for (const target of ['perceptual-track', 'semantic-experience', 'belief', 'memory', 'person-model', 'relationship', 'appraisal', 'pressure', 'reason', 'option', 'identity', 'world-truth'] as const) {
      expect(() => assertRecognitionEmissionTarget(target)).toThrowError(expect.objectContaining({ code: 'FORBIDDEN_EMISSION_TARGET' }));
    }
    const exp = experience();
    const first = evaluateContinuantRecognition(initialModel(), request(exp, [cue(exp, 'person.glen', 'SupportsCandidate', 1)]), 0n);
    const laterExp = experience(8804n, 20n);
    const repeated = evaluateContinuantRecognition(initialModel(), request(laterExp, [cue(laterExp, 'person.glen', 'SupportsCandidate', 1)], [first.resolutionRecord!]), 2n);
    expect(repeated.resolutionRecord).toBeUndefined();
    expect(repeated.evaluation.result).toEqual({ kind: 'no-update', reason: 'SameCandidateMaintained' });
  });
});
