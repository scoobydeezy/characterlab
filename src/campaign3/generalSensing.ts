/** Internal actual world -> requested sampling producers. The compiled schedule
 * authenticates source data here; the scheduler must still admit the actual event.
 * World truth is confined to the source handoff and never enters sampled evidence. */
import {canonicalEncode as enc,list,signed,unsigned as u,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataIdentity as identity,dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import {currentDetectionIdValue,currentEventDetectionIdValue} from '../semanticBinding/semanticCodecs';
import {eventRoleEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {admitObservationLane} from '../semanticBinding/phaseOrdering';
import {generalRecord as r,generalSubject,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {createPositionSceneSource,materializePositionScene} from './positionSceneSource';
import {createTrialPanelSource,observeTrialPanel} from './trialPanelSource';
import type {compileGeneralSourceDeclarations} from './generalSourceDeclarations';
import type {compileGeneralPhysicalReads} from './generalPhysicalReads';
import type {compileGeneralOutputSlots} from './generalOutputSlots';
type Instant=ReturnType<ReturnType<typeof compileGeneralOutputSlots>['beginInstant']>;

export function compileGeneralSensing(source:ReturnType<typeof compileGeneralSourceDeclarations>,physical:ReturnType<typeof compileGeneralPhysicalReads>){
 const context=generalBindingContext(),who=generalSubject(),observer=(who.observer.payload as {value:string}).value;
 const scene=createPositionSceneSource(source.sceneFrames()),panelSource=createTrialPanelSource(source.panelFrames());
 const originals=new Set(items(decode(source.originalBytes(),context),'list').map(key));
 return Object.freeze({
  materialize(originalValue:CanonicalValue,instant:Instant){
   const original=rec(decode(enc(originalValue),context),665n);if(!originals.has(key(original)))fail('GA uncommitted source original');
   const at=(f(original,1n) as Extract<CanonicalValue,{kind:'signed'}>).value,request=rec(f(original,3n),655n),lane=uint(f(original,5n))===1n?'current':'consequence';
   const stage=instant.beginStage('world');let first=true;
   const world=f(request,4n)===true?materializePositionScene(scene,at,()=>{const slot=stage.allocate(first?1114n:1100n);first=false;return uint(slot.payload);}):undefined;
   const receipt=stage.admit(world?[world.truth]:[]);
   const handoff=r(666,new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,original],...(world?[[3n,world.truth] as [bigint,CanonicalValue]]:[])]));let consumed=false;
   return Object.freeze({worldReceipt:receipt,samplingInputBytes:()=>enc(handoff),
    sample(state:AuthoritativeState){
     if(consumed)fail('GA source handoff already sampled');consumed=true;
     const sampling=instant.beginStage(lane+'-sample');
     const body=physical.sampleBody(state,request.fields.get(2n)??null,at,()=>uint(sampling.allocate(1115n).payload));
     const bodyBytes=body.bodyBytes(),bodyValue=bodyBytes?rec(decode(bodyBytes,context),654n):undefined;
     const panel=f(request,3n)===true?observeTrialPanel(panelSource,at):undefined,panelId=panel?sampling.allocate(1115n):undefined;
     const visualId=world?sampling.allocate(1115n):undefined,visible=world?.safe.items??[];
     const event=panel?.kind==='Present'||visible.length?currentEventDetectionIdValue(observer,uint(sampling.allocate(1113n).payload)):undefined;
     const panelValue=panel?.kind==='Present'?r(542,[panelId!,who.observer,signed(at),u(panel.glyph),u(['Before','Motion','After'].indexOf(panel.stage)+1),text('trial-panel-source-component/0.1-candidate')]):panel?r(653,[panelId!,who.observer,signed(at),text('trial-panel-source-component/0.1-candidate')]):undefined;
     const visual=world?r(610,new Map<bigint,CanonicalValue>([[1n,visualId!],[2n,who.observer],[3n,signed(at)],...(event?[[4n,event] as [bigint,CanonicalValue]]:[]),[5n,list(visible.map(item=>r(609,[currentDetectionIdValue(observer,uint(sampling.allocate(1112n).payload)),eventRoleEvidenceValue(item.role),u(item.glyph),r(608,[u(item.position.x),u(item.position.y)])])))]])):undefined;
     const safe=panel?.kind==='Present'||visible.length>0||!!bodyValue&&items(f(bodyValue,3n),'list').some(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===461n);
     const fields=new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,signed(at)],[3n,request]]);
     const admission=admitObservationLane({observerId:observer,lane:lane==='current'?'Current':'Consequence',dueAt:at,emitsCharacterAccessibleEvidence:safe},()=>uint(sampling.allocate(1106n).payload));
     if(bodyValue)fields.set(4n,bodyValue);if(panelValue)fields.set(5n,panelValue);if(visual)fields.set(6n,visual);if(event)fields.set(7n,event);if(admission.reservation)fields.set(8n,{kind:'typedIdentifier',namespaceId:1106n,payload:u(admission.reservation.experienceId)});
     const samples=decode(enc(r(656,fields)),context),sampleReceipt=sampling.admit([samples]);
     return Object.freeze({receipt:sampleReceipt,reservation:()=>structuredClone(admission.reservation),samplesBytes:()=>enc(samples),trackingInputBytes:()=>enc(r(667,[who.observer,samples,f(original,4n)])),actualReadRecords:()=>body.actualReadRecords()});
    },
   });
  },
 });
}
