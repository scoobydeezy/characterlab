/** Pure observer-side math. No truth, goals or source metadata can enter learning. */
import {unsigned as u,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {beliefRecord as r} from './beliefCodecs';
import {validateEstimate} from './beliefModel';

export function classifyBeliefSample(sample:CanonicalValue):number{
 const s=rec(sample,737n);return f(s,5n)!==true?4:f(s,6n)!==true?3:f(s,7n)===true?1:2;
}
export function applyBeliefEvidence(prior:CanonicalValue|undefined,evidence:CanonicalValue,law:number){
 if(![1,2,3].includes(law))throw Error('BELIEF_LAW');
 if(prior)validateEstimate(prior);
 const e=rec(evidence,741n),sample=rec(f(e,2n),737n),classification=classifyBeliefSample(sample);
 if(uint(f(e,3n))!==BigInt(classification))throw Error('BELIEF_CLASSIFICATION');
 if(classification>2||law===3)return {next:prior,applied:false};
 const old=prior?rec(prior,739n):undefined,support=old?items(f(old,3n),'set'):[],id=f(sample,1n);
 if(support.some(v=>key(v)===key(id)))throw Error('BELIEF_DUPLICATE_EVIDENCE');
 if(support.length>=32)throw Error('BELIEF_SUPPORT_LIMIT');
 const x=Q.of(classification===1?1n:0n),n=BigInt(support.length),mean=old&&law===1?readQ(f(old,1n)).multiply(Q.of(n)).add(x).divide(Q.of(n+1n)):x;
 return {next:r(739,[qValue(mean),u(n+1n),set([...support,id])]),applied:true};
}
export function beliefAppraisal(prior:CanonicalValue|undefined,goal:CanonicalValue){
 if(!prior)return undefined;validateEstimate(prior);const p=rec(prior,739n),n=uint(f(p,2n));
 return {expected:qValue(readQ(f(p,1n)).multiply(readQ(goal))),confidence:qValue(Q.of(n,n+1n))};
}
