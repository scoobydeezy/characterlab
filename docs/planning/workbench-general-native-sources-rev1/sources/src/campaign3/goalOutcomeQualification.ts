/** goal-outcome-qualification-component/0.1-candidate; no target credit or writes. */
import {assessGoalDistance} from './goalDistanceRelation';
type Input=Parameters<typeof assessGoalDistance>[0];
function evaluate(input:Input,deteriorationOnly:boolean){
 const assessment=assessGoalDistance(input);
 if(assessment.kind==='Unavailable')return Object.freeze({kind:'QualificationUnavailable' as const,reason:'AssessmentUnavailable' as const,assessment});
 if(assessment.relation==='IndeterminateRelation')return Object.freeze({kind:'QualificationUnavailable' as const,reason:'IndeterminateRelation' as const,assessment});
 if(assessment.relation==='SameDistance')return Object.freeze({kind:'DoesNotQualify' as const,reason:'SameDistance' as const,assessment});
 if(deteriorationOnly&&assessment.relation==='MovingCloser')return Object.freeze({kind:'DoesNotQualify' as const,reason:'ComparatorExcludesProgress' as const,assessment});
 return Object.freeze({kind:'Qualifies' as const,direction:assessment.relation,assessment});
}
export const qualifyGoalOutcome=(input:Input)=>evaluate(input,false);
export const deteriorationOnlyQualification=(input:Input)=>evaluate(input,true);
/** goal-qualification-projection-component/0.1-candidate; trusted result, no provenance authentication. */
export function projectGoalQualification(result:ReturnType<typeof qualifyGoalOutcome>){
 if(result.kind==='Qualifies')return Object.freeze({kind:result.kind,direction:result.direction});
 if(result.kind==='DoesNotQualify')return Object.freeze({kind:result.kind,reason:result.reason});
 if(result.assessment.kind==='Unavailable')return Object.freeze({kind:'QualificationUnavailable' as const,reason:'AssessmentUnavailable' as const,cause:result.assessment.reason});
 return Object.freeze({kind:'QualificationUnavailable' as const,reason:'IndeterminateRelation' as const});
}
