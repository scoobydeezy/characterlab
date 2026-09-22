import { canonicalEncode as enc, list, set, unsigned as u, signed, type CanonicalValue } from '../substrate/canonicalEncoding';
import { dataItems as items, dataRecord as rec } from '../campaign2/canonicalData';
import { agencyRecord as r } from '../campaign3/agencyCodecs';
export const seed=new Uint8Array(32).fill(7),initialState=enc(set([]));
export function original(at:number,kind=1,episode=1,changes:Partial<{competent:boolean;blocker:number;outcome:number[];obstruction:number[];receipt:number;positive:boolean;recipients:number[]}>= {}) {
  const x={competent:true,blocker:kind===1?1:0,outcome:kind===1?[1,2]:[],obstruction:kind===1?[1]:[],receipt:kind===2?1:0,positive:false,recipients:kind===2?[2]:[],...changes};
  return r(973,[signed(at),u(kind),u(episode),x.competent,u(x.blocker),set(x.outcome.map(u)),set(x.obstruction.map(u)),u(x.receipt),x.positive,set(x.recipients.map(u))]);
}
export const ordered=(values:readonly CanonicalValue[])=>enc(list(values));
export const records=(values:readonly CanonicalValue[],type:bigint)=>values.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
export function cases() {
  const probe=original(2,3),main=[original(1),original(2,2,1,{recipients:[1,2]}),original(3,3)];
  return {
    main,
    blocked:[original(1),probe],
    success:[original(1,1,1,{blocker:0}),probe],
    incompetent:[original(1,1,1,{blocker:0,competent:false}),probe],
    otherBlocker:[original(1,1,1,{blocker:2}),probe],
    blockedIncompetent:[original(1,1,1,{competent:false}),probe],
    swapped:[original(1,1,1,{obstruction:[2]}),probe],
    both:[original(1,1,1,{obstruction:[1,2]}),probe],
    hidden:[original(1,1,1,{outcome:[],obstruction:[]}),probe],
    hiddenSuccess:[original(1,1,1,{blocker:0,outcome:[],obstruction:[]}),probe],
    correction:[original(1),original(2,2),original(3,2,1,{receipt:2,positive:true}),original(4,3)],
    duplicate:[original(1),original(2,2),original(3,2),original(4,3)],
    repeated:[original(1),original(2,1,2),original(3,3)],
  };
}
