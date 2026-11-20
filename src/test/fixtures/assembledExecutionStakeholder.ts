/** M196 plan19da65f3: M192 full101, nonsocial tasks/body30, real B/route1 failure10. */
import {fixture as prior,create as priorCreate,decode,items,key,enc,list,text} from './assembledObstruction';
import {STAKEHOLDER_RULES,STAKEHOLDER_REGISTRY} from '../../assembled/model';
import {OBSTRUCTION_SOURCE} from '../../assembled/externalObstruction';
import {STAKEHOLDER} from '../../assembled/executionStakeholder';
import {taskB} from './assembledDecisionRegimes';
export * from './assembledObstruction';
export {taskB};
export function fixture(o:{blocker?:0|1|2;outcome?:boolean;access?:[boolean,boolean];seen?:boolean}={}){
 const b=prior(o.blocker??1,o.outcome??true),rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(OBSTRUCTION_SOURCE)){const p=items(a[3],'list');a[3]=list([text(STAKEHOLDER),p[1],p[2],list(o.seen===false?[]:[taskB]),taskB,list(o.access??[true,false])]);}return list(a);});
 return {...b,s:{...b.s,rulesVersion:STAKEHOLDER_RULES,registrySchemaVersion:STAKEHOLDER_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export async function create(b=fixture(),at=10n){return {...await priorCreate(b,at),b};}
