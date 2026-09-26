import type {Frame} from '../campaign3/dependenceSubstitutes';
export const frame=(at:number,patch:Partial<Frame>={}):Frame=>({at,mode:at<=4?(at%2?1:2):at===5?0:3,visible:true,demand:1,cue:true,availableA:at<6,availableB:true,actualA:true,actualB:true,receipt:at!==5,report:0,infoA:0,infoB:0,privateBit:false,...patch});
export function substitutionCases(){
 const diversified=Array.from({length:8},(_,i)=>frame(i+1)),concentrated=diversified.map(x=>({...x,mode:x.at<=4?1:x.mode}));
 const corrected=(xs:Frame[])=>xs.map(x=>({...x,...(x.at===5?{infoA:1,infoB:1}:{}),...(x.at>=6?{availableA:true,receipt:false}:{})}));
 const correctedConcentrated=corrected(concentrated),correctedDiversified=corrected(diversified),deniedFeedback=diversified.map(x=>({...x,receipt:x.at<=4}));
 return {
  diversified,concentrated,
  knownAlternative:concentrated.map(x=>({...x,...(x.at===5?{infoB:2}:{})})),
  knownFailure:concentrated.map(x=>({...x,...(x.at===5?{infoB:1}:{})})),
  unavailable:diversified.map(x=>({...x,...(x.at>=6?{availableB:false}:{})})),
  noDemand:diversified.map(x=>({...x,...(x.at>=6?{demand:0}:{})})),
  restoredA:concentrated.map(x=>({...x,...(x.at===8?{availableA:true}:{})})),
  correctedConcentrated,correctedDiversified,
  otherCue:correctedDiversified.map(x=>({...x,...(x.at>=6?{cue:false}:{})})),
  bothAvailable:diversified.map(x=>({...x,availableA:true})),
  unseenTraining:diversified.map(x=>({...x,...(x.at<=4?{receipt:false}:{})})),
  falseTraining:diversified.map(x=>({...x,...(x.at<=4?{actualA:false,actualB:false,report:1}:{})})),
  deniedFeedback,
  hiddenBlocked:deniedFeedback.map(x=>({...x,...(x.at>=6?{actualA:false,actualB:false,privateBit:true}:{})})),
  failure:diversified.map(x=>({...x,...(x.at===6?{actualB:false}:{})})),
  falseSuccess:diversified.map(x=>({...x,...(x.at>=6?{actualB:false,report:1}:{})})),
  trueSuccess:diversified.map(x=>({...x,...(x.at>=6?{report:1}:{})})),
  deniedInfo:concentrated.map(x=>({...x,...(x.at===5?{visible:false,infoB:2}:{})})),
  absentInfo:concentrated.map(x=>({...x,...(x.at===5?{visible:false}:{})})),
 };
}
