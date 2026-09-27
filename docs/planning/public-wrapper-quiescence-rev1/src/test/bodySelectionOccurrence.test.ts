import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {text,typedIdentifier,canonicalEncode} from '../substrate/canonicalEncoding';
import {createLocalReserveSource} from '../campaign3/localReserveSource';
import {observeLocalReserveOpportunity} from '../campaign3/localReserveObservation';
import {selectBodyOccurrence as select,consumeBodySelection as consume,closeBodySelection as close,type BodySelectionView} from '../campaign3/bodySelectionOccurrence';
const observer=typedIdentifier(1000,text('observer/a')),limits={maxSignals:3,maxViewsPerSignal:3,maxBytesPerSignal:4096,capacity:3};
function source(available=true,multiple=false){const mappings=[['A0','A'],['A1','A'],['B','B'],['C','C']];const body=createLocalReserveSource(['A','B','C'].map(k=>({key:'local-reserve/'+k,capacity:Q.of(100n),rate:Q.of(0n),amount:Q.of(0n),anchoredAt:0n})),mappings.map(([channel,k])=>({channel:'channel/'+channel,physical:'local-reserve/'+k,signal:'interoceptive-signal/'+k,width:Q.of(1n),available,permitted:true})));let n=10n;return observeLocalReserveOpportunity(body,observer,1n,(multiple?['A0','A1','C']:['A0']).map(k=>'channel/'+k),'Current',()=>n++);}
it('BO-A: exactly one1143 and shared view identity for present zero, zero capacity and absence',()=>{
 for(const [available,capacity,count]of [[true,3,1],[true,0,0],[false,3,0]] as const){let allocations=0;const s=source(available),r=select(s,{...limits,capacity},()=>{allocations++;return 90n;}),v=consume(r.view);expect(allocations).toBe(1);expect(r.audit.selection.namespaceId).toBe(1143n);expect(v.selection).toEqual(r.audit.selection);expect(v.selectionId).toBe(90n);expect(v.groups).toHaveLength(count);expect(r.audit.rows[0].disposition).toBe(!available?'Unavailable':capacity?'Selected':'Capacity');}
});
it('BO-B: multiple safe views remain one signal acquisition unit',()=>{const r=select(source(true,true),limits,()=>90n),v=consume(r.view);expect(v.groups.map(g=>[g.signal,g.samples.length])).toEqual([['interoceptive-signal/A',2],['interoceptive-signal/C',1]]);expect(r.audit.rows.map(r=>r.views)).toEqual([2,1]);});
it('BO-C: missing, duplicate, foreign and empty sample/declaration batches reject before allocation',()=>{
 const s=source(true,true);let allocations=0;for(const input of [{...s,samples:s.samples.slice(1)},{...s,samples:[s.samples[0],s.samples[0],s.samples[2]]},{...s,observer:typedIdentifier(1000,text('observer/b'))},{...s,samples:[],declarations:[]}])expect(()=>select(input,limits,()=>BigInt(allocations++))).toThrow();expect(allocations).toBe(0);
});
it('BO-D: audit edits cannot replace consumed data, and forged/reused/closed views reject',()=>{
 const s=source(),r=select(s,limits,()=>90n);r.audit.rows[0].signal='changed';r.audit.selection=typedIdentifier(1143,text('changed'));const v=consume(r.view);expect(v.selectionId).toBe(90n);expect(v.groups[0].signal).toBe('interoceptive-signal/A');expect(canonicalEncode(v.groups[0].samples[0])).toEqual(canonicalEncode(s.samples[0]));expect(()=>consume(r.view)).toThrow();expect(()=>consume({} as BodySelectionView)).toThrow();const c=select(s,limits,()=>91n);close(c.view);expect(()=>consume(c.view)).toThrow();
});
it('BO-E: allocation failure leaves source bytes intact and retry does not inherit a consumed view',()=>{const s=source(),before=s.samples.map(canonicalEncode);expect(()=>select(s,limits,()=>-1n)).toThrow('ALLOCATION');expect(s.samples.map(canonicalEncode)).toEqual(before);expect(consume(select(s,limits,()=>90n).view).groups).toHaveLength(1);});
