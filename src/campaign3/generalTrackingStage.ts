/** Internal state-backed marker-window-tracking/0.1-candidate and
 * panel-window-perception/0.1-candidate adapters. Samples must be authenticated by
 * the producing sampling stage; no truth or authored scene identity is read. */
import {canonicalEncode as enc,list,set,signed,unsigned as u,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,statePathValue,patternMatches,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as identity,dataUnsigned as uint,dataText as txt,dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import {advanceMarkerWindow,type TrackingWindow} from './markerWindowTracking';
import {advancePanelWindow,type PanelWindow,type PanelWindowInput} from './panelWindowPerception';
import {emptyPerceptualContinuantFileState} from '../semanticBinding/perceptualContinuantFiles';
import {emptyPerceptualEventFileState,type PerceptualEventTransition,type PerceptualEventEnd} from '../semanticBinding/perceptualEventFiles';
import {perceptualStateEntries} from '../semanticBinding/semanticStateAuthority';
import {perceptualTrackTransitionValue,perceptualReferentIdValue,perceptualEventReferentIdValue,restorePerceptualReferentId,restorePerceptualEventReferentId,currentEventDetectionIdValue,supportingObservationIdValue,semanticRecordValue} from '../semanticBinding/semanticCodecs';
import {generalRecord as r,generalSubject,generalId as id,generalStagePaths,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import type {compileGeneralSemanticReads} from './generalSemanticReads';

export function compileGeneralTrackingStage(semantic:ReturnType<typeof compileGeneralSemanticReads>,validateLeaf:(path:StatePath,value:CanonicalValue)=>void){
 const context=generalBindingContext(),who=generalSubject(),observer=txt(identity(who.observer).payload);
 const instant=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')return fail('GA tracking instant');return v.value;};
 const ordinal=(v:CanonicalValue)=>uint(identity(v).payload);
 return Object.freeze({
  prepare(state:AuthoritativeState,stage:'current-track'|'consequence-track',input:CanonicalValue){
   const samples=rec(decode(enc(input),context),656n);if(key(f(samples,1n))!==key(who.observer))fail('GA tracking subject');
   const at=instant(f(samples,2n)),visual=samples.fields.has(6n)?rec(f(samples,6n),610n):undefined,panel=samples.fields.get(5n);
   const detections=visual?items(f(visual,5n),'list'):[],eventNeeded=panel!==undefined||detections.length>0;
   const files=semantic.construct(state,stage,who.observer,{continuants:!!visual,events:eventNeeded}),reads=[...files.actualReadRecords()],domain=generalStagePaths(stage).reads;
   const read=(path:StatePath,member:string)=>{
    const existing=reads.find(r=>key(statePathValue(r.path))===key(statePathValue(path)));if(existing)return existing;
    if(!domain.some(p=>patternMatches(p,path)))fail('GA tracking read outside registration');
    const prior=state.read(path);if(prior.presence)validateLeaf(path,prior.value!);
    const result={accessorId:id(1028,member),path,presence:prior.presence,value:prior.value,derivedSources:[]};reads.push(result);return result;
   };
   const windowPath=(root:bigint):StatePath=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key:who.observer}]});
   const beforeC=files.continuants()??emptyPerceptualContinuantFileState(),beforeE=files.events()??emptyPerceptualEventFileState();
   let afterC=beforeC,afterE=beforeE,markerResult:ReturnType<typeof advanceMarkerWindow>|undefined,panelResult:ReturnType<typeof advancePanelWindow>|undefined;
   const windows:{path:StatePath;value:CanonicalValue}[]=[];
   if(visual){
    if(key(f(visual,2n))!==key(who.observer)||instant(f(visual,3n))!==at)fail('GA tracking visual source');
    const path=windowPath(634n),prior=read(path,'accessor/general-attention-tracking-prior');if(!prior.presence)fail('GA missing tracking window');
    const w=rec(prior.value!,627n),window:TrackingWindow={at:instant(f(w,1n)),observation:w.fields.has(2n)?ordinal(f(w,2n)):null,items:items(f(w,3n),'list').map(v=>{const item=rec(v,626n);return {file:restorePerceptualReferentId(f(item,1n)),...(item.fields.has(2n)?{glyph:uint(f(item,2n))}:{})};})};
    markerResult=advanceMarkerWindow(observer,beforeC,window,{observerId:observer,observationId:ordinal(f(visual,1n)),occurredAt:at,detections:detections.map(v=>{const item=rec(v,609n),detection=rec(f(item,1n),214n);if(key(f(detection,1n))!==key(who.observer))fail('GA foreign tracked detection');return {detectionId:ordinal(f(detection,2n)),...(item.fields.has(3n)?{glyph:uint(f(item,3n))}:{})};})});afterC=markerResult.files;
    const next=markerResult.window;windows.push({path,value:r(627,new Map<bigint,CanonicalValue>([[1n,signed(next.at)],[2n,typedIdentifier(1115,u(next.observation!))],[3n,list(next.items.map(i=>r(626,new Map<bigint,CanonicalValue>([[1n,perceptualReferentIdValue(i.file)],...(i.glyph===undefined?[]:[[2n,u(i.glyph)] as [bigint,CanonicalValue]])]))))]]))});
   }
   if(eventNeeded){
    const path=windowPath(635n),prior=read(path,'accessor/general-attention-panel-prior');if(!prior.presence)fail('GA missing panel window');
    const w=rec(prior.value!,629n),active=w.fields.has(2n)?rec(f(w,2n),628n):undefined,window:PanelWindow={at:instant(f(w,1n)),...(active?{active:{glyph:Number(uint(f(active,1n))),context:restorePerceptualEventReferentId(f(active,2n))}}:{})};
    const event=samples.fields.has(7n)?rec(f(samples,7n),215n):undefined;
    if(event&&key(f(event,1n))!==key(who.observer))fail('GA foreign event detection');
    const detection=event?ordinal(f(event,2n)):undefined;let panelInput:PanelWindowInput|undefined;
    if(panel!==undefined){const p=rec(panel,(panel as Extract<CanonicalValue,{kind:'record'}>).schema.typeId);if(key(f(p,2n))!==key(who.observer)||instant(f(p,3n))!==at)fail('GA tracking panel source');
     panelInput={observer,observation:ordinal(f(p,1n)),sample:p.schema.typeId===542n?{kind:'Present',at,glyph:Number(uint(f(p,4n))),stage:(['Before','Motion','After'] as const)[Number(uint(f(p,5n)))-1]}:{kind:'Unavailable',at},...(p.schema.typeId===542n?{detection}:{})};}
    panelResult=advancePanelWindow(observer,beforeE,window,panelInput,detections.length?{observer,observation:ordinal(f(visual!,1n)),detection:detection!,at}:undefined);afterE=panelResult.files;
    const next=panelResult.window;windows.push({path,value:r(629,new Map<bigint,CanonicalValue>([[1n,signed(next.at)],...(next.active?[[2n,r(628,[u(next.active.glyph),perceptualEventReferentIdValue(next.active.context)])] as [bigint,CanonicalValue]]:[])]))});
   }
   const before=perceptualStateEntries(beforeC,beforeE),after=[...perceptualStateEntries(afterC,afterE),...windows];
   const desired=new Map(after.map(e=>[key(statePathValue(e.path)),e]));
   const paths=new Map([...before,...after].map(e=>[key(statePathValue(e.path)),e.path]));
   const operations:StatePatch['operations'][number][]=[];
   for(const [k,path] of [...paths].sort(([a],[b])=>a<b?-1:a>b?1:0)){
    const root=path.rootStateTypeId,member=root===634n?'accessor/general-attention-tracking-prior':root===635n?'accessor/general-attention-panel-prior':'accessor/attention-'+(root===241n?'continuant':'event')+'-'+(path.fieldId===1n?'counter':'active');
    const prior=read(path,member),next=desired.get(k)?.value;
    if(next===undefined){if(prior.presence)operations.push({kind:'remove',path,expectedOldValue:prior.value!});}
    else if(!prior.presence||key(prior.value!)!==key(next))operations.push({kind:'set',path,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:next});
   }
   const tracks=markerResult?.transitions??[],events:PerceptualEventTransition[]=[];
   if(panelResult?.result.transition)events.push(panelResult.result.transition);
   if(panelResult?.result.visualEventTransition&&panelResult.result.visualEventTransition!==panelResult.result.transition&&(!events.length||key(perceptualEventReferentIdValue(events[0].perceptualEventReferentId))!==key(perceptualEventReferentIdValue(panelResult.result.visualEventTransition.perceptualEventReferentId))))events.push(panelResult.result.visualEventTransition);
   const eventValue=(t:PerceptualEventTransition)=>semanticRecordValue('PerceptualEventTransition',{ObserverId:who.observer,...(t.priorPerceptualEventReferentId?{PriorPerceptualEventReferentId:perceptualEventReferentIdValue(t.priorPerceptualEventReferentId)}:{}),PerceptualEventReferentId:perceptualEventReferentIdValue(t.perceptualEventReferentId),CurrentEventDetectionId:currentEventDetectionIdValue(observer,t.currentEventDetectionId.eventDetectionOccurrenceId),ContinuityKind:u(t.continuityKind==='NewEventFile'?1:2),SupportingObservationIds:set(t.supportingObservationIds.map(o=>supportingObservationIdValue(observer,o.observationId))),OccurredAt:u(t.occurredAt),TransformationVersion:text(t.transformationVersion)});
   const endValue=(t:PerceptualEventEnd)=>semanticRecordValue('PerceptualEventEnd',{ObserverId:who.observer,PerceptualEventReferentId:perceptualEventReferentIdValue(t.perceptualEventReferentId),SupportingObservationIds:set(t.supportingObservationIds.map(o=>supportingObservationIdValue(observer,o.observationId))),OccurredAt:u(t.occurredAt),TransformationVersion:text(t.transformationVersion)});
   const outputs=[...tracks.map(t=>perceptualTrackTransitionValue({...t,detectionOrdinal:t.currentDetectionId.detectionOccurrenceId,supportingObservationOrdinals:t.supportingObservationIds.map(o=>o.observationId)})),...events.map(eventValue),...(panelResult?.result.ends??[]).map(endValue)].map(v=>decode(enc(v),context));
   return Object.freeze({patch:()=>structuredClone({operations}),outputs:()=>outputs.map(v=>decode(enc(v),context)),actualReadRecords:()=>structuredClone(reads),result:()=>structuredClone({tracks,perceived:panelResult?.result})});
  },
 });
}
