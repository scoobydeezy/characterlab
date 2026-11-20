/** M197 e5739690: acquired skill versus external prevention, current0.133. */
import {fixture as skill,decode,items,key,enc,list,text,signed,C} from './assembledSkillIntegration';
import {promote} from './assembledDecisionCurrent';
import {STAKEHOLDER_RULES,STAKEHOLDER_REGISTRY} from '../../assembled/model';
import {OBSTRUCTION_SOURCE} from '../../assembled/externalObstruction';
import {STAKEHOLDER} from '../../assembled/executionStakeholder';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export * from './assembledSkillIntegration';
export {u};
export function fixture(trained=true,blocked=true,access=true){
 const original=skill(trained?'trained-positive':'untrained-positive');
 // The existing schema adapter uses s/d only; preserve the skill fixture metadata.
 const upgraded=promote(original as Parameters<typeof promote>[0]),slots=items(decode(upgraded.s.registry),'list');
 const people=items(items(slots[19],'list')[1],'list').map(v=>items(v,'list')[0]),task=original.tasks[0];
 if(!people.length)throw Error('M197 declared passive blocker absent');
 let changed=0;const rows=items(decode(upgraded.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[0])===key(signed(14))&&key(a[2])===key(PERFORMANCE_SETTING)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=items(v,'list');return list([x[0],true,u(0)]);}))]);changed++;}return list(a);});
 if(changed!==1)throw Error('M197 actual report14 declaration');
 rows.push(list([signed(14),u(30),OBSTRUCTION_SOURCE,list([text(STAKEHOLDER),C,list(blocked?[people[0]]:[]),list([task]),task,list([access,false])]),list([])]));
 return {...original,people,task,s:{...upgraded.s,rulesVersion:STAKEHOLDER_RULES,registrySchemaVersion:STAKEHOLDER_REGISTRY},d:{...upgraded.d,orderedInputs:enc(list(rows))}};
}
