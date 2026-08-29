/**
 * Canonical identity and ordering, per Brief §6 ("All sets and maps have
 * canonical traversal order... Every type that can serve as a semantic
 * identity owns a stable identifier") and §13 ("Anonymous untyped graph
 * nodes are prohibited").
 *
 * Every semantic identity in CharacterLab is a branded string of the form
 * `namespace.slug` (e.g. `need.connection`, `person.glen`,
 * `action.visit_glen`). Branding at the type level prevents accidentally
 * passing a raw string where a validated key is required.
 */

export type ConceptKey = string & { readonly __brand: 'ConceptKey' };
export type CanonicalActionKey = string & { readonly __brand: 'CanonicalActionKey' };
export type NeedId = string & { readonly __brand: 'NeedId' };

const KEY_PATTERN = /^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/;

function assertKeyShape(kind: string, value: string): void {
  if (!KEY_PATTERN.test(value)) {
    throw new RangeError(
      `${kind} must match namespace.slug (lowercase, underscores) — got "${value}"`,
    );
  }
}

export function conceptKey(value: string): ConceptKey {
  assertKeyShape('ConceptKey', value);
  return value as ConceptKey;
}

export function canonicalActionKey(value: string): CanonicalActionKey {
  assertKeyShape('CanonicalActionKey', value);
  return value as CanonicalActionKey;
}

export function needId(value: string): NeedId {
  assertKeyShape('NeedId', value);
  return value as NeedId;
}

/**
 * Re-brand an already-validated NeedId/CanonicalActionKey/etc. as a
 * ConceptKey. Safe because all of these branded identifiers share the same
 * `namespace.slug` shape (assertKeyShape) — the brand is a compile-time
 * distinction between "identifier used for X's bookkeeping" and
 * "identifier used as a graph node," not a different string format. Used
 * by Phase 2 (model/associations.ts) to let Needs and Actions participate
 * as concepts in the associative graph (Brief §13, §16) without requiring
 * every call site elsewhere to juggle two parallel identifiers for the
 * same thing.
 */
export function asConceptKey(value: NeedId | CanonicalActionKey | ConceptKey): ConceptKey {
  return value as unknown as ConceptKey;
}

/**
 * Canonical string ordering — plain code-point comparison. This is the one
 * tie-break rule used everywhere in the model (association normalization
 * remainder allocation §15.1, memory retrieval ordering §17, action
 * ordering §24/§31) so replay never depends on host locale, engine hash-map
 * iteration order, or insertion order.
 */
export function compareCanonical(a: string, b: string): -1 | 0 | 1 {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Stably sort items by a canonical key, breaking ties by the key itself
 * (never by insertion order, since JS Array#sort is not guaranteed stable
 * across all historical engines and Brief §3.1 forbids depending on
 * "collection iteration order").
 */
export function sortCanonical<T>(items: readonly T[], keyOf: (item: T) => string): T[] {
  return [...items].sort((a, b) => compareCanonical(keyOf(a), keyOf(b)));
}

/**
 * Sort by a primary numeric score (descending — highest first, e.g. top-K
 * memory retrieval or action ranking) with ties broken by canonical key
 * ascending. `score` must already be a comparable primitive (number) or a
 * type with its own `.compare`; callers needing exact Rational comparison
 * should sort with sortCanonicalByRational instead.
 */
export function sortByScoreDesc<T>(
  items: readonly T[],
  scoreOf: (item: T) => number,
  keyOf: (item: T) => string,
): T[] {
  return [...items].sort((a, b) => {
    const sa = scoreOf(a);
    const sb = scoreOf(b);
    if (sa !== sb) return sb - sa; // descending
    return compareCanonical(keyOf(a), keyOf(b));
  });
}
