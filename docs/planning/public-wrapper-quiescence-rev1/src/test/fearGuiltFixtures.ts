import {canonicalEncode as enc,list,set,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {fearGuiltRecord as r} from '../campaign3/fearGuiltCodecs';
export const initialState=enc(set([])),seed=new Uint8Array(32).fill(13);
export type Row={truth:boolean;animal:boolean;accusation:boolean;display:boolean;accessA:boolean;accessB:boolean;animalA?:boolean;animalB?:boolean;possessionA?:boolean;possessionB?:boolean};
const row=(x:Partial<Row>={}):Row=>({truth:false,animal:true,accusation:false,display:true,accessA:true,accessB:true,...x});
export function cases(){
 const main=[row(),row({animalA:true}),row({possessionA:true,possessionB:true}),row()];
 const change=(fn:(r:Row,i:number)=>Row)=>main.map((r,i)=>fn({...r},i));
 return {main,hiddenTruth:change(r=>({...r,truth:true})),hiddenCause:change((r,i)=>i===1?{...r,animal:false,accusation:true}:r),noContext:change(r=>({...r,animalA:undefined})),noCue:change(r=>({...r,accessA:false,accessB:false})),unknown:change(r=>({...r,accessA:false,accessB:false,animalA:undefined,possessionA:undefined,possessionB:undefined})),calm:change(r=>({...r,animal:false,accusation:false})),noDisplay:change(r=>({...r,display:false})),noA:change(r=>({...r,accessA:false,animalA:undefined,possessionA:undefined})),noB:change(r=>({...r,accessB:false,animalB:undefined,possessionB:undefined})),otherContext:change((r,i)=>i===1?{...r,animalB:false}:r),exculpatory:change((r,i)=>i===2?{...r,possessionA:false}:r),deniedCause:change(r=>({...r,display:false,animal:false,accusation:false}))};
}
export const ordered=(rows:Row[])=>enc(list(rows.map((x,i)=>{const opt=(v:boolean|undefined)=>list(v===undefined?[]:[v]);return r(1166,[signed(i+1),x.truth,x.animal,x.accusation,x.display,x.accessA,x.accessB,opt(x.animalA),opt(x.animalB),opt(x.possessionA),opt(x.possessionB)]);})));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(x=>typeof x!=='boolean'&&x.kind==='record'&&x.schema.typeId===type);
