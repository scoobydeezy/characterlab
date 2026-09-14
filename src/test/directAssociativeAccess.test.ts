import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {composeDirectAssociativeAccess as compose} from '../campaign3/directAssociativeAccess';
import {rankAccessibleEpisodes} from '../campaign3/encodingAccessMath';
const z=Q.of(0n),one=Q.of(1n),half=Q.of(1n,2n);
describe('direct/learned access reference composition',()=>{
 it('DA-A: adding/removing an isolated graph node leaves direct contribution exactly equal',()=>{
  const cue=new Map([['a',one]]),absent=compose(['a'],[],[],cue,half,100n)[0],present=compose(['a'],['a'],[[z]],cue,half,100n)[0];
  expect(absent.directMatch).toEqual(present.directMatch);expect(absent.contribution).toEqual(present.contribution);expect(present.quantized).toEqual(one);expect(present.learnedSpread).toEqual(z);
 });
 it('DA-B: zero-hop is counted once; beta zero removes learned influence even with edges',()=>{
  const rows=compose(['a','b'],['a','b'],[[z,half],[half,z]],new Map([['a',one]]),z,100n);
  expect(rows.map(r=>r.contribution)).toEqual([one,z]);expect(rows.map(r=>r.learnedSpread)).toEqual([z,z]);
 });
 it('DA-C: graph-only cue mediates retrieval of actual episodes without creating its own target',()=>{
  const rows=compose(['a'],['a','b'],[[z,half],[half,z]],new Map([['b',one]]),half,1000n),a=rows.find(r=>r.key==='a')!,b=rows.find(r=>r.key==='b')!;
  expect(a.directMatch).toEqual(z);expect(a.learnedSpread).toEqual(Q.of(4n,15n));expect(b.episodic).toBe(false);expect(b.directMatch).toEqual(z);
  const result=rankAccessibleEpisodes([{key:'survivor',retainedKeys:['a'],presentations:[0n]}],new Map(rows.map(r=>[r.key,r.quantized])),1n,{lambda:one,exponent:1,omegaB:z,omegaA:one,k:2});
  expect(result.selected.map(r=>r.key)).toEqual(['survivor']);expect(result.selected[0].score.compare(z)).toBeGreaterThan(0);
 });
 it('DA-D: exact components combine before one rounding, not separately rounded parts',()=>{
  const a=compose(['a'],['a','b'],[[z,one],[z,z]],new Map([['a',Q.of(1n,4n)],['b',half]]),half,2n).find(r=>r.key==='a')!;
  expect(a.directMatch).toEqual(Q.of(1n,4n));expect(a.learnedSpread).toEqual(Q.of(1n,4n));expect(a.quantized).toEqual(half);
 });
 it('DA-E: exact subtraction avoids negative spread from rounding a cue downward',()=>{
  const a=compose(['a'],['a'],[[z]],new Map([['a',Q.of(1n,5n)]]),half,2n)[0];
  expect(a.learnedSpread).toEqual(z);expect(a.contribution).toEqual(Q.of(1n,5n));expect(a.quantized).toEqual(z);
 });
 it('DA-F: neither-membership cue creates no row; inputs and graph remain unchanged',()=>{
  const retained=['a'],graph:string[]=[],weights:Q[][]=[],cue=new Map([['neither',one]]);
  expect(compose(retained,graph,weights,cue,half,100n)[0].contribution).toEqual(z);expect(graph).toEqual([]);expect(weights).toEqual([]);expect([...cue.keys()]).toEqual(['neither']);
  expect(compose([],[],[],cue,half,100n)).toEqual([]);
 });
 it('DA-G: invalid cues, duplicate keys, inconsistent matrix and union overflow reject',()=>{
  expect(()=>compose(['a'],[],[],new Map([['a',Q.of(-1n)]]),half,100n)).toThrow();
  expect(()=>compose(['a','a'],[],[],new Map(),half,100n)).toThrow();
  expect(()=>compose([],['a'],[],new Map(),half,100n)).toThrow();
  expect(()=>compose(Array.from({length:32},(_,i)=>'e'+i),['g'],[[z]],new Map(),half,100n)).toThrow('key set');
 });
 it('DA-H: graph/input permutation preserves canonical output; returned operands are immutable',()=>{
  const cue=new Map([['b',one]]),a=compose(['a','b'],['a','b'],[[z,half],[half,z]],cue,half,100n);
  const b=compose(['b','a'],['b','a'],[[z,half],[half,z]],cue,half,100n);expect(a).toEqual(b);
  expect(Object.isFrozen(a)).toBe(true);expect(Object.isFrozen(a[0].quantized)).toBe(true);
 });
});
