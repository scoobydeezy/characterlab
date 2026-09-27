import {canonicalEncode as enc,list,set,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {lyingRecord as r} from '../campaign3/lyingCodecs';
export const seed=new Uint8Array(32).fill(13),initialState=enc(set([]));
export type Frame={at:number;truth?:boolean;display?:boolean;privateAccess?:boolean;delivery?:boolean;a?:boolean;b?:boolean};
export const original=(x:Frame)=>r(1084,[signed(x.at),x.truth??true,x.display??true,x.privateAccess??true,x.delivery??true,x.a??true,x.b??true]);
export const ordered=(xs:Frame[])=>enc(list(xs.map(original)));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
export function cases(){
 const main:Frame[]=[{at:1,b:false},{at:2,privateAccess:false,a:false},{at:3,display:false},{at:4,privateAccess:false,a:false,b:false}];
 return {resistant:[{at:1,display:false},{at:2,display:false},{at:3,display:true},{at:4,privateAccess:false,a:false,b:false}],main,hiddenTruth:main.map(x=>({...x,truth:false})),evidenceChange:main.map(x=>({...x,display:!(x.display??true)})),
  failed:main.map(x=>({...x,delivery:false})),noA:main.map(x=>({...x,a:false})),noB:main.map(x=>({...x,b:false})),
  both:main.map(x=>({...x,a:true,b:true})),unknown:main.map(x=>({...x,privateAccess:false})),negative:main.map(x=>({...x,display:false})),
  deniedPrivate:main.map(x=>x.at===3?{...x,privateAccess:false}:x),failedFirst:main.map(x=>x.at===1?{...x,delivery:false}:x),
  firstOnly:[{at:1}],misleading:[{at:1,truth:false,display:true},{at:2,truth:false,privateAccess:false,a:false,b:false}]} satisfies Record<string,Frame[]>;
}
