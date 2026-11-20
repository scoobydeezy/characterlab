/** M193 planfe32fe36. M192 nonsocial quiet scenario, actual failure at10.
 * Only causal sight/report access vary. Query opportunities12/14, negative report13. */
import {fixture as prior,create as priorCreate,decode,items,key,enc,list,text,signed,u,sid} from './assembledObstruction';
import {OBSTRUCTION_WITNESS_RULES,OBSTRUCTION_WITNESS_REGISTRY} from '../../assembled/model';
import {OBSTRUCTION_SOURCE,OBSTRUCTION_WITNESS} from '../../assembled/externalObstruction';
import {INTERFERENCE,INTERFERENCE_QUERY,INTERFERENCE_SOURCE,INTERFERENCE_CONTEXT} from '../../assembled/interferenceExpectation';
import {taskA} from './assembledDecisionRegimes';
export * from './assembledObstruction';
export {taskA};
export function fixture(o:{seen?:boolean;outcome?:boolean;blocker?:0|1|2;report?:boolean;duplicate?:boolean}={}){
 const b=prior(o.blocker??1,o.outcome??true),base=items(decode(b.d.orderedInputs),'list');
 const opportunities=base.filter(v=>{const a=items(v,'list');return key(a[0])===key(signed(10))&&key(a[2])===key(sid(1001,'event/deliberation-opportunity'));});
 if(opportunities.length!==1)throw Error('M193 actual deliberation source');
 const rows=base.map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(OBSTRUCTION_SOURCE)){const source=items(a[3],'list');a[3]=list([text(OBSTRUCTION_WITNESS),source[1],source[2],list(o.seen===false?[]:[taskA])]);}return list(a);});
 for(const at of [12,14,...(o.duplicate?[16]:[])]){const a=[...items(opportunities[0],'list')];a[0]=signed(at);rows.push(list(a));}
 for(const at of [10,12,14,...(o.duplicate?[16]:[])])rows.push(list([signed(at),u(30),INTERFERENCE_CONTEXT,list([text(INTERFERENCE_QUERY),taskA,u(0),u(1)]),list([])]));
 for(const at of [13,...(o.duplicate?[15]:[])])rows.push(list([signed(at),u(10),INTERFERENCE_SOURCE,list([text(INTERFERENCE),taskA,u(10),u(1),o.report!==false,false]),list([])]));
 return {...b,s:{...b.s,rulesVersion:OBSTRUCTION_WITNESS_RULES,registrySchemaVersion:OBSTRUCTION_WITNESS_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))}};
}

export async function create(b=fixture(),at=10n){return {...await priorCreate(b,at),b};}
