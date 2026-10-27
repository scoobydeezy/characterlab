/** assembled-character-habit/0.1: two actions x two tasks, unchanged per-group mathematics. */
import {list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SchedulerContractError} from '../substrate/scheduler';
import {compileReasonNuclei} from '../campaign2/cognitiveMath';
import {dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
export function compileAssembledReasons(signals:readonly CanonicalValue[],definition:CanonicalValue){
 const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','assembled reasons: '+s);};
 if(signals.length>12)fail('signal capacity12');const groups=new Map<string,CanonicalValue[]>(),actions=new Set<string>(),tasks=new Set<string>();
 for(const signal of signals){const s=rec(f(rec(signal,402n),1n),401n),candidate=f(s,1n),task=f(s,2n),k=key(list([candidate,f(rec(task,371n),2n)]));actions.add(key(candidate));tasks.add(key(task));const g=groups.get(k)??[];g.push(signal);groups.set(k,g);}
 if(groups.size>4||actions.size>2||tasks.size>2)fail('two actions/two tasks');
 return [...groups.values()].flatMap(group=>compileReasonNuclei(group,definition)).sort((a,b)=>key(f(rec(a,407n),1n))<key(f(rec(b,407n),1n))?-1:1);
}
