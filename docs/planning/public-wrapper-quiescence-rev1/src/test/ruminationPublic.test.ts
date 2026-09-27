import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeRumination as decode} from '../campaign3/ruminationCodecs';
import {compileRuminationModel,compileRuminationInputs,ruminationRecipe,historyPath,beliefPath,goalPath,STAGES,eventId} from '../campaign3/ruminationModel';
import {createRuminationRuntime} from '../campaign3/ruminationRuntime';
import {prepareRuminationModel,createRuminationRun,restoreRuminationRun} from '../campaign3/ruminationFactory';
import {ruminationCases,ruminationInputs,seed} from './ruminationFixtures';
const records=(xs:readonly unknown[],t:bigint)=>xs.filter((v:any)=>v?.kind==='record'&&v.schema.typeId===t).map((v:any)=>rec(v,t));
async function setup(name:keyof ReturnType<typeof ruminationCases>='main',candidate=1,law=1){const source=ruminationRecipe({candidate,law}),m=await compileRuminationModel(source),initialState=enc(m.initial.canonicalValue()),orderedInputs=ruminationInputs(ruminationCases()[name]),i=await compileRuminationInputs(m,initialState,orderedInputs,seed);return {source,m,initialState,orderedInputs,r:createRuminationRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof ruminationCases>='main',candidate=1,law=1){const s=await setup(name,candidate,law);while(await s.r.settle()){}return s;}
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after acquired history`,async()=>{
 const s=await setup();for(let i=0;i<3;i++)await s.r.settle();const before=s.r.snapshot();let reached=false;
 await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('rumination fault');}}})).rejects.toThrow();
 expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
},30000);
it('rejects edited saves, changed originals, readoption and forged model handles',async()=>{
 const s=await setup(),r=await createRuminationRun(await prepareRuminationModel(s.source),{initialState:s.initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const saved=rec(decode(r.save()),132n),fields=new Map(saved.fields);fields.set(11n,list([]));
 await expect(restoreRuminationRun(s.source,{initialState:s.initialState,orderedInputs:s.orderedInputs,save:enc(record(saved.schema,fields))})).rejects.toThrow();
 await expect(restoreRuminationRun(s.source,{initialState:s.initialState,orderedInputs:ruminationInputs(ruminationCases().absent),save:r.save()})).rejects.toThrow();
 await expect(compileRuminationInputs(s.m,s.initialState,ruminationInputs([{at:1,instruction:1},{at:2,instruction:1}]),seed)).rejects.toThrow('READOPTION');
 await expect(createRuminationRun({} as any,{initialState:s.initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow('MODEL_HANDLE');expect(()=>r.observerView(1)).toThrow();
});
