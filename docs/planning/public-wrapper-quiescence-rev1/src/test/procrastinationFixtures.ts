import {canonicalEncode as enc,list,signed,unsigned as u} from '../substrate/canonicalEncoding';
import {habitRecord as hr} from '../campaign3/habitCodecs';
import {procrastinationRecord as r} from '../campaign3/procrastinationCodecs';
export interface Frame {at:number;mode?:number;reward?:boolean;visible?:boolean;report?:number;cue?:boolean;instruction?:number;reminder?:boolean;support?:boolean;immediate?:boolean;board?:boolean;future?:number;seen?:boolean;recipient?:boolean;feasible?:boolean;blocked?:boolean;}
export const seed=new Uint8Array(32).fill(7);
export const procrastinationInputs=(xs:readonly Frame[])=>enc(list(xs.map(x=>r(1355,[hr(818,[signed(x.at),u(x.mode??2),x.reward??true,x.visible??true,u(x.report??0),x.cue??true]),u(x.instruction??0),x.reminder??false,x.support??true,x.immediate??false,x.board??true,u(x.future??0),x.seen??true,x.recipient??true,x.feasible??true,x.blocked??false]))));
export function procrastinationCases(){
 const main:Frame[]=Array.from({length:8},(_,i)=>({at:i+1,instruction:i===0?1:0,reminder:i===1,immediate:i>=1&&i<=4,future:i===0?2:0}));
 return {
 main,
 unavailableFuture:main.map(x=>({...x,future:x.at===1?1:0})),
 unknown:main.map(x=>({...x,future:0})),
 denied:main.map(x=>({...x,recipient:false})),
 corrected:main.map(x=>({...x,future:x.at===3?1:x.future})),
 falseForecast:main.map(x=>({...x,feasible:x.at!==6,cue:x.at!==6})),
 noImmediate:main.map(x=>({...x,immediate:false})),
 noAccess:main.map(x=>({...x,reminder:false})),
 lostAccess:main.map(x=>({...x,support:x.at!==3,reminder:x.at===5||x.reminder})),
 unavailableNow:main.map(x=>({...x,cue:x.at>=6,feasible:x.at>=6})),
 noGoal:main.map(x=>({...x,instruction:0})),
 cancelled:main.map(x=>({...x,instruction:x.at===3?2:x.instruction})),
 falseUnitOutcome:main.map(x=>({...x,reward:false,report:1})),
 deniedExecution:main.map(x=>({...x,visible:false})),
 hiddenPhysical:main.map(x=>({...x,visible:false,feasible:false,reward:false})),
 };
}
