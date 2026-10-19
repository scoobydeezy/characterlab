import {it,expect} from 'vitest';
import {LongRoutineWorkbenchRun} from '../workbench/longRoutineAdapter';
import {LONG_ROUTINE_COMPARISONS,compareLongRoutineSnapshots} from '../workbench/longRoutineComparison';
import {captureLongRoutinePair,restoreLongRoutinePair} from '../workbench/longRoutinePairCheckpoint';
it('restores a native retention comparison pair atomically and preserves the current pair on candidate failure',async()=>{
 const spec=LONG_ROUTINE_COMPARISONS.find(p=>p.control===0&&p.factor==='keepEpisodes')!,a=await LongRoutineWorkbenchRun.create(spec.control),b=await LongRoutineWorkbenchRun.create(spec.candidate);
 for(let n=0;n<8;n++){await a.advance();await b.advance();}
 const saved=await captureLongRoutinePair(spec.id,[a,b]),before=await compareLongRoutineSnapshots(spec.id,a.snapshot(),b.snapshot());
 const pair=await restoreLongRoutinePair(saved,LongRoutineWorkbenchRun.restore,()=>{});expect(await compareLongRoutineSnapshots(spec.id,pair[0].snapshot(),pair[1].snapshot())).toEqual(before);
 await pair[0].advance();await pair[1].advance();expect([a.checkpoint(),b.checkpoint()]).toEqual([saved.control,saved.candidate]);
 let calls=0;await expect(restoreLongRoutinePair({...saved,candidate:{...saved.candidate,prefix:7}},async c=>{calls++;return c;},()=>{})).rejects.toThrow('prefix');expect(calls).toBe(0);
 await expect(restoreLongRoutinePair({...saved,comparison:LONG_ROUTINE_COMPARISONS[0].id},LongRoutineWorkbenchRun.restore,()=>{})).rejects.toThrow('declaration');
 const disposed:unknown[]=[];await expect(restoreLongRoutinePair({...saved,candidate:{...saved.candidate,pairHash:'0'.repeat(64)}},LongRoutineWorkbenchRun.restore,r=>disposed.push(r))).rejects.toThrow('commitment');expect(disposed).toHaveLength(1);
 expect([a.checkpoint(),b.checkpoint()]).toEqual([saved.control,saved.candidate]);saved.control.saveHex='bad';expect(a.checkpoint().saveHex).not.toBe('bad');
},120000);
