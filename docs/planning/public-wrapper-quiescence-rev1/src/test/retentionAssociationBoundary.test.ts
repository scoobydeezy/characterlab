import {describe,it,expect} from 'vitest';
import {fragmentRetainedUnits} from '../campaign3/retentionFragmentation';
import {spreadingActivation,rankAccessibleEpisodes} from '../campaign3/encodingAccessMath';
import {ExactRational as Q} from '../substrate/exactMath';
const zero=Q.of(0n),one=Q.of(1n),half=Q.of(1n,2n);
// Competing graph-lifecycle hypotheses, component operands only. The cue represents
// newly supplied safe context, not a lookup of forgotten episode bytes.
const initial=[{id:1n,kind:'EventContinuant' as const,units:['a','b'].map(key=>({key,views:[new Uint8Array([17])] }))}];
const current=()=>fragmentRetainedUnits(initial,[{acquisition:1n,unit:'b'}],{EventContinuant:1,Interoceptive:0}).acquisitions;
const rank=(labels:string[],weights:Q[][],cue:Q[],episodes=current())=>{
 const activation=spreadingActivation(labels,weights,cue,half,1000n);
 const result=rankAccessibleEpisodes(episodes.map(e=>({key:String(e.id),retainedKeys:e.units.map(u=>u.key),presentations:[0n]})),new Map(labels.map((key,i)=>[key,activation.quantized[i]])),1n,{lambda:one,exponent:1,omegaB:zero,omegaA:one,k:2});
 return {activation,result};
};
describe('association versus surviving episodic content: hypothesis discrimination only',()=>{
 it('RA-D: kept versus pruned graph reverses ranking of two surviving acquisitions',()=>{
  const episodes=[...current(),{id:2n,kind:'EventContinuant' as const,units:[{key:'c',views:[new Uint8Array([23])]}]}];
  const kept=rank(['a','b','c'],[[zero,half,zero],[half,zero,zero],[zero,zero,zero]],[zero,one,Q.of(1n,10n)],episodes);
  const pruned=rank(['a','c'],[[zero,zero],[zero,zero]],[zero,Q.of(1n,10n)],episodes);
  expect(kept.result.selected.map(e=>e.key)).toEqual(['1','2']);expect(pruned.result.selected.map(e=>e.key)).toEqual(['2','1']);
 });
 it('RA-A: a learned edge can alter retrieval of a surviving unit without returning the forgotten unit',()=>{
  const kept=rank(['a','b'],[[zero,half],[half,zero]],[zero,one]);
  const pruned=rank(['a'],[[zero]],[zero]);
  expect(kept.activation.exact[0].compare(Q.of(4n,15n))).toBe(0);
  expect(kept.result.selected[0].score.compare(pruned.result.selected[0].score)).toBeGreaterThan(0);
  expect(current()[0].units.map(u=>u.key)).toEqual(['a']);expect(kept.result.selected.map(e=>e.key)).toEqual(['1']);
 });
 it('RA-B: graph activation alone cannot manufacture a completely lost episode target',()=>{
  const lost=fragmentRetainedUnits(initial,[{acquisition:1n,unit:'a'},{acquisition:1n,unit:'b'}],{EventContinuant:0,Interoceptive:0});
  const kept=rank(['a','b'],[[zero,half],[half,zero]],[zero,one],lost.acquisitions);
  expect(kept.activation.exact[0].compare(zero)).toBeGreaterThan(0);expect(kept.result.selected).toEqual([]);
 });
 it('RA-C: without the cross-file edge the component retrieval distinction disappears',()=>{
  const noEdge=rank(['a','b'],[[zero,zero],[zero,zero]],[zero,one]);
  const pruned=rank(['a'],[[zero]],[zero]);
  expect(noEdge.result.selected[0].score.compare(pruned.result.selected[0].score)).toBe(0);
 });
});
