/** observed-marker-tracking/0.1-candidate: component only, not an observation source. */
import {emptyPerceptualContinuantFileState,clonePerceptualContinuantFileState,applyPerceptualTrackTransition,PERCEPTUAL_CONTINUANT_FILE_CONTRACT_VERSION as version,type PerceptualContinuantFileState,type PerceptualTrackTransition,type PerceptualReferentId} from '../semanticBinding/perceptualContinuantFiles';
export interface MarkerDetection {readonly detectionId:bigint;readonly glyph?:bigint;}
export interface MarkerSweep {readonly observerId:string;readonly observationId:bigint;readonly occurredAt:bigint;readonly detections:readonly MarkerDetection[];}
declare const brand:unique symbol;export interface MarkerTracker {readonly [brand]:true;}
type Previous={glyph:bigint|undefined;file:PerceptualReferentId}[];
type Facts={observer:string;state:PerceptualContinuantFileState;previous:Previous;observation:bigint|undefined;at:bigint|undefined;used:Set<bigint>;sweeps:number;horizon:8|9|10;maximumDetections:3|8};
const facts=new WeakMap<object,Facts>();
const fail=(why:string):never=>{throw new Error('observed marker tracking: '+why);};
function own(value:object,required:readonly string[],optional:readonly string[]=[]){if(!value||Object.getPrototypeOf(value)!==Object.prototype)fail('plain data required');const d=Object.getOwnPropertyDescriptors(value);if(Reflect.ownKeys(d).some(k=>typeof k!=='string'||!required.includes(k)&&!optional.includes(k))||required.some(k=>!d[k])||Object.values(d).some(v=>!('value'in v)))fail('exact nonexecutable fields required');}
const ordinal=(n:bigint)=>{if(typeof n!=='bigint'||n<0n)fail('nonnegative source ordinal');};
export function createMarkerTracker(observer:string):MarkerTracker {return create(observer,8,8);}
/** nine-sweep-marker-component/0.1-candidate; fixed successor, not a caller budget. */
export function createNineSweepMarkerTracker(observer:string):MarkerTracker {return create(observer,9,3);}
/** ten-sweep-marker-component/0.1-candidate; final competing acquisition. */
export function createTenSweepMarkerTracker(observer:string):MarkerTracker {return create(observer,10,3);}
function create(observer:string,horizon:8|9|10,maximumDetections:3|8):MarkerTracker {if(typeof observer!=='string'||!observer)fail('observer required');const token=Object.freeze({}) as MarkerTracker;facts.set(token,{observer,state:emptyPerceptualContinuantFileState(),previous:[],observation:undefined,at:undefined,used:new Set(),sweeps:0,horizon,maximumDetections});return token;}
const get=(token:MarkerTracker)=>facts.get(token)??fail('actual tracker required');
export function markerTrackingSnapshot(token:MarkerTracker){const f=get(token);return {observer:f.observer,state:clonePerceptualContinuantFileState(f.state),previous:structuredClone(f.previous),observation:f.observation,at:f.at,used:[...f.used],sweeps:f.sweeps};}
export function applyMarkerSweep(token:MarkerTracker,input:MarkerSweep):readonly PerceptualTrackTransition[]{
 const f=get(token);own(input,['observerId','observationId','occurredAt','detections']);if(input.observerId!==f.observer)fail('foreign observer');ordinal(input.observationId);ordinal(input.occurredAt);if(f.sweeps>=f.horizon||f.at!==undefined&&input.occurredAt<=f.at)fail('time or horizon');
 if(!Array.isArray(input.detections)||Object.getPrototypeOf(input.detections)!==Array.prototype||input.detections.length>f.maximumDetections)fail('bounded detections');const properties=Object.getOwnPropertyDescriptors(input.detections);if(Reflect.ownKeys(properties).some(k=>k!=='length'&&(typeof k!=='string'||! /^(0|[1-9][0-9]*)$/.test(k)))||Object.values(properties).some(p=>!('value'in p)))fail('plain detection array');
 if(Object.keys(properties).length!==input.detections.length+1)fail('dense detection array');
 const used=new Set(f.used);if(used.has(input.observationId))fail('replayed observation');used.add(input.observationId);let last=-1n;
 const detections=input.detections.map(d=>{own(d,['detectionId'],['glyph']);ordinal(d.detectionId);if(d.detectionId<=last||used.has(d.detectionId))fail('replayed or unordered detection');last=d.detectionId;used.add(d.detectionId);if(d.glyph!==undefined&&(typeof d.glyph!=='bigint'||d.glyph<0n||d.glyph>7n))fail('glyph domain');return {detectionId:d.detectionId,glyph:d.glyph};});
 // No state is published until all requests and actual SEM transitions succeed.
 let state=clonePerceptualContinuantFileState(f.state);const transitions:PerceptualTrackTransition[]=[],previous:Previous=[];
 for(const d of detections){const old=f.previous.filter(p=>d.glyph!==undefined&&p.glyph===d.glyph),unique=d.glyph!==undefined&&old.length===1&&detections.filter(x=>x.glyph===d.glyph).length===1,prior=unique?old[0].file:undefined,support=[input.observationId,...(unique?[f.observation!]:[])].sort((a,b)=>a<b?-1:a>b?1:0);
  const result=applyPerceptualTrackTransition(state,{observerId:f.observer,currentDetectionId:{observerId:f.observer,detectionOccurrenceId:d.detectionId},continuityKind:prior?'ContinuesPriorTrack':'NewTrack',...(prior?{priorPerceptualReferentId:prior}:{}),supportingObservationIds:support.map(observationId=>({observerId:f.observer,observationId})),occurredAt:input.occurredAt,transformationVersion:version});state=result.state;transitions.push(result.transition);previous.push({glyph:d.glyph,file:result.transition.perceptualReferentId});
 }
 facts.set(token,{observer:f.observer,state,previous,observation:input.observationId,at:input.occurredAt,used,sweeps:f.sweeps+1,horizon:f.horizon,maximumDetections:f.maximumDetections});return structuredClone(transitions);
}
