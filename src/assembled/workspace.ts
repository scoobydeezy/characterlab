import {AFFECT_MEMORY,unpackAffectCue} from './affectMemory';
/** assembled-character-workspace/0.1-candidate. One capacity, existing focus first. */
import {list,text,signed,unsigned,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataText as txt,dataUnsigned as uint} from '../campaign2/canonicalData';
import {BODY_OBSERVER,BODY_CHANNEL} from './body';
import {MEMORY_RECALL,EPISODE,SOCIAL_EPISODE,socialEpisodePath,validateSocialEpisode} from './memory';
export const WORKSPACE='assembled-workspace/0.1';
export interface BodyRecallDelivery {readonly character:CanonicalValue;readonly event:ScheduledEvent;readonly episodes:readonly CanonicalValue[]}
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','assembled workspace: '+s);};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
/** The caller supplies only current, completed retrieval deliveries; never an archive. */
export function sharedWorkspace(taskWorkspace:CanonicalValue,capacity:number,at:bigint,deliveries:readonly BodyRecallDelivery[],reserved=0){
 const w=rec(taskWorkspace,381n),C=f(w,2n),tasks=items(f(w,4n),'list'),forecast=rec(f(w,5n),380n),tag=uint(f(forecast,1n));
 if(!Number.isSafeInteger(capacity)||capacity<0||capacity>5||typeof at!=='bigint'||at<0n||![1n,2n].includes(tag))fail('capacity/clock/forecast');
 if(!Number.isSafeInteger(reserved)||reserved<0||reserved>capacity)fail('reserved capacity');
 const used=tasks.length+(tag===2n?1:0)+reserved;if(used>capacity)fail('existing focus exceeds capacity');
 const candidates:CanonicalValue[]=[],seen=new Map<string,CanonicalValue>(),events=new Set<bigint>();let lastSequence=-1n;
 for(const delivery of deliveries){const {event,episodes}=delivery;
  if(!eq(delivery.character,C)||event.dueAt!==at||event.phase!==20n||!eq(event.eventTypeId,MEMORY_RECALL)||!(eq(event.payload,BODY_CHANNEL)||(typeof event.payload!=='boolean'&&event.payload.kind==='list'&&[SOCIAL_EPISODE,AFFECT_MEMORY].some(tag=>eq(items(event.payload,'list')[0],text(tag)))))||events.has(event.eventId)||event.eventSequence<=lastSequence)fail('foreign/stale/unordered recall delivery');events.add(event.eventId);lastSequence=event.eventSequence;
  for(const episode of episodes){const a=items(episode,'list');if(a.length!==6||![EPISODE,SOCIAL_EPISODE].includes(txt(a[0])))fail('episode shape');const acquisition=id(a[1]),acquired=a[5],social=txt(a[0])===SOCIAL_EPISODE,sample=social?undefined:rec(a[2],461n);if(social)validateSocialEpisode(episode,C);if(social){const associative=typeof event.payload!=='boolean'&&event.payload.kind==='list'&&eq(event.payload.items[0],text(AFFECT_MEMORY)),cue=associative?unpackAffectCue(event.payload,at).cue:event.payload,k=(socialEpisodePath(C,a[2]).selectors[0] as {key:CanonicalValue}).key;if(associative){if(![0,1,2,3].every(i=>eq(items(k,'list')[i],items(cue,'list')[i])))fail('social association scope');}else if(!eq(k,cue))fail('social cue/episode mismatch');}
   if(acquisition.namespaceId!==1125n||typeof acquisition.payload==='boolean'||acquisition.payload.kind!=='unsigned'||typeof acquired==='boolean'||acquired.kind!=='signed'||acquired.value<0n||acquired.value>=at||(!social&&(!eq(f(sample!,2n),BODY_OBSERVER)||!eq(f(sample!,3n),BODY_CHANNEL))))fail('foreign/future episode');
   const k=key(acquisition),prior=seen.get(k);if(prior){if(!eq(prior,episode))fail('inconsistent repeated acquisition');continue;}seen.set(k,episode);candidates.push(list([acquisition,episode,unsigned(event.eventId)]));
  }
 }
 const selected=candidates.slice(0,capacity-used),sourceIds=selected.map(v=>items(v,'list')[0]).sort((a,b)=>key(a)<key(b)?-1:key(a)>key(b)?1:0);
 return structuredClone({report:list([text(WORKSPACE),signed(at),unsigned(capacity),taskWorkspace,list(selected)]),sourceIds,input:list(deliveries.map(d=>list([d.character,scheduledEventValue(d.event),list(d.episodes)])))});
}

/** Task/forecast selection keeps its three-slot domain within the ONE shared budget. */
export function taskWorkspaceDefinition(definition:CanonicalValue,taskLimit=2){
 const d=rec(definition,378n),capacity=uint(f(d,2n));
 if(capacity>BigInt(taskLimit+2))fail('task projection capacity');
 return capacity>BigInt(taskLimit+1)?record(d.schema,new Map([...d.fields].map(([n,v])=>[n,n===2n?unsigned(taskLimit+1):v]))):definition;
}
