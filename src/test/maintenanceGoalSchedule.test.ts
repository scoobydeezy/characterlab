import {describe,it,expect} from 'vitest';
import {bytesToHex,canonicalEncode,list,signed,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {DeterministicScheduler,SchedulerContractError,type EventEmission,type EventHandler,type SchedulerSnapshot,type StateAdapter,type TransactionBoundary} from '../substrate/scheduler';
import {simInstant} from '../substrate/time';
import {ExactRational as Q} from '../substrate/exactMath';
import {adoptMaintenanceGoal,settleMaintenanceGoal,settleMaintenanceGoalDeadline,type MaintenanceGoal} from '../campaign3/bodilyMaintenanceGoal';

// Scheduler composition control, not public model/codec/ingress qualification.
// Namespace 10030 is the existing scheduler test control, never production allocation.
const id=(s:string)=>typedIdentifier(10030,text(s)),key=(v:CanonicalValue)=>bytesToHex(canonicalEncode(v));
const domains=new Map([['signal/a',{lower:Q.of(0n),upper:Q.of(100n)}]]);
const goal={character:'character/a',goal:'goal/a',signal:'signal/a',desired:{lower:Q.of(30n),upper:Q.of(40n)},adoptedAt:1n,activeFrom:1n,expiresAt:100n};
type State=readonly MaintenanceGoal[];
const copy=(s:State)=>s.map(g=>({...g,desired:{lower:Q.of(g.desired.lower.numerator,g.desired.lower.denominator),upper:Q.of(g.desired.upper.numerator,g.desired.upper.denominator)}}));
const adapter:StateAdapter<State>={clone:copy,validate:s=>{if(s.length>1)throw Error('fixture goal bound');},canonicalValue:s=>list(s.map(g=>list([text(g.character),text(g.goal),text(g.signal),signed(g.desired.lower.numerator),signed(g.desired.lower.denominator),signed(g.desired.upper.numerator),signed(g.desired.upper.denominator),signed(g.adoptedAt),signed(g.activeFrom),signed(g.expiresAt),text(g.status),signed(g.changedAt)])))};
const emit=(name:string,at:bigint,phase:bigint):EventEmission=>({dueAt:simInstant(at),phase,eventTypeId:id(name),payload:text('goal/a'),dependencies:list([])});
function runtime(options:{withdraw?:boolean;lateEmission?:boolean;snapshot?:SchedulerSnapshot<State>}={}){
 const handlers=new Map<string,EventHandler<State>>();
 const result=(state:State,events:EventEmission[]=[],outputs:CanonicalValue[]=[])=>({nextState:state,emittedEvents:events,outputs,traceContributions:[]});
 handlers.set(key(id('adoption-proposal')),({state,allocateRuntimeId})=>{allocateRuntimeId();return result(state,[emit('adopt',1n,140n),...(options.lateEmission?[]:[emit('deadline',100n,140n)])]);});
 const s=options.snapshot;
 const scheduler=new DeterministicScheduler<State>({initialState:s?.state??[],stateAdapter:adapter,handlers,maxSettlementWorkPerSimulationInstant:3n,initialClock:s?.clock,initialQueue:s?.queue,initialAllocators:s?.allocators,initialCommittedTrace:s?.committedTrace,initialOutputs:s?.outputs,
  adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',beforeInstant(){},beforeCommit(){},close(){},validateRuntimeEmission(){},
   prepare(events,state){if(events.length!==1)throw Error('fixture excludes simultaneous lifecycle commands');let settled=copy(state),executed=false;
    return {execute:({event})=>{if(executed)throw Error('fixture repeated owner');executed=true;
     if(key(event.eventTypeId)===key(id('adopt'))){settled=adoptMaintenanceGoal(state,goal,domains);return result(state,options.lateEmission?[emit('deadline',100n,140n)]:[]);}
     if(key(event.eventTypeId)===key(id('withdraw'))){settled=settleMaintenanceGoal(state,'character/a','goal/a',event.dueAt,'Withdraw',domains);return result(state);}
     if(key(event.eventTypeId)===key(id('deadline'))){const r=settleMaintenanceGoalDeadline(state,'character/a','goal/a',event.dueAt,domains);settled=copy(r.state);return result(state,[],[text(r.kind)]);}
     throw Error('fixture unregistered lifecycle operation');
    },finish(){if(!executed)throw Error('fixture unexecuted owner');return settled;}};
   }}
 });
 if(!s){scheduler.schedule(emit('adoption-proposal',1n,40n));if(options.withdraw)scheduler.schedule(emit('withdraw',70n,140n));}
 return scheduler;
}
const retained=(s:ReturnType<typeof runtime>)=>{const {status,...rest}=s.exportQuiescentSnapshot();return {...rest,stateBytes:canonicalEncode(adapter.canonicalValue(rest.state))};};
describe('goal deadline and actual scheduler composition',()=>{
 it('GS-A: proposal schedules deadline before the terminal owner, and open expiry executes at100',async()=>{const s=runtime();const first=await s.settleNextInstant();expect(first!.executedEvents.map(e=>e.phase)).toEqual([40n,140n]);expect(s.getState()[0].status).toBe('Open');const pending=s.getPendingQueue();expect(pending).toHaveLength(1);expect(pending[0]).toMatchObject({dueAt:100n,phase:140n,causalParentEventIds:[0n]});await s.settleNextInstant();expect(s.getState()[0]).toMatchObject({status:'Expired',changedAt:100n});expect(s.getOutputs()).toEqual([text('Expired')]);expect(s.getPendingQueue()).toEqual([]);});
 it('GS-B: withdrawal leaves the actual deadline pending; expiration does not replace its history',async()=>{const s=runtime({withdraw:true});await s.settleNextInstant();const deadline=s.getPendingQueue().find(e=>e.dueAt===100n)!;await s.settleNextInstant();const bytes=canonicalEncode(adapter.canonicalValue(s.getState()));expect(s.getPendingQueue()).toEqual([deadline]);await s.settleNextInstant();expect(canonicalEncode(adapter.canonicalValue(s.getState()))).toEqual(bytes);expect(s.getOutputs()).toEqual([text('AlreadyWithdrawn')]);});
 it('GS-C: owner-created deadline fails at the real terminal boundary and rolls back allocation and queue',async()=>{const s=runtime({lateEmission:true}),before=retained(s);await expect(s.settleNextInstant()).rejects.toMatchObject({code:'ADAPTATION_STAGE_VIOLATION'});expect(retained(s)).toEqual(before);});
 it('GS-D: failures after proposal and owner stages preserve all pre-instant commitments',async()=>{const boundaries:TransactionBoundary[]=['after-state-validation','after-event-validation','after-trace-validation'];for(const phase of [40n,140n])for(const boundary of boundaries){const s=runtime(),before=retained(s);await expect(s.settleNextInstantForConformance({onBoundary:(b,e)=>{if(b===boundary&&e?.phase===phase)throw new SchedulerContractError('CONFORMANCE_INJECTION','goal control');}})).rejects.toThrow();expect(retained(s)).toEqual(before);}const s=runtime(),before=retained(s);await expect(s.settleNextInstantForConformance({onBoundary:b=>{if(b==='before-commit')throw new SchedulerContractError('CONFORMANCE_INJECTION','goal control');}})).rejects.toThrow();expect(retained(s)).toEqual(before);});
 it('GS-E: every quiescent prefix resumes the same pending withdrawal/deadline sequence',async()=>{const baseline=runtime({withdraw:true}),prefixes=[baseline.exportQuiescentSnapshot()];while(await baseline.settleNextInstant())prefixes.push(baseline.exportQuiescentSnapshot());for(const snapshot of prefixes){const restored=runtime({snapshot});while(await restored.settleNextInstant()){}expect(retained(restored)).toEqual(retained(baseline));}});
});
