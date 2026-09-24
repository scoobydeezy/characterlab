import {list,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue} from '../campaign2/cognitiveMath';
import {workspaceOutput,appraisalOutput,concernOutput,candidateOutput} from '../campaign2/cognitiveTransforms';
import {receivingRecord as old} from './receivingCodecs';
import {communicationRecord as r} from './communicationCodecs';
import {ACTOR,HOLDERS,TASKS,OPTIONS,sid} from './communicationModel';
export const emptyKnowledge=()=>r(1071,[list([])]);
export function claim(knowledge:CanonicalValue){const xs=items(f(rec(knowledge,1071n),1n),'list');return xs.length?f(rec(xs.at(-1)!,1070n),4n):list([]);}
export function estimate(knowledge:CanonicalValue,latest:boolean){const xs=items(f(rec(knowledge,1071n),1n),'list');if(!xs.length)return list([]);const samples=(latest?xs.slice(-1):xs).map(x=>items(f(rec(x,1070n),4n),'list')[0]);return list([qValue(Q.of(BigInt(samples.filter(x=>x===true).length),BigInt(samples.length)))]);}
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,law:number){const o=rec(observation,1070n);if(key(f(o,2n))!==key(HOLDERS[i]))throw Error('COMMUNICATION_FOREIGN_EVIDENCE');if(!items(f(o,4n),'list').length||i>0&&law===5)return prior;return r(1071,[list([...items(f(rec(prior,1071n),1n),'list'),o])]);}
export function communicationContext(at:bigint,pressure:number,occ:(ns:number)=>CanonicalValue){
 const tasks=TASKS.map((key,i)=>({key,specId:sid(1027,'definition/communication/task/'+i),activeFrom:1n,deadline:17n}));
 const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'definition/communication/agenda'),old(378,[sid(1027,'definition/communication/prediction'),u(3),true,false]),tasks,at,{status:()=>old(372,[u(1)]),prediction:()=>undefined}).output;
 const a=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:ZERO,maximum:ONE}))),c=concernOutput(occ(1130),a,old(385,[q(0,1),false]));
 const motive=old(394,[occ(1131),c,list(TASKS.map((task,i)=>old(393,[task,q(pressure===3||pressure===i+1?1:0,1)])))]);
 return candidateOutput(occ(1132),motive,true,task=>{const i=TASKS.findIndex(t=>key(t)===key(task));if(i<0)throw Error('COMMUNICATION_TASK');return {instructionId:sid(1027,'definition/communication/instruction/'+i),actionId:f(rec(OPTIONS[i],395n),2n)};});
}
