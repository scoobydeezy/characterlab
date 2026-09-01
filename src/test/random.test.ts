import { describe, expect, it } from 'vitest';
import { bytesToHex, list, text, typedIdentifier } from '../substrate/canonicalEncoding';
import { commitManifest, createComparisonCase, createModelIdentity, createRunIdentity, runSeedFromFriendlyInteger } from '../substrate/identity';
import {
  MAX_BOUNDED_SPAN,
  RANDOM_MODULUS,
  ComparisonDrawMap,
  PurposeComparisonRoleRegistry,
  RandomContractError,
  RandomRunOracle,
  mapCandidatesToBoundedRange,
  mapCandidatesToWeightedChoice,
  naturalRandomKeyValue,
  randomAddressValue,
  randomCandidate128,
  type ComparisonDrawKey,
  type RandomAddress,
} from '../substrate/random';

const causalRoot = typedIdentifier(10001n, text('event/choice-1'));
const purpose = typedIdentifier(10002n, text('decision/arbitration'));
const otherPurpose = typedIdentifier(10002n, text('decision/tiebreak'));
const subjectRole = typedIdentifier(10003n, text('actor'));
const otherSubjectRole = typedIdentifier(10003n, text('target'));
const subject = typedIdentifier(10004n, text('character/alex'));
const target = typedIdentifier(10004n, text('character/blair'));
const comparisonRole = typedIdentifier(10005n, text('decision-result'));
const otherComparisonRole = typedIdentifier(10005n, text('other-result'));

const address = (overrides: Partial<RandomAddress> = {}): RandomAddress => ({
  causalRootId: causalRoot,
  purposeId: purpose,
  subjectBindings: [
    { subjectRoleId: otherSubjectRole, subjectId: target },
    { subjectRoleId: subjectRole, subjectId: subject },
  ],
  drawIndex: 0n,
  ...overrides,
});

const comparisonKey = (name = 'shared-decision', role = comparisonRole): ComparisonDrawKey => ({
  keyId: typedIdentifier(10006n, text(name)),
  comparisonRoleId: role,
});

const roles = new PurposeComparisonRoleRegistry([
  { purposeId: purpose, comparisonRoleId: comparisonRole },
  { purposeId: otherPurpose, comparisonRoleId: otherComparisonRole },
]);

describe('Campaign 0B addressed randomness', () => {
  it('CV-RNG-001: has checked-in candidate-input, SHA-256, and first-128-bit vectors', async () => {
    const candidate = await randomCandidate128(
      runSeedFromFriendlyInteger(1n),
      naturalRandomKeyValue(address()),
      0,
    );
    expect(bytesToHex(candidate.inputBytes)).toBe(
      '0a72010401010525726e672f7368613235362d6164647265737365642d3132382d76312d63616e646964617465' +
      '02010420000000000000000000000000000000000000000000000000000000000000000103010a70010101010a' +
      '6e010401010b914e050e6576656e742f63686f6963652d3102010b924e05146465636973696f6e2f617262697472' +
      '6174696f6e030107020a6f010201010b934e05056163746f7202010b944e050e6368617261637465722f616c6578' +
      '0a6f010201010b934e050674617267657402010b944e050f6368617261637465722f626c6169720401020004010200',
    );
    expect(bytesToHex(candidate.digest)).toBe('70e02bd7bcd7690f6f9bdeea60c9a00f3a00d827ce87a04c37b4de41f41c7681');
    expect(candidate.candidate).toBe(0x70e02bd7bcd7690f6f9bdeea60c9a00fn);
  });

  it('canonicalizes subject bindings and rejects duplicate pairs', () => {
    const reversed = address({ subjectBindings: [...address().subjectBindings].reverse() });
    expect(randomAddressValue(reversed)).toEqual(randomAddressValue(address()));
    expect(() => randomAddressValue(address({ subjectBindings: [
      { subjectRoleId: subjectRole, subjectId: subject },
      { subjectRoleId: subjectRole, subjectId: subject },
    ] }))).toThrow(/duplicate random-address subject binding/);
  });

  it('CV-RNG-002: maps every span boundary and rejects values outside the contract', async () => {
    for (const span of [1n, 2n, (1n << 32n) - 1n, 1n << 32n]) {
      const result = await mapCandidatesToBoundedRange(span, async () => RANDOM_MODULUS - 2n);
      expect(result.result).toBeGreaterThanOrEqual(0n);
      expect(result.result).toBeLessThan(span);
    }
    await expect(mapCandidatesToBoundedRange(0n, async () => 0n)).rejects.toThrow(/bounded span/);
    await expect(mapCandidatesToBoundedRange(MAX_BOUNDED_SPAN + 1n, async () => 0n)).rejects.toThrow(/bounded span/);
  });

  it('CV-RNG-003: records index-0, index-1, and fresh index-2 fallback paths exactly', async () => {
    const span = (1n << 32n) - 1n;
    const limit = (RANDOM_MODULUS / span) * span;
    const acceptedFirst = await mapCandidatesToBoundedRange(span, async () => 7n);
    expect(acceptedFirst).toEqual({ result: 7n, span, limit, fallback: false, attempts: [{ internalCandidateIndex: 0, candidate: 7n, rejected: false }] });

    const acceptedSecond = await mapCandidatesToBoundedRange(span, async (index) => index === 0 ? limit : 8n);
    expect(acceptedSecond.attempts).toEqual([
      { internalCandidateIndex: 0, candidate: limit, rejected: true },
      { internalCandidateIndex: 1, candidate: 8n, rejected: false },
    ]);
    expect(acceptedSecond.fallback).toBe(false);

    const fallback = await mapCandidatesToBoundedRange(span, async (index) => index < 2 ? limit : 9n);
    expect(fallback).toEqual({
      result: 9n,
      span,
      limit,
      fallback: true,
      attempts: [
        { internalCandidateIndex: 0, candidate: limit, rejected: true },
        { internalCandidateIndex: 1, candidate: limit, rejected: true },
        { internalCandidateIndex: 2, candidate: 9n, rejected: false },
      ],
    });
  });

  it('CV-RNG-004: verifies threshold uniformity and the published integer bounds', () => {
    for (let bits = 2n; bits <= 8n; bits += 1n) {
      const modulus = 1n << bits;
      for (let span = 1n; span <= modulus; span += 1n) {
        const limit = (modulus / span) * span;
        const counts = Array.from({ length: Number(span) }, () => 0);
        for (let candidate = 0n; candidate < limit; candidate += 1n) counts[Number(candidate % span)] += 1;
        expect(new Set(counts).size).toBe(1);
        expect(BigInt(counts[0]) * span).toBe(limit);
      }
    }
    for (const span of [1n, 2n, (1n << 32n) - 1n, 1n << 32n]) {
      const remainder = RANDOM_MODULUS % span;
      expect(remainder * (1n << 96n)).toBeLessThan(RANDOM_MODULUS);
      expect(span * (1n << 98n)).toBeLessThanOrEqual(4n * RANDOM_MODULUS);
      expect(remainder * remainder * span * (1n << 290n)).toBeLessThan(4n * RANDOM_MODULUS ** 3n);
    }
  });

  it('CV-RNG-005: selects exact cumulative intervals in canonical item-ID order', async () => {
    const a = typedIdentifier(10007n, text('a'));
    const b = typedIdentifier(10007n, text('b'));
    const items = [{ itemId: b, item: 'B', weight: 2n }, { itemId: a, item: 'A', weight: 3n }];
    expect((await mapCandidatesToWeightedChoice(items, async () => 0n)).item).toBe('A');
    expect((await mapCandidatesToWeightedChoice(items, async () => 2n)).item).toBe('A');
    const selectedB = await mapCandidatesToWeightedChoice(items, async () => 3n);
    expect(selectedB).toMatchObject({ item: 'B', intervalStart: 3n, intervalEnd: 5n });
    await expect(mapCandidatesToWeightedChoice([{ itemId: a, item: 'A', weight: 0n }], async () => 0n)).rejects.toThrow(/positive/);
    await expect(mapCandidatesToWeightedChoice([{ itemId: a, item: 'A', weight: -1n }], async () => 0n)).rejects.toThrow(/positive/);
    await expect(mapCandidatesToWeightedChoice([{ itemId: a, item: 'A', weight: 1n }, { itemId: a, item: 'again', weight: 1n }], async () => 0n)).rejects.toThrow(/duplicate/);
    await expect(mapCandidatesToWeightedChoice([{ itemId: a, item: 'A', weight: MAX_BOUNDED_SPAN + 1n }], async () => 0n)).rejects.toThrow(/total/);
  });

  it('CV-RNG-006/007: unrelated draws and model identity cannot shift an address', async () => {
    const seed = runSeedFromFriendlyInteger(99n);
    const before = await randomCandidate128(seed, naturalRandomKeyValue(address()), 0);
    for (let index = 0n; index < 25n; index += 1n) {
      await randomCandidate128(seed, naturalRandomKeyValue(address({ purposeId: otherPurpose, drawIndex: index })), 0);
    }
    const after = await randomCandidate128(seed, naturalRandomKeyValue(address()), 0);
    expect(after).toEqual(before);

    const callerOwnedSeed = runSeedFromFriendlyInteger(99n);
    const seedSnapshotOracle = new RandomRunOracle(callerOwnedSeed);
    callerOwnedSeed.fill(0);
    const snapshotted = await seedSnapshotOracle.drawBounded(address(), 17n);
    const independentlyRecreated = await new RandomRunOracle(runSeedFromFriendlyInteger(99n)).drawBounded(address(), 17n);
    expect(snapshotted).toEqual(independentlyRecreated);

    let sequentialWord = 0n;
    const consumeSequential = () => sequentialWord++;
    const targetWithoutInsertion = consumeSequential();
    sequentialWord = 0n;
    consumeSequential();
    const targetAfterInsertion = consumeSequential();
    expect(targetAfterInsertion).not.toBe(targetWithoutInsertion);

    const manifests = await Promise.all([list([text('model-a')]), list([text('model-b')])].map(commitManifest));
    const modelA = await createModelIdentity({
      rulesVersion: 'rules/a', contentSchemaVersion: 'content/1', contentManifest: manifests[0],
      parameterSchemaVersion: 'parameters/1', parameterSet: manifests[0], numericProfileVersion: 'numeric/1',
      randomAlgorithmVersion: 'rng/sha256-addressed-128-v1-candidate', registrySchemaVersion: 'registry/1', registryManifest: manifests[0],
    });
    const modelB = await createModelIdentity({
      rulesVersion: 'rules/b', contentSchemaVersion: 'content/1', contentManifest: manifests[1],
      parameterSchemaVersion: 'parameters/1', parameterSet: manifests[1], numericProfileVersion: 'numeric/1',
      randomAlgorithmVersion: 'rng/sha256-addressed-128-v1-candidate', registrySchemaVersion: 'registry/1', registryManifest: manifests[1],
    });
    expect(modelA.digest).not.toEqual(modelB.digest);
    expect((await randomCandidate128(seed, naturalRandomKeyValue(address()), 0)).candidate).toBe(before.candidate);
    expect((await randomCandidate128(runSeedFromFriendlyInteger(100n), naturalRandomKeyValue(address()), 0)).candidate).not.toBe(before.candidate);
    expect((await randomCandidate128(seed, naturalRandomKeyValue(address({ drawIndex: 1n })), 0)).candidate).not.toBe(before.candidate);
    expect((await randomCandidate128(seed, naturalRandomKeyValue(address()), 0, 'rng/replacement/1')).candidate).not.toBe(before.candidate);
  });

  it('CV-RNG-008: explicitly couples different addresses and rejects invalid maps', async () => {
    const localA = address();
    const localB = address({ causalRootId: typedIdentifier(10001n, text('event/choice-other')) });
    const key = comparisonKey();
    const mapA = new ComparisonDrawMap([{ localRandomAddress: localA, comparisonDrawKey: key }], roles);
    const mapB = new ComparisonDrawMap([{ localRandomAddress: localB, comparisonDrawKey: key }], roles);
    const drawA = await new RandomRunOracle(runSeedFromFriendlyInteger(5n), mapA).drawBounded(localA, 20n);
    const drawB = await new RandomRunOracle(runSeedFromFriendlyInteger(5n), mapB).drawBounded(localB, 20n);
    expect(drawA.result).toBe(drawB.result);
    expect(drawA.attempts).toEqual(drawB.attempts);
    expect(drawA.comparisonDrawKey).toEqual(key);
    expect(mapA.canonicalBytes).not.toEqual(mapB.canonicalBytes);
    expect(await new RandomRunOracle(runSeedFromFriendlyInteger(5n), mapA).drawBounded(localA, 20n)).toEqual(drawA);

    const empty = await commitManifest(list([]));
    const modelIdentity = await createModelIdentity({
      rulesVersion: 'rules/1',
      contentSchemaVersion: 'content/1',
      contentManifest: empty,
      parameterSchemaVersion: 'parameters/1',
      parameterSet: empty,
      numericProfileVersion: 'numeric/exact/1',
      randomAlgorithmVersion: 'rng/sha256-addressed-128-v1-candidate',
      registrySchemaVersion: 'registry/1',
      registryManifest: empty,
    });
    const naturalInputs = await commitManifest(list([]));
    const coupledInputs = await commitManifest(list([mapA.canonicalValue]));
    const naturalRun = await createRunIdentity({ modelIdentity, initialState: empty, orderedInputSequence: naturalInputs, runSeed: runSeedFromFriendlyInteger(5n) });
    const coupledRun = await createRunIdentity({ modelIdentity, initialState: empty, orderedInputSequence: coupledInputs, runSeed: runSeedFromFriendlyInteger(5n) });
    expect(coupledRun.digest).not.toEqual(naturalRun.digest);
    const comparisonCase = await createComparisonCase([modelIdentity], [coupledRun], mapA.canonicalValue);
    expect(bytesToHex(comparisonCase.canonicalBytes)).toContain(bytesToHex(mapA.canonicalBytes));

    expect(() => new ComparisonDrawMap([
      { localRandomAddress: localA, comparisonDrawKey: key },
      { localRandomAddress: localA, comparisonDrawKey: comparisonKey('other') },
    ], roles)).toThrow(/duplicate local/);
    expect(() => new ComparisonDrawMap([
      { localRandomAddress: localA, comparisonDrawKey: key },
      { localRandomAddress: localB, comparisonDrawKey: key },
    ], roles)).toThrow(/injective/);
    expect(() => new ComparisonDrawMap([
      { localRandomAddress: localA, comparisonDrawKey: comparisonKey('wrong-role', otherComparisonRole) },
    ], roles)).toThrow(/incompatible/);

    const lateOracle = new RandomRunOracle(runSeedFromFriendlyInteger(5n));
    await lateOracle.drawBounded(localA, 20n);
    expect(() => lateOracle.installComparisonDrawMap(mapA)).toThrow(/after its local address was drawn/);
    await expect(lateOracle.drawBounded(localA, 20n)).rejects.toThrow(RandomContractError);
  });
});
