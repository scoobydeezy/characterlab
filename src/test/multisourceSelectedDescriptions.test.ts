import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {canonicalEncode as enc} from '../substrate/canonicalEncoding';
import {dataField as f,dataRecord as rec,dataKey as key} from '../campaign2/canonicalData';
import {createLocalReserveSource} from '../campaign3/localReserveSource';
import {observeLocalReserveOpportunity} from '../campaign3/localReserveObservation';
import {selectLocalReserveSignals,type SignalSelectedView} from '../campaign3/interoceptiveSignalSelection';
import {produceSelectedDescriptions as produce,type SelectedDescription} from '../campaign3/multisourceSelectedDescriptions';
import {compareMultisourceCoverage as compare,type ComparisonSignal} from '../campaign3/multisourceComparison';
import {O,id} from './receivingFixtures';
const q=(n:number,d=1)=>Q.of(BigInt(n),BigInt(d));
const signal='interoceptive-signal/A';
const definitions:SelectedDescription[]=[{id:'a',signal,channels:['channel/a'],threshold:q(60),direction:'FavorBelow'},{id:'b',signal,channels:['channel/b'],threshold:q(60),direction:'FavorBelow'},{id:'c',signal,channels:['channel/a','channel/b'],threshold:q(60),direction:'FavorBelow'}];
function view(amount=20,second=true,capacity=3){
 const source=createLocalReserveSource(['A','B','C'].map(k=>({key:'local-reserve/'+k,capacity:q(100),rate:q(0),amount:q(amount),anchoredAt:0n})),[['a','A',10,true],['b','A',20,second],['otherB','B',10,true],['otherC','C',10,true]].map(([channel,k,width,permitted])=>({channel:'channel/'+channel,physical:'local-reserve/'+k,signal:'interoceptive-signal/'+k,width:q(width as number),available:true,permitted:permitted as boolean})));
 let n=0n;const batch=observeLocalReserveOpportunity(source,O,45n,['channel/a','channel/b','channel/otherB','channel/otherC'],'Current',()=>n++);
 return selectLocalReserveSignals(batch,{maxSignals:3,maxViewsPerSignal:2,maxBytesPerSignal:4096,capacity}).view;
}
function rows(output:ReturnType<typeof produce>):ComparisonSignal[]{
 const atoms=new Map<string,string>();return output.assessments.flatMap(a=>{
  if(a.kind!=='Known'||a.strength.equals(q(0)))return [];
  const basis=a.samples.map(s=>{const k=key(f(rec(s,461n),1n));if(!atoms.has(k))atoms.set(k,'fact-'+atoms.size);return [atoms.get(k)!,q(1)] as const;});
  return [{source:a.id,ground:'body',family:'Body' as const,role:'Base' as const,strength:a.strength,basis}];
 });
}
it('produces the third aggregate basis from two actual selected views and preserves collective redundancy',()=>{
 const out=produce(view(),O,definitions),signals=rows(out);expect(signals.map(s=>s.strength)).toEqual([q(1,2),q(1,3),q(1,3)]);
 expect(signals.map(s=>s.basis.length)).toEqual([1,1,2]);
 const aggregate=compare(signals,'GroundAggregate'),pairwise=compare(signals,'GroundPairwise');
 expect(aggregate.witnesses[2].effective).toEqual(q(0));expect(pairwise.witnesses[2].effective).toEqual(q(1,6));
 expect(aggregate.totals[0].base).toEqual(q(5,11));expect(pairwise.totals[0].base).toEqual(q(1,2));
});
it('duplicates a description without inventing a new fact or extra reference contribution',()=>{
 const a=definitions[0],signals=rows(produce(view(),O,[a,{...a,id:'duplicate'}]));expect(signals[0].basis).toEqual(signals[1].basis);
 expect(compare(signals,'GroundAggregate').totals[0].base).toEqual(q(1,3));expect(compare(signals,'GroundUncovered').totals[0].base).toEqual(q(1,2));
});
it('missing selected support makes the whole aggregate unavailable, rather than silently dropping a member',()=>{
 const out=produce(view(20,false),O,definitions);expect(out.assessments.map(a=>a.kind)).toEqual(['Known','Unavailable','Unavailable']);
 expect(produce(view(20,true,0),O,definitions).assessments.every(a=>a.kind==='Unavailable')).toBe(true);
});
it('preserves exact hull, negative polarity and known-zero evidence',()=>{
 const hull=produce(view(),O,[{...definitions[2],direction:'DisfavorBelow'}]).assessments[0];if(hull.kind!=='Known')throw Error('known');
 expect(hull.lower).toEqual(q(20));expect(hull.upper).toEqual(q(40));expect(hull.strength).toEqual(q(-1,3));
 const zero=produce(view(70),O,[definitions[2]]).assessments[0];if(zero.kind!=='Known')throw Error('known');expect(zero.strength).toEqual(q(0));expect(zero.samples).toHaveLength(2);
});
it('is invariant to declaration/channel order and hidden changes within the same bins',()=>{
 const baseline=produce(view(21),O,definitions);expect(produce(view(29),O,[...definitions].reverse().map(d=>({...d,channels:[...d.channels].reverse()})))).toEqual(baseline);
});
it('rejects forged/reused capability, foreign observer and cross-signal channel claims',()=>{
 expect(()=>produce({kind:'SignalSelectedView'} as SignalSelectedView,O,definitions)).toThrow();const v=view();produce(v,O,definitions);expect(()=>produce(v,O,definitions)).toThrow();
 expect(()=>produce(view(),id(1000,'observer/other'),definitions)).toThrow('OBSERVER');
 expect(()=>produce(view(),O,[{...definitions[0],signal:'interoceptive-signal/B'}])).toThrow('SIGNAL');
});
it('rejects duplicate declaration/channel identities and invalid criterion before consuming selection',()=>{
 const v=view();expect(()=>produce(v,O,[definitions[0],definitions[0]])).toThrow('DECLARATION');
 expect(()=>produce(v,O,[{...definitions[0],channels:['channel/a','channel/a']}])).toThrow('DECLARATION');
 expect(()=>produce(v,O,[{...definitions[0],threshold:q(0)}])).toThrow('DECLARATION');expect(produce(v,O,definitions).assessments).toHaveLength(3);
});
it('keeps returned evidence detached across duplicate descriptions',()=>{
 const a=definitions[0],out=produce(view(),O,[a,{...a,id:'duplicate'}]),first=out.assessments[0],second=out.assessments[1];if(first.kind!=='Known'||second.kind!=='Known')throw Error('known');
 expect(enc(first.samples[0])).toEqual(enc(second.samples[0]));expect(first.samples[0]).not.toBe(second.samples[0]);expect(first.basis).not.toBe(second.basis);
});
