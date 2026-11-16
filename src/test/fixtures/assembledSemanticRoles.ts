/** M136617fa15f: preserve M129 role-grouping comparison, body10/seed0 and live21
 * goals/routes/body/choice. Add equal current sensory evidence2; no learned mapping. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledRoleBinding';
import {SEMANTIC_ROLES_RULES,SEMANTIC_ROLES_REGISTRY} from '../../assembled/model';
import {RECOGNITION_SYMBOL_DOMAIN} from '../../assembled/recognition';
import {CURRENT_SEM_SOURCE} from '../../assembled/semanticLanes';
import {CONTINUANT_FEATURES,EVENT_FEATURES} from '../../assembled/semanticAppearance';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='separate'|'shared'|'hidden'|'denied'|'none';
export function fixture(mode:Mode='separate'){
 const b=prior(mode==='none'?'separate':mode),slots=[...items(decode(b.s.registry),'list')],catalog=items(slots[21],'list');
 slots[21]=list([text(RECOGNITION_SYMBOL_DOMAIN),...catalog.slice(1),list([text('name/unused')])]);
 const s={...b.s,rulesVersion:SEMANTIC_ROLES_RULES,registrySchemaVersion:SEMANTIC_ROLES_REGISTRY,registry:enc(list(slots))};
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])!==key(SOCIAL_SOURCE))return v;const p=[...items(a[3],'list')];
 p[3]=list([p[3],false,false,false]);p[4]=list([list(CONTINUANT_FEATURES.map(x=>list([text(x),true,true]))),list(EVENT_FEATURES.map(x=>list([text(x),true,true])))]);
 p[5]=list(items(p[5],'list').map(v=>list([u(1),...items(v,'list'),true])));
 if(mode==='none'&&key(a[0])===key(signed(2))){const r=items(p[7],'list');p[7]=list([r[0],u(0),list([])]);}
 a[3]=list(p);return list(a);});
 const first=items(rows.find(v=>key(items(v,'list')[0])===key(signed(1))&&key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list'),p=[...items(first[3],'list')],social=[...items(p[1],'list')];
 social[3]=u(0);social[4]=u(0);p[1]=list(social);p[3]=list([true,false,true,false]);
 rows.push(list([signed(2),u(0),CURRENT_SEM_SOURCE,list([...p.slice(0,6),p[7]]),list([])]));
 return {s,d:{...b.d,orderedInputs:enc(list(rows))},taskA:b.taskA,taskB:b.taskB,mode,legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
