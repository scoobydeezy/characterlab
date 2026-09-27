import type {IdentityBeliefInput,IdentityBeliefLaw} from '../campaign3/identityBelief';
import {eligibilityInputs} from './identityEligibilityFixtures';
export const IDENTITY_BELIEF_SCENARIOS=['Primary','AllActual','MissingSelf','MissingA','Blind','Correction','GoalFlip','FailedExecution','Trivial','Forced','NeutralA'] as const;
export type IdentityBeliefScenario=typeof IDENTITY_BELIEF_SCENARIOS[number];
export function identityBeliefInputs(scenario:IdentityBeliefScenario):IdentityBeliefInput{
 const source=eligibilityInputs(['FailedExecution','Trivial','Forced'].includes(scenario)?scenario as 'FailedExecution'|'Trivial'|'Forced':'Meaningful');
 const channels:IdentityBeliefInput['channels']=Array.from({length:5},(_,i)=>[
  scenario==='MissingSelf'?'Absent':'Actual',
  ['MissingA','Blind'].includes(scenario)?'Absent':scenario==='NeutralA'?'Neutral':scenario==='Correction'&&i<2?'Opposite':'Actual',
  scenario==='Blind'?'Absent':['AllActual','Correction'].includes(scenario)?'Actual':'Opposite',
 ]);
 const goals:IdentityBeliefInput['goals']=Array.from({length:5},(_,i)=>[0,1,2].map(()=>scenario==='GoalFlip'&&i===4?-1:1));return {source,channels,goals};
}
export function identityBeliefRoster(){
 const rows:{law:IdentityBeliefLaw;scenario:IdentityBeliefScenario;seed:number}[]=[];
 for(const law of ['Mean','Latest'] as const)for(let seed=0;seed<8;seed++)rows.push({law,scenario:'Primary',seed});
 for(const scenario of IDENTITY_BELIEF_SCENARIOS.filter(s=>s!=='Primary'))rows.push({law:'Mean',scenario,seed:scenario==='Correction'?6:1});
 rows.push({law:'Mean',scenario:'Blind',seed:6});
 for(const law of ['NoLearning','StandingAlias','PrivateOracle'] as const)for(const scenario of ['Primary','MissingSelf','Blind'] as const)rows.push({law,scenario,seed:1});
 rows.push({law:'PrivateOracle',scenario:'Blind',seed:6});return rows;
}
