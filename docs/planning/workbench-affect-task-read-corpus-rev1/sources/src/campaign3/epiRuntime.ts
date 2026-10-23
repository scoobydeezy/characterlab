/** Internal registered-stage adapter; public callers receive no instrumentation. */
import {canonicalEncode as enc,list,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,type ActualReadRecord,type StatePatch,type StructuralMutationDiff} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {decodeEpi as decode,epiRecord as r} from './epiCodecs';
import {EPI_VERSION,STAGES,OBSERVER,CHARACTER,PROPOSITIONS,bid,eventId,epiKey,epiPath,encodingPath,readDomain,type EpiCompiled,compileEpiInputs} from './epiModel';
import {classifyEpiSample,applyEpiEvidence,epiAppraisal,projectEpiFrame,encodingOperands} from './epiMath';

export function createEpiRuntime(model:EpiCompiled,input:Awaited<ReturnType<typeof compileEpiInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))]));
 let active=false,expected=new Map<bigint,string>(),reservations:ExperienceReservation[]=[],staged:StagedSemanticExperience[]=[];
 const fail=(message:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive epi transaction');
  const index=STAGES.findIndex(([name])=>key(event.eventTypeId)===key(eventId(name)));if(index<0)fail('unknown epi stage');
  const [name,phase]=STAGES[index];if(event.phase!==BigInt(phase))fail('epi phase');
  const fingerprint=key(scheduledEventValue(event));
  if(index<2){if(originals.get(event.eventId)!==fingerprint)fail('epi original association');}
  else {if(expected.get(event.eventId)!==fingerprint)fail('epi generated association');expected.delete(event.eventId);}
  const occurrence=(ns=1159)=>typedIdentifier(ns,u(allocateRuntimeId())),reads:ActualReadRecord[]=[],domain=readDomain(name);
  const read=(p:CanonicalValue,encoding=false)=>{const path=encoding?encodingPath(p):epiPath(p);if(!domain.some(d=>d.rootStateTypeId===path.rootStateTypeId)||!PROPOSITIONS.some(x=>key(x)===key(p)))return fail('epi read not registered');const value=state.read(path);reads.push({accessorId:bid(1028,'accessor/epi/'+name),path,presence:value.presence,value:value.value,derivedSources:[]});return value.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[];
  const emit=(next:string,payload:CanonicalValue)=>{const s=STAGES.find(([n])=>n===next)!;emittedEvents.push({dueAt:event.dueAt,phase:BigInt(s[1]),eventTypeId:eventId(next),payload,dependencies:list([])});};
  if(name==='appraise'){
   for(const p of PROPOSITIONS){const prior=read(p),computed=epiAppraisal(prior),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,epiKey(p)],[3n,u(model.numeric)]]);
    if(prior&&computed){fields.set(4n,prior);fields.set(5n,computed.mean);fields.set(6n,computed.precision);}const encoding=read(p,true);if(encoding)fields.set(7n,encoding);outputs.push(r(906,fields));}
  }else if(name==='world'){
   for(const frame of items(f(rec(event.payload,899n),2n),'list')){const v=rec(frame,898n),truth=projectEpiFrame(f(v,2n),f(v,3n));outputs.push(r(912,[f(v,1n),f(v,3n),f(v,2n),truth.measurement,truth.overflow,truth.after,truth.capacity]));}
   emit('observe',event.payload);
  }
  else if(name==='observe'){
   const frames=items(f(rec(event.payload,899n),2n),'list'),samples:CanonicalValue[]=[];
   // Sort named targets for representation stability; order supplies no cognitive meaning.
   for(const frame of [...frames].sort((a,b)=>{const x=key(f(rec(a,898n),1n)),y=key(f(rec(b,898n),1n));return x<y?-1:x>y?1:0;})){
    const v=rec(frame,898n);if(f(v,4n)!==true)continue;
    const observed=projectEpiFrame(f(v,2n),f(v,3n));
    const measurement=model.law===1?observed.measurement:model.law===2?f(v,2n):observed.overflow;
    samples.push(r(900,[occurrence(1115),OBSERVER,f(v,1n),signed(event.dueAt),measurement,u(observed.kind),observed.precision]));
   }
   const reservation=admitObservationLane({observerId:'observer/epi-trial',lane:'Consequence',dueAt:event.dueAt,emitsCharacterAccessibleEvidence:samples.length>0},allocateRuntimeId).reservation;
   if(reservation)reservations.push(reservation);outputs.push(...samples);emit('freeze',list(samples));
  }else if(name==='freeze'){
   const samples=items(event.payload,'list'),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,list(samples)]]);
   if(samples.length){const reservation=reservations[0];if(!reservation)fail('missing epi experience');
    const frozen=freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId:'observer/epi-trial',occurredAt:event.dueAt,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:samples.map(v=>({observerId:'observer/epi-trial',observationId:uint(id(f(rec(v,900n),1n)).payload)})),transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},124n);
    staged.push(frozen);fields.set(3n,preRecognitionSemanticExperienceValue(frozen.experience));}
   const out=r(907,fields);outputs.push(out);emit('evidence',out);
  }else if(name==='evidence'){
   const frozen=rec(event.payload,907n),samples=items(f(frozen,2n),'list');if((samples.length>0)!==frozen.fields.has(3n))fail('epi freeze co-presence');
   const learning:CanonicalValue[]=[],encoding:CanonicalValue[]=[];
   for(const sample of samples){const s=rec(sample,900n);if(key(f(s,2n))!==key(OBSERVER)||key(f(s,4n))!==key(signed(event.dueAt)))fail('epi evidence observer/time');
    learning.push(r(904,[occurrence(),sample,u(classifyEpiSample(sample))]));
    const prior=read(f(s,3n)),computed=encodingOperands(sample,prior),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,sample],[4n,computed.surprise],[5n,computed.raw],[6n,computed.strength]]);if(prior)fields.set(3n,prior);encoding.push(r(910,fields));
   }
   outputs.push(...learning,...encoding);emit('apply',list(learning));emit('encode',list(encoding));
  }else if(name==='apply'){
   const evidence=items(event.payload,'list'),targets=new Set<string>();
   // Preflight the entire batch before any state read or occurrence allocation.
   for(const e of evidence){const p=f(rec(f(rec(e,904n),2n),900n),3n),k=key(p);if(targets.has(k)||!PROPOSITIONS.some(x=>key(x)===k))fail('epi target collision');targets.add(k);}
   const operations:StatePatch['operations'][number][]=[];
   for(const e of evidence){const p=f(rec(f(rec(e,904n),2n),900n),3n),prior=read(p),result=applyEpiEvidence(prior,e,1,model.numeric),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,e],[5n,result.applied],[6n,result.rawMean],[7n,result.rawPrecision]]);
    if(prior)fields.set(3n,prior);if(result.next)fields.set(4n,result.next);
    if(result.applied)operations.push({kind:'set',path:epiPath(p),expected:prior?{presence:true,value:prior}:{presence:false},newValue:result.next!});outputs.push(r(905,fields));
   }
   patch={operations};const applied=applyStatePatch(state,patch,bid(1025,'authority/belief-expectation'),model.authority);nextState=applied.state;diffs=applied.diffs;
  }else if(name==='encode'){
   const operations:StatePatch['operations'][number][]=[],targets=new Set<string>();
   for(const value of items(event.payload,'list')){const v=rec(value,910n),p=f(rec(f(v,2n),900n),3n);if(targets.has(key(p)))fail('epi encoding collision');targets.add(key(p));const prior=read(p,true);operations.push({kind:'set',path:encodingPath(p),expected:prior?{presence:true,value:prior}:{presence:false},newValue:value});}
   patch={operations};const applied=applyStatePatch(state,patch,bid(1025,'authority/episodic-encoding'),model.authority);nextState=applied.state;diffs=applied.diffs;
  }
  outputs.forEach(v=>decode(enc(v)));
  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{
   if(children.length!==emittedEvents.length)fail('epi child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('epi child binding');expected.set(e.eventId,key(scheduledEventValue(e)));});
   const sourceRecordIds=name==='evidence'?[id(f(rec(event.payload,907n),1n))]:['freeze','apply','encode'].includes(name)?items(event.payload,'list').map(v=>id(f(rec(v,name==='freeze'?900n:name==='apply'?904n:910n),1n))):[];
   return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:bid(1036,'seam/epi/'+name),seamVersion:EPI_VERSION,recordKind:event.eventTypeId,subjectIds:[OBSERVER,CHARACTER],sourceRecordIds,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];
  }};
 }
 const scheduler=new DeterministicScheduler({initialState:new AuthoritativeState([]),stateAdapter:adapter,handlers:new Map(STAGES.map(([name])=>[key(eventId(name)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:7n,invariants:[state=>{if(expected.size)fail('unconsumed epi children');validateSuccessfulExperienceSettlement(reservations,staged);model.validateState(state);}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('epi concurrent settlement');active=true;expected=new Map();reservations=[];staged=[];try{return instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();}finally{active=false;expected.clear();reservations=[];staged=[];}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list([])}),diagnostic:()=>scheduler.failureDiagnostic};
}
