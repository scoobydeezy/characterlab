/** canonical-child-key-adapter/0.1-candidate; trusted admitted identities only. */
import {canonicalEncode,bytesToHex,cloneCanonicalValue,type CanonicalValue} from '../substrate/canonicalEncoding';
import {retainSignificanceFirst} from './significanceFirstRetention';
import type {SignificantAcquisition} from './directionalSignificanceState';
import type {RetentionKind} from './retentionFragmentation';
const fail=():never=>{throw Error('CANONICAL_CHILD_KEY_DOMAIN');};
function index(values:readonly CanonicalValue[]){
 if(values.length>256)fail();const originals=new Map<string,CanonicalValue>();
 for(const value of values){const bytes=canonicalEncode(value);if(bytes.length>4096)fail();originals.set(bytesToHex(bytes),cloneCanonicalValue(value));}
 const ordered=[...originals.keys()].sort(),labels=new Map(ordered.map((k,i)=>[k,'k'+String(i).padStart(3,'0')])),inverse=new Map(ordered.map(k=>[labels.get(k)!,originals.get(k)!]));
 return {label(value:CanonicalValue){return labels.get(bytesToHex(canonicalEncode(value)))??fail();},original(label:string){const value=inverse.get(label);if(value===undefined)fail();return cloneCanonicalValue(value!);}};
}
/** Internal transaction adapter only; labels are not public identities or authentication. */
export const canonicalOperationKeyIndex=index;
type Unit=SignificantAcquisition['units'][number];
export type CanonicalSignificantAcquisition=Omit<SignificantAcquisition,'units'>&{readonly units:readonly (Omit<Unit,'key'>&{readonly key:CanonicalValue})[]};
export function retainCanonicalSignificantChildren(input:readonly CanonicalSignificantAcquisition[],now:bigint,capacity:Readonly<Record<RetentionKind,number>>){
 const keys=index(input.flatMap(a=>a.units.map(u=>u.key)));
 const result=retainSignificanceFirst(input.map(a=>({...a,units:a.units.map(u=>({...u,key:keys.label(u.key)}))})),now,capacity);
 return {acquisitions:result.acquisitions.map(a=>({...a,units:a.units.map(u=>({...u,key:keys.original(u.key)}))})),usage:result.usage,losses:result.losses.map(l=>({acquisition:l.acquisition,unit:keys.original(l.unit)}))};
}
