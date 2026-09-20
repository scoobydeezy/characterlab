/** Internal transaction runtime for multisource-public/0.1-candidate. */
import {canonicalEncode as enc,list,text,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,patternMatches,statePathValue,type StatePath,type ActualReadRecord,type StatePatch,type StructuralMutationDiff} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type ScheduledEvent,type EventEmission,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataText as str,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {decodeStatePattern} from '../campaign2/stateModel';
import {readQ,qValue,ZERO,choiceAlignment} from '../campaign2/cognitiveMath';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {createLocalReserveSource,replenishLocalReserveDefinition} from './localReserveSource';
import {observeLocalReserveRecords} from './localReserveObservation';
import {selectBodyOccurrence,consumeBodySelection} from './bodySelectionOccurrence';
import {multisourceTaskStage,multisourceAssessmentStage,multisourceRawStage} from './multisourceSourceStages';
import {multisourceCoverage,multisourceReasonStage} from './multisourceReasons';
import {createMultisourceRandomSession,multisourceDecisionStage} from './multisourceArbitration';
import {decodeMultisource as decode,multisourceRecord as r} from './multisourcePublicCodecs';
import {generalAttentionRecord as ga} from './generalAttentionCodecs';
import {receivingRecord as old} from './receivingCodecs';
import {MS_STAGES,MS_VERSION,msId,msPath} from './multisourceModelRecipe';
import type {compileMultisourceModel} from './multisourceModel';
import type {compileMultisourceInputs} from './multisourceInputs';
type Model=Awaited<ReturnType<typeof compileMultisourceModel>>;
type Inputs=Awaited<ReturnType<typeof compileMultisourceInputs>>;
const SEM='semantic-binding/0.1-candidate#SEM-001H';
function fail(message:string):never{throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION',message);}
export function createMultisourceRuntime(model:Model,input:Inputs,initial:AuthoritativeState){
 const original=structuredClone(input),p=model.profile(),O=id(f(p,1n)),C=id(f(p,2n)),law=uint(f(p,8n)),channels=items(f(rec(f(p,6n),648n),1n),'set').map(v=>rec(v,647n)),reserves=items(f(p,5n),'list').map(v=>rec(v,707n));
 const stages=model.stages().map(v=>rec(v,711n)),seed=f(rec(original.runIdentity.value,104n),4n);if(typeof seed==='boolean'||seed.kind!=='bytes')fail('run seed');
 const random=createMultisourceRandomSession(seed.value),originals=new Map(original.events.map(e=>[e.eventId,key(scheduledEventValue(e))]));
 let instant=0n,active=false,expected=new Map<bigint,string>(),reservations:ExperienceReservation[]=[],staged:StagedSemanticExperience[]=[];
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:(s:AuthoritativeState)=>model.validateState(s,instant),canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:(v:CanonicalValue)=>model.restoreState(v,instant),analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active||event.dueAt!==instant)fail('inactive stage instant');
  const index=MS_STAGES.findIndex(([name])=>key(event.eventTypeId)===key(msId(1001,'event/multisource/'+name)));if(index<0)fail('unregistered stage');
  const [name,phase,inputType,outputType]=MS_STAGES[index],registration=stages[index];
  if(event.phase!==BigInt(phase))fail('registered phase');rec(event.payload,BigInt(inputType));
  const fingerprint=key(scheduledEventValue(event));if(['observe','replenish','deadline'].includes(name)){if(originals.get(event.eventId)!==fingerprint)fail('original identity');}else{if(expected.get(event.eventId)!==fingerprint)fail('actual generated parent');expected.delete(event.eventId);}
  const domain=items(f(registration,6n),'list').map(decodeStatePattern),writeDomain=items(f(registration,7n),'list').map(decodeStatePattern),reads:ActualReadRecord[]=[],seen=new Set<string>();
  const read=(root:bigint,selector:CanonicalValue,field=1n)=>{const path=msPath(root,selector,field),k=key(statePathValue(path));if(!domain.some(p=>patternMatches(p,path))||seen.has(k))throw new SchedulerContractError('ILLEGAL_READ','unregistered or repeated multisource read');seen.add(k);const result=state.read(path);
   reads.push({accessorId:msId(1028,'accessor/multisource/'+(root===268n?'roster':root===649n?'reserve':root===487n?'body-plan':field===1n?'task-status':'task-plan')),path,presence:result.presence,value:result.value,derivedSources:[]});return result.value;};
  let allocated=0;const allocate=()=>{allocated++;return allocateRuntimeId();},occurrence=(ns=1149)=>typedIdentifier(ns,u(allocate()));
  let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],output:CanonicalValue,randomDrawRecords:CanonicalValue[]=[];
  const apply=(path:StatePath,prior:CanonicalValue,next:CanonicalValue)=>{if(!writeDomain.some(p=>patternMatches(p,path)))fail('registered write domain');patch={operations:[{kind:'set',path,expected:{presence:true,value:prior},newValue:next}]};const applied=applyStatePatch(state,patch,id(f(registration,8n)),model.authority);nextState=applied.state;diffs=applied.diffs;};
  if(name==='observe'){
   const self=read(268n,O);if(!self||key(f(rec(self,267n),1n))!==key(C))fail('observer holder');
   const definitions=reserves.map(parameter=>{const target=f(parameter,1n),needed=channels.some(c=>key(f(c,3n))===key(target)&&f(c,6n)===true&&f(c,7n)===true),value=needed?read(649n,target):undefined,anchor=value?rec(value,454n):undefined;
    if(needed&&!anchor)fail('missing required physical anchor');const time=anchor?f(anchor,2n):signed(0);if(typeof time==='boolean'||time.kind!=='signed')fail('anchor time');
    return {key:str(id(f(rec(target,644n),2n)).payload),capacity:readQ(f(parameter,2n)),rate:readQ(f(parameter,3n)),amount:anchor?readQ(f(anchor,1n)):ZERO,anchoredAt:time.value};
   });
   const source=createLocalReserveSource(definitions,channels.map(c=>({channel:str(id(f(c,1n)).payload),physical:str(id(f(rec(f(c,3n),644n),2n)).payload),signal:str(id(f(c,4n)).payload),width:readQ(f(c,5n)),available:f(c,6n)===true,permitted:f(c,7n)===true})));
   const observed=observeLocalReserveRecords(source,O,instant,channels.map(c=>str(id(f(c,1n)).payload)),allocate),present=observed.samples.some(s=>typeof s!=='boolean'&&s.kind==='record'&&s.schema.typeId===461n);
   const reservation=admitObservationLane({observerId:str(O.payload),lane:'Current',dueAt:instant,emitsCharacterAccessibleEvidence:present},allocate).reservation;if(reservation)reservations.push(reservation);
   output=r(713,[occurrence(),event.payload,O,C,signed(instant),list(observed.samples),list(observed.declarations.map(d=>ga('SafeSignalDeclaration',[d.channel,msId(1045,d.signal)]))),...(reservation?[typedIdentifier(1106,u(reservation.experienceId))]:[])]);
  }else if(name==='freeze'){
   const observed=rec(event.payload,713n),experience=observed.fields.get(8n);let frozen:CanonicalValue|undefined;
   if(experience){const n=uint(id(experience).payload),reservation=reservations.find(v=>v.experienceId===n);if(!reservation)fail('missing reservation');
    const settled=freezeAndStageSemanticExperience(reservation,{experienceId:n,observerId:str(O.payload),occurredAt:instant,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:items(f(observed,6n),'list').filter(s=>typeof s!=='boolean'&&s.kind==='record'&&s.schema.typeId===461n).map(s=>({observerId:str(O.payload),observationId:uint(id(f(rec(s,461n),1n)).payload)})),transformationVersion:SEM},14n);staged.push(settled);frozen=preRecognitionSemanticExperienceValue(settled.experience);
   }
   output=r(714,[occurrence(),event.payload,...(frozen?[frozen]:[])]);
  }else if(name==='select'){
   const frozen=rec(event.payload,714n),observed=rec(f(frozen,2n),713n),experience=observed.fields.get(8n);
   const result=selectBodyOccurrence({opportunityId:experience?uint(id(experience).payload):null,observer:O,at:instant,declarations:items(f(observed,7n),'list').map(v=>{const d=rec(v,598n);return {channel:id(f(d,1n)),signal:str(id(f(d,2n)).payload)};}),samples:items(f(observed,6n),'list')},{maxSignals:3,maxViewsPerSignal:2,maxBytesPerSignal:4096,capacity:Number(uint(f(p,7n)))},allocate),selected=consumeBodySelection(result.view);
   output=r(716,[selected.selection,event.payload,list(selected.groups.map(g=>r(715,[msId(1045,g.signal),list(g.samples)]))),list(result.audit.rows.map(a=>ga('BodySelectionAuditRow',[msId(1045,a.signal),u(a.views),u({Selected:1,Capacity:2,Unavailable:3}[a.disposition])])))]);
  }else if(name==='task')output=multisourceTaskStage(p,event.payload,instant,model.definition,read,allocate);
  else if(name==='assess')output=multisourceAssessmentStage(p,event.payload,read,allocate);
  else if(name==='raw')output=multisourceRawStage(p,event.payload,allocate);
  else if(name==='reasons')output=multisourceReasonStage(occurrence(),event.payload,f(p,9n),law);
  else if(name==='decision'){const root=occurrence();output=await multisourceDecisionStage(root,instant,event.payload,f(p,10n),random.forResolution(root,event.payload));const d=rec(output,728n);randomDrawRecords=items(f(d,13n),'list').map(v=>f(rec(v,727n),2n));const tie=rec(f(d,14n),423n);if(uint(f(tie,1n))===2n)randomDrawRecords.push(f(tie,3n));}
  else if(name==='intent')output=r(729,[occurrence(),event.payload]);
  else if(name==='expression'){
   const decision=rec(f(rec(event.payload,729n),2n),728n),chosen=decision.fields.get(5n),raw=rec(f(rec(f(decision,3n),726n),2n),722n),meanings=new Map<string,{ground:CanonicalValue;values:Map<string,ReturnType<typeof readQ>>}>();
   // DescriptionDice is a dice-control only: expression retains ground aggregation.
   if(chosen)for(const g of multisourceCoverage(items(f(raw,3n),'list'),law===5n?1n:law)){const k=key(g.ground),entry=meanings.get(k)??{ground:g.ground,values:new Map(items(f(rec(f(raw,2n),719n),4n),'list').map(option=>[key(option),ZERO]))};entry.values.set(key(g.option),g.meaning);meanings.set(k,entry);}
   output=r(730,[occurrence(),event.payload,list([...meanings].sort(([a],[b])=>a<b?-1:1).map(([,g])=>old(510,[g.ground,qValue(choiceAlignment(chosen!,g.values))])))]);
  }else if(name==='plan'){const decision=rec(f(rec(f(rec(event.payload,730n),2n),729n),2n),728n),chosen=decision.fields.get(5n);output=r(731,[occurrence(),event.payload,chosen?f(rec(model.definition(f(rec(chosen,395n),2n)),391n),1n):u(0)]);}
  else if(name==='attempt')output=r(732,[occurrence(),event.payload]);
  else if(name==='outcome')output=r(733,[occurrence(),event.payload,f(rec(f(p,11n),434n),1n)===true?f(rec(f(rec(event.payload,732n),2n),731n),3n):u(0)]);
  else if(name==='replenish'){
   const request=rec(event.payload,651n),target=f(request,1n),parameter=reserves.find(v=>key(f(v,1n))===key(target));if(!parameter)fail('replenishment target');const anchor=rec(read(649n,target)!,454n),time=f(anchor,2n);if(typeof time==='boolean'||time.kind!=='signed')fail('anchor time');
   const changed=replenishLocalReserveDefinition({key:str(id(f(rec(target,644n),2n)).payload),capacity:readQ(f(parameter,2n)),rate:readQ(f(parameter,3n)),amount:readQ(f(anchor,1n)),anchoredAt:time.value},instant,readQ(f(request,2n))),next=old(454,[qValue(changed.result.next.amount),signed(instant)]),n=changed.result.numeric;
   apply(msPath(649n,target),anchor,next);output=ga('LocalReserveReplenishmentResult',[target,signed(instant),anchor,next,old(479,[qValue(n.before),qValue(n.potential),qValue(n.applied),qValue(n.overflow),qValue(n.after)])]);
  }else{const prior=read(373n,event.payload);if(prior&&uint(f(rec(prior,372n),1n))===1n)apply(msPath(373n,event.payload),prior,old(372,[u(3)]));output=prior?nextState.read(msPath(373n,event.payload)).value!:old(372,[u(3)]);}
  decode(enc(output));rec(output,BigInt(outputType));
  const expectedAllocations=name==='observe'?1+channels.length+(reservations.length?1:0):name==='task'?items(f(p,3n),'list').length*6+1:['replenish','deadline'].includes(name)?0:1;
  if(allocated!==expectedAllocations)fail('registered occurrence count');
  const emissions:EventEmission[]=index<12?[{dueAt:event.dueAt,phase:BigInt(MS_STAGES[index+1][1]),eventTypeId:msId(1001,'event/multisource/'+MS_STAGES[index+1][0]),payload:output,dependencies:list([])}]:[];
  const outputKey=key(output),nextKey=key(nextState.canonicalValue());
  return {nextState,outputs:[output],emittedEvents:emissions,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{
   if(key(output)!==outputKey||key(nextState.canonicalValue())!==nextKey||children.length!==emissions.length)fail('changed staged result');
   for(const child of children){if(child.causalParentEventIds.length!==1||child.causalParentEventIds[0]!==event.eventId||key(child.payload)!==outputKey)fail('child actual parent');expected.set(child.eventId,key(scheduledEventValue(child)));}
   const sourceRecordIds=index>0&&index<13?[id(f(rec(event.payload,BigInt(inputType)),1n))]:[];
   const trace=traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:original.runIdentity.value,event,seamId:msId(1036,'seam/multisource/'+name),seamVersion:MS_VERSION,recordKind:event.eventTypeId,subjectIds:[O,C],sourceRecordIds,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:event.payload,outputProjection:list([output]),randomDrawRecords,quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});decode(enc(trace));return [trace];
  }};
 }
 const handlers=new Map(MS_STAGES.map(([name])=>[key(msId(1001,'event/multisource/'+name)),handler]));
 const scheduler=new DeterministicScheduler({initialState:initial,stateAdapter:adapter,handlers,initialQueue:original.events,maxSettlementWorkPerSimulationInstant:model.work,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(original.events.length),nextEventSequence:BigInt(original.events.length)},invariants:[state=>{if(expected.size)fail('unconsumed generated children');validateSuccessfulExperienceSettlement(reservations,staged);model.validateState(state,instant);random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)throw new SchedulerContractError('RUN_NOT_ACTIVE','already settling');const next=scheduler.getPendingQueue()[0];if(!next)return undefined;instant=next.dueAt;active=true;expected=new Map();reservations=[];staged=[];random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();random.commit();return result;}finally{random.close();active=false;expected.clear();reservations=[];staged=[];}}
 return Object.freeze({settleNextInstant:()=>settle(),settleNextInstantForConformance:(instrumentation:ConformanceInstrumentation)=>settle(instrumentation),snapshot:()=>({clock:scheduler.getClock(),status:scheduler.status,state:scheduler.getState(),outputs:scheduler.getOutputs(),trace:scheduler.getCommittedTrace(),allocators:scheduler.getAllocatorState(),queue:scheduler.getPendingQueue()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:original.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),committedRandomAddressKeys:()=>random.committedAddressKeys(),diagnostic:()=>scheduler.failureDiagnostic});
}
