import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {applyStatePatch} from '../substrate/state';
import {compileFatigueModel,compileFatigueInputs,fatigueRecipe,historyPath,fatiguePath,owner} from '../campaign3/fatigueModel';
import {fatigueRecord as r} from '../campaign3/fatigueCodecs';
import {createFatigueRuntime} from '../campaign3/fatigueRuntime';
import {createFatigueRun,prepareFatigueModel} from '../campaign3/fatigueFactory';
import {fatigueCases,fatigueInputs,seed} from './fatigueFixtures';
const records=(xs:readonly CanonicalValue[],t:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
async function run(name:keyof ReturnType<typeof fatigueCases>='main',candidate=1){const m=await compileFatigueModel(fatigueRecipe({candidate})),i=await compileFatigueInputs(m,enc(m.initial.canonicalValue()),fatigueInputs(fatigueCases()[name]),seed),s=createFatigueRuntime(m,i);while(await s.settle()){}return s.snapshot();}
const ev=(s:Awaited<ReturnType<typeof run>>)=>records(s.outputs,1339n);
it('experienced fatigue impairs later inhibition, persists without feedback and releases after admitted recovery',async()=>{
 const s=await run(),e=ev(s);expect(e.map(v=>f(v,7n))).toEqual([false,false,false,false,true,true,true,false]);expect(e.map(v=>f(v,5n))).toEqual([false,false,false,true,false,false,false,true]);
 expect(f(e[2],8n)).toBe(false);expect(f(e[3],8n)).toBe(true);expect(f(e[3],9n)).toEqual(u(0));expect(f(e[4],9n)).toEqual(u(2));for(const i of [5,6])expect(f(e[i],6n)).toEqual(f(e[4],6n));
 expect(items(f(rec(s.state.read(historyPath).value!,820n),1n),'list')).toHaveLength(3);for(const h of records(s.outputs,837n).slice(3))expect(f(h,4n)).toEqual(f(h,5n));
},60000);
it('keeps known-rested and unknown distinct and missing onset cannot establish fatigue',async()=>{
 const absent=ev(await run('absent')),rested=ev(await run('rested')),missing=ev(await run('missingOnset'));expect(absent.every(v=>f(v,8n)===false)).toBe(true);expect(f(rested[3],8n)).toBe(true);expect(f(rested[3],9n)).toEqual(u(0));expect(missing.every(v=>f(v,7n)===false)).toBe(true);expect(f(ev(await run('missingRecovery'))[7],7n)).toBe(true);
},60000);
it('retains no-fatigue, motor-only and lower-threshold comparisons under identical experience',async()=>{
 const all=await Promise.all([1,2,3,4].map(c=>run('main',c))),es=all.map(ev);for(const c of [1,2])expect(es[c].every(v=>f(v,7n)===false)).toBe(true);expect(es[3].map(v=>f(v,7n))).toEqual(es[0].map(v=>f(v,7n)));
 for(const s of all.slice(1))expect(s.state.read(fatiguePath).value).toEqual(all[0].state.read(fatiguePath).value);const mild=ev(await run('mild')),sensitive=ev(await run('mild',4));expect(f(mild[4],7n)).toBe(false);expect(f(sensitive[4],7n)).toBe(true);
 for(const e of es.slice(1))for(let i=0;i<8;i++)expect(f(e[i],1n)).toEqual(f(es[0][i],1n));
},60000);
it('fatigue and external load affect control through distinct operands and retain actual choice/execution',async()=>{
 const s=await run(),e=ev(s),load=ev(await run('externalLoad')),options=records(s.outputs,827n),executions=records(s.outputs,1348n);expect(options.map(x=>items(f(x,3n),'list').length)).toEqual([1,1,1,1,2,2,2,1]);expect(f(e[4],4n)).toBe(false);expect(f(load[4],4n)).toBe(true);expect(f(load[4],7n)).toBe(false);expect(e.map(v=>f(v,5n))).toEqual(load.map(v=>f(v,5n)));
 expect(f(executions[3],3n)).toBe(false);expect(f(executions[7],3n)).toBe(false);expect(executions.slice(4,7).some(v=>f(v,3n)===true)).toBe(true);
},60000);
it('motor-only impairment changes actual execution without changing its prior intended exercise',async()=>{
 const a=await run('motorChallenge'),b=await run('motorChallenge',3);expect(records(a.outputs,1344n)[3]).toEqual(records(b.outputs,1344n)[3]);expect(records(a.outputs,1345n)[3]).toEqual(records(b.outputs,1345n)[3]);expect(f(records(a.outputs,1348n)[3],3n)).toBe(true);expect(f(records(b.outputs,1348n)[3],3n)).toBe(false);
},60000);
it('holds whole safe views fixed under false fatigue/recovery, hidden reward and denied sources',async()=>{
 async function view(name:keyof ReturnType<typeof fatigueCases>){const source=fatigueRecipe(),m=await compileFatigueModel(source),s=await createFatigueRun(await prepareFatigueModel(source),{initialState:enc(m.initial.canonicalValue()),orderedInputs:fatigueInputs(fatigueCases()[name]),runSeed:seed});while(await s.settleNextInstant()){}return s.observerView();}
 const main=await view('main');for(const n of ['falseFatigue','falseRecovery','hiddenReward'] as const)expect(await view(n)).toEqual(main);expect(await view('denied')).toEqual(await view('absent'));
},120000);
it('checks actual phase producers, goal lifecycle and absence of learned history',async()=>{
 const s=await run();for(const [t,phase] of [[1339n,40n],[1343n,60n],[1344n,70n],[1345n,80n],[1348n,110n],[1349n,120n],[1352n,140n]]){const traces=s.trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),t).length);expect(traces.length).toBeGreaterThan(0);for(const v of traces)expect(f(rec(f(v,4n),130n),3n)).toEqual(u(phase));}
 expect(ev(await run('noGoal')).every(v=>f(v,5n)===false)).toBe(true);expect(f(ev(await run('retirement'))[6],2n)).toBe(false);expect(records((await run('noHistory')).outputs,827n).slice(3).every(v=>items(f(v,3n),'list').length===1)).toBe(true);
},60000);
it('rejects a workspace mutation of fatigue experience, unknown grades and forged initial state',async()=>{
 const m=await compileFatigueModel(fatigueRecipe()),prior=m.initial.read(fatiguePath).value!;expect(()=>applyStatePatch(m.initial,{operations:[{kind:'set',path:fatiguePath,expected:{presence:true,value:prior},newValue:r(1350,[list([])])}]},owner('appraise'),m.authority)).toThrow();await expect(compileFatigueInputs(m,enc(list([])),fatigueInputs(fatigueCases().main),seed)).rejects.toThrow('INITIAL_STATE');expect(()=>fatigueInputs([{at:1,physical:3}])).toThrow();
});
