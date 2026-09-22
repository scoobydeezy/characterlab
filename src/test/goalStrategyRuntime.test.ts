import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,unsigned as u} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileGoalStrategyModel,compileGoalStrategyInputs,goalStrategyRecipe,STAGES,eventId,owner,path} from '../campaign3/goalStrategyModel';
import {createGoalStrategyRuntime} from '../campaign3/goalStrategyRuntime';
import {goalStrategyObserverView} from '../campaign3/goalStrategyMath';
import {goalStrategyRecord as r} from '../campaign3/goalStrategyCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,original,display,ordered,initialState,seed,records} from './goalStrategyFixtures';
async function run(name:keyof ReturnType<typeof cases>='main',law=1) {
  const model=await compileGoalStrategyModel(goalStrategyRecipe(law)),input=await compileGoalStrategyInputs(model,initialState,ordered(cases()[name]),seed),runtime=createGoalStrategyRuntime(model,input);
  while(await runtime.settle()){}return runtime;
}
const routes=(runtime:Awaited<ReturnType<typeof run>>)=>records(runtime.snapshot().outputs,1001n).map(v=>Number((f(v,6n) as {value:bigint}).value));
it('uses one adopted goal through A/B switching, a no-route gap and resumption',async()=>{
  const runtime=await run(),evaluations=records(runtime.snapshot().outputs,1001n);
  expect(routes(runtime)).toEqual([0,1,1,2,0,2,0]);
  expect(evaluations.map(v=>f(v,5n))).toEqual([false,true,true,true,true,true,false]);
  const goals=evaluations.slice(1,6).map(v=>items(f(v,3n),'list')[0]);goals.forEach(g=>expect(g).toEqual(goals[0]));
  expect(runtime.snapshot().randomAddresses).toEqual([]);
  const completion=records(runtime.snapshot().outputs,1003n)[5];expect(f(completion,3n)).toEqual(u(2));expect(f(completion,4n)).toBe(true);expect(f(rec(items(f(evaluations[6],3n),'list')[0],993n),2n)).toEqual(u(2));
},30000);
it('keeps failure and hidden cause out of route/goal inference',async()=>{
  const a=await run('retained'),b=await run('hiddenCause');
  expect(goalStrategyObserverView(a.snapshot().outputs)).toEqual(goalStrategyObserverView(b.snapshot().outputs));
  const no=await run('noOutcome'),success=await run('hiddenSuccess');
  expect(goalStrategyObserverView(no.snapshot().outputs)).toEqual(goalStrategyObserverView(success.snapshot().outputs));
},30000);
it('fulfills from perceived desired state, including external or false attainment, not hidden truth',async()=>{
  for(const name of ['fulfilled','external','falseCriterion'] as const){const runtime=await run(name);expect(routes(runtime).at(-1)).toBe(0);const goal=items(f(records(runtime.snapshot().outputs,1004n)[1],3n),'list')[0];expect(f(rec(goal,993n),2n)).toEqual(u(2));}
  const hidden=await run('hiddenExternal'),absent=await run('absentExternal');expect(goalStrategyObserverView(hidden.snapshot().outputs)).toEqual(goalStrategyObserverView(absent.snapshot().outputs));
  const simultaneous=await run('adoptionCriterion');expect(f(records(simultaneous.snapshot().outputs,1001n).at(-1)!,5n)).toBe(true);
},30000);
it('retains missing/expired distinctions, deduplicates and hides denied sources from later provenance',async()=>{
  const expiry=await run('expiry');expect(f(records(expiry.snapshot().outputs,1001n).at(-1)!,8n)).toEqual(u(1));
  const denied=await run('denied'),absent=await run('noDisplay');expect(goalStrategyObserverView(denied.snapshot().outputs)).toEqual(goalStrategyObserverView(absent.snapshot().outputs));
  const duplicate=await run('duplicate');expect(items(f(rec(f(records(duplicate.snapshot().outputs,1006n).at(-1)!,3n),997n),1n),'list')).toHaveLength(1);
  expect(routes(await run('noAdoption'))).toEqual([0,0,0]);
},30000);
it('distinguishes goal-as-plan, fixed-route and failure-abandonment controls',async()=>{
  expect(routes(await run('main',2))).toEqual([0,1,1,2,0,0,0]);
  expect(routes(await run('main',3))).toEqual([0,1,1,1,1,1,1]);
  expect(routes(await run('main',4))).toEqual([0,1,0,0,0,0,0]);
},30000);
it('checks actual phase producers before qualification',async()=>{
  const runtime=await run();
  for(const [type,phase] of [[1001n,40n],[1005n,90n],[1002n,100n],[1003n,110n],[998n,120n],[999n,130n],[1004n,140n],[1006n,140n]]){
    const traces=runtime.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length>0);
    expect(traces.length).toBeGreaterThan(0);for(const trace of traces)expect(f(rec(f(trace,4n),130n),3n)).toEqual(u(phase));
  }
},30000);
for(const stage of [...STAGES.map(([name])=>name),'commit'])it(`rolls back ${stage} from prior adopted state`,async()=>{
  const model=await compileGoalStrategyModel(goalStrategyRecipe()),input=await compileGoalStrategyInputs(model,initialState,ordered(cases().main),seed),runtime=createGoalStrategyRuntime(model,input);await runtime.settle();const before=runtime.snapshot();let reached=false;
  await expect(runtime.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('goal fault');}}})).rejects.toThrow();
  expect(reached).toBe(true);const after=runtime.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const field of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[field]).toEqual(before[field]);expect(()=>runtime.save()).toThrow();
},30000);
it('rejects readoption, forged initial state, receipt conflict and foreign writers',async()=>{
  const m=await compileGoalStrategyModel(goalStrategyRecipe());
  await expect(compileGoalStrategyInputs(m,initialState,ordered([original(1),original(2,{adopt:true})]),seed)).rejects.toThrow('READOPTION');
  await expect(compileGoalStrategyInputs(m,enc(list([])),ordered(cases().main),seed)).rejects.toThrow('INITIAL_STATE');
  await expect(compileGoalStrategyInputs(m,initialState,ordered([original(1,{displays:[display(1,1,true)]}),original(2,{displays:[display(1,1,false)]})]),seed)).rejects.toThrow('CONFLICT');
  expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(1000),expected:{presence:false},newValue:r(997,[list([]),list([])])}]},owner('goal'),m.authority)).toThrow();
});
