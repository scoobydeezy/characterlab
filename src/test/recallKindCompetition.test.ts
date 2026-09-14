import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {rankAccessibleEpisodes as rank} from '../campaign3/encodingAccessMath';
const q=(n:number)=>Q.of(BigInt(n),10n);
const p={lambda:q(0),exponent:1,omegaB:q(0),omegaA:q(10),k:1};
const event={key:'event-acquisition',retainedKeys:['event-key'],presentations:[]};
const body=[{key:'body-a',retainedKeys:['signal-a'],presentations:[]},{key:'body-b',retainedKeys:['signal-b'],presentations:[]}];
const cue=(scale:number)=>new Map([['event-key',q(6)],['signal-a',q(4*scale)],['signal-b',q(2*scale)]]);
describe('retrieval resource decision: supplied operand comparison only',()=>{
 it('RK-A: within-kind order preservation does not imply shared-budget outcome invariance',()=>{
  expect(rank(body,cue(1),0n,p).selected[0].key).toBe('body-a');expect(rank(body,cue(2),0n,p).selected[0].key).toBe('body-a');
  expect(rank([event,...body],cue(1),0n,p).selected[0].key).toBe('event-acquisition');expect(rank([event,...body],cue(2),0n,p).selected[0].key).toBe('body-a');
 });
 it('RK-B: separate candidate partitions prevent direct displacement; shared k does not',()=>{
  expect(rank([event],cue(2),0n,p).selected[0].key).toBe('event-acquisition');expect(rank([...body],cue(2),0n,p).selected[0].key).toBe('body-a');expect(rank([event,...body],cue(2),0n,p).selected.map(e=>e.key)).not.toContain('event-acquisition');
 });
});
