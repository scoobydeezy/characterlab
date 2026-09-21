import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,unsigned as u,map,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {workRecipe,compileWorkModel,compileWorkInputs,type WorkSettings,STAGES,OPTIONS,eventId} from '../campaign3/workModel';
import {createWorkRuntime} from '../campaign3/workRuntime';
import {createWorkRun,prepareWorkModel,restoreWorkRun} from '../campaign3/workFactory';
import {decodeWork as decode,workRecord as r} from '../campaign3/workCodecs';
import {workInputs,workScenario,type Board} from './workFixtures';
const seed=new Uint8Array(32);
const rows=(values:readonly CanonicalValue[],t:bigint)=>values.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
async function setup(settings:Partial<WorkSettings>={},boards:readonly Board[]=workScenario()){const source=workRecipe(settings),model=await compileWorkModel(source),initialState=enc(model.initial.canonicalValue()),orderedInputs=workInputs(boards);return {source,model,initialState,orderedInputs};}
async function run(settings:Partial<WorkSettings>={},boards:readonly Board[]=workScenario()){const x=await setup(settings,boards),run=await createWorkRun(await prepareWorkModel(x.source),{initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed});while(await run.settleNextInstant()){}return {...x,run,outputs:items(decode(run.snapshot().outputs),'list')};}
const selected=(x:Awaited<ReturnType<typeof run>>)=>rows(x.outputs,773n).map(v=>f(v,4n));
it('displaces or protects under actual overload, preserves retained status, and restores only unexpired intention',async()=>{
 const a=await run({support:false}),b=await run({support:true});
 expect(selected(a)).toEqual([[],[1],[2],[2],[1],[3],[3]].map(ns=>list(ns.map(u))));
 expect(selected(b)).toEqual([[],[1],[1],[1],[1],[3],[3]].map(ns=>list(ns.map(u))));
 const wa=rows(a.outputs,773n),wb=rows(b.outputs,773n);expect(items(f(wa[2],3n),'list')).toHaveLength(3);expect(f(wa[2],8n)).toEqual(f(wb[2],8n));expect(f(wa[2],9n)).toEqual(list([u(2)]));
 expect(f(rows(a.outputs,776n)[2],8n)).toEqual(OPTIONS[1]);expect(f(rows(b.outputs,776n)[2],8n)).toEqual(OPTIONS[0]);
 expect(rows(a.outputs,776n)[6].fields.has(8n)).toBe(false);
},120000);
it('stored and indexed maintenance agree exactly without indexed cache reads or writes',async()=>{
 const a=await run(),b=await run({candidate:2});expect(a.run.snapshot().outputs).toEqual(b.run.snapshot().outputs);expect(a.run.snapshot().state).not.toEqual(b.run.snapshot().state);
 const trace=items(decode(b.run.snapshot().trace),'list');expect(trace.length).toBe(58);
},120000);
it('hidden truth, invisible alternatives, board visibility and physical ordering respect the source cut',async()=>{
 const a=await run(),b=await run({},workScenario().map(v=>({...v,hidden:true,order:[3,2,1]})));expect(a.run.snapshot().outputs).toEqual(b.run.snapshot().outputs);expect(a.run.snapshot().state).toEqual(b.run.snapshot().state);
 const c=await run({},workScenario().map(v=>({...v,board:false})));expect(selected(c).every(v=>items(v,'list').length===0)).toBe(true);
 const hidden=(p:number)=>workScenario().map(v=>({...v,visible:[true,true,false],priorities:[1,2,p]}));expect((await run({},hidden(0))).run.snapshot().outputs).toEqual((await run({},hidden(3))).run.snapshot().outputs);
},120000);
it('named negative controls fail distinct capacity, access, maintenance and expiry contrasts',async()=>{
 const unlimited=await run({candidate:4}),access=await run({candidate:5,support:false}),immortal=await run({candidate:6,support:false}),stateless=await run({candidate:3});
 expect(items(selected(unlimited)[1],'list')).toHaveLength(3);
 expect(f(rows(access.outputs,773n)[2],9n)).toEqual(list([u(1),u(2)]));expect(items(f(rows(access.outputs,775n)[2],3n),'list')).toHaveLength(2);
 expect(rows(immortal.outputs,776n)[6].fields.has(8n)).toBe(true);expect(selected(stateless)[2]).toEqual(list([u(2)]));
},120000);
it('rejects forged source, duplicate identities, foreign S0, getters and invalid model handles',async()=>{
 const x=await setup(),handle=await prepareWorkModel(x.source),input={initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed};
 await expect(createWorkRun({} as never,input)).rejects.toThrow('HANDLE');await expect(createWorkRun(handle,{...input,initialState:enc(map([]))})).rejects.toThrow('INITIAL');
 await expect(createWorkRun(handle,{...input,orderedInputs:enc(list([r(781,[list([])])]))})).rejects.toThrow();
 await expect(createWorkRun(handle,{...input,orderedInputs:workInputs([{at:1,order:[1,1]}])})).rejects.toThrow('DUPLICATE');
 let invoked=false;await expect(createWorkRun(handle,{...input,get runSeed(){invoked=true;return seed;}})).rejects.toThrow();expect(invoked).toBe(false);
},120000);
it('restores whole prefixes including addressed draws and rejects forged save state/trace/output',async()=>{
 const x=await setup({capacity:2}),run=await createWorkRun(await prepareWorkModel(x.source),{initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed});for(let i=0;i<3;i++)await run.settleNextInstant();const save=run.save(),restored=await restoreWorkRun(x.source,{initialState:x.initialState,orderedInputs:x.orderedInputs,save});expect(restored.save()).toEqual(save);await run.settleNextInstant();await restored.settleNextInstant();expect(restored.save()).toEqual(run.save());
 for(const field of [8n,11n,12n]){const saved=rec(decode(save),132n),fields=new Map(saved.fields);fields.set(field,field===8n?map([]):list([]));await expect(restoreWorkRun(x.source,{initialState:x.initialState,orderedInputs:x.orderedInputs,save:enc({...saved,fields})})).rejects.toThrow();}
},120000);
it('rolls back every stage and commit, including deadline retirement and allocated draws',async()=>{
 for(const name of [...STAGES.map(([n])=>n),'commit']){const x=await setup({capacity:2}),input=await compileWorkInputs(x.model,x.initialState,x.orderedInputs,seed),runtime=createWorkRuntime(x.model,input);for(let i=0;i<5;i++)await runtime.settle();const before=runtime.snapshot();let reached=false;
  await expect(runtime.settleForConformance({onBoundary(boundary,event){if(name==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event!==undefined&&key(event.eventTypeId)===key(eventId(name))){reached=true;throw Error('workspace fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=runtime.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['queue','allocators','outputs','trace'] as const)expect(after[k]).toEqual(before[k]);
 }
},300000);
