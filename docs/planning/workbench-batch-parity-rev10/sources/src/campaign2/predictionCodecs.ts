/** Allocated prediction vocabulary for review construction; no activation authority. */
import allocation from '../../docs/formal/MEASUREMENT_PREDICTION_ALLOCATION_TABLE.json';
import correction from '../../docs/formal/MEASUREMENT_PREDICTION_CORRECTION_ALLOCATION_TABLE.json';
import {canonicalDecode,canonicalEncode,record,RecordSchemaRegistry,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {memorySupportedSchemas} from './memoryCodecs';
import {invalidModel} from './canonicalData';
const current=allocation.records.map(r=>correction.records.find(x=>x.typeId===r.typeId)??r);
const added:readonly RecordSchema[]=current.map(r=>({typeId:BigInt(r.typeId),schemaVersion:BigInt(r.schemaVersion),name:r.name,fields:r.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))}));
const all=[...memorySupportedSchemas(),...added],registry=new RecordSchemaRegistry();
for(const schema of all)registry.register(schema);
function checkRetired(value:CanonicalValue):void {
 if(typeof value==='boolean')return;
 if(value.kind==='record'){
  if(value.schema.typeId===367n&&(value.schema.schemaVersion!==2n||value.fields.get(2n)!==undefined))invalidModel('prediction output definition requires367/2 with retired field2 absent');
  for(const v of value.fields.values())if(v!==undefined)checkRetired(v);
 }else if(value.kind==='list'||value.kind==='set')for(const v of value.items)checkRetired(v);
 else if(value.kind==='map')for(const [k,v] of value.entries){checkRetired(k);checkRetired(v);}
 else if(value.kind==='typedIdentifier')checkRetired(value.payload);
}
export function decodePrediction(bytes:Uint8Array):CanonicalValue {const v=canonicalDecode(bytes,registry);checkRetired(v);return v;}
export const clonePrediction=(v:CanonicalValue)=>decodePrediction(canonicalEncode(v));
export const predictionAddedSchemas=()=>added.map(s=>({...s,fields:s.fields.map(f=>({...f}))}));
export const predictionSupportedSchemas=()=>all.map(s=>({...s,fields:s.fields.map(f=>({...f}))}));
export function predictionRecord(type:number,values:readonly CanonicalValue[]):CanonicalValue {
 const schema=all.find(s=>s.typeId===BigInt(type));if(!schema)invalidModel('unknown prediction review schema');
 const v=record(schema,new Map(values.map((v,i)=>[BigInt(i+1),v])));checkRetired(v);return v;
}
export function predictionNamed(type:number,values:Readonly<Record<string,CanonicalValue>>):CanonicalValue {
 const schema=all.find(s=>s.typeId===BigInt(type));if(!schema)invalidModel('unknown prediction review schema');
 const v=record(schema,new Map(Object.entries(values).map(([name,v])=>{const f=schema.fields.find(f=>f.name===name);if(!f)invalidModel('unknown prediction review field');return [f.id,v];})));checkRetired(v);return v;
}
