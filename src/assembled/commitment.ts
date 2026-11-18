import {LEGACY_TIME_LIMIT,EXTENDED_TIME_LIMIT,assertTimeLimit,timeDomainVersion,type TimeLimit} from './timeDomain';
/** commitment-lifecycle/0.1: controlled cancellation in the existing goal owner. */
import {list,text,unsigned,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {type AuthoritativeState,type ActualReadRecord,type StatePatch,type StatePath} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventHandlerContext,type EventEmission} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataItems as items,dataKey as key,dataField as f,dataUnsigned as uint,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {cognitiveRecord as r,receivingRecord as rec} from './codecs';
import {sid,pattern} from './skill';
import {GOAL_OWNER} from './priority';
import type {createPriorityExecution} from './priorityExecution';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const COMMITMENT_VERSION='assembled-character-commitment-lifecycle/0.1-candidate';
export const COMMITMENT_REQUEST=sid(1001,'event/assembled-commitment-request'),COMMITMENT_CANCEL=sid(1001,'event/assembled-commitment-cancel');
type Task={key:CanonicalValue;deadline:bigint};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
const fail=(message:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','commitment: '+message);};
export function cancellationRequest(value:CanonicalValue,tasks:readonly Task[]){const a=items(value,'list');if(a.length!==3||!tasks.some(t=>eq(t.key,a[0]))||typeof a[1]!=='boolean'||typeof a[2]!=='boolean')invalidModel('commitment request task/Boolean shape');return {task:a[0],permitted:a[1]===true};}
export function createCommitmentLifecycle(C:CanonicalValue,tasks:readonly Task[],stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 let active=false,at=0n,used=false,unbound=false,pending:ScheduledEvent|undefined,source:ScheduledEvent|undefined;
 const isOwn=(e:ScheduledEvent)=>eq(e.eventTypeId,COMMITMENT_CANCEL);
 const trace=(event:ScheduledEvent,outputs:CanonicalValue[],children:readonly ScheduledEvent[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:sid(1036,'seam/assembled-commitment'),seamVersion:timeDomainVersion(COMMITMENT_VERSION,timeLimit),recordKind:event.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});
 return {extend(base:ReturnType<typeof createPriorityExecution>){return {...base,
  eventTypes:()=>[...base.eventTypes(),COMMITMENT_REQUEST,COMMITMENT_CANCEL],isLearning:(e:ScheduledEvent)=>isOwn(e)||base.isLearning(e),
  begin(instant:bigint){base.begin(instant);active=true;at=instant;used=false;unbound=false;pending=undefined;source=undefined;},
  close(){base.close();active=false;pending=undefined;source=undefined;unbound=false;},
  prepareCommit(){base.prepareCommit();if(!active||pending||unbound||originals.some(e=>e.dueAt===at)&&!used)fail('unfinished instant');},
  execute(context:EventHandlerContext<AuthoritativeState>){const e=context.event;if(!eq(e.eventTypeId,COMMITMENT_REQUEST)){if(isOwn(e))fail('cancellation requires prepared stage');return base.execute(context);}
   if(!active||used||e.phase!==30n||e.dueAt!==at||!originals.some(o=>fp(o)===fp(e)))fail('unbound request');const request=cancellationRequest(e.payload,tasks);used=true;source=structuredClone(e);unbound=true;
   const emission:EventEmission={dueAt:e.dueAt,phase:140n,eventTypeId:COMMITMENT_CANCEL,payload:e.payload,dependencies:list([])},outputs=[list([text(COMMITMENT_VERSION),signed(at),text('Request'),request.permitted?request.task:list([])])];let bound=false;
   return {nextState:context.state,outputs,emittedEvents:[emission],traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){if(!active||bound||children.length!==1)fail('child lifecycle');const child=children[0],expected={...emission,eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[e.eventId]};if(child.eventId===e.eventId||child.eventSequence<=e.eventSequence||fp(child)!==fp(expected))fail('child binding');pending=structuredClone(child);bound=true;unbound=false;return [trace(e,outputs,children)];}};
  },
  prepare(events:readonly ScheduledEvent[],B0:AuthoritativeState){const own=events.filter(isOwn);if(!own.length)return base.prepare(events,B0);const others=events.filter(e=>!isOwn(e)),prior=others.length?base.prepare(others,B0):undefined;if(own.length!==1)fail('cancellation multiplicity');const event=own[0];if(!active||!pending||!source||fp(event)!==fp(pending)||event.phase!==140n||event.dueAt!==at)fail('unbound cancellation');pending=undefined;
   const request=cancellationRequest(event.payload,tasks),path:StatePath={rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:request.task}]},reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]};
   if(request.permitted){const before=stateModel.read(B0,path),task=tasks.find(t=>eq(t.key,request.task))!;reads.push({accessorId:sid(1028,'accessor/commitment-cancellation'),path,presence:before.presence,value:before.value,derivedSources:[]});if(!before.presence||uint(f(rec(before.value!,372n),1n))!==1n||at>=task.deadline)fail('requires Open before deadline');(patch.operations as StatePatch['operations'][number][]).push({kind:'set',path,expected:{presence:true,value:before.value!},newValue:r(372,[unsigned(4),signed(at),unsigned(source!.eventId)],timeLimit===EXTENDED_TIME_LIMIT?3:2)});}
   const report=list([text(COMMITMENT_VERSION),signed(at),text(request.permitted?'Cancelled':'Denied'),request.permitted?request.task:list([])]);let cursor=0,finished=false,rows:CanonicalValue[]=[];
   return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=events.length||fp(context.event)!==fp(events[cursor++]))fail('stage order');return isOwn(context.event)?{nextState:B0,outputs:[],emittedEvents:[],traceContributions:[]}:prior!.execute(context);},
    finish(state:AuthoritativeState){if(finished||cursor!==events.length)fail('incomplete stage');finished=true;const next=prior?prior.finish(state):state,result=stateModel.applyPatch(next,patch,GOAL_OWNER,{writableRoots:[373n],targetPaths:patch.operations.map(o=>o.path)});rows=[...(prior?.traces()??[]),trace(event,[report],[],reads,patch,result.diffs)];return result.state;},
    traces(){if(!finished)fail('trace before finish');return events.flatMap(e=>rows.filter(t=>uint(f(rec(f(rec(t,160n),4n),130n),1n))===e.eventId));}};
  }
 };}};
}
