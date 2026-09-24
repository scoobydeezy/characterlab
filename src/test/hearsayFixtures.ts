import {canonicalEncode as enc,list,set,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {hearsayRecord as r} from '../campaign3/hearsayCodecs';
export const initialState=enc(set([])),seed=new Uint8Array(32).fill(13);
export type Row={truth:boolean;direct:boolean;private:boolean;privateAccess:boolean;delivery:boolean;ticket:number;reportA:boolean;reportB:boolean;directA:boolean;directB:boolean};
const row=(ticket:number,x:Partial<Row>={}):Row=>({truth:true,direct:true,private:false,privateAccess:true,delivery:true,ticket,reportA:true,reportB:true,directA:false,directB:false,...x});
export function cases(){
 const main=[row(1),row(1),row(3,{delivery:false,directA:true}),row(4),row(5,{private:true})];
 const change=(fn:(r:Row,i:number)=>Row)=>main.map((r,i)=>fn({...r},i));
 const privacy=change((r,i)=>i===1?{...r,delivery:false,ticket:2}:r);
 return {main,hiddenTruth:change(r=>({...r,truth:false})),privacy,hiddenPrivate:privacy.map((r,i)=>i===1?{...r,private:true}:r),noDirect:change(r=>({...r,directA:false})),falseDirect:change((r,i)=>i===2?{...r,direct:false}:r),noReports:change(r=>({...r,reportA:false,reportB:false})),unknown:change(r=>({...r,reportA:false,reportB:false,directA:false,directB:false})),noA:change(r=>({...r,reportA:false,directA:false})),noB:change(r=>({...r,reportB:false,directB:false})),otherDirect:change((r,i)=>i===2?{...r,directB:true}:r),failed:change(r=>({...r,delivery:false})),privateDenied:change(r=>({...r,privateAccess:false})),delayedReceipt:change((r,i)=>i===0?{...r,reportA:false}:r),duplicateAfterNew:change((r,i)=>i===4?{...r,private:false,ticket:1}:r),simultaneous:change((r,i)=>i===2?{...r,delivery:true}:r)};
}
export const ordered=(rows:Row[])=>enc(list(rows.map((x,i)=>r(1196,[signed(i+1),x.truth,x.direct,x.private,x.privateAccess,x.delivery,u(x.ticket),x.reportA,x.reportB,x.directA,x.directB]))));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(x=>typeof x!=='boolean'&&x.kind==='record'&&x.schema.typeId===type);
