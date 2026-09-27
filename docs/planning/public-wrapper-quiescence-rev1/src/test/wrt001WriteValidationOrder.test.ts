import { describe, expect, it } from 'vitest';
import { text, unsigned, type CanonicalValue } from '../substrate/canonicalEncoding';
import {
  compileMutationAuthorityRegistry, mutationAuthorityId,
  type MutationAuthorityDefinition,
} from '../substrate/mutationAuthority';
import {
  AuthoritativeState, StateContractError, applyStatePatch, createStatePatch,
  type StatePath, type StatePathPattern,
} from '../substrate/state';

/**
 * `WRT-001` — write-path validation order.
 *
 * The defect these vectors close: `applyStatePatch` resolved the mutation authority before anything
 * established that the path was writable at all, and one `ILLEGAL_WRITE` code stood for both
 * outcomes. A patch to a path nobody may write reported "this authority does not own it" — naming a
 * relationship to an authority that could not have owned it, because none can — which contradicts
 * `STATE_MODEL.md`'s own first-divergence rule.
 *
 * Every entry point now resolves through one `resolveWritableLeaf` primitive, so they cannot
 * disagree about which divergence comes first.
 */

const family = (rootStateTypeId: bigint, fieldId: bigint): StatePathPattern => ({
  rootStateTypeId, fieldId, selectors: [{ kind: 'wildcard', selectorKind: 'mapKey' }],
});
const leafPath = (pattern: StatePathPattern, key: CanonicalValue): StatePath => ({
  rootStateTypeId: pattern.rootStateTypeId,
  fieldId: pattern.fieldId,
  selectors: [{ kind: 'mapKey', key }],
});

const COUNTERS = family(900n, 1n);
const REMOVABLE = family(900n, 2n);
const UNDECLARED = family(999n, 1n);

const OWNER = 'authority/wrt-owner';
const OTHER = 'authority/wrt-other';

const definitions = (): readonly MutationAuthorityDefinition[] => [
  {
    authorityName: OWNER,
    ownedLeaves: [
      { pattern: COUNTERS, valueGrammar: { kind: 'unsigned-counter' }, removalAllowed: false },
      { pattern: REMOVABLE, valueGrammar: { kind: 'membership-marker' }, removalAllowed: true },
    ],
  },
  { authorityName: OTHER, ownedLeaves: [{ pattern: family(901n, 1n), valueGrammar: { kind: 'unsigned-counter' }, removalAllowed: false }] },
];

const registryOf = () => compileMutationAuthorityRegistry(definitions()).registry;
const code = (run: () => unknown): string | undefined => {
  try { run(); return undefined; } catch (error) {
    return error instanceof StateContractError ? error.code : `unexpected:${String(error)}`;
  }
};

const setOp = (path: StatePath, value: CanonicalValue) => createStatePatch([
  { kind: 'set', path, expected: { presence: false }, newValue: value },
]);

const emptyState = () => new AuthoritativeState([]);

describe('WRT-001 write-path validation order', () => {
  it('W0 — a structurally invalid path still fails structurally, not as unwritable', () => {
    // resolveWritableLeaf must not become the universal bucket for every bad path: the accepted
    // INVALID_PATH-versus-writability distinction has to survive the repair.
    const malformed: StatePath = { rootStateTypeId: -1n, fieldId: 1n, selectors: [] };
    expect(code(() => setOp(malformed, unsigned(1n)))).toBe('INVALID_PATH');
  });

  it('W1 — an undeclared path fails as undeclared, whichever authority is supplied', () => {
    const registry = registryOf();
    const patch = setOp(leafPath(UNDECLARED, text('x')), unsigned(1n));
    for (const authority of [OWNER, OTHER]) {
      expect(code(() => applyStatePatch(emptyState(), patch, mutationAuthorityId(authority), registry)))
        .toBe('UNDECLARED_WRITABLE_PATH');
    }
  });

  it('W2 — declaring the same family writable moves the failure to ownership', () => {
    // The move is the assertion. A control that cannot see it is not testing what it claims.
    const path = leafPath(UNDECLARED, text('x'));
    const patch = setOp(path, unsigned(1n));

    expect(code(() => applyStatePatch(emptyState(), patch, mutationAuthorityId(OTHER), registryOf())))
      .toBe('UNDECLARED_WRITABLE_PATH');

    const declared = compileMutationAuthorityRegistry([
      ...definitions(),
      { authorityName: OWNER + '-extra', ownedLeaves: [{ pattern: UNDECLARED, valueGrammar: { kind: 'unsigned-counter' }, removalAllowed: false }] },
    ]).registry;
    expect(code(() => applyStatePatch(emptyState(), patch, mutationAuthorityId(OTHER), declared)))
      .toBe('NON_OWNING_AUTHORITY');
  });

  it('W3 — the ordering itself is load-bearing, not incidental', () => {
    // Mutation: the pre-repair order resolved authority first. Reproduced inline, because the buggy
    // code no longer exists to call — an undeclared path would have reported ownership.
    const registry = registryOf();
    const path = leafPath(UNDECLARED, text('x'));

    const preRepairOrder = () => {
      registry.validateAuthority(mutationAuthorityId(OTHER), path);   // old step 1
      registry.resolveWritableLeaf(path);                             // old step 2
    };
    expect(code(preRepairOrder)).toBe('NON_OWNING_AUTHORITY');

    const repairedOrder = () => {
      registry.resolveWritableLeaf(path);
      registry.validateAuthority(mutationAuthorityId(OTHER), path);
    };
    expect(code(repairedOrder)).toBe('UNDECLARED_WRITABLE_PATH');
  });

  it('W4 — value and removal failures keep their own existing codes', () => {
    const registry = registryOf();
    const owner = mutationAuthorityId(OWNER);

    const badValue = setOp(leafPath(COUNTERS, text('a')), text('not-a-counter'));
    expect(code(() => applyStatePatch(emptyState(), badValue, owner, registry))).toBe('INVALID_VALUE');

    const seeded = new AuthoritativeState([{ path: leafPath(COUNTERS, text('a')), value: unsigned(1n) }]);
    const forbiddenRemoval = createStatePatch([
      { kind: 'remove', path: leafPath(COUNTERS, text('a')), expectedOldValue: unsigned(1n) },
    ]);
    expect(code(() => applyStatePatch(seeded, forbiddenRemoval, owner, registry))).toBe('REMOVE_FORBIDDEN');
  });

  it('W4a — removal resolves writability without any value to validate', () => {
    // `Remove` carries no proposed value, so discovering writability through value validation was
    // wrong for it by construction. This is the case that motivated the shared primitive.
    const registry = registryOf();
    const patch = createStatePatch([
      { kind: 'remove', path: leafPath(UNDECLARED, text('x')), expectedOldValue: unsigned(1n) },
    ]);
    expect(code(() => applyStatePatch(emptyState(), patch, mutationAuthorityId(OWNER), registry)))
      .toBe('UNDECLARED_WRITABLE_PATH');
  });

  it('W4b — every entry point reports the same first divergence for the same path', () => {
    const registry = registryOf();
    const path = leafPath(UNDECLARED, text('x'));

    const viaPatch = code(() => applyStatePatch(
      emptyState(), setOp(path, unsigned(1n)), mutationAuthorityId(OWNER), registry,
    ));
    const viaValidateState = code(() => registry.validateState(
      new AuthoritativeState([{ path, value: unsigned(1n) }]),
    ));
    const viaResolve = code(() => registry.resolveWritableLeaf(path));
    const viaRemoval = code(() => registry.validateRemoval(path));

    expect(new Set([viaPatch, viaValidateState, viaResolve, viaRemoval]))
      .toEqual(new Set(['UNDECLARED_WRITABLE_PATH']));
  });

  it('W4c — compound faults obey the declared precedence, not the order they are noticed', () => {
    // Independent single-fault cases prove the errors exist; only compound cases prove precedence.
    const registry = registryOf();
    const wrongAuthority = mutationAuthorityId(OTHER);

    // Declared path + wrong authority + invalid value → authority precedes value grammar.
    expect(code(() => applyStatePatch(
      emptyState(), setOp(leafPath(COUNTERS, text('a')), text('not-a-counter')), wrongAuthority, registry,
    ))).toBe('NON_OWNING_AUTHORITY');

    // Undeclared path + wrong authority + invalid value → writability precedes both.
    expect(code(() => applyStatePatch(
      emptyState(), setOp(leafPath(UNDECLARED, text('x')), text('not-a-counter')), wrongAuthority, registry,
    ))).toBe('UNDECLARED_WRITABLE_PATH');
  });

  it('W1a — an unknown authority is still distinct from both new codes', () => {
    const registry = registryOf();
    expect(code(() => applyStatePatch(
      emptyState(), setOp(leafPath(COUNTERS, text('a')), unsigned(1n)),
      mutationAuthorityId('authority/never-registered'), registry,
    ))).toBe('UNKNOWN_AUTHORITY');
  });
});
