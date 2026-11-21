import {it,expect,vi} from 'vitest';
import {fixture,start,state,labels,through,at,decode,items,key,enc,list,text,u,signed,C,rec,f,uint,outputs,bytes,exact,type Run} from './fixtures/assembledSleepControl';
import {SLEEP,SLEEP_SOURCE,SLEEP_VERSION,SLEEP_RECEIPT,READINESS,compileSleep,sleepPath,sleepValue,sleepAnchor,sleepElapsed,sleepRecover,readiness,createSleepExecution} from '../assembled/sleepControl';
import {CONTROL_VIEW,CONTROL_OPTIONS,WORKSPACE_OWNER} from '../assembled/control';
import {compileCharacterModel,INTERFERENCE_ACQUISITION_RULES,INTERFERENCE_ACQUISITION_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {skillPath,skillValue} from '../assembled/skill';
import {AuthoritativeState,statePathValue} from '../substrate/state';
import * as traceModule from '../substrate/trace';
import {simInstant} from '../substrate/time';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {defaultConstitution,initialBiology,advanceBiology,emptyPhysicalInput} from '../campaign3/biologicalDynamics';
import {appraise} from '../campaign3/biologyPublicMath';
import {sleepCase} from './sleepControlFixtures';
const d=compileSleep(list([text(SLEEP),true,u(100),u(1000),u(0),u(800),u(10)]));
const cv=(r:Run,t:number)=>labels(r,CONTROL_VIEW).find(v=>uint(v[1])===BigInt(t))!;
const rd=(r:Run,t:number)=>items(cv(r,t).find(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(READINESS)))!,'list');
const decision=(r:Run,t:number)=>outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===BigInt(t))!;
function chosen(r:Run,t:number){const x=decision(r,t);expect(x,'actual decision').toBeDefined();const a=rec(f(x,4n),419n);return uint(f(a,1n))===3n?f(rec(f(rec(f(a,2n),420n),1n),395n),2n):undefined;}
const projectionRows=(t:ReturnType<typeof rec>)=>{const v=f(t,13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[];};
function live(r:Run,t:number,target:Parameters<typeof key>[0]){
 const v=cv(r,t);expect(v,'live control view').toBeDefined();expect(v[2]).toBe(true);expect(v[3]).toBe(true);expect(uint(v[8])).toBeGreaterThanOrEqual(1n);expect(rd(r,t)[1]).toEqual(text('Known'));
 const traces=outputs(r.snapshot().trace,160n),trace=traces.find(x=>at(f(rec(f(x,4n),130n),2n))===BigInt(t)&&uint(f(rec(f(x,4n),130n),3n))===70n&&projectionRows(x).some(o=>typeof o!=='boolean'&&o.kind==='list'&&o.items.length>0&&key(o.items[0])===key(text(CONTROL_OPTIONS))))!;
 expect(trace,'actual candidate consumer').toBeDefined();const input=rec(items(f(trace,12n),'list')[0],398n),candidates=items(f(input,3n),'list');expect(candidates.some(v=>key(f(rec(f(rec(v,397n),1n),395n),2n))===key(target as Parameters<typeof key>[0]))).toBe(true);
 const workspace=traces.find(x=>at(f(rec(f(x,4n),130n),2n))===BigInt(t)&&uint(f(rec(f(x,4n),130n),3n))===40n&&projectionRows(x).some(o=>typeof o!=='boolean'&&o.kind==='list'&&o.items.length>0&&key(o.items[0])===key(text(CONTROL_VIEW))))!;
 expect(workspace).toBeDefined();expect(items(f(workspace,11n),'list').some(v=>key(f(rec(v,147n),2n))===key(statePathValue(sleepPath(C))))).toBe(false);
 expect(items(f(workspace,12n),'list').at(-1)).toEqual(rd(r,t)[4]);
 const receipt=items(rd(r,t)[4],'list');expect(receipt[0]).toEqual(text(SLEEP_RECEIPT));expect(at(receipt[2])).toBe(BigInt(t));
 const draws=traces.filter(x=>at(f(rec(f(x,4n),130n),2n))===BigInt(t)).flatMap(x=>items(f(x,14n),'list'));expect(draws,'automatic comparison has no unmatched dice').toHaveLength(0);
 return v;
}
it('math209 exact original sleep phases and readiness boundaries',()=>{
 const c=defaultConstitution();c.sleepAccumulation=100;c.sleepRecovery=1000;c.nightDrive=0;c.clearance=0;
 let original=initialBiology(c),v=sleepValue(0n,original.sleepDebt,original.phase,original.burden,original.channels.arousal.level);
 for(let t=1;t<=24;t++){original=advanceBiology(original,c,emptyPhysicalInput(),'Full','elapsed').state;v=sleepElapsed(v,BigInt(t),d);expect(sleepAnchor(v).debt).toBe(original.sleepDebt);expect(sleepAnchor(v).phase).toBe(original.phase);const input={...emptyPhysicalInput(),asleep:t===2||t>=8};original=advanceBiology(original,c,input,'Full','consequence').state;v=sleepRecover(v,input.asleep,d);expect(sleepAnchor(v).debt).toBe(original.sleepDebt);}
 const {frames,config}=sleepCase();
 for(const sleep of [0,1,2,3,399,400,401,600,1000])for(const stress of [0,1,400])for(const arousal of [0,500,1000]){
  const before={hunger:0,thirst:0,sleepiness:sleep,pain:0,intoxication:0,reward:0,stress,arousal,pleasure:0,withdrawalReward:0,withdrawalStress:0,withdrawalArousal:0};
  const original=appraise(before,frames[7],{protection:true,work:false,maintained:true},[],config,'Full'),current=readiness([sleep,stress,0,arousal],d);expect(current.capacity).toBe(original.control);expect(current.allowed).toBe(original.inhibited);
 }
 for(let i=0;i<4;i++){const xs:(number|undefined)[]=[0,0,0,500];xs[i]=undefined;expect(readiness(xs,d)).toMatchObject({known:false,capacity:undefined,allowed:false});}
 expect(readiness([400,0,0,500],d).allowed).toBe(true);expect(readiness([402,0,0,500],d).allowed).toBe(false);
 console.info('M209 MATH PASS 24 original elapsed/consequence steps;81 capacity/threshold cases; current missing operands stay unavailable');
});
it('boundaries209 version admission body authority child binding and late rollback',async()=>{
 const b=fixture(),m=await compileCharacterModel(b.s),c=await compileCharacterState(m),initial=c.initialState(b.d.initialState),input=await compileCharacterInputs(m,c,b.d),path=sleepPath(C),prior=initial.read(path).value!;
 expect(()=>c.stateModel.applyPatch(initial,{operations:[{kind:'set',path,expected:{presence:true,value:prior},newValue:sleepValue(1n,100)}]},WORKSPACE_OWNER)).toThrow();
 expect(()=>c.initialState(enc(new AuthoritativeState(initial.entries().map(e=>key(e.path.rootStateTypeId===455n&&e.path.fieldId===3n?e.value:list([]))===key(prior)?{...e,value:sleepValue(1n,0)}:e)).canonicalValue()))).toThrow('initial sleep');
 await expect(compileCharacterModel({...b.s,rulesVersion:INTERFERENCE_ACQUISITION_RULES,registrySchemaVersion:INTERFERENCE_ACQUISITION_REGISTRY})).rejects.toThrow('slot count');
 const duplicate={...b.d,orderedInputs:enc(list([...items(decode(b.d.orderedInputs),'list'),items(decode(b.d.orderedInputs),'list').find(v=>key(items(v,'list')[2])===key(SLEEP_SOURCE))!]))};await expect(compileCharacterInputs(m,c,duplicate)).rejects.toThrow('duplicate');
 expect(()=>compileSleep(list([text(SLEEP),true,u(100),u(1000),u(0),u(800),u(0)]))).toThrow();
 const exec=createSleepExecution(m.body!.sleep!,m.body!.stress!,C,c.stateModel,input.sleepEvents,m.modelIdentity.value,input.runIdentity.value),event=input.sleepEvents[0];let id=10000n;exec.begin(1n);
 const missingObserver=new AuthoritativeState(initial.entries().filter(e=>e.path.rootStateTypeId!==268n));expect(()=>exec.execute({event,state:missingObserver,instant:simInstant(1n),allocateRuntimeId:()=>id++})).toThrow('required physical anchor');exec.close();exec.begin(1n);
 const result=exec.execute({event,state:initial,instant:simInstant(1n),allocateRuntimeId:()=>id++});
 const children=result.emittedEvents.map((e,i)=>({...e,eventId:20000n+BigInt(i),eventSequence:20000n+BigInt(i),causalParentEventIds:[event.eventId]}));
 expect(()=>exec.execute({event:children[0],state:result.nextState,instant:simInstant(1n),allocateRuntimeId:()=>id++})).toThrow('authentication');
 expect(()=>result.traceFactory(children.map(e=>({...e,causalParentEventIds:[]})))).toThrow('mismatch');exec.close();
 const {run}=await start(b),before=run.snapshot(),write=traceModule.traceRecordValue;let reached=false;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(x=>{if(x.seamVersion===SLEEP_VERSION&&x.event.phase===120n){reached=true;throw Error('M209 after physical recovery');}return write(x);});
 try{await expect(run.settleNextInstant()).rejects.toThrow('M209 after physical recovery');expect(reached).toBe(true);for(const k of ['state','outputs','trace'] as const)bytes(run.snapshot()[k],before[k]);expect(run.snapshot().clock).toBe(before.clock);}finally{spy.mockRestore();}
 console.info('M209 BOUNDARIES PASS domains/version/unique BODY_OWNER/authenticated children/C1 pipeline and late120 whole-instant rollback');
},300000);
it('diagnostic209 current consumer reader and live deprived choice',async()=>{const x=await start(fixture('Deprived'));await through(x.run,14n);const target=items(items(decode(x.b.s.registry),'list')[16],'list')[1];live(x.run,14,target);expect(uint(items(rd(x.run,14)[2],'list')[0])).toBe(700n);expect(chosen(x.run,14)).toEqual(target);console.info('M209 DIAGNOSTIC PASS current producer/consumer/choice readers; native deprived700 with actual target');},300000);
it('native209 learned practice plus current sleep changes actual inhibition and action',async()=>{
 const a=await start(fixture('Rested')),b=await start(fixture('Deprived')),c=await start(fixture('Recovered')),repeat=await start(fixture('Recovered'));
 for(const x of[a,b,c,repeat])await through(x.run,12n);exact(c.run,repeat.run);
 const projection=(r:Run)=>new AuthoritativeState(state(r).entries().filter(e=>e.path.rootStateTypeId!==455n)).canonicalValue();
 expect(projection(a.run)).toEqual(projection(b.run));expect(projection(b.run)).toEqual(projection(c.run));
 const skill=skillValue(state(c.run).read(skillPath(C,c.b.procedure)).value,c.b.procedure,true);expect(skill.K.numerator).toBeGreaterThan(0n);
 const saved=c.run.save(),restored=cachedMemory(await restoreCharacterRun(c.b.s,{initialState:c.b.d.initialState,orderedInputs:c.b.d.orderedInputs,save:saved}));exact(c.run,restored);
 const target=items(items(decode(c.b.s.registry),'list')[16],'list')[1];
 for(const x of[a,b,c])await through(x.run,14n);await through(restored,14n);exact(c.run,restored);
 for(const x of[a,b,c])live(x.run,14,target);
 expect([a,b,c].map(x=>uint(items(rd(x.run,14)[2],'list')[0]))).toEqual([950n,700n,700n]);
 expect(cv(a.run,14)[9]).toBe(true);expect(cv(b.run,14)[9]).toBe(false);expect(cv(c.run,14)[9]).toBe(false);
 expect(chosen(a.run,14)).toBeUndefined();expect(chosen(b.run,14)).toEqual(target);expect(chosen(c.run,14)).toEqual(target);
 expect(sleepAnchor(state(c.run).read(sleepPath(C)).value!).debt).toBe(0);expect(sleepAnchor(state(b.run).read(sleepPath(C)).value!).debt).toBe(600);
 for(const x of[a,b,c])await through(x.run,16n);await through(restored,16n);exact(c.run,restored);
 for(const x of[a,b,c])live(x.run,16,target);
 expect([a,b,c].map(x=>cv(x.run,16)[9])).toEqual([true,false,true]);expect(chosen(c.run,16)).toBeUndefined();expect(chosen(b.run,16)).toEqual(target);
 console.info('M209 NATIVE PASS shared acquired skill/history; actual target14 in deprived/recovered vs inhibited rested; recovery14 changes16 only; no dice at compared choices; repeat12 and exact save12->16');
},600000);
it('controls209 denied truth biased sensing ablation and maintained-goal boundary',async()=>{
 const a=await start(fixture('Rested',{denied:true})),b=await start(fixture('Deprived',{denied:true}));
 for(const x of[a,b])await through(x.run,14n);
 const safe=(r:Run)=>list(labels(r,SLEEP_RECEIPT).map(v=>list(v)));
 expect(safe(a.run)).toEqual(safe(b.run));expect(rd(a.run,14)[1]).toEqual(text('Unavailable'));expect(rd(b.run,14)[1]).toEqual(text('Unavailable'));expect(cv(a.run,14)[9]).toBe(false);expect(cv(b.run,14)[9]).toBe(false);
 bytes(a.run.decisionHistory(),b.run.decisionHistory());expect(sleepAnchor(state(a.run).read(sleepPath(C)).value!).debt).not.toBe(sleepAnchor(state(b.run).read(sleepPath(C)).value!).debt);
 for(const [options,expected,status]of [[{bias:-1000},true,'Known'],[{enabled:false},true,'Known'],[{support:false},false,'Known']] as const){
  const x=await start(fixture('Deprived',options));await through(x.run,14n);expect(rd(x.run,14)[1]).toEqual(text(status));expect(cv(x.run,14)[9]).toBe(expected);
  if('bias'in options)expect(uint(items(rd(x.run,14)[2],'list')[0])).toBe(1000n);
  if('support'in options)expect(cv(x.run,14)[3]).toBe(false);
 }
 const fatigued=await start(fixture('Rested',{fatigue:true}));await through(fatigued.run,14n);expect(uint(items(rd(fatigued.run,14)[2],'list')[0])).toBe(950n);expect(cv(fatigued.run,14)[9]).toBe(false);
 console.info('M209 CONTROLS PASS unequal hidden debt/equal admitted sleep and decisions; biased perception controls inhibition; NoReadiness removes only physiological restriction; absent maintenance or retained severe fatigue still prevents inhibition');
},600000);
