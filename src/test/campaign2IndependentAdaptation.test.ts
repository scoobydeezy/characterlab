import {it,expect} from 'vitest';
import {canonicalEncode,list,set,record,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run,campaign2ModelIdentity} from '../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
const enc=canonicalEncode,character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
const variable=candidateId(1029,'variable/fixture-regulation'),load=candidateId(1033,'load/fixture-load');
function initial(prior:number){
 const keys=[r('ToleranceKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:variable}),r('SensitizationKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:variable}),r('RegulatoryAdaptationKey',{CharacterId:character,RegulatoryVariableId:variable}),r('AccumulatedLoadKey',{CharacterId:character,LoadDomainId:load})];
 const names=['ToleranceValue','SensitizationValue','RegulatoryAdaptationValue','AccumulatedLoadValue'];
 return enc(new AuthoritativeState(prior===0?[]:keys.map((k,i)=>({path:{rootStateTypeId:302n,fieldId:BigInt(i+1),selectors:[{kind:'mapKey' as const,key:k}]},value:r(names[i],{Magnitude:i===2?signed(prior):unsigned(prior)})}))).canonicalValue());
}
const manifest=(count:number)=>enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(count)})}),list([])])]));
/** Independent bounded scalar oracle: repeated unit increments; no production rule/math/read/patch compiler. */
function reference(prior:number,count:number,step:number){let result=prior;for(let i=0;i<count;i++)result+=step;return {valid:result>=0&&result<=10,magnitudes:result===0?[]:[result,result,result,result],effectiveOperations:count===0?0:4};}
it.each([1,-1])('FCT-6 bounded execution comparison: step %i, every prior 0..10 and count 0..12',async(step)=>{
 const source=firstTraceModel();
 if(step<0){
  const slots=[...items(decodeCampaign2(source.registry),'list')];
  slots[0]=set(items(slots[0],'set').map(v=>{
   if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;
   const definition=f(v,4n);
   if(typeof definition==='boolean'||definition.kind!=='record'||definition.schema.typeId!==311n)return v;
   return record(v.schema,new Map([...v.fields,[4n,record(definition.schema,new Map([...definition.fields,[6n,signed(step)]]))]]));
  }));source.registry=enc(list(slots));
 }
 const model=await prepareCampaign2Model(source);let accepted=0,rejected=0;
 for(let prior=0;prior<=10;prior++)for(let count=0;count<=12;count++){
  const oracle=reference(prior,count,step),run=await createCampaign2Run(model,{initialState:initial(prior),orderedInputs:manifest(count),runSeed:new Uint8Array(32)}),before=run.snapshot();
  if(!oracle.valid){await expect(run.settleNextInstant()).rejects.toThrow();const after=run.snapshot();expect(after.state).toEqual(before.state);expect(after.outputs).toEqual(before.outputs);expect(after.trace).toEqual(before.trace);expect(after.clock).toBe(0n);rejected++;continue;}
  await run.settleNextInstant();accepted++;
  const state=restoreAuthoritativeState(decodeCampaign2(run.snapshot().state)),magnitudes=state.entries().slice().sort((a,b)=>Number(a.path.fieldId-b.path.fieldId)).map(e=>Number((f(rec(e.value,296n+e.path.fieldId),1n) as {value:bigint}).value));
  expect(magnitudes,`${prior}+${count}`).toEqual(oracle.magnitudes);
  const traces=items(decodeCampaign2(run.snapshot().trace),'list'),t=rec(traces[8],160n),reads=items(f(t,11n),'list'),ops=items(f(rec(f(t,16n),144n),1n),'list'),diffs=items(f(t,17n),'list');
  expect(traces).toHaveLength(9);expect(reads).toHaveLength(4);expect(ops).toHaveLength(oracle.effectiveOperations);expect(diffs).toHaveLength(oracle.effectiveOperations);
  for(const op of ops)expect(rec(op,oracle.magnitudes.length===0?146n:145n).schema.typeId).toBe(oracle.magnitudes.length===0?146n:145n);
  for(const read of reads){const value=rec(read,147n);expect(f(value,3n)).toBe(prior>0);if(prior>0)expect((f(value,4n) as Extract<CanonicalValue,{kind:'record'}>).fields.get(1n)).toEqual(expect.objectContaining({value:BigInt(prior)}));}
 }
 expect({accepted,rejected}).toEqual({accepted:66,rejected:77});
},30000);
it('VAL-C: changing one committed rule step changes only its witnessed behavior and model/registry identity',async()=>{
 const source=firstTraceModel(),changed={...source},slots=[...items(decodeCampaign2(source.registry),'list')];
 const entries=items(slots[0],'set').map(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n||key(f(v,1n))!==key(candidateId(1035,'rule/fixture-tolerance')))return v;
  const rule=rec(f(v,4n),311n);return record(v.schema,new Map([...v.fields,[4n,record(rule.schema,new Map([...rule.fields,[6n,signed(2)]]))]]));
 });slots[0]=set(entries);changed.registry=enc(list(slots));
 const a=await prepareCampaign2Model(source),b=await prepareCampaign2Model(changed),ai=rec(decodeCampaign2(campaign2ModelIdentity(a)),103n),bi=rec(decodeCampaign2(campaign2ModelIdentity(b)),103n);
 expect(campaign2ModelIdentity(a)).not.toEqual(campaign2ModelIdentity(b));expect(f(ai,6n)).not.toEqual(f(bi,6n));for(const n of [1n,2n,3n,4n,5n])expect(f(ai,n)).toEqual(f(bi,n));
 const args={initialState:initial(0),orderedInputs:manifest(2),runSeed:new Uint8Array(32)};
 const one=await createCampaign2Run(a,args),two=await createCampaign2Run(b,args);await one.settleNextInstant();await two.settleNextInstant();
 const leaves=(run:typeof one)=>restoreAuthoritativeState(decodeCampaign2(run.snapshot().state)).entries().slice().sort((a,b)=>Number(a.path.fieldId-b.path.fieldId));
 const x=leaves(one),y=leaves(two);expect(f(rec(x[0].value,297n),1n)).toEqual(unsigned(2));expect(f(rec(y[0].value,297n),1n)).toEqual(unsigned(4));expect(x.slice(1)).toEqual(y.slice(1));
});
