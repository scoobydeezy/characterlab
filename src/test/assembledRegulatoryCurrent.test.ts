/** M189 plan211b4ae8; original regulatory comparator and native causal gates. */
import {it,expect,vi} from 'vitest';
import {fixture as prior} from './fixtures/assembledRegulatoryStress';
import {CALIBRATED_SENSING_RULES,CALIBRATED_SENSING_REGISTRY} from '../assembled/model';
function fixture(...args:Parameters<typeof prior>){const b=prior(...args),slots=[...items(decode(b.s.registry),'list')],body=items(slots[6],'list');if(slots.length!==55||body.length!==7)throw Error('M189 original stress schema');slots[6]=list([text('assembled-body/0.2'),...body.slice(1),signed(0)]);return {...b,s:{...b.s,rulesVersion:CALIBRATED_SENSING_RULES,registrySchemaVersion:CALIBRATED_SENSING_REGISTRY,registry:enc(list(slots))}};} 
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
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M189 time');return v.value;};
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
it('current189 regulatory learned affect changes only later physical stress',async()=>{
 const high=await startMemory(fixture()),zero=await startMemory(fixture('safe')),off=await startMemory(fixture('risk',false));
 bytes(high.b.d.initialState,zero.b.d.initialState);bytes(high.b.d.orderedInputs,off.b.d.orderedInputs);expect(high.b.s).toEqual(zero.b.s);
 let settled=0;while(high.run.snapshot().clock<10n){expect(settled++).toBeLessThan(40);expect(await high.run.settleNextInstant()).toBe(true);for(const x of[zero,off]){expect(await x.run.settleNextInstant()).toBe(true);expect(x.run.snapshot().clock).toBe(high.run.snapshot().clock);bytes(physical(high.run),physical(x.run));}}
 expect(high.run.snapshot().clock).toBe(10n);const a=appraisal(high.run),b=appraisal(zero.run),c=appraisal(off.run);
 expect(a).toEqual(c);expect(a[6]).toEqual(list([q(199,400),q(199,400)]));expect(b[6]).toEqual(list([q(0,1),q(0,1)]));
 const bodyA=items(a[7],'list')[8],bodyB=items(b[7],'list')[8];expect(bodyA).toBeDefined();const sensed=items(items(a[7],'list')[1],'list')[2];expect(rec(sensed,461n)).toBeDefined();expect(sensed).toEqual(items(items(b[7],'list')[1],'list')[2]);expect(bodyA).not.toEqual(list([]));expect(bodyA).toEqual(bodyB);expect(state(high.run).read(reappraisalPath(C))).not.toEqual(state(zero.run).read(reappraisalPath(C)));
 for(const x of[high,zero,off])await through(x.run,11n);applied(high.run,a,249);applied(zero.run,b,0);applied(off.run,c,0,false);
 expect(stress(high.run)).toEqual({at:11n,level:249});expect(stress(zero.run)).toEqual({at:11n,level:0});expect(stress(off.run)).toEqual({at:11n,level:0});
 for(const x of[high,zero,off])await finish(x.run);
 console.info('M189 NATIVE PASS identical complete physical455 histories/sensation through10; U199/400 vs0 -> stress249 vs0 at11; NoImpulse retains affect/removes physical effect; full101.');
},550000);
