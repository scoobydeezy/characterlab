import {it,expect} from 'vitest';
import {LongLossWorkbenchRun,LONG_LOSS_CASES} from '../workbench/longLossAdapter';
import {LONG_LOSS_COMPARISONS,compareLongLossSnapshots} from '../workbench/longLossComparison';
it('declares all original cases with one changed factor and160 evidence-matched controls',()=>{
 expect(LONG_LOSS_COMPARISONS).toHaveLength(904);expect(new Set(LONG_LOSS_COMPARISONS.map(s=>s.id)).size).toBe(904);expect(LONG_LOSS_COMPARISONS.filter(s=>s.evidenceMatched)).toHaveLength(160);const covered=new Set<number>();
 for(const s of LONG_LOSS_COMPARISONS){const a=LONG_LOSS_CASES[s.control],b=LONG_LOSS_CASES[s.candidate];expect(a.seed).toBe(b.seed);expect((['law','condition'] as const).filter(k=>a[k]!==b[k])).toEqual([s.factor]);covered.add(s.control);covered.add(s.candidate);}expect(covered.size).toBe(480);
});
it('retains matched cognition and different execution without mutating either run',async()=>{
 const spec=LONG_LOSS_COMPARISONS.find(s=>s.id==='matched:Latest:HiddenLoss:NoLoss:0')!,a=await LongLossWorkbenchRun.create(spec.control),b=await LongLossWorkbenchRun.create(spec.candidate);
 await a.advance();expect((await compareLongLossSnapshots(spec.id,a.snapshot(),b.snapshot())).status).toBe('UNALIGNED_PREFIXES');await b.advance();for(let i=1;i<12;i++){await a.advance();await b.advance();}
 const before=[a.checkpoint(),b.checkpoint()],report=await compareLongLossSnapshots(spec.id,a.snapshot(),b.snapshot());expect(report.status).toBe('ALIGNED_COMPONENT_PREFIX');if(report.status!=='ALIGNED_COMPONENT_PREFIX')throw Error('alignment');expect(report.fields.filter(f=>f.authority==='character-side-state-or-decision-diagnostic').every(f=>f.equal)).toBe(true);expect(report.fields.find(f=>f.name==='physicalContact')?.equal).toBe(false);expect(report.rng.controlDraws).toEqual(report.rng.candidateDraws);expect(report.rng.correspondence).toBe('NOT_INFERRED_FROM_SEED');expect(await compareLongLossSnapshots(spec.id,a.snapshot(),b.snapshot())).toEqual(report);expect([a.checkpoint(),b.checkpoint()]).toEqual(before);
 const bad=a.snapshot();bad.state.rows[0].at=99;await expect(compareLongLossSnapshots(spec.id,bad,b.snapshot())).rejects.toThrow(/clock/);await expect(compareLongLossSnapshots(spec.id,b.snapshot(),a.snapshot())).rejects.toThrow(/case/);
},120000);
