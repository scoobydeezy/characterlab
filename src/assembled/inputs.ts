/** Full input commitment and one allocation space; reuse legacy source validators. */
import {canonicalEncode as enc,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createRunIdentity} from '../substrate/identity';
import {simInstant} from '../substrate/time';
import {compileOrderedInputProfile,COGNITIVE_INPUT_PROFILE} from '../campaign2/orderedInputs';
import {taskInitialSchedule} from '../campaign2/taskBootstrap';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {exact} from '../campaign3/embodiedMath';
import {dataItems as items,dataField as f,dataRecord as rec,dataIdentity as id,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {PRACTICE_SETTING,practiceSetting} from './skill';
import {BODY_SAMPLE,BODY_DELIVERY,BODY_OBSERVER,BODY_DEFINITION} from './body';
import type {compileCharacterModel} from './model';
import type {compileCharacterState} from './state';
export async function compileCharacterInputs(model:Awaited<ReturnType<typeof compileCharacterModel>>,component:Awaited<ReturnType<typeof compileCharacterState>>,data:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const manifest=decode(data.orderedInputs),rows=items(manifest,'list'),bodyRows:CanonicalValue[]=[],skillRows:CanonicalValue[]=[],legacyRows:CanonicalValue[]=[];
 for(const row of rows){const slots=items(row,'list');if(slots.length!==5)invalidModel('five-position assembled input required');const isBody=[BODY_SAMPLE,BODY_DELIVERY].some(t=>key(t)===key(slots[2]));(isBody?bodyRows:key(slots[2])===key(PRACTICE_SETTING)?skillRows:legacyRows).push(row);}
 if(bodyRows.length&&!model.body)invalidModel('body sources require assembled0.2');if(bodyRows.length>100)invalidModel('body source capacity100');
 const profile=compileOrderedInputProfile(COGNITIVE_INPUT_PROFILE,model.content,component.prior.base.domains,decode);
 const base=await profile.create(enc(list(legacyRows)),data.initialState,model.modelIdentity,data.runSeed),initial=taskInitialSchedule(component,base,data.initialState),samples=new Set<bigint>();
 const bodies=bodyRows.map((row,index)=>{const [at,phase,event,payload,dependencies]=items(row,'list');if(typeof at==='boolean'||at.kind!=='signed'||at.value<1n||at.value>100n||typeof phase==='boolean'||phase.kind!=='unsigned'||key(dependencies)!==key(list([])))invalidModel('body source time/phase/dependencies');
  const isSample=key(event)===key(BODY_SAMPLE),time=(at as {value:bigint}).value;if((phase as {value:bigint}).value!==(isSample?10n:110n))invalidModel('body source phase');
  if(isSample){const cue=rec(payload,459n);if(key(f(cue,1n))!==key(BODY_OBSERVER)||key(f(cue,2n))!==key(BODY_DEFINITION))invalidModel('body observer/channel');if(samples.has(time))invalidModel('duplicate body sampling');samples.add(time);}
  else{const p=items(payload,'list');if(p.length!==2||key(p[0])!==key(component.tasks[0].character)||exact(p[1]).numerator<0n)invalidModel('body delivery target/amount');}
  const ordinal=initial.allocators.nextEventId+BigInt(index);return {dueAt:simInstant(time),phase:(phase as {value:bigint}).value,eventTypeId:id(event),payload,dependencies,eventId:ordinal,eventSequence:initial.allocators.nextEventSequence+BigInt(index),causalParentEventIds:[]};
 });
 if(skillRows.length&&!model.skill||skillRows.length>100)invalidModel('procedural source domain');
 let lastPhase=0;const skillTimes=new Set<bigint>();
 const settings=skillRows.map((row,index)=>{const [at,phase,event,payload,dependencies]=items(row,'list');if(typeof at==='boolean'||at.kind!=='signed'||at.value<1n||at.value>100n||key(phase)!==key({kind:'unsigned',value:30n})||key(dependencies)!==key(list([])))invalidModel('practice source time/phase/dependencies');const time=(at as {value:bigint}).value;if(skillTimes.has(time))invalidModel('duplicate practice setting');skillTimes.add(time);practiceSetting(payload);const ordinal=initial.allocators.nextEventId+BigInt(bodies.length+index);return {dueAt:simInstant(time),phase:30n,eventTypeId:id(event),payload,dependencies,eventId:ordinal,eventSequence:initial.allocators.nextEventSequence+BigInt(bodies.length+index),causalParentEventIds:[]};});
 for(const e of [...settings].sort((a,b)=>a.dueAt<b.dueAt?-1:1)){const phase=practiceSetting(e.payload).phase;if(phase<lastPhase)invalidModel('development phase reversal');lastPhase=phase;}
 const runIdentity=bodyRows.length||skillRows.length?await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(data.initialState)),orderedInputSequence:await commitManifest(manifest),runSeed:data.runSeed}):base.runIdentity;
 // Even without body rows, supplied ordering equals the legacy manifest exactly.
 return Object.freeze({base,runIdentity,bodyEvents:bodies,skillEvents:settings,initial:{...initial,events:[...initial.events,...bodies,...settings],allocators:{...initial.allocators,nextEventId:initial.allocators.nextEventId+BigInt(bodies.length+settings.length),nextEventSequence:initial.allocators.nextEventSequence+BigInt(bodies.length+settings.length)}}});
}
