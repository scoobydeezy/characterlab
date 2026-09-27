/** Fixed ADAPT D bridge, adaptation-input/0.31-candidate with its accepted observation amendment. */
import {canonicalEncode,list,text,typedIdentifier,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational} from '../substrate/exactMath';
import {scheduledEventValue} from '../substrate/persistence';
import {SchedulerContractError,type ScheduledEvent,type EventEmission} from '../substrate/scheduler';
import {boundedEffectTruthValue,restoreBoundedEffectTruth,restoreObservationChannel,type ObservationChannel} from '../observation/observation';
import {assemblePreRecognitionExperience} from '../semanticBinding/perceptualEventFiles';
import {supportingObservationIdValue} from '../semanticBinding/semanticCodecs';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {admitObservationLane,assertTruthAvailableAtLaneEntry,assertLaneOperationPhase,assertCanonicalClassificationWork,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {decodeCampaign2,campaign2Record as r} from './codecs';
import {dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataText as txt,invalidModel} from './canonicalData';
import {compileBridgeObservation} from './bridgeObservation';
import {AUTHORED_FACT_EVENT} from './orderedInputs';
import {observationUnitId,validateObservationUnitId} from '../substrate/observationUnitId';
import type {compileFirstCampaign2Content} from './contentProfile';

/** Profile role ownership is separate from the fixed bridge member check below. */
export function compileFirstCampaign2Bridge(entryBytes:Uint8Array,content:Awaited<ReturnType<typeof compileFirstCampaign2Content>>){
  const roleBytes=content.recordRole(201n,5n);
  if(!roleBytes||key(decodeCampaign2(roleBytes))!==key(r('CanonicalIdentityRole',{RequiredNamespace:unsigned(1039)})))
    invalidModel('first bridge requires namespace-only ObservationChannel.UnitId role 1039');
  content.validateRecordRoles(entryBytes);
  return compileConsequenceBridge(entryBytes);
}

const stages=['observation','tracking','binding','classification','freeze'] as const;
const eventType=(stage:number)=>typedIdentifier(1001n,text(`event/fixture-consequence-${stages[stage]}`));
const q=(n:bigint)=>ExactRational.of(n);
function fail(message:string):never {throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION',message);}
export function compileConsequenceBridge(entryBytes:Uint8Array){
  const entry=rec(decodeCampaign2(entryBytes),171n);
  if(key(f(entry,1n))!==key(typedIdentifier(1027n,text('definition/authored-fact-consequence-bridge')))
    ||key(f(entry,2n))!==key(typedIdentifier(1023n,text('registry/authored-fact-consequence-bridge')))||txt(f(entry,3n))!=='adaptation-input/0.31-candidate')invalidModel('wrong bridge declaration');
  const channels=f(rec(f(entry,4n),309n),1n);if(typeof channels==='boolean'||channels.kind!=='map'||!channels.entries.length)invalidModel('bridge requires nonempty channels');
  const observers=new Set<string>();
  const definitions=channels.entries.map(([channelId,value])=>{
    const channel=restoreObservationChannel(value);
    try{validateObservationUnitId(channel.unitId);}catch{invalidModel('bridge requires ObservationUnitId');}
    if(key(channel.unitId)!==key(observationUnitId('unit/fixture-pulse')))invalidModel('bridge requires exact unit/fixture-pulse member');
    if(key(channelId)!==key(channel.observationChannelId)||channel.observationChannelId.namespaceId!==1005n||channel.modalityId.namespaceId!==1006n||channel.observerId.namespaceId!==1000n||observers.has(key(channel.observerId))
      ||channel.polarityId!==1n||channel.measurementModeId!==1n||!channel.precision.equals(q(1n))||channel.missingnessRuleId!==1n
      ||channel.visibleProvenanceSlotIds.length||channel.experimentalControlId!==undefined)invalidModel('bridge channel violates exact fixed recipe');
    txt(channel.observerId.payload);observers.add(key(channel.observerId));return {value,channel};
  }).sort((a,b)=>key(a.channel.observationChannelId)<key(b.channel.observationChannelId)?-1:1);
  return Object.freeze({eventTypes:()=>stages.map((_,i)=>eventType(i)),
    begin(instant:bigint){
      let active=true;const pending=new Set<object>(),sources=new Set<bigint>();
      const generated=new Map<bigint,{event:ScheduledEvent;channel:ObservationChannel;reservation?:ExperienceReservation;support?:CanonicalValue;consumed:boolean}>();
      const reservations:ExperienceReservation[]=[],frozen:StagedSemanticExperience[]=[];
      function live(){if(!active)fail('closed bridge instant');}
      type Data={channel:ObservationChannel;reservation?:ExperienceReservation;support?:CanonicalValue};
      function stage(source:ScheduledEvent,plans:readonly {emission:EventEmission;data:Data}[]){
        source=structuredClone(source);
        const ticket={};pending.add(ticket);
        return {emissions:()=>plans.map(p=>structuredClone(p.emission)),bindAllocatedChildren(children:readonly ScheduledEvent[]){
          live();if(!pending.has(ticket)||children.length!==plans.length)fail('missing/duplicate bridge children');
          const ids=new Set<bigint>();children.forEach((child,i)=>{
            const expected={...plans[i].emission,eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[source.eventId]};
            if(ids.has(child.eventId)||generated.has(child.eventId)||child.eventId===source.eventId||child.eventSequence<=source.eventSequence||key(scheduledEventValue(child))!==key(scheduledEventValue(expected)))fail('wrong bridge child association');
            ids.add(child.eventId);
          });
          children.forEach((event,i)=>generated.set(event.eventId,{event:structuredClone(event),...plans[i].data,consumed:false}));pending.delete(ticket);
        }};
      }
      return Object.freeze({
        /** Fixed source adapter calls this only after the compiler-owned R executed. No fact is read. */
        source(source:ScheduledEvent,allocator:{allocateRuntimeId():bigint}){
          live();if(source.dueAt!==instant||source.phase!==110n||key(source.eventTypeId)!==key(AUTHORED_FACT_EVENT)||sources.has(source.eventId))fail('wrong/repeated bridge source');sources.add(source.eventId);
          const truth=boundedEffectTruthValue({before:q(0n),potentialEffect:q(1n),applied:q(1n),overflow:q(0n),after:q(1n),minimum:q(0n),maximum:q(2n),provenance:{slots:new Map()},truthRecordId:typedIdentifier(1121n,unsigned(allocator.allocateRuntimeId()))});
          return stage(source,definitions.map(d=>({data:{channel:d.channel},emission:{dueAt:source.dueAt,phase:120n,eventTypeId:eventType(0),payload:r('FixtureConsequenceObservationInput',{Truth:truth,Channel:d.value}),dependencies:list([])}})));
        },
        execute(event:ScheduledEvent,allocator:{allocateRuntimeId():bigint}){
          live();const relation=generated.get(event.eventId);
          if(!relation||relation.consumed||key(scheduledEventValue(relation.event))!==key(scheduledEventValue(event)))fail('unadmitted bridge operation');
          relation.consumed=true;
          const index=Number(event.phase-120n);if(index<0||index>4)fail('wrong bridge phase');
          const observer=txt(relation.channel.observerId.payload),outputs:CanonicalValue[]=[];
          if(index===0){
            assertTruthAvailableAtLaneEntry('Consequence',110n);assertLaneOperationPhase('Consequence','Observation',event.phase);
            const payload=rec(event.payload,310n),ordinal=allocator.allocateRuntimeId();
            const observation=compileBridgeObservation(restoreBoundedEffectTruth(f(payload,1n)),relation.channel,typedIdentifier(1115n,unsigned(ordinal)),event.dueAt);
            outputs.push(observation); // Sole published observation, never its raw candidate.
            relation.reservation=admitObservationLane({observerId:observer,lane:'Consequence',dueAt:event.dueAt,emitsCharacterAccessibleEvidence:true},()=>allocator.allocateRuntimeId()).reservation!;
            reservations.push(relation.reservation);relation.support=supportingObservationIdValue(observer,ordinal);
          }else{
            assertLaneOperationPhase('Consequence',(['Observation','TrackingAndSegmentation','BindingAndFeatureEvidence','Classification','ExperienceFreeze'] as const)[index],event.phase);
            if(!relation.reservation||!relation.support||key(event.payload)!==key(relation.support))fail('missing supporting observation/reservation');
            if(index===3)assertCanonicalClassificationWork([]);
          }
          if(index===4){
            const support=rec(relation.support!,216n),observation=id(f(support,2n));
            if(typeof observation.payload==='boolean'||observation.payload.kind!=='unsigned')fail('wrong observation identity');
            const experience=assemblePreRecognitionExperience({experienceId:relation.reservation!.experienceId,observerId:observer,occurredAt:event.dueAt,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:observer,observationId:observation.payload.value}],transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'});
            const staged=freezeAndStageSemanticExperience(relation.reservation!,experience,event.phase);frozen.push(staged);
            const value=preRecognitionSemanticExperienceValue(staged.experience);outputs.push(value);
            return {outputs,freeze:value,plan:stage(event,[])};
          }
          return {outputs,freeze:undefined,plan:stage(event,[{data:{channel:relation.channel,reservation:relation.reservation,support:relation.support},emission:{dueAt:event.dueAt,phase:event.phase+1n,eventTypeId:eventType(index+1),payload:relation.support!,dependencies:list([])}}])};
        },
        finish(){live();if(pending.size||[...generated.values()].some(v=>!v.consumed))fail('unfinished bridge work');validateSuccessfulExperienceSettlement(reservations,frozen);active=false;},
        abort(){active=false;pending.clear();generated.clear();reservations.length=0;frozen.length=0;},
      });
    },
  });
}
