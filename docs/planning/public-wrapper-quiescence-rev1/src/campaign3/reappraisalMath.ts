import {list,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataKey as key} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {qValue,readQ} from '../campaign2/cognitiveMath';
import {compareAffectFactors,AFFECT_CANDIDATES} from './affectFactorComparison';
import {reappraisalRecord as r} from './reappraisalCodecs';
import {OBSERVER,type ReappraisalCompiled} from './reappraisalModel';
export const emptyKnowledge=()=>r(1028,[list([]),false]);
export function contextKnowledge(value:CanonicalValue){
 const k=rec(value,1028n),observations=items(f(k,1n),'list').map(v=>rec(v,1027n));let catalogue=0n;
 for(const o of observations){if(key(f(o,2n))!==key(OBSERVER))throw Error('REAPPRAISAL_FOREIGN_EVIDENCE');if(uint(f(o,6n))>0n)catalogue=uint(f(o,6n));}
 const means=[1n,2n].map(condition=>{const samples=observations.filter(o=>uint(f(o,4n))===condition).flatMap(o=>items(f(o,5n),'list'));if(condition===1n&&f(k,2n)===true)samples.push(false);return samples.length?Q.of(BigInt(samples.filter(x=>x===true).length),BigInt(samples.length)):undefined;});
 return {means,catalogue,sources:observations.map(o=>f(o,1n))};
}
export function reappraise(model:ReappraisalCompiled,knowledge:CanonicalValue,frame:CanonicalValue|undefined,at:bigint,id:CanonicalValue){
 const k=contextKnowledge(knowledge),mode=frame?uint(f(rec(frame,1030n),1n)):0n,condition=mode===1n?2:1,likelihood=k.means[condition-1];
 if(frame){const t=f(rec(frame,1030n),3n);if(typeof t==='boolean'||t.kind!=='signed'||t.value>=at)throw Error('REAPPRAISAL_SAME_INSTANT');}
 const projection=compareAffectFactors({likelihood,severity:readQ(f(model.content,4n)),vulnerability:readQ(f(model.content,5n)),control:readQ(f(model.content,6n))},AFFECT_CANDIDATES[model.projection-1]);
 const coordinates=mode===2n?[Q.of(0n),...(model.projection===2?[Q.of(0n)]:[])]:projection.status==='Known'?projection.coordinates:[];
 return r(1032,[id,signed(at),list(k.means[0]?[qValue(k.means[0])]:[]),list(k.means[1]?[qValue(k.means[1])]:[]),u(condition),list(likelihood?[qValue(likelihood)]:[]),list(coordinates.map(qValue)),list(frame?[frame]:[]),list(k.sources)]);
}
