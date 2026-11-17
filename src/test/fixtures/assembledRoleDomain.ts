/** M1381236f9b3: body10/seed0/goals+urgency1; two social tasks/third unknown.
 * Same M136 history/current cue; only consequence2 observed role changes. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledSemanticRoles';
import {ROLE_DOMAIN_RULES,ROLE_DOMAIN_REGISTRY} from '../../assembled/model';
import {ROLE_DOMAIN_ENCODING} from '../../assembled/encoding';
import {CURRENT_SEM_SOURCE} from '../../assembled/semanticLanes';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='companion'|'instrument'|'beneficiary'|'matrix'|'hidden'|'denied';
export const matrix=(denied=false)=>list([u(2),u(1),list([
 list([true,u(2),u(5),true]),list([true,u(2),u(9),true]),list([true,u(2),u(8),true]),
 list([true,u(2),u(7),false]),list([!denied,u(2),u(6),false])
])]);
export function fixture(mode:Mode='companion'){
 const b=prior('separate'),slots=[...items(decode(b.s.registry),'list')],config=items(slots[30],'list');slots[30]=list([text(ROLE_DOMAIN_ENCODING),...config.slice(1)]);
 const s={...b.s,rulesVersion:ROLE_DOMAIN_RULES,registrySchemaVersion:ROLE_DOMAIN_REGISTRY,registry:enc(list(slots))};
 const other=items(items(items(slots[21],'list')[1],'list').find(v=>key(items(v,'list')[0])!==key(target))!,'list')[0];
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')],current=key(a[2])===key(CURRENT_SEM_SOURCE),social=key(a[2])===key(SOCIAL_SOURCE);if(!current&&!social)return v;
 const p=[...items(a[3],'list')],index=current?6:7;
 if(current)p[index]=matrix(mode==='denied');
 else if(key(a[0])===key(signed(2)))p[index]=mode==='matrix'?matrix():list([u(2),u(mode==='instrument'?6:mode==='beneficiary'?8:5),list([])]);
 if(mode==='hidden'){const r=items(p[index],'list');p[index]=list([u(9),r[1],list(items(r[2],'list').map(v=>{const x=items(v,'list');return list([x[0],u(9),...x.slice(2)]);}))]);p[2]=other;const x=[...items(p[1],'list')];x[1]=!(x[1]===true);p[1]=list(x);}
 a[3]=list(p);return list(a);});
 return {s,d:{...b.d,orderedInputs:enc(list(rows))},taskA:b.taskA,taskB:b.taskB,mode,legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
