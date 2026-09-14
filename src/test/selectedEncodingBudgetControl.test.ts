import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {EventRoleId as R,type EventRoleId} from '../semanticBinding/eventBindings';
import {prepareAttentionPool,selectAttention,selectUnlimitedAttentionControl,selectedReferences} from '../campaign3/attentionSelection';
import {encodeSelectedBudgetControl as encode,type SelectedBudgetCalibration} from '../campaign3/selectedEncodingBudgetControl';
import {attentionFixture} from './attentionFixtures';
const view=(roles:readonly (readonly EventRoleId[])[],unlimited=true)=>{const f=attentionFixture(roles),p=prepareAttentionPool(f.experience,f.claims);return (unlimited?selectUnlimitedAttentionControl:selectAttention)(p,1).view;};
describe('selected-encoding/0.2-candidate',()=>{
 it('SBC-A: all eight exact two/three-Actor comparisons include active shared normalization',()=>{
  for(const budget of ['UnitBudget','SmallBudget'] as const)for(const law of ['independent','historical-shared','historical-hybrid','retired-flat'] as const)for(const n of [2,3]){
   const result=encode(view(Array.from({length:n},()=>[R.Actor])),law,'role-calibrated',budget);
   const expected=law==='retired-flat'?Q.of(1n):law==='historical-shared'?(budget==='UnitBudget'?Q.of(3n,10n):Q.of(1n,BigInt(n))):Q.of(3n,13n);
   expect(result.rows.map(r=>r.strength)).toEqual(Array.from({length:n},()=>expected));
  }
 });
 it('SBC-B: important hybrid rows stay independent while low footprint shares a zero remainder floor',()=>{
  for(const n of [1,2]){
   const result=encode(view([[R.Actor],...Array.from({length:n},()=>[R.Participant])]),'historical-hybrid','role-calibrated','SmallBudget');
   expect(result.rows[0].strength).toEqual(Q.of(3n,13n));expect(result.rows.slice(1).map(r=>r.strength)).toEqual(Array.from({length:n},()=>Q.of(1n,BigInt(n))));
  }
 });
 it('SBC-C: budget interventions do not change selected evidence or raw factors',()=>{
  const a=encode(view([[R.Actor],[R.Actor]]),'historical-shared','role-calibrated','UnitBudget'),b=encode(view([[R.Actor],[R.Actor]]),'historical-shared','role-calibrated','SmallBudget');
  expect(a.evidence).toEqual(b.evidence);expect(a.rows.map(({strength,...r})=>r)).toEqual(b.rows.map(({strength,...r})=>r));
 });
 it('SBC-D: invalid budget cannot leave a reusable selected capability',()=>{
  const v=view([[R.Actor]]);expect(()=>encode(v,'independent','role-calibrated','invalid' as SelectedBudgetCalibration)).toThrow();expect(()=>selectedReferences(v)).toThrow();
 });
 it('SBC-E: unselected footprint remains absent from both budget denominators',()=>{
  for(const budget of ['UnitBudget','SmallBudget'] as const){
   const a=encode(view([[R.Actor]],false),'historical-shared','role-calibrated',budget),b=encode(view([[R.Actor],[R.Participant],[R.Participant]],false),'historical-shared','role-calibrated',budget);
   expect(b).toEqual(a);
  }
 });
});
