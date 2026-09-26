/** World-only diagnostic component: tolerance-effect-component/0.1-candidate. */
import {ExactRational as Q} from '../substrate/exactMath';
import {type CanonicalValue,canonicalEncode} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {decodeCampaign2} from '../campaign2/codecs';
import {replenishReserve} from './embodiedMath';
export const VERSION='tolerance-effect-component/0.1-candidate';
export const LAWS=['Reciprocal','Linear','Unattenuated'] as const;
export type ToleranceLaw=typeof LAWS[number];
export function tolerancePotential(law:ToleranceLaw,t:bigint,dose:Q):Q {
 if(!LAWS.includes(law)||t<0n||t>10n||dose.compare(Q.of(0n))<0||dose.compare(Q.of(10n))>0)throw new Error('invalid tolerance challenge');
 if(law==='Reciprocal')return dose.divide(Q.of(1n+t));
 if(law==='Linear')return dose.multiply(Q.of(10n-t,10n));
 return dose;
}
export function challengeTolerance(stateBytes:Uint8Array,target:CanonicalValue,law:ToleranceLaw,dose:Q,before:Q){
 const key=canonicalEncode(target);
 const entry=restoreAuthoritativeState(decodeCampaign2(stateBytes)).entries().find(e=>{
  if(e.path.rootStateTypeId!==302n||e.path.fieldId!==1n||e.path.selectors.length!==1)return false;
  const selector=e.path.selectors[0];if(selector.kind!=='mapKey')return false;
  const bytes=canonicalEncode(selector.key);return bytes.length===key.length&&bytes.every((v,i)=>v===key[i]);
 });
 let tolerance=0n;
 if(entry){const v=entry.value;if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==297n)throw new Error('invalid tolerance value');const n=v.fields.get(1n);if(!n||typeof n==='boolean'||n.kind!=='unsigned')throw new Error('invalid tolerance magnitude');tolerance=n.value;}
 return {tolerance,...replenishReserve(before,Q.of(10n),tolerancePotential(law,tolerance,dose))};
}
