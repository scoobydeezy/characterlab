/** M179 plan f93254f4; original regulatory comparator and native causal gates. */
import {it,expect,vi} from 'vitest';
import {fixture} from './fixtures/assembledRegulatoryStress';
import {startMemory,cachedMemory,type MemoryRun as Run} from './fixtures/assembledMemoryFinal';
import {decode,enc,items,key,list,text,signed,u,q,C,rec,f,uint,bytes,outputs,exact,type CanonicalValue} from './fixtures/assembledFamiliarity';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,ATTRIBUTION_USE_RULES,ATTRIBUTION_USE_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import * as traceModule from '../substrate/trace';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {simInstant} from '../substrate/time';
import {ExactRational as Q} from '../substrate/exactMath';
import {readQ} from '../campaign2/cognitiveMath';
import {SHARED_AFFECT_APPRAISAL,reappraisalPath} from '../assembled/reappraisal';
import {BODY_OWNER,bodyId} from '../assembled/bodyIdentifiers';
import {STRESS,STRESS_QUEUE,STRESS_APPLY,compileStress,stressPath,stressValue,stressAnchor,stressTransition,createStressExecution} from '../assembled/regulatoryStress';
import {createBiologicalRun} from '../campaign3/biologicalIntegration';
import {regulatoryCase,REGULATORY_CASES} from './affectRegulatoryFixtures';
import type {ScheduledEvent} from '../substrate/scheduler';
const d=compileStress(list([text(STRESS),true,u(0),u(500)]));
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M179 time');return v.value;};
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const stress=(r:Run)=>stressAnchor(state(r).read(stressPath(C)).value!);
const physical=(r:Run)=>enc(new AuthoritativeState(state(r).entries().filter(e=>e.path.rootStateTypeId===455n)).canonicalValue());
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const event=(t:ReturnType<typeof rec>)=>rec(f(t,4n),130n);
async function through(r:Run,t:bigint){for(let n=0;r.snapshot().clock<t;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(t);}
async function finish(r:Run){for(let n=0;await r.settleNextInstant();n++)expect(n).toBeLessThan(96);expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
function appraisal(r:Run,status='Known'){
 const a=reports(r,SHARED_AFFECT_APPRAISAL).find(a=>uint(a[1])===10n)!;expect(a,'live authentic appraisal10').toBeDefined();expect(a[5]).toEqual(text(status));
 const decision=outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===10n)!;expect(decision).toBeDefined();expect(uint(f(rec(f(decision,4n),419n),1n))).toBe(1n);expect(outputs(r.snapshot().outputs,433n)).toHaveLength(0);return a;
}
function applied(r:Run,a:readonly CanonicalValue[],expected:number,enabled=true){
 const out=reports(r,STRESS+'/applied').find(v=>at(v[1])===11n)!;expect(out,'live physical consumer11').toBeDefined();const packet=items(out[2],'list');
 expect(packet[4]).toEqual(list(a));expect(at(packet[2])).toBe(10n);expect(stressAnchor(out[3])).toEqual({at:0n,level:0});expect(stressAnchor(out[4])).toEqual({at:11n,level:expected});
 const ts=outputs(r.snapshot().trace,160n),producer=ts.find(t=>uint(f(event(t),1n))===uint(packet[3])&&key(f(t,13n))===key(list(a)))!;
 expect(producer,'actual completed report producer').toBeDefined();expect(uint(f(event(producer),3n))).toBe(50n);
 const queued=ts.find(t=>key(f(event(t),5n))===key(STRESS_QUEUE))!;expect(queued).toBeDefined();expect(at(f(event(queued),2n))).toBe(10n);expect(items(f(event(queued),8n),'list')).toEqual([packet[3]]);
 const applied=ts.find(t=>key(f(event(t),5n))===key(STRESS_APPLY))!;expect(at(f(event(applied),2n))).toBe(11n);expect(uint(f(event(applied),3n))).toBe(52n);expect(items(f(event(applied),8n),'list')).toEqual([f(event(queued),1n)]);
 expect(f(applied,12n)).toEqual(out[2]);expect(items(f(applied,11n),'list')).toHaveLength(1);expect(items(f(applied,17n),'list')).not.toHaveLength(0);
 const replay=stressTransition(out[3],11n,key(a[5])===key(text('Known'))?readQ(items(a[6],'list')[1]):undefined,{...d,enabled});
 expect(replay.value).toEqual(out[4]);return out;
}
it('final179 original64 sources and five receiving projections',async()=>{
 const counts=[0,0,0,0,0];let sources=0;
 for(const name of REGULATORY_CASES)for(let seed=0;seed<8;seed++){
  const c=regulatoryCase(name),r=createBiologicalRun(c.law,c.frames,c.config,seed);for(let i=0;i<12;i++)expect(await r.step()).toBe(true);expect(await r.step()).toBe(false);
  const s=r.snapshot(),before=s.world[1].state,threat=s.rows[1].affect.threat,expected=s.world[2].state.channels.stress.level;
  const values=[threat,threat,before.channels.stress.level,before.damage,Math.max(0,before.channels.reward.level-c.config.constitution.channels.reward.baseline)];
  values.forEach((v,i)=>{const n=stressTransition(stressValue(2n,before.channels.stress.level),3n,v===null?undefined:Q.of(BigInt(v),1000n),{...d,enabled:c.law!=='NoAppraisalImpulse'});if(stressAnchor(n.value).level===expected)counts[i]++;if(i<2)expect(stressAnchor(n.value).level).toBe(expected);});
  sources++;
 }
 expect(sources).toBe(64);expect(counts).toEqual([64,64,56,48,56]);
 expect(stressAnchor(stressTransition(stressValue(0n,999),1n,Q.of(1n),{...d,decay:0}).value).level).toBe(1000);
 expect(stressTransition(stressValue(0n,0),1n,undefined,d).threat).toBeUndefined();expect(stressTransition(stressValue(0n,0),1n,Q.of(0n),d).threat).toBe(0n);
 console.info('M179 ORIGINAL PASS64 full12 sources; Full/ScalarThreat64, Stress56, Pain48, RewardDeviation56; clamp and unknown/zero retained.');
},180000);
it('final179 admission ownership and generated-child rejection',async()=>{
 const b=fixture(),compiled=await compileCharacterModel(b.s),component=await compileCharacterState(compiled),initial=component.initialState(b.d.initialState);
 const path=stressPath(C),before=component.stateModel.read(initial,path).value!,patch={operations:[{kind:'set' as const,path,expected:{presence:true as const,value:before},newValue:stressValue(1n,1)}]};
 expect(()=>component.stateModel.applyPatch(initial,patch,bodyId(1035,'not-body'),{writableRoots:[455n],targetPaths:[path]})).toThrow();
 expect(stressAnchor(component.stateModel.read(component.stateModel.applyPatch(initial,patch,BODY_OWNER,{writableRoots:[455n],targetPaths:[path]}).state,path).value!).level).toBe(1);
 const model=await prepareCharacterModel(b.s);
 const missing=enc(new AuthoritativeState(initial.entries().filter(e=>!(e.path.rootStateTypeId===455n&&e.path.fieldId===2n))).canonicalValue());
 await expect(createCharacterRun(model,{...b.d,initialState:missing})).rejects.toThrow();
 await expect(prepareCharacterModel({...b.s,rulesVersion:ATTRIBUTION_USE_RULES,registrySchemaVersion:ATTRIBUTION_USE_REGISTRY})).rejects.toThrow();
 for(const value of[list([text(STRESS),u(1),u(0),u(500)]),list([text(STRESS),true,u(1001),u(500)]),list([text(STRESS),true,u(0),u(1001)]),list([text(STRESS),true,u(0)])])expect(()=>compileStress(value)).toThrow();
 const fake=list([text(STRESS),C,signed(10),u(99),list([text(SHARED_AFFECT_APPRAISAL),u(10),list([]),u(0),list([]),text('Known'),list([q(1,2),q(1,2)])])]);
 await expect(createCharacterRun(model,{...b.d,orderedInputs:enc(list([...items(decode(b.d.orderedInputs),'list'),list([signed(10),u(51),STRESS_QUEUE,fake,list([])])]))})).rejects.toThrow();
 const exec=createStressExecution(d,C,component.stateModel,compiled.modelIdentity.value,compiled.modelIdentity.value);
 exec.begin(10n);const parent:ScheduledEvent={eventId:99n,eventSequence:99n,dueAt:simInstant(10n),phase:50n,eventTypeId:bodyId(1001,'event/task-appraisal'),payload:list([]),dependencies:list([]),causalParentEventIds:[]};
 const plan=exec.observe(parent,[items(fake,'list')[4]])!;expect(plan).toBeDefined();expect(()=>plan.bind([{...plan.emissions[0],eventId:100n,eventSequence:100n,causalParentEventIds:[99n],payload:list([])}])).toThrow('generated child mismatch');exec.close();
 console.info('M179 ADMISSION PASS version/domain/required anchor/internal-source/foreign owner/forged child rejection.');
},180000);
it('final179 native learned affect changes only later physical stress',async()=>{
 const high=await startMemory(fixture()),zero=await startMemory(fixture('safe')),off=await startMemory(fixture('risk',false));
 bytes(high.b.d.initialState,zero.b.d.initialState);bytes(high.b.d.orderedInputs,off.b.d.orderedInputs);expect(high.b.s).toEqual(zero.b.s);
 let settled=0;while(high.run.snapshot().clock<10n){expect(settled++).toBeLessThan(40);expect(await high.run.settleNextInstant()).toBe(true);for(const x of[zero,off]){expect(await x.run.settleNextInstant()).toBe(true);expect(x.run.snapshot().clock).toBe(high.run.snapshot().clock);bytes(physical(high.run),physical(x.run));}}
 expect(high.run.snapshot().clock).toBe(10n);const a=appraisal(high.run),b=appraisal(zero.run),c=appraisal(off.run);
 expect(a).toEqual(c);expect(a[6]).toEqual(list([q(199,400),q(199,400)]));expect(b[6]).toEqual(list([q(0,1),q(0,1)]));
 const bodyA=items(a[7],'list')[8],bodyB=items(b[7],'list')[8];expect(bodyA).toBeDefined();const sensed=items(items(a[7],'list')[1],'list')[2];expect(rec(sensed,461n)).toBeDefined();expect(sensed).toEqual(items(items(b[7],'list')[1],'list')[2]);expect(bodyA).not.toEqual(list([]));expect(bodyA).toEqual(bodyB);expect(state(high.run).read(reappraisalPath(C))).not.toEqual(state(zero.run).read(reappraisalPath(C)));
 for(const x of[high,zero,off])await through(x.run,11n);applied(high.run,a,249);applied(zero.run,b,0);applied(off.run,c,0,false);
 expect(stress(high.run)).toEqual({at:11n,level:249});expect(stress(zero.run)).toEqual({at:11n,level:0});expect(stress(off.run)).toEqual({at:11n,level:0});
 for(const x of[high,zero,off])await finish(x.run);
 console.info('M179 NATIVE PASS identical complete physical455 histories/sensation through10; U199/400 vs0 -> stress249 vs0 at11; NoImpulse retains affect/removes physical effect; full101.');
},550000);
it('final179 unknown privacy repeat continuation and physical-publication rollback',async()=>{
 const unknown=await startMemory(fixture('denied'));await through(unknown.run,10n);const missing=appraisal(unknown.run,'Unavailable');await through(unknown.run,11n);applied(unknown.run,missing,0);await finish(unknown.run);
 const a=await startMemory(fixture()),repeat=await startMemory(fixture()),hidden=await startMemory(fixture('hidden'));
 for(const x of[a,repeat,hidden])await through(x.run,10n);exact(a.run,repeat.run);bytes(a.run.snapshot().state,hidden.run.snapshot().state);bytes(a.run.snapshot().outputs,hidden.run.snapshot().outputs);
 const saved=a.run.save(),restored=cachedMemory(await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:saved}));
 exact(a.run,restored);const fault=cachedMemory(await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:saved})),before=fault.snapshot(),original=traceModule.traceRecordValue;let reached=false;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(v=>{const out=original(v);if(key(v.event.eventTypeId)===key(STRESS_APPLY)){expect(v.structuralMutationDiffs).toHaveLength(1);expect(v.statePatch.operations[0].path).toEqual(stressPath(C));reached=true;throw Error('M179 after physical patch');}return out;});
 try{await expect(fault.settleNextInstant()).rejects.toThrow('M179 after physical patch');expect(reached).toBe(true);const after=fault.snapshot();expect(after.clock).toBe(before.clock);for(const k of['state','outputs','trace']as const)bytes(after[k],before[k]);}finally{spy.mockRestore();}
 const recovered=cachedMemory(await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:saved}));
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();for(const r of[repeat.run,restored,recovered,hidden.run])expect(await r.settleNextInstant()).toBe(more);for(const r of[repeat.run,restored,recovered])exact(a.run,r);bytes(a.run.snapshot().state,hidden.run.snapshot().state);bytes(a.run.snapshot().outputs,hidden.run.snapshot().outputs);if(!more)break;if(n===95)throw Error('M179 queue cap');}
 expect(a.run.snapshot().clock).toBe(101n);for(const r of[a.run,repeat.run,restored,recovered,hidden.run])expect(r.diagnostic()).toBeUndefined();
 console.info('M179 CONTROLS PASS unknown!=zero, hidden diagnostics invariant, reached physical-patch rollback, repeat/public restore10/recovery exact every instant through101.');
},550000);
