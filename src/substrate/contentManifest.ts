import {
  bytesToHex,
  canonicalEncode,
  list,
  record,
  set,
  text,
  unsigned,
  type CanonicalValue,
  type RecordFieldSchema,
  type RecordSchema,
  type TypedIdentifierValue,
} from './canonicalEncoding';
import { commitManifest, type ManifestCommitment } from './identity';

export type ContentFieldRole = 'authoritative' | 'presentation';

export interface ContentFieldSchema extends RecordFieldSchema {
  readonly role: ContentFieldRole;
}

export interface ContentDefinitionSchema {
  readonly typeId: bigint;
  readonly schemaVersion: bigint;
  readonly name: string;
  readonly fields: readonly ContentFieldSchema[];
}

export interface AuthoredContentDefinition {
  readonly schema: ContentDefinitionSchema;
  readonly authoritativeFields: ReadonlyMap<bigint, CanonicalValue>;
  readonly presentationFields: ReadonlyMap<bigint, CanonicalValue>;
}

export interface CompiledContentDefinition {
  readonly canonicalDefinition: CanonicalValue;
  readonly presentationFields: ReadonlyMap<bigint, CanonicalValue>;
}

export const governedContentSchema: ContentDefinitionSchema = {
  typeId: 170n,
  schemaVersion: 1n,
  name: 'GovernedContentDefinition',
  fields: [
    ...[
      'StableId', 'SemanticKind', 'DeclaredInputs', 'DeclaredOutputs', 'Preconditions', 'WorldEffects',
      'UnitsDomainsBounds', 'EpistemicVisibility', 'ObservationAffordances', 'Lifecycle',
      'ReferencedRegistryIds', 'ReferencedContentIds', 'ValidationInvariants', 'SourceProvenance',
      'ChangeHistory', 'FormalSeamMappings',
    ].map((name, index): ContentFieldSchema => ({
      id: BigInt(index + 1), name, required: true, role: 'authoritative',
    })),
    { id: 100n, name: 'PresentationLabel', required: false, role: 'presentation' },
  ],
};

export const contentRegistrySchemas = {
  semanticRegistryEntry: schema(171n, 'SemanticRegistryEntry', ['StableId', 'RegistryKind', 'DefinitionVersion', 'Definition']),
  recordSchemaDescriptor: schema(172n, 'CanonicalRecordSchemaDescriptor', ['TypeId', 'SchemaVersion', 'Name', 'Fields']),
  recordFieldDescriptor: schema(173n, 'CanonicalRecordFieldDescriptor', ['FieldId', 'Name', 'Required']),
  corpusManifestEntry: schema(174n, 'CorpusManifestEntry', ['PhenomenonId', 'Version']),
} as const;

export const governedContentRecordSchema: RecordSchema = {
  typeId: governedContentSchema.typeId,
  schemaVersion: governedContentSchema.schemaVersion,
  name: governedContentSchema.name,
  fields: governedContentSchema.fields
    .filter((field) => field.role === 'authoritative')
    .map(({ id, name, required }) => ({ id, name, required })),
};

export interface GovernedContentInput {
  readonly stableId: TypedIdentifierValue;
  readonly semanticKind: TypedIdentifierValue;
  readonly declaredInputs: CanonicalValue;
  readonly declaredOutputs: CanonicalValue;
  readonly preconditions: CanonicalValue;
  readonly worldEffects: CanonicalValue;
  readonly unitsDomainsBounds: CanonicalValue;
  readonly epistemicVisibility: CanonicalValue;
  readonly observationAffordances: CanonicalValue;
  readonly lifecycle: CanonicalValue;
  readonly referencedRegistryIds: readonly TypedIdentifierValue[];
  readonly referencedContentIds: readonly TypedIdentifierValue[];
  readonly validationInvariants: CanonicalValue;
  readonly sourceProvenance: CanonicalValue;
  readonly changeHistory: CanonicalValue;
  readonly formalSeamMappings: CanonicalValue;
  readonly presentationLabel?: CanonicalValue;
}

export interface SemanticRegistryEntry {
  readonly stableId: TypedIdentifierValue;
  readonly registryKind: TypedIdentifierValue;
  readonly definitionVersion: string;
  readonly definition: CanonicalValue;
}

export interface ContentSemanticValidator {
  readonly semanticKindId: TypedIdentifierValue;
  validate(definition: GovernedContentInput): void;
}

export interface CorpusManifestEntry {
  readonly phenomenonId: TypedIdentifierValue;
  readonly version: string;
}

export function compileContentDefinition(authored: AuthoredContentDefinition): CompiledContentDefinition {
  validateContentSchema(authored.schema);
  const knownFields = new Map(authored.schema.fields.map((field) => [field.id, field]));
  validateBucket(authored.authoritativeFields, 'authoritative', knownFields);
  validateBucket(authored.presentationFields, 'presentation', knownFields);

  for (const field of authored.schema.fields) {
    const bucket = field.role === 'authoritative' ? authored.authoritativeFields : authored.presentationFields;
    if (field.required && !bucket.has(field.id)) throw new ContentValidationError(`required ${field.role} field ${field.name} is absent`);
  }

  const canonicalSchema: RecordSchema = {
    typeId: authored.schema.typeId,
    schemaVersion: authored.schema.schemaVersion,
    name: authored.schema.name,
    fields: authored.schema.fields
      .filter((field) => field.role === 'authoritative')
      .map(({ id, name, required }) => ({ id, name, required })),
  };

  return {
    canonicalDefinition: record(canonicalSchema, authored.authoritativeFields),
    presentationFields: new Map(authored.presentationFields),
  };
}

export async function compileContentManifest(
  definitions: readonly AuthoredContentDefinition[],
): Promise<ManifestCommitment> {
  const compiled = definitions.map((definition) => compileContentDefinition(definition).canonicalDefinition);
  return commitManifest(set(compiled));
}

export function createGovernedContentDefinition(input: GovernedContentInput): AuthoredContentDefinition {
  const authoritative = new Map<bigint, CanonicalValue>([
    [1n, input.stableId], [2n, input.semanticKind], [3n, input.declaredInputs], [4n, input.declaredOutputs],
    [5n, input.preconditions], [6n, input.worldEffects], [7n, input.unitsDomainsBounds],
    [8n, input.epistemicVisibility], [9n, input.observationAffordances], [10n, input.lifecycle],
    [11n, list(canonicalUnique(input.referencedRegistryIds, 'referenced registry ID'))],
    [12n, list(canonicalUnique(input.referencedContentIds, 'referenced content ID'))],
    [13n, input.validationInvariants], [14n, input.sourceProvenance], [15n, input.changeHistory],
    [16n, input.formalSeamMappings],
  ]);
  for (const value of authoritative.values()) canonicalEncode(value);
  return {
    schema: governedContentSchema,
    authoritativeFields: authoritative,
    presentationFields: input.presentationLabel === undefined ? new Map() : new Map([[100n, input.presentationLabel]]),
  };
}

export async function compileGovernedContentManifest(
  definitions: readonly GovernedContentInput[],
  registeredIds: readonly TypedIdentifierValue[],
  semanticValidators: readonly ContentSemanticValidator[],
): Promise<ManifestCommitment> {
  const registryKeys = new Set(canonicalUnique(registeredIds, 'registered ID').map(canonicalKey));
  const validators = new Map<string, ContentSemanticValidator>();
  for (const validator of semanticValidators) {
    const key = canonicalKey(validator.semanticKindId);
    if (validators.has(key)) throw new ContentValidationError('duplicate semantic-kind validator');
    if (!registryKeys.has(key)) throw new ContentValidationError('semantic-kind validator is not registered');
    validators.set(key, validator);
  }
  const byId = new Map<string, GovernedContentInput>();
  for (const definition of definitions) {
    const key = canonicalKey(definition.stableId);
    if (byId.has(key)) throw new ContentValidationError('duplicate governed content StableId');
    byId.set(key, definition);
    if (!registryKeys.has(canonicalKey(definition.semanticKind))) throw new ContentValidationError('unknown semantic-kind registry reference');
    const validator = validators.get(canonicalKey(definition.semanticKind));
    if (!validator) throw new ContentValidationError('missing deterministic semantic-kind validator');
    try {
      validator.validate(definition);
    } catch (error) {
      if (error instanceof ContentValidationError) throw error;
      throw new ContentValidationError(`semantic-kind domain validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    for (const reference of definition.referencedRegistryIds) {
      if (!registryKeys.has(canonicalKey(reference))) throw new ContentValidationError('unknown registry reference');
    }
  }
  for (const definition of definitions) {
    for (const reference of definition.referencedContentIds) {
      if (!byId.has(canonicalKey(reference))) throw new ContentValidationError('unknown content reference');
    }
  }
  rejectContentCycles(byId);
  return compileContentManifest(definitions.map(createGovernedContentDefinition));
}

export async function compileRegistryManifest(
  recordSchemas: readonly RecordSchema[],
  entries: readonly SemanticRegistryEntry[],
): Promise<ManifestCommitment> {
  const schemaKeys = new Set<string>();
  const schemaValues = recordSchemas.map((target) => {
    validateRegisteredRecordSchema(target);
    const key = `${target.typeId}/${target.schemaVersion}`;
    if (schemaKeys.has(key)) throw new ContentValidationError('duplicate canonical record schema registration');
    schemaKeys.add(key);
    return requiredRecord(contentRegistrySchemas.recordSchemaDescriptor, [
      unsigned(target.typeId), unsigned(target.schemaVersion), text(target.name),
      list(target.fields.map((field) => requiredRecord(contentRegistrySchemas.recordFieldDescriptor, [
        unsigned(field.id), text(field.name), field.required,
      ]))),
    ]);
  });
  const entryIds = new Set<string>();
  const entryValues = entries.map((entry) => {
    const key = canonicalKey(entry.stableId);
    if (entryIds.has(key)) throw new ContentValidationError('duplicate semantic registry StableId');
    entryIds.add(key);
    if (entry.definitionVersion.length === 0) throw new ContentValidationError('semantic registry definition version must be nonempty');
    canonicalEncode(entry.definition);
    return requiredRecord(contentRegistrySchemas.semanticRegistryEntry, [
      entry.stableId, entry.registryKind, text(entry.definitionVersion), entry.definition,
    ]);
  });
  return commitManifest(set([...schemaValues, ...entryValues]));
}

export async function compileCorpusManifest(entries: readonly CorpusManifestEntry[]): Promise<ManifestCommitment> {
  const ids = new Set<string>();
  const values = entries.map((entry) => {
    const key = canonicalKey(entry.phenomenonId);
    if (ids.has(key)) throw new ContentValidationError('duplicate PhenomenonId in corpus manifest');
    if (entry.version.length === 0) throw new ContentValidationError('phenomenon version must be nonempty');
    ids.add(key);
    return requiredRecord(contentRegistrySchemas.corpusManifestEntry, [entry.phenomenonId, text(entry.version)]);
  });
  return commitManifest(set(values));
}

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContentValidationError';
  }
}

function validateContentSchema(schema: ContentDefinitionSchema): void {
  let previous: bigint | undefined;
  for (const field of schema.fields) {
    if (field.id < 0n) throw new ContentValidationError(`field ID for ${field.name} must be nonnegative`);
    if (previous !== undefined && field.id <= previous) throw new ContentValidationError(`fields for ${schema.name} must be strictly ordered by ID`);
    previous = field.id;
  }
}

function validateBucket(
  values: ReadonlyMap<bigint, CanonicalValue>,
  expectedRole: ContentFieldRole,
  knownFields: ReadonlyMap<bigint, ContentFieldSchema>,
): void {
  for (const fieldId of values.keys()) {
    const field = knownFields.get(fieldId);
    if (!field) throw new ContentValidationError(`unknown content field ${fieldId}`);
    if (field.role !== expectedRole) {
      throw new ContentValidationError(`${field.name} is ${field.role} and cannot be authored as ${expectedRole}`);
    }
  }
}

function rejectContentCycles(byId: ReadonlyMap<string, GovernedContentInput>): void {
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (key: string): void => {
    if (visiting.has(key)) throw new ContentValidationError('content-reference cycle is forbidden');
    if (visited.has(key)) return;
    visiting.add(key);
    for (const reference of byId.get(key)!.referencedContentIds) visit(canonicalKey(reference));
    visiting.delete(key);
    visited.add(key);
  };
  for (const key of byId.keys()) visit(key);
}

function validateRegisteredRecordSchema(target: RecordSchema): void {
  if (target.typeId < 0n || target.schemaVersion < 0n) throw new ContentValidationError('record type and schema version must be nonnegative');
  canonicalEncode(text(target.name));
  let previous: bigint | undefined;
  for (const field of target.fields) {
    if (field.id < 0n || (previous !== undefined && field.id <= previous)) {
      throw new ContentValidationError('registered record field IDs must be nonnegative and strictly increasing');
    }
    canonicalEncode(text(field.name));
    previous = field.id;
  }
}

function canonicalUnique<T extends CanonicalValue>(values: readonly T[], label: string): T[] {
  const sorted = [...values].sort((left, right) => canonicalKey(left).localeCompare(canonicalKey(right)));
  for (let index = 1; index < sorted.length; index += 1) {
    if (canonicalKey(sorted[index - 1]) === canonicalKey(sorted[index])) throw new ContentValidationError(`duplicate ${label}`);
  }
  return sorted;
}

function canonicalKey(value: CanonicalValue): string {
  return bytesToHex(canonicalEncode(value));
}

function requiredRecord(target: RecordSchema, values: readonly CanonicalValue[]): CanonicalValue {
  return record(target, new Map(target.fields.map((field, index) => [field.id, values[index]])));
}

function schema(typeId: bigint, name: string, fieldNames: readonly string[]): RecordSchema {
  return {
    typeId,
    schemaVersion: 1n,
    name,
    fields: fieldNames.map((fieldName, index) => ({ id: BigInt(index + 1), name: fieldName, required: true })),
  };
}
