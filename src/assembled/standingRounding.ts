/** assembled-character-standing-rounding/0.1-candidate; no state or RNG ownership. */
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,absolute} from '../campaign2/cognitiveMath';
import {invalidModel} from '../campaign2/canonicalData';
export const STANDING_ROUNDING_VERSION='assembled-character-standing-rounding/0.1-candidate';
export const ROUNDING_SPAN=1n<<32n;
export function standingPlan(value:Q,unit:Q,cap:bigint){
 if(unit.compare(ZERO)<=0||cap<0n||cap>3n)invalidModel('standing rounding calibration');
 const scaled=value.divide(unit),sign=scaled.compare(ZERO)<0?-1n:1n;
 const magnitude=absolute(scaled).compare(Q.of(cap))>0?Q.of(cap):absolute(scaled);
 const whole=magnitude.numerator/magnitude.denominator,rest=magnitude.subtract(Q.of(whole)).multiply(Q.of(ROUNDING_SPAN));
 const threshold=rest.numerator/rest.denominator,base=sign*whole,upper=threshold?sign*(whole+1n):base;
 return {base,upper,threshold};
}
export function standingSample(base:bigint,upper:bigint,threshold:bigint,word?:bigint){
 if(threshold<0n||threshold>=ROUNDING_SPAN||base< -3n||base>3n||upper< -3n||upper>3n||
   (threshold===0n?upper!==base:!(upper===base+1n&&base>=0n||upper===base-1n&&base<=0n)))
  invalidModel('standing rounding plan');
 if(threshold===0n){if(word!==undefined)invalidModel('unexpected standing draw');return base;}
 if(word===undefined||word<0n||word>=ROUNDING_SPAN)invalidModel('standing draw range');
 return word!<threshold?upper:base;
}
export function standingDistribution(die:bigint,direction:bigint,x:bigint,c:bigint,plan:ReturnType<typeof standingPlan>){
 standingSample(plan.base,plan.upper,plan.threshold,plan.threshold?plan.threshold:undefined);
 const p=Q.of(plan.threshold,ROUNDING_SPAN),out=new Map<bigint,Q>();
 for(const [h,mass] of [[plan.base,ONE.subtract(p)],[plan.upper,p]] as const){
  if(mass.equals(ZERO))continue;
  for(let face=1n;face<=die;face++){const score=direction*(face+h+x+c);out.set(score,(out.get(score)??ZERO).add(mass.divide(Q.of(die))));}
 }
 return out;
}
