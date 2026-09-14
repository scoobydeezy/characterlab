import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {canonicalEncode} from '../substrate/canonicalEncoding';
import {createLocalReserveSource as create,observeLocalReserves as observe,replenishLocalReserve as replenish,inspectLocalReserves as inspect,type LocalReserveDefinition,type LocalReserveChannel} from '../campaign3/localReserveSource';
const q=(n:number)=>Q.of(BigInt(n));
const defs=():LocalReserveDefinition[]=>['A','B','C'].map((x,i)=>({key:'local-reserve/'+x,capacity:q(100),rate:q(i),amount:q(50),anchoredAt:0n}));
const channels=():LocalReserveChannel[]=>['A','B','C'].map(x=>({physical:'local-reserve/'+x,signal:'interoceptive-signal/'+x,channel:'channel/'+x,width:q(10),available:true,permitted:true}));
const bytes=(s:ReturnType<typeof create>,k:string)=>canonicalEncode(inspect(s).get('local-reserve/'+k)!);
describe('local-reserve-source-component/0.1-candidate',()=>{
 it('LR-A: B-only replenishment preserves A/C and the original source byte-for-byte',()=>{
  const s=create(defs(),channels()),prior=[bytes(s,'A'),bytes(s,'B'),bytes(s,'C')],next=replenish(s,'local-reserve/B',2n,q(10));
  expect(bytes(next,'A')).toEqual(prior[0]);expect(bytes(next,'C')).toEqual(prior[2]);expect(bytes(next,'B')).not.toEqual(prior[1]);expect([bytes(s,'A'),bytes(s,'B'),bytes(s,'C')]).toEqual(prior);
 });
 it('LR-B: only C kinetics change in the comparison model',()=>{
  const base=defs(),a=create(base,channels()),b=create(base.map(d=>d.key.endsWith('/C')?{...d,rate:q(10)}:d),channels());
  expect(bytes(a,'A')).toEqual(bytes(b,'A'));expect(bytes(a,'B')).toEqual(bytes(b,'B'));expect(observe(a,2n).slice(0,2)).toEqual(observe(b,2n).slice(0,2));expect(observe(a,2n)[2]).not.toEqual(observe(b,2n)[2]);
 });
 it('LR-C: hidden-within-bin changes and physical-key renaming leave safe outputs identical',()=>{
  const base=defs().map(d=>({...d,amount:q(51),rate:q(0)})),a=create(base,channels()),b=create(base.map(d=>d.key.endsWith('/A')?{...d,amount:q(59)}:d),channels());
  expect(observe(a,1n)).toEqual(observe(b,1n));
  const renamed=create(base.map(d=>({...d,key:d.key+'-renamed'})),channels().map(c=>({...c,physical:c.physical+'-renamed'})));
  expect(observe(renamed,1n)).toEqual(observe(a,1n));expect(observe(a,1n).map(v=>v.signal)).toEqual(['interoceptive-signal/A','interoceptive-signal/B','interoceptive-signal/C']);
 });
 it('LR-D: extra view is one declared signal; unavailability and denial reveal the same payload',()=>{
  const cs=channels(),a=create(defs(),[...cs,{...cs[0],channel:'channel/A-fine',width:q(1)}]);expect(observe(a,1n).filter(v=>v.signal==='interoceptive-signal/A')).toHaveLength(2);
  const denied=create(defs(),cs.map(c=>({...c,permitted:false}))),missing=create(defs(),cs.map(c=>({...c,available:false})));expect(observe(denied,1n)).toEqual(observe(missing,1n));expect(observe(denied,1n).every(v=>!('lower' in v)&&!('physical' in v))).toBe(true);
 });
 it('LR-E: model inputs and returned zero-containing values cannot mutate source or borrowed constants',()=>{
  const ds=defs(),cs=channels(),s=create(ds,cs),before=bytes(s,'A');Object.assign(ds[0].amount,{numerator:0n});Object.assign(cs[0],{permitted:false});expect(bytes(s,'A')).toEqual(before);expect(observe(s,0n)[0].kind).toBe('Present');
  const empty=create(defs().map(d=>({...d,amount:q(0)})),channels()),v=observe(empty,1n)[0];if(v.kind!=='Present')throw Error('fixture');expect(()=>Object.assign(v.lower,{numerator:99n})).toThrow();expect(observe(empty,1n)[0]).toEqual(v);
 });
 it('LR-F: aliased mapping, duplicate state, unknown target and invalid time fail',()=>{
  expect(()=>create(defs(),channels().map(c=>({...c,physical:'local-reserve/A'})))).toThrow();expect(()=>create([defs()[0],defs()[0],defs()[2]],channels())).toThrow();expect(()=>replenish(create(defs(),channels()),'local-reserve/Z',1n,q(1))).toThrow();expect(()=>observe(create(defs(),channels()),-1n)).toThrow();
 });
 it('LR-G: observation never reanchors; zero delivery does reanchor only its target',()=>{
  const s=create(defs(),channels()),before=bytes(s,'B');observe(s,5n);expect(bytes(s,'B')).toEqual(before);
  const next=replenish(s,'local-reserve/B',5n,q(0));expect(bytes(next,'B')).not.toEqual(before);expect(observe(next,5n)).toEqual(observe(s,5n));
 });
 it('LR-H: inventory order has no physical or safe identity meaning; invalid source domains reject',()=>{
  const a=create(defs(),channels()),b=create(defs().reverse(),channels().reverse());expect(observe(a,2n)).toEqual(observe(b,2n));for(const k of ['A','B','C'])expect(bytes(a,k)).toEqual(bytes(b,k));
  for(const bad of [defs().slice(1),Array(3),defs().map((d,i)=>i===0?{...d,capacity:q(0)}:d),defs().map((d,i)=>i===0?{...d,rate:q(-1)}:d),defs().map((d,i)=>i===0?{...d,amount:q(101)}:d)])expect(()=>create(bad,channels())).toThrow();
  for(const bad of [[...channels(),channels()[0]],channels().map((c,i)=>i===0?{...c,width:q(3)}:c),channels().map((c,i)=>i===0?{...c,physical:'local-reserve/Z'}:c)])expect(()=>create(defs(),bad)).toThrow();
 });
});
