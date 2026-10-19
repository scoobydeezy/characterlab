import {it,expect} from 'vitest';
import {LongHabitWorkbenchRun} from '../workbench/longHabitAdapter';
import {describeLongHabitPracticeRecall} from '../workbench/longHabitRecallDescription';
const recall=(s:ReturnType<LongHabitWorkbenchRun['snapshot']>)=>s.state.memory.flatMap(a=>a.units.filter(u=>u.key==='practice').flatMap(u=>u.views));
it('describes retained evidence and does not reconstruct lost practice from preserved history',async()=>{
 const a=await LongHabitWorkbenchRun.create(0),b=await LongHabitWorkbenchRun.create(96);
 for(let n=0;n<7;n++){await a.advance();await b.advance();}
 const views=recall(a.snapshot()),before=structuredClone(views),report=await describeLongHabitPracticeRecall(views);expect(report.count).toBe(6);expect(report.records.map(r=>r.at)).toEqual(['2','3','4','5','6','7']);expect(report.records.every(r=>r.reward)).toBe(true);expect(views).toEqual(before);expect(await describeLongHabitPracticeRecall(views)).toEqual(report);
 await a.advance();await b.advance();expect(a.snapshot().state.history).toBe(b.snapshot().state.history);expect((await describeLongHabitPracticeRecall(recall(a.snapshot()))).status).toBe('NO_RETAINED_PRACTICE_EVIDENCE');expect((await describeLongHabitPracticeRecall(recall(b.snapshot()))).count).toBe(6);
 for(let n=8;n<14;n++)await a.advance();const later=await describeLongHabitPracticeRecall(recall(a.snapshot()));expect(later.records.map(r=>r.at)).toEqual(['16','18','19']);expect(later.records.map(r=>r.reward)).toEqual([false,true,true]);expect(later.records.every(r=>r.authority==='retained-component-practice-evidence')).toBe(true);
},120000);
it('rejects malformed bytes, duplicates and unrelated context evidence',async()=>{
 const run=await LongHabitWorkbenchRun.create(96);for(let n=0;n<8;n++)await run.advance();const state=run.snapshot(),views=recall(state);
 await expect(describeLongHabitPracticeRecall([[256]])).rejects.toThrow('bytes');await expect(describeLongHabitPracticeRecall([[1.5]])).rejects.toThrow('bytes');await expect(describeLongHabitPracticeRecall([views[0],views[0]])).rejects.toThrow('Duplicate');
 const context=state.state.memory.flatMap(a=>a.units).find(u=>u.key==='context')!;await expect(describeLongHabitPracticeRecall(context.views)).rejects.toThrow();
 expect((await describeLongHabitPracticeRecall([])).text).toBe('Current component recall contains no retained practice evidence.');
},120000);
