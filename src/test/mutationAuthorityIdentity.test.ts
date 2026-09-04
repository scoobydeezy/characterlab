import { describe, expect, it } from 'vitest';
import {
  bytesToHex, canonicalEncode, text, typedIdentifier, unsigned,
  type CanonicalValue,
} from '../substrate/canonicalEncoding';
import { commitManifest } from '../substrate/identity';
import {
  MUTATION_AUTHORITY_NAMESPACE,
  MutationAuthorityContractError,
  compileMutationAuthorityRegistry,
  isMutationAuthorityId,
  leafValueValidator,
  mutationAuthorityId,
  mutationAuthorityRegistryValue,
  type MutationAuthorityDefinition,
} from '../substrate/mutationAuthority';
import {
  AuthoritativeState, StateContractError,
  type StatePath, type StatePathPattern,
} from '../substrate/state';

const hex = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));

const family = (rootStateTypeId: bigint, fieldId: bigint): StatePathPattern => ({
  rootStateTypeId,
  fieldId,
  selectors: [{ kind: 'wildcard', selectorKind: 'mapKey' }],
});

const leafPath = (pattern: StatePathPattern, key: CanonicalValue): StatePath => ({
  rootStateTypeId: pattern.rootStateTypeId,
  fieldId: pattern.fieldId,
  selectors: [{ kind: 'mapKey', key }],
});

const COUNTERS = family(900n, 1n);
const MEMBERSHIP = family(900n, 2n);

/** Two authorities, three leaves, exercising all three leaf-value grammars. */
const baseline = (): readonly MutationAuthorityDefinition[] => [
  {
    authorityName: 'authority/fixture-owner',
    ownedLeaves: [
      { pattern: COUNTERS, valueGrammar: { kind: 'unsigned-counter' }, removalAllowed: false },
      { pattern: MEMBERSHIP, valueGrammar: { kind: 'membership-marker' }, removalAllowed: true },
    ],
  },
  {
    authorityName: 'authority/fixture-secondary',
    ownedLeaves: [
      { pattern: family(901n, 1n), valueGrammar: { kind: 'canonical-record', recordTypeId: 236n }, removalAllowed: false },
    ],
  },
];

const stateCode = (run: () => unknown): string => {
  try {
    run();
  } catch (error) {
    if (error instanceof StateContractError) return error.code;
    throw error;
  }
  throw new Error('expected a state contract failure');
};

describe('TRC-001/002 addendum — global MutationAuthorityId allocation', () => {
  it('CV-OWN-002 gives MutationAuthorityId exactly one accepted global namespace', () => {
    expect(MUTATION_AUTHORITY_NAMESPACE).toBe(1025n);

    const authority = mutationAuthorityId('authority/perception');
    expect(authority.namespaceId).toBe(MUTATION_AUTHORITY_NAMESPACE);
    expect(isMutationAuthorityId(authority)).toBe(true);

    // It is a governed semantic/model identity, not a run occurrence: the same name under the same
    // model always encodes to the same bytes.
    expect(hex(mutationAuthorityId('authority/perception'))).toBe(hex(authority));

    expect(() => mutationAuthorityId('')).toThrowError(MutationAuthorityContractError);
  });

  it('CV-OWN-002 keeps equal payloads under other typed namespaces unequal', () => {
    const authority = mutationAuthorityId('authority/perception');
    const payload = text('authority/perception');

    // A neighbouring semantic namespace, an adjacent unallocated one, and a bare text payload all
    // encode differently from the authority identity.
    expect(hex(authority)).not.toBe(hex(typedIdentifier(1024n, payload)));
    expect(hex(authority)).not.toBe(hex(typedIdentifier(1026n, payload)));
    expect(hex(authority)).not.toBe(hex(payload));
    expect(isMutationAuthorityId(typedIdentifier(1026n, payload))).toBe(false);
    expect(isMutationAuthorityId(payload)).toBe(false);
  });

  it('CV-OWN-002 resolves every registered authority through that namespace', () => {
    const compiled = compileMutationAuthorityRegistry(baseline());
    expect(compiled.authorities).toHaveLength(2);
    for (const authority of compiled.authorities) {
      expect(isMutationAuthorityId(authority.mutationAuthorityId)).toBe(true);
    }
  });

  it('CV-OWN-002 refuses unknown and untyped authority identities', () => {
    const compiled = compileMutationAuthorityRegistry(baseline());
    const path = leafPath(COUNTERS, text('observer/a'));

    expect(() => compiled.registry.validateAuthority(mutationAuthorityId('authority/fixture-owner'), path))
      .not.toThrow();

    // Registered name, wrong namespace.
    expect(stateCode(() => compiled.registry.validateAuthority(
      typedIdentifier(1026n, text('authority/fixture-owner')), path,
    ))).toBe('UNKNOWN_AUTHORITY');

    // Correct namespace, unregistered name.
    expect(stateCode(() => compiled.registry.validateAuthority(
      mutationAuthorityId('authority/never-registered'), path,
    ))).toBe('UNKNOWN_AUTHORITY');

    // Registered authority that does not own this path.
    expect(stateCode(() => compiled.registry.validateAuthority(
      mutationAuthorityId('authority/fixture-secondary'), path,
    ))).toBe('ILLEGAL_WRITE');
  });

  it('CV-OWN-002 commits authority definitions into registry identity', async () => {
    const definitionDigest = async (definitions: readonly MutationAuthorityDefinition[]) =>
      bytesToHex((await commitManifest(mutationAuthorityRegistryValue(definitions))).digest);

    const reference = await definitionDigest(baseline());

    // Declaration order is not carried: authorities and leaves encode as canonical sets.
    const reordered: readonly MutationAuthorityDefinition[] = [baseline()[1], baseline()[0]];
    expect(await definitionDigest(reordered)).toBe(reference);

    // Changing removal permission is an executable model change.
    const removable = baseline().map((definition) => ({
      ...definition,
      ownedLeaves: definition.ownedLeaves.map((leaf) =>
        leaf.pattern === COUNTERS ? { ...leaf, removalAllowed: true } : leaf),
    }));
    expect(await definitionDigest(removable)).not.toBe(reference);

    // Widening a leaf's value grammar is an executable model change.
    const widened = baseline().map((definition) => ({
      ...definition,
      ownedLeaves: definition.ownedLeaves.map((leaf) =>
        leaf.pattern === MEMBERSHIP
          ? { ...leaf, valueGrammar: { kind: 'unsigned-counter' } as const }
          : leaf),
    }));
    expect(await definitionDigest(widened)).not.toBe(reference);

    // Moving a leaf to a different owner is an executable model change.
    const reassigned: readonly MutationAuthorityDefinition[] = [
      { authorityName: 'authority/fixture-owner', ownedLeaves: [baseline()[0].ownedLeaves[0]] },
      {
        authorityName: 'authority/fixture-secondary',
        ownedLeaves: [baseline()[0].ownedLeaves[1], ...baseline()[1].ownedLeaves],
      },
    ];
    expect(await definitionDigest(reassigned)).not.toBe(reference);

    // Renaming an authority is an executable model change.
    const renamed = baseline().map((definition, index) =>
      index === 0 ? { ...definition, authorityName: 'authority/fixture-renamed' } : definition);
    expect(await definitionDigest(renamed)).not.toBe(reference);
  });

  it('CV-OWN-002 derives leaf validation from the committed grammar', () => {
    const compiled = compileMutationAuthorityRegistry(baseline());
    const counterPath = leafPath(COUNTERS, text('observer/a'));
    const membershipPath = leafPath(MEMBERSHIP, text('member/a'));

    expect(() => compiled.registry.validateNewValue(counterPath, unsigned(3n))).not.toThrow();
    expect(stateCode(() => compiled.registry.validateNewValue(counterPath, true))).toBe('INVALID_VALUE');

    expect(() => compiled.registry.validateNewValue(membershipPath, true)).not.toThrow();
    expect(stateCode(() => compiled.registry.validateNewValue(membershipPath, unsigned(1n))))
      .toBe('INVALID_VALUE');

    // Removal permission comes from the leaf family, not the authority: one authority owns both a
    // non-removable counter and removable membership without contradiction.
    expect(stateCode(() => compiled.registry.validateRemoval(counterPath))).toBe('REMOVE_FORBIDDEN');
    expect(() => compiled.registry.validateRemoval(membershipPath)).not.toThrow();

    // The validator is a function of the committed tag, so it cannot drift from the definition.
    expect(() => leafValueValidator({ kind: 'membership-marker' })(true)).not.toThrow();
    expect(() => leafValueValidator({ kind: 'membership-marker' })(unsigned(1n))).toThrow();
    expect(() => leafValueValidator({ kind: 'canonical-record', recordTypeId: 236n })(unsigned(1n)))
      .toThrow();
  });

  it('CV-OWN-002 validates a whole authoritative state through the registered leaves', () => {
    const compiled = compileMutationAuthorityRegistry(baseline());
    const legal = new AuthoritativeState([
      { path: leafPath(COUNTERS, text('observer/a')), value: unsigned(2n) },
      { path: leafPath(MEMBERSHIP, text('member/a')), value: true },
    ]);
    expect(() => compiled.registry.validateState(legal)).not.toThrow();

    const illegal = new AuthoritativeState([
      { path: leafPath(COUNTERS, text('observer/a')), value: unsigned(2n) },
      { path: leafPath(family(999n, 1n), text('x')), value: unsigned(1n) },
    ]);
    expect(stateCode(() => compiled.registry.validateState(illegal))).toBe('ILLEGAL_WRITE');
  });
});
