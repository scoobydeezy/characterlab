import {describe,it,expect} from 'vitest';
import {DeterministicScheduler,type StateAdapter,type EventEmission} from '../substrate/scheduler';
import {bytesToHex,canonicalEncode,list,text,unsigned,typedIdentifier} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';

// Actual scheduler expressibility only. Raw ordinals/strings below are fixture data,
// not public acquisition codecs, allocated namespaces or authenticated evidence.
type Acquisition={id:bigint;source:string;content:string};
const type=(name:string)=>typedIdentifier(10030n,text('acquisition-formation-fixture/'+name));
const key=(name:string)=>bytesToHex(canonicalEncode(type(name)));
const value=(a:Acquisition)=>list([unsigned(a.id),text(a.source),text(a.content)]);
const adapter:StateAdapter<Acquisition[]>={
 clone:s=>s.map(a=>({...a})),
 validate:s=>{if(new Set(s.map(a=>a.id)).size!==s.length||new Set(s.map(a=>a.source)).size!==s.length)throw Error('duplicate acquisition or source');},
 canonicalValue:s=>list(s.map(value)),
};
function build(sources:string[],options:{failFinish?:boolean;reverse?:boolean}={}){
 const observed:Acquisition[][]=[];
 const emit=(name:string,at:bigint,payload=list([])):EventEmission=>({dueAt:simInstant(at),phase:name==='prepare'?130n:140n,eventTypeId:type(name),payload,dependencies:list([])});
 const scheduler=new DeterministicScheduler<Acquisition[]>({initialState:[],stateAdapter:adapter,maxSettlementWorkPerSimulationInstant:8n,
  handlers:new Map([[key('prepare'),({state,instant,allocateRuntimeId})=>{
   const candidates=sources.map(source=>({id:allocateRuntimeId(),source,content:'selected/'+source}));
   const events=(options.reverse?[...candidates].reverse():candidates).map(a=>emit('form',instant,value(a)));
   return {nextState:state,outputs:candidates.map(value),traceContributions:[],emittedEvents:events};
  }]]),
  adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',beforeInstant(){},beforeCommit(){},close(){},validateRuntimeEmission(){},
   prepare(events,prior){
    const candidates=events.map(e=>{
     if(bytesToHex(canonicalEncode(e.eventTypeId))!==key('form')||typeof e.payload!=='object'||e.payload.kind!=='list'||e.payload.items.length!==3)throw Error('wrong formation member');
     const [id,source,content]=e.payload.items;
     if(typeof id!=='object'||typeof source!=='object'||typeof content!=='object'||id.kind!=='unsigned'||source.kind!=='text'||content.kind!=='text')throw Error('bad fixture payload');
     return {id:id.value,source:source.value,content:content.value};
    });
    adapter.validate([...prior,...candidates]);
    const executed=new Set<bigint>();
    return {
     execute({event,state}){observed.push(adapter.clone(state));if(executed.has(event.eventId))throw Error('repeated member');executed.add(event.eventId);return {nextState:state,outputs:[],traceContributions:[],emittedEvents:[]};},
     finish(){if(executed.size!==events.length)throw Error('missing formation');if(options.failFinish)throw Error('formation finish failure');return [...prior,...candidates.sort((a,b)=>a.source<b.source?-1:a.source>b.source?1:0)];},
    };
   },
  },
 });
 const schedule=(at:bigint)=>scheduler.schedule(emit('prepare',at));
 schedule(1n);
 return {scheduler,observed,schedule};
}
const snapshot=(s:DeterministicScheduler<Acquisition[]>)=>({state:s.getState(),clock:s.getClock(),queue:s.getPendingQueue(),allocators:s.getAllocatorState(),outputs:s.getOutputs(),trace:s.getCommittedTrace()});
describe('ordinary acquisition phase130/140 protocol: scheduler fixture scope',()=>{
 it('AF-A: one positive candidate commits exactly one acquisition and the same output identity',async()=>{
  const {scheduler:s}=build(['alpha']);expect(s.getState()).toEqual([]);expect(s.getOutputs()).toEqual([]);
  await s.settleNextInstant();expect(s.getState()).toHaveLength(1);expect(s.getOutputs()).toEqual(s.getState().map(value));
 });
 it('AF-B: no candidate emits no acquisition output, memory or generated work',async()=>{
  const {scheduler:s}=build([]),before=s.getAllocatorState();await s.settleNextInstant();
  expect(s.getState()).toEqual([]);expect(s.getOutputs()).toEqual([]);expect(s.getPendingQueue()).toEqual([]);expect(s.getAllocatorState()).toEqual(before);
 });
 it('AF-C: both same-instant acquisitions survive reconciliation with B0-only member reads',async()=>{
  const a=build(['alpha','beta']),b=build(['alpha','beta'],{reverse:true});await a.scheduler.settleNextInstant();await b.scheduler.settleNextInstant();
  expect(a.scheduler.getState()).toHaveLength(2);expect(a.scheduler.getState()).toEqual(b.scheduler.getState());
  expect(a.observed).toEqual([[],[]]);expect(b.observed).toEqual([[],[]]);
 });
 it('AF-D: late failure rolls back candidate identities and the failed run remains terminal',async()=>{
  const a=build(['alpha','beta'],{failFinish:true}),before=snapshot(a.scheduler);
  await expect(a.scheduler.settleNextInstant()).rejects.toThrow('formation finish failure');expect(snapshot(a.scheduler)).toEqual(before);
  await expect(a.scheduler.settleNextInstant()).rejects.toThrow('failed runs cannot continue or retry');expect(snapshot(a.scheduler)).toEqual(before);
 });
 it('AF-E: duplicate source in one batch rejects without committed candidates',async()=>{
  const {scheduler:s}=build(['alpha','alpha']),before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow('duplicate acquisition or source');expect(snapshot(s)).toEqual(before);
 });
 it('AF-F: replayed source at a later instant preserves the first committed acquisition',async()=>{
  const {scheduler:s,schedule}=build(['alpha']);await s.settleNextInstant();schedule(2n);const before=snapshot(s);
  await expect(s.settleNextInstant()).rejects.toThrow('duplicate acquisition or source');expect(snapshot(s)).toEqual(before);expect(s.getState()).toHaveLength(1);
 });
});
