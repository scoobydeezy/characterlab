import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {EventRoleId as R} from '../semanticBinding/eventBindings';
import {prepareAttentionPool,selectUnlimitedAttentionControl} from '../campaign3/attentionSelection';
import {encodeSelectedBudgetControl} from '../campaign3/selectedEncodingBudgetControl';
import {associationCandidate,spreadingActivation,rankAccessibleEpisodes,type EncodingBudget} from '../campaign3/encodingAccessMath';
import {attentionFixture} from './attentionFixtures';
function formation(n:number,law:EncodingBudget){
 const f=attentionFixture(Array.from({length:n},()=>[R.Actor])),v=selectUnlimitedAttentionControl(prepareAttentionPool(f.experience,f.claims),2).view;
 const encoding=encodeSelectedBudgetControl(v,law,'role-calibrated','SmallBudget'),labels=encoding.rows.map(r=>r.continuantKey);
 const graph=associationCandidate(labels,labels.map(()=>labels.map(()=>Q.of(0n))),encoding.rows.map(r=>r.strength),{scale:100n,eta:Q.of(1n),lambda:Q.of(0n),elapsed:Q.of(0n)});
 return {encoding,labels,graph};
}
describe('actual selected encoding to association/access component composition',()=>{
 it('EAC-A: focal strength and association footprint are separately quantified',()=>{
  const cases:[EncodingBudget,Q,Q,Q,Q][]=[['independent',Q.of(3n,13n),Q.of(3n,13n),Q.of(5n,100n),Q.of(5n,100n)],['historical-shared',Q.of(1n,2n),Q.of(1n,3n),Q.of(25n,100n),Q.of(11n,100n)],['historical-hybrid',Q.of(3n,13n),Q.of(3n,13n),Q.of(5n,100n),Q.of(5n,100n)],['retired-flat',Q.of(1n),Q.of(1n),Q.of(1n),Q.of(1n,2n)]];
  for(const [law,z2,z3,w2,w3] of cases){const a=formation(2,law),b=formation(3,law);expect(a.labels).toEqual(b.labels.slice(0,2));expect([a.encoding.rows[0].strength,b.encoding.rows[0].strength,a.graph.values[0][1],b.graph.values[0][1]]).toEqual([z2,z3,w2,w3]);}
 });
 it('EAC-B: flat strength and association overflow remain different mechanisms',()=>{
  expect([formation(2,'retired-flat').graph.rows[0].overflow,formation(3,'retired-flat').graph.rows[0].overflow]).toEqual([false,true]);
  expect([formation(2,'independent').graph.rows[0].overflow,formation(3,'independent').graph.rows[0].overflow]).toEqual([false,false]);
 });
 it('EAC-C: exact propagated cue contrasts with the local beta0 comparator',()=>{
  for(const n of [2,3]){const f=formation(n,'retired-flat'),base=f.labels.map((_,i)=>Q.of(i===0?1n:0n));
   expect(spreadingActivation(f.labels,f.graph.values,base,Q.of(1n,2n),100n).quantized).toEqual(n===2?[Q.of(133n,100n),Q.of(67n,100n)]:[Q.of(6n,5n),Q.of(2n,5n),Q.of(2n,5n)]);
   expect(spreadingActivation(f.labels,f.graph.values,base,Q.of(0n),100n).quantized).toEqual(base);
  }
 });
 it('EAC-D: hypothetical presentation affects accessibility without mutating its input history',()=>{
  const f=formation(2,'independent'),episodes=[{key:'component-episode',retainedKeys:f.labels,presentations:[0n]}],before=structuredClone(episodes),activation=new Map(f.labels.map(k=>[k,Q.of(0n)])),p={lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:Q.of(1n),k:1};
  const first=rankAccessibleEpisodes(episodes,activation,10n,p);expect(first.scored[0].base).toEqual(Q.of(1n,11n));
  const later=rankAccessibleEpisodes([{...episodes[0],presentations:[0n,10n]}],activation,10n,p);expect(later.scored[0].base.subtract(first.scored[0].base)).toEqual(Q.of(1n));expect(episodes).toEqual(before);
 });
});
