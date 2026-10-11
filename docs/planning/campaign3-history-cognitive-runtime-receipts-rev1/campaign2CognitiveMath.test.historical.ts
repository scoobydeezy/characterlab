import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {typedIdentifier,text,unsigned as u,signed,list,map,type CanonicalValue} from '../substrate/canonicalEncoding';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {cognitiveRecord as r,cognitiveNamed as named} from '../campaign2/cognitiveCodecs';
import {dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {ZERO,ONE,readQ,qValue,consolidateCoverage,compileReasonNuclei,readDistribution,analyzeOptions,choiceAlignment,foldIdentityHistory,appendIdentityContribution} from '../campaign2/cognitiveMath';
const q=(n:number,d=1)=>Q.of(BigInt(n),BigInt(d)),show=(x:Q)=>`${x.numerator}/${x.denominator}`;
const id=(n:number,p:CanonicalValue)=>typedIdentifier(n,p),referent=(s:string)=>semanticReferentFromAuthoredContent(governedContentDefinitionId(s));
const C=referent('character/bridge-subject'),candidate=(s:string)=>r(395,[C,id(1027,text('definition/'+s))]);
const source=(s:string,role=1)=>r(401,[candidate('protocol-contact-one'),r(371,[C,referent('content/'+s)]),u(role)]);
const basis=(indices:number[])=>r(400,[map(indices.map(n=>[named(399,{VariantTag:u(1),ObservationReference:r(237,[u(1),id(1115,u(n))])}),qValue(ONE)]))]);
const signal=(role:number,strength:Q)=>r(402,[source('task-a',role),qValue(strength),basis([])]);
const definition=(unit=q(1),bands=[q(1,5),q(2,5),q(3,5),q(4,5),ONE])=>r(437,[r(438,bands.map(qValue)),qValue(q(37,100)),r(439,[qValue(unit),u(3)]),r(439,[qValue(unit),u(3)])]);
const contribution=(i:number,e:Q,at=i)=>r(413,[id(1138,u(i)),id(1135,u(i)),signed(at),qValue(e)]);

describe('cognitive pure components; no source or runtime qualification',()=>{
 it('detects collective redundancy that pairwise-max would leave behind',()=>{
  const out=consolidateCoverage([{sourceKey:source('a'),magnitude:q(3),basis:basis([1])},{sourceKey:source('b'),magnitude:q(2),basis:basis([2])},{sourceKey:source('c'),magnitude:ONE,basis:basis([1,2])}]);
  expect(show(out.total)).toBe('5/1');expect(show(readQ(f(rec(out.results[2],405n),5n)))).toBe('0/1');
 });
 it('preserves the larger-aggregate subset residual rather than changing its law',()=>{
  const out=consolidateCoverage([{sourceKey:source('a'),magnitude:q(3),basis:basis([1,2,3])},{sourceKey:source('b'),magnitude:ONE,basis:basis([1,2])}]);expect(show(out.total)).toBe('10/3');
  expect(show(readQ(f(rec(out.results[1],405n),3n)))).toBe('2/3');
 });
 it('orders contributions canonically and rejects duplicate empty-basis causes',()=>{
  const operands=[{sourceKey:source('a'),magnitude:ONE,basis:basis([1])},{sourceKey:source('b'),magnitude:ONE,basis:basis([1])}];
  expect(consolidateCoverage(operands).results.map(key)).toEqual(consolidateCoverage([...operands].reverse()).results.map(key));
  expect(()=>consolidateCoverage([operands[0],{...operands[0],basis:basis([])}])).toThrow('duplicate');
  expect(show(consolidateCoverage([{sourceKey:source('a'),magnitude:ONE,basis:basis([])}]).total)).toBe('1/1');
 });
 it('rescues an active weak base with a d4 floor but never creates a base from context',()=>{
  const active=compileReasonNuclei([signal(1,q(1,10)),signal(2,q(1,2))],definition());expect(active).toHaveLength(1);expect(f(rec(active[0],407n),4n)).toEqual(u(4));
  expect(compileReasonNuclei([signal(2,ONE),signal(3,ONE)],definition())).toEqual([]);
 });
 it('applies Avoid to the whole die-plus-modifier expression',()=>{
  const active=compileReasonNuclei([signal(1,q(-1,10)),signal(3,q(-1,5)),signal(2,ONE)],definition(q(1,10)));
  const n=rec(active[0],407n);expect(f(n,5n)).toEqual(signed(-1));expect(f(n,6n)).toEqual(signed(3));
  expect([...readDistribution(f(n,7n)).keys()].sort((a,b)=>Number(a-b))).toEqual([-6n,-5n,-4n,-3n]);
 });
 it.each([
  [4,[q(1,5),q(2,5),q(3,5),q(4,5),ONE]],
  [6,[q(1,100),q(1,20),q(1,10),q(1,5),q(3,10)]],
  [8,[q(1,100),q(1,50),q(1,20),q(1,10),q(1,5)]],
  [10,[q(1,100),q(1,50),q(3,100),q(1,20),q(1,10)]],
  [12,[q(1,100),q(1,50),q(3,100),q(1,25),q(1,20)]],
 ] as [number,Q[]][])('selects the actual %i-face calibration', (faces,bands)=>{
  const out=compileReasonNuclei([signal(1,q(1,10)),signal(2,q(1,2))],definition(ONE,bands));expect(f(rec(out[0],407n),4n)).toEqual(u(faces));
 });
 it('computes exact joint fair-tie probabilities and the same top-two mass pair',()=>{
  const die=(offset:bigint)=>new Map([1n,2n,3n,4n].map(x=>[x+offset,q(1,4)]));
  const result=analyzeOptions([{key:candidate('one'),distribution:die(2n),reasonMass:q(9,2)},{key:candidate('two'),distribution:die(3n),reasonMass:q(11,2)}],q(1,2),q(1,2));
  expect(result.probabilities.map(p=>show(p.probability))).toEqual(['9/32','23/32']);expect(show(result.contest)).toBe('9/16');expect(show(result.authorshipPotential)).toBe('81/176');expect(result.mode).toBe('QuietRoll');
  const one=analyzeOptions([{key:candidate('one'),distribution:die(0n),reasonMass:q(5,2)}],q(1,2),q(1,2));expect(one.mode).toBe('Auto');expect(show(one.authorshipPotential)).toBe('0/1');
 });
 it('gives equal alternatives no identity meaning regardless of selected token',()=>{
  const a=candidate('one'),b=candidate('two'),meaning=new Map([[key(a),q(1,3)],[key(b),q(1,3)]]);
  expect(choiceAlignment(a,meaning).equals(ZERO)).toBe(true);expect(choiceAlignment(b,meaning).equals(ZERO)).toBe(true);
 });
 it('keeps per-application tie parity and retains zero-increment contributions',()=>{
  const tiny=[contribution(1,q(1,2000000)),contribution(2,q(1,2000000))],fold=foldIdentityHistory(tiny,q(1,10));expect(show(fold.support)).toBe('0/1');expect(fold.operations).toHaveLength(4);
  const odd=foldIdentityHistory([contribution(1,q(1,1000000)),contribution(2,q(1,2000000))],q(1,10));expect(show(odd.support)).toBe('1/500000');
  const mixed=foldIdentityHistory([contribution(1,q(1,2)),contribution(2,q(-1,4))],q(1,10));expect(show(mixed.strength)).toBe('5/17');
 });
 it('orders duplicate, chronology and65th-entry failures without clipping history',()=>{
  const prior=Array.from({length:64},(_,i)=>contribution(i+1,q(1,1000)));
  expect(()=>appendIdentityContribution(prior,prior[63],q(1,10))).toThrow('repeated identity source');
  expect(()=>appendIdentityContribution(prior,contribution(65,q(1,1000),64),q(1,10))).toThrow('time order');
  expect(()=>appendIdentityContribution(prior,contribution(65,q(1,1000)),q(1,10))).toThrow('exceeds64');
  expect(prior).toHaveLength(64);
 });
});
