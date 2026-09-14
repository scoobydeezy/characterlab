import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {applyGraphEdgeLoss as apply} from '../campaign3/graphEdgeLoss';
const z=Q.of(0n),h=Q.of(1n,2n),keys=['a','b','c'],w=[[z,h,z],[h,z,h],[z,h,z]];
const ab={source:'a',target:'b'},ba={source:'b',target:'a'};
describe('explicit directed graph loss component',()=>{
 it('EL-A: node pressure requires coordinated edge loss even with ample edge capacity',()=>{
  for(const loss of [ab,ba,{source:'b',target:'c'},{source:'c',target:'b'}])expect(()=>apply(keys,w,100n,[loss],{nodes:2,edges:10})).toThrow('GRAPH_LOSS_INSUFFICIENT_PLAN');
  expect(apply(keys,w,100n,[ab,ba],{nodes:2,edges:10})).toEqual({keys:['b','c'],weights:[[z,h],[h,z]],usage:{nodes:2,edges:2}});
 });
 it('EL-B: reverse and unrelated weights survive without redistribution',()=>{
  const result=apply(keys,w,100n,[ab],{nodes:3,edges:3});
  expect(result.weights).toEqual([[z,z,z],[h,z,h],[z,h,z]]);expect(result.usage).toEqual({nodes:3,edges:3});
 });
 it('EL-C: satisfying nodes alone does not satisfy edge capacity',()=>{
  expect(()=>apply(keys,w,100n,[],{nodes:3,edges:3})).toThrow('GRAPH_LOSS_INSUFFICIENT_PLAN');
 });
 it('EL-D: either zero resource bound requires actual complete loss',()=>{
  const all=[ab,ba,{source:'b',target:'c'},{source:'c',target:'b'}];
  for(const capacity of [{nodes:0,edges:10},{nodes:3,edges:0}]){
   expect(()=>apply(keys,w,100n,[],capacity)).toThrow('GRAPH_LOSS_INSUFFICIENT_PLAN');
   expect(apply(keys,w,100n,all,capacity)).toEqual({keys:[],weights:[],usage:{nodes:0,edges:0}});
  }
 });
 it('EL-E: duplicate, absent, zero and self edge addresses reject',()=>{
  for(const plan of [[ab,ab],[{source:'x',target:'b'}],[{source:'a',target:'c'}],[{source:'a',target:'a'}]])expect(()=>apply(keys,w,100n,plan,{nodes:3,edges:4})).toThrow();
 });
 it('EL-F: plan order is immaterial and output is detached; failed plans do not mutate input',()=>{
  const before=w.map(row=>[...row]);const result=apply(keys,w,100n,[ab,ba],{nodes:2,edges:2});
  expect(result).toEqual(apply(keys,w,100n,[ba,ab],{nodes:2,edges:2}));expect(w).toEqual(before);
  expect(Object.isFrozen(result.weights[0][1])).toBe(true);expect(result.weights[0][1]).not.toBe(h);
  expect(()=>apply(keys,w,100n,[ab],{nodes:2,edges:4})).toThrow();expect(w).toEqual(before);
 });
 it('EL-G: weights consume equal slots and capacities are bounded exact integers',()=>{
  expect(apply(['a','b'],[[z,Q.of(1n,100n)],[Q.of(4n,5n),z]],100n,[],{nodes:2,edges:2}).usage.edges).toBe(2);
  for(const capacity of [{nodes:-1,edges:2},{nodes:2.5,edges:2},{nodes:33,edges:2},{nodes:2,edges:993}])expect(()=>apply(keys,w,100n,[],capacity)).toThrow('GRAPH_LOSS_CAPACITY');
 });
});
