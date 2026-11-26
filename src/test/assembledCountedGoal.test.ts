import {it,expect,afterEach} from 'vitest';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Compression.
import {deflateSync} from 'node:zlib';
// @ts-expect-error Hash.
import {createHash} from 'node:crypto';
import {restoreAuthoritativeState} from '../substrate/state';
import {fixture,start,through,finish,rec,f,uint,items,key,decode,enc,list,text,taskA,taskB,countPath,countStatus,countProgress,countWorld,restorePreparedCharacterRun,cachedMemory,type Run} from './fixtures/assembledCountedGoal';
const file='docs/planning/ASSEMBLED_CHARACTER_M276_EVIDENCE.json',hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')});
const saved=()=>existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
function put(k:string,v:unknown){const d=saved();if(d[k])expect(d[k]).toEqual(v);else{d[k]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');}}
const capture=(r:Run)=>{try{return {clock:String(r.snapshot().clock),save:zip(r.save())};}catch{return {diagnostic:r.diagnostic()?zip(r.diagnostic()!):null};}};
let active:Run|undefined;afterEach(ctx=>{if(ctx.task.result?.state==='fail'&&active)put('failure-'+Object.keys(saved()).filter(k=>k.startsWith('failure')).length,{name:ctx.task.name,...capture(active)});active=undefined;});
const records=(r:Run,type:bigint)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
function goals(r:Run){const state=restoreAuthoritativeState(decode(r.snapshot().state));return [taskA,taskB].map(task=>({status:String(uint(f(rec(state.read(countStatus(task)).value!,372n),1n))),progress:String(countProgress(state.read(countPath(task)).value).count),world:String(countWorld(state.read(countPath(task,true)).value).count)}));}
async function run(mode:Parameters<typeof fixture>[0]){const x=await start(fixture(mode));active=x.r;await through(x.r,1);expect(goals(x.r).map(v=>v.status)).toEqual(['1','1']);const ticks=[];for(let at=2;at<=8;at++){await through(x.r,at);ticks.push({at,goals:goals(x.r),decisions:records(x.r,409n).map(key)});}await finish(x.r);put(mode!+'-forecast',{ticks,...capture(x.r)});return {x,ticks};}
it('count276 actual independent completion changes later choice',async()=>{
 const {x,ticks}=await run('actual');console.info('M276 actual',JSON.stringify(ticks.map(v=>({at:v.at,goals:v.goals}))));
 expect(ticks.at(-1)!.goals.map(v=>v.status)).toEqual(['2','2']);expect(ticks.at(-1)!.goals.map(v=>v.progress)).toEqual(['1','3']);expect(ticks.at(-1)!.goals.map(v=>v.world)).toEqual(['1','3']);
 const first=records(x.r,409n)[0],compiled=rec(f(first,3n),408n);expect(items(f(compiled,3n),'list')).toHaveLength(2);
 expect(ticks.some(v=>v.goals[0].status==='2'&&v.goals[1].status==='1'||v.goals[0].status==='1'&&v.goals[1].status==='2')).toBe(true);
 expect(records(x.r,433n)).toHaveLength(4);
},590000);

it.each(['hidden','hiddenFailed','false','true','negative','noAttempt'] as const)('count276 receipt control %s',async mode=>{
 const {x,ticks}=await run(mode),last=ticks.at(-1)!.goals;
 if(mode==='false'||mode==='true'){expect(last.map(v=>v.status)).toEqual(['2','2']);expect(last.map(v=>v.progress)).toEqual(['1','3']);expect(last.map(v=>v.world)).toEqual(mode==='false'?['0','0']:['1','3']);}
 else {expect(last.map(v=>v.status)).toEqual(['3','3']);expect(last.map(v=>v.progress)).toEqual(['0','0']);if(mode==='hiddenFailed'||mode==='noAttempt')expect(last.map(v=>v.world)).toEqual(['0','0']);else expect(last.reduce((n,v)=>n+Number(v.world),0)).toBeGreaterThan(0);}
 if(mode==='noAttempt')expect(records(x.r,433n)).toHaveLength(0);
 console.info('M276',mode,JSON.stringify(last));
},590000);

// @ts-expect-error Evidence decompression.
import {inflateSync} from 'node:zlib';
import {vi} from 'vitest';
import {DeterministicScheduler} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {AuthoritativeState} from '../substrate/state';
import {createCharacterRun,prepareCharacterModel} from '../assembled/character';
import {compileCharacterModel,COUNTED_RULES,COUNTED_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {COUNT,COUNT_SOURCE,compileCounted} from '../assembled/countedGoal';
import {GOAL_OWNER} from '../assembled/priority';
import {cognitiveRecord} from '../assembled/codecs';
import {u,signed,sid,type CanonicalValue} from './fixtures/assembledCountedGoal';
import {fixture as benefitFixture} from './fixtures/assembledDelayedBenefit';
const unzip=(v:{hash:string;bytes:number;deflate:string})=>{const b=new Uint8Array(inflateSync(Uint8Array.from(atob(v.deflate),c=>c.charCodeAt(0))));expect(hash(b)).toBe(v.hash);expect(b.length).toBe(v.bytes);return b;};
it('count276 full observer privacy and source preservation',()=>{
 const terminal=(name:string)=>rec(decode(unzip(saved()[name+'-forecast'].save)),132n);
 for(const [a,b]of [['hidden','hiddenFailed'],['false','true']]){expect(enc(f(terminal(a),12n))).toEqual(enc(f(terminal(b),12n)));const cognition=(v:ReturnType<typeof terminal>)=>restoreAuthoritativeState(f(v,5n)).entries().filter(e=>e.path.rootStateTypeId!==1611n);expect(cognition(terminal(a))).toEqual(cognition(terminal(b)));}
 const b=fixture(),oldInputs=list(items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(sid(1001,'event/assembled-horizon-display'))));
 put('source',{registry:zip(b.s.registry),parameters:zip(b.s.parameters),initial:zip(b.d.initialState),seed:zip(b.d.runSeed),inputs:zip(b.d.orderedInputs),preservedNoForecastInputs:zip(enc(oldInputs)),wholeObserverPairs:2,physicalOnlyRoot:'1611'});
});
it('count276 exact repeat continuation and transactional rollback',async()=>{
 const b=fixture(),x=await start(b);active=x.r;await through(x.r,1);const save1=x.r.save();await through(x.r,2);const save2=x.r.save();await through(x.r,3);const save3=x.r.save();await through(x.r,4);const save4=x.r.save();
 await finish(x.r);const terminal=x.r.save();expect(terminal).toEqual(unzip(saved()['actual-forecast'].save));
 const repeat=await start(b);await through(repeat.r,2);expect(repeat.r.save()).toEqual(save2);
 const restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:save2}));const continuations=[];
 for(let i=0;i<128;i++){const a=await repeat.r.settleNextInstant(),c=await restored.settleNextInstant();expect(c).toBe(a);expect(restored.save()).toEqual(repeat.r.save());continuations.push(hash(restored.save()));if(!a)break;if(i===127)throw Error('continuation cap');}expect(restored.save()).toEqual(terminal);
 const faults=[];for(const target of [{at:2,phase:110,name:'event/protocol-execution'},{at:2,phase:120,name:'event/assembled-counted-observe'},{at:2,phase:140,name:'event/assembled-counted-learn'},{at:4,phase:140,name:'event/assembled-counted-learn'},{at:4,phase:0,name:'commit'}]){
 const beforeSave=target.at===2?save1:save3,r=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:beforeSave}));let reached=false;
 const regular=DeterministicScheduler.prototype.settleNextInstant,spy=vi.spyOn(DeterministicScheduler.prototype,'settleNextInstant').mockImplementation(async function(this:DeterministicScheduler<unknown>){const before=this.exportQuiescentSnapshot();if(before.queue[0]?.dueAt!==BigInt(target.at))return regular.call(this);try{return await this.settleNextInstantForConformance({onBoundary(boundary,event){if(target.name==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&!!event&&event.phase===BigInt(target.phase)&&key(event.eventTypeId)===key(sid(1001,target.name))){reached=true;throw Error('M276 injected fault');}}});}finally{const after=this.exportQuiescentSnapshot();expect(enc((after.state as AuthoritativeState).canonicalValue())).toEqual(enc((before.state as AuthoritativeState).canonicalValue()));expect(after.allocators).toEqual(before.allocators);expect(after.queue.map(scheduledEventValue)).toEqual(before.queue.map(scheduledEventValue));expect(after.outputs).toEqual(before.outputs);expect(after.committedTrace).toEqual(before.committedTrace);expect(after.clock).toBe(before.clock);expect(after.status).toBe('Failed');}});
 try{await expect(r.settleNextInstant()).rejects.toThrow('M276 injected fault');expect(reached).toBe(true);faults.push({...target,reached,before:hash(beforeSave),diagnostic:hash(r.diagnostic()!)});}finally{spy.mockRestore();}
 }
 put('continuation',{save1:zip(save1),save2:zip(save2),save3:hash(save3),save4:hash(save4),terminal:hash(terminal),continuations,faults});console.info('M276 repeat/continuation and five actual mutation rollback boundaries PASS');
},590000);
it('count276 admission ownership and empty binding carry',async()=>{
 const b=fixture(),x=await start(b),model=await compileCharacterModel(b.s),state=await compileCharacterState(model),slots=items(decode(b.s.registry),'list'),declaration=items(slots[62],'list'),bindings=items(declaration[1],'list');
 for(const bad of [list([text(COUNT),list([list([...items(bindings[0],'list').slice(0,2),u(0),u(0)])])]),list([text(COUNT),list([bindings[0],bindings[0]])])])expect(()=>compileCounted(bad,model.strategy!)).toThrow();
 const initial=restoreAuthoritativeState(decode(b.d.initialState)),fake=list([text(COUNT),u(1),list([list([sid(1164,'invalid'),u(1)])])]);
 await expect(createCharacterRun(x.m,{...b.d,initialState:enc(new AuthoritativeState([...initial.entries(),{path:countPath(taskA),value:fake}]).canonicalValue())})).rejects.toThrow();
 const noFrames=enc(list(items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(COUNT_SOURCE))));await expect(createCharacterRun(x.m,{...b.d,orderedInputs:noFrames})).rejects.toThrow('counted deliberation requires physical frame');
 await through(x.r,1);const current=restoreAuthoritativeState(decode(x.r.snapshot().state)),receipt={kind:'typedIdentifier',namespaceId:1164n,payload:u(999)} as CanonicalValue,value=list([text(COUNT),u(1),list([list([receipt,u(2)])])]),patch={operations:[{kind:'set' as const,path:countPath(taskA),expected:{presence:false as const},newValue:value}]};
 expect(()=>state.stateModel.applyPatch(current,patch,sid(1025,'authority/physical-counted-work'))).toThrow();
 expect(()=>state.stateModel.applyPatch(current,{operations:[{kind:'set',path:countStatus(taskA),expected:{presence:true,value:current.read(countStatus(taskA)).value!},newValue:cognitiveRecord(372,[u(2),receipt,signed(2)],4)}]},GOAL_OWNER)).toThrow('sufficient received count');
 const old=benefitFixture('unknown'),oldSlots=items(decode(old.s.registry),'list'),s={...old.s,rulesVersion:COUNTED_RULES,registrySchemaVersion:COUNTED_REGISTRY,registry:enc(list([...oldSlots,list([text(COUNT),list([])])]))},m=await prepareCharacterModel(s),r=cachedMemory(await createCharacterRun(m,old.d));await finish(r);
 const original=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M274_EVIDENCE.json','utf8'))['unknown-1-terminal'];expect(r.snapshot().state).toEqual(unzip(original.state));expect(r.snapshot().outputs).toEqual(unzip(original.outputs));
 put('admission',{invalidCount:true,duplicateBinding:true,initialHistory:true,missingSource:true,foreignWriter:true,unearnedFulfillment:true,emptyBindingOriginalStateOutputs:true,emptyBinding:zip(r.save())});
},590000);
