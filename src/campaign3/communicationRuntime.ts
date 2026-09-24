/** communication-public/0.1-candidate: authenticated ordinary planning and disjoint owners. */
import {canonicalEncode as enc,list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,statePathPatternValue,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,compileReasonNuclei} from '../campaign2/cognitiveMath';
import {rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {intentOutput,expressionOutput,planOutput,attemptOutput,chosenData} from '../campaign2/cognitiveChoice';
import {receivingRecord as old} from './receivingCodecs';
import {createCognitiveRandomSession,arbitrationOutput} from '../campaign2/cognitiveArbitration';
import {communicationRecord as r,decodeCommunication as decode} from './communicationCodecs';
import {VERSION,STAGES,HOLDERS,OPTIONS,ACTOR,index,sid,eventId,path,pattern,owner,reads,writes,type CommunicationCompiled,compileCommunicationInputs} from './communicationModel';
import {communicationContext,claim,estimate,learn,emptyKnowledge} from './communicationMath';
const instantValue=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('COMMUNICATION_TIME');return v.value;};
export function createCommunicationRuntime(model:CommunicationCompiled,input:Awaited<ReturnType<typeof compileCommunicationInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),world=new Map(input.events.map(e=>[e.dueAt,rec(e.payload,1069n)])),random=createCognitiveRandomSession(input.runSeed);let active=false,expected=new Map<bigint,string>();const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive communication transaction');const stage=STAGES.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage)fail('communication stage');const [name,phase]=stage!;if(event.phase!==BigInt(phase))fail('communication phase');const fingerprint=key(scheduledEventValue(event));if(['source'].includes(name)){if(originals.get(event.eventId)!==fingerprint)fail('communication original');}else{if(expected.get(event.eventId)!==fingerprint)fail('communication generated');expected.delete(event.eventId);}
  const occurrence=(ns=1168)=>typedIdentifier(ns,u(allocateRuntimeId())),paths=reads(name),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p))),read=(p:StatePath)=>{if(!paths.some(x=>pk(x)===pk(p)))return fail('communication read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/communication/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])}),write=(changes:{path:StatePath;prior:CanonicalValue|undefined;next:CanonicalValue}[])=>{if(changes.some(c=>!writes(name).some(p=>pk(p)===pk(c.path))))fail('communication write domain');patch={operations:changes.map(c=>({kind:'set' as const,path:c.path,expected:c.prior?{presence:true as const,value:c.prior}:{presence:false as const},newValue:c.next}))};const applied=applyStatePatch(state,patch,owner(name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  if(name==='source'){
   outputs.push(r(1079,[occurrence(),signed(event.dueAt),f(world.get(event.dueAt)!,2n)]));emit('observe-private',list([]));
  }else if(name==='observe-private'){
   const source=world.get(event.dueAt)!,obs=r(1070,[occurrence(),HOLDERS[0],signed(event.dueAt),list(f(source,4n)===true?[f(source,3n)]:[])]);outputs.push(obs);emit('learn-private',obs);
  }else if(name==='learn-private'||name==='learn-a'||name==='learn-b'){
   const i=index(name),pair=name==='learn-a'?items(event.payload,'list'):undefined,obs=pair?pair[0]:event.payload,prior=read(path(i)),before=prior??emptyKnowledge(),next=learn(before,obs,i,model.law);
   if(key(before)!==key(next))write([{path:path(i),prior,next}]);outputs.push(r(1080,[occurrence(),HOLDERS[i],before,next]));if(i===0)emit('probe-a',list([]));if(i===1)emit('learn-b',pair![1]);
  }else if(name==='probe-a'||name==='probe-b'){
   const i=index(name),knowledge=read(path(i))??emptyKnowledge();outputs.push(r(1073,[occurrence(),signed(event.dueAt),HOLDERS[i],knowledge,estimate(knowledge,model.law===2)]));emit(i===1?'probe-b':'context',list([]));
  }else if(name==='context'){
   const knowledge=read(path(0))??emptyKnowledge(),context=r(1074,[occurrence(),knowledge,communicationContext(event.dueAt,model.pressure,occurrence)]);outputs.push(context);emit('raw',context);
  }else if(name==='raw'){
   const result=rawSignalOutput(occurrence(1133),f(rec(event.payload,1074n),3n),false,ONE,()=>undefined);quantizationOperations=result.quantizationOperations;outputs.push(result.output);emit('reasons',list([result.output,event.payload]));
  }else if(name==='reasons'){
   const pair=items(event.payload,'list'),out=old(408,[occurrence(1134),pair[0],list(compileReasonNuclei(items(f(rec(pair[0],403n),3n),'set'),f(model.content,5n)))]);outputs.push(out);emit('decision',list([out,pair[1]]));
  }else if(name==='decision'){
   const pair=items(event.payload,'list'),root=typedIdentifier(1135,u(event.dueAt)),out=await arbitrationOutput(root,event.dueAt,pair[0],old(440,[q(1,2),q(1,2)]),random.forResolution(root,pair[0]));outputs.push(out);const data=chosenData(out);randomDrawRecords=items(f(data,9n),'list').map(v=>f(rec(v,422n),5n));const tie=rec(f(data,10n),423n);if(uint(f(tie,1n))===2n)randomDrawRecords.push(f(tie,3n));emit('intent',list([out,pair[1]]));
  }else if(name==='intent'){
   const pair=items(event.payload,'list'),intent=intentOutput(occurrence(1136),pair[0]),out=r(1075,[occurrence(),intent,pair[1]]);outputs.push(intent,out);emit('expression',out);
  }else if(name==='expression'){
   const expression=expressionOutput(occurrence(1137),f(rec(event.payload,1075n),2n)),out=r(1076,[occurrence(),event.payload,expression]);outputs.push(expression,out);emit('plan',out);
  }else if(name==='plan'){
   const expression=rec(event.payload,1076n),intent=f(rec(f(expression,2n),1075n),2n),out=planOutput(occurrence(1139),intent,old(391,[u(1)]));outputs.push(out);emit('attempt',list([out,expression]));
  }else if(name==='attempt'){
   const pair=items(event.payload,'list'),attempt=attemptOutput(occurrence(1140),pair[0]),out=r(1077,[occurrence(),attempt,pair[1]]);outputs.push(attempt,out);emit('execute',out);
  }else if(name==='execute'){
   const attempt=rec(event.payload,1077n),expression=rec(f(attempt,3n),1076n),intent=rec(f(expression,2n),1075n),context=rec(f(intent,3n),1074n),data=chosenData(f(rec(f(intent,2n),425n),2n)),action=key(f(data,1n))===key(OPTIONS[0])?1:2,value=claim(f(context,2n)),delivered=action===1&&items(value,'list').length>0&&f(world.get(event.dueAt)!,5n)===true,out=r(1078,[occurrence(),attempt,u(action),delivered,delivered?value:list([])]);outputs.push(out);emit('observe-a',out);
  }else if(name==='observe-a'||name==='observe-b'){
   const i=index(name),pair=i===2?items(event.payload,'list'):undefined,execution=rec(pair?pair[0]:event.payload,1078n),expression=rec(f(rec(f(execution,2n),1077n),3n),1076n),context=rec(f(rec(f(expression,2n),1075n),3n),1074n),privateClaim=claim(f(context,2n)),access=f(world.get(event.dueAt)!,BigInt(i+5))===true;
   const admitted=model.law===3?privateClaim:model.law===4&&uint(f(execution,3n))===1n&&access?privateClaim:f(execution,4n)===true&&access?f(execution,5n):list([]),obs=r(1070,[occurrence(),HOLDERS[i],signed(event.dueAt),admitted]);outputs.push(obs);if(i===1)emit('observe-b',list([execution,obs]));else emit('learn-a',list([pair![1],obs]));
  }else fail('communication unknown stage');
  outputs.forEach(v=>decode(enc(v)));return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('communication child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('communication child association');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/communication/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[ACTOR],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:new AuthoritativeState([]),stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:32n,invariants:[state=>{if(expected.size)fail('communication pending children');model.validateState(state);random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('communication concurrent settlement');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)random.commit();return result;}finally{active=false;expected.clear();random.close();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:random.committedAddressKeys()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),diagnostic:()=>scheduler.failureDiagnostic};
}
