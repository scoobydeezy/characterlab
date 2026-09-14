/** goal-assessment-production/0.1-candidate; public producer/PRJ authentication remains upstream. */
import {freezeAndStageSemanticExperience,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {canonicalEncode} from '../substrate/canonicalEncoding';
import {observerIdValue} from '../semanticBinding/semanticCodecs';
import {qualifyGoalOutcome,projectGoalQualification} from './goalOutcomeQualification';
type Input=Parameters<typeof qualifyGoalOutcome>[0];
declare const brand:unique symbol;export interface PreparedGoalAssessment {readonly [brand]:true}
type Header={observer:string;at:bigint};
type Prepared=(Header&{kind:'NoConsequence'})|(Header&{kind:'Assessment';consequence:bigint;character:string;goal:string;result:ReturnType<typeof qualifyGoalOutcome>});
const prepared=new WeakMap<object,Prepared>();
/** The trusted outer read callback is not invoked for completed consequence absence. */
export function prepareGoalAssessment(staged:StagedSemanticExperience|null,observer:string,at:bigint,read:()=>Input):PreparedGoalAssessment{
 if(typeof observer!=='string'||!observer)throw Error('GOAL_ASSESSMENT_OBSERVER');
 canonicalEncode(observerIdValue(observer));if(typeof at!=='bigint'||at<0n)throw Error('GOAL_ASSESSMENT_TIME');
 let value:Prepared={kind:'NoConsequence',observer,at};
 if(staged!==null){
  if(staged.reservation.lane!=='Consequence'||staged.stagedAtPhase!==124n||staged.experience.transformationVersion!=='semantic-binding/0.1-candidate#SEM-001H')throw Error('GOAL_ASSESSMENT_CONSEQUENCE');
  const validated=freezeAndStageSemanticExperience(staged.reservation,staged.experience,staged.stagedAtPhase);
  if(validated.experience.observerId!==observer||validated.experience.occurredAt!==at)throw Error('GOAL_ASSESSMENT_SOURCE');
  const input=read();if(input.now!==at)throw Error('GOAL_ASSESSMENT_TIME');
  value={kind:'Assessment',observer,at,consequence:validated.experience.experienceId,character:input.character,goal:input.goal,result:qualifyGoalOutcome(input)};
 }
 const view=Object.freeze({}) as PreparedGoalAssessment;prepared.set(view,value);return view;
}
export function produceGoalAssessment(view:PreparedGoalAssessment,allocate:()=>bigint){
 const value=prepared.get(view);if(!value)throw Error('GOAL_ASSESSMENT_VIEW');prepared.delete(view);
 if(value.kind==='NoConsequence')return {...value};
 const assessmentId=allocate();if(typeof assessmentId!=='bigint'||assessmentId<0n)throw Error('GOAL_ASSESSMENT_ALLOCATION');
 const {kind,result,...header}=value;
 const transformationVersion='goal-assessment-production/0.1-candidate';
 return {kind:'Assessment' as const,assessment:{assessmentId,...header,transformationVersion,result},carry:{assessmentId,observer:value.observer,character:value.character,goal:value.goal,consequence:value.consequence,assessedAt:value.at,transformationVersion,qualification:projectGoalQualification(result)}};
}
export function closeGoalAssessment(view:PreparedGoalAssessment){prepared.delete(view);}
