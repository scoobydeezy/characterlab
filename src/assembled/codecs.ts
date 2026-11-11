/** assembled-character-comparison/0.1. Receiving successor of cognitiveCodecs at 1d3b9e01. */
/** task-cognitive-path/0.1-candidate and task-cognitive-allocation/0.1-candidate.
 * Receiving record grammar only. Live source authentication and semantic refinements
 * belong to the prepared model/transition; decoding grants neither capability. */
import allocation from '../../docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json';
import {canonicalDecode,canonicalEncode,record,RecordSchemaRegistry,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {embodiedSupportedSchemas,decodeEmbodied} from '../campaign3/embodiedCodecs';
import {compileComparison} from './comparison';
import {randomSchemas} from '../substrate/random';
import {list,set} from '../substrate/canonicalEncoding';
import {invalidModel,dataKey as key} from '../campaign2/canonicalData';

// 411/1 stays natural-only; 411/2 receives the C0 effective-key union.
const predecessor=embodiedSupportedSchemas(),drawV1=predecessor.find(s=>s.typeId===411n)!;
const rawV1=predecessor.find(s=>s.typeId===403n)!,nucleusV1=predecessor.find(s=>s.typeId===404n)!;
const added:readonly RecordSchema[]=[{...drawV1,schemaVersion:2n},{...rawV1,schemaVersion:2n,fields:[...rawV1.fields,{id:5n,name:'ValueSignals',required:true}]},{...nucleusV1,schemaVersion:2n}];
const described:RecordSchema={...rawV1,schemaVersion:3n,fields:[...rawV1.fields,{id:5n,name:'ValueSignals',required:true},{id:6n,name:'Descriptions',required:true}]};
const receiptAtom:RecordSchema={typeId:399n,schemaVersion:2n,name:'ValueReceiptEvidenceAtom',fields:[{id:1n,name:'VariantTag',required:true},{id:2n,name:'PerformanceObservationId',required:true}]};
const schemas=[...predecessor,...added,described,receiptAtom],registry=new RecordSchemaRegistry(schemas);
const current=new Map<bigint,RecordSchema>();for(const schema of schemas)if(!(schema.typeId===399n&&schema.schemaVersion===2n||schema.typeId===403n&&schema.schemaVersion>=2n||schema.typeId===404n&&schema.schemaVersion===2n))current.set(schema.typeId,schema);
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
  if(!schema||!isRecord(value)||value.schema.typeId!==schema.typeId||(value.schema.schemaVersion!==schema.schemaVersion&&!([399n,403n,404n,411n].includes(schema.typeId)&&(schema.typeId===403n?[1n,2n,3n]:[1n,2n]).includes(value.schema.schemaVersion))))fail('wrong nested record schema');return;
 }
 if(kind==='id'){
  const namespace=identityNamespaces[body];if(namespace===undefined||typeof value==='boolean'||value.kind!=='typedIdentifier'||value.namespaceId!==BigInt(namespace))fail('wrong identifier family');
  const identifier=value as Extract<CanonicalValue,{kind:'typedIdentifier'}>;
  if(namespace>=1128&&namespace<=1141){if(typeof identifier.payload==='boolean'||identifier.payload.kind!=='unsigned')fail('occurrence requires unsigned ordinal');}
  if(namespace>=1040&&namespace<=1043){const p=identifier.payload;if(typeof p==='boolean'||p.kind!=='text'||!allocation.members.some(m=>m.namespace===namespace&&m.payload===p.value)&&!(namespace===1042&&p.value==='purpose/value-reason-face'))fail('member outside cognitive vocabulary');}
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

function validateDescriptions(raw:RecordValue):void {
 const value=raw.fields.get(6n);
 if(!value||typeof value==='boolean'||value.kind!=='list'||value.items.length>46)fail('described source list/capacity');
 const seen=new Set<string>(),goals=new Map<string,CanonicalValue>(),values=new Map<string,CanonicalValue>();let valueCount=0;
 for(const row of (value as Extract<CanonicalValue,{kind:'list'}>).items){
  if(typeof row==='boolean'||row.kind!=='list'||row.items.length!==3)return fail('description tuple');
  const [label,motive,signal]=row.items;
  if(typeof label==='boolean'||label.kind!=='text'||!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(label.value))fail('description label');
  if(typeof motive==='boolean'||motive.kind!=='typedIdentifier'||motive.namespaceId!==1040n||typeof motive.payload==='boolean'||motive.payload.kind!=='text'||!['Commitment','Value'].includes(motive.payload.value))return fail('description motive');
  checkType(signal,'r(TaskRawSignal)');if(!isRecord(signal))return fail('description signal');
  const source=signal.fields.get(1n);if(!source||!isRecord(source))return fail('description source key');
  const identity=key(list([label,motive,source]));if(seen.has(identity))fail('duplicate description identity');seen.add(identity);
  if(motive.payload.value==='Value'){valueCount++;values.set(key(signal),signal);}else goals.set(key(signal),signal);
 }
 if(valueCount>1)fail('one Value description');
 if(key(set([...goals.values()]))!==key(raw.fields.get(3n)!)||key(set([...values.values()]))!==key(raw.fields.get(5n)!))fail('description projection mismatch');
}

function validate(value:CanonicalValue):void {
 // Delegate maximal unchanged subtrees to the accepted predecessor decoder. An old
 // envelope such as171 may contain new records, so delegating by root TypeId fails.
 const extended=new WeakMap<object,boolean>();
 function containsExtension(v:CanonicalValue):boolean {
  if(typeof v==='boolean')return false;const known=extended.get(v);if(known!==undefined)return known;
  let result=false;
  if(v.kind==='record')result=[399n,403n,404n,411n].includes(v.schema.typeId)&&(v.schema.schemaVersion===2n||v.schema.typeId===403n&&v.schema.schemaVersion===3n)||[...v.fields.values()].some(containsExtension);
  else if(v.kind==='list'||v.kind==='set')result=v.items.some(containsExtension);
  else if(v.kind==='map')result=v.entries.some(([a,b])=>containsExtension(a)||containsExtension(b));
  else if(v.kind==='typedIdentifier')result=containsExtension(v.payload);
  extended.set(v,result);return result;
 }
 function visit(v:CanonicalValue):void {
  if(!containsExtension(v)){decodeEmbodied(canonicalEncode(v));return;}
  if(typeof v==='boolean')return;
  if(v.kind==='record'){
   if(v.schema.typeId===399n&&v.schema.schemaVersion===2n){
    const tag=v.fields.get(1n),receipt=v.fields.get(2n);
    if(v.fields.size!==2||!tag||typeof tag==='boolean'||tag.kind!=='unsigned'||tag.value!==3n||!receipt||typeof receipt==='boolean'||receipt.kind!=='typedIdentifier'||receipt.namespaceId!==1164n||typeof receipt.payload==='boolean'||receipt.payload.kind!=='unsigned'||receipt.payload.value<=0n)fail('Value receipt atom');
    return;
   }
   const declaration=declarations.get(`${v.schema.typeId}/${[403n,404n,411n].includes(v.schema.typeId)&&(v.schema.schemaVersion===2n||v.schema.typeId===403n&&v.schema.schemaVersion===3n)?1n:v.schema.schemaVersion}`);
   if(!declaration&&![130n,132n,160n].includes(v.schema.typeId)){
    // State/save trace wrappers carry arbitrary canonical VALUES, not cognitive
    // metadata. Admit successor records only in those existing value slots.
    const slots:Readonly<Record<string,readonly bigint[]>>={'144':[1n],'145':[3n,4n],'146':[2n],'147':[4n],'148':[3n,5n],'151':[2n]};
    const allowed=slots[String(v.schema.typeId)];
    if(!allowed||[...v.fields].some(([n,x])=>containsExtension(x)&&!allowed.includes(n)))fail('coupled draw in unrelated record');
   }
   if(declaration){
    for(const field of declaration.fields){const child=v.fields.get(BigInt(field.id));if(child===undefined){if(field.required)fail('missing required field');}else if(v.schema.typeId===411n&&v.schema.schemaVersion===2n&&field.id===2){
      if(isRecord(child)&&child.schema.typeId===113n){
       const entry=record(randomSchemas.mapEntry,new Map([[1n,v.fields.get(1n)!],[2n,child.fields.get(1n)!]]));
       compileComparison(record(randomSchemas.drawMap,new Map([[1n,list([entry])]])));
      }else checkType(child,field.type);
     }else if(v.schema.typeId===404n&&v.schema.schemaVersion===2n&&field.id===2){if(typeof child==='boolean'||child.kind!=='typedIdentifier'||child.namespaceId!==1040n||typeof child.payload==='boolean'||child.payload.kind!=='text'||child.payload.value!=='Value')fail('fixed Value motive required');}else checkType(child,field.type);}
    if(v.schema.typeId===403n&&[2n,3n].includes(v.schema.schemaVersion)){
     const extra=v.fields.get(5n)??fail('Value signals required');checkType(extra,'set(TaskRawSignal)');
     if(typeof extra==='boolean'||extra.kind!=='set'||extra.items.length>1)return fail('one Value source');
     for(const signal of extra.items){if(!isRecord(signal))return fail('Value source');const source=signal.fields.get(1n);if(!source||!isRecord(source))return fail('Value source key');const role=source.fields.get(3n);if(!role||typeof role==='boolean'||role.kind!=='unsigned'||role.value!==1n)fail('Value base only');}
    }
    if(v.schema.typeId===403n&&v.schema.schemaVersion===3n)validateDescriptions(v);
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
export const cognitiveAddedSchemas=()=>[...added,described,receiptAtom].map(s=>({...s,fields:s.fields.map(f=>({...f}))}));
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
export function validateCharacterRecordRoles(content:{recordRole:(type:bigint,field:bigint)=>Uint8Array|undefined;validateRole:(value:Uint8Array,role:Uint8Array)=>void},bytes:Uint8Array,valueReceiving=false,reasonDescriptions=false,valueProvenance=false){
 function visit(v:CanonicalValue):void {
  if(typeof v==='boolean')return;
  if(v.kind==='record'){if(v.schema.typeId===399n&&v.schema.schemaVersion===2n){if(!valueProvenance)fail('Value provenance requires successor model');return;}if(v.schema.typeId===403n&&v.schema.schemaVersion===3n&&!reasonDescriptions)fail('reason descriptions require successor model');const added=[403n,404n].includes(v.schema.typeId)&&v.schema.schemaVersion===2n;if(added&&!valueReceiving)fail('Value receiving requires successor model');for(const [field,value] of v.fields){if(v.schema.typeId===404n&&v.schema.schemaVersion===2n&&field===2n)continue;const role=content.recordRole(v.schema.typeId,field);if(role)content.validateRole(canonicalEncode(value),role);}for(const value of v.fields.values())visit(value);}
  else if(v.kind==='list'||v.kind==='set')v.items.forEach(visit);else if(v.kind==='map')for(const [k,value] of v.entries){visit(k);visit(value);}
 }
 visit(decodeCognitive(bytes));
}

/** Strict reader for already admitted predecessor and receiving records. */
export function receivingRecord(value:CanonicalValue,typeId:bigint):RecordValue {
 if(!isRecord(value)||value.schema.typeId!==typeId||!(value.schema.schemaVersion===1n||[403n,404n].includes(typeId)&&value.schema.schemaVersion===2n||typeId===403n&&value.schema.schemaVersion===3n))return fail('unsupported receiving record version');
 return value;
}
