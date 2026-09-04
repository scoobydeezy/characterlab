import { describe, expect, it } from 'vitest';
import { bytesToHex, canonicalEncode, list, text, unsigned, type CanonicalValue } from '../substrate/canonicalEncoding';
import { commitManifest, createModelIdentity } from '../substrate/identity';
import {
  compileMutationAuthorityRegistry, mutationAuthorityId, mutationAuthorityRegistryValue,
  type MutationAuthorityDefinition,
} from '../substrate/mutationAuthority';
import { SEMANTIC_RECORD_SCHEMAS } from '../semanticBinding/semanticSchemaRegistry';
import {
  AuthoritativeState,
  StateAuthorityRegistry,
  StateContractError,
  applyStatePatch,
  createStatePatch,
  type StatePath,
} from '../substrate/state';
import {
  applyPerceptualTrackTransition,
  emptyPerceptualContinuantFileState,
  endPerceptualContinuantFile,
  type PerceptualContinuantFileState,
  type PerceptualReferentId,
} from '../semanticBinding/perceptualContinuantFiles';
import {
  applyPerceptualEventTransition,
  emptyPerceptualEventFileState,
  type PerceptualEventFileState,
} from '../semanticBinding/perceptualEventFiles';
import {
  decodeSemanticValue,
  encodeSemanticValue,
  perceptualContinuantFileStateValue,
  perceptualEventFileStateValue,
  restorePerceptualContinuantFileState,
  restorePerceptualEventFileState,
} from '../semanticBinding/semanticCodecs';
import {
  SEMANTIC_MUTATION_AUTHORITIES,
  SEMANTIC_MUTATION_AUTHORITY_DEFINITIONS,
  SEMANTIC_WRITABLE_LEAVES,
  SemanticMutationAuthority,
  SemanticStateFamily,
  SemanticStateRoot,
  activeContinuantFilePath,
  candidateCatalogEntryPath,
  createSemanticStateAuthorityRegistry,
  identitySymbolMappingPath,
  nextEventSequencePath,
  nextTrackSequencePath,
  perceptualStateEntries,
  resolutionRecordPath,
} from '../semanticBinding/semanticStateAuthority';

const mina = 'character/mina';
const darius = 'character/darius';
const version = 'semantic-binding/0.1-candidate#SEM-001A';

/** Stable ordinal per detection label: occurrence IDs are allocated, never symbolic. */
const OCCURRENCE_ORDINALS = new Map<string, bigint>();
const detectionOrdinal = (label: string): bigint => {
  if (!OCCURRENCE_ORDINALS.has(label)) OCCURRENCE_ORDINALS.set(label, BigInt(OCCURRENCE_ORDINALS.size));
  return OCCURRENCE_ORDINALS.get(label)!;
};

const continuantFile = (observerTrackSequence: bigint, observerId = mina): PerceptualReferentId => ({
  observerId,
  observerTrackSequence,
});

const hex = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));

/** Held fixed across the model-identity comparison so only the authority definition varies. */
const SEMANTIC_RECORD_SCHEMA_COMMITMENT = SEMANTIC_RECORD_SCHEMAS.map((schema) =>
  text(`${schema.typeId}/${schema.schemaVersion}/${schema.name}`));

const stateCode = (run: () => unknown): string => {
  try {
    run();
  } catch (error) {
    if (error instanceof StateContractError) return error.code;
    throw error;
  }
  throw new Error('expected a state contract failure');
};

/** Two Mina detections and one Darius detection across both perceptual file states. */
const populated = (): { continuantFiles: PerceptualContinuantFileState; eventFiles: PerceptualEventFileState } => {
  let continuantFiles = emptyPerceptualContinuantFileState();
  let eventFiles = emptyPerceptualEventFileState();
  for (const [observerId, detectionId] of [[mina, 'det/1'], [mina, 'det/2'], [darius, 'det/dx']] as const) {
    continuantFiles = applyPerceptualTrackTransition(continuantFiles, {
      observerId,
      currentDetectionId: { observerId, detectionOccurrenceId: detectionOrdinal(detectionId) },
      continuityKind: 'NewTrack',
      supportingObservationIds: [{ observerId, observationId: 33900n }],
      occurredAt: 10n,
      transformationVersion: version,
    }).state;
    eventFiles = applyPerceptualEventTransition(eventFiles, {
      observerId,
      currentEventDetectionId: { observerId, eventDetectionOccurrenceId: detectionOrdinal(`event-${detectionId}`) },
      continuityKind: 'NewEventFile',
      supportingObservationIds: [{ observerId, observationId: 33900n }],
      occurredAt: 10n,
      transformationVersion: 'semantic-binding/0.1-candidate#SEM-001C',
    }).state;
  }
  return { continuantFiles, eventFiles };
};

describe('SEM-001I.3 semantic mutation authority', () => {
  it('registers exactly one owner for every writable leaf of roots 241..244', () => {
    expect(() => createSemanticStateAuthorityRegistry()).not.toThrow();
    expect(SEMANTIC_WRITABLE_LEAVES).toHaveLength(7);

    // Every declared leaf is covered by exactly one authority pattern.
    const patterns = SEMANTIC_MUTATION_AUTHORITIES.flatMap((authority) => authority.patterns);
    expect(patterns).toHaveLength(7);
    for (const leaf of SEMANTIC_WRITABLE_LEAVES) {
      const owners = SEMANTIC_MUTATION_AUTHORITIES.filter((authority) =>
        authority.patterns.some((pattern) =>
          pattern.rootStateTypeId === leaf.pattern.rootStateTypeId && pattern.fieldId === leaf.pattern.fieldId));
      expect(owners).toHaveLength(1);
    }

    // The four accepted state roots are exactly the record type IDs of the numeric registry.
    expect(new Set(SEMANTIC_WRITABLE_LEAVES.map((leaf) => leaf.pattern.rootStateTypeId)))
      .toEqual(new Set([241n, 242n, 243n, 244n]));
    expect(SemanticStateRoot.RecognitionResolutionState).toBe(244n);
  });

  it('rejects a second owner for an already-owned family and an uncovered leaf', () => {
    // A second authority claiming an owned family is refused. Because writable leaves derive from
    // the authority definitions, the compiled path reports the duplicate leaf declaration first.
    expect(stateCode(() => compileMutationAuthorityRegistry([
      ...SEMANTIC_MUTATION_AUTHORITY_DEFINITIONS,
      {
        authorityName: 'authority/intruder',
        ownedLeaves: [{
          pattern: SemanticStateFamily.ActivePerceptualReferentIds,
          valueGrammar: { kind: 'membership-marker' },
          removalAllowed: true,
        }],
      },
    ]))).toBe('INVALID_PATH');

    // The underlying substrate invariant still refuses two owners of one leaf, with no
    // most-specific-wins fallback.
    const base = compileMutationAuthorityRegistry(SEMANTIC_MUTATION_AUTHORITY_DEFINITIONS);
    expect(stateCode(() => new StateAuthorityRegistry(base.writableLeaves, [
      ...base.authorities,
      {
        mutationAuthorityId: mutationAuthorityId('authority/intruder'),
        patterns: [SemanticStateFamily.ActivePerceptualReferentIds],
      },
    ]))).toBe('OWNERSHIP_OVERLAP');

    // Dropping an authority while keeping its leaf declared writable leaves that leaf unowned.
    const withoutResolution = base.authorities.filter((authority) =>
      hex(authority.mutationAuthorityId) !== hex(SemanticMutationAuthority.RecognitionResolution));
    expect(withoutResolution).toHaveLength(2);
    expect(stateCode(() => new StateAuthorityRegistry(base.writableLeaves, withoutResolution)))
      .toBe('UNCOVERED_WRITABLE_PATH');
  });

  it('projects both perceptual file states onto their registered leaves', () => {
    const registry = createSemanticStateAuthorityRegistry();
    const { continuantFiles, eventFiles } = populated();
    const entries = perceptualStateEntries(continuantFiles, eventFiles);

    // Two observer counters plus three active files, per state root.
    expect(entries).toHaveLength(10);
    const state = new AuthoritativeState([...entries]);
    expect(() => registry.validateState(state)).not.toThrow();

    expect(state.read(nextTrackSequencePath(mina))).toMatchObject({ presence: true, value: unsigned(2n) });
    expect(state.read(nextTrackSequencePath(darius))).toMatchObject({ presence: true, value: unsigned(1n) });
    expect(state.read(nextEventSequencePath(mina))).toMatchObject({ presence: true, value: unsigned(2n) });
    expect(state.read(activeContinuantFilePath(continuantFile(0n)))).toMatchObject({ presence: true, value: true });
    // Another observer's file is a different leaf, not a shared one.
    expect(state.read(activeContinuantFilePath(continuantFile(0n, darius)))).toMatchObject({ presence: true });
    expect(state.read(activeContinuantFilePath(continuantFile(9n)))).toMatchObject({ presence: false });
  });

  it('keeps the membership leaf a mutation projection of the canonical set', () => {
    const { continuantFiles, eventFiles } = populated();

    // Domain state persists as an accepted canonical SET, not as map-valued state.
    const continuantRecord = perceptualContinuantFileStateValue(continuantFiles);
    const eventRecord = perceptualEventFileStateValue(eventFiles);
    const activeField = (value: CanonicalValue): readonly CanonicalValue[] => {
      if (typeof value === 'boolean' || value.kind !== 'record') throw new Error('expected a record');
      const field = value.fields.get(2n);
      if (!field || typeof field === 'boolean' || field.kind !== 'set') {
        throw new Error('active-file collection must persist as a canonical set');
      }
      return field.items;
    };
    const persistedContinuants = activeField(continuantRecord).map(hex);
    const persistedEvents = activeField(eventRecord).map(hex);

    // Mutation addressing projects exactly that set: one keyed leaf per member, value exactly true,
    // and the leaf key is the same canonical identity the set holds.
    const entries = perceptualStateEntries(continuantFiles, eventFiles);
    const membershipKeys = (rootStateTypeId: bigint) => entries
      .filter((entry) => entry.path.rootStateTypeId === rootStateTypeId && entry.path.fieldId === 2n)
      .map((entry) => {
        expect(entry.value).toBe(true);
        const [selector] = entry.path.selectors;
        if (selector.kind !== 'mapKey') throw new Error('membership leaf must be map-keyed');
        return hex(selector.key);
      });

    expect(new Set(membershipKeys(241n))).toEqual(new Set(persistedContinuants));
    expect(new Set(membershipKeys(242n))).toEqual(new Set(persistedEvents));

    // The projection survives the persistence boundary unchanged.
    const restored = restorePerceptualContinuantFileState(
      decodeSemanticValue(encodeSemanticValue(continuantRecord)),
    );
    const restoredEvents = restorePerceptualEventFileState(
      decodeSemanticValue(encodeSemanticValue(eventRecord)),
    );
    // Membership is set-valued, so the projection is compared as a set: enumeration order carries
    // no meaning and the two canonicalizations legitimately order their entries differently.
    const leafKeySet = (source: readonly { readonly path: StatePath }[]) => new Set(source.map((entry) => {
      const [selector] = entry.path.selectors;
      if (selector.kind !== 'mapKey') throw new Error('membership leaf must be map-keyed');
      return `${entry.path.rootStateTypeId}/${entry.path.fieldId}/${hex(selector.key)}`;
    }));
    expect(leafKeySet(perceptualStateEntries(restored, restoredEvents))).toEqual(leafKeySet(entries));

    // Retiring a file removes exactly one member from both views.
    const retired = endPerceptualContinuantFile(continuantFiles, {
      observerId: mina,
      perceptualReferentId: continuantFile(0n),
      supportingObservationIds: [{ observerId: mina, observationId: 33000n }],
      occurredAt: 20n,
      transformationVersion: version,
    }).state;
    const retiredPersisted = activeField(perceptualContinuantFileStateValue(retired)).map(hex);
    const retiredLeaves = perceptualStateEntries(retired, eventFiles)
      .filter((entry) => entry.path.rootStateTypeId === 241n && entry.path.fieldId === 2n);
    expect(retiredPersisted).toHaveLength(persistedContinuants.length - 1);
    expect(retiredLeaves).toHaveLength(retiredPersisted.length);
    expect(new Set(retiredLeaves.map((entry) => hex(
      entry.path.selectors[0].kind === 'mapKey' ? entry.path.selectors[0].key : text('n/a'),
    )))).toEqual(new Set(retiredPersisted));
  });

  it('admits writes only from the owning authority', () => {
    const registry = createSemanticStateAuthorityRegistry();
    const { continuantFiles, eventFiles } = populated();
    const state = new AuthoritativeState([...perceptualStateEntries(continuantFiles, eventFiles)]);

    const advanceCounter = createStatePatch([{
      kind: 'set',
      path: nextTrackSequencePath(mina),
      expected: { presence: true, value: unsigned(2n) },
      newValue: unsigned(3n),
    }]);

    // The perception seam owns the counter.
    expect(() => applyStatePatch(state, advanceCounter, SemanticMutationAuthority.Perception, registry))
      .not.toThrow();

    // Recognition does not, and there is no most-specific-wins fallback.
    expect(stateCode(() => applyStatePatch(state, advanceCounter, SemanticMutationAuthority.RecognitionResolution, registry)))
      .toBe('ILLEGAL_WRITE');
    expect(stateCode(() => applyStatePatch(
      state, advanceCounter, mutationAuthorityId('authority/unregistered'), registry,
    ))).toBe('UNKNOWN_AUTHORITY');
  });

  it('enforces the accepted lifecycle in removal permission and leaf values', () => {
    const registry = createSemanticStateAuthorityRegistry();
    const { continuantFiles, eventFiles } = populated();
    const state = new AuthoritativeState([...perceptualStateEntries(continuantFiles, eventFiles)]);

    // Retiring a continuant-file removes its membership marker.
    const retire = createStatePatch([{
      kind: 'remove',
      path: activeContinuantFilePath(continuantFile(0n)),
      expectedOldValue: true,
    }]);
    const retired = applyStatePatch(state, retire, SemanticMutationAuthority.Perception, registry);
    expect(retired.state.read(activeContinuantFilePath(continuantFile(0n)))).toMatchObject({ presence: false });
    // The observer sequence is untouched by retirement, so the ordinal is never freed.
    expect(retired.state.read(nextTrackSequencePath(mina))).toMatchObject({ presence: true, value: unsigned(2n) });

    // An observer counter may never be removed.
    expect(stateCode(() => applyStatePatch(state, createStatePatch([{
      kind: 'remove', path: nextTrackSequencePath(mina), expectedOldValue: unsigned(2n),
    }]), SemanticMutationAuthority.Perception, registry))).toBe('REMOVE_FORBIDDEN');

    // Membership is an exact marker, not a payload that could smuggle semantics.
    expect(stateCode(() => registry.validateNewValue(
      activeContinuantFilePath(continuantFile(1n)), unsigned(1n),
    ))).toBe('INVALID_VALUE');
    expect(stateCode(() => registry.validateNewValue(nextTrackSequencePath(mina), text('two'))))
      .toBe('INVALID_VALUE');
  });

  it('carries ownership, removal, and leaf grammar into ModelIdentity', async () => {
    const modelFor = async (definitions: readonly MutationAuthorityDefinition[]) => {
      const identity = await createModelIdentity({
        rulesVersion: 'rules/authority-fixture',
        contentSchemaVersion: 'content/fixture-1',
        contentManifest: await commitManifest(list([])),
        parameterSchemaVersion: 'parameters/fixture-1',
        parameterSet: await commitManifest(list([])),
        numericProfileVersion: 'numeric/exact-1',
        randomAlgorithmVersion: 'rng/sha256-addressed-128-v1-candidate',
        registrySchemaVersion: 'registry/fixture-1',
        // Same state schemas throughout; only the authority definition varies.
        registryManifest: await commitManifest(list([
          ...SEMANTIC_RECORD_SCHEMA_COMMITMENT,
          mutationAuthorityRegistryValue(definitions),
        ])),
      });
      return bytesToHex(identity.canonicalBytes);
    };

    const reference = await modelFor(SEMANTIC_MUTATION_AUTHORITY_DEFINITIONS);
    expect(await modelFor(SEMANTIC_MUTATION_AUTHORITY_DEFINITIONS)).toBe(reference);

    // Making an observer counter removable is an executable model change.
    const removableCounter = SEMANTIC_MUTATION_AUTHORITY_DEFINITIONS.map((definition) => ({
      ...definition,
      ownedLeaves: definition.ownedLeaves.map((leaf) =>
        leaf.pattern === SemanticStateFamily.NextTrackSequenceByObserver
          ? { ...leaf, removalAllowed: true }
          : leaf),
    }));
    expect(await modelFor(removableCounter)).not.toBe(reference);

    // Letting active-file membership carry a payload is an executable model change.
    const widenedMembership = SEMANTIC_MUTATION_AUTHORITY_DEFINITIONS.map((definition) => ({
      ...definition,
      ownedLeaves: definition.ownedLeaves.map((leaf) =>
        leaf.pattern === SemanticStateFamily.ActivePerceptualReferentIds
          ? { ...leaf, valueGrammar: { kind: 'unsigned-counter' } as const }
          : leaf),
    }));
    expect(await modelFor(widenedMembership)).not.toBe(reference);
  });

  it('addresses recognition knowledge by its accepted uniqueness keys', () => {
    const registry = createSemanticStateAuthorityRegistry();

    const catalogPath = candidateCatalogEntryPath(mina, 'person.glen');
    const mappingPath = identitySymbolMappingPath(mina, 'perceived-symbol/GLEN');
    const resolutionPath = resolutionRecordPath(7n);

    // Each collection is a distinct leaf family under its accepted root and field.
    expect(catalogPath.rootStateTypeId).toBe(243n);
    expect(catalogPath.fieldId).toBe(1n);
    expect(mappingPath.fieldId).toBe(2n);
    expect(resolutionPath.rootStateTypeId).toBe(244n);

    // The same candidate for a different observer is a different leaf.
    const dariusCatalog = candidateCatalogEntryPath(darius, 'person.glen');
    expect(pathKey(dariusCatalog)).not.toBe(pathKey(catalogPath));

    // Recognition knowledge has its own state-family authority; the resolution authority owns only
    // the append-only resolution log.
    expect(() => registry.validateAuthority(SemanticMutationAuthority.RecognitionKnowledge, catalogPath))
      .not.toThrow();
    expect(stateCode(() => registry.validateAuthority(SemanticMutationAuthority.RecognitionResolution, catalogPath)))
      .toBe('ILLEGAL_WRITE');
    expect(() => registry.validateAuthority(SemanticMutationAuthority.RecognitionResolution, resolutionPath))
      .not.toThrow();
    expect(stateCode(() => registry.validateAuthority(SemanticMutationAuthority.Perception, resolutionPath)))
      .toBe('ILLEGAL_WRITE');

    // Resolution history is append-only.
    expect(stateCode(() => registry.validateRemoval(resolutionPath))).toBe('REMOVE_FORBIDDEN');
  });
});

/** Structural key for comparing two concrete leaf paths in an assertion. */
function pathKey(path: StatePath): string {
  const selectors = path.selectors
    .map((selector) => selector.kind === 'mapKey' ? renderValue(selector.key) : selector.kind)
    .join('|');
  return `${path.rootStateTypeId}/${path.fieldId}/${selectors}`;
}

function renderValue(value: CanonicalValue): string {
  if (typeof value === 'boolean') return String(value);
  if (value.kind === 'text') return value.value;
  if (value.kind === 'typedIdentifier') return `${value.namespaceId}:${renderValue(value.payload)}`;
  if (value.kind === 'list') return value.items.map(renderValue).join(',');
  if (value.kind === 'unsigned') return value.value.toString();
  if (value.kind === 'record') return `record/${value.schema.typeId}`;
  return value.kind;
}
