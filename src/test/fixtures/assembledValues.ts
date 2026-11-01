import {list,text,signed,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {VALUES_RULES,VALUES_REGISTRY} from '../../assembled/model';
import {VALUES,VALUES_CONTEXT} from '../../assembled/values';
import {SELF,SELF_CONTEXT} from '../../assembled/selfBelief';
import {IDENTITY_CONTEXT} from '../../assembled/identityEligibility';
import {source as formationSource} from './assembledFormation';
import {context} from './assembledIdentityEligibility';
import {outcomeData,topic,decode,items,key,enc} from './assembledOutcomeDisclosure';
import {sid} from '../../assembled/skill';
export const source=()=>{const s=formationSource(),t=items(topic(),'list');return {...s,rulesVersion:VALUES_RULES,registrySchemaVersion:VALUES_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(VALUES),t[1],t[2]])]))};};
export function data(linked=true,seed=0,o:{permitted?:boolean;missingA?:boolean;direction?:number}={}){const d=outcomeData(true,o),rows=[...items(decode(d.orderedInputs),'list')],ops=rows.filter(v=>key(items(v,'list')[2])===key(sid(1001,'event/deliberation-opportunity')));for(const v of ops){const at=items(v,'list')[0];rows.push(list([at,unsigned(30),IDENTITY_CONTEXT,context(false,key(at)===key(signed(3))?{kind:'rational',numerator:1n,denominator:1n}:{kind:'rational',numerator:0n,denominator:1n}),list([])]),list([at,unsigned(30),SELF_CONTEXT,list([text(SELF),true,signed(1)]),list([])]),list([at,unsigned(30),VALUES_CONTEXT,list([text(VALUES),key(at)===key(signed(3))?linked:true,signed(o.direction??1)]),list([])]));}return {...d,runSeed:new Uint8Array(32).fill(seed),orderedInputs:enc(list(rows))};}
export {decode,items,key,enc};
