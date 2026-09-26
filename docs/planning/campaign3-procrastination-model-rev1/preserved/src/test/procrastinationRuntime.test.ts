import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {applyStatePatch} from '../substrate/state';
import {compileProcrastinationModel,compileProcrastinationInputs,procrastinationRecipe,historyPath,forecastPath,owner} from '../campaign3/procrastinationModel';
import {procrastinationRecord as r} from '../campaign3/procrastinationCodecs';
import {createProcrastinationRuntime} from '../campaign3/procrastinationRuntime';
import {createProcrastinationRun,prepareProcrastinationModel} from '../campaign3/procrastinationFactory';
import {procrastinationCases,procrastinationInputs,seed} from './procrastinationFixtures';
const records=(xs:readonly CanonicalValue[],t:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
async function run(name:keyof ReturnType<typeof procrastinationCases>='main',candidate=1){const m=await compileProcrastinationModel(procrastinationRecipe({candidate})),i=await compileProcrastinationInputs(m,enc(m.initial.canonicalValue()),procrastinationInputs(procrastinationCases()[name]),seed),s=createProcrastinationRuntime(m,i);while(await s.settle()){}return s.snapshot();}
const ev=(s:Awaited<ReturnType<typeof run>>)=>records(s.outputs,1360n);
it('keeps feasible accessible work as a positive reason while an immediate motive earns actual postponement',async()=>{
 const s=await run(),e=ev(s),raw=records(s.outputs,1362n),choices=records(s.outputs,1364n),execution=records(s.outputs,1369n);expect(f(e[1],2n)).toBe(true);expect(f(e[1],3n)).toBe(true);expect(f(e[1],5n)).toBe(true);expect(f(e[1],7n)).toBe(true);
 const signals=items(f(raw[1],3n),'list');expect(signals).toHaveLength(2);expect(f(rec(signals[0],402n),1n)).not.toEqual(f(rec(signals[1],402n),1n));expect(f(rec(signals[0],402n),2n)).not.toEqual(f(rec(signals[1],402n),2n));
 const postponed=choices.slice(1,5).some((c,i)=>f(e[i+1],2n)===true&&f(e[i+1],3n)===true&&f(e[i+1],5n)===true&&key(f(c,7n))!==key(items(f(rec(f(raw[i+1],2n),1376n),3n),'list')[0]));expect(postponed).toBe(true);
 expect(execution.slice(1,6).some(x=>f(x,3n)===true)).toBe(true);expect(records(s.outputs,1361n).some(v=>(f(rec(f(v,2n),1356n),2n) as {value:bigint}).value>=2n)).toBe(true);
},60000);
it('retains no-temporal-bias, present-focused and no-immediate-motive comparisons',async()=>{
 const all=await Promise.all([1,2,3,4].map(c=>run('main',c))),es=all.map(ev);expect(f(es[1][1],7n)).toBe(false);expect(f(es[2][1],7n)).toBe(true);expect(items(f(records(all[3].outputs,1362n)[1],3n),'list')).toHaveLength(1);
 expect(f(records(all[0].outputs,1364n)[1],4n)).not.toEqual(f(records(all[1].outputs,1364n)[1],4n));
 const goal=rec(f(records(all[3].outputs,1361n)[3],2n),1356n);expect(f(goal,2n)).toEqual(u(2));expect(f(goal,4n)).toEqual(u(3));
},60000);
it('distinguishes unknown and unavailable future evidence, and correction changes only later valuation',async()=>{
 const unknown=ev(await run('unknown')),unavailable=ev(await run('unavailableFuture')),corrected=ev(await run('corrected')),present=ev(await run('unknown',3));expect(f(unknown[1],8n)).toBe(false);expect(f(unavailable[1],8n)).toBe(true);expect(f(unavailable[1],9n)).toEqual(u(1));expect(f(unknown[1],7n)).toBe(false);expect(f(present[1],7n)).toBe(true);expect(f(corrected[2],7n)).toBe(true);expect(f(corrected[3],7n)).toBe(false);
 expect(f(ev(await run())[5],7n)).toBe(false);
},60000);
it('does not rename missing access, infeasibility or cancellation as procrastination',async()=>{
 for(const name of ['noAccess','unavailableNow','noGoal'] as const){const s=await run(name),e=ev(s);expect(items(f(records(s.outputs,1376n)[1],3n),'list')).toHaveLength(1);expect(items(f(records(s.outputs,1362n)[1],3n),'list')).toHaveLength(1);expect(f(e[1],name==='noAccess'?3n:name==='noGoal'?2n:5n)).toBe(false);}
 const cancelled=await run('cancelled');expect(f(rec(f(records(cancelled.outputs,1361n)[2],2n),1356n),2n)).toEqual(u(3));expect(f(ev(cancelled)[3],2n)).toBe(false);
 const lost=ev(await run('lostAccess'));expect(f(lost[2],2n)).toBe(true);expect(f(lost[2],3n)).toBe(false);expect(f(lost[4],3n)).toBe(true);
},60000);
it('separates actual progress, perceived progress and deadline failure from intent',async()=>{
 const s=await run('deniedExecution'),updates=records(s.outputs,1361n);expect(f(rec(f(updates[5],2n),1356n),2n)).toEqual(u(4));expect(f(rec(f(updates[5],2n),1356n),4n)).toEqual(u(0));expect(records(s.outputs,1369n).some(v=>f(v,3n)===true)).toBe(true);
 const a=await run(),b=await run('falseForecast');expect(records(a.outputs,1364n).slice(0,5)).toEqual(records(b.outputs,1364n).slice(0,5));expect(f(ev(b)[5],5n)).toBe(false);
},60000);
it('preserves whole later safe views for false unit outcomes and denied source/physical changes',async()=>{
 async function view(name:keyof ReturnType<typeof procrastinationCases>){const source=procrastinationRecipe(),m=await compileProcrastinationModel(source),s=await createProcrastinationRun(await prepareProcrastinationModel(source),{initialState:enc(m.initial.canonicalValue()),orderedInputs:procrastinationInputs(procrastinationCases()[name]),runSeed:seed});while(await s.settleNextInstant()){}return s.observerView();}
 expect(await view('main')).toEqual(await view('falseUnitOutcome'));expect(await view('unknown')).toEqual(await view('denied'));expect(await view('deniedExecution')).toEqual(await view('hiddenPhysical'));
},120000);
it('checks actual phases and immutable historical outputs',async()=>{
 const s=await run();for(const [t,phase] of [[1360n,40n],[1376n,50n],[1364n,60n],[1365n,70n],[1366n,80n],[1369n,110n],[1370n,120n],[1373n,140n],[1361n,140n]]){const traces=s.trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),t).length);expect(traces.length).toBeGreaterThan(0);for(const v of traces)expect(f(rec(f(v,4n),130n),3n)).toEqual(u(phase));}
},60000);
it('rejects foreign forecast mutation, invalid reports and instructed-action shortcuts',async()=>{
 const m=await compileProcrastinationModel(procrastinationRecipe()),prior=m.initial.read(forecastPath).value!;expect(()=>applyStatePatch(m.initial,{operations:[{kind:'set',path:forecastPath,expected:{presence:true,value:prior},newValue:r(1371,[list([])])}]},owner('appraise'),m.authority)).toThrow();await expect(compileProcrastinationInputs(m,enc(m.initial.canonicalValue()),procrastinationInputs([{at:1,mode:1}]),seed)).rejects.toThrow('FREE_PROBE_ONLY');expect(()=>procrastinationInputs([{at:1,future:3}])).toThrow();
});
