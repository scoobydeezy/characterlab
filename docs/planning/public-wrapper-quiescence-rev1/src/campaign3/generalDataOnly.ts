/** Strict outer ingress. Inspect descriptors before reading caller values. */
import {invalidModel as fail} from '../campaign2/canonicalData';
export function generalDataFields(value:unknown,names:readonly string[]){
 if(!value||Object.getPrototypeOf(value)!==Object.prototype)fail('GA plain data object required');
 const fields=Object.getOwnPropertyDescriptors(value);if(Reflect.ownKeys(fields).length!==names.length||names.some(n=>!fields[n]||!('value'in fields[n])))fail('GA exact data fields required');
 return fields;
}
export function generalDataBytes(value:unknown):Uint8Array{
 if(!(value instanceof Uint8Array)||Object.getPrototypeOf(value)!==Uint8Array.prototype||Reflect.ownKeys(value).some(k=>typeof k!=='string'||!/^(0|[1-9][0-9]*)$/.test(k)))fail('GA plain byte array required');
 const length=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype),'length')!.get!.call(value),copy=new Uint8Array(length);Uint8Array.prototype.set.call(copy,value);return copy;
}
