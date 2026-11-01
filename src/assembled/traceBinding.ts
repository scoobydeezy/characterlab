/** assembled-character trace identity binding/0.1-candidate.
 * Fixed probe/EVID/ADAPT infrastructure; all cognitive/protocol owners emit their
 * own accepted trace records. Only the new model version is admitted here. */
import {list,text,typedIdentifier,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {traceRecordValue,TRACE_CONTRACT_VERSION,type TraceRecord} from '../substrate/trace';
import {createStatePatch,statePathPatternValue,type ActualReadRecord,type StatePatch,type StatePathPattern,type StructuralMutationDiff} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt,dataKey as key} from '../campaign2/canonicalData';
import type {compileProbeExecution} from '../campaign2/probeExecution';
import {CHARACTER_RULES,INTERACTION_RULES,CALIBRATED_RULES,ATTENTION_RULES,MEMORY_RULES,RETENTION_RULES,RETRIEVAL_RULES,WORKSPACE_RULES,MEMORY_CONTEXT_RULES,ACTION_BODY_RULES,SKILL_RULES,STRATEGY_RULES,PRIORITY_RULES,HORIZON_RULES,PERFORMANCE_RULES,HABIT_RULES,CONTROL_RULES,COMMUNICATION_RULES,SOCIAL_RULES,RELATIONSHIP_RULES,COMPARISON_RULES,CONFIGURATION_RULES,RECOGNITION_RULES,ENCOUNTER_RULES,CATALOG_RULES,PEOPLE_RULES,DISCLOSURE_RULES,PROCEDURES_RULES,OUTCOME_DISCLOSURE_RULES,EXPECTATION_RULES,ELIGIBILITY_RULES,SELF_RULES,FORMATION_RULES,VALUES_RULES,VALUE_RECEIVING_RULES,CAUSAL_RULES} from './model';
const seam=(name:string)=>typedIdentifier(1036n,text('seam/'+name));
const matrix:Record<string,{phase:bigint;seam:string;version:string}>={
 'event/outcome-evaluation':{phase:130n,seam:'character-learning-evidence',version:'character-learning-evidence/0.5-candidate'},
 'event/outcome-learning-evidence':{phase:130n,seam:'character-learning-evidence',version:'character-learning-evidence/0.5-candidate'},
 'event/regulatory-adaptation':{phase:140n,seam:'automatic-adaptation',version:'adaptation-input/0.31-candidate'},
 'event/procedural-adaptation':{phase:140n,seam:'automatic-adaptation',version:'adaptation-input/0.31-candidate'},
};
function fact(value:CanonicalValue){if(typeof value==='boolean'||value.kind!=='record'||![305n,306n].includes(value.schema.typeId))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','invalid actual fact');return value;}
export interface AdaptationTraceEvidence {
 readDomain:readonly StatePathPattern[];actualReadRecords:readonly ActualReadRecord[];
 patch:StatePatch;diffs:readonly StructuralMutationDiff[];
}
export function compileCharacterTraceBinding(modelIdentity:CanonicalValue,runIdentity:CanonicalValue,probe:ReturnType<typeof compileProbeExecution>){
 const model=rec(modelIdentity,103n),run=rec(runIdentity,104n);
 if(![CHARACTER_RULES,INTERACTION_RULES,CALIBRATED_RULES,ATTENTION_RULES,MEMORY_RULES,RETENTION_RULES,RETRIEVAL_RULES,WORKSPACE_RULES,MEMORY_CONTEXT_RULES,ACTION_BODY_RULES,SKILL_RULES,STRATEGY_RULES,PRIORITY_RULES,HORIZON_RULES,PERFORMANCE_RULES,HABIT_RULES,CONTROL_RULES,COMMUNICATION_RULES,SOCIAL_RULES,RELATIONSHIP_RULES,COMPARISON_RULES,CONFIGURATION_RULES,RECOGNITION_RULES,ENCOUNTER_RULES,CATALOG_RULES,PEOPLE_RULES,DISCLOSURE_RULES,PROCEDURES_RULES,OUTCOME_DISCLOSURE_RULES,EXPECTATION_RULES,ELIGIBILITY_RULES,SELF_RULES,FORMATION_RULES,VALUES_RULES,VALUE_RECEIVING_RULES,CAUSAL_RULES].includes(txt(f(model,1n)))||key(f(run,1n))!==key(model))throw new SchedulerContractError('INVALID_CONFIGURATION','assembled trace requires exact model/run binding');
 return Object.freeze({record(event:ScheduledEvent,outputs:readonly CanonicalValue[],children:readonly ScheduledEvent[],registration?:CanonicalValue,evidence?:AdaptationTraceEvidence):CanonicalValue{
  const name=txt(event.eventTypeId.payload),probeIndex=probe?.eventTypes().findIndex(e=>key(e)===key(event.eventTypeId))??-1;
  const carriage=['event/measurement-evidence-intake','event/measurement-evidence-padding'].includes(name),padding=name==='event/measurement-evidence-padding';
  const row=carriage?{phase:130n,seam:'measurement-evidence-carriage',version:'measurement-evidence-carriage/0.1-candidate'}:probeIndex>=0?{phase:probeIndex===0?110n:probeIndex>=6?130n:119n+BigInt(probeIndex),seam:'regulatory-diagnostic-probe',version:'regulatory-diagnostic-probe/0.1-candidate'}:event.eventTypeId.namespaceId===1001n?matrix[name]:undefined;
  if(!row||row.phase!==event.phase)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','event absent from exact trace handler matrix');
  let subjects:TypedIdentifierValue[]=[],sources:TypedIdentifierValue[]=[],output:CanonicalValue=outputs.length?outputs[0]:list([]);
  const payload=event.payload;
  if(carriage){
   if(children.length!==2||outputs.length!==(padding?0:1)||padding&&key(payload)!==key(list([])))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','carriage output/child closure');
   if(!padding){const input=rec(payload,203n),out=rec(outputs[0],337n);if(key(f(out,2n))!==key(input))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','carriage trace source');subjects=[id(f(input,2n))];sources=[id(f(input,1n))];}
  }else if(probeIndex>=0){
   if(probeIndex===1){if(children.length!==2||txt(children[0].eventTypeId.payload)!=='event/regulatory-diagnostic-probe-tracking'||txt(children[1].eventTypeId.payload)!==(probe!.permitted?'event/measurement-evidence-intake':'event/measurement-evidence-padding'))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','carriage phase-120 closure');}

   const expectedType=probeIndex===0&&probe!.available?334n:probeIndex===1&&probe!.permitted?203n:probeIndex===5&&probe!.permitted?227n:undefined;
   if(outputs.length!==(expectedType===undefined?0:1)||expectedType!==undefined&&(typeof outputs[0]==='boolean'||outputs[0].kind!=='record'||outputs[0].schema.typeId!==expectedType))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','probe output is outside the fixed producer closure');
   if(!evidence||evidence.patch.operations.length||evidence.diffs.length||key(list(evidence.readDomain.map(statePathPatternValue)))!==key(list(probeIndex===0?[statePathPatternValue(probe!.pattern)]:[]))||(probeIndex!==0&&evidence.actualReadRecords.length))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','probe trace capability/patch mismatch');
   if(probeIndex===0){subjects=[id(probe!.C)];if(!evidence)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','missing probe read evidence');probe!.validateReadEvidence(evidence.actualReadRecords);}
   else if(probe!.permitted&&probeIndex===1){subjects=[id(f(probe!.channel,2n)),id(f(probe!.channel,3n))];sources=[id(f(rec(f(rec(payload,335n),2n),334n),1n))];}
   else if(probe!.permitted&&probeIndex>=2&&probeIndex<=5){const p=rec(f(rec(payload,335n),4n),216n);subjects=[id(f(p,1n))];sources=[id(f(p,2n))];}
  }
  else if(event.phase===130n){const p=rec(payload,name==='event/outcome-evaluation'?227n:269n);const x=p.schema.typeId===227n?p:rec(f(p,2n),227n);subjects=[id(f(x,2n))];sources=[id(f(p,1n))];}
  else {const p=rec(payload,307n);subjects=[id(f(fact(f(p,2n)),1n))];sources=[id(f(p,1n))];output=list(outputs);if(!evidence)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','ADAPT requires completed WRT evidence');}
  if(event.phase>=130n&&probeIndex<0&&!padding){if(!registration)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','missing executing registration');const r=rec(registration,carriage?341n:event.phase===140n?318n:272n);if(key(f(r,1n))!==key(seam(row.seam))||txt(f(r,2n))!==row.version)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','seam/version does not match fixed trace profile');}
  subjects=[...new Map(subjects.map(s=>[key(s),s])).values()];
  const trace:TraceRecord={traceSchemaVersion:TRACE_CONTRACT_VERSION,modelIdentity:model,runIdentity:run,event,seamId:seam(row.seam),seamVersion:row.version,
   recordKind:event.eventTypeId,subjectIds:subjects,sourceRecordIds:sources,registeredReadDomain:evidence?.readDomain??[],actualReadRecords:evidence?.actualReadRecords??[],
   inputProjection:payload,outputProjection:output,randomDrawRecords:[],quantizationOperations:[],statePatch:createStatePatch(evidence?.patch.operations??[]),
   structuralMutationDiffs:evidence?.diffs??[],emittedEvents:children,invariantResults:[]};
  return traceRecordValue(trace);
 }});
}
