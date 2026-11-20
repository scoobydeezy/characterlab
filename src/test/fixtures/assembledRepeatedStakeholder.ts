/** M199: unchanged M195 two real B attempts10/12; passive reports11/15.
 * Nonsocial tasks/body30/cap100/rate10/delivery90@9,seed0; full101. */
import {fixture as prior,create as priorCreate,decode,items,key,enc,list,text,signed,u,C,taskB} from './assembledRepeatedInterference';
import {fixture as donor} from './assembledStakeholderKnowledge';
import {STAKEHOLDER_KNOWLEDGE_RULES,STAKEHOLDER_KNOWLEDGE_REGISTRY} from '../../assembled/model';
import {OBSTRUCTION_SOURCE} from '../../assembled/externalObstruction';
import {SK} from '../../assembled/stakeholderKnowledge';
export * from './assembledRepeatedInterference';
export function fixture(o:{report?:boolean;secondSeen?:boolean;private?:boolean;blocker?:1|2}={}){
 const b=prior({secondSeen:o.secondSeen,private:o.private,blocker:o.blocker}),slots=[...items(decode(b.s.registry),'list')],local=items(decode(donor({mode:'empty'}).s.registry),'list')[50];
 if(key(list(items(slots[50],'list').slice(0,3)))!==key(list(items(local,'list').slice(0,3))))throw Error('M199 observer declaration correspondence');
 slots[50]=local;
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(OBSTRUCTION_SOURCE)){const p=items(a[3],'list');a[3]=list([text(SK),...p.slice(1),taskB,list([true,true]),list([!o.private,false]),list([list([]),list([])])]);}return list(a);});
 for(const at of[11,14,15,16]){const report=(at===11||at===15)&&o.report!==false&&!o.private;
 rows.push(list([signed(at),u(30),OBSTRUCTION_SOURCE,list([text(SK),C,list([]),list([]),taskB,list([false,false]),list([false,false]),list([list(report?[u(10),u(1),false]:[]),list([])])]),list([])]));}
 return {...b,s:{...b.s,rulesVersion:STAKEHOLDER_KNOWLEDGE_RULES,registrySchemaVersion:STAKEHOLDER_KNOWLEDGE_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export async function create(b=fixture(),at=10n){return {...await priorCreate(b,at),b};}
