/** M84: test-only, lossless compiler operand correspondence; never a run input.
 * Original source production is NOT emulated: samples/history remain unclaimed.
 * Descriptors identify an existing lane+401 key. Exact native strengths/bases survive.
 */
import {expect} from 'vitest';
import {list,set,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {receivingRecord as rec,cognitiveRecord as r,decodeCognitive as decode} from '../../assembled/codecs';
import {reasonRecord as rr} from '../../campaign3/reasonCodecs';
import {compileJoinedReasons} from '../../campaign3/reasonMath';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../../campaign2/canonicalData';
import {readQ} from '../../campaign2/cognitiveMath';
import {sid} from '../../assembled/skill';

export const valueDice=r(437,[r(438,[q(1,10),q(1,5),q(3,5),q(4,5),q(9,10)]),q(0,1),r(439,[q(1,1),u(3)]),r(439,[q(1,1),u(3)])]);
const occurrence=typedIdentifier(1160,u(0)); // Comparator occurrence only; not a native event or draw.
export function definition(source:{registry:Uint8Array}){
 const row=items(items(decode(source.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/task-reason-dice')));
 return f(rec(row!,171n),4n);
}
export function operands(raw:CanonicalValue){
 const v=rec(raw,403n);
 expect(v.schema.schemaVersion).toBe(2n);
 return [3n,5n].map((field,lane)=>{
  const all=items(f(v,field),'set'),nonzero=all.filter(v=>readQ(f(rec(v,402n),2n)).numerator!==0n);
  const signals=nonzero.map(v=>{
   const signal=rec(v,402n),source=rec(f(signal,1n),401n),motive=sid(1040,lane?'Value':'Commitment');
   const task=rec(f(source,2n),371n),candidate=rec(f(source,1n),395n);
   expect(f(task,1n)).toEqual(f(candidate,1n));
   const descriptor=rr(916,[sid(1027,'M84/compiler/'+key(list([motive,source]))),candidate,motive,f(task,2n),f(source,3n),q(1,1),set([])]);
   const mapped=rr(919,[descriptor,f(signal,2n),f(signal,3n),list([])]);
   expect(r(402,[r(401,[f(descriptor,2n),r(371,[f(candidate,1n),f(descriptor,4n)]),f(descriptor,5n)]),f(mapped,2n),f(mapped,3n)])).toEqual(signal);
   return mapped;
  });
  expect(new Set(signals.map(v=>key(f(rec(f(v,1n),916n),1n)))).size).toBe(signals.length);
  return {signals,omittedZeros:all.length-signals.length};
 });
}
export function compile(signals:CanonicalValue[],dice:CanonicalValue,law=1){
 const raw=rr(920,[occurrence,list(signals),list([])]);
 return compileJoinedReasons(occurrence,raw,dice,law);
}
export const originalNuclei=(compiled:CanonicalValue)=>items(f(rec(compiled,924n),3n),'list').map(v=>rec(v,923n));
export function nativeProjection(value:CanonicalValue){
 const n=rec(value,407n),k=rec(f(n,1n),404n),roles=rec(f(n,2n),406n);
 return list([list([f(k,1n),f(k,2n),f(k,3n),f(k,4n)]),f(roles,1n),f(roles,2n),f(roles,3n),q(0,1),f(n,3n),f(n,4n),f(n,5n),f(n,6n),{kind:'signed',value:0n},f(n,7n)]);
}
export function originalProjection(value:CanonicalValue){
 const n=rec(value,923n),k=rec(f(n,1n),922n);
 return list([list([f(k,1n),f(k,2n),f(k,3n),f(k,4n)]),...Array.from({length:10},(_,i)=>f(n,BigInt(i+2)))]);
}
export function correspondence(context:CanonicalValue,dice:CanonicalValue){
 const c=rec(context,408n),raw=f(c,2n),lanes=operands(raw),native=items(f(c,3n),'list');
 const compiled=lanes.map((lane,i)=>compile(lane.signals,i?valueDice:dice));
 const originals=compiled.flatMap(originalNuclei);
 expect(key(set(originals.map(originalProjection)))).toBe(key(set(native.map(nativeProjection))));
 // Every original coverage witness refers to exactly one captured source, with
 // unchanged magnitude; all role totals and distributions above match native.
 for(let i=0;i<2;i++)for(const n of originalNuclei(compiled[i])){
  expect(f(n,5n)).toEqual(q(0,1));
  for(const w of items(f(n,12n),'list')){
   const witness=rec(w,921n),descriptor=f(witness,1n);
   expect(lanes[i].signals.some(s=>key(f(s,1n))===key(descriptor))).toBe(true);
  }
 }
 console.info('M84 CORRESPONDENCE '+JSON.stringify({nativeNuclei:native.length,nonzero:lanes.map(v=>v.signals.length),omittedZero:lanes.map(v=>v.omittedZeros),allProjectedFieldsEqual:true}));
 return {lanes,native,originals};
}
export function pooledControl(context:CanonicalValue,dice:CanonicalValue){
 const c=correspondence(context,dice),value=c.lanes[1].signals;
 expect(value).toHaveLength(1);
 const descriptor=rec(f(value[0],1n),916n),candidate=f(descriptor,2n),referent=f(descriptor,4n);
 const commitment=c.lanes[0].signals.filter(s=>{const d=rec(f(s,1n),916n);return key(f(d,2n))===key(candidate)&&key(f(d,4n))===key(referent)&&uint(f(d,5n))===1n;});
 expect(commitment).toHaveLength(1);
 // Grouping contrast only, common task calibration; not a pooled native decision.
 const sources=[...commitment,...value],aggregate=originalNuclei(compile(sources,dice)),pooled=originalNuclei(compile(sources,dice,2));
 // Use raw groups even if the common calibration leaves Value below activation.
 const grouped=(compiled:CanonicalValue)=>[...originalNuclei(compiled).map(v=>f(v,1n)),...items(f(rec(compiled,924n),4n),'list').map(v=>f(rec(v,928n),1n))];
 expect(grouped(compile(sources,dice))).toHaveLength(2);
 expect(grouped(compile(sources,dice,2))).toHaveLength(1);
 expect(new Set(sources.map(s=>key(f(rec(f(s,1n),916n),3n)))).size).toBe(2);
 console.info('M84 POOLED original Aggregate groups2 / PooledChannel groups1; active='+aggregate.length+'/'+pooled.length+'; grouping-only control, common task calibration');
}
