import { describe, expect, it } from 'vitest';
import { EventRoleId, projectEventRoleEvidence } from '../semanticBinding/eventBindings';
import {
  CANONICAL_BINDING_REQUESTS,
  DARIUS,
  GLEN,
  MINA,
  MULTI_ROLE_AFFORDANCES,
  MULTI_ROLE_BINDING_REQUESTS,
  REPEATED_ROLE_AFFORDANCES,
  REPEATED_ROLE_BINDING_REQUESTS,
  REFERENT,
  SWAPPED_BINDING_REQUESTS,
  createRunAllocator,
  observerSemanticView,
  projectAllObservers,
  projectObserver,
  stringifyWithBigInts,
  truthBindings,
  type ObserverId,
} from './fixtures/phenSem001';

const roleOf = (binding: { readonly eventRoleEvidence: { readonly kind: string; readonly eventRoleId?: string } }) =>
  binding.eventRoleEvidence.kind === 'exact' ? binding.eventRoleEvidence.eventRoleId : 'unresolved';

describe('PHEN-SEM-001 truth bindings and binding-specific visibility', () => {
  it('CV-SEM-001 keeps role changes structurally visible on both sides', () => {
    // Identical referents, Actor and Companion exchanged.
    const canonical = truthBindings(CANONICAL_BINDING_REQUESTS);
    const swapped = truthBindings(SWAPPED_BINDING_REQUESTS);

    const referentsOf = (bindings: readonly { readonly semanticReferent: { readonly semanticReferentId: string } }[]) =>
      bindings.map((binding) => binding.semanticReferent.semanticReferentId).sort();
    // The two events name exactly the same referents...
    expect(referentsOf(canonical)).toEqual(referentsOf(swapped));

    const rolePairs = (bindings: readonly { readonly eventRoleId: string; readonly semanticReferent: { readonly semanticReferentId: string } }[]) =>
      bindings.map((binding) => `${binding.eventRoleId}=${binding.semanticReferent.semanticReferentId}`).sort();
    // ...yet the truth bindings are structurally distinct.
    expect(rolePairs(canonical)).not.toEqual(rolePairs(swapped));

    // And the distinction survives into permitted perceived bindings: Darius, who sees an Actor,
    // perceives a different continuant playing it in each event.
    const canonicalDarius = projectObserver({
      observerId: DARIUS, truth: canonical, allocator: createRunAllocator(), experienceId: 1n,
    });
    const swappedDarius = projectObserver({
      observerId: DARIUS, truth: swapped, allocator: createRunAllocator(), experienceId: 1n,
    });
    // The perceived structure is isomorphic — an observer cannot see which truth referent moved —
    // but the truth-side role assignment genuinely differs.
    expect(observerSemanticView(canonicalDarius)).toEqual(observerSemanticView(swappedDarius));
    expect(canonical.find((b) => b.eventRoleId === EventRoleId.Actor)?.semanticReferent.semanticReferentId)
      .not.toBe(swapped.find((b) => b.eventRoleId === EventRoleId.Actor)?.semanticReferent.semanticReferentId);
  });

  it('CV-SEM-002 retains every binding occurrence for a referent in several roles', () => {
    const bindings = truthBindings(MULTI_ROLE_BINDING_REQUESTS);

    const minaBindings = bindings.filter(
      (binding) => binding.semanticReferent.semanticReferentId === REFERENT.mina.semanticReferentId);
    // Mina occupies Actor and Companion: two occurrences, not one deduplicated by referent.
    expect(minaBindings).toHaveLength(2);
    expect(minaBindings.map((binding) => binding.eventRoleId).sort())
      .toEqual([EventRoleId.Actor, EventRoleId.Companion].sort());

    // The two occurrences carry distinct allocated identities.
    const ids = new Set(minaBindings.map((binding) => binding.eventBindingId));
    expect(ids.size).toBe(2);

    // No referent-keyed collapse anywhere in the compiled set.
    expect(bindings).toHaveLength(MULTI_ROLE_BINDING_REQUESTS.length);
  });

  it('CV-SEM-002 retains both occurrences when one perceived continuant holds two roles', () => {
    // Mina perceives a single person continuant as both Actor and Companion of one event-file.
    // Referent-keyed storage would collapse these into one binding; role-keyed storage would
    // collapse two referents in one role. Neither is permitted.
    const projection = projectObserver({
      observerId: MINA,
      truth: truthBindings(MULTI_ROLE_BINDING_REQUESTS),
      allocator: createRunAllocator(),
      experienceId: 1n,
      affordances: MULTI_ROLE_AFFORDANCES,
    });

    const person = projection.tracksByLabel.get('shared/person')!;
    const onPerson = projection.perceivedBindings.filter((binding) =>
      binding.perceptualReferentId.observerTrackSequence === person.observerTrackSequence);

    // Two distinct binding occurrences over one continuant.
    expect(onPerson).toHaveLength(2);
    expect(new Set(onPerson.map((binding) => binding.perceivedBindingId)).size).toBe(2);
    expect((onPerson.map(roleOf) as string[]).sort())
      .toEqual([EventRoleId.Actor, EventRoleId.Companion].sort());

    // Three bindings in total: the shared person twice, plus the place.
    expect(projection.perceivedBindings).toHaveLength(3);
  });

  it('CV-SEM-002 retains both occurrences when one perceived role holds two continuants', () => {
    // The mirror of the previous vector. Mina perceives two distinct continuants both in the
    // Companion role of one event-file. Role-keyed storage would collapse them; referent-keyed
    // storage collapses the other direction. The binding occurrence is keyed by neither alone.
    const projection = projectObserver({
      observerId: MINA,
      truth: truthBindings(REPEATED_ROLE_BINDING_REQUESTS),
      allocator: createRunAllocator(),
      experienceId: 1n,
      affordances: REPEATED_ROLE_AFFORDANCES,
    });

    const companions = projection.perceivedBindings.filter(
      (binding) => roleOf(binding) === EventRoleId.Companion);
    expect(companions).toHaveLength(2);

    // Two distinct continuant-files, two distinct binding occurrences, one event-file.
    expect(new Set(companions.map((b) => b.perceptualReferentId.observerTrackSequence)).size).toBe(2);
    expect(new Set(companions.map((b) => b.perceivedBindingId)).size).toBe(2);
    expect(new Set(companions.map((b) => b.perceptualEventReferentId.observerEventSequence)).size).toBe(1);

    expect(projection.perceivedBindings).toHaveLength(3);
  });

  it('CV-SEM-003 gives each observer exactly their declared permitted binding set', () => {
    const projections = projectAllObservers();

    const rolesFor = (observerId: ObserverId) =>
      (projections.get(observerId)!.perceivedBindings.map(roleOf) as string[]).sort();

    // Mina: companion, place, instrument — she is the actor and does not perceive herself here.
    expect(rolesFor(MINA)).toEqual([
      EventRoleId.Companion, EventRoleId.Instrument, EventRoleId.Location,
    ].sort());

    // Darius: an actor and a place. No Glen binding and no instrument reach him at all.
    expect(rolesFor(DARIUS)).toEqual([EventRoleId.Actor, EventRoleId.Location].sort());
    expect(rolesFor(DARIUS)).not.toContain(EventRoleId.Companion);
    expect(rolesFor(DARIUS)).not.toContain(EventRoleId.Instrument);

    // Glen: the actor coarsened to Participant, the place preserved, the instrument unresolved.
    expect(rolesFor(GLEN)).toEqual([
      EventRoleId.Location, EventRoleId.Participant, 'unresolved',
    ].sort());

    // Visibility is per binding, not per event: the same truth event yields three different
    // permitted sets, and no observer's set is a superset of another's.
    const mina = new Set(rolesFor(MINA));
    const darius = new Set(rolesFor(DARIUS));
    expect([...darius].every((role) => mina.has(role))).toBe(false);
    expect([...mina].every((role) => darius.has(role))).toBe(false);
  });

  it('CV-SEM-003 represents the action as the event-file, never as a continuant binding', () => {
    const projections = projectAllObservers();
    for (const observerId of [MINA, DARIUS, GLEN] as const) {
      const projection = projections.get(observerId)!;
      // Every observer has exactly one perceived event-file standing for the action occurrence.
      expect(projection.experience.perceptualEventReferentIds).toHaveLength(1);
      // And no perceived binding claims the Action role on a continuant-file.
      expect(projection.perceivedBindings.map(roleOf)).not.toContain(EventRoleId.Action);
      // Every perceived binding is grouped under that one event-file.
      for (const binding of projection.perceivedBindings) {
        expect(binding.perceptualEventReferentId).toEqual(projection.eventFile);
      }
    }
  });

  it('CV-SEM-007 keeps truth binding and referent identities out of character evidence', () => {
    const projections = projectAllObservers();
    const truthIdentifiers = [
      REFERENT.mina.semanticReferentId,
      REFERENT.glen.semanticReferentId,
      REFERENT.library.semanticReferentId,
      REFERENT.leadPipe.semanticReferentId,
      REFERENT.skipRope.semanticReferentId,
      'event-type/skip-rope',
    ];

    for (const observerId of [MINA, DARIUS, GLEN] as const) {
      const projection = projections.get(observerId)!;
      const serialized = stringifyWithBigInts({
        bindings: projection.perceivedBindings,
        classifications: projection.classifications,
        experience: projection.experience,
        transitions: projection.trackTransitions,
      });
      for (const identifier of truthIdentifiers) {
        expect(serialized).not.toContain(identifier);
      }
      // Truth binding occurrence identities are likewise absent.
      for (const binding of truthBindings()) {
        expect(serialized).not.toContain(`"eventBindingId":"${binding.eventBindingId}"`);
      }
    }
  });

  it('CV-SEM-007 lets nothing but role evidence cross the projection boundary', () => {
    // The previous vector serializes what the fixture chose to carry forward, which cannot catch a
    // leak the fixture happens to drop. This one asserts the exact shape `projectEventRoleEvidence`
    // returns: it is the sole channel from truth to observer, so its key set is the boundary.
    const bindings = truthBindings();
    for (const binding of bindings) {
      if (binding.eventRoleId === EventRoleId.Action) continue;
      const projected = projectEventRoleEvidence(
        binding,
        { observerId: MINA, observerTrackSequence: 3n },
        { kind: 'preserve' },
      );
      expect(projected).toBeDefined();
      expect(Object.keys(projected!).sort()).toEqual(['eventRoleEvidence', 'perceptualReferentId']);

      // Nothing anywhere in the returned value names the truth referent or its binding occurrence.
      const serialized = stringifyWithBigInts(projected);
      expect(serialized).not.toContain(binding.semanticReferent.semanticReferentId);
      expect(serialized).not.toContain(String(binding.eventBindingId));

      // The only truth-derived value that crosses is a registered role identifier from the closed
      // accepted vocabulary. Domain tags are not substring-checked here: role names legitimately
      // share words with them (`event-role/location` contains "location"), so a substring scan
      // would flag the role evidence the boundary exists to carry.
      const evidence = projected!.eventRoleEvidence;
      expect(evidence.kind).toBe('exact');
      if (evidence.kind === 'exact') {
        expect(Object.values(EventRoleId)).toContain(evidence.eventRoleId);
      }
      expect(Object.keys(evidence).sort()).toEqual(['eventRoleId', 'kind']);
    }
  });

  it('CV-SEM-007 denies cross-observer handle equality for one hidden referent', () => {
    // Darius and Glen both perceive the same truth entity in the Actor position, and both
    // perceive the same truth location. Nothing in either observer's evidence lets a reader
    // discover that the two hidden sources are the same.
    const projections = projectAllObservers();
    const darius = projections.get(DARIUS)!;
    const glen = projections.get(GLEN)!;

    const continuantKeys = (projection: typeof darius) => new Set(
      projection.perceivedBindings.map((binding) =>
        `${binding.perceptualReferentId.observerId}/${binding.perceptualReferentId.observerTrackSequence}`));

    // Continuant-file identities are observer-scoped: no key is shared, so equality of the hidden
    // source cannot be read off equality of the handles.
    const shared = [...continuantKeys(darius)].filter((key) => continuantKeys(glen).has(key));
    expect(shared).toEqual([]);

    // Every one of Darius's handles names Darius; every one of Glen's names Glen.
    for (const binding of darius.perceivedBindings) {
      expect(binding.perceptualReferentId.observerId).toBe(DARIUS);
    }
    for (const binding of glen.perceivedBindings) {
      expect(binding.perceptualReferentId.observerId).toBe(GLEN);
    }

    // Their ordinals may coincide by allocation accident; that coincidence carries no meaning,
    // because the observer is part of the canonical identity.
    const dariusOrdinals = darius.perceivedBindings.map((b) => b.perceptualReferentId.observerTrackSequence);
    const glenOrdinals = glen.perceivedBindings.map((b) => b.perceptualReferentId.observerTrackSequence);
    expect(dariusOrdinals.some((ordinal) => glenOrdinals.includes(ordinal))).toBe(true);
  });

  it('CV-SEM-003 leaves each observer unperturbed by the others sharing one allocator', () => {
    // All three observers draw occurrence ordinals from one shared run-scoped allocator.
    const forward = projectAllObservers({ order: [MINA, DARIUS, GLEN] });
    const reordered = projectAllObservers({ order: [GLEN, DARIUS, MINA] });

    const ordinalsFor = (
      projections: ReadonlyMap<ObserverId, ReturnType<typeof projectObserver>>,
      observerId: ObserverId,
    ) => projections.get(observerId)!.perceivedBindings.map((binding) => binding.perceivedBindingId);

    // The allocator genuinely moves: the observers that swapped position draw different ordinals.
    expect(ordinalsFor(reordered, MINA)).not.toEqual(ordinalsFor(forward, MINA));
    expect(ordinalsFor(reordered, GLEN)).not.toEqual(ordinalsFor(forward, GLEN));

    // Darius keeps his middle position and his flanking observers draw equally, so his ordinals
    // happen to coincide. That coincidence is meaningless in both directions: equal ordinals imply
    // nothing, just as different ordinals imply nothing.
    expect(ordinalsFor(reordered, DARIUS)).toEqual(ordinalsFor(forward, DARIUS));

    // What must hold for every observer is that the semantics are untouched.
    for (const observerId of [MINA, DARIUS, GLEN] as const) {
      expect(observerSemanticView(reordered.get(observerId)!))
        .toEqual(observerSemanticView(forward.get(observerId)!));
      // Observer-scoped file sequences are unaffected by who allocated first.
      expect(reordered.get(observerId)!.continuantFiles.nextTrackSequenceByObserver.get(observerId))
        .toBe(forward.get(observerId)!.continuantFiles.nextTrackSequenceByObserver.get(observerId));
    }
  });
});
