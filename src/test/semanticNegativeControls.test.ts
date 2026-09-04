/**
 * `SEM-001` acceptance gate, item 7: *all negative controls report exact first divergence or
 * closure failure.*
 *
 * `CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md` names thirty-one forbidden designs. Their behaviour is
 * covered across the vector suite, but until now no single place mapped a named control to the code
 * path that refuses it, so the gate item could not be audited. This file is that ledger: one `it`
 * per named control, in the order the contract lists them.
 *
 * Each control is discharged in exactly one of two forms, and the form is stated in the test:
 *
 *   - **Closure failure** — the forbidden construction is expressible, and the seam refuses it with
 *     an exact failure code. The code is asserted, never merely `toThrow`, so a refusal that moves
 *     to a different boundary is a visible change rather than a silent pass.
 *   - **Structural absence** — the forbidden construction is not expressible at all, because no
 *     admitted vocabulary, field, or carrier can express it. These are proved against the registered
 *     vocabulary itself, not against a hand-written denylist of spellings.
 *
 * First divergence is owned by the earliest deterministic structural validation boundary
 * (`STATE_MODEL.md`). Where several invariants would reject one construction, the code asserted here
 * is the first one reached; later-layer invariants remain independently tested by their own vectors.
 */
import { describe, expect, it } from 'vitest';
import { NAMED_NEGATIVE_CONTROLS } from './fixtures/namedNegativeControls';
import {
  EventRoleId,
  INITIAL_BROAD_DOMAIN_VALIDATORS,
  INITIAL_EVENT_ROLE_DEFINITIONS,
  compileEventBindings,
  finiteMax,
  projectEventRoleEvidence,
  unboundedMax,
  type EventBindingRequest,
  type EventTypeBindingSchema,
} from '../semanticBinding/eventBindings';
import {
  applyPerceptualTrackTransition,
  assertUniqueTrackTransitions,
  emptyPerceptualContinuantFileState,
} from '../semanticBinding/perceptualContinuantFiles';
import { compilePerceivedBindings } from '../semanticBinding/perceptualEventFiles';
import {
  INITIAL_PERCEPTUAL_FACET_DEFINITIONS,
  PerceptualFacetId,
  PerceptualFeatureId,
  assertClassificationEmissionTarget,
  classifyContinuant,
  type PermittedPerceptualFeatureObservation,
} from '../semanticBinding/perceptualClassification';
import { evaluateContinuantRecognition } from '../semanticBinding/recognition';
import { CausalRoleId } from '../semanticBinding/evidenceProvenance';
import {
  CANONICAL_BINDING_REQUESTS,
  DARIUS,
  GLEN,
  MINA,
  MULTI_ROLE_AFFORDANCES,
  MULTI_ROLE_BINDING_REQUESTS,
  REFERENT,
  REPEATED_ROLE_AFFORDANCES,
  REPEATED_ROLE_BINDING_REQUESTS,
  SEM_A,
  SEM_C,
  SEM_D,
  SKIP_ROPE_SCHEMA,
  classificationModel,
  createRunAllocator,
  observerCatalog,
  observerSemanticView,
  projectAllObservers,
  projectObserver,
  recognitionModel,
  recognizeObserverContinuant,
  stringifyWithBigInts,
  truthBindings,
} from './fixtures/phenSem001';

/**
 * The exact failure code of a refused construction. Every seam raises its own contract error class
 * carrying a `code`; the ledger asserts that code rather than the class or the message, because the
 * code is what the contract names.
 */
const codeOf = (run: () => unknown): string => {
  try {
    run();
  } catch (error) {
    const code = (error as { readonly code?: unknown }).code;
    if (typeof code === 'string') return code;
    throw error;
  }
  throw new Error('expected a contract failure, but the construction was admitted');
};

/**
 * Registers a named control and declares its test. Registration happens at collection time, so the
 * completeness check below sees the whole ledger regardless of execution order.
 */
const DISCHARGED: string[] = [];
const control = (name: string, body: () => void): void => {
  DISCHARGED.push(name);
  it(`${name} fails closure`, body);
};

/** A second usable entity, so an Instrument cardinality control is not deflected by domain. */
const SECOND_INSTRUMENT = Object.freeze({
  semanticReferentId: 'object.cup',
  domainTags: Object.freeze(['entity', 'usable-entity']),
});

const observerId = MINA;
const track = { observerId, observerTrackSequence: 0n };
const eventFile = { observerId, observerEventSequence: 0n };
const detection = { observerId, detectionOccurrenceId: 700n };

const perceivedBinding = (overrides: Record<string, unknown> = {}) => ({
  observerId,
  perceptualEventReferentId: eventFile,
  perceptualReferentId: track,
  eventRoleEvidence: { kind: 'exact' as const, eventRoleId: EventRoleId.Actor },
  supportingObservationIds: [{ observerId, observationId: 900n }],
  occurredAt: 10n,
  transformationVersion: SEM_C,
  ...overrides,
});

const feature = (
  perceptualFeatureId: PerceptualFeatureId,
  ordinal: bigint,
  overrides: Record<string, unknown> = {},
): PermittedPerceptualFeatureObservation => ({
  featureObservationId: ordinal,
  observerId,
  currentDetectionId: detection,
  perceptualReferentId: track,
  perceptualFeatureId,
  booleanValue: true,
  observationChannelId: 'observation-channel/controlled-visual',
  supportingObservationIds: [{ observerId, observationId: 5000n + ordinal }],
  occurredAt: 20n,
  transformationVersion: SEM_D,
  ...overrides,
} as PermittedPerceptualFeatureObservation);

const classificationRequest = (features: readonly PermittedPerceptualFeatureObservation[]) => ({
  experienceId: 1n,
  observerId,
  perceptualReferentId: track,
  currentDetectionId: detection,
  featureObservations: features,
  occurredAt: 20n,
  transformationVersion: SEM_D,
});

// ---------------------------------------------------------------------------
// Truth leakage into character evidence
// ---------------------------------------------------------------------------

describe('SEM-001 negative controls — truth leakage', () => {
  control('TruthIdentityCopy', () => {
    // Closure failure. A truth referent identity carried on an observer-side record is refused at
    // the perceived-binding boundary, before any allocation or emission.
    expect(codeOf(() => compilePerceivedBindings([perceivedBinding({
      semanticReferentId: REFERENT.mina.semanticReferentId,
    })], 100n))).toBe('FORBIDDEN_TRUTH_FIELD');

    // The same field is refused one seam earlier, on the continuant-file transition that would
    // otherwise be the first place a truth identity could enter an observer's own history.
    expect(codeOf(() => applyPerceptualTrackTransition(emptyPerceptualContinuantFileState(), {
      observerId,
      currentDetectionId: detection,
      continuityKind: 'NewTrack',
      supportingObservationIds: [{ observerId, observationId: 1n }],
      occurredAt: 10n,
      transformationVersion: SEM_A,
      semanticReferentId: REFERENT.mina.semanticReferentId,
    } as never))).toBe('FORBIDDEN_TRUTH_FIELD');
  });

  control('OpaqueButLinkableTruthHandle', () => {
    // Closure failure. The handle is opaque — it copies no truth identity — but it is a stable
    // link back to the truth side, and the field name is what gives it away. The provenance seam
    // separates "unknown field" from "linkage field" so this cannot be mistaken for a typo.
    expect(codeOf(() => compilePerceivedBindings([perceivedBinding({
      truthTraceHandle: 4711n,
    })], 100n))).toBe('FORBIDDEN_TRUTH_FIELD');
  });

  control('SlotWideVisibility', () => {
    // Structural absence. An observer receives one projected role evidence value per affordance,
    // and no affordance widens to the rest of the event: Darius is permitted Actor and Location,
    // so no Companion or Instrument evidence exists for him to read at all.
    const darius = projectAllObservers().get(DARIUS)!;
    const roles = darius.perceivedBindings.map((binding) =>
      binding.eventRoleEvidence.kind === 'exact' ? binding.eventRoleEvidence.eventRoleId : 'unresolved');
    expect([...roles].sort()).toEqual([EventRoleId.Actor, EventRoleId.Location].sort());
    expect(roles).not.toContain(EventRoleId.Companion);
    expect(roles).not.toContain(EventRoleId.Instrument);

    // The truth event genuinely contains both of the roles he cannot see, so the absence is a
    // projection result rather than an impoverished fixture.
    const truthRoles = truthBindings().map((binding) => binding.eventRoleId);
    expect(truthRoles).toContain(EventRoleId.Companion);
    expect(truthRoles).toContain(EventRoleId.Instrument);
  });

  control('VisibleBindingRevealsTruthRole', () => {
    // Structural absence. Coarsening and non-resolution are projections, not annotations: the
    // evidence value carries the observed role and has no field in which the truth role could ride
    // along. Glen sees the Actor coarsened and the Instrument unresolved.
    const truth = truthBindings();
    const actor = truth.find((binding) => binding.eventRoleId === EventRoleId.Actor)!;

    const coarsened = projectEventRoleEvidence(actor, track, { kind: 'coarsen-to-participant' })!;
    expect(coarsened.eventRoleEvidence).toEqual({ kind: 'exact', eventRoleId: EventRoleId.Participant });
    expect(Object.keys(coarsened.eventRoleEvidence).sort()).toEqual(['eventRoleId', 'kind']);

    const unresolved = projectEventRoleEvidence(actor, track, { kind: 'unresolved' })!;
    expect(Object.keys(unresolved.eventRoleEvidence)).toEqual(['kind']);
    expect(stringifyWithBigInts(unresolved)).not.toContain(EventRoleId.Actor);
    expect(stringifyWithBigInts(unresolved)).not.toContain(actor.semanticReferent.semanticReferentId);

    // Omission is the fourth projection and yields no record at all rather than an empty one.
    expect(projectEventRoleEvidence(actor, track, { kind: 'omit' })).toBeUndefined();
  });

  control('TruthCorrectedTracking', () => {
    // Closure failure. Track continuity is decided from observer-side detections alone. A request
    // that names the truth entity it "really" is — the only way truth could correct a track — is
    // refused as a forbidden truth field, not silently ignored.
    expect(codeOf(() => applyPerceptualTrackTransition(emptyPerceptualContinuantFileState(), {
      observerId,
      currentDetectionId: detection,
      continuityKind: 'ContinuesPriorTrack',
      supportingObservationIds: [{ observerId, observationId: 1n }],
      occurredAt: 10n,
      transformationVersion: SEM_A,
      worldEventId: 88n,
    } as never))).toBe('FORBIDDEN_TRUTH_FIELD');

    // Structural absence of the repair path itself: continuity is exactly binary, and the only
    // non-`NewTrack` value must name a still-active prior file of this observer's own.
    expect(codeOf(() => applyPerceptualTrackTransition(emptyPerceptualContinuantFileState(), {
      observerId,
      currentDetectionId: detection,
      continuityKind: 'MergeWithTruthEntity' as never,
      supportingObservationIds: [{ observerId, observationId: 1n }],
      occurredAt: 10n,
      transformationVersion: SEM_A,
    }))).toBe('INVALID_TRACK_TRANSITION');
  });

  control('TruthFacetCopy', () => {
    // Closure failure. A truth-side kind cannot enter classification as a feature: the feature
    // vocabulary is closed over registered perceptual features, so a world fact has no admitted
    // carrier even when it is spelled to look like one.
    expect(codeOf(() => classifyContinuant(
      classificationModel(),
      classificationRequest([feature('world-kind/person' as PerceptualFeatureId, 1n)]),
      0n,
    ))).toBe('UNKNOWN_FEATURE');

    // And the truth referent itself cannot ride on a feature observation.
    expect(codeOf(() => classifyContinuant(
      classificationModel(),
      classificationRequest([feature(PerceptualFeatureId.ObservedPersonForm, 1n, {
        semanticReferentId: REFERENT.mina.semanticReferentId,
      })]),
      0n,
    ))).toBe('FORBIDDEN_TRUTH_FIELD');
  });
});

// ---------------------------------------------------------------------------
// Binding identity and role structure
// ---------------------------------------------------------------------------

describe('SEM-001 negative controls — binding identity', () => {
  control('ReferentKeyedBinding', () => {
    // Structural absence. One continuant occupying two roles yields two binding occurrences; a
    // referent-keyed store would hold one. The fixture drives the perceived side, where the
    // temptation to key by "the same thing" is strongest.
    const projection = projectObserver({
      observerId: MINA,
      truth: truthBindings(MULTI_ROLE_BINDING_REQUESTS),
      allocator: createRunAllocator(),
      experienceId: 1n,
      affordances: MULTI_ROLE_AFFORDANCES,
    });
    const shared = projection.tracksByLabel.get('shared/person')!;
    const onShared = projection.perceivedBindings.filter((binding) =>
      binding.perceptualReferentId.observerTrackSequence === shared.observerTrackSequence);
    expect(onShared).toHaveLength(2);
    expect(new Set(onShared.map((binding) => binding.perceivedBindingId)).size).toBe(2);

    // Closure failure on the other side of the same rule: two bindings that really are the same
    // occurrence — one continuant, one role — are a duplicate rather than two.
    expect(codeOf(() => compilePerceivedBindings(
      [perceivedBinding(), perceivedBinding({ supportingObservationIds: [{ observerId, observationId: 901n }] })],
      100n,
    ))).toBe('INVALID_PERCEIVED_BINDING');
  });

  control('RoleKeyedBinding', () => {
    // Structural absence. Two distinct continuants in one repeatable role remain two occurrences;
    // a role-keyed store would overwrite the first with the second.
    const projection = projectObserver({
      observerId: MINA,
      truth: truthBindings(REPEATED_ROLE_BINDING_REQUESTS),
      allocator: createRunAllocator(),
      experienceId: 1n,
      affordances: REPEATED_ROLE_AFFORDANCES,
    });
    const companions = projection.perceivedBindings.filter((binding) =>
      binding.eventRoleEvidence.kind === 'exact'
      && binding.eventRoleEvidence.eventRoleId === EventRoleId.Companion);
    expect(companions).toHaveLength(2);
    expect(new Set(companions.map((binding) =>
      binding.perceptualReferentId.observerTrackSequence)).size).toBe(2);
  });

  control('DuplicateOpaqueOccurrence', () => {
    // Closure failure. An allocated occurrence identity keys exactly one transition. The state
    // transition itself is stateless about detection history — it holds active files and sequence
    // allocators, not detections — so the invariant is owned by the history assertion, and that is
    // where first divergence is reported.
    const transition = (detectionOccurrenceId: bigint, observationId: bigint) =>
      applyPerceptualTrackTransition(emptyPerceptualContinuantFileState(), {
        observerId,
        currentDetectionId: { observerId, detectionOccurrenceId },
        continuityKind: 'NewTrack',
        supportingObservationIds: [{ observerId, observationId }],
        occurredAt: 10n,
        transformationVersion: SEM_A,
      }).transition;

    expect(() => assertUniqueTrackTransitions([transition(700n, 1n), transition(701n, 2n)])).not.toThrow();
    expect(codeOf(() => assertUniqueTrackTransitions([transition(700n, 1n), transition(700n, 2n)])))
      .toBe('DUPLICATE_DETECTION_TRANSITION');

    // Truth-side occurrences are equally single-use: one `(role, referent)` pair binds once.
    expect(codeOf(() => compileEventBindings(SKIP_ROPE_SCHEMA, [
      ...CANONICAL_BINDING_REQUESTS,
      { eventRoleId: EventRoleId.Companion, semanticReferent: REFERENT.glen },
    ], 1000n))).toBe('DUPLICATE_BINDING_PAIR');
  });

  control('FreeformBindingQualifier', () => {
    // Closure failure. Version 0.1 admits no qualifier field on a truth binding: the binding is a
    // role and a referent, and anything else is refused before allocation.
    expect(codeOf(() => compileEventBindings(SKIP_ROPE_SCHEMA, [
      ...CANONICAL_BINDING_REQUESTS.filter((request) => request.eventRoleId !== EventRoleId.Instrument),
      {
        eventRoleId: EventRoleId.Instrument,
        semanticReferent: REFERENT.leadPipe,
        qualifier: 'reluctantly',
      } as EventBindingRequest,
    ], 1000n))).toBe('FORBIDDEN_BINDING_FIELD');
  });

  control('GlobalRoleCardinality', () => {
    // Closure failure. Cardinality is a property of the event type, not of the global role. The
    // skip-rope schema permits at most one Instrument, and a second is refused by cardinality —
    // even though the global `Instrument` role is repeatable elsewhere.
    expect(codeOf(() => compileEventBindings(SKIP_ROPE_SCHEMA, [
      ...CANONICAL_BINDING_REQUESTS,
      { eventRoleId: EventRoleId.Instrument, semanticReferent: SECOND_INSTRUMENT },
    ], 1000n))).toBe('ROLE_CARDINALITY_VIOLATION');

    // First divergence is deliberate: a second Instrument that is not a usable entity diverges
    // earlier, on the role's broad domain, and reports that instead.
    expect(codeOf(() => compileEventBindings(SKIP_ROPE_SCHEMA, [
      ...CANONICAL_BINDING_REQUESTS,
      { eventRoleId: EventRoleId.Instrument, semanticReferent: REFERENT.glen },
    ], 1000n))).toBe('REFERENT_DOMAIN_VIOLATION');

    // The same global role is unbounded under a different event type, so the refusal above is the
    // event type's narrowing rather than a global ceiling.
    const repeatable: EventTypeBindingSchema = {
      eventTypeId: 'event-type/negative-control-repeatable-instrument',
      roleCardinalityRules: [
        { eventRoleId: EventRoleId.Action, minOccurrences: 1, maxOccurrences: finiteMax(1) },
        { eventRoleId: EventRoleId.Actor, minOccurrences: 1, maxOccurrences: finiteMax(1) },
        { eventRoleId: EventRoleId.Instrument, minOccurrences: 0, maxOccurrences: unboundedMax() },
        { eventRoleId: EventRoleId.Location, minOccurrences: 1, maxOccurrences: finiteMax(1) },
      ],
      bindingSchemaVersion: 'binding-schema/negative-control-1',
    };
    const compiled = compileEventBindings(repeatable, [
      { eventRoleId: EventRoleId.Action, semanticReferent: REFERENT.skipRope },
      { eventRoleId: EventRoleId.Actor, semanticReferent: REFERENT.mina },
      { eventRoleId: EventRoleId.Instrument, semanticReferent: REFERENT.leadPipe },
      { eventRoleId: EventRoleId.Instrument, semanticReferent: SECOND_INSTRUMENT },
      { eventRoleId: EventRoleId.Location, semanticReferent: REFERENT.library },
    ], 1000n);
    expect(compiled.bindings.filter((binding) => binding.eventRoleId === EventRoleId.Instrument))
      .toHaveLength(2);
  });

  control('RoleOrdinalPriority', () => {
    // Structural absence. The role registry is a set of definitions with no ordinal, rank, weight,
    // or priority field, so registry position cannot become salience. Its canonical order exists
    // only to make encoding deterministic.
    for (const definition of INITIAL_EVENT_ROLE_DEFINITIONS) {
      const keys = Object.keys(definition);
      for (const forbidden of ['ordinal', 'rank', 'priority', 'weight', 'salience', 'index', 'order']) {
        expect(keys).not.toContain(forbidden);
      }
    }

    // And the registry contains no generic `Context` role that could act as an unranked catch-all.
    expect(INITIAL_EVENT_ROLE_DEFINITIONS.map((definition) => definition.eventRoleId))
      .not.toContain('event-role/context');
  });

  control('EventRoleEqualsCausalRole', () => {
    // Structural absence. The two vocabularies are disjoint as value sets, so no value of one is a
    // value of the other even where the two share a human name.
    const eventRoles = new Set<string>(Object.values(EventRoleId));
    const causalRoles = new Set<string>(Object.values(CausalRoleId));
    expect([...causalRoles].filter((value) => eventRoles.has(value))).toEqual([]);
    expect(EventRoleId.Actor).not.toBe(CausalRoleId.Actor);

    // Closure failure when one is substituted for the other: a causal role in the event-role
    // position is an unknown role rather than a coincidental match.
    expect(codeOf(() => compileEventBindings(SKIP_ROPE_SCHEMA, [
      ...CANONICAL_BINDING_REQUESTS.filter((request) => request.eventRoleId !== EventRoleId.Actor),
      { eventRoleId: CausalRoleId.Actor as never, semanticReferent: REFERENT.mina },
    ], 1000n))).toBe('UNKNOWN_EVENT_ROLE');
  });
});

// ---------------------------------------------------------------------------
// Classification closure
// ---------------------------------------------------------------------------

describe('SEM-001 negative controls — classification', () => {
  control('FreeformTagBag', () => {
    // Closure failure. A freeform tag in the feature position is not a registered feature, and the
    // model has no bag to put it in.
    expect(codeOf(() => classifyContinuant(
      classificationModel(),
      classificationRequest([feature('perceptual-feature/looks-friendly' as PerceptualFeatureId, 1n)]),
      0n,
    ))).toBe('UNKNOWN_FEATURE');
  });

  control('ClassificationToPressure', () => {
    // Closure failure at the receiving seam. Classification emits into experience assembly and
    // nowhere else; the named shortcut is refused by the same rule as every other psychological
    // target.
    expect(codeOf(() => assertClassificationEmissionTarget('pressure')))
      .toBe('FORBIDDEN_EMISSION_TARGET');
    expect(() => assertClassificationEmissionTarget('semantic-experience-assembly')).not.toThrow();
  });

  control('SharedTruthPerceptualFacetId', () => {
    // Structural absence. Every registered facet is namespaced as a perceptual facet, so a world
    // facet id cannot be one of them however its label reads...
    for (const definition of INITIAL_PERCEPTUAL_FACET_DEFINITIONS) {
      expect(definition.perceptualFacetId.startsWith('perceptual-facet/')).toBe(true);
    }

    // ...and a facet spelled into the world namespace is refused rather than matched by label.
    const model = classificationModel();
    expect(codeOf(() => classifyContinuant(
      {
        ...model,
        facetDefinitions: [...model.facetDefinitions, {
          perceptualFacetId: 'world-facet/appears-person-like' as PerceptualFacetId,
          perceivedValueType: 'boolean',
          observationDomainValidatorId: 'validator/boolean',
          definitionVersion: 'facet/0.1-candidate',
        }],
      },
      classificationRequest([feature(PerceptualFeatureId.ObservedPersonForm, 1n)]),
      0n,
    ))).toBe('UNKNOWN_FACET');
  });

  control('WrongTypedFacetValue', () => {
    // Closure failure. Every registered facet declares `boolean` exactly, and a non-boolean value
    // is refused before emission.
    expect(new Set(INITIAL_PERCEPTUAL_FACET_DEFINITIONS.map((d) => d.perceivedValueType)))
      .toEqual(new Set(['boolean']));
    expect(codeOf(() => classifyContinuant(
      classificationModel(),
      classificationRequest([feature(PerceptualFeatureId.ObservedPersonForm, 1n, { booleanValue: 1 })]),
      0n,
    ))).toBe('INVALID_FEATURE_OBSERVATION');
  });

  control('CategoryStringValue', () => {
    // Closure failure. A category label in the value position is the specific wrong-typing the
    // contract calls out: it reads as meaningful and is refused all the same.
    expect(codeOf(() => classifyContinuant(
      classificationModel(),
      classificationRequest([feature(PerceptualFeatureId.ObservedPersonForm, 1n, { booleanValue: 'person' })]),
      0n,
    ))).toBe('INVALID_FEATURE_OBSERVATION');
  });

  control('UnknownSentinel', () => {
    // Closure failure. There is no third value: `'unknown'` is refused exactly as any other
    // non-boolean is, so uncertainty cannot be smuggled in as a value.
    expect(codeOf(() => classifyContinuant(
      classificationModel(),
      classificationRequest([feature(PerceptualFeatureId.ObservedPersonForm, 1n, { booleanValue: 'unknown' })]),
      0n,
    ))).toBe('INVALID_FEATURE_OBSERVATION');
    expect(codeOf(() => classifyContinuant(
      classificationModel(),
      classificationRequest([feature(PerceptualFeatureId.ObservedPersonForm, 1n, { booleanValue: null })]),
      0n,
    ))).toBe('INVALID_FEATURE_OBSERVATION');
  });

  control('MissingAsFalse', () => {
    // Structural absence. Absence emits no record; explicit negative evidence emits a record whose
    // value is `false`. The two are different shapes, so a reader cannot conflate them.
    const model = classificationModel();
    const missing = classifyContinuant(
      model, classificationRequest([feature(PerceptualFeatureId.ObservedPersonForm, 1n)]), 0n);
    expect(missing.classifications.filter((value) =>
      value.perceptualFacetId === PerceptualFacetId.AppearsMetallic)).toEqual([]);

    const explicit = classifyContinuant(
      model,
      classificationRequest([feature(PerceptualFeatureId.ObservedMetallicSurface, 1n, { booleanValue: false })]),
      0n,
    );
    expect(explicit.classifications).toHaveLength(1);
    expect(explicit.classifications[0].typedPerceivedValue).toBe(false);

    // And a `false` assertion requires explicit negative feature evidence: detector silence cannot
    // manufacture one.
    expect(codeOf(() => classifyContinuant(
      { ...model, derivations: model.derivations.map((derivation) => ({
        ...derivation,
        // Assert false only where the rule actually received evidence, so the control reaches the
        // negative-evidence rule rather than diverging earlier on an assertion with no support.
        derive: (inputs: readonly PermittedPerceptualFeatureObservation[]) => inputs.length === 0
          ? Object.freeze({ kind: 'no-assertion' as const })
          : Object.freeze({ kind: 'assert' as const, booleanValue: false }),
      })) },
      classificationRequest([feature(PerceptualFeatureId.ObservedMetallicSurface, 1n)]),
      0n,
    ))).toBe('NEGATIVE_EVIDENCE_REQUIRED');
  });

  control('ExclusivePrimaryKind', () => {
    // Structural absence. Appearance facets are independent assertions, not alternatives of one
    // exclusive kind field: one continuant carries person-like, object-like, and interior-space-like
    // evidence at once without any of them displacing the others.
    const result = classifyContinuant(classificationModel(), classificationRequest([
      feature(PerceptualFeatureId.ObservedPersonForm, 1n),
      feature(PerceptualFeatureId.ObservedDiscreteObjectForm, 2n),
      feature(PerceptualFeatureId.ObservedEnclosureForm, 3n),
    ]), 0n);
    expect(result.classifications.map((value) => value.perceptualFacetId).sort()).toEqual([
      PerceptualFacetId.AppearsDiscreteObjectLike,
      PerceptualFacetId.AppearsInteriorSpaceLike,
      PerceptualFacetId.AppearsPersonLike,
    ].sort());

    // No emitted record carries a primary/kind discriminator that a reader could treat as exclusive.
    for (const classification of result.classifications) {
      const keys = Object.keys(classification);
      for (const forbidden of ['primaryKind', 'kind', 'category', 'exclusive', 'type']) {
        expect(keys).not.toContain(forbidden);
      }
    }
  });

  control('DuplicateFacetAssertion', () => {
    // Closure failure. One facet is asserted at most once per continuant per request; two feature
    // observations of the same feature are refused before any rule runs.
    expect(codeOf(() => classifyContinuant(
      classificationModel(),
      classificationRequest([
        feature(PerceptualFeatureId.ObservedPersonForm, 1n),
        feature(PerceptualFeatureId.ObservedPersonForm, 2n),
      ]),
      0n,
    ))).toBe('INVALID_FEATURE_OBSERVATION');
  });

  control('LLMClassifier', () => {
    // Structural absence. Every rule names a registered derivation function; an unregistered one —
    // which is the only place a prose or model-driven classifier could attach — is refused.
    const model = classificationModel();
    expect(codeOf(() => classifyContinuant(
      { ...model, rules: model.rules.map((rule) => ({ ...rule, derivationFunctionId: 'derivation/ask-a-model' })) },
      classificationRequest([feature(PerceptualFeatureId.ObservedPersonForm, 1n)]),
      0n,
    ))).toBe('UNKNOWN_DERIVATION');

    // A registered derivation is still bound to the declared value type, so a rule cannot return a
    // free-form answer even from an admitted function.
    expect(codeOf(() => classifyContinuant(
      { ...model, derivations: model.derivations.map((derivation) => ({
        ...derivation, derive: () => ({ kind: 'assert' as const, booleanValue: 'probably' as never }),
      })) },
      classificationRequest([feature(PerceptualFeatureId.ObservedPersonForm, 1n)]),
      0n,
    ))).toBe('INVALID_RULE_RESULT');
  });

  control('AuthoritativeProse', () => {
    // Structural absence. No emitted character record carries a prose field, and none can be added:
    // the emitted key set is exact, so a description, label, or note has nowhere to live.
    const projections = projectAllObservers();
    for (const observerKey of [MINA, DARIUS, GLEN] as const) {
      const projection = projections.get(observerKey)!;
      for (const record of [...projection.perceivedBindings, ...projection.classifications]) {
        const keys = Object.keys(record);
        for (const forbidden of ['text', 'prose', 'description', 'label', 'note', 'summary', 'narrative']) {
          expect(keys).not.toContain(forbidden);
        }
      }
    }

    // And an attempt to attach one is refused rather than carried along.
    expect(codeOf(() => compilePerceivedBindings([perceivedBinding({
      description: 'she swung the pipe',
    })], 100n))).toBe('INVALID_PERCEIVED_BINDING');
  });
});

// ---------------------------------------------------------------------------
// Recognition and identity
// ---------------------------------------------------------------------------

describe('SEM-001 negative controls — recognition', () => {
  control('RecognitionRewrite', () => {
    // Structural absence. Correction appends a revision that names its predecessor; the predecessor
    // is unchanged, and both remain in the log.
    const allocator = createRunAllocator();
    const projection = projectObserver({
      observerId: GLEN, truth: truthBindings(), allocator, experienceId: 1n,
    });
    const actorTrack = projection.tracksByLabel.get('glen/actor')!;
    const catalog = [
      { candidateSemanticReferentId: 'person.mina', recognitionTemplateId: 'template/mina' },
      { candidateSemanticReferentId: 'person.darius', recognitionTemplateId: 'template/darius' },
    ];
    const first = recognizeObserverContinuant({
      projection, perceptualReferentId: actorTrack, catalog,
      assertCandidate: catalog[1], nextRuntimeId: allocator.next(),
    })!;
    const before = stringifyWithBigInts(first);
    expect(Object.isFrozen(first)).toBe(true);

    // Closure failure on the rewrite itself. A rewrite is a correction that displaces the original
    // rather than succeeding it, so it necessarily points backwards in time — and that is exactly
    // what the history refuses.
    const historyWith = (records: readonly typeof first[]) => () => evaluateContinuantRecognition(
      recognitionModel(),
      {
        experience: projection.experience,
        perceptualReferentId: actorTrack,
        candidateCatalog: observerCatalog(GLEN, catalog),
        identitySymbolMappings: [],
        cueEvidence: [],
        priorResolutionHistory: records,
        recognitionVersion: 'phen-sem-001/recognition-1',
      },
      9000n,
    );
    const backdatedRewrite = {
      ...first,
      recognitionResolutionId: first.recognitionResolutionId + 1n,
      revisesRecognitionResolutionId: first.recognitionResolutionId,
      occurredAt: first.occurredAt - 1n,
      resolution: { kind: 'asserted-candidate' as const, candidateSemanticReferentId: 'person.mina' },
    };
    expect(codeOf(historyWith([first, backdatedRewrite]))).toBe('INVALID_RESOLUTION_HISTORY');

    // Nor can two revisions of one resolution coexist: a rewrite cannot be laundered as a branch
    // where the reader picks whichever version it prefers. Two independent clauses of the history
    // rule refuse this shape — the no-branching clause and the one-current-resolution clause — and
    // both report the same code, so this asserts that the shape is refused rather than which
    // clause owns it.
    const secondRevision = {
      ...backdatedRewrite,
      recognitionResolutionId: first.recognitionResolutionId + 2n,
      occurredAt: first.occurredAt + 5n,
    };
    expect(codeOf(historyWith([
      first,
      { ...backdatedRewrite, occurredAt: first.occurredAt + 1n },
      secondRevision,
    ]))).toBe('INVALID_RESOLUTION_HISTORY');

    // A properly appended succeeding revision is admitted, so the two refusals above are the
    // rewrite shape rather than a blanket refusal of correction.
    expect(historyWith([
      first,
      { ...backdatedRewrite, occurredAt: first.occurredAt + 1n },
    ])).not.toThrow();

    expect(stringifyWithBigInts(first)).toBe(before);
  });

  control('RecognitionFromClassificationIdentity', () => {
    // Structural absence. A classification may be cited as supporting evidence for a recognition
    // cue, but identity comes from the observer's own catalog and cue source. A cue naming a
    // candidate the observer does not hold is refused: no facet can conjure a candidate.
    const allocator = createRunAllocator();
    const projection = projectObserver({
      observerId: GLEN, truth: truthBindings(), allocator, experienceId: 1n,
    });
    const actorTrack = projection.tracksByLabel.get('glen/actor')!;
    const catalog = [{ candidateSemanticReferentId: 'person.mina', recognitionTemplateId: 'template/mina' }];
    const supporting = projection.perceivedBindings.find((binding) =>
      binding.perceptualReferentId.observerTrackSequence === actorTrack.observerTrackSequence)!;

    const cue = (candidateSemanticReferentId: string, recognitionTemplateId: string) => ({
      recognitionCueEvidenceId: 8000n,
      experienceId: projection.experience.experienceId,
      observerId: GLEN,
      perceptualReferentId: actorTrack,
      candidateSemanticReferentId,
      recognitionCueSource: { kind: 'retained-template-match' as const, recognitionTemplateId },
      cuePolarity: 'SupportsCandidate' as const,
      supportingExperienceEvidenceRefs: [
        { kind: 'perceived-binding' as const, perceivedBindingId: supporting.perceivedBindingId },
      ],
      occurredAt: projection.experience.occurredAt,
      transformationVersion: 'phen-sem-001/recognition-1',
    });

    const request = (candidate: string, template: string) => ({
      experience: projection.experience,
      perceptualReferentId: actorTrack,
      candidateCatalog: observerCatalog(GLEN, catalog),
      identitySymbolMappings: [],
      cueEvidence: [cue(candidate, template)],
      priorResolutionHistory: [],
      recognitionVersion: 'phen-sem-001/recognition-1',
    });

    // A facet-derived "identity" is not in the catalog at all.
    expect(codeOf(() => evaluateContinuantRecognition(
      recognitionModel(), request(PerceptualFacetId.AppearsPersonLike, 'template/mina'), 9000n,
    ))).toBe('INVALID_CATALOG');

    // And a catalog candidate still requires a template that catalog entry actually owns, so a cue
    // cannot borrow identity from something the observer never retained.
    expect(codeOf(() => evaluateContinuantRecognition(
      recognitionModel(), request('person.mina', 'template/derived-from-appears-person-like'), 9000n,
    ))).toBe('INVALID_CUE');
  });
});

// ---------------------------------------------------------------------------
// Opaque ordinals carry no meaning
// ---------------------------------------------------------------------------

describe('SEM-001 negative controls — ordinal opacity', () => {
  control('GlobalTrackAllocator', () => {
    // Structural absence. The discriminating case is two observers sharing one continuant-file
    // state: a global allocator would interleave their sequences, so each observer's second track
    // would land on 2 or 3 rather than on their own 1.
    let state = emptyPerceptualContinuantFileState();
    const allocate = (who: string, detectionOccurrenceId: bigint) => {
      const result = applyPerceptualTrackTransition(state, {
        observerId: who,
        currentDetectionId: { observerId: who, detectionOccurrenceId },
        continuityKind: 'NewTrack',
        supportingObservationIds: [{ observerId: who, observationId: detectionOccurrenceId }],
        occurredAt: 10n,
        transformationVersion: SEM_A,
      });
      state = result.state;
      return result.transition.perceptualReferentId.observerTrackSequence;
    };

    // Interleaved deliberately, so a shared counter would be visible immediately.
    expect(allocate(MINA, 1n)).toBe(0n);
    expect(allocate(GLEN, 2n)).toBe(0n);
    expect(allocate(MINA, 3n)).toBe(1n);
    expect(allocate(DARIUS, 4n)).toBe(0n);
    expect(allocate(GLEN, 5n)).toBe(1n);
    expect(allocate(MINA, 6n)).toBe(2n);

    // The counters are recorded per observer in the state itself, not derived from a global one.
    expect([...state.nextTrackSequenceByObserver.entries()].sort())
      .toEqual([[DARIUS, 1n], [GLEN, 2n], [MINA, 3n]].sort());
  });

  control('TrackOrdinalPsychology', () => {
    // Structural absence. Two runs of one observer at different allocator origins hold every raw
    // ordinal different and every semantic result equal.
    const base = projectObserver({
      observerId: MINA, truth: truthBindings(), allocator: createRunAllocator(5000n), experienceId: 1n,
    });
    const shifted = projectObserver({
      observerId: MINA, truth: truthBindings(), allocator: createRunAllocator(90000n), experienceId: 1n,
    });
    expect(shifted.perceivedBindings.map((binding) => binding.perceivedBindingId))
      .not.toEqual(base.perceivedBindings.map((binding) => binding.perceivedBindingId));
    expect(observerSemanticView(shifted)).toEqual(observerSemanticView(base));
  });

  control('BindingOrdinalPsychology', () => {
    // Structural absence. Perceived-binding ordinals differ between the two runs above while the
    // role/continuant/facet structure they carry is identical.
    const base = projectObserver({
      observerId: GLEN, truth: truthBindings(), allocator: createRunAllocator(5000n), experienceId: 1n,
    });
    const shifted = projectObserver({
      observerId: GLEN, truth: truthBindings(), allocator: createRunAllocator(90000n), experienceId: 1n,
    });
    const ordinals = (projection: typeof base) =>
      projection.perceivedBindings.map((binding) => binding.perceivedBindingId);
    expect(ordinals(shifted)).not.toEqual(ordinals(base));
    expect(observerSemanticView(shifted)).toEqual(observerSemanticView(base));

    // Nothing orders by the ordinal either: sorted-by-ordinal and canonical order agree, so no
    // consumer can infer importance from position.
    expect(ordinals(base)).toEqual([...ordinals(base)].sort((left, right) =>
      left < right ? -1 : left > right ? 1 : 0));
  });

  control('ClassificationOrdinalPsychology', () => {
    // Structural absence. Classification evidence ordinals shift with the allocator while the
    // facets asserted, and their canonical order, do not.
    const base = projectObserver({
      observerId: MINA, truth: truthBindings(), allocator: createRunAllocator(5000n), experienceId: 1n,
    });
    const shifted = projectObserver({
      observerId: MINA, truth: truthBindings(), allocator: createRunAllocator(90000n), experienceId: 1n,
    });
    const ids = (projection: typeof base) =>
      projection.classifications.map((value) => value.classificationEvidenceId);
    const facets = (projection: typeof base) => projection.classifications.map((value) =>
      `${value.perceptualFacetId}=${String(value.typedPerceivedValue)}`);
    expect(ids(shifted)).not.toEqual(ids(base));
    expect(facets(shifted)).toEqual(facets(base));

    // No emitted classification carries a rank, weight, or score the ordinal could feed.
    for (const classification of base.classifications) {
      const keys = Object.keys(classification);
      for (const forbidden of ['rank', 'weight', 'score', 'salience', 'priority', 'confidence']) {
        expect(keys).not.toContain(forbidden);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Causal-role derivation
// ---------------------------------------------------------------------------

describe('SEM-001 negative controls — causal derivation', () => {
  control('hidden-truth causal-role derivation', () => {
    // Structural absence. The whole basis of a causal-role derivation is this observer's own
    // admitted evidence: the derived record cites only observer-side references, and the truth
    // referents behind them appear nowhere in it.
    const projections = projectAllObservers();
    const darius = projections.get(DARIUS)!;
    const serialized = stringifyWithBigInts(darius.perceivedBindings);
    for (const referent of Object.values(REFERENT)) {
      expect(serialized).not.toContain(referent.semanticReferentId);
    }

    // Closure failure on the direct attempt: a truth linkage field on the evidence a derivation
    // would read is refused by its own named code.
    expect(codeOf(() => compilePerceivedBindings([perceivedBinding({
      truthEventBindingId: 1000n,
    })], 100n))).toBe('FORBIDDEN_TRUTH_FIELD');
  });
});

// ---------------------------------------------------------------------------
// Ledger completeness
// ---------------------------------------------------------------------------


describe('SEM-001 negative-control ledger completeness', () => {
  it('discharges every control the acceptance gate names', () => {
    expect(NAMED_NEGATIVE_CONTROLS).toHaveLength(31);
    // Exactly the named set: a control added to the contract without a test here fails, and so
    // does a test here that discharges something the contract does not name.
    expect([...DISCHARGED].sort()).toEqual([...NAMED_NEGATIVE_CONTROLS].sort());
    expect(new Set(DISCHARGED).size).toBe(DISCHARGED.length);
  });
});
