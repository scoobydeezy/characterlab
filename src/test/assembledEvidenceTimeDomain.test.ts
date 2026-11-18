import {beforeAll,it,expect} from 'vitest';
import {fixture,C} from './fixtures/assembledWorkMaintenance';
import {changeDefinition} from './fixtures/assembledCharacter';
import {canonicalEncode as enc,list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent,EventEmission,EventHandlerContext} from '../substrate/scheduler';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataText as txt,dataUnsigned as uint} from '../campaign2/canonicalData';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {LEGACY_TIME_LIMIT as OLD,EXTENDED_TIME_LIMIT as LONG,type TimeLimit} from '../assembled/timeDomain';
import {sid} from '../assembled/skill';
import {KNOWLEDGE_OWNER,PLAN_OWNER} from '../assembled/strategy';
import {PERFORMANCE,PERFORMANCE_OBS,outcomePath,withPerformanceState} from '../assembled/performance';
import {CAUSAL,CAUSAL_OBS,CAUSAL_QUERY,CAUSAL_SOURCE,CAUSAL_CONTEXT,causalSource,causalContext,causalJournal,diagnostic,causalPath,appendDiagnostic,createCausalExecution} from '../assembled/causalAttribution';
import {INTERFERENCE,INTERFERENCE_OBS,INTERFERENCE_QUERY,INTERFERENCE_SOURCE,INTERFERENCE_CONTEXT,interferenceSource,interferenceJournal,interferencePath,appendInterference} from '../assembled/interferenceExpectation';
import {WORK,WORK_SOURCE,workObservation,workKnowledgePath,workAccessPath,withWorkMaintenanceState,createWorkMaintenance} from '../assembled/workMaintenance';
import {appendExpectation,expectationPath} from '../assembled/performanceExpectation';
import {workspaceOutput} from '../assembled/configurationWorkspace';
import {GOAL_MEANING,compileGoalMeaning,goalBootstrap,goalValue,readGoalValue} from '../assembled/goalMeaning';

// Detached clock components, not native late-character coverage. Work fixture body10,
// two social tasks, unknown third task and governed stand-ins/actions; all three
// task deadlines explicitly5001. Board4000
// is the live workspace channel. Typed outcome records below probe owner joins only;
// they do not claim that a late character executed an outcome. Real diagnostic handlers
// consume those records. No authored psychological state enters a public scenario.
let m:Awaited<ReturnType<typeof compileCharacterModel>>,c:Awaited<ReturnType<typeof compileCharacterState>>,inputs:Awaited<ReturnType<typeof compileCharacterInputs>>,initial:AuthoritativeState;
beforeAll(async()=>{const b=fixture();for(const name of ['task-a','task-b','configurable-garden'])b.s=changeDefinition(b.s,'definition/'+name,6n,signed(5001));m=await compileCharacterModel(b.s);c=await compileCharacterState(m);initial=c.initialState(b.d.initialState);inputs=await compileCharacterInputs(m,c,b.d);},120000);
const task=()=>m.strategy![0].task,action=()=>m.strategy![0].plans[0].actionId;
const outcome=(at:bigint)=>list([text(PERFORMANCE_OBS),typedIdentifier(1164,u(1)),u(at),task(),u(0),action(),false,true]);
const diag=(at:bigint,ticket=at-1n,receipt=1n)=>list([text(CAUSAL_OBS),u(at),task(),u(ticket),u(receipt),true,true]);
const interferenceObs=(at:bigint,o:CanonicalValue=outcome(at-1n))=>list([text(INTERFERENCE_OBS),u(at),task(),u(at-1n),u(1),true,o]);
const owner=(limit:TimeLimit)=>withPerformanceState(c.stateModel,m.strategy!,true,undefined,undefined,true,true,limit);
function op(s:AuthoritativeState,path:StatePath,newValue:CanonicalValue):StatePatch['operations'][number]{const before=s.read(path);return {kind:'set',path,expected:before.presence?{presence:true,value:before.value!}:{presence:false},newValue};}
function put(sm:ReturnType<typeof owner>,s:AuthoritativeState,path:StatePath,value:CanonicalValue,writer=KNOWLEDGE_OWNER){return sm.applyPatch(s,{operations:[op(s,path,value)]},writer).state;}
const original=(sm:ReturnType<typeof owner>,at=3999n)=>{const o=outcome(at);return sm.applyPatch(initial,{operations:[op(initial,outcomePath(task()),list([text(PERFORMANCE),list([o])])),op(initial,expectationPath(task(),0n),appendExpectation(undefined,o,1,LONG))]},KNOWLEDGE_OWNER).state;};
it('clock162: causal/interference boundaries, exact original joins and restored owners',()=>{
 for(const at of [OLD,101n,4000n,LONG]){
  const sm=owner(LONG);let s=original(sm,at-1n);
  s=put(sm,s,causalPath(task()),appendDiagnostic(undefined,diag(at),task(),LONG));
  s=put(sm,s,interferencePath(task()),appendInterference(undefined,interferenceObs(at),task(),LONG));
  expect(causalJournal(s.read(causalPath(task())).value,task(),LONG)).toEqual([diag(at)]);
  expect(interferenceJournal(s.read(interferencePath(task())).value,task(),LONG)).toEqual([interferenceObs(at)]);
  expect(enc(sm.restoreState(enc(s.canonicalValue())).canonicalValue())).toEqual(enc(s.canonicalValue()));
  if(at===OLD)expect(enc(owner(OLD).restoreState(enc(s.canonicalValue())).canonicalValue())).toEqual(enc(s.canonicalValue()));else expect(()=>owner(OLD).restoreState(enc(s.canonicalValue()))).toThrow();
  const source=list([text(CAUSAL),task(),u(at),u(16),true,true,true]),ctx=list([text(CAUSAL_QUERY),task(),u(at),text('ProtectRoute')]);
  expect(causalSource(source,m.strategy!,LONG).ticket).toBe(at);expect(causalContext(ctx,m.strategy!,LONG).ticket).toBe(at);
  expect(interferenceSource(list([text(INTERFERENCE),task(),u(at),u(16),true,true]),m.strategy!,LONG).ticket).toBe(at);
  if(at>OLD)expect(()=>causalSource(source,m.strategy!)).toThrow();
 }
 const sm=owner(LONG),s=original(sm),d=appendDiagnostic(undefined,diag(4000n),task(),LONG),p=causalPath(task());
 expect(()=>put(sm,s,p,d,PLAN_OWNER)).toThrow();const next=put(sm,s,p,d);expect(()=>put(sm,next,p,d)).toThrow('append');
 expect(()=>sm.applyPatch(s,{operations:[op(s,p,d)]},KNOWLEDGE_OWNER,{writableRoots:[],targetPaths:[p]})).toThrow('scope');
 expect(()=>put(sm,s,interferencePath(task()),appendInterference(undefined,interferenceObs(4000n,list([...items(outcome(3999n),'list').slice(0,6),true,true])),task(),LONG))).toThrow('original support');
 expect(()=>put(sm,initial,interferencePath(task()),appendInterference(undefined,interferenceObs(4000n),task(),LONG))).toThrow('original support');
 for(const at of [0n,LONG+1n])expect(()=>diagnostic(diag(at,1n),task(),LONG)).toThrow();
 expect(()=>diagnostic(diag(4000n,4000n),task(),LONG)).toThrow();
 expect(()=>diagnostic(diag(4000n,3999n,17n),task(),LONG)).toThrow();
 expect(()=>causalJournal(list([text(CAUSAL),list(Array.from({length:17},(_,i)=>diag(4000n+BigInt(i))))]),task(),LONG)).toThrow('capacity');
 expect(()=>causalJournal(list([text(CAUSAL),list([diag(4000n),diag(4000n)])]),task(),LONG)).toThrow('order');
 expect(()=>owner(101n as TimeLimit)).toThrow('time domain');
});
let ordinal=10000n;
function event(at:bigint,phase:bigint,eventTypeId:ReturnType<typeof sid>,payload:CanonicalValue=list([])):ScheduledEvent{return {eventId:ordinal++,eventSequence:ordinal++,dueAt:simInstant(at),phase,eventTypeId,payload,dependencies:list([]),causalParentEventIds:[]};}
const context=(event:ScheduledEvent,state:AuthoritativeState):EventHandlerContext<AuthoritativeState>=>({event,state,instant:event.dueAt,allocateRuntimeId:()=>ordinal++});
type Handler={isLearning(e:ScheduledEvent):boolean;execute(c:EventHandlerContext<AuthoritativeState>):{nextState:AuthoritativeState;outputs:readonly CanonicalValue[];emittedEvents:readonly EventEmission[];traceFactory(xs:readonly ScheduledEvent[]):readonly CanonicalValue[]};prepare(es:readonly ScheduledEvent[],s:AuthoritativeState):{execute(c:EventHandlerContext<AuthoritativeState>):unknown;finish(s:AuthoritativeState):AuthoritativeState;traces():readonly CanonicalValue[]}};
function deliver(h:Handler,s:AuthoritativeState,sources:ScheduledEvent[]){
 const queue=[...sources],out:CanonicalValue[]=[],traces:CanonicalValue[]=[];
 while(queue.length){queue.sort((a,b)=>a.phase===b.phase?(a.eventSequence<b.eventSequence?-1:1):(a.phase<b.phase?-1:1));const e=queue.shift()!;
  if(h.isLearning(e)){const stage=h.prepare([e],s);stage.execute(context(e,s));s=stage.finish(s);expect(()=>stage.finish(s)).toThrow();traces.push(...stage.traces());}
  else{const result=h.execute(context(e,s)),xs=result.emittedEvents.map(x=>{const {additionalCausalParentEventIds,...spec}=x;return {...spec,eventId:ordinal++,eventSequence:ordinal++,causalParentEventIds:[e.eventId,...(additionalCausalParentEventIds??[])].sort((a,b)=>a<b?-1:1)};});
   if(xs.length)expect(()=>result.traceFactory([{...xs[0],phase:xs[0].phase+1n},...xs.slice(1)])).toThrow();
   traces.push(...result.traceFactory(xs));s=result.nextState;out.push(...result.outputs);queue.push(...xs);}
 }return {s,out,traces};
}
function causalArm(positive=true,visible=true,support=true,restore=false,queryAt=4001n){
 ordinal=10000n;const sm=owner(LONG),start=support?original(sm):initial;
 const sources=[event(4000n,10n,CAUSAL_SOURCE,list([text(CAUSAL),task(),u(3999),u(1),visible,positive,positive])),event(4000n,10n,INTERFERENCE_SOURCE,list([text(INTERFERENCE),task(),u(3999),u(1),visible,positive]))];
 const queries=[event(queryAt,30n,CAUSAL_CONTEXT,list([text(CAUSAL_QUERY),task(),u(3999),text('ProtectRoute')])),event(queryAt,30n,INTERFERENCE_CONTEXT,list([text(INTERFERENCE_QUERY),task(),u(0),u(1)]))];
 const h=createCausalExecution(C,m.strategy!,sm,[...sources,...queries],m.modelIdentity.value,inputs.runIdentity.value,true,false,LONG);
 h.begin(4000n);expect(()=>h.execute(context({...sources[0],eventSequence:0n},start))).toThrow('source');
 const learned=deliver(h,start,sources);if(queryAt!==4000n){h.prepareCommit();h.close();h.begin(queryAt);}
 const s=restore?sm.restoreState(enc(learned.s.canonicalValue())):learned.s;deliver(h,s,queries);
 const results=h.appraise(event(queryAt,50n,sid(1001,'event/task-appraisal')),s);expect(results).toHaveLength(2);const traces=[...learned.traces,...results.map(x=>x.trace())];h.prepareCommit();h.close();
 return {state:enc(s.canonicalValue()),reports:results.map(x=>x.report),traces};
}
it('clock162: late diagnostic perception and original support reach live prior appraisal exactly',()=>{
 const yes=causalArm(),no=causalArm(false);
 for(const a of [yes,no]){const past=items(a.reports[0],'list'),future=items(a.reports[1],'list');expect(items(past[8],'list')).toHaveLength(2);expect(items(future[7],'list')).toHaveLength(2);expect(items(past[10],'list')).toHaveLength(1);expect(uint(future[5])).toBe(1n);}
 expect(items(yes.reports[0],'list')[6]).toEqual(q(9,10));expect(items(no.reports[0],'list')[6]).toEqual(q(1,10));
 expect(items(yes.reports[1],'list')[6]).toEqual(q(1,1));expect(items(no.reports[1],'list')[6]).toEqual(q(0,1));
 expect(causalArm()).toEqual(yes);expect(causalArm(true,true,true,true)).toEqual(yes);
 expect(yes.traces.every(t=>txt(f(rec(t,160n),6n)).endsWith('+time-domain/0.1-candidate'))).toBe(true);
 const absent=causalArm(true,true,false);expect(txt(items(absent.reports[0],'list')[5])).toBe('Unknown');expect(items(absent.reports[1],'list')[6]).toEqual(list([]));
 const denied=causalArm(true,false),changed=causalArm(false,false);expect(denied.state).toEqual(changed.state);expect(denied.reports).toEqual(changed.reports);
 expect(()=>causalArm(true,true,true,false,4000n)).toThrow('same-instant');
 console.info('M162 causal PASS reports4000 -> live appraisal4001; exact support, denied/unknown, same-instant, repeat/restore and trace disclosure');
});
const board=(hidden=false,visible=true)=>list([text(WORK),visible,false,hidden,list([list([u(1),true,u(3)]),list([u(2),false,u(2)]),list([u(3),true,u(0)])])]);
const workOwner=(limit:TimeLimit)=>withWorkMaintenanceState(c.stateModel,C,m.workMaintenance!,c.tasks.length,limit);
function workArm(hidden=false,visible=true,restore=false){
 ordinal=20000n;const sm=workOwner(LONG),source=event(4000n,110n,WORK_SOURCE,board(hidden,visible)),h=createWorkMaintenance(C,m.workMaintenance!,c.tasks,sm,[source],m.modelIdentity.value,inputs.runIdentity.value,LONG);
 h.begin(4000n);const learned=deliver(h,initial,[source]);h.prepareCommit();h.close();h.begin(4001n);const s=restore?sm.restoreState(enc(learned.s.canonicalValue())):learned.s;
 for(const t of c.tasks){expect(t.activeFrom<=4001n&&4001n<t.deadline).toBe(true);expect(uint(f(rec(sm.read(s,t.path).value!,372n),1n))).toBe(1n);}
 const definition=c.definition('task-workspace'),base=workspaceOutput(typedIdentifier(1128,u(4001)),C,sid(1027,'definition/task-agenda'),definition,c.tasks,4001n,{status:t=>sm.read(s,c.tasks.find(x=>key(x.key)===key(t))!.path).value,prediction:()=>undefined}).output;
 const result=h.workspace(event(4001n,40n,sid(1001,'event/task-workspace')),s,base,definition);h.prepareCommit();h.close();
 expect(enc(sm.restoreState(enc(result.nextState.canonicalValue())).canonicalValue())).toEqual(enc(result.nextState.canonicalValue()));
 return {safe:learned.out,state:enc(result.nextState.canonicalValue()),report:result.report,trace:result.trace()};
}
it('clock162: observed board reaches live workspace and exact restored access cache',()=>{
 const a=workArm();expect(workArm(true)).toEqual(a);expect(workArm(false,true,true)).toEqual(a);expect(workArm()).toEqual(a);
 const report=items(a.report,'list');expect(items(report[4],'list')).toContainEqual(u(1));expect(items(report[4],'list')).not.toContainEqual(u(2));expect(items(f(rec(report[9],381n),4n),'list')).toContainEqual(expect.objectContaining({kind:'record'}));
 const denied=workArm(false,false);expect(items(items(denied.report,'list')[2],'list')).not.toContainEqual(list([u(1),u(3)]));
 for(const at of [OLD,101n,4000n,LONG]){
  const sm=workOwner(LONG),safe=workObservation(board(),at,typedIdentifier(1164,u(1)),m.workMaintenance!);
  let s=put(sm,initial,workKnowledgePath(C),safe);s=sm.applyPatch(s,{operations:[op(s,workAccessPath(C),list([text(WORK),u(at),list([u(1)])]))]},sid(1025,'authority/workspace')).state;
  expect(enc(sm.restoreState(enc(s.canonicalValue())).canonicalValue())).toEqual(enc(s.canonicalValue()));
  if(at===OLD)expect(enc(workOwner(OLD).restoreState(enc(s.canonicalValue())).canonicalValue())).toEqual(enc(s.canonicalValue()));else expect(()=>workOwner(OLD).restoreState(enc(s.canonicalValue()))).toThrow();
 }
 for(const at of [0n,LONG+1n])expect(()=>put(workOwner(LONG),initial,workKnowledgePath(C),workObservation(board(),at,typedIdentifier(1164,u(1)),m.workMaintenance!))).toThrow();
 console.info('M162 workspace PASS live deadline5001; source4000 -> selection4001; hidden truth/inaccessible cards, repeat/restore, exact cache');
});
it('clock162: maintenance activation preserves immutable lifecycle and independent expiry bound',()=>{
 const declaration=(at:bigint,expiry?:bigint)=>list([text(GOAL_MEANING),list([q(4,1),q(6,1)]),u(at),text('BothDirections'),...(expiry===undefined?[]:[u(expiry)])]);
 const legacy=compileGoalMeaning(declaration(100n),Q.of(100n));expect(compileGoalMeaning(declaration(100n),Q.of(100n),GOAL_MEANING,false,OLD)).toEqual(legacy);
 const d=compileGoalMeaning(declaration(4000n,5001n),Q.of(100n),GOAL_MEANING,true,LONG),events=goalBootstrap(d,10n,20n);
 expect(events.map(e=>e.dueAt)).toEqual([1n,5001n]);expect(d.activeFrom).toBe(4000n);
 const value=goalValue(C,{character:'holder',goal:'reserve-goal',signal:'reserve',desired:d.desired!,adoptedAt:1n,activeFrom:4000n,expiresAt:5001n,status:'Open',changedAt:1n});
 expect(readGoalValue(value,C,d).activeFrom).toBe(4000n);
 expect(()=>compileGoalMeaning(declaration(4000n,5001n),Q.of(100n),GOAL_MEANING,true)).toThrow();
 expect(compileGoalMeaning(declaration(LONG-1n,LONG),Q.of(100n),GOAL_MEANING,true,LONG).expiresAt).toBe(LONG);
 for(const [at,expiry]of [[0n,5001n],[LONG,LONG],[4000n,LONG+1n]])expect(()=>compileGoalMeaning(declaration(at,expiry),Q.of(100n),GOAL_MEANING,true,LONG)).toThrow();
});
