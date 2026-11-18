import {beforeAll,it,expect} from 'vitest';
import {fixture,C,items,key,enc,list,text,u,q,signed,type CanonicalValue} from './fixtures/assembledMultiReceipts';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent,EventEmission} from '../substrate/scheduler';
import {ExactRational as Q} from '../substrate/exactMath';
import {compileCharacterModel,MAINTENANCE_HORIZON_RULES,MAINTENANCE_HORIZON_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {sid} from '../assembled/skill';
import {LEGACY_TIME_LIMIT as OLD,EXTENDED_TIME_LIMIT as LONG,assertTimeLimit,timeDomainVersion,type TimeLimit} from '../assembled/timeDomain';
import {STRATEGY,STRATEGY_OBS,DISPLAY,PLAN_OWNER,KNOWLEDGE_OWNER,planPath,knowledgePath,planValue,display,journal,withStrategyState} from '../assembled/strategy';
import {HORIZON,HORIZON_DISPLAY,forecastPath,forecastValue,horizonDisplay,withHorizonState} from '../assembled/horizon';
import {PERFORMANCE,PERFORMANCE_OBS,outcomePath,visitPath,visitValue,outcomeJournal,withPerformanceState} from '../assembled/performance';
import {expectationPath,expectationValue,appendExpectation} from '../assembled/performanceExpectation';
import {VALUES,VALUES_CONTEXT,VALUES_OWNER,valuesPath,valuesState,appendValue,createValuesExecution} from '../assembled/values';
import {createStrategyExecution} from '../assembled/strategyExecution';
import {createHorizonExecution} from '../assembled/horizonExecution';
import {createPerformanceExecution} from '../assembled/performanceExecution';

// Detached affected-owner controls, not public extended-model admission or a late native run.
// Current fixture supplies real governed tasks/actions, identities and valid initial body10.
let m:Awaited<ReturnType<typeof compileCharacterModel>>,component:Awaited<ReturnType<typeof compileCharacterState>>,inputs:Awaited<ReturnType<typeof compileCharacterInputs>>,initial:AuthoritativeState;
beforeAll(async()=>{const b=fixture('collective');m=await compileCharacterModel({...b.s,rulesVersion:MAINTENANCE_HORIZON_RULES,registrySchemaVersion:MAINTENANCE_HORIZON_REGISTRY});component=await compileCharacterState(m);initial=component.initialState(b.d.initialState);inputs=await compileCharacterInputs(m,component,b.d);},120000);
const occurrence=(n:bigint)=>typedIdentifier(1164,u(n));
const task=()=>m.values!.task;
const action=()=>m.strategy!.find(r=>key(r.task)===key(task()))!.plans[0].actionId;
const performance=(at:bigint,n=1n,success=true)=>list([text(PERFORMANCE_OBS),occurrence(n),u(at),task(),u(0),action(),success,true]);
const displayAt=(at:bigint)=>list([text(STRATEGY),list([list([task(),u(0),u(1),true,u(at),u(at),true])])]);
const strategyObservation=(at:bigint)=>list([text(STRATEGY_OBS),occurrence(1n),u(at),task(),u(0),u(1),true,u(at),u(at)]);
const forecast=(at:bigint)=>list([text(HORIZON),u(at),true,occurrence(1n),u(at)]);
function owner(limit:TimeLimit){return withPerformanceState(withHorizonState(withStrategyState(component.stateModel,C,m.strategy!,limit),m.strategy!.map(r=>r.task),limit),m.strategy!,true,C,m.values,false,false,limit);}
function operation(s:AuthoritativeState,path:StatePath,value:CanonicalValue):StatePatch['operations'][number]{const before=s.read(path);return {kind:'set',path,expected:before.presence?{presence:true,value:before.value!}:{presence:false},newValue:value};}
function patch(s:AuthoritativeState,path:StatePath,value:CanonicalValue):StatePatch{return {operations:[operation(s,path,value)]};}
function learned(at:bigint,limit:TimeLimit){const sm=owner(limit),o=performance(at),belief=appendExpectation(undefined,o,1,limit);
 let s=sm.applyPatch(initial,{operations:[operation(initial,outcomePath(task()),list([text(PERFORMANCE),list([o])])),operation(initial,expectationPath(task(),0n),belief)]},KNOWLEDGE_OWNER).state;
 s=sm.applyPatch(s,patch(s,valuesPath(C),appendValue(undefined,list([o,true]),m.values!,limit)),VALUES_OWNER).state;
 return {sm,s,o,belief};
}
it('domain158: explicit domains preserve boundaries, laws, provenance and owner restore',()=>{
 for(const at of [100n,101n,4000n,LONG]){
  const plan=list([text(STRATEGY),u(0),u(at)]),visit=list([text(PERFORMANCE),u(0),u(at)]),obs=strategyObservation(at);
  expect(planValue(plan,LONG)).toBe(0);expect(visitValue(visit,LONG).started).toBe(at);
  expect(display(displayAt(at),at,m.strategy!,LONG)).toHaveLength(1);
  expect(journal(list([text(STRATEGY),list([obs])]),m.strategy!,LONG)).toEqual([obs]);
  const {sm,s,o,belief}=learned(at,LONG);let next=sm.applyPatch(s,patch(s,planPath(task()),plan),PLAN_OWNER).state;
  next=sm.applyPatch(next,patch(next,visitPath(task()),visit),PLAN_OWNER).state;
  next=sm.applyPatch(next,patch(next,forecastPath(task()),forecast(at)),KNOWLEDGE_OWNER).state;
  next=sm.applyPatch(next,patch(next,knowledgePath(C),list([text(STRATEGY),list([obs])])),KNOWLEDGE_OWNER).state;
  expect(forecastValue(sm.read(next,forecastPath(task())).value!,LONG).observedAt).toBe(at);
  expect(outcomeJournal(sm.read(next,outcomePath(task())).value,task(),m.strategy!,true,LONG)).toEqual([o]);
  expect(expectationValue(belief,LONG).mean).toEqual(Q.of(1n));
  expect(valuesState(sm.read(next,valuesPath(C)).value,m.values!,LONG).preference).toEqual(Q.of(1n,2n));
  expect(enc(sm.restoreState(enc(next.canonicalValue())).canonicalValue())).toEqual(enc(next.canonicalValue()));
  if(at===OLD){expect(enc(owner(OLD).restoreState(enc(next.canonicalValue())).canonicalValue())).toEqual(enc(next.canonicalValue()));expect(planValue(plan)).toBe(planValue(plan,OLD));}
  else {expect(()=>owner(OLD).restoreState(enc(next.canonicalValue()))).toThrow();expect(()=>appendExpectation(undefined,o,1)).toThrow();expect(()=>display(displayAt(at),at,m.strategy!)).toThrow();}
 }
 expect(timeDomainVersion('legacy',OLD)).toBe('legacy');expect(timeDomainVersion('legacy',LONG)).toBe('legacy+time-domain/0.1-candidate');
});
it('domain158: limits do not weaken capacity, order, folds, support or mutation authority',()=>{
 const {sm,s,o,belief}=learned(4000n,LONG),p=forecastPath(task()),v=forecast(4000n);
 expect(()=>sm.applyPatch(s,patch(s,p,v),PLAN_OWNER)).toThrow();
 expect(()=>sm.applyPatch(s,{operations:[operation(s,p,v),operation(s,planPath(task()),list([text(STRATEGY),u(0),u(4000)]))]},KNOWLEDGE_OWNER)).toThrow('mixed');
 const next=sm.applyPatch(s,patch(s,p,v),KNOWLEDGE_OWNER).state;
 for(const at of [4000n,3999n])expect(()=>sm.applyPatch(next,patch(next,p,forecast(at)),KNOWLEDGE_OWNER)).toThrow('order');
 for(const rows of [[o,o],[o,performance(3999n,2n)] ,Array.from({length:9},(_,i)=>performance(4000n+BigInt(i),BigInt(i+1)))]){
  expect(()=>outcomeJournal(list([text(PERFORMANCE),list(rows)]),task(),m.strategy!,true,LONG)).toThrow();
 }
 expect(()=>appendExpectation(belief,o,1,LONG)).toThrow();
 const b=items(belief,'list');expect(()=>expectationValue(list([b[0],q(0,1),b[2]]),LONG)).toThrow('fold');
 const vp=s.read(valuesPath(C)).value!,vs=items(vp,'list');expect(()=>valuesState(list([vs[0],vs[1],q(0,1)]),m.values!,LONG)).toThrow('fold');
 expect(()=>appendValue(vp,list([o,false]),m.values!,LONG)).toThrow('conflict');
 expect(()=>appendValue(vp,list([performance(3999n,2n),true]),m.values!,LONG)).toThrow('order');
 expect(()=>sm.applyPatch(s,patch(s,valuesPath(C),vp),VALUES_OWNER)).toThrow('append');
 const bad=new AuthoritativeState(s.entries().filter(e=>!(e.path.rootStateTypeId===1000n&&e.path.fieldId===3n)));
 expect(()=>sm.restoreState(enc(bad.canonicalValue()))).toThrow('support mismatch');
 for(const check of [()=>planValue(list([text(STRATEGY),u(0),u(LONG+1n)]),LONG),()=>visitValue(list([text(PERFORMANCE),u(0),u(LONG+1n)]),LONG),()=>forecastValue(forecast(LONG+1n),LONG),()=>appendExpectation(undefined,performance(LONG+1n),1,LONG),()=>appendValue(undefined,list([performance(LONG+1n),true]),m.values!,LONG)])expect(check).toThrow();
 const forged=999n as TimeLimit;for(const check of [()=>assertTimeLimit(forged),()=>owner(forged),()=>planValue(undefined,forged),()=>visitValue(undefined,forged),()=>expectationValue(undefined,forged),()=>valuesState(undefined,m.values!,forged)])expect(check).toThrow('time domain');
 // Time widening must not widen receipt identifiers, action routes or observation caps.
 const row=items(items(displayAt(4000n),'list')[1],'list')[0],r=items(row,'list');
 expect(()=>display(list([text(STRATEGY),list([list([...r.slice(0,2),u(17),...r.slice(3)])])]),4000n,m.strategy!,LONG)).toThrow();
});
let ordinal=10000n;
function event(at:bigint,phase:bigint,type:ReturnType<typeof sid>,payload:CanonicalValue=list([])):ScheduledEvent{return {eventId:ordinal++,eventSequence:ordinal++,dueAt:simInstant(at),phase,eventTypeId:type,payload,dependencies:list([]),causalParentEventIds:[]};}
const allocate=(parent:ScheduledEvent,emissions:readonly EventEmission[])=>emissions.map(e=>({...e,eventId:ordinal++,eventSequence:ordinal++,causalParentEventIds:[parent.eventId]}));
const context=(e:ScheduledEvent,state:AuthoritativeState)=>({event:e,state,instant:e.dueAt,allocateRuntimeId:()=>ordinal++});
it('domain158: actual late handlers bind children, publish knowledge and consume prior learning',()=>{
 const sm=owner(LONG),source=event(4000n,30n,DISPLAY,displayAt(4000n)),hsource=event(4000n,10n,HORIZON_DISPLAY,list([text(HORIZON),list([list([task(),list([u(5000),true]),true])])]));
 const planner=createStrategyExecution(C,m.strategy!,sm,[source],m.modelIdentity.value,inputs.runIdentity.value,undefined,LONG);
 const horizon=createHorizonExecution(C,m.strategy!.map(r=>r.task),sm,[hsource],m.modelIdentity.value,inputs.runIdentity.value,LONG);
 let state=initial;
 for(const [handler,original] of [[planner,source],[horizon,hsource]] as const){
  handler.begin(4000n);expect(()=>handler.execute(context({...original,payload:list([])},state))).toThrow('unbound');
  let e=original;
  for(let stage=0;stage<3;stage++){
   const output=handler.execute(context(e,state)),children=allocate(e,output.emittedEvents);
   expect(children).toHaveLength(1);expect(()=>output.traceFactory([{...children[0],causalParentEventIds:[]}])).toThrow('mismatch');
   expect(output.traceFactory(children)).toHaveLength(1);expect(()=>output.traceFactory(children)).toThrow('lifecycle');e=children[0];
  }
  expect(()=>handler.prepareCommit()).toThrow('unfinished');
  const stage=handler.prepare([e],state);stage.execute(context(e,state));state=stage.finish(state);expect(stage.traces()).toHaveLength(1);
  expect(()=>stage.finish(state)).toThrow('finish');handler.prepareCommit();handler.close();
 }
 const acquired=journal(state.read(knowledgePath(C)).value,m.strategy!,LONG);expect(acquired).toHaveLength(1);expect(items(acquired[0],'list').slice(2)).toEqual(items(strategyObservation(4000n),'list').slice(2));
 expect(forecastValue(sm.read(state,forecastPath(task())).value!,LONG)).toMatchObject({openingAt:5000n,observedAt:4000n});
 horizon.begin(4001n);expect(horizon.evaluate(event(4001n,60n,sid(1001,'event/task-motive')),state,task(),Q.of(1n)).value).toEqual(Q.of(1n,4n));horizon.prepareCommit();horizon.close();
 const retained=learned(4000n,LONG);
 const monitor=createPerformanceExecution(C,m.strategy!,sm,[],m.modelIdentity.value,inputs.runIdentity.value,m.actionBody!,true,undefined,LONG);
 monitor.begin(4001n);const decision=event(4001n,40n,sid(1001,'event/deliberation-opportunity'));
 expect(monitor.evaluate(decision,retained.s,task(),2,{selected:0,availability:[{usable:true},{usable:true}]}).selected).toBe(0);
 const planned=monitor.planned(event(4001n,90n,sid(1001,'event/assembled-strategy-plan')),retained.s,[list([task(),u(0)])]);
 expect(visitValue(sm.read(planned.state,visitPath(task())).value,LONG)).toEqual({route:0,started:4001n});monitor.prepareCommit();monitor.close();
 const setting=event(4001n,30n,VALUES_CONTEXT,list([text(VALUES),true,signed(1)])),values=createValuesExecution(C,m.values!,sm,[setting],m.modelIdentity.value,inputs.runIdentity.value,LONG);
 values.begin(4001n);values.context(setting);const appraisal=values.appraise(event(4001n,50n,sid(1001,'event/task-appraisal')),planned.state);
 expect(items(appraisal.report,'list')[8]).toEqual(q(1,2));expect(appraisal.support).toEqual([list([retained.o,true])]);expect(appraisal.trace()).toBeDefined();values.prepareCommit();values.close();
 expect(enc(sm.restoreState(enc(planned.state.canonicalValue())).canonicalValue())).toEqual(enc(planned.state.canonicalValue()));
 console.info('M158 component PASS: actual bound strategy/forecast learning at4000, performance visit and prior value appraisal4001; no public late-model claim');
});
