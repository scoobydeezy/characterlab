import {it,expect} from 'vitest';
import {LongWorkbenchRun} from '../workbench/longAdapter';
import {compareLongSnapshots,LONG_COMPARISONS} from '../workbench/longComparison';
it('separates learned equality from retained detail, rejects forged identity, and leaves active runs unchanged',async()=>{
 const a=await LongWorkbenchRun.create('representation-1-law-1'),b=await LongWorkbenchRun.create('representation-2-law-1');
 for(let i=0;i<4;i++){await a.advance();await b.advance();}
 const before=[a.checkpoint(),b.checkpoint()],report=await compareLongSnapshots('detail:1',a.snapshot(),b.snapshot());expect(report.status).toBe('ALIGNED_COMMITTED_CLOCK');if(report.status!=='ALIGNED_COMMITTED_CLOCK')throw Error('Wrong alignment');expect(report.learnedEqual).toBe(true);expect(report.fields.find(f=>f.name==='relationshipDetail')?.equal).toBe(false);expect(report.identity.observerEqual).toBe(false);expect(report.rng.correspondence).toBe('NOT_INFERRED_FROM_SEED');expect(await compareLongSnapshots('detail:1',a.snapshot(),b.snapshot())).toEqual(report);expect([a.checkpoint(),b.checkpoint()]).toEqual(before);
 await expect(compareLongSnapshots('detail:1',a.snapshot(),{...b.snapshot(),runHash:'bad'})).rejects.toThrow('identity');await expect(compareLongSnapshots('detail:1',a.snapshot(),{...b.snapshot(),observerHash:'bad'})).rejects.toThrow('digest');
 await b.advance();expect((await compareLongSnapshots('detail:1',a.snapshot(),b.snapshot())).status).toBe('UNALIGNED_CLOCKS');expect(new Set(LONG_COMPARISONS.map(s=>s.id)).size).toBe(LONG_COMPARISONS.length);
},600000);
