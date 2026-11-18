import {LEGACY_TIME_LIMIT,assertTimeLimit,timeDomainVersion,type TimeLimit} from './timeDomain';
/** Retained received forecasts; one existing knowledge owner and common settlement. */
import {list,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath,type ActualReadRecord,type StatePatch} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {simInstant} from '../substrate/time';
import {dataKey as key,dataItems as items,dataField as f,dataRecord as rec,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import type {ExactRational as Q} from '../substrate/exactMath';
import {KNOWLEDGE_OWNER} from './strategy';
import {sid,pattern,q} from './skill';
import {HORIZON,HORIZON_OBS,HORIZON_EVAL,HORIZON_DISPLAY,HORIZON_OBSERVE,HORIZON_EVIDENCE,HORIZON_LEARN,forecastPath,horizonDisplay,forecastValue,optionalForecast,horizonFactor} from './horizon';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','horizon: '+s);};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
export function createHorizonExecution(C:CanonicalValue,tasks:readonly CanonicalValue[],stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 let active=false,at=0n,unbound=0,projected=false;const used=new Set<bigint>(),pending=new Map<string,ScheduledEvent>(),evaluated=new Set<string>();
 const read=(s:AuthoritativeState,p:StatePath)=>{const value=stateModel.read(s,p);return {...value,record:{accessorId:sid(1028,'accessor/goal-horizon'),path:p,presence:value.presence,value:value.value,derivedSources:[]} as ActualReadRecord};};
 function trace(event:ScheduledEvent,outputs:readonly CanonicalValue[],children:readonly ScheduledEvent[],reads:readonly ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[],input:CanonicalValue=event.payload,sources:CanonicalValue[]=[]){return traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:sid(1036,'seam/assembled-horizon'),seamVersion:timeDomainVersion('assembled-character-horizon/0.1-candidate',timeLimit),recordKind:event.eventTypeId,subjectIds:[id(C)],sourceRecordIds:sources.map(id),registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:input,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});}
 function children(parent:ScheduledEvent,emissions:EventEmission[]){let bound=false;unbound++;return {emissions,bind(allocated:readonly ScheduledEvent[]){if(!active||bound||allocated.length!==emissions.length)fail('child lifecycle');for(const [i,e]of allocated.entries()){const expected={...emissions[i],eventId:e.eventId,eventSequence:e.eventSequence,causalParentEventIds:[parent.eventId]};if(e.eventId===parent.eventId||e.eventSequence<=parent.eventSequence||fp(e)!==fp(expected)||pending.has(fp(e)))fail('child mismatch');}for(const e of allocated)pending.set(fp(e),structuredClone(e));bound=true;unbound--;}};}
 const emit=(phase:bigint,eventTypeId:ReturnType<typeof sid>,payload:CanonicalValue):EventEmission=>({dueAt:simInstant(at),phase,eventTypeId,payload,dependencies:list([])});
 function admit(e:ScheduledEvent,phase:bigint){if(!active||e.dueAt!==at||e.phase!==phase||!pending.delete(fp(e)))fail('unbound generated event');}
 return Object.freeze({eventTypes:()=>[HORIZON_DISPLAY,HORIZON_OBSERVE,HORIZON_EVIDENCE,HORIZON_LEARN],isLearning:(e:ScheduledEvent)=>eq(e.eventTypeId,HORIZON_LEARN),
 begin(instant:bigint){if(active)fail('already active');active=true;at=instant;unbound=0;projected=false;used.clear();pending.clear();evaluated.clear();},
 close(){active=false;pending.clear();evaluated.clear();used.clear();unbound=0;projected=false;},
 prepareCommit(){if(!active||pending.size||unbound||originals.some(e=>e.dueAt===at&&!used.has(e.eventId)))fail('unfinished instant');},
 evaluate(event:ScheduledEvent,state:AuthoritativeState,task:CanonicalValue,base:Q){if(!active||event.phase!==60n||event.dueAt!==at||!eq(event.eventTypeId,sid(1001,'event/task-motive'))||!tasks.some(t=>eq(t,task))||evaluated.has(key(task)))fail('valuation lifecycle');evaluated.add(key(task));const prior=read(state,forecastPath(task)),forecast=prior.presence?forecastValue(prior.value!,timeLimit):undefined,factor=horizonFactor(forecast,at),value=base.multiply(factor);return {value,read:prior.record,support:forecast?.support,report:list([text(HORIZON_EVAL),unsigned(at),task,prior.value??list([]),q(base),q(factor),q(value)])};
 },
 execute(context:EventHandlerContext<AuthoritativeState>){const {event,state}=context;let outputs:CanonicalValue[]=[],emissions:EventEmission[]=[];
  if(eq(event.eventTypeId,HORIZON_DISPLAY)){if(!active||event.dueAt!==at||event.phase!==10n||used.has(event.eventId)||!originals.some(e=>fp(e)===fp(event)))fail('unbound display');horizonDisplay(event.payload,at,tasks,timeLimit);used.add(event.eventId);emissions=[emit(20n,HORIZON_OBSERVE,event.payload)];}
  else if(eq(event.eventTypeId,HORIZON_OBSERVE)){admit(event,20n);if(projected)fail('duplicate projection');const rows=horizonDisplay(event.payload,at,tasks,timeLimit),ids=Array.from({length:tasks.length},()=>typedIdentifier(1164,unsigned(context.allocateRuntimeId())));outputs=rows.map((row,i)=>{const x=items(row,'list');return list([text(HORIZON_OBS),ids[i],unsigned(at),x[0],x[2]===true?x[1]:list([])]);});projected=true;emissions=[emit(130n,HORIZON_EVIDENCE,list(outputs))];}
  else if(eq(event.eventTypeId,HORIZON_EVIDENCE)){admit(event,130n);outputs=[list([text(HORIZON),event.payload])];emissions=[emit(140n,HORIZON_LEARN,event.payload)];}
  else fail('learning requires prepared stage');
  const plan=children(event,emissions);return {nextState:state,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(allocated:readonly ScheduledEvent[]){plan.bind(allocated);return [trace(event,outputs,allocated)];}};
 },
 prepare(events:readonly ScheduledEvent[],B0:AuthoritativeState){if(events.length!==1)fail('learning multiplicity');const event=events[0];if(!eq(event.eventTypeId,HORIZON_LEARN))fail('learning event');admit(event,140n);const reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},sources:CanonicalValue[]=[];
  for(const o of items(event.payload,'list')){const a=items(o,'list'),forecast=optionalForecast(a[4],timeLimit);if(!forecast)continue;const path=forecastPath(a[3]),prior=read(B0,path);reads.push(prior.record);const value=list([text(HORIZON),unsigned(forecast.openingAt),forecast.available,a[1],unsigned(at)]);forecastValue(value,timeLimit);sources.push(a[1]);(patch.operations as StatePatch['operations'][number][]).push({kind:'set',path,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:value});}
  let executed=false,finished=false,rows:CanonicalValue[]=[];return {execute(context:EventHandlerContext<AuthoritativeState>){if(executed||finished||fp(context.event)!==fp(event))fail('learning lifecycle');executed=true;return {nextState:B0,outputs:[],emittedEvents:[],traceContributions:[]};},finish(state:AuthoritativeState){if(!executed||finished)fail('learning finish');finished=true;const result=stateModel.applyPatch(state,patch,KNOWLEDGE_OWNER,{writableRoots:[1000n],targetPaths:patch.operations.map(o=>o.path)});rows=[trace(event,[],[],reads,patch,result.diffs,event.payload,sources)];return result.state;},traces(){if(!finished)fail('trace before finish');return rows;}};
 }
 });
}
