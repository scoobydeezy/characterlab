/** M238: physical permission changes; laws and perceived criterion stay fixed. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,type CanonicalValue} from './assembledExecutionCriterion';
import {changeDefinition} from './assembledCharacter';
import {PROTOCOL_PERMISSION_RULES,PROTOCOL_PERMISSION_REGISTRY} from '../../assembled/model';
import {PROTOCOL_PERMISSION,PROTOCOL_PERMISSION_SOURCE} from '../../assembled/protocolPermission';
import {PROBE_SOURCE_EVENT} from '../../campaign2/orderedInputs';
import {cognitiveRecord as r} from '../../assembled/codecs';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export const names=['dynamic','denied','default','staticDenied','silent'] as const;
export type Case=typeof names[number];
let base:ReturnType<typeof prior>|undefined;
export function fixture(name:Case){
 const b=base??(base=prior('permitted')),original=items(decode(b.d.orderedInputs),'list');
 const inputs=[...original,...original.filter(v=>at(items(v,'list')[0])===5n).map(v=>list([signed(7),...items(v,'list').slice(1)]))];
 if(name!=='silent')inputs.push(list([signed(6),u(110),PROBE_SOURCE_EVENT,r(333,[sid(1027,'definition/regulatory-diagnostic-probe')]),list([])]));
 const permissionActions=items(items(items(decode(b.s.registry),'list')[10],'list')[2],'set').map(v=>items(v,'list')[0]);
 const source=(t:number,allowed:boolean)=>list([signed(t),u(100),PROTOCOL_PERMISSION_SOURCE,list([text(PROTOCOL_PERMISSION),C,set(permissionActions.map(action=>list([action,allowed])))]),list([])]);
 inputs.push(source(3,name==='staticDenied'));if(name!=='default')inputs.push(source(5,name!=='denied'));
 let s={...b.s,rulesVersion:PROTOCOL_PERMISSION_RULES,registrySchemaVersion:PROTOCOL_PERMISSION_REGISTRY};
 if(name==='staticDenied')s=changeDefinition(s,'definition/protocol-execution',1n,false);
 return {...b,permissionActions,s,d:{...b.d,orderedInputs:enc(list(inputs))},silent:name==='silent'};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid};
export type {CanonicalValue};
