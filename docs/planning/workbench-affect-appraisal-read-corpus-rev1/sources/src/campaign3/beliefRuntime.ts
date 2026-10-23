/** Internal registered-stage adapter; public callers receive no instrumentation. */
import {canonicalEncode as enc,list,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,type ActualReadRecord,type StatePatch,type StructuralMutationDiff} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {decodeBelief as decode,beliefRecord as r} from './beliefCodecs';
import {BELIEF_VERSION,STAGES,OBSERVER,CHARACTER,PROPOSITIONS,bid,eventId,beliefKey,beliefPath,beliefPattern,type BeliefCompiled,compileBeliefInputs} from './beliefModel';
import {classifyBeliefSample,applyBeliefEvidence,beliefAppraisal} from './beliefMath';

export function createBeliefRuntime(model:BeliefCompiled,input:Awaited<ReturnType<typeof compileBeliefInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))]));
 let active=false,expected=new Map<bigint,string>(),reservations:ExperienceReservation[]=[],staged:StagedSemanticExperience[]=[];
 const fail=(message:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive belief transaction');
  const index=STAGES.findIndex(([name])=>key(event.eventTypeId)===key(eventId(name)));if(index<0)fail('unknown belief stage');
  const [name,phase]=STAGES[index];if(event.phase!==BigInt(phase))fail('belief phase');
  const fingerprint=key(scheduledEventValue(event));
  if(index<2){if(originals.get(event.eventId)!==fingerprint)fail('belief original association');}
  else {if(expected.get(event.eventId)!==fingerprint)fail('belief generated association');expected.delete(event.eventId);}
  const occurrence=(ns=1150)=>typedIdentifier(ns,u(allocateRuntimeId())),reads:ActualReadRecord[]=[],domain=['appraise','apply'].includes(name)?PROPOSITIONS.map(beliefPattern):[];
  const read=(p:CanonicalValue)=>{if(!domain.length||!PROPOSITIONS.some(x=>key(x)===key(p)))return fail('belief read not registered');const path=beliefPath(p),value=state.read(path);reads.push({accessorId:bid(1028,'accessor/belief/'+name),path,presence:value.presence,value:value.value,derivedSources:[]});return value.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[];
  const emit=(next:string,payload:CanonicalValue)=>{const s=STAGES.find(([n])=>n===next)!;emittedEvents.push({dueAt:event.dueAt,phase:BigInt(s[1]),eventTypeId:eventId(next),payload,dependencies:list([])});};
  if(name==='appraise'){
   for(const p of PROPOSITIONS){const prior=read(p),computed=beliefAppraisal(prior,model.goal),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,beliefKey(p)],[3n,model.goal]]);
    if(prior&&computed){fields.set(4n,prior);fields.set(5n,computed.expected);fields.set(6n,computed.confidence);}outputs.push(r(743,fields));}
  }else if(name==='world')emit('observe',event.payload);
  else if(name==='observe'){
   const frames=items(f(rec(event.payload,736n),2n),'list'),samples:CanonicalValue[]=[];
   // Sort named targets for representation stability; order supplies no cognitive meaning.
   for(const frame of [...frames].sort((a,b)=>{const x=key(f(rec(a,735n),1n)),y=key(f(rec(b,735n),1n));return x<y?-1:x>y?1:0;})){
    const v=rec(frame,735n);if(f(v,4n)!==true)continue;
    // Physical truth fields2/3 are deliberately not read by this projection.
    samples.push(r(737,[occurrence(1115),OBSERVER,f(v,1n),signed(event.dueAt),f(v,5n),f(v,6n),f(v,7n)]));
   }
   const reservation=admitObservationLane({observerId:'observer/belief-trial',lane:'Consequence',dueAt:event.dueAt,emitsCharacterAccessibleEvidence:samples.length>0},allocateRuntimeId).reservation;
   if(reservation)reservations.push(reservation);outputs.push(...samples);emit('freeze',list(samples));
  }else if(name==='freeze'){
   const samples=items(event.payload,'list'),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,list(samples)]]);
   if(samples.length){const reservation=reservations[0];if(!reservation)fail('missing belief experience');
    const frozen=freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId:'observer/belief-trial',occurredAt:event.dueAt,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:samples.map(v=>({observerId:'observer/belief-trial',observationId:uint(id(f(rec(v,737n),1n)).payload)})),transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},124n);
    staged.push(frozen);fields.set(3n,preRecognitionSemanticExperienceValue(frozen.experience));}
   const out=r(744,fields);outputs.push(out);emit('evidence',out);
  }else if(name==='evidence'){
   const frozen=rec(event.payload,744n),samples=items(f(frozen,2n),'list');if((samples.length>0)!==frozen.fields.has(3n))fail('belief freeze co-presence');
   for(const sample of samples){const s=rec(sample,737n);if(key(f(s,2n))!==key(OBSERVER)||key(f(s,4n))!==key(signed(event.dueAt)))fail('belief evidence observer/time');outputs.push(r(741,[occurrence(),sample,u(classifyBeliefSample(sample))]));}
   emit('apply',list(outputs));
  }else{
   const evidence=items(event.payload,'list'),targets=new Set<string>();
   // Preflight the entire batch before any state read or occurrence allocation.
   for(const e of evidence){const p=f(rec(f(rec(e,741n),2n),737n),3n),k=key(p);if(targets.has(k)||!PROPOSITIONS.some(x=>key(x)===k))fail('belief target collision');targets.add(k);}
   const operations:StatePatch['operations'][number][]=[];
   for(const e of evidence){const p=f(rec(f(rec(e,741n),2n),737n),3n),prior=read(p),result=applyBeliefEvidence(prior,e,model.law),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,e],[5n,result.applied]]);
    if(prior)fields.set(3n,prior);if(result.next)fields.set(4n,result.next);
    if(result.applied)operations.push({kind:'set',path:beliefPath(p),expected:prior?{presence:true,value:prior}:{presence:false},newValue:result.next!});outputs.push(r(742,fields));
   }
   patch={operations};const applied=applyStatePatch(state,patch,bid(1025,'authority/belief-expectation'),model.authority);nextState=applied.state;diffs=applied.diffs;
  }
  outputs.forEach(v=>decode(enc(v)));
  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{
   if(children.length!==emittedEvents.length)fail('belief child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('belief child binding');expected.set(e.eventId,key(scheduledEventValue(e)));});
   const sourceRecordIds=name==='evidence'?[id(f(rec(event.payload,744n),1n))]:name==='freeze'||name==='apply'?items(event.payload,'list').map(v=>id(f(rec(v,name==='freeze'?737n:741n),1n))):[];
   return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:bid(1036,'seam/belief/'+name),seamVersion:BELIEF_VERSION,recordKind:event.eventTypeId,subjectIds:[OBSERVER,CHARACTER],sourceRecordIds,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];
  }};
 }
 const scheduler=new DeterministicScheduler({initialState:new AuthoritativeState([]),stateAdapter:adapter,handlers:new Map(STAGES.map(([name])=>[key(eventId(name)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:6n,invariants:[state=>{if(expected.size)fail('unconsumed belief children');validateSuccessfulExperienceSettlement(reservations,staged);model.validateState(state);}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('belief concurrent settlement');active=true;expected=new Map();reservations=[];staged=[];try{return instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();}finally{active=false;expected.clear();reservations=[];staged=[];}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list([])}),diagnostic:()=>scheduler.failureDiagnostic};
}
