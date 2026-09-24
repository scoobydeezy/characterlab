/** personGoal-public-allocation/0.1-candidate. Closed structural grammar only. */
import allocation from '../../docs/formal/PERSON_GOAL_PUBLIC_ALLOCATION_TABLE.json';
import {canonicalDecode,canonicalEncode,record,list,set,map,bytes,typedIdentifier,RecordSchemaRegistry,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {controlSupportedSchemas,decodeControl} from './controlCodecs';
import {validateSemanticReferent} from '../substrate/referentOrigin';
type R=Extract<CanonicalValue,{kind:'record'}>;
type T=string|{list:T;min:number;max:number}|{map:T[];min:number;max:number}|{set:T;min:number;max:number}|{enum:number[]}|{oneOf:T[]};
const added:RecordSchema[]=allocation.records.map(d=>({typeId:BigInt(d.typeId),schemaVersion:1n,name:d.name,fields:d.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))}));
const schemas=[...controlSupportedSchemas(),...added],registry=new RecordSchemaRegistry(schemas),byId=new Map(allocation.records.map(d=>[BigInt(d.typeId),d]));
const fail=(why:string):never=>{throw Error('PERSON_GOAL_CODEC: '+why);};
function envelope(v:CanonicalValue):CanonicalValue {
 if(typeof v==='boolean')return v;
 if(v.kind==='record'){
  if(byId.has(v.schema.typeId))return fail('new record outside an inherited open canonical slot');
  // The inherited GA codec admits these exact canonical-value slots. Surrogates
  // are legal only here, never as a generic replacement inside typed fields.
  const open:Readonly<Record<string,readonly bigint[]>>={'130':[6n,7n],'132':[8n,9n,10n,11n,12n],'142':[1n],'145':[3n,4n],'146':[2n],'147':[4n],'148':[3n,5n],'151':[2n],'160':[12n,13n],'162':[11n],'171':[4n]};
  return record(v.schema,new Map([...v.fields].map(([k,x])=>{
   if(open[String(v.schema.typeId)]?.includes(k)&&containsNew(x)){validate(x);return [k,bytes(canonicalEncode(x))];}
   if(v.schema.typeId===147n&&k===5n&&containsNew(x)){
    if(typeof x==='boolean'||x.kind!=='list')return fail('derived-source list');
    return [k,list(x.items.map(tuple=>{if(typeof tuple==='boolean'||tuple.kind!=='list'||tuple.items.length!==3)return fail('derived-source tuple');const [path,presence,actual]=tuple.items;if(typeof presence!=='boolean')return fail('derived-source presence');validate(actual);return list([envelope(path),presence,bytes(canonicalEncode(actual))]);}))];
   }
   return [k,envelope(x)];
  })));
 }
 if(v.kind==='list')return list(v.items.map(envelope));
 if(v.kind==='set')return set(v.items.map(envelope));
 if(v.kind==='map')return map(v.entries.map(([k,x])=>[envelope(k),envelope(x)]));
 if(v.kind==='typedIdentifier')return typedIdentifier(v.namespaceId,envelope(v.payload));
 return v;
}
function containsNew(v:CanonicalValue):boolean {if(typeof v==='boolean')return false;if(v.kind==='record')return byId.has(v.schema.typeId)||[...v.fields.values()].some(containsNew);if(v.kind==='list'||v.kind==='set')return v.items.some(containsNew);if(v.kind==='map')return v.entries.some(([k,x])=>containsNew(k)||containsNew(x));return false;}
function typed(v:CanonicalValue,t:T):void {
 if(typeof t!=='string'){
  if('oneOf'in t){for(const candidate of t.oneOf)try{typed(v,candidate);return;}catch{/* next closed alternative */}return fail('union');}
  if(typeof v==='boolean')return fail('container');
  if('enum'in t){if(v.kind!=='unsigned'||!t.enum.some(n=>BigInt(n)===v.value))fail('enum');return;}
  if('set'in t){if(v.kind!=='set'||v.items.length<t.min||v.items.length>t.max)return fail('set bound');v.items.forEach(x=>typed(x,t.set));return;}
  if('list'in t){if(v.kind!=='list'||v.items.length<t.min||v.items.length>t.max)return fail('list bound');v.items.forEach(x=>typed(x,t.list));return;}
  if(v.kind!=='map'||v.entries.length<t.min||v.entries.length>t.max)return fail('map bound');v.entries.forEach(([k,x])=>{typed(k,t.map[0]);typed(x,t.map[1]);});return;
 }
 if(t==='bool'){if(typeof v!=='boolean')fail('boolean');return;}
 if(typeof v==='boolean')return fail(t);
 if(t.startsWith('ref:')){if(v.kind!=='record'||v.schema.typeId!==BigInt(t.slice(4))||v.schema.schemaVersion!==1n)return fail(t);validate(v);return;}
 if(t.startsWith('id:')){if(v.kind!=='typedIdentifier'||v.namespaceId!==BigInt(t.slice(3)))return fail(t);if(v.namespaceId===1002n)validateSemanticReferent(v);else if(v.namespaceId>=1100n){if(typeof v.payload==='boolean'||v.payload.kind!=='unsigned')fail('occurrence');}else if(typeof v.payload==='boolean'||v.payload.kind!=='text'||!v.payload.value)fail('identity payload');return;}
 if(t==='u'||t==='i'||t==='text'){if(v.kind!==({u:'unsigned',i:'signed',text:'text'} as const)[t])fail(t);return;}
 if(v.kind!=='rational')return fail(t);const n=v.numerator,d=v.denominator;
 if(t==='q')return;
 if(['positiveQ','nonnegativeQ','unitQ'].includes(t)&&(n<0n||t==='positiveQ'&&n===0n))fail(t);
 if(['unitQ','signedUnitQ','nonzeroSignedUnitQ'].includes(t)&&(n>d||n< -d))fail(t);
 if(t==='nonzeroSignedUnitQ'&&n===0n)fail(t);
 if(!['positiveQ','nonnegativeQ','unitQ','signedUnitQ','nonzeroSignedUnitQ'].includes(t))fail('unknown primitive');
}
function newChildren(v:CanonicalValue):void {if(typeof v==='boolean')return;if(v.kind==='record'){if(byId.has(v.schema.typeId)){validate(v);return;}[...v.fields.values()].forEach(newChildren);}else if(v.kind==='list'||v.kind==='set')v.items.forEach(newChildren);else if(v.kind==='map')v.entries.forEach(([k,x])=>{newChildren(k);newChildren(x);});}
function validate(v:CanonicalValue):void {
 if(typeof v!=='boolean'&&(v.kind==='list'||v.kind==='set')){v.items.forEach(validate);return;}
 if(typeof v!=='boolean'&&v.kind==='map'){v.entries.forEach(([k,x])=>{validate(k);validate(x);});return;}
 if(typeof v!=='boolean'&&v.kind==='record'&&byId.has(v.schema.typeId)){
  const declaration=byId.get(v.schema.typeId)!;
  for(const f of declaration.fields){const value=v.fields.get(BigInt(f.id));if(value!==undefined)typed(value,f.type as T);}
 }else {decodeControl(canonicalEncode(envelope(v)));newChildren(v);}
}
export function decodePersonGoal(bytes:Uint8Array):CanonicalValue {const value=canonicalDecode(bytes,registry);validate(value);return value;}
export function personGoalSchema(name:string|number):RecordSchema {return added.find(s=>typeof name==='number'?s.typeId===BigInt(name):s.name===name)??fail('schema');}
export function personGoalRecord(name:string|number,values:readonly CanonicalValue[]|ReadonlyMap<bigint,CanonicalValue>):R {return decodePersonGoal(canonicalEncode(record(personGoalSchema(name),values instanceof Map?values:new Map((values as readonly CanonicalValue[]).map((v,i)=>[BigInt(i+1),v]))))) as R;}
export const personGoalSupportedSchemas=()=>schemas.slice();




