import {
  list, text, typedIdentifier, unsigned,
  type CanonicalValue, type TypedIdentifierValue,
} from '../substrate/canonicalEncoding';
import {
  compileMutationAuthorityRegistry, mutationAuthorityId,
  type MutationAuthorityDefinition,
} from '../substrate/mutationAuthority';
import type { StateAuthorityRegistry, StatePath, StatePathPattern } from '../substrate/state';
import { SEMANTIC_TYPED_ID_NAMESPACES } from './semanticSchemaRegistry';
import {
  observerIdValue, perceptualEventReferentIdValue, perceptualReferentIdValue, semanticOccurrenceId,
} from './semanticCodecs';
import type { PerceptualContinuantFileState, PerceptualReferentId } from './perceptualContinuantFiles';
import type { PerceptualEventFileState } from './perceptualEventFiles';

export const SEMANTIC_STATE_AUTHORITY_VERSION = 'semantic-state-authority/0.1-candidate#SEM-001I.3' as const;

/**
 * Authority names for the state families this slice owns. Each names the *state family* whose
 * writes it governs, not today's only producer: `RecognitionKnowledgeAuthority` owns recognition
 * knowledge whether it is seeded by initial-state construction (the only writer in v0.1) or later
 * written by an accepted learning/forgetting seam. Initial-state construction is the origin of a
 * starting state, never the enduring semantic owner of what that state means.
 *
 * Identities come from the accepted global `MutationAuthorityId` namespace, so they sit alongside
 * every future belief, memory, regulation, and identity authority rather than forming a
 * semantic-binding-specific identity family.
 */
export const SemanticMutationAuthorityName = Object.freeze({
  Perception: 'authority/perception',
  RecognitionKnowledge: 'authority/recognition-knowledge',
  RecognitionResolution: 'authority/recognition-resolution',
});

export const SemanticMutationAuthority: Readonly<Record<
  'Perception' | 'RecognitionKnowledge' | 'RecognitionResolution', TypedIdentifierValue
>> = Object.freeze({
  /** Owns both observer-scoped perceptual file states (types 241 and 242). */
  Perception: mutationAuthorityId(SemanticMutationAuthorityName.Perception),
  /** Owns candidate catalogs and identity-symbol mappings (type 243). */
  RecognitionKnowledge: mutationAuthorityId(SemanticMutationAuthorityName.RecognitionKnowledge),
  /** Owns the append-only resolution log (type 244). */
  RecognitionResolution: mutationAuthorityId(SemanticMutationAuthorityName.RecognitionResolution),
});

/** Record type IDs double as `RootStateTypeId` values, per the accepted numeric registry. */
export const SemanticStateRoot = Object.freeze({
  PerceptualContinuantFileState: 241n,
  PerceptualEventFileState: 242n,
  RecognitionKnowledgeState: 243n,
  RecognitionResolutionState: 244n,
});

/**
 * Every semantic collection is addressed by a `mapKey` selector over its own accepted uniqueness
 * key: the observer for the two counters, the identity record for the two active-file sets, and
 * the accepted uniqueness tuple or occurrence identity for the recognition collections. No
 * selector depends on list position, insertion order, or an ordinal read as magnitude.
 */
const mapFamily = (rootStateTypeId: bigint, fieldId: bigint): StatePathPattern => ({
  rootStateTypeId,
  fieldId,
  selectors: [{ kind: 'wildcard', selectorKind: 'mapKey' }],
});

export const SemanticStateFamily = Object.freeze({
  NextTrackSequenceByObserver: mapFamily(SemanticStateRoot.PerceptualContinuantFileState, 1n),
  ActivePerceptualReferentIds: mapFamily(SemanticStateRoot.PerceptualContinuantFileState, 2n),
  NextEventSequenceByObserver: mapFamily(SemanticStateRoot.PerceptualEventFileState, 1n),
  ActivePerceptualEventReferentIds: mapFamily(SemanticStateRoot.PerceptualEventFileState, 2n),
  CandidateCatalogEntries: mapFamily(SemanticStateRoot.RecognitionKnowledgeState, 1n),
  IdentitySymbolMappings: mapFamily(SemanticStateRoot.RecognitionKnowledgeState, 2n),
  ResolutionRecords: mapFamily(SemanticStateRoot.RecognitionResolutionState, 1n),
});

/**
 * Committed definition of the three authorities and their seven leaves.
 *
 * Removal permission is a property of the leaf family, not of the authority: the perception
 * authority owns both non-removable observer counters and removable active-file membership without
 * contradiction. Counters are never decremented or freed and resolution history is append-only, so
 * neither permits removal; active-file membership and the two recognition-knowledge collections do,
 * because retirement and replacement are accepted.
 */
export const SEMANTIC_MUTATION_AUTHORITY_DEFINITIONS: readonly MutationAuthorityDefinition[] = Object.freeze([
  {
    authorityName: SemanticMutationAuthorityName.Perception,
    ownedLeaves: [
      { pattern: SemanticStateFamily.NextTrackSequenceByObserver, valueGrammar: { kind: 'unsigned-counter' }, removalAllowed: false },
      { pattern: SemanticStateFamily.ActivePerceptualReferentIds, valueGrammar: { kind: 'membership-marker' }, removalAllowed: true },
      { pattern: SemanticStateFamily.NextEventSequenceByObserver, valueGrammar: { kind: 'unsigned-counter' }, removalAllowed: false },
      { pattern: SemanticStateFamily.ActivePerceptualEventReferentIds, valueGrammar: { kind: 'membership-marker' }, removalAllowed: true },
    ],
  },
  {
    authorityName: SemanticMutationAuthorityName.RecognitionKnowledge,
    ownedLeaves: [
      { pattern: SemanticStateFamily.CandidateCatalogEntries, valueGrammar: { kind: 'canonical-record', recordTypeId: 228n }, removalAllowed: true },
      { pattern: SemanticStateFamily.IdentitySymbolMappings, valueGrammar: { kind: 'canonical-record', recordTypeId: 229n }, removalAllowed: true },
    ],
  },
  {
    authorityName: SemanticMutationAuthorityName.RecognitionResolution,
    ownedLeaves: [
      { pattern: SemanticStateFamily.ResolutionRecords, valueGrammar: { kind: 'canonical-record', recordTypeId: 236n }, removalAllowed: false },
    ],
  },
]);

const compiled = compileMutationAuthorityRegistry(SEMANTIC_MUTATION_AUTHORITY_DEFINITIONS);

/** Exactly one registered owner per writable leaf, proven by the registry constructor itself. */
export function createSemanticStateAuthorityRegistry(): StateAuthorityRegistry {
  return compileMutationAuthorityRegistry(SEMANTIC_MUTATION_AUTHORITY_DEFINITIONS).registry;
}

/** The exact bytes to commit into the registry manifest alongside the semantic schemas. */
export function semanticStateAuthorityRegistryValue(): CanonicalValue {
  return compiled.definitionValue;
}

export const SEMANTIC_WRITABLE_LEAVES = compiled.writableLeaves;
export const SEMANTIC_MUTATION_AUTHORITIES = compiled.authorities;

// ---------------------------------------------------------------------------
// Concrete paths
// ---------------------------------------------------------------------------

const mapPath = (pattern: StatePathPattern, key: CanonicalValue): StatePath => ({
  rootStateTypeId: pattern.rootStateTypeId,
  fieldId: pattern.fieldId,
  selectors: [{ kind: 'mapKey', key }],
});

export function nextTrackSequencePath(observerId: string): StatePath {
  return mapPath(SemanticStateFamily.NextTrackSequenceByObserver, observerIdValue(observerId));
}

export function activeContinuantFilePath(referentId: PerceptualReferentId): StatePath {
  return mapPath(SemanticStateFamily.ActivePerceptualReferentIds, perceptualReferentIdValue(referentId));
}

export function nextEventSequencePath(observerId: string): StatePath {
  return mapPath(SemanticStateFamily.NextEventSequenceByObserver, observerIdValue(observerId));
}

export function activeEventFilePath(
  referentId: { readonly observerId: string; readonly observerEventSequence: bigint },
): StatePath {
  return mapPath(
    SemanticStateFamily.ActivePerceptualEventReferentIds,
    perceptualEventReferentIdValue(referentId),
  );
}

/** Keyed by the accepted `(ObserverId, CandidateSemanticReferentId)` uniqueness tuple. */
export function candidateCatalogEntryPath(
  observerId: string,
  candidateSemanticReferentId: string,
): StatePath {
  return mapPath(SemanticStateFamily.CandidateCatalogEntries, list([
    observerIdValue(observerId),
    typedIdentifier(SEMANTIC_TYPED_ID_NAMESPACES.SemanticReferentId, text(candidateSemanticReferentId)),
  ]));
}

/** Keyed by the accepted `(ObserverId, PerceivedIdentitySymbolId)` uniqueness tuple. */
export function identitySymbolMappingPath(
  observerId: string,
  perceivedIdentitySymbolId: string,
): StatePath {
  return mapPath(SemanticStateFamily.IdentitySymbolMappings, list([
    observerIdValue(observerId),
    typedIdentifier(SEMANTIC_TYPED_ID_NAMESPACES.PerceivedIdentitySymbolId, text(perceivedIdentitySymbolId)),
  ]));
}

/** Keyed by the record's own declared occurrence identity. */
export function resolutionRecordPath(recognitionResolutionId: bigint): StatePath {
  return mapPath(
    SemanticStateFamily.ResolutionRecords,
    semanticOccurrenceId('RecognitionResolutionId', recognitionResolutionId),
  );
}

// ---------------------------------------------------------------------------
// Projection into authoritative leaves
// ---------------------------------------------------------------------------

export interface SemanticStateEntry {
  readonly path: StatePath;
  readonly value: CanonicalValue;
}

/**
 * Projects both perceptual file states onto their registered writable leaves. Every entry the
 * perception authority owns appears exactly once and is addressed by its accepted key.
 */
export function perceptualStateEntries(
  continuantFiles: PerceptualContinuantFileState,
  eventFiles: PerceptualEventFileState,
): readonly SemanticStateEntry[] {
  return Object.freeze([
    ...[...continuantFiles.nextTrackSequenceByObserver.entries()].map(([observerId, next]) => ({
      path: nextTrackSequencePath(observerId),
      value: unsigned(next),
    })),
    ...continuantFiles.activePerceptualReferentIds.map((referentId) => ({
      path: activeContinuantFilePath(referentId),
      value: true as CanonicalValue,
    })),
    ...[...eventFiles.nextEventSequenceByObserver.entries()].map(([observerId, next]) => ({
      path: nextEventSequencePath(observerId),
      value: unsigned(next),
    })),
    ...eventFiles.activeEventFiles.map((referentId) => ({
      path: activeEventFilePath(referentId),
      value: true as CanonicalValue,
    })),
  ]);
}
