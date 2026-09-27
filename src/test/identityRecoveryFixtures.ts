import {beliefCase} from './identityBeliefPublicFixtures';
import {orderedBytes} from '../campaign3/identityBeliefPublicModel';
import {identityRecipe,taskInitial,taskOrdered} from '../campaign3/identityPublicModel';
import type {IdentityBeliefLaw} from '../campaign3/identityBelief';
export const recoveryRoster=[
 {name:'Recovery',law:'Mean'}, {name:'Recovery',law:'Latest'}, {name:'Recovery',law:'NoLearning'},
 {name:'NoFinalSignificance',law:'Mean'}, {name:'WithheldRecoveryA',law:'Mean'},
 {name:'NeutralA',law:'Mean'}, {name:'AbsentA',law:'Mean'}, {name:'GoalFlip',law:'Mean'},
 {name:'FailedExecution',law:'Mean'}, {name:'NeutralRecovery',law:'Mean'}, {name:'Reversal',law:'Mean'},
 {name:'Source',law:'Threshold'}, {name:'Source',law:'NoFeedback'},
] as const;
export type RecoveryCase=typeof recoveryRoster[number];
export function recoveryCase(row:RecoveryCase){
 const sourceOnly=row.name==='Source',law=sourceOnly?'Mean':row.law as IdentityBeliefLaw;
 const c=beliefCase(law,'AllActual',row.name==='NeutralRecovery'?2:row.name==='Reversal'?3:4);
 if(!['NeutralRecovery','Reversal'].includes(row.name))c.input.source[2].significance=0;
 if(row.name==='NoFinalSignificance')c.input.source[3].significance=0;
 if(row.name==='WithheldRecoveryA')for(let i=1;i<5;i++)c.input.channels[i][1]='Absent';
 if(row.name==='NeutralA'||row.name==='AbsentA')for(const x of c.input.channels)x[1]=row.name==='NeutralA'?'Neutral':'Absent';
 if(row.name==='GoalFlip')c.input.goals[4]=[-1,-1,-1];
 if(row.name==='FailedExecution')for(const x of c.input.source)x.permitted=false;
 // Existing Primary uses opposite observer-b; retain exact original identity for the two reused cases.
 if(['NeutralRecovery','Reversal'].includes(row.name))for(const x of c.input.channels)x[2]='Opposite';
 return {...c,source:sourceOnly?identityRecipe('Task',row.law as 'Threshold'|'NoFeedback'):c.source,initialState:sourceOnly?taskInitial():c.initialState,orderedInputs:sourceOnly?taskOrdered(c.input.source):orderedBytes(c.input),sourceOnly};
}
