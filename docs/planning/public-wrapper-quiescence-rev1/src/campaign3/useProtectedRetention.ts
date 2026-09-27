/** use-protected-retention-component/0.1-candidate. Qualified-use authentication/order are upstream. */
import {fragmentRetainedUnits,type RetainedChild,type ChildLoss,type RetentionKind} from './retentionFragmentation';
import type {TimedAcquisition} from './recencyRetention';
import {canonicalEncode,list,unsigned,text} from '../substrate/canonicalEncoding';
export interface UseProtectedAcquisition extends Omit<TimedAcquisition,'units'>{readonly units:readonly (RetainedChild&Readonly<{useProtection:boolean}>)[]}
const compare=(a:Uint8Array,b:Uint8Array)=>{for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;};
const address=(id:bigint,key:string)=>canonicalEncode(list([unsigned(id),text(key)]));
function detached(input:readonly UseProtectedAcquisition[],now:bigint){
 if(typeof now!=='bigint'||now<0n)throw Error('USE_PROTECTION_TIME');
 const clean=fragmentRetainedUnits(input,[],{EventContinuant:1024,Interoceptive:1024});
 const meta=new Map(input.map(a=>[a.id,a]));
 for(const a of input){if(typeof a.acquiredAt!=='bigint'||a.acquiredAt<0n||a.acquiredAt>now)throw Error('USE_PROTECTION_TIME');for(const u of a.units)if(typeof u.useProtection!=='boolean')throw Error('USE_PROTECTION_BIT');}
 return clean.acquisitions.map(a=>({...a,acquiredAt:meta.get(a.id)!.acquiredAt,units:a.units.map(u=>({...u,useProtection:meta.get(a.id)!.units.find(v=>v.key===u.key)!.useProtection}))}));
}
export function applyQualifiedUnitUse(input:readonly UseProtectedAcquisition[],qualifiedUnits:readonly ChildLoss[],now:bigint){
 const copy=detached(input,now);
 // Validate exact extant unique addresses through the accepted loss-address grammar;
 // its discarded return is not a cognitive loss operation or persistent mutation.
 fragmentRetainedUnits(copy,qualifiedUnits,{EventContinuant:1024,Interoceptive:1024});
 for(const use of qualifiedUnits)copy.find(a=>a.id===use.acquisition)!.units.find(u=>u.key===use.unit)!.useProtection=true;
 return copy;
}
export function retainWithUseProtection(input:readonly UseProtectedAcquisition[],now:bigint,capacity:Readonly<Record<RetentionKind,number>>){
 const copy=detached(input,now),losses:ChildLoss[]=[];
 for(const kind of ['EventContinuant','Interoceptive'] as const){
  if(!Number.isInteger(capacity[kind])||capacity[kind]<0||capacity[kind]>1024)throw Error('USE_PROTECTION_CAPACITY');
  const units=copy.filter(a=>a.kind===kind).flatMap(a=>a.units.map(u=>({acquisition:a.id,unit:u.key,at:a.acquiredAt,protected:u.useProtection,address:address(a.id,u.key)})));
  units.sort((a,b)=>a.protected!==b.protected?(a.protected?-1:1):a.at!==b.at?(a.at>b.at?-1:1):compare(a.address,b.address));
  losses.push(...units.slice(capacity[kind]).map(u=>({acquisition:u.acquisition,unit:u.unit})));
 }
 losses.sort((a,b)=>compare(address(a.acquisition,a.unit),address(b.acquisition,b.unit)));
 const result=fragmentRetainedUnits(copy,losses,capacity),meta=new Map(copy.map(a=>[a.id,a]));
 const acquisitions=result.acquisitions.map(a=>({...a,acquiredAt:meta.get(a.id)!.acquiredAt,units:a.units.map(u=>({...u,useProtection:meta.get(a.id)!.units.find(v=>v.key===u.key)!.useProtection})).sort((a,b)=>compare(canonicalEncode(text(a.key)),canonicalEncode(text(b.key))))}));
 acquisitions.sort((a,b)=>compare(canonicalEncode(unsigned(a.id)),canonicalEncode(unsigned(b.id))));
 return {acquisitions,usage:result.usage,losses};
}
