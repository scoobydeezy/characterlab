/** disposition-adaptation/0.1-candidate. Research component, not native admission. */
import {canonicalEncode as enc,canonicalDecode,RecordSchemaRegistry,list,set,text,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,ZERO,readQ,qValue,compileReasonNuclei,absolute} from '../campaign2/cognitiveMath';
import {arbitrationOutput,createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {chosenData,planOutput,attemptOutput,executionOutput} from '../campaign2/cognitiveChoice';
import {receivingRecord as old} from './receivingCodecs';
import {identityPublicRecord as r,identityPublicSupportedSchemas} from './identityPublicCodecs';
import {taskReasons,taskIntent,expressionTask,qualifyExpression,appendQualification,identityFold,qualifications} from './identityPublicMath';
import {contextValue} from './identityPublicModel';
import {OPTIONS,TASKS} from './longitudinalModel';
import {data,value} from './biologyPublicData';
export const DISPOSITION_VERSION='disposition-adaptation/0.1-candidate';
export const DISPOSITION_LAWS=['Plastic','Leaky','Refold','StandingOnly','Neither','JointMax','JointAdd'] as const;
export type DispositionLaw=typeof DISPOSITION_LAWS[number];
export interface DispositionFrame {stage:'Learn'|'Probe'|'Gap';setting:'Work'|'Home';significance:0|4;pressure:0|4;active:boolean;permitted:boolean;seed:number;}
export interface DispositionProfile {law:DispositionLaw;constitution:-1|0|1;}
// Producers refine every record on construction. Copy/restore parsing is structural;
// restore installs nothing and authenticates the whole snapshot by fresh replay.
const structuralRegistry=new RecordSchemaRegistry(identityPublicSupportedSchemas());
const decode=(bytes:Uint8Array)=>canonicalDecode(bytes,structuralRegistry);
const fraction=(n:Q)=>`${n.numerator}/${n.denominator}`,clone=(v:CanonicalValue)=>decode(enc(v));
function fields(x:unknown,names:string[]){if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('DISPOSITION_FIELDS');const ds=Object.getOwnPropertyDescriptors(x);if(Reflect.ownKeys(ds).length!==names.length||names.some(n=>!ds[n]||!('value'in ds[n])))throw Error('DISPOSITION_FIELDS');}
export function checkedDisposition(profile:DispositionProfile,frames:readonly DispositionFrame[]){
 fields(profile,['law','constitution']);if(!DISPOSITION_LAWS.includes(profile.law)||![-1,0,1].includes(profile.constitution))throw Error('DISPOSITION_PROFILE');
 if(!Array.isArray(frames)||frames.length!==18||Reflect.ownKeys(frames).length!==19)throw Error('DISPOSITION_HORIZON');
 const expected=['Learn','Learn','Learn','Learn','Probe','Gap','Probe','Learn','Learn','Learn','Learn','Probe','Learn','Learn','Learn','Learn','Probe','Probe'];
 const copy=Array.from({length:18},(_,i)=>{const d=Object.getOwnPropertyDescriptor(frames,String(i));if(!d||!('value'in d))throw Error('DISPOSITION_ARRAY');const x=d.value as DispositionFrame;fields(x,['stage','setting','significance','pressure','active','permitted','seed']);if(x.stage!==expected[i]||!['Work','Home'].includes(x.setting)||![0,4].includes(x.significance)||![0,4].includes(x.pressure)||typeof x.active!=='boolean'||typeof x.permitted!=='boolean'||!Number.isInteger(x.seed)||x.seed<0||x.seed>255||x.stage==='Gap'&&x.active)throw Error('DISPOSITION_INPUT');return {...x};});return {profile:{...profile},frames:copy};
}
const adapting=(law:DispositionLaw)=>!['StandingOnly','Neither'].includes(law);
function update(prior:Q,batch:readonly CanonicalValue[],law:DispositionLaw){
 if(!adapting(law))return ZERO;const sum=batch.reduce((s,v)=>s.add(readQ(f(rec(v,1434n),4n))),ZERO),sign=BigInt(sum.compare(ZERO));
 if(law==='Leaky')return prior.add(Q.of(sign,4n)).divide(Q.of(2n));
 const next=prior.add(Q.of(sign,8n)),cap=Q.of(1n,4n);return next.compare(cap)>0?cap:next.compare(ZERO.subtract(cap))<0?ZERO.subtract(cap):next;
}
export function deriveDisposition(journal:CanonicalValue,law:DispositionLaw){let a=ZERO;const xs=qualifications(journal);for(let i=0;i+4<=xs.length;i+=4)a=update(a,xs.slice(i,i+4),law);return a;}
function acquiredFeedback(a:Q,h:Q,law:DispositionLaw){if(law==='StandingOnly')return h;if(law==='Neither')return ZERO;if(law==='JointAdd')return a.add(h);if(law==='JointMax')return absolute(a).compare(absolute(h))>0?a:h;return a;}
/** Safe producer operands omit physical permission and any diagnostic log. */
export async function dispositionDecision(at:number,seed:number,context:CanonicalValue,journal:CanonicalValue,profile:DispositionProfile,a:Q,learning:boolean){
 const occ=(ns:number,offset=0)=>typedIdentifier(ns,u(at*100+offset)),base=rec(taskReasons(BigInt(at),context,journal,'NoFeedback',occ(1155)),1430n),raw=rec(f(base,4n),403n),feedback=Q.of(BigInt(profile.constitution),8n).add(acquiredFeedback(a,identityFold(journal).strength,profile.law));
 const signals=items(f(raw,3n),'set').filter(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))!==3n);
 if(!feedback.equals(ZERO))for(let i=0;i<2;i++)signals.push(old(402,[old(401,[OPTIONS[i],TASKS[i],u(3)]),qValue(i?ZERO.subtract(feedback):feedback),old(400,[{kind:'map',entries:[]}])]));
 const signal=old(403,[f(raw,1n),f(raw,2n),set(signals),f(raw,4n)]),modifier=old(439,[q(1,learning?1:16),u(3)]),dice=old(437,[old(438,[q(1,10),q(1,5),q(3,5),q(4,5),q(9,10)]),q(0,1),modifier,modifier]);
 const reason=old(408,[occ(1134,4),signal,list(compileReasonNuclei(items(f(rec(signal,403n),3n),'set'),dice))]),reasons=r(1430,[occ(1155,1),context,f(base,3n),signal,reason]);
 const root=typedIdentifier(1135,u(at)),session=createCognitiveRandomSession(new Uint8Array(32).fill(seed));session.begin();let resolution:CanonicalValue;
 try{resolution=await arbitrationOutput(root,BigInt(at),reason,old(440,[q(1,2),q(1,2)]),session.forResolution(root,reason));session.prepareCommit();session.commit();}finally{session.close();}
 const decision=r(1431,[occ(1155,2),reasons,resolution!]),intent=taskIntent(decision,occ(1155,3)),expression=expressionTask(BigInt(at),intent,context,occ(1155,4)),qualification=qualifyExpression(expression,'Threshold',typedIdentifier(1138,u(at)));
 return {reasons,decision,intent,expression,qualification,feedback,addresses:session.committedAddressKeys()};
}
function execute(at:number,intent:CanonicalValue,permitted:boolean){const inherited=f(rec(intent,1432n),3n),chosen=chosenData(f(rec(inherited,425n),2n)),count=key(f(chosen,1n))===key(OPTIONS[0])?1:2,plan=planOutput(typedIdentifier(1139,u(at)),inherited,old(391,[u(count)])),attempt=attemptOutput(typedIdentifier(1140,u(at)),plan);return executionOutput(typedIdentifier(1141,u(at)),attempt,permitted);}
export function createDispositionRun(model:DispositionProfile,originals:readonly DispositionFrame[]){
 const {profile,frames}=checkedDisposition(model,originals),commitment=data({version:DISPOSITION_VERSION,profile,frames});let at=0,busy=false,journal:CanonicalValue=r(1435,[list([])]),stored=ZERO,log:CanonicalValue[]=[];
 const plastic=()=>profile.law==='Refold'?deriveDisposition(journal,'Plastic'):stored;
 const encode=()=>enc(list([commitment,u(at),journal,profile.law==='Refold'?list([]):list([qValue(stored)]),list(log)]));
 const ready=()=>{if(busy)throw Error('DISPOSITION_NOT_QUIESCENT');};
 return Object.freeze({
  async step(failBeforeCommit=false){ready();if(at===18)return false;busy=true;try{
   const next=at+1,x=frames[at],before=plastic(),context=contextValue({setting:x.setting,significance:x.significance,pressure:x.pressure,instructed:false,movement:'Chosen',permitted:true},x.stage==='Learn');
   const d=x.active?await dispositionDecision(next,x.seed,context,journal,profile,before,x.stage==='Learn'):undefined;
   const afterJournal=d?appendQualification(journal,d.qualification):journal,oldCount=qualifications(journal).length,count=qualifications(afterJournal).length;
   let after=before;if(count!==oldCount&&count%4===0)after=update(before,qualifications(afterJournal).slice(-4),profile.law);
   if(profile.law==='Refold')after=deriveDisposition(afterJournal,'Plastic');
   const row=list([u(next),data(x),d?list([d.reasons,d.decision,d.intent,d.expression,d.qualification,execute(next,d.intent,x.permitted)]):list([]),afterJournal,data({constitution:fraction(Q.of(BigInt(profile.constitution),8n)),before:fraction(before),after:fraction(after),effectiveBefore:fraction(Q.of(BigInt(profile.constitution),8n).add(before)),feedback:d?fraction(d.feedback):null,count}),list(d?.addresses.map(text)??[])]);clone(row);
   if(failBeforeCommit)throw Error('DISPOSITION_INJECTED');at=next;journal=afterJournal;stored=profile.law==='Refold'?ZERO:after;log=[...log,row];return true;
  }finally{busy=false;}},
  save(){ready();return encode().slice();},snapshot(){ready();return clone(list([u(at),journal,qValue(plastic()),list(log)]));},
 });
}
export async function restoreDispositionRun(profile:DispositionProfile,frames:readonly DispositionFrame[],saved:Uint8Array){const copy=saved.slice(),v=items(decode(copy),'list');if(v.length!==5)throw Error('DISPOSITION_SAVE');const count=uint(v[1]);if(count>18n)throw Error('DISPOSITION_PREFIX');const run=createDispositionRun(profile,frames);for(let i=0n;i<count;i++)await run.step();if(key(decode(run.save()))!==key(decode(copy)))throw Error('DISPOSITION_RESTORE');return run;}
export function dispositionRows(snapshot:CanonicalValue){return items(items(snapshot,'list')[3],'list').map(row=>{const xs=items(row,'list'),bundle=items(xs[2],'list'),choice=bundle.length?chosenData(f(rec(bundle[1],1431n),3n)):undefined,qs=bundle.length?rec(bundle[4],1434n):undefined;return {at:Number(uint(xs[0])),frame:value<DispositionFrame>(xs[1]),state:value<{constitution:string;before:string;after:string;effectiveBefore:string;feedback:string|null;count:number}>(xs[4]),chosen:choice?(key(f(choice,1n))===key(OPTIONS[0])?'A':'B'):null,probabilities:choice?items(f(choice,2n),'list').map(v=>fraction(readQ(f(rec(v,421n),2n)))):[],authorship:choice?fraction(readQ(f(choice,7n))):null,contribution:qs?fraction(readQ(f(qs,4n))):'0/1',strength:fraction(identityFold(xs[3]).strength),executed:bundle.length?Number(uint(f(rec(bundle[5],433n),3n))):0,expression:bundle.length?key(bundle[3]):null,journal:key(xs[3]),addresses:items(xs[5],'list').map(v=>(v as {value:string}).value)};});}
