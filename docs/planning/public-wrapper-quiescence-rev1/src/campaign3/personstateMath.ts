import {list,signed,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue} from '../campaign2/cognitiveMath';
import {workspaceOutput,appraisalOutput,concernOutput,candidateOutput} from '../campaign2/cognitiveTransforms';
import {receivingRecord as old} from './receivingCodecs';
import {personstateRecord as r} from './personstateCodecs';
import {compareAffectFactors} from './affectFactorComparison';
import {ACTOR,HOLDERS,TASKS,OPTIONS,sid,PROPOSITION} from './personstateModel';
export const emptyKnowledge=()=>r(1151,[list([]),list([]),HOLDERS[0],PROPOSITION]);
export function effectivePolicy(knowledge:CanonicalValue,def:number){const xs=items(f(rec(knowledge,1151n),1n),'list');const override=xs.length?Number(uint(f(rec(xs.at(-1)!,1150n),4n))):0;return override||def;}
const average=(xs:readonly CanonicalValue[])=>xs.length?Q.of(BigInt(xs.filter(x=>x===true).length),BigInt(xs.length)):undefined;
export function estimates(knowledge:CanonicalValue,law:number,oraclePolicy?:number){const k=rec(knowledge,1151n),history=items(f(k,1n),'list').flatMap(x=>items(f(rec(x,1164n),4n),'list')),cue=items(f(k,2n),'list').flatMap(x=>items(f(rec(x,1163n),4n),'list')),d=average(history),current=average(cue);if(law===2){const pooled=average([...history,...cue]);return {disposition:pooled,current:pooled};}return {disposition:law===4?undefined:d,current:law===3?d:law===5?(oraclePolicy===1?ONE:oraclePolicy===2?ZERO:Q.of(1n,2n)):current};}
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,cue=false){const o=rec(observation,i===0?1150n:cue?1163n:1164n);if(key(f(o,2n))!==key(HOLDERS[i]))throw Error('PERSONSTATE_FOREIGN_EVIDENCE');const k=rec(prior,1151n),history=items(f(k,1n),'list'),nextHistory=cue?history:[...history,...(i===0||items(f(o,4n),'list').length?[o]:[])];return r(1151,[list(nextHistory),cue?list([o]):f(k,2n),HOLDERS[0],PROPOSITION]);}
export function appraisal(id:CanonicalValue,at:bigint,i:number,knowledge:CanonicalValue,law:number,goal:number,oraclePolicy?:number){const e=estimates(knowledge,law,oraclePolicy),adverse=e.current===undefined?undefined:goal===1?ONE.subtract(e.current):e.current,affect=compareAffectFactors({likelihood:adverse,severity:ONE,vulnerability:ONE,control:ZERO},'SplitExposure'),optional=(x:Q|undefined)=>list(x===undefined?[]:[qValue(x)]);return r(1153,[id,signed(at),HOLDERS[i],knowledge,optional(e.disposition),optional(e.current),u(goal),optional(adverse),list(affect.status==='Known'?affect.coordinates.map(qValue):[])]);}
export function personstateContext(at:bigint,pressure:number,occ:(ns:number)=>CanonicalValue){
 const tasks=TASKS.map((key,i)=>({key,specId:sid(1027,'definition/personstate/task/'+i),activeFrom:1n,deadline:17n}));
 const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'definition/personstate/agenda'),old(378,[sid(1027,'definition/personstate/prediction'),u(3),true,false]),tasks,at,{status:()=>old(372,[u(1)]),prediction:()=>undefined}).output;
 const a=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:ZERO,maximum:ONE}))),c=concernOutput(occ(1130),a,old(385,[q(0,1),false]));
 const motive=old(394,[occ(1131),c,list(TASKS.map((task,i)=>old(393,[task,q(pressure===3||pressure===i+1?1:0,1)])))]);
 return candidateOutput(occ(1132),motive,true,task=>{const i=TASKS.findIndex(t=>key(t)===key(task));if(i<0)throw Error('PERSONSTATE_TASK');return {instructionId:sid(1027,'definition/personstate/instruction/'+i),actionId:f(rec(OPTIONS[i],395n),2n)};});
}
