/** M13516e5532: body10, seed0, goals+urgency1, two social tasks/third unknown.
 * Positive report1; current2 sensory cue; negative consequence2; voice3; choice4. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledSemanticLifecycle';
import {SEMANTIC_LANES_RULES,SEMANTIC_LANES_REGISTRY} from '../../assembled/model';
import {CURRENT_SEM_SOURCE} from '../../assembled/semanticLanes';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='target'|'other'|'corrected'|'hidden'|'denied';
export function fixture(mode:Mode='other'){
 const b=prior('continued'),slots=items(decode(b.s.registry),'list'),catalog=items(items(slots[21],'list')[1],'list').map(v=>items(v,'list')),people=items(items(slots[19],'list')[1],'list').map(v=>items(v,'list')[0]);
 const other=catalog.find(v=>key(v[0])!==key(target)&&people.some(p=>key(p)===key(v[0])))!;if(!other)throw Error('M135 other retained candidate');
 const s={...b.s,rulesVersion:SEMANTIC_LANES_RULES,registrySchemaVersion:SEMANTIC_LANES_REGISTRY};
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[0])===key(signed(2))&&key(a[2])===key(SOCIAL_SOURCE)){
 const p=[...items(a[3],'list')];if(mode==='corrected')p[5]=list([list([u(1),text('appearance/voice'),true,true])]);a[3]=list(p);}return list(a);});
 const observed=items(rows.find(v=>key(items(v,'list')[0])===key(signed(2))&&key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list'),p=[...items(observed[3],'list')],social=[...items(p[1],'list')];
 social[3]=u(0);social[4]=u(0);if(mode==='denied')social[5]=false;if(mode==='hidden')social[1]=!(social[1]===true);
 p[1]=list(social);if(mode==='hidden')p[2]=other[0];p[5]=list([list([u(1),mode==='target'?text('appearance/voice'):items(other[1],'list')[0],true,true])]);
 rows.push(list([signed(2),u(0),CURRENT_SEM_SOURCE,list([...p.slice(0,6),p[7]]),list([])]));
 return {s,d:{...b.d,orderedInputs:enc(list(rows))},taskA:b.taskA,taskB:b.taskB,other:other[0],mode,legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
