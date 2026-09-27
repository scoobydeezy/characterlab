import {list,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {performanceRecord as r} from './performanceCodecs';
import {evaluateGoalStrategy,type Availability,type RouteObservation} from './goalStrategyComponent';
import {OBSERVER,instant} from './performanceModel';
export function evaluatePerformance(id:CanonicalValue,at:number,goal:CanonicalValue|undefined,plan:CanonicalValue|undefined,knowledge:CanonicalValue,law:number) {
  const k=rec(knowledge,1300n),outcomes=items(f(k,2n),'list'),observations:RouteObservation[]=items(f(k,1n),'list').map(value=>{const o=rec(value,1301n);return {receipt:Number(uint(f(o,6n))),goal:'goal/delivery',route:uint(f(o,4n))===1n?'route-a':'route-b',available:f(o,5n)===true,observedAt:instant(f(o,7n)),validUntil:instant(f(o,8n))};});
  const status=goal?uint(f(rec(goal,1296n),2n)):0n,priorRoute=plan?uint(f(rec(plan,1298n),2n)):0n;
  const result=evaluateGoalStrategy({goal:status===1n||status===2n?{id:'goal/delivery',desired:'item-at-destination',status:status===1n?'Active':'Fulfilled'}:null,priorRoute:priorRoute===1n?'route-a':priorRoute===2n?'route-b':null,at,observations,perceivedFailure:false},'SeparateGoalPlan');
  const availability=(x:Availability)=>x.kind==='Known'?x.available?3:2:x.reason==='Missing'?0:1;
  let selected=result.selectedRoute==='route-a'?1:result.selectedRoute==='route-b'?2:0,count=0;
  const started=plan?instant(f(rec(plan,1298n),4n)):at;
  for(const value of [...outcomes].reverse()){
    const o=rec(value,1301n);if(instant(f(o,3n))<started||uint(f(o,9n))!==priorRoute||f(o,5n)===true)break;count++;
  }
  const other=priorRoute===1n?2:1,canSwitch=status===1n&&selected===Number(priorRoute)&&selected>0&&availability(result.availability[other===1?'route-a':'route-b'])===3;
  const switched=law!==2&&canSwitch&&count>=(law===3?1:2);if(switched)selected=other;
  return r(1304,[id,signed(at),list(goal?[goal]:[]),list(plan?[plan]:[]),result.desireActive,u(selected),false,u(availability(result.availability['route-a'])),u(availability(result.availability['route-b'])),knowledge,u(count),switched]);
}
export function learnPerformanceEvidence(prior:CanonicalValue,evidence:CanonicalValue) {
  const p=rec(prior,1300n),routes=[...items(f(p,1n),'list')];let outcome=[...items(f(p,2n),'list')];
  for(const value of items(f(rec(evidence,1302n),2n),'list')) {
    const o=rec(value,1301n),kind=uint(f(o,4n));if(key(f(o,2n))!==key(OBSERVER))throw Error('PERFORMANCE_FOREIGN_EVIDENCE');
    if(kind===1n||kind===2n) {
      const same=routes.find(v=>key(f(rec(v,1301n),6n))===key(f(o,6n)));
      if(same){for(const n of [4n,5n,7n,8n])if(key(f(rec(same,1301n),n))!==key(f(o,n)))throw Error('PERFORMANCE_EVIDENCE_CONFLICT');}
      else routes.push(value);
    } else if(kind===3n){if(![1n,2n].includes(uint(f(o,9n))))throw Error('PERFORMANCE_OUTCOME_ROUTE');if(!outcome.some(x=>key(f(rec(x,1301n),1n))===key(f(o,1n))))outcome.push(value);}
  }
  return r(1300,[list(routes),list(outcome)]);
}
export function performanceObserverView(outputs:readonly CanonicalValue[],observer=0) {
  if(observer!==0)throw Error('PERFORMANCE_OBSERVER_HANDLE');
  return list(outputs.filter(value=>{
    if(typeof value==='boolean'||value.kind!=='record')throw Error('PERFORMANCE_OUTPUT_ROSTER');
    const type=value.schema.typeId;if(type===1306n)return false;
    if(![1301n,1302n,1304n,1305n,1307n,1308n,1309n].includes(type))throw Error('PERFORMANCE_OUTPUT_ROSTER');
    if(type===1301n&&key(f(value,2n))!==key(OBSERVER))throw Error('PERFORMANCE_FOREIGN_OBSERVER');
    return true;
  }));
}
