/** Structural vocabulary for the frozen measurement-memory model. No activation authority. */
import memory from '../../docs/formal/MEASUREMENT_MEMORY_ALLOCATION_TABLE.json';
import wrappers from '../../docs/formal/MEMORY_WRAPPER_ALLOCATION_TABLE.json';
import {canonicalDecode,canonicalEncode,record,RecordSchemaRegistry,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {measurementSupportedSchemas} from './measurementModelSource';
import {invalidModel} from './canonicalData';
const additions:readonly RecordSchema[]=Object.freeze([...memory.records,...wrappers.records].map(s=>Object.freeze({typeId:BigInt(s.typeId),schemaVersion:1n,name:s.name,fields:Object.freeze(s.fields.map(f=>Object.freeze({id:BigInt(f.id),name:f.name,required:f.required})))})));
const all=[...measurementSupportedSchemas(),...additions],registry=new RecordSchemaRegistry();
for(const s of all)registry.register(s);
export const memorySupportedSchemas=()=>all.map(s=>({...s,fields:s.fields.map(f=>({...f}))}));
export const memoryAddedSchemas=()=>additions.map(s=>({...s,fields:s.fields.map(f=>({...f}))}));
export const decodeMemory=(bytes:Uint8Array)=>canonicalDecode(bytes,registry);
export const cloneMemory=(v:CanonicalValue)=>decodeMemory(canonicalEncode(v));
export function memoryRecord(type:number,values:readonly CanonicalValue[]){
 const schema=all.find(s=>s.typeId===BigInt(type));if(!schema)invalidModel('unknown memory schema');
 return record(schema,new Map(values.map((v,i)=>[BigInt(i+1),v])));
}
export function memoryNamed(type:number,values:Readonly<Record<string,CanonicalValue>>){
 const schema=all.find(s=>s.typeId===BigInt(type));if(!schema)invalidModel('unknown memory schema');
 return record(schema,new Map(Object.entries(values).map(([name,v])=>{const f=schema.fields.find(f=>f.name===name);if(!f)invalidModel('unknown memory field');return [f.id,v];})));
}
