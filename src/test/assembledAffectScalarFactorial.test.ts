/** M77: unchanged M75 scenarios; normal perceived sources, physical tasks,
 * body30/cap100, delivery0/90, seed0. Scalar substitution is a test counterfactual. */
import {it,expect} from 'vitest';
import {list,rational as q} from '../substrate/canonicalEncoding';
import {dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {validateMitigationPacket} from '../assembled/mitigation';
import {taskA,items,type Cell} from './fixtures/assembledAffectScalar';
import {create,instrument,equalReceivers,knowledge,allDraws,probability} from './fixtures/assembledAffectReceiving';

const bits=[0,1] as const;
const str=(x:Q)=>x.numerator+'/'+x.denominator;
for(const p of bits)for(const s of bits)it('M77 factorial p'+p+'s'+s+': four native/scalar receiving pairs',async()=>{
 let count=0,diagnostic=0,automatic=0;
 for(const v of bits)for(const c of bits){
  const cell:Cell={p,s,v,c};
  const native=await create(cell,11n);
  const scalar=await instrument('ScalarUncontrolled',()=>create(cell,11n));
  const {pa,pb,ma,mb}=equalReceivers(native.r,scalar.r);
  const V=Q.of(v?19n:99n,100n),E=Q.of(BigInt(p*s)).multiply(Q.of(1n).add(V)).divide(Q.of(2n)),U=E.multiply(Q.of(BigInt(1-c)));
  const factors=[q(p,1),q(s,1),q(V.numerator,V.denominator),q(c,1)];
  for(const x of [pa,pb]){
   const provenance=items(x.a[7],'list');
   expect(items(provenance[4],'list'),'actual independently sourced factors').toEqual(factors);
   expect(items(provenance[8],'list').slice(0,2)).toEqual([q(100,1),q(v?81:1,100)]);
  }
  expect(pa.a[6]).toEqual(list([q(E.numerator,E.denominator),q(U.numerator,U.denominator)]));
  expect(pb.a[6]).toEqual(list([q(0,1),q(U.numerator,U.denominator)]));
  const k=knowledge(native.r);
  expect(k.efficacy!.cue!.mean).toEqual(Q.of(BigInt(p)));
  expect(k.efficacy!.control).toEqual(Q.of(BigInt(c)));
  expect(k.efficacy!.means.map(n=>str(n!))).toEqual(['1/1',c?'0/1':'1/1']);
  expect(k.efficacy!.supports).toHaveLength(2);expect(k.efficacy!.cue!.supports).toHaveLength(1);
  for(const support of k.efficacy!.supports)expect(items(items(support,'list')[1],'list').map(x=>validateMitigationPacket(x).role)).toEqual(['Before','Motion','After']);
  expect(items(k.efficacy!.cue!.supports[0],'list').map(x=>validateMitigationPacket(x).glyph)).toEqual([0n,0n,0n]);
  if(E.compare(Q.of(0n))>0){
   diagnostic++;expect(pa.a).not.toEqual(pb.a);expect(ma.raw[2]).not.toEqual(mb.raw[2]);
   expect(ma.carry.carry!.exposure).not.toEqual(mb.carry.carry!.exposure);
  }else {expect(pa.a).toEqual(pb.a);expect(ma.raw[2]).toEqual(mb.raw[2]);}
  const positive=U.compare(Q.of(0n))>0;
  expect(ma.gain).toBe(str(Q.of(1n).add(U)));
  if(positive){
   automatic++;expect(uint(f(pa.data,8n))).toBe(1n);expect(f(pa.data,1n)).toEqual(pa.A);
   expect(pa.signal(taskA,2n)).toHaveLength(1);expect(readQ(f(pa.signal(taskA,2n)[0],2n))).toEqual(U);
  }else {
   expect(uint(f(pa.data,8n))).not.toBe(1n);
   expect(probability(pa.data,pa.A)).toEqual(Q.of(1n,2n));
   expect(pa.signal(taskA,2n)).toEqual([]);
   expect(allDraws(native.r).length,'actual matched records, not just seed').toBeGreaterThan(0);
  }
  count++;
  console.info('M77 CELL '+JSON.stringify({cell,v:str(V),E:str(E),U:str(U),probabilityA:positive?'1/1':'1/2',gain:ma.gain,scores:ma.scores,selected:ma.selected,matchedDraws:allDraws(native.r).length,stateAndReceiversEqual:true,diagnosticErasure:E.compare(Q.of(0n))>0},(_k,x)=>typeof x==='bigint'?String(x):x));
 }
 expect(count).toBe(4);expect(diagnostic).toBe(p&&s?4:0);expect(automatic).toBe(p&&s?2:0);
 console.info('M77 GROUP p'+p+'s'+s+' PASS4 native/scalar pairs; actual state/knowledge/concern/reasons/decision/execution/draws/recall agree. Diagnostic differences retained.');
},540000);
