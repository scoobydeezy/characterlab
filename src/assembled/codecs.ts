/** assembled-character-comparison/0.1. Receiving successor of cognitiveCodecs at 1d3b9e01. */
/** task-cognitive-path/0.1-candidate and task-cognitive-allocation/0.1-candidate.
 * Receiving record grammar only. Live source authentication and semantic refinements
 * belong to the prepared model/transition; decoding grants neither capability. */
import allocation from '../../docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json';
import {canonicalDecode,canonicalEncode,record,RecordSchemaRegistry,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {embodiedSupportedSchemas,decodeEmbodied} from '../campaign3/embodiedCodecs';
import {compileComparison} from './comparison';
import {randomSchemas} from '../substrate/random';
import {list} from '../substrate/canonicalEncoding';
import {invalidModel} from '../campaign2/canonicalData';

// 411/1 stays natural-only; 411/2 receives the C0 effective-key union.
const predecessor=embodiedSupportedSchemas(),drawV1=predecessor.find(s=>s.typeId===411n)!;
const added:readonly RecordSchema[]=[{...drawV1,schemaVersion:2n}];
const schemas=[...predecessor,...added],registry=new RecordSchemaRegistry(schemas);
const current=new Map<bigint,RecordSchema>();for(const schema of schemas)current.set(schema.typeId,schema);
const byName=new Map(schemas.map(s=>[s.name,s]));
const declarations=new Map([...allocation.records,...allocation.schemaSuccessors].map(r=>[`${r.typeId}/${r.schemaVersion}`,r]));
const identityNamespaces=allocation.identifierAliases as Readonly<Record<string,number>>;
const enums=new Map(allocation.finiteValues.map(e=>[e.name,new Set(e.values.map(v=>BigInt(v.value)))]));
type RecordValue=Extract<CanonicalValue,{kind:'record'}>;
const fail=(message:string):never=>invalidModel('cognitive record grammar: '+message);

function isRecord(value:CanonicalValue):value is RecordValue{return typeof value!=='boolean'&&value.kind==='record';}
function checkType(value:CanonicalValue,grammar:string):void {
 const match=/^(\w+)(?:\((.*)\))?$/.exec(grammar);if(!match)fail('unresolved grammar');
 const kind=match![1],body=match![2];
 if(body===undefined){
  if(kind==='bool'){if(typeof value!=='boolean')fail('Boolean required');return;}
  const primitive=({u:'unsigned',i:'signed',q:'rational',text:'text'} as const)[kind as 'u'|'i'|'q'|'text'];
  if(primitive){if(typeof value==='boolean'||value.kind!==primitive)fail(`${primitive} required`);return;}
  if(identityNamespaces[kind]!==undefined){checkType(value,`id(${kind})`);return;}
  checkType(value,`r(${kind})`);return;
 }
 if(kind==='r'){
  const schema=/^\d+$/.test(body)?current.get(BigInt(body)):byName.get(body);
  if(!schema||!isRecord(value)||value.schema.typeId!==schema.typeId||(value.schema.schemaVersion!==schema.schemaVersion&&!(schema.typeId===411n&&value.schema.schemaVersion===1n)))fail('wrong nested record schema');return;
 }
 if(kind==='id'){
  const namespace=identityNamespaces[body];if(namespace===undefined||typeof value==='boolean'||value.kind!=='typedIdentifier'||value.namespaceId!==BigInt(namespace))fail('wrong identifier family');
  const identifier=value as Extract<CanonicalValue,{kind:'typedIdentifier'}>;
  if(namespace>=1128&&namespace<=1141){if(typeof identifier.payload==='boolean'||identifier.payload.kind!=='unsigned')fail('occurrence requires unsigned ordinal');}
  if(namespace>=1040&&namespace<=1043){const p=identifier.payload;if(typeof p==='boolean'||p.kind!=='text'||!allocation.members.some(m=>m.namespace===namespace&&m.payload===p.value))fail('member outside cognitive vocabulary');}
  return;
 }
 if(kind==='enum'){
  if(typeof value==='boolean'||value.kind!=='unsigned'||!enums.get(body)?.has(value.value))fail('unknown finite value');return;
 }
 if(kind==='list'||kind==='set'){
  if(typeof value==='boolean'||value.kind!==kind)fail('wrong collection kind');
  for(const item of (value as Extract<CanonicalValue,{kind:'list'|'set'}>).items)checkType(item,body);return;
 }
 if(kind==='map'){
  if(typeof value==='boolean'||value.kind!=='map')fail('map required');
  const args=body.split(',');if(args.length!==2)fail('map grammar');
  for(const [key,child] of (value as Extract<CanonicalValue,{kind:'map'}>).entries){checkType(key,args[0]);checkType(child,args[1]);}return;
 }
 fail('unknown type constructor');
}

function validate(value:CanonicalValue):void {
 // Delegate maximal unchanged subtrees to the accepted predecessor decoder. An old
 // envelope such as171 may contain new records, so delegating by root TypeId fails.
 const extended=new WeakMap<object,boolean>();
 function containsExtension(v:CanonicalValue):boolean {
  if(typeof v==='boolean')return false;const known=extended.get(v);if(known!==undefined)return known;
  let result=false;
  if(v.kind==='record')result=v.schema.typeId===411n&&v.schema.schemaVersion===2n||[...v.fields.values()].some(containsExtension);
  else if(v.kind==='list'||v.kind==='set')result=v.items.some(containsExtension);
  else if(v.kind==='map')result=v.entries.some(([a,b])=>containsExtension(a)||containsExtension(b));
  else if(v.kind==='typedIdentifier')result=containsExtension(v.payload);
  extended.set(v,result);return result;
 }
 function visit(v:CanonicalValue):void {
  if(!containsExtension(v)){decodeEmbodied(canonicalEncode(v));return;}
  if(typeof v==='boolean')return;
  if(v.kind==='record'){
   const declaration=declarations.get(`${v.schema.typeId}/${v.schema.typeId===411n&&v.schema.schemaVersion===2n?1n:v.schema.schemaVersion}`);
   if(!declaration&&![130n,132n,160n].includes(v.schema.typeId))fail('coupled draw in unrelated record');
   if(declaration){
    for(const field of declaration.fields){const child=v.fields.get(BigInt(field.id));if(child===undefined){if(field.required)fail('missing required field');}else if(v.schema.typeId===411n&&v.schema.schemaVersion===2n&&field.id===2){
      if(isRecord(child)&&child.schema.typeId===113n){
       const entry=record(randomSchemas.mapEntry,new Map([[1n,v.fields.get(1n)!],[2n,child.fields.get(1n)!]]));
       compileComparison(record(randomSchemas.drawMap,new Map([[1n,list([entry])]])));
      }else checkType(child,field.type);
     }else checkType(child,field.type);}
    const variants=allocation.unionVariants.filter(u=>BigInt(u.recordTypeId)===v.schema.typeId);
    if(variants.length){const tag=v.fields.get(1n);if(!tag||typeof tag==='boolean'||tag.kind!=='unsigned')fail('union discriminator');const variant=variants.find(u=>BigInt(u.tag)===(tag as {value:bigint}).value);
     if(!variant||variant.requiredFields.some(i=>v.fields.get(BigInt(i))===undefined)||variant.forbiddenFields.some(i=>v.fields.get(BigInt(i))!==undefined))fail('closed union payload');}
   }
   for(const child of v.fields.values())visit(child);
  }else if(v.kind==='list'||v.kind==='set')v.items.forEach(visit);
  else if(v.kind==='map')for(const [key,value] of v.entries){visit(key);visit(value);}
  else if(v.kind==='typedIdentifier')visit(v.payload);
 }
 visit(value);
}

export function cognitiveSchemaByType(typeId:bigint,version?:bigint):RecordSchema {
 const schema=version===undefined?current.get(typeId):schemas.find(s=>s.typeId===typeId&&s.schemaVersion===version);
 if(!schema)return fail('unavailable schema');return schema;
}
export function decodeCognitive(bytes:Uint8Array):CanonicalValue {const value=canonicalDecode(bytes,registry);validate(value);return value;}
export const cloneCognitive=(value:CanonicalValue)=>decodeCognitive(canonicalEncode(value));
export const cognitiveSupportedSchemas=()=>schemas.map(s=>({...s,fields:s.fields.map(f=>({...f}))}));
export const cognitiveAddedSchemas=()=>added.map(s=>({...s,fields:s.fields.map(f=>({...f}))}));
export function cognitiveRecord(typeId:number,values:readonly CanonicalValue[],version?:number):CanonicalValue {
 const schema=cognitiveSchemaByType(BigInt(typeId),version===undefined?undefined:BigInt(version));if(values.length>schema.fields.length)fail('extra field');
 return cloneCognitive(record(schema,new Map(values.map((v,i)=>[schema.fields[i].id,v]))));
}
export function cognitiveNamed(typeId:number,values:Readonly<Record<string,CanonicalValue>>):CanonicalValue {
 const schema=cognitiveSchemaByType(BigInt(typeId));return cloneCognitive(record(schema,new Map(Object.entries(values).map(([name,value])=>{const field=schema.fields.find(f=>f.name===name);if(!field)fail('unknown field');return [field!.id,value];}))));
}

/** Strict reader after schema admission; both frozen and successor draw versions. */
export function randomDrawRecord(value:CanonicalValue):Extract<CanonicalValue,{kind:'record'}>{
 if(!isRecord(value)||value.schema.typeId!==411n||![1n,2n].includes(value.schema.schemaVersion))return fail('requires draw411/1 or411/2');
 return value;
}

/** Same scalar-role traversal as the accepted task content validator, using successor decoding. */
export function validateCharacterRecordRoles(content:{recordRole:(type:bigint,field:bigint)=>Uint8Array|undefined;validateRole:(value:Uint8Array,role:Uint8Array)=>void},bytes:Uint8Array){
 function visit(v:CanonicalValue):void {
  if(typeof v==='boolean')return;
  if(v.kind==='record'){for(const [field,value] of v.fields){const role=content.recordRole(v.schema.typeId,field);if(role)content.validateRole(canonicalEncode(value),role);}for(const value of v.fields.values())visit(value);}
  else if(v.kind==='list'||v.kind==='set')v.items.forEach(visit);else if(v.kind==='map')for(const [k,value] of v.entries){visit(k);visit(value);}
 }
 visit(decodeCognitive(bytes));
}
