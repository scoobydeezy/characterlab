/** affect-factor-comparison/0.1-candidate; arithmetic research only, no evidence authority. */
import {ExactRational as Q} from '../substrate/exactMath';
export const AFFECT_FACTOR_VERSION='affect-factor-comparison/0.1-candidate';
export const AFFECT_CANDIDATES=['HistoricalProduct','SplitExposure','ScalarUncontrolled'] as const;
export type AffectCandidate=typeof AFFECT_CANDIDATES[number];
export type AffectFactors=Readonly<Record<'likelihood'|'severity'|'vulnerability'|'control',Q|undefined>>;
export type AffectProjection={readonly status:'Unavailable'}|{readonly status:'Known';readonly coordinates:readonly Q[]};
const keys=['likelihood','severity','vulnerability','control'] as const;
export function compareAffectFactors(input:AffectFactors,candidate:AffectCandidate):AffectProjection{
 if(!AFFECT_CANDIDATES.includes(candidate))throw Error('AFFECT_CANDIDATE');
 if(!input||Object.getPrototypeOf(input)!==Object.prototype)throw Error('AFFECT_INPUT');
 const descriptors=Object.getOwnPropertyDescriptors(input);
 if(Reflect.ownKeys(descriptors).length!==4||keys.some(k=>!descriptors[k]||!('value'in descriptors[k])))throw Error('AFFECT_FIELDS');
 const values=keys.map(k=>descriptors[k].value as Q|undefined);
 for(const value of values)if(value!==undefined&&(!(value instanceof Q)||value.compare(Q.of(0n))<0||value.compare(Q.of(1n))>0))throw Error('AFFECT_FACTOR_DOMAIN');
 if(values.some(v=>v===undefined))return Object.freeze({status:'Unavailable'});
 const [p,s,v,c]=values as Q[],one=Q.of(1n),two=Q.of(2n),exposure=p.multiply(s).multiply(one.add(v)).divide(two),uncontrolled=exposure.multiply(one.subtract(c));
 const coordinates=candidate==='HistoricalProduct'?[exposure.multiply(two.subtract(c)).divide(two)]:candidate==='SplitExposure'?[exposure,uncontrolled]:[uncontrolled];
 return Object.freeze({status:'Known',coordinates:Object.freeze(coordinates)});
}
