/** person-goal-public/0.1-candidate: authenticated ordinary planning and disjoint owners. */
import {canonicalEncode as enc,list,text,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,statePathPatternValue,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {personGoalRecord as r,decodePersonGoal as decode} from './personGoalCodecs';
import {VERSION,STAGES,HOLDERS,TARGET,INCIDENT,ACTOR,goalPath,index,sid,eventId,path,pattern,owner,reads,writes,type PersonGoalCompiled,compilePersonGoalInputs} from './personGoalModel';
import {judgment,plan,destinations,appraise,learn,emptyKnowledge} from './personGoalMath';
export function createPersonGoalRuntime(model:PersonGoalCompiled,input:Awaited<ReturnType<typeof compilePersonGoalInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),world=new Map(input.events.map(e=>[e.dueAt,rec(e.payload,1179n)])),random=createCognitiveRandomSession(input.runSeed);let active=false,expected=new Map<bigint,string>();const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive personGoal transaction');const stage=STAGES.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage)fail('personGoal stage');const [name,phase]=stage!;if(event.phase!==BigInt(phase))fail('personGoal phase');const fingerprint=key(scheduledEventValue(event));if(['source'].includes(name)){if(originals.get(event.eventId)!==fingerprint)fail('personGoal original');}else{if(expected.get(event.eventId)!==fingerprint)fail('personGoal generated');expected.delete(event.eventId);}
  const occurrence=(ns=1175)=>typedIdentifier(ns,u(allocateRuntimeId())),paths=reads(name,model.law),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p))),read=(p:StatePath)=>{if(!paths.some(x=>pk(x)===pk(p)))return fail('personGoal read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/personGoal/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])}),write=(changes:{path:StatePath;prior:CanonicalValue|undefined;next:CanonicalValue}[])=>{if(changes.some(c=>!writes(name).some(p=>pk(p)===pk(c.path))))fail('personGoal write domain');patch={operations:changes.map(c=>({kind:'set' as const,path:c.path,expected:c.prior?{presence:true as const,value:c.prior}:{presence:false as const},newValue:c.next}))};const applied=applyStatePatch(state,patch,owner(name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  let projection=event.payload;
  if(name==='source'){
   occurrence();emit('private',list([]));emit('infer-a',list([]));emit('infer-b',list([]));emit('adopt',f(world.get(event.dueAt)!,2n));
  }else if(name==='private'){
   const mode=f(world.get(event.dueAt)!,3n),out=r(1180,[occurrence(),signed(event.dueAt),mode]);projection=mode;outputs.push(out);emit('plan',out);
  }else if(name==='adopt'){
   const id=occurrence(),prior=read(goalPath),goal=prior??r(1191,[id,TARGET,signed(event.dueAt),event.payload]);if(!prior)write([{path:goalPath,prior,next:goal}]);outputs.push(goal);
  }else if(name.startsWith('infer-')){
   const i=index(name),knowledge=read(path(i))??emptyKnowledge(),oracle=model.law===4?read(goalPath):undefined,out=judgment(occurrence(),event.dueAt,i,knowledge,model.law,oracle);outputs.push(out);emit(i===0?'appraise-a':'appraise-b',out);
  }else if(name.startsWith('appraise-')){
   outputs.push(appraise(occurrence(),event.payload,model.goal));
  }else if(name==='plan'){
   const out=plan(occurrence(),event.dueAt,read(goalPath),event.payload);outputs.push(out);emit('attempt',out);
  }else if(name==='attempt'){
   const out=r(1190,[occurrence(),event.payload]);outputs.push(out);emit('execute',out);
  }else if(name==='execute'){
   const attempt=rec(event.payload,1190n),route=Number(uint(f(rec(f(attempt,2n),1181n),4n))),enabled=f(world.get(event.dueAt)!,4n)===true,success=route!==0&&enabled;
   projection=list([attempt,enabled]);const out=r(1182,[occurrence(),attempt,success,list(success&&route>1?destinations(route).map(u):[])]);outputs.push(out);emit('observe-a',out);
  }else if(name==='observe-a'||name==='observe-b'){
   const i=index(name),source=world.get(event.dueAt)!,pair=i===1?items(event.payload,'list'):undefined,execution=rec(pair?pair[0]:event.payload,1182n),route=Number(uint(f(rec(f(rec(f(execution,2n),1190n),2n),1181n),4n))),mirror=f(source,BigInt(9+i))===true;
   const displayed=mirror&&route>1?(route%2===0?route+1:route-1):route,action=list(route&&f(source,BigInt(5+i))===true?[u(displayed)]:[]),outcome=f(source,BigInt(7+i))===true?f(execution,4n):list([]);
   projection=list([action,outcome]);const obs=r(1183,[occurrence(),HOLDERS[i],signed(event.dueAt),TARGET,INCIDENT,action,outcome]);outputs.push(obs);
   if(i===0)emit('observe-b',list([execution,obs]));else{emit('learn-a',pair![1]);emit('learn-b',obs);}
  }else if(name.startsWith('learn-')){
   const i=index(name),prior=read(path(i)),before=prior??emptyKnowledge(),next=learn(before,event.payload,i,model.law);if(key(before)!==key(next))write([{path:path(i),prior,next}]);outputs.push(r(1188,[occurrence(),HOLDERS[i],before,next]));
  }else fail('personGoal unknown stage');
  outputs.forEach(v=>decode(enc(v)));return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('personGoal child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('personGoal child association');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/personGoal/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[ACTOR],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:projection,outputProjection:list(outputs),randomDrawRecords,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:new AuthoritativeState([]),stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:32n,invariants:[state=>{if(expected.size)fail('personGoal pending children');model.validateState(state);random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('personGoal concurrent settlement');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)random.commit();return result;}finally{active=false;expected.clear();random.close();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:random.committedAddressKeys()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),diagnostic:()=>scheduler.failureDiagnostic};
}
