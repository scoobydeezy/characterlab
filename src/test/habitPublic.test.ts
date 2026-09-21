import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,map,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {habitRecipe,compileHabitModel,compileHabitInputs,STAGES,eventId,stageReads,historyPath,beliefPath,cachePath,OBSERVER,OPTIONS,type HabitSettings} from '../campaign3/habitModel';
import {createHabitRuntime} from '../campaign3/habitRuntime';
import {prepareHabitModel,createHabitRun,restoreHabitRun} from '../campaign3/habitFactory';
import {decodeHabit as decode,habitRecord as r} from '../campaign3/habitCodecs';
import {habitSummary,appendHabit} from '../campaign3/habitMath';
import {habitInputs,habitScenario,type Opportunity} from './habitFixtures';
import {applyStatePatch,AuthoritativeState,statePathValue} from '../substrate/state';
const seed=new Uint8Array(32),rows=(xs:readonly CanonicalValue[],t:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
async function setup(settings:Partial<HabitSettings>={},xs:readonly Opportunity[]=habitScenario()){const source=habitRecipe(settings),model=await compileHabitModel(source),initialState=enc(model.initial.canonicalValue()),orderedInputs=habitInputs(xs),input=await compileHabitInputs(model,initialState,orderedInputs,seed);return {source,model,initialState,orderedInputs,input};}
async function run(settings:Partial<HabitSettings>={},xs:readonly Opportunity[]=habitScenario()){const x=await setup(settings,xs),r=await createHabitRun(await prepareHabitModel(x.source),{initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed});while(await r.settleNextInstant()){}return {...x,run:r,outputs:items(decode(r.snapshot().outputs),'list')};}
it('preserves separate expectation and acquired availability through correction and reversal',async()=>{
 const a=await run(),b=await run({},habitScenario().map(x=>x.at<=3?{...x,reward:false}:x)),apps=rows(a.outputs,826n),other=rows(b.outputs,826n);expect(f(apps[4],6n)).toEqual(f(other[4],6n));expect(f(apps[4],5n)).not.toEqual(f(other[4],5n));const probabilities=rows(a.outputs,830n).map(d=>items(f(d,4n),'list').find(p=>key(f(rec(p,421n),1n))===key(OPTIONS[0])));expect(probabilities[4]).toBeDefined();expect(probabilities.at(-1)).toBeUndefined();
 const h=rows(a.outputs,837n);expect(f(h[3],3n)).toBe(false);expect(f(h[3],4n)).toEqual(f(h[3],5n));
},180000);
it('replays stored summaries as exactly the same cognitive outputs as derived history',async()=>{
 for(const law of [1,2,3]){const a=await run({law}),b=await run({law,candidate:2});expect(a.outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId!==839n)).toEqual(b.outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId!==839n));}
},300000);
it('audits full state reads, fixed contributors and observation-only mutation routes',async()=>{
 const x=await setup({candidate:2}),runtime=createHabitRuntime(x.model,x.input);while(await runtime.settle()){}for(const [name] of STAGES){const ts=runtime.snapshot().trace.map(v=>rec(v,160n)).filter(t=>key(f(t,7n))===key(eventId(name)));for(const t of ts)expect(items(f(t,11n),'list').map(v=>f(rec(v,147n),2n))).toEqual(stageReads(name,x.model.settings).map(statePathValue));}
 expect([6n,7n,8n].map(n=>f(x.model.content,n))).toEqual([q(1,1),q(0,1),q(0,1)]);expect(runtime.snapshot().state.entries().every(e=>[821n,823n,825n].includes(e.path.rootStateTypeId))).toBe(true);
 const state=runtime.snapshot().state,prior=state.read(historyPath).value!;expect(()=>applyStatePatch(state,{operations:[{kind:'set',path:historyPath,expected:{presence:true,value:prior},newValue:prior}]},OBSERVER,x.model.authority)).toThrow();const corrupted=new AuthoritativeState(state.entries().map(e=>e.path.rootStateTypeId===825n?{...e,value:habitSummary({candidate:2,law:3},prior)}:e));expect(()=>x.model.validateState(corrupted)).toThrow();
},180000);
it('rejects invalid ingress, duplicate history and forged complete saves',async()=>{
 const x=await setup(),handle=await prepareHabitModel(x.source),args={initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed},run=await createHabitRun(handle,args);for(let i=0;i<5;i++)await run.settleNextInstant();const save=run.save(),restored=await restoreHabitRun(x.source,{initialState:x.initialState,orderedInputs:x.orderedInputs,save});await run.settleNextInstant();await restored.settleNextInstant();expect(restored.save()).toEqual(run.save());
 for(const field of [8n,11n,12n]){const saved=rec(decode(save),132n),fields=new Map(saved.fields);fields.set(field,field===8n?map([]):list([]));await expect(restoreHabitRun(x.source,{initialState:x.initialState,orderedInputs:x.orderedInputs,save:enc({...saved,fields})})).rejects.toThrow();}
 for(const xs of [[{at:0}],[{at:33}],[{at:1},{at:1}],Array.from({length:17},(_,i)=>({at:i+1}))])await expect(setup({},xs)).rejects.toThrow();await expect(createHabitRun(handle,{...args,orderedInputs:enc(list([OPTIONS[0]]))})).rejects.toThrow();let called=false;await expect(createHabitRun(handle,{...args,get runSeed(){called=true;return seed;}})).rejects.toThrow();expect(called).toBe(false);
 const observation=rows(items(decode(run.snapshot().outputs),'list'),836n)[0],journal=appendHabit(r(820,[list([])]),observation).next;expect(()=>appendHabit(journal,observation)).toThrow('DUPLICATE');
},180000);
it('rolls back all fourteen stages and commit, including random draws and cached history',async()=>{
 for(const name of [...STAGES.map(([n])=>n),'commit']){const x=await setup({candidate:2}),r=createHabitRuntime(x.model,x.input);for(let i=0;i<4;i++)await r.settle();const before=r.snapshot();let reached=false;await expect(r.settleForConformance({onBoundary(b,e){if(name==='commit'?b==='before-commit':b==='after-trace-validation'&&e!==undefined&&key(e.eventTypeId)===key(eventId(name))){reached=true;throw Error('habit fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=r.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['queue','allocators','outputs','trace'] as const)expect(after[k]).toEqual(before[k]);}
},300000);

