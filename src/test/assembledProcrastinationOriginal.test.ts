import {it,expect,afterEach,vi} from 'vitest';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Compression.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Hash.
import {createHash} from 'node:crypto';
import {fixture,start,through,finish,rec,f,uint,items,key,decode,enc,list,text,u,signed,q,sid,C,taskA,taskB,countPath,countStatus,countProgress,countWorld,cachedMemory,restorePreparedCharacterRun,procrastinationCases,procrastinationInputs,actionA,actionB,type Run,type CanonicalValue} from './fixtures/assembledProcrastinationOriginal';
import {decodeProcrastination} from '../campaign3/procrastinationCodecs';
import {restoreAuthoritativeState,AuthoritativeState} from '../substrate/state';
import {PRIORITY_MOTIVE} from '../assembled/priority';
import {WORK,WORK_CUE,WORK_SOURCE,WORK_OBSERVE,workAccessPath,compileWorkMaintenance} from '../assembled/workMaintenance';
import {COUNT} from '../assembled/countedGoal';
import {HORIZON,HORIZON_DISPLAY,compileHorizon,compileHorizonScope} from '../assembled/horizon';
import {compileCharacterModel,HORIZON_POLICY_RULES,HORIZON_POLICY_REGISTRY} from '../assembled/model';
import {createCharacterRun} from '../assembled/character';
import {DeterministicScheduler} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
const plan=JSON.parse(readFileSync('docs/planning/PROCRASTINATION_PUBLIC_PLAN_REV2.json','utf8')) as {runs:{candidate:number;law:number;name:keyof ReturnType<typeof procrastinationCases>;orderedInputs:string}[]},views=JSON.parse(readFileSync('docs/planning/PROCRASTINATION_PUBLIC_VIEWS_REV2.json','utf8'));
const file='docs/planning/ASSEMBLED_CHARACTER_M280_EVIDENCE.json',hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b,{level:9}).toString('base64')});
const saved=()=>existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
function put(k:string,v:unknown){const d=saved();if(d[k])expect(d[k]).toEqual(v);else{d[k]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');}}
const unzip=(v:{hash:string;bytes:number;deflate:string})=>{const b=new Uint8Array(inflateSync(Uint8Array.from(atob(v.deflate),c=>c.charCodeAt(0))));expect(hash(b)).toBe(v.hash);expect(b.length).toBe(v.bytes);return b;};
const records=(vs:readonly CanonicalValue[],type:bigint)=>vs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
const reports=(vs:readonly CanonicalValue[],label:string)=>vs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const fraction=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('rational');return String(v.numerator)+'/'+String(v.denominator);};
const actionIndex=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='typedIdentifier'||typeof v.payload==='boolean'||v.payload.kind!=='text')throw Error('action');return v.payload.value.endsWith('one')||v.payload.value.endsWith('/work')?0:1;};
const probabilities=(v:CanonicalValue)=>items(v,'list').map(v=>{const x=rec(v,421n);return {task:actionIndex(f(rec(f(x,1n),395n),2n)),p:fraction(f(x,2n))};}).sort((a,b)=>a.task-b.task);
function goal(r:Run){const s=restoreAuthoritativeState(decode(r.snapshot().state)),v=s.read(countStatus(taskA)).value;return {status:v?['Absent','Open','Fulfilled','DeadlineMissed','Cancelled'][Number(uint(f(rec(v,372n),1n))) ]:'Absent',progress:Number(countProgress(s.read(countPath(taskA)).value).count),physical:Number(countWorld(s.read(countPath(taskA,true)).value).count)};}
const decision=(v:CanonicalValue)=>{const d=rec(v,409n),c=rec(f(d,3n),408n),status=rec(f(d,4n),419n),kind=Number(uint(f(status,1n))),data=kind===3?rec(f(status,2n),420n):undefined;return {kind,nuclei:items(f(c,3n),'list').length,choice:data?actionIndex(f(rec(f(data,1n),395n),2n)):-1,probability:data?probabilities(f(data,2n)):[],bytes:hash(enc(d))};};
const horizons=(out:readonly CanonicalValue[])=>reports(out,PRIORITY_MOTIVE).flatMap(p=>items(p[2],'list').map(v=>items(v,'list')).map(v=>{expect(v[6],'live horizon report').toBeDefined();const h=items(v[6],'list');return {task:key(h[2])===key(taskA)?0:key(h[2])===key(taskB)?1:2,value:fraction(h[6]),factor:fraction(h[5])};}));
const fromHex=(s:string)=>decodeProcrastination(Uint8Array.from(s.match(/../g)!,x=>parseInt(x,16)));
function original(run:typeof plan.runs[number]){const all=items(fromHex(views.views.find((v:[string,unknown])=>v[0]===run.candidate+'/'+run.law+'/'+run.name)[1].outputs),'list'),evals=records(all,1360n),choices=records(all,1364n),updates=records(all,1361n),raw=records(all,1362n);return evals.map((e,i)=>{const g=rec(f(updates[i],2n),1356n),d=choices[i];return {at:i+1,active:f(e,2n),accessible:f(e,3n),immediate:f(e,4n),feasible:f(e,5n),value:fraction(f(rec(f(e,1n),1375n),5n)),forecast:Number(uint(f(e,9n))),choice:actionIndex(f(rec(f(d,7n),395n),2n)),probability:probabilities(f(d,4n)),raw:items(f(raw[i],3n),'list').length,after:{status:['Absent','Open','Fulfilled','Cancelled','DeadlineMissed'][Number(uint(f(g,2n)))],progress:Number(uint(f(g,4n)))}};});}
let active:Run|undefined;afterEach(ctx=>{if(ctx.task.result?.state==='fail'&&active){let capture;try{capture={save:zip(active.save())};}catch{capture={diagnostic:active.diagnostic()?zip(active.diagnostic()!):null};}put('failure-'+Object.keys(saved()).filter(k=>k.startsWith('failure')).length,{name:ctx.task.name,...capture});}active=undefined;});
const first=(r:typeof plan.runs[number])=>r.name==='main'||r.name==='noAccess'||r.name==='lostAccess';
for(const run of plan.runs.filter(first))it('postpone280 '+run.candidate+'/'+run.name,async()=>{
 const b=fixture(procrastinationCases()[run.name],run.candidate);expect(key(fromHex(run.orderedInputs))).toBe(key(decodeProcrastination(b.original)));const x=await start(b);active=x.r;const old=original(run),ticks=[];let offset=0,prior=goal(x.r);
 for(let t=1;t<=8;t++){
  const at=2*t-1;await through(x.r,at);const all=items(decode(x.r.snapshot().outputs),'list'),out=all.slice(offset);offset=all.length;const ds=records(out,409n).map(decision),hs=horizons(out),ws=records(out,381n).flatMap(v=>items(f(v,4n),'list').map(v=>key(f(rec(v,379n),1n))===key(taskA)?0:1)),receipts=reports(out,COUNT+'/observation').flatMap(v=>items(v[2],'list').map(v=>items(v,'list')[3]));
  if(t===6)await through(x.r,12);const after=goal(x.r);
  const work=hs.find(v=>v.task===0);if(ws.includes(0)){expect(work).toBeDefined();expect(work!.value).toBe(old[t-1].value);}
  if(run.name==='main'&&t===2){expect(prior.status).toBe('Open');expect(ws).toContain(0);expect(ds[0].nuclei).toBe(run.candidate===4?1:2);expect(work?.value).toBe(run.candidate===2?'1/1':'1/4');}
  if(run.name==='noAccess')expect(ws).not.toContain(0);
  if(run.name==='lostAccess'&&(t===3||t===4))expect(ws).not.toContain(0);
  if(run.name==='lostAccess'&&t===5)expect(ws).toContain(0);
  expect(after.progress-prior.progress).toBe(receipts.filter(v=>v===true&&prior.status==='Open').length);
  if(t>=6)expect(after.status).not.toBe('Open');
  ticks.push({step:t,nativeAt:at,before:prior,after,workspace:ws,horizon:hs,decisions:ds,receipts,original:old[t-1]});prior=after;
 }
 await finish(x.r);put(run.candidate+'/'+run.name,{source:zip(b.d.orderedInputs),registry:zip(b.s.registry),original:zip(b.original),initial:hash(b.d.initialState),parameters:hash(b.s.parameters),ticks,save:zip(x.r.save())});
 if(run.name==='main'&&run.candidate===1){const postponed=ticks.filter(v=>v.before.status==='Open'&&v.workspace.includes(0)&&v.decisions.some(d=>d.nuclei===2&&d.choice===1));expect(postponed.length,'actual live postponement').toBeGreaterThan(0);expect(ticks.some(v=>v.step>postponed[0].step&&v.decisions.some(d=>d.choice===0))).toBe(true);}
 if(run.candidate===4)expect(ticks[3].after).toMatchObject({status:'Fulfilled',progress:3});
 console.info('M280',run.candidate,run.name,JSON.stringify(ticks.map(v=>({step:v.step,choice:v.decisions[0]?.choice??-1,access:v.workspace.includes(0),goal:v.after}))));
},590000);

import {compileCharacterState} from '../assembled/state';
import {workKnowledgePath} from '../assembled/workMaintenance';
import {fixture as temporalFixture,start as temporalStart} from './fixtures/assembledTemporalOriginal';
import {temporalCases} from './temporalGoalFixtures';
it('postpone280 admission ownership and actual cue provenance',async()=>{
 const b=fixture(procrastinationCases().main),x=await start(b),model=await compileCharacterModel(b.s),component=await compileCharacterState(model),slots=[...items(decode(b.s.registry),'list')];
 expect(model.workMaintenance?.cue).toBe(true);expect(model.horizonScope).toEqual([taskA]);
 expect(()=>compileWorkMaintenance(slots[47],[taskA,taskB])).toThrow();
 for(const bindings of [[],[taskA,taskA],[sid(1030,'foreign')]])expect(()=>compileWorkMaintenance(list([text(WORK_CUE),list(bindings)]),[taskA,taskB],true)).toThrow();
 expect(()=>compileHorizon(list([text(HORIZON),u(3)]),true,true)).toThrow();
 for(const scope of [[],[taskA,taskA],[sid(1030,'foreign')]])expect(()=>compileHorizonScope(list([text(HORIZON),u(3),list(scope)]),[taskA,taskB])).toThrow();
 slots[14]=list([text(HORIZON)]);await expect(compileCharacterModel({...b.s,rulesVersion:HORIZON_POLICY_RULES,registrySchemaVersion:HORIZON_POLICY_REGISTRY,registry:enc(list(slots))})).rejects.toThrow('work maintenance');
 const rows=items(decode(b.d.orderedInputs),'list'),badPhase=rows.map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(WORK_SOURCE))a[1]=u(110);return list(a);});await expect(createCharacterRun(x.m,{...b.d,orderedInputs:enc(list(badPhase))})).rejects.toThrow('work source time/phase');
 const initial=restoreAuthoritativeState(decode(b.d.initialState)),access=list([text(WORK),u(1),list([u(1)])]);await expect(createCharacterRun(x.m,{...b.d,initialState:enc(new AuthoritativeState([...initial.entries(),{path:workAccessPath(C),value:access}]).canonicalValue())})).rejects.toThrow('initial control');
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path:workAccessPath(C),expected:{presence:false},newValue:access}]},sid(1025,'authority/strategy-knowledge'))).toThrow();
 for(const at of [6,7,8])expect(()=>fixture(procrastinationCases().main.map(v=>({...v,instruction:v.at===at?1:0})))).toThrow('adoption window');
 const main=rec(decode(unzip(saved()['1/main'].save)),132n),traces=items(f(main,11n),'list').map(v=>rec(v,160n));let consumed=0;
 for(const row of traces.filter(v=>key(f(v,5n))===key(sid(1036,'seam/assembled-work-maintenance'))&&uint(f(rec(f(v,4n),130n),3n))===40n)){
  const input=items(f(row,12n),'list'),obs=items(input[2],'list');expect(key(obs[0])).toBe(key(text(WORK_CUE)));expect(items(f(row,9n),'list')).toEqual([obs[1]]);expect(f(rec(f(row,4n),130n),2n)).toEqual(signed(Number(uint(obs[2]))));const producer=traces.find(v=>key(f(rec(f(v,4n),130n),5n))===key(WORK_OBSERVE)&&items(f(v,13n),'list').some(v=>key(v)===key(input[2])));expect(producer).toBeDefined();expect(uint(f(rec(f(producer!,4n),130n),3n))).toBe(20n);consumed++;
 }
 expect(consumed).toBeGreaterThan(0);put('admission-provenance',{consumed,versions:true,foreignScope:true,phase:true,initialAccess:true,owner:true,originalLateAdoption:true});
},590000);
it('postpone280 repeat continuation and early-lane rollback',async()=>{
 const x=await start(fixture(procrastinationCases().main));active=x.r;await through(x.r,2);const checkpoint=x.r.save(),repeat=await start(x.b);await through(repeat.r,2);expect(repeat.r.save()).toEqual(checkpoint);
 const restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:checkpoint})),continuations=[];
 for(let i=0;i<128;i++){const a=await repeat.r.settleNextInstant(),b=await restored.settleNextInstant();expect(b).toBe(a);expect(restored.save()).toEqual(repeat.r.save());continuations.push({at:String(repeat.r.snapshot().clock),hash:hash(repeat.r.save())});if(!a)break;if(i===127)throw Error('continuation cap');}
 expect(repeat.r.save()).toEqual(unzip(saved()['1/main'].save));expect(continuations.some(v=>v.at==='11')).toBe(true);expect(continuations.some(v=>v.at==='12')).toBe(true);
 const faults=[];for(const target of ['observation','workspace','commit']){
  const r=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:checkpoint}));let reached=false;
  const regular=DeterministicScheduler.prototype.settleNextInstant,spy=vi.spyOn(DeterministicScheduler.prototype,'settleNextInstant').mockImplementation(async function(this:DeterministicScheduler<unknown>){const before=this.exportQuiescentSnapshot();if(before.queue[0]?.dueAt!==3n)return regular.call(this);try{return await this.settleNextInstantForConformance({onBoundary(boundary,event){if(target==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&!!event&&key(event.eventTypeId)===key(target==='observation'?WORK_OBSERVE:sid(1001,'event/deliberation-opportunity'))){reached=true;throw Error('M280 injected fault');}}});}finally{const after=this.exportQuiescentSnapshot();expect(reached,'fault boundary '+target).toBe(true);expect(enc((after.state as AuthoritativeState).canonicalValue())).toEqual(enc((before.state as AuthoritativeState).canonicalValue()));expect(after.allocators).toEqual(before.allocators);expect(after.queue.map(scheduledEventValue)).toEqual(before.queue.map(scheduledEventValue));expect(after.outputs).toEqual(before.outputs);expect(after.committedTrace).toEqual(before.committedTrace);expect(after.clock).toBe(before.clock);expect(after.status).toBe('Failed');}});
  try{await expect(r.settleNextInstant()).rejects.toThrow('M280 injected fault');expect(reached).toBe(true);faults.push({target,reached,diagnostic:hash(r.diagnostic()!)});}finally{spy.mockRestore();}
 }
 put('continuation',{checkpoint:zip(checkpoint),continuations,faults,terminal:hash(repeat.r.save())});
},590000);
it('postpone280 hidden reminder and exact old temporal carry',async()=>{
 const runs=[];
 for(const reminder of [true,false]){const b=fixture(procrastinationCases().main.map(v=>({...v,board:false,reminder:v.at===2&&reminder}))),x=await start(b);active=x.r;await finish(x.r);runs.push(x);put('denied-reminder-'+reminder,{source:zip(b.d.orderedInputs),save:zip(x.r.save())});}
 expect(runs[0].r.snapshot().state).toEqual(runs[1].r.snapshot().state);expect(runs[0].r.snapshot().outputs).toEqual(runs[1].r.snapshot().outputs);expect(goal(runs[0].r)).toMatchObject({progress:0,status:'DeadlineMissed'});
 const old=await temporalStart(temporalFixture(temporalCases().main,'HorizonRelative'));await finish(old.r);const prior=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M278_EVIDENCE.json','utf8'));expect(old.r.save()).toEqual(unzip(prior['HorizonRelative/main'].save));
 const a=saved()['1/main'].ticks[1].decisions[0],b=saved()['2/main'].ticks[1].decisions[0];expect(a.nuclei).toBe(2);expect(b.nuclei).toBe(2);expect(a.probability).not.toEqual(b.probability);
 expect(saved()['4/main'].ticks[1].decisions[0].nuclei).toBe(1);
 put('privacy-carry',{wholeDeniedBoard:true,oldTemporalSave:hash(old.r.save()),actualProbability:[a.probability,b.probability],noImmediateGround:true});
},590000);
