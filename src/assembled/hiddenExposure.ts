import {LEGACY_TIME_LIMIT,assertTimeLimit,type TimeLimit} from './timeDomain';
/** 0.109: original actual-fact validator with authenticated shared-queue IDs. */
import {canonicalEncode as enc,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {compileOrderedInputProfile,ORDERED_INPUT_PROFILE,beginAuthoredSourceInstant} from '../campaign2/orderedInputs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataUnsigned as u,invalidModel} from '../campaign2/canonicalData';
import {scheduledEventValue} from '../substrate/persistence';
import type {ScheduledEvent} from '../substrate/scheduler';
import {decodeCognitive} from './codecs';
import type {compileCharacterModel} from './model';
import type {compileCharacterState} from './state';
export async function compileHiddenExposure(model:Awaited<ReturnType<typeof compileCharacterModel>>,component:Awaited<ReturnType<typeof compileCharacterState>>,rows:CanonicalValue[],data:{initialState:Uint8Array;runSeed:Uint8Array},offset:{event:bigint;sequence:bigint},other:readonly ScheduledEvent[],timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 if(!rows.length)return undefined;
 if(!model.hiddenExposure||rows.length>100)invalidModel('hidden exposure requires0.109/capacity100');
 const times=new Set<bigint>();
 for(const row of rows){const [at,,,payload]=items(row,'list');if(typeof at==='boolean'||at.kind!=='signed'||at.value<1n||at.value>timeLimit||times.has(at.value)||other.some(e=>e.dueAt===at.value))invalidModel('exposure time/duplicate/original collision');times.add(at.value);
  const fact=rec(f(rec(payload,304n),1n),305n);if(key(f(fact,1n))!==key(component.tasks[0].character))invalidModel('exposure holder');u(f(fact,3n));
 }
 const original=await compileOrderedInputProfile(ORDERED_INPUT_PROFILE,model.content,component.prior.base.domains,decodeCognitive).create(enc(list(rows)),data.initialState,model.modelIdentity,data.runSeed);
 const events=original.initialEvents.map((e,i)=>({...e,eventId:offset.event+BigInt(i),eventSequence:offset.sequence+BigInt(i)}));
 const admitted=structuredClone(events);
 return Object.freeze({events,begin(instant:bigint){const authority=beginAuthoredSourceInstant(original,instant);return {execute(event:ScheduledEvent,allocator:{allocateRuntimeId():bigint}){
  const index=admitted.findIndex(e=>e.eventId===event.eventId);if(index<0||key(scheduledEventValue(admitted[index]))!==key(scheduledEventValue(event)))invalidModel('exposure source differs from full admitted event');
  return authority.execute(original.initialEvents[index],allocator);
 },close(){authority.close();}};}});
}
