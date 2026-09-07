import {describe,it,expect} from 'vitest';
import {canonicalEncode,signed,unsigned,text,set,map,record,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {INT64_MAX,timeSchemas} from '../substrate/time';
import {contentRegistrySchemas} from '../substrate/contentManifest';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {compileFirstCampaign2Content} from '../campaign2/contentProfile';
import {compileValDeclarations} from '../campaign2/valDeclarations';
import {compileRegulatoryReferences} from '../campaign2/regulatoryReference';
import {campaign2Record as r} from '../campaign2/codecs';
import {fixtureContentInputs,fixtureRoleConstraints,fixtureCharacterRole,recordConstraint} from './fixtures/campaign2Model';
const contentId=governedContentDefinitionId('character/mina'),character=semanticReferentFromAuthoredContent(contentId);
const id=(ns:number,name:string)=>typedIdentifier(ns,text(name));
const variable=id(1029,'variable/control'),parameter=id(1030,'parameter/control');
async function context(){const {content,entries}=fixtureContentInputs(contentId);
  return compileFirstCampaign2Content(content,entries,canonicalEncode(set([...fixtureRoleConstraints,recordConstraint(281,1,fixtureCharacterRole)])),entries);
}
type Options={variable?:CanonicalValue;parameter?:CanonicalValue;embedded?:CanonicalValue;governing?:CanonicalValue;character?:CanonicalValue;minimum?:bigint;maximum?:bigint;parameterMinimum?:bigint;scale?:bigint;rate?:bigint;timeScale?:bigint;value?:bigint;instant?:bigint;remainder?:bigint;noCharacters?:boolean;extraParameter?:boolean;version?:string};
function entry(o:Options={}){
  const p=o.parameter??parameter,lo=o.minimum??0n,hi=o.maximum??100n;
  const parameters=record(timeSchemas.linearRateParameters,new Map([[1n,o.embedded??p],[2n,signed(o.rate??0n)],[3n,unsigned(o.timeScale??1n)],[4n,signed(o.parameterMinimum??lo)],[5n,signed(hi)]]));
  const anchor=record(timeSchemas.analyticalAnchor,new Map([[1n,signed(o.value??80n)],[2n,unsigned(o.instant??0n)],[3n,o.governing??p],[4n,unsigned(o.remainder??0n)]]));
  const wrapper=r('RegulatoryCharacterReferenceKey',{CharacterId:o.character??character});
  const params: [CanonicalValue,CanonicalValue][]=[[p,parameters]];
  if(o.extraParameter){const q=id(1030,'parameter/unused');params.push([q,record(timeSchemas.linearRateParameters,new Map([[1n,q],[2n,signed(0)],[3n,unsigned(1)],[4n,signed(lo)],[5n,signed(hi)]]))]);}
  const definition=r('RegulatoryVariableRegistration',{
    VariableDefinition:r('RegulatoryVariableDefinition',{Scale:unsigned(o.scale??10n),Minimum:signed(lo),Maximum:signed(hi)}),
    ReferenceDefinition:r('RegulatoryReferenceDefinition',{CharacterReferences:map(o.noCharacters?[]:[[wrapper,anchor]]),Parameters:map(params)}),
  });
  return record(contentRegistrySchemas.semanticRegistryEntry,new Map([[1n,o.variable??variable],[2n,id(1023,'registry/regulatory-variable')],[3n,text(o.version??'regulatory-reference/0.5-candidate')],[4n,definition]]));
}
const bytes=(...entries:CanonicalValue[])=>canonicalEncode(set(entries));
describe('regulatory-reference/0.5-candidate closed compiler',()=>{
  it('FCT-L: generic REG/IDN retain complete authored identity across content families',async()=>{
    const stable=id(23000,'character/mina'),{content,entries}=fixtureContentInputs(stable);
    const generic=await compileValDeclarations(entries,canonicalEncode(set([...fixtureRoleConstraints,recordConstraint(281,1,fixtureCharacterRole)]))).compileContent(content,entries);
    const otherCharacter=semanticReferentFromAuthoredContent(stable),reg=compileRegulatoryReferences(bytes(entry({character:otherCharacter})),generic);
    expect(reg.referenceOperatingPoint(otherCharacter,variable,0n)).toEqual({kind:'ReferenceValue',value:signed(80)});
    expect(()=>reg.referenceOperatingPoint(character,variable,0n)).toThrowError(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
  });
  it('uses immutable authored R0 and exact signed displacement bounds without state',async()=>{
    const c=await context(),source=bytes(entry()),before=source.slice(),reg=compileRegulatoryReferences(source,c);
    expect(reg.referenceOperatingPoint(character,variable,123n)).toEqual({kind:'ReferenceValue',value:signed(80)});
    for(const d of [-80n,-30n,0n,20n])expect(reg.validateAdaptedReference(character,variable,123n,signed(d))).toEqual({kind:'Valid'});
    for(const d of [-81n,21n,30n])expect(reg.validateAdaptedReference(character,variable,123n,signed(d))).toEqual({kind:'Failure',code:'REG_ADAPTED_REFERENCE_OUT_OF_RANGE'});
    expect(source).toEqual(before);source.fill(0);
    expect(reg.referenceOperatingPoint(character,variable,INT64_MAX)).toEqual({kind:'ReferenceValue',value:signed(80)});
  });
  it('retains negative-rate floor and separates variable Scale from TIME Scale',async()=>{
    const c=await context();
    const reg=compileRegulatoryReferences(bytes(entry({minimum:-INT64_MAX,maximum:INT64_MAX,rate:-1n,timeScale:3n,scale:1000n})),c);
    expect(reg.referenceOperatingPoint(character,variable,1n)).toEqual({kind:'ReferenceValue',value:signed(79)});
    expect(reg.referenceOperatingPoint(character,variable,3n)).toEqual({kind:'ReferenceValue',value:signed(79)});
    expect(reg.referenceOperatingPoint(character,variable,4n)).toEqual({kind:'ReferenceValue',value:signed(78)});
    expect(reg.referenceOperatingPoint(character,variable,0n)).toEqual({kind:'ReferenceValue',value:signed(80)});
  });
  it('rejects invalid domains, references, parameter ownership and non-total endpoints',async()=>{
    const c=await context();
    const invalid:Options[]=[{scale:0n},{minimum:101n},{embedded:id(1030,'parameter/other')},{governing:id(1030,'parameter/missing')},
      {extraParameter:true},{parameterMinimum:-1n},{noCharacters:true},{parameter:id(1027,'parameter/control')},
      {timeScale:2n},{rate:2n,timeScale:4n},{instant:1n},{remainder:1n},{rate:1n},{rate:-1n},{version:'wrong'}];
    for(const o of invalid)expect(()=>compileRegulatoryReferences(bytes(entry(o)),c)).toThrowError(expect.objectContaining({code:'INVALID_CONFIGURATION'}));
    expect(()=>compileRegulatoryReferences(bytes(entry(),entry({variable:id(1029,'variable/other')})),c)).toThrow(/multiple variable owners/);
    expect(()=>compileRegulatoryReferences(bytes(entry(),entry({value:81n})),c)).toThrow(/duplicate regulatory variable/);
  });
  it('requires exact character coverage and declared Character role',async()=>{
    const c=await context();
    expect(()=>compileRegulatoryReferences(bytes(entry({character:semanticReferentFromAuthoredContent(governedContentDefinitionId('character/missing'))})),c)).toThrowError(expect.objectContaining({code:'INVALID_CONFIGURATION'}));
    const {content,entries}=fixtureContentInputs(contentId);
    const noRole=await compileFirstCampaign2Content(content,entries,canonicalEncode(set(fixtureRoleConstraints)),entries);
    expect(()=>compileRegulatoryReferences(bytes(entry()),noRole)).toThrow(/missing REG CharacterId role/);
  });
  it('preserves variable → character → D → T failure precedence',async()=>{
    const reg=compileRegulatoryReferences(bytes(entry()),await context());
    expect(reg.validateAdaptedReference(unsigned(0),id(1029,'unknown'),-1n,text('bad'))).toEqual({kind:'Failure',code:'REG_UNKNOWN_VARIABLE'});
    expect(()=>reg.validateAdaptedReference(semanticReferentFromAuthoredContent(governedContentDefinitionId('character/missing')),variable,-1n,text('bad'))).toThrowError(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
    expect(()=>reg.validateAdaptedReference(character,variable,-1n,text('bad'))).toThrow(/canonical signed/);
    expect(()=>reg.validateAdaptedReference(character,variable,-1n,signed(0))).toThrowError(expect.objectContaining({code:'INVALID_INSTANT'}));
  });
  it('time-only invalidity rejects unchanged D without clamping the reference',async()=>{
    const reg=compileRegulatoryReferences(bytes(entry({rate:1n,timeScale:INT64_MAX,value:99n})),await context());
    expect(reg.validateAdaptedReference(character,variable,0n,signed(1))).toEqual({kind:'Valid'});
    expect(reg.validateAdaptedReference(character,variable,INT64_MAX,signed(1))).toEqual({kind:'Failure',code:'REG_ADAPTED_REFERENCE_OUT_OF_RANGE'});
    expect(reg.referenceOperatingPoint(character,variable,INT64_MAX)).toEqual({kind:'ReferenceValue',value:signed(100)});
  });
});
