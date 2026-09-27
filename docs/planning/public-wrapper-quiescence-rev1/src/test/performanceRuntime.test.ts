import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,unsigned as u} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compilePerformanceModel,compilePerformanceInputs,performanceRecipe,STAGES,eventId,owner,path} from '../campaign3/performanceModel';
import {createPerformanceRuntime} from '../campaign3/performanceRuntime';
import {performanceObserverView} from '../campaign3/performanceMath';
import {performanceRecord as r} from '../campaign3/performanceCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,original,display,ordered,initialState,seed,records} from './performanceFixtures';
async function run(name:keyof ReturnType<typeof cases>='main',law=1) {
  const model=await compilePerformanceModel(performanceRecipe(law)),input=await compilePerformanceInputs(model,initialState,ordered(cases()[name]),seed),runtime=createPerformanceRuntime(model,input);
  while(await runtime.settle()){}return runtime;
}
const routes=(runtime:Awaited<ReturnType<typeof run>>)=>records(runtime.snapshot().outputs,1304n).map(v=>Number((f(v,6n) as {value:bigint}).value));
it('switches after two observed failures with goal and availability unchanged, then actually executes B',async()=>{
 const s=await run(),e=records(s.snapshot().outputs,1304n);expect(routes(s)).toEqual([0,1,1,2,2,2,2,2]);
 expect(e.map(v=>Number((f(v,11n) as {value:bigint}).value))).toEqual([0,0,1,2,0,0,0,0]);expect(e[3].fields.get(12n)).toBe(true);
 const goals=e.slice(1).map(v=>items(f(v,3n),'list')[0]);goals.forEach(g=>expect(g).toEqual(goals[0]));for(const v of e.slice(1)){expect(f(v,8n)).toEqual(u(3));expect(f(v,9n)).toEqual(u(3));}
 const execution=records(s.snapshot().outputs,1306n)[3];expect(f(execution,3n)).toEqual(u(2));expect(f(execution,4n)).toBe(true);expect(records(s.snapshot().outputs,1305n)).toHaveLength(7);expect(s.snapshot().randomAddresses).toEqual([]);
});
it('held physical outcomes with positive or transient feedback change later strategy, not prior attempts',async()=>{
 const base=await run(),positive=await run('positiveFeedback'),transient=await run('transientFailure');
 expect(routes(positive)).toEqual([0,1,1,1,1,1,1,1]);expect(routes(transient)).toEqual(routes(positive));
 expect(records(transient.snapshot().outputs,1305n).slice(0,2)).toEqual(records(base.snapshot().outputs,1305n).slice(0,2));
 expect(routes(await run('transientFailure',3))[2]).toBe(2);expect(routes(await run('main',2))).toEqual(routes(positive));
},60000);
it('missing feedback is neither repeated failure nor success; gaps preserve the admitted count',async()=>{
 expect(routes(await run('noFeedback'))).toEqual([0,1,1,1,1,1,1,1]);expect(routes(await run('oneHiddenFailure'))).toEqual([0,1,1,1,1,1,1,1]);
 const s=await run('gappedFailures');expect(routes(s)).toEqual([0,1,1,1,1,2,2,2]);expect(records(s.snapshot().outputs,1304n).slice(2,5).map(v=>f(v,11n))).toEqual([u(1),u(1),u(1)]);
});
it('old failures cannot trigger a new visit, and no alternative never abandons the goal',async()=>{
 const repeated=await run('repeatFailures');expect(routes(repeated)).toEqual([0,1,1,2,2,1,1,2]);expect(f(records(repeated.snapshot().outputs,1304n)[6],11n)).toEqual(u(1));
 const no=await run('noAlternative');expect(routes(no)).toEqual([0,1,1,1,1,1,1,1]);expect(f(records(no.snapshot().outputs,1304n)[7],5n)).toBe(true);
});
it('no attempt supplies no feedback and desired-state fulfillment stays independent of performance',async()=>{
 const no=await run('noAdoption');expect(routes(no)).toEqual(Array(8).fill(0));expect(records(no.snapshot().outputs,1301n).filter(o=>(f(o,4n) as {value:bigint}).value===3n)).toHaveLength(0);
 expect(routes(await run('fulfilled'))).toEqual([0,1,1,2,0,0,0,0]);expect(routes(await run('external'))).toEqual([0,1,0,0,0,0,0,0]);
});
it('whole later views exclude hidden causes, successful execution behind false feedback, and denied sources',async()=>{
 const view=(s:Awaited<ReturnType<typeof run>>)=>performanceObserverView(s.snapshot().outputs);
 const base=await run();expect(view(await run('hiddenCause'))).toEqual(view(base));expect(view(await run('falseFailure'))).toEqual(view(base));
 expect(view(await run('noFeedback'))).toEqual(view(await run('hiddenDenied')));expect(view(await run('deniedDisplay'))).toEqual(view(await run('noDisplay')));
 expect(view(await run('noFeedback',4))).not.toEqual(view(await run('hiddenDenied',4)));
},120000);
it('checks actual phase producers and immutability before qualification',async()=>{
 const m=await compilePerformanceModel(performanceRecipe()),i=await compilePerformanceInputs(m,initialState,ordered(cases().main),seed),runtime=createPerformanceRuntime(m,i);for(let j=0;j<3;j++)await runtime.settle();const before=runtime.snapshot().outputs.slice();while(await runtime.settle()){}expect(runtime.snapshot().outputs.slice(0,before.length)).toEqual(before);
 for(const [type,phase] of [[1304n,40n],[1308n,90n],[1305n,100n],[1306n,110n],[1301n,120n],[1302n,130n],[1307n,140n],[1309n,140n]]){
 const traces=runtime.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length>0);expect(traces.length).toBeGreaterThan(0);for(const t of traces)expect(f(rec(f(t,4n),130n),3n)).toEqual(u(phase));}
});
for(const stage of [...STAGES.map(([name])=>name),'commit'])it(`rolls back ${stage} from prior adopted state`,async()=>{
  const model=await compilePerformanceModel(performanceRecipe()),input=await compilePerformanceInputs(model,initialState,ordered(cases().main),seed),runtime=createPerformanceRuntime(model,input);for(let j=0;j<3;j++)await runtime.settle();const before=runtime.snapshot();let reached=false;
  await expect(runtime.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('goal fault');}}})).rejects.toThrow();
  expect(reached).toBe(true);const after=runtime.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const field of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[field]).toEqual(before[field]);expect(()=>runtime.save()).toThrow();
},30000);
it('rejects readoption, forged initial state, receipt conflict and foreign writers',async()=>{
  const m=await compilePerformanceModel(performanceRecipe());
  await expect(compilePerformanceInputs(m,initialState,ordered([original(1),original(2,{adopt:true})]),seed)).rejects.toThrow('READOPTION');
  await expect(compilePerformanceInputs(m,enc(list([])),ordered(cases().main),seed)).rejects.toThrow('INITIAL_STATE');
  await expect(compilePerformanceInputs(m,initialState,ordered([original(1,{displays:[display(1,1,true)]}),original(2,{displays:[display(1,1,false)]})]),seed)).rejects.toThrow('CONFLICT');
  expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(1303),expected:{presence:false},newValue:r(1300,[list([]),list([])])}]},owner('goal'),m.authority)).toThrow();
});
