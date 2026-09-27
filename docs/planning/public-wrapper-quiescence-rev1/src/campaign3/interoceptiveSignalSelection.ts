/** interoceptive-signal-selection-component/0.1-candidate. No public source authentication. */
import {canonicalEncode,bytesToHex,text,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import {decodeEmbodied} from './embodiedCodecs';
import {LOCAL_RESERVE_OBSERVATION_VERSION} from './localReserveObservation';
type R=Extract<CanonicalValue,{kind:'record'}>;
export interface SignalGateLimits {readonly maxSignals:number;readonly maxViewsPerSignal:number;readonly maxBytesPerSignal:number;readonly capacity:number}
export interface SignalDeclaration {readonly channel:TypedIdentifierValue;readonly signal:string}
export interface SignalSelectionInput<Opportunity extends bigint|null=bigint> {readonly opportunityId:Opportunity;readonly observer:TypedIdentifierValue;readonly at:bigint;readonly declarations:readonly SignalDeclaration[];readonly samples:readonly CanonicalValue[]}
export interface SignalSelectedView<Opportunity extends bigint|null=bigint> {readonly kind:'SignalSelectedView';readonly opportunityType?:Opportunity}
type Stored={opportunityId:bigint|null;at:bigint;observer:Uint8Array;groups:{signal:string;bytes:Uint8Array[]}[]};
const views=new WeakMap<SignalSelectedView<bigint|null>,Stored>();
const key=(v:CanonicalValue)=>bytesToHex(canonicalEncode(v));
const field=(r:R,n:number)=>r.fields.get(BigInt(n))!;
const dense=(v:unknown,max:number):v is unknown[]=>Array.isArray(v)&&v.length<=max&&Array.from({length:v.length},(_,i)=>Object.hasOwn(v,i)).every(Boolean);
function identity(v:TypedIdentifierValue,ns:bigint){if(!v||v.kind!=='typedIdentifier'||v.namespaceId!==ns||typeof v.payload==='boolean'||v.payload.kind!=='text'||!v.payload.value)throw Error('wrong signal identity');canonicalEncode(v);}
function limit(n:number,lo:number,hi:number){if(!Number.isSafeInteger(n)||n<lo||n>hi)throw Error('invalid signal limit');}
export function selectInteroceptiveSignals(input:SignalSelectionInput,limits:SignalGateLimits){
 return selectSignals(input,limits,'embodied-level-observation/0.1-candidate');
}
/** local-reserve-sample-bridge-component/0.1-candidate; distinct exact producer. */
export function selectLocalReserveSignals<Opportunity extends bigint|null>(input:SignalSelectionInput<Opportunity>,limits:SignalGateLimits){
 return selectSignals(input,limits,LOCAL_RESERVE_OBSERVATION_VERSION);
}
function selectSignals<Opportunity extends bigint|null>(input:SignalSelectionInput<Opportunity>,limits:SignalGateLimits,producerVersion:string){
 limit(limits.maxSignals,1,16);limit(limits.maxViewsPerSignal,1,16);limit(limits.maxBytesPerSignal,1,65536);limit(limits.capacity,0,limits.maxSignals);
 if(input.opportunityId===null?producerVersion!==LOCAL_RESERVE_OBSERVATION_VERSION:typeof input.opportunityId!=='bigint'||input.opportunityId<0n)throw Error('invalid sensing opportunity');simInstant(input.at);identity(input.observer,1000n);
 const maxChannels=limits.maxSignals*limits.maxViewsPerSignal;
 if(!dense(input.declarations,maxChannels)||!dense(input.samples,maxChannels))throw Error('invalid signal batch');
 const channels=new Map<string,string>(),groups=new Map<string,{channel:string;bytes:Uint8Array}[]>(),counts=new Map<string,number>();
 for(const d of input.declarations){
  if(!d||typeof d.signal!=='string'||!d.signal||d.signal!==d.signal.normalize('NFC')||new TextEncoder().encode(d.signal).length>64)throw Error('invalid signal symbol');
  identity(d.channel,1005n);const c=key(d.channel);if(channels.has(c))throw Error('duplicate signal channel');channels.set(c,d.signal);
  counts.set(d.signal,(counts.get(d.signal)??0)+1);if(counts.get(d.signal)!>limits.maxViewsPerSignal)throw Error('too many signal views');groups.set(d.signal,[]);
 }
 if(groups.size>limits.maxSignals)throw Error('too many declared signals');
 const occurrences=new Set<string>(),usedChannels=new Set<string>(),observer=key(input.observer);
 for(const sample of input.samples){
  const bytes=canonicalEncode(sample),r=decodeEmbodied(bytes);
  if(typeof r==='boolean'||r.kind!=='record'||r.schema.schemaVersion!==1n||![461n,463n].includes(r.schema.typeId))throw Error('signal sample required');
  const v=field(r,r.schema.typeId===461n?6:5),at=field(r,4);
  if(typeof v==='boolean'||v.kind!=='text'||v.value!==producerVersion)throw Error('wrong signal producer');
  if(key(field(r,2))!==observer||typeof at==='boolean'||at.kind!=='signed'||at.value!==input.at)throw Error('foreign signal observer/time');
  const c=key(field(r,3)),o=key(field(r,1)),signal=channels.get(c);
  if(signal===undefined||usedChannels.has(c)||occurrences.has(o))throw Error('unknown or duplicate signal source');usedChannels.add(c);occurrences.add(o);
  if(r.schema.typeId===461n){if(input.opportunityId===null)throw Error('present sample requires experience');groups.get(signal)!.push({channel:c,bytes});}
 }
 const retained:Stored['groups']=[],audit:{signal:string;views:number;disposition:'Selected'|'Capacity'|'Unavailable'}[]=[];
 const ordered=[...groups].sort(([a],[b])=>key(text(a))<key(text(b))?-1:key(text(a))>key(text(b))?1:0);
 for(const [signal,values] of ordered){
  if(values.reduce((n,v)=>n+v.bytes.length,0)>limits.maxBytesPerSignal)throw Error('signal retained byte budget exceeded');
  values.sort((a,b)=>a.channel<b.channel?-1:a.channel>b.channel?1:0);
  const disposition=!values.length?'Unavailable':retained.length<limits.capacity?'Selected':'Capacity';
  if(disposition==='Selected')retained.push({signal,bytes:values.map(v=>v.bytes)});
  audit.push(Object.freeze({signal,views:values.length,disposition}));
 }
 const view:SignalSelectedView<Opportunity>=Object.freeze({kind:'SignalSelectedView'});
 views.set(view,{opportunityId:input.opportunityId,at:input.at,observer:canonicalEncode(input.observer),groups:retained});
 return Object.freeze({view,audit:Object.freeze(audit)});
}
export function consumeInteroceptiveSignals<Opportunity extends bigint|null>(view:SignalSelectedView<Opportunity>){
 const value=views.get(view);if(!value)throw Error('invalid or consumed signal view');views.delete(view);
 return {opportunityId:value.opportunityId as Opportunity,at:value.at,observer:decodeEmbodied(value.observer),groups:value.groups.map(g=>({signal:g.signal,samples:g.bytes.map(b=>decodeEmbodied(b))}))};
}
export function closeInteroceptiveSignals(view:SignalSelectedView<bigint|null>){views.delete(view);}
