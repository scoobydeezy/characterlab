/** goal-strategy-component/0.1-candidate: trusted operands, no public state authority. */
export const GOAL_STRATEGY_VERSION = 'goal-strategy-component/0.1-candidate';
export type Route = 'route-a' | 'route-b';
export type Goal = Readonly<{ id: 'goal/delivery'; desired: 'item-at-destination'; status: 'Active' | 'Fulfilled' }>;
export type RouteObservation = Readonly<{ receipt: number; goal: 'goal/delivery'; route: Route; available: boolean; observedAt: number; validUntil: number }>;
export type Candidate = 'SeparateGoalPlan' | 'GoalEqualsPlan' | 'FixedRoute' | 'FailureAbandonsGoal';
export type Availability = { kind: 'Known'; available: boolean; receipt: number } | { kind: 'Unknown'; reason: 'Missing' | 'Expired' };
const routes: readonly Route[] = ['route-a', 'route-b'];
const bounded = (n: number) => { if (!Number.isInteger(n) || n < 1 || n > 8) throw Error('GOAL_COMPONENT_BOUND'); };
const routeValid = (r: Route) => { if (!routes.includes(r)) throw Error('GOAL_COMPONENT_ROUTE'); };
export function evaluateGoalStrategy(input: Readonly<{
  goal: Goal | null; priorRoute: Route | null; at: number;
  observations: readonly RouteObservation[]; perceivedFailure: boolean;
}>, candidate: Candidate = 'SeparateGoalPlan') {
  if (!['SeparateGoalPlan','GoalEqualsPlan','FixedRoute','FailureAbandonsGoal'].includes(candidate)) throw Error('GOAL_COMPONENT_CANDIDATE');
  bounded(input.at);
  if (input.priorRoute !== null) routeValid(input.priorRoute);
  if (typeof input.perceivedFailure !== 'boolean') throw Error('GOAL_COMPONENT_FAILURE');
  if (input.goal && (input.goal.id !== 'goal/delivery' || input.goal.desired !== 'item-at-destination' || !['Active','Fulfilled'].includes(input.goal.status))) throw Error('GOAL_COMPONENT_GOAL');
  if (input.observations.length > 8) throw Error('GOAL_COMPONENT_OBSERVATIONS');
  const receipts = new Map<number, string>(), readings = new Map<string, number>();
  const latest = new Map<Route, RouteObservation>();
  for (const o of input.observations) {
    bounded(o.receipt); bounded(o.observedAt); bounded(o.validUntil); routeValid(o.route);
    if (o.goal !== 'goal/delivery' || typeof o.available !== 'boolean') throw Error('GOAL_COMPONENT_OBSERVATION');
    if (o.observedAt > input.at || o.validUntil < o.observedAt) throw Error('GOAL_COMPONENT_TIME');
    const content = JSON.stringify([o.goal,o.route,o.available,o.observedAt,o.validUntil]);
    if (receipts.has(o.receipt)) {
      if (receipts.get(o.receipt) !== content) throw Error('GOAL_COMPONENT_RECEIPT_CONFLICT');
      continue;
    }
    const reading = `${o.route}/${o.observedAt}`;
    if (readings.has(reading)) throw Error('GOAL_COMPONENT_SIMULTANEOUS_READING');
    receipts.set(o.receipt,content); readings.set(reading,o.receipt);
    if (!latest.has(o.route) || latest.get(o.route)!.observedAt < o.observedAt) latest.set(o.route,o);
  }
  const availability = Object.fromEntries(routes.map(route => {
    const o = latest.get(route);
    const value: Availability = !o ? {kind:'Unknown',reason:'Missing'} : o.validUntil < input.at
      ? {kind:'Unknown',reason:'Expired'} : {kind:'Known',available:o.available,receipt:o.receipt};
    return [route,value];
  })) as Record<Route, Availability>;
  let goal = input.goal ? {...input.goal} : null;
  let selected: Route | null = null;
  if (goal?.status === 'Active') {
    const usable = (route: Route) => { const v=availability[route]; return v.kind==='Known' && v.available; };
    selected = input.priorRoute && usable(input.priorRoute) ? input.priorRoute : routes.find(usable) ?? null;
    if (candidate === 'FixedRoute') selected = 'route-a';
    if (candidate === 'GoalEqualsPlan' && selected === null || candidate === 'FailureAbandonsGoal' && input.perceivedFailure) {
      goal = null; selected = null;
    }
  }
  return {goal,desireActive:goal?.status==='Active',selectedRoute:selected,availability};
}
