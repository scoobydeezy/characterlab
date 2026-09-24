import {canonicalEncode as enc,list,set,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {personstateRecord as r} from '../campaign3/personstateCodecs';
export const seed=new Uint8Array(32).fill(13),initialState=enc(set([]));
export type Frame={at:number;override?:number;execute?:boolean;a?:boolean;b?:boolean;cueA?:boolean;cueB?:boolean;accessA?:boolean;accessB?:boolean};
export const original=(x:Frame)=>r(1149,[signed(x.at),u(x.override??0),x.execute??true,x.a??true,x.b??true,x.cueA??true,x.cueB??true,x.accessA??true,x.accessB??true]);
export const ordered=(xs:Frame[])=>enc(list(xs.map(original)));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
export function cases(){
 const main:Frame[]=[{at:1,override:1},{at:2,override:1},{at:3,override:2,cueA:false,cueB:false},{at:4,override:0,cueA:false,cueB:true,a:false,b:false},{at:5,override:1,accessA:false,accessB:false}];
 return {main,cueChanged:main.map(x=>x.at===4?{...x,cueA:true}:x),hiddenIntent:main.map(x=>x.at===4?{...x,override:2}:x),
 noHistory:main.map(x=>({...x,a:false,b:false})),neutral:main.map(x=>x.at===2?{...x,override:2}:x.at===3?{...x,execute:false}:x),negative:main.map(x=>x.at<4?{...x,override:2}:x),
 missingCue:main.map(x=>x.at===4?{...x,accessA:false}:x),deniedCueChange:main.map(x=>x.at===4?{...x,accessA:false,cueA:true}:x),
 noA:main.map(x=>({...x,a:false})),noB:main.map(x=>({...x,b:false})),otherCue:main.map(x=>({...x,cueB:!(x.cueB??true)})),
 failed:main.map(x=>({...x,execute:false})),missingThenReturn:main.map(x=>x.at===3?{...x,accessA:false}:x),
 visibleLast:main.map(x=>x.at===4?{...x,a:true,b:true}:x)} satisfies Record<string,Frame[]>;
}
