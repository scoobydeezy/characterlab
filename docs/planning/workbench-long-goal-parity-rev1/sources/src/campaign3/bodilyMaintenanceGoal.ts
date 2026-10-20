/** bodily-maintenance-goal-component/0.1-candidate; trusted owner/model inputs only. */
import {ExactRational as Q} from '../substrate/exactMath';
export interface GoalInterval {readonly lower:Q;readonly upper:Q}
export interface MaintenanceGoal {readonly character:string;readonly goal:string;readonly signal:string;readonly desired:GoalInterval;readonly adoptedAt:bigint;readonly activeFrom:bigint;readonly expiresAt:bigint;readonly status:'Open'|'Withdrawn'|'Expired';readonly changedAt:bigint}
export type GoalDomains=ReadonlyMap<string,GoalInterval>;
const sym=(s:string)=>{if(typeof s!=='string'||!s||s!==s.normalize('NFC')||new TextEncoder().encode(s).length>64)throw Error('GOAL_SYMBOL');};
const interval=(x:GoalInterval)=>{if(!x||!(x.lower instanceof Q)||!(x.upper instanceof Q)||x.lower.compare(x.upper)>0)throw Error('GOAL_INTERVAL');};
const copyInterval=(x:GoalInterval)=>Object.freeze({lower:Object.freeze(Q.of(x.lower.numerator,x.lower.denominator)),upper:Object.freeze(Q.of(x.upper.numerator,x.upper.denominator))});
function copy(state:readonly MaintenanceGoal[],domains:GoalDomains){
 if(!Array.isArray(state)||state.length>16||Array.from({length:state.length},(_,i)=>Object.hasOwn(state,i)).some(x=>!x))throw Error('GOAL_BOUND');
 const keys=new Set<string>();return state.map(g=>{sym(g.character);sym(g.goal);sym(g.signal);const k=JSON.stringify([g.character,g.goal]);if(keys.has(k))throw Error('GOAL_DUPLICATE');keys.add(k);
  interval(g.desired);const d=domains.get(g.signal);if(!d)throw Error('GOAL_SIGNAL_DOMAIN');interval(d);if(g.desired.lower.compare(d.lower)<0||g.desired.upper.compare(d.upper)>0)throw Error('GOAL_OUTSIDE_DOMAIN');
  for(const t of [g.adoptedAt,g.activeFrom,g.expiresAt,g.changedAt])if(typeof t!=='bigint'||t<0n)throw Error('GOAL_TIME');
  if(g.adoptedAt>g.activeFrom||g.activeFrom>=g.expiresAt||g.changedAt<g.adoptedAt)throw Error('GOAL_TIME');
  if(g.status==='Open'){if(g.changedAt!==g.adoptedAt)throw Error('GOAL_OPEN_HISTORY');}
  else if(g.status==='Withdrawn'){if(g.changedAt>=g.expiresAt)throw Error('GOAL_WITHDRAW_HISTORY');}
  else if(g.status==='Expired'){if(g.changedAt!==g.expiresAt)throw Error('GOAL_EXPIRE_HISTORY');}
  else throw Error('GOAL_STATUS');
  return Object.freeze({...g,desired:copyInterval(g.desired)});
 });
}
export function adoptMaintenanceGoal(state:readonly MaintenanceGoal[],goal:Omit<MaintenanceGoal,'status'|'changedAt'>,domains:GoalDomains){return copy([...state,{...goal,status:'Open',changedAt:goal.adoptedAt}],domains);}
export function settleMaintenanceGoal(state:readonly MaintenanceGoal[],character:string,goal:string,now:bigint,event:'Withdraw'|'Expire',domains:GoalDomains){
 const next=copy(state,domains),i=next.findIndex(g=>g.character===character&&g.goal===goal),g=next[i];
 if(!g||g.status!=='Open')throw Error('GOAL_LIFECYCLE_TARGET');
 if(typeof now!=='bigint'||now<g.adoptedAt)throw Error('GOAL_TIME');
 if(event==='Withdraw'){if(now>=g.expiresAt)throw Error('GOAL_WITHDRAW_TIME');}
 else if(event==='Expire'){if(now!==g.expiresAt)throw Error('GOAL_EXPIRE_TIME');}
 else throw Error('GOAL_EVENT');
 next[i]=Object.freeze({...g,status:event==='Withdraw'?'Withdrawn':'Expired',changedAt:now});return next;
}
export function readMaintenanceConcern(state:readonly MaintenanceGoal[],character:string,goal:string,now:bigint,domains:GoalDomains){
 if(typeof now!=='bigint'||now<0n)throw Error('GOAL_TIME');
 const g=copy(state,domains).find(g=>g.character===character&&g.goal===goal);
 const unavailable=(reason:'Absent'|'Pending'|'Withdrawn'|'Expired')=>Object.freeze({kind:'Unavailable' as const,reason});
 if(!g)return unavailable('Absent');
 if(now<g.changedAt)throw Error('GOAL_HISTORICAL_READ');
 if(g.status!=='Open')return unavailable(g.status);
 if(now>=g.expiresAt)throw Error('GOAL_EXPIRY_NOT_SETTLED');
 if(now<g.activeFrom)return unavailable('Pending');
 return Object.freeze({kind:'Active' as const,at:now,concern:g});
}
/** maintenance-goal-deadline-component/0.1-candidate; actual scheduled deadline authentication upstream. */
export function settleMaintenanceGoalDeadline(state:readonly MaintenanceGoal[],character:string,goal:string,now:bigint,domains:GoalDomains){
 const prior=copy(state,domains),g=prior.find(g=>g.character===character&&g.goal===goal);
 if(!g||g.status==='Expired')throw Error('GOAL_DEADLINE_TARGET');
 if(typeof now!=='bigint'||now!==g.expiresAt)throw Error('GOAL_DEADLINE_TIME');
 if(g.status==='Withdrawn')return Object.freeze({kind:'AlreadyWithdrawn' as const,state:Object.freeze(prior)});
 return Object.freeze({kind:'Expired' as const,state:Object.freeze(settleMaintenanceGoal(prior,character,goal,now,'Expire',domains))});
}
