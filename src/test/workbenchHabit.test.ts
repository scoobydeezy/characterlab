import {it,expect} from 'vitest';
import {HabitWorkbenchRun,HABIT_PROGRAMS} from '../workbench/habitAdapter';
import history from '../../docs/planning/HABIT_PUBLIC_EXPERIMENT_REV1.json';
it('authenticates exact habit history checkpoints and original prefix continuation',async()=>{
 expect(HABIT_PROGRAMS).toHaveLength(23);const a=await HabitWorkbenchRun.create(),old=history.results.find(r=>r.name===a.snapshot().program)!;expect(a.snapshot().saveHash).toBe(old.prefixes[0]);const pending=a.advance();await expect(a.advance()).rejects.toThrow('in flight');await pending;const cp=a.checkpoint(),before=a.snapshot(),b=await HabitWorkbenchRun.restore(cp);expect(b.snapshot()).toEqual(before);const detached=a.snapshot();detached.fields.length=0;expect(a.snapshot()).toEqual(before);await a.advance();await b.advance();expect(b.snapshot()).toEqual(a.snapshot());expect(a.snapshot().saveHash).toBe(old.prefixes[2]);await expect(HabitWorkbenchRun.restore({...cp,prefix:0})).rejects.toThrow('prefix mismatch');await expect(HabitWorkbenchRun.restore({...cp,saveHash:'0'.repeat(64)})).rejects.toThrow('digest');await expect(HabitWorkbenchRun.create('invented')).rejects.toThrow('Unknown');
},600000);
