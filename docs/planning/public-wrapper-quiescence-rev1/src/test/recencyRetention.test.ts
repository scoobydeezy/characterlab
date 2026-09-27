import {describe,it,expect} from 'vitest';
import {retainByRecency as retain,type TimedAcquisition} from '../campaign3/recencyRetention';
const a=(id:bigint,at:bigint,keys=['alpha','beta'],kind:TimedAcquisition['kind']='Interoceptive'):TimedAcquisition=>({id,acquiredAt:at,kind,units:keys.map(key=>({key,views:[new Uint8Array([1,2]),new Uint8Array([9,8])]}))});
const cap={EventContinuant:2,Interoceptive:2};
describe('Recency Retention Baseline component',()=>{
 it('RR-A: original acquisition time wins, not ordinal magnitude or input order',()=>{
  const old=a(999n,1n,['old']),fresh=a(1n,2n,['new']);const result=retain([old,fresh],3n,{...cap,Interoceptive:1});
  expect(result.acquisitions).toEqual([fresh]);expect(result.losses).toEqual([{acquisition:999n,unit:'old'}]);
 });
 it('RR-B: same-time canonical address ties preserve one whole group deterministically',()=>{
  const original=a(1n,1n,['b','a']);const result=retain([original],2n,{...cap,Interoceptive:1});
  expect(result.acquisitions).toEqual([{...original,units:[original.units[1]]}]);expect(result.losses).toEqual([{acquisition:1n,unit:'b'}]);
  expect(result.acquisitions[0].units[0].views).toHaveLength(2);
 });
 it('RR-C: partial survival never refreshes original age at later barriers',()=>{
  const first=retain([a(1n,1n)],50n,{...cap,Interoceptive:1});expect(first.acquisitions[0].acquiredAt).toBe(1n);
  const second=retain([...first.acquisitions,a(2n,2n,['new'])],80n,{...cap,Interoceptive:1});expect(second.acquisitions.map(x=>x.id)).toEqual([2n]);
 });
 it('RR-D: zero capacity is loss, with no borrowed slots or effect on the other kind',()=>{
  const visual=a(2n,1n,['v'],'EventContinuant');const result=retain([a(1n,1n),visual],2n,{EventContinuant:99,Interoceptive:0});
  expect(result.acquisitions).toEqual([visual]);expect(result.usage).toEqual({EventContinuant:1,Interoceptive:0});expect(result.losses).toHaveLength(2);
 });
 it('RR-E: complete barrier permutations produce identical survivors and loss addresses',()=>{
  const x=a(2n,3n,['c','b']),y=a(1n,3n,['z']),old=a(9n,1n,['old']);
  const result=retain([old,x,y],3n,cap);expect(retain([y,{...x,units:[...x.units].reverse()},old],3n,cap)).toEqual(result);
  expect(result.acquisitions.flatMap(x=>x.units)).toHaveLength(2);
 });
 it('RR-F: future, missing, negative time and invalid capacity reject',()=>{
  for(const at of [-1n,3n,undefined])expect(()=>retain([a(1n,at as bigint)],2n,cap)).toThrow('acquisition time');
  expect(()=>retain([a(1n,1n)],-1n,cap)).toThrow('instant');expect(()=>retain([a(1n,1n)],2n,{...cap,Interoceptive:1.5})).toThrow('capacity');
 });
 it('RR-G: survivor bytes are detached and no removed-content archive is returned',()=>{
  const original=a(1n,1n);const result=retain([original],1n,{...cap,Interoceptive:1});
  expect(Object.keys(result)).toEqual(['acquisitions','usage','losses']);expect(Object.keys(result.losses[0]).sort()).toEqual(['acquisition','unit']);
  result.acquisitions[0].units[0].views[0][0]=77;expect(original.units[0].views[0][0]).toBe(1);
 });
 it('RR-H: changing evaluation time alone does not change survival or retained original timestamps',()=>{
  const input=[a(1n,1n),a(2n,2n,['new'])];expect(retain(input,2n,cap)).toEqual(retain(input,999n,cap));
 });
});
