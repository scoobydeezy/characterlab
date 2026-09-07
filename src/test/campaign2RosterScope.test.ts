import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,record,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,statePathPatternValue} from '../substrate/state';
import {leafValueGrammarValue} from '../substrate/mutationAuthority';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId as id,namespaceRole} from '../campaign2/firstModelCandidate';
import {compileCampaign2Registry} from '../campaign2/modelPackaging';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {dataRecord as rec,dataItems as items} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import * as runtimeModule from '../campaign2/adaptationRuntime';
const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
const roster=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r('CharacterObserverBindingValue',{CharacterId:character})}]);
function withRoster(){
 const source=firstTraceModel(),slots=[...items(decodeCampaign2(source.registry),'list')],pattern=statePathPatternValue({rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]});
 slots[3]=set([r('ReadOnlyStateFamilyDefinition',{Pattern:pattern,ValueGrammar:leafValueGrammarValue({kind:'canonical-record',recordTypeId:267n})})]);
 slots[4]=set([...items(slots[4],'set'),r('StateKeyGrammarDefinition',{Pattern:pattern,KeyGrammar:r('StateKeyGrammar',{VariantTag:unsigned(1)})})]);
 slots[5]=set([...items(slots[5],'set'),r('CanonicalRoleConstraint',{Position:r('CanonicalRolePosition',{VariantTag:unsigned(2),RootStateTypeId:unsigned(268),FieldId:unsigned(1)}),Role:namespaceRole(1000)})]);
 return {...source,registry:enc(list(slots))};
}
it('FCT-C scope: valid generic IDN roster declarations cannot enter the bounded no-read-only profile',async()=>{
 const source=withRoster(),compiled=await compileCampaign2Registry(source.registrySchemaVersion,source.registry,source.content);
 expect(()=>compiled.stateModel.validateState(roster)).not.toThrow();
 await expect(prepareCampaign2Model(source)).rejects.toThrow('bounded specimen requires one character, five writable maps and no read-only state');
 await expect(prepareCampaign2Model(source)).rejects.toThrowError(expect.objectContaining({code:'INVALID_CONFIGURATION'}));
});
it('FCT-C scope: roster initial state and restored state reject before bounded runtime construction',async()=>{
 const source=firstTraceModel(),model=await prepareCampaign2Model(source),orderedInputs=enc(list([])),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)}),save=run.save();
 const saved=rec(decodeCampaign2(save),132n),changed=enc(record(saved.schema,new Map([...saved.fields,[5n,roster.canonicalValue() as CanonicalValue]])));
 const spy=vi.spyOn(runtimeModule,'createAdaptationRuntime');
 try{
  await expect(createCampaign2Run(model,{initialState:enc(roster.canonicalValue()),orderedInputs,runSeed:new Uint8Array(32)})).rejects.toThrowError(expect.objectContaining({code:'INVALID_PATH'}));
  await expect(restoreCampaign2Run(source,{save:changed,orderedInputs})).rejects.toThrow();
  expect(spy).not.toHaveBeenCalled();expect(run.save()).toEqual(save);
 }finally{spy.mockRestore();}
});
