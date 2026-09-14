import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {composeDirectAssociativeAccess as compose} from '../campaign3/directAssociativeAccess';
import {associationCandidate} from '../campaign3/encodingAccessMath';
const z=Q.of(0n),one=Q.of(1n),half=Q.of(1n,2n);
const survivingRows=(rows:ReturnType<typeof compose>)=>rows.filter(r=>r.episodic).map(({key,directMatch,learnedSpread,contribution,quantized})=>({key,directMatch,learnedSpread,contribution,quantized}));
describe('zero-degree graph lifecycle: bounded equivalence and counterexample',()=>{
 it('OL-A: removing an isolated node preserves retained-target contributions even when directly cued',()=>{
  const cue=new Map([['a',half],['c',one]]);
  const before=compose(['a','c'],['a','b','c'],[[z,half,z],[half,z,z],[z,z,z]],cue,half,1000n);
  const after=compose(['a','c'],['a','b'],[[z,half],[half,z]],cue,half,1000n);
  expect(survivingRows(before)).toEqual(survivingRows(after));
 });
 it('OL-B: graph-only isolated node creates no target and no influence on surviving targets',()=>{
  expect(survivingRows(compose(['a'],['a','b'],[[z,z],[z,z]],new Map([['b',one]]),half,100n))).toEqual(survivingRows(compose(['a'],['a'],[[z]],new Map([['b',one]]),half,100n)));
 });
 it('OL-C: a zero row is not enough: a one-way incident edge still mediates influence',()=>{
  const before=compose(['a'],['a','b'],[[z,one],[z,z]],new Map([['b',one]]),half,100n);
  const after=compose(['a'],['a'],[[z]],new Map([['b',one]]),half,100n);
  expect(before.find(r=>r.key==='a')!.learnedSpread).toEqual(half);expect(after[0].learnedSpread).toEqual(z);
 });
 it('OL-D: reintroducing a zero-state node from new admitted-learning operands matches retaining it',()=>{
  // Both matrices are built explicitly: retained zero c versus an absent c padded
  // into the current learning domain. This is math feasibility, not source admission.
  const retained=[[z,half,z],[half,z,z],[z,z,z]],old=[[z,half],[half,z]],reintroduced=old.map(row=>[...row,z]);reintroduced.push([z,z,z]);
  const p={scale:100n,eta:one,lambda:z,elapsed:one};
  expect(associationCandidate(['a','b','c'],retained,[one,z,one],p)).toEqual(associationCandidate(['a','b','c'],reintroduced,[one,z,one],p));
 });
});
