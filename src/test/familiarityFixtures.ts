import {canonicalEncode as enc,list,set,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {familiarityRecord as r} from '../campaign3/familiarityCodecs';
export const seed=new Uint8Array(32).fill(12),initialState=enc(set([]));
export type Frame={at:number;present?:boolean;category?:number;identity?:number;a?:boolean;b?:boolean;detail?:boolean;visible?:boolean;accessA?:boolean;accessB?:boolean;accessDetail?:boolean};
export const original=(x:Frame)=>r(1056,[signed(x.at),x.present??true,u(x.category??1),u(x.identity??1),x.a??true,x.b??true,x.detail??true,x.visible??true,x.accessA??true,x.accessB??true,x.accessDetail??true]);
export const ordered=(xs:Frame[])=>enc(list(xs.map(original)));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
export function cases(){
 const main:Frame[]=[{at:1},{at:4,present:false},{at:5,b:false}];
 const last=(change:Partial<Frame>)=>main.map((x,i)=>i===2?{...x,...change}:x);
 return {main,same:last({b:true}),novel:last({a:false,b:false}),place:main.map(x=>({...x,category:2})),otherCategory:last({category:2}),hiddenIdentity:last({identity:2}),
  deniedFirst:main.map((x,i)=>i===0?{...x,visible:false}:x),absentFirst:main.map((x,i)=>i===0?{...x,present:false}:x),
  noFeatures:last({accessA:false,accessB:false}),falseFeatures:main.map(x=>({...x,a:false,b:false})),unknownFeatures:main.map(x=>({...x,a:false,b:false,accessA:false,accessB:false})),
  partialKnown:last({b:true,accessB:false}),recent:[{at:1},{at:2,b:false}],
  tie:[{at:1},{at:2,detail:false},{at:5,present:false},{at:6,b:false}],changing:[...main,{at:6,b:false}],firstOnly:[{at:1}],detailChanged:last({b:true,detail:false})} satisfies Record<string,Frame[]>;
}
