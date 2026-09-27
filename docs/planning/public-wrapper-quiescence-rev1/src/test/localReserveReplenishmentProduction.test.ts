import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {createLocalReserveSource,inspectLocalReserves,observeLocalReserves,replenishLocalReserve,replenishLocalReserveWithResult} from '../campaign3/localReserveSource';
const q=(n:number)=>Q.of(BigInt(n));
const source=()=>createLocalReserveSource(['a','b','c'].map(k=>({key:'local-reserve/'+k,capacity:q(100),rate:q(1),amount:q(80),anchoredAt:0n})),['a','b','c'].map(k=>({channel:'channel/'+k,physical:'local-reserve/'+k,signal:'interoceptive-signal/'+k,width:q(1),available:true,permitted:true})));
it('LRP-A: result distinguishes stored prior anchor from materialized before; exact overflow and sibling preservation',()=>{
 const old=source(),before=inspectLocalReserves(old),x=replenishLocalReserveWithResult(old,'local-reserve/a',10n,q(40));
 expect(x.result).toEqual({target:'local-reserve/a',at:10n,prior:{amount:q(80),anchoredAt:0n},next:{amount:q(100),anchoredAt:10n},numeric:{before:q(70),potential:q(40),applied:q(30),overflow:q(10),after:q(100)}});
 expect(inspectLocalReserves(old)).toEqual(before);for(const key of ['local-reserve/b','local-reserve/c'])expect(inspectLocalReserves(x.source).get(key)).toEqual(before.get(key));
 expect(inspectLocalReserves(replenishLocalReserve(old,'local-reserve/a',10n,q(40)))).toEqual(inspectLocalReserves(x.source));
});
it('LRP-B: zero delivery produces a real reanchor and result; public safe sample shape stays narrow',()=>{
 const x=replenishLocalReserveWithResult(source(),'local-reserve/a',10n,q(0));expect(x.result.next).toEqual({amount:q(70),anchoredAt:10n});expect(x.result.numeric.applied).toEqual(q(0));
 const before=inspectLocalReserves(x.source);x.result.next.amount=q(0);expect(inspectLocalReserves(x.source)).toEqual(before);
 const sample=observeLocalReserves(x.source,11n)[0];expect(Object.keys(sample).sort()).toEqual(['channel','kind','lower','signal','upper']);
});
it('LRP-C: rejected target, time and negative delivery do not change the admitted source',()=>{
 const old=source(),before=inspectLocalReserves(old);expect(()=>replenishLocalReserveWithResult(old,'local-reserve/missing',1n,q(1))).toThrow();expect(()=>replenishLocalReserveWithResult(old,'local-reserve/a',-1n,q(1))).toThrow();expect(()=>replenishLocalReserveWithResult(old,'local-reserve/a',1n,q(-1))).toThrow();expect(inspectLocalReserves(old)).toEqual(before);
});
