import {list,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue} from '../campaign2/cognitiveMath';
import {workspaceOutput,appraisalOutput,concernOutput,candidateOutput} from '../campaign2/cognitiveTransforms';
import {receivingRecord as old} from './receivingCodecs';
import {interpretationRecord as r} from './interpretationCodecs';
import {ACTOR,HOLDERS,TASKS,OPTIONS,sid} from './interpretationModel';
export const emptyKnowledge=()=>r(1117,[list([])]);
export function claim(knowledge:CanonicalValue){const xs=items(f(rec(knowledge,1117n),1n),'list');return xs.length?f(rec(xs.at(-1)!,1116n),4n):list([]);}
export function estimate(knowledge:CanonicalValue,latest=false){const xs=items(f(rec(knowledge,1117n),1n),'list').flatMap(x=>items(f(rec(x,1130n),3n),'list'));const samples=latest?xs.slice(-1):xs;return samples.length?list([qValue(Q.of(BigInt(samples.filter(x=>x===true).length),BigInt(samples.length)))]):list([]);}
export function learn(prior:CanonicalValue,evidence:CanonicalValue,i:number,law:number){const e=rec(evidence,i===0?1116n:1130n),o=i===0?e:rec(f(e,2n),1129n);if(key(f(o,2n))!==key(HOLDERS[i]))throw Error('INTERPRETATION_FOREIGN_EVIDENCE');if(!items(f(o,4n),'list').length||i>0&&law===4)return prior;return r(1117,[list([...items(f(rec(prior,1117n),1n),'list'),e])]);}
export function speakerContext(knowledge:CanonicalValue){const xs=items(f(rec(knowledge,1117n),1n),'list');return xs.length?uint(f(rec(xs.at(-1)!,1116n),5n)):0n;}
export function encodeAssertion(assertion:CanonicalValue,context:bigint){const xs=items(assertion,'list');return !xs.length||context===0n?list([]):list([u((xs[0]===true)===(context===1n)?1:2)]);}
export function interpret(observation:CanonicalValue,law:number,id:CanonicalValue,intended?:CanonicalValue){const o=rec(observation,1129n),tokens=items(f(o,4n),'list'),context=law===2?1n:uint(f(o,5n));const meaning=!tokens.length||law===6?list([]):law===3?(intended??list([])):context===0n?list([]):list([(uint(tokens[0])===1n)===(context===1n)]);return r(1130,[id,o,meaning]);}
export function interpretationContext(at:bigint,pressure:number,occ:(ns:number)=>CanonicalValue){
 const tasks=TASKS.map((key,i)=>({key,specId:sid(1027,'definition/interpretation/task/'+i),activeFrom:1n,deadline:17n}));
 const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'definition/interpretation/agenda'),old(378,[sid(1027,'definition/interpretation/prediction'),u(3),true,false]),tasks,at,{status:()=>old(372,[u(1)]),prediction:()=>undefined}).output;
 const a=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:ZERO,maximum:ONE}))),c=concernOutput(occ(1130),a,old(385,[q(0,1),false]));
 const motive=old(394,[occ(1131),c,list(TASKS.map((task,i)=>old(393,[task,q(pressure===3||pressure===i+1?1:0,1)])))]);
 return candidateOutput(occ(1132),motive,true,task=>{const i=TASKS.findIndex(t=>key(t)===key(task));if(i<0)throw Error('INTERPRETATION_TASK');return {instructionId:sid(1027,'definition/interpretation/instruction/'+i),actionId:f(rec(OPTIONS[i],395n),2n)};});
}
