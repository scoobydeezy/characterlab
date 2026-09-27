import { describe, expect, it } from 'vitest';
import { bytesToHex, canonicalEncode, list, signed, text, typedIdentifier, type CanonicalValue } from '../substrate/canonicalEncoding';
import {
  AuthoritativeState,
  ContractReadProjection,
  StateAuthorityRegistry,
  StateContractError,
  actualReadRecordValue,
  applyStatePatch,
  createStatePatch,
  mutationDiffValue,
  statePatchValue,
  type StatePath,
  type StatePathPattern,
} from '../substrate/state';

const entity = typedIdentifier(20000n, text('character/alex'));
const otherEntity = typedIdentifier(20000n, text('character/blair'));
const authority = typedIdentifier(20001n, text('authority/traits'));
const wrongAuthority = typedIdentifier(20001n, text('authority/memory'));
const accessStrength = typedIdentifier(20002n, text('accessor/strength'));
const accessSum = typedIdentifier(20002n, text('accessor/strength-plus-focus'));
const transformSum = typedIdentifier(20003n, text('transform/exact-sum'));

const traitPath = (target = entity, fieldId = 1n): StatePath => ({
  rootStateTypeId: 1n,
  fieldId,
  selectors: [{ kind: 'typedEntity', id: target }],
});
const traitFamily = (fieldId = 1n): StatePathPattern => ({
  rootStateTypeId: 1n,
  fieldId,
  selectors: [{ kind: 'wildcard', selectorKind: 'typedEntity' }],
});
const validateSigned = (value: CanonicalValue): void => {
  if (typeof value === 'boolean' || value.kind !== 'signed') throw new Error('expected a signed exact integer');
};
const registry = () => new StateAuthorityRegistry(
  [
    { pattern: traitFamily(1n), validateValue: validateSigned, removalAllowed: false },
    { pattern: traitFamily(2n), validateValue: validateSigned, removalAllowed: true },
  ],
  [{ mutationAuthorityId: authority, patterns: [traitFamily(1n), traitFamily(2n)] }],
);
const initialState = () => new AuthoritativeState([
  { path: traitPath(entity, 1n), value: signed(4n) },
  { path: traitPath(entity, 2n), value: signed(3n) },
  { path: traitPath(otherEntity, 1n), value: signed(7n) },
]);
const hex = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));

describe('Campaign 0E ownership and read-domain contracts', () => {
  it('CV-OWN-001 rejects ownership overlap and uncovered writable families', () => {
    expect(() => new StateAuthorityRegistry(
      [{ pattern: traitFamily(), validateValue: validateSigned, removalAllowed: false }],
      [
        { mutationAuthorityId: authority, patterns: [traitFamily()] },
        { mutationAuthorityId: wrongAuthority, patterns: [traitFamily()] },
      ],
    )).toThrowError(expect.objectContaining({ code: 'OWNERSHIP_OVERLAP' }));

    expect(() => new StateAuthorityRegistry(
      [
        { pattern: traitFamily(1n), validateValue: validateSigned, removalAllowed: false },
        { pattern: traitFamily(2n), validateValue: validateSigned, removalAllowed: false },
      ],
      [{ mutationAuthorityId: authority, patterns: [traitFamily(1n)] }],
    )).toThrowError(expect.objectContaining({ code: 'UNCOVERED_WRITABLE_PATH' }));

    expect(() => registry()).not.toThrow();
  });

  it('CV-READ-001 rejects bindings and forged accessors outside the declared interface', () => {
    expect(() => new ContractReadProjection(initialState(), [traitFamily(1n)], {
      forbidden: { kind: 'direct', accessorId: accessStrength, path: traitPath(entity, 2n) },
    })).toThrowError(expect.objectContaining({ code: 'ILLEGAL_READ' }));

    const projection = new ContractReadProjection(initialState(), [traitFamily(1n)], {
      strength: { kind: 'direct', accessorId: accessStrength, path: traitPath(entity, 1n) },
    });
    expect(() => projection.read('forged' as 'strength')).toThrowError(expect.objectContaining({ code: 'UNKNOWN_ACCESSOR' }));
  });

  it('CV-READ-002 records only actual reads and preserves derived-source provenance', () => {
    const projection = new ContractReadProjection(initialState(), [traitFamily(1n), traitFamily(2n)], {
      unused: { kind: 'direct', accessorId: accessStrength, path: traitPath(otherEntity, 1n) },
      sum: {
        kind: 'derived', accessorId: accessSum, projectionPath: traitPath(entity, 1n),
        sourcePaths: [traitPath(entity, 1n), traitPath(entity, 2n)], transformationId: transformSum,
        derive: (sources) => signed(signedValue(sources[0].value!) + signedValue(sources[1].value!)),
      },
    });
    expect(projection.read('sum')).toEqual(signed(7n));
    const reads = projection.actualReadRecords();
    expect(reads).toHaveLength(1);
    expect(reads[0].derivedSources).toHaveLength(2);
    expect(reads[0].transformationId).toEqual(transformSum);
    expect(() => canonicalEncode(actualReadRecordValue(reads[0]))).not.toThrow();
  });
});

describe('Campaign 0E canonical patches', () => {
  it('CV-PATCH-001 canonicalizes construction order and emits exact structural diffs', () => {
    const operations = [
      { kind: 'set' as const, path: traitPath(entity, 2n), expected: { presence: true as const, value: signed(3n) }, newValue: signed(6n) },
      { kind: 'set' as const, path: traitPath(entity, 1n), expected: { presence: true as const, value: signed(4n) }, newValue: signed(5n) },
    ];
    const forward = createStatePatch(operations);
    const reverse = createStatePatch([...operations].reverse());
    expect(hex(statePatchValue(forward))).toBe(hex(statePatchValue(reverse)));
    const left = applyStatePatch(initialState(), forward, authority, registry());
    const right = applyStatePatch(initialState(), reverse, authority, registry());
    expect(hex(left.state.canonicalValue())).toBe(hex(right.state.canonicalValue()));
    expect(left.diffs.map((diff) => hex(mutationDiffValue(diff))))
      .toEqual(right.diffs.map((diff) => hex(mutationDiffValue(diff))));
    expect(left.state.read(traitPath(entity, 1n)).value).toEqual(signed(5n));
  });

  it('CV-PATCH-002 rejects authority, precondition, overlap, domain, and mutable-alias failures', () => {
    const legal = createStatePatch([{ kind: 'set', path: traitPath(), expected: { presence: true, value: signed(4n) }, newValue: signed(5n) }]);
    expect(() => applyStatePatch(initialState(), legal, wrongAuthority, registry()))
      .toThrowError(expect.objectContaining({ code: 'UNKNOWN_AUTHORITY' }));
    expect(() => applyStatePatch(initialState(), createStatePatch([
      { kind: 'set', path: traitPath(), expected: { presence: true, value: signed(99n) }, newValue: signed(5n) },
    ]), authority, registry())).toThrowError(expect.objectContaining({ code: 'STALE_PRECONDITION' }));
    expect(() => createStatePatch([
      { kind: 'set', path: traitPath(), expected: { presence: true, value: signed(4n) }, newValue: signed(5n) },
      { kind: 'set', path: traitPath(), expected: { presence: true, value: signed(4n) }, newValue: signed(6n) },
    ])).toThrowError(expect.objectContaining({ code: 'PATCH_OVERLAP' }));
    expect(() => applyStatePatch(initialState(), createStatePatch([
      { kind: 'set', path: traitPath(), expected: { presence: true, value: signed(4n) }, newValue: text('invalid') },
    ]), authority, registry())).toThrowError(expect.objectContaining({ code: 'INVALID_VALUE' }));

    const mutable = list([text('before')]) as Extract<CanonicalValue, { kind: 'list' }>;
    const patch = createStatePatch([{ kind: 'set', path: traitPath(), expected: { presence: true, value: signed(4n) }, newValue: mutable }]);
    (mutable.items as CanonicalValue[])[0] = text('after');
    expect(hex(statePatchValue(patch))).toContain(bytesToHex(new TextEncoder().encode('before')));
  });

  it('CV-PATCH-003 isolates deep counterfactual copies and encodings', () => {
    const base = new AuthoritativeState([{ path: traitPath(), value: list([text('stable')]) }]);
    const counterfactual = new AuthoritativeState(base.entries());
    const before = hex(base.canonicalValue());
    const permissive = new StateAuthorityRegistry(
      [{ pattern: traitFamily(), validateValue: () => undefined, removalAllowed: false }],
      [{ mutationAuthorityId: authority, patterns: [traitFamily()] }],
    );
    const changed = applyStatePatch(counterfactual, createStatePatch([
      { kind: 'set', path: traitPath(), expected: { presence: true, value: list([text('stable')]) }, newValue: list([text('changed')]) },
    ]), authority, permissive).state;
    expect(hex(base.canonicalValue())).toBe(before);
    expect(hex(changed.canonicalValue())).not.toBe(before);
  });
});

function signedValue(value: CanonicalValue): bigint {
  if (typeof value === 'boolean' || value.kind !== 'signed') throw new StateContractError('INVALID_VALUE', 'expected signed value');
  return value.value;
}
