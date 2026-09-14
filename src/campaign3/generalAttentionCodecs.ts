/** general-attention-carrier/0.1-candidate and its frozen allocation,
 * plus general-attention-registration-write-scope/0.1-candidate (705/706).
 * Structural grammar only: decoding is not source, role-domain or model admission. */
import allocation from '../../docs/formal/GENERAL_ATTENTION_CARRIER_ALLOCATION_TABLE.json';
import writeScopeAllocation from '../../docs/formal/GENERAL_ATTENTION_WRITE_SCOPE_ALLOCATION_TABLE.json';
import shape from '../../docs/formal/GENERAL_ATTENTION_CARRIER_CANDIDATE.json';
import attentionAllocation from '../../docs/formal/ATTENTION_ALLOCATION_TABLE.json';
import {canonicalDecode,canonicalEncode,record,RecordSchemaRegistry,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {attentionSupportedSchemas,decodeAttention} from './attentionCodecs';
import {receivingSupportedSchemas,decodeReceiving} from './receivingCodecs';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {validateGeneralPrimitive,type GeneralPrimitive,type GeneralPrimitiveContext} from './generalPrimitiveGrammar';

type R=Extract<CanonicalValue,{kind:'record'}>;
type Type={kind:'ref';name:string}|{kind:'enum';values:readonly string[]}|{kind:'union';alternatives:readonly Type[]}|{kind:'list'|'set';min:number;max:number;element:Type}|{kind:'map';min:number;max:number;key:Type;value:Type};
interface Declaration {typeId:number;schemaVersion:number;name:string;fields:readonly {id:number;name:string;required:boolean;type:Type}[]}
const declarations=[...allocation.records,...writeScopeAllocation.records] as readonly Declaration[];
const added:RecordSchema[]=declarations.map(r=>Object.freeze({typeId:BigInt(r.typeId),schemaVersion:BigInt(r.schemaVersion),name:r.name,fields:Object.freeze(r.fields.map(f=>Object.freeze({id:BigInt(f.id),name:f.name,required:f.required})))}));
const prior=new Map<string,RecordSchema>();
for(const s of [...attentionSupportedSchemas(),...receivingSupportedSchemas()]){
 const key=`${s.typeId}/${s.schemaVersion}`,old=prior.get(key);
 if(old&&(old.name!==s.name||old.fields.length!==s.fields.length||old.fields.some((f,i)=>f.id!==s.fields[i].id||f.name!==s.fields[i].name||f.required!==s.fields[i].required)))throw Error('GENERAL_CARRIER_INHERITED_SCHEMA_CONFLICT');
 prior.set(key,s);
}
const schemas=[...prior.values(),...added],registry=new RecordSchemaRegistry(schemas),byName=new Map(added.map(s=>[s.name,s])),byId=new Map(declarations.map(d=>[BigInt(d.typeId),d]));
const attentionTypes=new Set(attentionAllocation.records.map(r=>BigInt(r.typeId)));
function validateInherited(value:R):void{(attentionTypes.has(value.schema.typeId)?decodeAttention:decodeReceiving)(canonicalEncode(value));}
const identities=new Map(allocation.rolePositions.map(p=>[p.identity,BigInt(p.requiredNamespace)]));
// Some inherited carrier names describe a closed existing-record union (461/463).
const inherited=new Map(shape.recordBoundaries.filter(b=>b.mode==='InheritedRecordRoles').map(b=>[b.record,b.source!.replace('existing','').split('/').map(BigInt)]));
function fail(reason:string):never{throw Error('GENERAL_CARRIER_GRAMMAR: '+reason);}
function isRecord(value:CanonicalValue,ids:readonly bigint[]):value is R{return typeof value!=='boolean'&&value.kind==='record'&&value.schema.schemaVersion===1n&&ids.includes(value.schema.typeId);}
function typed(value:CanonicalValue,type:Type,context:GeneralPrimitiveContext):void{
 if(type.kind==='ref'){
  const s=byName.get(type.name);if(s){if(!isRecord(value,[s.typeId]))fail('record '+type.name);validate(value,context);return;}
  const old=inherited.get(type.name);if(old){if(!isRecord(value,old))fail('inherited record '+type.name);validateInherited(value);return;}
  const ns=identities.get(type.name);if(ns!==undefined){
   if(typeof value==='boolean'||value.kind!=='typedIdentifier'||value.namespaceId!==ns)fail('identity '+type.name);
   if(ns===1002n)validateSemanticReferent(value);
   else if(ns>=1100n){if(typeof value.payload==='boolean'||value.payload.kind!=='unsigned')fail('occurrence payload');}
   else if(typeof value.payload==='boolean'||value.payload.kind!=='text'||!value.payload.value)fail('vocabulary payload');
   return;
  }
  validateGeneralPrimitive(type.name as GeneralPrimitive,value,context);return;
 }
 if(type.kind==='enum'){if(typeof value==='boolean'||value.kind!=='unsigned'||value.value<1n||value.value>BigInt(type.values.length))fail('finite tag');return;}
 if(type.kind==='union'){
  if(typeof value==='boolean'||value.kind!=='record')fail('record union');
  const option=type.alternatives.find(t=>t.kind==='ref'&&(byName.get(t.name)?.typeId===value.schema.typeId||inherited.get(t.name)?.includes(value.schema.typeId)));
  if(!option)fail('union alternative');typed(value,option,context);return;
 }
 if(typeof value==='boolean'||value.kind!==type.kind)fail('collection kind');
 if(type.kind==='map'){
  if(value.kind!=='map')fail('map');if(value.entries.length<type.min||value.entries.length>type.max)fail('map bound');
  for(const[k,v]of value.entries){typed(k,type.key,context);typed(v,type.value,context);}return;
 }
 if(value.kind!=='list'&&value.kind!=='set')fail('sequence');
 if(value.items.length<type.min||value.items.length>type.max)fail('collection bound');
 for(const v of value.items)typed(v,type.element,context);
}
function validate(value:CanonicalValue,context:GeneralPrimitiveContext):void{
 if(typeof value==='boolean')return;
 if(value.kind==='record'){
  const d=byId.get(value.schema.typeId);
  if(!d){validateInherited(value);return;}
  if(value.schema.schemaVersion!==BigInt(d.schemaVersion))fail('schema version');
  for(const f of d.fields){const v=value.fields.get(BigInt(f.id));if(v!==undefined)typed(v,f.type,context);}
 }else if(value.kind==='list'||value.kind==='set')for(const v of value.items)validate(v,context);
 else if(value.kind==='map')for(const[k,v]of value.entries){validate(k,context);validate(v,context);}
 else if(value.kind==='typedIdentifier')validate(value.payload,context);
}
/** Context must come from a compiled model for downstream admission. This API
 * only checks a value against supplied grammar bounds and grants no capability. */
export function decodeGeneralAttention(bytes:Uint8Array,context:GeneralPrimitiveContext={}):CanonicalValue{
 const value=canonicalDecode(bytes,registry);validate(value,context);return value;
}
export function generalAttentionSchema(name:string):RecordSchema{return byName.get(name)??fail('unknown new schema');}
export function generalAttentionRawRecord(name:string,fields:ReadonlyMap<bigint,CanonicalValue>,context:GeneralPrimitiveContext={}):R{
 // Normalize through the authoritative schema registry. Forged nested field schemas
 // cannot weaken required fields or introduce fields accepted only by the caller.
 return decodeGeneralAttention(canonicalEncode(record(generalAttentionSchema(name),fields)),context) as R;
}
export function generalAttentionRecord(name:string,values:readonly CanonicalValue[],context:GeneralPrimitiveContext={}):R{
 return generalAttentionRawRecord(name,new Map(values.map((v,i)=>[BigInt(i+1),v])),context);
}
export const generalAttentionSupportedSchemas=():RecordSchema[]=>schemas.slice();
