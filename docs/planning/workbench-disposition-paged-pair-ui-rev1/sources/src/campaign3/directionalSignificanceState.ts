/** directional-significance-state-component/0.1-candidate; supplied-qualified credits only. */
import {applyQualifiedUnitUse,type UseProtectedAcquisition} from './useProtectedRetention';
import {fragmentRetainedUnits,type ChildLoss,type RetentionKind} from './retentionFragmentation';
import {normalizeAttributedChildren} from './attributedChildBoundary';
export type SignificanceDirection='MovingCloser'|'MovingFarther';
type Unit=UseProtectedAcquisition['units'][number]&{readonly outcomeSignificanceDirections:readonly SignificanceDirection[]};
export interface SignificantAcquisition extends Omit<UseProtectedAcquisition,'units'>{readonly units:readonly Unit[]}
const directions=['MovingCloser','MovingFarther'] as const;
function tags(xs:readonly SignificanceDirection[]){if(!Array.isArray(xs)||xs.length>2||Array.from({length:xs.length},(_,i)=>Object.hasOwn(xs,i)).some(x=>!x)||xs.some(x=>!directions.includes(x))||new Set(xs).size!==xs.length)throw Error('SIGNIFICANCE_STATE_TAGS');return Object.freeze(directions.filter(d=>xs.includes(d)));}
export function copySignificantMemory(input:readonly SignificantAcquisition[],now:bigint){
 const plain=applyQualifiedUnitUse(input,[],now),metadata=new Map(input.map(a=>[a.id,a]));
 return plain.map(a=>({...a,units:a.units.map(u=>({...u,outcomeSignificanceDirections:tags(metadata.get(a.id)!.units.find(x=>x.key===u.key)!.outcomeSignificanceDirections)}))}));
}
/** Preserve the independent direction set when applying qualified downstream use. */
export function applyQualifiedSignificantUse(input:readonly SignificantAcquisition[],targets:readonly ChildLoss[],now:bigint){
 const memory=copySignificantMemory(input,now),used=applyQualifiedUnitUse(memory,targets,now);
 return memory.map(a=>({...a,units:a.units.map(u=>({...u,useProtection:used.find(x=>x.id===a.id)!.units.find(x=>x.key===u.key)!.useProtection}))}));
}
export function applyQualifiedSignificance(owner:{readonly observer:string;readonly character:string;readonly memory:readonly SignificantAcquisition[]},credits:readonly {readonly observer:string;readonly character:string;readonly direction:SignificanceDirection;readonly targets:readonly ChildLoss[]}[],now:bigint){
 const memory=copySignificantMemory(owner.memory,now);
 if(!Array.isArray(credits)||credits.length>64||Array.from({length:credits.length},(_,i)=>Object.hasOwn(credits,i)).some(x=>!x))throw Error('SIGNIFICANCE_CREDIT_BOUND');
 for(const credit of credits){if(!directions.includes(credit.direction))throw Error('SIGNIFICANCE_CREDIT_DIRECTION');
  const targets=normalizeAttributedChildren({...owner,memory},{...credit,disposition:'Supported'});
  for(const t of targets){const u=memory.find(a=>a.id===t.acquisition)!.units.find(u=>u.key===t.unit)!;u.outcomeSignificanceDirections=Object.freeze(directions.filter(d=>d===credit.direction||u.outcomeSignificanceDirections.includes(d)));}
 }
 return memory;
}
export function fragmentSignificantChildren(input:readonly SignificantAcquisition[],losses:readonly ChildLoss[],capacity:Readonly<Record<RetentionKind,number>>,now:bigint){
 const memory=copySignificantMemory(input,now),result=fragmentRetainedUnits(memory,losses,capacity),meta=new Map(memory.map(a=>[a.id,a]));
 return {usage:result.usage,acquisitions:result.acquisitions.map(a=>({...a,acquiredAt:meta.get(a.id)!.acquiredAt,units:a.units.map(u=>{const m=meta.get(a.id)!.units.find(x=>x.key===u.key)!;return {...u,useProtection:m.useProtection,outcomeSignificanceDirections:tags(m.outcomeSignificanceDirections)};})}))};
}
export function sharedSignificanceBitControl(input:readonly SignificanceDirection[]){return tags(input).length>0;}
