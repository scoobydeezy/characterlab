/** trial-panel-perception/0.1-candidate; supplied completed observation boundary. */
import {applyPerceptualEventTransition,endPerceptualEventFile,emptyPerceptualEventFileState,clonePerceptualEventFileState,type PerceptualEventFileState,type PerceptualEventReferentId,type PerceptualEventEnd} from '../semanticBinding/perceptualEventFiles';
import type {observeTrialPanel} from './trialPanelSource';
declare const brand:unique symbol;export interface TrialPanelPerception {readonly [brand]:true}
type State={observer:string;files:PerceptualEventFileState;window?:{glyph:number;context:PerceptualEventReferentId};at?:bigint;observations:Set<bigint>;detections:Set<bigint>;visualObservations:Set<bigint>};
const states=new WeakMap<object,State>(),version='semantic-binding/0.1-candidate#SEM-001C';
const fail=(why:string):never=>{throw Error('TRIAL_PANEL_PERCEPTION_'+why);};
const get=(token:TrialPanelPerception)=>states.get(token)??fail('TOKEN');
export function createTrialPanelPerception(observer:string):TrialPanelPerception{if(typeof observer!=='string'||!observer)fail('OBSERVER');const token=Object.freeze({}) as TrialPanelPerception;states.set(token,{observer,files:emptyPerceptualEventFileState(),observations:new Set(),detections:new Set(),visualObservations:new Set()});return token;}
export function trialPanelPerceptionSnapshot(token:TrialPanelPerception){const s=get(token);return {observer:s.observer,files:clonePerceptualEventFileState(s.files),window:s.window?structuredClone(s.window):undefined,at:s.at,observations:[...s.observations],detections:[...s.detections],visualObservations:[...s.visualObservations]};}
type PanelInput={readonly observer:string;readonly observation:bigint;readonly detection?:bigint;readonly sample:ReturnType<typeof observeTrialPanel>};
export interface VisualEventDetection {readonly observer:string;readonly observation:bigint;readonly detection:bigint;readonly at:bigint}
export function consumeTrialPanel(token:TrialPanelPerception,input:PanelInput){const {visualEventTransition,...panel}=consumePanel(token,input);return panel;}
/** panel-visual-event-composition/0.1-candidate; supplied completed visual detection. */
export function consumeTrialPanelAndVisual(token:TrialPanelPerception,input:PanelInput,visual:VisualEventDetection|undefined){return consumePanel(token,input,visual);}
/** visual-cue-event-component/0.1-candidate; no panel was sampled. */
export function consumeUncontextualizedVisualCue(token:TrialPanelPerception,visual:VisualEventDetection){
 const s=get(token);if(s.window)fail('UNSAMPLED_ACTIVE_CONTEXT');
 if(visual.observer!==s.observer||typeof visual.at!=='bigint'||visual.at<0n||s.at!==undefined&&visual.at<=s.at)fail('VISUAL_BINDING');
 if(typeof visual.observation!=='bigint'||visual.observation<0n||s.observations.has(visual.observation)||s.visualObservations.has(visual.observation)||s.visualObservations.size>=16)fail('VISUAL_OBSERVATION');
 if(typeof visual.detection!=='bigint'||visual.detection<0n||s.detections.has(visual.detection))fail('VISUAL_DETECTION');
 const support=[{observerId:s.observer,observationId:visual.observation}],r=applyPerceptualEventTransition(clonePerceptualEventFileState(s.files),{observerId:s.observer,currentEventDetectionId:{observerId:s.observer,eventDetectionOccurrenceId:visual.detection},continuityKind:'NewEventFile',supportingObservationIds:support,occurredAt:visual.at,transformationVersion:version});
 const end=endPerceptualEventFile(r.state,{observerId:s.observer,perceptualEventReferentId:r.transition.perceptualEventReferentId,supportingObservationIds:support,occurredAt:visual.at,transformationVersion:version});
 states.set(token,{...s,files:end.state,at:visual.at,visualObservations:new Set([...s.visualObservations,visual.observation]),detections:new Set([...s.detections,visual.detection])});
 return structuredClone({transition:r.transition,end:end.eventEnd});
}
/** Transaction-local preparation; no serialized token or restoration authority. */
export function prepareUncontextualizedVisualConsumption(token:TrialPanelPerception,visual:VisualEventDetection){
 const prior=get(token),temporary=Object.freeze({}) as TrialPanelPerception;states.set(temporary,structuredClone(prior));
 let candidate:State,result:ReturnType<typeof consumeUncontextualizedVisualCue>;
 try{result=consumeUncontextualizedVisualCue(temporary,visual);candidate=get(temporary);}finally{states.delete(temporary);}
 let closed=false;
 return Object.freeze({result,commit(){if(closed||get(token)!==prior)fail('STALE_TRANSACTION');states.set(token,candidate);closed=true;},close(){closed=true;}});
}
/** Transaction-local preparation; no serialized token or restoration authority. */
export function prepareTrialPanelConsumption(token:TrialPanelPerception,input:PanelInput,visual?:VisualEventDetection){
 const prior=get(token),temporary=Object.freeze({}) as TrialPanelPerception;states.set(temporary,structuredClone(prior));
 let candidate:State,result:ReturnType<typeof consumePanel>;
 try{result=consumePanel(temporary,input,visual);candidate=get(temporary);}finally{states.delete(temporary);}
 let closed=false;
 return Object.freeze({result,commit(){if(closed||get(token)!==prior)fail('STALE_TRANSACTION');states.set(token,candidate);closed=true;},close(){closed=true;}});
}
function consumePanel(token:TrialPanelPerception,input:PanelInput,visual?:VisualEventDetection){
 const s=get(token),sample=input.sample;
 if(input.observer!==s.observer)fail('OBSERVER');
 if(!sample||typeof sample.at!=='bigint'||sample.at<0n||s.at!==undefined&&sample.at<=s.at)fail('TIME');
 if(typeof input.observation!=='bigint'||input.observation<0n||s.observations.has(input.observation)||s.visualObservations.has(input.observation)||s.observations.size>=16)fail('OBSERVATION');
 if(sample.kind==='Present'){if(!Number.isInteger(sample.glyph)||sample.glyph<0||sample.glyph>7||!['Before','Motion','After'].includes(sample.stage))fail('DOMAIN');if(typeof input.detection!=='bigint'||input.detection<0n||s.detections.has(input.detection))fail('DETECTION');}
 else if(sample.kind!=='Unavailable'||input.detection!==undefined)fail('DOMAIN');
 if(visual){if(visual.observer!==s.observer||visual.at!==sample.at)fail('VISUAL_BINDING');if(typeof visual.observation!=='bigint'||visual.observation<0n||visual.observation===input.observation||s.observations.has(visual.observation)||s.visualObservations.has(visual.observation)||s.visualObservations.size>=16)fail('VISUAL_OBSERVATION');if(typeof visual.detection!=='bigint'||visual.detection<0n||s.detections.has(visual.detection)||sample.kind==='Present'&&visual.detection!==input.detection)fail('VISUAL_DETECTION');}
 let files=clonePerceptualEventFileState(s.files),window=s.window?structuredClone(s.window):undefined;
 const support=[{observerId:s.observer,observationId:input.observation}],ends:PerceptualEventEnd[]=[];
 const end=()=>{if(window){const result=endPerceptualEventFile(files,{observerId:s.observer,perceptualEventReferentId:window.context,supportingObservationIds:support,occurredAt:sample.at,transformationVersion:version});files=result.state;ends.push(result.eventEnd);window=undefined;}};
 let transition:ReturnType<typeof applyPerceptualEventTransition>['transition']|undefined;
 if(sample.kind==='Unavailable')end();
 else{
  if(window&&(sample.stage==='Before'||window.glyph!==sample.glyph))end();
  const result=applyPerceptualEventTransition(files,{observerId:s.observer,currentEventDetectionId:{observerId:s.observer,eventDetectionOccurrenceId:input.detection!},continuityKind:window?'ContinuesPriorEventFile':'NewEventFile',...(window?{priorPerceptualEventReferentId:window.context}:{}),supportingObservationIds:support,occurredAt:sample.at,transformationVersion:version});files=result.state;transition=result.transition;window={glyph:sample.glyph,context:transition.perceptualEventReferentId};
  if(sample.stage==='After')end();
 }
 let visualEventTransition=visual?transition:undefined;
 if(visual&&!visualEventTransition){
  const support=[{observerId:s.observer,observationId:visual.observation}];
  const result=applyPerceptualEventTransition(files,{observerId:s.observer,currentEventDetectionId:{observerId:s.observer,eventDetectionOccurrenceId:visual.detection},continuityKind:'NewEventFile',supportingObservationIds:support,occurredAt:sample.at,transformationVersion:version});files=result.state;visualEventTransition=result.transition;
  const ended=endPerceptualEventFile(files,{observerId:s.observer,perceptualEventReferentId:result.transition.perceptualEventReferentId,supportingObservationIds:support,occurredAt:sample.at,transformationVersion:version});files=ended.state;ends.push(ended.eventEnd);
 }
 const observations=new Set(s.observations),detections=new Set(s.detections),visualObservations=new Set(s.visualObservations);observations.add(input.observation);if(input.detection!==undefined)detections.add(input.detection);if(visual){visualObservations.add(visual.observation);detections.add(visual.detection);}
 states.set(token,{observer:s.observer,files,window,at:sample.at,observations,detections,visualObservations});
 return structuredClone({transition,ends,context:transition?.perceptualEventReferentId,stage:sample.kind==='Present'?sample.stage:undefined,visualEventTransition});
}
