/** development-public/0.1-candidate: independent native phase, learning and formation owners. */
import {guardPublicWrapperSettlement} from './publicWrapperQuiescence';
import {list,text,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,statePathPatternValue,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {chosenData} from '../campaign2/cognitiveChoice';
import {identityPublicRecord as old} from './identityPublicCodecs';
import {developmentPublicRecord as r} from './developmentPublicCodecs';
import {dispositionReasons,dispositionArbitrate} from './dispositionPublicMath';
import {ZERO,ONE,readQ,qValue} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {developmentalGain} from './developmentComponent';
import {VERSION,sid,actor,eventId,path,pattern,owner,reads,writes,stages,type DevelopmentCompiled,compileDevelopmentInputs} from './developmentPublicModel';
import {taskIntent,expressionTask,qualifyExpression,appendQualification,identityFold} from './identityPublicMath';
export function createDevelopmentPublicRuntime(model:DevelopmentCompiled,input:Awaited<ReturnType<typeof compileDevelopmentInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))]));
 let active=false,expected=new Map<bigint,string>(),committed:string[]=[],pending:string[]=[];
 const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive development transaction');const stage=stages.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage||event.phase!==BigInt(stage[1]))fail('development phase');const name=stage![0],fingerprint=key(scheduledEventValue(event));
  if(name==='development'){if(originals.get(event.eventId)!==fingerprint)fail('development original');}else{if(expected.get(event.eventId)!==fingerprint)fail('development generated');expected.delete(event.eventId);}
  allocateRuntimeId();const paths=reads(name),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p)));
  const read=(root:number)=>{const p=path(root);if(!paths.some(x=>pk(x)===pk(p)))return fail('development read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/development/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value!;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],draws:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(stages.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])});
  const write=(root:number,next:CanonicalValue)=>{const p=path(root);if(!writes(name).some(x=>pk(x)===pk(p)))fail('development write domain');const prior=nextState.read(p),one:StatePatch={operations:[{kind:'set',path:p,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:next}]};const applied=applyStatePatch(nextState,one,owner(name),model.authority);nextState=applied.state;patch={operations:[...patch.operations,...one.operations]};diffs=[...diffs,...applied.diffs];};
  const at=event.dueAt,isEmpty=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length===0,occ=(offset:number)=>typedIdentifier(1155,u(at*100n+BigInt(offset)));
  if(name==='development'){
   const x=rec(event.payload,1494n),prior=uint(f(rec(read(1500),1495n),1n)),phase=uint(f(x,2n));if(phase<prior)fail('development phase reversal');write(1500,r(1495,[u(phase)]));
   emit('context',list([f(x,9n),f(x,8n),f(x,10n)]));emit('exercise',list([f(x,3n),f(x,4n),f(x,5n),f(x,6n),f(x,7n),uint(f(x,8n))===3n]));
  }else if(name==='context'){const [context,choice,seed]=items(event.payload,'list');outputs.push(context);emit('reasons',list([context,choice,seed]));}
  else if(name==='reasons'){
   const [context,choice,seed]=items(event.payload,'list'),constitution=readQ(f(rec(read(1457),1453n),1n)),journal=read(1436),personality=readQ(f(rec(read(1503),1499n),1n));let out:CanonicalValue=list([]);
   if(uint(choice)===1n||uint(choice)===2n){const training=uint(choice)===1n;out=dispositionReasons(Number(at),context,journal,{law:'Plastic',constitution:Number(constitution.multiply(Q.of(8n)).numerator) as -1|0|1},training?ZERO:personality,training).reasons;outputs.push(out);}emit('decision',list([out,seed]));
  }else if(name==='decision'){
   const [reasons,seed]=items(event.payload,'list');let out:CanonicalValue=list([]);if(!isEmpty(reasons)){const result=await dispositionArbitrate(Number(at),Number(uint(seed)),reasons);out=result.decision;for(const address of result.addresses){if(committed.includes(address)||pending.includes(address))fail('development RNG reuse');pending.push(address);}const chosen=chosenData(f(rec(out,1431n),3n));draws=items(f(chosen,9n),'list').map(v=>f(rec(v,422n),5n));const tie=rec(f(chosen,10n),423n);if(uint(f(tie,1n))===2n)draws.push(f(tie,3n));outputs.push(out);}emit('intent',out);
  }else if(name==='intent'){const out=isEmpty(event.payload)?list([]):taskIntent(event.payload,occ(3));if(!isEmpty(out))outputs.push(out);emit('expression',out);}
  else if(name==='expression'){let out:CanonicalValue=list([]);if(!isEmpty(event.payload)){const i=rec(event.payload,1432n),ctx=f(rec(f(rec(f(i,2n),1431n),2n),1430n),2n);out=expressionTask(at,i,ctx,occ(4));outputs.push(out);}emit('qualify',out);}
  else if(name==='exercise'){emit('execution',event.payload);}
  else if(name==='execution'){
   const [attempted,practice,permitted,difficulty,report,forced]=items(event.payload,'list'),skill=readQ(f(rec(read(1501),1496n),1n)),engaged=attempted===true&&permitted===true,practiced=engaged&&practice===true;
   outputs.push(r(1504,[u(at),attempted,engaged,engaged&&skill.compare(readQ(difficulty))>=0,practiced,qValue(skill),forced===true&&permitted===true]));
   emit('report',r(1505,[u(at),engaged?report:list([]),practiced]));
  }else if(name==='report'){outputs.push(event.payload);emit('learning',event.payload);}
  else if(name==='qualify'){const out=isEmpty(event.payload)?list([]):qualifyExpression(event.payload,'Threshold',typedIdentifier(1138,u(at)));if(!isEmpty(out))outputs.push(out);emit('identity',out);}
  else if(name==='learning'){
   const phase=uint(f(rec(read(1500),1495n),1n)),gain=model.profile.learning?developmentalGain(model.profile.curve,Number(phase)):ONE,skill=readQ(f(rec(read(1501),1496n),1n)),belief=rec(read(1502),1497n),estimate=items(f(belief,1n),'list'),evidence=rec(event.payload,1505n),report=items(f(evidence,2n),'list');
   const candidate=skill.add(gain.divide(Q.of(8n))),nextSkill=f(evidence,3n)===true?(candidate.compare(ONE)>0?ONE:candidate):skill;
   const nextEstimate=report.length?(estimate.length?readQ(estimate[0]).add((report[0]===true?ONE:ZERO).subtract(readQ(estimate[0])).multiply(gain.divide(Q.of(8n)))):report[0]===true?ONE:ZERO):undefined;
   const nextBelief=r(1497,[nextEstimate?list([qValue(nextEstimate)]):f(belief,1n),u(uint(f(belief,2n))+BigInt(report.length))]);write(1501,r(1496,[qValue(nextSkill)]));write(1502,nextBelief);outputs.push(r(1506,[u(at),u(phase),qValue(gain),qValue(skill),qValue(nextSkill),belief,nextBelief]));
  }else if(name==='identity'){const prior=read(1436),next=isEmpty(event.payload)?prior:appendQualification(prior,event.payload);quantizationOperations=[...identityFold(next).operations];write(1436,next);outputs.push(old(1437,[occ(19),prior,next]));emit('formation',event.payload);}
  else if(name==='formation'){
   const phase=uint(f(rec(read(1500),1495n),1n)),gain=model.profile.formation?developmentalGain(model.profile.curve,Number(phase)):ONE,prior=rec(read(1503),1499n),before=readQ(f(prior,1n)),c=isEmpty(event.payload)?ZERO:readQ(f(rec(event.payload,1434n),4n)),candidate=before.add(c.multiply(gain).divide(Q.of(4n))),half=Q.of(1n,2n),after=candidate.compare(half)>0?half:candidate.compare(ZERO.subtract(half))<0?ZERO.subtract(half):candidate;
   const entry=c.equals(ZERO)?[]:[r(1498,[u(at),u(phase),qValue(c),qValue(gain),qValue(after.subtract(before))])];write(1503,r(1499,[qValue(after),list([...items(f(prior,2n),'list'),...entry])]));outputs.push(r(1507,[u(at),u(phase),qValue(gain),qValue(before),qValue(after),list(entry),isEmpty(event.payload)?list([]):list([event.payload])]));
  }
  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('development child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('development child association');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/development/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[actor],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:draws,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:input.state,stateAdapter:adapter,handlers:new Map(stages.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:40n,invariants:[state=>{if(expected.size)fail('development pending children');model.validateState(state);}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('development concurrent');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();pending=[];try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)committed.push(...pending);return result;}finally{active=false;expected.clear();pending=[];}}
 return guardPublicWrapperSettlement({settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:committed.slice()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(committed.map(text))}),diagnostic:()=>scheduler.failureDiagnostic});
}
