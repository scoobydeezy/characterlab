/** defining-continuation-inputs/0.1-candidate. Pure owner transitions awaiting native registration. */
import {ExactRational as Q} from '../substrate/exactMath';
import {adoptMaintenanceGoal,type MaintenanceGoal,type GoalInterval} from './bodilyMaintenanceGoal';
import {qualifyGoalOutcome} from './goalOutcomeQualification';
import {definingInterpretationInputs,type DefiningContinuationProgram} from './definingContinuationProgram';
const interval=(lo:bigint,hi:bigint):GoalInterval=>Object.freeze({lower:Object.freeze(Q.of(lo)),upper:Object.freeze(Q.of(hi))});
const bounds=interval(0n,100n),domains=new Map([['A',bounds]]),relations=new Map([['A',{kind:'MetricInterval' as const,bounds}]]);
export const definingInterpretationGoal='defining-interpretation';
export interface DefiningInterpretationState {readonly kind:'DefiningInterpretationState'}
type Report={readonly kind:'NotObserved'}|{readonly kind:'Missing';readonly at:43n}|{readonly kind:'Observed';readonly at:43n;readonly interval:GoalInterval};
interface Owned {readonly inputs:ReturnType<typeof definingInterpretationInputs>;readonly adopted:boolean;readonly goals:readonly MaintenanceGoal[];readonly report:Report}
const states=new WeakMap<DefiningInterpretationState,Owned>();
function issue(value:Owned){const state=Object.freeze({kind:'DefiningInterpretationState' as const});states.set(state,Object.freeze(value));return state;}
function owned(state:DefiningInterpretationState){const value=states.get(state);if(!value)throw Error('DEFINING_INTERPRETATION_STATE');return value;}
export function initialDefiningInterpretation(program:DefiningContinuationProgram){const inputs=definingInterpretationInputs(program);return issue({inputs,adopted:false,goals:Object.freeze([]),report:Object.freeze({kind:'NotObserved'})});}
export function adoptDefiningInterpretation(state:DefiningInterpretationState,at:bigint){
 const prior=owned(state),spec=prior.inputs;if(at!==37n||prior.adopted)throw Error('DEFINING_INTERPRETATION_ADOPTION');
 const desired=spec.goal==='High'?interval(30n,31n):spec.goal==='Low'?interval(20n,21n):bounds;
 const goals=spec.goal==='Absent'?[]:adoptMaintenanceGoal([],{character:'holder',goal:definingInterpretationGoal,signal:'A',desired,adoptedAt:37n,activeFrom:38n,expiresAt:5001n},domains);
 return issue({...prior,adopted:true,goals:Object.freeze(goals)});
}
/** Authored safe report is independent of worldAfter; this owner never receives world truth. */
export function receiveDefiningReport(state:DefiningInterpretationState,at:bigint){
 const prior=owned(state);if(at!==43n||!prior.adopted||prior.report.kind!=='NotObserved')throw Error('DEFINING_REPORT_DELIVERY');
 const kind=prior.inputs.report,report:Report=kind==='missing'?Object.freeze({kind:'Missing',at:43n}):Object.freeze({kind:'Observed',at:43n,interval:kind==='original'?interval(30n,31n):interval(20n,21n)});
 return issue({...prior,report});
}
export function readDefiningInterpretation(state:DefiningInterpretationState){const value=owned(state);return Object.freeze({adopted:value.adopted,goals:value.goals,report:value.report});}
function assess(state:DefiningInterpretationState,before:GoalInterval|null,after:GoalInterval|null,at:bigint){const value=owned(state);if(!value.adopted)throw Error('DEFINING_INTERPRETATION_NOT_ADOPTED');return qualifyGoalOutcome({state:value.goals,character:'holder',goal:definingInterpretationGoal,signal:'A',now:at,before,after,domains:relations});}
/** before/after must come from the later native acquired-evidence accessor, not a world accessor. */
export function assessDefiningHistory(state:DefiningInterpretationState,before:GoalInterval|null,after:GoalInterval|null,at:bigint){if(at!==38n)throw Error('DEFINING_HISTORY_TIME');if(owned(state).report.kind!=='NotObserved')throw Error('DEFINING_HISTORY_AFTER_REPORT');return assess(state,before,after,at);}
export function assessDefiningCurrent(state:DefiningInterpretationState,before:GoalInterval|null,at:bigint){const report=owned(state).report;if(at!==43n||report.kind==='NotObserved')throw Error('DEFINING_CURRENT_BEFORE_REPORT');return assess(state,before,report.kind==='Observed'?report.interval:null,at);}
