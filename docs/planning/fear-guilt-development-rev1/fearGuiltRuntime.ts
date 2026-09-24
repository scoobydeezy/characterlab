/** fearGuilt-public/0.2-candidate: authenticated ordinary planning and disjoint owners. */
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
import {fearGuiltRecord as r,decodeFearGuilt as decode} from './fearGuiltCodecs';
import {VERSION,STAGES,HOLDERS,TARGET,INCIDENT,ACTOR,index,sid,eventId,path,pattern,owner,reads,writes,type FearGuiltCompiled,compileFearGuiltInputs} from './fearGuiltModel';
import {judgment,fear,appraise,learn,emptyKnowledge} from './fearGuiltMath';
const instantValue=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('FEAR_GUILT_TIME');return v.value;};
export function createFearGuiltRuntime(model:FearGuiltCompiled,input:Awaited<ReturnType<typeof compileFearGuiltInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),world=new Map(input.events.map(e=>[e.dueAt,rec(e.payload,1166n)])),random=createCognitiveRandomSession(input.runSeed);let active=false,expected=new Map<bigint,string>();const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive fearGuilt transaction');const stage=STAGES.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage)fail('fearGuilt stage');const [name,phase]=stage!;if(event.phase!==BigInt(phase))fail('fearGuilt phase');const fingerprint=key(scheduledEventValue(event));if(['source'].includes(name)){if(originals.get(event.eventId)!==fingerprint)fail('fearGuilt original');}else{if(expected.get(event.eventId)!==fingerprint)fail('fearGuilt generated');expected.delete(event.eventId);}
  const occurrence=(ns=1174)=>typedIdentifier(ns,u(allocateRuntimeId())),paths=reads(name),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p))),read=(p:StatePath)=>{if(!paths.some(x=>pk(x)===pk(p)))return fail('fearGuilt read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/fearGuilt/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])}),write=(changes:{path:StatePath;prior:CanonicalValue|undefined;next:CanonicalValue}[])=>{if(changes.some(c=>!writes(name).some(p=>pk(p)===pk(c.path))))fail('fearGuilt write domain');patch={operations:changes.map(c=>({kind:'set' as const,path:c.path,expected:c.prior?{presence:true as const,value:c.prior}:{presence:false as const},newValue:c.next}))};const applied=applyStatePatch(state,patch,owner(name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  let projection=event.payload;
  if(name==='source'){
   occurrence();emit('private',list([]));emit('infer-a',list([]));emit('infer-b',list([]));
  }else if(name==='private'){
   const source=world.get(event.dueAt)!,obs=r(1167,[occurrence(),signed(event.dueAt),f(source,3n),f(source,4n)]);projection=list([f(source,3n),f(source,4n)]);outputs.push(obs);emit('fear',obs);
  }else if(name.startsWith('infer-')){
   const i=index(name),knowledge=read(path(i))??emptyKnowledge(),truth=model.law===4?f(world.get(event.dueAt)!,2n)===true:undefined;
   if(truth!==undefined)projection=list([truth]);const out=judgment(occurrence(),event.dueAt,i,knowledge,model.law,truth);outputs.push(out);emit(i===0?'appraise-a':'appraise-b',out);
  }else if(name==='fear'){
   const out=fear(occurrence(),event.payload);outputs.push(out);emit('display',out);
  }else if(name.startsWith('appraise-')){
   outputs.push(appraise(occurrence(),event.payload,model.goal));
  }else if(name==='display'){
   const enabled=f(world.get(event.dueAt)!,5n)===true,privateFear=rec(event.payload,1168n),p=f(privateFear,3n),positive=typeof p!=='boolean'&&p.kind==='rational'&&p.numerator>0n;
   projection=list([privateFear,enabled]);const out=r(1169,[occurrence(),signed(event.dueAt),list(enabled?[positive]:[])]);outputs.push(out);emit('observe-a',out);
  }else if(name==='observe-a'||name==='observe-b'){
   const i=index(name),source=world.get(event.dueAt)!,pair=i===1?items(event.payload,'list'):undefined,display=rec(pair?pair[0]:event.payload,1169n),cue=f(source,BigInt(6+i))===true?f(display,3n):list([]),animal=f(source,BigInt(8+i)),possession=f(source,BigInt(10+i));
   projection=list([cue,animal,possession]);const obs=r(1170,[occurrence(),HOLDERS[i],signed(event.dueAt),TARGET,INCIDENT,cue,animal,possession]);outputs.push(obs);
   if(i===0)emit('observe-b',list([display,obs]));else{emit('learn-a',pair![1]);emit('learn-b',obs);}
  }else if(name.startsWith('learn-')){
   const i=index(name),prior=read(path(i)),before=prior??emptyKnowledge(),next=learn(before,event.payload,i,model.law);
   if(key(before)!==key(next))write([{path:path(i),prior,next}]);outputs.push(r(1175,[occurrence(),HOLDERS[i],before,next]));
  }else fail('fearGuilt unknown stage');
  outputs.forEach(v=>decode(enc(v)));return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('fearGuilt child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('fearGuilt child association');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/fearGuilt/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[ACTOR],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:projection,outputProjection:list(outputs),randomDrawRecords,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:new AuthoritativeState([]),stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:32n,invariants:[state=>{if(expected.size)fail('fearGuilt pending children');model.validateState(state);random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('fearGuilt concurrent settlement');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)random.commit();return result;}finally{active=false;expected.clear();random.close();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:random.committedAddressKeys()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),diagnostic:()=>scheduler.failureDiagnostic};
}
