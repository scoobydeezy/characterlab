import {canonicalEncode as enc,list,set,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {attributedRecord as r} from '../campaign3/attributedCodecs';
export const seed=new Uint8Array(32).fill(13),initialState=enc(set([]));
export type Frame={at:number;truth?:boolean;own?:boolean;ownAccess?:boolean;target?:boolean;targetAccess?:boolean;report?:number;other?:number;delivery?:boolean;receipt?:boolean};
export const original=(x:Frame)=>r(1132,[signed(x.at),x.truth??true,x.own??true,x.ownAccess??true,x.target??false,x.targetAccess??true,u(x.report??3),u(x.other??2),x.delivery??true,x.receipt??true]);
export const ordered=(xs:Frame[])=>enc(list(xs.map(original)));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
export function cases(){
 const main:Frame[]=[{at:1},{at:2},{at:3,report:2}];
 return {main,hiddenTruth:main.map(x=>({...x,truth:false})),hiddenTarget:main.map(x=>({...x,target:true})),targetAbsent:main.map(x=>({...x,targetAccess:false})),
 otherReport:main.map(x=>({...x,other:1})),reportChange:main.map(x=>({...x,report:2})),unknown:main.map(x=>({...x,report:0})),ignorance:main.map(x=>({...x,report:1})),
 failed:main.map(x=>({...x,delivery:false})),deniedReceipt:main.map(x=>({...x,receipt:false})),unknownOwn:main.map(x=>({...x,ownAccess:false})),negativeOwn:main.map(x=>({...x,own:false})),
 noNewReport:main.map(x=>({...x,report:x.at===1?3:0})),deniedOwnChange:main.map(x=>({...x,ownAccess:false,own:false}))} satisfies Record<string,Frame[]>;
}
