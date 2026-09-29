/** embarrassment-public/0.1-candidate: authenticated ordinary planning and disjoint owners. */
import {canonicalEncode as enc,list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,statePathPatternValue,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,readQ,compileReasonNuclei,appendIdentityContribution} from '../campaign2/cognitiveMath';
import {rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {createCognitiveRandomSession,arbitrationOutput} from '../campaign2/cognitiveArbitration';
import {intentOutput,expressionOutput,planOutput,attemptOutput,executionOutput,chosenData} from '../campaign2/cognitiveChoice';
import {receivingRecord as old} from './receivingCodecs';
import {biographyContext} from './longitudinalMath';
import {embarrassmentPublicRecord as r} from './embarrassmentPublicCodecs';
import {reappraisalRecord as rr} from './reappraisalCodecs';
import {nativeReasons,appraisal,readHistory,historyValue} from './embarrassmentPublicMath';
import {OPTIONS} from './embarrassment';
import {multisourceBase} from './multisourceModelRecipe';
import {guardPublicWrapperSettlement} from './publicWrapperQuiescence';
import {VERSION,STAGES,OBSERVER,ACTOR,sid,eventId,path,pattern,owner,reads,writes,type EmbarrassmentPublicCompiled,compileEmbarrassmentPublicInputs} from './embarrassmentPublicModel';
import {reappraise,contextKnowledge,emptyKnowledge} from './reappraisalMath';
export function createEmbarrassmentPublicRuntime(model:EmbarrassmentPublicCompiled,input:Awaited<ReturnType<typeof compileEmbarrassmentPublicInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),world=new Map(input.events.map(e=>[e.dueAt,rec(e.payload,1469n)])),random=createCognitiveRandomSession(input.runSeed);let active=false,expected=new Map<bigint,string>();const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive reappraisal transaction');const stage=STAGES.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage)fail('embarrassment stage');const [name,phase]=stage!;if(event.phase!==BigInt(phase))fail('embarrassment phase');const fingerprint=key(scheduledEventValue(event));if(name==='context'){if(originals.get(event.eventId)!==fingerprint)fail('embarrassment original');}else{if(expected.get(event.eventId)!==fingerprint)fail('embarrassment generated');expected.delete(event.eventId);}
  allocateRuntimeId();const at=event.dueAt,occ=(offset:number,ns=1165)=>typedIdentifier(ns,u(at*100n+BigInt(offset))),occurrence=()=>occ(50+STAGES.findIndex(([n])=>n===name)),paths=reads(name),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p))),read=(p:StatePath)=>{if(!paths.some(x=>pk(x)===pk(p)))return fail('embarrassment read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/embarrassment/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])}),write=(changes:{path:StatePath;prior:CanonicalValue|undefined;next:CanonicalValue}[])=>{if(changes.some(c=>!writes(name).some(p=>pk(p)===pk(c.path))))fail('embarrassment write domain');patch={operations:changes.map(c=>({kind:'set' as const,path:c.path,expected:c.prior?{presence:true as const,value:c.prior}:{presence:false as const},newValue:c.next}))};const applied=applyStatePatch(state,patch,owner(name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  if(name==='context'){
   const prior=read(path(1471))!,source=world.get(at)!,goals=at===1n?r(1470,[f(source,11n),f(source,12n),f(source,13n)]):prior;if(key(goals)!==key(prior))write([{path:path(1471),prior,next:goals}]);const out=r(1477,[occurrence(),u(at),goals,f(source,14n)]);outputs.push(out);emit('appraise',out);
  }else if(name==='appraise'){
   const out=appraisal(model.law,model.projection,event.payload,read(path(1474))!,occurrence());outputs.push(out);emit('reasons',out);
  }else if(name==='reasons'){
   const out=r(1479,[occurrence(),event.payload,nativeReasons(model.law,event.payload)]);outputs.push(out);emit('decision',out);
  }else if(name==='decision'){
   const reasons=f(rec(event.payload,1479n),3n),root=typedIdentifier(1135,u(at)),out=await arbitrationOutput(root,at,reasons,multisourceBase().get('task-arbitration'),random.forResolution(root,reasons));
   if(uint(f(rec(f(rec(out,409n),4n),419n),1n))===3n){const chosen=chosenData(out);randomDrawRecords=items(f(chosen,9n),'list').map(v=>f(rec(v,422n),5n));const tie=rec(f(chosen,10n),423n);if(uint(f(tie,1n))===2n)randomDrawRecords.push(f(tie,3n));}
   outputs.push(out);emit('intent',list([event.payload,out]));
  }else if(name==='intent'){
   const [envelope,resolution]=items(event.payload,'list'),chosen=uint(f(rec(f(rec(resolution,409n),4n),419n),1n))===3n,intent=chosen?[intentOutput(occ(7,1136),resolution)]:[];outputs.push(...intent);emit('expression',list([envelope,list(intent)]));
  }else if(name==='expression'){
   const [envelope,intents]=items(event.payload,'list'),is=items(intents,'list');if(is.length)outputs.push(expressionOutput(occ(8,1137),is[0]));emit('plan',list([envelope,intents]));
  }else if(name==='plan'){
   const [envelope,intents]=items(event.payload,'list'),is=items(intents,'list'),plans=is.length?[planOutput(occ(9,1139),is[0],old(391,[u(1)]))]:[];outputs.push(...plans);emit('attempt',list([envelope,intents,list(plans)]));
  }else if(name==='attempt'){
   const [envelope,intents,plans]=items(event.payload,'list'),ps=items(plans,'list'),attempts=ps.length?[attemptOutput(occ(10,1140),ps[0])]:[];outputs.push(...attempts);emit('complete',list([envelope,intents,list(attempts)]));
  }else if(name==='complete'){
   const [envelope,intents,attempts]=items(event.payload,'list'),as=items(attempts,'list'),xs=as.length?[executionOutput(occ(11,1141),as[0],f(world.get(at)!,15n)===true)]:[],completed=xs.length>0&&uint(f(rec(xs[0],433n),3n))===1n,out=r(1480,[occurrence(),intents,attempts,list(xs),completed]),prior=read(path(1476))!,is=items(intents,'list'),participate=is.length>0&&key(f(chosenData(f(rec(is[0],425n),2n)),1n))===key(OPTIONS[1]),next=completed?r(1475,[participate]):prior;
   if(key(next)!==key(prior))write([{path:path(1476),prior,next}]);outputs.push(...xs,out,r(1484,[occ(70),prior,next,out]));emit('display',envelope);
  }else if(name==='display'){
   const app=f(rec(event.payload,1479n),2n),coords=items(f(rec(app,1478n),9n),'list'),out=r(1481,[occurrence(),app,list(f(world.get(at)!,16n)===true&&coords.length?[coords.at(-1)!]:[])]);outputs.push(out);emit('observe',out);
  }else if(name==='observe'){
   const source=world.get(at)!,obs=r(1482,[occurrence(),u(at),list([5n,7n,9n].map(i=>list(f(source,i+1n)===true?[f(source,i)]:[])))]);outputs.push(obs);emit('learn',obs);
  }else if(name==='learn'){
   const obs=rec(event.payload,1482n),prior=read(path(1474))!,history=readHistory(prior),reports=items(f(obs,3n),'list').map(v=>items(v,'list')),next=historyValue(history.map((xs,i)=>reports[i].length?[...xs,{at:Number(at),value:reports[i][0] as boolean}]:xs));if(key(prior)!==key(next))write([{path:path(1474),prior,next}]);outputs.push(r(1483,[occurrence(),obs,prior,next]));
  }else fail('embarrassment unknown stage');
  // Closed constructors refine outputs; the native trace binds each actual stage.
 return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('embarrassment child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('embarrassment child association');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/embarrassment/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[ACTOR],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:input.state,stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:32n,invariants:[state=>{if(expected.size)fail('embarrassment pending children');model.validateState(state);random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('embarrassment concurrent settlement');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)random.commit();return result;}finally{active=false;expected.clear();random.close();}}
 return guardPublicWrapperSettlement({settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:random.committedAddressKeys()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),diagnostic:()=>scheduler.failureDiagnostic});
}
