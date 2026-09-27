import {canonicalEncode as enc,list,signed,unsigned as u} from '../substrate/canonicalEncoding';
import {habitRecord as hr} from '../campaign3/habitCodecs';
import {fatigueRecord as r} from '../campaign3/fatigueCodecs';
export interface Frame {at:number;mode?:number;reward?:boolean;visible?:boolean;report?:number;cue?:boolean;instruction?:number;reminder?:boolean;support?:boolean;card?:boolean;board?:boolean;display?:number;seen?:boolean;recipient?:boolean;physical?:number;}
export const seed=new Uint8Array(32).fill(7);
export const fatigueInputs=(xs:readonly Frame[])=>enc(list(xs.map(x=>r(1334,[hr(818,[signed(x.at),u(x.mode??2),x.reward??true,x.visible??false,u(x.report??0),x.cue??true]),u(x.instruction??0),x.reminder??false,x.support??true,x.card??false,x.board??true,u(x.display??0),x.seen??false,x.recipient??true,u(x.physical??0)]))));
export function fatigueCases(){
 const training:Frame[]=[1,2,3].map(at=>({at,mode:1,visible:true,instruction:at===3?1:0,seen:at===3}));
 const main:Frame[]=[...training,{at:4,reminder:true,physical:2,seen:true},{at:5,physical:2},{at:6},{at:7,seen:true},{at:8}];
 return {
 main,
 mild:main.map(x=>({...x,physical:x.physical===2?1:x.physical})),
 rested:main.map(x=>({...x,physical:0})),
 missingOnset:main.map(x=>({...x,seen:x.at===4?false:x.seen})),
 absent:main.map(x=>({...x,seen:false})),
 denied:main.map(x=>({...x,recipient:false,physical:2,display:3})),
 missingRecovery:main.map(x=>({...x,seen:x.at===7?false:x.seen})),
 falseFatigue:main.map(x=>({...x,physical:0,display:x.at===4?3:0})),
 falseRecovery:main.map(x=>({...x,physical:x.at>=7?2:x.physical,display:x.at===7?1:x.display})),
 hiddenReward:main.map(x=>({...x,reward:x.at>3?false:x.reward})),
 externalLoad:main.map(x=>({...x,physical:0,card:x.at>=5&&x.at<=7})),
 noGoal:main.map(x=>({...x,instruction:0})),
 noHistory:main.map(x=>({...x,visible:false})),
 retirement:main.map(x=>({...x,instruction:x.at===6?2:x.instruction})),
 motorChallenge:main.map(x=>({...x,mode:x.at===4?1:x.mode,visible:x.at===4?true:x.visible})),
 };
}
