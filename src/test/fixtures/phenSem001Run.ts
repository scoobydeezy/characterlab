/**
 * The integrated `PHEN-SEM-001` run: the complete three-observer fixture driven through the
 * deterministic scheduler, its immediate consumers, and the canonical codecs.
 *
 * Two gate obligations share this harness, so it lives here rather than inside either test.
 * `SEM-001` gate item 6 asks that the complete fixture pass through its immediate consumers and
 * save/load replay; `SEM-001J` asks that the whole causal chain be expressible in accepted
 * canonical bytes. One run answers both, and keeping one definition means the two cannot diverge.
 *
 * `CV-SEM-097` proves the state roots survive a persistence boundary, but it drives a minimal
 * single-observer detection handler — the right shape for a codec vector and the wrong shape for
 * the integrated claim, which is about the *whole* fixture: three observers with different
 * affordances, each running detections, tracks, an event-file, permitted role projection, perceived
 * bindings, feature observations, classification, and experience assembly.
 *
 * Every occurrence identity is drawn from the scheduler's own runtime allocator rather than a
 * test-local counter, which is what makes the save/load comparison meaningful: a projection that
 * minted its own ordinals would reproduce across a boundary for the wrong reason.
 *
 * The immediate consumers run inside the same instant as the projection that feeds them:
 * character-relative causal-role derivation, continuant recognition, and the three viewpoint
 * renderers. Their results reach the committed outputs, so a consumer that behaved differently
 * after a reload would change the saved bytes rather than pass unnoticed.
 */
import {
  bytesToHex, canonicalEncode, list, signed, text, typedIdentifier,
  type CanonicalValue,
} from '../../substrate/canonicalEncoding';
import {
  commitManifest, createModelIdentity, createRunIdentity, runSeedFromFriendlyInteger,
} from '../../substrate/identity';
import {
  createCanonicalSave, loadCanonicalSave,
  type PersistentStateAdapter,
} from '../../substrate/persistence';
import {
  DeterministicScheduler, orderingParametersValue, orderingPhaseRegistryValue,
  type EventHandler,
} from '../../substrate/scheduler';
import { simInstant } from '../../substrate/time';
import {
  clonePerceptualContinuantFileState,
  continuantFileStateSummary,
  emptyPerceptualContinuantFileState,
  type PerceptualContinuantFileState,
} from '../../semanticBinding/perceptualContinuantFiles';
import {
  clonePerceptualEventFileState,
  emptyPerceptualEventFileState,
  eventFileStateSummary,
  type PerceptualEventFileState,
} from '../../semanticBinding/perceptualEventFiles';
import { SEMANTIC_RECORD_SCHEMAS } from '../../semanticBinding/semanticSchemaRegistry';
import { semanticStateAuthorityRegistryValue } from '../../semanticBinding/semanticStateAuthority';
import {
  perceptualContinuantFileStateValue,
  perceptualEventFileStateValue,
  restorePerceptualContinuantFileState,
  restorePerceptualEventFileState,
} from '../../semanticBinding/semanticCodecs';
import {
  DARIUS,
  GLEN,
  MINA,
  SKIP_ROPE_SCHEMA,
  deriveObserverCausalRoles,
  observerSemanticView,
  projectObserver,
  recognizeObserverContinuant,
  truthBindings,
  type CatalogCandidate,
  type ObserverId,
  type RunAllocator,
} from './phenSem001';
import type { EventBinding } from '../../semanticBinding/eventBindings';
import type { PreRecognitionSemanticExperience } from '../../semanticBinding/perceptualEventFiles';
import type { CausalRoleEvidence } from '../../semanticBinding/evidenceProvenance';
import type { RecognitionResolutionRecord } from '../../semanticBinding/recognition';
import { renderAllViewpoints, RENDERER_VIEWPOINTS } from './phenSem001Renderer';
import {
  causalRoleEvidenceValue,
  preRecognitionSemanticExperienceValue,
  recognitionResolutionRecordValue,
  worldEventTruthValue,
} from '../../semanticBinding/semanticEvidenceCodecs';

export interface FixtureState {
  readonly continuantFiles: PerceptualContinuantFileState;
  readonly eventFiles: PerceptualEventFileState;
  /**
   * Settlement validity. The integrated whole-instant control sets this false *after* the handler
   * has done real work — allocated occurrences, compiled bindings, derived causal roles, recognised
   * a continuant, rendered, and contributed trace and outputs — so the rollback proof runs against
   * a fully populated instant rather than an empty one.
   */
  readonly valid: boolean;
}

export const initialState = (): FixtureState => ({
  continuantFiles: emptyPerceptualContinuantFileState(),
  eventFiles: emptyPerceptualEventFileState(),
  valid: true,
});

/** Both semantic state roots persist through the accepted `SEM-001I.2` codecs, never ad hoc. */
export const adapter: PersistentStateAdapter<FixtureState> = {
  clone: (state) => ({
    continuantFiles: clonePerceptualContinuantFileState(state.continuantFiles),
    eventFiles: clonePerceptualEventFileState(state.eventFiles),
    valid: state.valid,
  }),
  validate: (state) => {
    continuantFileStateSummary(state.continuantFiles);
    eventFileStateSummary(state.eventFiles);
    if (!state.valid) throw new Error('injected integrated-instant commit failure');
  },
  canonicalValue: (state) => list([
    perceptualContinuantFileStateValue(state.continuantFiles),
    perceptualEventFileStateValue(state.eventFiles),
    state.valid,
  ]),
  restore: (value) => {
    if (typeof value === 'boolean' || value.kind !== 'list') throw new Error('invalid fixture save');
    const [continuant, event, valid] = value.items;
    return {
      continuantFiles: restorePerceptualContinuantFileState(continuant),
      eventFiles: restorePerceptualEventFileState(event),
      valid: valid === true,
    };
  },
  analyticalAnchors: () => list([]),
  randomRelevantAuthoritativeIds: () => list([]),
};

export const OBSERVE = typedIdentifier(35000n, text('event/phen-sem-001-observe'));
export const handlerKey = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));

/** Each observer's own catalog. Seeded knowledge; never derived from the truth side. */
export const CATALOGS: Readonly<Record<ObserverId, readonly CatalogCandidate[]>> = Object.freeze({
  [MINA]: [{ candidateSemanticReferentId: 'person.glen', recognitionTemplateId: 'template/glen' }],
  [DARIUS]: [{ candidateSemanticReferentId: 'person.mina', recognitionTemplateId: 'template/mina' }],
  [GLEN]: [{ candidateSemanticReferentId: 'person.mina', recognitionTemplateId: 'template/mina' }],
});

/** The track each observer recognises and derives a causal role for. */
export const CONSUMED_TRACK: Readonly<Record<ObserverId, string>> = Object.freeze({
  [MINA]: 'mina/companion', [DARIUS]: 'darius/actor', [GLEN]: 'glen/actor',
});

export const observerPayload = (observerId: ObserverId, experienceId: bigint): CanonicalValue =>
  list([text(observerId), signed(experienceId)]);

export function asPayload(value: CanonicalValue): readonly [ObserverId, bigint] {
  if (typeof value === 'boolean' || value.kind !== 'list') throw new Error('invalid observer payload');
  const [observer, experience] = value.items;
  if (typeof observer === 'boolean' || observer.kind !== 'text') throw new Error('invalid observer payload');
  if (typeof experience === 'boolean' || experience.kind !== 'signed') throw new Error('invalid experience payload');
  return [observer.value as ObserverId, experience.value];
}

/**
 * The fixture's allocator, backed by the scheduler's own runtime allocator. `peek` is deliberately
 * unavailable: the fixture never reads it, and a scheduler-backed allocator has no meaningful
 * answer that would not invite a consumer to depend on allocator position.
 */
export const schedulerAllocator = (allocateRuntimeId: () => bigint): RunAllocator => ({
  next: allocateRuntimeId,
  peek: () => { throw new Error('allocator position is not observable inside a transition'); },
});

/** The truth event's own occurrence ordinal, canonically encoded once per run. */
export const WORLD_EVENT_ORDINAL = 900n;

/**
 * The whole causal chain for one observer, in accepted canonical bytes.
 *
 * This is the `SEM-001J` claim made executable: truth bindings, the observer's assembled experience
 * (which transitively carries their perceived bindings and classifications), their character-relative
 * causal-role evidence, and their recognition resolution, each constructed through the accepted
 * codecs over the frozen `SEM-001I.2` allocation. A record that could only be described in memory,
 * or one tagged with a version no accepted contract governs, cannot appear here at all.
 */
export function canonicalChainValue(input: {
  readonly truth: readonly EventBinding[];
  readonly experience: PreRecognitionSemanticExperience;
  readonly causal: readonly CausalRoleEvidence[];
  readonly resolution?: RecognitionResolutionRecord;
}): CanonicalValue {
  return list([
    worldEventTruthValue({
      worldEventOrdinal: WORLD_EVENT_ORDINAL,
      eventTypeId: SKIP_ROPE_SCHEMA.eventTypeId,
      occurredAt: 10n,
      bindings: input.truth,
    }),
    preRecognitionSemanticExperienceValue(input.experience),
    list(input.causal.map(causalRoleEvidenceValue)),
    list(input.resolution ? [recognitionResolutionRecordValue(input.resolution)] : []),
  ]);
}

/**
 * One observer's whole pass for one truth event, followed immediately by its consumers. Everything
 * the consumers produce reaches the committed outputs.
 */
export const observeHandler = (options: { readonly failAtSettlement?: boolean } = {}): EventHandler<FixtureState> =>
  ({ state, event, allocateRuntimeId }) => {
    const [observerId, experienceId] = asPayload(event.payload);
    const allocator = schedulerAllocator(allocateRuntimeId);

    const truth = truthBindings();
    const projection = projectObserver({
      observerId,
      truth,
      allocator,
      experienceId,
      continuantFiles: state.continuantFiles,
      eventFiles: state.eventFiles,
    });

    const consumedTrack = projection.tracksByLabel.get(CONSUMED_TRACK[observerId])!;

    // Immediate consumer 1 — character-relative causal roles from this observer's own evidence.
    const causal = deriveObserverCausalRoles(projection, consumedTrack, allocator.next());

    // Immediate consumer 2 — continuant recognition against this observer's own catalog.
    const catalog = CATALOGS[observerId];
    const resolution = recognizeObserverContinuant({
      projection,
      perceptualReferentId: consumedTrack,
      catalog,
      assertCandidate: catalog[0],
      nextRuntimeId: allocator.next(),
    });

    // Immediate consumer 3 — the three viewpoint renderers over the assembled experience.
    const views = renderAllViewpoints({
      projection,
      resolutionLog: resolution ? [resolution] : [],
    });

    return {
      nextState: {
        continuantFiles: projection.continuantFiles,
        eventFiles: projection.eventFiles,
        valid: !options.failAtSettlement,
      },
      emittedEvents: [],
      traceContributions: [list([
        text(`observe:${observerId}`),
        perceptualContinuantFileStateValue(projection.continuantFiles),
        perceptualEventFileStateValue(projection.eventFiles),
        // The whole causal chain, in accepted canonical bytes, committed to the trace. A record
        // that cannot be built through the accepted codecs cannot be committed either.
        canonicalChainValue({
          truth, experience: projection.experience, causal, resolution,
        }),
      ])],
      outputs: [
        // Ordinal-free semantics, so a reload that shifted allocation would still be caught by the
        // byte comparison while this output stays readable as meaning rather than as numbers.
        ...observerSemanticView(projection).map((line) => text(`view:${observerId}:${line}`)),
        ...causal.map((value) => text(`causal:${observerId}:${value.causalRoleId}`)),
        text(`identity:${observerId}:${resolution?.resolution.kind === 'asserted-candidate'
          ? resolution.resolution.candidateSemanticReferentId : 'unrecognised'}`),
        ...RENDERER_VIEWPOINTS.flatMap((viewpoint) =>
          views.get(viewpoint)!.recordLines.map((line) => text(`render:${observerId}:${viewpoint}:${line}`))),
      ],
    };
  };

export async function identities(state: FixtureState) {
  const modelIdentity = await createModelIdentity({
    rulesVersion: 'rules/phen-sem-001-integration',
    contentSchemaVersion: 'content/phen-sem-001-1',
    contentManifest: await commitManifest(list([])),
    parameterSchemaVersion: 'parameters/phen-sem-001-1',
    parameterSet: await commitManifest(list([orderingParametersValue(200n)])),
    numericProfileVersion: 'numeric/exact-1',
    randomAlgorithmVersion: 'rng/sha256-addressed-128-v1-candidate',
    registrySchemaVersion: 'registry/phen-sem-001-1',
    registryManifest: await commitManifest(list([
      orderingPhaseRegistryValue(), OBSERVE, semanticStateAuthorityRegistryValue(),
    ])),
  });
  const runIdentity = await createRunIdentity({
    modelIdentity,
    initialState: await commitManifest(adapter.canonicalValue(state)),
    orderedInputSequence: await commitManifest(list([])),
    runSeed: runSeedFromFriendlyInteger(13n),
  });
  return { modelIdentity, runIdentity };
}

export const scheduler = (state: FixtureState, handlers: ReadonlyMap<string, EventHandler<FixtureState>>) =>
  new DeterministicScheduler({
    initialState: state,
    stateAdapter: adapter,
    handlers,
    maxSettlementWorkPerSimulationInstant: 200n,
    initialAllocators: { nextRuntimeId: 5000n, nextEventId: 0n, nextEventSequence: 0n },
  });


/** The three observers, each in their own instant, in the fixture's canonical order. */
export const SCHEDULE: readonly (readonly [ObserverId, bigint, bigint])[] = Object.freeze([
  [MINA, 1n, 1n], [DARIUS, 2n, 2n], [GLEN, 3n, 3n],
]);
