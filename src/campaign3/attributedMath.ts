import {list,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ZERO,ONE} from '../campaign2/cognitiveMath';
import {workspaceOutput,appraisalOutput,concernOutput,candidateOutput} from '../campaign2/cognitiveTransforms';
import {receivingRecord as old} from './receivingCodecs';
import {attributedRecord as r} from './attributedCodecs';
import {ACTOR,HOLDERS,TASKS,OPTIONS,sid,PROPOSITION} from './attributedModel';
export const emptyKnowledge=(i=0)=>r(1134,[list([]),r(1147,[HOLDERS[i],HOLDERS[1],PROPOSITION,list([])])]);
export function claim(knowledge:CanonicalValue){const xs=items(f(rec(knowledge,1134n),1n),'list');return xs.length?f(rec(xs.at(-1)!,1133n),4n):list([]);}
export function targetStatus(knowledge:CanonicalValue){const xs=items(claim(knowledge),'list');return xs.length?(xs[0]===true?3:2):1;}
export function attribution(knowledge:CanonicalValue,law:number){const xs=items(f(rec(f(rec(knowledge,1134n),2n),1147n),4n),'list');if(!xs.length||law===3)return 0;const statuses=xs.map(x=>Number(uint(f(rec(x,1146n),4n))));if(law!==2)return statuses.at(-1)!;const counts=[1,2,3].map(n=>statuses.filter(x=>x===n).length),max=Math.max(...counts),winners=counts.flatMap((n,i)=>n===max?[i+1]:[]);return winners.length===1?winners[0]:0;}
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,law:number){const o=rec(observation,1133n);if(key(f(o,2n))!==key(HOLDERS[i]))throw Error('ATTRIBUTED_FOREIGN_EVIDENCE');const own=items(f(rec(prior,1134n),1n),'list'),person=rec(f(rec(prior,1134n),2n),1147n),reports=items(f(person,4n),'list'),value=items(f(o,5n),'list');return r(1134,[list([...own,...(items(f(o,4n),'list').length?[o]:[])]),r(1147,[HOLDERS[i],HOLDERS[1],PROPOSITION,list([...reports,...(i!==1&&law!==3&&value.length?[r(1146,[o,HOLDERS[1],PROPOSITION,value[0]])]:[])])])]);}
export function relevance(knowledge:CanonicalValue,status:number,pressure:number){if(pressure===2)return [1,0];if(pressure===3)return [1,1];const own=items(claim(knowledge),'list');if(!own.length)return [0,1];if(status===0)return [1,1];if(status===(own[0]===true?3:2))return [0,1];return [1,0];}
export function attributedContext(at:bigint,pressure:number,knowledge:CanonicalValue,status:number,occ:(ns:number)=>CanonicalValue){
 const tasks=TASKS.map((key,i)=>({key,specId:sid(1027,'definition/attributed/task/'+i),activeFrom:1n,deadline:17n}));
 const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'definition/attributed/agenda'),old(378,[sid(1027,'definition/attributed/prediction'),u(3),true,false]),tasks,at,{status:()=>old(372,[u(1)]),prediction:()=>undefined}).output;
 const a=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:ZERO,maximum:ONE}))),c=concernOutput(occ(1130),a,old(385,[q(0,1),false]));
 const motive=old(394,[occ(1131),c,list(TASKS.map((task,i)=>old(393,[task,q(relevance(knowledge,status,pressure)[i],1)])))]);
 return candidateOutput(occ(1132),motive,true,task=>{const i=TASKS.findIndex(t=>key(t)===key(task));if(i<0)throw Error('ATTRIBUTED_TASK');return {instructionId:sid(1027,'definition/attributed/instruction/'+i),actionId:f(rec(OPTIONS[i],395n),2n)};});
}
