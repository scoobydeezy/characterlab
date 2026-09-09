/** campaign2-trace-binding/0.1-candidate. Omniscient fixed infrastructure only. */
import {list,text,typedIdentifier,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {traceRecordValue,TRACE_CONTRACT_VERSION,type TraceRecord} from '../substrate/trace';
import {createStatePatch,statePathPatternValue,type ActualReadRecord,type StatePatch,type StatePathPattern,type StructuralMutationDiff} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt,dataKey as key} from './canonicalData';
import type {compileProbeExecution} from './probeExecution';
export const TRACE_RULES='rules/campaign2-bounded-bridge/0.2-candidate';
export const TRACE_PROFILE='campaign2-trace-binding/0.1-candidate';
export const PROBE_TRACE_PROFILE='campaign2-probe-trace-binding/0.2-candidate';
export function supportsProbeTraceProfile(profile:string):boolean{return profile===PROBE_TRACE_PROFILE;}
/** Fixed build support, never a caller-selected capability. */
export function supportsTraceProfile(profile:string):boolean{return profile===TRACE_PROFILE;}
const seam=(name:string)=>typedIdentifier(1036n,text('seam/'+name));
const matrix:Record<string,{phase:bigint;seam:string;version:string}>={
 'event/authored-adaptation-fact':{phase:110n,seam:'authored-adaptation-fact-source',version:'adaptation-input/0.31-candidate'},
 'event/fixture-consequence-observation':{phase:120n,seam:'authored-fact-observation',version:'authored-fact-observation/0.1-candidate'},
 ...Object.fromEntries(['tracking','binding','classification','freeze'].map((n,i)=>['event/fixture-consequence-'+n,{phase:121n+BigInt(i),seam:'event-truth-to-pre-recognition-experience',version:'semantic-binding/0.1-candidate#SEM-001H'}])),
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
export function compileTraceBinding(modelIdentity:CanonicalValue,runIdentity:CanonicalValue){
 return compileBinding(modelIdentity,runIdentity);
}
export function compileProbeTraceBinding(modelIdentity:CanonicalValue,runIdentity:CanonicalValue,probe:ReturnType<typeof compileProbeExecution>){
 if(!supportsProbeTraceProfile(PROBE_TRACE_PROFILE))throw new SchedulerContractError('INVALID_CONFIGURATION','exact probe trace profile unavailable');
 return compileBinding(modelIdentity,runIdentity,probe);
}
export function compileMeasurementTraceBinding(modelIdentity:CanonicalValue,runIdentity:CanonicalValue,probe:ReturnType<typeof compileProbeExecution>){return compileBinding(modelIdentity,runIdentity,probe,true);}
export function compileMemoryBaseTraceBinding(modelIdentity:CanonicalValue,runIdentity:CanonicalValue,probe:ReturnType<typeof compileProbeExecution>){return compileBinding(modelIdentity,runIdentity,probe,true,true);}
function compileBinding(modelIdentity:CanonicalValue,runIdentity:CanonicalValue,probe?:ReturnType<typeof compileProbeExecution>,measurement=false,memory=false){
 const model=rec(modelIdentity,103n),run=rec(runIdentity,104n);
 if(!supportsTraceProfile(TRACE_PROFILE)||txt(f(model,1n))!==(memory?'rules/campaign2-measurement-memory/0.1-candidate':measurement?'rules/campaign2-measurement-evidence/0.1-candidate':probe?'rules/campaign2-regulatory-probe/0.2-candidate':TRACE_RULES)||key(f(run,1n))!==key(model))throw new SchedulerContractError('INVALID_CONFIGURATION','canonical trace requires exact 0.2 model/run binding');
 return Object.freeze({record(event:ScheduledEvent,outputs:readonly CanonicalValue[],children:readonly ScheduledEvent[],registration?:CanonicalValue,evidence?:AdaptationTraceEvidence):CanonicalValue{
  const name=txt(event.eventTypeId.payload),probeIndex=probe?.eventTypes().findIndex(e=>key(e)===key(event.eventTypeId))??-1;
  const carriage=measurement&&['event/measurement-evidence-intake','event/measurement-evidence-padding'].includes(name),padding=name==='event/measurement-evidence-padding';
  const row=carriage?{phase:130n,seam:'measurement-evidence-carriage',version:'measurement-evidence-carriage/0.1-candidate'}:probeIndex>=0?{phase:probeIndex===0?110n:probeIndex>=6?130n:119n+BigInt(probeIndex),seam:'regulatory-diagnostic-probe',version:'regulatory-diagnostic-probe/0.1-candidate'}:event.eventTypeId.namespaceId===1001n?matrix[name]:undefined;
  if(!row||row.phase!==event.phase)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','event absent from exact trace handler matrix');
  let subjects:TypedIdentifierValue[]=[],sources:TypedIdentifierValue[]=[],output:CanonicalValue=outputs.length?outputs[0]:list([]);
  const payload=event.payload;
  if(carriage){
   if(children.length!==(memory?2:0)||outputs.length!==(padding?0:1)||padding&&key(payload)!==key(list([])))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','carriage output/child closure');
   if(!padding){const input=rec(payload,203n),out=rec(outputs[0],337n);if(key(f(out,2n))!==key(input))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','carriage trace source');subjects=[id(f(input,2n))];sources=[id(f(input,1n))];}
  }else if(probeIndex>=0){
   if(measurement&&probeIndex===1){if(children.length!==2||txt(children[0].eventTypeId.payload)!=='event/regulatory-diagnostic-probe-tracking'||txt(children[1].eventTypeId.payload)!==(probe!.permitted?'event/measurement-evidence-intake':'event/measurement-evidence-padding'))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','carriage phase-120 closure');}

   const expectedType=probeIndex===0&&probe!.available?334n:probeIndex===1&&probe!.permitted?203n:probeIndex===5&&probe!.permitted?227n:undefined;
   if(outputs.length!==(expectedType===undefined?0:1)||expectedType!==undefined&&(typeof outputs[0]==='boolean'||outputs[0].kind!=='record'||outputs[0].schema.typeId!==expectedType))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','probe output is outside the fixed producer closure');
   if(!evidence||evidence.patch.operations.length||evidence.diffs.length||key(list(evidence.readDomain.map(statePathPatternValue)))!==key(list(probeIndex===0?[statePathPatternValue(probe!.pattern)]:[]))||(probeIndex!==0&&evidence.actualReadRecords.length))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','probe trace capability/patch mismatch');
   if(probeIndex===0){subjects=[id(probe!.C)];if(!evidence)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','missing probe read evidence');probe!.validateReadEvidence(evidence.actualReadRecords);}
   else if(probe!.permitted&&probeIndex===1){subjects=[id(f(probe!.channel,2n)),id(f(probe!.channel,3n))];sources=[id(f(rec(f(rec(payload,335n),2n),334n),1n))];}
   else if(probe!.permitted&&probeIndex>=2&&probeIndex<=5){const p=rec(f(rec(payload,335n),4n),216n);subjects=[id(f(p,1n))];sources=[id(f(p,2n))];}
  }
  else if(event.phase===110n)subjects=[id(f(fact(f(rec(payload,304n),1n)),1n))];
  else if(event.phase===120n){const p=rec(payload,310n),channel=rec(f(p,2n),201n);subjects=[id(f(channel,2n)),id(f(channel,3n))];sources=[id(f(rec(f(p,1n),200n),9n))];}
  else if(event.phase>=121n&&event.phase<=124n){const p=rec(payload,216n);subjects=[id(f(p,1n))];sources=[id(f(p,2n))];}
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
