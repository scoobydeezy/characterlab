import {canonicalEncode as enc,list,signed,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {longitudinalRecord as r} from '../campaign3/longitudinalCodecs';
export interface LongitudinalInput {at:number;kind?:number;physical?:boolean;access?:boolean;display?:number;participant?:boolean;impairment?:number;difficulty?:number;interference?:boolean;}
export const longitudinalInputs=(xs:readonly LongitudinalInput[])=>enc(list(xs.map(x=>r(864,[signed(x.at),u(x.kind??0),x.physical??true,x.access??true,u(x.display??0),x.participant??true,q((x.impairment??0)*4,4),q((x.difficulty??.5)*4,4),x.interference??false]))));
export function longitudinalScenario():LongitudinalInput[]{return [{at:1,kind:1},{at:2,kind:1},{at:3,kind:2},{at:4,kind:3},{at:5,kind:2},{at:6,kind:3},{at:7,kind:4,physical:false,display:1},{at:8},{at:14},{at:15},{at:16,interference:true},{at:17,kind:2},{at:18,kind:3,physical:false},{at:19,kind:4},{at:20,kind:3},{at:21}];}
