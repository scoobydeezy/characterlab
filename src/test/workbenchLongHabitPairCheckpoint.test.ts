import {it,expect} from 'vitest';
import {LongHabitWorkbenchRun} from '../workbench/longHabitAdapter';
import {LONG_HABIT_COMPARISONS,compareLongHabitSnapshots} from '../workbench/longHabitComparison';
import {captureLongHabitPair,restoreLongHabitPair} from '../workbench/longHabitPairCheckpoint';
it('restores a retained/lost practice pair atomically and preserves the current pair on candidate failure',async()=>{
 const spec=LONG_HABIT_COMPARISONS.find(p=>p.control===0&&p.factor==='keepEpisodes')!,a=await LongHabitWorkbenchRun.create(spec.control),b=await LongHabitWorkbenchRun.create(spec.candidate);
 for(let n=0;n<8;n++){await a.advance();await b.advance();}
 const saved=await captureLongHabitPair(spec.id,[a,b]),before=await compareLongHabitSnapshots(spec.id,a.snapshot(),b.snapshot());
 const pair=await restoreLongHabitPair(saved,LongHabitWorkbenchRun.restore,()=>{});expect(await compareLongHabitSnapshots(spec.id,pair[0].snapshot(),pair[1].snapshot())).toEqual(before);
 await pair[0].advance();await pair[1].advance();expect([a.checkpoint(),b.checkpoint()]).toEqual([saved.control,saved.candidate]);
 let calls=0;await expect(restoreLongHabitPair({...saved,candidate:{...saved.candidate,prefix:7}},async c=>{calls++;return c;},()=>{})).rejects.toThrow('prefix');expect(calls).toBe(0);
 await expect(restoreLongHabitPair({...saved,comparison:LONG_HABIT_COMPARISONS[0].id},LongHabitWorkbenchRun.restore,()=>{})).rejects.toThrow('declaration');
 const disposed:unknown[]=[];await expect(restoreLongHabitPair({...saved,candidate:{...saved.candidate,pairHash:'0'.repeat(64)}},LongHabitWorkbenchRun.restore,r=>disposed.push(r))).rejects.toThrow('commitment');expect(disposed).toHaveLength(1);
 expect([a.checkpoint(),b.checkpoint()]).toEqual([saved.control,saved.candidate]);saved.control.saveHex='bad';expect(a.checkpoint().saveHex).not.toBe('bad');
},120000);
