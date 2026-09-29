import type {Frame} from '../campaign3/embarrassment';
export const SCENARIOS=['Balanced','AvoidOnly','ParticipateOnly','NoImageGoal','NoGoals','Interrupted','NoOpportunity','NoMismatch','Unseen','UnknownJudgment','UnknownMismatch','UnknownSeen','Nonnegative','HiddenTruth','DeniedChanged','DeniedUnchanged','Correction','Mixed','DisplayOff','FalseReport'] as const;
export type Scenario=typeof SCENARIOS[number];
export function embarrassmentFrames(s:Scenario='Balanced'):Frame[]{const xs:Frame[]=Array.from({length:6},(_,i)=>({at:i+1,worldMismatch:true,worldSeen:true,worldJudgment:true,mismatch:true,mismatchAccess:i===0,seen:true,seenAccess:i===0,judgment:true,judgmentAccess:i===0,reputation:i===0?4:0,avoid:i===0?1:0,participate:i===0?4:0,opportunity:i===3,complete:true,display:true}));
 if(s==='AvoidOnly'||s==='Interrupted')xs[0].participate=0;if(s==='ParticipateOnly')xs[0].avoid=0;if(s==='NoImageGoal')xs[0].reputation=0;if(s==='NoGoals')xs[0].reputation=xs[0].avoid=xs[0].participate=0;
 if(s==='Interrupted')xs[3].complete=false;if(s==='NoOpportunity')xs[3].opportunity=false;if(s==='NoMismatch')xs[0].mismatch=false;if(s==='Unseen')xs[0].seen=false;if(s==='UnknownJudgment')xs[0].judgmentAccess=false;if(s==='UnknownMismatch')xs[0].mismatchAccess=false;if(s==='UnknownSeen')xs[0].seenAccess=false;if(s==='Nonnegative')xs[0].judgment=false;
 if(s==='HiddenTruth'||s==='FalseReport')for(const x of xs)x.worldMismatch=x.worldSeen=x.worldJudgment=false;
 if(s==='DeniedChanged'||s==='DeniedUnchanged'){xs[0].judgmentAccess=false;for(const x of xs)x.judgment=s==='DeniedUnchanged';}
 if(s==='Correction'){xs[3].judgmentAccess=true;xs[3].judgment=false;}if(s==='Mixed'){xs[1].judgmentAccess=true;xs[1].judgment=false;}if(s==='DisplayOff')for(const x of xs)x.display=false;
 return xs;
}
