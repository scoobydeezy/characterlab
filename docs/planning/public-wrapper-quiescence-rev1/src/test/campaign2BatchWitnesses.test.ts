import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,record,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,ContractReadProjection,restoreAuthoritativeState} from '../substrate/state';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId as id} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import * as runtimeModule from '../campaign2/adaptationRuntime';
const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject')),tolerance=id(1035,'rule/fixture-tolerance');
const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('fixture');return record(v.schema,new Map([...v.fields,[n,x]]));};
function singleRule(gated=false){
 const source=firstTraceModel(),slots=[...items(decodeCampaign2(source.registry),'list')];
 slots[0]=set(items(slots[0],'set').flatMap(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return [v];
  const d=f(v,4n);if(typeof d==='boolean'||d.kind!=='record')return [v];
  if(d.schema.typeId===311n){
   if(key(f(v,1n))!==key(tolerance))return [];
   const gate=gated?r('AdaptationGate',{VariantTag:unsigned(2),Source:r('AdaptationReadTarget',{StateFamilyId:id(1031,'regulatory-adaptation'),LeafFamilyId:id(1032,'leaf/tolerance'),KeyDerivation:r('AdaptationKeyDerivation',{VariantTag:unsigned(1),RegulatoryVariableId:id(1029,'variable/fixture-regulation')})})}):f(d,5n);
   return [replace(v,4n,replace(replace(d,6n,signed(2)),5n,gate))];
  }
  if(d.schema.typeId===318n){
   const ext=rec(f(d,5n),317n),resolution=rec(f(ext,2n),316n),rules=items(f(resolution,1n),'set').filter(x=>key(x)===key(tolerance));
   const transition=rec(f(d,3n),319n),reads=rules.length?items(f(transition,2n),'set').filter(p=>key(f(rec(p,149n),2n))===key(unsigned(1))):[];
   return [replace(v,4n,replace(replace(d,5n,replace(ext,2n,replace(resolution,1n,set(rules)))),3n,replace(transition,2n,set(reads))))];
  }return [v];
 }));return {...source,registry:enc(list(slots))};
}
const fact=(count:number,procedural=false)=>r('AuthoredActualAdaptationFact',{Fact:procedural?r('ProceduralPracticeFact',{CharacterId:character,ProcedureId:id(1034,'procedure/fixture-practice'),CompletedRepetitions:unsigned(count)}):r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(count)})});
const inputs=(facts:CanonicalValue[])=>enc(list(facts.map(payload=>list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,payload,list([])]))));
const empty=enc(set([]));

it('AD-E1: n=0 and n=3 retain single-rule topology and allocation positions with Step=2',async()=>{
 const model=await prepareCampaign2Model(singleRule()),results=[];
 for(const count of [0,3]){
  const run=await createCampaign2Run(model,{initialState:empty,orderedInputs:inputs([fact(count)]),runSeed:new Uint8Array(32)});await run.settleNextInstant();
  const snapshot=run.snapshot(),trace=items(decodeCampaign2(snapshot.trace),'list'),last=rec(trace[8],160n),outputs=items(f(last,13n),'list');
  expect(trace).toHaveLength(9);expect(outputs).toHaveLength(2);expect(items(f(last,11n),'list')).toHaveLength(1);
  const dispatch=rec(outputs[0],324n),evaluation=rec(outputs[1],325n);expect(f(dispatch,3n)).toEqual(set([tolerance]));
  expect(f(rec(f(evaluation,6n),327n),1n)).toEqual(unsigned(count===0?1:2));
  const leaves=restoreAuthoritativeState(decodeCampaign2(snapshot.state)).entries();expect(leaves).toHaveLength(count===0?0:1);if(count)expect(leaves[0].value).toEqual(r('ToleranceValue',{Magnitude:unsigned(6)}));
  results.push({allocators:f(rec(decodeCampaign2(run.save()),132n),6n),dispatch:f(dispatch,1n),evaluation:f(evaluation,1n),path:f(evaluation,4n),reads:f(last,11n),run:run.runIdentity()});
 }
 expect(results[0].run).not.toEqual(results[1].run);
 for(const field of ['allocators','dispatch','evaluation','path','reads'] as const)expect(results[0][field]).toEqual(results[1][field]);
});

it.each([false,true])('AD-E6: collision precedes all target/gate projection reads (false gate=%s)',async(gated)=>{
 const model=await prepareCampaign2Model(singleRule(gated));
 const initial=gated?enc(new AuthoritativeState([{path:{rootStateTypeId:302n,fieldId:1n,selectors:[{kind:'mapKey',key:r('ToleranceKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:id(1029,'variable/fixture-regulation')})}]},value:r('ToleranceValue',{Magnitude:unsigned(1)})}]).canonicalValue()):empty;
 const original=runtimeModule.createAdaptationRuntime;let captured:ReturnType<typeof original>|undefined;
 const capture=vi.spyOn(runtimeModule,'createAdaptationRuntime').mockImplementation((...args)=>{captured=original(...args);return captured;});
 const reads=vi.spyOn(ContractReadProjection.prototype,'read');
 try{
  const run=await createCampaign2Run(model,{initialState:initial,orderedInputs:inputs([fact(gated?1:0),fact(gated?1:0)]),runSeed:new Uint8Array(32)}),before=captured!.snapshot();
  await expect(run.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:'ADAPTATION_TARGET_COLLISION'}));expect(reads).not.toHaveBeenCalled();
  const after=captured!.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
  for(const field of ['clock','queue','allocators','outputs','committedTrace'] as const)expect(after[field]).toEqual(before[field]);
 }finally{reads.mockRestore();capture.mockRestore();}
});

it('AD-E7: same-path target/gate retains two ordered distinct-accessor reads for absent, zero-count and false-gate cases',async()=>{
 const model=await prepareCampaign2Model(singleRule(true));
 for(const [prior,count] of [[0,1],[0,0],[1,1]]){
  const initial=prior?enc(new AuthoritativeState([{path:{rootStateTypeId:302n,fieldId:1n,selectors:[{kind:'mapKey',key:r('ToleranceKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:id(1029,'variable/fixture-regulation')})}]},value:r('ToleranceValue',{Magnitude:unsigned(prior)})}]).canonicalValue()):empty;
  const run=await createCampaign2Run(model,{initialState:initial,orderedInputs:inputs([fact(count)]),runSeed:new Uint8Array(32)});await run.settleNextInstant();
  const trace=rec(items(decodeCampaign2(run.snapshot().trace),'list')[8],160n),reads=items(f(trace,11n),'list').map(v=>rec(v,147n));
  expect(reads).toHaveLength(2);expect(reads.map(v=>f(v,1n))).toEqual([id(1028,'accessor/adaptation-target-prior'),id(1028,'accessor/adaptation-gate-prior')]);
  expect(f(reads[0],2n)).toEqual(f(reads[1],2n));expect(reads.map(v=>f(v,3n))).toEqual([prior>0,prior>0]);
  if(prior)expect(f(reads[0],4n)).toEqual(r('ToleranceValue',{Magnitude:unsigned(prior)}));
  if(prior||count===0)expect(run.snapshot().state).toEqual(initial);
 }
});

it('AD-E6: noncolliding regulatory/procedural event permutation preserves settled state',async()=>{
 const model=await prepareCampaign2Model(firstTraceModel()),states=[];
 for(const facts of [[fact(1),fact(2,true)],[fact(2,true),fact(1)]]){
  const run=await createCampaign2Run(model,{initialState:empty,orderedInputs:inputs(facts),runSeed:new Uint8Array(32)});await run.settleNextInstant();
  const snapshot=run.snapshot();expect(items(decodeCampaign2(snapshot.trace),'list')).toHaveLength(18);expect(restoreAuthoritativeState(decodeCampaign2(snapshot.state)).entries()).toHaveLength(5);states.push(snapshot.state);
 }expect(states[0]).toEqual(states[1]);
});
