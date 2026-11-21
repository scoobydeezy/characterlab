/** M212 explicit nonsocial scenario: actual practice12, protection adopted13,
 * both routes14/16, current demand800, reserve10. No authored history. */
import {fixture as prior,task,action,decode,items,key,enc,list,text,u,signed} from './assembledWithholding';
import {PROTECTION_RULES,PROTECTION_REGISTRY} from '../../assembled/model';
import {PROTECTION} from '../../assembled/protectiveIdentity';
import {CONTROL_SOURCE} from '../../assembled/control';
import {IDENTITY_CONTEXT,ELIGIBILITY,EXPERIMENT} from '../../assembled/identityEligibility';
import {rational as q} from '../../substrate/canonicalEncoding';
export function fixture(learn=true){
 const b=prior(),slots=[...items(decode(b.s.registry),'list')];slots.push(list([text(PROTECTION),action,task,q(3,5)]));
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')],at=(a[0] as {value:bigint}).value;
  if([14n,16n].includes(at)&&key(a[2])===key(CONTROL_SOURCE)){const p=[...items(a[3],'list')];p[6]=u(800);a[3]=list(p);}
  if([14n,16n].includes(at)&&key(a[2])===key(IDENTITY_CONTEXT))a[3]=list([text(EXPERIMENT),list([text(ELIGIBILITY),q(1,1),q(0,1),false]),list([true,at===14n?learn:true])]);
  return list(a);
 });
 return {...b,s:{...b.s,rulesVersion:PROTECTION_RULES,registrySchemaVersion:PROTECTION_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {start,state,labels,through,at,decode,items,key,enc,list,text,u,signed,C,rec,f,uint,outputs,bytes,exact} from './assembledWithholding';
export type {Run} from './assembledWithholding';
