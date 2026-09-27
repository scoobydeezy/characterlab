import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,record,unsigned,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState,statePathPatternValue} from '../substrate/state';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId as id,candidatePattern} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
const variable=id(1029,'variable/fixture-regulation'),load=id(1033,'load/fixture-load'),procedure=id(1034,'procedure/fixture-practice');
const names=['tolerance','sensitization','regulatory-displacement','accumulated-load','procedural-competence'];
const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields,[n,x]]));};
function specimen(index:number,step:bigint,unbounded=false){
 const source=firstTraceModel(),slots=[...items(decodeCampaign2(source.registry),'list')],ruleId=id(1035,`rule/fixture-${names[index]}`);
 slots[0]=set(items(slots[0],'set').flatMap(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return [v];
  const d=f(v,4n);if(typeof d==='boolean'||d.kind!=='record')return [v];
  if(d.schema.typeId===311n)return key(f(v,1n))===key(ruleId)?[replace(v,4n,replace(d,6n,signed(step)))]:[];
  if(d.schema.typeId===318n){
   const ext=rec(f(d,5n),317n),matches=key(f(v,1n))===key(id(1009,index===4?'transition/procedural-adaptation':'transition/regulatory-adaptation'));
   return [replace(v,4n,replace(replace(d,5n,replace(ext,2n,replace(f(ext,2n),1n,set(matches?[ruleId]:[])))),3n,replace(f(d,3n),2n,set(matches?[statePathPatternValue(candidatePattern(index))]:[]))))];
  }
  if(unbounded&&d.schema.typeId===287n)return [replace(v,4n,replace(d,2n,r('LoadCapacity',{VariantTag:unsigned(1)})))];
  return [v];
 }));return {...source,registry:enc(list(slots))};
}
function path(index:number){
 const k=index<2?r(index===0?'ToleranceKey':'SensitizationKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:variable}):index===3?r('AccumulatedLoadKey',{CharacterId:character,LoadDomainId:load}):r('ProceduralCompetenceKey',{CharacterId:character,ProcedureId:procedure});
 return {rootStateTypeId:index===4?303n:302n,fieldId:BigInt(index===4?1:index+1),selectors:[{kind:'mapKey' as const,key:k}]};
}
const value=(index:number,n:bigint)=>r(['ToleranceValue','SensitizationValue','RegulatoryAdaptationValue','AccumulatedLoadValue','ProceduralCompetenceValue'][index],{Magnitude:unsigned(n)});
async function run(index:number,p:bigint,step:bigint,count:bigint,unbounded=false){
 const model=await prepareCampaign2Model(specimen(index,step,unbounded));
 const initial=new AuthoritativeState(p===0n?[]:[{path:path(index),value:value(index,p)}]);
 const fact=index===4?r('ProceduralPracticeFact',{CharacterId:character,ProcedureId:procedure,CompletedRepetitions:unsigned(count)}):r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(count)});
 return createCampaign2Run(model,{initialState:enc(initial.canonicalValue()),orderedInputs:enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:fact}),list([])])])),runSeed:new Uint8Array(32)});
}
it.each([0,1,3,4])('AD-E9 unsigned leaf %i rejects exact q=-1 without a clamp or partial commit',async index=>{
 const instance=await run(index,0n,-1n,1n),before=instance.snapshot();
 await expect(instance.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:'ADAPTATION_MAGNITUDE_OUT_OF_RANGE'}));
 const after=instance.snapshot();for(const field of ['state','trace','outputs','clock'] as const)expect(after[field]).toEqual(before[field]);
});
it.each([0,3])('AD-E9 bounded leaf %i admits exact maximum and rejects maximum+1',async index=>{
 const valid=await run(index,9n,1n,1n);await valid.settleNextInstant();
 expect(restoreAuthoritativeState(decodeCampaign2(valid.snapshot().state)).entries()).toEqual([{path:path(index),value:value(index,10n)}]);
 const invalid=await run(index,10n,1n,1n),before=invalid.snapshot();
 await expect(invalid.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:'ADAPTATION_MAGNITUDE_OUT_OF_RANGE'}));
 const after=invalid.snapshot();for(const field of ['state','trace','outputs','clock'] as const)expect(after[field]).toEqual(before[field]);
});
it.each([0,1,3,4])('AD-E9 leaf %i normalizes exact zero to one Remove and absent zero to no operation',async index=>{
 for(const p of [1n,0n]){
  const instance=await run(index,p,-1n,p);await instance.settleNextInstant();
  expect(restoreAuthoritativeState(decodeCampaign2(instance.snapshot().state)).entries()).toEqual([]);
  const traces=items(decodeCampaign2(instance.snapshot().trace),'list').map(v=>rec(v,160n));
  const ops=traces.flatMap(t=>items(f(rec(f(t,16n),144n),1n),'list'));
  expect(ops).toHaveLength(Number(p));if(p===1n)expect(rec(ops[0],146n).schema.typeId).toBe(146n);
 }
});
it.each([1,3,4])('AD-E9 unbounded leaf %i preserves exact large q beyond scale without a second leaf',async index=>{
 const large=10n**30n,instance=await run(index,large,1n,1n,index===3);await instance.settleNextInstant();
 expect(restoreAuthoritativeState(decodeCampaign2(instance.snapshot().state)).entries()).toEqual([{path:path(index),value:value(index,large+1n)}]);
 const traces=items(decodeCampaign2(instance.snapshot().trace),'list').map(v=>rec(v,160n));
 const ops=traces.flatMap(t=>items(f(rec(f(t,16n),144n),1n),'list'));
 expect(ops).toHaveLength(1);expect(rec(ops[0],145n).schema.typeId).toBe(145n);
});
