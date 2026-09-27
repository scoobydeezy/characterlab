import {describe,it,expect} from 'vitest';
import {DeterministicScheduler,type StateAdapter} from '../substrate/scheduler';
import {simInstant} from '../substrate/time';
import {bytesToHex,canonicalEncode,list,unsigned,text,bytes,typedIdentifier} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {prepareRetainedAttributionUse,type UseTrial,type AttributionField} from '../campaign3/retainedAttributionUse';
import type {AttributionTrial} from '../campaign3/contrastiveAttribution';
import {applyQualifiedUnitUse,retainWithUseProtection,type UseProtectedAcquisition} from '../campaign3/useProtectedRetention';
type State={memory:UseProtectedAcquisition[]};
const type=(s:string)=>typedIdentifier(10030n,text('retained-attribution-scheduler-fixture/'+s));
const key=(s:string)=>bytesToHex(canonicalEncode(type(s)));
const adapter:StateAdapter<State>={clone:s=>structuredClone(s),validate:s=>{applyQualifiedUnitUse(s.memory,[],100n);},canonicalValue:s=>list(s.memory.map(a=>list([unsigned(a.id),unsigned(a.acquiredAt),text(a.kind),list(a.units.map(u=>list([text(u.key),u.useProtection,list(u.views.map(bytes))])))])))};
function build(retained=true,unavailable=false,fail=false){
 const initialState:State={memory:[1n,2n].map(id=>({id,acquiredAt:id,kind:'Interoceptive',units:[{key:id===1n?'alpha':'beta',views:[new Uint8Array([20,21])],useProtection:false}]}))};
 const interval=()=>({lower:Q.of(20n),upper:Q.of(21n)});
 const trials:UseTrial[]=[true,false,true,false].map((stroke,i)=>({motion:{kind:'Detached',value:[[0,0],[stroke?1:0,0]]},before:retained&&i===0?{kind:'Retained',address:{acquisition:1n,unit:'alpha'},view:0}:{kind:'Detached',value:interval()},after:{kind:'Detached',value:unavailable&&i===0?null:stroke?{lower:Q.of(30n),upper:Q.of(31n)}:interval()}}));
 const project=<K extends AttributionField>(b:Uint8Array,k:K):AttributionTrial[K]=>{if(k==='motion')throw Error('fixture interval');return {lower:Q.of(BigInt(b[0])),upper:Q.of(BigInt(b[1]))} as AttributionTrial[K];};
 const s=new DeterministicScheduler<State>({initialState,stateAdapter:adapter,maxSettlementWorkPerSimulationInstant:3n,
  handlers:new Map([[key('assess'),({state,instant,allocateRuntimeId})=>{
   const tx=prepareRetainedAttributionUse({memory:state.memory,now:instant,admitted:[{acquisition:1n,unit:'alpha'}],trials},project);
   try{const result=tx.finish(tx.evaluate()),id=allocateRuntimeId();return {nextState:{memory:result.memory},outputs:[list([unsigned(id),text(result.assessment.kind),list(result.consumed.map(a=>list([unsigned(a.acquisition),text(a.unit)])))])],traceContributions:[],emittedEvents:[]};}finally{tx.close();}
  }],[key('retain'),({state,instant})=>({nextState:{memory:retainWithUseProtection(state.memory,instant,{EventContinuant:0,Interoceptive:1}).acquisitions},outputs:[],traceContributions:[],emittedEvents:[]})]]),
  adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',beforeInstant(){},validateRuntimeEmission(){},close(){},beforeCommit(){if(fail)throw Error('use commit failure');},prepare(){throw Error('no terminal batch in this fixture');}}
 });
 for(const [name,at] of [['assess',3n],['retain',4n]] as const)s.schedule({eventTypeId:type(name),dueAt:simInstant(at),phase:130n,payload:list([]),dependencies:list([])});
 return s;
}
const snapshot=(s:ReturnType<typeof build>)=>({state:s.getState(),clock:s.getClock(),queue:s.getPendingQueue(),allocators:s.getAllocatorState(),outputs:s.getOutputs(),trace:s.getCommittedTrace()});
describe('retained attribution actual scheduler transaction fixture',()=>{
 it('RA-A: committed cognitive use changes only later retention, including Unavailable',async()=>{for(const unavailable of [false,true]){const used=build(true,unavailable),detached=build(false,unavailable);for(const s of [used,detached]){await s.settleNextInstant();expect(s.getState().memory).toHaveLength(2);expect(s.getOutputs()).toHaveLength(1);await s.settleNextInstant();}expect(used.getState().memory[0].id).toBe(1n);expect(detached.getState().memory[0].id).toBe(2n);}});
 it('RA-B: late failure rolls back result, protection, allocator, clock, queue and trace',async()=>{for(const unavailable of [false,true]){const s=build(true,unavailable,true),before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow('use commit failure');expect(snapshot(s)).toEqual(before);expect(s.status).toBe('Failed');}});
 it('RA-C: observing the committed result creates no further output or use',async()=>{const s=build();await s.settleNextInstant();const before=snapshot(s);for(let i=0;i<5;i++)s.getOutputs();expect(snapshot(s)).toEqual(before);await s.settleNextInstant();expect(s.getOutputs()).toHaveLength(1);});
});
