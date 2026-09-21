import {canonicalEncode as enc,list,unsigned as u,signed,rational as q} from '../substrate/canonicalEncoding';
import {skillRecord as r} from '../campaign3/skillCodecs';
export interface Exercise {at:number;impairment?:number;difficulty?:number;permitted?:boolean;practice?:boolean;visible?:boolean;report?:number;}
export function skillInputs(xs:readonly Exercise[]){return enc(list(xs.map(x=>r(783,[signed(x.at),q(Math.round((x.impairment??0)*16),16),q(Math.round((x.difficulty??.5)*16),16),x.permitted??true,x.practice??false,x.visible??true,u(x.report??0)]))));}
export function skillScenario():Exercise[]{return [{at:1},{at:2,practice:true,visible:false},{at:3,practice:true,visible:false},{at:4,impairment:.75,visible:false},{at:5,visible:false},{at:6}];}
