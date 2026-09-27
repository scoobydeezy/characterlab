/** general-source-opportunity-component/0.1-candidate; trusted local transaction. */
import {canonicalEncode,text,typedIdentifier,type TypedIdentifierValue,type CanonicalValue} from '../substrate/canonicalEncoding';
import {observeLocalReserveRecords} from './localReserveObservation';
import type {LocalReserveSource} from './localReserveSource';
import {observeTrialPanel,type TrialPanelSource} from './trialPanelSource';
import {materializePositionScene,type PositionSceneSource} from './positionSceneSource';
import {prepareTrialPanelConsumption,prepareUncontextualizedVisualConsumption,type TrialPanelPerception} from './trialPanelPerception';
import {beginMarkerTransaction,previewMarkerTransaction,commitMarkerTransaction,abortMarkerTransaction,type MarkerTransactionManager} from './transactionalMarkerTracking';
import {compilePerceivedBindings} from '../semanticBinding/perceptualEventFiles';
import {admitObservationLane,freezeAndStageSemanticExperience,OBSERVATION_LANES,type ObservationLane} from '../semanticBinding/phaseOrdering';
import {validateGeneralSourceSchedule} from './generalSourceSchedule';
import type {SourceSamplingRequest} from './requestedSourceSampling';
import {isWindowMarkerManager,prepareWindowMarkerSweep,type WindowMarkerManager} from './windowMarkerTransaction';
import {isWindowPanelManager,prepareWindowPanel,type WindowPanelManager} from './windowPanelTransaction';

export function observeGeneralSourceOpportunity(body:LocalReserveSource|undefined,panel:TrialPanelSource|undefined,scene:PositionSceneSource|undefined,perception:TrialPanelPerception|WindowPanelManager,tracker:MarkerTransactionManager|WindowMarkerManager,observer:TypedIdentifierValue,at:bigint,lane:ObservationLane,request:SourceSamplingRequest,allocate:()=>bigint){
 // Inspect data descriptors before using the request to construct its local domain.
 if(!request||Object.getPrototypeOf(request)!==Object.prototype)throw Error('GENERAL_SOURCE_REQUEST');
 const d=Object.getOwnPropertyDescriptors(request);
 if(Reflect.ownKeys(d).length!==3||['bodyChannels','panel','visual'].some(k=>!d[k]||!('value'in d[k])))throw Error('GENERAL_SOURCE_REQUEST');
 const channels=d.bodyChannels.value;
 if(channels!==null){if(!Array.isArray(channels)||Object.getPrototypeOf(channels)!==Array.prototype)throw Error('GENERAL_SOURCE_REQUEST');const c=Object.getOwnPropertyDescriptors(channels);if(Reflect.ownKeys(c).length!==channels.length+1||Object.values(c).some(p=>!('value'in p)))throw Error('GENERAL_SOURCE_REQUEST');}
 const planned=validateGeneralSourceSchedule([{at,lane,request,use:{bodySelection:false,visualSelection:false,bodyCue:false,visualCue:false,goalAssessment:null}}],{initialClock:0n,horizon:at,channels:channels??[],assessmentDefinitions:[],lifecycleInstants:[]}).entries[0].request;
 if(planned.bodyChannels!==null&&!body||planned.panel&&!panel||planned.visual&&!scene)throw Error('GENERAL_SOURCE_MISSING');
 if(!observer||observer.kind!=='typedIdentifier'||observer.namespaceId!==1000n||typeof observer.payload!=='object'||observer.payload.kind!=='text'||!observer.payload.value)throw Error('GENERAL_SOURCE_OBSERVER');
 canonicalEncode(observer);observer=typedIdentifier(1000,text(observer.payload.value));const observerId=(observer.payload as {value:string}).value;
 const used=new Set<bigint>(),next=()=>{const n=allocate();if(typeof n!=='bigint'||n<0n||used.has(n))throw Error('GENERAL_SOURCE_ALLOCATION');used.add(n);return n;};
 const world=planned.visual?materializePositionScene(scene!,at,next):undefined;
 const batch=planned.bodyChannels===null?undefined:observeLocalReserveRecords(body!,observer,at,planned.bodyChannels,next);
 const p=planned.panel?{sample:observeTrialPanel(panel!,at),observation:next()}:undefined;
 const visualObservation=planned.visual?next():undefined,items=world?.safe.items??[];
 const eventDetection=p?.sample.kind==='Present'||items.length?next():undefined;
 const detected=items.map(item=>({...item,detectionId:next()}));
 const present=(batch?.samples??[]).filter((s):s is Extract<CanonicalValue,{kind:'record'}>=>typeof s!=='boolean'&&s.kind==='record'&&s.schema.typeId===461n);
 const support=present.map(s=>({observerId,observationId:((s.fields.get(1n) as TypedIdentifierValue).payload as {value:bigint}).value}));
 if(p?.sample.kind==='Present')support.push({observerId,observationId:p.observation});if(detected.length)support.push({observerId,observationId:visualObservation!});
 support.sort((a,b)=>a.observationId<b.observationId?-1:a.observationId>b.observationId?1:0);
 const reservation=admitObservationLane({observerId,lane,dueAt:at,emitsCharacterAccessibleEvidence:support.length>0},next).reservation;
 const sweep={observerId,observationId:visualObservation!,occurredAt:at,detections:detected.map(i=>({detectionId:i.detectionId,glyph:i.glyph}))};
 const windowTracker=isWindowMarkerManager(tracker)?tracker:undefined,historyTracker=windowTracker?undefined:tracker as MarkerTransactionManager;
 const windowTx=planned.visual&&windowTracker?prepareWindowMarkerSweep(windowTracker,sweep):undefined;
 const proposal=planned.visual&&historyTracker?beginMarkerTransaction(historyTracker,sweep):undefined;
 let committed=false,tx:ReturnType<typeof prepareTrialPanelConsumption>|ReturnType<typeof prepareUncontextualizedVisualConsumption>|ReturnType<typeof prepareWindowPanel>|undefined;
 try{
  const tracks=windowTx?.result.transitions??(proposal?previewMarkerTransaction(historyTracker!,proposal).transitions:[]);
  const visualEvent=detected.length?{observer:observerId,observation:visualObservation!,detection:eventDetection!,at}:undefined;
  const panelInput=p?{observer:observerId,observation:p.observation,sample:p.sample,...(p.sample.kind==='Present'?{detection:eventDetection}: {})}:undefined;
  if(isWindowPanelManager(perception)){if(panelInput||visualEvent)tx=prepareWindowPanel(perception,panelInput,visualEvent);}
  else if(panelInput)tx=prepareTrialPanelConsumption(perception,panelInput,visualEvent);
  else if(visualEvent)tx=prepareUncontextualizedVisualConsumption(perception,visualEvent);
  const perceived=tx?.result,event=perceived&&'visualEventTransition'in perceived?perceived.visualEventTransition??perceived.transition:perceived?.transition;
  const bindings=compilePerceivedBindings(tracks.map(t=>({observerId,perceptualEventReferentId:event!.perceptualEventReferentId,perceptualReferentId:t.perceptualReferentId,eventRoleEvidence:detected.find(i=>i.detectionId===t.currentDetectionId.detectionOccurrenceId)!.role,supportingObservationIds:[{observerId,observationId:visualObservation!}],occurredAt:at,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'})),0n).bindings.map(b=>({...b,perceivedBindingId:next()}));

  const staged=reservation?freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId,occurredAt:at,perceptualEventReferentIds:event?[event.perceptualEventReferentId]:[],perceivedBindings:bindings,perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:support,transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},OBSERVATION_LANES[lane].phases.ExperienceFreeze):null;
  const context=staged&&p&&perceived&&'context'in perceived&&perceived.context?{experience:staged.experience.experienceId,context:structuredClone(perceived.context),panel:structuredClone(p)}:undefined;
  const result={observer,at,request:planned,truth:world?.truth,opportunityId:reservation?.experienceId??null,staged,...(batch?{body:{...batch,opportunityId:reservation?.experienceId??null,staged}}:{}),...(p?{panel:p}:{}),...(planned.visual?{visual:{observerId,observationId:visualObservation!,occurredAt:at,eventDetectionId:eventDetection,detections:detected.map(i=>({detectionId:i.detectionId,position:{...i.position}}))}}:{}),event,tracks,perceived,context};
  if(proposal)previewMarkerTransaction(historyTracker!,proposal);windowTx?.validate();tx?.commit();if(proposal)commitMarkerTransaction(historyTracker!,proposal);windowTx?.commit();committed=true;return result;
 }finally{tx?.close();windowTx?.close();if(proposal&&!committed)abortMarkerTransaction(historyTracker!,proposal);}
}
