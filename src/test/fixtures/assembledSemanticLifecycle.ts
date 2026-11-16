/** M134 6c3994ae: inherited M133 body10/seed0/goals+urgency1, two social tasks,
 * voice-positive1, cue-free negative2, voice3, choices4/21. Lifecycle only varies. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledSemanticAppearance';
import {SEMANTIC_LIFECYCLE_RULES,SEMANTIC_LIFECYCLE_REGISTRY} from '../../assembled/model';
import {SOCIAL_SOURCE} from '../../assembled/social';
export type Mode='continued'|'reacquire'|'split'|'eventSplit'|'hidden'|'denied';
export function fixture(mode:Mode='reacquire'){
 const b=prior(mode==='hidden'?'hidden':mode==='denied'?'denied':'full'),s={...b.s,rulesVersion:SEMANTIC_LIFECYCLE_RULES,registrySchemaVersion:SEMANTIC_LIFECYCLE_REGISTRY};
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])!==key(SOCIAL_SOURCE))return v;
 const p=[...items(a[3],'list')],first=key(a[0])===key(signed(1)),second=key(a[0])===key(signed(2)),retire=['reacquire','hidden','denied'].includes(mode);
 p[3]=list(first?[false,false,false,false]:second?[!(retire||mode==='split'),retire,mode==='continued',retire||mode==='eventSplit']:[true,false,true,false]);
 if(second)p[5]=list([]);
 if(mode==='hidden')p[4]=list(items(p[4],'list').map(group=>list(items(group,'list').map(v=>list([items(v,'list')[0],true,true])))));
 a[3]=list(p);return list(a);});
 return {s,d:{...b.d,orderedInputs:enc(list(rows))},taskA:b.taskA,taskB:b.taskB,mode,legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
