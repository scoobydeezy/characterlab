import {describe,it,expect} from 'vitest';
import {canonicalEncode,typedIdentifier,text,unsigned,signed,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {embodiedRecord as r} from '../campaign3/embodiedCodecs';
import {selectInteroceptiveSamples as select,consumeInteroceptiveSelection as consume,closeInteroceptiveSelection as close,type InteroceptiveSelectedView} from '../campaign3/interoceptiveSelection';
import {attentionFixture} from './attentionFixtures';
import {prepareAttentionPool,selectAttention,closeSelectedView} from '../campaign3/attentionSelection';
const id=(ns:number,s:string)=>typedIdentifier(ns,text(s));
function sample(channel='a',occ=1,present=true,observer='observer/fixture',at=1,version='embodied-level-observation/0.1-candidate'){
 const base=[typedIdentifier(1115,unsigned(occ)),id(1000,observer),id(1005,'channel/'+channel),signed(at)];
 return present?r(461,[...base,r(462,[rational(90,1),rational(100,1)]),text(version)]):r(463,[...base,text(version)]);
}
const batch=()=>[sample('a',1),sample('b',2),sample('c',3)];
const bytes=(values:readonly CanonicalValue[])=>values.map(canonicalEncode);
describe('interoceptive-selection-component/0.1-candidate',()=>{
 it('IB-A: 0/1/2 capacity genuinely bounds three eligible samples',()=>{for(const k of [0,1,2]){const result=select(batch(),k);expect(consume(result.view)).toHaveLength(k);expect(result.audit.filter(a=>a.disposition==='Capacity')).toHaveLength(3-k);}expect(consume(select([],2).view)).toEqual([]);});
 it('IB-B: within-body competitors displace a previously selected operand',()=>{const target=sample('c',3);expect(bytes(consume(select([target],2).view))).toEqual(bytes([target]));expect(bytes(consume(select(batch(),2).view))).toEqual(bytes(batch().slice(0,2)));});
 it('IB-C: selected values preserve canonical bytes and ignore enumeration order',()=>{const a=select(batch(),2),b=select(batch().reverse(),2);expect(a.audit).toEqual(b.audit);expect(bytes(consume(a.view))).toEqual(bytes(consume(b.view)));});
 it('IB-D: an absent sample is ineligible; a present high-level/zero-pressure range is not absence',()=>{const result=select([sample('a',1,false),sample('b',2)],1);expect(result.audit.map(a=>a.disposition)).toEqual(['Unavailable','Selected']);expect(bytes(consume(result.view))).toEqual(bytes([sample('b',2)]));});
 it('IB-E: malformed batches, identities and versions reject',()=>{
  for(const k of [-1,3,0.5,NaN])expect(()=>select(batch(),k)).toThrow();
  const cases=[Array(2),[...batch(),sample('d',4)],[sample(),sample('a',2)],[sample(),sample('b',1)],[sample(),sample('b',2,true,'observer/other')],[sample(),sample('b',2,true,'observer/fixture',2)],[sample('a',1,true,'observer/fixture',1,'wrong')],[r(462,[rational(1,1),rational(2,1)])]];
  for(const c of cases)expect(()=>select(c,2)).toThrow();
 });
 it('IB-F: only detached selected bytes survive and views are opaque and single use',()=>{
  const source=sample(),result=select([source],1),expected=canonicalEncode(source);
  if(typeof source!=='boolean'&&source.kind==='record')(source.fields as Map<bigint,CanonicalValue>).clear();
  expect(()=>consume({...result.view})).toThrow();expect(()=>consume({kind:'InteroceptiveSelectedView'} as InteroceptiveSelectedView)).toThrow();
  expect(bytes(consume(result.view))).toEqual([expected]);expect(()=>consume(result.view)).toThrow();
  const discarded=select(batch(),2).view;close(discarded);expect(()=>consume(discarded)).toThrow();
  const first=consume(select(batch(),2).view);if(typeof first[0]!=='boolean'&&first[0].kind==='record')(first[0].fields as Map<bigint,CanonicalValue>).clear();expect(bytes(consume(select(batch(),2).view))).toEqual(bytes(batch().slice(0,2)));
 });
 it('IB-G: actual visual competitor variation leaves fixed body component inputs unchanged',()=>{
  const before=bytes(consume(select(batch(),2).view));
  for(const fixture of [attentionFixture([]),attentionFixture()]){const visual=selectAttention(prepareAttentionPool(fixture.experience,fixture.claims),2);closeSelectedView(visual.view);expect(bytes(consume(select(batch(),2).view))).toEqual(before);}
 });
});

