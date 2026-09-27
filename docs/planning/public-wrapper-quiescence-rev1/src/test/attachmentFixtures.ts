import {canonicalEncode as enc,list,set,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {attachmentRecord as r} from '../campaign3/attachmentCodecs';
export const initialState=enc(set([])),seed=new Uint8Array(32).fill(13);
export type Row={target:number;worldSupport:number;worldBlocked:boolean;worldResolved:boolean;worldPresent:boolean;support:number;opportunity:boolean;resolved:boolean;demand:boolean;blocked:boolean;present:boolean;partA:boolean;partB:boolean;accessA:boolean;accessB:boolean;cueA:boolean;cueB:boolean;alternative:boolean;currentDemand:boolean};
const row=(x:Partial<Row>={}):Row=>({target:1,worldSupport:2,worldBlocked:true,worldResolved:true,worldPresent:false,support:2,opportunity:true,resolved:true,demand:true,blocked:true,present:false,partA:true,partB:false,accessA:true,accessB:true,cueA:true,cueB:true,alternative:true,currentDemand:true,...x});
export function cases(){
 const probe=(x:Partial<Row>={})=>row({opportunity:false,accessA:false,accessB:false,...x});
 const main=[row(),row(),probe(),row({target:2,partB:true}),probe({target:2}),row({support:0,resolved:false}),probe()];
 const change=(fn:(r:Row,i:number)=>Row)=>main.map((r,i)=>fn({...r},i));
 return {main,selfSufficient:change((r,i)=>i<2?{...r,blocked:false}:r),incidental:change((r,i)=>i<2?{...r,demand:false}:r),oneSupport:change((r,i)=>i===1?{...r,opportunity:false}:r),present:change(r=>({...r,present:true})),noAlternative:change(r=>({...r,alternative:false})),noCurrentDemand:change(r=>({...r,currentDemand:false})),unresolved:change((r,i)=>i<2?{...r,resolved:false}:r),noHistory:change((r,i)=>i<2?{...r,opportunity:false}:r),witnessA:change(r=>({...r,partA:false})),otherTarget:change((r,i)=>i===3?{...r,blocked:false}:r),missingCue:change(r=>({...r,cueA:false})),hiddenWorld:change(r=>({...r,worldSupport:0,worldBlocked:false,worldResolved:false,worldPresent:true})),denied:change((r,i)=>i===2?{...r,opportunity:true,support:0,resolved:false}:r),noA:change(r=>({...r,accessA:false,cueA:false})),noB:change(r=>({...r,accessB:false,cueB:false}))};
}
export const ordered=(rows:Row[])=>enc(list(rows.map((x,i)=>r(1251,[signed(i+1),u(x.target),u(x.worldSupport),x.worldBlocked,x.worldResolved,x.worldPresent,u(x.support),x.opportunity,x.resolved,x.demand,x.blocked,x.present,x.partA,x.partB,x.accessA,x.accessB,x.cueA,x.cueB,x.alternative,x.currentDemand]))));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(x=>typeof x!=='boolean'&&x.kind==='record'&&x.schema.typeId===type);
