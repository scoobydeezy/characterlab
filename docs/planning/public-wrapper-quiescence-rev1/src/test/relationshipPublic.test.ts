import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,map,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {relationshipRecipe,compileRelationshipModel,compileRelationshipInputs,STAGES,eventId,stageReads,historyPath,personPath,cachePath,OBSERVERS,CHARACTERS,TARGETS,OPTIONS,type RelationshipSettings} from '../campaign3/relationshipModel';
import {createRelationshipRuntime} from '../campaign3/relationshipRuntime';
import {prepareRelationshipModel,createRelationshipRun,restoreRelationshipRun} from '../campaign3/relationshipFactory';
import {decodeRelationship as decode} from '../campaign3/relationshipCodecs';
import {relationshipInputs,relationshipScenario,type Interaction} from './relationshipFixtures';
import {statePathValue,applyStatePatch} from '../substrate/state';
const seed=new Uint8Array(32);
async function setup(settings:Partial<RelationshipSettings>={},xs:readonly Interaction[]=relationshipScenario()){const source=relationshipRecipe(settings),model=await compileRelationshipModel(source),initialState=enc(model.initial.canonicalValue()),orderedInputs=relationshipInputs(xs),input=await compileRelationshipInputs(model,initialState,orderedInputs,seed);return {source,model,initialState,orderedInputs,input};}
async function run(settings:Partial<RelationshipSettings>={},xs:readonly Interaction[]=relationshipScenario()){const x=await setup(settings,xs),r=await createRelationshipRun(await prepareRelationshipModel(x.source),{initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed});while(await r.settleNextInstant()){}return {...x,run:r};}
const view=(r:Awaited<ReturnType<typeof run>>,i:number)=>rec(decode(r.run.observerView(enc(OBSERVERS[i]))),860n);
const effective=(v:ReturnType<typeof view>,i:number,at:number)=>{const d=rec(items(f(v,5n),'list')[at-1],856n);if(uint(f(d,7n))===1n)return key(f(d,9n))===key(OPTIONS[i][0])?q(1,1):q(0,1);const p=items(f(d,6n),'list').find(p=>key(f(rec(p,421n),1n))===key(OPTIONS[i][0]));return p?f(rec(p,421n),2n):q(0,1);};
it('keeps person estimates equal while history changes contact, rupture and absence responses',async()=>{
 const a=await run(),b=await run({},relationshipScenario().map(x=>x.at<=2?{...x,participants:0}:x)),av=view(a,0),bv=view(b,0),apps=items(f(av,4n),'list').map(v=>rec(v,853n)),other=items(f(bv,4n),'list').map(v=>rec(v,853n));expect(f(apps[3],10n)).toEqual(f(other[3],10n));expect(f(apps[3],7n)).toBe(true);expect(f(other[3],7n)).toBe(false);expect(f(apps[6],8n)).toBe(true);expect(f(rec(f(apps[6],10n),849n),1n)).toBe(true);expect(f(apps[7],9n)).toBe(true);expect(f(apps[7],5n)).toBe(false);expect(effective(av,0,4)).not.toEqual(effective(bv,0,4));expect(view(a,1)).toEqual(view(b,1));
},180000);
it('preserves exact nonrecipient and hidden-truth views and rejects global/truth shortcuts',async()=>{
 const a=await run(),denied=await run({},relationshipScenario().map(x=>x.at<=2?{...x,a:false}:x));expect(view(a,1)).toEqual(view(denied,1));const xs=relationshipScenario().map(x=>x.at<=2?{...x,display:1}:x),hidden=xs.map(x=>x.at<=2?{...x,kind:2}:x),b=await run({},xs),c=await run({},hidden);for(const i of [0,1])expect(view(b,i)).toEqual(view(c,i));const shared=await run({candidate:4});expect(view(a,1)).not.toEqual(view(shared,1));
},240000);
it('derived and stored relationships produce identical views under both rupture laws',async()=>{
 for(const law of [1,2]){const a=await run({law}),b=await run({law,candidate:2});for(const i of [0,1])expect(view(a,i)).toEqual(view(b,i));}
},240000);
it('audits own-key read domains and fixed nonrelationship contributors',async()=>{
 const x=await setup({candidate:2}),runtime=createRelationshipRuntime(x.model,x.input);while(await runtime.settle()){}for(const [name] of STAGES){for(const t of runtime.snapshot().trace.map(v=>rec(v,160n)).filter(t=>key(f(t,7n))===key(eventId(name))))expect(items(f(t,11n),'list').map(v=>f(rec(v,147n),2n))).toEqual(stageReads(name,x.model.settings).map(statePathValue));}expect([7n,8n,9n].map(n=>f(x.model.content,n))).toEqual([q(0,1),q(0,1),q(1,1)]);const state=runtime.snapshot().state,value=state.read(historyPath(0)).value!;expect(()=>applyStatePatch(state,{operations:[{kind:'set',path:historyPath(0),expected:{presence:true,value},newValue:value}]},OBSERVERS[0],x.model.authority)).toThrow();
},180000);
it('authenticates whole saves and rejects malformed original inputs and view identifiers',async()=>{
 const x=await setup(),handle=await prepareRelationshipModel(x.source),args={initialState:x.initialState,orderedInputs:x.orderedInputs,runSeed:seed},r=await createRelationshipRun(handle,args);await r.settleNextInstant();const save=r.save(),restored=await restoreRelationshipRun(x.source,{initialState:x.initialState,orderedInputs:x.orderedInputs,save});for(const o of OBSERVERS)expect(restored.observerView(enc(o))).toEqual(r.observerView(enc(o)));await r.settleNextInstant();await restored.settleNextInstant();expect(restored.save()).toEqual(r.save());
 for(const field of [8n,11n,12n]){const saved=rec(decode(save),132n),fields=new Map(saved.fields);fields.set(field,field===8n?map([]):list([]));await expect(restoreRelationshipRun(x.source,{initialState:x.initialState,orderedInputs:x.orderedInputs,save:enc({...saved,fields})})).rejects.toThrow();}for(const xs of [[{at:0}],[{at:25}],[{at:1},{at:1}],Array.from({length:13},(_,i)=>({at:i+1}))])await expect(setup({},xs)).rejects.toThrow();await expect(createRelationshipRun(handle,{...args,orderedInputs:enc(list([OBSERVERS[0]]))})).rejects.toThrow();expect(()=>r.observerView(enc(CHARACTERS[0]))).toThrow();let called=false;await expect(createRelationshipRun(handle,{...args,get runSeed(){called=true;return seed;}})).rejects.toThrow();expect(called).toBe(false);
},180000);
it('rolls back every stage and commit after shared history, including both observer views',async()=>{
 for(const name of [...STAGES.map(([n])=>n),'commit']){const x=await setup({candidate:2}),r=createRelationshipRuntime(x.model,x.input);for(let i=0;i<4;i++)await r.settle();const before=r.snapshot(),views=OBSERVERS.map(o=>r.view(o));let reached=false;await expect(r.settleForConformance({onBoundary(b,e){if(name==='commit'?b==='before-commit':b==='after-trace-validation'&&e!==undefined&&key(e.eventTypeId)===key(eventId(name))){reached=true;throw Error('relationship fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=r.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['queue','allocators','outputs','trace'] as const)expect(after[k]).toEqual(before[k]);expect(OBSERVERS.map(o=>r.view(o))).toEqual(views);}
},300000);
it('preserves the failed zero-modifier cohort as an executable non-discriminating control',async()=>{
 const a=await run({revision:1}),b=await run({revision:1},relationshipScenario().map(x=>x.at<=2?{...x,participants:0}:x));expect(effective(view(a,0),0,4)).toEqual(effective(view(b,0),0,4));expect(effective(view(a,0),0,4)).toEqual(q(1,2));const input={initialState:a.initialState,orderedInputs:a.orderedInputs,save:a.run.save()},restored=await restoreRelationshipRun(a.source,input);expect(restored.save()).toEqual(a.run.save());
},180000);


