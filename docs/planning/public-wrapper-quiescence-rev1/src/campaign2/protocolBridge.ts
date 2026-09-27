/** protocol-consequence-observation/0.1-candidate. Five real SEM consequence stages
 * with execution-owned truth and conditional, unpadded observer emission. */
import {list,text,typedIdentifier,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {SchedulerContractError,type ScheduledEvent,type EventEmission} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {boundedEffectTruthValue,restoreObservationChannel} from '../observation/observation';
import {assemblePreRecognitionExperience} from '../semanticBinding/perceptualEventFiles';
import {supportingObservationIdValue} from '../semanticBinding/semanticCodecs';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {admitObservationLane,assertTruthAvailableAtLaneEntry,assertLaneOperationPhase,assertCanonicalClassificationWork,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {cognitiveRecord as r,cloneCognitive} from './cognitiveCodecs';
import {compileProtocolObservation} from './protocolObservation';
import {dataRecord as rec,dataField as f,dataUnsigned as u,dataIdentity as id,dataText as txt,dataKey as key,invalidModel} from './canonicalData';

const eventType=(name:string)=>typedIdentifier(1001,text('event/protocol-'+name));
const names=['observation','tracking','bindings','classification','experience'];
function fail(message:string):never{throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION',message);}
export function compileProtocolBridge(definition:CanonicalValue){
 const d=rec(cloneCognitive(definition),451n),channelValue=f(d,3n),channel=restoreObservationChannel(channelValue),permitted=f(d,4n);
 if(typeof permitted!=='boolean')invalidModel('protocol observer permission');
 return Object.freeze({eventTypes:()=>names.map(eventType),begin(instant:bigint){
  let active=true;const usedSources=new Set<bigint>(),tickets=new Set<object>();
  type Data={outcome?:CanonicalValue;reservation?:ExperienceReservation;support?:CanonicalValue};
  const generated=new Map<bigint,{event:ScheduledEvent;data:Data;consumed:boolean}>(),reservations:ExperienceReservation[]=[],frozen:StagedSemanticExperience[]=[];
  function live(){if(!active)fail('closed protocol bridge');}
  function plan(parent:ScheduledEvent,children:readonly {emission:EventEmission;data:Data}[]){
   const source=structuredClone(parent),ticket={};tickets.add(ticket);
   return {emissions:()=>children.map(c=>structuredClone(c.emission)),bindAllocatedChildren(events:readonly ScheduledEvent[]){
    live();if(!tickets.has(ticket)||events.length!==children.length)fail('missing/repeated protocol children');
    const ids=new Set<bigint>();for(const [i,event] of events.entries()){
     const expected={...children[i].emission,eventId:event.eventId,eventSequence:event.eventSequence,causalParentEventIds:[source.eventId]};
     if(ids.has(event.eventId)||generated.has(event.eventId)||event.eventId===source.eventId||event.eventSequence<=source.eventSequence||key(scheduledEventValue(event))!==key(scheduledEventValue(expected)))fail('protocol child association');ids.add(event.eventId);
    }
    events.forEach((event,i)=>generated.set(event.eventId,{event:structuredClone(event),data:children[i].data,consumed:false}));tickets.delete(ticket);
   }};
  }
  return Object.freeze({
   /** Trusted composition calls only with the just-executed output. This method
    * does not turn a public record or occurrence namespace into source authority. */
   source(event:ScheduledEvent,output:CanonicalValue){
    live();if(event.phase!==110n||event.dueAt!==instant||key(event.eventTypeId)!==key(typedIdentifier(1001,text('event/protocol-execution')))||usedSources.has(event.eventId))fail('protocol execution source');
    const outcome=rec(cloneCognitive(output),433n);if(key(event.payload)!==key(f(outcome,2n)))fail('protocol outcome/attempt mismatch');usedSources.add(event.eventId);
    if(!permitted)return plan(event,[]);
    const count=u(f(outcome,3n)),truth=boundedEffectTruthValue({before:Q.of(0n),potentialEffect:Q.of(count),applied:Q.of(count),overflow:Q.of(0n),after:Q.of(count),minimum:Q.of(0n),maximum:Q.of(2n),provenance:{slots:new Map()},truthRecordId:id(f(outcome,1n))});
    return plan(event,[{data:{outcome},emission:{dueAt:event.dueAt,phase:120n,eventTypeId:eventType(names[0]),payload:r(310,[truth,channelValue]),dependencies:list([])}}]);
   },
   execute(event:ScheduledEvent,allocator:{allocateRuntimeId():bigint}){
    live();const relation=generated.get(event.eventId);if(!relation||relation.consumed||key(scheduledEventValue(event))!==key(scheduledEventValue(relation.event)))fail('unadmitted protocol observation event');relation.consumed=true;
    const index=Number(event.phase-120n);if(index<0||index>4)fail('protocol phase');const observer=txt(channel.observerId.payload),outputs:CanonicalValue[]=[];
    if(index===0){
     assertTruthAvailableAtLaneEntry('Consequence',110n);assertLaneOperationPhase('Consequence','Observation',event.phase);
     const ordinal=allocator.allocateRuntimeId();outputs.push(compileProtocolObservation(relation.data.outcome!,channel,typedIdentifier(1115,unsigned(ordinal)),event.dueAt));
     relation.data.reservation=admitObservationLane({observerId:observer,lane:'Consequence',dueAt:event.dueAt,emitsCharacterAccessibleEvidence:true},()=>allocator.allocateRuntimeId()).reservation!;
     reservations.push(relation.data.reservation);relation.data.support=supportingObservationIdValue(observer,ordinal);delete relation.data.outcome;
    }else {
     assertLaneOperationPhase('Consequence',(['Observation','TrackingAndSegmentation','BindingAndFeatureEvidence','Classification','ExperienceFreeze'] as const)[index],event.phase);
     if(!relation.data.reservation||!relation.data.support||key(event.payload)!==key(relation.data.support))fail('protocol supporting observation/reservation');
     if(index===3)assertCanonicalClassificationWork([]);
    }
    if(index===4){
     const support=rec(relation.data.support!,216n),observation=id(f(support,2n));
     const experience=assemblePreRecognitionExperience({experienceId:relation.data.reservation!.experienceId,observerId:observer,occurredAt:event.dueAt,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:observer,observationId:u(observation.payload)}],transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'});
     const staged=freezeAndStageSemanticExperience(relation.data.reservation!,experience,event.phase);frozen.push(staged);const value=preRecognitionSemanticExperienceValue(staged.experience);outputs.push(value);
     return {outputs,freeze:value,plan:plan(event,[])};
    }
    return {outputs,freeze:undefined,plan:plan(event,[{data:{reservation:relation.data.reservation,support:relation.data.support},emission:{dueAt:event.dueAt,phase:event.phase+1n,eventTypeId:eventType(names[index+1]),payload:relation.data.support!,dependencies:list([])}}])};
   },
   finish(){live();if(tickets.size||[...generated.values()].some(x=>!x.consumed))fail('unfinished protocol bridge');validateSuccessfulExperienceSettlement(reservations,frozen);active=false;},
   abort(){active=false;tickets.clear();generated.clear();reservations.length=0;frozen.length=0;},
  });
 }});
}
