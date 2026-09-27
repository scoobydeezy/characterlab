import {describe,it,expect} from 'vitest';
import {DeterministicScheduler,type EventEmission,type StateAdapter} from '../substrate/scheduler';
import {canonicalEncode,bytesToHex,list,text,unsigned,typedIdentifier} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
type State={episode:number;graph:number;presentation:number};
const keys=['episode','graph','presentation'] as const;
const type=(s:string)=>typedIdentifier(10030n,text('attention-barrier-fixture/'+s));
const key=(s:string)=>bytesToHex(canonicalEncode(type(s)));
const emission=(s:string,phase=140n):EventEmission=>({dueAt:simInstant(1n),phase,eventTypeId:type(s),payload:unsigned(1),dependencies:list([])});
const adapter:StateAdapter<State>={clone:s=>({...s}),validate:s=>{for(const k of keys)if(!Number.isInteger(s[k]))throw Error('bad fixture state');},canonicalValue:s=>list(keys.map(k=>unsigned(s[k])))};
function build(options:{chain?:boolean;failLast?:boolean;reverse?:boolean}={}){
 const seen:State[]=[];
 const s=new DeterministicScheduler<State>({initialState:{episode:0,graph:0,presentation:0},stateAdapter:adapter,maxSettlementWorkPerSimulationInstant:4n,
  handlers:new Map([[key('retain'),({state})=>({nextState:state,outputs:[],traceContributions:[],emittedEvents:(options.chain?['episode']:options.reverse?[...keys].reverse():keys).map(k=>emission(k))})]]),
  adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',beforeInstant(){},beforeCommit(){},close(){},validateRuntimeEmission(){},
   prepare(events,prior){const candidates=new Map<string,number>();return {
    execute({event,state,allocateRuntimeId}){seen.push({...state});const k=keys.find(k=>key(k)===bytesToHex(canonicalEncode(event.eventTypeId)))!;
     if(!k||candidates.has(k))throw Error('bad fixture member');candidates.set(k,prior[k]+1);
     // This allocation deliberately tests whole-instant allocator rollback, not a proposed domain ID.
     allocateRuntimeId();if(options.failLast&&candidates.size===events.length)throw Error('late fixture failure');
     return {nextState:state,outputs:[text(k)],traceContributions:[],emittedEvents:options.chain?[emission('graph')]:[]};},
    finish(){if(candidates.size!==3)throw Error('incomplete fixture siblings');return {...prior,...Object.fromEntries(candidates)};}
   };}},invariants:[state=>{if(new Set(keys.map(k=>state[k])).size!==1)throw Error('cross-leaf fixture consistency');}]});
 s.schedule(emission('retain',130n));return {s,seen};
}
const snap=(s:DeterministicScheduler<State>)=>({state:s.getState(),clock:s.getClock(),queue:s.getPendingQueue(),allocators:s.getAllocatorState(),outputs:s.getOutputs(),trace:s.getCommittedTrace()});
describe('attention memory: actual scheduler barrier expressibility, fixture owners only',()=>{
 it('AMB-A: chained phase140 emission rejects and rolls back the entire instant',async()=>{const {s}=build({chain:true}),before=snap(s);await expect(s.settleNextInstant()).rejects.toThrow('automatic outputs are terminal');expect(snap(s)).toEqual(before);});
 it('AMB-B: retention can emit three terminal siblings with the same actual parent',async()=>{const {s,seen}=build();const result=await s.settleNextInstant();expect(s.getState()).toEqual({episode:1,graph:1,presentation:1});expect(seen).toEqual(Array.from({length:3},()=>({episode:0,graph:0,presentation:0})));expect(result!.executedEvents.slice(1).map(e=>e.causalParentEventIds)).toEqual([[result!.executedEvents[0].eventId],[result!.executedEvents[0].eventId],[result!.executedEvents[0].eventId]]);});
 it('AMB-C: disjoint fixture candidates combine independently of sibling emission order',async()=>{const a=build(),b=build({reverse:true});await a.s.settleNextInstant();await b.s.settleNextInstant();expect(a.s.getState()).toEqual(b.s.getState());expect(a.seen).toEqual(b.seen);});
 it('AMB-D: failure after all candidate evaluations preserves state, queue, output and allocators',async()=>{const {s}=build({failLast:true}),before=snap(s);await expect(s.settleNextInstant()).rejects.toThrow('late fixture failure');expect(snap(s)).toEqual(before);});
});
