import {list,unsigned as u,rational as q,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue,readQ} from '../campaign2/cognitiveMath';
import {workspaceOutput,appraisalOutput,concernOutput,candidateOutput} from '../campaign2/cognitiveTransforms';
import {receivingRecord as old} from './receivingCodecs';
import {emotionalDisplayRecord as r} from './emotionalDisplayCodecs';
import {compareAffectFactors} from './affectFactorComparison';
import {ACTOR,HOLDERS,TASKS,OPTIONS,sid} from './emotionalDisplayModel';
export const emptyKnowledge=()=>r(1101,[list([])]);
export function claim(knowledge:CanonicalValue){const xs=items(f(rec(knowledge,1101n),1n),'list');return xs.length?f(rec(xs.at(-1)!,1100n),4n):list([]);}
export function estimate(knowledge:CanonicalValue,cue=false){const xs=items(f(rec(knowledge,1101n),1n),'list').flatMap(x=>items(f(rec(x,1100n),cue?8n:4n),'list'));if(!xs.length)return list([]);const sum=xs.reduce<Q>((n,x)=>n.add(cue?readQ(x):x===true?ONE:ZERO),ZERO);return list([qValue(sum.divide(Q.of(BigInt(xs.length))))]);}
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,law:number){const o=rec(observation,1100n);if(key(f(o,2n))!==key(HOLDERS[i]))throw Error('EMOTIONAL_DISPLAY_FOREIGN_EVIDENCE');if(i>0&&law===6||!items(f(o,4n),'list').length&&!items(f(o,6n),'list').length&&!items(f(o,8n),'list').length&&key(f(o,7n))===key(u(0)))return prior;return r(1101,[list([...items(f(rec(prior,1101n),1n),'list'),o])]);}
export function appraise(knowledge:CanonicalValue,severity:number,at:bigint,id:CanonicalValue){
 const observations=items(f(rec(knowledge,1101n),1n),'list').map(x=>rec(x,1100n));
 const means=[1,2,3].map(c=>{const samples=observations.filter(o=>key(f(o,5n))===key(u(c))).flatMap(o=>items(f(o,4n),'list'));return samples.length?Q.of(BigInt(samples.filter(x=>x===true).length),BigInt(samples.length)):undefined;});
 let reserve:Q|undefined,catalogue=0;for(const o of observations){const rs=items(f(o,6n),'list');if(rs.length)reserve=readQ(rs[0]);if(key(f(o,7n))!==key(u(0)))catalogue=key(f(o,7n))===key(u(1))?1:2;}
 const [p,b,t]=means,v=reserve?ONE.subtract(reserve):undefined,reduction=b&&t&&b.compare(ZERO)>0?b.subtract(t).divide(b):undefined,c=catalogue===1?ZERO:catalogue===2&&reduction?(reduction.compare(ZERO)>0?reduction:ZERO):undefined,s=Q.of(BigInt(severity),2n);
 const projected=compareAffectFactors({likelihood:p,severity:s,vulnerability:v,control:c},'SplitExposure'),opt=(v:Q|undefined)=>list(v?[qValue(v)]:[]);
 return r(1113,[id,signed(at),knowledge,opt(p),qValue(s),opt(v),opt(c),list(projected.status==='Known'?projected.coordinates.map(qValue):[])]);
}
export function distress(context:CanonicalValue){const xs=items(f(rec(context,1104n),4n),'list');return xs.length?items(f(rec(xs[0],1113n),8n),'list')[1]:undefined;}
export function emotionalDisplayContext(at:bigint,pressure:number,occ:(ns:number)=>CanonicalValue){
 const tasks=TASKS.map((key,i)=>({key,specId:sid(1027,'definition/emotionalDisplay/task/'+i),activeFrom:1n,deadline:17n}));
 const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'definition/emotionalDisplay/agenda'),old(378,[sid(1027,'definition/emotionalDisplay/prediction'),u(3),true,false]),tasks,at,{status:()=>old(372,[u(1)]),prediction:()=>undefined}).output;
 const a=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:ZERO,maximum:ONE}))),c=concernOutput(occ(1130),a,old(385,[q(0,1),false]));
 const motive=old(394,[occ(1131),c,list(TASKS.map((task,i)=>old(393,[task,q(pressure===3||pressure===i+1?1:0,1)])))]);
 return candidateOutput(occ(1132),motive,true,task=>{const i=TASKS.findIndex(t=>key(t)===key(task));if(i<0)throw Error('EMOTIONAL_DISPLAY_TASK');return {instructionId:sid(1027,'definition/emotionalDisplay/instruction/'+i),actionId:f(rec(OPTIONS[i],395n),2n)};});
}
