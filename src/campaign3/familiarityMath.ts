import {list,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {qValue} from '../campaign2/cognitiveMath';
import {familiarityRecord as r} from './familiarityCodecs';
export const emptyMemory=()=>r(1059,[list([])]);
export function recognize(observation:CanonicalValue,memory:CanonicalValue,law:number,at:bigint,id:CanonicalValue,oracleMatches:readonly boolean[]=[]){
 const obs=rec(observation,1057n),category=uint(f(obs,4n)),prior=items(f(rec(memory,1059n),1n),'list').map(v=>rec(v,1058n)).filter(v=>uint(f(v,3n))===category);
 const comparisons=prior.map(v=>{let equal=0,unequal=0;for(const position of [4n,5n]){const a=items(f(v,position),'list'),b=items(f(obs,position+1n),'list');if(law===4||a.length&&b.length){if((a[0]??false)===(b[0]??false))equal++;else unequal++;}}const compared=equal+unequal,similarity=compared?Q.of(BigInt(equal),BigInt(compared)):undefined;return {v,equal,unequal,compared,similarity,output:r(1061,[f(v,1n),u(equal),u(unequal),u(compared),list(similarity?[qValue(similarity)]:[]),f(v,6n)])};});
 let status=category===0n?0:prior.length?2:1,maximum:Q|undefined,best:CanonicalValue[]=[];
 const eligible=comparisons.filter(c=>c.similarity!==undefined&&(law!==3||items(f(c.v,6n),'list').length));
 if(category>0n&&law===5&&prior.length){const any=oracleMatches.some(Boolean);maximum=Q.of(any?1n:0n);status=any?4:3;best=prior.filter((_,i)=>Boolean(oracleMatches[i])===any).map(v=>f(v,1n));}
 else if(eligible.length){maximum=eligible.reduce((q,c)=>c.similarity!.compare(q)>0?c.similarity!:q,eligible[0].similarity!);const winners=eligible.filter(c=>c.similarity!.compare(maximum!)===0);best=winners.map(c=>f(c.v,1n));const familiar=law===2?eligible.some(c=>c.equal===2):maximum.compare(Q.of(0n))>0;status=familiar?(winners.some(c=>c.unequal>0)?5:4):3;}
 return r(1062,[id,signed(at),f(obs,1n),u(status),list(maximum?[qValue(maximum)]:[]),list(best),list(comparisons.map(c=>c.output))]);
}
export function consolidate(memory:CanonicalValue,observation:CanonicalValue,at:bigint){
 const obs=rec(observation,1057n),xs=items(f(rec(memory,1059n),1n),'list').map(x=>{const v=rec(x,1058n),time=f(v,2n);if(typeof time==='boolean'||time.kind!=='signed')throw Error('FAMILIARITY_TIME');return r(1058,[f(v,1n),time,f(v,3n),f(v,4n),f(v,5n),at-time.value>=3n?list([]):f(v,6n)]);});
 if(uint(f(obs,4n))>0n)xs.push(r(1058,[f(obs,1n),f(obs,3n),f(obs,4n),f(obs,5n),f(obs,6n),f(obs,7n)]));return r(1059,[list(xs)]);
}
