/** Restricted operands: no world, archive, registry or general state capability. */
import {list,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,readQ,qValue,foldIdentityHistory} from '../campaign2/cognitiveMath';
import {workspaceOutput,appraisalOutput,concernOutput,candidateOutput} from '../campaign2/cognitiveTransforms';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataKey as key} from '../campaign2/canonicalData';
import {receivingRecord as old} from './receivingCodecs';
import {relationshipRecord} from './relationshipCodecs';
import {skillRecord} from './skillCodecs';

import {longitudinalRecord as r} from './longitudinalCodecs';
import {ACTOR,TASKS,OPTIONS,sid,emptyIdentity,emptySkill,emptyRelationship,type LongitudinalSettings} from './longitudinalModel';
export function biographyContext(at:bigint,occ:(ns:number)=>CanonicalValue){
 const tasks=TASKS.map((key,i)=>({key,specId:sid(1027,'definition/longitudinal/task/'+i),activeFrom:1n,deadline:65n}));
 const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'definition/longitudinal/agenda'),old(378,[sid(1027,'definition/longitudinal/prediction'),u(3),true,false]),tasks,at,{status:()=>old(372,[u(1)]),prediction:()=>undefined}).output;
 const a=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:ZERO,maximum:ONE}))),c=concernOutput(occ(1130),a,old(385,[q(0,1),false]));
 const motive=old(394,[occ(1131),c,list(TASKS.map((task,i)=>old(393,[task,q(1,i+1)])))]);
 return candidateOutput(occ(1132),motive,true,task=>{const i=TASKS.findIndex(t=>key(t)===key(task));if(i<0)throw Error('LONGITUDINAL_TASK');return {instructionId:sid(1027,'definition/longitudinal/instruction/'+i),actionId:f(rec(OPTIONS[i],395n),2n)};});
}
export function relationshipFold(journal:CanonicalValue,law:number){let count=0n,rupture=false;for(const e of items(f(rec(journal,866n),1n),'list')){const v=rec(e,865n);if(uint(f(v,3n))!==3n)continue;if(f(v,4n)===true){count++;if(law===2)rupture=false;}else rupture=true;}return relationshipRecord(851,[u(count),rupture]);}
export function familyValue(s:LongitudinalSettings,family:number,value:CanonicalValue){if(s.representation===4){const slot=rec(value,874n);return Number(uint(f(slot,1n)))===family?items(f(slot,2n),'list')[0]:family===1?emptyIdentity():family===2?emptySkill():emptyRelationship();}return family===3&&(s.representation===1||s.representation===3)?relationshipFold(value,s.law):value;}
export function identityStrength(history:CanonicalValue){return foldIdentityHistory(items(f(rec(history,414n),1n),'list'),ONE).strength;}
export function evolveSkill(prior:CanonicalValue,source:CanonicalValue,s:LongitudinalSettings){const p=rec(prior,784n),x=rec(source,878n);let k=readQ(f(p,1n));if(s.rust===1&&uint(f(x,9n))>=4n)k=k.divide(Q.of(2n));if(f(x,8n)===true){k=k.subtract(Q.of(1n,4n));if(k.compare(ZERO)<0)k=ZERO;}const practiced=f(x,4n)===true;if(practiced){k=k.add(Q.of(1n,4n));if(k.compare(ONE)>0)k=ONE;}return skillRecord(784,[qValue(k),u(uint(f(p,2n))+(practiced?1n:0n))]);}export function evolveRelationship(prior:CanonicalValue,positive:boolean,law:number){const p=rec(prior,851n);return relationshipRecord(851,[u(uint(f(p,1n))+(positive?1n:0n)),positive&&law===2?false:f(p,2n)===true||!positive]);}
export function episode(observation:CanonicalValue){const o=rec(observation,879n);return r(865,[f(o,1n),f(o,2n),f(o,3n),f(o,6n)]);}



