import {describe,it,expect} from 'vitest';
import {DeterministicScheduler,type EventHandler,type StateAdapter,type SchedulerSnapshot} from '../substrate/scheduler';
import {simInstant} from '../substrate/time';
import {canonicalEncode,bytesToHex,list,text,unsigned,rational,bytes,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {adoptMaintenanceGoal,settleMaintenanceGoal,type MaintenanceGoal} from '../campaign3/bodilyMaintenanceGoal';
import {qualifyGoalOutcome,projectGoalQualification} from '../campaign3/goalOutcomeQualification';
import {applyQualifiedSignificance,type SignificantAcquisition} from '../campaign3/directionalSignificanceState';
// Scheduler expressibility fixture. These tuples are not public schemas or admission.
const q=(n:bigint)=>Q.of(n),range=(a:bigint,b:bigint)=>({lower:q(a),upper:q(b)});
const domains=new Map([['signal/a',range(0n,100n)]]),relations=new Map([['signal/a',{kind:'MetricInterval' as const,bounds:range(0n,100n)}]]);
const type=(s:string)=>typedIdentifier(10030n,text('focal-handoff-fixture/'+s)),key=(v:CanonicalValue)=>bytesToHex(canonicalEncode(v));
interface State {goals:readonly MaintenanceGoal[];memory:SignificantAcquisition[];delivery?:{event:bigint;payload:CanonicalValue};}
const r=(x:Q)=>rational(x.numerator,x.denominator);
const adapter:StateAdapter<State>={
 clone:s=>({...s,goals:s.goals.map(g=>({...g,desired:{lower:Q.of(g.desired.lower.numerator,g.desired.lower.denominator),upper:Q.of(g.desired.upper.numerator,g.desired.upper.denominator)}})),memory:structuredClone(s.memory),delivery:s.delivery?structuredClone(s.delivery):undefined}),
 validate:s=>{applyQualifiedSignificance({observer:'observer/a',character:'character/a',memory:s.memory},[],100n);},
 canonicalValue:s=>list([list(s.goals.map(g=>list([text(g.character),text(g.goal),text(g.signal),r(g.desired.lower),r(g.desired.upper),unsigned(g.adoptedAt),unsigned(g.activeFrom),unsigned(g.expiresAt),text(g.status),unsigned(g.changedAt)]))),list(s.memory.map(a=>list([unsigned(a.id),unsigned(a.acquiredAt),text(a.kind),list(a.units.map(u=>list([text(u.key),list(u.views.map(bytes)),u.useProtection,list(u.outcomeSignificanceDirections.map(text))])))]))),s.delivery?list([unsigned(s.delivery.event),s.delivery.payload]):list([])])
};
const emission=(s:string,at:bigint,phase:bigint,payload:CanonicalValue=list([]))=>({eventTypeId:type(s),dueAt:simInstant(at),phase,payload,dependencies:list([])});
function build(failureAt?:bigint,resume?:SchedulerSnapshot<State>,loseFocal=false){
 const initial:State={goals:adoptMaintenanceGoal([],{character:'character/a',goal:'maintain',signal:'signal/a',desired:range(30n,40n),adoptedAt:0n,activeFrom:0n,expiresAt:100n},domains),memory:[{id:7n,kind:'EventContinuant',acquiredAt:10n,units:[{key:'candidate',views:[new Uint8Array([1])],useProtection:true,outcomeSignificanceDirections:[]}]}]};
 const handlers=new Map<string,EventHandler<State>>();
 handlers.set(key(type('assess')),({state,instant,allocateRuntimeId})=>{
  const result=qualifyGoalOutcome({state:state.goals,character:'character/a',goal:'maintain',signal:'signal/a',now:instant,before:range(20n,21n),after:range(30n,31n),domains:relations});
  const qualification=projectGoalQualification(result);
  if(qualification.kind!=='Qualifies')throw Error('fixture expected qualification');
  // One actual runtime occurrence is reused in output and scheduled handoff.
  const payload=list([unsigned(allocateRuntimeId()),text('fixture/consequence'),text('character/a'),unsigned(instant),text(qualification.direction)]);
  return {nextState:state,outputs:[payload],traceContributions:[],emittedEvents:[emission('deliver',30n,15n,payload)]};
 });
 handlers.set(key(type('withdraw')),({state,instant})=>({nextState:{...state,goals:settleMaintenanceGoal(state.goals,'character/a','maintain',instant,'Withdraw',domains),memory:loseFocal?[]:state.memory},outputs:[],traceContributions:[],emittedEvents:[]}));
 handlers.set(key(type('deliver')),({state,event})=>{
  if(state.delivery)throw Error('duplicate fixture delivery');
  return {nextState:{...state,delivery:{event:event.eventId,payload:event.payload}},outputs:[],traceContributions:[],emittedEvents:[]};
 });
 handlers.set(key(type('prepare')),({state})=>{
  if(!state.delivery)throw Error('uncompleted fixture delivery');
  return {nextState:state,outputs:[],traceContributions:[],emittedEvents:[{...emission('credit',30n,130n,state.delivery.payload),additionalCausalParentEventIds:[state.delivery.event]}]};
 });
 handlers.set(key(type('credit')),({state,event})=>{
  if(!state.delivery||!event.causalParentEventIds.includes(state.delivery.event)||key(event.payload)!==key(state.delivery.payload))throw Error('fixture result binding');
  const p=event.payload;if(typeof p==='boolean'||p.kind!=='list')throw Error('fixture payload');
  const direction=p.items[4];if(typeof direction==='boolean'||direction.kind!=='text'||!['MovingCloser','MovingFarther'].includes(direction.value))throw Error('fixture direction');
  // Supported focal attribution is a premise here, independently executed in SC-A..E.
  const memory=applyQualifiedSignificance({observer:'observer/a',character:'character/a',memory:state.memory},[{observer:'observer/a',character:'character/a',direction:direction.value as 'MovingCloser'|'MovingFarther',targets:[{acquisition:7n,unit:'candidate'}]}],30n);
  return {nextState:{...state,memory,delivery:undefined},outputs:[list([text('credit'),event.payload])],traceContributions:[],emittedEvents:[]};
 });
 const s=new DeterministicScheduler<State>({initialState:resume?.state??initial,stateAdapter:adapter,handlers,maxSettlementWorkPerSimulationInstant:4n,...(resume?{initialClock:resume.clock,initialAllocators:resume.allocators,initialQueue:resume.queue,initialOutputs:resume.outputs,initialCommittedTrace:resume.committedTrace}:{}),adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',beforeInstant(){},validateRuntimeEmission(){},close(){},prepare(){throw Error('no terminal batch');},beforeCommit(state,instant){if(instant===30n&&state.delivery)throw Error('unconsumed fixture handoff');if(instant===failureAt)throw Error('handoff commit failure');}}});
 if(!resume)for(const e of [emission('assess',20n,130n),emission('withdraw',25n,130n),emission('prepare',30n,40n)])s.schedule(e);
 return s;
}
const snapshot=(s:DeterministicScheduler<State>)=>{const {status,...rest}=s.exportQuiescentSnapshot();return rest;};
describe('focal historical qualification actual scheduler handoff',()=>{
 it('FH-A: committed result crosses withdrawal in pending delivery; no current-goal reappraisal',async()=>{const s=build();await s.settleNextInstant();const basis=s.getOutputs()[0];expect(s.getPendingQueue().find(e=>key(e.eventTypeId)===key(type('deliver')))!.payload).toEqual(basis);await s.settleNextInstant();expect(s.getState().goals[0].status).toBe('Withdrawn');await s.settleNextInstant();expect(s.getState().memory[0].units[0].outcomeSignificanceDirections).toEqual(['MovingCloser']);expect(s.getState().delivery).toBeUndefined();expect(s.getOutputs()[1]).toEqual(list([text('credit'),basis]));});
 it('FH-B: producer and receiver commit failures preserve the complete prior scheduler snapshot',async()=>{for(const failureAt of [20n,30n]){const s=build(failureAt);if(failureAt===30n){await s.settleNextInstant();await s.settleNextInstant();}const before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow('handoff commit failure');expect(snapshot(s)).toEqual(before);}});
 it('FH-C: trusted snapshot continuation before and after withdrawal preserves exact handoff and result',async()=>{const s=build();await s.settleNextInstant();const a=build(undefined,s.exportQuiescentSnapshot());await s.settleNextInstant();const b=build(undefined,s.exportQuiescentSnapshot());await a.settleNextInstant();for(const x of [s,a,b])await x.settleNextInstant();expect(snapshot(a)).toEqual(snapshot(s));expect(snapshot(b)).toEqual(snapshot(s));});
 it('FH-D: a carried qualification cannot recreate a lost focal child',async()=>{const s=build(undefined,undefined,true);await s.settleNextInstant();await s.settleNextInstant();const before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow();expect(snapshot(s)).toEqual(before);expect(s.getState().memory).toEqual([]);});
});
