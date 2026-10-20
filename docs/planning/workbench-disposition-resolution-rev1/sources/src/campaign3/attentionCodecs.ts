/** attention-allocation/0.1-candidate. Structural decoding grants no ingress authority. */
import allocation from '../../docs/formal/ATTENTION_ALLOCATION_TABLE.json';
import {canonicalDecode,canonicalEncode,record,RecordSchemaRegistry,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {cognitiveSupportedSchemas,decodeCognitive} from '../campaign2/cognitiveCodecs';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {SchedulerContractError} from '../substrate/scheduler';
type R=Extract<CanonicalValue,{kind:'record'}>;
const added:RecordSchema[]=allocation.records.map(r=>({typeId:BigInt(r.typeId),schemaVersion:1n,name:r.name,fields:r.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))}));
const schemas=[...cognitiveSupportedSchemas(),...added],registry=new RecordSchemaRegistry(schemas),byType=new Map(schemas.map(s=>[s.typeId,s])),byName=new Map(schemas.map(s=>[s.name,s])),decl=new Map(allocation.records.map(r=>[BigInt(r.typeId),r]));
const aliases:Readonly<Record<string,number>>=allocation.identifierAliases,enums:Readonly<Record<string,readonly {name:string;value:number}[]>>=allocation.finiteEnums;
const fail=(why:string):never=>{throw new SchedulerContractError('INVALID_CONFIGURATION','attention grammar: '+why);};
function typed(v:CanonicalValue,type:string):void{
 const collection=/^(set|list)([^<]*)<(.*)>$/.exec(type);
 if(collection){if(typeof v==='boolean'||v.kind!==collection[1])fail('collection '+type);const items=(v as Extract<CanonicalValue,{kind:'set'|'list'}>).items,bound=collection[2];if(bound){const [lo,hi]=bound.split('..').map(Number);if(items.length<lo||items.length>(hi??lo))fail('collection bound');}for(const x of items)typed(x,collection[3]);return;}
 if(enums[type]){if(typeof v==='boolean'||v.kind!=='unsigned'||!enums[type].some(x=>BigInt(x.value)===v.value))fail('closed '+type);return;}
 if(type==='boolean'){if(typeof v!=='boolean')fail('boolean');return;}
 if(type==='text'||type==='unsigned'){if(typeof v==='boolean'||v.kind!==type)fail(type);return;}
 if(type==='existing:SimInstant'){if(typeof v==='boolean'||v.kind!=='signed'||v.value<1n)fail('positive instant');return;}
 if(type==='existing:Rational'){if(typeof v==='boolean'||v.kind!=='rational')fail('rational');return;}
 const family=/^(existing|new):([A-Za-z]+)$/.exec(type);
 if(family&&aliases[family[2]]){const ns=aliases[family[2]];if(typeof v==='boolean'||v.kind!=='typedIdentifier'||v.namespaceId!==BigInt(ns))fail('identity '+family[2]);const value=v as Extract<CanonicalValue,{kind:'typedIdentifier'}>;if(ns===1002)validateSemanticReferent(value);else if(ns>=1100){if(typeof value.payload==='boolean'||value.payload.kind!=='unsigned')fail('occurrence payload');}else if(typeof value.payload==='boolean'||value.payload.kind!=='text'||!value.payload.value)fail('text identity');return;}
 const s=type.startsWith('existing:')?byType.get(BigInt(type.slice(9))):byName.get(type);if(!s||typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==s.typeId||v.schema.schemaVersion!==s.schemaVersion)fail('nested '+type);
}
function validate(v:CanonicalValue):void{
 if(typeof v==='boolean')return;
 if(v.kind==='record'){
  const declaration=decl.get(v.schema.typeId);
  if(declaration){for(const f of declaration.fields){const x=v.fields.get(BigInt(f.id));if(x!==undefined)typed(x,f.type);}const variants=allocation.unionDefinitions.filter(u=>BigInt(u.recordTypeId)===v.schema.typeId);if(variants.length){const tag=v.fields.get(1n),variant=variants.find(u=>typeof tag!=='boolean'&&tag?.kind==='unsigned'&&BigInt(u.tag)===tag.value);if(!variant)fail('union tag');for(const n of variant!.requiredPayloadFieldIds)if(!v.fields.has(BigInt(n)))fail('required union operand');for(const n of variant!.forbiddenPayloadFieldIds)if(v.fields.has(BigInt(n)))fail('forbidden union operand');}}
  for(const x of v.fields.values())validate(x);
 }else if(v.kind==='list'||v.kind==='set')v.items.forEach(validate);else if(v.kind==='map')for(const [k,x]of v.entries){validate(k);validate(x);}
}
export function decodeAttention(bytes:Uint8Array):CanonicalValue{const value=canonicalDecode(bytes,registry);validate(value);return value;}
export function attentionSchema(type:bigint):RecordSchema{return byType.get(type)??fail('unknown schema');}
export function attentionRecord(name:string|number,values:readonly CanonicalValue[]):R{return attentionRawRecord(name,new Map(values.map((v,i)=>[BigInt(i+1),v])));}
export function attentionRawRecord(name:string|number,fields:ReadonlyMap<bigint,CanonicalValue>):R{const s=typeof name==='number'?attentionSchema(BigInt(name)):byName.get(name);if(!s)fail('unknown record');const value=record(s!,fields);validate(value);return value as R;}
export const attentionSupportedSchemas=()=>schemas.slice();
/** Validate old-only values through the preserved profile when independently needed. */
export const validateAttentionInherited=(value:CanonicalValue)=>decodeCognitive(canonicalEncode(value));
