/** Internal strict readers for already schema-admitted model declarations. */
import {bytesToHex,canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SchedulerContractError} from '../substrate/scheduler';
export type RecordValue=Extract<CanonicalValue,{kind:'record'}>;
export type IdentityValue=Extract<CanonicalValue,{kind:'typedIdentifier'}>;
export const dataKey=(value:CanonicalValue)=>bytesToHex(canonicalEncode(value));
export function invalidModel(message:string):never {throw new SchedulerContractError('INVALID_CONFIGURATION',message);}
export function dataRecord(value:CanonicalValue,typeId:bigint):RecordValue {
  if(typeof value==='boolean'||value.kind!=='record'||value.schema.typeId!==typeId||value.schema.schemaVersion!==1n)invalidModel(`requires ${typeId}/1`);
  return value as RecordValue;
}
export function dataField(value:RecordValue,id:bigint):CanonicalValue {return value.fields.get(id)??invalidModel(`missing field ${id}`);}
export function dataUnsigned(value:CanonicalValue):bigint {
  if(typeof value==='boolean'||value.kind!=='unsigned')invalidModel('requires unsigned');return (value as {value:bigint}).value;
}
export function dataText(value:CanonicalValue):string {
  if(typeof value==='boolean'||value.kind!=='text')invalidModel('requires text');return (value as {value:string}).value;
}
export function dataIdentity(value:CanonicalValue):IdentityValue {
  if(typeof value==='boolean'||value.kind!=='typedIdentifier')invalidModel('requires identity atom');return value as IdentityValue;
}
export function dataItems(value:CanonicalValue,kind:'set'|'list'):readonly CanonicalValue[] {
  if(typeof value==='boolean'||value.kind!==kind)invalidModel(`requires ${kind}`);return (value as {items:readonly CanonicalValue[]}).items;
}
