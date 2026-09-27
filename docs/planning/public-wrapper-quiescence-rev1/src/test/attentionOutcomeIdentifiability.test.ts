import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {deficitPressure,replenishReserve,reserveBin} from '../campaign3/embodiedMath';

// Actual accepted EMB operators, evaluated as components. No future consequence
// sensor, evidence capability or episode attribution is implemented by this test.
const q=(n:number)=>Q.of(BigInt(n));
const show=(v:Q)=>`${v.numerator}/${v.denominator}`;
function witness(before:number,delivery:number){
 const r=replenishReserve(q(before),q(100),q(delivery));
 const pre=reserveBin(r.before,q(100),q(10)),post=reserveBin(r.after,q(100),q(10));
 return {safe:[pre.lower,pre.upper,post.lower,post.upper].map(show),
  pressure:[deficitPressure(pre.upper,q(60)),deficitPressure(post.upper,q(60))].map(show),
  applied:show(r.applied),potential:show(r.potential),overflow:show(r.overflow)};
}
describe('attention outcome source: non-identifiability under accepted body operators',()=>{
 it('OI-A: identical permitted bins and pressure conceal different applied effects',()=>{
  const a=witness(20,10),b=witness(29,1);
  expect(a.safe).toEqual(['20/1','30/1','30/1','40/1']);expect(b.safe).toEqual(a.safe);
  expect(a.pressure).toEqual(['1/2','1/3']);expect(b.pressure).toEqual(a.pressure);
  expect(a.applied).toBe('10/1');expect(b.applied).toBe('1/1');
 });
 it('OI-B: capacity censoring does not reveal potential or overflow',()=>{
  const a=witness(95,10),b=witness(95,100);
  expect(a.safe).toEqual(b.safe);expect(a.pressure).toEqual(b.pressure);expect(a.applied).toBe(b.applied);
  expect(a.potential).not.toBe(b.potential);expect(a.overflow).not.toBe(b.overflow);
 });
 it('OI-C: equal pressure is not evidence of zero applied effect',()=>{
  const a=witness(70,0),b=witness(70,5);
  expect(a.safe).toEqual(b.safe);expect(a.pressure).toEqual(['0/1','0/1']);expect(b.pressure).toEqual(a.pressure);
  expect(a.applied).toBe('0/1');expect(b.applied).toBe('5/1');
 });
});
