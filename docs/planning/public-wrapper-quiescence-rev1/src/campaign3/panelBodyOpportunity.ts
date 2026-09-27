/** panel-body-opportunity-component/0.1-candidate; trusted source/lane/allocator. */
import type {TypedIdentifierValue,CanonicalValue} from '../substrate/canonicalEncoding';
import {sampleRequestedSources} from './requestedSourceSampling';
import type {LocalReserveSource} from './localReserveSource';
import type {TrialPanelSource} from './trialPanelSource';
import {prepareTrialPanelConsumption,type TrialPanelPerception} from './trialPanelPerception';
import {admitObservationLane,freezeAndStageSemanticExperience,OBSERVATION_LANES,type ObservationLane} from '../semanticBinding/phaseOrdering';

export function observePanelBodyOpportunity(body:LocalReserveSource,panel:TrialPanelSource,perception:TrialPanelPerception,observer:TypedIdentifierValue,at:bigint,channels:readonly string[],lane:ObservationLane,allocate:()=>bigint){
 if(lane!=='Current'&&lane!=='Consequence')throw Error('PANEL_BODY_LANE');
 const used=new Set<bigint>(),next=()=>{const n=allocate();if(typeof n!=='bigint'||n<0n||used.has(n))throw Error('PANEL_BODY_ALLOCATION');used.add(n);return n;};
 const sampled=sampleRequestedSources(body,panel,undefined,observer,at,{bodyChannels:channels,panel:true,visual:false},next);
 const batch=sampled.body!,sample=sampled.panel!.sample,observation=sampled.panel!.observation,detection=sample.kind==='Present'?next():undefined;
 const observerId=(batch.observer.payload as {kind:'text';value:string}).value;
 const tx=prepareTrialPanelConsumption(perception,{observer:observerId,observation,sample,...(detection===undefined?{}:{detection})});
 try{
  const present=batch.samples.filter((s):s is Extract<CanonicalValue,{kind:'record'}>=>typeof s!=='boolean'&&s.kind==='record'&&s.schema.typeId===461n);
  const reservation=admitObservationLane({observerId,lane,dueAt:at,emitsCharacterAccessibleEvidence:sample.kind==='Present'||present.length>0},next).reservation;
  const support=present.map(s=>({observerId,observationId:((s.fields.get(1n) as TypedIdentifierValue).payload as {kind:'unsigned';value:bigint}).value}));
  if(sample.kind==='Present')support.push({observerId,observationId:observation});
  const staged=reservation?freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId,occurredAt:at,perceptualEventReferentIds:tx.result.context?[tx.result.context]:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:support,transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},OBSERVATION_LANES[lane].phases.ExperienceFreeze):null;
  tx.commit();
  return {...batch,opportunityId:reservation?.experienceId??null,staged,panel:{observation,detection,sample},perceived:tx.result,context:staged&&tx.result.context?{experience:staged.experience.experienceId,context:structuredClone(tx.result.context),panel:{observation,sample}}:undefined};
 }finally{tx.close();}
}
