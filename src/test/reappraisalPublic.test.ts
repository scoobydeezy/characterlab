import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,signed,unsigned as u,typedIdentifier} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileReappraisalModel,compileReappraisalInputs,reappraisalRecipe,STAGES,eventId,path,owner} from '../campaign3/reappraisalModel';
import {createReappraisalRuntime} from '../campaign3/reappraisalRuntime';
import {reappraise,emptyKnowledge} from '../campaign3/reappraisalMath';
import {prepareReappraisalModel,createReappraisalRun,restoreReappraisalRun} from '../campaign3/reappraisalFactory';
import {reappraisalRecord as r,decodeReappraisal as decode} from '../campaign3/reappraisalCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './reappraisalFixtures';
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,projection=1){const source=reappraisalRecipe(law,projection),m=await compileReappraisalModel(source),orderedInputs=ordered(cases()[name]),i=await compileReappraisalInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createReappraisalRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,projection=1){const s=await setup(name,law,projection);while(await s.r.settle()){}return s;}
const apps=(s:Awaited<ReturnType<typeof run>>)=>records(s.r.snapshot().outputs,1032n).map(v=>rec(v,1032n));
const coords=(s:Awaited<ReturnType<typeof run>>)=>apps(s).map(v=>items(f(v,7n),'list').map(v=>key(v)));
it('changes later conditional appraisal without changing beliefs, observations or goal valuation',async()=>{
 const a=await run(),b=await run('noRequest');expect(coords(a)[2]).toEqual(coords(b)[2]);expect(coords(a)[3]).not.toEqual(coords(b)[3]);
 expect(a.r.snapshot().state.read(path(1029))).toEqual(b.r.snapshot().state.read(path(1029)));
 for(const type of [1027n,1036n])expect(records(a.r.snapshot().outputs,type)).toEqual(records(b.r.snapshot().outputs,type));
 expect(f(apps(a)[2],5n)).toEqual(u(1));expect(f(apps(a)[3],5n)).toEqual(u(2));expect(items(f(apps(a)[3],6n),'list')).toHaveLength(1);
},30000);
it('does not equate reappraisal with relief: harmful protection raises appraisal',async()=>{
 const a=await run('harmful'),same=await run('ineffective'),weighted=await run('weighted');expect(coords(a)[2]).not.toEqual(coords(a)[3]);
 expect(f(apps(a)[3],6n)).toEqual(list([{kind:'rational',numerator:1n,denominator:1n}]));expect(coords(same)[2]).toEqual(coords(same)[3]);expect(f(apps(weighted).at(-1)!,6n)).toEqual(list([{kind:'rational',numerator:1n,denominator:2n}]));
},30000);
it('keeps absent knowledge, unavailable protection and interrupted operation distinct',async()=>{
 for(const name of ['unknownBaseline','unknownProtected','emptyCatalogue','missingCatalogue','failed','sameInstant'] as const){const s=await run(name);expect(s.r.snapshot().state.read(path(1031)).presence).toBe(false);}
 const unknown=await run('unknownBaseline');expect(items(f(apps(unknown).at(-1)!,7n),'list')).toHaveLength(0);
},30000);
it('discriminates no-operation, direct-override and relief-as-evidence controls',async()=>{
 const normal=await run(),none=await run('main',2),override=await run('harmful',3),credit=await run('main',4),missing=await run('unknownBaseline',3);
 expect(coords(normal).at(-1)).not.toEqual(coords(none).at(-1));expect(coords(override).at(-1)).toEqual(coords(normal).at(-1));expect(items(f(apps(missing).at(-1)!,7n),'list')).toHaveLength(1);
 expect(credit.r.snapshot().state.read(path(1029))).not.toEqual(normal.r.snapshot().state.read(path(1029)));expect(records(credit.r.snapshot().outputs,1027n)).toEqual(records(normal.r.snapshot().outputs,1027n));
 expect(coords(await run('main',1,2)).at(-1)).toHaveLength(2);
},30000);
it('checks real stage timing and rejects same-instant feedback',async()=>{
 const s=await run();for(const [type,phase] of [[1032n,50n],[1033n,70n],[1034n,110n],[1027n,120n],[1035n,140n],[1036n,140n]]){const traces=s.r.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length);expect(traces.length).toBeGreaterThan(0);for(const t of traces)expect(f(rec(f(t,4n),130n),3n)).toEqual(u(phase));}
 expect(()=>reappraise(s.m,emptyKnowledge(),r(1030,[u(1),list([]),signed(3)]),3n,typedIdentifier(1165,u(0)))).toThrow('SAME_INSTANT');
},30000);
it('preserves later full public views after hidden truth and denied catalogue fields',async()=>{
 for(const [x,y] of [['main','hiddenTruth'],['denied','absent']] as const){const a=await setup(x),b=await setup(y),ra=await createReappraisalRun(await prepareReappraisalModel(a.source),{initialState,orderedInputs:a.orderedInputs,runSeed:seed}),rb=await createReappraisalRun(await prepareReappraisalModel(b.source),{initialState,orderedInputs:b.orderedInputs,runSeed:seed});while(await ra.settleNextInstant()){}while(await rb.settleNextInstant()){}expect(ra.observerView(0)).toEqual(rb.observerView(0));}
},30000);
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after acquired beliefs`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;
 await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('reappraisal fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
},30000);
it('rejects foreign writers, repeated operations, edited saves and forged public handles',async()=>{
 const s=await setup();expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(1029),expected:{presence:false},newValue:emptyKnowledge()}]},owner('frame'),s.m.authority)).toThrow();
 await expect(compileReappraisalInputs(s.m,initialState,ordered([{at:1,request:true},{at:2,request:true}]),seed)).rejects.toThrow('REQUEST_LIMIT');
 const model=await prepareReappraisalModel(s.source),run=await createReappraisalRun(model,{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await run.settleNextInstant();const save=rec(decode(run.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreReappraisalRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreReappraisalRun(s.source,{initialState,orderedInputs:ordered(cases().noRequest),save:run.save()})).rejects.toThrow();await expect(createReappraisalRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>run.observerView(1)).toThrow();
});
