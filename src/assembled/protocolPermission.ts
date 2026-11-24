/** Original world permission; no psychological state or public source output. */
import {list,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataKey as key,dataText as txt,dataIdentity as id,dataRecord as rec,dataField as f,dataUnsigned as u,invalidModel} from '../campaign2/canonicalData';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {SchedulerContractError,type ScheduledEvent,type EventHandlerContext} from '../substrate/scheduler';
import type {AuthoritativeState} from '../substrate/state';
import {bodyId} from './bodyIdentifiers';
export const PROTOCOL_PERMISSION='protocol-permission/0.1',PROTOCOL_PERMISSION_VERSION=PROTOCOL_PERMISSION+'-candidate';
export const PROTOCOL_PERMISSION_SOURCE=bodyId(1001,'event/protocol-permission-source');
export function protocolPermissionSource(v:CanonicalValue,C:CanonicalValue,actions:readonly CanonicalValue[],limit:number){
 const a=items(v,'list');if(a.length!==3||txt(a[0])!==PROTOCOL_PERMISSION||key(a[1])!==key(C))invalidModel('protocol permission holder/grammar');
 const rows=items(a[2],'set'),seen=new Set<string>();if(!actions.length||actions.length>limit||rows.length!==actions.length)invalidModel('protocol permission complete action coverage');
 return rows.map(v=>{const r=items(v,'list');if(r.length!==2||typeof r[1]!=='boolean'||!actions.some(x=>key(x)===key(r[0]))||seen.has(key(r[0])))invalidModel('protocol permission declared action/Boolean');seen.add(key(r[0]));return {action:r[0],permitted:r[1] as boolean};});
}
export function protocolAttemptAction(attempt:CanonicalValue){
 const plan=rec(f(rec(attempt,432n),2n),431n),intent=rec(f(plan,2n),425n),decision=rec(f(intent,2n),409n),result=rec(f(decision,4n),419n);
 if(u(f(result,1n))!==3n)invalidModel('protocol permission requires chosen attempt');
 return f(rec(f(rec(f(result,2n),420n),1n),395n),2n);
}
export function createProtocolPermission(C:CanonicalValue,actions:readonly CanonicalValue[],originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue,limit:number){
 let active=false,at=0n,current:ScheduledEvent|undefined;const used=new Set<bigint>();
 const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','protocol permission: '+s);};
 return Object.freeze({
  begin(instant:bigint){if(active)fail('already active');active=true;at=instant;current=undefined;used.clear();},
  close(){active=false;current=undefined;used.clear();},
  prepareCommit(){if(!active||originals.some(e=>e.dueAt===at&&!used.has(e.eventId)))fail('unconsumed source');},
  parents(){if(!active)fail('inactive');return current?[current.eventId]:[];},
  assess(event:ScheduledEvent,action:CanonicalValue){
   if(!active||event.dueAt!==at||event.phase!==110n||!actions.some(x=>key(x)===key(action)))fail('execution lifecycle/action');
   if(current&&!event.causalParentEventIds.includes(current.eventId))fail('unbound execution parent');
   const allowed=current?protocolPermissionSource(current.payload,C,actions,limit).find(r=>key(r.action)===key(action))!.permitted:true;
   return {allowed,report:list([action,list(current?[unsigned(current.eventId),current.payload]:[]),allowed])};
  },
  execute(context:EventHandlerContext<AuthoritativeState>){
   const e=context.event;if(!active||e.dueAt!==at||e.phase!==100n||key(e.eventTypeId)!==key(PROTOCOL_PERMISSION_SOURCE)||current||used.has(e.eventId)||!originals.some(x=>key(scheduledEventValue(x))===key(scheduledEventValue(e))))fail('unbound source');
   protocolPermissionSource(e.payload,C,actions,limit);current=structuredClone(e);used.add(e.eventId);
   return {nextState:context.state,outputs:[],emittedEvents:[],traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){
    if(children.length)fail('source children');return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:e,seamId:bodyId(1036,'seam/protocol-permission'),seamVersion:PROTOCOL_PERMISSION_VERSION,recordKind:e.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:[],actualReadRecords:[],inputProjection:e.payload,outputProjection:list([]),randomDrawRecords:[],quantizationOperations:[],statePatch:{operations:[]},structuralMutationDiffs:[],emittedEvents:[],invariantResults:[]})];
   }};
  }
 });
}
