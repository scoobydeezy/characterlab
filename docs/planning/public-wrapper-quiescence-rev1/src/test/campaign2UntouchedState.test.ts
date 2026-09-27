import {beforeAll,it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,record,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId as id} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {dataRecord as rec} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import * as runtimeModule from '../campaign2/adaptationRuntime';
import {compileBoundedModelDeclarations} from '../campaign2/modelPackaging';
import {DeterministicScheduler} from '../substrate/scheduler';
import {simInstant} from '../substrate/time';
import {bytesToHex} from '../substrate/canonicalEncoding';
const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
const cases=[...Array.from({length:5},(_,leaf)=>({name:`explicit-zero-${leaf}`,leaf,value:0,unknown:false})),
 {name:'tolerance-over-scale',leaf:0,value:11,unknown:false},{name:'load-over-capacity',leaf:3,value:11,unknown:false},
 ...Array.from({length:5},(_,leaf)=>({name:`unknown-domain-${leaf}`,leaf,value:1,unknown:true}))];
const source=firstTraceModel(),orderedInputs=enc(list([]));let model:Awaited<ReturnType<typeof prepareCampaign2Model>>,save:Uint8Array;
beforeAll(async()=>{model=await prepareCampaign2Model(source);save=(await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)})).save();});
it.each(cases)('AD-F7: untouched $name rejects at creation and restore before runtime construction',async({leaf,value,unknown})=>{
 const variable=id(1029,unknown?'variable/unknown':'variable/fixture-regulation'),load=id(1033,unknown?'load/unknown':'load/fixture-load'),procedure=id(1034,unknown?'procedure/unknown':'procedure/fixture-practice');
 const key=leaf<2?r(leaf===0?'ToleranceKey':'SensitizationKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:variable}):leaf===2?r('RegulatoryAdaptationKey',{CharacterId:character,RegulatoryVariableId:variable}):leaf===3?r('AccumulatedLoadKey',{CharacterId:character,LoadDomainId:load}):r('ProceduralCompetenceKey',{CharacterId:character,ProcedureId:procedure});
 const names=['ToleranceValue','SensitizationValue','RegulatoryAdaptationValue','AccumulatedLoadValue','ProceduralCompetenceValue'] as const;
 const state=new AuthoritativeState([{path:{rootStateTypeId:leaf===4?303n:302n,fieldId:BigInt(leaf===4?1:leaf+1),selectors:[{kind:'mapKey',key}]},value:r(names[leaf],{Magnitude:leaf===2?signed(value):unsigned(value)})}]);
 const saved=rec(decodeCampaign2(save),132n),changed=enc(record(saved.schema,new Map([...saved.fields,[5n,state.canonicalValue() as CanonicalValue]]))),original=save.slice();
 const construction=vi.spyOn(runtimeModule,'createAdaptationRuntime');
 try{
  await expect(createCampaign2Run(model,{initialState:enc(state.canonicalValue()),orderedInputs,runSeed:new Uint8Array(32)})).rejects.toThrowError(expect.objectContaining({code:'INVALID_VALUE'}));
  await expect(restoreCampaign2Run(source,{save:changed,orderedInputs})).rejects.toThrowError(expect.objectContaining({code:'INVALID_VALUE'}));
  expect(construction).not.toHaveBeenCalled();expect(save).toEqual(original);
 }finally{construction.mockRestore();}
});

it('AD-F7: a generic future writer reaches the same full-state invariant independently of E',async()=>{
 const m=await compileBoundedModelDeclarations(source),initial=new AuthoritativeState([]),eventType=id(20,'test/future-writer');let writes=0;
 const path={rootStateTypeId:302n,fieldId:2n,selectors:[{kind:'mapKey' as const,key:r('SensitizationKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:id(1029,'variable/fixture-regulation')})}]};
 const scheduler=new DeterministicScheduler<AuthoritativeState>({initialState:initial,maxSettlementWorkPerSimulationInstant:10n,
  stateAdapter:{clone:s=>new AuthoritativeState(s.entries()),canonicalValue:s=>s.canonicalValue(),validate:s=>{m.compiled.stateModel.validateState(s);m.domains.validateStatic(s);}},
  handlers:new Map([[bytesToHex(enc(eventType)),context=>{
   const applied=m.compiled.stateModel.applyPatch(context.state,{operations:[{kind:'set',path,expected:{presence:false},newValue:r('SensitizationValue',{Magnitude:unsigned(0)})}]},id(1025,'authority/regulatory-adaptation'));writes++;
   return {nextState:applied.state,outputs:[],traceContributions:[],emittedEvents:[]};
  }]])});
 scheduler.schedule({dueAt:simInstant(1n),phase:140n,eventTypeId:eventType,payload:list([]),dependencies:list([])});
 const before=scheduler.exportQuiescentSnapshot();
 await expect(scheduler.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:'STATE_VALIDATION_FAILURE'}));expect(writes).toBe(1);
 const after=scheduler.exportQuiescentSnapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
 for(const field of ['clock','queue','allocators','outputs','committedTrace'] as const)expect(after[field]).toEqual(before[field]);
});
