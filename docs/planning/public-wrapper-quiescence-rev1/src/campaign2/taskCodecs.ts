/** task-commitment-allocation/0.2-candidate. Declaration construction only; no activation. */
import allocation from '../../docs/formal/TASK_COMMITMENT_CORRECTION_ALLOCATION_TABLE.json';
import {canonicalDecode,canonicalEncode,record,RecordSchemaRegistry,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {predictionSupportedSchemas} from './predictionCodecs';
import {invalidModel} from './canonicalData';

const added:readonly RecordSchema[]=allocation.records.map(r=>({typeId:BigInt(r.typeId),schemaVersion:BigInt(r.schemaVersion),name:r.name,fields:r.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))}));
const schemas=[...predictionSupportedSchemas(),...added],registry=new RecordSchemaRegistry();
for(const schema of schemas)registry.register(schema);

function validateUnions(value:CanonicalValue):void {
 if(typeof value==='boolean')return;
 if(value.kind==='record'){
  // Preserve the prediction correction in this extended decoder too.
  if(value.schema.typeId===367n&&(value.schema.schemaVersion!==2n||value.fields.has(2n)))invalidModel('prediction output definition requires367/2 with retired field2 absent');
  if(value.schema.typeId===372n){
   const tag=value.fields.get(1n);
   if(!tag||typeof tag==='boolean'||tag.kind!=='unsigned')invalidModel('task status requires unsigned tag');
   const variant=allocation.unionVariants.find(v=>BigInt(v.tag)===tag.value);
   if(!variant||variant.requiredFields.some(f=>value.fields.get(BigInt(f))===undefined)||variant.forbiddenFields.some(f=>value.fields.get(BigInt(f))!==undefined))invalidModel('task status union payload');
  }
  for(const child of value.fields.values())if(child!==undefined)validateUnions(child);
 }else if(value.kind==='list'||value.kind==='set')value.items.forEach(validateUnions);
 else if(value.kind==='map')for(const [k,v] of value.entries){validateUnions(k);validateUnions(v);}
 else if(value.kind==='typedIdentifier')validateUnions(value.payload);
}
export function decodeTask(bytes:Uint8Array):CanonicalValue {const value=canonicalDecode(bytes,registry);validateUnions(value);return value;}
export const cloneTask=(value:CanonicalValue)=>decodeTask(canonicalEncode(value));
export const taskAddedSchemas=()=>added.map(s=>({...s,fields:s.fields.map(f=>({...f}))}));
export const taskSupportedSchemas=()=>schemas.map(s=>({...s,fields:s.fields.map(f=>({...f}))}));
export function taskNamed(type:number,values:Readonly<Record<string,CanonicalValue>>):CanonicalValue {
 const schema=schemas.find(s=>s.typeId===BigInt(type));if(!schema)invalidModel('unknown task declaration schema');
 const value=record(schema,new Map(Object.entries(values).map(([name,value])=>{const field=schema.fields.find(f=>f.name===name);if(!field)invalidModel('unknown task declaration field');return [field.id,value];})));
 validateUnions(value);return value;
}
export function taskRecord(type:number,values:readonly CanonicalValue[]):CanonicalValue {
 const schema=schemas.find(s=>s.typeId===BigInt(type));if(!schema)invalidModel('unknown task declaration schema');
 if(values.length>schema.fields.length)invalidModel('extra task declaration field');
 const value=record(schema,new Map(values.map((v,i)=>[BigInt(i+1),v])));validateUnions(value);return value;
}
