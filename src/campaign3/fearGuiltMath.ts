import {list,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue,readQ} from '../campaign2/cognitiveMath';
import {fearGuiltRecord as r} from './fearGuiltCodecs';
import {HOLDERS,TARGET,INCIDENT} from './fearGuiltModel';
import {compareAffectFactors} from './affectFactorComparison';
const opt=(v:Q|undefined)=>list(v?[qValue(v)]:[]);
export const emptyKnowledge=()=>r(1171,[list([])]);
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,law:number){
 const o=rec(observation,1170n);if(key(f(o,2n))!==key(HOLDERS[i])||key(f(o,4n))!==key(TARGET)||key(f(o,5n))!==key(INCIDENT))throw Error('FEAR_GUILT_FOREIGN_EVIDENCE');
 if(law===3||![6n,7n,8n].some(k=>items(f(o,k),'list').length))return prior;
 return r(1171,[list([...items(f(rec(prior,1171n),1n),'list'),o])]);
}
export function infer(knowledge:CanonicalValue,law:number,truth?:boolean){
 if(law===4){if(truth===undefined)throw Error('FEAR_GUILT_ORACLE_TRUTH');return {odds:undefined,weight:truth?ONE:ZERO};}
 const latest:(boolean|undefined)[]=[undefined,undefined,undefined];
 for(const o of items(f(rec(knowledge,1171n),1n),'list'))for(let i=0;i<3;i++){const xs=items(f(rec(o,1170n),BigInt(6+i)),'list');if(xs.length)latest[i]=xs[0]===true;}
 const factors=law===2?[latest[0]]:latest;if(factors.every(x=>x===undefined))return {odds:undefined,weight:undefined};
 let odds=ONE;for(let i=0;i<factors.length;i++){const x=factors[i];if(x===undefined)continue;odds=odds.multiply(i===0?Q.of(x?3n:1n,x?1n:3n):i===1?Q.of(1n,x?5n:1n):Q.of(x?5n:1n,x?1n:5n));}
 return {odds,weight:odds.divide(ONE.add(odds))};
}
export function judgment(id:CanonicalValue,at:bigint,i:number,knowledge:CanonicalValue,law:number,truth?:boolean){const x=infer(knowledge,law,truth);return r(1173,[id,signed(at),HOLDERS[i],knowledge,opt(x.odds),opt(x.weight)]);}
const coordinates=(p:Q|undefined)=>{const x=compareAffectFactors({likelihood:p,severity:ONE,vulnerability:ONE,control:ZERO},'SplitExposure');return list(x.status==='Known'?x.coordinates.map(qValue):[]);};
export function fear(id:CanonicalValue,observation:CanonicalValue){const o=rec(observation,1167n),p=f(o,3n)===true||f(o,4n)===true?ONE:ZERO;return r(1168,[id,o,qValue(p),coordinates(p)]);}
export function appraise(id:CanonicalValue,j:CanonicalValue,goal:number){const xs=items(f(rec(j,1173n),6n),'list'),p=xs.length?readQ(xs[0]):undefined,a=p?(goal===1?p:ONE.subtract(p)):undefined;return r(1174,[id,j,u(goal),opt(a),coordinates(a)]);}
