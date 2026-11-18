import {beforeAll,it,expect} from 'vitest';
import {fixture,C,items,key,enc,list,text,u,q,type CanonicalValue} from './fixtures/assembledMultiReceipts';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent,EventEmission} from '../substrate/scheduler';
import {ExactRational as Q} from '../substrate/exactMath';
import {cognitiveRecord as cr} from '../campaign2/cognitiveCodecs';
import {compileCharacterModel,MAINTENANCE_HORIZON_RULES,MAINTENANCE_HORIZON_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {sid} from '../assembled/skill';
import {LEGACY_TIME_LIMIT as OLD,EXTENDED_TIME_LIMIT as LONG,type TimeLimit} from '../assembled/timeDomain';
import {KNOWLEDGE_OWNER} from '../assembled/strategy';
import {PRIORITY,PRIORITY_ADOPTION,importancePath,importanceValue,priorityDisplay,withPriorityState} from '../assembled/priority';
import {HABIT,HABIT_OBS,HABIT_OWNER,REWARD_OWNER,habitPath,rewardPath,habitJournal,rewardValue,cueStrength,withHabitState} from '../assembled/habit';
import {CONTROL,CONTROL_SOURCE,GOAL_OWNER,WORKSPACE_OWNER,controlGoalPath,maintenancePath,controlValue,withControlState} from '../assembled/control';
import {createControlExecution} from '../assembled/controlExecution';
import {REAPPRAISAL,REAPPRAISAL_OBS,REAPPRAISAL_FRAME,REAPPRAISAL_SOURCE,FRAME_OWNER,reappraisalPath,framePath,reappraisalKnowledge,reappraisalFrame,compileReappraisal,createReappraisalExecution} from '../assembled/reappraisal';
import {FATIGUE,FATIGUE_SOURCE,FATIGUE_OBSERVATION,FATIGUE_OWNER,fatiguePath,fatigueJournal,fatigueCondition,createFatigueExecution} from '../assembled/fatigue';
import {RUMINATION,RUMINATION_SOURCE,RUMINATION_OBSERVATION,RUMINATION_OWNER,ruminationPath,ruminationJournal,ruminationCondition,createRuminationExecution,type RuminationSettings} from '../assembled/rumination';

// Detached affected-owner controls. No public late-model activation or late final-choice claim.
// Current fixture supplies governed tasks/actions, valid identities and body10; no learned start.
let model:Awaited<ReturnType<typeof compileCharacterModel>>,component:Awaited<ReturnType<typeof compileCharacterState>>,inputs:Awaited<ReturnType<typeof compileCharacterInputs>>,initial:AuthoritativeState;
let settings:RuminationSettings;
beforeAll(async()=>{const b=fixture('collective');model=await compileCharacterModel({...b.s,rulesVersion:MAINTENANCE_HORIZON_RULES,registrySchemaVersion:MAINTENANCE_HORIZON_REGISTRY});component=await compileCharacterState(model);initial=component.initialState(b.d.initialState);inputs=await compileCharacterInputs(model,component,b.d);settings={task:model.strategy![0].task,law:'EveryOpportunity'};},120000);
const occ=(n=1n)=>typedIdentifier(1164,u(n));
const task=()=>settings.task;
const target=()=>model.strategy![0].plans[0].actionId;
const fatigueObs=(at:bigint,n=1n)=>list([text(FATIGUE_OBSERVATION),occ(n),C,u(at),list([u(2)])]);
const ruminationObs=(at:bigint,n=1n)=>list([text(RUMINATION_OBSERVATION),occ(n),C,task(),u(at),list([u(1)])]);
const habitObs=(at:bigint,n=1n)=>list([text(HABIT_OBS),occ(n),u(at),list([true]),true,true]);
const appraisalObs=(at:bigint,n=1n)=>list([text(REAPPRAISAL_OBS),occ(n),C,u(at),u(1),list([true]),u(1)]);
function owner(limit:TimeLimit){return withControlState(withHabitState(withPriorityState(component.stateModel,model.strategy!.map(r=>r.task),undefined,undefined,true,limit),C,limit),C,true,true,settings,limit);}
function operation(s:AuthoritativeState,p:StatePath,value:CanonicalValue):StatePatch['operations'][number]{const prior=s.read(p);return {kind:'set',path:p,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:value};}
function put(sm:ReturnType<typeof owner>,s:AuthoritativeState,p:StatePath,v:CanonicalValue,writer:CanonicalValue){return sm.applyPatch(s,{operations:[operation(s,p,v)]},writer as ReturnType<typeof sid>).state;}
function populated(at:bigint,limit:TimeLimit){
 const sm=owner(limit);let s=initial;
 s=put(sm,s,importancePath(task()),list([text(PRIORITY_ADOPTION),q(1,2),occ(),u(at)]),GOAL_OWNER);
 s=put(sm,s,habitPath(C),list([text(HABIT),list([habitObs(at)])]),HABIT_OWNER);
 s=put(sm,s,rewardPath(C),list([text(HABIT),true,occ(),u(at)]),REWARD_OWNER);
 s=put(sm,s,controlGoalPath(C),list([text(CONTROL),u(1),u(at)]),GOAL_OWNER);
 s=put(sm,s,maintenancePath(C),list([text(CONTROL),true,u(at)]),WORKSPACE_OWNER);
 s=put(sm,s,reappraisalPath(C),list([appraisalObs(at)]),KNOWLEDGE_OWNER);
 s=put(sm,s,framePath(C),list([text(REAPPRAISAL_FRAME),u(at),typedIdentifier(1141,u(1)),list([occ()])]),FRAME_OWNER);
 s=put(sm,s,fatiguePath(C),list([text(FATIGUE),list([fatigueObs(at)])]),FATIGUE_OWNER);
 s=put(sm,s,ruminationPath(C),list([text(RUMINATION),list([ruminationObs(at)])]),RUMINATION_OWNER);
 return {sm,s};
}
it('clock159: all affected owners preserve exact late records, derived laws and restore',()=>{
 for(const at of [100n,101n,4000n,LONG]){
  const {sm,s}=populated(at,LONG);
  expect(importanceValue(sm.read(s,importancePath(task())).value!,true,LONG).I).toEqual(Q.of(1n,2n));
  expect(cueStrength(habitJournal(sm.read(s,habitPath(C)).value,LONG),true,1,LONG)).toEqual(Q.of(1n,2n));
  expect(rewardValue(sm.read(s,rewardPath(C)).value,LONG)?.at).toBe(at);
  expect(controlValue(sm.read(s,controlGoalPath(C)).value,true,LONG)).toMatchObject({active:true,at});
  expect(reappraisalKnowledge(sm.read(s,reappraisalPath(C)).value,C,false,false,false,false,LONG).means[0]).toEqual(Q.of(1n));
  expect(reappraisalFrame(sm.read(s,framePath(C)).value,LONG).at).toBe(at);
  expect(fatigueCondition(sm.read(s,fatiguePath(C)).value,C,'SevereThreshold',LONG).impaired).toBe(true);
  if(at<LONG)expect(ruminationCondition(sm.read(s,ruminationPath(C)).value,C,settings,at+1n,false,LONG).access).toBe(true);
  expect(enc(sm.restoreState(enc(s.canonicalValue())).canonicalValue())).toEqual(enc(s.canonicalValue()));
  if(at===OLD)expect(enc(owner(OLD).restoreState(enc(s.canonicalValue())).canonicalValue())).toEqual(enc(s.canonicalValue()));
  else expect(()=>owner(OLD).restoreState(enc(s.canonicalValue()))).toThrow();
 }
});
it('clock159: time widening preserves lifecycle, authority, history, support and count limits',()=>{
 const {sm,s}=populated(4000n,LONG);
 expect(()=>put(sm,s,importancePath(task()),list([text(PRIORITY_ADOPTION),q(1,1),occ(),u(4001)]),GOAL_OWNER)).toThrow('immutable');
 expect(()=>put(sm,s,maintenancePath(C),list([text(CONTROL),true,u(4000)]),WORKSPACE_OWNER)).toThrow('order');
 expect(()=>put(sm,s,controlGoalPath(C),list([text(CONTROL),u(1),u(4001)]),GOAL_OWNER)).toThrow('lifecycle');
 expect(()=>put(sm,initial,fatiguePath(C),list([text(FATIGUE),list([fatigueObs(4000n)])]),GOAL_OWNER)).toThrow();
 expect(()=>sm.applyPatch(s,{operations:[operation(s,maintenancePath(C),list([text(CONTROL),false,u(4001)])),operation(s,habitPath(C),list([text(HABIT),list([])]))]},WORKSPACE_OWNER)).toThrow('mixed');
 for(const [p,writer]of [[fatiguePath(C),FATIGUE_OWNER],[ruminationPath(C),RUMINATION_OWNER],[habitPath(C),HABIT_OWNER],[reappraisalPath(C),KNOWLEDGE_OWNER]] as const)expect(()=>put(sm,s,p,s.read(p).value!,writer)).toThrow('append');
 expect(()=>put(sm,s,framePath(C),list([text(REAPPRAISAL_FRAME),u(4001),typedIdentifier(1141,u(2)),list([occ(99n)])]),FRAME_OWNER)).toThrow('retained');
 expect(()=>put(sm,s,rewardPath(C),list([text(HABIT),false,occ(),u(3999)]),REWARD_OWNER)).toThrow('order');
 for(const times of [[4000n,4000n],[4000n,3999n]]){
  expect(()=>fatigueJournal(list([text(FATIGUE),list(times.map((t,i)=>fatigueObs(t,BigInt(i+1))))]),C,LONG)).toThrow('order');
  expect(()=>ruminationJournal(list([text(RUMINATION),list(times.map((t,i)=>ruminationObs(t,BigInt(i+1))))]),C,settings,LONG)).toThrow('order');
  expect(()=>habitJournal(list([text(HABIT),list(times.map((t,i)=>habitObs(t,BigInt(i+1))))]),LONG)).toThrow('order');
 }
 for(const limit of [OLD,LONG] as const){
  const times=Array.from({length:17},(_,i)=>BigInt(i+1));
  expect(()=>habitJournal(list([text(HABIT),list(times.map(t=>habitObs(t,t)))]),limit)).toThrow('capacity');
  expect(()=>fatigueJournal(list([text(FATIGUE),list(times.map(t=>fatigueObs(t,t)))]),C,limit)).toThrow('count');
  expect(()=>ruminationJournal(list([text(RUMINATION),list(times.map(t=>ruminationObs(t,t)))]),C,settings,limit)).toThrow('count');
  expect(()=>reappraisalKnowledge(list(times.map(t=>appraisalObs(t,t))),C,false,false,false,false,limit)).toThrow('capacity');
 }
 expect(()=>ruminationCondition(s.read(ruminationPath(C)).value,C,settings,4000n,false,LONG)).toThrow('prior');
 expect(()=>importanceValue(list([text(PRIORITY),q(1,1),occ(),u(4000)]),true,LONG)).toThrow(); // Historical adoption-at1 remains.
 for(const limit of [OLD,LONG] as const){const at=limit+1n;
  for(const check of [()=>populated(at,limit),()=>controlValue(list([text(CONTROL),u(1),u(at)]),true,limit),()=>habitJournal(list([text(HABIT),list([habitObs(at)])]),limit),()=>rewardValue(list([text(HABIT),true,occ(),u(at)]),limit),()=>fatigueJournal(list([text(FATIGUE),list([fatigueObs(at)])]),C,limit),()=>ruminationJournal(list([text(RUMINATION),list([ruminationObs(at)])]),C,settings,limit),()=>reappraisalKnowledge(list([appraisalObs(at)]),C,false,false,false,false,limit),()=>reappraisalFrame(list([text(REAPPRAISAL_FRAME),u(at),typedIdentifier(1141,u(1)),list([occ()])]),limit)])expect(check).toThrow();
 }
 const bad=999n as TimeLimit;
 for(const check of [()=>owner(bad),()=>controlValue(undefined,true,bad),()=>habitJournal(undefined,bad),()=>fatigueJournal(undefined,C,bad),()=>ruminationJournal(undefined,C,settings,bad),()=>reappraisalFrame(undefined,bad)])expect(check).toThrow('time domain');
 const p=list([text(PRIORITY_ADOPTION),list([list([task(),list([q(1,2)]),true,list([]),true,list([model.strategy![0].plans[0].instructionId])])])]);
 const domain={strategy:model.strategy!,tasks:component.tasks};
 expect(priorityDisplay(p,4000n,[task()],domain,LONG)).toHaveLength(1);
 expect(()=>priorityDisplay(p,4000n,[task()],domain)).toThrow('time');
});
let ordinal=10000n;
function event(at:bigint,phase:bigint,type:ReturnType<typeof sid>,payload:CanonicalValue=list([])):ScheduledEvent{return {eventId:ordinal++,eventSequence:ordinal++,dueAt:simInstant(at),phase,eventTypeId:type,payload,dependencies:list([]),causalParentEventIds:[]};}
const context=(e:ScheduledEvent,s:AuthoritativeState)=>({event:e,state:s,instant:e.dueAt,allocateRuntimeId:()=>ordinal++});
const children=(e:ScheduledEvent,xs:readonly EventEmission[])=>xs.map(x=>({...x,eventId:ordinal++,eventSequence:ordinal++,causalParentEventIds:[e.eventId]}));
type Handler=Pick<ReturnType<typeof createControlExecution>,'execute'|'prepare'|'isLearning'>;
function deliver(handler:Handler,s:AuthoritativeState,sources:ScheduledEvent[]){
 const queue=[...sources];let traces=0;
 while(queue.length){queue.sort((a,b)=>a.phase===b.phase?(a.eventSequence<b.eventSequence?-1:1):(a.phase<b.phase?-1:1));const e=queue.shift()!;
  if(handler.isLearning(e)){const learning=[e,...queue.splice(0)];expect(learning.every(handler.isLearning)).toBe(true);const stage=handler.prepare(learning,s);for(const x of learning)stage.execute(context(x,s));s=stage.finish(s);expect(()=>stage.finish(s)).toThrow();traces+=stage.traces().length;}
  else {const result=handler.execute(context(e,s)),xs=children(e,result.emittedEvents);if(xs.length)expect(()=>result.traceFactory([{...xs[0],causalParentEventIds:[]},...xs.slice(1)])).toThrow();traces+=result.traceFactory(xs).length;s=result.nextState;queue.push(...xs);}
 }
 return {s,traces};
}
function lateArm(visible:boolean,physical=2){
 ordinal=10000n;const sm=owner(LONG),controlSource=event(4000n,10n,CONTROL_SOURCE,list([text(CONTROL),u(1),true,true,false,true])),later=event(4001n,10n,CONTROL_SOURCE,list([text(CONTROL),u(0),true,true,false,true]));
 const fatigueSource=event(4000n,30n,FATIGUE_SOURCE,list([text(FATIGUE),u(physical),u(3),visible,true]));
 const ruminationSource=event(4000n,10n,RUMINATION_SOURCE,list([text(RUMINATION),u(1),true,true,false,true,true]));
 const rumination=createRuminationExecution(C,settings,sm,[ruminationSource],model.modelIdentity.value,inputs.runIdentity.value,LONG);
 const control=createControlExecution(C,target(),sm,[controlSource,later],model.modelIdentity.value,inputs.runIdentity.value,32,'SevereThreshold',{settings,instruction:rumination.instruction},LONG);
 const joined=rumination.extend(createFatigueExecution(C,sm,[fatigueSource],model.modelIdentity.value,inputs.runIdentity.value,LONG).extend(control));
 joined.begin(4000n);expect(()=>joined.execute(context({...controlSource,payload:list([])},initial))).toThrow();
 let {s,traces}=deliver(joined,initial,[controlSource,ruminationSource,fatigueSource]);joined.prepareCommit();joined.close();
 const retained=enc(s.canonicalValue());s=sm.restoreState(retained);
 expect(controlValue(s.read(controlGoalPath(C)).value,true,LONG).active).toBe(true);
 expect(fatigueJournal(s.read(fatiguePath(C)).value,C,LONG)).toHaveLength(visible?1:0);
 expect(ruminationJournal(s.read(ruminationPath(C)).value,C,settings,LONG)).toHaveLength(1);
 joined.begin(4001n);s=deliver(joined,s,[later]).s;
 const workspace=cr(381,[typedIdentifier(1128,u(1)),C,sid(1027,'definition/task-workspace'),list([]),cr(380,[u(1)])]);
 const result=joined.workspace(event(4001n,40n,sid(1001,'event/deliberation-opportunity')),s,workspace,6,[]);
 result.trace([]);joined.prepareCommit();joined.close();const view=items(result.report,'list');
 expect(view[2]).toBe(true);expect(view[3]).toBe(true); // Live commitment and maintained control in both arms.
 expect(items(view[12],'list')[8]).toBe(true); // Same prior concern consumes a shared slot.
 expect(enc(sm.restoreState(enc(result.nextState.canonicalValue())).canonicalValue())).toEqual(enc(result.nextState.canonicalValue()));
 return {retained,inhibited:view[9],fatigue:items(view[11],'list'),traces};
}
it('clock159: actual joined observation/learning4000 affects live shared control4001',()=>{
 const seen=lateArm(true),denied=lateArm(false),hidden=lateArm(true,0);
 expect(seen.inhibited).toBe(false);expect(denied.inhibited).toBe(true);
 expect(seen.fatigue[1]).toBe(true);expect(denied.fatigue[1]).toBe(false);
 expect(hidden.retained).toEqual(seen.retained);expect(hidden.inhibited).toBe(seen.inhibited);
 expect(seen.traces).toBeGreaterThan(3);
 console.info('M159 late component PASS: authenticated joined140 control/fatigue/concern; live next-instant inhibition differs on permitted evidence; hidden truth equal; exact owner restore');
});
it('clock159: actual late reappraisal observation preserves source and frame support',()=>{
 const sm=owner(LONG),config=compileReappraisal(list([text(REAPPRAISAL),task(),target(),text('BenefitRelative')]),model.strategy!);
 const source=event(4000n,30n,REAPPRAISAL_SOURCE,list([text(REAPPRAISAL),u(1),true,true,true,u(1),true,true,true]));
 const handler=createReappraisalExecution(config,C,sm,[source],model.modelIdentity.value,inputs.runIdentity.value,undefined,LONG);
 handler.begin(4000n);const {s}=deliver(handler,initial,[source]);handler.prepareCommit();handler.close();
 const known=reappraisalKnowledge(s.read(reappraisalPath(C)).value,C,false,false,false,false,LONG);expect(known.at).toBe(4000n);expect(known.means[0]).toEqual(Q.of(1n));expect(known.sources).toHaveLength(1);
 const installed=put(sm,s,framePath(C),list([text(REAPPRAISAL_FRAME),u(4001),typedIdentifier(1141,u(1)),list(known.sources)]),FRAME_OWNER);
 expect(enc(sm.restoreState(enc(installed.canonicalValue())).canonicalValue())).toEqual(enc(installed.canonicalValue()));
 // Frame write is a detached authority control; no claim of an actual chosen reappraisal operation here.
});
