import { describe, expect, it } from 'vitest';
import { bytesToHex, list, text, typedIdentifier, unsigned, type CanonicalValue } from '../substrate/canonicalEncoding';
import {
  ContentValidationError,
  compileGovernedContentManifest,
  compileCorpusManifest,
  compileRegistryManifest,
  contentRegistrySchemas,
  governedContentRecordSchema,
  type GovernedContentInput,
} from '../substrate/contentManifest';

const contentId = typedIdentifier(23000n, text('content/action/help'));
const otherContentId = typedIdentifier(23000n, text('content/action/thank'));
const semanticKind = typedIdentifier(23001n, text('semantic-kind/world-action'));
const phaseId = typedIdentifier(23002n, text('phase/world-effect'));
const registryKind = typedIdentifier(23003n, text('registry/semantic-kind'));
const empty = list([]);
const hex = (value: Uint8Array) => bytesToHex(value);
const validators = [semanticKind, phaseId].map((semanticKindId) => ({
  semanticKindId,
  validate: (definition: GovernedContentInput): void => {
    const effects = definition.worldEffects;
    if (typeof effects === 'boolean' || effects.kind !== 'list') throw new Error('world effects must be a typed list');
    if (effects.items.some((item) => typeof item !== 'boolean' && item.kind === 'text' && item.value === 'out-of-domain')) {
      throw new Error('world effect is outside the registered domain');
    }
  },
}));
const compile = (
  definitions: readonly GovernedContentInput[],
  registeredIds: readonly typeof semanticKind[] = [semanticKind, phaseId],
) => compileGovernedContentManifest(definitions, registeredIds, validators);

function fixture(overrides: Partial<GovernedContentInput> = {}): GovernedContentInput {
  return {
    stableId: contentId,
    semanticKind,
    declaredInputs: list([text('actor'), text('target')]),
    declaredOutputs: list([text('attempt')]),
    preconditions: list([text('actor-present')]),
    worldEffects: list([text('target-assisted')]),
    unitsDomainsBounds: list([text('none')]),
    epistemicVisibility: list([text('public-action')]),
    observationAffordances: list([text('sight'), text('hearing')]),
    lifecycle: list([text('single-attempt')]),
    referencedRegistryIds: [phaseId],
    referencedContentIds: [],
    validationInvariants: list([text('intent-is-not-outcome')]),
    sourceProvenance: list([text('campaign0-fixture')]),
    changeHistory: list([text('v1')]),
    formalSeamMappings: list([text('world/action-definition')]),
    presentationLabel: text('Help someone'),
    ...overrides,
  };
}

describe('CONTENT-001 governed content and registry manifests', () => {
  it('commits exact golden content bytes/digest and ignores presentation-only changes', async () => {
    const first = await compile([fixture()]);
    const renamed = await compile([fixture({ presentationLabel: text('Localized presentation label') })], [phaseId, semanticKind]);
    expect(first.canonicalBytes).toEqual(renamed.canonicalBytes);
    expect(first.digest).toEqual(renamed.digest);
    expect(hex(first.canonicalBytes)).toBe(
      '09010aaa01011001010bd8b3010513636f6e74656e742f616374696f6e2f68656c7002010bd9b301051a73656d616e7469632d6b696e642f776f726c642d616374696f6e' +
      '0301070205056163746f720506746172676574040107010507617474656d707405010701050d6163746f722d70726573656e7406010701050f7461726765742d6173736973746564' +
      '0701070105046e6f6e6508010701050d7075626c69632d616374696f6e0901070205057369676874050768656172696e670a010701050e73696e676c652d617474656d7074' +
      '0b0107010bdab301051270686173652f776f726c642d6566666563740c0107000d0107010515696e74656e742d69732d6e6f742d6f7574636f6d650e010701051163616d706169676e302d66697874757265' +
      '0f01070105027631100107010517776f726c642f616374696f6e2d646566696e6974696f6e',
    );
    expect(hex(first.digest)).toBe('46f8b80fc13cb8f6e427ef5f42fc4e33b4049ddcd144fe17bc47b4b7d8461a50');
  });

  it('commits exact golden registry bytes/digest independent of construction order', async () => {
    const entry = { stableId: semanticKind, registryKind, definitionVersion: '1', definition: list([text('world fact')]) };
    const schemas = [governedContentRecordSchema, ...Object.values(contentRegistrySchemas)];
    const first = await compileRegistryManifest(schemas, [entry]);
    const reordered = await compileRegistryManifest([...schemas].reverse(), [entry]);
    expect(first.canonicalBytes).toEqual(reordered.canonicalBytes);
    expect(first.digest).toEqual(reordered.digest);
    expect(hex(first.canonicalBytes)).toBe(
      '09060aab01010401010bd9b301051a73656d616e7469632d6b696e642f776f726c642d616374696f6e02010bdbb301051672656769737472792f73656d616e7469632d6b696e64030105013104010701050a776f726c642066616374' +
      '0aac010104010102aa010201020103010519476f7665726e6564436f6e74656e74446566696e6974696f6e040107100aad0101030101020102010508537461626c6549640301010aad010103010102020201050c53656d616e7469634b696e64030101' +
      '0aad010103010102030201050e4465636c61726564496e707574730301010aad010103010102040201050f4465636c617265644f7574707574730301010aad010103010102050201050d507265636f6e646974696f6e73030101' +
      '0aad010103010102060201050c576f726c64456666656374730301010aad0101030101020702010512556e697473446f6d61696e73426f756e64730301010aad01010301010208020105134570697374656d69635669736962696c697479030101' +
      '0aad01010301010209020105164f62736572766174696f6e4166666f7264616e6365730301010aad0101030101020a020105094c6966656379636c650301010aad0101030101020b020105155265666572656e6365645265676973747279496473030101' +
      '0aad0101030101020c020105145265666572656e636564436f6e74656e744964730301010aad0101030101020d0201051456616c69646174696f6e496e76617269616e74730301010aad0101030101020e02010510536f7572636550726f76656e616e6365030101' +
      '0aad0101030101020f0201050d4368616e6765486973746f72790301010aad0101030101021002010512466f726d616c5365616d4d617070696e6773030101' +
      '0aac010104010102ab01020102010301051553656d616e7469635265676973747279456e747279040107040aad0101030101020102010508537461626c6549640301010aad010103010102020201050c52656769737472794b696e64030101' +
      '0aad0101030101020302010511446566696e6974696f6e56657273696f6e0301010aad010103010102040201050a446566696e6974696f6e030101' +
      '0aac010104010102ac01020102010301051f43616e6f6e6963616c5265636f7264536368656d6144657363726970746f72040107040aad01010301010201020105065479706549640301010aad010103010102020201050d536368656d6156657273696f6e030101' +
      '0aad01010301010203020105044e616d650301010aad01010301010204020105064669656c6473030101' +
      '0aac010104010102ad01020102010301051e43616e6f6e6963616c5265636f72644669656c6444657363726970746f72040107030aad01010301010201020105074669656c6449640301010aad01010301010202020105044e616d650301010aad01010301010203020105085265717569726564030101' +
      '0aac010104010102ae010201020103010513436f727075734d616e6966657374456e747279040107020aad010103010102010201050c5068656e6f6d656e6f6e49640301010aad010103010102020201050756657273696f6e030101',
    );
    expect(hex(first.digest)).toBe('a877e48482e8c08c3e0e14fd8a394448edb301bbe0327ef4b3174a8e2b6b21c2');
  });

  it('changes the content commitment for every authoritative field but not presentation', async () => {
    const baseline = await compile([fixture()]);
    const changes: Partial<GovernedContentInput>[] = [
      { stableId: otherContentId },
      { semanticKind: phaseId },
      { declaredInputs: list([text('different-input')]) },
      { declaredOutputs: list([text('different-output')]) },
      { preconditions: list([text('different-precondition')]) },
      { worldEffects: list([text('different-effect')]) },
      { unitsDomainsBounds: list([text('bounded')]) },
      { epistemicVisibility: list([text('private')]) },
      { observationAffordances: list([text('sound-only')]) },
      { lifecycle: list([text('persistent')]) },
      { referencedRegistryIds: [] },
      { validationInvariants: list([text('different-invariant')]) },
      { sourceProvenance: list([text('different-source')]) },
      { changeHistory: list([text('v2')]) },
      { formalSeamMappings: list([text('different/seam')]) },
    ];
    for (const change of changes) {
      const candidate = await compile([fixture(change)]);
      expect(hex(candidate.digest)).not.toBe(hex(baseline.digest));
    }
    const second = fixture({ stableId: otherContentId });
    const withoutReference = await compile([fixture(), second]);
    const withReference = await compile([fixture({ referencedContentIds: [otherContentId] }), second]);
    expect(hex(withReference.digest)).not.toBe(hex(withoutReference.digest));

    const registryBaseline = await compileRegistryManifest(
      [governedContentRecordSchema],
      [{ stableId: semanticKind, registryKind, definitionVersion: '1', definition: empty }],
    );
    const registryChanged = await compileRegistryManifest(
      [governedContentRecordSchema],
      [{ stableId: semanticKind, registryKind, definitionVersion: '1', definition: list([unsigned(1n)]) }],
    );
    expect(hex(registryChanged.digest)).not.toBe(hex(registryBaseline.digest));
  });

  it('rejects duplicate/unknown IDs, invalid references, cycles, and malformed registries', async () => {
    await expect(compile([fixture(), fixture()]))
      .rejects.toThrow(/duplicate governed content StableId/);
    await expect(compileGovernedContentManifest([fixture()], [phaseId], validators.filter((item) => item.semanticKindId === phaseId)))
      .rejects.toThrow(/unknown semantic-kind/);
    await expect(compile([fixture({ referencedRegistryIds: [typedIdentifier(23002n, text('missing'))] })]))
      .rejects.toThrow(/unknown registry reference/);
    await expect(compile([fixture({ referencedContentIds: [otherContentId] })]))
      .rejects.toThrow(/unknown content reference/);
    const first = fixture({ referencedContentIds: [otherContentId] });
    const second = fixture({ stableId: otherContentId, referencedContentIds: [contentId] });
    await expect(compile([first, second]))
      .rejects.toThrow(/cycle/);
    await expect(compile([fixture({ referencedRegistryIds: [phaseId, phaseId] })]))
      .rejects.toThrow(/duplicate referenced registry ID/);
    await expect(compile([fixture({ worldEffects: list([text('out-of-domain')]) })]))
      .rejects.toThrow(/outside the registered domain/);
    await expect(compileGovernedContentManifest([fixture()], [semanticKind, phaseId], []))
      .rejects.toThrow(/missing deterministic semantic-kind validator/);

    await expect(compileRegistryManifest([governedContentRecordSchema, governedContentRecordSchema], []))
      .rejects.toThrow(/duplicate canonical record schema/);
    const entry = { stableId: semanticKind, registryKind, definitionVersion: '1', definition: empty };
    await expect(compileRegistryManifest([], [entry, entry])).rejects.toThrow(/duplicate semantic registry/);
    await expect(compileRegistryManifest([], [{ ...entry, definitionVersion: '' }])).rejects.toThrow(/nonempty/);
    await expect(compileRegistryManifest([{
      typeId: 999n, schemaVersion: 1n, name: 'Bad',
      fields: [{ id: 2n, name: 'Later', required: true }, { id: 1n, name: 'Earlier', required: true }],
    }], [])).rejects.toThrow(/strictly increasing/);
  });

  it('publishes the exact aggregate phenomenon-corpus manifest', async () => {
    const names = ['ADAPT', 'BIO', 'COMMIT', 'DECISION', 'DET', 'EPI', 'LEARN', 'MEM', 'REASON', 'SEM'];
    const entries = names.map((name) => ({
      phenomenonId: typedIdentifier(23010n, text(`PHEN-${name}-001`)),
      version: name === 'EPI' || name === 'SEM' ? '1.1.0-draft' : '1.0.0-draft',
    }));
    const manifest = await compileCorpusManifest(entries);
    const reordered = await compileCorpusManifest([...entries].reverse());
    expect(manifest.canonicalBytes).toEqual(reordered.canonicalBytes);
    expect(manifest.digest).toEqual(reordered.digest);
    expect(hex(manifest.canonicalBytes)).toBe(
      '090a0aae01010201010be2b301050c5048454e2d42494f2d3030310201050b312e302e302d6472616674' +
      '0aae01010201010be2b301050c5048454e2d4445542d3030310201050b312e302e302d6472616674' +
      '0aae01010201010be2b301050c5048454e2d4550492d3030310201050b312e312e302d6472616674' +
      '0aae01010201010be2b301050c5048454e2d4d454d2d3030310201050b312e302e302d6472616674' +
      '0aae01010201010be2b301050c5048454e2d53454d2d3030310201050b312e312e302d6472616674' +
      '0aae01010201010be2b301050e5048454e2d41444150542d3030310201050b312e302e302d6472616674' +
      '0aae01010201010be2b301050e5048454e2d4c4541524e2d3030310201050b312e302e302d6472616674' +
      '0aae01010201010be2b301050f5048454e2d434f4d4d49542d3030310201050b312e302e302d6472616674' +
      '0aae01010201010be2b301050f5048454e2d524541534f4e2d3030310201050b312e302e302d6472616674' +
      '0aae01010201010be2b30105115048454e2d4445434953494f4e2d3030310201050b312e302e302d6472616674',
    );
    expect(hex(manifest.digest)).toBe('e1cce742f8e6731fa5ee4dc50207b6f813d5dd19de9e25ba772d6d4f2519651e');
    await expect(compileCorpusManifest([entries[0], entries[0]])).rejects.toThrow(/duplicate PhenomenonId/);
    await expect(compileCorpusManifest([{ ...entries[0], version: '' }])).rejects.toThrow(/version must be nonempty/);
  });
});
