import {describe,it,expect} from 'vitest';
import {canonicalEncode,canonicalDecode,set,text,typedIdentifier,unsigned,list,record} from '../substrate/canonicalEncoding';
import {governedContentDefinitionId as contentId,validateGovernedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent,semanticReferentFromRuntimeEntity} from '../substrate/referentOrigin';
import {compileFirstCampaign2Content} from '../campaign2/contentProfile';
import {compileValDeclarations} from '../campaign2/valDeclarations';
import {decodeCampaign2} from '../campaign2/codecs';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {fixtureContentInputs,fixtureRoleConstraints} from './fixtures/campaign2Model';
const roles=()=>canonicalEncode(set(fixtureRoleConstraints));
const compile=(id=contentId('character/mina'))=>{
  const {content,entries}=fixtureContentInputs(id);
  return compileFirstCampaign2Content(content,entries,roles(),entries);
};
describe('content-definition-id/0.1-candidate',()=>{
  it('CONTENT-ID-A/F: accepts exact authored NFC UTF-8 text without an allocator',()=>{
    const key='character/Miná';
    expect(contentId(key)).toEqual(typedIdentifier(1038,text(key)));
    for(const bad of ['', 'e\u0301','\ud800'])expect(()=>contentId(bad)).toThrow();
    expect(()=>validateGovernedContentDefinitionId(typedIdentifier(1038,unsigned(1)))).toThrow();
    expect(()=>decodeCampaign2(canonicalEncode(typedIdentifier(1038,text(''))))).toThrow();
    expect(contentId('character/Mina')).not.toEqual(contentId('character/mina'));
    // The constructor accepts only an authored string and closes over no runtime capability.
    expect(contentId(key)).toEqual(contentId(key));
  });
  it('CONTENT-ID-B/D: retains complete StableId through origin encoding',()=>{
    const id=contentId('person/mina'),origin=semanticReferentFromAuthoredContent(id);
    expect(canonicalDecode(canonicalEncode(origin))).toEqual(origin);
    const inner=origin.payload;
    expect(typeof inner!=='boolean'&&inner.kind==='typedIdentifier'&&inner.payload).toEqual(id);
    for(const namespace of [1027,1034,20,23000])
      expect(canonicalEncode(id)).not.toEqual(canonicalEncode(typedIdentifier(namespace,text('person/mina'))));
  });
  it('CONTENT-ID-C: rejects distinct content records sharing a complete StableId',async()=>{
    const {content,entries}=fixtureContentInputs(contentId('character/mina'));
    const values=decodeCampaign2(content);
    if(typeof values==='boolean'||values.kind!=='set')throw Error('fixture');
    const value=values.items[0];
    if(typeof value==='boolean'||value.kind!=='record')throw Error('fixture');
    const changed=record(value.schema,new Map([...value.fields,[15n,list([text('changed history')])]]));
    await expect(compileFirstCampaign2Content(canonicalEncode(set([value,changed])),entries,roles(),entries)).rejects.toThrow(/duplicate/i);
  });
  it('CONTENT-ID-E: a StableId change propagates through content and model commitments',async()=>{
    const a=await compile(),b=await compile(contentId('character/darius'));
    expect(a.digest).not.toEqual(b.digest);
    const empty=await commitManifest(list([]));
    const model=(contentManifest:typeof a)=>createModelIdentity({rulesVersion:'content-id-component-control',contentSchemaVersion:'content/0.2-candidate',contentManifest,
      parameterSchemaVersion:'control',parameterSet:empty,numericProfileVersion:'control',randomAlgorithmVersion:'control',registrySchemaVersion:'control',registryManifest:empty});
    const ma=await model(a),mb=await model(b);
    expect(ma.canonicalBytes).not.toEqual(mb.canonicalBytes);
    expect(ma.digest).not.toEqual(mb.digest);
  });
  it('CONTENT-ID-G: exact authored CharacterId qualifies while runtime and missing authored IDs fail',async()=>{
    const context=await compile();
    expect(()=>context.qualifyCharacter(semanticReferentFromAuthoredContent(contentId('character/mina')))).not.toThrow();
    for(const id of [semanticReferentFromRuntimeEntity(typedIdentifier(1122,unsigned(0))),semanticReferentFromAuthoredContent(contentId('character/absent'))])
      expect(()=>context.qualifyCharacter(id)).toThrow(/authored character/);
  });
  it('CONTENT-ID-H: first profile rejects fixture and unrelated families while generic CONTENT remains polymorphic',async()=>{
    for(const ns of [20,23000,1027,1034]){
      const id=typedIdentifier(ns,text('character/mina'));
      await expect(compile(id)).rejects.toThrow(/first Campaign-2/);
      const {content,entries}=fixtureContentInputs(id);
      const generic=await compileValDeclarations(entries,roles()).compileContent(content,entries);
      expect(()=>generic.qualifyCharacter(semanticReferentFromAuthoredContent(id))).not.toThrow();
    }
  });
});
