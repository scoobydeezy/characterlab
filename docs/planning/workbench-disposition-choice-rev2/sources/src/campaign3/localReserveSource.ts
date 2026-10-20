/** local-reserve-source-component/0.1-candidate. Synthetic source; no public state/admission. */
import {ExactRational as Q} from '../substrate/exactMath';
import {list,text,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {materializeReserve,reserveBin,replenishReserve,atom} from './embodiedMath';
import {simInstant} from '../substrate/time';
export interface LocalReserveDefinition {readonly key:string;readonly capacity:Q;readonly rate:Q;readonly amount:Q;readonly anchoredAt:bigint}
export interface LocalReserveChannel {readonly channel:string;readonly physical:string;readonly signal:string;readonly width:Q;readonly available:boolean;readonly permitted:boolean}
export interface LocalReserveSource {readonly kind:'LocalReserveSource'}
type Facts={reserves:Map<string,LocalReserveDefinition>;channels:LocalReserveChannel[]};
const sources=new WeakMap<LocalReserveSource,Facts>();
const copy=(q:Q):Q=>{if(!(q instanceof Q)||q.denominator<=0n)throw Error('invalid source rational');return Object.freeze(Q.of(q.numerator,q.denominator));};
function symbol(s:string,prefix:string){if(typeof s!=='string'||!s.startsWith(prefix)||s.length===prefix.length||s!==s.normalize('NFC')||new TextEncoder().encode(s).length>96)throw Error('invalid source symbol');}
function dense(a:unknown,min:number,max:number):a is unknown[]{return Array.isArray(a)&&a.length>=min&&a.length<=max&&Array.from({length:a.length},(_,i)=>Object.hasOwn(a,i)).every(Boolean);}
const facts=(source:LocalReserveSource)=>{const f=sources.get(source);if(!f)throw Error('invalid local source');return f;};
function issue(f:Facts):LocalReserveSource{const source:LocalReserveSource=Object.freeze({kind:'LocalReserveSource'});sources.set(source,f);return source;}
export function createLocalReserveSource(definitions:readonly LocalReserveDefinition[],channels:readonly LocalReserveChannel[]):LocalReserveSource{
 if(!dense(definitions,3,3)||!dense(channels,1,9))throw Error('invalid three-reserve inventory');
 const reserves=new Map<string,LocalReserveDefinition>();
 for(const d of definitions){if(!d)throw Error('missing reserve');symbol(d.key,'local-reserve/');if(reserves.has(d.key))throw Error('duplicate reserve');simInstant(d.anchoredAt);
  const detached=Object.freeze({...d,capacity:copy(d.capacity),rate:copy(d.rate),amount:copy(d.amount)});
  materializeReserve(detached.amount,detached.anchoredAt,detached.capacity,detached.rate,detached.anchoredAt);reserves.set(d.key,detached);
 }
 const used=new Set<string>(),byPhysical=new Map<string,string>(),bySignal=new Map<string,string>(),counts=new Map<string,number>();
 const declarations=channels.map(c=>{
  if(!c)throw Error('missing channel');symbol(c.channel,'channel/');symbol(c.physical,'local-reserve/');symbol(c.signal,'interoceptive-signal/');
  const d=reserves.get(c.physical);if(!d||used.has(c.channel))throw Error('unknown or duplicate source channel');used.add(c.channel);
  if(typeof c.available!=='boolean'||typeof c.permitted!=='boolean')throw Error('invalid source permission');
  if(byPhysical.has(c.physical)&&byPhysical.get(c.physical)!==c.signal||bySignal.has(c.signal)&&bySignal.get(c.signal)!==c.physical)throw Error('fixture mapping must be bijective');
  byPhysical.set(c.physical,c.signal);bySignal.set(c.signal,c.physical);counts.set(c.signal,(counts.get(c.signal)??0)+1);if(counts.get(c.signal)!>3)throw Error('too many views');
  const width=copy(c.width);reserveBin(d.amount,d.capacity,width);return Object.freeze({...c,width});
 });
 if(bySignal.size!==3)throw Error('three real mapped reserves required');
 return issue({reserves,channels:declarations});
}
export function observeLocalReserves(source:LocalReserveSource,at:bigint){
 return observeLocalReserveChannels(source,at,facts(source).channels.map(c=>c.channel));
}
/** Explicitly requested channels only; unqueried channels emit no absence. */
export function observeLocalReserveChannels(source:LocalReserveSource,at:bigint,requested:readonly string[]){
 simInstant(at);const f=facts(source);
 if(!dense(requested,1,9)||new Set(requested).size!==requested.length||requested.some(k=>!f.channels.some(c=>c.channel===k)))throw Error('invalid requested reserve channels');
 return f.channels.filter(c=>requested.includes(c.channel)).sort((a,b)=>a.channel<b.channel?-1:a.channel>b.channel?1:0).map(c=>{
  if(!c.available||!c.permitted)return Object.freeze({kind:'Unavailable' as const,signal:c.signal,channel:c.channel});
  const d=f.reserves.get(c.physical)!,level=materializeReserve(d.amount,d.anchoredAt,d.capacity,d.rate,at),bin=reserveBin(level,d.capacity,c.width);
  return Object.freeze({kind:'Present' as const,signal:c.signal,channel:c.channel,lower:copy(bin.lower),upper:copy(bin.upper)});
 });
}
export function replenishLocalReserve(source:LocalReserveSource,target:string,at:bigint,delivery:Q):LocalReserveSource{
 return replenishLocalReserveWithResult(source,target,at,delivery).source;
}
/** local-reserve-replenishment-production/0.1-candidate; result is truth-side only. */
export function replenishLocalReserveWithResult(source:LocalReserveSource,target:string,at:bigint,delivery:Q){
 const f=facts(source),d=f.reserves.get(target);if(!d)throw Error('unknown local reserve');
 const changed=replenishLocalReserveDefinition(d,at,delivery),reserves=new Map(f.reserves);reserves.set(target,changed.definition);
 return {source:issue({reserves,channels:f.channels}),result:changed.result};
}
/** Same producer for an exact state-backed target; it requires no unrelated anchors. */
export function replenishLocalReserveDefinition(d:LocalReserveDefinition,at:bigint,delivery:Q){
 symbol(d.key,'local-reserve/');const before=materializeReserve(d.amount,d.anchoredAt,d.capacity,d.rate,at),result=replenishReserve(before,d.capacity,copy(delivery));
 return {definition:Object.freeze({...d,amount:copy(result.after),anchoredAt:at}),result:{target:d.key,at,
  prior:{amount:copy(d.amount),anchoredAt:d.anchoredAt},next:{amount:copy(result.after),anchoredAt:at},
  numeric:{before:copy(result.before),potential:copy(result.potential),applied:copy(result.applied),overflow:copy(result.overflow),after:copy(result.after)}}};
}
/** Detached truth-side component inspection; never returned with safe observations. */
export function inspectLocalReserves(source:LocalReserveSource):ReadonlyMap<string,CanonicalValue>{
 return new Map([...facts(source).reserves].map(([k,d])=>[k,list([text(k),atom(d.capacity),atom(d.rate),atom(d.amount),signed(d.anchoredAt)])]));
}
