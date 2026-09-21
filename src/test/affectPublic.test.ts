import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,map,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {affectRecipe,compileAffectModel,compileAffectInputs,type AffectSettings,STAGES,OPTIONS,eventId} from '../campaign3/affectModel';
import {createAffectRuntime} from '../campaign3/affectRuntime';
import {createAffectRun,prepareAffectModel,restoreAffectRun} from '../campaign3/affectFactory';
import {decodeAffect as decode,affectRecord as r} from '../campaign3/affectCodecs';
import {affectOriginals,trained,type Trial} from './affectFixtures';
const is=(v:CanonicalValue,t:bigint)=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t;
const rows=(outputs:readonly CanonicalValue[],t:bigint)=>outputs.filter(v=>is(v,t)).map(v=>rec(v,t));
const seed=new Uint8Array(32);
async function setup(trials:readonly Trial[]=trained(),settings:Partial<AffectSettings>={},probes=2){const source=affectRecipe(settings),model=await compileAffectModel(source),initialState=enc(model.initial.canonicalValue()),orderedInputs=affectOriginals(trials,probes);return {source,model,initialState,orderedInputs};}
async function run(trials:readonly Trial[]=trained(),settings:Partial<AffectSettings>={},probes=2){const x=await setup(trials,settings,probes),run=await createAffectRun(await prepareAffectModel(x.source),{initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed});while(await run.settleNextInstant()){}return {...x,run,outputs:items(decode(run.snapshot().outputs),'list')};}
const lastApp=(x:Awaited<ReturnType<typeof run>>)=>rows(x.outputs,754n).at(-1)!;
it('learns control from actual perceived trial membership and excludes hidden physical truth',async()=>{
 const a=await run(),b=await run(trained({hidden:true}));expect(a.run.snapshot().state).toEqual(b.run.snapshot().state);expect(a.run.snapshot().outputs).toEqual(b.run.snapshot().outputs);expect(a.run.snapshot().trace).not.toEqual(b.run.snapshot().trace);
 expect(f(lastApp(a),8n)).toEqual(q(1,1));expect(f(lastApp(a),10n)).toEqual(q(1,1));expect(f(lastApp(a),6n)).toEqual(list([q(1,1),q(0,1)]));
 expect(rows(a.outputs,741n)).toHaveLength(3);expect(rows(a.outputs,751n)).toHaveLength(9);
},120000);
it('missing panel continuity or action is not observed inaction; unknown differs from ineffective control',async()=>{
 for(const change of [{missingMotion:true},{actionVisible:false}]){const trials=trained();trials[2]={...trials[2],...change};const x=await run(trials);expect(lastApp(x).fields.has(10n)).toBe(false);expect(items(f(lastApp(x),6n),'list')).toHaveLength(0);}
 const x=await run(trained().map((t,i)=>i===2?{...t,outcome:true}:t));expect(f(lastApp(x),10n)).toEqual(q(0,1));expect(f(lastApp(x),6n)).toEqual(list([q(1,1),q(1,1)]));
},120000);
it('baseline zero is unidentifiable; a known empty catalogue gives zero available control without inventing efficacy',async()=>{
 const ts=trained().map((t,i)=>i===1?{...t,outcome:false}:t),unknown=await run(ts),empty=await run(ts.map(t=>({...t,catalogue:1})));expect(lastApp(unknown).fields.has(14n)).toBe(false);expect(lastApp(unknown).fields.has(10n)).toBe(false);expect(lastApp(empty).fields.has(14n)).toBe(false);expect(f(lastApp(empty),10n)).toEqual(q(0,1));
},120000);
it('censored/no-opportunity/denied observations never become safe negative evidence',async()=>{
 for(const change of [{monitor:false},{opportunity:false},{outcomeVisible:false},{permitted:false}]){const ts=trained();ts[2]={...ts[2],...change};const x=await run(ts);expect(lastApp(x).fields.has(10n)).toBe(false);expect(rows(x.outputs,742n).filter(v=>f(v,5n)===true)).toHaveLength(2);}
},120000);
it('all four factors are independently manipulable and severity leaves exact learned state fixed',async()=>{
 const base=await run(),severity=await run(trained(),{severity:.5}),vulnerability=await run(trained({reserve:.5})),control=await run(trained().map((t,i)=>i===2?{...t,outcome:true}:t)),likelihood=await run([{glyph:0,outcome:false},...trained()]);
 expect(base.run.snapshot().state).toEqual(severity.run.snapshot().state);expect(f(lastApp(severity),4n)).toEqual(q(1,2));expect(f(lastApp(vulnerability),9n)).toEqual(q(1,2));expect(f(lastApp(control),10n)).toEqual(q(0,1));expect(f(lastApp(likelihood),8n)).toEqual(q(1,2));
 for(const [x,changed] of [[severity,4n],[vulnerability,9n],[control,10n],[likelihood,8n]] as const)for(const field of [4n,8n,9n,10n])if(field!==changed)expect(f(lastApp(x),field)).toEqual(f(lastApp(base),field));
},120000);
it('later feedback changes actual appraisal and reasons but cannot update belief or recurse in its own instant',async()=>{
 const a=await run(),b=await run(trained(),{feedback:true});expect(a.run.snapshot().state).toEqual(b.run.snapshot().state);
 const apps=rows(b.outputs,754n);expect(apps.at(-2)!.fields.has(11n)).toBe(false);expect(f(apps.at(-1)!,12n)).toEqual(f(apps.at(-2)!,2n));expect(f(apps.at(-1)!,6n)).toEqual(list([q(1,1),q(1,2)]));expect(f(lastApp(a),6n)).toEqual(list([q(1,1),q(0,1)]));expect(f(rows(a.outputs,756n).at(-1)!,3n)).not.toEqual(f(rows(b.outputs,756n).at(-1)!,3n));
},120000);
it('affect supplies only a situation modifier and cannot manufacture a Fear ground without a base',async()=>{
 const x=await run(trained().map((t,i)=>i===2?{...t,outcome:true}:t),{safety:0}),nuclei=items(f(rows(x.outputs,756n).at(-1)!,3n),'list');expect(nuclei).toHaveLength(1);expect(f(rec(f(rec(nuclei[0],407n),1n),404n),1n)).toEqual(OPTIONS[1]);expect(f(rows(x.outputs,757n).at(-1)!,8n)).toEqual(OPTIONS[1]);
},120000);
it('preserves separate intent, expression, plan, attempt, and failed physical execution',async()=>{
 const a=await run(),b=await run(trained(),{execution:false});for(const t of [757n,758n,759n,760n,761n])expect(rows(a.outputs,t)).toEqual(rows(b.outputs,t));expect(f(rows(a.outputs,762n).at(-1)!,3n)).toBe(true);expect(f(rows(b.outputs,762n).at(-1)!,3n)).toBe(false);expect(a.run.snapshot().state).toEqual(b.run.snapshot().state);
},120000);
it('preserves EvidenceMean, LastObservation, NoLearning and absolute-control competitors',async()=>{
 const ts=[...trained(),{glyph:0,outcome:false}],mean=await run(ts),last=await run(ts,{learningLaw:2}),none=await run(ts,{learningLaw:3});expect(f(lastApp(mean),8n)).toEqual(q(1,2));expect(f(lastApp(last),8n)).toEqual(q(0,1));expect(lastApp(none).fields.has(8n)).toBe(false);
 const contrast=[{glyph:0,outcome:true},{glyph:1,action:1,outcome:false},{glyph:1,action:1,outcome:true},{glyph:1,action:2,outcome:false}],relative=await run(contrast),absolute=await run(contrast,{controlLaw:2});expect(f(lastApp(relative),10n)).toEqual(q(1,1));expect(f(lastApp(absolute),10n)).toEqual(q(1,2));
},120000);
it('restores full prefixes, continues identically and rejects trace/output/state changes',async()=>{
 const x=await setup(trained(),{feedback:true}),run=await createAffectRun(await prepareAffectModel(x.source),{initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed});
 for(let i=0;i<9;i++)await run.settleNextInstant();const save=run.save(),restored=await restoreAffectRun(x.source,{initialState:x.initialState,orderedInputs:x.orderedInputs,save});expect(restored.save()).toEqual(save);await run.settleNextInstant();await restored.settleNextInstant();expect(restored.save()).toEqual(run.save());
 for(const field of [8n,11n,12n]){const saved=rec(decode(save),132n),fields=new Map(saved.fields);fields.set(field,field===8n?map([]):list([]));await expect(restoreAffectRun(x.source,{initialState:x.initialState,orderedInputs:x.orderedInputs,save:enc({...saved,fields})})).rejects.toThrow();}
},120000);
it('rejects unfrozen models, authored generated input, wrong S0, bound violations and accessor data without invocation',async()=>{
 const x=await setup(),handle=await prepareAffectModel(x.source);await expect(prepareAffectModel(affectRecipe({severity:0,feedback:true}))).rejects.toThrow('NOT_FROZEN');
 await expect(createAffectRun(handle,{initialState:x.initialState,orderedInputs:enc(list([r(753,[map([])])])),runSeed:seed})).rejects.toThrow();
 await expect(createAffectRun(handle,{initialState:enc(list([])),orderedInputs:x.orderedInputs,runSeed:seed})).rejects.toThrow('INITIAL');
 await expect(createAffectRun(handle,{initialState:x.initialState,orderedInputs:affectOriginals([...trained(),...trained()],0),runSeed:seed})).rejects.toThrow('LIMIT');
 let invoked=false;await expect(createAffectRun(handle,{initialState:x.initialState,orderedInputs:x.orderedInputs,get runSeed(){invoked=true;return seed;}})).rejects.toThrow();expect(invoked).toBe(false);
},120000);
it('rolls back all fifteen stages and commit after a committed learned prefix, including draws and panel continuity',async()=>{
 for(const name of [...STAGES.map(([n])=>n),'commit']){const x=await setup(),input=await compileAffectInputs(x.model,x.initialState,x.orderedInputs,seed),runtime=createAffectRuntime(x.model,input);for(let i=0;i<8;i++)await runtime.settle();const before=runtime.snapshot();let reached=false;
  await expect(runtime.settleForConformance({onBoundary(boundary,event){if(name==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event!==undefined&&key(event.eventTypeId)===key(eventId(name))){reached=true;throw Error('affect fault');}}})).rejects.toThrow();
  expect(reached).toBe(true);const after=runtime.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.queue).toEqual(before.queue);expect(after.allocators).toEqual(before.allocators);expect(after.outputs).toEqual(before.outputs);expect(after.trace).toEqual(before.trace);
 }
},300000);
