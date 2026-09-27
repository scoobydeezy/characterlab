import {canonicalEncode as enc,list,signed,unsigned as u} from '../substrate/canonicalEncoding';
import {habitRecord as r} from '../campaign3/habitCodecs';
export interface Opportunity {at:number;mode?:number;reward?:boolean;visible?:boolean;report?:number;cue?:boolean;}
export const habitInputs=(xs:readonly Opportunity[])=>enc(list(xs.map(x=>r(818,[signed(x.at),u(x.mode??2),x.reward??false,x.visible??true,u(x.report??0),x.cue??true]))));
export const habitScenario=():Opportunity[]=>[{at:1,mode:1,reward:true},{at:2,mode:1,reward:true},{at:3,mode:1,reward:true},{at:4,mode:3,reward:false},...Array.from({length:8},(_,i)=>({at:i+5,reward:false}))];
