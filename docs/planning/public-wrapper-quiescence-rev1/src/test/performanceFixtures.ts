import {canonicalEncode as enc,list,set,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec} from '../campaign2/canonicalData';
import {performanceRecord as r} from '../campaign3/performanceCodecs';
export const initialState=enc(set([])),seed=new Uint8Array(32).fill(7);
export const display=(receipt:number,route:number,available:boolean,issuedAt=1,until=8,visible=true)=>r(1294,[u(receipt),u(route),available,signed(issuedAt),signed(until),visible]);
export type Changes={adopt:boolean;displays:CanonicalValue[];openA:boolean;openB:boolean;blocked:boolean;competent:boolean;external:boolean;executionVisible:boolean;criterion:number;feedback:number};
export function original(at:number,changes:Partial<Changes>={}) {
 const x={adopt:at===1,displays:[] as CanonicalValue[],openA:true,openB:true,blocked:at<4,competent:true,external:false,executionVisible:true,criterion:0,feedback:0,...changes};
 return r(1295,[signed(at),x.adopt,list(x.displays),x.openA,x.openB,x.blocked,x.competent,x.external,x.executionVisible,u(x.criterion),u(x.feedback)]);
}
export const ordered=(values:readonly CanonicalValue[])=>enc(list(values));
export const records=(values:readonly CanonicalValue[],type:bigint)=>values.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
export function cases(){
 const a=display(1,1,true),b=display(2,2,true),make=(change:(at:number)=>Partial<Changes>=()=>({}))=>Array.from({length:8},(_,i)=>original(i+1,{displays:i===0?[a,b]:[],...change(i+1)}));
 return {
  main:make(),positiveFeedback:make(at=>({feedback:at<4?2:0})),transientFailure:make(at=>({feedback:at===3?2:0})),
  noFeedback:make(at=>({executionVisible:at>=5})),hiddenDenied:make(at=>({executionVisible:at>=5,blocked:false})),
  hiddenCause:make(at=>({blocked:false,competent:at>=4})),falseFailure:make(at=>({blocked:false,feedback:at<4?1:0})),
  oneHiddenFailure:make(at=>({executionVisible:at!==3})),gappedFailures:make(at=>({executionVisible:at!==3&&at!==4,feedback:at===5?1:0})),
  noAlternative:make(at=>({displays:at===1?[a]:[]})),noAdoption:make(()=>({adopt:false})),fulfilled:make(at=>({criterion:at===4?1:0})),
  external:make(at=>({external:at===2,criterion:at===2?1:0})),repeatFailures:make(()=>({blocked:true})),
  deniedDisplay:make(at=>({displays:at===1?[a,display(2,2,true,1,8,false)]:at===5?[display(3,2,true,5)]:[]})),
  noDisplay:make(at=>({displays:at===1?[a]:at===5?[display(3,2,true,5)]:[]})),
 };
}
