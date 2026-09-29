/** chosen-reappraisal-component/0.1-candidate; explicit component transaction, no native admission. */
import {canonicalEncode as enc,canonicalDecode as decode,list,map,set,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,ZERO,bounded,qValue,readQ,compileReasonNuclei} from '../campaign2/cognitiveMath';
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
import {compareAffectFactors} from './affectFactorComparison';
import {TASKS,OPTIONS,dice,estimate,type Law} from './embarrassment';
import {embarrassmentPublicRecord as n} from './embarrassmentPublicCodecs';
export type History={at:number;value:boolean}[][];
export function historyValue(history:History){return n(1473,history.map((xs,i)=>list(xs.map(s=>n(1472,[typedIdentifier(1165,u(s.at*100+90+i)),u(s.at),s.value])))));}
export function readHistory(value:CanonicalValue):History {return [1n,2n,3n].map((field,i)=>{let last=0;return items(f(rec(value,1473n),field),'list').map(v=>{const s=rec(v,1472n),at=Number(uint(f(s,2n)));if(at<=last||at>6||key(f(s,1n))!==key(typedIdentifier(1165,u(at*100+90+i))))throw Error('EMBARRASSMENT_HISTORY');last=at;return {at,value:f(s,3n) as boolean};});});}
export function appraisal(law:Law,projection:number,context:CanonicalValue,knowledge:CanonicalValue,id:CanonicalValue){const ctx=rec(context,1477n),goals=rec(f(ctx,3n),1470n),est=estimate(readHistory(knowledge),law),severity=Q.of(uint(f(goals,1n)),4n),affect=compareAffectFactors({likelihood:est.likelihood,severity,vulnerability:ONE,control:ZERO},projection===2?'SplitExposure':'ScalarUncontrolled');return n(1478,[id,context,knowledge,list(est.mismatch===undefined?[]:[est.mismatch]),list(est.seen===undefined?[]:[est.seen]),list(est.judgment?[qValue(est.judgment)]:[]),list(est.likelihood?[qValue(est.likelihood)]:[]),qValue(severity),list(affect.status==='Known'?affect.coordinates.map(qValue):[])]);}
export function nativeReasons(law:Law,app:CanonicalValue){const a=rec(app,1478n),ctx=rec(f(a,2n),1477n),g=rec(f(ctx,3n),1470n),next=Number(uint(f(ctx,2n))),nextGoals=[1n,2n,3n].map(i=>Number(uint(f(g,i)))),history=readHistory(f(a,3n)),coords=items(f(a,9n),'list'),affect=coords.length?{status:'Known',coordinates:coords.map(readQ)}:{status:'Unavailable',coordinates:[]},source={opportunity:f(ctx,4n)===true},values=[Q.of(BigInt(nextGoals[1]),4n),Q.of(BigInt(nextGoals[2]),4n)];let ordinal=BigInt(next)*100n;const occ=(ns:number)=>typedIdentifier(ns,u(ordinal++));
    const tasks=TASKS.map((key,i)=>({key,specId:sid(1027,'definition/embarrassment/task/'+i),activeFrom:1n,deadline:6n}));
    const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'definition/embarrassment/agenda'),r(378,[sid(1027,'definition/embarrassment/prediction'),u(3),true,false]),tasks,BigInt(next),{status(task){const i=TASKS.findIndex(t=>key(t)===key(task));return source.opportunity&&values[i].compare(ZERO)>0?r(372,[u(1)]):undefined;},prediction:()=>undefined}).output;
    const ap=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:ZERO,maximum:ONE}))),concern=concernOutput(occ(1130),ap,r(385,[q(0,1),false]));
    const selected=items(f(rec(w,381n),4n),'list').map(v=>f(rec(v,379n),1n)),motive=r(394,[occ(1131),concern,list(selected.map(t=>r(393,[t,qValue(values[TASKS.findIndex(k=>key(k)===key(t))])])))]);
    const context=candidateOutput(occ(1132),motive,true,t=>{const i=TASKS.findIndex(k=>key(k)===key(t));if(i<0)throw Error('CHOSEN_REAPPRAISAL_TASK');return {instructionId:sid(1027,'definition/embarrassment/strategy/'+i),actionId:f(rec(OPTIONS[i],395n),2n)};});
    const unmodified=rawSignalOutput(occ(1133),context,false,ONE,()=>undefined).output,signals=[...items(f(rec(unmodified,403n),3n),'set')];
    if(source.opportunity&&affect.status==='Known'&&law!=='NoAffectReasons'){
     const basis=r(400,[map(history.flatMap((xs,i)=>xs.map(sample=>[r(399,[u(1),r(237,[u(1),typedIdentifier(1165,u(sample.at*100+90+i))])]),qValue(ONE)] as const)))]);
     signals.push(r(402,[r(401,[OPTIONS[0],TASKS[0],u(2)]),qValue(affect.coordinates.at(-1)!),basis]));
    }
    const modifier=source.opportunity&&affect.status==='Known'&&law!=='NoAffectReasons'?affect.coordinates.at(-1)!:ZERO,meaning=map((f(rec(unmodified,403n),4n) as Extract<CanonicalValue,{kind:'map'}>).entries.map(([option,value])=>{const pressure=values[OPTIONS.findIndex(o=>key(o)===key(option))].add(key(option)===key(OPTIONS[0])?modifier:ZERO);return [option,qValue(bounded(pressure))] as const;}));
    const raw=r(403,[f(rec(unmodified,403n),1n),context,set(signals),meaning]),reasons=r(408,[occ(1134),raw,list(compileReasonNuclei(signals,dice(law)))]);
return reasons;
}
