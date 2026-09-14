/** recency-retention-component/0.1-candidate. No importance or public source authentication. */
import {canonicalEncode,list,unsigned,text} from '../substrate/canonicalEncoding';
import {fragmentRetainedUnits,type RetainedAcquisition,type RetentionKind,type ChildLoss} from './retentionFragmentation';
export interface TimedAcquisition extends RetainedAcquisition {readonly acquiredAt:bigint}
const compare=(a:Uint8Array,b:Uint8Array)=>{for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;};
const address=(id:bigint,key:string)=>canonicalEncode(list([unsigned(id),text(key)]));
export function retainByRecency(input:readonly TimedAcquisition[],now:bigint,capacity:Readonly<Record<RetentionKind,number>>){
 if(typeof now!=='bigint'||now<0n)throw new RangeError('recency retention: instant');
 const detached=fragmentRetainedUnits(input,[],{EventContinuant:1024,Interoceptive:1024});
 const times=new Map<bigint,bigint>();
 for(const a of input){if(typeof a.acquiredAt!=='bigint'||a.acquiredAt<0n||a.acquiredAt>now)throw new RangeError('recency retention: acquisition time');times.set(a.id,a.acquiredAt);}
 for(const kind of ['EventContinuant','Interoceptive'] as const)if(!Number.isSafeInteger(capacity[kind])||capacity[kind]<0||capacity[kind]>1024)throw new RangeError('recency retention: capacity');
 const losses:ChildLoss[]=[];
 for(const kind of ['EventContinuant','Interoceptive'] as const){
  const units=detached.acquisitions.filter(a=>a.kind===kind).flatMap(a=>a.units.map(u=>({acquisition:a.id,unit:u.key,at:times.get(a.id)!,address:address(a.id,u.key)})));
  units.sort((a,b)=>a.at!==b.at?(a.at>b.at?-1:1):compare(a.address,b.address));
  losses.push(...units.slice(capacity[kind]).map(u=>({acquisition:u.acquisition,unit:u.unit})));
 }
 losses.sort((a,b)=>compare(address(a.acquisition,a.unit),address(b.acquisition,b.unit)));
 const result=fragmentRetainedUnits(detached.acquisitions,losses,capacity);
 const acquisitions:TimedAcquisition[]=result.acquisitions.map(a=>({...a,acquiredAt:times.get(a.id)!,units:[...a.units].sort((x,y)=>compare(canonicalEncode(text(x.key)),canonicalEncode(text(y.key))))}));
 acquisitions.sort((a,b)=>compare(canonicalEncode(unsigned(a.id)),canonicalEncode(unsigned(b.id))));
 return {acquisitions,usage:result.usage,losses};
}
