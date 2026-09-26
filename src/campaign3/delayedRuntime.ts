/** delayed-public/0.1-candidate: authenticated ordinary planning and disjoint owners. */
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
import {delayedRecord as r,decodeDelayed as decode} from './delayedCodecs';
import {VERSION,STAGES,OBSERVER,ACTOR,OPTIONS,emptyKnowledge,sid,eventId,path,pattern,owner,reads,writes,type DelayedCompiled,compileDelayedInputs} from './delayedModel';
import {evaluateDelayed,delayedOptions,delayedRaw,delayedReasons,delayedDecision,learnDelayed} from './delayedMath';
export function createDelayedRuntime(model:DelayedCompiled,input:Awaited<ReturnType<typeof compileDelayedInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),world=new Map(input.events.map(e=>[e.dueAt,rec(e.payload,1381n)])),random=createCognitiveRandomSession(input.runSeed);let active=false,expected=new Map<bigint,string>();const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive delayed transaction');const stage=STAGES.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage)fail('delayed stage');const [name,phase]=stage!;if(event.phase!==BigInt(phase))fail('delayed phase');const fingerprint=key(scheduledEventValue(event));if(['appraise'].includes(name)){if(originals.get(event.eventId)!==fingerprint)fail('delayed original');}else{if(expected.get(event.eventId)!==fingerprint)fail('delayed generated');expected.delete(event.eventId);}
  const occurrence=(ns=1155)=>typedIdentifier(ns,u(allocateRuntimeId())),paths=reads(name),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p))),read=(p:StatePath)=>{if(!paths.some(x=>pk(x)===pk(p)))return fail('delayed read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/delayed/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])}),write=(changes:{path:StatePath;prior:CanonicalValue|undefined;next:CanonicalValue}[])=>{if(changes.some(c=>!writes(name).some(p=>pk(p)===pk(c.path))))fail('delayed write domain');patch={operations:changes.map(c=>({kind:'set' as const,path:c.path,expected:c.prior?{presence:true as const,value:c.prior}:{presence:false as const},newValue:c.next}))};const applied=applyStatePatch(state,patch,owner(name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  if(name==='appraise'){
   const knowledge=read(path(1385))??emptyKnowledge(),plan=read(path(1394)),out=evaluateDelayed(occurrence(),event.dueAt,knowledge,plan,model.law);outputs.push(out);emit('options',out);
  }else if(name==='options'){const out=delayedOptions(event.payload,occurrence());outputs.push(out);emit('raw',out);
  }else if(name==='raw'){const out=delayedRaw(event.payload,occurrence());outputs.push(out);emit('reasons',out);
  }else if(name==='reasons'){const out=delayedReasons(model,event.payload,occurrence());outputs.push(out);emit('decision',out);
  }else if(name==='decision'){const out=await delayedDecision(event.payload,event.dueAt,occurrence(),input.runSeed);outputs.push(out);randomDrawRecords=[...items(f(out,6n),'list')];emit('intent',out);
  }else if(name==='intent'){const out=r(1391,[occurrence(),event.payload]);outputs.push(out);emit('expression',out);
  }else if(name==='expression'){const out=r(1392,[occurrence(),event.payload]);outputs.push(out);emit('plan',out);
  }else if(name==='plan'){
   const expression=rec(event.payload,1392n),decision=rec(f(rec(f(expression,2n),1391n),2n),1390n),prior=read(path(1394)),chosen=f(decision,7n),choice=OPTIONS.findIndex(x=>key(x)===key(chosen)),id=occurrence();let next=prior;
   if(!prior&&choice<2){
    const a=rec(f(rec(f(rec(f(rec(f(decision,3n),1389n),2n),1388n),2n),1387n),2n),1386n),offer=rec(f(rec(items(f(rec(f(a,3n),1384n),1n),'list')[0],1382n),4n),1380n);
    next=r(1393,[id,u(choice+1),signed(event.dueAt+(choice===1?uint(f(offer,3n)):0n)),f(offer,choice===0?1n:2n)]);write([{path:path(1394),prior,next}]);
   }
   const out=r(1395,[id,expression,list(prior?[prior]:[]),list(next?[next]:[])]);outputs.push(out);emit('attempt',list(next?[next]:[]));
  }else if(name==='attempt'){const out=r(1396,[occurrence(),event.payload]);outputs.push(out);emit('execution',out);
  }else if(name==='execution'){
   const original=world.get(event.dueAt)!,plan=read(path(1394)),prior=read(path(1398));let next=prior;
   if(plan&&!prior&&(f(rec(plan,1393n),3n) as {value:bigint}).value===event.dueAt){const choice=uint(f(rec(plan,1393n),2n));next=r(1397,[signed(event.dueAt),f(original,5n)===true?f(original,choice===1n?6n:7n):q(0,1),u(choice)]);write([{path:path(1398),prior,next}]);}
   const out=r(1399,[occurrence(),signed(event.dueAt),list(next?[next]:[])]);outputs.push(out);emit('observe',list([out,list(plan?[plan]:[])]));
  }else if(name==='observe'){
   const pair=items(event.payload,'list'),truth=rec(pair[0],1399n),original=world.get(event.dueAt)!,offerId=occurrence(),receiptId=occurrence(),offers:CanonicalValue[]=[],receipts:CanonicalValue[]=[];
   if(f(original,3n)===true&&f(original,4n)===true)for(const value of items(f(original,2n),'list'))offers.push(r(1382,[offerId,OBSERVER,signed(event.dueAt),value]));
   const delivery=items(f(truth,3n),'list');
   if(delivery.length&&f(original,8n)===true&&f(original,9n)===true){const mode=uint(f(original,10n)),plan=rec(items(pair[1],'list')[0],1393n),amount=mode===0n?f(rec(delivery[0],1397n),2n):mode===1n?q(0,1):f(plan,4n);receipts.push(r(1383,[receiptId,OBSERVER,signed(event.dueAt),u(1),amount]));}
   outputs.push(...offers,...receipts);emit('learn',list([list(offers),list(receipts)]));
  }else if(name==='learn'){
   const prior=read(path(1385)),before=prior??emptyKnowledge(),pair=items(event.payload,'list'),offers=items(pair[0],'list'),receipts=items(pair[1],'list'),next=learnDelayed(before,offers,receipts);
   if(key(next)!==key(before))write([{path:path(1385),prior,next}]);outputs.push(r(1400,[occurrence(),before,next,pair[0],pair[1]]));
  }else fail('unhandled delayed stage');
  outputs.forEach(v=>decode(enc(v)));return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('delayed child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('delayed child association');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/delayed/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[ACTOR],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:new AuthoritativeState([]),stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:32n,invariants:[state=>{if(expected.size)fail('delayed pending children');model.validateState(state);random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('delayed concurrent settlement');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)random.commit();return result;}finally{active=false;expected.clear();random.close();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:random.committedAddressKeys()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),diagnostic:()=>scheduler.failureDiagnostic};
}
