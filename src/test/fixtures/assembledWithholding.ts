/** M211: ordinary nonsocial tasks and M210 Rested training; B announced13.
 * B is a governed zero-request option, not an authored protective identity. */
import {fixture as prior,decode,items,key,enc,list,text,u,signed,C,rec,f} from './assembledSleepDemand';
import {changeDefinition} from './assembledCharacter';
import {WITHHOLDING_RULES,WITHHOLDING_REGISTRY} from '../../assembled/model';
import {record,set,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {sid} from '../../assembled/skill';
import {semanticReferentFromAuthoredContent} from '../../substrate/referentOrigin';
import {cognitiveRecord as r} from '../../assembled/codecs';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {DISPLAY,STRATEGY} from '../../assembled/strategy';
export const action=sid(1027,'definition/protocol-contact-two'),instruction=sid(1027,'definition/task-instruction-two');
export const task=r(371,[C,semanticReferentFromAuthoredContent(sid(1038,'content/task-b'))]);
const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields].map(([k,y])=>[k,k===n?x:y])));};
export function fixture(available=true,observed=true){
 const b=prior(0),slots=[...items(decode(b.s.registry),'list')];let definitions=0;
 slots[0]=set(items(slots[0],'set').map(v=>{if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n||key(f(v,1n))!==key(action))return v;definitions++;return replace(replace(v,3n,text('bounded-protocol-execution/0.2-candidate')),4n,r(391,[u(0)]));}));if(definitions!==1)throw Error('zero action definition');
 const actuator=items(slots[10],'list');slots[10]=list([actuator[0],actuator[1],set(items(actuator[2],'set').map(v=>key(items(v,'list')[0])===key(action)?list([action,q(0,1),u(0)]):v))]);
 const routes=items(slots[12],'list');slots[12]=list([routes[0],list(items(routes[1],'list').map(v=>key(items(v,'list')[0])===key(task)?list([task,instruction,sid(1027,'definition/task-instruction-one')]):v))]);
 const initial=restoreAuthoritativeState(decode(b.d.initialState));const entries=initial.entries().map(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===2n&&e.path.selectors[0]?.kind==='mapKey'&&key(e.path.selectors[0].key)===key(task)?{...e,value:r(390,[instruction])}:e);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])!==key(DISPLAY))return v;const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];if(key(x[0])===key(task))x[3]=false;return list(x);}))]);return list(a);});
 rows.push(list([signed(13),u(30),DISPLAY,list([text(STRATEGY),list([list([task,u(0),u(3),available,u(13),u(25),true])])]),list([])]));
 return {...b,action,task,s:changeDefinition({...b.s,rulesVersion:WITHHOLDING_RULES,registrySchemaVersion:WITHHOLDING_REGISTRY,registry:enc(list(slots))},'definition/protocol-observation',4n,observed),d:{...b.d,initialState:enc(new AuthoritativeState(entries).canonicalValue()),orderedInputs:enc(list(rows))}};
}
export {start,state,labels,through,at,decode,items,key,enc,list,text,u,signed,C,rec,f,uint,outputs,bytes,exact} from './assembledSleepDemand';
export type {Run} from './assembledSleepDemand';
