import {list,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {goalStrategyRecord as r} from './goalStrategyCodecs';
import {evaluateGoalStrategy,type Availability,type Candidate,type RouteObservation} from './goalStrategyComponent';
import {OBSERVER,instant} from './goalStrategyModel';
export function evaluatePublicGoal(id:CanonicalValue,at:number,goal:CanonicalValue|undefined,plan:CanonicalValue|undefined,knowledge:CanonicalValue,law:number) {
  const k=rec(knowledge,997n),outcomes=items(f(k,2n),'list'),observations:RouteObservation[]=items(f(k,1n),'list').map(value=>{const o=rec(value,998n);return {receipt:Number(uint(f(o,6n))),goal:'goal/delivery',route:uint(f(o,4n))===1n?'route-a':'route-b',available:f(o,5n)===true,observedAt:instant(f(o,7n)),validUntil:instant(f(o,8n))};});
  const status=goal?uint(f(rec(goal,993n),2n)):0n,priorRoute=plan?uint(f(rec(plan,995n),2n)):0n;
  const result=evaluateGoalStrategy({goal:status===1n||status===2n?{id:'goal/delivery',desired:'item-at-destination',status:status===1n?'Active':'Fulfilled'}:null,priorRoute:priorRoute===1n?'route-a':priorRoute===2n?'route-b':null,at,observations,perceivedFailure:outcomes.length>0&&f(rec(outcomes[0],998n),5n)===false},(['SeparateGoalPlan','GoalEqualsPlan','FixedRoute','FailureAbandonsGoal'] as Candidate[])[law-1]);
  const availability=(x:Availability)=>x.kind==='Known'?x.available?3:2:x.reason==='Missing'?0:1;
  return r(1001,[id,signed(at),list(goal?[goal]:[]),list(plan?[plan]:[]),result.desireActive,u(result.selectedRoute==='route-a'?1:result.selectedRoute==='route-b'?2:0),status===1n&&result.goal===null,u(availability(result.availability['route-a'])),u(availability(result.availability['route-b']))]);
}
export function learnGoalEvidence(prior:CanonicalValue,evidence:CanonicalValue) {
  const p=rec(prior,997n),routes=[...items(f(p,1n),'list')];let outcome=[...items(f(p,2n),'list')];
  for(const value of items(f(rec(evidence,999n),2n),'list')) {
    const o=rec(value,998n),kind=uint(f(o,4n));if(key(f(o,2n))!==key(OBSERVER))throw Error('GOAL_FOREIGN_EVIDENCE');
    if(kind===1n||kind===2n) {
      const same=routes.find(v=>key(f(rec(v,998n),6n))===key(f(o,6n)));
      if(same){for(const n of [4n,5n,7n,8n])if(key(f(rec(same,998n),n))!==key(f(o,n)))throw Error('GOAL_EVIDENCE_CONFLICT');}
      else routes.push(value);
    } else if(kind===3n)outcome=[value];
  }
  return r(997,[list(routes),list(outcome)]);
}
export function goalStrategyObserverView(outputs:readonly CanonicalValue[],observer=0) {
  if(observer!==0)throw Error('GOAL_OBSERVER_HANDLE');
  return list(outputs.filter(value=>{
    if(typeof value==='boolean'||value.kind!=='record')throw Error('GOAL_OUTPUT_ROSTER');
    const type=value.schema.typeId;if(type===1003n)return false;
    if(![998n,999n,1001n,1002n,1004n,1005n,1006n].includes(type))throw Error('GOAL_OUTPUT_ROSTER');
    if(type===998n&&key(f(value,2n))!==key(OBSERVER))throw Error('GOAL_FOREIGN_OBSERVER');
    return true;
  }));
}
