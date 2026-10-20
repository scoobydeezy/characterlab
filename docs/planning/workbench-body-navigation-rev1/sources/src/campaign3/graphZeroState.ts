/** graph-zero-state-component/0.1-candidate. Input must be the complete resolved graph batch. */
import {ExactRational as Q} from '../substrate/exactMath';
import {associationCandidate} from './encodingAccessMath';
const zero=Object.freeze(Q.of(0n));
export function normalizeGraphZeroState(keys:readonly string[],weights:readonly (readonly Q[])[],scale:bigint){
 const validated=associationCandidate(keys,weights,keys.map(()=>zero),{scale,eta:zero,lambda:zero,elapsed:zero}).values;
 const keep=keys.map((_,i)=>i).filter(i=>validated[i].some(v=>v.numerator!==0n)||validated.some(row=>row[i].numerator!==0n));
 return Object.freeze({keys:Object.freeze(keep.map(i=>keys[i])),weights:Object.freeze(keep.map(i=>Object.freeze(keep.map(j=>Object.freeze(Q.of(validated[i][j].numerator,validated[i][j].denominator))))))});
}
