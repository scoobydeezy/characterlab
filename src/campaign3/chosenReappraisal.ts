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
export const VERSION='chosen-reappraisal-component/0.1-candidate';
export const LAWS=['BenefitRelative','KnowledgeOnly','NoReappraisal'] as const;
export type Law=typeof LAWS[number];
export interface Frame {at:number;condition:number;physical:boolean;display:boolean;observed:boolean;catalogue:number;catalogueObserved:boolean;opportunity:boolean;complete:boolean;safety:number;work:number;}
const fields=['at','condition','physical','display','observed','catalogue','catalogueObserved','opportunity','complete','safety','work'];
export function validateFrames(xs:readonly Frame[]){
 dataOnly(xs);if(!Array.isArray(xs)||xs.length!==8)throw Error('CHOSEN_REAPPRAISAL_LENGTH');
 for(const [i,x]of xs.entries()){
  if(!x||Object.keys(x).length!==fields.length||fields.some(k=>!Object.hasOwn(x,k)))throw Error('CHOSEN_REAPPRAISAL_FIELDS');
  if(x.at!==i+1||![0,1,2].includes(x.condition)||![0,1,2].includes(x.catalogue)||![0,1,2,3,4].includes(x.safety)||![0,1,2,3,4].includes(x.work))throw Error('CHOSEN_REAPPRAISAL_DOMAIN');
  for(const k of ['physical','display','observed','catalogueObserved','opportunity','complete'] as const)if(typeof x[k]!=='boolean')throw Error('CHOSEN_REAPPRAISAL_BOOL');
  if(x.opportunity&&x.at!==4||x.at!==1&&(x.safety!==0||x.work!==0))throw Error('CHOSEN_REAPPRAISAL_ORDER');
 }
}
export const TASKS=['reframe','work'].map(n=>r(371,[ACTOR,semanticReferentFromAuthoredContent(sid(1038,'content/chosen-reappraisal/'+n))]));
export const OPTIONS=['reframe','work'].map(n=>r(395,[ACTOR,sid(1027,'action/chosen-reappraisal/'+n)]));
export function chosenContent(){const c=multisourceBase();return list([list(TASKS),list(OPTIONS),c.get('task-reason-dice'),c.get('task-arbitration'),text('reappraisal-public/0.1-candidate'),q(1,1),q(1,1),q(0,1)]);}
const clone=<T>(x:T):T=>structuredClone(x),fraction=(v:Q)=>`${v.numerator}/${v.denominator}`;
export type Row={at:number;goals:number[];eligible:boolean;values:string[];appraisal:string;affect:string[];means:(string|null)[];knowledgeBefore:string;knowledgeAfter:string;frameBefore:string|null;frameAfter:string|null;raw:string;reasons:string;resolution:string;probabilities:string[];chosen:number;intent:string|null;expression:string|null;plan:string|null;attempt:string|null;completion:boolean;observation:string;};
export async function createChosenReappraisalRun(law:Law,inputs:readonly Frame[],seed=0,projection=1){
 if(!LAWS.includes(law)||!Number.isInteger(seed)||seed<0||seed>255||![1,2].includes(projection))throw Error('CHOSEN_REAPPRAISAL_PROFILE');
 validateFrames(inputs);const originals=clone(inputs),model=await compileReappraisalModel(reappraisalRecipe(1,projection)),base=multisourceBase(),random=createCognitiveRandomSession(new Uint8Array(32).fill(seed));
 let at=0,knowledge=emptyKnowledge(),frame:CanonicalValue|undefined,goals=[0,0],rows:Row[]=[],world:{at:number;physical:boolean;execution:string|null}[]=[],busy=false;
 const guard=()=>{if(busy)throw Error('CHOSEN_REAPPRAISAL_BUSY');};
 const snap=()=>clone({at,knowledge:key(knowledge),frame:frame?key(frame):null,goals,rows,world,addresses:random.committedAddressKeys()});
 return Object.freeze({
  snapshot(){guard();return snap();},observerView(){guard();return clone({at,knowledge:key(knowledge),frame:frame?key(frame):null,goals,rows});},
  save(){guard();return enc(list([text(VERSION),text(law),u(projection),text(JSON.stringify(originals)),u(seed),u(at),text(JSON.stringify(snap()))]));},
  async step(fault?:'before-decision'|'after-decision'|'after-application'|'before-commit'){
   guard();if(at===8)return false;busy=true;random.begin();
   try{
    const next=at+1,source=originals[at],nextGoals=next===1?[source.safety,source.work]:[...goals],k=contextKnowledge(knowledge),eligible=k.catalogue===2n&&k.means.every(x=>x!==undefined);let ordinal=BigInt(next)*100n;
    const occ=(ns:number)=>typedIdentifier(ns,u(ordinal++)),obsId=typedIdentifier(1165,u(next*100+90)),appId=typedIdentifier(1165,u(next*100+91));
    const app=reappraise(model,knowledge,frame,BigInt(next),appId),benefit=eligible?k.means[0]!.subtract(k.means[1]!):ZERO,positive=benefit.compare(ZERO)>0?benefit:ZERO;
    const values=[Q.of(BigInt(nextGoals[0]),4n).multiply(law==='KnowledgeOnly'?ONE:positive),Q.of(BigInt(nextGoals[1]),4n)];
    const tasks=TASKS.map((key,i)=>({key,specId:sid(1027,'definition/chosen-reappraisal/task/'+i),activeFrom:1n,deadline:8n}));
    const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'definition/chosen-reappraisal/agenda'),r(378,[sid(1027,'definition/chosen-reappraisal/prediction'),u(3),true,false]),tasks,BigInt(next),{status(task){const i=TASKS.findIndex(t=>key(t)===key(task));return source.opportunity&&values[i].compare(ZERO)>0&&(i===1||eligible)?r(372,[u(1)]):undefined;},prediction:()=>undefined}).output;
    const ap=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:ZERO,maximum:ONE}))),concern=concernOutput(occ(1130),ap,r(385,[q(0,1),false]));
    const selected=items(f(rec(w,381n),4n),'list').map(v=>f(rec(v,379n),1n)),motive=r(394,[occ(1131),concern,list(selected.map(t=>r(393,[t,qValue(values[TASKS.findIndex(k=>key(k)===key(t))])])))]);
    const context=candidateOutput(occ(1132),motive,true,t=>{const i=TASKS.findIndex(k=>key(k)===key(t));if(i<0)throw Error('CHOSEN_REAPPRAISAL_TASK');return {instructionId:sid(1027,'definition/chosen-reappraisal/strategy/'+i),actionId:f(rec(OPTIONS[i],395n),2n)};});
    const raw=rawSignalOutput(occ(1133),context,false,ONE,()=>undefined).output,reasons=r(408,[occ(1134),raw,list(compileReasonNuclei(items(f(rec(raw,403n),3n),'set'),base.get('task-reason-dice')))]);
    if(fault==='before-decision')throw Error('CHOSEN_REAPPRAISAL_INJECTED');
    const root=typedIdentifier(1135,u(next)),resolution=await arbitrationOutput(root,BigInt(next),reasons,base.get('task-arbitration'),random.forResolution(root,reasons)),result=rec(f(rec(resolution,409n),4n),419n),chosen=uint(f(result,1n))===3n?OPTIONS.findIndex(o=>key(o)===key(f(chosenData(resolution),1n))):-1;
    let intent:CanonicalValue|undefined,expression:CanonicalValue|undefined,plan:CanonicalValue|undefined,attempt:CanonicalValue|undefined,execution:CanonicalValue|undefined;
    if(chosen>=0){intent=intentOutput(occ(1136),resolution);expression=expressionOutput(occ(1137),intent);plan=planOutput(occ(1139),intent,r(391,[u(1)]));attempt=attemptOutput(occ(1140),plan);}
    if(fault==='after-decision')throw Error('CHOSEN_REAPPRAISAL_INJECTED');
    if(attempt)execution=executionOutput(occ(1141),attempt,source.complete);
    const completion=!!execution&&uint(f(rec(execution,433n),3n))===1n;
    const obs=rr(1027,[obsId,OBSERVER,signed(next),u(source.condition),list(source.condition&&source.observed?[source.display]:[]),u(source.catalogueObserved?source.catalogue:0)]),old=rec(knowledge,1028n),admitted=source.condition&&source.observed||source.catalogueObserved&&source.catalogue>0;
    const nextKnowledge=admitted?rr(1028,[list([...items(f(old,1n),'list'),obs]),false]):knowledge,nextFrame=chosen===0&&completion&&law!=='NoReappraisal'?rr(1030,[u(1),list(k.sources),signed(next)]):frame;
    if(fault==='after-application')throw Error('CHOSEN_REAPPRAISAL_INJECTED');
    const row:Row={at:next,goals:[...nextGoals],eligible,values:values.map(fraction),appraisal:key(app),affect:items(f(rec(app,1032n),7n),'list').map(x=>fraction(readQ(x))),means:k.means.map(x=>x?fraction(x):null),knowledgeBefore:key(knowledge),knowledgeAfter:key(nextKnowledge),frameBefore:frame?key(frame):null,frameAfter:nextFrame?key(nextFrame):null,raw:key(raw),reasons:key(reasons),resolution:key(resolution),probabilities:chosen>=0?items(f(chosenData(resolution),2n),'list').map(x=>fraction(readQ(f(rec(x,421n),2n)))):[],chosen,intent:intent?key(intent):null,expression:expression?key(expression):null,plan:plan?key(plan):null,attempt:attempt?key(attempt):null,completion,observation:key(obs)};
    if(fault==='before-commit')throw Error('CHOSEN_REAPPRAISAL_INJECTED');random.prepareCommit();random.commit();
    at=next;knowledge=nextKnowledge;frame=nextFrame;goals=nextGoals;rows=[...rows,row];world=[...world,{at:next,physical:source.physical,execution:execution?key(execution):null}];return true;
   }finally{random.close();busy=false;}
  }
 });
}
export async function restoreChosenReappraisalRun(law:Law,inputs:readonly Frame[],saved:Uint8Array,seed=0,projection=1){
 const copy=saved.slice(),v=items(decode(copy),'list');if(v.length!==7)throw Error('CHOSEN_REAPPRAISAL_SAVE');const count=uint(v[5]);if(count>8n)throw Error('CHOSEN_REAPPRAISAL_PREFIX');
 const run=await createChosenReappraisalRun(law,inputs,seed,projection);for(let i=0n;i<count;i++)await run.step();const actual=run.save();if(actual.length!==copy.length||!actual.every((b,i)=>b===copy[i]))throw Error('CHOSEN_REAPPRAISAL_SAVE_MISMATCH');return run;
}
