/** M200 b65ca503: schema-only transfer of original M197/M194 scenes to0.134. */
import {fixture as skill} from './assembledAgencyCompetence';
import {fixture as opportunity} from './assembledExecutionOpportunity';
import {fixture as donor} from './assembledStakeholderKnowledge';
import {decode,items,key,enc,list,text} from './assembledObstruction';
import {STAKEHOLDER_KNOWLEDGE_RULES,STAKEHOLDER_KNOWLEDGE_REGISTRY} from '../../assembled/model';
import {OBSTRUCTION_SOURCE} from '../../assembled/externalObstruction';
import {SK} from '../../assembled/stakeholderKnowledge';
import type {CanonicalValue} from '../../substrate/canonicalEncoding';
let observers:CanonicalValue|undefined;
function upgrade<B extends ReturnType<typeof skill>|ReturnType<typeof opportunity>>(b:B){
 const slots=[...items(decode(b.s.registry),'list')],current=observers??(observers=items(decode(donor({mode:'empty'}).s.registry),'list')[50]);
 if(slots.length!==55||key(list(items(slots[50],'list').slice(0,3)))!==key(list(items(current,'list').slice(0,3))))throw Error('M200 declaration correspondence');
 const old=items(items(slots[50],'list')[3],'list'),now=items(items(current,'list')[3],'list');if(old.length!==now.length||old.some((v,i)=>key(v)!==key(list(items(now[i],'list').slice(0,3)))))throw Error('M200 observer correspondence');
 slots[50]=current;
 return {...b,s:{...b.s,rulesVersion:STAKEHOLDER_KNOWLEDGE_RULES,registrySchemaVersion:STAKEHOLDER_KNOWLEDGE_REGISTRY,registry:enc(list(slots))}};
}
export function competence(trained=true,blocked=true,access=true){
 const b=upgrade(skill(trained,blocked,access)),rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(OBSTRUCTION_SOURCE)){const p=items(a[3],'list');if(p.length!==6)throw Error('M200 original outcome source');a[3]=list([text(SK),...p.slice(1),list([false,false]),list([list([]),list([])])]);}return list(a);});
 return {...b,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export function executionOpportunity(available=true,visible=true){return upgrade(opportunity(available,visible));}
