/** temporal-goal-conflict-component/0.1-candidate; component transaction, no public authority. */
import {canonicalEncode as enc,list,text,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,ZERO,qValue,compileReasonNuclei} from '../campaign2/cognitiveMath';
import {workspaceOutput,appraisalOutput,concernOutput,candidateOutput,rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {arbitrationOutput,createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {chosenData,intentOutput,expressionOutput,planOutput,attemptOutput,executionOutput} from '../campaign2/cognitiveChoice';
import {receivingRecord as r,decodeReceiving as decode} from './receivingCodecs';
import {multisourceBase} from './multisourceModelRecipe';
import {ACTOR,sid} from './longitudinalModel';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {ExactRational as Q} from '../substrate/exactMath';
export const VERSION='temporal-goal-conflict-component/0.1-candidate';
export const LAWS=['HorizonRelative','NoTemporalBias','DropLoser','SharedRetirement'] as const;
export type Law=typeof LAWS[number];
export const TASKS=['short','long'].map(n=>r(371,[ACTOR,semanticReferentFromAuthoredContent(sid(1038,'content/temporal-goal/'+n))]));
export const OPTIONS=['short','long'].map(n=>r(395,[ACTOR,sid(1027,'action/temporal-goal/'+n)]));
const deadlines=[5,8],required=[1,3];
export interface Frame {at:number;visible:boolean;adoptShort:boolean;adoptLong:boolean;availableShort:boolean;availableLong:boolean;accessShort:boolean;accessLong:boolean;strengthShort:number;strengthLong:number;forecast:number;cancelShort:boolean;cancelLong:boolean;actualShort:boolean;actualLong:boolean;receipt:boolean;report:number;privateBit:boolean;}
const fields=['at','visible','adoptShort','adoptLong','availableShort','availableLong','accessShort','accessLong','strengthShort','strengthLong','forecast','cancelShort','cancelLong','actualShort','actualLong','receipt','report','privateBit'];
export function validateFrames(xs:readonly Frame[]){
 if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype||xs.length!==8||Reflect.ownKeys(xs).length!==9||Object.values(Object.getOwnPropertyDescriptors(xs)).some(d=>!('value'in d)))throw Error('TEMPORAL_FRAMES');
 for(const [i,x] of xs.entries()){
  if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('TEMPORAL_DATA');const ds=Object.getOwnPropertyDescriptors(x);if(Reflect.ownKeys(ds).length!==fields.length||fields.some(k=>!ds[k]||!('value'in ds[k])))throw Error('TEMPORAL_DATA');
  if(x.at!==i+1||![1,2,3,4].includes(x.strengthShort)||![1,2,3,4].includes(x.strengthLong)||![0,1,2].includes(x.forecast)||![0,1,2].includes(x.report))throw Error('TEMPORAL_DOMAIN');
  for(const k of fields.filter(k=>!['at','strengthShort','strengthLong','forecast','report'].includes(k)))if(typeof x[k as keyof Frame]!=='boolean')throw Error('TEMPORAL_BOOL');
  if(x.at!==1&&(x.adoptShort||x.adoptLong))throw Error('TEMPORAL_ADOPTION_WINDOW');
 }
}
const config=()=>{const base=multisourceBase();return {dice:base.get('task-reason-dice'),arbitration:base.get('task-arbitration')};};
export function temporalContent(){const c=config();return list([list(TASKS),list(OPTIONS),list(deadlines.map(u)),list(required.map(u)),c.dice,c.arbitration,q(1,4),u(5)]);}
type Goal={status:'Absent'|'Open'|'Fulfilled'|'Cancelled'|'DeadlineMissed';progress:number};
type Safe={available:boolean[];access:boolean[];strength:number[]};
export type Row={at:number;goalsBefore:Goal[];goalsAfter:Goal[];forecastBefore:number;forecastAfter:number;values:string[];context:string;raw:string;reasons:string;resolution:string;expression:string|null;intent:number;attempt:string|null;receipt:boolean|null;available:boolean[];access:boolean[];retiredByControl:number[]};
const clone=<T>(v:T):T=>structuredClone(v);
export function createTemporalRun(law:Law,inputs:readonly Frame[],seed=7){
 if(!LAWS.includes(law)||!Number.isInteger(seed)||seed<0||seed>255)throw Error('TEMPORAL_PROFILE');validateFrames(inputs);const originals=clone(inputs),c=config(),random=createCognitiveRandomSession(new Uint8Array(32).fill(seed));
 let at=0,goals:Goal[]=[{status:'Absent',progress:0},{status:'Absent',progress:0}],safe:Safe={available:[false,false],access:[false,false],strength:[4,4]},forecast=0,physical=[0,0],rows:Row[]=[],world:{at:number;execution:string|null;success:boolean;physical:number[];privateBit:boolean}[]=[],busy=false;
 const snapshot=()=>clone({at,goals,safe,forecast,physical,rows,world,addresses:random.committedAddressKeys()});
 const save=()=>enc(list([text(VERSION),text(law),text(JSON.stringify(originals)),u(seed),u(at),text(JSON.stringify(snapshot()))]));
 return Object.freeze({
  snapshot,save,observerView:()=>clone({goals,safe,forecast,rows}),
  async step(fault?:'after-decision'|'before-commit'){
   if(busy)throw Error('TEMPORAL_CONCURRENT');if(at===8)return false;busy=true;random.begin();
   try{
    const next=at+1,original=originals[at],before=clone(goals),after=clone(goals),retiredByControl:number[]=[];let ordinal=BigInt(next)*100n;const occ=(ns:number)=>typedIdentifier(ns,u(ordinal++));
    const values=safe.strength.map((n,i)=>Q.of(BigInt(n),4n).multiply(i===1&&law!=='NoTemporalBias'&&forecast===2&&next<5?Q.of(1n,4n):ONE));
    const tasks=TASKS.map((key,i)=>({key,specId:sid(1027,'definition/temporal/task/'+i),activeFrom:1n,deadline:BigInt(deadlines[i])}));
    const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'definition/temporal/agenda'),r(378,[sid(1027,'definition/temporal/prediction'),u(3),true,false]),tasks,BigInt(next),{status(task){const i=TASKS.findIndex(t=>key(t)===key(task));return goals[i].status==='Open'&&safe.available[i]&&safe.access[i]?r(372,[u(1)]):undefined;},prediction:()=>undefined}).output;
    const appraisal=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:ZERO,maximum:ONE}))),concern=concernOutput(occ(1130),appraisal,r(385,[q(0,1),false]));
    const selected=items(f(rec(w,381n),4n),'list').map(v=>f(rec(v,379n),1n));
    const motive=r(394,[occ(1131),concern,list(selected.map(t=>r(393,[t,qValue(values[TASKS.findIndex(k=>key(k)===key(t))])])))]);
    const context=candidateOutput(occ(1132),motive,true,t=>{const i=TASKS.findIndex(k=>key(k)===key(t));if(i<0)throw Error('TEMPORAL_TASK');return {instructionId:sid(1027,'definition/temporal/instruction/'+i),actionId:f(rec(OPTIONS[i],395n),2n)};});
    const raw=rawSignalOutput(occ(1133),context,false,ONE,()=>undefined).output,reason=r(408,[occ(1134),raw,list(compileReasonNuclei(items(f(rec(raw,403n),3n),'set'),c.dice))]);
    const root=typedIdentifier(1135,u(next)),resolution=await arbitrationOutput(root,BigInt(next),reason,c.arbitration,random.forResolution(root,reason));
    const result=rec(f(rec(resolution,409n),4n),419n),chosen=uint(f(result,1n))===3n?OPTIONS.findIndex(o=>key(o)===key(f(chosenData(resolution),1n))):-1;
    let expression:CanonicalValue|undefined,attempt:CanonicalValue|undefined,execution:CanonicalValue|undefined;
    if(chosen>=0){const intent=intentOutput(occ(1136),resolution);expression=expressionOutput(occ(1137),intent);attempt=attemptOutput(occ(1140),planOutput(occ(1139),intent,r(391,[u(1)])));}
    if(fault==='after-decision')throw Error('TEMPORAL_INJECTED');
    if(attempt)execution=executionOutput(occ(1141),attempt,chosen===0?original.actualShort:original.actualLong);
    const success=!!execution&&uint(f(rec(execution,433n),3n))===1n,nextPhysical=[...physical];if(success)nextPhysical[chosen]++;
    const receipt=chosen>=0&&original.receipt?(original.report===0?success:original.report===1):null;
    if(original.visible&&next===1){if(original.adoptShort)after[0].status='Open';if(original.adoptLong)after[1].status='Open';}
    for(let i=0;i<2;i++)if(after[i].status==='Open'){
     if(chosen===i&&receipt===true)after[i].progress++;
     if(after[i].progress>=required[i])after[i].status='Fulfilled';
     else if(original.visible&&(i===0?original.cancelShort:original.cancelLong))after[i].status='Cancelled';
     else if(next>=deadlines[i])after[i].status='DeadlineMissed';
    }
    if(law==='DropLoser'&&selected.length===2&&chosen>=0&&after[1-chosen].status==='Open'){after[1-chosen].status='Cancelled';retiredByControl.push(1-chosen);}
    if(law==='SharedRetirement'&&after.some((g,i)=>before[i].status==='Open'&&g.status!=='Open'))for(let i=0;i<2;i++)if(after[i].status==='Open'){after[i].status='Cancelled';retiredByControl.push(i);}
    const nextSafe:Safe={available:[original.visible&&original.availableShort,original.visible&&original.availableLong],access:[original.visible&&original.accessShort,original.visible&&original.accessLong],strength:original.visible?[original.strengthShort,original.strengthLong]:[...safe.strength]},nextForecast=original.visible&&original.forecast?original.forecast:forecast;
    const row:Row={at:next,goalsBefore:before,goalsAfter:clone(after),forecastBefore:forecast,forecastAfter:nextForecast,values:values.map(v=>v.numerator+'/'+v.denominator),context:key(context),raw:key(raw),reasons:key(reason),resolution:key(resolution),expression:expression?key(expression):null,intent:chosen,attempt:attempt?key(attempt):null,receipt,available:[...safe.available],access:[...safe.access],retiredByControl};
    if(fault==='before-commit')throw Error('TEMPORAL_INJECTED');random.prepareCommit();random.commit();
    at=next;goals=after;safe=nextSafe;forecast=nextForecast;physical=nextPhysical;rows=[...rows,row];world=[...world,{at:next,execution:execution?key(execution):null,success,physical:[...physical],privateBit:original.privateBit}];return true;
   }finally{random.close();busy=false;}
  }
 });
}
export async function restoreTemporalRun(law:Law,inputs:readonly Frame[],saved:Uint8Array,seed=7){
 const copy=saved.slice(),v=items(decode(copy),'list');if(v.length!==6)throw Error('TEMPORAL_SAVE_SHAPE');const count=uint(v[4]);if(count>8n)throw Error('TEMPORAL_SAVE_PREFIX');const run=createTemporalRun(law,inputs,seed);for(let i=0n;i<count;i++)await run.step();if(key(decode(run.save()))!==key(decode(copy)))throw Error('TEMPORAL_SAVE_MISMATCH');return run;
}
