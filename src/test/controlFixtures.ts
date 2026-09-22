import {canonicalEncode as enc,list,signed,unsigned as u} from '../substrate/canonicalEncoding';
import {habitRecord as hr} from '../campaign3/habitCodecs';
import {controlRecord as r} from '../campaign3/controlCodecs';
export interface Frame {at:number;mode?:number;reward?:boolean;visible?:boolean;report?:number;cue?:boolean;instruction?:number;reminder?:boolean;support?:boolean;card?:boolean;board?:boolean;}
export const seed=new Uint8Array(32).fill(7);
export const controlInputs=(xs:readonly Frame[])=>enc(list(xs.map(x=>r(1010,[hr(818,[signed(x.at),u(x.mode??2),x.reward??true,x.visible??false,u(x.report??0),x.cue??true]),u(x.instruction??0),x.reminder??false,x.support??true,x.card??false,x.board??true]))));
export function controlCases(){
 const training:Frame[]=[1,2,3].map(at=>({at,mode:1,visible:true,instruction:at===3?1:0}));
 const main:Frame[]=[...training,{at:4,reminder:true},{at:5,card:true},{at:6},{at:7,instruction:2},{at:8}];
 return {
  main,
  noLoad:main.map(x=>({...x,card:false})),
  lost:[...training,{at:4,reminder:true},{at:5,support:false},{at:6,reminder:true}],
  hidden:[...training,{at:4,reminder:true,board:false,card:true},{at:5},{at:6,reminder:true}],
  absent:[...training,{at:4},{at:5},{at:6,reminder:true}],
  hiddenReward:main.map(x=>({...x,...(x.at>3?{reward:false}: {})})),
  otherCue:main.map(x=>({...x,...(x.at>3?{cue:false}: {})})),
  noGoal:main.map(x=>({...x,instruction:0})),
  negativeBelief:[...training,{at:4,mode:3,visible:true,reward:false},{at:5,reminder:true,card:true}],
  unseenTraining:main.map(x=>({...x,visible:false})),
 };
}
