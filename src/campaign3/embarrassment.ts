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
export const VERSION='embarrassment-component/0.1-candidate';
export const LAWS=['Contextual','Latest','JudgmentOnly','NoAffectReasons','CoarseUnit'] as const;
export type Law=typeof LAWS[number];
export interface Frame {at:number;worldMismatch:boolean;worldSeen:boolean;worldJudgment:boolean;mismatch:boolean;mismatchAccess:boolean;seen:boolean;seenAccess:boolean;judgment:boolean;judgmentAccess:boolean;reputation:number;avoid:number;participate:number;opportunity:boolean;complete:boolean;display:boolean;}
const fields=['at','worldMismatch','worldSeen','worldJudgment','mismatch','mismatchAccess','seen','seenAccess','judgment','judgmentAccess','reputation','avoid','participate','opportunity','complete','display'];
export function validateFrames(xs:readonly Frame[]){dataOnly(xs);if(!Array.isArray(xs)||xs.length!==6)throw Error('EMBARRASSMENT_LENGTH');for(const [i,x]of xs.entries()){
 if(!x||Object.keys(x).length!==fields.length||fields.some(k=>!Object.hasOwn(x,k)))throw Error('EMBARRASSMENT_FIELDS');
 if(x.at!==i+1||['reputation','avoid','participate'].some(k=>![0,1,2,3,4].includes(x[k as 'avoid'])))throw Error('EMBARRASSMENT_DOMAIN');
 for(const k of fields.filter(k=>!['at','reputation','avoid','participate'].includes(k)))if(typeof x[k as 'display']!=='boolean')throw Error('EMBARRASSMENT_BOOL');
 if(x.opportunity&&x.at!==4||x.at!==1&&(x.reputation||x.avoid||x.participate))throw Error('EMBARRASSMENT_ORDER');
}}
export const TASKS=['withdraw','participate'].map(n=>r(371,[ACTOR,semanticReferentFromAuthoredContent(sid(1038,'content/embarrassment/'+n))]));
export const OPTIONS=['withdraw','participate'].map(n=>r(395,[ACTOR,sid(1027,'action/embarrassment/'+n)]));
export function dice(law:Law){const old=multisourceBase().get('task-reason-dice');return law==='CoarseUnit'?old:r(437,[f(rec(old,437n),1n),q(0,1),r(439,[q(1,4),u(3)]),r(439,[q(1,4),u(3)])]);}
export function embarrassmentContent(law:Law){const c=multisourceBase();return list([list(TASKS),list(OPTIONS),dice(law),c.get('task-arbitration'),text('known competence standard; one self-relevant incident/evaluator; controlled reports'),text('SplitExposure or ScalarUncontrolled; GradedDisplay')]);}
const clone=<T>(x:T):T=>structuredClone(x),fraction=(v:Q)=>`${v.numerator}/${v.denominator}`;
type Sample={at:number;value:boolean};type History=Sample[][];
export function estimate(history:History,law:Law){const [m,a,j]=history,mismatch=m.at(-1)?.value,seen=a.at(-1)?.value,judgment=j.length?(law==='Latest'?Q.of(j.at(-1)!.value?1n:0n):Q.of(BigInt(j.filter(s=>s.value).length),BigInt(j.length))):undefined;return {mismatch,seen,judgment,likelihood:mismatch===undefined||seen===undefined||judgment===undefined?undefined:law==='JudgmentOnly'||mismatch&&seen?judgment:ZERO};}
export async function createEmbarrassmentRun(law:Law,inputs:readonly Frame[],seed=0,projection=2){
 if(!LAWS.includes(law)||!Number.isInteger(seed)||seed<0||seed>255||![2,3].includes(projection))throw Error('EMBARRASSMENT_PROFILE');validateFrames(inputs);
 const originals=clone(inputs),base=multisourceBase(),random=createCognitiveRandomSession(new Uint8Array(32).fill(seed));let at=0,history:History=[[],[],[]],goals=[0,0,0],present=true,rows:any[]=[],world:any[]=[],busy=false;
 const guard=()=>{if(busy)throw Error('EMBARRASSMENT_BUSY');},snap=()=>clone({at,history,goals,present,rows,world,addresses:random.committedAddressKeys()});
 return Object.freeze({snapshot(){guard();return snap();},observerView(){guard();return clone({at,history,goals,rows});},save(){guard();return enc(list([text(VERSION),text(law),u(projection),text(JSON.stringify(originals)),u(seed),u(at),text(JSON.stringify(snap()))]));},
 async step(fault?:'before-decision'|'after-decision'|'after-application'|'before-commit'){
  guard();if(at===6)return false;busy=true;random.begin();try{
   const next=at+1,source=originals[at],nextGoals=next===1?[source.reputation,source.avoid,source.participate]:[...goals],est=estimate(history,law),severity=Q.of(BigInt(nextGoals[0]),4n),affect=compareAffectFactors({likelihood:est.likelihood,severity,vulnerability:ONE,control:ZERO},projection===2?'SplitExposure':'ScalarUncontrolled'),values=[Q.of(BigInt(nextGoals[1]),4n),Q.of(BigInt(nextGoals[2]),4n)];
   let ordinal=BigInt(next)*100n;const occ=(ns:number)=>typedIdentifier(ns,u(ordinal++));
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
    if(fault==='before-decision')throw Error('EMBARRASSMENT_INJECTED');
    const root=typedIdentifier(1135,u(next)),resolution=await arbitrationOutput(root,BigInt(next),reasons,base.get('task-arbitration'),random.forResolution(root,reasons)),result=rec(f(rec(resolution,409n),4n),419n),chosen=uint(f(result,1n))===3n?OPTIONS.findIndex(o=>key(o)===key(f(chosenData(resolution),1n))):-1;
    let intent:CanonicalValue|undefined,expression:CanonicalValue|undefined,plan:CanonicalValue|undefined,attempt:CanonicalValue|undefined,execution:CanonicalValue|undefined;
    if(chosen>=0){intent=intentOutput(occ(1136),resolution);expression=expressionOutput(occ(1137),intent);plan=planOutput(occ(1139),intent,r(391,[u(1)]));attempt=attemptOutput(occ(1140),plan);}
    if(fault==='after-decision')throw Error('EMBARRASSMENT_INJECTED');
    if(attempt)execution=executionOutput(occ(1141),attempt,source.complete);
    const completion=!!execution&&uint(f(rec(execution,433n),3n))===1n;
    const observation={at:next,reports:[source.mismatchAccess?source.mismatch:null,source.seenAccess?source.seen:null,source.judgmentAccess?source.judgment:null]},nextHistory=history.map((xs,i)=>observation.reports[i]===null?xs:[...xs,{at:next,value:observation.reports[i]!}]),nextPresent=completion?chosen===1:present,cue=source.display&&affect.status==='Known'?fraction(affect.coordinates.at(-1)!):null;
    if(fault==='after-application')throw Error('EMBARRASSMENT_INJECTED');
    const row={at:next,goals:nextGoals,knowledgeBefore:clone(history),knowledgeAfter:clone(nextHistory),mismatch:est.mismatch??null,seen:est.seen??null,judgment:est.judgment?fraction(est.judgment):null,likelihood:est.likelihood?fraction(est.likelihood):null,severity:fraction(severity),vulnerability:'1/1',control:'0/1',affect:affect.status==='Known'?affect.coordinates.map(fraction):[],raw:key(raw),reasons:key(reasons),resolution:key(resolution),probabilities:chosen>=0?items(f(chosenData(resolution),2n),'list').map(x=>fraction(readQ(f(rec(x,421n),2n)))):[],chosen,intent:intent?key(intent):null,expression:expression?key(expression):null,plan:plan?key(plan):null,attempt:attempt?key(attempt):null,execution:execution?key(execution):null,completion,cue,observation};
    if(fault==='before-commit')throw Error('EMBARRASSMENT_INJECTED');random.prepareCommit();random.commit();at=next;history=nextHistory;goals=nextGoals;present=nextPresent;rows=[...rows,row];world=[...world,{at:next,mismatch:source.worldMismatch,seen:source.worldSeen,judgment:source.worldJudgment,present}];return true;
  }finally{random.close();busy=false;}
 }});
}
export async function restoreEmbarrassmentRun(law:Law,inputs:readonly Frame[],saved:Uint8Array,seed=0,projection=2){const copy=saved.slice(),v=items(decode(copy),'list');if(v.length!==7)throw Error('EMBARRASSMENT_SAVE');const count=uint(v[5]);if(count>6n)throw Error('EMBARRASSMENT_PREFIX');const run=await createEmbarrassmentRun(law,inputs,seed,projection);for(let i=0n;i<count;i++)await run.step();const actual=run.save();if(actual.length!==copy.length||!actual.every((b,i)=>b===copy[i]))throw Error('EMBARRASSMENT_SAVE_MISMATCH');return run;}
