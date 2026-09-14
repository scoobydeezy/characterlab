import {describe,it,expect} from 'vitest';
import {attentionFixtureRead as read,attentionFixtureSource as source,attentionFixtureInitial as initial,attentionFixtureSeed as seed,attentionFixtureFreeze as freeze} from './attentionPublicFixtures';
import {prepareAttentionModel,createAttentionRun,restoreAttentionRun} from '../campaign3/attentionFactory';
import {compileAttentionModel} from '../campaign3/attentionModel';
import {compileAttentionInputs} from '../campaign3/attentionInputs';
import {createAttentionRuntime} from '../campaign3/attentionRuntime';
import {validateAttentionTrace} from '../campaign3/attentionTrace';
import {decodeAttention as decode} from '../campaign3/attentionCodecs';
import {canonicalEncode as enc,list,record,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {scheduledEventValue} from '../substrate/persistence';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {prepareCampaign2Model} from '../campaign2/factory';
import {prepareEmbodiedModel} from '../campaign3/embodiedFactory';
import {decodeCampaign2} from '../campaign2/codecs';
import {decodeEmbodied} from '../campaign3/embodiedCodecs';
import {attentionFixture} from './attentionFixtures';
import {prepareAttentionPool,selectAttention,consumeSelected} from '../campaign3/attentionSelection';
import type {CharacterEvidenceRef} from '../semanticBinding/evidenceProvenance';
import {dataItems as items,dataField as f,dataRecord as rec,dataKey as key,dataUnsigned as u} from '../campaign2/canonicalData';
const args=(scene='base')=>({initialState:initial(),orderedInputs:read('input-'+scene+'.cenc.hex'),runSeed:seed()});
const restoreScheduledEvent=(value:CanonicalValue):ScheduledEvent=>{const r=rec(value,130n),at=f(r,2n);if(typeof at==='boolean'||at.kind!=='signed')throw Error('event instant');return {eventId:u(f(r,1n)),dueAt:simInstant(at.value),phase:u(f(r,3n)),eventSequence:u(f(r,4n)),eventTypeId:id(f(r,5n)),payload:f(r,6n),dependencies:f(r,7n),causalParentEventIds:items(f(r,8n),'list').map(u)};};
const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{const r=rec(v,(v as {schema:{typeId:bigint}}).schema.typeId);return record(r.schema,new Map([...r.fields].map(([k,a])=>[k,k===n?x:a])));};
async function run(name:string,scene='base'){const h=await prepareAttentionModel(source(name)),r=await createAttentionRun(h,args(scene));await r.settleNextInstant();return r;}
const outputs=(r:Awaited<ReturnType<typeof run>>)=>items(decode(r.snapshot().outputs),'list');
const type=(v:CanonicalValue)=>(v as {schema:{typeId:bigint}}).schema.typeId;
describe('attention public boundary qualification',()=>{
 it('a concurrent settlement rejects without resetting the active transaction',async()=>{
  for(const name of ['role-k1-channel-13','role-k1-channel-0'])for(const delay of [0,2]){const h=await prepareAttentionModel(source(name)),r=await createAttentionRun(h,args()),first=r.settleNextInstant();for(let i=0;i<delay;i++)await Promise.resolve();await expect(r.settleNextInstant()).rejects.toThrow('quiescence');await first;const baseline=await run(name);expect(r.save()).toEqual(baseline.save());}
  const m=await compileAttentionModel(source('role-k1-channel-13')),input=await compileAttentionInputs(args().orderedInputs,initial(),seed(),m),runtime=createAttentionRuntime(m,input,m.initialState(initial()));let second:Promise<boolean>|undefined;await runtime.settleNextInstantForConformance({onBoundary:(b,e)=>{if(b==='after-trace-validation'&&e?.phase===15n)second=runtime.settleNextInstant().then(()=>false,()=>true);}});expect(await second).toBe(true);expect(runtime.save()).toEqual((await run('role-k1-channel-13')).save());
 });
 it('the actual selected-only component has no parent-audit, archive or observation resolver',()=>{
  const f=attentionFixture(),pool=prepareAttentionPool(f.experience,f.claims);for(const ref of [{kind:'selection-audit',selectionId:0n},{kind:'experience',experienceId:f.experience.experienceId},{kind:'observation',observationId:0n},{kind:'archive',path:'all'}])expect(()=>consumeSelected(selectAttention(pool,1).view,[ref as CharacterEvidenceRef])).toThrow();
 });
 it('preserves old factory/codec exclusion and rejects canonical save edits at every field',async()=>{
  const s=source('role-k1-channel-13');await expect(prepareCampaign2Model(s)).rejects.toThrow();await expect(prepareEmbodiedModel(s)).rejects.toThrow();
  const runtime=await run('role-k1-channel-13'),audit=outputs(runtime).find(v=>type(v)===532n)!;expect(()=>decodeCampaign2(enc(audit))).toThrow();expect(()=>decodeEmbodied(enc(audit))).toThrow();
  const saved=decode(runtime.save());for(let field=1n;field<=12n;field++)await expect(restoreAttentionRun(s,{initialState:initial(),orderedInputs:args().orderedInputs,save:enc(replace(saved,field,unsigned(999)))})).rejects.toThrow();
  const partial=replace(saved,11n,list(items(f(rec(saved,132n),11n),'list').slice(0,-1)));await expect(restoreAttentionRun(s,{initialState:initial(),orderedInputs:args().orderedInputs,save:enc(partial)})).rejects.toThrow();
  const handle=await prepareAttentionModel(s),one=items(decode(args().orderedInputs),'list')[0];await expect(createAttentionRun(handle,{...args(),orderedInputs:enc(list([one,one]))})).rejects.toThrow();
 },60000);
 it('hidden-role substitutions preserve exact observer-side history for every denied port/channel',async()=>{
  for(const model of freeze.models.filter(m=>m.name.startsWith('role-k1-channel-')&&m.modes.includes('Denied'))){const base=outputs(await run(model.name)).filter(v=>type(v)!==210n);for(let i=0;i<3;i++)if(model.modes[i]==='Denied'){const alternate=outputs(await run(model.name,'instrument-'+['a','b','c'][i])).filter(v=>type(v)!==210n);expect(alternate.map(key)).toEqual(base.map(key));}}
 },120000);
 it('capacity interventions preserve SEM and exact fixed priorities; read receipts are later diagnostic outputs',async()=>{
  const runs=await Promise.all(['role-k0','role-k1-channel-13','role-k2','equal-k1','unlimited'].map(name=>run(name))),perception=runs.map(r=>outputs(r).filter(v=>type(v)<532n).map(key));for(const p of perception.slice(1))expect(p).toEqual(perception[0]);
  const result=outputs(runs[1]),audit=rec(result.find(v=>type(v)===532n)!,532n),priorities=items(f(audit,6n),'list').map(row=>f(rec(row,531n),4n));expect(priorities.map(v=>v as {numerator:bigint;denominator:bigint}).map(q=>[q.numerator,q.denominator])).toEqual([[1n,1n],[9n,10n],[3n,5n]]);
  const trace=items(decode(runs[1].snapshot().trace),'list');for(const row of trace.slice(-2)){expect(items(f(rec(row,160n),10n),'list')).toHaveLength(0);expect(items(f(rec(row,160n),11n),'list')).toHaveLength(0);expect(items(f(rec(row,160n),14n),'list')).toHaveLength(0);}
 },60000);
 it('every stage and commit-boundary failure rolls back state, outputs, queue and all allocators',async()=>{
  for(const name of ['role-k1-channel-13','role-k1-channel-0']){const m=await compileAttentionModel(source(name)),input=await compileAttentionInputs(args().orderedInputs,initial(),seed(),m);const stages=name.endsWith('-0')?[1,2,9,10]:[1,2,3,4,5,6,7,8,10];
   for(const phase of stages)for(const boundary of ['before-event-validation','after-event-validation','before-trace-validation','after-trace-validation'] as const){const runtime=createAttentionRuntime(m,input,m.initialState(initial())),before=runtime.snapshot();let fired=false;await expect(runtime.settleNextInstantForConformance({onBoundary:(b,e)=>{if(b===boundary&&e && key(e.eventTypeId)===key(f(rec(m.stage(phase),541n),4n))){fired=true;throw Error('intentional rollback witness');}}})).rejects.toThrow();expect(fired).toBe(true);const after=runtime.snapshot();expect(key(after.state.canonicalValue())).toBe(key(before.state.canonicalValue()));expect(after.outputs).toEqual([]);expect(after.trace).toEqual([]);expect(after.allocators).toEqual(before.allocators);expect(after.queue.map(scheduledEventValue).map(key)).toEqual(before.queue.map(scheduledEventValue).map(key));}
   for(const boundary of ['before-invariant-validation','after-invariant-validation','before-commit'] as const){const runtime=createAttentionRuntime(m,input,m.initialState(initial()));await expect(runtime.settleNextInstantForConformance({onBoundary:b=>{if(b===boundary)throw Error('commit rollback');}})).rejects.toThrow();expect(runtime.snapshot().state.entries()).toHaveLength(0);expect(runtime.snapshot().outputs).toHaveLength(0);expect(runtime.snapshot().allocators.nextRuntimeId).toBe(0n);}
  }
 },120000);
 it('independently rejects corruption of each trace field in both source branches',async()=>{
  for(const name of ['role-k1-channel-13','role-k1-channel-0']){const m=await compileAttentionModel(source(name)),input=await compileAttentionInputs(args().orderedInputs,initial(),seed(),m),runtime=createAttentionRuntime(m,input,m.initialState(initial()));await runtime.settleNextInstant();let state=new AuthoritativeState([]);for(const value of runtime.snapshot().trace){const t=rec(value,160n),event=restoreScheduledEvent(f(t,4n));
    const actualStage=Array.from({length:10},(_,i)=>i+1).find(i=>key(f(rec(m.stage(i),541n),4n))===key(event.eventTypeId))!,nextState=actualStage===3?runtime.snapshot().state:state,facts={stage:actualStage,event,state,nextState,outputs:items(f(t,13n),'list'),children:items(f(t,18n),'list').map(restoreScheduledEvent)};validateAttentionTrace(m,input.runIdentity.value,facts,value);
    for(let field=1n;field<=19n;field++)expect(()=>validateAttentionTrace(m,input.runIdentity.value,facts,replace(value,field,unsigned(999)))).toThrow();state=nextState;
   }}
 },60000);
 it('restores every successful model/scene prefix and rejects changed originals',async()=>{
  for(const model of freeze.models.filter(m=>m.work===9)){const s=source(model.name),h=await prepareAttentionModel(s);for(const scene of Object.keys({base:1,swap:1,tie:1,'instrument-a':1,'instrument-b':1,'instrument-c':1,'beneficiary-a':1})){const input=args(scene),r=await createAttentionRun(h,input);const restored0=await restoreAttentionRun(s,{initialState:initial(),orderedInputs:input.orderedInputs,save:r.save()});await r.settleNextInstant();await restored0.settleNextInstant();expect(restored0.save()).toEqual(r.save());const restored1=await restoreAttentionRun(s,{initialState:initial(),orderedInputs:input.orderedInputs,save:r.save()});expect(restored1.save()).toEqual(r.save());}}
  const r=await run('role-k0');await expect(restoreAttentionRun(source('role-k0'),{initialState:initial(),orderedInputs:args('swap').orderedInputs,save:r.save()})).rejects.toThrow();
 },240000);
});
