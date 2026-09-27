import {list,set,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {socialRecord as r} from './socialCodecs';
import {OBSERVERS,TARGETS,type SocialSettings} from './socialModel';
export function socialClassification(prior:CanonicalValue|undefined){if(!prior)return 0;const cmp=readQ(f(rec(prior,809n),1n)).compare(Q.of(1n,2n));return cmp<0?1:cmp>0?3:2;}
export function socialProbe(i:number,at:bigint,prior:CanonicalValue|undefined,occ:CanonicalValue,privateControl?:boolean){return r(811,[occ,signed(at),OBSERVERS[i],TARGETS[i],u(privateControl===undefined?socialClassification(prior):privateControl?3:1),...(prior?[prior]:[])]);}
export function socialObserve(i:number,original:CanonicalValue,truth:CanonicalValue,occ:CanonicalValue){
 const o=rec(original,804n),t=rec(truth,805n),allowed=f(o,BigInt(i+5))===true,claim=t.fields.get(5n);
 return r(807,[occ,OBSERVERS[i],TARGETS[i],f(o,1n),allowed?f(o,2n):u(1),allowed?f(o,4n):u(0),allowed,...(allowed?[f(t,4n),...(claim===undefined?[]:[claim])]:[])]);
}
export function socialEvidence(observation:CanonicalValue,occ:CanonicalValue){const o=rec(observation,807n),claim=o.fields.get(9n),accepted=f(o,7n)===true&&uint(f(o,6n))>0n&&claim!==undefined;return r(812,[occ,observation,...(accepted?[r(806,[f(o,5n),f(o,6n)]),claim!]:[])]);}
export function updateSocial(settings:SocialSettings,prior:CanonicalValue|undefined,evidence:CanonicalValue){
 const e=rec(evidence,812n),source=e.fields.get(3n),value=e.fields.get(4n);if(!source||value===undefined||settings.learningLaw===3)return {next:prior,applied:false};
 const p=prior?rec(prior,809n):undefined,support=p?items(f(p,3n),'set'):[],seen=support.some(v=>key(v)===key(source));if(seen&&settings.control!==4)return {next:prior,applied:false};
 const n=p?uint(f(p,2n)):0n;if(n>=8n)throw Error('SOCIAL_SAMPLE_LIMIT');const x=Q.of(value===true?1n:0n),mean=p&&settings.learningLaw===1?readQ(f(p,1n)).multiply(Q.of(n)).add(x).divide(Q.of(n+1n)):x;
 return {next:r(809,[qValue(mean),u(n+1n),set(seen?support:[...support,source])]),applied:true};
}
