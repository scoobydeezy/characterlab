/** costly-reward-component/0.1-candidate; single-owner component, not public authority. */
import {canonicalEncode as enc,list,set,map,text,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,ZERO,qValue,compileReasonNuclei} from '../campaign2/cognitiveMath';
import {workspaceOutput,appraisalOutput,concernOutput} from '../campaign2/cognitiveTransforms';
import {arbitrationOutput,createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {chosenData,intentOutput,expressionOutput,planOutput,attemptOutput,executionOutput} from '../campaign2/cognitiveChoice';
import {receivingRecord as r,decodeReceiving as decode} from './receivingCodecs';
import {multisourceBase} from './multisourceModelRecipe';
import {ACTOR,sid} from './longitudinalModel';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {ExactRational as Q} from '../substrate/exactMath';
export const VERSION='costly-reward-component/0.1-candidate';
export const LAWS=['MeanHistory','LatestHistory','BeliefAccess','NoControl','NoLearning','RewardOnly'] as const;
export type Law=typeof LAWS[number];
export const TASKS=['reward','protection'].map(n=>r(371,[ACTOR,semanticReferentFromAuthoredContent(sid(1038,'content/costly-reward/'+n))]));
export const OPTIONS=['consume','withhold'].map(n=>r(395,[ACTOR,sid(1027,'action/costly-reward/'+n)]));
export interface Frame {at:number;visible:boolean;cue:boolean;adopt:boolean;reminder:boolean;support:boolean;card:boolean;availableA:boolean;executionA:boolean;rewardA:boolean;harmA:boolean;receipt:boolean;reportReward:number;reportHarm:number;privateBit:boolean;}
const fields=['at','visible','cue','adopt','reminder','support','card','availableA','executionA','rewardA','harmA','receipt','reportReward','reportHarm','privateBit'];
export function validateFrames(xs:readonly Frame[]){
 if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype||xs.length!==12||Reflect.ownKeys(xs).length!==13||Object.values(Object.getOwnPropertyDescriptors(xs)).some(d=>!('value'in d)))throw Error('COSTLY_FRAMES');
 for(const [i,x] of xs.entries()){
  if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('COSTLY_DATA');const ds=Object.getOwnPropertyDescriptors(x);if(Reflect.ownKeys(ds).length!==fields.length||fields.some(k=>!ds[k]||!('value'in ds[k])))throw Error('COSTLY_DATA');
  if(x.at!==i+1||![0,1,2].includes(x.reportReward)||![0,1,2].includes(x.reportHarm)||x.adopt&&x.at!==4)throw Error('COSTLY_DOMAIN');
  for(const k of fields.filter(k=>!['at','reportReward','reportHarm'].includes(k)))if(typeof x[k as keyof Frame]!=='boolean')throw Error('COSTLY_BOOL');
 }
}
const config=()=>{const b=multisourceBase();return {dice:b.get('task-reason-dice'),arbitration:b.get('task-arbitration')};};
export function costlyContent(){const c=config();return list([list(TASKS),list(OPTIONS),c.dice,c.arbitration,q(1,2),u(12),text('separate benefit/harm; two grounds; goal-maintained inhibition; no Addicted trait')]);}
type Sample={at:number;reward:boolean;harm:boolean;cue:boolean};
export type Row={at:number;training:boolean;goal:boolean;maintained:boolean;card:boolean;cue:boolean;availableA:boolean;rewardBelief:string|null;harmBelief:string|null;habit:string;admittedA:boolean;inhibited:boolean;values:string[];raw:string;reasons:string;resolution:string;expression:string|null;intent:number;receipt:{reward:boolean;harm:boolean}|null};
const clone=<T>(v:T):T=>structuredClone(v),qs=(v:Q)=>`${v.numerator}/${v.denominator}`;
function estimate(history:Sample[],field:'reward'|'harm',law:Law){return history.length?(law==='LatestHistory'?(history.at(-1)![field]?ONE:ZERO):Q.of(BigInt(history.filter(s=>s[field]).length),BigInt(history.length))):null;}
export function createCostlyRun(law:Law,inputs:readonly Frame[],seed=7){
 if(!LAWS.includes(law)||!Number.isInteger(seed)||seed<0||seed>255)throw Error('COSTLY_PROFILE');validateFrames(inputs);const originals=clone(inputs),c=config(),random=createCognitiveRandomSession(new Uint8Array(32).fill(seed));
 let at=0,history:Sample[]=[],goal=false,maintained=false,rows:Row[]=[],world:{at:number;intent:number;execution:string|null;performedA:boolean;reward:boolean;harm:boolean;privateBit:boolean}[]=[],busy=false;
 const observerView=()=>clone({at,history,goal,maintained,rows});
 const snapshot=()=>clone({...observerView(),world,addresses:random.committedAddressKeys()});
 const save=()=>enc(list([text(VERSION),text(law),text(JSON.stringify(originals)),u(seed),u(at),text(JSON.stringify(snapshot()))]));
 return Object.freeze({snapshot,save,observerView,async step(fault?:'after-decision'|'before-commit'){
  if(busy)throw Error('COSTLY_CONCURRENT');if(at===12)return false;busy=true;random.begin();
  try{
   const next=at+1,o=originals[at],training=next<=4,cue=o.visible&&o.cue,availableA=o.visible&&o.availableA,card=o.visible&&o.card,nextMaintained=goal&&(o.visible&&o.reminder||maintained&&o.support),reward=estimate(history,'reward',law),harm=estimate(history,'harm',law);
   let h=ZERO;for(const s of history)if(s.cue===cue)h=h.add(s.reward?ONE:ZERO).divide(Q.of(2n));
   const accessible=law==='BeliefAccess'?(reward??ZERO).compare(ZERO)>0:h.compare(Q.of(1n,2n))>=0,inhibited=!training&&goal&&nextMaintained&&!card&&law!=='NoControl',admittedA=availableA&&(training||accessible&&!inhibited),indices=training?(admittedA?[0]:[]):[...(admittedA?[0]:[]),1];
   const values=[training?ONE:reward??ZERO,goal&&nextMaintained&&law!=='RewardOnly'?harm??ZERO:ZERO];
   let ordinal=BigInt(next)*100n;const occ=(ns:number)=>typedIdentifier(ns,u(ordinal++));
   const tasks=TASKS.map((key,i)=>({key,specId:sid(1027,'definition/costly-reward/task/'+i),activeFrom:1n,deadline:13n}));
   const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'definition/costly-reward/agenda'),r(378,[sid(1027,'definition/costly-reward/prediction'),u(3),true,false]),tasks,BigInt(next),{status:()=>r(372,[u(1)]),prediction:()=>undefined}).output;
   const appraisal=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:ZERO,maximum:ONE}))),concern=concernOutput(occ(1130),appraisal,r(385,[q(0,1),false])),motive=r(394,[occ(1131),concern,list(TASKS.map((t,i)=>r(393,[t,qValue(values[i])]))) ]);
   const ordered=indices.slice().sort((a,b)=>key(OPTIONS[a])<key(OPTIONS[b])?-1:1),context=r(398,[occ(1132),motive,list(ordered.map(i=>r(397,[OPTIONS[i],set([r(396,[TASKS[i],sid(1027,'definition/costly-reward/instruction/'+i)])])])))]);
   const raw=r(403,[occ(1133),context,set(ordered.filter(i=>!values[i].equals(ZERO)).map(i=>r(402,[r(401,[OPTIONS[i],TASKS[i],u(1)]),qValue(values[i]),r(400,[map([])])]))),map(ordered.map(i=>[OPTIONS[i],qValue(values[i])]))]);
   const reasons=r(408,[occ(1134),raw,list(compileReasonNuclei(items(f(rec(raw,403n),3n),'set'),c.dice))]),root=typedIdentifier(1135,u(next)),resolution=await arbitrationOutput(root,BigInt(next),reasons,c.arbitration,random.forResolution(root,reasons));
   const chosen=uint(f(rec(f(rec(resolution,409n),4n),419n),1n))===3n?OPTIONS.findIndex(option=>key(option)===key(f(chosenData(resolution),1n))):-1;
   let expression:CanonicalValue|undefined,attempt:CanonicalValue|undefined;
   if(chosen>=0){const intent=intentOutput(occ(1136),resolution);expression=expressionOutput(occ(1137),intent);attempt=attemptOutput(occ(1140),planOutput(occ(1139),intent,r(391,[u(1)])));}
   if(fault==='after-decision')throw Error('COSTLY_INJECTED');
   const execution=attempt?executionOutput(occ(1141),attempt,chosen===1||o.executionA):undefined,performedA=chosen===0&&!!execution&&uint(f(rec(execution,433n),3n))===1n,actualReward=performedA&&o.rewardA,actualHarm=performedA&&o.harmA;
   const receipt=chosen===0&&o.receipt?{reward:o.reportReward===0?actualReward:o.reportReward===1,harm:o.reportHarm===0?actualHarm:o.reportHarm===1}:null,nextHistory=clone(history);if(law!=='NoLearning'&&receipt)nextHistory.push({at:next,...receipt,cue});
   const row:Row={at:next,training,goal,maintained:nextMaintained,card,cue,availableA,rewardBelief:reward?qs(reward):null,harmBelief:harm?qs(harm):null,habit:qs(h),admittedA,inhibited,values:values.map(qs),raw:key(raw),reasons:key(reasons),resolution:key(resolution),expression:expression?key(expression):null,intent:chosen,receipt};
   if(fault==='before-commit')throw Error('COSTLY_INJECTED');random.prepareCommit();random.commit();at=next;history=nextHistory;goal=goal||o.visible&&o.adopt;maintained=nextMaintained;rows=[...rows,row];world=[...world,{at:next,intent:chosen,execution:execution?key(execution):null,performedA,reward:actualReward,harm:actualHarm,privateBit:o.privateBit}];return true;
  }finally{random.close();busy=false;}
 }});
}
export async function restoreCostlyRun(law:Law,inputs:readonly Frame[],saved:Uint8Array,seed=7){const v=items(decode(saved),'list');if(v.length!==6)throw Error('COSTLY_SAVE');const count=uint(v[4]);if(count>12n)throw Error('COSTLY_PREFIX');const run=createCostlyRun(law,inputs,seed);for(let i=0n;i<count;i++)await run.step();const actual=run.save();if(actual.length!==saved.length||!actual.every((x,i)=>x===saved[i]))throw Error('COSTLY_MISMATCH');return run;}
