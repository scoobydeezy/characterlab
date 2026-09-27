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
import type {DispositionLaw,DispositionProfile} from './dispositionAdaptation';
function acquiredFeedback(a:Q,h:Q,law:DispositionLaw){if(law==='StandingOnly')return h;if(law==='Neither')return ZERO;if(law==='JointAdd')return a.add(h);if(law==='JointMax')return absolute(a).compare(absolute(h))>0?a:h;return a;}
/** Safe producer operands omit physical permission and any diagnostic log. */
export function dispositionReasons(at:number,context:CanonicalValue,journal:CanonicalValue,profile:DispositionProfile,a:Q,learning:boolean){
 const occ=(ns:number,offset=0)=>typedIdentifier(ns,u(at*100+offset)),base=rec(taskReasons(BigInt(at),context,journal,'NoFeedback',occ(1155)),1430n),raw=rec(f(base,4n),403n),feedback=Q.of(BigInt(profile.constitution),8n).add(acquiredFeedback(a,identityFold(journal).strength,profile.law));
 const signals=items(f(raw,3n),'set').filter(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))!==3n);
 if(!feedback.equals(ZERO))for(let i=0;i<2;i++)signals.push(old(402,[old(401,[OPTIONS[i],TASKS[i],u(3)]),qValue(i?ZERO.subtract(feedback):feedback),old(400,[{kind:'map',entries:[]}])]));
 const signal=old(403,[f(raw,1n),f(raw,2n),set(signals),f(raw,4n)]),modifier=old(439,[q(1,learning?1:16),u(3)]),dice=old(437,[old(438,[q(1,10),q(1,5),q(3,5),q(4,5),q(9,10)]),q(0,1),modifier,modifier]);
 const reason=old(408,[occ(1134,4),signal,list(compileReasonNuclei(items(f(rec(signal,403n),3n),'set'),dice))]),reasons=r(1430,[occ(1155,1),context,f(base,3n),signal,reason]);
 return {reasons,feedback};
}
export async function dispositionArbitrate(at:number,seed:number,reasons:CanonicalValue){
 const reason=f(rec(reasons,1430n),5n),occ=(ns:number,offset=0)=>typedIdentifier(ns,u(at*100+offset));
 const root=typedIdentifier(1135,u(at)),session=createCognitiveRandomSession(new Uint8Array(32).fill(seed));session.begin();let resolution:CanonicalValue;
 try{resolution=await arbitrationOutput(root,BigInt(at),reason,old(440,[q(1,2),q(1,2)]),session.forResolution(root,reason));session.prepareCommit();session.commit();}finally{session.close();}
 return {decision:r(1431,[occ(1155,2),reasons,resolution!]),addresses:session.committedAddressKeys()};
}
