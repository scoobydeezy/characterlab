import {describe,it,expect} from 'vitest';
import {createMarkerTracker,applyMarkerSweep,markerTrackingSnapshot,type MarkerSweep} from '../campaign3/observedMarkerTracking';
import {createMarkerTransactionManager as create,beginMarkerTransaction as begin,previewMarkerTransaction as preview,commitMarkerTransaction as commit,abortMarkerTransaction as abort,committedMarkerSnapshot as snapshot,type MarkerProposal} from '../campaign3/transactionalMarkerTracking';
const observer='observer/transaction-test';
const sweep=(n:number,glyphs:readonly (number|undefined)[]):MarkerSweep=>({observerId:observer,observationId:BigInt(n*10),occurredAt:BigInt(n),detections:glyphs.map((g,i)=>({detectionId:BigInt(n*10+i+1),...(g===undefined?{}:{glyph:BigInt(g)})}))});
const history=[sweep(1,[1,2]),sweep(2,[2,1]),sweep(3,[2,2]),sweep(4,[]),sweep(5,[7]),sweep(6,[undefined]),sweep(7,[7]),sweep(8,[1])];
describe('marker-tracking-transaction/0.1-candidate',()=>{
 it('MTX-A: all nine prefixes and their continued suffixes equal actual uninterrupted OMT',()=>{
  for(let cut=0;cut<=history.length;cut++){
   const reference=createMarkerTracker(observer);for(const s of history.slice(0,cut))applyMarkerSweep(reference,s);
   const manager=create(observer,history.slice(0,cut));expect(snapshot(manager)).toEqual(markerTrackingSnapshot(reference));
   for(const s of history.slice(cut)){const expected=applyMarkerSweep(reference,s),p=begin(manager,s);expect(preview(manager,p).transitions).toEqual(expected);commit(manager,p);expect(snapshot(manager)).toEqual(markerTrackingSnapshot(reference));}
  }
 });
 it('MTX-B: reconstruction preserves used ordinals even outside the last window',()=>{
  const manager=create(observer,history.slice(0,7)),before=snapshot(manager);
  expect(()=>begin(manager,{...history[7],observationId:10n})).toThrow('replayed observation');expect(snapshot(manager)).toEqual(before);
 });
 it('MTX-C: eight committed sweeps retain the horizon after reconstruction',()=>{
  const manager=create(observer,history),before=snapshot(manager);expect(()=>begin(manager,sweep(9,[1]))).toThrow('horizon');expect(snapshot(manager)).toEqual(before);
 });
 it('MTX-D: preview is provisional and abort leaves the committed prefix unchanged',()=>{
  const manager=create(observer,history.slice(0,1)),before=snapshot(manager),p=begin(manager,history[1]);expect(snapshot(manager)).toEqual(before);expect(preview(manager,p).snapshot.sweeps).toBe(2);abort(manager,p);expect(snapshot(manager)).toEqual(before);expect(()=>commit(manager,p)).toThrow();
 });
 it('MTX-E: malformed prefix and failed begin cannot partially publish or leave a pending proposal',()=>{
  const sparse=new Array(1);expect(()=>create(observer,sparse)).toThrow('dense data prefix');let called=false;const prefix=[] as MarkerSweep[];Object.defineProperty(prefix,0,{get(){called=true;return history[0];}});expect(()=>create(observer,prefix)).toThrow();expect(called).toBe(false);
  const manager=create(observer),before=snapshot(manager);expect(()=>begin(manager,sweep(1,[1,9]))).toThrow();expect(snapshot(manager)).toEqual(before);commit(manager,begin(manager,history[0]));expect(snapshot(manager).sweeps).toBe(1);
 });
 it('MTX-F: wrong-manager, forged, pending and reused proposals do not steal another transaction',()=>{
  const a=create(observer),b=create(observer),p=begin(a,history[0]);expect(()=>commit(b,p)).toThrow();expect(()=>abort(b,p)).toThrow();expect(()=>begin(a,history[1])).toThrow('pending');expect(()=>commit(a,{} as MarkerProposal)).toThrow();commit(a,p);expect(()=>commit(a,p)).toThrow();expect(snapshot(a).sweeps).toBe(1);expect(snapshot(b).sweeps).toBe(0);
 });
 it('MTX-G: caller prefix/input and preview mutation cannot alter committed authority',()=>{
  const prefix=structuredClone(history.slice(0,1)),manager=create(observer,prefix),input=structuredClone(history[1]),p=begin(manager,input),output=preview(manager,p);
  Object.assign(prefix[0],{observationId:999n});Object.assign(input,{occurredAt:999n});output.snapshot.used.push(999n);Object.assign(output.transitions[0].perceptualReferentId,{observerTrackSequence:999n});commit(manager,p);
  expect(snapshot(manager)).toEqual(snapshot(create(observer,history.slice(0,2))));
  commit(manager,begin(manager,history[2]));expect(snapshot(manager)).toEqual(snapshot(create(observer,history.slice(0,3))));
 });
 it('MTX-H: a later-stage failure aborts tracking and retry preserves output identities',()=>{
  const manager=create(observer,history.slice(0,1)),before=snapshot(manager),attempt=begin(manager,history[1]),first=preview(manager,attempt);
  try{throw Error('later encoding stage');}catch{abort(manager,attempt);}expect(snapshot(manager)).toEqual(before);
  const retry=begin(manager,history[1]);expect(preview(manager,retry)).toEqual(first);commit(manager,retry);expect(snapshot(manager)).toEqual(snapshot(create(observer,history.slice(0,2))));
 });
});
