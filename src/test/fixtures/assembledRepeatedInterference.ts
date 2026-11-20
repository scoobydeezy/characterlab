/** M195 plana7a1d152. M192 nonsocial tasks/body30/cap100/rate10/delivery90@9.
 * A/B importance3/5,severity1/2,seed0. Actual observations, two passive blocks.
 * Fresh body and identity/self/Values contexts accompany opportunities12/14/16. */
import {fixture as prior,create as priorCreate,decode,items,key,enc,list,text,signed,u,sid,C} from './assembledObstruction';
import {EXECUTION_OPPORTUNITY_RULES,EXECUTION_OPPORTUNITY_REGISTRY} from '../../assembled/model';
import {IDENTITY_CONTEXT} from '../../assembled/identityEligibility';
import {SELF_CONTEXT} from '../../assembled/selfBelief';
import {VALUES_CONTEXT} from '../../assembled/values';
import {DISPLAY} from '../../assembled/strategy';
import {PRACTICE_SETTING} from '../../assembled/skill';
import {BODY_SAMPLE} from '../../assembled/body';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {OBSTRUCTION_SOURCE,OBSTRUCTION_WITNESS} from '../../assembled/externalObstruction';
import {INTERFERENCE,INTERFERENCE_QUERY,INTERFERENCE_SOURCE,INTERFERENCE_CONTEXT} from '../../assembled/interferenceExpectation';
import {taskB} from './assembledDecisionRegimes';
export * from './assembledObstruction';
export {taskB};
export function fixture(o:{alternateRetry?:boolean;originalExpired?:boolean;secondSeen?:boolean;private?:boolean;blocker?:1|2}={}){
 const b=prior(o.blocker??1),base=items(decode(b.d.orderedInputs),'list'),at10=base.filter(v=>key(items(v,'list')[0])===key(signed(10)));
 const templates=at10.filter(v=>[sid(1001,'event/deliberation-opportunity'),IDENTITY_CONTEXT,SELF_CONTEXT,VALUES_CONTEXT,BODY_SAMPLE,PRACTICE_SETTING].some(t=>key(t)===key(items(v,'list')[2])));
 if(templates.length!==6)throw Error('M195 complete later-opportunity declarations '+templates.length);
 const rows=base.map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(OBSTRUCTION_SOURCE)){const p=items(a[3],'list');a[3]=list([text(OBSTRUCTION_WITNESS),p[1],p[2],list(o.private?[]:[taskB])]);}if(!o.originalExpired&&key(a[0])===key(signed(8))&&key(a[2])===key(DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];if(key(x[5])!==key(u(10)))throw Error('M195 original route window');x[5]=u(16);return list(x);}))]);}return list(a);});
 for(const at of[12,14,16])for(const v of templates){const a=[...items(v,'list')];a[0]=signed(at);rows.push(list(a));}
 const feedback=at10.find(v=>key(items(v,'list')[2])===key(PERFORMANCE_SETTING));if(!feedback)throw Error('M195 actual outcome channel');
 rows.push(list([signed(12),...items(feedback,'list').slice(1)]));
 rows.push(list([signed(12),u(30),OBSTRUCTION_SOURCE,list([text(OBSTRUCTION_WITNESS),C,list([b.people[(o.blocker??1)-1]]),list(o.private||o.secondSeen===false?[]:[taskB])]),list([])]));
 if(!o.alternateRetry){const latest=at10.length&&base.find(v=>key(items(v,'list')[0])===key(signed(8))&&key(items(v,'list')[2])===key(DISPLAY));if(!latest)throw Error('M195 latest route display');const p=items(items(latest,'list')[3],'list');rows.push(list([signed(11),u(10),DISPLAY,list([p[0],list(items(p[1],'list').map(v=>{const x=items(v,'list');return list([x[0],x[1],u(key(x[1])===key(u(0))?5:6),key(x[0])===key(taskB)&&key(x[1])===key(u(1)),u(11),u(16),true]);}))]),list([])]));}
 for(const at of[10,12,14,16])rows.push(list([signed(at),u(30),INTERFERENCE_CONTEXT,list([text(INTERFERENCE_QUERY),taskB,u(1),u(1)]),list([])]));
 for(const at of[11,15])rows.push(list([signed(at),u(10),INTERFERENCE_SOURCE,list([text(INTERFERENCE),taskB,u(10),u(1),!o.private,false]),list([])]));
 return {...b,s:{...b.s,rulesVersion:EXECUTION_OPPORTUNITY_RULES,registrySchemaVersion:EXECUTION_OPPORTUNITY_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export async function create(b=fixture(),at=10n){return {...await priorCreate(b,at),b};}
