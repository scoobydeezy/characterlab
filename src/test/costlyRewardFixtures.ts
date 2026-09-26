import {type Frame} from '../campaign3/costlyReward';
export function costlyCases(){
 const main:Frame[]=Array.from({length:12},(_,i)=>({at:i+1,visible:true,cue:true,adopt:i===3,reminder:i===4,support:true,card:i>=6&&i<=9,availableA:true,executionA:true,rewardA:true,harmA:i>=3,receipt:true,reportReward:0,reportHarm:0,privateBit:false}));
 const change=(fn:(f:Frame)=>Frame)=>main.map(fn),withheld=change(f=>({...f,receipt:f.at<=4}));
 return {main,noLoad:change(f=>({...f,card:false})),withheld,
  unseen:change(f=>({...f,receipt:f.at>4})),otherCue:change(f=>({...f,cue:f.at<=4})),unavailable:change(f=>({...f,availableA:f.at<=4})),noGoal:change(f=>({...f,adopt:false})),noBenefit:change(f=>({...f,rewardA:false})),harmless:change(f=>({...f,harmA:false})),failed:change(f=>({...f,executionA:f.at<=4})),
  trueReports:change(f=>({...f,reportReward:f.at>4?1:0,reportHarm:f.at>4?1:0})),falseReports:change(f=>({...f,...(f.at>4?{rewardA:false,harmA:false,reportReward:1,reportHarm:1,privateBit:true}:{})})),hiddenDenied:withheld.map(f=>({...f,...(f.at>4?{rewardA:false,harmA:false,privateBit:true}:{})})),
 };
}
