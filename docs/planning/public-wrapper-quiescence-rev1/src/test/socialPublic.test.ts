import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,map} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {socialRecipe,compileSocialModel,compileSocialInputs,OBSERVERS,STAGES,eventId,type SocialSettings} from '../campaign3/socialModel';
import {createSocialRuntime} from '../campaign3/socialRuntime';
import {prepareSocialModel,createSocialRun,restoreSocialRun} from '../campaign3/socialFactory';
import {decodeSocial as decode} from '../campaign3/socialCodecs';
import {socialScenario,socialInputs,type Display} from './socialFixtures';
const seed=new Uint8Array(32);
async function setup(settings:Partial<SocialSettings>={},xs:readonly Display[]=socialScenario()){const source=socialRecipe(settings),model=await compileSocialModel(source),initialState=enc(model.initial.canonicalValue()),orderedInputs=socialInputs(xs),input=await compileSocialInputs(model,initialState,orderedInputs,seed);return {source,model,initialState,orderedInputs,input};}
async function run(settings:Partial<SocialSettings>={},xs:readonly Display[]=socialScenario()){const x=await setup(settings,xs),run=await createSocialRun(await prepareSocialModel(x.source),{initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed});while(await run.settleNextInstant()){}return {...x,run};}
const view=(r:Awaited<ReturnType<typeof run>>,i:number)=>rec(decode(r.run.observerView(enc(OBSERVERS[i]))),814n);
const estimate=(r:Awaited<ReturnType<typeof run>>,i:number)=>f(view(r,i),5n);
it('isolates private truth, access, explanation and correlation under public interventions',async()=>{
 const a=await run(),hidden=await run({privateCommitment:false}),denied=await run({},socialScenario().map(x=>x.kind===2?{...x,a:false}:x)),lie=await run({},socialScenario().map(x=>x.kind===2?{...x,mode:4}:x));
 for(const i of [0,1])expect(view(a,i)).toEqual(view(hidden,i));expect(view(a,1)).toEqual(view(denied,1));expect(view(a,1)).toEqual(view(lie,1));expect(estimate(a,0)).not.toEqual(estimate(denied,0));expect(estimate(a,0)).not.toEqual(estimate(lie,0));
 const duplicate=socialScenario().map(x=>x.kind===2?{...x,receipt:2}:x),dedup=await run({},duplicate),bad=await run({control:4},duplicate);expect(estimate(dedup,0)).not.toEqual(estimate(bad,0));
 const global=await run({control:2}),reader=await run({control:3}),readerFalse=await run({control:3,privateCommitment:false});expect(view(global,1)).not.toEqual(view(a,1));expect(view(reader,0)).not.toEqual(view(readerFalse,0));
},300000);
it('preserves unknown, zero, causal probe timing, alternative learning and denied privacy',async()=>{
 const a=await run(),v=view(a,0),probes=items(f(v,4n),'list');expect(probes.map(p=>Number((f(rec(p,811n),5n) as {value:bigint}).value))).toEqual([0,1,2,3]);expect(items(f(view(a,1),3n),'list')).toHaveLength(1);
 for(const settings of [{learningLaw:3},{}]){const x=await run(settings,settings.learningLaw?socialScenario():[{at:1,mode:0}]);expect(view(x,0).fields.has(5n)).toBe(false);}
 const last=await run({learningLaw:2});expect(estimate(a,0)).not.toEqual(estimate(last,0));
 const missing=await run({},[{at:1,receipt:0}]);expect(view(missing,0).fields.has(5n)).toBe(false);
 expect(()=>a.run.observerView(enc(list([])))).toThrow();
},180000);
it('authenticates complete save prefixes and rejects malformed ingress and receipts',async()=>{
 const x=await setup(),handle=await prepareSocialModel(x.source),args={initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed},r=await createSocialRun(handle,args);await r.settleNextInstant();const save=r.save(),restored=await restoreSocialRun(x.source,{initialState:x.initialState,orderedInputs:x.orderedInputs,save});for(const o of OBSERVERS)expect(restored.observerView(enc(o))).toEqual(r.observerView(enc(o)));await r.settleNextInstant();await restored.settleNextInstant();expect(restored.save()).toEqual(r.save());
 for(const field of [8n,11n,12n]){const saved=rec(decode(save),132n),fields=new Map(saved.fields);fields.set(field,field===8n?map([]):list([]));await expect(restoreSocialRun(x.source,{initialState:x.initialState,orderedInputs:x.orderedInputs,save:enc({...saved,fields})})).rejects.toThrow();}
 await expect(createSocialRun(handle,{...args,orderedInputs:enc(list([OBSERVERS[0]]))})).rejects.toThrow();await expect(setup({},[{at:1,receipt:1,mode:3},{at:2,receipt:1,mode:4}])).rejects.toThrow();let called=false;await expect(createSocialRun(handle,{...args,get runSeed(){called=true;return seed;}})).rejects.toThrow();expect(called).toBe(false);
},180000);
it('rolls back all nine stages and commit after an observer has learned',async()=>{
 for(const name of [...STAGES.map(([n])=>n),'commit']){const x=await setup(),r=createSocialRuntime(x.model,x.input);await r.settle();const before=r.snapshot(),views=OBSERVERS.map(o=>r.view(o));let reached=false;await expect(r.settleForConformance({onBoundary(b,e){if(name==='commit'?b==='before-commit':b==='after-trace-validation'&&e!==undefined&&key(e.eventTypeId)===key(eventId(name))){reached=true;throw Error('social fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=r.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['queue','allocators','outputs','trace'] as const)expect(after[k]).toEqual(before[k]);expect(OBSERVERS.map(o=>r.view(o))).toEqual(views);}
},300000);

