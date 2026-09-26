/** World-only challenge under absence-deficit-component/0.1-candidate. */
import {ExactRational as Q} from '../substrate/exactMath';
import {canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {decodeCampaign2} from '../campaign2/codecs';
export const VERSION='absence-deficit-component/0.1-candidate';
export const LAWS=['LinearGap','ThresholdGap','FixedReference'] as const;
export type AbsenceLaw=typeof LAWS[number];
export function absenceResponse(law:AbsenceLaw,displacement:bigint,baseline:Q,support:Q){
 if(!LAWS.includes(law)||displacement<0n||displacement>10n||baseline.compare(Q.of(40n))<0||baseline.compare(Q.of(60n))>0||support.compare(Q.of(0n))<0||support.compare(Q.of(10n))>0)throw Error('absence challenge domain');
 const reference=Q.of(50n+(law==='FixedReference'?0n:displacement)),level=baseline.add(support),raw=reference.subtract(level),gap=raw.compare(Q.of(0n))>0?raw:Q.of(0n);
 const residual=gap.subtract(Q.of(law==='ThresholdGap'?2n:0n));
 return {displacement,reference,level,gap,response:residual.compare(Q.of(0n))>0?residual.divide(Q.of(10n)):Q.of(0n)};
}
export function challengeAbsence(stateBytes:Uint8Array,target:CanonicalValue,law:AbsenceLaw,baseline:Q,support:Q){
 const wanted=canonicalEncode(target);
 const entry=restoreAuthoritativeState(decodeCampaign2(stateBytes)).entries().find(e=>{
  if(e.path.rootStateTypeId!==302n||e.path.fieldId!==3n||e.path.selectors.length!==1)return false;
  const k=e.path.selectors[0];if(k.kind!=='mapKey')return false;const bytes=canonicalEncode(k.key);return bytes.length===wanted.length&&bytes.every((v,i)=>v===wanted[i]);
 });
 let d=0n;
 if(entry){const v=entry.value;if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==299n)throw Error('invalid displacement value');const n=v.fields.get(1n);if(!n||typeof n==='boolean'||n.kind!=='signed')throw Error('invalid displacement magnitude');d=n.value;}
 return absenceResponse(law,d,baseline,support);
}
