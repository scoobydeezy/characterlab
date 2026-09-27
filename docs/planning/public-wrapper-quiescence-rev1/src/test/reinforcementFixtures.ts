import {frame} from './substitutionFixtures';
import type {Frame} from '../campaign3/dependenceSubstitutes';
export function reinforcementCases(){
 const full:Frame[]=Array.from({length:8},(_,i)=>frame(i+1,{mode:i===0?0:i===1?1:i===2?2:3,infoA:i===0?1:0,infoB:i===0?1:0,availableA:true,availableB:true,receipt:i>0}));
 const withheld=full.map(x=>({...x,receipt:x.at<=3&&x.receipt}));
 return {full,withheld,
  falseSuccess:full.map(x=>({...x,...(x.at>=4?{actualA:false,actualB:false,report:1}:{})})),
  trueSuccess:full.map(x=>({...x,...(x.at>=4?{report:1}:{})})),
  hiddenFailure:withheld.map(x=>({...x,...(x.at>=4?{actualA:false,actualB:false,privateBit:true}:{})})),
  failure:full.map(x=>({...x,...(x.at>=4?{actualA:false,actualB:false}:{})})),
  noDemand:full.map(x=>({...x,...(x.at>=4?{demand:0}:{})})),
  unavailable:full.map(x=>({...x,...(x.at>=4?{availableA:false,availableB:false}:{})})),
  unseenTraining:full.map(x=>({...x,...(x.at===2||x.at===3?{receipt:false}:{})})),
 };
}
