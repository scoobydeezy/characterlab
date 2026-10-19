/** identity-public/0.1-candidate: pure safe operands and source-specific adapters. */
import {list,set,map,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q,roundEven} from '../substrate/exactMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,ZERO,readQ,qValue,foldIdentityHistory,compileReasonNuclei,choiceAlignment} from '../campaign2/cognitiveMath';
import {rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {arbitrationOutput,createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {chosenData,intentOutput} from '../campaign2/cognitiveChoice';
import {receivingRecord as old} from './receivingCodecs';
import {identityPublicRecord as r} from './identityPublicCodecs';
import {data,value} from './biologyPublicData';
import {biologyPublicRecord as bio} from './biologyPublicCodecs';
import {bioContext} from './bioComparison';
import {ACTOR as TASK_ACTOR,OPTIONS,TASKS} from './longitudinalModel';
import {ACTOR as BIO_ACTOR} from './biologyPublicModel';
import type {EligibilityLaw} from './identityEligibility';
import type {Ground} from './biologicalChoice';
export const qualifications=(journal:CanonicalValue)=>items(f(rec(journal,1435n),1n),'list');
export function numericRows(journal:CanonicalValue){return qualifications(journal).map(v=>{const x=rec(v,1434n),e=rec(f(x,2n),1433n),at=uint(f(e,8n));return old(413,[f(x,1n),typedIdentifier(1135,u(at)),signed(at),f(x,4n)]);});}
export const identityFold=(journal:CanonicalValue)=>foldIdentityHistory(numericRows(journal),ONE);
export function appendQualification(journal:CanonicalValue,qualification:CanonicalValue){
 const xs=qualifications(journal),x=rec(qualification,1434n),e=rec(f(x,2n),1433n),at=uint(f(e,8n));
 if(key(f(x,1n))!==key(typedIdentifier(1138,u(at))))throw Error('IDENTITY_QUALIFICATION_COORDINATE');
 if(uint(f(x,3n))!==1n)return journal;if(readQ(f(x,4n)).equals(ZERO))throw Error('IDENTITY_ZERO_ACCEPTED');
 if(xs.length>=96||xs.some(v=>key(f(rec(v,1434n),1n))===key(f(x,1n))||key(f(rec(f(rec(v,1434n),2n),1433n),1n))===key(f(e,1n)))||xs.length&&uint(f(rec(f(rec(xs.at(-1)!,1434n),2n),1433n),8n))>=at)throw Error('IDENTITY_HISTORY_ORDER');
 const next=r(1435,[list([...xs,qualification])]);identityFold(next);return next;
}
export function refoldJournal(journal:CanonicalValue){let next:CanonicalValue=r(1435,[list([])]);for(const qualification of qualifications(journal))next=appendQualification(next,qualification);return next;}
export function taskReasons(at:bigint,ctx:CanonicalValue,journal:CanonicalValue,law:EligibilityLaw,occurrence:CanonicalValue){
 let ordinal=at*100n;const occ=(ns:number)=>typedIdentifier(ns,u(ordinal++));
 const original=rec(bioContext(at,occ),398n),motive=rec(f(original,2n),394n),c=rec(ctx,1429n);
 const context=uint(f(c,1n))===1n?original:old(398,[f(original,1n),old(394,[f(motive,1n),f(motive,2n),list(TASKS.map((t,i)=>old(393,[t,q(i?1:3,4)])))]),f(original,3n)]);
 const h=old(414,[list(numericRows(journal))]),base=rec(rawSignalOutput(occ(1133),context,true,ONE,()=>h).output,403n),signals=items(f(base,3n),'set').filter(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))!==3n),s=law==='NoFeedback'?ZERO:identityFold(journal).strength;
 if(!s.equals(ZERO)){const prior=items(f(base,3n),'set').find(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))===3n)!;for(let i=0;i<2;i++)signals.push(old(402,[old(401,[OPTIONS[i],TASKS[i],u(3)]),qValue(i?ZERO.subtract(s):s),f(rec(prior,402n),3n)]));}
 const raw=old(403,[f(base,1n),context,set(signals),f(base,4n)]),modifier=old(439,[q(1,at===5n?16:1),u(3)]),dice=old(437,[old(438,[q(1,10),q(1,5),q(3,5),q(4,5),q(9,10)]),q(0,1),modifier,modifier]);
 const reasons=old(408,[occ(1134),raw,list(compileReasonNuclei(items(f(rec(raw,403n),3n),'set'),dice))]);
 return r(1430,[occurrence,ctx,context,raw,reasons]);
}
export async function taskDecision(at:bigint,seed:number,reasons:CanonicalValue,occurrence:CanonicalValue){
 const reason=f(rec(reasons,1430n),5n),root=typedIdentifier(1135,u(at)),session=createCognitiveRandomSession(new Uint8Array(32).fill(at===5n?255:seed));session.begin();let resolution:CanonicalValue;
 try{resolution=await arbitrationOutput(root,at,reason,old(440,[q(1,2),q(1,2)]),session.forResolution(root,reason));session.prepareCommit();session.commit();}finally{session.close();}
 return {output:r(1431,[occurrence,reasons,resolution!]),addresses:session.committedAddressKeys()};
}
export function taskIntent(decision:CanonicalValue,occurrence:CanonicalValue){const d=rec(decision,1431n),resolution=rec(f(d,3n),409n),at=uint({kind:'unsigned',value:(f(resolution,2n) as {value:bigint}).value});
 // Numerical occurrence coordinate retains the component's context/reason allocation.
 const oldReason=rec(f(resolution,3n),408n),id=f(oldReason,1n) as {payload:{value:bigint}};
 return r(1432,[occurrence,decision,intentOutput(typedIdentifier(1136,u(id.payload.value+1n)),resolution)]);
}
function taskAlignment(intent:CanonicalValue){const i=rec(intent,1432n),resolution=f(rec(f(i,3n),425n),2n),d=chosenData(resolution),raw=rec(f(rec(f(rec(resolution,409n),3n),408n),2n),403n),meaning=f(raw,4n);if(typeof meaning==='boolean'||meaning.kind!=='map')throw Error('IDENTITY_TASK_MEANING');return choiceAlignment(f(d,1n),new Map(meaning.entries.map(([k,v])=>[key(k),readQ(v)])));}
export function expressionTask(at:bigint,intent:CanonicalValue,ctx:CanonicalValue,occurrence:CanonicalValue){const i=rec(intent,1432n),d=chosenData(f(rec(f(i,3n),425n),2n));return r(1433,[occurrence,TASK_ACTOR,ctx,u(1),intent,qValue(taskAlignment(intent)),f(d,7n),u(at)]);}
export function biologicalFeedback(appraisal:CanonicalValue,journal:CanonicalValue,law:EligibilityLaw,occurrence:CanonicalValue,appraisalOccurrence:CanonicalValue){
 const a=rec(appraisal,1411n),ap=value<{grounds:Ground[]}>(f(a,3n)),standing=law==='NoFeedback'?0:Number(roundEven(identityFold(journal).strength.numerator*1000n,identityFold(journal).strength.denominator));
 const grounds=ap.grounds.map(g=>['protection','protective-goal'].includes(g.domain)?{...g,standing}:g),next=bio(1411,[appraisalOccurrence,f(a,2n),data({...ap,grounds})]);
 return {appraisal:next,feedback:r(1442,[occurrence,appraisal,journal,data(grounds)])};
}
export function expressionBiology(at:bigint,producer:CanonicalValue,ctx:CanonicalValue,occurrence:CanonicalValue){
 const e=rec(producer,1416n),decision=rec(f(rec(f(e,2n),1415n),2n),1414n),ap=value<{options:string[];grounds:Ground[]}>(f(rec(f(decision,2n),1411n),3n)),choice=value<{chosen:string|null;authorship:string}>(f(decision,4n));
 const meanings=new Map(ap.options.map(option=>[option,ap.grounds.filter(g=>g.option===option&&['protection','protective-goal'].includes(g.domain)).reduce((sum,g)=>sum.add(Q.of(BigInt(g.strength),1000n)),ZERO)]));
 const own=choice.chosen?meanings.get(choice.chosen)??ZERO:ZERO,delta=own.subtract([...meanings].filter(([o])=>o!==choice.chosen).reduce((s,[,v])=>s.add(v),ZERO)),alignment=choice.chosen?delta.divide(ONE.add(Q.of(delta.numerator<0n?-delta.numerator:delta.numerator,delta.denominator))):ZERO;
 const [n,d]=choice.authorship.split('/').map(BigInt);return r(1433,[occurrence,BIO_ACTOR,ctx,u(2),producer,qValue(alignment),q(n,d),u(at)]);
}
export function qualifyExpression(expression:CanonicalValue,law:EligibilityLaw,occurrence:CanonicalValue){
 const e=rec(expression,1433n),ctx=rec(f(e,3n),1429n),significance=readQ(f(ctx,2n)),pressure=readQ(f(ctx,3n)),alignment=readQ(f(e,6n));let contribution=alignment.multiply(readQ(f(e,7n))),status=1;
 let eligible=true;if(uint(f(e,4n))===2n){const d=rec(f(rec(f(rec(f(e,5n),1416n),2n),1415n),2n),1414n),ap=value<{grounds:Ground[]}>(f(rec(f(d,2n),1411n),3n));eligible=ap.grounds.some(g=>g.strength!==0&&['protection','protective-goal'].includes(g.domain));}
 if(f(ctx,6n)!==true){status=6;contribution=ZERO;}
 else if(!eligible){status=5;contribution=ZERO;}
 else if(law==='Frequency')contribution=alignment.compare(ZERO)>0?ONE:alignment.compare(ZERO)<0?ZERO.subtract(ONE):ZERO;
 else if(law==='Graded')contribution=contribution.multiply(significance).multiply(ONE.subtract(pressure));
 else if(significance.compare(Q.of(1n,2n))<0){status=2;contribution=ZERO;}
 else if(law!=='IgnorePressure'&&pressure.compare(Q.of(1n,2n))>=0){status=3;contribution=ZERO;}
 if(contribution.equals(ZERO)&&status===1)status=4;return r(1434,[occurrence,expression,u(status),qValue(contribution)]);
}
