/** chosen-reappraisal-component/0.1-candidate; explicit component transaction, no native admission. */
import {canonicalEncode as enc,canonicalDecode as decode,list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,ZERO,qValue,readQ,compileReasonNuclei} from '../campaign2/cognitiveMath';
import {workspaceOutput,appraisalOutput,concernOutput,candidateOutput,rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {arbitrationOutput,createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {chosenData,intentOutput,expressionOutput,planOutput,attemptOutput,executionOutput} from '../campaign2/cognitiveChoice';
import {receivingRecord as r} from './receivingCodecs';
import {multisourceBase} from './multisourceModelRecipe';
import {ACTOR,sid,OBSERVER,compileReappraisalModel,reappraisalRecipe} from './reappraisalModel';
import {reappraisalRecord as rr} from './reappraisalCodecs';
import {reappraise,contextKnowledge,emptyKnowledge} from './reappraisalMath';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataOnly} from './biologyPublicMath';
import {TASKS,OPTIONS,type Law} from './chosenReappraisal';
export function nativeReasons(law:Law,knowledge:CanonicalValue,nextGoals:number[],next:number,opportunity:boolean){
 const base=multisourceBase(),k=contextKnowledge(knowledge),eligible=k.catalogue===2n&&k.means.every(x=>x!==undefined),benefit=eligible?k.means[0]!.subtract(k.means[1]!):ZERO,positive=benefit.compare(ZERO)>0?benefit:ZERO;
 const values=[Q.of(BigInt(nextGoals[0]),4n).multiply(law==='KnowledgeOnly'?ONE:positive),Q.of(BigInt(nextGoals[1]),4n)];
 let ordinal=BigInt(next)*100n;const occ=(ns:number)=>typedIdentifier(ns,u(ordinal++)),source={opportunity};
    const tasks=TASKS.map((key,i)=>({key,specId:sid(1027,'definition/chosen-reappraisal/task/'+i),activeFrom:1n,deadline:8n}));
    const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'definition/chosen-reappraisal/agenda'),r(378,[sid(1027,'definition/chosen-reappraisal/prediction'),u(3),true,false]),tasks,BigInt(next),{status(task){const i=TASKS.findIndex(t=>key(t)===key(task));return source.opportunity&&values[i].compare(ZERO)>0&&(i===1||eligible)?r(372,[u(1)]):undefined;},prediction:()=>undefined}).output;
    const ap=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:ZERO,maximum:ONE}))),concern=concernOutput(occ(1130),ap,r(385,[q(0,1),false]));
    const selected=items(f(rec(w,381n),4n),'list').map(v=>f(rec(v,379n),1n)),motive=r(394,[occ(1131),concern,list(selected.map(t=>r(393,[t,qValue(values[TASKS.findIndex(k=>key(k)===key(t))])])))]);
    const context=candidateOutput(occ(1132),motive,true,t=>{const i=TASKS.findIndex(k=>key(k)===key(t));if(i<0)throw Error('CHOSEN_REAPPRAISAL_TASK');return {instructionId:sid(1027,'definition/chosen-reappraisal/strategy/'+i),actionId:f(rec(OPTIONS[i],395n),2n)};});
    const raw=rawSignalOutput(occ(1133),context,false,ONE,()=>undefined).output,reasons=r(408,[occ(1134),raw,list(compileReasonNuclei(items(f(rec(raw,403n),3n),'set'),base.get('task-reason-dice')))]);
 return {reasons,raw,values,eligible,k};
}
