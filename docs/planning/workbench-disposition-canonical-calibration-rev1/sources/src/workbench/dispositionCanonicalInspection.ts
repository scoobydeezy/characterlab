import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {VERSION} from '../campaign3/dispositionPublicModel';
import type {DispositionInspectionSummary} from './dispositionPagedAdapter';
import {scalar} from './nativeTimeline';
import {dispositionCanonicalStoredState} from './dispositionCanonicalStoredState';
import {dispositionCanonicalArchitecture} from './dispositionCanonicalArchitecture';
import {inspectDispositionCanonicalReasons} from './dispositionCanonicalReasons';
import {dispositionCanonicalResolution} from './dispositionCanonicalResolution';
import {dispositionCanonicalFactorSources} from './dispositionCanonicalFactorSources';
import {dispositionCanonicalCalibration} from './dispositionCanonicalCalibration';
export type DispositionDiagnosticSelection={kind:'storedState'}|{kind:'architecture'}|{kind:'reasons';eventId:string}|{kind:'resolution';eventId:string}|{kind:'factorSources';eventId:string}|{kind:'calibration';eventId:string};
/** Worker-side dispatch over one trusted native revision. This is not external save authentication. */
export function dispositionCanonicalInspection(summary:DispositionInspectionSummary,state:CanonicalValue,trace:readonly CanonicalValue[],saveHash:string,selection:DispositionDiagnosticSelection){
 if(saveHash!==summary.saveHash)throw Error('Stale DISPOSITION diagnostic revision');
 if(summary.version!=='disposition-paged-inspection/0.1'||summary.seamVersion!==VERSION||!Number.isInteger(summary.prefix)||summary.prefix<0||summary.prefix>18||summary.clock!==String(summary.prefix)||summary.complete!==(summary.prefix===18)||trace.length!==summary.prefix*10||summary.timeline.length!==trace.length)throw Error('DISPOSITION diagnostic prefix mismatch');
 const events=trace.map(value=>{
  const row=rec(value,160n),event=rec(f(row,4n),130n);
  const named=(name:string)=>{const field=event.schema.fields.find(f=>f.name===name);if(!field)throw Error('Missing canonical diagnostic header');return f(event,field.id);};
  const type=named('EventTypeId');if(typeof type==='boolean'||type.kind!=='typedIdentifier')throw Error('Invalid diagnostic event type');
  return {id:scalar(named('EventId')),instant:scalar(named('DueAt')),phase:scalar(named('Phase')),stage:scalar(type.payload).split('/').at(-1)!,parents:items(named('CausalParentEventIds'),'list').map(scalar),input:f(row,12n),output:f(row,13n),draws:f(row,14n),reads:f(row,11n)};
 });
 if(new Set(events.map(e=>e.id)).size!==events.length)throw Error('Duplicate canonical diagnostic event');
 for(const [i,e]of events.entries()){
  const h=summary.timeline[i];
  if(e.id!==h.id||e.instant!==h.instant||e.phase!==h.phase||e.stage!==h.stage||JSON.stringify(e.parents)!==JSON.stringify(h.parents))throw Error('DISPOSITION diagnostic header mismatch');
 }
 const identity={program:summary.program,seamVersion:summary.seamVersion,prefix:summary.prefix,modelHash:summary.modelHash,runHash:summary.runHash,stateHash:summary.stateHash,saveHash:summary.saveHash};
 const envelope={version:'disposition-canonical-inspection/0.1',identity};
 switch(selection.kind){
  case 'storedState':return {...envelope,selection:{kind:selection.kind},report:dispositionCanonicalStoredState(summary,state)};
  case 'architecture':return {...envelope,selection:{kind:selection.kind},report:dispositionCanonicalArchitecture(summary,state,trace)};
  case 'reasons':{
   const event=events.find(e=>e.id===selection.eventId);if(!event)throw Error('Unknown DISPOSITION reason event');
   return {...envelope,selection:{kind:selection.kind,eventId:selection.eventId},report:inspectDispositionCanonicalReasons(event,event.output)};
  }
  case 'resolution':return {...envelope,selection:{kind:selection.kind,eventId:selection.eventId},report:dispositionCanonicalResolution(events,selection.eventId,summary.seamVersion)};
  case 'factorSources':{
   const event=events.find(e=>e.id===selection.eventId);if(!event)throw Error('Unknown DISPOSITION factor event');
   return {...envelope,selection:{kind:selection.kind,eventId:selection.eventId},report:dispositionCanonicalFactorSources(event,event.output,event.reads)};
  }
  case 'calibration':{
   const event=events.find(e=>e.id===selection.eventId);if(!event)throw Error('Unknown DISPOSITION calibration event');
   return {...envelope,selection:{kind:selection.kind,eventId:selection.eventId},report:dispositionCanonicalCalibration(event,event.input,event.output,event.reads,summary.seamVersion)};
  }
  default:throw Error('Unknown DISPOSITION diagnostic selection');
 }
}
