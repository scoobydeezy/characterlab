import {IDENTITY_CONTEXT} from '../../assembled/identityEligibility';
import {SELF_CONTEXT} from '../../assembled/selfBelief';
import {VALUES_CONTEXT} from '../../assembled/values';
/** M193 planfe32fe36. M192 nonsocial quiet scenario, actual failure at10.
 * Only causal sight/report access vary. Query opportunities12/14, negative report13. */
import {fixture as prior,create as priorCreate,decode,items,key,enc,list,text,signed,u,sid} from './assembledObstruction';
import {OBSTRUCTION_WITNESS_RULES,OBSTRUCTION_WITNESS_REGISTRY} from '../../assembled/model';
import {OBSTRUCTION_SOURCE,OBSTRUCTION_WITNESS} from '../../assembled/externalObstruction';
import {INTERFERENCE,INTERFERENCE_QUERY,INTERFERENCE_SOURCE,INTERFERENCE_CONTEXT} from '../../assembled/interferenceExpectation';
import {taskB} from './assembledDecisionRegimes';
export * from './assembledObstruction';
export {taskB};
export function fixture(o:{seen?:boolean;outcome?:boolean;blocker?:0|1|2;report?:boolean;duplicate?:boolean}={}){
 const b=prior(o.blocker??1,o.outcome??true),base=items(decode(b.d.orderedInputs),'list');
 const opportunities=base.filter(v=>{const a=items(v,'list');return key(a[0])===key(signed(10))&&key(a[2])===key(sid(1001,'event/deliberation-opportunity'));});
 if(opportunities.length!==1)throw Error('M193 actual deliberation source');
 const rows=base.map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(OBSTRUCTION_SOURCE)){const source=items(a[3],'list');a[3]=list([text(OBSTRUCTION_WITNESS),source[1],source[2],list(o.seen===false?[]:[taskB])]);}return list(a);});
 const contexts=base.filter(v=>{const a=items(v,'list');return key(a[0])===key(signed(10))&&[IDENTITY_CONTEXT,SELF_CONTEXT,VALUES_CONTEXT].some(t=>key(t)===key(a[2]));});if(contexts.length!==3)throw Error('M193 opportunity contexts');
 for(const at of [12,14,...(o.duplicate?[16]:[])])for(const v of [...opportunities,...contexts]){const a=[...items(v,'list')];a[0]=signed(at);rows.push(list(a));}
 for(const at of [10,12,14,...(o.duplicate?[16]:[])])rows.push(list([signed(at),u(30),INTERFERENCE_CONTEXT,list([text(INTERFERENCE_QUERY),taskB,u(0),u(1)]),list([])]));
 for(const at of [13,...(o.duplicate?[15]:[])])rows.push(list([signed(at),u(10),INTERFERENCE_SOURCE,list([text(INTERFERENCE),taskB,u(10),u(1),o.report!==false,false]),list([])]));
 return {...b,s:{...b.s,rulesVersion:OBSTRUCTION_WITNESS_RULES,registrySchemaVersion:OBSTRUCTION_WITNESS_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))}};
}

export async function create(b=fixture(),at=10n){return {...await priorCreate(b,at),b};}
