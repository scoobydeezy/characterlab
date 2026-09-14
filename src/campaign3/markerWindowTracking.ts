/** marker-window-tracking/0.1-candidate. Owner candidate, not public input admission. */
import {clonePerceptualContinuantFileState,applyPerceptualTrackTransition,PERCEPTUAL_CONTINUANT_FILE_CONTRACT_VERSION as version,type PerceptualContinuantFileState,type PerceptualReferentId,type PerceptualTrackTransition} from '../semanticBinding/perceptualContinuantFiles';
import {canonicalEncode,text} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import type {MarkerSweep} from './observedMarkerTracking';

export interface TrackingWindowItem {readonly file:PerceptualReferentId;readonly glyph?:bigint}
export interface TrackingWindow {readonly at:bigint;readonly observation:bigint|null;readonly items:readonly TrackingWindowItem[]}
function fail(why:string):never{throw Error('MARKER_WINDOW_'+why);}
function exact(value:unknown,required:readonly string[],optional:readonly string[]=[]){
 if(!value||typeof value!=='object'||Object.getPrototypeOf(value)!==Object.prototype)fail('DATA');
 const d=Object.getOwnPropertyDescriptors(value);
 if(Reflect.ownKeys(d).some(k=>typeof k!=='string'||!required.includes(k)&&!optional.includes(k))||required.some(k=>!d[k])||Object.values(d).some(p=>!('value'in p)))fail('DATA');
}
function dense(value:unknown,max:number):asserts value is readonly unknown[]{
 if(!Array.isArray(value)||Object.getPrototypeOf(value)!==Array.prototype||value.length>max)fail('BOUND');
 const d=Object.getOwnPropertyDescriptors(value);
 if(Reflect.ownKeys(d).length!==value.length+1||Object.values(d).some(p=>!('value'in p))||Array.from({length:value.length},(_,i)=>!d[String(i)]).some(Boolean))fail('DATA');
}
function ordinal(n:unknown):asserts n is bigint{if(typeof n!=='bigint'||n<0n)fail('ORDINAL');}
function glyph(n:unknown){if(n!==undefined&&(typeof n!=='bigint'||n<0n||n>7n))fail('GLYPH');}
function instant(n:bigint){simInstant(n);if(n<0n)fail('TIME');}
const sameFile=(a:PerceptualReferentId,b:PerceptualReferentId)=>a.observerId===b.observerId&&a.observerTrackSequence===b.observerTrackSequence;

/** Only the last completed sweep is cognitive matching state. The admitted source owns uniqueness. */
export function advanceMarkerWindow(observer:string,files:PerceptualContinuantFileState,window:TrackingWindow,input:MarkerSweep){
 if(typeof observer!=='string'||!observer||observer!==observer.normalize('NFC'))fail('OBSERVER');canonicalEncode(text(observer));
 exact(window,['at','observation','items']);instant(window.at);dense(window.items,3);
 // The accepted SEM owner validates and clones its own allocator/active-file representation.
 let state=clonePerceptualContinuantFileState(files);
 if([...state.nextTrackSequenceByObserver.keys()].some(k=>k!==observer)||state.activePerceptualReferentIds.some(f=>f.observerId!==observer)||(state.nextTrackSequenceByObserver.get(observer)??0n)>30n)fail('FILE_DOMAIN');
 if(window.observation===null){if(window.at!==0n||window.items.length||state.activePerceptualReferentIds.length||(state.nextTrackSequenceByObserver.get(observer)??0n)!==0n)fail('INITIAL');}
 else{ordinal(window.observation);if(window.at===0n)fail('INITIAL');}
 const seen=new Set<bigint>();
 for(const item of window.items){
  exact(item,['file'],['glyph']);exact(item.file,['observerId','observerTrackSequence']);ordinal(item.file.observerTrackSequence);glyph(item.glyph);
  if(item.file.observerId!==observer||seen.has(item.file.observerTrackSequence)||!state.activePerceptualReferentIds.some(f=>sameFile(f,item.file)))fail('WINDOW_FILE');seen.add(item.file.observerTrackSequence);
 }
 exact(input,['observerId','observationId','occurredAt','detections']);instant(input.occurredAt);ordinal(input.observationId);
 if(input.observerId!==observer||input.occurredAt<=window.at||input.observationId===window.observation)fail('SOURCE_BINDING');
 dense(input.detections,3);let last=-1n;
 const detections=input.detections.map(d=>{exact(d,['detectionId'],['glyph']);ordinal(d.detectionId);glyph(d.glyph);if(d.detectionId<=last)fail('DETECTION_ORDER');last=d.detectionId;return {...d};});
 const items:TrackingWindowItem[]=[],transitions:PerceptualTrackTransition[]=[];
 for(const d of detections){
  const old=window.items.filter(p=>d.glyph!==undefined&&p.glyph===d.glyph);
  const unique=d.glyph!==undefined&&old.length===1&&detections.filter(p=>p.glyph===d.glyph).length===1;
  const prior=unique?old[0].file:undefined;
  const support=[input.observationId,...(unique?[window.observation!]:[])].sort((a,b)=>a<b?-1:a>b?1:0);
  const result=applyPerceptualTrackTransition(state,{observerId:observer,currentDetectionId:{observerId:observer,detectionOccurrenceId:d.detectionId},continuityKind:prior?'ContinuesPriorTrack':'NewTrack',...(prior?{priorPerceptualReferentId:prior}:{}),supportingObservationIds:support.map(observationId=>({observerId:observer,observationId})),occurredAt:input.occurredAt,transformationVersion:version});
  state=result.state;transitions.push(result.transition);items.push({file:result.transition.perceptualReferentId,glyph:d.glyph});
 }
 if((state.nextTrackSequenceByObserver.get(observer)??0n)>30n)fail('FILE_BOUND');
 return {files:state,window:{at:input.occurredAt,observation:input.observationId,items:structuredClone(items)} as TrackingWindow,transitions:structuredClone(transitions)};
}
