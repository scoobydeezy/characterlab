import {it,expect,vi} from 'vitest';
import {createLongitudinalHabitRun as create,restoreLongitudinalHabitRun as restore} from '../campaign3/longitudinalHabitJoin';
import type {HabitProfile} from '../campaign3/longitudinalHabit';
vi.setConfig({testTimeout:300000});
const profile:HabitProfile={law:'Derived',seed:0,alternateCue:false,visible:true,keepEpisodes:false,relearning:'Observed'};
it('native standing feeds the same actor while practice episodes have their own loss and history survives',async()=>{
 const r=await create(profile);for(let i=0;i<7;i++)await r.step();expect(r.recallPractice()).toHaveLength(6);const history=r.snapshot().history;await r.step();expect(r.recallPractice()).toHaveLength(0);expect(r.snapshot().history).toBe(history);await r.step();expect(r.snapshot().rows[8]).toMatchObject({standing:'-100733/600733',strength:'63/64',available:true,performed:false,practiceBefore:0});
});
it('all joined publications and overlap reject in flight; each fault restores native plus component state',async()=>{
 const r=await create(profile);await r.step();const before=r.save(),source=r.nativeSave();for(const fault of ['after-source','after-choice','before-commit'] as const){const pending=r.step(fault);for(const read of [r.save,r.nativeSave,r.sourceView,r.snapshot,r.recallPractice])expect(read).toThrow('LH_JOIN_BUSY');await expect(r.step()).rejects.toThrow('LH_JOIN_CONCURRENT');await expect(pending).rejects.toThrow('LH_INJECTED');expect(r.save()).toEqual(before);expect(r.nativeSave()).toEqual(source);}
 const s=await restore(profile,1,before);await s.step();await r.step();expect(s.save()).toEqual(r.save());await expect(restore({...profile,keepEpisodes:true},1,before)).rejects.toThrow('LH_SAVE_MISMATCH');
});
