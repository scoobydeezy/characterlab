import {
  bytes,
  bytesToHex,
  canonicalEncode,
  list,
  record,
  text,
  unsigned,
  type CanonicalValue,
  type RecordSchema,
  type TypedIdentifierValue,
} from './canonicalEncoding';
import { concatenateBytes, sha256, unsignedBigEndian } from './crypto';

export const RANDOM_ALGORITHM_VERSION = 'rng/sha256-addressed-128-v1-candidate' as const;
export const RANDOM_DOMAIN_LABEL = 'CharacterLab.Random.v1\0' as const;
const RANDOM_DOMAIN_BYTES = new TextEncoder().encode(RANDOM_DOMAIN_LABEL);
export const RANDOM_MODULUS = 1n << 128n;
export const MAX_BOUNDED_SPAN = 1n << 32n;

export const randomSchemas = {
  address: schema(110n, 'RandomAddress', ['CausalRootId', 'PurposeId', 'SubjectBindings', 'DrawIndex']),
  subjectBinding: schema(111n, 'SubjectBinding', ['SubjectRoleId', 'SubjectId']),
  naturalKey: schema(112n, 'NaturalRandomKey', ['RandomAddress']),
  coupledKey: schema(113n, 'CoupledRandomKey', ['ComparisonDrawKey']),
  candidateInput: schema(114n, 'RandomCandidateInput', ['RandomAlgorithmVersion', 'RunSeed', 'EffectiveRandomKey', 'InternalCandidateIndex']),
  mapEntry: schema(115n, 'ComparisonDrawMapEntry', ['LocalRandomAddress', 'ComparisonDrawKey']),
  drawMap: schema(116n, 'ComparisonDrawMap', ['Entries']),
  comparisonKey: schema(117n, 'ComparisonDrawKey', ['KeyId', 'ComparisonRoleId']),
} as const;

export interface SubjectBinding {
  readonly subjectRoleId: TypedIdentifierValue;
  readonly subjectId: TypedIdentifierValue;
}

export interface RandomAddress {
  readonly causalRootId: TypedIdentifierValue;
  readonly purposeId: TypedIdentifierValue;
  readonly subjectBindings: readonly SubjectBinding[];
  readonly drawIndex: bigint;
}

export interface ComparisonDrawKey {
  readonly keyId: TypedIdentifierValue;
  readonly comparisonRoleId: TypedIdentifierValue;
}

export interface ComparisonDrawMapEntry {
  readonly localRandomAddress: RandomAddress;
  readonly comparisonDrawKey: ComparisonDrawKey;
}

export interface CandidateResult {
  readonly inputBytes: Uint8Array;
  readonly digest: Uint8Array;
  readonly candidate: bigint;
}

export interface CandidateAttempt {
  readonly internalCandidateIndex: 0 | 1 | 2;
  readonly candidate: bigint;
  readonly rejected: boolean;
}

export interface BoundedDrawResult {
  readonly result: bigint;
  readonly span: bigint;
  readonly limit: bigint;
  readonly fallback: boolean;
  readonly attempts: readonly CandidateAttempt[];
}

export interface RandomDrawRecord extends BoundedDrawResult {
  readonly localAddress: RandomAddress;
  readonly effectiveKey: CanonicalValue;
  readonly comparisonDrawKey?: ComparisonDrawKey;
}

export interface WeightedItem<T> {
  readonly itemId: TypedIdentifierValue;
  readonly item: T;
  readonly weight: bigint;
}

export interface WeightedDrawResult<T> {
  readonly itemId: TypedIdentifierValue;
  readonly item: T;
  readonly intervalStart: bigint;
  readonly intervalEnd: bigint;
  readonly draw: RandomDrawRecord;
}

export interface WeightedSelection<T> {
  readonly itemId: TypedIdentifierValue;
  readonly item: T;
  readonly intervalStart: bigint;
  readonly intervalEnd: bigint;
  readonly bounded: BoundedDrawResult;
}

export type CandidateSource = (internalCandidateIndex: 0 | 1 | 2) => Promise<bigint>;

export class RandomContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RandomContractError';
  }
}

export class PurposeComparisonRoleRegistry {
  readonly #roles = new Map<string, TypedIdentifierValue>();

  constructor(declarations: readonly { purposeId: TypedIdentifierValue; comparisonRoleId: TypedIdentifierValue }[]) {
    for (const declaration of declarations) {
      const key = canonicalKey(declaration.purposeId);
      if (this.#roles.has(key)) fail('duplicate purpose comparison-role declaration');
      this.#roles.set(key, declaration.comparisonRoleId);
    }
  }

  requireCompatible(purposeId: TypedIdentifierValue, comparisonRoleId: TypedIdentifierValue): void {
    const expected = this.#roles.get(canonicalKey(purposeId));
    if (!expected) fail('mapped random purpose has no declared comparison role');
    if (canonicalKey(expected) !== canonicalKey(comparisonRoleId)) fail('comparison draw key role is incompatible with random purpose');
  }
}

export class ComparisonDrawMap {
  readonly entries: readonly ComparisonDrawMapEntry[];
  readonly canonicalValue: CanonicalValue;
  readonly canonicalBytes: Uint8Array;
  readonly #byAddress = new Map<string, ComparisonDrawKey>();

  constructor(entries: readonly ComparisonDrawMapEntry[], roles: PurposeComparisonRoleRegistry) {
    const sorted = entries.map((entry) => ({ entry, addressBytes: canonicalEncode(randomAddressValue(entry.localRandomAddress)) }));
    sorted.sort((left, right) => compareBytes(left.addressBytes, right.addressBytes));
    const comparisonKeys = new Set<string>();
    for (const { entry, addressBytes } of sorted) {
      const addressKey = bytesToHex(addressBytes);
      if (this.#byAddress.has(addressKey)) fail('duplicate local random address in comparison draw map');
      const comparisonKey = canonicalKey(comparisonDrawKeyValue(entry.comparisonDrawKey));
      if (comparisonKeys.has(comparisonKey)) fail('comparison draw map must be injective');
      roles.requireCompatible(entry.localRandomAddress.purposeId, entry.comparisonDrawKey.comparisonRoleId);
      this.#byAddress.set(addressKey, entry.comparisonDrawKey);
      comparisonKeys.add(comparisonKey);
    }
    this.entries = sorted.map(({ entry }) => entry);
    this.canonicalValue = requiredRecord(randomSchemas.drawMap, [
      list(this.entries.map((entry) => requiredRecord(randomSchemas.mapEntry, [
        randomAddressValue(entry.localRandomAddress),
        comparisonDrawKeyValue(entry.comparisonDrawKey),
      ]))),
    ]);
    this.canonicalBytes = canonicalEncode(this.canonicalValue);
  }

  resolve(address: RandomAddress): ComparisonDrawKey | undefined {
    return this.#byAddress.get(canonicalKey(randomAddressValue(address)));
  }

  contains(address: RandomAddress): boolean {
    return this.#byAddress.has(canonicalKey(randomAddressValue(address)));
  }
}

export class RandomRunOracle {
  readonly #usedAddresses = new Set<string>();
  readonly #runSeed: Uint8Array;
  #drawMap?: ComparisonDrawMap;

  constructor(runSeed: Uint8Array, drawMap?: ComparisonDrawMap) {
    requireSeed(runSeed);
    this.#runSeed = runSeed.slice();
    this.#drawMap = drawMap;
  }

  installComparisonDrawMap(drawMap: ComparisonDrawMap): void {
    if (this.#drawMap) fail('comparison draw map is already installed');
    for (const address of drawMap.entries.map((entry) => entry.localRandomAddress)) {
      if (this.#usedAddresses.has(canonicalKey(randomAddressValue(address)))) fail('comparison mapping cannot be installed after its local address was drawn');
    }
    this.#drawMap = drawMap;
  }

  async drawBounded(address: RandomAddress, span: bigint): Promise<RandomDrawRecord> {
    const resolved = this.beginDraw(address);
    const bounded = await mapCandidatesToBoundedRange(span, async (index) => (
      await randomCandidate128(this.#runSeed, resolved.effectiveKey, index)
    ).candidate);
    return { ...bounded, localAddress: address, ...resolved };
  }

  async drawWeighted<T>(address: RandomAddress, items: readonly WeightedItem<T>[]): Promise<WeightedDrawResult<T>> {
    const resolved = this.beginDraw(address);
    const selection = await mapCandidatesToWeightedChoice(items, async (index) => (
      await randomCandidate128(this.#runSeed, resolved.effectiveKey, index)
    ).candidate);
    return {
      itemId: selection.itemId,
      item: selection.item,
      intervalStart: selection.intervalStart,
      intervalEnd: selection.intervalEnd,
      draw: { ...selection.bounded, localAddress: address, ...resolved },
    };
  }

  private beginDraw(address: RandomAddress): { effectiveKey: CanonicalValue; comparisonDrawKey?: ComparisonDrawKey } {
    const localKey = canonicalKey(randomAddressValue(address));
    if (this.#usedAddresses.has(localKey)) fail('local random address was used more than once in this run');
    this.#usedAddresses.add(localKey);
    const comparisonDrawKey = this.#drawMap?.resolve(address);
    return comparisonDrawKey
      ? { comparisonDrawKey, effectiveKey: requiredRecord(randomSchemas.coupledKey, [comparisonDrawKeyValue(comparisonDrawKey)]) }
      : { effectiveKey: requiredRecord(randomSchemas.naturalKey, [randomAddressValue(address)]) };
  }
}

export async function randomCandidate128(
  runSeed: Uint8Array,
  effectiveRandomKey: CanonicalValue,
  internalCandidateIndex: 0 | 1 | 2,
  randomAlgorithmVersion: string = RANDOM_ALGORITHM_VERSION,
): Promise<CandidateResult> {
  requireSeed(runSeed);
  if (internalCandidateIndex !== 0 && internalCandidateIndex !== 1 && internalCandidateIndex !== 2) {
    fail('internal candidate index must be 0, 1, or 2');
  }
  const input = requiredRecord(randomSchemas.candidateInput, [
    text(randomAlgorithmVersion),
    bytes(runSeed),
    effectiveRandomKey,
    unsigned(internalCandidateIndex),
  ]);
  const inputBytes = canonicalEncode(input);
  const digest = await sha256(concatenateBytes(RANDOM_DOMAIN_BYTES, inputBytes));
  return { inputBytes, digest, candidate: unsignedBigEndian(digest.slice(0, 16)) };
}

export async function mapCandidatesToBoundedRange(span: bigint, source: CandidateSource): Promise<BoundedDrawResult> {
  if (typeof span !== 'bigint' || span < 1n || span > MAX_BOUNDED_SPAN) fail('bounded span must be an integer in [1, 2^32]');
  const limit = (RANDOM_MODULUS / span) * span;
  const attempts: CandidateAttempt[] = [];
  for (const internalCandidateIndex of [0, 1] as const) {
    const candidate = await source(internalCandidateIndex);
    requireCandidate(candidate);
    const rejected = candidate >= limit;
    attempts.push({ internalCandidateIndex, candidate, rejected });
    if (!rejected) return { result: candidate % span, span, limit, fallback: false, attempts };
  }
  const candidate = await source(2);
  requireCandidate(candidate);
  attempts.push({ internalCandidateIndex: 2, candidate, rejected: false });
  return { result: candidate % span, span, limit, fallback: true, attempts };
}

export async function mapCandidatesToWeightedChoice<T>(
  items: readonly WeightedItem<T>[],
  source: CandidateSource,
): Promise<WeightedSelection<T>> {
  const canonical = canonicalWeightedItems(items);
  const total = canonical.reduce((sum, item) => sum + item.weight, 0n);
  if (total <= 0n || total > MAX_BOUNDED_SPAN) fail('weighted choice total must be in [1, 2^32]');
  const bounded = await mapCandidatesToBoundedRange(total, source);
  let cumulative = 0n;
  for (const item of canonical) {
    const intervalStart = cumulative;
    cumulative += item.weight;
    if (bounded.result < cumulative) {
      return { itemId: item.itemId, item: item.item, intervalStart, intervalEnd: cumulative, bounded };
    }
  }
  return fail('weighted choice failed to select a cumulative interval');
}

export function naturalRandomKeyValue(address: RandomAddress): CanonicalValue {
  return requiredRecord(randomSchemas.naturalKey, [randomAddressValue(address)]);
}

export function coupledRandomKeyValue(key: ComparisonDrawKey): CanonicalValue {
  return requiredRecord(randomSchemas.coupledKey, [comparisonDrawKeyValue(key)]);
}

export function randomAddressValue(address: RandomAddress): CanonicalValue {
  if (address.drawIndex < 0n) fail('random draw index must be nonnegative');
  const bindings = address.subjectBindings.map((binding) => ({
    binding,
    roleBytes: canonicalEncode(binding.subjectRoleId),
    subjectBytes: canonicalEncode(binding.subjectId),
  }));
  bindings.sort((left, right) => compareBytes(left.roleBytes, right.roleBytes) || compareBytes(left.subjectBytes, right.subjectBytes));
  let previous: string | undefined;
  for (const binding of bindings) {
    const key = `${bytesToHex(binding.roleBytes)}/${bytesToHex(binding.subjectBytes)}`;
    if (key === previous) fail('duplicate random-address subject binding');
    previous = key;
  }
  return requiredRecord(randomSchemas.address, [
    address.causalRootId,
    address.purposeId,
    list(bindings.map(({ binding }) => requiredRecord(randomSchemas.subjectBinding, [binding.subjectRoleId, binding.subjectId]))),
    unsigned(address.drawIndex),
  ]);
}

export function comparisonDrawKeyValue(key: ComparisonDrawKey): CanonicalValue {
  return requiredRecord(randomSchemas.comparisonKey, [key.keyId, key.comparisonRoleId]);
}

function canonicalWeightedItems<T>(items: readonly WeightedItem<T>[]): WeightedItem<T>[] {
  const encoded = items.map((item) => {
    if (typeof item.weight !== 'bigint' || item.weight <= 0n) fail('weighted choice weights must be positive integers');
    return { item, idBytes: canonicalEncode(item.itemId) };
  });
  encoded.sort((left, right) => compareBytes(left.idBytes, right.idBytes));
  for (let index = 1; index < encoded.length; index += 1) {
    if (compareBytes(encoded[index - 1].idBytes, encoded[index].idBytes) === 0) fail('duplicate weighted item ID');
  }
  return encoded.map(({ item }) => item);
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

function requireSeed(seed: Uint8Array): void {
  if (seed.length !== 32) fail('run seed must be exactly 32 bytes');
}

function requireCandidate(candidate: bigint): void {
  if (candidate < 0n || candidate >= RANDOM_MODULUS) fail('candidate must be an unsigned 128-bit integer');
}

function canonicalKey(value: CanonicalValue): string {
  return bytesToHex(canonicalEncode(value));
}

function compareBytes(left: Uint8Array, right: Uint8Array): number {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    if (left[index] !== right[index]) return left[index] < right[index] ? -1 : 1;
  }
  return left.length === right.length ? 0 : left.length < right.length ? -1 : 1;
}

function fail(message: string): never {
  throw new RandomContractError(message);
}
