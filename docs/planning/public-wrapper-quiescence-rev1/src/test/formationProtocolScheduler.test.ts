import {describe,it,expect} from 'vitest';
import {DeterministicScheduler,type StateAdapter,type EventEmission} from '../substrate/scheduler';
import {simInstant} from '../substrate/time';
import {canonicalEncode,bytesToHex,list,text,unsigned,bytes,typedIdentifier} from '../substrate/canonicalEncoding';
import {prepareFormationSettlement} from '../campaign3/formationSettlement';
import {validateFormationProtocolTransition,type FormationProtocolValue} from '../campaign3/formationProtocolTransition';
import type {TimedAcquisition} from '../campaign3/recencyRetention';
type State={memory:TimedAcquisition[];protocol:FormationProtocolValue};
const type=(name:string)=>typedIdentifier(10030n,text('formation-protocol-scheduler-fixture/'+name));
const key=(name:string)=>bytesToHex(canonicalEncode(type(name)));
const adapter:StateAdapter<State>={clone:s=>structuredClone(s),validate:s=>validateFormationProtocolTransition(s.protocol,[],[],s.memory.map(a=>a.id),10n,2,s.protocol),canonicalValue:s=>list([list(s.memory.map(a=>list([unsigned(a.id),unsigned(a.acquiredAt),text(a.kind),list(a.units.map(u=>list([text(u.key),list(u.views.map(bytes))])))]))),list(s.protocol.domain.map(d=>list([text(d.character),text(d.source),text(d.kind)]))),list(s.protocol.successes.map(d=>list([text(d.character),text(d.source),text(d.kind),unsigned(d.acquisition),unsigned(d.formedAt),d.completeLoss])))])};
function build(empty=false,fail=false,limit=2,capacity=0){
 let tx:ReturnType<typeof prepareFormationSettlement>|undefined;
 const emit=(name:string,at:bigint):EventEmission=>({eventTypeId:type(name),dueAt:simInstant(at),phase:name==='admit'?130n:140n,payload:list([]),dependencies:list([])});
 const s=new DeterministicScheduler<State>({initialState:{memory:[],protocol:{domain:[],successes:[]}},stateAdapter:adapter,maxSettlementWorkPerSimulationInstant:3n,
  handlers:new Map([[key('admit'),({state,instant,allocateRuntimeId})=>{
   const source={source:'selection/source',character:'character/a',kind:'Interoceptive' as const};
   // Fixture's trusted admission hook; NOT the public write-free evidence producer.
   const id=empty?undefined:allocateRuntimeId();
   tx=prepareFormationSettlement({priorProtocol:state.protocol,priorMemory:state.memory,incoming:[source],formed:id===undefined?[]:[{...source,acquisition:id,formedAt:instant}],freshMemory:id===undefined?[]:[{id,kind:source.kind,acquiredAt:instant,units:[{key:'signal',views:[new Uint8Array([71])]}]}],now:instant,sourceLimit:limit,capacity:{EventContinuant:0,Interoceptive:capacity}});
   if(empty){const next=tx.finish(tx.resolveMemory());return {nextState:next,outputs:[],traceContributions:[],emittedEvents:[]};}
   return {nextState:state,outputs:[text('fixture positive evidence')],traceContributions:[],emittedEvents:[emit('form',instant)]};
  }]]),
  adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',beforeInstant(){},validateRuntimeEmission(){},close(){},beforeCommit(){if(fail)throw Error('protocol before-commit failure');},prepare(events){if(events.length!==1||key('form')!==bytesToHex(canonicalEncode(events[0].eventTypeId)))throw Error('fixture terminal');return {execute:({state})=>({nextState:state,outputs:[],traceContributions:[],emittedEvents:[]}),finish(){return tx!.finish(tx!.resolveMemory());}};}}
 });s.schedule(emit('admit',1n));return {s,close:()=>tx?.close()};
}
const snapshot=(s:DeterministicScheduler<State>)=>({state:s.getState(),clock:s.getClock(),queue:s.getPendingQueue(),allocators:s.getAllocatorState(),outputs:s.getOutputs(),trace:s.getCommittedTrace()});
describe('formation protocol actual scheduler composition',()=>{
 it('PJ-A: successful empty branch enrolls without evidence, acquisition or terminal work',async()=>{const {s,close}=build(true);const allocator=s.getAllocatorState().nextRuntimeId;await s.settleNextInstant();expect(s.getState().protocol.domain).toHaveLength(1);expect(s.getState().protocol.successes).toEqual([]);expect(s.getOutputs()).toEqual([]);expect(s.getAllocatorState().nextRuntimeId).toBe(allocator);close();});
 it('PJ-B: immediate loss commits exact protocol success and no memory',async()=>{const {s,close}=build();await s.settleNextInstant();expect(s.getState().memory).toEqual([]);expect(s.getState().protocol.successes[0].completeLoss).toBe(true);close();});
 it('PJ-C: late failure rolls back empty enrollment and positive formation alike',async()=>{for(const empty of [true,false]){const {s,close}=build(empty,true),before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow('protocol before-commit failure');expect(snapshot(s)).toEqual(before);expect(s.status).toBe('Failed');close();}});
 it('PJ-D: lifetime overflow rejects without committed output or cognitive mutation',async()=>{const {s,close}=build(true,false,0),before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow('FORMATION_SOURCE_LIFETIME_EXCEEDED');expect(snapshot(s)).toEqual(before);close();});
 it('PJ-E: positive survival is owned by actual retention and recorded as live',async()=>{const {s,close}=build(false,false,2,1);await s.settleNextInstant();expect(s.getState().memory[0].units[0].views[0][0]).toBe(71);expect(s.getState().protocol.successes[0].completeLoss).toBe(false);close();});
});
