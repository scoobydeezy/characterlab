import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {workRecipe,compileWorkModel,compileWorkInputs,type WorkSettings,cachePath,journalPath,taskPath,TASKS,eventId} from '../campaign3/workModel';
import {createWorkRuntime} from '../campaign3/workRuntime';
import {createWorkRun,prepareWorkModel,restoreWorkRun} from '../campaign3/workFactory';
import {decodeWork as decode,workRecord as r} from '../campaign3/workCodecs';
import {receivingRecord as old} from '../campaign3/receivingCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {workInputs,workScenario,type Board} from './workFixtures';
const seed=new Uint8Array(32);
async function setup(settings:Partial<WorkSettings>={},boards:readonly Board[]=workScenario()){const source=workRecipe(settings),model=await compileWorkModel(source),initialState=enc(model.initial.canonicalValue()),orderedInputs=workInputs(boards),input=await compileWorkInputs(model,initialState,orderedInputs,seed);return {source,model,initialState,orderedInputs,input};}
const rows=(xs:readonly CanonicalValue[],t:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
it('only the declared owner can write each leaf and indexed models reject workspace state',async()=>{
 const x=await setup(),other=await setup({candidate:2}),foreign=old(372,[u(1)]);
 expect(()=>other.model.validateState(new AuthoritativeState([...other.model.initial.entries(),{path:cachePath,value:r(781,[list([])])}]))).toThrow('PATH');
 const id=x.model.authority;
 // A valid task write attempted with the workspace owner must fail independently
 // of the leaf grammar or expected-prior check.
 const authority=(await import('../campaign3/workModel')).owner('workspace');
 expect(()=>applyStatePatch(x.model.initial,{operations:[{kind:'set',path:taskPath(TASKS[0]),expected:{presence:true,value:foreign},newValue:old(372,[u(3)])}]},authority,id)).toThrow();
 expect(()=>x.model.validateState(new AuthoritativeState([...x.model.initial.entries(),{path:journalPath,value:r(781,[list([])])}]))).toThrow();
});
it('closed codecs forbid new records in typed slots and malformed priority/identity data',()=>{
 const card=r(767,[u(1),true,u(2)]),fields=new Map(card.fields);fields.set(2n,r(781,[list([])]));expect(()=>decode(enc({...card,fields}))).toThrow();
 const inherited=rec(old(439,[q(1,4),u(3)]),439n);const wrong=new Map(inherited.fields);wrong.set(2n,r(781,[list([])]));expect(()=>decode(enc({...inherited,fields:wrong}))).toThrow();
 expect(()=>r(767,[u(4),true,u(2)])).toThrow();expect(()=>r(767,[u(1),true,u(4)])).toThrow();
});
it('exact input data rejects excess history, nonmonotone times, unexpected fields and forged model bytes',async()=>{
 const x=await setup(),handle=await prepareWorkModel(x.source),args={initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed};
 for(const boards of [[{at:0}],[{at:11}],[{at:2},{at:1}],Array.from({length:9},(_,i)=>({at:i+1}))])await expect(createWorkRun(handle,{...args,orderedInputs:workInputs(boards)})).rejects.toThrow();
 await expect(createWorkRun(handle,{...args,extra:1} as never)).rejects.toThrow();await expect(prepareWorkModel({...x.source,parameters:x.source.parameters.slice(1)})).rejects.toThrow();
});
it('gaps, deadline-only instants and removed cards preserve stored/indexed equivalence',async()=>{
 const boards:Board[]=[{at:1,priorities:[3,2,1]},{at:3,priorities:[0,3,2],visible:[false,true,true]},{at:5,priorities:[0,3,2],cue:true},{at:8,priorities:[3,2,1],cue:true}];
 const a=await setup({},boards),b=await setup({candidate:2},boards),ra=createWorkRuntime(a.model,a.input),rb=createWorkRuntime(b.model,b.input);
 while(await ra.settle()){await rb.settle();expect(enc(list(ra.snapshot().outputs))).toEqual(enc(list(rb.snapshot().outputs)));}expect(await rb.settle()).toBeUndefined();
 const selected=rows(ra.snapshot().outputs,773n).map(w=>f(w,4n));expect(selected).toEqual([[],[1],[2],[3]].map(ns=>list(ns.map(u))));
},120000);
it('records actual cache reads only in StoredSet and preserves the strictly later source boundary',async()=>{
 for(const candidate of [1,2]){const x=await setup({candidate}),runtime=createWorkRuntime(x.model,x.input);await runtime.settle();const first=runtime.snapshot();expect(f(rows(first.outputs,773n)[0],4n)).toEqual(list([]));await runtime.settle();const traces=runtime.snapshot().trace.map(v=>rec(v,160n));
  // Trace fields are governed by trace/0.2-candidate; actual reads are field11.
  const workTraces=traces.filter(v=>key(f(v,7n))===key(eventId('workspace')));
  expect(workTraces).toHaveLength(2);
  const reads=workTraces.flatMap(v=>items(f(v,11n),'list'));
  const roots=reads.map(v=>rec(f(rec(v,147n),2n),140n).fields.get(1n));
  expect(roots.some(v=>key(v!)===key(u(772)))).toBe(candidate===1);
 }
},120000);
