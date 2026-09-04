import {
  set, text, typedIdentifier, unsigned,
  type CanonicalValue, type RecordFieldSchema, type RecordSchema, type TypedIdentifierValue,
} from './canonicalEncoding';
import {
  StateAuthorityRegistry, statePathPatternValue,
  type MutationAuthorityDeclaration, type StatePathPattern, type WritableLeafDeclaration,
} from './state';

export const MUTATION_AUTHORITY_CONTRACT_VERSION = 'mutation-authority/0.1-candidate#TRC-001-002-addendum' as const;

/**
 * Global substrate namespace for `MutationAuthorityId`.
 *
 * Campaign 0 (`TRC-001`/`TRC-002`) already accepted "exactly one mutation authority per writable
 * leaf" as a general substrate invariant but allocated no identity namespace for it. This is that
 * missing allocation, appended after the semantic/model maximum `1024 UnionVariantDefinitionId`;
 * `1025..1029` held no accepted allocation, so this renumbers nothing.
 *
 * A `MutationAuthorityId` is a governed semantic/model identity, not a run occurrence: it names an
 * executable ownership role, is committed by registry/model identity, and is stable across every
 * run of a model. Every state family — perception today, belief, memory, regulation, identity,
 * habits, skills and relationships later — uses this one namespace.
 */
export const MUTATION_AUTHORITY_NAMESPACE = 1025n;

const optional = (name: string): readonly [string, false] => [name, false];
type FieldSpec = string | readonly [string, false];

const schema = (typeId: number, name: string, fields: readonly FieldSpec[]): RecordSchema => Object.freeze({
  typeId: BigInt(typeId), schemaVersion: 1n, name,
  fields: Object.freeze(fields.map((field, index): RecordFieldSchema => Object.freeze({
    id: BigInt(index + 1),
    name: typeof field === 'string' ? field : field[0],
    required: typeof field === 'string',
  }))),
});

/** Appended after the accepted state-contract block `140..151`; renumbers nothing. */
export const mutationAuthoritySchemas = {
  leafValueGrammar: schema(152, 'LeafValueGrammar', ['VariantTag', optional('RecordTypeId')]),
  ownedLeafDefinition: schema(153, 'OwnedLeafDefinition', ['Pattern', 'ValueGrammar', 'RemovalAllowed']),
  mutationAuthorityDefinition: schema(154, 'MutationAuthorityDefinition', ['MutationAuthorityId', 'OwnedLeaves']),
  registryDefinition: schema(155, 'MutationAuthorityRegistryDefinition', ['DefinitionVersion', 'Authorities']),
} as const;

/**
 * Closed leaf-value grammar.
 *
 * A leaf's admissible values are declared by a committed tag rather than an anonymous predicate,
 * so the validator is *derived* from registry data and cannot drift from what model identity
 * commits. Widening a leaf therefore always changes the registry digest.
 */
export const LeafValueGrammarTag = Object.freeze({
  UnsignedCounter: 1n,
  MembershipMarker: 2n,
  CanonicalRecord: 3n,
});

export type LeafValueGrammar =
  | { readonly kind: 'unsigned-counter' }
  | { readonly kind: 'membership-marker' }
  | { readonly kind: 'canonical-record'; readonly recordTypeId: bigint };

export interface OwnedLeafDefinition {
  readonly pattern: StatePathPattern;
  readonly valueGrammar: LeafValueGrammar;
  readonly removalAllowed: boolean;
}

export interface MutationAuthorityDefinition {
  /** Governed payload of the typed authority identity, e.g. `authority/perception`. */
  readonly authorityName: string;
  readonly ownedLeaves: readonly OwnedLeafDefinition[];
}

export class MutationAuthorityContractError extends Error {
  constructor(readonly code: 'INVALID_AUTHORITY_ID' | 'INVALID_LEAF_GRAMMAR' | 'DUPLICATE_AUTHORITY', message: string) {
    super(message);
    this.name = 'MutationAuthorityContractError';
  }
}

export function mutationAuthorityId(authorityName: string): TypedIdentifierValue {
  if (!authorityName || authorityName !== authorityName.normalize('NFC')) {
    throw new MutationAuthorityContractError('INVALID_AUTHORITY_ID', 'authority name must be nonempty and NFC-normalized');
  }
  return typedIdentifier(MUTATION_AUTHORITY_NAMESPACE, text(authorityName));
}

/** True only for a typed identifier in the accepted global authority namespace. */
export function isMutationAuthorityId(value: CanonicalValue): boolean {
  return typeof value !== 'boolean'
    && value.kind === 'typedIdentifier'
    && value.namespaceId === MUTATION_AUTHORITY_NAMESPACE;
}

function leafValueGrammarValue(grammar: LeafValueGrammar): CanonicalValue {
  const fields = new Map<bigint, CanonicalValue>();
  switch (grammar.kind) {
    case 'unsigned-counter':
      fields.set(1n, unsigned(LeafValueGrammarTag.UnsignedCounter));
      break;
    case 'membership-marker':
      fields.set(1n, unsigned(LeafValueGrammarTag.MembershipMarker));
      break;
    case 'canonical-record':
      fields.set(1n, unsigned(LeafValueGrammarTag.CanonicalRecord));
      fields.set(2n, unsigned(grammar.recordTypeId));
      break;
    default:
      throw new MutationAuthorityContractError('INVALID_LEAF_GRAMMAR', 'unknown leaf value grammar');
  }
  return { kind: 'record', schema: mutationAuthoritySchemas.leafValueGrammar, fields };
}

/** Derives the executable validator from the committed grammar tag. */
export function leafValueValidator(grammar: LeafValueGrammar): (value: CanonicalValue) => void {
  switch (grammar.kind) {
    case 'unsigned-counter':
      return (value) => {
        if (typeof value === 'boolean' || value.kind !== 'unsigned') {
          throw new Error('leaf requires an unsigned counter value');
        }
      };
    case 'membership-marker':
      return (value) => {
        if (value !== true) throw new Error('leaf membership must be the exact marker true');
      };
    case 'canonical-record':
      return (value) => {
        if (typeof value === 'boolean' || value.kind !== 'record' || value.schema.typeId !== grammar.recordTypeId) {
          throw new Error(`leaf requires a canonical record of type ${grammar.recordTypeId}`);
        }
      };
    default:
      throw new MutationAuthorityContractError('INVALID_LEAF_GRAMMAR', 'unknown leaf value grammar');
  }
}

function ownedLeafValue(leaf: OwnedLeafDefinition): CanonicalValue {
  return {
    kind: 'record',
    schema: mutationAuthoritySchemas.ownedLeafDefinition,
    fields: new Map<bigint, CanonicalValue>([
      [1n, statePathPatternValue(leaf.pattern)],
      [2n, leafValueGrammarValue(leaf.valueGrammar)],
      [3n, leaf.removalAllowed],
    ]),
  };
}

function authorityValue(definition: MutationAuthorityDefinition): CanonicalValue {
  return {
    kind: 'record',
    schema: mutationAuthoritySchemas.mutationAuthorityDefinition,
    fields: new Map<bigint, CanonicalValue>([
      [1n, mutationAuthorityId(definition.authorityName)],
      [2n, set(definition.ownedLeaves.map(ownedLeafValue))],
    ]),
  };
}

/**
 * Canonical, committable definition of a mutation-authority registry.
 *
 * Every fact that alters authoritative execution is inside these bytes: the authority identity,
 * each owned `StatePathPattern`, each leaf's removal permission, and each leaf's value grammar.
 * Commit this into the registry manifest so that changing ownership, removal permission, or leaf
 * value admissibility changes `RegistryIdentity`/`ModelIdentity` rather than silently altering
 * behaviour. Authorities and leaves encode as canonical sets, so declaration order is not carried.
 */
export function mutationAuthorityRegistryValue(
  definitions: readonly MutationAuthorityDefinition[],
): CanonicalValue {
  const names = new Set<string>();
  for (const definition of definitions) {
    if (names.has(definition.authorityName)) {
      throw new MutationAuthorityContractError('DUPLICATE_AUTHORITY', `duplicate mutation authority ${definition.authorityName}`);
    }
    names.add(definition.authorityName);
  }
  return {
    kind: 'record',
    schema: mutationAuthoritySchemas.registryDefinition,
    fields: new Map<bigint, CanonicalValue>([
      [1n, text(MUTATION_AUTHORITY_CONTRACT_VERSION)],
      [2n, set(definitions.map(authorityValue))],
    ]),
  };
}

export interface CompiledMutationAuthorityRegistry {
  readonly registry: StateAuthorityRegistry;
  /** The exact bytes to commit into the registry manifest. */
  readonly definitionValue: CanonicalValue;
  readonly writableLeaves: readonly WritableLeafDeclaration[];
  readonly authorities: readonly MutationAuthorityDeclaration[];
}

/**
 * Compiles committed registry data into the executable ownership registry. The
 * `StateAuthorityRegistry` constructor proves non-overlap and exhaustive coverage, so an illegal
 * definition fails here rather than at first write.
 */
export function compileMutationAuthorityRegistry(
  definitions: readonly MutationAuthorityDefinition[],
): CompiledMutationAuthorityRegistry {
  const definitionValue = mutationAuthorityRegistryValue(definitions);
  const writableLeaves: WritableLeafDeclaration[] = [];
  const authorities: MutationAuthorityDeclaration[] = [];
  for (const definition of definitions) {
    for (const leaf of definition.ownedLeaves) {
      writableLeaves.push({
        pattern: leaf.pattern,
        validateValue: leafValueValidator(leaf.valueGrammar),
        removalAllowed: leaf.removalAllowed,
      });
    }
    authorities.push({
      mutationAuthorityId: mutationAuthorityId(definition.authorityName),
      patterns: definition.ownedLeaves.map((leaf) => leaf.pattern),
    });
  }
  return Object.freeze({
    registry: new StateAuthorityRegistry(writableLeaves, authorities),
    definitionValue,
    writableLeaves: Object.freeze(writableLeaves),
    authorities: Object.freeze(authorities),
  });
}
