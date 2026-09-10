/** task-commitment/0.2-candidate. Private source admission, preflight and owned lifecycle writes. */
import {canonicalEncode as enc,list,text,unsigned,signed,rational,typedIdentifier,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateContractError,patternMatches,type ActualReadRecord,type StatePatch,type StatePathPattern} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue,TRACE_CONTRACT_VERSION} from '../substrate/trace';
import {characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {decodeStatePattern} from './stateModel';
import {taskRecord as r} from './taskCodecs';
import {TASK_VERSION} from './taskModelReview';
import {MEMORY_VERSION} from './memoryModelSource';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataText as txt,dataUnsigned as u,dataIdentity as id} from './canonicalData';
import type {compileTaskModel} from './taskModel';
export type TaskExecutionModel=Pick<Awaited<ReturnType<typeof compileTaskModel>>,'base'|'content'|'deadline'|'measurement'|'predictionComponent'|'stateModel'|'tasks'>;
type Model=TaskExecutionModel;
export interface TaskPendingFact {readonly event:ScheduledEvent;}
const atom=(n:number,s:string)=>typedIdentifier(n,text(s));
const names=['event/task-measurement-settlement','event/task-measurement-settlement-padding','event/task-deadline'];
const ek=(e:ScheduledEvent)=>key(scheduledEventValue(e));
const name=(e:ScheduledEvent)=>txt(e.eventTypeId.payload);
function fail(message:string):never{throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);}
function stage(message:string):never{throw new SchedulerContractError('TASK_STAGE_VIOLATION',message);}
function compare(a:CanonicalValue,b:CanonicalValue){if(typeof a==='boolean'||a.kind!=='rational'||typeof b==='boolean'||b.kind!=='rational')fail('task exact rational required');return a.numerator*b.denominator-b.numerator*a.denominator;}
export function createTaskExecution(model:Model,modelIdentity:CanonicalValue,runIdentity:CanonicalValue,facts:readonly TaskPendingFact[]){
 let pending=new Map<string,ScheduledEvent>(),checkpoint=new Map<string,ScheduledEvent>(),prepared:Map<string,ScheduledEvent>|undefined,active=false,sealed=false,instant=0n;
 const plans=new Map<string,{event:ScheduledEvent;state:AuthoritativeState;tasks:Model['tasks'];reads:ActualReadRecord[];subjects:TypedIdentifierValue[];sources:TypedIdentifierValue[];domain:StatePathPattern[];observation?:CanonicalValue;x?:CanonicalValue}>(),targets=new Set<string>();
 const isEvent=(e:ScheduledEvent)=>e.eventTypeId.namespaceId===1001n&&names.includes(name(e));
 for(const fact of facts){const e=structuredClone(fact.event),task=model.tasks.find(t=>key(t.key)===key(e.payload));if(name(e)!==names[2]||!isEvent(e)||!task||e.phase!==140n||e.dueAt!==task.deadline||e.causalParentEventIds.length||key(e.dependencies)!==key(list([]))||pending.has(ek(e)))fail('task deadline association');pending.set(ek(e),e);}
 function source(payload:CanonicalValue){const evidence=rec(payload,342n),carried=rec(f(evidence,2n),337n),observation=rec(f(carried,2n),203n),definition=model.predictionComponent.definition;
  model.content.validateRecordRoles(enc(evidence));model.base.measurement.validateOutput(carried);
  if(txt(f(evidence,3n))!==MEMORY_VERSION||key(f(observation,4n))!==key(f(definition,1n))||key(f(observation,3n))!==key(f(definition,2n))||key(f(carried,3n))!==key(f(definition,3n)))fail('task M1 definition');
  const at=f(observation,5n);if(typeof at==='boolean'||at.kind!=='signed'||at.value!==instant)fail('task observation time differs from admitted instant');
  const interval=rec(f(observation,6n),204n),x=f(interval,2n);
  if(f(interval,1n)!==true||f(interval,3n)!==true||key(x)!==key(f(interval,4n))||typeof x==='boolean'||x.kind!=='rational'||x.numerator<0n||x.numerator>10n*x.denominator||(10n*x.numerator)%x.denominator!==0n||key(f(observation,8n))!==key(rational(1,1))||u(f(observation,7n))!==1n||txt(f(observation,11n))!=='regulatory-diagnostic-probe/0.1-candidate')fail('task exact safe point');
  return {evidence,observation,x};
 }
 return Object.freeze({isEvent,eventTypes:()=>names.map(n=>atom(1001,n)),
  begin(at:bigint){if(active)stage('task instant already active');active=true;sealed=false;instant=at;checkpoint=new Map([...pending].map(([k,e])=>[k,structuredClone(e)]));prepared=undefined;plans.clear();targets.clear();},
  observeM1(event:ScheduledEvent,output?:CanonicalValue){if(!active||prepared||event.dueAt!==instant||event.phase!==130n||name(event)!==(output?'event/measurement-episode-evidence':'event/measurement-episode-evidence-padding'))fail('task M1 producer');if(output)source(output);
   const emission:EventEmission={dueAt:event.dueAt,phase:140n,eventTypeId:atom(1001,names[output?0:1]),payload:structuredClone(output??list([])),dependencies:list([])};let bound=false;
   return {emissions:()=>[structuredClone(emission)],bindAllocatedChildren(children:readonly ScheduledEvent[]){if(!active||prepared||bound||children.length!==1)stage('task child binding lifecycle');const e=children[0];if(e.dueAt!==emission.dueAt||e.phase!==140n||key(e.eventTypeId)!==key(emission.eventTypeId)||key(e.payload)!==key(emission.payload)||key(e.dependencies)!==key(emission.dependencies)||e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||pending.has(ek(e)))fail('task child mismatch');bound=true;pending.set(ek(e),structuredClone(e));}};
  },
  preflight(event:ScheduledEvent,state:AuthoritativeState){if(!active||prepared||sealed||!isEvent(event)||event.phase!==140n||event.dueAt!==instant||!pending.has(ek(event))||plans.has(ek(event)))fail('task preflight association');
   const n=name(event),reads:ActualReadRecord[]=[],subjects:TypedIdentifierValue[]=[],sources:TypedIdentifierValue[]=[];let selected:Model['tasks']=[],domain:StatePathPattern[]=[],observation:CanonicalValue|undefined,x:CanonicalValue|undefined;
   if(n===names[1]){if(key(event.payload)!==key(list([])))fail('task padding');}
   else if(n===names[2]){selected=model.tasks.filter(t=>key(t.key)===key(event.payload)&&t.deadline===instant);if(selected.length!==1)fail('task clock target');subjects.push(selected[0].character);domain=items(f(model.deadline,5n),'set').map(decodeStatePattern);}
   else {const admitted=source(event.payload);observation=admitted.observation;x=admitted.x;sources.push(id(f(admitted.evidence,1n)));domain=items(f(model.measurement,4n),'set').map(decodeStatePattern);
    const q=rec(items(f(model.measurement,8n),'set')[0],343n);let observer=event.payload;for(const field of items(f(q,1n),'list').map(u))observer=f(rec(observer,(observer as ReturnType<typeof rec>).schema.typeId),field);
    model.content.validateRole(enc(observer),enc(r(263,[unsigned(1000)])));const template=decodeStatePattern(f(q,2n)),path={rootStateTypeId:template.rootStateTypeId,fieldId:template.fieldId,selectors:[{kind:'mapKey' as const,key:observer}]};
    if(!domain.some(d=>patternMatches(d,path)))fail('task IDN ReadDomain');const value=model.stateModel.read(state,path);if(!value.presence)throw new StateContractError('REQUIRED_PROJECTION_VALUE_ABSENT','task subject roster absent');
    const C=id(f(rec(value.value!,267n),u(f(q,3n)))),accessor=id(f(q,5n));model.content.validateRole(enc(C),enc(f(q,4n)));subjects.push(C);reads.push({accessorId:accessor,path,presence:true,value:C,derivedSources:[value],transformationId:accessor});
    selected=model.tasks.filter(t=>key(t.character)===key(C)&&key(t.predictionDefinitionId)===key(model.predictionComponent.definitionId)&&t.activeFrom<=instant&&instant<t.deadline);
   }
   for(const t of selected){model.stateModel.validatePath(t.path);if(!domain.some(d=>patternMatches(d,t.path)))fail('task target ReadDomain');}
   plans.set(ek(event),{event:structuredClone(event),state,tasks:selected,reads,subjects,sources,domain,observation,x});
  },
  sealPreflight(){if(!active||prepared||sealed)stage('task preflight seal lifecycle');for(const p of plans.values())for(const t of p.tasks){const k=key(t.key);if(targets.has(k))throw new SchedulerContractError('TASK_TARGET_COLLISION','whole-stage task target collision');targets.add(k);}sealed=true;},
  execute(event:ScheduledEvent,state:AuthoritativeState){const p=plans.get(ek(event));if(!active||prepared||!sealed||!p||p.state!==state||!pending.delete(ek(event)))stage('unplanned or repeated task execution');plans.delete(ek(event));
   const reads=[...p.reads],patch:StatePatch={operations:[]},operations=[] as StatePatch['operations'][number][];
   const accessor=name(event)===names[2]?id(f(model.deadline,9n)):id(f(rec(items(f(model.measurement,9n),'set')[0],374n),4n));
   for(const t of p.tasks){const prior=model.stateModel.read(state,t.path);reads.push({accessorId:accessor,path:t.path,presence:prior.presence,value:prior.value,derivedSources:[]});if(!prior.presence||u(f(rec(prior.value!,372n),1n))!==1n)continue;
    let value:CanonicalValue|undefined;if(name(event)===names[2])value=r(372,[unsigned(3)]);else if(compare(p.x!,t.minimum)>=0n&&compare(p.x!,t.maximum)<=0n)value=r(372,[unsigned(2),characterEvidenceRefValue({kind:'observation',observationId:u(id(f(rec(p.observation!,203n),1n)).payload)}),signed(instant)]);
    if(value)operations.push({kind:'set',path:t.path,expected:{presence:true,value:prior.value!},newValue:value});
   }
   const owned={...patch,operations},applied=model.stateModel.applyPatch(state,owned,atom(1025,'authority/prospective-commitments'),{writableRoots:[373n],targetPaths:p.tasks.map(t=>t.path)});
   return {nextState:applied.state,patch:owned,trace(){return traceRecordValue({traceSchemaVersion:TRACE_CONTRACT_VERSION,modelIdentity,runIdentity,event:p.event,seamId:atom(1036,'seam/task-commitment'),seamVersion:TASK_VERSION,recordKind:event.eventTypeId,subjectIds:p.subjects,sourceRecordIds:p.sources,registeredReadDomain:p.domain,actualReadRecords:reads,inputProjection:p.event.payload,outputProjection:list([]),randomDrawRecords:[],quantizationOperations:[],statePatch:owned,structuralMutationDiffs:applied.diffs,emittedEvents:[],invariantResults:[]});}};
  },
  prepareCommit(state:AuthoritativeState){if(!active||prepared||plans.size||[...pending.values()].some(e=>e.dueAt<=instant))stage('unfinished task instant');for(const t of model.tasks)if(t.deadline<=instant){const prior=model.stateModel.read(state,t.path);if(prior.presence&&u(f(rec(prior.value!,372n),1n))===1n)stage('expired open task at quiescence');}prepared=new Map([...pending].map(([k,e])=>[k,structuredClone(e)]));},
  commit(){if(!prepared)stage('task commit not prepared');checkpoint=prepared;},
  close(){pending=checkpoint;active=false;sealed=false;prepared=undefined;plans.clear();targets.clear();},
  pendingFacts():readonly TaskPendingFact[]{if(active)stage('task facts require quiescence');return [...pending.values()].map(event=>({event:structuredClone(event)}));},
 });
}
