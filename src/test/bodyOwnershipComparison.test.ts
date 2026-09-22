import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {createStoredBody,createPressureCache,sensedPressure,motiveProbe} from '../campaign3/bodyOwnershipComparison';
const q=(n:number,d=1)=>Q.of(BigInt(n),BigInt(d));
describe('body-ownership-comparison/0.1-candidate component controls',()=>{
 it('retains hidden41/49 alias through the sensor, detects direct-meter urgency',()=>{
  const a=createStoredBody(q(42),q(1)).sample(1n,q(20),true),b=createStoredBody(q(50),q(1)).sample(1n,q(20),true);
  expect(a.level).not.toEqual(b.level);expect(a.mediated).toEqual(b.mediated);expect(a.independent).not.toEqual(b.independent);
  expect(a.mediated).toEqual({kind:'Known',value:q(0)});expect(a.independent.value).toEqual(q(19,60));expect(b.independent.value).toEqual(q(11,60));
 });
 it('changes resolution without changing stored truth',()=>{
  const meter=createStoredBody(q(42),q(1)),a=meter.sample(1n,q(20),true),b=meter.sample(1n,q(10),true);
  expect(a.level).toEqual(b.level);expect(b.mediated).toEqual({kind:'Known',value:q(1,6)});expect(a.mediated).not.toEqual(b.mediated);
 });
 it('separates unknown and known neutral and does not preserve stale cache',()=>{
  const cache=createPressureCache();expect(motiveProbe(cache.query())).toEqual({kind:'NoGround'});
  cache.accept(1n,{kind:'Known',value:q(0)});expect(motiveProbe(cache.query())).toEqual({kind:'BodyGround',magnitude:q(0)});
  cache.accept(2n,{kind:'Known',value:q(1,2)});cache.accept(3n,{kind:'Unavailable'});expect(cache.query()).toEqual({kind:'Unavailable'});
 });
 it('holds initial state fixed and changes only kinetic rate',()=>{
  const a=createStoredBody(q(80),q(1)),b=createStoredBody(q(80),q(1,2));expect(a.snapshot()).toEqual(b.snapshot());
  expect(a.sample(31n,q(10),true).mediated).not.toEqual(b.sample(31n,q(10),true).mediated);
 });
 it('delivers after the current sample, preserves depletion and cancels old debt',()=>{
  const m=createStoredBody(q(2),q(1));expect(m.sample(3n,q(10),true).level).toEqual(q(0));expect(m.deliver(3n,q(30)).after).toEqual(q(30));expect(m.sample(4n,q(10),true).level).toEqual(q(29));
 });
 it('preserves applied/overflow and saturated equivalence',()=>{
  const a=createStoredBody(q(95),q(0)),b=createStoredBody(q(95),q(0));const x=a.deliver(1n,q(5)),y=b.deliver(1n,q(9));
  expect(x.after).toEqual(y.after);expect(y.applied).toEqual(q(5));expect(y.overflow).toEqual(q(4));expect(a.sample(2n,q(10),true)).toEqual(b.sample(2n,q(10),true));
 });
 it('does not read truth for unavailable output; direct urgency exposes its bad boundary',()=>{
  const x=createStoredBody(q(42),q(1)).sample(1n,q(20),false);expect(x.mediated).toEqual({kind:'Unavailable'});expect(x.independent.kind).toBe('Known');expect(sensedPressure(q(41),q(10),false)).toEqual({kind:'Unavailable'});
 });
 it('is query-partition invariant even under exact half-unit rates',()=>{
  const a=createStoredBody(q(80),q(1,2)),b=createStoredBody(q(80),q(1,2));a.sample(1n,q(10),true);a.sample(2n,q(10),true);expect(a.sample(3n,q(10),true)).toEqual(b.sample(3n,q(10),true));expect(a.snapshot()).toEqual(b.snapshot());
 });
 it('replays component snapshots and next transitions for every finite prefix',()=>{
  type M=ReturnType<typeof createStoredBody>;type C=ReturnType<typeof createPressureCache>;
  const ops:((m:M,c:C)=>void)[]=[(m,c)=>c.accept(1n,m.sample(1n,q(10),true).mediated),(m,c)=>c.accept(31n,m.sample(31n,q(10),true).mediated),m=>{m.deliver(31n,q(30));},(m,c)=>c.accept(41n,m.sample(41n,q(10),true).mediated),(m,c)=>c.accept(61n,m.sample(61n,q(10),false).mediated)];
  const m=createStoredBody(q(80),q(1)),c=createPressureCache(),snap=()=>({meter:m.snapshot(),cache:c.snapshot()}),states=[snap()];for(const op of ops){op(m,c);states.push(snap());}
  for(let i=0;i<states.length;i++){const rm=createStoredBody(q(80),q(1)),rc=createPressureCache();for(const op of ops.slice(0,i))op(rm,rc);expect({meter:rm.snapshot(),cache:rc.snapshot()}).toEqual(states[i]);if(i<ops.length){ops[i](rm,rc);expect({meter:rm.snapshot(),cache:rc.snapshot()}).toEqual(states[i+1]);}}
 });
 it('rejects invalid transitions without changing component state',()=>{
  const m=createStoredBody(q(80),q(1));m.sample(3n,q(10),true);const before=m.snapshot();expect(()=>m.deliver(2n,q(30))).toThrow();expect(()=>m.deliver(4n,q(-1))).toThrow();expect(m.snapshot()).toEqual(before);
  const c=createPressureCache();c.accept(1n,{kind:'Known',value:q(1,2)});const old=c.snapshot();expect(()=>c.accept(1n,{kind:'Unavailable'})).toThrow();expect(()=>c.accept(2n,{kind:'Known',value:q(2)})).toThrow();expect(c.snapshot()).toEqual(old);expect(()=>createStoredBody(q(101),q(1))).toThrow();
 });
});
