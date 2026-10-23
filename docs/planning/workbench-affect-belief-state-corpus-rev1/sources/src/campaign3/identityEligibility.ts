/** identity-eligibility/0.1-candidate. Research component; no public admission. */
import {canonicalEncode as enc,list,set,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,ZERO,readQ,qValue,foldIdentityHistory,compileReasonNuclei,choiceAlignment} from '../campaign2/cognitiveMath';
import {rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {arbitrationOutput,createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {chosenData,intentOutput,planOutput,attemptOutput,executionOutput} from '../campaign2/cognitiveChoice';
import {receivingRecord as r,decodeReceiving as decode} from './receivingCodecs';
import {bioContext} from './bioComparison';
import {OPTIONS,TASKS} from './longitudinalModel';

export const ELIGIBILITY_VERSION='identity-eligibility/0.1-candidate';
export const ELIGIBILITY_LAWS=['Threshold','Graded','IgnorePressure','Frequency','NoFeedback','Refold'] as const;
export type EligibilityLaw=typeof ELIGIBILITY_LAWS[number];
export interface EligibilityInput {setting:'Work'|'Home'; significance:0|1|4; pressure:0|2|4; instructed:boolean; movement:'Chosen'|'Forced'; permitted:boolean;}
type SafeEligibilityContext=Omit<EligibilityInput,'permitted'>;
const fields=['setting','significance','pressure','instructed','movement','permitted'];
function checked(input:readonly EligibilityInput[]):EligibilityInput[]{
 if(!Array.isArray(input)||input.length!==5)throw Error('eligibility requires five inputs');
 return input.map(x=>{
  if(!x||Object.getPrototypeOf(x)!==Object.prototype||Reflect.ownKeys(x).length!==fields.length||fields.some(k=>!Object.getOwnPropertyDescriptor(x,k)||!('value' in Object.getOwnPropertyDescriptor(x,k)!)))throw Error('eligibility input shape');
  if(!['Work','Home'].includes(x.setting)||![0,1,4].includes(x.significance)||![0,2,4].includes(x.pressure)||typeof x.instructed!=='boolean'||!['Chosen','Forced'].includes(x.movement)||typeof x.permitted!=='boolean')throw Error('eligibility input domain');
  return {...x};
 });
}
export const eligibilityInputValue=(x:EligibilityInput)=>list([text(x.setting),q(x.significance,4),q(x.pressure,4),x.instructed,text(x.movement),x.permitted]);
const eligibilityContextValue=(x:SafeEligibilityContext)=>list([text(x.setting),q(x.significance,4),q(x.pressure,4),x.instructed,text(x.movement)]);
function safeContext(x:EligibilityInput):SafeEligibilityContext{return {setting:x.setting,significance:x.significance,pressure:x.pressure,instructed:x.instructed,movement:x.movement};}
const clone=(v:CanonicalValue)=>decode(enc(v));
const fraction=(v:CanonicalValue)=>{const n=readQ(v);return `${n.numerator}/${n.denominator}`;};
/** Private numeric adapter. These rows are never offered as task qualification provenance. */
function foldRows(journal:readonly CanonicalValue[]){return journal.map(v=>{
 const x=items(v,'list'),expression=items(x[2],'list'),resolution=rec(f(rec(expression[1],425n),2n),409n);
 return r(413,[typedIdentifier(1138,u(uint(x[0]))),f(resolution,1n),signed(uint(x[0])),x[4]]);
});}
function strength(journal:readonly CanonicalValue[]){return foldIdentityHistory(foldRows(journal),ONE).strength;}

async function decide(at:bigint,seed:number,x:SafeEligibilityContext,journal:readonly CanonicalValue[],law:EligibilityLaw){
 let ordinal=at*100n;const occ=(ns:number)=>typedIdentifier(ns,u(ordinal++));
 const original=rec(bioContext(at,occ),398n),motive=rec(f(original,2n),394n);
 const context=x.setting==='Work'?original:r(398,[f(original,1n),r(394,[f(motive,1n),f(motive,2n),list(TASKS.map((t,i)=>r(393,[t,q(i?1:3,4)])))]),f(original,3n)]);
 const h=r(414,[list(foldRows(journal))]),base=rec(rawSignalOutput(occ(1133),context,true,ONE,()=>h).output,403n);
 const signals=items(f(base,3n),'set').filter(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))!==3n),s=law==='NoFeedback'?ZERO:strength(journal);
 if(!s.equals(ZERO)){
  const old=items(f(base,3n),'set').find(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))===3n)!;
  for(let i=0;i<2;i++)signals.push(r(402,[r(401,[OPTIONS[i],TASKS[i],u(3)]),qValue(i?ZERO.subtract(s):s),f(rec(old,402n),3n)]));
 }
 const raw=r(403,[f(base,1n),context,set(signals),f(base,4n)]),modifier=r(439,[q(1,at===5n?16:1),u(3)]),dice=r(437,[r(438,[q(1,10),q(1,5),q(3,5),q(4,5),q(9,10)]),q(0,1),modifier,modifier]);
 const reason=r(408,[occ(1134),raw,list(compileReasonNuclei(items(f(rec(raw,403n),3n),'set'),dice))]),root=typedIdentifier(1135,u(at));
 const session=createCognitiveRandomSession(new Uint8Array(32).fill(at===5n?255:seed));session.begin();let resolution:CanonicalValue;
 try{resolution=await arbitrationOutput(root,at,reason,r(440,[q(1,2),q(1,2)]),session.forResolution(root,reason));session.prepareCommit();session.commit();}finally{session.close();}
 const intent=intentOutput(occ(1136),resolution!),chosen=chosenData(resolution!),meaning=f(rec(raw,403n),4n);
 if(typeof meaning==='boolean'||meaning.kind!=='map')throw Error('eligibility meaning map');
 const alignment=choiceAlignment(f(chosen,1n),new Map(meaning.entries.map(([k,v])=>[key(k),readQ(v)])));
 const expression=list([u(at),intent,qValue(alignment),eligibilityContextValue(x)]);
 return {bundle:list([context,raw,reason,resolution!,intent,expression,list(session.committedAddressKeys().map(text))]),expression,intent};
}
/** World execution receives intent and permission, never returns context to qualification. */
function execute(at:bigint,intent:CanonicalValue,permitted:boolean){
 const chosen=chosenData(f(rec(intent,425n),2n)),count=key(f(chosen,1n))===key(OPTIONS[0])?1:2;
 const occurrence=(ns:number)=>typedIdentifier(ns,u(at));
 const plan=planOutput(occurrence(1139),intent,r(391,[u(count)])),attempt=attemptOutput(occurrence(1140),plan);
 return f(rec(executionOutput(occurrence(1141),attempt,permitted),433n),3n);
}
function qualify(at:bigint,x:SafeEligibilityContext,expression:CanonicalValue,law:EligibilityLaw){
 const e=items(expression,'list'),chosen=chosenData(f(rec(e[1],425n),2n)),alignment=readQ(e[2]);
 let contribution=readQ(f(chosen,7n)).multiply(alignment),status='Accepted';
 if(law==='Frequency')contribution=key(f(chosen,1n))===key(OPTIONS[0])?ONE:ZERO.subtract(ONE);
 else if(law==='Graded')contribution=contribution.multiply(readQ(q(x.significance,4))).multiply(ONE.subtract(readQ(q(x.pressure,4))));
 else if(x.significance<2){status='Insignificant';contribution=ZERO;}
 else if(law!=='IgnorePressure'&&x.pressure>=2){status='Constrained';contribution=ZERO;}
 if(contribution.equals(ZERO)&&status==='Accepted')status='ZeroContribution';
 return list([u(at),eligibilityContextValue(x),expression,text(status),qValue(contribution)]);
}
export function createEligibilityRun(law:EligibilityLaw,seed:number,input:readonly EligibilityInput[]){
 if(!ELIGIBILITY_LAWS.includes(law)||!Number.isInteger(seed)||seed<0||seed>255)throw Error('eligibility model/seed');
 const original=checked(input);if(original[4].movement!=='Chosen')throw Error('eligibility probe requires choice');
 const inputs=list(original.map(eligibilityInputValue));let at=0,journal:CanonicalValue[]=[],log:CanonicalValue[]=[],busy=false;
 const save=()=>enc(list([text(ELIGIBILITY_VERSION),text(law),u(seed),inputs,u(at),list(journal),list(log)]));
 return Object.freeze({
  async step(failBeforeCommit=false){if(busy)throw Error('eligibility concurrent');if(at===5)return false;busy=true;
   try{
    const next=at+1,x=original[at],prior=law==='Refold'?log.flatMap(v=>{const row=items(v,'list'),qs=items(row[3],'list');return qs.length&&!readQ(qs[4]).equals(ZERO)?[row[3]]:[];}):journal;
    const safe=safeContext(x),d=safe.movement==='Chosen'?await decide(BigInt(next),seed,safe,prior,law):undefined;
    const qualification=d&&next<5?qualify(BigInt(next),safe,d.expression,law):list([]),qs=items(qualification,'list');
    const nextJournal=qs.length&&!readQ(qs[4]).equals(ZERO)?[...prior,qualification]:prior;
    const row=list([u(next),eligibilityInputValue(x),d?.bundle??list([]),qualification,d?execute(BigInt(next),d.intent,x.permitted):u(1),list(nextJournal),qValue(strength(nextJournal))]);
    decode(enc(row));if(failBeforeCommit)throw Error('eligibility injected before commit');
    at=next;journal=nextJournal;log=[...log,row];return true;
   }finally{busy=false;}
  },
  save:()=>save().slice(),snapshot:()=>clone(list([list(journal),list(log)])),
 });
}
export async function restoreEligibilityRun(law:EligibilityLaw,seed:number,input:readonly EligibilityInput[],saved:Uint8Array){
 const copy=saved.slice(),v=items(decode(copy),'list');if(v.length!==7)throw Error('eligibility snapshot shape');const count=uint(v[4]);if(count>5n)throw Error('eligibility prefix');
 const run=createEligibilityRun(law,seed,input);for(let i=0n;i<count;i++)await run.step();if(key(decode(run.save()))!==key(decode(copy)))throw Error('eligibility original/prefix mismatch');return run;
}
export function eligibilitySummary(row:CanonicalValue){
 const x=items(row,'list'),bundle=items(x[2],'list'),qs=items(x[3],'list'),data=bundle.length?chosenData(bundle[3]):undefined;
 return {at:Number(uint(x[0])),input:key(x[1]),context:bundle.length?key(bundle[0]):null,raw:bundle.length?key(bundle[1]):null,resolution:bundle.length?key(bundle[3]):null,expression:bundle.length?key(bundle[5]):null,
  chosen:data?(key(f(data,1n))===key(OPTIONS[0])?'A':'B'):null,authorship:data?fraction(f(data,7n)):null,
  probabilities:data?items(f(data,2n),'list').map(v=>fraction(f(rec(v,421n),2n))):[],
  addresses:bundle.length?items(bundle[6],'list').map(v=>(v as {value:string}).value):[],
  disposition:qs.length?(qs[3] as {value:string}).value:'NoQualification',contribution:qs.length?fraction(qs[4]):'0/1',executed:Number(uint(x[4])),journal:key(x[5]),strength:fraction(x[6])};
}
