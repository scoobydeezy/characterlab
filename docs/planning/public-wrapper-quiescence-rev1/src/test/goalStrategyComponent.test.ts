import {describe,it,expect} from 'vitest';
import {evaluateGoalStrategy, type Goal, type RouteObservation} from '../campaign3/goalStrategyComponent';
const goal: Goal = {id:'goal/delivery',desired:'item-at-destination',status:'Active'};
const observation = (receipt:number,route:'route-a'|'route-b',available:boolean,observedAt=1,validUntil=8):RouteObservation => ({receipt,goal:'goal/delivery',route,available,observedAt,validUntil});
const evaluate = (observations:readonly RouteObservation[], extra:Partial<Parameters<typeof evaluateGoalStrategy>[0]>={}) => evaluateGoalStrategy({goal,priorRoute:'route-a',at:2,observations,perceivedFailure:false,...extra});
describe('goal-strategy-component/0.1-candidate',()=>{
  it('switches route on admitted closure while preserving goal identity and desired outcome',()=>{
    const result=evaluate([observation(1,'route-a',false),observation(2,'route-b',true)]);
    expect(result.selectedRoute).toBe('route-b');expect(result.goal).toEqual(goal);expect(result.desireActive).toBe(true);
  });
  it('retains desire across a no-route gap and resumes without another adoption',()=>{
    const gap=evaluate([observation(1,'route-a',false),observation(2,'route-b',false)]);
    expect(gap.selectedRoute).toBeNull();expect(gap.desireActive).toBe(true);
    const resumed=evaluate([observation(3,'route-b',true,3)],{goal:gap.goal,priorRoute:gap.selectedRoute,at:3});
    expect(resumed.goal).toEqual(goal);expect(resumed.selectedRoute).toBe('route-b');
  });
  it('does not infer goal abandonment or route closure from failure alone',()=>{
    const evidence=[observation(1,'route-a',true)];
    expect(evaluate(evidence,{perceivedFailure:true})).toEqual(evaluate(evidence));
    expect(evaluate([],{perceivedFailure:true}).goal).toEqual(goal);
  });
  it('preserves missing, expired and known-unavailable distinctions without reviving old readings',()=>{
    const missing=evaluate([]),closed=evaluate([observation(1,'route-a',false)]);
    const expired=evaluate([observation(1,'route-a',true,1,8),observation(2,'route-a',false,2,2)],{at:3});
    expect(missing.availability['route-a']).toEqual({kind:'Unknown',reason:'Missing'});
    expect(closed.availability['route-a']).toEqual({kind:'Known',available:false,receipt:1});
    expect(expired.availability['route-a']).toEqual({kind:'Unknown',reason:'Expired'});
    expect(expired.selectedRoute).toBeNull();expect(expired.goal).toEqual(goal);
  });
  it('retains a usable prior plan and uses authored order only without one',()=>{
    const evidence=[observation(1,'route-a',true),observation(2,'route-b',true)];
    expect(evaluate(evidence,{priorRoute:'route-b'}).selectedRoute).toBe('route-b');
    expect(evaluate(evidence,{priorRoute:null}).selectedRoute).toBe('route-a');
    expect(evaluate(evidence,{goal:null}).selectedRoute).toBeNull();
    expect(evaluate(evidence,{goal:{...goal,status:'Fulfilled'}}).desireActive).toBe(false);
  });
  it('exposes the three named reductions on distinct controls',()=>{
    const input={goal,priorRoute:'route-a' as const,at:2,observations:[observation(1,'route-a',false),observation(2,'route-b',false)],perceivedFailure:true};
    expect(evaluateGoalStrategy(input,'SeparateGoalPlan').goal).toEqual(goal);
    expect(evaluateGoalStrategy(input,'GoalEqualsPlan').goal).toBeNull();
    expect(evaluateGoalStrategy(input,'FixedRoute').selectedRoute).toBe('route-a');
    expect(evaluateGoalStrategy({...input,observations:[observation(1,'route-a',true)]},'FailureAbandonsGoal').goal).toBeNull();
  });
  it('deduplicates visible receipts, is input-order invariant and never aliases input goal',()=>{
    const a=observation(1,'route-a',true),b=observation(2,'route-a',false,2),evidence=[a,b];
    const result=evaluate([a,b,a]);expect(result).toEqual(evaluate([b,a]));
    expect(evidence).toEqual([a,b]);expect(result.goal).not.toBe(goal);
    expect(evaluate([a],{at:8}).selectedRoute).toBe('route-a');
  });
  it('rejects contradictory receipts, future observations and unresolved simultaneous readings',()=>{
    expect(()=>evaluate([observation(1,'route-a',true),observation(1,'route-a',false)])).toThrow('RECEIPT_CONFLICT');
    expect(()=>evaluate([observation(1,'route-a',true,3)])).toThrow('TIME');
    expect(()=>evaluate([observation(1,'route-a',true),observation(2,'route-a',false)])).toThrow('SIMULTANEOUS');
    expect(()=>evaluate([observation(1,'route-a',true,2,1)])).toThrow('TIME');
  });
});
