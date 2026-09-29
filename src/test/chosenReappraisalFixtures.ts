import type {Frame} from '../campaign3/chosenReappraisal';
export const SCENARIOS=['Balanced','SafetyOnly','WorkOnly','NoGoals','NoOpportunity','Interrupted','Unknown','SameInstant','EmptyCatalogue','DeniedCatalogue','AbsentCatalogue','Ineffective','Harmful','HiddenTruth','Mixed'] as const;
export type Scenario=typeof SCENARIOS[number];
export function chosenFrames(s:Scenario='Balanced'):Frame[]{
 const frames:Frame[]=Array.from({length:8},(_,i)=>({at:i+1,condition:i===0?1:i===1?2:0,physical:true,display:i!==1,observed:true,catalogue:i===0?2:0,catalogueObserved:true,opportunity:i===3,complete:true,safety:i===0?4:0,work:i===0?4:0}));
 if(s==='SafetyOnly')frames[0].work=0;if(s==='WorkOnly')frames[0].safety=0;if(s==='NoGoals')frames[0].safety=frames[0].work=0;
 if(s==='NoOpportunity')frames[3].opportunity=false;if(s==='Interrupted'){frames[3].complete=false;frames[0].work=0;}
 if(s==='Unknown')frames[1].observed=false;
 if(s==='SameInstant'){frames[1].condition=0;frames[3].condition=2;frames[3].display=false;}
 if(s==='EmptyCatalogue')frames[0].catalogue=1;if(s==='DeniedCatalogue')frames[0].catalogueObserved=false;if(s==='AbsentCatalogue')frames[0].catalogue=0;
 if(s==='Ineffective'){frames[1].display=true;frames[0].work=0;}if(s==='Harmful'){frames[0].display=false;frames[1].display=true;frames[0].work=0;}
 if(s==='HiddenTruth')for(const f of frames)f.physical=false;
 if(s==='Mixed'){frames[2].condition=2;frames[2].display=true;}
 return frames;
}
