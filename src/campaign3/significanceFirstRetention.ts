/** significance-first-retention-component/0.1-candidate; prior committed metadata is an upstream obligation. */
import {copySignificantMemory,fragmentSignificantChildren,type SignificantAcquisition} from './directionalSignificanceState';
import type {ChildLoss,RetentionKind} from './retentionFragmentation';
import {canonicalEncode,list,unsigned,text} from '../substrate/canonicalEncoding';
const compare=(a:Uint8Array,b:Uint8Array)=>{for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;};
const address=(id:bigint,key:string)=>canonicalEncode(list([unsigned(id),text(key)]));
function retain(input:readonly SignificantAcquisition[],now:bigint,capacity:Readonly<Record<RetentionKind,number>>,shared:boolean){
 // No credit is applied: reuse the accepted metadata validator/detacher.
 const memory=copySignificantMemory(input,now),losses:ChildLoss[]=[];
 for(const a of memory)if(a.acquiredAt===now&&a.units.some(u=>u.useProtection||u.outcomeSignificanceDirections.length>0))throw Error('RETENTION_FRESH_PROTECTION');
 for(const kind of ['EventContinuant','Interoceptive'] as const){
  if(!Number.isInteger(capacity[kind])||capacity[kind]<0||capacity[kind]>1024)throw Error('RETENTION_CAPACITY');
  const units=memory.filter(a=>a.kind===kind).flatMap(a=>a.units.map(u=>({acquisition:a.id,unit:u.key,at:a.acquiredAt,tier:shared?(u.outcomeSignificanceDirections.length>0||u.useProtection?0:1):u.outcomeSignificanceDirections.length>0?0:u.useProtection?1:2})));
  units.sort((a,b)=>a.tier-b.tier||(a.at!==b.at?(a.at>b.at?-1:1):compare(address(a.acquisition,a.unit),address(b.acquisition,b.unit))));
  losses.push(...units.slice(capacity[kind]).map(u=>({acquisition:u.acquisition,unit:u.unit})));
 }
 losses.sort((a,b)=>compare(address(a.acquisition,a.unit),address(b.acquisition,b.unit)));
 const result=fragmentSignificantChildren(memory,losses,capacity,now);
 result.acquisitions.sort((a,b)=>compare(canonicalEncode(unsigned(a.id)),canonicalEncode(unsigned(b.id))));
 for(const a of result.acquisitions)a.units.sort((a,b)=>compare(canonicalEncode(text(a.key)),canonicalEncode(text(b.key))));
 return {...result,losses};
}
export const retainSignificanceFirst=(input:readonly SignificantAcquisition[],now:bigint,capacity:Readonly<Record<RetentionKind,number>>)=>retain(input,now,capacity,false);
export const retainSharedProtectionTier=(input:readonly SignificantAcquisition[],now:bigint,capacity:Readonly<Record<RetentionKind,number>>)=>retain(input,now,capacity,true);
