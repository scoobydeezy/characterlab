import {canonicalEncode as enc,list,signed,unsigned as u} from '../substrate/canonicalEncoding';
import {habitRecord as hr} from '../campaign3/habitCodecs';
import {ruminationRecord as r} from '../campaign3/ruminationCodecs';
export interface Frame {at:number;mode?:number;reward?:boolean;visible?:boolean;report?:number;cue?:boolean;instruction?:number;reminder?:boolean;support?:boolean;card?:boolean;board?:boolean;display?:number;seen?:boolean;recipient?:boolean;interrupt?:boolean;truth?:boolean;}
export const seed=new Uint8Array(32).fill(7);
export const ruminationInputs=(xs:readonly Frame[])=>enc(list(xs.map(x=>r(1313,[hr(818,[signed(x.at),u(x.mode??2),x.reward??true,x.visible??false,u(x.report??0),x.cue??true]),u(x.instruction??0),x.reminder??false,x.support??true,x.card??false,x.board??true,u(x.display??0),x.seen??true,x.recipient??true,x.interrupt??false,x.truth??true]))));
export function ruminationCases(){
 const training:Frame[]=[1,2,3].map(at=>({at,mode:1,visible:true,instruction:at===3?1:0,display:at===3?1:0}));
 const main:Frame[]=[...training,{at:4,reminder:true},{at:5,interrupt:true},{at:6},{at:7,display:2},{at:8}];
 return {
  main,
  unbroken:main.map(x=>({...x,interrupt:false})),
  unresolved:main.map(x=>({...x,display:x.at===7?0:x.display})),
  absent:main.map(x=>({...x,display:0})),
  denied:main.map(x=>({...x,seen:false})),
  nonrecipient:main.map(x=>({...x,recipient:false})),
  hiddenTruth:main.map(x=>({...x,truth:false})),
  hiddenReward:main.map(x=>({...x,...(x.at>3?{reward:false}: {})})),
  hiddenResolution:main.map(x=>({...x,seen:x.at!==7,truth:x.at<7})),
  falseResolution:main.map(x=>({...x,truth:x.at===7||x.at===8})),
  noInterruption:main.map(x=>({...x,interrupt:false})),
  externalLoad:main.map(x=>({...x,display:0,card:x.at>=4&&x.at<=7})),
  dualLoad:main.map(x=>({...x,card:x.at>=4})),
  noGoal:main.map(x=>({...x,instruction:0})),
  retirement:main.map(x=>({...x,instruction:x.at===7?2:x.instruction})),
  noHistory:main.map(x=>({...x,visible:false})),
  boardDenied:main.map(x=>({...x,board:x.at!==5})),
  lateOpen:main.map(x=>({...x,display:x.at===3?0:x.at===4?1:x.display})),
 };
}
