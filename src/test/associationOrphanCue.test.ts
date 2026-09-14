import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {spreadingActivation} from '../campaign3/encodingAccessMath';
import {rankWithIndependentAssociationMembership as rank} from '../campaign3/independentAssociationAccess';
const zero=Q.of(0n),one=Q.of(1n);
const episodes=[{key:'old-cued',retainedKeys:['a'],presentations:[0n]},{key:'recent-other',retainedKeys:['c'],presentations:[1n]}];
const p={lambda:one,exponent:1,omegaB:one,omegaA:one,k:1};
describe('orphan node cue contribution: current component discrimination',()=>{
 it('OC-A: zero-edge node can reverse the winning retrieval target solely through direct cue activation',()=>{
  const activation=spreadingActivation(['a'],[[zero]],[one],Q.of(1n,2n),1000n);
  expect(activation.exact[0].compare(one)).toBe(0);
  expect(rank(episodes,new Map([['a',activation.quantized[0]]]),1n,p).selected[0].key).toBe('old-cued');
  expect(rank(episodes,new Map(),1n,p).selected[0].key).toBe('recent-other');
 });
 it('OC-B: with zero cue, keeping versus removing the isolated node is score-equivalent',()=>{
  expect(rank(episodes,new Map([['a',zero]]),1n,p)).toEqual(rank(episodes,new Map(),1n,p));
 });
});
