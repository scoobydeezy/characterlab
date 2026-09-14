import {describe,it,expect} from 'vitest';
import {DeterministicScheduler,type StateAdapter,type EventEmission} from '../substrate/scheduler';
import {bytesToHex,canonicalEncode,list,text,unsigned,bytes,typedIdentifier} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import {retainByRecency,type TimedAcquisition} from '../campaign3/recencyRetention';

// Scheduler integration fixture only: fixed body source and bounded payload-free
// history. No public acquisition schema, admission, PRJ or cognitive read API.
type History={id:bigint;source:string;at:bigint;completeLoss:boolean};
type State={current:TimedAcquisition[];history:History[]};
const type=(name:string)=>typedIdentifier(10030n,text('retention-settlement-fixture/'+name));
const key=(name:string)=>bytesToHex(canonicalEncode(type(name)));
const adapter:StateAdapter<State>={
 clone:s=>structuredClone(s),
 validate:s=>{if(s.history.length>8)throw Error('fixture history safety bound');if(new Set(s.history.map(h=>h.source)).size!==s.history.length)throw Error('source already formed');
  for(const a of s.current){const h=s.history.find(h=>h.id===a.id);if(!h||h.completeLoss||h.at!==a.acquiredAt)throw Error('invalid surviving target');}
 },
 canonicalValue:s=>list([list(s.current.map(a=>list([unsigned(a.id),unsigned(a.acquiredAt),list(a.units.map(u=>list([text(u.key),list(u.views.map(bytes))])))]))),list(s.history.map(h=>list([unsigned(h.id),text(h.source),unsigned(h.at),h.completeLoss])))])
};
function build(capacity:number,options:{empty?:boolean;fail?:boolean;reverse?:boolean}={}){
 const reads:State[]=[];
 const emit=(name:string,at:bigint,payload=list([])):EventEmission=>({dueAt:simInstant(at),phase:name==='prepare'?130n:140n,eventTypeId:type(name),payload,dependencies:list([])});
 const s=new DeterministicScheduler<State>({initialState:{current:[],history:[]},stateAdapter:adapter,maxSettlementWorkPerSimulationInstant:4n,
  handlers:new Map([[key('prepare'),({state,instant,allocateRuntimeId})=>{
   if(options.empty)return {nextState:state,outputs:[],traceContributions:[],emittedEvents:[]};
   const candidates=['source/a','source/b'].map(source=>list([unsigned(allocateRuntimeId()),text(source),unsigned(instant)]));
   return {nextState:state,outputs:candidates,traceContributions:[],emittedEvents:(options.reverse?[...candidates].reverse():candidates).map(p=>emit('form',instant,p))};
  }]]),
  adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',beforeInstant(){},beforeCommit(){},close(){},validateRuntimeEmission(){},
   prepare(events,prior,at){
    const histories=events.map(e=>{if(bytesToHex(canonicalEncode(e.eventTypeId))!==key('form')||typeof e.payload!=='object'||e.payload.kind!=='list')throw Error('fixture member');const [id,source,time]=e.payload.items;
     if(typeof id!=='object'||id.kind!=='unsigned'||typeof source!=='object'||source.kind!=='text'||typeof time!=='object'||time.kind!=='unsigned'||time.value!==at)throw Error('fixture payload');
     return {id:id.value,source:source.value,at:time.value,completeLoss:false};
    }).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
    adapter.validate({current:prior.current,history:[...prior.history,...histories]});
    const fresh:TimedAcquisition[]=histories.map(h=>({id:h.id,acquiredAt:h.at,kind:'Interoceptive',units:['alpha','beta'].map(key=>({key,views:[new Uint8Array([17,31]),new Uint8Array([99])]}))}));
    const result=retainByRecency([...prior.current,...fresh],at,{EventContinuant:0,Interoceptive:capacity});
    const survivors=new Set(result.acquisitions.map(a=>a.id));
    const next:State={current:result.acquisitions,history:[...prior.history,...histories].map(h=>({...h,completeLoss:!survivors.has(h.id)}))};
    const executed=new Set<bigint>();
    return {execute({event,state}){reads.push(adapter.clone(state));executed.add(event.eventId);return {nextState:state,outputs:[list([text('retention-disposition'),event.payload,survivors.has(histories.find(h=>typeof event.payload==='object'&&event.payload.kind==='list'&&typeof event.payload.items[0]==='object'&&event.payload.items[0].kind==='unsigned'&&h.id===event.payload.items[0].value)!.id)])],traceContributions:[],emittedEvents:[]};},
     finish(){if(executed.size!==events.length)throw Error('missing member');if(options.fail)throw Error('late retention failure');return next;}};
   }
  }
 });
 const schedule=(at:bigint)=>s.schedule(emit('prepare',at));schedule(1n);return {s,reads,schedule};
}
const snapshot=(s:DeterministicScheduler<State>)=>({state:s.getState(),clock:s.getClock(),queue:s.getPendingQueue(),allocators:s.getAllocatorState(),outputs:s.getOutputs(),trace:s.getCommittedTrace()});
describe('committed formation then loss: actual scheduler, fixture scope',()=>{
 it('RS-A: positive formation survives with history and intact sample groups',async()=>{const {s}=build(4);await s.settleNextInstant();expect(s.getState().current).toHaveLength(2);expect(s.getState().history.every(h=>!h.completeLoss)).toBe(true);expect(s.getOutputs()).toHaveLength(4);});
 it('RS-B: zero capacity commits acquisition and complete loss but no current target or payload history',async()=>{
  const {s,reads}=build(0);await s.settleNextInstant();const state=s.getState();expect(state.current).toEqual([]);expect(state.history).toHaveLength(2);expect(state.history.every(h=>h.completeLoss)).toBe(true);
  for(const h of state.history)expect(Object.keys(h).sort()).toEqual(['at','completeLoss','id','source']);expect(s.getOutputs()).toHaveLength(4);expect(reads).toEqual([{current:[],history:[]},{current:[],history:[]}]);
 });
 it('RS-C: no qualifying formation creates no acquisition or loss history',async()=>{const {s}=build(0,{empty:true});await s.settleNextInstant();expect(s.getState()).toEqual({current:[],history:[]});expect(s.getOutputs()).toEqual([]);});
 it('RS-D: actual failure commits neither formation nor loss and restores all committed surfaces',async()=>{const {s}=build(0,{fail:true}),before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow('late retention failure');expect(snapshot(s)).toEqual(before);});
 it('RS-E: replay after complete loss still rejects without reconstructing forgotten content',async()=>{const {s,schedule}=build(0);await s.settleNextInstant();schedule(2n);const before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow('source already formed');expect(snapshot(s)).toEqual(before);});
 it('RS-F: same-barrier order does not change partial survival or historical acquisition identity',async()=>{
  const a=build(1),b=build(1,{reverse:true});await a.s.settleNextInstant();await b.s.settleNextInstant();expect(a.s.getState()).toEqual(b.s.getState());
  expect(a.s.getState().current).toHaveLength(1);expect(a.s.getState().current[0].units).toHaveLength(1);expect(a.s.getState().current[0].units[0].views).toHaveLength(2);expect(a.s.getState().history).toHaveLength(2);
 });
});
