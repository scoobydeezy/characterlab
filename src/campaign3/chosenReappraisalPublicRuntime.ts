/** chosen-reappraisal-public/0.1-candidate: authenticated ordinary planning and disjoint owners. */
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
import {chosenReappraisalPublicRecord as r} from './chosenReappraisalPublicCodecs';
import {reappraisalRecord as rr} from './reappraisalCodecs';
import {nativeReasons} from './chosenReappraisalPublicMath';
import {OPTIONS} from './chosenReappraisal';
import {multisourceBase} from './multisourceModelRecipe';
import {guardPublicWrapperSettlement} from './publicWrapperQuiescence';
import {VERSION,STAGES,OBSERVER,ACTOR,sid,eventId,path,pattern,owner,reads,writes,type ChosenReappraisalPublicCompiled,compileChosenReappraisalPublicInputs} from './chosenReappraisalPublicModel';
import {reappraise,contextKnowledge,emptyKnowledge} from './reappraisalMath';
export function createChosenReappraisalPublicRuntime(model:ChosenReappraisalPublicCompiled,input:Awaited<ReturnType<typeof compileChosenReappraisalPublicInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),world=new Map(input.events.map(e=>[e.dueAt,rec(e.payload,1460n)])),random=createCognitiveRandomSession(input.runSeed);let active=false,expected=new Map<bigint,string>();const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive reappraisal transaction');const stage=STAGES.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage)fail('reappraisal stage');const [name,phase]=stage!;if(event.phase!==BigInt(phase))fail('reappraisal phase');const fingerprint=key(scheduledEventValue(event));if(name==='context'){if(originals.get(event.eventId)!==fingerprint)fail('reappraisal original');}else{if(expected.get(event.eventId)!==fingerprint)fail('reappraisal generated');expected.delete(event.eventId);}
  allocateRuntimeId();const at=event.dueAt,occ=(offset:number,ns=1165)=>typedIdentifier(ns,u(at*100n+BigInt(offset))),occurrence=()=>occ(50+STAGES.findIndex(([n])=>n===name)),paths=reads(name),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p))),read=(p:StatePath)=>{if(!paths.some(x=>pk(x)===pk(p)))return fail('reappraisal read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/reappraisal/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])}),write=(changes:{path:StatePath;prior:CanonicalValue|undefined;next:CanonicalValue}[])=>{if(changes.some(c=>!writes(name).some(p=>pk(p)===pk(c.path))))fail('reappraisal write domain');patch={operations:changes.map(c=>({kind:'set' as const,path:c.path,expected:c.prior?{presence:true as const,value:c.prior}:{presence:false as const},newValue:c.next}))};const applied=applyStatePatch(state,patch,owner(name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  if(name==='context'){
   const prior=read(path(1462))!,source=world.get(at)!,goals=at===1n?r(1461,[f(source,10n),f(source,11n)]):prior;
   if(key(goals)!==key(prior))write([{path:path(1462),prior,next:goals}]);
   const out=r(1467,[occurrence(),u(at),goals,f(source,8n)]);outputs.push(out);emit('appraise',out);
  }else if(name==='appraise'){
   const knowledge=read(path(1029))!,frame=read(path(1031)),out=reappraise(model.appraisalModel,knowledge,frame,at,occ(91));outputs.push(out);emit('reasons',list([event.payload,out]));
  }else if(name==='reasons'){
   const [context,appraisal]=items(event.payload,'list'),ctx=rec(context,1467n),g=rec(f(ctx,3n),1461n),knowledge=read(path(1029))!,result=nativeReasons(model.law,knowledge,[Number(uint(f(g,1n))),Number(uint(f(g,2n)))],Number(at),f(ctx,4n)===true),out=r(1463,[occurrence(),appraisal,context,knowledge,result.eligible,result.reasons]);outputs.push(out);emit('decision',out);
  }else if(name==='decision'){
   const reasons=f(rec(event.payload,1463n),6n),root=typedIdentifier(1135,u(at)),out=await arbitrationOutput(root,at,reasons,multisourceBase().get('task-arbitration'),random.forResolution(root,reasons));
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
   const [envelope,intents,attempts]=items(event.payload,'list'),as=items(attempts,'list'),xs=as.length?[executionOutput(occ(11,1141),as[0],f(world.get(at)!,9n)===true)]:[],completed=xs.length>0&&uint(f(rec(xs[0],433n),3n))===1n,out=r(1466,[occurrence(),intents,attempts,list(xs),completed]);outputs.push(...xs,out);emit('observe',list([envelope,out]));
  }else if(name==='observe'){
   const source=world.get(at)!,obs=rr(1027,[occ(90),OBSERVER,signed(at),f(source,2n),list(uint(f(source,2n))>0n&&f(source,5n)===true?[f(source,4n)]:[]),f(source,7n)===true?f(source,6n):u(0)]);outputs.push(obs);emit('learn',list([...items(event.payload,'list'),obs]));
  }else if(name==='learn'){
   const [envelope,completion,observation]=items(event.payload,'list'),obs=rec(observation,1027n),prior=read(path(1029))!,xs=items(f(rec(prior,1028n),1n),'list'),admitted=items(f(obs,5n),'list').length>0||uint(f(obs,6n))>0n,next=admitted?rr(1028,[list([...xs,obs]),false]):prior;
   if(key(prior)!==key(next))write([{path:path(1029),prior,next}]);outputs.push(r(1465,[occurrence(),prior,next,obs]));emit('frame',list([envelope,completion]));
  }else if(name==='frame'){
   const [envelope,completion]=items(event.payload,'list'),c=rec(completion,1466n),intents=items(f(c,2n),'list'),completed=f(c,5n)===true,prior=read(path(1031)),reframe=intents.length>0&&key(f(chosenData(f(rec(intents[0],425n),2n)),1n))===key(OPTIONS[0]),sources=contextKnowledge(f(rec(envelope,1463n),4n)).sources,next=reframe&&completed&&model.law!=='NoReappraisal'?rr(1030,[u(1),list(sources),signed(at)]):prior;
   if(next&&(!prior||key(next)!==key(prior)))write([{path:path(1031),prior,next}]);outputs.push(r(1464,[occurrence(),list(prior?[prior]:[]),list(next?[next]:[]),list(intents),completed]));
  }else fail('chosen reappraisal unknown stage');
  // Closed constructors refine outputs; the native trace binds each actual stage.
 return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('reappraisal child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('reappraisal child association');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/reappraisal/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[ACTOR],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:input.state,stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:32n,invariants:[state=>{if(expected.size)fail('reappraisal pending children');model.validateState(state);random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('reappraisal concurrent settlement');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)random.commit();return result;}finally{active=false;expected.clear();random.close();}}
 return guardPublicWrapperSettlement({settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:random.committedAddressKeys()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),diagnostic:()=>scheduler.failureDiagnostic});
}
