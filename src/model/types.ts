/**
 * Shared semantic vocabulary, per Brief §13 ("CharacterLab operates over
 * typed concepts... Anonymous untyped graph nodes are prohibited") and §2's
 * shared-concept list (Character, Need, Person, Action, Experience, ...).
 *
 * Phase 1 only needs a handful of these concept categories (Need, Person,
 * Action). The rest (Location, Object, Context, ValueConcept, TraitConcept,
 * OutcomeConcept, MemoryEpisode) are named here as a `ConceptCategory` union
 * so Phase 2+ code has a fixed place to plug in without renegotiating the
 * vocabulary, but Phase 1 does not instantiate them.
 */

import { ConceptKey, NeedId } from '../kernel/canonical';
import { Rational } from '../kernel/rational';

export type ConceptCategory =
  | 'Need'
  | 'Person'
  | 'Activity'
  | 'Action'
  | 'Location'
  | 'Object'
  | 'Context'
  | 'ValueConcept'
  | 'TraitConcept'
  | 'OutcomeConcept'
  | 'MemoryEpisode';

export interface Concept {
  readonly key: ConceptKey;
  readonly category: ConceptCategory;
  readonly displayName: string;
}

/** A subject of learned Need-satisfaction expectation (Brief §12) — in
 * Phase 1 this is always a Person concept (e.g. `person.glen`), but the
 * type is deliberately concept-shaped, not person-shaped, so Phase 2+ can
 * point it at an Activity or Location without changing NeedExpectation's
 * shape. */
export type ExpectationSubject = ConceptKey;

/** A snapshot of one Need's level at a point in time — used inside
 * Experience.NeedStateBefore/After (Brief §11). */
export interface NeedLevelSnapshot {
  readonly needId: NeedId;
  readonly level: Rational;
}
