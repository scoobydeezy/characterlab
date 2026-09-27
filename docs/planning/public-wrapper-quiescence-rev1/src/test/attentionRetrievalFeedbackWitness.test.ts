import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {associationCandidate,boundedEncodingResponse,spreadingActivation,rankAccessibleEpisodes} from '../campaign3/encodingAccessMath';
const q=(n:bigint,d=1n)=>Q.of(n,d),zero=q(0n),one=q(1n),labels=['a','b','c','d','e'];
// Planned observed-file history and hypothetical writer effects. Not public acquisition.
function fixture(){let W=labels.map(()=>labels.map(()=>zero));const episodes:{key:string;retainedKeys:string[];presentations:bigint[]}[]=[];
 for(let t=2;t<=5;t++){const ids=t<5?[0,1,2]:[0,3,4],z=labels.map(()=>zero);ids.forEach((id,i)=>{const role=t===5&&i===2?q(3n,5n):one;z[id]=boundedEncodingResponse(q(3n,10n).multiply(role));});W=associationCandidate(labels,W,z,{scale:100n,eta:one,lambda:zero,elapsed:q(t===2?0n:1n)}).values.map(r=>[...r]);episodes.push({key:'episode-'+t,retainedKeys:ids.map(i=>labels[i]),presentations:[BigInt(t)]});}
 const a=spreadingActivation(labels,W,[one,zero,zero,zero,zero],q(1n,2n),100n).quantized;
 return {W,episodes,activation:new Map(labels.map((l,i)=>[l,a[i]]))};}
const rank=(episodes:ReturnType<typeof fixture>['episodes'],activation:ReturnType<typeof fixture>['activation'],t:bigint,weight:Q)=>rankAccessibleEpisodes(episodes,activation,t,{lambda:one,exponent:1,omegaB:one,omegaA:weight,k:2});
describe('planned retrieval-feedback witness using exact component kernels',()=>{
 it('ARW-A: a strict ranking reversal occurs before histories differ',()=>{const f=fixture(),a=structuredClone(f.episodes),b=structuredClone(f.episodes);
  for(const t of [6n,7n]){const left=rank(a,f.activation,t,one),right=rank(b,f.activation,t,q(7n,5n));expect(left.selected.map(x=>x.key)).toEqual(right.selected.map(x=>x.key));for(const x of left.selected)a.find(e=>e.key===x.key)!.presentations.push(t);for(const x of right.selected)b.find(e=>e.key===x.key)!.presentations.push(t);}
  expect(a).toEqual(b);const before=structuredClone(a),left=rank(a,f.activation,8n,one),right=rank(b,f.activation,8n,q(7n,5n));expect(left.selected.map(x=>x.key)).toEqual(['episode-5','episode-4']);expect(right.selected.map(x=>x.key)).toEqual(['episode-4','episode-5']);expect(left.selected[0].score.subtract(left.selected[1].score)).toEqual(q(1n,75n));expect(right.selected[0].score.subtract(right.selected[1].score)).toEqual(q(1n,750n));expect(a).toEqual(before);expect(b).toEqual(before);});
 it('ARW-B: known-zero modulation is numerically the baseline without claiming identical source status',()=>{const f=fixture();expect(rank(f.episodes,f.activation,8n,one.add(zero))).toEqual(rank(f.episodes,f.activation,8n,one));});
 it('ARW-C: prepared graph and exact late-quantized cue are fixed independently of feedback',()=>{const f=fixture();expect([...f.activation.values()]).toEqual([q(101n,100n),q(2n,25n),q(2n,25n),q(3n,100n),q(1n,50n)]);const values=()=>f.W.map(r=>r.map(x=>x.numerator+'/'+x.denominator));const before=values();rank(f.episodes,f.activation,8n,q(7n,5n));expect(values()).toEqual(before);});
 it('ARW-D: adding nodes only when first encoded yields the same graph as the search embedding',()=>{let W:Q[][]=[];
  for(let t=2;t<=5;t++){const ns=t<5?labels.slice(0,3):labels,prior=ns.map((_,i)=>ns.map((_,j)=>W[i]?.[j]??zero)),ids=t<5?[0,1,2]:[0,3,4],z=ns.map(()=>zero);ids.forEach((id,i)=>z[id]=boundedEncodingResponse(q(3n,10n).multiply(t===5&&i===2?q(3n,5n):one)));W=associationCandidate(ns,prior,z,{scale:100n,eta:one,lambda:zero,elapsed:q(t===2?0n:1n)}).values.map(r=>[...r]);}
  expect(W).toEqual(fixture().W);});
});
