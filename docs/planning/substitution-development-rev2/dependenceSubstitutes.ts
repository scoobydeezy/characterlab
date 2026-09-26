/** dependence-substitutes-component/0.1-candidate; run-owned component, no public authority. */
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
export const VERSION='dependence-substitutes-component/0.1-candidate';
export const LAWS=['LatestHistory','MeanHistory','ExpectationOnly','HistoryOnly','NoLearning'] as const;
export type Law=typeof LAWS[number];
export const TASK=r(371,[ACTOR,semanticReferentFromAuthoredContent(sid(1038,'content/substitution/relief'))]);
export const OPTIONS=['A','B','idle'].map(n=>r(395,[ACTOR,sid(1027,'action/substitution/'+n)]));
export interface Frame {at:number;mode:number;visible:boolean;demand:number;cue:boolean;availableA:boolean;availableB:boolean;actualA:boolean;actualB:boolean;receipt:boolean;report:number;infoA:number;infoB:number;privateBit:boolean;}
const fields=['at','mode','visible','demand','cue','availableA','availableB','actualA','actualB','receipt','report','infoA','infoB','privateBit'];
export function validateFrames(xs:readonly Frame[]){
 if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype||xs.length!==8||Reflect.ownKeys(xs).length!==9||Object.values(Object.getOwnPropertyDescriptors(xs)).some(d=>!('value'in d)))throw Error('SUBSTITUTION_FRAMES');
 for(const [i,x] of xs.entries()){
  if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('SUBSTITUTION_DATA');const ds=Object.getOwnPropertyDescriptors(x);if(Reflect.ownKeys(ds).length!==fields.length||fields.some(k=>!ds[k]||!('value'in ds[k])))throw Error('SUBSTITUTION_DATA');
  if(x.at!==i+1||![0,1,2,3].includes(x.mode)||![0,1].includes(x.demand)||[x.report,x.infoA,x.infoB].some(n=>![0,1,2].includes(n)))throw Error('SUBSTITUTION_DOMAIN');
  for(const k of fields.filter(k=>!['at','mode','demand','report','infoA','infoB'].includes(k)))if(typeof x[k as keyof Frame]!=='boolean')throw Error('SUBSTITUTION_BOOL');
  if(x.mode!==0&&(x.infoA!==0||x.infoB!==0))throw Error('SUBSTITUTION_INFO_MODE');
 }
}
const config=()=>{const base=multisourceBase();return {dice:base.get('task-reason-dice'),arbitration:base.get('task-arbitration')};};
export function substitutionContent(){const c=config();return list([TASK,list(OPTIONS),c.dice,c.arbitration,q(1,2),u(8),text('residual h=(h+success)/2; latest or exact mean; one common relief task; source contract '+VERSION)]);}
type Sample={at:number;value:boolean;kind:'action'|'information'};
type Practice={at:number;option:number;cue:boolean;success:boolean};
const clone=<T>(v:T):T=>structuredClone(v),qs=(v:Q)=>v.numerator+'/'+v.denominator;
function expectation(samples:Sample[],law:Law){return samples.length?law==='MeanHistory'?Q.of(BigInt(samples.filter(s=>s.value).length),BigInt(samples.length)):samples.at(-1)!.value?ONE:ZERO:null;}
function habit(journal:Practice[],option:number,cue:boolean){let h=ZERO;for(const p of journal)if(p.option===option&&p.cue===cue)h=h.add(p.success?ONE:ZERO).divide(Q.of(2n));return h;}
export type Row={at:number;mode:number;demand:number;cue:boolean;available:boolean[];beliefBefore:(string|null)[];habitBefore:string[];admitted:boolean[];values:string[];context:string;raw:string;reasons:string;resolution:string;expression:string|null;intent:number;attempt:string|null;receipt:boolean|null};
export function createSubstitutionRun(law:Law,inputs:readonly Frame[],seed=7){
 if(!LAWS.includes(law)||!Number.isInteger(seed)||seed<0||seed>255)throw Error('SUBSTITUTION_PROFILE');validateFrames(inputs);const originals=clone(inputs),c=config(),random=createCognitiveRandomSession(new Uint8Array(32).fill(seed));
 let at=0,journal:Practice[]=[],belief:Sample[][]=[[],[]],rows:Row[]=[],physical=[0,0],unserved=0,world:{at:number;execution:string|null;physical:number[];unserved:number;privateBit:boolean}[]=[],busy=false;
 const snapshot=()=>clone({at,journal,belief,rows,physical,unserved,world,addresses:random.committedAddressKeys()});
 const save=()=>enc(list([text(VERSION),text(law),text(JSON.stringify(originals)),u(seed),u(at),text(JSON.stringify(snapshot()))]));
 return Object.freeze({snapshot,save,observerView:()=>clone({journal,belief,rows}),
  async step(fault?:'after-decision'|'before-commit'){
   if(busy)throw Error('SUBSTITUTION_CONCURRENT');if(at===8)return false;busy=true;random.begin();
   try{
    const next=at+1,o=originals[at],mode=o.visible?o.mode:0,demand=o.visible?o.demand:0,cue=o.visible&&o.cue,available=[o.visible&&o.availableA,o.visible&&o.availableB];
    const estimates=belief.map(b=>expectation(b,law)),hs=[0,1].map(i=>habit(journal,i,cue)),training=mode===1||mode===2;
    const admitted=[0,1].map(i=>available[i]&&(training?i===mode-1:mode===3&&demand===1&&(law==='ExpectationOnly'?(estimates[i]??ZERO).compare(ZERO)>0:law==='HistoryOnly'?hs[i].compare(Q.of(1n,2n))>=0:(estimates[i]??ZERO).compare(ZERO)>0||hs[i].compare(Q.of(1n,2n))>=0)));
    const indices=training&&admitted.some(Boolean)?[mode-1]:[...admitted.flatMap((v,i)=>v?[i]:[]),2];
    const values=[0,1].map(i=>training&&admitted[i]?ONE:(estimates[i]??ZERO).multiply(Q.of(BigInt(demand))));
    let ordinal=BigInt(next)*100n;const occ=(ns:number)=>typedIdentifier(ns,u(ordinal++));
    const tasks=[{key:TASK,specId:sid(1027,'definition/substitution/relief'),activeFrom:1n,deadline:9n}];
    const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'definition/substitution/agenda'),r(378,[sid(1027,'definition/substitution/prediction'),u(3),true,false]),tasks,BigInt(next),{status:()=>r(372,[u(1)]),prediction:()=>undefined}).output;
    const appraisal=appraisalOutput(occ(1129),w,[{taskKey:TASK,specId:tasks[0].specId,minimum:ZERO,maximum:ONE}]),concern=concernOutput(occ(1130),appraisal,r(385,[q(0,1),false])),motive=r(394,[occ(1131),concern,list([r(393,[TASK,qValue(training?ONE:Q.of(BigInt(demand)))])])]);
    const ordered=indices.slice().sort((a,b)=>key(OPTIONS[a])<key(OPTIONS[b])?-1:1);
    const context=r(398,[occ(1132),motive,list(ordered.map(i=>r(397,[OPTIONS[i],set([r(396,[TASK,sid(1027,'definition/substitution/instruction/'+i)])])])))]);
    const raw=r(403,[occ(1133),context,set(ordered.filter(i=>i<2&&!values[i].equals(ZERO)).map(i=>r(402,[r(401,[OPTIONS[i],TASK,u(1)]),qValue(values[i]),r(400,[map([])])]))),map(ordered.map(i=>[OPTIONS[i],qValue(i<2?values[i]:ZERO)]))]);
    const reasons=r(408,[occ(1134),raw,list(compileReasonNuclei(items(f(rec(raw,403n),3n),'set'),c.dice))]),root=typedIdentifier(1135,u(next)),resolution=await arbitrationOutput(root,BigInt(next),reasons,c.arbitration,random.forResolution(root,reasons));
    const chosen=uint(f(rec(f(rec(resolution,409n),4n),419n),1n))===3n?OPTIONS.findIndex(option=>key(option)===key(f(chosenData(resolution),1n))):-1;
    let expression:CanonicalValue|undefined,attempt:CanonicalValue|undefined;
    if(chosen>=0){const intent=intentOutput(occ(1136),resolution);expression=expressionOutput(occ(1137),intent);attempt=attemptOutput(occ(1140),planOutput(occ(1139),intent,r(391,[u(1)])));}
    if(fault==='after-decision')throw Error('SUBSTITUTION_INJECTED');
    const execution=attempt?executionOutput(occ(1141),attempt,chosen<2&&(chosen===0?o.actualA:o.actualB)):undefined,success=!!execution&&uint(f(rec(execution,433n),3n))===1n,nextPhysical=[...physical];if(success)nextPhysical[chosen]++;
    const nextUnserved=unserved+(mode===3&&demand===1&&!success?1:0),receipt=chosen>=0&&chosen<2&&o.receipt?(o.report===0?success:o.report===1):null,nextBelief=clone(belief),nextJournal=clone(journal);
    if(law!=='NoLearning'){
     if(receipt!==null){nextBelief[chosen].push({at:next,value:receipt,kind:'action'});nextJournal.push({at:next,option:chosen,cue,success:receipt});}
     if(mode===0&&o.visible)for(const [i,info] of [o.infoA,o.infoB].entries())if(info)nextBelief[i].push({at:next,value:info===2,kind:'information'});
    }
    const row:Row={at:next,mode,demand,cue,available,beliefBefore:estimates.map(v=>v?qs(v):null),habitBefore:hs.map(qs),admitted,values:values.map(qs),context:key(context),raw:key(raw),reasons:key(reasons),resolution:key(resolution),expression:expression?key(expression):null,intent:chosen,attempt:attempt?key(attempt):null,receipt};
    if(fault==='before-commit')throw Error('SUBSTITUTION_INJECTED');random.prepareCommit();random.commit();at=next;journal=nextJournal;belief=nextBelief;physical=nextPhysical;unserved=nextUnserved;rows=[...rows,row];world=[...world,{at:next,execution:execution?key(execution):null,physical:[...physical],unserved,privateBit:o.privateBit}];return true;
   }finally{random.close();busy=false;}
  }
 });
}
export async function restoreSubstitutionRun(law:Law,inputs:readonly Frame[],saved:Uint8Array,seed=7){const copy=saved.slice(),v=items(decode(copy),'list');if(v.length!==6)throw Error('SUBSTITUTION_SAVE_SHAPE');const count=uint(v[4]);if(count>8n)throw Error('SUBSTITUTION_SAVE_PREFIX');const run=createSubstitutionRun(law,inputs,seed);for(let i=0n;i<count;i++)await run.step();if(key(decode(run.save()))!==key(decode(copy)))throw Error('SUBSTITUTION_SAVE_MISMATCH');return run;}
