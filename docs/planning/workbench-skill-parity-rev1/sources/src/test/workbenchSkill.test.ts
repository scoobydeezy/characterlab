import {it,expect} from 'vitest';
import {SkillWorkbenchRun,SKILL_PROGRAMS} from '../workbench/skillAdapter';
import history from '../../docs/planning/SKILL_PUBLIC_EXPERIMENT_REV1.json';
it('authenticates native skill checkpoint, preserves detached reads and continues exact history',async()=>{
 expect(SKILL_PROGRAMS).toHaveLength(52);const a=await SkillWorkbenchRun.create(),old=history.results.find(r=>r.name===a.snapshot().program)!;expect(a.snapshot().saveHash).toBe(old.prefixSaveSha256[0]);
 const pending=a.advance();await expect(a.advance()).rejects.toThrow('in flight');await pending;const c=a.checkpoint(),before=a.snapshot();const b=await SkillWorkbenchRun.restore(c);expect(b.snapshot()).toEqual(before);const detached=a.snapshot();detached.fields.length=0;expect(a.snapshot()).toEqual(before);
 while(await a.advance()){await b.advance();expect(b.snapshot()).toEqual(a.snapshot());expect(a.snapshot().saveHash).toBe(old.prefixSaveSha256[a.snapshot().prefix]);}expect(await b.advance()).toBe(false);expect(a.snapshot().saveHash).toBe(old.finalSaveSha256);expect(a.snapshot().fields.some(f=>f.root==='785')).toBe(true);
 await expect(SkillWorkbenchRun.restore({...c,prefix:0})).rejects.toThrow('prefix mismatch');await expect(SkillWorkbenchRun.restore({...c,saveHash:'0'.repeat(64)})).rejects.toThrow('digest');await expect(SkillWorkbenchRun.create('invented')).rejects.toThrow('Unknown');
},600000);
