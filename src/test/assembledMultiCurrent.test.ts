import {it,expect} from 'vitest';
import {start,unused,rec,f,uint,items,key,decode,outputs,text,list,signed,q,u,type CanonicalValue} from './fixtures/assembledMultiCurrent';
import {capture,through} from './assembledMultiReceipts.test';
import {rows,compare,descriptionDice,originalCorrespondence} from './fixtures/assembledMultiComparison';
import {PERFORMANCE_OBS} from '../assembled/performance';
import {RECEIPT_REASONS} from '../assembled/receiptReasonSources';
import {sid} from '../assembled/skill';
import {readQ,ZERO} from '../campaign2/cognitiveMath';
import {cognitiveRecord} from '../assembled/codecs';
const r403=(raw:CanonicalValue)=>cognitiveRecord(403,Array.from({length:6},(_,i)=>f(rec(raw,403n),BigInt(i+1))),3);
it('multi223 primary: genuine families cite acquired shared or independent receipts and reach native decision/action',async()=>{
 const results=[];
 for(const mode of ['first','last','collective','duplicate'] as const){const x=await start(mode);await through(x.r,8n);const p=capture(x.r,x.b);results.push({x,p});
  expect(items(f(p.raw,7n),'list')).toHaveLength(0);expect(items(f(rec(f(p.raw,2n),398n),3n),'list').some(v=>key(f(rec(f(rec(v,397n),1n),395n),2n))===key(unused))).toBe(false);const observations=p.tag(PERFORMANCE_OBS);expect(observations).toHaveLength(2);expect(observations.map(v=>[v[2],v[6]])).toEqual([[u(4),true],[u(6),true]]);
  const value=rows(p.raw).filter(r=>r.family===key(sid(1040,'Value')));expect(value).toHaveLength(1);expect(value[0].strength.compare(ZERO)).toBe(1);expect(value[0].basis.size).toBe(1);
  const receipts=p.produced.flatMap(v=>items(items(v,'list')[2],'list'));for(const receipt of receipts)expect(observations.map(list)).toContainEqual(receipt);
  const first=rows(p.raw).find(r=>key(r.d[0])===key(text('receiptFirst')))!;expect(first).toBeDefined();expect(first.ground).not.toBe(value[0].ground);expect(first.candidate).toEqual(value[0].candidate);
  expect([...first.basis.keys()].some(k=>value[0].basis.has(k))).toBe(mode==='last');
  expect(p.ns.some(n=>key(f(rec(f(rec(n,407n),1n),404n),2n))===key(sid(1040,'Value')))).toBe(true);
  const trace=outputs(p.s.trace,160n).find(t=>key(f(t,6n))===key(text(RECEIPT_REASONS))&&key(f(t,13n))===key(r403(p.raw)))!;expect(trace).toBeDefined();expect(items(f(trace,11n),'list')).toHaveLength(1);expect(items(f(trace,12n),'list')).toContainEqual(list(p.report));
  const coverage=items(items(p.compiled.report,'list')[1],'list').flatMap(v=>items(items(v,'list')[3],'list').map(v=>items(v,'list')));
  if(mode==='collective'||mode==='duplicate'){const row=coverage.find(v=>key(items(v[0],'list')[0])===key(text(mode==='collective'?'receiptUnion':'receiptDuplicate')))!;expect(row[4]).toEqual(q(1,1));expect(row[6]).toEqual(q(0,1));}
  originalCorrespondence(p.raw,x.b.s);
  const alternatives=['GroundAggregate','GroundPairwise','GroundUncovered','FamilyNormalized'].map(law=>{const a=compare(p.raw,x.b.s,law as Parameters<typeof compare>[2]);return [law,a.analysis.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),a.witnesses.filter(w=>key(w.row.d[0])===key(text('receiptUnion'))).map(w=>w.effective.numerator+'/'+w.effective.denominator)];});
  const dice=descriptionDice(p.raw,x.b.s);console.info('M223 '+mode, 'reference',p.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),'alternatives',alternatives,'descriptionDice',dice.count,dice.analysis.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator));
 }
 const [first,last,collective,duplicate]=results;expect(last.p.probabilities).toEqual(first.p.probabilities);expect(duplicate.p.probabilities).toEqual(first.p.probabilities);
 const norm=(x:typeof first)=>compare(x.p.raw,x.x.b.s,'FamilyNormalized').witnesses.find(w=>key(w.row.d[0])===key(text('receiptFirst')))!.normalization;
 expect(norm(first)).toEqual(readQ(q(1,1)));expect(norm(last)).toEqual(readQ(q(1,2)));
 const unions=(law:Parameters<typeof compare>[2])=>compare(collective.p.raw,collective.x.b.s,law).witnesses.find(w=>key(w.row.d[0])===key(text('receiptUnion')))!.effective;
 expect(unions('GroundPairwise').compare(ZERO)).toBe(1);expect(unions('GroundUncovered').compare(ZERO)).toBe(1);
 console.info('M223 PRIMARY PASS two genuine producers; actual source/decision/action; independent/shared coverage; collective and duplicate zero; all complete-input alternatives');
},590000);
