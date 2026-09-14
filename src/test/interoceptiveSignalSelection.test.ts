import {describe,it,expect} from 'vitest';
import {canonicalEncode,typedIdentifier,text,unsigned,signed,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {embodiedRecord as r} from '../campaign3/embodiedCodecs';
import {selectInteroceptiveSignals as select,consumeInteroceptiveSignals as consume,closeInteroceptiveSignals as close,type SignalSelectionInput} from '../campaign3/interoceptiveSignalSelection';
const observer=typedIdentifier(1000,text('observer/fixture'));
const channel=(name:string)=>typedIdentifier(1005,text('channel/'+name));
const limits={maxSignals:3,maxViewsPerSignal:3,maxBytesPerSignal:4096,capacity:2};
const sample=(c:string,id:number,lo=20,hi=30,present=true)=>present?r(461,[typedIdentifier(1115,unsigned(id)),observer,channel(c),signed(1),r(462,[rational(lo,1),rational(hi,1)]),text('embodied-level-observation/0.1-candidate')]):r(463,[typedIdentifier(1115,unsigned(id)),observer,channel(c),signed(1),text('embodied-level-observation/0.1-candidate')]);
function input(mapping:readonly [string,string][],samples:CanonicalValue[]=mapping.map(([c],i)=>sample(c,i+1))):SignalSelectionInput{return {opportunityId:17n,observer,at:1n,declarations:mapping.map(([c,signal])=>({channel:channel(c),signal})),samples};}
const bytes=(v:readonly CanonicalValue[])=>v.map(canonicalEncode);
describe('interoceptive-signal-selection-component/0.1-candidate',()=>{
 it('SG-A: extra views of the same signal add evidence but no competing slot',()=>{
  const a=select(input([['a','P']]),limits),b=select(input([['a','P'],['b','P'],['c','P']]),limits);
  expect(a.audit).toEqual([{signal:'P',views:1,disposition:'Selected'}]);expect(b.audit).toEqual([{signal:'P',views:3,disposition:'Selected'}]);
  expect(consume(a.view).groups).toHaveLength(1);expect(consume(b.view).groups[0].samples).toHaveLength(3);
  const paired=select(input([['a','P'],['b','P'],['c','P'],['d','Q']]),limits);
  expect(consume(paired.view).groups.map(g=>g.signal)).toEqual(['P','Q']);
 });
 it('SG-B: declared distinct signals contend even with identical readout values',()=>{
  const result=select(input([['a','P'],['b','Q'],['c','R']]),limits);expect(result.audit.map(x=>x.disposition)).toEqual(['Selected','Selected','Capacity']);expect(consume(result.view).groups.map(g=>g.signal)).toEqual(['P','Q']);
  expect(consume(select(input([['c','R']]),limits).view).groups.map(g=>g.signal)).toEqual(['R']);
 });
 it('SG-C: conflicting and differently resolved readings survive without fusion',()=>{
  const source=[sample('a',1,20,21),sample('b',2,70,80),sample('c',3,25,30)];
  expect(bytes(consume(select(input([['a','P'],['b','P'],['c','P']],source),limits).view).groups[0].samples)).toEqual(bytes(source));
 });
 it('SG-D: identical time and signal never replace the explicit opportunity identity',()=>{
  const a=input([['a','P']]),b={...a,opportunityId:18n};const x=consume(select(a,limits).view),y=consume(select(b,limits).view);
  expect(x.at).toBe(y.at);expect(x.groups).toEqual(y.groups);expect(x.opportunityId).toBe(17n);expect(y.opportunityId).toBe(18n);
 });
 it('SG-E: separate candidate, view, byte and selected-count bounds apply',()=>{
  expect(()=>select(input([['a','P'],['b','Q'],['c','R']]),{...limits,maxSignals:2})).toThrow();
  expect(()=>select(input([['a','P'],['b','P']]),{...limits,maxViewsPerSignal:1})).toThrow();
  const a=input([['a','P']]),length=canonicalEncode(a.samples[0]).length;
  expect(consume(select(a,{...limits,maxBytesPerSignal:length}).view).groups).toHaveLength(1);
  expect(()=>select(a,{...limits,maxBytesPerSignal:length-1})).toThrow();
  expect(consume(select(a,{...limits,capacity:0}).view).groups).toEqual([]);
  for(const bad of [{maxSignals:17},{maxViewsPerSignal:0},{capacity:4},{maxBytesPerSignal:Infinity}])expect(()=>select(a,{...limits,...bad})).toThrow();
 });
 it('SG-F: malformed grouping, identities, time and repeated source observations reject',()=>{
  const a=input([['a','P']]);
  for(const bad of [{...a,opportunityId:-1n},{...a,at:2n},{...a,observer:typedIdentifier(1000,text('observer/foreign'))},{...a,declarations:[...a.declarations,...a.declarations]},{...a,declarations:[{channel:channel('a'),signal:'e\u0301'}]},{...a,samples:[sample('b',2)]},{...a,samples:[...a.samples,...a.samples]},input([['a','P'],['b','Q']],[sample('a',1),sample('b',1)]),{...a,samples:Array(1)}])expect(()=>select(bad,limits)).toThrow();
 });
 it('SG-G: input enumeration, caller mutation and forged/reused/closed views cannot expose extra data',()=>{
  const a=input([['b','P'],['a','P']]);const baseline=consume(select(a,limits).view);
  expect(consume(select({...a,samples:[...a.samples].reverse(),declarations:[...a.declarations].reverse()},limits).view)).toEqual(baseline);
  const result=select(a,limits);expect(()=>consume({...result.view})).toThrow();
  for(const v of a.samples)if(typeof v!=='boolean'&&v.kind==='record')(v.fields as Map<bigint,CanonicalValue>).clear();
  expect(consume(result.view)).toEqual(baseline);expect(()=>consume(result.view)).toThrow();
  const v=select(input([['a','P']]),limits).view;close(v);expect(()=>consume(v)).toThrow();
 });
 it('SG-H: absent views add no operand, while a present high range remains selectable',()=>{
  const result=select(input([['a','P'],['b','Q']],[sample('a',1,20,30,false),sample('b',2,90,100)]),limits);
  expect(result.audit.map(a=>a.disposition)).toEqual(['Unavailable','Selected']);expect(consume(result.view).groups.map(g=>g.signal)).toEqual(['Q']);
 });
});
