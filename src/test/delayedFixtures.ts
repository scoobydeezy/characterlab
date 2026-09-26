import {canonicalEncode as enc,list,set,unsigned as u,signed,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec} from '../campaign2/canonicalData';
import {delayedRecord as r} from '../campaign3/delayedCodecs';
export const initialState=enc(set([])),seed=new Uint8Array(32).fill(7);
export const offer=(delay=1,future=3,cost=0,immediate=1)=>r(1380,[q(immediate,8),q(1,1),u(delay),u(future),q(cost,8)]);
export type Changes={offers:CanonicalValue[];offerVisible:boolean;offerRecipient:boolean;allowed:boolean;now:CanonicalValue;later:CanonicalValue;receiptVisible:boolean;receiptRecipient:boolean;mode:number};
export function original(at:number,changes:Partial<Changes>={}){const x={offers:at===1?[offer()]:[],offerVisible:true,offerRecipient:true,allowed:true,now:q(1,8),later:q(1,1),receiptVisible:true,receiptRecipient:true,mode:0,...changes};return r(1381,[signed(at),list(x.offers),x.offerVisible,x.offerRecipient,x.allowed,x.now,x.later,x.receiptVisible,x.receiptRecipient,u(x.mode)]);}
export const ordered=(values:readonly CanonicalValue[])=>enc(list(values));
export const records=(values:readonly CanonicalValue[],type:bigint)=>values.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
export function cases(){const make=(change:(at:number)=>Partial<Changes>=()=>({}))=>Array.from({length:8},(_,i)=>original(i+1,change(i+1))),source=(o:CanonicalValue)=>make(at=>({offers:at===1?[o]:[]}));return {
 main:make(),delay2:source(offer(2)),delay4:source(offer(4)),cost:source(offer(1,3,2)),uncertain:source(offer(1,2)),unknown:source(offer(1,0)),unavailable:source(offer(1,1)),immediateLarge:source(offer(4,3,0,8)),
 failed:make(()=>({allowed:false})),missing:make(()=>({receiptVisible:false})),hiddenMissing:make(()=>({receiptVisible:false,allowed:false})),
 falseReceipt:make(()=>({allowed:false,mode:2})),truePromised:make(()=>({mode:2})),
 lateReceipt:make(at=>({receiptVisible:at>=7,mode:2})),hiddenLate:make(at=>({receiptVisible:at>=7,mode:2,allowed:false})),
 deniedOffer:make(()=>({offerRecipient:false})),hiddenOffer:make(at=>({offerRecipient:false,offers:at===1?[offer(4,2,1,4)]:[]})),
 absentOffer:make(()=>({offers:[]})),lateWorldChange:make(at=>({allowed:at<=3,later:at<=3?q(1,1):q(0,1)})),zeroReceipt:make(()=>({mode:1})),
 };}
