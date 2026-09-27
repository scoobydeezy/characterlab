import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {associationCandidate} from '../campaign3/encodingAccessMath';
import {retainGraphByStrength} from '../campaign3/strengthGraphRetention';
import {DeterministicScheduler,type StateAdapter,type EventEmission,type SchedulerSnapshot} from '../substrate/scheduler';
import {bytesToHex,canonicalEncode,list,text,typedIdentifier,rational} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
const z=Q.of(0n),q=(n:number)=>Q.of(BigInt(n),100n);
type State={keys:string[];weights:Q[][];peer:number};
const initial=():State=>({keys:['a','b','c'],weights:[[z,q(80),z],[z,z,z],[z,z,z]],peer:0});
const type=(name:string)=>typedIdentifier(10030n,text('strength-settlement-fixture/'+name));
const key=(name:string)=>bytesToHex(canonicalEncode(type(name)));
const adapter:StateAdapter<State>={clone:s=>({keys:[...s.keys],weights:s.weights.map(r=>r.map(v=>Q.of(v.numerator,v.denominator))),peer:s.peer}),validate:s=>{retainGraphByStrength(s.keys,s.weights,100n,{nodes:32,edges:992});},canonicalValue:s=>list([list(s.keys.map(text)),list(s.weights.map(row=>list(row.map(v=>rational(v.numerator,v.denominator))))),text(String(s.peer))])};
function build(capacity:number,fail=false,reverse=false,saved?:SchedulerSnapshot<State>){
 if(saved&&saved.status!=='Active')throw Error('fixture cannot restore failed run');
 const reads:State[]=[];
 const emit=(name:string,at:bigint):EventEmission=>({dueAt:simInstant(at),phase:name==='prepare'?130n:140n,eventTypeId:type(name),payload:list([]),dependencies:list([])});
 const s=new DeterministicScheduler<State>({initialState:saved?.state??initial(),initialClock:saved?.clock,initialAllocators:saved?.allocators,initialQueue:saved?.queue,initialCommittedTrace:saved?.committedTrace,initialOutputs:saved?.outputs,stateAdapter:adapter,maxSettlementWorkPerSimulationInstant:4n,
  handlers:new Map([[key('prepare'),({state,instant,allocateRuntimeId})=>{allocateRuntimeId();return {nextState:state,outputs:[text('fixture preparation')],traceContributions:[],emittedEvents:(reverse?['peer','graph']:['graph','peer']).map(n=>emit(n,instant))};}]]),
  adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',beforeInstant(){},beforeCommit(){},close(){},validateRuntimeEmission(){},
   prepare(events,prior){
    if(events.length!==2||new Set(events.map(e=>bytesToHex(canonicalEncode(e.eventTypeId)))).size!==2||events.some(e=>![key('graph'),key('peer')].includes(bytesToHex(canonicalEncode(e.eventTypeId)))))throw Error('fixture batch');
    // Fixed fixture coactivation, applied once to the complete prior graph. This
    // does not specify public evidence aggregation or source authorization.
    const domain=['a','b','c'];
    const padded=domain.map(a=>domain.map(b=>{const i=prior.keys.indexOf(a),j=prior.keys.indexOf(b);return i<0||j<0?z:prior.weights[i][j];}));
    const learned=associationCandidate(domain,padded,[z,Q.of(1n),Q.of(1n)],{scale:100n,eta:q(5),lambda:z,elapsed:z}).values;
    const retained=retainGraphByStrength(domain,learned,100n,{nodes:3,edges:capacity});
    let count=0;
    return {execute({state}){reads.push(adapter.clone(state));count++;return {nextState:state,outputs:[text('fixture participant')],traceContributions:[],emittedEvents:[]};},finish(){if(count!==2)throw Error('fixture missing execution');if(fail)throw Error('graph late failure');return {keys:[...retained.keys],weights:retained.weights.map(r=>[...r]),peer:prior.peer+1};}};
   }
  }
 });const schedule=(at:bigint)=>s.schedule(emit('prepare',at));if(!saved)schedule(1n);return {s,reads,schedule};
}
const snapshot=(s:DeterministicScheduler<State>)=>({state:s.getState(),clock:s.getClock(),queue:s.getPendingQueue(),allocators:s.getAllocatorState(),outputs:s.getOutputs(),trace:s.getCommittedTrace()});
describe('strength graph actual scheduler fixture',()=>{
 it('SS-A: both terminal participants read B0; one result commits learning and scarcity',async()=>{const {s,reads}=build(1);await s.settleNextInstant();expect(reads).toEqual([initial(),initial()]);expect(s.getState()).toEqual({keys:['a','b'],weights:[[z,q(80)],[z,z]],peer:1});});
 it('SS-B: participant order preserves final graph and peer state',async()=>{const a=build(1),b=build(1,false,true);await a.s.settleNextInstant();await b.s.settleNextInstant();expect(a.s.getState()).toEqual(b.s.getState());});
 it('SS-C: late failure rolls back learning, loss, peer state, allocations and committed output',async()=>{const {s}=build(0,true),before=snapshot(s);await expect(s.settleNextInstant()).rejects.toThrow('graph late failure');expect(snapshot(s)).toEqual(before);});
 it('SS-D: zero capacity commits empty learned graph with successful peer work',async()=>{const {s}=build(0);await s.settleNextInstant();expect(s.getState()).toEqual({keys:[],weights:[],peer:1});expect(s.getOutputs()).toHaveLength(3);});
 it('SS-E: actual uniform EAM weakening preserves order or collapses it to ties',()=>{
  for(let low=1;low<10;low++)for(let high=low+1;high<=10;high++)for(const lambda of [1n,4n,9n]){
   const w=[[z,Q.of(BigInt(high),10n),z,z],[z,z,z,z],[z,z,z,Q.of(BigInt(low),10n)],[z,z,z,z]];
   const result=associationCandidate(['a','b','c','d'],w,[z,z,z,z],{scale:10n,eta:z,lambda:Q.of(lambda),elapsed:Q.of(1n)});
   expect(result.rows[0].exact[1].compare(result.rows[2].exact[3])).toBeGreaterThan(0);
   expect(result.values[0][1].compare(result.values[2][3])).toBeGreaterThanOrEqual(0);
  }
 });
 it('SS-F: active quiescent snapshot continuation reproduces all committed surfaces after loss',async()=>{
  const direct=build(1);await direct.s.settleNextInstant();direct.schedule(2n);
  const saved=direct.s.exportQuiescentSnapshot(),restored=build(1,false,false,saved);
  await direct.s.settleNextInstant();await restored.s.settleNextInstant();
  expect(snapshot(restored.s)).toEqual(snapshot(direct.s));
  // Trusted in-memory continuation, not canonical save/load or public replay admission.
 });
});
