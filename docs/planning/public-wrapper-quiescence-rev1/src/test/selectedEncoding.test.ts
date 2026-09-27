import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {canonicalEncode} from '../substrate/canonicalEncoding';
import {perceivedBindingEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {EventRoleId as R} from '../semanticBinding/eventBindings';
import {prepareAttentionPool,selectAttention,selectUnlimitedAttentionControl,selectedReferences,type SelectedView} from '../campaign3/attentionSelection';
import {encodeSelectedEvidence as encode} from '../campaign3/selectedEncoding';
import type {EncodingBudget} from '../campaign3/encodingAccessMath';
import {attentionFixture} from './attentionFixtures';
const make=(fixture=attentionFixture(),capacity=2,unlimited=false)=>{
 const pool=prepareAttentionPool(fixture.experience,fixture.claims);
 return (unlimited?selectUnlimitedAttentionControl:selectAttention)(pool,capacity).view;
};
describe('selected-encoding/0.1-candidate',()=>{
 it('SEC-A: actual selected claims drive exact factors and original bytes',()=>{
  const fixture=attentionFixture(),result=encode(make(fixture),'independent','role-calibrated');
  expect(result.rows.map(r=>r.raw)).toEqual([Q.of(3n,10n),Q.of(243n,1000n)]);
  expect(result.rows.map(r=>r.strength)).toEqual([Q.of(3n,13n),Q.of(243n,1243n)]);
  expect(result.evidence[0].bytes).toEqual(canonicalEncode(perceivedBindingEvidenceValue(fixture.experience.perceivedBindings[0])));
  expect(result.need).toBe('Disabled');expect(result.surprise).toBe('Disabled');
 });
 it('SEC-B: adding unselected footprint cannot affect selected encoding',()=>{
  for(const law of ['independent','historical-shared','historical-hybrid','retired-flat'] as const){
   const a=encode(make(attentionFixture([[R.Actor],[R.Target]]),1),law,'role-calibrated');
   const b=encode(make(attentionFixture(),1),law,'role-calibrated');expect(b).toEqual(a);
  }
 });
 it('SEC-C: selected footprint differences are recorded without conflating budget laws',()=>{
  const run=(roles:typeof R.Actor[][]|undefined,law:EncodingBudget)=>encode(make(roles?attentionFixture(roles):attentionFixture(),2,true),law,'role-calibrated');
  // Three actors deliberately cross the hybrid important threshold; shared uses its exact denominator floor.
  const sparse=attentionFixture([[R.Actor],[R.Actor]]),dense=attentionFixture([[R.Actor],[R.Actor],[R.Actor]]);
  for(const fixture of [sparse,dense]){
   const result=encode(make(fixture,2,true),'independent','role-calibrated');expect(result.rows.every(r=>r.strength.compare(Q.of(3n,13n))===0)).toBe(true);
  }
  expect(run(undefined,'historical-shared').rows[0].strength).toEqual(Q.of(3n,10n));
  expect(run(undefined,'historical-hybrid').rows[0].strength).toEqual(Q.of(3n,13n));
  expect(run(undefined,'retired-flat').rows.every(r=>r.strength.compare(Q.of(1n))===0)).toBe(true);
 });
 it('SEC-D: disabling continuous attention preserves causal-role evidence and changes target strength',()=>{
  const a=encode(make(),'independent','role-calibrated'),b=encode(make(),'independent','disabled-attention');
  expect(b.evidence).toEqual(a.evidence);expect(b.rows[1].role).toEqual(a.rows[1].role);
  expect(b.rows[1].raw).toEqual(Q.of(27n,100n));expect(b.rows[1].strength).toEqual(Q.of(27n,127n));
 });
 it('SEC-E: forged, consumed and failed-law attempts cannot reuse a live view',()=>{
  expect(()=>encode({kind:'SelectedView'} as SelectedView,'independent','role-calibrated')).toThrow();
  const a=make();encode(a,'independent','role-calibrated');expect(()=>encode(a,'independent','role-calibrated')).toThrow();
  const b=make();expect(()=>encode(b,'other' as EncodingBudget,'role-calibrated')).toThrow();expect(()=>selectedReferences(b)).toThrow();
 });
 it('SEC-F: empty selection invents no observer, experience, owner or episode',()=>{
  const result=encode(make(undefined,0),'independent','role-calibrated');expect(result.rows).toEqual([]);expect(result.evidence).toEqual([]);
  for(const name of ['observerId','characterId','experienceId','episodeId','truthHandle'])expect(result).not.toHaveProperty(name);
 });
 it('SEC-G: mutations of returned evidence cannot rewrite source or another consumption',()=>{
  const fixture=attentionFixture(),before=structuredClone(fixture),a=encode(make(fixture),'independent','role-calibrated');
  a.evidence[0].bytes.fill(0);expect(fixture).toEqual(before);
  expect(encode(make(fixture),'independent','role-calibrated').evidence[0].bytes).not.toEqual(a.evidence[0].bytes);
 });
 it('SEC-H: each row cites one actual selected claim with its existing binding provenance',()=>{
  const result=encode(make(),'independent','role-calibrated');expect(result.evidence.map(e=>e.ref.kind)).toEqual(['perceived-binding','causal-role','perceived-binding','causal-role']);
  for(const row of result.rows)expect(result.evidence.some(e=>JSON.stringify(e.ref,(_,v)=>typeof v==='bigint'?v.toString():v)===JSON.stringify(row.claimRef,(_,v)=>typeof v==='bigint'?v.toString():v))).toBe(true);
  expect(result.rows.map(r=>r.roleId)).toEqual(['causal-role/actor','causal-role/target']);
 });
});
