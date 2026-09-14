import {describe,it,expect} from 'vitest';
import {DeterministicScheduler,type EventEmission,type StateAdapter} from '../substrate/scheduler';
import {bytesToHex,canonicalEncode,list,text,typedIdentifier,unsigned} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';

// Scheduler expressibility fixture only. These strings are not public episode IDs,
// and the append-only receipt deliberately implements no psychological effect law.
type Episode={key:string;at:bigint;content:string};
type Receipt={target:string;at:bigint};
type State={episodes:Episode[];history:Receipt[]};
const type=(name:string)=>typedIdentifier(10030n,text('consolidation-barrier-fixture/'+name));
const key=(name:string)=>bytesToHex(canonicalEncode(type(name)));
const adapter:StateAdapter<State>={
 clone:s=>({episodes:s.episodes.map(e=>({...e})),history:s.history.map(h=>({...h}))}),
 validate:s=>{
  if(new Set(s.episodes.map(e=>e.key)).size!==s.episodes.length)throw Error('duplicate episode');
  for(const h of s.history){const e=s.episodes.find(e=>e.key===h.target);if(!e||e.at>h.at)throw Error('orphan or future base');}
 },
 canonicalValue:s=>list([list(s.episodes.map(e=>list([text(e.key),unsigned(e.at),text(e.content)]))),list(s.history.map(h=>list([text(h.target),unsigned(h.at)])))])
};
function build(options:{sameInstant?:boolean;reverse?:boolean;noBase?:boolean;failFinish?:boolean;noOutcome?:boolean}={}){
 const observed:State[]=[];
 const emit=(name:string,at:bigint,phase=140n):EventEmission=>({dueAt:simInstant(at),phase,eventTypeId:type(name),payload:text('retained-selection'),dependencies:list([])});
 const s=new DeterministicScheduler<State>({initialState:{episodes:[],history:[]},stateAdapter:adapter,maxSettlementWorkPerSimulationInstant:3n,
  handlers:new Map([[key('prepare'),({state,instant})=>({nextState:state,outputs:[],traceContributions:[],emittedEvents:
   (options.reverse?['consolidate','form']:['form','consolidate']).filter(n=>!(n==='form'&&options.noBase)&&!(n==='consolidate'&&options.noOutcome)).map(n=>emit(n,n==='form'||options.sameInstant?instant:2n))})]]),
  adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',beforeInstant(){},beforeCommit(){},close(){},validateRuntimeEmission(){},
   prepare(events,prior,at){
    const names=events.map(e=>['form','consolidate'].find(n=>key(n)===bytesToHex(canonicalEncode(e.eventTypeId))));
    if(names.some(n=>!n)||new Set(names).size!==names.length)throw Error('invalid batch');
    const pendingBase=names.includes('form')?{key:'retained-selection',at,content:'acquisition evidence'}:undefined;
    // Validate the composition from declared batch inputs and B0, never a sibling write.
    const target=prior.episodes.find(e=>e.key==='retained-selection')??pendingBase;
    if(names.includes('consolidate')&&!target)throw Error('unencoded target');
    let formed=false,consolidated=false;
    return {
     execute({event,state,allocateRuntimeId}){
      observed.push(adapter.clone(state));allocateRuntimeId();
      const name=names[events.findIndex(e=>e.eventId===event.eventId)]!;
      if(name==='form')formed=true;else consolidated=true;
      return {nextState:state,outputs:[text(name)],traceContributions:[],emittedEvents:[]};
     },
     finish(){
      if(options.failFinish&&consolidated)throw Error('late consolidation failure');
      return {episodes:formed?[...prior.episodes,pendingBase!]:prior.episodes,history:consolidated?[...prior.history,{target:target!.key,at}]:prior.history};
     }
    };
   }
  }
 });
 s.schedule(emit('prepare',1n,130n));return {s,observed};
}
const snapshot=(s:DeterministicScheduler<State>)=>({state:s.getState(),clock:s.getClock(),queue:s.getPendingQueue(),allocators:s.getAllocatorState(),outputs:s.getOutputs(),trace:s.getCommittedTrace()});
describe('accepted B: actual scheduler composition feasibility, fixture scope',()=>{
 it('CB-A: a later outcome leaves a durable base in the preceding committed instant',async()=>{
  const {s}=build();await s.settleNextInstant();const bytes=canonicalEncode(adapter.canonicalValue(s.getState()));
  expect(s.getState()).toEqual({episodes:[{key:'retained-selection',at:1n,content:'acquisition evidence'}],history:[]});
  const initial=s.getState().episodes;await s.settleNextInstant();expect(s.getState().episodes).toEqual(initial);expect(s.getState().history).toEqual([{target:'retained-selection',at:2n}]);
  expect(canonicalEncode(adapter.canonicalValue({...s.getState(),history:[]}))).toEqual(bytes);
 });
 it('CB-B: no outcome does not defer base formation',async()=>{const {s}=build({noOutcome:true});await s.settleNextInstant();expect(s.getState().episodes).toHaveLength(1);expect(s.getState().history).toEqual([]);expect(s.getPendingQueue()).toEqual([]);});
 it('CB-C: same-instant sibling order changes neither base bytes nor history and exposes only B0',async()=>{
  const a=build({sameInstant:true}),b=build({sameInstant:true,reverse:true});await a.s.settleNextInstant();await b.s.settleNextInstant();
  expect(a.s.getState()).toEqual(b.s.getState());expect(a.s.getState().episodes).toHaveLength(1);expect(a.s.getState().history).toHaveLength(1);
  expect(a.observed).toEqual([{episodes:[],history:[]},{episodes:[],history:[]}]);expect(b.observed).toEqual(a.observed);
  expect(a.s.getOutputs()).toEqual([text('form'),text('consolidate')]);
 });
 it('CB-D: absent encoding rejects without creating an original',async()=>{const {s}=build({sameInstant:true,noBase:true}),before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow('unencoded target');expect(snapshot(s)).toEqual(before);});
 it('CB-E: late same-instant failure rolls back base, history, queue, outputs and allocations',async()=>{const {s}=build({sameInstant:true,failFinish:true}),before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow('late consolidation failure');expect(snapshot(s)).toEqual(before);});
 it('CB-F: failure of a later consolidation preserves the earlier committed base',async()=>{const {s}=build({failFinish:true});await s.settleNextInstant();const before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow('late consolidation failure');expect(snapshot(s)).toEqual(before);expect(s.getState().episodes).toHaveLength(1);});
});
