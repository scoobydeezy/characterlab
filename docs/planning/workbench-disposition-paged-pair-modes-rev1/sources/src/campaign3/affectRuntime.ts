/** Internal registered-stage adapter. Public entry exposes no callbacks. */
import {canonicalEncode as enc,list,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,type ActualReadRecord,type StatePatch,type StructuralMutationDiff} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {affectRecord as r,decodeAffect as decode} from './affectCodecs';
import {beliefRecord} from './beliefCodecs';
import {classifyBeliefSample,applyBeliefEvidence} from './beliefMath';
import {AFFECT_VERSION,STAGES,OBSERVER_NAME,OBSERVER,CHARACTER,PROPOSITIONS,TASKS,aid,eventId,beliefPath,taskPath,stageReads,pattern,type AffectCompiled,compileAffectInputs} from './affectModel';
import {observeAffectFrame,trackAffectObservation,affectExperienceInput,deriveAffectEvidence} from './affectSource';
import {affectAppraisal,affectRaw,affectReasons,affectDecision,affectExpression} from './affectMath';
const is=(v:CanonicalValue,t:bigint)=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t;
export function createAffectRuntime(model:AffectCompiled,input:Awaited<ReturnType<typeof compileAffectInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))]));
 let committedCarry:readonly CanonicalValue[]=[];
 let active=false,expected=new Map<bigint,string>(),reservations:ExperienceReservation[]=[],staged:StagedSemanticExperience[]=[];
 const fail=(message:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive affect transaction');
  const index=STAGES.findIndex(([name])=>key(event.eventTypeId)===key(eventId(name)));if(index<0)fail('unknown affect stage');const [name,phase]=STAGES[index];if(event.phase!==BigInt(phase))fail('affect phase');
  const fingerprint=key(scheduledEventValue(event));if(name==='appraise'||name==='world'){if(originals.get(event.eventId)!==fingerprint)fail('affect original association');}else{if(expected.get(event.eventId)!==fingerprint)fail('affect generated association');expected.delete(event.eventId);}
  const occurrence=(ns=1151)=>typedIdentifier(ns,u(allocateRuntimeId())),reads:ActualReadRecord[]=[],paths=stageReads(name),domain=paths.map(pattern),past=committedCarry,frozen=past.filter(v=>is(v,751n));
  const read=(path:ReturnType<typeof beliefPath>)=>{if(!paths.some(p=>key(encPath(p))===key(encPath(path))))return fail('affect unregistered read');const value=state.read(path);reads.push({accessorId:aid(1028,'accessor/affect/'+name),path,presence:value.presence,value:value.value,derivedSources:[]});return value.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>{const s=STAGES.find(([n])=>n===next)!;emittedEvents.push({dueAt:event.dueAt,phase:BigInt(s[1]),eventTypeId:eventId(next),payload,dependencies:list([])});};
  let output:CanonicalValue|undefined;
  if(name==='appraise')output=affectAppraisal(model,event.dueAt,occurrence(),PROPOSITIONS.map(p=>read(beliefPath(p))),frozen.length?f(rec(frozen.at(-1)!,751n),2n):undefined,past.filter(v=>is(v,754n)&&items(f(rec(v,754n),6n),'list').length).at(-1));
  else if(name==='raw')output=affectRaw(model,event.payload,TASKS.map(t=>{const v=read(taskPath(t));return !!v&&uint(f(rec(v,372n),1n))===1n;}),occurrence());
  else if(name==='reasons')output=affectReasons(model,event.payload,occurrence());
  else if(name==='decision'){output=await affectDecision(model,event.payload,event.dueAt,occurrence(),input.runSeed);randomDrawRecords=[...items(f(rec(output,757n),6n),'list')];}
  else if(name==='intent')output=r(758,[occurrence(),event.payload]);
  else if(name==='expression')output=affectExpression(event.payload,occurrence());
  else if(name==='plan'){const d=rec(f(rec(f(rec(event.payload,759n),2n),758n),2n),757n),chosen=d.fields.get(8n);output=r(760,[occurrence(),event.payload,...(chosen?[f(rec(chosen,395n),2n)]:[])]);}
  else if(name==='attempt')output=r(761,[occurrence(),event.payload]);
  else if(name==='outcome'){const plan=rec(f(rec(event.payload,761n),2n),760n),action=plan.fields.get(3n);output=r(762,[occurrence(),event.payload,!!action&&model.settings.execution,...(action?[action]:[])]);}
  else if(name==='world'){const original=rec(event.payload,749n);emit('observe',original.fields.get(2n)??list([]));}
  else if(name==='observe'){
   if(is(event.payload,748n)){output=observeAffectFrame(event.payload,event.dueAt,occurrence(1115));const reservation=admitObservationLane({observerId:OBSERVER_NAME,lane:'Consequence',dueAt:event.dueAt,emitsCharacterAccessibleEvidence:true},allocateRuntimeId).reservation!;reservations.push(reservation);}emit('track',output??list([]));
  }else if(name==='track'){if(is(event.payload,750n))output=trackAffectObservation(frozen,event.payload);emit('freeze',output??list([]));}
  else if(name==='freeze'){
   if(is(event.payload,750n)){const reservation=reservations[0];if(!reservation)fail('affect missing experience reservation');const settled=freezeAndStageSemanticExperience(reservation,affectExperienceInput(event.payload,reservation.experienceId),124n);staged.push(settled);output=r(751,[occurrence(),event.payload,preRecognitionSemanticExperienceValue(settled.experience)]);}emit('evidence',output??list([]));
  }else if(name==='evidence'){if(is(event.payload,751n))output=deriveAffectEvidence(frozen,event.payload,occurrence());emit('apply',output??list([]));}
  else if(name==='apply'){
   if(is(event.payload,752n)){const sample=rec(event.payload,752n).fields.get(4n);if(sample){const p=f(rec(sample,737n),3n);if(!PROPOSITIONS.some(x=>key(x)===key(p)))fail('affect target');const prior=read(beliefPath(p)),evidence=beliefRecord(741,[occurrence(1150),sample,u(classifyBeliefSample(sample))]),result=applyBeliefEvidence(prior,evidence,model.settings.learningLaw),fields=new Map<bigint,CanonicalValue>([[1n,occurrence(1150)],[2n,evidence],[5n,result.applied]]);if(prior)fields.set(3n,prior);if(result.next)fields.set(4n,result.next);outputs.push(evidence);output=beliefRecord(742,fields);
     if(result.applied){patch={operations:[{kind:'set',path:beliefPath(p),expected:prior?{presence:true,value:prior}:{presence:false},newValue:result.next!}]};const applied=applyStatePatch(state,patch,aid(1025,'authority/belief-expectation'),model.authority);nextState=applied.state;diffs=applied.diffs;}
   }}
  }
  if(output)outputs.push(output);if(index<8){if(!output)fail('affect missing cognitive output');emit(STAGES[index+1][0],output!);}
  outputs.forEach(v=>decode(enc(v)));
  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{
   if(children.length!==emittedEvents.length)fail('affect child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('affect child binding');expected.set(e.eventId,key(scheduledEventValue(e)));});
   const sourceRecordIds:ReturnType<typeof id>[]=[];
   if(typeof event.payload!=='boolean'&&event.payload.kind==='record'&&!['world','observe','track','freeze'].includes(name)){const first=event.payload.fields.get(1n);if(first&&typeof first!=='boolean'&&first.kind==='typedIdentifier')sourceRecordIds.push(first);}
   // Carry is a narrow projection from committed safe outputs, never trace/input history.
   const carry=name==='appraise'?outputs:[];
   const trace=traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:aid(1036,'seam/affect/'+name),seamVersion:AFFECT_VERSION,recordKind:event.eventTypeId,subjectIds:[OBSERVER,CHARACTER],sourceRecordIds,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:carry.length?list([event.payload,...carry]):event.payload,outputProjection:list(outputs),randomDrawRecords,quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});decode(enc(trace));return [trace];
  }};
 }
 function encPath(p:ReturnType<typeof beliefPath>){return list([u(p.rootStateTypeId),u(p.fieldId),...p.selectors.map(s=>s.kind==='mapKey'?s.key:false)]);}
 const scheduler=new DeterministicScheduler({initialState:model.initial,stateAdapter:adapter,handlers:new Map(STAGES.map(([name])=>[key(eventId(name)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:15n,invariants:[state=>{if(expected.size)fail('unconsumed affect children');validateSuccessfulExperienceSettlement(reservations,staged);model.validateState(state);}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('affect concurrent settlement');committedCarry=scheduler.getOutputs().filter(v=>is(v,751n)||is(v,754n));active=true;expected=new Map();reservations=[];staged=[];try{return instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();}finally{active=false;expected.clear();reservations=[];staged=[];}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list([])}),diagnostic:()=>scheduler.failureDiagnostic};
}
