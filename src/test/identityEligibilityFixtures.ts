import type {EligibilityInput} from '../campaign3/identityEligibility';
export const ELIGIBILITY_SCENARIOS=['Meaningful','Trivial','Instructed','Constrained','Forced','FailedExecution','WorkOnly','HomeOnly','PartialSignificance','PartialPressure'] as const;
export type EligibilityScenario=typeof ELIGIBILITY_SCENARIOS[number];
export function eligibilityInputs(scenario:EligibilityScenario):EligibilityInput[]{
 return Array.from({length:5},(_,i)=>({
  setting:i===4||scenario==='WorkOnly'?'Work':scenario==='HomeOnly'||i%2===1?'Home':'Work',
  significance:i===4?4:scenario==='Trivial'?0:scenario==='PartialSignificance'?1:4,
  pressure:i===4?0:scenario==='Constrained'?4:scenario==='PartialPressure'?2:0,
  instructed:i<4&&scenario==='Instructed',movement:i<4&&scenario==='Forced'?'Forced':'Chosen',permitted:scenario!=='FailedExecution',
 }));
}
