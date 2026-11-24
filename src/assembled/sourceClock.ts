import {criterionSource} from './criterionSensing';
/** Original-source-clock/0.1: narrow successor of C2 orderedInputs/taskBootstrap.
 * Same governed original inputs and one queue; no time rewriting or psychology. */
import {canonicalEncode as enc,list,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createRunIdentity} from '../substrate/identity';
import {simInstant} from '../substrate/time';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {compileOrderedInputProfile,COGNITIVE_INPUT_PROFILE,DELIBERATION_EVENT,PROBE_SOURCE_EVENT,beginCognitiveSourceInstant,beginProbeSourceInstant} from '../campaign2/orderedInputs';
import {taskInitialSchedule,TASK_DEADLINE_EVENT} from '../campaign2/taskBootstrap';
import {dataItems as items,dataRecord as rec,dataField as f,dataIdentity as id,dataKey as key} from '../campaign2/canonicalData';
import {decodeEmbodied} from '../campaign3/embodiedCodecs';
import {decodeCognitive} from './codecs';
import type {compileCharacterModel} from './model';
import type {compileCharacterState} from './state';
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','original source clock: '+s);};
export async function compileSourceClock(model:Awaited<ReturnType<typeof compileCharacterModel>>,component:Awaited<ReturnType<typeof compileCharacterState>>,rows:readonly CanonicalValue[],data:{initialState:Uint8Array;runSeed:Uint8Array}){
 if(!model.extendedTime){
  const base=await compileOrderedInputProfile(COGNITIVE_INPUT_PROFILE,model.content,component.prior.base.domains,decodeEmbodied).create(enc(list(rows)),data.initialState,model.modelIdentity,data.runSeed);
  return {base,initial:taskInitialSchedule(component,base,data.initialState),beginCognitive:(at:bigint)=>beginCognitiveSourceInstant(base,at),beginProbe:(at:bigint)=>beginProbeSourceInstant(base,at)};
 }
 const manifest=structuredClone(list(rows)),initialState=decodeCognitive(data.initialState),seed=data.runSeed.slice(),identity=structuredClone(model.modelIdentity);
 const events:ScheduledEvent[]=items(manifest,'list').map((v,i)=>{
  const a=items(v,'list');if(a.length!==5)fail('five positions required');const [at,phase,event,payload,dependencies]=a;
  if(typeof at==='boolean'||at.kind!=='signed'||typeof phase==='boolean'||phase.kind!=='unsigned')fail('time/phase scalar');
  const time=simInstant((at as Extract<CanonicalValue,{kind:'signed'}>).value),p=(phase as Extract<CanonicalValue,{kind:'unsigned'}>).value,kind=id(event);
  const cognitive=key(kind)===key(DELIBERATION_EVENT),probe=key(kind)===key(PROBE_SOURCE_EVENT);
  if(!cognitive&&!probe)fail('original kind');if(time<1n||time>(probe?model.timeLimit-1n:model.timeLimit)||p!==(cognitive?40n:model.jointCriterion?120n:110n))fail('time/phase domain');
  if(key(dependencies)!==key(list([])))fail('empty dependencies required');
  if(cognitive){const cue=rec(payload,377n);model.content.validateRecordRoles(enc(cue));if(key(f(cue,2n))!==key(typedIdentifier(1027,text('definition/task-workspace'))))fail('agenda');}
  else if(key(f(rec(model.criterionSensing?criterionSource(payload).cue:payload,333n),1n))!==key(typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))))fail('probe definition');
  return {dueAt:time,phase:p,eventTypeId:kind,payload,dependencies,eventId:BigInt(i),eventSequence:BigInt(i),causalParentEventIds:[]};
 });
 if(events.length>100||new Set(events.map(e=>model.jointCriterion?String(e.dueAt)+':'+key(e.eventTypeId):String(e.dueAt))).size!==events.length)fail('at most100 originals; duplicate source kind/instant');
 const admitted=structuredClone(events);
 function begin(instant:bigint,kind:CanonicalValue){
  simInstant(instant);let active=true;const used=new Set<bigint>();
  return Object.freeze({admit(event:ScheduledEvent){
   if(!active||event.dueAt!==instant||used.has(event.eventId)||key(event.eventTypeId)!==key(kind))fail('expired/repeated/wrong source');
   const expected=admitted.find(e=>e.eventId===event.eventId);
   if(!expected||key(scheduledEventValue(event))!==key(scheduledEventValue(expected)))fail('event differs from admitted original');
   used.add(event.eventId);
  },close(){active=false;used.clear();}});
 }
 const ordered=await commitManifest(manifest),initial=await commitManifest(initialState),runIdentity=await createRunIdentity({modelIdentity:identity,initialState:initial,orderedInputSequence:ordered,runSeed:seed});
 const base={runIdentity,manifestBytes:ordered.canonicalBytes.slice(),initialEvents:structuredClone(events),initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(events.length),nextEventSequence:BigInt(events.length)}};
 const deadlines:ScheduledEvent[]=component.tasks.map((t,i)=>({eventId:BigInt(events.length+i),eventSequence:BigInt(events.length+i),dueAt:simInstant(t.deadline),phase:140n,eventTypeId:structuredClone(TASK_DEADLINE_EVENT),payload:structuredClone(t.key),dependencies:list([]),causalParentEventIds:[]}));
 return {base,initial:{events:[...structuredClone(events),...deadlines],deadlines,allocators:{nextRuntimeId:0n,nextEventId:BigInt(events.length+deadlines.length),nextEventSequence:BigInt(events.length+deadlines.length)}},beginCognitive:(at:bigint)=>begin(at,DELIBERATION_EVENT),beginProbe:(at:bigint)=>begin(at,PROBE_SOURCE_EVENT)};
}
