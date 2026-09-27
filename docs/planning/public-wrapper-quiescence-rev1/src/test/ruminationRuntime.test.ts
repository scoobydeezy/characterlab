import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {applyStatePatch} from '../substrate/state';
import {compileRuminationModel,compileRuminationInputs,ruminationRecipe,historyPath,concernPath,owner} from '../campaign3/ruminationModel';
import {ruminationRecord as r} from '../campaign3/ruminationCodecs';
import {createRuminationRuntime} from '../campaign3/ruminationRuntime';
import {createRuminationRun,prepareRuminationModel} from '../campaign3/ruminationFactory';
import {ruminationCases,ruminationInputs,seed} from './ruminationFixtures';
const records=(xs:readonly CanonicalValue[],t:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
async function run(name:keyof ReturnType<typeof ruminationCases>='main',candidate=1){const m=await compileRuminationModel(ruminationRecipe({candidate})),i=await compileRuminationInputs(m,enc(m.initial.canonicalValue()),ruminationInputs(ruminationCases()[name]),seed),s=createRuminationRuntime(m,i);while(await s.settle()){}return s.snapshot();}
const ev=(s:Awaited<ReturnType<typeof run>>)=>records(s.outputs,1318n);
it('recurs after admitted evidence, releases for interruption, rebounds, then resolves on the next opportunity',async()=>{
 const s=await run(),e=ev(s);expect(e.map(v=>f(v,7n))).toEqual([false,false,false,true,false,true,true,false]);expect(e.map(v=>f(v,5n))).toEqual([false,false,false,false,true,false,false,true]);
 expect(items(f(rec(f(e[2],6n),1329n),1n),'list')).toHaveLength(0);expect(items(f(rec(f(e[3],6n),1329n),1n),'list')).toHaveLength(1);
 for(const i of [4,5,6])expect(f(e[i],6n)).toEqual(f(e[3],6n));expect(items(f(rec(f(e[7],6n),1329n),1n),'list')).toHaveLength(2);
 expect(items(f(rec(s.state.read(historyPath).value!,820n),1n),'list')).toHaveLength(3);
 for(const h of records(s.outputs,837n).slice(3))expect(f(h,4n)).toEqual(f(h,5n));
},60000);
it('distinguishes recurrence, no recurrence, static load and a competing schedule with equal evidence',async()=>{
 const all=await Promise.all([1,2,3,4].map(c=>run('main',c))),es=all.map(ev);
 expect(es[1].every(e=>f(e,7n)===false&&f(e,9n)===false)).toBe(true);expect(es[2].every(e=>f(e,7n)===false)).toBe(true);expect(f(es[2][4],9n)).toBe(true);expect(f(es[2][4],5n)).toBe(false);
 expect(es[3].map(e=>f(e,7n))).toEqual([false,false,false,true,false,true,false,false]);
 for(const s of all.slice(1))expect(s.state.read(concernPath).value).toEqual(all[0].state.read(concernPath).value);
 for(const e of es.slice(1))for(let i=0;i<8;i++){expect(f(e[i],1n)).toEqual(f(es[0][i],1n));expect(f(e[i],2n)).toEqual(f(es[0][i],2n));}
},60000);
it('uses actual options, dice, intent and execution while retained habit and goals stay fixed',async()=>{
 const s=await run(),options=records(s.outputs,827n),choices=records(s.outputs,1322n),executions=records(s.outputs,1327n);
 expect(options.map(x=>items(f(x,3n),'list').length)).toEqual([1,1,1,2,1,2,2,1]);
 const p=items(f(choices[3],4n),'list').map(x=>f(rec(x,421n),2n));expect(p).toHaveLength(2);expect(p[0]).toEqual(p[1]);expect(items(f(choices[3],6n),'list').length).toBeGreaterThan(0);
 expect(f(executions[4],3n)).toBe(false);expect(f(executions[7],3n)).toBe(false);expect(executions.slice(3).some(x=>f(x,3n)===true)).toBe(true);
 for(const [t,phase] of [[1318n,40n],[1322n,60n],[1323n,70n],[1324n,80n],[1327n,110n],[1328n,120n],[1331n,140n]]){const traces=s.trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),t).length);expect(traces.length).toBeGreaterThan(0);for(const v of traces)expect(f(rec(f(v,4n),130n),3n)).toEqual(u(phase));}
},60000);
it('external and recurrent load share a bounded consumer but differ under interruption and release',async()=>{
 const a=ev(await run()),b=ev(await run('externalLoad')),c=ev(await run('dualLoad'));expect(f(a[3],5n)).toEqual(f(b[3],5n));expect(f(a[4],5n)).toBe(true);expect(f(b[4],5n)).toBe(false);expect(f(c[4],7n)).toBe(false);expect(f(c[4],5n)).toBe(false);expect(f(c[7],9n)).toBe(false);expect(f(c[7],5n)).toBe(false);
},60000);
it('never resolves from absent or hidden evidence; retirement changes goal without deleting concern history',async()=>{
 const a=ev(await run('unresolved')),b=ev(await run('hiddenResolution'));expect(a.map(x=>f(x,7n))).toEqual(b.map(x=>f(x,7n)));expect(f(a[7],7n)).toBe(true);
 const retirement=await run('retirement');expect(f(ev(retirement)[7],2n)).toBe(false);expect(items(f(rec(retirement.state.read(concernPath).value!,1329n),1n),'list')).toHaveLength(2);
 expect(ev(await run('noGoal')).every(x=>f(x,5n)===false)).toBe(true);expect(records((await run('noHistory')).outputs,827n).slice(3).every(x=>items(f(x,3n),'list').length===1)).toBe(true);
},60000);
it('preserves whole public views under truth, reward, false resolution, denied and nonrecipient changes',async()=>{
 async function view(name:keyof ReturnType<typeof ruminationCases>){const source=ruminationRecipe(),m=await compileRuminationModel(source),s=await createRuminationRun(await prepareRuminationModel(source),{initialState:enc(m.initial.canonicalValue()),orderedInputs:ruminationInputs(ruminationCases()[name]),runSeed:seed});while(await s.settleNextInstant()){}return s.observerView();}
 const main=await view('main');for(const n of ['hiddenTruth','hiddenReward','falseResolution'] as const)expect(await view(n)).toEqual(main);const absent=await view('absent');expect(await view('denied')).toEqual(absent);expect(await view('nonrecipient')).toEqual(absent);expect(await view('hiddenResolution')).toEqual(await view('unresolved'));
},120000);
it('source timing and denied control operations do not create retroactive access',async()=>{
 const late=ev(await run('lateOpen'));expect(f(late[3],7n)).toBe(false);expect(f(late[4],7n)).toBe(false);expect(f(late[5],7n)).toBe(true);expect(f(ev(await run('boardDenied'))[4],8n)).toBe(false);expect(f(ev(await run('boardDenied'))[4],7n)).toBe(true);
},60000);
it('rejects concern mutation by workspace owner and malformed or forged evidence',async()=>{
 const m=await compileRuminationModel(ruminationRecipe()),prior=m.initial.read(concernPath).value!;expect(()=>applyStatePatch(m.initial,{operations:[{kind:'set',path:concernPath,expected:{presence:true,value:prior},newValue:r(1329,[list([])])}]},owner('appraise'),m.authority)).toThrow();
 await expect(compileRuminationInputs(m,enc(list([])),ruminationInputs(ruminationCases().main),seed)).rejects.toThrow('INITIAL_STATE');expect(()=>ruminationInputs([{at:1,display:3}])).toThrow();
});
