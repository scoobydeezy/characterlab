/** performance-public/0.1-candidate: authenticated ordinary planning and disjoint owners. */
import {canonicalEncode as enc,list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,statePathPatternValue,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,readQ,compileReasonNuclei,appendIdentityContribution} from '../campaign2/cognitiveMath';
import {rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {createCognitiveRandomSession,arbitrationOutput} from '../campaign2/cognitiveArbitration';
import {intentOutput,expressionOutput,planOutput,attemptOutput,chosenData} from '../campaign2/cognitiveChoice';
import {receivingRecord as old} from './receivingCodecs';
import {biographyContext} from './longitudinalMath';
import {performanceRecord as r,decodePerformance as decode} from './performanceCodecs';
import {VERSION,STAGES,OBSERVER,ACTOR,GOAL,sid,eventId,path,pattern,owner,reads,writes,type PerformanceCompiled,compilePerformanceInputs} from './performanceModel';
import {evaluatePerformance,learnPerformanceEvidence} from './performanceMath';
export function createPerformanceRuntime(model:PerformanceCompiled,input:Awaited<ReturnType<typeof compilePerformanceInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),world=new Map(input.events.map(e=>[e.dueAt,rec(e.payload,1295n)])),random=createCognitiveRandomSession(input.runSeed);let active=false,expected=new Map<bigint,string>();const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive performance transaction');const stage=STAGES.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage)fail('performance stage');const [name,phase]=stage!;if(event.phase!==BigInt(phase))fail('performance phase');const fingerprint=key(scheduledEventValue(event));if(['context'].includes(name)){if(originals.get(event.eventId)!==fingerprint)fail('performance original');}else{if(expected.get(event.eventId)!==fingerprint)fail('performance generated');expected.delete(event.eventId);}
  const occurrence=(ns=1183)=>typedIdentifier(ns,u(allocateRuntimeId())),paths=reads(name),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p))),read=(p:StatePath)=>{if(!paths.some(x=>pk(x)===pk(p)))return fail('performance read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/performance/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])}),write=(changes:{path:StatePath;prior:CanonicalValue|undefined;next:CanonicalValue}[])=>{if(changes.some(c=>!writes(name).some(p=>pk(p)===pk(c.path))))fail('performance write domain');patch={operations:changes.map(c=>({kind:'set' as const,path:c.path,expected:c.prior?{presence:true as const,value:c.prior}:{presence:false as const},newValue:c.next}))};const applied=applyStatePatch(state,patch,owner(name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  if(name==='context') {
   const goal=read(path(1297)),plan=read(path(1299)),knowledge=read(path(1303))??r(1300,[list([]),list([])]),out=evaluatePerformance(occurrence(),Number(event.dueAt),goal,plan,knowledge,model.law);outputs.push(out);emit('plan',out);
  } else if(name==='plan') {
   const evaluation=rec(event.payload,1304n),goals=items(f(evaluation,3n),'list'),prior=read(path(1299)),next=goals.length?r(1298,[GOAL,f(evaluation,6n),signed(event.dueAt),prior&&key(f(rec(prior,1298n),2n))===key(f(evaluation,6n))?f(rec(prior,1298n),4n):signed(event.dueAt)]):undefined;
   if(next)write([{path:path(1299),prior,next}]);outputs.push(r(1308,[occurrence(),list(prior?[prior]:[]),list(next?[next]:[]),evaluation]));emit('attempt',evaluation);
  } else if(name==='attempt') {
   const id=occurrence();if(uint(f(rec(event.payload,1304n),6n))>0n)outputs.push(r(1305,[id,event.payload]));emit('execution',event.payload);
  } else if(name==='execution') {
   const original=world.get(event.dueAt)!,evaluation=rec(event.payload,1304n),route=uint(f(evaluation,6n)),open=route===1n?f(original,4n)===true:route===2n?f(original,5n)===true:false,blocked=f(original,6n)===true,competent=f(original,7n)===true,success=route>0n&&open&&!blocked&&competent;
   const truth=r(1306,[occurrence(),signed(event.dueAt),u(route),success,success||f(original,8n)===true,blocked,competent,open]);outputs.push(truth);emit('observe',list([evaluation,truth]));
  } else if(name==='observe') {
   const pair=items(event.payload,'list'),truth=rec(pair[1],1306n),original=world.get(event.dueAt)!,ids=[occurrence(),occurrence(),occurrence(),occurrence()],observations:CanonicalValue[]=[];
   for(const value of items(f(original,3n),'list')){const d=rec(value,1294n),route=Number(uint(f(d,2n)));if(f(d,6n)===true)observations.push(r(1301,[ids[route-1],OBSERVER,signed(event.dueAt),u(route),f(d,3n),f(d,1n),f(d,4n),f(d,5n),u(0)]));}
   const feedback=uint(f(original,11n));
   if(uint(f(truth,3n))>0n&&(f(original,9n)===true||model.law===4))observations.push(r(1301,[ids[2],OBSERVER,signed(event.dueAt),u(3),model.law===4||feedback===0n?f(truth,4n):feedback===2n,u(0),signed(event.dueAt),signed(event.dueAt),f(truth,3n)]));
   const mode=uint(f(original,10n));if(mode>0n)observations.push(r(1301,[ids[3],OBSERVER,signed(event.dueAt),u(4),mode===1n?f(truth,5n):f(truth,5n)!==true,u(0),signed(event.dueAt),signed(event.dueAt),u(0)]));
   outputs.push(...observations);emit('evidence',list([pair[0],list(observations),f(original,2n)]));
  } else if(name==='evidence') {
   const pair=items(event.payload,'list'),out=r(1302,[occurrence(),pair[1]]);outputs.push(out);emit('goal',list([pair[0],out,pair[2]]));emit('learn',out);
  } else if(name==='goal') {
   const pair=items(event.payload,'list'),evaluation=rec(pair[0],1304n),evidence=rec(pair[1],1302n),prior=read(path(1297));let next=prior,cause=0;
   const criterion=items(f(evidence,2n),'list').find(v=>{const o=rec(v,1301n);if(key(f(o,2n))!==key(OBSERVER))fail('goal foreign criterion');return uint(f(o,4n))===4n&&f(o,5n)===true;});
   if(pair[2]===true){if(prior)fail('goal duplicate adoption');next=r(1296,[GOAL,u(1),signed(event.dueAt),list([])]);cause=1;}
   else if(prior&&uint(f(rec(prior,1296n),2n))===1n){if(criterion){next=r(1296,[GOAL,u(2),f(rec(prior,1296n),3n),list([f(rec(criterion,1301n),1n)])]);cause=2;}else if(f(evaluation,7n)===true){next=r(1296,[GOAL,u(3),f(rec(prior,1296n),3n),list([])]);cause=3;}}
   if(next&&(!prior||key(next)!==key(prior)))write([{path:path(1297),prior,next}]);outputs.push(r(1307,[occurrence(),list(prior?[prior]:[]),list(next?[next]:[]),u(cause)]));
  } else if(name==='learn') {
   const prior=read(path(1303)),before=prior??r(1300,[list([]),list([])]),next=learnPerformanceEvidence(before,event.payload);
   if(key(next)!==key(before))write([{path:path(1303),prior,next}]);outputs.push(r(1309,[occurrence(),before,next,event.payload]));
  } else fail('goal unhandled stage');
  outputs.forEach(v=>decode(enc(v)));return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('performance child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('performance child association');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/performance/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[ACTOR],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:new AuthoritativeState([]),stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:32n,invariants:[state=>{if(expected.size)fail('performance pending children');model.validateState(state);random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('performance concurrent settlement');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)random.commit();return result;}finally{active=false;expected.clear();random.close();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:random.committedAddressKeys()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),diagnostic:()=>scheduler.failureDiagnostic};
}
