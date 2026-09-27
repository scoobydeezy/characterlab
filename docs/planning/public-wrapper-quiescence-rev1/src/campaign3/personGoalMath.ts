import {list,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue,readQ} from '../campaign2/cognitiveMath';
import {personGoalRecord as r} from './personGoalCodecs';
import {HOLDERS,TARGET,INCIDENT,CATALOGUE} from './personGoalModel';
import {compareAffectFactors} from './affectFactorComparison';
const opt=(v:Q|undefined)=>list(v?[qValue(v)]:[]);
export const emptyKnowledge=()=>r(1184,[list([])]);
export const destinations=(route:number)=>items(f(rec(CATALOGUE.find(x=>uint(f(x,1n))===BigInt(route))!,1194n),2n),'list').map(x=>Number(uint(x)));
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,law:number){
 const o=rec(observation,1183n);if(key(f(o,2n))!==key(HOLDERS[i])||key(f(o,4n))!==key(TARGET)||key(f(o,5n))!==key(INCIDENT))throw Error('PERSON_GOAL_FOREIGN_EVIDENCE');
 if(law===3||![6n,7n].some(k=>items(f(o,k),'list').length))return prior;
 return r(1184,[list([...items(f(rec(prior,1184n),1n),'list'),o])]);
}
export function infer(knowledge:CanonicalValue,law:number,goal?:CanonicalValue){
 if(law===4)return {odds:undefined,weight:goal?(uint(f(rec(goal,1191n),4n))===1n?ONE:ZERO):undefined};
 let route:number|undefined,destination:number|undefined;
 for(const o of items(f(rec(knowledge,1184n),1n),'list')){const a=items(f(rec(o,1183n),6n),'list'),b=items(f(rec(o,1183n),7n),'list');if(a.length)route=Number(uint(a[0]));if(b.length)destination=Number(uint(b[0]));}
 if(law===2)route=undefined;
 if(route===undefined&&destination===undefined)return {odds:undefined,weight:undefined};
 const factor=(xs:number[])=>xs.length===2?ONE:Q.of(xs[0]===1?3n:1n,xs[0]===1?1n:3n);
 let odds=route===undefined?ONE:factor(destinations(route));if(destination!==undefined)odds=odds.multiply(factor([destination]));
 return {odds,weight:odds.divide(ONE.add(odds))};
}
export function judgment(id:CanonicalValue,at:bigint,i:number,knowledge:CanonicalValue,law:number,goal?:CanonicalValue){const x=infer(knowledge,law,goal);return r(1186,[id,signed(at),HOLDERS[i],knowledge,opt(x.odds),opt(x.weight)]);}
export function appraise(id:CanonicalValue,j:CanonicalValue,goal:number){const xs=items(f(rec(j,1186n),6n),'list'),p=xs.length?readQ(xs[0]):undefined,a=p?(goal===1?ONE.subtract(p):p):undefined,x=compareAffectFactors({likelihood:a,severity:ONE,vulnerability:ONE,control:ZERO},'SplitExposure');return r(1187,[id,j,u(goal),opt(a),list(x.status==='Known'?x.coordinates.map(qValue):[])]);}
export function plan(id:CanonicalValue,at:bigint,goal:CanonicalValue|undefined,observation:CanonicalValue){const mode=Number(uint(f(rec(observation,1180n),3n))),desired=goal?Number(uint(f(rec(goal,1191n),4n))):0,route=!desired||mode===0?0:mode===1?1:desired+(mode===2?1:3);return r(1181,[id,signed(at),list(goal?[goal]:[]),u(route)]);}
