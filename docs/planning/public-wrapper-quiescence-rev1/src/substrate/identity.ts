import {
  bytes,
  canonicalEncode,
  cloneCanonicalValue,
  list,
  record,
  text,
  type CanonicalValue,
  type RecordSchema,
} from './canonicalEncoding';
import { sha256 } from './crypto';

export const IDENTITY_SCHEMA_VERSION = 1n;

export const identitySchemas = {
  content: schema(100n, 'ContentIdentity', ['ContentSchemaVersion', 'ContentManifestDigest']),
  parameter: schema(101n, 'ParameterIdentity', ['ParameterSchemaVersion', 'ParameterSetDigest']),
  registry: schema(102n, 'RegistryIdentity', ['RegistrySchemaVersion', 'RegistryManifestDigest']),
  model: schema(103n, 'ModelIdentity', [
    'RulesVersion',
    'ContentIdentity',
    'ParameterIdentity',
    'NumericProfileVersion',
    'RandomAlgorithmVersion',
    'RegistryIdentity',
  ]),
  run: schema(104n, 'RunIdentity', ['ModelIdentity', 'InitialStateDigest', 'OrderedInputSequenceDigest', 'RunSeed']),
  experiment: schema(105n, 'ExperimentIdentity', ['CorpusVersion', 'ComparisonSpecificationVersion', 'HarnessVersion']),
  comparisonCase: schema(106n, 'ComparisonCase', ['OrderedModelIdentities', 'OrderedRunIdentities', 'CouplingSpecification']),
} as const;

const commitmentBrand: unique symbol = Symbol('CharacterLab.ManifestCommitment');

export interface ManifestCommitment {
  readonly canonicalManifest: CanonicalValue;
  readonly canonicalBytes: Uint8Array;
  readonly digest: Uint8Array;
  readonly [commitmentBrand]: true;
}

export interface StructuralIdentity<Kind extends string = string> {
  readonly kind: Kind;
  readonly value: CanonicalValue;
  readonly canonicalBytes: Uint8Array;
  readonly digest: Uint8Array;
}

export interface ModelIdentityInputs {
  readonly rulesVersion: string;
  readonly contentSchemaVersion: string;
  readonly contentManifest: ManifestCommitment;
  readonly parameterSchemaVersion: string;
  readonly parameterSet: ManifestCommitment;
  readonly numericProfileVersion: string;
  readonly randomAlgorithmVersion: string;
  readonly registrySchemaVersion: string;
  readonly registryManifest: ManifestCommitment;
}

export interface RunIdentityInputs {
  readonly modelIdentity: StructuralIdentity<'ModelIdentity'>;
  readonly initialState: ManifestCommitment;
  readonly orderedInputSequence: ManifestCommitment;
  readonly runSeed: Uint8Array;
}

export async function commitManifest(manifest: CanonicalValue): Promise<ManifestCommitment> {
  const canonicalManifest = cloneCanonicalValue(manifest);
  const canonicalBytes = canonicalEncode(canonicalManifest);
  return {
    canonicalManifest,
    canonicalBytes,
    digest: await sha256(canonicalBytes),
    [commitmentBrand]: true,
  };
}

export async function createModelIdentity(inputs: ModelIdentityInputs): Promise<StructuralIdentity<'ModelIdentity'>> {
  requireCommitment(inputs.contentManifest, 'content manifest');
  requireCommitment(inputs.parameterSet, 'parameter set');
  requireCommitment(inputs.registryManifest, 'registry manifest');

  const contentIdentity = requiredRecord(identitySchemas.content, [
    text(inputs.contentSchemaVersion),
    digestValue(inputs.contentManifest.digest, 'content manifest digest'),
  ]);
  const parameterIdentity = requiredRecord(identitySchemas.parameter, [
    text(inputs.parameterSchemaVersion),
    digestValue(inputs.parameterSet.digest, 'parameter set digest'),
  ]);
  const registryIdentity = requiredRecord(identitySchemas.registry, [
    text(inputs.registrySchemaVersion),
    digestValue(inputs.registryManifest.digest, 'registry manifest digest'),
  ]);
  return structuralIdentity('ModelIdentity', requiredRecord(identitySchemas.model, [
    text(inputs.rulesVersion),
    contentIdentity,
    parameterIdentity,
    text(inputs.numericProfileVersion),
    text(inputs.randomAlgorithmVersion),
    registryIdentity,
  ]));
}

export async function createRunIdentity(inputs: RunIdentityInputs): Promise<StructuralIdentity<'RunIdentity'>> {
  requireCommitment(inputs.initialState, 'initial state');
  requireCommitment(inputs.orderedInputSequence, 'ordered input sequence');
  requireLength(inputs.runSeed, 32, 'run seed');
  return structuralIdentity('RunIdentity', requiredRecord(identitySchemas.run, [
    inputs.modelIdentity.value,
    digestValue(inputs.initialState.digest, 'initial-state digest'),
    digestValue(inputs.orderedInputSequence.digest, 'ordered-input-sequence digest'),
    bytes(inputs.runSeed),
  ]));
}

export async function createExperimentIdentity(
  corpusVersion: string,
  comparisonSpecificationVersion: string,
  harnessVersion: string,
): Promise<StructuralIdentity<'ExperimentIdentity'>> {
  return structuralIdentity('ExperimentIdentity', requiredRecord(identitySchemas.experiment, [
    text(corpusVersion),
    text(comparisonSpecificationVersion),
    text(harnessVersion),
  ]));
}

export async function createComparisonCase(
  orderedModelIdentities: readonly StructuralIdentity<'ModelIdentity'>[],
  orderedRunIdentities: readonly StructuralIdentity<'RunIdentity'>[],
  couplingSpecification: CanonicalValue,
): Promise<StructuralIdentity<'ComparisonCase'>> {
  return structuralIdentity('ComparisonCase', requiredRecord(identitySchemas.comparisonCase, [
    list(orderedModelIdentities.map((identity) => identity.value)),
    list(orderedRunIdentities.map((identity) => identity.value)),
    couplingSpecification,
  ]));
}

export async function restoreModelIdentity(value: CanonicalValue): Promise<StructuralIdentity<'ModelIdentity'>> {
  requireRecordType(value, identitySchemas.model);
  return structuralIdentity('ModelIdentity', value);
}

export async function restoreRunIdentity(value: CanonicalValue): Promise<StructuralIdentity<'RunIdentity'>> {
  requireRecordType(value, identitySchemas.run);
  return structuralIdentity('RunIdentity', value);
}

export function runSeedFromFriendlyInteger(value: bigint | number): Uint8Array {
  let remaining = BigInt(value);
  if (remaining < 0n || remaining >= (1n << 256n)) throw new RangeError('friendly run seed must fit unsigned 256 bits');
  const result = new Uint8Array(32);
  for (let index = 31; index >= 0; index -= 1) {
    result[index] = Number(remaining & 0xffn);
    remaining >>= 8n;
  }
  return result;
}

async function structuralIdentity<Kind extends string>(kind: Kind, value: CanonicalValue): Promise<StructuralIdentity<Kind>> {
  const canonicalBytes = canonicalEncode(value);
  return { kind, value, canonicalBytes, digest: await sha256(canonicalBytes) };
}

function requiredRecord(target: RecordSchema, values: readonly CanonicalValue[]): CanonicalValue {
  if (values.length !== target.fields.length) throw new Error(`field count mismatch for ${target.name}`);
  return record(target, new Map(target.fields.map((field, index) => [field.id, values[index]])));
}

function digestValue(digest: Uint8Array, description: string): CanonicalValue {
  requireLength(digest, 32, description);
  return bytes(digest);
}

function requireLength(value: Uint8Array, expected: number, description: string): void {
  if (value.length !== expected) throw new RangeError(`${description} must be exactly ${expected} bytes`);
}

function requireCommitment(value: ManifestCommitment, description: string): void {
  if (!value || value[commitmentBrand] !== true) throw new TypeError(`${description} must retain its complete canonical source`);
}

function schema(typeId: bigint, name: string, fieldNames: readonly string[]): RecordSchema {
  return {
    typeId,
    schemaVersion: IDENTITY_SCHEMA_VERSION,
    name,
    fields: fieldNames.map((fieldName, index) => ({ id: BigInt(index + 1), name: fieldName, required: true })),
  };
}

function requireRecordType(value: CanonicalValue, expected: RecordSchema): void {
  if (typeof value === 'boolean' || value.kind !== 'record'
    || value.schema.typeId !== expected.typeId || value.schema.schemaVersion !== expected.schemaVersion) {
    throw new TypeError(`expected ${expected.name} schema ${expected.typeId}/${expected.schemaVersion}`);
  }
}
