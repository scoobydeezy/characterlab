import {guardPublicWrapperSettlement} from './publicWrapperQuiescence';
/** disposition-public/0.1-candidate: native task phases and authenticated identity owner. */
import {canonicalEncode as enc,list,text,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,statePathPatternValue,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {chosenData,planOutput,attemptOutput,executionOutput} from '../campaign2/cognitiveChoice';
import {receivingRecord as old} from './receivingCodecs';
import {identityPublicRecord as r} from './identityPublicCodecs';
import {dispositionPublicRecord as d,decodeDispositionPublic as decode} from './dispositionPublicCodecs';
import {deriveDisposition} from './dispositionAdaptation';
import {dispositionReasons,dispositionArbitrate} from './dispositionPublicMath';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {VERSION,sid,actor,eventId,path,pattern,owner,reads,writes,stages,type DispositionCompiled,compileDispositionInputs} from './dispositionPublicModel';
import {taskReasons,taskDecision,taskIntent,expressionTask,qualifyExpression,appendQualification,identityFold,refoldJournal} from './identityPublicMath';
import {OPTIONS} from './longitudinalModel';
export function createDispositionPublicRuntime(model:DispositionCompiled,input:Awaited<ReturnType<typeof compileDispositionInputs>>){
 const law=model.profile.law,originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))]));
 let active=false,expected=new Map<bigint,string>(),committed:string[]=[],pending:string[]=[];
 const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive identity transaction');const stage=stages.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage||event.phase!==BigInt(stage[1]))fail('identity phase');const name=stage![0],fingerprint=key(scheduledEventValue(event));
  if(name==='context'){if(originals.get(event.eventId)!==fingerprint)fail('identity original');}else{if(expected.get(event.eventId)!==fingerprint)fail('identity generated');expected.delete(event.eventId);}
  // Every phase reserves its slot, including forced/no-expression branches.
  allocateRuntimeId();const occurrence=typedIdentifier(1155,u(event.dueAt*100n+BigInt(stages.findIndex(([n])=>n===name)+10))),paths=reads(law,name),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p)));
  const read=(root:number)=>{const p=path(root);if(!paths.some(x=>pk(x)===pk(p)))return fail('identity read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/disposition/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value!;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],draws:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(stages.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])});
  const write=(root:number,next:CanonicalValue)=>{const p=path(root);if(!writes(law,name).some(x=>pk(x)===pk(p)))fail('identity write domain');const prior=state.read(p);patch={operations:[{kind:'set',path:p,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:next}]};const applied=applyStatePatch(state,patch,owner(name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  const at=event.dueAt,isEmpty=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length===0;
  const occ=(offset:number)=>typedIdentifier(1155,u(at*100n+BigInt(offset)));
  if(name==='context'){const original=rec(event.payload,1452n),safe=list([f(original,2n),f(original,3n),f(original,4n)]);outputs.push(f(original,2n));emit('reasons',safe);}
  else if(name==='reasons'){
   const [context,enabled,seed]=items(event.payload,'list'),constitution=read(1457),history=read(1436),a=law==='Refold'?deriveDisposition(history,'Plastic'):readQ(f(rec(read(1458),1454n),1n));
   let out:CanonicalValue=list([]);if(enabled===true){const result=dispositionReasons(Number(at),context,history,model.profile,a,f(rec(context,1429n),6n)===true);out=result.reasons;outputs.push(d(1455,[occurrence,constitution,qValue(a),qValue(identityFold(history).strength),qValue(readQ(f(rec(constitution,1453n),1n)).add(a)),qValue(result.feedback),history,out]),out);}emit('decision',list([out,seed]));
  }
  else if(name==='decision'){const [reasons,seed]=items(event.payload,'list');let out:CanonicalValue=list([]);if(!isEmpty(reasons)){const result=await dispositionArbitrate(Number(at),Number(uint(seed)),reasons);out=result.decision;for(const address of result.addresses){if(committed.includes(address)||pending.includes(address))fail('disposition RNG reuse');pending.push(address);}const resolution=rec(f(rec(out,1431n),3n),409n),chosen=chosenData(resolution);draws=items(f(chosen,9n),'list').map(v=>f(rec(v,422n),5n));const tie=rec(f(chosen,10n),423n);if(uint(f(tie,1n))===2n)draws.push(f(tie,3n));outputs.push(out);}emit('intent',out);}
  else if(name==='intent'){const out=isEmpty(event.payload)?list([]):taskIntent(event.payload,occ(3));if(!isEmpty(out))outputs.push(out);emit('expression',out);}
  else if(name==='expression'){let out:CanonicalValue=list([]);if(!isEmpty(event.payload)){const i=rec(event.payload,1432n),ctx=f(rec(f(rec(f(i,2n),1431n),2n),1430n),2n);out=expressionTask(at,i,ctx,occ(4));outputs.push(out);}emit('attempt',out);emit('qualify',out);}
  else if(name==='attempt'){let attempt:CanonicalValue[]=[];if(!isEmpty(event.payload)){const i=f(rec(f(rec(event.payload,1433n),5n),1432n),3n),d=chosenData(f(rec(i,425n),2n)),count=key(f(d,1n))===key(OPTIONS[0])?1:2,plan=planOutput(typedIdentifier(1139,u(at)),i,old(391,[u(count)]));attempt=[attemptOutput(typedIdentifier(1140,u(at)),plan)];}const out=r(1438,[occurrence,isEmpty(event.payload)?list([]):list([event.payload]),list(attempt)]);outputs.push(out);emit('execution',out);}
  else if(name==='execution'){const attempts=items(f(rec(event.payload,1438n),3n),'list'),count=attempts.length?f(rec(executionOutput(typedIdentifier(1141,u(at)),attempts[0],input.frames[Number(at)-1].permitted),433n),3n):u(0),prior=uint(f(rec(read(1441),1440n),1n));write(1441,r(1440,[u(prior+uint(count))]));outputs.push(r(1439,[occurrence,count]));}
  else if(name==='qualify'){const out=isEmpty(event.payload)?list([]):qualifyExpression(event.payload,'Threshold',typedIdentifier(1138,u(at)));if(!isEmpty(out))outputs.push(out);emit('identity',out);}
  else if(name==='identity'){const prior=read(1436),next=isEmpty(event.payload)?prior:appendQualification(prior,event.payload);quantizationOperations=[...identityFold(next).operations];write(1436,next);outputs.push(r(1437,[occurrence,prior,next]));emit('adapt',prior);}
  else if(name==='adapt'){const history=read(1436),before=law==='Refold'?deriveDisposition(event.payload,'Plastic'):readQ(f(rec(read(1458),1454n),1n)),after=deriveDisposition(history,law==='Refold'?'Plastic':law);if(law!=='Refold')write(1458,d(1454,[qValue(after)]));outputs.push(d(1456,[occurrence,history,qValue(before),qValue(after)]));}
  outputs.forEach(v=>decode(enc(v)));
  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('identity child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('identity child association');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/disposition/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[actor],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:draws,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:input.state,stateAdapter:adapter,handlers:new Map(stages.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:32n,invariants:[state=>{if(expected.size)fail('identity pending children');model.validateState(state);}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('identity concurrent');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();pending=[];try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)committed.push(...pending);return result;}finally{active=false;expected.clear();pending=[];}}
 return guardPublicWrapperSettlement({settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:committed.slice()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(committed.map(text))}),diagnostic:()=>scheduler.failureDiagnostic});
}
