import {type Row,ordered,initialState,seed,records} from './relDimensionsFixtures';
export {ordered,initialState,seed,records};
const row=(x:Partial<Row>={}):Row=>({target:1,worldGift:0,worldTask:false,worldPromise:true,worldLoom:true,gift:0,taskOpportunity:true,task:false,promiseOpportunity:true,promise:true,loom:true,partA:true,partB:true,accessA:true,accessB:true,cueA:true,cueB:true,...x});
export function cases(){
 const probe=()=>row({taskOpportunity:false,promiseOpportunity:false,accessA:false,accessB:false});
 const main=[row(),probe(),row({promise:false}),probe(),row({target:2}),row({taskOpportunity:false,promiseOpportunity:false}),probe()];
 const change=(fn:(r:Row,i:number)=>Row)=>main.map((r,i)=>fn({...r},i));
 return {main,reverse:change((r,i)=>i===0?{...r,promise:false}:i===2?{...r,promise:true}:r),missing:change((r,i)=>i===2?{...r,promiseOpportunity:false}:r),fulfilled:change((r,i)=>i===2?{...r,promise:true}:r),noFirst:change((r,i)=>i===0?{...r,promiseOpportunity:false}:r),witnessA:change(r=>({...r,partA:false})),otherTarget:change((r,i)=>i===4?{...r,promise:false}:r),hiddenWorld:change(r=>({...r,worldGift:2,worldTask:true,worldPromise:false,worldLoom:false})),denied:change((r,i)=>i===1?{...r,gift:2,taskOpportunity:true,task:true,promiseOpportunity:true,promise:false}:r),noA:change(r=>({...r,accessA:false,cueA:false})),noB:change(r=>({...r,accessB:false,cueB:false})),taskGood:change(r=>({...r,task:true})),unknown:change(r=>({...r,promiseOpportunity:false}))};
}
