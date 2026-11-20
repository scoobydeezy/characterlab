/** World-only obstruction in the existing character execution path. */
import {list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataKey as key,dataText as txt,invalidModel,dataIdentity as id} from '../campaign2/canonicalData';
import {traceRecordValue} from '../substrate/trace';
import {scheduledEventValue} from '../substrate/persistence';
import {SchedulerContractError,type ScheduledEvent,type EventHandlerContext} from '../substrate/scheduler';
import type {AuthoritativeState} from '../substrate/state';
import {bodyId} from './bodyIdentifiers';
import {ACTION_BODY_EVENT,type selectedBodyEffect} from './actionBody';
export const OBSTRUCTION='external-obstruction/0.1',OBSTRUCTION_VERSION='external-obstruction/0.1-candidate';
export const OBSTRUCTION_SOURCE=bodyId(1001,'event/external-obstruction-source');
export const OBSTRUCTION_RESULT='external-obstruction-result/0.1';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
export function obstructionSource(v:CanonicalValue,C:CanonicalValue,people:readonly CanonicalValue[]){
 const a=items(v,'list');if(a.length!==3||txt(a[0])!==OBSTRUCTION||!eq(a[1],C))invalidModel('external obstruction holder/grammar');
 const blockers=items(a[2],'list');if(blockers.length>1||blockers.some(p=>eq(p,C)||!people.some(person=>eq(p,person))))invalidModel('external obstruction declared participant');
 return {blocker:blockers[0]};
}
export function createExternalObstruction(C:CanonicalValue,people:readonly CanonicalValue[],originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue){
 let active=false,at=0n,current:ScheduledEvent|undefined;
 const used=new Set<bigint>(),assessed=new Set<bigint>();
 const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','external obstruction: '+s);};
 return Object.freeze({
  begin(instant:bigint){if(active)fail('already active');active=true;at=instant;current=undefined;used.clear();assessed.clear();},
  close(){active=false;current=undefined;used.clear();assessed.clear();},
  prepareCommit(){if(!active||originals.some(e=>e.dueAt===at&&!used.has(e.eventId)))fail('unconsumed source');},
  execute(context:EventHandlerContext<AuthoritativeState>){
   const e=context.event;if(!active||e.dueAt!==at||e.phase!==30n||!eq(e.eventTypeId,OBSTRUCTION_SOURCE)||current||used.has(e.eventId)||!originals.some(x=>fp(x)===fp(e)))fail('unbound source');
   obstructionSource(e.payload,C,people);current=structuredClone(e);used.add(e.eventId);
   return {nextState:context.state,outputs:[],emittedEvents:[],traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){
    if(children.length)fail('source children');
    return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:e,seamId:bodyId(1036,'seam/external-obstruction'),seamVersion:OBSTRUCTION_VERSION,recordKind:e.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:[],actualReadRecords:[],inputProjection:e.payload,outputProjection:list([]),randomDrawRecords:[],quantizationOperations:[],statePatch:{operations:[]},structuralMutationDiffs:[],emittedEvents:[],invariantResults:[]})];
   }};
  },
  assess(e:ScheduledEvent,effect:ReturnType<typeof selectedBodyEffect>){
   if(!active||e.dueAt!==at||e.phase!==110n||!eq(e.eventTypeId,ACTION_BODY_EVENT)||assessed.has(e.eventId))fail('effect lifecycle');
   assessed.add(e.eventId);if(!current)return undefined;
   const {blocker}=obstructionSource(current.payload,C,people);
   return {blocked:!!blocker,report:list([text(OBSTRUCTION_RESULT),u(current.eventId),effect.outcomeId,effect.attemptId,effect.action,list(blocker?[blocker]:[]),!!blocker])};
  }
 });
}
