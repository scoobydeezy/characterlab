/** identity-belief-public/0.1-candidate: native task phases and authenticated identity owner. */
import {canonicalEncode as enc,list,text,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,statePathPatternValue,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {chosenData,planOutput,attemptOutput,executionOutput} from '../campaign2/cognitiveChoice';
import {receivingRecord as old} from './receivingCodecs';
import {identityPublicRecord as r} from './identityPublicCodecs';
import {identityBeliefPublicRecord as br,decodeIdentityBeliefPublic as decode} from './identityBeliefPublicCodecs';
import {HOLDERS,learnIdentityBelief,estimateIdentityBelief,identityBeliefAppraisal,type IdentityEvidence} from './identityBelief';
import {data} from './biologyPublicData';
import {readQ} from '../campaign2/cognitiveMath';
import {VERSION,sid,actor,eventId,path,pattern,owner,reads,writes,holderOf,evidenceValue,evidence,stateData,beliefState,optionalQ,type BeliefCompiled,compileBeliefInputs} from './identityBeliefPublicModel';
import {taskReasons,taskDecision,taskIntent,expressionTask,qualifyExpression,appendQualification,identityFold,refoldJournal} from './identityPublicMath';
import {guardIdentityBeliefSettlement} from './identityBeliefQuiescence';
import {OPTIONS} from './longitudinalModel';
export function createIdentityBeliefRuntime(model:BeliefCompiled,input:Awaited<ReturnType<typeof compileBeliefInputs>>){
 const family=model.family,originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))]));
 let active=false,expected=new Map<bigint,string>(),committed:string[]=[],pending:string[]=[];
 const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive identity transaction');const stage=model.stages.find(([n])=>key(event.eventTypeId)===key(eventId(family,n)));if(!stage||event.phase!==BigInt(stage[1]))fail('identity phase');const name=stage![0],fingerprint=key(scheduledEventValue(event));
  if(name==='context'){if(originals.get(event.eventId)!==fingerprint)fail('identity original');}else{if(expected.get(event.eventId)!==fingerprint)fail('identity generated');expected.delete(event.eventId);}
  // Every phase reserves its slot, including forced/no-expression branches.
  const occurrence=typedIdentifier(1155,u(allocateRuntimeId())),paths=reads(family,name,model.beliefLaw),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p)));
  const read=(root:number,h=1)=>{const p=path(family,root,h);if(!paths.some(x=>pk(x)===pk(p)))return fail('identity read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/identity/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value!;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],draws:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(model.stages.find(([n])=>n===next)![1]),eventTypeId:eventId(family,next),payload,dependencies:list([])});
  const write=(root:number,next:CanonicalValue,h=1)=>{const p=path(family,root,h);if(!writes(family,name).some(x=>pk(x)===pk(p)))fail('identity write domain');const prior=state.read(p);patch={operations:[{kind:'set',path:p,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:next}]};const applied=applyStatePatch(state,patch,owner(family,name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  const at=event.dueAt,isEmpty=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length===0;
  if(name==='context'){const safe=f(rec(f(rec(event.payload,1444n),1n),1428n),2n);outputs.push(safe);for(const h of [1,2,3])emit('appraise'+h,{kind:'rational',numerator:BigInt(input.goals[Number(at)-1][h-1]),denominator:1n});emit('reasons',safe);}
  else if(name==='reasons'){const ctx=rec(event.payload,1429n),history=read(1436),out=uint(f(ctx,5n))===2n?list([]):taskReasons(at,ctx,history,model.law,occurrence);if(!isEmpty(out))outputs.push(out);emit('decision',out);}
  else if(name==='decision'){let out:CanonicalValue=list([]);if(!isEmpty(event.payload)){const d=await taskDecision(at,input.runSeed[0],event.payload,occurrence);out=d.output;for(const address of d.addresses){if(committed.includes(address)||pending.includes(address))fail('identity RNG reuse');pending.push(address);}const resolution=rec(f(rec(out,1431n),3n),409n),chosen=chosenData(resolution);draws=items(f(chosen,9n),'list').map(v=>f(rec(v,422n),5n));const tie=rec(f(chosen,10n),423n);if(uint(f(tie,1n))===2n)draws.push(f(tie,3n));outputs.push(out);}emit('intent',out);}
  else if(name==='intent'){const out=isEmpty(event.payload)?list([]):taskIntent(event.payload,occurrence);if(!isEmpty(out))outputs.push(out);emit('expression',out);}
  else if(name==='expression'){let out:CanonicalValue=list([]);if(!isEmpty(event.payload)){const i=rec(event.payload,1432n),ctx=f(rec(f(rec(f(i,2n),1431n),2n),1430n),2n);out=expressionTask(at,i,ctx,occurrence);outputs.push(out);}emit('attempt',out);emit('qualify',out);}
  else if(name==='attempt'){let attempt:CanonicalValue[]=[];if(!isEmpty(event.payload)){const i=f(rec(f(rec(event.payload,1433n),5n),1432n),3n),d=chosenData(f(rec(i,425n),2n)),count=key(f(d,1n))===key(OPTIONS[0])?1:2,plan=planOutput(typedIdentifier(1139,u(at)),i,old(391,[u(count)]));attempt=[attemptOutput(typedIdentifier(1140,u(at)),plan)];}const out=r(1438,[occurrence,isEmpty(event.payload)?list([]):list([event.payload]),list(attempt)]);outputs.push(out);emit('execution',out);}
  else if(name==='execution'){const attempts=items(f(rec(event.payload,1438n),3n),'list'),count=attempts.length?f(rec(executionOutput(typedIdentifier(1141,u(at)),attempts[0],input.worlds[Number(at)-1]===true),433n),3n):u(1),prior=uint(f(rec(read(1441),1440n),1n));write(1441,r(1440,[u(prior+uint(count))]));outputs.push(r(1439,[occurrence,count]));}
  else if(name==='qualify'){const out=isEmpty(event.payload)?list([]):qualifyExpression(event.payload,model.law,typedIdentifier(1138,u(at)));if(!isEmpty(out))outputs.push(out);emit('identity',out);for(const h of [1,2,3])emit('receive'+h,out);}
  else if(name==='identity'){const prior=read(1436),base=model.law==='Refold'?refoldJournal(prior):prior,next=isEmpty(event.payload)?base:appendQualification(base,event.payload);quantizationOperations=[...identityFold(next).operations];write(1436,next);outputs.push(r(1437,[occurrence,prior,next]));}
  else if(name.startsWith('receive')){
   const h=holderOf(name),mode=input.channels[Number(at)-1][h-1];let observation:IdentityEvidence|null=null;
   if(!isEmpty(event.payload)){const qualification=rec(event.payload,1434n),contribution=readQ(f(qualification,4n));
    if(uint(f(qualification,3n))===1n&&contribution.numerator!==0n&&mode!==4){const sign=contribution.numerator>0n?1:-1;observation={holder:HOLDERS[h-1],target:'target',proposition:'positive-task-fidelity',ticket:Number(at),polarity:mode===3?0:mode===2?(sign===1?-1:1):sign};}
   }
   const out=br(1448,[u(h),u(at),list(observation?[evidenceValue(observation)]:[])]);outputs.push(out);emit('learn'+h,out);
  }
  else if(name.startsWith('learn')){
   const h=holderOf(name),safe=rec(event.payload,1448n);if(uint(f(safe,1n))!==BigInt(h)||uint(f(safe,2n))!==at)fail('belief receipt owner');
   const obs=items(f(safe,3n),'list'),prior=stateData(read(1447,h),h),history=learnIdentityBelief(HOLDERS[h-1],prior.history,obs.length?evidence(obs[0],h):null,model.beliefLaw);let estimate=estimateIdentityBelief(history,model.beliefLaw);
   if(model.beliefLaw==='StandingAlias'&&h===1){const journal=read(1436),s=identityFold(journal).strength;estimate={value:`${s.numerator}/${s.denominator}`,evidence:items(f(rec(journal,1435n),1n),'list').length};}
   if(model.beliefLaw==='PrivateOracle'&&h!==1)estimate=stateData(read(1447,1),1).estimate;
   const next=beliefState(h,history,estimate);write(1447,next,h);outputs.push(br(1449,[u(h),u(at),next]));
  }
  else if(name.startsWith('appraise')){
   const h=holderOf(name),estimate=stateData(read(1447,h),h).estimate,goal=Number(readQ(event.payload).numerator) as 1|-1,appraisal=identityBeliefAppraisal(estimate,goal);
   outputs.push(br(1450,[u(h),u(at),{kind:'rational',numerator:BigInt(goal),denominator:1n},optionalQ(estimate.value),optionalQ(appraisal.adverse),data(appraisal.affect)]));
  }
  outputs.forEach(v=>decode(enc(v)));
  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('identity child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('identity child association');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/identity/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[actor(family)],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:draws,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:input.state,stateAdapter:adapter,handlers:new Map(model.stages.map(([n])=>[key(eventId(family,n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:40n,invariants:[state=>{if(expected.size)fail('identity pending children');model.validateState(state);}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('identity concurrent');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();pending=[];try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)committed.push(...pending);return result;}finally{active=false;expected.clear();pending=[];}}
 return guardIdentityBeliefSettlement({settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:committed.slice()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(committed.map(text))}),diagnostic:()=>scheduler.failureDiagnostic});
}
