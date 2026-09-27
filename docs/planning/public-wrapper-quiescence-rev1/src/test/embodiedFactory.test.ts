import {describe,it,expect} from 'vitest';
import freeze from '../../docs/planning/campaign3-embodied-model-rev2/FREEZE.json';
import oldRegistry from '../../docs/planning/campaign3-embodied-model/baseline/registry.cenc.hex?raw';
import {embodiedFixtureBytes as bytes} from './embodiedFixtures';
import {prepareEmbodiedModel,createEmbodiedRun,restoreEmbodiedRun} from '../campaign3/embodiedFactory';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {canonicalEncode as enc,record,list,set,unsigned,signed,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
const source=(name='baseline')=>({...freeze.versions,content:bytes(name+'/content.cenc.hex'),registry:bytes(name+'/registry.cenc.hex'),parameters:bytes(name+'/parameters.cenc.hex')});
const input=(name='baseline')=>({initialState:bytes('runs/'+name+'/initial-state.cenc.hex'),orderedInputs:bytes('runs/'+name+'/ordered-inputs.cenc.hex'),runSeed:new Uint8Array(32)});
const replace=(v:CanonicalValue,n:bigint,value:CanonicalValue)=>{const r=rec(v,(v as {schema:{typeId:bigint}}).schema.typeId);return record(r.schema,new Map([...r.fields].map(([k,x])=>[k,k===n?value:x])));};
describe('EMB public data-only construction and complete-prefix persistence',()=>{
 it('rejects the historical field-1 pressure cohort before activation',async()=>{
  const registry=Uint8Array.from(oldRegistry.trim().match(/../g)!.map(x=>Number.parseInt(x,16)));
  await expect(prepareEmbodiedModel({...source(),registry})).rejects.toThrow();
 });
 it('rejects forged handles, executable input properties and getters without calling them',async()=>{
  await expect(createEmbodiedRun({} as never,input())).rejects.toThrow();
  const model=await prepareEmbodiedModel(source());let called=false;
  const bad={...input(),get handler(){called=true;return ()=>{};}};
  await expect(createEmbodiedRun(model,bad)).rejects.toThrow();expect(called).toBe(false);
  const promise=createEmbodiedRun(model,input());const run=await promise;
  expect(Object.keys(run).sort()).toEqual(['diagnostic','runIdentity','save','settleNextInstant','snapshot']);
 });
 it('snapshots model and run bytes at entry and returns detached byte snapshots',async()=>{
  const s=source(),promise=prepareEmbodiedModel(s);s.registry.fill(0);const model=await promise;
  const i=input(),pending=createEmbodiedRun(model,i);i.initialState.fill(0);i.orderedInputs.fill(0);i.runSeed.fill(1);
  const run=await pending;expect(run.runIdentity()).toEqual(bytes('runs/baseline/run-identity.cenc.hex'));
  const original=run.snapshot().state;run.snapshot().state.fill(0);expect(run.snapshot().state).toEqual(original);
 });
 it('restores every whole-instant prefix to the exact uninterrupted final save',async()=>{
  const model=await prepareEmbodiedModel(source()),run=await createEmbodiedRun(model,input()),saves=[run.save()];
  while(await run.settleNextInstant())saves.push(run.save());const expected=run.save();expect(saves).toHaveLength(7);
  for(const save of saves){const restored=await restoreEmbodiedRun(source(),{initialState:input().initialState,orderedInputs:input().orderedInputs,save});while(await restored.settleNextInstant()){}expect(restored.save()).toEqual(expected);}
 },20000);
 it('rejects changed pending originals, counters, metadata, body, history and partial-instant archives',async()=>{
  const run=await createEmbodiedRun(await prepareEmbodiedModel(source()),input());await run.settleNextInstant();await run.settleNextInstant();
  const save=rec(decode(run.save()),132n),queue=items(f(save,7n),'list'),trace=items(f(save,11n),'list');
  const variants=[replace(save,1n,text('save/other')),replace(save,4n,signed(41)),replace(save,5n,list([])),
   replace(save,6n,replace(f(save,6n),1n,unsigned(999))),replace(save,7n,list(queue.slice(1))),
   replace(save,7n,list([...queue,queue[0]])),replace(save,7n,list(queue.map((e,i)=>i?e:replace(e,2n,signed(42))))),
   replace(save,7n,list([...queue,f(rec(trace[1],160n),4n)])),
   replace(save,7n,list(queue.filter(e=>Number((f(rec(e,130n),3n) as {value:bigint}).value)!==110))),
   replace(save,8n,list([true])),replace(save,9n,list([true])),replace(save,10n,list([true])),
   replace(save,11n,list(trace.slice(0,-1))),replace(save,12n,list([]))];
  for(const bad of variants)await expect(restoreEmbodiedRun(source(),{initialState:input().initialState,orderedInputs:input().orderedInputs,save:enc(bad)})).rejects.toBeInstanceOf(SaveContractError);
 },20000);
 it('does not reinterpret history under a different admitted model or initial state',async()=>{
  const run=await createEmbodiedRun(await prepareEmbodiedModel(source()),input());await run.settleNextInstant();
  for(const [s,i] of [[source('coarser'),input()],[source(),input('hidden89')]] as const)
   await expect(restoreEmbodiedRun(s,{initialState:i.initialState,orderedInputs:i.orderedInputs,save:run.save()})).rejects.toBeInstanceOf(SaveContractError);
 });
 it('rejects malformed/missing body and roster state before any source execution',async()=>{
  const model=await prepareEmbodiedModel(source()),i=input(),state=items(decode(i.initialState),'set');
  const body=state.find(v=>(f(rec(f(rec(v,151n),1n),140n),1n) as {value:bigint}).value===455n)!;
  for(const initialState of [enc(set([])),enc(set(state.filter(v=>v!==body))),enc(set(state.map(v=>v===body?replace(v,2n,replace(f(rec(v,151n),2n),2n,signed(1))):v)))])await expect(createEmbodiedRun(model,{...i,initialState})).rejects.toThrow();
 });
 it('normalizes incompatible restore source and invalid initial-state admission to SaveContractError',async()=>{
  const i=input(),run=await createEmbodiedRun(await prepareEmbodiedModel(source()),i);
  await expect(restoreEmbodiedRun({...source(),rulesVersion:'rules/other'},{initialState:i.initialState,orderedInputs:i.orderedInputs,save:run.save()})).rejects.toBeInstanceOf(SaveContractError);
  await expect(restoreEmbodiedRun(source(),{initialState:enc(list([])),orderedInputs:i.orderedInputs,save:run.save()})).rejects.toBeInstanceOf(SaveContractError);
 });
});
