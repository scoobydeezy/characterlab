import {describe,it,expect} from 'vitest';
import original from '../../docs/planning/longitudinal-habit-execution-rev2/000.json';
import {LongHabitWorkbenchRun,LONG_HABIT_CASES} from '../workbench/longHabitAdapter';
import {digest,fromHex} from '../workbench/canonical';

describe('LONG habit source-reuse workbench',()=>{
 it('preserves original receiver bytes and source commitments through pressure and relearning',async()=>{
  const run=await LongHabitWorkbenchRun.create(0);expect(run.snapshot().runHash).toBe(await digest(fromHex(original.runIdentity)));
  for(let prefix=0;prefix<=16;prefix++){
   const view=run.snapshot();expect(view.prefix).toBe(prefix);expect(view.saveHash).toBe(original.prefixes[prefix].saveHash);expect(view.pairHash).toBe(original.prefixes[prefix].pairHash);expect(view.boundary).toBe('component-receiver-with-reused-native-source');
   if(prefix===8||prefix===14||prefix===16){const restored=await LongHabitWorkbenchRun.restore(run.checkpoint());expect(restored.snapshot()).toEqual(view);expect(await restored.advance()).toBe(prefix<16);expect(restored.snapshot().saveHash).toBe(original.prefixes[Math.min(prefix+1,16)].saveHash);}
   if(prefix<16)expect(await run.advance()).toBe(true);
  }
  expect(run.snapshot().state).toEqual(original.state);expect(await run.advance()).toBe(false);
 },120000);
 it('rejects altered checkpoints and keeps snapshots detached',async()=>{
  const run=await LongHabitWorkbenchRun.create(0),c=run.checkpoint(),view=run.snapshot();view.profile.seed=7;view.state.prefix=9;expect(run.snapshot().prefix).toBe(0);expect(run.snapshot().profile.seed).toBe(0);
  await expect(LongHabitWorkbenchRun.restore({...c,index:1})).rejects.toThrow(/identity/);
  await expect(LongHabitWorkbenchRun.restore({...c,prefix:1})).rejects.toThrow(/SAVE_MISMATCH/);
  await expect(LongHabitWorkbenchRun.restore({...c,pairHash:'0'.repeat(64)})).rejects.toThrow(/commitment/);
  await expect(LongHabitWorkbenchRun.restore({...c,saveHex:c.saveHex+'00'})).rejects.toThrow(/digest/);
  await expect(LongHabitWorkbenchRun.create(960)).rejects.toThrow(/Unknown/);
  expect(run.checkpoint()).toEqual(c);
 });
 it('uses the same native source for both receiving memory policies',async()=>{
  const index=LONG_HABIT_CASES.findIndex(p=>p.law==='Derived'&&p.keepEpisodes&&p.seed===0&&p.relearning==='Observed'&&!p.alternateCue&&p.visible);
  const a=await LongHabitWorkbenchRun.create(0),b=await LongHabitWorkbenchRun.create(index);
  for(let n=0;n<8;n++){await a.advance();await b.advance();}
  expect(a.snapshot().reusedNativeSaveHash).toBe(b.snapshot().reusedNativeSaveHash);
  expect(a.snapshot().sourceRun).toBe(b.snapshot().sourceRun);
  expect(a.snapshot().state.memory).not.toEqual(b.snapshot().state.memory);
  expect(a.snapshot().runHash).not.toBe(b.snapshot().runHash);
 },120000);
});
