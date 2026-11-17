/** M13765fd31e9: M135 current-other-cue scenario, body10/seed0/goals+urgency1.
 * Only run-owned catalog membership/domain changes; same source/model/laws. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledSemanticLanes';
import {RECOGNITION_KNOWLEDGE_RULES,RECOGNITION_KNOWLEDGE_REGISTRY} from '../../assembled/model';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Domain=0|1|2|3;
export type Mode='main'|'hidden'|'denied'|'empty';
export function fixture(domain:Domain=2,mode:Mode='main'){
 const b=prior(mode==='hidden'?'hidden':mode==='denied'?'denied':'other');
 const s={...b.s,rulesVersion:RECOGNITION_KNOWLEDGE_RULES,registrySchemaVersion:RECOGNITION_KNOWLEDGE_REGISTRY};
 const entries=restoreAuthoritativeState(decode(b.d.initialState)).entries().flatMap(e=>{
  if(e.path.rootStateTypeId!==243n)return [e];if(mode==='empty')return [];
  if(e.path.fieldId!==1n||key(f(rec(e.value,228n),2n))!==key(b.other))return [e];
  if(!domain)return [];const v=rec(e.value,228n);
  return [{...e,value:{...v,fields:new Map([...v.fields].map(([n,x])=>[n,n===3n?u(domain):x]))}}];
 });
 return {s,d:{...b.d,initialState:enc(new AuthoritativeState(entries).canonicalValue())},taskA:b.taskA,taskB:b.taskB,other:b.other,domain,mode,legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
