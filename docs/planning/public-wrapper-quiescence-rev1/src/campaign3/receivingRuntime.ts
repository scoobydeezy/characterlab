/** Fixed execution of the frozen EMB profile. Public construction is in embodiedFactory. */
import {canonicalEncode as enc,list,set,signed,unsigned,text,typedIdentifier,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,ContractReadProjection,StateContractError,statePathValue,patternMatches,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePathPattern} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {traceRecordValue} from '../substrate/trace';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {compileEmbodiedRequiredProjections,compileReceivingRequiredProjections} from '../campaign2/requiredProjection';
import {decodeStatePattern} from '../campaign2/stateModel';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataText as str,dataKey as key} from '../campaign2/canonicalData';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {assemblePreRecognitionExperience} from '../semanticBinding/perceptualEventFiles';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {decodeReceiving as decode,receivingRecord as r} from './receivingCodecs';
import {beginReceivingBodyIngress} from './embodiedAdmission';
import {receivingInputFacts,type ReceivingInputCompilation} from './receivingInputs';
import {compileReceivingBodyTraceValidator} from './embodiedTrace';
import {verifyEmbodiedBodyTarget} from './embodiedBodyTarget';
import {proposeEmbodiedReplenishment} from './embodiedReplenishment';
import type {compileReceivingModel} from './receivingModel';
import {exact,atom,materializeReserve,reserveBin,deficitPressure,replenishReserve} from './embodiedMath';
import {beginReceivingIngress} from './receivingAdmission';
import {workspaceOutput,appraisalOutput,concernOutput,motiveOutput,candidateOutput,rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {readQ} from '../campaign2/cognitiveMath';
import {bodyOptionsOutput,mixedCandidateOutput,mixedRawOutput,mixedReasonOutput,noCoverageMixedRawOutput,noCoverageMixedReasonOutput,receivingExpressionOutput} from './receivingTransforms';
import {createReceivingRandomSession,receivingArbitrationOutput} from './receivingArbitration';
import {compileReceivingTraceValidator} from './receivingTrace';
const ID=(ns:number,p:string)=>typedIdentifier(ns,text(p));
const ACCESSOR=ID(1028,'accessor/embodied-reserve-anchor'),SUBJECT=ID(1028,'ResolvedCharacterSubject'),OWNER=ID(1025,'authority/embodied-reserve');
const SEM='semantic-binding/0.1-candidate#SEM-001H';
type Model=Awaited<ReturnType<typeof compileReceivingModel>>;
export function createReceivingRuntime(model:Model,inputs:ReceivingInputCompilation,initial:AuthoritativeState){
 const original=receivingInputFacts(inputs),definitions=items(decode(model.definitionBytes()),'list'),params=rec(definitions[0],453n),channel=rec(definitions[1],458n),pressure=rec(definitions[2],460n);
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
 const validateTrace=compileReceivingBodyTraceValidator(decode(model.definitionBytes()),C,O);
 const validateReceivingTrace=compileReceivingTraceValidator(model,original.runIdentity.value);
 let ingress:ReturnType<typeof beginReceivingBodyIngress>|undefined,instant=0n;
 let receiving:ReturnType<typeof beginReceivingIngress>|undefined;
 const stageValues=model.stageBytes().map(b=>rec(decode(b),515n)),stageByEvent=new Map(stageValues.map(v=>[key(f(v,4n)),v]));
 const workspaceRegistration=stageValues.find(v=>(f(v,1n) as {value:bigint}).value===1n)!;
 const workspaceProjection=compileReceivingRequiredProjections(enc(workspaceRegistration),enc(f(workspaceRegistration,9n)),[],model.state,model.content);
 const seed=f(rec(original.runIdentity.value,104n),4n);if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('run seed');
 const random=createReceivingRandomSession(seed.value),task=decode(model.taskBytes()),taskPath=model.path(373n),instructionPath=model.path(373n,2n),responsePath=model.path(487n);
 const definition=model.definition;
 let reservations:ExperienceReservation[]=[],staged:StagedSemanticExperience[]=[];
 let activePhase:bigint|undefined,bodyAccesses=0,bodyAccessAllowed=false;
 const fail=(message:string):never=>{throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION',message);};
 function validateState(state:AuthoritativeState){
  model.validateState(state,instant);
  const anchor=rec(state.read(bodyPath).value!,454n);
  materializeReserve(exact(f(anchor,1n)),(f(anchor,2n) as {value:bigint}).value,capacity,rate,instant);
 }
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:(v:CanonicalValue)=>{const state=model.state.restoreState(enc(v));validateState(state);return state;},analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 function bodyRead(state:AuthoritativeState,target:CanonicalValue,domain:readonly StatePathPattern[]){
  if(!bodyAccessAllowed||activePhase!==110n&&!(activePhase===10n&&f(channel,7n)===true&&f(channel,8n)===true))throw new SchedulerContractError('ILLEGAL_READ','body capability is unavailable at this stage/branch');
  if(key(target)!==key(C))throw new SchedulerContractError('EMBODIED_TARGET_PATH_VIOLATION','target differs from bound body');
  verifyEmbodiedBodyTarget(bodyPath,target);
  bodyAccesses++;
  const projection=new ContractReadProjection(state,domain,{anchor:{kind:'direct',accessorId:ACCESSOR,path:bodyPath}});
  const value=projection.read('anchor');if(!value)throw new SchedulerContractError('STATE_VALIDATION_FAILURE','missing body anchor');
  const anchor=rec(decode(enc(value)),454n),level=materializeReserve(exact(f(anchor,1n)),(f(anchor,2n) as {value:bigint}).value,capacity,rate,instant);return {anchor,level,reads:projection.actualReadRecords()};
 }
 async function handler(context:EventHandlerContext<AuthoritativeState>){
  if(!ingress||!receiving)throw new SchedulerContractError('INPUT_NOT_ADMITTED','missing instant authority');
  activePhase=context.event.phase;bodyAccesses=0;bodyAccessAllowed=false;
  if(stageByEvent.has(key(context.event.eventTypeId))){
   const before=key(context.state.canonicalValue());let allocated=0;
   const result=await receivingHandler({...context,allocateRuntimeId:()=>{allocated++;return context.allocateRuntimeId();}});
   if(bodyAccesses!==0)throw new SchedulerContractError('ILLEGAL_READ','body read escaped receiving boundary');
   if(key(result.nextState.canonicalValue())!==before||key(context.state.canonicalValue())!==before)throw new SchedulerContractError('TRANSITION_WRITE_SCOPE_VIOLATION','receiving stages have NoStateWrites');
   if(allocated!==1)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','one receiving output reservation required');
   return result;
  }
  if(str(context.event.eventTypeId.payload)==='event/task-deadline')return deadlineHandler(context);
  receiving.admitBodyOrDeadline(context.event);
  const allocated:bigint[]=[],allocate=()=>{const n=context.allocateRuntimeId();allocated.push(n);return n;};
  bodyAccessAllowed=activePhase===110n||activePhase===10n&&f(channel,7n)===true&&f(channel,8n)===true;
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
   const projected=projections[present?1:2].construct(admitted,state),subject=id(projected.projection.read(SUBJECT));reads=[...projected.actualReadRecords()];domain=[...pressureDomain];subjects=[O,subject];sources=[id(f(sample,1n))];seamName='embodied-pressure';seamVersion='embodied-pressure/0.2-candidate';
   const result=present?r(481,[unsigned(1),atom(deficitPressure(exact(f(rec(f(sample,5n),462n),2n)),threshold))]):r(481,[unsigned(2)]);
   outputs=[r(464,[typedIdentifier(1142,unsigned(allocate())),subject,sample,result,text(seamVersion)])];ingress.completePressure(event);
  }else if(event.phase===110n){
   ingress.admitDelivery(event);const input=rec(event.payload,478n),name=str(id(f(input,1n)).payload),index=['definition/embodied-delivery-30','definition/embodied-delivery-5','definition/embodied-delivery-60'].indexOf(name);if(index<0)fail('missing delivery definition');
   const delivery=rec(definitions[index+3],477n),target=id(f(delivery,1n)),body=bodyRead(state,target,writerDomain);subjects=[target];reads=[...body.reads];domain=[...writerDomain];seamName='embodied-replenishment';seamVersion='embodied-replenishment/0.1-candidate';
   const proposal=proposeEmbodiedReplenishment(body.anchor,body.level,capacity,exact(f(delivery,4n)),instant,bodyPath);patch=proposal.patch;
   const applied=model.state.applyPatch(state,patch,OWNER);nextState=applied.state;diffs=[...applied.diffs];outputs=[proposal.output];
  }else throw new SchedulerContractError('INPUT_NOT_ADMITTED','event outside EMB closure');
  for(const output of outputs)decode(enc(output));
  emissions=receiving.completeBodyOrDeadline(event,emissions,event.phase===60n?outputs[0]:undefined);
  return {nextState,emittedEvents:emissions,outputs,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{
   if(bodyAccesses!==(event.phase===110n||event.phase===10n&&f(channel,7n)===true&&f(channel,8n)===true?1:0))fail('body access budget');
   if(children.length!==([10n,11n,12n,13n,14n,60n].includes(event.phase)?1:0))fail('child multiplicity mismatch');if(children.length&&event.phase!==60n)ingress!.bindChild(event,children[0]);receiving!.bindChildren(event,children);
   const trace=traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:original.runIdentity.value,event,seamId:ID(1036,'seam/'+seamName),seamVersion,recordKind:event.eventTypeId,subjectIds:subjects,sourceRecordIds:sources,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:quantization,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});decode(enc(trace));validateTrace({event,state,outputs,reads,quantization,patch,diffs,allocated,childValues:children.map(scheduledEventValue),identities:{model:model.modelIdentity.value,run:original.runIdentity.value}},trace);return [trace];
  }};
 }
 async function receivingHandler(context:EventHandlerContext<AuthoritativeState>){
  const {event,state}=context,registered=stageByEvent.get(key(event.eventTypeId))!,stage=Number((f(registered,1n) as {value:bigint}).value),admitted=receiving!.admit(event);
  const domain=items(f(registered,7n),'set').map(decodeStatePattern),reads:ActualReadRecord[]=[],seen=new Set<string>();
  const read=(path:ReturnType<typeof model.path>,accessor:string)=>{if(!domain.some(p=>patternMatches(p,path))||seen.has(key(statePathValue(path))))throw new SchedulerContractError('ILLEGAL_READ','receiving read outside exact domain or repeated');seen.add(key(statePathValue(path)));const result=model.state.read(state,path);reads.push({accessorId:ID(1028,accessor),path,presence:result.presence,value:result.value,derivedSources:[]});return result.value;};
  const outputSchema=rec(f(rec(items(f(registered,10n),'set')[0],277n),1n),254n),outputType=(f(outputSchema,1n) as {value:bigint}).value;
  const role=rec(decode(model.content.recordRole(outputType,1n)!),263n),ordinal=context.allocateRuntimeId(),occurrence=typedIdentifier((f(role,1n) as {value:bigint}).value,unsigned(ordinal));
  let output:CanonicalValue,randomDrawRecords:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  if(stage===1){const projected=workspaceProjection.construct(admitted,state),subject=id(projected.projection.read(SUBJECT));reads.push(...projected.actualReadRecords());
   output=workspaceOutput(occurrence,subject,f(rec(event.payload,377n),2n),definition('task-workspace'),[{key:task,specId:ID(1027,'definition/task-a'),activeFrom:0n,deadline:100n}],instant,{status(selected){if(key(selected)!==key(task))fail('foreign selected task');return read(taskPath,'accessor/workspace-task-status');},prediction(){throw new SchedulerContractError('ILLEGAL_READ','forecast disabled');}}).output;
  }else if(stage===2)output=appraisalOutput(occurrence,event.payload,[{taskKey:task,specId:ID(1027,'definition/task-a'),minimum:readQ(f(rec(definition('task-a'),370n),3n)),maximum:readQ(f(rec(definition('task-a'),370n),4n))}]);
  else if(stage===3)output=concernOutput(occurrence,event.payload,definition('task-concern'));
  else if(stage===4)output=motiveOutput(occurrence,event.payload,definition('task-motive'));
  else if(stage===5)output=bodyOptionsOutput(occurrence,event.payload,ID(1027,'definition/embodied-pressure'),()=>{const context=read(responsePath,'accessor/embodied-response-context');if(context===undefined)throw new StateContractError('REQUIRED_PROJECTION_VALUE_ABSENT','response context absent');return items(f(rec(context,486n),1n),'set').map(instructionId=>{const name=str(id(instructionId).payload).replace('definition/',''),d=rec(definition(name),485n);return {instructionId,pressureDefinitionId:f(d,1n),actionId:f(d,2n)};});});
  else if(stage===6)output=candidateOutput(occurrence,event.payload,f(rec(definition('task-candidates'),435n),1n)===true,selected=>{if(key(selected)!==key(task))fail('foreign plan task');const prior=read(instructionPath,'accessor/task-plan-binding');if(prior===undefined)return undefined;const instructionId=f(rec(prior,390n),1n),name=str(id(instructionId).payload).replace('definition/','');return {instructionId,actionId:f(rec(definition(name),389n),1n)};});
  else if(stage===7)output=mixedCandidateOutput(occurrence,event.payload);
  else if(stage===8){const d=rec(definition('task-reason-source'),436n),result=rawSignalOutput(occurrence,event.payload,f(d,1n)===true,readQ(f(d,2n)),()=>{throw new SchedulerContractError('ILLEGAL_READ','standing disabled');});output=result.output;quantizationOperations=result.quantizationOperations;}
  else if(stage===9)output=(model.name==='no-coverage-control'?noCoverageMixedRawOutput:mixedRawOutput)(occurrence,event.payload,ID(1027,'definition/embodied-pressure'));
  else if(stage===10)output=(model.name==='no-coverage-control'?noCoverageMixedReasonOutput:mixedReasonOutput)(occurrence,event.payload,definition('task-reason-dice'));
  else if(stage===11){output=await receivingArbitrationOutput(occurrence,instant,event.payload,definition('task-arbitration'),random.forResolution(occurrence,event.payload));const result=rec(f(rec(output,508n),4n),507n);if((f(result,1n) as {value:bigint}).value===3n){const data=rec(f(result,2n),506n);randomDrawRecords=items(f(data,9n),'list').map(v=>f(rec(v,505n),5n));const tie=rec(f(data,10n),423n);if((f(tie,1n) as {value:bigint}).value===2n)randomDrawRecords.push(f(tie,3n));}}
  else if(stage===12)output=r(509,[occurrence,event.payload]);
  else if(stage===13)output=receivingExpressionOutput(occurrence,event.payload);
  else if(stage===14){const resolution=rec(f(rec(event.payload,509n),2n),508n),selected=f(rec(f(rec(f(resolution,4n),507n),2n),506n),1n),action=f(rec(selected,395n),2n),d=rec(definition(str(id(action).payload).replace('definition/','')),391n);output=r(512,[occurrence,event.payload,f(d,1n)]);}
  else if(stage===15)output=r(513,[occurrence,event.payload]);
  else if(stage===16){const plan=rec(f(rec(event.payload,513n),2n),512n);output=r(514,[occurrence,event.payload,f(rec(definition('protocol-execution'),434n),1n)===true?f(plan,3n):unsigned(0)]);}
  else return fail('unregistered receiving stage');
  model.content.validateRecordRoles(enc(output));if(key(model.occurrences.extract(enc(output)))!==key(occurrence))fail('receiving output occurrence differs from reservation');
  const sourceRecords=stage===1?[]:stage===7?[f(rec(f(rec(event.payload,491n),1n),398n),1n),f(rec(f(rec(event.payload,491n),2n),489n),1n)]:stage===9?[f(rec(f(rec(event.payload,498n),1n),492n),1n),f(rec(f(rec(event.payload,498n),2n),403n),1n)]:[f(rec(event.payload,(event.payload as {schema:{typeId:bigint}}).schema.typeId),1n)];
  const emissions=receiving!.complete(event,output);
  return {nextState:state,outputs:[output],emittedEvents:emissions,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{receiving!.bindChildren(event,children);const trace=traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:original.runIdentity.value,event,seamId:id(f(registered,2n)),seamVersion:str(f(registered,3n)),recordKind:event.eventTypeId,subjectIds:stage===1?[O,C]:[C],sourceRecordIds:sourceRecords.map(id),registeredReadDomain:domain,actualReadRecords:reads,inputProjection:event.payload,outputProjection:list([output]),randomDrawRecords,quantizationOperations,statePatch:{operations:[]},structuralMutationDiffs:[],emittedEvents:children,invariantResults:[]});decode(enc(trace));validateReceivingTrace({event,state,registration:registered,output,children},trace);return [trace];}};
 }
 function deadlineHandler({event,state}:EventHandlerContext<AuthoritativeState>){receiving!.admitBodyOrDeadline(event);if(instant!==100n||key(event.payload)!==key(task))fail('deadline source');const prior=model.state.read(state,taskPath),d=registration(376n),domain=items(f(d,5n),'set').map(decodeStatePattern);if(!domain.some(p=>patternMatches(p,taskPath)))fail('deadline read domain');
  const patch:StatePatch={operations:prior.presence&&(f(rec(prior.value!,372n),1n) as {value:bigint}).value===1n?[{kind:'set',path:taskPath,expected:{presence:true,value:prior.value!},newValue:r(372,[unsigned(3)])}]:[]};
  const applied=model.state.applyPatch(state,patch,ID(1025,'authority/prospective-commitments'),{writableRoots:[373n],targetPaths:[taskPath]});receiving!.completeBodyOrDeadline(event,[]);
  return {nextState:applied.state,outputs:[],emittedEvents:[],traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{receiving!.bindChildren(event,children);return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:original.runIdentity.value,event,seamId:ID(1036,'seam/task-commitment'),seamVersion:'task-commitment/0.2-candidate',recordKind:event.eventTypeId,subjectIds:[C],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:[{accessorId:id(f(d,9n)),path:taskPath,presence:prior.presence,value:prior.value,derivedSources:[]}],inputProjection:event.payload,outputProjection:list([]),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:applied.diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const names=['embodied-level-sample','embodied-level-tracking-slot','embodied-level-binding-slot','embodied-level-classification-slot','embodied-level-settlement','embodied-pressure-present','embodied-pressure-unavailable','embodied-reserve-replenishment','task-deadline',...stageValues.map(v=>str(id(f(v,4n)).payload).replace('event/',''))];
 const handlers=new Map(names.map(name=>[key(ID(1001,'event/'+name)),async(context:EventHandlerContext<AuthoritativeState>)=>{try{return await handler(context);}catch(error){if(error instanceof StateContractError)throw new SchedulerContractError(error.code,error.message);throw error;}}]));
 validateState(initial);
 const scheduler=new DeterministicScheduler({initialState:initial,stateAdapter:adapter,handlers,initialQueue:original.events,maxSettlementWorkPerSimulationInstant:model.work,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(original.events.length),nextEventSequence:BigInt(original.events.length)},invariants:[state=>{validateSuccessfulExperienceSettlement(reservations,staged);const status=state.read(taskPath);if(instant>=100n&&status.presence&&(f(rec(status.value!,372n),1n) as {value:bigint}).value===1n)fail('deadline left expired Open task');ingress!.finish();receiving!.finish();random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(ingress||receiving)throw new SchedulerContractError('RUN_NOT_ACTIVE','receiving run is already settling');const next=scheduler.getPendingQueue()[0];if(!next)return undefined;instant=next.dueAt;reservations=[];staged=[];ingress=beginReceivingBodyIngress(inputs,instant,enc(registrations[0]),enc(registrations[1]),enc(registrations[2]));receiving=beginReceivingIngress(inputs,instant,model.stageBytes());random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();random.commit();return result;}finally{random.close();receiving.abort();receiving=undefined;ingress.abort();ingress=undefined;bodyAccessAllowed=false;}}
 return Object.freeze({
  settleNextInstant:()=>settle(),
  settleNextInstantForConformance:(instrumentation:ConformanceInstrumentation)=>settle(instrumentation),
  snapshot(){return {clock:scheduler.getClock(),status:scheduler.status,state:scheduler.getState(),outputs:scheduler.getOutputs(),trace:scheduler.getCommittedTrace(),allocators:scheduler.getAllocatorState(),queue:scheduler.getPendingQueue()};},
  save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:original.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),
  committedRandomAddressKeys:()=>random.committedAddressKeys(),
  diagnostic:()=>scheduler.failureDiagnostic,
 });
}


