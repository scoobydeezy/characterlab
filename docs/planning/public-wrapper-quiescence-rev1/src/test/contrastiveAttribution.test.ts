import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {assessContrastiveAttribution as assess,type AttributionTrial} from '../campaign3/contrastiveAttribution';
const range=(a:number,b:number)=>({lower:Q.of(BigInt(a)),upper:Q.of(BigInt(b))});
const trial=(stroke:boolean,after=[30,31],before=[20,21]):AttributionTrial=>({motion:[[0,0],[stroke?1:0,0]],before:range(...before as [number,number]),after:range(...after as [number,number])});
const valid=()=>[trial(true),trial(false,[20,21]),trial(true),trial(false,[20,21])];
describe('contrastive-attribution-component/0.1-candidate',()=>{
 it('CA-A: replicated separated observed changes support the fallible hypothesis',()=>expect(assess(valid())).toEqual({kind:'Supported'}));
 it('CA-B: removing motion support with identical level evidence removes eligibility',()=>{
  const rows=valid();expect(assess(rows.map(t=>({...t,motion:[[0,0],[0,0]]})))).toEqual({kind:'Unavailable'});
 });
 it('CA-C: coarse overlapping evidence does not become an exact effect',()=>expect(assess([trial(true,[30,40],[20,30]),trial(false,[20,30],[20,30]),trial(true,[30,40],[20,30]),trial(false,[20,30],[20,30])])).toEqual({kind:'Unavailable'}));
 it('CA-D: endpoint equality is insufficient, an exact strict gap suffices',()=>{
  const rows=[trial(true,[22,23]),trial(false,[20,21]),trial(true,[22,23]),trial(false,[20,21])];
  expect(assess(rows)).toEqual({kind:'Unavailable'});expect(assess(rows.map((t,i)=>i%2===0?{...t,after:range(23,24)}:t))).toEqual({kind:'Supported'});
 });
 it('CA-E: malformed inputs reject rather than become absence evidence',()=>{
  expect(()=>assess(Array(4))).toThrow();expect(()=>assess(valid().slice(1))).toThrow();
  for(const bad of [{...valid()[0],after:range(5,4)},{...valid()[0],before:range(-1,2)},{...valid()[0],after:range(99,101)},{...valid()[0],motion:[[0,0],[8,0]]},{...valid()[0],motion:[Array(2),[1,0]]}])expect(()=>assess([bad as AttributionTrial,...valid().slice(1)])).toThrow();
 });
 it('CA-F: permutations and caller attempts to mutate result do not change later assessments',()=>{
  const rows=valid(),result=assess(rows);expect(assess([...rows].reverse())).toEqual(result);expect(Object.isFrozen(result)).toBe(true);
  expect(()=>Object.assign(result,{kind:'Unavailable'})).toThrow();expect(assess(rows)).toEqual({kind:'Supported'});
 });
 it('CA-G: missing, other-motion and baseline-mismatch inputs yield unavailable',()=>{
  for(const patch of [{before:null},{after:null},{motion:null},{motion:[[0,0],[2,0]]},{before:range(21,22)}])expect(assess([{...valid()[0],...patch} as AttributionTrial,...valid().slice(1)])).toEqual({kind:'Unavailable'});
  expect(assess([trial(true),trial(true),trial(true),trial(false,[20,21])])).toEqual({kind:'Unavailable'});
 });
 it('CA-H: the component cannot distinguish true and confounded causal histories with identical operands',()=>{
  // A hidden driver delivers the same changes in the confounded history. Truth is
  // intentionally not part of the function signature; no public producer is proved.
  const caused={hiddenCause:'motion',observed:valid()},confounded={hiddenCause:'independent delivery',observed:valid()};
  expect(caused.hiddenCause).not.toBe(confounded.hiddenCause);expect(assess(caused.observed)).toEqual(assess(confounded.observed));expect(assess(confounded.observed).kind).toBe('Supported');
 });
 it('CA-I: a contrast without guaranteed positive movement-associated increase gives no support',()=>{
  expect(assess([trial(true,[20,21]),trial(false,[10,11]),trial(true,[20,21]),trial(false,[10,11])])).toEqual({kind:'Unavailable'});
 });
});
