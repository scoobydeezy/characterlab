import {it,expect} from 'vitest';
import {timeDomainVersion,EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {fixture,start,state,labels,through,at,decode,items,key,enc,list,text,u,signed,C,rec,f,uint,outputs,bytes,exact,type Run} from './fixtures/assembledSleepDemand';
import {SLEEP_LOAD,SLEEP_LOAD_VERSION,SLEEP_RECEIPT,READINESS,compileSleep,sleepPath,readiness} from '../assembled/sleepControl';
import {CONTROL_SOURCE,CONTROL_VIEW,CONTROL_OPTIONS,controlSetting} from '../assembled/control';
import {statePathValue} from '../substrate/state';
import {compileCharacterModel,SLEEP_RULES,SLEEP_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {restoreCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {skillPath,skillValue} from '../assembled/skill';
import {appraise} from '../campaign3/biologyPublicMath';
import {sleepCase} from './sleepControlFixtures';
const d=compileSleep(list([text(SLEEP_LOAD),true,u(100),u(1000),u(0),u(800),u(10)]),true);
const cv=(r:Run,t:number)=>labels(r,CONTROL_VIEW).find(v=>uint(v[1])===BigInt(t))!;
const rd=(r:Run,t:number)=>items(cv(r,t).find(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(READINESS)))!,'list');
const decision=(r:Run,t:number)=>outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===BigInt(t))!;
function chosen(r:Run,t:number){const x=decision(r,t);expect(x,'actual decision').toBeDefined();const a=rec(f(x,4n),419n);return uint(f(a,1n))===3n?f(rec(f(rec(f(a,2n),420n),1n),395n),2n):undefined;}
const projectionRows=(t:ReturnType<typeof rec>)=>{const v=f(t,13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[];};
function live(r:Run,t:number,target:Parameters<typeof key>[0]){
 const v=cv(r,t);expect(v,'live control view').toBeDefined();expect(v[2]).toBe(true);expect(v[3]).toBe(true);expect(uint(v[8])).toBeGreaterThanOrEqual(1n);
 const traces=outputs(r.snapshot().trace,160n),trace=traces.find(x=>at(f(rec(f(x,4n),130n),2n))===BigInt(t)&&uint(f(rec(f(x,4n),130n),3n))===70n&&projectionRows(x).some(o=>typeof o!=='boolean'&&o.kind==='list'&&o.items.length>0&&key(o.items[0])===key(text(CONTROL_OPTIONS))))!;
 expect(trace,'actual candidate consumer').toBeDefined();const input=rec(items(f(trace,12n),'list')[0],398n),candidates=items(f(input,3n),'list');expect(candidates.some(v=>key(f(rec(f(rec(v,397n),1n),395n),2n))===key(target as Parameters<typeof key>[0]))).toBe(true);
 const workspace=traces.find(x=>at(f(rec(f(x,4n),130n),2n))===BigInt(t)&&uint(f(rec(f(x,4n),130n),3n))===40n&&projectionRows(x).some(o=>typeof o!=='boolean'&&o.kind==='list'&&o.items.length>0&&key(o.items[0])===key(text(CONTROL_VIEW))))!;
 expect(workspace).toBeDefined();expect(items(f(workspace,11n),'list').some(v=>key(f(rec(v,147n),2n))===key(statePathValue(sleepPath(C))))).toBe(false);
 expect(items(f(workspace,12n),'list').at(-1)).toEqual(rd(r,t)[4]);
 const receipt=items(rd(r,t)[4],'list');expect(receipt[0]).toEqual(text(SLEEP_RECEIPT));expect(at(receipt[2])).toBe(BigInt(t));
 const draws=traces.filter(x=>at(f(rec(f(x,4n),130n),2n))===BigInt(t)).flatMap(x=>items(f(x,14n),'list'));expect(draws,'automatic comparison has no unmatched dice').toHaveLength(0);
 return v;
}

it('math210 original load equation and versioned admission',async()=>{
 const {frames,config}=sleepCase();let cases=0;
 for(const sleep of [0,1,2,3,399,400,401,600,1000])for(const load of [0,1,199,200,800,1000]){
  const before={hunger:0,thirst:0,sleepiness:sleep,pain:0,intoxication:0,reward:0,stress:0,arousal:500,pleasure:0,withdrawalReward:0,withdrawalStress:0,withdrawalArousal:0};
  const original=appraise(before,{...frames[7],load},{protection:true,work:false,maintained:true},[],config,'Full'),current=readiness([sleep,0,0,500],d,load);
  expect(current.capacity).toBe(original.control);expect(current.allowed).toBe(original.inhibited);cases++;
 }
 expect(readiness([100,0,0,500],d)).toMatchObject({known:false,capacity:undefined,allowed:false});
 for(let i=0;i<4;i++){const xs:(number|undefined)[]=[100,0,0,500];xs[i]=undefined;expect(readiness(xs,d,0).known).toBe(false);}
 for(const load of [-1,1001,0.5])expect(()=>readiness([0,0,0,500],d,load)).toThrow();
 const b=fixture();console.info('M210 fixture bundle '+b.s.rulesVersion);
 const row=items(decode(b.d.orderedInputs),'list').find(v=>key(items(v,'list')[2])===key(CONTROL_SOURCE))!,p=items(items(row,'list')[3],'list');
 console.info('M210 source arity '+p.length);expect(b.s.rulesVersion).toBe('rules/assembled-character/0.137-candidate');expect(p).toHaveLength(7);
 expect(()=>controlSetting(list(p))).toThrow();expect(()=>controlSetting(list(p.slice(0,6)),true)).toThrow();expect(()=>controlSetting(list([...p.slice(0,6),u(1001)]),true)).toThrow();
 const m=await compileCharacterModel(b.s),c=await compileCharacterState(m);await compileCharacterInputs(m,c,b.d);
 await expect(compileCharacterModel({...b.s,rulesVersion:SLEEP_RULES,registrySchemaVersion:SLEEP_REGISTRY})).rejects.toThrow('declaration');
 console.info('M210 MATH/ADMISSION PASS '+cases+' original load cases; absent operands unknown; invalid loads/arity/version rejected');
},180000);
it('native210 observed load changes actual action and later relief restores inhibition',async()=>{
 const low=await start(fixture(0)),high=await start(fixture()),repeat=await start(fixture());
 for(const x of [low,high,repeat])await through(x.run,12n);exact(high.run,repeat.run);bytes(low.run.snapshot().state,high.run.snapshot().state);
 const skill=skillValue(state(high.run).read(skillPath(C,high.b.procedure)).value,high.b.procedure,true);expect(skill.K.numerator).toBeGreaterThan(0n);
 const restored=cachedMemory(await restoreCharacterRun(high.b.s,{initialState:high.b.d.initialState,orderedInputs:high.b.d.orderedInputs,save:high.run.save()}));exact(high.run,restored);
 const target=items(items(decode(high.b.s.registry),'list')[16],'list')[1];
 for(const x of [low,high])await through(x.run,14n);await through(restored,14n);exact(high.run,restored);
 for(const x of [low,high]){live(x.run,14,target);expect(rd(x.run,14)[1]).toEqual(text('Known'));}
 expect([low,high].map(x=>uint(items(rd(x.run,14)[2],'list')[0]))).toEqual([950n,150n]);
 expect(cv(low.run,14).slice(2,9)).toEqual(cv(high.run,14).slice(2,9));
 expect(state(low.run).read(sleepPath(C))).toEqual(state(high.run).read(sleepPath(C)));
 expect(cv(low.run,14)[9]).toBe(true);expect(cv(high.run,14)[9]).toBe(false);expect(chosen(low.run,14)).toBeUndefined();expect(chosen(high.run,14)).toEqual(target);
 const trace=outputs(high.run.snapshot().trace,160n).find(t=>at(f(rec(f(t,4n),130n),2n))===14n&&uint(f(rec(f(t,4n),130n),3n))===40n&&key(f(t,6n))===key(text(timeDomainVersion(SLEEP_LOAD_VERSION,EXTENDED_TIME_LIMIT))))!;
 expect(trace).toBeDefined();const receipt=cv(high.run,14)[10];expect(items(items(receipt,'list')[7],'list')).toEqual([u(800)]);expect(items(f(trace,12n),'list')).toContainEqual(receipt);
 const observed=outputs(high.run.snapshot().trace,160n).find(t=>at(f(rec(f(t,4n),130n),2n))===14n&&uint(f(rec(f(t,4n),130n),3n))===20n&&projectionRows(t).some(v=>key(v)===key(receipt)))!;
 expect(observed).toBeDefined();expect(items(f(trace,9n),'list')).toContainEqual(items(receipt,'list')[1]);
 const child=items(f(trace,18n),'list').map(v=>rec(v,130n)).find(e=>uint(f(e,3n))===50n)!;expect(child).toBeDefined();expect(items(f(child,8n),'list')).toContainEqual(f(rec(f(observed,4n),130n),1n));expect(items(f(child,8n),'list')).toContainEqual(f(rec(f(trace,4n),130n),1n));expect(outputs(high.run.snapshot().trace,160n).some(t=>key(f(t,4n))===key(child))).toBe(true);
 for(const x of [low,high])await through(x.run,16n);await through(restored,16n);exact(high.run,restored);
 for(const x of [low,high]){live(x.run,16,target);expect(uint(items(rd(x.run,16)[2],'list')[0])).toBe(950n);expect(cv(x.run,16)[9]).toBe(true);expect(chosen(x.run,16)).toBeUndefined();}
 console.info('M210 NATIVE PASS load0/800 yields950/150; actual action differs with no dice; same acquired skill/physical sleep/workspace; demand0 at16 restores inhibition; traced receipt/parent; repeat12 and exact restore12->14->16');
},600000);
it('privacy210 hidden and missing current demand stay unknown without stale carry',async()=>{
 for(const mode of ['hidden','absent'] as const){const x=await start(fixture(800,mode));await through(x.run,14n);
  const target=items(items(decode(x.b.s.registry),'list')[16],'list')[1];expect(cv(x.run,14)[2]).toBe(true);expect(cv(x.run,14)[3]).toBe(false);expect(rd(x.run,14)[1]).toEqual(text('Unavailable'));expect(items(rd(x.run,14)[2],'list')).toEqual([]);expect(cv(x.run,14)[9]).toBe(false);expect(chosen(x.run,14)).toEqual(target);
  if(mode==='hidden')expect(items(items(cv(x.run,14)[10],'list')[7],'list')).toEqual([]);
  await through(x.run,16n);expect(rd(x.run,16)[1]).toEqual(text('Known'));expect(uint(items(rd(x.run,16)[2],'list')[0])).toBe(950n);expect(cv(x.run,16)[9]).toBe(true);
 }
 console.info('M210 PRIVACY PASS hidden/absent current demand unavailable; no fallback to prior13 zero; visible16 zero restores readiness');
},400000);
