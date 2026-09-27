import {canonicalEncode as enc,list,set,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {reappraisalRecord as r} from '../campaign3/reappraisalCodecs';
export const initialState=enc(set([])),seed=new Uint8Array(32).fill(7);
export interface Frame {at:number;condition?:number;physical?:boolean;display?:boolean;visible?:boolean;catalogue?:number;catalogueVisible?:boolean;request?:boolean;complete?:boolean;}
export const ordered=(xs:readonly Frame[])=>enc(list(xs.map(x=>r(1026,[signed(x.at),u(x.condition??0),x.physical??true,x.display??true,x.visible??true,u(x.catalogue??0),x.catalogueVisible??true,x.request??false,x.complete??true]))));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
export function cases(){
 const main:Frame[]=[{at:1,condition:1,catalogue:2},{at:2,condition:2,display:false},{at:3,request:true},{at:4}];
 const change=(at:number,x:Partial<Frame>)=>main.map(v=>v.at===at?{...v,...x}:v);
 return {main,noRequest:change(3,{request:false}),failed:change(3,{complete:false}),unknownBaseline:change(1,{condition:0}),unknownProtected:change(2,{condition:0}),emptyCatalogue:change(1,{catalogue:1}),missingCatalogue:change(1,{catalogue:0}),sameInstant:[main[0],{at:2},{at:3,condition:2,display:false,request:true},{at:4}],harmful:main.map(v=>({...v,...(v.at===1?{display:false}:v.at===2?{display:true}:{})})),ineffective:change(2,{display:true}),hiddenTruth:main.map(v=>({...v,physical:false})),denied:[...change(1,{catalogueVisible:false}).slice(0,3),{at:4,catalogue:2},{at:5}],absent:[...change(1,{catalogue:0}).slice(0,3),{at:4,catalogue:2},{at:5}],weighted:[main[0],main[1],{at:3,condition:2,display:true},{at:4,request:true},{at:5}]} satisfies Record<string,Frame[]>;
}
