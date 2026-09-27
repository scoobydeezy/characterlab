/** body-ownership-comparison/0.1-candidate. Research components, not public
 * character-state owners. Truth-side meter and evidence-only cache are separate. */
import {ExactRational as Q} from '../substrate/exactMath';
import {deficitPressure,reserveBin} from './embodiedMath';
export type BodyPressure=Readonly<{kind:'Known';value:Q}>|Readonly<{kind:'Unavailable'}>;
const zero=Q.of(0n),one=Q.of(1n),hundred=Q.of(100n),threshold=Q.of(60n);
const bound=(q:Q)=>q.compare(zero)<0?zero:q.compare(one)>0?one:q;
export function sensedPressure(level:Q,width:Q,available:boolean):BodyPressure {
 return available?Object.freeze({kind:'Known',value:deficitPressure(reserveBin(level,hundred,width).upper,threshold)}):Object.freeze({kind:'Unavailable'});
}
export function motiveProbe(pressure:BodyPressure){
 return pressure.kind==='Known'?Object.freeze({kind:'BodyGround' as const,magnitude:pressure.value}):Object.freeze({kind:'NoGround' as const});
}
/** CTL-001 normalized passive level and bounded effects; every selected value is
 * on the historical lattice. No interoception or character knowledge in this owner. */
export function createStoredBody(initial:Q,rate:Q){
 if(initial.compare(zero)<0||initial.compare(hundred)>0||rate.compare(zero)<0)throw Error('meter domain');
 let level=initial.divide(hundred),at=0n;
 function advance(time:bigint){if(time<at)throw Error('meter time order');level=bound(level.subtract(rate.divide(hundred).multiply(Q.of(time-at))));at=time;}
 return Object.freeze({
  sample(time:bigint,width:Q,available:boolean){advance(time);return {level:level.multiply(hundred),mediated:sensedPressure(level.multiply(hundred),width,available),independent:Object.freeze({kind:'Known' as const,value:deficitPressure(level,Q.of(3n,5n))})};},
  deliver(time:bigint,amount:Q){if(amount.compare(zero)<0)throw Error('negative delivery');advance(time);const before=level,after=bound(level.add(amount.divide(hundred))),applied=after.subtract(before).multiply(hundred);level=after;return {before:before.multiply(hundred),after:after.multiply(hundred),applied,overflow:amount.subtract(applied)};},
  snapshot:()=>Object.freeze({at,level}),
 });
}
/** Sole writer consumes current admitted pressure; no source/truth handle accepted.
 * Unavailable overwrites rather than silently manufacturing known zero/stale data. */
export function createPressureCache(){
 let pressure:BodyPressure=Object.freeze({kind:'Unavailable'}),at=-1n;
 return Object.freeze({
  accept(time:bigint,current:BodyPressure){if(time<=at)throw Error('cache time order');if(current.kind==='Known'&&(current.value.compare(zero)<0||current.value.compare(one)>0))throw Error('pressure domain');pressure=current.kind==='Known'?Object.freeze({kind:'Known',value:Q.of(current.value.numerator,current.value.denominator)}):Object.freeze({kind:'Unavailable'});at=time;},
  query:()=>pressure,
  snapshot:()=>Object.freeze({at,pressure}),
 });
}
