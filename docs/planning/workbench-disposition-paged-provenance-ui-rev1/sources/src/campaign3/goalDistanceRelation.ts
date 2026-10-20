/** goal-distance-relation-component/0.1-candidate; trusted model and read context. */
import {ExactRational as Q} from '../substrate/exactMath';
import {readMaintenanceConcern,type MaintenanceGoal,type GoalInterval} from './bodilyMaintenanceGoal';
export interface SignalRelationDomain {readonly kind:'MetricInterval'|'OrdinalInterval';readonly bounds:GoalInterval}
export type GoalPosition='BelowGoal'|'WithinGoal'|'AboveGoal'|'AmbiguousPosition';
const zero=Q.of(0n),max=(...xs:Q[])=>xs.reduce((a,b)=>a.compare(b)>=0?a:b);
const clone=(x:GoalInterval)=>Object.freeze({lower:Object.freeze(Q.of(x.lower.numerator,x.lower.denominator)),upper:Object.freeze(Q.of(x.upper.numerator,x.upper.denominator))});
function valid(x:GoalInterval){if(!x||!(x.lower instanceof Q)||!(x.upper instanceof Q)||x.lower.compare(x.upper)>0)throw Error('GOAL_RELATION_INTERVAL');}
function position(e:GoalInterval,g:GoalInterval):GoalPosition{return e.upper.compare(g.lower)<0?'BelowGoal':e.lower.compare(g.upper)>0?'AboveGoal':e.lower.compare(g.lower)>=0&&e.upper.compare(g.upper)<=0?'WithinGoal':'AmbiguousPosition';}
function distance(e:GoalInterval,g:GoalInterval){const point=(x:Q)=>max(g.lower.subtract(x),zero,x.subtract(g.upper));return clone({lower:max(g.lower.subtract(e.upper),zero,e.lower.subtract(g.upper)),upper:max(point(e.lower),point(e.upper))});}
export function assessGoalDistance(input:{readonly state:readonly MaintenanceGoal[];readonly character:string;readonly goal:string;readonly signal:string;readonly now:bigint;readonly before:GoalInterval|null;readonly after:GoalInterval|null;readonly domains:ReadonlyMap<string,SignalRelationDomain>}){
 const definition=input.domains.get(input.signal);if(!definition||definition.kind!=='MetricInterval')throw Error('GOAL_RELATION_METRIC_REQUIRED');valid(definition.bounds);
 for(const e of [input.before,input.after])if(e!==null){valid(e);if(e.lower.compare(definition.bounds.lower)<0||e.upper.compare(definition.bounds.upper)>0)throw Error('GOAL_RELATION_EVIDENCE_DOMAIN');}
 const concern=readMaintenanceConcern(input.state,input.character,input.goal,input.now,new Map([...input.domains].map(([s,d])=>[s,d.bounds])));
 if(concern.kind==='Unavailable')return Object.freeze({kind:'Unavailable' as const,reason:concern.reason});
 if(concern.concern.signal!==input.signal)throw Error('GOAL_RELATION_SIGNAL_MISMATCH');
 if(input.before===null||input.after===null)return Object.freeze({kind:'Unavailable' as const,reason:'MissingEvidence' as const});
 const goal=concern.concern.desired,before=distance(input.before,goal),after=distance(input.after,goal);
 const relation=after.upper.compare(before.lower)<0?'MovingCloser':after.lower.compare(before.upper)>0?'MovingFarther':before.lower.equals(before.upper)&&after.lower.equals(after.upper)&&before.lower.equals(after.lower)?'SameDistance':'IndeterminateRelation';
 const beforePosition=position(input.before,goal),afterPosition=position(input.after,goal);
 const boundary=beforePosition==='AmbiguousPosition'||afterPosition==='AmbiguousPosition'?'IndeterminateBoundary':beforePosition!=='WithinGoal'&&afterPosition==='WithinGoal'?'Attainment':beforePosition==='WithinGoal'&&afterPosition!=='WithinGoal'?'Violation':'NoBoundaryChange';
 return Object.freeze({kind:'Assessed' as const,at:input.now,concern:concern.concern,before,after,relation,beforePosition,afterPosition,boundary});
}
export function satisfactionBoundaryControl(result:ReturnType<typeof assessGoalDistance>){return result.kind==='Unavailable'?result:Object.freeze({kind:'Assessed' as const,beforePosition:result.beforePosition,afterPosition:result.afterPosition,boundary:result.boundary});}
