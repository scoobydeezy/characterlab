/** interpretation-public/0.1-candidate: authenticated ordinary planning and disjoint owners. */
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
import {interpretationRecord as r,decodeInterpretation as decode} from './interpretationCodecs';
import {VERSION,STAGES,HOLDERS,OPTIONS,ACTOR,index,sid,eventId,path,pattern,owner,reads,writes,type InterpretationCompiled,compileInterpretationInputs} from './interpretationModel';
import {interpretationContext,claim,estimate,learn,emptyKnowledge,speakerContext,encodeAssertion,interpret} from './interpretationMath';
const instantValue=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('INTERPRETATION_TIME');return v.value;};
export function createInterpretationRuntime(model:InterpretationCompiled,input:Awaited<ReturnType<typeof compileInterpretationInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),world=new Map(input.events.map(e=>[e.dueAt,rec(e.payload,1115n)])),random=createCognitiveRandomSession(input.runSeed);let active=false,expected=new Map<bigint,string>();const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive interpretation transaction');const stage=STAGES.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage)fail('interpretation stage');const [name,phase]=stage!;if(event.phase!==BigInt(phase))fail('interpretation phase');const fingerprint=key(scheduledEventValue(event));if(['source'].includes(name)){if(originals.get(event.eventId)!==fingerprint)fail('interpretation original');}else{if(expected.get(event.eventId)!==fingerprint)fail('interpretation generated');expected.delete(event.eventId);}
  const occurrence=(ns=1171)=>typedIdentifier(ns,u(allocateRuntimeId())),paths=reads(name),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p))),read=(p:StatePath)=>{if(!paths.some(x=>pk(x)===pk(p)))return fail('interpretation read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/interpretation/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])}),write=(changes:{path:StatePath;prior:CanonicalValue|undefined;next:CanonicalValue}[])=>{if(changes.some(c=>!writes(name).some(p=>pk(p)===pk(c.path))))fail('interpretation write domain');patch={operations:changes.map(c=>({kind:'set' as const,path:c.path,expected:c.prior?{presence:true as const,value:c.prior}:{presence:false as const},newValue:c.next}))};const applied=applyStatePatch(state,patch,owner(name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  if(name==='source'){
   outputs.push(r(1125,[occurrence(),signed(event.dueAt),f(world.get(event.dueAt)!,2n)]));emit('observe-private',list([]));
  }else if(name==='observe-private'){
   const source=world.get(event.dueAt)!,obs=r(1116,[occurrence(),HOLDERS[0],signed(event.dueAt),list(f(source,4n)===true?[f(source,3n)]:[]),f(source,4n)===true?f(source,8n):u(0)]);outputs.push(obs);emit('learn-private',obs);
  }else if(name==='learn-private'||name==='learn-a'||name==='learn-b'){
   const i=index(name),pair=name==='learn-a'?items(event.payload,'list'):undefined,obs=pair?pair[0]:event.payload,prior=read(path(i)),before=prior??emptyKnowledge(),next=learn(before,obs,i,model.law);
   if(key(before)!==key(next))write([{path:path(i),prior,next}]);outputs.push(r(1126,[occurrence(),HOLDERS[i],before,next]));if(i===0)emit('probe-a',list([]));if(i===1)emit('learn-b',pair![1]);
  }else if(name==='probe-a'||name==='probe-b'){
   const i=index(name),knowledge=read(path(i))??emptyKnowledge();outputs.push(r(1119,[occurrence(),signed(event.dueAt),HOLDERS[i],knowledge,estimate(knowledge,model.law===5)]));emit(i===1?'probe-b':'context',list([]));
  }else if(name==='context'){
   const knowledge=read(path(0))??emptyKnowledge(),context=r(1120,[occurrence(),knowledge,interpretationContext(event.dueAt,model.pressure,occurrence)]);outputs.push(context);emit('raw',context);
  }else if(name==='raw'){
   const result=rawSignalOutput(occurrence(1133),f(rec(event.payload,1120n),3n),false,ONE,()=>undefined);quantizationOperations=result.quantizationOperations;outputs.push(result.output);emit('reasons',list([result.output,event.payload]));
  }else if(name==='reasons'){
   const pair=items(event.payload,'list'),out=old(408,[occurrence(1134),pair[0],list(compileReasonNuclei(items(f(rec(pair[0],403n),3n),'set'),f(model.content,5n)))]);outputs.push(out);emit('decision',list([out,pair[1]]));
  }else if(name==='decision'){
   const pair=items(event.payload,'list'),root=typedIdentifier(1135,u(event.dueAt)),out=await arbitrationOutput(root,event.dueAt,pair[0],old(440,[q(1,2),q(1,2)]),random.forResolution(root,pair[0]));outputs.push(out);const data=chosenData(out);randomDrawRecords=items(f(data,9n),'list').map(v=>f(rec(v,422n),5n));const tie=rec(f(data,10n),423n);if(uint(f(tie,1n))===2n)randomDrawRecords.push(f(tie,3n));emit('intent',list([out,pair[1]]));
  }else if(name==='intent'){
   const pair=items(event.payload,'list'),intent=intentOutput(occurrence(1136),pair[0]),context=rec(pair[1],1120n),purpose=key(f(chosenData(pair[0]),1n))===key(OPTIONS[0])?1:2,assertion=purpose===1?claim(f(context,2n)):list([]),out=r(1121,[occurrence(),intent,context,u(purpose),assertion]);outputs.push(intent,out);emit('expression',out);
  }else if(name==='expression'){
   const expression=expressionOutput(occurrence(1137),f(rec(event.payload,1121n),2n)),out=r(1122,[occurrence(),event.payload,expression]);outputs.push(expression,out);emit('plan',out);
  }else if(name==='plan'){
   const expression=rec(event.payload,1122n),intent=f(rec(f(expression,2n),1121n),2n),out=planOutput(occurrence(1139),intent,old(391,[u(1)]));outputs.push(out);emit('attempt',list([out,expression]));
  }else if(name==='attempt'){
   const pair=items(event.payload,'list'),attempt=attemptOutput(occurrence(1140),pair[0]),out=r(1123,[occurrence(),attempt,pair[1]]);outputs.push(attempt,out);emit('execute',out);
  }else if(name==='execute'){
   const attempt=rec(event.payload,1123n),expression=rec(f(attempt,3n),1122n),intent=rec(f(expression,2n),1121n),data=chosenData(f(rec(f(intent,2n),425n),2n)),action=key(f(data,1n))===key(OPTIONS[0])?1:2,value=encodeAssertion(f(intent,5n),speakerContext(f(rec(f(intent,3n),1120n),2n))),delivered=items(value,'list').length>0&&f(world.get(event.dueAt)!,5n)===true,out=r(1124,[occurrence(),attempt,u(action),delivered,delivered?value:list([])]);outputs.push(out);emit('observe-a',out);
  }else if(name==='observe-a'||name==='observe-b'){
   const i=index(name),pair=i===2?items(event.payload,'list'):undefined,execution=rec(pair?pair[0]:event.payload,1124n),source=world.get(event.dueAt)!,access=f(source,BigInt(i+5))===true,context=f(source,BigInt(i+10))===true?f(source,BigInt(i+8)):u(0),admitted=f(execution,4n)===true&&access?f(execution,5n):list([]),obs=r(1129,[occurrence(),HOLDERS[i],signed(event.dueAt),admitted,context]);outputs.push(obs);if(i===1)emit('observe-b',list([execution,obs]));else emit('interpret-a',list([pair![1],obs,execution]));
  }else if(name==='interpret-a'||name==='interpret-b'){
   const i=index(name),pair=items(event.payload,'list'),execution=rec(pair[2],1124n),intent=rec(f(rec(f(rec(f(execution,2n),1123n),3n),1122n),2n),1121n),meaning=interpret(pair[i===1?0:1],model.law,occurrence(),model.law===3?f(intent,5n):undefined);outputs.push(meaning);if(i===1)emit('interpret-b',list([meaning,pair[1],execution]));else emit('learn-a',list([pair[0],meaning]));
  }else fail('interpretation unknown stage');
  outputs.forEach(v=>decode(enc(v)));return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('interpretation child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('interpretation child association');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/interpretation/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[ACTOR],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:new AuthoritativeState([]),stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:32n,invariants:[state=>{if(expected.size)fail('interpretation pending children');model.validateState(state);random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('interpretation concurrent settlement');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)random.commit();return result;}finally{active=false;expected.clear();random.close();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:random.committedAddressKeys()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),diagnostic:()=>scheduler.failureDiagnostic};
}
