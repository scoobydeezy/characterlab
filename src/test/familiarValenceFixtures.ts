import {canonicalEncode as enc,list,set,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {familiarValenceRecord as r} from '../campaign3/familiarValenceCodecs';
export const initialState=enc(set([])),seed=new Uint8Array(32).fill(13);
export type Row={target:number;worldBenefit:number;worldHarm:number;benefit:number;harm:number;opportunity:boolean;a:boolean;b:boolean;aAccess:boolean;bAccess:boolean;partA:boolean;partB:boolean;accessA:boolean;accessB:boolean;cueA:boolean;cueB:boolean};
const row=(x:Partial<Row>={}):Row=>({target:1,worldBenefit:0,worldHarm:0,benefit:0,harm:0,opportunity:true,a:true,b:false,aAccess:true,bAccess:true,partA:true,partB:false,accessA:true,accessB:true,cueA:true,cueB:true,...x});
export function cases(){
 const probe=(x:Partial<Row>={})=>row({opportunity:false,accessA:false,accessB:false,...x});
 const main=[row(),row(),probe(),row({target:2,benefit:2,partB:true}),probe({target:2}),row({opportunity:false}),probe()];
 const change=(fn:(r:Row,i:number)=>Row)=>main.map((r,i)=>fn({...r},i));
 return {main,positive:change((r,i)=>i<2?{...r,benefit:2}:r),adverse:change((r,i)=>i<2?{...r,harm:2}:r),noOutcome:change((r,i)=>i<2?{...r,opportunity:false}:r),noPriorFeatures:change((r,i)=>i<2?{...r,aAccess:false,bAccess:false}:r),partial:change((r,i)=>i===2?{...r,b:true}:r),disjoint:change((r,i)=>i===2?{...r,a:false,b:true}:r),missing:change((r,i)=>i===2?{...r,aAccess:false,bAccess:false}:r),noOverlap:change((r,i)=>i<2?{...r,bAccess:false}:i===2?{...r,aAccess:false}:r),witnessA:change(r=>({...r,partA:false})),otherTarget:change((r,i)=>i===3?{...r,benefit:0,harm:2}:r),hiddenWorld:change(r=>({...r,worldBenefit:2})),denied:change((r,i)=>i===2?{...r,benefit:2,opportunity:true}:r),noA:change(r=>({...r,accessA:false,cueA:false})),noB:change(r=>({...r,accessB:false,cueB:false}))};
}
export const ordered=(rows:Row[])=>enc(list(rows.map((x,i)=>r(1236,[signed(i+1),u(x.target),u(x.worldBenefit),u(x.worldHarm),u(x.benefit),u(x.harm),x.opportunity,x.a,x.b,x.aAccess,x.bAccess,x.partA,x.partB,x.accessA,x.accessB,x.cueA,x.cueB]))));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(x=>typeof x!=='boolean'&&x.kind==='record'&&x.schema.typeId===type);
