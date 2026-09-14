import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {associationCandidate} from '../campaign3/encodingAccessMath';
import {normalizeGraphZeroState as normalize} from '../campaign3/graphZeroState';
import {composeDirectAssociativeAccess as compose} from '../campaign3/directAssociativeAccess';
const z=Q.of(0n),one=Q.of(1n),half=Q.of(1n,2n);
// Inspection witnesses only: no victim selection or accepted scarcity policy.
const count=(w:readonly (readonly Q[])[])=>w.reduce((n,row)=>n+row.filter(v=>v.numerator!==0n).length,0);
describe('independent graph scarcity decision witnesses',()=>{
 it('GS-A: lawful symmetric coactivation can produce asymmetric directed weights',()=>{
  const learned=associationCandidate(['a','b','c'],[[z,z,z],[z,z,z],[z,z,z]],[one,half,Q.of(1n,4n)],{scale:100n,eta:Q.of(2n),lambda:z,elapsed:z}).values;
  expect(learned).toEqual([[z,Q.of(67n,100n),Q.of(33n,100n)],[Q.of(4n,5n),z,Q.of(1n,5n)],[half,Q.of(1n,4n),z]]);
  expect(count(learned)).toBe(6);
 });
 it('GS-B: equal node use has distinct edge use; equal edge use has distinct node use',()=>{
  const cycle=normalize(['a','b','c'],[[z,half,z],[z,z,half],[half,z,z]],100n);
  const dense=normalize(['a','b','c'],[[z,half,half],[half,z,half],[half,half,z]],100n);
  expect(cycle.keys.length).toBe(dense.keys.length);expect(count(cycle.weights)).toBe(3);expect(count(dense.weights)).toBe(6);
  const pair=normalize(['a','b'],[[z,half],[half,z]],100n);
  const disjoint=normalize(['a','b','c','d'],[[z,half,z,z],[z,z,z,z],[z,z,z,half],[z,z,z,z]],100n);
  expect(count(pair.weights)).toBe(count(disjoint.weights));expect(pair.keys.length).toBe(2);expect(disjoint.keys.length).toBe(4);
 });
 it('GS-C: one directed-edge loss preserves other incident influence that whole-node loss removes',()=>{
  // Explicit alternatives, not an implementation of either retention rule.
  const edgeLoss=normalize(['a','b','c'],[[z,z,z],[half,z,half],[z,half,z]],100n);
  const nodeLoss=normalize(['a','c'],[[z,z],[z,z]],100n);
  const cue=new Map([['b',one]]);
  const edge=compose(['c'],edgeLoss.keys,edgeLoss.weights,cue,half,10000n).find(r=>r.key==='c')!;
  const node=compose(['c'],nodeLoss.keys,nodeLoss.weights,cue,half,10000n)[0];
  expect(edge.learnedSpread).toEqual(Q.of(4n,15n));expect(node.learnedSpread).toEqual(z);
  expect(edgeLoss.keys).toEqual(['a','b','c']);expect(count(edgeLoss.weights)).toBe(3);
 });
});
