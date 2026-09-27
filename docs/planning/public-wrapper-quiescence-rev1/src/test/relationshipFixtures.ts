import {canonicalEncode as enc,list,signed,unsigned as u} from '../substrate/canonicalEncoding';
import {relationshipRecord as r} from '../campaign3/relationshipCodecs';
export interface Interaction {at:number;kind?:number;participants?:number;a?:boolean;b?:boolean;display?:number;claim?:number;contactA?:boolean;contactB?:boolean;}
export const relationshipInputs=(xs:readonly Interaction[])=>enc(list(xs.map(x=>r(843,[signed(x.at),u(x.kind??0),u(x.participants??1),x.a??true,x.b??true,u(x.display??0),u(x.claim??0),x.contactA??true,x.contactB??true]))));
export const relationshipScenario=():Interaction[]=>[{at:1,kind:1},{at:2,kind:1},{at:3,kind:3,claim:2},{at:4},{at:5,kind:2},{at:6,kind:3,claim:1},{at:7},{at:8,contactA:false},{at:9,kind:1},{at:10}];

