import type {Frame} from '../campaign3/intentionForgetting';
export const make=(change:(at:number)=>Partial<Frame>=()=>({})):Frame[]=>Array.from({length:8},(_,i)=>{const at=i+1;return {at,instruction:at===1?1:0,visible:true,neutral:at===2,cue:at===2?2:at===4?1:0,opportunity:at>=2,cancel:false,capacity:2,execution:true,receipt:true,report:0,privateBit:false,...change(at)};});
export function intentionCases(){return {
 main:make(),noCue:make(()=>({cue:0})),lost:make(()=>({capacity:1})),wrongCue:make(at=>({cue:at===2||at===4?2:0})),
 routeB:make(at=>({instruction:at===1?2:0})),lostB:make(at=>({capacity:1,instruction:at===1?2:0})),
 cancelled:make(at=>({cancel:at===3})),expired:make(at=>({cue:at===6?1:0})),noOpportunity:make(()=>({opportunity:false})),
 blocked:make(()=>({execution:false})),hidden:make(()=>({receipt:false})),hiddenBlocked:make(()=>({receipt:false,execution:false,privateBit:true})),
 falseReceipt:make(()=>({execution:false,report:1})),trueReceipt:make(()=>({report:1})),
 denied:make(at=>({visible:at!==1})),deniedB:make(at=>({visible:at!==1,instruction:at===1?2:0,privateBit:true})),
 noNeutral:make(()=>({capacity:1,neutral:false})),lateCue:make(at=>({cue:at===5?1:0})),
 };}
