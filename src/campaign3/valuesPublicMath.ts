import {list,set,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ZERO,readQ,qValue,compileReasonNuclei} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {arbitrationOutput,createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {chosenData} from '../campaign2/cognitiveChoice';
import {receivingRecord as old} from './receivingCodecs';
import {identityPublicRecord} from './identityPublicCodecs';
import {taskReasons} from './identityPublicMath';
import {contextValue} from './identityPublicModel';
import {OPTIONS,TASKS} from './longitudinalModel';
import {valuesPublicRecord as r} from './valuesPublicCodecs';
import {probeData,projectionData} from './valuesPublicModel';
export function valuesNativeReasons(probe:CanonicalValue,projection:CanonicalValue){
 const x=probeData(probe),view=projectionData(projection),parse=(s:string)=>{const [n,d]=s.split('/').map(BigInt);return Q.of(n,d);},preference=x.linked?parse(view.preference):ZERO,need=x.linked&&view.mean!==null?parse(view.mean).multiply(parse(view.weight)).multiply(Q.of(BigInt(x.currentNeed))):ZERO,abs=(q:Q)=>q.compare(ZERO)<0?ZERO.subtract(q):q,effective=x.mode==='NeedOnly'?need:x.mode==='Joint'&&abs(need).compare(abs(preference))>0?need:preference;
 const occ=(ns:number,offset=0)=>typedIdentifier(ns,u(x.instant*100+offset)),ctx=contextValue({setting:'Work',significance:0,pressure:0,instructed:false,movement:'Chosen',permitted:true},false),base=rec(taskReasons(BigInt(x.instant),ctx,identityPublicRecord(1435,[list([])]),'NoFeedback',occ(1155)),1430n),raw=rec(f(base,4n),403n);
 const signals=[effective,Q.of(BigInt(x.goal),4n)].map((strength,i)=>old(402,[old(401,[OPTIONS[i],TASKS[i],u(1)]),qValue(strength),old(400,[{kind:'map',entries:[]}])]));
 const signal=old(403,[f(raw,1n),f(raw,2n),set(signals),f(raw,4n)]),modifier=old(439,[q(1,1),u(3)]),dice=old(437,[old(438,[q(1,10),q(1,5),q(3,5),q(4,5),q(9,10)]),q(0,1),modifier,modifier]);
 return r(1519,[probe,projection,old(408,[occ(1134,4),signal,list(compileReasonNuclei(signals,dice))])]);
}
export async function valuesNativeChoice(operands:CanonicalValue){const x=rec(operands,1519n),probe=probeData(f(x,1n)),reason=f(x,3n),root=typedIdentifier(1135,u(probe.instant)),session=createCognitiveRandomSession(new Uint8Array(32).fill(probe.seed));session.begin();let resolution:CanonicalValue;
 try{resolution=await arbitrationOutput(root,BigInt(probe.instant),reason,old(440,[q(1,2),q(1,2)]),session.forResolution(root,reason));session.prepareCommit();session.commit();}finally{session.close();}
 return {output:r(1515,[operands,resolution!]),addresses:session.committedAddressKeys()};}
export function valuesPublicRows(outputs:readonly CanonicalValue[]){return outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1515n).map(v=>{const x=rec(v,1515n),operand=rec(f(x,1n),1519n),resolution=f(x,2n),variant=uint(f(rec(f(rec(resolution,409n),4n),419n),1n)),chosen=variant===3n?chosenData(resolution):null;return {probe:probeData(f(operand,1n)),view:projectionData(f(operand,2n)),reason:f(operand,3n),resolution,status:variant===3n?'Chosen':variant===1n?'NoCandidates':'NoReasons',chosen:chosen?(key(f(chosen,1n))===key(OPTIONS[0])?'A':'B'):null,probabilities:chosen?items(f(chosen,2n),'list').map(v=>{const p=readQ(f(rec(v,421n),2n));return `${p.numerator}/${p.denominator}`;}):[]};});}
