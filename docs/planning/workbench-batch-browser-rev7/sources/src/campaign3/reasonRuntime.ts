/** Registered reason-public/0.3-candidate adapter and authenticated parent routing. */
import {canonicalEncode as enc,list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,type ActualReadRecord,type StatePatch,type StructuralMutationDiff} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,compileReasonNuclei,appendIdentityContribution} from '../campaign2/cognitiveMath';
import {rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {arbitrationOutput,createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {intentOutput,expressionOutput,qualificationOutput,chosenData} from '../campaign2/cognitiveChoice';
import {receivingRecord as old} from './receivingCodecs';
import {biographyContext} from './longitudinalMath';
import {reasonRecord as r,decodeReason as decode} from './reasonCodecs';
import {VERSION,STAGES,OBSERVER,ACTOR,sid,eventId,identityPath,authorityId,reads,type ReasonCompiled,compileReasonInputs} from './reasonModel';
import {reasonRaw,compileJoinedReasons} from './reasonMath';

export function createReasonRuntime(model:ReasonCompiled,input:Awaited<ReturnType<typeof compileReasonInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),random=createCognitiveRandomSession(input.runSeed);
 let active=false,expected=new Map<bigint,string>(),reservations:ExperienceReservation[]=[],staged:StagedSemanticExperience[]=[];
 const fail=(message:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive reason transaction');const stage=STAGES.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage)fail('reason stage');const [name,phase]=stage!;if(event.phase!==BigInt(phase))fail('reason phase');
  const fingerprint=key(scheduledEventValue(event));if(['source','context'].includes(name)){if(originals.get(event.eventId)!==fingerprint)fail('reason original');}else{if(expected.get(event.eventId)!==fingerprint)fail('reason generated');expected.delete(event.eventId);}
  const occurrence=(ns=1160)=>typedIdentifier(ns,u(allocateRuntimeId())),domain=reads(name),actualReads:ActualReadRecord[]=[],read=()=>{if(!domain.length)return fail('reason read domain');const prior=state.read(identityPath);actualReads.push({accessorId:sid(1028,'accessor/reason/'+name),path:identityPath,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])});
  const type=typeof event.payload!=='boolean'&&event.payload.kind==='record'?event.payload.schema.typeId:0n;
  if(name==='source'){
   const original=rec(event.payload,915n);if(uint(f(original,2n))===2n){const samples=f(original,5n)===true?items(f(original,4n),'list').map((value,i)=>r(917,[occurrence(1115),OBSERVER,signed(event.dueAt),u(i+1),value])):[];
    const reservation=admitObservationLane({observerId:'observer/reason',lane:'Current',dueAt:event.dueAt,emitsCharacterAccessibleEvidence:samples.length>0},allocateRuntimeId).reservation;if(reservation)reservations.push(reservation);
    outputs.push(...samples);emit('freeze',list([f(original,3n),list(samples)]));
   }
  }else if(name==='freeze'){
   const pair=items(event.payload,'list'),samples=items(pair[1],'list'),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,pair[0]],[3n,list(samples)]]);
   if(samples.length){const reservation=reservations[0];if(!reservation)fail('reason reservation');const frozen=freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId:'observer/reason',occurredAt:event.dueAt,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:samples.map(v=>({observerId:'observer/reason',observationId:uint(id(f(rec(v,917n),1n)).payload)})),transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},14n);staged.push(frozen);fields.set(4n,preRecognitionSemanticExperienceValue(frozen.experience));}
   const out=r(918,fields);outputs.push(out);emit('raw',out);
  }else if(name==='context'){
   if(uint(f(rec(event.payload,915n),2n))===1n){const out=biographyContext(event.dueAt,occurrence);outputs.push(out);emit('raw',out);}
  }else if(name==='raw'){
   if(type===398n){const result=rawSignalOutput(occurrence(1133),event.payload,false,ONE,()=>undefined);outputs.push(result.output);emit('reasons',result.output);}
   else {const frozen=rec(event.payload,918n),context=Number(uint(f(frozen,2n))),descriptions=items(items(f(model.content,3n),'list')[context-1],'list'),samples=items(f(frozen,3n),'list');if((samples.length>0)!==frozen.fields.has(4n))fail('reason SEM copresence');for(const sample of samples){const s=rec(sample,917n);if(key(f(s,2n))!==key(OBSERVER)||key(f(s,3n))!==key(signed(event.dueAt)))fail('reason observer/time');}
    const result=reasonRaw(occurrence(),descriptions,samples,read()??old(414,[list([])]));quantizationOperations=result.quantizationOperations;outputs.push(result.output);emit('reasons',result.output);
   }
  }else if(name==='reasons'){
   if(type===403n){const out=old(408,[occurrence(1134),event.payload,list(compileReasonNuclei(items(f(rec(event.payload,403n),3n),'set'),f(model.content,5n)))]);outputs.push(out);emit('decision',out);}
   else outputs.push(compileJoinedReasons(occurrence(),event.payload,f(model.content,4n),model.law));
  }else if(name==='decision'){
   const root=typedIdentifier(1135,u(event.dueAt)),out=await arbitrationOutput(root,event.dueAt,event.payload,old(440,[q(1,2),q(1,2)]),random.forResolution(root,event.payload)),data=chosenData(out);randomDrawRecords=items(f(data,9n),'list').map(v=>f(rec(v,422n),5n));const tie=rec(f(data,10n),423n);if(uint(f(tie,1n))===2n)randomDrawRecords.push(f(tie,3n));outputs.push(out);emit('expression',out);
  }else if(name==='expression'){
   const intent=intentOutput(occurrence(1136),event.payload),expression=expressionOutput(occurrence(1137),intent);outputs.push(intent,expression);emit('qualification',expression);
  }else if(name==='qualification'){
   const out=qualificationOutput(occurrence(1138),event.payload);outputs.push(out);emit('learn',out);
  }else {
   const prior=read(),history=prior??old(414,[list([])]),qualification=rec(event.payload,429n),result=rec(f(qualification,3n),430n);let next=history;
   if(uint(f(result,1n))===1n){const expression=rec(f(qualification,2n),426n),resolution=rec(f(rec(f(expression,2n),425n),2n),409n),contribution=old(413,[f(qualification,1n),f(resolution,1n),signed(event.dueAt),f(result,3n)]),fold=appendIdentityContribution(items(f(rec(history,414n),1n),'list'),contribution,ONE);next=fold.history;quantizationOperations=fold.operations;
    patch={operations:[{kind:'set',path:identityPath,expected:prior?{presence:true,value:prior}:{presence:false},newValue:next}]};const applied=applyStatePatch(state,patch,authorityId,model.authority);nextState=applied.state;diffs=applied.diffs;
   }
   outputs.push(r(929,[occurrence(),history,next,qualification]));
  }
  outputs.forEach(v=>decode(enc(v)));
  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{
   if(children.length!==emittedEvents.length)fail('reason child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('reason parent binding');expected.set(e.eventId,key(scheduledEventValue(e)));});
   return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/reason/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[OBSERVER,ACTOR],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:name==='context'?list([signed(event.dueAt),f(rec(event.payload,915n),2n)]):event.payload,outputProjection:list(outputs),randomDrawRecords,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];
  }};
 }
 const scheduler=new DeterministicScheduler({initialState:new AuthoritativeState([]),stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:9n,invariants:[state=>{if(expected.size)fail('reason pending children');validateSuccessfulExperienceSettlement(reservations,staged);model.validateState(state);random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('reason concurrent settlement');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();reservations=[];staged=[];random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)random.commit();return result;}finally{active=false;expected.clear();reservations=[];staged=[];random.close();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),diagnostic:()=>scheduler.failureDiagnostic};
}
