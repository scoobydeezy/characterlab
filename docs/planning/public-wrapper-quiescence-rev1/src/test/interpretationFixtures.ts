import {canonicalEncode as enc,list,set,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {interpretationRecord as r} from '../campaign3/interpretationCodecs';
export const seed=new Uint8Array(32).fill(13),initialState=enc(set([]));
export type Frame={at:number;truth?:boolean;display?:boolean;privateAccess?:boolean;delivery?:boolean;a?:boolean;b?:boolean;speakerContext?:number;contextA?:number;contextB?:number;contextAccessA?:boolean;contextAccessB?:boolean};
export const original=(x:Frame)=>r(1115,[signed(x.at),x.truth??true,x.display??true,x.privateAccess??true,x.delivery??true,x.a??true,x.b??true,u(x.speakerContext??1),u(x.contextA??1),u(x.contextB??1),x.contextAccessA??true,x.contextAccessB??true]);
export const ordered=(xs:Frame[])=>enc(list(xs.map(original)));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
export function cases(){const main:Frame[]=[{at:1,contextB:2},{at:2},{at:3,display:false,speakerContext:2,contextA:2,contextB:2}];
 return {main,hiddenTruth:main.map(x=>({...x,truth:false})),hiddenIntent:main.map(x=>({...x,display:!(x.display??true),speakerContext:(x.speakerContext??1)===1?2:1})),
 correct:main.map(x=>({...x,contextA:x.speakerContext??1,contextB:x.speakerContext??1})),failed:main.map(x=>({...x,delivery:false})),noA:main.map(x=>({...x,a:false})),noB:main.map(x=>({...x,b:false})),
 unknownContext:main.map(x=>({...x,contextAccessA:false,contextAccessB:false})),unknownSpeaker:main.map(x=>({...x,speakerContext:0})),unknownBelief:main.map(x=>({...x,privateAccess:false})),
 negative:main.map(x=>({...x,display:false,speakerContext:1,contextA:1,contextB:1})),deniedPrivateChange:main.map(x=>({...x,privateAccess:false,display:false,speakerContext:2})),misleading:main.map(x=>({...x,truth:true,display:false,speakerContext:1,contextA:1,contextB:1}))} satisfies Record<string,Frame[]>;}
