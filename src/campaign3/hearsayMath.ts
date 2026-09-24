import {list,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue,readQ} from '../campaign2/cognitiveMath';
import {hearsayRecord as r} from './hearsayCodecs';
import {HOLDERS,TARGET,INCIDENT} from './hearsayModel';
import {compareAffectFactors} from './affectFactorComparison';
const opt=(v:Q|undefined)=>list(v?[qValue(v)]:[]);
export const emptyKnowledge=()=>r(1200,[list([])]);
export function speakerBelief(knowledge:CanonicalValue){const xs=items(f(rec(knowledge,1200n),1n),'list');return xs.length?f(rec(xs.at(-1)!,1197n),4n):list([]);}
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,law:number){
 const o=rec(observation,i===0?1197n:1199n);if(key(f(o,2n))!==key(HOLDERS[i]))throw Error('HEARSAY_FOREIGN_EVIDENCE');
 const history=items(f(rec(prior,1200n),1n),'list'),value=f(o,i===0?4n:9n);
 if(i>0){const c=uint(f(o,6n)),ticket=uint(f(o,8n));if(key(f(o,4n))!==key(TARGET)||key(f(o,5n))!==key(INCIDENT)||key(f(o,7n))!==key(c===1n?TARGET:HOLDERS[0])||(c===1n?ticket!==0n:ticket===0n))throw Error('HEARSAY_FOREIGN_SOURCE');}
 if(i>0&&law===3||!items(value,'list').length)return prior;
 if(i>0&&uint(f(o,6n))===2n){const duplicate=history.find(x=>uint(f(rec(x,1199n),6n))===2n&&key(f(rec(x,1199n),7n))===key(f(o,7n))&&key(f(rec(x,1199n),8n))===key(f(o,8n)));if(duplicate){if(key(f(rec(duplicate,1199n),9n))!==key(value))throw Error('HEARSAY_CONFLICTING_TICKET');return prior;}}
 return r(1200,[list([...history,o])]);
}
export function infer(knowledge:CanonicalValue,law:number,truth?:boolean){
 let direct:Q|undefined,hearsay:Q|undefined,latest:Q|undefined;
 for(const o of items(f(rec(knowledge,1200n),1n),'list')){const obs=rec(o,1199n),v=items(f(obs,9n),'list')[0]===true?ONE:ZERO;if(uint(f(obs,6n))===1n)direct=v;else hearsay=v;latest=v;}
 if(law===4&&truth===undefined)throw Error('HEARSAY_ORACLE_TRUTH');
 return {direct,hearsay,estimate:law===4?(truth?ONE:ZERO):law===2?latest:direct??hearsay};
}
export function judgment(id:CanonicalValue,at:bigint,i:number,knowledge:CanonicalValue,law:number,truth?:boolean){const x=infer(knowledge,law,truth);return r(1202,[id,signed(at),HOLDERS[i],knowledge,opt(x.direct),opt(x.hearsay),opt(x.estimate)]);}
export function appraise(id:CanonicalValue,j:CanonicalValue,goal:number){const xs=items(f(rec(j,1202n),7n),'list'),p=xs.length?readQ(xs[0]):undefined,a=p?(goal===1?ONE.subtract(p):p):undefined,x=compareAffectFactors({likelihood:a,severity:ONE,vulnerability:ONE,control:ZERO},'SplitExposure');return r(1203,[id,j,u(goal),opt(a),list(x.status==='Known'?x.coordinates.map(qValue):[])]);}
