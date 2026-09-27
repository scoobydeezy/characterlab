import {list,set,map,text,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {validateData} from './biologyPublicCodecs';
import {dataOnly} from './biologyPublicMath';
/** Only the admitted canonical tree; no JSON parse, prototypes or executable fields. */
export function data(v:unknown):CanonicalValue {
 dataOnly(v);
 if(v===null)return set([]);
 if(typeof v==='boolean')return v;
 if(typeof v==='string')return text(v);
 if(typeof v==='number'){if(!Number.isSafeInteger(v))throw Error('BIOLOGY_INTEGER');return signed(v);}
 if(Array.isArray(v))return list(v.map(data));
 return map(Object.entries(v as object).map(([k,x])=>[text(k),data(x)]));
}
export function value<T>(v:CanonicalValue):T {
 validateData(v);
 function decode(x:CanonicalValue):unknown {
  if(typeof x==='boolean')return x;
  if(x.kind==='signed')return Number(x.value);
  if(x.kind==='text')return x.value;
  if(x.kind==='set')return null;
  if(x.kind==='list')return x.items.map(decode);
  if(x.kind==='map')return Object.fromEntries(x.entries.map(([k,v])=>[(k as {value:string}).value,decode(v)]));
  throw Error('BIOLOGY_DATA');
 }
 return decode(v) as T;
}
