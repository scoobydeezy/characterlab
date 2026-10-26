import {source,walk} from './campaign2Cognitive';
import {CHARACTER_RULES,CHARACTER_REGISTRY} from '../../assembled/model';
import {canonicalEncode as enc,record,rational,signed,unsigned,list,set,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {decodeCognitive as decode} from '../../campaign2/cognitiveCodecs';
import {dataField as f,dataItems as items,dataRecord as rec,dataKey as key} from '../../campaign2/canonicalData';
import type {Campaign2ModelSource} from '../../campaign2/factory';
export const successor=(s:Campaign2ModelSource=source()):Campaign2ModelSource=>({...s,rulesVersion:CHARACTER_RULES,registrySchemaVersion:CHARACTER_REGISTRY});
export function replace(v:CanonicalValue,n:bigint,next:CanonicalValue){const d=rec(v,(v as Extract<CanonicalValue,{kind:'record'}>).schema.typeId);return record(d.schema,new Map([...d.fields].map(([k,x])=>[k,k===n?next:x])));}
export function changeDefinition(s:Campaign2ModelSource,name:string,field:bigint,value:CanonicalValue){
 return {...s,registry:enc(walk(decode(s.registry),v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;
  const id=f(v,1n);if(typeof id==='boolean'||id.kind!=='typedIdentifier'||typeof id.payload==='boolean'||id.payload.kind!=='text'||id.payload.value!==name)return v;
  return replace(v,4n,replace(f(v,4n),field,value));
 }))};
}
export function workLimit(s:Campaign2ModelSource,n:bigint){const slots=items(decode(s.parameters),'list');return {...s,parameters:enc(list([replace(slots[0],1n,unsigned(n))]))};}
export function nonPreset(){
 let s=successor();for(const [name,values] of [['definition/task-a',[rational(7,3),rational(19,3),signed(0),signed(13)]],['definition/task-b',[rational(8,3),rational(23,3),signed(2),signed(17)]]] as const){for(const [i,v] of values.entries())s=changeDefinition(s,name,BigInt(i+3),v);}
 s=changeDefinition(s,'definition/task-concern',1n,rational(2,5));s=changeDefinition(s,'definition/task-motive',1n,rational(3,5));s=changeDefinition(s,'definition/task-workspace',2n,unsigned(3));return workLimit(s,100000n);
}
export function duplicateRegistry(s:Campaign2ModelSource){const slots=items(decode(s.registry),'list'),rows=items(slots[0],'set'),row=rows.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n)!;return {...s,registry:enc(list(slots.map((v,i)=>i?v:set([...rows,replace(row,3n,{kind:'text',value:'duplicate'})]))))};}
export function overlapAuthority(s:Campaign2ModelSource){const slots=items(decode(s.registry),'list'),registry=rec(slots[2],155n),rows=items(f(registry,2n),'set'),owner=rows[0];const other=replace(owner,1n,{kind:'typedIdentifier',namespaceId:1025n,payload:{kind:'text',value:'authority/duplicate'}});if(key(owner)===key(other))throw Error('negative unchanged');return {...s,registry:enc(list(slots.map((v,i)=>i===2?replace(registry,2n,set([...rows,other])):v)))};}
