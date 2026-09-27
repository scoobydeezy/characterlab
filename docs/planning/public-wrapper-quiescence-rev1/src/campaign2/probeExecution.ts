import {simInstant} from '../substrate/time';
/** regulatory-diagnostic-probe/0.1-candidate, selected only by frozen probe RulesVersion .2. */
import {canonicalEncode,record,unsigned,signed,list,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,ContractReadProjection,statePathValue,type StatePath,type StatePathPattern,type ActualReadRecord} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {ExactRational} from '../substrate/exactMath';
import {permittedEvidenceValue} from '../observation/observation';
import {assemblePreRecognitionExperience} from '../semanticBinding/perceptualEventFiles';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {supportingObservationIdValue} from '../semanticBinding/semanticCodecs';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {probeRecord,schemas} from './probeCodecs';
import {executeProbeReadout,probeOperands} from './probeReadout';
import {campaign2Record} from './codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataText as txt,dataKey as key} from './canonicalData';
import type {compileRegulatoryReferences} from './regulatoryReference';
const atom=(ns:number,s:string)=>typedIdentifier(ns,text(s));
export const PROBE_ACCESSOR=atom(1028,'accessor/regulatory-diagnostic-displacement-prior');
export const PROBE_EVENT_NAMES=['','-observation','-tracking','-binding','-classification','-freeze','-evaluation-padding','-evidence-padding'].map(s=>'event/regulatory-diagnostic-probe'+s);
const eventType=(i:number)=>atom(1001,PROBE_EVENT_NAMES[i]);
function fail(s:string):never {throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION',s);}
function carrier(tag:number,fields:readonly [bigint,CanonicalValue][]=[]){return record(schemas.find(s=>s.typeId===335n)!,new Map([[1n,unsigned(tag)],...fields]));}
const suppressed=()=>carrier(1);
export function compileProbeExecution(registry:CanonicalValue,reg:ReturnType<typeof compileRegulatoryReferences>){
 const entries=items(items(registry,'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n);
 const entry=entries.find(v=>key(f(rec(v,171n),1n))===key(atom(1027,'definition/regulatory-diagnostic-probe')))!;
 const definitionId=f(rec(entry,171n),1n),definition=rec(f(rec(entry,171n),4n),331n),C=f(definition,1n),V=f(definition,2n),channel=rec(f(definition,3n),332n);
 const available=f(definition,4n)===true,permitted=available&&f(definition,5n)===true;
 const variable=entries.find(v=>key(f(rec(v,171n),1n))===key(V))!,variableDefinition=rec(f(rec(f(rec(variable,171n),4n),283n),1n),280n),scale=f(variableDefinition,1n);
 if(typeof scale==='boolean'||scale.kind!=='unsigned')fail('bad REG scale');
 const selector={kind:'mapKey' as const,key:campaign2Record('RegulatoryAdaptationKey',{CharacterId:C,RegulatoryVariableId:V})};
 const path:StatePath={rootStateTypeId:302n,fieldId:3n,selectors:[selector]},pattern:StatePathPattern={rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'exact',selector}]};
 return Object.freeze({C,channel,variableDefinition,definitionId,available,permitted,path,pattern,eventTypes:()=>PROBE_EVENT_NAMES.map((_,i)=>eventType(i)),
  validateReadEvidence(reads:readonly ActualReadRecord[]){
   if(reads.length!==(available?1:0))fail('probe trace read count');
   for(const r of reads)if(key(r.accessorId)!==key(PROBE_ACCESSOR)||key(statePathValue(r.path))!==key(statePathValue(path))||r.derivedSources.length||r.transformationId!==undefined)fail('probe trace accessor/path violation');
  },
  begin(instant:bigint){
   const generated=new Map<bigint,ScheduledEvent>(),pending=new Set<object>();let sourceUsed=false,active=true;
   const reservations:ExperienceReservation[]=[],frozen:StagedSemanticExperience[]=[];let reservation:ExperienceReservation|undefined;
   function live(){if(!active)fail('closed probe execution');}
   function stage(source:ScheduledEvent,emissions:EventEmission[]){const ticket={};pending.add(ticket);return {emissions:()=>structuredClone(emissions),bindAllocatedChildren(children:readonly ScheduledEvent[]){live();if(!pending.delete(ticket)||children.length!==emissions.length)fail('probe child count/reuse');children.forEach((c,i)=>{const expected={...emissions[i],eventId:c.eventId,eventSequence:c.eventSequence,causalParentEventIds:[source.eventId]};if(generated.has(c.eventId)||c.eventId===source.eventId||c.eventSequence<=source.eventSequence||key(scheduledEventValue(c))!==key(scheduledEventValue(expected)))fail('probe child association');generated.set(c.eventId,structuredClone(c));});}};}
   function emit(source:ScheduledEvent,index:number,payload:CanonicalValue){return stage(source,[{dueAt:simInstant(instant),phase:index>=6?130n:119n+BigInt(index),eventTypeId:eventType(index),payload,dependencies:list([])}]);}
   return Object.freeze({
    execute(event:ScheduledEvent,state:AuthoritativeState,allocator:{allocateRuntimeId():bigint}){
     live();const index=PROBE_EVENT_NAMES.indexOf(txt(event.eventTypeId.payload));if(index<0||event.dueAt!==instant||event.phase!==(index===0?110n:index>=6?130n:119n+BigInt(index)))fail('probe slot');
     if(index===0){if(sourceUsed)fail('repeated probe source');sourceUsed=true;}else{const expected=generated.get(event.eventId);if(!expected||key(scheduledEventValue(expected))!==key(scheduledEventValue(event)))fail('unadmitted probe child');generated.delete(event.eventId);}
     let paddingRemaining=index===0&&!available?1:index===1&&!permitted?2:index>=6?1:0;
     const consumeRuntimeOrdinalPadding=():void=>{if(paddingRemaining<=0)fail('illegal padding slot');paddingRemaining--;allocator.allocateRuntimeId();};
     const outputs:CanonicalValue[]=[],reads:ActualReadRecord[]=[];
     if(index===0){
      if(!available){consumeRuntimeOrdinalPadding();return {outputs,reads,freeze:undefined,plan:emit(event,1,suppressed())};}
      const projection=new ContractReadProjection(state,[pattern],{displacement:{kind:'direct',accessorId:PROBE_ACCESSOR,path}}),leaf=projection.read('displacement');reads.push(...projection.actualReadRecords());
      const D=leaf===undefined?signed(0):f(rec(leaf,299n),1n),r0=reg.referenceOperatingPoint(C,V,instant);
      if(r0.kind!=='ReferenceValue'||reg.validateAdaptedReference(C,V,instant,D).kind!=='Valid'||typeof D==='boolean'||D.kind!=='signed')fail('invalid effective reference');
      const reference=r0.value;if(typeof reference==='boolean'||reference.kind!=='signed')fail('bad reference');
      const n=executeProbeReadout(probeOperands(reference.value,D.value));
      const truth=probeRecord(334,[typedIdentifier(1123,unsigned(allocator.allocateRuntimeId())),definitionId,signed(instant),signed(n)]);outputs.push(truth);
      return {outputs,reads,freeze:undefined,plan:emit(event,1,permitted?carrier(2,[[2n,truth],[3n,definitionId]]):suppressed())};
     }
     if(!permitted){while(paddingRemaining)consumeRuntimeOrdinalPadding();return {outputs,reads,freeze:undefined,plan:index===7?stage(event,[]):emit(event,index+1,suppressed())};}
     const observer=txt(id(f(channel,2n)).payload);
     if(index===1){
      const truth=rec(f(rec(event.payload,335n),2n),334n),n=f(truth,4n);if(typeof n==='boolean'||n.kind!=='signed')fail('bad truth integer');
      const q=ExactRational.of(n.value,scale.value),ordinal=allocator.allocateRuntimeId();
      outputs.push(permittedEvidenceValue({kind:'present',observationId:typedIdentifier(1115,unsigned(ordinal)),observerId:id(f(channel,2n)),subjectId:id(f(channel,3n)),observationChannelId:id(f(channel,1n)),occurredAt:instant as never,measurementInterval:{lower:q,upper:q},evidenceKindId:1n,precision:ExactRational.of(1n),perceivedConceptTokens:[],safeSourceReferences:[],transformationVersion:'regulatory-diagnostic-probe/0.1-candidate'}));
      reservation=admitObservationLane({observerId:observer,lane:'Consequence',dueAt:instant,emitsCharacterAccessibleEvidence:true},()=>allocator.allocateRuntimeId()).reservation!;reservations.push(reservation);
      return {outputs,reads,freeze:undefined,plan:emit(event,2,carrier(3,[[4n,supportingObservationIdValue(observer,ordinal)]]))};
     }
     if(index===5){
      if(!reservation)fail('missing experience reservation');const support=rec(f(rec(event.payload,335n),4n),216n),ordinal=id(f(support,2n)).payload;if(typeof ordinal==='boolean'||ordinal.kind!=='unsigned')fail('bad support');
      const experience=assemblePreRecognitionExperience({experienceId:reservation.experienceId,observerId:observer,occurredAt:instant,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:observer,observationId:ordinal.value}],transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'});
      const staged=freezeAndStageSemanticExperience(reservation,experience,event.phase);frozen.push(staged);const value=preRecognitionSemanticExperienceValue(staged.experience);outputs.push(value);
      return {outputs,reads,freeze:value,plan:stage(event,[])};
     }
     return {outputs,reads,freeze:undefined,plan:emit(event,index+1,event.payload)};
    },finish(){live();if(pending.size||generated.size)fail('unfinished probe slots');validateSuccessfulExperienceSettlement(reservations,frozen);},abort(){active=false;pending.clear();generated.clear();},
   });
  },
 });
}
