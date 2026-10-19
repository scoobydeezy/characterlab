import {it,expect} from 'vitest';
import {LONG_HABIT_CASES,LongHabitWorkbenchRun} from '../workbench/longHabitAdapter';
import {LONG_HABIT_COMPARISONS,compareLongHabitSnapshots} from '../workbench/longHabitComparison';

it('declares every original case and changes exactly one named factor with matched seeds',()=>{
 expect(LONG_HABIT_COMPARISONS).toHaveLength(2848);expect(new Set(LONG_HABIT_COMPARISONS.map(p=>p.id)).size).toBe(2848);
 const covered=new Set<number>(),counts:Record<string,number>={};
 for(const spec of LONG_HABIT_COMPARISONS){
  covered.add(spec.control);covered.add(spec.candidate);counts[spec.factor]=(counts[spec.factor]??0)+1;
  const a=LONG_HABIT_CASES[spec.control],b=LONG_HABIT_CASES[spec.candidate];expect(a.seed).toBe(b.seed);
  expect((['law','keepEpisodes','relearning','alternateCue','visible'] as const).filter(k=>a[k]!==b[k])).toEqual([spec.factor]);
 }
 expect(covered.size).toBe(960);expect(counts).toEqual({law:768,keepEpisodes:480,relearning:640,alternateCue:480,visible:480});
});

it('keeps equal law behavior and unequal memory/outcome controls distinct through actual receiver execution',async()=>{
 const base=await LongHabitWorkbenchRun.create(0);for(let n=0;n<16;n++)await base.advance();
 for(const factor of ['law','keepEpisodes','relearning','alternateCue','visible'] as const){
  const spec=LONG_HABIT_COMPARISONS.find(p=>p.control===0&&p.factor===factor)!,other=await LongHabitWorkbenchRun.create(spec.candidate);
  for(let n=0;n<16;n++)await other.advance();
  const before=[base.checkpoint(),other.checkpoint()],report=await compareLongHabitSnapshots(spec.id,base.snapshot(),other.snapshot());
  expect(report.status).toBe('ALIGNED_RECEIVER_PREFIX');if(report.status!=='ALIGNED_RECEIVER_PREFIX')throw Error('alignment');
  expect(report.identity.sourceRunEqual).toBe(true);expect(report.identity.reusedNativeSaveEqual).toBe(true);expect(report.identity.runEqual).toBe(false);expect(report.rng.correspondence).toBe('NOT_INFERRED_FROM_SEED');
  const equal=(name:string)=>report.fields.find(f=>f.name===name)?.equal;
  if(factor==='law')expect(report.fields.every(f=>f.equal)).toBe(true);
  if(factor==='keepEpisodes'){expect(equal('memory')).toBe(false);expect(equal('episodeLoss')).toBe(false);expect(equal('history')).toBe(true);expect(equal('performance')).toBe(true);}
  if(factor==='relearning'||factor==='visible')expect(equal('observations')).toBe(false);
  if(factor==='alternateCue')expect(equal('cues')).toBe(false);
  expect(await compareLongHabitSnapshots(spec.id,base.snapshot(),other.snapshot())).toEqual(report);expect([base.checkpoint(),other.checkpoint()]).toEqual(before);
 }
},120000);

it('withholds alignment and rejects wrong cases, source commitments, identities and clocks',async()=>{
 const spec=LONG_HABIT_COMPARISONS[0],a=await LongHabitWorkbenchRun.create(spec.control),b=await LongHabitWorkbenchRun.create(spec.candidate);
 await a.advance();const unaligned=await compareLongHabitSnapshots(spec.id,a.snapshot(),b.snapshot());expect(unaligned.status).toBe('UNALIGNED_PREFIXES');expect('fields'in unaligned).toBe(false);await b.advance();
 await expect(compareLongHabitSnapshots(spec.id,b.snapshot(),a.snapshot())).rejects.toThrow(/case mismatch/);
 const source=a.snapshot();source.reusedNativeSaveHash='0'.repeat(64);await expect(compareLongHabitSnapshots(spec.id,source,b.snapshot())).rejects.toThrow(/source provenance/);
 const identity=a.snapshot();identity.runHash='0'.repeat(64);await expect(compareLongHabitSnapshots(spec.id,identity,b.snapshot())).rejects.toThrow(/identity/);
 const clock=a.snapshot();clock.state.rows[0].at=99;await expect(compareLongHabitSnapshots(spec.id,clock,b.snapshot())).rejects.toThrow(/clock/);
});
