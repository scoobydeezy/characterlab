/** spatial-evidence-binding-component/0.1-candidate; completed-product structural join. */
import {canonicalEncode,bytesToHex} from '../substrate/canonicalEncoding';
import {perceptualReferentIdValue,perceptualEventReferentIdValue,perceptualTrackTransitionValue,assertAdmittedTransformationVersion} from '../semanticBinding/semanticCodecs';
import {assemblePreRecognitionExperience,type PreRecognitionSemanticExperience,type PerceptualEventTransition} from '../semanticBinding/perceptualEventFiles';
import type {PerceptualTrackTransition} from '../semanticBinding/perceptualContinuantFiles';
import {allocateSpatialContext,type SpatialDetection,type SpatialCalibration} from './spatialContextAllocation';
const fail=(why:string):never=>{throw Error('SPATIAL_BINDING_'+why);};
const ref=(v:PerceptualTrackTransition['perceptualReferentId'])=>bytesToHex(canonicalEncode(perceptualReferentIdValue(v)));
const event=(v:PerceptualEventTransition['perceptualEventReferentId'])=>bytesToHex(canonicalEncode(perceptualEventReferentIdValue(v)));
export interface SpatialEvidenceBindingInput {
 readonly observation:{readonly observerId:string;readonly observationId:bigint;readonly occurredAt:bigint;readonly eventDetectionId:bigint;readonly detections:readonly SpatialDetection[]};
 readonly tracks:readonly PerceptualTrackTransition[];
 readonly event:PerceptualEventTransition;
 readonly experience:PreRecognitionSemanticExperience;
}
export function bindSpatialEvidence(input:SpatialEvidenceBindingInput,calibration:SpatialCalibration){
 const o=input.observation,e=input.event,x=assemblePreRecognitionExperience(input.experience);
 assertAdmittedTransformationVersion(e.transformationVersion);
 if(typeof o.observationId!=='bigint'||o.observationId<0n||typeof o.eventDetectionId!=='bigint'||o.eventDetectionId<0n||typeof o.occurredAt!=='bigint'||o.occurredAt<0n||!o.observerId)fail('OBSERVATION');
 if(o.observerId!==x.observerId||o.occurredAt!==x.occurredAt||e.observerId!==o.observerId||e.occurredAt!==o.occurredAt||e.currentEventDetectionId.observerId!==o.observerId||e.currentEventDetectionId.eventDetectionOccurrenceId!==o.eventDetectionId||e.perceptualEventReferentId.observerId!==o.observerId)fail('EVENT');
 const support=(s:{observerId:string;observationId:bigint})=>s.observerId===o.observerId&&s.observationId===o.observationId;
 if(x.perceptualEventReferentIds.length!==1||event(x.perceptualEventReferentIds[0])!==event(e.perceptualEventReferentId)||!x.supportingObservationIds.some(support))fail('EXPERIENCE');
 if(!Array.isArray(o.detections)||o.detections.length<1||o.detections.length>3||!Array.isArray(input.tracks)||input.tracks.length!==o.detections.length||Array.from({length:input.tracks.length},(_,i)=>!Object.hasOwn(input.tracks,i)).some(Boolean))fail('CARDINALITY');
 const allocated=allocateSpatialContext(o.detections,calibration),tracks=new Map<bigint,PerceptualTrackTransition>(),files=new Set<string>();
 for(const t of input.tracks){
  if(t.observerId!==o.observerId||t.currentDetectionId.observerId!==o.observerId||t.perceptualReferentId.observerId!==o.observerId||t.occurredAt!==o.occurredAt||!t.supportingObservationIds.some(support)||t.supportingObservationIds.some(s=>s.observerId!==o.observerId))fail('TRACK');
  perceptualTrackTransitionValue({observerId:t.observerId,priorPerceptualReferentId:t.priorPerceptualReferentId,perceptualReferentId:t.perceptualReferentId,detectionOrdinal:t.currentDetectionId.detectionOccurrenceId,continuityKind:t.continuityKind,supportingObservationOrdinals:t.supportingObservationIds.map(s=>s.observationId),occurredAt:t.occurredAt,transformationVersion:t.transformationVersion});
  const id=t.currentDetectionId.detectionOccurrenceId,k=ref(t.perceptualReferentId);if(tracks.has(id)||files.has(k))fail('DUPLICATE_TRACK');tracks.set(id,t);files.add(k);
 }
 const bound=new Set<string>();
 for(const b of x.perceivedBindings){if(b.observerId!==o.observerId||b.occurredAt!==o.occurredAt||event(b.perceptualEventReferentId)!==event(e.perceptualEventReferentId)||!files.has(ref(b.perceptualReferentId))||!b.supportingObservationIds.some(support))fail('BINDING');bound.add(ref(b.perceptualReferentId));}
 if(bound.size!==files.size)fail('UNBOUND_TRACK');
 const peripheralCount=allocated.filter(a=>a.spatialClass==='SpatialPeripheral').length;
 return allocated.map(a=>{const t=tracks.get(a.detectionId);if(!t)fail('MISSING_DETECTION');return {...a,unit:{perceptualEventReferentId:structuredClone(e.perceptualEventReferentId),perceptualReferentId:structuredClone(t!.perceptualReferentId)},peripheralCount};});
}
