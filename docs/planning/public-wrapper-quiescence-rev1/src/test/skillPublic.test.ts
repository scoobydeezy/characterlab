import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,map,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {skillRecipe,compileSkillModel,compileSkillInputs,type SkillSettings,STAGES,eventId,skillPath,beliefPath,owner} from '../campaign3/skillModel';
import {createSkillRuntime} from '../campaign3/skillRuntime';
import {createSkillRun,prepareSkillModel,restoreSkillRun} from '../campaign3/skillFactory';
import {decodeSkill as decode,skillRecord as r} from '../campaign3/skillCodecs';
import {skillInputs,skillScenario,type Exercise} from './skillFixtures';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
const seed=new Uint8Array(32),rows=(values:readonly CanonicalValue[],t:bigint)=>values.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
async function setup(settings:Partial<SkillSettings>={},xs:readonly Exercise[]=skillScenario()){const source=skillRecipe(settings),model=await compileSkillModel(source),initialState=enc(model.initial.canonicalValue()),orderedInputs=skillInputs(xs),input=await compileSkillInputs(model,initialState,orderedInputs,seed);return {source,model,initialState,orderedInputs,input};}
async function run(settings:Partial<SkillSettings>={},xs:readonly Exercise[]=skillScenario()){const x=await setup(settings,xs),run=await createSkillRun(await prepareSkillModel(x.source),{initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed});while(await run.settleNextInstant()){}return {...x,run,outputs:items(decode(run.snapshot().outputs),'list')};}
it('holds intent/expression/plan fixed while actual competence or impairment changes execution',async()=>{
 const low=await run({initial:0},[{at:1,visible:false}]),high=await run({initial:1},[{at:1,visible:false}]),impaired=await run({initial:1},[{at:1,impairment:.75,visible:false}]);
 for(const t of [788n,789n,790n,791n,792n,793n,794n,795n]){expect(rows(low.outputs,t)).toEqual(rows(high.outputs,t));expect(rows(high.outputs,t)).toEqual(rows(impaired.outputs,t));}
 expect(f(rows(low.outputs,796n)[0],7n)).toBe(false);expect(f(rows(high.outputs,796n)[0],7n)).toBe(true);expect(f(rows(impaired.outputs,796n)[0],7n)).toBe(false);
},120000);
it('practice changes only later execution and can improve competence with stale self-belief',async()=>{
 const x=await run({initial:0});const outcomes=rows(x.outputs,796n),apps=rows(x.outputs,788n),updates=rows(x.outputs,799n);
 expect(outcomes.map(o=>f(o,7n))).toEqual([false,false,false,false,true,true]);expect(f(rec(f(updates[2],4n),784n),1n)).toEqual(q(1,2));
 for(const i of [1,2,3,4,5])expect(f(rec(f(apps[i],3n),786n),1n)).toEqual(q(0,1));
 expect(f(rec(f(updates[3],3n),784n),1n)).toEqual(f(rec(f(updates[4],4n),784n),1n));
},120000);
it('misleading feedback supports skilled/insecure and incompetent/confident without rewriting skill',async()=>{
 const high=await run({initial:1},[{at:1,report:2},{at:2,visible:false}]),low=await run({initial:0},[{at:1,report:1},{at:2,visible:false}]);
 expect(f(rec(f(rows(high.outputs,788n)[1],3n),786n),1n)).toEqual(q(0,1));expect(f(rec(f(rows(low.outputs,788n)[1],3n),786n),1n)).toEqual(q(1,1));
 expect(f(rows(high.outputs,796n)[1],7n)).toBe(true);expect(f(rows(low.outputs,796n)[1],7n)).toBe(false);
 const changed=await run({initial:1},[{at:1,report:1},{at:2,visible:false}]);expect(rows(high.outputs,799n).map(v=>f(v,4n))).toEqual(rows(changed.outputs,799n).map(v=>f(v,4n)));
},120000);
it('separates blocked opportunity, invisible evidence, observed zero and NoLearning',async()=>{
 for(const change of [{permitted:false,report:1},{visible:false}]){const x=await run({},[{at:1,practice:true,...change}]);expect(f(rows(x.outputs,800n)[0],3n)).toBe(false);expect(f(rows(x.outputs,799n)[0],5n)).toBe(change.permitted!==false);}
 const x=await run({initial:0},[{at:1},{at:2}]);expect(rows(x.outputs,788n)[0].fields.has(3n)).toBe(false);expect(f(rec(f(rows(x.outputs,788n)[1],3n),786n),1n)).toEqual(q(0,1));
 const none=await run({beliefLaw:3});expect(rows(none.outputs,800n).every(v=>f(v,3n)===false)).toBe(true);
},120000);
it('discriminates serious practice/impairment laws and the three conflation controls',async()=>{
 const xs=[{at:1,practice:true,visible:false},{at:2,impairment:.5,difficulty:.3125,visible:false}],linear=await run({},xs),residual=await run({practiceLaw:2},xs),additive=await run({executionLaw:2},xs);
 expect(f(rows(linear.outputs,796n)[1],7n)).toBe(true);expect(f(rows(additive.outputs,796n)[1],7n)).toBe(false);
 const practice=[{at:1,practice:true},{at:2,practice:true}],a=await run({initial:0},practice),b=await run({initial:0,practiceLaw:2},practice);expect(f(rec(f(rows(a.outputs,799n)[1],4n),784n),1n)).toEqual(q(1,2));expect(f(rec(f(rows(b.outputs,799n)[1],4n),784n),1n)).toEqual(q(3,4));expect(residual.outputs.length).toBeGreaterThan(0);
 const bad=await run({initial:0,executionLaw:4},[{at:1}]);expect(f(rows(bad.outputs,796n)[0],7n)).toBe(true);
 const confidence=await run({initial:0,executionLaw:3},[{at:1,report:1},{at:2}]);expect(f(rows(confidence.outputs,796n)[1],7n)).toBe(true);
 const permanent=await run({permanent:true},[{at:1,impairment:.5,visible:false},{at:2,visible:false}]);expect(f(rows(permanent.outputs,796n)[1],7n)).toBe(false);
},120000);
it('protects state ownership and rejects foreign state, generated ingress, getter data and bounds',async()=>{
 const x=await setup(),handle=await prepareSkillModel(x.source),args={initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed},prior=x.model.initial.read(skillPath).value!;
 expect(()=>applyStatePatch(x.model.initial,{operations:[{kind:'set',path:skillPath,expected:{presence:true,value:prior},newValue:prior}]},owner('learn'),x.model.authority)).toThrow();
 expect(()=>x.model.validateState(new AuthoritativeState([...x.model.initial.entries(),{path:beliefPath,value:prior}]))).toThrow();
 await expect(createSkillRun(handle,{...args,orderedInputs:enc(list([prior]))})).rejects.toThrow();await expect(createSkillRun(handle,{...args,initialState:enc(map([]))})).rejects.toThrow();
 await expect(createSkillRun(handle,{...args,orderedInputs:skillInputs(Array.from({length:9},(_,i)=>({at:i+1})))})).rejects.toThrow();let called=false;await expect(createSkillRun(handle,{...args,get runSeed(){called=true;return seed;}})).rejects.toThrow();expect(called).toBe(false);
},120000);
it('restores complete prefixes and rejects corrupted output/state/trace',async()=>{
 const x=await setup(),run=await createSkillRun(await prepareSkillModel(x.source),{initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed});for(let i=0;i<3;i++)await run.settleNextInstant();const save=run.save(),restored=await restoreSkillRun(x.source,{initialState:x.initialState,orderedInputs:x.orderedInputs,save});expect(restored.save()).toEqual(save);await run.settleNextInstant();await restored.settleNextInstant();expect(restored.save()).toEqual(run.save());
 for(const field of [8n,11n,12n]){const saved=rec(decode(save),132n),fields=new Map(saved.fields);fields.set(field,field===8n?map([]):list([]));await expect(restoreSkillRun(x.source,{initialState:x.initialState,orderedInputs:x.orderedInputs,save:enc({...saved,fields})})).rejects.toThrow();}
},120000);
it('rolls back every stage and commit after a learned prefix, including both update authorities',async()=>{
 for(const name of [...STAGES.map(([n])=>n),'commit']){const x=await setup({},[{at:1},{at:2,practice:true}]),runtime=createSkillRuntime(x.model,x.input);await runtime.settle();const before=runtime.snapshot();let reached=false;
  await expect(runtime.settleForConformance({onBoundary(boundary,event){if(name==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event!==undefined&&key(event.eventTypeId)===key(eventId(name))){reached=true;throw Error('skill fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=runtime.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['queue','allocators','outputs','trace'] as const)expect(after[k]).toEqual(before[k]);
 }
},300000);
