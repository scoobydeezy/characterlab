/** prior-concern-feedback-component/0.1-candidate; trusted completed producer boundary. */
import {canonicalEncode,cloneCanonicalValue,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeCognitive} from '../campaign2/cognitiveCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as u,dataKey as key} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
type Base={readonly subject:CanonicalValue;readonly sourceAt:bigint};
export type PriorConcernCarry=(Base&{readonly kind:'NoSelectedTask'})|(Base&{readonly kind:'Concern';readonly concern:CanonicalValue;readonly response:CanonicalValue});
const fail=(why:string):never=>{throw Error('PRIOR_CONCERN_'+why);};
const instant=(t:bigint)=>{if(typeof t!=='bigint'||t<0n)fail('TIME');};
export function projectPriorConcern(output:CanonicalValue,sourceAt:bigint):PriorConcernCarry{
 instant(sourceAt);const c=rec(decodeCognitive(canonicalEncode(output)),388n),a=rec(f(c,2n),384n),w=rec(f(a,2n),381n);
 const tasks=items(f(w,4n),'list'),assessments=items(f(a,3n),'list'),responses=items(f(c,3n),'list');
 if(tasks.length>1||assessments.length!==tasks.length||responses.length!==tasks.length)fail('SINGLE_TASK');
 const subject=cloneCanonicalValue(f(w,2n));
 if(!tasks.length)return {kind:'NoSelectedTask',subject,sourceAt};
 const task=f(rec(tasks[0],379n),1n);
 if(key(f(rec(task,371n),1n))!==key(subject)||key(f(rec(assessments[0],383n),1n))!==key(task)||key(f(rec(responses[0],387n),1n))!==key(task))fail('TASK_BINDING');
 const response=f(rec(responses[0],387n),2n);responseValue(response);
 return {kind:'Concern',subject,sourceAt,concern:cloneCanonicalValue(f(c,1n)),response:cloneCanonicalValue(response)};
}
function responseValue(value:CanonicalValue){
 const r=rec(decodeCognitive(canonicalEncode(value)),386n),tag=u(f(r,1n));
 if(tag===1n)return undefined;
 if(tag!==2n)fail('RESPONSE');const q=readQ(f(r,2n));if(q.compare(Q.of(0n))<0||q.compare(Q.of(1n))>0)fail('INTENSITY');return q;
}
export function modulatePriorConcern(carry:PriorConcernCarry,subject:CanonicalValue,at:bigint,residual:Q,enabled:boolean){
 instant(at);instant(carry.sourceAt);if(carry.sourceAt>=at)fail('FUTURE_OR_CURRENT');if(key(carry.subject)!==key(subject))fail('SUBJECT');
 if(!(residual instanceof Q)||residual.compare(Q.of(0n))<0||residual.compare(Q.of(1n))>0||typeof enabled!=='boolean')fail('CALIBRATION');
 const q=carry.kind==='Concern'?responseValue(carry.response):carry.kind==='NoSelectedTask'?undefined:fail('CARRY');
 const sourceStatus=carry.kind==='NoSelectedTask'?'NoSelectedTask':q===undefined?'Unavailable':'KnownIntensity';
 const active=enabled&&q!==undefined;
 return {sourceStatus,branch:active?'EnabledKnown' as const:enabled?'BaselineWithoutAvailableFeedback' as const:'DisabledFeedback' as const,residualPool:active?residual.multiply(Q.of(1n).subtract(q!)):Q.of(residual.numerator,residual.denominator),omegaA:active?Q.of(1n).add(q!):Q.of(1n)};
}
