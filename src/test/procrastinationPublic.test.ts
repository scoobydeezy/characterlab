import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeProcrastination as decode} from '../campaign3/procrastinationCodecs';
import {compileProcrastinationModel,compileProcrastinationInputs,procrastinationRecipe,historyPath,beliefPath,goalPath,STAGES,eventId} from '../campaign3/procrastinationModel';
import {createProcrastinationRuntime} from '../campaign3/procrastinationRuntime';
import {prepareProcrastinationModel,createProcrastinationRun,restoreProcrastinationRun} from '../campaign3/procrastinationFactory';
import {procrastinationCases,procrastinationInputs,seed} from './procrastinationFixtures';
const records=(xs:readonly unknown[],t:bigint)=>xs.filter((v:any)=>v?.kind==='record'&&v.schema.typeId===t).map((v:any)=>rec(v,t));
async function setup(name:keyof ReturnType<typeof procrastinationCases>='main',candidate=1,law=1){const source=procrastinationRecipe({candidate,law}),m=await compileProcrastinationModel(source),initialState=enc(m.initial.canonicalValue()),orderedInputs=procrastinationInputs(procrastinationCases()[name]),i=await compileProcrastinationInputs(m,initialState,orderedInputs,seed);return {source,m,initialState,orderedInputs,r:createProcrastinationRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof procrastinationCases>='main',candidate=1,law=1){const s=await setup(name,candidate,law);while(await s.r.settle()){}return s;}
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after acquired history`,async()=>{
 const s=await setup();for(let i=0;i<3;i++)await s.r.settle();const before=s.r.snapshot();let reached=false;
 await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('procrastination fault');}}})).rejects.toThrow();
 expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
},30000);
it('rejects edited saves, changed originals, readoption and forged model handles',async()=>{
 const s=await setup(),r=await createProcrastinationRun(await prepareProcrastinationModel(s.source),{initialState:s.initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const saved=rec(decode(r.save()),132n),fields=new Map(saved.fields);fields.set(11n,list([]));
 await expect(restoreProcrastinationRun(s.source,{initialState:s.initialState,orderedInputs:s.orderedInputs,save:enc(record(saved.schema,fields))})).rejects.toThrow();
 await expect(restoreProcrastinationRun(s.source,{initialState:s.initialState,orderedInputs:procrastinationInputs(procrastinationCases().unknown),save:r.save()})).rejects.toThrow();
 await expect(compileProcrastinationInputs(s.m,s.initialState,procrastinationInputs([{at:1,instruction:1},{at:2,instruction:1}]),seed)).rejects.toThrow('READOPTION');
 await expect(createProcrastinationRun({} as any,{initialState:s.initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow('MODEL_HANDLE');expect(()=>r.observerView(1)).toThrow();
});
