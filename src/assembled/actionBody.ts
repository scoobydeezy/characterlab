/** assembled-character-action-body/0.1-candidate. Governed physical settings only. */
import {text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {exact} from '../campaign3/embodiedMath';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataText as txt,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
export const ACTION_BODY='assembled-action-body/0.1';
export const ACTION_BODY_EVENT=typedIdentifier(1001,text('event/assembled-action-body-effect'));
export function compileActionBody(value:CanonicalValue,capacity:Q,definitions:readonly {action:CanonicalValue;definition:CanonicalValue}[]){
 const a=items(value,'list');if(a.length!==3||txt(a[0])!==ACTION_BODY||typeof a[1]!=='boolean')invalidModel('action body declaration');
 const rows=items(a[2],'set'),seen=new Set<string>();if(rows.length!==2||definitions.length!==2)invalidModel('action body requires both protocol actions');
 const entries=rows.map(value=>{const pair=items(value,'list');if(pair.length!==2)invalidModel('action body pair');const action=id(pair[0]),k=key(action),definition=definitions.find(d=>key(d.action)===k);
  if(action.namespaceId!==1027n||!definition||seen.has(k))invalidModel('action body duplicate/foreign action');seen.add(k);const amount=exact(pair[1]),count=uint(f(rec(definition.definition,391n),1n));
  if(amount.compare(Q.of(0n))<0||amount.compare(capacity)>0||![1n,2n].includes(count))invalidModel('action body amount/count domain');
  return Object.freeze({action:structuredClone(action),amount,count});
 });
 return Object.freeze({permitted:a[1] as boolean,entries:Object.freeze(entries)});
}
export type ActionBodyDeclaration=ReturnType<typeof compileActionBody>;
/** Trusted completed execution only; this function does not grant ingress authority. */
export function selectedBodyEffect(outcome:CanonicalValue,holder:CanonicalValue,settings:ActionBodyDeclaration){
 const o=rec(outcome,433n),attempt=rec(f(o,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n),resolution=rec(f(intent,2n),409n),result=rec(f(resolution,4n),419n);
 if(uint(f(result,1n))!==3n)invalidModel('action body needs chosen result');
 const option=rec(f(rec(f(result,2n),420n),1n),395n),action=f(option,2n),entry=settings.entries.find(e=>key(e.action)===key(action));
 if(key(f(option,1n))!==key(holder)||!entry)invalidModel('action body foreign holder/action');
 const count=uint(f(o,3n));if(uint(f(plan,3n))!==entry.count||(count!==0n&&count!==entry.count))invalidModel('action body protocol count association');
 return {outcomeId:f(o,1n),attempt:f(o,2n),attemptId:f(attempt,1n),action,requested:entry.amount,applied:settings.permitted&&count!==0n};
}
