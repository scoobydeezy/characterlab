import {describe,it,expect} from 'vitest';
import {advanceMarkerWindow as advance,type TrackingWindow} from '../campaign3/markerWindowTracking';
import {emptyPerceptualContinuantFileState as empty,type PerceptualContinuantFileState} from '../semanticBinding/perceptualContinuantFiles';
import {createTenSweepMarkerTracker,applyMarkerSweep,markerTrackingSnapshot,type MarkerSweep} from '../campaign3/observedMarkerTracking';
const observer='observer/a';
const initial=()=>({files:empty(),window:{at:0n,observation:null,items:[]} as TrackingWindow});
const sweep=(at:number,glyphs:readonly (bigint|undefined)[]):MarkerSweep=>({observerId:observer,observationId:BigInt(at*10),occurredAt:BigInt(at),detections:glyphs.map((glyph,i)=>({detectionId:BigInt(at*10+i+1),glyph}))});
const history=[[0n,1n],[1n,0n],[0n,0n],[],[0n],[undefined,1n],[1n,2n],[2n],[2n,3n],[]].map((g,i)=>sweep(i+1,g));
const run=(prefix:typeof history)=>{let s=initial();for(const input of prefix)s=advance(observer,s.files,s.window,input);return s;};
describe('bounded retained tracking window',()=>{
 it('MW-A: actual SEM output matches the existing history control for ambiguity, absence and continuity',()=>{
  const control=createTenSweepMarkerTracker(observer);let s=initial();
  for(const input of history){const expected=applyMarkerSweep(control,input),r=advance(observer,s.files,s.window,input);expect(r.transitions).toEqual(expected);expect(r.files).toEqual(markerTrackingSnapshot(control).state);s=r;}
  for(const prior of [undefined,0n,1n])for(const current of [undefined,0n,1n]){
   const t=createTenSweepMarkerTracker(observer);let s=initial();for(const input of [sweep(1,[prior]),sweep(2,[current])]){const r=advance(observer,s.files,s.window,input);expect(r.transitions).toEqual(applyMarkerSweep(t,input));s=r;}
  }
 });
 it('MW-B: every prefix reconstructs using only the last window and SEM owner, with detached candidates',()=>{
  const expected=run(history);
  for(let n=0;n<=history.length;n++){let s=structuredClone(run(history.slice(0,n)));for(const input of history.slice(n))s=advance(observer,s.files,s.window,input);expect(s.files).toEqual(expected.files);expect(s.window).toEqual(expected.window);expect(Object.keys(s.window).sort()).toEqual(['at','items','observation']);}
  const s=run(history.slice(0,1)),prior=structuredClone(s),r=advance(observer,s.files,s.window,history[1]);
  (r.window.items[0].file as {observerId:string}).observerId='changed';expect(s).toEqual(prior);expect(r.transitions[0].perceptualReferentId.observerId).toBe(observer);
 });
 it('MW-C: detection1112 and observation1115 may share numeric payload without aliasing',()=>{
  const first={...sweep(1,[0n]),observationId:1n,detections:[{detectionId:1n,glyph:0n}]};
  const a=advance(observer,empty(),initial().window,first);
  const b=advance(observer,a.files,a.window,{...sweep(2,[0n]),observationId:2n,detections:[{detectionId:2n,glyph:0n}]});
  expect(b.transitions[0].continuityKind).toBe('ContinuesPriorTrack');expect(b.transitions[0].supportingObservationIds.map(v=>v.observationId)).toEqual([1n,2n]);
 });
 it('MW-D: failed owner candidate never changes either supplied owner and retry is exact',()=>{
  const s=run(history.slice(0,1)),prior=structuredClone(s);
  for(const input of [{...history[1],occurredAt:1n},{...history[1],observationId:10n},{...history[1],observerId:'observer/b'},{...history[1],detections:[{detectionId:22n},{detectionId:21n}]}]){expect(()=>advance(observer,s.files,s.window,input)).toThrow();expect(s).toEqual(prior);}
  expect(advance(observer,s.files,s.window,history[1])).toEqual(advance(observer,prior.files,prior.window,history[1]));
 });
 it('MW-E: rejects foreign, inactive, duplicate, executable and inconsistent initial windows',()=>{
  const s=run(history.slice(0,1));
  const bad=[{...s.window,items:[{file:{observerId:'observer/b',observerTrackSequence:0n}}]},{...s.window,items:[{file:{observerId:observer,observerTrackSequence:99n}}]},{...s.window,items:[s.window.items[0],s.window.items[0]]},{...s.window,observation:null},{...s.window,at:0n},{...s.window,items:[{...s.window.items[0],glyph:8n}]}];
  for(const window of bad)expect(()=>advance(observer,s.files,window,history[1])).toThrow();
  let reads=0;const window={...s.window,get items(){reads++;return s.window.items;}};expect(()=>advance(observer,s.files,window,history[1])).toThrow();expect(reads).toBe(0);
  const foreign:PerceptualContinuantFileState={nextTrackSequenceByObserver:new Map([['observer/b',0n]]),activePerceptualReferentIds:[]};expect(()=>advance(observer,foreign,initial().window,history[0])).toThrow();
 });
 it('MW-F: losing the last visible window cannot resurrect an older matching glyph',()=>{
  const first=advance(observer,empty(),initial().window,sweep(1,[0n]));
  const hidden=advance(observer,first.files,first.window,sweep(2,[]));
  const again=advance(observer,hidden.files,hidden.window,sweep(3,[0n]));
  expect(again.transitions[0].continuityKind).toBe('NewTrack');expect(again.transitions[0].perceptualReferentId.observerTrackSequence).toBe(1n);expect(again.files.activePerceptualReferentIds).toHaveLength(2);
 });
 it('MW-G: three detections and thirty files bound the candidate; a late overflow rolls back',()=>{
  let s=initial();expect(()=>advance(observer,s.files,s.window,sweep(1,[0n,1n,2n,3n]))).toThrow('BOUND');
  for(let i=1;i<=10;i++)s=advance(observer,s.files,s.window,sweep(i,[undefined,undefined,undefined]));
  expect(s.files.nextTrackSequenceByObserver.get(observer)).toBe(30n);const prior=structuredClone(s);
  expect(()=>advance(observer,s.files,s.window,sweep(11,[undefined]))).toThrow('FILE_BOUND');expect(s).toEqual(prior);
 });
});
