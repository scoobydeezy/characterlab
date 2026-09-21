import {canonicalEncode as enc,list,unsigned as u,signed} from '../substrate/canonicalEncoding';
import {socialRecord as r} from '../campaign3/socialCodecs';
export interface Display {at:number;kind?:number;mode?:number;receipt?:number;a?:boolean;b?:boolean;delivered?:boolean;}
export function socialInputs(xs:readonly Display[]){return enc(list(xs.map(x=>r(804,[signed(x.at),u(x.kind??1),u(x.mode??4),u(x.receipt??x.at),x.a??true,x.b??true,x.delivered??true]))));}
export function socialScenario():Display[]{return [{at:1,mode:4},{at:2,kind:2,mode:3,b:false},{at:3,kind:2,mode:3,b:false},{at:4,mode:0,a:false,b:false}];}
