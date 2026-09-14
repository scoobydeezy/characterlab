/** combined-observation-opportunity-component/0.1-candidate; trusted source transaction. */
import type {TypedIdentifierValue,CanonicalValue} from '../substrate/canonicalEncoding';
import type {LocalReserveSource} from './localReserveSource';
import type {TrialPanelSource} from './trialPanelSource';
import type {PositionDisplaySource} from './positionDisplaySource';
import {sampleRequestedSources} from './requestedSourceSampling';
import {prepareTrialPanelConsumption,type TrialPanelPerception} from './trialPanelPerception';
import {beginMarkerTransaction,previewMarkerTransaction,commitMarkerTransaction,abortMarkerTransaction,type MarkerTransactionManager} from './transactionalMarkerTracking';
import {compilePerceivedBindings} from '../semanticBinding/perceptualEventFiles';
import {admitObservationLane,freezeAndStageSemanticExperience,OBSERVATION_LANES,type ObservationLane} from '../semanticBinding/phaseOrdering';
export function observeCombinedOpportunity(body:LocalReserveSource,panel:TrialPanelSource,display:PositionDisplaySource,perception:TrialPanelPerception,tracker:MarkerTransactionManager,observer:TypedIdentifierValue,at:bigint,channels:readonly string[],lane:ObservationLane,allocate:()=>bigint){
 if(lane!=='Current'&&lane!=='Consequence')throw Error('COMBINED_OBSERVATION_LANE');
 const used=new Set<bigint>(),next=()=>{const n=allocate();if(typeof n!=='bigint'||n<0n||used.has(n))throw Error('COMBINED_OBSERVATION_ALLOCATION');used.add(n);return n;};
 const sampled=sampleRequestedSources(body,panel,display,observer,at,{bodyChannels:channels,panel:true,visual:true},next);
 const batch=sampled.body!,observerId=(batch.observer.payload as {kind:'text';value:string}).value;
 const panelSample=sampled.panel!.sample,visualSample=sampled.visual!.sample,panelObservation=sampled.panel!.observation,visualObservation=sampled.visual!.observation;
 const eventDetection=panelSample.kind==='Present'||visualSample.kind==='Present'?next():undefined;
 const detection=visualSample.kind==='Present'?next():undefined;
 const proposal=beginMarkerTransaction(tracker,{observerId,observationId:visualObservation,occurredAt:at,detections:visualSample.kind==='Present'?[{detectionId:detection!,glyph:visualSample.glyph}]:[]});
 let committed=false,tx:ReturnType<typeof prepareTrialPanelConsumption>|undefined;
 try{
  tx=prepareTrialPanelConsumption(perception,{observer:observerId,observation:panelObservation,sample:panelSample,...(panelSample.kind==='Present'?{detection:eventDetection}: {})},visualSample.kind==='Present'?{observer:observerId,observation:visualObservation,detection:eventDetection!,at}:undefined);
  const tracks=previewMarkerTransaction(tracker,proposal).transitions,event=tx.result.visualEventTransition??tx.result.transition;
  const bindings=tracks.length?compilePerceivedBindings(tracks.map(t=>({observerId,perceptualEventReferentId:event!.perceptualEventReferentId,perceptualReferentId:t.perceptualReferentId,eventRoleEvidence:{kind:'unresolved' as const},supportingObservationIds:[{observerId,observationId:visualObservation}],occurredAt:at,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'})),next()).bindings:[];
  const present=batch.samples.filter((s):s is Extract<CanonicalValue,{kind:'record'}>=>typeof s!=='boolean'&&s.kind==='record'&&s.schema.typeId===461n);
  const reservation=admitObservationLane({observerId,lane,dueAt:at,emitsCharacterAccessibleEvidence:present.length>0||panelSample.kind==='Present'||visualSample.kind==='Present'},next).reservation;
  const support=present.map(s=>({observerId,observationId:((s.fields.get(1n) as TypedIdentifierValue).payload as {kind:'unsigned';value:bigint}).value}));
  if(panelSample.kind==='Present')support.push({observerId,observationId:panelObservation});if(visualSample.kind==='Present')support.push({observerId,observationId:visualObservation});
  const staged=reservation?freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId,occurredAt:at,perceptualEventReferentIds:event?[event.perceptualEventReferentId]:[],perceivedBindings:bindings,perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:support,transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},OBSERVATION_LANES[lane].phases.ExperienceFreeze):null;
  // Validate the still-live marker proposal before either local owner publishes.
  previewMarkerTransaction(tracker,proposal);tx.commit();commitMarkerTransaction(tracker,proposal);committed=true;
  return {...batch,opportunityId:reservation?.experienceId??null,staged,panel:{observation:panelObservation,sample:panelSample},visual:{observation:visualObservation,detection,sample:visualSample},eventDetection,tracks,perceived:tx.result,context:staged&&tx.result.context?{experience:staged.experience.experienceId,context:structuredClone(tx.result.context),panel:{observation:panelObservation,sample:panelSample}}:undefined};
 }finally{tx?.close();if(!committed)abortMarkerTransaction(tracker,proposal);}
}
