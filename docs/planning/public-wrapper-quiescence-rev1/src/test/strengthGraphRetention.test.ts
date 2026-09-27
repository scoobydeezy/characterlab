import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {retainGraphByStrength as retain} from '../campaign3/strengthGraphRetention';
import {associationCandidate} from '../campaign3/encodingAccessMath';
const z=Q.of(0n),q=(n:number)=>Q.of(BigInt(n),100n);
describe('strength-priority graph retention baseline',()=>{
 it('SR-A: exact weaker directed edge loses, cost remains one each',()=>{
  const result=retain(['a','b'],[[z,q(80)],[q(1),z]],100n,{nodes:2,edges:1});
  expect(result.losses).toEqual([{source:'b',target:'a'}]);expect(result.weights).toEqual([[z,q(80)],[z,z]]);expect(result.usage).toEqual({nodes:2,edges:1});
 });
 it('SR-B: node pressure removes a full ordered prefix, not the easiest node',()=>{
  const result=retain(['a','b','c','d'],[[z,q(10),q(12),z],[q(11),z,z,z],[q(13),z,z,q(50)],[z,z,z,z]],100n,{nodes:3,edges:10});
  expect(result.losses).toEqual([{source:'a',target:'b'},{source:'b',target:'a'}]);expect(result.usage).toEqual({nodes:3,edges:3});
  // One stronger c→d removal would free d immediately; the policy must not choose it.
 });
 it('SR-C: canonical address ties are independent of input matrix order',()=>{
  const first=retain(['a','b'],[[z,q(50)],[q(50),z]],100n,{nodes:2,edges:1});
  const reverse=retain(['b','a'],[[z,q(50)],[q(50),z]],100n,{nodes:2,edges:1});
  expect(first.losses).toEqual([{source:'a',target:'b'}]);expect(reverse.losses).toEqual(first.losses);
 });
 it('SR-D: zero bounds cause real complete loss; sufficient bounds cause none',()=>{
  for(const cap of [{nodes:0,edges:2},{nodes:2,edges:0}])expect(retain(['a','b'],[[z,q(80)],[q(1),z]],100n,cap).usage).toEqual({nodes:0,edges:0});
  expect(retain(['a','b'],[[z,q(80)],[q(1),z]],100n,{nodes:2,edges:2}).losses).toEqual([]);
  expect(retain(['a'],[[z]],100n,{nodes:0,edges:0}).losses).toEqual([]);
 });
 it('SR-E: supplied resolved weakening reverses the victim without history input',()=>{
  const graph=(ab:number)=>[[z,q(ab),z,z],[z,z,z,z],[z,z,z,q(40)],[z,z,z,z]];
  expect(retain(['a','b','c','d'],graph(60),100n,{nodes:4,edges:1}).losses).toEqual([{source:'c',target:'d'}]);
  expect(retain(['a','b','c','d'],graph(30),100n,{nodes:4,edges:1}).losses).toEqual([{source:'a',target:'b'}]);
  // Supplied graph boundary only: selective weakening producer is not implemented.
 });
 it('SR-F: actual EAM learning can create an edge that immediately loses without grace',()=>{
  const learned=associationCandidate(['a','b','c'],[[z,q(80),z],[z,z,z],[z,z,z]],[z,Q.of(1n),Q.of(1n)],{scale:100n,eta:q(5),lambda:z,elapsed:z}).values;
  expect(retain(['a','b','c'],learned,100n,{nodes:3,edges:1}).losses).toEqual([{source:'b',target:'c'},{source:'c',target:'b'}]);
 });
 it('SR-G: weakest representable bridge gets no topology protection and survivors stay exact',()=>{
  const w=[[z,Q.of(1n,100000n),z,z],[z,z,z,z],[z,z,z,q(90)],[z,z,z,z]];
  const result=retain(['a','b','c','d'],w,100000n,{nodes:4,edges:1});
  expect(result.losses).toEqual([{source:'a',target:'b'}]);expect(result.weights).toEqual([[z,q(90)],[z,z]]);expect(w[0][1]).toEqual(Q.of(1n,100000n));expect(Object.isFrozen(result.losses)).toBe(true);
 });
});
