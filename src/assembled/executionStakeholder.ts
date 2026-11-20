/** Actual outcome -> passive local perception. No psychological state or scheduler. */
import {list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataKey as key,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {traceRecordValue} from '../substrate/trace';
import {scheduledEventValue} from '../substrate/persistence';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import type {AuthoritativeState} from '../substrate/state';
import type {SocialWitness} from './socialWitness';
import {bodyId} from './bodyIdentifiers';
import {PERFORMANCE_OBSERVE} from './performance';
export const STAKEHOLDER='execution-stakeholder/0.1',STAKEHOLDER_VERSION=STAKEHOLDER+'-candidate';
export const STAKEHOLDER_OBS=STAKEHOLDER+'/observation',STAKEHOLDER_EVID=STAKEHOLDER+'/evidence';
export const STAKEHOLDER_EVIDENCE=bodyId(1001,'event/execution-stakeholder-evidence');
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
export function stakeholderView(outputs:readonly CanonicalValue[],s:SocialWitness,index:number){
 if(!Number.isInteger(index)||index<0||index>=s.observers.length)invalidModel('stakeholder view selector');
 const o=s.observers[index],rows=outputs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length===5&&[STAKEHOLDER_OBS,STAKEHOLDER_EVID].some(t=>eq(v.items[0],text(t)))&&eq(v.items[1],o.holder)&&eq(v.items[2],o.target));
 return list([text(STAKEHOLDER+'/view'),o.holder,o.target,list(rows)]);
}
export function createExecutionStakeholder(C:CanonicalValue,s:SocialWitness,model:CanonicalValue,run:CanonicalValue){
 let active=false,at=0n,used=false,unbound=false;const pending=new Map<string,ScheduledEvent>();
 const fail=(m:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','stakeholder: '+m);};
 const trace=(event:ScheduledEvent,outputs:CanonicalValue[],children:readonly ScheduledEvent[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:bodyId(1036,'seam/execution-stakeholder'),seamVersion:STAKEHOLDER_VERSION,recordKind:event.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:[],actualReadRecords:[],inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:{operations:[]},structuralMutationDiffs:[],emittedEvents:children,invariantResults:[]});
 return {
  begin(t:bigint){if(active)fail('already active');active=true;at=t;used=false;unbound=false;pending.clear();},
  close(){active=false;used=false;unbound=false;pending.clear();},
  prepareCommit(){if(!active||unbound||pending.size)fail('unfinished instant');},
  observe(e:ScheduledEvent,task:CanonicalValue,access:readonly boolean[]){
   if(!active||used||e.dueAt!==at||e.phase!==120n||!eq(e.eventTypeId,PERFORMANCE_OBSERVE)||access.length!==2)fail('observation lifecycle');
   used=true;const a=items(e.payload,'list');if(typeof a[1]!=='boolean')fail('actual outcome');
   const matching=items(a[2],'list').some(v=>eq(items(v,'list')[0],task));
   const slots=s.observers.map((o,i)=>list(matching&&access[i]?[list([text(STAKEHOLDER_OBS),o.holder,o.target,u(at),a[1]])]:[]));
   const outputs=slots.flatMap(v=>items(v,'list')),emissions:EventEmission[]=[{dueAt:e.dueAt,phase:130n,eventTypeId:STAKEHOLDER_EVIDENCE,payload:list(slots),dependencies:list([])}];unbound=true;
   return {outputs,emissions,bind(children:readonly ScheduledEvent[]){if(!active||!unbound||children.length!==1)fail('child lifecycle');const c=children[0],expected={...emissions[0],eventId:c.eventId,eventSequence:c.eventSequence,causalParentEventIds:[e.eventId]};if(c.eventId===e.eventId||c.eventSequence<=e.eventSequence||fp(c)!==fp(expected))fail('child binding');pending.set(fp(c),structuredClone(c));unbound=false;},trace:(children:readonly ScheduledEvent[])=>trace(e,outputs,children)};
  },
  execute(context:EventHandlerContext<AuthoritativeState>){
   const e=context.event;if(!active||e.dueAt!==at||e.phase!==130n||!eq(e.eventTypeId,STAKEHOLDER_EVIDENCE)||!pending.delete(fp(e)))fail('unbound generated evidence');
   const outputs=items(e.payload,'list').flatMap(v=>items(v,'list')).map(v=>list([text(STAKEHOLDER_EVID),...items(v,'list').slice(1)]));
   return {nextState:context.state,outputs,emittedEvents:[],traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){if(children.length)fail('evidence children');return [trace(e,outputs,children)];}};
  }
 };
}
