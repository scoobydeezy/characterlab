/** body-signal-cue-component/0.1-candidate. Actual source records; public origin authentication remains upstream. */
import {canonicalEncode,bytesToHex,text,cloneCanonicalValue,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {decodeEmbodied} from './embodiedCodecs';
import type {SignalSelectionInput} from './interoceptiveSignalSelection';
import type {BodyRecallCue} from './bodyRecall';
import {LOCAL_RESERVE_OBSERVATION_VERSION} from './localReserveObservation';
const key=(v:CanonicalValue)=>bytesToHex(canonicalEncode(v));
const fail=()=>{throw Error('BODY_CUE_SOURCE');};
const dense=(xs:readonly unknown[],max:number)=>{if(!Array.isArray(xs)||xs.length>max||Object.keys(xs).length!==xs.length)fail();};
const identity=(v:TypedIdentifierValue,ns:bigint)=>{if(!v||v.kind!=='typedIdentifier'||v.namespaceId!==ns||typeof v.payload!=='object'||v.payload.kind!=='text'||!v.payload.value)fail();canonicalEncode(v);};
export function admitBodySignalCue(input:SignalSelectionInput,now:bigint,permitted:boolean){
 return admitCue(input,now,permitted,'embodied-level-observation/0.1-candidate');
}
/** local-reserve-sample-bridge-component/0.1-candidate; distinct exact producer. */
export function admitLocalReserveSignalCue(input:SignalSelectionInput<bigint|null>,now:bigint,permitted:boolean){
 return admitCue(input,now,permitted,LOCAL_RESERVE_OBSERVATION_VERSION);
}
function admitCue(input:SignalSelectionInput<bigint|null>,now:bigint,permitted:boolean,producerVersion:string){
 if(typeof permitted!=='boolean'||typeof now!=='bigint'||now<0n||input.at!==now||(input.opportunityId===null?producerVersion!==LOCAL_RESERVE_OBSERVATION_VERSION:typeof input.opportunityId!=='bigint'||input.opportunityId<0n))fail();
 identity(input.observer,1000n);dense(input.declarations,256);dense(input.samples,256);
 const channels=new Map<string,string>(),viewCounts=new Map<string,number>(),sizes=new Map<string,number>();
 for(const d of input.declarations){identity(d.channel,1005n);if(typeof d.signal!=='string'||!d.signal.length||d.signal.normalize('NFC')!==d.signal||new TextEncoder().encode(d.signal).length>64)fail();const c=key(d.channel);if(channels.has(c))fail();channels.set(c,d.signal);viewCounts.set(d.signal,(viewCounts.get(d.signal)??0)+1);if(viewCounts.get(d.signal)!>16)fail();}
 if(viewCounts.size>16)fail();
 const used=new Set<string>(),occurrences=new Set<string>(),signals=new Set<string>(),support:TypedIdentifierValue[]=[];
 for(const value of input.samples){
  const encoded=canonicalEncode(value),r=decodeEmbodied(encoded);if(typeof r!=='object'||r.kind!=='record'||r.schema.schemaVersion!==1n||![461n,463n].includes(r.schema.typeId))fail();
  if(typeof r!=='object'||r.kind!=='record')throw Error('unreachable');
  const f=(n:bigint)=>r.fields.get(n)!;
  const at=f(4n),version=f(r.schema.typeId===461n?6n:5n),id=f(1n);
  if(key(f(2n))!==key(input.observer)||typeof at!=='object'||at.kind!=='signed'||at.value!==now||typeof version!=='object'||version.kind!=='text'||version.value!==producerVersion||typeof id!=='object'||id.kind!=='typedIdentifier'||id.namespaceId!==1115n||typeof id.payload!=='object'||id.payload.kind!=='unsigned')fail();
  const channel=key(f(3n)),signal=channels.get(channel),occurrence=key(id);if(signal===undefined||used.has(channel)||occurrences.has(occurrence))fail();used.add(channel);occurrences.add(occurrence);
  const s=signal!;sizes.set(s,(sizes.get(s)??0)+encoded.length);if(sizes.get(s)!>65536)fail();
  if(r.schema.typeId===461n&&input.opportunityId===null)fail();
  if(permitted&&r.schema.typeId===461n){signals.add(s);support.push(cloneCanonicalValue(id) as TypedIdentifierValue);}
 }
 const ordered=[...signals].sort((a,b)=>key(text(a))<key(text(b))?-1:key(text(a))>key(text(b))?1:0);
 const cue:BodyRecallCue=ordered.length?Object.freeze({kind:'Present',signals:Object.freeze(ordered)}):Object.freeze({kind:'Absent'});
 support.sort((a,b)=>key(a)<key(b)?-1:key(a)>key(b)?1:0);
 return Object.freeze({cue,provenance:Object.freeze({opportunityId:input.opportunityId,at:now,observer:cloneCanonicalValue(input.observer),supportingObservationIds:Object.freeze(support)})});
}
