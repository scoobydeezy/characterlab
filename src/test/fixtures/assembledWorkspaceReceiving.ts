/** M127 planf5a71991: retained task -> capacity -> actual reasons/arbitration.
 * Current0.93; one holder, recognized stand-in, two social tasks/third unknown.
 * Body10/samples6+7, A/B importance1, seed0, deadlines20/25/30.
 * Physical execution cannot succeed in any arm; capacity2/3/4 alone varies. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledBeliefTrials';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {changeDefinition} from './assembledCharacter';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export function fixture(capacity=3,hidden=false){
 const b=prior(hidden?'hidden':'qualified'),slots=items(decode(b.s.registry),'list');
 const mappings=items(items(slots[19],'list')[1],'list').flatMap(v=>items(items(v,'list')[1],'list').map(v=>items(v,'list')[0]));
 const taskA=b.task,taskB=mappings.find(t=>key(t)!==key(taskA));if(!taskB)throw Error('M127 requires second social task');
 let s=changeDefinition(b.s,'definition/task-workspace',2n,u(capacity));
 s=changeDefinition(s,'definition/protocol-execution',1n,false);
 for(const [name,at]of[['task-a',20],['task-b',25],['configurable-garden',30]] as const)s=changeDefinition(s,'definition/'+name,6n,signed(at));
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(PRIORITY_DISPLAY)){const p=[...items(a[3],'list')];p[1]=list(items(p[1],'list').map(v=>{const g=[...items(v,'list')];if(items(g[1],'list').length)g[1]=list([q([taskA,taskB].some(t=>key(t)===key(g[0]))?1:0,1)]);return list(g);}));a[3]=list(p);}return list(a);});
 return {s,d:{...b.d,orderedInputs:enc(list(rows))},taskA,taskB,capacity};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
