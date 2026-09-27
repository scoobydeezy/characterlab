/** Pure exact operators under numeric/embodied-reserve-exact/0.1-candidate. */
import {ExactRational as Q,floorDiv} from '../substrate/exactMath';
import {rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import {SchedulerContractError} from '../substrate/scheduler';
const zero=Q.of(0n);
export function exact(value:CanonicalValue):Q {if(typeof value==='boolean'||value.kind!=='rational')throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','rational operand required');return Q.of(value.numerator,value.denominator);}
export const atom=(value:Q)=>rational(value.numerator,value.denominator);
export function materializeReserve(amount:Q,anchor:bigint,capacity:Q,rate:Q,time:bigint):Q {
 simInstant(anchor);simInstant(time);
 if(time<anchor)throw new SchedulerContractError('EMBODIED_TIME_ORDER_VIOLATION','cannot materialize before anchor');
 if(capacity.compare(zero)<=0||amount.compare(zero)<0||amount.compare(capacity)>0||rate.compare(zero)<0)throw new SchedulerContractError('STATE_VALIDATION_FAILURE','invalid reserve operands');
 const remaining=amount.subtract(rate.multiply(Q.of(time-anchor)));return remaining.compare(zero)<0?zero:remaining;
}
export function reserveBin(level:Q,capacity:Q,width:Q){
 if(width.compare(zero)<=0||capacity.compare(zero)<=0||level.compare(zero)<0||level.compare(capacity)>0)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','invalid bin operands');
 const count=capacity.divide(width);if(count.denominator!==1n)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','nonintegral bin count');
 const ratio=level.divide(width),index=level.equals(capacity)?count.numerator-1n:floorDiv(ratio.numerator,ratio.denominator);
 return {index,lower:width.multiply(Q.of(index)),upper:width.multiply(Q.of(index+1n))};
}
export function deficitPressure(upper:Q,threshold:Q):Q {
 if(upper.compare(zero)<0||threshold.compare(zero)<=0)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','invalid pressure operands');
 const deficit=threshold.subtract(upper);return deficit.compare(zero)<=0?zero:deficit.divide(threshold);
}
export function replenishReserve(before:Q,capacity:Q,delivered:Q){
 if(before.compare(zero)<0||before.compare(capacity)>0||capacity.compare(zero)<=0||delivered.compare(zero)<0)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','invalid refill operands');
 const space=capacity.subtract(before),applied=delivered.compare(space)>0?space:delivered;
 return {before,potential:delivered,applied,overflow:delivered.subtract(applied),after:before.add(applied)};
}
