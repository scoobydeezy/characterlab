/** position-scene-opportunity-component/0.1-candidate; trusted source transaction. */
import {canonicalEncode,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {materializePositionScene,type PositionSceneSource} from './positionSceneSource';
import {beginMarkerTransaction,previewMarkerTransaction,commitMarkerTransaction,abortMarkerTransaction,type MarkerTransactionManager} from './transactionalMarkerTracking';
import {prepareUncontextualizedVisualConsumption,type TrialPanelPerception} from './trialPanelPerception';
import {compilePerceivedBindings} from '../semanticBinding/perceptualEventFiles';
import {admitObservationLane,freezeAndStageSemanticExperience,OBSERVATION_LANES,type ObservationLane} from '../semanticBinding/phaseOrdering';
export function observePositionSceneOpportunity(source:PositionSceneSource,tracker:MarkerTransactionManager,perception:TrialPanelPerception,observer:TypedIdentifierValue,at:bigint,lane:ObservationLane,allocate:()=>bigint){
 if(lane!=='Current'&&lane!=='Consequence')throw Error('SCENE_OPPORTUNITY_LANE');
 if(!observer||observer.kind!=='typedIdentifier'||observer.namespaceId!==1000n||typeof observer.payload==='boolean'||observer.payload.kind!=='text'||!observer.payload.value)throw Error('SCENE_OPPORTUNITY_OBSERVER');
 canonicalEncode(observer);const observerId=observer.payload.value,used=new Set<bigint>(),next=()=>{const n=allocate();if(typeof n!=='bigint'||n<0n||used.has(n))throw Error('SCENE_OPPORTUNITY_ALLOCATION');used.add(n);return n;};
 const materialized=materializePositionScene(source,at,next),observationId=next(),eventDetectionId=materialized.safe.items.length?next():undefined;
 const detected=materialized.safe.items.map(item=>({...item,detectionId:next()}));
 const proposal=beginMarkerTransaction(tracker,{observerId,observationId,occurredAt:at,detections:detected.map(d=>({detectionId:d.detectionId,glyph:d.glyph}))});
 let committed=false,tx:ReturnType<typeof prepareUncontextualizedVisualConsumption>|undefined;
 try{
  const tracks=previewMarkerTransaction(tracker,proposal).transitions;
  if(eventDetectionId!==undefined)tx=prepareUncontextualizedVisualConsumption(perception,{observer:observerId,observation:observationId,detection:eventDetectionId,at});
  const event=tx?.result.transition,supportingObservationIds=[{observerId,observationId}];
  const requests=tracks.map(t=>({observerId,perceptualEventReferentId:event!.perceptualEventReferentId,perceptualReferentId:t.perceptualReferentId,eventRoleEvidence:detected.find(d=>d.detectionId===t.currentDetectionId.detectionOccurrenceId)!.role,supportingObservationIds,occurredAt:at,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'}));
  // Canonical request order is semantic; each result receives its actual shared slot.
  const bindings=compilePerceivedBindings(requests,0n).bindings.map(b=>({...b,perceivedBindingId:next()}));
  const reservation=admitObservationLane({observerId,lane,dueAt:at,emitsCharacterAccessibleEvidence:detected.length>0},next).reservation;
  const staged=reservation?freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId,occurredAt:at,perceptualEventReferentIds:[event!.perceptualEventReferentId],perceivedBindings:bindings,perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds,transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},OBSERVATION_LANES[lane].phases.ExperienceFreeze):null;
  previewMarkerTransaction(tracker,proposal);tx?.commit();commitMarkerTransaction(tracker,proposal);committed=true;
  return {truth:materialized.truth,observation:{observerId,observationId,occurredAt:at,eventDetectionId,detections:detected.map(d=>({detectionId:d.detectionId,position:{...d.position}}))},tracks,event,end:tx?.result.end,staged};
 }finally{tx?.close();if(!committed)abortMarkerTransaction(tracker,proposal);}
}
