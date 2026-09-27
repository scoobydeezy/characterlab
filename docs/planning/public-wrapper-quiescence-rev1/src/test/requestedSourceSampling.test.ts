import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {typedIdentifier,text} from '../substrate/canonicalEncoding';
import {createLocalReserveSource,type LocalReserveSource} from '../campaign3/localReserveSource';
import {createTrialPanelSource,type TrialPanelSource} from '../campaign3/trialPanelSource';
import {createPositionDisplaySource,type PositionDisplaySource} from '../campaign3/positionDisplaySource';
import {sampleRequestedSources,type SourceSamplingRequest} from '../campaign3/requestedSourceSampling';
const observer=typedIdentifier(1000,text('observer/a'));
function sources(visible=true){return {
 body:createLocalReserveSource(['A','B','C'].map(k=>({key:'local-reserve/'+k,capacity:Q.of(100n),rate:Q.of(0n),amount:Q.of(0n),anchoredAt:0n})),['A','B','C'].map(k=>({channel:'channel/'+k,physical:'local-reserve/'+k,signal:'interoceptive-signal/'+k,width:Q.of(1n),available:visible,permitted:true}))),
 panel:createTrialPanelSource([{at:1n,glyph:0,stage:'Before',visible,permitted:true}]),
 visual:createPositionDisplaySource([{at:1n,x:0n,y:0n,glyph:0n,visible,permitted:true}])};}
describe('explicit requested source sampling',()=>{
 it('RSS-A: all seven nonempty requests sample only their named surfaces',()=>{
  for(let mask=1;mask<8;mask++){
   const s=sources();let n=0n;const b=!!(mask&1),p=!!(mask&2),v=!!(mask&4);
   const result=sampleRequestedSources(b?s.body:{} as LocalReserveSource,p?s.panel:{} as TrialPanelSource,v?s.visual:{} as PositionDisplaySource,observer,1n,{bodyChannels:b?['channel/A']:null,panel:p,visual:v},()=>n++);
   expect(Object.hasOwn(result,'body')).toBe(b);expect(Object.hasOwn(result,'panel')).toBe(p);expect(Object.hasOwn(result,'visual')).toBe(v);expect(n).toBe(BigInt(Number(b)+Number(p)+Number(v)));
  }
 });
 it('RSS-B: requested absence has an observation while an unrequested surface has no product',()=>{
  const s=sources(false);let n=0n;const r=sampleRequestedSources(s.body,s.panel,s.visual,observer,1n,{bodyChannels:null,panel:true,visual:false},()=>n++);
  expect(r.panel).toEqual({observation:0n,sample:{kind:'Unavailable',at:1n}});expect(r).not.toHaveProperty('body');expect(r).not.toHaveProperty('visual');expect(n).toBe(1n);
 });
 it('RSS-C: executable, empty and unknown request forms reject before allocation',()=>{
  const s=sources();let calls=0,getters=0;const request={bodyChannels:null,panel:true,visual:false};
  for(const r of [{...request,get panel(){getters++;return true;}},{...request,panel:false},{...request,truth:true},{...request,bodyChannels:[]},{...request,panel:1}])expect(()=>sampleRequestedSources(s.body,s.panel,s.visual,observer,1n,r as SourceSamplingRequest,()=>{calls++;return 0n;})).toThrow();
  expect(calls).toBe(0);expect(getters).toBe(0);
 });
 it('RSS-D: observation identities are unique across modalities, with no sample result on failure',()=>{
  const s=sources();expect(()=>sampleRequestedSources(s.body,s.panel,s.visual,observer,1n,{bodyChannels:['channel/A'],panel:true,visual:true},()=>0n)).toThrow('SOURCE_SAMPLING_ALLOCATION');
  let n=0n;const r=sampleRequestedSources(s.body,s.panel,s.visual,observer,1n,{bodyChannels:['channel/A'],panel:true,visual:true},()=>n++);expect(r.panel!.observation).toBe(1n);expect(r.visual!.observation).toBe(2n);expect(n).toBe(3n);
 });
 it('RSS-E: sensing itself creates no experience, cue, selection, memory or truth resolver',()=>{
  const s=sources();let n=0n;const r=sampleRequestedSources(s.body,s.panel,s.visual,observer,1n,{bodyChannels:null,panel:false,visual:true},()=>n++);
  expect(Object.keys(r).sort()).toEqual(['at','observer','visual']);expect(r.visual!.sample).toEqual({kind:'Present',at:1n,position:{x:0n,y:0n},glyph:0n});
 });
});
