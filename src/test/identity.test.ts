import { describe, expect, it } from 'vitest';
import { bytesToHex, list, text, unsigned } from '../substrate/canonicalEncoding';
import { compileContentManifest, type ContentDefinitionSchema } from '../substrate/contentManifest';
import {
  commitManifest,
  createComparisonCase,
  createExperimentIdentity,
  createModelIdentity,
  createRunIdentity,
  runSeedFromFriendlyInteger,
  type ModelIdentityInputs,
} from '../substrate/identity';

async function fixtureInputs(): Promise<ModelIdentityInputs> {
  return {
    rulesVersion: 'rules/1',
    contentSchemaVersion: 'content-schema/1',
    contentManifest: await commitManifest(list([text('content'), unsigned(1n)])),
    parameterSchemaVersion: 'parameter-schema/1',
    parameterSet: await commitManifest(list([text('parameters'), unsigned(2n)])),
    numericProfileVersion: 'numeric/exact-rational/1',
    randomAlgorithmVersion: 'rng/sha256-addressed-128-v1-candidate',
    registrySchemaVersion: 'registry-schema/1',
    registryManifest: await commitManifest(list([text('registry'), unsigned(3n)])),
  };
}

describe('Campaign 0A structural identities', () => {
  it('CV-ID-001: identical complete manifests produce identical model bytes and digest', async () => {
    const first = await createModelIdentity(await fixtureInputs());
    const second = await createModelIdentity(await fixtureInputs());
    expect(first.canonicalBytes).toEqual(second.canonicalBytes);
    expect(first.digest).toEqual(second.digest);
    expect(bytesToHex(first.canonicalBytes)).toBe(
      '0a6701060101050772756c65732f3102010a64010201010510636f6e74656e742d736368656d612f31' +
      '0201042009aa8e892493c738507d4960eaf50bfca9929e26ffff30a9af42f350d10917cc03010a650102' +
      '01010512706172616d657465722d736368656d612f3102010420dbde5064daa69fa31b29765be8de8189' +
      '5b2b536c374e8f8a0c59e84146b0da38040105186e756d657269632f65786163742d726174696f6e616c' +
      '2f3105010525726e672f7368613235362d6164647265737365642d3132382d76312d63616e646964617465' +
      '06010a6601020101051172656769737472792d736368656d612f3102010420e7a0632a11a155529251abb6' +
      '52d7ea8de0a65696ec6531fa3f2b47975789de21',
    );
    expect(bytesToHex(first.digest)).toBe('e31065681161f601156c3d89309857f8fc95a77cc569c7b7e7c4a5a61ba91549');
  });

  it('CV-ID-002: each authoritative model field changes the identity digest', async () => {
    const baselineInputs = await fixtureInputs();
    const baseline = await createModelIdentity(baselineInputs);
    const variants: ModelIdentityInputs[] = [
      { ...baselineInputs, rulesVersion: 'rules/2' },
      { ...baselineInputs, contentSchemaVersion: 'content-schema/2' },
      { ...baselineInputs, contentManifest: await commitManifest(list([text('content'), unsigned(9n)])) },
      { ...baselineInputs, parameterSchemaVersion: 'parameter-schema/2' },
      { ...baselineInputs, parameterSet: await commitManifest(list([text('parameters'), unsigned(9n)])) },
      { ...baselineInputs, numericProfileVersion: 'numeric/fixed/1' },
      { ...baselineInputs, randomAlgorithmVersion: 'rng/replacement/1' },
      { ...baselineInputs, registrySchemaVersion: 'registry-schema/2' },
      { ...baselineInputs, registryManifest: await commitManifest(list([text('registry'), unsigned(9n)])) },
    ];
    for (const variant of variants) {
      expect(bytesToHex((await createModelIdentity(variant)).digest)).not.toBe(bytesToHex(baseline.digest));
    }
  });

  it('CV-ID-004: research identity changes independently of model identity', async () => {
    const model = await createModelIdentity(await fixtureInputs());
    const experiments = [
      await createExperimentIdentity('corpus/1', 'comparison/1', 'harness/1'),
      await createExperimentIdentity('corpus/2', 'comparison/1', 'harness/1'),
      await createExperimentIdentity('corpus/1', 'comparison/2', 'harness/1'),
      await createExperimentIdentity('corpus/1', 'comparison/1', 'harness/2'),
    ];
    expect(new Set(experiments.map((experiment) => bytesToHex(experiment.digest))).size).toBe(4);
    expect((await createModelIdentity(await fixtureInputs())).digest).toEqual(model.digest);
  });

  it('CV-ID-003: presentation-only content is excluded but authoritative fields cannot be disguised as presentation', async () => {
    const fixtureSchema: ContentDefinitionSchema = {
      typeId: 10000n,
      schemaVersion: 1n,
      name: 'ContentSensitivityFixture',
      fields: [
        { id: 1n, name: 'AuthoritativeThreshold', required: true, role: 'authoritative' },
        { id: 2n, name: 'PresentationLabel', required: false, role: 'presentation' },
      ],
    };
    const authored = (label: string) => ({
      schema: fixtureSchema,
      authoritativeFields: new Map([[1n, unsigned(7n)]]),
      presentationFields: new Map([[2n, text(label)]]),
    });
    const first = await compileContentManifest([authored('First label')]);
    const renamed = await compileContentManifest([authored('Renamed label')]);
    expect(first.canonicalBytes).toEqual(renamed.canonicalBytes);
    expect(first.digest).toEqual(renamed.digest);
    expect(bytesToHex(first.canonicalBytes)).toBe('09010a904e010101010207');
    expect(bytesToHex(first.digest)).toBe('77d0cb9e8eadf6b88c895ad0d1c973ea5bbe2d12af1171a822c2419b9b05c230');
    await expect(compileContentManifest([{
      schema: fixtureSchema,
      authoritativeFields: new Map(),
      presentationFields: new Map([[1n, unsigned(7n)], [2n, text('Hidden threshold')]]),
    }])).rejects.toThrow(/cannot be authored as presentation/);
  });

  it('CV-ID-004: comparison membership and ordering remain research structure', async () => {
    const modelIdentity = await createModelIdentity(await fixtureInputs());
    const state = await commitManifest(list([text('state')]));
    const inputs = await commitManifest(list([text('inputs')]));
    const runIdentity = await createRunIdentity({ modelIdentity, initialState: state, orderedInputSequence: inputs, runSeed: runSeedFromFriendlyInteger(1n) });
    const oneMember = await createComparisonCase([modelIdentity], [runIdentity], list([]));
    const twoMembers = await createComparisonCase([modelIdentity, modelIdentity], [runIdentity, runIdentity], list([]));
    expect(oneMember.digest).not.toEqual(twoMembers.digest);
    expect((await createModelIdentity(await fixtureInputs())).digest).toEqual(modelIdentity.digest);
  });

  it('CV-ID-005: initial state, ordered input, and seed participate in run identity', async () => {
    const modelIdentity = await createModelIdentity(await fixtureInputs());
    const stateA = await commitManifest(list([text('state'), unsigned(1n)]));
    const stateB = await commitManifest(list([text('state'), unsigned(2n)]));
    const inputA = await commitManifest(list([text('input'), unsigned(1n)]));
    const inputB = await commitManifest(list([text('input'), unsigned(2n)]));
    const baseline = await createRunIdentity({ modelIdentity, initialState: stateA, orderedInputSequence: inputA, runSeed: runSeedFromFriendlyInteger(1n) });
    const variants = [
      await createRunIdentity({ modelIdentity, initialState: stateB, orderedInputSequence: inputA, runSeed: runSeedFromFriendlyInteger(1n) }),
      await createRunIdentity({ modelIdentity, initialState: stateA, orderedInputSequence: inputB, runSeed: runSeedFromFriendlyInteger(1n) }),
      await createRunIdentity({ modelIdentity, initialState: stateA, orderedInputSequence: inputA, runSeed: runSeedFromFriendlyInteger(2n) }),
    ];
    for (const variant of variants) expect(variant.digest).not.toEqual(baseline.digest);
  });

  it('encodes friendly seeds as exactly 256-bit unsigned big-endian values', () => {
    expect(bytesToHex(runSeedFromFriendlyInteger(1n))).toBe(`${'00'.repeat(31)}01`);
    expect(bytesToHex(runSeedFromFriendlyInteger((1n << 256n) - 1n))).toBe('ff'.repeat(32));
    expect(() => runSeedFromFriendlyInteger(-1n)).toThrow(/unsigned 256 bits/);
    expect(() => runSeedFromFriendlyInteger(1n << 256n)).toThrow(/unsigned 256 bits/);
  });
});
