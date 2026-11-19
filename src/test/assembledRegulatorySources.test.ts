/** M180 plan8c0b819b; source absence is distinct from missing evidence. */
import {it,expect} from 'vitest';
import {fixture,threatTask} from './fixtures/assembledRegulatorySources';
import {startMemory,cachedMemory,type MemoryRun as Run} from './fixtures/assembledMemoryFinal';
import {decode,enc,items,key,list,text,signed,u,q,C,rec,f,uint,bytes,outputs,exact,type CanonicalValue} from './fixtures/assembledFamiliarity';
import {restoreCharacterRun} from '../assembled/character';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {statePathValue} from '../substrate/state';
import {SHARED_AFFECT_APPRAISAL,reappraisalPath,reappraisalKnowledge,GOAL_ABSENCE_VERSION} from '../assembled/reappraisal';
import {importancePath,importanceValue} from '../assembled/priority';
import {STRESS,stressPath,stressAnchor,STRESS_APPLY} from '../assembled/regulatoryStress';
import {createBiologicalRun} from '../campaign3/biologicalIntegration';
import {regulatoryCase} from './affectRegulatoryFixtures';
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M180 time');return v.value;};
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const physical=(r:Run)=>enc(new AuthoritativeState(state(r).entries().filter(e=>e.path.rootStateTypeId===455n)).canonicalValue());
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const event=(t:ReturnType<typeof rec>)=>rec(f(t,4n),130n);
const statusPath=(b:ReturnType<typeof fixture>)=>({...importancePath(threatTask(b)),fieldId:1n});
async function through(r:Run,t:bigint){for(let n=0;r.snapshot().clock<t;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(t);}
async function finish(r:Run){for(let n=0;await r.settleNextInstant();n++)expect(n).toBeLessThan(96);expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
async function matchedPrefix(runs:Run[]){for(let n=0;runs[0].snapshot().clock<10n;n++){expect(n).toBeLessThan(48);for(const r of runs)expect(await r.settleNextInstant()).toBe(true);for(const r of runs.slice(1)){expect(r.snapshot().clock).toBe(runs[0].snapshot().clock);bytes(physical(r),physical(runs[0]));}}expect(runs[0].snapshot().clock).toBe(10n);}
function live(r:Run,status:string,when=10n){
 const a=reports(r,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===when)!;expect(a,'live authentic appraisal').toBeDefined();expect(a[5]).toEqual(text(status));
 const t=outputs(r.snapshot().trace,160n).find(t=>at(f(event(t),2n))===when&&key(f(t,13n))===key(list(a)))!;
 expect(t,'actual source trace').toBeDefined();expect(uint(f(event(t),3n))).toBe(50n);
 if(when===10n){const decision=outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===when)!;expect(decision).toBeDefined();expect(uint(f(rec(f(decision,4n),419n),1n))).toBe(1n);expect(outputs(r.snapshot().outputs,433n)).toHaveLength(0);}
 const body=rec(items(items(a[7],'list')[1],'list')[2],461n);expect(body).toBeDefined();
 return {a,t,body:f(body,5n)};
}
function adoption(r:Run,b:ReturnType<typeof fixture>,t:ReturnType<typeof rec>,present:boolean){
 const reads=items(f(t,11n),'list').map(v=>rec(v,147n)),read=reads.find(v=>key(f(v,2n))===key(statePathValue(statusPath(b))))!;
 expect(read,'actual owned adoption read').toBeDefined();expect(f(read,3n)).toBe(present);expect(state(r).read(statusPath(b)).presence).toBe(present);
 if(present)expect(uint(f(rec(f(read,4n),372n),1n))).toBe(1n);
}
function knowledge(r:Run){
 const k=reappraisalKnowledge(state(r).read(reappraisalPath(C)).value,C,true,true,true,true);
 return {means:k.means,catalogue:k.catalogue,mitigation:k.mitigation,baseline:k.efficacy!.means,control:k.efficacy!.control,cue:k.efficacy!.cue!.mean,alternative:k.efficacy!.alternative!.mean,rows:k.rows.length,supports:k.efficacy!.supports.length,cueSupports:k.efficacy!.cue!.supports.length};
}
function consumed(r:Run,source:ReturnType<typeof live>,level:number,when=11n){
 const report=reports(r,STRESS+'/applied').find(v=>at(v[1])===when)!;expect(report,'live strictly later physical consumer').toBeDefined();
 const packet=items(report[2],'list');expect(packet[4]).toEqual(list(source.a));expect(packet[3]).toEqual(f(event(source.t),1n));expect(at(packet[2])).toBe(when-1n);
 expect(stressAnchor(report[4])).toEqual({at:when,level});expect(stressAnchor(state(r).read(stressPath(C)).value!)).toEqual({at:when,level});
 const t=outputs(r.snapshot().trace,160n).find(t=>at(f(event(t),2n))===when&&key(f(event(t),5n))===key(STRESS_APPLY))!;expect(t).toBeDefined();expect(uint(f(event(t),3n))).toBe(52n);expect(f(t,12n)).toEqual(report[2]);expect(items(f(t,17n),'list')).toHaveLength(1);
 if(key(source.a[5])===key(text('Known')))expect(items(report[5],'list')).toHaveLength(1);else expect(items(report[5],'list')).toHaveLength(0);
 return report;
}
it('final180 original goal and receipt controls',async()=>{
 const observations=[];
 for(const name of['FalseHarm','NoGoal','NoReceipt','DeniedHarm']as const){const c=regulatoryCase(name),r=createBiologicalRun(c.law,c.frames,c.config,0);for(let i=0;i<12;i++)expect(await r.step()).toBe(true);expect(await r.step()).toBe(false);observations.push(r.snapshot());}
 const [risk,noGoal,noReceipt,denied]=observations;
 for(const s of observations.slice(1))expect(s.world.slice(0,2)).toEqual(risk.world.slice(0,2));
 expect(risk.rows[1].affect.threat).toBe(270);expect(noGoal.rows[1].affect.threat).toBe(0);expect(noGoal.rows[1].beliefs).toEqual(risk.rows[1].beliefs);expect(noGoal.rows[1].protection).toBe(false);
 for(const s of[noReceipt,denied]){expect(s.rows[1].beliefs.drug.harm).toBeNull();expect(s.rows[1].affect.threat).toBeNull();}
 expect(observations.map(s=>s.world[2].state.channels.stress.level)).toEqual([135,0,0,0]);
 console.info('M180 ORIGINAL PASS4 complete12 sources: absent goal retains harm600/threat0; missing receipt/denied harm stay unknown; later stress135/0/0/0.');
});
it('final180 native known absence and retained legacy defect',async()=>{
 const risk=await startMemory(fixture()),absent=await startMemory(fixture('noGoal')),old=await startMemory(fixture('noGoal',true));
 await matchedPrefix([risk.run,absent.run,old.run]);const a=live(risk.run,'Known'),b=live(absent.run,'Known'),c=live(old.run,'Unavailable');
 adoption(risk.run,risk.b,a.t,true);adoption(absent.run,absent.b,b.t,false);adoption(old.run,old.b,c.t,false);
 expect(a.a[6]).toEqual(list([q(199,400),q(199,400)]));expect(b.a[6]).toEqual(list([q(0,1),q(0,1)]));expect(c.a[6]).toEqual(list([]));expect(a.body).toEqual(b.body);expect(a.body).toEqual(c.body);
 expect(knowledge(absent.run)).toEqual(knowledge(risk.run));expect(knowledge(old.run)).toEqual(knowledge(risk.run));
 expect(items(items(b.a[7],'list')[4],'list')[1]).toEqual(q(0,1));expect(items(b.a[7],'list')[3]).toEqual(text('KnownAbsentThreatGoal'));
 expect((f(b.t,6n)as {value:string}).value).toContain(GOAL_ABSENCE_VERSION);expect(f(c.t,6n)).not.toEqual(f(b.t,6n));
 for(const x of[risk,absent,old])await through(x.run,11n);consumed(risk.run,a,249);consumed(absent.run,b,0);consumed(old.run,c,0);
 for(const x of[risk,absent,old])await finish(x.run);
 console.info('M180 GOAL PASS same physical prehistory/body evidence/retained danger; actual absent373/1 yields Known0 and later stress0; risk249. Legacy0.127 Unavailable defect retained; all101.');
},550000);
it('final180 native missing receipt is not known zero',async()=>{
 const modes=['safe','noReceipt','denied','noGoalNoReceipt']as const,all=[];
 for(const mode of modes)all.push(await startMemory(fixture(mode)));
 await matchedPrefix(all.map(x=>x.run));
 const sources=all.map((x,i)=>live(x.run,i===0?'Known':'Unavailable'));
 expect(sources[0].a[6]).toEqual(list([q(0,1),q(0,1)]));expect(knowledge(all[0].run).cue?.numerator).toBe(0n);
 for(let i=1;i<all.length;i++){expect(sources[i].a[6]).toEqual(list([]));expect(knowledge(all[i].run).cue).toBeUndefined();expect(knowledge(all[i].run).cueSupports).toBe(0);expect(sources[i].body).toEqual(sources[0].body);}
 adoption(all[3].run,all[3].b,sources[3].t,false);expect(items(items(sources[3].a[7],'list')[4],'list')[1]).toEqual(q(0,1));
 for(let i=0;i<all.length;i++){await through(all[i].run,11n);consumed(all[i].run,sources[i],0);await finish(all[i].run);}
 console.info('M180 RECEIPT PASS safe known-zero vs absent After/denied Motion/noGoal+missing all Unknown; no false negative sample, same body operands, authentic later no-dose; all101.');
},550000);
it('final180 later adoption exact repeat and public continuation',async()=>{
 const a=await startMemory(fixture('laterGoal')),repeat=await startMemory(fixture('laterGoal'));
 for(const x of[a,repeat])await through(x.run,11n);exact(a.run,repeat.run);
 const early=live(a.run,'Known');adoption(a.run,a.b,early.t,false);expect(early.a[6]).toEqual(list([q(0,1),q(0,1)]));consumed(a.run,early,0);
 const k=knowledge(a.run),restored=cachedMemory(await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()}));exact(a.run,restored);
 let later:ReturnType<typeof live>|undefined,adopted=false,applied=false;
 for(let n=0;n<96;n++){
  const more=await a.run.settleNextInstant();for(const r of[repeat.run,restored]){expect(await r.settleNextInstant()).toBe(more);exact(a.run,r);}
  if(more&&a.run.snapshot().clock===12n){adopted=true;expect(uint(f(rec(state(a.run).read(statusPath(a.b)).value!,372n),1n))).toBe(1n);expect(importanceValue(state(a.run).read(importancePath(threatTask(a.b))).value!).I.numerator).toBe(1n);expect(knowledge(a.run)).toEqual(k);
   const tr=outputs(a.run.snapshot().trace,160n).find(t=>at(f(event(t),2n))===12n&&uint(f(event(t),3n))===140n&&items(f(t,17n),'list').some(v=>{const diff=rec(v,148n);return key(f(diff,1n))===key(statePathValue(statusPath(a.b)));}));expect(tr,'actual prospective-owner adoption patch').toBeDefined();
  }
  if(more&&a.run.snapshot().clock===26n){later=live(a.run,'Known',26n);adoption(a.run,a.b,later.t,true);expect(later.a[6]).toEqual(list([q(199,400),q(199,400)]));expect(knowledge(a.run)).toEqual(k);expect(reports(a.run,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===10n)).toEqual(early.a);}
  if(more&&a.run.snapshot().clock===27n){expect(later).toBeDefined();consumed(a.run,later!,249,27n);applied=true;}
  if(!more)break;if(n===95)throw Error('M180 queue cap');
 }
 expect(adopted&&applied).toBe(true);expect(a.run.snapshot().clock).toBe(101n);for(const r of[a.run,repeat.run,restored])expect(r.diagnostic()).toBeUndefined();
 console.info('M180 ADOPTION PASS ordinary12 adoption changes later26 appraisal/27 stress0->249 with retained knowledge; earlier report frozen; independent repeat/public save11 exact every remaining byte through101.');
},550000);
