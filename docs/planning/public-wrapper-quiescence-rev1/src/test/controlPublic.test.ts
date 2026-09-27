import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeControl as decode} from '../campaign3/controlCodecs';
import {compileControlModel,compileControlInputs,controlRecipe,historyPath,beliefPath,goalPath,STAGES,eventId} from '../campaign3/controlModel';
import {createControlRuntime} from '../campaign3/controlRuntime';
import {prepareControlModel,createControlRun,restoreControlRun} from '../campaign3/controlFactory';
import {controlCases,controlInputs,seed} from './controlFixtures';
const records=(xs:readonly unknown[],t:bigint)=>xs.filter((v:any)=>v?.kind==='record'&&v.schema.typeId===t).map((v:any)=>rec(v,t));
async function setup(name:keyof ReturnType<typeof controlCases>='main',candidate=1,law=1){const source=controlRecipe({candidate,law}),m=await compileControlModel(source),initialState=enc(m.initial.canonicalValue()),orderedInputs=controlInputs(controlCases()[name]),i=await compileControlInputs(m,initialState,orderedInputs,seed);return {source,m,initialState,orderedInputs,r:createControlRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof controlCases>='main',candidate=1,law=1){const s=await setup(name,candidate,law);while(await s.r.settle()){}return s;}
it('inhibits under spare capacity, fails under load, recovers and preserves learned history',async()=>{
 const {r}=await run(),out=r.snapshot().outputs,c=records(out,1015n),options=records(out,827n);
 expect(c.map(x=>f(x,5n))).toEqual([false,false,false,true,false,true,true,false]);
 expect(options.map(x=>items(f(x,3n),'list').length)).toEqual([1,1,1,1,2,1,1,2]);
 const ps=records(out,1019n).map(x=>items(f(x,4n),'list').map(p=>f(rec(p,421n),2n)));
 expect(ps[4]).toHaveLength(2);expect(ps[4][0]).toEqual(ps[4][1]);
 const histories=records(out,837n);for(const h of histories.slice(3))expect(f(h,4n)).toEqual(f(h,5n));
 expect(items(f(rec(r.snapshot().state.read(historyPath).value!,820n),1n),'list')).toHaveLength(3);
 expect(f(rec(r.snapshot().state.read(beliefPath).value!,822n),1n)).toBe(true);
},30000);
it('distinguishes comparator failures and retains two learned laws',async()=>{
 const all=await Promise.all([1,2,3,4,5,6].map(c=>run('main',c)));
 const cs=all.map(s=>records(s.r.snapshot().outputs,1015n));
 expect(f(cs[1][3],5n)).toBe(false);expect(f(cs[2][4],5n)).toBe(true);
 expect(items(f(records(all[4].r.snapshot().outputs,827n)[7],3n),'list')).toHaveLength(1);
 expect(items(f(records(all[5].r.snapshot().outputs,827n)[4],3n),'list')).toHaveLength(1);
 const residual=rec(f(cs[0][3],1n),826n),linear=rec(f(records((await run('main',1,2)).r.snapshot().outputs,1015n)[3],1n),826n);
 expect(f(residual,5n)).not.toEqual(f(linear,5n));
 const a=await run('lost'),b=await run('lost',4);expect(f(records(a.r.snapshot().outputs,1015n)[4],5n)).toBe(false);expect(f(records(b.r.snapshot().outputs,1015n)[4],5n)).toBe(true);
},30000);
it('holds motives and habit constant under load, separates retention from maintenance',async()=>{
 const a=await run(),b=await run('noLoad'),lost=await run('lost');const ca=records(a.r.snapshot().outputs,1015n)[4],cb=records(b.r.snapshot().outputs,1015n)[4];
 expect(f(ca,1n)).toEqual(f(cb,1n));expect(f(ca,2n)).toEqual(f(cb,2n));expect(f(ca,3n)).toBe(true);expect(f(cb,3n)).toBe(true);
 const l=records(lost.r.snapshot().outputs,1015n);expect(f(l[4],2n)).toBe(true);expect(f(l[4],3n)).toBe(false);expect(f(l[5],3n)).toBe(true);
},30000);
it('checks actual phase producers and safe projections after hidden inputs',async()=>{
 const a=await run();for(const [t,p] of [[1015n,40n],[827n,50n],[1019n,60n],[1020n,70n],[1021n,80n],[1024n,110n],[836n,120n],[1016n,140n]])for(const trace of a.r.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),t).length))expect((f(rec(f(trace,4n),130n),3n) as any).value).toBe(p);
 for(const [x,y] of [['hidden','absent'],['main','hiddenReward']] as const){const sa=await setup(x),sb=await setup(y);const ra=await createControlRun(await prepareControlModel(sa.source),{initialState:sa.initialState,orderedInputs:sa.orderedInputs,runSeed:seed}),rb=await createControlRun(await prepareControlModel(sb.source),{initialState:sb.initialState,orderedInputs:sb.orderedInputs,runSeed:seed});while(await ra.settleNextInstant()){}while(await rb.settleNextInstant()){}expect(ra.observerView()).toEqual(rb.observerView());}
},30000);
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after acquired history`,async()=>{
 const s=await setup();for(let i=0;i<3;i++)await s.r.settle();const before=s.r.snapshot();let reached=false;
 await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('control fault');}}})).rejects.toThrow();
 expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
},30000);
it('rejects edited saves, changed originals, readoption and forged model handles',async()=>{
 const s=await setup(),r=await createControlRun(await prepareControlModel(s.source),{initialState:s.initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const saved=rec(decode(r.save()),132n),fields=new Map(saved.fields);fields.set(11n,list([]));
 await expect(restoreControlRun(s.source,{initialState:s.initialState,orderedInputs:s.orderedInputs,save:enc(record(saved.schema,fields))})).rejects.toThrow();
 await expect(restoreControlRun(s.source,{initialState:s.initialState,orderedInputs:controlInputs(controlCases().noLoad),save:r.save()})).rejects.toThrow();
 await expect(compileControlInputs(s.m,s.initialState,controlInputs([{at:1,instruction:1},{at:2,instruction:1}]),seed)).rejects.toThrow('READOPTION');
 await expect(createControlRun({} as any,{initialState:s.initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow('MODEL_HANDLE');expect(()=>r.observerView(1)).toThrow();
});
