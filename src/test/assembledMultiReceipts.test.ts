import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {compileDescribedReasons,REASON_SOURCE_REPORT} from '../assembled/reasons';
import {readQ,ZERO} from '../campaign2/cognitiveMath';
import {RECEIPT_REASONS} from '../assembled/receiptReasonSources';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {PERFORMANCE_OBS} from '../assembled/performance';
import {VALUE_MOTIVE_PROVENANCE} from '../assembled/valueReceiving';
import {sid} from '../assembled/skill';
import {fixture,rec,f,uint,items,key,decode,outputs,text,list,signed,q,u,type CanonicalValue,type Mode} from './fixtures/assembledMultiReceipts';
import {definition,rows,compare,analyze,descriptionDice,originalCorrespondence} from './fixtures/assembledMultiComparison';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
export async function through(r:Run,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
export async function start(mode:Mode='collective',permission=true,truth=true,linked=true){const b=fixture(mode,permission,truth,linked),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
export function capture(r:Run,b:ReturnType<typeof fixture>,at=8n){
 const s=r.snapshot(),o=items(decode(s.outputs),'list'),tag=(t:string)=>o.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(t))).map(v=>items(v,'list'));
 const d=outputs(s.outputs,409n).find(v=>key(f(v,2n))===key(signed(at)))!,status=rec(f(d,4n),419n);expect(uint(f(status,1n)),'live decision').toBe(3n);
 const atTraces=outputs(s.trace,160n).filter(t=>key(f(rec(f(t,4n),130n),2n))===key(signed(at))),joint=atTraces.flatMap(t=>{const v=f(t,13n);return typeof v!=='boolean'&&v.kind==='list'?[...v.items]:[];}).find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(JOINT_APPRAISAL)));expect(joint,'live appraisal trace at compared instant').toBeDefined();for(const task of[b.taskA,b.taskB])expect(items(items(joint!,'list')[4],'list').map(v=>items(v,'list')).find(r=>key(r[0])===key(task)),'compared task appraisal live before behavioral comparison').toHaveLength(5);
 const context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=items(f(context,3n),'list'),data=rec(f(status,2n),420n),compiled=compileDescribedReasons(raw,definition(b.s),3,'SourceCoverage',true,true);
 expect(ns).toEqual(compiled.nuclei);const report=tag(RECEIPT_REASONS).find(v=>key(v[1])===key(signed(at)))!;expect(report).toBeDefined();
 expect(outputs(s.outputs,433n).some(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d)),'ordinary decision consumed by actual attempt/outcome').toBe(true);
 const analytical=analyze(raw,ns,b.s),probabilities=items(f(data,2n),'list').map(v=>f(rec(v,421n),2n));expect(analytical.probabilities.map(p=>q(p.probability.numerator,p.probability.denominator))).toEqual(probabilities);
 return {s,tag,d,data,raw,ns,compiled,report,produced:items(report[2],'list'),rejected:items(report[3],'list'),probabilities,analytical};
}
it('primary150: genuine families cite acquired shared or independent receipts and reach native decision/action',async()=>{
 const results=[];
 for(const mode of ['first','last','collective','duplicate'] as const){const x=await start(mode);await through(x.r,8n);const p=capture(x.r,x.b);results.push({x,p});
  const observations=p.tag(PERFORMANCE_OBS);expect(observations).toHaveLength(2);expect(observations.map(v=>[v[2],v[6]])).toEqual([[u(4),true],[u(6),true]]);
  const value=rows(p.raw).filter(r=>r.family===key(sid(1040,'Value')));expect(value).toHaveLength(1);expect(value[0].strength.compare(ZERO)).toBe(1);expect(value[0].basis.size).toBe(1);
  const receipts=p.produced.flatMap(v=>items(items(v,'list')[2],'list'));for(const receipt of receipts)expect(observations.map(list)).toContainEqual(receipt);
  const first=rows(p.raw).find(r=>key(r.d[0])===key(text('receiptFirst')))!;expect(first).toBeDefined();expect(first.ground).not.toBe(value[0].ground);expect(first.candidate).toEqual(value[0].candidate);
  expect([...first.basis.keys()].some(k=>value[0].basis.has(k))).toBe(mode==='last');
  expect(p.ns.some(n=>key(f(rec(f(rec(n,407n),1n),404n),2n))===key(sid(1040,'Value')))).toBe(true);
  const trace=outputs(p.s.trace,160n).find(t=>key(f(t,6n))===key(text(RECEIPT_REASONS))&&key(f(t,13n))===key(p.raw))!;expect(trace).toBeDefined();expect(items(f(trace,11n),'list')).toHaveLength(1);expect(items(f(trace,12n),'list')).toContainEqual(list(p.report));
  const coverage=items(items(p.compiled.report,'list')[1],'list').flatMap(v=>items(items(v,'list')[3],'list').map(v=>items(v,'list')));
  if(mode==='collective'||mode==='duplicate'){const row=coverage.find(v=>key(items(v[0],'list')[0])===key(text(mode==='collective'?'receiptUnion':'receiptDuplicate')))!;expect(row[4]).toEqual(q(1,1));expect(row[6]).toEqual(q(0,1));}
  originalCorrespondence(p.raw,x.b.s);
  const alternatives=['GroundAggregate','GroundPairwise','GroundUncovered','FamilyNormalized'].map(law=>{const a=compare(p.raw,x.b.s,law as Parameters<typeof compare>[2]);return [law,a.analysis.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),a.witnesses.filter(w=>key(w.row.d[0])===key(text('receiptUnion'))).map(w=>w.effective.numerator+'/'+w.effective.denominator)];});
  const dice=descriptionDice(p.raw,x.b.s);console.info('M150 '+mode, 'reference',p.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),'alternatives',alternatives,'descriptionDice',dice.count,dice.analysis.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator));
 }
 const [first,last,collective,duplicate]=results;expect(last.p.probabilities).toEqual(first.p.probabilities);expect(duplicate.p.probabilities).toEqual(first.p.probabilities);
 const norm=(x:typeof first)=>compare(x.p.raw,x.x.b.s,'FamilyNormalized').witnesses.find(w=>key(w.row.d[0])===key(text('receiptFirst')))!.normalization;
 expect(norm(first)).toEqual(readQ(q(1,1)));expect(norm(last)).toEqual(readQ(q(1,2)));
 const unions=(law:Parameters<typeof compare>[2])=>compare(collective.p.raw,collective.x.b.s,law).witnesses.find(w=>key(w.row.d[0])===key(text('receiptUnion')))!.effective;
 expect(unions('GroundPairwise').compare(ZERO)).toBe(1);expect(unions('GroundUncovered').compare(ZERO)).toBe(1);
 console.info('M150 PRIMARY PASS two genuine producers; actual source/decision/action; independent/shared coverage; collective and duplicate zero; all complete-input alternatives');
},590000);
