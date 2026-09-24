import {canonicalEncode as enc,list,set,signed,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {emotionalDisplayRecord as r} from '../campaign3/emotionalDisplayCodecs';
export const seed=new Uint8Array(32).fill(13),initialState=enc(set([]));
export type Frame={at:number;truth?:boolean;display?:boolean;privateAccess?:boolean;delivery?:boolean;a?:boolean;b?:boolean;condition?:number;reserve?:number|null;catalogue?:number;displayEnabled?:boolean;cueA?:boolean;cueB?:boolean};
export const original=(x:Frame)=>r(1099,[signed(x.at),x.truth??true,x.display??true,x.privateAccess??true,x.delivery??true,x.a??true,x.b??true,u(x.condition??1),list(x.reserve===null?[]:[q(x.reserve??0,2)]),u(x.catalogue??1),x.displayEnabled??true,x.cueA??true,x.cueB??true]);
export const ordered=(xs:Frame[])=>enc(list(xs.map(original)));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
export function cases(){const main:Frame[]=[{at:1},{at:2,condition:2},{at:3,condition:3,catalogue:2},{at:4,condition:0,catalogue:2}];
 return {main,hiddenTruth:main.map(x=>({...x,truth:false})),calm:main.map(x=>({...x,display:(x.condition??1)===1?false:true})),reserve:main.map(x=>({...x,reserve:2})),control:main.map(x=>({...x,display:x.condition===3?false:true})),
 failed:main.map(x=>({...x,delivery:false})),noDisplay:main.map(x=>({...x,displayEnabled:false})),noChannels:main.map(x=>({...x,delivery:false,displayEnabled:false})),
 noA:main.map(x=>({...x,a:false,cueA:false})),noB:main.map(x=>({...x,b:false,cueB:false})),split:main.map(x=>({...x,a:true,cueA:false,b:false,cueB:true})),
 unknown:main.map(x=>({...x,privateAccess:false})),missingContext:main.map(x=>({...x,reserve:null,catalogue:0})),unknownControl:main.map(x=>({...x,condition:1,catalogue:2})),
 deniedChange:main.map(x=>({...x,privateAccess:false,display:false,reserve:2,catalogue:2})),interior:main.map(x=>({...x,reserve:2,display:x.at===2?false:true,condition:x.at===2?1:0,catalogue:1})).map((x,i)=>i===0?{...x,condition:1}:x)} satisfies Record<string,Frame[]>;}
