import {
  bytesToHex,
  canonicalEncode,
  cloneCanonicalValue,
  list,
  record,
  set,
  text,
  unsigned,
  type CanonicalValue,
  type RecordSchema,
  type TypedIdentifierValue,
} from './canonicalEncoding';

export const STATE_CONTRACT_VERSION = 'state/0.2-candidate' as const;

export const stateSchemas = {
  statePath: schema(140n, 'StatePath', ['RootStateTypeId', 'FieldId', 'Selectors']),
  typedEntitySelector: schema(141n, 'TypedEntitySelector', ['TypedEntityId']),
  canonicalMapKeySelector: schema(142n, 'CanonicalMapKeySelector', ['CanonicalMapKey']),
  stableListItemSelector: schema(143n, 'StableListItemSelector', ['StableListItemId']),
  statePatch: schema(144n, 'StatePatch', ['Operations']),
  setOperation: schema(145n, 'SetPatchOperation', ['Path', 'ExpectedPresence', 'ExpectedOldValue', 'NewValue']),
  removeOperation: schema(146n, 'RemovePatchOperation', ['Path', 'ExpectedOldValue']),
  actualReadRecord: schema(147n, 'ActualReadRecord', ['AccessorId', 'Path', 'Presence', 'Value', 'DerivedSources', 'TransformationId']),
  mutationDiff: schema(148n, 'StructuralMutationDiff', ['Path', 'OldPresence', 'OldValue', 'NewPresence', 'NewValue', 'MutationAuthorityId']),
  pathPattern: schema(149n, 'StatePathPattern', ['RootStateTypeId', 'FieldId', 'SelectorPatterns']),
  selectorWildcard: schema(150n, 'SelectorWildcard', ['SelectorKind']),
  stateLeaf: schema(151n, 'StateLeaf', ['Path', 'Value']),
} as const;

export type StateSelector =
  | { readonly kind: 'typedEntity'; readonly id: TypedIdentifierValue }
  | { readonly kind: 'mapKey'; readonly key: CanonicalValue }
  | { readonly kind: 'stableListItem'; readonly id: TypedIdentifierValue };

export interface StatePath {
  readonly rootStateTypeId: bigint;
  readonly fieldId: bigint;
  readonly selectors: readonly StateSelector[];
}

export type SelectorKind = StateSelector['kind'];
export type SelectorPattern =
  | { readonly kind: 'wildcard'; readonly selectorKind: SelectorKind }
  | { readonly kind: 'exact'; readonly selector: StateSelector };

export interface StatePathPattern {
  readonly rootStateTypeId: bigint;
  readonly fieldId: bigint;
  readonly selectors: readonly SelectorPattern[];
}

export interface WritableLeafDeclaration {
  readonly pattern: StatePathPattern;
  readonly validateValue: (value: CanonicalValue) => void;
  readonly removalAllowed: boolean;
}

export interface MutationAuthorityDeclaration {
  readonly mutationAuthorityId: TypedIdentifierValue;
  readonly patterns: readonly StatePathPattern[];
}

export type PatchOperation = SetPatchOperation | RemovePatchOperation;

export interface SetPatchOperation {
  readonly kind: 'set';
  readonly path: StatePath;
  readonly expected: { readonly presence: false } | { readonly presence: true; readonly value: CanonicalValue };
  readonly newValue: CanonicalValue;
}

export interface RemovePatchOperation {
  readonly kind: 'remove';
  readonly path: StatePath;
  readonly expectedOldValue: CanonicalValue;
}

export interface StatePatch {
  readonly operations: readonly PatchOperation[];
}

export interface StructuralMutationDiff {
  readonly path: StatePath;
  readonly oldPresence: boolean;
  readonly oldValue?: CanonicalValue;
  readonly newPresence: boolean;
  readonly newValue?: CanonicalValue;
  readonly mutationAuthorityId: TypedIdentifierValue;
}

export interface ActualReadRecord {
  readonly accessorId: TypedIdentifierValue;
  readonly path: StatePath;
  readonly presence: boolean;
  readonly value?: CanonicalValue;
  readonly derivedSources: readonly { readonly path: StatePath; readonly presence: boolean; readonly value?: CanonicalValue }[];
  readonly transformationId?: TypedIdentifierValue;
}

export type ProjectionBinding = DirectProjectionBinding | DerivedProjectionBinding;

export interface DirectProjectionBinding {
  readonly kind: 'direct';
  readonly accessorId: TypedIdentifierValue;
  readonly path: StatePath;
}

export interface DerivedProjectionBinding {
  readonly kind: 'derived';
  readonly accessorId: TypedIdentifierValue;
  readonly projectionPath: StatePath;
  readonly sourcePaths: readonly StatePath[];
  readonly transformationId: TypedIdentifierValue;
  readonly derive: (sources: readonly StateReadValue[]) => CanonicalValue;
}

export interface StateReadValue {
  readonly path: StatePath;
  readonly presence: boolean;
  readonly value?: CanonicalValue;
}

export class StateContractError extends Error {
  constructor(readonly code: StateFailureCode, message: string) {
    super(message);
    this.name = 'StateContractError';
  }
}

export type StateFailureCode =
  | 'INVALID_PATH'
  | 'OWNERSHIP_OVERLAP'
  | 'UNCOVERED_WRITABLE_PATH'
  | 'UNKNOWN_AUTHORITY'
  | 'ILLEGAL_READ'
  | 'ILLEGAL_WRITE'
  | 'STALE_PRECONDITION'
  | 'PATCH_OVERLAP'
  | 'INVALID_VALUE'
  | 'REMOVE_FORBIDDEN'
  | 'UNKNOWN_ACCESSOR';

export class AuthoritativeState {
  readonly #entries: ReadonlyMap<string, { readonly path: StatePath; readonly value: CanonicalValue }>;

  constructor(entries: readonly { readonly path: StatePath; readonly value: CanonicalValue }[]) {
    const stored = new Map<string, { path: StatePath; value: CanonicalValue }>();
    for (const entry of entries) {
      validatePath(entry.path);
      const key = statePathKey(entry.path);
      if (stored.has(key)) stateFail('INVALID_PATH', 'duplicate concrete state path');
      stored.set(key, { path: cloneStatePath(entry.path), value: cloneCanonicalValue(entry.value) });
    }
    this.#entries = stored;
  }

  read(path: StatePath): StateReadValue {
    validatePath(path);
    const entry = this.#entries.get(statePathKey(path));
    return entry
      ? { path: cloneStatePath(path), presence: true, value: cloneCanonicalValue(entry.value) }
      : { path: cloneStatePath(path), presence: false };
  }

  entries(): readonly { readonly path: StatePath; readonly value: CanonicalValue }[] {
    return [...this.#entries.values()].map((entry) => ({ path: cloneStatePath(entry.path), value: cloneCanonicalValue(entry.value) }));
  }

  canonicalValue(): CanonicalValue {
    return set(this.entries().map((entry) => requiredRecord(stateSchemas.stateLeaf, [statePathValue(entry.path), entry.value])));
  }

  withEntries(entries: readonly { readonly path: StatePath; readonly value: CanonicalValue }[]): AuthoritativeState {
    return new AuthoritativeState(entries);
  }
}

export class StateAuthorityRegistry {
  readonly #writable: readonly WritableLeafDeclaration[];
  readonly #authorities: readonly MutationAuthorityDeclaration[];

  constructor(writable: readonly WritableLeafDeclaration[], authorities: readonly MutationAuthorityDeclaration[]) {
    this.#writable = [...writable];
    this.#authorities = [...authorities];
    for (const declaration of writable) validatePattern(declaration.pattern);
    for (let left = 0; left < writable.length; left += 1) {
      for (let right = left + 1; right < writable.length; right += 1) {
        if (patternsIntersect(writable[left].pattern, writable[right].pattern)) {
          stateFail('INVALID_PATH', 'writable leaf declarations overlap');
        }
      }
    }
    for (const authority of authorities) {
      for (const pattern of authority.patterns) validatePattern(pattern);
    }
    const authorityPatterns = authorities.flatMap((authority) => authority.patterns.map((pattern) => ({ authority, pattern })));
    for (let left = 0; left < authorityPatterns.length; left += 1) {
      for (let right = left + 1; right < authorityPatterns.length; right += 1) {
        if (patternsIntersect(authorityPatterns[left].pattern, authorityPatterns[right].pattern)) {
          stateFail('OWNERSHIP_OVERLAP', 'mutation-authority patterns overlap; most-specific resolution is forbidden');
        }
      }
    }
    for (const leaf of writable) {
      const covering = authorityPatterns.filter(({ pattern }) => patternCovers(pattern, leaf.pattern));
      if (covering.length !== 1) stateFail('UNCOVERED_WRITABLE_PATH', 'every writable leaf family must be covered by exactly one authority');
    }
    for (const { pattern } of authorityPatterns) {
      if (!writable.some((leaf) => patternCovers(leaf.pattern, pattern))) {
        stateFail('ILLEGAL_WRITE', 'mutation authority claims paths outside the writable schema');
      }
    }
  }

  validateState(state: AuthoritativeState): void {
    for (const entry of state.entries()) this.validateNewValue(entry.path, entry.value);
  }

  validateNewValue(path: StatePath, value: CanonicalValue): void {
    const declaration = this.#writable.find((leaf) => patternMatches(leaf.pattern, path));
    if (!declaration) stateFail('ILLEGAL_WRITE', 'path is not a declared writable leaf');
    try {
      canonicalEncode(value);
      declaration.validateValue(value);
    } catch (error) {
      if (error instanceof StateContractError) throw error;
      stateFail('INVALID_VALUE', error instanceof Error ? error.message : String(error));
    }
  }

  validateRemoval(path: StatePath): void {
    const declaration = this.#writable.find((leaf) => patternMatches(leaf.pattern, path));
    if (!declaration) stateFail('ILLEGAL_WRITE', 'path is not a declared writable leaf');
    if (!declaration.removalAllowed) stateFail('REMOVE_FORBIDDEN', 'owning schema forbids removing this leaf');
  }

  validateAuthority(authorityId: TypedIdentifierValue, path: StatePath): void {
    const authority = this.#authorities.find((candidate) => equalCanonical(candidate.mutationAuthorityId, authorityId));
    if (!authority) stateFail('UNKNOWN_AUTHORITY', 'mutation authority is not registered');
    if (!authority.patterns.some((pattern) => patternMatches(pattern, path))) {
      stateFail('ILLEGAL_WRITE', 'mutation authority does not own the proposed path');
    }
  }
}

export class ContractReadProjection<Bindings extends Readonly<Record<string, ProjectionBinding>>> {
  readonly #state: AuthoritativeState;
  readonly #bindings: Bindings;
  readonly #actualReads: ActualReadRecord[] = [];

  constructor(state: AuthoritativeState, readDomain: readonly StatePathPattern[], bindings: Bindings) {
    this.#state = state;
    this.#bindings = bindings;
    for (const binding of Object.values(bindings)) {
      const paths = binding.kind === 'direct' ? [binding.path] : [binding.projectionPath, ...binding.sourcePaths];
      for (const path of paths) {
        if (!readDomain.some((pattern) => patternMatches(pattern, path))) {
          stateFail('ILLEGAL_READ', 'projection binding requests a path outside its registered ReadDomain');
        }
      }
    }
  }

  read<Key extends keyof Bindings & string>(key: Key): CanonicalValue | undefined {
    const binding = this.#bindings[key];
    if (!binding) stateFail('UNKNOWN_ACCESSOR', 'forged or undeclared projection accessor');
    if (binding.kind === 'direct') {
      const read = this.#state.read(binding.path);
      this.#actualReads.push({
        accessorId: binding.accessorId,
        path: read.path,
        presence: read.presence,
        value: read.value,
        derivedSources: [],
      });
      return read.value === undefined ? undefined : cloneCanonicalValue(read.value);
    }
    const sources = binding.sourcePaths.map((path) => this.#state.read(path));
    const derived = cloneCanonicalValue(binding.derive(sources.map(cloneStateRead)));
    this.#actualReads.push({
      accessorId: binding.accessorId,
      path: cloneStatePath(binding.projectionPath),
      presence: true,
      value: derived,
      derivedSources: sources.map(cloneStateRead),
      transformationId: binding.transformationId,
    });
    return cloneCanonicalValue(derived);
  }

  actualReadRecords(): readonly ActualReadRecord[] {
    return this.#actualReads.map(cloneActualRead);
  }
}

export function createStatePatch(operations: readonly PatchOperation[]): StatePatch {
  const cloned = operations.map(cloneOperation);
  cloned.sort((left, right) => compareBytes(canonicalEncode(statePathValue(left.path)), canonicalEncode(statePathValue(right.path))));
  for (let left = 0; left < cloned.length; left += 1) {
    for (let right = left + 1; right < cloned.length; right += 1) {
      if (pathsOverlap(cloned[left].path, cloned[right].path)) {
        stateFail('PATCH_OVERLAP', 'patch contains duplicate or ancestor/descendant paths');
      }
    }
  }
  return { operations: cloned };
}

export function applyStatePatch(
  state: AuthoritativeState,
  patch: StatePatch,
  mutationAuthorityId: TypedIdentifierValue,
  registry: StateAuthorityRegistry,
): { readonly state: AuthoritativeState; readonly diffs: readonly StructuralMutationDiff[] } {
  patch = createStatePatch(patch.operations);
  const entries = new Map(state.entries().map((entry) => [statePathKey(entry.path), entry]));
  const diffs: StructuralMutationDiff[] = [];
  for (const operation of patch.operations) {
    registry.validateAuthority(mutationAuthorityId, operation.path);
    const key = statePathKey(operation.path);
    const old = entries.get(key);
    if (operation.kind === 'set') {
      if (operation.expected.presence !== Boolean(old)) stateFail('STALE_PRECONDITION', 'set presence precondition does not match staged state');
      if (operation.expected.presence && (!old || !equalCanonical(old.value, operation.expected.value))) {
        stateFail('STALE_PRECONDITION', 'set value precondition does not match staged state');
      }
      registry.validateNewValue(operation.path, operation.newValue);
      const newValue = cloneCanonicalValue(operation.newValue);
      entries.set(key, { path: cloneStatePath(operation.path), value: newValue });
      diffs.push({
        path: cloneStatePath(operation.path),
        oldPresence: Boolean(old),
        oldValue: old && cloneCanonicalValue(old.value),
        newPresence: true,
        newValue: cloneCanonicalValue(newValue),
        mutationAuthorityId,
      });
    } else {
      if (!old || !equalCanonical(old.value, operation.expectedOldValue)) {
        stateFail('STALE_PRECONDITION', 'remove precondition does not match staged state');
      }
      registry.validateRemoval(operation.path);
      entries.delete(key);
      diffs.push({
        path: cloneStatePath(operation.path),
        oldPresence: true,
        oldValue: cloneCanonicalValue(old.value),
        newPresence: false,
        mutationAuthorityId,
      });
    }
  }
  const next = new AuthoritativeState([...entries.values()]);
  verifyDiffs(state, next, diffs);
  return { state: next, diffs };
}

export function statePathValue(path: StatePath): CanonicalValue {
  validatePath(path);
  return requiredRecord(stateSchemas.statePath, [
    unsigned(path.rootStateTypeId),
    unsigned(path.fieldId),
    list(path.selectors.map(selectorValue)),
  ]);
}

export function restoreAuthoritativeState(value: CanonicalValue): AuthoritativeState {
  if (typeof value === 'boolean' || value.kind !== 'set') stateFail('INVALID_VALUE', 'authoritative state must be a canonical set of StateLeaf records');
  return new AuthoritativeState(value.items.map((item) => {
    const leaf = requireRecord(item, stateSchemas.stateLeaf);
    return { path: restoreStatePath(requireField(leaf, 1n)), value: cloneCanonicalValue(requireField(leaf, 2n)) };
  }));
}

export function restoreStatePath(value: CanonicalValue): StatePath {
  const path = requireRecord(value, stateSchemas.statePath);
  const root = requireUnsigned(requireField(path, 1n));
  const field = requireUnsigned(requireField(path, 2n));
  const selectors = requireList(requireField(path, 3n)).map((selectorValue) => {
    const selector = requireAnyRecord(selectorValue);
    if (sameSchema(selector.schema, stateSchemas.typedEntitySelector)) {
      return { kind: 'typedEntity' as const, id: requireTypedIdentifier(requireField(selector, 1n)) };
    }
    if (sameSchema(selector.schema, stateSchemas.canonicalMapKeySelector)) {
      return { kind: 'mapKey' as const, key: cloneCanonicalValue(requireField(selector, 1n)) };
    }
    if (sameSchema(selector.schema, stateSchemas.stableListItemSelector)) {
      return { kind: 'stableListItem' as const, id: requireTypedIdentifier(requireField(selector, 1n)) };
    }
    stateFail('INVALID_PATH', 'unknown StatePath selector schema');
  });
  return { rootStateTypeId: root, fieldId: field, selectors };
}

export function statePathPatternValue(pattern: StatePathPattern): CanonicalValue {
  validatePattern(pattern);
  return requiredRecord(stateSchemas.pathPattern, [
    unsigned(pattern.rootStateTypeId),
    unsigned(pattern.fieldId),
    list(pattern.selectors.map((selector) => selector.kind === 'exact'
      ? selectorValue(selector.selector)
      : requiredRecord(stateSchemas.selectorWildcard, [text(selector.selectorKind)]))),
  ]);
}

export function statePatchValue(patch: StatePatch): CanonicalValue {
  return requiredRecord(stateSchemas.statePatch, [list(patch.operations.map((operation) => {
    if (operation.kind === 'set') {
      return requiredRecord(stateSchemas.setOperation, [
        statePathValue(operation.path),
        operation.expected.presence,
        operation.expected.presence ? operation.expected.value : false,
        operation.newValue,
      ]);
    }
    return requiredRecord(stateSchemas.removeOperation, [statePathValue(operation.path), operation.expectedOldValue]);
  }))]);
}

export function actualReadRecordValue(read: ActualReadRecord): CanonicalValue {
  return requiredRecord(stateSchemas.actualReadRecord, [
    read.accessorId,
    statePathValue(read.path),
    read.presence,
    read.presence ? read.value ?? false : false,
    list(read.derivedSources.map((source) => list([
      statePathValue(source.path),
      source.presence,
      source.presence ? source.value ?? false : false,
    ]))),
    read.transformationId ?? false,
  ]);
}

export function mutationDiffValue(diff: StructuralMutationDiff): CanonicalValue {
  return requiredRecord(stateSchemas.mutationDiff, [
    statePathValue(diff.path),
    diff.oldPresence,
    diff.oldPresence ? diff.oldValue ?? false : false,
    diff.newPresence,
    diff.newPresence ? diff.newValue ?? false : false,
    diff.mutationAuthorityId,
  ]);
}

export function patternMatches(pattern: StatePathPattern, path: StatePath): boolean {
  if (pattern.rootStateTypeId !== path.rootStateTypeId || pattern.fieldId !== path.fieldId) return false;
  if (pattern.selectors.length > path.selectors.length) return false;
  return pattern.selectors.every((selectorPattern, index) => {
    const selector = path.selectors[index];
    return selectorPattern.kind === 'wildcard'
      ? selectorPattern.selectorKind === selector.kind
      : equalSelector(selectorPattern.selector, selector);
  });
}

function selectorValue(selector: StateSelector): CanonicalValue {
  switch (selector.kind) {
    case 'typedEntity': return requiredRecord(stateSchemas.typedEntitySelector, [selector.id]);
    case 'mapKey': return requiredRecord(stateSchemas.canonicalMapKeySelector, [selector.key]);
    case 'stableListItem': return requiredRecord(stateSchemas.stableListItemSelector, [selector.id]);
  }
}

function validatePath(path: StatePath): void {
  if (typeof path.rootStateTypeId !== 'bigint' || typeof path.fieldId !== 'bigint'
    || path.rootStateTypeId < 0n || path.fieldId < 0n) stateFail('INVALID_PATH', 'state root and field IDs must be nonnegative exact integers');
  for (const selector of path.selectors) canonicalEncode(selectorValue(selector));
}

function validatePattern(pattern: StatePathPattern): void {
  if (pattern.rootStateTypeId < 0n || pattern.fieldId < 0n) stateFail('INVALID_PATH', 'pattern IDs must be nonnegative');
  for (const selector of pattern.selectors) {
    if (selector.kind === 'exact') canonicalEncode(selectorValue(selector.selector));
    else if (!['typedEntity', 'mapKey', 'stableListItem'].includes(selector.selectorKind)) stateFail('INVALID_PATH', 'unknown selector wildcard kind');
  }
}

function patternCovers(container: StatePathPattern, contained: StatePathPattern): boolean {
  if (container.rootStateTypeId !== contained.rootStateTypeId || container.fieldId !== contained.fieldId) return false;
  if (container.selectors.length > contained.selectors.length) return false;
  return container.selectors.every((candidate, index) => {
    const target = contained.selectors[index];
    if (candidate.kind === 'wildcard') {
      return target.kind === 'wildcard'
        ? candidate.selectorKind === target.selectorKind
        : candidate.selectorKind === target.selector.kind;
    }
    return target.kind === 'exact' && equalSelector(candidate.selector, target.selector);
  });
}

function patternsIntersect(left: StatePathPattern, right: StatePathPattern): boolean {
  if (left.rootStateTypeId !== right.rootStateTypeId || left.fieldId !== right.fieldId) return false;
  const shared = Math.min(left.selectors.length, right.selectors.length);
  for (let index = 0; index < shared; index += 1) {
    const a = left.selectors[index];
    const b = right.selectors[index];
    if (a.kind === 'exact' && b.kind === 'exact' && !equalSelector(a.selector, b.selector)) return false;
    if (a.kind === 'wildcard' && b.kind === 'wildcard' && a.selectorKind !== b.selectorKind) return false;
    if (a.kind === 'wildcard' && b.kind === 'exact' && a.selectorKind !== b.selector.kind) return false;
    if (a.kind === 'exact' && b.kind === 'wildcard' && a.selector.kind !== b.selectorKind) return false;
  }
  return true;
}

function pathsOverlap(left: StatePath, right: StatePath): boolean {
  if (left.rootStateTypeId !== right.rootStateTypeId || left.fieldId !== right.fieldId) return false;
  const shared = Math.min(left.selectors.length, right.selectors.length);
  for (let index = 0; index < shared; index += 1) if (!equalSelector(left.selectors[index], right.selectors[index])) return false;
  return true;
}

function equalSelector(left: StateSelector, right: StateSelector): boolean {
  return left.kind === right.kind && equalCanonical(selectorValue(left), selectorValue(right));
}

function verifyDiffs(before: AuthoritativeState, after: AuthoritativeState, diffs: readonly StructuralMutationDiff[]): void {
  for (const diff of diffs) {
    const oldRead = before.read(diff.path);
    const newRead = after.read(diff.path);
    if (oldRead.presence !== diff.oldPresence || newRead.presence !== diff.newPresence
      || (oldRead.presence && !equalCanonical(oldRead.value!, diff.oldValue!))
      || (newRead.presence && !equalCanonical(newRead.value!, diff.newValue!))) {
      stateFail('INVALID_VALUE', 'derived structural diff does not match pre/post state');
    }
  }
}

function cloneOperation(operation: PatchOperation): PatchOperation {
  return operation.kind === 'set'
    ? {
      kind: 'set', path: cloneStatePath(operation.path),
      expected: operation.expected.presence
        ? { presence: true, value: cloneCanonicalValue(operation.expected.value) }
        : { presence: false },
      newValue: cloneCanonicalValue(operation.newValue),
    }
    : { kind: 'remove', path: cloneStatePath(operation.path), expectedOldValue: cloneCanonicalValue(operation.expectedOldValue) };
}

function cloneStatePath(path: StatePath): StatePath {
  return {
    rootStateTypeId: path.rootStateTypeId,
    fieldId: path.fieldId,
    selectors: path.selectors.map((selector) => selector.kind === 'mapKey'
      ? { kind: 'mapKey', key: cloneCanonicalValue(selector.key) }
      : { kind: selector.kind, id: cloneCanonicalValue(selector.id) as TypedIdentifierValue }),
  };
}

function cloneStateRead(read: StateReadValue): StateReadValue {
  return { path: cloneStatePath(read.path), presence: read.presence, value: read.value && cloneCanonicalValue(read.value) };
}

function cloneActualRead(read: ActualReadRecord): ActualReadRecord {
  return {
    ...read,
    accessorId: cloneCanonicalValue(read.accessorId) as TypedIdentifierValue,
    path: cloneStatePath(read.path),
    value: read.value && cloneCanonicalValue(read.value),
    derivedSources: read.derivedSources.map(cloneStateRead),
    transformationId: read.transformationId && cloneCanonicalValue(read.transformationId) as TypedIdentifierValue,
  };
}

function statePathKey(path: StatePath): string {
  return bytesToHex(canonicalEncode(statePathValue(path)));
}

function equalCanonical(left: CanonicalValue, right: CanonicalValue): boolean {
  const a = canonicalEncode(left);
  const b = canonicalEncode(right);
  return compareBytes(a, b) === 0;
}

function compareBytes(left: Uint8Array, right: Uint8Array): number {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    if (left[index] !== right[index]) return left[index] < right[index] ? -1 : 1;
  }
  return left.length === right.length ? 0 : left.length < right.length ? -1 : 1;
}

function requiredRecord(target: RecordSchema, values: readonly CanonicalValue[]): CanonicalValue {
  return record(target, new Map(target.fields.map((field, index) => [field.id, values[index]])));
}

type CanonicalRecord = Extract<CanonicalValue, { readonly kind: 'record' }>;

function requireAnyRecord(value: CanonicalValue): CanonicalRecord {
  if (typeof value === 'boolean' || value.kind !== 'record') stateFail('INVALID_VALUE', 'expected canonical record');
  return value;
}

function requireRecord(value: CanonicalValue, expected: RecordSchema): CanonicalRecord {
  const result = requireAnyRecord(value);
  if (!sameSchema(result.schema, expected)) stateFail('INVALID_VALUE', `expected ${expected.name}`);
  return result;
}

function sameSchema(left: RecordSchema, right: RecordSchema): boolean {
  return left.typeId === right.typeId && left.schemaVersion === right.schemaVersion;
}

function requireField(value: CanonicalRecord, fieldId: bigint): CanonicalValue {
  const field = value.fields.get(fieldId);
  if (field === undefined) stateFail('INVALID_VALUE', `missing field ${fieldId}`);
  return field;
}

function requireUnsigned(value: CanonicalValue): bigint {
  if (typeof value === 'boolean' || value.kind !== 'unsigned') stateFail('INVALID_VALUE', 'expected unsigned exact integer');
  return value.value;
}

function requireList(value: CanonicalValue): readonly CanonicalValue[] {
  if (typeof value === 'boolean' || value.kind !== 'list') stateFail('INVALID_VALUE', 'expected canonical list');
  return value.items;
}

function requireTypedIdentifier(value: CanonicalValue): TypedIdentifierValue {
  if (typeof value === 'boolean' || value.kind !== 'typedIdentifier') stateFail('INVALID_VALUE', 'expected typed identifier');
  return cloneCanonicalValue(value) as TypedIdentifierValue;
}

function schema(typeId: bigint, name: string, fieldNames: readonly string[]): RecordSchema {
  return {
    typeId,
    schemaVersion: 1n,
    name,
    fields: fieldNames.map((fieldName, index) => ({ id: BigInt(index + 1), name: fieldName, required: true })),
  };
}

function stateFail(code: StateFailureCode, message: string): never {
  throw new StateContractError(code, message);
}
