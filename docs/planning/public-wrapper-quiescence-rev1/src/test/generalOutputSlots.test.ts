import {beforeAll,it,expect} from 'vitest';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {generalRecord as r,generalSubject,generalId as id,generalDefinitionId as d,generalBindingContext} from '../campaign3/generalBindingProfile';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {canonicalEncode as enc,list,set,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataIdentity as identity,dataUnsigned as uint,dataText as txt,dataKey as key} from '../campaign2/canonicalData';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {AuthoritativeState} from '../substrate/state';
import {DeterministicScheduler,type EventHandler} from '../substrate/scheduler';
import {simInstant} from '../substrate/time';
const who=generalSubject(),observer=txt(identity(who.observer).payload);
let model:Awaited<ReturnType<typeof compileGeneralDeclarations>>;
beforeAll(async()=>{model=await compileGeneralDeclarations(buildGeneralDeclarationPacket());});
const workspace=(occ:CanonicalValue)=>r(381,[occ,who.character,d('workspace'),list([]),r(380,[u(1)])]);
function transaction(){let ordinal=0n;return model.outputSlots.beginInstant(()=>ordinal++);}
function sampled(tx:ReturnType<typeof transaction>,safe=true){
 const stage=tx.beginStage('current-sample'),observation=stage.allocate(1115n),experience=safe?stage.allocate(1106n):undefined;
 const panel=safe?r(542,[observation,who.observer,signed(3),u(0),u(1),{kind:'text',value:'trial-panel-source-component/0.1-candidate'}]):r(653,[observation,who.observer,signed(3),{kind:'text',value:'trial-panel-source-component/0.1-candidate'}]);
 const request=r(655,new Map<bigint,CanonicalValue>([[1n,who.observer],[3n,true],[4n,false]]));
 const fields=new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,signed(3)],[3n,request],[5n,panel]]);
 if(experience){fields.set(7n,r(215,[who.observer,stage.allocate(1113n)]));fields.set(8n,experience);}
 return {stage,value:r(656,fields),experience,observation};
}
function frozen(experience:CanonicalValue,observation:CanonicalValue){return preRecognitionSemanticExperienceValue({experienceId:uint(identity(experience).payload),observerId:observer,occurredAt:3n,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:observer,observationId:uint(identity(observation).payload)}],transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'});}
it('requires the exact slot issued to its producer, not merely a matching namespace',()=>{
 const tx=transaction(),stage=tx.beginStage('prior-concern-workspace'),slot=stage.allocate(1128n);
 expect(()=>stage.admit([workspace(typedIdentifier(1128,u(9)))])).toThrow(/actual slot/);
 const receipt=stage.admit([workspace(slot)]);expect(tx.outputs(receipt)).toEqual([enc(workspace(slot))]);
 expect(()=>stage.allocate(1128n)).toThrow(/completed/);tx.commit();expect(()=>tx.outputs(receipt)).toThrow(/closed/);
});
it('enforces per-stage schemas, cardinalities, namespace ownership and slot budgets',()=>{
 const tx=transaction(),stage=tx.beginStage('prior-concern-workspace');expect(()=>stage.allocate(1129n)).toThrow(/not owned/);
 const slot=stage.allocate(1128n);expect(()=>stage.allocate(1128n)).toThrow(/count/);expect(()=>stage.admit([])).toThrow(/cardinality/);
 expect(()=>stage.admit([workspace(slot),workspace(slot)])).toThrow(/cardinality/);expect(()=>stage.admit([workspace(slot),r(372,[u(1)])])).toThrow(/undeclared/);tx.abort();
});
it('rejects phantom slots and allocation by non-owning stages',()=>{
 const tx=transaction(),stage=tx.beginStage('current-bind');stage.allocate(1103n);expect(()=>stage.admit([])).toThrow(/not emitted/);tx.abort();
 const second=transaction(),rank=second.beginStage('current-body-rank');expect(()=>rank.allocate(1148n)).toThrow(/not owned/);second.abort();
});
it('admits nested observation/detection/reservation ownership and freezes that exact experience once',()=>{
 const tx=transaction(),sample=sampled(tx),receipt=sample.stage.admit([sample.value]);
 expect(()=>tx.commit()).toThrow(/reservations/);
 const freeze=tx.beginStage('current-freeze',receipt);expect(freeze.reservedExperience()).toEqual(sample.experience);
 expect(()=>freeze.allocate(1106n)).toThrow(/not owned/);
 freeze.admit([frozen(sample.experience!,sample.observation)]);
 expect(()=>tx.beginStage('current-freeze',receipt)).toThrow(/consumed/);tx.commit();
});
it('unavailable sampling reserves no placeholder experience',()=>{
 const tx=transaction(),sample=sampled(tx,false),receipt=sample.stage.admit([sample.value]),freeze=tx.beginStage('current-freeze',receipt);
 expect(freeze.reservedExperience()).toBeUndefined();expect(()=>freeze.admit([frozen(typedIdentifier(1106,u(99)),sample.observation)])).toThrow(/reserved/);freeze.admit([]);tx.commit();
});
it('rejects omitted safe reservations, wrong requested coverage and foreign sampled subjects',()=>{
 for(const mutation of ['reserve','request','subject']){
  const tx=transaction(),sample=sampled(tx),fields=new Map(rec(sample.value,656n).fields);
  if(mutation==='reserve')fields.delete(8n);
  if(mutation==='request')fields.set(3n,r(655,new Map<bigint,CanonicalValue>([[1n,who.observer],[3n,false],[4n,true]])));
  if(mutation==='subject')fields.set(1n,id(1000,'observer/other'));
  expect(()=>sample.stage.admit([r(656,fields)])).toThrow();tx.abort();
 }
});
it('rejects another lane, another transaction and forged sample receipts',()=>{
 const tx=transaction(),sample=sampled(tx),receipt=sample.stage.admit([sample.value]);expect(()=>tx.beginStage('consequence-freeze',receipt)).toThrow(/producer/);
 expect(()=>transaction().beginStage('current-freeze',receipt)).toThrow(/producer/);
 expect(()=>tx.beginStage('current-freeze',{} as typeof receipt)).toThrow(/producer/);tx.abort();
});
it('checks selected views borrow the audit of this exact producer',()=>{
 const tx=transaction(),stage=tx.beginStage('current-body-selection'),selection=stage.allocate(1143n);
 const audit=r(603,new Map([[1n,selection],[2n,who.observer],[3n,signed(3)],[5n,list([r(602,[id(1045,'interoceptive-signal/A'),u(1),u(3)])])]]));
 const view=(s:CanonicalValue)=>r(604,new Map([[1n,s],[2n,who.observer],[3n,signed(3)],[5n,list([])]]));
 expect(()=>stage.admit([audit,view(typedIdentifier(1143,u(99)))])).toThrow(/producer/);stage.admit([audit,view(selection)]);tx.commit();
});
it('uses a shared ordinal sequence across namespaces and rejects duplicate allocator returns',()=>{
 const tx=model.outputSlots.beginInstant(()=>0n),sample=tx.beginStage('current-sample');sample.allocate(1115n);expect(()=>sample.allocate(1106n)).toThrow(/shared/);tx.abort();
});
it('checks real workspace output and keeps returned byte snapshots detached',()=>{
 const tx=transaction(),stage=tx.beginStage('prior-concern-workspace'),slot=stage.allocate(1128n);
 const state=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:who.observer}]},value:r(267,[who.character])}]);
 const result=model.workspace.construct(state,r(377,[who.observer,d('workspace')]),slot,3n),receipt=stage.admit([decode(result.outputBytes(),generalBindingContext())]);
 tx.outputs(receipt)[0].fill(0);expect(tx.outputs(receipt)[0]).toEqual(result.outputBytes());tx.commit();
});
it('scheduler rollback restores the actual shared allocator and discards admitted outputs',async()=>{
 const type=id(1001,'event/general-attention-prior-concern-workspace');
 const handler:EventHandler<bigint>=({state,allocateRuntimeId})=>{
  const tx=model.outputSlots.beginInstant(allocateRuntimeId),stage=tx.beginStage('prior-concern-workspace');
  const value=workspace(stage.allocate(1128n));stage.admit([value]);tx.commit();return {nextState:state+1n,emittedEvents:[],traceContributions:[],outputs:[value]};
 };
 const scheduler=new DeterministicScheduler<bigint>({initialState:0n,stateAdapter:{clone:v=>v,validate:()=>{},canonicalValue:u},handlers:new Map([[key(type),handler]]),maxSettlementWorkPerSimulationInstant:5n});
 scheduler.schedule({dueAt:simInstant(3n),phase:30n,eventTypeId:type,payload:list([]),dependencies:list([])});
 const before=scheduler.exportQuiescentSnapshot();
 await expect(scheduler.settleNextInstantForConformance({onBoundary(boundary){if(boundary==='before-commit')throw Error('injected after output admission');}})).rejects.toThrow();
 const after=scheduler.exportQuiescentSnapshot();expect(after.allocators).toEqual(before.allocators);expect(after.state).toBe(before.state);expect(after.outputs).toEqual([]);
});
