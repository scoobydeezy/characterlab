import {canonicalEncode as enc,list,set,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {recollectionRecord as r} from '../campaign3/recollectionCodecs';
export const seed=new Uint8Array(32).fill(11),initialState=enc(set([]));
export type Frame={at:number;label?:number;category?:number;truth?:boolean;display?:boolean;visible?:boolean;detailVisible?:boolean;query?:number};
export const original=(x:Frame)=>r(1041,[signed(x.at),u(x.label?1:0),u(x.label??0),u(x.category??1),x.truth??true,x.display??true,x.visible??true,x.detailVisible??true,u(x.query??0)]);
export const ordered=(xs:Frame[])=>enc(list(xs.map(original)));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
export function cases(){
 const main:Frame[]=[{at:1,label:1,display:false},{at:2,label:2,display:false},{at:3,label:3,display:true},{at:4,query:3},{at:6,query:3},{at:7,query:3},{at:8,query:3}];
 return {main,hiddenTruth:main.map(x=>({...x,truth:false})),noQueries:main.map(x=>({...x,query:0})),
  newRegularity:[...main.slice(0,6),{at:8,label:4,display:true},{at:9,label:5,display:true},{at:10,query:3}],
  tie:main.map(x=>x.label===2?{at:x.at}:x),
  otherCategory:main.map(x=>x.label&&x.label<3?{...x,category:2}:x),
  missingDetail:main.map(x=>x.label===3?{...x,detailVisible:false}:x),
  allUnknown:main.map(x=>({...x,detailVisible:false})),
  unseen:main.map(x=>x.label===3?{...x,visible:false}:x),
  unknownEpisode:main.map(x=>({...x,query:x.query?8:0})),
  sameInstant:main.map(x=>x.label===3?{...x,query:3}:x),
  denied:main.map(x=>x.at===1?{...x,visible:false}:x),
  absent:main.map(x=>x.at===1?{at:1}:x),
  knownFalse:[{at:1,label:1,display:false},{at:2,query:1},{at:4,query:1},{at:5,query:1}],
  falseDisplay:main.map(x=>x.label===3?{...x,truth:false}:x)} satisfies Record<string,Frame[]>;
}
