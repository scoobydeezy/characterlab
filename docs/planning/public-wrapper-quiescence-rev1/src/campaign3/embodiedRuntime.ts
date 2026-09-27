/** Fixed execution of the frozen EMB profile. Public construction is in embodiedFactory. */
import {canonicalEncode as enc,list,set,signed,unsigned,text,typedIdentifier,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,ContractReadProjection,StateContractError,statePathValue,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePathPattern} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {traceRecordValue} from '../substrate/trace';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {compileEmbodiedRequiredProjections} from '../campaign2/requiredProjection';
import {decodeStatePattern} from '../campaign2/stateModel';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataText as str,dataKey as key} from '../campaign2/canonicalData';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {assemblePreRecognitionExperience} from '../semanticBinding/perceptualEventFiles';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {decodeEmbodied as decode,embodiedRecord as r} from './embodiedCodecs';
import {beginEmbodiedIngress,embodiedInputFacts,type EmbodiedInputCompilation} from './embodiedAdmission';
import {compileEmbodiedTraceValidator} from './embodiedTrace';
import {verifyEmbodiedBodyTarget} from './embodiedBodyTarget';
import {proposeEmbodiedReplenishment} from './embodiedReplenishment';
import type {compileEmbodiedModel} from './embodiedModel';
import {exact,atom,materializeReserve,reserveBin,deficitPressure,replenishReserve} from './embodiedMath';
const ID=(ns:number,p:string)=>typedIdentifier(ns,text(p));
const ACCESSOR=ID(1028,'accessor/embodied-reserve-anchor'),SUBJECT=ID(1028,'ResolvedCharacterSubject'),OWNER=ID(1025,'authority/embodied-reserve');
const SEM='semantic-binding/0.1-candidate#SEM-001H';
type Model=Awaited<ReturnType<typeof compileEmbodiedModel>>;
export function createEmbodiedRuntime(model:Model,inputs:EmbodiedInputCompilation,initial:AuthoritativeState){
 const original=embodiedInputFacts(inputs),definitions=items(decode(model.definitionBytes()),'list'),params=rec(definitions[0],453n),channel=rec(definitions[1],458n),pressure=rec(definitions[2],460n);
 const C=id(decode(model.characterBytes())),O=id(decode(model.observerBytes())),capacity=exact(f(params,2n)),rate=exact(f(params,3n)),width=exact(f(channel,6n)),threshold=exact(f(pressure,2n));
 const bodyPath={rootStateTypeId:455n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:C}]};
 const rosterPath={rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:O}]};
 const slot0=items(items(decode(model.source.registry),'list')[0],'set');
 const registration=(type:bigint)=>{const entry=slot0.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&typeof f(v,4n)!=='boolean'&&(f(v,4n) as {schema?:{typeId:bigint}}).schema?.typeId===type);if(!entry)throw Error('missing compiled registration');return rec(f(rec(entry,171n),4n),type);};
 const registrations=[registration(465n),registration(469n),registration(470n)];
 const sourceDefinition=rec(f(registrations[0],3n),466n),bodyDomain=items(f(sourceDefinition,2n),'set').map(decodeStatePattern);
 const projections=registrations.map((reg,i)=>{const definition=rec(f(reg,3n),i===0?466n:i===1?471n:472n);return compileEmbodiedRequiredProjections(enc(reg),enc(f(definition,i===0?3n:5n)),[],model.state,model.content);});
 const pressureDomain=items(f(rec(f(registrations[1],3n),471n),2n),'set').map(decodeStatePattern);
 const writerDomain=items(f(registration(480n),7n),'set').map(decodeStatePattern);
 const validateTrace=compileEmbodiedTraceValidator(decode(model.definitionBytes()),C,O);
 let ingress:ReturnType<typeof beginEmbodiedIngress>|undefined,instant=0n;
 let reservations:ExperienceReservation[]=[],staged:StagedSemanticExperience[]=[];
 let activePhase:bigint|undefined,bodyAccesses=0;
 const fail=(message:string):never=>{throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION',message);};
 function validateState(state:AuthoritativeState){
  model.state.validateState(state);const entries=state.entries();
  if(entries.length!==2||!entries.some(e=>key(statePathValue(e.path))===key(statePathValue(bodyPath)))||!entries.some(e=>key(statePathValue(e.path))===key(statePathValue(rosterPath))))throw new SchedulerContractError('STATE_VALIDATION_FAILURE','exact body/roster state coverage required');
  const anchor=rec(state.read(bodyPath).value!,454n),binding=rec(state.read(rosterPath).value!,267n);if(key(f(binding,1n))!==key(C))throw new SchedulerContractError('STATE_VALIDATION_FAILURE','roster/body relation changed');
  materializeReserve(exact(f(anchor,1n)),(f(anchor,2n) as {value:bigint}).value,capacity,rate,instant);
 }
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:(v:CanonicalValue)=>{const state=model.state.restoreState(enc(v));validateState(state);return state;},analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 function bodyRead(state:AuthoritativeState,target:CanonicalValue,domain:readonly StatePathPattern[]){
  if(activePhase!==110n&&!(activePhase===10n&&f(channel,7n)===true&&f(channel,8n)===true))throw new SchedulerContractError('ILLEGAL_READ','body capability is unavailable at this stage/branch');
  if(key(target)!==key(C))throw new SchedulerContractError('EMBODIED_TARGET_PATH_VIOLATION','target differs from bound body');
  verifyEmbodiedBodyTarget(bodyPath,target);
  bodyAccesses++;
  const projection=new ContractReadProjection(state,domain,{anchor:{kind:'direct',accessorId:ACCESSOR,path:bodyPath}});
  const value=projection.read('anchor');if(!value)throw new SchedulerContractError('STATE_VALIDATION_FAILURE','missing body anchor');
  const anchor=rec(decode(enc(value)),454n),level=materializeReserve(exact(f(anchor,1n)),(f(anchor,2n) as {value:bigint}).value,capacity,rate,instant);return {anchor,level,reads:projection.actualReadRecords()};
 }
 function handler(context:EventHandlerContext<AuthoritativeState>){
  if(!ingress)throw new SchedulerContractError('INPUT_NOT_ADMITTED','missing instant authority');
  const allocated:bigint[]=[],allocate=()=>{const n=context.allocateRuntimeId();allocated.push(n);return n;};
  activePhase=context.event.phase;bodyAccesses=0;
  const {event,state}=context;let nextState=state,outputs:CanonicalValue[]=[],reads:ActualReadRecord[]=[],domain:StatePathPattern[]=[],quantization:CanonicalValue[]=[],patch:StatePatch={operations:[]},diffs:StructuralMutationDiff[]=[],emissions:EventEmission[]=[];
  let subjects:TypedIdentifierValue[]=[],sources:TypedIdentifierValue[]=[],seamName='embodied-level-observation',seamVersion='embodied-level-observation/0.1-candidate';
  const emit=(phase:bigint,name:string,payload:CanonicalValue)=>{emissions=[{dueAt:event.dueAt,phase,eventTypeId:ID(1001,'event/'+name),payload,dependencies:list([])}];};
  if(event.phase===10n){
   const admitted=ingress.admitSource(event),projected=projections[0].construct(admitted,state),subject=id(projected.projection.read(SUBJECT));subjects=[O,subject];reads=[...projected.actualReadRecords()];domain=[...bodyDomain];
   const observation=typedIdentifier(1115,unsigned(allocate()));let sample:CanonicalValue,carrier:CanonicalValue;
   if(f(channel,7n)===true&&f(channel,8n)===true){const body=bodyRead(state,subject,bodyDomain);reads.push(...body.reads);const bin=reserveBin(body.level,capacity,width);
    sample=r(461,[observation,O,f(channel,1n),signed(instant),r(462,[atom(bin.lower),atom(bin.upper)]),text(seamVersion)]);
    quantization=[r(484,[atom(body.level),atom(capacity),atom(width),unsigned(bin.index)])];
    const reservation=admitObservationLane({observerId:str(O.payload),lane:'Current',dueAt:instant,emitsCharacterAccessibleEvidence:true},allocate).reservation!;reservations.push(reservation);
    carrier=r(482,[unsigned(1),sample,typedIdentifier(1106,unsigned(reservation.experienceId))]);
   }else{sample=r(463,[observation,O,f(channel,1n),signed(instant),text(seamVersion)]);allocate();carrier=r(482,[unsigned(2),sample]);}
   outputs=[sample];ingress.sampleProduced(event,sample,carrier);emit(11n,'embodied-level-tracking-slot',carrier);
  }else if([11n,12n,13n,14n].includes(event.phase)){
   const {sample,carrier}=ingress.admitInternal(event),s=rec(sample,(sample as {schema:{typeId:bigint}}).schema.typeId);subjects=[id(f(s,2n))];sources=[id(f(s,1n))];const present=s.schema.typeId===461n;
   if(present){seamName='event-truth-to-pre-recognition-experience';seamVersion=SEM;}
   if(event.phase===14n){let experience:CanonicalValue|undefined;
    if(present){const reservationId=(id(f(rec(carrier,482n),3n)).payload as {value:bigint}).value,reservation=reservations.find(r=>r.experienceId===reservationId);if(!reservation)fail('missing actual experience reservation');
     const value=assemblePreRecognitionExperience({experienceId:reservationId,observerId:str(O.payload),occurredAt:instant,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:str(O.payload),observationId:(id(f(s,1n)).payload as {value:bigint}).value}],transformationVersion:SEM});
     const frozen=freezeAndStageSemanticExperience(reservation!,value,event.phase);staged.push(frozen);experience=preRecognitionSemanticExperienceValue(frozen.experience);outputs=[experience];
    }
    ingress.settled(event,experience);emit(60n,present?'embodied-pressure-present':'embodied-pressure-unavailable',sample);
   }else emit(event.phase+1n,event.phase===11n?'embodied-level-binding-slot':event.phase===12n?'embodied-level-classification-slot':'embodied-level-settlement',carrier);
  }else if(event.phase===60n){
   const admitted=ingress.admitPressure(event),sample=rec(event.payload,(event.payload as {schema:{typeId:bigint}}).schema.typeId),present=sample.schema.typeId===461n;
   const projected=projections[present?1:2].construct(admitted,state),subject=id(projected.projection.read(SUBJECT));reads=[...projected.actualReadRecords()];domain=[...pressureDomain];subjects=[O,subject];sources=[id(f(sample,1n))];seamName='embodied-pressure';seamVersion='embodied-pressure/0.1-candidate';
   const result=present?r(481,[unsigned(1),atom(deficitPressure(exact(f(rec(f(sample,5n),462n),2n)),threshold))]):r(481,[unsigned(2)]);
   outputs=[r(464,[typedIdentifier(1142,unsigned(allocate())),subject,sample,result,text(seamVersion)])];ingress.completePressure(event);
  }else if(event.phase===110n){
   ingress.admitDelivery(event);const input=rec(event.payload,478n),name=str(id(f(input,1n)).payload),index=['definition/embodied-delivery-30','definition/embodied-delivery-5','definition/embodied-delivery-60'].indexOf(name);if(index<0)fail('missing delivery definition');
   const delivery=rec(definitions[index+3],477n),target=id(f(delivery,1n)),body=bodyRead(state,target,writerDomain);subjects=[target];reads=[...body.reads];domain=[...writerDomain];seamName='embodied-replenishment';seamVersion='embodied-replenishment/0.1-candidate';
   const proposal=proposeEmbodiedReplenishment(body.anchor,body.level,capacity,exact(f(delivery,4n)),instant,bodyPath);patch=proposal.patch;
   const applied=model.state.applyPatch(state,patch,OWNER);nextState=applied.state;diffs=[...applied.diffs];outputs=[proposal.output];
  }else throw new SchedulerContractError('INPUT_NOT_ADMITTED','event outside EMB closure');
  for(const output of outputs)decode(enc(output));
  return {nextState,emittedEvents:emissions,outputs,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{
   if(bodyAccesses!==(event.phase===110n||event.phase===10n&&f(channel,7n)===true&&f(channel,8n)===true?1:0))fail('body access budget');
   if(children.length!==([10n,11n,12n,13n,14n].includes(event.phase)?1:0))fail('child multiplicity mismatch');if(children.length)ingress!.bindChild(event,children[0]);
   const trace=traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:original.runIdentity.value,event,seamId:ID(1036,'seam/'+seamName),seamVersion,recordKind:event.eventTypeId,subjectIds:subjects,sourceRecordIds:sources,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:quantization,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});decode(enc(trace));validateTrace({event,state,outputs,reads,quantization,patch,diffs,allocated,childValues:children.map(scheduledEventValue),identities:{model:model.modelIdentity.value,run:original.runIdentity.value}},trace);return [trace];
  }};
 }
 const names=['embodied-level-sample','embodied-level-tracking-slot','embodied-level-binding-slot','embodied-level-classification-slot','embodied-level-settlement','embodied-pressure-present','embodied-pressure-unavailable','embodied-reserve-replenishment'];
 const handlers=new Map(names.map(name=>[key(ID(1001,'event/'+name)),(context:EventHandlerContext<AuthoritativeState>)=>{try{return handler(context);}catch(error){if(error instanceof StateContractError)throw new SchedulerContractError(error.code,error.message);throw error;}}]));
 validateState(initial);
 const scheduler=new DeterministicScheduler({initialState:initial,stateAdapter:adapter,handlers,initialQueue:original.events,maxSettlementWorkPerSimulationInstant:model.work,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(original.events.length),nextEventSequence:BigInt(original.events.length)},invariants:[()=>{validateSuccessfulExperienceSettlement(reservations,staged);ingress!.finish();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){const next=scheduler.getPendingQueue()[0];if(!next)return undefined;instant=next.dueAt;reservations=[];staged=[];ingress=beginEmbodiedIngress(inputs,instant,enc(registrations[0]),enc(registrations[1]),enc(registrations[2]));try{return instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();}finally{ingress.abort();ingress=undefined;}}
 return Object.freeze({
  settleNextInstant:()=>settle(),
  settleNextInstantForConformance:(instrumentation:ConformanceInstrumentation)=>settle(instrumentation),
  snapshot(){return {clock:scheduler.getClock(),status:scheduler.status,state:scheduler.getState(),outputs:scheduler.getOutputs(),trace:scheduler.getCommittedTrace(),allocators:scheduler.getAllocatorState(),queue:scheduler.getPendingQueue()};},
  save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:original.runIdentity,continuingRunInputs:list([])}),
  diagnostic:()=>scheduler.failureDiagnostic,
 });
}
