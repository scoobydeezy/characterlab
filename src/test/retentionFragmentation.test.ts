import {describe,it,expect} from 'vitest';
import {fragmentRetainedUnits as apply,type RetainedAcquisition} from '../campaign3/retentionFragmentation';
const child=(key:string,...views:number[][])=>({key,views:views.map(v=>new Uint8Array(v))});
const body=():RetainedAcquisition=>({id:1n,kind:'Interoceptive',units:[child('alpha',[1,2],[9,8]),child('beta',[3])]});
const limits={EventContinuant:2,Interoceptive:2};
describe('retention fragmentation mechanics only',()=>{
 it('RF-A: partial loss preserves identity and complete survivor views without a removed-content result',()=>{
  const original=body(),result=apply([original],[{acquisition:1n,unit:'beta'}],limits);
  expect(result).toEqual({acquisitions:[{...original,units:[original.units[0]]}],usage:{EventContinuant:0,Interoceptive:1}});
  expect(original.units).toHaveLength(2);expect(Object.keys(result)).toEqual(['acquisitions','usage']);
 });
 it('RF-B: final-unit loss removes the current target and creates no replacement acquisition',()=>{
  expect(apply([body()],[{acquisition:1n,unit:'alpha'},{acquisition:1n,unit:'beta'}],limits)).toEqual({acquisitions:[],usage:{EventContinuant:0,Interoceptive:0}});
 });
 it('RF-C: view multiplicity does not change cost; same signal in another acquisition does',()=>{
  const a=body(),single={...a,units:[a.units[0]]},more={...single,units:[child('alpha',[1],[2],[3])]};
  expect(apply([single],[],limits).usage).toEqual(apply([more],[],limits).usage);
  expect(apply([single,{...single,id:2n}],[],limits).usage.Interoceptive).toBe(2);
 });
 it('RF-D: body loss preserves event bytes and unused event capacity cannot rescue body overflow',()=>{
  const visual:RetainedAcquisition={id:2n,kind:'EventContinuant',units:[child('event-unit',[5])]};
  expect(apply([visual,body()],[{acquisition:1n,unit:'beta'}],limits).acquisitions[0]).toEqual(visual);
  expect(()=>apply([body()],[],{EventContinuant:20,Interoceptive:1})).toThrow('insufficient loss plan');
 });
 it('RF-E: output bytes and containers are detached from source state',()=>{
  const a=body(),r=apply([a],[],limits);r.acquisitions[0].units[0].views[0][0]=99;
  expect(a.units[0].views[0][0]).toBe(1);a.units[0].views[1][0]=77;expect(r.acquisitions[0].units[0].views[1][0]).toBe(9);
 });
 it('RF-F: unknown and duplicate loss addresses reject, including a view pretending to be a unit',()=>{
  for(const losses of [[{acquisition:9n,unit:'alpha'}],[{acquisition:1n,unit:'alpha/view1'}],[{acquisition:1n,unit:'alpha'},{acquisition:1n,unit:'alpha'}]])expect(()=>apply([body()],losses,limits)).toThrow();
 });
 it('RF-G: duplicate IDs/units, sparse inputs, empty bases and invalid capacities reject',()=>{
  const a=body();expect(()=>apply([a,a],[],limits)).toThrow('duplicate acquisition');
  expect(()=>apply([{...a,units:[a.units[0],a.units[0]]}],[],limits)).toThrow('duplicate unit');
  expect(()=>apply(new Array(1),[],limits)).toThrow('dense bounded array');
  expect(()=>apply([{...a,units:[child('alpha')]}],[],limits)).toThrow('empty evidence basis');
  expect(()=>apply([a],[],{...limits,Interoceptive:-1})).toThrow('capacity');
 });
 it('RF-H: loss order is irrelevant and event acquisitions can partially survive too',()=>{
  const a={...body(),kind:'EventContinuant' as const},b={...body(),id:2n};
  const losses=[{acquisition:1n,unit:'beta'},{acquisition:2n,unit:'alpha'}];
  expect(apply([a,b],losses,limits)).toEqual(apply([a,b],[...losses].reverse(),limits));
  expect(apply([a,b],losses,limits).usage).toEqual({EventContinuant:1,Interoceptive:1});
 });
});
