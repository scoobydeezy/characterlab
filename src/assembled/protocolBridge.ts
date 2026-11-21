/** assembled-character-comparison/0.1: exact predecessor port; receiving codec successor only. */
/** protocol-consequence-observation/0.1-candidate. Five real SEM consequence stages
 * with execution-owned truth and conditional, unpadded observer emission. */
import {list,record,text,typedIdentifier,unsigned,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import type {SimInstant} from '../substrate/time';
import {ExactRational as Q} from '../substrate/exactMath';
import {SchedulerContractError,type ScheduledEvent,type EventEmission} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {boundedEffectTruthValue,restoreObservationChannel,compilePermittedEvidence,permittedEvidenceValue,validatePermittedEvidenceRecordClosure,PROTOCOL_OBSERVATION_VERSION,type ObservationChannel} from '../observation/observation';
import {assemblePreRecognitionExperience} from '../semanticBinding/perceptualEventFiles';
import {supportingObservationIdValue} from '../semanticBinding/semanticCodecs';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {admitObservationLane,assertTruthAvailableAtLaneEntry,assertLaneOperationPhase,assertCanonicalClassificationWork,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {cognitiveRecord as r,cloneCognitive} from './codecs';
import {compileProtocolObservation} from '../campaign2/protocolObservation';
import {dataRecord as rec,dataField as f,dataUnsigned as u,dataIdentity as id,dataText as txt,dataKey as key,invalidModel} from '../campaign2/canonicalData';

const eventType=(name:string)=>typedIdentifier(1001,text('event/protocol-'+name));
const names=['observation','tracking','bindings','classification','experience'];
function fail(message:string):never{throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION',message);}
/** M211 zero-request extension; the existing observer sees actual issued0 only. */
export function compileWithheldObservation(outcome:CanonicalValue,channel:ObservationChannel,observationId:TypedIdentifierValue,at:SimInstant){
 const execution=rec(outcome,433n),attempt=rec(f(execution,2n),432n),plan=rec(f(attempt,2n),431n),truthId=id(f(execution,1n));
 if(u(f(plan,3n))!==0n||u(f(execution,3n))!==0n||truthId.namespaceId!==1141n||typeof truthId.payload==='boolean'||truthId.payload.kind!=='unsigned')invalidModel('withholding observation source');
 if(channel.polarityId!==1n||channel.measurementModeId!==1n||channel.missingnessRuleId!==1n||!channel.precision.equals(Q.of(1n))||channel.visibleProvenanceSlotIds.length||channel.experimentalControlId!==undefined||channel.unitId.namespaceId!==1039n||key(channel.unitId.payload)!==key(text('unit/fixture-pulse')))invalidModel('protocol channel outside fixed profile');
 const raw=compilePermittedEvidence({before:Q.of(0n),potentialEffect:Q.of(0n),applied:Q.of(0n),overflow:Q.of(0n),after:Q.of(0n),minimum:Q.of(0n),maximum:Q.of(2n),provenance:{slots:new Map()},truthRecordId:truthId},channel,observationId,at);
 if(raw.kind!=='present'||raw.safeSourceReferences.length!==1||key(raw.safeSourceReferences[0])!==key(truthId)||raw.perceivedConceptTokens.length||!raw.measurementInterval.lower?.equals(Q.of(0n))||!raw.measurementInterval.upper?.equals(Q.of(0n)))invalidModel('unexpected withheld observation');
 const candidate=rec(permittedEvidenceValue(raw),203n),fields=new Map(candidate.fields);fields.set(10n,list([]));fields.set(11n,text(PROTOCOL_OBSERVATION_VERSION));const safe=record(candidate.schema,fields);validatePermittedEvidenceRecordClosure(safe);return safe;
}
export function compileProtocolBridge(definition:CanonicalValue,withholding=false){
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
     const ordinal=allocator.allocateRuntimeId(),outcome=relation.data.outcome!,requested=u(f(rec(f(rec(f(rec(outcome,433n),2n),432n),2n),431n),3n));outputs.push((withholding&&requested===0n?compileWithheldObservation:compileProtocolObservation)(outcome,channel,typedIdentifier(1115,unsigned(ordinal)),event.dueAt));
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
