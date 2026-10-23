/** decision-public/0.1-candidate: authenticated generated path and owned history. */
import {canonicalEncode as enc,list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,type ActualReadRecord,type StatePatch,type StructuralMutationDiff} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {compileReasonNuclei} from '../campaign2/cognitiveMath';
import {createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {receivingRecord as old} from './receivingCodecs';
import {decisionRecord as r,decodeDecision as decode} from './decisionCodecs';
import {VERSION,STAGES,OBSERVER,ACTOR,sid,eventId,historyPath,authorityId,reads,type DecisionCompiled,compileDecisionInputs} from './decisionModel';
import {decisionRaw,resolveDecision,decisionDraws,decisionExpression,safeIntent,safeExpression,playerDisplay} from './decisionMath';

export function createDecisionRuntime(model:DecisionCompiled,input:Awaited<ReturnType<typeof compileDecisionInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),world=new Map(input.events.map(e=>[e.dueAt,rec(e.payload,932n)])),random=createCognitiveRandomSession(input.runSeed);
 let active=false,expected=new Map<bigint,string>(),reservations:ExperienceReservation[]=[],staged:StagedSemanticExperience[]=[];
 const fail=(message:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive decision transaction');const stage=STAGES.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage)fail('decision stage');const [name,phase]=stage!;if(event.phase!==BigInt(phase))fail('decision phase');
  const fingerprint=key(scheduledEventValue(event));if(name==='source'){if(originals.get(event.eventId)!==fingerprint)fail('decision original');}else{if(expected.get(event.eventId)!==fingerprint)fail('decision generated');expected.delete(event.eventId);}
  const occurrence=(ns=1161)=>typedIdentifier(ns,u(allocateRuntimeId())),domain=reads(name),actualReads:ActualReadRecord[]=[];
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])});
  const reserve=(lane:'Current'|'Consequence',hasEvidence:boolean)=>{const reservation=admitObservationLane({observerId:'observer/decision',lane,dueAt:event.dueAt,emitsCharacterAccessibleEvidence:hasEvidence},allocateRuntimeId).reservation;if(reservation)reservations.push(reservation);};
  const freeze=(samples:readonly CanonicalValue[],type:bigint)=>{const reservation=reservations.at(-1);if(!reservation||!samples.length)return fail('decision SEM reservation');const frozen=freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId:'observer/decision',occurredAt:event.dueAt,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:samples.map(v=>({observerId:'observer/decision',observationId:uint(id(f(rec(v,type),1n)).payload)})),transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},event.phase);staged.push(frozen);return preRecognitionSemanticExperienceValue(frozen.experience);};
  if(name==='source'){
   const original=rec(event.payload,932n),regime=uint(f(original,2n)),values=regime===1n?[3,0]:regime===2n?[0,0]:[3,3],samples=f(original,6n)===true?values.map((n,i)=>r(933,[occurrence(1115),OBSERVER,signed(event.dueAt),u(i+1),q(n,1)])):[];
   reserve('Current',samples.length>0);outputs.push(...samples);emit('freeze',list(samples));
  }else if(name==='freeze'){
   const samples=items(event.payload,'list'),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,list(samples)]]);if(samples.length)fields.set(3n,freeze(samples,933n));const out=r(934,fields);outputs.push(out);emit('raw',out);
  }else if(name==='raw'){
   const out=decisionRaw(event.dueAt,occurrence,event.payload);outputs.push(out);emit('reasons',out);
  }else if(name==='reasons'){
   const out=old(408,[occurrence(1134),event.payload,list(compileReasonNuclei(items(f(rec(event.payload,403n),3n),'set'),f(model.content,3n)))]);outputs.push(out);emit('decision',out);
  }else if(name==='decision'){
   const root=typedIdentifier(1135,u(event.dueAt)),out=await resolveDecision(occurrence(),event.dueAt,event.payload,f(model.content,4n),model.law,random.forResolution(root,event.payload));randomDrawRecords=decisionDraws(out);outputs.push(out);const display=playerDisplay(out);if(display)outputs.push(display);emit('intent',out);
  }else if(name==='intent'){
   const out=r(936,[occurrence(),event.payload]);outputs.push(out,safeIntent(out));emit('expression',out);
  }else if(name==='expression'){
   const out=decisionExpression(occurrence(),event.payload);outputs.push(out,safeExpression(out));emit('plan',out);
  }else if(name==='plan'){
   const out=r(938,[occurrence(),f(rec(event.payload,937n),2n),u(1)]);outputs.push(out);emit('attempt',list([out,event.payload]));
  }else if(name==='attempt'){
   const pair=items(event.payload,'list'),out=r(939,[occurrence(),pair[0]]);outputs.push(out);emit('execution',list([out,pair[1]]));
  }else if(name==='execution'){
   const pair=items(event.payload,'list'),out=r(940,[occurrence(),pair[0],f(world.get(event.dueAt)!,3n)]);outputs.push(out);emit('observation',list([out,pair[1]]));
  }else if(name==='observation'){
   const pair=items(event.payload,'list'),outcome=rec(pair[0],940n),visible=f(world.get(event.dueAt)!,4n)===true,samples=visible?[r(941,[occurrence(1115),OBSERVER,signed(event.dueAt),f(outcome,3n)])]:[];reserve('Consequence',visible);outputs.push(...samples);emit('consequence',list([pair[1],list(samples)]));
  }else if(name==='consequence'){
   const pair=items(event.payload,'list'),samples=items(pair[1],'list'),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,pair[0]]]);if(samples.length){fields.set(3n,samples[0]);fields.set(4n,freeze(samples,941n));}const out=r(942,fields);outputs.push(out);emit('history',out);
  }else{
   const prior=state.read(historyPath);actualReads.push({accessorId:sid(1028,'accessor/decision/history'),path:historyPath,presence:prior.presence,value:prior.value,derivedSources:[]});const history=prior.value??r(951,[list([])]),staged=rec(event.payload,942n),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()]]);
   if(!(model.law===6&&staged.fields.has(3n)&&f(rec(f(staged,3n),941n),4n)===false))fields.set(2n,safeExpression(f(staged,2n)));if(staged.fields.has(3n)){fields.set(3n,f(staged,3n));fields.set(4n,f(staged,4n));}
   const entry=r(945,fields),next=r(951,[list([...items(f(rec(history,951n),1n),'list'),entry])]);patch={operations:[{kind:'set',path:historyPath,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:next}]};const applied=applyStatePatch(state,patch,authorityId,model.authority);nextState=applied.state;diffs=applied.diffs;outputs.push(entry,r(948,[occurrence(),history,next,entry]));
  }
  outputs.forEach(v=>decode(enc(v)));
  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{
   if(children.length!==emittedEvents.length)fail('decision child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('decision parent binding');expected.set(e.eventId,key(scheduledEventValue(e)));});
   return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/decision/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[OBSERVER,ACTOR],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords,quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];
  }};
 }
 const scheduler=new DeterministicScheduler({initialState:new AuthoritativeState([]),stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:13n,invariants:[state=>{if(expected.size)fail('decision pending children');validateSuccessfulExperienceSettlement(reservations,staged);model.validateState(state);random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('decision concurrent settlement');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();reservations=[];staged=[];random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)random.commit();return result;}finally{active=false;expected.clear();reservations=[];staged=[];random.close();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:random.committedAddressKeys()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),diagnostic:()=>scheduler.failureDiagnostic};
}
