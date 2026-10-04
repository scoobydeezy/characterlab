/** Controlled component receiver for values-component/0.2-candidate; not public admission. */
import {list,set,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ZERO,readQ,qValue,compileReasonNuclei} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {arbitrationOutput,createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {chosenData} from '../campaign2/cognitiveChoice';
import {receivingRecord as r} from './receivingCodecs';
import {identityPublicRecord} from './identityPublicCodecs';
import {taskReasons} from './identityPublicMath';
import {contextValue} from './identityPublicModel';
import {OPTIONS,TASKS} from './longitudinalModel';
import {createValuesOwner} from './valuesComponent';
export interface ValuesProbe {instant:number;seed:number;currentNeed:0|1;goal:0|1;linked:boolean;mode:'ValuesOnly'|'NeedOnly'|'Joint';}
export async function receiveValues(owner:ReturnType<typeof createValuesOwner>,input:ValuesProbe){
 const ds=Object.getOwnPropertyDescriptors(input),names=['instant','seed','currentNeed','goal','linked','mode'];
 if(Object.getPrototypeOf(input)!==Object.prototype||Reflect.ownKeys(ds).length!==names.length||names.some(k=>!ds[k]||!('value'in ds[k])))throw Error('VALUES_PROBE_FIELDS');
 const x={...input};if(!Number.isInteger(x.instant)||x.instant<1||x.instant>65||!Number.isInteger(x.seed)||x.seed<0||x.seed>255||![0,1].includes(x.currentNeed)||![0,1].includes(x.goal)||typeof x.linked!=='boolean'||!['ValuesOnly','NeedOnly','Joint'].includes(x.mode))throw Error('VALUES_PROBE_INPUT');
 const view=owner.view(x.instant),parse=(s:string)=>{const [n,d]=s.split('/').map(BigInt);return Q.of(n,d);},preference=x.linked?parse(view.preference):ZERO;
 const need=x.linked&&view.mean!==null?parse(view.mean).multiply(parse(view.weight)).multiply(Q.of(BigInt(x.currentNeed))):ZERO;
 // Need and Value read the SAME evidence-derived preference. Joint uses one
 // contribution, never their sum; this bounded overlap rule is explicitly tested.
 const abs=(q:Q)=>q.compare(ZERO)<0?ZERO.subtract(q):q;
 const effective=x.mode==='NeedOnly'?need:x.mode==='Joint'&&abs(need).compare(abs(preference))>0?need:preference;
 const occ=(ns:number,offset=0)=>typedIdentifier(ns,u(x.instant*100+offset));
 const ctx=contextValue({setting:'Work',significance:0,pressure:0,instructed:false,movement:'Chosen',permitted:true},false);
 const base=rec(taskReasons(BigInt(x.instant),ctx,identityPublicRecord(1435,[list([])]),'NoFeedback',occ(1155)),1430n),raw=rec(f(base,4n),403n);
 // Reuse the two-option Task carrier only. No inherited identity/modifier signal
 // or authored Task strength is consumed; both Base operands are replaced below.
 const signals=[effective,Q.of(BigInt(x.goal),4n)].map((strength,i)=>r(402,[r(401,[OPTIONS[i],TASKS[i],u(1)]),qValue(strength),r(400,[{kind:'map',entries:[]}])]));
 const signal=r(403,[f(raw,1n),f(raw,2n),set(signals),f(raw,4n)]),modifier=r(439,[q(1,1),u(3)]),dice=r(437,[r(438,[q(1,10),q(1,5),q(3,5),q(4,5),q(9,10)]),q(0,1),modifier,modifier]);
 const reason=r(408,[occ(1134,4),signal,list(compileReasonNuclei(signals,dice))]),root=typedIdentifier(1135,u(x.instant)),session=createCognitiveRandomSession(new Uint8Array(32).fill(x.seed));
 session.begin();let resolution:CanonicalValue;
 try{resolution=await arbitrationOutput(root,BigInt(x.instant),reason,r(440,[q(1,2),q(1,2)]),session.forResolution(root,reason));session.prepareCommit();session.commit();}finally{session.close();}
 const variant=uint(f(rec(f(rec(resolution!,409n),4n),419n),1n)),chosen=variant===3n?chosenData(resolution!):null;
 return {status:variant===3n?'Chosen':variant===1n?'NoCandidates':'NoReasons',view,contribution:`${effective.numerator}/${effective.denominator}`,reason,resolution:resolution!,chosen:chosen?(key(f(chosen,1n))===key(OPTIONS[0])?'A':'B'):null,probabilities:chosen?items(f(chosen,2n),'list').map(v=>{const p=readQ(f(rec(v,421n),2n));return `${p.numerator}/${p.denominator}`;}):[],addresses:session.committedAddressKeys()};
}
