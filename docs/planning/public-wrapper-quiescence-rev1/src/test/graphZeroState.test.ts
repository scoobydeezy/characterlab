import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {normalizeGraphZeroState as normalize} from '../campaign3/graphZeroState';
import {composeDirectAssociativeAccess as compose} from '../campaign3/directAssociativeAccess';
const z=Q.of(0n),one=Q.of(1n),half=Q.of(1n,2n);
describe('zero-state graph normalization component',()=>{
 it('GZ-A: either edge direction preserves membership; isolated node alone is removed',()=>{
  expect(normalize(['a','b','c'],[[z,half,z],[z,z,z],[z,z,z]],100n)).toEqual({keys:['a','b'],weights:[[z,half],[z,z]]});
  expect(normalize(['a','b'],[[z,z],[half,z]],100n).keys).toEqual(['a','b']);
 });
 it('GZ-B: smallest representable positive edge survives without epsilon or mass redistribution',()=>{
  const tiny=Q.of(1n,100000n);expect(normalize(['a','b','c'],[[z,tiny,z],[z,z,z],[z,z,z]],100000n).weights).toEqual([[z,tiny],[z,z]]);
 });
 it('GZ-C: empty and all-zero graphs normalize to empty without a new identity/history surface',()=>{
  expect(normalize([],[],100n)).toEqual({keys:[],weights:[]});expect(normalize(['a'],[[z]],100n)).toEqual({keys:[],weights:[]});
 });
 it('GZ-D: normalization is idempotent and does not mutate input',()=>{
  const keys=['a','b','c'],w=[[z,half,z],[half,z,z],[z,z,z]],first=normalize(keys,w,100n);
  expect(normalize(first.keys,first.weights,100n)).toEqual(first);expect(keys).toEqual(['a','b','c']);expect(w).toHaveLength(3);expect(Object.isFrozen(first.weights[0][1])).toBe(true);
 });
 it('GZ-E: removing an isolated node preserves direct episodic cueing',()=>{
  const original=compose(['a'],['a'],[[z]],new Map([['a',one]]),half,100n)[0],graph=normalize(['a'],[[z]],100n);
  const next=compose(['a'],graph.keys,graph.weights,new Map([['a',one]]),half,100n)[0];expect(next.directMatch).toEqual(original.directMatch);expect(next.contribution).toEqual(original.contribution);
 });
 it('GZ-F: a later same-batch edge must be resolved before normalization',()=>{
  expect(normalize(['a','b','c'],[[z,z,z],[z,z,z],[z,z,z]],100n).keys).toEqual([]);
  expect(normalize(['a','b','c'],[[z,z,z],[z,z,half],[z,z,z]],100n).keys).toEqual(['b','c']);
 });
 it('GZ-G: off-lattice, negative and nonzero diagonal weights reject',()=>{
  for(const w of [[[z,Q.of(1n,3n)],[z,z]],[[z,Q.of(-1n)],[z,z]],[[one,z],[z,z]]])expect(()=>normalize(['a','b'],w,100n)).toThrow();
 });
});
