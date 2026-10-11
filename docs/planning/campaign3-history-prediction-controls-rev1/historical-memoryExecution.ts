/** measurement-episodic-memory/0.1-candidate: fixed generative authority and owned projections. */
import {canonicalEncode,list,text,typedIdentifier,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateContractError,patternMatches,type StatePath,type ActualReadRecord,type StatePatch} from '../substrate/state';
import {checkedAddDuration,simDuration} from '../substrate/time';
import {SchedulerContractError,type ScheduledEvent,type EventEmission} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue,TRACE_CONTRACT_VERSION} from '../substrate/trace';
import {decodeStatePattern} from './stateModel';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as ident,dataUnsigned as u,dataText as txt,dataKey as key,invalidModel} from './canonicalData';
import {decodeMemory,memoryRecord as r,cloneMemory} from './memoryCodecs';
import {MEMORY_VERSION,MEMORY_FORMATION_ABLATION,MEMORY_RECALL_ABLATION} from './memoryModelSource';
import type {compileMemoryModel} from './memoryModel';
export type MemoryPendingFact =
 {readonly kind:'RecallCue';readonly event:ScheduledEvent;readonly sourceEvidenceId:TypedIdentifierValue;readonly opportunityDefinitionId:TypedIdentifierValue;readonly producerEventId:bigint} |
 {readonly kind:'PrivateFuturePadding';readonly event:ScheduledEvent;readonly producerEventId:bigint};
type Model=Awaited<ReturnType<typeof compileMemoryModel>>;
const id=(n:number,s:string)=>typedIdentifier(n,text(s));
const eventNames=['event/measurement-episode-evidence','event/measurement-episode-formation','event/measurement-exact-recall','event/measurement-episode-evidence-padding','event/measurement-episode-formation-padding','event/measurement-future-padding'] as const;
function fail(message:string):never {throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);}
export function createMemoryExecution(model:Model,validate337:(v:CanonicalValue)=>void,modelIdentity:CanonicalValue,runIdentity:CanonicalValue,restoredFacts:readonly MemoryPendingFact[]=[]){
 const slots=items(decodeMemory(model.source.registry),'list'),rows=items(slots[0],'set');
 const definition=(name:string)=>{const row=rows.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(id(1009,name)));if(!row)invalidModel('memory row missing');return f(rec(row,171n),4n);};
 const fw=definition('MemoryFormationTransition'),rw=rec(definition('MeasurementRecallTransition'),358n);
 const fr=rec(f(rec(fw,model.formationEnabled?357n:356n),1n),model.formationEnabled?347n:272n),rr=rec(f(rw,1n),353n);
 const m2=rec(items(f(rec(fw,model.formationEnabled?357n:356n),model.formationEnabled?2n:3n),'set')[0],343n),idn=rec(items(f(rw,2n),'set')[0],266n);
 const episodeRequirement=model.recallEnabled?rec(items(f(rw,3n),'set')[0],349n):undefined;
 const formDomain=items(f(rec(f(fr,3n),model.formationEnabled?348n:271n),2n),'set').map(decodeStatePattern),recallDomain=items(f(rr,4n),'set').map(decodeStatePattern);
 let pending=new Map<string,ScheduledEvent>(restoredFacts.map(x=>[key(scheduledEventValue(x.event)),structuredClone(x.event)])),checkpoint=new Map<string,ScheduledEvent>(),active=false,currentInstant=0n;
 if(pending.size!==restoredFacts.length)fail('duplicate restored memory association');
 for(const fact of restoredFacts){
  const e=fact.event;if(e.phase!==20n||e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==fact.producerEventId)fail('restored memory producer relation');
  if(fact.kind==='RecallCue'){
   if(key(e.eventTypeId)!==key(id(1001,eventNames[2]))||key(f(rec(e.payload,351n),2n))!==key(fact.sourceEvidenceId)||key(fact.opportunityDefinitionId)!==key(id(1027,'definition/measurement-recall-opportunity')))fail('restored recall association');
  }else if(fact.kind!=='PrivateFuturePadding'||key(e.eventTypeId)!==key(id(1001,eventNames[5]))||key(e.payload)!==key(list([])))fail('restored private future association');
 }
 const eventKey=(e:ScheduledEvent)=>key(scheduledEventValue(e));
 const name=(e:ScheduledEvent)=>txt(e.eventTypeId.payload);
 const isEvent=(e:ScheduledEvent)=>e.eventTypeId.namespaceId===1001n&&(eventNames as readonly string[]).includes(name(e));
 const emit=(source:ScheduledEvent,event:string,phase:bigint,payload:CanonicalValue,dueAt=source.dueAt):EventEmission=>({dueAt,phase,eventTypeId:id(1001,event),payload,dependencies:list([])});
 const plan=(emissions:EventEmission[],parent?:ScheduledEvent)=>Object.freeze({emissions:()=>structuredClone(emissions),bindAllocatedChildren(children:readonly ScheduledEvent[]){if(!active||children.length!==emissions.length)fail('memory child cardinality');children.forEach((e,i)=>{const expected=emissions[i];if(parent&&(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==parent.eventId))fail('memory child parent mismatch');if(e.dueAt!==expected.dueAt||e.phase!==expected.phase||key(e.eventTypeId)!==key(expected.eventTypeId)||key(e.payload)!==key(expected.payload)||key(e.dependencies)!==key(expected.dependencies))fail('memory child mismatch');const k=eventKey(e);if(pending.has(k))fail('duplicate memory child');pending.set(k,structuredClone(e));});}});
 function subject(payload:CanonicalValue,formation:boolean,state:AuthoritativeState){
  const q=formation?m2:idn;let observer:CanonicalValue=payload;
  const path=formation?items(f(q,1n),'list').map(u):[u(f(q,1n))];
  for(const field of path){if(typeof observer==='boolean'||observer.kind!=='record')fail('invalid projection path');observer=f(observer,field);}
  model.content.validateRole(canonicalEncode(observer),canonicalEncode(r(263,[{kind:'unsigned',value:1000n}])));
  const template=decodeStatePattern(f(q,2n)),p:StatePath={rootStateTypeId:template.rootStateTypeId,fieldId:template.fieldId,selectors:[{kind:'mapKey',key:observer}]};
  const domain=formation?formDomain:recallDomain;if(!domain.some(d=>patternMatches(d,p)))fail('subject path outside ReadDomain');
  const value=model.stateModel.read(state,p);if(!value.presence)throw new StateContractError('REQUIRED_PROJECTION_VALUE_ABSENT','memory subject roster absent');
  const C=f(rec(value.value!,267n),u(f(q,3n))),accessor=ident(f(q,5n));model.content.validateRole(canonicalEncode(C),canonicalEncode(f(q,4n)));
  const read:ActualReadRecord={accessorId:accessor,path:p,presence:true,value:C,derivedSources:[value],transformationId:accessor};
  return {C:ident(C),read};
 }
 return Object.freeze({
  eventTypes:()=>eventNames.map(n=>id(1001,n)),isEvent,
  begin(instant:bigint){currentInstant=instant;if(active)fail('memory instant already active');checkpoint=new Map([...pending].map(([k,e])=>[k,structuredClone(e)]));active=true;},
  pendingFacts():readonly MemoryPendingFact[]{if(active)fail('pending memory facts require quiescence');return [...pending.values()].map(event=>{const n=name(event);if(n!==eventNames[2]&&n!==eventNames[5])fail('nonfuture pending memory event');const producerEventId=event.causalParentEventIds[0];return n===eventNames[2]?{kind:'RecallCue' as const,event:structuredClone(event),producerEventId,sourceEvidenceId:ident(cloneMemory(f(rec(event.payload,351n),2n))),opportunityDefinitionId:id(1027,'definition/measurement-recall-opportunity')}:{kind:'PrivateFuturePadding' as const,event:structuredClone(event),producerEventId};});},
  commit(){if([...pending.values()].some(e=>e.dueAt<=currentInstant))fail('unconsumed memory event');checkpoint=new Map([...pending].map(([k,e])=>[k,structuredClone(e)]));},
  close(){pending=checkpoint;active=false;},
  observeIntake(event:ScheduledEvent,output?:CanonicalValue){
   if(!active||event.phase!==130n||name(event)!==(output?'event/measurement-evidence-intake':'event/measurement-evidence-padding'))fail('memory intake producer');
   let later;try{later=checkedAddDuration(event.dueAt,simDuration(1n));}catch(error){throw new SchedulerContractError('INSTANT_OVERFLOW',error instanceof Error?error.message:String(error));} // Always checked, including suppression.
   if(output){validate337(output);const source=rec(output,337n);return plan([emit(event,eventNames[0],130n,source),emit(event,eventNames[2],20n,r(351,[f(rec(f(source,2n),203n),2n),f(source,1n)]),later)],event);}
   return plan([emit(event,eventNames[3],130n,list([])),emit(event,eventNames[5],20n,list([]),later)],event);
  },
  execute(event:ScheduledEvent,state:AuthoritativeState,allocator:{allocateRuntimeId():bigint}){
   if(!active||!isEvent(event)||!pending.delete(eventKey(event)))fail('unassociated memory event'); // Before payload or state reads.
   const n=name(event),reads:ActualReadRecord[]=[],outputs:CanonicalValue[]=[],subjects:TypedIdentifierValue[]=[],sources:TypedIdentifierValue[]=[];
   let nextState=state,patch:StatePatch={operations:[]},diffs:ReturnType<Model['stateModel']['applyPatch']>['diffs']=[],domain:typeof formDomain=[],version=MEMORY_VERSION;
   let children=plan([]);
   if(n===eventNames[0]){const source=rec(event.payload,337n);validate337(source);outputs.push(r(342,[typedIdentifier(1125,{kind:'unsigned',value:allocator.allocateRuntimeId()}),source,text(MEMORY_VERSION)]));subjects.push(ident(f(rec(f(source,2n),203n),2n)));sources.push(ident(f(source,1n)));children=plan([emit(event,eventNames[1],140n,outputs[0])],event);}
   else if(n===eventNames[3]){allocator.allocateRuntimeId();children=plan([emit(event,eventNames[4],140n,list([]))],event);}
   else if(n===eventNames[1]){
    const evidence=rec(event.payload,342n),source=rec(f(evidence,2n),337n);validate337(source);if(txt(f(evidence,3n))!==MEMORY_VERSION)fail('M1 version');
    const projected=subject(evidence,true,state);reads.push(projected.read);subjects.push(projected.C);sources.push(ident(f(evidence,1n)));domain=formDomain;
    if(model.formationEnabled){const k=r(344,[projected.C,f(source,1n)]),path:StatePath={rootStateTypeId:346n,fieldId:1n,selectors:[{kind:'mapKey',key:k}]};patch={operations:[{kind:'set',path,expected:{presence:false},newValue:r(345,[evidence])}]};const applied=model.stateModel.applyPatch(state,patch,id(1025,'authority/measurement-episode-formation'));nextState=applied.state;diffs=applied.diffs;}else version=MEMORY_FORMATION_ABLATION;
   }else if(n===eventNames[2]){
    const cue=rec(event.payload,351n),projected=subject(cue,false,state);reads.push(projected.read);subjects.push(projected.C);sources.push(ident(f(cue,2n)));domain=recallDomain;
    const ordinal=allocator.allocateRuntimeId();
    if(episodeRequirement){const path:StatePath={rootStateTypeId:346n,fieldId:1n,selectors:[{kind:'mapKey',key:r(344,[projected.C,f(cue,u(f(episodeRequirement,2n)))])}]};if(!domain.some(d=>patternMatches(d,path)))fail('episode path outside ReadDomain');const value=model.stateModel.read(state,path);reads.push({accessorId:ident(f(episodeRequirement,4n)),path,presence:value.presence,value:value.value,derivedSources:[]});if(value.presence)outputs.push(r(352,[typedIdentifier(1126,{kind:'unsigned',value:ordinal}),value.value!,text(MEMORY_VERSION)]));}else version=MEMORY_RECALL_ABLATION;
   }else if(n===eventNames[5])allocator.allocateRuntimeId();
   return {nextState,outputs,plan:children,trace(children:readonly ScheduledEvent[]){return traceRecordValue({traceSchemaVersion:TRACE_CONTRACT_VERSION,modelIdentity,runIdentity,event,seamId:id(1036,'seam/measurement-episodic-memory'),seamVersion:version,recordKind:event.eventTypeId,subjectIds:subjects,sourceRecordIds:sources,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:event.payload,outputProjection:outputs[0]??list([]),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});}};
  },
 });
}
