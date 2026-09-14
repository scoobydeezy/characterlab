import {describe,it,expect} from 'vitest';
import {DeterministicScheduler,type EventEmission,type EventHandler,type StateAdapter} from '../substrate/scheduler';
import {canonicalEncode,bytesToHex,list,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';

// Fixture state only. This is not a proposed persistent attention/affect root.
interface FixtureState {readonly log:readonly string[];readonly delivery?:{id:bigint;payload:CanonicalValue};}
const key=(v:CanonicalValue)=>bytesToHex(canonicalEncode(v)),type=(s:string)=>typedIdentifier(10030n,text('attention-join-fixture/'+s));
const adapter:StateAdapter<FixtureState>={clone:s=>structuredClone(s),validate:s=>{if(!Array.isArray(s.log))throw Error('fixture state');},canonicalValue:s=>list([list(s.log.map(text)),s.delivery?list([unsigned(s.delivery.id),s.delivery.payload]):list([])])};
const emission=(name:string,at:bigint,phase:bigint,payload:CanonicalValue=text('fixture-response')):EventEmission=>({eventTypeId:type(name),dueAt:simInstant(at),phase,payload,dependencies:list([])});
function build(options:{futureParent?:boolean;opaqueDependency?:boolean;strict?:boolean;late?:boolean;corrupt?:boolean;failJoin?:boolean}={}){
 let futureId=-1n;
 const handlers=new Map<string,EventHandler<FixtureState>>();
 const result=(state:FixtureState,name:string,emittedEvents:readonly EventEmission[]=[])=>({nextState:{...state,log:[...state.log,name]},emittedEvents,outputs:[text(name)],traceContributions:[]});
 handlers.set(key(type('producer')),({state})=>result(state,'producer',[emission('delivery',3n,options.late?50n:15n)]));
 handlers.set(key(type('scene')),({state})=>result(state,'scene',[emission('ready',3n,40n)]));
 handlers.set(key(type('delivery')),({state,event})=>result({...state,delivery:{id:event.eventId,payload:event.payload}},'delivery'));
 handlers.set(key(type('ready')),({state})=>{
  const parent=options.futureParent?futureId:state.delivery?.id;
  if(options.strict!==false&&(!state.delivery||parent!==state.delivery.id))throw Error('join source has not completed');
  if(parent===undefined)throw Error('fixture parent absent');
  return result(state,'ready',[{...emission('join',3n,40n,options.corrupt?text('forged'):state.delivery?.payload??text('fixture-response')),additionalCausalParentEventIds:[parent],dependencies:options.opaqueDependency?list([unsigned(futureId)]):list([])}]);
 });
 handlers.set(key(type('join')),({state,event})=>{
  if(options.strict!==false&&(!state.delivery||!event.causalParentEventIds.includes(state.delivery.id)||key(event.payload)!==key(state.delivery.payload)))throw Error('join payload mismatch');
  if(options.failJoin)throw Error('after join checks');return result(state,'join');
 });
 handlers.set(key(type('future')),({state})=>result(state,'future'));
 const scheduler=new DeterministicScheduler({initialState:{log:[]} as FixtureState,stateAdapter:adapter,handlers,maxSettlementWorkPerSimulationInstant:10n});
 scheduler.schedule(emission('producer',1n,50n));scheduler.schedule(emission('scene',3n,0n));
 const future=scheduler.schedule(emission('future',5n,40n));futureId=future.eventId;
 return {scheduler,futureId};
}
const snapshot=(s:DeterministicScheduler<FixtureState>)=>({state:s.getState(),clock:s.getClock(),queue:s.getPendingQueue(),allocators:s.getAllocatorState(),outputs:s.getOutputs(),trace:s.getCommittedTrace()});
describe('attention two-parent join: actual scheduler expressibility',()=>{
 it('JXP-A: existing phases support a completed two-parent join',async()=>{
  const {scheduler:s}=build();await s.settleNextInstant();const settled=await s.settleNextInstant();
  expect(s.getState().log).toEqual(['producer','scene','delivery','ready','join']);
  const events=settled!.executedEvents,delivery=events.find(e=>key(e.eventTypeId)===key(type('delivery')))!,ready=events.find(e=>key(e.eventTypeId)===key(type('ready')))!,join=events.find(e=>key(e.eventTypeId)===key(type('join')))!;
  expect(events.map(e=>e.phase)).toEqual([0n,15n,40n,40n]);expect(join.causalParentEventIds).toEqual([delivery.eventId,ready.eventId].sort((a,b)=>a<b?-1:1));
 });
 it('JXP-B: generic parent IDs admit allocated but unexecuted future events',async()=>{
  const {scheduler:s,futureId}=build({futureParent:true,strict:false});await s.settleNextInstant();const result=await s.settleNextInstant();
  expect(s.getState().log).toContain('join');expect(s.getState().log).not.toContain('future');expect(result!.executedEvents.at(-1)!.causalParentEventIds).toContain(futureId);
 });
 it('JXP-C: opaque dependencies do not establish completed-source readiness',async()=>{
  const {scheduler:s,futureId}=build({futureParent:true,strict:false,opaqueDependency:true});await s.settleNextInstant();const result=await s.settleNextInstant();
  expect(result!.executedEvents.at(-1)!.dependencies).toEqual(list([unsigned(futureId)]));expect(s.getState().log).not.toContain('future');expect(s.getState().log).toContain('join');
 });
 for(const [name,options,message] of [
  ['JXP-D',{futureParent:true},'join source has not completed'],
  ['JXP-E',{late:true},'join source has not completed'],
  ['JXP-F',{corrupt:true},'join payload mismatch'],
  ['JXP-G',{failJoin:true},'after join checks'],
 ] as const)it(name+': explicit adapter failure preserves the whole committed prefix',async()=>{
  const {scheduler:s}=build(options);await s.settleNextInstant();const before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow(message);expect(snapshot(s)).toEqual(before);
 });
});
