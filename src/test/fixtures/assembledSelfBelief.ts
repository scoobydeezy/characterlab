import {list,text,signed,unsigned} from '../../substrate/canonicalEncoding';
import {SELF_RULES,SELF_REGISTRY} from '../../assembled/model';
import {SELF,SELF_CONTEXT} from '../../assembled/selfBelief';
import {IDENTITY_CONTEXT} from '../../assembled/identityEligibility';
import {source as priorSource,data as priorData,decode,items,key,enc} from './assembledIdentityEligibility';
export const source=()=>{const s=priorSource();return {...s,rulesVersion:SELF_RULES,registrySchemaVersion:SELF_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(SELF)])]))};};
export function data(visible=true,seed=0,goal=1,pressure=false){const d=priorData(pressure,seed),rows=items(decode(d.orderedInputs),'list');return {...d,orderedInputs:enc(list([...rows,...rows.filter(v=>key(items(v,'list')[2])===key(IDENTITY_CONTEXT)).map(v=>list([items(v,'list')[0],unsigned(30),SELF_CONTEXT,list([text(SELF),visible,signed(goal)]),list([])]))]))};}
export {decode,items,key,enc};
