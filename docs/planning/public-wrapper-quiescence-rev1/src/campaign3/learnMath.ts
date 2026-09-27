/** learn-public/0.1-candidate: physical projection and safe learning are separate operators. */
import {set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q,roundEven} from '../substrate/exactMath';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {learnRecord as r} from './learnCodecs';
import {validateEstimate} from './learnModel';

/** Source observation only: ceiling classification does not test hidden overflow. */
export function projectLearnFrame(potential:CanonicalValue,before:CanonicalValue){
 const effect=readQ(potential),level=readQ(before),capacity=Q.of(1n).subtract(level);
 if(effect.numerator<0n||effect.numerator>effect.denominator||level.numerator<0n||level.numerator>level.denominator)throw Error('LEARN_PHYSICAL_DOMAIN');
 const applied=effect.compare(capacity)<0?effect:capacity;
 return {measurement:qValue(applied),kind:applied.compare(capacity)===0?2:1,precision:qValue(Q.of(2n))};
}
export function classifyLearnSample(sample:CanonicalValue):number{
 const s=rec(sample,887n),kind=Number(uint(f(s,6n)));
 if(![1,2].includes(kind)||readQ(f(s,7n)).compare(Q.of(2n))!==0)throw Error('LEARN_SAMPLE');
 return kind;
}
export function applyLearnEvidence(prior:CanonicalValue|undefined,evidence:CanonicalValue,law:number,numeric:number){
 if(![1,2,3].includes(law)||![1,2].includes(numeric))throw Error('LEARN_LAW');
 if(prior)validateEstimate(prior);
 const e=rec(evidence,891n),sample=rec(f(e,2n),887n),kind=classifyLearnSample(sample);
 if(uint(f(e,3n))!==BigInt(kind))throw Error('LEARN_CLASSIFICATION');
 const old=prior?rec(prior,889n):undefined,mu=old?readQ(f(old,1n)):Q.of(0n),tau=old?readQ(f(old,2n)):Q.of(0n);
 const x=readQ(f(sample,5n)),rho=readQ(f(sample,7n)),denom=tau.add(rho),candidate=tau.multiply(mu).add(rho.multiply(x)).divide(denom);
 const informative=kind===1||candidate.compare(mu)>0;
 const applied=law===2||law===3?law===2||kind===1:informative;
 const rawMean=applied?(kind===2&&candidate.compare(mu)<0?mu:candidate):mu,rawPrecision=applied?denom:tau;
 if(!applied)return {next:prior,applied,rawMean:qValue(rawMean),rawPrecision:qValue(rawPrecision)};
 const support=old?items(f(old,3n),'set'):[],id=f(sample,1n);
 if(support.length>=64||support.some(v=>key(v)===key(id)))throw Error('LEARN_SUPPORT');
 const quantize=(v:Q)=>numeric===1?v:Q.of(roundEven(v.numerator*1000000n,v.denominator),1000000n);
 return {next:r(889,[qValue(quantize(rawMean)),qValue(quantize(rawPrecision)),set([...support,id])]),applied,rawMean:qValue(rawMean),rawPrecision:qValue(rawPrecision)};
}
export function learnAppraisal(prior:CanonicalValue|undefined){
 if(!prior)return undefined;validateEstimate(prior);const p=rec(prior,889n);
 return {mean:f(p,1n),precision:f(p,2n)};
}
