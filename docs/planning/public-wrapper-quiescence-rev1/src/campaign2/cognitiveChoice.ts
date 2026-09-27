/** task-decision-expression/0.1-candidate and task-identity-evidence/0.1-candidate.
 * Frozen choice meaning has no state or execution operand. */
import {list,unsigned as u,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {cognitiveRecord as r,cognitiveNamed as named} from './cognitiveCodecs';
import {choiceAlignment,readQ,qValue,ZERO} from './cognitiveMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataKey as key,invalidModel} from './canonicalData';

export function chosenData(resolution:CanonicalValue){const result=rec(f(rec(resolution,409n),4n),419n);if(uint(f(result,1n))!==3n)invalidModel('chosen resolution required');return rec(f(result,2n),420n);}
export function intentOutput(occurrence:CanonicalValue,resolution:CanonicalValue){chosenData(resolution);return r(425,[occurrence,resolution]);}
export function expressionOutput(occurrence:CanonicalValue,intent:CanonicalValue){
 const resolution=rec(f(rec(intent,425n),2n),409n),data=chosenData(resolution),raw=rec(f(rec(f(resolution,3n),408n),2n),403n),meaning=f(raw,4n);
 if(typeof meaning==='boolean'||meaning.kind!=='map')invalidModel('complete meaning map required');
 const semantic=new Map(meaning.entries.map(([candidate,value])=>[key(candidate),readQ(value)]));
 const touched=[...semantic.values()].some(q=>!q.equals(ZERO));
 const channels=touched?[r(427,[typedIdentifier(1041,text('CommitmentFidelity')),qValue(choiceAlignment(f(data,1n),semantic))])]:[];
 return r(426,[occurrence,intent,list(channels),r(428,[text('task-identity-evidence/0.1-candidate'),u(1),u(1),u(1)])]);
}
export function qualificationOutput(occurrence:CanonicalValue,expression:CanonicalValue){
 const e=rec(expression,426n),intent=rec(f(e,2n),425n),data=chosenData(f(intent,2n)),weight=readQ(f(data,7n)),channels=items(f(e,3n),'list');
 const alignment=channels.length?readQ(f(rec(channels[0],427n),2n)):ZERO;
 const result=weight.equals(ZERO)?named(430,{VariantTag:u(2),RejectionReason:u(1)}):alignment.equals(ZERO)?named(430,{VariantTag:u(2),RejectionReason:u(2)}):r(430,[u(1),qValue(weight),qValue(alignment.multiply(weight))]);
 return r(429,[occurrence,expression,result]);
}

/** bounded-protocol-execution/0.1-candidate. Selected definition only, no registry lookup. */
export function planOutput(occurrence:CanonicalValue,intent:CanonicalValue,selectedDefinition:CanonicalValue){
 chosenData(f(rec(intent,425n),2n));const count=uint(f(rec(selectedDefinition,391n),1n));if(count!==1n&&count!==2n)invalidModel('protocol count outside fixed action vocabulary');return r(431,[occurrence,intent,u(count)]);
}
export function attemptOutput(occurrence:CanonicalValue,plan:CanonicalValue){rec(plan,431n);return r(432,[occurrence,plan]);}
/** World adapter alone receives the permission operand. */
export function executionOutput(occurrence:CanonicalValue,attempt:CanonicalValue,permitted:boolean){
 const plan=rec(f(rec(attempt,432n),2n),431n),count=uint(f(plan,3n));if(count!==1n&&count!==2n)invalidModel('protocol request count');return r(433,[occurrence,attempt,u(permitted?count:0n)]);
}
