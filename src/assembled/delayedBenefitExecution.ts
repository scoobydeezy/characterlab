import {list,text,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type ActualReadRecord,type StatePatch,type StatePath} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {simInstant} from '../substrate/time';
import {dataItems as items,dataField as f,dataKey as key,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {qValue,readQ,ZERO} from '../campaign2/cognitiveMath';
import {cognitiveRecord as r,receivingRecord as rec} from './codecs';
import {sid,pattern} from './skill';
import {KNOWLEDGE_OWNER,PLAN_OWNER,knowledgePath,journal,chooseStrategy,type Strategy} from './strategy';
import {chosenData} from './choice';
import {BENEFIT,BENEFIT_VERSION,BENEFIT_SOURCE,BENEFIT_TICK,BENEFIT_OBSERVE,BENEFIT_LEARN,BENEFIT_OWNER,benefitSource,benefitPath,benefitKnowledge,benefitPlan,benefitWorld,benefitCandidates,benefitRaw,benefitValues,offer,eq,type Benefit} from './delayedBenefit';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','delayed benefit '+s);},fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
export function createBenefitExecution(s:Benefit,C:CanonicalValue,routes:Strategy,stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue){
 let active=false,at=0n,source:readonly CanonicalValue[]|undefined,unbound=0;let appraisal:CanonicalValue|undefined;const used=new Set<bigint>(),pending=new Set<string>(),hooks=new Set<string>();
 const read=(state:AuthoritativeState,path:StatePath,reads:ActualReadRecord[])=>{const v=stateModel.read(state,path);reads.push({accessorId:sid(1028,'accessor/delayed-benefit'),path,presence:v.presence,value:v.value,derivedSources:[]});return v.value;};
 const trace=(event:ScheduledEvent,input:CanonicalValue,outputs:readonly CanonicalValue[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[],children:readonly ScheduledEvent[]=[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:sid(1036,'seam/assembled-delayed-benefit'),seamVersion:BENEFIT_VERSION,recordKind:event.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:input,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});
 function patch(state:AuthoritativeState,path:StatePath,value:CanonicalValue,owner:ReturnType<typeof sid>){const prior=stateModel.read(state,path),p:StatePatch={operations:[{kind:'set',path,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:value}]};const result=stateModel.applyPatch(state,p,owner,{writableRoots:[path.rootStateTypeId],targetPaths:[path]});return {...result,patch:p};}
 function checkHook(e:ScheduledEvent,name:string,phase:bigint){if(!active||e.dueAt!==at||e.phase!==phase||!eq(e.eventTypeId,sid(1001,'event/'+name))||hooks.has(name))fail('unauthenticated/duplicate '+name);hooks.add(name);}
 function settle(e:ScheduledEvent,state:AuthoritativeState,input:CanonicalValue,attempt?:CanonicalValue){
  const reads:ActualReadRecord[]=[],pv=read(state,benefitPath(s,'plan'),reads),wv=read(state,benefitPath(s,'world'),reads),p=pv?benefitPlan(pv,s):undefined,w=wv?benefitWorld(wv):undefined;
  if(!p||w?.settled||!attempt&&!w)return {nextState:state,report:undefined,trace:()=>trace(e,input,[],reads)};
  if(!source)fail('missing current physical frame');const allowed=source![4]===true,amount=allowed?(p.selected===1n?source![5]:source![6]):qValue(ZERO),due=at===p.due;
  if(at>p.due)fail('missed due instant');
  const support=attempt??w!.a[1],value=list([text(BENEFIT),support,due,u(at),due?amount:qValue(ZERO)]);
  if(!due&&w)return {nextState:state,report:undefined,trace:()=>trace(e,input,[],reads)};
  const applied=patch(state,benefitPath(s,'world'),value,BENEFIT_OWNER);
  return {nextState:applied.state,report:undefined,trace:()=>trace(e,input,[],reads,applied.patch,applied.diffs)};
 }
 function emit(phase:bigint,eventTypeId:ReturnType<typeof sid>,payload:CanonicalValue):EventEmission{return {dueAt:simInstant(at),phase,eventTypeId,payload,dependencies:list([])};}
 function bind(parent:ScheduledEvent,emissions:EventEmission[]){unbound++;let bound=false;return (children:readonly ScheduledEvent[])=>{if(bound||children.length!==emissions.length)fail('child count');for(const [i,e]of children.entries()){const expected={...emissions[i],eventId:e.eventId,eventSequence:e.eventSequence,causalParentEventIds:[parent.eventId]};if(e.eventId===parent.eventId||e.eventSequence<=parent.eventSequence||fp(e)!==fp(expected)||pending.has(fp(e)))fail('child association');pending.add(fp(e));}bound=true;unbound--;};}
 function admit(e:ScheduledEvent,phase:bigint){if(!active||e.dueAt!==at||e.phase!==phase||!pending.delete(fp(e)))fail('generated origin');}
 return Object.freeze({
 eventTypes:()=>[BENEFIT_SOURCE,BENEFIT_TICK,BENEFIT_OBSERVE,BENEFIT_LEARN],isLearning:(e:ScheduledEvent)=>eq(e.eventTypeId,BENEFIT_LEARN),
 begin(time:bigint){if(active)fail('already active');active=true;at=time;source=undefined;appraisal=undefined;unbound=0;used.clear();pending.clear();hooks.clear();},
 close(){active=false;source=undefined;appraisal=undefined;used.clear();pending.clear();hooks.clear();unbound=0;},
 prepareCommit(){if(!active||unbound||pending.size||originals.some(e=>e.dueAt===at&&!used.has(e.eventId)))fail('unfinished instant');},
 appraise(event:ScheduledEvent,state:AuthoritativeState,input:CanonicalValue){checkHook(event,'task-appraisal',50n);const reads:ActualReadRecord[]=[],k=benefitKnowledge(read(state,benefitPath(s,'knowledge'),reads)),pv=read(state,benefitPath(s,'plan'),reads),p=pv?benefitPlan(pv,s):undefined,values=k.offer.length?benefitValues(s,k.offer[0]):undefined;
  let assessment=r(382,[u(1)]);if(k.receipt.length&&p){const amount=readQ(k.receipt[3]),gap=p.promise.subtract(amount);assessment=gap.equals(ZERO)?r(382,[u(3)]):r(382,[u(gap.compare(ZERO)>0?2:4),qValue(gap.compare(ZERO)>0?gap:ZERO.subtract(gap))]);}
  const a=rec(input,384n),output=r(384,[f(a,1n),f(a,2n),list(items(f(a,3n),'list').map(v=>{const row=rec(v,383n);return eq(f(row,1n),s.task)?r(383,[s.task,assessment]):row;}))]);
  appraisal=list([text(BENEFIT+'/appraisal'),u(at),s.task,list(k.offer),list(k.receipt),values?list(values.map(qValue)):list([])]);const report=appraisal;return {output,report,trace:()=>trace(event,input,[output,report],reads)};
 },
 candidates(event:ScheduledEvent,state:AuthoritativeState,input:CanonicalValue){checkHook(event,'task-candidates',70n);const reads:ActualReadRecord[]=[],k=benefitKnowledge(read(state,benefitPath(s,'knowledge'),reads)),p=read(state,benefitPath(s,'plan'),reads);
  let output=benefitCandidates(input,s,k,!!p,at);const routeKnowledge=read(state,knowledgePath(C),reads),available=chooseStrategy(s.task,2,at,journal(routeKnowledge,routes,1000000n)).availability;
  const c=rec(output,398n);output={...c,fields:new Map(c.fields).set(3n,list(items(f(c,3n),'list').map(v=>{const o=rec(v,397n),origins=items(f(o,2n),'set').filter(v=>{const origin=rec(v,396n);if(!eq(f(origin,1n),s.task))return true;const i=routes.find(r=>eq(r.task,s.task))!.plans.findIndex(p=>eq(p.instructionId,f(origin,2n)));return available[i]?.usable;});return {...o,fields:new Map(o.fields).set(2n,{kind:'set',items:origins})} as CanonicalValue;}).filter(v=>items(f(rec(v,397n),2n),'set').length)))};
  const report=list([text(BENEFIT+'/options'),u(at),s.task,k.offer.length?list(k.offer):list([]),list(available.map(v=>list([text(v.kind),v.source])))]);
  return {output,report,trace:()=>trace(event,input,[output,report],reads)};
 },
 raw(event:ScheduledEvent,state:AuthoritativeState,input:CanonicalValue){checkHook(event,'task-raw-signals',80n);if(!appraisal)fail('reason source requires actual current appraisal');const a=items(appraisal!,'list'),k={offer:items(a[3],'list'),receipt:items(a[4],'list')},values=items(a[5],'list'),output=benefitRaw(input,s,k,values.length?[readQ(values[0]),readQ(values[1])]:[ZERO,ZERO]),report=list([text(BENEFIT+'/valuation'),u(at),s.task,appraisal!]);return {output,report,trace:()=>trace(event,list([input,appraisal!]),[output,report])};},
 plan(event:ScheduledEvent,state:AuthoritativeState,output:CanonicalValue){checkHook(event,'task-plan',100n);const plan=rec(output,431n),intent=rec(f(plan,2n),425n),chosen=chosenData(f(intent,2n)),candidate=f(chosen,1n),action=f(rec(candidate,395n),2n),selected=eq(action,s.now.actionId)?1:eq(action,s.later.actionId)?2:0;
  const raw=rec(f(rec(f(rec(f(intent,2n),409n),3n),408n),2n),403n),options=items(f(rec(f(raw,2n),398n),3n),'list'),matched=options.find(v=>eq(f(rec(v,397n),1n),candidate));
  if(!selected||!matched||!items(f(rec(matched,397n),2n),'set').some(v=>eq(f(rec(v,396n),1n),s.task)))return undefined;
  const reads:ActualReadRecord[]=[],known=benefitKnowledge(read(state,benefitPath(s,'knowledge'),reads)),prior=read(state,benefitPath(s,'plan'),reads);if(prior||!known.offer.length||at!==2n)return undefined;if(!appraisal)fail('plan requires actual appraisal');const values=items(items(appraisal!,'list')[5],'list');if(values.length!==2||readQ(values[selected-1]).compare(ZERO)<=0)return undefined;const due=at+(selected===2?offer(known.offer[0]).delay:0n),value=list([text(BENEFIT),u(selected),u(at),u(due),f(plan,1n),known.offer[0],intent]),applied=patch(state,benefitPath(s,'plan'),value,PLAN_OWNER),report=list([text(BENEFIT+'/plan'),value]);
  return {nextState:applied.state,report,trace:()=>trace(event,output,[report],reads,applied.patch,applied.diffs)};
 },
 execution(event:ScheduledEvent,state:AuthoritativeState,output:CanonicalValue){checkHook(event,'protocol-execution',110n);const o=rec(output,433n),pv=stateModel.read(state,benefitPath(s,'plan')).value;if(!pv)return undefined;const p=benefitPlan(pv,s),attempt=rec(f(o,2n),432n),plan=rec(f(attempt,2n),431n);if(!eq(f(plan,2n),p.a[6]))return undefined;
  // Failed shared actuation cannot create an authorized benefit transaction.
  if(uint(f(o,3n))===0n)return undefined;return settle(event,state,output,f(o,1n));
 },
 execute(context:EventHandlerContext<AuthoritativeState>){const {event,state}=context;let outputs:CanonicalValue[]=[],emissions:EventEmission[]=[],reads:ActualReadRecord[]=[],nextState=state,extra:(()=>CanonicalValue)|undefined;
  if(eq(event.eventTypeId,BENEFIT_SOURCE)){if(!active||at!==event.dueAt||event.phase!==10n||source||used.has(event.eventId)||!originals.some(e=>fp(e)===fp(event)))fail('source origin');source=benefitSource(event.payload,at,s);used.add(event.eventId);emissions=[emit(110n,BENEFIT_TICK,list([])),emit(120n,BENEFIT_OBSERVE,list([]))];}
  else if(eq(event.eventTypeId,BENEFIT_TICK)){admit(event,110n);const result=settle(event,state,event.payload);nextState=result.nextState;extra=result.trace;}
  else if(eq(event.eventTypeId,BENEFIT_OBSERVE)){admit(event,120n);if(!source)fail('missing observation frame');const occurrences=[0,1].map(()=>typedIdentifier(1164,u(context.allocateRuntimeId()))),offers=items(source![1],'list'),observedOffer=source![2]===true&&source![3]===true&&offers.length?list([offers[0],occurrences[0],u(at)]):list([]);
   let receipt:CanonicalValue=list([]);if(source![7]===true&&source![8]===true){const pv=read(state,benefitPath(s,'plan'),reads),wv=read(state,benefitPath(s,'world'),reads);if(pv&&wv&&benefitWorld(wv).settled){const p=benefitPlan(pv,s),w=benefitWorld(wv);receipt=list([occurrences[1],u(at),u(p.selected),s.mode===0n?qValue(w.amount):s.mode===1n?qValue(ZERO):qValue(p.promise)]);}}
   const observed=list([text(BENEFIT+'/observation'),u(at),observedOffer,receipt]);outputs=[observed];emissions=[emit(140n,BENEFIT_LEARN,observed)];
  }else fail('learning requires common stage');
  const bound=bind(event,emissions);return {nextState,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){bound(children);return [extra?extra():trace(event,event.payload,outputs,reads,undefined,undefined,children)];}};
 },
 prepare(events:readonly ScheduledEvent[],B0:AuthoritativeState){if(events.length!==1)fail('learning count');const e=events[0];admit(e,140n);const a=items(e.payload,'list');if(a.length!==4||!eq(a[0],text(BENEFIT+'/observation'))||uint(a[1])!==at)fail('observation association');
  const reads:ActualReadRecord[]=[],prior=read(B0,benefitPath(s,'knowledge'),reads),k=benefitKnowledge(prior),o=items(a[2],'list'),receipt=items(a[3],'list'),value=list([text(BENEFIT),list(k.offer.length?k.offer:o),list(k.receipt.length?k.receipt:receipt)]);benefitKnowledge(value);
  const changed=(!prior&&(o.length||receipt.length))||!!prior&&!eq(prior,value);let executed=false,finished=false,result:ReturnType<typeof patch>|undefined;
  return {execute(context:EventHandlerContext<AuthoritativeState>){if(executed||finished||fp(e)!==fp(context.event))fail('learning order');executed=true;return {nextState:B0,outputs:[],emittedEvents:[],traceContributions:[]};},finish(state:AuthoritativeState){if(!executed||finished)fail('learning completion');finished=true;if(changed)result=patch(state,benefitPath(s,'knowledge'),value,KNOWLEDGE_OWNER);return result?.state??state;},traces(){if(!finished)fail('trace before finish');return [trace(e,e.payload,[],reads,result?.patch,result?.diffs)];}};
 }
 });
}
