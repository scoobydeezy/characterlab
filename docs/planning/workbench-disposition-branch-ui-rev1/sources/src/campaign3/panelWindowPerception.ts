/** panel-window-perception/0.1-candidate. Supplied admitted observations and owner state. */
import {applyPerceptualEventTransition,endPerceptualEventFile,clonePerceptualEventFileState,type PerceptualEventFileState,type PerceptualEventReferentId,type PerceptualEventEnd,type PerceptualEventTransition} from '../semanticBinding/perceptualEventFiles';
import {canonicalEncode,text} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import type {consumeTrialPanel,VisualEventDetection} from './trialPanelPerception';
export type PanelWindowInput=Parameters<typeof consumeTrialPanel>[1];
export interface PanelWindow {readonly at:bigint;readonly active?:{readonly glyph:number;readonly context:PerceptualEventReferentId}}
const version='semantic-binding/0.1-candidate#SEM-001C';
function fail(why:string):never{throw Error('PANEL_WINDOW_'+why);}
function exact(v:unknown,required:readonly string[],optional:readonly string[]=[]){if(!v||typeof v!=='object'||Object.getPrototypeOf(v)!==Object.prototype)fail('DATA');const d=Object.getOwnPropertyDescriptors(v);if(required.some(k=>!d[k])||Reflect.ownKeys(d).some(k=>typeof k!=='string'||!required.includes(k)&&!optional.includes(k))||Object.values(d).some(p=>!('value'in p)))fail('DATA');}
function ordinal(n:unknown):asserts n is bigint{if(typeof n!=='bigint'||n<0n)fail('ORDINAL');}
const same=(a:PerceptualEventReferentId,b:PerceptualEventReferentId)=>a.observerId===b.observerId&&a.observerEventSequence===b.observerEventSequence;
/** No observation archive or duplicate SEM allocator is needed to restore segmentation. */
export function advancePanelWindow(observer:string,prior:PerceptualEventFileState,window:PanelWindow,panel?:PanelWindowInput,visual?:VisualEventDetection){
 if(typeof observer!=='string'||!observer||observer!==observer.normalize('NFC'))fail('OBSERVER');canonicalEncode(text(observer));
 exact(window,['at'],['active']);simInstant(window.at);if(window.at<0n)fail('TIME');
 let files=clonePerceptualEventFileState(prior);
 if([...files.nextEventSequenceByObserver.keys()].some(k=>k!==observer)||files.activeEventFiles.some(f=>f.observerId!==observer)||(files.nextEventSequenceByObserver.get(observer)??0n)>26n)fail('FILE_DOMAIN');
 if(window.active!==undefined){exact(window.active,['glyph','context']);exact(window.active.context,['observerId','observerEventSequence']);ordinal(window.active.context.observerEventSequence);if(!Number.isInteger(window.active.glyph)||window.active.glyph<0||window.active.glyph>7||window.active.context.observerId!==observer||files.activeEventFiles.length!==1||!same(files.activeEventFiles[0],window.active.context))fail('ACTIVE');}
 else if(files.activeEventFiles.length)fail('ACTIVE');
 let active=window.active?structuredClone(window.active):undefined;
 if(window.at===0n&&(active||(files.nextEventSequenceByObserver.get(observer)??0n)!==0n))fail('INITIAL');
 if(!panel&&!visual)fail('SOURCE');
 if(panel){exact(panel,['observer','observation','sample'],['detection']);exact(panel.sample,['kind','at'],['glyph','stage']);exact(panel.sample,panel.sample.kind==='Present'?['kind','at','glyph','stage']:['kind','at']);ordinal(panel.observation);if(panel.observer!==observer)fail('OBSERVER');
  if(panel.sample.kind==='Present'){if(!Number.isInteger(panel.sample.glyph)||panel.sample.glyph<0||panel.sample.glyph>7||!['Before','Motion','After'].includes(panel.sample.stage))fail('SAMPLE');ordinal(panel.detection);}
  else if(panel.sample.kind!=='Unavailable'||panel.detection!==undefined)fail('SAMPLE');
 }
 if(visual){exact(visual,['observer','observation','detection','at']);ordinal(visual.observation);ordinal(visual.detection);if(visual.observer!==observer||panel&&(visual.at!==panel.sample.at||visual.observation===panel.observation||panel.sample.kind==='Present'&&visual.detection!==panel.detection))fail('VISUAL');}
 const at=panel?.sample.at??visual!.at;simInstant(at);if(at<=window.at)fail('TIME');if(!panel&&active)fail('UNSAMPLED_ACTIVE_CONTEXT');
 const ends:PerceptualEventEnd[]=[],panelSupport=panel?[{observerId:observer,observationId:panel.observation}]:[];
 const endActive=()=>{if(active){const r=endPerceptualEventFile(files,{observerId:observer,perceptualEventReferentId:active.context,supportingObservationIds:panelSupport,occurredAt:at,transformationVersion:version});files=r.state;ends.push(r.eventEnd);active=undefined;}};
 let transition:PerceptualEventTransition|undefined;
 if(panel?.sample.kind==='Unavailable')endActive();
 if(panel?.sample.kind==='Present'){
  if(active&&(panel.sample.stage==='Before'||active.glyph!==panel.sample.glyph))endActive();
  const r=applyPerceptualEventTransition(files,{observerId:observer,currentEventDetectionId:{observerId:observer,eventDetectionOccurrenceId:panel.detection!},continuityKind:active?'ContinuesPriorEventFile':'NewEventFile',...(active?{priorPerceptualEventReferentId:active.context}:{}),supportingObservationIds:panelSupport,occurredAt:at,transformationVersion:version});files=r.state;transition=r.transition;active={glyph:panel.sample.glyph,context:transition.perceptualEventReferentId};if(panel.sample.stage==='After')endActive();
 }
 let visualEventTransition=visual?transition:undefined;
 if(visual&&!visualEventTransition){
  const support=[{observerId:observer,observationId:visual.observation}],r=applyPerceptualEventTransition(files,{observerId:observer,currentEventDetectionId:{observerId:observer,eventDetectionOccurrenceId:visual.detection},continuityKind:'NewEventFile',supportingObservationIds:support,occurredAt:at,transformationVersion:version});files=r.state;visualEventTransition=r.transition;
  const e=endPerceptualEventFile(files,{observerId:observer,perceptualEventReferentId:r.transition.perceptualEventReferentId,supportingObservationIds:support,occurredAt:at,transformationVersion:version});files=e.state;ends.push(e.eventEnd);
 }
 if((files.nextEventSequenceByObserver.get(observer)??0n)>26n)fail('FILE_BOUND');
 return {files,window:{at,active:structuredClone(active)} as PanelWindow,result:structuredClone({transition,ends,context:transition?.perceptualEventReferentId,stage:panel?.sample.kind==='Present'?panel.sample.stage:undefined,visualEventTransition})};
}
