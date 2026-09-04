import { describe, expect, it } from 'vitest';
import { EventRoleId } from '../semanticBinding/eventBindings';
import { CausalRoleId } from '../semanticBinding/evidenceProvenance';
import {
  CANONICAL_BINDING_REQUESTS,
  DARIUS,
  GLEN,
  MINA,
  SWAPPED_BINDING_REQUESTS,
  createRunAllocator,
  deriveObserverCausalRoles,
  projectAllObservers,
  projectObserver,
  stringifyWithBigInts,
  truthBindings,
  type ObserverRoleAffordance,
} from './fixtures/phenSem001';

const dariusPreservesActor: readonly ObserverRoleAffordance[] = Object.freeze([
  { eventRoleId: EventRoleId.Actor, permitted: { kind: 'preserve' }, trackLabel: 'darius/actor' },
  { eventRoleId: EventRoleId.Location, permitted: { kind: 'preserve' }, trackLabel: 'darius/place' },
]);

const dariusCoarsensActor: readonly ObserverRoleAffordance[] = Object.freeze([
  { eventRoleId: EventRoleId.Actor, permitted: { kind: 'coarsen-to-participant' }, trackLabel: 'darius/actor' },
  { eventRoleId: EventRoleId.Location, permitted: { kind: 'preserve' }, trackLabel: 'darius/place' },
]);

const runDarius = (
  requests: typeof CANONICAL_BINDING_REQUESTS,
  affordances: readonly ObserverRoleAffordance[],
) => projectObserver({
  observerId: DARIUS,
  truth: truthBindings(requests),
  allocator: createRunAllocator(),
  experienceId: 1n,
  affordances,
});

describe('PHEN-SEM-001 causal roles and omniscient ancestry', () => {
  it('CV-SEM-008 keeps event-role and causal-role evidence independently present and typed', () => {
    const projection = runDarius(CANONICAL_BINDING_REQUESTS, dariusPreservesActor);
    const actorTrack = projection.tracksByLabel.get('darius/actor')!;

    const bindingsBefore = stringifyWithBigInts(projection.perceivedBindings);
    const causal = deriveObserverCausalRoles(projection, actorTrack, 9000n);

    // Deriving a causal role emits separate records and mutates nothing.
    expect(causal).toHaveLength(1);
    expect(stringifyWithBigInts(projection.perceivedBindings)).toBe(bindingsBefore);

    // Both are present and each carries its own typed vocabulary.
    const actorBinding = projection.perceivedBindings.find((binding) =>
      binding.perceptualReferentId.observerTrackSequence === actorTrack.observerTrackSequence)!;
    expect(actorBinding.eventRoleEvidence).toEqual({ kind: 'exact', eventRoleId: EventRoleId.Actor });
    expect(causal[0].causalRoleId).toBe(CausalRoleId.Actor);

    // The two vocabularies are not interchangeable: an EventRoleId is not a CausalRoleId value,
    // even where the two happen to share a name.
    expect(EventRoleId.Actor).not.toBe(CausalRoleId.Actor);
    expect(Object.values(CausalRoleId)).not.toContain(EventRoleId.Actor);

    // The causal record names its rule and its basis rather than restating the event role.
    expect(causal[0].causalRoleDerivationRuleId).toBe('causal-role-rule/exact-observed-event-role');
    expect(causal[0].supportingEvidenceRefs.map((ref) => ref.kind)).toEqual(['perceived-binding']);
  });

  it('CV-SEM-008 derives through the mapping rather than copying the event role', () => {
    // Actor maps to Actor, so that pairing cannot tell derivation from a copy. Companion maps to
    // Participant: the event role and the causal role genuinely differ, which is the only case
    // that discriminates. Mina perceives a Companion, so the vector runs against her projection.
    const projection = projectObserver({
      observerId: MINA,
      truth: truthBindings(CANONICAL_BINDING_REQUESTS),
      allocator: createRunAllocator(),
      experienceId: 1n,
    });
    const companionTrack = projection.tracksByLabel.get('mina/companion')!;

    const binding = projection.perceivedBindings.find((value) =>
      value.perceptualReferentId.observerTrackSequence === companionTrack.observerTrackSequence)!;
    expect(binding.eventRoleEvidence).toEqual({ kind: 'exact', eventRoleId: EventRoleId.Companion });

    const causal = deriveObserverCausalRoles(projection, companionTrack, 9000n);
    expect(causal).toHaveLength(1);
    // The causal role is Participant, not Companion: the rule mapped it, nothing copied it.
    expect(causal[0].causalRoleId).toBe(CausalRoleId.Participant);
    expect(String(causal[0].causalRoleId)).not.toBe(String(EventRoleId.Companion));

    // And the event-role evidence is unchanged by the derivation.
    expect(binding.eventRoleEvidence).toEqual({ kind: 'exact', eventRoleId: EventRoleId.Companion });

    // The Location mapping is likewise exercised, so more than one row of the table is live.
    const placeTrack = projection.tracksByLabel.get('mina/place')!;
    const placeCausal = deriveObserverCausalRoles(projection, placeTrack, 9100n);
    expect(placeCausal[0].causalRoleId).toBe(CausalRoleId.Location);
  });

  it('CV-SEM-009 responds to permitted observation changes, not hidden truth changes', () => {
    const actorTrackOf = (projection: ReturnType<typeof runDarius>) =>
      projection.tracksByLabel.get('darius/actor')!;

    // Hidden truth causal structure changes: Actor and Companion referents are exchanged. Darius's
    // permitted projection is unchanged — he still perceives whoever holds the Actor role.
    const canonical = runDarius(CANONICAL_BINDING_REQUESTS, dariusPreservesActor);
    const swapped = runDarius(SWAPPED_BINDING_REQUESTS, dariusPreservesActor);

    const canonicalCausal = deriveObserverCausalRoles(canonical, actorTrackOf(canonical), 9000n);
    const swappedCausal = deriveObserverCausalRoles(swapped, actorTrackOf(swapped), 9000n);

    // The hidden change is genuinely a change on the truth side...
    expect(truthBindings(CANONICAL_BINDING_REQUESTS).find((b) => b.eventRoleId === EventRoleId.Actor)!
      .semanticReferent.semanticReferentId)
      .not.toBe(truthBindings(SWAPPED_BINDING_REQUESTS).find((b) => b.eventRoleId === EventRoleId.Actor)!
        .semanticReferent.semanticReferentId);
    // ...and the character's causal-role evidence is byte-identical across it.
    expect(stringifyWithBigInts(swappedCausal)).toBe(stringifyWithBigInts(canonicalCausal));

    // Changing what Darius is permitted to observe does change his causal-role evidence.
    const coarsened = runDarius(CANONICAL_BINDING_REQUESTS, dariusCoarsensActor);
    const coarsenedCausal = deriveObserverCausalRoles(coarsened, actorTrackOf(coarsened), 9000n);
    expect(coarsenedCausal[0].causalRoleId).toBe(CausalRoleId.Participant);
    expect(coarsenedCausal[0].causalRoleId).not.toBe(canonicalCausal[0].causalRoleId);
  });

  it('CV-SEM-009 derives causal roles only from admitted observer-side evidence', () => {
    const projection = runDarius(CANONICAL_BINDING_REQUESTS, dariusPreservesActor);
    const actorTrack = projection.tracksByLabel.get('darius/actor')!;
    const causal = deriveObserverCausalRoles(projection, actorTrack, 9000n);

    // The supporting reference is the observer's own perceived binding, not a truth handle.
    const supportedIds = causal[0].supportingEvidenceRefs
      .flatMap((ref) => ref.kind === 'perceived-binding' ? [ref.perceivedBindingId] : []);
    const ownBindingIds = projection.perceivedBindings.map((binding) => binding.perceivedBindingId);
    expect(supportedIds.every((id) => ownBindingIds.includes(id))).toBe(true);

    // The causal record belongs to this observer, this experience, and this event-file.
    expect(causal[0].observerId).toBe(DARIUS);
    expect(causal[0].experienceId).toBe(projection.experience.experienceId);
    expect(causal[0].perceptualEventReferentId).toEqual(projection.eventFile);
  });

  it('CV-SEM-010 records complete omniscient ancestry the character cannot traverse', () => {
    const projections = projectAllObservers();

    for (const observerId of [MINA, DARIUS, GLEN] as const) {
      const projection = projections.get(observerId)!;

      // Every perceived binding has exactly one omniscient ancestry edge, and that edge names the
      // truth binding it actually descends from — not merely some truth binding.
      expect(projection.omniscientAncestry).toHaveLength(projection.perceivedBindings.length);
      const truth = truthBindings(CANONICAL_BINDING_REQUESTS);

      for (const binding of projection.perceivedBindings) {
        const edges = projection.omniscientAncestry.filter(
          (edge) => edge.perceivedBindingId === binding.perceivedBindingId);
        expect(edges).toHaveLength(1);
        const edge = edges[0];
        expect(edge.observationIds.length).toBeGreaterThan(0);

        // The named truth binding exists, and its role and referent are the ones recorded.
        const ancestor = truth.find((candidate) => candidate.eventBindingId === edge.truthEventBindingId);
        expect(ancestor).toBeDefined();
        expect(ancestor!.eventRoleId).toBe(edge.truthEventRoleId);
        expect(ancestor!.semanticReferent.semanticReferentId).toBe(edge.truthSemanticReferentId);

        // The edge explains the observer's role evidence: preserve keeps the truth role, coarsening
        // yields Participant, and an unresolved projection yields no role at all.
        if (binding.eventRoleEvidence.kind === 'exact') {
          const observed = binding.eventRoleEvidence.eventRoleId;
          expect(observed === edge.truthEventRoleId || observed === EventRoleId.Participant).toBe(true);
        }
      }

      // Distinct perceived bindings descend from distinct truth bindings in this fixture, so a
      // collapsed ancestry that pointed every edge at one ancestor would be caught.
      const ancestorIds = projection.omniscientAncestry.map((edge) => edge.truthEventBindingId);
      expect(new Set(ancestorIds).size).toBe(ancestorIds.length);

      // The character side cannot traverse it: no character-accessible record carries a field that
      // reaches the ancestry, and the truth identities it holds appear nowhere in the projection.
      const characterSide = stringifyWithBigInts({
        bindings: projection.perceivedBindings,
        classifications: projection.classifications,
        experience: projection.experience,
      });
      for (const edge of projection.omniscientAncestry) {
        expect(characterSide).not.toContain(edge.truthSemanticReferentId);
        expect(characterSide).not.toContain(edge.truthEventRoleId.replace('event-role/', 'truth-role/'));
      }
      expect(characterSide).not.toContain('truthEventBindingId');
      expect(characterSide).not.toContain('omniscientAncestry');
    }
  });

  it('CV-SEM-010 keeps the two provenance graphs separate per observer', () => {
    const projections = projectAllObservers();
    const darius = projections.get(DARIUS)!;
    const glen = projections.get(GLEN)!;

    // Darius and Glen both perceive the same truth location. Omniscient ancestry knows it...
    const dariusPlaces = darius.omniscientAncestry.filter((edge) => edge.truthEventRoleId === EventRoleId.Location);
    const glenPlaces = glen.omniscientAncestry.filter((edge) => edge.truthEventRoleId === EventRoleId.Location);
    expect(dariusPlaces).toHaveLength(1);
    expect(glenPlaces).toHaveLength(1);
    expect(dariusPlaces[0].truthSemanticReferentId).toBe(glenPlaces[0].truthSemanticReferentId);

    // ...while their character-side binding occurrences share nothing that could reveal it.
    const dariusIds = new Set(darius.perceivedBindings.map((b) => b.perceivedBindingId));
    const glenIds = new Set(glen.perceivedBindings.map((b) => b.perceivedBindingId));
    expect([...dariusIds].filter((id) => glenIds.has(id))).toEqual([]);

    // Each ancestry edge names exactly one observer; there is no cross-observer edge.
    for (const edge of [...darius.omniscientAncestry, ...glen.omniscientAncestry]) {
      expect([DARIUS, GLEN, MINA]).toContain(edge.observerId);
    }
    expect(darius.omniscientAncestry.every((edge) => edge.observerId === DARIUS)).toBe(true);
    expect(glen.omniscientAncestry.every((edge) => edge.observerId === GLEN)).toBe(true);
  });
});
