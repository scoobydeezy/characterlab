/** Current-lane position/context operations within the one assembled scheduler. */
import {BODY_CONTEXT} from './retainedAttribution';
import {POSITION_SELECT,POSITION_MEMORY_VERSION} from './memory';
import {observedRole} from './encoding';
import type {PreRecognitionSemanticExperience} from '../semanticBinding/perceptualEventFiles';
import {list,text,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {type AuthoritativeState,type StatePatch,type ActualReadRecord,statePathValue} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventHandlerContext,type EventEmission} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataKey as key} from '../campaign2/canonicalData';
import {applyPerceptualTrackTransition,type PerceptualReferentId} from '../semanticBinding/perceptualContinuantFiles';
import {applyPerceptualEventTransition,endPerceptualEventFile,compilePerceivedBindings,type PerceptualEventReferentId,type PerceivedBindingEvidence} from '../semanticBinding/perceptualEventFiles';
import {nextTrackSequencePath,activeContinuantFilePath,nextEventSequencePath,activeEventFilePath,SemanticMutationAuthority as OWNER} from '../semanticBinding/semanticStateAuthority';
import {perceptualReferentIdValue,perceptualEventReferentIdValue} from '../semanticBinding/semanticCodecs';
import {preRecognitionSemanticExperienceValue,perceivedBindingEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {POSITION,POSITION_VERSION,POSITION_SOURCE,POSITION_STAGES,samplePosition,windowPath,readWindow,windowValue,replacement} from './positionPerception';
import {trackState,eventState} from './recognitionState';
import {OBSERVER} from './recognition';
import {BODY_OBSERVER} from './body';
import {sid,pattern} from './skill';
import {meaningValue} from './goalMeaning';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
// SEM transitions explicitly carry an absent prior; omit only that optional field in the detached report.
const transitionValue=(v:object)=>meaningValue(Object.fromEntries(Object.entries(v).filter(([,x])=>x!==undefined)));
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','position '+s);};
export function createPositionExecution(stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue,positionMemory=false){
 const stages=positionMemory?[...POSITION_STAGES,POSITION_SELECT]:POSITION_STAGES,phases=[11n,12n,14n,20n];
 let active=false,at=0n,used=false,unbound=0,sample:ReturnType<typeof samplePosition>|undefined,observation:CanonicalValue|undefined,visualObservation:bigint|undefined,panelObservation:bigint|undefined,visualDetection:bigint|undefined,eventDetection:bigint|undefined,track:PerceptualReferentId|undefined,contextRef:PerceptualEventReferentId|undefined,eventRef:PerceptualEventReferentId|undefined,reservation:ExperienceReservation|undefined;
 let contextEvent:bigint|undefined;
 let bindings:readonly PerceivedBindingEvidence[]=[],staged:StagedSemanticExperience[]=[];const pending=new Set<string>();
 const support=()=>[...(sample?.position?.kind==='Present'?[{observerId:OBSERVER,observationId:visualObservation!}]:[]),...(sample?.panel?.kind==='Present'?[{observerId:OBSERVER,observationId:panelObservation!}]:[])];
 const emit=(e:ScheduledEvent,phase:bigint,eventTypeId:ReturnType<typeof sid>):EventEmission=>({dueAt:e.dueAt,phase,eventTypeId,payload:observation!,dependencies:list([])});
 function trace(event:ScheduledEvent,input:CanonicalValue,outputs:CanonicalValue[],children:readonly ScheduledEvent[],reads:ActualReadRecord[],patch:StatePatch,diffs:ReturnType<typeof stateModel.applyPatch>['diffs']){return traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:sid(1036,'seam/assembled-position-perception'),seamVersion:positionMemory?POSITION_MEMORY_VERSION:POSITION_VERSION,recordKind:event.eventTypeId,subjectIds:[BODY_OBSERVER],sourceRecordIds:[],registeredReadDomain:reads.map(x=>pattern(x.path)),actualReadRecords:reads,inputProjection:input,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});}
 return {
 contextForBody(){if(!active)fail('context outside instant');return contextEvent!==undefined&&contextRef&&sample?.panel?.kind==='Present'?list([text(BODY_CONTEXT),signed(at),perceptualEventReferentIdValue(contextRef),typedIdentifier(1115,u(panelObservation!)),u(sample.panel.glyph),text(sample.panel.stage),u(contextEvent)]):undefined;},
 eventTypes:()=>[POSITION_SOURCE,...stages],
 begin(instant:bigint){if(active)fail('already active');active=true;at=instant;used=false;unbound=0;contextEvent=undefined;sample=undefined;observation=undefined;track=undefined;contextRef=undefined;eventRef=undefined;reservation=undefined;visualObservation=undefined;panelObservation=undefined;visualDetection=undefined;eventDetection=undefined;bindings=[];staged=[];pending.clear();},
 close(){active=false;contextEvent=undefined;sample=undefined;observation=undefined;reservation=undefined;staged=[];bindings=[];pending.clear();},
 prepareCommit(){if(!active||unbound||pending.size||originals.some(e=>e.dueAt===at)&&!used)fail('unfinished instant');validateSuccessfulExperienceSettlement(reservation?[reservation]:[],staged);},
 execute(c:EventHandlerContext<AuthoritativeState>){const {event,state}=c;if(!active||event.dueAt!==at)fail('inactive');const source=eq(event.eventTypeId,POSITION_SOURCE);
 let memoryEvidence:{observation:CanonicalValue;experience:PreRecognitionSemanticExperience;contexts:CanonicalValue}|undefined;
 let nextState=state,outputs:CanonicalValue[]=[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[];
 if(source){
  if(event.phase!==10n||used||!originals.some(e=>fp(e)===fp(event)))fail('source binding');used=true;sample=samplePosition(event.payload,at,positionMemory);
  visualObservation=sample.position?c.allocateRuntimeId():undefined;panelObservation=sample.panel?c.allocateRuntimeId():undefined;
  const v=sample.position,p=sample.panel;
  observation=list([text(POSITION),signed(at),!!v,!!p,list(v?.kind==='Present'?[typedIdentifier(1115,u(visualObservation!)),u(v.position.x),u(v.position.y),u(v.glyph)]:[]),list(p?.kind==='Present'?[typedIdentifier(1115,u(panelObservation!)),u(p.glyph),text(p.stage)]:[]),...(positionMemory?[u(sample.role)]:[])]);
  reservation=admitObservationLane({observerId:OBSERVER,lane:'Current',dueAt:at,emitsCharacterAccessibleEvidence:v?.kind==='Present'||p?.kind==='Present'},()=>c.allocateRuntimeId()).reservation;outputs=[observation];
 }else {
  if(!pending.delete(fp(event))||!observation||!eq(event.payload,observation))fail('unbound child');const index=stages.findIndex(t=>eq(t,event.eventTypeId));if(index<0||event.phase!==phases[index])fail('phase');
  if(index===0){
   const wp=windowPath(OBSERVER,'position'),priorWindow=stateModel.read(state,wp),window=readWindow(priorWindow.value,OBSERVER),tracks=trackState(state),events=eventState(state);
   const paths=[wp,nextTrackSequencePath(OBSERVER),nextEventSequencePath(OBSERVER),...state.entries().filter(e=>[241n,242n].includes(e.path.rootStateTypeId)&&e.path.fieldId===2n).map(e=>e.path)];
   reads=paths.map(path=>{const v=stateModel.read(state,path);return {accessorId:sid(1028,'accessor/position-perception'),path,presence:v.presence,value:v.value,derivedSources:[]};});
   let newTracks:Parameters<typeof applyPerceptualTrackTransition>[0]=tracks,newEvents:Parameters<typeof applyPerceptualEventTransition>[0]=events;const changes:CanonicalValue[]=[];
   if(sample!.position){if(at<=window.visualAt)fail('visual clock');const visual=sample!.position;window.visualAt=at;
    if(visual.kind==='Present'){visualDetection=c.allocateRuntimeId();const prior=window.marker?.glyph===visual.glyph?window.marker:undefined;
     const r=applyPerceptualTrackTransition(tracks,{observerId:OBSERVER,currentDetectionId:{observerId:OBSERVER,detectionOccurrenceId:visualDetection},continuityKind:prior?'ContinuesPriorTrack':'NewTrack',...(prior?{priorPerceptualReferentId:prior.file}:{}),supportingObservationIds:[visualObservation!,...(prior?[prior.observation]:[])].sort((a,b)=>a<b?-1:1).map(observationId=>({observerId:OBSERVER,observationId})),occurredAt:at,transformationVersion:'semantic-binding/0.1-candidate#SEM-001A'});
     newTracks=r.state;track=r.transition.perceptualReferentId;window.marker={observation:visualObservation!,glyph:visual.glyph,file:track};changes.push(transitionValue(r.transition));
    }else window.marker=undefined;
   }
   const panel=sample!.panel,panelSupport=panel?[{observerId:OBSERVER,observationId:panelObservation!}]:[];
   const end=()=>{if(window.panel){const r=endPerceptualEventFile(newEvents,{observerId:OBSERVER,perceptualEventReferentId:window.panel.file,supportingObservationIds:panelSupport,occurredAt:at,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'});newEvents=r.state;changes.push(transitionValue(r.eventEnd));window.panel=undefined;}};
   if(!panel&&window.panel&&sample!.position)fail('unsampled active context');
   if(panel){if(at<=window.panelAt)fail('panel clock');window.panelAt=at;if(panel.kind==='Unavailable')end();else{
    if(window.panel&&(panel.stage==='Before'||window.panel.glyph!==BigInt(panel.glyph)))end();
    eventDetection=c.allocateRuntimeId();const r=applyPerceptualEventTransition(newEvents,{observerId:OBSERVER,currentEventDetectionId:{observerId:OBSERVER,eventDetectionOccurrenceId:eventDetection},continuityKind:window.panel?'ContinuesPriorEventFile':'NewEventFile',...(window.panel?{priorPerceptualEventReferentId:window.panel.file}:{}),supportingObservationIds:panelSupport,occurredAt:at,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'});
    newEvents=r.state;contextRef=r.transition.perceptualEventReferentId;contextEvent=event.eventId;eventRef=contextRef;window.panel={glyph:BigInt(panel.glyph),file:contextRef};changes.push(transitionValue(r.transition));if(panel.stage==='After')end();
   }}
   if(track&&!eventRef){eventDetection=c.allocateRuntimeId();const s=[{observerId:OBSERVER,observationId:visualObservation!}],r=applyPerceptualEventTransition(newEvents,{observerId:OBSERVER,currentEventDetectionId:{observerId:OBSERVER,eventDetectionOccurrenceId:eventDetection},continuityKind:'NewEventFile',supportingObservationIds:s,occurredAt:at,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'});eventRef=r.transition.perceptualEventReferentId;const ended=endPerceptualEventFile(r.state,{observerId:OBSERVER,perceptualEventReferentId:eventRef,supportingObservationIds:s,occurredAt:at,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'});newEvents=ended.state;changes.push(transitionValue(r.transition),transitionValue(ended.eventEnd));}
   const operations:StatePatch['operations'][number][]=[];
   for(const [path,old,next] of [[nextTrackSequencePath(OBSERVER),tracks.nextTrackSequenceByObserver.get(OBSERVER)??0n,newTracks.nextTrackSequenceByObserver.get(OBSERVER)??0n],[nextEventSequencePath(OBSERVER),events.nextEventSequenceByObserver.get(OBSERVER)??0n,newEvents.nextEventSequenceByObserver.get(OBSERVER)??0n]] as const)if(old!==next)operations.push(replacement(state,path,u(next)));
   for(const file of newTracks.activePerceptualReferentIds){const path=activeContinuantFilePath(file);if(!state.read(path).presence)operations.push(replacement(state,path,true));}
   const target=newEvents.activeEventFiles.map(activeEventFilePath),old=events.activeEventFiles.map(activeEventFilePath);
   for(const path of old)if(!target.some(p=>key(statePathValue(p))===key(statePathValue(path))))operations.push({kind:'remove',path,expectedOldValue:true});
   for(const path of target)if(!state.read(path).presence)operations.push(replacement(state,path,true));
   operations.push(replacement(state,wp,windowValue(window)));patch={operations};const applied=stateModel.applyPatch(state,patch,OWNER.Perception,{writableRoots:[241n,242n],targetPaths:operations.map(o=>o.path)});nextState=applied.state;diffs=applied.diffs;outputs=[list([text(POSITION+'/tracking'),signed(at),list(changes),windowValue(window)])];
  }else if(index===1&&track){bindings=compilePerceivedBindings([{observerId:OBSERVER,perceptualEventReferentId:eventRef!,perceptualReferentId:track,eventRoleEvidence:observedRole(positionMemory?sample!.role:0n),supportingObservationIds:[{observerId:OBSERVER,observationId:visualObservation!}],occurredAt:at,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'}],c.allocateRuntimeId()).bindings;outputs=bindings.map(perceivedBindingEvidenceValue);}
  else if(index===2){let experience:CanonicalValue=list([]);if(reservation){const x=freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId:OBSERVER,occurredAt:at,perceptualEventReferentIds:eventRef?[eventRef]:[],perceivedBindings:bindings,perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:support(),transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},14n);staged.push(x);experience=preRecognitionSemanticExperienceValue(x.experience);outputs.push(experience);}
   outputs.push(list([text(POSITION+'/experience'),signed(at),observation!,list(track?[perceptualReferentIdValue(track)]:[]),list(contextRef?[perceptualEventReferentIdValue(contextRef)]:[]),list(bindings.map(perceivedBindingEvidenceValue)),experience]));
  }else if(index===3&&staged.length&&bindings.length){memoryEvidence={observation:observation!,experience:staged[0].experience,contexts:list(contextRef?[perceptualEventReferentIdValue(contextRef)]:[])};}
 }
 const step=source?0:stages.findIndex(t=>eq(t,event.eventTypeId))+1,emissions=step<stages.length?[emit(event,phases[step],stages[step])]:[];let bound=false;unbound++;
 return {memoryEvidence,nextState,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){if(bound||!active||children.length!==emissions.length)fail('child binding');for(const [i,e] of children.entries()){const expected={...emissions[i],eventId:e.eventId,eventSequence:e.eventSequence,causalParentEventIds:[event.eventId]};if(e.eventSequence<=event.eventSequence||fp(e)!==fp(expected)||pending.has(fp(e)))fail('generated child mismatch');pending.add(fp(e));}bound=true;unbound--;return [trace(event,event.payload,outputs,children,reads,patch,diffs)];}};
 }
 };
}
