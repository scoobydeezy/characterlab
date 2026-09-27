/** Closed original grammar for multisource-public/0.1-candidate. */
import {canonicalEncode as enc,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createRunIdentity} from '../substrate/identity';
import {simInstant} from '../substrate/time';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataIdentity as id,dataText as str} from '../campaign2/canonicalData';
import {decodeMultisource as decode} from './multisourcePublicCodecs';
import {msId,msDefinition} from './multisourceModelRecipe';
import type {compileMultisourceModel} from './multisourceModel';
type Model=Awaited<ReturnType<typeof compileMultisourceModel>>;
function fail(message:string):never {throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);}
export async function compileMultisourceInputs(model:Model,initialBytes:Uint8Array,inputBytes:Uint8Array,seed:Uint8Array){
 const ordered=decode(inputBytes.slice()),initial=decode(initialBytes.slice()),seedCopy=seed.slice(),profile=model.profile();
 model.initialState(enc(initial));
 const rows=items(ordered,'list'),seen=new Set<string>();let opportunities=0;
 if(rows.length>106)fail('multisource original bound');
 const events=rows.map((row,index):ScheduledEvent=>{
  const fields=items(row,'list');if(fields.length!==5)fail('five original positions');
  const [time,phase,type,payload,dependencies]=fields;
  if(typeof time==='boolean'||time.kind!=='signed'||time.value<1n||time.value>100n)fail('bounded positive original time');
  if(id(type).namespaceId!==1001n||key(dependencies)!==key(list([])))fail('original event namespace/dependencies');
  const name=str(id(type).payload),observe=name==='event/multisource/observe';
  if(!observe&&name!=='event/multisource/replenish')fail('generated event supplied as original');
  if(uint(phase)!==(observe?10n:110n))fail('original phase');
  if(observe){const p=rec(payload,712n);if(key(f(p,1n))!==key(f(profile,1n))||key(f(p,2n))!==key(msDefinition('profile')))fail('opportunity observer/profile');if(++opportunities>6)fail('six opportunity limit');}
  else {const p=rec(payload,651n);if(!items(f(profile,5n),'list').some(v=>key(f(rec(v,707n),1n))===key(f(p,1n))))fail('unadmitted reserve target');}
  const fingerprint=time.value+'/'+name;if(seen.has(fingerprint))fail('one original per kind/instant');seen.add(fingerprint);
  return {eventId:BigInt(index),eventSequence:BigInt(index),dueAt:simInstant(time.value),phase:uint(phase),eventTypeId:id(type),payload,dependencies,causalParentEventIds:[]};
 });
 if(events.some((e,i)=>i>0&&(events[i-1].dueAt>e.dueAt||events[i-1].dueAt===e.dueAt&&events[i-1].phase>=e.phase)))fail('canonical original order');
 const suppliedCount=events.length;
 for(const binding of items(f(profile,3n),'list')){const task=rec(binding,708n),spec=rec(model.definition(f(task,2n)),370n),deadline=f(spec,6n);if(typeof deadline==='boolean'||deadline.kind!=='signed')fail('task deadline');const ordinal=BigInt(events.length);
  events.push({eventId:ordinal,eventSequence:ordinal,dueAt:simInstant(deadline.value),phase:140n,eventTypeId:msId(1001,'event/multisource/deadline'),payload:f(task,1n),dependencies:list([]),causalParentEventIds:[]});
 }
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(initial),orderedInputSequence:await commitManifest(ordered),runSeed:seedCopy});
 return {events,runIdentity,suppliedCount,inputBytes:enc(ordered)};
}
