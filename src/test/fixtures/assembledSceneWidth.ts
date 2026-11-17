/** M139577e616d: body10, seed0, goals/urgency1; two social tasks, third unknown.
 * Same current six-binding scene/history. Only another observed Companion -> Actor. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledRoleDomain';
import {SCENE_WIDTH_RULES,SCENE_WIDTH_REGISTRY} from '../../assembled/model';
import {SCENE_WIDTH_ENCODING} from '../../assembled/encoding';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='companion'|'actor'|'six'|'hidden'|'denied';
export const scene=(mode:Mode='companion')=>list([u(2),u(2),list([
 list([mode!=='denied',u(2),u(mode==='actor'?1:5),false]),list([true,u(2),u(7),false]),
 list([true,u(2),u(6),false]),list([true,u(2),u(8),false]),...(mode==='six'?[list([true,u(2),u(4),false])]:[])
])]);
export function fixture(mode:Mode='companion'){
 const b=prior(mode==='hidden'?'hidden':'companion'),slots=[...items(decode(b.s.registry),'list')],config=items(slots[30],'list');slots[30]=list([text(SCENE_WIDTH_ENCODING),...config.slice(1)]);
 const s={...b.s,rulesVersion:SCENE_WIDTH_RULES,registrySchemaVersion:SCENE_WIDTH_REGISTRY,registry:enc(list(slots))};
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])!==key(SOCIAL_SOURCE)||key(a[0])!==key(signed(2)))return v;
 const p=[...items(a[3],'list')];p[7]=scene(mode);if(mode==='hidden'){const r=items(p[7],'list');p[7]=list([u(9),r[1],list(items(r[2],'list').map(v=>{const x=items(v,'list');return list([x[0],u(9),...x.slice(2)]);}))]);}a[3]=list(p);return list(a);});
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))},mode,legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
