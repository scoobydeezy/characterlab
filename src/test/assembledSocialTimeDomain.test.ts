import {beforeAll,it,expect} from 'vitest';
import {relationshipSource,relationshipData} from './fixtures/assembledRelationship';
import {C} from './fixtures/campaign2Cognitive';
import {outputs,through} from './fixtures/assembledComparison';
import {canonicalEncode as enc,list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent,EventEmission,EventHandlerContext} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataText as txt} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {LEGACY_TIME_LIMIT as OLD,EXTENDED_TIME_LIMIT as LONG,type TimeLimit} from '../assembled/timeDomain';
import {sid} from '../assembled/skill';
import {SOCIAL,SOCIAL_SOURCE,PERSON_OWNER,personPath,personHistory,personMean,withSocialState} from '../assembled/social';
import {createSocialExecution} from '../assembled/socialExecution';
import {REL,REL_SOURCE,REL_OWNER,relationshipPath,relationshipHistory,relationshipFold,withRelationshipState} from '../assembled/relationship';
import {createRelationshipExecution} from '../assembled/relationshipExecution';
import {COMM,COMM_SOURCE,PRIVATE,LEARNED_DISCLOSURE,knowledgePath,history,communicationClaim,KNOWLEDGE_OWNER as COMM_OWNER,withCommunicationState,compileCommunication} from '../assembled/communication';
import {createCommunicationExecution} from '../assembled/communicationExecution';
import {W_SOURCE,WPROBE,WITNESS,witnessPath,validateWitness,createCommitmentWitness} from '../assembled/commitmentWitness';
import {PRIORITY_ADOPTION,importancePath,withPriorityState} from '../assembled/priority';
import {GOAL_OWNER} from '../assembled/control';
import {createEmbarrassment} from '../assembled/embarrassment';
import {PERFORMANCE,PERFORMANCE_OBS,outcomePath,withPerformanceState} from '../assembled/performance';
import {EXPECTATION_TOPIC,expectationPath,appendExpectation} from '../assembled/performanceExpectation';
import {KNOWLEDGE_OWNER} from '../assembled/strategy';
import {arbitrationOutput} from '../assembled/arbitration';
import {createAssembledRandomSession} from '../assembled/random';
import {intentOutput,expressionOutput} from '../assembled/choice';

// Detached component clock tests. The unchanged relationship fixture supplies body,
// governed actor/tasks/actions and perceived stand-ins; no autonomous peer or learned S0.
// Late reports below enter production handlers. Owner-only probes test representation,
// not native late-character acceptance or a new choice-probability claim.
let model:Awaited<ReturnType<typeof compileCharacterModel>>,component:Awaited<ReturnType<typeof compileCharacterState>>,inputs:Awaited<ReturnType<typeof compileCharacterInputs>>,initial:AuthoritativeState,raw:CanonicalValue,lateExpression:CanonicalValue;
beforeAll(async()=>{
 const s=relationshipSource(),d=relationshipData();model=await compileCharacterModel(s);component=await compileCharacterState(model);initial=component.initialState(d.initialState);inputs=await compileCharacterInputs(model,component,d);
 const run=await createCharacterRun(await prepareCharacterModel(s),d);await through(run,3n);
 const t=outputs(run.snapshot().trace,160n).find(v=>key(f(v,5n))===key(sid(1036,'seam/assembled-relationship'))&&key(f(rec(f(v,4n),130n),3n))===key(u(80)))!;
 expect(t).toBeDefined();raw=items(f(t,12n),'list')[0];rec(raw,403n);
 const old=outputs(run.snapshot().outputs,409n)[0],reasons=f(old,3n),occ=f(old,1n),random=createAssembledRandomSession(d.runSeed,undefined,model.taskLimit,model.valueReceiving,model.standingRounding);random.begin(4001n);
 try{const resolution=await arbitrationOutput(occ,4001n,reasons,component.definition('task-arbitration'),random.forResolution(occ,reasons),model.configurationEnabled?3:2);lateExpression=expressionOutput(typedIdentifier(1137,u(5000)),intentOutput(typedIdentifier(1136,u(5000)),resolution));random.prepareCommit();random.commit();}finally{random.close();}
},120000);
const target=()=>model.social!.target,task=()=>component.tasks[0].key,recipients=()=>model.communication!.recipients;
const sp=()=>personPath(C,target()),rp=()=>relationshipPath(C,target());
const occurrence=(ns:number,n=1n)=>typedIdentifier(ns,u(n));
function owner(limit:TimeLimit,evaluations=false){
 return withCommunicationState(withRelationshipState(withSocialState(withPerformanceState(withPriorityState(component.stateModel,component.tasks.map(t=>t.key),undefined,undefined,true,limit),model.strategy!,true,undefined,undefined,false,false,limit),C,target(),[target()],evaluations,evaluations,false,[],limit),C,target(),[target()],false,limit),[C,...recipients()],undefined,false,[task()],limit);
}
function op(s:AuthoritativeState,path:StatePath,newValue:CanonicalValue):StatePatch['operations'][number]{const prior=s.read(path);return {kind:'set',path,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue};}
function put(sm:ReturnType<typeof owner>,s:AuthoritativeState,path:StatePath,v:CanonicalValue,writer:ReturnType<typeof sid>){return sm.applyPatch(s,{operations:[op(s,path,v)]},writer).state;}
const socialObs=(at:bigint,n=1n)=>list([occurrence(1115,n),C,target(),signed(at),u(1),u(n),list([true]),list([true])]);
const relationObs=(at:bigint,n=1n)=>list([occurrence(1115,n),C,target(),signed(at),true,true,u(1)]);
const commObs=(at:bigint,n=1n)=>list([occurrence(1168,n),recipients()[0],signed(at),list([true])]);
const witnessObs=(at:bigint)=>list([occurrence(1168),recipients()[0],signed(at),task(),list([u(1),u(1),u(0)])]);
function populated(at:bigint,limit:TimeLimit){
 const sm=owner(limit);let s=initial;
 for(const [p,v,w]of [[sp(),list([text(SOCIAL),list([socialObs(at)])]),PERSON_OWNER],[rp(),list([text(REL),list([relationObs(at)])]),REL_OWNER],[knowledgePath(recipients()[0]),list([commObs(at)]),COMM_OWNER],[witnessPath(recipients()[0],task()),witnessObs(at),COMM_OWNER]] as const)s=put(sm,s,p,v,w);
 return {sm,s};
}
it('clock161: social, relationship, communication and witness owners retain exact late boundaries',()=>{
 for(const at of [OLD,101n,4000n,LONG]){
  const {sm,s}=populated(at,LONG);expect(personMean(sm.read(s,sp()).value)).toEqual(readQ(q(1,1)));expect(relationshipFold(sm.read(s,rp()).value).count).toBe(1n);
  expect(communicationClaim(sm.read(s,knowledgePath(recipients()[0])).value)).toEqual(list([true]));validateWitness(sm.read(s,witnessPath(recipients()[0],task())).value!,witnessPath(recipients()[0],task()),LONG);
  expect(enc(sm.restoreState(enc(s.canonicalValue())).canonicalValue())).toEqual(enc(s.canonicalValue()));
  if(at===OLD)expect(enc(populated(at,OLD).s.canonicalValue())).toEqual(enc(s.canonicalValue()));else expect(()=>owner(OLD).restoreState(enc(s.canonicalValue()))).toThrow();
 }
});
it('clock161: time widening preserves holder, source, history, capacity and authority guards',()=>{
 const {sm,s}=populated(4000n,LONG);
 for(const [p,w]of [[sp(),PERSON_OWNER],[rp(),REL_OWNER],[knowledgePath(recipients()[0]),COMM_OWNER],[witnessPath(recipients()[0],task()),COMM_OWNER]] as const){
  expect(()=>put(sm,initial,p,s.read(p).value!,GOAL_OWNER)).toThrow();
  expect(()=>put(sm,s,p,s.read(p).value!,w)).toThrow('rewrite');
  expect(()=>sm.applyPatch(initial,{operations:[op(initial,p,s.read(p).value!)]},w,{writableRoots:[],targetPaths:[p]})).toThrow('scope');
  expect(()=>sm.read(s,{...p,selectors:[{kind:'mapKey',key:list([])}]})).toThrow('foreign');
 }
 for(const at of [0n,LONG+1n]){
  for(const [p,v,w]of [[sp(),list([text(SOCIAL),list([socialObs(at)])]),PERSON_OWNER],[rp(),list([text(REL),list([relationObs(at)])]),REL_OWNER],[knowledgePath(recipients()[0]),list([commObs(at)]),COMM_OWNER],[witnessPath(recipients()[0],task()),witnessObs(at),COMM_OWNER]] as const)expect(()=>put(sm,initial,p,v,w)).toThrow();
 }
 const duplicate=list([text(SOCIAL),list([socialObs(4000n),list([...items(socialObs(4001n,2n),'list').slice(0,5),u(1),list([false]),list([true])])])]);expect(()=>put(sm,initial,sp(),duplicate,PERSON_OWNER)).toThrow('grouping');
 const witnessing=[...items(relationObs(4000n),'list')];witnessing[5]=false;expect(()=>put(sm,initial,rp(),list([text(REL),list([list(witnessing)])]),REL_OWNER)).toThrow('participant');
 expect(()=>put(sm,initial,sp(),list([text(SOCIAL),list(Array.from({length:9},(_,i)=>socialObs(4000n+BigInt(i),BigInt(i+1))))]),PERSON_OWNER)).toThrow('capacity');
 expect(()=>put(sm,initial,rp(),list([text(REL),list(Array.from({length:13},(_,i)=>relationObs(4000n+BigInt(i),BigInt(i+1))))]),REL_OWNER)).toThrow('capacity');
 expect(()=>put(sm,initial,knowledgePath(recipients()[0]),list(Array.from({length:17},(_,i)=>commObs(4000n+BigInt(i),BigInt(i+1)))),COMM_OWNER)).toThrow('capacity');
 const wrong=[...items(witnessObs(4000n),'list')];wrong[1]=C;expect(()=>validateWitness(list(wrong),witnessPath(recipients()[0],task()),LONG)).toThrow('target');
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
 }
 return {s,out,traces};
}
function socialArm(claim:boolean,truth=true,access=true){
 ordinal=10000n;const sm=owner(LONG),source=event(4000n,110n,SOCIAL_SOURCE,list([text(SOCIAL),truth,u(1),u(claim?3:4),u(1),access,true]));
 const h=createSocialExecution(C,model.social!,sm,[source],model.modelIdentity.value,inputs.runIdentity.value,undefined,undefined,false,undefined,undefined,false,false,false,LONG);
 h.begin(4000n);const learned=deliver(h,initial,[source]);h.prepareCommit();h.close();h.begin(4001n);
 const e=event(4001n,50n,sid(1001,'event/task-appraisal')),a=h.appraise(e,learned.s),b=h.appraise(e,sm.restoreState(enc(learned.s.canonicalValue())));expect(a).toBeDefined();expect(a.report).toEqual(b.report);expect(a.trace([])).toEqual(b.trace([]));h.prepareCommit();h.close();
 return {...learned,a,mean:personMean(learned.s.read(sp()).value)};
}
it('clock161: real social perception4000 changes live appraisal4001 with hidden-truth and denial controls',()=>{
 const positive=socialArm(true),negative=socialArm(false),hidden=socialArm(true,false),denied=socialArm(true,true,false);
 for(const arm of [positive,negative])expect(arm.a.likelihoods.get(key(task()))).toBeDefined();
 expect(positive.a.likelihoods.get(key(task()))).not.toEqual(negative.a.likelihoods.get(key(task())));
 expect(positive.a.report).toEqual(hidden.a.report);expect(enc(positive.s.canonicalValue())).toEqual(enc(hidden.s.canonicalValue()));
 expect(denied.mean).toBeUndefined();expect(denied.a.likelihoods.get(key(task()))).toBeUndefined();
 expect(positive.traces.some(v=>txt(f(rec(v,160n),6n)).endsWith('+time-domain/0.1-candidate'))).toBe(true);
 console.info('M161 source/perception/person4000 -> live appraisal4001; fixed safe reports defeat hidden truth; denied unknown; exact restore PASS');
});
it('clock161: actual relationship participation changes later existing reasons; one encounter remains null',()=>{
 const results=[];
 for(const participant of [true,false]){
  ordinal=20000n;const sm=owner(LONG),sources=[3999n,4000n].map(at=>event(at,110n,REL_SOURCE,list([text(REL),u(1),participant,true,u(0)])));
  const h=createRelationshipExecution(C,model.relationship!,sm,sources,model.modelIdentity.value,inputs.runIdentity.value,false,false,[],undefined,LONG);let s=initial,one:AuthoritativeState=initial;
  for(const source of sources){h.begin(source.dueAt);s=deliver(h,s,[source]).s;h.prepareCommit();h.close();if(source.dueAt===3999n)one=s;}
  h.begin(4001n);const e=event(4001n,80n,sid(1001,'event/task-raw-signals')),a=h.raw(e,s,raw),b=h.raw(e,sm.restoreState(enc(s.canonicalValue())),raw),nullCase=h.raw(e,one,raw);
  expect(items(a.report,'list')[7]).toBe(true);expect(a.output).toEqual(b.output);expect(a.trace([])).toEqual(b.trace([]));expect(nullCase.output).toEqual(raw);
  expect(relationshipHistory(s.read(rp()).value)).toHaveLength(participant?2:0);h.prepareCommit();h.close();results.push(a);
 }
 expect(results[0].output).not.toEqual(results[1].output);expect(results[1].output).toEqual(raw);
 console.info('M161 participant/witness3999,4000 -> contact reasons4001; one-encounter zero preserved; exact restore PASS');
});
it('clock161: communication ingress and recipient witnesses preserve late access and later probes',()=>{
 ordinal=30000n;const sm=owner(LONG),source=event(4000n,10n,COMM_SOURCE,list([text(COMM),false,true,true,true,true,false]));
 const comm=createCommunicationExecution(C,model.communication!,sm,[source],model.modelIdentity.value,inputs.runIdentity.value,false,LONG);comm.begin(4000n);const learned=deliver(comm,initial,[source]);comm.prepareCommit();comm.close();
 expect(communicationClaim(learned.s.read(knowledgePath(C)).value)).toEqual(list([true]));expect(learned.out.some(v=>key(items(v,'list')[0])===key(text(PRIVATE)))).toBe(true);
 const deniedSource={...source,payload:list([text(COMM),false,true,false,true,true,false])},denied=createCommunicationExecution(C,model.communication!,sm,[deniedSource],model.modelIdentity.value,inputs.runIdentity.value,false,LONG);denied.begin(4000n);const unknown=deliver(denied,initial,[deniedSource]);denied.prepareCommit();denied.close();expect(history(unknown.s.read(knowledgePath(C)).value)).toHaveLength(0);
 const first=event(4000n,30n,W_SOURCE,list([task(),true,false,false])),later=event(4001n,30n,W_SOURCE,list([task(),false,false,false]));
 function observe(start:AuthoritativeState,which:ScheduledEvent,baseOrdinal:bigint){ordinal=baseOrdinal;const base=createCommunicationExecution(C,model.communication!,sm,[],model.modelIdentity.value,inputs.runIdentity.value,false,LONG),h=createCommitmentWitness(C,[task()],recipients(),sm,[which],model.modelIdentity.value,inputs.runIdentity.value,LONG).extend(base);h.begin(which.dueAt);const r=deliver(h,start,[which]);h.prepareCommit();h.close();return r;}
 const witnessed=observe(learned.s,first,40000n);expect(witnessed.s.read(witnessPath(recipients()[0],task())).presence).toBe(true);expect(witnessed.s.read(witnessPath(recipients()[1],task())).presence).toBe(false);
 const a=observe(witnessed.s,later,50000n),b=observe(sm.restoreState(enc(witnessed.s.canonicalValue())),later,50000n);expect(a.out).toEqual(b.out);expect(a.traces).toEqual(b.traces);expect(enc(a.s.canonicalValue())).toEqual(enc(b.s.canonicalValue()));
 const probes=a.out.filter(v=>key(items(v,'list')[0])===key(text(WPROBE)));expect(probes).toHaveLength(2);expect(items(items(probes[0],'list')[3],'list')).toHaveLength(1);expect(items(items(probes[1],'list')[3],'list')).toHaveLength(0);
 expect(witnessed.traces.some(v=>key(f(rec(v,160n),6n))===key(text(WITNESS+'+time-domain/0.1-candidate')))).toBe(true);
 console.info('M161 private ingress and witness observation4000 -> holder-scoped probe4001; denial/unknown and exact restore PASS');
});
it('clock161: disclosure and embarrassment consume late supports through the real readers',()=>{
 const sm=owner(LONG,true),route=model.strategy!.find(t=>key(t.task)===key(task()))!,observation=list([text(PERFORMANCE_OBS),occurrence(1164),u(4000),task(),u(0),route.plans[0].actionId,true,true]);
 let s=sm.applyPatch(initial,{operations:[op(initial,outcomePath(task()),list([text(PERFORMANCE),list([observation])])),op(initial,expectationPath(task(),0n),appendExpectation(undefined,observation,4,LONG))]},KNOWLEDGE_OWNER).state;
 const topic=list([text(EXPECTATION_TOPIC),task(),u(0)]),settings=compileCommunication(list([text(LEARNED_DISCLOSURE),model.communication!.action,list(recipients()),topic]),model.strategy!,model.social!.targets,true,true);
 ordinal=60000n;const source=event(4001n,10n,COMM_SOURCE,list([text(LEARNED_DISCLOSURE),true,true,true])),e=event(4001n,90n,sid(1001,'event/task-expression'));
 function disclosure(state:AuthoritativeState){ordinal=61000n;const h=createCommunicationExecution(C,settings,sm,[source],model.modelIdentity.value,inputs.runIdentity.value,false,LONG);h.begin(4001n);deliver(h,state,[source]);const result=h.expression(e,state,lateExpression)!;h.close();return result;}
 const a=disclosure(s),b=disclosure(sm.restoreState(enc(s.canonicalValue())));expect(items(a.report,'list')[4]).toEqual(list([q(1,1)]));expect(a.report).toEqual(b.report);expect(a.trace([])).toEqual(b.trace([]));expect(items(f(rec(a.trace([]),160n),9n),'list')).toEqual([occurrence(1164)]);
 s=put(sm,s,importancePath(task()),list([text(PRIORITY_ADOPTION),q(1,2),occurrence(1164,2n),u(4000)]),GOAL_OWNER);
 const evaluation=list([...items(socialObs(4000n),'list'),list([]),list([list([true]),list([true]),list([true])])]);s=put(sm,s,sp(),list([text(SOCIAL),list([evaluation])]),PERSON_OWNER);
 const config={target:target(),task:task(),action:model.relationship!.action};
 function appraisal(state:AuthoritativeState,at=4001n){const h=createEmbarrassment(config,C,sm,model.modelIdentity.value,inputs.runIdentity.value,LONG);return h.appraise(event(at,50n,sid(1001,'event/task-appraisal')),state);}
 ordinal=62000n;const live=appraisal(s);ordinal=62000n;const continued=appraisal(sm.restoreState(enc(s.canonicalValue())));
 expect(items(live.report,'list')[7]).toEqual(q(1,2));expect(items(live.report,'list')[8]).toEqual(text('Known'));expect(live.report).toEqual(continued.report);expect(live.trace()).toEqual(continued.trace());expect(()=>appraisal(s,4000n)).toThrow('prior-only');
 console.info('M161 late expectation support -> disclosed mean1; late importance -> Known appraisal severity1/2; original sources/prior-only/restore PASS');
});
