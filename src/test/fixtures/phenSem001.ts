/**
 * `PHEN-SEM-001` — Observer-relative event bindings without recognition leakage.
 *
 * Truth event: Mina skipped rope with Glen in the Library using the Lead Pipe.
 *
 * The fixture keeps the two sides strictly apart. Truth holds the event type, its role bindings,
 * and the referents those bindings name. Each observer holds only their own perceptual
 * continuant-files, event-file, perceived bindings, feature observations, and classifications.
 * Nothing here copies a truth `EventBindingId` or `SemanticReferentId` into character evidence:
 * the observer side is reached exclusively through `projectEventRoleEvidence`, which yields a role
 * evidence value and nothing else.
 *
 * Every occurrence identity is an allocated ordinal drawn from one shared run-scoped allocator,
 * so interleaving observers perturbs raw ordinals without perturbing anyone's semantics.
 */
import {
  EventRoleId,
  compileEventBindings,
  finiteMax,
  projectEventRoleEvidence,
  unboundedMax,
  type EventBinding,
  type EventBindingRequest,
  type EventTypeBindingSchema,
  type PermittedRoleObservation,
  type SemanticReferent,
} from '../../semanticBinding/eventBindings';
import {
  applyPerceptualTrackTransition,
  emptyPerceptualContinuantFileState,
  type PerceptualContinuantFileState,
  type PerceptualReferentId,
  type PerceptualTrackTransition,
  type SupportingObservationId,
} from '../../semanticBinding/perceptualContinuantFiles';
import {
  PERCEPTUAL_EVENT_FILE_CONTRACT_VERSION,
  applyPerceptualEventTransition,
  assemblePreRecognitionExperience,
  compilePerceivedBindings,
  emptyPerceptualEventFileState,
  type PerceivedBindingEvidence,
  type PerceptualEventFileState,
  type PerceptualEventReferentId,
  type PreRecognitionSemanticExperience,
} from '../../semanticBinding/perceptualEventFiles';
import {
  INITIAL_RECOGNITION_DERIVATION,
  INITIAL_RECOGNITION_RULE,
  RECOGNITION_CONTRACT_VERSION,
  compileRecognitionModel,
  evaluateContinuantRecognition,
  type PermittedRecognitionCueEvidence,
  type RecognitionCandidateCatalogEntry,
  type RecognitionResolutionRecord,
} from '../../semanticBinding/recognition';
import {
  CausalRoleId,
  EVIDENCE_PROVENANCE_CONTRACT_VERSION,
  INITIAL_CAUSAL_ROLE_RULE,
  characterEvidenceRefKey,
  compileCausalRoleModel,
  deriveCausalRoleEvidence,
  type CausalRoleEvidence,
  type CharacterEvidenceRef,
  type EvidenceReadDomain,
  type ObserverSafeEvidenceOccurrence,
} from '../../semanticBinding/evidenceProvenance';
import {
  INITIAL_CLASSIFICATION_DERIVATIONS,
  INITIAL_PERCEPTUAL_CLASSIFICATION_RULES,
  INITIAL_PERCEPTUAL_FACET_DEFINITIONS,
  PerceptualFeatureId,
  classifyContinuant,
  compilePerceptualClassificationModel,
  type PerceptualClassificationEvidence,
  type PermittedPerceptualFeatureObservation,
} from '../../semanticBinding/perceptualClassification';

export const TRUTH_VERSION = 'phen-sem-001/truth-1' as const;
export const SEM_A = 'semantic-binding/0.1-candidate#SEM-001A' as const;
export const SEM_C = 'semantic-binding/0.1-candidate#SEM-001C' as const;
export const SEM_D = 'semantic-binding/0.1-candidate#SEM-001D' as const;

export const MINA = 'character/mina';
export const DARIUS = 'character/darius';
export const GLEN = 'character/glen';
export const OBSERVERS = [MINA, DARIUS, GLEN] as const;
export type ObserverId = typeof OBSERVERS[number];

// ---------------------------------------------------------------------------
// Truth side
// ---------------------------------------------------------------------------

export const REFERENT = Object.freeze({
  skipRope: { semanticReferentId: 'action.skip_rope', domainTags: ['action'] },
  mina: { semanticReferentId: 'person.mina', domainTags: ['entity'] },
  glen: { semanticReferentId: 'person.glen', domainTags: ['entity'] },
  library: { semanticReferentId: 'location.library', domainTags: ['location'] },
  leadPipe: { semanticReferentId: 'object.lead_pipe', domainTags: ['entity', 'usable-entity'] },
}) satisfies Record<string, SemanticReferent>;

export const SKIP_ROPE_SCHEMA: EventTypeBindingSchema = Object.freeze({
  eventTypeId: 'event-type/skip-rope',
  // Canonically ordered by EventRoleId, as the accepted schema validation requires.
  roleCardinalityRules: Object.freeze([
    { eventRoleId: EventRoleId.Action, minOccurrences: 1, maxOccurrences: finiteMax(1) },
    { eventRoleId: EventRoleId.Actor, minOccurrences: 1, maxOccurrences: finiteMax(1) },
    { eventRoleId: EventRoleId.Companion, minOccurrences: 0, maxOccurrences: unboundedMax() },
    { eventRoleId: EventRoleId.Instrument, minOccurrences: 0, maxOccurrences: finiteMax(1) },
    { eventRoleId: EventRoleId.Location, minOccurrences: 1, maxOccurrences: finiteMax(1) },
  ].sort((left, right) => left.eventRoleId < right.eventRoleId ? -1 : left.eventRoleId > right.eventRoleId ? 1 : 0)),
  bindingSchemaVersion: 'binding-schema/skip-rope-1',
});

/** The canonical truth event of the corpus entry. */
export const CANONICAL_BINDING_REQUESTS: readonly EventBindingRequest[] = Object.freeze([
  { eventRoleId: EventRoleId.Action, semanticReferent: REFERENT.skipRope },
  { eventRoleId: EventRoleId.Actor, semanticReferent: REFERENT.mina },
  { eventRoleId: EventRoleId.Companion, semanticReferent: REFERENT.glen },
  { eventRoleId: EventRoleId.Location, semanticReferent: REFERENT.library },
  { eventRoleId: EventRoleId.Instrument, semanticReferent: REFERENT.leadPipe },
]);

/** Same referents, Actor and Companion exchanged. Used by the role-swap controls. */
export const SWAPPED_BINDING_REQUESTS: readonly EventBindingRequest[] = Object.freeze([
  { eventRoleId: EventRoleId.Action, semanticReferent: REFERENT.skipRope },
  { eventRoleId: EventRoleId.Actor, semanticReferent: REFERENT.glen },
  { eventRoleId: EventRoleId.Companion, semanticReferent: REFERENT.mina },
  { eventRoleId: EventRoleId.Location, semanticReferent: REFERENT.library },
  { eventRoleId: EventRoleId.Instrument, semanticReferent: REFERENT.leadPipe },
]);

/** One referent occupying two roles at once. Used by the multi-role controls. */
export const MULTI_ROLE_BINDING_REQUESTS: readonly EventBindingRequest[] = Object.freeze([
  { eventRoleId: EventRoleId.Action, semanticReferent: REFERENT.skipRope },
  { eventRoleId: EventRoleId.Actor, semanticReferent: REFERENT.mina },
  { eventRoleId: EventRoleId.Companion, semanticReferent: REFERENT.mina },
  { eventRoleId: EventRoleId.Location, semanticReferent: REFERENT.library },
]);

/** Two distinct referents in one repeatable role. */
export const REPEATED_ROLE_BINDING_REQUESTS: readonly EventBindingRequest[] = Object.freeze([
  { eventRoleId: EventRoleId.Action, semanticReferent: REFERENT.skipRope },
  { eventRoleId: EventRoleId.Actor, semanticReferent: REFERENT.mina },
  { eventRoleId: EventRoleId.Companion, semanticReferent: REFERENT.glen },
  { eventRoleId: EventRoleId.Companion, semanticReferent: REFERENT.leadPipe },
  { eventRoleId: EventRoleId.Location, semanticReferent: REFERENT.library },
]);

export function truthBindings(
  requests: readonly EventBindingRequest[] = CANONICAL_BINDING_REQUESTS,
  nextRuntimeId = 1000n,
): readonly EventBinding[] {
  return compileEventBindings(SKIP_ROPE_SCHEMA, requests, nextRuntimeId).bindings;
}

// ---------------------------------------------------------------------------
// Per-observer permitted visibility
// ---------------------------------------------------------------------------

/**
 * What each observer is permitted to perceive of each truth role.
 *
 * `Action` is deliberately absent from every observer: `SEM-001C` represents the action as the
 * perceived event-file, never as a continuant-file binding, so an Action role binding on a
 * continuant is a closure failure rather than a projection choice.
 */
export interface ObserverRoleAffordance {
  readonly eventRoleId: EventRoleId;
  readonly permitted: PermittedRoleObservation;
  /** Label of the observer's own continuant-file; ordinals are allocated, never derived. */
  readonly trackLabel: string;
  /** Which occurrence of a repeatable role this affordance perceives. Defaults to the first. */
  readonly occurrenceIndex?: number;
}

export const OBSERVER_AFFORDANCES: Readonly<Record<ObserverId, readonly ObserverRoleAffordance[]>> = Object.freeze({
  // Mina is the actor; she perceives her companion, the place, and the instrument.
  [MINA]: Object.freeze([
    { eventRoleId: EventRoleId.Companion, permitted: { kind: 'preserve' } as const, trackLabel: 'mina/companion' },
    { eventRoleId: EventRoleId.Location, permitted: { kind: 'preserve' } as const, trackLabel: 'mina/place' },
    { eventRoleId: EventRoleId.Instrument, permitted: { kind: 'preserve' } as const, trackLabel: 'mina/instrument' },
  ]),
  // Darius sees an actor and a place. No Glen binding, no instrument reaches him at all.
  [DARIUS]: Object.freeze([
    { eventRoleId: EventRoleId.Actor, permitted: { kind: 'preserve' } as const, trackLabel: 'darius/actor' },
    { eventRoleId: EventRoleId.Location, permitted: { kind: 'preserve' } as const, trackLabel: 'darius/place' },
  ]),
  // Glen sees the actor coarsened to Participant, the place, and the instrument.
  [GLEN]: Object.freeze([
    { eventRoleId: EventRoleId.Actor, permitted: { kind: 'coarsen-to-participant' } as const, trackLabel: 'glen/actor' },
    { eventRoleId: EventRoleId.Location, permitted: { kind: 'preserve' } as const, trackLabel: 'glen/place' },
    { eventRoleId: EventRoleId.Instrument, permitted: { kind: 'unresolved' } as const, trackLabel: 'glen/instrument' },
  ]),
});

/**
 * One observer perceiving a single continuant in two roles of the same event-file. Used by the
 * perceived-side multi-role control, where referent-keyed deduplication would collapse two
 * legitimate binding occurrences into one.
 */
export const MULTI_ROLE_AFFORDANCES: readonly ObserverRoleAffordance[] = Object.freeze([
  { eventRoleId: EventRoleId.Actor, permitted: { kind: 'preserve' } as const, trackLabel: 'shared/person' },
  { eventRoleId: EventRoleId.Companion, permitted: { kind: 'preserve' } as const, trackLabel: 'shared/person' },
  { eventRoleId: EventRoleId.Location, permitted: { kind: 'preserve' } as const, trackLabel: 'shared/place' },
]);

/**
 * One observer perceiving two distinct continuants in the same repeatable role of one event-file.
 * Role-keyed storage would collapse these two legitimate occurrences into one.
 */
export const REPEATED_ROLE_AFFORDANCES: readonly ObserverRoleAffordance[] = Object.freeze([
  { eventRoleId: EventRoleId.Companion, permitted: { kind: 'preserve' } as const, trackLabel: 'repeated/first', occurrenceIndex: 0 },
  { eventRoleId: EventRoleId.Companion, permitted: { kind: 'preserve' } as const, trackLabel: 'repeated/second', occurrenceIndex: 1 },
  { eventRoleId: EventRoleId.Location, permitted: { kind: 'preserve' } as const, trackLabel: 'repeated/place' },
]);

/** Controlled appearance evidence per track label. Truth kind never copies through. */
export const TRACK_FEATURES: Readonly<Record<string, readonly PerceptualFeatureId[]>> = Object.freeze({
  'mina/companion': [PerceptualFeatureId.ObservedPersonForm],
  'mina/place': [PerceptualFeatureId.ObservedEnclosureForm],
  'mina/instrument': [PerceptualFeatureId.ObservedDiscreteObjectForm, PerceptualFeatureId.ObservedMetallicSurface],
  'darius/actor': [PerceptualFeatureId.ObservedPersonForm],
  'darius/place': [PerceptualFeatureId.ObservedEnclosureForm],
  'glen/actor': [PerceptualFeatureId.ObservedPersonForm],
  'glen/place': [PerceptualFeatureId.ObservedEnclosureForm],
  'glen/instrument': [PerceptualFeatureId.ObservedDiscreteObjectForm, PerceptualFeatureId.ObservedElongatedForm],
  'shared/person': [PerceptualFeatureId.ObservedPersonForm],
  'shared/place': [PerceptualFeatureId.ObservedEnclosureForm],
  'repeated/first': [PerceptualFeatureId.ObservedPersonForm],
  'repeated/second': [PerceptualFeatureId.ObservedDiscreteObjectForm],
  'repeated/place': [PerceptualFeatureId.ObservedEnclosureForm],
});

// ---------------------------------------------------------------------------
// One shared run-scoped allocator
// ---------------------------------------------------------------------------

export interface RunAllocator {
  next(): bigint;
  readonly peek: () => bigint;
}

export function createRunAllocator(start = 5000n): RunAllocator {
  let value = start;
  return { next: () => value++, peek: () => value };
}

export const classificationModel = () => compilePerceptualClassificationModel(
  'model/phen-sem-001-classification',
  INITIAL_PERCEPTUAL_FACET_DEFINITIONS,
  INITIAL_PERCEPTUAL_CLASSIFICATION_RULES,
  INITIAL_CLASSIFICATION_DERIVATIONS,
);

// ---------------------------------------------------------------------------
// Observer projection
// ---------------------------------------------------------------------------

/**
 * One omniscient trace edge. It links a perceived binding occurrence back to the exact truth
 * binding and the observation operation that produced it. This graph is deliberately kept beside
 * the projection, never inside it: character evidence carries no field that could reach it.
 */
export interface OmniscientAncestryEdge {
  readonly perceivedBindingId: bigint;
  readonly truthEventBindingId: bigint;
  readonly truthSemanticReferentId: string;
  readonly truthEventRoleId: EventRoleId;
  readonly observerId: ObserverId;
  readonly observationIds: readonly bigint[];
}

export interface ObserverProjection {
  readonly observerId: ObserverId;
  readonly eventFile: PerceptualEventReferentId;
  readonly tracksByLabel: ReadonlyMap<string, PerceptualReferentId>;
  readonly trackTransitions: readonly PerceptualTrackTransition[];
  readonly perceivedBindings: readonly PerceivedBindingEvidence[];
  readonly classifications: readonly PerceptualClassificationEvidence[];
  readonly experience: PreRecognitionSemanticExperience;
  readonly continuantFiles: PerceptualContinuantFileState;
  readonly eventFiles: PerceptualEventFileState;
  /** Trace-side only. Never reachable from any character-accessible record. */
  readonly omniscientAncestry: readonly OmniscientAncestryEdge[];
}

export interface ProjectionInput {
  readonly observerId: ObserverId;
  readonly truth: readonly EventBinding[];
  readonly allocator: RunAllocator;
  readonly experienceId: bigint;
  readonly occurredAt?: bigint;
  /** Optional affordance override, for controls that vary permitted visibility. */
  readonly affordances?: readonly ObserverRoleAffordance[];
  readonly continuantFiles?: PerceptualContinuantFileState;
  readonly eventFiles?: PerceptualEventFileState;
  /**
   * Controlled appearance evidence per track label. Defaults to the fixture's own table; an
   * override lets a control vary the permitted evidence, or carry the same evidence across a run
   * whose scaffolding labels were deliberately changed.
   */
  readonly trackFeatures?: Readonly<Record<string, readonly PerceptualFeatureId[]>>;
  /**
   * Continuant-files this observer already holds, by track label. A label named here continues its
   * prior file instead of allocating a new one — how one observer re-encounters the same perceived
   * continuant in a later experience. Requires `continuantFiles` carrying those files as active.
   */
  readonly priorTracksByLabel?: ReadonlyMap<string, PerceptualReferentId>;
}

/**
 * Runs one observer end to end for one truth event: detections and tracks, the event-file, the
 * permitted role projection, perceived bindings, controlled feature observations, classification,
 * and the assembled pre-recognition experience.
 */
export function projectObserver(input: ProjectionInput): ObserverProjection {
  const {
    observerId, truth, allocator, experienceId,
    occurredAt = 10n,
    affordances = OBSERVER_AFFORDANCES[input.observerId],
  } = input;

  let continuantFiles = input.continuantFiles ?? emptyPerceptualContinuantFileState();
  let eventFiles = input.eventFiles ?? emptyPerceptualEventFileState();

  const observation = (): SupportingObservationId => ({ observerId, observationId: allocator.next() });

  // One perceived event-file stands for the observed action occurrence.
  const eventTransition = applyPerceptualEventTransition(eventFiles, {
    observerId,
    currentEventDetectionId: { observerId, eventDetectionOccurrenceId: allocator.next() },
    continuityKind: 'NewEventFile',
    supportingObservationIds: [observation()],
    occurredAt,
    transformationVersion: SEM_C,
  });
  eventFiles = eventTransition.state;
  const eventFile = eventTransition.transition.perceptualEventReferentId;

  const tracksByLabel = new Map<string, PerceptualReferentId>();
  const trackTransitions: PerceptualTrackTransition[] = [];
  const bindingRequests: Parameters<typeof compilePerceivedBindings>[0][number][] = [];
  /**
   * Trace-side lookup from a perceived binding's own (continuant, role) identity to the truth
   * binding it descends from. Keyed rather than indexed: `compilePerceivedBindings` returns its
   * results in canonical order, which is not the order the requests were built in.
   */
  const sourceByBindingKey = new Map<string, EventBinding>();
  const bindingKey = (trackSequence: bigint, roleEvidence: { kind: string; eventRoleId?: string }): string =>
    `${trackSequence}\u0000${roleEvidence.kind === 'exact' ? roleEvidence.eventRoleId : 'unresolved'}`;

  for (const affordance of affordances) {
    const matching = truth.filter((candidate) => candidate.eventRoleId === affordance.eventRoleId);
    const binding = matching[affordance.occurrenceIndex ?? 0];
    if (!binding) continue;

    // Two affordances may name one label: the observer perceives a single continuant occupying
    // several roles in the same event-file, which must remain several binding occurrences.
    let track = tracksByLabel.get(affordance.trackLabel);
    if (!track) {
      // A label the observer already holds continues its prior file; anything else starts a new
      // one. Continuity is an observer-side decision here exactly as it is in the accepted seam:
      // truth identity is not consulted and performs no merge or repair.
      const prior = input.priorTracksByLabel?.get(affordance.trackLabel);
      const trackTransition = applyPerceptualTrackTransition(continuantFiles, {
        observerId,
        ...(prior ? { priorPerceptualReferentId: prior } : {}),
        currentDetectionId: { observerId, detectionOccurrenceId: allocator.next() },
        continuityKind: prior ? 'ContinuesPriorTrack' : 'NewTrack',
        supportingObservationIds: [observation()],
        occurredAt,
        transformationVersion: SEM_A,
      });
      continuantFiles = trackTransition.state;
      track = trackTransition.transition.perceptualReferentId;
      tracksByLabel.set(affordance.trackLabel, track);
      trackTransitions.push(trackTransition.transition);
    }

    // The only channel from truth to the observer: a role evidence value, nothing else.
    const projected = projectEventRoleEvidence(binding, track, affordance.permitted);
    if (!projected) continue;
    sourceByBindingKey.set(
      bindingKey(projected.perceptualReferentId.observerTrackSequence, projected.eventRoleEvidence),
      binding,
    );
    bindingRequests.push({
      observerId,
      perceptualEventReferentId: eventFile,
      perceptualReferentId: projected.perceptualReferentId,
      eventRoleEvidence: projected.eventRoleEvidence,
      supportingObservationIds: [observation()],
      occurredAt,
      transformationVersion: SEM_C,
    });
  }

  const perceived = compilePerceivedBindings(bindingRequests, allocator.next());

  // Omniscient ancestry is assembled here, on the trace side, from what the projection step knew.
  const ancestry: OmniscientAncestryEdge[] = perceived.bindings.map((binding) => {
    const source = sourceByBindingKey.get(
      bindingKey(binding.perceptualReferentId.observerTrackSequence, binding.eventRoleEvidence));
    if (!source) throw new Error('fixture: perceived binding has no truth ancestor');
    return {
      perceivedBindingId: binding.perceivedBindingId,
      truthEventBindingId: source.eventBindingId,
      truthSemanticReferentId: source.semanticReferent.semanticReferentId,
      truthEventRoleId: source.eventRoleId,
      observerId,
      observationIds: binding.supportingObservationIds.map((value) => value.observationId),
    };
  });

  // Controlled appearance evidence, then classification, per perceived continuant.
  const model = classificationModel();
  const classifications: PerceptualClassificationEvidence[] = [];
  for (const [label, track] of tracksByLabel) {
    const featureIds = (input.trackFeatures ?? TRACK_FEATURES)[label] ?? [];
    if (featureIds.length === 0) continue;
    const detection = { observerId, detectionOccurrenceId: allocator.next() };
    const featureObservations: PermittedPerceptualFeatureObservation[] = featureIds.map((perceptualFeatureId) => ({
      featureObservationId: allocator.next(),
      observerId,
      currentDetectionId: detection,
      perceptualReferentId: track,
      perceptualFeatureId,
      booleanValue: true,
      observationChannelId: 'observation-channel/controlled-visual',
      supportingObservationIds: [observation()],
      occurredAt,
      transformationVersion: SEM_D,
    })).sort((left, right) => left.featureObservationId < right.featureObservationId ? -1
      : left.featureObservationId > right.featureObservationId ? 1 : 0);

    const result = classifyContinuant(model, {
      experienceId,
      observerId,
      perceptualReferentId: track,
      currentDetectionId: detection,
      featureObservations,
      occurredAt,
      transformationVersion: SEM_D,
    }, allocator.next());
    classifications.push(...result.classifications);
  }

  const experience = assemblePreRecognitionExperience({
    experienceId,
    observerId,
    occurredAt,
    perceptualEventReferentIds: [eventFile],
    perceivedBindings: perceived.bindings,
    perceptualClassifications: classifications,
    perceptualEventClassifications: [],
    supportingObservationIds: [observation()],
    transformationVersion: SEM_C,
  });

  return Object.freeze({
    observerId,
    eventFile,
    tracksByLabel,
    trackTransitions: Object.freeze(trackTransitions),
    perceivedBindings: perceived.bindings,
    classifications: Object.freeze(classifications),
    experience,
    continuantFiles,
    eventFiles,
    omniscientAncestry: Object.freeze(ancestry),
  });
}

// ---------------------------------------------------------------------------
// Character-relative causal roles
// ---------------------------------------------------------------------------

/**
 * Authoritative records carry accepted seam-contract versions, never fixture-scoped labels. The
 * `SEM-001I.3` codecs admit exactly `SEM-001A..H` in a `TransformationVersion` or
 * `RecognitionVersion` field, so a record tagged `phen-sem-001/causal-1` could not be canonically
 * encoded at all — it would be an authoritative result depending on a symbolic string.
 *
 * `SEM-001G` owns causal-role evidence. The seam that *produced* a perceived binding is `SEM-001C`,
 * which is what the consuming `ReadDomain` must admit: the producing seam is the binding's, not the
 * consumer's.
 */
export const CAUSAL_SEAM_VERSION = EVIDENCE_PROVENANCE_CONTRACT_VERSION;
export const PERCEIVED_BINDING_PRODUCING_SEAM = PERCEPTUAL_EVENT_FILE_CONTRACT_VERSION;
export const PERCEIVED_BINDING_SCHEMA = 'perceived-binding/0.1-candidate' as const;

export const causalRoleModel = () => compileCausalRoleModel(
  'model/phen-sem-001-causal-role', [INITIAL_CAUSAL_ROLE_RULE],
);

const causalReadDomain = (): EvidenceReadDomain => ({
  transitionKindId: 'transition/derive-character-causal-role',
  permittedEvidenceSchemas: [{
    refKind: 'perceived-binding',
    recordSchemaVersion: PERCEIVED_BINDING_SCHEMA,
    producingEpistemicSeamVersion: PERCEIVED_BINDING_PRODUCING_SEAM,
  }],
  temporalScope: 'SameExperience',
});

/**
 * Derives character-relative causal roles for one perceived continuant of one observer, using only
 * that observer's own perceived-binding evidence admitted through the consuming `ReadDomain`.
 */
export function deriveObserverCausalRoles(
  projection: ObserverProjection,
  perceptualReferentId: PerceptualReferentId,
  nextRuntimeId: bigint,
): readonly CausalRoleEvidence[] {
  const occurrences: ObserverSafeEvidenceOccurrence[] = projection.perceivedBindings
    .filter((binding) =>
      binding.perceptualReferentId.observerTrackSequence === perceptualReferentId.observerTrackSequence)
    .map((binding) => ({
      ref: { kind: 'perceived-binding', perceivedBindingId: binding.perceivedBindingId } as CharacterEvidenceRef,
      observerId: projection.observerId,
      occurredAt: binding.occurredAt,
      recordSchemaVersion: PERCEIVED_BINDING_SCHEMA,
      producingEpistemicSeamVersion: PERCEIVED_BINDING_PRODUCING_SEAM,
      scope: {
        experienceId: projection.experience.experienceId,
        carrier: {
          kind: 'continuant-in-event' as const,
          perceptualEventReferentId: projection.eventFile,
          perceptualReferentId: binding.perceptualReferentId,
        },
      },
    }))
    .sort((left, right) => characterEvidenceRefKey(left.ref) < characterEvidenceRefKey(right.ref) ? -1
      : characterEvidenceRefKey(left.ref) > characterEvidenceRefKey(right.ref) ? 1 : 0);

  return deriveCausalRoleEvidence(causalRoleModel(), {
    experience: projection.experience,
    perceptualEventReferentId: projection.eventFile,
    perceptualReferentId,
    evidenceOccurrences: occurrences,
    readDomain: causalReadDomain(),
    transformationVersion: CAUSAL_SEAM_VERSION,
  }, nextRuntimeId).evidence;
}

export { CausalRoleId };

/** Runs all three observers over one truth event through one shared allocator. */
export function projectAllObservers(options: {
  readonly truth?: readonly EventBinding[];
  readonly allocator?: RunAllocator;
  readonly order?: readonly ObserverId[];
} = {}): ReadonlyMap<ObserverId, ObserverProjection> {
  const truth = options.truth ?? truthBindings();
  const allocator = options.allocator ?? createRunAllocator();
  const order = options.order ?? OBSERVERS;
  const projections = new Map<ObserverId, ObserverProjection>();
  let experienceId = 1n;
  for (const observerId of order) {
    projections.set(observerId, projectObserver({ observerId, truth, allocator, experienceId: experienceId++ }));
  }
  return projections;
}

/**
 * Ordinal-free semantic view of one observer's perceived bindings: role evidence paired with the
 * classification facets asserted of the bound continuant. Track ordinals are relabelled by first
 * appearance, so two isomorphic runs compare equal regardless of allocator position.
 */
export function observerSemanticView(projection: ObserverProjection): readonly string[] {
  const labels = new Map<string, number>();
  const label = (referentId: PerceptualReferentId): string => {
    const key = `${referentId.observerId}/${referentId.observerTrackSequence}`;
    if (!labels.has(key)) labels.set(key, labels.size);
    return `continuant#${labels.get(key)}`;
  };
  const facetsFor = (referentId: PerceptualReferentId): readonly string[] => projection.classifications
    .filter((value) => value.perceptualReferentId.observerTrackSequence === referentId.observerTrackSequence)
    .map((value) => `${value.perceptualFacetId}=${String(value.typedPerceivedValue)}`)
    .sort();

  return Object.freeze(projection.perceivedBindings
    .map((binding) => {
      const role = binding.eventRoleEvidence.kind === 'exact'
        ? `role:${binding.eventRoleEvidence.eventRoleId}` : 'role:unresolved';
      return `${role}|${label(binding.perceptualReferentId)}|${facetsFor(binding.perceptualReferentId).join(',')}`;
    })
    .sort());
}

/** Bigint-aware serializer for structural leak checks. */
export function stringifyWithBigInts(value: unknown): string {
  return JSON.stringify(value, (_key, candidate: unknown) =>
    typeof candidate === 'bigint' ? candidate.toString() : candidate);
}

// ---------------------------------------------------------------------------
// Recognition
// ---------------------------------------------------------------------------

/** `SEM-001F` owns recognition; the same rule as `CAUSAL_SEAM_VERSION` above applies. */
export const RECOGNITION_VERSION = RECOGNITION_CONTRACT_VERSION;

export const recognitionModel = () => compileRecognitionModel(
  'model/phen-sem-001-recognition', [INITIAL_RECOGNITION_RULE], [INITIAL_RECOGNITION_DERIVATION],
);

/**
 * One candidate the observer independently holds in their own catalog. A catalog entry is seeded
 * observer knowledge: it is never derived from the truth side, and a candidate identity coinciding
 * with a truth referent is what recognising correctly *means* rather than a leak.
 */
export interface CatalogCandidate {
  readonly candidateSemanticReferentId: string;
  readonly recognitionTemplateId: string;
}

/** Observer-owned candidate catalog. Seeded knowledge, never derived from truth. */
export function observerCatalog(
  observerId: ObserverId,
  candidates: readonly CatalogCandidate[],
): readonly RecognitionCandidateCatalogEntry[] {
  return Object.freeze([...candidates]
    .map((candidate) => Object.freeze({
      observerId,
      candidateSemanticReferentId: candidate.candidateSemanticReferentId,
      candidateDomain: 'Person' as const,
      recognitionTemplateIds: Object.freeze([candidate.recognitionTemplateId]),
      catalogEntryVersion: RECOGNITION_VERSION,
    }))
    .sort((left, right) => left.candidateSemanticReferentId < right.candidateSemanticReferentId ? -1
      : left.candidateSemanticReferentId > right.candidateSemanticReferentId ? 1 : 0));
}

/**
 * Evaluates continuant recognition for one perceived track from a retained-template cue, against
 * the observer's whole catalog. Returns the resolution record when the rule asserts one; the
 * evaluation itself stays trace-side. Passing `priorResolutionHistory` is what makes a second call
 * an appended revision rather than an independent assertion.
 */
export function recognizeObserverContinuant(options: {
  readonly projection: ObserverProjection;
  readonly perceptualReferentId: PerceptualReferentId;
  readonly catalog: readonly CatalogCandidate[];
  readonly assertCandidate: CatalogCandidate;
  readonly nextRuntimeId: bigint;
  readonly priorResolutionHistory?: readonly RecognitionResolutionRecord[];
}): RecognitionResolutionRecord | undefined {
  const { projection, perceptualReferentId, assertCandidate } = options;
  const supporting = projection.perceivedBindings.find((binding) =>
    binding.perceptualReferentId.observerTrackSequence === perceptualReferentId.observerTrackSequence);
  if (!supporting) throw new Error('fixture: no perceived binding for the recognised continuant');
  if (!options.catalog.some((candidate) =>
    candidate.candidateSemanticReferentId === assertCandidate.candidateSemanticReferentId)) {
    throw new Error('fixture: asserted candidate is not in the observer catalog');
  }

  const cue: PermittedRecognitionCueEvidence = {
    recognitionCueEvidenceId: options.nextRuntimeId,
    experienceId: projection.experience.experienceId,
    observerId: projection.observerId,
    perceptualReferentId,
    candidateSemanticReferentId: assertCandidate.candidateSemanticReferentId,
    recognitionCueSource: {
      kind: 'retained-template-match',
      recognitionTemplateId: assertCandidate.recognitionTemplateId,
    },
    cuePolarity: 'SupportsCandidate',
    supportingExperienceEvidenceRefs: [
      { kind: 'perceived-binding', perceivedBindingId: supporting.perceivedBindingId },
    ],
    occurredAt: projection.experience.occurredAt,
    transformationVersion: RECOGNITION_VERSION,
  };

  return evaluateContinuantRecognition(recognitionModel(), {
    experience: projection.experience,
    perceptualReferentId,
    candidateCatalog: observerCatalog(projection.observerId, options.catalog),
    identitySymbolMappings: [],
    cueEvidence: [cue],
    priorResolutionHistory: options.priorResolutionHistory ?? [],
    recognitionVersion: RECOGNITION_VERSION,
  }, options.nextRuntimeId + 1n).resolutionRecord;
}
